"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Dashboard() {
  const { user, isLoaded } = useUser();

  // Fetch only the authenticated user's data
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await axios.get("/api/user"); 
      return res.data;
    },
    enabled: !!user?.id, // Only run if user is loaded
    retry: false,
  });

  if (!isLoaded || isLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold mb-4">
        Welcome, {userProfile?.name || user?.firstName || "No name"}
      </h1>
      <p className="text-gray-700">Email: {userProfile?.email || user?.emailAddresses[0]?.emailAddress || "No email available"}</p>
      <p className="text-gray-700">Role: {userProfile?.role || "user"}</p>
    </div>
  );
}
