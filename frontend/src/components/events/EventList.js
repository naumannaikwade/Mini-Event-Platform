import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../../services/api';
import EventCard from './EventCard';
import { useAuth } from '../../context/AuthContext';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAllEvents();
      setEvents(response.data.data);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter events based on search and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || event.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['All', ...new Set(events.map(event => event.category))];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Events</h3>
          <p className="text-gray-700">Please wait while we fetch the latest events...</p>
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="text-center py-12">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
        <div className="text-red-600 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Events</h2>
        <p className="text-red-700 mb-4">{error}</p>
        <button 
          onClick={fetchEvents}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Events</h1>
        <p className="text-xl text-gray-800 max-w-3xl">
          Browse upcoming events, join communities, and discover new opportunities. 
          From tech meetups to social gatherings, find something that interests you.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Search Events
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-600 outline-none transition-colors"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Filter by Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 outline-none transition-colors"
            >
              {categories.map(category => (
                <option key={category} value={category} className="text-gray-900">
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Create Event Button */}
          <div className="flex items-end">
            {user ? (
              <a 
                href="/events/create" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-center"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Create New Event
                </div>
              </a>
            ) : (
              <div className="w-full text-center p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-yellow-800 font-medium">
                  <a href="/login" className="text-blue-600 hover:text-blue-800 font-semibold">Login</a> to create events
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredEvents.length === events.length ? 'All Events' : 'Filtered Events'}
          </h2>
          <p className="text-gray-700 mt-1">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
            {searchTerm && ` for "${searchTerm}"`}
            {categoryFilter !== 'All' && ` in ${categoryFilter}`}
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-700">
            Total Events: <span className="font-semibold text-gray-900">{events.length}</span>
          </p>
          {(searchTerm || categoryFilter !== 'All') && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('All');
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-1"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No events found</h3>
            <p className="text-gray-700 mb-8">
              {searchTerm || categoryFilter !== 'All' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Be the first to create an event and start a community!'}
            </p>
            <div className="space-x-4">
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('All');
                }}
                className="bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Clear All Filters
              </button>
              {user && (
                <a 
                  href="/events/create" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors inline-block"
                >
                  Create First Event
                </a>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
          
          {/* Show message if filtered results are less than total */}
          {filteredEvents.length < events.length && (
            <div className="mt-12 text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 inline-block">
                <p className="text-blue-800">
                  Showing {filteredEvents.length} of {events.length} events. 
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setCategoryFilter('All');
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Show all events
                  </button>
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Featured Categories */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Popular Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.filter(cat => cat !== 'All').map(category => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                categoryFilter === category 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventList;