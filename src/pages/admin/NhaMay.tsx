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
import { NhaMay } from '@/types';
import { nhaMayService } from '@/services/nhaMay.service';
import { Factory, Plus, Pencil, Trash2, Phone, MapPin, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NhaMayPage = () => {
  const { toast } = useToast();
  const [nhaMays, setNhaMays] = useState<NhaMay[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingNhaMay, setEditingNhaMay] = useState<NhaMay | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    maNhaMay: '',
    tenNhaMay: '',
    diaChi: '',
    soDienThoai: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await nhaMayService.danhSach();
      setNhaMays(res.data || []);
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
    setForm({ maNhaMay: '', tenNhaMay: '', diaChi: '', soDienThoai: '' });
    setEditingNhaMay(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (nhaMay: NhaMay) => {
    setEditingNhaMay(nhaMay);
    setForm({
      maNhaMay: nhaMay.maNhaMay,
      tenNhaMay: nhaMay.tenNhaMay,
      diaChi: nhaMay.diaChi || '',
      soDienThoai: nhaMay.soDienThoai || '',
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.tenNhaMay.trim()) {
      toast({ variant: 'destructive', title: 'Lỗi', description: 'Vui lòng nhập tên nhà máy' });
      return;
    }

    try {
      setSaving(true);
      if (editingNhaMay) {
        await nhaMayService.capNhat(editingNhaMay._id, form);
        toast({ title: 'Thành công', description: 'Đã cập nhật nhà máy' });
      } else {
        await nhaMayService.tao(form);
        toast({ title: 'Thành công', description: 'Đã thêm nhà máy mới' });
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
      await nhaMayService.xoa(deletingId);
      toast({ title: 'Thành công', description: 'Đã xóa nhà máy' });
      loadData();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Lỗi', description: err || 'Không thể xóa' });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const toggleTrangThai = async (nm: NhaMay) => {
    try {
      await nhaMayService.capNhat(nm._id, {
        trangThai: nm.trangThai === 'HOAT_DONG' ? 'NGUNG_HOP_TAC' : 'HOAT_DONG'
      });
      loadData();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Lỗi', description: err });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <AdminHeader title="Nhà máy" subtitle="Quản lý danh sách nhà máy cung cấp gạch" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminHeader title="Nhà máy" subtitle="Quản lý danh sách nhà máy cung cấp gạch" />

      <div className="p-4 lg:p-8">
        {/* Action bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10">
              <Factory className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">{nhaMays.length} nhà máy</span>
            </div>
            <Button variant="ghost" size="icon" onClick={loadData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={openAddDialog} className="gap-2 shadow-lg shadow-primary/25">
            <Plus className="h-4 w-4" />
            Thêm nhà máy
          </Button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block admin-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="table-header border-b border-border">
                <th className="px-6 py-4 text-left">Mã</th>
                <th className="px-6 py-4 text-left">Tên nhà máy</th>
                <th className="px-6 py-4 text-left">Địa chỉ</th>
                <th className="px-6 py-4 text-left">Số điện thoại</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {nhaMays.map((nm) => (
                <tr key={nm._id} className="table-row-hover border-b border-border last:border-0">
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-muted text-sm font-mono">{nm.maNhaMay}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold">{nm.tenNhaMay}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="line-clamp-1">{nm.diaChi}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {nm.soDienThoai}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleTrangThai(nm)}
                      className={nm.trangThai === 'HOAT_DONG' ? 'badge-success' : 'badge-danger'}
                    >
                      {nm.trangThai === 'HOAT_DONG' ? 'Hoạt động' : 'Ngừng hợp tác'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(nm)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => { setDeletingId(nm._id); setIsDeleteDialogOpen(true); }}
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
          {nhaMays.map((nm) => (
            <div key={nm._id} className="admin-card p-4 space-y-3 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-lg">{nm.tenNhaMay}</p>
                  <p className="text-sm text-muted-foreground font-mono">{nm.maNhaMay}</p>
                </div>
                <button
                  onClick={() => toggleTrangThai(nm)}
                  className={nm.trangThai === 'HOAT_DONG' ? 'badge-success' : 'badge-danger'}
                >
                  {nm.trangThai === 'HOAT_DONG' ? 'Hoạt động' : 'Ngừng'}
                </button>
              </div>
              <div className="text-sm space-y-2">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="line-clamp-1">{nm.diaChi}</span>
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {nm.soDienThoai}
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(nm)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => { setDeletingId(nm._id); setIsDeleteDialogOpen(true); }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>

        {nhaMays.length === 0 && (
          <div className="empty-state">
            <Factory className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có nhà máy nào</h3>
            <p className="text-muted-foreground mb-4">Thêm nhà máy đầu tiên để bắt đầu</p>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm nhà máy
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{editingNhaMay ? 'Sửa nhà máy' : 'Thêm nhà máy mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên nhà máy *</label>
              <Input
                value={form.tenNhaMay}
                onChange={(e) => setForm(prev => ({ ...prev, tenNhaMay: e.target.value }))}
                placeholder="Nhập tên nhà máy"
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Số điện thoại</label>
              <Input
                value={form.soDienThoai}
                onChange={(e) => setForm(prev => ({ ...prev, soDienThoai: e.target.value }))}
                placeholder="Nhập số điện thoại"
                className="h-11"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave} disabled={saving} className="min-w-24">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingNhaMay ? 'Cập nhật' : 'Thêm mới'}
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
              Hành động này không thể hoàn tác. Nhà máy sẽ bị xóa vĩnh viễn.
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

export default NhaMayPage;
