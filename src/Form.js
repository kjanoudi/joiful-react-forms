
import { default as Joi } from 'joi'
import { default as get } from 'lodash.get'
import { default as uniq } from 'lodash.uniq'
import { default as omit } from 'lodash.omit'
import { default as pick } from 'lodash.pick'
import { default as keys } from 'lodash.keys'
import { default as assign } from 'lodash.assign'
import { default as forOwn } from 'lodash.forown'
import { default as toArray } from 'lodash.toarray'
import { default as isEmpty } from 'lodash.isempty'
import { default as flatten } from 'lodash.flatten'
import * as DefaultElements from './DefaultElements'
import { default as startCase } from 'lodash.startcase'
import { default as defaultsDeep } from 'lodash.defaultsdeep'
import { default as React, Component, PropTypes } from 'react'

export default class Form extends Component {

  static contextTypes = {
    joifulReactForms: PropTypes.object
  };

  static propTypes = {
    children: PropTypes.node,
    elementTypes: PropTypes.object,
    errors: PropTypes.object,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onSubmit: PropTypes.func,
    options: PropTypes.object,
    schema: PropTypes.object.isRequired,
    values: PropTypes.object
  };

  static childContextTypes = {
    form: PropTypes.object
  };

  static defaultProps = {
    errors: {},
    options: {},
    values: {}
  };

  constructor (props, { joifulReactForms: config }) {
    super(props)

    this.state = {
      keyMap: {},
      schema: {}
    }

    this.state = {
      ...this.state,
      ...this.getStateFromProps(props)
    }

    const { Input } = { ...config }
    this.elemTypes = this.getElemTypes(get(Input, 'types', {}))
    
    // Bind methods
    this.getStateFromProps = this.getStateFromProps.bind(this)
    this.getErrors = this.getErrors.bind(this)
    this.submit = this.submit.bind(this)
    this.getFormData = this.getFormData.bind(this)
    this.getValue = this.getValue.bind(this)
    this.getAllErrors = this.getAllErrors.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  getChildContext () {
    return {
      form: {
        schema: this.props.schema,
        getValue: this.getValue,
        getErrors: this.getErrors,
        onChange: this.onChange,
        onFocus: this.onFocus,
        onBlur: this.onBlur,
        elemTypes: this.elemTypes
      }
    }
  }

  componentDidMount () {
    this.setState(this.getStateFromProps(this.props))
  }

  componentWillReceiveProps ({ elementTypes, ...props }, { joifulReactForms: config }) {
    const { Input } = { ...config }
    this.elemTypes = this.getElemTypes(get(Input, 'types', {}))
    this.setState(this.getStateFromProps(props))
  }

  getElemTypes (elementTypes = {}) {
    return {
      text: DefaultElements.TextInput,
      select: () => {},
      textarea: DefaultElements.Textarea,
      checkbox: DefaultElements.Checkbox,
      ...elementTypes
    }
  }

  setLabel (schema = {}, name = '') {
    schema._settings = defaultsDeep(
      get(schema, '_settings', {}),
      {
        language: {
          label: startCase(name)
        }
      }
    )
    return schema
  }

  getStateFromProps (props) {
    const state = {
      ...this.state,
      propErrors: props.errors,
      values: props.values
    }
    if (props.schema) {
      forOwn(props.schema, (schema, name) => {
        state.schema[name] = schema
        schema._joinedMetaData = assign.apply(this, schema._meta) || {}
        schema._joinedMetaData.name = name
        schema._tags = uniq(flatten(toArray(schema._tags).concat(name)))
        schema = this.setLabel(schema, name)
        state.keyMap[schema._settings.language.label] = name
        state.values[name] = get(props, ['values', name]) || schema._flags.default
        if (state.values[name] === undefined && schema._type === 'boolean') {
          state.values[name] = false
        }
      })
    }
    return state
  }

  getErrors (fieldName) {
    const errors = {
      ...this.state.errors,
      ...this.state.propErrors
    }
    if (fieldName && !isEmpty(errors)) {
      return errors[fieldName]
    }
    return null
  }

  parseJoiErrors ({ details }) {
    const errors = {}
    details.forEach(({ path, message }) => {
      errors[path] = message
    })
    return errors
  }

  submit (event) {
    if (!this.props.onSubmit) {
      return
    }

    event.preventDefault()

    const { onSubmit } = this.props
    const { schema } = this.state
    const values = this.getFormData(this.state.values)
    const options = {
      ...this.props.options,
      abortEarly: false,
      context: values
    }
    let errors = null

    Joi.validate(values, schema, options, (err) => {
      if (err) {
        errors = this.parseJoiErrors(err)
      }
    })

    this.setState({ errors })
    onSubmit(errors, values, event)
  }

  getFormData (values = {}) {
    return pick(values, keys(this.state.schema))
  }

  getValue (fieldName) {
    const { values } = this.state
    if (fieldName && values) {
      return typeof values[fieldName] !== 'undefined' ? values[fieldName] : ''
    }
    return ''
  }

  getAllErrors () {
    const errors = {
      ...this.state.errors,
      ...this.state.propErrors
    }
    return isEmpty(errors) ? null : errors
  }

  onChange (event, values) {
    const { checked, name, value } = event.target

    const nextState = {
      values: {
        ...this.state.values,
        ...values
      }
    }

    if (this.state.errors && this.state.errors[name]) {
      const options = {
        ...this.props.options,
        context: nextState.values
      }

      const { schema } = this.state

      Joi.validate(checked || value, schema[name], options, (err) => {
        if (err) {
          nextState.errors = {
            ...this.state.errors,
            ...this.parseJoiErrors(err)
          }
        } else {
          delete nextState.errors[name]
        }
      })
    }

    const { onChange } = this.props
    if (onChange) {
      onChange(event, nextState.values)
    }

    this.setState(nextState)
  }

  onFocus (event) {
    const { onFocus } = this.props
    if (onFocus) {
      onFocus(event)
    }
  }

  onBlur (event) {
    const { name, value } = event.target
    const { schema } = this.state

    if (typeof value === 'string' &&
      value.length === 0 &&
      schema._flags.presence !== 'required' &&
      this.props.onBlur) {
      this.props.onBlur(event)
    }

    const options = {
      ...this.props.options,
      context: this.state.values
    }

    Joi.validate(value, schema[name], options, (err) => {
      if (err) {
        this.setState({
          errors: {
            ...this.state.errors,
            ...this.parseJoiErrors(err)
          }
        })
      } else {
        this.setState({
          errors: {
            ...this.state.errors,
            [name]: null
          }
        })
      }
    })

    if (this.props.onBlur) {
      this.props.onBlur(event)
    }
  }

  render () {
    const { children, ...props } = this.props
    return (
      <form
        {...omit(props, 'schema', 'errors', 'options')}
        onSubmit={this.submit}
        children={children || <DefaultElements.DefaultInputGroup />}
      />
    )
  }
}
