import { useEffect, useState } from 'react'
import { setAccessToken } from './accessToken'
import Routes from './Routes'

export default function App() {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('http://localhost:4000/refreshToken', { method: "POST", credentials: "include" }).then(async (x) => {
            const { accessToken } = await x.json();
            setAccessToken(accessToken)
            setLoading(false)
        }
        )
    }, [])

    if (loading) {
        return <>
            Loading ...
        </>
    }

    return (
        <div>
            <Routes />
        </div>
    )
}
