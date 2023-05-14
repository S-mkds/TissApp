import React, { useState, useEffect } from 'react';
import { Image, View, TouchableOpacity, Text, StyleSheet, Modal, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseUrl from '../services/BaseUrl';
import jwt_decode from 'jwt-decode';
const API_URL = BaseUrl;

export default function ChatInstantComponent({ recipientId }) {
    console.log("recuperation de l'id du recipiant", recipientId);
    const [image, setImage] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    const [modalVisible, setModalVisible] = useState(false);

    // Check textError
    const [postImageError, setPostImageError] = useState('');
    const [postMessageSuccess, setPostMessageSuccess] = useState('');
    const [postMessageError, setPostMessageError] = useState('');

    const [isSending, setIsSending] = useState(false);
    const [messageQueue, setMessageQueue] = useState([]);


    // Demande les permissions pour accéder à la caméra et à la galerie
    const getPermissionsAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
        if (status !== 'granted') {
            alert('Vous devez autoriser l\'accès à la caméra et à la galerie pour utiliser cette fonctionnalité.');
        }
    };
    // console.log(props);
    const addPicture = async () => {
        let image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });
        if (!image.canceled) {
            setImage(image.assets[0].uri);
            setModalVisible(false)
        }
    };
    const takePicture = async () => {
        await getPermissionsAsync();
        let image = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });
        if (!image.canceled) {
            setImage(image.assets[0].uri);
            setModalVisible(false)
        }
    };

    const removePicture = () => {
        setImage(null);
    };

    async function handleMessage() {
        const token = await AsyncStorage.getItem('token');
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        console.log("recuperation de l'id du currentUser dans la requete", userId);
        console.log("recuperation de l'id du recipient dans la requete", recipientId); // Ajout de cette ligne pour afficher la valeur de recipientId      
        if (isSending) {
            setMessageQueue([...messageQueue, newMessage]);
            return;
        }
        if (newMessage === '') {
            setPostMessageError("Vous ne pouvez pas envoyer un message vide !");
        } else {
            try {
                setIsSending(true);
                const token = await AsyncStorage.getItem('token');
                const postMessage = new FormData();
                if (image) {
                    postMessage.append('upload', {
                        uri: image,
                        type: 'image/jpeg',
                        name: 'image.jpg',
                    }, 'upload');
                }

                const postData = {
                    content: newMessage,
                    userId: userId,
                    recipientId: recipientId,
                };
                if (image) {
                    postData.imageUrl = `${Date.now()}_${image.split('/').pop()}`;
                    postMessage.append('post', JSON.stringify(postData));
                } else {
                    postMessage.append('content', newMessage);
                }
                // console.log(postData);

                const response = await axios.post(`${API_URL}/api/instantPosts/`, postMessage, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                      Authorization: `Bearer ${token}`,
                    },
                    params: {
                        recipientId: recipientId, // Utilisez le même nom de paramètre ici
                    },
                  });

                if (response.status === 201) {
                    setNewMessage('');
                    setPostMessageSuccess("Message envoyé avec succès");
                    removePicture();
                } else {
                    console.log("error posting message");
                    setPostMessageError("Erreur lors de l'envoi du message");
                }
            } catch (error) {
                console.log(error);
                setPostMessageError("Erreur network lors de l'envoi du message");
            } finally {
                setIsSending(false);
                if (messageQueue.length > 0) {
                    const nextMessage = messageQueue.shift();
                    handleMessage(nextMessage);
                }
            }
        }
    }

    useEffect(() => {
        if (postImageError !== '' || postMessageSuccess !== '' || postMessageError != '') {
            setTimeout(() => {
                setPostImageError('');
                setPostMessageSuccess('');
                setPostMessageError('');
            }, 2000);
        }
    }, [postImageError, postMessageSuccess, postMessageError]);

    return (
        <View style={PostStyle.postContainer}>
            <View>
                {/* Input & Button views */}
                {postMessageError !== '' && <Text style={PostStyle.errorText}>{postMessageError}</Text>}
                {postMessageSuccess !== '' && <Text style={PostStyle.SucessText}>{postMessageSuccess}</Text>}
            </View>
            {/* BTN UPLOAD IMAGE */}
            <View style={PostStyle.inputContainer}>
                {!image ? (
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={PostStyle.selectImageButton}>
                        <Ionicons name="add-outline" size={24} color="white" />
                    </TouchableOpacity>
                ) : null}
                {image ? (
                    <TouchableOpacity onPress={removePicture} style={PostStyle.selectImageButton} >
                        <Text style={PostStyle.closeBtnImg}>❌</Text>
                        <Image style={PostStyle.imageSet} source={image ? { uri: image, } : null} />
                    </TouchableOpacity>
                ) : null}
                < TextInput
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Entrez votre message..."
                    placeholderTextColor={'white'}
                    style={PostStyle.input}
                />
                <TouchableOpacity onPress={handleMessage} disabled={isSending} style={PostStyle.sendButton}>
                    <Ionicons style={PostStyle.sharpIcon} name="send-sharp" size={20} color="#FF6B6B" />
                </TouchableOpacity>
                {isSending && <Text style={modalStyles.sendWaitsText}>Envoi en cours...</Text>}
            </View>

            {/* MODAL */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} style={modalStyles.Modal} >
                <View style={modalStyles.ModalContainer}>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={modalStyles.closeBtn}>
                        <Text style={modalStyles.closeBtnModal}>❌</Text>
                    </TouchableOpacity>
                    <View style={modalStyles.modalContent}>
                        {/* IMMAGE USER */}
                        <Image style={{ width: 120, height: 120, borderRadius: 15, }} source={image ? { uri: image, } : require('../assets/Add_Image_icon.png')} />
                        {/* BTN MODAL */}
                        <TouchableOpacity onPress={addPicture} style={modalStyles.modalBtn}>
                            <Text style={modalStyles.modalBtnText}>Choisir une image</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={takePicture} style={modalStyles.modalBtn}>
                            <Text style={modalStyles.modalBtnText}>Prendre une photo</Text>
                        </TouchableOpacity>
                        {postImageError !== '' && <Text style={modalStyles.errorText}>{postImageError}</Text>}
                        {isSending && <Text style={modalStyles.sendWaitsText}>Veuillez patientez...</Text>}
                    </View>
                </View>
            </Modal>
        </View >
    );
}


