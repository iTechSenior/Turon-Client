import * as API from './API';
import { toastr } from 'react-redux-toastr';

export const actions = {
    INIT: 0,
    LOGIN: 1,
    SIGNUP: 2,
    UPDATE: 3,
    LOGOUT: 4,
    GET_TUTORS: 5,
    GET_TUTOR: 6,
    GET_REVIEWS: 7,
    POST_REVIEW: 8,
    BECOME_TUTOR: 9,
    GET_SUBJECTS: 10,
    GET_COURSES_BY_SUBJECT: 11,
    GET_COURSES_BY_TEACHER: 12,
    DELETE_TUTOR: 13,
    GET_COLLEGES: 14,
    CREATE_SESSION: 15,
    GET_SESSIONS: 16,
    GET_SESSION: 17,
    GET_PAYMENTS: 18,
    TUTORS_SEARCH: 19,
    DISMISS_NOTIFICATION: 20
}

const saveLocal = (token) => {
    localStorage.setItem('token', token);
}

export const init = () => {
    return async (dispatch) => {
        try{
            const response = await API.getMyProfile();

            console.log(response);

            dispatch({
                type: actions.INIT,
                data: response && response.data ? response.data : null
            });

        }catch(e){
            dispatch({
                type: actions.INIT,
                data: null,
                error: e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message
            })
        }
    }
}

export const login = user => {
    return async(dispatch) => {
        try{
            const response = await API.login(user);

            if(response.data.access_token){
                saveLocal(response.data.access_token);
            }

            dispatch({
                type: actions.LOGIN,
                data: response.data.user
            });
        } catch (e) {
            dispatch({
                type: actions.LOGIN,
                data: null,
                error:
                    e.response && e.response.data && e.response.data.message
                        ? e.response.data.message
                        : e.message,
            });
        }
    }
}

export const signup = (userdata, callback) => {
    return async (dispatch) => {
        try{
            const response = await API.signup(userdata);

            if(callback){
                callback(null, response.data);
            }else{
                if(response.data.access_token){
                    saveLocal(response.data.access_token);
                }

                console.log(response.data);

                dispatch({
                    type: actions.SIGNUP,
                    data: response.data
                });
            }
        } catch (e) {
            if (callback) {
                return callback(
                    e.response && e.response.data && e.response.data.message
                        ? e.response.data.message
                        : e.message
                );
            }

            dispatch({
                type: actions.SIGNUP,
                data: null,
                error:
                    e.response && e.response.data && e.response.data.message
                        ? e.response.data.message
                        : e.message,
            });
        }
    };
};

export const update = (userdata) => async (dispatch) => {
    try{
        const response = await API.update(userdata);

        dispatch({
            type: actions.UPDATE,
            data: response.data
        });
    }catch(e){
        dispatch({
            type: actions.UPDATE,
            data: null,
            error: e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message
        })
    }
}

export const getColleges = () => {
    return async(dispatch) => {
        try{
            const response = await API.getColleges();

            dispatch({
                type: actions.GET_COLLEGES,
                data: response.data
            })

        }catch(e){
            return dispatch({
                type: actions.GET_COLLEGES,
                data: null,
                error:
                    e.response && e.response.data && e.response.data.message
                        ? e.response.data.message
                        : e.message,
            });
        }
    };
};

export const actionLogOut = () => {
    return async dispatch => {
        localStorage.clear();

        dispatch({
            type: actions.LOGOUT,
        });
    };
};

export const actionGetTutors = (data = {}) => {
    return async dispatch => {
        try {
            dispatch({type: actions.TUTORS_SEARCH, data: data.query});

            const response = await API.getTutors(data);

            dispatch({
                type: actions.GET_TUTORS,
                data: response.data,
                query: data.query
            });
        } catch (e) {
            console.log(e);
            toastr.error('Oops', e.message);
        }
    };
};

export const actionGetTutor = (data) => {
    return async (dispatch) => {
        try{
            const response = await API.getTutor(data);

            dispatch({
                type: actions.GET_TUTOR,
                data: response.data,
            });
        } catch (e) {
            console.log(e);

            toastr.error('Oops', e.message);
        }
    };
};

export const actionGetReviews = data => {
    return async dispatch => {
        try {
            const response = await API.getReviews(data.id, data.sid);

            dispatch({
                type: actions.GET_REVIEWS,
                data: response.data,
            });
        } catch (e) {
            console.log(e);
            toastr.error('Oops', e.message);
        }
    };
};

