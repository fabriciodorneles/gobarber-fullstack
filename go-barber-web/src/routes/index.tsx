import React from 'react';
// switch garante que apenas uma rota seja mostrada a cada momento
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/Signin';
import SignUp from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Profile from '../pages/Profile';

const Routes: React.FC = () => (
    <Switch>
        <Route path="/" exact component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/profile" component={Profile} isPrivate />
        <Route path="/dashboard" component={Dashboard} isPrivate />
    </Switch>
);

export default Routes;
