// import Zod from "./components/IG/Zod";
// import RefDom from "./components/RefDom";

import "./App.css";
import CodeAnimation from "./components/Experiment/CodeAnimation";
import Memoization from "./components/HooksAdvanced/Memoization";
// import DeepCloning from "./components/IG/Immerjs";
import "./styles/index.css";

function App() {
  // const values = {}

  // function perkalianTujuh(arg){
  //   if(values[arg] === undefined){
  //     values[arg] = arg * 7
  //   }

  //   return values[arg]

  // }

  // const execute = perkalianTujuh(6)
  // console.log(execute) // 42

  // const anotherOperation = perkalianTujuh(6)

  // const func = (a, b) => {
  //   return a + b;
  // };

  // console.log("debug obj", func);

  // function ingatFungsi(fungsinya) {
  //   const tempatPenampungan = {
  //     // arg: (arg) => arg * 7, // 0xSSSSSSSSS
  //   };

  //   return function (param) {
  //     if (tempatPenampungan[param] === undefined) {
  //       tempatPenampungan[param] = fungsinya(param);
  //     }

  //     console.log("debug tempatPenampungan", tempatPenampungan);

  //     return tempatPenampungan[param];
  //   };
  // }

  // const fungsinya = (arg) => arg * 7;

  function calculate(params) {
    let value = params;
    value.count = 3;
    return value;
  }

  const obj = { count: 1 };

  const val = calculate(obj);

  // console.log(obj.count);
  // console.log(val.count);

  //   const valueA = 123
  //   const valueB = "ss"

  // const obj1 = {
  //   a:1,
  //   b:2,
  // }

  //  console.log('debug variable', variable);

  return (
    <>
      {/* <div onClick={handleClick}>Menu</div> */}
      <CodeAnimation />
      {/* <Memoization /> */}
    </>
  );
}

export default App;
