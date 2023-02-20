import {
  Box,
  Button,
  InputAdornment,
  styled,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import StarIcon from "@mui/icons-material/Star";
import Checkbox from "@mui/material/Checkbox";
import { siteNames } from "@/types";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

type priceRangePropTypes = {
  changeProdMinPrice: (newVal: number) => void;
  changeProdMaxPrice: (newVal: number) => void;
};

type ratingRangePropTypes = {
  prodMinRating: number;
  changeProdMinRating: (newVal: number) => void;
};

type siteListPropTypes = {
  selectedSiteNames: string[];
  changeSelectedSites: (siteName: string) => void;
};

type leftbarPropTypes = priceRangePropTypes &
  ratingRangePropTypes &
  siteListPropTypes & {};

const PriceRange = ({
  changeProdMinPrice,
  changeProdMaxPrice,
}: priceRangePropTypes): JSX.Element => {
  const theme = useTheme();
  const [minPrice, setMinPrice] = useState(-1);
  const [maxPrice, setMaxPrice] = useState(-1);
  const changePriceRangeHandler = () => {
    if (minPrice > 0) changeProdMinPrice(minPrice);
    else changeProdMinPrice(0);
    if (maxPrice > 0) changeProdMaxPrice(maxPrice);
    else changeProdMaxPrice(1000000000);
  };

  return (
    <Box>
      <Typography
        sx={{
          color: "#212121",
          fontSize: "16px",
          marginBottom: "5px",
        }}
      >
        Price Range
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: "5px",
        }}
      >
        <TextField
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">৳</InputAdornment>,
          }}
          placeholder={"min"}
          value={minPrice > 0 ? minPrice : undefined}
          onChange={(e) => {
            const value = Number(+e.target.value);
            if (value > 0) setMinPrice(value);
            else setMinPrice(-1);
          }}
          sx={{
            height: "33px",
            "& .MuiInputBase-root": {
              paddingLeft: "5px",
            },
            "& .MuiOutlinedInput-root": {
              paddingRight: "5px",
            },
            "& .MuiOutlinedInput-input": {
              padding: "5px 0px",
              width: "75px",
              ":hover": {},
            },
          }}
        />
        <TextField
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">৳</InputAdornment>,
          }}
          placeholder={"max"}
          value={maxPrice > 0 ? maxPrice : undefined}
          onChange={(e) => {
            const value = +e.target.value;
            if (value > 0) setMaxPrice(value);
            else setMaxPrice(-1);
          }}
          sx={{
            height: "33px",
            "& .MuiInputBase-root": {
              paddingLeft: "5px",
            },
            "& .MuiOutlinedInput-root": {
              paddingRight: "5px",
            },
            "& .MuiOutlinedInput-input": {
              padding: "5px 0px",
              width: "75px",
              ":hover": {},
            },
          }}
        />
        <Button
          sx={{
            minWidth: "0px",
            padding: "0px",
            height: "33px",
            width: "33px",
            backgroundColor: theme.palette.primary.light,
            ":disabled": {
              backgroundColor: theme.palette.grey[500],
            },
            ":hover": {
              backgroundColor: theme.palette.primary.main,
            },
          }}
          disabled={
            (maxPrice < minPrice && minPrice > 0 && maxPrice > 0) ||
            (minPrice <= 0 && maxPrice <= 0)
              ? true
              : false
          }
          onClick={changePriceRangeHandler}
        >
          <DoneIcon sx={{ color: "white" }} />
        </Button>
      </Box>
    </Box>
  );
};

const DefaultStar = ({ onClick }: { onClick: () => void }): JSX.Element => {
  const theme = useTheme();
  return (
    <StarIcon
      sx={{
        color: theme.palette.grey[500],
        cursor: "pointer",
      }}
      onClick={onClick}
    />
  );
};
const ActiveStar = ({ onClick }: { onClick: () => void }): JSX.Element => {
  const theme = useTheme();
  return (
    <StarIcon
      sx={{
        color: "#f5a623",
        cursor: "pointer",
      }}
      onClick={onClick}
    />
  );
};
const RatingRange = ({
  changeProdMinRating,
  prodMinRating,
}: ratingRangePropTypes): JSX.Element => {
  return (
    <Box>
      <Typography
        sx={{
          color: "#212121",
          fontSize: "16px",
        }}
      >
        Min Rating
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: "2px",
        }}
      >
        {prodMinRating >= 1 ? (
          <ActiveStar onClick={() => changeProdMinRating(1)} />
        ) : (
          <DefaultStar onClick={() => changeProdMinRating(1)} />
        )}
        {prodMinRating >= 2 ? (
          <ActiveStar onClick={() => changeProdMinRating(2)} />
        ) : (
          <DefaultStar onClick={() => changeProdMinRating(2)} />
        )}
        {prodMinRating >= 3 ? (
          <ActiveStar onClick={() => changeProdMinRating(3)} />
        ) : (
          <DefaultStar onClick={() => changeProdMinRating(3)} />
        )}
        {prodMinRating >= 4 ? (
          <ActiveStar onClick={() => changeProdMinRating(4)} />
        ) : (
          <DefaultStar onClick={() => changeProdMinRating(4)} />
        )}
        {prodMinRating >= 5 ? (
          <ActiveStar onClick={() => changeProdMinRating(5)} />
        ) : (
          <DefaultStar onClick={() => changeProdMinRating(5)} />
        )}
      </Box>
    </Box>
  );
};

const SiteName = ({
  siteName,
  onClick,
  active,
}: {
  onClick: (siteName: string) => void;
  siteName: string;
  active: boolean;
}): JSX.Element => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "5px",
      }}
      onClick={() => onClick(siteName)}
    >
      <Checkbox {...label} checked={active} sx={{ padding: "0px" }} />
      <Typography
        sx={{
          color: "rgb(54 49 47)",
          fontSize: "18px",
        }}
      >
        {siteName}
      </Typography>
    </Box>
  );
};

const SiteList = ({
  selectedSiteNames,
  changeSelectedSites,
}: siteListPropTypes): JSX.Element => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
      }}
    >
      {Object.keys(siteNames)
        .filter((v) => isNaN(Number(v)))
        .map((name) => (
          <SiteName
            key={name}
            siteName={name}
            active={selectedSiteNames.includes(name)}
            onClick={changeSelectedSites}
          />
        ))}
    </Box>
  );
};

const Leftbar = ({
  changeProdMinPrice,
  changeProdMaxPrice,
  changeProdMinRating,
  prodMinRating,
  selectedSiteNames,
  changeSelectedSites,
}: leftbarPropTypes): JSX.Element => {
  return (
    <LeftbarSection>
      <PriceRange
        changeProdMinPrice={changeProdMinPrice}
        changeProdMaxPrice={changeProdMaxPrice}
      />
      <RatingRange
        changeProdMinRating={changeProdMinRating}
        prodMinRating={prodMinRating}
      />
      <SiteList
        selectedSiteNames={selectedSiteNames}
        changeSelectedSites={changeSelectedSites}
      />
    </LeftbarSection>
  );
};

export default Leftbar;

const LeftbarSection = styled(Box)({
  boxSizing: "border-box",
  width: "250px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "20px",
});
