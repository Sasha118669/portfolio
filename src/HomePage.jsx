import React from "react";
import { useState } from 'react'
import { Link } from "react-router-dom";
import './global.css'
import './responsive.css'
import './HomePage.css'

import {
GitHubIcon,
WhatsAppIcon,
StartBtn,
} from "./assest.js";

export default function HomePage() {
  return (
    <>
    <div className="HomePageContainer">

      <Link to="/portalgame">
      <StartBtn />
      </Link>

    <div className="LinkSection">

    <a href="#" target="_blank" rel="noopener noreferrer">
    <GitHubIcon className="icon" />
  </a>
    <a href="#" target="_blank" rel="noopener noreferrer">
    <WhatsAppIcon className="icon" />
  </a>

    </div>

    <div className="ShortResume">
    <p>
      Oleksandr Shukshyn
Born in January 2008 in Ivano-Frankivsk, Ukraine. Currently living in Vienna, Austria.
I am learning web development with a focus on front-end technologies such as HTML, CSS, JavaScript, and React.
I am eager to learn new skills and actively grow in the field of front-end development.
    </p>
    </div>

    </div>
    </>
  )
}
