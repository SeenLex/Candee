import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import SearchBar from "../components/controls/searchbar/searchBar";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "../hooks/useAuth";
import Dropdown from "../components/dropdown/dropdown";
import useFavourite from "../hooks/useFavourite";
import useCart from "../hooks/useCart";

const Navbar = () => {
  const { token, user } = useAuth();
  // const { favourites } = useFavourite(token as string);
  // const { cart } = useCart(token as string);

  return (
    <div className="navbar">
      <nav>
        <ul>
          <li>
            <NavLink to="/" className="nav-link">
              <img className="logo" src="src/assets/CANDEELogo.png" alt="logo" />
            </NavLink>
          </li>
          <li className="search-bar-container">
            <SearchBar />
          </li>
          <div className="icons">
          <li className="nav-icons">
            <NavLink
              className="nav-link"
              to={user?.role === 'admin' ? '/admin-dashboard' : token ? `/user-dashboard/${user?.id}` : "/login" }
            >
              <AccountCircleIcon />
              <span className="nav-text">Account</span>
            </NavLink>
          </li>
          { user?.role === "customer" &&
          <li className="nav-icons">
           
            <NavLink className="nav-link" to="/favorites">
              <FavoriteBorderIcon />
              <span className="nav-text">Favourites</span>
              {/* {favourites && favourites.length > 0 && (
                <span className="favourites-count">({favourites.length})</span>
              )} */}
            </NavLink>
            
          </li>
          }
          { user?.role === "customer" &&
          <li className="nav-icons">
            { user?.role === "customer" &&
            <NavLink  className="nav-link" to="/cart">
              <ShoppingCartIcon />
              <span className="nav-text">Cart</span>
              {/* {cart.products && cart.products.length > 0 && (
                <span className="favourites-count">({cart.products.length})</span>
              )} */}
            </NavLink>
          }
          </li>
          }
          </div>
        </ul>
      </nav>
      <div className="bottom-navbar">
        <Dropdown />
      </div>
    </div>
  );
};

export default Navbar;
