// src/components/dokter/sidebar.jsx
import React, { useState } from "react";
import { ChevronDown, ChevronRight, Menu, Stethoscope, ClipboardList, Calendar, User } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function SidebarDokter({ isCollapsed, setIsCollapsed }) {
  const [openJadwal, setOpenJadwal] = useState(true); 
  const navigate = useNavigate();
  const location = useLocation();

  // Helper untuk mengecek menu aktif
  const isActive = (path) => location.pathname.startsWith(path);

  const jadwalMenu = [
    { 
        label: "Antrean Hari Ini", 
        to: "/dokter/antrean-hari-ini", 
        icon: <Stethoscope size={16} /> 
    }, 
    { 
        label: "History Praktek", 
        to: "/dokter/jadwal", 
        icon: <Calendar size={16} /> 
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div className={`fixed top-0 left-0 h-screen bg-[#ffffff] text-[#4b3f2f] border-r border-gray-200 shadow-[4px_0_15px_rgba(0,0,0,0.1)] p-3 transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} z-50`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {!isCollapsed && <h1 className="text-lg font-bold text-[#b08e4a]">Panel Dokter</h1>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-gray-100 rounded-lg">
          <Menu className="text-[#b08e4a]" />
        </button>
      </div>

      {/*  DASHBOARD UTAMA - ARAH KE LAYOUT DOKTER */}
      <div className="mb-3">
        <Link 
            to="/dokter" 
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-md font-semibold transition-colors ${
                location.pathname === "/dokter" 
                ? 'bg-[#b08e4a] text-white' 
                : 'bg-gray-50 text-gray-600 hover:bg-[#f5e6c8]'
            }`}
        >
          <Stethoscope className={`w-5 h-5 ${
            location.pathname === "/dokter" // 
            ? 'text-white' 
            : 'text-[#b08e4a]'
          }`} />
          {!isCollapsed && "Dashboard"}
        </Link>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-150px)]">

        {/* Group: Manajemen Janji Temu */}
        <div>
          <button 
            onClick={() => setOpenJadwal(!openJadwal)} 
            className="w-full flex items-center justify-between py-2 px-3 hover:bg-[#f5e6c8] rounded-md font-medium transition-colors text-gray-700"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#b08e4a]" />
              {!isCollapsed && "Jadwal Praktek"}
            </div>
            {!isCollapsed && (openJadwal ? <ChevronDown size={18} /> : <ChevronRight size={18} />)}
          </button>

          {/* Submenu Janji Temu */}
          {!isCollapsed && openJadwal && (
            <ul className="pl-4 mt-2 space-y-1 text-sm">
              {jadwalMenu.map((item, i) => (
                <li key={i}>
                  <Link 
                    to={item.to} 
                    className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
                        isActive(item.to) 
                        ? 'bg-[#f5e6c8] text-[#7A6A42] font-semibold' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-[#b08e4a]">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Link: Cari Pasien */}
        <div className="mt-2">
          <Link 
            to="/dokter/data-pasien" 
            className={`w-full flex items-center justify-between py-2 px-3 rounded-md font-medium transition-colors ${
            location.pathname === "/dokter/data-pasien" ? 'bg-[#f5e6c8]' : 'hover:bg-[#f5e6c8]'
            }`}
          >
            <div className="flex items-center gap-2 text-gray-700">
              <ClipboardList size={18} className="text-[#b08e4a]" />
              {!isCollapsed && "Cari Data Pasien"}
            </div>
          </Link>
        </div>

         {/* Link: Profile */}
         <div className="mt-1">
          <Link 
            to="/dokter/profile" 
            className={`w-full flex items-center justify-between py-2 px-3 rounded-md font-medium transition-colors ${
                isActive('/dokter/profile') ? 'bg-[#f5e6c8]' : 'hover:bg-[#f5e6c8]'
            }`}
          >
            <div className="flex items-center gap-2 text-gray-700">
              <User size={18} className="text-[#b08e4a]" />
              {!isCollapsed && "Profil Saya"}
            </div>
          </Link>
        </div>

      </div>

      {/* Logout */}
      <div className="absolute bottom-4 left-3 right-3">
        <button onClick={handleLogout} className="w-full bg-[#b08e4a] text-white py-2 rounded-md font-semibold hover:bg-[#a37d3c] transition-colors shadow-sm flex items-center justify-center gap-2">
          {!isCollapsed ? "Logout" : "🚪"}
        </button>
      </div>
    </div>
  );
}