import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../src/models/User.js';
import Book from '../src/models/Book.js';
import Message from '../src/models/Message.js';
import { connectDB } from '../src/config/database.js';

// Seed data
const seedDatabase = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        await Book.deleteMany();
        await Message.deleteMany();

        console.log('Database cleared');

        // Create users
        const users = [
            {
                name: 'Admin User',
                email: 'admin@library.com',
                password: await bcrypt.hash('Admin@123', 10),
                role: 'admin',
            },
            {
                name: 'Librarian One',
                email: 'librarian1@library.com',
                password: await bcrypt.hash('LibOne@123', 10),
                role: 'librarian',
            },
            {
                name: 'Librarian Two',
                email: 'librarian2@library.com',
                password: await bcrypt.hash('LibTwo@123', 10),
                role: 'librarian',
            },
            {
                name: 'Librarian Three',
                email: 'librarian3@library.com',
                password: await bcrypt.hash('LibThree@123', 10),
                role: 'librarian',
            },
        ];

        const createdUsers = await User.insertMany(users);
        console.log(`${createdUsers.length} users created`);

        // Create books
        const books = [
            {
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                isbn: '9780743273565',
                category: 'fiction',
                quantity: 5,
                userId: createdUsers[0]._id,
            },
            {
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                isbn: '9780061120084',
                category: 'fiction',
                quantity: 3,
                userId: createdUsers[1]._id,
            },
            {
                title: 'A Brief History of Time',
                author: 'Stephen Hawking',
                isbn: '9780553380163',
                category: 'science',
                quantity: 2,
                userId: createdUsers[2]._id,
            },
            {
                title: 'Sapiens: A Brief History of Humankind',
                author: 'Yuval Noah Harari',
                isbn: '9780062316097',
                category: 'history',
                quantity: 4,
                userId: createdUsers[0]._id,
            },
            {
                title: 'Atomic Habits',
                author: 'James Clear',
                isbn: '9780735211292',
                category: 'non-fiction',
                quantity: 6,
                userId: createdUsers[3]._id,
            },
            {
                title: 'The Silent Patient',
                author: 'Alex Michaelides',
                isbn: '9781250301697',
                category: 'fiction',
                quantity: 2,
                userId: createdUsers[1]._id,
            },
        ];

        const createdBooks = await Book.insertMany(books);
        console.log(`${createdBooks.length} books created`);

        // Create messages
        const messages = [
            // Private messages (between admin and librarian1)
            {
                senderId: createdUsers[0]._id,
                receiverId: createdUsers[1]._id,
                type: 'private',
                text: 'Hi Librarian One, how are you today?',
            },
            {
                senderId: createdUsers[1]._id,
                receiverId: createdUsers[0]._id,
                type: 'private',
                text: "Hello Admin, I'm doing well. Just processing some new books.",
            },
            {
                senderId: createdUsers[0]._id,
                receiverId: createdUsers[1]._id,
                type: 'private',
                text: 'Great! Let me know if you need any help.',
            },
            // Private messages (between librarian2 and librarian3)
            {
                senderId: createdUsers[2]._id,
                receiverId: createdUsers[3]._id,
                type: 'private',
                text: 'Have you seen the new history books?',
            },
            {
                senderId: createdUsers[3]._id,
                receiverId: createdUsers[2]._id,
                type: 'private',
                text: 'Yes, they look fascinating!',
            },
            // Group messages
            {
                senderId: createdUsers[0]._id,
                groupId: 'main_group',
                type: 'group',
                text: "Good morning team! Let's have a great day!",
            },
            {
                senderId: createdUsers[1]._id,
                groupId: 'main_group',
                type: 'group',
                text: "Morning! I'll be handling returns today.",
            },
            {
                senderId: createdUsers[2]._id,
                groupId: 'main_group',
                type: 'group',
                text: "I'll take care of the new arrivals.",
            },
            {
                senderId: createdUsers[3]._id,
                groupId: 'main_group',
                type: 'group',
                text: 'I can help with inventory if needed.',
            },
            {
                senderId: createdUsers[0]._id,
                groupId: 'main_group',
                type: 'group',
                text: 'Thanks everyone for your help!',
            },
        ];

        const createdMessages = await Message.insertMany(messages);
        console.log(`${createdMessages.length} messages created`);

        console.log('Database seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

// Run the seed script
connectDB().then(() => seedDatabase());
