import React, { useState, useEffect } from 'react';
import { Image, View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Camera from 'expo-camera';
// import * as Permissions from 'expo-permissions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseUrl from '../services/BaseUrl';
import jwt_decode from "jwt-decode";

const API_URL = BaseUrl;

export default function UploadImage() {
	const [image, setImage] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [profilImage, setProfilImage] = useState('');

	// Check textError
	const [editImageUserError, setEditImageUserError] = useState('');
	const [editImageUserSuccess, setEditImageUserSuccess] = useState('');

	// Demande les permissions pour accéder à la caméra et à la galerie
	const getPermissionsAsync = async () => {
		const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
		const { status: mediaLibStatus } = await MediaLibrary.requestPermissionsAsync();

		if (cameraStatus !== 'granted' || mediaLibStatus !== 'granted') {
			alert('Vous devez autoriser l\'accès à la caméra et à la galerie pour utiliser cette fonctionnalité.');
		}
	};
	// console.log(props);
	const addPicture = async () => {
		let image = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
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
	const savePicture = async () => {
		try {
			const formData = new FormData();
			formData.append('image', {
				uri: image,
				type: 'image/jpeg',
				name: 'avatar',
			}, 'image');
			const fileName = `${Date.now()}_${image.split('/').pop()}`;
			formData.append('user', JSON.stringify({ imageUrl: fileName }));
			const token = await AsyncStorage.getItem('token');
			const response = await axios.put(`${API_URL}api/auth/edit`, formData, {
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
	};

	// Get user Request
	const getUser = async () => {
		try {
			const token = await AsyncStorage.getItem('token');
			//Retrieve the userId with the token
			const decodedToken = jwt_decode(token);
			// console.log("decode le token ici -", decodedToken)
			const userId = decodedToken.userId;
			let response = await axios.get(`${API_URL}api/users/${userId}`, {
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});
			if (response.status === 200) {
				console.log(response.data);
				setProfilImage(response.data.user.imageUrl);
				console.log(response.data.user.imageUrl);
				console.log('sucess GET REQUEST');
			}
		} catch (error) {
			console.log('catch GET REQUEST');
		}

	};


	useEffect(() => {
		getUser();
	}, [getUser()]);

	return (
		<View >
			<View style={imageUploaderStyles.container}>
				<TouchableOpacity onPress={() => setModalVisible(true)}>
					<Image style={{ width: 100, height: 100, borderRadius: 100, }} source={profilImage ? { uri: profilImage } : require('../assets/avatarplaceholder.png')} />
				</TouchableOpacity>
			</View>
			<View style={imageUploaderStyles.uploadBtnContainer}>
				<TouchableOpacity onPress={() => setModalVisible(true)} style={imageUploaderStyles.uploadBtn} >

					<AntDesign style={imageUploaderStyles.iconplus} name="pluscircle" size={30} color="white" />
				</TouchableOpacity>
			</View>
			{/* MODAL */}
			<Modal animationType="slide" transparent={true} visible={modalVisible} style={modalStyles.Modal} >
				<View style={modalStyles.ModalContainer}>
					<TouchableOpacity onPress={() => setModalVisible(false)} style={modalStyles.closeBtn}>
						<AntDesign style={imageUploaderStyles.iconplus} name="closecircle" size={40} color="gray" />
					</TouchableOpacity>
					<View style={modalStyles.modalContent}>
						{/* IMAGE USER */}
						<TouchableOpacity onPress={addPicture} >
							<Image style={{ width: 100, height: 100, borderRadius: 100, }} source={image ? { uri: image, } : require('../assets/avatarplaceholder.png')} />
						</TouchableOpacity>
						{/* BTN MODAL */}
						<View style={modalStyles.btnPicture}>
							<TouchableOpacity onPress={takePicture} style={modalStyles.btnCamera} >
								<AntDesign style={imageUploaderStyles.iconplus} name="camera" size={30} color="#FF6B6B" />
							</TouchableOpacity>
							<TouchableOpacity onPress={savePicture} style={modalStyles.modalBtnSave}>
								<Text style={modalStyles.modalBtnTextSave}>Enregistrer</Text>
							</TouchableOpacity>
						</View>
						{editImageUserError !== '' && <Text style={modalStyles.errorText}>{editImageUserError}</Text>}
						{editImageUserSuccess !== '' && <Text style={modalStyles.successText}>{editImageUserSuccess}</Text>}
					</View>
				</View>
			</Modal>
		</View>
	);
}
const imageUploaderStyles = StyleSheet.create({
	container: {
		elevation: 2,
		height: 100,
		width: 100,
		backgroundColor: '#152033',
		position: 'relative',
		borderRadius: 999,
		borderWidth: 1,
		borderColor: '#152033',
		overflow: 'hidden',
	},
	uploadBtnContainer: {
		opacity: 0.7,
		position: 'absolute',
		left: 0,
		top: 85,
		backgroundColor: '#ffffff01',
		width: '100%',
		height: '100%',
	},
	uploadBtn: {
		display: 'flex',
		alignItems: "center",
		justifyContent: 'center',
	},
	iconplus: {
		right: 70,
		bottom: 10,
	}

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
	},
	ModalContainer: {
		flex: 1,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 10,
		marginRight: 10,
		position: 'relative',
		opacity: 1,
		color: 'black',
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	btnPicture: {
		width: "100%",
		display: "flex",
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	closeBtn: {
		padding: 10,
		borderRadius: 5,
		zIndex: 1,
		display: 'flex',
		position: 'absolute',
		right: -70,
		top: 170,
	},
	btnCamera: {
		position: 'absolute',
		bottom: 120,
		right: 15,
	},

	modalContent: {
		backgroundColor: 'white',
		padding: 10,
		borderWidth: 1,
		borderColor: 'white',
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
		width: 40,
		height: 40,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	modalBtnText: {
		color: 'white',
		fontSize: 20,
	},
	modalBtnSave: {
		backgroundColor: 'white',
		opacity: 0.8,
		padding: 10,
		borderWidth: 1,
		borderColor: '#FF6B6B',
		borderRadius: 10,
		width: '100%',
		display: 'flex',
		alignItems: 'center',
	},
	modalBtnTextSave: {
		color: 'black',
		fontWeight: 'bold',
		fontSize: 20,
		textTransform: "uppercase",
	},
	errorText: {
		color: 'red',
		fontSize: 10,
		fontWeight: 'bold',
	},
	successText: {
		color: 'green',
		fontSize: 14,
		fontWeight: 'bold',
	},
})