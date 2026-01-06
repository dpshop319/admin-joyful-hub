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
import { mockNhaMays } from '@/data/mockData';
import { NhaMay } from '@/types';
import { Factory, Plus, Pencil, Trash2, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NhaMayPage = () => {
  const { toast } = useToast();
  const [nhaMays, setNhaMays] = useState<NhaMay[]>(mockNhaMays);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingNhaMay, setEditingNhaMay] = useState<NhaMay | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    maNhaMay: '',
    tenNhaMay: '',
    diaChi: '',
    soDienThoai: '',
  });

  const resetForm = () => {
    setForm({ maNhaMay: '', tenNhaMay: '', diaChi: '', soDienThoai: '' });
    setEditingNhaMay(null);
  };

  const openAddDialog = () => {
    resetForm();
    setForm(prev => ({ ...prev, maNhaMay: `NM${String(nhaMays.length + 1).padStart(3, '0')}` }));
    setIsDialogOpen(true);
  };

  const openEditDialog = (nhaMay: NhaMay) => {
    setEditingNhaMay(nhaMay);
    setForm({
      maNhaMay: nhaMay.maNhaMay,
      tenNhaMay: nhaMay.tenNhaMay,
      diaChi: nhaMay.diaChi,
      soDienThoai: nhaMay.soDienThoai,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.tenNhaMay.trim()) {
      toast({ variant: 'destructive', title: 'Lỗi', description: 'Vui lòng nhập tên nhà máy' });
      return;
    }

    if (editingNhaMay) {
      setNhaMays(prev => prev.map(nm => 
        nm._id === editingNhaMay._id 
          ? { ...nm, ...form }
          : nm
      ));
      toast({ title: 'Thành công', description: 'Đã cập nhật nhà máy' });
    } else {
      const newNhaMay: NhaMay = {
        _id: `nm${Date.now()}`,
        ...form,
        trangThai: 'HOAT_DONG',
      };
      setNhaMays(prev => [...prev, newNhaMay]);
      toast({ title: 'Thành công', description: 'Đã thêm nhà máy mới' });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deletingId) {
      setNhaMays(prev => prev.filter(nm => nm._id !== deletingId));
      toast({ title: 'Thành công', description: 'Đã xóa nhà máy' });
    }
    setIsDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const toggleTrangThai = (id: string) => {
    setNhaMays(prev => prev.map(nm => 
      nm._id === id 
        ? { ...nm, trangThai: nm.trangThai === 'HOAT_DONG' ? 'NGUNG_HOP_TAC' : 'HOAT_DONG' }
        : nm
    ));
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title="Nhà máy" subtitle="Quản lý danh sách nhà máy cung cấp gạch" />

      <div className="p-6">
        {/* Action bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Factory className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">{nhaMays.length} nhà máy</span>
          </div>
          <Button onClick={openAddDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm nhà máy
          </Button>
        </div>

        {/* Table */}
        <div className="admin-card overflow-hidden">
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
                  <td className="px-6 py-4 font-medium">{nm.maNhaMay}</td>
                  <td className="px-6 py-4 font-medium">{nm.tenNhaMay}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {nm.diaChi}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {nm.soDienThoai}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleTrangThai(nm._id)}
                      className={nm.trangThai === 'HOAT_DONG' ? 'badge-success' : 'badge-danger'}
                    >
                      {nm.trangThai === 'HOAT_DONG' ? 'Hoạt động' : 'Ngừng hợp tác'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(nm)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
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
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>{editingNhaMay ? 'Sửa nhà máy' : 'Thêm nhà máy mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mã nhà máy</label>
              <Input value={form.maNhaMay} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên nhà máy *</label>
              <Input
                value={form.tenNhaMay}
                onChange={(e) => setForm(prev => ({ ...prev, tenNhaMay: e.target.value }))}
                placeholder="Nhập tên nhà máy"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Địa chỉ</label>
              <Input
                value={form.diaChi}
                onChange={(e) => setForm(prev => ({ ...prev, diaChi: e.target.value }))}
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Số điện thoại</label>
              <Input
                value={form.soDienThoai}
                onChange={(e) => setForm(prev => ({ ...prev, soDienThoai: e.target.value }))}
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>{editingNhaMay ? 'Cập nhật' : 'Thêm mới'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card">
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
