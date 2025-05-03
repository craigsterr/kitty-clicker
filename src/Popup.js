function Popup({ milestone, onClose, onAutoClick, onCatnip, onTooltip }) {
  return (
    <div className={`popup show`}>
      <div className="popup-content">
        <h2>=^.^= you reached {milestone} points! =^.^=</h2>
        <h3>pick an upgrade!</h3>

        <div className="tooltip-container">
          <button
            onMouseMove={(e) =>
              onTooltip(
                "increases number of cats per second",
                e.clientX,
                e.clientY
              )
            }
            onMouseLeave={() => onTooltip(null)}
            onClick={onAutoClick}
          >
            adoption center
          </button>

          <button
            onMouseMove={(e) =>
              onTooltip(
                "increases the number of cats per click",
                e.clientX,
                e.clientY
              )
            }
            onMouseLeave={() => onTooltip(null)}
            onClick={onCatnip}
          >
            extra catnip
          </button>

          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
