import React from 'react';

export default class Input extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
        };
    }

    onMessageSend() {
        if (!this.state.message) {
            return;
        }

        this.props.onMessageSend(this.state.message);
        this.setState({
            message: '',
        });
    }

    render() {
        return (
            <div className="message-input">
                <div className="wrap">
                    <input
                        value={this.state.message}
                        onChange={e => {
                            this.setState({ message: e.target.value });
                        }}
                        onKeyPress={e =>
                            e.key === 'Enter' ? this.onMessageSend() : ''
                        }
                        type="text"
                        placeholder="Write your message..."
                    />
                    <button
                        onClick={this.onMessageSend.bind(this)}
                        className="submit"
                    >
                        <i className="fa fa-paper-plane" aria-hidden="true" />
                    </button>
                </div>
            </div>
        );
    }
}
