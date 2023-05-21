import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { AntDesign } from '@expo/vector-icons';
import { format } from 'date-fns';

const FullScreenImageModal = ({ visible, imageUrl, onClose }) => {
  const handleDownload = async () => {
    const currentDate = format(new Date(), 'yyyyMMddHHmmss');
    const fileUri = FileSystem.documentDirectory + `${currentDate}.jpg`;
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        console.log('Permission refusée pour accéder à la galerie');
        return;
      }

      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
      await MediaLibrary.createAssetAsync(uri);
      console.log('Image enregistrée avec succès');
      Alert.alert('Image enregistrée avec succès');
    } catch (error) {
      console.log('Erreur lors de l\'enregistrement de l\'image :', error);
      Linking.openSettings();
    }
  };

  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.modalContainer}>
        {/* Bouton pour fermer la modal */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <AntDesign name="close" size={30} color="red" />
        </TouchableOpacity>
        {/* Affichage de l'image en plein écran */}
        <Image style={styles.fullScreenImage} source={{ uri: imageUrl }} resizeMode="cover" />
        {/* Bouton de téléchargement */}
        <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
          <AntDesign name="download" size={30} color="green" />
        </TouchableOpacity>
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
  downloadButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 25,
    alignSelf: 'flex-start',
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    marginRight: 20,
    alignSelf: 'flex-end',
  },
  fullScreenImage: {
    width: '95%',
    aspectRatio: 1, // Ratio d'aspect 1:1 pour conserver la proportion de l'image
    borderRadius: 10,
    maxHeight: '100%',
  },
});

export default FullScreenImageModal;
