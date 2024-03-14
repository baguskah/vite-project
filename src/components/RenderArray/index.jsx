import { useState } from "react";
import { useEffect } from "react";

/* eslint-disable react/prop-types */
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

const profpics = [
    'https://randomuser.me/api/portraits/men/54.jpg',
    'https://randomuser.me/api/portraits/women/29.jpg',
    'https://randomuser.me/api/portraits/women/43.jpg',
]

const Avatar = (props) => (
    <>
        <img
            className="avatar"
            width={80}
            height={80}
            src={props.src} />
        <input name="nickname"></input>
    </>
)


const RenderArray = () => {
    const [profpic, setProfpics] = useState([])

    useEffect(() => {
        const id = setInterval(() => {
            setProfpics([...shuffle(profpics)])
        }, 2000)

        return () => {
            clearInterval(id)
        }
    }, [])

    return (
        <>
            {
                profpic.map((profpic) => (
                    <Avatar src={profpic} key={profpic} />
                ))
            }
        </>
    )
}

export default RenderArray