  import React, { useState } from "react";
  import { addPasien } from "../../_services/pasien";
  import SidebarPerawat from "../../components/perawat/sidebar";

  export default function FormRekamMedis() {
    const [form, setForm] = useState({
      id_pasien: "",
      id_dokter: "",
      id_janji_temu: "",
      anamnesis: "",
      diagnosa: "",
      catatan: "",
      tanggal_perawatan: "",
    });

    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleChange = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await addPasien(form);
        alert("Data pasien berhasil ditambahkan!");
        window.location.href = "/datapasien"; 
      } catch (err) {
        console.error(err);
        alert("Gagal menyimpan data pasien");
      }
    };

    const handleReset = () => {
  setForm({
      id_pasien: "",
      id_dokter: "",
      id_janji_temu: "",
      anamnesis: "",
      diagnosa: "",
      catatan: "",
      tanggal_perawatan: "",
  });
};

    return (
      <div className="flex bg-white dark:bg-gray-900 min-h-screen">
        {/* Sidebar */}
        <SidebarPerawat isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Content */}
        <div
          className={`flex-1 transition-all duration-300 p-5 ${
            isCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          <section className="flex-1 px-6 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-[#e0d9b6] p-8">
            <h2 className="mb-6 text-2xl font-bold text-[#3d342b]">
              Form Rekam Medis
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-6 sm:grid-cols-2">
                {/* ID Pasien */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="id_pasien"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    ID Pasien
                  </label>
                  <input
                    type="text"
                    id="id_pasien"
                    name="id_psaien"
                    value={form.id_pasien}
                    onChange={handleChange}
                    placeholder="ID Pasien"
                    className="bg-[#f2f0d6] border border-[#c8c19c] text-gray-800 text-sm rounded-lg focus:ring-[#c2ad78] focus:border-[#c2ad78] block w-full p-2.5"
                    required
                  />
                </div>

                {/* ID Dokter */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="id_dokter"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    ID Dokter
                  </label>
                  <input
                    type="text"
                    id="id_dokter"
                    name="id_dokter"
                    value={form.id_dokter}
                    onChange={handleChange}
                    placeholder="ID Dokter"
                    className="bg-[#f2f0d6] border border-[#c8c19c] text-gray-800 text-sm rounded-lg focus:ring-[#c2ad78] focus:border-[#c2ad78] block w-full p-2.5"
                    required
                  />
                </div>

                {/* ID Janji Temu */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="id_janji_temu"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    ID Janji Temu
                  </label>
                  <input
                  type="text"
                    id="id_janji_temu"
                    name="id_janji_temu"
                    value={form.id_janji_temu}
                    onChange={handleChange}
                    className="bg-[#f2f0d6] border border-[#c8c19c] text-gray-800 text-sm rounded-lg focus:ring-[#c2ad78] focus:border-[#c2ad78] block w-full p-2.5"
                    required
                  />
                </div>

                {/* Anamnesis */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="anamnesis"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Anamnesis
                  </label>
                  <textarea
                    id="anamnesis"
                    name="anamnesis"
                    value={form.anamnesis}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Anamnesis"
                    className="bg-[#f2f0d6] border border-[#c8c19c] text-gray-800 text-sm rounded-lg focus:ring-[#c2ad78] focus:border-[#c2ad78] block w-full p-2.5"
                    required
                  >
                  </textarea>
                </div>

                {/* Diagnosa */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="diagnosa"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Diagnosa
                  </label>
                  <input
                    type="text"
                    id="diagnosa"
                    name="diagnosa"
                    value={form.diagnosa}
                    onChange={handleChange}
                    placeholder="Diagnosa"
                    className="bg-[#f2f0d6] border border-[#c8c19c] text-gray-800 text-sm rounded-lg focus:ring-[#c2ad78] focus:border-[#c2ad78] block w-full p-2.5"
                    required
                  />
                </div>

                 {/* Catatan */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="catatan"
                    className="block mb-2 text-sm font-semibold text-[#3d342b]"
                  >
                    Catatan
                  </label>
                  <textarea
                    type="text"
                    id="catatan"
                    name="catatan"
                    value={form.catatan}
                    onChange={handleChange}
                    placeholder="Catatan"
                    className="bg-[#f2f0d6] border border-[#c8c19c] text-gray-800 text-sm rounded-lg focus:ring-[#c2ad78] focus:border-[#c2ad78] block w-full p-2.5"
                  />
                </div>

                {/* Tanggal Perawatan */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="tanggal_perawatan"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Tanggal Perawatan
                  </label>
                  <input
                  type="date"
                    id="tanggal_perawatan"
                    name="tanggal_perawatan"
                    value={form.tanggal_perawatan}
                    onChange={handleChange}
                    className="bg-[#f2f0d6] border border-[#c8c19c] text-gray-800 text-sm rounded-lg focus:ring-[#c2ad78] focus:border-[#c2ad78] block w-full p-2.5"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  className="text-white bg-[#b49b50] hover:bg-[#a38742] focus:ring-4 focus:outline-none focus:ring-[#b49b50]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Upload
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="text-red-600 border border-red-600 hover:bg-red-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
          </section>
        </div>
      </div>
    );
  }
