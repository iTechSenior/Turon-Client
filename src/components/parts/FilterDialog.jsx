import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import * as _ from 'lodash';
import * as moment from 'moment';

const theme = createMuiTheme({
    palette: {
        secondary: {
            main: '#6a00b1'
        }
    },
});


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

class FilterDialog extends React.Component {
    state = {
        type: '',
        filtersActive: false,
        schedule: {
            0: { startTime: '09:00', endTime: '23:30' },
            1: { startTime: '09:00', endTime: '23:30' },
            2: { startTime: '09:00', endTime: '23:30' },
            3: { startTime: '09:00', endTime: '23:30' },
            4: { startTime: '09:00', endTime: '23:30' },
            5: { startTime: '09:00', endTime: '23:30' },
            6: { startTime: '09:00', endTime: '23:30' }
        },
        minPrice: 20,
        maxPrice: 50,
        free: false,
        physicalLocation: false
    }

    componentDidMount() {
        if (localStorage.getItem('filters')) {
            const filters = JSON.parse(localStorage.getItem('filters'));

            this.setState(filters);
            this.props.applyFilters(filters);
        }
    }

    handleClose(apply) {
        this.setState({
            filtersActive: false
        })

        if (apply) {
            const filters = {
                type: this.state.type,
                schedule: this.state.schedule,
                free: this.state.free,
                minPrice: this.state.minPrice,
                maxPrice: this.state.maxPrice,
                physicalLocation: this.state.physicalLocation
            };

            localStorage.setItem('filters', JSON.stringify(filters));

            this.props.applyFilters(filters);
        }
    }

    changeSchedule(i, val) {
        let schedule = Object.assign({}, this.state.schedule);

        if (_.isBoolean(val)) {
            schedule[i].unavailable = !val;
        } else {
            schedule[i].startTime = val[0] || schedule[i].startTime;
            schedule[i].endTime = val[1] || schedule[i].endTime;

            if (schedule[i].endTime <= schedule[i].startTime) {
                schedule[i].endTime = moment().set({ h: _.first(_.split(schedule[i].startTime, ':')), m: _.last(_.split(schedule[i].startTime, ':')) }).add(30, 'm').format('HH:mm');
            }
        }

        this.setState({
            schedule: schedule
        })
    }

