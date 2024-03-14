import { useEffect, useLayoutEffect } from "react";

const RenderFlow = () => {
  useLayoutEffect(() => {
    // code here

    return () => {
      // clean up code here
    };
  });

  useEffect(() => {
    console.log("Step 2");
  });

  return (
    <div>
      <h1>Component</h1>
    </div>
  );
};

export default RenderFlow;
