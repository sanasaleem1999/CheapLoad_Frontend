import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { add_post } from "../../Store/postReducer";
import UserHeader from "../Dashboard/userHeader";

const ShippingQuoteForm = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.authentication);
  console.log(token, "token in ShippingQuoteForm");
  const [submitting, setSubmitting] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [formData, setFormData] = useState({
    trailerType: "",
    quotedPriceUsd: "",
    agreedToTerms: false,
    pickupLocation: {
      type: "",
      name: "",
      addressLine: "",
      city: "",
      stateOrProvince: "",
      postalCode: "",
      country: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      contactCell: "",
      buyerReferenceNumber: "",
      twicRequired: false,
    },
    deliveryLocation: {
      type: "",
      name: "",
      addressLine: "",
      city: "",
      stateOrProvince: "",
      postalCode: "",
      country: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      contactCell: "",
      buyerReferenceNumber: "",
      twicRequired: false,
    },
    vehicle: {
      availableDate: "",
      desiredDeliveryDate: "",
      expirationDate: "",
    },
    vehicles: [
      {
        vinAvailable: false,
        vin: "",
        type: "",
        year: "",
        make: "",
        model: "",
        color: "",
        lotNumber: "",
        licensePlate: "",
        licenseStateOrProvince: "",
        notes: "",
        inoperable: false,
        oversized: false,
        availableDate: "",
        desiredDeliveryDate: "",
        expirationDate: "",
      },
    ],
  });

  const handleChange = (e, section, field, index) => {
    if (section === "pickupLocation" || section === "deliveryLocation") {
      setFormData({
        ...formData,
        [section]: { ...formData[section], [field]: e.target.value },
      });
    } else if (section === "vehicles") {
      const updatedVehicles = [...formData.vehicles];
      updatedVehicles[index][field] =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setFormData({ ...formData, vehicles: updatedVehicles });
    } else if (section === "vehicle") {
      // top-level vehicle dates (availableDate, desiredDeliveryDate, expirationDate)
      setFormData({
        ...formData,
        vehicle: { ...formData.vehicle, [field]: e.target.value },
      });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setApiMessage("");

    // Validate required fields
    if (!formData.agreedToTerms) {
      setApiError("Please agree to the terms and conditions");
      return;
    }

    if (!formData.trailerType || !formData.quotedPriceUsd) {
      setApiError("Please fill in all required fields");
      return;
    }

    // Get token from Redux or localStorage
    const authToken = token || localStorage.getItem("token");
    
    if (!authToken) {
      setApiError("Authentication token not found. Please login first.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await dispatch(add_post(formData)).unwrap();
      setApiMessage(result.message || "Shipping quote submitted successfully!");

      // Reset form
      setFormData({
        trailerType: "",
        quotedPriceUsd: "",
        agreedToTerms: false,
        pickupLocation: {
          type: "",
          name: "",
          addressLine: "",
          city: "",
          stateOrProvince: "",
          postalCode: "",
          country: "",
          contactName: "",
          contactEmail: "",
          contactPhone: "",
          contactCell: "",
          buyerReferenceNumber: "",
          twicRequired: false,
        },
        deliveryLocation: {
          type: "",
          name: "",
          addressLine: "",
          city: "",
          stateOrProvince: "",
          postalCode: "",
          country: "",
          contactName: "",
          contactEmail: "",
          contactPhone: "",
          contactCell: "",
          buyerReferenceNumber: "",
          twicRequired: false,
        },
        vehicles: [
          {
            vinAvailable: false,
            vin: "",
            type: "",
            year: "",
            make: "",
            model: "",
            color: "",
            lotNumber: "",
            licensePlate: "",
            licenseStateOrProvince: "",
            notes: "",
            inoperable: false,
            oversized: false,
            availableDate: "",
            desiredDeliveryDate: "",
            expirationDate: "",
          },
        ],
      });
    } catch (error) {
      // error is the rejection payload from thunk (string or object)
      const errorMsg = typeof error === "string" ? error : error?.message || "Failed to submit quote";
      setApiError(errorMsg);
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper elevation={6} sx={{ p: 4, maxWidth: "100%", width: "100%", borderRadius: 3, maxHeight: "90vh", overflowY: "auto" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Shipping Quote Form
        </Typography>

        {/* Error Alert */}
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError("")}>
            {apiError}
          </Alert>
        )}

        {/* Success Alert */}
        {apiMessage && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setApiMessage("")}>
            {apiMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* General Quote */}
          <Typography variant="h6" gutterBottom>
            General Quote
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              select
              fullWidth
              label="Trailer Type"
              value={formData.trailerType}
              onChange={(e) => handleChange(e, null, "trailerType")}
            >
              {["ENCLOSED", "OPEN", "FLATBED"].map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Quoted Price (USD)"
              value={formData.quotedPriceUsd}
              onChange={(e) => handleChange(e, null, "quotedPriceUsd")}
            />
          </Box>

          {/* Pickup Location */}
          <Typography variant="h6" gutterBottom>
            Pickup Location
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Type"
              value={formData.pickupLocation.type}
              onChange={(e) => handleChange(e, "pickupLocation", "type")}
            />
            <TextField
              fullWidth
              label="Name"
              value={formData.pickupLocation.name}
              onChange={(e) => handleChange(e, "pickupLocation", "name")}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Address Line"
              value={formData.pickupLocation.addressLine}
              onChange={(e) => handleChange(e, "pickupLocation", "addressLine")}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="City"
              value={formData.pickupLocation.city}
              onChange={(e) => handleChange(e, "pickupLocation", "city")}
            />
            <TextField
              fullWidth
              label="State/Province"
              value={formData.pickupLocation.stateOrProvince}
              onChange={(e) => handleChange(e, "pickupLocation", "stateOrProvince")}
            />
            <TextField
              fullWidth
              label="Postal Code"
              value={formData.pickupLocation.postalCode}
              onChange={(e) => handleChange(e, "pickupLocation", "postalCode")}
            />
            <TextField
              fullWidth
              label="Country"
              value={formData.pickupLocation.country}
              onChange={(e) => handleChange(e, "pickupLocation", "country")}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Contact Name"
              value={formData.pickupLocation.contactName}
              onChange={(e) => handleChange(e, "pickupLocation", "contactName")}
            />
            <TextField
              fullWidth
              label="Contact Email"
              value={formData.pickupLocation.contactEmail}
              onChange={(e) => handleChange(e, "pickupLocation", "contactEmail")}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Contact Phone"
              value={formData.pickupLocation.contactPhone}
              onChange={(e) => handleChange(e, "pickupLocation", "contactPhone")}
            />
            <TextField
              fullWidth
              label="Contact Cell"
              value={formData.pickupLocation.contactCell}
              onChange={(e) => handleChange(e, "pickupLocation", "contactCell")}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Buyer Reference #"
              value={formData.pickupLocation.buyerReferenceNumber}
              onChange={(e) => handleChange(e, "pickupLocation", "buyerReferenceNumber")}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.pickupLocation.twicRequired}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pickupLocation: {
                        ...formData.pickupLocation,
                        twicRequired: e.target.checked,
                      },
                    })
                  }
                />
              }
              label="TWIC Required"
            />
          </Box>

          {/* Delivery Location */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Delivery Location
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Type"
              value={formData.deliveryLocation.type}
              onChange={(e) => handleChange(e, "deliveryLocation", "type")}
            />
            <TextField
              fullWidth
              label="Name"
              value={formData.deliveryLocation.name}
              onChange={(e) => handleChange(e, "deliveryLocation", "name")}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Address Line"
              value={formData.deliveryLocation.addressLine}
              onChange={(e) => handleChange(e, "deliveryLocation", "addressLine")}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="City"
              value={formData.deliveryLocation.city}
              onChange={(e) => handleChange(e, "deliveryLocation", "city")}
            />
            <TextField
              fullWidth
              label="State/Province"
              value={formData.deliveryLocation.stateOrProvince}
              onChange={(e) => handleChange(e, "deliveryLocation", "stateOrProvince")}
            />
            <TextField
              fullWidth
              label="Postal Code"
              value={formData.deliveryLocation.postalCode}
              onChange={(e) => handleChange(e, "deliveryLocation", "postalCode")}
            />
            <TextField
              fullWidth
              label="Country"
              value={formData.deliveryLocation.country}
              onChange={(e) => handleChange(e, "deliveryLocation", "country")}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Contact Name"
              value={formData.deliveryLocation.contactName}
              onChange={(e) => handleChange(e, "deliveryLocation", "contactName")}
            />
            <TextField
              fullWidth
              label="Contact Email"
              value={formData.deliveryLocation.contactEmail}
              onChange={(e) => handleChange(e, "deliveryLocation", "contactEmail")}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Contact Phone"
              value={formData.deliveryLocation.contactPhone}
              onChange={(e) => handleChange(e, "deliveryLocation", "contactPhone")}
            />
            <TextField
              fullWidth
              label="Contact Cell"
              value={formData.deliveryLocation.contactCell}
              onChange={(e) => handleChange(e, "deliveryLocation", "contactCell")}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Buyer Reference #"
              value={formData.deliveryLocation.buyerReferenceNumber}
              onChange={(e) => handleChange(e, "deliveryLocation", "buyerReferenceNumber")}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.deliveryLocation.twicRequired}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deliveryLocation: {
                        ...formData.deliveryLocation,
                        twicRequired: e.target.checked,
                      },
                    })
                  }
                />
              }
              label="TWIC Required"
            />
          </Box>

          {/* Vehicle Dates */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Vehicle Dates
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Available Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.vehicle.availableDate}
              onChange={(e) => handleChange(e, "vehicle", "availableDate")}
            />
            <TextField
              fullWidth
              label="Desired Delivery Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.vehicle.desiredDeliveryDate}
              onChange={(e) => handleChange(e, "vehicle", "desiredDeliveryDate")}
            />
            <TextField
              fullWidth
              label="Expiration Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.vehicle.expirationDate}
              onChange={(e) => handleChange(e, "vehicle", "expirationDate")}
            />
          </Box>

          {/* Vehicles */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Vehicles
          </Typography>
          {formData.vehicles.map((vehicle, index) => (
            <Box key={index} sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2, mb: 2 }}>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Type"
                  value={vehicle.type}
                  onChange={(e) => handleChange(e, "vehicles", "type", index)}
                />
                <TextField
                  fullWidth
                  label="Year"
                  value={vehicle.year}
                  onChange={(e) => handleChange(e, "vehicles", "year", index)}
                />
                <TextField
                  fullWidth
                  label="Make"
                  value={vehicle.make}
                  onChange={(e) => handleChange(e, "vehicles", "make", index)}
                />
                <TextField
                  fullWidth
                  label="Model"
                  value={vehicle.model}
                  onChange={(e) => handleChange(e, "vehicles", "model", index)}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Color"
                  value={vehicle.color}
                  onChange={(e) => handleChange(e, "vehicles", "color", index)}
                />
                <TextField
                  fullWidth
                  label="Lot Number"
                  value={vehicle.lotNumber}
                  onChange={(e) => handleChange(e, "vehicles", "lotNumber", index)}
                />
                <TextField
                  fullWidth
                  label="License Plate"
                  value={vehicle.licensePlate}
                  onChange={(e) => handleChange(e, "vehicles", "licensePlate", index)}
                />
                <TextField
                  fullWidth
                  label="License State"
                  value={vehicle.licenseStateOrProvince}
                  onChange={(e) => handleChange(e, "vehicles", "licenseStateOrProvince", index)}
                />
              </Box>
              <TextField
                fullWidth
                multiline
                label="Notes"
                value={vehicle.notes}
                onChange={(e) => handleChange(e, "vehicles", "notes", index)}
                sx={{ mb: 2 }}
              />
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={vehicle.inoperable}
                      onChange={(e) => handleChange(e, "vehicles", "inoperable", index)}
                    />
                  }
                  label="Inoperable"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={vehicle.oversized}
                      onChange={(e) => handleChange(e, "vehicles", "oversized", index)}
                    />
                  }
                  label="Oversized"
                />
              </Box>
            </Box>
          ))}

          {/* Terms Agreement */}
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreedToTerms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      agreedToTerms: e.target.checked,
                    })
                  }
                />
              }
              label="I agree to the terms and conditions"
            />
          </Box>

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={submitting}
            sx={{ py: 1.2, fontWeight: "bold", position: "relative" }}
          >
            {submitting ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Submitting...
              </>
            ) : (
              "Submit Quote"
            )}
          </Button>
        </form>
    </Paper>
  );
};

export default ShippingQuoteForm;
