// ContactScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, FlatList, TextInput, TouchableOpacity, Image, Pressable, TouchableHighlight } from 'react-native';
import { Avatar, Badge, Icon, withBadge } from "react-native-elements";
import { Feather, Entypo } from "@expo/vector-icons";
import Modal from '../components/Modal';
import FloatingButton from '../components/FloatingButton';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseUrl from '../services/BaseUrl';
import SearchStyle from '../css/SearchStyle'

const API_URL = BaseUrl;
let timeoutId = null;
const ContactScreen = ({ navigation, clicked, searchPhrase, setSearchPhrase, setCLicked }) => {
	const [search, setSearch] = useState('');
	const [usersSearch, setSearchUsers] = useState([]);
	const [visible, setVisible] = useState(false);

	const handleSearch = async () => {
		try {
			const token = await AsyncStorage.getItem('token');
			const response = await axios.get(`${API_URL}api/users/`, {
				params: { search: search },
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});
			if (response.status === 200) {
				setSearchUsers(response.data);
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		handleSearch();
	}, []);

	const onSearchChange = (text) => {
		setSearch(text);
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			handleSearch(text);
		}, 200);
	};

	const renderItem = ({ item }) => (
		<TouchableOpacity style={styles.containeContact} activeOpacity={.7} onPress={() => console.log('Redirect to chatscreen')}>
			<View>
				{item.imageUrl ? (
					<TouchableOpacity activeOpacity={.5} onPress={() => navigation.navigate('Profil', { userId: item.id })}>
						<Image style={styles.profilImage} source={{ uri: item.imageUrl }} />
					</TouchableOpacity>
				) : (
					<View style={styles.initialContainer}>
						<Text style={styles.initialText}>{item.firstName.charAt(0)}{item.lastName.charAt(0)}</Text>
					</View>
				)}
				<Badge
					status={item.status === 'online' ? 'success' : 'error'}
					containerStyle={{ position: 'absolute', top: 0, right: 2 }}
				/>
			</View>
			<View style={styles.profilName}>
				<Text style={styles.fullName}>{item.firstName} {item.lastName}</Text>
				<Text style={styles.statut}>{item.status === 'online' ? 'En ligne' : 'Hors ligne'}</Text>
			</View>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<View style={styles.searchBar}>
				<View
					style={
						clicked
							? SearchStyle.searchBar__clicked
							: SearchStyle.searchBar__unclicked
					}
				>
					<Feather
						name="search"
						size={20}
						color="#ADB5BD"
						style={{ marginLeft: 1 }}
					/>
					<TextInput
						style={SearchStyle.input}
						placeholder="Recherche"
						placeholderTextColor={"#ADB5BD"}
						onChangeText={onSearchChange}
						value={search}
					/>
					{clicked && (
						<Entypo name="cross" size={20} color="black" style={{ padding: 1 }} onPress={() => {
							setSearchPhrase("")
						}} />
					)}
				</View>
				{clicked && (
					<View>
						<Button
							title="Cancel"
							onPress={() => {
								Keyboard.dismiss();
								setCLicked(false);
							}}
						></Button>
					</View>
				)}
			</View>
			<FlatList
				data={usersSearch.users}
				onEndReachedThreshold={0.5}
				keyExtractor={item => item.id.toString()}
				renderItem={renderItem}
			/>
			{visible ? <Modal setVisible={setVisible} /> : ""}
			<FloatingButton/>
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
		marginBottom: 5,
		fontSize: 16
	},
	statut: {
		color: "#adb5bd",
		fontSize: 10
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
	}
});

export default ContactScreen;