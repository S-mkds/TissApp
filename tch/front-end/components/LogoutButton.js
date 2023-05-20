import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableHighlight, Text, Alert } from 'react-native';
import Styles from '../css/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation} from '@react-navigation/native';
import BaseUrl from '../services/BaseUrl';
import io from 'socket.io-client';
const API_URL = BaseUrl;

const LogoutButton = () => {
	const navigation = useNavigation();
	const [token, setToken] = useState(null);
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const newSocket = io(API_URL);
		setSocket(newSocket);
		return () => {
			newSocket.disconnect();
		};
	}, []);

	const handleLogout = async () => {
		try {
			const value = await AsyncStorage.getItem('token');
			if (value !== null) {
				setToken(value);
				await AsyncStorage.removeItem('token');
				const cleared = await AsyncStorage.getItem('token');
				if (cleared === null) {
					// Envoyer une requête PUT pour mettre à jour le statut de l'utilisateur à "offline"
					await fetch(`${API_URL}api/auth/edit`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${value}`,
						},
						body: JSON.stringify({ status: 'offline' }),
					});
					// Envoyer un événement de déconnexion au serveur de sockets
					socket.emit('disconnectUser', { token: value });
					navigation.navigate('Home');
				} else {
					console.log("Token n'a pas été effacé");
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		// handleEdit();
	}, [handleLogout]);

	return (
		<View>
			<TouchableHighlight
				style={Styles.inscriptionBack}
				onPress={handleLogout}
			>
				<Text style={Styles.submitText}>Se déconnecter</Text>
			</TouchableHighlight>
		</View>
	);
};

const styles = StyleSheet.create({});

export default LogoutButton;
