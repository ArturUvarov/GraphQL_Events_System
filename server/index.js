import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { gql } from "graphql-tag";
import bcrypt from "bcrypt";

const typeDefs = gql`
  type User {
    id: ID!
    username: String
    email: String
    town: String
    country: String
    role: String
    blocked: Boolean
  }

  type Review {
    id: ID!
    eventId: ID!
    stars: Int!
    comment: String
  }

  type Event {
    id: ID!
    title: String!
    city: String!
    date: String
    time: String
    description: String
    reviews: [Review]
    approved: Boolean
    category: String
    blocked: Boolean
    photoUrl: String
    authorId: String
  }

  type Query {
    users: [User]
    user(id: ID!): User
    events(
      city: String
      category: String
      from: String
      to: String
      fromTime: String
      showBlocked: Boolean
    ): [Event]
    event(id: ID!): Event
  }

  type Mutation {
    addUser(
      username: String!
      email: String!
      town: String
      country: String
      password: String!
    ): User
    updateUser(
      id: ID!
      username: String
      email: String
      town: String
      country: String
    ): User
    deleteUser(id: ID!): Boolean

    addReview(eventId: ID!, stars: Int!, comment: String): Review

    addEvent(
      title: String!
      city: String!
      date: String
      time: String
      description: String
      category: String
      photoUrl: String
      authorId: String
    ): Event
    deleteEvent(id: ID!): Boolean

    signIn(email: String!, password: String!): User

    approveEvent(id: ID!): Event
    blockEvent(id: ID!): Event
    unblockEvent(id: ID!): Event
    blockUser(id: ID!): User
    unblockUser(id: ID!): User
    setEventCategory(id: ID!, category: String!): Event
    updateEvent(
      id: ID!
      title: String
      city: String
      date: String
      time: String
      description: String
      category: String
      photoUrl: String
    ): Event
  }
`; //

let users = [
  {
    id: "1",
    username: "Admin",
    email: "admin@example.com",
    password: "$2b$10$VjY/7DY/W3YPq4Nq0GA5m.EhlBPIvqXjP84TN1zZ5lDLeGcG48HXu",
    town: "Vilnius",
    country: "LT",
    role: "admin",
  },
  {
    id: "2",
    username: "Jonas",
    email: "jonas@mail.com",
    password: "$2b$10$w3p8k6w8Qw6n1k6w8Qw6nO6w8Qw6n1k6w8Qw6n1k6w8Qw6n1k6w8Qw", // test1234
    town: "Kaunas",
    country: "LT",
    role: "user",
  },
  {
    id: "3",
    username: "Aiste",
    email: "aiste@mail.com",
    password: "$2b$10$w3p8k6w8Qw6n1k6w8Qw6nO6w8Qw6n1k6w8Qw6n1k6w8Qw6n1k6w8Qw", // test1234
    town: "Vilnius",
    country: "LT",
    role: "user",
  },
  {
    id: "4",
    username: "Tomas",
    email: "tomas@mail.com",
    password: "$2b$10$w3p8k6w8Qw6n1k6w8Qw6nO6w8Qw6n1k6w8Qw6n1k6w8Qw6n1k6w8Qw", // test1234
    town: "Klaipėda",
    country: "LT",
    role: "user",
  },
];

let events = [
  {
    id: "1",
    title: "Koncertas",
    city: "Vilnius",
    date: "2025-07-20",
    time: "19:00",
    description: "Puikus koncertas",
    approved: false,
    category: "Muzika",
    blocked: false,
    authorId: "1",
    photoUrl:
      "https://klaipedaassutavim.lt/storage_old/posts/e80404ded68e1908c91e953174a67f75.JPG",
  },
  {
    id: "2",
    title: "Sporto renginys",
    city: "Kaunas",
    date: "2025-07-22",
    time: "10:00",
    description: "Krepšinio turnyras",
    category: "Sportas",
    authorId: "2",
    photoUrl:
      "https://sportorenginiai.lt/lt/wp-content/uploads/2013/11/10km-155-950x420.jpg",
  },
  {
    id: "3",
    title: "Futbolo varžybos",
    city: "Klaipėda",
    date: "2025-08-01",
    time: "16:00",
    description: "Lietuvos čempionatas",
    category: "Sportas",
    authorId: "1",
    photoUrl:
      "https://www.rekorduakademija.lt/wp-content/uploads/2023/04/Futbolas-WEB-1024x683.jpeg",
  },
  {
    id: "4",
    title: "Technologijų mugė",
    city: "Šiauliai",
    date: "2025-09-10",
    time: "09:00",
    description: "Naujausios inovacijos",
    category: "Technologijos",
    authorId: "2",
    photoUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvdjPZkkuEpinh6JIBZzyyu4lvCV8PQTiQeQ&s",
  },
  {
    id: "5",
    title: "Maisto festivalis",
    city: "Panevėžys",
    date: "2025-07-30",
    time: "12:00",
    description: "Skoniai iš viso pasaulio",
    category: "Maistas",
    authorId: "1",
    photoUrl:
      "https://www.visitbirstonas.lt/data/events/large/2025-09-13_Gero_maisto_festivalis.jpg",
  },
  {
    id: "6",
    title: "Teatro spektaklis",
    city: "Vilnius",
    date: "2025-08-15",
    time: "18:00",
    description: "Klasikinis teatras",
    category: "Teatras",
    authorId: "2",
    photoUrl:
      "https://priekulekc.lt/wp-content/uploads/2025/03/Screenshot-2025-03-10-at-12.17.31-e1745994551308.png",
  },
  {
    id: "7",
    title: "Mokslo konferencija",
    city: "Vilnius",
    date: "2025-09-25",
    time: "09:00",
    description: "Tarptautinė mokslo konferencija",
    category: "Mokslas",
    authorId: "1",
    photoUrl:
      "https://naujienos.vu.lt/wp-content/uploads/2024/10/MF-konferencija-642x410.jpg",
  },
];

