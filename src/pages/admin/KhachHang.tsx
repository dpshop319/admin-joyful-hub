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
import { KhachHang } from '@/types';
import { khachHangService } from '@/services/khachHang.service';
import { Users, Plus, Pencil, Trash2, Phone, MapPin, Loader2, RefreshCw, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/format';

const KhachHangPage = () => {
  const { toast } = useToast();
  const [khachHangs, setKhachHangs] = useState<KhachHang[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingKhachHang, setEditingKhachHang] = useState<KhachHang | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    maKhachHang: '',
    tenKhachHang: '',
    diaChi: '',
    soDienThoai: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await khachHangService.danhSach();
      setKhachHangs(res.data || []);
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
    setForm({ maKhachHang: '', tenKhachHang: '', diaChi: '', soDienThoai: '' });
    setEditingKhachHang(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (kh: KhachHang) => {
    setEditingKhachHang(kh);
    setForm({
      maKhachHang: kh.maKhachHang,
      tenKhachHang: kh.tenKhachHang,
      diaChi: kh.diaChi,
      soDienThoai: kh.soDienThoai,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.tenKhachHang.trim()) {
      toast({ variant: 'destructive', title: 'Lỗi', description: 'Vui lòng nhập tên khách hàng' });
      return;
    }

    try {
      setSaving(true);
      if (editingKhachHang) {
        await khachHangService.capNhat(editingKhachHang._id, form);
        toast({ title: 'Thành công', description: 'Đã cập nhật khách hàng' });
      } else {
        await khachHangService.tao(form);
        toast({ title: 'Thành công', description: 'Đã thêm khách hàng mới' });
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
      await khachHangService.xoa(deletingId);
      toast({ title: 'Thành công', description: 'Đã xóa khách hàng' });
      loadData();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Lỗi', description: err || 'Không thể xóa' });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const toggleTrangThai = async (kh: KhachHang) => {
    try {
      await khachHangService.capNhat(kh._id, {
        trangThai: kh.trangThai === 'HOAT_DONG' ? 'NGUNG_GIAO_DICH' : 'HOAT_DONG'
      });
      loadData();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Lỗi', description: err });
    }
  };

  const filteredKhachHangs = khachHangs.filter(kh =>
    kh.tenKhachHang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kh.maKhachHang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kh.soDienThoai.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-screen">
        <AdminHeader title="Khách hàng" subtitle="Quản lý danh sách khách hàng và công nợ" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminHeader title="Khách hàng" subtitle="Quản lý danh sách khách hàng và công nợ" />

      <div className="p-4 lg:p-8">
        {/* Action bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-info/10">
              <Users className="h-5 w-5 text-info" />
              <span className="font-semibold text-info">{khachHangs.length} khách hàng</span>
            </div>
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={loadData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={openAddDialog} className="gap-2 shadow-lg shadow-primary/25">
            <Plus className="h-4 w-4" />
            Thêm khách hàng
          </Button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block admin-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="table-header border-b border-border">
                <th className="px-6 py-4 text-left">Mã</th>
                <th className="px-6 py-4 text-left">Tên khách hàng</th>
                <th className="px-6 py-4 text-left">Liên hệ</th>
                <th className="px-6 py-4 text-right">Công nợ</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredKhachHangs.map((kh) => (
                <tr key={kh._id} className="table-row-hover border-b border-border last:border-0">
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-muted text-sm font-mono">{kh.maKhachHang}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold">{kh.tenKhachHang}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      <span className="line-clamp-1">{kh.diaChi}</span>
                    </p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {kh.soDienThoai}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-bold text-lg ${kh.congNoHienTai > 0 ? 'text-destructive' : 'text-success'}`}>
                      {formatCurrency(kh.congNoHienTai)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleTrangThai(kh)}
                      className={kh.trangThai === 'HOAT_DONG' ? 'badge-success' : 'badge-danger'}
                    >
                      {kh.trangThai === 'HOAT_DONG' ? 'Hoạt động' : 'Ngừng GD'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(kh)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => { setDeletingId(kh._id); setIsDeleteDialogOpen(true); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredKhachHangs.map((kh) => (
            <div key={kh._id} className="admin-card p-4 space-y-3 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold">{kh.tenKhachHang}</p>
                  <p className="text-sm text-muted-foreground font-mono">{kh.maKhachHang}</p>
                </div>
                <button
                  onClick={() => toggleTrangThai(kh)}
                  className={kh.trangThai === 'HOAT_DONG' ? 'badge-success' : 'badge-danger'}
                >
                  {kh.trangThai === 'HOAT_DONG' ? 'Hoạt động' : 'Ngừng'}
                </button>
              </div>
              <div className="text-sm space-y-1">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {kh.soDienThoai}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">{kh.diaChi}</span>
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Công nợ</p>
                  <p className={`font-bold text-lg ${kh.congNoHienTai > 0 ? 'text-destructive' : 'text-success'}`}>
                    {formatCurrency(kh.congNoHienTai)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(kh)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => { setDeletingId(kh._id); setIsDeleteDialogOpen(true); }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredKhachHangs.length === 0 && (
          <div className="empty-state">
            <Users className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có khách hàng nào'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Thêm khách hàng đầu tiên để bắt đầu'}
            </p>
            {!searchTerm && (
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm khách hàng
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{editingKhachHang ? 'Sửa khách hàng' : 'Thêm khách hàng mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên khách hàng *</label>
              <Input
                value={form.tenKhachHang}
                onChange={(e) => setForm(prev => ({ ...prev, tenKhachHang: e.target.value }))}
                placeholder="Nhập tên khách hàng"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Số điện thoại</label>
              <Input
                value={form.soDienThoai}
                onChange={(e) => setForm(prev => ({ ...prev, soDienThoai: e.target.value }))}
                placeholder="Nhập số điện thoại"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Địa chỉ</label>
              <Input
                value={form.diaChi}
                onChange={(e) => setForm(prev => ({ ...prev, diaChi: e.target.value }))}
                placeholder="Nhập địa chỉ"
                className="h-11"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave} disabled={saving} className="min-w-24">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingKhachHang ? 'Cập nhật' : 'Thêm mới'}
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
              Hành động này không thể hoàn tác. Khách hàng sẽ bị xóa vĩnh viễn.
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

export default KhachHangPage;
