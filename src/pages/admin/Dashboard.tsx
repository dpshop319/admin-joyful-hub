import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import {
  Package,
  Users,
  FileText,
  Wallet,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency, formatDate } from "@/utils/format";
import { dashboardService } from "@/services/dashboard.service";
import { DashboardTongQuan, HoaDonCanThu, KhachHangCongNoCao } from "@/types";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();

  const [data, setData] = useState<DashboardTongQuan | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const res = await dashboardService.tongQuan();
      setData(res.data);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: err || "Không thể tải dữ liệu dashboard",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="p-6">Đang tải dashboard...</div>;
  }

  if (!data) {
    return <div className="p-6">Không có dữ liệu</div>;
  }

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Dashboard"
        subtitle="Tổng quan hệ thống quản lý gạch"
      />

      <div className="p-4 lg:p-6">
        {/* ===== STAT CARDS ===== */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Tổng sản phẩm"
            value={data.tongSanPham}
            icon={Package}
            trend={{
              value: data.phanTram.sanPham,
              isPositive: data.phanTram.sanPham >= 0,
            }}
          />

          <StatCard
            title="Khách hàng"
            value={data.tongKhachHang}
            icon={Users}
            trend={{
              value: data.phanTram.khachHang,
              isPositive: data.phanTram.khachHang >= 0,
            }}
          />

          <StatCard
            title="Hóa đơn tháng này"
            value={data.hoaDonThangNay}
            icon={FileText}
            trend={{
              value: data.phanTram.hoaDon,
              isPositive: data.phanTram.hoaDon >= 0,
            }}
          />

          <StatCard
            title="Tổng công nợ"
            value={formatCurrency(data.tongCongNo)}
            icon={Wallet}
            variant="primary"
          />
        </div>

        {/* ===== CONTENT ===== */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* ===== HÓA ĐƠN CẦN THU ===== */}
          <div className="admin-card">
            <div className="admin-card-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Hóa đơn cần thu tiền</h2>
              </div>
              <Link
                to="/admin/thu-tien"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Thu tiền
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="admin-card-body p-0">
              <div className="hidden md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-6 py-3 text-left">Mã HĐ</th>
                      <th className="px-6 py-3 text-left">Ngày giao</th>
                      <th className="px-6 py-3 text-right">Còn nợ</th>
                      <th className="px-6 py-3 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.hoaDonCanThu.map((hd: HoaDonCanThu) => (
                      <tr key={hd._id} className="border-b">
                        <td className="px-6 py-4 font-medium">{hd.maHoaDon}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {formatDate(hd.ngayGiao)}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-destructive">
                          {formatCurrency(hd.conNo)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={
                              hd.trangThai === "CHUA_THU"
                                ? "badge-danger"
                                : "badge-warning"
                            }
                          >
                            {hd.trangThai === "CHUA_THU"
                              ? "Chưa thu"
                              : "Thu 1 phần"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ===== KHÁCH HÀNG CÔNG NỢ CAO ===== */}
          <div className="admin-card">
            <div className="admin-card-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Khách hàng công nợ cao</h2>
              </div>
              <Link
                to="/admin/khach-hang"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Xem tất cả
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="admin-card-body p-0">
              <div className="hidden md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-6 py-3 text-left">Khách hàng</th>
                      <th className="px-6 py-3 text-left">SĐT</th>
                      <th className="px-6 py-3 text-right">Công nợ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.khachHangCongNoCao.map((kh: KhachHangCongNoCao) => (
                      <tr key={kh._id} className="border-b">
                        <td className="px-6 py-4 font-medium">
                          {kh.tenKhachHang}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {kh.soDienThoai}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-destructive">
                          {formatCurrency(kh.congNoHienTai)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
