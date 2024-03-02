import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/landingpage/landingpage.component";
import ProductDetail from "./pages/productdetail/productdetail.component";
import Productpage from "./pages/productpage/productpage.component";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/jwellery/:category" element={<Productpage />} />
          <Route path="/item/:category/:product" element={<ProductDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
