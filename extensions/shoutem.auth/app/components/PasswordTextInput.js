import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { I18n } from 'shoutem.i18n';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, TextInput, View } from '@shoutem/ui';
import { ext } from '../const';

class PasswordTextInput extends PureComponent {
  static propTypes = {
    animate: PropTypes.bool,
    errorMessage: PropTypes.string,
    onChangeText: PropTypes.func,
    password: PropTypes.string,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      password: props.password || '',
      visibility: false,
    };
  }

  handleVisibilityChange() {
    const { visibility } = this.state;
    this.setState({ visibility: !visibility });
  }

  render() {
    const { errorMessage, onChangeText, password, animate } = this.props;
    const { visibility } = this.state;

    return (
      <View>
        <TextInput
          animate={animate}
          autoCapitalize="none"
          autoCorrect={false}
          errorMessage={errorMessage}
          highlightOnFocus
          keyboardAppearance="dark"
          onChangeText={onChangeText}
          placeholder={I18n.t(ext('passwordPlaceholder'))}
          returnKeyType="done"
          secureTextEntry={!visibility}
          value={password}
        />
        <Button
          onPress={this.handleVisibilityChange}
          styleName="clear sm-gutter-horizontal"
        >
          <Icon name={visibility ? 'eye' : 'eye-crossed'} />
        </Button>
      </View>
    );
  }
}

export default connectStyle(ext('PasswordTextInput'))(PasswordTextInput);
