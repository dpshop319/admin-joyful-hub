import { SanPham } from "@/types";
import axiosClient from "./axiosClient";

export const sanPhamService = {
  danhSach(params?: any): Promise<{ data: SanPham[] }> {
    return axiosClient.get("/san-pham", { params });
  },
  danhSachCongKhai(params?: any): Promise<{ data: SanPham[] }> {
    return axiosClient.get("/san-pham/cong-khai", { params });
  },
  tao(payload: Partial<SanPham>) {
    return axiosClient.post("/san-pham", payload);
  },
  capNhat(id: string, payload: Partial<SanPham>) {
    return axiosClient.put(`/san-pham/${id}`, payload);
  },
  hienThi(id: string, hienThi: boolean) {
    return axiosClient.patch(`/san-pham/${id}/hien-thi`, { hienThi });
  },
  xoa(id: string) {
    return axiosClient.delete(`/san-pham/${id}`);
  },
};
