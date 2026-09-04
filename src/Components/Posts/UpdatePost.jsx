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
    FormControlLabel,
    Divider,
    Stepper,
    Alert,
    Step,
    StepLabel,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from "react-redux";
import { update_post, get_post_by_id } from "../../Store/postReducer";


export default function UpdatePost({ currentUser }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeStep, setActiveStep] = useState(0);
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.authentication);
    const currentPost = useSelector((state) => state.posts?.currentPost);
    const loading = useSelector((state) => state.posts?.loading);
    console.log(token, "token in Update Form");
    const [submitting, setSubmitting] = useState(false);
    const [apiMessage, setApiMessage] = useState("");
    const [apiError, setApiError] = useState("");
    const [stepError, setStepError] = useState("");
    const redirectTimeoutRef = useRef(null);

    const [formData, setFormData] = useState({
        // General Info
        trailerType: 'ENCLOSED',
        quotedPriceUsd: '',
        agreedToTerms: false,

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
            vinAvailable: 'yes',
            vin: '',
            type: '',
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

    const steps = ['General Info', 'Pickup Location', 'Delivery Location', 'Vehicle Details', 'Review'];

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10,15}$/; // Basic check for 10-15 digits
        return phoneRegex.test(phone.replace(/\D/g, ''));
    };

    const validateStep = (step) => {
        setStepError("");
        switch (step) {
            case 0: // General Info
                if (!formData.trailerType || !formData.quotedPriceUsd) {
                    setStepError("Please fill in Trailer Type and Quoted Price.");
                    return false;
                }
                if (isNaN(parseFloat(formData.quotedPriceUsd)) || parseFloat(formData.quotedPriceUsd) <= 0) {
                    setStepError("Quoted Price must be a valid positive number.");
                    return false;
                }
                break;
            case 1: // Pickup Location
                const pickup = formData.pickupLocation;
                if (!pickup.name || !pickup.addressLine || !pickup.city || !pickup.stateOrProvince || !pickup.postalCode || !pickup.country) {
                    setStepError("Please fill in all required pickup location fields.");
                    return false;
                }
                if (!pickup.contactName || !pickup.contactEmail || !pickup.contactPhone) {
                    setStepError("Please fill in contact details for pickup.");
                    return false;
                }
                if (!validateEmail(pickup.contactEmail)) {
                    setStepError("Please enter a valid email for pickup contact.");
                    return false;
                }
                if (!validatePhone(pickup.contactPhone)) {
                    setStepError("Please enter a valid phone number for pickup contact.");
                    return false;
                }
                break;
            case 2: // Delivery Location
                const delivery = formData.deliveryLocation;
                if (!delivery.name || !delivery.addressLine || !delivery.city || !delivery.stateOrProvince || !delivery.postalCode || !delivery.country) {
                    setStepError("Please fill in all required delivery location fields.");
                    return false;
                }
                if (!delivery.contactName || !delivery.contactEmail || !delivery.contactPhone) {
                    setStepError("Please fill in contact details for delivery.");
                    return false;
                }
                if (!validateEmail(delivery.contactEmail)) {
                    setStepError("Please enter a valid email for delivery contact.");
                    return false;
                }
                if (!validatePhone(delivery.contactPhone)) {
                    setStepError("Please enter a valid phone number for delivery contact.");
                    return false;
                }
                break;
            case 3: // Vehicle Details
                const vehicle = formData.vehicles;
                if (!vehicle.type || !vehicle.year || !vehicle.make || !vehicle.model || !vehicle.color) {
                    setStepError("Please fill in all required vehicle details.");
                    return false;
                }
                if (isNaN(parseInt(vehicle.year)) || parseInt(vehicle.year) < 1900 || parseInt(vehicle.year) > new Date().getFullYear() + 1) {
                    setStepError("Please enter a valid year for the vehicle.");
                    return false;
                }
                break;
            default:
                break;
        }
        return true;
    };

    const handleChange = (e, section, field, index) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        console.log(e.target.value,"value in here")
        console.log(e.target.name,"name in here")
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
        if (targetSection) {
            if (targetSection === "vehicles") {
                setFormData({
                    ...formData,
                    vehicles: { ...formData.vehicles, [targetField]: value },
                });
            } else {
                setFormData({
                    ...formData,
                    [targetSection]: { ...formData[targetSection], [targetField]: value },
                });
            }
        } else {
            setFormData({ ...formData, [targetField]: value });
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
    const transformFormData = (data, currentPost) => {
        const typeMapping = {
            residential: 'RESIDENCE',
            business: 'BUSINESS',
            dealership: 'DEALERSHIP',
            auction: 'AUCTION',
            port: 'PORT'
        };

        const vehicleTypeMapping = {
            sedan: 'CAR',
            suv: 'SUV',
            truck: 'TRUCK',
            van: 'VAN',
            motorcycle: 'MOTORCYCLE',
            boat: 'BOAT',
            rv: 'RV',
            other: 'OTHER'
        };

        const formatDateToISO = (dateString) => {
            if (!dateString) return null;
            const date = new Date(dateString);
            return date.toISOString();
        };

        const sanitizeLocationPayload = (location) => {
            if (!location || typeof location !== 'object') return location;
            return {
                type: location.type,
                name: location.name,
                addressLine: location.addressLine,
                city: location.city,
                stateOrProvince: location.stateOrProvince,
                postalCode: location.postalCode,
                country: location.country,
                contactName: location.contactName,
                contactEmail: location.contactEmail,
                contactPhone: location.contactPhone,
                contactCell: location.contactCell,
                buyerReferenceNumber: location.buyerReferenceNumber,
                twicRequired: location.twicRequired,
            };
        };

        const pickupLocationId = sanitizeLocationPayload(currentPost?.pickupLocationId);
        const deliveryLocationId = sanitizeLocationPayload(currentPost?.deliveryLocationId);

        return {
            trailerType: data.trailerType,
            pickupLocationId,
            deliveryLocationId,
            quotedPriceUsd: parseFloat(data.quotedPriceUsd),
            agreedToTerms: data.agreedToTerms,
            vehicles: [
                {
                    vinAvailable: data.vehicles.vinAvailable === 'yes',
                    vin: data.vehicles.vin || null,
                    type: vehicleTypeMapping[data.vehicles.type] || data.vehicles.type.toUpperCase(),
                    year: parseInt(data.vehicles.year),
                    make: data.vehicles.make,
                    model: data.vehicles.model,
                    color: data.vehicles.color,
                    lotNumber: data.vehicles.lotNumber,
                    licensePlate: data.vehicles.licensePlate,
                    licenseStateOrProvince: data.vehicles.licenseStateOrProvince,
                    notes: data.vehicles.notes,
                    inoperable: data.vehicles.inoperable,
                    oversized: data.vehicles.oversized,
                    availableDate: formatDateToISO(data.vehicles.availableDate),
                    desiredDeliveryDate: formatDateToISO(data.vehicles.desiredDeliveryDate),
                    expirationDate: formatDateToISO(data.vehicles.expirationDate)
                }
            ]
        };
    };

    // Reverse transform for populating form
    const populateFormData = (post) => {
        const reverseTypeMapping = {
            'RESIDENCE': 'residential',
            'BUSINESS': 'business',
            'DEALERSHIP': 'dealership',
            'AUCTION': 'auction',
            'PORT': 'port'
        };

        const reverseVehicleTypeMapping = {
            'CAR': 'sedan',
            'SUV': 'suv',
            'TRUCK': 'truck',
            'VAN': 'van',
            'MOTORCYCLE': 'motorcycle',
            'BOAT': 'boat',
            'RV': 'rv',
            'OTHER': 'other'
        };

        const formatDateFromISO = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toISOString().split('T')[0]; // YYYY-MM-DD
        };

        const pickup = post.pickupLocationId || {};
        const delivery = post.deliveryLocationId || {};
        const vehicle = post.vehicles && post.vehicles[0] ? post.vehicles[0] : {};

        const validTrailerTypes = ['OPEN', 'ENCLOSED'];
        const trailerType = validTrailerTypes.includes(post.trailerType) ? post.trailerType : 'OPEN';

        return {
            trailerType,
            quotedPriceUsd: post.quotedPriceUsd ? post.quotedPriceUsd.toString() : '',
            agreedToTerms: post.agreedToTerms || false,
            pickupLocation: {
                type: reverseTypeMapping[pickup.type] || pickup.type?.toLowerCase() || 'residential',
                name: pickup.name || '',
                addressLine: pickup.addressLine || '',
                city: pickup.city || '',
                stateOrProvince: pickup.stateOrProvince || '',
                postalCode: pickup.postalCode || '',
                country: pickup.country || '',
                contactName: pickup.contactName || '',
                contactEmail: pickup.contactEmail || '',
                contactPhone: pickup.contactPhone || '',
                contactCell: pickup.contactCell || '',
                buyerReferenceNumber: pickup.buyerReferenceNumber || '',
                twicRequired: pickup.twicRequired || false,
            },
            deliveryLocation: {
                type: reverseTypeMapping[delivery.type] || delivery.type?.toLowerCase() || 'residential',
                name: delivery.name || '',
                addressLine: delivery.addressLine || '',
                city: delivery.city || '',
                stateOrProvince: delivery.stateOrProvince || '',
                postalCode: delivery.postalCode || '',
                country: delivery.country || '',
                contactName: delivery.contactName || '',
                contactEmail: delivery.contactEmail || '',
                contactPhone: delivery.contactPhone || '',
                contactCell: delivery.contactCell || '',
                buyerReferenceNumber: delivery.buyerReferenceNumber || '',
                twicRequired: delivery.twicRequired || false,
            },
            vehicles: {
                vinAvailable: vehicle.vinAvailable ? 'yes' : 'no',
                vin: vehicle.vin || '',
                type: reverseVehicleTypeMapping[vehicle.type] || vehicle.type?.toLowerCase() || '',
                year: vehicle.year ? vehicle.year.toString() : '',
                make: vehicle.make || '',
                model: vehicle.model || '',
                color: vehicle.color || '',
                lotNumber: vehicle.lotNumber || '',
                licensePlate: vehicle.licensePlate || '',
                licenseStateOrProvince: vehicle.licenseStateOrProvince || '',
                notes: vehicle.notes || '',
                inoperable: vehicle.inoperable || false,
                oversized: vehicle.oversized || false,
                availableDate: formatDateFromISO(vehicle.availableDate),
                desiredDeliveryDate: formatDateFromISO(vehicle.desiredDeliveryDate),
                expirationDate: formatDateFromISO(vehicle.expirationDate),
            },
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
            setApiError("Please fill in all required fields");
            return;
        }

        const queryParams = new URLSearchParams(location.search);
        const postId = queryParams.get('id');
        console.log({ postId, formData }, "Update form submit payload");

        if (!postId) {
            setApiError("Missing post ID. Cannot update the listing.");
            return;
        }

        // Get token from Redux or localStorage
        const authToken = token || localStorage.getItem("token");
        console.log({ authToken }, "token before update");

        if (!authToken) {
            setApiError("Authentication token not found. Please login first.");
            return;
        }

        setSubmitting(true);

        try {
            // Transform data to API format
            const transformedData = transformFormData(formData, currentPost);
            console.log(transformedData, "transformedData");

            const result = await dispatch(update_post({ id: postId, data: transformedData })).unwrap();
            console.log(result, "update_post result");
            setApiMessage(result.message || "Shipping quote updated successfully!");

            // Redirect to dashboard after short delay
            if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
            redirectTimeoutRef.current = setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (error) {
            // error is the rejection payload from thunk (string or object)
            const errorMsg = typeof error === "string" ? error : error?.message || "Failed to update quote";
            setApiError(errorMsg);
            console.error("Update error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const postId = queryParams.get('id');
        if (postId) {
            dispatch(get_post_by_id(postId));
        }
    }, [dispatch, location.search]);

    useEffect(() => {
        if (currentPost && Object.keys(currentPost).length > 0) {
            const populatedData = populateFormData(currentPost);
            setFormData(populatedData);
        }
    }, [currentPost]);

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
                        Update Shipment Listing
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        Update the details below to modify your shipment listing
                    </Typography>

                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
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
                        {/* Step 0: General Info */}
                        {activeStep === 0 && (
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                                    General Information
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
                                            {["ENCLOSED", "OPEN"].map((type) => (
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
                                                    checked={formData.agreedToTerms}
                                                    onChange={(e) => handleChange(e, null, "agreedToTerms")}
                                                    name="agreedToTerms"
                                                />
                                            }
                                            label="I agree to the terms and conditions"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Step 1: Pickup Location */}
                        {activeStep === 1 && (
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                                    Pickup Location
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Type"
                                            name="pickupType"
                                            value={formData.pickupLocation.type}
                                            onChange={(e) => handleChange(e, "pickupLocation", "type")}
                                        >
                                            {[
                                                { value: 'residential', label: 'Residential' },
                                                { value: 'business', label: 'Business' },
                                                { value: 'dealership', label: 'Dealership' },
                                                { value: 'auction', label: 'Auction' },
                                                { value: 'port', label: 'Port' },
                                            ].map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            name="pickupName"
                                            value={formData.pickupLocation.name}
                                            onChange={(e) => handleChange(e, "pickupLocation", "name")}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Address Line"
                                            name="pickupAddressLine"
                                            value={formData.pickupLocation.addressLine}
                                            onChange={(e) => handleChange(e, "pickupLocation", "addressLine")}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="City"
                                            name="pickupCity"
                                            value={formData.pickupLocation.city}
                                            onChange={(e) => handleChange(e, "pickupLocation", "city")}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="State/Province"
                                            name="pickupStateOrProvince"
                                            value={formData.pickupLocation.stateOrProvince}
                                            onChange={(e) => handleChange(e, "pickupLocation", "stateOrProvince")}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Postal Code"
                                            name="pickupPostalCode"
                                            value={formData.pickupLocation.postalCode}
                                            onChange={(e) => handleChange(e, "pickupLocation", "postalCode")}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Country"
                                            name="pickupCountry"
                                            value={formData.pickupLocation.country}
                                            onChange={(e) => handleChange(e, "pickupLocation", "country")}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Contact Name"
                                            name="pickupContactName"
                                            value={formData.pickupLocation.contactName}
                                            onChange={(e) => handleChange(e, "pickupLocation", "contactName")}
                                            required
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
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Contact Phone"
                                            name="pickupContactPhone"
                                            value={formData.pickupLocation.contactPhone}
                                            onChange={(e) => handleChange(e, "pickupLocation", "contactPhone")}
                                            required
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
                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={formData.pickupLocation.twicRequired}
                                                    onChange={(e) => handleChange(e, "pickupLocation", "twicRequired")}
                                                    name="pickupTwicRequired"
                                                />
                                            }
                                            label="TWIC Required"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Step 2: Delivery Location */}
                        {activeStep === 2 && (
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                                    Delivery Location
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Type"
                                            name="deliveryType"
                                            value={formData.deliveryLocation.type}
                                            onChange={(e) => handleChange(e, "deliveryLocation", "type")}
                                        >
                                            {[
                                                { value: 'residential', label: 'Residential' },
                                                { value: 'business', label: 'Business' },
                                                { value: 'dealership', label: 'Dealership' },
                                                { value: 'auction', label: 'Auction' },
                                                { value: 'port', label: 'Port' },
                                            ].map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            name="deliveryName"
                                            value={formData.deliveryLocation.name}
                                            onChange={(e) => handleChange(e, "deliveryLocation", "name")}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Address Line"
                                            name="deliveryAddressLine"
                                            value={formData.deliveryLocation.addressLine}
                                            onChange={(e) => handleChange(e, "deliveryLocation", "addressLine")}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="City"
                                            name="deliveryCity"
                                            value={formData.deliveryLocation.city}
                                            onChange={(e) => handleChange(e, "deliveryLocation", "city")}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="State/Province"
                                            name="deliveryStateOrProvince"
                                            value={formData.deliveryLocation.stateOrProvince}
                                            onChange={(e) => handleChange(e, "deliveryLocation", "stateOrProvince")}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Postal Code"
                                            name="deliveryPostalCode"
                                            value={formData.deliveryLocation.postalCode}
                                            onChange={(e) => handleChange(e, "deliveryLocation", "postalCode")}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Country"
                                            name="deliveryCountry"
                                            value={formData.deliveryLocation.country}
                                            onChange={(e) => handleChange(e, "deliveryLocation", "country")}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Contact Name"
                                            name="deliveryContactName"
                                            value={formData.deliveryLocation.contactName}
                                            onChange={(e) => handleChange(e, "deliveryLocation", "contactName")}
                                            required
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
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Contact Phone"
                                            name="deliveryContactPhone"
                                            value={formData.deliveryLocation.contactPhone}
                                            onChange={(e) => handleChange(e, "deliveryLocation", "contactPhone")}
                                            required
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
                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={formData.deliveryLocation.twicRequired}
                                                    onChange={(e) => handleChange(e, "deliveryLocation", "twicRequired")}
                                                    name="deliveryTwicRequired"
                                                />
                                            }
                                            label="TWIC Required"
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Step 3: Vehicle Details */}
                        {activeStep === 3 && (
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                                    Vehicle Details
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="VIN Available"
                                            name="vehicleVinAvailable"
                                            value={formData.vehicles.vinAvailable}
                                            onChange={(e) => handleChange(e, "vehicles", "vinAvailable")}
                                        >
                                            {[
                                                { value: 'yes', label: 'Yes' },
                                                { value: 'no', label: 'No' },
                                            ].map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="VIN"
                                            name="vehicleVin"
                                            value={formData.vehicles.vin}
                                            onChange={(e) => handleChange(e, "vehicles", "vin")}
                                            disabled={formData.vehicles.vinAvailable === 'no'}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Type"
                                            name="vehicleType"
                                            value={formData.vehicles.type}
                                            onChange={(e) => handleChange(e, "vehicles", "type")}
                                            required
                                        >
                                            {[
                                                { value: 'sedan', label: 'Sedan' },
                                                { value: 'suv', label: 'SUV' },
                                                { value: 'truck', label: 'Truck' },
                                                { value: 'van', label: 'Van' },
                                                { value: 'motorcycle', label: 'Motorcycle' },
                                                { value: 'boat', label: 'Boat' },
                                                { value: 'rv', label: 'RV' },
                                                { value: 'other', label: 'Other' },
                                            ].map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
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
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Color"
                                            name="vehicleColor"
                                            value={formData.vehicles.color}
                                            onChange={(e) => handleChange(e, "vehicles", "color")}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Lot Number"
                                            name="vehicleLotNumber"
                                            value={formData.vehicles.lotNumber}
                                            onChange={(e) => handleChange(e, "vehicles", "lotNumber")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="License Plate"
                                            name="vehicleLicensePlate"
                                            value={formData.vehicles.licensePlate}
                                            onChange={(e) => handleChange(e, "vehicles", "licensePlate")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="License State/Province"
                                            name="vehicleLicenseStateOrProvince"
                                            value={formData.vehicles.licenseStateOrProvince}
                                            onChange={(e) => handleChange(e, "vehicles", "licenseStateOrProvince")}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Notes"
                                            name="vehicleNotes"
                                            multiline
                                            rows={3}
                                            value={formData.vehicles.notes}
                                            onChange={(e) => handleChange(e, "vehicles", "notes")}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={formData.vehicles.inoperable}
                                                    onChange={(e) => handleChange(e, "vehicles", "inoperable")}
                                                    name="vehicleInoperable"
                                                />
                                            }
                                            label="Inoperable"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={formData.vehicles.oversized}
                                                    onChange={(e) => handleChange(e, "vehicles", "oversized")}
                                                    name="vehicleOversized"
                                                />
                                            }
                                            label="Oversized"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Available Date"
                                            name="vehicleAvailableDate"
                                            type="date"
                                            value={formData.vehicles.availableDate}
                                            onChange={(e) => handleChange(e, "vehicles", "availableDate")}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Desired Delivery Date"
                                            name="vehicleDesiredDeliveryDate"
                                            type="date"
                                            value={formData.vehicles.desiredDeliveryDate}
                                            onChange={(e) => handleChange(e, "vehicles", "desiredDeliveryDate")}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Expiration Date"
                                            name="vehicleExpirationDate"
                                            type="date"
                                            value={formData.vehicles.expirationDate}
                                            onChange={(e) => handleChange(e, "vehicles", "expirationDate")}
                                            InputLabelProps={{ shrink: true }}
                                            helperText="Date when this listing expires"
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
                                        {submitting ? 'Updating...' : 'Update Listing'}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </form>
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