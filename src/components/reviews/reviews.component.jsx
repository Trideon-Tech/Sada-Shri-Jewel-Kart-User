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
import { generalToastStyle } from "../../utils/toast.styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OverAllRating from "./subComponents/overAllRating.component";
import { DeleteForever, Height, Remove } from "@mui/icons-material";
import CustomerLikePills from "./subComponents/customerLikePills.component";
import RatingImages from "./subComponents/ratingImages.component";
import ReviewList from "./subComponents/reviewList.component";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Stack from "@mui/joy/Stack";
import Add from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Sheet from "@mui/joy/Sheet";
import { useState } from "react";
import Textarea from "@mui/joy/Textarea";
import {
  Search,
  Edit,
  Delete,
  AddAPhoto,
  Done,
  Restore,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import axios from "axios";

const Reviews = ({ productDetails }) => {
  console.log("produce Details ", productDetails);
  const [open, setOpen] = useState(false);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(3);
  const [reviewImages, setreviewImages] = useState(null);

  const openModal = () => {
    setOpen(true);
  };
  const addReviewHandler = () => {
    const formData = new FormData();
    formData.append("type", "post_reviews");
    formData.append("product_hash", productDetails.hash);
    formData.append("user_id", localStorage.getItem("user_id"));
    formData.append("rating", reviewRating);
    formData.append("title", reviewTitle);
    formData.append("content", reviewContent);
    formData.append("review_img[]", reviewImages);

    const token = localStorage.getItem("token");
    axios
      .post(
        "https://api.sadashrijewelkart.com/v1.0.0//user/products/reviews.php",
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
        toast.error(error.response.data.message, generalToastStyle);
      });
  };
  return (
    <Box
      style={{
        width: "80%",
        padding: "10%",
        overFlowX: "scroll",
        backgroundColor: "white",
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
                fontSize: "1.5rem",
                color: "#707070",
                marginLeft: "auto",
              }}
              onClick={() => setOpen(false)}
            />
          </Box>
          <Typography style={{ fontSize: "1.7rem", color: "#707070" }}>
            Margirita Dimond And Silver
          </Typography>
          <Rating
            name="size-large"
            defaultValue={reviewRating}
            size="large"
            onChange={(event) => {
              setReviewRating(parseInt(event.target.value));
            }}
          />
          <Typography style={{ fontSize: "0.7rem" }}>
            {" "}
            Tap on the stars to rate your experience
          </Typography>
          <Divider style={{ width: "100%" }} />
          {/* <Typography
            style={{ fontWeight: "bold", fontSize: "1.5rem", marginTop: "3%" }}
          >
            What Can We Imporve?
          </Typography>
          <RadioGroup
            aria-labelledby="storage-label"
            defaultValue="512GB"
            size="md"
            sx={{
              gap: 1.5,
              display: "flex",
              width: "90%",

              height: "max-content",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {[
              "Design",
              "Size/Fit",
              "Quality",
              "Delivery",
              "Packaging",
              "Customer Service",
              "Overall Experience",
              "Others",
            ].map((value) => (
              <Sheet
                key={value}
                sx={{
                  width: "max-content",
                  p: 2,
                  borderRadius: "md",
                  boxShadow: "sm",
                }}
              >
                <Radio
                  label={`${value}`}
                  overlay
                  disableIcon
                  value={value}
                  slotProps={{
                    label: ({ checked }) => ({
                      sx: {
                        fontWeight: "lg",
                        fontSize: "md",
                        color: checked ? "text.primary" : "text.secondary",
                      },
                    }),
                    action: ({ checked }) => ({
                      sx: (theme) => ({
                        ...(checked && {
                          "--variant-borderWidth": "2px",
                          "&&": {
                            // && to increase the specificity to win the base :hover styles
                            borderColor: theme.vars.palette.primary[500],
                          },
                        }),
                      }),
                    }),
                  }}
                />
              </Sheet>
            ))}
          </RadioGroup>
          <Divider style={{ width: "100%", marginTop: "10%" }} />
          <Typography
            style={{ fontWeight: "bold", fontSize: "1.5rem", marginTop: "3%" }}
          >
            What did we impress you with?
          </Typography>
          <RadioGroup
            aria-labelledby="storage-label"
            defaultValue="512GB"
            size="md"
            sx={{
              gap: 1.5,
              display: "flex",
              width: "90%",
              height: "max-content",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {[
              "Design",
              "Size/Fit",
              "Quality",
              "Delivery",
              "Packaging",
              "Customer Service",
              "Overall Experience",
              "Others",
            ].map((value) => (
              <Sheet
                key={value}
                sx={{
                  width: "max-content",
                  p: 2,
                  borderRadius: "md",
                  boxShadow: "sm",
                }}
              >
                <Radio
                  label={`${value}`}
                  overlay
                  disableIcon
                  value={value}
                  slotProps={{
                    label: ({ checked }) => ({
                      sx: {
                        fontWeight: "lg",
                        fontSize: "md",
                        color: checked ? "text.primary" : "text.secondary",
                      },
                    }),
                    action: ({ checked }) => ({
                      sx: (theme) => ({
                        ...(checked && {
                          "--variant-borderWidth": "2px",
                          "&&": {
                            // && to increase the specificity to win the base :hover styles
                            borderColor: theme.vars.palette.primary[500],
                          },
                        }),
                      }),
                    }),
                  }}
                />
              </Sheet>
            ))}
          </RadioGroup> */}
          {/* <Divider style={{ width: "100%", marginTop: "5%" }} /> */}
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
                  setreviewImages([...reviewImages, file]);
                } else {
                  setreviewImages([file]);
                }
              }
              console.log("reviewImages", reviewImages);
            }}
          />
          <ImageList
            sx={{
              width: 500,
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
            fullWidth
            style={{ width: "50%", marginTop: "2%" }}
            id="outlined-controlled"
            label="Title"
            value={reviewTitle}
            onChange={(event) => {
              setReviewTitle(event.target.value);
            }}
          />
          <Typography>Write Your Review Below</Typography>
          <Textarea
            onChange={(event) => {
              setReviewContent(event.target.value);
            }}
            autoFocus
            minRows={4}
            maxRows={4}
            style={{ width: "50%", marginTop: "2%" }}
          />
          <Button
            fullWidth
            style={{
              width: "50%",
              background:
                "linear-gradient(90deg, rgba(163,110,41,1) 0%, rgba(224,184,114,1) 100%)",
            }}
            onClick={addReviewHandler}
          >
            Submit Review
          </Button>
        </ModalDialog>
      </Modal>
      <Typography
        style={{
          fontWeight: "bold",
          fontSize: "2rem",
          marginRight: "auto",
        }}
      >
        Customer Reviews
      </Typography>
      <Box
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginTop: "5%",
        }}
      >
        <OverAllRating openModal={openModal} />
        <CustomerLikePills />
        <RatingImages />
      </Box>
      <Divider style={{ width: "100%" }} />
      <ReviewList />
    </Box>
  );
};

export default Reviews;
