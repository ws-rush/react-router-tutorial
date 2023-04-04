import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import ErrorPage from "./pages/ErrorPage";
import Contact from "./pages/Contact";

const router = createBrowserRouter([
  {
    path: "/",
    // element: <h1>hello world</h1>,
    element: <RootLayout />,
    // or:
    // componenet: RootLayout,
    errorElement: <ErrorPage.Component />,
  },
  {
    path: "/contacts/:id",
    Component: Contact.Component,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
