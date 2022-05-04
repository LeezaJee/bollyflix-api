const express = require("express");
const app = express();

let movies = [
  {
    title: "Bahubali: The Beginning",
    year: "2015",
    runtime: "159",
    genres: ["Action", "Romance", "Historical Fiction"],
    director: {
      name: "S.S. Rajamouli",
    },
    actors:
      "Prabhas, Rana Daggubati, Tamannaah, Anushka Shetty, Ramya Krishna, Sathyaraj, Nassar",
    plot: "A fearless man, who grows up in a sheltered tribal village, is driven by extraordinary forces in search of an elusive goal, that leads him on an adventure into completely unfamiliar territory. On this journey, he not only finds love, but uncovers a truth that steers him towards his true destiny.",
    imageUrl: "https://m.media-amazon.com/images/I/81YRmoEwYtL._SL1464_.jpg",
  },
  {
    title: "Badla",
    year: "2019",
    runtime: "125",
    genres: ["Mystery", "Thriller"],
    director: {
      name: "Sujoy Ghosh",
    },
    actors:
      "Amitabh Bachchan, Taapsee Pannu, Amrita Singh, Tony Luke, Manav Kaul",
    plot: "A young, married businesswoman finds herself locked in a hotel room next to the body of her lover. Accused of murder, she hires a renowned lawyer to help her sort out what actually happened. The more they progress in their search for answers, and seem to get closer to the truth, the more convoluted it seems.",
    imageUrl:
      "https://media.services.cinergy.ch/media/box1600/50f53a9569e56eb063120b1a9863b13dd81f7c8f.jpg",
  },
  {
    title: "Mimi",
    year: "2021",
    runtime: "133",
    genres: ["Drama", "Comedy"],
    director: {
      name: "Laxman Utekar",
    },
    actors:
      "Kriti Sanon, Evelyn Edwards, Pankaj Tripathi, Sai Tamhankar, Manoj Pahwa, Supriya Pathak, Aidan Whytock",
    plot: "An aspiring actress lives in a small town. There, a couple is looking for a surrogate mother. The young woman wants to help the couple and offers to become their surrogate mother. However, complications arise.",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BZTkwMDQ4ZmEtNTdhNi00MmMzLTgwNTQtMDI1NDJjZjQ5Zjg5XkEyXkFqcGdeQXVyNDAzNDk0MTQ@._V1_.jpg",
  },
  {
    title: "PINK",
    year: "2016",
    runtime: "136",
    genres: ["Crime", "Thriller"],
    director: {
      name: "Aniruddha Roy Chowdhury",
    },
    actors:
      "Taapsee Pannu, Kirti Kulhari, Andrea Tariang, Amitabh Bachchan, Vijay Varma, Angad Bedi, Tushar Pandey, Dhritiman Chatterjee, Piyush Mishra, Mamata Shankar",
    plot: "Deepak, a retired lawyer with severe mood swings, approaches a woman and offers her his help. Shortly before, she and two friends had become involved in a criminal case in which three rich men seem to play a role. The police advise the women not to press charges because the men are too well connected. Deepak seems to be the only chance for the women to clear their names.",
    imageUrl:
      "https://assets.cdn.moviepilot.de/files/16453f36b7ded6e06728e07c65bd4eaf8a56033cc72c71c58f866b8984be/limit/852/1194/c664f380baf9896429de7f945bdc4d0f59cdf27a.jpg",
  },
  {
    title: "Haseen Dilruba",
    year: "2021",
    runtime: "136",
    genres: ["Mystery", "Romance", "Thriller"],
    director: {
      name: "Vinil Mathew",
    },
    actors:
      "Taapsee Pannu, Vikrant Massey, Harshvardhan Rane, K M Rasheduzzaman Rafi",
    plot: "A woman suspected of murdering her husband reveals details during the investigation that cast additional doubt on the truth.",
    imageUrl:
      "https://newspaperads.ads2publish.com/wp-content/uploads/2021/07/netflix-watch-now-haseen-dillruba-ad-times-of-india-mumbai-03-07-2021-scaled.jpg",
  },
  {
    title: "MOM",
    year: "2017",
    runtime: "146",
    genres: ["Thriller", "Crime", "Drama"],
    director: {
      name: "Ravi Udyawar",
    },
    actors:
      "Sridevi, Sajal Ali, Adnan Siddiqui, Nawazuddin Siddiqui, Akshaye Khanna",
    plot: "After her stepdaughter was raped at a party, mother Devki is determined to destroy the lives of the four tormentors who got away with it.",
    imageUrl:
      "https://media-cache.cinematerial.com/p/500x/0kzdgql5/mom-indian-movie-poster.jpg?v=1555579912",
  },
  {
    title: "Raat Akeli Hai",
    year: "2020",
    runtime: "149",
    genres: ["Thriller", "Crime", "Drama"],
    director: {
      name: "Honey Trehan",
    },
    actors:
      "Nawazuddin Siddiqui, Radhika Apte, Shweta Tripathi, Aditya Srivastava, Tigmanshu Dhulia, Shivani Raghuvanshi",
    plot: "A newly married landlord is murdered. The investigation however is hindered by the secrecy of the victims family and the feelings of the nerdy investigator.",
    imageUrl:
      "https://de.web.img3.acsta.net/pictures/20/11/11/09/48/1552439.jpg",
  },
  {
    title: "Good Newwz",
    year: "2019",
    runtime: "140",
    genres: ["Comedy", "Drama"],
    director: {
      name: "Raj Mehta",
    },
    actors: "Akshay Kumar, Kareena Kapoor Khan, Diljit Dosanjh, Kiara Advani",
    plot: "Two couples with the same surnames pursue in-vitro fertilization and wait for their upcoming babies. Trouble ensues when they find that the sperms of each couple have been mixed with each other.",
    imageUrl:
      "https://img.goldposter.com/2019/12/good-newwz_poster_goldposter_com_9.jpg",
  },
  {
    title: "Houseful",
    year: "2010",
    runtime: "144",
    genres: ["Comedy", "Romance"],
    director: {
      name: "Sajid Khan",
    },
    actors:
      "Akshay Kumar, Ritesh Deshmukh, Arjun Rampal, Deepika Padukone, Lara Dutta, Jiah Khan, Boman Irani, Randhir Kapoor, Chunky Pandey, Malaika Arora",
    plot: "Believing himself to be jinxed, a man attempts to find true love, but instead gets caught in a web of lies.",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BMDlkMmRkM2QtYmZiMi00NWYzLThmMjEtN2IwMTNhMDFkODA0XkEyXkFqcGdeQXVyNjQ2MjQ5NzM@._V1_.jpg",
  },
  {
    title: "VEER-ZAARA",
    year: "2004",
    runtime: "192",
    genres: ["Drama", "Romance"],
    director: {
      name: "Yash Chopra",
    },
    actors:
      "	Shah Rukh Khan, Preity Zinta, Rani Mukerji, Amitabh Bachchan, Manoj Bajpai, Kirron Kher, Anupam Kher, Divya Dutta, Hema Malini, Boman Irani",
    plot: "The Indian pilot Veer Pratap Singh saves the life of the young Pakistani woman Zaara. They spend one day together, which brings them closer and allows them to experience their common roots. 22 years later, the young lawyer Saamiya Siddiqui is supposed to uncover the mystery surrounding Veer, who has been living neglected in a Pakistani prison for a good two decades.",
    imageUrl:
      "https://img.goldposter.com/2020/03/veer-zaara_poster_goldposter_com_1.jpg",
  },
];
app.get("/", (req, res) => {
  res.send(
    "Welcome to BollyFlix! Your go-to address for good Bollywood movies!"
  );
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});
app.listen(8080, () => {
  console.log("Your app is listening on port 8080");
});
