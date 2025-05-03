import { useMemo } from "react";

function FloatingCat({ x, y }) {
  const catImage = useMemo(() => {
    const catImages = [
      "/kitty-clicker/assets/cat1.png",
      "/kitty-clicker/assets/cat2.png",
      "/kitty-clicker/assets/cat3.png",
      "/kitty-clicker/assets/cat4.png",
      "/kitty-clicker/assets/cat5.png",
      "/kitty-clicker/assets/cat6.png",
      "/kitty-clicker/assets/cat7.png",
      "/kitty-clicker/assets/cat8.png",
    ];

    return catImages[Math.floor(Math.random() * catImages.length)];
  }, []);

  return (
    <img
      src={catImage}
      alt="cat drawing"
      className="floating-cat"
      style={{
        left: `${x - 90}px`,
        top: `${y - 80}px`,
      }}
    />
  );
}

export default FloatingCat;
