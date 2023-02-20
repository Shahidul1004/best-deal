import { Box } from "@mui/material";
import { createContext, ReactNode, useEffect, useState } from "react";

type ContextType = {
  screenWidth: number;
  isLoading: boolean;
  changeLoadingState: (isLoading: boolean) => void;
};

export const Context = createContext<ContextType>({
  screenWidth: 800,
  isLoading: false,
  changeLoadingState(isLoading) {},
});

type props = {
  children: ReactNode;
};

const ContextProvider = ({ children }: props): JSX.Element => {
  const [width, setWidth] = useState(800);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    function updateSize() {
      setWidth(window?.innerWidth || 800);
    }
    window?.addEventListener("resize", updateSize);
    updateSize();
    return () => window?.removeEventListener("resize", updateSize);
  }, []);

  const changeLoadingState = (isLoading: boolean) => {
    setIsLoading((prev) => isLoading);
  };

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
          width: `${width >= 1360 ? "1360px" : "850px"}`,
          height: "100vh",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <Context.Provider
          value={{
            screenWidth: width,
            isLoading: isLoading,
            changeLoadingState: changeLoadingState,
          }}
        >
          {children}
        </Context.Provider>
      </Box>
    </Box>
  );
};

export default ContextProvider;
