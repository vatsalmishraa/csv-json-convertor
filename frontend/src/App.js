import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import JsonOutput from './components/JsonOutput';
import ResultInfo from './components/ResultInfo';
import Footer from './components/Footer';
import AlertMessage from './components/AlertMessage';
import AgeDistributionTable from './components/AgeDistributionTable';
import './App.css';

function App() {
  const [jsonData, setJsonData] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [processingResult, setProcessingResult] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    // Remove database status check
  }, []);

  const handleUploadSuccess = (result) => {
    setJsonData(result.jsonData);
    setUploadResponse(result);
    setProcessingResult({
      recordCount: result.recordCount,
      processingTime: result.processingTime,
      status: 'Success'
    });
    showAlert('CSV file processed successfully!', 'success');
  };

  const handleUploadError = (error) => {
    showAlert('Error processing CSV: ' + error, 'danger');
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <Header />
      
      <Container className="my-3 flex-grow-1">
        <Row>
          <Col lg={8}>
            <JsonOutput 
              jsonData={jsonData} 
              onCopySuccess={() => showAlert('JSON copied to clipboard!')} 
              uploadResponse={uploadResponse} 
            />
          </Col>
          
          <Col lg={4}>
            <FileUpload 
              onUploadSuccess={handleUploadSuccess} 
              onUploadError={handleUploadError}
            />
            <ResultInfo processingResult={processingResult} />
            
            {/* Show age distribution only when valid CSV with age data is uploaded */}
            {uploadResponse?.savedToDatabase && jsonData && (
              <AgeDistributionTable jsonData={jsonData} />
            )}
          </Col>
        </Row>
      </Container>
      
      <Footer />
      
      <AlertMessage 
        show={alert.show}
        variant={alert.variant}
        message={alert.message}
        onClose={() => setAlert(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
}

export default App;