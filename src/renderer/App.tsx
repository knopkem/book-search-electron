import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import FullFeaturedCrudGrid from './Grid';
import SettingsDialog from './Settings';

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

export default function App() {
  const [origData, setOrigData] = useState([]);
  const [rows, setRows] = useState(origData);
  const [message, setMessage] = useState('Unknown Error');
  const [open, setOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

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

  const handleSettingsClose = () => {
    setOpenSettings(false);
  };

  const handleSettingsSave = (data) => {
    window.electron.ipcRenderer.sendMessage('save-settings', data);
    setOpenSettings(false);
  };


  React.useEffect(() => {
    window.electron.ipcRenderer
      .invokeMessage('get-data', [])
      .then((data) => {
        setOrigData(data);
        setRows(data);
        return data;
      })
      .catch((e) => {
        showMessage(e.message);
      });
  }, []);

  window.electron.ipcRenderer.on('open-settings',() => {
    setOpenSettings(true);
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          height: 920,
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
      <SettingsDialog open={openSettings} handleClose={handleSettingsClose} handleOk={handleSettingsSave} />
      </Box>
    </ThemeProvider>
  );
}
