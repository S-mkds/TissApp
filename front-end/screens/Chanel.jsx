import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import frLocale from 'date-fns/locale/fr';
import axios from 'axios';
import BaseUrl from '../services/BaseUrl';
import ChanelComponent from '../components/chanelPost.jsx';
const API_URL = BaseUrl;

const Chanel = () => {
    const [search, setSearch] = useState('');
    const [groups, setGroups] = useState([
    ]);

    const onSearchChange = (text) => {
        setSearch(text);
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, "EEEE d MMMM yyyy 'à' HH:mm:ss", { locale: frLocale });
    };
    const handleSearch = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/chanel/chanels/`, {
                params: { search: search },
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setGroups(response.data);
                // console.log(JSON.stringify(response));
                // console.log(groups);
            }
        } catch (error) {
            console.log('request GETALL users, error !');
            console.log(error);
        }
    }

useEffect(() => {
    handleSearch(search);
}, [search]);

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher un serveur..."
                    placeholderTextColor={'white'}
                    color={'white'}
                    onChangeText={onSearchChange}
                    value={search}
                />
            </View>
            <FlatList
    style={styles.listContainer}
    data={groups.chanels}
    onEndReachedThreshold={0.5}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
        <TouchableOpacity style={styles.listChanel}>
            <Image style={styles.imageChannel} source={{ uri: item.imageUrl ? item.imageUrl : 'https://www.w3schools.com/howto/img_avatar.png' }} />
            <Text style={styles.textChanel}>Titre: {item.title}</Text>
            <Text style={styles.textChanel}>Description: {item.content}</Text>
            <Text style={styles.textChanelCreatedAt}>Crée le: {formatDate(item.createdAt)}</Text>
        </TouchableOpacity>
    )}
/>

            <View style={styles.addGroupBtn}>
                <ChanelComponent style={styles.addGroupBtn}>
                </ChanelComponent>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0F1828',
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        backgroundColor: '#0F1828',
    },
    searchBar: {
        width: '70%',
        height: 40,
        borderWidth: 1,
        borderColor: 'white',
        padding: 5,
        marginTop: 15,
        marginBottom: 20,
        borderRadius: 10,
        backgroundColor: 'gray',
        color: 'white',
    },
    searchInput: {
        width: '90%',
        height: 35,
        borderWidth: 1,
        borderColor: 'black',
        boxShadow: '0 0 5px black',
        padding: 5,
        borderRadius: 10,
        backgroundColor: 'gray',
        opacity: 0.5,
        margin: 5,
        color: 'white',
        fontSize: 12,
    },
    listContainer: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        padding: 10,
        boxShadow: '0 0 5px black',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    listChanel: {
        backgroundColor: 'darkorange',
        transparent: true,
        opacity: 0.8,
        margin: 10,
        padding: 5,
        borderRadius: 10,
        zIndex: 1,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        boxShadow: '0 0 5px black',
    },
    imageChannel: {
        width: 50,
        height: 50,
        margin: 5,
        borderRadius: 100,
        alignSelf: 'flex-start',
    },
    textChanel: {
        color: 'white',
        fontSize: 15,
    },
    textChanelCreatedAt: {
        color: 'white',
        fontSize:8,
        padding: 5,
        alignSelf: 'flex-end',
        opacity: 0.8,
    },
    addGroupBtn: {
        width: 50,
        height: -50,
        borderRadius: 10,
        padding: 5,
        zIndex: 1,
        marginBottom: 10,
        alignSelf: 'flex-end',
        marginRight: 20,
        },

});

export default Chanel;