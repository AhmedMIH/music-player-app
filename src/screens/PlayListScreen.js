import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const PlayListScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Play List</Text>
    </View>
  );
};

export default PlayListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
