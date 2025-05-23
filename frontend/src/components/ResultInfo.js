import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';

const ResultInfo = ({ processingResult }) => {
  const currentTime = new Date().toLocaleString();

  return (
    <Card className="shadow-sm mb-3">
      <Card.Header className="bg-light py-2">
        <h6 className="mb-0">
          <i className="bi bi-info-circle me-2"></i>
          Processing Results
        </h6>
      </Card.Header>
      <Card.Body className="py-2">
        {processingResult ? (
          <div className="small">
            <div className="d-flex justify-content-between mb-1">
              <span>Records:</span>
              <Badge bg="info">{processingResult.recordCount}</Badge>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span>Processing Time:</span>
              <span>{processingResult.processingTime}ms</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span>Database:</span>
              <Badge bg={processingResult.savedToDatabase ? 'success' : 'warning'}>
                {processingResult.savedToDatabase ? 'Saved' : 'Not Saved'}
              </Badge>
            </div>
            <div className="d-flex justify-content-between">
              <span>Processed At:</span>
              <span className="text-muted small">{currentTime}</span>
            </div>
          </div>
        ) : (
          <div className="text-center p-4 text-muted">
            <p>Upload a CSV file to see processing results.</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ResultInfo;
