import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout, {
  loader as rootLoader,
  action as rootAction,
} from "./layouts/RootLayout";
import ErrorPage from "./pages/ErrorPage";
import Contact from "./pages/Contact";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage.Component />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        path: "contacts/:id",
        // Component: Contact.Component,
        ...Contact,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
