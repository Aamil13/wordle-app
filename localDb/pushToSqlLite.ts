import { IWordles } from "@/services/wordle/types";
import { db } from "./sqlLite";

export const initDatabase = () => {
  try {
    db.execSync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        mongo_id TEXT UNIQUE,

        word TEXT NOT NULL,
        hint TEXT NOT NULL,

        difficulty TEXT NOT NULL,
        category TEXT NOT NULL,

        timesPlayed INTEGER NOT NULL DEFAULT 0,
        successRate REAL NOT NULL DEFAULT 0,
        averageAttempts REAL NOT NULL DEFAULT 0,

        isActive INTEGER NOT NULL DEFAULT 1,

        createdAt TEXT,
        updatedAt TEXT
      );

      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY,
        bgEnabled INTEGER NOT NULL DEFAULT 1,
        hapticsEnabled INTEGER NOT NULL DEFAULT 1,
        keyboardSoundEnabled INTEGER NOT NULL DEFAULT 1,
        keyboardSoundOnPressEnabled INTEGER NOT NULL DEFAULT 1,
        theme TEXT NOT NULL DEFAULT 'dark',
        volume REAL NOT NULL DEFAULT 0.5
      );

      CREATE TABLE IF NOT EXISTS stats (
        id INTEGER PRIMARY KEY,
        streak INTEGER NOT NULL DEFAULT 0,
        bestStreak INTEGER NOT NULL DEFAULT 0,
        lastPlayedDate TEXT
      );

      CREATE TABLE IF NOT EXISTS pending_played_updates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mongo_id TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);

    // =========================
    // SETTINGS MIGRATIONS
    // =========================

    try {
      db.execSync(`
        ALTER TABLE settings
        ADD COLUMN theme TEXT NOT NULL DEFAULT 'dark';
      `);
    } catch {}

    // =========================
    // WORDS MIGRATIONS
    // =========================

    try {
      db.execSync(`
        ALTER TABLE words
        ADD COLUMN difficulty TEXT NOT NULL DEFAULT 'easy';
      `);
    } catch {}

    try {
      db.execSync(`
        ALTER TABLE words
        ADD COLUMN category TEXT NOT NULL DEFAULT '';
      `);
    } catch {}

    try {
      db.execSync(`
        ALTER TABLE words
        ADD COLUMN timesPlayed INTEGER NOT NULL DEFAULT 0;
      `);
    } catch {}

    try {
      db.execSync(`
        ALTER TABLE words
        ADD COLUMN successRate REAL NOT NULL DEFAULT 0;
      `);
    } catch {}

    try {
      db.execSync(`
        ALTER TABLE words
        ADD COLUMN averageAttempts REAL NOT NULL DEFAULT 0;
      `);
    } catch {}

    try {
      db.execSync(`
        ALTER TABLE words
        ADD COLUMN isActive INTEGER NOT NULL DEFAULT 1;
      `);
    } catch {}

    try {
      db.execSync(`
        ALTER TABLE words
        ADD COLUMN createdAt TEXT;
      `);
    } catch {}

    try {
      db.execSync(`
        ALTER TABLE words
        ADD COLUMN updatedAt TEXT;
      `);
    } catch {}

    try {
      db.execSync(`
        ALTER TABLE words
        ADD COLUMN noOfTimesShown INTEGER NOT NULL DEFAULT 0;
      `);
    } catch {}

    // =========================
    // DEFAULT ROWS
    // =========================

    db.execSync(`
      INSERT OR IGNORE INTO settings (id)
      VALUES (1);
    `);

    db.execSync(`
      INSERT OR IGNORE INTO stats (id)
      VALUES (1);
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// =========================
// SAVE WORDS (REPLACE ALL)
// =========================

export const saveWordsToDatabase = (words: IWordles[]) => {
  try {
    db.runSync("DELETE FROM words");

    const statement = db.prepareSync(`
      INSERT INTO words (
        mongo_id,
        word,
        hint,
        difficulty,
        category,
        timesPlayed,
        successRate,
        averageAttempts,
        isActive,
        createdAt,
        updatedAt,
        noOfTimesShown
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of words) {
      statement.executeSync([
        item._id || "",
        item.word,
        item.hint,

        item.difficulty,
        item.category,

        item.timesPlayed,
        item.successRate,
        item.averageAttempts,

        item.isActive ? 1 : 0,

        item.createdAt ? new Date(item.createdAt).toISOString() : null,

        item.updatedAt ? new Date(item.updatedAt).toISOString() : null,
        item.noOfTimesShown || 0,
      ]);
    }

    statement.finalizeSync();

    console.log("Words saved successfully");
  } catch (error) {
    console.error("Error saving words:", error);
  }
};

