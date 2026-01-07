import { useState } from 'react';
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
import { Search, Eye, Truck, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockChuyenChos, mockKhachHangs, mockNhaMays, mockHoaDons } from '@/data/mockData';
import { ChuyenCho } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';

const ChuyenChoPage = () => {
  const { toast } = useToast();
  const [chuyenChos, setChuyenChos] = useState<ChuyenCho[]>(mockChuyenChos);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTrangThai, setFilterTrangThai] = useState<string>('all');
  const [filterNhaMay, setFilterNhaMay] = useState<string>('all');
  
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedChuyenCho, setSelectedChuyenCho] = useState<ChuyenCho | null>(null);

  const filteredChuyenChos = chuyenChos.filter((cc) => {
    const khachHang = mockKhachHangs.find(kh => kh._id === cc.khachHangId);
    const hoaDon = mockHoaDons.find(hd => hd._id === cc.hoaDonId);
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

  const handleUpdateTrangThai = (chuyenChoId: string, newTrangThai: ChuyenCho['trangThai']) => {
    setChuyenChos(chuyenChos.map(cc => 
      cc._id === chuyenChoId ? { ...cc, trangThai: newTrangThai } : cc
    ));
    toast({
      title: 'Thành công',
      description: `Cập nhật trạng thái thành công`,
    });
  };

  const getTrangThaiLabel = (trangThai: string) => {
    switch (trangThai) {
      case 'CHO_GIAO': return { label: 'Chờ giao', variant: 'secondary' as const, icon: Truck };
      case 'DANG_GIAO': return { label: 'Đang giao', variant: 'default' as const, icon: Truck };
      case 'DA_GIAO': return { label: 'Đã giao', variant: 'outline' as const, icon: CheckCircle };
      default: return { label: trangThai, variant: 'outline' as const, icon: Truck };
    }
  };

  const getTongSoLuong = (chuyenCho: ChuyenCho) => {
    return chuyenCho.chiTiet.reduce((sum, ct) => sum + ct.soLuong, 0);
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title="Chuyến chở" subtitle="Quản lý vận chuyển hàng hóa" />

      <div className="p-4 lg:p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Chờ giao</p>
            <p className="text-2xl font-bold text-yellow-600">
              {chuyenChos.filter(cc => cc.trangThai === 'CHO_GIAO').length}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Đang giao</p>
            <p className="text-2xl font-bold text-blue-600">
              {chuyenChos.filter(cc => cc.trangThai === 'DANG_GIAO').length}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Đã giao</p>
            <p className="text-2xl font-bold text-green-600">
              {chuyenChos.filter(cc => cc.trangThai === 'DA_GIAO').length}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Tổng chuyến</p>
            <p className="text-2xl font-bold">{chuyenChos.length}</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm mã chuyến, khách hàng, hóa đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterNhaMay} onValueChange={setFilterNhaMay}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Nhà máy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả nhà máy</SelectItem>
              {mockNhaMays.map((nm) => (
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
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã chuyến</TableHead>
                <TableHead className="hidden md:table-cell">Hóa đơn</TableHead>
                <TableHead className="hidden lg:table-cell">Nhà máy</TableHead>
                <TableHead className="hidden sm:table-cell">Khách hàng</TableHead>
                <TableHead>Ngày chuyển</TableHead>
                <TableHead className="text-right hidden md:table-cell">Số lượng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChuyenChos.map((cc) => {
                const khachHang = mockKhachHangs.find(kh => kh._id === cc.khachHangId);
                const nhaMay = mockNhaMays.find(nm => nm._id === cc.nhaMayId);
                const hoaDon = mockHoaDons.find(hd => hd._id === cc.hoaDonId);
                const { label, variant } = getTrangThaiLabel(cc.trangThai);
                return (
                  <TableRow key={cc._id}>
                    <TableCell className="font-medium">{cc.maChuyenCho}</TableCell>
                    <TableCell className="hidden md:table-cell">{hoaDon?.maHoaDon}</TableCell>
                    <TableCell className="hidden lg:table-cell">{nhaMay?.tenNhaMay}</TableCell>
                    <TableCell className="hidden sm:table-cell">{khachHang?.tenKhachHang}</TableCell>
                    <TableCell>{formatDate(cc.ngayChuyen)}</TableCell>
                    <TableCell className="text-right hidden md:table-cell">{getTongSoLuong(cc)} SP</TableCell>
                    <TableCell>
                      <Badge variant={variant}>{label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleView(cc)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {cc.trangThai === 'CHO_GIAO' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleUpdateTrangThai(cc._id, 'DANG_GIAO')}
                            title="Bắt đầu giao"
                          >
                            <Truck className="h-4 w-4 text-blue-600" />
                          </Button>
                        )}
                        {cc.trangThai === 'DANG_GIAO' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleUpdateTrangThai(cc._id, 'DA_GIAO')}
                            title="Hoàn thành"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
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
                  <p className="font-medium">{mockHoaDons.find(hd => hd._id === selectedChuyenCho.hoaDonId)?.maHoaDon}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nhà máy</p>
                  <p className="font-medium">{mockNhaMays.find(nm => nm._id === selectedChuyenCho.nhaMayId)?.tenNhaMay}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Khách hàng</p>
                  <p className="font-medium">{mockKhachHangs.find(kh => kh._id === selectedChuyenCho.khachHangId)?.tenKhachHang}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày chuyển</p>
                  <p className="font-medium">{formatDate(selectedChuyenCho.ngayChuyen)}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-muted-foreground">Địa chỉ giao</p>
                  <p className="font-medium">{selectedChuyenCho.diaChiGiao}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trạng thái</p>
                  <Badge variant={getTrangThaiLabel(selectedChuyenCho.trangThai).variant}>
                    {getTrangThaiLabel(selectedChuyenCho.trangThai).label}
                  </Badge>
                </div>
              </div>

              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="hidden sm:table-cell">Kích thước</TableHead>
                      <TableHead className="text-right">Số lượng</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedChuyenCho.chiTiet.map((ct, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{ct.tenSanPham}</TableCell>
                        <TableCell className="hidden sm:table-cell">{ct.kichThuoc}</TableCell>
                        <TableCell className="text-right font-medium">{ct.soLuong}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                {selectedChuyenCho.trangThai === 'CHO_GIAO' && (
                  <Button onClick={() => {
                    handleUpdateTrangThai(selectedChuyenCho._id, 'DANG_GIAO');
                    setSelectedChuyenCho({ ...selectedChuyenCho, trangThai: 'DANG_GIAO' });
                  }}>
                    <Truck className="h-4 w-4 mr-2" />
                    Bắt đầu giao
                  </Button>
                )}
                {selectedChuyenCho.trangThai === 'DANG_GIAO' && (
                  <Button onClick={() => {
                    handleUpdateTrangThai(selectedChuyenCho._id, 'DA_GIAO');
                    setSelectedChuyenCho({ ...selectedChuyenCho, trangThai: 'DA_GIAO' });
                  }}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Hoàn thành giao hàng
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChuyenChoPage;
