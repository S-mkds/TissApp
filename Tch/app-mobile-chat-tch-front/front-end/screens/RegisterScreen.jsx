import React, {useState} from 'react';
import { StyleSheet, TextInput, View, TouchableHighlight, Text, Image, TouchableOpacity, Animated  } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Styles from '../css/Styles'
import Loader from '../components/Loader';
import axios from 'axios';
import BaseUrl from '../services/BaseUrl';

const API_URL = BaseUrl;


const RegisterScreen = (props) => {

	let rotateValueHolder = new Animated.Value(0);
	const startImageRotateFunction = () => {
		rotateValueHolder.setValue(0);
		Animated.timing(rotateValueHolder, {
			toValue: 1,
			duration: 5000,
			easing: Easing.linear,
			useNativeDriver: false,
		}).start(() => startImageRotateFunction());
	};

	const rotateData = rotateValueHolder.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg'],
	});
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [errortext, setErrortext] = useState('');
	const [
		isRegistraionSuccess,
		setIsRegistraionSuccess
	] = useState(false);

	const handleSubmit = async () => {
		setErrortext('');
		if (firstName == '') {
			showMessage({
				message: 'Veuillez saisir votre prénom',
				type: 'warning',
				duration: 3000,
				position: 'top',
				floating: true,
				style: { marginTop: 40 },
			});
			return;
		}
		if (lastName == '') {
			showMessage({
				message: 'Veuillez saisir votre prénom',
				type: 'warning',
				duration: 3000,
				position: 'top',
				floating: true,
				style: { marginTop: 40 },
			});
			return;
		}
		if (email == '') {
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
		if (password == '') {
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
		if (password !== confirmPassword) {
			showMessage({
				message: 'les mots de passe ne correspondent pas',
				type: 'danger',
				duration: 3000,
				position: 'top',
				floating: true,
				style: { marginTop: 40 },
			});
			return;
		}
		//Show Loader
		setLoading(true);
		var dataToSend = {
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: password,
		};
		var formBody = [];
		for (var key in dataToSend) {
			var encodedKey = encodeURIComponent(key);
			var encodedValue = encodeURIComponent(dataToSend[key]);
			formBody.push(encodedKey + '=' + encodedValue);
		}
		axios.post(`${API_URL}api/auth/signup`, {
			firstName,
			lastName,
			email,
			password
		})
			.then(response => {
				setLoading(false);
				console.log(response.data);
				// navigation.navigate("Login");
				if (response.status === 201) {
					setIsRegistraionSuccess(true);
					showMessage({
						message: 'Félicitation! vous avez été inscrit avec succès',
						type: 'success',
						duration: 3000,
						position: 'top',
						floating: true,
						style: { marginTop: 40 },
					});
				} else {
					setErrortext(response.msg);
				}
			})
			.catch((error) => {
				//Hide Loader
				setLoading(false);
				console.error(error);
			})
			.catch(error => {
				console.log(error);
				showMessage({
					message: 'Désolé! Votre inscription a échoué',
					type: 'danger',
					duration: 3000,
					position: 'top',
					floating: true,
					style: { marginTop: 40 },
				});
			});
	};
	if (isRegistraionSuccess) {
		
		
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: '#0F1828',
					justifyContent: 'center',
				}}>
				<Animated.Image
					source={require('../assets/success.png')}
					style={{
						height: 100,
						resizeMode: 'contain',
						alignSelf: 'center',
						transform: [{ rotate: rotateData }],
					}}
				/>
				<Text style={styles.successTextStyle}>
					Félicitation!
				</Text>
				<TouchableOpacity
					style={styles.submit}
					activeOpacity={0.5}
					onPress={() => props.navigation.navigate('Login')}>
					<Text style={Styles.submitText}>Connectez-vous</Text>
				</TouchableOpacity>
			</View>
		);
	}
	return (
		<View style={styles.container}>
			<Loader loading={loading} />
			<View style={Styles.logoArea}>
				<Text style={Styles.companyName} >TissApp</Text>
				<Image style={Styles.minilogoIn} source={require('../assets/NewLogo.png')} />
			</View>
			<TextInput
				style={Styles.input}
				placeholder="Prénom"
				placeholderTextColor="#F7F7FC"
				keyboardType="name-family"
				value={firstName}
				onChangeText={text => setFirstName(text)}
			/>
			<TextInput
				style={Styles.input}
				placeholder="Nom"
				placeholderTextColor="#F7F7FC"
				keyboardType="name"
				value={lastName}
				onChangeText={text => setLastName(text)}
			/>
			<TextInput
				style={Styles.input}
				placeholder="Email"
				placeholderTextColor="#F7F7FC"
				keyboardType="email-address"
				blurOnSubmit={true}
				value={email}
				onChangeText={text => setEmail(text)}
			/>
			<TextInput
				style={Styles.input}
				placeholder="Mot de passe"
				placeholderTextColor="#F7F7FC"
				keyboardType="password"
				autoComplete="password-new"
				value={password}
				onChangeText={text => setPassword(text)}
				secureTextEntry
			/>
			<TextInput
				style={Styles.input}
				placeholder="Confirmez votre mot de passe"
				placeholderTextColor="#F7F7FC"
				keyboardType="password"
				value={confirmPassword}
				onChangeText={text => setConfirmPassword(text)}
				secureTextEntry
			/>
			{errortext != '' ? (
				<Text style={styles.errorTextStyle}>
					{errortext}
				</Text>
			) : null}
			<View>
				<TouchableHighlight
					style={styles.submit}
					onPress={handleSubmit}
				>
					<Text style={Styles.submitText}>S'inscrire</Text>
				</TouchableHighlight>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex:1,
		justifyContent: 'center',
		alignContent: 'center',
		backgroundColor: '#0F1828',
		paddingLeft: 10,
		paddingRight: 10,
	},
	submit: {
		marginLeft: 20,
		marginRight: 20,
		paddingTop: 12,
		paddingBottom: 12,
		backgroundColor: '#FF6B6B',
		borderRadius: 30,
	},
	errorTextStyle: {
		color: 'red',
		textAlign: 'center',
		fontSize: 14,
	},
	successTextStyle: {
		color: 'white',
		textAlign: 'center',
		fontSize: 18,
		padding: 30,
	},
})

export default RegisterScreen ;
