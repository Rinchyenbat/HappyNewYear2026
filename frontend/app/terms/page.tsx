import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - New Year Letters',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-6 py-10 max-w-3xl">
        <div className="glass-effect rounded-lg letter-shadow p-6 md:p-10">
          <h1 className="text-3xl font-serif font-bold mb-4">Terms of Service</h1>
          <p className="text-snow-dark mb-6">
            By using New Year Letters, you agree to the terms below.
          </p>

          <section className="space-y-4 text-snow-dark">
            <div>
              <h2 className="text-xl font-serif font-semibold text-snow mb-2">Eligibility</h2>
              <p>
                Access is limited to pre-approved accounts. If you are not approved, you may not
                use the service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold text-snow mb-2">Acceptable use</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Do not abuse, spam, harass, or attempt unauthorized access.</li>
                <li>Do not upload illegal content.</li>
                <li>Respect others and keep messages appropriate.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold text-snow mb-2">Content</h2>
              <p>
                You are responsible for content you create. We may remove content or restrict
                access to protect users and the service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold text-snow mb-2">Disclaimer</h2>
              <p>
                The service is provided “as is” without warranties. We do not guarantee uninterrupted
                operation.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold text-snow mb-2">Changes</h2>
              <p>
                We may update these terms from time to time by updating this page.
              </p>
            </div>
          </section>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/privacy" className="text-gold hover:text-gold-light transition-colors">
              Privacy Policy
            </Link>
            <Link href="/data-deletion" className="text-gold hover:text-gold-light transition-colors">
              Data Deletion Instructions
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
