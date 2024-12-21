import { AddAPhoto, DeleteForever } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import {
  Box,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generalToastStyle } from "../../utils/toast.styles";
import OverAllRating from "./subComponents/overAllRating.component";
import ReviewList from "./subComponents/reviewList.component";

const Reviews = ({ productDetails, rating, reviewsCount }) => {
  const navigate = useNavigate();
  const matches = useMediaQuery("(min-width:600px)");
  // console.log("produce Details ", productDetails);
  const [open, setOpen] = useState(false);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(3);
  const [reviewImages, setreviewImages] = useState(null);
  const [reviewsData, setReivewData] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const openModal = () => {
    if (localStorage.getItem("mobile") == null) {
      navigate(
        `/signin?redirect_to=/item/${productDetails?.category}/${productDetails?.name}-${productDetails?.hash}`
      );
    } else {
      setOpen(true);
    }
  };

  const addReviewHandler = () => {
    const formData = new FormData();
    formData.append("type", "post_reviews");
    formData.append("product_hash", productDetails.hash);
    formData.append("user_id", localStorage.getItem("user_id"));
    formData.append("rating", reviewRating);
    formData.append("title", reviewTitle);
    formData.append("content", reviewContent);
    formData.append("review_img[]", reviewImages[0]);

    const token = localStorage.getItem("token");
    axios
      .post(
        "https://api.sadashrijewelkart.com/v1.0.0/user/products/reviews.php",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          token,
        }
      )
      .then((response) => {
        console.log("review created", response);
        setOpen(false);
        toast.info("Review Added Successfully", generalToastStyle);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(error?.response?.data?.message, generalToastStyle);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("productDetails", productDetails);
    console.log("productDetails id", productDetails.id);
    if (!productDetails.id) return;
    axios
      .get(
        `https://api.sadashrijewelkart.com/v1.0.0/user/products/reviews.php?type=all&page=1&page_size=10&product_id=${productDetails.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        setTotalPages(response?.data?.response?.totalPages);
        setReivewData(response?.data?.response?.reviews);
      })
      .catch((error) => {});
  }, [productDetails]);

  return (
    <Box
      style={{
        paddingLeft: "5%",
        paddingRight: "5%",
        paddingTop: "3%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      <ToastContainer />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        style={{ overFlow: "scroll" }}
      >
        <ModalDialog
          style={{
            width: "40%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overFlow: "scroll",
          }}
        >
          <Box style={{ width: "100%", height: "50px", display: "flex" }}>
            <CloseIcon
              style={{
                fontSize: "1.2rem",
                color: "#707070",
                marginLeft: "auto",
              }}
              onClick={() => setOpen(false)}
            />
          </Box>
          <Typography
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              fontFamily: '"Roboto", sans-serif',
            }}
          >
            {productDetails.name}
          </Typography>
          <Rating
            name="size-large"
            defaultValue={reviewRating}
            size="large"
            onChange={(event) => {
              setReviewRating(parseInt(event.target.value));
            }}
          />
          <Typography
            style={{
              fontSize: "0.7rem",
              fontFamily: '"Roboto", sans-serif',
            }}
          >
            {" "}
            Tap on the stars to rate your experience
          </Typography>
          <Divider style={{ width: "100%" }} />

          <label htmlFor="cat-image">
            <div
              style={{
                height: "90px",
                width: "90px",
                border: "1px solid grey",
                borderRadius: "10px",
                marginRight: "20px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              {reviewImages && reviewImages.length > 0
                ? console.log("reviewImages length", reviewImages?.length)
                : null}

              <AddAPhoto />
            </div>
          </label>
          <input
            type="file"
            accept="image/*"
            id="cat-image"
            style={{
              display: "none",
            }}
            onChange={(e) => {
              const file = e.target.files[0];

              console.log("reviewImages: ", file);
              if (file) {
                if (reviewImages) {
                  setreviewImages([file]);
                } else {
                  setreviewImages([file]);
                }
              }
            }}
          />
          <ImageList
            sx={{
              width: "70%",
              height: 200,
              backgroundColor: "#e7e7e7",
            }}
            maxRows={1}
            cols={100}
          >
            {reviewImages?.map((reviewImage, index) => (
              <ImageListItem key={index}>
                <img
                  src={URL.createObjectURL(reviewImage)}
                  style={{ width: "auto", height: 200 }}
                  alt={"image"}
                  loading="lazy"
                />
                <ImageListItemBar
                  sx={{
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                  }}
                  position="top"
                  actionIcon={
                    <IconButton sx={{ color: "white" }}>
                      <DeleteForever
                        style={{ color: "white" }}
                        onClick={() => {
                          console.log("remove", index);
                          setreviewImages(
                            reviewImages.filter((item, ind) => ind !== index)
                          );
                        }}
                      />
                    </IconButton>
                  }
                  actionPosition="left"
                />
              </ImageListItem>
            ))}
          </ImageList>
          <TextField
            sx={{
              width: matches ? "50%" : "100%",
              fontSize: "0.8rem",
              height: "22px",
              marginTop: "2%",
              "& input": {
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#a36e29",
                },
              },
              "& .MuiInputLabel-root": {
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
                color: "#00000",
              },
            }}
            value={reviewTitle}
            onChange={(event) => {
              setReviewTitle(event.target.value);
            }}
            label="Title"
          />

          <TextField
            onChange={(event) => {
              setReviewContent(event.target.value);
            }}
            autoFocus
            multiline
            rows={3}
            sx={{
              width: matches ? "50%" : "100%",
              marginTop: matches ? "5%" : "10%",
              "& .MuiInputBase-root": {
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              },
              "& textarea": {
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#a36e29",
                },
              },
              "& .MuiInputLabel-root": {
                fontFamily: '"Roboto", sans-serif',
                fontSize: "0.8rem",
                color: "#5a5a5a",
              },
            }}
            label="Message"
          />
          <Button
            fullWidth
            style={{
              width: "50%",
              background: "#a36e29",
              fontFamily: '"Roboto", sans-serif',
              fontSize: "0.8rem",
            }}
            onClick={() => addReviewHandler()}
          >
            Submit Review
          </Button>
        </ModalDialog>
      </Modal>
      <Typography
        style={{
          fontWeight: "bold",
          fontFamily: '"Roboto", sans-serif',
          fontSize: "1.2rem",
          marginRight: "auto",
        }}
      >
        Customer Reviews
      </Typography>
      <Box
        style={{
          width: "100%",
          display: "flex",
          flexDirection: matches ? "row" : "column",
          justifyContent: "space-between",
          alignItems: matches ? "flex-start" : "center",
          marginTop: "1%",
          marginBottom: "1%",
        }}
      >
        <OverAllRating
          openModal={openModal}
          rating={rating}
          reviewsCount={reviewsCount}
          enableWrite={productDetails.admin_verified == 1}
        />
      </Box>
      <Divider style={{ width: "100%" }} />
      <ReviewList reviewsData={reviewsData} totalpages={totalPages} />
    </Box>
  );
};

export default Reviews;
