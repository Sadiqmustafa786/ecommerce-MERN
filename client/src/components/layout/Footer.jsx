import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link to="/" className="site-footer-logo">
            <img src={logo} alt="E-Shop" className="h-12 w-12 object-contain" />
            E-Shop
          </Link>
          <p>Simple shopping, thoughtful delivery, and products worth bringing home.</p>
        </div>

        <div className="site-footer-column">
          <h2>Explore</h2>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/#categories">Categories</Link>
        </div>

        <div className="site-footer-column">
          <h2>Account</h2>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">Orders</Link>
        </div>

        <div className="site-footer-column site-footer-contact">
          <h2>Need help?</h2>
          <p>We are here to help with your next order.</p>
          <a href="mailto:support@shophub.com">support@shophub.com</a>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} ShopHub</span>
        <span>Made for better everyday shopping</span>
      </div>
    </footer>
  );
};

export default Footer;