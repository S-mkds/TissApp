import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';
import { format, set } from 'date-fns';
import frLocale from 'date-fns/locale/fr';
import ImageMessageUpload from '../components/ChatPostComponent';
import FullScreenImageModal from '../components/FullScreenImageModal';
import BaseUrl from '../services/BaseUrl';
import jwt_decode from 'jwt-decode';


const API_URL = BaseUrl
const Chat = () => {
    const navigation = useNavigation();
    const [messages, setMessages] = useState([]);
    // Check Text error
    const [currentUser, setCurrentUser] = useState(null);

    const [selectedImage, setSelectedImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalVisible(true);
    };
    
    const onCloseModal = () => {
        setModalVisible(false);
        setSelectedImage(null);
    };

    const fetchMessages = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/posts`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setMessages(response.data.posts);

                const decodedToken = jwt_decode(token);
                const userId = decodedToken.userId;
                setCurrentUser(userId);
            } else {
                console.log('error');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // ADD Socket 
    useEffect(() => {
        fetchMessages();
        const socket = io(`${API_URL}`);
        // setTimeout(() => {
        //     console.log("socket connecté", socket.connected)
        // }, 2000);
        socket.on('socketPost', (msgSocket) => {
            fetchMessages();
            setMessages(messages => [...messages, msgSocket]);
            // console.log(msgSocket);
        });
    }, []);

    // Formatage de la date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, "EEEE d MMMM yyyy 'à' HH:mm:ss", { locale: frLocale });
    };

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.messageListContainer}
                inverted={true}
                onEndReached={fetchMessages}
                onEndReachedThreshold={0.5}
                data={messages}
                keyExtractor={(item) => `${item.id}-${item.createdAt}`}
                renderItem={({ item }) => (
            <View
                style={[
                    styles.messageContainer,
                    item.User?.id === currentUser ? styles.currentUserMessageContainer : null,
            ]}
            >
            <View style={styles.messageContent}>
                <Image
                    style={styles.messageAvatar}
                    source={
                    item.User && item.User.imageUrl
                        ? { uri: item.User.imageUrl }
                        : require('../assets/avatarplaceholder.png')
                    }
                />
                <View style={styles.messageTextContainer}>
                    <Text style={styles.messageUsername}>
                        {item.User ? item.User.firstName : ''} {item.User ? item.User.lastName : ''}
                    </Text>
                        {item.imageUrl ? (
                    <TouchableOpacity onPress={() => openImageModal(item.imageUrl)}>
                        <Image source={{ uri: item.imageUrl }} style={styles.messageImage} />
                    </TouchableOpacity>
                    ) : null}
                    <Text style={styles.messageText}>{item.content}</Text>
                    <Text style={styles.messageCreatedAt}>{formatDate(item.createdAt)}</Text>
                </View>
                </View>
            </View>
            )}
        />
        <View style={styles.inputContainer}>
            <ImageMessageUpload />
        </View>
        <FullScreenImageModal visible={modalVisible} imageUrl={selectedImage} onClose={onCloseModal} />
        </View>
    );
};

const styles = StyleSheet.create({
    // Container
    container: {
        flex: 1,
        backgroundColor: '#0F1828',
    },

    messageListContainer: {
        flex: 1,
        width: '95%',
        backgroundColor: '#0F1828',
        bottom: '1%',
        alignSelf: 'center',
        margin: 10,
        padding: 10,

    },
    messageContainer: {
        flex: 1,
        alignSelf: 'flex-start',
        marginRight: 10,
        maxWidth: '90%',
        marginTop: 5,
        // borderWidth: 2,
        backgroundColor: '#FF6B6B',
        borderColor: 'grey',
        borderWidth: 2,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingTopleft: -20,
        marginBottom: 5,
        opacity: 0.9,
    },

    currentUserMessageContainer: {
        backgroundColor: '#152033',
        alignSelf: 'flex-end',
        marginRight: 0,
        marginLeft: 10,
        borderWidth: 2,
        borderColor: 'gray',
        borderBottomRightRadius: -20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        opacity: 0.9,
    },
    messageContent: {
        flexDirection: 'row',
        borderRadius: 20,
        padding: 10,
    },
    messageAvatar: {
        width: 50,
        height: 50,
        borderRadius: 17,
        marginRight: 8,
        borderWidth: 3,
    },
    messageTextContainer: {
        width: '80%',
        margin: 10,
        paddingRight: 10,
    },
    messageUsername: {
        fontWeight: 'bold',
        fontSize: 15,
        color: 'white',
        paddingBottom: 15,
    },
    messageText: {
        fontSize: 13,
        padding: 5,
        color: 'white',
    },
    messageImage: {
        width: 200,
        height: 200,
        borderRadius: 20,
        alignSelf: 'center',
    },
    messageCreatedAt: {
        margin: 2,
        fontSize: 8,
        color: 'white',
        alignSelf: 'flex-end',
    },
    errorText: {
        color: 'red',
        alignSelf: 'center',
        fontSize: 10,
    },
});

export default Chat;