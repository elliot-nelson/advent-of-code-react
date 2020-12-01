import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'gatsby';
import Layout from '../../components/layout';
import './index.css';

export default function Page() {
  const year = 2020;

  return <Layout>
    <header>
      <a href="">All</a> <FontAwesomeIcon icon="angle-right" /> {year}
    </header>
    <div className="puzzle-index">
      <ul>
        <li><Link to="/2020/01/">Day 1 <FontAwesomeIcon icon="star" /> Report Repair</Link></li>
      </ul>
    </div>
  </Layout>;
}
