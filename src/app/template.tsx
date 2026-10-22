import { Motion } from "@/components/motion/Motion";

// Il template si rimonta a ogni navigazione: le animazioni d'entrata ripartono su ogni pagina.
export default function Template({ children }: { children: React.ReactNode }) {
  return <Motion>{children}</Motion>;
}
