import React, { Component, PropTypes } from 'react'
import Joi from 'joi'
import _ from 'lodash'
import autobind from 'autobind-decorator'

export default class InputElement extends Component {

    static contextTypes = {
        form: PropTypes.object.isRequired
    };

    static propTypes = {
        fieldName: PropTypes.string.isRequired,
        elementType: PropTypes.string.isRequired,
        onChange: PropTypes.func,
        inputProps: PropTypes.object
    };

    static defaultProps = {
        elementType: 'text'
    };

    @autobind
    getFieldSchema(){
        this.form = this.form || this.context.form
        if(this.form.schema == null) {
            return null
        }
        return this.form.schema[this.props.fieldName]
    }
    
    @autobind
    onChange(e) {
        if(e.preventDefault) {
            e.preventDefault()
        }
        if(this.props.onChange) {
            this.props.onChange(e)
        }
        if(this.form.onChange) {
            var obj = {}
            obj[e.target.name] = e.target.value
            this.form.onChange(e, obj)
        }
    }

    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps, nextContext){
        this.form = nextContext.form
    }

    @autobind
    getFieldOptions(fieldSchema, elementType, fieldName){       
        var options = {
            ...fieldSchema._joinedMetaData,
            required: fieldSchema._flags.presence === 'required',
            name: fieldName,
            label: fieldSchema._settings.language.label,
            key: fieldName,
            default: fieldSchema._flags ? fieldSchema._flags.default : undefined
        };

        if(fieldSchema._valids && fieldSchema._valids._set && fieldSchema._valids._set.length > 0) {
            let optionValues = fieldSchema._joinedMetaData.names || fieldSchema._valids._set
            let optionNames = fieldSchema._valids._set
            options.enums = _.zipObject(optionNames, optionValues)
            options.allowed = optionValues
        }

        switch(elementType) {
            case 'text':
                options.placeholder = fieldSchema._examples[0] || undefined
            break
        }

        return options
    }

    @autobind
    validateFieldSchema(fieldSchema, elementType, fieldName){ 
        if(!fieldSchema.isJoi) {
            return `${fieldName} does not match the expected format as a Joi schmea object. A ValidatedForm must be passed in a valid schema that follows the format specified in the Readme.`
        }
        
        if(!this.form.inputElementTypes[`${elementType}Element`]) {
            return `[JoifulReactForms Error] The requested input type of ${elementType} does not have a defined element type`
        }

        if(elementType === 'select') {
            if(!fieldSchema._valids || !fieldSchema._valids._set || !fieldSchema._valids._set.length === 0) {
                return `Warning! ${fieldName} is a select element but no 'valid' params are provided. This field will be ignored.`
            }
        }
    }

    render() {
        const fieldSchema = this.getFieldSchema()  
        const elementType = this.props.elementType
        const fieldName = fieldSchema._joinedMetaData.name

        let fieldValidation = this.validateFieldSchema(fieldSchema, elementType, fieldName)
        if(fieldValidation){
            return console.error(fieldValidation)
        }
        
        let options = this.getFieldOptions(fieldSchema, elementType, fieldName) 
        //only pass through input props that aren't already in options
        let inputProps = _.pick(this.props.inputProps, _.difference(_.keys(this.props.inputProps), _.keys(options)))
        let optionsOverwrites = _.pick(this.props.inputProps, _.keys(options))
        //now overwrite options that are passed in as inputProps
        options = _.assign(options, optionsOverwrites)
        options.inputProps = inputProps || {}

        return this.form.inputElementTypes[`${elementType}Element`](this.form.getErrors(fieldName), this.form.getValue(fieldName), options, {
            onChange: this.onChange,
            onFocus: this.form.onFocus,
            onBlur: this.form.onBlur
        })
    }
}