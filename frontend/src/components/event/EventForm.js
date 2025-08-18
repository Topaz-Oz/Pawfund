import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../../hook';
import { fetchSheltersForEvent, fetchVolunteersForEvent, fetchDonorsForEvent } from '../../store/asyncAction/eventAsyncAction';

const EventForm = ({ event = null, onSubmit, onCancel, isLoading = false }) => {
    const { isAdmin } = useAuthContext();
    const dispatch = useAppDispatch();
    const { shelters, volunteers, donors } = useAppSelector(state => state.event);
    
    const isAdminUser = isAdmin(); // Call the function to get boolean
    const [formData, setFormData] = useState({
        title: event?.title || '',
        description: event?.description || '',
        date: event?.date || '',
        startTime: event?.startTime || '09:00',
        endTime: event?.endTime || '17:00',
        location: event?.location || '',
        category: event?.category || 'ADOPTION',
        status: event?.status || 'UPCOMING',
        maxParticipants: event?.maxParticipants || 100,
        shelterIds: [], // Array for multiple shelter selections
        volunteerIds: [], // Array for multiple volunteer selections
        donorIds: [] // Array for multiple donor selections
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title || '',
                description: event.description || '',
                date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
                location: event.location || '',
                category: event.category || 'ADOPTION',
                status: event.status || 'UPCOMING',
                startTime: event.startTime || '09:00',
                endTime: event.endTime || '17:00',
                maxParticipants: event.maxParticipants || 100,
                shelterIds: event.shelterIds || [],
                volunteerIds: event.volunteerIds || [],
                donorIds: event.donorIds || []
            });
        }
    }, [event]);

    // Fetch shelters for admin và shelter
    useEffect(() => {
        dispatch(fetchSheltersForEvent());
    }, [dispatch]);

    // Fetch volunteers for admin
    useEffect(() => {
        if (isAdminUser) {
            dispatch(fetchVolunteersForEvent());
        }
    }, [isAdminUser, dispatch]);

    // Fetch donors for admin
    useEffect(() => {
        if (isAdminUser) {
            dispatch(fetchDonorsForEvent());
        }
    }, [isAdminUser, dispatch]);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        
        if (type === 'select-multiple') {
            // Handle multiple selection
            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
            setFormData(prev => ({
                ...prev,
                [name]: selectedOptions
            }));
        } else {
            // Handle single input
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Tiêu đề sự kiện là bắt buộc';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Mô tả sự kiện là bắt buộc';
        }

        if (!formData.date) {
            newErrors.date = 'Ngày sự kiện là bắt buộc';
        } else {
            const selectedDate = new Date(formData.date);
            const now = new Date();
            if (selectedDate < now) {
                newErrors.date = 'Ngày sự kiện không thể trong quá khứ';
            }
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Địa điểm sự kiện là bắt buộc';
        }

        if (formData.maxParticipants < 1) {
            newErrors.maxParticipants = 'Số người tham gia tối đa phải ít nhất là 1';
        }

        if (isAdminUser && !formData.shelterIds.length) {
            newErrors.shelterIds = 'Vui lòng nhân viên cứu hộ';
        }

        if (isAdminUser && !formData.volunteerIds.length) {
            newErrors.volunteerIds = 'Vui lòng chọn tình nguyện viên phụ trách';
        }

        if (isAdminUser && !formData.donorIds.length) {
            newErrors.donorIds = 'Vui lòng chọn nhà tài trợ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Convert arrays to objects for backend Event entity
        const eventData = {
            ...formData,
            shelters: formData.shelterIds.map(id => ({ id: parseInt(id) })),
            volunteers: formData.volunteerIds.map(id => ({ id: parseInt(id) })),
            donors: formData.donorIds.map(id => ({ id: parseInt(id) }))
        };

        // Remove the array fields as they're not needed in backend
        delete eventData.shelterIds;
        delete eventData.volunteerIds;
        delete eventData.donorIds;

        // Convert date to ISO string format
        if (eventData.date) {
            eventData.date = new Date(eventData.date).toISOString();
        }

        onSubmit(eventData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Tiêu đề sự kiện *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.title ? 'border-red-500' : ''
                    }`}
                    placeholder="Nhập tiêu đề sự kiện"
                />
                {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Mô tả *
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.description ? 'border-red-500' : ''
                    }`}
                    placeholder="Nhập mô tả sự kiện"
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Ngày *
                    </label>
                    <input
                        type="datetime-local"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                            errors.date ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.date && (
                        <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                        Giờ bắt đầu
                    </label>
                    <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                        Giờ kết thúc
                    </label>
                    <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>
            </div>

            {/* Location */}
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Địa điểm *
                </label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.location ? 'border-red-500' : ''
                    }`}
                    placeholder="Nhập địa điểm sự kiện"
                />
                {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Danh mục
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                        <option value="ADOPTION">Nhận nuôi</option>
                        <option value="FUNDRAISING">Gây quỹ</option>
                        <option value="VOLUNTEER">Tình nguyện</option>
                        <option value="EDUCATION">Giáo dục</option>
                        <option value="OTHER">Khác</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Trạng thái
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                        <option value="UPCOMING">Sắp diễn ra</option>
                        <option value="ONGOING">Đang diễn ra</option>
                        <option value="COMPLETED">Đã hoàn thành</option>
                        <option value="CANCELLED">Đã hủy</option>
                    </select>
                </div>
            </div>

            {/* Max Participants */}
            <div>
                <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">
                    Số người tham gia tối đa
                </label>
                <input
                    type="number"
                    id="maxParticipants"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    min="1"
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.maxParticipants ? 'border-red-500' : ''
                    }`}
                />
                {errors.maxParticipants && (
                    <p className="mt-1 text-sm text-red-600">{errors.maxParticipants}</p>
                )}
            </div>

            
            

            {/* Multiple Shelter Selection */}
            <div>
                <label htmlFor="shelterIds" className="block text-sm font-medium text-gray-700">
                    Chọn shelter cùng tổ chức (collab) *
                </label>
                <select
                    id="shelterIds"
                    name="shelterIds"
                    multiple
                    value={formData.shelterIds || []}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    size="4"
                >
                    {shelters.map(shelter => (
                        <option key={shelter.id} value={shelter.id}>
                            {shelter.name} ({shelter.username})
                        </option>
                    ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">Giữ Ctrl (Windows) hoặc Cmd (Mac) để chọn nhiều. Không thể chọn shelter của chính bạn.</p>
                {errors.shelterIds && (
                    <p className="mt-1 text-sm text-red-600">{errors.shelterIds}</p>
                )}
            </div>

            {/* Multiple Volunteer Selection */}
            {isAdminUser && (
                <div>
                    <label htmlFor="volunteerIds" className="block text-sm font-medium text-gray-700">
                        Tình nguyện viên phụ trách *
                    </label>
                    <select
                        id="volunteerIds"
                        name="volunteerIds"
                        multiple
                        value={formData.volunteerIds || []}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        size="4"
                    >
                        {volunteers.map(volunteer => (
                            <option key={volunteer.id} value={volunteer.id}>
                                {volunteer.name} ({volunteer.username})
                            </option>
                        ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">Giữ Ctrl (Windows) hoặc Cmd (Mac) để chọn nhiều</p>
                    {errors.volunteerIds && (
                        <p className="mt-1 text-sm text-red-600">{errors.volunteerIds}</p>
                    )}
                </div>
            )}

            {/* Multiple Donor Selection */}
            {isAdminUser && (
                <div>
                    <label htmlFor="donorIds" className="block text-sm font-medium text-gray-700">
                        Nhà tài trợ *
                    </label>
                    <select
                        id="donorIds"
                        name="donorIds"
                        multiple
                        value={formData.donorIds || []}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        size="4"
                    >
                        {donors.map(donor => (
                            <option key={donor.id} value={donor.id}>
                                {donor.name} ({donor.username})
                            </option>
                        ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">Giữ Ctrl (Windows) hoặc Cmd (Mac) để chọn nhiều</p>
                    {errors.donorIds && (
                        <p className="mt-1 text-sm text-red-600">{errors.donorIds}</p>
                    )}
                </div>
            )}

            {/* Debug Info - Always show for admin */}
          

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Đang lưu...' : (event ? 'Cập nhật sự kiện' : 'Tạo sự kiện')}
                </button>
            </div>
        </form>
    );
};

export default EventForm; 