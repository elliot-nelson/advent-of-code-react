import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from './layout';

export default function PuzzlePage({ year, day, title, children }) {
  return <Layout>
    <header>
      <a href="">All</a> <FontAwesomeIcon icon="angle-right" /> <a href={`/${year}/`}>{year}</a> <FontAwesomeIcon icon="angle-right" /> Day {day} <FontAwesomeIcon icon="star" className="gold-star" /> {title}
    </header>
    {children}
  </Layout>;
}
