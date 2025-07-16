import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  name?: string;
  username?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function UserAvatar({ name, username, size = 'md', className }: UserAvatarProps) {
  const displayName = name || username || 'User';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src="/placeholder.svg" />
      <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}