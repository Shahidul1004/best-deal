import { Box } from "@mui/material";
import { createContext, ReactNode, useEffect, useState } from "react";

type ContextType = {
  screenWidth: number;
};

export const Context = createContext<ContextType>({
  screenWidth: 800,
});

type props = {
  children: ReactNode;
};

const ContextProvider = ({ children }: props): JSX.Element => {
  const [width, setWidth] = useState(800);
  useEffect(() => {
    function updateSize() {
      setWidth(window?.innerWidth || 800);
    }
    window?.addEventListener("resize", updateSize);
    updateSize();
    return () => window?.removeEventListener("resize", updateSize);
  }, []);

  return (
    <Box
      sx={{
        width: "100hw",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Box
        className="screenRoot"
        sx={{
          width: `${width - 100}px`,
          maxWidth: `${width - 100}px`,
          height: "100vh",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <Context.Provider
          value={{
            screenWidth: width,
          }}
        >
          {children}
        </Context.Provider>
      </Box>
    </Box>
  );
};

export default ContextProvider;
