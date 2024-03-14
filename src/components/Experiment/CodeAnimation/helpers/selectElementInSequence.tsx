interface DOMData {
    className: string;
    value: string;
}



export function selectElementsInSequence(data: DOMData[], htmlRef: HTMLElement): HTMLElement[] | null {
    const sequenceElements: HTMLElement[] = [];
    let finalData = []

    const listNode = htmlRef.childNodes;

    const nodeFound: ChildNode[] = []
    //  console.log('debug takeOutText', takeOutText);
    Array.from(listNode).forEach(lineNode => {
        const listNode = lineNode.childNodes;
        const onlySpanInOneLine = Array.from(listNode).filter(v => v.nodeName === "SPAN");

        const startDataSearch = data[0]
        const startClassName = startDataSearch.className;
        const startValue = startDataSearch.value

        const startIndexFind = onlySpanInOneLine.findIndex(spanNode => {
            return spanNode.className === startClassName && spanNode.innerText === startValue
        })

        let found = false;

        for (let index = 0; index < data.length; index++) {
            const theNode = onlySpanInOneLine[startIndexFind + index];

            const isSame = theNode?.className === data[index].className && theNode?.innerText === data[index].value
            if (isSame) {
                nodeFound.push(theNode)
                found = true;
            } else {
                nodeFound.splice(0, nodeFound.length)
                found = false;
                break;
            }
        }

        // Seiringan Urutannya
        if (found) {
            finalData = data.map((d, i) => ({ ...d, node: nodeFound[i], position: nodeFound[i].getBoundingClientRect() }));
        }


    })

    return finalData
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


