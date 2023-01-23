import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, TextInput, View, Text, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { ImagePicker, Permissions } from 'expo';
import axios from 'axios';

const Profil = ({navigation}) => {
    // Récupération state du Pseudo et du Prénom et l'email
const [userfirstName, setUserfirstName] = useState('');
const [userlastName, setUserlastName] = useState('');
const [image, setImage] = useState();
const [userEmail, setUserEmail] = useState('');
     // Modification state FirnstName et LastName
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
    // Regex for user
const nameRegex = /^[a-zA-Zéè'çà"-_]{1,12}$/;
    // le nom doit contenir entre 1 et 12 caractères, les caractères spéciaux autorisés sont éè'çà"-_

    // Get user Request
const getUser = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        //Retrieve the userId with the token
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        // console.log(userId);
        let response = await axios.get(`http://10.10.51.3:3000/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if(response.status === 200) {
            setUserfirstName(response.data.user.firstName);
            setUserlastName(response.data.user.lastName);
            setUserEmail(response.data.user.email);
            // console.log('SUCCESS GETONE REQUEST');
            // console.log('🪙 Token:' + token + ' Prénom:' + userfirstName + ' Nom:' + userlastName + ' Email:' + userEmail);
        }
    }catch (error) {
        // console.log('catch GET REQUEST');
        // console.log(JSON.stringify(error.response)); // Log the entire response object
    }
};
useEffect(() => {
    getUser();
}, []);

// Edit profil Request
const handleEdit = async()  => {
    if(firstName === "" || lastName === ""){
        alert('Les champs nom ou prénom ne peuvent pas être vide');
    }else if(!nameRegex.test(firstName)){
        alert('Le prénom n\'est pas valide');
    }else if(!nameRegex.test(lastName)){
        alert('Le nom n\'est pas valide');
    }else {
       // requête axios here localhost3000/edit
    try {
        const token = await AsyncStorage.getItem('token');
        let response = await axios.put('http://10.10.51.3:3000/api/auth/edit', {
            firstName : firstName, lastName : lastName
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if(response.status === 200) {
            console.log('SUCCESS PUT REQUEST');
            alert('Modification réussie !');

            try { useEffect(() => {
                handleEdit();
            }, [getUser()]);
            }catch (error) {
                console.log(error);
            }
        }
        else{
            console.log('error PUT REQUEST');
        }
    }catch (error) {
        console.log('Catch PUT REQUEST');
        console.log(error.AsyncStorage);
        console.log(JSON.stringify(error.response));
    }
    }
}

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
      // Clear the token from storage
        await AsyncStorage.removeItem('token');
      // Redirect the user to the Home screen
        console.log('Déconnexion réussie, 🪙 jetons supprimés 🪙 !');
        alert('Déconnexion réussie, jetons supprimés !');
        navigation.navigate('Home');
        useEffect(() => {
            handleLogout();
        }, []);
    } catch (error) {
        console.log(error);
    }
}

const LogoutButton = () => (
    <TouchableOpacity style={styles.buttonLogout}
        onPress={() =>
            handleLogout()
                }>
        <Text style={styles.buttonText}>Se déconnecter</Text>
    </TouchableOpacity >
);

// Image Picker function
const pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
        if (!result.cancelled) {
            setImage(result.uri);
        }
    }
};

return (
    <SafeAreaView style={styles.container}>
    {/* ADD IMAGE USER */}
    <View>
    <TouchableOpacity style={styles.imageArea} onPress={pickImage}>
        <Image
            source={require('../assets/avatar.png')}
            style={styles.image}
        />
        </TouchableOpacity>       
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
	<View>
        {/* Button Edit & logout */}
        <EditButton />
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
		borderRadius: 4,
		color: "#ffff",
        paddingLeft: 5,
	},
    button: {
        backgroundColor: '#FF6B6B',
        padding: 10,
        margin: 10,
        width: 350,
        borderRadius: 30,
        alignItems: 'center',
    },
    buttonLogout: {
        backgroundColor: 'gray',
        padding: 10,
        margin: 10,
        width: 350,
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
        maxWidth: 100,
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
})
export default Profil;
