import React, { useState, useEffect } from 'react';
import EventForm from '../../components/event/EventForm';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FaCalendar, FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { eventAPI } from '../../api/event';

const ShelterEventsPage = () => {
    const { isShelterStaff } = useAuthContext();
    const [events, setEvents] = useState([]);
    const [collabEvents, setCollabEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('my');
    const [editingEvent, setEditingEvent] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isShelterStaff()) {
            loadMyEvents();
            loadCollabEvents();
        }
    }, [isShelterStaff]);

    const loadMyEvents = async () => {
        setIsLoading(true);
        try {
            const response = await eventAPI.getEvents({ shelterId: 'current' });
            setEvents(Array.isArray(response) ? response : []);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách sự kiện');
        } finally {
            setIsLoading(false);
        }
    };

    const loadCollabEvents = async () => {
        try {
            const response = await eventAPI.getMyCollabEvents();
            setCollabEvents(Array.isArray(response) ? response : []);
        } catch (error) {
            toast.error('Lỗi khi tải sự kiện collab');
        }
    };
    const handleEdit = (event) => {
        setEditingEvent(event);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (eventId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) return;
        try {
            await eventAPI.deleteEvent(eventId);
            toast.success('Đã xóa sự kiện!');
            loadMyEvents();
            loadCollabEvents();
        } catch (error) {
            toast.error('Xóa sự kiện thất bại!');
        }
    };

    const handleUpdate = async (eventData) => {
        try {
            await eventAPI.updateEvent(editingEvent.id, eventData);
            toast.success('Cập nhật sự kiện thành công!');
            setIsEditModalOpen(false);
            setEditingEvent(null);
            loadMyEvents();
            loadCollabEvents();
        } catch (error) {
            toast.error('Cập nhật sự kiện thất bại!');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'UPCOMING':
                return 'bg-blue-100 text-blue-800';
            case 'ONGOING':
                return 'bg-green-100 text-green-800';
            case 'COMPLETED':
                return 'bg-gray-100 text-gray-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'UPCOMING':
                return 'Sắp diễn ra';
            case 'ONGOING':
                return 'Đang diễn ra';
            case 'COMPLETED':
                return 'Đã hoàn thành';
            case 'CANCELLED':
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    };

    const getCategoryText = (category) => {
        switch (category) {
            case 'ADOPTION':
                return 'Nhận nuôi';
            case 'FUNDRAISING':
                return 'Gây quỹ';
            case 'AWARENESS':
                return 'Nâng cao nhận thức';
            case 'TRAINING':
                return 'Đào tạo';
            default:
                return 'Khác';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isShelterStaff()) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Không có quyền truy cập</h1>
                    <p className="text-gray-600">Chỉ nhân viên cứu hộ mới có quyền xem trang này.</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <LoadingSpinner />;
    }

    // Debug render
    console.log('=== ShelterEventsPage render ===');
    console.log('events state:', events);
    console.log('events length:', events.length);
    console.log('isLoading:', isLoading);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Sự kiện của tôi</h1>
                        <p className="mt-2 text-gray-600">Quản lý sự kiện bạn phụ trách hoặc collab</p>
                    </div>
                    <button
                        className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => navigate('/shelter/events/create')}
                    >
                        + Tạo sự kiện mới
                    </button>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex space-x-4 border-b">
                    <button
                        className={`px-4 py-2 font-medium ${activeTab === 'my' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('my')}
                    >
                        Sự kiện phụ trách
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${activeTab === 'collab' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('collab')}
                    >
                        Sự kiện collab
                    </button>
                </div>

                {/* Events List */}
                <div className="bg-white rounded-lg shadow">
                    {(activeTab === 'my' ? events : collabEvents).length === 0 ? (
                        <div className="p-8 text-center">
                            <FaCalendar className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có sự kiện</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {activeTab === 'my' ? 'Bạn chưa được phân công phụ trách sự kiện nào.' : 'Bạn chưa collab sự kiện nào.'}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {(activeTab === 'my' ? events : collabEvents).map((event) => (
                                <div key={event.id} className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {event.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {event.description}
                                            </p>
                                            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <FaCalendar className="mr-2" />
                                                    {formatDate(event.date)}
                                                </div>
                                                <div className="flex items-center">
                                                    <FaMapMarkerAlt className="mr-2" />
                                                    {event.location}
                                                </div>
                                                <div className="flex items-center">
                                                    <FaClock className="mr-2" />
                                                    {event.startTime} - {event.endTime}
                                                </div>
                                                <div className="flex items-center">
                                                    <FaUsers className="mr-2" />
                                                    {event.maxParticipants} người
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center space-x-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                                    {getStatusText(event.status)}
                                                </span>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    {getCategoryText(event.category)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-2 ml-4">
                                            <button
                                                className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                                                onClick={() => handleEdit(event)}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                                                onClick={() => handleDelete(event.id)}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Edit Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative">
                            <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                onClick={() => { setIsEditModalOpen(false); setEditingEvent(null); }}
                            >
                                &times;
                            </button>
                            <h2 className="text-xl font-bold mb-4">Chỉnh sửa sự kiện</h2>
                            <EventForm event={editingEvent} onSubmit={handleUpdate} onCancel={() => { setIsEditModalOpen(false); setEditingEvent(null); }} isLoading={false} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShelterEventsPage; 