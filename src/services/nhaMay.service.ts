import { NhaMay } from "@/types";
import axiosClient from "./axiosClient";

export const nhaMayService = {
  danhSach(): Promise<{ data: NhaMay[] }> {
    return axiosClient.get("/nha-may");
  },

  tao(payload: Partial<NhaMay>) {
    return axiosClient.post("/nha-may", payload);
  },

  capNhat(id: string, payload: Partial<NhaMay>) {
    return axiosClient.put(`/nha-may/${id}`, payload);
  },

  xoa(id: string) {
    return axiosClient.delete(`/nha-may/${id}`);
  },

  ngungHopTac(id: string) {
    return axiosClient.patch(`/nha-may/${id}/ngung`);
  },
};
