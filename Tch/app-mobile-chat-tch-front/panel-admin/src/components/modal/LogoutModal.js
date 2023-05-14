import * as React from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Alert from '@mui/material/Alert';

// Hooks
import useAuth from '../../hooks/useAuth';
import Iconify from '../iconify';

const Transition = React.forwardRef((props, ref) => (
	<Slide direction="up" ref={ref} {...props} />
));

export default function LogoutModal() {
	const [open, setOpen] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState(null);
	const { logout } = useAuth();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			handleClose();
			navigate('/login');
		} catch (error) {
			setErrorMessage('Une erreur s\'est produite lors de la déconnexion.');
		}
	};

	return (
		<div>
			<MenuItem variant="text" onClick={handleClickOpen}>
				<Iconify icon="eva:log-out-outline" />Deconnexion
			</MenuItem>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
			>
				<DialogTitle>{"Deconnexion"}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						Etes-vous sûr de vouloir vous deconnecter?
					</DialogContentText>
				</DialogContent>
				{
					errorMessage && (
						<Alert severity="error" onClose={() => setErrorMessage(null)}>
							{errorMessage}
						</Alert>
					)
				}
				<DialogActions>
					<Button onClick={handleClose}>Annuler</Button>
					<Button onClick={handleLogout}>Se deconnecter</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
