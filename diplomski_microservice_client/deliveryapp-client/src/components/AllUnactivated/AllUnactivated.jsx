import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
import { denyDeliver, getUnactivated, verifyDeliver } from "../../services/userService";

export const AllUnactivated = () => {
    const [unactivatedUsers, setUnactivatedUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [verifyMessage, setVerifyMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUnactivated = async () => {
            try {
                const users = await getUnactivated();
                console.log(users)
                setUnactivatedUsers(users);
            } catch (error) {
                setErrorMessage('Failed to load users.');
            }
        };

        fetchUnactivated();
    }, []);
    const handleVerify = async (userId) => {
        try {
            await verifyDeliver(userId);
            setVerifyMessage(`User ${userId} verified successfully!`);

            const users = await getUnactivated();
            setUnactivatedUsers(users);
        } catch (error) {
            setVerifyMessage(`Failed to verify user ${userId}.`);
        }
    };

    const handleDeny = async (userId) => {
        try {
            await denyDeliver(userId);
            setVerifyMessage(`User ${userId} denied successfully!`);

            const users = await getUnactivated();
            setUnactivatedUsers(users);
        } catch (error) {
            setVerifyMessage(`Failed to deny user ${userId}.`);
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
                alignItems: 'left',
                padding: '20px',
            }}
        >
            <h1>Users</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {verifyMessage && <p style={{ color: 'green' }}>{verifyMessage}</p>}
            {unactivatedUsers.length > 0 ? (
                <>
                    <TableContainer component={Paper} sx={{ margin: 'auto', maxHeight: '700px' }}>
                        <Table sx={{ minWidth: 500 }} aria-label="drivers table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>First name</TableCell>
                                    <TableCell>Last name</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {unactivatedUsers.map((user) => (
                                    <TableRow key={user.email}>
                                        <TableCell component="th" scope="row">
                                            {user.firstname}
                                        </TableCell>
                                        <TableCell>{user.lastname}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {user.statusString === 0 ? "Verified" : "Not Verified"}
                                        </TableCell>
                                        <TableCell>
                                            {user.status === 1 && (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleVerify(user.id)}
                                                        sx={{ marginRight: '5px' }}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={() => handleDeny(user.id)}
                                                    >
                                                        Deny
                                                    </Button>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <br />
                    <Button variant="contained" sx={{ width: "30px" }} onClick={HandleBack}>Back</Button>
                </>
            ) : (
                <>
                    <p>No users available.</p>
                    <Button variant="contained" sx={{ width: "30px", backgroundColor: 'black', color: '#f7e32f' }} onClick={HandleBack}>Back</Button>
                </>
            )}
        </Box>
    );
};