export const actionPostReview = data => {
    return async dispatch => {
        try {
            const response = await API.postReview(data.id, data.review);

            dispatch({
                type: actions.POST_REVIEW,
                data: response.data,
            });
        } catch (e) {
            console.log(e);
            toastr.error('Oops', e.message);
        }
    };
};

export const actionDeleteTutor = (data, callback) => {
    return async dispatch => {
        try {
            const userId = typeof data === 'string' ? data : data.id;

            await API.deleteTutor(userId);

            if (callback) {
                callback();
            }

            dispatch({
                type: actions.DELETE_TUTOR,
                data: userId
            })
        } catch (e) {
            console.log(e);
            toastr.error('Oops', e.message);
        }
    };
};

export const actionBecomeTutor = (data, callback) => {
    return async dispatch => {
        try {
            console.log('becometutor', data);

            const response = await API.becomeTutor(
                data.id || data.user.id,
                data
            );

            if (callback) {
                callback(null, response.data);
            } else {
                dispatch({
                    type: actions.BECOME_TUTOR,
                    data: response.data,
                });
            }
        } catch (e) {
            console.log(e);

            if(callback){
                callback(e);
            }

            toastr.error('Oops', e.message);
        }
    };
};

export const getSubjects = data => {
    return async dispatch => {
        try {
            if (!data) {
                dispatch({
                    type: actions.GET_SUBJECTS,
                    data: null,
                });
                return;
            }

            const response = await API.getSubjects(data);

            dispatch({
                type: actions.GET_SUBJECTS,
                data: response.data,
            });
        } catch (e) {
            console.log(e);
            toastr.error('Oops', e.message);
        }
    };
};

export const getCoursesBySubject = data => {
    return async dispatch => {
        try {
            if (!data) {
                dispatch({
                    type: actions.GET_COURSES_BY_SUBJECT,
                    data: null,
                });
                return;
            }

            const response = await API.getCoursesBySubject(data);

            dispatch({
                type: actions.GET_COURSES_BY_SUBJECT,
                data: response.data,
            });
        } catch (e) {
            console.log(e);
            toastr.error('Oops', e.message);
        }
    };
};

export const getCoursesByTeacherId = (data) => {
    return async (dispatch) => {
        try{
            console.log(data);

            const response = await API.getCoursesByTeacherId(data);

            dispatch({
                type: actions.GET_COURSES_BY_TEACHER,
                data: response.data,
            });
        } catch (e) {
            console.log(e);
            toastr.error('Oops', e.message);
        }
    }
}

export const createSession = async (data) => await API.createSession(data);

export const getSessions = () => {
    return async (dispatch) => {
        try{
            const response = await API.getSessions();

            dispatch({
                type: actions.GET_SESSIONS,
                data: response.data
            })

        }catch(e){
            console.log(e);
            toastr.error('Oops', e.message);
        }
    }
}

export const getSession = (id) => {
    return async (dispatch) => {
        try{
            const response = await API.getSession(id);

            dispatch({
                type: actions.GET_SESSION,
                data: response.data
            })
        }catch(e){
            console.log(e);
            toastr.error('Oops', e.message);
        }
    }
}

export const getPayments = () => {
    return async (dispatch) => {
        try{
            const response = await API.getPayments();

            dispatch({
                type: actions.GET_PAYMENTS,
                data: response.data
            })

        }catch(e){
            console.log(e);
            toastr.error('Oops', e.message);
        }
    }
}

export const updateSession = async (id, data) => await API.updateSession(id, data);
export const acceptSession = async (id, data) => await API.acceptSession(id, data);
export const cancelSession = async (id) => await API.cancelSession(id);
export const createToken = async () => await API.createToken();
export const getPaid = async (data) => await API.getPaid(data);
export const requestPayout = async () => await API.requestPayout();
export const request2faToken = async () => await API.request2faToken();
export const confirm2faToken = async (data) => await API.confirm2faToken(data).then((res) => {
    if(res.data && res.data.status === 200){
        toastr.success(res.data.message);
    }

    return res;
})

export const dismissNotification = (notification) => dispatch => dispatch({type: actions.DISMISS_NOTIFICATION, data: notification});