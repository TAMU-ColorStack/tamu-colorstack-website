import Hero from '../components/sections/Hero';
//import Joinus from "../components/sections/Joinus"
import Mission from '../components/sections/Mission';
import Sponsor from '../components/sections/Sponsor';
import Navbar from '../components/layout/Navbar/Navbar';
import Footer from '../components/layout/Footer/Footer';
import Officers from '../components/sections/Officers';
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Mission />
      <Officers />
      <Sponsor />
      <Footer />
    </>
  );
}
