import { useState, useEffect, useRef, useCallback } from "react";
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
  const [bonusCats, setBonusCats] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const marioSong = useRef(
    new Audio(`${process.env.PUBLIC_URL}/assets/mario_song.mp3`)
  );
  const undertaleSound = useRef(
    new Audio(`${process.env.PUBLIC_URL}/assets/undertale_cat.mp3`)
  );

  undertaleSound.current.volume = 0.6;

  const clickSound = useRef(
    new Audio(`${process.env.PUBLIC_URL}/assets/click.mp3`)
  );
  const milestoneSound = useRef(
    new Audio(`${process.env.PUBLIC_URL}/assets/ghetto_smosh.mp3`)
  );
  const explosionSound = useRef(
    new Audio(`${process.env.PUBLIC_URL}/assets/explosion.mp3`)
  );

  explosionSound.current.volume = 0.3;

  const [playMusic, setPlayMusic] = useState(false);

  const titleRef = useRef();

  const meowSounds = [
    `${process.env.PUBLIC_URL}/assets/cat_sounds/meow1.wav`,
    `${process.env.PUBLIC_URL}/assets/cat_sounds/meow2.wav`,
    `${process.env.PUBLIC_URL}/assets/cat_sounds/meow3.wav`,
    `${process.env.PUBLIC_URL}/assets/cat_sounds/meow4.wav`,
    `${process.env.PUBLIC_URL}/assets/cat_sounds/meow5.wav`,
    `${process.env.PUBLIC_URL}/assets/cat_sounds/meow6.wav`,
  ];

  const catImages = [
    `${process.env.PUBLIC_URL}/assets/cat1.png`,
    `${process.env.PUBLIC_URL}/assets/cat2.png`,
    `${process.env.PUBLIC_URL}/assets/cat3.png`,
    `${process.env.PUBLIC_URL}/assets/cat4.png`,
    `${process.env.PUBLIC_URL}/assets/cat5.png`,
    `${process.env.PUBLIC_URL}/assets/cat6.png`,
    `${process.env.PUBLIC_URL}/assets/cat7.png`,
    `${process.env.PUBLIC_URL}/assets/cat8.png`,
  ];

  const incrementCats = useCallback(
    (amount = 1) => {
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
    },
    [nextUpgradeNum, milestoneIncrement]
  );

  const playRandomMeow = () => {
    const meow = new Audio(
      meowSounds[Math.floor(Math.random() * meowSounds.length)]
    );
    meow.play();
    clickSound.current.play();
  };

  const handleMusic = () => {
    if (!playMusic) {
      marioSong.current.loop = true;
      marioSong.current.volume = 0.3;
      marioSong.current.play();
    }
    setPlayMusic(true);
  };

  const handleMainClick = (e) => {
    handleMusic();
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

  const collectBonusCat = (id, x, y) => {
    explosionSound.current.play();
    const explosionId = Date.now();
    setExplosions((prev) => [...prev, { id: explosionId, x, y }]);
    setTimeout(() => {
      setExplosions((prev) => prev.filter((ex) => ex.id !== explosionId));
    }, 600);

    incrementCats(50); // Or any bonus value you want
    setBonusCats((prev) => prev.filter((cat) => cat.id !== id));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const image = catImages[Math.floor(Math.random() * catImages.length)];
      setBonusCats((prev) => [...prev, { id, x, y, image }]);

      // Remove after 5 seconds
      setTimeout(() => {
        setBonusCats((prev) => prev.filter((cat) => cat.id !== id));
      }, 5000);
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isAutoClickerOn) return;
    const rect = titleRef.current.getBoundingClientRect();
    const interval = setInterval(() => {
      incrementCats(1);
    }, autoClickInterval);

    return () => clearInterval(interval);
  }, [isAutoClickerOn, autoClickInterval, incrementCats]);

  const handleTooltip = (text, x = 0, y = 0) => {
    if (text) {
      setTooltip({ text, x, y, visible: true });
    } else {
      setTooltip((prev) => ({ ...prev, visible: false }));
    }
  };

  return (
    <div className="App">
      <h1>kitty clicker 😺</h1>
      <p ref={titleRef}>cats: {cats}</p>
      <p>next upgrade: {nextUpgradeNum} cats</p>
      <button onClick={handleMainClick}>meow</button>
      {floatingCats.map((cat) => (
        <FloatingCat key={cat.id} x={cat.xPos} y={cat.yPos} />
      ))}
      {showPopup && (
        <Popup
          milestone={milestone}
          onClose={() => {
            setShowPopup(false);
            undertaleSound.current.play();
          }}
          onAutoClick={() => {
            setIsAutoClickerOn(true);
            setAutoClickInterval((prev) => prev / 1.25);
            setTooltip((prev) => ({ ...prev, visible: false }));
            setShowPopup(false);
            undertaleSound.current.play();
          }}
          onCatnip={() => {
            setCatClickAmt((prev) => prev + 1);
            setTooltip((prev) => ({ ...prev, visible: false }));
            setShowPopup(false);
            undertaleSound.current.play();
          }}
          onTooltip={handleTooltip}
        />
      )}
      {tooltip.visible && (
        <Tooltip text={tooltip.text} x={tooltip.x} y={tooltip.y} />
      )}
      {bonusCats.map((cat) => (
        <img
          key={cat.id}
          src={cat.image}
          alt="bonus cat"
          onClick={() => collectBonusCat(cat.id, cat.x, cat.y)}
          style={{
            position: "absolute",
            top: `${cat.y}px`,
            left: `${cat.x}px`,
            width: "60px",
            cursor: "pointer",
            zIndex: 10,
          }}
        />
      ))}
      {explosions.map((ex) => (
        <div
          key={ex.id}
          className="explosion"
          style={{
            top: ex.y,
            left: ex.x,
            position: "absolute",
            width: "60px",
            height: "60px",
            backgroundImage: "url('/kitty-clicker/assets/explosion.gif')",
            backgroundSize: "cover",
            pointerEvents: "none",
            zIndex: 20,
          }}
        />
      ))}
    </div>
  );
}

export default Clicker;
