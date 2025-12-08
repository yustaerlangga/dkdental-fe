import React, { useState } from "react";
import SidebarAdmin from "../../components/admin/sidebar";
import { API } from "../../_api";

export default function createAkun() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/users",
        {
          name: form.name,
          email: form.email,
          role: form.role,
          password: form.password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      alert("Akun berhasil ditambahkan!");
      window.location.href = "/manage";
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan akun.");
    }
  };

  const handleReset = () => {
    setForm({ name: "", email: "", role: "", password: "" });
  };

  return (
    <div className="flex bg-white min-h-screen">
      <SidebarAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`flex-1 transition-all duration-300 p-6 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <section className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-[#e0d9b6] p-8">
          <h2 className="text-2xl font-bold text-[#3d342b] mb-6">
            Tambah Akun Pengguna
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-4">

            {/* Nama */}
            <div>
              <label className="text-sm font-medium text-gray-900">
                Nama Pengguna
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nama lengkap"
                className="bg-[#f2f0d6] border border-[#c8c19c] rounded-lg w-full p-2.5"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-900">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="bg-[#f2f0d6] border border-[#c8c19c] rounded-lg w-full p-2.5"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-sm font-medium text-gray-900">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="bg-[#f2f0d6] border border-[#c8c19c] rounded-lg w-full p-2.5"
                required
              >
                <option value="">Pilih role...</option>
                <option value="admin">Admin</option>
                <option value="perawat">Perawat</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimal 8 karakter"
                className="bg-[#f2f0d6] border border-[#c8c19c] rounded-lg w-full p-2.5"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="text-white bg-[#b49b50] hover:bg-[#a38742] rounded-lg px-5 py-2.5"
              >
                Simpan
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="text-red-600 border border-red-600 hover:bg-red-600 hover:text-white rounded-lg px-5 py-2.5"
              >
                Reset
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
