import CircularProgress from "@mui/material/CircularProgress";
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PropertyForm from "./components/PropertyForm";

const Dashboard = lazy(() => import("./components/Dashboard"));
const PropertyDetail = lazy(() => import("./components/PropertyDetail"));

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<CircularProgress />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-property" element={<PropertyForm />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="*" element={<>Oops! 404 Not Found!</>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
