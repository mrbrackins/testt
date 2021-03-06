import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  Subtitle,
  Caption,
  View,
  Image,
  Row,
  Divider,
} from '@shoutem/ui';
import { ArticleView } from './ArticleView';

/**
 * A component used to render a single list article item
 */
export class ListArticleView extends ArticleView {
  static propTypes = {
    onPress: PropTypes.func,
    articleId: PropTypes.string,
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    date: PropTypes.string,
  };

  render() {
    const { title, imageUrl, date } = this.props;

    const momentDate = moment.utc(date);
    const dateInfo = moment.utc(momentDate).isAfter(0) ? (
      <Caption>{moment.utc(momentDate).fromNow()}</Caption>
    ) : null;

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Divider styleName="line" />
        <Row>
          <Image
            styleName="small rounded-corners placeholder"
            source={{ uri: imageUrl }}
          />
          <View styleName="vertical stretch space-between">
            <Subtitle numberOfLines={2}>{title}</Subtitle>
            {dateInfo}
          </View>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}
