import z from 'zod';

const envSchema = z.object({
    ENABLE_REACT_QUERY_DEV_TOOLS: z.boolean(),
    API: z.string().min(1)
});

export const env = envSchema.parse({
    ENABLE_REACT_QUERY_DEV_TOOLS: import.meta.env.VITE_ENABLE_REACT_QUERY_DEV_TOOLS === 'true',
    API: import.meta.env.VITE_API
});