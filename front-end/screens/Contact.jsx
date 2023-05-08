import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import frLocale from 'date-fns/locale/fr';
import axios from 'axios';
import BaseUrl from '../services/BaseUrl';
const API_URL = BaseUrl

let timeoutId = null;
const Contact = () => {
    const [search, setSearch] = useState('');
    const [usersSearch, setSearchUsers] = useState([]);

    const handleSearch = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/auth/users/`, {
                params: { search: search },
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setSearchUsers(response.data);
                // console.log(JSON.stringify(response));
            }
        } catch (error) {
            // console.log('request GETALL users, error !');
            console.log(error);
        }
    }

    useEffect(() => {
        handleSearch(search);
    }, [search]);

    // search
    const onSearchChange = (text) => {
        setSearch(text);
        handleSearch(text);
    };

    // Formatage de la date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, "EEEE d MMMM yyyy 'à' HH:mm:ss", { locale: frLocale });
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher un utilisateur..."
                    placeholderTextColor={'white'}
                    color={'white'}
                    onChangeText={onSearchChange}
                    value={search}
                />
            </View>
            <FlatList
                style={styles.listContainer}
                data={usersSearch.users}
                onEndReachedThreshold={0.5}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.userContainer} >
                        {/* mettre l'image de l'utilisateur */}
                        <Image style={styles.listItemAvatar} source={item.imageUrl ? { uri: item.imageUrl, } : require('../assets/DefaultUser.png')} />
                        <Text style={styles.userName}>{item.firstName}  {item.lastName}</Text>
                        {/* mettre le status hors ligne ou en ligne */}
                        <Text style={styles.userStatus}>{item.isOnline === true ? 'En ligne 🟢' : 'Hors ligne 🔴'}</Text>
                        <Text style={styles.userCreatedAt}>Crée le {formatDate(item.createdAt)}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    // container
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0F1828',
    },

    // search
    searchBar: {
        width: '90%',
        height: 40,
        borderWidth: 1,
        borderColor: 'white',
        padding: 10,
        marginTop: 20,
        marginBottom: 20,
    },
    searchButton: {
        backgroundColor: 'black',
        padding: 7,
        borderRadius: 10,
    },
    searchInput: {
        width: '95%',
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        boxShadow: '0 0 5px black',
        padding: 8,
        borderRadius: 10,
        backgroundColor: 'gray',
        opacity: 0.5,
        margin: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
    },
    // list users Containers
    listContainer: {
        width: '100%',
    },
    userContainer: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        margin: 10,
        padding: 10,
        boxShadow: '0 0 5px black',
    },
    listItemAvatar: {
        width: 50,
        height: 50,
        borderRadius: 17,
        marginRight: 8,
        borderWidth: 3,
        borderColor: '#7452B7',
        boxShadow: '0 0 5px black',
        backgroundColor: 'black',
        opacity: 0.8,
    },
    userName: {
        color: 'white',
        marginRight: 10,
        fontSize: 13,
        flex: 1,
        alignSelf: 'flex-start',
        marginTop: 15,
    },
    userStatus: {
        color: 'white',
        fontSize: 8,
        right: 15,
        alignSelf: 'flex-end',
    },
    userCreatedAt: {
        color: 'white',
        opacity: 0.8,
        fontSize: 5,
        alignSelf: 'flex-end',
        marginRight: 10,
        marginTop: 5,
    },
});

export default Contact;