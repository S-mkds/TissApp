// SearchBar.js
import React from "react";
import { StyleSheet, TextInput, View, Keyboard, Button } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import SearchStyle from '../css/SearchStyle'

const SearchBar = ({ clicked, searchPhrase, setSearchPhrase, setCLicked }) => {
	return (
		<View style={SearchStyle.container}>
			<View
				style={
					clicked
						? SearchStyle.searchBar__clicked
						: SearchStyle.searchBar__unclicked
				}
			>
				{/* search Icon */}
				<Feather
					name="search"
					size={20}
					color="#ADB5BD"
					style={{ marginLeft: 1 }}
				/>
				{/* Input field */}
				<TextInput
					style={SearchStyle.input}
					placeholder="Recherche"
					placeholderTextColor={"#ADB5BD"}
					value={searchPhrase}
					onChangeText={setSearchPhrase}
					onFocus={() => {
						
					}}
				/>
				{/* cross Icon, depending on whether the search bar is clicked or not */}
				{clicked && (
					<Entypo name="cross" size={20} color="black" style={{ padding: 1 }} onPress={() => {
						setSearchPhrase("")
					}} />
				)}
			</View>
			{/* cancel button, depending on whether the search bar is clicked or not */}
			{clicked && (
				<View>
					<Button
						title="Cancel"
						onPress={() => {
							Keyboard.dismiss();
							setCLicked(false);
						}}
					></Button>
				</View>
			)}
		</View>
	);
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
	
});