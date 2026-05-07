import Navbar from "@/app/components/home/Navbar";
import AboutHero from "@/app/components/about/AboutHero";
import ProductPillars from "@/app/components/about/ProductPillars";
import ArchitectureFlow from "@/app/components/about/ArchitectureFlow";
import StackExplainer from "@/app/components/about/StackExplainer";
import RoadmapCreator from "@/app/components/about/RoadmapCreator";
import AboutCTA from "@/app/components/about/AboutCTA";
import FinalCTA from "@/app/components/landing/FinalCTA";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />
      
      {/* Content wrapper with margin bottom for footer reveal */}
      <div className="relative z-10 bg-[#0f172a] mb-[100vh] transition-all">
        <AboutHero />

        <div className="relative rounded-t-[3rem] rounded-b-[3rem] bg-[#f6f1eb] text-slate-950 shadow-[0_-30px_120px_rgba(15,23,42,0.25)] shadow-[0_20px_80px_rgba(0,0,0,0.4)] sm:rounded-t-[4rem] sm:rounded-b-[4rem] pb-8">
          <ProductPillars />
          <ArchitectureFlow />
          <StackExplainer />
          <RoadmapCreator />
          <AboutCTA />
        </div>
      </div>

      {/* Sticky Footer Reveal */}
      <div className="fixed bottom-0 left-0 right-0 z-0 h-screen w-full">
        <FinalCTA />
      </div>
    </main>
  );
}
