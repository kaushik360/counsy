import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, className = '', fullHeight = false }) => {
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-black flex justify-center w-full`}>
      <div className={`w-full max-w-md bg-white dark:bg-gray-900 min-h-screen shadow-2xl relative flex flex-col transition-colors duration-200 ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;