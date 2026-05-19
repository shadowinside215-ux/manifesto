import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes - MUST be before any middleware
  app.get("/api/config", (req, res) => {
    // Check various common naming patterns
    const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME || 
                     process.env.CLOUDINARY_CLOUD_NAME || 
                     process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
                     
    const uploadPreset = process.env.VITE_CLOUDINARY_UPLOAD_PRESET || 
                        process.env.CLOUDINARY_UPLOAD_PRESET || 
                        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
    console.log("Cloudinary Config Request - Server Env Keys Available:", Object.keys(process.env).filter(k => k.includes("CLOUDINARY")));

    res.json({
      cloudinaryCloudName: cloudName || "NOT_SET",
      cloudinaryUploadPreset: uploadPreset || "NOT_SET",
    });
  });

  app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      console.log("Sending email from:", process.env.EMAIL_USER);
      console.log("To:", process.env.CONTACT_RECEIVER_EMAIL || "manifesto.interiors@gmail.com");

      const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        to: process.env.CONTACT_RECEIVER_EMAIL || "manifesto.interiors@gmail.com",
        subject: `[Contact Form] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        replyTo: email
      };

      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
      res.status(200).json({ success: "Message sent successfully" });
    } catch (error: any) {
      console.error("Email error details:", error);
      res.status(500).json({ error: error.message || "Failed to send message. Please check server logs." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
