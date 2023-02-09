import { Box, styled, Typography } from "@mui/material";

const Header = (): JSX.Element => {
  return (
    <HeaderSection>
      <Typography>Best Deal</Typography>
    </HeaderSection>
  );
};

export default Header;

const HeaderSection = styled(Box)({
  position: "fixed",
  top: "0px",
  left: "0px",
  width: "100%",
  height: "70px",
  boxSizing: "border-box",
  backgroundColor: "red",
  boxShadow: "0px 1px 4px 0px gray",
  padding: "10px",
  paddingLeft: "30px",
  paddingRight: "30px",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
});
