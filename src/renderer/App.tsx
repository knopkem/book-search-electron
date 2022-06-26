import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import FullFeaturedCrudGrid from './Grid';

export default function App() {
  const [origData, setOrigData] = useState([]);
  const [rows, setRows] = useState(origData);
  const [message, setMessage] = useState('Unknown Error');
  const [open, setOpen] = useState(false);

  const showMessage = (_message: string) => {
    setMessage(_message);
    setOpen(true);
  };

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  React.useEffect(() => {
    window.electron.ipcRenderer
      .invokeMessage('ipc-example', ['read'])
      .then((data) => {
        setOrigData(data);
        setRows(data);
        return data;
      })
      .catch((e) => {
        showMessage(e.message);
      });
  }, []);

  return (
    <Box
      sx={{
        height: 900,
        width: '100%',
      }}
    >
      <FullFeaturedCrudGrid rowData={rows} />
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
      />
    </Box>
  );
}
