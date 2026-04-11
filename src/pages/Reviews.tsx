import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Reviews() {
  const { t, isRTL } = useLanguage();

  const reviews = [
    {
      name: t.reviewsPage.r1.name,
      role: t.reviewsPage.r1.role,
      text: t.reviewsPage.r1.text,
      rating: 5,
    },
    {
      name: t.reviewsPage.r2.name,
      role: t.reviewsPage.r2.role,
      text: t.reviewsPage.r2.text,
      rating: 5,
    },
    {
      name: t.reviewsPage.r3.name,
      role: t.reviewsPage.r3.role,
      text: t.reviewsPage.r3.text,
      rating: 5,
    },
    {
      name: t.reviewsPage.r4.name,
      role: t.reviewsPage.r4.role,
      text: t.reviewsPage.r4.text,
      rating: 5,
    },
    {
      name: t.reviewsPage.r5.name,
      role: t.reviewsPage.r5.role,
      text: t.reviewsPage.r5.text,
      rating: 5,
    },
  ];

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-brand-burgundy font-medium uppercase tracking-[0.3em] text-sm mb-4 block">
            {t.reviewsPage.tag}
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-brand-brown mb-6">
            {t.reviewsPage.title}
          </h1>
          <div className={cn("flex items-center justify-center mb-4", isRTL ? "space-x-reverse space-x-2" : "space-x-2")}>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} className="text-brand-burgundy fill-brand-burgundy" />
              ))}
            </div>
            <span className="text-2xl font-serif text-brand-brown">5.0</span>
          </div>
          <p className="text-gray-500 uppercase tracking-widest text-sm">{t.reviewsPage.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-12 bg-white border border-gray-100 relative"
            >
              <Quote className={cn("text-brand-brown/10 absolute top-8", isRTL ? "left-8" : "right-8")} size={64} />
              <div className="flex mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-brand-burgundy fill-brand-burgundy mx-0.5" />
                ))}
              </div>
              <p className="text-xl italic text-gray-600 mb-8 leading-relaxed">
                "{review.text}"
              </p>
              <div>
                <p className="font-serif text-xl text-brand-brown">{review.name}</p>
                <p className="text-gray-400 text-sm uppercase tracking-widest">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
