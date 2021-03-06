import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getFormatDuration } from '../../services/duration';

const getPreviewImage = item =>
  _.get(item, 'thumbnails.medium.url') || _.get(item, 'thumbnails.default.url');

export default function FeedPreviewTableItem({ item }) {
  return (
    <tr className="feed-preview-table-item">
      <td className="feed-preview-table-item__title-overflow">
        <img
          className="feed-preview-table-item__img"
          src={getPreviewImage(item)}
        />
        {item.title}
      </td>
      <td className="feed-preview-table__duration">
        {getFormatDuration(item.duration)}
      </td>
    </tr>
  );
}

FeedPreviewTableItem.propTypes = {
  item: PropTypes.object,
};
