import axiosClient from "./axiosClient";

export const chuyenChoService = {
  danhSach(params?: any) {
    return axiosClient.get("/chuyen-cho", { params });
  },
};
