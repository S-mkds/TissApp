import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Image, Pressable } from 'react-native';
import { Icon } from "react-native-elements";
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import BaseUrl from '../services/BaseUrl';

const API_URL = BaseUrl;
const ChannelScreen = () => {
	const [posts, setPosts] = useState([]);
	const [visible, setVisible] = useState(false);

	const navigation = useNavigation();

	const handlePosts = async () => {
		try {
			const token = await AsyncStorage.getItem('token');
			const response = await axios.get(`${API_URL}api/posts`, {
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});

			if (response.status === 200) {
				setPosts(response.data.posts);
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		handlePosts()
	}, []);

	const handleProfileNavigation = (userId) => {
		navigation.navigate('Profil', { userId });
	}

	const renderItem = ({ item }) => (
		<TouchableOpacity style={styles.containeContact} activeOpacity={0.7} onPress={() => navigation.navigate('Chat')}>
			<View>
				{item.User.imageUrl ? (
					<TouchableOpacity activeOpacity={0.5} onPress={() => handleProfileNavigation(item.User.id)}>
						<Image style={styles.profilImage} source={{ uri: item.User.imageUrl }} />
					</TouchableOpacity>
				) : (
					<View style={styles.initialContainer}>
						<Text style={styles.initialText}>{item.User.firstName.charAt(0)}{item.User.lastName.charAt(0)}</Text>
					</View>
				)}
			</View>
			<View style={styles.profilName}>
				<Text style={styles.fullName}>{item.User.firstName} {item.User.lastName}</Text>
				<Text style={styles.message}>{item.content}</Text>
			</View>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<View style={styles.top}>
				<Text style={styles.textTop}>Disc.</Text>
				<Pressable onPress={() => setVisible(true)}>
					<Icon
						name='add'
						color='#F7F7FC'
						size={25}
						activeOpacity={0.7}
						style={{ marginRight: 5 }}
					/>
				</Pressable>
			</View>

			<FlatList
				data={posts}
				onEndReachedThreshold={0.5}
				keyExtractor={item => item.id.toString()}
				renderItem={renderItem}
			/>
			{visible ? <Modal setVisible={setVisible} /> : ""}
			<Footer />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignContent: 'center',
		backgroundColor: '#0F1828'
	},
	containeContact: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: '#0F1828',
		width: "90%",
		paddingBottom: 10,
		marginLeft: 10,
		paddingTop: 10,
		paddingHorizontal: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#ffffff15'
	},
	top: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignContent: 'center',
		marginTop: 50,
		marginBottom: 5,
		paddingHorizontal: 8,
	},
	textTop: {
		color: '#ffffff',
		fontSize: 18,
		paddingLeft: 5
	},
	profilImage: {
		width: 60,
		height: 60,
		borderRadius: 16,
	},
	initialContainer: {
		width: 60,
		height: 60,
		backgroundColor: ' #ccc',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FF6B6B',
		borderRadius: 16,
	},
	initialText: {
		textTransform: 'uppercase',
		color: '#ffffff',
		textAlign: 'center',
		fontSize: 16,
		fontWeight: 'bold',
	},
	profilName: {
		marginLeft: 20,
	},
	fullName: {
		color: "#ffffff",
		marginBottom: 10,
		fontSize: 15
	},
	message: {
		color: "#adb5bd",
		fontSize: 14
	},
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 5,
		marginBottom: 5,
		marginLeft: 5,
		marginRight: 5,
	},
	searchIcon: {
		marginLeft: 10,
	},
	input: {
		color: "#ffffff",
		marginLeft: 10,
		width: "80%",
		fontSize: 16,
	}, 
	floatingButton: {
		position: 'absolute',
		bottom: 20,
		right: 20,
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: '#007aff',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default ChannelScreen;
