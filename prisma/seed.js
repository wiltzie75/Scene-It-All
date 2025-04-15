const prisma = require('./index');

const seed = async () => {

  const createUser = async () => {
    const users = [
      {
        firstName: "Emma",
        lastName: "Stone",
        email: "estone@mail.com",
        password: "password",
        isAdmin: true
      },
      {
        firstName: "Timothee",
        lastName: "Chalamet",
        email: "timtim@gmail.com",
        password: "password",
        isAdmin: false
      },
      {
        firstName: "Nicholas",
        lastName: "Cage",
        email: "ncage@yahoo.com",
        password: "password",
        isAdmin: true
      }
    ];
    await prisma.user.createMany({ data: users });
  };

  const createMovie = async () => {
    const movies = [
      {
        title: "Jaws",
        imdbId: "3",
        plot: "When a massive killer shark unleashes chaos on a beach community off Long Island, it's up to a local sheriff, a marine biologist, and an old seafarer to hunt the beast down.",
        poster: "https://m.media-amazon.com/images/I/616z7DnWGmL.jpg",
        year: "1975",
        genre: "Thriller",
        userId: 2
      },
      {
        title: "Interstellar",
        imdbId: "4",
        plot: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
        poster: "http://www.impawards.com/2014/posters/interstellar.jpg",
        year: "2014",
        genre: "Drama",
        userId: 1
      },
      {
        title: "The Goonies",
        imdbId: "1",
        plot: "A group of young misfits called The Goonies discover an ancient map and set out on an adventure to find a legendary pirate's long-lost treasure.",
        poster: "https://filmartgallery.com/cdn/shop/files/The-Goonies-Vintage-Movie-Poster-Original_b5fcc321.jpg?height=1024&v=1741576154&width=1024",
        year: "1985",
        genre: "Comedy",
        userId: 3
      },
      {
        title: "The Trial",
        imdbId: "6",
        plot: "An unassuming office worker is arrested and stands trial, but he is never made aware of his charges.",
        poster: "https://cdn.posteritati.com/posters/000/000/026/214/the-trial-md-web.jpg",
        year: "1962",
        genre: "Drama",
        userId: 1
      },
      {
        title: "Vertigo",
        imdbId: "5",
        plot: "A former San Francisco police detective juggles wrestling with his personal demons and becoming obsessed with the hauntingly beautiful woman he has been hired to trail, who may be deeply disturbed.",
        poster: "https://render.fineartamerica.com/images/rendered/medium/poster/5/8/break/images/artworkimages/medium/3/vertigo-1958-mystery-thriller-romance-retro-movie-poster-upscaled.jpg",
        year: "1958",
        genre: "Thriller",
        userId: 2
      }
    ];
    await prisma.movie.createMany({ data: movies });
  };

  const createReview = async () => {
    const reviews = [
      {
        subject: "Boring",
        description: "Suspendisse commodo lorem mi, id maximus elit tincidunt ut...",
        movieId: 3,
        userId: 1
      },
      {
        subject: "This blew me away!",
        description: "Suspendisse commodo lorem mi, id maximus elit tincidunt ut...",
        movieId: 2,
        userId: 2
      },
      {
        subject: "Wow...unbelievable",
        description: "Suspendisse commodo lorem mi, id maximus elit tincidunt ut...",
        movieId: 1,
        userId: 3
      },
      {
        subject: "What an ending!",
        description: "Suspendisse commodo lorem mi, id maximus elit tincidunt ut...",
        movieId: 4,
        userId: 1
      },
      {
        subject: "Intense!",
        description: "Suspendisse commodo lorem mi, id maximus elit tincidunt ut...",
        movieId: 5,
        userId: 3
      }
    ];
    await prisma.review.createMany({ data: reviews });
  };

  const createComment = async () => {
    const comments = [
      {
        subject: "I disagree with this review",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        reviewId: 3,
        userId: 2
      },
      {
        subject: "Something else to add to the above..",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        reviewId: 2,
        userId: 3
      },
      {
        subject: "You totally forgot!",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        reviewId: 3,
        userId: 1
      }
    ];
    await prisma.comment.createMany({ data: comments });
  };

  await createUser();
  await createMovie();
  await createReview();
  await createComment();
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