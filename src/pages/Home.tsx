import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Quote, Plus, Camera, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { db, collection, query, orderBy, limit, onSnapshot, deleteDoc, doc, setDoc, getDoc } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import UploadModal from "@/components/UploadModal";
import ConfirmModal from "@/components/ConfirmModal";

interface Project {
  id: string;
  title: string;
  url: string;
  category: string;
}

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [aboutImage, setAboutImage] = useState("https://images.unsplash.com/photo-1616486341351-7925b15894ca?auto=format&fit=crop&q=80&w=800");
  const { isAdmin } = useAuth();
  const { t, isRTL } = useLanguage();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("Residential");
  const [isReplacingAbout, setIsReplacingAbout] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);

  const testimonials = [
    {
      name: t.testimonials.t1.name,
      text: t.testimonials.t1.text,
    },
    {
      name: t.testimonials.t2.name,
      text: t.testimonials.t2.text,
    },
    {
      name: t.testimonials.t3.name,
      text: t.testimonials.t3.text,
    },
  ];

  useEffect(() => {
    const q = query(collection(db, "photos"), orderBy("createdAt", "desc"), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setFeaturedProjects(projectData);
    });

    // Fetch site settings for about image
    const unsubSettings = onSnapshot(doc(db, "settings", "home_about_image"), (doc) => {
      if (doc.exists()) {
        setAboutImage(doc.data().value);
      }
    });

    return () => {
      unsubscribe();
      unsubSettings();
    };
  }, []);

  const openUpload = (category: string = "Residential", isReplacing: boolean = false) => {
    setUploadCategory(category);
    setIsReplacingAbout(isReplacing);
    setIsUploadModalOpen(true);
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
      console.error("Delete failed:", error);
    }
  };

  const handleAboutImageUpload = async (url: string) => {
    try {
      await setDoc(doc(db, "settings", "home_about_image"), {
        key: "home_about_image",
        value: url,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Failed to update about image:", error);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        defaultCategory={uploadCategory}
        onUploadSuccess={isReplacingAbout ? handleAboutImageUpload : undefined}
      />
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title={t.admin.delete}
        message={t.admin.confirmDelete}
      />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1920"
            alt="Luxury Interior"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight"
          >
            {t.hero.title} <br /> <span className="italic">{t.hero.titleItalic}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-gray-200 mb-10 font-light tracking-wide"
          >
            {t.hero.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button asChild className="bg-brand-burgundy hover:bg-brand-burgundy-dark text-white rounded-none px-10 py-7 text-lg uppercase tracking-widest">
              <Link to="/contact">{t.hero.cta}</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white opacity-50"
        >
          <div className="w-px h-12 bg-white mx-auto" />
        </motion.div>
      </section>

      {/* About Preview */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-burgundy font-medium uppercase tracking-[0.3em] text-sm mb-4 block">
              {t.about.tag}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-brand-brown mb-8 leading-tight">
              {t.about.title} <br /> {t.about.titleLine2}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              {t.about.p1}
            </p>
            <p className="text-gray-600 leading-relaxed mb-10">
              {t.about.p2}
            </p>
            <Button asChild variant="outline" className="border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white rounded-none px-8 py-6">
              <Link to="/about" className="flex items-center">
                {t.about.cta} <ArrowRight className={cn("ml-2", isRTL && "rotate-180 mr-2 ml-0")} size={18} />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group/about"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={aboutImage}
                alt="Interior Design"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {isAdmin && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/about:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  onClick={() => openUpload("Modern", true)}
                  className="bg-white text-brand-brown hover:bg-brand-burgundy hover:text-white rounded-none border-none"
                >
                  <Camera className="mr-2" size={18} /> Replace Image
                </Button>
              </div>
            )}
            <div className={cn(
              "absolute -bottom-10 bg-brand-brown p-10 hidden md:block",
              isRTL ? "-right-10" : "-left-10"
            )}>
              <p className="text-white text-4xl font-serif mb-2">10+</p>
              <p className="text-gray-300 text-xs uppercase tracking-widest">{t.about.years}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-brand-burgundy font-medium uppercase tracking-[0.3em] text-sm mb-4 block">
                {t.portfolio.tag}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-brown">
                {t.portfolio.title}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Button 
                  onClick={() => openUpload("Residential")}
                  variant="outline" 
                  className="border-brand-burgundy text-brand-burgundy hover:bg-brand-burgundy hover:text-white rounded-none"
                >
                  <Plus className="mr-2" size={18} /> {t.portfolio.addPhoto}
                </Button>
              )}
              <Button asChild variant="link" className="text-brand-brown hover:text-brand-burgundy p-0 h-auto text-lg">
                <Link to="/portfolio" className="flex items-center">
                  {t.portfolio.viewAll} <ArrowRight className={cn("ml-2", isRTL && "rotate-180 mr-2 ml-0")} size={18} />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-6">
                  <img
                    src={project.url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-burgundy/0 group-hover:bg-brand-burgundy/20 transition-colors duration-500" />
                  
                  {isAdmin && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project.id);
                      }}
                      className="absolute top-4 right-4 p-2 bg-white/90 text-brand-burgundy hover:bg-brand-burgundy hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <h3 className="text-xl font-serif text-brand-brown mb-1 group-hover:text-brand-burgundy transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-500 text-sm uppercase tracking-widest">
                  {project.category}
                </p>
              </motion.div>
            ))}
            {featuredProjects.length === 0 && !isAdmin && (
              <p className="text-gray-400 col-span-full text-center py-10 italic">{t.portfolio.noProjects}</p>
            )}
            {featuredProjects.length === 0 && isAdmin && (
              <div className="col-span-full text-center py-10 border-2 border-dashed border-gray-200">
                <p className="text-gray-400 mb-4 italic">{t.portfolio.noProjectsAdmin}</p>
                <Button 
                  onClick={() => openUpload("Residential")}
                  className="bg-brand-burgundy hover:bg-brand-burgundy-dark text-white rounded-none"
                >
                  {t.portfolio.uploadFirst}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-brand-brown text-white overflow-hidden relative">
        <div className={cn(
          "absolute top-0 opacity-5 pointer-events-none",
          isRTL ? "left-0" : "right-0"
        )}>
          <Quote size={400} />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="text-brand-burgundy fill-brand-burgundy mx-0.5" />
              ))}
            </div>
            <h2 className="text-4xl md:text-5xl font-serif mb-4">{t.testimonials.title}</h2>
            <p className="text-gray-400 uppercase tracking-widest text-sm">{t.testimonials.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm p-10 border border-white/10"
              >
                <Quote className="text-brand-burgundy mb-6" size={32} />
                <p className="text-lg italic text-gray-200 mb-8 leading-relaxed">
                  "{t.text}"
                </p>
                <div className="h-px w-12 bg-brand-burgundy mb-4" />
                <p className="font-medium uppercase tracking-widest text-sm">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gray-50 p-16 md:p-24 border border-gray-100"
          >
            <h2 className="text-4xl md:text-6xl font-serif text-brand-brown mb-8 leading-tight">
              {t.cta.title} <br /> {t.cta.titleLine2}
            </h2>
            <p className="text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
              {t.cta.p}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button asChild className="bg-brand-burgundy hover:bg-brand-burgundy-dark text-white rounded-none px-10 py-7 text-lg uppercase tracking-widest w-full sm:w-auto">
                <Link to="/contact">{t.cta.book}</Link>
              </Button>
              <Button asChild variant="outline" className="border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white rounded-none px-10 py-7 text-lg uppercase tracking-widest w-full sm:w-auto">
                <Link to="/portfolio">{t.cta.portfolio}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
