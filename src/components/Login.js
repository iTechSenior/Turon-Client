import React, { Component } from 'react';
import history from './../services/history';
import { connect } from 'react-redux';

import { login } from '../reducers/actions';

import './styles/Auth.scss';
import { MultiAuth } from './MultiAuth';
import * as _ from 'lodash';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
    }

    componentDidMount() {
        console.log('props', this.props);
    }

    onSubmit(e) {
        e.preventDefault();

        this.props.login(this.state);
    }

    handleMultiAuth(data) {
        this.props.login(data);
    }

    render() {
        return (
            <div className="auth">
                <nav
                    style={{ top: 0 }}
                    className="navbar navbar-expand-lg navbar-dark bg-transparent w-100"
                >
                    <div className="container">
                        <a
                            className="navbar-brand"
                            href="/"
                            onClick={e => {
                                e.preventDefault();
                                history.push('/');
                            }}
                        >
                            <img
                                src={require('../images/Turon_logo_no_background.png')}
                                alt="Turon Logo"
                                style={{ width: '200px', height: '75px' }}
                                className="d-inline-block align-top"
                            />
                        </a>
                    </div>
                </nav>
                <div>
                    <div className="card shadow">
                        <div className="card-body text-center">
                            <div className="card-form-main">
                                <div className="card-form-main-left">
                                    <h1
                                        className="card-title text-secondary"
                                        style={{ marginBottom: '2rem' }}
                                    >
                                        Login
                                    </h1>
                                    <form onSubmit={this.onSubmit.bind(this)}>
                                        {this.props.authError && (
                                            <div className="alert alert-danger">
                                                {this.props.authError}
                                            </div>
                                        )}
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="email"
                                                onChange={e =>
                                                    this.setState({
                                                        email: e.target.value,
                                                    })
                                                }
                                                required
                                                placeholder="Enter Email"
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <input
                                                type="password"
                                                name="password"
                                                onChange={e =>
                                                    this.setState({
                                                        password:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                                placeholder="Enter Password"
                                                className="form-control"
                                            />
                                        </div>

                                        <div
                                            className="text-center"
                                            style={{ marginTop: '2rem' }}
                                        >
                                            <button
                                                type="submit"
                                                className="btn btn-outline-secondary btn-lg"
                                            >
                                                Login
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div>
                                    <div className="auth-brands">
                                        <h3>Login with:</h3>

                                        <MultiAuth
                                            onSubmit={this.handleMultiAuth.bind(
                                                this
                                            )}
                                        />
                                    </div>

                                    <hr />

                                    <a
                                        href="/signup"
                                        onClick={e => {
                                            e.preventDefault();
                                            this.props.history.push('/signup');
                                        }}
                                        className="mt-4 d-block text-secondary"
                                    >
                                        New user? Sign up here!
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: data => dispatch(login(data)),
    };
};
const mapStateToProps = ({ default: state }, props) => {
    let isNotCompleted = _.filter(state.isNotCompleted, _.identity);

    if (isNotCompleted && isNotCompleted.length) {
        history.push('/finish-registration', {
            fields: isNotCompleted,
            user_id: state.user.id,
        });
        return {};
    }

    if (state.user) {
        console.log('props', props);
        if (props.location.state) {
            if (props.location.state.id) {
                history.push(`/view-tutor/${props.location.state.id}`);
            }
        } else {
            history.push('/');
        }
    }

  return {
    authError: state.authError
  };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
