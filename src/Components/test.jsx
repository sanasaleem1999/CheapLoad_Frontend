import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Chip,
    Divider,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Alert,
    Snackbar,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import { get_post_by_id } from '../Store/postReducer';


// Mock dispatcher data
const mockDispatchers = [
    { id: '1', name: 'John Smith', email: 'john.smith@dispatch.com', phone: '(555) 123-4567', activeLoads: 12 },
    { id: '2', name: 'Sarah Johnson', email: 'sarah.j@dispatch.com', phone: '(555) 234-5678', activeLoads: 8 },
    { id: '3', name: 'Michael Brown', email: 'michael.b@dispatch.com', phone: '(555) 345-6789', activeLoads: 15 },
    { id: '4', name: 'Emily Davis', email: 'emily.d@dispatch.com', phone: '(555) 456-7890', activeLoads: 5 },
    { id: '5', name: 'David Wilson', email: 'david.w@dispatch.com', phone: '(555) 567-8901', activeLoads: 10 },
    { id: '6', name: 'Jennifer Martinez', email: 'jennifer.m@dispatch.com', phone: '(555) 678-9012', activeLoads: 7 },
];

export default function Test() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const postFromState = useSelector((state) => state.posts?.currentPost);
    const loading = useSelector((state) => state.posts?.loading);
    const postFromLocation = location.state?.post;
    const queryId = new URLSearchParams(location.search).get('id');
    const post = postFromLocation || postFromState;

    // If a post wasn't provided via navigation state, fetch by id from query params
    useEffect(() => {
        if (!postFromLocation && queryId) {
            dispatch(get_post_by_id(queryId));
        }
    }, [dispatch, postFromLocation, queryId]);
     

    // Hooks must be called unconditionally and in the same order on every render
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDispatcher, setSelectedDispatcher] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    

    if (!post) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h5">{loading ? 'Loading post...' : 'Post not found'}</Typography>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
                    Back to Dashboard
                </Button>
            </Container>
        );
    }

   

    const filteredDispatchers = mockDispatchers.filter((dispatcher) =>
        dispatcher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dispatcher.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAssignDispatcher = (dispatcher) => {
        setSelectedDispatcher(dispatcher);
        setAssignModalOpen(false);
        setSnackbarMessage(`Successfully assigned dispatcher: ${dispatcher.name}`);
        setSnackbarOpen(true);
    };

    const handleUpdate = () => {
        navigate('/create-post', { state: { post, isEditing: true } });
    };

    const handleDeleteConfirm = () => {
        setDeleteConfirmOpen(false);
        setSnackbarMessage('Post deleted successfully');
        setSnackbarOpen(true);
        setTimeout(() => {
            navigate('/dashboard');
        }, 1500);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'not signed':
                return 'warning';
            case 'assigned':
                return 'info';
            case 'picked up':
                return 'primary';
            case 'delivered':
                return 'success';
            default:
                return 'default';
        }
    };

    return (
        <Box sx={{ bgcolor: '#F9FAFB', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/dashboard')}
                        sx={{ mb: 2 }}
                    >
                        Back to Dashboard
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="h4" sx={{ mb: 0.5 }}>
                                Shipment Details
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                ID: {post._id}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <Chip
                                label={post.status}
                                // color={post.status}
                                sx={{ px: 2, py: 2.5 }}
                            />
                        </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            startIcon={<AssignmentIndIcon />}
                            onClick={() => setAssignModalOpen(true)}
                            sx={{ bgcolor: '#1447E6' }}
                        >
                            Assign Dispatcher
                        </Button>
                        <IconButton
                            aria-label="more options"
                            onClick={(event) => setAnchorEl(event.currentTarget)}
                            sx={{
                                border: '1px solid #e0e0e0',
                                borderRadius: 1,
                                '&:hover': {
                                    bgcolor: '#f5f5f5'
                                }
                            }}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                        >
                            <MenuItem onClick={() => {
                                setAnchorEl(null);
                                handleUpdate();
                            }}>
                                <ListItemIcon>
                                    <EditIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Update Post</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => {
                                setAnchorEl(null);
                                setDeleteConfirmOpen(true);
                            }}>
                                <ListItemIcon>
                                    <DeleteIcon fontSize="small" color="error" />
                                </ListItemIcon>
                                <ListItemText sx={{ color: 'error.main' }}>Delete Post</ListItemText>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>

                {/* Assigned Dispatcher Info (if assigned) */}
                {selectedDispatcher && (
                    <Paper elevation={2} sx={{ mb: 2, borderRadius: 2, bgcolor: '#E3F2FD' }}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                                Assigned Dispatcher
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar>
                                    <AssignmentIndIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {selectedDispatcher.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedDispatcher.email} • {selectedDispatcher.phone}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                )}

                {/* Overview Section */}
                <Paper elevation={2} sx={{ mb: 2, borderRadius: 2 }}>
                    <Box sx={{ p: 2, bgcolor: '#1447E6', color: 'white', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center' }}>
                        <LocalShippingIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Shipment Overview</Typography>
                    </Box>
                    <TableContainer>
                        <Table size="small">
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, width: '25%' }}>Trailer Type</TableCell>
                                    <TableCell sx={{ width: '25%' }}>{post.trailerType}</TableCell>
                                    <TableCell sx={{ fontWeight: 600, width: '25%' }}>Quoted Price</TableCell>
                                    <TableCell sx={{ width: '25%', color: 'success.main', fontWeight: 600 }}>
                                        ${post.quotedPriceUsd?.toLocaleString() || 'N/A'}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Terms Agreement</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={post.agreedToTerms ? 'Agreed' : 'Not Agreed'}
                                            color={post.agreedToTerms ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Created Date</TableCell>
                                    <TableCell>{formatDate(post.createdAt)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* Pickup and Delivery Locations */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    {/* Pickup Location */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
                            <Box sx={{ p: 2, bgcolor: '#1447E6', color: 'white', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center' }}>
                                <LocationOnIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">Pickup Location</Typography>
                            </Box>
                            <TableContainer>
                                <Table size="small">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600, width: '40%' }}>Type</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {post.pickupLocationId?.type === 'RESIDENCE' ? (
                                                        <HomeIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                                    ) : (
                                                        <BusinessIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                                    )}
                                                    {post.pickupLocationId?.type || 'N/A'}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                                            <TableCell>{post.pickupLocationId?.name || 'N/A'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Address</TableCell>
                                            <TableCell>
                                                {post.pickupLocationId?.addressLine || 'N/A'}
                                                <br />
                                                {post.pickupLocationId?.city}, {post.pickupLocationId?.stateOrProvince} {post.pickupLocationId?.postalCode}
                                                <br />
                                                {post.pickupLocationId?.country}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Contact Name</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                    {post.pickupLocationId?.contactName || 'N/A'}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                    {post.pickupLocationId?.contactEmail || 'N/A'}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                    {post.pickupLocationId?.contactPhone || 'N/A'}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                        {post.pickupLocationId?.contactCell && (
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600 }}>Cell Phone</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                        {post.pickupLocationId.contactCell}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {post.pickupLocationId?.buyerReferenceNumber && (
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600 }}>Buyer Ref #</TableCell>
                                                <TableCell>{post.pickupLocationId.buyerReferenceNumber}</TableCell>
                                            </TableRow>
                                        )}
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>TWIC Required</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={post.pickupLocationId?.twicRequired ? 'Yes' : 'No'}
                                                    color={post.pickupLocationId?.twicRequired ? 'warning' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>

                    {/* Delivery Location */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
                            <Box sx={{ p: 2, bgcolor: '#1447E6', color: 'white', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center' }}>
                                <LocationOnIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">Delivery Location</Typography>
                            </Box>
                            <TableContainer>
                                <Table size="small">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600, width: '40%' }}>Type</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {post.deliveryLocationId?.type === 'RESIDENCE' ? (
                                                        <HomeIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                                    ) : (
                                                        <BusinessIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                                    )}
                                                    {post.deliveryLocationId?.type || 'N/A'}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                                            <TableCell>{post.deliveryLocationId?.name || 'N/A'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Address</TableCell>
                                            <TableCell>
                                                {post.deliveryLocationId?.addressLine || 'N/A'}
                                                <br />
                                                {post.deliveryLocationId?.city}, {post.deliveryLocationId?.stateOrProvince} {post.deliveryLocationId?.postalCode}
                                                <br />
                                                {post.deliveryLocationId?.country}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Contact Name</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                    {post.deliveryLocationId?.contactName || 'N/A'}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                    {post.deliveryLocationId?.contactEmail || 'N/A'}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                    {post.deliveryLocationId?.contactPhone || 'N/A'}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                        {post.deliveryLocationId?.contactCell && (
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600 }}>Cell Phone</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                        {post.deliveryLocationId.contactCell}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {post.deliveryLocationId?.buyerReferenceNumber && (
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600 }}>Buyer Ref #</TableCell>
                                                <TableCell>{post.deliveryLocationId.buyerReferenceNumber}</TableCell>
                                            </TableRow>
                                        )}
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>TWIC Required</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={post.deliveryLocationId?.twicRequired ? 'Yes' : 'No'}
                                                    color={post.deliveryLocationId?.twicRequired ? 'warning' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Vehicle Details */}
                <Paper elevation={2} sx={{ borderRadius: 2 }}>
                    <Box sx={{ p: 2, bgcolor: '#1447E6', color: 'white', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center' }}>
                        <DirectionsCarIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Vehicle Information</Typography>
                    </Box>

                    {post.vehicles && post.vehicles.length > 0 ? (
                        post.vehicles.map((vehicle, index) => (
                            <Box key={vehicle._id || index}>
                                {index > 0 && <Divider />}
                                <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                                    <Typography variant="h6" color="primary">
                                        {vehicle.year} {vehicle.make} {vehicle.model}
                                    </Typography>
                                </Box>
                                <TableContainer>
                                    <Table size="small">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600, width: '25%' }}>VIN</TableCell>
                                                <TableCell sx={{ width: '25%' }}>
                                                    {vehicle.vinAvailable ? vehicle.vin : 'Not Available'}
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 600, width: '25%' }}>Type</TableCell>
                                                <TableCell sx={{ width: '25%' }}>
                                                    <Chip label={vehicle.type} size="small" />
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600 }}>Color</TableCell>
                                                <TableCell>{vehicle.color}</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Lot Number</TableCell>
                                                <TableCell>{vehicle.lotNumber || 'N/A'}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600 }}>License Plate</TableCell>
                                                <TableCell>{vehicle.licensePlate || 'N/A'}</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>License State</TableCell>
                                                <TableCell>{vehicle.licenseStateOrProvince || 'N/A'}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600 }}>Condition</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        <Chip
                                                            label={vehicle.inoperable ? 'Inoperable' : 'Operable'}
                                                            color={vehicle.inoperable ? 'error' : 'success'}
                                                            size="small"
                                                        />
                                                        {vehicle.oversized && (
                                                            <Chip label="Oversized" color="warning" size="small" />
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Available Date</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                        {formatDate(vehicle.availableDate)}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600 }}>Desired Delivery</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                        {formatDate(vehicle.desiredDeliveryDate)}
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Expiration Date</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <CalendarTodayIcon sx={{ fontSize: 16, color: 'error.main' }} />
                                                        <Typography color="error.main">
                                                            {formatDate(vehicle.expirationDate)}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                            {vehicle.notes && (
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 600 }}>Notes</TableCell>
                                                    <TableCell colSpan={3} sx={{ fontStyle: 'italic' }}>
                                                        {vehicle.notes}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                                No vehicle information available
                            </Typography>
                        </Box>
                    )}
                </Paper>

                {/* Assign Dispatcher Modal */}
                <Dialog
                    open={assignModalOpen}
                    onClose={() => setAssignModalOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ bgcolor: '#1447E6', color: 'white', display: 'flex', alignItems: 'center' }}>
                        <AssignmentIndIcon sx={{ mr: 1 }} />
                        Assign Dispatcher
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                        <TextField
                            label="Search Dispatcher"
                            placeholder="Search by name or email..."
                            variant="outlined"
                            fullWidth
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                            }}
                            sx={{ mb: 2 }}
                        />
                        {filteredDispatchers.length > 0 ? (
                            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                                {filteredDispatchers.map((dispatcher) => (
                                    <ListItem
                                        key={dispatcher.id}
                                        disablePadding
                                        sx={{ mb: 1 }}
                                    >
                                        <ListItemButton
                                            onClick={() => handleAssignDispatcher(dispatcher)}
                                            sx={{
                                                borderRadius: 1,
                                                border: '1px solid #e0e0e0',
                                                '&:hover': {
                                                    bgcolor: '#f5f5f5',
                                                    borderColor: '#1447E6'
                                                }
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: '#1447E6' }}>
                                                    <AssignmentIndIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={dispatcher.name}
                                                secondary={
                                                    <>
                                                        <Typography variant="body2" component="span" display="block">
                                                            {dispatcher.email}
                                                        </Typography>
                                                        <Typography variant="body2" component="span" display="block">
                                                            {dispatcher.phone} • {dispatcher.activeLoads} active loads
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{ py: 4, textAlign: 'center' }}>
                                <Typography color="text.secondary">
                                    No dispatchers found matching your search
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={() => setAssignModalOpen(false)} variant="outlined">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                    <DialogTitle sx={{ color: 'error.main' }}>
                        <DeleteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Confirm Delete
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">
                            Are you sure you want to delete this post? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={() => setDeleteConfirmOpen(false)} variant="outlined">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirm} variant="contained" color="error">
                            Delete Post
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        onClose={() => setSnackbarOpen(false)}
                        severity="success"
                        sx={{ width: '100%' }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
}
