import React from 'react';
import { connect } from 'react-redux';
import { connectStyle } from '@shoutem/theme';
import {
  FavoritesList,
  mapStateToProps,
  mapDispatchToProps,
} from '../screens/FavoritesList';
import { PlaceIconView } from '../components';
import { ext } from '../const';

class FavoritesListWithIcons extends FavoritesList {
  static propTypes = {
    ...FavoritesList.propTypes,
  };

  renderFavorite(place) {
    return <PlaceIconView place={place} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('FavoritesListWithIcons'))(FavoritesListWithIcons));
