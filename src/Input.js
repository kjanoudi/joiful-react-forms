
import { default as get } from 'lodash.get'
import { Component, createElement, PropTypes } from 'react'

export default class Input extends Component {

  static contextTypes = {
    form: PropTypes.object.isRequired
  };

  static propTypes = {
    is: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func
  };

  static defaultProps = {
    is: 'text'
  };
  
  constructor (props, context) {
    super(props, context)
    
    // Bind methods
    this.onChange = this.onChange.bind(this)
    this.getSchema = this.getSchema.bind(this)
    this.defaults = this.defaults.bind(this)
    this.validateSchema = this.validateSchema.bind(this)
  }

  onChange (event) {
    if (event.preventDefault) {
      event.preventDefault()
    }
    if (this.props.onChange) {
      this.props.onChange(event)
    }
    if (this.context.form.onChange) {
      this.context.form.onChange(event, {
        [event.target.name]: event.target.checked || event.target.value
      })
    }
  }

  getSchema () {
    const { form } = this.context
    if (!form || !form.schema) {
      return null
    }
    const { name } = this.props
    const schema = form.schema[name]
    if (!schema) {
      console.error(`${name} is not a key in your schema.`)
    }
    return schema
  }

  optionsForSelectElem (schema = {}) {
    if (get(schema, '_valids._set', []).length === 0) {
      return false
    }
    const optionValues = schema._joinedMetaData.names || schema._valids._set
    const optionNames = schema._valids._set
    return optionNames.map((children, i) => ({
      children,
      value: optionValues[i]
    }))
  }

  defaults (schema, is) {
    if (!schema) {
      return {}
    }
    const defaults = {
      ...schema._joinedMetaData,
      required: schema._flags.presence === 'required',
      label: schema._settings.language.label,
      placeholder: is === 'text' ? schema._examples[0] : null
    }
    const options = this.optionsForSelectElem(schema)
    if (options) {
      defaults.options = options
    }
    return defaults
  }

  validateSchema (schema, is, name) {
    if (!schema) {
      return 'Schema is required'
    }
    if (!schema.isJoi) {
      return `
        ${name} does not match the expected format as a Joi schmea object.
        A ValidatedForm must be passed in a valid schema that follows
        the format specified in the Readme.
      `
    }
    if (typeof is === 'string') {
      if (!get(this, ['context', 'form', 'elemTypes', is])) {
        return `
          [JoifulReactForms Error] The requested input type of
          ${is} does not have a defined element type
        `
      }
      if (is === 'select' && get(schema, '_valids._set', []).length === 0) {
        return `
          Warning! ${name} is a select element but no valid params were provided.
        `
      }
    }
    return false
  }

  render () {
    const { is, ...props } = this.props
    const schema = this.getSchema()
    const name = get(schema, '_joinedMetaData.name')

    const invalidation = this.validateSchema(schema, is, name)
    if (invalidation) {
      console.error(invalidation)
    }

    const form = get(this.context, 'form', {})
    const el = typeof is === 'string' ? get(form, ['elemTypes', is], 'input') : is
    const value = form.getValue && form.getValue(name)
    const error = form.getErrors && form.getErrors(name)

    return createElement(el, {
      ...this.defaults(schema, is),
      ...props,
      error,
      onBlur: form.onBlur,
      onChange: this.onChange,
      onFocus: form.onFocus,
      value
    })
  }
}
