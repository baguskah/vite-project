// @ts-nocheck
import React, { useState, createContext, useContext, useMemo } from "react";

// Komponen Terpisah
const DataIklan = createContext(undefined);
const Unused = createContext(undefined);

const DataIklanProvider = ({ children, count }) => {
  const [state, setState] = useState(1);
  const [unusedState, setUnusedState] = useState(0);
  console.log("DataIklanProvider RERENDER");

  return (
    <Unused.Provider
      value={unusedState}
      children={
        <DataIklan.Provider value={state}>
          {children}
          <button onClick={() => setUnusedState((prev) => prev + 1)}>
            Increment {unusedState}
          </button>
        </DataIklan.Provider>
      }
    />
  );
};

const useDataIklan = () => {
  const state = useContext(DataIklan);

  return state;
};

const useDataUnused = () => {
  const state = useContext(Unused);

  return state;
};

function CEO() {
  const [state, setState] = useState(1);

  const children = useMemo(() => {
    return (
      <>
        <h2 className="flex justify-center">CEO</h2>
        <div className="flex flex-row justify-between">
          <DirekturMarketing />
          <DirekturRnd />
        </div>
      </>
    );
  }, []);

  return (
    <>
      <DataIklanProvider
        // count={state}
        children={children}
      />
      <button onClick={() => setState((prev) => prev + 1)}>Trigger CEO</button>
    </>
  );
}

function DirekturMarketing() {
  // console.log("DirekturMarketing RERENDER");
  // const state = useDataIklan();

  return (
    <div>
      <h2>Direktur Marketing</h2>
      <ManagerMarketingLv1 />
    </div>
  );
}

function ManagerMarketingLv1() {
  console.log("ManagerMarketingLv1 RERENDER");

  return (
    <div>
      <h2>Manajer Marketing Lv1</h2>
      <ManagerMarketingLv2 />
    </div>
  );
}

function ManagerMarketingLv2() {
  console.log("ManagerMarketingLv2 RERENDER");

  return (
    <div>
      <h2>Manajer Marketing Lv2</h2>
      <PicIklan />
    </div>
  );
}

function PicIklan() {
  console.log("PicIklan RERENDER");
  const { state } = useDataIklan();

  return (
    <div>
      <h2>PIC Iklan</h2>
      <span>
        Iklan Info: <h2 className="text-yellow-500">{state}</h2>
      </span>
    </div>
  );
}

function DirekturRnd() {
  console.log("DirekturRnd RERENDER");

  return (
    <div>
      <h2>Direktur RnD</h2>
      <TeamRnd />
    </div>
  );
}

function TeamRnd() {
  console.log("TeamRnd RERENDER");
  const { state } = useDataIklan();
  useDataUnused();

  return (
    <div>
      <h2>RnD Team</h2>
      <h2 className="text-yellow-500">{state}</h2>
    </div>
  );
}

export default CEO;
