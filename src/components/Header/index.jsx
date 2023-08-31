import { css } from '@emotion/react'

const Header = () => {

    console.log(css`
    padding: 32px;
    background-color: hotpink;
    font-size: 24px;
    border-radius: 4px;
    `)

    return (
        <h1 className={css`
        padding: 32px;
        background-color: hotpink;
        font-size: 24px;
        border-radius: 4px;
        `}> Header</ h1>
    )
}

export default Header