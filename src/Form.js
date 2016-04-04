import React, { Component, PropTypes } from 'react'
import Joi from 'joi'
import _ from 'lodash'
import DefaultInputs from './_DefaultInputs'
import DefaultCheckbox from './_Checkbox'
import DefaultTextarea from './_Textarea'
import DefaultTextInput from './_TextInput'
import autobind from 'autobind-decorator'

export default class JoifulForm extends Component {

    static propTypes = {
        children: PropTypes.node,
        customInputElementTypes: PropTypes.object,
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
        values: {},
        customInputElementTypes: {}
    };

    constructor(props) {
        super(props)
        this.inputElementTypes = this.getInputElementTypes(this.props.customInputElementTypes)
        this.state = this.getStateFromProps(props)
    }

    getChildContext() {
        return {
            form: {
                schema: this.props.schema,
                getValue: this.getValue,
                getErrors: this.getErrors,
                onChange: this.onChange,
                onFocus: this.onFocus,
                onBlur: this.onBlur,
                inputElementTypes: this.inputElementTypes
            }
        }
    }

    componentDidMount() {
        this.setState(this.getStateFromProps(this.props))
    }

    componentWillReceiveProps(nextProps) {
        this.inputElementTypes = this.getInputElementTypes(nextProps.customInputElementTypes)
        this.setState(this.getStateFromProps(nextProps))
    }

    getInputElementTypes(customInputElementTypes) {
        const defaultInputElementTypes = {
            textElement: DefaultTextInput,
            selectElement: () => {},
            textAreaElement: DefaultTextarea,
            checkboxElement: DefaultCheckbox
        }
        return _.assign(defaultInputElementTypes, customInputElementTypes)
    }

    @autobind
    getErrors(fieldName) {
        const errors = _.assign(this.state.errors || {}, this.state.propErrors)
        if (fieldName && !_.isEmpty(errors)) {
            return errors[fieldName]
        }
        return null
    }

    @autobind
    submit(event) {
        if (!this.props.onSubmit) {
            return
        }

        event.preventDefault()

        const options = _.assign(this.props.options, {
            abortEarly: false,
            context: this.state.values
        })

        Joi.validate(this.state.values, this.state.schema, options, (err) => {
            if (err) {
                const formErrors = {}
                err.details.forEach((inputError) => {
                    formErrors[inputError.path] = inputError.message
                })
                this.setState({
                    errors: formErrors
                }, () => {
                    this.props.onSubmit(formErrors, this.state.values, null)
                })
                return
            }
            this.props.onSubmit(null, this.state.values, event)
        })
    }

    @autobind
    getValue(fieldName) {
        const { values } = this.state
        if (fieldName && values) {
            return values[fieldName]
        }
        return null
    }

    @autobind
    getAllErrors() {
        const errors = _.assign(this.state.errors || {}, this.state.propErrors)
        return _.isEmpty(errors) ? null : errors
    }

    @autobind
    onChange(event, values) {
        const { checked, name, value } = event.target

        const newState = {
            values: {
                ...this.state.values,
                ...values
            }
        }

        if (this.state.errors && this.state.errors[name]) {
            const options = _.assign(this.props.options, { context: newState.values })
            Joi.validate(checked || value, this.state.schema[name], options, (err) => {
                if (err) {
                    const formErrors = {}
                    err.details.forEach((inputError) => {
                        formErrors[this.state.keyMap[inputError.path]] = inputError.message
                    })

                    newState.errors = { ...this.state.errors, ...formErrors }

                    this.setState(newState, () => {
                        if (this.props.onChange) {
                            this.props.onChange(event, newState.values)
                        }
                    })
                } else {
                    newState.errors = { ...this.state.errors }
                    delete newState.errors[name]

                    this.setState(newState, () => {
                        if (this.props.onChange) {
                            this.props.onChange(event, newState.values)
                        }
                    })
                }
            })
        } else {
            this.setState(newState, () => {
                if (this.props.onChange) {
                    this.props.onChange(event, newState.values)
                }
            })
        }
    }

    @autobind
    onFocus(event) {
        const { onFocus } = this.props
        if (onFocus) {
            onFocus(event)
        }
    }

    @autobind
    onBlur(event) {
        const { name, value } = event.target

        // Dont validate if the field is empty and not required
        if (typeof value === 'string' && value.length === 0
            && this.state.schema[name]._flags.presence !== 'required') {
            if (this.props.onBlur) {
                this.props.onBlur(event)
            }
            return
        }

        const options = _.assign(this.props.options, { context: this.state.values })

        Joi.validate(value, this.state.schema[name], options, (err) => {
            if (err) {
                const formErrors = {}
                err.details.forEach((inputError) => {
                    formErrors[this.state.keyMap[inputError.path]] = inputError.message
                })

                this.setState({
                    errors: { ...this.state.errors, ...formErrors }
                }, () => {
                    if (this.props.onBlur) {
                        this.props.onBlur(event)
                    }
                })
            } else {
                if (this.props.onBlur) {
                    this.props.onBlur(event)
                }
            }
        })
    }

    @autobind
    getStateFromProps(props) {
        const state = {
            schema: {},
            propErrors: props.errors,
            keyMap: {},
            values: props.values
        }

        if (props.schema) {
            _.forOwn(props.schema, (fieldSchema, name) => {
                state.schema[name] = fieldSchema
                fieldSchema._joinedMetaData = _.assign.apply(this, fieldSchema._meta) || {}
                fieldSchema._joinedMetaData.name = name
                fieldSchema._tags = _.uniq(_.flatten(_.toArray(fieldSchema._tags).concat(name)))

                fieldSchema._settings = _.defaultsDeep(
                    fieldSchema._settings,
                    { language: { label: _.startCase(name) } }
                )

                state.keyMap[fieldSchema._settings.language.label] = name

                state.values[name] = (props.values && props.values[name])
                    ? props.values[name]
                    : fieldSchema._flags.default

                if (state.values[name] === undefined && fieldSchema._type === 'boolean') {
                    state.values[name] = false
                }
            })
        }
        return state
    }

    render() {
        const { props, submit } = this
        const { children } = props

        if (children) {
            return (
                <form onSubmit={submit}>
                    {children}
                </form>
            )
        }

        return (
            <form onSubmit={submit}>
                <DefaultInputs/>
            </form>
        )
    }
}
