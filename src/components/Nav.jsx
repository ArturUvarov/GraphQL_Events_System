function Nav() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSignOut = () => {
    localStorage.removeItem("user");
    window.location.href = "/signin";
  };

  return (
    <nav className="bg-blue-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-white font-bold text-xl hover:text-blue-200 transition">
              Renginiai pagal miestus
            </h1>
            <a
              href="/main"
              className="text-blue-100 hover:text-white px-3 py-2 rounded transition"
            >
              Pagrindinis puslapis
            </a>
            {user?.role === "admin" && (
              <a
                href="/admin"
                className="text-yellow-200 hover:text-white px-3 py-2 rounded transition"
              >
                Administravimo panelelė
              </a>
            )}
            {!user && (
              <>
                <a
                  href="/signin"
                  className="text-blue-100 hover:text-white px-3 py-2 rounded transition"
                >
                  Prisijungti
                </a>
                <a
                  href="/signup"
                  className="text-blue-100 hover:text-white px-3 py-2 rounded transition"
                >
                  Registruotis
                </a>
              </>
            )}
          </div>
          {user && (
            <div className="flex items-center space-x-2">
              <img
                src={
                  user.profilePic ||
                  `https://ui-avatars.com/api/?name=${user.username}`
                }
                alt="profile"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <span className="text-white font-medium">{user.username}</span>
              <span className="text-xs text-blue-200 bg-blue-900 px-2 py-1 rounded">
                {user.role}
              </span>
              <button
                onClick={handleSignOut}
                className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
              >
                Atsijungti
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
