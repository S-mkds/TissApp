import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const FullScreenImageModal = ({ visible, imageUrl, onClose }) => {

  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.modalContainer}>
        {/* Bouton pour fermer la modal */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>❌</Text>
        </TouchableOpacity>
        {/* Affichage de l'image en plein écran */}
        <Image style={styles.fullScreenImage} source={{ uri: imageUrl }} resizeMode="contain" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButton: {
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
    margin: 5,
  },


  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  fullScreenImage: {
    width: '80%',
    height: '60%',
    borderRadius: 10,
  },
});

export default FullScreenImageModal;
