import * as React from 'react';
import { Link } from 'react-router-dom';
import { Eddy } from './Eddy';

const homes = [
  '3669',
  '9166',
  '9176',
  '9180',
  '9182',
  '9183',
  '9209',
  '9442',
  '9453',
  '9456',
  '9458',
  '9461',
];

const PageHome = () => (
  <div className="wrapper">
    {homes.map(id => (
      <Link key={id} to={`/home/${id}`} className="card">
        <div className="card-img">
          <Eddy id={`home-${id}`}>
            <img className="card-img-inner" src={`/assets/IMG_${id}.jpeg`} />
          </Eddy>
        </div>
        <div className="card-text">
          <h1 className="card-heading">Home lorem ipsum</h1>
          <p className="card-desc">I really have something to say about this</p>
          <span className="card-cta">View</span>
        </div>
      </Link>
    ))}
  </div>
);

export default PageHome;
