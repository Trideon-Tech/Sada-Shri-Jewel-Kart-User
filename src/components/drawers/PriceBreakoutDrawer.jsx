import { Drawer, Box, Typography, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PriceBreakoutDrawer = ({ open, onClose, productDetails }) => {
    const [subtotal, setSubtotal] = useState(0);
    const [metalPrice, setMetalPrice] = useState(0);
    const [stonePrice, setStonePrice] = useState(0);
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

        // Handle fixed price case (type 8)
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

        return Number(totalAmount.toFixed(2));
    };

    // Function to calculate stone price
    const calculateStonePrice = (stoneInfo) => {
        if (!stoneInfo) return 0;

        // Calculate stone internal weight
        const stonePieces = parseFloat(stoneInfo.pieces || 0);
        console.log(stonePieces, "stonePieces");
        const stoneCarat = parseFloat(stoneInfo.carat || 0);
        console.log(stoneCarat, "stoneCarat");
        const stoneInternalWeight = stonePieces && stoneCarat ?
            Number((stoneCarat * 0.2 * stonePieces).toFixed(2)) : 0;
        console.log(stoneInternalWeight, "stoneInternalWeight");

        // Calculate base amount
        const stoneRate = parseFloat(stoneInfo.stone_rate || 0);
        console.log(stoneRate, "stoneRate");
        const baseAmount = stoneInternalWeight * stoneRate;
        console.log(baseAmount, "baseAmount");

        // Add GST
        const stoneGSTPercent = parseFloat(stoneInfo.gst_perc || 0);
        console.log(stoneGSTPercent, "stoneGSTPercent");
        const gstAmount = baseAmount * (stoneGSTPercent / 100);
        console.log(gstAmount, "gstAmount");

        const total = Number((baseAmount + gstAmount).toFixed(2));
        console.log(total, "total");
        return total;
    };

    // Calculate prices when product details or rates change
    useEffect(() => {
        if (!productDetails?.customizations?.variants?.options[0]) return;

        const metalInfo = productDetails.customizations.variants.options[0].metal_info;
        const stoneInfo = productDetails.customizations.variants.options[0].stone_info;

        // Calculate metal price
        const calculatedMetalPrice = calculateMetalPrice(metalInfo);
        setMetalPrice(calculatedMetalPrice);

        // Calculate stone price
        const calculatedStonePrice = calculateStonePrice(stoneInfo);
        setStonePrice(calculatedStonePrice);
        console.log(calculatedStonePrice, "calculatedStonePrice");
        console.log(calculatedMetalPrice, "calculatedMetalPrice");

        // Set total
        setSubtotal(calculatedMetalPrice + calculatedStonePrice);

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
                sx: { width: { xs: '100%', sm: '500px' } }
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

                {/* Stone Price Breakup */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 3 }}>
                    STONE PRICE BREAKUP
                </Typography>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>{productDetails?.customizations?.variants?.options[0]?.stone_info?.stone_type || '-'}</TableCell>
                            <TableCell>{productDetails?.customizations?.variants?.options[0]?.stone_info?.stone_rate || 0}</TableCell>
                            <TableCell>{productDetails?.customizations?.variants?.options[0]?.stone_info?.stone_wt || 0} g</TableCell>
                            <TableCell>₹{stonePrice.toFixed(2)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Making Charges */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 3 }}>
                    MAKING CHARGES
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow style={{ textAlign: "center" }}>
                            <TableCell style={{ textAlign: "center" }}>MC TYPE</TableCell>
                            <TableCell style={{ textAlign: "center" }}>MC</TableCell>
                            <TableCell style={{ textAlign: "center" }}>MC AMOUNT</TableCell>
                            <TableCell style={{ textAlign: "center" }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow style={{ textAlign: "center" }}>
                            <TableCell style={{ textAlign: "center" }}>{productDetails?.customizations?.variants?.options[0]
                                ?.metal_info?.making_charge_type}</TableCell>
                            <TableCell style={{ textAlign: "center" }}>{productDetails?.customizations?.variants?.options[0]
                                ?.metal_info?.making_charge_value}</TableCell>
                            <TableCell style={{ textAlign: "center" }}>₹{productDetails?.customizations?.variants?.options[0]
                                ?.metal_info?.making_charge_amount}</TableCell>
                            <TableCell style={{ textAlign: "center" }}></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Subtotal */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 3, display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontSize: "1rem" }}>SUBTOTAL</div>
                    <div style={{ fontSize: "1rem" }}>₹{subtotal.toFixed(2)}</div>
                </Typography>

            </Box>
        </Drawer>
    );
};

export default PriceBreakoutDrawer; 