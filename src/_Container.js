import React, { PropTypes } from 'react'

const JoifulReactFormsContainer = ({ error, children }) =>
    <div className={`joiful-react-forms ${error ? 'joiful-react-forms-error' : ''}`}>
        {children}
        {error}
    </div>

JoifulReactFormsContainer.propTypes = {
    children: PropTypes.node.isRequired,
    error: PropTypes.string
}

export default JoifulReactFormsContainer
