import { useState } from "react";
import { generateEventDescription } from "../services/gemini";
import toast from "react-hot-toast";
import { Sparkles, Loader2 } from "lucide-react";

export default function EventForm({ initialData = {}, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    date: initialData.date || "",
    location: initialData.location || "",
    category: initialData.category || "Tech"
  });
  
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAIMagic = async () => {
    if (!formData.title) {
      toast.error("Please enter a title first!");
      return;
    }
    
    setIsGenerating(true);
    try {
      const suggestedDescription = await generateEventDescription(formData.title, formData.category);
      setFormData(prev => ({ ...prev, description: suggestedDescription }));
      toast.success("Description generated!");
    } catch (error) {
      toast.error("Failed to generate description. Make sure API key is set.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="e.g. React Developers Meetup"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option>Tech</option>
            <option>Music</option>
            <option>Sports</option>
            <option>Art</option>
            <option>Networking</option>
            <option>Gaming</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          required
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="e.g. Central Library or Online (Zoom)"
        />
      </div>

      <div>
        <div className="flex justify-between items-end mb-1">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <button
            type="button"
            onClick={handleAIMagic}
            disabled={isGenerating || !formData.title}
            className="text-xs flex items-center gap-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-2 py-1 rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>}
            AI Assist
          </button>
        </div>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="Describe your event..."
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving...</span>
          ) : (
            "Save Event"
          )}
        </button>
      </div>
    </form>
  );
}
