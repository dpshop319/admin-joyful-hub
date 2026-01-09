/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Table,
  Select,
  Tag,
  Card,
  Spin,
  Empty,
  Modal,
  Descriptions,
  Grid,
  DatePicker,
} from "antd";
import AdminHeader from "@/components/admin/AdminHeader";
import { lichSuCongNoService } from "@/services/lichSuCongNo.service";
import { khachHangService } from "@/services/khachHang.service";
import { formatCurrency } from "@/utils/format";

const { Option } = Select;
const { useBreakpoint } = Grid;

/* ======================= CONSTANT ======================= */

const LOAI_PHAT_SINH = [
  { value: "TAO_HOA_DON", label: "Tạo hóa đơn", color: "blue" },
  { value: "THU_TIEN", label: "Thu tiền", color: "green" },
  { value: "TRA_DU", label: "Trả dư / Trả trước", color: "gold" },
  { value: "DIEU_CHINH", label: "Điều chỉnh", color: "red" },
];

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("vi-VN");

/* ======================= COMPONENT ======================= */

const LichSuCongNo = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [khachHangs, setKhachHangs] = useState<any[]>([]);

  const [khachHangId, setKhachHangId] = useState<string>();
  const [loaiPhatSinh, setLoaiPhatSinh] = useState<string>();

  const [openDetail, setOpenDetail] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [ngay, setNgay] = useState<string>();

  /* ======================= API ======================= */

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await lichSuCongNoService.danhSach({
        khachHangId,
        loaiPhatSinh,
        ngay,
      });
      setData(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  const loadKhachHang = async () => {
    const res = await khachHangService.danhSach();
    setKhachHangs(res.data || []);
  };

  useEffect(() => {
    loadKhachHang();
  }, []);

  useEffect(() => {
    loadData();
  }, [khachHangId, loaiPhatSinh, ngay]);

  /* ======================= TABLE ======================= */

  const columns = [
    {
      title: "Thời gian",
      dataIndex: "thoiGian",
      render: formatDateTime,
    },
    {
      title: "Khách hàng",
      render: (_: any, r: any) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.khachHangId?.tenKhachHang}</div>
          <div style={{ fontSize: 12, color: "#888" }}>
            {r.khachHangId?.maKhachHang}
          </div>
        </div>
      ),
    },
    {
      title: "Loại",
      dataIndex: "loaiPhatSinh",
      align: "center" as const,
      render: (v: string) => {
        const item = LOAI_PHAT_SINH.find((i) => i.value === v);
        return <Tag color={item?.color}>{item?.label}</Tag>;
      },
    },
    {
      title: "Số tiền",
      dataIndex: "soTienPhatSinh",
      align: "right" as const,
      render: (v: number) => (
        <span
          style={{
            fontWeight: 600,
            color: v < 0 ? "#dc2626" : "#16a34a",
          }}
        >
          {formatCurrency(Math.abs(v))}
        </span>
      ),
    },
    {
      title: "Dư trước",
      dataIndex: "congNoTruoc",
      align: "right" as const,
      render: formatCurrency,
    },
    {
      title: "Dư sau",
      dataIndex: "congNoSau",
      align: "right" as const,
      render: formatCurrency,
    },
  ];

  /* ======================= HANDLER ======================= */

  const openChiTiet = (record: any) => {
    setSelected(record);
    setOpenDetail(true);
  };

  /* ======================= RENDER ======================= */

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Lịch sử công nợ"
        subtitle="Theo dõi biến động công nợ khách hàng"
      />

      <div style={{ padding: 24 }}>
        {/* FILTER */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <Select
            allowClear
            placeholder="Chọn khách hàng"
            style={{ width: 260 }}
            onChange={setKhachHangId}
          >
            {khachHangs.map((kh) => (
              <Option key={kh._id} value={kh._id}>
                {kh.tenKhachHang}
              </Option>
            ))}
          </Select>
          <DatePicker
            allowClear
            placeholder="Chọn ngày"
            format="DD/MM/YYYY"
            onChange={(d) => setNgay(d ? d.format("YYYY-MM-DD") : undefined)}
          />
          <Select
            allowClear
            placeholder="Loại phát sinh"
            style={{ width: 220 }}
            onChange={setLoaiPhatSinh}
          >
            {LOAI_PHAT_SINH.map((l) => (
              <Option key={l.value} value={l.value}>
                {l.label}
              </Option>
            ))}
          </Select>
        </div>

        {/* DESKTOP */}
        {!isMobile && (
          <Table
            rowKey="_id"
            loading={loading}
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10 }}
            onRow={(record) => ({
              onClick: () => openChiTiet(record),
              style: { cursor: "pointer" },
            })}
          />
        )}

        {/* MOBILE */}
        {isMobile && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {loading && <Spin />}
            {!loading && data.length === 0 && <Empty />}
            {data.map((r) => {
              const loai = LOAI_PHAT_SINH.find(
                (i) => i.value === r.loaiPhatSinh
              );
              return (
                <Card
                  key={r._id}
                  size="small"
                  onClick={() => openChiTiet(r)}
                  style={{ cursor: "pointer" }}
                >
                  <div style={{ fontWeight: 600 }}>
                    {r.khachHangId?.tenKhachHang}
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>
                    {formatDateTime(r.thoiGian)}
                  </div>

                  <Tag color={loai?.color} style={{ marginTop: 6 }}>
                    {loai?.label}
                  </Tag>

                  <div style={{ marginTop: 6 }}>
                    <strong>Số tiền: </strong>
                    <span
                      style={{
                        color: r.soTienPhatSinh < 0 ? "#dc2626" : "#16a34a",
                      }}
                    >
                      {formatCurrency(Math.abs(r.soTienPhatSinh))}
                    </span>
                  </div>

                  <div style={{ fontSize: 13 }}>
                    Dư trước: {formatCurrency(r.congNoTruoc)}
                  </div>
                  <div style={{ fontSize: 13 }}>
                    Dư sau: {formatCurrency(r.congNoSau)}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================= MODAL CHI TIẾT ======================= */}
      <Modal
        open={openDetail}
        title="Chi tiết lịch sử công nợ"
        footer={null}
        onCancel={() => setOpenDetail(false)}
        width={700}
      >
        {selected && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Thời gian">
              {formatDateTime(selected.thoiGian)}
            </Descriptions.Item>

            <Descriptions.Item label="Khách hàng">
              <strong>{selected.khachHangId?.tenKhachHang}</strong>
              <div style={{ fontSize: 12, color: "#888" }}>
                {selected.khachHangId?.maKhachHang} –{" "}
                {selected.khachHangId?.soDienThoai}
              </div>
            </Descriptions.Item>

            <Descriptions.Item label="Loại phát sinh">
              <Tag
                color={
                  LOAI_PHAT_SINH.find((i) => i.value === selected.loaiPhatSinh)
                    ?.color
                }
              >
                {
                  LOAI_PHAT_SINH.find((i) => i.value === selected.loaiPhatSinh)
                    ?.label
                }
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Số tiền phát sinh">
              <span
                style={{
                  fontWeight: 600,
                  color: selected.soTienPhatSinh < 0 ? "#dc2626" : "#16a34a",
                }}
              >
                {formatCurrency(Math.abs(selected.soTienPhatSinh))}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Công nợ trước">
              {formatCurrency(selected.congNoTruoc)}
            </Descriptions.Item>

            <Descriptions.Item label="Công nợ sau">
              {formatCurrency(selected.congNoSau)}
            </Descriptions.Item>

            {selected.phieuThuId && (
              <Descriptions.Item label="Phiếu thu">
                {selected.phieuThuId.maPhieuThu} –{" "}
                {formatCurrency(selected.phieuThuId.soTienThu)}
              </Descriptions.Item>
            )}
            {selected.hoaDonId?.chiTietSanPhams?.length > 0 && (
              <Descriptions.Item label="Sản phẩm">
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  {selected.hoaDonId.chiTietSanPhams.map(
                    (sp: any, index: number) => (
                      <div
                        key={index}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 6,
                          background: "#fafafa",
                          border: "1px solid #f0f0f0",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600 }}>{sp.tenSanPham}</div>
                          <div style={{ fontSize: 12, color: "#888" }}>
                            Kích thước: {sp.kichThuoc}
                          </div>
                        </div>

                        <div
                          style={{
                            fontWeight: 600,
                            color: "#1677ff",
                            whiteSpace: "nowrap",
                          }}
                        >
                          x {sp.soLuong}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </Descriptions.Item>
            )}

            {selected.ghiChu && (
              <Descriptions.Item label="Ghi chú">
                {selected.ghiChu}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default LichSuCongNo;
