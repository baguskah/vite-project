import React, { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import { Flipper, Flipped } from "react-flip-toolkit";
import DiffMatchPatch from "diff-match-patch";
import * as prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import * as prettierPluginBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
import hljs from 'highlight.js';
import "highlight.js/styles/atom-one-dark.css";

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
  const [output, setOutput] = useState<any>([]);
  
  const [upEditorCode, setUpEditorCode] = useState(`const isExample = animations.some(() => {})`);
  const [bottomEditorCode, setBottomEditorCode] = useState(`const isExample = animations.some((animation) => {
  return animation.looksAwesome()
})`);

  const [before, setBefore] = useState()
  const [set, setSet] = useState()

  const beforeRef = useRef();
  const editorRef = useRef()


  const [flipperData, setFlipperData] = useState([]);


  useEffect(() => {
    const innerHTMLBef = beforeRef?.current?.refEditor?.childNodes[2].children[0].children[2].innerHTML;
    const innerHTML = editorRef?.current?.refEditor?.childNodes[2].children[0].children[2].innerHTML;


    if (innerHTML) {
      setBefore(innerHTMLBef)
      setSet(innerHTML)
    }
  }, [])

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
    // const giveIdForEachData = output.map((v, i) => [...v, i]);
    // const filterInitialData = giveIdForEachData.filter((v) => v[0] !== 1);
    // const showAllData = giveIdForEachData.filter((v) => v[0] !== -1);

    // setFlipperData(filterInitialData);

    // setTimeout(() => {
    //   setFlipperData(showAllData);
    // }, 1000);
  };

  const handleRunCode = async () => {

    // const prettyPrevCode = await prettier.format(upEditorCode, {
    //   semi: true,
    //   parser: "babel",
    //   plugins: [prettierPluginBabel, prettierPluginEstree],
    // });

    // const prettyAfterCode = await prettier.format(bottomEditorCode, {
    //   semi: true,
    //   parser: "babel",
    //   plugins: [prettierPluginBabel, prettierPluginEstree],
    // });

    // const highlightedCodeBefore = hljs.highlight(upEditorCode, { language: 'javascript' }).value
    // const highlightedCodeAfter = hljs.highlight(bottomEditorCode, { language: 'javascript' }).value

    const calculateDiff = dmp.diff_main(upEditorCode, bottomEditorCode);
    console.log('debug calculateDiff', calculateDiff);
    setOutput(calculateDiff);
  };

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
          <AnimatedSection html={set} beforeHtlk={before} />
          {/* <code>
            <div>

              {output}
              <Flipper
                flipKey={flipperData.map((item) => item[1]).join("")}
                staggerConfig={{
                  default: {
                    speed: 0.025,
                  },
                }}
              >
                <div>

                  {flipperData.map((item) => {
                    const key = item[2];
                    const value = item[1];

                    // return value

                    return (
                      <Flipped key={key} flipId={key}>
                        <span className="inline-block" dangerouslySetInnerHTML={{ __html: normalizeHTML(value) }}></span>
                      </Flipped>
                    );
                  })}
                </div>
              </Flipper>
            </div>
          </code> */}

        </div>
      </div>
    </div>
  );
};

export default CodeAnimation;


// Mungkin lebih tepatnya gini. Programmer mungkin bisa dibilang jago, kalau dia bisa memecahkan masalah, dia memiliki alasan dari apa yang dia tulis pada kodenya. Alasan itulah yang menguatkan, sumbernya bisa dari pengalaman, dokumentasi, dll. 