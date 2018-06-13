import { log } from '../config'
import PropTypes from 'prop-types'

const validate = ({ assert, classNames, React, ReactCSSTransitionGroup }) => {
  if(!assert)
    throw new Error('react-hatch requires an assert dependency.')
  assert.ok(classNames, 'react-hatch requires classNames dependency.')
  assert.ok(React, 'react-hatch requires React dependency.')
  assert.ok(ReactCSSTransitionGroup, 'react-hatch requires ReactCSSTransitionGroup dependency.')
  return { assert, classNames, React, ReactCSSTransitionGroup }
}

export default deps => {
  const { assert, classNames, React, ReactCSSTransitionGroup } = deps
  const { Component } = React

  const hatchBackgroundStyle = { backgroundColor: '#bbb' }
  const contentStyle = { maxWidth: 800, minHeight: 270, alignSelf: 'center' }

  const HatchLatch = props => (
    <span>
      <div className="hatch-latch" />
      <div className="hatch-latch hatch-latch-glow" />
      <div className="hatch-latch hatch-latch-error" />
      <div className="hatch-latch hatch-latch-success" />
      <div className="hatch-latch hatch-latch-loading" />
    </span>
  )

  const HatchToggle = props => (
    <div className="flex flex-center">
      <button id="HatchToggle" className="btn btn-danger" onClick={props.toggleClose}>
        Hatch
      </button>
    </div>
  )

  const HatchUpper = ({ title, message, children }) => (
    <div className="hatch-animate">
      <div className="hatch-inside"  style={hatchBackgroundStyle}>
        <div className="hatch-content" style={contentStyle}>
          {/*title ? <div className="hatch-title"><h1>{title}</h1></div> : null}
          {message ? <div className="hatch-message"><p>{message}</p></div> : null*/}
          {children}
        </div>
      </div>
      <div className="hatch-edge" style={hatchBackgroundStyle} />
      <HatchLatch />
      <div className="hatch-empty" />
    </div>
  )

  const HatchLower = ({ children }) => (
    <div className="hatch-animate">
      <HatchLatch />
      <div className="hatch-edge" style={hatchBackgroundStyle}/>
      <div className="hatch-inside" style={hatchBackgroundStyle}>{children}</div>
    </div>
  )

  class Hatch extends Component {
    constructor(props) {
      super(props)
      this.state =  { isAnimating: false }
    }
    componentWillReceiveProps(nextProps) {
      const { isClosed, transitionDuration } = this.props
      if(isClosed !== nextProps.isClosed) {
        if(!this.state.isAnimating)
          this.setState({ isAnimating: true })
        setTimeout(() => {
          this.setState({ isAnimating: false })
        }, transitionDuration)
      } else if(this.state.isAnimating)
          this.setState({ isAnimating: false })
    }
    componentDidMount() {
      require('./style')
      const { isClosed, transitionDuration } = this.props
      if(isClosed) {
        if(!this.state.isAnimating)
        this.setState({ isAnimating: true })
        setTimeout(() => {
          this.setState({ isAnimating: false })
        }, transitionDuration)
      }
    }
    render() {
      const { footer, transitionDuration, toggleClose } = this.props
      const { isAnimating } = this.state
      let animationClasses =  { closed: this.props.isClosed === true
                              , open: this.props.isClosed === false
                              , animating: isAnimating
                              , loading: this.props.isLoading
                              }
      let hatchStyle = { pointerEvents: this.props.isClosed ? 'auto' : 'none' }
      let hatchClass = classNames(`hatch-${this.props.theme}`, animationClasses)

      return (<div id="Hatch" className={hatchClass} style={hatchStyle}>
          <div className="hatch-upper">
            <ReactCSSTransitionGroup transitionName="hatch-upper" transitionEnterTimeout={transitionDuration} transitionLeaveTimeout={this.props.transitionDuration}>
              {this.props.isClosed ? <HatchUpper key={0} {...this.props} isAnimating={isAnimating} /> : null}
            </ReactCSSTransitionGroup>
          </div>
          <div className="hatch-lower">
            <ReactCSSTransitionGroup transitionName="hatch-lower"  transitionEnterTimeout={transitionDuration} transitionLeaveTimeout={this.props.transitionDuration}>
              {this.props.isClosed ? <HatchLower key={0} children={footer} /> : null}
            </ReactCSSTransitionGroup>
          </div>
          {this.props.hasToggle ? <HatchToggle toggleClose={toggleClose} /> : null}
      </div>)
    }
  }


  Hatch.propTypes = { isClosed: PropTypes.bool.isRequired
                    , hasToggle: PropTypes.bool.isRequired
                    , toggleClose: PropTypes.func
                    , title: PropTypes.string
                    , message: PropTypes.string
                    , isLoading: PropTypes.bool.isRequired
                    , transitionDuration: PropTypes.number
                    , theme: PropTypes.oneOf(['shield', 'carbon']).isRequired
                    }
  Hatch.defaultProps =  { hasToggle: false
                        , showLogin: false
                        , title: 'Locked'
                        , transitionDuration: 2000
                        , theme: 'carbon'
                        , isLoading: false
                        }
  return Hatch
}
