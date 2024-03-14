import { useState } from "react";

const useRef = (initialState) => {
  const [ref, setState] = useState({ current: initialState });
  ref = 1;
  console.log(ref);
  return ref;
};

export default useRef;
