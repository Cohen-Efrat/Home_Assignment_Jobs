import React, {useState} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import PrivateRoute from '../routers/PrivateRoute';
import Main from "./Main";
import LoginPage from "./LoginPage";
import {AuthContext} from '../context/auth-context'

function App(props) {
    const existingData = JSON.parse(localStorage.getItem("data"));
    const [authData, setAuthData] = useState(existingData);
    const setData = (data) => {
        localStorage.setItem("data", JSON.stringify(data));
        setAuthData(data);
    }
    return (
        <AuthContext.Provider value={{authData, setAuthData: setData}}>
            <Router>
                <div>
                    <Route path="/login" component={LoginPage}/>
                    <PrivateRoute exact path="/" component={Main}/>
                </div>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;