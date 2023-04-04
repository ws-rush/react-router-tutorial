import {
  Outlet,
  useNavigation,
  useSubmit,
  useLoaderData,
  Form,
  redirect,
  NavLink,
} from "react-router-dom";
import { useEffect } from "react";
import { createContact, getContacts } from "../contacts";

export async function loader({ request }: any) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

// react router revalidate data on every (post) navigation
// so all useLoaderData() hooks update
// if this action called twice, db has two elments and useLoaderData() will return two elements
export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function RootLayout() {
  const { contacts, q }: any = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

  // if user search, show loader
  // coz q value doesnt show in url until data loaded
  // so we need to check url to show spinner
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  // watch q to empty form if user turn back (make it identical to previous url)
  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              // pass q as value make input identical url after refresh
              defaultValue={q}
              onChange={(e: any) => {
                // submit form on change, not manually
                submit(e.currentTarget.form);
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
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
      <div
        id="detail"
        // it can be "loading" or "submitting" or "idle"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}
