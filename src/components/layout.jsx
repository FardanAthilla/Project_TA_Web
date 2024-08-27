import React from 'react';
import Sidebar from './sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col p-10 ml-20 sm:ml-64">
        {children}
      </div>
    </div>
  );
};

export default Layout;
