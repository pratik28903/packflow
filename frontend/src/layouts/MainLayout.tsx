import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Common/Sidebar";
import Navbar from "../components/Common/Navbar";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar collapsed={collapsed} />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <Box
          sx={{
            p: 3,
            flex: 1,
            overflowY: "auto",
            bgcolor: "#F8FAFC",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;