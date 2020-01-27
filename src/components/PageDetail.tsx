import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Eddy } from './Eddy';

const PageDetail = () => {
  const { id } = useParams();
  return (
    <>
      <div className="hero">
        <Eddy id={`home-${id}`}>
          <img className="hero-img" src={`/assets/IMG_${id}.jpeg`} />
        </Eddy>
        <h1 className="hero-heading">Hero Heading</h1>
        <Link className="hero-close" to="/">
          ✕
        </Link>
      </div>
      <div className="wrapper">
        <article className="article">
          <h2>Subtitle goes here</h2>
          <hr />
          <p>Something really happening here</p>
          <p>Here too</p>
        </article>
      </div>
    </>
  );
};

export default PageDetail;
