import React, { createRef } from 'react';
import './App.scss';
import Header from "./app/header";
import Footer from './app/footer';
import Configs from './app/main/configs';
import ToastHandler from './app/components/toast-handler';

function App() {

  const toastRef = createRef();
  return <>
    <Header />
    <Configs />
    <Footer />
    <ToastHandler ref={toastRef} />
  </>;
}

export default App;
