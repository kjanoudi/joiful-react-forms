import React, { Component, PropTypes } from 'react'
import Joi from 'joi'
import _ from 'lodash'
import InputGroup from './InputGroup'
import autobind from 'autobind-decorator'

export default class ValidatedForm extends Component {
    static propTypes = {
        schema: PropTypes.object.isRequired,
        errors: PropTypes.object,
        values: PropTypes.object,
        options: PropTypes.object,
        onSubmit: PropTypes.func,
        onChange: PropTypes.func,
        customInputElementTypes: PropTypes.object
    };

    static childContextTypes = {
        form: PropTypes.object
    };

    static defaultProps = {
        errors: {},
        values: {},
        options: {},
        customInputElementTypes: {}
    };

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

    constructor(props){
        super(props)
        this.inputElementTypes = this.getInputElementTypes(this.props.customInputElementTypes)
        this.state = this.getStateFromProps(props)
    }

    @autobind
    getStateFromProps(props){
        var state = {
            schema: {},
            keyMap: {},
            values: props.values
        }

        if(props.schema) {
            _.forOwn(props.schema, (fieldSchema, name) => { 
                state.schema[name] = fieldSchema
                fieldSchema._joinedMetaData = _.assign.apply(this, fieldSchema._meta) || {}
                fieldSchema._joinedMetaData.name = name
                fieldSchema._tags = _.uniq(_.flatten(_.toArray(fieldSchema._tags).concat(name)))
                fieldSchema._settings = _.defaultsDeep(fieldSchema._settings, { language: { label: _.startCase(name) } })
                state.keyMap[fieldSchema._settings.language.label] = name
                state.values[name] = (props.values && props.values[name]) ? props.values[name] : fieldSchema._flags.default
                if(state.values[name] === undefined && fieldSchema._type === 'boolean') {
                    state.values[name] = false
                }
            })
        }
        return state
    }

    componentDidMount() {
        var state = this.getStateFromProps(this.props)
        this.setState({
            ...state
        })
    }

    componentWillReceiveProps(nextProps) {
        this.inputElementTypes = this.getInputElementTypes(nextProps.customInputElementTypes)
        var nextState = this.getStateFromProps(nextProps)
        this.setState({
            ...nextState
        })
    }

    getInputElementTypes(customInputElementTypes){
        let defaultInputElementTypes = {
            textElement: (err, value, options, events) => {
            },
            selectElement: (err, value, options, events) => {
            },
            textAreaElement: (err, value, options, events) => {
                var key = options.key
                delete options.key

                return (
                    <div key={key} className={err ? 'input-error' : 'input'}>
                        {err}
                        <textarea {...options}
                                  value={value}
                                  onChange={events.onChange}
                                  onFocus={events.onFocus}
                                  onBlur={events.onBlur} ></textarea>
                    </div>
                )
            },
            checkboxElement: (err, value, options, events) => {
                options.type = 'checkbox'
                var key = options.key
                delete options.key

                return (
                    <div key={key} className={err ? 'input-error' : 'input'}>
                        {err}
                        <input {...options}
                               value={value}
                               onChange={events.onChange}
                               onFocus={events.onFocus}
                               onBlur={events.onBlur} />
                    </div>
                )
            }
        }
        return _.assign(defaultInputElementTypes, customInputElementTypes)
    }

    render() {
        if(this.props.children) {
            return (
                <form onSubmit={this.submit}>
                    {this.props.children}
                </form>
            )
        }

        return (
            <form onSubmit={this.submit}>
                <InputGroup />
            </form>
        )
    }

    @autobind
    submit(e) {
        if(!this.props.onSubmit) return

        Joi.validate(
            this.state.values, 
            this.state.schema, 
            _.assign(this.props.options, {
                abortEarly: false,
                context: this.state.values
            }),
            (err, value) => {
                e.preventDefault()
                if(err) {
                    var formErrors= {}
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
                this.props.onSubmit(null, this.state.values, e)
            }
        )
    }

    @autobind
    valid(){
        return _.isEmpty(this.state.errors)
    }

    @autobind
    getErrors(fieldName) {
        const errors = _.assign(this.state.errors || {}, this.props.errors)
        if(fieldName && !_.isEmpty(errors)) {
            return this.state.errors[fieldName]
        }
    }
    
    @autobind
    getValue(fieldName) {
        if(fieldName && this.state.values) {
            return this.state.values[fieldName]
        }
    }

    @autobind
    getAllErrors(){
        const errors = _.assign(this.state.errors || {}, this.props.errors)
        return _.isEmpty(errors) ? null : errors
    }

    @autobind
    onChange(e, values) {
        var name = e.target.name
        var value = e.target.checked || e.target.value

        var newState = {
            values: {
                ...this.state.values,
                ...values
            }
        }

        if(this.state.errors && this.state.errors[name]) {
            Joi.validate(value, this.state.schema[name], _.assign(this.props.options, { context: newState.values }), (err, value) => {
                if(err) {
                    var formErrors= {}
                    err.details.forEach((inputError) => {
                        formErrors[this.state.keyMap[inputError.path]] = inputError.message
                    })

                    newState.errors = {...this.state.errors, ...formErrors}

                    this.setState(newState, () => {
                        if(this.props.onChange) {
                            this.props.onChange(e, newState.values)
                        }
                    })
                } else {

                    newState.errors = {...this.state.errors}
                    delete newState.errors[name]

                    this.setState(newState, () => {
                        if(this.props.onChange) {
                            this.props.onChange(e, newState.values)
                        }
                    })
                }
            })
        } else {
            this.setState(newState, () => {
                if(this.props.onChange) {
                    this.props.onChange(e, newState.values)
                }
            })
        }

    }

    @autobind
    onFocus(e) {
        if(this.props.onFocus) {
            this.props.onFocus(e)
        }
    }

    @autobind
    onBlur(e) {
        var value = e.target.value
        var name = e.target.name

        // Dont validate if the field is empty and not required
        if(typeof value === 'string' && value.length === 0 && this.state.schema[name]._flags.presence !== 'required') {
            if(this.props.onBlur) {
                this.props.onBlur(e)
            }
            return
        }

        Joi.validate(value, this.state.schema[name], _.assign(this.props.options, { context: this.state.values }), (err, value) => {
            if(err) {
                var formErrors= {}
                err.details.forEach((inputError) => {
                    formErrors[this.state.keyMap[inputError.path]] = inputError.message
                })

                this.setState({
                    errors: {...this.state.errors, ...formErrors}
                }, () => {
                    if(this.props.onBlur) {
                        this.props.onBlur(e)
                    }
                })
            } else {
                if(this.props.onBlur) {
                    this.props.onBlur(e)
                }
            }
        })
    }
}