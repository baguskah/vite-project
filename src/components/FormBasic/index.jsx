import { useState } from "react"

const FormBasic = () => {
    const [username, setUsername] = useState("")
    const [nickname, setNickname] = useState("")

    const handleSubmit = (e) => {
        console.log("triggered")
    }

    const handleChange = (e) => {
        const propertyName = e.target.name;

        if (propertyName === "username") {
            setUsername(e.target.value.toLowerCase())
        }

        if (propertyName === "nickname") {
            setNickname(e.target.value.toLowerCase)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>username: </label>
                <input
                    name="username"
                    value={username}
                    onChange={handleChange}
                    type="text"></input>
            </div>
            <div>
                <label>nickname: </label>
                <input name="nickname"
                    value={nickname}
                    onChange={handleChange}
                    type="text"></input>
            </div>
            <button type="submit">Submit</button>
        </form>
    )
}

export default FormBasic