// =========================
// ADD WORDS
// =========================

export const addWordsToDatabase = (words: IWordles[]) => {
  try {
    const statement = db.prepareSync(`
      INSERT OR REPLACE INTO words (
        mongo_id,
        word,
        hint,
        difficulty,
        category,
        timesPlayed,
        successRate,
        averageAttempts,
        isActive,
        createdAt,
        updatedAt,
        noOfTimesShown
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of words) {
      console.log("Saving word with _id:", item._id);
      statement.executeSync([
        item._id || "",
        item.word,
        item.hint,

        item.difficulty,
        item.category,

        item.timesPlayed,
        item.successRate,
        item.averageAttempts,

        item.isActive ? 1 : 0,

        item.createdAt ? new Date(item.createdAt).toISOString() : null,

        item.updatedAt ? new Date(item.updatedAt).toISOString() : null,
        item.noOfTimesShown || 0,
      ]);
    }

    statement.finalizeSync();

    console.log("Words added successfully");
  } catch (error) {
    console.error("Error adding words:", error);
  }
};

// =========================
// DELETE BY MONGO ID
// =========================

export const deleteWordByMongoId = (mongoId: string) => {
  try {
    const result = db.runSync("DELETE FROM words WHERE mongo_id = ?", [
      mongoId,
    ]);

    return result.changes > 0;
  } catch (error) {
    console.error("Error deleting word:", error);
    return false;
  }
};

// =========================
// DELETE MULTIPLE
// =========================

export const deleteWordsByMongoIds = (mongoIds: string[]) => {
  try {
    if (mongoIds.length === 0) return 0;

    const placeholders = mongoIds.map(() => "?").join(",");

    const result = db.runSync(
      `DELETE FROM words WHERE mongo_id IN (${placeholders})`,
      mongoIds,
    );

    return result.changes;
  } catch (error) {
    console.error("Error deleting words:", error);
    return 0;
  }
};

// =========================
// DELETE BY SQLITE ID
// =========================

export const deleteWordById = (id: number) => {
  try {
    const result = db.runSync("DELETE FROM words WHERE id = ?", [id]);

    return result.changes > 0;
  } catch (error) {
    console.error("Error deleting word:", error);
    return false;
  }
};

// =========================
// GET WORDS WITH SQLITE IDS
// =========================

export const getWordsWithIds = (): IWordles[] => {
  try {
    const result = db.getAllSync<IWordles>(`
      SELECT
        id,
        mongo_id,
        word,
        hint,
        difficulty,
        category,
        timesPlayed,
        successRate,
        averageAttempts,
        isActive,
        createdAt,
        updatedAt
      FROM words
    `);

    return result;
  } catch (error) {
    console.error("Error retrieving words:", error);
    return [];
  }
};

// =========================
// GET WORDS
// =========================

export const getWordsFromDatabase = (): IWordles[] => {
  try {
    const result = db.getAllSync<IWordles>(`
      SELECT
        mongo_id as "_id",
        word,
        hint,
        difficulty,
        category,
        timesPlayed,
        successRate,
        averageAttempts,
        isActive,
        createdAt,
        updatedAt
      FROM words
      WHERE isActive = 1
    `);

    // Transform the result to ensure _id comes from mongo_id, not SQLite id
    const transformed = result.map((item) => ({
      ...item,
      _id: item.mongo_id || item._id,
    }));

    console.log("Raw DB result:", JSON.stringify(result, null, 2));
    console.log("Transformed result:", JSON.stringify(transformed, null, 2));
    return transformed;
  } catch (error) {
    console.error("Error retrieving words:", error);
    return [];
  }
};

// =========================
// GET RANDOM WORDS
// =========================

export const getRandomWords = (count: number): IWordles[] => {
  try {
    const result = db.getAllSync<IWordles>(
      `
      SELECT
        mongo_id as _id,
        word,
        hint,
        difficulty,
        category,
        timesPlayed,
        successRate,
        averageAttempts,
        isActive,
        createdAt,
        updatedAt,
        noOfTimesShown
      FROM words
      WHERE isActive = 1
      ORDER BY noOfTimesShown ASC, RANDOM()
      LIMIT ?
      `,
      [count],
    );

    // Transform the result to ensure _id comes from mongo_id, not SQLite id
    const transformed = result.map((item) => ({
      ...item,
      _id: item.mongo_id || item._id,
    }));

    return transformed;
  } catch (error) {
    console.error("Error getting random words:", error);
    return [];
  }
};

// =========================
// REPLACE FIRST N WORDS
// =========================

export const replaceFirstNWords = (n: number, newWords: IWordles[]) => {
  try {
    const idsToDelete = db.getAllSync<{ id: number }>(
      `
      SELECT id
      FROM words
      ORDER BY id ASC
      LIMIT ?
      `,
      [n],
    );

    if (idsToDelete.length > 0) {
      const ids = idsToDelete.map((row) => row.id).join(",");

      db.runSync(`
        DELETE FROM words
        WHERE id IN (${ids})
      `);
    }

    addWordsToDatabase(newWords);

    console.log(`Replaced first ${n} words`);
  } catch (error) {
    console.error("Error replacing words:", error);
  }
};

// =========================
// TOTAL WORD COUNT
// =========================

export const getTotalWordCount = (): number => {
  try {
    const result = db.getFirstSync<{ count: number }>(`
      SELECT COUNT(*) as count
      FROM words
      WHERE isActive = 1
    `);

    return result?.count || 0;
  } catch (error) {
    console.error("Error getting total word count:", error);
    return 0;
  }
};

// =========================
// INCREMENT NO OF TIMES SHOWN
// =========================

export const incrementWordShownCount = (mongoId: string): void => {
  try {
    db.runSync(
      `
      UPDATE words
      SET noOfTimesShown = noOfTimesShown + 1
      WHERE mongo_id = ?
      `,
      [mongoId],
    );
  } catch (error) {
    console.error("Error incrementing word shown count:", error);
  }
};

// =========================
// PENDING PLAYED UPDATES
// =========================

export interface PendingPlayedUpdate {
  id: number;
  mongo_id: string;
  data: string;
  created_at: string;
}

export const savePendingPlayedUpdate = (
  mongoId: string,
  data: Partial<IWordles>,
): void => {
  try {
    db.runSync(
      `
      INSERT INTO pending_played_updates (mongo_id, data, created_at)
      VALUES (?, ?, ?)
      `,
      [mongoId, JSON.stringify(data), new Date().toISOString()],
    );
    console.log("Saved pending played update for mongo_id:", mongoId);
  } catch (error) {
    console.error("Error saving pending played update:", error);
  }
};

export const getPendingPlayedUpdates = (): PendingPlayedUpdate[] => {
  try {
    const result = db.getAllSync<PendingPlayedUpdate>(
      `
      SELECT id, mongo_id, data, created_at
      FROM pending_played_updates
      ORDER BY created_at ASC
      `,
    );
    return result;
  } catch (error) {
    console.error("Error getting pending played updates:", error);
    return [];
  }
};

export const deletePendingPlayedUpdate = (id: number): void => {
  try {
    db.runSync("DELETE FROM pending_played_updates WHERE id = ?", [id]);
    console.log("Deleted pending played update id:", id);
  } catch (error) {
    console.error("Error deleting pending played update:", error);
  }
};

export const clearPendingPlayedUpdates = (): void => {
  try {
    db.runSync("DELETE FROM pending_played_updates");
    console.log("Cleared all pending played updates");
  } catch (error) {
    console.error("Error clearing pending played updates:", error);
  }
};

// =========================
// SYNC PENDING PLAYED UPDATES
// =========================

export const syncPendingPlayedUpdates = async (
  updateApi: (id: string, data: Partial<IWordles>) => Promise<any>,
): Promise<void> => {
  try {
    const pendingUpdates = getPendingPlayedUpdates();

    if (pendingUpdates.length === 0) {
      console.log("No pending played updates to sync");
      return;
    }

    console.log(`Syncing ${pendingUpdates.length} pending played updates`);

    for (const update of pendingUpdates) {
      try {
        const parsedData = JSON.parse(update.data) as Partial<IWordles>;
        await updateApi(update.mongo_id, parsedData);
        deletePendingPlayedUpdate(update.id);
        console.log(`Synced played update for mongo_id: ${update.mongo_id}`);
      } catch (error) {
        console.error(
          `Failed to sync played update for mongo_id: ${update.mongo_id}`,
          error,
        );
      }
    }
  } catch (error) {
    console.error("Error syncing pending played updates:", error);
  }
};
