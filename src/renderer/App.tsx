import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Searchbar from './Searchbar';
import FullFeaturedCrudGrid from './Grid';
import { ColData } from './types';

export default function App() {
  const [nameFilter, setNameFilter] = useState('');
  const [descriptionFilter, setDescriptionFilter] = useState('');
  const [remarksFilter, setRemarksFilter] = useState('');
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

  function cStr(value1: string, value2: string) {
    return value1.toUpperCase().includes(value2.toUpperCase());
  }

  function filter(name: string, description: string, remarks: string) {
    const newRows = origData.filter((value: ColData) => {
      const result =
        cStr(value.name, name) &&
        cStr(value.description, description) &&
        cStr(value.remarks, remarks);
      return result;
    });
    setRows(newRows);
  }

  function setName(value: string) {
    setNameFilter(value);
    filter(value, descriptionFilter, remarksFilter);
  }

  function setDescription(value: string) {
    setDescriptionFilter(value);
    filter(nameFilter, value, remarksFilter);
  }

  function setRemarks(value: string) {
    setRemarksFilter(value);
    filter(nameFilter, descriptionFilter, value);
  }

  return (
    <Box
      sx={{
        height: 900,
        width: '100%',
      }}
    >
      <Searchbar
        setNameQuery={() => setName}
        setDescriptionQuery={() => setDescription}
        setRemarksQuery={() => setRemarks}
      />
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
