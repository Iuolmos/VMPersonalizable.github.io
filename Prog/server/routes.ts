import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { emailRequestSchema } from "@shared/schema";
import nodemailer from "nodemailer";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Email configuration endpoint
  app.post("/api/send-configuration", async (req, res) => {
    try {
      const validatedData = emailRequestSchema.parse(req.body);
      
      // Create configuration record
      const config = await storage.createConfiguration(validatedData);
      
      // Email configuration
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER || process.env.EMAIL_USER || 'noreply@cloudtech.com',
          pass: process.env.GMAIL_PASS || process.env.EMAIL_PASS || 'defaultpass'
        }
      });

      // Calculate pricing breakdown
      const PRICING = {
        cpu: 15.00,
        ram: 2.50,
        disk: 0.10
      };

      const cpuCost = validatedData.cpu * PRICING.cpu;
      const ramCost = validatedData.ram * PRICING.ram;
      const diskCost = validatedData.disk * PRICING.disk;
      const totalCost = cpuCost + ramCost + diskCost;
      const annualCost = totalCost * 12;

      // Email content
      const emailContent = `
        <h2>Cloud Resource Configuration</h2>
        <p>Thank you for using our Cloud Resource Calculator. Here's your configuration summary:</p>
        
        <h3>Resource Configuration:</h3>
        <ul>
          <li><strong>CPU Cores:</strong> ${validatedData.cpu} cores</li>
          <li><strong>RAM Memory:</strong> ${validatedData.ram} GB</li>
          <li><strong>Disk Storage:</strong> ${validatedData.disk} GB</li>
        </ul>
        
        <h3>Pricing Breakdown:</h3>
        <ul>
          <li><strong>CPU Cost:</strong> ${validatedData.cpu} × $${PRICING.cpu} = $${cpuCost.toFixed(2)}/month</li>
          <li><strong>RAM Cost:</strong> ${validatedData.ram} × $${PRICING.ram} = $${ramCost.toFixed(2)}/month</li>
          <li><strong>Disk Cost:</strong> ${validatedData.disk} × $${PRICING.disk} = $${diskCost.toFixed(2)}/month</li>
        </ul>
        
        <h3>Total Costs:</h3>
        <ul>
          <li><strong>Monthly Total:</strong> $${totalCost.toFixed(2)}</li>
          <li><strong>Annual Total:</strong> $${annualCost.toFixed(2)}</li>
        </ul>
        
        <p>If you have any questions or would like to proceed with this configuration, please contact our support team.</p>
        
        <p>Best regards,<br>CloudTech Solutions Team</p>
      `;

      const mailOptions = {
        from: process.env.GMAIL_USER || process.env.EMAIL_USER || 'noreply@cloudtech.com',
        to: validatedData.email,
        subject: 'Cloud Resource Configuration - Pricing Summary',
        html: emailContent
      };

      await transporter.sendMail(mailOptions);

      res.json({ 
        success: true, 
        message: 'Configuration sent successfully to your email',
        configId: config.id
      });

    } catch (error: any) {
      console.error('Error sending email:', error);
      
      if (error?.name === 'ZodError') {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid input data',
          errors: error.errors
        });
      }
      
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send email. Please try again later.'
      });
    }
  });

  // Get pricing information
  app.get("/api/pricing", async (req, res) => {
    const PRICING = {
      cpu: 15.00,
      ram: 2.50,
      disk: 0.10
    };
    
    res.json(PRICING);
  });

  const httpServer = createServer(app);
  return httpServer;
}
