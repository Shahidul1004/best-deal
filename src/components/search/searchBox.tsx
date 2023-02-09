import { alpha, Box, InputBase, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ChangeEvent, ChangeEventHandler, useState } from "react";

const SearchBox = (): JSX.Element => {
  const [inputText, setInputText] = useState<string>("");
  const changeInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputText(event.target.value);
  };

  const searchHandler = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ searchText: inputText.trim().toLowerCase() }),
    };
    const response = await fetch(`/api/`, requestOptions);
    const data = await response.json()
    console.log(data)
  };

  return (
    <SearchSection>
      <StyledInputBase onChange={changeInput} />
      <SearchIconWrapper
        sx={{
          cursor: inputText.trim().length > 0 ? "pointer" : "auto",
          pointerEvents: inputText.trim().length > 0 ? "initial" : "none",
        }}
        onClick={searchHandler}
      >
        <SearchIcon />
      </SearchIconWrapper>
    </SearchSection>
  );
};

export default SearchBox;

const SearchSection = styled(Box)(({ theme }) => ({
  position: "relative",
  top: "100px",
  left: "calc(50% - 250px)",
  width: "500px",
  height: "75px",
  maxWidth: "80vw",
  boxSizing: "border-box",
  margin: "1px solid green",
  padding: "10px",
  borderRadius: "8px",
  backgroundColor: alpha(theme.palette.primary.main, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.25),
  },
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  paddingLeft: "10px",
  "& .MuiInputBase-input": {
    padding: "10px",
    transition: theme.transitions.create("width"),
    width: "100%",
    outerHeight: "100px",
    backgroundColor: alpha(theme.palette.primary.light, 0.15),
  },
}));

const SearchIconWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
}));
