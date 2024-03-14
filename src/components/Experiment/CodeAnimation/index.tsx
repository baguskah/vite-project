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
import { DOMData, animateDOMAppear, animateDOMMove, dataExample, selectElementsInSequence } from './helpers/selectElementInSequence'

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

const CodeAnimation = () => {
  const [outputDiff, setOutputDiff] = useState<any>([]);

  const [upEditorCode, setUpEditorCode] = useState(`const isExample = animations.some(() => {})`);
  const [bottomEditorCode, setBottomEditorCode] = useState(`const isExample = animations.some((animation) => {
  return animation.looksAwesome()
})`);

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
    const joinedDiff = outputDiff.map(v => v[1]).join("");
    const tokenizeunionDiff = aceTokenizer.tokenize(joinedDiff, new JavaScriptHighlightRules());
    const tokenizeValueBefore = aceTokenizer.tokenize(upEditorCode, new JavaScriptHighlightRules());
    const tokenizeValueAfter = aceTokenizer.tokenize(bottomEditorCode, new JavaScriptHighlightRules());
    /** Comparation Engine End */

    outputDiff.forEach(element => {
      const isPersist = element[0] === 0;
      const isNew = element[0] === 1;
      const isRemove = element[0] === -1

      /** This token not fully match with reality TODO:! */
      const codeValue = element[1] as string;

      const breakDown = aceTokenizer.tokenize(codeValue, new JavaScriptHighlightRules());
      console.log('debug breakDown', breakDown);

      const listClassAndValue: DOMData[] = [];

      // filter listArray, eliminate Token Result that only give empty array
      breakDown.forEach(arr => {
        if (arr.length > 0) {
          arr.forEach(objToken => {
            if (objToken.className !== undefined) {
              listClassAndValue.push(objToken)
            }
          })
        }
      })

      /**List yang bertahan dan pindah 
       * 1. Bentuk Dom dengan tokenizer
       * 2. Capture Position Sebelum ambil getBoundingClientRect()
       * 3. Capture Position Sesudah ambil getBoundingClientRect()
      */
      if (isPersist) {
        const searchBefore = selectElementsInSequence(listClassAndValue, htmlBefore);
        const searchAfter = selectElementsInSequence(listClassAndValue, htmlAfter)


        const reNormalized = listClassAndValue.map((l, i) => {
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
        const searchAfter = selectElementsInSequence(listClassAndValue, htmlAfter)
        const reNormalized = listClassAndValue.map((l, i) => {

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

    if (listNodeMoving.length === 0) {
      return
    }


    /** Animate Moving */
    listNodeMoving.forEach(chlNode => {
      if (chlNode.domAfter) {
        animateDOMMove(chlNode.domAfter.node, chlNode.positionBefore, chlNode.positionAfter, containerPosition)
      }
    });

    /** Animate Appear */
    listNodeAppear.forEach(chlNode => {
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