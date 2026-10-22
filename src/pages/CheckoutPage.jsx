import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          <span>Return to Story</span>
        </button>
        <div className="checkout-brand">Ocean Rare</div>
      </header>

      <main className="checkout-main">
        <div className="checkout-form-section">
          <h1>Checkout (Development Mode)</h1>
          <p className="checkout-notice">
            This is a development-mode checkout interface. No real orders are placed and no real payments are simulated. 
            Backend, inventory, shipping, and payment-provider integration remains necessary for production.
          </p>

          <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
            <section className="form-group">
              <h2>Contact Information</h2>
              <input type="email" placeholder="Email address" className="form-input" disabled />
            </section>

            <section className="form-group">
              <h2>Shipping Address</h2>
              <div className="form-row">
                <input type="text" placeholder="First name" className="form-input" disabled />
                <input type="text" placeholder="Last name" className="form-input" disabled />
              </div>
              <input type="text" placeholder="Address" className="form-input" disabled />
              <div className="form-row">
                <input type="text" placeholder="City" className="form-input" disabled />
                <input type="text" placeholder="Postal code" className="form-input" disabled />
              </div>
            </section>

            <section className="form-group">
              <h2>Payment</h2>
              <div className="payment-placeholder">
                <ShieldCheck size={24} />
                <span>Payment integration required</span>
              </div>
            </section>

            <button className="checkout-submit-btn" disabled>
              Place Order (Integration Required)
            </button>
          </form>
        </div>

        <aside className="checkout-summary-section">
          <div className="summary-card">
            <h2>Order Summary ({cartCount} items)</h2>
            <ul className="summary-items">
              {cart.map(item => (
                <li key={item.id} className="summary-item">
                  <div className="summary-item-img">
                    <img src={item.image} alt={item.name} />
                    <span className="summary-item-qty">{item.quantity}</span>
                  </div>
                  <div className="summary-item-details">
                    <span className="summary-item-name">{item.name}</span>
                    <span className="summary-item-meta">{item.weight}</span>
                  </div>
                  <span className="summary-item-price">{item.price}</span>
                </li>
              ))}
            </ul>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="summary-trust">
              <div className="trust-item">
                <Truck size={18} />
                <span>Temperature-controlled delivery</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
