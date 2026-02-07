const mongoose = require('mongoose');
require('dotenv').config();

async function cleanupDB() {
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        console.log('Connected to DB');

        const db = mongoose.connection.db;
        
        // Drop all indexes on users collection except _id
        console.log('Dropping indexes on users collection...');
        const indexInfo = await db.collection('users').listIndexes().toArray();
        
        for (const index of indexInfo) {
            if (index.name !== '_id_') {
                console.log(`Dropping index: ${index.name}`);
                await db.collection('users').dropIndex(index.name);
            }
        }

        // Delete all users
        console.log('Clearing all users...');
        const result = await db.collection('users').deleteMany({});
        console.log(`Deleted ${result.deletedCount} documents`);

        console.log('Database cleanup completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

cleanupDB();
