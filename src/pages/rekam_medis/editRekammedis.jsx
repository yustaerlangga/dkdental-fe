import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarPerawat from "../../components/perawat/sidebar";
import { getPerawatanById, updatePerawatan } from "../../_services/perawatan";

export default function EditRekamMedis() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    kode_perawatan: "",
    nama_perawatan: "",
    deskripsi: "",
    harga: "",
  });

  const [loading, setLoading] = useState(true); 
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getPerawatanById(id);

        setForm({
          kode_perawatan: res.kode_perawatan,
          nama_perawatan: res.nama_perawatan,
          deskripsi: res.deskripsi,
          harga: res.harga,
        });
      } catch (err) {
        console.log("ERROR GET:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  
  // HANDLE INPUT
  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  // HANDLE UPDATE
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await updatePerawatan(id, form);
      alert("Perawatan berhasil diupdate!");
      navigate("/dataperawatan");
    } catch (err) {
      alert("Gagal mengupdate data!");
      console.log(err);
    }
  }
  if (loading) return <div className="p-5">Loading...</div>;

  // RENDER FORM  
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
            Edit Perawatan
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Kode Perawatan */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-800">
                Kode Perawatan
              </label>
              <input
                type="text"
                name="kode_perawatan"
                value={form.kode_perawatan}
                onChange={handleChange}
                className="bg-[#f2f0d6] border border-[#c8c19c] text-gray-800 text-sm rounded-lg focus:ring-[#c2ad78] focus:border-[#c2ad78] block w-full p-2.5"
                required
              />
            </div>

            {/* Nama Perawatan */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-800">
                Nama Perawatan
              </label>
              <input
                type="text"
                name="nama_perawatan"
                value={form.nama_perawatan}
                onChange={handleChange}
                className="bg-[#e8eefc] border border-[#c2c9da] text-gray-800 text-sm rounded-lg focus:ring-[#8aa0d6] focus:border-[#8aa0d6] block w-full p-2.5"
                required
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-800">
                Deskripsi
              </label>
              <textarea
                name="deskripsi"
                value={form.deskripsi}
                onChange={handleChange}
                rows="4"
                className="bg-[#f2f0d6] border border-[#c8c19c] text-gray-800 text-sm rounded-lg focus:ring-[#c2ad78] focus:border-[#c2ad78] block w-full p-2.5"
                required
              />
            </div>

            {/* Harga */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-800">
                Harga
              </label>
              <input
                type="number"
                name="harga"
                value={form.harga}
                onChange={handleChange}
                className="bg-[#f2f0d6] border border-[#c8c19c] text-gray-800 text-sm rounded-lg focus:ring-[#c2ad78] focus:border-[#c2ad78] block w-full p-2.5"
                required
              />
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
                    kode_perawatan: "",
                    nama_perawatan: "",
                    deskripsi: "",
                    harga: "",
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
