import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { db, collection, query, orderBy, onSnapshot, deleteDoc, doc } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import UploadModal from "@/components/UploadModal";
import ConfirmModal from "@/components/ConfirmModal";

interface Photo {
  id: string;
  url: string;
  title: string;
  category: string;
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);

  const categories = ["All", "Residential", "Landscaping", "Kids Bedroom", "Modern", "Traditional"];

  useEffect(() => {
    const q = query(collection(db, "photos"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photoData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Photo[];
      setProjects(photoData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
      console.error("Delete failed:", error);
    }
  };

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="pt-32 pb-24 px-6">
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        defaultCategory={activeCategory === "All" ? "Residential" : activeCategory}
      />
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title={t.admin.delete}
        message={t.admin.confirmDelete}
      />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-brand-burgundy font-medium uppercase tracking-[0.3em] text-sm mb-4 block">
            {t.portfolio.tag}
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-brand-brown mb-10">
            {t.portfolio.title}
          </h1>

          {isAdmin && (
            <div className="flex justify-center mb-10">
              <Button 
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-brand-burgundy hover:bg-brand-burgundy-dark text-white rounded-none px-8 py-6 uppercase tracking-widest"
              >
                <Plus className="mr-2" size={18} /> {t.portfolio.addPhoto}
              </Button>
            </div>
          )}
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-2 text-sm uppercase tracking-widest transition-all duration-300 border ${
                  activeCategory === cat 
                    ? "bg-brand-brown text-white border-brand-brown" 
                    : "bg-transparent text-brand-brown border-gray-200 hover:border-brand-brown"
                }`}
              >
                {cat === "All" ? t.portfolio.all : cat === "Kids Bedroom" ? t.portfolio.kidsBedroom : cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-brand-burgundy border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="group relative aspect-[3/4] overflow-hidden cursor-pointer"
                >
                  <img
                    src={project.url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-brown/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-8 text-center">
                    <span className="text-brand-burgundy text-xs uppercase tracking-[0.3em] mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {project.category === "Kids Bedroom" ? t.portfolio.kidsBedroom : project.category}
                    </span>
                    <h3 className="text-white text-2xl font-serif mb-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                      {project.title}
                    </h3>
                    <div className="w-12 h-px bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-150 mb-6" />
                    
                    {isAdmin && (
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project.id);
                        }}
                        variant="destructive"
                        className="bg-brand-burgundy hover:bg-brand-burgundy-dark text-white rounded-none px-4 py-2 uppercase tracking-widest text-xs transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200"
                      >
                        <Trash2 className="mr-2" size={14} /> {t.admin.delete}
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400">{t.portfolio.noProjects}</p>
          </div>
        )}
      </div>
    </div>
  );
}
