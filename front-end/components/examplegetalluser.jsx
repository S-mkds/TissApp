// import { View, Text } from 'react-native'
// import React from 'react'


// const viewsUsers = async() => {
//     try {
//         const response = await axios.get('http://192.168.1.13:3000/api/usersAll', {
//         });
//         if (response.status === 200) {
//         setUsers(response.data);
//         }
//     } catch (error) {
//         console.log(error);
//         console.log(error.response);
//         console.log(error.response.data);
//     }
// }
// useEffect(() => {
//     viewsUsers();
// }, []);

// const examplegetalluser = () => {
//   return (
//     <View>
//       <Text>examplegetalluser</Text>
//       <FlatList
//             data={Users.users}
//             keyExtractor={item => item.id.toString()}
//             renderItem={({ item }) => (
//             <TouchableOpacity style={styles.userContainer}>
//             <Text style={styles.userName}>{item.firstName}</Text>
//             <Text style={styles.userName}>{item.lastName}</Text>
//             </TouchableOpacity>
//             )}
//         />
//     </View>
//   )
// }

// export default examplegetalluser