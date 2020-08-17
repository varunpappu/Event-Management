import React from 'react';
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom';
import UserLogin from '../public-routes/login-page/UserLogin';
import RegisterUser from '../public-routes/registration-page/RegisterUser';
import EventCreation from '../private-routes/event-management/EventCreation';
import EventList from '../private-routes/event-management/EventList';
import EventViewer from '../private-routes/event-management/EventViewer';
import EventDashboard from '../private-routes/event-dashboard/EventDashboard';
import EventParticipation from '../private-routes/event-participation/EventParticipation';
import PrivateRoute from './Privateroutes';


export const Routes = () => {
    return (
        <BrowserRouter forceRefresh>
            <Switch>
                <Route exact path="/" render={() => (<Redirect to="/login" />)} />
                <Route exact path="/login" component={UserLogin} />
                <Route exact path="/register" component={RegisterUser} />
                <PrivateRoute exact path="/dashboard" component={EventDashboard} />
                <PrivateRoute exact path="/event/create" component={EventCreation} />
                <PrivateRoute exact path="/event/view" component={EventList} />
                <PrivateRoute exact path="/event/view/:_id" component={EventViewer} />
                <PrivateRoute exact path="/event/:_id/participate" component={EventParticipation} />
            </Switch>
        </BrowserRouter>
    );
};


export default Routes;
