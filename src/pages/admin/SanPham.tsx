import { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockSanPhams, mockNhaMays } from '@/data/mockData';
import { SanPham } from '@/types';
import { Package, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, parseCurrency, formatNumber } from '@/utils/format';

const SanPhamPage = () => {
  const { toast } = useToast();
  const [sanPhams, setSanPhams] = useState<SanPham[]>(mockSanPhams);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSanPham, setEditingSanPham] = useState<SanPham | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNhaMay, setFilterNhaMay] = useState<string>('all');

  const [form, setForm] = useState({
    maSanPham: '',
    tenSanPham: '',
    kichThuoc: '',
    giaBanMacDinh: 0,
    nhaMayId: '',
  });

  const resetForm = () => {
    setForm({ maSanPham: '', tenSanPham: '', kichThuoc: '', giaBanMacDinh: 0, nhaMayId: '' });
    setEditingSanPham(null);
  };

  const openAddDialog = () => {
    resetForm();
    setForm(prev => ({ ...prev, maSanPham: `SP${String(sanPhams.length + 1).padStart(3, '0')}` }));
    setIsDialogOpen(true);
  };

  const openEditDialog = (sp: SanPham) => {
    setEditingSanPham(sp);
    setForm({
      maSanPham: sp.maSanPham,
      tenSanPham: sp.tenSanPham,
      kichThuoc: sp.kichThuoc,
      giaBanMacDinh: sp.giaBanMacDinh,
      nhaMayId: sp.nhaMayId,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.tenSanPham.trim()) {
      toast({ variant: 'destructive', title: 'Lỗi', description: 'Vui lòng nhập tên sản phẩm' });
      return;
    }
    if (!form.nhaMayId) {
      toast({ variant: 'destructive', title: 'Lỗi', description: 'Vui lòng chọn nhà máy' });
      return;
    }

    if (editingSanPham) {
      setSanPhams(prev => prev.map(sp => 
        sp._id === editingSanPham._id 
          ? { ...sp, ...form }
          : sp
      ));
      toast({ title: 'Thành công', description: 'Đã cập nhật sản phẩm' });
    } else {
      const newSanPham: SanPham = {
        _id: `sp${Date.now()}`,
        ...form,
        hienThi: true,
      };
      setSanPhams(prev => [...prev, newSanPham]);
      toast({ title: 'Thành công', description: 'Đã thêm sản phẩm mới' });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deletingId) {
      setSanPhams(prev => prev.filter(sp => sp._id !== deletingId));
      toast({ title: 'Thành công', description: 'Đã xóa sản phẩm' });
    }
    setIsDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const toggleHienThi = (id: string) => {
    setSanPhams(prev => prev.map(sp => 
      sp._id === id ? { ...sp, hienThi: !sp.hienThi } : sp
    ));
  };

  const getNhaMayName = (nhaMayId: string) => {
    const nm = mockNhaMays.find(n => n._id === nhaMayId);
    return nm?.tenNhaMay || 'N/A';
  };

  const filteredSanPhams = sanPhams.filter(sp => {
    const matchSearch = sp.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sp.maSanPham.toLowerCase().includes(searchTerm.toLowerCase());
    const matchNhaMay = filterNhaMay === 'all' || sp.nhaMayId === filterNhaMay;
    return matchSearch && matchNhaMay;
  });

  return (
    <div className="min-h-screen">
      <AdminHeader title="Sản phẩm" subtitle="Quản lý danh sách gạch và giá bán" />

      <div className="p-4 lg:p-6">
        {/* Action bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">{sanPhams.length} sản phẩm</span>
            </div>
            <div className="flex gap-2 flex-1 sm:flex-none">
              <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 sm:w-40"
              />
              <Select value={filterNhaMay} onValueChange={setFilterNhaMay}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Nhà máy" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">Tất cả</SelectItem>
                  {mockNhaMays.map(nm => (
                    <SelectItem key={nm._id} value={nm._id}>{nm.tenNhaMay}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={openAddDialog} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Thêm sản phẩm
          </Button>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSanPhams.map((sp) => (
            <div key={sp._id} className="admin-card p-4 transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{sp.maSanPham}</p>
                  <h3 className="mt-1 font-semibold line-clamp-2">{sp.tenSanPham}</h3>
                </div>
                <button
                  onClick={() => toggleHienThi(sp._id)}
                  className={`rounded-full p-1.5 ${sp.hienThi ? 'text-success' : 'text-muted-foreground'}`}
                >
                  {sp.hienThi ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              
              <div className="mt-3 space-y-1">
                <p className="text-sm text-muted-foreground">Kích thước: {sp.kichThuoc}</p>
                <p className="text-sm text-muted-foreground">Nhà máy: {getNhaMayName(sp.nhaMayId)}</p>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <p className="text-lg font-bold text-primary">
                  {formatCurrency(sp.giaBanMacDinh)}
                </p>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(sp)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => { setDeletingId(sp._id); setIsDeleteDialogOpen(true); }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>{editingSanPham ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mã sản phẩm</label>
              <Input value={form.maSanPham} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên sản phẩm *</label>
              <Input
                value={form.tenSanPham}
                onChange={(e) => setForm(prev => ({ ...prev, tenSanPham: e.target.value }))}
                placeholder="Nhập tên sản phẩm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Kích thước</label>
                <Input
                  value={form.kichThuoc}
                  onChange={(e) => setForm(prev => ({ ...prev, kichThuoc: e.target.value }))}
                  placeholder="VD: 60x60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Giá bán mặc định</label>
                <Input
                  value={form.giaBanMacDinh > 0 ? formatNumber(form.giaBanMacDinh) : ''}
                  onChange={(e) => setForm(prev => ({ ...prev, giaBanMacDinh: parseCurrency(e.target.value) }))}
                  placeholder="0"
                  className="text-right"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nhà máy *</label>
              <Select value={form.nhaMayId} onValueChange={(v) => setForm(prev => ({ ...prev, nhaMayId: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhà máy" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {mockNhaMays.filter(nm => nm.trangThai === 'HOAT_DONG').map(nm => (
                    <SelectItem key={nm._id} value={nm._id}>{nm.tenNhaMay}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>{editingSanPham ? 'Cập nhật' : 'Thêm mới'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Sản phẩm sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SanPhamPage;
