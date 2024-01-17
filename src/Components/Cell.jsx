import dollBlue from "../assets/russian-doll-blue.svg";
import dollRed from "../assets/russian-doll-red.svg";
import "./Cell.css";

export default function Cell({
  cellPlayer,
  level,
  onClickHandler,
  moveSelectHighlight,
}) {
  //   console.log("Cell highlight", moveSelectHighlight);
  const sizeClass = "doll-" + level;

  let cellClass = "my-cell ";

  cellClass = moveSelectHighlight ? cellClass + "highlight" : cellClass;

  return (
    <div onClick={onClickHandler} className={cellClass}>
      {cellPlayer !== -1 && (
        <img
          className={sizeClass}
          src={cellPlayer === "Blue" ? dollBlue : dollRed}
          alt=""
        />
      )}
    </div>
  );
}
