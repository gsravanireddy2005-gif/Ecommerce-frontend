import React from "react";
import { Link } from "react-router-dom";

function Sidebar(){

  return(

    <div className="sidebar">

      <h3>Dashboard</h3>

      <Link to="/">Products</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>

    </div>

  )

}

export default Sidebar;