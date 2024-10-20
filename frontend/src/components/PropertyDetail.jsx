import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import cities from "../data/cities.json";
import types from "../data/types.json";

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleLocationChange = (_event, newValue) => {
    setLocation(newValue || "");
  };

  const handleTypeChange = (_event, newValue) => {
    setType(newValue || "");
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const cityOptions = useMemo(() => cities.map((city) => city.name), [cities]);
  const typeOptions = useMemo(() => types.map((type) => type.type), [types]);

  const handleUpdateProperty = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("propertyName", property.propertyName);
    formData.append("propertyLocation", location);
    formData.append("propertyType", type);
    formData.append("propertyPrice", property.propertyPrice);
    formData.append("propertyDescription", property.propertyDescription);

    if (selectedFile) {
      formData.append("propertyImage", selectedFile);
    }

    try {
      const response = await axios.put(
        `http://localhost:4000/api/private/properties/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        alert("Property updated successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error updating the property:", error);
      alert("Failed to update the property");
    }
  };

  const handleDeleteProperty = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/private/properties/${id}`,
        { data: { image: property.propertyImage } }
      );
      if (response.status === 200) {
        alert("Property deleted successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting the property:", error);
      alert("Failed to delete the property");
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/private/properties/${id}`
        );
        const fetchedProperty = response.data;
        setProperty(fetchedProperty);
        setLocation(fetchedProperty.propertyLocation);
        setType(fetchedProperty.propertyType);
      } catch (error) {
        console.error("Error fetching the property:", error);
      }
    };
    fetchProperty();
  }, [id]);

  return (
    <>
      <Container maxWidth="xs">
        <IconButton onClick={() => navigate("/")} color="primary">
          <ChevronLeftIcon />
        </IconButton>
        {property ? (
          <Box
            component="form"
            onSubmit={handleUpdateProperty}
            display="flex"
            flexDirection="column"
            gap={2}
            marginTop={4}
          >
            <TextField
              required
              fullWidth
              size="small"
              label="Property Name"
              value={property.propertyName}
              onChange={(e) =>
                setProperty({
                  ...property,
                  propertyName: e.target.value,
                })
              }
            />
            <Autocomplete
              size="small"
              id="location"
              options={cityOptions}
              value={location}
              onChange={handleLocationChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="propertyLocation"
                  label="Location"
                />
              )}
            />
            <Autocomplete
              size="small"
              id="type"
              options={typeOptions}
              value={type}
              onChange={handleTypeChange}
              renderInput={(params) => (
                <TextField {...params} name="propertyType" label="Type" />
              )}
            />
            <TextField
              required
              fullWidth
              size="small"
              label="Property Description"
              value={property.propertyDescription}
              onChange={(e) =>
                setProperty({
                  ...property,
                  propertyDescription: e.target.value,
                })
              }
            />
            <TextField
              required
              label="Price"
              size="small"
              value={property.propertyPrice}
              onChange={(e) =>
                setProperty({
                  ...property,
                  propertyPrice: e.target.value,
                })
              }
              fullWidth
              type="number"
            />
            <TextField
              fullWidth
              size="small"
              type="file"
              id="propertyImage"
              inputProps={{ accept: "image/*" }}
              name="propertyImage"
              autoComplete="propertyImage"
              onChange={handleFileChange}
            />
            {property.propertyImage && (
              <img
                src={`http://localhost:4000/${property.propertyImage}`}
                alt={property.propertyName}
              />
            )}
            <Box display="flex" justifyContent="space-between">
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteProperty}
              >
                Delete
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Container>
    </>
  );
}
