import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actionGetTutors } from '../reducers/actions';
import Profile from './Profile';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import './FindTutor.scss';
import _ from 'lodash';
import LiveSearch from './parts/LiveSearch';
import FilterDialog from './parts/FilterDialog';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
const theme = createMuiTheme({
    palette: {
        secondary: {
            main: '#6a00b1'
        }
    },
});

class FindTutor extends Component {
    state = {
        query: '',
        colleges: [],
        filtersActive: false,
        current: 3,
    }

    componentDidMount() {
        if(this.props.match.params && this.props.match.params.uid){
            this.setState({
                currentCollegeSearch: _.startCase(this.props.match.params.uid)
            })
        }

        this.getTutors();
    }

    onChange = (page) => {
        this.setState({
            current: page,
        })
    }

    getTutors(v, filters = {}) {
        if (typeof v === 'string') {
            this.setState({
                query: v,
            })

            this.props.getTutors({
                query: v,
                schools: this.state.colleges.join(','),
                filters: _.keys(filters).length ? filters : this.state.filters
            })
        } else {
            this.props.getTutors({
                query: this.state.query,
                schools: this.state.colleges.join(','),
                filters: _.keys(filters).length ? filters : this.state.filters
            })
        }
    }

    applyFilters(filters) {
        this.setState({
            filters: filters,
        })

        this.getTutors(null, filters)
    }

    render() {
        let currentCollege = this.state.currentCollegeSearch && this.props.colleges && _.find(this.props.colleges, {college: this.state.currentCollegeSearch});

        if(currentCollege){
            currentCollege = Object.assign({}, currentCollege);

            currentCollege['label'] = currentCollege['college'];
            currentCollege['value'] = currentCollege['collegeid'];

            delete currentCollege.college;
            delete currentCollege.collegeid;
        }

        return (
            <div className="container find-tutor">
                <div className="card shadow">
                    <div className="card-body">
                        {this.props.error && (
                            <div className="alert alert-danger">
                                {this.props.error}
                            </div>
                        )}
                        <h1 className="card-title text-secondary">
                            Tutors at your school
                        </h1>
                        <div className="row find-tutor-form align-items-center">
                            <div className="col-md-4 text-dark">
                                {!!this.props.colleges && (
                                    <LiveSearch
                                        disabled={!!currentCollege}
                                        defaultValue={currentCollege ? [currentCollege] : undefined}
                                        label={'University'}
                                        placeholder={'Type your University'}
                                        isMultiple={!currentCollege}
                                        onChange={v => {
                                            this.setState({
                                                colleges: _.map(v, i => i.value) || [],
                                                currentCollege
                                            })

                                            setTimeout(() => {
                                                this.getTutors()
                                            }, 100)
                                        }}
                                        data={_.map(this.props.colleges, v => {
                                            return {
                                                value: v.collegeid,
                                                label: v.college,
                                            }
                                        })}
                                    />
                                )}
                            </div>
                            <div className="col-md-5">
                                <input
                                    className="form-input"
                                    type="text"
                                    onChange={e => {
                                        e.preventDefault()

                                        this.getTutors(e.target.value)
                                    }}
                                    placeholder="Select your school then type a subject or course"
                                />
                            </div>
                            <div className="col-md-3 align-self-end">
                                <div className="d-flex justify-content-between align-items-end">
                                    <FilterDialog
                                        disabledFilters={{price: !!this.state.currentCollege, resources: !!this.state.currentCollege}}
                                        applyFilters={this.applyFilters.bind(this)}
                                    />
                                    <MuiThemeProvider theme={theme}>
                                        <Button
                                            onClick={e => {
                                                e.preventDefault()
                                                this.getTutors()
                                            }}
                                            className="btn-block"
                                            color="secondary"
                                            variant="contained"
                                        >
                                            Search
                                    </Button>
                                    </MuiThemeProvider>
                                </div>
                            </div>
                        </div>
                        {this.props.tutors ? (
                            this.props.tutors.length ? (
                                this.props.tutors.map((v, i) => (
                                    <Profile
                                        key={i}
                                        {...v}
                                        user={this.props.user}
                                        subjects={_.uniqBy(
                                            v.subjects,
                                            'subject'
                                        )}
                                    />
                                ))
                            ) : (
                                    <div className="text-center p-5 text-dark h5">
                                        Nothing found. Please try again.
                                </div>
                                )
                        ) : (
                                <div />
                            )}

                        {/* <div>
                            <Pagination onChange={this.onChange} defaultPageSize={this.state.pageSize} current={this.state.current} total={this.props.total} />
                        </div> */}
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getTutors: (data, schools) => dispatch(actionGetTutors(data, schools))
    }
}

const mapStateToProps = ({ default: states }) => {
    return {
        user: states.user,
        error: states.error,
        tutors: states.tutors,
        colleges: states.colleges,
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FindTutor)
