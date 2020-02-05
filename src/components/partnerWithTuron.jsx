import React, { Component } from "react";
import { Button, Modal } from 'react-bootstrap';
import history from '../services/history';
import { connect } from "react-redux";
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';

import './styles/PartnerWithTuron.scss';
import { actionLogOut, signup } from '../reducers/actions';
import isEmail from 'validator/lib/isEmail';
import _ from 'lodash';
import { postDemoRequest } from '../reducers/API';
import swal from 'sweetalert2';

class partnerWithTuron extends Component {

    constructor(props, context) {
        super(props, context)
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.submit = this.submit.bind(this);

        this.state = {
            show: false,
            form: {},
            error: {}
        };
    }

    handleChange(field) {
        return (e) => {
            e.preventDefault();

            const form = Object.assign({}, this.state.form);

            form[field] = e.target.value;

            this.setState({
                form: form
            });
        }
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    async submit(e) {
        e.preventDefault();

        const { form } = this.state;
        const error = {};

        if (!this.state.form.first_name) {
            error.first_name = 'Please enter valid first name';
        }

        if (!this.state.form.last_name) {
            error.last_name = 'Please enter valid last name';
        }

        if (!this.state.form.school) {
            error.school = 'Please enter valid school';
        }

        if (!this.state.form.email || !isEmail(this.state.form.email)) {
            error.email = 'Please enter valid email';
        }

        if (_.keys(error).length) {
            this.setState({
                error: error
            })
            return;
        }

        try {
            const res = await postDemoRequest(this.state.form);

            if (!res || !res.data || !res.data.message) {
                throw Error('Something went wrong.');
            }

            this.handleClose();

            swal.fire('Great!', res.data.message, 'success');
        } catch ({ message }) {
            this.handleClose();
            swal.fire('Oops..', 'Something went wrong.', 'error');
        }
    }

    renderSignup() {
        if (!this.props.user) {
            return (
                <a
                    className="btn btn-secondary btn-lg btn-custom"
                    href="/become-tutor"
                    onClick={(e) => {
                        e.preventDefault();

                        if (!this.props.user) {
                            history.push('/signup?after=become-tutor')
                        } else {
                            history.push('/become-tutor')
                        }
                    }}
                >sign up</a>
            )
        }
    }

    renderBecomeTeacher() {
        if (this.props.user && this.props.user.isAdmin) {
            return (
                <a
                    className="nav-link text-white"
                    href="/become-tutor"
                    onClick={(e) => {
                        e.preventDefault();

                        history.push('admin');
                    }}
                >Admin</a>
            )
        }

        if (this.props.user && this.props.user.tutor) {
            return (
                <a
                    className="nav-link text-white"
                    href="/profile"
                    onClick={(e) => {
                        e.preventDefault();
                        history.push(`/view-tutor/${this.props.user.id}`)
                    }}>Profile</a>
            )
        }

        if (!this.props.user) {
            return (
                <a
                    className="btn btn-secondary btn-lg btn-custom hide-on-mobile"
                    href="/become-tutor"
                    onClick={(e) => {
                        e.preventDefault();

                        if (!this.props.user) {
                            history.push('/signup?after=become-tutor')
                        } else {
                            history.push('/become-tutor')
                        }
                    }}
                >sign up</a>
            )
        }
    }

    render() {
        return (
            <>
                <div className="partner-with-turon">
                    <nav className="navbar partner-with-turon-navbar navbar-expand-lg navbar-dark bg-transparent w-100">
                        <div className="container">
                            <a
                                className="navbar-brand"
                                href="/"
                                onClick={(e) => {
                                    e.preventDefault();
                                    history.push('/');
                                }}
                            >
                                <img
                                    src={require("../images/Turon_logo_no_background.png")}
                                    alt="Turon Logo"
                                    style={{ height: 65 }}
                                    className="logo-on-desktop align-top" />

                                <img
                                    src={require("../images/mobile-logo.png")}
                                    alt="Turon Logo"
                                    className="logo-on-mobile align-top" />
                            </a>


                            <a
                                href="/partner-with-turon"
                                className="text-white hide-on-mobile m-right20"
                                onClick={(e) => {
                                    e.preventDefault();
                                    history.push('/partner-with-turon');
                                }}

                            >Partner with Turon</a>

                            <a
                                className="text-white hide-on-mobile"
                                href="/become-tutor"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (!this.props.user) {
                                        history.push('/login')
                                    } else {
                                        history.push('/become-tutor')
                                    }
                                }}

                            >Become a tutor</a>

                            <a
                                href="/login"
                                className="text-white show-on-mobile"
                                onClick={(e) => {
                                    e.preventDefault();
                                    history.push('/login');
                                }}

                            >Login</a>

                            <a
                                className="btn btn-secondary btn-sm btn-custom show-on-mobile"
                                href="/become-tutor"
                                onClick={(e) => {
                                    e.preventDefault();

                                    if (!this.props.user) {
                                        history.push('/signup?after=become-tutor')
                                    } else {
                                        history.push('/become-tutor')
                                    }
                                }}
                            >sign up</a>

                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>


                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav ml-auto">
                                    {this.props.user && (
                                        <li className="nav-item">
                                            <a
                                                className="nav-link text-white"
                                                href="/chat"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    history.push('/chat');
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        marginRight: '1rem',
                                                        display: 'inline-block',
                                                        position: 'relative',
                                                    }}
                                                >
                                                    Messages
                                                <div
                                                        className="position-absolute"
                                                        style={{
                                                            top: -5,
                                                            right: -20,
                                                        }}
                                                    >
                                                        <NotificationBadge
                                                            count={
                                                                this.state.messages
                                                            }
                                                            effect={Effect.SCALE}
                                                            duration={100}
                                                        />
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                    )}
                                    <li className="nav-item">
                                        {
                                            (this.props.user)
                                                ? <a
                                                    href="/logout"
                                                    className="nav-link text-white"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        this.props.logout()
                                                        history.push('/login')
                                                    }}

                                                >Log out</a>
                                                : <a
                                                    href="/login"
                                                    className="btn btn-secondary btn-lg btn-empty"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        history.push('/login');
                                                    }}

                                                >Login</a>
                                        }
                                    </li>
                                    <li className="nav-item show-on-mobile">
                                        <a
                                            href="/partner-with-turon"
                                            className="nav-link text-white"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                history.push('/partner-with-turon');
                                            }}

                                        >Partner with Turon</a>
                                    </li>
                                    <li className="nav-item show-on-mobile">

                                        <a
                                            className="nav-item show-on-mobile"
                                            href="/become-tutor"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (!this.props.user) {
                                                    history.push('/login')
                                                } else {
                                                    history.push('/become-tutor')
                                                }
                                            }}
                                        >Become a tutor</a>
                                    </li>
                                    <li className="nav-item">
                                        {
                                            this.renderBecomeTeacher()
                                        }
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </nav>
                    <div className="partner-with-turon-hero">

                        <div className="container partner-with-turon-hero-description">

                            <h1>We have only 1 goal at Turon</h1>
                            <h2>Engage students to seek out academic resources</h2>
                            <div className="w-100 text-center mt-5">
                                <button className="btn btn-secondary btn-lg btn-custom" onClick={this.handleShow}>Demo Now</button>
                            </div>
                        </div>
                    </div>

                    <div className="partner-with-turon-matter">
                        <div className="container">
                            <div className="partner-with-turon-matter-top">
                                <h3>Our Platform...</h3>
                                {/* <p>Get paid to share your knowledge and make an impact on struggling students</p> */}
                            </div>
                            <div className="row mt-4">
                                <div className="col-sm-12">
                                    <div className="partner-with-turon-matter-item">
                                        <div className="row">
                                            <div className="col-md-3 col-sm-12 text-center">
                                                <img
                                                    src={require('../images/partner_1.svg')}
                                                />
                                            </div>
                                            <div className="col-md-9 col-sm-12">
                                                <h4>Increases academic resource usage</h4>
                                                <p>Turon provides a holistic tutoring platform that works with <u>student's</u> schedules to increase resource usage </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-sm-12">
                                    <div className="partner-with-turon-matter-item">
                                        <div className="row">
                                            <div className="col-md-3 col-sm-12 text-center">
                                                <img
                                                    src={require('../images/partner_2.svg')}
                                                />
                                            </div>
                                            <div className="col-md-9 col-sm-12">
                                                <h4>Supplements campus tutoring</h4>
                                                <p>Activate a community of peer learning by utilizing top performing students to tutor past classes</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-sm-12">
                                    <div className="partner-with-turon-matter-item">
                                        <div className="row">
                                            <div className="col-md-3 col-sm-12 text-center">
                                                <img
                                                    src={require('../images/partner_3.svg')}
                                                />
                                            </div>
                                            <div className="col-md-9 col-sm-12">
                                                <h4>Helps students reach their intellectual potential</h4>
                                                <p>Give students the the academic support flexibility they need to be successful</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="partner-with-turon-matter no-background">
                        <div className="container">
                            <div className="partner-with-turon-matter-top text-center color-white">
                                <h3>Learn why Turon simply works</h3>
                                <p>A modern platform thoughtfully created for 21st century students and handmade for higher education institutions </p>

                                <a
                                    href="javascript:void(0)"
                                    className='btn btn-secondary btn-lg btn-custom'
                                    onClick={this.handleShow}
                                >
                                    Talk to us
                        </a>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton >
                        <Modal.Title className="text-center w-100">Schedule your demo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <label>First Name: <span className="text-danger">*</span></label>
                            <input
                                value={this.state.form.first_name}
                                onChange={this.handleChange('first_name')}
                                type="text"
                                className={['form-control', this.state.error.first_name ? 'is-invalid' : ''].join(' ')} />
                            <div className="invalid-feedback">
                                {this.state.error.first_name}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Last Name: <span className="text-danger">*</span></label>
                            <input
                                value={this.state.form.last_name}
                                onChange={this.handleChange('last_name')}
                                type="text"
                                className={['form-control', this.state.error.last_name ? 'is-invalid' : ''].join(' ')} />
                            <div className="invalid-feedback">
                                {this.state.error.last_name}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>School: <span className="text-danger">*</span></label>
                            <input
                                value={this.state.form.school}
                                onChange={this.handleChange('school')}
                                type="text"
                                className={['form-control', this.state.error.school ? 'is-invalid' : ''].join(' ')} />
                            <div className="invalid-feedback">
                                {this.state.error.school}
                            </div>
                        </div>
                        <div className="form-group has-error">
                            <label>Email: <span className="text-danger">*</span></label>
                            <input
                                value={this.state.form.email}
                                onChange={this.handleChange('email')}
                                type="email"
                                className={['form-control', this.state.error.email ? 'is-invalid' : ''].join(' ')} />
                            <div className="invalid-feedback">
                                {this.state.error.email}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                value={this.state.form.phone}
                                onChange={this.handleChange('phone')}
                                type="text"
                                className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Anything else we should know ?</label>
                            <textarea
                                value={this.state.form.comments}
                                onChange={this.handleChange('comments')}
                                type="text"
                                className="form-control" />
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="text-center">
                        <Button
                            variant="custom"
                            className="btn-secondary"
                            onClick={this.submit}>
                            Schedule Now
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = ({ default: state }) => {
    return {
        user: state.user,
        client: state.socket
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(actionLogOut()),
        signup: (data, callback) => dispatch(signup(data, callback))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(partnerWithTuron);