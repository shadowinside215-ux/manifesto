import * as React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db, collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, handleFirestoreError, OperationType, setDoc, getDoc, updateDoc } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Upload, Loader2, Image as ImageIcon, Lock, Edit2, Check, X } from "lucide-react";
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

  // Custom login state
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loginError, setLoginError] = React.useState(false);

  // About Photo state
  const [aboutPhotoUrl, setAboutPhotoUrl] = React.useState("");
  const [uploadingAbout, setUploadingAbout] = React.useState(false);
  const [aboutFile, setAboutFile] = React.useState<File | null>(null);
  
  // Edit mode state
  const [editingPhotoId, setEditingPhotoId] = React.useState<string | null>(null);
  const [editingTitle, setEditingTitle] = React.useState("");
  const [savingEdit, setSavingEdit] = React.useState(false);

  // Story Photo state
  const [storyPhotoUrl, setStoryPhotoUrl] = React.useState("");
  const [uploadingStory, setUploadingStory] = React.useState(false);
  const [storyFile, setStoryFile] = React.useState<File | null>(null);

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

    // Fetch current about photo
    const fetchSettings = async () => {
      const aboutDoc = await getDoc(doc(db, "settings", "about"));
      if (aboutDoc.exists()) {
        setAboutPhotoUrl(aboutDoc.data().url);
      }
      const storyDoc = await getDoc(doc(db, "settings", "story"));
      if (storyDoc.exists()) {
        setStoryPhotoUrl(storyDoc.data().url);
      }
    };
    fetchSettings();

    return () => unsubscribe();
  }, [isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (!success) {
      setLoginError(true);
    } else {
      setLoginError(false);
    }
  };

  const uploadToCloudinary = async (fileToUpload: File) => {
    const cloudName = (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration missing. Please check environment variables.");
    }

    const formData = new FormData();
    formData.append("file", fileToUpload);
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
    return data;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !isAdmin || !user) return;

    setUploading(true);
    try {
      const data = await uploadToCloudinary(file);
      
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
      const fileInput = document.getElementById("photo-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

    } catch (error) {
      console.error("Upload failed:", error);
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleAboutPhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutFile || !isAdmin) return;

    setUploadingAbout(true);
    try {
      const data = await uploadToCloudinary(aboutFile);
      
      await setDoc(doc(db, "settings", "about"), {
        url: data.secure_url,
        updatedAt: new Date()
      });

      setAboutPhotoUrl(data.secure_url);
      setAboutFile(null);
      const fileInput = document.getElementById("about-photo-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

    } catch (error) {
      console.error("About photo upload failed:", error);
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploadingAbout(false);
    }
  };

  const handleStoryPhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyFile || !isAdmin) return;

    setUploadingStory(true);
    try {
      const data = await uploadToCloudinary(storyFile);
      
      await setDoc(doc(db, "settings", "story"), {
        url: data.secure_url,
        updatedAt: new Date()
      });

      setStoryPhotoUrl(data.secure_url);
      setStoryFile(null);
      const fileInput = document.getElementById("story-photo-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

    } catch (error) {
      console.error("Story photo upload failed:", error);
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploadingStory(false);
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

  const handleStartEdit = (photo: Photo) => {
    setEditingPhotoId(photo.id);
    setEditingTitle(photo.title);
  };

  const handleCancelEdit = () => {
    setEditingPhotoId(null);
    setEditingTitle("");
  };

  const handleSaveEdit = async (photoId: string) => {
    if (!editingTitle.trim()) return;
    
    setSavingEdit(true);
    try {
      await updateDoc(doc(db, "photos", photoId), {
        title: editingTitle
      });
      setEditingPhotoId(null);
      setEditingTitle("");
    } catch (error) {
      console.error("Failed to update photo title:", error);
      handleFirestoreError(error, OperationType.UPDATE, `photos/${photoId}`);
    } finally {
      setSavingEdit(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-burgundy" size={48} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <Card className="w-full max-w-md rounded-none border-gray-100 shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-burgundy/10 text-brand-burgundy rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl font-serif text-brand-brown mb-2">{t.admin.adminAccess}</h1>
            <p className="text-gray-500">{t.admin.adminP}</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-medium text-gray-500">{t.admin.username}</label>
              <Input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username" 
                className="rounded-none border-gray-200 focus:border-brand-burgundy focus:ring-0" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-medium text-gray-500">{t.admin.password}</label>
              <Input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="rounded-none border-gray-200 focus:border-brand-burgundy focus:ring-0" 
              />
            </div>
            {loginError && (
              <p className="text-red-500 text-sm text-center">{t.admin.invalid}</p>
            )}
            <Button type="submit" className="w-full bg-brand-burgundy hover:bg-brand-burgundy-dark text-white rounded-none py-6 uppercase tracking-widest">
              {t.admin.login}
            </Button>
          </form>
        </Card>
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
          <h1 className="text-4xl md:text-5xl font-serif text-brand-brown">{t.admin.panel}</h1>
          <p className="text-gray-500 mt-2">{t.admin.manage}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={logout} className="border-brand-burgundy text-brand-burgundy rounded-none px-8 py-5">
            {t.admin.signOut}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          {/* About Photo Management */}
          <Card className="rounded-none border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-brand-brown">{t.admin.aboutPhoto}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {aboutPhotoUrl && (
                  <div className="aspect-square bg-gray-100 mb-4">
                    <img src={aboutPhotoUrl} alt="About" className="w-full h-full object-cover" />
                  </div>
                )}
                <form onSubmit={handleAboutPhotoUpload} className="space-y-4">
                  <div className="relative border-2 border-dashed border-gray-200 p-8 text-center hover:border-brand-burgundy transition-colors cursor-pointer">
                    <input 
                      id="about-photo-upload"
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setAboutFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                      <ImageIcon className="text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-500">
                        {aboutFile ? aboutFile.name : t.admin.clickToSelect}
                      </p>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={uploadingAbout || !aboutFile}
                    className="bg-brand-brown hover:bg-brand-brown-dark text-white rounded-none w-full py-6 uppercase tracking-widest"
                  >
                    {uploadingAbout ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Upload className="mr-2" size={18} />
                        {t.admin.changePhoto}
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Story Photo Management */}
          <Card className="rounded-none border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-brand-brown">{t.admin.storyPhoto}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {storyPhotoUrl && (
                  <div className="aspect-[4/5] bg-gray-100 mb-4">
                    <img src={storyPhotoUrl} alt="Story" className="w-full h-full object-cover" />
                  </div>
                )}
                <form onSubmit={handleStoryPhotoUpload} className="space-y-4">
                  <div className="relative border-2 border-dashed border-gray-200 p-8 text-center hover:border-brand-burgundy transition-colors cursor-pointer">
                    <input 
                      id="story-photo-upload"
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setStoryFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                      <ImageIcon className="text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-500">
                        {storyFile ? storyFile.name : t.admin.clickToSelect}
                      </p>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={uploadingStory || !storyFile}
                    className="bg-brand-brown hover:bg-brand-brown-dark text-white rounded-none w-full py-6 uppercase tracking-widest"
                  >
                    {uploadingStory ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Upload className="mr-2" size={18} />
                        {t.admin.changeStoryPhoto}
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Upload Form */}
          <Card className="rounded-none border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-brand-brown">{t.admin.uploadTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-medium text-gray-500">{t.admin.photoTitle}</label>
                  <Input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Modern Villa" 
                    className="rounded-none border-gray-200 focus:border-brand-burgundy focus:ring-0" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-medium text-gray-500">{t.admin.category}</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-200 focus:border-brand-burgundy focus:ring-0 outline-none rounded-none text-sm"
                  >
                    <option value="Residential">{t.portfolio.residential}</option>
                    <option value="Commercial">{t.portfolio.commercial}</option>
                    <option value="Landscaping">{t.portfolio.landscaping}</option>
                    <option value="Traditional">{t.portfolio.traditional}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-medium text-gray-500">{t.admin.imageFile}</label>
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
                        {file ? file.name : t.admin.clickToSelect}
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
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Upload className="mr-2" size={18} />
                      {t.admin.uploadBtn}
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
                    {editingPhotoId === photo.id ? (
                      <div className="w-full space-y-3 px-4">
                        <Input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="bg-white/90 rounded-none border-none text-brand-brown h-10 text-center"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(photo.id);
                            if (e.key === "Escape") handleCancelEdit();
                          }}
                        />
                        <div className="flex justify-center space-x-2">
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            onClick={() => handleSaveEdit(photo.id)}
                            disabled={savingEdit}
                            className="bg-brand-brown hover:bg-brand-burgundy text-white rounded-none h-10 w-10"
                          >
                            {savingEdit ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={handleCancelEdit}
                            className="bg-white/20 hover:bg-white/40 text-white border-white rounded-none h-10 w-10"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 className="text-white font-serif text-lg mb-1">{photo.title}</h4>
                        <p className="text-brand-burgundy text-xs uppercase tracking-widest mb-4">
                          {photo.category === "Residential" ? t.portfolio.residential : 
                          photo.category === "Commercial" ? t.portfolio.commercial : 
                          photo.category === "Landscaping" ? t.portfolio.landscaping : 
                          t.portfolio.traditional}
                        </p>
                        <div className="flex flex-col items-center space-y-3">
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            onClick={() => handleDelete(photo.id)}
                            className="rounded-full h-10 w-10 shadow-lg"
                          >
                            <Trash2 size={18} />
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            onClick={() => handleStartEdit(photo)}
                            className="rounded-full h-10 w-10 bg-white/20 hover:bg-white/40 text-white border-none shadow-lg"
                          >
                            <Edit2 size={18} />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {photos.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100">
                <ImageIcon className="mx-auto text-gray-200 mb-4" size={48} />
                <p className="text-gray-400">{t.admin.noPhotos}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

