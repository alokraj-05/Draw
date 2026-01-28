import React from "react"

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen text-zinc-100 relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute right-[-20%] top-[10%] w-175 h-225 blur-[160px] opacity-60 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.45),transparent_70%)] pointer-events-none"/>
      <div className="absolute left-[10%] bottom-[10%] w-150 h-100 blur-[160px] opacity-40 bg-[radial-gradient(ellipse_at_30%_70%,rgba(168,85,247,0.45),transparent_75%)] pointer-events-none"/>
      <div className="absolute left-[20%] top-[60%] w-125 h-87.5 blur-[140px] opacity-30 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.35),transparent_80%)] pointer-events-none"/>

      <div className="relative z-10 mx-60 pt-24 pb-40">

        <h1 className="text-7xl font-bold italiana-regular tracking-tight">
          Privacy <span className="text-[#f6eed8]">Policy</span>
        </h1>

        <p className="text-zinc-400 max-w-4xl mt-6 p-regular text-justify">
          Draw is an open-source application created to provide a free and simple visual workspace
          for expressing ideas. We value your privacy and are committed to being transparent about
          how your data is accessed and used.
        </p>

        {/* Section */}
        <div className="mt-14 space-y-10 max-w-5xl">

          <section>
            <h2 className="text-3xl syne-semibold text-gray-200">Information We Access</h2>
            <p className="text-zinc-400 mt-3 p-regular text-justify">
              Draw uses Google OAuth 2.0 for authentication. During login, the application requests
              the following scopes:
            </p>
            <ul className="list-disc list-inside mt-3 text-zinc-400 p-regular space-y-1">
              <li>User profile (name, email address, profile picture)</li>
              <li>Google Drive access (drive.files)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl syne-semibold text-gray-200">Why We Access Your Profile</h2>
            <p className="text-zinc-400 mt-3 p-regular text-justify">
              Your name, email address, and profile picture are used only to identify you inside the
              application and to personalize your experience. This information is not permanently
              stored in our database.
            </p>
          </section>

          <section>
            <h2 className="text-3xl syne-semibold text-gray-200">Why We Access Google Drive</h2>
            <p className="text-zinc-400 mt-3 p-regular text-justify">
              Draw stores your drawing data directly in your own Google Drive. This approach allows
              us to provide the service free of charge while avoiding centralized storage of your
              creative work.
            </p>
            <p className="text-zinc-400 mt-3 p-regular text-justify">
              The application only accesses files that are created by Draw itself. It does not
              scan, read, or modify any other files in your Google Drive.
            </p>
          </section>

          <section>
            <h2 className="text-3xl syne-semibold text-gray-200">Data Storage</h2>
            <p className="text-zinc-400 mt-3 p-regular text-justify">
              No drawing data is stored on Draw servers. The only information stored by the
              application is:
            </p>
            <ul className="list-disc list-inside mt-3 text-zinc-400 p-regular space-y-1">
              <li>Your Google user ID</li>
              <li>A refresh token required to access your Drive files</li>
            </ul>
            <p className="text-zinc-400 mt-3 p-regular text-justify">
              This behavior can be independently verified by reviewing the project’s open-source
              codebase on GitHub.
            </p>
          </section>

          <section>
            <h2 className="text-3xl syne-semibold text-gray-200">Transparency and Open Source</h2>
            <p className="text-zinc-400 mt-3 p-regular text-justify">
              Draw is fully open source. We believe transparency is essential for trust, and users
              are encouraged to review the source code to understand exactly how their data is
              handled.
            </p>
          </section>

          <section>
            <h2 className="text-3xl syne-semibold text-gray-200">Reauthentication</h2>
            <p className="text-zinc-400 mt-3 p-regular text-justify">
              In some cases, Google may revoke refresh tokens automatically. When this happens, users
              may be required to log in again to continue using the service.
            </p>
          </section>

          <section>
            <h2 className="text-3xl syne-semibold text-gray-200">Security</h2>
            <p className="text-zinc-400 mt-3 p-regular text-justify">
              We take reasonable technical measures to protect authentication data and prevent
              unauthorized access. However, no system can be guaranteed to be completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-3xl syne-semibold text-gray-200">Third-Party Services</h2>
            <p className="text-zinc-400 mt-3 p-regular text-justify">
              Draw relies on Google services for authentication and storage. Use of these services
              is subject to Google’s own privacy policies and terms.
            </p>
          </section>

          <section>
            <h2 className="text-3xl syne-semibold text-gray-200">Changes to This Policy</h2>
            <p className="text-zinc-400 mt-3 p-regular text-justify">
              This Privacy Policy may be updated from time to time. Any changes will be reflected on
              this page. Continued use of the application after updates indicates acceptance of the
              revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-3xl syne-semibold text-gray-200">Our Commitment</h2>
            <p className="text-zinc-400 mt-3 p-regular text-justify">
              Draw exists to help users turn imagination into visual form at no cost. Respecting
              user privacy is a core principle of this project and a key reason it remains open
              source.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}

export default Privacy
