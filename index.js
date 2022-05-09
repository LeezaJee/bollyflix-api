const express = require("express");
app = express();
morgan = require("morgan");
bodyParser = require("body-parser");
uuid = require("uuid");

app.use(bodyParser.json());
app.use(morgan("common")); //adds morgan middleware library
app.use(express.static("public")); //serves “documentation.html” file from the public folder

let users = [
  {
    Id: 1,
    Name: "Mandy",
    favoriteMovies: [],
  },
  {
    Id: 2,
    Name: "John",
    favoriteMovies: ["PINK"],
  },
];

let movies = [
  {
    Id: 1,
    Title: "Bahubali: The Beginning",
    Year: "2015",
    Runtime: "159",
    Genres: ["Action", "Romance", "Historical Fiction"],
    Director: {
      Name: "S.S. Rajamouli",
      Born: "1973 in Amareshwara Camp, India",
      Bio: "Koduri Srisaila Sri Rajamouli also known as S.S. Rajamouli is considered amongst one the most prosperous film directors of Tollywood (movies in Telugu language). His father Vijayendra Prasad is a well-known Tollywood script writer and both his father and his brother are in the Tollywood industry. Thus, he worked as an assistant along with Editor Kotagiri Venkateswara Rao for a specific time period. S.S. Rajamouli is now best known for his works in high fantasy, and period films",
    },
    Actors:
      "Prabhas, Rana Daggubati, Tamannaah, Anushka Shetty, Ramya Krishna, Sathyaraj, Nassar",
    Plot: "A fearless man, who grows up in a sheltered tribal village, is driven by extraordinary forces in search of an elusive goal, that leads him on an adventure into completely unfamiliar territory. On this journey, he not only finds love, but uncovers a truth that steers him towards his true destiny.",
    ImageUrl: "https://m.media-amazon.com/images/I/81YRmoEwYtL._SL1464_.jpg",
  },
  {
    Id: 2,
    Title: "Badla",
    Year: "2019",
    Runtime: "125",
    Genres: ["Mystery", "Thriller"],
    Director: {
      Name: "Sujoy Ghosh",
      Born: "1966 in Kolkata, India",
      Bio: "Sujoy Ghosh is an Indian film writer, director, actor and producer who is well known for his critically acclaimed movies like Jhankar Beats, Kahaani, Ahalya and Badla. The film maker started the trend of multiplex movies in Bollywood with his directorial debut Jhankaar Beats in 2003 which went on to become a superhit. Ghosh's mystery thriller film Kahaani which released in the year 2012 was his path-breaking female lead movie for which he bagged many awards including a National Film Award for Best Screenplay and a Filmfare Award for Best Director. In 2016, his film Kahaani 2 was released which is a sequel to Kahaani. With his 15 minuter short film - Ahalya (2015), he started the trend of mainstream directors making digital short films.",
    },
    Actors:
      "Amitabh Bachchan, Taapsee Pannu, Amrita Singh, Tony Luke, Manav Kaul",
    Plot: "A young, married businesswoman finds herself locked in a hotel room next to the body of her lover. Accused of murder, she hires a renowned lawyer to help her sort out what actually happened. The more they progress in their search for answers, and seem to get closer to the truth, the more convoluted it seems.",
    ImageUrl:
      "https://media.services.cinergy.ch/media/box1600/50f53a9569e56eb063120b1a9863b13dd81f7c8f.jpg",
  },
  {
    Id: 3,
    Title: "Mimi",
    Year: "2021",
    Runtime: "133",
    Genres: ["Drama", "Comedy"],
    Director: {
      Name: "Laxman Utekar",
      Born: "in Maharashtra, India",
      Bio: "Laxman Utekar is an Indian filmmaker, cinematographer and director known for his work in Hindi and Marathi films. Utekar started his career as a director of photography in Hindi cinema with films such as English Vinglish and Dear Zindagi. He made his directorial debut in 2013 with Tapaal and went on to direct the romantic comedy Luka Chuppi (2019) and the drama Mimi (2021).",
    },
    Actors:
      "Kriti Sanon, Evelyn Edwards, Pankaj Tripathi, Sai Tamhankar, Manoj Pahwa, Supriya Pathak, Aidan Whytock",
    Plot: "An aspiring actress lives in a small town. There, a couple is looking for a surrogate mother. The young woman wants to help the couple and offers to become their surrogate mother. However, complications arise.",
    ImageUrl:
      "https://m.media-amazon.com/images/M/MV5BZTkwMDQ4ZmEtNTdhNi00MmMzLTgwNTQtMDI1NDJjZjQ5Zjg5XkEyXkFqcGdeQXVyNDAzNDk0MTQ@._V1_.jpg",
  },
  {
    Id: 4,
    Title: "PINK",
    Year: "2016",
    Runtime: "136",
    Genres: ["Crime", "Thriller"],
    Director: {
      Name: "Aniruddha Roy Chowdhury",
      Born: "1964 in India",
      Bio: "Aniruddha is a director and producer of multiple Bengali and Hindi films. He has started his film career in 2006 with the Bengali film Anuranan and has won three national awards, Aravindan Puraskaram, one International Indian Film Academy Awards, two Zee Cine Awards and two ETC Bollywood Business Award to only name a few. Alongside feature films, he has directed and produced over four hundred ad films and also made a cameo appearance in the 2015 Hindi film Piku. Aniruddha Roy Chowdhury makes movies on important societal themes, enthralling fans and encouraging them to think about issues.",
    },
    Actors:
      "Taapsee Pannu, Kirti Kulhari, Andrea Tariang, Amitabh Bachchan, Vijay Varma, Angad Bedi, Tushar Pandey, Dhritiman Chatterjee, Piyush Mishra, Mamata Shankar",
    Plot: "Deepak, a retired lawyer with severe mood swings, approaches a woman and offers her his help. Shortly before, she and two friends had become involved in a criminal case in which three rich men seem to play a role. The police advise the women not to press charges because the men are too well connected. Deepak seems to be the only chance for the women to clear their names.",
    ImageUrl:
      "https://assets.cdn.moviepilot.de/files/16453f36b7ded6e06728e07c65bd4eaf8a56033cc72c71c58f866b8984be/limit/852/1194/c664f380baf9896429de7f945bdc4d0f59cdf27a.jpg",
  },
  {
    Id: 5,
    Title: "Haseen Dilruba",
    Year: "2021",
    Runtime: "136",
    Genres: ["Mystery", "Romance", "Thriller"],
    Director: {
      Name: "Vinil Mathew",
      Born: "1977 in Delhi, India",
      Bio: "Vinil Mathew is an Indian filmmaker and writer, who makes Hindi films and advertisements. After studying filmmaking at the Film and Television Institute of India (FTII), he made advertisement campaigns for several brands, including Vodafone, Nescafe and Cadbury. In feature films, Vinil has directed the 2014 romantic comedy Hasee Toh Phasee, which was a critical and commercial success, and the 2021 romantic thriller Haseen Dillruba, which became the most-watched Hindi film on Netflix of that year.",
    },
    Actors:
      "Taapsee Pannu, Vikrant Massey, Harshvardhan Rane, K M Rasheduzzaman Rafi",
    Plot: "A woman suspected of murdering her husband reveals details during the investigation that cast additional doubt on the truth.",
    ImageUrl:
      "https://newspaperads.ads2publish.com/wp-content/uploads/2021/07/netflix-watch-now-haseen-dillruba-ad-times-of-india-mumbai-03-07-2021-scaled.jpg",
  },
  {
    Id: 6,
    Title: "MOM",
    Year: "2017",
    Runtime: "146",
    Genres: ["Thriller", "Crime", "Drama"],
    Director: {
      Name: "Ravi Udyawar",
      Born: "in Maharashtra, India",
      Bio: "A gold medallist from the JJ School of Arts, Mumbai, Ravi Udywar is an ad filmmaker, artist, and illustrator, whose career took a turn after he directed the music video of Silk Route’s single Dooba Dooba. At the age of 25, Ravi directed India’s first music video to have been directed underwater. He started his career as a painter and illustrator, working at ad agencies and designing graphics for television channels such as Channel V and MTV, soon after which he ventured into ad filmmaking. Wanting to make his feature film debut for a long time, Ravi debuted with the Sridevi and Nawazuddin Siddiqui-starrer Mom in 2017, which emerged as a blockbuster at the global box office.",
    },
    Actors:
      "Sridevi, Sajal Ali, Adnan Siddiqui, Nawazuddin Siddiqui, Akshaye Khanna",
    Plot: "After her stepdaughter was raped at a party, mother Devki is determined to destroy the lives of the four tormentors who got away with it.",
    ImageUrl:
      "https://media-cache.cinematerial.com/p/500x/0kzdgql5/mom-indian-movie-poster.jpg?v=1555579912",
  },
  {
    Id: 7,
    Title: "Raat Akeli Hai",
    Year: "2020",
    Runtime: "149",
    Genres: ["Thriller", "Crime", "Drama"],
    Director: {
      Name: "Honey Trehan",
      Born: "1978 in Sagar, India",
      Bio: "Honey Trehan is a producer, director and casting director and best known for Omkara (2006), Kaminey (2009), Talvar (2015), and Udta Punjab (2016). His directorial debut was in 2020 with the movie Raat Akeli Hai, starring Nawazuddin Siddiqui and Radhika Apte.",
    },
    Actors:
      "Nawazuddin Siddiqui, Radhika Apte, Shweta Tripathi, Aditya Srivastava, Tigmanshu Dhulia, Shivani Raghuvanshi",
    Plot: "A newly married landlord is murdered. The investigation however is hindered by the secrecy of the victims family and the feelings of the nerdy investigator.",
    ImageUrl:
      "https://de.web.img3.acsta.net/pictures/20/11/11/09/48/1552439.jpg",
  },
  {
    Id: 8,
    Title: "Good Newwz",
    Year: "2019",
    Runtime: "140",
    Genres: ["Comedy", "Drama"],
    Director: {
      Name: "Raj Mehta",
      Born: "Mumbai, India",
      Bio: "Raj Mehta is an Indian director whose first prominent foray into the film industry was his work on the short film Ironic Odyssey (2009) which he produced, wrote and directed. The first feature film he worked on was Aarakshan (2011), for which he assisted in the directorial department. He has also assisted on Kapoor & Sons (2016) and Humpty Sharma Ki Dulhaniya (2014). His 2019 releases include his directorial debut film Good Newwz.",
    },
    Actors: "Akshay Kumar, Kareena Kapoor Khan, Diljit Dosanjh, Kiara Advani",
    Plot: "Two couples with the same surnames pursue in-vitro fertilization and wait for their upcoming babies. Trouble ensues when they find that the sperms of each couple have been mixed with each other.",
    ImageUrl:
      "https://img.goldposter.com/2019/12/good-newwz_poster_goldposter_com_9.jpg",
  },
  {
    Id: 9,
    Title: "Houseful",
    Year: "2010",
    Runtime: "144",
    Genres: ["Comedy", "Romance"],
    Director: {
      Name: "Sajid Khan",
      Born: "1971 in Mumbai, India",
      Bio: "Sajid Khan is a director, television presenter, comedian and actor. He is the brother of choreographer Farah Khan and is best known for the Housefull film series, Heyy Babyy (2007), Himmatwala (2013) and Humshakals (2014). Khan also served as a judge on the Indian reality television show Nach Baliye.",
    },
    Actors:
      "Akshay Kumar, Ritesh Deshmukh, Arjun Rampal, Deepika Padukone, Lara Dutta, Jiah Khan, Boman Irani, Randhir Kapoor, Chunky Pandey, Malaika Arora",
    Plot: "Believing himself to be jinxed, a man attempts to find true love, but instead gets caught in a web of lies.",
    ImageUrl:
      "https://m.media-amazon.com/images/M/MV5BMDlkMmRkM2QtYmZiMi00NWYzLThmMjEtN2IwMTNhMDFkODA0XkEyXkFqcGdeQXVyNjQ2MjQ5NzM@._V1_.jpg",
  },
  {
    Id: 10,
    Title: "VEER-ZAARA",
    Year: "2004",
    Runtime: "192",
    Genres: ["Drama", "Romance"],
    Director: {
      Name: "Yash Chopra",
      Born: "1932 in Lahore, Pakistan",
      Died: "2012 in Mumbai, India",
      Bio: "Labeled the eternal romantic and with one of the best musical senses in the business, Yash Chopra was arguably India's most successful director of romantic films. Although he made action-oriented films like the ever-popular Deewaar (1975), it is in tackling love and its various aspects that he had been at his best. One of the few commercial Indian directors who started their careers in the 1950s, he had successfully moved with the times from the socially significant Dhool Ka Phool (1959) to the young and cool Dil to Pagal Hai (1997). With 21 directing credits, 3 screenplays and 31 producing credits listed on IMDB during 40 years in the Indian film business, Chopra was one of the living legends of Indian cinema, one who received untold awards and exerted great influence.",
    },
    Actors:
      "Shah Rukh Khan, Preity Zinta, Rani Mukerji, Amitabh Bachchan, Manoj Bajpai, Kirron Kher, Anupam Kher, Divya Dutta, Hema Malini, Boman Irani",
    Plot: "The Indian pilot Veer Pratap Singh saves the life of the young Pakistani woman Zaara. They spend one day together, which brings them closer and allows them to experience their common roots. 22 years later, the young lawyer Saamiya Siddiqui is supposed to uncover the mystery surrounding Veer, who has been living neglected in a Pakistani prison for a good two decades.",
    ImageUrl:
      "https://img.goldposter.com/2020/03/veer-zaara_poster_goldposter_com_1.jpg",
  },
];

