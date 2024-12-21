export default function ButtonComponent({buttonText, onClick, style}) {
    return (
        <div
            style={{
                marginTop: "10px",
                fontFamily: '"Roboto", sans-serif',
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
                background: "linear-gradient(to right, #d4a76a, #a36e29)",
                marginRight: "8vh",
                paddingTop: "8px",
                paddingBottom: "8px",
                borderRadius: "10px",
                textAlign: "center",
                ...style
            }}
            onClick={() => onClick()}
        >
            {buttonText}
        </div>
    );
}
