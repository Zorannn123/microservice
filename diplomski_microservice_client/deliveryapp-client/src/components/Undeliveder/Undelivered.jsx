import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getUndelivered, takeOrder } from "../../services/orderService";
import { GetProductPrice } from "../../services/productService";

export const UndeliveredOrders = () => {
    const [undeliveredOrders, setUndeliveredOrders] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const productPrice = async (productId) => {
            try {
                const prodPrice = await GetProductPrice(productId);
                console.log("eeee " + prodPrice)
                return prodPrice;
            } catch (error) {
                setErrorMessage('Failed to return order.');
                console.error('Error fetching order: ', error);
            }
        }

        const fetchAllUndelivered = async () => {
            try {
                const undelivered = await getUndelivered();
                console.log(undelivered)
                const ordersWithTotalValue = await Promise.all(undelivered.map(async (order) => {
                    let totalValue = 0;
                    for (const part of order.orderParts) {
                        console.log(part)
                        const price = await productPrice(part.productId); // Fetch price using product ID
                        console.log(price + "    nova cena")
                        const quantity = part.quantity || 0;
                        if (!isNaN(price) && !isNaN(quantity)) {
                            totalValue += price * quantity;
                        }
                    }
                    totalValue += 250;
                    return { ...order, value: totalValue };
                }));
                console.log(ordersWithTotalValue)
                setUndeliveredOrders(ordersWithTotalValue);
            } catch (error) {
                setErrorMessage('Failed to fetch orders.');
                console.error('Error fetching orders: ', error);
            }
        };
        fetchAllUndelivered();
    }, []);

    const handlePickOrder = async (orderId) => {
        try {
            const response = await takeOrder(orderId);
            if (response) {
                setUndeliveredOrders((prevOrders) => prevOrders.filter(order => order.orderId !== orderId));
                window.alert('You took the order.');
                navigate('/');
            } else {
                alert("Cannot take multiple orders at the same time.");
            }
        } catch (error) {
            console.error(`Error taking order ${orderId}: `, error);
            setErrorMessage(`Failed to take order ${orderId}.`);
        }
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
                Undelivered Orders
            </Typography>

            {errorMessage && (
                <Typography variant="body1" color="error">
                    {errorMessage}
                </Typography>
            )}

            {undeliveredOrders.length > 0 ? (
                <div>
                    {undeliveredOrders.map((order) => (
                        <div key={order.orderId} style={{ border: 'double', margin: '10px', padding: '10px' }}>
                            <Typography variant="h6">Order ID: {order.orderId}</Typography>
                            <Typography>Address: {order.address}</Typography>
                            <Typography>Comment: {order.comment}</Typography>
                            <Typography>Total Value: {order.value}</Typography> {console.log(order)}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handlePickOrder(order.orderId)}
                                sx={{ float: 'right', margin: '5px' }}
                            >
                                Take Order
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <Typography>No undelivered orders available.</Typography>
            )}

            <Button
                variant="outlined"
                sx={{ marginTop: '20px', backgroundColor: 'black', color: '#f7e32f' }}
                onClick={() => navigate("/")}
            >
                Back
            </Button>
        </Box>
    );
};