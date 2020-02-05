import React from 'react';

import { connect } from 'react-redux';
import history from '../services/history';
import { signup, getColleges } from '../reducers/actions';
import Select from 'react-select';

import swal from 'sweetalert2';
import $ from 'jquery';
import * as uuid from 'uuid/v1';
import _ from 'lodash';

import './styles/Admin.scss';
import { actionGetTutors } from '../reducers/actions';

class AdminPanel extends React.Component {

    componentDidMount() {
        this.props.getTutors({
            query: '',
            schools: ['San Jose State University', 'San Diego State University'].join(','),
            limit: 9999
        });
        this.props.getColleges();
    }

    registerPhysicalLocation() {
        const { colleges } = this.props;

        const options = colleges && colleges.length && colleges.map(item => (
            `<option key=${item.collegeid}>${item.college}</option>`
        ));

        swal.fire({
            title: 'Your request',
            showCancelButton: true,
            html:
                `<div style="max-width: 350px;margin: auto;">
                    <select id="swal-input4" class="swal2-select" style="display: flex; max-width:350px;">${options}</select>
                    <input id="swal-input1" style="margin: 0.5rem 0" style="margin: 0.5rem 0" placeholder="First name" class="swal2-input">
                    <input id="swal-input2" style="margin: 0.5rem 0" placeholder="Last name" class="swal2-input">
                    <input id="swal-input3" style="margin: 0.5rem 0" placeholder="Zip code" class="swal2-input">
                </div>`,
            preConfirm: () => {
                return new Promise((resolve) => {
                    const firstName = $('#swal-input1').val();
                    const lastName = $('#swal-input2').val();
                    const zipcode = $('#swal-input3').val();
                    const university = $('#swal-input4').val();

                    if (!firstName || !lastName || !zipcode || !university) {
                        swal.showValidationMessage('Please enter valid values.');
                        resolve();
                        return;
                    }

                    const password = uuid();

                    this.props.signup({
                        tos: true,
                        university: university,
                        firstName: firstName,
                        lastName: lastName,
                        email: `${password}@turon.co`,
                        password: password,
                        confirmPassword: password,
                        zipcode: zipcode
                    }, (err, userid) => {
                        if (err) {
                            swal.showValidationMessage(err);
                            resolve();
                            return;
                        }

                        resolve(userid);
                    })
                })
            },
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !swal.isLoading(),
            onOpen: function () {
                $('#swal-input1').focus()
            }
        }).then(({ value }) => {
            if (value) {
                history.push({
                    pathname: `/become-tutor/${value.id}`,
                    state: {
                        tutorData: {
                            id: value.id,
                            subjects: [],
                            firstName: value.firstName,
                            lastName: value.lastName,
                            zipcode: value.zipcode,
                            schedule: '09:00-23:30|09:00-23:30|09:00-23:30|09:00-23:30|09:00-23:30|09:00-23:30|09:00-23:30'
                        }
                    }
                });
            }
        })
    }

    renderTutors() {
        if (!this.props.tutors) {
            return <div className="py-5 text-center"><i className="fas fa-spinner fa-4x text-secondary fa-spin"></i></div>
        }

        return (
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subjects</th>
                        <th>Fees</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        _.map(this.props.tutors, (v, i) => (
                            <tr style={{ cursor: 'pointer' }} onClick={(e) => {
                                e.preventDefault();

                                history.push(`view-tutor/${v.tutorid}`)
                            }}>
                                <td>
                                    <img style={{ maxWidth: 30, maxHeight: 30 }} src={v.profile} alt="" width={30} height={30} className="rounded-circle" />
                                </td>
                                <td>{v.name}</td>
                                <td><a href={`mailto:${v.email}`}>{v.email}</a></td>
                                <td>{v.subjects.length}</td>
                                <td>{parseInt(v.fees) ? Number.prototype.toFixed.call(parseFloat(v.fees), 2) : 'FREE'}</td>
                                <td>

                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        )
    }

    render() {
        console.log("adsfasfd", this.props.colleges)
        if (!this.props.user) {
            return <div />;
        } else {
            if (!this.props.user.isAdmin) {
                history.push('/');
                return <div />;
            }
        }

        return (
            <div className="container admin">
                <div className="card card-noborder shadow">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                            <h1>Admin panel</h1>
                            <div>
                                <a
                                    href="/become-tutor"
                                    onClick={(e) => {
                                        e.preventDefault();

                                        this.registerPhysicalLocation();
                                    }}
                                    class="btn btn-outline-secondary">Add a physical location</a>
                            </div>
                        </div>

                        {
                            this.renderTutors()
                        }


                    </div>
                </div>
            </div>
        )
    }
}



const mapDispatchToProps = (dispatch) => {
    return {
        signup: data => dispatch(signup(data)),
        getTutors: (data) => dispatch(actionGetTutors(data)),
        getColleges: () => dispatch(getColleges())
    };
};

const mapStateToProps = ({ default: states }) => {
    return {
        user: states.user,
        tutors: states.tutors,
        colleges: states.colleges
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel);