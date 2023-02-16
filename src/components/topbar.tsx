import { Box, styled, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
type propTypes = {
  totalItems: number;
  sortBy: number;
  changeSortBy: (newVal: number) => void;
};

const Topbar = ({
  totalItems,
  sortBy,
  changeSortBy,
}: propTypes): JSX.Element => {
  return (
    <TopbarSection>
      <Container>
        <Text>Total {totalItems || 0} item(s)</Text>
        <FormControl sx={{ minWidth: 220 }}>
          <Select
            value={sortBy}
            onChange={(event) => changeSortBy(Number(event.target.value))}
            displayEmpty
          >
            <MenuItem value={0}>Recommended</MenuItem>
            <MenuItem value={1}>Price low to high</MenuItem>
            <MenuItem value={2}>Price high to low</MenuItem>
          </Select>
        </FormControl>
      </Container>
    </TopbarSection>
  );
};

export default Topbar;

const TopbarSection = styled(Box)({
  width: "100%",
  height: "100px",
  position: "relative",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
});

const Container = styled(Box)({
  width: "calc(100% - 200px)",
  height: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

const Text = styled(Typography)({
  color: "gray",
  fontSize: "20px",
});
