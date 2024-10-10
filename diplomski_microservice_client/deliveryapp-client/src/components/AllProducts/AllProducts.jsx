import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DeleteProduct, GetAllProducts } from "../../services/productService";

export const AllProducts = () => {
    const [products, setProducts] = useState([]);
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

    const handleDelete = async (productId) => {
        try {
            const result = await DeleteProduct(productId);
            console.log(result)
            if (result) {
                setProducts(products.filter(product => product.productId !== productId));
            }
        } catch (error) {
            setErrorMessage('Failed to delete product.');
            console.error('Error deleting product: ', error);
        }
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
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.productId}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.ingredients}</TableCell>
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                sx={{ marginBottom: '8px', backgroundColor: '#f7e32f', color: 'black' }}
                                                onClick={() => handleDelete(product.productId)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button
                        variant="outlined"
                        sx={{ marginTop: '20px', backgroundColor: 'black', color: '#f7e32f' }}
                        onClick={HandleBack}
                    >
                        Back
                    </Button>
                </>
            ) : (
                <>
                    <Typography variant="h6" gutterBottom
                        sx={{ marginBottom: '20px', fontFamily: "Roboto", marginTop: '30px' }}>
                        No on-hold orders available.
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