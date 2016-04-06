import React from 'react'
import Container from '.'

const JoifulDefaultCheckbox = (props) =>
    <Container {...props}>
        <input
            className="joiful-react-forms"
            type="checkbox"
            {...props}
        />
    </Container>

export default JoifulDefaultCheckbox
