import { PhieuThu } from "@/types";
import axiosClient from "./axiosClient";

export const phieuThuService = {
  danhSach(): Promise<{ data: PhieuThu[] }> {
    return axiosClient.get("/phieu-thu");
  },
  tao(payload: Partial<PhieuThu>) {
    return axiosClient.post("/phieu-thu", payload);
  },
};
