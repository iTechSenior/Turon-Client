import React from 'react';
import { connect } from 'react-redux';
import history from './../services/history';
import { update } from '../reducers/actions';
import _ from 'lodash';

import Select from 'react-select';

class PartialUpdate extends React.Component{
    state = {
        userid: '',
        email: '',
        university: '',
        zipcode: ''
    }

    onSubmit(e) {
        e.preventDefault();

        if (
            !this.props.history.location ||
            !this.props.history.location.state
        ) {
            return;
        }

        const { user_id } = this.props.history.location.state;

        if (!user_id) {
            return;
        }

        this.props.update(this.state);
    }

    render(){
        if(this.props.user && this.props.user.university && this.props.user.email && this.props.user.zipcode){
            if(_.startsWith(this.props.location.search, '?after=')){
                history.push(_.replace(this.props.location.search, '?after=', ''));
            }else{
                history.push('/');
            }

            return <div />;
        }

        if (
            !this.props.history.location ||
            !this.props.history.location.state
        ) {
            this.props.history.push('/');
            return <div />;
        }

        const fields = _.filter(_.keys(this.props.user), (v) => !this.props.user[v] && _.indexOf(['university', 'zipcode', 'email'], v) !== -1);

        if (!fields || !fields.length) {
            this.props.history.push('/');
            return <div />;
        }

        return (
            <div className="auth">
                <div className="card shadow">
                    <div className="card-body text-center">
                        <h1
                            className="card-title text-secondary"
                            style={{ marginBottom: '2rem' }}
                        >
                            Finish up
                        </h1>
                        <form onSubmit={this.onSubmit.bind(this)}>
                            {this.props.error && (
                                <div className="alert alert-danger">
                                    {this.props.error}
                                </div>
                            )}

                            {fields.indexOf('email') !== -1 && (
                                <div className="form-group">
                                    <input
                                        type="email"
                                        onChange={e =>
                                            this.setState({
                                                email: e.target.value,
                                            })
                                        }
                                        required
                                        placeholder="Enter Email"
                                        className="form-control"
                                    />
                                </div>
                            )}

                            {fields.indexOf('university') !== -1 && (
                                <div className="form-group">
                                    {!!this.props.colleges && (
                                        <Select
                                            onChange={e => {
                                                this.setState({
                                                    university: e.value,
                                                });
                                            }}
                                            options={_.map(
                                                this.props.colleges,
                                                v => {
                                                    return {
                                                        value: v.collegeid,
                                                        label: v.college,
                                                    };
                                                }
                                            )}
                                            placeholder="Choose your university"
                                        />
                                    )}
                                </div>
                            )}

                            {fields.indexOf('zipcode') !== -1 && (
                                <div className="form-group">
                                    <input
                                        type="text"
                                        onChange={e =>
                                            this.setState({
                                                zipcode: e.target.value,
                                            })
                                        }
                                        required
                                        placeholder="Enter Zip Code"
                                        className="form-control"
                                    />
                                </div>
                            )}

                            <div
                                className="text-center"
                                style={{ marginTop: '2rem' }}
                            >
                                <button
                                    type="submit"
                                    className="btn btn-outline-secondary btn-lg"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({default: state}) => {
    console.log(state);

    return {
        error: state.error,
        user: state.user,
        colleges: state.colleges
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        update: data => dispatch(update(data))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PartialUpdate);
