import { Alert } from 'react-bootstrap';

const AlertMessage = ({ show, variant, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
      <Alert 
        variant={variant} 
        onClose={onClose} 
        dismissible
      >
        {message}
      </Alert>
    </div>
  );
};

export default AlertMessage;
