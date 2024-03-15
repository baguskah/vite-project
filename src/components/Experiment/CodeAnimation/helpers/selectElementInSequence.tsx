export interface DOMData {
    className: string;
    value: string;
    idxPosition?: number;
    normPosition?: number;
    positionNormInBefore?: number,
    positionNormInAfter?: number
}

export function selectElementsInSequence(data: DOMData[], htmlRef: HTMLElement, searchFor: 'before' | 'after'): HTMLElement[] | null {
    let finalData = []

    if (!data.length) {
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

        // END PLAYGROUND

        // const startDataSearch = data[0]
        // const startClassName = startDataSearch.className;
        // const startValue = startDataSearch.value

        // const startIndexFind = onlySpanInOneLine.findIndex(spanNode => {
        //     return spanNode.className === startClassName && spanNode.innerText === startValue
        // })

        // let found = false;

        // for (let index = 0; index < data.length; index++) {
        //     const theNode = onlySpanInOneLine[startIndexFind + index];

        //     const isSame = theNode?.className === data[index].className && theNode?.innerText === data[index].value
        //     if (isSame) {
        //         nodeFound.push(theNode)
        //         found = true;
        //     } else {
        //         nodeFound.splice(0, nodeFound.length)
        //         found = false;
        //         break;
        //     }
        // }

        // // Seiringan Urutannya
        // if (found) {
        //     finalData = data.map((d, i) => ({ ...d, node: nodeFound[i], position: nodeFound[i].getBoundingClientRect() }));
        // }


    })

    // console.log('debug data.', data);

    // listAllSpanNode.forEach((el, i) => {
    //     finalData.push({ ...data[i], node: el, position: el.getBoundingClientRect() })
    // })

    data.forEach(element => {
        let normPosition = element.normPosition;

        if (searchFor === 'before') {
            normPosition = element.positionNormInBefore
        }

        if (searchFor === 'after') {
            normPosition = element.positionNormInAfter
        }

        const theTrulyNodeTarget = listAllSpanNode[normPosition!]
        if (theTrulyNodeTarget) {
            finalData.push({ ...element, node: theTrulyNodeTarget, position: theTrulyNodeTarget.getBoundingClientRect() })
        }
    });

    return finalData
}

export const searchNormPositionBasedOnValueToken = ({
    value,
    tokenizedSequence,
    idxSimilarWord
}: {
    value: string,
    tokenizedSequence: DOMData[],
    idxSimilarWord: number
}) => {
    if (value) {
        const findData = tokenizedSequence.filter(v => v.value === value);

        if (findData.length === 0) {
            return undefined
        }

        if (findData.length === 1) {
            return findData[0].normPosition
        }

        // to get index word if similiar word found
        if (findData.length > 1) {
            return findData[idxSimilarWord].normPosition
        }
    }
}

export const dataExample: DOMData[] = [
    {
        "className": "ace_paren ace_rparen",
        "value": ")"
    },
    {
        "className": "ace_storage ace_type",
        "value": "=>"
    },
    {
        "className": "ace_paren ace_lparen",
        "value": "{"
    }
];


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

