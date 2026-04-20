import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getEvent, joinEvent, leaveEvent, deleteEvent } from "../services/events";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { CalendarIcon, MapPinIcon, UsersIcon, ArrowLeft, Trash2, Edit3, Loader2 } from "lucide-react";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchEventInfo() {
      try {
        const data = await getEvent(id);
        if (!data) {
          toast.error("Event not found");
          navigate("/events");
          return;
        }
        setEvent(data);
      } catch (error) {
        console.error("Failed to load event", error);
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    }
    fetchEventInfo();
  }, [id, navigate]);

  const handleJoin = async () => {
    if (!currentUser) {
      toast.error("Please log in to join events");
      navigate("/login");
      return;
    }
    setActionLoading(true);
    try {
      await joinEvent(id, currentUser.uid);
      setEvent(prev => ({
        ...prev,
        attendees: [...(prev.attendees || []), currentUser.uid]
      }));
      toast.success("You have successfully joined the event!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to join event");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    setActionLoading(true);
    try {
      await leaveEvent(id, currentUser.uid);
      setEvent(prev => ({
        ...prev,
        attendees: prev.attendees.filter(uid => uid !== currentUser.uid)
      }));
      toast.success("You have left the event");
    } catch (error) {
      console.error(error);
      toast.error("Failed to leave event");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      setActionLoading(true);
      try {
        await deleteEvent(id);
        toast.success("Event deleted successfully");
        navigate("/dashboard");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete event");
        setActionLoading(false);
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!event) return null;

  const isCreator = currentUser && (event.uid === currentUser.uid || event.createdBy === currentUser.uid);
  const hasJoined = currentUser && event.attendees?.includes(currentUser.uid);
  const attendeeCount = event.attendees?.length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/events" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary-100 text-primary-800 border border-primary-200">
              {event.category || 'General'}
            </span>
            
            {isCreator && (
              <div className="flex gap-2">
                <Link to={`/events/${id}/edit`} className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <Edit3 className="w-4 h-4 mr-1.5" /> Edit
                </Link>
                <button onClick={handleDelete} disabled={actionLoading} className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50">
                  <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                </button>
              </div>
            )}
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{event.title}</h1>

          <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center text-gray-600 font-medium">
              <CalendarIcon className="w-5 h-5 mr-2 text-primary-500" />
              {event.date ? new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'No date specified'}
            </div>
            <div className="flex items-center text-gray-600 font-medium">
              <MapPinIcon className="w-5 h-5 mr-2 text-primary-500" />
              {event.location || 'Location TBA'}
            </div>
            <div className="flex items-center text-gray-600 font-medium">
              <UsersIcon className="w-5 h-5 mr-2 text-primary-500" />
              {attendeeCount} {attendeeCount === 1 ? 'attendee' : 'attendees'}
            </div>
          </div>

          <div className="prose prose-primary max-w-none mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4">About this event</h3>
            <p className="whitespace-pre-line text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          {!isCreator && (
            <div className="mt-8 flex justify-center bg-gray-50 p-6 rounded-xl border border-gray-100">
              {!currentUser ? (
                <Link to="/login" className="inline-flex justify-center flex-col items-center">
                  <span className="mb-2 text-gray-600 font-medium">Want to attend?</span>
                  <span className="inline-flex py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none">
                    Log in to RSVP
                  </span>
                </Link>
              ) : hasJoined ? (
                <div className="text-center w-full sm:w-auto">
                  <p className="text-green-600 font-semibold mb-3 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> You're going to this event!
                  </p>
                  <button
                    onClick={handleLeave}
                    disabled={actionLoading}
                    className="w-full sm:w-auto inline-flex justify-center py-2.5 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : null}
                    Cancel RSVP
                  </button>
                </div>
              ) : (
                <div className="text-center w-full sm:w-auto">
                  <p className="text-gray-600 font-medium mb-3">Join other community members!</p>
                  <button
                    onClick={handleJoin}
                    disabled={actionLoading}
                    className="w-full sm:w-auto inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition"
                  >
                    {actionLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2"/> : null}
                    RSVP Now
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
