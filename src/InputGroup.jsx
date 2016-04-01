import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import autobind from 'autobind-decorator'

export default class InputGroup extends Component {

    static contextTypes = {
        form: PropTypes.object.isRequired
    };

    static propTypes = {
        inputProps: PropTypes.object
    };

    @autobind
    getFieldSchemas(){
        this.form = this.form || this.context.form
        if(this.form.schema == null) {
            return []
        }
        // if no tag is passed as prop, display the entire form
        if(this.props.tag === undefined) {
            return _.values(this.form.schema)
        } 
        if(this.props.tag) {
            return _.values(this.form.schema).filter((field) => {
                return field._tags.indexOf(this.props.tag) !== -1;
            })
        }
    }
    
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps, nextContext){
        this.form = nextContext.form
    }

    render() {
        return (
            <div>
                {_.values(this.getFieldSchemas()).map((fieldSchema) => {
                    let elementType = fieldSchema._joinedMetaData.elementType || 'text'
                    return 
                        <InputElement fieldName={fieldSchema._joinedMetaData.name}
                            elementType={elementType}
                        />
                })}
            </div>
        )
    }
}