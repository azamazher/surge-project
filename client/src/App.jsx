import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Route path="/login" exact component={Login} />
                <Route path="/register" exact component={Register} />
                <Route path="/dashboard" exact component={Dashboard} />
                <Redirect exact from="/" to="login" />
            </BrowserRouter>
        </div>
    )
}

export default App