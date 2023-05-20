import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';

const StyledContent = styled('div')(() => ({
	display: 'flex',
	justifyContent: 'center',
	flexDirection: 'column',

}));

const StyledRoot = styled('div')(() => ({
	width: '100%',
	margin: 'auto',
	height: '100vh',
	backgroundImage: 'url(/assets/illustrations/blob-background.svg)', // replace with the path to your background image
	backgroundRepeat: 'no-repeat',
	backgroundSize: 'cover',
}));

export default function HomePage() {
	return (
		<>
			<Helmet>
				<title> Accueil | TissApp-Admin </title>
			</Helmet>
			<StyledRoot>
				<Container>
					<StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
						<Typography variant="h3" paragraph sx={{ marginTop: 4, color: '#2065D1' }}>
							TissApp - Administrateur
						</Typography>
						<Box
							component="img"
							src="/assets/illustrations/visual-data-animate.svg"
							sx={{ height: 350, width: 450, mx: 'auto', my: { xs: 12, sm: 10 } }}
						/>
						<Button to="/login" size="large" variant="contained" component={RouterLink}>
							Connexion-Admin
						</Button>
					</StyledContent>
				</Container>
			</StyledRoot>
		</>
	);
}
