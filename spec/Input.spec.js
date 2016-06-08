import { default as React } from 'react'
import { default as TestUtils } from 'react-addons-test-utils'
import { default as expect } from 'expect'
import { default as JoifulInput } from '../src/Input'

const renderer = TestUtils.createRenderer()

describe('JoifulInput', () => {
    let tree

    beforeEach(() => {
        renderer.render(<JoifulInput/>)
        tree = renderer.getRenderOutput()
    })

    it('should render', () => {
        expect(tree.type).toEqual('input')
    })
})
