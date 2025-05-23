import { Request, Response } from 'express';
import fs from 'fs';
import { CsvParser } from '../services/csv-parser';
import { dbService } from '../services/db';
import { SchemaValidator } from '../services/schema-validator';
import { v4 as uuidv4 } from 'uuid';

export const uploadCsv = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileId = uuidv4(); // Generate unique file ID
    
    // Parse CSV file
    const jsonData = await CsvParser.parseFile(filePath);
    
    if (jsonData.length === 0) {
      return res.status(400).json({ error: 'CSV file is empty or invalid' });
    }
    
    // Validate schema
    const validation = SchemaValidator.validateData(jsonData);
    
    let savedToDatabase = false;
    if (validation.isValid) {
      try {
        // Upload data to database with file info
        await dbService.uploadData(jsonData, fileId, fileName);
        savedToDatabase = true;
        
        // Debug: Check if data was actually saved
        const savedCount = await dbService.getDataCount();
        console.log(`Total records in database after save: ${savedCount}`);
      } catch (dbError: any) {
        console.error('Database save error:', dbError);
        validation.errors.push('Failed to save to database: ' + dbError.message);
      }
    }
    
    // Clean up the uploaded file
    fs.unlinkSync(filePath);
    
    return res.status(200).json({ 
      message: 'CSV file processed successfully',
      recordCount: jsonData.length,
      jsonData: jsonData,
      savedToDatabase,
      fileId,
      fileName,
      schemaValidation: validation,
      expectedSchema: SchemaValidator.getExpectedSchema()
    });
  } catch (error: any) {
    console.error('Error processing CSV file:', error);
    return res.status(500).json({ error: 'Failed to process CSV file', message: error.message });
  }
};

export const getSavedRecords = async (req: Request, res: Response) => {
  try {
    console.log('Getting saved records from database...');
    const savedData = await dbService.getAllData();
    console.log('Found records:', savedData.length);
    return res.status(200).json({
      success: true,
      recordCount: savedData.length,
      data: savedData
    });
  } catch (error: any) {
    console.error('Error fetching saved records:', error);
    return res.status(500).json({ error: 'Failed to fetch saved records', message: error.message });
  }
};

export const getSavedFiles = async (req: Request, res: Response) => {
  try {
    console.log('Getting saved files from database...');
    const savedFiles = await dbService.getAllFiles();
    console.log('Found files:', savedFiles.length);
    return res.status(200).json({
      success: true,
      fileCount: savedFiles.length,
      files: savedFiles
    });
  } catch (error: any) {
    console.error('Error fetching saved files:', error);
    return res.status(500).json({ error: 'Failed to fetch saved files', message: error.message });
  }
};

export const getFileData = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    console.log('Getting data for file ID:', fileId);
    const fileData = await dbService.getDataByFileId(fileId);
    console.log('Found records:', fileData.length);
    return res.status(200).json({
      success: true,
      recordCount: fileData.length,
      data: fileData
    });
  } catch (error: any) {
    console.error('Error fetching file data:', error);
    return res.status(500).json({ error: 'Failed to fetch file data', message: error.message });
  }
};