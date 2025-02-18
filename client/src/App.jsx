import { useState } from "react"
import "./App.css"

function App() {
    const [resp, setResp] = useState("")

    // rudimentary sample api call. all api endpoints will be {domain}/api/endpoint-name
    const exampleAPICall = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/example")
            const data = await res.text();
            setResp(data)
        } catch (error) {
            console.error("Error fetching data:", error)
            setResp("Could not fetch data")
        }
    };

    return (
        <>
            <h1>Example API Call</h1>
            <div className="card">
                <button onClick={exampleAPICall}>Call</button>
                <p>{resp}</p>
                <p> Make sure back end is running and click the button </p>
            </div>
        </>
    )
}

export default App
