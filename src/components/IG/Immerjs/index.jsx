import { useEffect, useState } from "react";

import { produce } from "immer";

export default function DeepCloning() {
  const [state, setState] = useState({
    level1: {
      info: "This is level 1",
      data: { year: 2021, description: "Start of the journey" },
      level2: {
        info: "This is level 2",
        data: { year: 2022, description: "Progressing deeper" },
        level3: {
          info: "This is level 3",
          data: { year: 2023, description: "Halfway through" },
          level4: {
            info: "This is level 4",
            data: { year: 2024, description: "Almost there" },
            level5: {
              info: "This is level 5",
              data: { year: 2025, description: "Final level before user" },
              user: {
                id: "123",
                name: "Paijo",
                address: {
                  street: "Jl In Dulu Aja",
                  city: "Jakarta",
                  zipCode: "12345",
                },
              },
            },
          },
        },
      },
    },
  });

  //   setState(produce((draftState) => {
  //         draftState.level1.level2.level3.level4.level5.user.address.city = "IKN";
  //   }));

  //   setState(
  //     produce((draftState) => {
  //         draftState.level1.level2.level3.level4.level5.user.address.city = "IKN";
  //     })
  //   );

  //   const newState = structuredClone(state);

  //   newState.level1.level2.level3.level4.level5.user.address.city = "IKN";

  //   console.log(state);
  //   console.log(setState);

  // useEffect(() => {
  //   setState((prevState) => {
  //    return produce((prevState, draftState) => {
  //       draftState.level1.level2.level3.level4.level5.user.address.city = "IKN";
  //     });
  //   });
  // }, []);

  return (
    <div>{state.level1.level2.level3.level4.level5.user.address.city}</div>
  );
}
