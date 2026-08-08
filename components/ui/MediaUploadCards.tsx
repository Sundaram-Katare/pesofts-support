"use client";

import React, { useRef, useState } from "react";
import { Image as ImageIcon, Video as VideoIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface MediaUploadCardsProps {
  content: string;
  setContent: (val: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const MediaUploadCards: React.FC<MediaUploadCardsProps> = ({
  content,
  setContent,
  textareaRef,
}) => {
  // Image card state
  const [imageUploading, setImageUploading] = useState(false);
  const [imageDragActive, setImageDragActive] = useState(false);
  const [imageStatus, setImageStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Video card state
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoDragActive, setVideoDragActive] = useState(false);
  const [videoStatus, setVideoStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const insertAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent(content + textToInsert);
      return;
    }

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const textBefore = content.substring(0, startPos);
    const textAfter = content.substring(endPos, content.length);

    setContent(textBefore + textToInsert + textAfter);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = startPos + textToInsert.length;
    }, 50);
  };

  const uploadFile = async (
    file: File,
    type: "image" | "video",
    setUploading: (val: boolean) => void,
    setStatus: (val: { type: "success" | "error"; message: string } | null) => void
  ) => {
    setStatus(null);
    setUploading(true);

    try {
      // Validate file size (Image: 5MB, Video: 50MB)
      const maxSize = type === "image" ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error(
          `File size exceeds the limit of ${type === "image" ? "5MB" : "50MB"}.`
        );
      }

      // Generate unique file path
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
      const filePath = `${type}s/${fileName}`;

      // Upload to Supabase bucket 'pesofts-assets'
      const { error } = await supabase.storage
        .from("pesofts-assets")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Retrieve public URL
      const { data: urlData } = supabase.storage
        .from("pesofts-assets")
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error("Failed to retrieve public URL from storage.");
      }

      const publicUrl = urlData.publicUrl;

      // Insert HTML syntax at cursor position
      if (type === "image") {
        const cleanName = file.name.replace(/\.[^/.]+$/, "");
        insertAtCursor(`\n<img src="${publicUrl}" alt="${cleanName}" class="rounded-xl my-4" />\n`);
      } else {
        insertAtCursor(
          `\n<video src="${publicUrl}" controls class="w-full max-h-[400px] rounded-xl my-4"></video>\n`
        );
      }

      setStatus({
        type: "success",
        message: `${file.name} uploaded successfully and inserted at cursor!`,
      });

      // Clear success message after 4 seconds
      setTimeout(() => {
        setStatus(null);
      }, 4000);
    } catch (err: any) {
      console.error(`Upload error for ${type}:`, err);
      setStatus({
        type: "error",
        message: err.message || "An error occurred during file upload.",
      });
    } finally {
      setUploading(false);
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent, type: "image" | "video") => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "image") setImageDragActive(true);
    else setVideoDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent, type: "image" | "video") => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "image") setImageDragActive(false);
    else setVideoDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent, type: "image" | "video") => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "image") {
      setImageDragActive(false);
      if (imageUploading) return;
    } else {
      setVideoDragActive(false);
      if (videoUploading) return;
    }

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Validate type matches drop target
    if (type === "image" && !file.type.startsWith("image/")) {
      setImageStatus({ type: "error", message: "Please drop an image file." });
      return;
    }
    if (type === "video" && !file.type.startsWith("video/")) {
      setVideoStatus({ type: "error", message: "Please drop a video file." });
      return;
    }

    const setUploading = type === "image" ? setImageUploading : setVideoUploading;
    const setStatus = type === "image" ? setImageStatus : setVideoStatus;

    await uploadFile(file, type, setUploading, setStatus);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setUploading = type === "image" ? setImageUploading : setVideoUploading;
    const setStatus = type === "image" ? setImageStatus : setVideoStatus;

    await uploadFile(file, type, setUploading, setStatus);
    
    // Reset file input value to allow selecting same file again
    e.target.value = "";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Image Upload Card */}
      <div
        onClick={() => !imageUploading && imageInputRef.current?.click()}
        onDragOver={(e) => handleDragOver(e, "image")}
        onDragLeave={(e) => handleDragLeave(e, "image")}
        onDrop={(e) => handleDrop(e, "image")}
        className={`relative overflow-hidden group cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all duration-300 min-h-[140px] bg-white shadow-sm ${
          imageDragActive
            ? "border-orange-500 bg-orange-50/20 scale-[1.01]"
            : "border-pesofts-gray-200 hover:border-orange-500/60 hover:-translate-y-0.5 hover:shadow"
        } ${imageUploading ? "opacity-75 pointer-events-none" : ""}`}
      >
        <input
          type="file"
          ref={imageInputRef}
          onChange={(e) => handleFileChange(e, "image")}
          accept="image/*"
          className="hidden"
        />

        {/* Decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-orange-500/[0.01] to-orange-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {imageUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <span className="text-xs font-bold text-pesofts-gray-600">Uploading Image...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-orange-50 rounded-xl group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300">
              <ImageIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-pesofts-gray-800">Upload Image</p>
              <p className="text-[10px] text-pesofts-gray-400 mt-1">
                Drag & drop or click to add image (Max 5MB)
              </p>
            </div>
          </div>
        )}

        {imageStatus && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute bottom-2 left-2 right-2 p-2 rounded-xl flex items-center space-x-2 text-[10px] font-semibold border shadow-sm backdrop-blur-sm transition-all duration-300 animate-fade-in ${
              imageStatus.type === "success"
                ? "bg-emerald-50/90 border-emerald-200 text-emerald-800"
                : "bg-orange-50/90 border-orange-200 text-orange-800"
            }`}
          >
            {imageStatus.type === "success" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            )}
            <span className="truncate flex-grow">{imageStatus.message}</span>
            <button
              onClick={() => setImageStatus(null)}
              className="text-pesofts-gray-400 hover:text-pesofts-gray-600 font-bold px-1 ml-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Video Upload Card */}
      <div
        onClick={() => !videoUploading && videoInputRef.current?.click()}
        onDragOver={(e) => handleDragOver(e, "video")}
        onDragLeave={(e) => handleDragLeave(e, "video")}
        onDrop={(e) => handleDrop(e, "video")}
        className={`relative overflow-hidden group cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all duration-300 min-h-[140px] bg-white shadow-sm ${
          videoDragActive
            ? "border-orange-500 bg-orange-50/20 scale-[1.01]"
            : "border-pesofts-gray-200 hover:border-orange-500/60 hover:-translate-y-0.5 hover:shadow"
        } ${videoUploading ? "opacity-75 pointer-events-none" : ""}`}
      >
        <input
          type="file"
          ref={videoInputRef}
          onChange={(e) => handleFileChange(e, "video")}
          accept="video/*"
          className="hidden"
        />

        {/* Decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-orange-500/[0.01] to-orange-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {videoUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <span className="text-xs font-bold text-pesofts-gray-600">Uploading Video...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-orange-50 rounded-xl group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300">
              <VideoIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-pesofts-gray-800">Upload Video</p>
              <p className="text-[10px] text-pesofts-gray-400 mt-1">
                Drag & drop or click to add video (Max 50MB)
              </p>
            </div>
          </div>
        )}

        {videoStatus && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`absolute bottom-2 left-2 right-2 p-2 rounded-xl flex items-center space-x-2 text-[10px] font-semibold border shadow-sm backdrop-blur-sm transition-all duration-300 animate-fade-in ${
              videoStatus.type === "success"
                ? "bg-emerald-50/90 border-emerald-200 text-emerald-800"
                : "bg-orange-50/90 border-orange-200 text-orange-800"
            }`}
          >
            {videoStatus.type === "success" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            )}
            <span className="truncate flex-grow">{videoStatus.message}</span>
            <button
              onClick={() => setVideoStatus(null)}
              className="text-pesofts-gray-400 hover:text-pesofts-gray-600 font-bold px-1 ml-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
