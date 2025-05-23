import { Pool, PoolClient } from 'pg';
import { config } from '../config';

class DatabaseService {
  private pool: Pool;
  private isConnected: boolean = false;

  constructor() {
    // Create connection config
    const connectionConfig: any = {
      host: config.db.host,
      port: config.db.port,
      database: config.db.database,
      user: config.db.user,
    };
    
    // Only add password if it's provided
    if (config.db.password) {
      connectionConfig.password = config.db.password;
    }
    
    this.pool = new Pool(connectionConfig);

    // Add error handler for pool
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      this.isConnected = false;
    });

    this.initializeTable();
  }

  private async initializeTable(): Promise<void> {
    try {
      // Only create table if it doesn't exist - DON'T DROP IT!
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS csv_data (
          id SERIAL PRIMARY KEY,
          file_id VARCHAR(255) NOT NULL,
          file_name VARCHAR(255) NOT NULL,
          first_name VARCHAR(255),
          last_name VARCHAR(255),
          age INTEGER,
          address_line1 VARCHAR(255),
          address_line2 VARCHAR(255),
          city VARCHAR(255),
          state VARCHAR(255),
          gender VARCHAR(50),
          full_data JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await this.pool.query(createTableQuery);
      console.log('Table csv_data initialized successfully');
    } catch (error) {
      console.error('Error creating table:', error);
    }
  }

  /**
   * Get a client from the connection pool
   */
  public async getClient(): Promise<PoolClient> {
    try {
      const client = await this.pool.connect();
      this.isConnected = true;
      return client;
    } catch (error: any) { // Type assertion to allow property access
      this.isConnected = false;
      console.error('Failed to get database client:', error);
      
      // Provide more helpful error message
      if (error.message && typeof error.message === 'string' &&
          error.message.includes('role') && error.message.includes('does not exist')) {
        console.error('\n-------------------------------------------------');
        console.error('DATABASE AUTHENTICATION ERROR');
        console.error('The PostgreSQL user specified in your .env file does not exist.');
        console.error('Please update your .env file with valid database credentials:');
        console.error(`Current settings: DB_USER=${config.db.user}, DB_NAME=${config.db.database}`);
        console.error('-------------------------------------------------\n');
      }
      
      throw error;
    }
  }

  /**
   * Upload JSON data to the users table
   */
  public async uploadData(jsonData: any[], fileId: string, fileName: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const row of jsonData) {
        const insertQuery = `
          INSERT INTO csv_data (file_id, file_name, first_name, last_name, age, address_line1, address_line2, city, state, gender, full_data)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `;
        const values = [
          fileId,
          fileName,
          row.name?.firstName || '',
          row.name?.lastName || '',
          parseInt(row.age) || null,
          row.address?.line1 || '',
          row.address?.line2 || '',
          row.address?.city || '',
          row.address?.state || '',
          row.gender || '',
          JSON.stringify(row)
        ];
        
        await client.query(insertQuery, values);
      }
      
      await client.query('COMMIT');
      console.log(`Successfully saved ${jsonData.length} records to database`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error uploading data:', error);
      throw new Error('Failed to upload data to database: ' + error);
    } finally {
      client.release();
    }
  }

  /**
   * Check database connection
   */
  public async checkConnection(): Promise<boolean> {
    try {
      const client = await this.getClient();
      client.release();
      return true;
    } catch (error: any) { // Type assertion
      return false;
    }
  }

  /**
   * Get all data from the users table
   */
  async getAllData(): Promise<any[]> {
    try {
      console.log('Executing query to get all data...');
      const query = 'SELECT * FROM csv_data ORDER BY created_at DESC';
      const result = await this.pool.query(query);
      console.log('Query result rows:', result.rows.length);
      return result.rows;
    } catch (error) {
      console.error('Error fetching all data:', error);
      throw new Error('Failed to retrieve data from database');
    }
  }

  async getAllFiles(): Promise<any[]> {
    try {
      const query = `
        SELECT file_id, file_name, COUNT(*) as record_count, MIN(created_at) as uploaded_at
        FROM csv_data 
        GROUP BY file_id, file_name 
        ORDER BY uploaded_at DESC
      `;
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching files:', error);
      throw new Error('Failed to retrieve files from database');
    }
  }

  async getDataByFileId(fileId: string): Promise<any[]> {
    try {
      const query = 'SELECT * FROM csv_data WHERE file_id = $1 ORDER BY id';
      const result = await this.pool.query(query, [fileId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching data by file ID:', error);
      throw new Error('Failed to retrieve data from database');
    }
  }

  async getDataCount(): Promise<number> {
    try {
      const query = 'SELECT COUNT(*) FROM csv_data';
      const result = await this.pool.query(query);
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('Error getting data count:', error);
      return 0;
    }
  }
}

export const dbService = new DatabaseService();