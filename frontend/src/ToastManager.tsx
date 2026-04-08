import toast from "react-hot-toast";


export const showErrorToast = (message: string) => {
  const duration = 5000;

  toast.custom((toastMessage) => (
    <div className={`relative w-80 bg-red-600 text-white p-4 rounded shadow-lg overflow-hidden`}>
      
      <div>{message}</div>

      <div
        className={`absolute bottom-0 left-0 h-1 bg-red-300`}
        style={{
          width: "100%",
          animation: `shrink ${duration}ms linear forwards`,
        }}
      />

      <style>
        {`
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}
      </style>
    </div>
  ), { duration });
};