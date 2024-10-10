import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { GetAllProducts } from "../../services/productService";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export const NewOrder = () => {
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const products = await GetAllProducts();
                setProducts(products);
            } catch (error) {
                setErrorMessage('Failed to fetch products.');
                console.error('Error fetching products: ', error);
            }
        };
        fetchAllProducts();
    }, []);

    const handleQuantityChange = (productId, value) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: value
        }));
    };

    // Handle finishing the order
    const handleFinishOrder = () => {
        const orderParts = Object.keys(quantities).map(productId => {
            const quantity = parseInt(quantities[productId], 10);
            const product = products.find(p => p.productId.toString() === productId);
            console.log(product)
            //const retProducts = await
            return productId && quantity > 0
                ? {
                    productId,
                    name: product.name, // Add product name
                    price: product.price, // Add product price
                    ingredients: product.ingredients, // Add product ingredients
                    quantity
                }
                : null;
        }).filter(item => item !== null); // Filter out null values

        if (orderParts.length === 0) {
            alert("Please select at least one item.");
            return;
        }

        // Navigate to the order summary and pass the order parts
        navigate('/order-summary', { state: { orderParts } });
    };


    const HandleBack = () => {
        navigate("/");
    }

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '20px',
                backgroundColor: "#f8f9fa"
            }}
        >
            <Typography variant="h4" gutterBottom
                sx={{ marginBottom: '20px', fontFamily: "Roboto", marginTop: '30px' }}>
                All Products
            </Typography>

            {errorMessage && (
                <Typography variant="body1" color="error">
                    {errorMessage}
                </Typography>
            )}

            {products.length > 0 ? (
                <>
                    <TableContainer component={Paper} sx={{ maxHeight: '500px', marginTop: '20px' }}>
                        <Table stickyHeader aria-label="on-hold orders table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Ingredients</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Quantity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.productId}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.ingredients}</TableCell>
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={quantities[product.productId] || 0}
                                                onChange={(e) => handleQuantityChange(product.productId, e.target.value)}
                                                inputProps={{ min: 0 }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box>
                        <Button
                            variant="outlined"
                            sx={{ marginTop: '20px', backgroundColor: 'black', color: '#f7e32f' }}
                            onClick={HandleBack}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ marginLeft: '20px', backgroundColor: 'black', color: '#f7e32f', marginTop: '20px' }}
                            onClick={handleFinishOrder}
                        >
                            Završi porudžbinu
                        </Button>
                    </Box>
                </>
            ) : (
                <>
                    <Typography variant="h6" gutterBottom
                        sx={{ marginBottom: '20px', fontFamily: "Roboto", marginTop: '30px' }}>
                        No products available.
                    </Typography>
                    <Button
                        variant="outlined"
                        sx={{ marginTop: '8px', backgroundColor: 'black', color: '#f7e32f' }}
                        onClick={HandleBack}
                    >
                        Back
                    </Button>
                </>
            )}
        </Box>
    );
};