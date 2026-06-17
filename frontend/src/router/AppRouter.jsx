import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Network from "../pages/Network";
import Dashboard from "../pages/Dashboard";
import Events from "../pages/Events";
import Profile from "../pages/Profile";
import Discover from "../pages/Discover";
import Requests from "../pages/Requests";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Messages from "../pages/Messages";
import Chat from "../pages/Chat";
import MainLayout from "../layout/MainLayout";
import EventLobby from "../pages/EventLobby";
import Settings from "../pages/Settings"; // <-- Added the new import

// Protects routes — redirects to /login if not logged in
function PrivateRoute({ children }) {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" />;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes — no navbar, no layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — wrapped in MainLayout */}
        <Route path="/" element={
          <PrivateRoute>
            <MainLayout><Dashboard /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/events" element={
          <PrivateRoute>
            <MainLayout><Events /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/network" element={
          <PrivateRoute>
            <MainLayout><Network /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/profile/:id" element={
          <PrivateRoute>
            <MainLayout><Profile /></MainLayout>
          </PrivateRoute>
        } />
        
        {/* NEW SETTINGS ROUTE */}
        <Route path="/settings" element={
          <PrivateRoute>
            <MainLayout><Settings /></MainLayout>
          </PrivateRoute>
        } />

        <Route path="/discover" element={
          <PrivateRoute>
            <MainLayout><Discover /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/requests" element={
          <PrivateRoute>
            <MainLayout><Requests /></MainLayout>
          </PrivateRoute>
        } />
        <Route path="/messages" element={
          <PrivateRoute><MainLayout><Messages /></MainLayout></PrivateRoute>
        } />
        <Route path="/messages/:userId" element={
          <PrivateRoute><MainLayout><Chat /></MainLayout></PrivateRoute>
        } />
        <Route path="/events/:eventId/lobby" element={
          <PrivateRoute><MainLayout><EventLobby /></MainLayout></PrivateRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;