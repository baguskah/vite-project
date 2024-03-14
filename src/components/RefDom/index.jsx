import { useRef, forwardRef, useState } from "react";

function expensiveCalc() {
  console.log("Expensive Calculation Executed");
}

function AvoidRerender() {
  const [state, setState] = useState(0);
  const funcRef = useRef(null);

  if (funcRef.current === null) {
    funcRef.current = expensiveCalc();
  }

  return <p onClick={() => setState(state + 1)}>Click Me</p>;

  /**
  
  Avoiding re-execution the ref contents
  



   










   */
}

const ForwardedFormRef = forwardRef(Form);
function Parent() {
  const inputRef = useRef(null);

  return (
    <>
      <AvoidRerender />
      <ForwardedFormRef ref={inputRef} />
    </>
  );
}

function Form(props, ref) {
  function handleClick() {
    ref.current.focus();
  }

  return (
    <>
      <input ref={ref} />
      <button onClick={handleClick}>Focus the input</button>
    </>
  );
}

export default Parent;
