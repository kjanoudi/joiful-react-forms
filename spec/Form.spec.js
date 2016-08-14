
import { default as React } from 'react'
import { default as TestUtils } from 'react-addons-test-utils'
import { default as expect, spyOn, createSpy } from 'expect'
import { default as JoifulForm } from '../src/Form'

const renderer = TestUtils.createRenderer()

describe('JoifulForm', () => {
  let tree
  const userOnSubmit = createSpy()

  beforeEach(() => {
    renderer.render(<JoifulForm onSubmit={userOnSubmit} outsideProp={123} />)
    tree = renderer.getRenderOutput()
  })

  it('should render', () => {
    expect(tree.type).toEqual('form')
  })

  it('respects outside properties', () => {
    expect(tree.props.outsideProp).toEqual(123)
  })

  it('has it\'s own onSubmit logic, wraps userOnSubmit & handles preventDefault', () => {
    expect(tree.props.onSubmit).toBeA('function')
    const event = { preventDefault: () => {} }
    const eventSpy = spyOn(event, 'preventDefault')
    tree.props.onSubmit(event)
    expect(eventSpy).toHaveBeenCalled()
    expect(userOnSubmit).toHaveBeenCalled()
  })
})
