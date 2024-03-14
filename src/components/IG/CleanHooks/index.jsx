import { useState } from "react";
import "./QuantitySelector.css";

const increase = (prevValue, max) => {
  return {
    value: prevValue < max ? prevValue + 1 : prevValue,
    message: prevValue < max ? "" : "Max 3",
  };
};

const decrease = (prevValue, min) => {
  return {
    value: prevValue > min ? prevValue - 1 : prevValue,
    message: prevValue > min ? "" : "Minimal 0",
  };
};

const useQuantitySelector = () => {
  const [state, setState] = useState({
    value: 0,
    message: "",
  });

  const onClickMinus = () => {
    setState(decrease(state.value, 0));
  };

  const onClickPlus = () => {
    setState(increase(state.value, 3));
  };

  return {
    onClickMinus,
    onClickPlus,
    value: state.value,
    message: state.message,
  };
};

const QuantitySelector = () => {
  const { onClickMinus, onClickPlus, value, message } = useQuantitySelector();

  return (
    <div className="quantity-selector">
      <button onClick={onClickMinus} className="button">
        -
      </button>
      <div className="number">{value}</div>
      <button onClick={onClickPlus} className="button">
        +
      </button>
      <div className="message">{message}</div>
    </div>
  );
};

export default QuantitySelector;
