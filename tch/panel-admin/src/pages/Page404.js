import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Container, Box } from '@mui/material';

// ----------------------------------------------------------------------

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  Height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

const StyledRoot = styled('div')(() => ({
  width: '100%',
  margin: 'auto',
  height: '100vh',
  backgroundImage: 'url(/assets/illustrations/blob-background.svg)', // replace with the path to your background image
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
}));
// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <>
      <Helmet>
        <title> 404 Page Not Found | TissApp </title>
      </Helmet>
      <StyledRoot>
      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Box
            component="img"
            src="/assets/illustrations/404-error-with-people-holding-the-numbers-animate.svg"
            sx={{ height: 500, width: 500, mx: 'auto' }}
          />
          <Button
            to="/"
            size="large"
            variant="contained"
            component={RouterLink}
          >
            Accueil
          </Button>
        </StyledContent>
      </Container>
      </StyledRoot>
    </>
  );
}
