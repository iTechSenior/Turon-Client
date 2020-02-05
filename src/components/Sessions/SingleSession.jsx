import React from 'react';
import history from '../../services/history';
import { getSession, updateSession, acceptSession, createToken, cancelSession } from '../../reducers/actions';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';

import braintreeDropin from 'braintree-web-drop-in';
import queryString from 'query-string';

class SingleSession extends React.Component{
    state = {
        editing: false,
        showPayment: false,
        modelError: ''
    }

    componentDidMount(){
        const {params} = this.props.match;

        if(!params || !params.id){
            history.push('sessions');
            return;
        }

        this.props.getSession(params.id);

        const query = queryString.parse(this.props.location.search);

        if(query.a === 'accept'){
            setTimeout(() => {
                if(this.props.session){
                    if(this.props.user && this.props.session.studentid === this.props.user.id){
                        if(!this.props.session.acceptedByStudent){
                            this.pay();
                        }
                    }

                    if(this.props.user && this.props.session.teacherid === this.props.user.id){
                        if(!this.props.session.acceptedByTeacher){
                            this.accept();
                        }
                    }
                }
            }, 1000);
        }
    }

    edit(){
        this.setState({
            date: this.props.session.date,
            location: this.props.session.location,
            message: this.props.session.message,
            price: this.props.session.price,
            editing: true
        })
    }

    async save(){
        this.setState({
            error: null
        })

        try{
            await updateSession(this.props.session.sessionid, {
                location: this.state.location,
                message: this.state.message,
                date: this.state.date,
                price: this.state.price
            })

            this.props.getSession(this.props.session.sessionid);

            this.setState({
                editing: false
            })

        }catch(e){
            console.error(e);

            this.setState({
                error: e.message,
                editing: false
            })
        }
    }

    async pay(){
        if(this.props.session.price === 0){
            await acceptSession(this.props.session.sessionid, {
                nonce: 'FREE'
            })

            this.setState({
                showPayment: false
            })

            this.props.getSession(this.props.session.sessionid);
            return;
        }

        const {data} = await createToken();

        this.setState({
            showPayment: true,
            modelError: ''
        }, async () => {
            try{
                const instance = await braintreeDropin.create({
                    authorization: data.token,
                    container: '#payment-form',
                    googlePay: {},
                    paypal: {},
                    paypalCredit: {},
                    applePay: {
                        displayName: 'Turon.co',
                        paymentRequest: {
                          total: {
                            label: 'Turon session',
                            amount: this.props.session.price
                          },
                          requiredBillingContactFields: ["postalAddress"]
                        }
                    }
                })

                this.payBtn.addEventListener('click', async (e) => {
                    e.preventDefault();

                    instance.requestPaymentMethod(async (err, payload) => {
                        try{
                            if(err){
                                throw err;
                            }

                            await acceptSession(this.props.session.sessionid, {
                                nonce: payload.nonce
                            })

                            this.setState({
                                showPayment: false
                            })

                            this.props.getSession(this.props.session.sessionid);
                        }catch(e){
                            console.log(e);

                            this.setState({
                                modalError: e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message
                            })
                        }
                    });
                })

            }catch(e){
                console.log(e);

                this.setState({
                    modalError: e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message
                })
            }
        });
    }

    async accept(){
        this.setState({
            error: null
        });

        try{
            await acceptSession(this.props.session.sessionid);

            this.props.getSession(this.props.session.sessionid);
        }catch(e){
            this.setState({
                error: e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message
            })
        }
    }

    handleChange = (field) => (e) => {
        const obj = {};

        Object.defineProperty(obj, field, {
            writable: true,
            enumerable: true,
            value: e.target.value
        })

        this.setState(obj);
    }

    async cancel(){
        this.setState({
            error: null
        });
        
        try{
            await cancelSession(this.props.session.sessionid);

            this.props.getSession(this.props.session.sessionid);
        }catch(e){
            this.setState({
                error: e.response && e.response.data && e.response.data.message ? e.response.data.message : e.message
            })
        }
    }

