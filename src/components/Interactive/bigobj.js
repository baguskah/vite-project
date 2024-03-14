export const bigObject = {};

// Add 1 million properties to the object
for (let i = 0; i < 1000000; i++) {
  bigObject[`property${i}`] = i;
}

console.log(bigObject); //
