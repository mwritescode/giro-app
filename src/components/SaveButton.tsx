import { Heart } from "lucide-react";
import { toggleFavourite } from "@/app/actions";

type SaveButtonProps = {
  activityId: number;
  saved: boolean;
  next: string;
  withLabel?: boolean;
};

export function SaveButton({ activityId, saved, next, withLabel = false }: SaveButtonProps) {
  return (
    <form action={toggleFavourite} className={withLabel ? "save-detail-form" : "save-form"}>
      <input type="hidden" name="activityId" value={activityId} />
      <input type="hidden" name="next" value={next} />
      <button
        type="submit"
        className={withLabel ? "detail-save" : "save-experience"}
        aria-pressed={saved}
        aria-label={saved ? "Rimuovi dai preferiti" : "Salva nei preferiti"}
      >
        <Heart size={withLabel ? 17 : 15} fill={saved ? "currentColor" : "none"} />
        {withLabel ? <span>{saved ? "Salvata" : "Salva"}</span> : null}
      </button>
    </form>
  );
}
