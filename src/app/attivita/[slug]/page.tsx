import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3, MapPin, Users } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SaveButton } from "@/components/SaveButton";
import { formatAges, formatDayLong, formatDuration, formatPrice, formatTime } from "@/lib/format";
import { getActivityBySlug, isFavourite } from "@/lib/queries";
import { getSessionUser } from "@/lib/auth";
import { CATEGORY_LABELS } from "@/lib/seed";

const MAP_IMAGES: Record<string, string> = {
  firenze: "/images/florence-map.png",
  milano: "/images/milan-map.png",
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);
  if (!activity) {
    return { title: "Attività non trovata — giro." };
  }
  return {
    title: `${activity.title} — giro.`,
    description: activity.summary,
    openGraph: {
      title: activity.title,
      description: activity.summary,
      images: [`/images/${activity.image}.png`],
    },
  };
}

export default async function ActivityPage({ params }: PageProps) {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);

  if (!activity) {
    notFound();
  }

  const firstSession = activity.sessions[0] ?? null;
  const user = await getSessionUser();
  const saved = user ? isFavourite(user.id, activity.id) : false;

  return (
    <>
      <SiteHeader active="esplora" user={user ? { email: user.email } : null} />

      <main className="detail-main">
        <div className="detail-back">
          <Link href={`/${activity.citySlug}`}>
            <ArrowLeft size={16} /> Torna alle esperienze a {activity.cityName}
          </Link>
          <SaveButton
            activityId={activity.id}
            saved={saved}
            next={`/attivita/${activity.slug}`}
            withLabel
          />
        </div>

        <div className="activity-hero">
          <img src={`/images/${activity.image}.png`} alt={activity.title} />
        </div>

        <div className="detail-columns">
          <article>
            <div className="activity-heading">
              <p className="activity-category">{CATEGORY_LABELS[activity.category]}</p>
              <h1>{activity.title}</h1>
              <p className="activity-provider">{activity.venueName}</p>
            </div>

            <div className="activity-facts">
              <div>
                <CalendarDays size={20} />
                <p>
                  <strong>{firstSession ? formatDayLong(firstSession.startsAt) : "Date in arrivo"}</strong>
                  <span>{firstSession ? formatTime(firstSession.startsAt) : ""}</span>
                </p>
              </div>
              <div>
                <Users size={20} />
                <p>
                  <strong>{formatAges(activity.ageMin, activity.ageMax)}</strong>
                  <span>Per piccoli curiosi</span>
                </p>
              </div>
              <div>
                <Clock3 size={20} />
                <p>
                  <strong>{formatDuration(activity.durationMinutes)}</strong>
                  <span>Laboratorio in presenza</span>
                </p>
              </div>
            </div>

            <section className="activity-about">
              <h2>{activity.aboutTitle}</h2>
              <p>{activity.aboutText}</p>
            </section>

            <section className="activity-location">
              <div className="location-copy">
                <h2>Dove si va</h2>
                <p>{activity.venueName}</p>
                <span>{activity.venueAddress}</span>
              </div>
              <div className="location-map">
                <img src={MAP_IMAGES[activity.citySlug] ?? MAP_IMAGES.firenze} alt="" />
              </div>
            </section>

            <section className="before-you-go">
              <h2>Prima di partire</h2>
              <p>{activity.beforeYouGo}</p>
            </section>
          </article>

          <aside className="booking-card">
            <div className="booking-price">
              <strong>{formatPrice(activity.priceCents)}</strong>
              <span>{activity.priceCents > 0 ? "per bambino" : "ingresso libero"}</span>
            </div>

            {firstSession ? (
              <div className="booking-session">
                <CalendarDays size={19} />
                <p>
                  <strong>{formatDayLong(firstSession.startsAt)}</strong>
                  <span>
                    {formatTime(firstSession.startsAt)}–{formatTime(firstSession.endsAt)} ·{" "}
                    {formatAges(activity.ageMin, activity.ageMax)}
                  </span>
                </p>
              </div>
            ) : null}

            <a
              className="provider-cta"
              href={activity.providerUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Vai al sito dell&apos;organizzatore <ArrowUpRight size={18} />
            </a>

            <p className="provider-note">
              Disponibilità e prenotazione sono gestite direttamente dall&apos;organizzatore.
            </p>

            <p className="provider-note">
              <MapPin size={12} /> {activity.venueAddress}
            </p>
          </aside>
        </div>
      </main>
    </>
  );
}
