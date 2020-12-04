import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'gatsby';
import Layout from '../../components/layout';
import './index.css';
import { PUZZLES } from '../../utils/puzzles';
import { puzzlePath } from '../../utils/utils';

export default function Page() {
  const year = 2020;

  return <Layout>
    <header>
      <a href="/">All</a> <FontAwesomeIcon icon="angle-right" /> {year}
    </header>
    <div className="puzzle-index">
      <ul>
        {Object.keys(PUZZLES[year]).map(day =>
          <li key={`${year} ${day}`}>
            <Link to={puzzlePath(year, day)}>
              <h4>Day {day} <FontAwesomeIcon icon="star" /> {PUZZLES[year][day]}</h4>
              <img src={`${puzzlePath(year, day)}card.png`} />
            </Link>
          </li>
        )}
      </ul>
    </div>
  </Layout>;
}
