import { Drawer, Box, Typography, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PriceBreakoutDrawer = ({ open, onClose, productDetails }) => {
    console.log(productDetails, "productDetails");
    const [rates, setRates] = useState([]);

    useEffect(() => {
        axios
          .get("https://api.sadashrijewelkart.com/v1.0.0/user/landing.php")
          .then((response) => {
            setRates(() => response?.data?.response?.jewellery_inventory ?? []);
          })
          .catch((error) => console.error("Error fetching menu items:", error));
    }, [productDetails]);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: { xs: '100%', sm: '400px' }, padding: '20px' }
            }}
        >
            <Box sx={{ width: '100%' }}>
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
                            <TableCell>COMPONENT</TableCell>
                            <TableCell>RATE</TableCell>
                            <TableCell>WEIGHT</TableCell>
                            <TableCell>FINAL VALUE</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{productDetails?.customizations?.variants?.options[0]
                      ?.metal_info?.display_name
                            }</TableCell>
                            <TableCell>₹{rates[productDetails.customizations?.variants?.options[0]
                            ?.metal_info?.quality]}/g</TableCell>
                            <TableCell>{productDetails.customizations?.variants?.options[0]
                                ?.metal_info?.net_wt
                            }{" "}
                                g</TableCell>
                            <TableCell>₹{rates[productDetails.customizations?.variants?.options[0]
                            ?.metal_info?.quality] * productDetails.customizations?.variants?.options[0]
                            ?.metal_info?.net_wt
                            }</TableCell>
                        </TableRow>
                        {/* Add more rows as needed */}
                    </TableBody>
                </Table>

                {/* Diamond Price Breakup */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 3 }}>
                    DIAMOND PRICE BREAKUP
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>DIAMOND TYPE</TableCell>
                            <TableCell>SETTING</TableCell>
                            <TableCell>COUNT</TableCell>
                            <TableCell>WEIGHT</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>IJ-SI</TableCell>
                            <TableCell>Micro Prong</TableCell>
                            <TableCell>16</TableCell>
                            <TableCell>0.093 ct</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>
        </Drawer>
    );
};

export default PriceBreakoutDrawer; 