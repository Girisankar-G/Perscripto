import React from 'react'
import SpecialityMenu from '../components/SpecialityMenu';
import Header from '../components/Header';
import TopDoctors from '../components/TopDoctors';
import Banner from '../components/Banner';

const Home = () => {
  return (
    <>
      <Header/>
      <SpecialityMenu/>
      <TopDoctors/>
      <Banner/>
    </>
    )
}

export default Home;