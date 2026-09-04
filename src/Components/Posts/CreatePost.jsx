import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Checkbox,
    Switch,
    FormControlLabel,
    Divider,
    Stepper,
    Step,
    StepButton,
    StepLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from "react-redux";
import { add_post } from "../../Store/postReducer";


export default function CreatePost({ currentUser }) {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.authentication);
    console.log(token, "token in Cradte Form");
    const [submitting, setSubmitting] = useState(false);
    const [apiMessage, setApiMessage] = useState("");
    const [apiError, setApiError] = useState("");
    const [stepError, setStepError] = useState("");
    const [priceModalOpen, setPriceModalOpen] = useState(false);
    const redirectTimeoutRef = useRef(null);

    const [formData, setFormData] = useState({
        // Payment Info
        trailerType: 'ENCLOSED',
        quotedPriceUsd: '',
        agreedToTerms: false,
        status: '',

        // Pickup Location
        pickupLocation: {
            type: 'residential',
            name: '',
            addressLine: '',
            city: '',
            stateOrProvince: '',
            postalCode: '',
            country: '',
            contactName: '',
            contactEmail: '',
            contactPhone: '',
            contactCell: '',
            buyerReferenceNumber: '',
            twicRequired: false,
        },

        // Delivery Location
        deliveryLocation: {
            type: 'residential',
            name: '',
            addressLine: '',
            city: '',
            stateOrProvince: '',
            postalCode: '',
            country: '',
            contactName: '',
            contactEmail: '',
            contactPhone: '',
            contactCell: '',
            buyerReferenceNumber: '',
            twicRequired: false,
        },

        // Vehicle Information
        vehicles: {
            vinAvailable: true,
            vin: '0',
            type: 'motorcycle',
            year: '',
            make: '',
            model: '',
            color: '',
            lotNumber: '',
            licensePlate: '',
            licenseStateOrProvince: '',
            notes: '',
            inoperable: false,
            oversized: false,
            availableDate: '',
            desiredDeliveryDate: '',
            expirationDate: '',
        },
    });

    const steps = ['Pickup Location', 'Delivery Location', 'Vehicle Details', 'Payment Info', 'Review'];

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10,15}$/; // Basic check for 10-15 digits
        return phoneRegex.test(phone.replace(/\D/g, ''));
    };

    const validatePostalCode = (postalCode) => {
        if (!postalCode) return true;
        const postalCodeRegex = /^[A-Za-z0-9\-\s]{3,10}$/;
        return postalCodeRegex.test(postalCode);
    };

    const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const calculateExpirationDate = (dateString) => {
        if (!dateString) return '';
        const parsedDate = new Date(dateString);
        if (Number.isNaN(parsedDate.getTime())) return '';
        parsedDate.setMonth(parsedDate.getMonth() + 1);
        return formatDateForInput(parsedDate);
    };

    const validateStep = (step) => {
        setStepError("");
        switch (step) {
            case 0: { // Pickup Location
                const pickup = formData.pickupLocation;
                if (pickup.contactEmail && !validateEmail(pickup.contactEmail)) {
                    setStepError("Please enter a valid email for pickup contact.");
                    return false;
                }
                if (pickup.contactEmail && !validateEmail(pickup.contactEmail)) {
                    setStepError("Please enter a valid email for pickup contact.");
                    return false;
                }
                if (pickup.contactPhone && !validatePhone(pickup.contactPhone)) {
                    setStepError("Please enter a valid phone number for pickup contact.");
                    return false;
                }
                if (pickup.contactCell && !validatePhone(pickup.contactCell)) {
                    setStepError("Please enter a valid cell number for pickup contact.");
                    return false;
                }
                if (pickup.postalCode && !validatePostalCode(pickup.postalCode)) {
                    setStepError("Please enter a valid postal code for pickup location.");
                    return false;
                }
                break;
            }
            case 1: { // Delivery Location
                const delivery = formData.deliveryLocation;
                if (delivery.contactEmail && !validateEmail(delivery.contactEmail)) {
                    setStepError("Please enter a valid email for delivery contact.");
                    return false;
                }
                if (delivery.contactEmail && !validateEmail(delivery.contactEmail)) {
                    setStepError("Please enter a valid email for delivery contact.");
                    return false;
                }
                if (delivery.contactPhone && !validatePhone(delivery.contactPhone)) {
                    setStepError("Please enter a valid phone number for delivery contact.");
                    return false;
                }
                if (delivery.contactCell && !validatePhone(delivery.contactCell)) {
                    setStepError("Please enter a valid cell number for delivery contact.");
                    return false;
                }
                if (delivery.postalCode && !validatePostalCode(delivery.postalCode)) {
                    setStepError("Please enter a valid postal code for delivery location.");
                    return false;
                }
                break;
            }
            case 2: { // Vehicle Details
                const vehicle = formData.vehicles;
                if (!vehicle.type || !vehicle.year || !vehicle.make || !vehicle.model) {
                    setStepError("Please fill in the required vehicle fields.");
                    return false;
                }
                if (isNaN(parseInt(vehicle.year)) || parseInt(vehicle.year) < 1900 || parseInt(vehicle.year) > new Date().getFullYear() + 1) {
                    setStepError("Please enter a valid year for the vehicle.");
                    return false;
                }
                if (!vehicle.availableDate || !vehicle.desiredDeliveryDate) {
                    setStepError("Please fill in the required vehicle dates.");
                    return false;
                }
                break;
            }
            case 3: { // Payment Info
                if (!formData.trailerType) {
                    setStepError("Please select a trailer type.");
                    return false;
                }
                if (!formData.quotedPriceUsd) {
                    setStepError("Please enter a quoted price.");
                    return false;
                }
                if (isNaN(parseFloat(formData.quotedPriceUsd)) || parseFloat(formData.quotedPriceUsd) <= 0) {
                    setStepError("Quoted Price must be a valid positive number.");
                    return false;
                }
                if (!formData.agreedToTerms) {
                    setStepError("Please agree to the terms and conditions.");
                    return false;
                }
                break;
            }
            default:
                break;
        }
        return true;
    };

    const handleChange = (e, section, field, index) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        let targetSection, targetField;
        if (section && field) {
            targetSection = section;
            targetField = field;
        } else {
            const name = e.target.name;
            if (name.startsWith("pickup")) {
                targetSection = "pickupLocation";
                targetField = name.replace("pickup", "").charAt(0).toLowerCase() + name.replace("pickup", "").slice(1);
            } else if (name.startsWith("delivery")) {
                targetSection = "deliveryLocation";
                targetField = name.replace("delivery", "").charAt(0).toLowerCase() + name.replace("delivery", "").slice(1);
            } else if (name.startsWith("vehicles")) {
                targetSection = "vehicles";
                targetField = name.replace("vehicle", "").charAt(0).toLowerCase() + name.replace("vehicle", "").slice(1);
            } else {
                targetSection = null;
                targetField = name;
            }
        }

        if (targetSection === "vehicles" && targetField === "availableDate") {
            const expirationDate = calculateExpirationDate(value);
            setFormData((prev) => ({
                ...prev,
                vehicles: { ...prev.vehicles, availableDate: value, expirationDate },
            }));
            return;
        }

        if (targetSection) {
            if (targetSection === "vehicles") {
                setFormData((prev) => ({
                    ...prev,
                    vehicles: { ...prev.vehicles, [targetField]: value },
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    [targetSection]: { ...prev[targetSection], [targetField]: value },
                }));
            }
        } else {
            setFormData((prev) => ({ ...prev, [targetField]: value }));
        }
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep((prev) => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
        window.scrollTo(0, 0);
    };

    // Transform form data to API format
    const transformFormData = (data) => {
        const typeMapping = {
            residential: 'RESIDENCE',
            residence: 'RESIDENCE',
            business: 'BUSINESS',
            dealership: 'DEALERSHIP',
            auction: 'AUCTION',
            port: 'PORT',
            terminal: 'TERMINAL',
            other: 'OTHER'
        };

        const vehicleTypeMapping = {
            car: 'CAR',
            sedan: 'CAR',
            suv: 'SUV',
            truck: 'TRUCK',
            van: 'VAN',
            motorcycle: 'MOTORCYCLE',
            other: 'OTHER'
        };

        const formatDateToISO = (dateString) => {
            if (!dateString) return null;
            const date = new Date(dateString);
            return date.toISOString();
        };

        const vehiclePayload = {
            vinAvailable: data.vehicles.vinAvailable,
            type: vehicleTypeMapping[data.vehicles.type] || data.vehicles.type.toUpperCase(),
            year: parseInt(data.vehicles.year),
            make: data.vehicles.make,
            model: data.vehicles.model,
            color: data.vehicles.color,
            notes: data.vehicles.notes,
            inoperable: data.vehicles.inoperable,
            oversized: data.vehicles.oversized,
            availableDate: formatDateToISO(data.vehicles.availableDate),
            desiredDeliveryDate: formatDateToISO(data.vehicles.desiredDeliveryDate)
        };

        if (data.vehicles.vin && data.vehicles.vinAvailable) {
            vehiclePayload.vin = data.vehicles.vin;
        }

        if (data.vehicles.lotNumber) {
            vehiclePayload.lotNumber = Number(data.vehicles.lotNumber);
        }

        if (data.vehicles.licensePlate) {
            vehiclePayload.licensePlate = data.vehicles.licensePlate;
        }

        if (data.vehicles.licenseStateOrProvince) {
            vehiclePayload.licenseStateOrProvince = data.vehicles.licenseStateOrProvince;
        }

        return {
            trailerType: data.trailerType,
            quotedPriceUsd: parseFloat(data.quotedPriceUsd),
            agreedToTerms: data.agreedToTerms,
            status: data.status || undefined,
            pickupLocation: {
                type: typeMapping[data.pickupLocation.type] || data.pickupLocation.type.toUpperCase(),
                name: data.pickupLocation.name,
                addressLine: data.pickupLocation.addressLine,
                city: data.pickupLocation.city,
                stateOrProvince: data.pickupLocation.stateOrProvince,
                postalCode: data.pickupLocation.postalCode,
                country: data.pickupLocation.country,
                contactName: data.pickupLocation.contactName,
                contactEmail: data.pickupLocation.contactEmail,
                contactPhone: data.pickupLocation.contactPhone,
                contactCell: data.pickupLocation.contactCell,
                buyerReferenceNumber: data.pickupLocation.buyerReferenceNumber,
                twicRequired: data.pickupLocation.twicRequired
            },
            deliveryLocation: {
                type: typeMapping[data.deliveryLocation.type] || data.deliveryLocation.type.toUpperCase(),
                name: data.deliveryLocation.name,
                addressLine: data.deliveryLocation.addressLine,
                city: data.deliveryLocation.city,
                stateOrProvince: data.deliveryLocation.stateOrProvince,
                postalCode: data.deliveryLocation.postalCode,
                country: data.deliveryLocation.country,
                contactName: data.deliveryLocation.contactName,
                contactEmail: data.deliveryLocation.contactEmail,
                contactPhone: data.deliveryLocation.contactPhone,
                contactCell: data.deliveryLocation.contactCell,
                buyerReferenceNumber: data.deliveryLocation.buyerReferenceNumber,
                twicRequired: data.deliveryLocation.twicRequired
            },
            vehicles: [vehiclePayload]
        };
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
            setApiError("Please fill in all required payment fields");
            return;
        }

        const vehicle = formData.vehicles;
        if (!vehicle.type || !vehicle.year || !vehicle.make || !vehicle.model || !vehicle.availableDate || !vehicle.desiredDeliveryDate) {
            setApiError("Please fill in all required vehicle details");
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
            // Transform data to API format
            const transformedData = transformFormData(formData);
            console.log(transformedData, "transformedData");

            const result = await dispatch(add_post(transformedData)).unwrap();
            setApiMessage(result.message || "Shipping quote submitted successfully!");

            // Redirect to dashboard after short delay
            if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
            redirectTimeoutRef.current = setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

            // Reset form
            setFormData({
                trailerType: 'ENCLOSED',
                quotedPriceUsd: '',
                agreedToTerms: false,
                pickupLocation: {
                    type: 'residential',
                    name: '',
                    addressLine: '',
                    city: '',
                    stateOrProvince: '',
                    postalCode: '',
                    country: '',
                    contactName: '',
                    contactEmail: '',
                    contactPhone: '',
                    contactCell: '',
                    buyerReferenceNumber: '',
                    twicRequired: false,
                },
                deliveryLocation: {
                    type: 'residential',
                    name: '',
                    addressLine: '',
                    city: '',
                    stateOrProvince: '',
                    postalCode: '',
                    country: '',
                    contactName: '',
                    contactEmail: '',
                    contactPhone: '',
                    contactCell: '',
                    buyerReferenceNumber: '',
                    twicRequired: false,
                },
                vehicles: {
                    vinAvailable: true,
                    vin: '',
                    type: 'motorcycle',
                    year: '',
                    make: '',
                    model: '',
                    color: '',
                    lotNumber: '',
                    licensePlate: '',
                    licenseStateOrProvince: '',
                    notes: '',
                    inoperable: false,
                    oversized: false,
                    availableDate: '',
                    desiredDeliveryDate: '',
                    expirationDate: '',
                },
            });
            setActiveStep(0);
        } catch (error) {
            // error is the rejection payload from thunk (string or object)
            const errorMsg = typeof error === "string" ? error : error?.message || "Failed to submit quote";
            setApiError(errorMsg);
            console.error("Submission error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        return () => {
            if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
            }
        };
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/dashboard')}
                    sx={{ mb: 3 }}
                >
                    Back to Dashboard
                </Button>

                <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                    <Typography variant="h4" gutterBottom color="primary">
                        Create Shipment Listing
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        Fill out the details below to post your shipment
                    </Typography>

                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepButton onClick={() => setActiveStep(index)}>
                                    {label}
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>

                    {/* Step Error Alert */}
                    {stepError && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setStepError("")}>
                            {stepError}
                        </Alert>
                    )}

                    <form onSubmit={(e) => e.preventDefault()}>
                        {/* Step 0: Pickup Location */}
                        {activeStep === 0 && (
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                                    Pickup Location Details
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Location Type</InputLabel>
                                            <Select
                                                value={formData.pickupLocation.type}
                                                onChange={(e) => handleChange(e, "pickupLocation", "type")}
                                                label="Location Type"
                                            >
                                                <MenuItem value="residential">Residential</MenuItem>
                                                <MenuItem value="business">Business</MenuItem>
                                                <MenuItem value="dealership">Dealership</MenuItem>
                                                <MenuItem value="auction">Auction</MenuItem>
                                                <MenuItem value="port">Port</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Location Name"
                                            value={formData.pickupLocation.name}
                                            onChange={(e) => handleChange(e, "pickupLocation", "name")}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Address Line"
                                            value={formData.pickupLocation.addressLine}
                                            onChange={(e) => handleChange(e, "pickupLocation", "addressLine")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="City"
                                            value={formData.pickupLocation.city}
                                            onChange={(e) => handleChange(e, "pickupLocation", "city")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="State/Province"
                                            name="pickupStateOrProvince"
                                            value={formData.pickupLocation.stateOrProvince}
                                            onChange={(e) => handleChange(e, "pickupLocation", "stateOrProvince")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Postal Code"
                                            name="pickupPostalCode"
                                            value={formData.pickupLocation.postalCode}
                                            onChange={(e) => handleChange(e, "pickupLocation", "postalCode")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Country"
                                            name="pickupCountry"
                                            value={formData.pickupLocation.country}
                                            onChange={(e) => handleChange(e, "pickupLocation", "country")}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box sx={{ mt: 3, mb: 1 }}>
                                            <Divider sx={{ mb: 2 }} />
                                            <Typography variant="subtitle1" gutterBottom>
                                                Contact Information
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Contact Name"
                                            name="pickupContactName"
                                            value={formData.pickupLocation.contactName}
                                            onChange={(e) => handleChange(e, "pickupLocation", "contactName")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Contact Email"
                                            name="pickupContactEmail"
                                            type="email"
                                            value={formData.pickupLocation.contactEmail}
                                            onChange={(e) => handleChange(e, "pickupLocation", "contactEmail")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Contact Phone"
                                            name="pickupContactPhone"
                                            value={formData.pickupLocation.contactPhone}
                                            onChange={(e) => handleChange(e, "pickupLocation", "contactPhone")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Contact Cell"
                                            name="pickupContactCell"
                                            value={formData.pickupLocation.contactCell}
                                            onChange={(e) => handleChange(e, "pickupLocation", "contactCell")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Buyer Reference Number"
                                            name="pickupBuyerReferenceNumber"
                                            value={formData.pickupLocation.buyerReferenceNumber}
                                            onChange={(e) => handleChange(e, "pickupLocation", "buyerReferenceNumber")}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="pickupTwicRequired"
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
                                            label="TWIC (Transportation Worker Identification Credential) Required"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Step 1: Delivery Location */}
                        {activeStep === 1 && (
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                                    Delivery Location Details
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Location Type</InputLabel>
                                            <Select
                                                name="deliveryLocationType"
                                                value={formData.deliveryLocation.type}
                                                onChange={(e) => handleChange(e, "deliveryLocation", "type")}
                                                label="Location Type"
                                            >
                                                <MenuItem value="residential">Residential</MenuItem>
                                                <MenuItem value="business">Business</MenuItem>
                                                <MenuItem value="dealership">Dealership</MenuItem>
                                                <MenuItem value="auction">Auction</MenuItem>
                                                <MenuItem value="port">Port</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Location Name"
                                            name="deliveryLocationName"
                                            value={formData.deliveryLocation.name}
                                            onChange={(e) => handleChange(e, "deliveryLocation", "name")}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Address Line"
                                            name="deliveryAddressLine"
                                            value={formData.deliveryLocation.addressLine}
                                            onChange={(e) => handleChange(e, "deliveryLocation", "addressLine")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="City"
                                            name="deliveryCity"
                                            value={formData.deliveryLocation.city}
                                            onChange={(e) => handleChange(e, "deliveryLocation", "city")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="State/Province"
                                            name="deliveryStateOrProvince"
                                            value={formData.deliveryLocation.stateOrProvince}
                                            onChange={(e) => handleChange(e, "deliveryLocation", "stateOrProvince")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Postal Code"
                                            name="deliveryPostalCode"
                                            value={formData.deliveryLocation.postalCode}
                                            onChange={(e) => handleChange(e, "deliveryLocation", "postalCode")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Country"
                                            name="deliveryCountry"
                                            value={formData.deliveryLocation.country}
                                            onChange={(e) => handleChange(e, "deliveryLocation", "country")}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box sx={{ mt: 3, mb: 1 }}>
                                            <Divider sx={{ mb: 2 }} />
                                            <Typography variant="subtitle1" gutterBottom>
                                                Contact Information
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Contact Name"
                                            name="deliveryContactName"
                                            value={formData.deliveryLocation.contactName}
                                            onChange={(e) => handleChange(e, "deliveryLocation", "contactName")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Contact Email"
                                            name="deliveryContactEmail"
                                            type="email"
                                            value={formData.deliveryLocation.contactEmail}
                                            onChange={(e) => handleChange(e, "deliveryLocation", "contactEmail")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Contact Phone"
                                            name="deliveryContactPhone"
                                            value={formData.deliveryLocation.contactPhone}
                                            onChange={(e) => handleChange(e, "deliveryLocation", "contactPhone")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Contact Cell"
                                            name="deliveryContactCell"
                                            value={formData.deliveryLocation.contactCell}
                                            onChange={(e) => handleChange(e, "deliveryLocation", "contactCell")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Buyer Reference Number"
                                            name="deliveryBuyerReferenceNumber"
                                            value={formData.deliveryLocation.buyerReferenceNumber}
                                            onChange={(e) => handleChange(e, "deliveryLocation", "buyerReferenceNumber")}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="deliveryTwicRequired"
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
                                            label="TWIC (Transportation Worker Identification Credential) Required"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Step 2: Vehicle Details */}
                        {activeStep === 2 && (
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6">
                                        Vehicle Information
                                    </Typography>
                                    <Button variant="text" onClick={() => setPriceModalOpen(true)}>
                                        Check Prices
                                    </Button>
                                </Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    name="vehicleVinAvailable"
                                                    checked={formData.vehicles.vinAvailable}
                                                    onChange={(e) => {
                                                        const available = e.target.checked;
                                                        setFormData({
                                                            ...formData,
                                                            vehicles: {
                                                                ...formData.vehicles,
                                                                vinAvailable: available,
                                                                vin: available ? formData.vehicles.vin : '',
                                                            },
                                                        });
                                                    }}
                                                    color="primary"
                                                />
                                            }
                                            label="VIN Available"
                                        />
                                    </Grid>
                                    {formData.vehicles.vinAvailable && (
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="VIN (Vehicle Identification Number)"
                                                name="vehicleVin"
                                                value={formData.vehicles.vin}
                                                onChange={(e) => handleChange(e, "vehicles", "vin")}
                                                required
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                    )}
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Vehicle Type</InputLabel>
                                            <Select
                                                name="vehicleType"
                                                value={formData.vehicles.type}
                                                onChange={(e) => handleChange(e, "vehicles", "type")}
                                                label="Vehicle Type"
                                            >
                                                <MenuItem value="car">Car</MenuItem>
                                                <MenuItem value="suv">SUV</MenuItem>
                                                <MenuItem value="truck">Truck</MenuItem>
                                                <MenuItem value="van">Van</MenuItem>
                                                <MenuItem value="motorcycle">Motorcycle</MenuItem>
                                                <MenuItem value="other">Other</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Year"
                                            name="vehicleYear"
                                            type="number"
                                            value={formData.vehicles.year}
                                            onChange={(e) => handleChange(e, "vehicles", "year")}
                                            required
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Make"
                                            name="vehicleMake"
                                            value={formData.vehicles.make}
                                            onChange={(e) => handleChange(e, "vehicles", "make")}
                                            required
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Model"
                                            name="vehicleModel"
                                            value={formData.vehicles.model}
                                            onChange={(e) => handleChange(e, "vehicles", "model")}
                                            required
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Color"
                                            name="vehicleColor"
                                            value={formData.vehicles.color}
                                            onChange={(e) => handleChange(e, "vehicles", "color")}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Lot Number"
                                            name="vehicleLotNumber"
                                            value={formData.vehicles.lotNumber}
                                            onChange={(e) => handleChange(e, "vehicles", "lotNumber")}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="License Plate"
                                            name="vehicleLicensePlate"
                                            value={formData.vehicles.licensePlate}
                                            onChange={(e) => handleChange(e, "vehicles", "licensePlate")}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="License State/Province"
                                            name="vehicleLicenseStateOrProvince"
                                            value={formData.vehicles.licenseStateOrProvince}
                                            onChange={(e) => handleChange(e, "vehicles", "licenseStateOrProvince")}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Vehicle Notes"
                                            name="vehicleNotes"
                                            multiline
                                            rows={3}
                                            value={formData.vehicles.notes}
                                            onChange={(e) => handleChange(e, "vehicles", "notes")}
                                            placeholder="Any special notes about the vehicle condition"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="vehicleInoperable"
                                                    checked={formData.vehicles.inoperable}
                                                    onChange={(e) => handleChange(e, "vehicles", "inoperable")}
                                                />
                                            }
                                            label="Vehicle is inoperable (not running)"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="vehicleOversized"
                                                    checked={formData.vehicles.oversized}
                                                    onChange={(e) => handleChange(e, "vehicles", "oversized")}
                                                />
                                            }
                                            label="Vehicle is oversized"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="subtitle1" gutterBottom>
                                            Dates
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            label="Available Date"
                                            name="vehicleAvailableDate"
                                            type="date"
                                            value={formData.vehicles.availableDate}
                                            onChange={(e) => handleChange(e, "vehicles", "availableDate")}
                                            InputLabelProps={{ shrink: true }}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            label="Desired Delivery Date"
                                            name="vehicleDesiredDeliveryDate"
                                            type="date"
                                            value={formData.vehicles.desiredDeliveryDate}
                                            onChange={(e) => handleChange(e, "vehicles", "desiredDeliveryDate")}
                                            InputLabelProps={{ shrink: true }}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            label="Calculated Expiration Date"
                                            name="vehicleExpirationDate"
                                            type="date"
                                            value={formData.vehicles.expirationDate}
                                            InputLabelProps={{ shrink: true }}
                                            helperText="Calculated automatically one month after the available date"
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Step 3: Payment Info */}
                        {activeStep === 3 && (
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                                    Payment Information
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={12} lg={6} >
                                        <TextField
                                            select
                                            fullWidth
                                            required
                                            label="Trailer Type"
                                            name="trailerType"
                                            sx={{ width: '100%' }}
                                            value={formData.trailerType}
                                            onChange={(e) => handleChange(e, null, "trailerType")}
                                        >
                                            {['OPEN', 'ENCLOSED', 'FLATBED', 'OTHER'].map((type) => (
                                                <MenuItem key={type} value={type}>
                                                    {type}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Quoted Price (USD)"
                                            name="quotedPriceUsd"
                                            type="number"
                                            value={formData.quotedPriceUsd}
                                            onChange={(e) => handleChange(e, null, "quotedPriceUsd")}
                                            required
                                            InputProps={{ startAdornment: '$' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="agreedToTerms"
                                                    checked={formData.agreedToTerms}
                                                    onChange={handleChange}
                                                />
                                            }
                                            label="I agree to the terms and conditions. I understand this platform is not responsible for disputes, damages, or payments."
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Step 4: Review */}
                        {activeStep === 4 && (
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                                    Review Your Listing
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                General Information
                                            </Typography>
                                            <Typography variant="body2">Trailer Type: {formData.trailerType}</Typography>
                                            <Typography variant="body2">Quoted Price: ${formData.quotedPriceUsd}</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Pickup Location
                                            </Typography>
                                            <Typography variant="body2">{formData.pickupLocation.name}</Typography>
                                            <Typography variant="body2">{formData.pickupLocation.addressLine}</Typography>
                                            <Typography variant="body2">
                                                {formData.pickupLocation.city}, {formData.pickupLocation.stateOrProvince} {formData.pickupLocation.postalCode}
                                            </Typography>
                                            <Typography variant="body2">Contact: {formData.pickupLocation.contactName}</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Delivery Location
                                            </Typography>
                                            <Typography variant="body2">{formData.deliveryLocation.name}</Typography>
                                            <Typography variant="body2">{formData.deliveryLocation.addressLine}</Typography>
                                            <Typography variant="body2">
                                                {formData.deliveryLocation.city}, {formData.deliveryLocation.stateOrProvince} {formData.deliveryLocation.postalCode}
                                            </Typography>
                                            <Typography variant="body2">Contact: {formData.deliveryLocation.contactName}</Typography>
                                        </Paper>
                                    </Grid>
                                    
                                </Grid>
                            </Box>
                        )}

                        <Divider sx={{ my: 4 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                    type="button"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    variant="outlined"
                                >
                                    Back
                                </Button>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {activeStep < steps.length - 1 ? (
                                    <Button
                                        type="button"
                                        variant="contained"
                                        onClick={handleNext}
                                        color="primary"
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Listing'}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </form>

                    <Dialog open={priceModalOpen} onClose={() => setPriceModalOpen(false)} fullWidth maxWidth="md">
                        <DialogTitle>Vehicle Price Comparison</DialogTitle>
                        <DialogContent dividers>
                            <Box sx={{ display: 'grid', gap: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Compare vehicle prices by type, model, make, country, and city.
                                </Typography>
                                <Box sx={{ overflowX: 'auto' }}>
                                    <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <Box component="thead">
                                            <Box component="tr" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                                                <Box component="th" sx={{ textAlign: 'left', p: 1 }}>Type</Box>
                                                <Box component="th" sx={{ textAlign: 'left', p: 1 }}>Make</Box>
                                                <Box component="th" sx={{ textAlign: 'left', p: 1 }}>Model</Box>
                                                <Box component="th" sx={{ textAlign: 'left', p: 1 }}>Country</Box>
                                                <Box component="th" sx={{ textAlign: 'left', p: 1 }}>City</Box>
                                                <Box component="th" sx={{ textAlign: 'left', p: 1 }}>Price</Box>
                                            </Box>
                                        </Box>
                                        <Box component="tbody">
                                            {[
                                                { type: 'Sedan', make: 'Toyota', model: 'Camry', country: 'USA', city: 'Los Angeles', price: '$120' },
                                                { type: 'SUV', make: 'Honda', model: 'CR-V', country: 'Canada', city: 'Toronto', price: '$140' },
                                                { type: 'Truck', make: 'Ford', model: 'F-150', country: 'USA', city: 'Houston', price: '$160' },
                                                { type: 'Van', make: 'Mercedes', model: 'Sprinter', country: 'Germany', city: 'Berlin', price: '$130' },
                                                { type: 'Motorcycle', make: 'Yamaha', model: 'MT-07', country: 'Japan', city: 'Tokyo', price: '$80' },
                                                { type: 'Boat', make: 'Bayliner', model: 'Element', country: 'USA', city: 'Miami', price: '$200' },
                                                { type: 'RV', make: 'Winnebago', model: 'Travato', country: 'USA', city: 'Orlando', price: '$180' },
                                                { type: 'Other', make: 'Custom', model: 'Utility', country: 'UK', city: 'London', price: '$150' },
                                            ].map((row) => (
                                                <Box component="tr" key={`${row.type}-${row.make}-${row.model}`} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                                                    <Box component="td" sx={{ p: 1 }}>{row.type}</Box>
                                                    <Box component="td" sx={{ p: 1 }}>{row.make}</Box>
                                                    <Box component="td" sx={{ p: 1 }}>{row.model}</Box>
                                                    <Box component="td" sx={{ p: 1 }}>{row.country}</Box>
                                                    <Box component="td" sx={{ p: 1 }}>{row.city}</Box>
                                                    <Box component="td" sx={{ p: 1 }}>{row.price}</Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setPriceModalOpen(false)}>
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>

                </Paper>

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
            </Container>
        </Box>
    );
}
