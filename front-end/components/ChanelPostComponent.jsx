import React, { useState, useEffect } from 'react';
import { Image, View, TouchableOpacity, Text, StyleSheet, Modal, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseUrl from '../services/BaseUrl';
import { set } from 'date-fns';
const API_URL = BaseUrl

export default function ChanelPostComponent() {
    const [modalVisible, setModalVisible] = useState(false);
    const [postImageChanel, setPostImageChanel] = useState('');
    const [postImageTitle, setPostImageTitle] = useState('');
    const [postImageDescription, setPostImageDescription] = useState('');


    // Check textError
    const [postImageChanelError, setImageError] = useState('');
    const [postImageChanelSuccess, setChanelImgSuccess] = useState('');

    // Demande les permissions pour accéder à la caméra et à la galerie
    const getPermissionsAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
        if (status !== 'granted') {
            alert('Vous devez autoriser l\'accès à la caméra et à la galerie pour utiliser cette fonctionnalité.');
            Linking.openSettings();
        }
    };
    // console.log(props);
    const addPicture = async () => {
        let image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!image.canceled) {
            setPostImageChanel(image.assets[0].uri);
        }
    };
    const takePicture = async () => {
        await getPermissionsAsync();
        let image = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!image.canceled) {
            setPostImageChanel(image.assets[0].uri);
        }
    };

    // Supprimer l'image
    const handleDeleteImage = () => {
        setPostImageChanel('');
    };

    // Requete pour savegarder l'image d'un utilisateur et l'enregistrer en bdd
    async function postChanel() {
        if(postImageTitle === '' ) {
            console.log('Veuillez remplir le champs titre')
           setTimeout(() => {
            setImageError(' Veuillez remplir le champs titre');
              }, 6000);
              setImageError('');
              return;
        }
        if(postImageChanel === '' ) {
            console.log('Veuillez remplir le champs image')
                }
          try {
            const token = await AsyncStorage.getItem('token');
            //Retrieve the userId with the token
            const decodedToken = jwt_decode(token);
            userId = decodedToken.userId;
            console.log(userId);
            const postServeurChanel = new FormData();
            if(postImageChanel){
                postServeurChanel.append('upload', {
                    uri: postImageChanel,
                    type: 'image/jpeg',
                    name: 'image.jpg',
                }, 'upload');
            }
            const postData = {
                title: postImageTitle,
                content: postImageDescription,
                userId: userId,
                imageUrl: "",
            };

            if (postImageChanel) {
                postData.imageUrl = `${Date.now()}_${postImageChanel.split('/').pop()}`;
                postServeurChanel.append('post', JSON.stringify(postData));
              }
                else {
                postServeurChanel.append('post', JSON.stringify(postData));
                }
            if(postData.imageUrl === '') {
                postData.imageUrl = ''
                postServeurChanel.append('post', JSON.stringify(postData));
            }
              if(postImageDescription === ''){
                postData.content = 'Pas de description';
                }

            console.log(postData);
            const response = await axios.post(`${API_URL}/api/chanel/create-chanel`, postServeurChanel, {
                headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
              },
            });
            if (response.status === 201) {
                // console.log('Chanel créé avec succès !');
            setChanelImgSuccess('Chanel créé avec succès !');
            setTimeout(() => {
                setModalVisible(false);
            }, 4000);
            } else {
            setImageError("Erreur lors de l'envoi du message", response.status);
              console.log('Erreur lors de la création du chanel');
              setImageError("Erreur lors de l'envoi du message");
            }
          } catch (error) {
            setImageError("Erreur réseau lors de l'envoi du message, Status: " + error.response.status +" " +JSON.stringify(error.response.data));
            console.log('Catch ERROR lors de la création du chanel Status: ' + error.response.status +" " +JSON.stringify(error.response.data));
          }
          finally {
            // Remise à zéro du message d'erreur
          }
      }
      useEffect(() => {
        if (setChanelImgSuccess !== '' || setImageError != '') {
            setTimeout(() => {
                setChanelImgSuccess('');
                setImageError('');
            }, 8000);
        }
    }, [setChanelImgSuccess, setImageError, postImageChanelError, postImageChanelSuccess]);



    return (
        
        <View style={imageUploaderStyles.imageContainer}>
            {/* IMAGE CHANEL */}
            <View>
                {/* BTN UPLOAD IMAGE */}
                <TouchableOpacity onPress={() => setModalVisible(true)} style={imageUploaderStyles.UploadAvatar}>
                    <AntDesign name="pluscircleo" size={30} color="green" style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
            </View>

            {/* MODAL */}
            <Modal animationType="fade"  transparent={true} visible={modalVisible} style={modalStyles.Modal}>
                <View style={modalStyles.ModalContainer}>
                    <View style={modalStyles.modalContent}>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={modalStyles.closeBtn}>
                        {/* <Text style={modalStyles.closeBtnModal}>❌</Text> */}
                        <AntDesign name="close" size={30} color="red" style={{ width: 30, height: 24 }} />
                    </TouchableOpacity>
                        {/* IMMAGE USER */}
                        <Image
                            style={postImageChanel ? modalStyles.imageSelect : [modalStyles.imageSelect, { width: 100, height: 100 }]}
                            source={postImageChanel ? { uri: postImageChanel } : require('../assets/Add_Image_icon.png')}
                        />
                        {/* BTN MODAL */}
                        {/* icone X qui supprime si il y a une postImageChanel */}
                        {/* icone X qui supprime si il y a une postImageChanel */}
                        {postImageChanel && (
                            <TouchableOpacity onPress={handleDeleteImage} style={modalStyles.modalBtn}>
                            <Text style={modalStyles.modalBtnText}>Supprimer l'image</Text>
                            </TouchableOpacity>
                        )}
                        {/* icone + qui permet d'ajouter une image */}
                        <View style={modalStyles.viewBtn}> 
                        <TouchableOpacity onPress={addPicture} style={modalStyles.modalBtn}>
                            <AntDesign name="picture" size={50} color="black" style={{ width: 50, height: 50 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={takePicture} style={modalStyles.modalBtn}>
                            <AntDesign name="camera" size={50} color="black" style={{ width: 50, height: 50 }} />
                        </TouchableOpacity>
                        </View>
                        {/* INPUTS */}
                        < TextInput
                            value={postImageTitle}
                            onChangeText={setPostImageTitle}
                            placeholder="Entrez le nom de votre serveur ici"
                            placeholderTextColor={'white'}
                            style={modalStyles.input}
                        />
                        < TextInput
                            value={postImageDescription}
                            onChangeText={setPostImageDescription}
                            placeholder="Entrez le nom de votre description ici"
                            placeholderTextColor={'white'}
                            style={modalStyles.input}
                            {...(postImageDescription.length > 100 && { maxLength: 100 }) 
                            // si la longueur de la description est supérieur à 100, on ne peut plus écrire
                            }
                            // si la valeur est vide alors postImageDescription = 'Pas de description'
                            {...(postImageDescription === '' && { postImageDescription: 'Pas de description' })
                            }
                        />
                        {/* BTN SAVE */}
                        <TouchableOpacity onPress={() => postChanel()} style={modalStyles.modalBtnSave}>
                            <Text style={modalStyles.modalBtnTextSave}>Enregistrer votre chanel</Text>
                        </TouchableOpacity>
                        {postImageChanelError !== '' && <Text style={modalStyles.errorText}>{postImageChanelError}</Text>}
                        {postImageChanelSuccess !== '' && <Text style={modalStyles.successText}>{postImageChanelSuccess}</Text>}
                    </View>
                </View>
            </Modal>
  </View >
    );
}
const imageUploaderStyles = StyleSheet.create({
    imageContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 50,}

})
const modalStyles = StyleSheet.create({
    ModalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    viewBtn: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    input: {
        margin: 2,
        borderWidth: 1,
        padding: 5,
        borderRadius: 5,
        fontSize: 12,
        backgroundColor: 'gray',
        color: 'white',
        width: '100%',
        textAlign: 'center',
        marginBottom: 10,
    },
    closeBtn: {
        padding: 2,
        borderRadius: 5,
        zIndex: 1,
        alignSelf: 'flex-end',
    },
    closeBtnModal: {
        fontSize: 20,
    },
    imageSelect: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 1,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 10,
        width: '85%',
    },
    modalBtn: {
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    modalBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
        padding: 4,
        backgroundColor: 'red',
        borderRadius: 5,
    },
    modalBtnSave: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    modalBtnTextSave: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    errorText: {
        color: 'red',
        fontSize: 10,
        fontWeight: 'bold',
    },
    successText: {
        color: 'green',
        fontSize: 10,
        fontWeight: 'bold',
    },
})