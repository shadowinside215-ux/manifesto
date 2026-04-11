import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Sarah L.",
    role: "Home Owner",
    text: "Kind, patient, and very professional. They truly understood my vision and turned my house into a home I love coming back to every day.",
    rating: 5,
  },
  {
    name: "Ahmed K.",
    role: "Business Owner",
    text: "Transformed our space into something inspiring. The attention to detail is unmatched, and the project was delivered on time and within budget.",
    rating: 5,
  },
  {
    name: "Yasmine M.",
    role: "Villa Owner",
    text: "Exceeded expectations with creativity and high-end finishes. Manifesto Interiors is the gold standard for design in Morocco.",
    rating: 5,
  },
  {
    name: "Karim B.",
    role: "Restaurant Owner",
    text: "The commercial design they did for our restaurant has significantly improved our customer experience. Highly recommended!",
    rating: 5,
  },
  {
    name: "Nadia T.",
    role: "Apartment Owner",
    text: "Professionalism at its best. They managed the entire renovation seamlessly, and the result is absolutely stunning.",
    rating: 5,
  },
];

export default function Reviews() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-brand-burgundy font-medium uppercase tracking-[0.3em] text-sm mb-4 block">
            Testimonials
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-brand-brown mb-6">
            Client Reviews
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} className="text-brand-burgundy fill-brand-burgundy" />
              ))}
            </div>
            <span className="text-2xl font-serif text-brand-brown">5.0</span>
          </div>
          <p className="text-gray-500 uppercase tracking-widest text-sm">Based on 50+ Happy Clients</p>
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
              <Quote className="text-brand-brown/10 absolute top-8 right-8" size={64} />
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
