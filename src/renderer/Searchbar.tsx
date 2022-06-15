import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { AddBox } from "@mui/icons-material";

interface SearchbarProps {
  setNameQuery: (value: string) => void;
  setDescriptionQuery: (value: string) => void;
  setRemarksQuery: (value: string) => void;
}

export default function Searchbar({setNameQuery, setDescriptionQuery, setRemarksQuery}: SearchbarProps) {
  return (
    <form>
    <TextField
      id="name-field"
      className="text"
      onInput={(e) => {
        setNameQuery((e.target as HTMLTextAreaElement).value);
      }}
      label="Name search"
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
      label="Description search"
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
    <IconButton type="submit" aria-label="search">
      <AddBox style={{ fill: "blue" }} />
    </IconButton>
  </form>
  );
}
