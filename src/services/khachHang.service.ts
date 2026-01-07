import { KhachHang } from "@/types";
import axiosClient from "./axiosClient";

export const khachHangService = {
  danhSach(params?: any): Promise<{ data: KhachHang[] }> {
    return axiosClient.get("/khach-hang", { params });
  },

  tao(payload: Partial<KhachHang>) {
    return axiosClient.post("/khach-hang", payload);
  },

  capNhat(id: string, payload: Partial<KhachHang>) {
    return axiosClient.put(`/khach-hang/${id}`, payload);
  },

  xoa(id: string) {
    return axiosClient.delete(`/khach-hang/${id}`);
  },
};
