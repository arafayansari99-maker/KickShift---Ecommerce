import type { CSSProperties } from "react";

type ShoeView = "front" | "side";
type EngravingFinish = "dark" | "light";

type MarkPlacement = {
  x: number;
  y: number;
  size: number;
  finish: EngravingFinish;
  rotation?: number;
};

const markPlacements: Record<string, Record<ShoeView, MarkPlacement>> = {
  "velocity-01": {
    front: { x: 43, y: 56, size: 6.4, finish: "dark", rotation: -4 },
    side: { x: 51, y: 51, size: 6.4, finish: "dark", rotation: -2 },
  },
  "courtline-01": {
    front: { x: 45, y: 57, size: 6.2, finish: "dark", rotation: 2 },
    side: { x: 49, y: 51, size: 6.2, finish: "dark", rotation: 1 },
  },
  "afterdark-01": {
    front: { x: 57, y: 53, size: 6.2, finish: "light", rotation: -3 },
    side: { x: 51, y: 52, size: 6.2, finish: "light", rotation: -2 },
  },
  "flux-03": {
    front: { x: 45, y: 53, size: 6.2, finish: "dark", rotation: 3 },
    side: { x: 50, y: 52, size: 6.2, finish: "dark", rotation: 2 },
  },
  "monolith-01": {
    front: { x: 43, y: 55, size: 6.2, finish: "light", rotation: -2 },
    side: { x: 51, y: 52, size: 6.2, finish: "light", rotation: -1 },
  },
  "vector-01": {
    front: { x: 46, y: 55, size: 6.2, finish: "light", rotation: 3 },
    side: { x: 49, y: 51, size: 6.2, finish: "light", rotation: 2 },
  },
  "solaris-01": {
    front: { x: 51, y: 53, size: 6.2, finish: "dark", rotation: -2 },
    side: { x: 57, y: 49, size: 6.2, finish: "dark", rotation: -1 },
  },
  "frost-100": {
    front: { x: 46, y: 53, size: 6.2, finish: "dark", rotation: -2 },
    side: { x: 50, y: 52, size: 6.2, finish: "dark", rotation: -1 },
  },
  "ivy-70": {
    front: { x: 48, y: 54, size: 6.2, finish: "dark", rotation: 1 },
    side: { x: 50, y: 52, size: 6.2, finish: "dark", rotation: 1 },
  },
};

export function KsRoundLogo({
  className = "",
  engraved = false,
}: {
  className?: string;
  engraved?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 180"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {!engraved && (
        <defs>
          <linearGradient id="ks-ring-gradient" x1="24" y1="26" x2="154" y2="154" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFB75D" />
            <stop offset="1" stopColor="#FF5A1F" />
          </linearGradient>
        </defs>
      )}
      <circle cx="90" cy="90" r="84" fill={engraved ? "none" : "#0F172A"} />
      <circle
        cx="90"
        cy="90"
        r="76"
        fill="none"
        stroke={engraved ? "currentColor" : "url(#ks-ring-gradient)"}
        strokeWidth={engraved ? "5" : "8"}
      />
      <text
        x="50%"
        y="58%"
        textAnchor="middle"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="900"
        fontSize="58"
        letterSpacing="-8"
        fill={engraved ? "currentColor" : "#F8FAFC"}
      >
        KS
      </text>
      <path
        d="M30 123C41 116 55 111 72 111H83"
        fill="none"
        stroke={engraved ? "currentColor" : "#FF8A3D"}
        strokeWidth={engraved ? "6" : "8"}
        strokeLinecap="round"
      />
      <path
        d="M111 53C121 59 128 68 128 79C128 96 114 110 94 110H84"
        fill="none"
        stroke={engraved ? "currentColor" : "#FF8A3D"}
        strokeWidth={engraved ? "6" : "8"}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ShoeEngravingMark({
  productId,
  view = "front",
  className = "",
}: {
  productId: string;
  view?: ShoeView;
  className?: string;
}) {
  const placement = markPlacements[productId]?.[view] ?? {
    x: 48,
    y: 54,
    size: 6.2,
    finish: "light" as const,
  };
  const style = {
    "--engraving-x": `${placement.x}%`,
    "--engraving-y": `${placement.y}%`,
    "--engraving-size": `${placement.size}%`,
    "--engraving-rotation": `${placement.rotation ?? 0}deg`,
  } as CSSProperties;

  return (
    <span
      className={`ks-shoe-engraving ks-shoe-engraving--${placement.finish} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <KsRoundLogo className="ks-shoe-engraving-logo" engraved />
    </span>
  );
}

export function ShoePhoto({
  src,
  alt,
  productId,
  view = "front",
  className = "",
  imageClassName = "",
}: {
  src: string;
  alt: string;
  productId: string;
  view?: ShoeView;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <span className={`ks-shoe-photo ${className}`.trim()}>
      <img className={`ks-shoe-photo-source ${imageClassName}`.trim()} src={src} alt={alt} />
      <ShoeEngravingMark productId={productId} view={view} />
    </span>
  );
}

export function CustomizableShoePhoto({
  src,
  alt,
  productId,
  className = "",
  colors,
}: {
  src: string;
  alt: string;
  productId: string;
  className?: string;
  colors: { upper: string; sole: string; lace: string; accent: string };
}) {
  const style = {
    "--custom-upper-color": colors.upper,
    "--custom-sole-color": colors.sole,
    "--custom-lace-color": colors.lace,
    "--custom-accent-color": colors.accent,
  } as CSSProperties;

  return (
    <span className={`ks-shoe-photo ${className}`.trim()} role="img" aria-label={alt} style={style}>
      <img className="ks-shoe-photo-source" src={src} alt="" aria-hidden="true" />
      <span className="ks-custom-color-layer ks-custom-color-layer--upper" aria-hidden="true" />
      <span className="ks-custom-color-layer ks-custom-color-layer--sole" aria-hidden="true" />
      <span className="ks-custom-color-layer ks-custom-color-layer--lace" aria-hidden="true" />
      <span className="ks-custom-color-layer ks-custom-color-layer--accent" aria-hidden="true" />
      <ShoeEngravingMark productId={productId} view="front" />
    </span>
  );
}