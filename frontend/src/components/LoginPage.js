import React, {useState} from 'react';
import {Redirect} from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import {
    Button, TextField, Typography, Container,
} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import {makeStyles} from '@material-ui/core/styles';
import {useAuth} from "../context/auth-context"
import httpAgent from "../util/httpAgent";


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
}));


export default function LoginPage() {
    const classes = useStyles();
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const {setAuthData} = useAuth();

    const login = async (e) => {
        e.preventDefault()
        const response = await httpAgent.post('/users/login', {
            email: userName,
            password
        }, {})
        if (response.user) {
            setAuthData({user: response.user, token: response.token});
            setLoggedIn(true);
        } else {
            setIsError(true);
        }
    }

    if (isLoggedIn) {
        return <Redirect to="/"/>;
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                {isError && <Alert severity="warning">The username or password provided were incorrect!</Alert>}
                <form className={classes.form} noValidate onSubmit={login}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Sign In
                    </Button>
                </form>
            </div>
        </Container>
    );
}