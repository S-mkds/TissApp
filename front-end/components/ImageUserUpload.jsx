import React, { useState, useEffect } from 'react';
import { Image, View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseUrl from '../services/BaseUrl';
const API_URL = BaseUrl

export default function UploadImage() {
    const [image, setImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [takeImage, setTakeImage] = useState('');

    // Check textError
    const [editImageUserError, setEditImageUserError] = useState('');
    const [editImageUserSuccess, setEditImageUserSuccess] = useState('');

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
        }
    };

    // Requete pour savegarder l'image d'un utilisateur et l'enregistrer en bdd
    async function savePicture() {
        try {
            const data = new FormData();
            data.append('upload', {
                uri: image,
                type: 'image/jpeg',
                name: 'image.jpg',
            }, 'upload');
            const fileName = `${Date.now()}_${image.split('/').pop()}`;
            data.append('user', JSON.stringify({ imageUrl: fileName }));
            const token = await AsyncStorage.getItem('token');
            const response = await axios.put(`${API_URL}/api/auth/edit`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log(response.data);
            if (response.status === 200) {
                setEditImageUserSuccess('Votre image a bien été modifiée');
                setTimeout(() => {
                    setEditImageUserSuccess('');
                }, 3000);
            } else {
                setEditImageUserError('Une erreur est survenue, impossible de modifier votre image');
                setTimeout(() => {
                    setEditImageUserError('');
                }, 3000);
            }
        } catch (error) {
            console.log(error);
            setEditImageUserError('Une erreur est survenue, impossible de modifier votre image');
            setTimeout(() => {
                setEditImageUserError('');
            }, 3000);
        }
    }

    // Get user Request
    const getUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            //Retrieve the userId with the token
            const decodedToken = jwt_decode(token);
            const userId = decodedToken.userId;
            // console.log(userId);
            let response = await axios.get(`${API_URL}/api/auth/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                // console.log(response.data);
                setTakeImage(response.data.user.imageUrl);
                // console.log(response.data.user.imageUrl);
                // console.log('sucess GET REQUEST');

            }
        } catch (error) {
            // console.log('catch GET REQUEST');
        }

    };

    useEffect(() => {
        getUser();
    }, [getUser()]);

    return (
        <View style={imageUploaderStyles.imageContainer}>
            {/* IMAGE USER */}
            <View>
                <Image style={{ width: 120, height: 120, borderRadius: 100, }} source={takeImage ? { uri: takeImage, } : require('../assets/DefaultUser.png')} />
                {/* BTN UPLOAD IMAGE */}
                <TouchableOpacity onPress={() => setModalVisible(true)} style={imageUploaderStyles.UploadAvatar}>
                    <AntDesign name="camera" size={30} color="#FF6B6B" style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
            </View>

            {/* MODAL */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} style={modalStyles.Modal} >
                <View style={modalStyles.ModalContainer}>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={modalStyles.closeBtn}>
                        <Text style={modalStyles.closeBtnModal}>❌</Text>
                    </TouchableOpacity>
                    <View style={modalStyles.modalContent}>
                        {/* IMMAGE USER */}
                        <Image style={{ width: 120, height: 120, borderRadius: 100, }} source={image ? { uri: image, } : require('../assets/DefaultUser.png')} />
                        {/* BTN MODAL */}
                        <TouchableOpacity onPress={addPicture} style={modalStyles.modalBtn}>
                            <Text style={modalStyles.modalBtnText}>Choisir une image</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={takePicture} style={modalStyles.modalBtn}>
                            <Text style={modalStyles.modalBtnText}>Prendre une photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={savePicture} style={modalStyles.modalBtnSave}>
                            <Text style={modalStyles.modalBtnTextSave}>Enregistrer votre avatar</Text>
                        </TouchableOpacity>
                        {editImageUserError !== '' && <Text style={modalStyles.errorText}>{editImageUserError}</Text>}
                        {editImageUserSuccess !== '' && <Text style={modalStyles.successText}>{editImageUserSuccess}</Text>}
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
        margin: 30,
    },
    UploadAvatar: {
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
    },

})
const modalStyles = StyleSheet.create({
    Modal: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        height: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
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
    modalBtnSave: {
        backgroundColor: 'green',
        opacity: 0.8,
        padding: 10,
        borderRadius: 5,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    modalBtnTextSave: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
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