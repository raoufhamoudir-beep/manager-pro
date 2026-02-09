import Layout from "@/components/layout/Layout";
import History from "@/pages/History";
import HomePage from "@/pages/HomePage";
import Orders from "@/pages/Orders";
import Stock from "@/pages/Stock";
import { Routes, Route, Navigate } from "react-router-dom";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="Stock" element={<Stock />} />
      <Route path="orders" element={<Orders />} />
      <Route path="history" element={<History />} />

        </Route>
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};