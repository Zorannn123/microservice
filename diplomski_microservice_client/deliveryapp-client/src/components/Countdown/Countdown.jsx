import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentOrder } from '../../services/orderService';
import Button from '@mui/material/Button';
import { GetProductPrice } from '../../services/productService';

const Countdown = () => {
    const [minuti, setMinuti] = useState(0);
    const [sekunde, setSekunde] = useState(0);
    const [order, setOrder] = useState(null);
    const [finished, setFinished] = useState(true);
    const [intervalId, setIntervalId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const productPrice = async (productId) => {
            try {
                const prodPrice = await GetProductPrice(productId);
                console.log("eeee " + prodPrice)
                return prodPrice;
            } catch (error) {
                console.error('Error fetching order: ', error);
            }
        }
        const fetchCurrentOrder = async () => {
            try {
                const data = await getCurrentOrder(); // Fetch current order
                console.log(data)
                if (data !== null) {
                    setFinished(false);
                    let total = 0;
                    for (const part of data.orderParts) {
                        const price = await productPrice(part.productId); // Get the price from service
                        const quantity = part.quantity || 0;
                        if (!isNaN(price) && !isNaN(quantity)) {
                            total += price * quantity;
                        }
                    }
                    total += 250; // Add fixed amount
                    setOrder({ ...data, value: total });

                    let timeRemaining = Date.now() - new Date(data.dateTimeOfDelivery).getTime();
                    timeRemaining = timeRemaining / 1000;

                    setMinuti(Math.floor(timeRemaining / 60));
                    setSekunde(Math.floor(timeRemaining % 60));

                    const timerInterval = setInterval(() => {
                        setSekunde((prevSekunde) => {
                            if (prevSekunde > 0) return prevSekunde - 1;
                            setMinuti((prevMinuti) => {
                                if (prevMinuti === 0) {
                                    stopTimer();
                                    return 0;
                                }
                                return prevMinuti - 1;
                            });
                            return 59;
                        });
                    }, 1000);

                    setIntervalId(timerInterval);
                }
            } catch (error) {
                console.error("Failed to fetch current order:", error);
            }
        };

        fetchCurrentOrder();

        // Cleanup the interval on component unmount
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, []);

    const handleBack = () => {
        navigate('/');
    }

    const stopTimer = () => {
        clearInterval(intervalId);
        setFinished(true);
    };

    return (
        <div>
            <nav> {/* Replace with your navigation component */} </nav>

            {!finished ? (
                <div>
                    <h1>Vreme do isporuke: {minuti}:{sekunde}</h1>

                </div>
            ) : (
                <>
                    <h1>Sve porudzbine su isporucene</h1>
                    <Button
                        variant="outlined"
                        sx={{ marginTop: '20px', backgroundColor: 'black', color: '#f7e32f' }}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                </>
            )}
        </div>
    );
};

export default Countdown;