    render() {
        return (
            <div className="w-100 mr-2">
                <MuiThemeProvider theme={theme}>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();

                            let filters;

                            if (localStorage.getItem('filters')) {
                                filters = JSON.parse(localStorage.getItem('filters'));
                            }

                            this.setState(_.pickBy({
                                filtersActive: true,
                                filters: filters
                            }, _.identity))
                        }}
                        className="btn-block mr-2"
                        color="secondary"
                        variant="outlined"
                    >
                        Filters
                    </Button>
                </MuiThemeProvider>
                <Dialog
                    maxWidth="md"
                    open={this.state.filtersActive}
                    onClose={() => this.handleClose()}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Filters"}</DialogTitle>
                    <DialogContent className="d-flex flex-column">
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Day/Time</FormLabel>
                            <FormGroup aria-label="position" name="position" value={'top'} row>
                                {
                                    _.map(_.keys(this.state.schedule), (v, i) => (
                                        <div key={i} className="d-flex align-items-center flex-column">
                                            <FormControlLabel
                                                value={moment().startOf('week').add(i + 1, 'd').format('dddd')}
                                                control={<Checkbox
                                                    onChange={e => this.changeSchedule(v, e.target.checked)}
                                                    checked={!this.state.schedule[v].unavailable}
                                                    color="primary" />}
                                                label={moment().startOf('week').add(i + 1, 'd').format('dddd')}
                                                labelPlacement="bottom"
                                            />
                                            <FormControl style={{ maxWidth: 80 }}>
                                                <InputLabel htmlFor="from">From</InputLabel>
                                                <Select
                                                    disabled={this.state.schedule[v].unavailable}
                                                    value={this.state.schedule[v].startTime}
                                                    onChange={e => this.changeSchedule(v, [e.target.value])}
                                                    inputProps={{
                                                        name: 'from',
                                                        id: 'from',
                                                    }}
                                                >
                                                    {
                                                        _.map(TIMES, (v, i) => (
                                                            <MenuItem key={i} value={v}>{v}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                            <FormControl style={{ maxWidth: 80, marginTop: '1rem' }}>
                                                <InputLabel htmlFor="to">To</InputLabel>
                                                <Select
                                                    disabled={this.state.schedule[v].unavailable}
                                                    value={this.state.schedule[v].endTime}
                                                    onChange={e => this.changeSchedule(v, [null, e.target.value])}
                                                    inputProps={{
                                                        name: 'to',
                                                        id: 'to',
                                                    }}
                                                >
                                                    {
                                                        _.map(TIMES, (v, i) => (
                                                            <MenuItem key={i} value={v}>{v}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </div>
                                    ))
                                }

                            </FormGroup>
                        </FormControl>
                        <FormControl className="mt-4" component="fieldset">
                            <FormLabel component="legend">Type</FormLabel>
                            <RadioGroup aria-label="type" name="type" value={this.state.type} onChange={(e) => {
                                this.setState({
                                    type: e.target.value
                                })
                            }} row>
                                <FormControlLabel
                                    value="online"
                                    control={<Radio color="primary" />}
                                    label="Online"
                                    labelPlacement="bottom"
                                />
                                <FormControlLabel
                                    value="person"
                                    control={<Radio color="primary" />}
                                    label="In-person"
                                    labelPlacement="bottom"
                                />
                                <FormControlLabel
                                    value=""
                                    control={<Radio color="primary" />}
                                    label="Doesn't matter"
                                    labelPlacement="bottom"
                                />
                            </RadioGroup>
                            <FormControlLabel
                                control={<Checkbox
                                    disabled={this.props.disabledFilters.resources}
                                    onChange={e => {
                                        const objToUpdate = {
                                            physicalLocation: e.target.checked
                                        }

                                        if(e.target.checked){
                                            objToUpdate.free = true;
                                        }

                                        this.setState(objToUpdate)
                                    }}
                                    checked={this.state.physicalLocation}
                                    color="primary" />}
                                label={'Show only School Resources'}
                                labelPlacement="left"
                            />
                        </FormControl>
                        <FormControl className="mt-4" component="fieldset">
                            <FormLabel component="legend">Price</FormLabel>
                            <FormGroup aria-label="position" name="position" value={'top'} row>
                                <FormControlLabel
                                    control={<Checkbox disabled={this.props.disabledFilters.price} checked={this.state.free} onChange={(e) => { this.setState({ free: e.target.checked }) }} color="primary" />}
                                    label="Free"
                                    labelPlacement="bottom"
                                />
                                <TextField
                                    className="mx-2"
                                    type={'number'}
                                    disabled={this.state.free}
                                    onChange={(e) => {
                                        e.preventDefault();

                                        this.setState({
                                            minPrice: e.target.value
                                        })
                                    }}
                                    onBlur={(e) => {
                                        if (this.state.minPrice < 20) {
                                            this.setState({
                                                minPrice: 20
                                            })
                                        }
                                    }}
                                    label="Min price"
                                    value={this.state.minPrice}
                                    margin="normal"
                                />
                                <TextField
                                    type={'number'}
                                    disabled={this.state.free}
                                    onChange={(e) => {
                                        e.preventDefault();

                                        this.setState({
                                            maxPrice: e.target.value
                                        })
                                    }}
                                    onBlur={(e) => {
                                        if (this.state.maxPrice > 50) {
                                            this.setState({
                                                maxPrice: 50
                                            })
                                        }
                                    }}
                                    className="mx-2"
                                    label="Max price"
                                    value={this.state.maxPrice}
                                    margin="normal"
                                />
                            </FormGroup>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleClose()} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.handleClose(true)} color="primary" autoFocus>
                            Apply
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

FilterDialog.defaultProps = {
    disabledFilters: {}
}

export default FilterDialog;
