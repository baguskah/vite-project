import { useState } from "react";
import { styWrapper } from "./style";

const user = [
  { id: 1, name: "Paimin" },
  { id: 2, name: "Paijo" },
];

const id = 2; // dapet dari url params

const Rerender = () => {
  const [count, setCount] = useState(0);
  const [currentUser] = useState(() =>
    user.find((u) => {
      console.log("Rerender inside state");
      return u.id === id;
    })
  );

  return (
    <div css={styWrapper}>
      <h1>Halo nama saya {currentUser ? currentUser.name : "..."}</h1>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Add
      </button>
      <br></br>
      count {count}
    </div>
  );
};

export default Rerender;
