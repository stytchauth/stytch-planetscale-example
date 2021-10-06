import React, { useEffect } from 'react';
import styles from '../styles/Home.module.css';
import StytchContainer from '../components/StytchContainer';
import Notification from '../components/Notification';
import UsersTable from '../components/UsersTable';
import { User } from '../pages/api/users/';
import { ServerSideProps } from '../lib/StytchSession';
import { inviteUser } from '../lib/inviteUtils';
import { getUsers, addUser, deleteUserById, signOut } from '../lib/usersUtils';
import { useRouter } from 'next/router';

type Props = {
  token?: string;
  users?: User[];
};

var regexp = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);

const Profile = (props: Props) => {
  const { token, users } = props;
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [submitOpen, setSubmitOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [_, setUsers] = React.useState(users);

  function toggleOpenModal() {
    setOpen(!open);
  }

  function toggleSubmit() {
    setSubmitOpen(!submitOpen);
  }

  function toggleDelete() {
    setDeleteOpen(!deleteOpen);
  }

  const destroy = async () => {
    //destroy session
    const signOutResp = await signOut();

    //change url
    if (signOutResp.status == 200) router.push('/');

    return;
  };

  const submitUser = async () => {
    //if the form is empty, close the modal
    if (name == '' || email == '') {
      toggleOpenModal();
      return;
    }

    //validate email
    if (!regexp.test(email)) {
      console.error('email is invalid');
      return;
    }

    //opens popup
    toggleSubmit();

    //invite the user via stytch
    try {
      const inviteResp = await inviteUser(email);

      //log the user out if the response is 200
      if (inviteResp.status == 401) {
        destroy();
        return;
      }

      //add user to DB
      const addResp = await addUser(name, email, 'temp');

      if (addResp.status != 200) {
        console.error(addResp.error);
        return;
      }

      //add user to list and update UI
      let id = addResp.id as number;
      users?.push({ id: id, name: name, email: email } as User);
      setUsers(users);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const deleteUserResp = await deleteUserById(id);

      if (deleteUserResp.status == 401) {
        destroy();
        return;
      }

      //find and delete user
      users?.forEach((element, index) => {
        if (element.id == id) users.splice(index, 1);
      });

      //update UI
      setUsers(users);
      toggleDelete();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {token == '' ? (
        <div></div>
      ) : (
        <div id="container">
          <Notification open={submitOpen} toggle={toggleSubmit} />
          <Notification open={deleteOpen} toggle={toggleDelete} />

          <StytchContainer>
            <UsersTable
              users={users}
              setName={setName}
              setEmail={setEmail}
              deleteUser={deleteUser}
              toggle={toggleOpenModal}
              isOpen={open}
              submit={submitUser}
            />
          </StytchContainer>
          <button className={styles.primaryButton} onClick={signOut}>
            Sign out
          </button>
        </div>
      )}
    </>
  );
};

const getServerSidePropsHandler: ServerSideProps = async ({ req }) => {
  var users: User[] = await getUsers(req.cookies[process.env.COOKIE_NAME as string]);

  // Get the user's session based on the request
  return {
    props: {
      token: req.cookies[process.env.COOKIE_NAME as string] || '',
      users: users,
    },
  };
};

export const getServerSideProps = getServerSidePropsHandler;

export default Profile;
