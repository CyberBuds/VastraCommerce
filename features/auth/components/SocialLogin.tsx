'use client';

import { UserRole } from '@/types/auth';

interface SocialLoginProps {
  onSelectProfile: (email: string, password: string, role: UserRole) => void;
}

export function SocialLogin(_props: SocialLoginProps) {
  return null;
}
