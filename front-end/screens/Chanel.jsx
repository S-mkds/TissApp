import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import frLocale from 'date-fns/locale/fr';
import axios from 'axios';
import BaseUrl from '../services/BaseUrl';
import ChanelPostComponent from '../components/ChanelPostComponent';
import { useNavigation } from '@react-navigation/native';
const API_URL = BaseUrl;
import jwt_decode from 'jwt-decode';

const Chanel = () => {
    const navigation = useNavigation();

    const [search, setSearch] = useState('');
    const [groups, setGroups] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

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
                // console.log(userId);
                // console.log(JSON.stringify(response));
                // console.log(groups);
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        handleSearch(search);
        const interval = setInterval(() => {
        handleSearch(search);
        }
        , 1000);
        return () => clearInterval(interval);
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
    inverted={true}
    onEndReachedThreshold={0.5}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
        <TouchableOpacity
    style={styles.listChanel}
    onPress={() => navigation.navigate('ChatGroups', { chanelId: item.id })}
    // console.log(item.id)
        >
    <Image
        style={styles.imageChannel}
        source={{ uri: item.imageUrl ? item.imageUrl : require('../assets/avatarplaceholder.png')}}
    />
    <Text style={styles.textChanel}>
        <Text style={styles.boldItalicText}>Titre:</Text>{'\n'}
        <Text style={styles.channelName}>{item.title}</Text>
    </Text>            

    <Text style={styles.textChanel}>
        <Text style={styles.boldItalicText}>Description:</Text>{'\n'}
        <Text style={styles.channelName}>{item.content}</Text>
    </Text>  
    <Text style={styles.textChanelCreated}>Crée par: {item.User.firstName} {item.User.lastName} </Text>   
    <Text style={styles.textChanelCreated}>Crée le: {formatDate(item.createdAt)} </Text>
    </TouchableOpacity>
    )}
    />
            <View style={styles.addGroupBtn}>
                <ChanelPostComponent style={styles.addGroupBtn}>
                </ChanelPostComponent>
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
        width: '85%',
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
    dataContainer: {
    },
    listContainer: {
        width: '95%',
    },
    listChanel: {
        backgroundColor: '#152033',
        padding: 10,
        borderRadius: 10,
        margin: 8,
        borderColor: 'gray',
        borderWidth: 1,

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
        padding: 5,
    },
    textChanelCreated: {
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
    boldItalicText: {
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    channelName: {

        fontSize: 11,
    },
});

export default Chanel;