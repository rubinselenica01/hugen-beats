import { useLocation } from 'react-router-dom'
import { Footer } from '../components/layout/Footer.jsx'
import { TopNav } from '../components/layout/TopNav.jsx'
import { ContactForm } from '../components/ContactForm.jsx'
import { contactPageHeadingFromState } from '../constants/contactPage.js'
import { footer, navLinks } from '../data/homeContent.js'

export default function ContactPage() {
  const location = useLocation()
  const heading = contactPageHeadingFromState(location.state)

  return (
    <div className="page-shell">
      <TopNav links={navLinks} />
      <main className="relative flex w-full flex-1 flex-col items-center bg-gradient-to-b from-nav via-background-dark to-background-dark">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(27, 187, 131, 0.12), transparent 55%)',
          }}
        />
        <div className="page-container relative z-10 flex w-full max-w-[720px] flex-col gap-10 px-6 py-12 md:px-10 md:py-16">
          <header className="text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
              {heading}
            </h1>
          </header>
          <ContactForm />
        </div>
      </main>
      <Footer
        email={footer.email}
        location={footer.location}
        legal={footer.legal}
        developerCredit={footer.developerCredit}
        socialLinks={footer.socialLinks}
      />
    </div>
  )
}
