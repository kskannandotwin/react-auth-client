import axios from "./axios";

export interface DataItem {
  id: string;
  name: string;
  content: string;
  visibility: "admin" | "user" | "both";
  createdBy: string;
  createdAt: string;
}

export const fetchDataApi = async (): Promise<DataItem[]> => {
  const response = await axios.get("/data");
  return response.data;
};

export const createDataApi = async (
  data: Omit<DataItem, "id" | "createdAt" | "createdBy">,
  userName: string,
): Promise<DataItem> => {
  const response = await axios.post("/data", {
    ...data,
    userName,
  });
  return response.data;
};
