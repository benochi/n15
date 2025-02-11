import axios from "axios";

export const getTodo = async (id: number) => {
  const response = await axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`);
  return response.data;
};
