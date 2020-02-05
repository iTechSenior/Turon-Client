import React, { Component } from 'react';
import history from './../services/history';
import { connect } from 'react-redux';

import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';

import './styles/Home.scss';
import { actionLogOut, signup } from '../reducers/actions';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: 0,
            students: [
                {
                    subs:
                        'Inexpensive alternatives to school/professional tutoring',
                },
                {
                    subs: 'Get tutored on your own time',
                },
                {
                    subs: 'Seamlessly find and book a tutor in minutes',
                },
                {
                    subs: 'Multilingual tutors',
                },
            ],
            tutors: [
                {
                    subs: 'Work on your own schedule',
                },
                {
                    subs: 'Locate clients like never before',
                },
                {
                    subs: 'No tedious certification process',
                },
                {
                    subs: 'Quick onboarding procedure',
                },
            ],
        };
    }

    componentDidMount() {
        if (this.props.user) {
            this.props.client.emitRegister(
                { userid: this.props.user.id },
                (err, rooms) => {
                    const unread = rooms.reduce(
                        (sum, i) => sum + (i.message ? i.message.unread : 0),
                        0
                    );

                    this.setState({
                        messages: unread,
                    });
                }
            );

            this.props.client.onMessage((err, m) => {
                this.setState({
                    messages: this.state.messages + 1,
                });
            });
        }
    }

    navigate1() {
        if (localStorage.getItem('logged') !== '200') {
            history.push('/login');
        } else if (localStorage.getItem('logged') === '200') {
            history.push('/become-tutor');
        }
    }

    navigate() {
        history.push('/login');
    }

    renderBecomeTeacher() {
        if (this.props.user && this.props.user.isAdmin) {
            return (
                <a
                    className="nav-link text-white"
                    href="/become-tutor"
                    onClick={e => {
                        e.preventDefault();

                        history.push('admin');
                    }}
                >
                    Admin
                </a>
            );
        }

        if (this.props.user && this.props.user.tutor) {
            return (
                <a
                    className="nav-link text-white"
                    href="/profile"
                    onClick={e => {
                        e.preventDefault();
                        history.push(`/view-tutor/${this.props.user.id}`);
                    }}
                >
                    Profile
                </a>
            );
        }

        if (!this.props.user) {
            return (
                <a
                    className="btn btn-secondary btn-lg btn-custom hide-on-mobile"
                    href="/become-tutor"
                    onClick={e => {
                        e.preventDefault();

                        if (!this.props.user) {
                            history.push('/signup?after=become-tutor');
                        } else {
                            history.push('/become-tutor');
                        }
                    }}
                >
                    sign up
                </a>
            );
        }
    }

    render() {
        return (
            <div className="home">
                <nav className="navbar navbar-expand-lg navbar-dark bg-transparent w-100">
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
                                style={{ height: 65 }}
                                className="logo-on-desktop align-top"
                            />

                            <img
                                src={require('../images/mobile-logo.png')}
                                alt="Turon Logo"
                                className="logo-on-mobile align-top"
                            />
                        </a>

                        <a
                            href="/faq"
                            className="text-white hide-on-mobile m-right20"
                            onClick={e => {
                                e.preventDefault();
                                history.push('/faq');
                            }}
                        >
                            FAQ
                        </a>

                        <a
                            href="/partner-with-turon"
                            className="text-white hide-on-mobile m-right20"
                            onClick={e => {
                                e.preventDefault();
                                history.push('/partner-with-turon');
                            }}
                        >
                            Partner with Turon
                        </a>

                        <a
                            href="/sessions"
                            className="text-white hide-on-mobile m-right20"
                            onClick={e => {
                                e.preventDefault();
                                history.push('/sessions');
                            }}
                        >
                            Sessions
                        </a>

                        <a
                            className="text-white hide-on-mobile"
                            href="/become-tutor"
                            onClick={e => {
                                e.preventDefault();
                                if (!this.props.user) {
                                    history.push('/login');
                                } else {
                                    history.push('/become-tutor');
                                }
                            }}
                        >
                            Become a tutor
                        </a>

                        <a
                            href="/login"
                            className="btn btn-secondary btn-lg btn-empty show-on-mobile"
                            onClick={e => {
                                e.preventDefault();
                                history.push('/login');
                            }}
                        >
                            Login
                        </a>

                        <a
                            className="btn btn-secondary btn-sm btn-custom show-on-mobile"
                            href="/become-tutor"
                            onClick={e => {
                                e.preventDefault();

                                if (!this.props.user) {
                                    history.push('/signup?after=become-tutor');
                                } else {
                                    history.push('/become-tutor');
                                }
                            }}
                        >
                            sign up
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
                                    {this.props.user ? (
                                        <a
                                            href="/logout"
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
                                            className="btn btn-secondary btn-lg btn-empty"
                                            onClick={e => {
                                                e.preventDefault();
                                                history.push('/login');
                                            }}
                                        >
                                            Login
                                        </a>
                                    )}
                                </li>
                                <li className="nav-item show-on-mobile">
                                    <a
                                        href="/partner-with-turon"
                                        className="nav-link text-white"
                                        onClick={e => {
                                            e.preventDefault();
                                            history.push('/partner-with-turon');
                                        }}
                                    >
                                        Partner with Turon
                                    </a>
                                </li>
                                <li className="nav-item show-on-mobile">
                                    <a
                                        className="nav-link text-white"
                                        href="/become-tutor"
                                        onClick={e => {
                                            e.preventDefault();
                                            if (!this.props.user) {
                                                history.push('/login');
                                            } else {
                                                history.push('/become-tutor');
                                            }
                                        }}
                                    >
                                        Become a tutor
                                    </a>
                                </li>
                                <li className="nav-item">
                                    {this.renderBecomeTeacher()}
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="home-hero">
                    <div className="home-hero-description">
                        {/* <div>
                                                        <a className="navbar-brand float-right"
                                                                href="/"
                                                                onClick={(e) => {
                                                                        e.preventDefault();
                                                                        history.push('/');
                                                                }}>Testing1</a>

                                                        <a className="navbar-brand float-right"
                                                                href="/"
                                                                onClick={(e) => {
                                                                        e.preventDefault();
                                                                        history.push('/');
                                                                }}>Testing2</a>
                                                </div> */}
                        <h1>Free and Private College Tutors</h1>
                        <h2>Live more, stress less</h2>
                        <div className="d-flex justify-content-between w-100 text-center mt-5 flex-column flex-md-row">
                            <div style={{ width: 100 }}>
                                {/* <img
                                        src={require('./../images/200.png')}
                                        width={100}
                                        height={100}
                                    />
                                    <h4 className="mt-3 h6">Welcome <br />Spartans!</h4> */}
                            </div>
                            <div className="my-4 my-md-0">
                                <button
                                    className="btn btn-secondary btn-lg btn-custom"
                                    onClick={() => history.push('./find-tutor')}
                                >
                                    Find tutors
                                </button>
                            </div>
                            <div className="home-hero-icons">
                                <a href="#" className="home-hero-icon">
                                    <img
                                        src={require('../images/instagram.png')}
                                        width={20}
                                        height={20}
                                    />
                                </a>

                                <a href="#" className="home-hero-icon">
                                    <img
                                        src={require('../images/linkedIn.png')}
                                        width={20}
                                        height={20}
                                    />
                                </a>

                                <a href="#" className="home-hero-icon">
                                    <img
                                        src={require('../images/gmail.png')}
                                        width={22}
                                        height={22}
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="container"> */}
                {/* <div className="row universityLogoRow">
                                        <div className='col text-center rounded'>
                                                <img src={require('../images/santaClaraLogo.png')} />
                                        </div>
                                        <div className='col text-center rounded'>
                                                <img src={require('../images/sdsuLogo.png')} />
                                        </div>
                                        <div className='col text-center rounded'>
                                                <img src={require('../images/usfLogo.jpg')} />
                                        </div>
                                        <div className='col text-center rounded'>
                                                <img src={require('../images/babanaSlugsLogo.jpg')} />
                                        </div>
                                        <div className='col text-center rounded'>
                                                <img src={require('../images/sjsuLogo.png')} />
                                        </div>
                                </div> */}
                {/* </div> */}
                <div className="home-matter">
                    <div className="container">
                        <div className="home-matter-top">
                            <h3>Your classes matter.</h3>
                            <p>
                                Get paid to share your knowledge and make an
                                impact on struggling students
                            </p>

                            <a
                                href="#"
                                className="btn btn-secondary btn-lg btn-custom"
                                onClick={e => {
                                    e.preventDefault();

                                    if (this.props.user) {
                                        history.push('/become-tutor');
                                    } else {
                                        history.push(
                                            '/signup?after=become-tutor'
                                        );
                                    }
                                }}
                            >
                                Let's do this!
                            </a>
                        </div>
                        <div className="row mt-4">
                            <div className="col-md-4">
                                <div className="home-matter-item">
                                    <img
                                        src={require('../images/matter-1.png')}
                                    />
                                    <h4>Get paid quickly and easily</h4>
                                    <p>
                                        Saving up for something or looking for
                                        that bit of extra spending money? Join
                                        students and alumni all over California
                                        who are earning $20-$50/hr by tutoring.
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="home-matter-item">
                                    <img
                                        src={require('../images/matter-2.png')}
                                    />
                                    <h4>Help students</h4>
                                    <p>
                                        Make an immediate impact on students
                                        that were once in your shoes by sharing
                                        your expertise with them.
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="home-matter-item">
                                    <img
                                        src={require('../images/matter-3.png')}
                                    />
                                    <h4>Do it in your spare time</h4>
                                    <p>
                                        Got a really busy schedule? No problem,
                                        pick your own hours! Tutor remotely over
                                        Zoom from the comfort of your own home.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="home-find">
                                        <h2>Find a tutor for <u>your</u> class</h2>

                                        <div className="row">
                                                <div className="col-md-4">
                                                        <img
                                                                src={require("../images/New_pin.JPG")}
                                                                alt="Location"
                                                        />
                                                        <h3>Nearby Tutors</h3>
                                                </div>

                                                <div className="col-md-4">
                                                        <img
                                                                src={require("../images/book.jpg")}
                                                                alt="book"
                                                        />
                                                        <h3>On-DemandIn person Tutoring</h3>
                                                </div>

                                                <div className="col-md-4">
                                                        <img
                                                                src={require("../images/New_piggy.JPG")}
                                                                alt="Piggy Bank"
                                                        />
                                                        <h3>Free & Affordable Options</h3>
                                                </div>
                                        </div>
                                </div> */}

                {/* <div className="home-footer">
                                        <div className="row">
                                                <div className="col-md-6">
                                                        <img
                                                                src={require("../images/Library.jpg")}
                                                                alt="Tutor"
                                                        />
                                                        <h3 className="mb-3">For students</h3>

                                                        <ul>
                                                                <li> Inexpensive alternatives to school/professional tutoring</li>
                                                                <li> Get tutored on your own time</li>
                                                                <li> Seamlessly find and book a tutor in minutes</li>
                                                                <li> Multilingual tutors</li>
                                                        </ul>
                                                </div>
                                                <div className="col-md-6">
                                                        <img
                                                                className="w-100"
                                                                src={require("../images/Tutor.jpg")}
                                                                alt="Tutor"
                                                        />
                                                        <h3>For tutors</h3>

                                                        <ul>
                                                                <li> Work on your own schedule</li>
                                                                <li> Locate clients like never before</li>
                                                                <li> No tedious certification process</li>
                                                                <li> No tedious certification process</li>
                                                        </ul>
                                                </div>
                                        </div>
                                </div> */}
            </div>
        );
    }
}
const mapStateToProps = ({ default: state }) => {
    console.log(state);

    return {
        user: state.user,
        client: state.socket,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actionLogOut()),
        signup: (data, callback) => dispatch(signup(data, callback)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
