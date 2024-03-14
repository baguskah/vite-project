import React, { LegacyRef, MutableRefObject, useEffect, useRef } from "react"
import aceTokenizer from "ace-code/src/ext/simple_tokenizer"
import { JavaScriptHighlightRules } from "ace-code/src/mode/javascript_highlight_rules";
import { DOMData, animateDOM, dataExample, selectElementsInSequence } from './helpers/selectElementInSequence'

import "ace-builds/src-noconflict/theme-one_dark";

import DiffMatchPatch from "diff-match-patch";
const dmp = new DiffMatchPatch();

export default function AnimatedSection({ html, beforeHtlk }) {
  const befRef = useRef()
  const aftRef = useRef()
  const containerRef = useRef()

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



  useEffect(() => {
    const htmlBefore = befRef.current as unknown as HTMLElement;
    const htmlAfter = aftRef.current as unknown as HTMLElement;
    const htmlContainer = containerRef.current as unknown as HTMLElement;
    const containerPosition = htmlContainer.getBoundingClientRect()


    const listNodeMoving: any = [];

    differ.forEach(element => {
      const isPersist = element[0] === 0;
      const codeValue = element[1] as string;

      const breakDown = aceTokenizer.tokenize(codeValue, new JavaScriptHighlightRules());

      // filter listArray, eliminate Token Result that only give []
      const listClassAndValue: DOMData[] = []

      /**List yang bertahan dan pindah */
      // Bentuk Dom dengan tokenizer
      // Capture Position Sebelum ambil getBoundingClientRect()
      // Capture Position Sesudah ambil getBoundingClientRect()
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
    });

    if (listNodeMoving.length === 0) {
      return
    }

    listNodeMoving.forEach(chlNode => {
      console.log('debug chlNode.chlNode', chlNode);
      if (chlNode.domAfter) {
        animateDOM(chlNode.domAfter.node, chlNode.positionBefore, chlNode.positionAfter, containerPosition)
      }
    });

  }, [])


  return (
    <div ref={containerRef} className="ace_editor ace-one-dark h-full" id="container-animation" style={{ overflow: 'visible', position: 'relative' }}>
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