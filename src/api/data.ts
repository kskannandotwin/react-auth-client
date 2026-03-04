export interface DataItem {
  id: string;
  name: string;
  content: string;
  visibility: "admin" | "user" | "both";
  createdBy: string;
  createdAt: string;
}

const STORAGE_KEY = "mock_data_items";

// Initialize with some seed data if empty
const getInitialData = (): DataItem[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);

  const initial: DataItem[] = [
    {
      id: "1",
      name: "Strategic Roadmap",
      content: "Q3 expansion plans into the EU market.",
      visibility: "admin",
      createdBy: "System",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "User Guide",
      content: "Welcome to our platform! Here is how to use it.",
      visibility: "both",
      createdBy: "System",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Personal Notes",
      content: "Draft of my personal bio.",
      visibility: "user",
      createdBy: "System",
      createdAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

export const fetchDataApi = async (): Promise<DataItem[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return getInitialData();
};

export const createDataApi = async (
  data: Omit<DataItem, "id" | "createdAt" | "createdBy">,
  userName: string,
): Promise<DataItem> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const currentItems = getInitialData();
  const newItem: DataItem = {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    createdBy: userName,
  };
  const updatedItems = [...currentItems, newItem];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
  return newItem;
};
