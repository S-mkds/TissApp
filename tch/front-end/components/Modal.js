import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import { styles } from "../utils/styles";

const Modal = ({ setVisible }) => {
	const [groupName, setGroupName] = useState("");

	//👇🏻 Function that closes the Modal component
	const closeModal = () => setVisible(false);

	//👇🏻 Logs the group name to the console
	const handleCreateRoom = () => {
		console.log({ groupName });
		closeModal();
	};
	return (
		<View style={styles.modalContainer}>
			{/* <Text style={styles.modalsubheading}>Entrer le nom du groupe</Text> */}
			<TextInput
				style={styles.modalinput}
				placeholder='Créer un groupe...'
				placeholderTextColor={'#adb5bd'}
				onChangeText={(value) => setGroupName(value)}
			/>

			<View style={styles.modalbuttonContainer}>
				<Pressable style={styles.modalbutton} onPress={handleCreateRoom}>
					<Text style={styles.modaltext}>CREER</Text>
				</Pressable>
				<Pressable
					style={[styles.modalbutton, { backgroundColor: "#E14D2A" }]}
					onPress={closeModal}
				>
					<Text style={styles.modaltext}>ANNULER</Text>
				</Pressable>
			</View>
		</View>
	);
};

export default Modal;