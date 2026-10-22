import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import StoryPage from "./pages/StoryPage";
import CheckoutPage from "./pages/CheckoutPage";
import CartDrawer from "./components/CartDrawer";
import "./App.css";

function App() {
  return (
    <CartProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<StoryPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
        <CartDrawer />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
