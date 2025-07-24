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
    const [makingchargeAmount, setMakingchargeAmount] = useState(0);
    const [metalGSTState, setMetalGSTState] = useState(0);
    const [stoneGSTState, setStoneGSTState] = useState(0);

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

    // Function to calculate metal price (Updated to match backend logic)
    const calculateMetalPrice = (metalInfo) => {
        if (!metalInfo || !rates) return 0;

        // Calculate net weight
        const netWeight = parseFloat(metalInfo.gross_wt || 0) - parseFloat(metalInfo.stone_wt || 0);

        // Calculate wastage weight
        const wastageWeight = netWeight * (parseFloat(metalInfo.wastage_prec || 0) / 100);

        // Calculate net weight after wastage
        const netWeightAfterWastage = netWeight + wastageWeight;

        let metalBaseAmount = 0;
        const rate = rates[metalInfo.quality] || 0;

        // Handle fixed price case (type 8)
        if (metalInfo.making_charge_type === 8) {
            metalBaseAmount = parseFloat(metalInfo.making_charge_amount || 0);
        } else {
            // Calculate base amount based on weight
            if (netWeightAfterWastage) {
                metalBaseAmount = netWeightAfterWastage * rate;
            } else if (netWeight) {
                metalBaseAmount = netWeight * rate;
            } else if (metalInfo.gross_wt) {
                metalBaseAmount = parseFloat(metalInfo.gross_wt) * rate;
            }

            // Calculate making charges
            const makingChargeAmount = metalBaseAmount * parseFloat(metalInfo.making_charge_value || 0) / 100;
            setMakingchargeAmount(makingChargeAmount);
            
            // Add additional charges to base amount (following backend logic)
            metalBaseAmount += makingChargeAmount +
                parseFloat(metalInfo.stone_amount || 0) +
                parseFloat(metalInfo.hallmark_charge || 0) +
                parseFloat(metalInfo.rodium_charge || 0);
        }

        setMetalBaseAmount(metalBaseAmount);

        // Calculate GST only on metal value (excluding making charges) - following backend logic
        const metalValueOnly = netWeightAfterWastage * rate;
        const gstPercentage = parseFloat(metalInfo.gst_perc || 0);
        const metalGst = metalValueOnly * (gstPercentage / 100);

        console.log("Metal GST calculation:", { metalValueOnly, gstPercentage, metalGst });

        setMetalGSTState(metalGst);
        const metalNetAmount = metalBaseAmount + metalGst;

        return Number(metalNetAmount.toFixed(2));
    };

    // Function to calculate stone price (Updated to match backend logic)
    const calculateStonePrice = (stoneInfo) => {
        if (!stoneInfo) return 0;

        // 1. Stone Weight calculation
        const stoneWeight = parseFloat(stoneInfo.pieces || 0) * parseFloat(stoneInfo.carat || 0) * 0.2;

        // 2. Stone Amount calculation (Fixed to match backend - includes * 0.2)
        const stoneBaseAmount = parseFloat(stoneInfo.stone_rate || 0) * parseFloat(stoneInfo.carat || 0) * 0.2;

        // Add GST if present
        const stoneGst = stoneBaseAmount * (parseFloat(stoneInfo.gst_perc || 0) / 100);

        setStoneGSTState(stoneGst);
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

        // Calculate stone price
        const calculatedStonePrice = calculateStonePrice(stoneInfo);

        // Set total and update total GST
        setSubtotal(calculatedMetalPrice + calculatedStonePrice);
        setTotalGST(metalGSTState + stoneGSTState);

    }, [productDetails, rates]);

    // Add this useEffect to initialize values when the component mounts
    useEffect(() => {
        if (productDetails) {
            const metalInfo = productDetails.customizations?.variants?.options[0]?.metal_info;
            const stoneInfo = productDetails.customizations?.variants?.options[0]?.stone_info;

            // Calculate and set initial prices
            const calculatedMetalPrice = calculateMetalPrice(metalInfo);
            const calculatedStonePrice = calculateStonePrice(stoneInfo);
            setMetalPrice(calculatedMetalPrice);
            setStonePrice(calculatedStonePrice);
            setSubtotal(calculatedMetalPrice + calculatedStonePrice);
            setTotalGST(metalGSTState + stoneGSTState);
        }
    }, []); // Run only once on mount

    // Safely get the metal rate
    const getMetalRate = () => {
        const quality = productDetails?.customizations?.variants?.options[0]?.metal_info?.quality;
        return quality && rates[quality] ? rates[quality] : 0;
    };

    const calculatePaymentDetails = (productDetails) => {
        if (!productDetails?.customizations?.variants?.options[0]) return null;
        
        const metalInfo = productDetails.customizations.variants.options[0].metal_info || {};
        const stoneInfo = productDetails.customizations.variants.options[0].stone_info || {};
        const rate = rates[metalInfo.quality] || 0;

        // Calculate net weight
        const grossWeight = parseFloat(metalInfo.gross_wt || 0);
        const stoneWeight = parseFloat(metalInfo.stone_wt || 0);
        const netWeight = grossWeight - stoneWeight;

        // Calculate wastage weight (check multiple possible fields)
        const wastagePercentage = parseFloat(metalInfo.wastage_prec || metalInfo.wastage_perc || 0);
        const wastageWeight = netWeight * (wastagePercentage / 100);
        const netWeightAfterWastage = netWeight + wastageWeight;

        // Get backend pre-calculated values
        const backendNetWeightAfterWastage = parseFloat(metalInfo.net_wt_after_wastage || 0);
        const backendMakingChargeAmount = parseFloat(metalInfo.making_charge_amount || 0);
        const backendWastageAmount = parseFloat(metalInfo.wastage_amount || 0);

        // Use backend's pre-calculated wastage amount
        const wastageAmount = backendWastageAmount > 0 ? backendWastageAmount : wastageWeight * rate;
        
        console.log("🔍 Wastage Debug:", {
            wastagePercentage,
            wastageWeight,
            netWeight,
            wastageAmount,
            wastage_prec: metalInfo.wastage_prec,
            wastage_perc: metalInfo.wastage_perc,
            wastage_wt: metalInfo.wastage_wt
        });

        // Check if backend has pre-calculated values
        console.log("🔍 Backend Pre-calculated Values:", {
            net_wt_after_wastage: metalInfo.net_wt_after_wastage,
            making_charge_amount: metalInfo.making_charge_amount,
            wastage_wt: metalInfo.wastage_wt,
            wastage_amount: metalInfo.wastage_amount
        });

        // Use backend values directly
        
        // Use backend values directly
        let metalBaseAmount = 0;
        let makingCharges = backendMakingChargeAmount;
        let hallmarkCharge = parseFloat(metalInfo.hallmark_charge || 0);
        let stoneAmount = parseFloat(metalInfo.stone_amount || 0);
        let rodiumCharge = parseFloat(metalInfo.rodium_charge || 0);
        
        if (metalInfo.making_charge_type === "8") {
            metalBaseAmount = backendMakingChargeAmount;
        } else {
                    // Use backend's exact calculation method
        // Start with metal value only
        metalBaseAmount = backendNetWeightAfterWastage * rate;
        
        // Add making charges (already calculated by backend)
        metalBaseAmount += makingCharges;
        
        // Add additional charges
        metalBaseAmount += stoneAmount + hallmarkCharge + rodiumCharge;
        
        console.log("🔍 Metal Base Amount Calculation:", {
            backendNetWeightAfterWastage,
            rate,
            metalValueOnly: backendNetWeightAfterWastage * rate,
            makingCharges,
            stoneAmount,
            hallmarkCharge,
            rodiumCharge,
            metalBaseAmount
        });
        }

        // Calculate GST using backend's pre-calculated net weight
        const metalValueOnly = backendNetWeightAfterWastage * rate;
        const gstPercentage = parseFloat(metalInfo.gst_perc || 0);
        const metalGst = (metalValueOnly * gstPercentage) / 100;

        // Stone calculations
        const stonePieces = parseFloat(stoneInfo.pieces || 0);
        const stoneCarat = parseFloat(stoneInfo.carat || 0);
        const stoneRate = parseFloat(stoneInfo.stone_rate || 0);
        const stoneBaseAmount = stoneRate * stoneCarat * 0.2;
        const stoneGstPerc = parseFloat(stoneInfo.gst_perc || 0);
        const stoneGst = (stoneBaseAmount * stoneGstPerc) / 100;

        // Use backend's final price as the total
        const backendFinalPrice = parseFloat(productDetails?.customizations?.variants?.options[0]?.price || 0);
        const metalNetAmount = metalBaseAmount + metalGst;
        const stoneNetAmount = stoneBaseAmount + stoneGst;
        const calculatedTotal = metalNetAmount + stoneNetAmount;
        const totalGST = metalGst + stoneGst;
        
        // Use backend price as the final total
        const totalAmount = backendFinalPrice;
        
        console.log("🔍 Final Calculation Comparison:", {
            metalBaseAmount,
            makingCharges,
            hallmarkCharge,
            rodiumCharge,
            stoneAmount,
            metalGst,
            metalNetAmount,
            stoneBaseAmount,
            stoneGst,
            stoneNetAmount,
            calculatedTotal,
            backendPrice: backendFinalPrice,
            difference: Math.abs(calculatedTotal - backendFinalPrice),
            breakdown: {
                metalValue: metalValueOnly,
                makingCharges,
                hallmarkCharge,
                rodiumCharge,
                stoneAmount,
                metalGst,
                stoneBaseAmount,
                stoneGst
            }
        });

        // Update state
        setTotalAmount(totalAmount);
        setTotalGST(totalGST);

        // Debug logging to compare with backend
        console.log("🔍 Frontend Price Calculation Debug:", {
            grossWeight,
            stoneWeight,
            netWeight,
            wastagePercentage,
            wastageWeight,
            netWeightAfterWastage,
            rate,
            metalValueOnly,
            makingCharges,
            hallmarkCharge,
            stoneAmount,
            rodiumCharge,
            metalBaseAmount,
            metalGst,
            stoneBaseAmount,
            stoneGst,
            totalAmount,
            backendPrice: productDetails?.customizations?.variants?.options[0]?.price,
            // Raw metal info for debugging
            rawMetalInfo: metalInfo,
            rawStoneInfo: stoneInfo
        });

        return {
            subTotal: calculatedTotal,
            totalAmount: backendFinalPrice,
            additionalCharges: hallmarkCharge + stoneAmount,
            metal_calculation: {
                base_amount: metalBaseAmount,
                gst_perc: gstPercentage,
                making_charge_amount: makingCharges,
                hallmark_charge: hallmarkCharge,
                rodium_charge: rodiumCharge,
                stone_amount: stoneAmount,
                gst_amount: metalGst,
                wastage: backendNetWeightAfterWastage,
                wastage_amount: backendWastageAmount,
                metal_value_only: metalValueOnly,
                net_amount: metalNetAmount
            },
            stone_calculation: {
                gst_perc: stoneGstPerc,
                gst_amount: stoneGst,
                stone_amount: stoneBaseAmount,
                stone_in_metal: stoneAmount,
                net_amount: stoneNetAmount
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
                            <TableCell>Metal Value (After Wastage)</TableCell>
                            <TableCell align="right">₹{paymentDetails?.metal_calculation?.metal_value_only?.toFixed(2) || '0.00'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Making Charges</TableCell>
                            <TableCell align="right">₹{paymentDetails?.metal_calculation?.making_charge_amount?.toFixed(2) || '0.00'}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Wastage Amount</TableCell>
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
                            <TableCell>Hallmark Charges</TableCell>
                            <TableCell align="right">₹{paymentDetails?.metal_calculation?.hallmark_charge?.toFixed(2) || '0.00'}</TableCell>
                        </TableRow>

                        {/* Add missing components */}
                        {paymentDetails?.metal_calculation?.rodium_charge > 0 && (
                            <TableRow>
                                <TableCell>Rodium Charges</TableCell>
                                <TableCell align="right">₹{paymentDetails?.metal_calculation?.rodium_charge?.toFixed(2) || '0.00'}</TableCell>
                            </TableRow>
                        )}

                        {paymentDetails?.metal_calculation?.stone_amount > 0 && (
                            <TableRow>
                                <TableCell>Stone Amount in Metal</TableCell>
                                <TableCell align="right">₹{paymentDetails?.metal_calculation?.stone_amount?.toFixed(2) || '0.00'}</TableCell>
                            </TableRow>
                        )}

                        <TableRow>
                            <TableCell>Metal GST ({paymentDetails?.metal_calculation?.gst_perc || 0}%)</TableCell>
                            <TableCell align="right">₹{paymentDetails?.metal_calculation?.gst_amount?.toFixed(2) || '0.00'}</TableCell>
                        </TableRow>

                        {paymentDetails?.stone_calculation?.stone_amount > 0 && (
                            <>
                                <TableRow>
                                    <TableCell>Stone Amount</TableCell>
                                    <TableCell align="right">₹{paymentDetails?.stone_calculation?.stone_amount?.toFixed(2) || '0.00'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Stone GST ({paymentDetails?.stone_calculation?.gst_perc || 0}%)</TableCell>
                                    <TableCell align="right">₹{paymentDetails?.stone_calculation?.gst_amount?.toFixed(2) || '0.00'}</TableCell>
                                </TableRow>
                            </>
                        )}
                    </TableBody>
                </Table>

                {/* Final Amount */}
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #ddd' }}>
                    <Typography sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        <span>Calculated Total</span>
                        <span>₹{paymentDetails?.totalAmount?.toFixed(2) || '0.00'}</span>
                    </Typography>
            
                </Box>
            </Box>
        </Drawer>
    );
};

export default PriceBreakoutDrawer; 