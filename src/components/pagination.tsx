import { Box, IconButton, styled } from "@mui/material";
import { BoxProps } from "@mui/system";
import React from "react";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import FastForwardIcon from "@mui/icons-material/FastForward";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import FastRewindIcon from "@mui/icons-material/FastRewind";

type propTypes = {
  totalPages: number;
  selectedPageIndex: number;
  changeSelectedPageIndex: (newPage: number) => void;
};

const Pagination = ({
  totalPages,
  selectedPageIndex,
  changeSelectedPageIndex,
}: propTypes): JSX.Element => {
  let left = Math.max(0, selectedPageIndex - 2);
  let right = Math.min(totalPages - 1, left + 4);
  left = Math.max(0, right - 4);

  if (totalPages === undefined || totalPages < 1) return <></>;
  return (
    <Box
      sx={{
        padding: "10px 0px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <IconButton
        sx={{
          boxSizing: "border-box",
          borderRadius: "4px",
          border: "1px solid #cee9ea",
          backgroundColor: "#e3ebec",
          ":hover": {
            backgroundColor: "#cee9ea",
          },
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0px",
        }}
        disabled={left <= 0}
        onClick={() => {
          changeSelectedPageIndex(Math.max(left - 3, 0));
        }}
      >
        <FastRewindIcon
          sx={{
            width: "35px",
            height: "28px",
          }}
        />
      </IconButton>
      <IconButton
        sx={{
          boxSizing: "border-box",
          borderRadius: "4px",
          border: "1px solid #cee9ea",
          backgroundColor: "#e3ebec",
          ":hover": {
            backgroundColor: "#cee9ea",
          },
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0px",
        }}
        disabled={selectedPageIndex <= 0}
        onClick={() =>
          changeSelectedPageIndex(Math.max(selectedPageIndex - 1, 0))
        }
      >
        <SkipPreviousIcon
          sx={{
            width: "35px",
            height: "28px",
          }}
        />
      </IconButton>
      {Array.from(Array(right - left + 1).keys()).map((a, index) => (
        <IndexButton
          key={index}
          active={selectedPageIndex === left + index ? 1 : 0}
          onClick={() => changeSelectedPageIndex(left + index)}
        >
          {left + index + 1}
        </IndexButton>
      ))}
      <IconButton
        sx={{
          boxSizing: "border-box",
          borderRadius: "4px",
          border: "1px solid #cee9ea",
          backgroundColor: "#e3ebec",
          ":hover": {
            backgroundColor: "#cee9ea",
          },
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0px",
        }}
        disabled={selectedPageIndex >= totalPages - 1}
        onClick={() =>
          changeSelectedPageIndex(
            Math.min(selectedPageIndex + 1, totalPages - 1)
          )
        }
      >
        <SkipNextIcon
          sx={{
            width: "35px",
            height: "28px",
          }}
        />
      </IconButton>
      <IconButton
        sx={{
          boxSizing: "border-box",
          borderRadius: "4px",
          border: "1px solid #cee9ea",
          backgroundColor: "#e3ebec",
          ":hover": {
            backgroundColor: "#cee9ea",
          },
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0px",
        }}
        disabled={right >= totalPages - 1}
        onClick={() =>
          changeSelectedPageIndex(Math.min(right + 3, totalPages - 1))
        }
      >
        <FastForwardIcon
          sx={{
            width: "35px",
            height: "28px",
          }}
        />
      </IconButton>
    </Box>
  );
};

export default Pagination;

interface IndexProps extends BoxProps {
  active: number;
}
const IndexButton = styled(Box)<IndexProps>(({ active }) => ({
  padding: "1px 2px",
  boxSizing: "border-box",
  borderRadius: "4px",
  border: "1px solid #cee9ea",
  backgroundColor: active ? "#cee9ea" : "white",
  cursor: active ? "default" : "pointer",
  height: "27px",
  minWidth: "30px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));
