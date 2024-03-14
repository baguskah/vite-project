export default function SwitchCase() {
  const operations = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b,
  };

  function performOperationUsingMapping(operation, a, b) {
    return operations[operation](a, b);
  }

  function performOperationUsingSwitch(operation, a, b) {
    switch (operation) {
      case "add":
        return a + b;
      case "subtract":
        return a - b;
      case "multiply":
        return a * b;
      case "divide":
        return a / b;
      default:
        return null;
    }
  }

  const startMapping = performance.now();
  for (let i = 0; i < 1000000; i++) {
    performOperationUsingMapping("multiply", 5, 3);
  }
  const endMapping = performance.now();
  console.log(`Object mapping took ${endMapping - startMapping} milliseconds.`);

  const startSwitch = performance.now();
  for (let i = 0; i < 1000000; i++) {
    performOperationUsingSwitch("multiply", 5, 3);
  }
  const endSwitch = performance.now();
  console.log(`Switch case took ${endSwitch - startSwitch} milliseconds.`);

  return;
}
