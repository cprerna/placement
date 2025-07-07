'use client';

import { useState } from 'react';
import { UserCircle, LogOut, HelpCircle, ChevronDown } from 'lucide-react';
import { UserButton } from '@stackframe/stack';

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
        <UserButton />
      </div>
    </div>
  );
}
