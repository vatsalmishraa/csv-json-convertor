import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Alert, Spinner, Accordion, Badge } from 'react-bootstrap';
import { getSavedFiles, getFileData } from '../services/api';

const SavedRecordsModal = ({ show, onHide }) => {
  const [files, setFiles] = useState([]);
  const [fileData, setFileData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedFiles, setExpandedFiles] = useState(new Set());

  useEffect(() => {
    if (show) {
      fetchSavedFiles();
    }
  }, [show]);

  const fetchSavedFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching saved files...');
      const response = await getSavedFiles();
      console.log('API Response:', response);
      setFiles(response.files || []);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const loadFileData = async (fileId) => {
    if (fileData[fileId]) return; // Already loaded

    try {
      const response = await getFileData(fileId);
      setFileData(prev => ({
        ...prev,
        [fileId]: response.data
      }));
    } catch (err) {
      console.error('Error fetching file data:', err);
    }
  };

  const handleAccordionToggle = (fileId) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(fileId)) {
      newExpanded.delete(fileId);
    } else {
      newExpanded.add(fileId);
      loadFileData(fileId);
    }
    setExpandedFiles(newExpanded);
  };

  const renderTableForFile = (records) => {
    if (!records || records.length === 0) return null;
    
    const headers = Object.keys(records[0]).filter(key => 
      !['id', 'file_id', 'file_name', 'created_at'].includes(key)
    );

    return (
      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>{header.replace(/_/g, ' ').toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              {headers.map(header => (
                <td key={header}>
                  {typeof record[header] === 'object' 
                    ? JSON.stringify(record[header]) 
                    : String(record[header] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-database me-2"></i>
          Saved Files ({files.length})
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {loading && (
          <div className="text-center p-4">
            <Spinner animation="border" />
            <p className="mt-2">Loading saved files...</p>
          </div>
        )}
        
        {error && (
          <Alert variant="danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Error loading files: {error}
          </Alert>
        )}
        
        {!loading && !error && files.length === 0 && (
          <div className="text-center p-4 text-muted">
            <i className="bi bi-database display-4"></i>
            <p className="mt-3">No saved files found.</p>
          </div>
        )}
        
        {!loading && !error && files.length > 0 && (
          <Accordion>
            {files.map((file) => (
              <Accordion.Item key={file.file_id} eventKey={file.file_id}>
                <Accordion.Header 
                  onClick={() => handleAccordionToggle(file.file_id)}
                >
                  <div className="d-flex justify-content-between w-100 me-3">
                    <span>
                      <i className="bi bi-file-earmark-text me-2"></i>
                      {file.file_name}
                    </span>
                    <div>
                      <Badge bg="primary" className="me-2">
                        {file.record_count} records
                      </Badge>
                      <div className="text-muted small">
                        <div>{formatDateTime(file.uploaded_at).date}</div>
                        <div>{formatDateTime(file.uploaded_at).time}</div>
                      </div>
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  {fileData[file.file_id] ? (
                    renderTableForFile(fileData[file.file_id])
                  ) : (
                    <div className="text-center p-3">
                      <Spinner animation="border" size="sm" />
                      <span className="ms-2">Loading file data...</span>
                    </div>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={fetchSavedFiles} disabled={loading}>
          <i className="bi bi-arrow-clockwise me-1"></i>
          Refresh
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SavedRecordsModal;
