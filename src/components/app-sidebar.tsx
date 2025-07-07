import { Headset, LayoutDashboard, BetweenHorizontalStart, User, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="bg-gray-200 flex-shrink-0">
      <aside className="flex flex-col h-screen w-16 md:w-56 bg-white rounded-2xl m-5 text-black transition-all duration-300 flex-shrink-0">
        <div className="px-2 pt-4">
          <img src="logo.png" width={130} alt="" />
        </div>
        <div className="flex flex-col items-center md:items-start mt-4 space-y-6 w-full">
          <a
            href="#"
            className="flex items-center w-full px-4 py-2 hover:bg-[#13244f] hover:text-white rounded transition"
          >
            <LayoutDashboard size={16} />
            <span className="ml-4 hidden md:inline">Overview</span>
          </a>
          <a
            href="#"
            className="flex items-center w-full px-4 py-2 hover:bg-[#13244f] hover:text-white rounded transition"
          >
            <BetweenHorizontalStart size={16} />
            <span className="ml-4 hidden md:inline">Quick Actions</span>
          </a>
          <a
            href="#"
            className="flex items-center w-full px-4 py-2 hover:bg-[#13244f] hover:text-white rounded transition"
          >
            <User size={16} />
            <span className="ml-4 hidden md:inline">User Profile</span>
          </a>
          <a
            href="#"
            className="flex items-center w-full px-4 py-2 hover:bg-[#13244f] hover:text-white rounded transition"
          >
            <Settings size={16} />
            <span className="ml-4 hidden md:inline">Settings</span>
          </a>
          <a
            href="/helpline"
            className="flex items-center w-full px-4 py-2 hover:bg-[#13244f] hover:text-white rounded transition mt-auto"
          >
            <Headset size={16} />
            <span className="ml-4 hidden md:inline">Helpline</span>
          </a>
        </div>
      </aside>
    </div>
  );
}
