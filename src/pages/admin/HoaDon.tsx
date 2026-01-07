import { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockHoaDons, mockKhachHangs, mockNhaMays, mockSanPhams } from '@/data/mockData';
import { HoaDon, ChiTietHoaDon } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';

const HoaDonPage = () => {
  const { toast } = useToast();
  const [hoaDons, setHoaDons] = useState<HoaDon[]>(mockHoaDons);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTrangThai, setFilterTrangThai] = useState<string>('all');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedHoaDon, setSelectedHoaDon] = useState<HoaDon | null>(null);
  
  const [formData, setFormData] = useState({
    khachHangId: '',
    nhaMayId: '',
    ngayGiao: new Date().toISOString().split('T')[0],
    diaChiGiao: '',
  });
  const [chiTiet, setChiTiet] = useState<ChiTietHoaDon[]>([]);

  const filteredHoaDons = hoaDons.filter((hd) => {
    const khachHang = mockKhachHangs.find(kh => kh._id === hd.khachHangId);
    const matchSearch = hd.maHoaDon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      khachHang?.tenKhachHang.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTrangThai = filterTrangThai === 'all' || hd.trangThai === filterTrangThai;
    return matchSearch && matchTrangThai;
  });

  const resetForm = () => {
    setFormData({
      khachHangId: '',
      nhaMayId: '',
      ngayGiao: new Date().toISOString().split('T')[0],
      diaChiGiao: '',
    });
    setChiTiet([]);
  };

  const handleKhachHangChange = (khachHangId: string) => {
    const khachHang = mockKhachHangs.find(kh => kh._id === khachHangId);
    setFormData(prev => ({
      ...prev,
      khachHangId,
      diaChiGiao: khachHang?.diaChi || '',
    }));
  };

  const handleAddChiTiet = () => {
    setChiTiet([...chiTiet, {
      sanPhamId: '',
      tenSanPham: '',
      kichThuoc: '',
      soLuong: 1,
      donGia: 0,
      thanhTien: 0,
    }]);
  };

  const handleChiTietChange = (index: number, field: string, value: string | number) => {
    const newChiTiet = [...chiTiet];
    if (field === 'sanPhamId') {
      const sanPham = mockSanPhams.find(sp => sp._id === value);
      if (sanPham) {
        newChiTiet[index] = {
          ...newChiTiet[index],
          sanPhamId: sanPham._id,
          tenSanPham: sanPham.tenSanPham,
          kichThuoc: sanPham.kichThuoc,
          donGia: sanPham.giaBanMacDinh,
          thanhTien: sanPham.giaBanMacDinh * newChiTiet[index].soLuong,
        };
      }
    } else if (field === 'soLuong') {
      const soLuong = Number(value) || 0;
      newChiTiet[index] = {
        ...newChiTiet[index],
        soLuong,
        thanhTien: newChiTiet[index].donGia * soLuong,
      };
    } else if (field === 'donGia') {
      const donGia = Number(value) || 0;
      newChiTiet[index] = {
        ...newChiTiet[index],
        donGia,
        thanhTien: donGia * newChiTiet[index].soLuong,
      };
    }
    setChiTiet(newChiTiet);
  };

  const handleRemoveChiTiet = (index: number) => {
    setChiTiet(chiTiet.filter((_, i) => i !== index));
  };

  const tongTien = chiTiet.reduce((sum, ct) => sum + ct.thanhTien, 0);

  const handleSubmit = () => {
    if (!formData.khachHangId || !formData.nhaMayId || chiTiet.length === 0) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin',
        variant: 'destructive',
      });
      return;
    }

    const validChiTiet = chiTiet.filter(ct => ct.sanPhamId && ct.soLuong > 0);
    if (validChiTiet.length === 0) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng thêm ít nhất 1 sản phẩm',
        variant: 'destructive',
      });
      return;
    }

    const newHoaDon: HoaDon = {
      _id: `hd${Date.now()}`,
      maHoaDon: `HD${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(hoaDons.length + 1).padStart(3, '0')}`,
      khachHangId: formData.khachHangId,
      nhaMayId: formData.nhaMayId,
      ngayGiao: formData.ngayGiao,
      diaChiGiao: formData.diaChiGiao,
      chiTiet: validChiTiet,
      tongTien,
      daThu: 0,
      conNo: tongTien,
      trangThai: 'CHUA_THU',
    };

    setHoaDons([newHoaDon, ...hoaDons]);
    setIsDialogOpen(false);
    resetForm();
    toast({
      title: 'Thành công',
      description: 'Tạo hóa đơn thành công',
    });
  };

  const handleView = (hoaDon: HoaDon) => {
    setSelectedHoaDon(hoaDon);
    setIsViewDialogOpen(true);
  };

  const getTrangThaiLabel = (trangThai: string) => {
    switch (trangThai) {
      case 'CHUA_THU': return { label: 'Chưa thu', variant: 'destructive' as const };
      case 'THU_MOT_PHAN': return { label: 'Thu một phần', variant: 'secondary' as const };
      case 'DA_THU': return { label: 'Đã thu', variant: 'default' as const };
      default: return { label: trangThai, variant: 'outline' as const };
    }
  };

  const sanPhamsByNhaMay = formData.nhaMayId 
    ? mockSanPhams.filter(sp => sp.nhaMayId === formData.nhaMayId)
    : [];

  return (
    <div className="min-h-screen">
      <AdminHeader title="Hóa đơn" subtitle="Quản lý hóa đơn bán hàng" />

      <div className="p-4 lg:p-8 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm mã hóa đơn, tên khách..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterTrangThai} onValueChange={setFilterTrangThai}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="CHUA_THU">Chưa thu</SelectItem>
                <SelectItem value="THU_MOT_PHAN">Thu một phần</SelectItem>
                <SelectItem value="DA_THU">Đã thu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Tạo hóa đơn</span>
            <span className="sm:hidden">Thêm</span>
          </Button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã HĐ</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Ngày giao</TableHead>
                <TableHead className="text-right">Tổng tiền</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Đã thu</TableHead>
                <TableHead className="text-right">Còn nợ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHoaDons.map((hd) => {
                const khachHang = mockKhachHangs.find(kh => kh._id === hd.khachHangId);
                const { label, variant } = getTrangThaiLabel(hd.trangThai);
                return (
                  <TableRow key={hd._id}>
                    <TableCell className="font-medium">{hd.maHoaDon}</TableCell>
                    <TableCell>{khachHang?.tenKhachHang}</TableCell>
                    <TableCell>{formatDate(hd.ngayGiao)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(hd.tongTien)}</TableCell>
                    <TableCell className="text-right hidden lg:table-cell">{formatCurrency(hd.daThu)}</TableCell>
                    <TableCell className="text-right text-destructive font-medium">
                      {formatCurrency(hd.conNo)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={variant}>{label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleView(hd)}>
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
          {filteredHoaDons.map((hd) => {
            const khachHang = mockKhachHangs.find(kh => kh._id === hd.khachHangId);
            const { label, variant } = getTrangThaiLabel(hd.trangThai);
            return (
              <div key={hd._id} className="rounded-lg border bg-card p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{hd.maHoaDon}</p>
                    <p className="text-sm text-muted-foreground">{khachHang?.tenKhachHang}</p>
                  </div>
                  <Badge variant={variant}>{label}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Ngày giao</p>
                    <p className="font-medium">{formatDate(hd.ngayGiao)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">Tổng tiền</p>
                    <p className="font-medium">{formatCurrency(hd.tongTien)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Đã thu</p>
                    <p className="font-medium text-green-600">{formatCurrency(hd.daThu)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">Còn nợ</p>
                    <p className="font-medium text-destructive">{formatCurrency(hd.conNo)}</p>
                  </div>
                </div>
                <div className="flex justify-end pt-2 border-t">
                  <Button variant="outline" size="sm" onClick={() => handleView(hd)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo hóa đơn mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Thông tin chung */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Khách hàng *</Label>
                <Select value={formData.khachHangId} onValueChange={handleKhachHangChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khách hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockKhachHangs.filter(kh => kh.trangThai === 'HOAT_DONG').map((kh) => (
                      <SelectItem key={kh._id} value={kh._id}>
                        {kh.maKhachHang} - {kh.tenKhachHang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nhà máy *</Label>
                <Select value={formData.nhaMayId} onValueChange={(v) => setFormData({ ...formData, nhaMayId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhà máy" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockNhaMays.filter(nm => nm.trangThai === 'HOAT_DONG').map((nm) => (
                      <SelectItem key={nm._id} value={nm._id}>
                        {nm.maNhaMay} - {nm.tenNhaMay}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ngày giao</Label>
                <Input
                  type="date"
                  value={formData.ngayGiao}
                  onChange={(e) => setFormData({ ...formData, ngayGiao: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Địa chỉ giao</Label>
                <Input
                  value={formData.diaChiGiao}
                  onChange={(e) => setFormData({ ...formData, diaChiGiao: e.target.value })}
                  placeholder="Địa chỉ giao hàng"
                />
              </div>
            </div>

            {/* Chi tiết sản phẩm */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Chi tiết sản phẩm</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddChiTiet} disabled={!formData.nhaMayId}>
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm dòng
                </Button>
              </div>
              
              {chiTiet.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {formData.nhaMayId ? 'Chưa có sản phẩm nào. Nhấn "Thêm dòng" để thêm.' : 'Vui lòng chọn nhà máy trước.'}
                </p>
              ) : (
                <div className="space-y-3">
                  {chiTiet.map((ct, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 bg-muted/50 rounded-lg">
                      <div className="col-span-12 md:col-span-4 space-y-1">
                        <Label className="text-xs">Sản phẩm</Label>
                        <Select value={ct.sanPhamId} onValueChange={(v) => handleChiTietChange(index, 'sanPhamId', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn SP" />
                          </SelectTrigger>
                          <SelectContent>
                            {sanPhamsByNhaMay.map((sp) => (
                              <SelectItem key={sp._id} value={sp._id}>
                                {sp.tenSanPham}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-4 md:col-span-2 space-y-1">
                        <Label className="text-xs">Số lượng</Label>
                        <Input
                          type="number"
                          min={1}
                          value={ct.soLuong}
                          onChange={(e) => handleChiTietChange(index, 'soLuong', e.target.value)}
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2 space-y-1">
                        <Label className="text-xs">Đơn giá</Label>
                        <Input
                          type="number"
                          value={ct.donGia}
                          onChange={(e) => handleChiTietChange(index, 'donGia', e.target.value)}
                        />
                      </div>
                      <div className="col-span-3 md:col-span-3 space-y-1">
                        <Label className="text-xs">Thành tiền</Label>
                        <div className="h-10 px-3 flex items-center bg-background rounded-md border text-sm font-medium">
                          {formatCurrency(ct.thanhTien)}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveChiTiet(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tổng tiền */}
              <div className="flex justify-end pt-4 border-t">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Tổng tiền</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(tongTien)}</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSubmit}>Tạo hóa đơn</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết hóa đơn: {selectedHoaDon?.maHoaDon}</DialogTitle>
          </DialogHeader>
          {selectedHoaDon && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Khách hàng</p>
                  <p className="font-medium">{mockKhachHangs.find(kh => kh._id === selectedHoaDon.khachHangId)?.tenKhachHang}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nhà máy</p>
                  <p className="font-medium">{mockNhaMays.find(nm => nm._id === selectedHoaDon.nhaMayId)?.tenNhaMay}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày giao</p>
                  <p className="font-medium">{formatDate(selectedHoaDon.ngayGiao)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Địa chỉ giao</p>
                  <p className="font-medium">{selectedHoaDon.diaChiGiao}</p>
                </div>
              </div>

              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="hidden sm:table-cell">Kích thước</TableHead>
                      <TableHead className="text-right">SL</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">Đơn giá</TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedHoaDon.chiTiet.map((ct, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{ct.tenSanPham}</TableCell>
                        <TableCell className="hidden sm:table-cell">{ct.kichThuoc}</TableCell>
                        <TableCell className="text-right">{ct.soLuong}</TableCell>
                        <TableCell className="text-right hidden sm:table-cell">{formatCurrency(ct.donGia)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(ct.thanhTien)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Tổng tiền</p>
                  <p className="text-lg font-bold">{formatCurrency(selectedHoaDon.tongTien)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Đã thu</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(selectedHoaDon.daThu)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Còn nợ</p>
                  <p className="text-lg font-bold text-destructive">{formatCurrency(selectedHoaDon.conNo)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HoaDonPage;
