import React, { useState, useEffect } from "react";
import { Box, Grid, Container, Typography, Button } from "@mui/material";
import Branding from "./Components/Branding";
import { PersonalInformation } from "./Components/PersonalInformation";
import { CompanyInformation } from "./Components/CompanyInformation";
import { OperationHours } from "./Components/OperationHours";
import DisclaimerModal from "../../Home/DisclaimerModal";
import { useSignupForm } from "./Hooks/useSignup";
import { useNavigate } from "react-router-dom";

export default function Registrationtest() {
    const { formData, formErrors, status, handleChange, handleSubmit, isLoading, showDisclaimer, handleDisclaimerAgree, handleDisclaimerClose } = useSignupForm();
    const navigate = useNavigate();

    return (
        <>
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex' }}>
                <Branding />
                <Grid
                    item
                    xs={12}
                    md={7}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: 'white',
                        overflowY: 'auto',
                        maxHeight: '100vh',
                    }}
                >
                    <Container maxWidth="md" sx={{ py: 6 }}>
                        <Box sx={{ mb: 5, textAlign: 'center' }}>
                            <Typography
                                variant="h2"
                                gutterBottom
                                color="primary"
                                sx={{ fontWeight: 700, mb: 1 }}
                            >
                                Registration
                            </Typography>
                            <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                                Create Your Account
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Fill in your details below to get started
                            </Typography>
                        </Box>
                        <form onSubmit={handleSubmit}>
                            <PersonalInformation
                                formData={formData}
                                handleChange={handleChange}
                                formErrors={formErrors}
                            />
                            <CompanyInformation
                                formData={formData}
                                handleChange={handleChange}
                                formErrors={formErrors}
                            />
                            <OperationHours
                                formData={formData}
                                handleChange={handleChange}
                                 formErrors={formErrors}
                            />
                            <Typography variant="body2" align="center" color={status.success ? "green" : "error"}>
                                {status.success ? status.success : status.error}
                            </Typography>

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={isLoading}
                                sx={{ py: 1.5, mb: 2 }}
                            >
                                {isLoading ? 'Registering...' : 'Register'}
                            </Button>

                            <Typography variant="body2" align="center" color="text.secondary">
                                Already have an account?{' '}
                                <Button
                                    onClick={() => navigate('/login')}
                                    sx={{ textTransform: 'none', p: 0 }}
                                >
                                    Login here
                                </Button>
                            </Typography>
                        </form>
                    </Container>
                </Grid>


            </Box>

            <DisclaimerModal
                controlledOpen={showDisclaimer}
                onAgree={handleDisclaimerAgree}
                onClose={handleDisclaimerClose}
            />
        </>);
}   