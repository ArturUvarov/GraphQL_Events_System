import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Nav from "./components/Nav.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import MainPage from "./pages/MainPage.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import AddEvent from "./pages/AddEvent.jsx";
import EditEvent from "./pages/EditEvent.jsx";
import Footer from "./components/Footer.jsx";

// protected
function RequireAuth({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    return <Navigate to="/signup" replace />;
  }
  return children;
}

// admin
function RequireAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/" element={<RequireAuth></RequireAuth>} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPanel />
            </RequireAdmin>
          }
        />
        <Route path="/addevent" element={<AddEvent />} />
        <Route path="/editevent/:id" element={<EditEvent />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
