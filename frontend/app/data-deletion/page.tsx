import Link from 'next/link';

export const metadata = {
  title: 'Data Deletion Instructions - New Year Letters',
};

export default function DataDeletionPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-6 py-10 max-w-3xl">
        <div className="glass-effect rounded-lg letter-shadow p-6 md:p-10">
          <h1 className="text-3xl font-serif font-bold mb-4">Data Deletion Instructions</h1>
          <p className="text-snow-dark mb-6">
            If you want your data deleted from New Year Letters, follow the steps below.
          </p>

          <section className="space-y-4 text-snow-dark">
            <div>
              <h2 className="text-xl font-serif font-semibold text-snow mb-2">How to request deletion</h2>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Send a deletion request to the app owner.</li>
                <li>Include your assigned username (shown in the app) or your Instagram ID.</li>
                <li>We will confirm the request and delete associated data from our database.</li>
              </ol>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold text-snow mb-2">What we delete</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your user record.</li>
                <li>Letters and messages associated with your account (where applicable).</li>
                <li>Login logs may be retained for a limited time for security/auditing.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-serif font-semibold text-snow mb-2">Timing</h2>
              <p>
                Requests are typically processed within a reasonable time after verification.
              </p>
            </div>
          </section>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/privacy" className="text-gold hover:text-gold-light transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gold hover:text-gold-light transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
