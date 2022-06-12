import { useState }  from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Searchbar from './Searchbar';


const data = [
  { id: 1, col1: 'Hello', col2: 'World', col3: "test" },
  { id: 2, col1: 'DataGridPro', col2: 'is Awesome', col3: "test" },
  { id: 3, col1: 'MUI', col2: 'is Amazing', col3: "test" },
];

const columns = [
  { field: 'col1', headerName: 'Name', editable: true, flex: 1 },
  { field: 'col2', headerName: 'Description', editable: true, flex: 1 },
  { field: 'col3', headerName: 'Remarks', editable: true, flex: 1 },
];


export default function App() {

  const [nameFilter, setNameFilter] = useState('');
  const [descriptionFilter, setDescriptionFilter] = useState('');
  const [remarksFilter, setRemarksFilter] = useState('');
  const [origData, setOrigData] = useState(data);
  const [rows, setRows] = useState(origData);

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

  function cStr(value1: string, value2: string) {
    return value1.toUpperCase().includes(value2.toUpperCase());
  }

  function filter(name: string, description: string, remarks: string) {
    const newRows = origData.filter(value => {

      const result = cStr(value.col1, name) && cStr(value.col2, description) && cStr(value.col3, remarks);
      return result;
    });
    setRows(newRows);
  }

  return (
    <div style={{ height: 900, width: '100%' }}>
      <Searchbar setNameQuery={setName} setDescriptionQuery={setDescription} setRemarksQuery={setRemarks} ></Searchbar>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
