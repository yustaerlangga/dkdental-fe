import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SidebarAdmin from "../../components/admin/sidebar";

export default function ManajemenAkun() {
  const [users, setUsers] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

       console.log("DATA API:", res.data);
    (res.data || []).forEach(u => console.log("ROLE:", `"${u.role}"`));
      setUsers(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus akun ini?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const totalAdmin = users.filter((u) => u.role === "admin").length;
  const totalDokter = users.filter((u) => u.role === "dokter").length;
  const totalPerawat = users.filter((u) => u.role === "perawat").length;

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      {/* SIDEBAR */}
      <SidebarAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* CONTENT AREA */}
      <div
        className={`flex-1 p-6 transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* HEADER */}
        <div className="bg-[#b08e4a] text-white p-6 rounded-2xl shadow mb-6">
          <h1 className="text-3xl font-bold">Manajemen Akun</h1>
          <p className="text-white/90">
            kelola pengguna dan akses sistem dengan mudah
          </p>
        </div>

        {/* INFO CARD */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 shadow rounded-xl border">
            <p className="text-3xl font-bold">{users.length}</p>
            <p className="text-gray-600">Total pengguna</p>
          </div>

          <div className="bg-white p-6 shadow rounded-xl border">
            <p className="text-3xl font-bold">{totalAdmin}</p>
            <p className="text-gray-600">Admin</p>
          </div>

          <div className="bg-white p-6 shadow rounded-xl border">
            <p className="text-3xl font-bold">{totalDokter}</p>
            <p className="text-gray-600">Dokter</p>
          </div>

          <div className="bg-white p-6 shadow rounded-xl border">
            <p className="text-3xl font-bold">{totalPerawat}</p>
            <p className="text-gray-600">Perawat</p>
          </div>
        </div>

        {/* TABLE USER */}
        <div className="bg-[#b08e4a] text-white p-4 rounded-t-2xl shadow flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <svg width="26" height="26" viewBox="0 0 640 512" fill="white">
              <path d="M96 128a80 80 0 1 1 160 0A80 80 0 1 1 96 128zm80 112A112 112 0 0 0 64 352v16a32 32 0 0 0 32 32H240a32 32 0 0 0 32-32V352a112 112 0 0 0-96-112zm224-16a64 64 0 1 0 0-128 64 64 0 1 0 0 128zm-96 144c0-21.4 5.6-41.5 15.5-59L256 309.9c-.3 0-.6-.1-.9-.1H231.4C243.9 331.1 256 356.3 256 384v16a47.9 47.9 0 0 1-8.6 27.3c5.3.5 10.7.7 16.1.7H336a32 32 0 0 0 32-32V368c0-17.7-14.3-32-32-32H304z"/>
            </svg>
            Daftar Pengguna Sistem
          </h2>

          <Link
            to="/createAkun"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold"
          >
            TAMBAH AKUN
          </Link>
        </div>

        <div className="bg-white p-4 rounded-b-2xl shadow border">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3">ID</th>
                <th className="p-3">Username</th>
                <th className="p-3">Role</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u, index) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>

                  <td className="p-3 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 640 512">
                      <path d="M96 128a80 80 0 1"></path>
                    </svg>
                    {u.name}
                  </td>

                  <td className="p-3 capitalize">{u.role}</td>

                  <td className="p-3 flex gap-2">
                    <Link
                      to={`/editAkun/${u.id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(u.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
