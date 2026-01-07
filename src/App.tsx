import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ThuTien from "./pages/admin/ThuTien";
import NhaMay from "./pages/admin/NhaMay";
import KhachHang from "./pages/admin/KhachHang";
import SanPham from "./pages/admin/SanPham";
import HoaDon from "./pages/admin/HoaDon";
import ChuyenCho from "./pages/admin/ChuyenCho";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="nha-may" element={<NhaMay />} />
              <Route path="san-pham" element={<SanPham />} />
              <Route path="khach-hang" element={<KhachHang />} />
              <Route path="hoa-don" element={<HoaDon />} />
              <Route path="thu-tien" element={<ThuTien />} />
              <Route path="chuyen-cho" element={<ChuyenCho />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
