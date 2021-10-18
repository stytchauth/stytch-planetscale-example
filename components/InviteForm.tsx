import React from 'react';
import { Button, InputLabel, TextField } from '@material-ui/core';

type Props = {
  submit: () => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
};

const InviteForm = (props: Props) => {
  const { submit, setName, setEmail } = props;

  return (
    <form onSubmit={submit}>
      <InputLabel>Name</InputLabel>
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
        type="submit"
        style={{
          backgroundColor: '#0D4052',
          color: 'white',
        }}
        variant="contained"
        size="small"
      >
        Confirm
      </Button>
    </form>
  );
};

export default InviteForm;
