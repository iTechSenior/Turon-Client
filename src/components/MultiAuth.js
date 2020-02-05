import React from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { LinkedIn } from 'react-linkedin-login-oauth2';
import axios from 'axios';

import _ from 'lodash';

export class MultiAuth extends React.Component {
    handleFacebook(data) {
        const { name, id } = data;
        this.props.onSubmit({
            firstName: _.first(_.split(name, ' ')),
            lastName: _.last(_.split(name, ' ')),
            facebook_id: id,
        });
    }

    async handleLinkedIn(data) {
        try {
            if (!data || !data.code) {
                throw Error('Something went wrong.');
            }

            try {
                const baseUrl = process.env.REACT_APP_CONTACTS_API_URL;
                const res = await axios.get(
                    `${baseUrl}/linkedin?code=${data.code}`
                );

                if (!res.data) {
                    throw Error('Something went wrong.');
                }

                let responseData = res.data;
                responseData.linkedin_id = responseData.id;

                delete responseData.id;

                this.props.onSubmit(responseData);
            } catch (e) {
                console.log(e);
            }
        } catch (e) {
            console.log(e);
        }
    }

    handleGoogle(data) {
        if (data.error) {
            console.log(data.error);
            return;
        }

        const user = data.getBasicProfile();

        this.props.onSubmit({
            firstName: user.getGivenName(),
            lastName: user.getFamilyName(),
            email: user.getEmail(),
            google_id: user.getId(),
        });
    }

    render() {
        console.log('link', process.env.REACT_APP_LINKEDIN_CLIENT_ID);
        return (
            <ul>
                <li>
                    <GoogleLogin
                        autoLoad={false}
                        render={renderProps => (
                            <button
                                onClick={renderProps.onClick}
                                className="no-button"
                                style={{ color: '#DC4E41' }}
                            >
                                <img
                                    src={require('./../images/google.png')}
                                    width="48"
                                    height="48"
                                    alt=""
                                />
                            </button>
                        )}
                        clientId="592317649140-f0cgof3pvtnv0rdr527bpef49e3jufj8.apps.googleusercontent.com"
                        onSuccess={this.handleGoogle.bind(this)}
                        onFailure={this.handleGoogle.bind(this)}
                    />
                </li>
                <li>
                    <FacebookLogin
                        appId="336661660301878"
                        autoLoad={false}
                        icon="fa-facebook-square"
                        cssclassName="fa-3x"
                        textButton=""
                        scope="public_profile"
                        buttonStyle={{
                            background: 'none',
                            border: 'none',
                            boxShadow: 'none',
                            outline: 'none',
                            color: '#4267B2',
                            fontSize: '58px',
                            lineHeight: '1',
                        }}
                        callback={this.handleFacebook.bind(this)}
                    />
                </li>
                <li>
                    <LinkedIn
                        clientId={process.env.REACT_APP_LINKEDIN_CLIENT_ID}
                        onFailure={this.handleLinkedIn.bind(this)}
                        onSuccess={this.handleLinkedIn.bind(this)}
                        redirectUri={`${
                            window.location.origin
                        }/linkedin_redirect`}
                        className="no-button btn-linkedin"
                    >
                        <img
                            width="48"
                            height="48"
                            src={require('./../images/linkedin.svg')}
                            alt=""
                        />
                    </LinkedIn>
                </li>
            </ul>
        );
    }
}
