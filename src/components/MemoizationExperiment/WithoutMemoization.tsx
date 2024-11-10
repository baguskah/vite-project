import React, { useCallback, useEffect, useMemo, useState } from "react";

let renderTimes = 0;
let lastComponentRenderStart;

const calculateFactorial = (number) => {
  console.log("Calculate...");
  if (number <= 1) return 1;
  return number * calculateFactorial(number - 1);
};

export default function WithoutMemoization() {
  renderTimes++;
  lastComponentRenderStart = performance.now();

  const initialMenu = ["Ketoprak", "Bakso", "Zuppa Sup", "Soto"];
  const [makanan, setMakanan] = useState(initialMenu);

  const handleAmbilMakanan = useCallback((item) => {
    setMakanan((prevMakanan) => prevMakanan.filter((c) => c !== item));
  }, []);

  const factorial = useMemo(() => calculateFactorial(100), []);

  useEffect(() => {
    const duration = performance.now() - lastComponentRenderStart;
    console.log(`Time Performance: ${duration}`);
  });

  return (
    <div>
      <h2>Menu Catering Nikahan</h2>
      <p style={{ marginBottom: "10px" }}>{factorial}</p>
      <div>
        <ul>
          {makanan.map((item, index) => (
            <li onClick={() => handleAmbilMakanan(item)} key={index}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
