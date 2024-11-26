EnqueueReadBuffer
==================

.. doxygenfunction:: tt::tt_metal::v0::EnqueueReadBuffer(CommandQueue &cq, Buffer &buffer, std::vector<DType> &dst, bool blocking, tt::stl::Span<const SubDeviceId> sub_device_ids = {})
.. doxygenfunction:: tt::tt_metal::v0::EnqueueReadBuffer(CommandQueue& cq, std::variant<std::reference_wrapper<Buffer>, std::shared_ptr<Buffer> > buffer, void * dst, bool blocking, tt::stl::Span<const SubDeviceId> sub_device_ids)
