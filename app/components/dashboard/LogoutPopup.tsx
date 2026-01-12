export const LogoutPopup = ({
  cancel,
  logout,
}: {
  cancel: () => void;
  logout: () => void;
}) => {
  return (
    <>
      {/* Modal backdrop */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg max-w-md mx-4 p-6">
          <div className="relative px-4 pb-4 space-x-4">
            <p className="text-xl font-bold text-primary-text mb-1 tracking-[-0.015rem]">
              Confirm logout
            </p>

            <p className="text-sm text-primary-text/70">
              Are you sure you want to logout?
            </p>
          </div>

          <div className="px-6 pt-2 flex items-center justify-end gap-3">
            <button
              onClick={cancel}
              className="px-4 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 w-full gap-2 bg-primary-text text-white rounded-md hover:bg-primary-text/90 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
