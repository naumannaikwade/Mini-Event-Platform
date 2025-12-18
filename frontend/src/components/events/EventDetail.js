import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI, rsvpAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rsvping, setRsvping] = useState(false);
  const [hasRsvped, setHasRsvped] = useState(false);

  useEffect(() => {
    fetchEvent();
    checkUserRsvp();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await eventsAPI.getEvent(id);
      setEvent(response.data.data);
    } catch (err) {
      setError('Event not found');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkUserRsvp = async () => {
    if (!user) return;
    try {
      const response = await rsvpAPI.getUserRsvps();
      const userRsvp = response.data.data.find(rsvp => rsvp.event._id === id);
      setHasRsvped(!!userRsvp);
    } catch (err) {
      console.error('Error checking RSVP:', err);
    }
  };

  const handleRsvp = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setRsvping(true);
    try {
      await rsvpAPI.rsvpToEvent(id);
      setEvent(prev => ({
        ...prev,
        currentAttendees: prev.currentAttendees + 1
      }));
      setHasRsvped(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to RSVP');
    } finally {
      setRsvping(false);
    }
  };

  const handleCancelRsvp = async () => {
    setRsvping(true);
    try {
      await rsvpAPI.cancelRsvp(id);
      setEvent(prev => ({
        ...prev,
        currentAttendees: prev.currentAttendees - 1
      }));
      setHasRsvped(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel RSVP');
    } finally {
      setRsvping(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsAPI.deleteEvent(id);
        navigate('/events');
      } catch (err) {
        alert('Failed to delete event');
      }
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-700">Loading event...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!event) return null;

  const isCreator = user && event.creator._id === user._id;
  const isFull = event.currentAttendees >= event.capacity;
  const eventDate = new Date(event.date);
  const spotsRemaining = event.capacity - event.currentAttendees;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Event Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                {event.category}
              </span>
              <div className="flex items-center text-gray-700">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-800 font-medium">Organized by {event.creator.name}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{spotsRemaining} spots left</div>
            <div className="text-sm text-gray-600">Capacity: {event.currentAttendees}/{event.capacity}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Event Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Event Image */}
          <div className="rounded-xl overflow-hidden shadow-lg">
            {event.image !== 'no-image.jpg' ? (
              <img 
                src={event.image.url}
                className="w-full h-80 object-cover"
              />
            ) : (
              <div className="w-full h-80 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xl font-semibold">Event Image</span>
                </div>
              </div>
            )}
          </div>

          {/* Event Description */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <div className="prose max-w-none text-gray-700">
              <p className="whitespace-pre-line">{event.description}</p>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Date & Time
                  </h3>
                  <p className="text-gray-900 font-medium">
                    {format(eventDate, 'PPPP')} at {format(eventDate, 'p')}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Location
                  </h3>
                  <p className="text-gray-900 font-medium">{event.location}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Capacity
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-900 font-medium">
                      {event.currentAttendees} / {event.capacity} attendees
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(event.currentAttendees / event.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {spotsRemaining} spots available
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    Category
                  </h3>
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                    {event.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - RSVP & Actions */}
        <div className="space-y-6">
          {/* RSVP Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Join this Event</h3>
            
            {isFull ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-red-600 font-semibold text-lg mb-2">Event is Full</p>
                <p className="text-gray-700">All spots have been taken. Check back later for cancellations.</p>
              </div>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-700">{spotsRemaining}</div>
                    <div className="text-blue-800 font-medium">spots remaining</div>
                  </div>
                </div>
                
                {user ? (
                  hasRsvped ? (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-green-800 font-semibold">You're attending this event!</span>
                        </div>
                        <p className="text-sm text-green-700">We'll see you there!</p>
                      </div>
                      <button
                        onClick={handleCancelRsvp}
                        disabled={rsvping}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                      >
                        {rsvping ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : 'Cancel RSVP'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleRsvp}
                      disabled={rsvping}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
                    >
                      {rsvping ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : 'RSVP Now'}
                    </button>
                  )
                ) : (
                  <div className="text-center">
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 font-medium">Please login to RSVP</p>
                      <p className="text-sm text-yellow-700 mt-1">Sign in to join this event</p>
                    </div>
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                      Login to RSVP
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Creator Actions */}
          {isCreator && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Event Management</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/events/edit/${event._id}`)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Event
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Delete Event
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;