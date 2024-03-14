/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */

import { useState } from "react";

const Isolated = () => {
  const [userName] = useState("Paijo");
  const [fullName] = useState("Paijo bin Paimin");

  return (
    <>
      <UserContext.Provider value={{ userName, fullName }}>
        <HeaderSection />
        <ProfileSection />
        <NamePopupSection />
      </UserContext.Provider>
    </>
  );
};

const WrapperComponent = () => {
  return (
    <div className="body-wrapper">
      <Isolated />
      {/* no rerender please */}
      <AnotherComponent no rerender please />
    </div>
  );
};

export default WrapperComponent;

const WrapperComponentContex = () => {
  const [userName] = useState("Paijo");
  const [fullName] = useState("Paijo bin Paimin");

  return (
    <div className="body-wrapper">
      <UserContext.Provider value={{ userName, fullName }}>
        <HeaderSection />
        <ProfileSection />
        <NamePopupSection />
      </UserContext.Provider>
    </div>
  );
};
