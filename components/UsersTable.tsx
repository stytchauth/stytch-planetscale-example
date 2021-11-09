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
  DialogContent,
  DialogTitle,
  IconButton,
} from '@material-ui/core';
import { User } from '../pages/api/users/';
import AddIcon from '@material-ui/icons/AddRounded';
import Dialog from '@mui/material/Dialog';
import styles from '../styles/Home.module.css';
import InviteForm from './InviteForm';

type Props = {
  users: User[] | undefined;
  deleteUser: (id: number) => void;
  toggle: () => void;
  isOpen: boolean;
  submitUser: () => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
};

const UsersTable = (props: Props) => {
  const { users, toggle, isOpen, submitUser, setName, setEmail, deleteUser } = props;
  return (
    <TableContainer className={styles.table}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Name</b>
            </TableCell>
            <TableCell>
              <b>Email</b>
            </TableCell>
            <TableCell> </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users != null ? (
            users.map((user) => (
              <TableRow key={user.id} id={user.id} className={styles.row}>
                <TableCell className={styles.cell}> {user.name} </TableCell>
                <TableCell> {user.email} </TableCell>
                <TableCell className={styles.cell}>
                  <IconButton color="secondary" onClick={() => deleteUser(user.id)}>
                    <CloseIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <div />
          )}

          <TableRow>
            <TableFooter>
              <Button className={styles.submitBtn} startIcon={<AddIcon />} onClick={toggle} size="small">
                Invite
              </Button>
            </TableFooter>
            <Dialog open={isOpen} onClose={toggle}>
              <DialogTitle>Invite</DialogTitle>
              <DialogContent className={styles.inviteForm}>
                <InviteForm
                  setName={setName}
                  setEmail={setEmail}
                  submit={submitUser}
                />
              </DialogContent>
            </Dialog>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersTable;
