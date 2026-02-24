import { Navbar } from '@/components/layout/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { BiomarkersSection } from '@/components/landing/BiomarkersSection'
import { MonitorSection } from '@/components/landing/MonitorSection'

const Landing = () => {
  return (
    <div>
      <Navbar />
      <main className="pt-[72px]">
        <HeroSection />
        <HowItWorks />
        <BiomarkersSection />
        <MonitorSection />
      </main>
    </div>
  )
}

export default Landing
