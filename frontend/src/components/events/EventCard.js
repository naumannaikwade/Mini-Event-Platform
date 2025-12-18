import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  const { user } = useAuth();
  const isCreator = user && event.creator._id === user._id;
  const isFull = event.currentAttendees >= event.capacity;
  const eventDate = new Date(event.date);
  const spotsRemaining = event.capacity - event.currentAttendees;
  const progress = (event.currentAttendees / event.capacity) * 100;
  const isUpcoming = eventDate > new Date();
  
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-200 group">
      {/* Event Image */}
      <div className="h-52 relative overflow-hidden">
        {event.image !== 'no-image.jpg' ? (
          <img 
            src={event.image.url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-center text-white">
              <svg className="w-12 h-12 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="text-lg font-semibold">Event Image</span>
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
            {event.category}
          </span>
        </div>
        
        {/* Status Badge */}
        {isFull ? (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
            Full
          </div>
        ) : !isUpcoming ? (
          <div className="absolute top-3 left-3 bg-gray-700 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
            Past Event
          </div>
        ) : null}
      </div>

      {/* Event Details */}
      <div className="p-6">
        {/* Event Title and Creator */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-700 transition-colors">
            {event.title}
          </h3>
          <div className="flex items-center text-gray-700">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">by {event.creator.name}</span>
          </div>
        </div>

        {/* Event Description */}
        <p className="text-gray-800 mb-5 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="space-y-1">
            <div className="flex items-center text-gray-700 text-sm">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Date</span>
            </div>
            <div className="text-gray-900 text-sm pl-6">{format(eventDate, 'PP')}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-gray-700 text-sm">
              <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Location</span>
            </div>
            <div className="text-gray-900 text-sm pl-6 truncate">{event.location}</div>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <div className="text-gray-800">
              <span className="font-semibold text-gray-900">{event.currentAttendees}</span> of{' '}
              <span className="font-semibold text-gray-900">{event.capacity}</span> attendees
            </div>
            <div className={`font-semibold ${isFull ? 'text-red-600' : 'text-blue-600'}`}>
              {spotsRemaining} spots left
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${progress >= 90 ? 'bg-red-500' : progress >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <Link 
            to={`/events/${event._id}`}
            className="text-blue-700 hover:text-blue-900 font-semibold text-sm flex items-center group/link"
          >
            View Details
            <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          
          {isCreator && (
            <div className="flex space-x-3">
              <Link 
                to={`/events/edit/${event._id}`}
                className="text-amber-700 hover:text-amber-900 font-medium text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;