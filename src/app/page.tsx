import { Hero } from "@/components/hero";
import { QuoteSection } from "@/components/quote-section";
import { SocialProof } from "@/components/social-proof";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Hero />
      <QuoteSection />
      <SocialProof />
      <Footer />
    </main>
  );
}
