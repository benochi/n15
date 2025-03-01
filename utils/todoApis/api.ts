import axios from "axios";
import { Todo } from "@/types/todo";

export const getTodo = async (id: number): Promise<Todo> => {
  try {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`);
    return response.data;
  } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Failed to fetch todo data: ' + error.message);
      }
      throw new Error('An unknown error occurred while fetching todo data');
  }
};
