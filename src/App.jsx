import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";

// Layouts
import AdminLayout from "./layout/admin";
import PerawatLayout from "./layout/perawat";
import DokterLayout from "./layout/dokter";

// Pages Admin
import Dashboard from "./pages/admin";
import ManajemenAkun from "./pages/admin/manage";
import RiwayatTransaksi from "./pages/admin/laporanTransaksi";
import EditAkun from "./pages/admin/editAkun";
import TambahAkun from "./pages/admin/createAkun";
import EditDokter from "./pages/admin/editDokter"
import DataDetailRekamMedis from "./pages/admin/detailRekamMedis";


// Pages Perawat - Pasien
import FormPasien from "./pages/pasien/formPasien";
import DataPasien from "./pages/pasien/dataPasien";
import EditPasien from "./pages/pasien/editPasien";

// Pages Perawat - Janji Temu
import FormJanji from "./pages/janji_temu/formJanji";
import DataJanji from "./pages/janji_temu/dataJanji";
import EditJanji from "./pages/janji_temu/editJanji";

// Pages Dokter 
import EditStatusJanji from "./pages/dokter/EditStatusJanji";
import ProfileDokter from "./pages/dokter/ProfileDokter";
import DataPasienDokter from "./pages/dokter/DataPasienDokter";

// Pages Manajemen Dokter
import FormDokter from "./pages/dokter/formDokter";
import DataDokter from "./pages/dokter/dataDokter";

// Pages Rekam Medis
import FormRekamMedis from "./pages/dokter/FormRekamMedis";
import DataRekamMedis from "./pages/rekam_medis/dataRekammedis";
import EditRekamMedis from "./pages/rekam_medis/editRekammedis";

//Admin Pages
import FormPerawatan from "./pages/perawatan/formPerawatan";
import DataPerawatan from "./pages/perawatan/dataPerawatan";
import EditPerawatan from "./pages/perawatan/editPerawatan";

// Pages Detail Rekam Medis
import FormDetailRekamMedis from "./pages/dokter/FormDetailRekamMedis";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route ke login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Halaman Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Halaman Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
        </Route>

        {/* AREA ADMIN  */}
        <Route path="/manage" element={<ManajemenAkun />} />
        <Route path="/laporanTransaksi" element={<RiwayatTransaksi />} />
        <Route path="/createAkun" element={<TambahAkun />} />
        <Route path="/editAkun/:id" element={<EditAkun/>} />
        <Route path="/formPerawatan" element={<FormPerawatan/>} />
        <Route path="/dataPerawatan" element={<DataPerawatan/>} />
        <Route path="/editPerawatan/:id" element={<EditPerawatan />} />
        <Route path="/editDokter/:id" element={<EditDokter />} />
        <Route path="/dataDetailRM" element={<DataDetailRekamMedis />} /> 

        {/* --- AREA PERAWAT --- */}
        <Route path="/perawat" element={<PerawatLayout />}>
          <Route index element={<Navigate to="/perawat" />} />
        </Route>
        
        {/* --- AREA DOKTER (DENGAN SIDEBAR/LAYOUT) --- */}
        <Route path="/dokter" element={<DokterLayout />}>
          <Route path="jadwal" element={<DataJanji />} /> 
          <Route path="antrean-hari-ini" element={<DataJanji showTodayOnly={true} />} />
          <Route path="profile" element={<ProfileDokter />} />
        </Route>
        
        {/* --- AREA DOKTER (STANDALONE / TANPA SIDEBAR) --- */}
        <Route path="/dokter/rekam-medis/:id" element={<FormRekamMedis />} />
        <Route path="/dokter/data-pasien" element={<DataPasienDokter />} />
        <Route path="/dokter/edit-status/:id" element={<EditStatusJanji />} />
        <Route path="/dokter/detail-rekam-medis/:id" element={<FormDetailRekamMedis />} />


        {/* --- RUTE HALAMAN PERAWAT (STANDALONE) --- */}
        {/* Pasien */}
        <Route path="/formPasien" element={<FormPasien />} />
        <Route path="/dataPasien" element={<DataPasien />} />
        <Route path="/editPasien/:id" element={<EditPasien />} />
        
        {/* Janji Temu */}
        <Route path="/formJanji" element={<FormJanji />} />
        <Route path="/dataJanji" element={<DataJanji />} />
        <Route path="/editJanji/:id" element={<EditJanji />} />
        
        {/* Dokter (Manajemen oleh Admin) */}
        <Route path="/formDokter" element={<FormDokter />} />
        <Route path="/dataDokter" element={<DataDokter />} />
        
        {/* REKAM MEDIS */}
        <Route path="/dataRekammedis" element={<DataRekamMedis />} />
        <Route path="/editRekammedis/:id" element={<EditRekamMedis />} />
        
        {/* Fallback route */}
        <Route
          path="*"
          element={
            <div className="p-10 text-center">
              <h1>404 - Halaman tidak ditemukan</h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;