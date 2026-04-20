import { Link } from "react-router-dom";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";

export default function EventCard({ event }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full hover:-translate-y-1 duration-200">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-800 border border-primary-200">
            {event.category || 'General'}
          </span>
          <span className="text-sm text-gray-500 flex items-center gap-1 font-medium">
            <UsersIcon className="w-4 h-4 text-gray-400" /> {event.attendees?.length || 0}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1" title={event.title}>{event.title}</h3>
        <p className="text-gray-600 text-sm mb-5 line-clamp-3 leading-relaxed">{event.description}</p>
        
        <div className="space-y-2 mt-auto">
          <div className="flex items-center text-sm text-gray-600 font-medium">
            <CalendarIcon className="w-4 h-4 mr-2 text-primary-500" />
            {event.date ? new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) : 'No date'}
          </div>
          <div className="flex items-center text-sm text-gray-600 font-medium">
            <MapPinIcon className="w-4 h-4 mr-2 text-primary-500" />
            {event.location || 'TBA'}
          </div>
        </div>
      </div>
      <div className="px-5 py-4 border-t border-gray-50 mt-auto">
        <Link 
          to={`/events/${event.id}`}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-primary-600 text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 focus:outline-none transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
