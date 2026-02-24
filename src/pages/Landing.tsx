import { Navbar } from '@/components/layout/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'

const Landing = () => {
  return (
    <div>
      <Navbar />
      <main className="pt-[72px]">
        <HeroSection />
      </main>
    </div>
  )
}

export default Landing
