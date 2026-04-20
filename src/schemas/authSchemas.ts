// schemas/authSchemas.ts
import { z } from 'zod';

export const phoneSchema = z.object({
    phone: z.string()
        // Ensure exactly 10 characters
        .length(10, 'Mobile number must be exactly 10 digits')
        // Regex: Starts with 6, 7, 8, or 9, followed by exactly 9 more digits
        .regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number'),
});

export const otpSchema = z.object({
    otp: z.string()
        .length(4, 'OTP must be exactly 4 digits')
        .regex(/^\d+$/, 'OTP must contain only numbers'),
});

export type PhoneFormData = z.infer<typeof phoneSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;