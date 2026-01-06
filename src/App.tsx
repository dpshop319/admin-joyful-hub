import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ThuTien from "./pages/admin/ThuTien";
import ComingSoon from "./pages/admin/ComingSoon";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="nha-may" element={<ComingSoon title="Nhà máy" />} />
            <Route path="san-pham" element={<ComingSoon title="Sản phẩm" />} />
            <Route path="khach-hang" element={<ComingSoon title="Khách hàng" />} />
            <Route path="hoa-don" element={<ComingSoon title="Hóa đơn" />} />
            <Route path="thu-tien" element={<ThuTien />} />
            <Route path="chuyen-cho" element={<ComingSoon title="Chuyến chở" />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
