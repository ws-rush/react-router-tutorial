import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { getContact, updateContact } from "../services";

export async function clientLoader({ params }: any) {
  const contact: any = await getContact(params.id);
  return { contact };
}

export async function clientAction({ request, params }: any) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData.entries());
  // request, request.formData, formData.entries, Object.fromEntries web APIs
  // updates.first
  // updates.last
  // const firstName = formData.get("first");
  // const lastName = formData.get("last");
  await updateContact(params.id, updates);
  return redirect(`/contacts/${params.id}`);
}

export default function Component() {
  const { contact }: any = useLoaderData();
  const navigate = useNavigate();

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" defaultValue={contact.notes} rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </p>
    </Form>
  );
}
