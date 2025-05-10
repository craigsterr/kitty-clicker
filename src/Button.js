import { useState } from "react";

function Button({ onClick }) {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  const idle = `${process.env.PUBLIC_URL}/assets/button_idle.png`;
  const pressed = `${process.env.PUBLIC_URL}/assets/button_pushed.png`;

  return (
    <img
      src={isPressed ? pressed : idle}
      alt="kitty clicker 😺"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      draggable={false}
      style={{
        transform: "scale(0.75)",
        imageRendering: "pixelated",
        cursor: "pointer",
      }}
    />
  );
}

export default Button;
