import { useReducer, useState } from "react";

const countReducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT": {
      const count = state + 1;

      if (count <= 0) {
        return {
          ...state,
          errorMessage: "",
        };
      }
      return {
        count: count,
        errorMessage: "",
      };
    }
    case "DECREMENT": {
      const count = state + 1;

      if (count > 0) {
        return {
          ...state,
          errorMessage: "",
        };
      }

      return {
        count: count,
        errorMessage: "",
      };
    }
    default:
      break;
  }
};

const Counter = () => {
  const [state, dispatch] = useReducer(countReducer, {
    count: 0,
    errorMessage: "",
  });

  console.log("debug state", state);

  const [count, setCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const onClickMinus = () => {
    dispatch({ type: "DECREMENT" });
  };

  const onClickPlus = () => {
    dispatch({ type: "INCREMENT" });
  };

  return (
    <div>
      <div className="quantity-selector flex flex-row">
        <button onClick={onClickMinus} className="button mr-5">
          -
        </button>
        <div className="number">{count}</div>
        <button onClick={onClickPlus} className="button ml-5">
          +
        </button>
      </div>
      <div>{errorMessage}</div>
    </div>
  );
};

export default Counter;
