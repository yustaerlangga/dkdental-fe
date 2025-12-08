import { useState } from "react";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function SidebarPerawat({ isCollapsed, setIsCollapsed }) {
  const [openPasien, setOpenPasien] = useState(false);
  const [openJanjiTemu, setOpenJanjiTemu] = useState(false);
  const [openRekamMedis, setOpenRekamMedis] = useState(false);
  const navigate = useNavigate();

  // === ICONS (SVG) ===
  const userAddIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-4 h-4 fill-[#b08e4a]">
      <path d="M352 173.3L352 384C352 401.7 337.7 416 320 416C302.3 416 288 401.7 288 384L288 173.3L246.6 214.7C234.1 227.2 213.8 227.2 201.3 214.7C188.8 202.2 188.8 181.9 201.3 169.4L297.3 73.4C309.8 60.9 330.1 60.9 342.6 73.4L438.6 169.4C451.1 181.9 451.1 202.2 438.6 214.7C426.1 227.2 405.8 227.2 393.3 214.7L352 173.3zM320 464C364.2 464 400 428.2 400 384L480 384C515.3 384 544 412.7 544 448L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 448C96 412.7 124.7 384 160 384L240 384C240 428.2 275.8 464 320 464zM464 488C477.3 488 488 477.3 488 464C488 450.7 477.3 440 464 440C450.7 440 440 450.7 440 464C440 477.3 450.7 488 464 488z"/>
    </svg>
  );

  const userListIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-4 h-4 fill-[#b08e4a]">
      <path d="M544 269.8C529.2 279.6 512.2 287.5 494.5 293.8C447.5 310.6 385.8 320 320 320C254.2 320 192.4 310.5 145.5 293.8C127.9 287.5 110.8 279.6 96 269.8L96 352C96 396.2 196.3 432 320 432C443.7 432 544 396.2 544 352L544 269.8zM544 192L544 144C544 99.8 443.7 64 320 64C196.3 64 96 99.8 96 144L96 192C96 236.2 196.3 272 320 272C443.7 272 544 236.2 544 192zM494.5 453.8C447.6 470.5 385.9 480 320 480C254.1 480 192.4 470.5 145.5 453.8C127.9 447.5 110.8 439.6 96 429.8L96 496C96 540.2 196.3 576 320 576C443.7 576 544 540.2 544 496L544 429.8C529.2 439.6 512.2 447.5 494.5 453.8z"/>
    </svg>
  );

  const calendarIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-4 h-4 fill-[#b08e4a]">
      <path d="M152 64H488C521.3 64 552 94.75 552 128V192H88V128C88 94.75 118.7 64 152 64zM552 288V512C552 545.3 521.3 576 488 576H152C118.7 576 88 545.3 88 512V288H552zM152 24C121.1 24 96 49.07 96 80V128H144V80C144 71.16 151.2 64 160 64C168.8 64 176 71.16 176 80V128H464V80C464 71.16 471.2 64 480 64C488.8 64 496 71.16 496 80V128H544V80C544 49.07 518.9 24 488 24H152z"/>
    </svg>
  );

  const clockIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-4 h-4 fill-[#b08e4a]">
      <path d="M232 120C232 106.7 242.7 96 256 96C269.3 96 280 106.7 280 120V243.2L365.3 300C376.3 307.4 379.3 322.3 371.1 333.3C364.6 344.3 349.7 347.3 338.7 339.1L242.7 275.1C236 271.5 232 264 232 255.1L232 120zM256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0zM48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48C141.1 48 48 141.1 48 256z"/>
    </svg>
  );

  // === MENU ITEMS ===
  const pasienMenu = [
    { icon: userAddIcon, label: "Pendaftaran Pasien Baru", to: "/formPasien" },
    { icon: userListIcon, label: "Data Pasien", to: "/dataPasien" },
  ];

  const janjiTemuMenu = [
    { icon: calendarIcon, label: "Buat Janji Temu", to: "/formJanji" },
    { icon: clockIcon, label: "Jadwal Janji Temu", to: "/dataJanji" },
  ];

  const rekamMedisMenu = [
    {icon: userListIcon, label: "Data Rekam Medis", to: "/dataRekamMedis"},
    {icon: userListIcon, label: "Data Detail Rekam Medis", to: "/dataDetailRM"}
  ]

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <div className={`fixed top-0 left-0 h-screen bg-[#ffffff] text-[#4b3f2f] border-r border-gray-200 shadow-[4px_0_15px_rgba(0,0,0,0.1)] p-3 transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} z-50`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {!isCollapsed && <h1 className="text-lg font-bold text-[#b08e4a]">Panel Perawat</h1>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-gray-100 rounded-lg">
          <Menu className="text-[#b08e4a]" />
        </button>
      </div>

      {/* Dashboard */}
      <div className="mb-3">
        <Link to="/perawat" className="w-full flex items-center justify-center gap-2 bg-[#b08e4a] text-white py-2 rounded-md font-semibold hover:bg-[#a37d3c] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-6 h-6 fill-white">
            <path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z"/>
          </svg>
          {!isCollapsed && "Dashboard"}
        </Link>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-150px)]">

        {/* Menu Pasien */}
        <div>
          <button onClick={() => setOpenPasien(!openPasien)} className="w-full flex items-center justify-between py-2 px-3 hover:bg-[#f5e6c8] rounded-md font-medium transition-colors">
            <div className="flex items-center gap-2">
              <span>👨‍👩‍👧‍👦</span>
              {!isCollapsed && "Manajemen Pasien"}
            </div>
            {!isCollapsed && (openPasien ? <ChevronDown size={18} /> : <ChevronRight size={18} />)}
          </button>

          {!isCollapsed && openPasien && (
            <ul className="pl-6 mt-2 space-y-1 text-sm">
              {pasienMenu.map((item, i) => (
                <li key={i}>
                  <Link to={item.to} className="flex items-center gap-2 hover:bg-[#f5e6c8] p-2 rounded-md transition-colors text-gray-700">
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Menu Janji Temu */}
        <div>
          <button onClick={() => setOpenJanjiTemu(!openJanjiTemu)} className="w-full flex items-center justify-between py-2 px-3 hover:bg-[#f5e6c8] rounded-md font-medium transition-colors">
            <div className="flex items-center gap-2">
              <span>📅</span>
              {!isCollapsed && "Janji Temu"}
            </div>
            {!isCollapsed && (openJanjiTemu ? <ChevronDown size={18} /> : <ChevronRight size={18} />)}
          </button>

          {!isCollapsed && openJanjiTemu && (
            <ul className="pl-6 mt-2 space-y-1 text-sm">
              {janjiTemuMenu.map((item, i) => (
                <li key={i}>
                  <Link to={item.to} className="flex items-center gap-2 hover:bg-[#f5e6c8] p-2 rounded-md transition-colors text-gray-700">
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Menu Rekam Medis */}
        <div>
          <button onClick={() => setOpenRekamMedis(!openRekamMedis)} className="w-full flex items-center justify-between py-2 px-3 hover:bg-[#f5e6c8] rounded-md font-medium transition-colors">
            <div className="flex items-center gap-2">
              <span>📋</span>
              {!isCollapsed && "Rekam Medis"}
            </div>
            {!isCollapsed && (openRekamMedis ? <ChevronDown size={18} /> : <ChevronRight size={18} />)}
          </button>

          {!isCollapsed && openRekamMedis && (
            <ul className="pl-6 mt-2 space-y-1 text-sm">
              {rekamMedisMenu.map((item, i) => (
                <li key={i}>
                  <Link to={item.to} className="flex items-center gap-2 hover:bg-[#f5e6c8] p-2 rounded-md transition-colors text-gray-700">
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Logout */}
      <div className="absolute bottom-4 left-3 right-3">
        <button onClick={handleLogout} className="w-full bg-[#b08e4a] text-white py-2 rounded-md font-semibold hover:bg-[#a37d3c] transition-colors shadow-sm">
          {!isCollapsed ? "Logout" : "🚪"}
        </button>
      </div>
    </div>
  );
}