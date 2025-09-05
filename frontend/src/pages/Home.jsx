import React, { useContext } from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import Footer from '../components/Footer'
import AuthContext from '../context/AuthContext'
import SignPage from '../components/SignPage'

const Home = () => {
  const {open}=useContext(AuthContext)
  return (
    <>
    <div>
      <Navbar/>
      <HeroSection/>
      <Footer/>
    </div>
    {open&&
      <SignPage/>
    }
    </>
  )
}

export default Home
