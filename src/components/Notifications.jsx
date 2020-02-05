import React from 'react';
import { connect } from 'react-redux';
import history from '../services/history';
import { dismissNotification } from '../reducers/actions';

class Notification extends React.Component{
    state = {
        classes: ''
    }

    render2fa(){
        if(!(this.props.user && this.props.user.tutor && !(this.props.user.MFA_confirmed && this.props.user.MFA_secret))){
            return <div />;
        }

        if(this.props.dismissedNotifications && this.props.dismissedNotifications['2fa']){
            return <div />;
        }

        return (
            <div className={`alert alert-danger animated ${this.state.classes}`} style={{marginBottom: 0, padding: '1.5rem 2rem'}}>
                You cannot receive payouts until you have secured your account through 2 step authentication. Please go on to the <a href="#" onClick={(e) => {e.preventDefault(); history.push('/payments')}}>Payments page</a> to secure your account.
                <button onClick={(e) => {
                    e.preventDefault();

                    this.props.dismissNotification('2fa');
                }} type="button" class="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        )
    }

    render(){
        return (
            <div>
                {
                    this.render2fa()
                }
            </div>
        )
    }
}

const mapStateToProps = ({default: state}) => {

    return {
        user: state.user,
        dismissedNotifications: state.dismissedNotifications 
    }
}

export default connect(mapStateToProps, {dismissNotification: n => dismissNotification(n)})(Notification);