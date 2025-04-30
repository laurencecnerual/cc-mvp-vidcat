import { Id, toast, ToastOptions } from 'react-toastify';

export const removeToast = (id: Id) => {
  toast.dismiss(id);
}

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
      return toast.success(message, toastOptions);
    case 'error':
      return toast.error(message, toastOptions);
    case 'info':
      return toast.info(message, toastOptions);
    case 'warn':
      return toast.warn(message, toastOptions);
    case 'loading':
      toastOptions.style = {
        top: "40vh",
        maxWidth: "90vw"
      };

      return toast.loading(message, toastOptions);
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

      return toast.info(message, toastOptions);
    default:
      return undefined;
  } 
};