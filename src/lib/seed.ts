import type { DatabaseSync } from "node:sqlite";

export type Category = "scienza" | "arte" | "natura" | "musei";

export const CATEGORY_LABELS: Record<Category, string> = {
  scienza: "Scienza e tecnologia",
  arte: "Arte e creatività",
  natura: "Natura e avventura",
  musei: "Musei e cultura",
};

export const CATEGORY_SLUGS = Object.keys(CATEGORY_LABELS) as Category[];

type SeedCity = {
  slug: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  available: boolean;
};

type SeedVenue = {
  slug: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
};

type SeedActivity = {
  slug: string;
  title: string;
  venue: string;
  category: Category;
  ageMin: number;
  ageMax: number;
  priceCents: number;
  durationMinutes: number;
  summary: string;
  aboutTitle: string;
  aboutText: string;
  image: string;
  providerUrl: string;
  beforeYouGo: string;
  slots: string[];
};

const cities: SeedCity[] = [
  { slug: "firenze", name: "Firenze", region: "Toscana", lat: 43.7696, lng: 11.2558, available: true },
  { slug: "milano", name: "Milano", region: "Lombardia", lat: 45.4642, lng: 9.19, available: true },
  { slug: "roma", name: "Roma", region: "Lazio", lat: 41.9028, lng: 12.4964, available: false },
];

const venues: SeedVenue[] = [
  { slug: "leonardo-interactive-museum", name: "Leonardo Interactive Museum", address: "Via dei Servi 22r, Firenze", city: "firenze", lat: 43.7731, lng: 11.2594 },
  { slug: "museo-horne", name: "Museo Horne", address: "Via dei Benci 6, Firenze", city: "firenze", lat: 43.7679, lng: 11.2584 },
  { slug: "orto-botanico-firenze", name: "Orto Botanico di Firenze", address: "Via Pier Antonio Micheli 3, Firenze", city: "firenze", lat: 43.7787, lng: 11.2603 },
  { slug: "museo-galileo", name: "Museo Galileo", address: "Piazza dei Giudici 1, Firenze", city: "firenze", lat: 43.7678, lng: 11.2555 },
  { slug: "palazzo-vecchio", name: "Palazzo Vecchio", address: "Piazza della Signoria, Firenze", city: "firenze", lat: 43.7696, lng: 11.256 },
  { slug: "museo-stibbert", name: "Museo Stibbert", address: "Via Federigo Stibbert 26, Firenze", city: "firenze", lat: 43.7926, lng: 11.2653 },
  { slug: "palazzo-strozzi", name: "Fondazione Palazzo Strozzi", address: "Piazza degli Strozzi, Firenze", city: "firenze", lat: 43.7713, lng: 11.2521 },
  { slug: "bargello", name: "Museo Nazionale del Bargello", address: "Via del Proconsolo 4, Firenze", city: "firenze", lat: 43.7705, lng: 11.2582 },
  { slug: "giardino-boboli", name: "Giardino di Boboli", address: "Piazza de' Pitti 1, Firenze", city: "firenze", lat: 43.7625, lng: 11.25 },
  { slug: "la-specola", name: "Museo La Specola", address: "Via Romana 17, Firenze", city: "firenze", lat: 43.7639, lng: 11.2465 },
  { slug: "biblioteca-oblate", name: "Biblioteca delle Oblate", address: "Via dell'Oriuolo 24, Firenze", city: "firenze", lat: 43.7733, lng: 11.2609 },
  { slug: "fiesole-archeologico", name: "Museo Civico Archeologico di Fiesole", address: "Via Portigiani 1, Fiesole", city: "firenze", lat: 43.8074, lng: 11.293 },
  { slug: "museo-scienza-milano", name: "Museo Nazionale Scienza e Tecnologia", address: "Via San Vittore 21, Milano", city: "milano", lat: 45.462, lng: 9.17 },
  { slug: "muba", name: "MUBA – Museo dei Bambini", address: "Via Enrico Besana 12, Milano", city: "milano", lat: 45.4636, lng: 9.203 },
  { slug: "orto-botanico-brera", name: "Orto Botanico di Brera", address: "Via Brera 28, Milano", city: "milano", lat: 45.4722, lng: 9.187 },
  { slug: "acquario-civico", name: "Acquario Civico", address: "Viale Gadio 2, Milano", city: "milano", lat: 45.473, lng: 9.178 },
  { slug: "museo-storia-naturale-milano", name: "Museo di Storia Naturale", address: "Corso Venezia 55, Milano", city: "milano", lat: 45.4724, lng: 9.203 },
  { slug: "planetario-hoepli", name: "Planetario Ulrico Hoepli", address: "Corso Venezia 57, Milano", city: "milano", lat: 45.473, lng: 9.2035 },
  { slug: "castello-sforzesco", name: "Castello Sforzesco", address: "Piazza Castello, Milano", city: "milano", lat: 45.4703, lng: 9.1794 },
  { slug: "museo-novecento", name: "Museo del Novecento", address: "Piazza del Duomo 8, Milano", city: "milano", lat: 45.462, lng: 9.19 },
  { slug: "hangarbicocca", name: "HangarBicocca", address: "Via Chiese 2, Milano", city: "milano", lat: 45.518, lng: 9.22 },
  { slug: "wow-fumetto", name: "WOW Museo del Fumetto", address: "Viale Campania 12, Milano", city: "milano", lat: 45.462, lng: 9.229 },
  { slug: "mudec", name: "MUDEC", address: "Via Tortona 56, Milano", city: "milano", lat: 45.452, lng: 9.162 },
  { slug: "fabbrica-vapore", name: "Fabbrica del Vapore", address: "Via Procaccini 4, Milano", city: "milano", lat: 45.483, lng: 9.172 },
  { slug: "palazzo-reale", name: "Palazzo Reale", address: "Piazza del Duomo 12, Milano", city: "milano", lat: 45.463, lng: 9.191 },
  { slug: "parco-sempione", name: "Parco Sempione", address: "Piazza Sempione, Milano", city: "milano", lat: 45.472, lng: 9.174 },
  { slug: "poldi-pezzoli", name: "Museo Poldi Pezzoli", address: "Via Manzoni 12, Milano", city: "milano", lat: 45.468, lng: 9.19 },
  { slug: "teatro-alla-scala", name: "Museo Teatrale alla Scala", address: "Largo Ghiringhelli 1, Milano", city: "milano", lat: 45.467, lng: 9.1895 },
  { slug: "museo-diocesano", name: "Museo Diocesano", address: "Corso di Porta Ticinese 95, Milano", city: "milano", lat: 45.4575, lng: 9.1785 },
  { slug: "biblioteca-sormani", name: "Biblioteca Sormani", address: "Corso di Porta Vittoria 6, Milano", city: "milano", lat: 45.4615, lng: 9.1975 },
  { slug: "cascina-cuccagna", name: "Cascina Cuccagna", address: "Via Privata Cuccagna 2/4, Milano", city: "milano", lat: 45.4535, lng: 9.2115 },
];

