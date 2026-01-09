/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "./axiosClient";

export interface LichSuCongNoQuery {
  khachHangId: string;
  loaiPhatSinh: "TAO_HOA_DON" | "THU_TIEN" | "TRA_DU" | "DIEU_CHINH" | any;
  ngay: any;
}

export const lichSuCongNoService = {
  danhSach(params?: LichSuCongNoQuery) {
    return axiosClient.get("/lich-su-cong-no", {
      params,
    });
  },
  chiTiet(id: string) {
    return axiosClient.get(`/lich-su-cong-no/${id}`);
  },
};
