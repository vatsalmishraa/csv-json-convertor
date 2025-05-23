import fs from 'fs';

/**
 * Custom CSV parser that converts CSV data to JSON, handling nested properties
 */
export class CsvParser {
  /**
   * Parse a CSV file and convert it to JSON
   */
  public static async parseFile(filePath: string): Promise<any[]> {
    const csvContent = await fs.promises.readFile(filePath, 'utf8');
    return this.parseString(csvContent);
  }

  /**
   * Parse CSV string content and convert it to JSON
   */
  public static parseString(csvContent: string): any[] {
    // Split the content by lines
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      return [];
    }

    // First line contains the headers
    const headers = this.parseCSVLine(lines[0])
      .map(header => header.trim());

    // Process each row
    const jsonData = [];
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      
      if (values.length !== headers.length) {
        console.warn(`Line ${i + 1} has ${values.length} values but expected ${headers.length}. Skipping.`);
        continue;
      }

      const rowObject: Record<string, any> = {};
      
      // Process each value
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        const value = values[j].trim();
        
        // Handle nested properties (with dot notation)
        this.setNestedProperty(rowObject, header, value);
      }
      
      jsonData.push(rowObject);
    }

    return jsonData;
  }

  /**
   * Parse a single CSV line, handling quoted values with commas
   */
  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last value
    result.push(current);
    
    return result;
  }

  /**
   * Set a nested property in an object using dot notation
   */
  private static setNestedProperty(obj: Record<string, any>, propertyPath: string, value: string) {
    const parts = propertyPath.split('.');
    let current = obj;
    
    // Process all parts except the last one
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      
      if (!current[part]) {
        current[part] = {};
      }
      
      current = current[part];
    }
    
    // Set the value at the last part
    const lastPart = parts[parts.length - 1];
    
    // Try to convert to number if possible
    if (/^\d+$/.test(value)) {
      current[lastPart] = parseInt(value, 10);
    } else if (/^\d+\.\d+$/.test(value)) {
      current[lastPart] = parseFloat(value);
    } else {
      current[lastPart] = value;
    }
  }
}
