import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, TextInput, View, TouchableHighlight, Text, Image, TouchableOpacity, Icon } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import BaseUrl from '../services/BaseUrl';
const API_URL = BaseUrl


const InscriptionScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Permission to show the password
  const [hidePass, setHidePass] = useState(true);

  // Error text check 
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [registerError, setRegisterError] = useState('')

  const nameRegex = /^[a-zA-Zéè'çà"-_]{1,12}$/;
  // le nom doit contenir entre 1 et 12 caractères, les caractères spéciaux autorisés sont éè'çà"-_
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  //L'email doit contenir au moins un caractère, un @, un point, et au moins 2 caractères après le point.
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/;
  // le password doit contenir au moins 8 Caractères, 1 Maj, 1 Min, 1 Chiffre, 1 Caractère spécial

  const handleSubmit = async () => {
    console.log(firstName, lastName, email, password, confirmPassword);
    if (!nameRegex.test(firstName)) {
      setFirstNameError("Le prénom n'est pas valide");
    } else if (!nameRegex.test(lastName)) {
      setLastNameError("Le nom n'est pas valide");
    } else if (!emailRegex.test(email)) {
      setEmailError("L'Email' n'est pas valide");
    } else if (!passwordRegex.test(password)) {
      setPasswordError("Le mot de passe n\'est pas valide, il doit contenir au moins 8 Caractères, 1 Maj, 1 Min, 1 Chiffre, 1 Caractère spécial");
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Les mots de passe ne correspondent pas");
    } else {
      // requête axios here localhost3000/signup
      try {
        const response = await axios.post(`${API_URL}/api/auth/signup`, {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        });
        if (response.status === 201) {
          console.log("status: 201, request signup successful");
          navigation.navigate('Home');
        }
      } catch (error) {
        setRegisterError("Erreur network lors de l\'inscription. Veuillez réessayer.");
        if (error.response.status === 409) {
          setRegisterError("Email déjà utilisé, Veuillez utiliser une autre adresse email.");
        } else {
          setRegisterError("Erreur lors de l\'inscription. Veuillez réessayer.");
        }
      }
    }
  }
  useEffect(() => {
    if (firstNameError !== '' || lastNameError !== '' || emailError !== '' || passwordError !== '' || confirmPasswordError !== '' || registerError !== '') {
      setTimeout(() => {
        setFirstNameError('');
        setLastNameError('');
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError('');
        setRegisterError('');
      }, 3000);
    }
  }, [firstNameError, lastNameError, emailError, passwordError, confirmPasswordError, registerError]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoArea}>
        <Image style={styles.logo} source={require('../assets/NewLogo.png')} />
        <Text style={styles.companyName} >Inscription</Text>
      </View>
      {/* Firstname */}
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        placeholderTextColor="#ffff"
        keyboardType="name"
        value={firstName}
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
        onChangeText={text => setLastName(text)}
      />
      {lastNameError !== '' && <Text style={styles.errorText}>{lastNameError}</Text>}
      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#ffff"
        keyboardType="name"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      {emailError !== '' && <Text style={styles.errorText}>{emailError}</Text>}
      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#ffff"
        keyboardType="Mot de passe"
        secureTextEntry={hidePass ? true : false}
        value={password}
        onChangeText={text => setPassword(text)}
      />
      {passwordError !== '' && <Text style={styles.errorText}>{passwordError}</Text>}
      {/* C-Password */}
      <TextInput
        style={styles.input}
        placeholder="Confirmez votre mot de passe"
        placeholderTextColor="#ffff"
        keyboardType="password"
        secureTextEntry={hidePass ? true : false}
        value={confirmPassword}
        onChangeText={text => setConfirmPassword(text)}
      />
      {confirmPasswordError !== '' && <Text style={styles.errorText}>{confirmPasswordError}</Text>}
      <Text style={styles.textHidePass} onPress={() => setHidePass(!hidePass)} >
        <Ionicons
          style={styles.icon}
          name={hidePass ? 'eye-off-outline' : 'eye-outline'}
        />
        Afficher le mot de passe !
      </Text>
      <View>
        {/* Button Register */}
        {registerError !== '' && <Text style={styles.errorText}>{registerError}</Text>}
        <TouchableOpacity style={styles.buttonRegister}
          onPress={() =>
            handleSubmit()
          }>
          <Text style={styles.buttonText}>Inscription</Text>
        </TouchableOpacity >
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
    paddingBottom: 70,
  },
  input: {
    width: "90%",
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#152033",
    backgroundColor: "#152033",
    borderRadius: 20,
    color: "#ffff"
  },
  buttonRegister: {
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    width: "90%",
    height: 40,
    padding: 10,
    margin: 10,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
  },
  logoArea: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  companyName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  logo: {
    width: 250,
    height: 100,
    objectFit: 'cover',
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
    textAlign: 'center',
    fontSize: 13,
    marginRight: 10,
    paddingBottom: 10,
  },
})

export default InscriptionScreen;
