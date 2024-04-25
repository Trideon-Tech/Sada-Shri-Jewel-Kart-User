import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import Profile from "./pages/profile/profile.component";
import Register from "./pages/signup/register.component"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/jwellery/:category" element={<Productpage />} />
          <Route path="/item/:category/:product" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/order-details" element={<OrderDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;