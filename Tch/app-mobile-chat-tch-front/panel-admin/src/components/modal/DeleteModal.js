import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Components
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Alert from '@mui/material/Alert';

// Hooks
import { useSnackbar } from 'notistack';
import useAuth from '../../hooks/useAuth';

// Transition component for the dialog
const Transition = React.forwardRef((props, ref) => (
	<Slide direction="up" ref={ref} {...props} />
));

// DeleteModal component
export default function DeleteModal({ id, userName, onUserDeleteSuccess }) {
	const [open, setOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const [showDeleteButton, setShowDeleteButton] = useState(false);


	const { handleDestroyUser } = useAuth();
	const { enqueueSnackbar } = useSnackbar();

	// Handle open state of the modal
	const handleClickOpen = () => {
		setOpen(true);
	};

	// Handle close state of the modal
	const handleClose = () => {
		setOpen(false);
	};

	// Handle user deletion
	const handleDelete = async () => {
		const result = await handleDestroyUser(id);
		handleClose();

		if (result.error) {
			enqueueSnackbar("Erreur lors de la suppression de l'utilisateur", {
				variant: 'error',
			});
			
		} else {
			enqueueSnackbar(`L'utilisateur ${userName} a été supprimé avec succès`, {
				variant: 'success',
			});
			if (typeof onUserDeleteSuccess === 'function') {
				onUserDeleteSuccess(userName);
			}
		}
	};

	// Render DeleteModal component
	return (
		<div>
			<Button color="error" variant="text" onClick={handleClickOpen}>
				Supprimer
			</Button>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
			>
				<DialogTitle>{"Supprimer un utilisateur"}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						Etes-vous sûr de vouloir supprimer <strong>{userName}</strong>?
					</DialogContentText>
				</DialogContent>
				{errorMessage && (
					<Alert severity="error" onClose={() => setErrorMessage(null)}>
						{errorMessage}
					</Alert>
				)}
				<DialogActions>
					<Button onClick={handleClose}>Annuler</Button>
					{!showDeleteButton ? (
						<Button color="primary" onClick={() => setShowDeleteButton(true)}>
							Oui
						</Button>
					) : (
						<Button color="error" onClick={handleDelete}>
							Supprimer
						</Button>
					)}
				</DialogActions>
			</Dialog>
		</div>
	);
}

DeleteModal.propTypes = {
	id: PropTypes.number.isRequired,
	userName: PropTypes.string.isRequired,
	onUserDeleteSuccess: PropTypes.func,
};
