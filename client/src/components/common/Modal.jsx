const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl mx-4 bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">{title}</h2>

          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Content */}

        <div className="flex-1 p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
