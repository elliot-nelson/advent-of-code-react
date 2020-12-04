import React from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from '../components/layout';
import { PUZZLES } from '../utils/puzzles';
import './index.css';

export default function Page() {
  return <Layout>
    <header>
      All
    </header>
    <div className="year-index">
      <ul>
        {Object.keys(PUZZLES).map(year =>
          <li key={year}>
            <Link to={`/${year}/`}>{year}</Link>
          </li>
        )}
      </ul>
    </div>
  </Layout>;
}
