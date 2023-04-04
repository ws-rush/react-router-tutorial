import {
  Outlet,
  Link,
  useLoaderData,
  Form,
  redirect,
  NavLink,
} from "react-router-dom";
import { createContact, getContacts } from "../contacts";

export async function loader() {
  const contacts: any = await getContacts();
  return { contacts };
}

// react router revalidate data on every (post) navigation
// so all useLoaderData() hooks update
// if this action called twice, db has two elments and useLoaderData() will return two elements
export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function RootLayout() {
  const { contacts }: any = useLoaderData();
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <form method="post" id="search-form" role="search">
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
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact: any) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }: any) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite ? "★" : "☆"}
                  </NavLink>
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
