import { BrowserRouter, Routes, Route } from "react-router-dom";
import Network from "../pages/Network";
import Dashboard from "../pages/Dashboard";
import Events from "../pages/Events";
import Profile from "../pages/Profile";
import Discover from "../pages/Discover";
import Requests from "../pages/Requests";

import MainLayout from "../layout/MainLayout";

function AppRouter() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/network" element={<Network />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/requests" element={<Requests />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default AppRouter;