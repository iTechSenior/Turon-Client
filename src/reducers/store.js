import _ from 'lodash';
import Socket from '../components/Chat/socket';
import { actions } from './actions';
import { toastr } from 'react-redux-toastr';

const defaultState = {
    dismissedNotifications: {}
}

const stores = (state = defaultState, action) => {
    state.errorTutor = null;

    switch (action.type) {
        case actions.INIT: {
            if (action.data && !state.socket) {
                state.socket = new Socket();
            }

            return {
                ...state,
                user: action.data,
            };
        }
        case actions.LOGIN:
            if (action.data && !state.socket) {
                state.socket = new Socket();
            }

            if(action.error){
                return {
                    ...state,
                    authError: action.error
                }
            }

            return {
                ...state,
                authError: null,
                isNotCompleted: [
                    action.data.university ? undefined : 'university',
                    action.data.email ? undefined : 'email',
                    action.data.zipcode ? undefined : 'zipcode',
                ],
                user: action.data,
            };
        case actions.LOGOUT: {
            return {
                ...state,
                isNotCompleted: null,
                user: null,
            };
        }
        case actions.SIGNUP:
            if (action.data && !state.socket) {
                state.socket = new Socket();
            }

            if(action.error){
                return {
                    ...state,
                    authError: action.error
                }
            }

            return {
                ...state,
                authError: null,
                isNotCompleted: [
                    action.data.university ? undefined : 'university',
                    action.data.email ? undefined : 'email',
                    action.data.zipcode ? undefined : 'zipcode',
                ],
                user: action.data,
            };
        case actions.UPDATE:
            return {
                ...state,
                isNotCompleted: [
                    action.data.university ? undefined : 'university',
                    action.data.email ? undefined : 'email',
                    action.data.zipcode ? undefined : 'zipcode',
                ],
                user: action.data
            };
        case actions.TUTORS_SEARCH: {
            return {
                ...state,
                tutorsSearch: action.data,
            };
        }
        case actions.GET_TUTORS: {
            if (action.query !== state.tutorsSearch) {
                return state;
            }

            return {
                ...state,
                tutors: action.data,
            };
        }

        case actions.GET_TUTOR: {
            return {
                ...state,
                tutor: action.data,
            };
        }

        case actions.BECOME_TUTOR: {
            return {
                ...state,
                tutor_id: action.data,
            };
        }

        case actions.GET_REVIEWS: {
            return {
                ...state,
                reviews: action.data,
            };
        }

        case actions.POST_REVIEW: {
            return {
                ...state,
                reviews: action.data,
            };
        }

        case actions.GET_SUBJECTS: {
            return {
                ...state,
                liveSearchSubjects: action.data,
            };
        }

        case actions.GET_COURSES_BY_SUBJECT: {
            return {
                ...state,
                liveSearchCourses: action.data,
            };
        }

        case actions.DELETE_TUTOR: {
            const user = Object.assign({}, state.user);

            delete user.tutor;

            return {
                ...state,
                user
            }
        }

        case actions.GET_COURSES_BY_TEACHER: {
            return {
                ...state,
                courses_by_teacher: action.data,
            };
        }

        case actions.GET_COLLEGES: {
            return {
                ...state,
                colleges: action.data,
            };
        }

        case actions.GET_SESSIONS: {
            return {
                ...state,
                sessions: action.data,
            };
        }

        case actions.GET_SESSION: {
            return {
                ...state,
                session: action.data,
            };
        }

        case actions.GET_PAYMENTS: {
            return {
                ...state,
                payments: action.data,
            };
        }

        case actions.DISMISS_NOTIFICATION: {
            const dismissedNotifications = {
                ...state.dismissedNotifications
            }

            dismissedNotifications[action.data] = true;

            return {
                ...state,
                dismissedNotifications
            }
        }

        default :
            return state;
    }
};

export default stores;
