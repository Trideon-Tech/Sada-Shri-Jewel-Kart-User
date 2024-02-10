import { Routes, Route, BrowserRouter } from "react-router-dom";
import './App.css';
import LandingPage from "./pages/landingpage/landingpage.component";
import Productpage from "./pages/productpage/productpage.component";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<LandingPage/>}/>
        <Route path="/jwellery/:category" element={<Productpage/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
