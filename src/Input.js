import { Component, createElement, PropTypes } from 'react'
import _ from 'lodash'
import autobind from 'autobind-decorator'

export default class JoifulInput extends Component {

    static contextTypes = {
        form: PropTypes.object.isRequired
    };

    static propTypes = {
        elementType: PropTypes.string,
        inputProps: PropTypes.object,
        is: PropTypes.string,
        name: PropTypes.string.isRequired,
        onChange: PropTypes.func
    };

    static defaultProps = {
        is: 'text'
    };

    componentWillReceiveProps(nextProps, { form }) {
        this.form = form
    }

    @autobind
    onChange(event) {
        if (event.preventDefault) {
            event.preventDefault()
        }

        if (this.props.onChange) {
            this.props.onChange(event)
        }

        if (this.form.onChange) {
            this.form.onChange(
                event,
                { [event.target.name]: event.target.checked || event.target.value }
            )
        }
    }

    @autobind
    getFieldSchema() {
        this.form = this.form || this.context.form
        if (this.form.schema === null) {
            return null
        }
        return this.form.schema[this.props.name]
    }

    @autobind
    fieldDefaults(fieldSchema, elementType) {
        const defaults = {
            ...fieldSchema._joinedMetaData,
            required: fieldSchema._flags.presence === 'required',
            label: fieldSchema._settings.language.label
            // default: fieldSchema._flags ? fieldSchema._flags.default : undefined
        }

        if (fieldSchema._valids
            && fieldSchema._valids._set
            && fieldSchema._valids._set.length > 0) {
            const optionValues = fieldSchema._joinedMetaData.names || fieldSchema._valids._set
            const optionNames = fieldSchema._valids._set
            defaults.enums = _.zipObject(optionNames, optionValues)
            defaults.allowed = optionValues
        }

        switch (elementType) {
        case 'text':
            defaults.placeholder = fieldSchema._examples[0] || undefined
            break
        default:
            break
        }

        return defaults
    }

    @autobind
    validateFieldSchema(fieldSchema, elementType, name) {
        if (!fieldSchema.isJoi) {
            return `${name} does not match the expected format as a Joi schmea object. A ValidatedForm must be passed in a valid schema that follows the format specified in the Readme.` // eslint-disable-line max-len
        }

        if (!this.form.inputElementTypes[elementType]) {
            return `[JoifulReactForms Error] The requested input type of ${elementType} does not have a defined element type` // eslint-disable-line max-len
        }

        if (elementType === 'select') {
            if (!fieldSchema._valids
                || !fieldSchema._valids._set
                || !fieldSchema._valids._set.length === 0) {
                return `Warning! ${name} is a select element but no 'valid' params are provided. This field will be ignored.` // eslint-disable-line max-len
            }
        }

        return null
    }

    render() {
        const { elementType, is, ...props } = this.props
        const fieldSchema = this.getFieldSchema()
        const name = fieldSchema._joinedMetaData.name

        // 'is' is an alias for elementType
        const elementIs = is || elementType

        const fieldValidation = this.validateFieldSchema(fieldSchema, elementIs, name)
        if (fieldValidation) {
            return console.error(fieldValidation)
        }

        const defaults = this.fieldDefaults(fieldSchema, elementIs)

        return createElement(this.form.inputElementTypes[elementIs], {
            ...defaults,
            ...props,
            error: this.form.getErrors(name),
            onBlur: this.form.onBlur,
            onChange: this.onChange,
            onFocus: this.form.onFocus,
            value: this.form.getValue(name)
        })
    }
}
