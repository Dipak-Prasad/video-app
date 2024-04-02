import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Signup from './pages/Signup';
import MobileNav from './components/MobileNav';
import Movies from './pages/Movies';
import Series from './pages/Series';
import SeriesDetail from './pages/SeriesDetail';
import Watchlist from './pages/Watchlist';
import Search from './pages/Search';
import Episodes from './pages/Episodes';
import Dashboard from './pages/admin/dashboard';
import Upload from './pages/admin/Upload';
import Customers from './pages/admin/customers';
import Transaction from './pages/admin/transaction';
import Barcharts from './pages/admin/charts/barcharts';
import Piecharts from './pages/admin/charts/piecharts';
import Linecharts from './pages/admin/charts/linecharts';
import Stopwatch from './pages/admin/apps/stopwatch';
import Toss from './pages/admin/apps/toss';
import Login from './pages/Login';

const App = () => {
  const [openNav, setOpenNav] = useState(false);

  return (
    <Router>
      <MobileNav openNav={openNav} setOpenNav={setOpenNav} />
      <Navbar openNav={openNav} setOpenNav={setOpenNav} />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<Home />} />
        <Route path='/movies/detail/:id' element={<Detail />} />
        <Route path='/series/detail/:id/:episodeNumber' element={<SeriesDetail />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/series' element={<Series />} />
        <Route path='/series/:id' element={<Episodes />} />
        <Route path='/watchlist' element={<Watchlist />} />
        <Route path='/search' element={<Search />} />

        {/* Admin Routes */}
        <Route path='/admin/dashboard' element={<Dashboard />} />
        {/* <Route path='/admin/product' element={<Products />} /> */}
        <Route path='/admin/upload' element={<Upload/>} />
        <Route path='/admin/customer' element={<Customers />} />
        <Route path='/admin/transaction' element={<Transaction />} />
        {/* Charts */}
        <Route path='/admin/chart/bar' element={<Barcharts />} />
        <Route path='/admin/chart/pie' element={<Piecharts />} />
        <Route path='/admin/chart/line' element={<Linecharts />} />
        {/* Apps */}
        <Route path='/admin/app/stopwatch' element={<Stopwatch />} />
        <Route path='/admin/app/toss' element={<Toss />} />
      </Routes>
    </Router>
  );
};

export default App;