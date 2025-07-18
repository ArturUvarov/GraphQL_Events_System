import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const ADD_EVENT = gql`
  mutation AddEvent(
    $title: String!
    $city: String!
    $date: String
    $description: String
    $category: String
    $photoUrl: String
    $authorId: String
  ) {
    addEvent(
      title: $title
      city: $city
      date: $date
      description: $description
      category: $category
      photoUrl: $photoUrl
      authorId: $authorId
    ) {
      id
      title
      authorId
    }
  }
`;

function AddEvent() {
  const [form, setForm] = useState({
    title: "",
    city: "",
    date: "",
    time: "",
    description: "",
    category: "",
    photoUrl: "",
  });
  const [addEvent] = useMutation(ADD_EVENT);

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <div>Prisijunkite, kad matytumėte šį puslapį.</div>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addEvent({
      variables: {
        ...form,
        authorId: user.id,
      },
    });
    window.location.href = "/main";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Pridėti renginį</h2>
      <input
        name="title"
        placeholder="Pavadinimas"
        value={form.title}
        onChange={handleChange}
        className="block w-full mb-2 border px-2 py-1 rounded"
        required
      />
      <input
        name="city"
        placeholder="Miestas"
        value={form.city}
        onChange={handleChange}
        className="block w-full mb-2 border px-2 py-1 rounded"
        required
      />
      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        className="block w-full mb-2 border px-2 py-1 rounded"
      />
      <input
        name="time"
        type="time"
        value={form.time}
        onChange={handleChange}
        className="block w-full mb-2 border px-2 py-1 rounded"
      />
      <textarea
        name="description"
        placeholder="Aprašymas"
        value={form.description}
        onChange={handleChange}
        className="block w-full mb-2 border px-2 py-1 rounded"
      />
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="block w-full mb-2 border px-2 py-1 rounded"
      >
        <option value="">Visos kategorijos</option>
        <option value="Muzika">Muzika</option>
        <option value="Sportas">Sportas</option>
        <option value="Seminaras">Seminaras</option>
        <option value="Kita">Kita</option>
        <option value="Technologijos">Technologijos</option>
        <option value="Maistas">Maistas</option>
        <option value="Teatras">Teatras</option>
      </select>
      <input
        name="photoUrl"
        placeholder="Nuotraukos URL"
        value={form.photoUrl}
        onChange={handleChange}
        className="block w-full mb-2 border px-2 py-1 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Pridėti
      </button>
    </form>
  );
}

export default AddEvent;
