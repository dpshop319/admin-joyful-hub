/* eslint-disable @typescript-eslint/no-explicit-any */
import { PhieuThu } from "@/types";
import axiosClient from "./axiosClient";

export const phieuThuService = {
  danhSach(params?: any): Promise<{ data: PhieuThu[] }> {
    return axiosClient.get("/phieu-thu", {
      params,
    });
  },
  tao(payload: Partial<PhieuThu>) {
    return axiosClient.post("/phieu-thu", payload);
  },
};
