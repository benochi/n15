"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function Placeholder() {
  const [inputId, setInputId] = useState<number | "">(1);
  const [queryId, setQueryId] = useState<number>(1);
  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);

  const getTodos = async (): Promise<Todo> => {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/todos/${queryId}`);
    return response.data;
  };

  const { data, isLoading, error } = useQuery<Todo, Error>({
    queryKey: ["todos", queryId],
    queryFn: getTodos,
    enabled: triggerFetch && queryId > 0,
  });

  const handleFetchClick = () => {
    setQueryId(Number(inputId));
    setTriggerFetch(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-color-background p-4">
      <h1 className="text-2xl font-semibold mb-6 text-color-primary">Placeholder data example using Tanstack</h1>
      
      <div className="flex space-x-4 mb-6">
        <input
          type="number"
          value={inputId}
          onChange={(e) => setInputId(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="Enter Todo ID"
          className="p-2 border border-black rounded-lg shadow-md"
        />
        <button
          onClick={handleFetchClick}
          className="p-2 bg-color-primary border border-black text-black rounded-lg shadow-md hover:bg-color-primary/80"
        >
          Fetch Todo
        </button>
      </div>
      
      {isLoading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">Error fetching data: {error.message}</p>}
      
      {data ? (
        <div className="mt-6 p-4 border border-black rounded-lg shadow-lg bg-color-background">
          <h2 className="text-xl font-semibold text-color-primary">Todo: {data.title}</h2>
          <p className="text-gray-700">Status: {data.completed ? "Completed" : "Not Completed"}</p>
        </div>
      ) : !data ? (
        <div className="mt-6 p-4 border border-black rounded-lg shadow-lg bg-color-background">
          <h2 className="text-xl font-semibold text-color-primary">No Data</h2>
        </div>
      ) : null}
    </div>
  );
}