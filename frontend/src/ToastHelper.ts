import { toast, ToastOptions } from 'react-toastify';

export const showToast = (type: string, message: string) => {
  const toastOptions = {
    position: "top-center",
    autoClose: 3000,
    closeButton: true,
    pauseOnHover: true,
    hideProgressBar: false,
    closeOnClick: false,
    style: {
      top: "60px",
      width: "300px",
      maxWidth: "90vw"
    }
  } as ToastOptions<unknown>;

  switch(type) {
    case 'success':
      toast.success(message, toastOptions);
      break;
    case 'error':
      toast.error(message, toastOptions);
      break;
    case 'info':
      toast.info(message, toastOptions);
      break;
    case 'warn':
      toast.warn(message, toastOptions);
      break;
    default:
      break;
  } 
};