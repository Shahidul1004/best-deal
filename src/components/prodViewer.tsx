import { productType } from "@/types";
import { Box, styled, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const Card = ({ item }: { item: productType }): JSX.Element => {
  return (
    <CardStyle href={item.url}>
      <Image src={item.imgUrl} width={200} height={200} alt="" />
      <Description>
        <TitleBox>
          <Title>{item.title}</Title>
        </TitleBox>
        <SiteName>{item.site}</SiteName>
        <Price>৳ {item.price}</Price>
        <Box sx={{ display: "flex" }}>
          {Number(item.ratingValue) > 0 && (
            <Typography>{item.ratingValue}</Typography>
          )}
          {Number(item.ratingValue) > 0 && (
            <Typography> ({item.noOfRating})</Typography>
          )}
        </Box>
      </Description>
    </CardStyle>
  );
};

const ProdViewer = ({ items }: { items: productType[] }): JSX.Element => {
  return (
    <Container>
      {items.length > 0 &&
        items.slice(0, 20).map((item) => <Card key={item.url} item={item} />)}
    </Container>
  );
};

export default ProdViewer;

const Container = styled(Box)({
  width: "100%",
  height: "100%",
  display: "flex",
  flexFlow: "row wrap",
  justifyContent: "space-around",
  alignItems: "center",
  gap: "20px",
});

const CardStyle = styled(Link)({
  boxSizing: "border-box",
  height: "240px",
  width: "560px",
  backgroundColor: "rgb(235, 243, 250)",
  borderRadius: "12px",
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
  cursor: "pointer",
  target: "_blank",
});

const Description = styled(Box)({
  height: "200px",
  width: "300px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
});

const TitleBox = styled(Box)({
  width: "100%",
  maxHeight: "72px",
  overflow: "hidden",
  wordWrap: "break-word",
  textOverflow: "clip",
});

const Title = styled(Typography)({
  fontSize: "16px",
  fontWeight: "500",
  color: "#333333",
});

const SiteName = styled(Typography)({
  color: "#1a9cb7",
  fontSize: "13px",
});
const Price = styled(Typography)({
  color: "#f85606",
  fontSize: "25px",
});
