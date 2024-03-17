export interface DOMData {
    className: string;
    value: string;
    idxPosition?: number;
    normPosition?: number;
    positionNormInBefore?: number,
    positionNormInAfter?: number,
    statusNumber: -1 | 0 | 1 // -1 ilang 0 tetap 1 muncul
}

export function selectElementsInSequence(listClassAndValueWithNormPosition: DOMData[], htmlRef: HTMLElement, searchFor: 'before' | 'after'): HTMLElement[] | null {
    let finalData = []

    if (!listClassAndValueWithNormPosition.length) {
        return finalData
    }

    const listNode = htmlRef.childNodes;

    const listAllSpanNode: ChildNode[] = []
    const nodeFound: ChildNode[] = []
    //  console.log('debug takeOutText', takeOutText);


    Array.from(listNode).forEach(lineNode => {
        const listNode = lineNode.childNodes;
        const onlySpanInOneLine = Array.from(listNode).filter(v => v.nodeName === "SPAN");


        if (!onlySpanInOneLine.length) {
            return;
        }

        onlySpanInOneLine.forEach(arSpan => listAllSpanNode.push(arSpan))
    })


    listClassAndValueWithNormPosition.forEach(element => {
        let normPosition: number | undefined = undefined;

        if (searchFor === 'before') {
            normPosition = element.positionNormInBefore
        }

        if (searchFor === 'after') {
            normPosition = element.positionNormInAfter
        }

        const theTrulyNodeTarget = listAllSpanNode[normPosition!];



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

        // if (value === "}") {
        //     console.log('debug tokenizedSequence', tokenizedSequence);
        //      console.log('debug data', data);
        //     console.log('debug spanClassName', spanClassName);
        // }

        if (findData.length === 0) {
            return undefined
        }

        if (findData.length === 1) {
            return findData[0].normPosition
        }

        // to get index word if similiar word found
        if (findData.length > 1) {
            return findData[idxSimilarWord]?.normPosition
        }
    }
}


export function animateDOMMove(childNodes, positionBefore, positionAfter, containerPosition) {
    const theNode = childNodes;
    if (theNode) {
        const nodeStyle = theNode.style;
        // nodeStyle.color = 'yellow'
        nodeStyle.position = "absolute";
        nodeStyle.left = `${positionBefore?.x - containerPosition?.x}px`;
        nodeStyle.top = `${positionBefore?.y - containerPosition?.y}px`;
        nodeStyle.transition = 'left 1s, top 1s';
    }

    setTimeout(() => {
        theNode.style.left = positionAfter?.x - containerPosition?.x + 'px';
        theNode.style.top = positionAfter?.y - containerPosition?.y + 'px';
    }, 1000); // Delay in milliseconds (adjust as needed)
}

export function animateDOMAppear(childNodes, positionAfter, containerPosition) {
    const theNode = childNodes;
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
        theNode.style.transition = 'opacity 1s';
    }, 2000); // Delay in milliseconds (adjust as needed)
}

