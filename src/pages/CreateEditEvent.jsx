import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EventForm from "../components/EventForm";
import { createEvent, getEvent, updateEvent } from "../services/events";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function CreateEditEvent() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      async function fetchEvent() {
        try {
          const event = await getEvent(id);
          if (!event) {
            toast.error("Event not found");
            navigate("/dashboard");
            return;
          }
          // Check ownership
          if (event.uid !== currentUser.uid && event.createdBy !== currentUser.uid) {
            toast.error("You don't have permission to edit this event");
            navigate("/dashboard");
            return;
          }
          setInitialData({
            title: event.title,
            description: event.description,
            category: event.category,
            location: event.location,
            date: event.date,
          });
        } catch (error) {
          console.error(error);
          toast.error("Failed to fetch event data");
        } finally {
          setLoading(false);
        }
      }
      fetchEvent();
    }
  }, [id, isEditMode, currentUser, navigate]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateEvent(id, formData);
        toast.success("Event updated successfully!");
        navigate(`/events/${id}`);
      } else {
        const eventId = await createEvent({
          ...formData,
          uid: currentUser.uid,
          createdBy: currentUser.uid, // Add both for backward compatibility or preference
          creatorEmail: currentUser.email
        });
        toast.success("Event created successfully!");
        navigate(`/events/${eventId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(isEditMode ? "Failed to update event" : "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link to={isEditMode ? `/events/${id}` : "/dashboard"} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Link>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {isEditMode ? "Edit Event" : "Create a New Event"}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEditMode ? "Update your event details below." : "Fill out the details below to publish your event. Use our AI Assistant to generate a beautiful description."}
          </p>
        </div>

        <EventForm 
          initialData={initialData || {}} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
}
