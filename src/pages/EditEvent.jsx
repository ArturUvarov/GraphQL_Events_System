import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";

const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      title
      city
      date
      description
      category
      photoUrl
    }
  }
`;

const UPDATE_EVENT = gql`
  mutation UpdateEvent(
    $id: ID!
    $title: String
    $city: String
    $date: String
    $description: String
    $category: String
    $photoUrl: String
  ) {
    updateEvent(
      id: $id
      title: $title
      city: $city
      date: $date
      description: $description
      category: $category
      photoUrl: $photoUrl
    ) {
      id
      title
    }
  }
`;

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useQuery(GET_EVENT, { variables: { id } });
  const [updateEvent] = useMutation(UPDATE_EVENT);

  const event = data?.event;

  const [form, setForm] = useState({
    title: "",
    city: "",
    date: "",
    time: "",
    description: "",
    category: "",
    photoUrl: "",
  });

  useEffect(() => {
    if (event) setForm(event);
  }, [event]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateEvent({ variables: { id, ...form } });
    navigate("/main");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Redaguoti renginį</h2>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        className="block w-full mb-2 border px-2 py-1 rounded"
        required
      />
      <input
        name="city"
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
        <option value="">Pasirinkite kategoriją</option>
        <option value="Muzika">Muzika</option>
        <option value="Sportas">Sportas</option>
        <option value="Seminaras">Seminaras</option>
        <option value="Technologijos">Technologijos</option>
        <option value="Maistas">Maistas</option>
        <option value="Teatras">Teatras</option>
        <option value="Kita">Kita</option>
      </select>
      <input
        name="photoUrl"
        value={form.photoUrl}
        onChange={handleChange}
        className="block w-full mb-2 border px-2 py-1 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Išsaugoti
      </button>
    </form>
  );
}

export default EditEvent;
