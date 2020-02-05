import React from 'react';
import { connect } from 'react-redux';
import history from '../services/history';
import Moment from 'react-moment';
import _ from 'lodash';
import { getPayments, getPaid, requestPayout, request2faToken, confirm2faToken, init } from '../reducers/actions';
import swal from 'sweetalert2';
import { getPaymentStatus } from '../shared/types';
import QRCode from 'qrcode';

class Payments extends React.Component{
    componentDidMount(){
        this.props.getPayments();
    }

    async requestPayout(){
        try{
            if(!(this.props.user.MFA_secret && this.props.user.MFA_confirmed)){
                return swal.fire('Oops.', 'Please enable 2FA first.', 'error');
            }

            const {data} = await requestPayout();

            const {value: code, dismiss} = await swal.fire({
                title: 'Please enter code from Google Authenticator',
                input: 'tel',
                inputAttributes: {
                    autocomplete: 'off',
                    maxLength: 6
                },
                confirmButtonText: 'Next',
                showCancelButton: true
            })

            if(dismiss){
                return;
            }

            if(!code || code.length !== 6){
                throw Error('You entered invalid code.');
            }

            swal.fire({
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                title: 'Confirmation',
                html: `You have <strong>${data.payments}</strong> available payment(s) with the total of <strong>${data.sum}$</strong><br /> Do you want to get paid?`,
                type: 'question'
            }).then(({value}) => {
                if(value){
                    swal.fire({
                        title: 'Please enter your paypal email',
                        input: 'text',
                        inputValue: this.props.user.email,
                        inputAttributes: {
                            autocapitalize: 'off'
                        },
                        showCancelButton: true,
                        confirmButtonText: 'Get paid',
                        showLoaderOnConfirm: true,
                        preConfirm: (email) => {
                            return getPaid({email, code}).catch((e) => {
                                swal.showValidationMessage(e.message);
                            })
                        },
                        allowOutsideClick: () => !swal.isLoading()
                      }).then((result) => {
                        if (result.value) {
                            swal.fire({
                                title: 'Great!',
                                text: `Your request has been completed.`,
                                type: 'success'
                            }).then(() => {
                                this.props.getPayments();
                            })
                        }
                      })
                }
            })


        }catch(e){
            console.error(e);

            swal.fire('Oops', e.message, 'error');
        }
    }

    async request2fa(){
        try{
            const {data} = await request2faToken();

            const imageUrl = await QRCode.toDataURL(data.token);

            swal.fire({
                showCancelButton: true,
                confirmButtonText: 'Done',
                title: 'Please scan this QR code with Google Authenticator',
                imageUrl: imageUrl,
                imageAlt: 'QR code'
            }).then(({value}) => {
                if(value){
                    swal.fire({
                        title: 'Please enter your code',
                        input: 'tel',
                        inputOptions: {
                            'autocomplete': 'off',
                            'maxLength': 6
                        },
                        showCancelButton: true,
                        confirmButtonText: 'Confirm',
                        allowOutsideClick: !swal.isLoading(),
                        showLoaderOnConfirm: true,
                        preConfirm: (val) => {
                            return new Promise(async (resolve) => {
                                try{
                                    if(!val || val.length !== 6){
                                        throw Error('Please enter valid code.');
                                    }

                                    const {data} = await confirm2faToken(val);

                                    resolve(data);

                                }catch({message}){
                                    swal.showValidationMessage(message);
                                    resolve();
                                }
                            })
                            

                            return;
                        }
                    }).then(({value}) => {
                        if(value && value.status === 200){
                            this.props.init();
                        }
                    })
                }
            })

        }catch(e){
            console.error(e);

            swal.fire('Oops', e.message, 'error');
        }
    }

    render(){
        if(!this.props.user){
            return <div />;
        }

        if(!this.props.payments){
            return (
                <div className="text-center p-5">
                    <i className="fas fa-spinner fa-spin fa-2x"></i>
                </div>
            )
        }

        return (
            <div className="container sessions">
                <div className="card shadow">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                            <h1 className="card-title text-secondary">All payments</h1>
                            {
                                !!this.props.user.tutor && (
                                    <div>
                                        {
                                            !(this.props.user.MFA_secret && this.props.user.MFA_confirmed) && (
                                                <button style={{borderWidth: 2}} className="btn btn-danger mr-2" onClick={(e) => {e.preventDefault(); this.request2fa()}}>Request 2FA</button>
                                            )
                                        }
                                        <button style={{borderWidth: 2, fontWeight: 500}} className="btn btn-outline-secondary" onClick={(e) => {e.preventDefault(); this.requestPayout()}}>Get paid</button>
                                    </div>
                                )
                            }
                        </div>

                        {
                            this.props.payments.length
                            ? (
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Amount</th>
                                            {
                                                !!this.props.user.tutor && (
                                                    <th>Status</th>
                                                )
                                            }
                                            <th>Session</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            _.map(this.props.payments, (v, i) => (
                                                <tr key={i}>
                                                    <td>{v.id}</td>
                                                    <td>{Number.prototype.toFixed.call(parseFloat(v.price), 2)}$</td>
                                                    {
                                                        !!this.props.user.tutor && (
                                                            <td className={'text-capitalize text-success'}><strong>{getPaymentStatus(v.status)}</strong></td>
                                                        )
                                                    }
                                                    <td>
                                                        <a href={`sessions/${v.sessionid}`} onClick={(e) => {e.preventDefault(); history.push(`sessions/${v.sessionid}`)}}>Session #{v.sessionid}</a>
                                                    </td>
                                                    <td><Moment format={'LLL'}>{v.date}</Moment></td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            )
                            : (
                                <div className="text-center p-5">
                                    <p>No data</p>
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
        payments: state.payments
    };
}

export default connect(mapStateToProps, {getPayments, init})(Payments);