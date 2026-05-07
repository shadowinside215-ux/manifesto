import * as React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db, collection, addDoc, handleFirestoreError, OperationType, updateDoc, doc } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
  onUploadSuccess?: (url: string) => Promise<void>;
  editId?: string | null;
  initialTitle?: string;
}

export default function UploadModal({ 
  isOpen, 
  onClose, 
  defaultCategory = "Residential", 
  onUploadSuccess,
  editId = null,
  initialTitle = ""
}: UploadModalProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = React.useState(false);
  const [title, setTitle] = React.useState(initialTitle);
  const [category, setCategory] = React.useState(defaultCategory);
  const [file, setFile] = React.useState<File | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const [cloudinaryConfig, setCloudinaryConfig] = React.useState<{ cloudName: string; uploadPreset: string } | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setCategory(defaultCategory);
      setTitle(initialTitle);
      setFile(null);
      
      // Fetch Cloudinary config from server
      const fetchCloudinaryConfig = async () => {
        try {
          const response = await fetch(`/api/config?t=${Date.now()}`);
          const data = await response.json();
          if (data.cloudinaryCloudName && data.cloudinaryCloudName !== "NOT_SET" && 
              data.cloudinaryUploadPreset && data.cloudinaryUploadPreset !== "NOT_SET") {
            setCloudinaryConfig({
              cloudName: data.cloudinaryCloudName,
              uploadPreset: data.cloudinaryUploadPreset
            });
          }
        } catch (error) {
          console.error("Failed to fetch Cloudinary config in Modal:", error);
        }
      };
      fetchCloudinaryConfig();
    }
  }, [isOpen, defaultCategory]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!file && !editId) return;

    setUploading(true);
    try {
      let finalUrl = "";
      let finalPublicId = "";

      if (file) {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || cloudinaryConfig?.cloudName;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || cloudinaryConfig?.uploadPreset;

        if (!cloudName || !uploadPreset) {
          throw new Error("Cloudinary configuration missing. Please check environment variables.");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        
        finalUrl = data.secure_url;
        finalPublicId = data.public_id;
      }

      if (onUploadSuccess && finalUrl) {
        await onUploadSuccess(finalUrl);
      } else if (editId) {
        const updateData: any = {
          title: title || "Untitled",
          category,
          updatedAt: new Date()
        };
        if (finalUrl) {
          updateData.url = finalUrl;
          updateData.publicId = finalPublicId;
        }
        await updateDoc(doc(db, "photos", editId), updateData);
      } else {
        await addDoc(collection(db, "photos"), {
          url: finalUrl,
          publicId: finalPublicId,
          title: title || "Untitled",
          category,
          uploadedBy: user.uid,
          createdAt: new Date(),
          order: Date.now() // Initial order
        });
      }

      setFile(null);
      setTitle("");
      onClose();

    } catch (error) {
      console.error("Upload failed:", error);
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-none shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-serif text-brand-brown">
                {editId ? "Edit Photo" : "Add to Portfolio"}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-brand-burgundy transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-medium text-gray-500">Project Title</label>
                <Input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modern Villa Living Room" 
                  className="rounded-none border-gray-200 focus:border-brand-burgundy focus:ring-0" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-medium text-gray-500">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 focus:border-brand-burgundy focus:ring-0 outline-none rounded-none text-sm"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Landscaping">Landscaping</option>
                  <option value="Traditional">Traditional</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-medium text-gray-500">
                  {editId ? "Replace Image (Optional)" : "Image File"}
                </label>
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
                    dragActive ? "border-brand-burgundy bg-brand-burgundy/5" : "border-gray-200 hover:border-brand-burgundy"
                  }`}
                >
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <ImageIcon className={dragActive ? "text-brand-burgundy" : "text-gray-400"} size={32} />
                    <p className="text-sm text-gray-500 mt-2">
                      {file ? file.name : (dragActive ? "Drop file here" : "Click to select or drag & drop")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-gray-200 text-gray-600 rounded-none py-6"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={uploading || (!file && !editId)}
                  className="flex-[2] bg-brand-burgundy hover:bg-brand-burgundy-dark text-white rounded-none py-6 uppercase tracking-widest"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={18} />
                      {editId ? "Saving..." : "Uploading..."}
                    </>
                  ) : (
                    <>
                      {editId ? <ImageIcon className="mr-2" size={18} /> : <Upload className="mr-2" size={18} />}
                      {editId ? "Save Changes" : "Upload Photo"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
