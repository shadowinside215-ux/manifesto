import { motion } from "motion/react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
  const { t, isRTL } = useLanguage();

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-burgundy font-medium uppercase tracking-[0.3em] text-sm mb-4 block">
              {t.aboutPage.tag}
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-brand-brown mb-10 leading-tight">
              {t.aboutPage.title} <br /> <span className="italic">{t.aboutPage.titleItalic}</span>
            </h1>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                {t.aboutPage.p1}
              </p>
              <p>
                {t.aboutPage.p2}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1000"
                alt="Studio"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className={cn(
              "absolute -top-10 w-64 h-64 bg-brand-brown/10 -z-10",
              isRTL ? "-left-10" : "-right-10"
            )} />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: t.aboutPage.v1.title,
              desc: t.aboutPage.v1.desc,
            },
            {
              title: t.aboutPage.v2.title,
              desc: t.aboutPage.v2.desc,
            },
            {
              title: t.aboutPage.v3.title,
              desc: t.aboutPage.v3.desc,
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-10 bg-gray-50 border border-gray-100"
            >
              <h3 className="text-2xl font-serif text-brand-brown mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
