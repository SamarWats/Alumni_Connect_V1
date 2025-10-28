import React from "react";
import { Home, Users, Calendar, MessageSquare, User } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white h-screen shadow-md flex flex-col p-6 fixed left-0 top-0">
      {/* Profile */}
      <div className="flex items-center space-x-3 mb-8">
        <img
          src="https://randomuser.me/api/portraits/women/79.jpg"
          alt="profile"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="font-semibold text-gray-800">Sarah Chen</h3>
          <p className="text-sm text-gray-500">Alumni</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col space-y-2">
        <a
          href="#"
          className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 text-blue-600 font-medium"
        >
          <Home size={18} /> <span>Dashboard</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
        >
          <Users size={18} /> <span>Mentorship</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
        >
          <Calendar size={18} /> <span>Events</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
        >
          <MessageSquare size={18} /> <span>Messages</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
        >
          <User size={18} /> <span>Profile</span>
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
