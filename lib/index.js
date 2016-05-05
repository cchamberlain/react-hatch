'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _browserDetective = require('browser-detective');

var _config = require('../config');

require('./style');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'


var validate = function validate(_ref) {
  var assert = _ref.assert;
  var classNames = _ref.classNames;
  var React = _ref.React;
  var ReactCSSTransitionGroup = _ref.ReactCSSTransitionGroup;

  if (!assert) throw new Error('react-hatch requires an assert dependency.');
  assert.ok(classNames, 'react-hatch requires classNames dependency.');
  assert.ok(React, 'react-hatch requires React dependency.');
  assert.ok(ReactCSSTransitionGroup, 'react-hatch requires ReactCSSTransitionGroup dependency.');
  return { assert: assert, classNames: classNames, React: React, ReactCSSTransitionGroup: ReactCSSTransitionGroup };
};

exports.default = function (dependencies) {
  var assert = dependencies.assert;
  var classNames = dependencies.classNames;
  var React = dependencies.React;
  var ReactCSSTransitionGroup = dependencies.ReactCSSTransitionGroup;

  /** @type {JSX} Required to stop autocomplete on chrome. */

  var ieVersion = getInternetExplorerVersion();

  var hatchBackgroundStyle = { backgroundColor: '#bbb' };

  var HatchLatch = function HatchLatch(props) {
    return React.createElement(
      'span',
      null,
      React.createElement('div', { className: 'hatch-latch' }),
      React.createElement('div', { className: 'hatch-latch hatch-latch-glow' }),
      React.createElement('div', { className: 'hatch-latch hatch-latch-error' }),
      React.createElement('div', { className: 'hatch-latch hatch-latch-success' }),
      React.createElement('div', { className: 'hatch-latch hatch-latch-loading' })
    );
  };

  var HatchToggle = function HatchToggle(props) {
    return React.createElement(
      'div',
      { className: 'flex flex-center' },
      React.createElement(
        'button',
        { id: 'HatchToggle', className: 'btn btn-danger', onClick: props.toggleClose },
        'Hatch'
      )
    );
  };

  var HatchUpper = function (_Component) {
    _inherits(HatchUpper, _Component);

    function HatchUpper() {
      var _Object$getPrototypeO;

      var _temp, _this, _ret;

      _classCallCheck(this, HatchUpper);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(HatchUpper)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.renderAuthorization = function () {
        var _this$props = _this.props;
        var hasAuthorization = _this$props.hasAuthorization;
        var errors = _this$props.errors;

        if (hasAuthorization) {
          return React.createElement(
            'div',
            { className: 'hatch-form' },
            React.createElement(
              'form',
              { onSubmit: function onSubmit(e) {
                  return _this.onLoginAttempt(e);
                } },
              React.createElement(
                'div',
                { className: 'hatch-input' },
                React.createElement('input', {
                  type: 'text',
                  autoComplete: 'off',
                  name: 'username',
                  placeholder: 'Username',
                  ref: function ref(x) {
                    return _this.username = x;
                  }
                })
              ),
              React.createElement(
                'div',
                { className: 'hatch-input' },
                React.createElement('input', {
                  type: 'password',
                  autoComplete: 'new-passwords',
                  name: 'password',
                  placeholder: 'Password',
                  ref: function ref(x) {
                    return _this.password = x;
                  }
                })
              ),
              React.createElement(
                'div',
                { className: 'hatch-input right' },
                React.createElement(
                  'button',
                  { className: 'hatch-btn', type: 'submit' },
                  'Sign In'
                )
              )
            ),
            errors ? errors.map(function (x, i) {
              return React.createElement(
                'span',
                { key: i, className: 'hatch-error' },
                x.message
              );
            }) : null
          );
        }
      }, _this.onLoginAttempt = function (e) {
        if (e) e.preventDefault();
        var credentials = { username: _this.username.value, password: _this.password.value };
        _this.props.onLoginAttempt(credentials);
        _this.password.value = '';
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(HatchUpper, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var username = this.props.username;

        if (this.username && username) this.username.value = username;
        if (this.password) this.password.value = '';
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props;
        var isModern = _props.isModern;
        var title = _props.title;
        var message = _props.message;

        var contentStyle = { maxWidth: 800, alignSelf: 'center' };

        return React.createElement(
          'div',
          { className: 'hatch-animate' },
          React.createElement(
            'div',
            { className: 'hatch-inside', style: hatchBackgroundStyle },
            React.createElement(
              'div',
              { className: 'hatch-content', style: contentStyle },
              title ? React.createElement(
                'div',
                { className: 'hatch-title' },
                React.createElement(
                  'h1',
                  null,
                  title
                )
              ) : null,
              message ? React.createElement(
                'div',
                { className: 'hatch-message' },
                React.createElement(
                  'p',
                  null,
                  message
                )
              ) : null,
              this.renderAuthorization()
            )
          ),
          React.createElement('div', { className: 'hatch-edge', style: hatchBackgroundStyle }),
          isModern ? React.createElement(HatchLatch, null) : null,
          React.createElement('div', { className: 'hatch-empty' })
        );
      }
    }]);

    return HatchUpper;
  }(Component);

  var HatchLower = function HatchLower(_ref2) {
    var isModern = _ref2.isModern;
    var children = _ref2.children;
    return React.createElement(
      'div',
      { className: 'hatch-animate' },
      isModern ? React.createElement(HatchLatch, null) : null,
      React.createElement('div', { className: 'hatch-edge', style: hatchBackgroundStyle }),
      React.createElement(
        'div',
        { className: 'hatch-inside', style: hatchBackgroundStyle },
        children
      )
    );
  };

  var Hatch = function (_Component2) {
    _inherits(Hatch, _Component2);

    function Hatch(props) {
      _classCallCheck(this, Hatch);

      var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Hatch).call(this, props));

      _this2.state = { isAnimating: false };
      return _this2;
    }

    _createClass(Hatch, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var _this3 = this;

        var _props2 = this.props;
        var isClosed = _props2.isClosed;
        var transitionDuration = _props2.transitionDuration;

        if (isClosed !== nextProps.isClosed) {
          if (!this.state.isAnimating) this.setState({ isAnimating: true });
          setTimeout(function () {
            _this3.setState({ isAnimating: false });
          }, transitionDuration);
        } else if (this.state.isAnimating) this.setState({ isAnimating: false });
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this4 = this;

        var _props3 = this.props;
        var isClosed = _props3.isClosed;
        var username = _props3.username;
        var transitionDuration = _props3.transitionDuration;

        document.body.style.margin = 0;
        if (isClosed) {
          if (!this.state.isAnimating) this.setState({ isAnimating: true });
          setTimeout(function () {
            _this4.setState({ isAnimating: false });
          }, transitionDuration);
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var animationClasses = { closed: this.props.isClosed === true,
          open: this.props.isClosed === false,
          animating: this.state.isAnimating,
          error: this.props.errors.size > 0,
          loading: this.props.isLoading
        };
        var hatchStyle = { pointerEvents: this.props.isClosed ? 'auto' : 'none' };
        var hatchClass = classNames('hatch-' + this.props.theme, animationClasses);

        return React.createElement(
          'div',
          { id: 'Hatch', className: hatchClass, style: hatchStyle },
          React.createElement(
            'div',
            { className: 'hatch-upper' },
            React.createElement(
              ReactCSSTransitionGroup,
              { transitionName: 'hatch-upper', transitionEnterTimeout: this.props.transitionDuration, transitionLeaveTimeout: this.props.transitionDuration },
              this.props.isClosed ? React.createElement(HatchUpper, _extends({ key: 0 }, this.props, { isAnimating: this.state.isAnimating })) : null
            )
          ),
          React.createElement(
            'div',
            { className: 'hatch-lower' },
            React.createElement(
              ReactCSSTransitionGroup,
              { transitionName: 'hatch-lower', transitionEnterTimeout: this.props.transitionDuration, transitionLeaveTimeout: this.props.transitionDuration },
              this.props.isClosed ? React.createElement(HatchLower, _extends({ key: 0 }, this.props)) : null
            )
          ),
          this.props.hasToggle ? React.createElement(HatchToggle, { toggleClose: this.props.toggleClose }) : null
        );
      }
    }]);

    return Hatch;
  }(Component);

  Hatch.propTypes = { onLoginAttempt: PropTypes.func.isRequired,
    isClosed: PropTypes.bool.isRequired,
    hasToggle: PropTypes.bool.isRequired,
    toggleClose: PropTypes.func,
    hasAuthorization: PropTypes.bool.isRequired,
    username: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    errors: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    transitionDuration: PropTypes.number,
    theme: PropTypes.oneOf(['shield', 'carbon']).isRequired,
    isModern: PropTypes.bool
  };
  Hatch.defaultProps = { hasToggle: false,
    showLogin: false,
    hasAuthorization: true,
    title: 'Locked',
    transitionDuration: 2000,
    theme: 'carbon',
    isLoading: false,
    isModern: ieVersion === -1 || ieVersion > 11
  };

  // Returns the version of Internet Explorer or a -1
  // (indicating the use of another browser).
  function getInternetExplorerVersion() {
    var rv = -1; // Return value assumes failure.
    if (!window.ActiveXObject && 'ActiveXObject' in window) return 11;
    if (navigator.appName == 'Microsoft Internet Explorer') {
      var ua = navigator.userAgent;
      var re = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})');
      if (re.exec(ua) != null) rv = parseFloat(RegExp.$1);
    }
    return rv;
  }

  return Hatch;
};
