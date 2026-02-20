import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (
    file: File,
    bucket: string = "uploads"
  ): Promise<string | null> => {
    setUploading(true);
    setError(null);

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const filename = `${timestamp}-${random}-${file.name}`;

      // Upload file to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filename, file as unknown as File, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError || !data) {
        setError(uploadError?.message || "Upload failed");
        return null;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return null;
    }

    return uploadFile(file, "uploads");
  };

  const uploadVoice = async (file: File): Promise<string | null> => {
    // Validate file type
    if (!file.type.startsWith("audio/")) {
      setError("Please select an audio file");
      return null;
    }

    return uploadFile(file, "uploads");
  };

  const uploadPDF = async (file: File): Promise<string | null> => {
    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Please select a PDF file");
      return null;
    }

    return uploadFile(file, "uploads");
  };

  return {
    uploadFile,
    uploadImage,
    uploadVoice,
    uploadPDF,
    uploading,
    error,
  };
}
