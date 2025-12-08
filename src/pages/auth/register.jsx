import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../_services/auth";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi password konfirmasi
    if (formData.password !== confirmPassword) {
      setError("Password dan Konfirmasi Password tidak cocok.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await register(formData);
      console.log("Register success:", res);

      alert("Akun berhasil dibuat! Silakan login.");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      setError(
        err?.response?.data?.message ||
          "Pendaftaran gagal. Pastikan email belum terdaftar."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#f6f5ef] min-h-screen flex items-center justify-center font-sans">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto w-full max-w-md lg:py-0">
        {/* Branding */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-[#b49b50] tracking-wide">
            DK DENTAL CARE
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Sistem Informasi Manajemen Klinik
          </p>
        </div>

        <div className="w-full bg-white rounded-2xl shadow-xl border border-[#e0d9b6]/80">
          <div className="p-8 space-y-6">
            <h1 className="text-xl font-bold text-center text-[#3d342b] md:text-2xl">
              Buat Akun Baru
            </h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nama */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-semibold text-[#3d342b]"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  id="name"
                  placeholder="Masukan nama lengkap"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-semibold text-[#3d342b]"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-semibold text-[#3d342b]"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
                />
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-semibold text-[#3d342b]"
                >
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#b49b50] focus:border-[#b49b50] block w-full p-3 transition-all"
                />
              </div>

              {/* Tombol Register */}
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-[#b49b50] hover:bg-[#a38742] focus:ring-4 focus:outline-none focus:ring-[#b49b50]/50 font-medium rounded-lg text-sm px-5 py-3 text-center shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Memproses...
                  </div>
                ) : (
                  "Buat Akun"
                )}
              </button>

              <p className="text-sm font-light text-gray-500 text-center">
                Sudah punya akun?{" "}
                <Link
                  to="/login"
                  className="font-medium text-[#b49b50] hover:underline hover:text-[#a38742]"
                >
                  Masuk disini
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
