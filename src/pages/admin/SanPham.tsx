/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useMemo, useState } from "react";
import ImgCrop from "antd-img-crop";
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
import {
  Modal,
  Form,
  Input as AntInput,
  Select,
  Popconfirm,
  message,
  Upload,
} from "antd";
import { SanPham, NhaMay } from "@/types";
import { sanPhamService } from "@/services/sanPham.service";
import { nhaMayService } from "@/services/nhaMay.service";
import {
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
import { apiUploadImage } from "@/services/uploadPicture.service";
import { sizes } from "@/data/mockData";

const SanPhamPage = () => {
  const [formAnt] = Form.useForm();
  const [sanPhams, setSanPhams] = useState<SanPham[]>([]);
  const [nhaMays, setNhaMays] = useState<NhaMay[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSanPham, setEditingSanPham] = useState<SanPham | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNhaMay, setFilterNhaMay] = useState("all");
  const [saving, setSaving] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [spRes, nmRes] = await Promise.all([
        sanPhamService.danhSach(),
        nhaMayService.danhSach(),
      ]);
      setSanPhams(spRes.data || []);
      setNhaMays(nmRes.data || []);
      setFileList([]);
    } catch (err: any) {
      message.success(err?.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= FILTER ================= */
  const filteredSanPhams = useMemo(() => {
    return sanPhams.filter((sp) => {
      const matchSearch =
        sp.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sp.maSanPham.toLowerCase().includes(searchTerm.toLowerCase());

      const matchNhaMay =
        filterNhaMay === "all" || sp.nhaMayId._id === filterNhaMay;

      return matchSearch && matchNhaMay;
    });
  }, [sanPhams, searchTerm, filterNhaMay]);

  /* ================= MODAL ================= */
  const openAddModal = () => {
    setEditingSanPham(null);
    formAnt.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (sp: SanPham) => {
    setEditingSanPham(sp);

    const files = sp.hinhAnh
      ? [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: sp.hinhAnh,
          },
        ]
      : [];

    setFileList(files); // 🔥 QUAN TRỌNG

    formAnt.setFieldsValue({
      tenSanPham: sp.tenSanPham,
      moTa: sp.moTa,
      kichThuoc: sp.kichThuoc,
      giaBanMacDinh: formatNumber(sp.giaBanMacDinh),
      nhaMayId: sp.nhaMayId._id,
      hinhAnh: files,
    });

    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await formAnt.validateFields();
      setSaving(true);
      const fileList = values.hinhAnh || [];
      let imageUrl = editingSanPham?.hinhAnh || "";
      if (fileList.length && fileList[0].originFileObj) {
        const formData = new FormData();
        formData.append("file", fileList[0].originFileObj);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_REACT_UPLOAD_PRESET
        );
        const uploadRes = await apiUploadImage(formData);
        imageUrl = uploadRes.secure_url || uploadRes.url;
      }
      const payload = {
        tenSanPham: values.tenSanPham,
        moTa: values.moTa,
        kichThuoc: values.kichThuoc,
        giaBanMacDinh: parseCurrency(values.giaBanMacDinh),
        nhaMayId: values.nhaMayId,
        hinhAnh: imageUrl,
      };
      if (editingSanPham) {
        await sanPhamService.capNhat(editingSanPham._id, payload);
        message.success("Đã cập nhật sản phẩm");
      } else {
        await sanPhamService.tao(payload);
        message.success("Đã thêm sản phẩm mới");
      }
      setIsModalOpen(false);
      formAnt.resetFields();
      loadData();
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error(err?.message || "Không thể lưu sản phẩm");
    } finally {
      setSaving(false);
    }
  };

  const toggleHienThi = async (sp: SanPham) => {
    try {
      await sanPhamService.hienThi(sp._id, !sp.hienThi);
      setSanPhams((prev) =>
        prev.map((item) =>
          item._id === sp._id ? { ...item, hienThi: !item.hienThi } : item
        )
      );
      message.success(sp.hienThi ? "Đã ẩn sản phẩm" : "Đã hiển thị sản phẩm");
    } catch (err: any) {
      message.warning(
        err?.response?.data?.message || "Không thể cập nhật trạng thái"
      );
    }
  };

  const handleDelete = async (id: string) => {
    await sanPhamService.xoa(id);
    message.success("Đã xóa sản phẩm");
    loadData();
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen">
      <AdminHeader title="Sản phẩm" subtitle="Quản lý danh sách sản phẩm" />

      <div className="p-4 lg:p-8 space-y-6">
        {/* ===== TOOLBAR ===== */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm tên hoặc mã sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <ShadcnSelect value={filterNhaMay} onValueChange={setFilterNhaMay}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Nhà máy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả nhà máy</SelectItem>
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

          <Button onClick={openAddModal} className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm sản phẩm
          </Button>
        </div>

        {/* ===== LIST ===== */}
        {filteredSanPhams.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            Không có sản phẩm nào
          </div>
        ) : (
          <>
            {/* Desktop / Tablet */}
            <div className="hidden sm:grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredSanPhams.map((sp) => (
                <div key={sp._id} className="admin-card p-4 flex flex-col">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs font-mono text-muted-foreground">
                        {sp.maSanPham}
                      </p>
                      <p className="font-bold">{sp.tenSanPham}</p>
                    </div>

                    <Popconfirm
                      title={sp.hienThi ? "Ẩn sản phẩm?" : "Hiển thị sản phẩm?"}
                      onConfirm={() => toggleHienThi(sp)}
                    >
                      <Button variant="ghost" size="icon">
                        {sp.hienThi ? <Eye /> : <EyeOff />}
                      </Button>
                    </Popconfirm>
                  </div>

                  <div className="mt-3 text-sm text-muted-foreground space-y-1">
                    <div>Kích thước: {sp.kichThuoc}</div>
                    <div>Nhà máy: {sp.nhaMayId.tenNhaMay}</div>
                  </div>

                  <div className="mt-auto pt-4 flex justify-between items-center">
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

            {/* Mobile */}
            <div className="sm:hidden space-y-3">
              {filteredSanPhams.map((sp) => (
                <div key={sp._id} className="admin-card p-4 space-y-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{sp.tenSanPham}</p>
                      <p className="text-xs font-mono text-muted-foreground">
                        {sp.maSanPham}
                      </p>
                    </div>

                    <Popconfirm
                      title={sp.hienThi ? "Ẩn sản phẩm?" : "Hiển thị sản phẩm?"}
                      onConfirm={() => toggleHienThi(sp)}
                    >
                      <Button variant="ghost" size="icon">
                        {sp.hienThi ? <Eye /> : <EyeOff />}
                      </Button>
                    </Popconfirm>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <div>📐 {sp.kichThuoc}</div>
                    <div>🏭 {sp.nhaMayId.tenNhaMay}</div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="font-bold text-primary">
                      {formatCurrency(sp.giaBanMacDinh)}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditModal(sp)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Sửa
                      </Button>

                      <Popconfirm
                        title="Xóa sản phẩm?"
                        onConfirm={() => handleDelete(sp._id)}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Xóa
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ===== MODAL ===== */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title={editingSanPham ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        onOk={handleSave}
        confirmLoading={saving}
        bodyStyle={{ maxHeight: "60vh", overflowY: "auto", paddingRight: 8 }}
      >
        <Form form={formAnt} layout="vertical">
          <Form.Item
            name="tenSanPham"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="moTa"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="kichThuoc"
            label="Kích thước"
            rules={[{ required: true, message: "Vui lòng chọn kích thước" }]}
          >
            <Select placeholder="Chọn kích thước">
              {sizes.map((size) => (
                <Select.Option key={size} value={size}>
                  {size}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="giaBanMacDinh"
            label="Giá bán"
            rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="nhaMayId"
            label="Nhà máy"
            rules={[{ required: true, message: "Vui lòng nhập nhà máy" }]}
          >
            <Select>
              {nhaMays.map((nm) => (
                <Select.Option key={nm._id} value={nm._id}>
                  {nm.tenNhaMay}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="hinhAnh"
            label="Hình ảnh"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
            rules={[{ required: true, message: "Vui lòng chọn hình ảnh" }]}
          >
            <ImgCrop
              rotationSlider
              aspect={1}
              quality={1}
              modalTitle="Cắt hình ảnh"
              modalOk="Xong"
              modalCancel="Hủy"
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                beforeUpload={() => false}
                maxCount={1}
                accept="image/*"
                onChange={({ fileList: newFileList }) => {
                  const cleaned = newFileList.map((file) => {
                    // 🔥 nếu là file mới thì xoá url cũ
                    if (file.originFileObj) {
                      return {
                        ...file,
                        url: undefined,
                        thumbUrl: undefined,
                      };
                    }
                    return file;
                  });
                  setFileList(cleaned);
                  formAnt.setFieldValue("hinhAnh", cleaned);
                }}
              >
                Upload
              </Upload>
            </ImgCrop>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SanPhamPage;
