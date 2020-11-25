import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PuzzleYear2019Day01 from '../components/puzzle-year-2019-day-01.js';

export default function Home() {
  return <div>
      <div>Hello world!</div>
      <FontAwesomeIcon icon="space-shuttle" />
      <FontAwesomeIcon icon="satellite" />
      <FontAwesomeIcon icon="wrench" />
      <FontAwesomeIcon icon="ethernet" />
      <FontAwesomeIcon icon="network-wired" />
      <PuzzleYear2019Day01>
        Hello!
      </PuzzleYear2019Day01>
      <FontAwesomeIcon icon="network-wired" />
    </div>
}
