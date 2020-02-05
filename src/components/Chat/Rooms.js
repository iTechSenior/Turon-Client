import React from 'react';
import Moment from 'react-moment';
import _ from 'lodash';

export default class Rooms extends React.Component {
    render() {
        return (
            <div id="contacts">
                <ul>
                    {this.props.rooms.map(v => (
                        <li
                            class={`contact ${
                                this.props.activeRoom === v.id ? 'active' : ''
                            }`}
                        >
                            <a
                                onClick={e => {
                                    e.preventDefault();

                                    this.props.onTabClick(v.id);
                                }}
                                style={{
                                    color: 'inherit',
                                    display: 'block',
                                }}
                                href="/profile"
                                className="wrap"
                            >
                                <div className="img-letters revert">
                                    {this.props.user === v.student
                                        ? _.upperCase(
                                              _.first(
                                                  _.split(v.teacherName, ' ')[0]
                                              ) +
                                                  _.first(
                                                      _.split(
                                                          v.teacherName,
                                                          ' '
                                                      )[1]
                                                  )
                                          )
                                        : _.upperCase(
                                              _.first(
                                                  _.split(v.studentName, ' ')[0]
                                              ) +
                                                  _.first(
                                                      _.split(
                                                          v.studentName,
                                                          ' '
                                                      )[1]
                                                  )
                                          )}
                                </div>
                                <div className="meta">
                                    <p className="name d-flex justify-content-between">
                                        <div>
                                            {this.props.user === v.student
                                                ? v.teacherName
                                                : v.studentName}
                                            {this.props.activeRoom !== v.id &&
                                                v.message &&
                                                v.message.unread !== 0 && (
                                                    <small
                                                        style={{
                                                            fontSize: '1rem',
                                                        }}
                                                        className="text-warning ml-2 mb-0"
                                                    >
                                                        ({v.message.unread})
                                                    </small>
                                                )}
                                        </div>

                                        <small>
                                            {v.message && (
                                                <Moment fromNow ago>
                                                    {v.message.ts}
                                                </Moment>
                                            )}
                                        </small>
                                    </p>
                                    <p className="preview">
                                        {v.message && v.message.message}
                                    </p>
                                </div>
                            </a>
                        </li>
                    ))}
                    {/*                     
                    <li className="contact active">
                        <div className="wrap">
                            <div className="img-letters revert">MB</div>
                            <div className="meta">
                                <p className="name">Harvey Specter</p>
                                <p className="preview">Wrong. You take the gun, or you pull out a bigger one. Or, you call their bluff. Or, you do any one of a hundred and forty six other things.</p>
                            </div>
                        </div>
                    </li>
                    <li className="contact">
                        <div className="wrap">
                            <div className="img-letters revert">MB</div>                                
                            <div className="meta">
                                <p className="name">Rachel Zane</p>
                                <p className="preview">I was thinking that we could have chicken tonight, sounds good?</p>
                            </div>
                        </div>
                    </li>
                    <li className="contact">
                        <div className="wrap">
                            <div className="img-letters revert">MB</div>
                            <div className="meta">
                                <p className="name">Donna Paulsen</p>
                                <p className="preview">Mike, I know everything! I'm Donna..</p>
                            </div>
                        </div>
                    </li>
                    <li className="contact">
                        <div className="wrap">
                            <span className="contact-status busy"></span>
                            <img src="http://emilcarlsson.se/assets/jessicapearson.png" alt="" />
                            <div className="meta">
                                <p className="name">Jessica Pearson</p>
                                <p className="preview">Have you finished the draft on the Hinsenburg deal?</p>
                            </div>
                        </div>
                    </li>
                    <li className="contact">
                        <div className="wrap">
                            <span className="contact-status"></span>
                            <img src="http://emilcarlsson.se/assets/haroldgunderson.png" alt="" />
                            <div className="meta">
                                <p className="name">Harold Gunderson</p>
                                <p className="preview">Thanks Mike! :)</p>
                            </div>
                        </div>
                    </li>
                    <li className="contact">
                        <div className="wrap">
                            <span className="contact-status"></span>
                            <img src="http://emilcarlsson.se/assets/danielhardman.png" alt="" />
                            <div className="meta">
                                <p className="name">Daniel Hardman</p>
                                <p className="preview">We'll meet again, Mike. Tell Jessica I said 'Hi'.</p>
                            </div>
                        </div>
                    </li>
                    <li className="contact">
                        <div className="wrap">
                            <span className="contact-status busy"></span>
                            <img src="http://emilcarlsson.se/assets/katrinabennett.png" alt="" />
                            <div className="meta">
                                <p className="name">Katrina Bennett</p>
                                <p className="preview">I've sent you the files for the Garrett trial.</p>
                            </div>
                        </div>
                    </li>
                    <li className="contact">
                        <div className="wrap">
                            <span className="contact-status"></span>
                            <img src="http://emilcarlsson.se/assets/charlesforstman.png" alt="" />
                            <div className="meta">
                                <p className="name">Charles Forstman</p>
                                <p className="preview">Mike, this isn't over.</p>
                            </div>
                        </div>
                    </li>
                    <li className="contact">
                        <div className="wrap">
                            <span className="contact-status"></span>
                            <img src="http://emilcarlsson.se/assets/jonathansidwell.png" alt="" />
                            <div className="meta">
                                <p className="name">Jonathan Sidwell</p>
                                <p className="preview"><span>You:</span> That's bullshit. This deal is solid.</p>
                            </div>
                        </div>
                    </li> */}
                </ul>
            </div>
        );
    }
}
