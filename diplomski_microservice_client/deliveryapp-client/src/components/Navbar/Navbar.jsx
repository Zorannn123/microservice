import React from "react";
import styles from './Navbar.module.css';
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

export const Navbar = () => {
    const [role, setRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        console.log('Token:' + token);

        if (token) {
            const fetchStatuses = async () => {
                try {
                    // Decode the JWT token
                    const decodedToken = jwtDecode(token);
                    setRole(decodedToken.role);
                } catch (error) {
                    console.error('Failed to fetch statuses: ', error);
                }
            };

            fetchStatuses();
        }
    }, []);

    useEffect(() => {
        if (role !== null) {
            console.log('Updated Role:', role);
        }
    }, [role]);


    return (
        <nav className={styles.navbar}>
            {
                !role && (
                    <>
                        <div>
                            <a href="/login">Login</a>
                        </div>
                        <div>
                            <a href="/register">Register</a>
                        </div>
                    </>
                )
            }

            {
                role && (
                    <>
                        <div>
                            <a href="/yourProfile">Your Profile</a>
                        </div>


                        {role === "Korisnik" && (
                            <>
                                <div>
                                    <a href="/newOrder">New Order</a>
                                </div>
                                <div>
                                    <a href="/orderHistory">Order history</a>
                                </div>
                                <div>
                                    <a href="/countdown">Current order</a>
                                </div>
                            </>
                        )}

                        {role === "Dostavljac" && (
                            <>
                                <div>
                                    <a href="/undeliveredOrders">Undelivered</a>
                                </div>
                                <div>
                                    <a href="/orderHistoryDeliverer">Order history</a>
                                </div>
                                <div>
                                    <a href="/countdown">Current order</a>
                                </div>
                            </>
                        )}

                        {role === "Admin" && (
                            <>
                                <div>
                                    <a href="/unactivated">All unverified</a>
                                </div>
                                <div>
                                    <a href="/addProduct">Add product</a>
                                </div>
                                <div>
                                    <a href="/allUsers">All users</a>
                                </div>
                                <div>
                                    <a href="/allProducts">All products</a>
                                </div>
                            </>
                        )}
                        <div>
                            <a href="/logout">Logout</a>
                        </div>
                    </>
                )
            }
        </nav >
    );
};