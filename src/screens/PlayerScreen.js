import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const PlayerScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Player</Text>
    </View>
  );
};

export default PlayerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
