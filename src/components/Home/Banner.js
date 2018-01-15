import React from 'react';

const Banner = ({ appName, token }) => {
  if (token) {
    return null;
  }
  return (
    <div className="banner">
      <div className="container">
        <p>A place to create your table.</p>
      </div>
    </div>
  );
};

export default Banner;
