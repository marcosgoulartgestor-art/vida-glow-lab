import { Navbar } from '@/components/layout/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { BiomarkersSection } from '@/components/landing/BiomarkersSection'
import { MonitorSection } from '@/components/landing/MonitorSection'
import { ComparisonSection } from '@/components/landing/ComparisonSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { CtaSection } from '@/components/landing/CtaSection'
import { Footer } from '@/components/layout/Footer'

const Landing = () => {
  return (
    <div>
      <Navbar />
      <main className="pt-14 sm:pt-[72px]">
        <HeroSection />
        <div id="como-funciona">
          <HowItWorks />
        </div>
        <div id="biomarcadores">
          <BiomarkersSection />
        </div>
        <MonitorSection />
        <ComparisonSection />
        <TestimonialsSection />
        <div id="precos">
          <PricingSection />
        </div>
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}

export default Landing
