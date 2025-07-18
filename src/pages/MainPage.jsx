import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";

const GET_EVENTS = gql`
  query Events(
    $city: String
    $category: String
    $from: String
    $fromTime: String
  ) {
    events(city: $city, category: $category, from: $from, fromTime: $fromTime) {
      id
      title
      city
      date
      time
      description
      approved
      category
      photoUrl
      authorId
      reviews {
        stars
      }
    }
  }
`;

const ADD_REVIEW = gql`
  mutation AddReview($eventId: ID!, $stars: Int!, $comment: String) {
    addReview(eventId: $eventId, stars: $stars, comment: $comment) {
      id
      stars
      comment
    }
  }
`;

function MainPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <div>Prisijunkite, kad matytumėte šį puslapį.</div>;

  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [city, setCity] = useState("");
  const [addReview] = useMutation(ADD_REVIEW);
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const { data, refetch } = useQuery(GET_EVENTS, {
    variables: { city, category, from, fromTime },
  });

  const handleFilter = (e) => {
    e.preventDefault();
    refetch({ city, category, from, fromTime });
  };

  const handleReviewSubmit = async (e, eventId) => {
    e.preventDefault();
    await addReview({
      variables: {
        eventId,
        stars: reviewStars,
        comment: reviewComment,
      },
    });
    setReviewStars(5);
    setReviewComment("");
    refetch();
  };

  const visibleEvents = (data?.events || []).filter((event) => !event.blocked);

  return (
    <div className="max-w-6xl mx-auto mt-24 px-4">
      <h1 className="text-3xl font-bold mb-8 text-blue-700 text-center">
        Renginiai
      </h1>

      <form
        onSubmit={handleFilter}
        className="flex flex-wrap gap-4 mb-8 items-end justify-center"
      >
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Visi miestai</option>
          <option value="Vilnius">Vilnius</option>
          <option value="Kaunas">Kaunas</option>
          <option value="Klaipėda">Klaipėda</option>
          <option value="Šiauliai">Šiauliai</option>
          <option value="Panevėžys">Panevėžys</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Visos kategorijos</option>
          <option value="Muzika">Muzika</option>
          <option value="Sportas">Sportas</option>
          <option value="Paroda">Paroda</option>
          <option value="Kita">Kita</option>
          <option value="Technologijos">Technologijos</option>
          <option value="Maistas">Maistas</option>
          <option value="Teatras">Teatras</option>
        </select>
        <div>
          <label className="block text-xs text-gray-500">Nuo datos</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Nuo laiko</label>
          <input
            type="time"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Filtruoti
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {visibleEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition"
          >
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              {event.photoUrl ? (
                <img
                  src={event.photoUrl}
                  alt={event.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="text-gray-400"></div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {event.category || "Be kategorijos"}
                </span>
                <span className="text-xs text-gray-500">{event.city}</span>
              </div>
              <h2 className="text-lg font-bold mb-1">{event.title}</h2>
              <div className="text-sm text-gray-600 mb-2">
                {event.date}{" "}
                {event.time && <span className="ml-2">{event.time}</span>}
              </div>
              <p className="text-gray-700 flex-1 mb-2">{event.description}</p>
              <div className="flex items-center justify-end mb-2">
                <span className="flex items-center gap-1">
                  <span className="text-yellow-400 text-2xl font-bold drop-shadow">
                    {event.reviews && event.reviews.length > 0
                      ? "★".repeat(
                          Math.round(
                            event.reviews.reduce((a, r) => a + r.stars, 0) /
                              event.reviews.length
                          )
                        )
                      : "☆"}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">
                    {event.reviews && event.reviews.length > 0
                      ? `(${event.reviews.length})`
                      : ""}
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between mt-auto">
                {String(event.authorId) === String(user.id) && (
                  <a
                    href={`/editevent/${event.id}`}
                    className="text-blue-600 underline text-sm font-medium"
                  >
                    Redaguoti
                  </a>
                )}
              </div>
              <form
                onSubmit={(e) => handleReviewSubmit(e, event.id)}
                className="flex flex-col gap-2 mt-2"
              >
                <div>
                  <label className="text-xs text-gray-500 mr-2">
                    Įvertinkite:
                  </label>
                  <select
                    value={reviewStars}
                    onChange={(e) => setReviewStars(Number(e.target.value))}
                    className="border rounded px-2 py-1"
                  >
                    {[5, 4, 3, 2, 1].map((s) => (
                      <option key={s} value={s}>
                        {s} ★
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-yellow-500 text-white rounded px-3 py-1 text-sm"
                >
                  Palikti įvertinimą
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
      <a
        href="/addevent"
        className="block mt-10 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow transition"
      >
        Pridėti naują renginį
      </a>
    </div>
  );
}

export default MainPage;
