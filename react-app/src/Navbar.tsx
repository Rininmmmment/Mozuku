import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faGear } from '@fortawesome/free-solid-svg-icons';
import './styles/navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul className="navbar">
        <li className="navbar"><FontAwesomeIcon icon={faUser} style={{color: "#ffffff",}} /></li>
        <li className="navbar"><FontAwesomeIcon icon={faGear} style={{color: "#ffffff",}} /></li>
      </ul>
    </nav>
  );
};

export default Navbar;
