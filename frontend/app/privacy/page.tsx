import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - New Year Letters',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-6 py-10 max-w-3xl">
        <div className="glass-effect rounded-lg letter-shadow p-6 md:p-10">
          <h1 className="text-3xl font-serif font-bold mb-4">Privacy Policy</h1>
          <p className="text-snow-dark mb-6">
            This Privacy Policy explains how New Year Letters collects, uses, and protects
            your information.
          </p>

          <section className="space-y-4 text-snow-dark">
            <div>
              <h2 className="text-xl font-serif font-semibold text-snow mb-2">Information we collect</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Account identifiers from Facebook during login (e.g., Facebook user ID).</li>
                <li>App data you create (letters and messages).</li>
                <li>Basic security logs (e.g., login time, IP address, user agent) for abuse prevention.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold text-snow mb-2">How we use information</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>To authenticate you and run the admin approval workflow.</li>
                <li>To deliver core features (sending/receiving letters).</li>
                <li>To prevent abuse and maintain service security.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold text-snow mb-2">Sharing</h2>
              <p>
                We do not sell your personal information. We only share information when required
                to operate the service (e.g., hosting providers) or if required by law.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold text-snow mb-2">Data retention</h2>
              <p>
                We retain data only as long as necessary to provide the service and for legitimate
                operational and security needs.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold text-snow mb-2">Contact</h2>
              <p>
                If you have questions or requests related to privacy, contact the app owner.
              </p>
            </div>
          </section>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/terms" className="text-gold hover:text-gold-light transition-colors">
              Terms of Service
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
