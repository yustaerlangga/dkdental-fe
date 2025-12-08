import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarPerawat from "../../components/perawat/sidebar";
import { getPasienById, updatePasien } from "../../_services/pasien";

export default function EditPasien() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nama_lengkap: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    nomor_telepon: "",
    alamat: "",
    email: "",
    riwayat_alergi: "",
  });

  // Fetch data pasien by id 
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getPasienById(id);
        setForm({
          nama_lengkap: res.nama_lengkap,
          tanggal_lahir: res.tanggal_lahir,
          jenis_kelamin: res.jenis_kelamin,
          nomor_telepon: res.nomor_telepon,
          alamat: res.alamat,
          email: res.email,
          riwayat_alergi: res.riwayat_alergi,
        });
      } catch (err) {
        console.log("ERROR GET:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  //Handle Change 
  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  // Update Data Pasien
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await updatePasien(id, form);
      alert("Data pasien berhasil diupdate!");
      navigate("/datapasien");
    } catch (err) {
      console.log(err);
      alert("Gagal mengupdate pasien!");
    }
  }

  if (loading) return <div className="p-5">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-[#fdfcf7]">
      <SidebarPerawat
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div
        className="flex-1 p-6 transition-all duration-300"
        style={{ marginLeft: isCollapsed ? "64px" : "320px" }}
      >
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 border border-[#e0d8bc]">
          <h1 className="text-2xl font-semibold text-gray-800 mb-5">
            Edit Data Pasien
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Nama Lengkap */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-800">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama_lengkap"
                value={form.nama_lengkap}
                onChange={handleChange}
                className="bg-[#e8eefc] border border-[#c2c9da] text-gray-800 text-sm rounded-lg block w-full p-2.5 focus:ring-[#8aa0d6] focus:border-[#8aa0d6]"
                required
              />
            </div>

            {/* Tanggal Lahir */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-800">
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="tanggal_lahir"
                value={form.tanggal_lahir}
                onChange={handleChange}
                className="bg-[#f2f0d6] border border-[#c8c19c] text-gray-800 text-sm rounded-lg block w-full p-2.5 focus:ring-[#c2ad78] focus:border-[#c2ad78]"
                required
              />
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-800">
                Jenis Kelamin
              </label>
              <select
                name="jenis_kelamin"
                value={form.jenis_kelamin}
                onChange={handleChange}
                className="bg-[#f2f0d6] border border-[#c8c19c] text-gray-800 text-sm rounded-lg block w-full p-2.5"
                required
              >
                <option value="">Pilih</option>
                <option value="L">Laki - Laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            {/* Nomor Telepon */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-800">
                Nomor Telepon
              </label>
              <input
                type="text"
                name="nomor_telepon"
                value={form.nomor_telepon}
                onChange={handleChange}
                className="bg-[#e8eefc] border border-[#c2c9da] text-gray-800 text-sm rounded-lg block w-full p-2.5"
                required
              />
            </div>

            {/* Alamat */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-800">
                Alamat
              </label>
              <textarea
                name="alamat"
                rows="3"
                value={form.alamat}
                onChange={handleChange}
                className="bg-[#f2f0d6] border border-[#c8c19c] text-gray-800 text-sm rounded-lg block w-full p-2.5"
                required
              ></textarea>
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-800">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="bg-[#e8eefc] border border-[#c2c9da] text-gray-800 text-sm rounded-lg block w-full p-2.5"
                required
              />
            </div>

            {/* Riwayat Alergi */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-800">
                Riwayat Alergi
              </label>
              <textarea
                name="riwayat_alergi"
                value={form.riwayat_alergi}
                onChange={handleChange}
                rows="3"
                className="bg-[#f2f0d6] border border-[#c8c19c] text-gray-800 text-sm rounded-lg block w-full p-2.5"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                className="px-5 py-2 bg-[#b89c5a] text-white rounded-md shadow hover:bg-[#a88a4e] transition"
              >
                Update
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm({
                    nama_lengkap: "",
                    tanggal_lahir: "",
                    jenis_kelamin: "",
                    nomor_telepon: "",
                    alamat: "",
                    email: "",
                    riwayat_alergi: "",
                  })
                }
                className="px-5 py-2 bg-white border border-red-400 text-red-500 rounded-md hover:bg-red-50 transition"
              >
                Reset
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
