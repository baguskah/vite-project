import { useMemo } from "react";

const calculateFactorial = (number) => {
  if (number <= 1) return 1;
  return number * calculateFactorial(number - 1);
};

const MyComponent = () => {


  const factorial = calculateFactorial(100);





  return (
    <div>
      <p>Factorial of 100 is: {factorial}</p>
    </div>
  );
};

export default MyComponent;
