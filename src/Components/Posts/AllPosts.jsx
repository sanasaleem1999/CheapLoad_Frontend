import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Pagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ChatScreen from '../Chat/ChatScreen';
import { get_posts, update_post, delete_post } from '../../Store/postReducer';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../Header';
import { resetChat, setListingsPaneOpen } from '../../Store/chatReducer';
import { startChat } from '../../utils/socketClient';
import { getStoredUser } from '../../utils/storage';



export default function AllPosts({ status = 'listing' }) {
    const navigate = useNavigate();

    const postsState = useSelector((state) => state.posts || {});
    // console.log(postsState, "posts in all posts");
    const postsData = postsState.posts || {};
    console.log(postsData, "postsData in all posts");
    const posts = postsData.rows || [];
    const auth = useSelector((state) => state.authentication || {});
    const dispatch = useDispatch();
    // console.log(auth, "auth in dashboard");

    const [page, setPage] = useState(1);

    // Reset paging when the filter status changes (so new tab starts at page 1)
    useEffect(() => {
        setPage(1);
    }, [status]);

    const pageSize = postsData.pageSize || postsData.limit || 20;
    const totalItems = postsData.total || 0;
    const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1;

    const handlePageChange = (event, value) => {
        setPage(value);
        const params = { page: value };
        if (status && status !== 'listing') {
            params.status = status;
        }
        dispatch(get_posts(params));
    };

    // Keep local page in sync when the API returns a page value
    useEffect(() => {
        const apiPage = postsData.page || postsData.currentPage;
        if (apiPage && apiPage !== page) {
            setPage(apiPage);
        }
    }, [postsData.page, postsData.currentPage, page]);

    const user = auth.user || getStoredUser();
    const token = auth.token || localStorage.getItem('token');
    // console.log(token, "token in dashboard");
    const isLoggedIn = Boolean(user || token);

    



    return (
        <>
            {/* Recent Posts */}
            
            <Grid container spacing={3}>
                
                {posts.map((post) => (
                    <MainCard post={post} />
                ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, width: '100%' }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>

             

            {posts.length === 0 && (
                <Card sx={{ p: 6, textAlign: 'center' }}>
                    <LocalShippingIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No active posts yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Create your first shipment listing to get started
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/create-post')}
                    >
                        Create New Post
                    </Button>
                </Card>
            )}
        </>
    )
}

function MainCard({ post }) {
    const navigate = useNavigate();
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [toUserId, setToUserId] = useState("");
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteTargetPost, setDeleteTargetPost] = useState(null);
    const dispatch = useDispatch();
    const postId = post._id || post.id;

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setSelectedPost(postId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedPost(null);
    };

    const handleMarkAssigned = async (post) => {
        const id = post._id || post.id;
        if (!id) return;

        // Update to assigned status, then refresh listing
        await dispatch(update_post({ id, data: { status: 'assigned' } }));
        dispatch(get_posts({ }));
        handleMenuClose();
    };

    const handleEdit = (post) => {
        const id = post._id || post.id;
        navigate(`/update-post?id=${id}`);
    };
    const handleDeleteClick = (item) => {
        setDeleteTargetPost(item);
        setDeleteConfirmOpen(true);
        handleMenuClose();
    };
    const handleDeleteConfirm = async () => {
        const id = deleteTargetPost?._id || deleteTargetPost?.id;
        if (!id) {
            setDeleteConfirmOpen(false);
            setDeleteTargetPost(null);
            return;
        }

        try {
            await dispatch(delete_post(id)).unwrap();
            dispatch(get_posts({}));
        } catch (error) {
            console.error('Failed to delete post:', error);
        }

        setDeleteConfirmOpen(false);
        setDeleteTargetPost(null);
    };
    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false);
        setDeleteTargetPost(null);
    };
    const handleView = (item) => console.log("View:", item);
    const getStatusColor = (status) => {
        switch (status) {
            case 'listing':
                return 'info';
            case 'Assigned':
                return 'warning';
            case 'pickedup':
                return 'primary';
            case 'delivered':
                return 'success';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'listing':
                return 'Open Listing';
            case 'assigned':
                return 'Assigned';
            case 'pickedup':
                return 'In Transit';
            case 'delivered':
                return 'Delivered';
            default:
                return status;
        }
    };
    const ME = getStoredUser();
    const handleChatDriver = (post) => {
        // setSelectedDriver({
        //     name: post.driver || 'Available Driver',
        //     company: post.driverCompany || 'Transport Company',
        // });

        // setSelectedShipment({
        //     title: post.title,
        //     ...post,
        // });
        const to = post.createdBy == ME.id ? post.carrier : post.createdBy;
        // setChatOpen(true);
        console.log("Starting chat", post);
        startChat(to || "", post?._id);
        // setActivepost(item);
        setToUserId(to);
        dispatch(setListingsPaneOpen(true));

        setSelectedDriver({
            name: post.driver || 'Available Driver',
            company: post.driverCompany || 'Transport Company',
        });
        setSelectedShipment(post);
        setChatOpen(true);
    };

    const handleCloseChat = () => {
        dispatch(resetChat());
        dispatch(setListingsPaneOpen(false));
        setChatOpen(false);
        setSelectedDriver(null);
        setSelectedShipment(null);
    };
    return (
        <>

            <Grid item xs={12} md={6} lg={4} key={postId}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                            <Chip
                                label={getStatusLabel(post.status)}
                                color={getStatusColor(post.status)}
                                size="small"
                            />
                            <IconButton size="small" onClick={handleMenuOpen}>
                                <MoreVertIcon />
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl) && selectedPost === postId}
                                onClose={handleMenuClose}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                {post.status !== 'assigned' && (
                                    <MenuItem onClick={() => handleMarkAssigned(post)}>
                                        Mark as Assigned
                                    </MenuItem>
                                )}
                                <MenuItem onClick={() => handleView(post)}>View</MenuItem>
                                <MenuItem onClick={() => handleEdit(post)}>Edit</MenuItem>
                                <MenuItem onClick={() => handleDeleteClick(post)}>Delete</MenuItem>
                            </Menu>
                        </Box>
                        <Typography variant="h6" gutterBottom>
                            {post.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>From:</strong> {post.pickupLocationId.addressLine}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>To:</strong> {post.deliveryLocationId.addressLine}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Vehicle:</strong> {post.vehicles[0].type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Quoted Price:</strong> ${post.quotedPriceUsd}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Posted:</strong> {post.createdAt}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button
                            size="small"
                            color="primary"
                            onClick={() => {
                                const id = post._id || post.id;
                                navigate(`/post?id=${id}`);
                            }}
                        >
                            View Details
                        </Button>

                        <Button
                            size="small"
                            startIcon={<ChatIcon />}
                            onClick={() => handleChatDriver(post)}
                        >
                            Chat Driver
                        </Button>
                    </CardActions>
                </Card>
            </Grid>

            {/* 🔹 Chat Dialog */}
            <ChatScreen
                open={chatOpen}
                onClose={handleCloseChat}
                driver={selectedDriver}
                shipment={selectedShipment}
            />

            {/* 🔹 Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
                <DialogTitle sx={{ color: 'error.main' }}>
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the post "{deleteTargetPost?.title}"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} variant="contained" color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}