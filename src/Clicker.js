import { useState, useEffect, useRef } from "react";
import Popup from "./Popup";
import FloatingCat from "./FloatingCat";

function Tooltip({ text, x, y }) {
  return (
    <div
      className="tooltip-text"
      style={{
        top: y,
        left: x - 100,
      }}
    >
      {text}
    </div>
  );
}

function Clicker() {
  const INITIAL_CLICK_VALUE = 1;
  const INITIAL_UPGRADE = 10;
  const CAT_DISPLAY_DURATION = 1000;

  const [cats, setCats] = useState(0);
  const [floatingCats, setFloatingCats] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isAutoClickerOn, setIsAutoClickerOn] = useState(false);
  const [milestone, setMilestone] = useState(0);
  const [catClickAmt, setCatClickAmt] = useState(INITIAL_CLICK_VALUE);
  const [autoClickInterval, setAutoClickInterval] = useState(1000);
  const [nextUpgradeNum, setNextUpgradeNum] = useState(INITIAL_UPGRADE);
  const [milestoneIncrement, setMilestoneIncrement] = useState(INITIAL_UPGRADE);
  const [tooltip, setTooltip] = useState({
    text: "",
    x: 0,
    y: 0,
    visible: false,
  });

  const clickSound = useRef(new Audio("/kitty-clicker/assets/click.mp3"));
  const milestoneSound = useRef(
    new Audio("/kitty-clicker/assets/ghetto_smosh.mp3")
  );

  const titleRef = useRef();

  const meowSounds = [
    "/kitty-clicker/assets/cat_sounds/meow1.wav",
    "/kitty-clicker/assets/cat_sounds/meow2.wav",
    "/kitty-clicker/assets/cat_sounds/meow3.wav",
    "/kitty-clicker/assets/cat_sounds/meow4.wav",
    "/kitty-clicker/assets/cat_sounds/meow5.wav",
    "/kitty-clicker/assets/cat_sounds/meow6.wav",
  ];

  const incrementCats = (amount = 1) => {
    setCats((prevCats) => {
      const newCount = prevCats + amount;

      if (newCount >= nextUpgradeNum) {
        setMilestone(nextUpgradeNum);
        setMilestoneIncrement((prevNum) => prevNum + 10);
        setNextUpgradeNum((prevNum) => prevNum + milestoneIncrement);

        setShowPopup(true);

        milestoneSound.current.play();
      }

      return newCount;
    });
  };

  const playRandomMeow = () => {
    const meow = new Audio(
      meowSounds[Math.floor(Math.random() * meowSounds.length)]
    );
    meow.play();
    clickSound.current.play();
  };

  const handleMainClick = (e) => {
    incrementCats(catClickAmt);
    playRandomMeow();

    const x = e.clientX;
    const y = e.clientY;

    const newCat = { id: Date.now(), xPos: x, yPos: y };
    setFloatingCats((prev) => [...prev, newCat]);

    setTimeout(() => {
      setFloatingCats((prev) => prev.filter((cat) => cat.id !== newCat.id));
    }, CAT_DISPLAY_DURATION);
  };

  useEffect(() => {
    if (!isAutoClickerOn) return;
    const rect = titleRef.current.getBoundingClientRect();
    const interval = setInterval(() => {
      incrementCats(1);

      const newCat = {
        id: Date.now(),
        xPos: rect.left + rect.width / 2,
        yPos: rect.top + rect.height / 2,
      };
      setFloatingCats((prev) => [...prev, newCat]);

      setTimeout(() => {
        setFloatingCats((prev) => prev.filter((cat) => cat.id !== newCat.id));
      }, CAT_DISPLAY_DURATION);
    }, autoClickInterval);

    return () => clearInterval(interval);
  }, [isAutoClickerOn, autoClickInterval]);

  const handleTooltip = (text, x = 0, y = 0) => {
    if (text) {
      setTooltip({ text, x, y, visible: true });
    } else {
      setTooltip((prev) => ({ ...prev, visible: false }));
    }
  };

  return (
    <div className="App">
      <h1>kitty clicker =^.^=</h1>
      <p ref={titleRef}>cats: {cats}</p>
      <button onClick={handleMainClick}>meow</button>

      {floatingCats.map((cat) => (
        <FloatingCat key={cat.id} x={cat.xPos} y={cat.yPos} />
      ))}

      {showPopup && (
        <Popup
          milestone={milestone}
          onClose={() => setShowPopup(false)}
          onAutoClick={() => {
            setIsAutoClickerOn(true);
            setAutoClickInterval((prev) => prev / 1.1);
            setTooltip((prev) => ({ ...prev, visible: false }));
            setShowPopup(false);
          }}
          onCatnip={() => {
            setCatClickAmt((prev) => prev + 1);
            setTooltip((prev) => ({ ...prev, visible: false }));
            setShowPopup(false);
          }}
          onTooltip={handleTooltip}
        />
      )}

      {tooltip.visible && (
        <Tooltip text={tooltip.text} x={tooltip.x} y={tooltip.y} />
      )}
    </div>
  );
}

export default Clicker;
