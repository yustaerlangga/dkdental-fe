import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, useDecodedToken } from "../../_services/auth";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("accessToken");
  const decodeData = useDecodedToken(token);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedUser = JSON.parse(localStorage.getItem("userInfo"));

    if (!token || !savedUser) return;
    if (!decodeData || !decodeData.success) return;

    // redirect berdasarkan role
    if (savedUser.role === "admin") navigate("/admin");
    else if (savedUser.role === "perawat") navigate("/perawat");
    else if (savedUser.role === "dokter") navigate("/dokter");
  }, [decodeData, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login(formData);
      console.log("REAL RESPONSE:", response);

      // simpan token & data user
      localStorage.setItem("accessToken", response.access_token);
      localStorage.setItem("userInfo", JSON.stringify(response.user));

      console.log("Token di Login.jsx:", localStorage.getItem("accessToken"));

      // redirect setelah login
      const role = response.user.role;

      if (role === "admin") navigate("/admin");
      else if (role === "perawat") navigate("/perawat");
      else if (role === "dokter") navigate("/dokter");
      else navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.response?.data?.message || "Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#f6f5ef] min-h-screen flex items-center justify-center font-sans">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto w-full max-w-md lg:py-0">
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
            <h1 className="text-xl font-bold leading-tight tracking-tight text-[#3d342b] md:text-2xl text-center">
              Masuk ke Akun Anda
            </h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
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

              {/* Password Input */}
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

              {/* Tombol Login */}
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
                  "Masuk Sekarang"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
