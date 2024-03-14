import React, { LegacyRef, MutableRefObject, useEffect, useRef } from "react"
import aceTokenizer from "ace-code/src/ext/simple_tokenizer"
import { JavaScriptHighlightRules } from "ace-code/src/mode/javascript_highlight_rules";
import { dataExample, selectElementsInSequence } from './helpers/selectElementInSequence'

import "ace-builds/src-noconflict/theme-one_dark";

import DiffMatchPatch from "diff-match-patch";
const dmp = new DiffMatchPatch();

export default function AnimatedSection({ html, beforeHtlk }) {
  const befRef = useRef()
  const aftRef = useRef()

  const differ = [
    [
      0,
      "const isExample = animations.some(("
    ],
    [
      1,
      "animation"
    ],
    [
      0,
      ") => {"
    ],
    [
      1,
      "\n  return animation.looksAwesome()\n"
    ],
    [
      0,
      "})"
    ]
  ]

  /**List yang bertahan dan pindah */
  // Bentuk Dom dengan tokenizer
  // Capture Position Sebelum ambil getBoundingClientRect()
  // Capture Position Sesudah ambil getBoundingClientRect()

  useEffect(() => {
    const htmlBefore = befRef.current;
    const htmlAfter = aftRef.current;

    const test = selectElementsInSequence(dataExample, htmlAfter)
    console.log('debug test', test);

    differ.forEach(element => {
      const isPersist = element[0] === 0;
      const codeValue = element[1] as string;

      const breakDown = aceTokenizer.tokenize(codeValue, new JavaScriptHighlightRules());
      // filter listArray contain
      const listClassAndValue: Record<string, string | number>[] = []

      if (isPersist) {
        const newBreakdownFiltered = breakDown.forEach(arr => {
          if (arr.length > 0) {
            arr.forEach(objToken => {
              if (objToken.className !== undefined) {
                listClassAndValue.push(objToken)
              }
            })
          }
        })
        console.log('debug listClassAndValue', listClassAndValue);
      }
    });





  }, [])


  return (
    <div className="ace_editor ace-one-dark h-full " style={{ overflow: 'visible', position: 'relative' }}>
      <div id="before" ref={befRef} dangerouslySetInnerHTML={{ __html: beforeHtlk }}></div>
      <div id="after" ref={aftRef} dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  )
}

/**
 * 1. Cek yang masih ada = 0, di HTML Before by value cari posisinya (Before position)
 * 2. Cek Before yang masih ada, Habis itu Hide
 * 3. Cek After yang baru = 1, cek position, habis itu fade in
 * 4. Cek After yang masih ada, di HTML after by value, cari posisinya (After Position)
 * 5. Cek After yang masih ada, Posisikan dari posisi before, ke posisi after poin 4
 */