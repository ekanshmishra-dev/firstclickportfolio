import Hero from "../components/sections/Hero";
import Ticker from "../components/sections/Ticker";
import BuildShowcase from "../components/sections/BuildShowcase";
import Ecosystem from "../components/sections/Ecosystem";
import WhyUs from "../components/sections/WhyUs";
import Process from "../components/sections/Process";
import FinalCta from "../components/sections/FinalCta";
import { usePageMeta } from "../lib/usePageMeta";

export default function Home() {
  usePageMeta("/");
  return (
    <>
      <Hero />
      <Ticker />
      <BuildShowcase />
      <Ecosystem />
      <WhyUs />
      <Process />
      <FinalCta />
    </>
  );
}
