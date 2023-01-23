import { View, Text } from 'react-native'
import React from 'react'

const BackButton = ({ onPress }) => (
    <TouchableHighlight style={styles.backButton} onPress={onPress}>
      <FontAwesome name="arrow-left" size={25} color="#FFF"/>
    </TouchableHighlight>
  );

const exampleButton = () => {
      // const BackButton = ({ onPress }) => (
    //     <TouchableHighlight style={styles.backButton} onPress={onPress}>
    //         <FontAwesome name="arrow-left" size={25} color="#FFF" />
    //     </TouchableHighlight>
    // );
  return (
    <View>
                  {/* <BackButton onPress={() => navigation.goBack()} /> */}
        <Text>exampleButton</Text>
            <BackButton
            style={styles.backButton}
            onPress={() => console.log('Button Back pressed!')}
            />
    </View>
    
  )
//   const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		justifyContent: 'center',
// 		alignContent: 'center',
// 		backgroundColor: '#0F1828',
// 		paddingLeft: 10,
// 		paddingRight: 10,
// 		paddingTop: 40,
// 		paddingBottom: 20,
// 	},
//   backButton: {
//     width: '100%',
//     height: 35,
//     borderRadius: 25,
//     position: 'absolute',
//   },
}

export default exampleButton