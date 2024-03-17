import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import AceEditor from "react-ace";
import { Flipper, Flipped } from "react-flip-toolkit";
import DiffMatchPatch from "diff-match-patch";
import * as prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import * as prettierPluginBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
import hljs from 'highlight.js';
import "highlight.js/styles/atom-one-dark.css";

import aceTokenizer from "ace-code/src/ext/simple_tokenizer"
import { JavaScriptHighlightRules } from "ace-code/src/mode/javascript_highlight_rules";
import { DOMData, animateDOMAppear, animateDOMMove, dataExample, searchNormPositionBasedOnValueToken, searchPositionBasedOnValueToken, selectElementsInSequence } from './helpers/selectElementInSequence'

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-one_dark";

// Import necessary Ace build files
import "ace-builds/src-noconflict/ext-language_tools";
import AnimatedSection from "./AnimatedSection";


const normalizeHTML = (text: string) => {
  // const formattedText = text.replace(/\n/g, '<br/>');

  return text
}

const dmp = new DiffMatchPatch();

type outputDiff = [0 | 1 | -1, string][]

const CodeAnimation = () => {
  const [outputDiff, setOutputDiff] = useState<outputDiff>([]);

  const [upEditorCode, setUpEditorCode] = useState(`l.f((c) => {
    if (c.domAfter) {
    }
  });
  `);
  const [bottomEditorCode, setBottomEditorCode] = useState(`l.f((c) => {
    if (c.domAfter) {
      animateDOMAppear();
    }
  });    
  `);

  const [before, setBefore] = useState()
  const [set, setSet] = useState()

  const beforeRef = useRef();
  const editorRef = useRef();

  /**
   * Area Result
   */

  const befResultRef = useRef()
  const aftResultRef = useRef()
  const containerRef = useRef()


  /**
     * End Result
     */

  const [flipperData, setFlipperData] = useState([]);




  const doPettier = async () => {
    const prettyPrevCode = await prettier.format(upEditorCode, {
      semi: true,
      parser: "babel",
      plugins: [prettierPluginBabel, prettierPluginEstree],
    });

    const prettyAfterCode = await prettier.format(bottomEditorCode, {
      semi: true,
      parser: "babel",
      plugins: [prettierPluginBabel, prettierPluginEstree],
    });

    setUpEditorCode(prettyPrevCode);
    setBottomEditorCode(prettyAfterCode)
  }

  const doAnimation = () => {
    const htmlBefore = befResultRef.current as unknown as HTMLElement;
    const htmlAfter = aftResultRef.current as unknown as HTMLElement;
    const htmlContainer = containerRef.current as unknown as HTMLElement;
    const containerPosition = htmlContainer.getBoundingClientRect()

    const listNodeMoving: any = [];
    const listNodeAppear: any = [];

    /** Comparation Engine Start */
    const storeTokenizePerLine = []
    const joinedAllDiff = outputDiff.map((v, i) => {
      const theValue = v[1]
      const tokenizedAtas = aceTokenizer.tokenize(theValue, new JavaScriptHighlightRules());
      tokenizedAtas.forEach(tokenize => {

      });
      console.log('debug tokenizedAtas', tokenizedAtas);
      return v[1]
    }).join("");




    const tokenizeunionDiff = aceTokenizer.tokenize(joinedAllDiff, new JavaScriptHighlightRules());
    console.log('debug tokenizeunionDiff', tokenizeunionDiff);


    const tokenizeValueBefore = aceTokenizer.tokenize(upEditorCode, new JavaScriptHighlightRules());
    const tokenizeValueAfter = aceTokenizer.tokenize(bottomEditorCode, new JavaScriptHighlightRules());

    // console.log('debug tokenizeunionDiff', tokenizeunionDiff);

    // console.log('debug tokenizeValueBefore', tokenizeValueBefore);
    // console.log('debug tokenizeValueAfter', tokenizeValueAfter);
    /** Comparation Engine End */


    /**
     * Create index to find right className and value based on index position and searching new position and old position
     *  COMPARATION DOM POSITION INDEX DATA SOURCE
     * */

    // collect all row node tokenize className and value to use in mix and match className
    const listAllClassAndValueTokenize: DOMData[] = []
    const listBeforeClassAndValueTokenize: DOMData[] = []
    const listAfterClassAndValueTokenize: DOMData[] = []

    // to detect index if similar word found
    const similarValueList: { val: string, idx: number, className: string | undefined }[] = [];

    let indexPostionAll = 0

    tokenizeunionDiff.forEach((lineArr, idb) => {

      // if (idb === 2) {
      //   console.log('debug lineArr 2', lineArr);
      // }

      lineArr.forEach((token, i) => {
        listAllClassAndValueTokenize.push({ ...token, idxPosition: indexPostionAll })
        indexPostionAll++
      });
    });

    // BEFORE
    let indexPositionBefore = 0;
    tokenizeValueBefore.forEach(lineArr => {
      lineArr.forEach((token, i) => {
        listBeforeClassAndValueTokenize.push({ ...token, idxPositionBefore: indexPositionBefore })
        indexPositionBefore++
      });
    });


    // AFTER
    let indexPositionAfter = 0
    tokenizeValueAfter.forEach(lineArr => {
      lineArr.forEach((token, i) => {
        listAfterClassAndValueTokenize.push({ ...token, idxPositionAfter: indexPositionAfter })
        indexPositionAfter++
      });
    });


    /**
    * END Create index to find right className and value based on index position and searching new position and old position
    *  
    * */




    const listAllClassWithoutSpaceUndefined: DOMData[] = listAllClassAndValueTokenize.filter(v => v.className !== undefined).map((v, i) => {
      return {
        ...v,
        normPosition: i
      }
    })


    let indexTargetGetClass = 0;

    // console.log('debug outputDiff aa', outputDiff.map(v => v[1]));

    outputDiff.forEach(element => {
      const statusNumber = element[0]
      const isPersist = statusNumber === 0;
      const isNew = statusNumber === 1;
      const isRemove = statusNumber === -1

      /** This token not fully match with reality TODO:! */
      const codeValue = element[1] as string;
      /** 
       * Somehow this tokenize give wrong className Result like suposed to be "argument" -> "identifier" className 
       * so instead of we take className from tokenize Below, change source of truth classname in listAllClassAndValueTokenize based on index
       * we take only value from this tokenize for "in findTrueClassName Algoritm"
      */
      const breakDown: [{ className: string | undefined, value: string }][] = aceTokenizer.tokenize(codeValue, new JavaScriptHighlightRules());
      /** */

      if (indexTargetGetClass === 21) {

        // tidak bisa disamakan karena kita ingin mengambil className yang sesungguhnya
        // namun kendala terjadi ketika hasil tokenannya ga sama huhu

        console.log('debug v[1]=', codeValue);
        // console.log('debug breakDown', breakDown);
        // console.log('debug arr 21', arr);
        // console.log('debug objToken', objToken);
      }

      const listClassAndValue: DOMData[] = [];


      // breakdown by value contain all diff from match patcher to take only the value
      // listAllClassAndValueTokenize contain  all diff tokenized 
      breakDown.forEach((arr, indexDebug) => {
        if (arr.length > 0) {

          let indexSimlar = 0


          arr.forEach(objToken => {
            const spanValue = objToken.value; // THIS IS IMPORTANT VALUE TO DETECT POSITION
            // findTrue value of ClassName
            const valueByAllClassValueTokenize = listAllClassAndValueTokenize[indexTargetGetClass]

            const spanClassName = valueByAllClassValueTokenize?.className;



            // console.log('debug indexTargetGetClass', `${indexTargetGetClass} = ${spanValue} `);

            // to store index word if similar word found

            const similarWord = similarValueList.filter(word => word.val == spanValue && word.className === spanClassName);

            let indexSimilarWord = 0;

            if (similarWord.length === 0) {
              similarValueList.push({ val: spanValue, idx: indexSimlar, className: spanClassName })
              indexSimilarWord = indexSimlar;
            }

            if (similarWord.length > 0) {

              // if (spanClassName === "ace_punctuation ace_operator" && spanValue === ".") {
              //   console.log('debug similarWord', similarWord);
              // }

              const takeLastWordDataIndex = similarWord[similarWord.length - 1].idx + 1;
              similarValueList.push({ val: spanValue, idx: takeLastWordDataIndex, className: spanClassName })
              indexSimilarWord = takeLastWordDataIndex;
            }

            // end to store index word if similar word found
            const listBeforeTokenizeWithNormPosition = listBeforeClassAndValueTokenize
              .filter(v => v.className !== undefined)
              .map((n, i) => ({ ...n, normPosition: i }));

            const listAfterTokenizeWithNormPosition = listAfterClassAndValueTokenize
              .filter(v => v.className !== undefined)
              .map((n, i) => ({ ...n, normPosition: i }))

            const positionNormBefore = searchNormPositionBasedOnValueToken({
              value: spanValue,
              tokenizedSequence: listBeforeTokenizeWithNormPosition,
              idxSimilarWord: indexSimilarWord,
              capture: 'before',
              spanClassName: spanClassName
            })

            const positionNormAfter = searchNormPositionBasedOnValueToken({
              value: spanValue,
              tokenizedSequence: listAfterTokenizeWithNormPosition,
              idxSimilarWord: indexSimilarWord,
              capture: 'after',
              spanClassName: spanClassName
            })



            if (valueByAllClassValueTokenize) {
              listClassAndValue.push({
                ...valueByAllClassValueTokenize,
                statusNumber: statusNumber,
                idxPosition: indexTargetGetClass,
                positionNormInBefore: positionNormBefore,
                positionNormInAfter: positionNormAfter,
              })
            }

            ++indexTargetGetClass
          })
        }
      })

      const listClassAndValueWithNormPosition = listClassAndValue.filter(v => v.className !== undefined).map(w => {
        const dataGrabAllClass = listAllClassWithoutSpaceUndefined.find(a => a.idxPosition === w.idxPosition)
        return {
          ...w,
          normPosition: dataGrabAllClass?.normPosition
        }
      });

      /**List yang bertahan dan pindah 
       * 1. Bentuk Dom dengan tokenizer
       * 2. Capture Position Sebelum ambil getBoundingClientRect()
       * 3. Capture Position Sesudah ambil getBoundingClientRect()
      */

      // if (codeValue === "}") {
      //   console.log('debug isPersist', isPersist);
      // }

      // console.log('debug listClassAndValueWithNormPosition', listClassAndValueWithNormPosition);

      // console.log('debug listClassAndValueWithNormPosition', listClassAndValueWithNormPosition);

      const searchBefore = selectElementsInSequence(listClassAndValueWithNormPosition, htmlBefore, 'before');
      const searchAfter = selectElementsInSequence(listClassAndValueWithNormPosition, htmlAfter, 'after');

      // console.log('debug searchAfter', searchAfter);

      if (isPersist) {




        // if (spanValue) {

        // }
        // console.log('debug searchBefore', searchBefore);
        // console.log('debug searchAfter', searchAfter);
        // console.log('debug searchBefore', searchBefore);
        // console.log('debug searchAfter', searchAfter);

        const reNormalized = listClassAndValueWithNormPosition.map((l, i) => {

          const domBefore = searchBefore?.[i];
          const positionBefore = domBefore?.position;

          const domAfter = searchAfter?.[i];
          const positionAfter = domAfter?.position;

          return {
            ...l,
            domBefore,
            domAfter,
            positionBefore,
            positionAfter
          }
        })

        reNormalized.forEach(nd => {
          listNodeMoving.push(nd)
        })
      }


      if (isNew) {
        // Because new is only in after DOM
        const searchAfter = selectElementsInSequence(listClassAndValueWithNormPosition, htmlAfter, 'after');
        const reNormalized = searchAfter?.map((l, i) => {

          const domAfter = searchAfter?.[i];
          const positionAfter = domAfter?.position;

          return {
            ...l,
            domAfter,
            positionAfter
          }
        })

        reNormalized.forEach(nd => {
          listNodeAppear.push(nd)
        })
      }

    });



    indexTargetGetClass = 0

    // if (listNodeMoving.length === 0) {
    //   return
    // }


    /** Animate Moving */
    listNodeMoving.forEach(chlNode => {
      if (chlNode.domAfter) {
        animateDOMMove(chlNode.domAfter.node, chlNode.positionBefore, chlNode.positionAfter, containerPosition)
      }
    });


    /** Animate Appear */
    listNodeAppear.forEach((chlNode: { domAfter: { node: any; }; positionAfter: any; }) => {
      if (chlNode.domAfter) {
        animateDOMAppear(chlNode.domAfter.node, chlNode.positionAfter, containerPosition)
      }
    });
  };

  const handleRunCode = async () => {
    const innerHTMLBef = beforeRef?.current?.refEditor?.childNodes[2].children[0].children[2].innerHTML;
    const innerHTML = editorRef?.current?.refEditor?.childNodes[2].children[0].children[2].innerHTML;


    if (innerHTML) {
      setBefore(innerHTMLBef)
      setSet(innerHTML)
    }

    const calculateDiff = dmp.diff_main(upEditorCode, bottomEditorCode);
    setOutputDiff(calculateDiff);
  };

  useEffect(() => {
    const calculateDiff = dmp.diff_main(upEditorCode, bottomEditorCode);
    setOutputDiff(calculateDiff);
  }, [])

  return (
    <div className="flex h-screen w-screen">
      <div className="flex flex-col w-1/2 h-full overflow-hidden">
        <div className="h-1/2 p-2">
          <AceEditor
            showGutter={false}
            ref={beforeRef}
            mode="javascript"
            theme="one_dark"
            onChange={(v) => {
              setUpEditorCode(v);
            }}
            name="UNIQUE_ID_OF_DIV_TOP"
            editorProps={{ $blockScrolling: true }}
            style={{ height: "100%", width: "100%" }} // Ensure the editor fills the container
            value={upEditorCode}
          />
        </div>
        <div className="flex flex-end">
          <button
            onClick={handleRunCode}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2 self-end"
          >
            Run Code
          </button>
          <button
            onClick={doAnimation}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2 self-end"
          >
            Animate Code
          </button>
          <button
            onClick={doPettier}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2 self-end"
          >
            Pretty Code
          </button>
        </div>
        <div className="h-1/2 p-2">
          {" "}
          {/* Adjust the height as needed */}
          <AceEditor
            ref={editorRef}
            showGutter={false}
            mode="javascript"
            theme="one_dark"
            onChange={(value) => setBottomEditorCode(value)}
            name="UNIQUE_ID_OF_DIV_BOTTOM"
            editorProps={{ $blockScrolling: true }}
            style={{ height: "100%", width: "100%" }} // Ensure the editor fills the container
            value={bottomEditorCode}
          />
        </div>
      </div>
      <div className="w-1/2 h-full p-2">
        <div className="bg-neutral-700 h-full p-4 whitespace-pre-wrap" >
          <AnimatedSection html={set}
            beforeHtlk={before}
            befResultRef={befResultRef}
            aftResultRef={aftResultRef}
            containerRef={containerRef}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeAnimation;


// Mungkin lebih tepatnya gini. Programmer mungkin bisa dibilang jago, kalau dia bisa memecahkan masalah, dia memiliki alasan dari apa yang dia tulis pada kodenya. Alasan itulah yang menguatkan, sumbernya bisa dari pengalaman, dokumentasi, dll. 