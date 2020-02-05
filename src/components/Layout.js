import React from 'react';
import history from './../services/history';
import { actionLogOut } from '../reducers/actions';
import { connect } from 'react-redux';

class Layout extends React.Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-transparent position-absolute w-100">
                    <div className="container">
                        <a
                            className="navbar-brand"
                            onClick={e => {
                                e.preventDefault();
                                history.push('/');
                            }}
                            href="/"
                        >
                            <img
                                src={require('../images/Turon_logo_no_background.png')}
                                alt="Turon Logo"
                                style={{ width: '200px', height: '75px' }}
                                className="d-inline-block align-top"
                            />
                        </a>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-toggle="collapse"
                            data-target="#navbarNav"
                            aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div
                            className="collapse navbar-collapse"
                            id="navbarNav"
                        >
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    {this.props.user ? (
                                        <a
                                            href="/login"
                                            className="nav-link text-white"
                                            onClick={e => {
                                                e.preventDefault();
                                                this.props.logout();
                                                history.push('/login');
                                            }}
                                        >
                                            Log out
                                        </a>
                                    ) : (
                                        <a
                                            href="/login"
                                            className="nav-link text-white"
                                            onClick={e => {
                                                e.preventDefault();
                                                history.push('/login');
                                            }}
                                        >
                                            Login
                                        </a>
                                    )}
                                </li>
                                <li className="nav-item">
                                    {this.props.user &&
                                    this.props.user.tutor ? (
                                        <a
                                            className="nav-link text-white"
                                            href="/profile"
                                            onClick={e => {
                                                e.preventDefault();
                                                history.push(
                                                    `/view-tutor/${
                                                        this.props.user.id
                                                    }`
                                                );
                                            }}
                                        >
                                            Profile
                                        </a>
                                    ) : (
                                        <a
                                            className="nav-link text-white"
                                            href="/become-tutor"
                                            onClick={e => {
                                                e.preventDefault();
                                                if (!this.props.user) {
                                                    history.push('/login');
                                                } else {
                                                    history.push(
                                                        '/become-tutor'
                                                    );
                                                }
                                            }}
                                        >
                                            Become a tutor
                                        </a>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <main className="layout">{this.props.children}</main>
            </div>
        );
    }
}

const mapStateToProps = ({default: state}) => {
    console.log(state);

    return {
        user : state.user,
        // client: state.socket
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actionLogOut()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Layout);
