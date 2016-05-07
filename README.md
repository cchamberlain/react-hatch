# [react-hatch](https://npmjs.com/packages/react-hatch)

[![NPM](https://nodei.co/npm/react-hatch.png?stars=true&downloads=true)](https://nodei.co/npm/react-hatch/)

React overlay component for transitions and lock screens.

`npm i -S react-hatch`


**This project is working but its interface may change rapidly prior to version 1.0.**


### What's it do?

Exports a component that can be used in lock screens or page transitions.


### Usage

```js
/** Import reactHatch factory */
import reactHatch from 'react-hatch'

import React from 'react'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import classNames from 'classnames'
import { assert } from 'chai'

/** Translate the factory to a Hatch, ensures you don't accidentally bundle two versions of popular libraries. */
const Hatch = reactHatch({ React, ReactCSSTransitionGroup, classNames, assert })

/** Wrap Hatch with one of your components to control when it opens and shuts. */
export default class MyComponent extends Component (
  constructor(props) {
    super(props)
    this.state = { isClosed: false }
  }
  render() {
    return (
      <Hatch 
          isClosed={this.state.isClosed}
          theme="carbon"
          title={`the hatch is ${this.state.isClosed ? 'closed' : 'open'}`}
          message="This is the hatch, forms and other things can be my children."
      />
    )
  }
  componentDidMount() {
    window.setInterval(() => this.setState({ isClosed: !this.state.isClosed }), 2000)
  }
)
```

### PropTypes and DefaultProps


```js
Hatch.propTypes = { isClosed: PropTypes.bool.isRequired
                  , hasToggle: PropTypes.bool.isRequired
                  , toggleClose: PropTypes.func
                  , hasAuthorization: PropTypes.bool.isRequired
                  , title: PropTypes.string
                  , message: PropTypes.string
                  , errors: PropTypes.object.isRequired
                  , isLoading: PropTypes.bool.isRequired
                  , transitionDuration: PropTypes.number
                  , theme: PropTypes.oneOf(['shield', 'carbon']).isRequired
                  }
```

```js
Hatch.defaultProps =  { hasToggle: false
                      , showLogin: false
                      , hasAuthorization: true
                      , title: 'Locked'
                      , transitionDuration: 2000
                      , theme: 'carbon'
                      , isLoading: false
                      , isModern: ieVersion === -1 || ieVersion > 11
                      }
 ```
