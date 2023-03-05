import { reviewDataType } from "@/types";
import styled from "@emotion/styled";
import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";
import { useAppSelector } from "@/redux/hooks";

const Review = (): JSX.Element => {
  const router = useRouter();
  const query = router?.query;
  let url = (query?.slug as string[])?.join("/");
  const keys = Object.keys(query).map((a) => a);
  const values = Object.values(query).map((a) => a);
  let params = "";
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] !== "slug") params = params + "&" + keys[i] + "=" + values[i];
  }
  url = url + "?" + params.replace("&", "");
  url = url.replace("https:/", "https://").replace("http:/", "http://")

  const { reviewInfo } = useAppSelector((state) => state.state);
  const reviewData = reviewInfo.find((r) => r.url === url);

  if (!reviewData) {
    return <></>;
  }
  return (
    <Box
      sx={{
        backgroundColor: "#d2d2d28f",
        padding: "10px",
        height: "100vh",
      }}
    >
      <Typography
        sx={{
          fontSize: "20px",
          padding: "20px",
          paddingLeft: "10px",
        }}
      >
        {reviewData.title}
      </Typography>
      <Box
        sx={{
          height: "calc(100% - 100px)",
          overflowY: "auto",
        }}
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Reviews</TableCell>
                <TableCell>Sentiments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviewData.result.map((review) => (
                <TableRow
                  key={review.review}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {review.review}
                  </TableCell>
                  <TableCell>{review.sentiment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Review;
