import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from "react";
import { useNavigate } from "react-router-dom";

export default function PromotionImageList() {
  const navigate = useNavigate();
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
          marginTop: matches ? "0px" : "30px",
        }}
      >
        <Grid container spacing={matches ? 5 : 2}>
          <Grid item xs={matches ? 4 : 12}>
            <img
              style={{
                width: "100%",
                borderRadius: "20px",
                cursor: "pointer",
              }}
              src={process.env.PUBLIC_URL + "/assets/1.webp"}
              onClick={() => navigate("/jwellery/DIAMOND%20JEWELLERY/15/false")}
            />
          </Grid>
          <Grid item xs={matches ? 4 : 12}>
            <img
              style={{
                width: "100%",
                borderRadius: "20px",
                cursor: "pointer",
              }}
              src={process.env.PUBLIC_URL + "/assets/2.webp"}
              onClick={() => navigate("/jwellery/GOLD%20JEWELLERY/1/false")}
            />
          </Grid>
          <Grid item xs={matches ? 4 : 12}>
            <img
              style={{
                width: "100%",
                borderRadius: "20px",
                cursor: "pointer",
              }}
              src={process.env.PUBLIC_URL + "/assets/gemstone.webp"}
              onClick={() => navigate("/jwellery/GEMSTONE/13/false")}
            />
          </Grid>
          <Grid item xs={matches ? 4 : 12}>
            <img
              style={{
                width: "100%",
                borderRadius: "20px",
                cursor: "pointer",
              }}
              src={process.env.PUBLIC_URL + "/assets/6.webp"}
              onClick={() => navigate("/jwellery/SILVER%20JEWELLERY/4/false")}
            />
          </Grid>
          <Grid item xs={matches ? 4 : 12}>
            <img
              style={{
                width: "100%",
                borderRadius: "20px",
                cursor: "pointer",
              }}
              src={process.env.PUBLIC_URL + "/assets/8.webp"}
              onClick={() => navigate("/jwellery/SILVER%20ARTICLES/3/false")}
            />
          </Grid>
          <Grid item xs={matches ? 4 : 12}>
            <img
              style={{
                width: "100%",
                borderRadius: "20px",
              }}
              src={process.env.PUBLIC_URL + "/assets/9.webp"}
            />
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          width: "90%",
          height: "100%",
          marginTop: matches ? "100px" : "50px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={matches ? 6 : 12}>
            <img
              src={process.env.PUBLIC_URL + "/assets/12.webp"}
              style={{
                width: "100%",
                borderRadius: "20px",
                cursor: "pointer",
              }}
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
                style={{
                  width: "100%",
                  borderRadius: "20px",
                  cursor: "pointer",
                  height: "32%",
                  objectFit: "cover",
                }}
                src={process.env.PUBLIC_URL + "/assets/22.webp"}
              />

              <img
                style={{
                  width: "100%",
                  borderRadius: "20px",
                  cursor: "pointer",
                  height: "32%",
                  objectFit: "cover",
                }}
                src={process.env.PUBLIC_URL + "/assets/23.webp"}
              />

              <img
                style={{
                  width: "100%",
                  borderRadius: "20px",
                  cursor: "pointer",
                  height: "32%",
                  objectFit: "cover",
                }}
                src={process.env.PUBLIC_URL + "/assets/24.webp"}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          marginTop: matches ? "100px" : "50px",
        }}
      >
        <img
          width={"100%"}
          src={process.env.PUBLIC_URL + "/assets/footer.png"}
        />
      </Box>
    </Box>
  );
}
