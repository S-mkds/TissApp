import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Container,
  Stack,
  Typography,
  TablePagination,
  Input,
  InputAdornment,
} from '@mui/material';
import EditSelectedUser from '../components/modal/EditSelectedUser';
import DeleteModal from '../components/modal/DeleteModal';
import AddUserModal from '../components/modal/AddUserModal';
import Scrollbar from '../components/scrollbar';
import useAuth from '../hooks/useAuth';
import Iconify from '../components/iconify';

const UsersPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const { users, handleAllUsers } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    handleAllUsers();
  }, [handleAllUsers]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageLoaded(false);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Helmet>
        <title> Utilisateurs | TissApp </title>
      </Helmet>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Utilisateurs ({users.length})
        </Typography>
        <AddUserModal />
      </Stack>
      <Stack direction="row" alignItems="center" mb={2}>
        <Input
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Recherche..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
          sx={{ width: 200 }}
        />
      </Stack>
      <Scrollbar>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Avatar</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Prénom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Créé le</TableCell>
                <TableCell>Modifié le</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>
                      <Avatar
                        src={user.imageUrl || null}
                        alt={`${user.firstName} ${user.lastName}`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      >
                        {!imageLoaded && `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
                      </Avatar>
                    </TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.admin ? (
                        <span style={{ color: 'green' }}>Admin</span>
                      ) : (
                        'Utilisateur'
                      )}
                    </TableCell>
                    <TableCell>
                      {user.status === 'online' ? (
                        <span style={{ color: 'green' }}>En ligne</span>
                      ) : (
                        <span style={{ color: 'red' }}>Hors ligne</span>
                      )}
                    </TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell>{user.updatedAt}</TableCell>
                    <TableCell>
                      <EditSelectedUser
                        selectedUser={user}
                        userName={`${user.firstName} ${user.lastName}`}
                        onUserUpdateSuccess={() => {
                          // Code à exécuter lorsqu'une mise à jour d'utilisateur est réussie
                        }}
                      />
                      <DeleteModal id={user.id} userName={`${user.firstName} ${user.lastName}`} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page:"
        />
      </Scrollbar>
    </Container>
  );
};

export default UsersPage;
