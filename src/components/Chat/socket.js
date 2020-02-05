const io = require('socket.io-client');

export default class Socket {
    constructor() {
        this.socket = io.connect(process.env.REACT_APP_CONTACTS_API_CHAT_URL);
    }

    onMessage = func => {
        this.socket.on('message', func);
    };

    onChatRooms = func => {
        this.socket.on('chatrooms', func);
    };

    emitStarkTalk = (data = {}, cb) => {
        this.socket.emit('create_room', data, cb);
    };

    emitMessage = (data = {}, cb) => {
        this.socket.emit('message', data, cb);
    };

    emitRegister = (data = {}, cb) => {
        this.socket.emit('register', data, cb);
    };

    emitGetMessages = (data = {}, cb) => {
        this.socket.emit('getMessages', data, cb);
    };

    emitGetRooms = (data = {}, cb) => {
        this.socket.emit('get_rooms', data, cb);
    };

    emitReadMessages = (data = {}, cb) => {
        this.socket.emit('read_messages', data, cb);
    };
}
