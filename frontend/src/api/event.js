    // Get all events that current shelter is a member (collab or chủ trì)
    getMyCollabEvents: async () => {
        return api.get('/events/my-collab-events');
    }
import api from '../util/axios';

// Event API
export const eventAPI = {
    // Get all events
    getEvents: async (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.page !== undefined) queryParams.append('page', params.page);
        if (params.size !== undefined) queryParams.append('size', params.size);
        if (params.status) queryParams.append('status', params.status);
        if (params.category) queryParams.append('category', params.category);
        if (params.search) queryParams.append('search', params.search);
        if (params.location) queryParams.append('location', params.location);
        if (params.shelterId && params.shelterId !== 'current') queryParams.append('shelterId', params.shelterId);
        if (params.volunteerId && params.volunteerId !== 'current') queryParams.append('volunteerId', params.volunteerId);

        let url;
        if (params.shelterId === 'current') {
            url = '/events/shelter-events';
        } else if (params.volunteerId === 'current') {
            url = '/events/volunteer-events';
        } else {
            url = `/events?${queryParams.toString()}`;
        }
        
        console.log('Event API call:', url);
        console.log('Event params:', params);

        return api.get(url);
    },

    // Get event by ID
    getEventById: async (id) => {
        return api.get(`/events/${id}`);
    },

    // Create event
    createEvent: async (eventData) => {
        return api.post('/events', eventData);
    },

    // Update event
    updateEvent: async (id, eventData) => {
        return api.put(`/events/${id}`, eventData);
    },

    // Delete event
    deleteEvent: async (id) => {
        return api.delete(`/events/${id}`);
    }
}; 