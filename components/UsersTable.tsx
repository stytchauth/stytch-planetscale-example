import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  TableFooter,
  TableContainer,
  InputLabel,
  TextField,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@material-ui/core';
import { User } from '../pages/api/users/';
import AddIcon from '@material-ui/icons/AddRounded';
import Dialog from '@mui/material/Dialog';
import styles from '../styles/Home.module.css';

type Props = {
  users: User[];
  deleteUser: (id: number) => void;
  toggle: () => void;
  isOpen: boolean;
  submit: () => void;
  setName: (name: string) => void;
  setEmail: (name: string) => void;
};

const UsersTable = (props: Props) => {
  const { users, toggle, isOpen, submit, setName, setEmail, deleteUser } = props;

  return (
    <TableContainer >
    <Table stickyHeader className={styles.table} >
      <TableHead>
        <TableRow >
          <TableCell>
            {' '}
            <b>Name </b>
          </TableCell>
          <TableCell>
            <b> Email </b>{' '}
          </TableCell>
          <TableCell> </TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {
       users != null ? (users.map((user) => (
          <TableRow key={user.id} id={user.id} className={styles.row}>
            {' '}
            <TableCell className={styles.cell}> {user.name} </TableCell> <TableCell> {user.email} </TableCell>{' '}
            <TableCell className={styles.cell}>
              <IconButton color="secondary" onClick={() => deleteUser(user.id)}>
                <CloseIcon />
              </IconButton>{' '}
            </TableCell>{' '}
          </TableRow>
        ))) :(<div/>)
         }

        <TableRow>
        <TableFooter style={{
                position: "absolute",
              }} > 
              <Button className={styles.submitBtn} startIcon={<AddIcon />} onClick={toggle} size="small">
            Invite
          </Button>
              </TableFooter>
          <Dialog open={isOpen} onClose={toggle}>
            <DialogTitle>{`Invite`}</DialogTitle>
            <DialogContent>
              <InputLabel> Name</InputLabel>
              <TextField
                autoFocus
                margin="dense"
                placeholder="Ada Lovelace"
                variant="standard"
                size="small"
                onChange={(e) => setName(e.target.value)}
              />
              <InputLabel>Email</InputLabel>
              <TextField
                autoFocus
                margin="dense"
                placeholder="ada@lovelace.com"
                variant="standard"
                size="small"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                onClick={submit}
                style={{
                  backgroundColor: '#0D4052',
                  color: 'white',
                }}
                variant="contained"
                size="small"
              >
                Confirm
              </Button>
            </DialogContent>
          </Dialog>
        </TableRow>

      </TableBody>

    </Table>

    </TableContainer>
  );
};

export default UsersTable;
