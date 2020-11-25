import React from 'react'
import { Link } from 'gatsby'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function PuzzlePage() {
  return <div>
      <div>Hello world!</div>
      <FontAwesomeIcon icon="space-shuttle" />
      <FontAwesomeIcon icon="satellite" />
      <FontAwesomeIcon icon="wrench" />
      <FontAwesomeIcon icon="ethernet" />
      <FontAwesomeIcon icon="network-wired" />
      <FontAwesomeIcon icon="network-wired" />
      <Link to="/2019/02/">Go to Day 2</Link>
    </div>
}
