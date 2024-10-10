import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { getUserProfile, updateUserProfile } from '../../services/userService';

export const EditProfile = () => {
    const [id, setId] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [type, setType] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    //TODO:
    const fetchUserProfile = async () => {


        try {
            const token = localStorage.getItem('authToken');
            const response = await getUserProfile(token);
            const userProfile = response;
            console.log(response);
            if (userProfile) {
                setId(userProfile.id);
                setUsername(userProfile.username);
                setFirstName(userProfile.firstname);
                setLastName(userProfile.lastname);
                setEmail(userProfile.email);
                setPassword(userProfile.password);
                setType(userProfile.type);
                setAddress(userProfile.address);
                setPhotoUrl(userProfile.photoUrl)
            }
            else {
                setErrorMessage('Error fetching user profile:');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);



    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            id,
            username,
            email,
            password,
            firstName,
            lastName,
            address,
            type,
            photoUrl
        };
        console.log(userData)

        try {

            const result = await updateUserProfile(userData);
            console.log(userData)
            console.log(result);
            if (result) {
                setSuccessMessage('Profile updated successfully!');
                setErrorMessage('');
                window.alert("Profile updated successfully!");
                navigate('/yourProfile');
            } else {
                setErrorMessage('Profile update failed.');
            }
        } catch (error) {
            setErrorMessage('Profile update failed. Please try again.');
            console.error('Profile update error:', error);
        }
    };
    const HandleBack = () => {
        navigate("/yourProfile");
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
                marginTop: '-40px',
                padding: 2,
                backgroundColor: "#f8f9fa"
            }}
        >
            <Typography variant="h4" component="h1" sx={{ marginBottom: '30px', fontFamily: "Roboto" }}>
                Edit Profile
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ marginBottom: '16px', width: "300px" }}
                />
                <br />
                <TextField
                    label="First Name"
                    variant="outlined"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    sx={{ marginBottom: '16px', width: "300px" }}
                />
                <br />
                <TextField
                    label="Last Name"
                    variant="outlined"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    sx={{ marginBottom: '16px', width: "300px" }}
                />
                <br />
                <br />
                <TextField
                    label="Address"
                    variant="outlined"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    sx={{ marginBottom: '16px', width: "300px" }}
                />
                <br />
                {errorMessage && (
                    <Typography variant="body2" color="error" sx={{ marginBottom: '16px' }}>
                        {errorMessage}
                    </Typography>
                )}
                {successMessage && (
                    <Typography variant="body2" color="success" sx={{ marginBottom: '16px' }}>
                        {successMessage}
                    </Typography>
                )}

                <Box>
                    <Button
                        type="submit"
                        variant="outlined"
                        sx={{ marginBottom: '8px', backgroundColor: '#f7e32f', color: 'black', marginRight: '20px' }}
                    >
                        Update Profile
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ marginBottom: '8px', backgroundColor: 'black', color: '#f7e32f' }}
                        onClick={HandleBack}
                    >
                        Back
                    </Button>
                </Box>
            </form>
        </Box>
    );
};