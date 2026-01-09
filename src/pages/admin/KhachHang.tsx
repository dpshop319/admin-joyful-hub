/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Table,
  Button as AntButton,
  Modal,
  Form,
  Input,
  message,
  Tag,
  Popconfirm,
  Card,
  Grid,
} from "antd";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { KhachHang } from "@/types";
import { khachHangService } from "@/services/khachHang.service";
import { formatCurrency } from "@/utils/format";
import "antd/dist/reset.css";

const { useBreakpoint } = Grid;

const normalize = (str = "") =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const KhachHangPage = () => {
  const [data, setData] = useState<KhachHang[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<KhachHang | null>(null);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();

  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const loadData = async () => {
    try {
      setLoading(true);
      const res: any = await khachHangService.danhSach();
      setData(res.data || []);
    } catch (err: any) {
      message.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (kh: KhachHang) => {
    setEditing(kh);
    form.setFieldsValue({
      tenKhachHang: kh.tenKhachHang,
      soDienThoai: kh.soDienThoai,
      diaChi: kh.diaChi,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      if (editing) {
        const res: any = await khachHangService.capNhat(editing._id, values);
        message.success(res?.message || "Cập nhật khách hàng thành công");
      } else {
        const res: any = await khachHangService.tao(values);
        message.success(res?.message || "Thêm khách hàng thành công");
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error(err);
    } finally {
      setSaving(false);
    }
  };

  /* ===================== ACTION ===================== */
  const toggleTrangThai = async (kh: KhachHang) => {
    try {
      const res: any = await khachHangService.capNhat(kh._id, {
        trangThai:
          kh.trangThai === "HOAT_DONG" ? "NGUNG_GIAO_DICH" : "HOAT_DONG",
      });
      message.success(res?.message || "Cập nhật trạng thái thành công");
      loadData();
    } catch (err: any) {
      message.error(err);
    }
  };

  /* ===================== SEARCH ===================== */
  const filteredData = data.filter((kh) => {
    const keyword = normalize(search);
    return (
      normalize(kh.tenKhachHang || "").includes(keyword) ||
      normalize(kh.maKhachHang || "").includes(keyword) ||
      kh.soDienThoai?.includes(search)
    );
  });
  const confirmDoiTrangThai = (kh: KhachHang) => {
    toggleTrangThai(kh);
  };

  const columns = [
    {
      title: "Mã",
      dataIndex: "maKhachHang",
      render: (v: string) => <code>{v}</code>,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "tenKhachHang",
    },
    {
      title: "Số điện thoại",
      dataIndex: "soDienThoai",
    },
    {
      title: "Công nợ",
      dataIndex: "congNoHienTai",
      align: "right" as const,
      render: (v: number) => (
        <span style={{ color: v > 0 ? "#dc2626" : "#16a34a", fontWeight: 600 }}>
          {formatCurrency(v)}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      align: "center" as const,
      render: (_: any, kh: KhachHang) => (
        <Popconfirm
          title={
            kh.trangThai === "HOAT_DONG"
              ? "Xác nhận ngừng giao dịch khách hàng này?"
              : "Xác nhận mở lại giao dịch khách hàng?"
          }
          okText="Xác nhận"
          cancelText="Hủy"
          onConfirm={() => confirmDoiTrangThai(kh)}
        >
          <Tag
            color={kh.trangThai === "HOAT_DONG" ? "green" : "red"}
            style={{ cursor: "pointer" }}
          >
            {kh.trangThai === "HOAT_DONG" ? "Hoạt động" : "Ngừng GD"}
          </Tag>
        </Popconfirm>
      ),
    },
    {
      title: "Thao tác",
      align: "center" as const,
      render: (_: any, kh: KhachHang) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <AntButton size="small" onClick={() => openEdit(kh)}>
            <Pencil size={14} />
          </AntButton>

          <Popconfirm
            title="Xác nhận xóa?"
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={async () => {
              try {
                const res: any = await khachHangService.xoa(kh._id);
                message.success(res?.message || "Xóa khách hàng thành công");
                loadData();
              } catch (err: any) {
                message.error(err);
              }
            }}
          >
            <AntButton danger size="small">
              <Trash2 size={14} />
            </AntButton>
          </Popconfirm>
        </div>
      ),
    },
  ];

  /* ===================== RENDER ===================== */
  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Khách hàng"
        subtitle="Quản lý khách hàng và công nợ"
      />

      <div style={{ padding: 24 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <Input.Search
            placeholder="Tìm kiếm..."
            allowClear
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
          />

          <AntButton icon={<RefreshCw size={14} />} onClick={loadData} />

          <AntButton type="primary" icon={<Plus size={14} />} onClick={openAdd}>
            Thêm khách hàng
          </AntButton>
        </div>

        {/* DESKTOP */}
        {!isMobile && (
          <Table
            rowKey="_id"
            loading={loading}
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 10 }}
          />
        )}

        {/* MOBILE */}
        {isMobile && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredData.map((kh) => (
              <Card
                key={kh._id}
                size="small"
                title={
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{kh.tenKhachHang}</div>
                    </div>
                    <Popconfirm
                      title={
                        kh.trangThai === "HOAT_DONG"
                          ? "Xác nhận ngừng giao dịch khách hàng này?"
                          : "Xác nhận mở lại giao dịch khách hàng?"
                      }
                      okText="Xác nhận"
                      cancelText="Hủy"
                      onConfirm={() => toggleTrangThai(kh)}
                    >
                      <Tag
                        color={kh.trangThai === "HOAT_DONG" ? "green" : "red"}
                        style={{ cursor: "pointer" }}
                      >
                        {kh.trangThai === "HOAT_DONG" ? "Hoạt động" : "Ngừng"}
                      </Tag>
                    </Popconfirm>
                  </div>
                }
              >
                <div style={{ lineHeight: 1.8 }}>
                  <div>📞 {kh.soDienThoai || "-"}</div>
                  <div>📍 {kh.diaChi || "-"}</div>
                  <div>
                    <strong>Công nợ: </strong>
                    <span
                      style={{
                        color: kh.congNoHienTai > 0 ? "#dc2626" : "#16a34a",
                      }}
                    >
                      {formatCurrency(kh.congNoHienTai)}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  <AntButton size="small" onClick={() => openEdit(kh)}>
                    <Pencil size={14} />
                  </AntButton>

                  <Popconfirm
                    title="Xác nhận xóa?"
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                    onConfirm={async () => {
                      try {
                        const res: any = await khachHangService.xoa(kh._id);
                        message.success(
                          res?.message || "Xóa khách hàng thành công"
                        );
                        loadData();
                      } catch (err: any) {
                        message.error(err);
                      }
                    }}
                  >
                    <AntButton danger size="small">
                      <Trash2 size={14} />
                    </AntButton>
                  </Popconfirm>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* MODAL FORM */}
      <Modal
        open={isModalOpen}
        title={editing ? "Sửa khách hàng" : "Thêm khách hàng"}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        confirmLoading={saving}
        okText={editing ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên khách hàng"
            name="tenKhachHang"
            rules={[
              { required: true, message: "Vui lòng nhập tên khách hàng" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="soDienThoai"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="diaChi"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KhachHangPage;
