import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, TouchableHighlight, FlatList } from 'react-native';
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

const ChatGroups = ({ route }) => {
  const { userId } = route.params;
  console.log("recuperation de l'id du recipiant", userId);

  const [messages, setMessages] = useState([]);
  const [recipiantId, setRecipiantId] = useState('');
  const [currentUser, setCurrentUser] = useState(null);3
const getCurrentUser = async () => {
  const token = await AsyncStorage.getItem('token');
  const decodedToken = jwt_decode(token);
    const meUser = decodedToken.userId;
    setCurrentUser(meUser);
    console.log("recuperation de l'id du currentUser", meUser);
}
const fetchRecipiantId = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/instantPosts/instantposts/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(response)
      if (response.status === 200) {
        console.log(response.data.posts); // Les données des instantposts
        setRecipiantId(response.data.posts.recipientId);
        setMessages(response.data.posts.messages);
      } else {
        console.log('Error fetching instantPosts get');
      }
    } catch (error) {
      console.error(error);
      console.log('Error CATCH fetching instantPosts get');
    }
  };

useEffect(() => {
    getCurrentUser(); // Appel pour récupérer l'id du currentUser
    fetchRecipiantId();
    const socket = io(`${API_URL}`);
    setTimeout(() => {
      console.log("socket connecté", socket.connected);
    }, 2000);
    socket.on('socketInstantPost', (msgGroupsSocket) => {
      setMessages(messages => [...messages, msgGroupsSocket]);
      console.log(msgGroupsSocket);
    });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "EEEE d MMMM yyyy 'à' HH:mm:ss", { locale: frLocale });
  };

    return (
        // Message view
        <View style={styles.container}>
            
            <Text style={styles.title}>recipiant:{recipiantId}, userid du destinateur: {userId}, UserId du proprietaire: {currentUser} </Text>
            <FlatList
                style={styles.messageListContainer}
                inverted={true}
                onEndReached={fetchRecipiantId}
                onEndReachedThreshold={0.5}
                data={messages}
                keyExtractor={item => `${item.id}-${item.createdAt}`}
                renderItem={({ item }) => (
                    <View style={[styles.messageContainer, item.User?.id === currentUser ? styles.currentUserMessageContainer : null]}>
                        <View style={[styles.messageContent]}>
                            <Image style={styles.messageAvatar} source={item.User && item.User.imageUrl ? { uri: item.User.imageUrl } : require('../assets/DefaultUser.png')} />
                            <View style={styles.messageTextContainer}>
                                <Text style={styles.messageUsername}>{item.User ? item.User.firstName : ''} {item.User ? item.User.lastName : ''}</Text>
                                {item.imageUrl ? (
                                    <Image style={styles.messageImage} source={item.imageUrl ? { uri: item.imageUrl, } : null} />
                                ) : null}
                                <Text style={styles.messageText}>{item.content}</Text>
                                <Text style={styles.messageCreatedAt}>{formatDate(item.createdAt)}</Text>
                            </View>
                        </View>
                    </View>
                )}
            />
            <View style={styles.inputContainer}>
            <ChatInstantComponent  />
            </View >
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
        backgroundColor: 'rgb(52, 77, 94)',
        borderColor: 'grey',
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingTopleft: -20,
        marginBottom: 15,
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
        borderColor: '#7452B7',
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
        border: "black"
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
