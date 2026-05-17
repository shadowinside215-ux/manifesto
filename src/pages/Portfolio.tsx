import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { db, collection, query, orderBy, onSnapshot, deleteDoc, doc, writeBatch } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Move } from "lucide-react";
import UploadModal from "@/components/UploadModal";
import ConfirmModal from "@/components/ConfirmModal";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Photo {
  id: string;
  url: string;
  title: string;
  category: string;
  order?: number;
  createdAt?: any;
}

interface SortablePhotoProps {
  project: Photo;
  t: any;
  handleDelete: (id: string) => void;
  handleEdit: (project: Photo) => void;
  key?: any; 
}

function SortablePhoto({ 
  project, 
  t, 
  handleDelete, 
  handleEdit 
}: SortablePhotoProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative aspect-[3/4] overflow-hidden cursor-pointer"
    >
      <img
        src={project.url}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-end p-6 text-center bg-gradient-to-t from-black/60 to-transparent">
        {project.title && project.title !== "Untitled" && (
          <h3 className="text-white text-xl font-serif transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
            {project.title}
          </h3>
        )}
        <span className="text-white/80 text-[10px] uppercase tracking-[0.2em] mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          {project.category}
        </span>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("Residential");
  const [projects, setProjects] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Photo | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);

  const categories = ["Residential", "Commercial", "Landscaping", "Traditional"];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // We fetch all photos and sort them in memory to handle legacy docs without 'order'
    const q = query(collection(db, "photos"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photoData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Photo[];
      
      // Sort by order asc, then by createdAt desc for legacy
      const sortedData = [...photoData].sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        if (a.order !== undefined) return -1;
        if (b.order !== undefined) return 1;
        
        // Fallback to createdAt
        const dateA = a.createdAt?.toDate?.()?.getTime() || 0;
        const dateB = b.createdAt?.toDate?.()?.getTime() || 0;
        return dateB - dateA;
      });

      setProjects(sortedData);
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

  const handleEdit = (photo: Photo) => {
    setEditingProject(photo);
    setIsUploadModalOpen(true);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeId = active.id;
      const overId = over.id;
      
      const filteredItems = projects.filter(p => p.category === activeCategory);
      const oldIndex = filteredItems.findIndex(item => item.id === activeId);
      const newIndex = filteredItems.findIndex(item => item.id === overId);

      const newFilteredItems = arrayMove(filteredItems, oldIndex, newIndex) as Photo[];
      
      // Update local state immediately for smooth UI
      const otherCategories = projects.filter(p => p.category !== activeCategory);
      setProjects([...otherCategories, ...newFilteredItems].sort((a, b) => (a.order || 0) - (b.order || 0)));

      // Update Firestore in batch
      try {
        const batch = writeBatch(db);
        newFilteredItems.forEach((item, index) => {
          batch.update(doc(db, "photos", item.id), {
            order: index
          });
        });
        await batch.commit();
      } catch (error) {
        console.error("Failed to update order:", error);
      }
    }
  };

  const filteredProjects = projects.filter(p => p.category === activeCategory);

  return (
    <div className="pt-32 pb-24 px-6">
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => {
          setIsUploadModalOpen(false);
          setEditingProject(null);
        }} 
        defaultCategory={editingProject?.category || activeCategory}
        editId={editingProject?.id}
        initialTitle={editingProject?.title}
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
                {cat === "Commercial" ? t.portfolio.commercial : cat === "Residential" ? t.portfolio.residential : cat === "Landscaping" ? t.portfolio.landscaping : t.portfolio.traditional}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-brand-burgundy border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <SortableContext
                items={filteredProjects.map(p => p.id)}
                strategy={rectSortingStrategy}
              >
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                      }}
                      layout
                    >
                      <SortablePhoto 
                        project={project}
                        t={t}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </SortableContext>
            </motion.div>
          </DndContext>
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
