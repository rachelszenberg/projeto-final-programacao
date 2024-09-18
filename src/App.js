import React from 'react';
import { Header } from './components/Header';
import { Body } from './screens/Body';
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { Obrigado } from './screens/Obrigado';
import { PageError } from './screens/PageError';
// import { PageError } from './components/PageError';
import './firebase/firebase';

function App() {

  const router = createBrowserRouter([
    {
      element: <Outlet />,
      errorElement: <PageError/>,
      children: [
        {
          path: '/', element:
            <div>
              <Header />
              <Body />
            </div>
        },
        { path: '/obrigado', element: <Obrigado /> },
      ]
    }
  ])

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
