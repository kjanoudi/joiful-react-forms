
import React, { Component, PropTypes } from 'react'
import { default as values } from 'lodash.values'
import Input from '../Input'

export default class JoifulDefaultInputGroup extends Component {

  static contextTypes = {
    form: PropTypes.object.isRequired
  };

  static propTypes = {
    inputProps: PropTypes.object,
    tag: PropTypes.string
  };
  
  constructor (props, context) {
    super(props, context)
    
    // Bind methods
    this.getFieldSchemas = this.getFieldSchemas.bind(this)
  }

  componentWillReceiveProps (nextProps, { form }) {
    this.form = form
  }

  getFieldSchemas () {
    this.form = this.form || this.context.form

    if (this.form.schema === null) {
      return []
    }

    if (this.props.tag) {
      return values(this.form.schema).filter((field) =>
        field._tags.indexOf(this.props.tag) !== -1
      )
    }

    return values(this.form.schema)
  }

  render () {
    return (
      <div>
        {values(this.getFieldSchemas()).map((fieldSchema, key) => {
          let elementType = fieldSchema._joinedMetaData.elementType || 'text'
          return (
            <Input
              elementType={elementType}
              fieldName={fieldSchema._joinedMetaData.name}
              key={key}
            />
          )
        })}
      </div>
    )
  }
}
