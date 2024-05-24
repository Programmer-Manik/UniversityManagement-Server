import { z } from 'zod';
const userValidationSchema = z.object({
    id:z.string(),
    password:z.string().max(20, {message:'Password can not be more than 20 characters'}),
    needsPasswordChange:z.boolean().optional(),
    role:z.enum(['admin', 'faculty', 'student']),
    status:z.enum(['in-progress', 'blocked', ]).default('in-progress'),
    isDelete:z.boolean().optional().default(false), 
})

export const userValidation = {
  userValidationSchema,
}