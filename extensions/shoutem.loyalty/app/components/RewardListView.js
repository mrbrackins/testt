import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  TouchableOpacity,
  Image,
  Divider,
  Row,
  Subtitle,
  View,
} from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';
import { rewardShape } from './shapes';

const { func } = PropTypes;

/**
 * Renders a single reward, in a list of rewards for places.
 */
export class RewardListView extends PureComponent {
  static propTypes = {
    // The reward
    reward: rewardShape.isRequired,
    // Called when reward is pressed
    onPress: func,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
  }

  onPress() {
    this.props.onPress(this.props.reward);
  }

  render() {
    const { reward } = this.props;
    const { id, image, pointsRequired, title } = reward;

    return (
      <TouchableOpacity key={id} onPress={this.onPress}>
        <Row>
          <Image
            styleName="small placeholder"
            source={{ uri: image ? image.url : '' }}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle>{title}</Subtitle>
            <Subtitle>
              {I18n.t(ext('pointsRequiredRewards'), {
                count: pointsRequired || 0,
              })}
            </Subtitle>
          </View>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}

export default connectStyle(ext('RewardListView'))(RewardListView);
