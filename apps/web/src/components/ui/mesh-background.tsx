import { cn } from "@/lib/utils";

export function MeshBackground({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "subtle" | "auth";
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}
    >
      <div className="absolute inset-0 bg-background" />
      {/* Periwinkle — top */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-12%,oklch(0.38_0.10_275_/_0.16),transparent_58%)]" />
      {/* Gold — warm right */}
      <div
        className={cn(
          "absolute -right-16 top-1/4 size-[440px] rounded-full bg-[oklch(0.55_0.09_78_/_0.09)] blur-[100px]",
          variant === "subtle" && "opacity-55",
        )}
      />
      {/* Teal — cool left */}
      <div
        className={cn(
          "absolute -left-20 top-1/3 size-[380px] rounded-full bg-[oklch(0.45_0.09_195_/_0.08)] blur-[110px]",
          variant === "subtle" && "opacity-50",
          variant === "auth" && "left-0 size-[480px] opacity-70",
        )}
      />
      {/* Violet — bottom depth */}
      <div className="absolute bottom-0 left-1/2 size-[320px] -translate-x-1/2 rounded-full bg-[oklch(0.40_0.08_295_/_0.07)] blur-[90px]" />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />
    </div>
  );
}
