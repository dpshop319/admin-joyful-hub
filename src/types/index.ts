// Khách hàng
export interface KhachHang {
  _id: string;
  maKhachHang: string;
  tenKhachHang: string;
  soDienThoai: string;
  diaChi: string;
  trangThai: 'HOAT_DONG' | 'NGUNG_GIAO_DICH';
  congNoHienTai: number;
}

// Hóa đơn
export interface HoaDon {
  _id: string;
  maHoaDon: string;
  khachHangId: string;
  ngayGiao: string;
  tongTien: number;
  daThu: number;
  conNo: number;
  trangThai: 'CHUA_THU' | 'THU_MOT_PHAN' | 'DA_THU';
}

// Phân bổ tiền thu cho hóa đơn
export interface PhanBoHoaDon {
  hoaDonId: string;
  maHoaDon: string;
  conNo: number;
  soTienThu: number;
}

// Phiếu thu
export interface PhieuThu {
  maPhieuThu: string;
  khachHangId: string;
  ngayThu: string;
  soTienThu: number;
  phanBoHoaDons: PhanBoHoaDon[];
  ghiChu?: string;
}

// Nhà máy
export interface NhaMay {
  _id: string;
  maNhaMay: string;
  tenNhaMay: string;
  diaChi: string;
  soDienThoai: string;
  trangThai: 'HOAT_DONG' | 'NGUNG_HOP_TAC';
}

// Sản phẩm
export interface SanPham {
  _id: string;
  maSanPham: string;
  tenSanPham: string;
  kichThuoc: string;
  giaBanMacDinh: number;
  nhaMayId: string;
  hienThi: boolean;
}

// Thống kê Dashboard
export interface ThongKe {
  tongSanPham: number;
  tongKhachHang: number;
  tongHoaDon: number;
  tongCongNo: number;
}
