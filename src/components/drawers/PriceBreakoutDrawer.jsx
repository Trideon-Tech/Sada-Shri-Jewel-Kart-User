import { Drawer, Box, Typography, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PriceBreakoutDrawer = ({ open, onClose, productDetails }) => {
    const [subtotal, setSubtotal] = useState(0);
    const [metalPrice, setMetalPrice] = useState(0);
    const [rates, setRates] = useState({});

    // Fetch rates when component mounts
    useEffect(() => {
        axios.get("https://api.sadashrijewelkart.com/v1.0.0/user/landing.php")
            .then((response) => {
                setRates(response?.data?.response?.jewellery_inventory || {});
            })
            .catch((error) => {
                console.error("Error fetching rates:", error);
                setRates({});
            });
    }, []);

    // Function to calculate metal price
    const calculateMetalPrice = (metalInfo) => {
        if (!metalInfo || !rates) return 0;

        let baseAmount = 0;
        const rate = rates[metalInfo.quality] || 0;

        // Handle fixed price case
        if (metalInfo.making_charge_type === 8) {
            return parseFloat(metalInfo.making_charge_amount || 0);
        }

        // Calculate base amount based on weight priority
        if (metalInfo.net_wt_after_wastage) {
            baseAmount = metalInfo.net_wt_after_wastage * rate;
        } else if (metalInfo.net_wt) {
            baseAmount = metalInfo.net_wt * rate;
        } else if (metalInfo.gross_wt) {
            baseAmount = metalInfo.gross_wt * rate;
        }

        // Add additional charges
        let totalAmount = baseAmount;
        if (metalInfo.making_charge_amount) totalAmount += parseFloat(metalInfo.making_charge_amount);
        if (metalInfo.hallmark_charge) totalAmount += parseFloat(metalInfo.hallmark_charge);
        if (metalInfo.rodium_charge) totalAmount += parseFloat(metalInfo.rodium_charge);
        if (metalInfo.stone_amount) totalAmount += parseFloat(metalInfo.stone_amount);

        // Add GST if present
        if (metalInfo.gst_perc) {
            totalAmount += (totalAmount * parseFloat(metalInfo.gst_perc)) / 100;
        }

        return totalAmount;
    };

    // Calculate prices when product details or rates change
    useEffect(() => {
        if (!productDetails?.customizations?.variants?.options[0]) return;

        const metalInfo = productDetails.customizations.variants.options[0].metal_info;
        
        // Calculate metal price using the new function
        const calculatedMetalPrice = calculateMetalPrice(metalInfo);
        setMetalPrice(calculatedMetalPrice);
        setSubtotal(calculatedMetalPrice);

    }, [productDetails, rates]);

    // Safely get the metal rate
    const getMetalRate = () => {
        const quality = productDetails?.customizations?.variants?.options[0]?.metal_info?.quality;
        return quality && rates[quality] ? rates[quality] : 0;
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: { xs: '100%', sm: '400px' } }
            }}
        >
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                        {productDetails?.name || 'Price Breakup'}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Gold Price Breakup */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
                    GOLD PRICE BREAKUP
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>METAL</TableCell>
                            <TableCell>RATE</TableCell>
                            <TableCell>WEIGHT</TableCell>
                            <TableCell>FINAL VALUE</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{productDetails?.customizations?.variants?.options[0]?.metal_info?.display_name || '-'}</TableCell>
                            <TableCell>₹{getMetalRate()}/g</TableCell>
                            <TableCell>{productDetails?.customizations?.variants?.options[0]?.metal_info?.net_wt || 0} g</TableCell>
                            <TableCell>₹{metalPrice.toFixed(2)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Diamond Price Breakup */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 3 }}>
                    STONE PRICE BREAKUP
                </Typography>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>{productDetails.customizations?.variants?.options[0]
                                ?.stone_info?.stone_type}</TableCell>
                            <TableCell>{
                                productDetails.customizations?.variants?.options[0]
                                    ?.stone_info?.stone_rate
                            }</TableCell>
                            <TableCell>{
                                productDetails.customizations?.variants?.options[0]
                                    ?.stone_info?.stone_wt
                            }{" "}
                                g</TableCell>
                            <TableCell>₹{productDetails.customizations?.variants?.options[0]
                                ?.stone_info?.stone_rate * productDetails.customizations?.variants?.options[0]
                                    ?.stone_info?.stone_wt}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Making Charges */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 3 }}>
                    MAKING CHARGES
                </Typography>
                <Table>
                    <TableBody>
                        <TableRow style={{ textAlign: "end" }}>
                            <TableCell style={{ textAlign: "center" }}>-</TableCell>
                            <TableCell style={{ textAlign: "center" }}>-</TableCell>
                            <TableCell style={{ textAlign: "center" }}>-</TableCell>
                            <TableCell style={{ textAlign: "center" }}>₹{productDetails?.customizations?.variants?.options[0]
                                ?.metal_info?.making_charge_amount}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Subtotal */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 3 }}>
                    SUBTOTAL
                </Typography>
                <Table>
                    <TableBody>
                        <TableRow style={{ textAlign: "end" }}>
                            <TableCell style={{ textAlign: "center" }}>-</TableCell>
                            <TableCell style={{ textAlign: "center" }}>-</TableCell>
                            <TableCell style={{ textAlign: "center" }}>-</TableCell>
                            <TableCell style={{ textAlign: "center" }}>₹{subtotal}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

            </Box>
        </Drawer>
    );
};

export default PriceBreakoutDrawer; 