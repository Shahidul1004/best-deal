import { reviewDataType, reviewInfo } from "@/types";
import { Box, Button, styled, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useAppSelector } from "@/redux/hooks";

const Review = ({
  review,
  title,
  url,
}: {
  review: reviewInfo;
  title: string;
  url: string;
}): JSX.Element => {
  const { bn, bnN, bnP, en, enN, enP, result } = review;
  let ratioBNP = -1;
  let ratioBNN = -1;
  let ratioENP = -1;
  let ratioENN = -1;

  if (bn > 0) {
    ratioBNP = Math.floor((bnP * 100) / bn);
    ratioBNN = Math.floor((bnN * 100) / bn);
    if (ratioBNN < ratioBNP) ratioBNN = 100 - ratioBNP;
    else ratioBNP = 100 - ratioBNN;
  }
  if (en > 0) {
    ratioENP = Math.floor((enP * 100) / en);
    ratioENN = Math.floor((enN * 100) / en);
    if (ratioENN < ratioENP) ratioENN = 100 - ratioENP;
    else ratioENP = 100 - ratioENN;
  }
  const router = useRouter();
  return (
    <Box
      sx={{
        width: "100%",
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "calc(100% - 50px)" }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: "10px",
            marginBottom: "3px",
          }}
        >
          <ReviewName>Good Reviews</ReviewName>
          <Wrapper>
            <Ratio>{ratioBNP === -1 ? "N/A" : `${ratioBNP}%`}</Ratio>
            <RatioType>(BN)</RatioType>
          </Wrapper>

          <Wrapper>
            <Ratio>{ratioENP === -1 ? "N/A" : `${ratioENP}%`}</Ratio>
            <RatioType>(EN)</RatioType>
          </Wrapper>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: "10px",
          }}
        >
          <ReviewName>Bad Reviews</ReviewName>
          <Wrapper>
            <Ratio>{ratioBNN === -1 ? "N/A" : `${ratioBNN}%`}</Ratio>
            <RatioType>(BN)</RatioType>
          </Wrapper>

          <Wrapper>
            <Ratio>{ratioENN === -1 ? "N/A" : `${ratioENN}%`}</Ratio>
            <RatioType>(EN)</RatioType>
          </Wrapper>
        </Box>
      </Box>
      <ButtonStyle
        variant="text"
        onClick={() => {
          window.open(`/review/${url}`, "_ blank");
        }}
      >
        Details
      </ButtonStyle>
    </Box>
  );
};

export default Review;

const ReviewName = styled(Typography)({
  color: "#6f6363",
  letterSpacing: 0,
  fontSize: "13px",
  fontWeight: 400,
  width: "90px",
  marginTop: "2px",
});

const Wrapper = styled(Box)({
  display: "flex",
  flexDirection: "row",
  color: "#6f6363",
});

const Ratio = styled(Typography)({
  fontSize: "14px",
  marginTop: "3px",
  fontWeight: "500",
});
const RatioType = styled(Typography)({
  fontSize: "12px",
  marginTop: "4px",
  marginLeft: "3px",
});

const ButtonStyle = styled(Button)({
  fontSize: "9px",
  padding: "0px 5px",
  minWidth: "10px",
  color: "#1a9cb7",
  lineHeight: "2",
  marginTop: "3px",
  height: "20px",
  ":hover": {
    backgroundColor: "rgb(25 118 210 / 10%)",
  },
});
