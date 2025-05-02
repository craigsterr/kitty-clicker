import { useState, useEffect } from "react";

function Clicker() {
  const [cats, setCats] = useState(0);
  const [floatingCats, setFloatingCats] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isAutoClickerOn, setIsAutoClickerOn] = useState(false);
  const [milestone, setMilestone] = useState(0);
  const [tooltip, setTooltip] = useState({
    text: "",
    x: 0,
    y: 0,
    visible: false,
  });
  const [catClickAmt, setCatClickAmt] = useState(1);
  const [autoClickInterval, setautoClickInterval] = useState(1000);
  const [nextUpgradeNum, setNextUpgradeNum] = useState(100);

  const click = new Audio("kitty-clicker/assets/click.mp3");
  const ghettoSmoshSound = new Audio("kitty-clicker/assets/ghetto_smosh.mp3");

  const addCat = (amount = 1) => {
    setCats((prevCats) => {
      const newCount = prevCats + amount;

      if (newCount >= nextUpgradeNum) {
        setNextUpgradeNum((prevNum) => {
          if (prevNum <= newCount) {
            setMilestone(nextUpgradeNum);
            const increment = 2;
            return Math.floor(prevNum * increment);
          }
          console.log(prevNum);
          return prevNum;
        });

        // setMilestone(newCount);
        setShowPopup(true);
        ghettoSmoshSound.play();
      }

      return newCount;
    });
  };

  useEffect(() => {
    if (isAutoClickerOn) {
      const interval = setInterval(() => {
        addCat(1);
      }, autoClickInterval);

      return () => clearInterval(interval);
    }
  }, [isAutoClickerOn, cats]);

  const meowSounds = [
    "kitty-clicker/assets/cat_sounds/meow1.wav",
    "kitty-clicker/assets/cat_sounds/meow2.wav",
    "kitty-clicker/assets/cat_sounds/meow3.wav",
    "kitty-clicker/assets/cat_sounds/meow4.wav",
    "kitty-clicker/assets/cat_sounds/meow5.wav",
    "kitty-clicker/assets/cat_sounds/meow6.wav",
  ];

  const playRandomMeow = () => {
    const randomIndex = Math.floor(Math.random() * meowSounds.length);
    const meow = new Audio(meowSounds[randomIndex]);

    meow.play();
    click.play();
  };

  const handleClick = (event) => {
    addCat(catClickAmt);
    playRandomMeow();
    const appRect = event.currentTarget.getBoundingClientRect();

    const mouseX = event.clientX - appRect.left * 0.89;
    const mouseY = event.clientY;

    console.log("Mouse Position:", event.clientX, event.clientY);

    // Generate a random X offset between -50px and 50px
    const randomX = Math.floor(Math.random() * 100) - 100;

    const newCat = {
      id: Date.now(),
      xPos: mouseX,
      yPos: mouseY,
    };

    setFloatingCats((prev) => [...prev, newCat]);

    setTimeout(() => {
      setFloatingCats((prev) => prev.filter((cat) => cat.id !== newCat.id));
    }, 1500);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="App">
      <h1>kitty clicker =^.^=</h1>
      <p>cats: {cats}</p>
      <button onClick={handleClick}>meow</button>

      {floatingCats.map((cat) => (
        <div
          key={cat.id}
          className="floating-cat"
          style={{
            position: "absolute",
            left: `${cat.xPos}px`,
            top: `${cat.yPos}px`,
            transform: "translate(-50%, -50%)", // Centers on click
          }}
        >
          cat
        </div>
      ))}

      <div className={`popup ${showPopup ? "show" : ""}`}>
        <div className="popup-content">
          <h2>=^.^= you reached {milestone} points! =^.^=</h2>
          <h3>pick an upgrade!</h3>
          <div className="tooltip-container">
            <button
              onMouseMove={(e) =>
                setTooltip({
                  text: "increases number of cats per second",
                  x: e.clientX,
                  y: e.clientY,
                  visible: true,
                })
              }
              onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
              onClick={() => {
                setIsAutoClickerOn(true);
                setautoClickInterval((prevAuto) => {
                  return prevAuto / 1.1;
                });
                closePopup();
              }}
            >
              adoption center
            </button>
          </div>

          <button
            onMouseMove={(e) =>
              setTooltip({
                text: "increases the number of cats per click",
                x: e.clientX,
                y: e.clientY,
                visible: true,
              })
            }
            onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
            onClick={() => {
              setCatClickAmt((prevAmt) => prevAmt + 1);
              closePopup();
            }}
          >
            extra catnip
          </button>

          <button onClick={closePopup}>Close</button>
        </div>
      </div>
      {tooltip.visible && (
        <div
          className="tooltip-text"
          style={{
            top: tooltip.y,
            left: tooltip.x - 100,
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}

export default Clicker;
