/**
 * Chinese Learning Platform
 * Copyright (C) 2025
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/learn", label: "Learn", icon: "" },
  { to: "/vocabulary", label: "Vocabulary", icon: "" },
  { to: "/pronunciation", label: "Pronunciation", icon: "🔊" },
  { to: "/characters", label: "Characters", icon: "" },
  { to: "/lessons", label: "Lessons", icon: "" },
  { to: "/hsk", label: "HSK Prep", icon: "" },
  { to: "/progress", label: "Progress", icon: "" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-ink-100
          transform transition-transform duration-300 ease-in-out z-50
          md:translate-x-0 md:static md:z-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-chinese-red-50 text-chinese-red-600"
                    : "text-ink-600 hover:bg-ink-50"
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Quick stats */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-ink-100">
          <div className="card bg-gradient-to-r from-chinese-red-500 to-chinese-red-600 text-white">
            <div className="text-sm opacity-90">Daily Streak</div>
            <div className="text-2xl font-bold"> 0 days</div>
          </div>
        </div>
      </aside>
    </>
  );
}
