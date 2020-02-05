import React, { Component } from 'react';
import { Route, Router, Switch, Redirect } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import ViewTutor from './ViewTutor.jsx';
import FindTutor from './FindTutor.jsx';
import Home from './Home';
import history from './../services/history';
import PartialUpdate from './PartialUpdate';
import { LinkedInPopUp } from 'react-linkedin-login-oauth2';
import Layout from './Layout';
import Chat from './Chat/Chat';
import BecomeTutor from './BecomeTutor';
import Sessions from './Sessions/Sessions';
import Admin from './Admin';
import partnerWithTuron from './partnerWithTuron.jsx';
import NewSession from './Sessions/NewSession';
import SingleSession from './Sessions/SingleSession';
import Payments from './Payments';
import FAQ from './FAQ';

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
    <Route
        {...rest}
        render={props => (
            <Layout {...props}>
                <Component {...props} />
            </Layout>
        )}
    />
);

const isLogin = () => {
    if (localStorage.getItem('token')) {
        return true;
    }
    return false;
};

// const PrivateRoute = ({
//     component: Component,
//     redirectUrl: RedirectUrl,
//     ...rest
// }) => {
//     return (
//         // Show the component only when the user is logged in
//         // Otherwise, redirect the user to /signin page
//         <Route
//             {...rest}
//             render={props =>
//                 isLogin() ? (
//                     <Component {...props} />
//                 ) : (
//                     <Redirect
//                         to={{
//                             pathname: '/login',
//                             state: { redirectUrl: RedirectUrl },
//                         }}
//                     />
//                 )
//             }
//         />
//     );
// };

class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route
                        path="/linkedin_redirect"
                        component={LinkedInPopUp}
                    />
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
                    <Route
                        path="/finish-registration"
                        component={PartialUpdate}
                    />
                    <AppRoute
                        exact
                        path="/admin"
                        component={Admin}
                        layout={Layout}
                    />
                    <AppRoute
                        exact
                        path="/find-tutor"
                        component={FindTutor}
                        layout={Layout}
                    />
                    <AppRoute
                        exact
                        path="/find-tutor/:uid"
                        component={FindTutor}
                        layout={Layout}
                    />
                    <AppRoute
                        exact
                        path="/view-tutor/:pid"
                        component={ViewTutor}
                        layout={Layout}
                    />
                    <AppRoute
                        exact
                        path="/chat"
                        component={Chat}
                        layout={Layout}
                    />
                    <AppRoute
                        exact
                        path="/become-tutor"
                        component={BecomeTutor}
                        layout={Layout}
                    />
                    <AppRoute
                        exact
                        path="/become-tutor/:pid"
                        component={BecomeTutor}
                        layout={Layout}
                    />
                    <AppRoute
                        exact
                        path="/payments"
                        component={Payments}
                        layout={Layout}
                    />
                    <AppRoute
                        exact
                        path="/sessions"
                        component={Sessions}
                        layout={Layout}
                    />
                    <AppRoute
                        exact
                        path="/sessions/new"
                        component={NewSession}
                        layout={Layout}
                    />
                    <AppRoute
                        exact
                        path="/sessions/:id"
                        component={SingleSession}
                        layout={Layout}
                    />
                    <AppRoute
                        exact
                        path="/faq"
                        component={FAQ}
                        layout={Layout}
                    />
                    <Route
                        path="/partner-with-turon"
                        component={partnerWithTuron}
                    />

                    {/* <Route  path='/FindTutor' component={FindTutor}/>
                    <Route  path='/welcome' component={Welcome}/>
                    <Route  path='/ViewTutor' component={ViewTutor}/> */}
                </Switch>
            </Router>
        );
    }
}
export default Routes;
