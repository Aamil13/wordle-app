import { db } from "./sqlLite";


type WordItem = {
  _id?: string; // MongoDB ObjectId as string
  word: string;
  hint: string;
};

// SQLite result types
type WordRow = {
  id: number; // SQLite auto-increment ID
  mongo_id: string; // MongoDB _id stored as string
  word: string;
  hint: string;
};

// MUST call this FIRST before any other database operations
export const initDatabase = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mongo_id TEXT UNIQUE,
        word TEXT NOT NULL,
        hint TEXT NOT NULL
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Save with MongoDB _id
export const saveWordsToDatabase = (words: WordItem[]) => {
  try {
    db.runSync('DELETE FROM words');
    
    const statement = db.prepareSync(
      'INSERT INTO words (mongo_id, word, hint) VALUES (?, ?, ?)'
    );
    
    for (const item of words) {
      statement.executeSync([
        item._id || '', // Store MongoDB _id
        item.word,
        item.hint
      ]);
    }
    
    statement.finalizeSync();
    console.log('Words saved successfully');
  } catch (error) {
    console.error('Error saving words:', error);
  }
};

// Add words without deleting
export const addWordsToDatabase = (words: WordItem[]) => {
  try {
    const statement = db.prepareSync(
      'INSERT OR REPLACE INTO words (mongo_id, word, hint) VALUES (?, ?, ?)'
    );
    
    for (const item of words) {
      statement.executeSync([
        item._id || '',
        item.word,
        item.hint
      ]);
    }
    
    statement.finalizeSync();
    console.log('Words added successfully');
  } catch (error) {
    console.error('Error adding words:', error);
  }
};

// Delete by MongoDB _id
export const deleteWordByMongoId = (mongoId: string) => {
  try {
    const result = db.runSync('DELETE FROM words WHERE mongo_id = ?', [mongoId]);
    
    if (result.changes > 0) {
      console.log(`Word with MongoDB ID ${mongoId} deleted successfully`);
      return true;
    } else {
      console.log(`No word found with MongoDB ID ${mongoId}`);
      return false;
    }
  } catch (error) {
    console.error('Error deleting word:', error);
    return false;
  }
};

// Delete multiple by MongoDB _ids
export const deleteWordsByMongoIds = (mongoIds: string[]) => {
  try {
    if (mongoIds.length === 0) return 0;
    
    const placeholders = mongoIds.map(() => '?').join(',');
    const result = db.runSync(
      `DELETE FROM words WHERE mongo_id IN (${placeholders})`,
      mongoIds
    );
    
    console.log(`${result.changes} words deleted`);
    return result.changes;
  } catch (error) {
    console.error('Error deleting words:', error);
    return 0;
  }
};

// Delete by SQLite ID (if you still need it)
export const deleteWordById = (id: number) => {
  try {
    const result = db.runSync('DELETE FROM words WHERE id = ?', [id]);
    
    if (result.changes > 0) {
      console.log(`Word with ID ${id} deleted successfully`);
      return true;
    } else {
      console.log(`No word found with ID ${id}`);
      return false;
    }
  } catch (error) {
    console.error('Error deleting word:', error);
    return false;
  }
};

// Get words with both IDs
export const getWordsWithIds = (): WordRow[] => {
  try {
    const result = db.getAllSync<WordRow>(
      'SELECT id, mongo_id, word, hint FROM words'
    );
    return result;
  } catch (error) {
    console.error('Error retrieving words:', error);
    return [];
  }
};

// Get words in original format (for looping)
export const getWordsFromDatabase = (): WordItem[] => {
  try {
    const result = db.getAllSync<WordItem>(
      'SELECT mongo_id as _id, word, hint FROM words'
    );
    return result;
  } catch (error) {
    console.error('Error retrieving words:', error);
    return [];
  }
};


// get ramdom words 
export const getRandomWords = (count: number): WordItem[] => {
  try {
    const result = db.getAllSync<WordItem>(
      'SELECT mongo_id as _id, word, hint FROM words ORDER BY RANDOM() LIMIT ?',
      [count]
    );
    return result;
  } catch (error) {
    console.error('Error getting random words:', error);
    return [];
  }
};

// Replace first N and add new ones
export const replaceFirstNWords = (n: number, newWords: WordItem[]) => {
  try {
    const idsToDelete = db.getAllSync<{ id: number }>(
      'SELECT id FROM words ORDER BY id ASC LIMIT ?',
      [n]
    );
    
    if (idsToDelete.length > 0) {
      const ids = idsToDelete.map(row => row.id).join(',');
      db.runSync(`DELETE FROM words WHERE id IN (${ids})`);
    }
    
    const statement = db.prepareSync(
      'INSERT INTO words (mongo_id, word, hint) VALUES (?, ?, ?)'
    );
    
    for (const item of newWords) {
      statement.executeSync([item._id || '', item.word, item.hint]);
    }
    
    statement.finalizeSync();
    console.log(`Replaced first ${n} words`);
  } catch (error) {
    console.error('Error replacing words:', error);
  }
};


// Get total number of words in database
export const getTotalWordCount = (): number => {
  try {
    const result = db.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM words'
    );
    return result?.count || 0;
  } catch (error) {
    console.error('Error getting total word count:', error);
    return 0;
  }
};