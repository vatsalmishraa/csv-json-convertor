export interface ExpectedSchema {
  [key: string]: 'string' | 'number' | 'boolean' | 'json' | 'object';
}

export class SchemaValidator {
  // Updated schema to match your CSV structure
  private static expectedSchema: ExpectedSchema = {
    'name.firstName': 'string',
    'name.lastName': 'string',
    'age': 'number',
    'address.line1': 'string',
    'address.line2': 'string',
    'address.city': 'string',
    'address.state': 'string',
    'gender': 'string'
  };

  public static validateData(jsonData: any[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (jsonData.length === 0) {
      return { isValid: false, errors: ['No data found'] };
    }

    // Check the actual structure - if it's nested objects, flatten for comparison
    const firstRow = jsonData[0];
    const actualColumns = this.getFlatKeys(firstRow);
    const expectedColumns = Object.keys(this.expectedSchema);

    console.log('Actual columns:', actualColumns);
    console.log('Expected columns:', expectedColumns);

    // Check for missing columns
    const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));
    if (missingColumns.length > 0) {
      errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    // Check for extra columns (more lenient - just warn)
    const extraColumns = actualColumns.filter(col => !expectedColumns.includes(col));
    if (extraColumns.length > 0) {
      console.warn(`Extra columns found: ${extraColumns.join(', ')}`);
    }

    // Validate data types for first few rows
    for (let i = 0; i < Math.min(jsonData.length, 3); i++) {
      const row = jsonData[i];
      const flatRow = this.flattenObject(row);
      
      for (const [column, expectedType] of Object.entries(this.expectedSchema)) {
        if (flatRow[column] !== undefined) {
          const isValidType = this.validateFieldType(flatRow[column], expectedType);
          if (!isValidType) {
            errors.push(`Row ${i + 1}: Column '${column}' should be ${expectedType}, got: ${typeof flatRow[column]} (${flatRow[column]})`);
          }
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  // Helper to get flat keys from nested object
  private static getFlatKeys(obj: any, prefix: string = ''): string[] {
    let keys: string[] = [];
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          keys = keys.concat(this.getFlatKeys(obj[key], fullKey));
        } else {
          keys.push(fullKey);
        }
      }
    }
    
    return keys;
  }

  // Helper to flatten nested object
  private static flattenObject(obj: any, prefix: string = ''): any {
    let flattened: any = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          Object.assign(flattened, this.flattenObject(obj[key], fullKey));
        } else {
          flattened[fullKey] = obj[key];
        }
      }
    }
    
    return flattened;
  }

  private static validateFieldType(value: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string' && value.trim() !== '';
      case 'number':
        return !isNaN(Number(value)) && value !== '';
      case 'boolean':
        return typeof value === 'boolean' || value === 'true' || value === 'false';
      case 'json':
        if (typeof value === 'object') return true;
        try {
          JSON.parse(value);
          return true;
        } catch {
          return false;
        }
      default:
        return true;
    }
  }

  public static getExpectedSchema(): ExpectedSchema {
    return this.expectedSchema;
  }
}
