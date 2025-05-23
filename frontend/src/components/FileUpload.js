import React, { useState } from 'react';
import { Card, Form, Button, ProgressBar } from 'react-bootstrap';
import { uploadCsv } from '../services/api';

const FileUpload = ({ onUploadSuccess, onUploadError }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      onUploadError('Please select a CSV file first');
      return;
    }
    
    // Start upload process
    setIsUploading(true);
    setProgress(0);
    setProgressStatus('Uploading file...');
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress < 30) {
          setProgressStatus('Uploading file...');
        } else if (newProgress < 60) {
          setProgressStatus('Processing CSV data...');
        } else if (newProgress < 90) {
          setProgressStatus('Storing data in database...');
        }
        return newProgress < 90 ? newProgress : prev;
      });
    }, 300);
    
    try {
      const result = await uploadCsv(file);
      clearInterval(progressInterval);
      setProgress(100);
      setProgressStatus('Completed!');
      onUploadSuccess(result);
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(100);
      setProgressStatus('Error: ' + error);
      onUploadError(error);
    } finally {
      // Reset UI after delay
      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
      }, 2000);
    }
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-white">
        <h5 className="mb-0">
          <i className="bi bi-upload me-2"></i>Upload CSV File
        </h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Select CSV file to convert</Form.Label>
            <Form.Control
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isUploading}
              required
            />
            <Form.Text className="text-muted">
              CSV must include name.firstName, name.lastName, and age fields.
            </Form.Text>
          </Form.Group>
          
          <div className="mb-3">
            <Button 
              type="submit" 
              variant="primary"
              disabled={isUploading || !file}
            >
              <i className="bi bi-arrow-up-circle me-2"></i>
              Upload & Convert
            </Button>
          </div>
        </Form>
        
        {isUploading && (
          <div className="mt-3">
            <ProgressBar 
              animated 
              striped 
              now={progress} 
              className="mb-2"
            />
            <p className="text-center small">{progressStatus}</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default FileUpload;
