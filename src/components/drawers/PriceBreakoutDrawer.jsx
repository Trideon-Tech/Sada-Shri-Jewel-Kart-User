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

        // Calculate net weight
        const netWeight = parseFloat(metalInfo.gross_wt || 0) - parseFloat(metalInfo.stone_wt || 0);

        // Calculate wastage weight
        const wastageWeight = netWeight * (parseFloat(metalInfo.wastage_prec || 0) / 100);

        // Calculate net weight after wastage
        const netWeightAfterWastage = netWeight + wastageWeight;

        let baseAmount = 0;
        const rate = rates[metalInfo.quality] || 0;

        // Handle fixed price case (type 8)
        if (metalInfo.making_charge_type === 8) {
            baseAmount = parseFloat(metalInfo.making_charge_amount || 0);
        } else {
            // Calculate base amount based on weight
            if (netWeightAfterWastage) {
                baseAmount = netWeightAfterWastage * rate;
            } else if (netWeight) {
                baseAmount = netWeight * rate;
            } else if (metalInfo.gross_wt) {
                baseAmount = parseFloat(metalInfo.gross_wt) * rate;
            }

            // Add additional charges
            baseAmount += parseFloat(metalInfo.making_charge_amount || 0) +
                          parseFloat(metalInfo.stone_amount || 0) +
                          parseFloat(metalInfo.hallmark_charge || 0) +
                          parseFloat(metalInfo.rodium_charge || 0);
        }

        // Add GST if present
        const gstAmount = baseAmount * (parseFloat(metalInfo.gst_perc || 0) / 100);
        const totalAmount = baseAmount + gstAmount;

        return Number(totalAmount.toFixed(2));
    };

    // Function to calculate stone price
    const calculateStonePrice = (stoneInfo) => {
        if (!stoneInfo) return 0;

        // Calculate stone weight
        const stoneWeight = parseFloat(stoneInfo.pieces || 0) * parseFloat(stoneInfo.carat || 0) * 0.2;

        // Calculate base amount
        const stoneRate = parseFloat(stoneInfo.stone_rate || 0);
        const baseAmount = stoneWeight * stoneRate;

        // Add GST
        const gstAmount = baseAmount * (parseFloat(stoneInfo.gst_perc || 0) / 100);
        const total = baseAmount + gstAmount;

        return Number(total.toFixed(2));
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