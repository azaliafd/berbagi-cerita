import { openDB } from 'idb';

const DB_NAME = 'dicoding-story-db';
const DB_VERSION = 1;
const STORE_NAME = 'stories';

async function openDatabase() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function getAllStories() {
  const db = await openDatabase();
  return db.getAll(STORE_NAME);
}

export async function saveStory(story) {
  const db = await openDatabase();
  return db.put(STORE_NAME, story);
}

export async function deleteStory(id) {
  const db = await openDatabase();
  return db.delete(STORE_NAME, id);
}

export async function getStoryById(id) {
  const db = await openDatabase();
  return db.get(STORE_NAME, id);
}
