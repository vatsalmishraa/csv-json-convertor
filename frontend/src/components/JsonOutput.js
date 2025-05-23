import React, { useState, useEffect } from 'react';
import { Card, Button, Toast, ToastContainer, Badge } from 'react-bootstrap';
import SavedRecordsModal from './SavedRecordsModal';

const JsonOutput = ({ jsonData, onCopySuccess, uploadResponse }) => {
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showRecordsModal, setShowRecordsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (uploadResponse) {
      if (uploadResponse.savedToDatabase) {
        setToastMessage(`✅ ${uploadResponse.recordCount} records saved to database!`);
        setShowSavedToast(true);
      } else if (uploadResponse.schemaValidation && !uploadResponse.schemaValidation.isValid && uploadResponse.schemaValidation.errors.some(error => error.includes('Failed to save to database'))) {
        // Only show toast for actual database errors, not schema validation failures
        setToastMessage(`❌ Database save failed`);
        setShowErrorToast(true);
      }
    }
  }, [uploadResponse]);

  const handleCopyJson = () => {
    if (!jsonData) return;
    
    const jsonString = JSON.stringify(jsonData, null, 2);
    navigator.clipboard.writeText(jsonString)
      .then(() => {
        onCopySuccess();
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // Function to apply syntax highlighting
  const syntaxHighlight = (json) => {
    if (!json) return null;
    
    if (typeof json !== 'string') {
      json = JSON.stringify(json, null, 2);
    }
    
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'text-number'; // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-key'; // key
        } else {
          cls = 'text-string'; // string
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-boolean'; // boolean
      } else if (/null/.test(match)) {
        cls = 'text-null'; // null
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  };

  return (
    <>
      <Card className="shadow-sm mb-3" style={{ height: 'calc(100vh - 100px)' }}>
        <Card.Header className="bg-white py-2">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-braces me-2"></i>JSON Output
              {uploadResponse?.savedToDatabase && (
                <Badge bg="success" className="ms-2">Saved</Badge>
              )}
              {uploadResponse?.schemaValidation && !uploadResponse.schemaValidation.isValid && (
                <Badge bg="warning" className="ms-2">Not Saved</Badge>
              )}
            </h5>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-success" 
                size="sm"
                onClick={() => setShowRecordsModal(true)}
              >
                <i className="bi bi-database me-1"></i>Saved Records
              </Button>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={handleCopyJson}
                disabled={!jsonData}
              >
                <i className="bi bi-clipboard me-1"></i>Copy
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0 overflow-hidden">
          <div 
            className="json-viewer p-3" 
            style={{ 
              height: 'calc(100% - 10px)',
              overflowY: 'auto',
              overflowX: 'auto'
            }}
          >
            {jsonData ? (
              <pre 
                style={{ margin: 0, overflowY: 'visible' }} 
                dangerouslySetInnerHTML={{ __html: syntaxHighlight(jsonData) }} 
              />
            ) : (
              <div className="text-center p-5 text-muted">
                <i className="bi bi-braces display-1"></i>
                <p className="mt-3">The converted JSON will appear here.</p>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          show={showSavedToast} 
          onClose={() => setShowSavedToast(false)}
          delay={4000}
          autohide
          bg="success"
        >
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
        
        <Toast 
          show={showErrorToast} 
          onClose={() => setShowErrorToast(false)}
          delay={6000}
          autohide
          bg="danger"
        >
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Saved Records Modal */}
      <SavedRecordsModal 
        show={showRecordsModal}
        onHide={() => setShowRecordsModal(false)}
      />
    </>
  );
};

export default JsonOutput;
