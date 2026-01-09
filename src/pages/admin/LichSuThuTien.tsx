/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
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
import { formatCurrency, formatDate } from "@/utils/format";
import { KhachHang } from "@/types";
import { Wallet, Info, X, MessageSquare } from "lucide-react";
import { khachHangService } from "@/services/khachHang.service";
import { phieuThuService } from "@/services/phieuThu.service";
import { DatePicker } from "antd";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

interface ChiTietSanPham {
  tenSanPham: string;
  soLuong: number;
  donGia: number;
  thanhTien: number;
}

interface HoaDon {
  _id: string;
  maHoaDon: string;
  ngayGiao: string;
  tongTienHoaDon: number;
  daThu: number;
  conNo: number;
  chiTietSanPhams?: ChiTietSanPham[];
}

interface PhanBoHoaDon {
  hoaDonId: HoaDon;
  soTien: number;
}

interface PhieuThu {
  _id: string;
  maPhieuThu: string;
  khachHangId: {
    _id: string;
    tenKhachHang: string;
    soDienThoai: string;
  };
  ngayThu: string;
  soTienThu: number;
  ghiChu?: string;
  phanBoHoaDons: PhanBoHoaDon[];
}

/* =======================
   COMPONENT
======================= */

const LichSuThuTien = () => {
  const [khachHangs, setKhachHangs] = useState<KhachHang[]>([]);
  const [phieuThus, setPhieuThus] = useState<PhieuThu[]>([]);
  const [selectedKhachHangId, setSelectedKhachHangId] = useState<string>();
  const [maPhieuThu, setMaPhieuThu] = useState("");
  const [tuNgay, setTuNgay] = useState<string>();
  const [denNgay, setDenNgay] = useState<string>();
  const [loading, setLoading] = useState(false);

  // Modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedHoaDon, setSelectedHoaDon] = useState<HoaDon | null>(null);

  /* =======================
     LOAD DATA
  ======================= */

  useEffect(() => {
    khachHangService.danhSach().then((res) => {
      setKhachHangs(res.data.filter((k) => k.trangThai === "HOAT_DONG"));
    });
  }, []);

  const loadPhieuThu = async () => {
    setLoading(true);
    const res: any = await phieuThuService.danhSach({
      khachHangId: selectedKhachHangId,
      maPhieuThu: maPhieuThu || undefined,
      tuNgay,
      denNgay,
    });
    setPhieuThus(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadPhieuThu();
  }, [selectedKhachHangId]);

  /* =======================
     RENDER
  ======================= */

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Lịch sử thu tiền"
        subtitle="Danh sách các phiếu thu đã tạo"
      />

      <div className="p-4 lg:p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* FILTER */}
          <div className="admin-card">
            <div className="admin-card-body grid grid-cols-1 md:grid-cols-5 gap-4">
              <Select onValueChange={setSelectedKhachHangId}>
                <SelectTrigger>
                  <SelectValue placeholder="Khách hàng" />
                </SelectTrigger>
                <SelectContent>
                  {khachHangs.map((kh) => (
                    <SelectItem key={kh._id} value={kh._id}>
                      {kh.tenKhachHang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Mã phiếu thu"
                value={maPhieuThu}
                onChange={(e) => setMaPhieuThu(e.target.value)}
              />
              <RangePicker
                allowClear
                format="DD/MM/YYYY"
                value={
                  tuNgay && denNgay ? [dayjs(tuNgay), dayjs(denNgay)] : null
                }
                onChange={(dates) => {
                  if (!dates) {
                    setTuNgay(undefined);
                    setDenNgay(undefined);
                    return;
                  }
                  setTuNgay(dates[0].format("YYYY-MM-DD"));
                  setDenNgay(dates[1].format("YYYY-MM-DD"));
                }}
              />

              <Button onClick={loadPhieuThu} disabled={loading}>
                Tìm kiếm
              </Button>
            </div>
          </div>

          {/* LIST */}
          <div className="admin-card">
            <div className="admin-card-header flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Danh sách phiếu thu</h2>
            </div>

            <div className="admin-card-body space-y-4">
              {phieuThus.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  Không có dữ liệu
                </div>
              )}

              {phieuThus.map((pt) => (
                <div
                  key={pt._id}
                  className="rounded-lg border border-border p-4 space-y-4 transition hover:shadow-md"
                >
                  {/* HEADER */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <p className="font-semibold text-lg">{pt.maPhieuThu}</p>
                      <p className="text-sm text-muted-foreground">
                        {pt.khachHangId.tenKhachHang} •{" "}
                        {pt.khachHangId.soDienThoai}
                      </p>
                    </div>

                    <div className="md:text-right">
                      <p className="text-sm text-muted-foreground">Ngày thu</p>
                      <p className="font-medium">{formatDate(pt.ngayThu)}</p>
                    </div>
                  </div>

                  {/* AMOUNT */}
                  <div className="flex justify-between items-center rounded-md bg-muted/40 p-3">
                    <span className="text-sm text-muted-foreground">
                      Tổng tiền thu
                    </span>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(pt.soTienThu)}
                    </span>
                  </div>

                  {/* PHÂN BỔ */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4" />
                      Phân bổ hóa đơn
                    </div>

                    {pt.phanBoHoaDons.map((pb, index) => (
                      <div
                        key={index}
                        className="rounded-md border border-border p-3 text-sm space-y-1"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            {pb.hoaDonId.maHoaDon}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedHoaDon(pb.hoaDonId);
                              setOpenModal(true);
                            }}
                          >
                            Xem chi tiết
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <span>
                            Tổng: {formatCurrency(pb.hoaDonId.tongTienHoaDon)}
                          </span>
                          <span>
                            Đã thu: {formatCurrency(pb.hoaDonId.daThu)}
                          </span>
                          <span className="text-destructive">
                            Còn nợ: {formatCurrency(pb.hoaDonId.conNo)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* GHI CHÚ */}
                  {pt.ghiChu && (
                    <div className="relative rounded-lg border-l-4 border-primary bg-primary/5 p-4">
                      <span className="absolute -top-2 left-4 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                        Ghi chú
                      </span>
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                        <p className="text-sm font-medium">{pt.ghiChu}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CHI TIẾT HÓA ĐƠN */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
          openModal ? "visible bg-black/50" : "invisible bg-black/0"
        }`}
        onClick={() => setOpenModal(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`bg-background rounded-lg w-full max-w-2xl mx-4 p-6 space-y-4 transform transition-all duration-300
          ${openModal ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        >
          {selectedHoaDon && (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Chi tiết hóa đơn {selectedHoaDon.maHoaDon}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpenModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Ngày giao</span>
                  <div className="font-medium">
                    {formatDate(selectedHoaDon.ngayGiao)}
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground">Tổng tiền</span>
                  <div className="font-medium">
                    {formatCurrency(selectedHoaDon.tongTienHoaDon)}
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground">Đã thu</span>
                  <div className="font-medium text-success">
                    {formatCurrency(selectedHoaDon.daThu)}
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground">Còn nợ</span>
                  <div className="font-medium text-destructive">
                    {formatCurrency(selectedHoaDon.conNo)}
                  </div>
                </div>
              </div>

              {selectedHoaDon.chiTietSanPhams && (
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full min-w-[500px] text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-3 py-2 text-left">Sản phẩm</th>
                        <th className="px-3 py-2 text-right">SL</th>
                        <th className="px-3 py-2 text-right">Đơn giá</th>
                        <th className="px-3 py-2 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedHoaDon.chiTietSanPhams.map((sp, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-3 py-2">{sp.tenSanPham}</td>
                          <td className="px-3 py-2 text-right">{sp.soLuong}</td>
                          <td className="px-3 py-2 text-right">
                            {formatCurrency(sp.donGia)}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {formatCurrency(sp.thanhTien)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LichSuThuTien;
