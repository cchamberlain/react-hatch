//import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import { detectBrowser } from 'browser-detective'
import { log } from '../config'
import './style'

const validate = ({ assert, classNames, React, ReactCSSTransitionGroup }) => {
  if(!assert)
    throw new Error('react-hatch requires an assert dependency.')
  assert.ok(classNames, 'react-hatch requires classNames dependency.')
  assert.ok(React, 'react-hatch requires React dependency.')
  assert.ok(ReactCSSTransitionGroup, 'react-hatch requires ReactCSSTransitionGroup dependency.')
  return { assert, classNames, React, ReactCSSTransitionGroup }
}

export default dependencies => {
  const { assert, classNames, React, ReactCSSTransitionGroup } = dependencies

  /** @type {JSX} Required to stop autocomplete on chrome. */
  const ieVersion = getInternetExplorerVersion()

  const hatchBackgroundStyle = { backgroundColor: '#bbb' }

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

  class HatchUpper extends Component {
    componentDidMount() {
      const { username } = this.props
      if(this.username && username)
        this.username.value = username
      if(this.password)
        this.password.value = ''
    }
    render() {
      const { isModern, title, message } = this.props
      const contentStyle = { maxWidth: 800, alignSelf: 'center' }

      return (
        <div className="hatch-animate">
          <div className="hatch-inside"  style={hatchBackgroundStyle}>
            <div className="hatch-content" style={contentStyle}>
              {title ? <div className="hatch-title"><h1>{title}</h1></div> : null}
              {message ? <div className="hatch-message"><p>{message}</p></div> : null}
              {this.renderAuthorization()}
            </div>
          </div>
          <div className="hatch-edge" style={hatchBackgroundStyle} />
          {isModern ? <HatchLatch /> : null}
          <div className="hatch-empty" />
        </div>
      )
    }
    renderAuthorization = () => {
      const { hasAuthorization, errors } = this.props
      if(hasAuthorization) {
        return (
          <div className="hatch-form">
            <form onSubmit={e => this.onLoginAttempt(e)}>
              <div className="hatch-input">
                <input
                  type="text"
                  autoComplete="off"
                  name="username"
                  placeholder="Username"
                  ref={x => this.username = x}
                />
              </div>
              <div className="hatch-input">
                <input
                  type="password"
                  autoComplete="new-passwords"
                  name="password"
                  placeholder="Password"
                  ref={x => this.password = x}
                />
              </div>
              <div className="hatch-input right">
                <button className="hatch-btn" type="submit">Sign In</button>
              </div>
            </form>
            {errors ? errors.map((x, i) => <span key={i} className="hatch-error">{x.message}</span>) : null}
          </div>
        )
      }
    };

    onLoginAttempt = e => {
      if(e)
        e.preventDefault()
      let credentials = { username: this.username.value, password: this.password.value }
      this.props.onLoginAttempt(credentials)
      this.password.value = ''
    };
  }


  const HatchLower = ({ isModern, children }) => (
    <div className="hatch-animate">
      {isModern ? <HatchLatch /> : null}
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
      const { isClosed, username, transitionDuration } = this.props
      document.body.style.margin = 0
      if(isClosed) {
        if(!this.state.isAnimating)
        this.setState({ isAnimating: true })
        setTimeout(() => {
          this.setState({ isAnimating: false })
        }, transitionDuration)
      }
    }
    render() {
      let animationClasses =  { closed: this.props.isClosed === true
                              , open: this.props.isClosed === false
                              , animating: this.state.isAnimating
                              , error: this.props.errors.size > 0
                              , loading: this.props.isLoading
                              }
      let hatchStyle = { pointerEvents: this.props.isClosed ? 'auto' : 'none' }
      let hatchClass = classNames(`hatch-${this.props.theme}`, animationClasses)

      return (<div id="Hatch" className={hatchClass} style={hatchStyle}>
          <div className="hatch-upper">
            <ReactCSSTransitionGroup transitionName="hatch-upper" transitionEnterTimeout={this.props.transitionDuration} transitionLeaveTimeout={this.props.transitionDuration}>
              {this.props.isClosed ? <HatchUpper key={0} {...this.props} isAnimating={this.state.isAnimating} /> : null}
            </ReactCSSTransitionGroup>
          </div>
          <div className="hatch-lower">
            <ReactCSSTransitionGroup transitionName="hatch-lower"  transitionEnterTimeout={this.props.transitionDuration} transitionLeaveTimeout={this.props.transitionDuration}>
              {this.props.isClosed ? <HatchLower key={0} {...this.props} /> : null}
            </ReactCSSTransitionGroup>
          </div>
          {this.props.hasToggle ? <HatchToggle toggleClose={this.props.toggleClose} /> : null}
      </div>)
    }

  }


  Hatch.propTypes = { onLoginAttempt: PropTypes.func.isRequired
                    , isClosed: PropTypes.bool.isRequired
                    , hasToggle: PropTypes.bool.isRequired
                    , toggleClose: PropTypes.func
                    , hasAuthorization: PropTypes.bool.isRequired
                    , username: PropTypes.string
                    , title: PropTypes.string
                    , message: PropTypes.string
                    , errors: PropTypes.object.isRequired
                    , isLoading: PropTypes.bool.isRequired
                    , transitionDuration: PropTypes.number
                    , theme: PropTypes.oneOf(['shield', 'carbon']).isRequired
                    , isModern: PropTypes.bool
                    }
  Hatch.defaultProps =  { hasToggle: false
                        , showLogin: false
                        , hasAuthorization: true
                        , title: 'Locked'
                        , transitionDuration: 2000
                        , theme: 'carbon'
                        , isLoading: false
                        , isModern: ieVersion === -1 || ieVersion > 11
                        }


  // Returns the version of Internet Explorer or a -1
  // (indicating the use of another browser).
  function getInternetExplorerVersion() {
    var rv = -1 // Return value assumes failure.
    if(!(window.ActiveXObject) && 'ActiveXObject' in window)
      return 11
    if (navigator.appName == 'Microsoft Internet Explorer') {
      var ua = navigator.userAgent
      var re  = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})')
      if (re.exec(ua) != null)
        rv = parseFloat( RegExp.$1 )
    }
    return rv
  }


  return Hatch
}
