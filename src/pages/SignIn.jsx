import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";

const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      id
      username
      role
    }
  }
`;

function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [signIn] = useMutation(SIGN_IN);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await signIn({
      variables: { email: form.email, password: form.password },
    });
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: data.signIn.id,
        username: data.signIn.username,
        role: data.signIn.role,
      })
    );
    if (data.signIn.role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/main";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">
          Prisijungti
        </h2>
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
        <div className="mb-6">
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
        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded transition"
        >
          Prisijungti
        </button>
      </form>
    </div>
  );
}

export default SignIn;
