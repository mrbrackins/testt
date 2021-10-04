import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { Checkbox, FontIcon } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default class WebEdit extends Component {
  constructor(props) {
    super(props);

    this.handleShowNavigationToolbarChange = this.handleShowNavigationToolbarChange.bind(
      this,
    );
    this.handleGeolocationPermissionChange = this.handleGeolocationPermissionChange.bind(
      this,
    );
  }

  handleShowNavigationToolbarChange(event) {
    if (event.target) {
      this.props.onShowNavigationToolbarChange(event.target.checked);
    }
  }

  handleGeolocationPermissionChange(event) {
    if (event.target) {
      this.props.onRequireGeolocationPermissionChange(event.target.checked);
    }
  }

  render() {
    const {
      url,
      showNavigationToolbar,
      requireGeolocationPermission,
      hasWebsiteSettings,
      onRemoveClick,
    } = this.props;

    return (
      <div>
        <form>
          <FormGroup>
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_WEBSITE_URL)}
            </ControlLabel>
            <div className="web-edit__url-container">
              <div className="web-edit__web-img" />
              <div className="text-ellipsis">
                <span className="web-edit__url">{url}</span>
              </div>
              <FontIcon
                className="web-edit__remove"
                name="close"
                size="large"
                onClick={onRemoveClick}
              />
            </div>
            {hasWebsiteSettings && (
              <div>
                <ControlLabel>
                  {i18next.t(LOCALIZATION.FORM_WEBSITE_SETTINGS)}
                </ControlLabel>
                <div>
                  <Checkbox
                    checked={requireGeolocationPermission}
                    onChange={this.handleGeolocationPermissionChange}
                  >
                    {i18next.t(LOCALIZATION.FORM_LOCATION_PERMISSIONS)}
                  </Checkbox>
                </div>
                <div>
                  <Checkbox
                    checked={showNavigationToolbar}
                    onChange={this.handleShowNavigationToolbarChange}
                  >
                    {i18next.t(LOCALIZATION.FORM_NAVIGATION_BAR)}
                  </Checkbox>
                </div>
              </div>
            )}
          </FormGroup>
        </form>
      </div>
    );
  }
}

WebEdit.propTypes = {
  hasWebsiteSettings: PropTypes.bool,
  url: PropTypes.string,
  showNavigationToolbar: PropTypes.bool,
  requireGeolocationPermission: PropTypes.bool,
  onRemoveClick: PropTypes.func,
  onShowNavigationToolbarChange: PropTypes.func,
  onRequireGeolocationPermissionChange: PropTypes.func,
};
