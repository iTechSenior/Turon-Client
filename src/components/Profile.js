import React from 'react';
import history from './../services/history';
import './styles/Profile.scss';
import _ from 'lodash';

const Profile = props => {
    return (
        <div
            className="profile"
            onClick={e => {
                e.preventDefault();
    
                if (!props.user) {
                    history.push('/login');
                } else {
                    history.push(`/view-tutor/${props.id}`);
                }
            }}
        >
            <div className="profile-details">
                <div className="d-flex align-items-center justify-content-start">
                    <div className="profile-avatar">
                        <img
                            className="rounded-circle"
                            alt="profile"
                            src={props.profile}
                        />
                    </div>
                    <div className="header-left mr-auto">
                        <div className="name">{props.name}</div>
                        <div className="subjects">
                            {_.map(
                                Array.prototype.slice.apply(props.subjects, [0, 3]),
                                v => v.subject
                            ).join(', ')}
                            {props.subjects && props.subjects.length > 3
                                ? ' and more..'
                                : ''}
                        </div>
                    </div>
                </div>
                <button
                    className="view-tutor"
                    onClick={e => {
                        e.preventDefault();
    
                        if (!props.user) {
                            history.push('/login');
                        } else {
                            history.push(`/view-tutor/${props.id}`);
                        }
                    }}
                >
                    View Tutor
                </button>
            </div>
            <div className="row mt-2">
                <div className="col-md-8">
                    <p>{props.about}</p>
                </div>
                <div className="col-md-4">
                    <div className="d-flex justify-content-md-end justify-content-center align-items-center flex-column flex-md-row">
                        <div className="mr-4">
                            <i className="fas fa-coins text-secondary mr-2" />$
                            {props.fees} / hr
                        </div>
                        <div>
                            <i className="fas fa-map-marker-alt text-secondary mr-2" />
                            Zip: {props.zip}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
