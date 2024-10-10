import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TextField from "@mui/material/TextField";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { addOrder, getCurrentOrder } from "../services/orderService";

export const OrderSummary = () => {
    const [address, setAddress] = useState('');
    const [comment, setComment] = useState('');
    const [state, setState] = useState('NOTDELEVERED');
    const navigate = useNavigate();
    const location = useLocation();

    // Assume order details are passed via the location state
    const { orderParts } = location.state || { orderParts: [] }; // Default to an empty array if not provided
    const totalPrice = orderParts.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handleBackToOrders = () => {
        navigate("/newOrder"); // Adjust to the route you want to navigate back to
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!address) {
            alert("Greska u unosu");
            return;
        }

        // Prepare the order object
        const orderData = {
            address,
            comment,
            orderParts: orderParts.map(item => ({
                name: item.name,
                ingredients: item.ingredients,
                quantity: item.quantity,
                price: item.price,
                productId: item.productId
            })),
            state
        };
        console.log(orderData)

        try {
            const result = await addOrder(orderData);
            const currOrder = await getCurrentOrder();
            console.log(currOrder)
            console.log("rez " + result)
            if (result) {
                //localStorage.setItem('currOrder', )
                navigate("/countdown");
            } else {
                alert("Doslo je do greske");
            }
        } catch (error) {
            alert("Doslo je do greske");
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: "#f8f9fa",
                minHeight: '100vh'
            }}
        >
            <Typography variant="h4" gutterBottom sx={{ marginBottom: '20px', fontFamily: "Roboto" }}>
                Order Summary
            </Typography>

            {orderParts.length > 0 ? (
                <TableContainer component={Paper} sx={{ maxHeight: '500px' }}>
                    <Table stickyHeader aria-label="order summary table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Ingredients</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderParts.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.ingredients}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.price * item.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="h6" gutterBottom>
                    No items in your order.
                </Typography>
            )}

            {orderParts.length > 0 && (
                <Typography variant="h5" sx={{ marginTop: '20px', fontWeight: 'bold' }}>
                    Total Price: {totalPrice}RSD + 250RSD for delivery.
                </Typography>
            )}

            <Typography variant="h5" gutterBottom sx={{ marginTop: '20px', fontFamily: "Roboto" }}>
                Delivery information
            </Typography>
            <Box component="form" onSubmit={handlePlaceOrder} sx={{ width: '100%', maxWidth: '400px' }}>
                <TextField
                    label="Address"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
                <TextField
                    label="Comment"
                    variant="outlined"
                    multiline
                    rows={3}
                    fullWidth
                    margin="normal"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button type="submit" variant="contained" color="success">
                        Order
                    </Button>
                </Box>
            </Box>

            <Button
                variant="outlined"
                sx={{ marginTop: '20px', backgroundColor: 'black', color: '#f7e32f' }}
                onClick={handleBackToOrders}
            >
                Back to Order Page
            </Button>
        </Box>
    );
};
