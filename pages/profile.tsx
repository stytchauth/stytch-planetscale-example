import React, { useEffect } from 'react';
import styles from '../styles/Home.module.css';
import StytchContainer from '../components/StytchContainer';
import Notification from '../components/Notification';
import UsersTable from '../components/UsersTable';
import { User } from '../pages/api/users/';
import { ServerSideProps } from '../lib/StytchSession';
import { inviteUser } from '../lib/inviteUtils';
import { getUsers, addUser, deleteUserById, logout } from '../lib/usersUtils';
import { useRouter } from 'next/router';

type Props = {
  token?: string;
  users?: User[];
  authenticated: boolean;
};

const Profile = (props: Props) => {
  const router = useRouter();
  const { users, authenticated } = props;
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [submitOpen, setSubmitOpen] = React.useState(false); //submit alert
  const [deleteOpen, setDeleteOpen] = React.useState(false); //delete alert
  const [_, setUsers] = React.useState(users);


  useEffect(() => {
    if (!authenticated) {
      destroy()
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

  const destroy = async () => {
    //destroy session
    const logoutResp = await logout();
    const logoutJSON = await logoutResp().json()
    //change url
    if (logoutResp.status == 200) router.push('/');

    return;
  };

  const submitUser = async () => {
    //if the form is empty, close the modal
    if (name == '' || email == '') {
      toggleOpenModal();
      return;
    }

    //invite the user via stytch
    try {
      const inviteResp = await inviteUser(email);
      console.log("Invite Resp", inviteResp)
      
      if(inviteResp instanceof Error){
        console.log("instance of error")
        console.log("error")
        console.error(inviteResp)
        return;
      }

      //log the user out if the response is 200
      if (inviteResp.status == 401) {
        console.log("destroying session")
        destroy();
        return;
      }

      //add user to DB
      const addResp = await addUser(name, email, 'temp');
      console.log("Add Resp", addResp)

      if (addResp.status != 201) {
        console.error(addResp);
        return;
      }

      //add user to list and update UI
      let id = addResp.id as number;
      users?.push({ id: id, name: name, email: email } as User);
      setUsers(users);
      console.log("set users")

      //closes modal and opens popup
      toggleOpenModal();
      toggleSubmit();
      
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
    {authenticated  == false ? <div/> :
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
          <button className={styles.primaryButton} onClick={logout}>
            Sign out
          </button>
        </div>
      }
    </>
  ); 
};

const getServerSidePropsHandler: ServerSideProps = async ({ req }) => {
  var usersResp = await getUsers(req.cookies[process.env.COOKIE_NAME as string]);
  var usersJSON = await usersResp.json()
  var authenticated = true


  if (usersResp.status == 401) {
    authenticated = false
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
