/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Loader2,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency, formatDate } from "@/utils/format";
import { dashboardService } from "@/services/dashboard.service";
import { DashboardTongQuan, HoaDonCanThu, KhachHangCongNoCao } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
type RangeType = "today" | "7d" | "1m" | "1y";

const Dashboard = () => {
  const { toast } = useToast();
  const [data, setData] = useState<DashboardTongQuan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<RangeType>("today");

  const loadDashboard = async (selectedRange = range) => {
    try {
      setLoading(true);
      setError(null);

      const res = await dashboardService.tongQuan({ range: selectedRange });

      setData(res.data);
    } catch (err: any) {
      setError(err || "Không thể tải dữ liệu dashboard");
      toast({
        variant: "destructive",
        title: "Lỗi kết nối",
        description: "Không thể kết nối đến server.",
      });
    } finally {
      setLoading(false);
    }
  };
  const hoaDonTitleMap: Record<RangeType, string> = {
    today: "Hóa đơn hôm nay",
    "7d": "Hóa đơn 7 ngày",
    "1m": "Hóa đơn tháng này",
    "1y": "Hóa đơn năm nay",
  };

  const hoaDonTitle = hoaDonTitleMap[range];

  const compareLabelMap: Record<RangeType, string> = {
    today: "so với hôm qua",
    "7d": "so với 7 ngày trước",
    "1m": "so với tháng trước",
    "1y": "so với năm trước",
  };

  useEffect(() => {
    loadDashboard(range);
  }, [range]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <AdminHeader
          title="Dashboard"
          subtitle="Tổng quan hệ thống quản lý gạch"
        />
        <div className="p-4 lg:p-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl bg-card border p-6 animate-pulse"
              >
                <div className="h-4 w-20 bg-muted rounded mb-3" />
                <div className="h-8 w-32 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen">
        <AdminHeader
          title="Dashboard"
          subtitle="Tổng quan hệ thống quản lý gạch"
        />

        <div className="p-4 lg:p-8">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Không thể tải dữ liệu
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {error ||
                "Có lỗi xảy ra khi kết nối đến server. Vui lòng kiểm tra backend đang chạy tại http://localhost:4000"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Dashboard"
        subtitle="Tổng quan hệ thống quản lý gạch"
      />
      <div className="px-4 lg:px-8 mt-4 flex items-center gap-2 flex-wrap">
        <Button
          size="sm"
          variant={range === "today" ? "default" : "outline"}
          onClick={() => setRange("today")}
        >
          Hôm nay
        </Button>

        <Button
          size="sm"
          variant={range === "7d" ? "default" : "outline"}
          onClick={() => setRange("7d")}
        >
          7 ngày
        </Button>

        <Button
          size="sm"
          variant={range === "1m" ? "default" : "outline"}
          onClick={() => setRange("1m")}
        >
          1 tháng
        </Button>

        <Button
          size="sm"
          variant={range === "1y" ? "default" : "outline"}
          onClick={() => setRange("1y")}
        >
          1 năm
        </Button>
      </div>
      <div className="p-4 lg:p-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Tổng sản phẩm"
            value={data.tongSanPham}
            icon={Package}
            trend={{
              value: data.phanTram.sanPham,
              isPositive: data.phanTram.sanPham >= 0,
              label: compareLabelMap[range],
            }}
          />

          <StatCard
            title="Khách hàng"
            value={data.tongKhachHang}
            icon={Users}
            trend={{
              value: data.phanTram.khachHang,
              isPositive: data.phanTram.khachHang >= 0,
              label: compareLabelMap[range],
            }}
            variant="info"
          />

          <StatCard
            title={hoaDonTitle}
            value={data.hoaDonHienTai}
            icon={FileText}
            trend={{
              value: data.phanTram.hoaDon,
              isPositive: data.phanTram.hoaDon >= 0,
              label: compareLabelMap[range],
            }}
            variant="success"
          />

          <StatCard
            title="Tổng công nợ"
            value={formatCurrency(data.tongCongNo)}
            icon={Wallet}
            variant="warning"
          />
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-2 mt-4">
          <StatCard
            title="Tổng doanh thu"
            value={formatCurrency(data.tongDoanhThu)}
            icon={DollarSign}
            trend={{
              value: data.phanTram.doanhThu,
              isPositive: data.phanTram.doanhThu >= 0,
              label: compareLabelMap[range],
            }}
            variant="success"
          />
          <StatCard
            title="Đã thu"
            value={formatCurrency(data.tongDaThu)}
            icon={Wallet}
            trend={{
              value: data.phanTram.daThu,
              isPositive: data.phanTram.daThu >= 0,
              label: compareLabelMap[range],
            }}
            variant="info"
          />
        </div>

        {/* Content Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Hóa đơn cần thu */}
          <div className="admin-card overflow-hidden">
            <div className="admin-card-header flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Hóa đơn cần thu tiền</h2>
                  <p className="text-xs text-muted-foreground">
                    {data.hoaDonCanThu.length} hóa đơn
                  </p>
                </div>
              </div>
              <Link
                to="/admin/thu-tien"
                className="flex items-center gap-1 text-sm text-primary hover:underline font-medium"
              >
                Thu tiền
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="divide-y divide-border">
              {data.hoaDonCanThu.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Không có hóa đơn cần thu
                </div>
              ) : (
                data.hoaDonCanThu.slice(0, 5).map((hd: HoaDonCanThu) => (
                  <div
                    key={hd._id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{hd.maHoaDon}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(hd.ngayGiao)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-destructive">
                        {formatCurrency(hd.conNo)}
                      </p>
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
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Khách hàng công nợ cao */}
          <div className="admin-card overflow-hidden">
            <div className="admin-card-header flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-info" />
                </div>
                <div>
                  <h2 className="font-semibold">Khách hàng công nợ cao</h2>
                  <p className="text-xs text-muted-foreground">
                    Top khách hàng nợ nhiều nhất
                  </p>
                </div>
              </div>
              <Link
                to="/admin/khach-hang"
                className="flex items-center gap-1 text-sm text-primary hover:underline font-medium"
              >
                Xem tất cả
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="divide-y divide-border">
              {data.khachHangCongNoCao.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Không có khách hàng nợ
                </div>
              ) : (
                data.khachHangCongNoCao
                  .slice(0, 5)
                  .map((kh: KhachHangCongNoCao, index: number) => (
                    <div
                      key={kh._id}
                      className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{kh.tenKhachHang}</p>
                          <p className="text-sm text-muted-foreground">
                            {kh.soDienThoai}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-destructive">
                        {formatCurrency(kh.congNoHienTai)}
                      </p>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
