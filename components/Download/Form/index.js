import { PLATFORM, PLATFORMS } from '../constants';
import React, { Component } from 'react';

import { AnalyticsConsumer } from '../../../context';
import Api from '../../../common/api';
import { Email } from './Email';
import { Error } from './Error';
import { PlatformSelect } from './PlatformSelect';
import { mapValueToKey } from '../../../common/utils';

export class Form extends Component {
  state = {
    platform: PLATFORM,
    email: '',
    data: null,
    error: null,
    loading: false,
  };

  handleOnSelect = platform =>
    this.setState({ platform, data: null, error: null });

  handleOnEmail = email => this.setState({ email });

  handleOnSubmit = () => {
    const { platform, email } = this.state;

    this.setState({ loading: true, error: null }, async () => {
      try {
        const data = await Api.sendSignupRequest({ platform, email });

        this.setState({ data, loading: false });
      } catch (error) {
        console.log(error);
        this.setState({ loading: false, error });
      }
    });
  };

  render() {
    const { data, error, loading, platform } = this.state;

    return (
      <div className="Form">
        <form onSubmit={e => e.preventDefault()}>
          <PlatformSelect
            onSelect={this.handleOnSelect}
            initialValue={PLATFORM}
          />
          {!data && (
            <Email
              platform={this.state.platform}
              loading={loading}
              onEmail={this.handleOnEmail}
              onSubmit={this.handleOnSubmit}
            />
          )}
        </form>
        {data && (
          <div>
            <a className="button" href={data.link} download={data.link}>
              Download Nebula for {mapValueToKey(PLATFORMS, platform)}
            </a>
          </div>
        )}
        {error && (
          <>
            <AnalyticsConsumer>
              {track => {
                track.event({
                  ec: 'DOWNLOAD',
                  ea: 'submit_error',
                  el: JSON.stringify(error),
                });
              }}
            </AnalyticsConsumer>
            <Error json={error.json} />
          </>
        )}
        <div className="Disclaimer">
          <a href="/privacy">Privacy Policy</a>
        </div>
      </div>
    );
  }
}
