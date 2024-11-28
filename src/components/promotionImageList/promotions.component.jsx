import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from "react";

export default function PromotionImageList() {
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <Box
      style={{
        width: "100%",
        height: "max-content",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "90%",
          height: "100%",
          marginTop: matches ? "100px" : "30px",
        }}
      >
        <Grid container spacing={matches ? 5 : 2}>
          <Grid item xs={matches ? 4 : 12}>
            <img
              style={{
                width: "100%",
                borderRadius: "20px",
              }}
              src={process.env.PUBLIC_URL + "/assets/b1.png"}
            />
          </Grid>
          <Grid item xs={matches ? 4 : 12}>
            <img
              style={{
                width: "100%",
                borderRadius: "20px",
              }}
              src={process.env.PUBLIC_URL + "/assets/b2.png"}
            />
          </Grid>
          <Grid item xs={matches ? 4 : 12}>
            <img
              style={{
                width: "100%",
                borderRadius: "20px",
              }}
              src={process.env.PUBLIC_URL + "/assets/b3.png"}
            />
          </Grid>
          <Grid item xs={matches ? 4 : 12}>
            <img
              style={{
                width: "100%",
                borderRadius: "20px",
              }}
              src={process.env.PUBLIC_URL + "/assets/b4.png"}
            />
          </Grid>
          <Grid item xs={matches ? 4 : 12}>
            <img
              style={{
                width: "100%",
                borderRadius: "20px",
              }}
              src={process.env.PUBLIC_URL + "/assets/b5.png"}
            />
          </Grid>
          <Grid item xs={matches ? 4 : 12}>
            <img
              style={{
                width: "100%",
                borderRadius: "20px",
              }}
              src={process.env.PUBLIC_URL + "/assets/b6.png"}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ width: "90%", height: "100%", marginTop: "100px" }}>
        <Grid container spacing={4}>
          <Grid item xs={matches ? 6 : 12}>
            <img
              width={"100%"}
              src={process.env.PUBLIC_URL + "/assets/side1_1.png"}
            />
          </Grid>

          <Grid item xs={matches ? 6 : 12}>
            <Box
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <img
                width={"100%"}
                src={process.env.PUBLIC_URL + "/assets/side2_1.png"}
              />

              <img
                width={"100%"}
                src={process.env.PUBLIC_URL + "/assets/side2_2.png"}
              />

              <img
                width={"100%"}
                src={process.env.PUBLIC_URL + "/assets/side2_1.png"}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: "100%", height: "100%", marginTop: "100px" }}>
        <img
          width={"100%"}
          src={process.env.PUBLIC_URL + "/assets/footer.png"}
        />
      </Box>
    </Box>
  );
}

const itemData = [
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Bed",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Books",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Sink",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Kitchen",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Blinds",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Chairs",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Laptop",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Doors",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Coffee",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Storage",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Candle",
  },
  {
    img: "https://random-image-pepebigotes.vercel.app/api/random-image?m=m",
    title: "Coffee table",
  },
];
