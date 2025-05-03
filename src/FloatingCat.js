import { useMemo } from "react";

function FloatingCat({ x, y }) {
  const catImage = useMemo(() => {
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
