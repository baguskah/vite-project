
import DiffMatchPatch from "diff-match-patch";
import 'diff-match-patch-line-and-word';

export interface DOMData {
    className: string;
    value: string;
    idxPosition?: number;
    idxPositionBefore?: number;
    idxPositionAfter?: number;
    // positionNormInBefore?: number,
    // positionNormInAfter?: number,
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

    // if (searchFor === "after") {
    //     console.log('debug listAllSpanNode after', listAllSpanNode);
    // }

    // if (searchFor === "before") {
    //     console.log('debug listAllSpanNode before', listAllSpanNode);
    // }


    listClassAndValueWithNormPosition.forEach(element => {
        let normPosition: number | undefined = undefined;

        if (searchFor === 'before') {
            normPosition = element.idxPositionBefore
        }

        if (searchFor === 'after') {
            normPosition = element.idxPositionAfter
        }

        const theTrulyNodeTarget = listAllSpanNode[normPosition!];

        // To do Animation Appear, in DOM after all element will hide
        if (searchFor === 'after' && theTrulyNodeTarget) {
            theTrulyNodeTarget.style.opacity = 0
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
        // if (capture === 'after' && value === "theTrulyNodeTarget") {
        //     console.log('debug {data}', { v: value, c: spanClassName, idxSimilarWord, findData });

        // }


        if (findData.length === 0) {
            return undefined
        }

        if (findData.length === 1) {
            if (capture === 'before') {
                return findData[0].idxPositionBefore
            }

            if (capture === 'after') {
                return findData[0].idxPositionAfter
            }

        }

        // to get index word if similiar word found
        if (findData.length > 1) {
            if (capture === 'before') {
                return findData[idxSimilarWord]?.idxPositionBefore
            }
            if (capture === 'after') {
                return findData[idxSimilarWord]?.idxPositionAfter
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

    if (theNode) {
        const nodeStyle = theNode.style;
        // nodeStyle.color = 'yellow'
        nodeStyle.position = "absolute";
        nodeStyle.left = `${positionBefore?.x - containerPosition?.x}px`;
        nodeStyle.top = `${positionBefore?.y - containerPosition?.y}px`;
        nodeStyle.transition = 'left 1s, top 1s';

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