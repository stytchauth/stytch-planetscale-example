import React, { useEffect } from 'react';
import styles from '../styles/Home.module.css';
import StytchContainer from '../components/StytchContainer';
import Notification from '../components/Notification';
import UsersTable from '../components/UsersTable';
import { User } from '../pages/api/users/';
import { ServerSideProps } from '../lib/StytchSession';
import { inviteUser, isValidEmail } from '../lib/inviteUtils';
import { getUsers, addUser, deleteUserById, logout } from '../lib/usersUtils';
import { useRouter } from 'next/router';

type Props = {
  token?: string;
  users?: User[];
  authenticated: boolean;
};

const Profile = (props: Props) => {
  const { users, authenticated } = props;
  const router = useRouter();
  const [openInviteModal, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [openSubmitAlert, setSubmitAlert] = React.useState(false);
  const [openDeleteAlert, setDeleteAlert] = React.useState(false);
  const [usersState, setUsers] = React.useState(users);
  const [auth, setAuthenticated] = React.useState(authenticated);

  useEffect(() => {
    if (!authenticated) {
      destroy();
      router.replace('/');
    }
  });

  function toggleInviteModal() {
    setOpen(!openInviteModal);
  }

  function toggleSubmitAlert() {
    setSubmitAlert(!openSubmitAlert);
  }

  function toggleDelete() {
    setDeleteAlert(!openDeleteAlert);
  }

  // removes any client-side user state
  const destroy = async () => {
    //destroy session
    const logoutResp = await logout();
    setAuthenticated(false);
    //change url
    if (logoutResp.status === 200) router.push('/');
    return;
  };

  const submitUser = async () => {
    //if the form is empty, close the modal
    if (name === '' || email === '') {
      toggleInviteModal();
      return;
    }

    //invite the user via stytch
    try {
      if (!isValidEmail(email)) {
        throw new Error('email format is invalid');
      }

      //closes modal and opens popup
      toggleInviteModal();
      toggleSubmitAlert();

      const inviteResp = await inviteUser(email);
      //log the user out if the response is 200
      if (inviteResp.status === 401) {
        console.log('destroying session');
        destroy();
        return;
      }

      //add user to DB
      const addResp = await addUser(name, email, 'temp');
      if (addResp.status != 201) {
        console.error(addResp);
        return;
      }

      //add user to list and update UI
      let id = addResp.id as number;
      users?.push({ id: id, name: name, email: email } as User);
      setUsers(users);
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const deleteUserResp = await deleteUserById(id);

      if (deleteUserResp.status === 401) {
        destroy();
        return;
      }

      //find and delete user
      users?.forEach((element, index) => {
        if (element.id === id) users.splice(index, 1);
      });

      //update UI
      setUsers(users);
      toggleDelete();
    } catch (error) {
      console.error(error);
      return;
    }
  };

  return (
    <>
      {authenticated == false ? (
        <div />
      ) : (
        <div id="container">
          <Notification open={openSubmitAlert} toggle={toggleSubmitAlert} />
          <Notification open={openDeleteAlert} toggle={toggleDelete} />

          <StytchContainer>
            <UsersTable
              users={users}
              setName={setName}
              setEmail={setEmail}
              deleteUser={deleteUser}
              toggle={toggleInviteModal}
              isOpen={openInviteModal}
              submit={submitUser}
            />
          </StytchContainer>
          <button className={styles.primaryButton} onClick={logout}>
            Sign out
          </button>
        </div>
      )}
    </>
  );
};

const getServerSidePropsHandler: ServerSideProps = async ({ req }) => {
  var usersResp = await getUsers(req.cookies[process.env.COOKIE_NAME as string]);
  var usersJSON = await usersResp.json();
  var authenticated = true;

  if (usersResp.status === 401) {
    authenticated = false;
  }

  return {
    props: {
      token: req.cookies[process.env.COOKIE_NAME as string] || '',
      users: usersJSON,
      authenticated: authenticated,
    },
  };
};

export const getServerSideProps = getServerSidePropsHandler;

export default Profile;
