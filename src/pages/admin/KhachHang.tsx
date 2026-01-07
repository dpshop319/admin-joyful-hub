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
import { mockKhachHangs } from '@/data/mockData';
import { KhachHang } from '@/types';
import { Users, Plus, Pencil, Trash2, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/format';

const KhachHangPage = () => {
  const { toast } = useToast();
  const [khachHangs, setKhachHangs] = useState<KhachHang[]>(mockKhachHangs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingKhachHang, setEditingKhachHang] = useState<KhachHang | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    maKhachHang: '',
    tenKhachHang: '',
    diaChi: '',
    soDienThoai: '',
  });

  const resetForm = () => {
    setForm({ maKhachHang: '', tenKhachHang: '', diaChi: '', soDienThoai: '' });
    setEditingKhachHang(null);
  };

  const openAddDialog = () => {
    resetForm();
    setForm(prev => ({ ...prev, maKhachHang: `KH${String(khachHangs.length + 1).padStart(3, '0')}` }));
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

  const handleSave = () => {
    if (!form.tenKhachHang.trim()) {
      toast({ variant: 'destructive', title: 'Lỗi', description: 'Vui lòng nhập tên khách hàng' });
      return;
    }

    if (editingKhachHang) {
      setKhachHangs(prev => prev.map(kh => 
        kh._id === editingKhachHang._id 
          ? { ...kh, ...form }
          : kh
      ));
      toast({ title: 'Thành công', description: 'Đã cập nhật khách hàng' });
    } else {
      const newKhachHang: KhachHang = {
        _id: `kh${Date.now()}`,
        ...form,
        trangThai: 'HOAT_DONG',
        congNoHienTai: 0,
      };
      setKhachHangs(prev => [...prev, newKhachHang]);
      toast({ title: 'Thành công', description: 'Đã thêm khách hàng mới' });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deletingId) {
      setKhachHangs(prev => prev.filter(kh => kh._id !== deletingId));
      toast({ title: 'Thành công', description: 'Đã xóa khách hàng' });
    }
    setIsDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const toggleTrangThai = (id: string) => {
    setKhachHangs(prev => prev.map(kh => 
      kh._id === id 
        ? { ...kh, trangThai: kh.trangThai === 'HOAT_DONG' ? 'NGUNG_GIAO_DICH' : 'HOAT_DONG' }
        : kh
    ));
  };

  const filteredKhachHangs = khachHangs.filter(kh =>
    kh.tenKhachHang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kh.maKhachHang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kh.soDienThoai.includes(searchTerm)
  );

  return (
    <div className="min-h-screen">
      <AdminHeader title="Khách hàng" subtitle="Quản lý danh sách khách hàng và công nợ" />

      <div className="p-4 lg:p-6">
        {/* Action bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">{khachHangs.length} khách hàng</span>
            </div>
            <Input
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
          </div>
          <Button onClick={openAddDialog} className="gap-2 w-full sm:w-auto">
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
                  <td className="px-6 py-4 font-medium">{kh.maKhachHang}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{kh.tenKhachHang}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {kh.diaChi}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {kh.soDienThoai}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={kh.congNoHienTai > 0 ? 'font-semibold text-destructive' : 'text-success'}>
                      {formatCurrency(kh.congNoHienTai)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleTrangThai(kh._id)}
                      className={kh.trangThai === 'HOAT_DONG' ? 'badge-success' : 'badge-danger'}
                    >
                      {kh.trangThai === 'HOAT_DONG' ? 'Hoạt động' : 'Ngừng GD'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(kh)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
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
            <div key={kh._id} className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{kh.tenKhachHang}</p>
                  <p className="text-sm text-muted-foreground">{kh.maKhachHang}</p>
                </div>
                <button
                  onClick={() => toggleTrangThai(kh._id)}
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
              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Công nợ</p>
                  <p className={`font-semibold ${kh.congNoHienTai > 0 ? 'text-destructive' : 'text-success'}`}>
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
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>{editingKhachHang ? 'Sửa khách hàng' : 'Thêm khách hàng mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mã khách hàng</label>
              <Input value={form.maKhachHang} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên khách hàng *</label>
              <Input
                value={form.tenKhachHang}
                onChange={(e) => setForm(prev => ({ ...prev, tenKhachHang: e.target.value }))}
                placeholder="Nhập tên khách hàng"
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Địa chỉ</label>
              <Input
                value={form.diaChi}
                onChange={(e) => setForm(prev => ({ ...prev, diaChi: e.target.value }))}
                placeholder="Nhập địa chỉ"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>{editingKhachHang ? 'Cập nhật' : 'Thêm mới'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card">
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
