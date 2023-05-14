import { StyleSheet } from 'react-native';


export default StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		width: "90%",
		marginHorizontal: 5,
	},
	searchBar__unclicked: {
		padding: 6,
		flexDirection: "row",
		width: '90%',
		borderRadius: 15,
		alignItems: "center",
		borderRadius: 4,
		backgroundColor: '#152033',
		marginHorizontal: 12,
	},
	searchBar__clicked: {
		padding: 10,
		flexDirection: "row",
		width: "80%",
		backgroundColor: "#d9dbda",
		borderRadius: 15,
		alignItems: "center",
		justifyContent: "space-evenly",
	},
	input: {
		fontSize: 14,
		marginLeft: 10,
		width: "90%",
		color: 'white'
	},
})