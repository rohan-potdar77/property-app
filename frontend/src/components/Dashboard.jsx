import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import axios from "axios";
import debounce from "lodash/debounce";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import cities from "../data/cities.json";
import prices from "../data/prices.json";
import types from "../data/types.json";

export default function Dashboard() {
  const navigate = useNavigate();

  const [propertyList, setPropertyList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [priceRange, setPriceRange] = useState([null, null]);
  const [searchQuery, setSearchQuery] = useState("");

  const cityOptions = useMemo(() => cities.map((city) => city.name), [cities]);
  const typeOptions = useMemo(() => types.map((type) => type.type), [types]);

  const fetchData = useCallback(
    async (queryParams) => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/private/properties`,
          { params: queryParams }
        );
        setPropertyList(response.data.properties);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error(error.message);
        alert(error.message);
      }
    },
    [currentPage, limit, location, type, priceRange, searchQuery]
  );

  const debouncedFetchData = useCallback(
    debounce(() => {
      fetchData({
        page: currentPage,
        limit,
        location,
        type,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        search: searchQuery,
      });
    }, 500),
    [fetchData]
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleLimit = (e) => {
    setLimit(parseInt(e.target.value, 10));
  };

  const handleLocationChange = (_event, newValue) => {
    setLocation(newValue || "");
    setCurrentPage(1);
  };

  const handleTypeChange = (_event, newValue) => {
    setType(newValue || "");
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (event) => {
    setPriceRange(event.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const PropertyCard = React.memo(({ property }) => {
    const navigate = useNavigate();

    const handleClick = () => {
      navigate(`/property/${property._id}`);
    };
    return (
      <Grid item xs={12} sm={8} md={5.9} key={property._id}>
        <Card
          onClick={handleClick}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            height: { xs: "auto", sm: "200px" },
            transition: "box-shadow 0.3s ease-in-out",
            ":hover": { boxShadow: 10, cursor: "pointer" },
          }}
        >
          <CardMedia
            component="img"
            src={`http://localhost:4000/${property.propertyImage}`}
            alt={property.propertyName}
            loading="lazy"
            sx={{ width: "40%", height: "100%", objectFit: "cover" }}
          />
          <CardContent sx={{ p: 1 }}>
            <Typography variant="h6" gutterBottom>
              {property.propertyName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {property.propertyLocation}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {property.propertyType}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {property.propertyDescription}
            </Typography>
            <Typography variant="subtitle1" color="secondary">
              {property.propertyPrice}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  });

  useEffect(() => {
    debouncedFetchData();
    return debouncedFetchData.cancel;
  }, [currentPage, limit, location, type, priceRange, searchQuery]);

  return (
    <>
      <Container maxWidth="lg">
        <Grid container spacing={2} paddingY={2}>
          <Grid
            item
            xs={12}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            paddingY={2}
          >
            <TextField
              autoFocus
              size="small"
              label="Search"
              variant="standard"
              value={searchQuery}
              sx={{ width: "30%" }}
              onChange={handleSearchChange}
            />

            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => navigate("/add-property")}
            >
              New Property
            </Button>
          </Grid>

          <Grid item xs={6} sm={3}>
            <InputLabel id="location-label">Location</InputLabel>
            <Autocomplete
              size="small"
              id="location"
              value={location}
              options={cityOptions}
              onChange={handleLocationChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <InputLabel id="type-label">Property Type</InputLabel>
            <Autocomplete
              size="small"
              id="type"
              options={typeOptions}
              value={type}
              onChange={handleTypeChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <InputLabel id="price-range-label">Price Range</InputLabel>
            <Select
              fullWidth
              size="small"
              value={priceRange}
              labelId="price-range-label"
              onChange={handlePriceRangeChange}
            >
              {prices.map((data) => (
                <MenuItem key={data.id} value={data.value}>
                  {data.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>

        <Grid container spacing={2} marginY={4} justifyContent="space-between">
          {propertyList?.map((property) => (
            <PropertyCard property={property} key={property._id} />
          ))}
        </Grid>

        <Box
          marginY={4}
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
        >
          <ToggleButtonGroup
            exclusive
            size="small"
            value={limit}
            color="primary"
            onChange={handleLimit}
            aria-label="Select number of items per page"
          >
            <ToggleButton selected={limit === 10} value="10">
              10
            </ToggleButton>
            <ToggleButton selected={limit === 25} value="25">
              25
            </ToggleButton>
            <ToggleButton selected={limit === 50} value="50">
              50
            </ToggleButton>
            <ToggleButton selected={limit === 100} value="100">
              100
            </ToggleButton>
          </ToggleButtonGroup>

          <IconButton
            size="small"
            color="primary"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            sx={{ marginLeft: 4 }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <span style={{ marginLeft: 10, marginRight: 10 }}>
            Page {currentPage} of {totalPages}
          </span>
          <IconButton
            size="small"
            color="primary"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <NavigateNextIcon />
          </IconButton>
        </Box>
      </Container>
    </>
  );
}
