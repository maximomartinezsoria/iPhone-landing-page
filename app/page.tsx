import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { Navbar } from "@/components/Navbar";
import { ProductViewer } from "@/components/ProductViewer";

export default function Home() {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <Highlights />
      <ProductViewer />
    </main>
  );
}
