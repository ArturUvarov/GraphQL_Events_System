import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

const GET_EVENTS = gql`
  query {
    events(showBlocked: true) {
      id
      title
      city
      date
      description
      approved
      blocked
      category
      photoUrl
    }
  }
`;

const GET_USERS = gql`
  query {
    users {
      id
      username
      email
      town
      country
      role
      blocked
    }
  }
`;

const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id)
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

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
      email
      role
    }
  }
`;

const APPROVE_EVENT = gql`
  mutation ApproveEvent($id: ID!) {
    approveEvent(id: $id) {
      id
      approved
    }
  }
`;

const BLOCK_EVENT = gql`
  mutation BlockEvent($id: ID!) {
    blockEvent(id: $id) {
      id
      blocked
    }
  }
`;

const UNBLOCK_EVENT = gql`
  mutation UnblockEvent($id: ID!) {
    unblockEvent(id: $id) {
      id
      blocked
    }
  }
`;

const SET_EVENT_CATEGORY = gql`
  mutation SetEventCategory($id: ID!, $category: String!) {
    setEventCategory(id: $id, category: $category) {
      id
      category
    }
  }
`;

const BLOCK_USER = gql`
  mutation BlockUser($id: ID!) {
    blockUser(id: $id) {
      id
      blocked
    }
  }
`;

const UNBLOCK_USER = gql`
  mutation UnblockUser($id: ID!) {
    unblockUser(id: $id) {
      id
      blocked
    }
  }
`;

const SET_PHOTO_URL = gql`
  mutation UpdateEventPhoto($id: ID!, $photoUrl: String!) {
    updateEvent(id: $id, photoUrl: $photoUrl) {
      id
      photoUrl
    }
  }
`;

function AdminPanel() {
  const { data: eventsData, refetch: refetchEvents } = useQuery(GET_EVENTS);
  const { data: usersData, refetch: refetchUsers } = useQuery(GET_USERS);
  const [deleteEvent] = useMutation(DELETE_EVENT);
  const [deleteUser] = useMutation(DELETE_USER);
  const [addUser] = useMutation(ADD_USER);
  const [approveEvent] = useMutation(APPROVE_EVENT);
  const [blockEvent] = useMutation(BLOCK_EVENT);
  const [unblockEvent] = useMutation(UNBLOCK_EVENT);
  const [setEventCategory] = useMutation(SET_EVENT_CATEGORY);
  const [blockUser] = useMutation(BLOCK_USER);
  const [unblockUser] = useMutation(UNBLOCK_USER);
  const [setPhotoUrl] = useMutation(SET_PHOTO_URL);

  const handleDeleteEvent = async (id) => {
    await deleteEvent({ variables: { id } });
    refetchEvents();
  };

  const handleDeleteUser = async (id) => {
    await deleteUser({ variables: { id } });
    refetchUsers();
  };

  const handleAddRandomUser = async () => {
    const random = Math.floor(Math.random() * 10000);
    await addUser({
      variables: {
        username: `User${random}`,
        email: `user${random}@test.com`,
        password: "test1234",
        town: "TestTown",
        country: "LT",
      },
    });
    refetchUsers();
  };

  if (!eventsData || !usersData) return <div>Įkeliama...</div>;

  const visibleEvents = eventsData?.events || [];

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6 text-red-700">Admin Panel</h1>
      <h2 className="text-xl font-semibold mb-2">Renginiai</h2>
      <table className="min-w-full bg-white shadow rounded mb-8">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Pavadinimas</th>
            <th className="py-2 px-4 border-b">Miestas</th>
            <th className="py-2 px-4 border-b">Data</th>
            <th className="py-2 px-4 border-b">Aprašymas</th>
            <th className="py-2 px-4 border-b">Patvirtintas</th>
            <th className="py-2 px-4 border-b">Blokuotas</th>
            <th className="py-2 px-4 border-b">Kategorija</th>
            <th className="py-2 px-4 border-b">Nuotraukos URL</th>
            <th className="py-2 px-4 border-b">Veiksmai</th>
          </tr>
        </thead>
        <tbody>
          {visibleEvents?.map((event) => (
            <tr key={event.id}>
              <td className="py-2 px-4 border-b">{event.title}</td>
              <td className="py-2 px-4 border-b">{event.city}</td>
              <td className="py-2 px-4 border-b">{event.date}</td>
              <td className="py-2 px-4 border-b">{event.description}</td>
              <td className="py-2 px-4 border-b">
                {event.approved ? "Taip" : "Ne"}
              </td>
              <td className="py-2 px-4 border-b">
                {event.blocked ? "Taip" : "Ne"}
              </td>
              <td className="py-2 px-4 border-b">
                <select
                  value={event.category || ""}
                  onChange={(e) => {
                    setEventCategory({
                      variables: { id: event.id, category: e.target.value },
                    }).then(() => refetchEvents());
                  }}
                  className="border rounded px-2 py-1"
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
              </td>
              <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  value={event.photoUrl || ""}
                  onChange={(e) => {
                    setEventCategory({
                      variables: { id: event.id, category: event.category },
                    });
                    setPhotoUrl({
                      variables: { id: event.id, photoUrl: e.target.value },
                    }).then(() => refetchEvents());
                  }}
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Nuotraukos URL"
                />
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() =>
                    approveEvent({ variables: { id: event.id } }).then(() =>
                      refetchEvents()
                    )
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mr-2"
                >
                  Patvirtinti
                </button>
                <button
                  onClick={() =>
                    blockEvent({ variables: { id: event.id } }).then(() =>
                      refetchEvents()
                    )
                  }
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mr-2"
                >
                  Blokuoti
                </button>
                <button
                  onClick={() =>
                    unblockEvent({ variables: { id: event.id } }).then(() =>
                      refetchEvents()
                    )
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mr-2"
                >
                  Atblokuoti
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
                >
                  Ištrinti
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mb-2">Vartotojai</h2>
      <button
        onClick={handleAddRandomUser}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
      >
        Sukurti atsitiktinį vartotoją
      </button>
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Vardas</th>
            <th className="py-2 px-4 border-b">El. paštas</th>
            <th className="py-2 px-4 border-b">Miestas</th>
            <th className="py-2 px-4 border-b">Šalis</th>
            <th className="py-2 px-4 border-b">Rolė</th>
            <th className="py-2 px-4 border-b">Veiksmai</th>
          </tr>
        </thead>
        <tbody>
          {usersData?.users
            ?.filter((user) => !user.blocked)
            .map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b">{user.username}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.town}</td>
                <td className="py-2 px-4 border-b">{user.country}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">
                  {user.role !== "admin" && (
                    <>
                      <button
                        onClick={() =>
                          blockUser({ variables: { id: user.id } }).then(() =>
                            refetchUsers()
                          )
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded mr-2"
                      >
                        Blokuoti
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
                      >
                        Ištrinti
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          {usersData?.users
            ?.filter((user) => user.blocked)
            .map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b">{user.username}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.town}</td>
                <td className="py-2 px-4 border-b">{user.country}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">
                  {user.role !== "admin" && (
                    <button
                      onClick={() =>
                        unblockUser({ variables: { id: user.id } }).then(() =>
                          refetchUsers()
                        )
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Atblokuoti
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
