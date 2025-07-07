'use client';

import { useState } from 'react';
import { UserCircle, LogOut, HelpCircle, ChevronDown } from 'lucide-react';

export default function Topbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div className="bg-gray-200 flex-shrink-0">
      <div className="flex justify-between items-start bg-white m-3 px-8 py-5 my-5 rounded-2xl min-w-0">
        {/* Left side: Info card */}
        <div className="bg-white rounded-2xl flex-1 min-w-0">
          <h1 className="text-2xl font-semibold">Barclay's Center of Hope: Placement Data</h1>
          <p className="py-2">View all student placement records in one place.</p>
        </div>

        {/* Right side: User Authentication */}
        <div className="relative flex-shrink-0">
          <button
            onClick={handleToggle}
            className="flex items-center px-4 py-2 transition  border rounded-xl cursor-pointer"
          >
            <UserCircle className="w-5 h-5 mr-2" />
            <span>User</span>

            <ChevronDown className="w-5 h-5 ml-2" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-md z-10">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </button>
              <a href="/helpline">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Helpline
                </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
