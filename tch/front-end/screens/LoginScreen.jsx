import React, { useState, createRef, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TextInput, TouchableHighlight } from 'react-native';
import Styles from '../css/Styles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from 'react-native-flash-message';
import Loader from '../components/Loader';
import axios from 'axios';
import BaseUrl from '../services/BaseUrl';
import io from 'socket.io-client';

const API_URL = BaseUrl;

const ConnexionScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [errortext, setErrortext] = useState('');
	const [socket, setSocket] = useState(null);

	const passwordInputRef = createRef();

	useEffect(() => {
		return () => {
			if (socket) {
				socket.disconnect();
			}
		};
	}, [socket]);

	const connectToSocket = (username) => {
		const newSocket = io(API_URL);
		newSocket.on('connect', () => {
			console.log('Connected to the server');
			newSocket.emit('join', username);
		});

		setSocket(newSocket);
	};

	const handleLogin = async () => {
		setErrortext('');

		if (email === '') {
			showMessage({
				message: 'Veuillez saisir votre email',
				type: 'warning',
				duration: 3000,
				position: 'top',
				floating: true,
				style: { marginTop: 40 },
			});
			return;
		}

		if (password === '') {
			showMessage({
				message: 'Veuillez saisir votre mot de passe',
				type: 'warning',
				duration: 3000,
				position: 'top',
				floating: true,
				style: { marginTop: 40 },
			});
			return;
		}

		setLoading(true);

		axios
			.post(`${API_URL}api/auth/login`, {
				email,
				password,
			})
			.then((response) => {
				setLoading(false);
				if (response.status === 201) {
					AsyncStorage.setItem('token', response.data.token);
					console.log(response.data.token);
					connectToSocket(email);
					navigation.navigate('Channel');
				} else {
					setErrortext(response.msg);
					
				}
			})
			.catch((error) => {
				setLoading(false);
				showMessage({
					message: 'Email ou mot de passe incorrect',
					type: 'danger',
					duration: 3000,
					position: 'top',
					floating: true,
					style: { marginTop: 40 },
				});
			});
	};

	return (
		<View style={styles.container}>
			<Loader loading={loading} />
			<View style={Styles.logoArea}>
				<Text style={Styles.companyName}>TissApp</Text>
				<Image style={Styles.minilogo} source={require('../assets/NewLogo.png')} />
			</View>
			<TextInput
				style={Styles.input}
				placeholder="Email"
				placeholderTextColor="#F7F7FC"
				keyboardType="email-address"
				onChangeText={(value) => setEmail(value)}
			/>
			<TextInput
				style={Styles.input}
				placeholder="Mot de passe"
				placeholderTextColor="#F7F7FC"
				keyboardType="password"
				secureTextEntry
				onChangeText={(value) => setPassword(value)}
			/>

			<View>
				<TouchableHighlight
					style={Styles.submit}
					onPress={handleLogin}
				>
					<Text style={Styles.submitText}>Se connecter</Text>
				</TouchableHighlight>
				<Text style={Styles.undotext}>Vous n'avez pas de compte ?</Text>
				<TouchableHighlight
					style={Styles.inscriptionBack}
					onPress={() =>
						navigation.navigate('Register', { name: 'RegisterScreen' })}
				>
					<Text style={Styles.submitText}>S'inscrire</Text>
				</TouchableHighlight>
			</View>
		</View>
	);
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignContent: 'center',
		backgroundColor: '#0F1828',
		paddingLeft: 10,
		paddingRight: 10,
	},

})

export default ConnexionScreen;
