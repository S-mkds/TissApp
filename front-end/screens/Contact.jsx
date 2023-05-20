import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import frLocale from 'date-fns/locale/fr';
import axios from 'axios';
import BaseUrl from '../services/BaseUrl';
const API_URL = BaseUrl

let timeoutId = null;
const Contact = () => {
    const navigation = useNavigation();
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
                    <TouchableOpacity style={styles.userContainer} 
                    onPress={() => navigation.navigate('ChatInstant', { recipientId: item.id })}
                    >
                        {/* mettre l'image de l'utilisateur */}
                        <Image style={styles.listItemAvatar} source={item.imageUrl ? { uri: item.imageUrl, } : require('../assets/avatarplaceholder.png')} />
                        <Text style={styles.userStatus}>{item.isOnline === true ? '🟢' : '🔴'}</Text>
                        <Text style={styles.userName}>{item.firstName}  {item.lastName}</Text>
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
    searchInput: {
        width: '95%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 8,
        borderRadius: 10,
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
    },
    listItemAvatar: {
        width: 50,
        height: 50,
        borderRadius: 17,
        marginRight: 8,
        borderWidth: 3,
        opacity: 0.8,
    },
    userStatus: {
        color: 'white',
        fontSize: 10,
        alignSelf: 'flex-start',
        right: 18,
    },
    userName: {
        color: 'white',
        marginRight: 10,
        fontSize: 13,
        flex: 1,
        alignSelf: 'flex-start',
        marginTop: 15,
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