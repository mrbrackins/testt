import React from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import { CmsListScreen } from 'shoutem.cms';
import { getRouteParams, push } from 'shoutem.navigation';
import { FeaturedArticleView } from '../components/FeaturedArticleView';
import {
  createListItem,
  getItemProps,
} from '../components/ListItemViewFactory';
import { ext } from '../const';

export class ArticlesScreen extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.state = {
      ...this.state,
      schema: ext('articles'),
    };
  }

  getNavBarProps() {
    const { screenSettings } = getRouteParams(this.props);
    const styleName = screenSettings.hasFeaturedItem ? 'featured' : '';

    return { ...super.getNavBarProps(), styleName };
  }

  openArticle(article) {
    const { navigation } = this.props;
    const { shortcut } = getRouteParams(this.props);
    const nextArticle = this.getNextArticle(article);

    push(navigation, ext('ArticleDetailsScreen'), {
      title: article.title,
      article,
      nextArticle,
      openArticle: this.openArticle,
      shortcut,
    });
  }

  openArticleWithId(id) {
    const { data } = this.props;

    const article = _.find(data, { id });

    this.openArticle(article);
  }

  getNextArticle(article) {
    const { data } = this.props;

    const currentArticleIndex = data
      ? _.findIndex(data, { id: article.id })
      : 0;

    return data[currentArticleIndex + 1];
  }

  renderFeaturedItem(item) {
    return item ? (
      <FeaturedArticleView
        {...getItemProps(item)}
        onPress={this.openArticleWithId}
      />
    ) : null;
  }

  renderRow(data) {
    const { screenSettings } = getRouteParams(this.props);

    return createListItem(
      screenSettings.listType,
      data,
      this.openArticleWithId,
    );
  }
}

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  state => state[ext()].latestNews,
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps();

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('ArticlesScreen'))(ArticlesScreen));
