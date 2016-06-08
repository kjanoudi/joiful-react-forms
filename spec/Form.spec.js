import { default as React } from 'react'
import { default as TestUtils } from 'react-addons-test-utils'
import { default as expect } from 'expect'
import { default as JoifulForm } from '../src/Form'

const renderer = TestUtils.createRenderer()

describe('JoifulForm', () => {
    let tree

    beforeEach(() => {
        renderer.render(<JoifulForm/>)
        tree = renderer.getRenderOutput()
    })

    it('should render', () => {
        expect(tree.type).toEqual('form')
    })
})