let reviews = [];

let nextId = Math.max(...users.map((u) => Number(u.id))) + 1;
let reviewNextId = 1;

// resolvers
const resolvers = {
  Query: {
    users: () => users,
    user: (parent, { id }) => users.find((user) => user.id === id),
    events: (parent, { city, category, from, to, fromTime, showBlocked }) => {
      let filtered = events;
      if (city) filtered = filtered.filter((e) => e.city === city);
      if (category) filtered = filtered.filter((e) => e.category === category);
      if (from) filtered = filtered.filter((e) => !e.date || e.date >= from);
      if (to) filtered = filtered.filter((e) => !e.date || e.date <= to);
      if (fromTime)
        filtered = filtered.filter((e) => !e.time || e.time >= fromTime);
      if (!showBlocked) filtered = filtered.filter((e) => !e.blocked);
      return filtered.map((event) => ({
        ...event,
        reviews: reviews.filter((r) => r.eventId === event.id),
      }));
    },
    event: (parent, { id }) => events.find((e) => e.id === id),
  },
  Mutation: {
    addUser: async (parent, { username, email, town, country, password }) => {
      // valid
      if (!username || username.length < 3) {
        throw new Error("Vartotojo vardas turi būti bent 3 simboliai.");
      }
      if (!email || !email.includes("@")) {
        throw new Error("Neteisingas el. pašto adresas.");
      }
      if (!password || password.length < 6) {
        throw new Error("Slaptažodis turi būti bent 6 simboliai.");
      }
      // check email
      if (users.some((u) => u.email === email)) {
        throw new Error("Toks el. pašto adresas jau užregistruotas.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: String(nextId++),
        username,
        email,
        password: hashedPassword,
        town,
        country,
        role: "user",
      };
      users.push(newUser);
      return newUser;
    },
    updateUser: (parent, { id, username, email, town, country }) => {
      if (username && username.length < 3) {
        throw new Error("Vartotojo vardas turi būti bent 3 simboliai.");
      }
      if (email && !email.includes("@")) {
        throw new Error("Neteisingas el. pašto adresas.");
      }
      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex === -1) return null;
      const updatedUser = { ...users[userIndex] };
      if (username !== undefined) updatedUser.username = username;
      if (email !== undefined) updatedUser.email = email;
      if (town !== undefined) updatedUser.town = town;
      if (country !== undefined) updatedUser.country = country;
      users[userIndex] = updatedUser;
      return updatedUser;
    },
    deleteUser: (parent, { id }, context) => {
      // only admin
      const initialLength = users.length;
      users = users.filter((user) => user.id !== id && user.role !== "admin");
      return users.length < initialLength;
    },
    addReview: (parent, { eventId, stars, comment }) => {
      const review = {
        id: String(reviewNextId++),
        eventId,
        stars,
        comment,
      };
      reviews.push(review);
      return review;
    },
    addEvent: (
      parent,
      { title, city, date, time, description, category, photoUrl, authorId }
    ) => {
      const newEvent = {
        id: String(events.length + 1),
        title,
        city,
        date,
        time,
        description,
        approved: false,
        blocked: false,
        category: category || "",
        photoUrl: photoUrl || "",
        authorId: authorId || "",
      };
      events.push(newEvent);
      return newEvent;
    },
    deleteEvent: (parent, { id }, context) => {
      // checking if admin
      const initialLength = events.length;
      events = events.filter((event) => event.id !== id);
      return events.length < initialLength;
    },
    signIn: async (parent, { email, password }) => {
      const user = users.find((u) => u.email === email);
      if (!user) throw new Error("User not found");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid password");
      return user;
    },
    approveEvent: (parent, { id }) => {
      const event = events.find((e) => e.id === id);
      if (event) event.approved = true;
      return event;
    },
    blockEvent: (parent, { id }) => {
      const event = events.find((e) => e.id === id);
      if (event) event.blocked = true;
      return event;
    },
    unblockEvent: (parent, { id }) => {
      const event = events.find((e) => e.id === id);
      if (event) event.blocked = false;
      return event;
    },
    blockUser: (parent, { id }) => {
      const user = users.find((u) => u.id === id);
      if (user) user.blocked = true;
      return user;
    },
    unblockUser: (parent, { id }) => {
      const user = users.find((u) => u.id === id);
      if (user) user.blocked = false;
      return user;
    },
    setEventCategory: (parent, { id, category }) => {
      const event = events.find((e) => e.id === id);
      if (event) event.category = category;
      return event;
    },
    updateEvent: (
      parent,
      { id, title, city, date, time, description, category, photoUrl }
    ) => {
      const event = events.find((e) => e.id === id);
      if (!event) return null;
      if (title !== undefined) event.title = title;
      if (city !== undefined) event.city = city;
      if (date !== undefined) event.date = date;
      if (time !== undefined) event.time = time;
      if (description !== undefined) event.description = description;
      if (category !== undefined) event.category = category;
      if (photoUrl !== undefined) event.photoUrl = photoUrl;
      return event;
    },
  },
  Event: {
    reviews: (event) => reviews.filter((r) => r.eventId === event.id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server at:${url}`);
});

const GET_EVENTS = gql`
  query {
    events(city: "") {
      id
      title
      city
      date
      time
      description
      reviews {
        id
        stars
        comment
      }
    }
  }
`;
