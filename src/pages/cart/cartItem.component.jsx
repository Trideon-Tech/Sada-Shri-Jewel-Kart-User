import { FavoriteBorderOutlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

export default function CartItem({
  item,
  removeHandler,
  readOnly,
  moveToWishlistHandler,
}) {
  const matches = useMediaQuery("(min-width:600px)");

  const [openDrawer, setOpenDrawer] = useState(false);

  return matches ? (
    <Card
      sx={{
        borderRadius: "10px",
        display: "flex",
        padding: "3%",
        width: "90%",
        height: "max-content",
        aspectRatio: "4/1",
        marginBottom: "3%",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
      }}
      elevation={1}
    >
      <Box
        style={{
          border: "2px solid #e7e7e7",
          borderRadius: "10px",
          height: "100%",
          aspectRatio: "1/1",
          overflow: "hidden",
        }}
      >
        {item?.images ? (
          <img
            src={`${process.env.REACT_APP_API_URL}/assets/${item?.images[0]?.file}`}
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
          />
        ) : null}
      </Box>
      <Box
        style={{
          height: "100%",
          width: "70%",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginLeft: "20px",
        }}
      >
        <Typography
          style={{
            textAlign: "left",
            fontWeight: "bold",
            fontFamily: '"Roboto", sans-serif',
            fontSize: "1.2rem",
          }}
        >
          {item?.name}
        </Typography>
        <Box
          style={{
            width: "100%",
            marginTop: "2%",
            height: "max-content",
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box
            style={{
              display: "flex",
              marginRight: "auto",
              width: "max-content",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Typography
              style={{
                color: "gray",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              }}
            >
              Quantity :
            </Typography>
            <Typography
              style={{
                color: "gray",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
                marginLeft: "10px",
              }}
            >
              1 Pcs.
            </Typography>
          </Box>
        </Box>
        {item.customization === "-1" ? null : (
          <Box
            style={{
              width: "100%",
              marginTop: "2%",
              height: "max-content",
              display: "flex",
              justifyContent: "flex-start",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Box
              style={{
                display: "flex",
                marginRight: "auto",
                width: "max-content",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Typography
                style={{
                  color: "gray",
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "0.8rem",
                  marginRight: "10px",
                }}
              >
                Size : {item?.size}
              </Typography>

              {/* <Typography
                style={{
                  color: "gray",
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "0.8rem",
                  marginRight: "10px",
                }}
              >
                Customization :
              </Typography>
              {Object.keys(
                item.customization.variant[0].for_customization_options
              ).map((ind) => (
                <Box
                  style={{
                    borderRadius: "20px",
                    width: "max-content",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    marginTop: "5px",
                    marginBottom: "5px",
                    height: "25px",
                    backgroundColor: "#A36E29",
                    color: "white",
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    marginRight: "8px",
                  }}
                >
                  <Typography
                    style={{
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: "0.8rem",
                      fontWeight: "600",
                    }}
                  >
                    {
                      item.customization.variant[0].for_customization_options[
                        ind
                      ]
                    }
                  </Typography>
                </Box>
              ))} */}
            </Box>
          </Box>
        )}
        <Box
          style={{
            width: "100%",
            marginTop: "2%",
            height: "max-content",
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box
            style={{
              display: "flex",
              marginRight: "auto",
              width: "max-content",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Typography
              style={{
                color: "gray",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              }}
            >
              HSN Code :
            </Typography>
            <Typography
              style={{
                color: "gray",
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
                marginLeft: "10px",
              }}
            >
              {item?.hsn}
            </Typography>
          </Box>
        </Box>
        <Typography
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            fontFamily: '"Roboto", sans-serif',
          }}
        >
          <span style={{ fontWeight: "normal" }}>Price :</span> ₹
          {item.customization === "-1"
            ? parseFloat(item?.price).toLocaleString()
            : item.customization.variant[0].price}
        </Typography>
      </Box>
      {!readOnly ? (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            width: "max-content",
            height: "100%",
          }}
        >
          <Button
            onClick={() => removeHandler(item?.cart_id)}
            style={{ padding: 0 }}
          >
            <CloseIcon
              fontSize="large"
              style={{
                marginBottom: "auto",
                color: "#A36E29",
              }}
            />
          </Button>
          <Button
            style={{ marginTop: "auto" }}
            onClick={() => moveToWishlistHandler(item?.id, item?.cart_id)}
          >
            {item?.exists_in_wishlist ? (
              <FavoriteIcon
                fontSize="large"
                style={{
                  color: item?.exists_in_wishlist ? "#A36E29" : "gray",
                  marginBottom: "auto",
                }}
              />
            ) : (
              <FavoriteBorderOutlined
                fontSize="large"
                style={{
                  marginBottom: "auto",
                  color: "#bfbfbf",
                }}
              />
            )}
          </Button>
        </Box>
      ) : null}
    </Card>
  ) : (
    <Card
      sx={{
        borderRadius: "10px",
        aspectRatio: "4/1",
        marginBottom: "3%",

        height: "200px",
        width: "100%",
      }}
      elevation={1}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <Box
          style={{
            border: "2px solid #e7e7e7",
            borderRadius: "10px",
            height: "max-content",
            aspectRatio: "1/1",
            margin: "3%",
          }}
        >
          {item?.images ? (
            <img
              src={`${process.env.REACT_APP_API_URL}/assets/${item?.images[0]?.file}`}
              style={{
                height: "120px",
                width: "120px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          ) : null}
        </Box>
        <Box
          style={{
            height: "100%",
            width: "70%",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography
            style={{
              textAlign: "left",
              fontWeight: "bold",
              fontFamily: '"Roboto", sans-serif',
              fontSize: "1rem",
            }}
          >
            {item?.name}
          </Typography>
          <Box
            style={{
              width: "100%",
              marginTop: "2%",
              height: "max-content",
              display: "flex",
              justifyContent: "flex-start",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box
              style={{
                display: "flex",
                marginRight: "auto",
                width: "max-content",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Typography
                style={{
                  color: "gray",
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "0.8rem",
                }}
              >
                Quantity :
              </Typography>
              <Typography
                style={{
                  color: "gray",
                  fontFamily: '"Roboto", sans-serif',
                  fontSize: "0.8rem",
                  marginLeft: "10px",
                }}
              >
                1 Pcs.
              </Typography>
            </Box>
          </Box>
          {/* {item.customization === "-1" ? null : (
            <>
              <Box
                style={{
                  width: "100%",
                  marginTop: "2%",
                  height: "max-content",
                  display: "flex",
                  justifyContent: "flex-start",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    marginRight: "auto",
                    width: "max-content",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{
                      color: "gray",
                      fontFamily: '"Roboto", sans-serif',
                      fontSize: "0.8rem",
                      marginRight: "10px",
                    }}
                  >
                    Customization :
                  </Typography>
                  <Box
                    style={{
                      borderRadius: "20px",
                      width: "max-content",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      marginTop: "5px",
                      marginBottom: "5px",
                      height: "25px",
                      backgroundColor: "#A36E29",
                      color: "white",
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      marginRight: "8px",
                    }}
                    onClick={() => setOpenDrawer(true)}
                  >
                    <Typography
                      style={{
                        fontFamily: '"Roboto", sans-serif',
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        textDecoration: "underline",
                      }}
                    >
                      {
                        Object.keys(
                          item.customization.variant[0]
                            .for_customization_options
                        ).length
                      }{" "}
                      Applied
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Drawer
                anchor="bottom"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
              >
                <div
                  style={{
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: "1.6rem",
                    fontWeight: "600",
                    backgroundColor: "#E0B872",
                    color: "white",
                    padding: "18px",
                    paddingLeft: "25px",
                  }}
                >
                  Selected Customization
                </div>
                <div
                  style={{
                    display: "flex",
                    marginTop: "10px",
                    marginBottom: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {Object.keys(
                    item.customization.variant[0].for_customization_options
                  ).map((ind) => (
                    <Box
                      style={{
                        borderRadius: "20px",
                        width: "max-content",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        marginTop: "5px",
                        marginBottom: "5px",
                        height: "25px",
                        backgroundColor: "#A36E29",
                        color: "white",
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        marginRight: "8px",
                      }}
                    >
                      <Typography
                        style={{
                          fontFamily: '"Roboto", sans-serif',
                          fontSize: "0.8rem",
                          fontWeight: "600",
                        }}
                      >
                        {
                          item.customization.variant[0]
                            .for_customization_options[ind]
                        }
                      </Typography>
                    </Box>
                  ))}
                </div>
              </Drawer>
            </>
          )} */}
          <Typography
            style={{
              marginTop: "4%",
              fontSize: "1rem",
              fontWeight: "bold",
              fontFamily: '"Roboto", sans-serif',
            }}
          >
            <span style={{ fontWeight: "normal" }}>Price :</span> ₹
            {item.customization === "-1"
              ? parseFloat(item?.price).toLocaleString()
              : item.customization.variant[0].price}
          </Typography>
        </Box>
      </div>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          width: "100%",
          height: "100%",
        }}
      >
        <Button
          style={{ height: "20px", width: "20px" }}
          onClick={() => moveToWishlistHandler(item?.id, item?.cart_id)}
        >
          {item?.exists_in_wishlist ? (
            <FavoriteIcon
              fontSize="large"
              style={{
                color: item?.exists_in_wishlist ? "#A36E29" : "gray",
                marginBottom: "auto",
              }}
            />
          ) : (
            <FavoriteBorderOutlined
              fontSize="large"
              style={{
                marginBottom: "auto",
                color: "#bfbfbf",
              }}
            />
          )}
        </Button>
        <Button
          onClick={() => removeHandler(item?.cart_id)}
          style={{ height: "20px", width: "20px" }}
        >
          <CloseIcon
            fontSize="large"
            style={{
              marginBottom: "auto",
              color: "#A36E29",
            }}
          />
        </Button>
      </Box>
    </Card>
  );
}
