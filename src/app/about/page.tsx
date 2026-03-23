import Navbar from "@/app/components/home/Navbar";
import AboutHero from "@/app/components/about/AboutHero";
import ProductPillars from "@/app/components/about/ProductPillars";
import ArchitectureFlow from "@/app/components/about/ArchitectureFlow";
import StackExplainer from "@/app/components/about/StackExplainer";
import RoadmapCreator from "@/app/components/about/RoadmapCreator";
import AboutCTA from "@/app/components/about/AboutCTA";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />
      <AboutHero />

      <div className="relative rounded-t-[3rem] bg-[#f6f1eb] text-slate-950 shadow-[0_-30px_120px_rgba(15,23,42,0.25)] sm:rounded-t-[4rem]">
        <ProductPillars />
        <ArchitectureFlow />
        <StackExplainer />
        <RoadmapCreator />
        <AboutCTA />
      </div>
    </main>
  );
}