const activities: SeedActivity[] = [
  {
    slug: "le-invenzioni-di-leonardo",
    title: "Le invenzioni di Leonardo",
    venue: "leonardo-interactive-museum",
    category: "scienza",
    ageMin: 6,
    ageMax: 10,
    priceCents: 1200,
    durationMinutes: 90,
    summary: "Macchine da toccare, ingranaggi da girare e un laboratorio per costruire la tua invenzione.",
    aboutTitle: "Grandi idee, piccole mani.",
    aboutText:
      "Le macchine di Leonardo qui si possono provare: sollevare, far girare, sbagliare e riprovare. Il laboratorio chiude il giro con un meccanismo costruito dai bambini, da portare a casa.",
    image: "science",
    providerUrl: "https://www.leonardointeractivemuseum.com/",
    beforeYouGo: "Il laboratorio parte con almeno sei partecipanti: conviene arrivare dieci minuti prima.",
    slots: ["10:30", "15:00"],
  },
  {
    slug: "un-museo-a-colori",
    title: "Un museo a colori",
    venue: "museo-horne",
    category: "arte",
    ageMin: 6,
    ageMax: 8,
    priceCents: 1000,
    durationMinutes: 90,
    summary: "Una casa-museo da esplorare cercando i dettagli nascosti nei dipinti.",
    aboutTitle: "Guardare piano, vedere di più.",
    aboutText:
      "Una visita giocata a tappe: ogni stanza nasconde un dettaglio da trovare. Si finisce con un disegno ispirato a quello che i bambini hanno scelto come preferito.",
    image: "art",
    providerUrl: "https://www.museohorne.it/",
    beforeYouGo: "Gli spazi sono piccoli: le borse grandi vanno lasciate all'ingresso.",
    slots: ["15:00"],
  },
  {
    slug: "alla-scoperta-dell-orto",
    title: "Alla scoperta dell'orto",
    venue: "orto-botanico-firenze",
    category: "natura",
    ageMin: 6,
    ageMax: 10,
    priceCents: 0,
    durationMinutes: 90,
    summary: "Piante che si toccano, profumi da riconoscere e un quaderno per le foglie raccolte.",
    aboutTitle: "Il giardino come laboratorio.",
    aboutText:
      "Un percorso tra le collezioni storiche dell'orto, con una caccia alle foglie e una sosta all'ombra per disegnare quello che si è trovato.",
    image: "garden",
    providerUrl: "https://www.unifi.it/",
    beforeYouGo: "Attività all'aperto: cappello e acqua consigliati, si svolge anche con il sole.",
    slots: ["10:00"],
  },
  {
    slug: "il-cielo-di-galileo",
    title: "Il cielo di Galileo",
    venue: "museo-galileo",
    category: "scienza",
    ageMin: 8,
    ageMax: 11,
    priceCents: 1400,
    durationMinutes: 75,
    summary: "Cannocchiali, mappe stellari e un planetario per capire cosa vedeva Galileo.",
    aboutTitle: "Puntare in alto.",
    aboutText:
      "Si parte dagli strumenti originali e si arriva a costruire una mappa del cielo. Il laboratorio alterna racconto e prove pratiche con lenti e specchi.",
    image: "science",
    providerUrl: "https://www.museogalileo.it/",
    beforeYouGo: "Consigliato dai 8 anni: alcune parti richiedono di leggere e seguire istruzioni.",
    slots: ["11:00", "16:00"],
  },
  {
    slug: "piccoli-signori-di-palazzo-vecchio",
    title: "Piccoli signori di Palazzo Vecchio",
    venue: "palazzo-vecchio",
    category: "musei",
    ageMin: 6,
    ageMax: 10,
    priceCents: 1200,
    durationMinutes: 90,
    summary: "Saloni affrescati, passaggi segreti e il compito di governare la città per un'ora.",
    aboutTitle: "Una città da decidere.",
    aboutText:
      "I bambini entrano nel Salone dei Cinquecento e diventano consiglieri per un giorno: una piccola assemblea, con problemi veri e soluzioni da votare.",
    image: "art",
    providerUrl: "https://musefirenze.it/",
    beforeYouGo: "Sono previste scale: il percorso non è completamente accessibile con passeggini.",
    slots: ["10:00", "15:30"],
  },
  {
    slug: "cavalieri-e-armature",
    title: "Cavalieri e armature",
    venue: "museo-stibbert",
    category: "musei",
    ageMin: 7,
    ageMax: 11,
    priceCents: 1000,
    durationMinutes: 90,
    summary: "Armature da vicino, un parco da attraversare e il peso di una spada da provare.",
    aboutTitle: "Quanto pesa un cavaliere.",
    aboutText:
      "Un percorso nelle sale delle armature, con qualche prova pratica per capire cosa voleva dire muoversi vestiti di ferro, e una passeggiata nel parco romantico.",
    image: "science",
    providerUrl: "https://www.museostibbert.it/",
    beforeYouGo: "Il parco è parte della visita: scarpe comode.",
    slots: ["10:30", "14:30"],
  },
  {
    slug: "segni-e-colori-a-palazzo-strozzi",
    title: "Segni e colori",
    venue: "palazzo-strozzi",
    category: "arte",
    ageMin: 5,
    ageMax: 10,
    priceCents: 0,
    durationMinutes: 60,
    summary: "Una visita breve alle opere, poi tutti a lavorare con carta, colore e forbici.",
    aboutTitle: "Prima guardare, poi fare.",
    aboutText:
      "Mezz'ora nelle sale per scegliere un'opera, poi un laboratorio aperto dove ogni bambino reinterpreta quello che ha visto, senza copiare.",
    image: "art",
    providerUrl: "https://www.palazzostrozzi.org/",
    beforeYouGo: "Ingresso gratuito per i bambini, laboratorio su prenotazione.",
    slots: ["16:00"],
  },
  {
    slug: "animali-di-pietra-al-bargello",
    title: "Animali di pietra",
    venue: "bargello",
    category: "arte",
    ageMin: 8,
    ageMax: 11,
    priceCents: 800,
    durationMinutes: 75,
    summary: "Leoni, aquile e draghi scolpiti: una caccia al dettaglio tra le sculture.",
    aboutTitle: "Chi guarda chi.",
    aboutText:
      "Un percorso che parte dagli animali del cortile e arriva alle sculture di Donatello, con un taccuino per disegnare i dettagli più strani.",
    image: "art",
    providerUrl: "https://museiitaliani.it/",
    beforeYouGo: "Il museo è in centro: nessun parcheggio proprio, meglio arrivare a piedi.",
    slots: ["11:30"],
  },
  {
    slug: "caccia-al-tesoro-a-boboli",
    title: "Caccia al tesoro a Boboli",
    venue: "giardino-boboli",
    category: "natura",
    ageMin: 6,
    ageMax: 10,
    priceCents: 1200,
    durationMinutes: 105,
    summary: "Un giardino enorme, una mappa e una serie di indizi da seguire in gruppo.",
    aboutTitle: "Perdersi è il punto.",
    aboutText:
      "Le squadre ricevono una mappa del giardino e una lista di dettagli da trovare: statue, fontane, scorci. Si vince tornando tutti insieme al punto di partenza.",
    image: "garden",
    providerUrl: "https://www.uffizi.it/",
    beforeYouGo: "Percorso in salita: acqua e scarpe da cammino, due ore all'aperto.",
    slots: ["10:00", "15:00"],
  },
  {
    slug: "la-specola-dei-piccoli",
    title: "La Specola dei piccoli",
    venue: "la-specola",
    category: "scienza",
    ageMin: 6,
    ageMax: 9,
    priceCents: 900,
    durationMinutes: 75,
    summary: "Animali, scheletri e una stanza che sembra un altro mondo.",
    aboutTitle: "Curiosità, non paura.",
    aboutText:
      "Una visita pensata per i più piccoli, con racconti brevi e domande: come vola un uccello, perché un osso è fatto così. Nessuna parte spaventosa.",
    image: "science",
    providerUrl: "https://www.msn.unifi.it/",
    beforeYouGo: "Sconsigliato a chi ha paura degli animali imbalsamati: sono ovunque.",
    slots: ["10:30"],
  },
  {
    slug: "storie-a-voce-alta-in-biblioteca",
    title: "Storie a voce alta",
    venue: "biblioteca-oblate",
    category: "musei",
    ageMin: 4,
    ageMax: 8,
    priceCents: 0,
    durationMinutes: 60,
    summary: "Letture ad alta voce, cuscini per terra e un angolo per disegnare dopo.",
    aboutTitle: "Un'ora senza fretta.",
    aboutText:
      "Una lettrice racconta tre storie scelte per l'età del gruppo, con le pause giuste per le domande. Poi ognuno disegna la storia che gli è rimasta.",
    image: "art",
    providerUrl: "https://cultura.comune.fi.it/",
    beforeYouGo: "Posti limitati: si entra in ordine di arrivo, senza prenotazione.",
    slots: ["17:00"],
  },
  {
    slug: "scavi-e-storie-a-fiesole",
    title: "Scavi e storie a Fiesole",
    venue: "fiesole-archeologico",
    category: "musei",
    ageMin: 8,
    ageMax: 12,
    priceCents: 800,
    durationMinutes: 90,
    summary: "Un museo archeologico in collina, con il teatro romano da guardare dall'alto.",
    aboutTitle: "Duemila anni fa, qui.",
    aboutText:
      "Si guardano i reperti e poi lo scavo vero e proprio, per capire come si ricostruisce la vita di chi abitava qui. Chiusura con una piccola prova di scavo simulato.",
    image: "garden",
    providerUrl: "https://www.comune.fiesole.fi.it/",
    beforeYouGo: "Fiesole è in collina: si raggiunge in autobus, circa venti minuti da Firenze.",
    slots: ["10:00"],
  },
  {
    slug: "leonardo-per-un-giorno",
    title: "Leonardo per un giorno",
    venue: "museo-scienza-milano",
    category: "scienza",
    ageMin: 6,
    ageMax: 10,
    priceCents: 1200,
    durationMinutes: 90,
    summary: "Ingranaggi, piccoli esperimenti e un meccanismo da costruire con le proprie mani.",
    aboutTitle: "Grandi idee, piccole mani.",
    aboutText:
      "Come si trasforma un'idea in un'invenzione? Tra ingranaggi e piccoli esperimenti, i bambini esplorano il mondo di Leonardo e costruiscono un meccanismo con le proprie mani.",
    image: "science",
    providerUrl: "https://www.museoscienza.org/",
    beforeYouGo: "Controlla sul sito del museo la disponibilità e se è richiesta la presenza di un adulto.",
    slots: ["10:30", "15:00"],
  },
  {
    slug: "piccoli-artisti-grandi-idee",
    title: "Piccoli artisti, grandi idee",
    venue: "muba",
    category: "arte",
    ageMin: 6,
    ageMax: 8,
    priceCents: 1000,
    durationMinutes: 90,
    summary: "Un laboratorio dove il materiale conta più del risultato.",
    aboutTitle: "Sbagliare è il metodo.",
    aboutText:
      "Terre, carte e colori per costruire qualcosa che non esisteva. Nessun modello da copiare: si parte da un materiale e si vede dove porta.",
    image: "art",
    providerUrl: "https://www.muba.it/",
    beforeYouGo: "I bambini lavorano in grembiule: vestiti che si possono sporcare.",
    slots: ["15:00"],
  },
  {
    slug: "esploratori-in-giardino",
    title: "Esploratori in giardino",
    venue: "orto-botanico-brera",
    category: "natura",
    ageMin: 6,
    ageMax: 10,
    priceCents: 0,
    durationMinutes: 90,
    summary: "Un orto botanico nascosto in centro, con lenti e quaderni da campo.",
    aboutTitle: "Il centro di Milano, visto da vicino.",
    aboutText:
      "Un percorso tra le piante dell'orto storico, con lenti di ingrandimento e un quaderno per raccogliere foglie, semi e disegni.",
    image: "garden",
    providerUrl: "https://ortobotanico.milano.it/",
    beforeYouGo: "Ingresso libero, attività all'aperto.",
    slots: ["10:00"],
  },
  {
    slug: "pesci-curiosi-all-acquario",
    title: "Pesci curiosi",
    venue: "acquario-civico",
    category: "natura",
    ageMin: 4,
    ageMax: 8,
    priceCents: 500,
    durationMinutes: 60,
    summary: "Vasche storiche, pesci di lago e di mare, e un racconto che dura quanto l'attenzione.",
    aboutTitle: "Piccolo ma pieno.",
    aboutText:
      "Un acquario compatto, perfetto per una prima visita: si guarda, si chiede, si esce prima che la stanchezza arrivi.",
    image: "garden",
    providerUrl: "https://www.acquariocivicomilano.eu/",
    beforeYouGo: "Visita breve: si abbina bene a una passeggiata al Parco Sempione.",
    slots: ["10:00", "11:30"],
  },
  {
    slug: "insetti-e-farfalle",
    title: "Insetti e farfalle",
    venue: "museo-storia-naturale-milano",
    category: "scienza",
    ageMin: 6,
    ageMax: 10,
    priceCents: 800,
    durationMinutes: 75,
    summary: "Vetrine piene di ali colorate e un laboratorio per guardarle al microscopio.",
    aboutTitle: "Quanto è piccolo il piccolo.",
    aboutText:
      "Dalle collezioni storiche al microscopio: i bambini osservano ali, zampe e antenne, poi provano a disegnare quello che vedono.",
    image: "science",
    providerUrl: "https://www.comune.milano.it/",
    beforeYouGo: "Le sale sono grandi: meglio scegliere una sezione e non visitare tutto.",
    slots: ["10:30", "15:30"],
  },
  {
    slug: "una-stella-per-amica",
    title: "Una stella per amica",
    venue: "planetario-hoepli",
    category: "scienza",
    ageMin: 7,
    ageMax: 11,
    priceCents: 700,
    durationMinutes: 60,
    summary: "Una cupola, il cielo proiettato e le costellazioni raccontate come storie.",
    aboutTitle: "Il cielo dentro una stanza.",
    aboutText:
      "Una sessione al planetario pensata per i bambini: si riconoscono le stelle più facili e si ascoltano i miti che le accompagnano.",
    image: "science",
    providerUrl: "https://www.comune.milano.it/",
    beforeYouGo: "La sala è al buio: va bene anche per chi ha un po' di timore, si entra piano.",
    slots: ["11:00", "16:30"],
  },
  {
    slug: "il-castello-dei-bambini",
    title: "Il castello dei bambini",
    venue: "castello-sforzesco",
    category: "musei",
    ageMin: 6,
    ageMax: 10,
    priceCents: 0,
    durationMinutes: 90,
    summary: "Cortili, mura e musei dentro un castello vero, in mezzo alla città.",
    aboutTitle: "Una fortezza da attraversare.",
    aboutText:
      "Un percorso che parte dai cortili e entra nei musei, con una mappa da completare strada facendo: torri, ponti e passaggi.",
    image: "art",
    providerUrl: "https://www.milanocastello.it/",
    beforeYouGo: "Ingresso ai musei gratuito: cortili sempre aperti.",
    slots: ["10:00", "14:30"],
  },
  {
    slug: "colori-del-novecento",
    title: "Colori del Novecento",
    venue: "museo-novecento",
    category: "arte",
    ageMin: 8,
    ageMax: 12,
    priceCents: 1000,
    durationMinutes: 75,
    summary: "Un museo che si guarda dal basso verso l'alto, tra opere enormi e finestre sul Duomo.",
    aboutTitle: "Un secolo in poche sale.",
    aboutText:
      "Si sceglie un'opera a testa, la si racconta agli altri e poi si prova a rifarla con tre colori soltanto.",
    image: "art",
    providerUrl: "https://www.museodelnovecento.org/",
    beforeYouGo: "La torre ha una scala a chiocciola: si sale uno alla volta.",
    slots: ["15:00"],
  },
  {
    slug: "arte-contemporanea-spiegata",
    title: "Arte contemporanea, spiegata bene",
    venue: "hangarbicocca",
    category: "arte",
    ageMin: 8,
    ageMax: 12,
    priceCents: 0,
    durationMinutes: 90,
    summary: "Capannoni enormi, installazioni giganti e nessuna domanda stupida.",
    aboutTitle: "Grande quanto una casa.",
    aboutText:
      "Le opere qui sono più grandi dei visitatori, e questo aiuta: si cammina dentro l'arte invece di guardarla da lontano.",
    image: "art",
    providerUrl: "https://www.hangarbicocca.org/",
    beforeYouGo: "È fuori dal centro: conviene arrivare in metropolitana, fermata Bicocca.",
    slots: ["11:00"],
  },
  {
    slug: "fumetti-e-supereroi",
    title: "Fumetti e supereroi",
    venue: "wow-fumetto",
    category: "arte",
    ageMin: 7,
    ageMax: 12,
    priceCents: 1100,
    durationMinutes: 90,
    summary: "Come nasce una tavola: matita, inchiostro e una storia da inventare.",
    aboutTitle: "Prima il segno, poi la storia.",
    aboutText:
      "Un laboratorio di fumetto vero: si costruisce una vignetta, si aggiungono le parole e si scopre perché il ritmo conta più del disegno.",
    image: "art",
    providerUrl: "https://www.wowfumetto.it/",
    beforeYouGo: "Si disegna in piedi su tavoli grandi: abiti comodi.",
    slots: ["15:00"],
  },
  {
    slug: "un-viaggio-nel-mondo",
    title: "Un viaggio nel mondo",
    venue: "mudec",
    category: "musei",
    ageMin: 6,
    ageMax: 10,
    priceCents: 900,
    durationMinutes: 90,
    summary: "Oggetti da altri continenti, e una domanda semplice: a cosa servivano?",
    aboutTitle: "Diverso non vuol dire strano.",
    aboutText:
      "Un percorso tra le collezioni etnografiche, con oggetti da osservare da vicino e storie da ricostruire insieme.",
    image: "garden",
    providerUrl: "https://www.mudec.it/",
    beforeYouGo: "Zona Tortona: nei weekend il parcheggio è difficile.",
    slots: ["10:30"],
  },
  {
    slug: "officina-delle-idee",
    title: "Officina delle idee",
    venue: "fabbrica-vapore",
    category: "arte",
    ageMin: 6,
    ageMax: 10,
    priceCents: 0,
    durationMinutes: 120,
    summary: "Legno, stoffa e attrezzi veri, per costruire qualcosa che sta in piedi.",
    aboutTitle: "Fare, disfare, rifare.",
    aboutText:
      "Un laboratorio lungo, dove il tempo serve: si progetta, si costruisce, si sbaglia e si ricomincia. Si esce con l'oggetto finito.",
    image: "science",
    providerUrl: "https://www.fabbricadelvapore.org/",
    beforeYouGo: "Due ore piene: portare una merenda.",
    slots: ["10:00"],
  },
  {
    slug: "re-e-regine-a-palazzo-reale",
    title: "Re e regine a Palazzo Reale",
    venue: "palazzo-reale",
    category: "musei",
    ageMin: 7,
    ageMax: 11,
    priceCents: 1200,
    durationMinutes: 75,
    summary: "Sale enormi, specchi e un palazzo che racconta chi ci ha abitato.",
    aboutTitle: "Chi dormiva qui?",
    aboutText:
      "Una visita a tappe con una domanda per ogni sala, per ricostruire la vita di chi abitava il palazzo, tra obblighi e piccoli privilegi.",
    image: "art",
    providerUrl: "https://www.palazzorealemilano.it/",
    beforeYouGo: "Le mostre temporanee cambiano spesso: controllare cosa è aperto.",
    slots: ["11:00", "16:00"],
  },
  {
    slug: "giochi-al-parco-sempione",
    title: "Giochi al Parco Sempione",
    venue: "parco-sempione",
    category: "natura",
    ageMin: 4,
    ageMax: 10,
    priceCents: 0,
    durationMinutes: 90,
    summary: "Giochi di gruppo all'aperto, con l'Arena e il castello sullo sfondo.",
    aboutTitle: "Correre è imparare.",
    aboutText:
      "Una serie di giochi semplici che funzionano anche con gruppi che non si conoscono: si formano squadre diverse a ogni giro.",
    image: "garden",
    providerUrl: "https://www.comune.milano.it/",
    beforeYouGo: "All'aperto e gratuito: se piove si salta.",
    slots: ["10:30", "16:00"],
  },
  {
    slug: "miniature-e-meraviglie",
    title: "Miniature e meraviglie",
    venue: "poldi-pezzoli",
    category: "arte",
    ageMin: 7,
    ageMax: 11,
    priceCents: 900,
    durationMinutes: 75,
    summary: "Una casa-museo piena di oggetti piccolissimi da trovare.",
    aboutTitle: "Tutto in piccolo.",
    aboutText:
      "Orologi, vetri e armi decorate: una visita a caccia dei dettagli, con una lente e un elenco di cose da scovare.",
    image: "art",
    providerUrl: "https://www.museopoldipezzoli.it/",
    beforeYouGo: "Le sale sono numerose: la visita resta volutamente breve.",
    slots: ["15:30"],
  },
  {
    slug: "dietro-le-quinte-della-scala",
    title: "Dietro le quinte della Scala",
    venue: "teatro-alla-scala",
    category: "musei",
    ageMin: 8,
    ageMax: 12,
    priceCents: 1400,
    durationMinutes: 60,
    summary: "Il museo del teatro, i costumi e il palco visto da vicino.",
    aboutTitle: "Il rumore prima dello spettacolo.",
    aboutText:
      "Bozzetti, costumi e strumenti: si scopre quanto lavoro c'è dietro una sera di opera, e cosa succede quando il sipario è chiuso.",
    image: "art",
    providerUrl: "https://www.teatroallascala.org/",
    beforeYouGo: "A volte il palco è chiuso per prove: il museo resta visitabile.",
    slots: ["10:00", "14:00"],
  },
  {
    slug: "il-duomo-di-carta",
    title: "Il Duomo di carta",
    venue: "museo-diocesano",
    category: "arte",
    ageMin: 6,
    ageMax: 10,
    priceCents: 800,
    durationMinutes: 90,
    summary: "Modelli, progetti e un laboratorio per costruire una guglia.",
    aboutTitle: "Come si costruisce una cattedrale.",
    aboutText:
      "Si parte dai modelli in scala del museo e si arriva a costruire una struttura che regge davvero, con carta e stecchini.",
    image: "science",
    providerUrl: "https://www.museodiocesano.it/",
    beforeYouGo: "Il laboratorio richiede un adulto per ogni due bambini.",
    slots: ["15:00"],
  },
  {
    slug: "storie-in-biblioteca-sormani",
    title: "Storie in biblioteca",
    venue: "biblioteca-sormani",
    category: "musei",
    ageMin: 4,
    ageMax: 8,
    priceCents: 0,
    durationMinutes: 60,
    summary: "Letture ad alta voce in una biblioteca storica, con cuscini e tappeti.",
    aboutTitle: "Silenzio, si racconta.",
    aboutText:
      "Una selezione di albi illustrati letti ad alta voce, con il tempo di guardare le figure e di commentarle insieme.",
    image: "art",
    providerUrl: "https://www.comune.milano.it/",
    beforeYouGo: "Ingresso libero fino a esaurimento posti.",
    slots: ["17:00"],
  },
  {
    slug: "orto-sul-tetto",
    title: "Orto sul tetto",
    venue: "cascina-cuccagna",
    category: "natura",
    ageMin: 5,
    ageMax: 10,
    priceCents: 0,
    durationMinutes: 90,
    summary: "Una cascina in città, con orto, galline e terra sotto le unghie.",
    aboutTitle: "Da dove arriva il cibo.",
    aboutText:
      "Semina, raccolta e cura delle piante: i bambini lavorano in piccoli gruppi e portano a casa quello che hanno coltivato.",
    image: "garden",
    providerUrl: "https://cascinacuccagna.org/",
    beforeYouGo: "Si sporca: guanti forniti, ma vestiti vecchi.",
    slots: ["10:00", "15:00"],
  },
  {
    slug: "storie-di-pietra-e-acqua",
    title: "Storie di pietra e acqua",
    venue: "castello-sforzesco",
    category: "natura",
    ageMin: 6,
    ageMax: 9,
    priceCents: 0,
    durationMinutes: 75,
    summary: "Un percorso tra i cortili a caccia di animali scolpiti e fontane.",
    aboutTitle: "La città raccontata dalle pietre.",
    aboutText:
      "Ogni pietra del castello ha un dettaglio: un muso, una foglia, un volto. Si cammina, si cerca, si disegna quello che si trova.",
    image: "garden",
    providerUrl: "https://www.milanocastello.it/",
    beforeYouGo: "Percorso misto dentro e fuori: meglio un giubbotto.",
    slots: ["11:00"],
  },
  {
    slug: "suoni-e-vibrazioni",
    title: "Suoni e vibrazioni",
    venue: "museo-scienza-milano",
    category: "scienza",
    ageMin: 7,
    ageMax: 11,
    priceCents: 1000,
    durationMinutes: 90,
    summary: "Come nasce un suono, perché si sente e cosa succede se lo disegni.",
    aboutTitle: "Vedere con le orecchie.",
    aboutText:
      "Diapason, corde e microfoni: si prova a far nascere un suono e poi lo si guarda su uno schermo, per capire che forma ha.",
    image: "science",
    providerUrl: "https://www.museoscienza.org/",
    beforeYouGo: "Ci sono suoni forti in una sala: si può saltare quella parte.",
    slots: ["10:30", "15:30"],
  },
  {
    slug: "disegnare-la-citta",
    title: "Disegnare la città",
    venue: "fabbrica-vapore",
    category: "arte",
    ageMin: 8,
    ageMax: 12,
    priceCents: 0,
    durationMinutes: 105,
    summary: "Un taccuino, una matita e una passeggiata per disegnare quello che si vede.",
    aboutTitle: "Guardare come un architetto.",
    aboutText:
      "Si esce con il taccuino e si torna con tre disegni: una facciata, un dettaglio e una cosa che nessun altro ha notato.",
    image: "art",
    providerUrl: "https://www.fabbricadelvapore.org/",
    beforeYouGo: "Si cammina: scarpe comode, matita fornita.",
    slots: ["16:00"],
  },
  {
    slug: "il-museo-dei-perche",
    title: "Il museo dei perché",
    venue: "museo-storia-naturale-milano",
    category: "natura",
    ageMin: 5,
    ageMax: 9,
    priceCents: 800,
    durationMinutes: 75,
    summary: "Una visita costruita sulle domande dei bambini, non sulle date.",
    aboutTitle: "Ogni vetrina una domanda.",
    aboutText:
      "Si sceglie una domanda all'inizio e si prova a rispondere guardando gli animali veri: perché quel becco, perché quella coda.",
    image: "science",
    providerUrl: "https://www.comune.milano.it/",
    beforeYouGo: "Adatto anche ai più piccoli: percorso breve e con soste.",
    slots: ["10:00"],
  },
  {
    slug: "mappe-e-bussole",
    title: "Mappe e bussole",
    venue: "parco-sempione",
    category: "natura",
    ageMin: 7,
    ageMax: 11,
    priceCents: 0,
    durationMinutes: 90,
    summary: "Orientarsi in un parco con una mappa disegnata a mano e una bussola vera.",
    aboutTitle: "Trovare la strada.",
    aboutText:
      "Si impara a leggere una mappa e a usare una bussola, poi si prova a raggiungere un punto preciso senza chiedere aiuto.",
    image: "garden",
    providerUrl: "https://www.comune.milano.it/",
    beforeYouGo: "All'aperto, gratuito, con materiale fornito.",
    slots: ["10:00"],
  },
];

