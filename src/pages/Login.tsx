import { useMutation } from '@apollo/client'
import { FunctionComponent, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { setAccessToken } from '../accessToken'
import { loginMutation } from '../graphql/login'
import { meQuery } from '../graphql/me'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { IUser } from '../models/user'
import { Button, Card, CardContent, Grid, TextField, IconButton, InputAdornment, LinearProgress, Typography } from '@material-ui/core'
import { Alert } from "@material-ui/lab";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const Login: FunctionComponent<RouteComponentProps> = ({ history }) => {
    const [loading, setLoading] = useState(false);
    const [failedMessage, setFailedMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { control, handleSubmit } = useForm<IUser>()
    const [login] = useMutation(loginMutation)

    const onFormSubmit: SubmitHandler<IUser> = async (data) => {
        setLoading(true);
        setFailedMessage("");
        const response = await login({
            variables: {
                email: data?.email,
                password: data?.password
            },
            update: (store, { data }) => {
                if (!data) {
                    return null;
                }
                store.writeQuery({
                    query: meQuery,
                    data: {
                        __typename: 'Query',
                        me: data.login.user
                    }
                })
            }
        })

        if (response.data.login.accessToken) {
            setAccessToken(response.data.login.accessToken)
        }

        history.push("/todos");

    };
    return (

        <div
            className="login"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
            }}
        >
            <Card variant="outlined">
                <CardContent>
                    {loading && <LinearProgress />}
                    <br />
                    <Typography variant="h5" component="h4">
                        Login Form
                    </Typography>

                    <br />
                    <form onSubmit={handleSubmit(onFormSubmit)}>
                        {failedMessage && <Alert severity="error">{failedMessage}</Alert>}
                        <Grid container direction="column">
                            <Grid item>
                                <Controller
                                    control={control}
                                    name="email"
                                    rules={{
                                        required: "Email is required",
                                    }}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <TextField
                                                fullWidth
                                                error={!!error || !!failedMessage}
                                                helperText={error?.message}
                                                label="Email"
                                                {...field}
                                            />
                                        </>
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid item>
                            <Controller
                                control={control}
                                name="password"
                                rules={{
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters long",
                                    },
                                }}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        fullWidth
                                        error={!!error || !!failedMessage}
                                        helperText={error?.message}
                                        label="Password"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        type={showPassword ? "text" : "password"}
                                        {...field}
                                    />
                                )}
                            />
                        </Grid>
                        <br />
                        <Button variant="contained" color="primary" type="submit">
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login