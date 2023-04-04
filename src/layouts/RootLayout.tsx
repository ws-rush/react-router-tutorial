import { Outlet, Link, useLoaderData } from "react-router-dom";
import { getContacts } from "../contacts";

export async function rootLoader() {
  const contacts: any = await getContacts();
  return { contacts };
}

export default function RootLayout() {
  const { contacts }: any = useLoaderData();
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
            />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </form>
          <form method="post">
            <button type="submit">New</button>
          </form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact: any) => (
                <li key={contact.id}>
                  <Link to={`contacts/${contact.id}`}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite ? "★" : "☆"}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No contacts found.</p>
          )}
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
