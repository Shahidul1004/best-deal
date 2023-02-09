import { Box } from "@mui/material";
import Header from "./header";

const Layout = ({ children }: { children: JSX.Element }): JSX.Element => {
  return (
    <Box
      sx={{
        width: "100vw",
      }}
    >
      <Header />
      <Box
        sx={{
          marginTop: "70px",
          height: "calc(100vh - 70px)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
