import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';


const Profil = ({ navigation }) => {
	return (
		<TouchableOpacity style={styles.container} activeOpacity={.7} onPress={() =>
			console.log('Redirect to chatscreen')}>
			<View>
				<TouchableOpacity activeOpacity={.5} onPress={() =>
					console.log('Redirect to profil')} >
				<Image style={styles.profilImage} source={require('../assets/monprofil.png')} />
			</TouchableOpacity>
			</View>
			<View style={styles.profilName} >
				<Text style={styles.fullName} >John Doe</Text>
				<Text style={styles.statut}>En ligne</Text>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: '#0F1828',
		width: 300,
	},
	profilImage: {
		width: 60,
		height: 60,
		borderRadius: 16,
	},
	profilName: {
		marginLeft: 20,
	},
	fullName: {
		color: "#ffffff",
		marginBottom: 5,
		fontSize: 16
	},
	statut: {
		color: "#adb5bd",
		fontSize: 10
	}
})

export default Profil;
