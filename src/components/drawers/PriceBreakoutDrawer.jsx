import { Drawer, Box, Typography, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PriceBreakoutDrawer = ({ open, onClose, productDetails }) => {
    const [subtotal, setSubtotal] = useState(0);
    const [metalPrice, setMetalPrice] = useState(0);
    const [stonePrice, setStonePrice] = useState(0);
    const [rates, setRates] = useState({});
    const [paymentDetails, setPaymentDetails] = useState(null);

    // Fetch rates when component mounts
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/v1.0.0/user/landing.php`)
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

    const calculatePaymentDetails = (data) => {
        const metalInfo = productDetails?.customizations?.variants?.options[0]?.metal_info || {};
        const finalPrice = parseFloat(productDetails?.customizations?.variants?.options[0]?.price || 0);
        
        // Start with the final price and work backwards
        const netWeight = parseFloat(metalInfo.net_wt_after_wastage || 0);
        const rate = rates[metalInfo.quality] || 0;
        
        // Get the fixed values
        const makingCharges = parseFloat(metalInfo.making_charge_amount || 0);
        const hallmarkCharge = parseFloat(metalInfo.hallmark_charge || 0);
        const stoneAmount = parseFloat(metalInfo.stone_amount || 0);
        
        // Calculate base metal amount
        let metalBaseAmount = netWeight * rate;
        
        // Calculate GST (3% of base amount + making charges)
        const gstPercentage = parseFloat(metalInfo.gst_perc || 0);
        const metalGst = (metalBaseAmount + makingCharges) * (gstPercentage / 100);
        
        // Calculate tax (5% of base amount + making charges)
        const taxPercentage = 5;
        const metalTax = (metalBaseAmount + makingCharges) * (taxPercentage / 100);
        
        // Stone calculations
        const stoneGstPercentage = parseFloat(metalInfo.stone_info?.gst_perc || 0);
        const stoneGst = stoneAmount * (stoneGstPercentage / 100);

        metalBaseAmount = metalBaseAmount - metalGst - metalTax + hallmarkCharge;
        
        // Calculate subtotal
        const subTotal = metalBaseAmount + metalGst + metalTax + makingCharges + hallmarkCharge + stoneAmount + stoneGst;

        return {
            taxRate: taxPercentage,
            taxAmount: metalTax,
            subTotal: finalPrice, // Use the final price as subtotal
            totalAmount: finalPrice,
            metal_calculation: {
                base_amount: metalBaseAmount,
                gst_perc: gstPercentage,
                making_charge_amount: makingCharges,
                hallmark_charge: hallmarkCharge,
                gst_amount: metalGst,
            },
            stone_calculation: {
                base_amount: stoneAmount,
                gst_perc: stoneGstPercentage,
                gst_amount: stoneGst,
            }
        };
    };

    useEffect(() => {
        setPaymentDetails(calculatePaymentDetails(productDetails));
    }, [productDetails]);

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
                    METAL DETAILS
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

                {/* Price Breakout Details */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 3 }}>
                    PRICE BREAKOUT DETAILS
                </Typography>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Metal Base Amount</TableCell>
                            <TableCell align="right">₹{paymentDetails?.metal_calculation?.base_amount?.toFixed(2) || '0.00'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Metal GST ({paymentDetails?.metal_calculation?.gst_perc}%)</TableCell>
                            <TableCell align="right">₹{paymentDetails?.metal_calculation?.gst_amount?.toFixed(2) || '0.00'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Metal Tax</TableCell>
                            <TableCell align="right">₹{paymentDetails?.taxAmount?.toFixed(2) || '0.00'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Making Charges</TableCell>
                            <TableCell align="right">₹{paymentDetails?.metal_calculation?.making_charge_amount?.toFixed(2) || '0.00'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Stone Amount</TableCell>
                            <TableCell align="right">₹{paymentDetails?.stone_calculation?.base_amount?.toFixed(2) || '0.00'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Stone GST ({paymentDetails?.stone_calculation?.gst_perc}%)</TableCell>
                            <TableCell align="right">₹{paymentDetails?.stone_calculation?.gst_amount?.toFixed(2) || '0.00'}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Final Amount */}
                <Box sx={{ mt: 3, borderTop: '1px solid rgba(224, 224, 224, 1)', pt: 2 }}>
                    <Typography sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                        <span>Total Amount</span>
                        <span>₹{paymentDetails?.totalAmount?.toFixed(2) || '0.00'}</span>
                    </Typography>
                </Box>
            </Box>
        </Drawer>
    );
};

export default PriceBreakoutDrawer; 