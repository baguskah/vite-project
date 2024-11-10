/* eslint-disable react/prop-types */

import { memo, useCallback, useMemo, useState } from "react";

function factorial(n) {
  console.log("Recalculate");
  return n <= 0 ? 1 : n * factorial(n - 1);
}

const ComponentChild = (props) => {
  console.log("Child Rerender");
  return (
    <div onClick={props.onClick}>
      {props.name} : {props.numberData}
    </div>
  );
};
const MemoizedChild = memo(ComponentChild);

const ParentComponent = () => {
  const [count, setCount] = useState(1);
  const factorialNumber = useMemo(() => factorial(10), []);
  const handleClick = useCallback(() => {
    alert("clicked");
  }, []);

  return (
    <>
      <div>Parent Component {count}</div>
      <MemoizedChild
        name="Child Component"
        numberData={factorialNumber}
        onClick={handleClick}
      />
      <button
        onClick={() => {
          setCount((v) => v + 1);
        }}
      >
        Trigger Rerender
      </button>
    </>
  );
};

export default ParentComponent;
