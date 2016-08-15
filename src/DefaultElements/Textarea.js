
import React from 'react'
import Container from './Container'

const JoifulDefaultTextarea = (props) =>
  <Container {...props}>
    <textarea
      className='joiful-react-forms'
      {...props}
    />
  </Container>

export default JoifulDefaultTextarea
