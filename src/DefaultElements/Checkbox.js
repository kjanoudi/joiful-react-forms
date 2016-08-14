
import React from 'react'
import Container from './Container'

const JoifulDefaultCheckbox = (props) =>
  <Container {...props}>
    <input
      className='joiful-react-forms'
      type='checkbox'
      {...props}
    />
  </Container>

export default JoifulDefaultCheckbox
