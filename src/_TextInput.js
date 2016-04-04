import React from 'react'
import Container from './_Container'

const JoifulReactFormsTextInput = (props) =>
    <Container {...props}>
        <input
            className="joiful-react-forms"
            type="text"
            {...props}
        />
    </Container>

export default JoifulReactFormsTextInput
