import { Form, useLoaderData, redirect, useFetcher } from "react-router-dom";
import { deleteContact, getContact, updateContact } from "../services";

export async function clientLoader({ params }: any) {
  const contact: any = await getContact(params.id);
  return { contact };
}

export async function clientAction({ request, params }: any) {
  switch (request.method) {
    case "DELETE":
      await deleteContact(params.id);
      break;
    case "PATCH":
      const formData = await request.formData();
      return updateContact(params.id, {
        favorite: formData.get("favorite") === "true",
      });
  }
  return redirect("/");
}

export default function Component() {
  const { contact }: any = useLoaderData();

  return (
    <div id="contact">
      <div>
        <img key={contact.avatar} src={contact.avatar || undefined} />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="delete"
            onSubmit={(event) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundry() {
  return <div>Oops! There was an error.</div>;
}

function Favorite({ contact }: any) {
  const fetcher = useFetcher();

  let favorite = contact.favorite;
  // If we're in the middle of a PATCH request, use the new favorite value
  // Optimistic UI
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }

  return (
    <fetcher.Form method="patch">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
