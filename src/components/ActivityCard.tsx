import Link from "next/link";
import { Heart } from "lucide-react";
import { formatAges, formatPrice, formatSession } from "@/lib/format";
import { CATEGORY_LABELS } from "@/lib/seed";
import type { ActivitySummary } from "@/lib/types";

type ActivityCardProps = {
  activity: ActivitySummary;
  showCity?: boolean;
  selected?: boolean;
};

export function ActivityCard({ activity, showCity = false, selected = false }: ActivityCardProps) {
  return (
    <article className={`experience-card${selected ? " is-selected" : ""}`}>
      <Link href={`/attivita/${activity.slug}`} className="card-link" aria-label={activity.title} />
      <div className="experience-photo">
        <img src={`/images/${activity.image}.png`} alt="" />
        <span className="save-experience" aria-hidden="true">
          <Heart size={17} />
        </span>
      </div>
      <div className="experience-content">
        <span className="experience-category">{CATEGORY_LABELS[activity.category]}</span>
        <h3>{activity.title}</h3>
        <p className="experience-venue">
          {activity.venueName}
          {showCity ? ` · ${activity.cityName}` : ""}
        </p>
        <p className="experience-date">
          {activity.nextStart ? formatSession(activity.nextStart) : "Date in arrivo"}
        </p>
        <div className="experience-bottom">
          <span>{formatAges(activity.ageMin, activity.ageMax)}</span>
          <strong>
            {formatPrice(activity.priceCents)}
            {activity.priceCents > 0 ? <small> / bambino</small> : null}
          </strong>
        </div>
      </div>
    </article>
  );
}
