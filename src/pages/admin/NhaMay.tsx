/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NhaMay } from "@/types";
import { nhaMayService } from "@/services/nhaMay.service";
import {
  Factory,
  Plus,
  Pencil,
  Trash2,
  Phone,
  MapPin,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { Modal, Form, Popconfirm, message } from "antd";

/* ================================================= */

const NhaMayPage = () => {
  const [nhaMays, setNhaMays] = useState<NhaMay[]>([]);
  const [loading, setLoading] = useState(true);

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<NhaMay | null>(null);
  const [saving, setSaving] = useState(false);

  const [form] = Form.useForm();

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      setLoading(true);
      const res: any = await nhaMayService.danhSach();
      setNhaMays(res.data || []);
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Không thể tải danh sách");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= FORM ================= */
  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setOpenForm(true);
  };

  const openEdit = (nm: NhaMay) => {
    setEditing(nm);
    form.setFieldsValue({
      tenNhaMay: nm.tenNhaMay,
      diaChi: nm.diaChi,
      soDienThoai: nm.soDienThoai,
    });
    setOpenForm(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const res: any = editing
        ? await nhaMayService.capNhat(editing._id, values)
        : await nhaMayService.tao(values);

      message.success(res.message);
      setOpenForm(false);
      loadData();
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error(err?.response?.data?.message || "Không thể lưu");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    try {
      const res: any = await nhaMayService.xoa(id);
      message.success(res.message);
      loadData();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Không thể xóa");
    }
  };

  /* ================= TOGGLE ================= */
  const toggleHopTac = async (nm: NhaMay) => {
    try {
      const res: any = await nhaMayService.toggleHopTac(nm._id);
      message.success(res.message);
      loadData();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Không thể cập nhật");
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen">
        <AdminHeader title="Nhà máy" subtitle="Quản lý danh sách nhà máy" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen">
      <AdminHeader title="Nhà máy" subtitle="Quản lý danh sách nhà máy" />

      <div className="p-4 lg:p-8">
        {/* ACTION BAR */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10">
              <Factory className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">
                {nhaMays.length} nhà máy
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={loadData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm nhà máy
          </Button>
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block admin-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="table-header border-b">
                <th className="px-6 py-4 text-left">Mã</th>
                <th className="px-6 py-4 text-left">Tên</th>
                <th className="px-6 py-4 text-left">Địa chỉ</th>
                <th className="px-6 py-4 text-left">SĐT</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {nhaMays.map((nm) => (
                <tr key={nm._id} className="border-b last:border-0">
                  <td className="px-6 py-4 font-mono">{nm.maNhaMay}</td>
                  <td className="px-6 py-4 font-semibold">{nm.tenNhaMay}</td>
                  <td className="px-6 py-4">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    {nm.diaChi}
                  </td>
                  <td className="px-6 py-4">
                    <Phone className="inline h-4 w-4 mr-1" />
                    {nm.soDienThoai}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Popconfirm
                      title={
                        nm.dangHoatDong
                          ? "Ngừng hợp tác nhà máy này?"
                          : "Hợp tác lại với nhà máy này?"
                      }
                      onConfirm={() => toggleHopTac(nm)}
                    >
                      <button
                        className={
                          nm.dangHoatDong ? "badge-success" : "badge-danger"
                        }
                      >
                        {nm.dangHoatDong ? "Hoạt động" : "Ngừng hợp tác"}
                      </button>
                    </Popconfirm>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(nm)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Popconfirm
                      title="Xác nhận xóa nhà máy?"
                      description="Hành động này không thể hoàn tác"
                      onConfirm={() => handleDelete(nm._id)}
                      disabled={nm.dangHoatDong}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        disabled={nm.dangHoatDong}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Popconfirm>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE CARDS ================= */}
        <div className="md:hidden space-y-3">
          {nhaMays.map((nm) => (
            <div key={nm._id} className="admin-card p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-lg">{nm.tenNhaMay}</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {nm.maNhaMay}
                  </p>
                </div>

                <Popconfirm
                  title={
                    nm.dangHoatDong
                      ? "Ngừng hợp tác nhà máy này?"
                      : "Hợp tác lại với nhà máy này?"
                  }
                  onConfirm={() => toggleHopTac(nm)}
                >
                  <button
                    className={
                      nm.dangHoatDong ? "badge-success" : "badge-danger"
                    }
                  >
                    {nm.dangHoatDong ? "Hoạt động" : "Ngừng"}
                  </button>
                </Popconfirm>
              </div>

              <div className="text-sm space-y-2">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {nm.diaChi}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {nm.soDienThoai}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(nm)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Sửa
                </Button>

                <Popconfirm
                  title="Xóa nhà máy?"
                  onConfirm={() => handleDelete(nm._id)}
                  disabled={nm.dangHoatDong}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    disabled={nm.dangHoatDong}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa
                  </Button>
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= FORM MODAL (ANTD VALIDATE) ================= */}
      <Modal
        open={openForm}
        title={editing ? "Sửa nhà máy" : "Thêm nhà máy"}
        onCancel={() => setOpenForm(false)}
        onOk={handleSave}
        confirmLoading={saving}
        okText={editing ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        destroyOnClose
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="tenNhaMay"
            label="Tên nhà máy"
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="diaChi"
            label="Địa chỉ"
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="soDienThoai"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Không được để trống" },
              {
                pattern: /^[0-9]{9,11}$/,
                message: "Số điện thoại không hợp lệ",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NhaMayPage;
