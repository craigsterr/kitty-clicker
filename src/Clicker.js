import { useState } from "react";

function Clicker() {
  const [cats, setCats] = useState(0);
  const [floatingCats, setFloatingCats] = useState([]);

  const click = new Audio("/assets/click.mp3");
  const meowSounds = [
    "/assets/cat_sounds/meow1.wav",
    "/assets/cat_sounds/meow2.wav",
    "/assets/cat_sounds/meow3.wav",
    "/assets/cat_sounds/meow4.wav",
    "/assets/cat_sounds/meow5.wav",
    "/assets/cat_sounds/meow6.wav",
  ];

  const playRandomMeow = () => {
    const randomIndex = Math.floor(Math.random() * meowSounds.length);
    const meow = new Audio(meowSounds[randomIndex]);

    meow.play();
    click.play();
  };

  const handleClick = () => {
    setCats(cats + 1);
    playRandomMeow();

    // Generate a random X offset between -50px and 50px
    const randomX = Math.floor(Math.random() * 100) - 100;

    const newCat = {
      id: Date.now(),
      xOffset: randomX,
    };

    setFloatingCats((prev) => [...prev, newCat]);

    setTimeout(() => {
      setFloatingCats((prev) => prev.filter((cat) => cat.id !== newCat.id));
    }, 1500);
  };

  return (
    <div className="App">
      <p>cats: {cats}</p>
      <button onClick={handleClick}>meow</button>

      {floatingCats.map((cat) => (
        <div
          key={cat.id}
          className="floating-cat"
          style={{ "--x-move": `${cat.xOffset}px` }}
        >
          cat
        </div>
      ))}
    </div>
  );
}

export default Clicker;
