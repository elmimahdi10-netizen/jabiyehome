// components/admin/ImageUploader.tsx — Drag-and-drop multi-image uploader
"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Star, AlertCircle, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export interface UploadedImage {
  id?: string;
  url: string;
  publicId: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  folder?: string;
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 8,
  folder = "Jabiyehome/products",
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<UploadedImage | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch("/api/v1/upload", { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Upload failed");
    }
    const data = await res.json();
    return {
      url: data.url,
      publicId: data.publicId,
      isPrimary: false,
      sortOrder: images.length,
    };
  };

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(files).slice(0, maxImages - images.length);
      if (fileArray.length === 0) return;

      setUploading(true);
      try {
        const results = await Promise.allSettled(fileArray.map(uploadFile));
        const newImages: UploadedImage[] = [];

        for (const result of results) {
          if (result.status === "fulfilled" && result.value) {
            newImages.push(result.value);
          } else if (result.status === "rejected") {
            setError((result.reason as Error).message);
          }
        }

        const updated = [...images, ...newImages];
        // Ensure first image is primary if none set
        if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
          updated[0].isPrimary = true;
        }
        onChange(updated.map((img, i) => ({ ...img, sortOrder: i })));
      } finally {
        setUploading(false);
      }
    },
    [images, maxImages, onChange]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const setPrimary = (index: number) => {
    onChange(images.map((img, i) => ({ ...img, isPrimary: i === index })));
  };

  const removeImage = async (index: number) => {
    const img = images[index];
    // Delete from Cloudinary
    try {
      await fetch("/api/v1/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: img.publicId }),
      });
    } catch {
      // Non-fatal
    }
    const updated = images.filter((_, i) => i !== index).map((img, i) => ({ ...img, sortOrder: i }));
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) updated[0].isPrimary = true;
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      {images.length < maxImages && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 py-10 px-4",
            isDragging
              ? "border-cyan-500 bg-cyan-500/5"
              : "border-border hover:border-cyan-500/50 hover:bg-muted/30"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
            multiple
            className="sr-only"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          ) : (
            <>
              <Upload className="h-8 w-8 mb-3" style={{ color: "var(--color-muted-foreground)" }} />
              <p className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
                Drop images here or click to browse
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-muted-foreground)" }}>
                JPEG, PNG, WebP, AVIF — max 10 MB each — up to {maxImages} images
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div
              key={img.publicId}
              className={cn(
                "relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
                img.isPrimary ? "border-cyan-500" : "border-border"
              )}
            >
              <Image src={img.url} alt={img.altText ?? `Product image ${i + 1}`} fill className="object-cover" sizes="150px" />

              {/* Primary badge */}
              {img.isPrimary && (
                <div className="absolute top-1.5 left-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500 text-[#0a1628]">
                    Primary
                  </span>
                </div>
              )}

              {/* Controls overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.isPrimary && (
                  <button
                    type="button"
                    onClick={() => setPrimary(i)}
                    className="h-8 w-8 rounded-lg bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                    title="Set as primary"
                  >
                    <Star className="h-4 w-4 text-amber-500" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="h-8 w-8 rounded-lg bg-white/90 flex items-center justify-center hover:bg-red-100 transition-colors"
                  title="Remove image"
                >
                  <X className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
