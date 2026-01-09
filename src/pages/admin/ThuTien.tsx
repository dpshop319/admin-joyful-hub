/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  formatCurrency,
  formatDate,
  parseCurrency,
  formatNumber,
  generateMaPhieuThu,
} from "@/utils/format";
import { KhachHang, HoaDon, PhanBoHoaDon } from "@/types";
import { Wallet, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { khachHangService } from "@/services/khachHang.service";
import { hoaDonService } from "@/services/hoaDon.service";
import { phieuThuService } from "@/services/phieuThu.service";

const ThuTien = () => {
  const { toast } = useToast();
  const [selectedKhachHang, setSelectedKhachHang] = useState<KhachHang | null>(
    null
  );
  const [hoaDonConNo, setHoaDonConNo] = useState<HoaDon[]>([]);
  const [phanBo, setPhanBo] = useState<Record<string, number>>({});
  const [selectedHoaDons, setSelectedHoaDons] = useState<Set<string>>(
    new Set()
  );
  const [ghiChu, setGhiChu] = useState("");
  const [khachHangs, setKhachHangs] = useState<KhachHang[]>([]);
  const [priceTotal, setPriceTotal] = useState<number>(0);

  const loadKhachHangs = async () => {
    const res = await khachHangService.danhSach();
    setKhachHangs(res.data.filter((k) => k.trangThai === "HOAT_DONG"));
  };
  useEffect(() => {
    loadKhachHangs();
  }, []);
  // Khi chọn khách hàng
  const handleSelectKhachHang = async (khachHangId: string) => {
    const kh = khachHangs.find((k) => k._id === khachHangId);
    setSelectedKhachHang(kh || null);
    if (kh) {
      const hoaDons = await hoaDonService.danhSach({ khachHangId });
      setHoaDonConNo(hoaDons.data.filter((hd) => hd.conNo !== 0));
      // Reset phân bổ
      setPhanBo({});
      setSelectedHoaDons(new Set());
    } else {
      setHoaDonConNo([]);
      setPhanBo({});
      setSelectedHoaDons(new Set());
    }
  };

  const handleXacNhan = async () => {
    if (!selectedKhachHang) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn khách hàng",
      });
      return;
    }

    if (priceTotal === 0) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập số tiền thu",
      });
      return;
    }
    // 2️⃣ Payload gửi backend
    const payload: any = {
      maPhieuThu: generateMaPhieuThu(),
      khachHangId: selectedKhachHang._id,
      ngayThu: new Date().toISOString().split("T")[0],
      soTienThu: priceTotal,
      ghiChu,
    };

    try {
      await phieuThuService.tao(payload);
      toast({
        title: "Thành công!",
        description: `Đã tạo phiếu thu ${payload.maPhieuThu} - ${formatCurrency(
          priceTotal
        )}`,
      });

      // 4️⃣ Reset form
      setSelectedKhachHang(null);
      setHoaDonConNo([]);
      setPhanBo({});
      setSelectedHoaDons(new Set());
      setGhiChu("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description:
          error?.response?.data?.message || "Không thể tạo phiếu thu",
      });
    }
  };

  const congNoSauThu = useMemo(() => {
    if (!selectedKhachHang) return 0;
    return Math.max(selectedKhachHang.congNoHienTai - priceTotal, 0);
  }, [selectedKhachHang, priceTotal]);

  const isInvalid =
    !selectedKhachHang ||
    priceTotal <= 0 ||
    priceTotal > (selectedKhachHang?.congNoHienTai || 0);

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Thu tiền"
        subtitle="Tạo phiếu thu và phân bổ thanh toán cho hóa đơn"
      />

      <div className="p-4 lg:p-6">
        <div className="mx-auto max-w-4xl">
          {/* Form tạo phiếu thu */}
          <div className="admin-card animate-fade-in">
            <div className="admin-card-header">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Tạo phiếu thu</h2>
              </div>
            </div>

            <div className="admin-card-body space-y-6">
              {/* Chọn khách hàng */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Khách hàng</label>
                <Select onValueChange={handleSelectKhachHang}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn khách hàng..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {khachHangs.map((kh) => (
                      <SelectItem key={kh._id} value={kh._id}>
                        <div className="flex items-center justify-between gap-4">
                          <span>{kh.tenKhachHang}</span>
                          <span className="text-sm text-muted-foreground">
                            {kh.soDienThoai}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Thông tin khách hàng */}
              {selectedKhachHang && (
                <div className="rounded-lg bg-muted/50 p-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        {selectedKhachHang.tenKhachHang}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedKhachHang.soDienThoai}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {selectedKhachHang.diaChi}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-sm text-muted-foreground">
                        Công nợ hiện tại
                      </p>
                      <p className="text-xl font-bold text-destructive">
                        {formatCurrency(selectedKhachHang.congNoHienTai)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bảng hóa đơn còn nợ */}
              {selectedKhachHang && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Chọn hóa đơn và nhập số tiền thu cho từng hóa đơn
                    </span>
                  </div>

                  {hoaDonConNo.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border p-8 text-center">
                      <CheckCircle className="mx-auto h-12 w-12 text-success" />
                      <p className="mt-2 font-medium">Không có hóa đơn nợ</p>
                      <p className="text-sm text-muted-foreground">
                        Khách hàng này đã thanh toán đầy đủ
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table */}
                      <div className="hidden md:block overflow-hidden rounded-lg border border-border">
                        <table className="w-full">
                          <thead>
                            <tr className="table-header border-b border-border">
                              <th className="px-4 py-3 text-left">
                                Mã hóa đơn
                              </th>
                              <th className="px-4 py-3 text-left">Ngày giao</th>
                              <th className="px-4 py-3 text-right">
                                Tổng tiền
                              </th>
                              <th className="px-4 py-3 text-right">Đã thu</th>
                              <th className="px-4 py-3 text-right">Còn nợ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {hoaDonConNo.map((hd) => {
                              const isSelected = selectedHoaDons.has(hd._id);
                              const soTienDaNhap = phanBo[hd._id] || 0;
                              return (
                                <tr
                                  key={hd._id}
                                  className={`table-row-hover border-b border-border last:border-0 ${
                                    isSelected ? "bg-primary/5" : ""
                                  }`}
                                >
                                  <td className="px-4 py-3 font-medium">
                                    {hd.maHoaDon}
                                  </td>
                                  <td className="px-4 py-3 text-muted-foreground">
                                    {formatDate(hd.ngayGiao)}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    {formatCurrency(hd.tongTienHoaDon)}
                                  </td>
                                  <td className="px-4 py-3 text-right text-success">
                                    {formatCurrency(hd.daThu)}
                                  </td>
                                  <td className="px-4 py-3 text-right font-medium text-destructive">
                                    {formatCurrency(hd.conNo)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Cards */}
                      <div className="md:hidden space-y-3">
                        {hoaDonConNo.map((hd) => {
                          const isSelected = selectedHoaDons.has(hd._id);
                          const soTienDaNhap = phanBo[hd._id] || 0;

                          return (
                            <div
                              key={hd._id}
                              className={`rounded-lg border p-4 space-y-3 ${
                                isSelected
                                  ? "bg-primary/5 border-primary/30"
                                  : "bg-card"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="font-semibold">
                                        {hd.maHoaDon}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {formatDate(hd.ngayGiao)}
                                      </p>
                                    </div>
                                    <p className="font-medium text-destructive">
                                      {formatCurrency(hd.conNo)}
                                    </p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">
                                        Tổng:
                                      </span>
                                      <span className="font-medium">
                                        {formatCurrency(hd.tongTienHoaDon)}
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-muted-foreground">
                                        Đã thu:{" "}
                                      </span>
                                      <span className="font-medium text-green-600">
                                        {formatCurrency(hd.daThu)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {selectedKhachHang && (
                        <div className="rounded-xl border bg-muted/40 p-6 space-y-4">
                          <div className="flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold">
                              Nhập số tiền thu
                            </h3>
                          </div>
                          <Input
                            type="number"
                            min={0}
                            max={selectedKhachHang?.congNoHienTai || 0}
                            value={priceTotal || ""}
                            onChange={(e) => {
                              let value = Number(e.target.value);
                              if (!selectedKhachHang) {
                                setPriceTotal(0);
                                return;
                              }
                              if (value < 0) value = 0;
                              if (value > selectedKhachHang.congNoHienTai) {
                                value = selectedKhachHang.congNoHienTai;
                              }
                              setPriceTotal(value);
                            }}
                            placeholder={`Tối đa ${formatCurrency(
                              selectedKhachHang?.congNoHienTai || 0
                            )}`}
                            className="h-12 text-lg font-semibold text-right"
                          />

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">
                                Công nợ trước
                              </div>
                              <div className="font-semibold">
                                {formatCurrency(
                                  selectedKhachHang.congNoHienTai
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="text-muted-foreground">
                                Thu lần này
                              </div>
                              <div className="font-semibold text-primary">
                                {formatCurrency(priceTotal)}
                              </div>
                            </div>

                            <div>
                              <div className="text-muted-foreground">
                                Công nợ sau
                              </div>
                              <div
                                className={`font-semibold ${
                                  congNoSauThu > 0
                                    ? "text-destructive"
                                    : "text-green-600"
                                }`}
                              >
                                {formatCurrency(congNoSauThu)}
                              </div>
                            </div>
                          </div>

                          {isInvalid && (
                            <div className="flex items-center gap-2 text-sm text-red-600">
                              <AlertCircle className="w-4 h-4" />
                              Số tiền thu không hợp lệ
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Ghi chú */}
              {selectedKhachHang && hoaDonConNo.length > 0 && (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-sm font-medium">
                    Ghi chú (tùy chọn)
                  </label>
                  <Input
                    type="text"
                    value={ghiChu}
                    onChange={(e) => setGhiChu(e.target.value)}
                    placeholder="Ví dụ: Thu tiền đợt 1, Thu qua chuyển khoản..."
                  />
                </div>
              )}

              {/* Tổng kết và xác nhận */}
              {selectedKhachHang && hoaDonConNo.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg bg-muted/50 p-4 animate-fade-in">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tổng tiền thu
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(priceTotal)}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none"
                      onClick={() => {
                        setSelectedKhachHang(null);
                        setHoaDonConNo([]);
                        setPhanBo({});
                        setSelectedHoaDons(new Set());
                        setGhiChu("");
                      }}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleXacNhan}
                      disabled={!selectedKhachHang || priceTotal <= 0}
                      className="gap-2 flex-1 sm:flex-none"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        Xác nhận thu tiền
                      </span>
                      <span className="sm:hidden">Xác nhận</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Hướng dẫn khi chưa chọn */}
              {!selectedKhachHang && (
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-muted-foreground">
                    Chọn khách hàng để xem danh sách hóa đơn cần thu
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThuTien;
