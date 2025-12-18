import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventsAPI, rsvpAPI } from '../services/api';
import { format } from 'date-fns';

const Profile = () => {
  const { user, logout } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [rsvpedEvents, setRsvpedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('created');
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    upcomingEvents: 0,
    pastEvents: 0
  });

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
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

      // Calculate stats
      const now = new Date();
      const upcomingEvents = userEvents.filter(event => new Date(event.date) > now);
      const pastEvents = userEvents.filter(event => new Date(event.date) <= now);
      const totalAttendees = userEvents.reduce((sum, event) => sum + event.currentAttendees, 0);

      setStats({
        totalEvents: userEvents.length,
        totalAttendees,
        upcomingEvents: upcomingEvents.length,
        pastEvents: pastEvents.length
      });

    } catch (err) {
      console.error('Error fetching profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Profile</h3>
          <p className="text-gray-700">Please wait while we load your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl overflow-hidden mb-12">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                  <span className="text-white text-4xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Active
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
                <div className="flex items-center justify-center md:justify-start gap-6 mb-4">
                  <div className="flex items-center text-white/90">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {user.email}
                  </div>
                  <div className="flex items-center text-white/90">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Member since {format(new Date(), 'MMM yyyy')}
                  </div>
                </div>
                <p className="text-white/80 text-lg max-w-2xl">
                  Event organizer and community enthusiast. Creating memorable experiences and connecting people through events.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-colors backdrop-blur-sm"
                >
                  Logout
                </button>
                <button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-xl transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-700">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-700">Total Attendees</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalAttendees}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-700">Upcoming Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcomingEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-700">Past Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pastEvents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('created')}
                className={`py-3 px-1 border-b-2 font-medium text-lg ${
                  activeTab === 'created'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Created Events ({myEvents.length})
              </button>
              <button
                onClick={() => setActiveTab('attending')}
                className={`py-3 px-1 border-b-2 font-medium text-lg ${
                  activeTab === 'attending'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Attending Events ({rsvpedEvents.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'created' ? (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Events You've Created</h2>
                  <p className="text-gray-700 mt-1">Manage and track your organized events</p>
                </div>
                <a 
                  href="/events/create" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                >
                  + Create New Event
                </a>
              </div>

              {myEvents.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Events Created Yet</h3>
                    <p className="text-gray-700 mb-8">
                      Start sharing your knowledge and organizing amazing gatherings. 
                      Create your first event and build your community.
                    </p>
                    <a 
                      href="/events/create" 
                      className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg"
                    >
                      Create Your First Event
                    </a>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myEvents.map(event => {
                    const eventDate = new Date(event.date);
                    const isUpcoming = eventDate > new Date();
                    const spotsLeft = event.capacity - event.currentAttendees;
                    
                    return (
                      <div key={event._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-bold text-gray-900 truncate">{event.title}</h3>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {isUpcoming ? 'Upcoming' : 'Past'}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 text-sm line-clamp-2 mb-4">{event.description}</p>
                          
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center text-gray-700 text-sm">
                              <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              <span>{format(eventDate, 'PP')}</span>
                            </div>
                            
                            <div className="flex items-center text-gray-700 text-sm">
                              <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              <span className="truncate">{event.location}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div>
                              <div className="text-sm text-gray-700 mb-1">
                                <span className="font-medium">{event.currentAttendees}</span> /{' '}
                                <span className="font-medium">{event.capacity}</span> attendees
                              </div>
                              <div className="text-xs text-gray-600">
                                {spotsLeft} spots available
                              </div>
                            </div>
                            <a 
                              href={`/events/${event._id}`}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                            >
                              Manage
                              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Events You're Attending</h2>
                <p className="text-gray-700 mt-1">Events you've RSVP'd to join</p>
              </div>

              {rsvpedEvents.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Not Attending Any Events</h3>
                    <p className="text-gray-700 mb-8">
                      Browse upcoming events and join ones that interest you. 
                      Discover new communities and expand your network.
                    </p>
                    <a 
                      href="/events" 
                      className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg"
                    >
                      Browse Events
                    </a>
                  </div>
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
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
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
                            <div className="text-sm text-gray-700">
                              <span className="font-medium">Attendees: </span>
                              <span className="text-gray-900">{event.currentAttendees}</span>
                            </div>
                            <a 
                              href={`/events/${event._id}`}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                            >
                              View Details
                              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="space-y-4">
              {myEvents.slice(0, 3).map(event => (
                <div key={event._id} className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{event.title}</p>
                    <p className="text-sm text-gray-600">
                      Created on {format(new Date(event.createdAt), 'PPP')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{event.currentAttendees}</div>
                    <div className="text-sm text-gray-600">Attendees</div>
                  </div>
                </div>
              ))}
              
              {myEvents.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-700">No recent activity. Create your first event to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;