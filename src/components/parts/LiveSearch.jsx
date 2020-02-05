import React from 'react';
import deburr from 'lodash/deburr';
import Downshift from 'downshift';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import _ from 'lodash';

import PropTypes from 'prop-types';
import './LiveSearch.scss';

class LiveSearch extends React.Component {
    state = {
        inputValue: '',
        selectedItem: [],
        selectedItemsId: []
    }

    componentDidMount(){
        if(this.props.defaultValue){
            this.setState({
                selectedItemsId: this.props.defaultValue,
                selectedItem: _.map(this.props.defaultValue, v => v.label)
            }, () => {
                this.props.onChange(_.map(this.state.selectedItem, v => _.find(this.state.selectedItemsId, { label: v })));
            })
        }
    }

    getSuggestions(value, { showEmpty = false } = {}) {
        const inputValue = deburr(value.trim()).toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 && !showEmpty
            ? []
            : this.props.data.filter(suggestion => suggestion.label.slice(0, inputLength).toLowerCase() === inputValue);
    }

    handleKeyDown(event) {
        const { selectedItem, inputValue } = this.state;

        if (selectedItem.length && !inputValue.length && event.key === 'Backspace') {
            const newSelectedItem = Array.prototype.slice.apply(selectedItem, [0, selectedItem.length - 1]);
            this.setState({
                selectedItem: newSelectedItem
            })

            this.props.onChange(_.map(newSelectedItem, v => _.find(this.state.selectedItemsId, { label: v })));
        }
    }

    handleInputChange(event) {
        this.setState({
            inputValue: event.target.value
        })

        this.props.onInputChange(event.target.value);
    }

    handleChange(item) {
        let newSelectedItem = [...this.state.selectedItem];

        const newSelectedItemsId = [...this.state.selectedItemsId, _.find(this.props.data, { label: item })];

        if (newSelectedItem.indexOf(item) === -1) {
            newSelectedItem = [...newSelectedItem, item];
        } else {
            if (!this.props.showClips) {
                newSelectedItem = _.filter(newSelectedItem, i => i !== item);
            }
        }

        this.setState({
            selectedItem: newSelectedItem,
            selectedItemsId: newSelectedItemsId
        })

        if (!!this.props.showClips) {
            this.setState({
                inputValue: ''
            })
        } else {
            this._courses.openMenu();
        }

        this.props.onChange(_.map(newSelectedItem, v => _.find(newSelectedItemsId, { label: v })));
    }

    handleDelete = item => () => {
        const newSelectedItem = [...this.state.selectedItem];
        newSelectedItem.splice(newSelectedItem.indexOf(item), 1);

        this.setState({
            selectedItem: newSelectedItem
        })

        this.props.onChange(_.map(newSelectedItem, v => _.find(this.state.selectedItemsId, { label: v })));
    };

    renderInput(inputProps) {
        const { InputProps, ref, ...other } = inputProps;

        return (
            <TextField
                InputProps={{
                    inputRef: ref,
                    classes: {
                        root: "college-search-inputRoot",
                        input: "college-search-inputInput",
                    },
                    ...InputProps,
                }}
                {...other}
            />
        );
    }

    renderSuggestion(suggestionProps) {
        const { suggestion, index, itemProps, highlightedIndex, selectedItem } = suggestionProps;
        const isHighlighted = highlightedIndex === index;
        const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

        return (
            <MenuItem
                {...itemProps}
                key={suggestion.label}
                selected={isHighlighted}
                component="div"
                style={{
                    fontWeight: isSelected ? 500 : 400,
                }}
            >
                {suggestion.label}
                {
                    !this.props.showClips && (
                        <Checkbox
                            checked={!!isSelected} />
                    )
                }
            </MenuItem>
        );
    }

    render() {
        const { selectedItem, inputValue } = this.state;

        if (this.props.isMultiple) {
            return (
                <div>
                    <Downshift
                        ref={(ref) => this._courses = ref}
                        inputValue={inputValue}
                        onChange={this.handleChange.bind(this)}
                        selectedItem={selectedItem}
                    >
                        {({
                            getInputProps,
                            getItemProps,
                            isOpen,
                            inputValue: inputValue2,
                            selectedItem: selectedItem2,
                            highlightedIndex,
                        }) => (
                                <div className='college-search-container'>
                                    {this.renderInput({
                                        fullWidth: true,
                                        InputProps: getInputProps({
                                            startAdornment: selectedItem.map(item => (
                                                !!this.props.showClips && (
                                                    (
                                                        <Chip
                                                            key={item}
                                                            tabIndex={-1}
                                                            label={item}
                                                            className="college-search-chip"
                                                            onDelete={this.handleDelete(item)}
                                                        />
                                                    )
                                                )
                                            )),
                                            onChange: this.handleInputChange.bind(this),
                                            onKeyDown: this.handleKeyDown.bind(this),
                                            placeholder: this.props.placeholder,
                                        }),
                                        label: this.props.label,
                                    })}

                                    {isOpen ? (
                                        <Paper className="college-search-paper" square>
                                            {this.getSuggestions(inputValue2).map((suggestion, index) =>
                                                this.renderSuggestion({
                                                    suggestion,
                                                    index,
                                                    itemProps: getItemProps({ item: suggestion.label }),
                                                    highlightedIndex,
                                                    selectedItem: selectedItem2,
                                                }),
                                            )}
                                        </Paper>
                                    ) : null}
                                </div>
                            )
                        }}
                    </Downshift>
                </div>
            )
        }

        return (
            <Downshift
                onChange={v => this.props.onChange(_.find(this.props.data, { label: v }))}
                id="downshift-simple">
                {({
                    getInputProps,
                    getItemProps,
                    getMenuProps,
                    highlightedIndex,
                    inputValue,
                    isOpen,
                    selectedItem
                }) => (
                        <div className="college-search-container">
                            <TextField
                                disabled={this.props.disabled}
                                fullWidth={true}
                                label={this.props.label}
                                value={_.first(this.state.selectedItem)}
                            />

                            <div {...getMenuProps()}>
                                {isOpen ? (
                                    <Paper className="college-search-paper" square>
                                        {this.getSuggestions(inputValue).map((suggestion, index) =>
                                            this.renderSuggestion({
                                                suggestion,
                                                index,
                                                itemProps: getItemProps({ item: suggestion.label }),
                                                highlightedIndex,
                                                selectedItem,
                                            }),
                                        )}
                                    </Paper>
                                ) : null}
                            </div>
                        </div>
                    )}
            </Downshift>
        )
    }
}


LiveSearch.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    showClips: PropTypes.bool,
    onChange: PropTypes.func,
    onInputChange: PropTypes.func,
    data: PropTypes.array,
    isMultiple: PropTypes.bool,
    disabled: PropTypes.bool
}

LiveSearch.defaultProps = {
    showClips: true,
    data: [],
    isMultiple: false,
    disabled: false,
    onChange: () => { },
    onInputChange: () => { }
}

export default LiveSearch;