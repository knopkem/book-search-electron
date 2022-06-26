import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Searchbar from './Searchbar';
import FullFeaturedCrudGrid from './Grid';

interface ColData {
  col1: string;
  col2: string;
  col3: string;
}

export default function App() {
  const [nameFilter, setNameFilter] = useState('');
  const [descriptionFilter, setDescriptionFilter] = useState('');
  const [remarksFilter, setRemarksFilter] = useState('');
  const [origData, setOrigData] = useState([]);
  const [rows, setRows] = useState(origData);

  React.useEffect(() => {
    window.electron.ipcRenderer
      .invokeMessage('ipc-example', ['read'])
      .then((data) => {
        setOrigData(data);
        setRows(data);
        return data;
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  function cStr(value1: string, value2: string) {
    return value1.toUpperCase().includes(value2.toUpperCase());
  }

  function filter(name: string, description: string, remarks: string) {
    const newRows = origData.filter((value: ColData) => {
      const result =
        cStr(value.col1, name) &&
        cStr(value.col2, description) &&
        cStr(value.col3, remarks);
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
    </Box>
  );
}
