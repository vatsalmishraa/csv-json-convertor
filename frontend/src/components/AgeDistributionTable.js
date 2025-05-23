import React from 'react';
import { Card, Table } from 'react-bootstrap';

const AgeDistributionTable = ({ jsonData }) => {
  const calculateAgeDistribution = () => {
    if (!jsonData || jsonData.length === 0) return null;

    // Extract ages from the data
    const ages = jsonData
      .map(row => parseInt(row.age))
      .filter(age => !isNaN(age) && age > 0);

    if (ages.length === 0) return null;

    const total = ages.length;
    const distribution = {
      'under20': ages.filter(age => age < 20).length,
      'twentyToForty': ages.filter(age => age >= 20 && age <= 40).length,
      'fortyToSixty': ages.filter(age => age > 40 && age <= 60).length,
      'overSixty': ages.filter(age => age > 60).length
    };

    return {
      '< 20': Math.round((distribution.under20 / total) * 100),
      '20 to 40': Math.round((distribution.twentyToForty / total) * 100),
      '40 to 60': Math.round((distribution.fortyToSixty / total) * 100),
      '> 60': Math.round((distribution.overSixty / total) * 100),
      total
    };
  };

  const ageStats = calculateAgeDistribution();

  if (!ageStats) return null;

  const currentTime = new Date().toLocaleString();

  return (
    <Card className="shadow-sm mb-3 mt-3">
      <Card.Header className="bg-primary text-white py-2">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">
            <i className="bi bi-bar-chart me-2"></i>
            Age-Group % Distribution ({ageStats.total} records)
          </h6>
          <small className="text-light">
            {currentTime}
          </small>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <Table className="mb-0" size="sm" striped>
          <thead className="table-light">
            <tr>
              <th>Age Group</th>
              <th className="text-end">% Distribution</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>&lt; 20</td>
              <td className="text-end">
                <span className="badge bg-info">{ageStats['< 20']}%</span>
              </td>
            </tr>
            <tr>
              <td>20 to 40</td>
              <td className="text-end">
                <span className="badge bg-success">{ageStats['20 to 40']}%</span>
              </td>
            </tr>
            <tr>
              <td>40 to 60</td>
              <td className="text-end">
                <span className="badge bg-warning">{ageStats['40 to 60']}%</span>
              </td>
            </tr>
            <tr>
              <td>&gt; 60</td>
              <td className="text-end">
                <span className="badge bg-danger">{ageStats['> 60']}%</span>
              </td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default AgeDistributionTable;
