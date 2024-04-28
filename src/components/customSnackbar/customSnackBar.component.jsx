import * as React from "react";
import Snackbar from "@mui/joy/Snackbar";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

export default function CustomSnackbar({ content, isOpen, closeHandler }) {
  const [open, setOpen] = React.useState(isOpen);

  const handleClose = () => {
    console.log("closing");
    setOpen(false);
    closeHandler(false);
  };
  console.log(open);
  return (
    <React.Fragment>
      <Snackbar
        autoHideDuration={5000}
        variant="solid"
        color="primary"
        size="lg"
        invertedColors
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={(theme) => ({
          background: `linear-gradient(45deg, ${theme.palette.primary[600]} 30%, ${theme.palette.primary[500]} 90%})`,
          maxWidth: 360,
        })}
      >
        {content}
      </Snackbar>
    </React.Fragment>
  );
}
