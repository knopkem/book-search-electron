import * as React from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/AddBox";

export default function Searchbar({setNameQuery, setDescriptionQuery, setRemarksQuery}) {
  return (
    <form>
    <TextField
      id="name-field"
      className="text"
      onInput={(e) => {
        setNameQuery(e.target.value);
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
        setDescriptionQuery(e.target.value);
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
        setRemarksQuery(e.target.value);
      }}
      label="Remarks search"
      variant="outlined"
      placeholder="Search..."
      size="small"
    />
    <IconButton type="submit" aria-label="search">
      <SearchIcon style={{ fill: "blue" }} />
    </IconButton>
  </form>
  );
}
