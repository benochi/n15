import axios from "axios";

export const getTodo = async (id: number) => {
  try {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`);
    return response.data;
  } catch(err){
    throw new Error("Failed to fetch todo data");
  }
};
