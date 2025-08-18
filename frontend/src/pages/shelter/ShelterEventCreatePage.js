import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EventForm from '../../components/event/EventForm';
import { eventAPI } from '../../api/event';

const ShelterEventCreatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (eventData) => {
    setIsLoading(true);
    try {
      await eventAPI.createEvent(eventData);
      toast.success('Tạo sự kiện thành công!');
      navigate('/shelter/events');
    } catch (error) {
      toast.error('Tạo sự kiện thất bại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Tạo sự kiện mới</h1>
        <EventForm onSubmit={handleCreate} onCancel={() => navigate('/shelter/events')} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ShelterEventCreatePage;
