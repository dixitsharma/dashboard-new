import React from 'react';
import './Loader.css';

const Loader = ({ size, background }) => {
  const loaderStyle = {
    width: '100vw', // Use size prop to set width
    height: '100vh', // Use size prop to set height
    background: background, // Use background prop to set background
    position: 'absolute',
    zIndex:999
  };

  return (
    <div  style={loaderStyle}>
       <div className="loader"></div>
    </div>
  );
};

export default Loader;