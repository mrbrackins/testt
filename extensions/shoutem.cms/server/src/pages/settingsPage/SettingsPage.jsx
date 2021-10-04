import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { Button, FormGroup, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { getExtensionInstallation } from 'environment';
import {
  getExtensionSettings,
  updateExtensionSettings,
} from '../../builder-sdk';
import LOCALIZATION from './localization';
import './style.scss';

const resolveApiEndpoint = extensionInstallation => {
  if (!extensionInstallation) {
    return null;
  }
  const settings = getExtensionSettings(extensionInstallation);
  return settings.apiEndpoint;
};

export class SettingsPage extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      apiEndpoint: resolveApiEndpoint(props.extensionInstallation),
    };
  }

  updateApiEndpoint(event) {
    event.preventDefault();

    const { extensionInstallation, updateSettings } = this.props;
    const { apiEndpoint } = this.state;
    updateSettings(extensionInstallation, { apiEndpoint });
  }

  handleInputChange(event) {
    const apiEndpoint = event.target.value;
    this.setState({ apiEndpoint });
  }

  render() {
    const { extensionInstallation } = this.props;
    const { apiEndpoint } = this.state;
    const endpointHasChanged =
      apiEndpoint !== resolveApiEndpoint(extensionInstallation);

    return (
      <div className="cms-settings-page">
        <h3>{i18next.t(LOCALIZATION.TITLE)}</h3>
        <form onSubmit={this.updateApiEndpoint}>
          <FormGroup>
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_API_ENDPOINT)}
            </ControlLabel>
            <input
              defaultValue={this.state.apiEndpoint}
              className="form-control"
              type="text"
              autoFocus
              onChange={this.handleInputChange}
            />
          </FormGroup>
          <Button
            disabled={!endpointHasChanged}
            bsStyle="primary"
            onClick={this.updateApiEndpoint}
          >
            {i18next.t(LOCALIZATION.BUTTON_SAVE)}
          </Button>
        </form>
      </div>
    );
  }
}

SettingsPage.propTypes = {
  extensionInstallation: PropTypes.object,
  updateSettings: PropTypes.func,
};

function mapStateToProps() {
  return {
    extensionInstallation: getExtensionInstallation(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSettings: (extension, settings) =>
      dispatch(updateExtensionSettings(extension, settings)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
