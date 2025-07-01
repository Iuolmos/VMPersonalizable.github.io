import { pgTable, text, serial, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const configurations = pgTable("configurations", {
  id: serial("id").primaryKey(),
  cpu: integer("cpu").notNull(),
  ram: integer("ram").notNull(),
  disk: integer("disk").notNull(),
  email: text("email").notNull(),
  totalCost: real("total_cost").notNull(),
});

export const insertConfigurationSchema = createInsertSchema(configurations).omit({
  id: true,
  totalCost: true,
});

export const emailRequestSchema = z.object({
  cpu: z.number().min(1).max(64),
  ram: z.number().min(1).max(512),
  disk: z.number().min(10).max(10000),
  email: z.string().email().refine((email) => email.includes('@gmail.com'), {
    message: "Please provide a valid Gmail address"
  }),
});

export type InsertConfiguration = z.infer<typeof insertConfigurationSchema>;
export type Configuration = typeof configurations.$inferSelect;
export type EmailRequest = z.infer<typeof emailRequestSchema>;
