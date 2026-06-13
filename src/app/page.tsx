import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Expertise from "@/components/Expertise";
import Projects from "@/components/Projects";
import Timeline from "@/components/Timeline";
import SkillsGraph from "@/components/SkillsGraph";
import PortfolioStats from "@/components/PortfolioStats";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Expertise />
      <Projects />
      <Timeline />
      <SkillsGraph />
      <PortfolioStats />
      <Contact />
    </main>
  );
}
