import React from 'react';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from './layout';

export default function PuzzlePage({ year, day, title, children }) {
  const githubUrl = `https://github.com/elliot-nelson/advent-of-code-react/blob/main/src/pages/${year}/${String(day).padStart(2, '0')}/index.js`;

  return <Layout githubUrl={githubUrl}>
    <Helmet>
      <title>{year} Day {day} - {title}</title>
      <meta name="author" content="Elliot Nelson" />
      <meta name="description" content="Solutions to AdventOfCode puzzles, animated in React." />
      <meta property="og:title" content={`${year} Day ${day} - ${title}`} />
      <meta property="og:description" content="Solutions to AdventOfCode puzzles, animated in React." />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={`https://advent-of-code.7tonshark.com/${year}/${String(day).padStart(2, '0')}/card.png` } />
    </Helmet>
    <header>
      <a href="">All</a> <FontAwesomeIcon icon="angle-right" /> <a href={`/${year}/`}>{year}</a> <FontAwesomeIcon icon="angle-right" /> Day {day} <FontAwesomeIcon icon="star" className="gold-star" /> {title}
    </header>
    {children}
  </Layout>;
}
