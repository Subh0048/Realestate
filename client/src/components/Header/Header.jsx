import React, { useEffect, useState } from "react";
import "./Header.css";
import { BiMenuAltRight } from "react-icons/bi";
import { getMenuStyles } from "../../utils/common";
import useHeaderColor from "../../hooks/useHeaderColor";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import ProfileMenu from "../ProfileMenu/ProfileMenu";
import AddPropertyModal from "../AddPropertyModal/AddPropertyModal";
import useAuthCheck from "../../hooks/useAuthCheck.jsx";
import { toast } from "react-toastify";

const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const headerColor = useHeaderColor();
  const [modalOpened, setModalOpened] = useState(false);
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const { validateLogin } = useAuthCheck();
  const navigate =useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem("user");
  //   console.log("Token from localStorage:", token);
  //   if (token) {
  //     setisAuthenticated(true);
  //   }
  //   if (token == null) {
  //     setisAuthenticated(false);
  //   } else {
  //     setisAuthenticated(false);
  //   }
  // }, []);
  useEffect(() => {
    const token = localStorage.getItem("user");
    console.log("Token from localStorage:", token); // Debugging
    if (token && token !== "null" && token !== "undefined") {
      setisAuthenticated(true);
    } else {
      setisAuthenticated(false);
    }
  }, []);

  console.log("isauthenticated", isAuthenticated);

  const logout = () => {
    localStorage.removeItem("user");
    navigate('/')
  };

  const handleAddPropertyClick = () => {
    if (isAuthenticated) {
      setModalOpened(true);
    }
    else{
      toast.error("plase login ");
    }
  };
  return (
    <section className="h-wrapper" style={{ background: headerColor }}>
      <div className="flexCenter innerWidth paddings h-container">
        {/* logo */}
        <Link to="/">
          <img src="./logo.png" alt="logo" width={100} />
        </Link>

        {/* menu */}
        <OutsideClickHandler
          onOutsideClick={() => {
            setMenuOpened(false);
          }}
        >
          <div
            // ref={menuRef}
            className="flexCenter h-menu"
            style={getMenuStyles(menuOpened)}
          >
            <NavLink to="/properties">Properties</NavLink>

            <a href="mailto:subhamkumarsahu99@gmail.com">Contact</a>

            {/* add property */}
            <div onClick={handleAddPropertyClick}>Add Property</div>
            <AddPropertyModal opened={modalOpened} setOpened={setModalOpened} />
            {/* login button */}
            {!isAuthenticated ? (
              <button className="button">
                <NavLink to="/signup">Login</NavLink>
              </button>
            ) : (
              <ProfileMenu logout={logout} />
            )}
          </div>
        </OutsideClickHandler>

        {/* for medium and small screens */}
        <div
          className="menu-icon"
          onClick={() => setMenuOpened((prev) => !prev)}
        >
          <BiMenuAltRight size={30} />
        </div>
      </div>
    </section>
  );
};

export default Header;
