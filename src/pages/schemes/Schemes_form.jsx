import React from "react";
import {
  Box,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import ringLogo from "../../assets/images/2 1.svg";
import Navbar from "../../components/navbar/navbar.component";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Card } from "@mui/material";
import ButtonComponent from "../../components/button/button.component";
import scheme_steps from "../../assets/images/scheme_steps.png"

import { InputAdornment } from "@mui/material";

const Schemes_form = () => {
  return (
    <Box >
      <Box>
        <Navbar />
      </Box>

      <Box
        sx={{
          minHeight: "68vh",
          backgroundColor: "#F9F5EC",
          position: "relative",
        }}
      >
        <Box
          component="img"
          src={ringLogo}
          sx={{
            width: { xs: "200px", sm: "250px", md: "300px" },
            position: "relative",
            top: "2px",
            left: "369px",
          }}
        ></Box>
        <Box sx={{ position: "absolute", top: "100px", left: "531px" }}>
          <Typography
            sx={{
              fontFamily: "open sans",
              fontWeight: "700",
              fontSize: "36px",
              textAlign: "center",
            }}
          >
            Turn Daily Savings into
          </Typography>
          <Typography
            sx={{
              fontFamily: "open sans",
              fontWeight: "700",
              fontSize: "36px",
              color: "#A36E29",
              textAlign: "center",
            }}
          >
            Timeless Treasures
          </Typography>
          <Typography
            sx={{
              fontFamily: "open sans",
              fontWeight: "600",
              fontSize: "17px",
              color: "#000000B2",
            }}
          >
            Join the SadāShrī Jewelkart Daily Gold Savings Scheme Today
          </Typography>
          <Typography>Save Now. Shine Forever.</Typography>
        </Box>
        <Card
          sx={{
            width: "710px",
            height: "300px",
            position: "absolute",
            top: "290px",
            left: "401px",
            borderRadius: "12px",
          }}
        >
          <CardContent
            sx={{ textAlign: "center", position: "relative", top: "20px" }}
          >
            <FormControl sx={{ width: "531px" }}>
              <Select sx={{ borderRadius: "7px" }}>
                <MenuItem>Turn Daily Savings into Timeless Treasures</MenuItem>
                <MenuItem>Turn Daily Savings into Timeless Treasures</MenuItem>
                <MenuItem>Turn Daily Savings into Timeless Treasures</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              sx={{ width: "531px", position: "relative", top: "30px" }}
            >
              <TextField
                sx={{ borderRadius: "10px", width: "531px", height: "54px" }}
                placeholder="Enter the amount you want"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "22px",
                          fontWeight: 400,
                          color: "#000",
                        }}
                      >
                        ₹
                        <span
                          style={{
                            fontSize: "35px",
                            marginLeft: "12px",
                            marginRight: "12px",
                            color: "#000044",
                            lineHeight: "1",
                          }}
                        >
                          |
                        </span>
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </CardContent>
          <CardActions
            sx={{
              position: "relative",
              top: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ButtonComponent
              buttonText={"Start Now"}
              style={{
                width: "250px",
                height: "27px",
                background: "linear-gradient(to right, #A36E29, #E0B872)",
                color: "#fff",
                fontWeight: "600",
                fontSize: "16px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // textAlign: "center",
                //   boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                //transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            />
          </CardActions>
          <CardContent sx={{position:"relative",top:"25px", display:"flex",justifyContent:"center",alignItems:"center"}}>
            <Typography sx={{fontFamily:"open sans",
                fontWeight:"600",
                fontSize:"14px"
            }}>
              * Missed a installment or wanna pay your installment? <strong style={{color:"#A36E29"}}>Pay Now</strong>
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{
       
      }}>
        <Typography sx={{
         fontFamily: "open sans",
              fontWeight: "700",
              fontSize: "32px",
              textAlign: "center",
              position:"relative",
              top:"150px",
              height:"700px"
              
        }}>
            How does it work?
        </Typography>
        <Box
        component="img"
        src={scheme_steps}
        sx={{width:"1018px",position:"absolute",top:"780px",left:"247px"}}>

        </Box>
      </Box>
    </Box>
  );
};

export default Schemes_form;
