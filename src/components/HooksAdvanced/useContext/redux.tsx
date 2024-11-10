// @ts-nocheck
import React from "react";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";

const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
    haha: "TESS",
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
});

const { increment } = counterSlice.actions;

const store = configureStore({
  reducer: { counter: counterSlice.reducer },
});

function CEO() {
  // const [state, setState] = useState(1);

  return (
    <>
      <Provider store={store}>
        <h2 className="flex justify-center">CEO</h2>
        <div className="flex flex-row justify-between">
          <DirekturMarketing />
          <DirekturRnd />
        </div>
      </Provider>
    </>
  );
}

function DirekturMarketing() {
  return (
    <div>
      <h2>Direktur Marketing</h2>
      <ManagerMarketingLv1 />
    </div>
  );
}

function ManagerMarketingLv1() {
  return (
    <div>
      <h2>Manajer Marketing Lv1</h2>
      <ManagerMarketingLv2 />
    </div>
  );
}

function ManagerMarketingLv2() {
  return (
    <div>
      <h2>Manajer Marketing Lv2</h2>
      <PicIklan />
    </div>
  );
}

function PicIklan() {
  const state = useSelector((state) => {
    console.log("debug state", state);
    return state.counter.value;
  });
  const dispatch = useDispatch();

  return (
    <div>
      <h2>PIC Iklan</h2>
      <span>
        Iklan Info: <h2 className="text-yellow-500">{state}</h2>
      </span>
      <button onClick={() => dispatch(increment())}>Tes</button>
    </div>
  );
}

function DirekturRnd() {
  return (
    <div>
      <h2>Direktur RnD</h2>
      <TeamRnd />
    </div>
  );
}

function TeamRnd() {
  const state = useSelector((state) => state.counter.value);
  useSelector((state) => {
    console.log("debug state", state);
  });

  return (
    <div>
      <h2>RnD Team</h2>
      <h2 className="text-yellow-500">{state}</h2>
    </div>
  );
}

export default CEO;
