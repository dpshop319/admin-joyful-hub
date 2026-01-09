/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "./axiosClient";

export const dashboardService = {
  tongQuan(params?: {
    range?: "today" | "7d" | "1m" | "1y";
  }): Promise<{ data: any }> {
    return axiosClient.get("/dashboard/tong-quan", {
      params,
    });
  },
};
