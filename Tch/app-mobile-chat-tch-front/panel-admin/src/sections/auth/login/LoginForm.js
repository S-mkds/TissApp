import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleClick = async () => {
    try {
      const user = await login(formData);
      if (user && user.admin === true) {
        navigate('/dashboard', { replace: true });
      } else {
        setErrorMessage('Seul l\'administrateur peut se connecter.');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Une erreur s\'est produite lors de la connexion.');
      }
    }
  };


  return (
    <>

      <Stack spacing={3}>
        <TextField
          name="email"
          label="Adresse Email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          name="password"
          label="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Mot de passe oublié?
        </Link>
      </Stack>
      {
        errorMessage && (
          <Alert severity="error" sx={{ marginBottom: 2 }} onClose={() => setErrorMessage(null)}>
            {errorMessage}
          </Alert>
        )
      }
      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Se connecter
      </LoadingButton>
    </>
  );
}
