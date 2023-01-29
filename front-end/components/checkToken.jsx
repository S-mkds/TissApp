import { View, Text } from 'react-native'
import React from 'react'

const [isLoggedIn, setIsLoggedIn] = useState(false);
const navigation = useNavigation();
const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        setIsLoggedIn(true);
        console.log('En ligne :', isLoggedIn);
        navigation.navigate('Chat');
    } else {
        setIsLoggedIn(false);
        console.log('Hors ligne :', isLoggedIn);
        navigation.navigate('Home');
    }
}
useEffect(() => {
    checkToken();
}, []);

export default checkToken