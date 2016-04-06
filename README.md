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
            email: Joi.string().required().label('Email'),
            phone: Joi.string().label('Phone')
        }}
    >
        <JoifulInput name="name"/>
        <JoifulInput name="email"/>
        <JoifulInput name="phone"/>
    </JoifulForm>

export MyValidatedForm

```
