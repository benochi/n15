"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const queryClient = useQueryClient();
  const [isChecking, setIsChecking] = useState(true);

  // Fetch user from MongoDB
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await axios.get("/api/user");
      return res.data;
    },
    enabled: !!user?.id, // Only run if user is loaded
    retry: false,
  });

  // Mutation to create user if they don't exist
  const createUserMutation = useMutation({
    mutationFn: async () => {
      await axios.post("/api/user", {
        clerkId: user?.id,
        email: user?.emailAddresses[0]?.emailAddress,
        name: user?.firstName || "Unnamed",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"]}); // Refetch user data
    },
  });

  // On first mount, check if user exists and create them if needed
  useEffect(() => {
    if (!isLoaded || !user) return;

    if (!userProfile && !isLoading) {
      createUserMutation.mutate();
    }
    setIsChecking(false);
  }, [user, userProfile, isLoading, createUserMutation]);

  if (!isLoaded || isChecking) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold mb-4">Welcome, {userProfile?.name || user?.firstName || "No name"}</h1>
      <p className="text-gray-700">Email: {userProfile?.email || user?.emailAddresses[0]?.emailAddress || "No email available"}</p>
      <p className="text-gray-700">Role: {userProfile?.role || "user"}</p>
    </div>
  );
}
