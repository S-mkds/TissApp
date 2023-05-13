import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import frLocale from 'date-fns/locale/fr';
import axios from 'axios';
import BaseUrl from '../services/BaseUrl';
import ChanelComponent from '../components/chanelPost.jsx';
import { useNavigation } from '@react-navigation/native';
const API_URL = BaseUrl;

const Chanel = () => {
    const navigation = useNavigation();

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
                setGroups(response.data)
                // console.log(JSON.stringify(response));
                // console.log(groups);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const navigateChat = () => {
        navigation.navigate('Chat-Group');
    }
    useEffect(() => {
        handleSearch();
const interval = setInterval(() => {
    handleSearch();
}, 1000);
return () => clearInterval(interval);
    }, []);

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
        <TouchableOpacity
    style={styles.listChanel}
    onPress={() => navigation.navigate('ChatGroups', { chanelId: item.id })}
        >
    <Image
        style={styles.imageChannel}
        source={{ uri: item.imageUrl ? item.imageUrl : '' }}
    />
    <Text style={styles.textChanel}>Serveur: {item.title}</Text>            
    <Text style={styles.textChanel}>Description: {item.content}</Text>   
    <Text style={styles.textChanelCreatedAt}>
        Crée le: {formatDate(item.createdAt)}
    </Text>
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
        padding: 5,
        borderRadius: 10,
        backgroundColor: 'gray',
        opacity: 0.5,
        margin: 5,
        color: 'white',
        fontSize: 12,
    },
    dataContainer: {
    },
    listContainer: {
        width: '100%',
        padding: 5,
    },
    listChanel: {
        backgroundColor: 'darkorange',
        transparent: true,
        opacity: 0.7,
        padding: 5,
        borderRadius: 10,
        margin: 8,
    },
    imageChannel: {
        width: 60,
        height: 80,
        borderRadius: 10,
        alignSelf: 'flex-start',
        backfaceVisibility: 'hidden',
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