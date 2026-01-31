import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@music.com' },
        update: {},
        create: {
            username: 'SuperAdmin',
            email: 'admin@music.com',
            password: adminPassword,
            role: 'ADMIN',
        },
    });

    // Create Artist
    const artistPassword = await bcrypt.hash('artist123', 10);
    const artistUser = await prisma.user.upsert({
        where: { email: 'artist@music.com' },
        update: {},
        create: {
            username: 'CoolArtist',
            email: 'artist@music.com',
            password: artistPassword,
            role: 'ARTIST',
        },
    });

    const artistProfile = await prisma.artist.upsert({
        where: { userId: artistUser.id },
        update: {},
        create: {
            userId: artistUser.id,
            bio: 'I make cool music.',
            verified: true,
        },
    });

    // Create User
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'user@music.com' },
        update: {},
        create: {
            username: 'MusicLover',
            email: 'user@music.com',
            password: userPassword,
            role: 'USER',
        },
    });

    // Create Genre
    const genre = await prisma.genre.upsert({
        where: { slug: 'pop' },
        update: {},
        create: {
            name: 'Pop',
            slug: 'pop',
        },
    });

    // Create Album
    const album = await prisma.album.create({
        data: {
            title: 'First Hits',
            artistId: artistProfile.id,
            releaseDate: new Date(),
        },
    });

    // Create Track
    await prisma.track.create({
        data: {
            title: 'Song One',
            artistId: artistProfile.id,
            albumId: album.id,
            genreId: genre.id,
            duration: 180,
            filePath: '/uploads/song1.mp3', // Placeholder
            artistName: artistUser.username,
            status: 'APPROVED',
        },
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
