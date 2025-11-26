
global {
  // --- Types ---
  interface Testimonial {
    id?: number;
    name: string;
    image: string;
    addiction: string;
    testimony: string;
    videoUrl?: string;
    // createdAt: string;
  }

  interface BibleVerseReference {
    id: number;
    title: string;
    book: string;
    verse: string;
    verseText: string;
  }

  interface Project {
    id: number;
    brandName: string;
    name: string;
    description: string;
    imageUrl: string;
    projectUrl: string;
    comingSoon?: boolean;
  }

  // interface User {
  //   uid: string;
  //   email?: string;
  //   displayName?: string;
  // }
}

export {};
