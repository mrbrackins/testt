import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connectStyle } from '@shoutem/theme';
import {
  Divider,
  ImageBackground,
  Tile,
  Title,
  TouchableOpacity,
  View,
  Text,
} from '@shoutem/ui';
import { Favorite } from 'shoutem.favorites';
import { getFirstImage } from '../services/places';
import withOpenPlaceDetails from '../shared/withOpenPlaceDetails';
import { ext } from '../const';

export function PlaceFullGridRowView({ place, onPress, style, numberOfLines }) {
  const address = _.get(place, 'location.formattedAddress', '');
  const leadImage = getFirstImage(place);
  const imageSource = leadImage ? { uri: leadImage.url } : undefined;

  return (
    <TouchableOpacity
      onPress={onPress}
      styleName="flexible"
      style={style.container}
    >
      <ImageBackground style={style.imageContainer} source={imageSource}>
        <Tile>
          <View styleName="actions" virtual>
            <Favorite item={place} schema={ext('places')} />
          </View>
        </Tile>
      </ImageBackground>
      <View style={style.textContainer}>
        <Title numberOfLines={1} style={style.title}>
          {place.name}
        </Title>
        <Text numberOfLines={numberOfLines} style={style.description}>
          {address}
        </Text>
      </View>
      <Divider styleName="line" />
    </TouchableOpacity>
  );
}

PlaceFullGridRowView.propTypes = {
  place: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired,
  numberOfLines: PropTypes.number,
};

PlaceFullGridRowView.defaultProps = {
  numberOfLines: 2,
};

export default withOpenPlaceDetails(
  connectStyle(ext('PlaceFullGridRowView'))(PlaceFullGridRowView),
);
