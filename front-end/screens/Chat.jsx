import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';

const Chat = () => {
    const navigation = useNavigation();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');

    const fetchMessages = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`http://10.10.60.75:3100/api/posts/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setMessages(response.data.posts);

            } else {
                console.log('error');
            }
        } catch (error) {
            // console.error(error);
            // console.log(error.response);
            // console.log('request GETALL messages, error !');
        }
    };



    const handleSendMessage = async () => {
        if (newMessage === '') {
            alert('Vous ne pouvez pas envoyez un message vide !')
        } else {
            try {
                const data = {};
                if (newMessage) data.content = newMessage;
                if (newImageUrl) data.imageUrl = newImageUrl;
                const token = await AsyncStorage.getItem('token');
                const response = await axios.post('http://10.10.60.75:3100/api/posts', data, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.status === 201) {
                    fetchMessages();
                    setNewMessage('');
                    setNewImageUrl('');
                    console.log('request POST message, success !');
                }
                else {
                    console.log('error');
                    console.log(response.status);
                }
            } catch (error) {
                console.error(error);
                console.log(error.response);
                console.log('request POST message, error !');
            }
        }
    };
    useEffect(() => {

        fetchMessages();
        const socket = io('http://110.10.57.143.3:2000');
        setTimeout(() => {
            console.log(socket.connected)
        }, 2000);
        socket.on('newPost', (msg) => {
            setMessages(messages => [...messages, msg]);
            console.warn(msg);
        });
    }, []);
    return (
        // Message view
        <View style={styles.container}>
            <FlatList
                style={styles.messageListContainer}
                inverted={true}
                onEndReached={fetchMessages}
                onEndReachedThreshold={0.5}
                data={messages}
                keyExtractor={item => `${item.id}-${item.createdAt}`}
                renderItem={({ item }) =>
                    <View style={styles.messageContainer}>
                        <View style={styles.messageContent}>
                            <Image style={styles.messageAvatar} source={item.imageUrl ? { uri: item.imageUrl } : require('../assets/DefaultUser.png')} />
                            <View style={styles.messageTextContainer}>
                                <Text style={styles.messageUsername}>{item.User.firstName} {item.User.lastName}</Text>
                                <Text style={styles.messageText}>{item.content}</Text>
                                <Text style={styles.messageCreatedAt}>{item.createdAt}</Text>
                            </View>
                        </View>
                    </View>}
            />

            {/* Input & Button views */}
            <View style={styles.inputContainer}>
                <TouchableOpacity value={newImageUrl} style={styles.selectImageButton}>
                    <Ionicons name="add-outline" size={24} color="white" />
                </TouchableOpacity>
                <TextInput
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Entrez votre message..."
                    placeholderTextColor={'white'}
                    style={styles.input}
                />
                <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                    <Ionicons style={styles.sharpIcon} name="send-sharp" size={20} color="#FF6B6B" />
                </TouchableOpacity>
            </View>
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
    },
    messageContainer: {
        flex: 1,
        alignSelf: 'flex-end',
        marginRight: 10,
        maxWidth: '90%',
        marginTop: 5,
        borderWidth: 1,
        borderColor: 'gray',
        borderTopRightRadius: 20,
        paddingTopleft: -20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 5,
    },
    messageContent: {
        flexDirection: 'row',
        backgroundColor: '#152033',
        opacity: 0.8,
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
    },
    messageAvatar: {
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
    messageTextContainer: {
        width: '80%',
        margin: 10,
        paddingRight: 10,
    },
    messageUsername: {
        fontWeight: 'bold',
        fontSize: 15,
        color: 'white',
    },
    messageText: {
        fontSize: 13,
        padding: 5,
        color: 'white',

    },
    messageCreatedAt: {
        fontSize: 8,
        color: 'white',
        alignSelf: 'flex-end',
    },
    // Input 
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        bottom: 5,
        width: '100%',
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#152033',
        borderRadius: 8,
        backgroundColor: '#152033',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        opacity: 0.7,
        color: 'white',
    },
    // Button
    sendButton: {
        padding: 5,
        borderRadius: 8,
    },
    selectImageButton: {
        padding: 2,
        margin: 5,
        borderRadius: 8,
    },
});

export default Chat;