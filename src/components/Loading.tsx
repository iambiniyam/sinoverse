/**
 * Loading Component
 * Minimal, elegant loading indicator
 */

interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function Loading({ message, size = "md" }: LoadingProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 border-4 border-ink-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-chinese-red-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      {message && <p className="mt-4 text-ink-600 font-medium">{message}</p>}
    </div>
  );
}
