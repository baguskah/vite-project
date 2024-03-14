import { useState, useEffect, useRef } from "react";

const FormBasic = () => {
  const [firstName, setFirstName] = useSaveToLocalStorage("middleName");

  const handleChange = (e) => {
    setFirstName(e.target.value.toLowerCase());
  };

  return (
    <form>
      <div>
        <label>First Name: </label>
        <input
          name="firstName"
          value={firstName}
          onChange={handleChange}
          type="text"
        ></input>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default FormBasic;

function useSaveToLocalStorage(key) {
  const [state, setState] = useState(
    () => window.localStorage.getItem(key) || ""
  );

  const prevKey = useRef(key);

  useEffect(() => {
    const valPrevKey = prevKey.current;

    if (valPrevKey !== key) {
      window.localStorage.removeItem(valPrevKey);
    }
    prevKey.current = key;
    window.localStorage.setItem(key, state);
  }, [state, key]);

  return [state, setState];
}
