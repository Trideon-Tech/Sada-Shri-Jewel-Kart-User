import { Dialog, Fab } from "@mui/material";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";

import { Help } from "@mui/icons-material";
import SearchResult from "./components/navbar/searchResult.component";
import Address from "./pages/address/address.component";
import Cart from "./pages/cart/cart.component";
import Checkout from "./pages/checkout/checkout.component";
import ContactUs from "./pages/contactus/contactus.component";
import EditProfile from "./pages/editProfile/editProfile.component";
import LandingPage from "./pages/landingpage/landingpage.component";
import MyAccount from "./pages/myAccount/myAccount.component";
import OrderDetails from "./pages/order-details/orderDetails.component";
import OrderConfirmation from "./pages/orderConfirmation/orderConfirmation.component";
import Orders from "./pages/orders/orders.component";
import ProductDetail from "./pages/productdetail/productdetail.component";
import Productpage from "./pages/productpage/productpage.component";
import Register from "./pages/signup/register.component";
import TrackOrder from "./pages/track-order/trackOrder.component";
import UserDetailsForm from "./pages/UserDetailsForm/userDetailsForm.component";
import Wallet from "./pages/wallet/wallet.component";
import Wishlist from "./pages/wishlist/wishList.component";
import { RefreshProvider } from "./RefreshContent";

function App() {
  const [showIframe, setShowIframe] = useState(false);

  const playClickSound = () => {
    const audio = new Audio(process.env.PUBLIC_URL + "/assets/click.mp3");
    audio.play();
  };

  // Add click sound to entire app
  useEffect(() => {
    document.addEventListener("click", playClickSound);
    return () => document.removeEventListener("click", playClickSound);
  }, []);

  return (
    <div className="App">
      <Dialog
        open={showIframe}
        onClose={() => setShowIframe(false)}
        maxWidth="md"
        fullWidth
      >
        <iframe
          title="Ticket Form"
          width="600"
          height="850"
          src="https://crm.sadashrijewelkart.com/forms/ticket"
          frameBorder="0"
          allowFullScreen
          style={{
            width: "100%",
            height: "850px",
            border: "none",
          }}
        />
      </Dialog>

      <RefreshProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<LandingPage />} />
            <Route
              path="/jwellery/:category/:menuItemId/:isSubCategory"
              element={<Productpage />}
            />
            <Route path="/jwellery/search" element={<Productpage />} />
            {/* <Route path="/jwellery/search" element={<SearchProductpage />} /> */}
            <Route
              path="/item/:category/:product"
              element={<ProductDetail />}
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/order-details" element={<OrderDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/signin" element={<Register />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/user-details" element={<UserDetailsForm />} />
            <Route path="/my-account" element={<MyAccount />}>
              <Route path="orders" index element={<Orders />} />
              <Route path="wallet" index element={<Wallet />} />
              <Route path="address" element={<Address />} />
              <Route path="" element={<EditProfile />} />
            </Route>
            <Route path="/search-result" element={<SearchResult />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
          <Fab
            aria-label="support"
            style={{
              position: "fixed",
              bottom: 16,
              right: 16,
              backgroundColor: "#a36e29",
              color: "#fff2e0",
            }}
            onClick={() => setShowIframe(true)}
          >
            <Help />
          </Fab>
        </BrowserRouter>
      </RefreshProvider>
    </div>
  );
}

export default App;
