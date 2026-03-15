import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <section className="admin-grid profile-grid">
      <article className="admin-card">
        <span className="admin-eyebrow">Cont administrator</span>
        <h2>{user?.username}</h2>
        <p>Email: {user?.email}</p>
        <p>Rol: {user?.role}</p>
      </article>
      <article className="admin-card">
        <span className="admin-eyebrow">Conectare existentă</span>
        <p>
          Noul admin folosește autentificarea existentă din proiect. Nu a fost introdus un backend nou;
          datele rămân administrate prin serviciile locale deja folosite de site.
        </p>
      </article>
    </section>
  );
};

export default ProfilePage;
