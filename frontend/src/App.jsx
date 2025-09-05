import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/Home';
import AboutUs from "./pages/AboutPage";
import SignPage from "./components/SignPage";
import TemplatesGallery from "./pages/TemplatesCategories";
import TemplateSwitcher from "./pages/TemplateSwitcher";
import ChatBot from "./components/ChatBot";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
    },
    {
      path: "/about",
      element: <AboutPage/>,
    },
    {
      path: "/sign",
      element: <SignPage/>,
    },
    {
      path: "/templates",
      element: <TemplatesGallery/>,
    },
    {
      path: "/templates/:categoryId",
      element: <TemplateSwitcher/>,
      loader: async ({ params }) => {
        // You can fetch category-specific data here if needed
        return { 
          categoryId: params.categoryId,
          // Add any other data you want to pass to TemplateSwitcher
        };
      }
    },
    {
      path: "/chatbot",
      element: <ChatBot/>,
    },
    {
      path:"/contact",
      element:<ContactPage/>
    }
  ]);

  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;