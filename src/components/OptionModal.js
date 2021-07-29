import React from 'react'
import {
  Modal,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native'
import color from '../utility/color'

const OptionModal = ({
  visible,
  onClose,
  currentItem,
  onPlayListPress,
  onPlayPress,
}) => {
  return (
    <>
      <StatusBar hidden />
      <Modal animationType='slide' transparent visible={visible}>
        <View style={styles.modal}>
          <Text numberOfLines={2} style={styles.title}>
            {currentItem.filename}
          </Text>
          <View style={styles.optionContainer}>
            <TouchableWithoutFeedback onPress={onPlayPress}>
              <Text style={styles.option}>play</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={onPlayListPress}>
              <Text style={styles.option}>Add to PlayList</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalBg} />
        </TouchableWithoutFeedback>
      </Modal>
    </>
  )
}

export default OptionModal

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: color.APP_BG,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 100,
  },
  optionContainer: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 0,
    color: color.FONT_MEDIUM,
  },
  option: {
    fontSize: 16,
    fontWeight: 'bold',
    color: color.FONT,
    padding: 10,
    letterSpacing: 1,
  },
  modalBg: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: color.MODAL_BG,
  },
})
