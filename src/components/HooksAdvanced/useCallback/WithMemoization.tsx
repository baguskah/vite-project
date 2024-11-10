import React, { useCallback, useEffect } from "react";
let compRenderTimes = 0;
let lastCompRenderStart;

export default function UnecessaryMemoization() {
  compRenderTimes++;
  lastCompRenderStart = performance.now();

  const initialMenu = ["ketoprak", "bakso", "zuppa soup", "soto"];
  const [makanan, setMakanan] = React.useState(initialMenu);

  const dispense = useCallback(
    (makanan) => {
      setMakanan((allMakanan) => allMakanan.filter((c) => c !== makanan));
    },
    [setMakanan]
  );

  const dispense2 = useCallback(
    (makanan) => {
      setMakanan((allMakanan) => allMakanan.filter((c) => c !== makanan));
    },
    [setMakanan]
  );

  const dispense3 = useCallback(
    (makanan) => {
      setMakanan((allMakanan) => allMakanan.filter((c) => c !== makanan));
    },
    [setMakanan]
  );

  useEffect(() => {
    const duration = performance.now() - lastCompRenderStart;
    console.log("debug duration With", duration);
  });

  return (
    <div>
      <h2 className="text-2xl mb-5">Menu Catering Nikahan</h2>
      <div>
        <div className="mb-5">With Memoization</div>
        {makanan.length === 0 ? (
          <button onClick={() => setMakanan(initialMenu)}>refill</button>
        ) : (
          <ul>
            {makanan.map((makan) => (
              <li key={makan}>
                <button onClick={() => dispense(makan)}>Ambil</button> {makan}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