    renderButtons(){
        let role;

        if(!this.props.session || this.props.session.status !== 'pending'){
            return;
        }

        if(this.props.user && this.props.session){
            if(this.props.session.studentid == this.props.user.id && !this.props.session.acceptedByStudent){
                role = 'student';
            }

            if(this.props.session.teacherid == this.props.user.id){
                role = 'teacher';
            }
        }

        switch(role){
            case 'student': {
                return (
                    <div className="form-group text-center mt-3">
                        {
                            this.state.editing
                            ? (
                                <button className="btn btn-success mr-2" onClick={this.save.bind(this)}>Save &amp; Resend</button>
                            )
                            : (
                                <div>
                                    <button className="btn btn-outline-info mr-2" onClick={this.edit.bind(this)}>Edit</button>
                                    {
                                        !!this.props.session.acceptedByTeacher && (
                                            <button className="btn btn-primary" onClick={this.pay.bind(this)}>Accept &amp; choose a payment method</button>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                )
            }
            case 'teacher': {
                if(this.props.session.acceptedByTeacher){
                    if(!this.props.session.acceptedByStudent){
                        return (
                            <div className="from-group text-center mt-3">
                                <button className="btn btn-danger" onClick={this.cancel.bind(this)}>Cancel</button>
                            </div>
                        )
                    }

                    return;
                }

                return (
                    <div className="from-group text-center mt-3">
                        {
                            this.state.editing
                            ? (
                                <button className="btn btn-success mr-2" onClick={this.save.bind(this)}>Save &amp; Accept</button>
                            )
                            : (
                                <div>
                                    <button className="btn btn-outline-info mr-3" onClick={this.edit.bind(this)}>Edit</button>
                                    <button className="btn btn-primary" onClick={this.accept.bind(this)}>Accept</button>
                                </div>
                            )
                        }
                    </div>
                )
            }
            default: {
                return;
            }
        }
    }

    handleClosePayment(){
        this.setState({
            showPayment: false
        })
    }

    renderPayment(){
        return (
            <div className={this.state.showPayment ? 'd-block' : 'd-none'}>
                {
                    !!this.state.modalError && (
                        <div className="alert alert-danger">
                            {this.state.modalError}
                        </div>
                    )
                }
                <h1>Payment</h1>
                <div id="payment-form"></div>
                <button id="submit-button" ref={(ref) => this.payBtn = ref} className="btn btn-primary">Pay</button>
            </div>
        )
    }

    renderAlert(){
        if(!this.props.session){
            return;
        }

        if(this.props.session.status !== 'pending'){
            switch(this.props.session.status){
                case 'paid': return <div className="alert alert-success">The session has been paid for.</div>;
                default: return;
            }
        }

        if(this.props.session.acceptedByTeacher){
            return <div className="alert alert-success">The meeting has been accepted by tutor.</div>;            
        }
    }

    render(){
        if(!this.props.session){
            return (
                <div className="text-center p-5">
                    <i className="fas fa-spinner fa-spin fa-3x"></i>
                </div>
            )
        }

        return (
            <div className="container sessions" style={{maxWidth: 500}}>
                <div className="card shadow">
                    <div className="card-body">
                        {
                            !!this.state.error && (
                                <div className="alert alert-danger">
                                    {this.state.error}
                                </div>
                            )
                        }

                        {
                            this.renderPayment()
                        }
                        {
                            <div className={this.state.showPayment ? 'd-none' : 'd-block'}>
                                <h1 className="card-title text-secondary text-center">Session #{!!this.props.session && this.props.session.sessionid}</h1>

                                {
                                    this.renderAlert()
                                }

                                {
                                    !!this.props.session
                                    ? (
                                        <div>
                                            <div className="form-group">
                                                <label htmlFor="subject">Subject:</label>
                                                <input type="text" className="form-control" value={this.props.session.subject} readOnly />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="subject">Location:</label>
                                                {
                                                    this.state.editing
                                                    ? <input type="text" className="form-control" onChange={this.handleChange('location')} value={this.state.location} />
                                                    : <input type="text" className="form-control" value={this.props.session.location} readOnly />
                                                }
                                                
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="subject">Message:</label>
                                                {
                                                    this.state.editing
                                                    ? <input type="text" className="form-control" onChange={this.handleChange('message')} value={this.state.message} />
                                                    : <input type="text" className="form-control" value={this.props.session.message} readOnly />
                                                }
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="subject">Date:</label>
                                                {
                                                    this.state.editing
                                                    ? <input type="datetime-local" className="form-control" onChange={this.handleChange('date')} />
                                                    : <input type="datetime-local" className="form-control" min={_.slice(_.split(moment().toISOString(), ':'), 0, 2).join(':')} value={this.props.session.date} readOnly />
                                                }
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="subject">Price:</label>
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text">$</span>
                                                    </div>
                                                    {
                                                        this.state.editing
                                                        ? <input type="number" className="form-control" onChange={this.handleChange('price')} value={this.state.price} />
                                                        : <input type="number" className="form-control" value={Number.prototype.toFixed.call(parseFloat(this.props.session.price), 2)} readOnly />
                                                    }
                                                </div>
                                            </div>
                                            {
                                                this.renderButtons()
                                            }
                                        </div>
                                    )
                                    : (
                                        <div className="text-center p-5">
                                            <i className="fas fa-spinner fa-spin fa-2x"></i>
                                        </div>
                                    )
                                }
                            </div>
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
        session: state.session,
        error: state.error
    };
}

export default connect(mapStateToProps, {getSession})(SingleSession);