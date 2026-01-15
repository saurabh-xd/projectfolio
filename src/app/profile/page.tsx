"use client";

import { signOut, useSession } from "next-auth/react";
import { FolderKanban, LogIn, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Project } from "@/types/project";
import ProfileCard from "@/components/profile/profileCard";
import ProjectsCard from "@/components/profile/projectsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [projects, setprojects] = useState<Project[]>([]);
  const [bookmarkedProjects, setBookmarkedProjects] = useState<Project[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  // Image upload states
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: "/" });
      toast("Logout Successful");
    } catch (error) {
      toast.error("Logout failed");
      setIsLoggingOut(false);
    }
  };

  //fetch users projects
  useEffect(() => {
    axios
      .get("/api/user-projects")
      .then((res) => {
        setprojects(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log("error fetching projects", err);
      })
      .finally(() => {
        setLoadingProjects(false);
      });
  }, []);

  // Fetch bookmarked projects
  const fetchBookmarks = () => {
    if (status === "authenticated" && !loadingBookmarks) {
      setLoadingBookmarks(true);
      axios
        .get("/api/bookmarks")
        .then((res) => {
          setBookmarkedProjects(res.data);
        })
        .catch((err) => {
          console.log("error fetching bookmarks", err);
        })
        .finally(() => {
          setLoadingBookmarks(false);
        });
    }
  };

  const handleProjectDeleted = (projectId: string) => {
    // Remove from user projects
    setprojects((prev) => prev.filter((p) => p._id !== projectId));

    // // Remove from all projects (affects bookmarks too)
    // setAllProjects(prev => prev.filter(p => p._id !== projectId));
  };

  //  Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {};
    reader.readAsDataURL(file);

    // Upload to server
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post("/api/user/update-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("API Response:", response.data);

      // Update session with new image
      await update({
        user: {
          ...session?.user,
          userimage: response.data.userimage,
        },
      });

      toast.success("Profile image updated!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <LogIn className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">
            Not Logged In
          </h2>
          <p className="text-muted-foreground">
            Please sign in to view your profile
          </p>
          <Link href="/sign-in">
            <Button className="mt-4">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }
  const avatarLetter =
    session.user?.username?.charAt(0).toUpperCase() ||
    session.user?.email?.charAt(0).toUpperCase() ||
    "U";

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <ProfileCard
          session={session}
          avatarLetter={avatarLetter}
          isUploadingImage={isUploadingImage}
          handleImageUpload={handleImageUpload}
          logout={logout}
          isLoggingOut={isLoggingOut}
        />

        <Tabs
          defaultValue="projects"
          className="w-full"
          onValueChange={(value) => {
            if (value === "bookmarks" && bookmarkedProjects.length === 0) {
              fetchBookmarks();
            }
          }}
        >
          <TabsList className="grid w-full grid-cols-2 ">
            <TabsTrigger value="projects" className="gap-2 cursor-pointer">
              <FolderKanban className="w-4 h-4" />
              Your Projects
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                {projects.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="gap-2 cursor-pointer">
              <Bookmark className="w-4 h-4" />
              Bookmarks
              {bookmarkedProjects.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                  {bookmarkedProjects.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* project tab  */}
          <TabsContent value="projects">
            <ProjectsCard
              projects={projects}
              loading={loadingProjects}
              showDelete={true}
              onProjectDeleted={handleProjectDeleted}
            />
          </TabsContent>

          {/* Bookmarks Tab */}
          <TabsContent value="bookmarks">
            <ProjectsCard
              projects={bookmarkedProjects}
              loading={loadingBookmarks}
              showDelete={false}
              emptyState={{
                icon: (
                  <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                ),
                title: "No bookmarks yet",
                description: "Bookmark projects you want to save for later",
                buttonText: "Explore Projects",
                buttonHref: "/",
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ProfilePage;
