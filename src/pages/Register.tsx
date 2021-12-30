import { useMutation } from '@apollo/client'
import { FunctionComponent, useState } from 'react'
import { RegisterMutation } from '../graphql/register'
import { RouteComponentProps } from 'react-router-dom'

const Register: FunctionComponent<RouteComponentProps> = ({ history }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [register] = useMutation(RegisterMutation)
    return (
        <form
            onSubmit={async e => {
                e.preventDefault();
                console.log("form submitted");
                const response = await register({
                    variables: {
                        email,
                        password
                    }
                });
                console.log(response);

                history.push("/");
            }}
        >
            <div>
                <input
                    value={email}
                    placeholder="email"
                    onChange={e => {
                        setEmail(e.target.value);
                    }}
                />
            </div>
            <div>
                <input
                    type="password"
                    value={password}
                    placeholder="password"
                    onChange={e => {
                        setPassword(e.target.value);
                    }}
                />
            </div>
            <button type="submit">register</button>
        </form>
    )
}

export default Register