import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Zora Liu's Portfolio</p>
    </footer>
  );
};

export default Footer;
