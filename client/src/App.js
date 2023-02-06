import Home from "./components/Home";
import AddProduct from "./components/AddProduct";
import BidProduct from "./components/BidProduct";
import Products from "./components/Products";
import Nav from "./components/Nav";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import socketIO from "socket.io-client";
const socket = socketIO.connect("http://localhost:4000");

function App() {
  return (
    <Router>
      <div>
        <Nav socket={socket} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/products/add"
            element={<AddProduct socket={socket} />}
          />
          <Route
            path="/products/bid/:name/:price"
            element={<BidProduct socket={socket} />}
          />
          <Route
            path="/products"
            element={<Products />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
