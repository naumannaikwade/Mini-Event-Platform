import React, { useState, useEffect } from 'react';
import { eventsAPI, rsvpAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [rsvpedEvents, setRsvpedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user's created events
      const eventsResponse = await eventsAPI.getAllEvents();
      const userEvents = eventsResponse.data.data.filter(
        event => event.creator._id === user._id
      );
      setMyEvents(userEvents);

      // Fetch user's RSVPs
      const rsvpsResponse = await rsvpAPI.getUserRsvps();
      const rsvps = rsvpsResponse.data.data.map(rsvp => rsvp.event);
      setRsvpedEvents(rsvps);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-700">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 mb-10 shadow-sm">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
            <span className="text-white font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Welcome back, {user.name}!</h2>
            <p className="text-gray-700">Manage your events and RSVPs from your personal dashboard.</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Events Created</p>
              <p className="text-2xl font-bold text-gray-900">{myEvents.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Events Attending</p>
              <p className="text-2xl font-bold text-gray-900">{rsvpedEvents.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Attendees</p>
              <p className="text-2xl font-bold text-gray-900">
                {myEvents.reduce((sum, event) => sum + event.currentAttendees, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* My Events Section */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Events</h2>
            <p className="text-gray-700 mt-1">Events you've created and organized</p>
          </div>
          <Link 
            to="/events/create" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md"
          >
            + Create New Event
          </Link>
        </div>

        {myEvents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-10 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events created yet</h3>
            <p className="text-gray-700 mb-6 max-w-md mx-auto">
              Start by creating your first event. Share your expertise or organize a gathering with like-minded people.
            </p>
            <Link 
              to="/events/create" 
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map(event => {
              const eventDate = new Date(event.date);
              const spotsLeft = event.capacity - event.currentAttendees;
              const progress = (event.currentAttendees / event.capacity) * 100;
              
              return (
                <div key={event._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
                  {/* Event Header */}
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{event.title}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {event.category}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm line-clamp-2 mb-4">{event.description}</p>
                    
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>{format(eventDate, 'PP')}</span>
                    </div>
                  </div>
                  
                  {/* Event Stats */}
                  <div className="p-5">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-700 mb-1">
                        <span>Attendance</span>
                        <span className="font-medium">{event.currentAttendees}/{event.capacity}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${progress >= 90 ? 'bg-red-500' : progress >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {spotsLeft} spots available
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">Location: </span>
                        <span className="truncate max-w-[120px] inline-block">{event.location}</span>
                      </div>
                      <Link 
                        to={`/events/${event._id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                      >
                        Manage
                        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Events I'm Attending */}
      <div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Events I'm Attending</h2>
          <p className="text-gray-700 mt-1">Events you've RSVP'd to</p>
        </div>
        
        {rsvpedEvents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-10 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-700 mb-6 max-w-md mx-auto">
              You haven't RSVP'd to any events yet. Browse upcoming events and join ones that interest you.
            </p>
            <Link 
              to="/events" 
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rsvpedEvents.map(event => {
              const eventDate = new Date(event.date);
              const isUpcoming = eventDate > new Date();
              
              return (
                <div key={event._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{event.title}</h3>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {isUpcoming ? 'Upcoming' : 'Past'}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 text-sm line-clamp-2 mb-4">{event.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-700 text-sm">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>{format(eventDate, 'PPPP')}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-700 text-sm">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="truncate">{event.location}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-700 text-sm">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span>Organized by {event.creator.name}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm">
                        <span className="text-gray-700 font-medium">Attendees: </span>
                        <span className="text-gray-900">{event.currentAttendees}</span>
                      </div>
                      <Link 
                        to={`/events/${event._id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                      >
                        View Details
                        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;