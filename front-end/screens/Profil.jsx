import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, TextInput, View, Text, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import ImageUserUpload from '../components/ImageUserUpload';
import axios from 'axios';
import BaseUrl from '../services/BaseUrl';
const API_URL = BaseUrl

const Profil = ({ navigation }) => {
    // Récupération state du Pseudo et du Prénom et l'email
    const [userfirstName, setUserfirstName] = useState('');
    const [userlastName, setUserlastName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    // Modification state FirnstName et LastName
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // Check textError
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [editUserError, setEditUserError] = useState('');
    const [editUserSuccess, setEditUserSuccess] = useState('');

    // Regex for user
    const nameRegex = /^[a-zA-Zéè'çà"-_]{1,12}$/;
    // Le nom doit contenir entre 1 et 12 caractères, les caractères spéciaux autorisés sont éè'çà"-_

    // Get user Request
    const getUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            //Retrieve the userId with the token
            const decodedToken = jwt_decode(token);
            const userId = decodedToken.userId;
            // console.log(userId);
            let response = await axios.get(`${API_URL}/api/auth/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setUserfirstName(response.data.user.firstName);
                setUserlastName(response.data.user.lastName);
                setUserEmail(response.data.user.email);
            }
        } catch (error) {
            // console.log('catch GET REQUEST');
            setEditUserError("Erreur lors de la récupération de l'utilisateur");
        }
    };

    // Edit profil Request
    const handleEdit = async () => {
        if (firstName === "" || lastName === "") {
            setEditUserError("Les champs prénoms et noms ne doivent pas être vide");
        } else if (!nameRegex.test(firstName)) {
            setFirstNameError("Le prénom n'est pas valide");
        } else if (!nameRegex.test(lastName)) {
            setLastNameError("Le nom n'est pas valide");
        } else {
            // requête axios here localhost3000/edit
            try {
                const token = await AsyncStorage.getItem('token');
                let response = await axios.put(`${API_URL}/api/auth/edit`, {
                    firstName: firstName, lastName: lastName
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    setEditUserSuccess("Modification validé");
                    try {
                        useEffect(() => {
                            handleEdit();
                        }, [getUser()]);
                    } catch (error) {
                        console.log(error);
                    }
                }
                else {
                    // console.log('error PUT REQUEST');
                    setEditUserError("Modification non valide");
                }
            } catch (error) {
                // console.log(error.AsyncStorage);
                setEditUserError("Modification non valide, erreur network");
            }
        }
    };

    useEffect(() => {
        getUser()
        if (editUserError !== '' || editUserSuccess !== '' || firstNameError !== '' || lastNameError !== '') {
            setTimeout(() => {
                setEditUserSuccess('');
                setEditUserError('');
                setFirstNameError('');
                setLastNameError('');
            }, 2000);
        }
    }, [editUserError, editUserSuccess, firstNameError, lastNameError]);

    const EditButton = () => (
        <TouchableOpacity style={styles.button}
            onPress={() =>
                handleEdit()
            }>
            <Text style={styles.buttonText}>Modifier le profil</Text>
        </TouchableOpacity >
    );

    // Logout Button 
    const handleLogout = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            let response = await axios.put(`${API_URL}/api/auth/edit`, {
                isOnline: false
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                console.log('SUCCESS PUT REQUEST');
                // Clear the token from storage
                await AsyncStorage.removeItem('token');
                // Redirect the user to the Home screen
                console.log('Déconnexion réussie !');
                navigation.navigate('Home');
            }
            else {
                console.log('error Logout REQUEST');
            }
        } catch (error) {
            console.log(error);
            console.log('error Logout REQUEST');
        }
        useEffect(() => {
            handleLogout();
        }, []);
    }

    const LogoutButton = () => (
        <TouchableOpacity style={styles.buttonLogout}
            onPress={() =>
                handleLogout()
            }>
            <Text style={styles.buttonText}>Se déconnecter</Text>
        </TouchableOpacity >
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* ADD IMAGE USER */}
            <View>
                <ImageUserUpload />
            </View>
            {/* ID User */}
            <View>
                <Text style={styles.nameUser}>{userfirstName} {userlastName}</Text>
                <Text style={styles.nameUser}>{userEmail}</Text>
            </View>
            {/* Firstname */}
            <TextInput
                style={styles.input}
                placeholder="Prénom"
                placeholderTextColor="#ffff"
                keyboardType="name"
                value={firstName}
                onChange={text => setFirstName(text)}
                onChangeText={text => setFirstName(text)}
            />
            {firstNameError !== '' && <Text style={styles.errorText}>{firstNameError}</Text>}

            {/* Lastname */}
            <TextInput
                style={styles.input}
                placeholder="Nom"
                placeholderTextColor="#ffff"
                keyboardType="name-family"
                value={lastName}
                onChange={text => setLastName(text)}
                onChangeText={text => setLastName(text)}
            />
            {lastNameError !== '' && <Text style={styles.errorText}>{lastNameError}</Text>}
            <View>
                {/* Button Edit & logout */}
                <EditButton />
                {editUserError !== '' && <Text style={styles.errorText}>{editUserError}</Text>}
                {editUserSuccess !== '' && <Text style={styles.successText}>{editUserSuccess}</Text>}
                <LogoutButton />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#0F1828',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 70,
    },
    input: {
        height: 30,
        margin: 10,
        borderWidth: 1,
        borderColor: "#152033",
        backgroundColor: "#152033",
        borderRadius: 10,
        color: "#ffff",
        paddingLeft: 5,
    },
    button: {
        backgroundColor: '#FF6B6B',
        padding: 10,
        margin: 10,
        borderRadius: 30,
        alignItems: 'center',
    },
    buttonLogout: {
        backgroundColor: 'gray',
        padding: 10,
        margin: 10,
        borderRadius: 30,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
    },
    imageArea: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        margin: 15,
    },
    nameUser: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    image: {
        width: 80,
        height: 80,
        objectFit: 'cover',
        borderRadius: 17,
        borderWidth: 3,
        borderColor: '#7452B7',
        boxShadow: '0 0 5px black',
        backgroundColor: 'black',
        opacity: 0.8,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        fontWeight: 'bold',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    successText: {
        color: 'green',
        fontSize: 12,
        fontWeight: 'bold',
        fontStyle: 'italic',
        textAlign: 'center',
    },
})
export default Profil;
