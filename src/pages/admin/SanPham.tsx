/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Modal, Form, Input as AntInput, Select, Popconfirm } from "antd";
import { SanPham, NhaMay } from "@/types";
import { sanPhamService } from "@/services/sanPham.service";
import { nhaMayService } from "@/services/nhaMay.service";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, parseCurrency, formatNumber } from "@/utils/format";

const SanPhamPage = () => {
  const { toast } = useToast();
  const [formAnt] = Form.useForm();

  const [sanPhams, setSanPhams] = useState<SanPham[]>([]);
  const [nhaMays, setNhaMays] = useState<NhaMay[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSanPham, setEditingSanPham] = useState<SanPham | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterNhaMay, setFilterNhaMay] = useState("all");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [spRes, nmRes] = await Promise.all([
        sanPhamService.danhSach(),
        nhaMayService.danhSach(),
      ]);
      setSanPhams(spRes.data || []);
      setNhaMays(nmRes.data || []);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Lỗi", description: err });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingSanPham(null);
    formAnt.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (sp: SanPham) => {
    setEditingSanPham(sp);
    formAnt.setFieldsValue({
      tenSanPham: sp.tenSanPham,
      kichThuoc: sp.kichThuoc,
      giaBanMacDinh: formatNumber(sp.giaBanMacDinh),
      nhaMayId: sp.nhaMayId._id,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await formAnt.validateFields();
      setSaving(true);

      const payload = {
        ...values,
        giaBanMacDinh: parseCurrency(values.giaBanMacDinh),
      };

      if (editingSanPham) {
        await sanPhamService.capNhat(editingSanPham._id, payload);
        toast({ title: "Thành công", description: "Đã cập nhật sản phẩm" });
      } else {
        await sanPhamService.tao(payload);
        toast({ title: "Thành công", description: "Đã thêm sản phẩm mới" });
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      if (err?.errorFields) return;
      toast({ variant: "destructive", title: "Lỗi", description: err });
    } finally {
      setSaving(false);
    }
  };

  const toggleHienThi = async (sp: SanPham) => {
    await sanPhamService.hienThi(sp._id, !sp.hienThi);
    loadData();
  };

  const handleDelete = async (id: string) => {
    await sanPhamService.xoa(id);
    toast({ title: "Thành công", description: "Đã xóa sản phẩm" });
    loadData();
  };

  const filteredSanPhams = sanPhams.filter((sp) => {
    const matchSearch =
      sp.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sp.maSanPham.toLowerCase().includes(searchTerm.toLowerCase());
    const matchNhaMay =
      filterNhaMay === "all" || sp.nhaMayId._id === filterNhaMay;
    return matchSearch && matchNhaMay;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminHeader title="Sản phẩm" subtitle="Quản lý danh sách sản phẩm" />

      <div className="p-6">
        <div className="mb-6 flex gap-4 justify-between">
          <div className="flex gap-2">
            <Input
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <ShadcnSelect value={filterNhaMay} onValueChange={setFilterNhaMay}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Nhà máy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {nhaMays.map((nm) => (
                  <SelectItem key={nm._id} value={nm._id}>
                    {nm.tenNhaMay}
                  </SelectItem>
                ))}
              </SelectContent>
            </ShadcnSelect>

            <Button variant="ghost" size="icon" onClick={loadData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={openAddModal}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm sản phẩm
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSanPhams.map((sp) => (
            <div key={sp._id} className="admin-card p-4">
              <div className="flex justify-between">
                <div>
                  <div className="text-xs font-mono">{sp.maSanPham}</div>
                  <div className="font-bold">{sp.tenSanPham}</div>
                </div>
                <Popconfirm
                  title={sp.hienThi ? "Ẩn sản phẩm?" : "Hiển thị sản phẩm?"}
                  description={
                    sp.hienThi
                      ? "Sản phẩm sẽ không còn hiển thị với khách hàng"
                      : "Sản phẩm sẽ được hiển thị với khách hàng"
                  }
                  okText="Xác nhận"
                  cancelText="Hủy"
                  onConfirm={() => toggleHienThi(sp)}
                >
                  <Button variant="ghost" size="icon">
                    {sp.hienThi ? <Eye /> : <EyeOff />}
                  </Button>
                </Popconfirm>
              </div>

              <div className="mt-2 text-sm">
                <div>Kích thước: {sp.kichThuoc}</div>
                <div>Nhà máy: {sp.nhaMayId.tenNhaMay}</div>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <div className="font-bold text-primary">
                  {formatCurrency(sp.giaBanMacDinh)}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEditModal(sp)}
                  >
                    <Pencil />
                  </Button>

                  <Popconfirm
                    title="Xóa sản phẩm?"
                    description="Hành động này không thể hoàn tác"
                    okText="Xóa"
                    cancelText="Hủy"
                    onConfirm={() => handleDelete(sp._id)}
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                    >
                      <Trash2 />
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title={editingSanPham ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        onOk={handleSave}
        confirmLoading={saving}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={formAnt} layout="vertical">
          <Form.Item
            name="tenSanPham"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="kichThuoc"
            label="Kích thước"
            rules={[{ required: true, message: "Nhập kích thước sản phẩm" }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="giaBanMacDinh"
            label="Giá bán"
            rules={[{ required: true, message: "Nhập giá bán sản phẩm" }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="nhaMayId"
            label="Nhà máy"
            rules={[{ required: true, message: "Chọn nhà máy" }]}
          >
            <Select>
              {nhaMays
                .filter((nm) => nm.dangHoatDong)
                .map((nm) => (
                  <Select.Option key={nm._id} value={nm._id}>
                    {nm.tenNhaMay}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SanPhamPage;
