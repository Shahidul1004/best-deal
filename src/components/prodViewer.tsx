import { productType, reviewInfo, siteNames } from "@/types";
import { Box, styled, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const EmptyStar = () => {
  return (
    <Image
      alt=""
      src="https://laz-img-cdn.alicdn.com/tfs/TB1Nx3Lz3mTBuNjy1XbXXaMrVXa-30-30.png"
      height={15}
      width={15}
    />
  );
};

const One4thStar = () => {
  return (
    <Image
      alt=""
      src="https://laz-img-cdn.alicdn.com/tfs/TB1xAX4Ah9YBuNjy0FfXXXIsVXa-30-30.png"
      height={15}
      width={15}
    />
  );
};
const HalfStar = () => {
  return (
    <Image
      alt=""
      src="https://laz-img-cdn.alicdn.com/tfs/TB1M9mOAf1TBuNjy0FjXXajyXXa-30-30.png"
      height={15}
      width={15}
    />
  );
};
const Three4thStar = () => {
  return (
    <Image
      alt=""
      src="https://laz-img-cdn.alicdn.com/tfs/TB1yQX4Ah9YBuNjy0FfXXXIsVXa-30-30.png"
      height={15}
      width={15}
    />
  );
};
const FullStar = () => {
  return (
    <Image
      alt=""
      src="https://laz-img-cdn.alicdn.com/tfs/TB14SXtAXOWBuNjy0FiXXXFxVXa-30-30.png"
      height={15}
      width={15}
    />
  );
};
const Rating = ({
  ratingValue,
  noOfRating,
}: {
  ratingValue: number;
  noOfRating: number;
}): JSX.Element => {
  const full = Math.floor(ratingValue);
  const ex = ratingValue - full;
  const empt = 5 - full - (ex >= 0.125 ? 1 : 0);

  return (
    <Box>
      {[...Array(full).keys()].map((idx, _) => (
        <FullStar key={idx} />
      ))}
      {ex >= 0.875 ? (
        <FullStar />
      ) : ex >= 0.625 ? (
        <Three4thStar />
      ) : ex >= 0.375 ? (
        <HalfStar />
      ) : ex >= 0.125 ? (
        <One4thStar />
      ) : null}
      {[...Array(empt).keys()].map((idx, _) => (
        <EmptyStar key={idx} />
      ))}
    </Box>
  );
};

const Card = ({
  item,
  review,
}: {
  item: productType;
  review?: reviewInfo;
}): JSX.Element => {
  return (
    <CardStyle href={item.url}>
      <Image src={item.imgUrl} width={195} height={195} alt="" />
      <Description>
        <TitleBox>
          <Title>{item.title}</Title>
        </TitleBox>
        <SiteName>{item.site}</SiteName>
        <Price>৳ {item.price}</Price>
        {item.noOfRating > 0 && (
          <Box sx={{ display: "flex" }}>
            <Rating
              ratingValue={item.ratingValue || 0}
              noOfRating={item.noOfRating}
            />
            <Rater>{item.noOfRating} rating(s)</Rater>
          </Box>
        )}
        {item.site === siteNames[siteNames.Daraz] &&
        review?.status === "done" ? (
          <>
            <Typography>total bn: {review.bn}</Typography>
            <Typography>total positive: {review.bnP}</Typography>
            <Typography>total negative: {review.bnN}</Typography>
          </>
        ) : (
          <Typography>waiting</Typography>
        )}
      </Description>
    </CardStyle>
  );
};

const ProdViewer = ({
  items,
  pageIndex,
  reviews,
}: {
  items: productType[];
  pageIndex: number;
  reviews: reviewInfo[];
}): JSX.Element => {
  return (
    <Container>
      {items.length > 0 &&
        items
          .slice(pageIndex * 10, pageIndex * 10 + 10)
          .map((item) => (
            <Card
              key={item.url}
              item={item}
              review={reviews.find((r) => r.url === item.url)}
            />
          ))}
    </Container>
  );
};

export default ProdViewer;

const Container = styled(Box)({
  width: "1150px",
  // height: "100%",
  display: "flex",
  flexFlow: "row wrap",
  justifyContent: "space-evenly",
  alignItems: "center",
  gap: "10px",
  marginBottom: "30px",
});

const CardStyle = styled(Link)({
  boxSizing: "border-box",
  height: "235px",
  width: "525px",
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
  width: "290px",
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

const Rater = styled(Typography)({
  marginLeft: "10px",
  color: "#1a9cb7",
  fontSize: "14px",
});

const SiteName = styled(Typography)({
  color: "#1a9cb7",
  fontSize: "13px",
});
const Price = styled(Typography)({
  color: "#f85606",
  fontSize: "25px",
});
