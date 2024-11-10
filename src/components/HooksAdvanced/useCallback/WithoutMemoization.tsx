import React, { useEffect } from "react";
let compRenderTimes = 0;
let lastCompRenderStart;

export default function WithoutMemoization() {
  compRenderTimes++;
  lastCompRenderStart = performance.now();

  const initialMenu = ["ketoprak", "bakso", "zuppa soup", "soto"];
  const [makanan, setMakanan] = React.useState(initialMenu);

  const handleAmbilMakanan = (makanan) => {
    setMakanan((allMakanan) => allMakanan.filter((c) => c !== makanan));
  };

  const dispense2 = (makanan) => {
    setMakanan((allMakanan) => allMakanan.filter((c) => c !== makanan));
  };

  const dispense3 = (makanan) => {
    setMakanan((allMakanan) => allMakanan.filter((c) => c !== makanan));
  };

  useEffect(() => {
    const duration = performance.now() - lastCompRenderStart;
    console.log("debug duration Without", duration);
  });

  return (
    <div>
      <h2 className="text-2xl mb-5">Menu Catering Nikahan</h2>
      <div>
        <div className="mb-5">Without Memoization</div>
        {makanan.length === 0 ? (
          <button onClick={() => setMakanan(initialMenu)}>refill</button>
        ) : (
          <ul>
            {makanan.map((makan) => (
              <li key={makan}>
                <button onClick={() => handleAmbilMakanan(makan)}>Ambil</button>{" "}
                {makan}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
