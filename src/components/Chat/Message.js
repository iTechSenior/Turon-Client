import React from 'react';
import Moment from 'react-moment';

import _ from 'lodash';

export default class Message extends React.Component {
    render() {
        const { message } = this.props;

        message.message = _.map(_.split(message.message, ' '), (v) => {
            if(_.startsWith(v, 'http://') || _.startsWith(v, 'https://')){
                return `<a target="_blank" href="${v}">${v}</a>`;
            }

            return v;
        }).join(' ');

        if(message.isSystem){
            return (
                <li className="text-center text-muted">
                    <div className="alert alert-warning mx-auto" style={{maxWidth: '60%'}}  dangerouslySetInnerHTML={{__html: message.message}}></div>
                </li>
            )
        }

        return (
            <li className={message.type}>
                {message.showProfile && (
                    <div
                        className={`img-letters ${
                            message.type === 'sent'
                                ? 'float-left mr-2'
                                : 'float-right ml-2'
                        }`}
                    >
                        {_.first(message.firstName) + _.first(message.lastName)}
                    </div>
                )}
                <p className={message.showProfile ? '' : 'message-margin'} dangerouslySetInnerHTML={{__html: message.message}}></p>
                {message.showTimeStamps && (
                    <small
                        style={{ clear: 'both', marginTop: '2px' }}
                        className={
                            message.type === 'sent'
                                ? 'd-block ml-5'
                                : 'float-right mr-5'
                        }
                    >
                        <Moment fromNow ago>
                            {message.ts}
                        </Moment>{' '}
                        ago
                    </small>
                )}
            </li>
        );
    }
}
