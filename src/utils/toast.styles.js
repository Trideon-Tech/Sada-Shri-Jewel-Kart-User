export const generalToastStyle = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
  progressStyle: {
    background: "#a36e29",
  },
  icon: () => (
    <img
      alt="logo-short"
      src={process.env.PUBLIC_URL + "/assets/fav.png"}
      width="20"
    />
  ),
  style: {
    fontFamily: '"Work Sans", sans-serif',
    fontSize: "0.9rem",
    fontWeight: 600,
  },
};
