import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Truck, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { chuyenChoService } from '@/services/chuyenCho.service';
import { khachHangService } from '@/services/khachHang.service';
import { nhaMayService } from '@/services/nhaMay.service';
import { hoaDonService } from '@/services/hoaDon.service';
import { ChuyenCho, KhachHang, NhaMay, HoaDon } from '@/types';
import { formatDate } from '@/utils/format';

const ChuyenChoPage = () => {
  const { toast } = useToast();
  const [chuyenChos, setChuyenChos] = useState<ChuyenCho[]>([]);
  const [khachHangs, setKhachHangs] = useState<KhachHang[]>([]);
  const [nhaMays, setNhaMays] = useState<NhaMay[]>([]);
  const [hoaDons, setHoaDons] = useState<HoaDon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTrangThai, setFilterTrangThai] = useState<string>('all');
  const [filterNhaMay, setFilterNhaMay] = useState<string>('all');
  
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedChuyenCho, setSelectedChuyenCho] = useState<ChuyenCho | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ccRes, khRes, nmRes, hdRes] = await Promise.all([
        chuyenChoService.danhSach(),
        khachHangService.danhSach(),
        nhaMayService.danhSach(),
        hoaDonService.danhSach()
      ]);
      setChuyenChos((ccRes as any).data || []);
      setKhachHangs(khRes.data || []);
      setNhaMays(nmRes.data || []);
      setHoaDons(hdRes.data || []);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Lỗi', description: err || 'Không thể tải dữ liệu' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getKhachHang = (id: string) => khachHangs.find(kh => kh._id === id);
  const getNhaMay = (id: string) => nhaMays.find(nm => nm._id === id);
  const getHoaDon = (id: string) => hoaDons.find(hd => hd._id === id);

  const filteredChuyenChos = chuyenChos.filter((cc) => {
    const khachHang = getKhachHang(cc.khachHangId);
    const hoaDon = getHoaDon(cc.hoaDonId);
    const matchSearch = cc.maChuyenCho.toLowerCase().includes(searchTerm.toLowerCase()) ||
      khachHang?.tenKhachHang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hoaDon?.maHoaDon.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTrangThai = filterTrangThai === 'all' || cc.trangThai === filterTrangThai;
    const matchNhaMay = filterNhaMay === 'all' || cc.nhaMayId === filterNhaMay;
    return matchSearch && matchTrangThai && matchNhaMay;
  });

  const handleView = (chuyenCho: ChuyenCho) => {
    setSelectedChuyenCho(chuyenCho);
    setIsViewDialogOpen(true);
  };

  const getTrangThaiLabel = (trangThai: string) => {
    switch (trangThai) {
      case 'CHO_GIAO': return { label: 'Chờ giao', variant: 'secondary' as const };
      case 'DANG_GIAO': return { label: 'Đang giao', variant: 'default' as const };
      case 'DA_GIAO': return { label: 'Đã giao', variant: 'outline' as const };
      default: return { label: trangThai, variant: 'outline' as const };
    }
  };

  const getTongSoLuong = (chuyenCho: ChuyenCho) => {
    return chuyenCho.chiTiet?.reduce((sum, ct) => sum + ct.soLuong, 0) || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <AdminHeader title="Chuyến chở" subtitle="Quản lý vận chuyển hàng hóa" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminHeader title="Chuyến chở" subtitle="Quản lý vận chuyển hàng hóa" />

      <div className="p-4 lg:p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="admin-card p-4">
            <p className="text-sm text-muted-foreground">Chờ giao</p>
            <p className="text-2xl font-bold text-warning">
              {chuyenChos.filter(cc => cc.trangThai === 'CHO_GIAO').length}
            </p>
          </div>
          <div className="admin-card p-4">
            <p className="text-sm text-muted-foreground">Đang giao</p>
            <p className="text-2xl font-bold text-info">
              {chuyenChos.filter(cc => cc.trangThai === 'DANG_GIAO').length}
            </p>
          </div>
          <div className="admin-card p-4">
            <p className="text-sm text-muted-foreground">Đã giao</p>
            <p className="text-2xl font-bold text-success">
              {chuyenChos.filter(cc => cc.trangThai === 'DA_GIAO').length}
            </p>
          </div>
          <div className="admin-card p-4">
            <p className="text-sm text-muted-foreground">Tổng chuyến</p>
            <p className="text-2xl font-bold">{chuyenChos.length}</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm mã chuyến, khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterNhaMay} onValueChange={setFilterNhaMay}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Nhà máy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả nhà máy</SelectItem>
              {nhaMays.map((nm) => (
                <SelectItem key={nm._id} value={nm._id}>{nm.tenNhaMay}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterTrangThai} onValueChange={setFilterTrangThai}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="CHO_GIAO">Chờ giao</SelectItem>
              <SelectItem value="DANG_GIAO">Đang giao</SelectItem>
              <SelectItem value="DA_GIAO">Đã giao</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={loadData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block admin-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead>Mã chuyến</TableHead>
                <TableHead>Hóa đơn</TableHead>
                <TableHead className="hidden lg:table-cell">Nhà máy</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Ngày chuyển</TableHead>
                <TableHead className="text-right">Số lượng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChuyenChos.map((cc) => {
                const khachHang = getKhachHang(cc.khachHangId);
                const nhaMay = getNhaMay(cc.nhaMayId);
                const hoaDon = getHoaDon(cc.hoaDonId);
                const { label, variant } = getTrangThaiLabel(cc.trangThai);
                return (
                  <TableRow key={cc._id} className="table-row-hover">
                    <TableCell className="font-medium">{cc.maChuyenCho}</TableCell>
                    <TableCell>{hoaDon?.maHoaDon}</TableCell>
                    <TableCell className="hidden lg:table-cell">{nhaMay?.tenNhaMay}</TableCell>
                    <TableCell>{khachHang?.tenKhachHang}</TableCell>
                    <TableCell>{formatDate(cc.ngayChuyen)}</TableCell>
                    <TableCell className="text-right">{getTongSoLuong(cc)} SP</TableCell>
                    <TableCell>
                      <Badge variant={variant}>{label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleView(cc)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredChuyenChos.map((cc) => {
            const khachHang = getKhachHang(cc.khachHangId);
            const nhaMay = getNhaMay(cc.nhaMayId);
            const hoaDon = getHoaDon(cc.hoaDonId);
            const { label, variant } = getTrangThaiLabel(cc.trangThai);
            return (
              <div key={cc._id} className="admin-card p-4 space-y-3 animate-fade-in">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{cc.maChuyenCho}</p>
                    <p className="text-sm text-muted-foreground">{hoaDon?.maHoaDon}</p>
                  </div>
                  <Badge variant={variant}>{label}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Khách hàng</p>
                    <p className="font-medium">{khachHang?.tenKhachHang}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">Ngày chuyển</p>
                    <p className="font-medium">{formatDate(cc.ngayChuyen)}</p>
                  </div>
                </div>
                <div className="flex justify-end pt-2 border-t">
                  <Button variant="outline" size="sm" onClick={() => handleView(cc)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Chi tiết
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredChuyenChos.length === 0 && (
          <div className="empty-state">
            <Truck className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Không có chuyến chở nào</h3>
            <p className="text-muted-foreground">Chuyến chở sẽ được tạo tự động khi có hóa đơn mới</p>
          </div>
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết chuyến chở: {selectedChuyenCho?.maChuyenCho}</DialogTitle>
          </DialogHeader>
          {selectedChuyenCho && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Hóa đơn</p>
                  <p className="font-medium">{getHoaDon(selectedChuyenCho.hoaDonId)?.maHoaDon}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nhà máy</p>
                  <p className="font-medium">{getNhaMay(selectedChuyenCho.nhaMayId)?.tenNhaMay}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Khách hàng</p>
                  <p className="font-medium">{getKhachHang(selectedChuyenCho.khachHangId)?.tenKhachHang}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày chuyển</p>
                  <p className="font-medium">{formatDate(selectedChuyenCho.ngayChuyen)}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-muted-foreground">Địa chỉ giao</p>
                  <p className="font-medium">{selectedChuyenCho.diaChiGiao}</p>
                </div>
              </div>

              <div className="admin-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="table-header">
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="hidden sm:table-cell">Kích thước</TableHead>
                      <TableHead className="text-right">Số lượng</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedChuyenCho.chiTiet?.map((ct, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{ct.tenSanPham}</TableCell>
                        <TableCell className="hidden sm:table-cell">{ct.kichThuoc}</TableCell>
                        <TableCell className="text-right font-medium">{ct.soLuong}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChuyenChoPage;
