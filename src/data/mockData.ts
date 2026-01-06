import { KhachHang, HoaDon, NhaMay, SanPham, ThongKe } from '@/types';

// Mock Khách hàng
export const mockKhachHangs: KhachHang[] = [
  {
    _id: 'kh001',
    maKhachHang: 'KH001',
    tenKhachHang: 'Công ty TNHH Xây Dựng Thành Công',
    soDienThoai: '0901234567',
    diaChi: '123 Nguyễn Văn Linh, Q.7, TP.HCM',
    trangThai: 'HOAT_DONG',
    congNoHienTai: 45000000,
  },
  {
    _id: 'kh002',
    maKhachHang: 'KH002',
    tenKhachHang: 'Anh Nguyễn Văn An',
    soDienThoai: '0912345678',
    diaChi: '456 Lê Lợi, Q.1, TP.HCM',
    trangThai: 'HOAT_DONG',
    congNoHienTai: 28500000,
  },
  {
    _id: 'kh003',
    maKhachHang: 'KH003',
    tenKhachHang: 'Cửa hàng VLXD Phú Thọ',
    soDienThoai: '0923456789',
    diaChi: '789 Cách Mạng Tháng 8, Q.10, TP.HCM',
    trangThai: 'HOAT_DONG',
    congNoHienTai: 0,
  },
  {
    _id: 'kh004',
    maKhachHang: 'KH004',
    tenKhachHang: 'Chị Trần Thị Bình',
    soDienThoai: '0934567890',
    diaChi: '321 Điện Biên Phủ, Q.3, TP.HCM',
    trangThai: 'NGUNG_GIAO_DICH',
    congNoHienTai: 12000000,
  },
];

// Mock Hóa đơn
export const mockHoaDons: HoaDon[] = [
  {
    _id: 'hd001',
    maHoaDon: 'HD20260115-001',
    khachHangId: 'kh001',
    ngayGiao: '2026-01-15',
    tongTien: 25000000,
    daThu: 10000000,
    conNo: 15000000,
    trangThai: 'THU_MOT_PHAN',
  },
  {
    _id: 'hd002',
    maHoaDon: 'HD20260118-002',
    khachHangId: 'kh001',
    ngayGiao: '2026-01-18',
    tongTien: 30000000,
    daThu: 0,
    conNo: 30000000,
    trangThai: 'CHUA_THU',
  },
  {
    _id: 'hd003',
    maHoaDon: 'HD20260110-001',
    khachHangId: 'kh002',
    ngayGiao: '2026-01-10',
    tongTien: 18500000,
    daThu: 0,
    conNo: 18500000,
    trangThai: 'CHUA_THU',
  },
  {
    _id: 'hd004',
    maHoaDon: 'HD20260112-002',
    khachHangId: 'kh002',
    ngayGiao: '2026-01-12',
    tongTien: 10000000,
    daThu: 0,
    conNo: 10000000,
    trangThai: 'CHUA_THU',
  },
  {
    _id: 'hd005',
    maHoaDon: 'HD20260105-001',
    khachHangId: 'kh004',
    ngayGiao: '2026-01-05',
    tongTien: 12000000,
    daThu: 0,
    conNo: 12000000,
    trangThai: 'CHUA_THU',
  },
];

// Mock Nhà máy
export const mockNhaMays: NhaMay[] = [
  {
    _id: 'nm001',
    maNhaMay: 'NM001',
    tenNhaMay: 'Nhà máy Gạch Đồng Tâm',
    diaChi: 'KCN Tân Tạo, Q.Bình Tân, TP.HCM',
    soDienThoai: '0281234567',
    trangThai: 'HOAT_DONG',
  },
  {
    _id: 'nm002',
    maNhaMay: 'NM002',
    tenNhaMay: 'Nhà máy Gạch Prime',
    diaChi: 'KCN Nhơn Trạch, Đồng Nai',
    soDienThoai: '0282345678',
    trangThai: 'HOAT_DONG',
  },
];

// Mock Sản phẩm
export const mockSanPhams: SanPham[] = [
  {
    _id: 'sp001',
    maSanPham: 'SP001',
    tenSanPham: 'Gạch lát nền 60x60 vân đá',
    kichThuoc: '60x60',
    giaBanMacDinh: 185000,
    nhaMayId: 'nm001',
    hienThi: true,
  },
  {
    _id: 'sp002',
    maSanPham: 'SP002',
    tenSanPham: 'Gạch ốp tường 30x60 trắng',
    kichThuoc: '30x60',
    giaBanMacDinh: 145000,
    nhaMayId: 'nm001',
    hienThi: true,
  },
  {
    _id: 'sp003',
    maSanPham: 'SP003',
    tenSanPham: 'Gạch lát nền 80x80 vân gỗ',
    kichThuoc: '80x80',
    giaBanMacDinh: 250000,
    nhaMayId: 'nm002',
    hienThi: true,
  },
];

// Mock Thống kê
export const mockThongKe: ThongKe = {
  tongSanPham: 156,
  tongKhachHang: 89,
  tongHoaDon: 234,
  tongCongNo: 85500000,
};

// Helper function để lấy hóa đơn còn nợ theo khách hàng
export const getHoaDonConNoByKhachHang = (khachHangId: string): HoaDon[] => {
  return mockHoaDons.filter(hd => hd.khachHangId === khachHangId && hd.conNo > 0);
};

// Helper function để lấy khách hàng đang hoạt động
export const getKhachHangHoatDong = (): KhachHang[] => {
  return mockKhachHangs.filter(kh => kh.trangThai === 'HOAT_DONG');
};
