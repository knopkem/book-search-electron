import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddBox from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';
import { ColData } from './types';
import AlertBox from './AlertBox';

function EditToolbar(props) {
  const { fullRows, setRows, setFullRows, setRowModesModel } = props;

  const [nameFilter, setNameFilter] = useState('');
  const [descriptionFilter, setDescriptionFilter] = useState('');
  const [remarksFilter, setRemarksFilter] = useState('');

  const addNewRow = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      { id, name: '', description: '', remarks: '', isNew: true },
    ]);
    setFullRows((oldRows) => [
      ...oldRows,
      { id, name: '', age: '', isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  function cStr(value1: string, value2: string) {
    return value1.toUpperCase().includes(value2.toUpperCase());
  }

  function filter(name: string, description: string, remarks: string) {
    const newRows = fullRows.filter((value: ColData) => {
      const result =
        cStr(value.name, name) &&
        cStr(value.description, description) &&
        cStr(value.remarks, remarks);
      return result;
    });
    setRows(newRows);
  }

  function setNameQuery(value: string) {
    setNameFilter(value);
    filter(value, descriptionFilter, remarksFilter);
  }

  function setDescriptionQuery(value: string) {
    setDescriptionFilter(value);
    filter(nameFilter, value, remarksFilter);
  }

  function setRemarksQuery(value: string) {
    setRemarksFilter(value);
    filter(nameFilter, descriptionFilter, value);
  }
  return (
    <GridToolbarContainer sx={{ padding: 2 }}>
      <TextField
        id="name-field"
        className="text"
        onInput={(e) => {
          setNameQuery((e.target as HTMLTextAreaElement).value);
        }}
        label="Author search"
        variant="outlined"
        placeholder="Search..."
        size="small"
      />
      <TextField
        id="description-field"
        className="text"
        onInput={(e) => {
          setDescriptionQuery((e.target as HTMLTextAreaElement).value);
        }}
        label="Title search"
        variant="outlined"
        placeholder="Search..."
        size="small"
      />
      <TextField
        id="remarks-field"
        className="text"
        onInput={(e) => {
          setRemarksQuery((e.target as HTMLTextAreaElement).value);
        }}
        label="Remarks search"
        variant="outlined"
        placeholder="Search..."
        size="small"
      />
      <Button color="primary" startIcon={<AddBox />} onClick={addNewRow}>
        Add new book
      </Button>
    </GridToolbarContainer>
  );
}

EditToolbar.propTypes = {
  setRowModesModel: PropTypes.func.isRequired,
  setRows: PropTypes.func.isRequired,
  setFullRows: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  fullRows: PropTypes.arrayOf(PropTypes.any).isRequired,
};

interface GridProps {
  rowData: ColData[];
}

const initialRows = [
  {
    id: randomId(),
    name: 'name',
    description: 'description',
    remarks: 'remarks',
    isNew: false,
  },
];

export default function FullFeaturedCrudGrid({ rowData }: GridProps) {
  const [fullRows, setFullRows] = useState(initialRows);
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState({});
  const [initialized, setInitialized] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    setFullRows(rowData);
    setRows(rowData);
    setInitialized(true);
  }, [rowData]);

  useEffect(() => {
    if (!initialized) return;

    const header = [
      {
        id: randomId(),
        name: 'name',
        description: 'description',
        remarks: 'remarks',
        isNew: false,
      },
    ];

    const withHeader = header.concat(fullRows);
    const filteredData = withHeader.map(({ id, isNew, ...rest }) => {
      return rest;
    });
    window.electron.ipcRenderer.sendMessage('update-selection', filteredData);
  });

  const handleRowEditStart = (_params: unknown, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (_params: unknown, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow?.isNew) {
      setRows(rows.filter((row) => row.id !== id));
      setFullRows(fullRows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    setFullRows(
      fullRows.map((row) => (row.id === newRow.id ? updatedRow : row))
    );
    return updatedRow;
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOk = () => {
    setRows(rows.filter((row) => row.id !== selectedId));
    setFullRows(fullRows.filter((row) => row.id !== selectedId));
    setOpen(false);
  };

  const columns = [
    { field: 'name', headerName: 'Author', flex: 1, editable: true },
    {
      field: 'description',
      headerName: 'Title',
      flex: 1,
      editable: true,
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      flex: 1,
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        getRowHeight={() => 'auto'}
        components={{
          Toolbar: EditToolbar,
        }}
        componentsProps={{
          toolbar: { setRows, setRowModesModel, fullRows, setFullRows },
        }}
        experimentalFeatures={{ newEditingApi: true }}
        sx={{ m: 0 }}
      />
      <AlertBox open={open} handleClose={handleClose} handleOk={handleOk} />
    </Box>
  );
}
