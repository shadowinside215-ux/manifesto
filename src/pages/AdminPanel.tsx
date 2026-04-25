import * as React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db, collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, handleFirestoreError, OperationType } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ConfirmModal from "@/components/ConfirmModal";
import { useLanguage } from "@/contexts/LanguageContext";

interface Photo {
  id: string;
  url: string;
  publicId: string;
  title: string;
  category: string;
  createdAt: any;
}

export default function AdminPanel() {
  const { user, isAdmin, loading: authLoading, login, logout } = useAuth();
  const [photos, setPhotos] = React.useState<Photo[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("Residential");
  const [file, setFile] = React.useState<File | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [photoToDelete, setPhotoToDelete] = React.useState<string | null>(null);
  const { t } = useLanguage();

  React.useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, "photos"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photoData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Photo[];
      setPhotos(photoData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "photos");
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setUploading(true);
    try {
      const cloudName = (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET;

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

      await addDoc(collection(db, "photos"), {
        url: data.secure_url,
        publicId: data.public_id,
        title: title || "Untitled",
        category,
        uploadedBy: user.uid,
        createdAt: new Date()
      });

      setFile(null);
      setTitle("");
      // Reset file input
      const fileInput = document.getElementById("photo-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

    } catch (error) {
      console.error("Upload failed:", error);
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setPhotoToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!photoToDelete) return;
    try {
      await deleteDoc(doc(db, "photos", photoToDelete));
      setPhotoToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `photos/${photoToDelete}`);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-burgundy" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-serif text-brand-brown mb-6">Admin Access</h1>
        <p className="text-gray-600 mb-8 max-w-md">Please sign in with your authorized Google account to access the management panel.</p>
        <Button onClick={login} className="bg-brand-burgundy hover:bg-brand-burgundy-dark text-white rounded-none px-10 py-6">
          Sign In with Google
        </Button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-serif text-brand-brown mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">You do not have administrative privileges for this panel.</p>
        <Button asChild variant="outline" className="border-brand-brown text-brand-brown rounded-none">
          <a href="/">Return Home</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title={t.admin.delete}
        message={t.admin.confirmDelete}
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-brand-brown">Admin Panel</h1>
          <p className="text-gray-500 mt-2">Manage your portfolio and project gallery</p>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-600 hidden sm:block">{user.email}</p>
          <Button variant="outline" onClick={logout} className="border-brand-burgundy text-brand-burgundy rounded-none">
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <Card className="rounded-none border-gray-100 shadow-sm sticky top-32">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-brand-brown">Upload New Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-medium text-gray-500">Photo Title</label>
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
                    <option value="Landscaping">Landscaping</option>
                    <option value="Kids Bedroom">Kids Bedroom</option>
                    <option value="Modern">Modern</option>
                    <option value="Traditional">Traditional</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-medium text-gray-500">Image File</label>
                  <div className="relative border-2 border-dashed border-gray-200 p-8 text-center hover:border-brand-burgundy transition-colors cursor-pointer">
                    <input 
                      id="photo-upload"
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                      <ImageIcon className="text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-500">
                        {file ? file.name : "Click to select or drag & drop"}
                      </p>
                    </div>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={uploading || !file}
                  className="bg-brand-burgundy hover:bg-brand-burgundy-dark text-white rounded-none w-full py-6 uppercase tracking-widest"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={18} />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2" size={18} />
                      Upload to Gallery
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Gallery Management */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AnimatePresence>
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative aspect-[4/3] bg-gray-100 overflow-hidden"
                >
                  <img 
                    src={photo.url} 
                    alt={photo.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                    <h4 className="text-white font-serif text-lg mb-1">{photo.title}</h4>
                    <p className="text-brand-burgundy text-xs uppercase tracking-widest mb-4">{photo.category === "Kids Bedroom" ? t.portfolio.kidsBedroom : photo.category}</p>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => handleDelete(photo.id)}
                      className="rounded-full h-10 w-10"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {photos.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100">
                <ImageIcon className="mx-auto text-gray-200 mb-4" size={48} />
                <p className="text-gray-400">No photos in the gallery yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