function nextSaturday(from: Date): Date {
  const date = new Date(from);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const delta = (6 - day + 7) % 7;
  date.setDate(date.getDate() + delta);
  return date;
}

function isoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function seedDatabase(db: DatabaseSync): void {
  const cityIds = new Map<string, number>();
  for (const city of cities) {
    const result = db
      .prepare("INSERT INTO cities (slug, name, region, lat, lng, available) VALUES (?, ?, ?, ?, ?, ?)")
      .run(city.slug, city.name, city.region, city.lat, city.lng, city.available ? 1 : 0);
    cityIds.set(city.slug, Number(result.lastInsertRowid));
  }

  const venueIds = new Map<string, number>();
  for (const venue of venues) {
    const result = db
      .prepare("INSERT INTO venues (slug, name, address, city_id, lat, lng) VALUES (?, ?, ?, ?, ?, ?)")
      .run(venue.slug, venue.name, venue.address, cityIds.get(venue.city)!, venue.lat, venue.lng);
    venueIds.set(venue.slug, Number(result.lastInsertRowid));
  }

  const firstSaturday = nextSaturday(new Date());
  const insertSession = db.prepare("INSERT INTO sessions (activity_id, starts_at, ends_at) VALUES (?, ?, ?)");

  for (const activity of activities) {
    const result = db
      .prepare(
        `INSERT INTO activities
          (slug, title, venue_id, category, age_min, age_max, price_cents, duration_minutes,
           summary, about_title, about_text, image, provider_url, before_you_go)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        activity.slug,
        activity.title,
        venueIds.get(activity.venue)!,
        activity.category,
        activity.ageMin,
        activity.ageMax,
        activity.priceCents,
        activity.durationMinutes,
        activity.summary,
        activity.aboutTitle,
        activity.aboutText,
        activity.image,
        activity.providerUrl,
        activity.beforeYouGo,
      );
    const activityId = Number(result.lastInsertRowid);

    for (let week = 0; week < 6; week += 1) {
      for (const slot of activity.slots) {
        const day = new Date(firstSaturday);
        day.setDate(day.getDate() + week * 7);
        const days = slot === activity.slots[0] ? 0 : week % 2 === 0 ? 1 : 0;
        day.setDate(day.getDate() + days);
        insertSession.run(
          activityId,
          `${isoDate(day)}T${slot}`,
          `${isoDate(day)}T${addMinutes(slot, activity.durationMinutes)}`,
        );
      }
    }
  }
}
