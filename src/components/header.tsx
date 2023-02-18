import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";

const Header = ({onSearch}:{onSearch: (st: string)=> void}): JSX.Element => {
  const [inputText, setInputText] = React.useState<string>("");
  const changeInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputText(event.target.value);
  };

  const handleKeyDown = (event:React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const text = inputText.trim().toLowerCase();
      if(text.length > 0){
        onSearch(text)
      }
      
    }
  }

  return (
    <HeaderSection>
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{ display: { xs: "none", sm: "block" }, marginRight: { xs: "none", sm: "25px" } }}
      >
        Best Deal
      </Typography>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          onKeyDown={handleKeyDown}
          onChange={changeInput}
        />
      </Search>
      <Box sx={{ flexGrow: 1 }} />
      <IconButton size="large" edge="end">
        <AccountCircle sx={{color: "white"}}/>
      </IconButton>
    </HeaderSection>
  );
};

export default Header;

const HeaderSection = styled(Box)({
  position: "relative",
  top: "0px",
  width: "100%",
  height: "70px",
  boxSizing: "border-box",
  backgroundColor: "rgb(25 118 210)",
  color: 'white',
  boxShadow: "0px 1px 4px 0px gray",
  padding: "10px 40px",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
});

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));
