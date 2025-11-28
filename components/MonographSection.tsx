
import React from 'react';

interface MonographSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const MonographSection: React.FC<MonographSectionProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 transition-transform transform hover:scale-[1.02] hover:shadow-xl">
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-4">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
      </div>
      <div className="text-gray-600 space-y-2 prose max-w-none">
        {children}
      </div>
    </div>
  );
};

export default MonographSection;
