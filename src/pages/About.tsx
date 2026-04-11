import { motion } from "motion/react";

export default function About() {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-burgundy font-medium uppercase tracking-[0.3em] text-sm mb-4 block">
              About Manifesto
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-brand-brown mb-10 leading-tight">
              Crafting Timeless <br /> <span className="italic">Moroccan Luxury</span>
            </h1>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                Manifesto Interiors is a premier interior architecture firm based in the historic city of Meknès, Morocco. We specialize in creating high-end residential and commercial spaces that balance functional precision with artistic soul.
              </p>
              <p>
                Our team of passionate designers and architects is dedicated to the pursuit of excellence. We believe that every space has a story to tell, and our mission is to help you tell yours through thoughtful design and impeccable craftsmanship.
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
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-brown/10 -z-10" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "Creativity",
              desc: "We push boundaries to deliver unique, bespoke designs that stand the test of time.",
            },
            {
              title: "Professionalism",
              desc: "From concept to completion, our process is transparent, organized, and client-focused.",
            },
            {
              title: "Attention to Detail",
              desc: "We believe the smallest details make the biggest difference in luxury design.",
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
