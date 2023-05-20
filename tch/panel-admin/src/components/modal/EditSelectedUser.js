import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSnackbar } from 'notistack';
import useAuth from '../../hooks/useAuth';

export default function EditSelectedUser({ selectedUser, onUserUpdateSuccess, userName }) {
	const [open, setOpen] = useState(false);
	const [firstName, setFirstName] = useState(selectedUser.firstName);
	const [lastName, setLastName] = useState(selectedUser.lastName);
	const [email, setEmail] = useState(selectedUser.email);

	const { handleAllUpdateUser } = useAuth();

	const { enqueueSnackbar } = useSnackbar();
	// On ajoute un effet pour mettre à jour les champs du formulaire lorsque l'utilisateur sélectionné change
	useEffect(() => {
		if (selectedUser) {
			setFirstName(selectedUser.firstName);
			setLastName(selectedUser.lastName);
			setEmail(selectedUser.email);
		}
	}, [selectedUser]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const updatedUser = {
			id: selectedUser.id,
			firstName,
			lastName,
			email,
		};
		const result = await handleAllUpdateUser(selectedUser.id, updatedUser);
		handleClose();

		if (result.error) {
			enqueueSnackbar("Erreur lors de la mise à jour de l'utilisateur", {
				variant: 'error',
			});
		} else {
			enqueueSnackbar(`L'utilisateur ${firstName} ${lastName} a été mis à jour avec succès`, {
				variant: 'success',
			});
			if (typeof onUserUpdateSuccess === 'function') {
				onUserUpdateSuccess(`${firstName} ${lastName}`);
			}
		}
	};

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Button variant="text" onClick={handleClickOpen}>
				Modifier
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Modifier</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Etes-vous sûr de vouloir modifier les informations de <strong>{userName}</strong>?
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						label="Prénom"
						type="text"
						fullWidth
						variant="standard"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
					/>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Nom"
						type="text"
						fullWidth
						variant="standard"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
					/>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Adresse email"
						type="email"
						fullWidth
						variant="standard"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Annuler</Button>
					<Button onClick={handleSubmit}>Enregistrer</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

EditSelectedUser.propTypes = {
	selectedUser: PropTypes.shape({
		id: PropTypes.number.isRequired,
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
	}).isRequired,
	onUserUpdateSuccess: PropTypes.func.isRequired,
	userName: PropTypes.string.isRequired,
};

