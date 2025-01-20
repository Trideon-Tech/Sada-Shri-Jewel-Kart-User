import { Modal, ModalOverflow, ModalDialog } from "@mui/joy";
import { Typography, TextField } from "@mui/material";

import ButtonComponent from "../../components/button/button.component";

export default function ModalAddCustomization({ addCustomizationModalOpen, setAddCustomizationModalOpen }) {
    return (
        <Modal
            open={addCustomizationModalOpen}
            onClose={() => {
                setAddCustomizationModalOpen(false);
            }}
        >
            <ModalOverflow>
                <ModalDialog
                    style={{
                        width: "90vw",
                        maxWidth: "500px",
                        height: "auto",
                        padding: "20px"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            height: "100%",
                            gap: "15px"
                        }}
                    >
                        <Typography
                            style={{
                                textAlign: "center",
                                fontFamily: '"Roboto", sans-serif',
                                fontSize: "1rem",
                                fontWeight: "bold",
                            }}
                        >
                            Add Customization
                        </Typography>

                        <Typography style={{ textAlign: "center", fontSize: "0.9rem" }}>
                            Please set the customization you want to add.
                        </Typography>

                        <label htmlFor="size">
                            <Typography level="body-md" style={{ marginTop: "10px" }}>
                                <b>Size</b>
                            </Typography>
                            <TextField
                                sx={{
                                    width: "100%",
                                    height: "30px",
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
                                }}
                                value={""}
                                placeholder="Size"
                                onChange={(event) => { }}
                            />
                        </label>

                        <label htmlFor="weight" style={{ marginTop: "20px" }}>
                            <Typography >
                                <b>Weight</b>
                            </Typography>
                            <TextField
                                sx={{
                                    width: "100%",
                                    height: "30px",
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
                                }}
                                value={""}
                                placeholder="Weight"
                                onChange={(event) => { }}
                            />
                        </label>

                        <ButtonComponent style={{ marginTop: "30px", width: "100%" }} buttonText="Add Customization" onClick={() => { }} />
                        <Typography style={{ fontFamily: '"Roboto", sans-serif', fontSize: "0.8rem", color: "grey" }}>
                            *Customization is available only for weight and size.
                        </Typography>
                    </div>
                </ModalDialog>
            </ModalOverflow>
        </Modal>
    );
}
