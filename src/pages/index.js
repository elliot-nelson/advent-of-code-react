import React from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from '../components/layout';

export default function Page() {
  return <Layout>
    <Link to="/2019/01/"><FontAwesomeIcon icon="star" /> The Tyranny of the Rocket Equation (2019 Day 1)</Link>
    </Layout>;
}
