import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getExtensionSettings } from 'shoutem.application';
import {
  withIsFocused,
  FocusTriggerBase,
  NavigationStacks,
  navigateTo,
} from 'shoutem.navigation';
import { isAuthenticated } from './redux';
import { ext } from './const';

// function that decorates given Screen with loginRequired property
// Screen decorated with that property should first open LoginScreen if user isn't logged in
export function loginRequired(Screen, value = true) {
  // eslint-disable-next-line no-param-reassign
  Screen.loginRequired = value;
  return Screen;
}

function isShortcutProtected(route) {
  return _.get(route, 'params.shortcut.settings.shoutemAuth.protected', false);
}

// Decorates every screen with the authentiaction check, providing
// login/register redirection for the screens that define that behaviour through
// manual declaration or builder configuration
export function withLoginRequired(WrappedComponent) {
  class AuthComponent extends FocusTriggerBase {
    static propTypes = {
      ...FocusTriggerBase.propTypes,
      route: PropTypes.object,
      allScreensProtected: PropTypes.bool,
      isAuthenticated: PropTypes.bool,
    };

    handleFocus() {
      const { route, isAuthenticated, allScreensProtected } = this.props;

      const screenProtected =
        WrappedComponent.loginRequired !== false &&
        (isShortcutProtected(route) ||
          WrappedComponent.loginRequired ||
          allScreensProtected);

      if (screenProtected && !isAuthenticated) {
        const previousRoute = _.get(route, 'params.previousRoute');

        NavigationStacks.openStack(ext(), {
          onLoginSuccess: () => NavigationStacks.closeStack(ext()),
          onCancel: () =>
            NavigationStacks.closeStack(ext(), () =>
              navigateTo(previousRoute.name, {
                ...previousRoute.params,
              }),
            ),
          canGoBack: !!previousRoute,
        });
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    isAuthenticated: isAuthenticated(state),
    allScreensProtected: _.get(
      getExtensionSettings(state, ext()),
      'allScreensProtected',
      false,
    ),
  });

  const resolvedMapStateToProps = FocusTriggerBase.createMapStateToProps(
    mapStateToProps,
  );

  const ResultComponent = connect(resolvedMapStateToProps)(AuthComponent);

  return withIsFocused(ResultComponent);
}
