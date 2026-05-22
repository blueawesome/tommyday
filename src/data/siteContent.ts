export type ActionLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type VisualItem = {
  src: string;
  alt: string;
  note?: string;
};

export type MediaEmbed = {
  id: string;
  title: string;
  description?: string;
  embedUrl?: string;
};

export type MediaPageData = {
  title: string;
  description: string;
  kicker?: string;
  visualItems?: VisualItem[];
  actions?: ActionLink[];
  intro: string;
  sections: Array<{
    title: string;
    body: string;
    links?: ActionLink[];
    embeds?: MediaEmbed[];
  }>;
};

export const musicPage: MediaPageData = {
  title: "Music",
  kicker: "Songs and side roads",
  description:
    "Songs, recordings, side projects, and the odd musical detour from Tommy Day.",
  visualItems: [
    {
      src: "/art/placeholders/godzilla-vs-louis-armstrong.jpg",
      alt: "A collage portrait used as a placeholder music header scrap.",
      note: "Placeholder scrap",
    },
    {
      src: "/art/placeholders/star-boy.jpg",
      alt: "A collage detail used as a placeholder music header scrap.",
    },
  ],
  actions: [
    { label: "YouTube", href: "#", external: false },
    { label: "Bandcamp", href: "#", external: false },
  ],
  intro:
    "Music has always run alongside the collage work. Some of it is solo, some of it is collaborative, and some of it lives in half-finished notebooks until it finally turns into a song.",
  sections: [
    {
      title: "Secret Oats",
      body:
        "Secret Oats is the band project I have with my friend Jay Adams. It is a place for songs, experiments, and whatever else grows legs when the two of us start following an idea.",
      links: [
        { label: "Spotify", href: "#", external: false },
        { label: "YouTube", href: "#", external: false },
        { label: "Bandcamp", href: "#", external: false },
      ],
      embeds: [
        {
          id: "music-001",
          title: "Secret Oats video placeholder",
          description:
            "Swap this with a real performance clip, demo, or studio session when you are ready.",
          embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        },
      ],
    },
    {
      title: "Loose songs and recordings",
      body:
        "This page can also hold solo songs, odd recordings, or short writeups when a track deserves a little context beyond a link.",
      embeds: [
        {
          id: "music-002",
          title: "Second music embed placeholder",
          description:
            "A second slot for a live clip, a home recording, or a future Secret Oats post.",
          embedUrl: "https://www.youtube.com/embed/oHg5SJYRHA0",
        },
      ],
    },
  ],
};

export const videoPage: MediaPageData = {
  title: "Video",
  kicker: "Moving pictures",
  description:
    "Process videos, short films, experiments, and projects that live better in motion.",
  visualItems: [
    {
      src: "/art/placeholders/june-1985.jpg",
      alt: "A collage cover image used as a placeholder video header scrap.",
      note: "Placeholder scrap",
    },
    {
      src: "/art/placeholders/train.jpg",
      alt: "A collage detail used as a placeholder video header scrap.",
    },
  ],
  actions: [{ label: "@OnTapeShow", href: "#", external: false }],
  intro:
    "Video work sits close to everything else here: collage process, conversation, experiments, and projects that want a little time and sound around them.",
  sections: [
    {
      title: "On Tape",
      body:
        "On Tape is a new show Jay Adams and I are getting started, with its own home at @OnTapeShow on YouTube. This page gives it a place to live alongside other video work instead of feeling disconnected from the rest of the site.",
      links: [{ label: "Visit @OnTapeShow", href: "#", external: false }],
      embeds: [
        {
          id: "video-001",
          title: "On Tape teaser placeholder",
          description:
            "Use this slot for a trailer, first episode, or intro clip once the channel starts filling out.",
          embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        },
      ],
    },
    {
      title: "Process and side work",
      body:
        "This second area can hold collage process clips, short films, or one-off video experiments without turning the page into a giant archive right away.",
      embeds: [
        {
          id: "video-002",
          title: "Studio or process placeholder",
          description:
            "A second embedded video slot for process footage, a short film, or anything adjacent.",
          embedUrl: "https://www.youtube.com/embed/oHg5SJYRHA0",
        },
      ],
    },
  ],
};
