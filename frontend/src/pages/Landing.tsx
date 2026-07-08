import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/landing/Hero';
import { Services } from '@/components/landing/Services';
import { Gallery } from '@/components/landing/Gallery';
import { Schedule } from '@/components/landing/Schedule';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQ } from '@/components/landing/FAQ';
import { LocationMap } from '@/components/landing/Map';

export default function Landing() {
  return (
    <div>
      <Header />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <Schedule />
        <Testimonials />
        <FAQ />
        <LocationMap />
      </main>
      <Footer />
    </div>
  );
}
