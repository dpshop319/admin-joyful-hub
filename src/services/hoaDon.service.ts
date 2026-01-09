/* eslint-disable @typescript-eslint/no-explicit-any */
import { HoaDon } from "@/types";
import axiosClient from "./axiosClient";

export const hoaDonService = {
  danhSach(params?: any): Promise<{ data: HoaDon[] }> {
    return axiosClient.get("/hoa-don", { params });
  },
  chiTiet(id: string): Promise<{ data: HoaDon }> {
    return axiosClient.get(`/hoa-don/${id}`);
  },
  tao(payload: Partial<HoaDon> | any) {
    return axiosClient.post("/hoa-don", payload);
  },
};
