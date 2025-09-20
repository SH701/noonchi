import { LOTTIE_PATHS } from "@/lib/lottie-loader";

type Slide = {
  id: number;
  title: string;
  desc: string;
  icon: any; // RN에서 require()로 가져온 JSON
  img?: string;
};

export const slides: Slide[] = [
  {
    id: 1,
    title: "Worried about sounding rude in Korean?",
    desc: "Noonchi helps you speak naturally and respectfully without second guessing.",
    icon: LOTTIE_PATHS.ON_1,
  },
  {
    id: 2,
    title: "Make Your Korean, rewritten politely",
    desc: "With Noonchi Coach, get 3 better ways to say it from casual to super formal.",
    icon: LOTTIE_PATHS.ON_2,
  },
  {
    id: 3,
    title: "Try adjusting your tone with the Noonchi Switch!",
    desc: "Slide to shift your tone and see your message transform.",
    icon: LOTTIE_PATHS.ON_3,
  },
  {
    id: 4,
    title: "Powered by K-AI trained for Korean culture",
    desc: "Noonchi is built with K-culture AI, fine-tuned on thousands of real Korean conversations.",
    icon: LOTTIE_PATHS.ON_4_1,
  },
  {
    id: 5,
    title: "Ready to start?",
    desc: "Practice honorifics naturally by chatting with K-Etiquette.",
    icon: LOTTIE_PATHS.ON_5,
  },
];
