import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/auth-context";

function PrivateRoute({ component: Component, ...rest }) {
    const {authData} = useAuth();

    return (
        <Route
            {...rest}
            render={props =>
                authData ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
}

export default PrivateRoute;