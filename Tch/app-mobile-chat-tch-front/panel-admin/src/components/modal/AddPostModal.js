import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useSnackbar } from 'notistack';
import Iconify from '../iconify';
import usePost from '../../hooks/usePost';


export default function AddPostModal() {
	const [open, setOpen] = useState(false);
	const [content, setContent] = useState('');
	const [imageUrl, setImageUrl] = useState(null);
	const [fileName, setFileName] = useState('');

	const { sendPost } = usePost();
	const { enqueueSnackbar } = useSnackbar();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleImageChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			setImageUrl(e.target.files[0]);
			setFileName(e.target.files[0].name);
		}
	};

	const handleSubmit = async () => {
		if (content.trim() === '') {
			enqueueSnackbar('Le message ne peut pas être vide', { variant: 'error' });
			return;
		}

		const formData = new FormData();
		formData.append('content', content);
		if (imageUrl) {
			formData.append('imageUrl', imageUrl);
		}

		try {
			const response = await sendPost(formData);

			if (response.error) {
				enqueueSnackbar('Erreur lors de l\'envoi du message', { variant: 'error' });
			} else {
				enqueueSnackbar('Message envoyé avec succès', { variant: 'success' });
				setContent('');
				setImageUrl(null);
				setFileName('');
				handleClose();
			}
		} catch (error) {
			enqueueSnackbar('Erreur lors de l\'envoi du message', { variant: 'error' });
		}
	};


	return (
		<div>
			<Button variant="contained" onClick={handleClickOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
				Message
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<div>Message</div>
					<Iconify onClick={handleClose} icon="eva:close-fill" color="gray" cursor="pointer" />
				</DialogTitle>
				<DialogContent>
					<TextField
						id="filled-multiline-static"
						label="Message"
						multiline
						rows={4}
						variant="filled"
						value={content}
						onChange={(e) => setContent(e.target.value)}
					/>
				</DialogContent>
				<DialogActions >
					<div style={{ marginRight: 'auto' }}>
						<Button variant="text" component="label">
							Télécharger
							<input hidden accept="image/*" multiple type="file" onChange={handleImageChange} />
						</Button>
						{fileName && <span>{fileName}</span>}
					</div>
					<div style={{ marginLeft: 'auto' }}>
						<Button onClick={handleSubmit}>Envoyer</Button>
					</div>
				</DialogActions>
			</Dialog>
		</div>
	);
}