export default function Memoization() {
  /**
   * 
   









   */

  const funcCache = {};

  function memoize(fn) {
    const key = fn.toString();
    if (!funcCache[key]) {
      funcCache[key] = fn;
    }
    return funcCache[key];
  }

  const fungsinya = (arg) => arg * 7;

  // di dalam React Lifecycle
  const fungsi1 = memoize((arg) => arg * 7);
  const fungsi2 = memoize((arg) => arg * 7);
  const fungsi3 = memoize((arg) => arg * 7);

  console.log(fungsi1 === fungsi3);

  /**
   * 
   








  
   */

  return <h1>Memoization</h1>;
}
