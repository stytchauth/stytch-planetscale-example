import React, { useEffect } from 'react';
import styles from '../styles/Home.module.css';
import StytchContainer from '../components/StytchContainer';
import Notification from '../components/Notification';
import UsersTable from '../components/UsersTable';
import { User } from '../pages/api/users/';
import { ServerSideProps } from '../lib/StytchSession';
import { inviteUser } from '../lib/inviteUtils';
import { getUsers, addUser, deleteUserById } from '../lib/usersUtils';
import { useRouter } from 'next/router';

type Props = {
  token?: string;
  users?: User[];
};

var regexp = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);

// const users = async (): Promise<User[]> => { return getUsers()};

const Profile = (props: Props) => {
  const { token, users } = props;
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [submitOpen, setSubmitOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [usersState, setUsers] = React.useState(users);
  useEffect(() => {
    if (!token) {
      router.replace('/');
    }
  });

  function toggleOpenModal() {
    setOpen(!open);
  }

  function toggleSubmit() {
    setSubmitOpen(!submitOpen);
  }

  function toggleDelete() {
    setDeleteOpen(!deleteOpen);
  }

  function submitUser() {
    //do nothing if empty
    if (name == '' || email == '') {
      toggleOpenModal();
      return;
    }

    //close modal
    toggleOpenModal();

    //validate email
    if (regexp.test(email)) {
      //invite the user via stytch
      inviteUser(email)
        .then((resp) => {
          console.log(resp);
          if (resp.status == 401) {
            router.push('/');
          }
          //add user to table
          addUser(name, email, 'temp')
            .then((resp) => {
              console.log(resp);
              if (resp.status == 401) {
                router.push('/');
              }

              let id = resp.id as number;
              usersState?.push({ id: id, name: name, email: email } as User);
              setUsers(users);
              //opens popup
              toggleSubmit();
            })
            .catch((error) => {
              console.error('unable to add user');
            });
        })
        .catch((error) => {
          console.error('unable to invite user');
          console.log(error)
        });
    } else {
      console.error('email is invalid');
    }
  }

  function deleteUser(id: number) {
    //remove user fromt the DB
    deleteUserById(id).then((resp) => {
      if (resp.status == 401) {
        router.push('/');
      }
    });

    //remove user from the list
    usersState?.forEach((element, index) => {
      if (element.id == id) usersState.splice(index, 1);
    });

    setUsers(usersState);
    toggleDelete();
  }

  const signOut = async () => {
    const resp = await fetch('/api/logout', { method: 'POST' });
    if (resp.status === 200) {
      router.push('/');
    }
  };

  return (
    <>
      {!token ? (
        <div></div>
      ) : (
        <div id="container">
          <Notification open={submitOpen} toggle={toggleSubmit} />
          <Notification open={deleteOpen} toggle={toggleDelete} />

          <StytchContainer>
            <UsersTable
              users={usersState}
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
  var temp: User[] = []
  var users: User[] = await getUsers(req.cookies[process.env.COOKIE_NAME as string]);

  if(users.length == 0 ) {
    users = []
  }

  // Get the user's session based on the request
  return {
    props: {
      token: req.cookies[process.env.COOKIE_NAME as string] || '',
      users: temp,
    },
  };
};

export const getServerSideProps = getServerSidePropsHandler;

export default Profile;
