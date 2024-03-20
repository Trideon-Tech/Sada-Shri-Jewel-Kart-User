import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/landingpage/landingpage.component";
import ProductDetail from "./pages/productdetail/productdetail.component";
import Productpage from "./pages/productpage/productpage.component";
import Login from "./pages/login/login.component";
import Register from "./pages/signup/register.component";
import Cart from "./pages/cart/cart.component";
import Checkout from "./pages/cart/checkout/checkout.component";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/jwellery/:category" element={<Productpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/item/:category/:product" element={<ProductDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
