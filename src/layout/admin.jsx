import React, { useState, useEffect } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";

import HeroAdmin from "../components/admin/hero";
import SidebarAdmin from "../components/admin/sidebar";

function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <SidebarAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <HeroAdmin />
      </div>
    </div>
  );
}

export default AdminLayout;