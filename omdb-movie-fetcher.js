// omdb-top-movies-fetcher.js
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const dotenv = require('dotenv');
const readline = require('readline');

dotenv.config();

const prisma = new PrismaClient();

// List of IMDb IDs for top 50 rated movies according to IMDb ratings
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
  'tt0120689', // The Green Mile
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
}

async function getAdminUserId() {
  // First try to find an admin user
  let user = await prisma.user.findFirst({
    where: { isAdmin: true }
  });

  // If no admin user exists, find any user
  if (!user) {
    user = await prisma.user.findFirst();
  }

  // If no user exists at all, create a default admin user
  if (!user) {
    user = await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'SecurePassword123', // In a real app, this would be hashed
        isAdmin: true
      }
    });
    console.log('Created default admin user as no users were found');
  }

  return user.id;
}

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
}

async function saveMoviesToDatabase(movies, userId) {
  console.log('Saving movies to database...');
  let savedCount = 0;

  for (const movie of movies) {
    try {
      // Skip movies with missing required data
      if (!movie.Title || !movie.imdbID) {
        console.warn(`Skipping movie with incomplete data: ${movie.imdbID}`);
        continue;
      }

      // Check if movie already exists by imdbId
      const existingMovie = await prisma.movie.findUnique({
        where: { imdbId: movie.imdbID }
      });

      if (existingMovie) {
        console.log(`Movie "${movie.Title}" already exists in database, skipping`);
        continue;
      }

      // Parse imdbRating to float or use null
      const imdbRating = movie.imdbRating && movie.imdbRating !== 'N/A' ? parseFloat(movie.imdbRating) : null;

      // Create new movie record
      await prisma.movie.create({
        data: {
          imdbId: movie.imdbID,
          title: movie.Title,
          plot: movie.Plot || null,
          poster: movie.Poster !== 'N/A' ? movie.Poster : null,
          year: movie.Year || null,
          genre: movie.Genre || null,
          imdbRating: imdbRating,
          imdbVotes: movie.imdbVotes !== 'N/A' ? movie.imdbVotes : null,
          userId: userId
        }
      });

      savedCount++;
      console.log(`Saved movie ${savedCount}: ${movie.Title}`);
    } catch (error) {
      console.error(`Error saving movie "${movie.Title}":`, error.message);
    }
  }

  console.log(`Successfully saved ${savedCount} movies to database`);
}

async function main() {
  try {
    const apiKey = await getAPIKey();
    if (!apiKey) {
      console.error('No API key provided. Please get an API key from https://www.omdbapi.com/');
      return;
    }

    const userId = await getAdminUserId();
    console.log(`Using user ID ${userId} for movie ownership`);

    const movies = await fetchTopMovies(apiKey);
    await saveMoviesToDatabase(movies, userId);

    console.log('Finished importing top 50 movies successfully!');
  } catch (error) {
    console.error('Error in main process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();