import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const FullScreenImageModal = ({ visible, imageUrl, onClose }) => {

  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.modalContainer}>
        {/* Bouton pour fermer la modal */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Fermer</Text>
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
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },

  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
});

export default FullScreenImageModal;
