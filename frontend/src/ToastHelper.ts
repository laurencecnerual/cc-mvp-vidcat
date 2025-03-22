import { toast, ToastOptions } from 'react-toastify';

export const showToast = (type: string, message: string) => {
  const toastOptions = {
    position: "top-center",
    autoClose: 3000,
    closeButton: false,
    pauseOnHover: false,
    hideProgressBar: false,
    closeOnClick: true,
    style: {
      top: "60px",
      width: "350px",
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
    case 'recommendation':
      toastOptions.autoClose = false;
      toastOptions.closeButton = true;
      toastOptions.pauseOnHover = true;
      toastOptions.hideProgressBar = true;
      toastOptions.closeOnClick = false;
      toastOptions.style = {
        top: "40vh",
        minWidth: "50vw",
        maxWidth: "90vw"
      };

      toast.info(message, toastOptions);
      break
    default:
      break;
  } 
};