import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import AppShell from "./layout/AppShell";
import AuthProvider from "./context/AuthProvider";
import SkipAuth from "./components/SkipAuth";
import Chat from "./pages/Chat";
import { useSnackbar } from "./components/SnackbarExcerpt";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { MessageProvider } from "./context/MessageProvider";

export default function App() {
  const { handleSnackbarOpen, placeholder } = useSnackbar();

  return (
    <AuthProvider>
      <MessageProvider>
        <AppShell>
          {placeholder}

          <Routes>
            <Route path="register" element={<Register />} />
            <Route
              element={
                <SkipAuth
                  navigatePath="/chat"
                  onNavigate={() => handleSnackbarOpen("You've already logged in", "success")}
                />
              }
            >
              <Route path="login" element={<Login />} />
            </Route>

            <Route
              element={
                <RequireAuth
                  navigatePath="/login"
                  onNavigate={() => handleSnackbarOpen("Please log in first", "error")}
                />
              }
            >
              <Route path="chat" element={<Chat />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </AppShell>
      </MessageProvider>
    </AuthProvider>
  );
}
