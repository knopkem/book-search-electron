import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';

interface AlertProps {
 open: boolean;
 handleClose: any;
 handleOk: any;
}

export default function SettingsDialog({ open, handleClose, handleOk }: AlertProps) {

  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    window.electron.ipcRenderer
      .invokeMessage('read-settings', [])
      .then((data) => {
        console.log(data);
        if (data.url) setUrl(data.url);
        if (data.token) setToken(data.token);
        return data;
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleSettingsSave = () => {
    handleOk({ url, token });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Settings
      </DialogTitle>
      <DialogContent>
      <DialogContentText>
            To enable cloud synchronization fill in the form below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="url"
            label="Cloud Storage URL"
            type="url"
            fullWidth
            value={url}
            variant="standard"
            onChange={e => {
              setUrl(e.target.value)
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="token"
            label="Access Token"
            type="password"
            value={token}
            fullWidth
            variant="standard"
            onChange={e => {
              setToken(e.target.value)
            }}
          />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>cancel</Button>
        <Button onClick={handleSettingsSave} autoFocus>
          save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
