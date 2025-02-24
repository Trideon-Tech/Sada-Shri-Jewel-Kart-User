import { Drawer, Box, Typography, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PriceBreakoutDrawer = ({ open, onClose, productDetails }) => {
    const [subtotal, setSubtotal] = useState(0);
    const [metalPrice, setMetalPrice] = useState(0);
    const [stonePrice, setStonePrice] = useState(0);
    const [metalBaseAmount, setMetalBaseAmount] = useState(0);
    const [rates, setRates] = useState({});
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [totalAmount, setTotalAmount] = useState(null);
    const [totalGST, setTotalGST] = useState(0);

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
    }, [paymentDetails]);

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
            baseAmount += 
                parseFloat(metalInfo.stone_amount || 0);
            setMetalBaseAmount(baseAmount);
        }

        // Add GST if present
        const totalAmount = baseAmount + parseFloat(metalInfo.making_charge_amount || 0) +
            parseFloat(metalInfo.hallmark_charge || 0) +
            parseFloat(metalInfo.rodium_charge || 0);

        // Calculate GST (3% of base amount + making charges)
        const gstPercentage = parseFloat(metalInfo.gst_perc || 0);
        const metalGst = (totalAmount) * (gstPercentage / 100);

        console.log(metalGst, totalAmount)
        setTotalAmount(metalGst + totalAmount);

            // setTotalAmount()
        return Number(totalAmount.toFixed(2));
    };

    // Function to calculate stone price
    const calculateStonePrice = (stoneInfo) => {
        if (!stoneInfo) return 0;

        // 1. Stone Weight calculation
        const stoneWeight = parseFloat(stoneInfo.pieces || 0) * parseFloat(stoneInfo.carat || 0) * 0.2;

        // 2. Stone Amount calculation
        const stoneBaseAmount = parseFloat(stoneInfo.stone_rate || 0) * parseFloat(stoneInfo.carat || 0);

        // Add GST if present
        const stoneGst = stoneBaseAmount * (parseFloat(stoneInfo.gst_perc || 0) / 100);
        const stoneNetAmount = stoneBaseAmount + stoneGst;

        return Number(stoneNetAmount.toFixed(2));
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

        // Set total
        setSubtotal(calculatedMetalPrice + calculatedStonePrice);

    }, [productDetails, rates]);

    // Add this useEffect to initialize values when the component mounts
    useEffect(() => {
        if (productDetails) {
            const metalInfo = productDetails.customizations?.variants?.options[0]?.metal_info;
            const stoneInfo = productDetails.customizations?.variants?.options[0]?.stone_info;

            // Calculate and set initial prices
            setMetalPrice(calculateMetalPrice(metalInfo));
            setStonePrice(calculateStonePrice(stoneInfo));
            setSubtotal(calculateMetalPrice(metalInfo) + calculateStonePrice(stoneInfo));
        }
    }, []); // Run only once on mount

    // Safely get the metal rate
    const getMetalRate = () => {
        const quality = productDetails?.customizations?.variants?.options[0]?.metal_info?.quality;
        return quality && rates[quality] ? rates[quality] : 0;
    };

    const calculatePaymentDetails = (productDetails) => {
        const metalInfo = productDetails?.customizations?.variants?.options[0]?.metal_info || {};
        const stoneInfo = productDetails?.customizations?.variants?.options[0]?.stone_info || {};
        const wastageAmount = metalInfo.wastage_wt * rates[metalInfo.quality] || 0;

        const finalPrice = parseFloat(productDetails?.customizations?.variants?.options[0]?.price || 0);

        // Start with the final price and work backwards
        const netWeight = parseFloat(metalInfo.net_wt_after_wastage || 0);
        const rate = rates[metalInfo.quality] || 0;

        // Get the fixed values
        const makingCharges = parseFloat(metalInfo.making_charge_amount || 0);
        const hallmarkCharge = parseFloat(metalInfo.hallmark_charge || 0);
        const stoneAmount = parseFloat(metalInfo.stone_amount || 0);

        const additionalCharges = parseFloat(hallmarkCharge) + parseFloat(stoneAmount);
        // Calculate base metal amount
        const metalBaseAmount = netWeight * rate;
        // Calculate GST (3% of base amount + making charges)
        const gstPercentage = parseFloat(metalInfo.gst_perc || 0);
        const metalGst = (metalBaseAmount + makingCharges + additionalCharges) * (gstPercentage / 100);

        // 1. Stone Weight calculation
        const stoneWeight = parseFloat(stoneInfo.pieces || 0) * parseFloat(stoneInfo.carat || 0) * 0.2;

        // 2. Stone Amount calculation
        const stoneBaseAmount = parseFloat(stoneInfo.stone_rate || 0) * parseFloat(stoneInfo.carat || 0);

        // Add GST if present
        const stoneGst = stoneBaseAmount * (parseFloat(stoneInfo.gst_perc || 0) / 100);
        const stoneNetAmount = stoneBaseAmount + stoneGst;

        // Calculate subtotal
        const subTotal = metalBaseAmount + metalGst + makingCharges + hallmarkCharge + stoneAmount + stoneGst;
        setTotalGST(metalGst + stoneGst);
        setTotalAmount(subTotal);
        return {
            subTotal: subTotal, // Use the final price as subtotal
            totalAmount: finalPrice,
            additionalCharges: additionalCharges,
            metal_calculation: {
                base_amount: metalBaseAmount,
                gst_perc: gstPercentage,
                making_charge_amount: makingCharges,
                hallmark_charge: hallmarkCharge,
                gst_amount: metalGst,
                wastage: metalInfo.net_wt_after_wastage,
                wastage_amount: wastageAmount,
            },
            stone_calculation: {
                gst_perc: stoneInfo.gst_perc,
                gst_amount: stoneGst,
                stone_amount: stoneBaseAmount,
                stone_in_metal: stoneInfo.stone_amount,
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
                sx: { width: { xs: '90%', sm: '500px' } }
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

                {/* Price Breakout Details */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 3 }}>
                    PRICE BREAKOUT DETAILS
                </Typography>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Metal Base Amount</TableCell>
                            <TableCell align="right">₹{metalBaseAmount.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Making Charges</TableCell>
                            <TableCell align="right">₹{paymentDetails?.metal_calculation?.making_charge_amount?.toFixed(2) || '0.00'}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Wastage</TableCell>
                            <TableCell align="right">₹{paymentDetails?.metal_calculation?.wastage_amount?.toFixed(2) || '0.00'}</TableCell>
                        </TableRow>

                        {paymentDetails?.stone_calculation?.stone_amount > 0 && (
                            <>
                                <TableRow>
                                    <TableCell>Stone Amount</TableCell>
                                    <TableCell align="right">₹{paymentDetails?.stone_calculation?.stone_amount?.toFixed(2) || '0.00'}</TableCell>
                                </TableRow>
                                {/* Stone Details */}
                                <TableRow>
                                    <TableCell colSpan={2} sx={{ pl: 4 }}>
                                        <Box sx={{ pl: 2 }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between', pb: 1 }}>
                                                <span>Pieces</span>
                                                <span>{productDetails?.customizations?.variants?.options[0]?.stone_info?.pieces || '0'}</span>
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between', pb: 1 }}>
                                                <span>Carat</span>
                                                <span>{productDetails?.customizations?.variants?.options[0]?.stone_info?.carat || '0'}</span>
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between', pb: 1 }}>
                                                <span>Weight (Pieces * Carat * 0.2)</span>
                                                <span>{((productDetails?.customizations?.variants?.options[0]?.stone_info?.carat || 0) *
                                                    (productDetails?.customizations?.variants?.options[0]?.stone_info?.pieces || 0) *
                                                    0.2).toFixed(2)} g</span>
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between', pb: 1 }}>
                                                <span>Rate</span>
                                                <span>₹{productDetails?.customizations?.variants?.options[0]?.stone_info?.stone_rate || '0'}</span>
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </>
                        )}

                        <TableRow>
                            <TableCell>Additional Charges</TableCell>
                            <TableCell align="right">₹{paymentDetails?.additionalCharges?.toFixed(2) || '0.00'}</TableCell>
                        </TableRow>

                        {/* toTAL GST AMOUNT */}
                        <TableRow>
                            <TableCell>Total GST Amount</TableCell>
                            <TableCell align="right">₹{totalGST.toFixed(2)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Final Amount */}
                <Box sx={{ mt: 3, pt: 2 }}>
                    <Typography sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                        <span>Total Amount</span>
                        <span>₹{totalAmount?.toFixed(2) || '0.00'}</span>
                    </Typography>
                </Box>
            </Box>
        </Drawer>
    );
};

export default PriceBreakoutDrawer; 