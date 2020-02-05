import React, { Component } from 'react';
import './App.scss';
import history from './services/history';


import {BrowserRouter} from 'react-router-dom';
import Routes from "./components/Routes";
import { init, getColleges } from './reducers/actions';

import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import Notifications from './components/Notifications.jsx';

class App extends Component {
    constructor(props) {
        super(props);

        ReactGA.initialize('UA-140414966-1');

        ReactGA.pageview(history.location.pathname);

        history.listen(route => {
            ReactGA.pageview(route.pathname);
        });
    }

    componentDidMount(){
        this.props.init();

        this.props.getColleges();
    }

    render() {
        return (
            <div className="App">
                <Notifications />
                <BrowserRouter>
                    <Routes />
                </BrowserRouter>
                <ReduxToastr
                    position={'bottom-right'}
                    progressBar
                    closeOnToastrClick />
            </div>
        );
    }
}

export default connect(null, {init, getColleges})(App);
