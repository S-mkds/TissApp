import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Container, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import AddPostModal from '../components/modal/AddPostModal';
import DeleteMessageModal from '../components/modal/DeleteMessageModal';

import useAuth from '../hooks/useAuth';

export default function ChatPage() {
  const { messages, handlePosts } = useAuth();

  useEffect(() => {
    handlePosts();
  }, [handlePosts]);

  return (
    <>
      <Helmet>
        <title> Dashboard: Chat | TissApp </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Chat ({messages.length})
          </Typography>
          <AddPostModal />
        </Stack>
        <MessageTable messages={messages} />
      </Container>
    </>
  );
}

function MessageTable({ messages }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageLoaded(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Avatar</TableCell>
            <TableCell>Nom & prenom</TableCell>
            <TableCell>Messages envoyés</TableCell>
            <TableCell>Date d'envoie</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {messages
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((message) => (
              <TableRow key={message.id}>
                <TableCell>
                  <Avatar
                    src={message.imageUrl || null}
                    alt={`${message.User.firstName} ${message.User.lastName}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  >
                    {!imageLoaded && `${message.User.firstName.charAt(0)}${message.User.lastName.charAt(0)}`}
                  </Avatar>
                </TableCell>
                <TableCell>{message.User.firstName} {message.User.lastName}</TableCell>
                <TableCell>
                  {message.content}
                  {message.imageUrl && (
                    <img
                      src={message.imageUrl}
                      alt="message"
                      style={{ width: '50px', height: '50px', marginLeft: '10px' }}
                    />
                  )}
                </TableCell>
                <TableCell>{message.createdAt}</TableCell>
                <TableCell>
                  <DeleteMessageModal postId={message.id} userName={`${message.User.firstName} ${message.User.lastName}`} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={messages.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Lignes par page:"
      />
    </TableContainer>
  );
}

MessageTable.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      User: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
      }).isRequired,
      content: PropTypes.string,
      imageUrl: PropTypes.string,
      createdAt: PropTypes.string.isRequired,
    })
  ).isRequired,
};
