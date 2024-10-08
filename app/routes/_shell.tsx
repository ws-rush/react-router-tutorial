import {
  Outlet,
  useNavigation,
  useSubmit,
  useLoaderData,
  Form,
  redirect,
  NavLink,
  useRouteError,
} from "react-router-dom";
import { useEffect } from "react";
import { createContact, getContacts } from "../services";
import { router } from "../main";

export const id = '_shell'

export async function clientLoader({ request }: any) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

// react router revalidate data on every (post) navigation
// so all useLoaderData() hooks update
// if this action called twice, db has two elments and useLoaderData() will return two elements
export async function clientAction() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function RootLayout() {
  const { contacts, q }: any = useLoaderData();
  console.log(q)
  const navigation = useNavigation();
  const submit = useSubmit();

  // if user search, show loader
  // coz q value doesnt show in url until data loaded
  // so we need to check url to show spinner
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  //  watch q to empty form if user turn back (make it identical to previous url)
  // not needed while form use replace when submit
  // useEffect(() => {
  //   document.getElementById("q").value = q;
  // }, [q]);

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
                const ddd = new FormData(e.currentTarget.form)
                const isFirstSearch = q == null;
                submit(removeEmptyKeysFromFormData(ddd), {
                  replace: !isFirstSearch,
                });
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

export function ErrorBoundary() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}

function removeEmptyKeysFromFormData(formData: FormData) {
  // Create a plain object from FormData
  const data: Record<string, FormDataEntryValue> = {};
  for (const [key, value] of formData.entries()) {
      data[key] = value;
  }

  // Remove keys with empty values
  const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== null && value !== undefined && typeof value === 'string' && value.trim() !== '')
  );

  // Create a new FormData object and append cleaned data
  const cleanedFormData = new FormData();
  for (const [key, value] of Object.entries(cleanedData)) {
      cleanedFormData.append(key, value);
  }

  return cleanedFormData;
}