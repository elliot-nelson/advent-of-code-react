import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from './layout';

export default function PuzzlePage({ year, day, title, children }) {
  return <Layout>
    <header>
      <FontAwesomeIcon icon="star" /> {title} <span>({year} Day {day})</span>
    </header>
    {children}
  </Layout>;
}
