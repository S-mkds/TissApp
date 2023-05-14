import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, Ionicons, Entypo } from '@expo/vector-icons';

const Footer = () => {
	const navigation = useNavigation();
	return (
		<View>
			<View style={styles.footer}>
				<Ionicons
					style={styles.chatIcon}
					name="list"
					color='#F7F7FC'
					size={30}
					onPress={() => navigation.navigate('Contacts')}
					activeOpacity={0.7}
					underlayColor="#ffff" 
				/>
				<Ionicons
					style={styles.chatIcon}
					name="chatbubble-outline"
					color='#F7F7FC'
					size={30}
					onPress={() => navigation.navigate('Chat')}
					activeOpacity={0.7}
					underlayColor="#ffff" 
				/>
				<FontAwesome5
					style={styles.dots}
					name="ellipsis-h"
					color='#F7F7FC'
					size={25}
					onPress={() => navigation.navigate('Profil')}
					activeOpacity={0.7}
					underlayColor="#ffff" 
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	footer: {
		backgroundColor: '#0F1828',
		height: 70,
		display: "flex",
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 20,
		paddingRight: 20,
		alignItems: 'center',
	},
	contacts: {
		color: '#F7F7FC',
	},
	userIcons: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},

})

export default Footer;
