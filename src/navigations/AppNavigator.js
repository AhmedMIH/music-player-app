import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import LibIcon from 'react-native-vector-icons/MaterialIcons';

import AudioListScreen from '../screens/AudioListScreen';
import PlayerScreen from '../screens/PlayerScreen';
import PlayListScreen from '../screens/PlayListScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="AudioList"
        component={AudioListScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="headset" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Player"
        component={PlayerScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="md-disc" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PlayList"
        component={PlayListScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <LibIcon name="library-music" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
