// src/components/Common/Header.jsx
import React from 'react';
import { Bell, Search } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-search">
        <Search size={18} />
        <input type="text" placeholder="Search applications..." />
      </div>
      <div className="header-actions">
        <button className="icon-button">
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;