//---------------------MOVIE CODE--------------------

//READ - returns a plain welcome page
app.get("/", (req, res) => {
  res.send(
    "Welcome to BollyFlix! Your go-to address for good Bollywood movies!"
  );
});

//READ - returns the documentation.html file
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

//READ - return a list of ALL movies to the user
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

//READ - returns data about a single movie by title
app.get("/movies/:title", (req, res) => {
  const { title } = req.params; // syntax object destructuring === const title = req.params.title;
  const movie = movies.find((movie) => movie.Title === title); //find method to return movie object

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("There is no such movie.");
  }
});

//READ - returns movies by genre name
app.get("/movies/genres/:genreName", (req, res) => {
  const { genreName } = req.params; // syntax object destructuring === const title = req.params.title;
  const genreMovies = movies.filter((movie) =>
    movie.Genres.includes(genreName)
  );

  if (genreMovies) {
    res.status(200).json(genreMovies);
  } else {
    res.status(400).send("There is no such genre.");
  }
});

//READ - returns data about a director by name
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params; // syntax object destructuring === const title = req.params.title;
  const director = movies.find(
    //find method to return director object
    (movie) => movie.Director.Name === directorName
  ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("There is no such director.");
  }
});

//READ - returns movies by actor's name
app.get("/movies/actors/:actorName", (req, res) => {
  const { actorName } = req.params;
  const movieName = movies.filter((movie) => movie.Actors.includes(actorName));

  if (movieName) {
    res.status(200).send(movieName);
  } else {
    res.status(400).send("There is no such actor.");
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(2000, () => {
  console.log("Your app is listening on port 2000");
});
