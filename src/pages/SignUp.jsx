import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

const ADD_USER = gql`
  mutation AddUser(
    $username: String!
    $email: String!
    $password: String!
    $town: String
    $country: String
  ) {
    addUser(
      username: $username
      email: $email
      password: $password
      town: $town
      country: $country
    ) {
      id
      username
      role
    }
  }
`;

function SignUp() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    town: "",
    country: "",
  });
  const [error, setError] = useState("");
  const [addUser] = useMutation(ADD_USER);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { data } = await addUser({ variables: form });
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: data.addUser.id,
        username: data.addUser.username,
        role: data.addUser.role,
      })
    );
    window.location.href = "/main";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">
          Registruotis
        </h2>
        {error && (
          <div className="text-red-600 mb-4 text-center font-semibold">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Vartotojo vardas
          </label>
          <input
            name="username"
            placeholder="Pvz. Jonas"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-blue-400"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">El. paštas</label>
          <input
            name="email"
            type="email"
            placeholder="el.pastas@email.com"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-blue-400"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Slaptažodis
          </label>
          <input
            name="password"
            type="password"
            placeholder="Slaptažodis"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-blue-400"
            required
          />
        </div>
        <div className="mb-4 flex gap-2"></div>
        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded transition"
        >
          Registruotis
        </button>
      </form>
    </div>
  );
}

export default SignUp;
