
import React from 'react';

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-2.5-4-2.5-6C13.5 2 12.5 1 12 1s-1.5 1-1.5 2.5c0 2-1 4-2.5 6S5 13 5 15a7 7 0 0 0 7 7Z" />
    <path d="M12 15a3 3 0 0 0 3-3c0-1-1.5-3-3-3s-3 2-3 3a3 3 0 0 0 3 3Z" />
  </svg>
);

export default Logo;
