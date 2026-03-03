import LogoLoop from "@/app/components/ui/LogoLoop";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiPrisma,
  SiSupabase,
  SiN8N,
} from "react-icons/si";
import { TbBolt } from "react-icons/tb";

const techLogos = [
  {
    node: <SiReact className="text-[#61DAFB]" />,
    title: "React",
    href: "https://react.dev",
  },
  {
    node: <SiNextdotjs className="text-white" />,
    title: "Next.js",
    href: "https://nextjs.org",
  },
  {
    node: <SiTypescript className="text-[#3178C6]" />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiTailwindcss className="text-[#06B6D4]" />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
  {
    node: <SiPrisma className="text-white" />,
    title: "Prisma",
    href: "https://www.prisma.io",
  },
  {
    node: <SiSupabase className="text-[#3ECF8E]" />,
    title: "Supabase",
    href: "https://supabase.com",
  },
  {
    node: <SiN8N className="text-[#FF6C37]" />,
    title: "n8n",
    href: "https://n8n.io",
  },
  {
    node: <TbBolt className="text-[#F55036]" />,
    title: "Groq AI",
    href: "https://groq.com",
  },
];

export default function TechnologyUsed() {
  return (
    <div className="relative bg-[#110816] py-24 sm:py-32 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Powered by Modern Tech
          </h2>
          <p className="text-lg leading-8 text-gray-400">
            Built with a robust stack to ensure a secure, fast, and reliable
            experience for your mental health journey.
          </p>
        </div>

        <div className="relative h-32 flex items-center">
          <LogoLoop
            logos={techLogos}
            speed={40}
            direction="left"
            logoHeight={50}
            gap={80}
            hoverSpeed={0}
            scaleOnHover
            fadeOut={true}
            fadeOutColor="#0B1120"
            ariaLabel="Technology partners"
          />
        </div>
      </div>
    </div>
  );
}
