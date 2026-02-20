import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { nanoid } from 'nanoid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(): string {
  return nanoid(10);
}

export function formatDate(dateString: string): string {
  if (!dateString || dateString.toLowerCase() === 'present') return 'Present';
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
