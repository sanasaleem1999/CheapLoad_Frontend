import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    CircularProgress,
    Container,
    Grid,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login_user, verify_otp, update_password } from '../../Store/authenticationReducer';
import { connectSocket, disconnectSocket, emitSocketEvent, socket } from '../../utils/socketClient';
import Logistics from "../../Components/Assets/Logistics.gif";


export default function LoginForm({ onLogin }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, status, message } = useSelector((state) => state.authentication || {});

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [feedback, setFeedback] = useState(null);
    const [emailError, setEmailError] = useState("");
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [forgotPasswordData, setForgotPasswordData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);


    const validateEmail = (email) => {
        // Simple email regex
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (name === "email") {
            if (!validateEmail(value)) {
                setEmailError("Please enter a valid email address.");
            } else {
                setEmailError("");
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFeedback(null);
        // Validate email before submitting
        if (!validateEmail(formData.email)) {
            setEmailError("Please enter a valid email address.");
            return;
        }
        setEmailError("");
        // Dispatch login and show OTP modal on success
        dispatch(login_user(formData))
            .then((res) => {
                const payload = res.payload || {};
                const message = payload.message || "";
                console.log(payload, "payload in login");
                const isOtpRequired = payload.otpRequired === true;
                const hasSuccessfulMessage = Boolean(message) || payload.user || isOtpRequired;

                if (hasSuccessfulMessage) {
                    try {
                        if (payload.user) localStorage.setItem('user', JSON.stringify(payload.user));
                    } catch (err) {
                        console.log("LocalStorage error:", err);
                    }
                    if (message) {
                        setFeedback({ type: 'info', message });
                    }
                    setShowOtpModal(true);
                } else {
                    setFeedback({ type: 'error', message: 'Unable to login. Please check credentials.' });
                }
            })
            .catch((err) => {
                setFeedback({ type: 'error', message: 'Login failed. Please try again later.' });
                console.error(err);
            });
    };

    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [verifying, setVerifying] = useState(false);

    const handleForgotPasswordChange = (e) => {
        const { name, value } = e.target;
        setForgotPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleForgotPasswordSubmit = async () => {
        if (!forgotPasswordData.email || !validateEmail(forgotPasswordData.email)) {
            setFeedback({ type: 'error', message: 'Please enter a valid email address.' });
            return;
        }

        if (!forgotPasswordData.newPassword || forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
            setFeedback({ type: 'error', message: 'Passwords do not match.' });
            return;
        }

        setForgotPasswordLoading(true);
        try {
            const result = await dispatch(update_password({
                email: forgotPasswordData.email,
                newPassword: forgotPasswordData.newPassword,
            })).unwrap();

            setFeedback({ type: 'success', message: result?.message || 'Password updated successfully.' });
            setShowForgotPasswordModal(false);
            setForgotPasswordData({ email: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setFeedback({
                type: 'error',
                message: error?.message || error?.payload?.message || 'Unable to update password. Please try again.',
            });
        } finally {
            setForgotPasswordLoading(false);
        }
    };

    const handleVerifyOtp = () => {
        setOtpError('');
        if (!otp || otp.trim().length === 0) {
            setOtpError('Please enter the OTP');
            return;
        }
        setVerifying(true);
        const payload = { email: formData.email, otp };
        dispatch(verify_otp(payload))
            .then((res) => {
                setVerifying(false);
                const result = res.payload || {};
                const accessToken = result.accessToken || result.token || result.data?.token;
                if (accessToken) {
                    try {
                        localStorage.setItem('token', accessToken);
                        if (result.user) localStorage.setItem('user', JSON.stringify(result.user));
                    } catch (err) {
                        console.log('LocalStorage error:', err);
                    }
                    setShowOtpModal(false);
                    navigate('/dashboard');
                } else {
                    setOtpError(result.message || 'OTP verification failed');
                }
            })
            .catch((err) => {
                setVerifying(false);
                setOtpError('OTP verification failed. Please try again.');
                console.error(err);
            });
    };

    return (
        <Box sx={{
            bgcolor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4
        }}>
                <Grid container spacing={0} sx={{ minHeight: '600px' }}>
                    {/* Left side - Content */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 4,
                            minHeight: '600px'
                        }}
                    >
                    <Box sx={{ textAlign: 'center', color: 'white' }}>
                        <Typography variant="h3" gutterBottom>
                            Welcome Back!
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                            Login to manage your shipments
                        </Typography>
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: 400,
                                height: 400,
                                bgcolor: 'rgba(255,255,255,0.1)',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <img
                                src={Logistics}
                                alt="Shipping Animation"
                                style={{ maxWidth: '100%', maxHeight: '50%', borderRadius: 8 }}
                            />
                        </Box>
                    </Box>
                </Grid>

                {/* Right side - Login Form */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 4,
                        width:"700px",
                        minHeight: '600px'
                    }}
                >
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 6, 
                            width: '100%',
                            mx: 'auto' // Center horizontally
                        }}
                    >
                            <Typography variant="h4" gutterBottom align="center" color="primary">
                                Login
                            </Typography>
                            <Typography variant="body2" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
                                Access your account
                            </Typography>

                            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'stretch' }}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
                                        error={!!emailError}
                                        helperText={emailError}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
                                    />

                                    {/* Feedback Alert */}
                                    {feedback && (
                                        <Alert severity={feedback.type} sx={{ width: '100%' }}>
                                            {feedback.message}
                                        </Alert>
                                    )}

                                    {/* Submit Button - Clearly Separated */}
                                    <Box sx={{
                                        mt: 3,
                                        pt: 2,
                                        borderTop: '1px solid',
                                        borderColor: 'divider',
                                        textAlign: 'center',
                                        width: '100%'
                                    }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            fullWidth
                                            sx={{
                                                py: 2,
                                                fontWeight: "bold",
                                                fontSize: '1.2rem',
                                                borderRadius: 3,
                                                boxShadow: 3,
                                                '&:hover': {
                                                    boxShadow: 6,
                                                    transform: 'translateY(-2px)',
                                                    transition: 'all 0.3s ease'
                                                }
                                            }}
                                            disabled={loading}
                                        >
                                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                                        </Button>
                                    </Box>

                                    {/* Sign up / forgot password links */}
                                    <Box sx={{ textAlign: 'center', mt: 2, width: '100%' }}>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            <Button
                                                onClick={() => setShowForgotPasswordModal(true)}
                                                sx={{
                                                    textTransform: 'none',
                                                    fontWeight: 'bold',
                                                    textDecoration: 'underline',
                                                    mr: 1,
                                                }}
                                            >
                                                Forgot password?
                                            </Button>
                                            <span>•</span>
                                            <Button
                                                onClick={() => navigate('/register')}
                                                sx={{
                                                    textTransform: 'none',
                                                    fontWeight: 'bold',
                                                    textDecoration: 'underline',
                                                    ml: 1,
                                                }}
                                            >
                                                Sign up here
                                            </Button>
                                        </Typography>
                                    </Box>
                                </Box>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
                {/* Forgot Password Modal */}
                <Dialog open={showForgotPasswordModal} onClose={() => setShowForgotPasswordModal(false)}>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Enter your email and a new password to reset your account password.
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Email"
                            name="email"
                            fullWidth
                            value={forgotPasswordData.email}
                            onChange={handleForgotPasswordChange}
                        />
                        <TextField
                            margin="dense"
                            label="New Password"
                            name="newPassword"
                            type="password"
                            fullWidth
                            value={forgotPasswordData.newPassword}
                            onChange={handleForgotPasswordChange}
                        />
                        <TextField
                            margin="dense"
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            fullWidth
                            value={forgotPasswordData.confirmPassword}
                            onChange={handleForgotPasswordChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowForgotPasswordModal(false)}>Cancel</Button>
                        <Button onClick={handleForgotPasswordSubmit} disabled={forgotPasswordLoading} variant="contained">
                            {forgotPasswordLoading ? <CircularProgress size={20} color="inherit" /> : 'Confirm'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* OTP Verification Modal */}
                <Dialog open={showOtpModal} onClose={() => setShowOtpModal(false)}>
                    <DialogTitle>Enter OTP</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Please enter the OTP sent to your email to complete login.
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="OTP"
                            fullWidth
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            error={!!otpError}
                            helperText={otpError}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowOtpModal(false)}>Cancel</Button>
                        <Button onClick={handleVerifyOtp} disabled={verifying} variant="contained">
                            {verifying ? <CircularProgress size={20} color="inherit" /> : 'Verify'}
                        </Button>
                    </DialogActions>
                </Dialog>
        </Box>
    );
}
