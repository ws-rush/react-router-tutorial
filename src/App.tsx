import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import ErrorPage from "./pages/ErrorPage";
import Contact from "./pages/Contact";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage.Component />,
    children: [
      {
        path: "contacts/:id",
        Component: Contact.Component,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
