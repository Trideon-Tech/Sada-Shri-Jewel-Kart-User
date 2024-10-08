import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Address from "./pages/address/address.component";
import Cart from "./pages/cart/cart.component";
import Checkout from "./pages/checkout/checkout.component";
import EditProfile from "./pages/editProfile/editProfile.component";
import LandingPage from "./pages/landingpage/landingpage.component";
import MyAccount from "./pages/myAccount/myAccount.component";
import OrderDetails from "./pages/order-details/orderDetails.component";
import OrderConfirmation from "./pages/orderConfirmation/orderConfirmation.component";
import Orders from "./pages/orders/orders.component";
import ProductDetail from "./pages/productdetail/productdetail.component";
import Productpage from "./pages/productpage/productpage.component";
import SearchProductpage from "./pages/searchProductPage/searchProductPage.component";
import Register from "./pages/signup/register.component";
import TrackOrder from "./pages/track-order/trackOrder.component";
import UserDetailsForm from "./pages/UserDetailsForm/userDetailsForm.component";
import Wallet from "./pages/wallet/wallet.component";
import Wishlist from "./pages/wishlist/wishList.component";
import { RefreshProvider } from "./RefreshContent";

function App() {
  return (
    <div className="App">
      <RefreshProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<LandingPage />} />
            <Route
              path="/jwellery/:category/:menuItemId/:isSubCategory"
              element={<Productpage />}
            />
            <Route path="/jwellery/search" element={<SearchProductpage />} />
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
          </Routes>
        </BrowserRouter>
      </RefreshProvider>
    </div>
  );
}

export default App;
