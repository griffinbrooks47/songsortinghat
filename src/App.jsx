import { useState } from 'react'
import { Navbar } from './Components/Navbar/navbar.jsx'
import { Landing } from './Routes/Landing/landing.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, Link, RouterProvider, Outlet } from 'react-router-dom'
import './App.css'

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Root />}>
        <Route index element={<Landing />}></Route>
      </Route>
    )
  )

  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  )
}

const Root = () => {
  return <>
    <Navbar />
    <div>
      <Outlet />
    </div>
  </>
}

export default App
