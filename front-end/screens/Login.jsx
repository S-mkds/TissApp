import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// const token = await AsyncStorage.getItem('token'); // récupérer le token des données stockées en local (AsyncStorage) pour l'envoyer dans les headers de la requête axios
const Login = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    //Error check
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('')

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Vérifier si l'utilisateur est connecté ou pas 
    // Permission to show the password
    const [hidePass, setHidePass] = useState(true);
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    //L'email doit contenir au moins un caractère, un @, un point, et au moins 2 caractères après le point.
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/;
    // le password doit contenir au moins 8 Caractères, 1 Maj, 1 Min, 1 Chiffre, 1 Caractère spécial

    const handleLogin = async () => {
        console.log(email, password);
        if (!emailRegex.test(email)) {
            setEmailError("L'adresse e-mail n'est pas valide");
        } else if (!passwordRegex.test(password)) {
            setPasswordError("Le mot de passe n'est pas valide");
        } else {
            // requête axios here localhost3000/login
            try {
                const response = await axios.post('http://10.10.22.199:3100/api/auth/login', {
                    email: email,
                    password: password,
                });
                if (response.status === 201) {
                    // Stocker le token
                    await AsyncStorage.setItem('token', response.data.token);
                    console.log('Voici le token de l\'utilisateur', response.data.token)
                    console.log("status: 201, request login successful");
                    navigation.navigate('Profil');
                } else {
                    console.log("status: " + response.status + ", request unsuccessful");
                    setLoginError("Vérifier vos identifiants")

                }
            } catch (error) {
                // alert('Erreur requête lors de la Connexion impossible.');
                console.log(JSON.stringify(error.response));
                setLoginError("Vérifier vos identifiants")
            }
        }
    };
    useEffect(() => {
        if (emailError !== '' || passwordError !== '' || loginError != '') {
            setTimeout(() => {
                setEmailError('');
                setPasswordError('');
                setLoginError('');
            }, 2000);
        }
    }, [passwordError, emailError, loginError]);

    const CustomButton = () => (
        <TouchableOpacity style={styles.button}
            onPress={() =>
                handleLogin()
            }>
            <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity >
    );

    const RegisterNavButton = () => (
        <TouchableOpacity style={styles.buttonRegister}
            onPress={() =>
                navigation.navigate('Register')
            }>
            <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity >
    );

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image style={styles.logo} source={require('../assets/NewLogo.png')} />
            <Text style={styles.companyName}>Connexion</Text>
            {/* Email */}
            <TextInput
                placeholder='E-mail'
                placeholderTextColor='white'
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            {emailError !== '' && <Text style={styles.errorText}>{emailError}</Text>}
            {/* Mot de passe */}
            <TextInput
                placeholder='Mot de passe'
                placeholderTextColor='white'
                value={password}
                onChangeText={setPassword}
                secureTextEntry={hidePass ? true : false}
                style={styles.input}
            />
            {passwordError !== '' && <Text style={styles.errorText}>{passwordError}</Text>}
            <Text style={styles.textHidePass} onPress={() => setHidePass(!hidePass)} >
                <Ionicons
                    style={styles.icon}
                    name={hidePass ? 'eye-off-outline' : 'eye-outline'}

                />
                Afficher le mot de passe !
            </Text>
            {/* Login Button */}
            {loginError !== '' && <Text style={styles.errorText}>{loginError}</Text>}
            <CustomButton />
            <Text style={styles.textRegister}>Vous n'avez pas de compte ?</Text>
            <RegisterNavButton />
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
    logo: {
        alignSelf: 'center',
        width: 250,
        height: 100,
    },
    companyName: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
        fontStyle: 'italic',
        textAlign: 'center'
    },
    input: {
        width: 300,
        borderColor: 'none',
        padding: 10,
        margin: 10,
        backgroundColor: '#152033',
        color: 'white',
    },
    button: {
        backgroundColor: '#FF6B6B',
        padding: 10,
        margin: 10,
        width: 300,
        borderRadius: 30,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
    },
    textRegister: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    buttonRegister: {
        backgroundColor: 'gray',
        padding: 10,
        margin: 10,
        width: 300,
        borderRadius: 30,
        alignItems: 'center',
    },
    icon: {
        color: 'white',
        fontSize: 14,
    },
    textHidePass: {
        color: 'white',
        textAlign: 'center',
        fontSize: 13,
        marginRight: 10,
        paddingBottom: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        paddingLeft: 10,
        paddingTop: 5,
    },
});

export default Login;