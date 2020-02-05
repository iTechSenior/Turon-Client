import React from 'react';
import '../styles/Sessions.scss';
import { getSessions } from '../../reducers/actions';
import { connect } from 'react-redux';
import history from '../../services/history';
import * as _ from 'lodash';
import Moment from 'react-moment';

class Sessions extends React.Component{
    componentWillMount(){
        this.props.getSessions();
    }

    render(){
        return (
            <div className="container sessions">
                <div className="card shadow">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                            <h1 className="card-title text-secondary">All sessions</h1>
                            <div>
                                <a href="/payments" onClick={(e) => {e.preventDefault(); history.push('/payments')}} className="btn btn-outline-secondary">View payments</a>
                            </div>
                        </div>

                        {
                            (!!this.props.sessions && this.props.sessions.length)
                            ? (
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>User</th>
                                            <th>Time</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            _.map(this.props.sessions, (v, i) => (
                                                <tr key={i}>
                                                    <td>{v.sessionid}</td>
                                                    <td>
                                                        {
                                                            !!(this.props.user && this.props.user.tutor)
                                                            ? (
                                                                <a href={`view-tutor/${v.userid}`} onClick={(e) => {
                                                                    e.preventDefault();
            
                                                                    history.push(`view-tutor/${v.userid}`)
                                                                }}>{v.firstName} {v.lastName}</a>
                                                            )
                                                            : (
                                                                <span>{v.firstName} {v.lastName}</span>
                                                            )
                                                        }
                                                    </td>
                                                    <td><Moment format={'LLL'}>{v.date}</Moment></td>
                                                    <td className="text-capitalize"><strong>{v.status}</strong></td>
                                                    <td className="text-right">
                                                        <button className="btn btn-sm btn-info" onClick={(e) => {e.preventDefault(); history.push(`sessions/${v.sessionid}`)}}>View</button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            )
                            : (
                                <div className="text-center p-5">
                                    You don't have any sessions
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({default: state})=> {
    return {
        user : state.user,
        sessions: state.sessions
    };
}


export default connect(mapStateToProps, {getSessions})(Sessions);