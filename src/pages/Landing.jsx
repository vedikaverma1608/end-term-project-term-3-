import { Link } from "react-router-dom";
import { UsersIcon, CalendarIcon, Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Connect with your local community.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              CommunityHub is the central place to discover, create, and engage with events happening around you. Stop searching your social feeds and start exploring.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/events"
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition"
              >
                Explore Events
              </Link>
              <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 flex items-center gap-1 hover:text-primary-600 transition">
                Host an Event <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="py-24 sm:py-32 bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Discover everything</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to run community events
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              From finding the perfect weekend activity to managing RSVP counts for a tech meetup, we have got you covered.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <CalendarIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Easy Discovery
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">Find events near you or online, tailored to your interests.</dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <UsersIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  RSVP & Manage
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">Join events with one click. Manage your attendees effortlessly.</dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600">
                    <Sparkles className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  AI Powered
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">Let Gemini AI write stunning event descriptions for you automatically.</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
