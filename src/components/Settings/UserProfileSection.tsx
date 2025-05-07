// UserProfileSection.jsx
import React, { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { client } from "@/server/AuthContext";
import { updateDisplayName } from "@/server/updateDisplayName";
import { SettingsSection } from "./SettingsSection";
import { Session } from "@heroiclabs/nakama-js";

export const UserProfileSection = ({ session }: { session: Session }) => {
  const [displayName, setDisplayName] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user_ = await client.getAccount(session);
        if (client.getUsers && user_?.user?.username) {
          setDisplayName(user_.user.username);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (session) {
      fetchUser();
    }
  }, [session]);

  const handleUpdateDisplayName = async () => {
    if (!session) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to change your display name.",
        variant: "destructive",
      });
      return;
    }

    if (!displayName.trim()) {
      toast({
        title: "Invalid Name",
        description: "Display name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingName(true);
    try {
      await updateDisplayName(session, displayName);
      toast({
        title: "Display Name Updated",
        description: `Your display name has been changed to "${displayName.trim()}"`,
        variant: "default",
      });
    } catch (error) {
      console.error("Update display name error:", error);
      toast({
        title: "Update Failed",
        description: "Could not update display name. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingName(false);
    }
  };

  return (
    <SettingsSection
      title="User Profile"
      description="Manage your player identity"
    >
      <div className="space-y-4 p-4 bg-white/5 rounded-lg">
        <div className="space-y-2">
          <label
            htmlFor="displayName"
            className="text-gray-200 font-medium block"
          >
            Display Name
          </label>
          <div className="flex gap-2 max-[415px]:flex-col">
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="flex-1 bg-gray-700 text-gray-200 px-2 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter your display name"
            />
            <button
              onClick={handleUpdateDisplayName}
              disabled={isUpdatingName}
              className="py-2 px-2 md:px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
            >
              {isUpdatingName ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Updating...</span>
                </div>
              ) : (
                "Update Name"
              )}
            </button>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};
