import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {

  let history = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    history("/login");
  }
  return (
    <>
      {/* Toggle Button Outside of Sidebar */}
      {!isOpen && (
        <div
          style={{
            position: 'fixed',
            top: '74px',
            left: '12px',
            zIndex: '1050',
          }}
        >
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
            style={{
              backgroundColor: '#343a40',
              border: '1px solid white',
              padding: '7px 12px',
              borderRadius: '4px',
              margin: "2px"
            }}
          >
            {/* Custom Hamburger Icon (3 lines) */}
            <div style={{ width: '22px', height: '2px', backgroundColor: 'white', margin: '4px 0' }}></div>
            <div style={{ width: '22px', height: '2px', backgroundColor: 'white', margin: '4px 0' }}></div>
            <div style={{ width: '22px', height: '2px', backgroundColor: 'white', margin: '4px 0' }}></div>
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div
        style={{
          width: isOpen ? '230px' : '0',
          height: '91vh',
          position: 'fixed',
          top: '65px',
          left: '0',
          backgroundColor: '#343a40',
          zIndex: '1040',
          overflowX: 'hidden',
          overflowY: 'auto',
          transition: 'width 0.3s ease',
          borderRight: isOpen ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          borderRadius: isOpen ? '0 5px 5px 0' : '0',
          boxShadow: isOpen ? '0 0 10px rgba(0, 0, 0, 0.5)' : 'none',
        }}
      >
        {isOpen && (
          <div className="p-3">
            <button
              className="btn btn-sm btn-outline-light mb-3"
              style={{ float: 'right' }}
              onClick={toggleSidebar}
            >
              <i className="fas fa-times no-hover"></i>
            </button>

            <ul className="nav-tabs list-group list-group-flush mt-4">


              {!localStorage.getItem('token') ? (
                <>

                  <li className="list-group-item bg-dark mt-5 nav-item">
                    <Link className="text-white text-decoration-none nav-link" to="/">
                      <i className="fa fa-home"></i> Home
                    </Link>
                  </li>

                  <li className="list-group-item bg-dark mt-5 nav-item">
                    <Link className="text-white text-decoration-none nav-link" to="/about">
                      <i className="fas fa-info-circle"></i> About
                    </Link>
                  </li>

                  <li className="list-group-item bg-dark mt-5 nav-item">
                    <Link className="text-white text-decoration-none nav-link" to="/auth">
                      <i className="fa fa-sign-in"></i>  AuthPage
                    </Link>
                  </li>

                  <li className="list-group-item bg-dark mt-5 nav-item">
                    <Link className="text-white text-decoration-none nav-link" to="/contact">
                      <i className="fas fa-phone"></i> Contact
                    </Link>
                  </li>
                </>
              ) : (
                
                <>
                <li className="list-group-item bg-dark mt-5 nav-item">
                    <Link className="text-white text-decoration-none nav-link" to="/">
                      <i className="fa fa-home"></i> Home
                    </Link>
                  </li>
                  <li className="list-group-item bg-dark mt-5 nav-item">
                    <Link className="text-white text-decoration-none nav-link" to="/about">
                      <i className="fas fa-info-circle"></i> About
                    </Link>
                  </li>
                <li className="list-group-item bg-dark mt-5 nav-item">
                <Link className="text-white text-decoration-none nav-link" to="/match">
                  <i className="fas fa-users"></i> Matching
                </Link>
              </li>
              
              <li className="list-group-item bg-dark mt-5 nav-item">
                    <Link className="text-white text-decoration-none nav-link" to="/commit">
                      <i className="fa fa-edit"></i> File Editor
                    </Link>
                  </li>
                <li onClick={handleLogout} className="list-group-item bg-dark mt-5 nav-item">
                  <Link className="text-white text-decoration-none nav-link" to="/commit">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </Link>
                </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