const PostStyle = StyleSheet.create({
    postContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageSet: {
        width: 50,
        height: 50,
        borderRadius: 15,
    },

    selectImageButton: {
        padding: 2,
        margin: 5,
        borderRadius: 8,
        marginLeft: 10,
    },

    // Input 
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        bottom: 5,
        width: '100%',
        justifyContent: 'space-between',
    },

    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#152033',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        opacity: 0.7,
        color: 'white',
    },
    // Button
    sendButton: {
        padding: 5,
        borderRadius: 8,
    },
    errorText: {
        color: 'red',
        alignSelf: 'center',
        fontSize: 10,
    },
    textAddImg: {
        color: 'white',
        alignSelf: 'center',
        fontSize: 10,
    },
    SucessText: {
        color: 'green',
        alignSelf: 'center',
        fontSize: 10,
    },
    closeBtnImg: {
        alignSelf: 'flex-end',
        fontSize: 8,
        zIndex: 1,
    }
})
const modalStyles = StyleSheet.create({
    Modal: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 10,
        width: '50%',
        height: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        opacity:0.9
    },
    ModalContainer: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1,
        color: 'black',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    closeBtn: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 5,
        zIndex: 1,
        alignSelf: 'flex-end',
    },
    closeBtnModal: {
        fontSize: 20,
        color: 'white',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        height: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    modalBtn: {
        backgroundColor: '#152033',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    modalBtnText: {
        color: 'white',
        fontSize: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 10,
        fontWeight: 'bold',
    },
    sendWaitsText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },

    successText: {
        color: 'green',
        fontSize: 10,
        fontWeight: 'bold',
    },
})