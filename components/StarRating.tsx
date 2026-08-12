"use client";

import { Star } from "lucide-react";
import { useState } from "react";

export default function StarRating({ name, defaultValue }: { name: string; defaultValue: number | null }) {
  const [rating, setRating] = useState(defaultValue ?? 0);
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? rating;

  return (
    <div className="flex items-center">
      <input type="hidden" name={name} value={rating || ""} />
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => setRating(rating === n ? 0 : n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(null)}
          aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
        >
          <Star className={`h-6 w-6 ${n <= display ? "fill-amber-400 stroke-black stroke-1 text-primary" : "text-muted-foreground"}`} />
        </button>
      ))}
    </div>
  );
}