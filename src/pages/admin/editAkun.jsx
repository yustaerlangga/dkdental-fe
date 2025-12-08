import React, { useEffect, useState } from "react";
import SidebarAdmin from "../../components/admin/sidebar";
import { API } from "../../_api";
import { useParams } from "react-router-dom";

export default function EditAkun() {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

 const fetchUser = async () => {
  try {
    const { data } = await API.get(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    setForm({
      name: data.name,
      email: data.email,
      role: data.role,
      password: "",
    });

  } catch (err) {
    console.error(err);
    alert("Gagal mengambil data user.");
  }
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
    };

    if (form.password.trim() !== "") {
      payload.password = form.password;
    }

    try {
      await API.put(`/users/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      alert("Akun berhasil diperbarui!");
      window.location.href = "/manage";

    } catch (err) {
      console.error(err);
      alert("Gagal mengedit akun.");
    }
  };

   const handleReset = () => {
    setForm({
      name: "",
      email: "",
      role: "",
      password: "",
    });
  };

  return (
    <div className="flex bg-white min-h-screen">
      <SidebarAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`flex-1 p-6 transition-all duration-300 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <section className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-[#e0d9b6] p-8">
          <h2 className="text-2xl font-bold text-[#3d342b] mb-6">
            Edit Akun Pengguna
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-4">

            {/* Nama */}
            <div>
              <label className="text-sm font-medium">Nama Pengguna</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="bg-[#f2f0d6] border border-[#c8c19c] rounded-lg w-full p-2.5"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="bg-[#f2f0d6] border border-[#c8c19c] rounded-lg w-full p-2.5"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-sm font-medium">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="bg-[#f2f0d6] border border-[#c8c19c] rounded-lg w-full p-2.5"
                required
              >
                <option value="admin">Admin</option>
                <option value="dokter">Dokter</option>
                <option value="perawat">Perawat</option>
              </select>
            </div>

            {/* Password Optional */}
            <div>
              <label className="text-sm font-medium">Password (Opsional)</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Isi jika ingin mengganti password"
                className="bg-[#f2f0d6] border border-[#c8c19c] rounded-lg w-full p-2.5"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="text-white bg-[#b49b50] hover:bg-[#a38742] rounded-lg px-5 py-2.5"
              >
                Simpan Perubahan
              </button>

              <button
                  type="button"
                  onClick={handleReset}
                  className="text-red-600 border border-red-600 hover:bg-red-600 hover:text-white rounded-lg text-sm px-5 py-2.5"
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
