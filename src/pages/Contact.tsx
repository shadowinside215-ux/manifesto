import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export default function Contact() {
  const { t, isRTL } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get("content-type");
      let result;
      
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error(`Server error (${response.status}): The server returned an unexpected response format.`);
      }

      if (response.ok) {
        setStatus({ type: "success", message: "Message sent successfully! We will get back to you soon." });
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus({ type: "error", message: result.error || "Failed to send message." });
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      setStatus({ type: "error", message: error.message || "An error occurred. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info (remains unchanged) */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-burgundy font-medium uppercase tracking-[0.3em] text-sm mb-4 block">
              {t.contact.tag}
            </span>
            <h1 className="text-5xl md:text-6xl font-serif text-brand-brown mb-10">
              {t.contact.title} <br /> <span className="italic">{t.contact.titleItalic}</span>
            </h1>
            
            <div className="space-y-10 mb-12">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-brand-brown/5 flex items-center justify-center shrink-0">
                  <MapPin className="text-brand-burgundy" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-serif text-brand-brown mb-1">{t.contact.studio}</h4>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=N°+15+Rue+Tlemcen+Résidence+Ghita.+V.N,+Meknès+50000" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-brand-burgundy transition-colors"
                  >
                    N° 15 Rue Tlemcen Résidence Ghita. V.N, Meknès 50000
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-brand-brown/5 flex items-center justify-center shrink-0">
                  <Phone className="text-brand-burgundy" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-serif text-brand-brown mb-1">{t.contact.call}</h4>
                  <a 
                    href="https://wa.me/212771660212" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-brand-burgundy transition-colors"
                  >
                    0771660212
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-brand-brown/5 flex items-center justify-center shrink-0">
                  <Mail className="text-brand-burgundy" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-serif text-brand-brown mb-1">{t.contact.email}</h4>
                  <a href="mailto:manifesto.interiors@gmail.com" className="text-gray-600 hover:text-brand-burgundy transition-colors">
                    manifesto.interiors@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full aspect-video bg-gray-100 overflow-hidden border border-gray-200">
              <iframe
                title="Manifesto Interiors Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.968600125869!2d-5.5387!3d33.8935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDUzJzM2LjYiTiA1wrAzMicyNy4zIlc!5e0!3m2!1sen!2sma!4v1620000000000!5m2!1sen!2sma"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gray-50 p-10 md:p-16 border border-gray-100"
          >
            <h3 className="text-3xl font-serif text-brand-brown mb-8">{t.contact.formTitle}</h3>
            
            {status && (
              <div className={cn(
                "mb-8 p-4 flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-1",
                status.type === "success" ? "bg-green-50 text-green-800 border border-green-100" : "bg-red-50 text-red-800 border border-red-100"
              )}>
                {status.type === "success" ? (
                  <CheckCircle2 size={20} className="shrink-0" />
                ) : (
                  <AlertCircle size={20} className="shrink-0" />
                )}
                {status.message}
              </div>
            )}

            <form 
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-medium text-gray-500">{t.contact.nameLabel}</label>
                  <Input 
                    name="name"
                    required
                    className="rounded-none border-gray-200 focus:border-brand-burgundy focus:ring-0 h-12" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-medium text-gray-500">{t.contact.emailLabel}</label>
                  <Input 
                    name="email"
                    type="email" 
                    required
                    className="rounded-none border-gray-200 focus:border-brand-burgundy focus:ring-0 h-12" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-medium text-gray-500">{t.contact.subjectLabel}</label>
                <Input 
                  name="subject"
                  required
                  className="rounded-none border-gray-200 focus:border-brand-burgundy focus:ring-0 h-12" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-medium text-gray-500">{t.contact.messageLabel}</label>
                <Textarea 
                  name="message"
                  required
                  className="rounded-none border-gray-200 focus:border-brand-burgundy focus:ring-0 min-h-[150px]" 
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-brand-burgundy hover:bg-brand-burgundy-dark text-white rounded-none w-full py-7 text-lg uppercase tracking-widest"
              >
                {isSubmitting ? (
                  <>Sending... <Loader2 className="ml-2 animate-spin" size={18} /></>
                ) : (
                  <>{t.contact.send} <Send className={cn("ml-2", isRTL && "mr-2 ml-0")} size={18} /></>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
