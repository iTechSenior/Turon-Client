import React from 'react';
import { getCoursesByTeacherId, actionGetTutor, createSession } from '../../reducers/actions';
import { connect } from 'react-redux';
import history from '../../services/history';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as swal from 'sweetalert2';

class NewSession extends React.Component{
    state = {
        error: '',
        time: moment({h: 10, m: 0}).add(1, 'd').format('YYYY-MM-DDTHH:mm')
    }

    componentWillMount(){
        const {state} = this.props.location;

        if(!state || !state.tutor){
            history.push('/sessions');
            return;
        }

        this.setState({
            tutor: state.tutor,
            roomid: state.roomid
        })

        this.props.getCoursesByTeacherId(state.tutor);
        this.props.getTutor(state.tutor);
    }

    async submit(){
        try{
            if(!this.state.enrollment){
                throw Error('Course is required.');
            }

            if(!this.state.time){
                throw Error('Time is required.');
            }

            if(!this.state.location){
                throw Error('Location is required.');
            }

            if(!this.state.message){
                throw Error('Message is required.');
            }

            if(!this.state.roomid){
                throw Error('Room ID is required.');
            }

            const request = {
                roomid: this.state.roomid,
                teacher: this.state.tutor,
                location: this.state.location,
                enrollment: this.state.enrollment,
                message: this.state.message,
                time: this.state.time
            };

            const {data} = await createSession(request).catch((e) => {throw Error(e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message)})

            if(!data){
                throw Error('Something went wrong.');
            }

            swal.fire('Great!', data.message, 'success').then(() => {
                history.push('/sessions');
            })
        }catch(e){
            this.setState({
                error: e.message
            })
        }
    }

    render(){
        return (
            <div className="container sessions sessions-new">
                <div className="card shadow">
                    <div className="card-body">
                        <h1 className="card-title text-secondary">New session</h1>

                        {
                            !!this.state.error && (
                                <div className="alert alert-danger">
                                    {this.state.error}
                                </div>
                            )
                        }

                        <form>
                            {
                                !!this.props.tutor && (
                                    <div className="form-group">
                                        <label htmlFor="teacher">Teacher:</label>
                                        <input className="form-control" type="text" value={`${this.props.tutor.firstName} ${this.props.tutor.lastName}`} readOnly disabled />
                                    </div>
                                )
                            }
                            <div className="form-group">
                                <label htmlFor="course">Course:</label>
                                {
                                    !!this.props.courses_by_teacher
                                    ? (
                                        <select class="form-control" value={this.state.enrollment} onChange={(e) => {
                                            this.setState({
                                                enrollment: e.target.value
                                            })
                                        }} id="course">
                                            <option value="" disabled selected defaultValue>Please select course</option>
                                            {
                                                this.props.courses_by_teacher.map((v, i) => (
                                                    <option value={v.courseenrollmentid}>{v.subject}</option>
                                                ))
                                            }
                                        </select>
                                    )
                                    : (
                                        <div className="text-center">
                                            <i className="fas fa-spinner fa-spin"></i>
                                        </div>
                                    )
                                }
                                
                            </div>
                            <div className="form-group">
                                <label htmlFor="time">Time:</label>
                                <input type="datetime-local" value={this.state.time} onChange={(e) => this.setState({time: e.target.value})} min={_.slice(_.split(moment().toISOString(), ':'), 0, 2).join(':')} id="time" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="location">Meeting location:</label>
                                <input type="text" id="location" onChange={(e) => this.setState({location: e.target.value})} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message:</label>
                                <textarea id="message" onChange={(e) => this.setState({message: e.target.value})} className="form-control"></textarea>
                            </div>
                            <button onClick={(e) => {
                                e.preventDefault();

                                this.submit();
                            }} className="btn btn-secondary btn-lg btn-block mt-3">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps =(dispatch)=> {
    return {
        getCoursesByTeacherId: (data) => dispatch(getCoursesByTeacherId(data)),
        getTutor: (data) => dispatch(actionGetTutor(data))
    };
};

const mapStateToProps = ({default: states}) => {

    return {
        user: states.user,
        error: states.error,
        courses_by_teacher: states.courses_by_teacher,
        tutor: states.tutor
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NewSession);