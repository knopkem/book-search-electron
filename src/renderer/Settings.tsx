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
  const [errorUrl, setErrorUrl] = useState(false);
  const [errorToken, setErrorToken] = useState(false);


  useEffect(() => {
    window.electron.ipcRenderer
      .invokeMessage('read-settings', [])
      .then((data) => {
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
            error={errorUrl}
            id="url"
            label="Cloud Storage URL"
            type="url"
            fullWidth
            value={url}
            variant="standard"
            helperText="invalid url"
            onChange={e => {
              const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
              const regex = new RegExp(expression);
              setErrorUrl(!e.target.value.match(regex));
              if (e.target.value.includes('localhost') || e.target.value.includes('127.0.0.1')) {
                setErrorUrl(false);
              }
              if (e.target.value === '') setErrorUrl(false);
              setUrl(e.target.value);
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
            error={errorToken}
            required={url !== ''}
            helperText='access token required'
            onChange={e => {
              setErrorToken(url !== '' && e.target.value === '');
              setToken(e.target.value)
            }}
          />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>cancel</Button>
        <Button onClick={handleSettingsSave} autoFocus disabled={errorUrl || errorToken || (url !== '' && token === '')}>
          save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
