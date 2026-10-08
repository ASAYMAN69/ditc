import { z } from "zod";

export const registrationSchema = z.object({
  fullName: z.string().min(2, "Name is too short").max(120),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone").max(30),
  extraData: z.record(z.string()).optional().default({}),
});

export const festSchema = z.object({
  title: z.string().min(3).max(140),
  description: z.string().max(4000).default(""),
  venue: z.string().max(200).default(""),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(["draft", "published", "archived"]).default("published"),
});

export const eventSchema = z.object({
  festId: z.string().min(1),
  title: z.string().min(3).max(140),
  description: z.string().max(6000).default(""),
  category: z.string().min(2).max(40).default("workshop"),
  venue: z.string().max(200).default(""),
  startAt: z.string(),
  endAt: z.string(),
  registrationDeadline: z.string(),
  capacity: z.coerce.number().int().min(1).max(100000),
  fee: z.coerce.number().int().min(0).max(100000000).default(0),
  status: z.enum(["draft", "published", "cancelled"]).default("published"),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const userSignupSchema = z.object({
  name: z.string().min(2, "Name is too short").max(120),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone").max(30),
  password: z.string().min(8, "Password needs at least 8 characters").max(200),
});

export const organizerCreateUserSchema = userSignupSchema.extend({
  role: z.enum(["participant", "organizer"]).default("participant"),
});
