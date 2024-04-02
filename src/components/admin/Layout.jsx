import React from 'react';
import Sidebar from './AdminSidebar';

const Layout = ({ children }) => {
  return (
    <div style={{ backgroundColor: "white", width: "100%" }}>
        <Sidebar />
        <main>
            { children }
        </main>
    </div>
  )
}

export default Layout;