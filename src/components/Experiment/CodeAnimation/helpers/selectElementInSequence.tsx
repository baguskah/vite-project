
import DiffMatchPatch from "diff-match-patch";
import 'diff-match-patch-line-and-word';

export interface DOMData {
    className: string;
    value: string;
    idxPosition?: number;
    idxPositionBeforeOriginal?: number;
    idxPositionAfterOriginal?: number;
    idxPositionBefore?: number;
    idxPositionAfter?: number;
    statusNumber: -1 | 0 | 1 // -1 ilang 0 tetap 1 muncul
}


export function diffTest(text1, text2) {
    var dmp = new DiffMatchPatch();
    var a = dmp.diff_wordMode(text1, text2);
    // var lineText1 = a.chars1;
    // var lineText2 = a.chars2;
    // var lineArray = a.lineArray;
    // var diffs = dmp.diff_main(lineText1, lineText2);
    // dmp.diff_charsToLines_(diffs, lineArray);

    // console.log('debug a', a);

    return a;
}

export function selectElementsInSequence(listClassAndValueWithNormPosition: DOMData[], htmlRef: HTMLElement, searchFor: 'before' | 'after'): HTMLElement[] | null {
    let finalData = []

    if (!listClassAndValueWithNormPosition.length) {
        return finalData
    }



    const listNode = htmlRef.childNodes;

    const listAllSpanNode: ChildNode[] = []
    const nodeFound: ChildNode[] = []

    Array.from(listNode).forEach(lineNode => {
        const listNode = lineNode.childNodes;
        const onlySpanInOneLine = Array.from(listNode).filter(v => v.nodeName === "SPAN");


        if (!onlySpanInOneLine.length) {
            return;
        }


        onlySpanInOneLine.forEach(arSpan => {
            const classRemove = ["ace_indent-guide"]

            if (!classRemove.includes(arSpan.className)) {
                listAllSpanNode.push(arSpan)
            }
        })
    })

    if (searchFor === "before") {
        // console.log('debug listClassAndValueWithNormPosition before', listClassAndValueWithNormPosition);
    }


    listClassAndValueWithNormPosition.forEach(element => {
        let normPosition: number | undefined = undefined;

        if (searchFor === 'before') {
            normPosition = element.idxPositionBefore
        }

        if (searchFor === 'after') {
            normPosition = element.idxPositionAfter
        }



        const theTrulyNodeTarget = listAllSpanNode[normPosition!];

        // if (searchFor === "before" && element.value === "theTrulyNodeTarget") {
        //     console.log('debug {data}', { element, normPosition, listAllSpanNode, theTrulyNodeTarget });
        // }

        // To do Animation Appear, in DOM after all element will hide
        if (searchFor === 'after' && theTrulyNodeTarget) {
            theTrulyNodeTarget.style.opacity = 0 // TURN OFF IF DEBUG
        }


        if (theTrulyNodeTarget) {
            finalData.push({ ...element, node: theTrulyNodeTarget, position: theTrulyNodeTarget.getBoundingClientRect() })
        }
    });

    return finalData
}

export const searchNormPositionBasedOnValueToken = ({
    value,
    tokenizedSequence,
    idxSimilarWord,
    capture,
    spanClassName
}: {
    value: string,
    tokenizedSequence: DOMData[],
    idxSimilarWord: number
    capture: 'after' | 'before',
    spanClassName: string | undefined
}) => {
    if (value) {


        const findData = tokenizedSequence.filter(v => v.value === value && v.className === spanClassName);
        if (value === ";") {
            // console.log('debug findData', value, findData, idxSimilarWord);
            // console.log('debug {data}', { v: value, c: spanClassName, idxSimilarWord, findData, tokenizedSequence });
        }


        if (findData.length === 0) {
            return undefined
        }

        if (findData.length === 1) {
            if (capture === 'before') {
                return findData[idxSimilarWord]?.idxPositionBeforeOriginal
            }

            if (capture === 'after') {
                return findData[idxSimilarWord]?.idxPositionAfterOriginal
            }

        }

        // to get index word if similiar word found
        if (findData.length > 1) {
            if (capture === 'before') {
                return findData[idxSimilarWord]?.idxPositionBeforeOriginal
            }
            if (capture === 'after') {
                return findData[idxSimilarWord]?.idxPositionAfterOriginal
            }
        }
    }
}


/**
 * Animation Sequence
 * 1. Removing / Hiding
 * 2. Move
 * 3. Appearing 
 */


export function animateDOMHide(childNodes, positionBefore, containerPosition) {
    const theNode = childNodes;
    if (theNode) {
        const nodeStyle = theNode.style;
        // nodeStyle.color = 'yellow'
        nodeStyle.position = "absolute";
        theNode.style.left = positionBefore.x - containerPosition.x + 'px';
        theNode.style.top = positionBefore.y - containerPosition.y + 'px';
        theNode.style.opacity = 1;

    }

    setTimeout(() => {
        theNode.style.opacity = 0;
        theNode.style.transition = 'opacity 0.5s';
    }, 1); // Delay in milliseconds (adjust as needed)
}


export function animateDOMMove({ domBefore, domAfter, positionBefore, positionAfter, containerPosition }) {
    const theNode = domBefore;

    const leftBefore = `${positionBefore?.x - containerPosition?.x}px`;
    const leftAfter = positionAfter?.x - containerPosition?.x + 'px';

    if (theNode.innerHTML === "(") {
        console.log('debug data', { leftBefore, leftAfter });
    }


    if (theNode) {
        const nodeStyle = theNode.style;
        // nodeStyle.color = 'yellow'
        nodeStyle.position = "absolute";
        nodeStyle.left = `${positionBefore?.x - containerPosition?.x}px`;
        nodeStyle.top = `${positionBefore?.y - containerPosition?.y}px`;
        nodeStyle.transition = 'left 1s, top 1s';


        // console.log('debug data', { pBefore: positionBefore.x, pAfter: positionAfter.x });
        setTimeout(() => {
            theNode.style.left = positionAfter?.x - containerPosition?.x + 'px';
            theNode.style.top = positionAfter?.y - containerPosition?.y + 'px';
        }, 1000); // Delay in milliseconds (adjust as needed)


    }


}

export function animateDOMAppear({ domAfter, positionAfter, containerPosition }) {
    const theNode = domAfter;

    // Because all element are hide in SearchElementInSequence 
    // And the parent has 0 opacity, then first make container after 1 opacity


    if (theNode) {
        const nodeStyle = theNode.style;
        // nodeStyle.color = 'yellow'
        nodeStyle.position = "absolute";
        theNode.style.left = positionAfter.x - containerPosition.x + 'px';
        theNode.style.top = positionAfter.y - containerPosition.y + 'px';
        theNode.style.opacity = 0;

    }

    setTimeout(() => {
        theNode.style.opacity = 1;
        theNode.style.transition = 'opacity 0.5s';
    }, 2000); // Delay in milliseconds (adjust as needed)
}


export function removeObjectFromArray(arr, { value, className }) {
    const index = arr.findIndex(obj => obj.value === value && obj.className === className);
    if (index !== -1) {
        arr.splice(index, 1);
    }
}