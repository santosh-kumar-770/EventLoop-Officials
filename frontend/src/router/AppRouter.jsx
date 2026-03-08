import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Events from "../pages/Events";
import Profile from "../pages/Profile";
import Discover from "../pages/Discover";

import MainLayout from "../layout/MainLayout";

function AppRouter() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/discover" element={<Discover />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default AppRouter;