import { useState } from "react";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function SidebarAdmin({ isCollapsed, setIsCollapsed }) {
  const [openAdmin, setOpenAdmin] = useState(false);
  const navigate = useNavigate();

  // === ICONS ===
  const svgUpload = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-4 h-4 fill-[#b08e4a]">
      <path d="M352 173.3L352 384C352 401.7 337.7 416 320 416C302.3 416 288 401.7 288 384L288 173.3L246.6 214.7C234.1 227.2 213.8 227.2 201.3 214.7C188.8 202.2 188.8 181.9 201.3 169.4L297.3 73.4C309.8 60.9 330.1 60.9 342.6 73.4L438.6 169.4C451.1 181.9 451.1 202.2 438.6 214.7C426.1 227.2 405.8 227.2 393.3 214.7L352 173.3zM320 464C364.2 464 400 428.2 400 384L480 384C515.3 384 544 412.7 544 448L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 448C96 412.7 124.7 384 160 384L240 384C240 428.2 275.8 464 320 464zM464 488C477.3 488 488 477.3 488 464C488 450.7 477.3 440 464 440C450.7 440 440 450.7 440 464C440 477.3 450.7 488 464 488z" />
    </svg>
  );

  const svgDatabase = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-4 h-4 fill-[#b08e4a]">
      <path d="M544 269.8C529.2 279.6 512.2 287.5 494.5 293.8C447.5 310.6 385.8 320 320 320C254.2 320 192.4 310.5 145.5 293.8C127.9 287.5 110.8 279.6 96 269.8L96 352C96 396.2 196.3 432 320 432C443.7 432 544 396.2 544 352L544 269.8zM544 192L544 144C544 99.8 443.7 64 320 64C196.3 64 96 99.8 96 144L96 192C96 236.2 196.3 272 320 272C443.7 272 544 236.2 544 192zM494.5 453.8C447.6 470.5 385.9 480 320 480C254.1 480 192.4 470.5 145.5 453.8C127.9 447.5 110.8 439.6 96 429.8L96 496C96 540.2 196.3 576 320 576C443.7 576 544 540.2 544 496L544 429.8C529.2 439.6 512.2 447.5 494.5 453.8z" />
    </svg>
  );

  // === MENU ADMIN ===
  const adminMenu = [
    { icon: svgUpload, label: "Form Pasien", to: "/formPasien" },
    { icon: svgDatabase, label: "Data Pasien", to: "/dataPasien" },
    { icon: svgUpload, label: "Form Dokter", to: "/formDokter" },
    { icon: svgDatabase, label: "Data Dokter", to: "/dataDokter" },
    { icon: svgUpload, label: "Form Perawatan", to: "/formPerawatan" },
    { icon: svgDatabase, label: "Data Perawatan", to: "/dataPerawatan" },
    { icon: svgUpload, label: "Form Janji Temu", to: "/formJanji" },
    { icon: svgDatabase, label: "Data Janji Temu", to: "/dataJanji" },
    { icon: svgDatabase, label: "Data Rekam Medis", to: "/dataRekammedis" },
    { icon: svgDatabase, label: "Data Detail Rekam Medis", to: "/dataDetailRM" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <div className={`fixed top-0 left-0 h-screen bg-[#ffffff] text-[#4b3f2f] border-r border-gray-200 shadow-[4px_0_15px_rgba(0,0,0,0.1)] p-3 transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {!isCollapsed && <h1 className="text-lg font-bold text-[#b08e4a]">Admin Menu</h1>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-gray-100 rounded-lg">
          <Menu className="text-[#b08e4a]" />
        </button>
      </div>

      {/* Dashboard */}
      <div className="mb-3">
        <Link to="/admin" className="w-full flex items-center justify-center gap-2 bg-[#b08e4a] text-white py-2 rounded-md font-semibold hover:bg-[#a37d3c] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-6 h-6 fill-white">
            <path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z"/>
          </svg>
          {!isCollapsed && "Dashboard"}
        </Link>
      </div>

     {/* ADMIN SECTION */}
      <div className="mt-5">
        <button
          onClick={() => setOpenAdmin(!openAdmin)}
          className="w-full flex items-center justify-between py-2 px-3 hover:bg-[#f5e6c8] rounded-md font-medium"
        >
          {/* ICON */}
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-5 h-5" fill="#3d342b">
              <path d="M256.5 72C322.8 72 376.5 125.7 376.5 192C376.5 258.3 322.8 312 256.5 312C190.2 312 136.5 258.3 136.5 192C136.5 125.7 190.2 72 256.5 72zM226.7 368L286.1 368L287.6 368C274.7 394.8 279.8 426.2 299.1 447.5C278.9 469.8 274.3 503.3 289.7 530.9L312.2 571.3C313.1 572.9 314.1 574.5 315.1 576L78.1 576C61.7 576 48.4 562.7 48.4 546.3C48.4 447.8 128.2 368 226.7 368zM432.6 311.6C432.6 298.3 443.3 287.6 456.6 287.6L504.6 287.6C517.9 287.6 528.6 298.3 528.6 311.6L528.6 317.7C528.6 336.6 552.7 350.5 569.1 341.1L574.1 338.2C585.7 331.5 600.6 335.6 607.1 347.3L629.5 387.5C635.7 398.7 632.1 412.7 621.3 419.5L616.6 422.4C600.4 432.5 600.4 462.3 616.6 472.5L621.2 475.4C632 482.2 635.7 496.2 629.5 507.4L607 547.8C600.5 559.5 585.6 563.7 574 556.9L569.1 554C552.7 544.5 528.6 558.5 528.6 577.4L528.6 583.5C528.6 596.8 517.9 607.5 504.6 607.5L456.6 607.5C443.3 607.5 432.6 596.8 432.6 583.5L432.6 577.6C432.6 558.6 408.4 544.6 391.9 554.1L387.1 556.9C375.5 563.6 360.7 559.5 354.1 547.8L331.5 507.4C325.3 496.2 328.9 482.1 339.8 475.3L344.2 472.6C360.5 462.5 360.5 432.5 344.2 422.4L339.7 419.6C328.8 412.8 325.2 398.7 331.4 387.5L353.9 347.2C360.4 335.5 375.3 331.4 386.8 338.1L391.6 340.9C408.1 350.4 432.3 336.4 432.3 317.4L432.3 311.5zM532.5 447.8C532.5 419.1 509.2 395.8 480.5 395.8C451.8 395.8 428.5 419.1 428.5 447.8C428.5 476.5 451.8 499.8 480.5 499.8C509.2 499.8 532.5 476.5 532.5 447.8z"/>
              </svg>
            {!isCollapsed && "Admin"}
          </div>

          {/* ARROW */}
          {!isCollapsed && (openAdmin ? <ChevronDown size={18} /> : <ChevronRight size={18} />)}
        </button>

  {/* DROPDOWN ADMIN MENU */}
  {!isCollapsed && openAdmin && (
    <ul className="pl-6 mt-2 space-y-1 text-sm">
      {adminMenu.map((item, i) => (
        <li key={i}>
          {item.to ? (
            <Link
              to={item.to}
              className="flex items-center gap-2 hover:bg-[#f5e6c8] p-2 rounded-md"
            >
              {item.icon}
              {item.label}
            </Link>
          ) : (
            <div className="flex items-center gap-2 p-2 rounded-md cursor-not-allowed opacity-50">
              {item.icon}
              {item.label}
            </div>
          )}
          {["Data Pasien", "Data Dokter", "Data Perawatan", "Data Janji Temu", "Data Rekam Medis"].includes(item.label) && (
            <hr className="border-t border-[#e0d3b8] my-1 p-1 hover:bg-gray-100 rounded-lg" />
          )}
        </li>
      ))}
    </ul>
  )}
</div>
      {/* MANAJEMEN AKUN */}
      <div className="mt-6">
  <Link
    to="/manage"
    className="w-full flex items-center gap-2 bg-[#b08e4a] text-white py-2 px-3 rounded-md font-semibold hover:bg-[#a37d3c]"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 640 640" fill="white">
      <path d="M128 128C128 110 113 96 96 96S64 110 64 128V464c0 44 36 80 80 80h400c18 0 32-14 32-32s-14-32-32-32H144c-9 0-16-7-16-16V128zm406 87a32 32 0 0 0-45 0L384 320l-58-58a32 32 0 0 0-45 45l80 80a32 32 0 0 0 45 0l128-128a32 32 0 0 0 0-45z"/>
    </svg>

    {!isCollapsed && "Manajemen Akun"}
  </Link>
</div>



       {/* RIWAYAT TRANSAKSI */}
    <div className="mt-6">
  <Link
    to="/laporanTransaksi"
    className="w-full flex items-center gap-2 bg-[#b08e4a] text-white py-2 px-3 rounded-md font-semibold hover:bg-[#a37d3c]"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 640 640" fill="white">
      <path d="M128 288C128 182 214 96 320 96C426 96 512 182 512 288C512 394 426 480 320 480C214 480 128 394 128 288zM304 196L304 200C275.2 200.3 252 223.7 252 252.5C252 278.2 270.5 300.1 295.9 304.3L337.6 311.3C343.6 312.3 348 317.5 348 323.6C348 330.5 342.4 336.1 335.5 336.1L280 336C269 336 260 345 260 356C260 367 269 376 280 376L304 376L304 380C304 391 313 400 324 400C335 400 344 391 344 380L344 375.3C369 371.2 388 349.6 388 323.5C388 297.8 369.5 275.9 344.1 271.7L302.4 264.7C296.4 263.7 292 258.5 292 252.4C292 245.5 297.6 239.9 304.5 239.9L352 239.9C363 239.9 372 230.9 372 219.9C372 208.9 363 199.9 352 199.9L344 199.9L344 195.9C344 184.9 335 175.9 324 175.9C313 175.9 304 184.9 304 195.9zM80 408L80 512C80 520.8 87.2 528 96 528L544 528C552.8 528 560 520.8 560 512L560 408C560 394.7 570.7 384 584 384C597.3 384 608 394.7 608 408L608 512C608 547.3 579.3 576 544 576L96 576C60.7 576 32 547.3 32 512L32 408C32 394.7 42.7 384 56 384C69.3 384 80 394.7 80 408z"/>
    </svg>

    {!isCollapsed && "Riwayat Transaksi"}
  </Link>
</div>




      {/* Logout */}
      <div className="absolute bottom-4 left-3 right-3">
        <button onClick={handleLogout} className="w-full bg-[#b08e4a] text-white py-2 rounded-md font-semibold hover:bg-[#a37d3c] transition-colors">
          Logout
        </button>
      </div>
    </div>
  );
}