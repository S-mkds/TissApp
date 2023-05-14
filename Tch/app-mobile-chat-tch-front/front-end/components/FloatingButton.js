import React, { forwardRef, useRef } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';

const FloatingButton = forwardRef((props, ref) => {
	const navigation = useNavigation(); 

	return (
		<TouchableOpacity
			ref={ref}
			style={styles.floatingButton}
			activeOpacity={0.7}
			onPress={() => navigation.navigate('Contacts')}
		>
			<Icon name="message" color="#fff" size={30} />
		</TouchableOpacity>
	);
});

const styles = StyleSheet.create({
	floatingButton: {
		position: 'absolute',
		bottom: 70,
		right: 20,
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: '#007aff',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default FloatingButton;
