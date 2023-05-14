import React, { useState, useEffect } from 'react';
import { Image, View, TouchableOpacity, Text, StyleSheet, Modal, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Camera from 'expo-camera';
// import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import BaseUrl from '../services/BaseUrl';
import { Icon } from 'react-native-elements';
const API_URL = BaseUrl;

export default function ImageUploadMessage() {
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
		if (isSending) {
			setMessageQueue([...messageQueue, newMessage]);
			return;
		}
		if (newMessage === '') {
			// setPostMessageError("Vous ne pouvez pas envoyer un message vide !");
			showMessage({
				message: "Oups!! Vous ne pouvez pas envoyer un message vide.",
				type: 'danger',
				duration: 3000,
				position: 'top',
				floating: true,
				style: { marginTop: 30 },
			});
		} else {
			try {
				setIsSending(true);
				const token = await AsyncStorage.getItem('token');
				const postMessage = new FormData();
				if (image) {
					postMessage.append('image', {
						uri: image,
						type: 'image/jpeg',
						name: 'postimage',
					}, 'image');
				}

				const postData = {
					content: newMessage,
				};
				if (image) {
					postData.imageUrl = `${Date.now()}_${image.split('/').pop()}`;
					postMessage.append('post', JSON.stringify(postData));
				} else {
					postMessage.append('content', newMessage);
				}


				const response = await axios.post(`${API_URL}api/posts`, postMessage, {
					headers: {
						'Content-Type': 'multipart/form-data',
						'Authorization': `Bearer ${token}`,
					},
				});

				if (response.status === 201) {
					setNewMessage('');
					removePicture();
					showMessage({
						message: 'Message envoyé avec succès',
						type: 'success',
						duration: 3000,
						position: 'top', // Position de la notification en haut de l'écran
						floating: true, // Pour permettre la superposition de la notification
						style: { marginTop: 30 }, // Ajustement de la marge supérieure pour descendre la notification
					});
				} else {
					console.log("error posting message");
					setPostMessageError("Erreur lors de l'envoi du message");
					showMessage({
						message: "Erreur lors de l'envoi du message",
						type: 'danger',
						duration: 3000,
						position: 'top',
						floating: true,
						style: { marginTop: 30 },
					});
				}
			} catch (error) {
				console.log(error);
				setPostMessageError("Erreur network lors de l\'envoi du message");
				showMessage({
					message: "Erreur network lors de l'envoi du message",
					type: 'danger',
					duration: 3000,
					position: 'top',
					floating: true,
					style: { marginTop: 30 },
				});
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
						<Ionicons name="add-outline" size={25} color="white" />
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
					placeholder="Message..."
					placeholderTextColor={'white'}
					style={PostStyle.input}
				/>
				<TouchableOpacity onPress={handleMessage} disabled={isSending} style={PostStyle.sendButton}>
					<Icon
						name='sc-telegram'
						type='evilicon'
						color='#FF6B6B'
						size={45}
						activeOpacity={0.8}
					/>
				</TouchableOpacity>
				{isSending && <Text style={modalStyles.sendWaitsText}>...</Text>}
			</View>

			{/* MODAL */}
			<Modal animationType="slide" transparent={true} visible={modalVisible} style={modalStyles.Modal} >
				<View style={modalStyles.ModalContainer}>

					<View style={modalStyles.modalContent}>
						{/* BTN MODAL */}
						<TouchableOpacity onPress={addPicture} style={modalStyles.modalBtn}>
							<Icon
								name='image'
								type='evilicon'
								color='#fff'
								size={45}
								activeOpacity={0.7}
							/>
						</TouchableOpacity>
						<TouchableOpacity onPress={takePicture} style={modalStyles.modalBtn}>
							<Icon
								name='camera'
								type='evilicon'
								color='#fff'
								size={45}
								activeOpacity={0.7}
							/>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => setModalVisible(false)} style={modalStyles.closeBtn}>
							<Icon
								name='close'
								type='evilicon'
								color='#fff'
								size={25}
								activeOpacity={0.7}
							/>
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
		width: 40,
		height: 40,
		borderRadius: 14,
		marginLeft: 0,
	},

	selectImageButton: {
		padding: 2,
		margin: 5,
		borderRadius: 8,
		marginLeft: 5,
		marginRight: 10,
	},

	// Input 
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		width: '100%',

	},

	input: {
		flex: 1,
		alignItems: 'center',
		padding: 10,
		borderColor: '#152033',
		borderRadius: 4,
		backgroundColor: '#152033',
		borderColor: 'black',
		borderRadius: 4,
		opacity: 0.7,
		color: 'white',
	},
	// Button
	sendButton: {
		textAlign: 'center',
		borderRadius: 8,
		paddingBottom: 5,
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
		position: 'absolute',
		alignSelf: 'flex-end',
		fontSize: 10,
		zIndex: 1,
		
	}
})
const modalStyles = StyleSheet.create({
	Modal: {
		backgroundColor: '#fff',
		padding: 10,
		borderRadius: 10,
		width: '50%',
		height: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-around',
		position: 'absolute',
		bottom: 0,
	},
	ModalContainer: {
		display: 'flex',
		position: 'absolute',
		bottom: 100,
		right: 0,
		alignItems: 'flex-start',
		justifyContent: 'center',
		opacity: 1,
		color: 'black',
	},
	closeBtn: {
		backgroundColor: 'transparent',
		marginLeft: 8,
		width: 50,
		height: 50,
		borderRadius: 50,
		borderRadius: 5,
		zIndex: 1,
		bottom: 0,
	},
	closeBtnModal: {
		fontSize: 20,
		color: 'white',
	},
	modalContent: {
		backgroundColor: 'transparent',
		padding: 10,
		borderRadius: 10,
		width: '50%',
		height: '50%',
	},
	modalBtn: {
		backgroundColor: '#FF6B6B',
		padding: 10,
		borderRadius: 50,
		width: 65,
		marginBottom: 10,
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
