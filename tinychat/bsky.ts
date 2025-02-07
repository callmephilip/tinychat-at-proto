import { Agent } from '@atproto/api';
import { z } from 'zod';
// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: bsky.ipynb





const profileSchema = z.object({
  did: z.string(),
  handle: z.string(),
  displayName: z.string().optional(),
  avatar: z.string().optional(),
  labels: z.array(z.string()),
  createdAt: z.string(),
  description: z.string().optional(),
  banner: z.string().optional(),
  followersCount: z.number(),
  followsCount: z.number(),
  postsCount: z.number(),
});

export type Profile = z.infer<typeof profileSchema>;

export const getProfile = async (did: string): Promise<Profile> => {
  const { data } = await (new Agent("https://public.api.bsky.app/xrpc"))
    .getProfile({ actor: did });
  return profileSchema.parse(data);
};