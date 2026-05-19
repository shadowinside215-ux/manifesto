import { motion } from "motion/react";
import { Paintbrush, Layout, Home, Trees, Sofa, Ruler, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import UploadModal from "@/components/UploadModal";
import { Button } from "@/components/ui/button";

export default function Services() {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("Residential");

  const services = [
    {
      title: t.services.s1.title,
      desc: t.services.s1.desc,
      icon: Paintbrush,
      category: "Residential",
    },
    {
      title: t.services.s2.title,
      desc: t.services.s2.desc,
      icon: Layout,
      category: "Residential",
    },
    {
      title: t.services.s3.title,
      desc: t.services.s3.desc,
      icon: Home,
      category: "Residential",
    },
    {
      title: t.services.s4.title,
      desc: t.services.s4.desc,
      icon: Trees,
      category: "Landscaping",
    },
    {
      title: t.services.s5.title,
      desc: t.services.s5.desc,
      icon: Sofa,
      category: "Traditional",
    },
    {
      title: t.services.s6.title,
      desc: t.services.s6.desc,
      icon: Ruler,
      category: "Commercial",
    },
  ];

  const openUpload = (category: string) => {
    setUploadCategory(category);
    setIsUploadModalOpen(true);
  };

  return (
    <div className="pt-32 pb-24 px-6">
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        defaultCategory={uploadCategory}
      />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-brand-burgundy font-medium uppercase tracking-[0.3em] text-sm mb-4 block">
            {t.services.tag}
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-brand-brown mb-6">
            {t.services.title}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-12 bg-white border border-gray-100 hover:border-brand-brown transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative"
            >
              <div className="w-16 h-16 bg-brand-brown/5 flex items-center justify-center mb-8 group-hover:bg-brand-burgundy transition-colors duration-500">
                <service.icon className="text-brand-brown group-hover:text-white transition-colors duration-500" size={32} />
              </div>
              <h3 className="text-2xl font-serif text-brand-brown mb-4 group-hover:text-brand-burgundy transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
