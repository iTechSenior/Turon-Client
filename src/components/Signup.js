import React, { Component } from 'react';
import { signup } from '../reducers/actions';
import { connect } from 'react-redux';
import { MultiAuth } from './MultiAuth';

import history from './../services/history';

import _ from 'lodash';
import Select from 'react-select';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            university: 'San Jose State University',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            zipcode: '',
        };
    }

    onSubmit(e) {
        e.preventDefault();

        this.props.signup(this.state);
    }

    handleMultiAuth(data) {
        this.props.signup(data);
    }

    render() {
        if (this.props.isNotCompleted && this.props.isNotCompleted.length) {
            history.push(`/finish-registration${this.props.location.search}`, {
                fields: this.props.isNotCompleted,
                user_id: this.props.signupUser.id,
            });

            return <div />;
        }

        if (this.props.user) {
            if (_.startsWith(this.props.location.search, '?after=')) {
                history.push(
                    _.replace(this.props.location.search, '?after=', '')
                );
            } else {
                history.push('/');
            }

            return <div />;
        }

        return (
            <div className="auth signup">
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
                <div style={{ paddingTop: 30 }}>
                    <div className="card shadow">
                        <div className="card-body text-center">
                            <div className="card-form-main">
                                <div className="card-form-main-left">
                                    <h1
                                        className="card-title text-secondary"
                                        style={{ marginBottom: '2rem' }}
                                    >
                                        Sign Up
                                    </h1>
                                    <form onSubmit={this.onSubmit.bind(this)}>
                                        {this.props.authError && (
                                            <div className="alert alert-danger">
                                                {this.props.authError}
                                            </div>
                                        )}

                                        <div className="form-group">
                                            {!!this.props.colleges && (
                                                <Select
                                                    onChange={e => {
                                                        this.setState({
                                                            university: e.value,
                                                        });
                                                    }}
                                                    options={_.map(
                                                        this.props.colleges,
                                                        v => {
                                                            return {
                                                                value:
                                                                    v.collegeid,
                                                                label:
                                                                    v.college,
                                                            };
                                                        }
                                                    )}
                                                    placeholder="Choose your university"
                                                />
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="firstName"
                                                onChange={e =>
                                                    this.setState({
                                                        firstName:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                                placeholder="Enter first name"
                                                className="form-control form-control-sm"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="lastName"
                                                onChange={e =>
                                                    this.setState({
                                                        lastName:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                                placeholder="Enter last name"
                                                className="form-control form-control-sm"
                                            />
                                        </div>

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
                                                className="form-control form-control-sm"
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
                                                className="form-control form-control-sm"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="zipcode"
                                                onChange={e =>
                                                    this.setState({
                                                        zipcode: e.target.value,
                                                    })
                                                }
                                                required
                                                placeholder="Enter zip code"
                                                className="form-control form-control-sm"
                                            />
                                        </div>

                                        <div className="form-check mb-3">
                                            <label
                                                className="form-check-label"
                                                htmlFor="tos"
                                            >
                                                By continuing you agree to our{' '}
                                                <a
                                                    href="assets/Student_TOS.pdf"
                                                    target="_blank"
                                                >
                                                    terms of service
                                                </a>
                                            </label>
                                        </div>

                                        <div
                                            className="text-center"
                                            style={{ marginTop: '2rem' }}
                                        >
                                            <button
                                                type="submit"
                                                className="btn btn-outline-secondary btn-lg"
                                            >
                                                Sign Up
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div>
                                    <div className="auth-brands">
                                        <h3>Sign up with:</h3>

                                        <MultiAuth
                                            onSubmit={this.handleMultiAuth.bind(
                                                this
                                            )}
                                        />
                                    </div>

                                    <hr />

                                    <a
                                        href="/login"
                                        onClick={e => {
                                            e.preventDefault();
                                            this.props.history.push('/login');
                                        }}
                                        className="mt-4 d-block text-secondary"
                                    >
                                        Have an account? Login here!
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
        signup: data => dispatch(signup(data))
    };
};

const mapStateToProps = ({ default: state }) => {
    return {
        authError: state.authError,
        isNotCompleted: state.isNotCompleted,
        user: state.user,
        signupUser: state.user,
        colleges: state.colleges,
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Signup);
