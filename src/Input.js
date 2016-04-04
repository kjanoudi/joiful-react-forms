import { Component, createElement, PropTypes } from 'react'
import _ from 'lodash'
import autobind from 'autobind-decorator'

export default class JoifulInput extends Component {

    static contextTypes = {
        form: PropTypes.object.isRequired
    };

    static propTypes = {
        elementType: PropTypes.string.isRequired,
        fieldName: PropTypes.string.isRequired,
        inputProps: PropTypes.object,
        onChange: PropTypes.func
    };

    static defaultProps = {
        elementType: 'text'
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
        return this.form.schema[this.props.fieldName]
    }

    @autobind
    getFieldOptions(fieldSchema, elementType, fieldName) {
        const options = {
            ...fieldSchema._joinedMetaData,
            required: fieldSchema._flags.presence === 'required',
            name: fieldName,
            label: fieldSchema._settings.language.label,
            key: fieldName,
            default: fieldSchema._flags ? fieldSchema._flags.default : undefined
        }

        if (fieldSchema._valids
            && fieldSchema._valids._set
            && fieldSchema._valids._set.length > 0) {
            const optionValues = fieldSchema._joinedMetaData.names || fieldSchema._valids._set
            const optionNames = fieldSchema._valids._set
            options.enums = _.zipObject(optionNames, optionValues)
            options.allowed = optionValues
        }

        switch (elementType) {
        case 'text':
            options.placeholder = fieldSchema._examples[0] || undefined
            break
        default:
            break
        }

        return options
    }

    @autobind
    validateFieldSchema(fieldSchema, elementType, fieldName) {
        if (!fieldSchema.isJoi) {
            return `${fieldName} does not match the expected format as a Joi schmea object. A ValidatedForm must be passed in a valid schema that follows the format specified in the Readme.` // eslint-disable-line max-len
        }

        if (!this.form.inputElementTypes[`${elementType}Element`]) {
            return `[JoifulReactForms Error] The requested input type of ${elementType} does not have a defined element type` // eslint-disable-line max-len
        }

        if (elementType === 'select') {
            if (!fieldSchema._valids
                || !fieldSchema._valids._set
                || !fieldSchema._valids._set.length === 0) {
                return `Warning! ${fieldName} is a select element but no 'valid' params are provided. This field will be ignored.` // eslint-disable-line max-len
            }
        }

        return null
    }

    render() {
        const { elementType } = this.props
        const fieldSchema = this.getFieldSchema()
        const fieldName = fieldSchema._joinedMetaData.name

        const fieldValidation = this.validateFieldSchema(fieldSchema, elementType, fieldName)
        if (fieldValidation) {
            return console.error(fieldValidation)
        }

        let options = this.getFieldOptions(fieldSchema, elementType, fieldName)
        // only pass through input props that aren't already in options
        const inputProps = _.pick(
            this.props.inputProps,
            _.difference(_.keys(this.props.inputProps), _.keys(options))
        )
        const optionsOverwrites = _.pick(this.props.inputProps, _.keys(options))
        // now overwrite options that are passed in as inputProps
        options = _.assign(options, optionsOverwrites)
        options.inputProps = inputProps || {}

        return createElement(this.form.inputElementTypes[`${elementType}Element`], {
            ...options,
            error: this.form.getErrors(fieldName),
            onBlur: this.form.onBlur,
            onChange: this.onChange,
            onFocus: this.form.onFocus,
            value: this.form.getValue(fieldName)
        })
    }
}
