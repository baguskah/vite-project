// @ts-nocheck
import React, { useState, createContext, useContext, useMemo } from "react";

const KominfoContext = createContext(undefined);
KominfoContext.displayName = "Kominfo";

const UpdaterContext = createContext(undefined);
UpdaterContext.displayName = "Updater Instruction";

const Kominfo = React.memo(({ children }) => {
  const [instruction, setInstruction] = useState(0);
  const [unusedState, setUnusedState] = useState(0);

  return (
    <>
      <KominfoContext.Provider value={instruction}>
        <UpdaterContext.Provider value={setInstruction}>
          {children}
        </UpdaterContext.Provider>
      </KominfoContext.Provider>
      <button onClick={() => setUnusedState((prev) => prev + 1)}>
        Trigger Unused State: {unusedState}
      </button>
    </>
  );
});

const GubernurSundaEmpire = React.memo(() => {
  const { setInstruction } = useContext(UpdaterContext);
  console.log("GubernurSundaEmpire Rerender");

  return (
    <>
      <WalikotaSundaEmpire />
    </>
  );
});

const GubernurJawaTenggara = React.memo(() => {
  const { instruction } = useContext(KominfoContext);

  console.log("GubernurJawaTenggara Rerender");

  return (
    <>
      <WalikotaJawaTenggara />
    </>
  );
});

function Presiden() {
  return (
    <>
      <Kominfo>
        <GubernurSundaEmpire />
        <GubernurJawaTenggara />
      </Kominfo>
    </>
  );
}

function WalikotaSundaEmpire() {
  console.log("WalikotaSundaEmpire Rerender");

  return (
    <>
      <CamatJawaTenggara />
    </>
  );
}

function WalikotaJawaTenggara() {
  console.log("WalikotaJawaTenggara Rerender");

  return (
    <>
      <CamatSundaEmpire />
    </>
  );
}

function CamatJawaTenggara() {
  const { instruction } = useContext(KominfoContext);

  console.log("CamatJawaTenggara Rerender");

  return (
    <>
      <KadesJawaTenggara />
    </>
  );
}

function CamatSundaEmpire() {
  console.log("CamatSundaEmpire Rerender");

  return (
    <>
      <KadesSundaEmpire />
    </>
  );
}

function KadesJawaTenggara() {
  console.log("KadesJawaTenggara Rerender");

  return (
    <>
      <div></div>
    </>
  );
}

function KadesSundaEmpire() {
  const { instruction } = useContext(KominfoContext);

  console.log("KadesSundaEmpire Rerender");

  return (
    <>
      <div></div>
    </>
  );
}

export default Presiden;
