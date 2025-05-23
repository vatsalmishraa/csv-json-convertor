# CSV to JSON Converter

A full-stack web application that converts CSV files to JSON, provides data visualization, and stores the data in a PostgreSQL database.


## Features

- **CSV to JSON Conversion**: Easily upload CSV files and convert them to JSON format
- **Nested Property Support**: Handles nested properties with dot notation (e.g., `name.firstName`)
- **Database Storage**: Saves valid CSV data to PostgreSQL database
- **File Management**: Tracks uploaded files with unique IDs and timestamps
- **Age Distribution Analysis**: Automatically generates age distribution statistics for CSV data
- **Data Visualization**: View saved records organized by file
- **Schema Validation**: Validates CSV data against expected schema
- **Responsive UI**: Works on desktop and mobile devices
- **Copy to Clipboard**: One-click copy of JSON output

## Installation

### Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/csv-json-converter.git
   cd csv-json-converter
   ```

2. **Install dependencies for both backend and frontend**

   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   npm run client-install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```
   # Server configuration
   PORT=3000
   
   # CSV file upload configuration
   CSV_UPLOAD_DIR=./uploads
   
   # Database configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=yourusername
   DB_PASSWORD=yourpassword
   ```

4. **Create uploads directory**

   ```bash
   mkdir uploads
   ```

5. **Run the application**

   For development (runs both frontend and backend concurrently):
   ```bash
   npm run dev-full
   ```
   
   For production:
   ```bash
   # Build frontend
   npm run client-build
   
   # Build backend
   npm run build
   
   # Start the server
   npm start
   ```

## Usage

1. **Upload a CSV file**
   - Click the "Choose File" button to select a CSV file
   - Click "Upload" to process the file

2. **View the JSON output**
   - The converted JSON appears in the left panel
   - Click "Copy" to copy the JSON to clipboard

3. **View saved records**
   - Click "Saved Records" to view previously uploaded files
   - Expand each file to see its data

4. **Check age distribution**
   - For CSVs with age data, see the age distribution analysis

## Sample CSV Format

The application works with any CSV format, but for optimal database storage, use CSV files with these headers:

```
name.firstName,name.lastName,age,address.line1,address.line2,address.city,address.state,gender
```

Example:
```
name.firstName,name.lastName,age,address.line1,address.line2,address.city,address.state,gender
Rohit,Prasad,35,A-563 Rakshak Society,New Pune Road,Pune,Maharashtra,male
Priya,Sharma,28,B-102 Green Valley,Ring Road,Mumbai,Maharashtra,female
```

## Technologies Used

- **Frontend**: React, React Bootstrap, Bootstrap Icons, Axios
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **Others**: UUID, Multer for file uploads, CORS

## Project Structure

```
csv-json-converter/
├── frontend/                   # React frontend
│   ├── public/                 # Public assets
│   └── src/                    # React components and services
│       ├── components/         # UI components
│       └── services/           # API services
├── src/                        # Backend TypeScript code
│   ├── controllers/            # Request handlers
│   ├── services/               # Business logic
│   ├── routes/                 # API routes
│   ├── config.ts               # Configuration
│   ├── app.ts                  # Express application
│   └── server.ts               # Server entry point
├── uploads/                    # Temporary CSV file storage
├── .env                        # Environment variables
└── package.json                # Project dependencies
```

