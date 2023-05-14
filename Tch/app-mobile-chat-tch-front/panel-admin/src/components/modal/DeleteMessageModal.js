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
import usePost from '../../hooks/usePost';

// Transition component for the dialog
const Transition = React.forwardRef((props, ref) => (
	<Slide direction="up" ref={ref} {...props} />
));

// DeleteModal component
export default function DeleteMessageModal({ postId, userName, onPostDeleteSuccess }) {
	const [open, setOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const [showDeleteButton, setShowDeleteButton] = useState(false);

	const { handleDeletePost } = usePost();
	const { enqueueSnackbar } = useSnackbar();

	// Handle open state of the modal
	const handleClickOpen = () => {
		setOpen(true);
	};

	// Handle close state of the modal
	const handleClose = () => {
		setOpen(false);
	};

	// Handle post deletion
	const handleDelete = async () => {
		const result = await handleDeletePost(postId);
		handleClose();

		if (result.error) {
			enqueueSnackbar("Erreur lors de la suppression du message", {
				variant: 'error',
			});

		} else {
			enqueueSnackbar(`Le message de ${userName} a été supprimé avec succès`, {
				variant: 'success',
			});
			if (typeof onPostDeleteSuccess === 'function') {
				onPostDeleteSuccess(userName);
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
				<DialogTitle>{"Supprimer un message"}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						Etes-vous sûr de vouloir supprimer le message de <strong>{userName}</strong>?
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

DeleteMessageModal.propTypes = {
	postId: PropTypes.number.isRequired,
	userName: PropTypes.string.isRequired,
	onPostDeleteSuccess: PropTypes.func,
};
