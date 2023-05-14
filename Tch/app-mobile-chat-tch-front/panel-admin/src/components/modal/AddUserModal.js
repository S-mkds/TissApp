import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// Composant de notification
import { useSnackbar } from 'notistack';
import useAuth from '../../hooks/useAuth';
import Iconify from '../iconify';


export default function AddUserModal() {
	const [open, setOpen] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('')

	const { enqueueSnackbar } = useSnackbar();

	const { handleCreateUser } = useAuth();
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handlePasswordToggle = () => {
		setShowPassword(!showPassword);
	};

	const handleSubmit = async () => {
		if (password !== confirmPassword) {
			enqueueSnackbar("Les mots de passe ne correspondent pas", { variant: "error" });
			return;
		}

		try {
			const response = await handleCreateUser({
				firstName,
				lastName,
				email,
				password,
			});

			if (response.error) {
				enqueueSnackbar(response.error, { variant: "error" });
			} else {
				enqueueSnackbar("Utilisateur créé avec succès", { variant: "success" });
				handleClose();
			}
		} catch (error) {
			enqueueSnackbar("Erreur lors de la création de l'utilisateur", { variant: "error" });
		}
	};

	return (
		<div>
			<Button variant="contained" onClick={handleClickOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
				Ajouter
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Créer un utilisateur</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Etes-vous sûr de vouloir créer un utilisateur?
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
					<TextField
						autoFocus
						margin="dense"
						label="Mot de passe"
						type={showPassword ? 'text' : 'password'}
						fullWidth
						variant="standard"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						InputProps={{
							endAdornment: (
								<Iconify
									icon={showPassword ? ' eva:eye-outline' : 'eva:eye-off-outline'}
									onClick={handlePasswordToggle}
									style={{ cursor: 'pointer' }}
								/>
							),
						}}
					/>
					<TextField
						autoFocus
						margin="dense"
						label="Confirmer votre mot de passe"
						type={showPassword ? 'text' : 'password'}
						fullWidth
						variant="standard"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						InputProps={{
							endAdornment: (
								<Iconify
									icon={showPassword ? ' eva:eye-outline' : 'eva:eye-off-outline'}
									onClick={handlePasswordToggle}
									style={{ cursor: 'pointer' }}
								/>
							),
						}}
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
