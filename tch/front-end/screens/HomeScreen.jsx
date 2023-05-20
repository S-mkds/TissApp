import React from 'react';
import { View, Image, TouchableHighlight, StyleSheet, Text } from 'react-native';
import Styles from '../css/Styles'


const HomeScreen = ({ navigation }) => {
	return (
		<View style={styles.container}>
			<Text style={Styles.companyName} >TissApp</Text>
			<Image style={Styles.logo} source={require('../assets/NewLogo.png')} />
			<Text style={Styles.connectText} >Connectez vous et discutez avec le monde entier en toute sérénité </Text>

			<View style={Styles.connectBtn}>
				<Text style={Styles.textPrivacy} >Terms & Privacy Policy</Text>
				<TouchableHighlight
					style={Styles.submit}
					onPress={() =>
						navigation.navigate('Login')}
				>
					<Text style={Styles.submitText}>Connexion</Text>
				</TouchableHighlight>
				<TouchableHighlight
					style={Styles.submit}
					onPress={() =>
						navigation.navigate('Register')}
				>
					<Text style={Styles.submitText}>Insciption</Text>
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
	},
})

export default HomeScreen;
