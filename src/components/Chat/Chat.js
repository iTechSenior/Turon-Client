import React from 'react';
import Rooms from './Rooms';
import Message from './Message';
import Input from './Input';

import history from '../../services/history';

import _ from 'lodash';

import './Chat.scss';
import { actionLogOut } from '../../reducers/actions';
import { connect } from 'react-redux';

import { Subject } from 'rxjs';

import $ from 'jquery';

import { Link } from 'react-router-dom';

class Chat extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            isRegisterInProcess: false,
            chatrooms: null,
            activeRoom: null,
            messages: [],
        };

        this.activeRoomSubject = new Subject();
        this.readMessagesSubject = new Subject();

        this.onGetChatRooms = this.onGetChatRooms.bind(this);

        if(!this.props.client){
            return history.push('/');
        }

        this.registerOnMessage();

        this.props.client.emitRegister(
            { userid: this.props.user.id },
            this.onGetChatRooms
        );

        this.readMessagesSubject.asObservable().subscribe(roomid => {
            if (roomid) {
                this.props.client.emitReadMessages(
                    {
                        roomid,
                        userid: this.props.user.id,
                        isTutor: !!this.props.user.tutor,
                    },
                    err => {
                        this.props.client.emitGetRooms(
                            { userid: this.props.user.id },
                            (err, chatrooms) => {
                                this.onGetChatRooms(err, chatrooms, false);
                            }
                        );
                    }
                );
            }
        });

        this.activeRoomSubject.asObservable().subscribe(room => {
            if (room && room.id) {
                this.setState({
                    activeRoom: room.id,
                    messages: null,
                });

                this.props.client.emitGetMessages(
                    { roomid: room.id },
                    (err, messages) => {
                        this._updateMessages(messages);
                        this.readMessagesSubject.next(room.id);
                    }
                );
            }
        });
    }

    componentDidMount() {
        if (this.props.location.state && this.props.location.state.tutorid) {
            this.startRoom(
                this.props.location.state.tutorid,
                this.props.location.state.message
            );

            history.replace({
                pathname: '/chat',
                state: {},
            });

            if(this.props.location.state.bookNow){
                this.setState({
                    bookLoading: true
                })

                setTimeout(() => {
                    this.setState({
                        bookLoading: false
                    })

                    if(this.state.activeRoom){
                        const activeRoom = _.find(this.state.chatrooms, {id: this.state.activeRoom});

                        history.push({
                            pathname: 'sessions/new',
                            state: {
                                tutor: activeRoom.teacher,
                                roomid: this.state.activeRoom
                            }
                        })
                    }
                }, 2000);
            }
        }
    }

    startRoom(tutorid, message) {
        const userid = this.props.user.id;

        this.props.client.emitStarkTalk({ tutorid, userid, message }, () => {
            console.log('Room has been created!');
        });
    }

    onGetChatRooms(err, chatrooms, update = true) {
        this.setState({
            chatrooms,
        });

        if (update) {
            const activeRoom = _.first(chatrooms);

            this.activeRoomSubject.next(activeRoom);
        }
    }

    registerOnMessage() {
        this.props.client.onMessage(v => {
            if (v[0] && v[0].roomid === this.state.activeRoom) {
                this._updateMessages(_.concat(this.state.messages, v));
            } else {
                this.props.client.emitGetRooms(
                    { userid: this.props.user.id },
                    this.onGetChatRooms
                );
            }
        });
    }

    _updateMessages(messages) {
        let j = 0;
        let k = 0;
        for (let i = 0; i < messages.length; i++) {
            // Stack messages
            if (i !== 0) {
                const prev = messages[i - 1];
                const diff = Math.abs(
                    new Date(prev.ts) - new Date(messages[i].ts)
                );

                if (
                    prev.author === messages[i].author &&
                    diff < 1000 * 5 * 10
                ) {
                    j++;
                } else {
                    j = 0;
                    k++;
                }
            }

            messages[i].order = j;
            messages[i].stack = k;
            messages[i].type =
                messages[i].author === this.props.user.id ? 'replies' : 'sent';
        }

        messages = _.map(messages, v => {
            const stack = _.filter(messages, i => i.stack === v.stack);

            v.showTimeStamps = _.last(stack).id === v.id;
            v.showProfile = v.order === 0;

            return v;
        });

        this.setState({
            messages: messages,
        });
    }

    _maybeGetName() {
        if (
            !this.state.chatrooms ||
            !this.state.chatrooms.length ||
            !this.state.activeRoom
        ) {
            return '...';
        }

        const name = _.find(this.state.chatrooms, {
            id: this.state.activeRoom,
        });

        if (this.props.user.id === name.student) {
            return (
                <Link to={`/view-tutor/${name.teacher}`}>
                    {name.teacherName}
                </Link>
            );
        } else {
            return name.studentName;
        }
    }

    _onMessageSend(message) {
        this.props.client.emitMessage(
            {
                message,
                author: this.props.user.id,
                room: this.state.activeRoom,
            },
            v => {
                console.log('sent');
            }
        );
    }

    _maybeGetBookButton(){
        const activeRoom = _.find(this.state.chatrooms, {id: this.state.activeRoom});

        if(activeRoom && activeRoom.student == this.props.user.id){
            return (
                <button onClick={(e) => {
                    e.preventDefault();

                    history.push({
                        pathname: 'sessions/new',
                        state: {
                            tutor: activeRoom.teacher,
                            roomid: this.state.activeRoom
                        }
                    })
                }} className="btn btn-outline-secondary btn-sm">Book now</button>
            )
        }
        return;
    }
        
    render(){
        setTimeout(() => {
            if (document.querySelector('.messages ul li:last-child')) {
                $(this._messages).animate(
                    {
                        scrollTop:
                            document.querySelector('.messages ul li:last-child')
                                .offsetTop + 100,
                    },
                    'fast'
                );
            }
        }, 4);

        if(!this.props.user){
            return (
                <div className="text-center p-5">
                    <i className="fas fa-spinner fa-spin fa-2x" />
                </div>
            )
        }

        return (
            <div id="frame">
                {
                    this.state.bookLoading && (
                        <div className="text-center d-flex justify-content-center align-items-center" style={{zIndex: 999999, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.25)'}}>
                            <i className="fas fa-spinner fa-spin text-white fa-4x" />
                        </div>
                    )
                }
                <div id="sidepanel">
                    <div id="profile" className="d-none d-sm-block">
                        <h1 className="h3 text-centerx">Messages</h1>
                    </div>
                    <Rooms
                        onTabClick={roomid => {
                            const room = _.find(this.state.chatrooms, {
                                id: roomid,
                            });

                            this.activeRoomSubject.next(room);
                        }}
                        user={this.props.user.id}
                        activeRoom={this.state.activeRoom || 0}
                        rooms={this.state.chatrooms || []}
                    />
                </div>
                <div className="content">
                    <div className="contact-profile">
                        <p>{this._maybeGetName()}</p>
                        <div>{this._maybeGetBookButton()}</div>
                    </div>
                    <div
                        className="messages pb-4"
                        ref={ref => (this._messages = ref)}
                    >
                        <ul>
                            {this.state.messages ? (
                                this.state.messages.map(v => (
                                    <Message message={v} />
                                ))
                            ) : (
                                <div className="text-center py-5">
                                    <i className="fas fa-spinner fa-spin fa-2x" />
                                </div>
                            )}
                        </ul>
                    </div>
                    {<Input onMessageSend={this._onMessageSend.bind(this)} />}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({default: state}) => {
    if(!state.user){
        history.push('/');
        return {};
    }

    return {
        user : state.user,
        client: state.socket
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actionLogOut()),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chat);
