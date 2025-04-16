import { faker } from '@faker-js/faker';
import prisma from './index.js';
import axios from 'axios';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const seed = async () => {

  const createUser = async () => {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      isAdmin: faker.datatype.boolean(),
    };
  };

  const seedUsers = async () => {
    const userPromises = Array.from({ length: 20 }, () => createUser());
    const users = await Promise.all(userPromises);
    await prisma.user.createMany({ data: users });
  };

  const topMovieIds = [
    'tt0111161', // The Shawshank Redemption
    'tt0068646', // The Godfather
    'tt0071562', // The Godfather: Part II
    'tt0468569', // The Dark Knight
    'tt0050083', // 12 Angry Men
    'tt0108052', // Schindler's List
    'tt0167260', // The Lord of the Rings: The Return of the King
    'tt0110912', // Pulp Fiction
    'tt0060196', // The Good, the Bad and the Ugly
    'tt0109830', // Forrest Gump
    'tt0120737', // The Lord of the Rings: The Fellowship of the Ring
    'tt0137523', // Fight Club
    'tt0167261', // The Lord of the Rings: The Two Towers
    'tt0080684', // Star Wars: Episode V - The Empire Strikes Back
    'tt0133093', // The Matrix
    'tt0099685', // Goodfellas
    'tt0073486', // One Flew Over the Cuckoo's Nest
    'tt0047478', // Seven Samurai
    'tt0114369', // Se7en
    'tt0317248', // City of God
    'tt0076759', // Star Wars: Episode IV - A New Hope
    'tt0102926', // The Silence of the Lambs
    'tt0038650', // It's a Wonderful Life
    'tt0118799', // Life Is Beautiful
    'tt0120689', // The Green Mile
    'tt0120815', // Saving Private Ryan
    'tt0816692', // Interstellar
    'tt0245429', // Spirited Away
    'tt0120586', // American History X
    'tt0110413', // Léon: The Professional
    'tt0114814', // The Usual Suspects
    'tt0056058', // Harakiri
    'tt0110357', // The Lion King
    'tt0088763', // Back to the Future
    'tt0253474', // The Pianist
    'tt0103064', // Terminator 2: Judgment Day
    'tt0027977', // Modern Times
    'tt0054215', // Psycho
    'tt0172495', // Gladiator
    'tt0021749', // City Lights
    'tt0407887', // The Departed
    'tt1675434', // The Intouchables
    'tt0482571', // The Prestige
    'tt0064116', // Once Upon a Time in the West
    'tt0095327', // Grave of the Fireflies
    'tt0034583', // Casablanca
    'tt0095765', // Cinema Paradiso
    'tt0047396', // Rear Window
    'tt0078748', // Alien
  ];

  async function getAPIKey() {
    // First check if API key is in environment variables
    const apiKey = process.env.OMDB_API_KEY;
    if (apiKey) {
      return apiKey;
    }
  
    // If not, prompt the user
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    return new Promise((resolve) => {
      rl.question('Please enter your OMDb API key: ', (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  };

  async function fetchTopMovies(apiKey) {
    console.log(`Fetching top 50 movies from OMDb API...`);
    const baseUrl = 'https://www.omdbapi.com/';
    const movies = [];
  
    for (const imdbId of topMovieIds) {
      try {
        const response = await axios.get(baseUrl, {
          params: {
            apikey: apiKey,
            i: imdbId,
            plot: 'full'
          }
        });
  
        if (response.data.Response === 'True') {
          movies.push(response.data);
          console.log(`Fetched movie ${movies.length}/50: ${response.data.Title} (${response.data.Year})`);
        } else {
          console.warn(`Failed to fetch movie with ID ${imdbId}: ${response.data.Error}`);
        }
  
        // Respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching movie with ID ${imdbId}:`, error.message);
      }
    }
  
    console.log(`Successfully fetched ${movies.length} top movies`);
    return movies;
  };

  const seedMovies = async (movies, userId) => {
    const formatted = movies.map(movie => ({
      imdbId: movie.imdbID,
      title: movie.Title,
      plot: movie.Plot || null,
      poster: movie.Poster !== 'N/A' ? movie.Poster : null,
      year: movie.Year,
      genre: movie.Genre,
      imdbRating: movie.imdbRating !== 'N/A' ? parseFloat(movie.imdbRating) : null,
      imdbVotes: movie.imdbVotes !== 'N/A' ? movie.imdbVotes : null,
      userId
    }));
  
    await prisma.movie.createMany({ data: formatted });
  };

  const seedReviews = async () => {
    const users = await prisma.user.findMany({ select: { id: true } });
    const movies = await prisma.movie.findMany({ select: { id: true } });

    const reviews = Array.from({ length: 40 }, () => ({
      subject: faker.company.buzzPhrase(),
      description: faker.lorem.paragraph(),
      movieId: faker.helpers.arrayElement(movies).id,
      userId: faker.helpers.arrayElement(users).id,
    }));

    await prisma.review.createMany({ data: reviews });
  };

  const seedComment = async () => {
    const users = await prisma.user.findMany({ select: { id: true } });
    const reviews = await prisma.review.findMany({ select: { id: true } });

    const comments = Array.from({ length: 20 }, () => ({
      subject: faker.company.buzzPhrase(),
      description: faker.lorem.paragraph(),
      reviewId: faker.helpers.arrayElement(reviews).id,
      userId: faker.helpers.arrayElement(users).id,
    }));
    await prisma.comment.createMany({ data: comments });
  };

  await seedUsers();
  const users = await prisma.user.findMany();
  const adminUser = users.find(u => u.isAdmin) || users[0];

  const apiKey = await getAPIKey();
  const movies = await fetchTopMovies(apiKey);
  await seedMovies(movies, adminUser.id);
  await seedReviews();
  await seedComment();
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });