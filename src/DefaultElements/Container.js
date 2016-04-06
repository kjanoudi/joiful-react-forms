import React, { PropTypes } from 'react'

const JoifulDefaultContainer = ({ error, children }) =>
    <div className={`joiful-react-forms ${error ? 'joiful-react-forms-error' : ''}`}>
        {children}
        {error}
    </div>

JoifulDefaultContainer.propTypes = {
    children: PropTypes.node.isRequired,
    error: PropTypes.string
}

export default JoifulDefaultContainer
