import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from './../services/history';
import ReactStars from 'react-stars';
import Moment from 'react-moment';
import * as moment from 'moment';
import _ from 'lodash';
import * as converTime from 'convert-time';

import swal from 'sweetalert2';
import $ from 'jquery';
import queryString from 'query-string';

import { List, ListItem, ListItemText } from '@material-ui/core';

import './ViewTutor.scss';
import {
    actionGetTutor,
    actionGetReviews,
    actionPostReview,
    getCoursesByTeacherId,
} from '../reducers/actions';

class ViewTutor extends Component {
    state = {
        message: '',
        showReviews: 1,
    };

    componentWillMount() {
        this.props.getTutor(this.props.match.params.pid);
        this.props.getReviews({
            id: this.props.match.params.pid,
            sid: this.props.user ? this.props.user.id : '',
        });
        this.props.getCoursesByTeacherId(this.props.match.params.pid);

        const search = queryString.parse(this.props.location.search);

        if(search.t){
            history.replace(this.props.location.path)

            setTimeout(() => {
                if(this.props.user && !this.props.user.MFA_confirmed && (this.props.user.tutor === this.props.match.params.pid || this.props.user.id === this.props.match.params.pid)){
                    swal.fire({
                        title: 'Please enable 2 step auth',
                        text: 'You cannot receive payouts until you have secured your account through 2 step authentication. Please go on to the Sessions page to secure your account',
                        showCancelButton: true,
                        cancelButtonText: 'Cancel',
                        confirmButtonText: 'Enable now'
                    }).then(({value}) => {
                        if(value){
                            history.push('/payments');
                        }
                    })
                }
            }, 1000);
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        this.props.postReview({
            id: this.props.match.params.pid,
            review: {
                student: this.props.user.id,
                message: this.state.message,
                rating: this.state.rating,
            },
        });
    }

    messageTutor(subject, course) {
        if (!this.props.user) {
            history.push('/login');
            return;
        }

        swal.fire({
            title: 'Your request',
            showCancelButton: true,
            html: `
                <div style="max-width: 300px;margin: auto;">
                    <input id="swal-input1" style="margin: 0.5rem 0" style="margin: 0.5rem 0" placeholder="Subject" value="${subject ||
                        ''}" class="swal2-input">
                    <input id="swal-input2" style="margin: 0.5rem 0" placeholder="Course #" value="${course ||
                        ''}" class="swal2-input">
                    <input id="swal-input3" style="margin: 0.5rem 0" placeholder="Meeting location" class="swal2-input">
                    <input id="swal-input4" style="margin: 0.5rem 0" placeholder="Date/Time" class="swal2-input">
                    <textarea id="swal-input5" style="margin: 0.5rem 0" placeholder="Message" class="swal2-input"></textarea>
                </div>
                `,
            preConfirm: function() {
                return new Promise(function(resolve) {
                    const subject = $('#swal-input1').val();
                    const course = $('#swal-input2').val();
                    const location = $('#swal-input3').val();
                    const date = $('#swal-input4').val();
                    const message = $('#swal-input5').val();

                    resolve(
                        `Hey, I'd like to request tutoring from you. Subject: ${subject}. Course: ${course}. Meeting location: ${location}. Time: ${date}. Message: ${message}`
                    );
                });
            },
            onOpen: function() {
                $('#swal-input1').focus();
            },
        }).then(res => {
            if (res.value) {
                history.push('/chat', {
                    tutorid: this.props.tutor.id,
                    message: res.value,
                });
            }
        });
    }

    bookNow() {
        history.push('/chat', {
            tutorid: this.props.tutor.id,
            message: `I'd like to book your session.`,
            bookNow: true,
        });
    }

    writeExperience() {
        switch (this.props.tutor.experience) {
            case '0':
                return '0 years';
            case '1':
                return '1-2 years';
            case '3':
                return '3-5 years';
            case '5':
                return '5+ years';
            default:
                return '0 years';
        }
    }

    renderTypeTutoring() {
        let template = null;
        switch (this.props.tutor.online_tutoring) {
            case 0:
                template = (
                    <p className="text-success mb-1">
                        <i className="fas fa-check mr-2" />
                        <i>This tutor is only able to tutor in-person</i>
                    </p>
                );
                break;
            case 1:
                template = (
                    <p className="text-success mb-1">
                        <i className="fas fa-check mr-2" />
                        <i>This tutor can teach online or in-person</i>
                    </p>
                );
                break;
            case 2:
                template = (
                    <p className="text-success mb-1">
                        <i className="fas fa-check mr-2" />
                        <i>This tutor is only able to tutor online</i>
                    </p>
                );
                break;
        }
        return template;
    }

    render() {
        if (!this.props.tutor) {
            return <div>Loading..</div>;
        }

        const isCurrentTutor =
            this.props.user && this.props.tutor.id === this.props.user.id;

        console.log('Tutor', this.props.tutor);

        return (
            <div className="container">
                <div className="card shadow tutor-profile">
                    <div className="card-body">
                        <div className="card-top">
                            <img src={this.props.tutor.profile} alt="" />
                            <div>
                                <h1>
                                    {this.props.tutor.firstName +
                                        ' ' +
                                        this.props.tutor.lastName}
                                </h1>
                                <p
                                    style={{
                                        fontSize: '1.25rem',
                                    }}
                                >
                                    Experience:{' '}
                                    <strong>
                                        {this.writeExperience(
                                            this.props.tutor.experience
                                        )}
                                    </strong>
                                </p>
                                <p
                                    style={{
                                        fontSize: '1.25rem',
                                    }}
                                >
                                    Zip:{' '}
                                    <strong>{this.props.tutor.zipcode}</strong>
                                </p>
                                <p
                                    style={{
                                        fontSize: '1.25rem',
                                    }}
                                >
                                    Rate:{' '}
                                    <strong>
                                        {this.props.tutor.fees === 0
                                            ? 'FREE'
                                            : `$${
                                                  this.props.tutor.fees
                                              } / hour`}
                                    </strong>
                                </p>
                                <p>{this.props.tutor.about}</p>

                                {this.props.tutor.travel ? (
                                    <p className="text-success mb-1">
                                        <i className="fas fa-check mr-2" />
                                        <i>
                                            This tutor is willing to travel{' '}
                                            {this.props.tutor.travel} miles from
                                            their zip code
                                        </i>
                                    </p>
                                ) : (
                                    <p className="text-danger mb-1">
                                        <i className="fas fa-ban mr-2" />
                                        <i>
                                            This tutor is not willing to travel
                                        </i>
                                    </p>
                                )}

                                {this.renderTypeTutoring()}
                                {this.props.tutor.live_near_school ? (
                                    <p className="text-success mb-1">
                                        <i className="fas fa-check mr-2" />
                                        <i>
                                            This tutor will be near campus
                                            during the summer
                                        </i>
                                    </p>
                                ) : (
                                    <div />
                                )}
                            </div>

                            <div className="ml-auto d-flex align-items-start">
                                {!!this.props.user && (
                                    <div>
                                        {(isCurrentTutor ||
                                            this.props.user.isAdmin) && (
                                            <a
                                                href={`/become-tutor/${
                                                    this.props.tutor.id
                                                }`}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    history.push({
                                                        pathname: `/become-tutor/${
                                                            this.props.tutor.id
                                                        }`,
                                                        state: {
                                                            tutorData: {
                                                                subjects: this
                                                                    .props
                                                                    .courses_by_teacher,
                                                                ...this.props
                                                                    .tutor,
                                                            },
                                                        },
                                                    });
                                                }}
                                                className="btn btn-outline-secondary mr-2 text-nowrap"
                                            >
                                                Edit profile
                                            </a>
                                        )}
                                    </div>
                                )}
                                {!!(
                                    this.props.user &&
                                    this.props.user.id === this.props.tutor.id
                                ) && (
                                    <a
                                        href={'/payments'}
                                        onClick={e => {
                                            e.preventDefault();

                                            history.push('/payments');
                                        }}
                                        className="btn btn-secondary mr-2 text-nowrap"
                                    >
                                        Payments
                                    </a>
                                )}
                                {/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}@turon.co/.test(
                                    this.props.tutor.email
                                ) || isCurrentTutor ? (
                                    <div />
                                ) : (
                                    <div style={{ whiteSpace: 'nowrap' }}>
                                        <button
                                            onClick={e => {
                                                e.preventDefault();

                                                this.messageTutor();
                                            }}
                                            className="btn btn-secondary text-nowrap mr-2"
                                        >
                                            Message tutor
                                        </button>
                                        <button
                                            onClick={e => {
                                                e.preventDefault();

                                                this.bookNow();
                                            }}
                                            className="btn btn-secondary text-nowrap"
                                        >
                                            Book now
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="tutor-profile-courses pt-3">
                            <h3>Availability:</h3>
                            <div className="pl-3 d-flex flex-column flex-lg-row justify-content-between">
                                {_.split(this.props.tutor.schedule, '|').map(
                                    (v, i) => (
                                        <div
                                            key={i}
                                            className="text-center mt-3 d-flex flex-row flex-lg-column align-items-center"
                                        >
                                            <h6 className="mb-0">
                                                {moment()
                                                    .isoWeekday(i + 1)
                                                    .format('dddd')}
                                            </h6>
                                            <span className="mr-1 d-block d-lg-none">
                                                :
                                            </span>
                                            <strong>
                                                <small>
                                                    {v === '-'
                                                        ? '-'
                                                        : _.split(v, '-')
                                                              .map(time =>
                                                                  converTime(
                                                                      time
                                                                  )
                                                              )
                                                              .join(' - ')}
                                                </small>
                                            </strong>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        <hr />

                        <div className="tutor-profile-courses">
                            <h3>Courses:</h3>
                            {this.props.courses_by_teacher ? (
                                this.props.courses_by_teacher.length ? (
                                    <List dense={true}>
                                        {_.map(
                                            this.props.courses_by_teacher,
                                            v => (
                                                <ListItem>
                                                    <ListItemText
                                                        classes={{
                                                            primary:
                                                                'font-size-large',
                                                        }}
                                                        primary={v.subject}
                                                    />
                                                </ListItem>
                                            )
                                        )}
                                    </List>
                                ) : (
                                    <div className="text-center p-5">
                                        Nothing found.
                                    </div>
                                )
                            ) : (
                                <div className="text-center p-5">
                                    <i className="fas fa-spinner fa-spin fa-2x" />
                                </div>
                            )}
                        </div>

                        <div className="tutor-profile-reviews">
                            <h3>
                                Reviews{' '}
                                {this.props.reviews &&
                                this.props.reviews.reviews &&
                                this.props.reviews.reviews.length
                                    ? `(${this.props.reviews.reviews.length})`
                                    : ''}
                            </h3>

                            {this.props.errorReviews ? (
                                <div className="text-center">
                                    Oops.. Can't load reviews
                                </div>
                            ) : this.props.reviews &&
                              this.props.reviews.reviews &&
                              this.props.reviews.reviews.length ? (
                                <div>
                                    {this.props.reviews.reviews.map(
                                        (v, i) =>
                                            i < this.state.showReviews && (
                                                <div className="card mb-2">
                                                    <div className="card-body">
                                                        <ReactStars
                                                            count={5}
                                                            size={24}
                                                            edit={false}
                                                            value={v.rating}
                                                            half={false}
                                                            color2={'#ffd700'}
                                                        />
                                                        <h5>
                                                            <Moment format="MMM Do YYYY">
                                                                {v.date}
                                                            </Moment>
                                                        </h5>
                                                        <p>{v.message}</p>
                                                    </div>
                                                </div>
                                            )
                                    )}
                                    {this.state.showReviews <
                                        this.props.reviews.reviews.length && (
                                        <div className="text-center mt-3">
                                            <button
                                                className="btn btn-outline-secondary"
                                                onClick={e => {
                                                    e.preventDefault();

                                                    this.setState({
                                                        showReviews:
                                                            this.state
                                                                .showReviews +
                                                            1,
                                                    });
                                                }}
                                            >
                                                Load more
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    There are no reviews for this tutor yet.
                                </div>
                            )}
                        </div>

                        {this.props.reviews &&
                        this.props.reviews.canLeaveReview ? (
                            <div className="tutor-profile-reviews">
                                <div className="card">
                                    <div className="card-body">
                                        <h4>Leave your review here:</h4>

                                        <form
                                            onSubmit={this.handleSubmit.bind(
                                                this
                                            )}
                                        >
                                            <ReactStars
                                                count={5}
                                                size={48}
                                                value={this.state.rating}
                                                onChange={rating => {
                                                    this.setState({
                                                        rating: rating,
                                                    });
                                                }}
                                                half={false}
                                                color2={'#ffd700'}
                                            />

                                            <div className="form-group">
                                                <textarea
                                                    style={{
                                                        height: 100,
                                                    }}
                                                    value={this.state.message}
                                                    onChange={e => {
                                                        this.setState({
                                                            message:
                                                                e.target.value,
                                                        });
                                                    }}
                                                    className="form-control"
                                                />
                                            </div>

                                            {this.props.errorPostReview && (
                                                <div className="alert alert-danger">
                                                    Oops... Something went
                                                    wrong.
                                                </div>
                                            )}

                                            <button
                                                disabled={
                                                    !(
                                                        this.state.rating &&
                                                        this.state.message
                                                    )
                                                }
                                                className="btn btn-outline-secondary"
                                            >
                                                Submit
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getReviews: data => dispatch(actionGetReviews(data)),
        getTutor: data => dispatch(actionGetTutor(data)),
        postReview: data => dispatch(actionPostReview(data)),
        getCoursesByTeacherId: data => dispatch(getCoursesByTeacherId(data)),
    };
};

const mapStateToProps = ({ default: states }) => {
    if (states.errorTutor) {
        history.push('/find-tutor');
        return;
    }

    return {
        user: states.user,
        tutor: states.tutor,
        reviews: states.reviews,
        errorReviews: states.errorReviews,
        errorPostReview: states.errorPostReview,
        courses_by_teacher: states.courses_by_teacher,
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ViewTutor);
