import React, { LegacyRef, MutableRefObject, useEffect, useRef } from "react"
import "ace-builds/src-noconflict/theme-one_dark";

export default function AnimatedSection({ html, beforeHtlk, befResultRef, aftResultRef, containerRef }) {


  return (
    <div ref={containerRef} className="ace_editor ace-one-dark h-full" id="container-animation" style={{ overflow: 'visible', position: 'relative' }}>
      <div id="before" style={{ opacity: 0, position: 'absolute' }} ref={befResultRef} dangerouslySetInnerHTML={{ __html: beforeHtlk }}></div>
      <div id="after" ref={aftResultRef} dangerouslySetInnerHTML={{ __html: html }}></div>
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