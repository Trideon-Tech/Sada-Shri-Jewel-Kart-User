import { BrowserRouter, Route, Routes, Outlet, Link } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/landingpage/landingpage.component";
import ProductDetail from "./pages/productdetail/productdetail.component";
import Productpage from "./pages/productpage/productpage.component";
import Cart from "./pages/cart/cart.component";
import MyOrders from "./pages/my-orders/myOrders.component";
import TrackOrder from "./pages/track-order/trackOrder.component";
import OrderDetails from "./pages/order-details/orderDetails.component";
import Checkout from "./pages/checkout/checkout.component";
import Wishlist from "./pages/wishlist/wishList.component";
import MyAccount from "./pages/myAccount/myAccount.component";
import Register from "./pages/signup/register.component";
import SignIn from "./pages/signin/signin.component";
import UserDetailsForm from "./pages/UserDetailsForm/userDetailsForm.component";
import Orders from "./pages/orders/orders.component";
import Address from "./pages/address/address.component";
import EditProfile from "./pages/editProfile/editProfile.component";
import SearchProductpage from "./pages/searchProductPage/searchProductPage.component";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/jwellery/:category" element={<Productpage />} />
          <Route path="/jwellery/search" element={<SearchProductpage />} />
          <Route path="/item/:category/:product" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/order-details" element={<OrderDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/user-details" element={<UserDetailsForm />} />
          <Route path="/my-account" element={<MyAccount />}>
            <Route path="orders" index element={<Orders />} />
            <Route path="address" element={<Address />} />
            <Route path="" element={<EditProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
