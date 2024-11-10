import React, { memo, useState } from "react";

function SlowComponent(props) {
  const test = props;
  test.name = "Utama";
  // name = "Utama";
  // let i = 0;
  // while (i < 1000000000) {
  //   i++;
  // }

  console.log("debug test.name", test.name);
  return <p>Slow Component</p>;
}

// const test = [
//   {
//     input: "Sabtu 111.900",
//   },
//   // {
//   //   input: "Langganan Chatgpt Bulan Juli 1000 (ChatGpt)",
//   // },
//   // {
//   //   input: "Tepung Boga sari cakra kembar 1kg Rp. 336.172 ke Bu dedi",
//   // },
//   // {
//   //   input: "Gula 20kg Rp. 12.345.678.090",
//   // },
//   // {
//   //   input: "Gula batok Juli 2024 E12384SD 2pcs 2 pcs @1000 (ChatGpt)",
//   // },
// ];

// function formatInputWithExtractedData(params: {
//   productDescription: string;
//   quantityPhrase: string;
//   priceValue: string;
//   additionalInfo: string;
// }) {
//   let normalizedQuantity = params.quantityPhrase || "1pcs";

//   const quantityMatch = normalizedQuantity.match(/\d+/);
//   const quantity = Number(quantityMatch?.[0]) || null;

//   let normalizedPrice = params.priceValue;
//   let numericPrice = normalizedPrice.replace(/[.,]/g, "");
//   let priceValue = parseInt(numericPrice.replace(/[^\d]/g, ""));

//   const isPricePerUnit = normalizedPrice[0] === "@";
//   if (isPricePerUnit && quantity) {
//     priceValue = priceValue * quantity;
//   }

//   const lowerCasePrice = numericPrice.toLowerCase();
//   if (
//     lowerCasePrice.includes("ribu") ||
//     lowerCasePrice.includes("rb") ||
//     lowerCasePrice.includes("k")
//   ) {
//     priceValue *= 1000;
//   } else if (
//     lowerCasePrice.includes("ratus") ||
//     lowerCasePrice.includes("rts")
//   ) {
//     priceValue *= 100;
//   } else if (lowerCasePrice.includes("juta") || lowerCasePrice.includes("jt")) {
//     priceValue *= 1000000;
//   } else if (lowerCasePrice.includes("milyar")) {
//     priceValue *= 1000000000;
//   }

//   if (Number.isNaN(priceValue)) {
//     return null;
//   }

//   const formattedPrice = `Rp. ${priceValue.toLocaleString("id-ID")}`;

//   return `${params.productDescription} ${normalizedQuantity} ${formattedPrice} ${params.additionalInfo}`;
// }

// function parseAndFormatInput(inputSentence: string) {
//   const priceRegex =
//     /(\bRp\.?\s?\d{1,3}(?:\.\d{3})*\b|\b\d{1,3}(?:\.\d{3})*\b(?!\s?(ribu|rb|juta|jt|milyar|m|ratus|rts|rupiah|rp|k|K)\b)|\b\d{3,12}\b|@\d{3,12}\b|@\d{1,3}(?:\.\d{3})*\b)(?=[^\d]*$)/i;
//   const quantityRegex =
//     /(\d+\s*(pcs|kg|g|gram|ml|l|liter|lbr|lembar|bh|buah|kali|biji)$|\d+\s*=\s*\d+$|\d+$)(?=[^\d]*$)/i;
//   const informalPriceRegex =
//     /@?\d+\s?(ribu|rb|juta|jt|milyar|m|ratus|rts|rupiah|rp|k|K)\b/i;

//   let priceMatch =
//     inputSentence.match(priceRegex) || inputSentence.match(informalPriceRegex);

//   const priceStart = priceMatch?.index || 0;
//   const priceEnd = priceStart + (priceMatch?.[0].length || 0);
//   const extractedPrice = inputSentence.substring(priceStart, priceEnd);

//   console.log("debug extractedPrice", extractedPrice);

//   const textBeforePrice = inputSentence.substring(0, priceStart).trim();
//   const quantityMatch = textBeforePrice.match(quantityRegex);

//   const quantityStart = quantityMatch?.index || 0;
//   const quantityEnd = quantityStart + (quantityMatch?.[0].length || 0);
//   const extractedQuantity = textBeforePrice.substring(
//     quantityStart,
//     quantityEnd
//   );

//   const productDescription = inputSentence
//     .substring(0, quantityStart || priceStart)
//     .trim();
//   const additionalInfo = inputSentence.substring(priceEnd).trim();

//   const parsedData = {
//     productDescription,
//     quantityPhrase: extractedQuantity,
//     priceValue: extractedPrice,
//     additionalInfo,
//   };

//   const formattedResult = formatInputWithExtractedData(parsedData);
//   console.log("Formatted result:", formattedResult);
// }

// const inputnya = test;

// inputnya.map((v) => {
//   // Find regular price
//   return parseAndFormatInput(v.input);
// });

const MemoizedSlowComponent = memo(SlowComponent);

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <MemoizedSlowComponent name={"bagus"} />
    </div>
  );
}
