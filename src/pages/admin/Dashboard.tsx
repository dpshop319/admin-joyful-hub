import AdminHeader from '@/components/admin/AdminHeader';
import StatCard from '@/components/admin/StatCard';
import { Package, Users, FileText, Wallet, TrendingUp, ArrowRight } from 'lucide-react';
import { mockThongKe, mockHoaDons, mockKhachHangs } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/utils/format';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Lấy 5 hóa đơn gần nhất còn nợ
  const hoaDonGanNhat = mockHoaDons
    .filter(hd => hd.conNo > 0)
    .slice(0, 5);

  // Lấy khách hàng có công nợ
  const khachHangCongNo = mockKhachHangs
    .filter(kh => kh.congNoHienTai > 0)
    .sort((a, b) => b.congNoHienTai - a.congNoHienTai)
    .slice(0, 5);

  return (
    <div className="min-h-screen">
      <AdminHeader 
        title="Dashboard" 
        subtitle="Tổng quan hệ thống quản lý gạch"
      />

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Tổng sản phẩm"
            value={mockThongKe.tongSanPham}
            icon={Package}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Khách hàng"
            value={mockThongKe.tongKhachHang}
            icon={Users}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Hóa đơn tháng này"
            value={mockThongKe.tongHoaDon}
            icon={FileText}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Tổng công nợ"
            value={formatCurrency(mockThongKe.tongCongNo)}
            icon={Wallet}
            variant="primary"
          />
        </div>

        {/* Content Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Hóa đơn cần thu */}
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
              <table className="w-full">
                <thead>
                  <tr className="table-header border-b border-border">
                    <th className="px-6 py-3 text-left">Mã HĐ</th>
                    <th className="px-6 py-3 text-left">Ngày giao</th>
                    <th className="px-6 py-3 text-right">Còn nợ</th>
                    <th className="px-6 py-3 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {hoaDonGanNhat.map((hd) => (
                    <tr key={hd._id} className="table-row-hover border-b border-border last:border-0">
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
                            hd.trangThai === 'CHUA_THU'
                              ? 'badge-danger'
                              : 'badge-warning'
                          }
                        >
                          {hd.trangThai === 'CHUA_THU' ? 'Chưa thu' : 'Thu 1 phần'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Khách hàng công nợ cao */}
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
              <table className="w-full">
                <thead>
                  <tr className="table-header border-b border-border">
                    <th className="px-6 py-3 text-left">Khách hàng</th>
                    <th className="px-6 py-3 text-left">SĐT</th>
                    <th className="px-6 py-3 text-right">Công nợ</th>
                  </tr>
                </thead>
                <tbody>
                  {khachHangCongNo.map((kh) => (
                    <tr key={kh._id} className="table-row-hover border-b border-border last:border-0">
                      <td className="px-6 py-4">
                        <p className="font-medium">{kh.tenKhachHang}</p>
                        <p className="text-sm text-muted-foreground">{kh.maKhachHang}</p>
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
  );
};

export default Dashboard;
