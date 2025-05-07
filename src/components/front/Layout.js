import React, { useState } from 'react';
import Sidebar from '../NavbarandSidebar/Sidebar';

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(prev => !prev);

  return (
    <div>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <main
        style={{
          marginLeft: isOpen ? '230px' : '0',
          transition: 'margin-left 0.3s ease',
          padding: '70px 20px 20px',
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
