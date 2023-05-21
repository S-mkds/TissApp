import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BaseUrl from '../services/BaseUrl';
const API_URL = BaseUrl;
import jwt_decode from 'jwt-decode';
import { useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';
import { format } from 'date-fns';
import frLocale from 'date-fns/locale/fr';
import ChatInstantComponent from '../components/ChatInstantComponent';
import FullScreenImageModal from '../components/FullScreenImageModal'

const ChatGroups = ({ route }) => {

    const { recipientId, recipientName, recipientLastName } = route.params;
    // console.log("nom" + recipientName + "prenom" + recipientLastName)
    // console.log("ID du destinataire :", recipientId);
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState('');
    // récuperation des infos du destinataire et de l'émetteur
    
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

    const fetchRecipientId = async (recipientId) => {
      try {
        // Récupérer le token d'authentification
        const token = await AsyncStorage.getItem('token');
        const decodedToken = jwt_decode(token);
        const currentUser = decodedToken.userId;
        setCurrentUser(currentUser);
  
        const response = await axios.get(`${API_URL}/api/instantPosts/instantposts/${currentUser}/${recipientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setMessages(response.data.posts);
        } else {
            console.log("Erreur lors de la récupération des messages du destinataire");
          }
        } catch (error) {
          console.error(error);
          console.log("Erreur lors de la récupération des messages du destinataire (catch)");
        }
      };

      useEffect(() => {
        fetchRecipientId(recipientId);
        const socket = io(`${API_URL}`);
        setTimeout(() => {
          // console.log("soket connecté" + socket.connected + "recipientId:" + recipientId + "currentUser:" + currentUser)
        }, 2000);
        console.log("socket connecté", socket.connected)
        socket.on('socketInstantPost', (msgMpSocket) => {
          fetchRecipientId(recipientId);
          setMessages((messages) => [...messages, msgMpSocket]);
          console.log(msgMpSocket);
        }
        );
      }, []);
  
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return format(date, "EEEE d MMMM yyyy 'à' HH:mm:ss", { locale: frLocale });
    };
  
    return (
      <View style={styles.container}>
      <Text style={styles.title}>
        Envoyer à: {recipientName} {recipientLastName}
      </Text>
        <FlatList
                style={styles.messageListContainer}
                inverted={true}
                onEndReached={() => fetchRecipientId(recipientId)}
                onEndReachedThreshold={0.5}
                data={messages}
                keyExtractor={item => `${item.id}-${item.createdAt}`}
                renderItem={({ item }) => (
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
                )}
            />
            <View style={styles.inputContainer}>
            <ChatInstantComponent recipientId={recipientId} />
            </View >
            <FullScreenImageModal visible={modalVisible} imageUrl={selectedImage} onClose={onCloseModal} />
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
