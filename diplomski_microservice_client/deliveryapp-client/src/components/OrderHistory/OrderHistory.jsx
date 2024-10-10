import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getOrderHistoryUser } from '../../services/orderService';

export const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const data = await getOrderHistoryUser();
                // Calculate value for each order
                const updatedOrders = data.map(item => {
                    let sum = item.orderParts.reduce((acc, part) => {
                        return acc + part.product.price * part.quantity;
                    }, 0);
                    return { ...item, Value: sum + 250 }; // Add fixed cost
                });
                setOrders(updatedOrders);
                console.log(orders)
            } catch (error) {
                setErrorMessage('Failed to fetch order history.');
                console.error('Error fetching order history:', error);
            }
        };

        fetchOrderHistory();
    }, []);

    const handleBack = () => {
        navigate("/");
    };

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
                Order history
            </Typography>

            {errorMessage && (
                <Typography variant="body1" color="error">
                    {errorMessage}
                </Typography>
            )}

            {orders.length > 0 ? (
                <>
                    <TableContainer component={Paper} sx={{ maxHeight: '500px', marginTop: '20px' }}>
                        <Table stickyHeader aria-label="order history table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product Name</TableCell>
                                    <TableCell>Ingredients</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Comment</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.orderId}>
                                        {order.orderParts.length > 0 ? (
                                            <TableCell>{order.orderParts[0].product.name}</TableCell>
                                        ) : (
                                            <TableCell>-</TableCell>
                                        )}
                                        {order.orderParts.length > 0 ? (
                                            <TableCell>{order.orderParts[0].product.ingredients}</TableCell>
                                        ) : (
                                            <TableCell>-</TableCell>
                                        )}
                                        {order.orderParts.length > 0 ? (
                                            <TableCell>{order.orderParts[0].quantity}</TableCell>
                                        ) : (
                                            <TableCell>-</TableCell>
                                        )}
                                        <TableCell>{order.Value}</TableCell>
                                        <TableCell>{order.address}</TableCell>
                                        <TableCell>{order.comment}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button
                        variant="outlined"
                        sx={{ marginTop: '20px', backgroundColor: 'black', color: '#f7e32f' }}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                </>
            ) : (
                <Typography variant="h6" gutterBottom
                    sx={{ marginBottom: '20px', fontFamily: "Roboto", marginTop: '30px' }}>
                    Nema porudzbina
                </Typography>
            )}
        </Box>
    );
};

