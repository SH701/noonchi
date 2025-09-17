import type { ComponentType } from "react";

type Slide = {
  options: any;
  id: number;
  title: string;
  desc: string;
  icon: ComponentType; // ✅ React 컴포넌트 타입
  img?: string;
};

export const slides: Slide[] = [
  {
    id: 1,
    title: "Worried about sounding rude in Korean?",
    desc: "Noonchi helps you speak naturally and respectfully without second guessing.",
    // icon: First,
  },
  {
    id: 2,
    title: "Make Your Korean, rewritten politely",
    desc: "With Noonchi Coach, get 3 better ways to say it from casual to super formal.",
    // icon: Second,
  },
  {
    id: 3,
    title: "Try adjusting your tone with the Noonchi Switch!",
    desc: "Slide to shift your tone and see your message transform.",
    // icon: Third,
  },
  {
    id: 4,
    title: "Powerd by K-AI trained for Korean culture",
    desc: "Noonchi is built with K-culture AI, fine-tuned on thousands of real Korean conversations.",
    // icon: Fourth,
  },
  {
    id: 5,
    title: "Ready to start?",
    desc: "Practice honorifics naturally by chatting with K-Etiquette.",
    // icon: Fifth,
  },
];
