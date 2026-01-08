export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export type TrangThaiKhachHang = "HOAT_DONG" | "NGUNG_GIAO_DICH";
export interface KhachHang {
  _id: string;
  maKhachHang: string;
  tenKhachHang: string;
  soDienThoai: string;
  diaChi: string;
  congNoHienTai: number;
  trangThai: TrangThaiKhachHang;
  ngayTao?: string;
  ngayCapNhat?: string;
}

export type TrangThaiNhaMay = "HOAT_DONG" | "NGUNG_HOP_TAC";
export interface NhaMay {
  _id: string;
  maNhaMay: string;
  tenNhaMay: string;
  diaChi: string;
  soDienThoai: string;
  trangThai: TrangThaiNhaMay;
  ngayTao?: string;
}

export interface SanPham {
  _id: string;
  maSanPham: string;
  tenSanPham: string;
  kichThuoc: string;
  giaBanMacDinh: number;
  nhaMayId: string;
  hienThi: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
}

export interface ChiTietHoaDon {
  sanPhamId: string;
  tenSanPham: string;
  kichThuoc: string;
  soLuong: number;
  donGia: number;
  thanhTien: number;
}

export type TrangThaiHoaDon = "CHUA_THU" | "THU_MOT_PHAN" | "DA_THU" | "HUY";
export interface HoaDon {
  _id: string;
  maHoaDon: string;
  ngayLap?: string;
  ngayGiao: string;
  nhaMayId: string;
  khachHangId: string;
  diaChiGiao: string;
  chiTiet: ChiTietHoaDon[];
  tongTien: number;
  daThu: number;
  conNo: number;
  trangThai: TrangThaiHoaDon;
  ghiChu?: string;
  daKhoa?: boolean;
  ngayTao?: string;
  ngayCapNhat?: string;
}

export interface PhanBoHoaDon {
  hoaDonId: string;
  maHoaDon?: string;
  conNo?: number;
  soTienThu: number;
}

export interface PhieuThu {
  _id: string;
  maPhieuThu: string;
  khachHangId: string;
  ngayThu: string;
  soTienThu: number;
  phanBoHoaDons: PhanBoHoaDon[];
  ghiChu?: string;
  ngayTao?: string;
}

export type LoaiPhatSinhCongNo =
  | "TAO_HOA_DON"
  | "THU_TIEN"
  | "TRA_DU"
  | "DIEU_CHINH";
export interface LichSuCongNo {
  _id: string;
  khachHangId: string;
  hoaDonId?: string;
  phieuThuId?: string;
  loaiPhatSinh: LoaiPhatSinhCongNo;
  soTien: number;
  congNoTruoc: number;
  congNoSau: number;
  ghiChu?: string;
  ngayTao: string;
}

export type TrangThaiChuyenCho = "CHO_GIAO" | "DANG_GIAO" | "DA_GIAO";
export interface ChuyenCho {
  _id: string;
  maChuyenCho: string;
  hoaDonId: string;
  nhaMayId: string;
  khachHangId: string;
  ngayChuyen: string;
  diaChiGiao: string;
  chiTiet: ChiTietHoaDon[];
  trangThai: TrangThaiChuyenCho;
  ngayTao?: string;
}

export interface ThongKe {
  tongSanPham: number;
  tongKhachHang: number;
  tongHoaDon: number;
  tongCongNo: number;
}

export interface DashboardTongQuan {
  tongSanPham: number;
  tongKhachHang: number;
  tongNhaMay: number;
  hoaDonThangNay: number;
  tongCongNo: number;
  phanTram: {
    sanPham: number;
    khachHang: number;
    hoaDon: number;
    congNo: number;
  };
  hoaDonCanThu: HoaDonCanThu[];
  khachHangCongNoCao: KhachHangCongNoCao[];
}

export interface HoaDonCanThu {
  _id: string;
  maHoaDon: string;
  ngayGiao: string;
  trangThai: "CHUA_THU" | "THU_MOT_PHAN";
  conNo: number;
}

export interface KhachHangCongNoCao {
  _id: string;
  tenKhachHang: string;
  soDienThoai: string;
  congNoHienTai: number;
}
