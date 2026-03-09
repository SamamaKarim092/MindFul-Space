import LogoLoop from "@/app/components/ui/LogoLoop";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiPrisma,
  SiSupabase,
  SiN8N,
  SiVercel,
} from "react-icons/si";

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
    node: <SiVercel className="text-slate-950" />,
    title: "Vercel",
    href: "https://vercel.com",
  },
];

export default function TechnologyUsed() {
  return (
    <section id="trust" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="overflow-hidden rounded-[36px] border border-slate-900/10 bg-white/75 p-8 shadow-[0_26px_90px_rgba(148,163,184,0.18)] backdrop-blur-sm sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
                Trust and proof
              </p>
              <h2 className="mt-4 max-w-md text-balance text-3xl font-semibold text-slate-950 sm:text-4xl">
                Modern foundations for a product that handles deeply personal
                moments.
              </h2>
              <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
                The landing experience should feel emotional and beautiful, but
                it also needs credibility. These technologies support the speed,
                security, and reliability behind the product.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Auth + storage", value: "Supabase" },
                { label: "Structured data", value: "Prisma + Postgres" },
                { label: "Deployment", value: "Next.js + Vercel" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[28px] border border-slate-900/10 bg-slate-50 px-5 py-6"
                >
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-3 text-lg font-semibold text-slate-950">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-[28px] border border-slate-900/10 bg-[#f8f5f1] px-4 py-6 sm:px-6">
            <div className="relative flex h-28 items-center">
              <LogoLoop
                logos={techLogos}
                speed={40}
                direction="left"
                logoHeight={44}
                gap={72}
                hoverSpeed={0}
                scaleOnHover
                fadeOut
                fadeOutColor="#f8f5f1"
                ariaLabel="Technology partners"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
