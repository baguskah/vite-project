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
import { DOMData, animateDOMAppear, animateDOMHide, animateDOMMove, diffTest, diff_lineMode, removeObjectFromArray, searchNormPositionBasedOnValueToken, selectElementsInSequence } from './helpers/selectElementInSequence'

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

  const [upEditorCode, setUpEditorCode] = useState(`if (searchFor === "after" && theTrulyNodeTarget) {
    theTrulyNodeTarget.style.opacity = 0;
  }`);

  const [bottomEditorCode, setBottomEditorCode] = useState(`if (theTrulyNodeTarget) {
    finalData.push({
      ...element,
      node: theTrulyNodeTarget,
      position: theTrulyNodeTarget.getBoundingClientRect(),
    });
  }`);

  const [data, setData] = useState(new Date())

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
    const listNodeHide: any = []

    /** Comparation Engine Start */
    // const allDiffStringValue: { className: string, value: string }[][] = []
    const joinedAllDiff = outputDiff.map((v, i) => {
      const stringValue = v[1];
      const theTokenized: { className: string, value: string }[][] = aceTokenizer.tokenize(stringValue, new JavaScriptHighlightRules())
      return stringValue
    });


    const tokenizeunionDiff: { className: string, value: string }[][] = aceTokenizer.tokenize(joinedAllDiff.join(""), new JavaScriptHighlightRules());
    const tokenizeValueBefore: { className: string, value: string }[][] = aceTokenizer.tokenize(upEditorCode, new JavaScriptHighlightRules());
    const tokenizeValueAfter: { className: string, value: string }[][] = aceTokenizer.tokenize(bottomEditorCode, new JavaScriptHighlightRules());
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
    const similarValueForFindClassName: { val: string, idx: number }[] = []


    let indexPostionAll = 0


    tokenizeunionDiff.forEach((lineArr, idb) => {
      lineArr.forEach((token, i) => {
        if (token.className !== undefined) {
          listAllClassAndValueTokenize.push({ ...token, idxPosition: indexPostionAll })
          indexPostionAll++
        }
      });
    });

    // BEFORE
    let indexPositionBefore = 0;
    tokenizeValueBefore.forEach(lineArr => {
      lineArr.forEach((token, i) => {
        if (token.className !== undefined) {
          listBeforeClassAndValueTokenize.push({ ...token, idxPositionBefore: indexPositionBefore })
          indexPositionBefore++
        }
      });
    });

    // AFTER
    let indexPositionAfter = 0
    tokenizeValueAfter.forEach(lineArr => {
      lineArr.forEach((token, i) => {
        if (token.className !== undefined) {
          listAfterClassAndValueTokenize.push({ ...token, idxPositionAfter: indexPositionAfter })
          indexPositionAfter++
        }
      });
    });



    /**
    * END Create index to find right className and value based on index position and searching new position and old position
    *  
    * */

    const listAllClassWithoutSpaceUndefined: DOMData[] = listAllClassAndValueTokenize.filter(v => v.className !== undefined);
    const listAllClassBeforeWithoutSpaceUndefined: DOMData[] = listBeforeClassAndValueTokenize.filter(v => v.className !== undefined);
    const listAllClassAfterWithoutSpaceUndefined: DOMData[] = listAfterClassAndValueTokenize.filter(v => v.className !== undefined);
    // console.log('debug listAllClassAfterWithoutSpaceUndefined', listAllClassAfterWithoutSpaceUndefined);

    const copyListAllClassAfterWithoutSpaceUndefined = [...listAllClassAfterWithoutSpaceUndefined]

    // Because all element are hide in SearchElementInSequence 
    // And the parent has 0 opacity, then first make container after 1 opacity
    const containerNode = document.getElementById("after")
    containerNode.style.opacity = 1


    let indexTargetGetClass = 0;
    let indexTargetGetClassBefore = 0;
    let indexTargetGetClassAfter = 0;


    let indexSimilarValueOnlyBefore = 0;
    let indexSimilarValueOnlyAfter = 0;

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
      // console.log('debug codeValue', codeValue);
      // console.log('debug breakDown', breakDown);
      /** */

      const listClassAndValue: DOMData[] = [];

      // breakdown by value contain all diff from match patcher to take only the value
      // listAllClassAndValueTokenize contain  all diff tokenized 


      breakDown.forEach((arr) => {
        if (arr.length > 0) {
          let indexSimlar = 0;

          arr.forEach(objToken => {
            const spanValue = objToken.value; // THIS IS IMPORTANT VALUE TO DETECT POSITION
            // console.log('debug spanValue', spanValue);
            // define only non undefined className because of differences tokenize break and alldiff
            if (objToken.className !== undefined) {



              /** 
               * findTrue value of ClassName based before tokenized, and after tokenized 
               * New algoritm for searcing className in Array
                * Union tokenize is not the answer, join value become missmatch
                * Search by before and after
                * if status Number === 0 (search in before)
                * if status Number === -1 (search in before)
                * if status Number === 1 (search in after) 
                * to get the truely className
                */



              let spanClassName = ''
              let valueByAllClassValueTokenize = { className: '', value: '' }

              if (statusNumber === 0 || statusNumber === -1) {
                valueByAllClassValueTokenize = listAllClassBeforeWithoutSpaceUndefined[indexTargetGetClassBefore]
                spanClassName = listAllClassBeforeWithoutSpaceUndefined[indexTargetGetClassBefore].className
                indexTargetGetClassBefore++

                // console.log('debug valueByAllClassValueTokenize', valueByAllClassValueTokenize);

                const objToDeleteInAfter = { className: spanClassName, value: spanValue };

                if (statusNumber === 0) {
                  const findSimilarUnion = similarValueForFindClassName.filter(v => v.val === spanValue);
                  if (findSimilarUnion.length === 0) {
                    similarValueForFindClassName.push({ val: spanValue, idx: 0 })
                    // console.log('debug getLastDataIndex', { spanValue, spanClassName, statusNumber, getLastDataIndex: 0, findSimilarUnion, similarValueForFindClassName });

                  }

                  if (findSimilarUnion.length > 0) {
                    const getLastIndexData = findSimilarUnion[findSimilarUnion.length - 1].idx + 1;
                    similarValueForFindClassName.push({ val: spanValue, idx: getLastIndexData })
                    // console.log('debug getLastDataIndex', { spanValue, spanClassName, statusNumber, getLastDataIndex: getLastIndexData, findSimilarUnion, similarValueForFindClassName });
                  }

                }

                const afterToDelete = listAllClassAfterWithoutSpaceUndefined.find(v => v.className === objToDeleteInAfter.className && v.value === objToDeleteInAfter.value)

                // removeObjectFromArray(copyListAllClassAfterWithoutSpaceUndefined, objToDeleteInAfter)
              }

              // console.log('debug listAllClassAfterWithoutSpaceUndefined', listAllClassBeforeWithoutSpaceUndefined);

              if (statusNumber === 1) {
                const findSimilarUnion = similarValueForFindClassName.filter(v => v.val === spanValue);
                if (findSimilarUnion.length === 0) {
                  const findInAfter = copyListAllClassAfterWithoutSpaceUndefined.find(v => v.value === spanValue)!;
                  valueByAllClassValueTokenize = findInAfter
                  spanClassName = findInAfter.className;
                  similarValueForFindClassName.push({ val: spanValue, idx: 0 })
                  // console.log('debug getLastDataIndex', { spanValue, spanClassName, statusNumber, getLastDataIndex: 0, findSimilarUnion, similarValueForFindClassName });
                }

                if (findSimilarUnion.length > 0) {
                  const filterInAfter = copyListAllClassAfterWithoutSpaceUndefined.filter(v => v.value === spanValue)!;
                  const getLastDataIndex = findSimilarUnion[findSimilarUnion.length - 1].idx + 1;
                  valueByAllClassValueTokenize = filterInAfter[getLastDataIndex]
                  spanClassName = valueByAllClassValueTokenize.className
                  // console.log('debug getLastDataIndex', { spanValue, spanClassName, statusNumber, getLastDataIndex, filterInAfter, similarValueForFindClassName });
                }

                // console.log('debug findData', findData);
                // console.log('debug {v}', { v: spanValue, c: spanClassName, statusNumber: statusNumber, idx: indexTargetGetClassAfter, allC: listAllClassAfterWithoutSpaceUndefined });

                //   const similarValueStorageAfter = similarValueOnlyAfter.filter(v => v.val === spanValue);
                //   if (similarValueStorageAfter.length === 0) {
                //     similarValueOnlyAfter.push({ val: spanValue, idx: indexSimilarValueOnlyAfter })
                //     indexSimilarWordOnlyAfter = indexSimilarValueOnlyAfter
                //   }

                //   if (similarValueStorageAfter.length > 0) {
                //     const takeLastWordDataIndexAfter = similarValueStorageAfter[similarValueStorageAfter.length - 1].idx + 1;
                //     similarValueOnlyAfter.push({ val: spanValue, idx: takeLastWordDataIndexAfter })
                //     indexSimilarWordOnlyAfter = takeLastWordDataIndexAfter
                //   }

                //   valueByAllClassValueTokenize = listAllClassAfterWithoutSpaceUndefined[indexSimilarWordOnlyAfter]
                //   spanClassName = listAllClassAfterWithoutSpaceUndefined[indexSimilarWordOnlyAfter].className
              }

              // console.log('debug valueByAllClassValueTokenize', { ...valueByAllClassValueTokenize, status: statusNumber });

              // return result truely ClassName Value
              // end find true value className


              // to store index word if similar word found
              const similarWord = similarValueList.filter(word => word.val == spanValue && word.className === spanClassName);

              let indexSimilarWordAndClassName = 0;

              if (statusNumber !== -1) { // detect only in afterDOM
                if (similarWord.length === 0) {
                  similarValueList.push({ val: spanValue, idx: indexSimlar, className: spanClassName })
                  indexSimilarWordAndClassName = indexSimlar;
                }

                if (similarWord.length > 0) {

                  const takeLastWordDataIndex = similarWord[similarWord.length - 1].idx + 1;
                  similarValueList.push({ val: spanValue, idx: takeLastWordDataIndex, className: spanClassName })
                  indexSimilarWordAndClassName = takeLastWordDataIndex;
                }
              }

              // end to store index word if similar word found
              const listBeforeTokenizeWithNormPosition = listBeforeClassAndValueTokenize
                .filter(v => v.className !== undefined);

              const listAfterTokenizeWithNormPosition = listAfterClassAndValueTokenize
                .filter(v => v.className !== undefined)



              const positionNormBefore = searchNormPositionBasedOnValueToken({
                value: spanValue,
                tokenizedSequence: listBeforeTokenizeWithNormPosition,
                idxSimilarWord: indexSimilarWordAndClassName,
                capture: 'before',
                spanClassName: spanClassName
              })


              const positionNormAfter = searchNormPositionBasedOnValueToken({
                value: spanValue,
                tokenizedSequence: listAfterTokenizeWithNormPosition,
                idxSimilarWord: indexSimilarWordAndClassName,
                capture: 'after',
                spanClassName: spanClassName
              })

              if (spanValue === "push") {
                // console.log('debug data', data);
              }

              if (valueByAllClassValueTokenize) {
                listClassAndValue.push({
                  ...valueByAllClassValueTokenize,
                  statusNumber: statusNumber,
                  idxPosition: indexTargetGetClass,
                  idxPositionBefore: positionNormBefore,
                  idxPositionAfter: positionNormAfter,
                })
              }

              ++indexTargetGetClass

            }
          })
        }
      })


      const listClassAndValueWithNormPosition = listClassAndValue.filter(v => v.className !== undefined);
      /**List yang bertahan dan pindah 
       * 1. Bentuk Dom dengan tokenizer
       * 2. Capture Position Sebelum ambil getBoundingClientRect()
       * 3. Capture Position Sesudah ambil getBoundingClientRect()
      */

      const searchBefore = selectElementsInSequence(listClassAndValueWithNormPosition, htmlBefore, 'before');
      const searchAfter = selectElementsInSequence(listClassAndValueWithNormPosition, htmlAfter, 'after');


      // if (codeValue === "theTrulyNodeTarget") {
      console.log('debug searchBefore', { codeValue, searchBefore });
      // }


      // listClassAndValueWithNormPosition.forEach((l, i) => {

      //   const domBefore = searchBefore?.[i];
      //   const positionBefore = domBefore?.position;

      //   const domAfter = searchAfter?.[i];
      //   const positionAfter = domAfter?.position;

      //   const status = l.statusNumber;
      //   const move = status === 0;
      //   const appearing = status === 1;
      //   const hide = status === -1

      //   const dataPush = {
      //     ...l,
      //     domBefore,
      //     domAfter,
      //     positionBefore,
      //     positionAfter
      //   }

      //   if (move) {
      //     listNodeMoving.push(dataPush)
      //   }

      //   if (appearing) {
      //     listNodeAppear.push(dataPush)
      //   }

      //   if (hide) {
      //     listNodeHide.push(dataPush)
      //   }
      // })


      if (isPersist) {
        const reNormalized = listClassAndValueWithNormPosition.map((l, i) => {

          // if (l.value === "theTrulyNodeTarget") {
          //   console.log('debug searchBefore', searchBefore);
          //   console.log('debug l', l);
          // }
          // console.log('debug searchBefore', searchBefore);
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
        const reNormalized = searchAfter?.map((l, i) => {

          const domAfter = searchAfter?.[i];
          const positionAfter = domAfter?.position;


          return {
            ...l,
            domAfter,
            positionAfter
          }
        })

        if (reNormalized) {
          reNormalized.forEach(nd => {
            listNodeAppear.push(nd)
          })
        }
      }

      if (isRemove) {
        const reNormalized = searchBefore?.map((l, i) => {

          const domBefore = searchBefore?.[i];
          const positionBefore = domBefore?.position;

          return {
            ...l,
            domBefore,
            positionBefore
          }
        })


        if (reNormalized) {
          reNormalized.forEach(nd => {
            listNodeHide.push(nd)
          })
        }

      }

    });

    indexTargetGetClass = 0

    // console.log('debug listNodeMoving', listNodeMoving);

    // /** Animate Hide */
    listNodeHide.forEach(chlNode => {
      if (chlNode.domBefore) {
        animateDOMHide(chlNode.domBefore.node, chlNode.positionBefore, containerPosition)
      }
    });

    /** Animate Moving */
    listNodeMoving.forEach(chlNode => {
      if (chlNode.domAfter) {
        animateDOMMove({
          domBefore: chlNode.domBefore?.node,
          domAfter: chlNode.domAfter.node,
          positionBefore: chlNode.positionBefore,
          positionAfter: chlNode.positionAfter,
          containerPosition
        })
      }
    });

    console.log('debug listNodeAppear', listNodeAppear);

    /** Animate Appear */
    listNodeAppear.forEach((chlNode: { domAfter: { node: any; }; positionAfter: any; }) => {
      if (chlNode.domAfter) {
        animateDOMAppear({ domAfter: chlNode.domAfter.node, positionAfter: chlNode.positionAfter, containerPosition })
      }
    });


  };

  const handleRunCode = async () => {
    const innerHTMLBef = beforeRef?.current?.refEditor?.childNodes[2].children[0].children[2].innerHTML;
    const innerHTML = editorRef?.current?.refEditor?.childNodes[2].children[0].children[2].innerHTML;

    setData(new Date())

    if (innerHTML) {
      setBefore(innerHTMLBef)
      setSet(innerHTML)
    }

    const test = diffTest(upEditorCode, bottomEditorCode)
    // console.log('debug test', test);
    const calculateDiff = dmp.diff_main(upEditorCode.replace(/\s+/g, ' '), bottomEditorCode.replace(/\s+/g, ' '));
    // console.log('debug test', test);
    // console.log('debug calculateDiff', calculateDiff);
    dmp.diff_cleanupSemantic(calculateDiff)
    setOutputDiff(calculateDiff);

    // console.log('debug dmp.diff_cleanupSemantic(diff);',);
    // console.log('debug calculateDiff', calculateDiff);
  };

  // console.log('debug outputDiff', outputDiff);

  // useEffect(() => {
  //   const calculateDiff = dmp.diff_main(upEditorCode, bottomEditorCode);
  //   setOutputDiff(calculateDiff);
  // }, [])

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
          <button
            onClick={() => {
              setUpEditorCode(`const isExample = animations.some(() => {})`)
              setBottomEditorCode(`const isExample = animations.some((animation) => {
              return animation.looksAwesome()
            })`)
            }}
          >
            Example 1
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
          <AnimatedSection
            key={data}
            html={set}
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