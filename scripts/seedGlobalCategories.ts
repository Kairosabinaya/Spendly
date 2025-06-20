/**
 * Script to seed global categories in Firestore
 * Run this script to populate the globalCategories collection
 * 
 * Usage:
 * npm run seed-categories
 * or
 * npx ts-node scripts/seedGlobalCategories.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { DEFAULT_CATEGORIES } from '../hooks/useCategories';

// Firebase configuration - make sure to set your environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedGlobalCategories() {
  console.log('🌱 Starting global categories seeding...');
  
  try {
    // Check if global categories already exist
    const globalCategoriesSnapshot = await getDocs(collection(db, 'globalCategories'));
    
    if (!globalCategoriesSnapshot.empty) {
      console.log('⚠️  Global categories already exist. Skipping seeding.');
      console.log(`Found ${globalCategoriesSnapshot.size} existing categories.`);
      return;
    }

    // Seed default categories as global categories
    console.log(`📂 Seeding ${DEFAULT_CATEGORIES.length} global categories...`);
    
    const promises = DEFAULT_CATEGORIES.map(async (category, index) => {
      try {
        const docRef = await addDoc(collection(db, 'globalCategories'), {
          ...category,
          createdAt: Timestamp.now(),
          order: index, // For consistent ordering
          isSystem: true, // Mark as system category
        });
        
        console.log(`✅ Added category: ${category.name} (ID: ${docRef.id})`);
        return docRef;
      } catch (error) {
        console.error(`❌ Failed to add category: ${category.name}`, error);
        throw error;
      }
    });

    await Promise.all(promises);
    
    console.log('🎉 Global categories seeding completed successfully!');
    console.log(`📊 Total categories added: ${DEFAULT_CATEGORIES.length}`);
    
  } catch (error) {
    console.error('💥 Error seeding global categories:', error);
    process.exit(1);
  }
}

async function listGlobalCategories() {
  console.log('📋 Listing current global categories...');
  
  try {
    const snapshot = await getDocs(collection(db, 'globalCategories'));
    
    if (snapshot.empty) {
      console.log('📭 No global categories found.');
      return;
    }

    console.log(`📊 Found ${snapshot.size} global categories:`);
    snapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`${index + 1}. ${data.name} (${data.icon}) - ${data.isActive ? 'Active' : 'Inactive'}`);
    });
    
  } catch (error) {
    console.error('❌ Error listing global categories:', error);
  }
}

async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'seed':
      await seedGlobalCategories();
      break;
    case 'list':
      await listGlobalCategories();
      break;
    case 'both':
      await seedGlobalCategories();
      await listGlobalCategories();
      break;
    default:
      console.log('📖 Usage:');
      console.log('  npm run seed-categories seed  - Seed global categories');
      console.log('  npm run seed-categories list  - List existing categories');
      console.log('  npm run seed-categories both  - Seed and then list');
      break;
  }
  
  process.exit(0);
}

// Run the script
if (require.main === module) {
  main().catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

export { seedGlobalCategories, listGlobalCategories }; 