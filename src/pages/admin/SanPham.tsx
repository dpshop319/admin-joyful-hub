import { useEffect, useState } from 'react';
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
import { SanPham, NhaMay } from '@/types';
import { sanPhamService } from '@/services/sanPham.service';
import { nhaMayService } from '@/services/nhaMay.service';
import { Package, Plus, Pencil, Trash2, Eye, EyeOff, Loader2, RefreshCw, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, parseCurrency, formatNumber } from '@/utils/format';

const SanPhamPage = () => {
  const { toast } = useToast();
  const [sanPhams, setSanPhams] = useState<SanPham[]>([]);
  const [nhaMays, setNhaMays] = useState<NhaMay[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSanPham, setEditingSanPham] = useState<SanPham | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNhaMay, setFilterNhaMay] = useState<string>('all');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    maSanPham: '',
    tenSanPham: '',
    kichThuoc: '',
    giaBanMacDinh: 0,
    nhaMayId: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [spRes, nmRes] = await Promise.all([
        sanPhamService.danhSach(),
        nhaMayService.danhSach()
      ]);
      setSanPhams(spRes.data || []);
      setNhaMays(nmRes.data || []);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Lỗi', description: err || 'Không thể tải danh sách' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({ maSanPham: '', tenSanPham: '', kichThuoc: '', giaBanMacDinh: 0, nhaMayId: '' });
    setEditingSanPham(null);
  };

  const openAddDialog = () => {
    resetForm();
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

  const handleSave = async () => {
    if (!form.tenSanPham.trim()) {
      toast({ variant: 'destructive', title: 'Lỗi', description: 'Vui lòng nhập tên sản phẩm' });
      return;
    }
    if (!form.nhaMayId) {
      toast({ variant: 'destructive', title: 'Lỗi', description: 'Vui lòng chọn nhà máy' });
      return;
    }

    try {
      setSaving(true);
      if (editingSanPham) {
        await sanPhamService.capNhat(editingSanPham._id, form);
        toast({ title: 'Thành công', description: 'Đã cập nhật sản phẩm' });
      } else {
        await sanPhamService.tao(form);
        toast({ title: 'Thành công', description: 'Đã thêm sản phẩm mới' });
      }
      setIsDialogOpen(false);
      resetForm();
      loadData();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Lỗi', description: err || 'Không thể lưu' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await sanPhamService.xoa(deletingId);
      toast({ title: 'Thành công', description: 'Đã xóa sản phẩm' });
      loadData();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Lỗi', description: err || 'Không thể xóa' });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const toggleHienThi = async (sp: SanPham) => {
    try {
      await sanPhamService.hienThi(sp._id, !sp.hienThi);
      loadData();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Lỗi', description: err });
    }
  };

  const getNhaMayName = (nhaMayId: string) => {
    const nm = nhaMays.find(n => n._id === nhaMayId);
    return nm?.tenNhaMay || 'N/A';
  };

  const filteredSanPhams = sanPhams.filter(sp => {
    const matchSearch = sp.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sp.maSanPham.toLowerCase().includes(searchTerm.toLowerCase());
    const matchNhaMay = filterNhaMay === 'all' || sp.nhaMayId === filterNhaMay;
    return matchSearch && matchNhaMay;
  });

  if (loading) {
    return (
      <div className="min-h-screen">
        <AdminHeader title="Sản phẩm" subtitle="Quản lý danh sách gạch và giá bán" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminHeader title="Sản phẩm" subtitle="Quản lý danh sách gạch và giá bán" />

      <div className="p-4 lg:p-8">
        {/* Action bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10">
              <Package className="h-5 w-5 text-success" />
              <span className="font-semibold text-success">{sanPhams.length} sản phẩm</span>
            </div>
            <div className="flex gap-2 flex-1 sm:flex-none">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 sm:w-40"
                />
              </div>
              <Select value={filterNhaMay} onValueChange={setFilterNhaMay}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Nhà máy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {nhaMays.map(nm => (
                    <SelectItem key={nm._id} value={nm._id}>{nm.tenNhaMay}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="icon" onClick={loadData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={openAddDialog} className="gap-2 shadow-lg shadow-primary/25">
            <Plus className="h-4 w-4" />
            Thêm sản phẩm
          </Button>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSanPhams.map((sp, index) => (
            <div 
              key={sp._id} 
              className="admin-card p-5 transition-all hover:shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="px-2 py-1 rounded bg-muted text-xs font-mono">{sp.maSanPham}</span>
                  <h3 className="mt-2 font-bold line-clamp-2 text-lg">{sp.tenSanPham}</h3>
                </div>
                <button
                  onClick={() => toggleHienThi(sp)}
                  className={`rounded-full p-2 transition-colors ${sp.hienThi ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}
                >
                  {sp.hienThi ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Kích thước</span>
                  <span className="font-medium">{sp.kichThuoc}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Nhà máy</span>
                  <span className="font-medium text-right line-clamp-1 max-w-[120px]">{getNhaMayName(sp.nhaMayId)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(sp.giaBanMacDinh)}
                </p>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(sp)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => { setDeletingId(sp._id); setIsDeleteDialogOpen(true); }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSanPhams.length === 0 && (
          <div className="empty-state">
            <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || filterNhaMay !== 'all' ? 'Không tìm thấy kết quả' : 'Chưa có sản phẩm nào'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterNhaMay !== 'all' ? 'Thử tìm kiếm với từ khóa khác' : 'Thêm sản phẩm đầu tiên để bắt đầu'}
            </p>
            {!searchTerm && filterNhaMay === 'all' && (
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm sản phẩm
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{editingSanPham ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên sản phẩm *</label>
              <Input
                value={form.tenSanPham}
                onChange={(e) => setForm(prev => ({ ...prev, tenSanPham: e.target.value }))}
                placeholder="Nhập tên sản phẩm"
                className="h-11"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Kích thước</label>
                <Input
                  value={form.kichThuoc}
                  onChange={(e) => setForm(prev => ({ ...prev, kichThuoc: e.target.value }))}
                  placeholder="VD: 60x60"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Giá bán mặc định</label>
                <Input
                  value={form.giaBanMacDinh > 0 ? formatNumber(form.giaBanMacDinh) : ''}
                  onChange={(e) => setForm(prev => ({ ...prev, giaBanMacDinh: parseCurrency(e.target.value) }))}
                  placeholder="0"
                  className="h-11 text-right"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nhà máy *</label>
              <Select value={form.nhaMayId} onValueChange={(v) => setForm(prev => ({ ...prev, nhaMayId: v }))}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Chọn nhà máy" />
                </SelectTrigger>
                <SelectContent>
                  {nhaMays.filter(nm => nm.trangThai === 'HOAT_DONG').map(nm => (
                    <SelectItem key={nm._id} value={nm._id}>{nm.tenNhaMay}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave} disabled={saving} className="min-w-24">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingSanPham ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
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
