# Joiful React Forms

## Installation
`npm i joiful-react-forms`

## Basic Usage
```
import Joi from 'joi'
import { JoifulForm, JoifulInput } from 'joiful-react-forms'

const MyValidatedForm = () =>
    <JoifulForm
        onSubmit={handleSubmit}
        schema={{
            name: Joi.string().required().label('Name'),
            email: Joi.string().email().required().label('Email'),
            phone: Joi.string().min(10).max(12).label('Phone')
        }}
    >
        <JoifulInput name="name"/>
        <JoifulInput name="email"/>
        <JoifulInput name="phone"/>
    </JoifulForm>

export MyValidatedForm

```

## Advanced Usage

### Try it with your own inputs
```
import Joi from 'joi'
import { JoifulForm, JoifulInput } from 'joiful-react-forms'

const MyTextInput = ({ error, ...props }) =>
    <div>
        <input {...props}/>
        {error}
    </div>


const FormUsingMyInputs = () =>
    <JoifulForm
        elementTypes={{
            text: MyTextInput,
            select: ...,
            textarea: ...
        }}
        onSubmit={handleSubmit}
        schema={{
            name: Joi.string().required().label('Name'),
            email: Joi.string().email().required().label('Email'),
            phone: Joi.string().min(10).max(12).label('Phone')
        }}
    >
        <JoifulInput
            is="text"
            name="name"
        />
        <JoifulInput name="email"/>
        <JoifulInput name="phone"/>
    </JoifulForm>

export FormUsingMyInputs

```
