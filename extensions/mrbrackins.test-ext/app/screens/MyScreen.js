import React, {
  Component
} from 'react';

import Svg, {
  Circle,
 
} from 'react-native-svg';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Logo from '../svg/Group.svg';

export default class MyScreen extends Component {
  render() {
    return (
      <View>
        
        <Logo width={120} height={40} />
          </View>
    );
  }
}

