import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Heart } from "lucide-react";
import { ActivityCard } from "@/components/ActivityCard";
import { SiteHeader } from "@/components/SiteHeader";
import { getSessionUser } from "@/lib/auth";
import { listFavourites } from "@/lib/queries";

export default async function PreferitiPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/accedi?next=%2Fpreferiti");
  }

  const favourites = listFavourites(user.id);

  return (
    <>
      <SiteHeader active="preferiti" user={{ email: user.email }} />

      <main className="page-narrow">
        <section className="favorites-heading">
          <div>
            <h1>I tuoi preferiti</h1>
            <p>Le attività che salvi ti aspettano qui, su ogni dispositivo.</p>
          </div>
          {favourites.length > 0 ? (
            <Link href="/" className="explore-link">
              Esplora le attività <ArrowRight size={17} />
            </Link>
          ) : null}
        </section>

        {favourites.length === 0 ? (
          <section className="favorites-empty">
            <div className="empty-heart">
              <Heart size={30} />
            </div>
            <h2>La prossima avventura inizia da un cuore.</h2>
            <p>
              Quando un&apos;attività ti incuriosisce, tocca il cuore per salvarla.
              <br />
              La ritroverai qui, pronta per il prossimo momento insieme.
            </p>
            <Link href="/" className="primary-button">
              Esplora le attività <ArrowRight size={17} />
            </Link>
          </section>
        ) : (
          <div className="experience-list">
            {favourites.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                showCity
                saved
                saveNext="/preferiti"
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
