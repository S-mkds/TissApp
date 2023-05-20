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
			onPress={() => navigation.navigate('Chat')}
		>
			<Icon name="message" color="#fff" size={30} />
		</TouchableOpacity>
	);
});

const styles = StyleSheet.create({
	floatingButton: {
		position: 'absolute',
		bottom: 10,
		right: 10,
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: '#46D6D8',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default FloatingButton;
