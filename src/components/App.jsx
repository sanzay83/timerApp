import React, { useState, useEffect, useRef } from "react";
import "./App.scss";
import chimeSound from "./chime.wav";
import deleteIcon from "./delete.png";

function App() {
  const [isDark, setIsDark] = useState(false);
  const [items, setItems] = useState([]);
  const [activity, setActivity] = useState("");
  const [timeMin, setTimeMin] = useState("");
  const [timeSec, setTimeSec] = useState("");
  const [currentItem, setCurrentItem] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const chimeRef = useRef(null);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!timeMin && !timeSec) return;
    setItems([
      ...items,
      {
        activity: `${activity ? activity : "Default"}`,
        timeMin: parseInt(timeMin) || 0,
        timeSec: parseInt(timeSec) || 0,
        completed: false,
      },
    ]);
    setActivity("");
    setTimeMin("");
    setTimeSec("");
    setShowCongrats(false);
  };

  const handleDelete = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
    if (currentItem === index) {
      setCurrentItem(null);
      setCountdown(null);
    } else if (currentItem > index) {
      setCurrentItem((prev) => prev - 1);
    }
  };

  const handleStart = () => {
    if (items.length > 0) {
      setCurrentItem(0);
      setShowCongrats(false);
    }
  };

  const handleStop = () => {
    setCurrentItem(null);
    setCountdown(null);
  };

  const handlePause = () => {
    setIsPause(!isPause);
  };

  useEffect(() => {
    let timer;
    if (currentItem !== null && items[currentItem]) {
      const totalTime =
        items[currentItem].timeMin * 60 + items[currentItem].timeSec;
      setCountdown(totalTime);
    }
    return () => clearInterval(timer);
  }, [currentItem, items]);

  useEffect(() => {
    let timer;
    if (!isPause) {
      if (countdown !== null) {
        timer = setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown > 0) {
              return prevCountdown - 1;
            } else {
              clearInterval(timer);
              if (currentItem !== null) {
                markActivityCompleted(currentItem);
                chimeRef.current.play();
                if (currentItem < items.length - 1) {
                  setCurrentItem((prevItem) => prevItem + 1);
                } else {
                  setCurrentItem(null);
                  setShowCongrats(true);
                }
              }
              return null;
            }
          });
        }, 1000);
      }
    }
    return () => clearInterval(timer);
  }, [isPause, countdown, currentItem, items]);

  const markActivityCompleted = (index) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, completed: true } : item
      )
    );
  };

  const handleButtonDark = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`app ${isDark ? "" : "light"}`}>
      <div className="container-title">
        <h1>TIMER APP</h1>
        <div
          className={`dark-mode-button `}
          onClick={() => {
            handleButtonDark();
          }}
        >
          <div className={`${isDark ? "on" : "off"}`} />
        </div>
      </div>
      <div className={`item-container ${isDark ? "" : "light-container"} `}>
        <div className="each-item">
          <div className="left">ACTIVITY</div>
          <div className="right">TIME</div>
        </div>
        {items.map((item, index) => (
          <div
            className={`each-item ${item.completed ? "completed" : ""}`}
            key={index}
          >
            <div className="left">{item.activity}</div>
            <div className="right">
              {currentItem === index && countdown !== null
                ? `${Math.floor(countdown / 60)}:${String(
                    countdown % 60
                  ).padStart(2, "0")}`
                : `${item.timeMin}:${String(item.timeSec).padStart(2, "0")}`}
              <button
                className="delete-button"
                onClick={() => handleDelete(index)}
              >
                <img height="20rem" src={deleteIcon} alt="deleteIcon" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleAdd}>
        <div className="add-item-section">
          <input
            type="text"
            id="activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder="Activity"
          />
          <div className="time-container">
            <input
              type="number"
              id="timeMinute"
              value={timeMin}
              onChange={(e) => setTimeMin(e.target.value)}
              placeholder="min"
              min="0"
            />
            <input
              type="number"
              id="timeSec"
              value={timeSec}
              onChange={(e) => setTimeSec(e.target.value)}
              placeholder="sec"
              min="0"
              max="59"
            />
            <button className="add-button" type="submit">
              ADD
            </button>
          </div>
        </div>
      </form>
      {items.length > 0 && currentItem === null && !showCongrats && (
        <button className="start-button" onClick={handleStart}>
          START
        </button>
      )}
      {currentItem !== null && (
        <div className="stop-pause-container">
          <button className="stop-button" onClick={handleStop}>
            STOP
          </button>
          {isPause ? (
            <button className="continue-button" onClick={handlePause}>
              CONTINUE
            </button>
          ) : (
            <button className="pause-button" onClick={handlePause}>
              PAUSE
            </button>
          )}
        </div>
      )}
      {showCongrats && (
        <div className="congrats-message">
          Congratulations! All activities are completed.
        </div>
      )}
      <audio ref={chimeRef} src={chimeSound} />
    </div>
  );
}

export default App;
