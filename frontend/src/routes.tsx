// import { Routes, Route, Navigate } from "react-router-dom";
// import MainLayout from "./layouts/MainLayout";
// import Dashboard from "./pages/Dashboard/Dashboard";
// import Orders from "./pages/Orders/Orders";
// import Login from "./pages/Auth/Login";
// import Register from "./pages/Auth/Register";
// import Mockups from "./pages/Mockups/Mockups";
// import UploadMockup from "./pages/UploadMockup/UploadMockup";
// import Profile from "./pages/Profile/Profile";

// export default function AppRoutes() {
//   return (
//     <Routes>
//       {/* Public */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

//       {/* Protected */}
//       <Route element={<MainLayout />}>
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/orders" element={<Orders />} />
//         <Route path="/mockups" element={<Mockups />} />
//         <Route path="/upload" element={<UploadMockup />} />
//         <Route path="/profile" element={<Profile />} />
//       </Route>

//       <Route path="*" element={<Navigate to="/dashboard" />} />
//     </Routes>
//   );
// }




import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./../src/routes/ProtectedRoute"; // ✅ add this

import Dashboard from "./pages/Dashboard/Dashboard";
import Orders from "./pages/Orders/Orders";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Mockups from "./pages/Mockups/Mockups";
import UploadMockup from "./pages/UploadMockup/UploadMockup";
import Profile from "./pages/Profile/Profile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/mockups" element={<Mockups />} />
        <Route path="/profile" element={<Profile />} />

        <Route
          path="/upload"
          element={
            <ProtectedRoute role="designer">
              <UploadMockup />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}