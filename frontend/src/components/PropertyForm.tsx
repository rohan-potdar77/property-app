import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Autocomplete,
  FormHelperText,
  IconButton,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import axios from "axios";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import cities from "../data/cities.json";
import types from "../data/types.json";

export default function PropertyForm() {
  const navigate = useNavigate();

  const cityOptions = useMemo(() => cities.map((city) => city.name), [cities]);
  const typeOptions = useMemo(() => types.map((data) => data.type), [types]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const propertyData = {
      propertyName: data.get("propertyName"),
      propertyType: data.get("propertyType"),
      propertyLocation: data.get("propertyLocation"),
      propertyPrice: data.get("propertyPrice"),
      propertyDescription: data.get("propertyDescription"),
    };

    const propertyImage = data.get("propertyImage");
    if (propertyImage) {
      propertyData["propertyImage"] = propertyImage;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/private/properties",
        propertyData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        alert("Property Added!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error adding property:", error);
      alert(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <>
      <Container maxWidth="xs">
        <IconButton onClick={() => navigate("/")} color="primary">
          <ChevronLeftIcon />
        </IconButton>
        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          rowGap={2}
          marginTop={2}
        >
          <TextField
            required
            fullWidth
            size="small"
            id="propertyName"
            label="Property Name"
            name="propertyName"
            autoComplete="propertyName"
            autoFocus
          />
          <Autocomplete
            fullWidth
            size="small"
            id="propertyType"
            options={typeOptions}
            renderInput={(params) => (
              <TextField {...params} name="propertyType" label="Type" />
            )}
          />
          <Autocomplete
            fullWidth
            size="small"
            id="propertyLocation"
            options={cityOptions}
            renderInput={(params) => (
              <TextField {...params} name="propertyLocation" label="Location" />
            )}
          />
          <TextField
            required
            fullWidth
            size="small"
            id="propertyPrice"
            label="Property Price"
            name="propertyPrice"
            type="number"
            autoComplete="propertyPrice"
          />
          <TextField
            required
            fullWidth
            size="small"
            id="propertyDescription"
            label="Property Description"
            name="propertyDescription"
            autoComplete="propertyDescription"
          />
          <TextField
            fullWidth
            size="small"
            type="file"
            id="propertyImage"
            inputProps={{ accept: "image/*" }}
            name="propertyImage"
            autoComplete="propertyImage"
          />
          <FormHelperText>
            Upload an image file. Maximum size: 200KB.
          </FormHelperText>
          <Button type="submit" fullWidth size="small" variant="contained">
            Add Property
          </Button>
        </Box>
      </Container>
    </>
  );
}
