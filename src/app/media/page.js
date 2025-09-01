"use client";

import { useRef, useEffect, useState } from "react";
import VideoCard from "@/components/videoCard";
import ImageCard from "@/components/ImageCard";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import NewsFeed from "@/components/glacialNews";
import axios from "axios";

export default function MediaPage() {
  const contentRef = useRef(null);
  const newsRef = useRef(null);

  const [blogs, setBlogs] = useState([]);
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL; 

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Fetch blogs from backend
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${backendURL}/getBlog`);
      setBlogs(res.data.blogs);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <main className="w-full text-glacier-dark overflow-x-hidden font-cabin">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[50vh] w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover"
          src="https://raw.githubusercontent.com/Adarsh108-tech/glacier-assets/main/AnuragMaloo.mp4"
        />
        <div className="absolute inset-0 bg-glacier-dark bg-opacity-60 flex flex-col items-center justify-center text-white text-center p-6">
          <h1 className="text-4xl sm:text-5xl font-nohemi mb-6">
            Save glaciers, save our future.
          </h1>
        </div>
      </section>

      {/* Our Content (Dynamic Blogs) */}
      <section
        ref={contentRef}
        className="py-20 px-6 md:px-20 bg-glacier-light"
      >

        {blogs.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-center text-gray-500">No blogs available yet.</p>
            <div className="h-10 w-10 border-4 border-glacier-dark border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) =>
              blog.mediaType === "video" ? (
                <VideoCard
                  key={blog._id}
                  videoSrc={blog.mediaUrl}
                  heading={blog.title}
                  description={blog.description}
                />
              ) : (
                <ImageCard
                  key={blog._id}
                  imageSrc={blog.mediaUrl}
                  heading={blog.title}
                  description={blog.description}
                />
              )
            )}
          </div>
        )}
      </section>

      {/* Glacier News Section */}
      <NewsFeed />
      <Footer />
    </main>
  );
}
