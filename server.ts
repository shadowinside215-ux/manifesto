import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";

dotenv.config();

// For ESM (tsx)
const __filename = typeof import.meta !== 'undefined' ? fileURLToPath(import.meta.url) : '';
const __dirname = typeof import.meta !== 'undefined' ? path.dirname(__filename) : '';
// Note: In CJS bundled by esbuild, __dirname and __filename will be injected by esbuild or are already available.

async function startServer() {
  const app = express();
  const PORT = 3000;

  console.log(`Server starting in ${process.env.NODE_ENV || 'development'} mode`);

  app.use(express.json());

  // Request logger to file and console
  app.use((req, res, next) => {
    const logEntry = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
    console.log(logEntry);
    fs.appendFileSync(path.join(process.cwd(), "server.log"), logEntry);
    next();
  });

  // API Routes - MUST be before any static/Vite middleware
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      time: new Date().toISOString(),
      env: process.env.NODE_ENV,
      config: {
        hasEmailUser: !!process.env.EMAIL_USER,
        hasEmailPass: !!process.env.EMAIL_PASS,
        receiver: process.env.CONTACT_RECEIVER_EMAIL || "manifesto.interiors@gmail.com"
      }
    });
  });

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
    console.log("Contact form request received:", req.body);
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailUser = (process.env.EMAIL_USER || "").trim();
    const emailPass = (process.env.EMAIL_PASS || "").replace(/\s+/g, ""); // Remove all spaces from App Password

    if (!emailUser || !emailPass) {
      console.error("Missing EMAIL_USER or EMAIL_PASS environment variables");
      return res.status(500).json({ 
        error: "Server email configuration is incomplete. Please set EMAIL_USER and EMAIL_PASS in the environment." 
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      console.log(`Attempting to send email via Gmail STARTTLS for ${emailUser}...`);
      const mailOptions = {
        from: `"Manifesto Website" <${emailUser}>`,
        to: process.env.CONTACT_RECEIVER_EMAIL || "manifesto.interiors@gmail.com",
        subject: `[Contact Form] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        replyTo: email
      };

      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
      res.status(200).json({ success: "Message sent successfully" });
    } catch (error: any) {
      console.error("Nodemailer Error:", error);
      res.status(500).json({ error: `Email Error: ${error.message || "Unknown error"}` });
    }
  });

  // Handle 404s for API routes specifically
  app.all("/api/*", (req, res) => {
    console.warn(`404 API Route: ${req.method} ${req.url}`);
    res.status(404).json({ 
      error: "API route not found",
      method: req.method,
      path: req.url
    });
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
