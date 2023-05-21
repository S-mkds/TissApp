import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, TouchableHighlight, FlatList, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BaseUrl from '../services/BaseUrl';
const API_URL = BaseUrl
import jwt_decode from 'jwt-decode';
import { useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';
import { format } from 'date-fns';
import frLocale from 'date-fns/locale/fr';
import ImageUploadMessageChanelChat from '../components/ChatGroupsComponent';
import ModalDeleteMessage from '../components/ModalDeleteMessage';
import FullScreenImageModal from '../components/FullScreenImageModal';

const ChatGroups = ({ route }) => {
    const { chanelId } = route.params;
    // console.log(chanelId);
    const [messages, setMessages] = useState([]);
    const [title, setTitle] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    const [selectedImage, setSelectedImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Modal Delete Message
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalVisible(true);
    };
    
    const onCloseModal = () => {
        setModalVisible(false);
        setSelectedImage(null);
    };

        // fonction fetch delete message
const handleDeleteMessage = async (messageId, userId) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await axios.delete(`${API_URL}/api/chanelPosts/delete-posts-chanel/${messageId}?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(response);
      if (response.status === 200) {
        fetchMessages();
      } else {
        console.log('error');
      }
    } catch (error) {
        console.error(error);
    }
};

    const openDeleteModal = (message) => {
    setSelectedMessage(message);
    setShowDeleteModal(true);
};

    const fetchChanelId = async () => {
        try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/chanel/chanels/${chanelId}`, {
            headers: {
            'Authorization': `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            // console.log(response.data)
            setTitle(response.data.chanel.title + ' - n°' + response.data.chanel.id);
        } else {
            console.log('Error fetching ChanelId');
        }
        } catch (error) {
        console.error(error);
        console.log('Error fetching ChanelId');
        }
    };

    const fetchMessages = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            // /postsChanels/:chanelId/posts cette route permet de récupérer les messages d'un chanel grâce à son id mis en params avant le /posts 
            const response = await axios.get(`${API_URL}/api/chanelPosts/chanels/${chanelId}/posts`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (response.status === 200) {
                // console.log(channelId);
                // console.log(response.data);
                setMessages(response.data.postsChanels);
                const decodedToken = jwt_decode(token);
                const userId = decodedToken.userId;
                setCurrentUser(userId);
            } else {
                console.log('error');
            }
        } catch (error) {
            console.error(error);
            console.log('error Catch');
        }
    };
    

    // ADD Socket 
    useEffect(() => {
        fetchChanelId();
        fetchMessages();
        const socket = io(`${API_URL}`);
        setTimeout(() => {
            // console.log("socket connecté", socket.connected)
        }, 2000);
        socket.on('socketPostChanel', (msgGroupsSocket) => {
            fetchMessages();
            setMessages(messages => [...messages, msgGroupsSocket]);
            // console.log(msgGroupsSocket);
        });
    }, []);

    // Formatage de la date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, "EEEE d MMMM yyyy 'à' HH:mm:ss", { locale: frLocale });
    };

    return (
        // Message view
        <View style={styles.container}>
            <Text style={styles.title}>Serveur : {title}</Text>
            <FlatList
                style={styles.messageListContainer}
                inverted={true}
                onEndReached={fetchMessages}
                onEndReachedThreshold={0.5}
                data={messages}
                keyExtractor={item => `${item.id}-${item.createdAt}`}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={item.User?.id === currentUser ? () => openDeleteModal(item) : null}>
                    <View style={[styles.messageContainer, item.User?.id === currentUser ? styles.currentUserMessageContainer : null]}>
                        <View style={[styles.messageContent]}>
                            <Image style={styles.messageAvatar} source={item.User && item.User.imageUrl ? { uri: item.User.imageUrl } : require('../assets/avatarplaceholder.png')} />
                            <View style={styles.messageTextContainer}>
                                <Text style={styles.messageUsername}>{item.User ? item.User.firstName : ''} {item.User ? item.User.lastName : ''}</Text>
                                {item.imageUrl ? (
                                    <TouchableOpacity onPress={() => openImageModal(item.imageUrl)}>
                                    <Image style={styles.messageImage} source={item.imageUrl ? { uri: item.imageUrl, } : null} />
                                    </TouchableOpacity>
                                ) : null}
                                <Text style={styles.messageText}>{item.content}</Text>
                                <Text style={styles.messageCreatedAt}>{formatDate(item.createdAt)}</Text>
                            </View>
                        </View>
                    </View>
                    </TouchableOpacity>
                )}
            />
            <View style={styles.inputContainer}>
            <ImageUploadMessageChanelChat chanelId={chanelId} />
            </View >
            <FullScreenImageModal visible={modalVisible} imageUrl={selectedImage} onClose={onCloseModal} />
            <ModalDeleteMessage onDelete={() => handleDeleteMessage(selectedMessage.id, selectedMessage.userId )} visible={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
        </View >
    );
};

const styles = StyleSheet.create({
    // Container
    container: {
        flex: 1,
        backgroundColor: '#0F1828',
    },
    title: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#152033',
        maxWidth: '95%',
        alignSelf: 'center',
        padding: 10,
        borderRadius: 20,
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

export default ChatGroups;
