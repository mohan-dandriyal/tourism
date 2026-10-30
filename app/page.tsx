import Header from "@/app/components/Header";
import Hero from '@/app/components/Hero'
import Service from "@/app/components/Service";
import About from "./components/About";
import Testimonials from "./components/Testimonials";
import PopularDestinations from "./components/PopularDestinations";
import WhyChooseUs from "./components/WhyChooseUs";
import ContactSection from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div>
      <Header />


      <div>
        <Hero />
      </div>

       <div>
        <About />
      </div>

         <div>
        <Service />
      </div>

      <div>
        <PopularDestinations />
      </div>

      <div>
        <WhyChooseUs />
      </div>

      <div>
        <Testimonials />
      </div>

       <div>
        <ContactSection />
      </div>

      <div>
        <Footer />
      </div>

      {/* <div>
      <LatestTours />
    </div> */}

    </div>
  );
}
