import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'shoutem.i18n';
import {
  Caption,
  ImageBackground,
  Subtitle,
  Tile,
  TouchableOpacity,
} from '@shoutem/ui';
import { ext } from '../const';

/**
 * A component used to render the next article info on
 * the article details screen.
 */
export const NextArticle = ({ title, imageUrl, openArticle }) => {
  return (
    <TouchableOpacity onPress={openArticle}>
      <ImageBackground
        styleName="large-ultra-wide placeholder"
        source={{ uri: imageUrl }}
      >
        <Tile styleName="fill-parent md-gutter space-between">
          <Caption styleName="bold h-left">{I18n.t(ext('upNext'))}</Caption>
          <Subtitle styleName="h-left" numberOfLines={2}>
            {title}
          </Subtitle>
        </Tile>
      </ImageBackground>
    </TouchableOpacity>
  );
};

NextArticle.propTypes = {
  title: PropTypes.string,
  imageUrl: PropTypes.string,
  openArticle: PropTypes.func.isRequired,
};
