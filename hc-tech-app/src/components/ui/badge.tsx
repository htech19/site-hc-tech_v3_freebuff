
import { forwardRef, type HTMLAttributes } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className || ''}`}
      {...props}
    />
  )
);
Badge.displayName = 'Badge';

export { Badge };
