import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // <-- Correct import
import Home from "../src/pages/Home";
import StudentDashboard from '../src/components/Student/StudentDashboard';
import AlumniDashboard from '../src/components/Alumni/AlumniDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/StudentDashboard" element={<StudentDashboard />} />
        <Route path="/AlumniDashboard" element={<AlumniDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
