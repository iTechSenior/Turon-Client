import React, { Component } from 'react';
import history from '../services/history';
import { connect } from "react-redux";
import _ from 'lodash';
import * as moment from 'moment';

import { getSubjects, actionBecomeTutor, getCoursesBySubject, actionDeleteTutor, init } from '../reducers/actions';

import './BecomeTutor.scss';

import swal from 'sweetalert2';
import LiveSearch from "./parts/LiveSearch";

const $ = window.$;
const DEFAULT_PICTURE = '/assets/default_profile.png';

const TIMES = [
    '00:00',
    '00:30',
    '01:00',
    '01:30',
    '02:00',
    '02:30',
    '03:00',
    '03:30',
    '04:00',
    '04:30',
    '05:00',
    '05:30',
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
    '23:30'
]

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            page: 1,
            about: '',
            fees: '',
            phone: '',
            phone_confirm: '',
            live_near_school: false,
            online_tutoring: false,
            inperson_tutoring: true,
            any_tutoring: false,
            tutor_type: 0,
            profile: DEFAULT_PICTURE,
            subject: {},
            course: {},
            experience: 0,
            schedule: {
                0: {startTime: '09:00', endTime: '23:30'},
                1: {startTime: '09:00', endTime: '23:30'},
                2: {startTime: '09:00', endTime: '23:30'},
                3: {startTime: '09:00', endTime: '23:30'},
                4: {startTime: '09:00', endTime: '23:30'},
                5: {startTime: '09:00', endTime: '23:30'},
                6: {startTime: '09:00', endTime: '23:30'}
            },
            courses: [],
            errors: {},
            editable: false,
            free_hourly_late: false,
            firstName: '',
            lastName: '',
            zipcode: '',
            tutor_id: ''
        };
    }

    componentDidMount(){
        if(this.props.match.params && this.props.match.params.pid){
            if(this.props.location.state && this.props.location.state.tutorData){
                if((this.props.user && this.props.user.id === this.props.match.params.pid) || this.props.user.isAdmin){
                    const {tutorData} = this.props.location.state;

                    const schedule = {};

                    const scheduleDays = _.split(tutorData.schedule, '|')

                    for(let i = 0; i < scheduleDays.length; i++){
                        let val = {};

                        if(scheduleDays[i] === '-'){
                            val.unavailable = true;
                            val.startTime = '09:30';
                            val.endTime = '12:00';
                        }else{
                            val.startTime = _.first(_.split(scheduleDays[i], '-'));
                            val.endTime = _.last(_.split(scheduleDays[i], '-'));
                        }

                        Object.defineProperty(schedule, i, {
                            enumerable: true,
                            writable: true,
                            value: val
                        })
                    }

                    let courses = [];

                    if(Array.isArray(tutorData.subjects)){
                        courses = _.map(tutorData.subjects, i => {
                            return {
                                label: i.subject,
                                value: i.courseinfoid
                            }
                        })
                    }

                    this.setState({
                        editable: true,
                        about: tutorData.about,
                        fees: tutorData.fees == 0 ? 0 : tutorData.fees,
                        free_hourly_late: tutorData.fees == 0,
                        phone: tutorData.phone,
                        phone_confirm: tutorData.phone,
                        travel: tutorData.travel,
                        travel_no: tutorData.travel === 0 ? true : false,
                        live_near_school: tutorData.live_near_school,
                        online_tutoring: tutorData.online_tutoring,
                        profile: tutorData.profile || DEFAULT_PICTURE,
                        schedule: schedule,
                        zipcode: tutorData.zipcode,
                        firstName: tutorData.firstName,
                        lastName: tutorData.lastName,
                        courses: courses,
                        tutor_id: tutorData.id,
                        experience: tutorData.experience
                    })
                }else{
                    history.push('/');
                }
            }else{
                history.push('/');
            }
        }
    }

    liveSearchChange(v, id){
        if(!id){
            this.props.getCoursesBySubject();
            this.props.getSubjects(v);

            this.setState({
                course: {},
                subject: {
                    value: v
                }
            })
        }else{
            this.props.getCoursesBySubject(id);
            this.props.getSubjects();

            this.setState({
                subject: {
                    value: v,
                    id: id
                }
            })
        }
    }

    async uploadFile(files){
        try{
            if(files && files.length){
                const file = files[0];
    
                if(file.size > 100000){
                    throw Error('File is too big');
                }

                if(!_.startsWith(file.type, 'image')){
                    throw Error('Unknown type.');
                }

                const imageData = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        resolve(reader.result);
                    };
                })

                this.setState({
                    profile: imageData
                })
            }
        }catch({message}){
            swal.fire('Oops', message, 'error');
        }
    }

    onChangeSchedule(v, i, type){
        const {schedule} = this.state;

        if(type === 'out'){
            schedule[i].unavailable = v;
        }else{
            schedule[i][type === 'start' ? 'startTime' : 'endTime'] = v;
        }

        if(schedule[i]['endTime'] && schedule[i]['startTime'] && schedule[i]['endTime'] <= schedule[i]['startTime']){
            schedule[i]['endTime'] = moment({h: _.first(_.split(schedule[i]['startTime'], ':')), m: _.last(_.split(schedule[i]['startTime'], ':'))}).add(30, 'm').format('HH:mm');
        }

        this.setState({
            schedule: schedule
        })
    }

    async validateFirstPage(){
        const errors = {};

        if(!this.state.about){
            errors.about = 'About field is required';
        }

        if(!this.state.free_hourly_late){
            if(!this.state.fees){
                errors.fees = 'Hourly rate field is missing.';
            }else{
                if(Number.isNaN(parseInt(this.state.fees))){
                    errors.fees = 'Hourly rate field is invalid.';
                }else{
                    if(parseInt(this.state.fees) < 20){
                        errors.fees = 'The minimum hourly rate is $20';
                    }
    
                    if(parseInt(this.state.fees) > 100){
                        errors.fees = 'The maximum hourly rate is $100';
                    }
                }
            }
        }

        if(!this.state.travel_no){

            if(!this.state.travel){
                errors.travel = 'Travel mileage field is missing.';
            }else{
                if(Number.isNaN(parseInt(this.state.travel))){
                    errors.travel = 'Travel mileage field is invalid.';
                }else{
                    if(parseInt(this.state.travel) < 5){
                        errors.travel = 'The minimum travel mileage is 5 miles';
                    }
    
                    if(parseInt(this.state.travel) > 50){
                        errors.travel = 'The maximum travel mileage is 50 miles';
                    }
                }
            }
        }

        if(!this.state.profile){
            errors.profile = 'Profile picture field is required.';
        }

        if(!this.state.phone){
            errors.phone = 'Phone number is invalid or missing';
        }

        if(!this.state.phone_confirm || this.state.phone_confirm !== this.state.phone){
            errors.phone_confirm = 'Confirm phone number is invalid or missing';
        }

        if(this.state.editable){
            if(!this.state.firstName){
                errors.firstName = 'Please enter valid first name.';
            }

            if(!this.state.lastName){
                errors.lastName = 'Please enter valid last name.';
            }

            if(!this.state.zipcode){
                errors.zipcode = 'Please enter valid zip code.';
            }
        }

        this.setState({
            errors: errors
        })

        if(_.keys(errors).length === 0){
            if(this.state.profile === DEFAULT_PICTURE){
                const {value} = await swal.fire({
                    title: 'No profile picture?',
                    text: 'Tutors who have a profile picture are 82% more likely to be booked.',
                    type: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#6a00b1',
                    cancelButtonText: 'Go back',
                    confirmButtonText: 'Next page'
                })

                if(value){
                    this.setState({
                        page: 2
                    })
                }
            }else{
                this.setState({
                    page: 2
                })
            }
        }
    }

    validate(){
        const errors = {};

        if(!this.state.about){
            errors.about = 'About field is required';
        }

        if(!this.state.free_hourly_late){
            if(!this.state.fees){
                errors.fees = 'Hourly rate field is missing.';
            }else{
                if(Number.isNaN(parseInt(this.state.fees))){
                    errors.fees = 'Hourly rate field is invalid.';
                }else{
                    if(parseInt(this.state.fees) < 20){
                        errors.fees = 'The minimum hourly rate is $20';
                    }
    
                    if(parseInt(this.state.fees) > 100){
                        errors.fees = 'The maximum hourly rate is $100';
                    }
                }
            }
        }

        if(!this.state.travel_no){
            if(!this.state.travel){
                errors.travel = 'Travel mileage field is missing.';
            }else{
                if(Number.isNaN(parseInt(this.state.travel))){
                    errors.travel = 'Travel mileage field is invalid.';
                }else{
                    if(parseInt(this.state.travel) < 5){
                        errors.travel = 'The minimum travel mileage is 5 miles';
                    }
    
                    if(parseInt(this.state.travel) > 50){
                        errors.travel = 'The maximum travel mileage is 50 miles';
                    }
                }
            }
        }

        if(!this.state.courses || !this.state.courses.length){
            errors.courses = 'You have to add at least one course.';
        }

        if(!this.state.profile){
            errors.profile = 'Profile picture field is required.';
        }

        if(!this.state.phone){
            errors.phone = 'Phone number is invalid or missing';
        }

        if(!this.state.phone_confirm || this.state.phone_confirm !== this.state.phone){
            errors.phone_confirm = 'Confirm phone number is invalid or missing';
        }

        for(let key in this.state.schedule){
            if(this.state.schedule[key].unavailable || (this.state.schedule[key].startTime && this.state.schedule[key].endTime)){

            }else{
                errors.schedule = 'Schedule field is invalid or missing.';
            }
        }

        if(this.state.editable){
            if(!this.state.firstName){
                errors.firstName = 'Please enter valid first name.';
            }

            if(!this.state.lastName){
                errors.lastName = 'Please enter valid last name.';
            }

            if(!this.state.zipcode){
                errors.zipcode = 'Please enter valid zip code.';
            }
        }else{
            if(!this.state.tos){
                errors.tos = 'You have to accept the Terms of Service.';
            }
        }

        const schedule = _.map(this.state.schedule);

        this.setState({
            errors: errors,
            loading: true
        })

        if(_.keys(errors).length === 0){
            if(this.state.editable){
                this.props.becomeTutor({
                    id: this.state.tutor_id,
                    user: this.props.user.isAdmin ? undefined : this.props.user,
                    about: this.state.about,
                    fees: this.state.free_hourly_late ? 0 : this.state.fees,
                    phone: this.state.phone,
                    profile: this.state.profile,
                    travel: this.state.travel_no ? 0 : this.state.travel,
                    schedule: schedule,
                    courses: this.state.courses,
                    live_near_school: this.state.live_near_school,
                    online_tutoring: this.state.tutor_type,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    zipcode: this.state.zipcode,
                    experience: this.state.experience
                }, (err) => {
                    this.setState({
                        loading: false
                    }, () => {
                        if(!err){
                            swal.fire('Great!', 'The profile has been successfully updated.', 'success').then(() => {
                                history.push(`/view-tutor/${this.state.tutor_id}`);
                            })
                        }
                    })
                })
            }else{
                this.props.becomeTutor({
                    user: this.props.user,
                    about: this.state.about,
                    travel: this.state.travel_no ? 0 : this.state.travel,
                    fees: this.state.free_hourly_late ? 0 : this.state.fees,
                    phone: this.state.phone,
                    profile: this.state.profile,
                    schedule: schedule,
                    courses: this.state.courses,
                    live_near_school: this.state.live_near_school,
                    online_tutoring: this.state.type_tutor,
                    experience: this.state.experience
                }, (err, data) => {
                    this.setState({
                        loading: true
                    }, () => {
                        if(!err){
                            this.props.init();
                            history.push(`/view-tutor/${data}?t=2fa`);
                        }
                    })
                })
            }
        }

    }

    deleteProfile(){
        this.props.deleteTutor(this.props.user.isAdmin ? this.state.tutor_id : this.props.user, () => {
            history.push('/');
        })
    }

    renderTitle(){
        if(this.state.editable){
            return 'Edit tutor';
        }

        if(this.props.user && this.props.user.isAdmin){
            return 'Add a physical location'
        }

        return 'Become tutor';
    }

    maybeFirstPage(){
        if(this.state.page !== 1){
            return <div />;
        }
        
        return (
            <div className="card shadow">
                <div className="card-body">
                    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
                        <h1 className="card-title text-secondary" style={{marginBottom: '2rem'}}>{
                            this.renderTitle()
                        }</h1>
                        {
                            this.state.editable && <button className="btn btn-danger" onClick={e => {e.preventDefault(); this.deleteProfile()}}>Delete profile</button>
                        }
                    </div>
                        {
                            this.props.error && (
                                    <div className="alert alert-danger">
                                            {this.props.error}
                                    </div>
                            )
                        }
                        <div className="row">
                            <div className="col-md-6">
                                {
                                    !!this.state.editable && (
                                        <div className="form-group">
                                            <label>First Name</label>
                                            <input type="text" className="form-control" value={this.state.firstName} required onChange={(e) => this.setState({firstName: e.target.value})} />
                                            {
                                                this.state.errors.firstName && (
                                                    <div className="invalid-feedback d-block">{this.state.errors.firstName}</div>
                                                )
                                            }
                                        </div>
                                    )
                                }
                                {
                                    !!this.state.editable && (
                                        <div className="form-group">
                                            <label>Last Name</label>
                                            <input type="text" className="form-control" value={this.state.lastName} required onChange={(e) => this.setState({lastName: e.target.value})} />
                                            {
                                                this.state.errors.lastName && (
                                                    <div className="invalid-feedback d-block">{this.state.errors.lastName}</div>
                                                )
                                            }
                                        </div>
                                    )
                                }
                                {
                                    !!this.state.editable && (
                                        <div className="form-group">
                                            <label>Zip Code</label>
                                            <input type="text" className="form-control" value={this.state.zipcode} required onChange={(e) => this.setState({zipcode: e.target.value})} />
                                            {
                                                this.state.errors.zipcode && (
                                                    <div className="invalid-feedback d-block">{this.state.errors.zipcode}</div>
                                                )
                                            }
                                        </div>
                                    )
                                }
                                <div className="form-group">
                                    <label>About yourself:</label>
                                    <textarea style={{height: 100}} name="about" value={this.state.about} onChange={(e) => this.setState({about: e.target.value})} required placeholder="Talk about your major, year in school, and about your tutoring experience.." className="form-control" />
                                    {
                                        this.state.errors.about && (
                                            <div className="invalid-feedback d-block">{this.state.errors.about}</div>
                                        )
                                    }
                                </div>


                                
                                <div className="form-group">
                                    <label className="d-flex justify-content-between align-items-center">
                                        Hourly Rate:
                                        
                                        <div className="dropdown mb-2" ref={ref => this._dropdown = ref}>
                                        <a href="#" data-toggle="dropdown" onMouseEnter={(e) => {
                                            $(e.currentTarget).dropdown('toggle');
                                        }} aria-haspopup="true" aria-expanded="false">Use our price picker</a>
                                        <div className="dropdown-menu shadow-lg price-picker" style={{border: 'none'}}>
                                            <h3>Select an hourly rate</h3>
                                            <div className="dropdown-item" onClick={(e) => {e.preventDefault(); this.setState({free_hourly_late: true, fees: 0})}}>
                                                <strong>FREE</strong> · <span className="text-muted">Getting Started</span>
                                                <p className="text-muted mb-0">
                                                    This is a great way to get started. Get comfortable tutoring the class and build your ratings/reviews.
                                                </p>
                                            </div>

                                            <div className="dropdown-item" onClick={(e) => {e.preventDefault(); this.setState({free_hourly_late: false, fees: 20})}}>
                                                <strong>20$/hr</strong> · <span className="text-muted">Scholar</span>
                                                <p className="text-muted mb-0">
                                                Great price if you’ve TA’d this class previously or if you have some experience tutoring this class.
                                                </p>
                                            </div>

                                            <div className="dropdown-item" onClick={(e) => {e.preventDefault(); this.setState({free_hourly_late: false, fees: 30})}}>
                                                <strong>30$/hr</strong> · <span className="text-muted">Pro</span>
                                                <p className="text-muted mb-0">
                                                You are very comfortable tutoring this class and have tutored many students.
                                                </p>
                                            </div>

                                            <div className="dropdown-item" onClick={(e) => {e.preventDefault(); this.setState({free_hourly_late: false, fees: 40})}}>
                                                <strong>40$/hr</strong> · <span className="text-muted">Guru</span>
                                                <p className="text-muted mb-0">
                                                You are a very strong tutor in this course and have extensive tutoring experience.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    </label>

                                    <div className="form-check mb-1">
                                        <input type="checkbox" checked={this.state.free_hourly_late} onChange={(e) => {this.setState({free_hourly_late: e.target.checked, fees: e.target.checked ? 0 : 25})}} className="form-check-input" id="free_hourly_late" />
                                        <label className="form-check-label" htmlFor="free_hourly_late">Free</label>
                                    </div>

                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text">$</div>
                                        </div>
                                        <input type="number" disabled={this.state.free_hourly_late} min="20" max="100" value={this.state.fees} name="fees" onChange={(e) => this.setState({fees: e.target.value})} required placeholder="Enter hourly rate" className="form-control" />
                                        <div className="input-group-append">
                                            <div className="input-group-text">/ hour</div>
                                        </div>
                                    </div>
                                    {
                                        this.state.errors.fees && (
                                            <div className="invalid-feedback d-block">{this.state.errors.fees}</div>
                                        )
                                    }
                                </div>


                                <div className="form-group">
                                    <label>How far are you willing to travel from your zip code:</label>
                                    <div className="form-check mb-3">
                                        <input type="checkbox" checked={this.state.travel_no} onChange={(e) => {this.setState({travel_no: e.target.checked, travel: e.target.checked ? 0 : 10})}} className="form-check-input" id="travel_no" />
                                        <label className="form-check-label" htmlFor="travel_no">I'm not willing to travel out of my zip code</label>
                                    </div>
                                    <div className="input-group">
                                        <input type="number" disabled={this.state.travel_no} min="5" max="50" value={this.state.travel} name="travel" onChange={(e) => this.setState({travel: e.target.value})} required placeholder="Enter mileage" className="form-control" />
                                        <div className="input-group-append">
                                            <div className="input-group-text">/ miles</div>
                                        </div>
                                    </div>
                                    {
                                        this.state.errors.travel && (
                                            <div className="invalid-feedback d-block">{this.state.errors.travel}</div>
                                        )
                                    }
                                </div>

                                <div className="form-group">
                                    <div className="form-check">
                                        <input type="checkbox" checked={this.state.live_near_school} onChange={(e) => {this.setState({live_near_school: e.target.checked})}} className="form-check-input" id="live_near_school" />
                                        <label className="form-check-label" htmlFor="live_near_school">Do you plan on living near school for the Summer?</label>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>How can you tutor?  Online, In-person, or Doesn't matter</label>
                                    <div className="form-check">
                                            <input type="checkbox" checked={this.state.online_tutoring} onChange={(e) => {this.setState({online_tutoring: true, inperson_tutoring: false, any_tutoring: false, type_tutor: 2})}} className="form-check-input" id="online_tutoring" />
                                            <label className="form-check-label" htmlFor="online_tutoring">Online Only</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" checked={this.state.inperson_tutoring} onChange={(e) => { this.setState({ inperson_tutoring: true, online_tutoring: false, any_tutoring: false, type_tutor: 0 }) }} className="form-check-input" id="inperson_tutoring" />
                                        <label className="form-check-label" htmlFor="inperson_tutoring">In-Person Only</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" checked={this.state.any_tutoring} onChange={(e) => { this.setState({ any_tutoring: true, online_tutoring: false, inperson_tutoring:false, type_tutor: 1 }) }} className="form-check-input" id="any_tutoring" />
                                        <label className="form-check-label" htmlFor="any_tutoring">Doesn't matter</label>
                                    </div>
                                </div>

                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="mb-0">Profile picture</label>
                                    <p><small className="text-muted">Tutors who have a profile picture are <strong>82%</strong> more likely to be booked</small></p>
                                    <div>
                                        {
                                            this.state.profile && (
                                                <img className="rounded-circle mr-3" src={this.state.profile} width={100} height={100} alt="" />
                                            )
                                        }
                                        <input type="file" accept="image/png, image/jpeg" onChange={e => this.uploadFile(e.target.files)} />
                                    </div>
                                    {
                                        this.state.errors.profile && (
                                            <div className="invalid-feedback d-block">{this.state.errors.profile}</div>
                                        )
                                    }
                                </div>

                                <div className="form-group">
                                    <label>How many years of tutoring experience do you have:</label>
                                    <select class="form-control" value={this.state.experience} onChange={(e) => {
                                        e.preventDefault();

                                        this.setState({
                                            experience: e.target.value
                                        })
                                    }}>
                                        <option value={0}>None</option>
                                        <option value={1}>1-2 years</option>
                                        <option value={3}>3-5 years</option>
                                        <option value={5}>5+ years</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Phone number:</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text">+1</div>
                                        </div>
                                        <input type="tel" className="form-control" value={this.state.phone} onChange={(e) => this.setState({phone: e.target.value})} />
                                    </div>
                                    {
                                        this.state.errors.phone && (
                                            <div className="invalid-feedback d-block">{this.state.errors.phone}</div>
                                        )
                                    }
                                </div>

                                <div className="form-group">
                                    <label>Confirm phone number:</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <div className="input-group-text">+1</div>
                                        </div>
                                        <input type="tel" className="form-control" value={this.state.phone_confirm} onChange={(e) => this.setState({phone_confirm: e.target.value})} />
                                    </div>
                                    {
                                        this.state.errors.phone_confirm && (
                                            <div className="invalid-feedback d-block">{this.state.errors.phone_confirm}</div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="text-center" style={{marginTop: '2rem'}}>
                            <button type="button" onClick={(e) => {
                                e.preventDefault();
                                
                                this.validateFirstPage();
                            }} className="btn btn-outline-secondary">Next</button>
                        </div>
                    </div>
            </div>
        )
    }

    maybeSecondPage(){
        if(this.state.page !== 2){
            return <div />;
        }
        
        return (
            <div className="card shadow">
                <div className="card-body">
                    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
                        <h1 className="card-title text-secondary" style={{marginBottom: '2rem'}}>{this.state.editable ? 'Edit tutor' : 'Become tutor'}</h1>
                        {
                            this.state.editable && <button className="btn btn-danger" onClick={e => {e.preventDefault(); this.deleteProfile()}}>Delete profile</button>
                        }
                    </div>
                        {
                            this.props.error && (
                                    <div className="alert alert-danger">
                                            {this.props.error}
                                    </div>
                            )
                        }
                        <div className="row">
                            <div className="col-md-6">

                                <h2>Classes</h2>

                                {
                                    this.state.errors.courses && (
                                        <div className="invalid-feedback d-block">{this.state.errors.courses}</div>
                                    )
                                }

                                {
                                    <LiveSearch
                                        label={'Courses'}
                                        placeholder={'Select courses'}
                                        isMultiple
                                        defaultValue={this.state.courses}
                                        onChange={(v) => {
                                            console.log(v);

                                            this.setState({
                                                courses: _.map(v, i => {
                                                    return {
                                                        subject: i.label,
                                                        id: i.value
                                                    }
                                                })
                                            })
                                        }}
                                        onInputChange={(v) => {
                                            if(!v){
                                                return;
                                            }

                                            this.liveSearchChange(v);
                                        }}
                                        data={_.map(this.props.liveSearchSubjects, v => {
                                            return {
                                                label: v.subject,
                                                value: v.courseinfoid
                                            }
                                        })}
                                    />
                                }

                            </div>
                            <div className="col-md-6">

                                <h3>Schedule</h3>

                                <div className="form-group">
                                    {
                                        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((v, i) => (
                                            <div
                                                key={i}
                                                className="days-graph">
                                                <div>{v}</div>
                                                <div>
                                                    <select onChange={e => this.onChangeSchedule(e.target.value, i, 'start')} disabled={this.state.schedule[i].unavailable} value={this.state.schedule[i].startTime} className="form-control form-control-sm">
                                                        {
                                                            TIMES.map((v, i) => (
                                                                <option key={i} value={v}>{moment({h: _.first(_.split(v, ':')), m: _.last(_.split(v, ':'))}).format('hh:mm A')}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    {/* <input type="time" disabled={this.state.schedule[i].unavailable}    value={this.state.schedule[i].startTime} className="form-control form-control-sm" /> */}
                                                </div>
                                                <div>To</div>
                                                <div>

                                                    <select onChange={e => this.onChangeSchedule(e.target.value, i, 'end')} disabled={this.state.schedule[i].unavailable} value={this.state.schedule[i].endTime} className="form-control form-control-sm">
                                                        {
                                                            TIMES.map((v, i) => (
                                                                <option key={i} value={v}>{moment({h: _.first(_.split(v, ':')), m: _.last(_.split(v, ':'))}).format('hh:mm A')}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    {/* <input type="time" disabled={this.state.schedule[i].unavailable} onChange={e => this.onChangeSchedule(e.target.value, i, 'end')} value={this.state.schedule[i].endTime} className="form-control form-control-sm" /> */}
                                                </div>
                                                <div className="form-check">
                                                    <input type="checkbox" onChange={e => this.onChangeSchedule(e.target.checked, i, 'out')} checked={this.state.schedule[i].unavailable} className="form-check-input" />
                                                    <label className="form-check-label">unavailable</label>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    {
                                        this.state.errors.schedule && (
                                            <div className="invalid-feedback d-block">{this.state.errors.schedule}</div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="text-center" style={{marginTop: '2rem'}}>
                            {
                                !this.state.editable && (
                                    <div className="form-check mb-3">
                                        <input type="checkbox" checked={this.state.tos} onChange={(e) => {this.setState({tos: e.target.checked})}} className="form-check-input" id="tos" />
                                        <label className="form-check-label" htmlFor="tos">I agree to the <a href="assets/Tutor_TOS.pdf" target="_blank">Terms of Service</a></label>
                                        {
                                            this.state.errors.tos && (
                                                <div className="invalid-feedback d-block">{this.state.errors.tos}</div>
                                            )
                                        }
                                    </div>
                                )
                            }
                            <button type="button" onClick={(e) => {
                                e.preventDefault();
                                this.setState({
                                    page: 1
                                })
                            }} className="btn btn-outline-secondary mr-2">Previous</button>
                            <button type="submit" disabled={this.state.loading} onClick={(e) => {
                                e.preventDefault();
                                this.validate();
                            }} className="btn btn-secondary">Submit</button>
                        </div>
                    </div>
            </div>
        )
    }

    render() {
        return (
            <div className="container become-tutor">
                
                {
                    this.maybeFirstPage()
                }

                {
                    this.maybeSecondPage()
                }
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        becomeTutor: (data, callback) => dispatch(actionBecomeTutor(data, callback)),
        deleteTutor: (data, callback) => dispatch(actionDeleteTutor(data, callback)),
        getCoursesBySubject: data => dispatch(getCoursesBySubject(data)),
        getSubjects: data => dispatch(getSubjects(data)),
        init: () => dispatch(init())
    };
};
const mapStateToProps = ({default: states}) => {
    if(!states.user){
        history.push('/');
        return {};
    }

    return {
        user: states.user,
        error: states.errorTutor,
        liveSearchSubjects: states.liveSearchSubjects,
        liveSearchCourses: states.liveSearchCourses
    };
};
export default connect(
        mapStateToProps,
        mapDispatchToProps
)(Login);
