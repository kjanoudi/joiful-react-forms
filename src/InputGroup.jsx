import React, { Component, PropTypes } from 'react'
import Joi from 'joi'
import _ from 'lodash'
import autobind from 'autobind-decorator'

export default class InputGroup extends Component {

    static contextTypes = {
        form: PropTypes.object.isRequired
    };

    static propTypes = {
        onChange: PropTypes.func,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func
    };

    @autobind
    getFieldSchemas(){
        let fields
        
        // if no tag is passed as prop, display the entire form
        if(this.context.schema == null) {
            return <div></div>
        }
        if(this.props.tag === undefined) {
            return _.values(this.context.schema)
        } 
        else if(this.props.tag) {
            fields = _.values(this.context.schema).filter((field) => {
                return field._tags.indexOf(this.props.tag) !== -1;
            })
        }
        return fields
    }
    
    @autobind
    onChange(e) {
        if(e.preventDefault) {
            e.preventDefault();
        }

        if(this.context.onChange) {
            var obj = {}
            obj[e.target.name] = e.target.value
            this.context.onChange(e, obj);
        }
    }
    
    @autobind
    onFocus(e) {
        if(this.context.onFocus) {
            context.onFocus(e);
        }
    }
    
    @autobind
    onBlur(e) {
        if(this.context.onBlur) {
            context.onBlur(e);
        }
    }

    constructor(props){
        super(props)
        this.form = this.context.form
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
        
        if(!this.context[`${elementType}Element`]) {
            return `[JoifulReactForms Error] The requested input type of ${elementType} does not have a defined element type`
        }

        if(elementType === 'select') {
            if(!fieldSchema._valids || !fieldSchema._valids._set || !fieldSchema._valids._set.length === 0) {
                return `Warning! ${fieldName} is a select component but no 'valid' params are provided. This field will be ignored.`
            }
        }
    }

    render() {
        const fields = this.getFieldSchemas()   

        return (
            <div>
                {_.values(fields).map((fieldSchema) => {
                    const elementType = fieldSchema._joinedMetaData.elementType || 'text'
                    const fieldName = fieldSchema._joinedMetaData.name

                    let fieldValidation = this.validateFieldSchema(fieldSchema, elementType, fieldName)
                    if(fieldValidation){
                        return console.error(fieldValidation)
                    }
                    
                    let options = this.getFieldOptions(fieldSchema, elementType, fieldName)

                    return this.context[`${elementType}Element`](this.context.getErrors(fieldName), this.context.getValue(fieldName), options, {
                        onChange: this.onChange,
                        onFocus: this.onFocus,
                        onBlur: this.onBlur
                    })
                })}
            </div>
        );
    }
}