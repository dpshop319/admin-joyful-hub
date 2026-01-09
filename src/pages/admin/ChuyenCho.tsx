/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Truck, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { chuyenChoService } from "@/services/chuyenCho.service";
import { khachHangService } from "@/services/khachHang.service";
import { nhaMayService } from "@/services/nhaMay.service";
import { hoaDonService } from "@/services/hoaDon.service";
import { KhachHang, NhaMay, HoaDon } from "@/types";
import { formatDate } from "@/utils/format";
import { DatePicker } from "antd";

/* =======================
   TYPES (ĐÚNG DATA BACKEND)
======================= */

interface DanhSachGach {
  tenSanPham: string;
  kichThuoc: string;
  soLuong: number;
}

interface ChuyenCho {
  _id: string;
  hoaDonId: string;
  ngayChuyen: string;
  nhaMayId: string;
  khachHangId: string;
  danhSachGach: DanhSachGach[];
}

/* =======================
   COMPONENT
======================= */

const ChuyenChoPage = () => {
  const { toast } = useToast();
  const [chuyenChos, setChuyenChos] = useState<ChuyenCho[]>([]);
  const [khachHangs, setKhachHangs] = useState<KhachHang[]>([]);
  const [nhaMays, setNhaMays] = useState<NhaMay[]>([]);
  const [hoaDons, setHoaDons] = useState<HoaDon[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterNhaMay, setFilterNhaMay] = useState<string>("all");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedChuyenCho, setSelectedChuyenCho] = useState<ChuyenCho | null>(
    null
  );
  const [ngayChuyen, setNgayChuyen] = useState<string | undefined>();

  /* =======================
     LOAD DATA
  ======================= */

  const loadData = async () => {
    try {
      setLoading(true);
      const [ccRes, khRes, nmRes, hdRes] = await Promise.all([
        chuyenChoService.danhSach({
          ngay: ngayChuyen,
        }),
        khachHangService.danhSach(),
        nhaMayService.danhSach(),
        hoaDonService.danhSach(),
      ]);

      setChuyenChos((ccRes as any).data || []);
      setKhachHangs(khRes.data || []);
      setNhaMays(nmRes.data || []);
      setHoaDons(hdRes.data || []);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: err?.message || "Không thể tải dữ liệu",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [ngayChuyen]);

  /* =======================
     HELPERS
  ======================= */

  const getKhachHang = (id: string) => khachHangs.find((k) => k._id === id);

  const getNhaMay = (id: string) => nhaMays.find((n) => n._id === id);

  const getHoaDon = (id: string) => hoaDons.find((h) => h._id === id);

  const renderMaChuyenCho = (cc: ChuyenCho) =>
    `CC-${cc._id.slice(-6).toUpperCase()}`;

  const getTongSoLuong = (cc: ChuyenCho) =>
    cc.danhSachGach?.reduce((sum, sp) => sum + sp.soLuong, 0) || 0;

  /* =======================
     FILTER
  ======================= */

  const filteredChuyenChos = chuyenChos.filter((cc) => {
    const kh = getKhachHang(cc.khachHangId);
    const hd = getHoaDon(cc.hoaDonId);

    const matchSearch =
      renderMaChuyenCho(cc).toLowerCase().includes(searchTerm.toLowerCase()) ||
      kh?.tenKhachHang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hd?.maHoaDon.toLowerCase().includes(searchTerm.toLowerCase());

    const matchNhaMay = filterNhaMay === "all" || cc.nhaMayId === filterNhaMay;

    return matchSearch && matchNhaMay;
  });

  /* =======================
     RENDER
  ======================= */

  if (loading) {
    return (
      <div className="min-h-screen">
        <AdminHeader
          title="Chuyến chở"
          subtitle="Quản lý vận chuyển hàng hóa"
        />
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminHeader title="Chuyến chở" subtitle="Quản lý vận chuyển hàng hóa" />

      <div className="p-4 lg:p-8 space-y-6">
        {/* TOOLBAR */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm mã chuyến, khách hàng, hóa đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterNhaMay} onValueChange={setFilterNhaMay}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Nhà máy" />
            </SelectTrigger>
            <DatePicker
              allowClear
              placeholder="Chọn ngày"
              format="DD/MM/YYYY"
              onChange={(d) =>
                setNgayChuyen(d ? d.format("YYYY-MM-DD") : undefined)
              }
            />
            <SelectContent>
              <SelectItem value="all">Tất cả nhà máy</SelectItem>
              {nhaMays.map((nm) => (
                <SelectItem key={nm._id} value={nm._id}>
                  {nm.tenNhaMay}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              loadData();
              setNgayChuyen(null);
            }}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block admin-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Mã chuyến</TableHead>
                <TableHead>Hóa đơn</TableHead>
                <TableHead>Nhà máy</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Ngày chuyển</TableHead>
                <TableHead className="text-right">Số lượng</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChuyenChos.map((cc) => {
                const kh = getKhachHang(cc.khachHangId);
                const nm = getNhaMay(cc.nhaMayId);
                const hd = getHoaDon(cc.hoaDonId);

                return (
                  <TableRow key={cc._id} className="table-row-hover">
                    <TableCell className="font-medium">
                      {renderMaChuyenCho(cc)}
                    </TableCell>
                    <TableCell>{hd?.maHoaDon}</TableCell>
                    <TableCell>{nm?.tenNhaMay}</TableCell>
                    <TableCell>{kh?.tenKhachHang}</TableCell>
                    <TableCell>{formatDate(cc.ngayChuyen)}</TableCell>
                    <TableCell className="text-right">
                      {getTongSoLuong(cc)} SP
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedChuyenCho(cc);
                          setOpenDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden space-y-3">
          {filteredChuyenChos.map((cc) => {
            const kh = getKhachHang(cc.khachHangId);
            const hd = getHoaDon(cc.hoaDonId);

            return (
              <div key={cc._id} className="admin-card p-4 space-y-3">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{renderMaChuyenCho(cc)}</p>
                    <p className="text-sm text-muted-foreground">
                      {hd?.maHoaDon}
                    </p>
                  </div>
                  <Badge variant="secondary">Chờ giao</Badge>
                </div>

                <div className="grid grid-cols-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Khách hàng</p>
                    <p className="font-medium">{kh?.tenKhachHang}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">Ngày chuyển</p>
                    <p className="font-medium">{formatDate(cc.ngayChuyen)}</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedChuyenCho(cc);
                      setOpenDialog(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Chi tiết
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredChuyenChos.length === 0 && (
          <div className="text-center py-16">
            <Truck className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Không có chuyến chở nào</p>
          </div>
        )}
      </div>

      {/* MODAL CHI TIẾT */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Chi tiết chuyến chở{" "}
              {selectedChuyenCho && renderMaChuyenCho(selectedChuyenCho)}
            </DialogTitle>
          </DialogHeader>

          {selectedChuyenCho && (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Kích thước</TableHead>
                    <TableHead className="text-right">Số lượng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedChuyenCho.danhSachGach.map((sp, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{sp.tenSanPham}</TableCell>
                      <TableCell>{sp.kichThuoc}</TableCell>
                      <TableCell className="text-right font-medium">
                        {sp.soLuong}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChuyenChoPage;
