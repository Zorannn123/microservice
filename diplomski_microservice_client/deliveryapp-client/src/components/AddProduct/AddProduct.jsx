import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import { AddNewProduct } from '../../services/productService';

export const AddProduct = () => {
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [price, setPrice] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name.trim() === '' || ingredients.trim() === '' || price.trim() === '') {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        const productData = {
            name,
            ingredients,
            price
        };

        try {
            const result = await AddNewProduct(productData);
            if (result) {
                setSuccessMessage('Added successful!');
                window.alert('Added successful!');
                setErrorMessage('');
                navigate('/allProducts');
            } else {
                setErrorMessage('Adding new product failed');
            }
        } catch (error) {
            setErrorMessage('Adding new product failed. Please try again.');
            console.error('Adding error:', error);
        }
    };

    const HandleBack = () => {
        navigate("/");
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
                padding: 2,
                backgroundColor: "#f8f9fa",
            }}
        >
            <Typography variant="h4" component="h1" sx={{ marginBottom: '30px', fontFamily: "Roboto" }}>
                Add New Product
            </Typography>

            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
                <TextField
                    label="Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ marginBottom: '16px', width: "80%" }}
                />
                <br />
                <TextField
                    label="Ingredients"
                    variant="outlined"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    sx={{ marginBottom: '16px', width: "80%" }}
                />
                <br />
                <TextField
                    label="Price"
                    variant="outlined"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    sx={{ marginBottom: '16px', width: "80%" }}
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
                <Button
                    type="submit"
                    variant="outlined"
                    sx={{ marginBottom: '16px', backgroundColor: '#f7e32f', color: 'black', width: '80%' }}
                >
                    Add
                </Button>
            </form>
            <Button
                variant="outlined"
                sx={{ marginTop: '0px', backgroundColor: 'black', color: '#f7e32f', width: '30%' }}
                onClick={HandleBack}
            >
                Back
            </Button>
        </Box>
    );
};