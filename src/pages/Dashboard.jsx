import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getEvents } from "../services/events";
import EventCard from "../components/EventCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { Plus } from "lucide-react";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [createdEvents, setCreatedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserEvents() {
      try {
        const events = await getEvents();
        // Filter events created by user
        const myEvents = events.filter(e => e.uid === currentUser.uid || e.createdBy === currentUser.uid);
        
        // Filter events user has joined
        const myJoined = events.filter(e => e.attendees && e.attendees.includes(currentUser.uid));
        
        setCreatedEvents(myEvents);
        setJoinedEvents(myJoined);
      } catch (error) {
        console.error("Error fetching dashboard events:", error);
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) {
      fetchUserEvents();
    }
  }, [currentUser]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {currentUser.email}</p>
        </div>
        <Link 
          to="/events/new"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4"/> Create Event
        </Link>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Events You Are Hosting <span className="bg-primary-100 text-primary-800 text-sm py-1 px-2.5 rounded-full">{createdEvents.length}</span>
          </h2>
          {createdEvents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">You haven't created any events yet.</p>
              <Link to="/events/new" className="text-primary-600 font-medium hover:text-primary-800">Create your first event</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Events You Joined <span className="bg-gray-100 text-gray-800 text-sm py-1 px-2.5 rounded-full">{joinedEvents.length}</span>
          </h2>
          {joinedEvents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">You haven't joined any events yet.</p>
              <Link to="/events" className="text-primary-600 font-medium hover:text-primary-800">Explore events</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
