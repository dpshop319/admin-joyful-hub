import axiosClient from "./axiosClient";

export const dashboardService = {
  tongQuan(): Promise<{ data: any }> {
    return axiosClient.get("/dashboard/tong-quan");
  },
};
