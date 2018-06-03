var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get2 = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PNotify = window.PNotify;

// Translate v3 options to v4 options.
var translateOptions = function translateOptions(options, module, moduleName) {
  // Merge the classic default options.
  var newOptions = module ? _extends({}, moduleName ? PNotifyCompat.prototype.options[moduleName] : {}, options) : _extends({}, PNotifyCompat.prototype.options, options);
  var translateName = function translateName(badName) {
    var goodName = badName;
    var underscoreIndex = void 0;
    while ((underscoreIndex = goodName.indexOf('_')) !== -1) {
      goodName = goodName.slice(0, underscoreIndex) + goodName.slice(underscoreIndex + 1, underscoreIndex + 2).toUpperCase() + goodName.slice(underscoreIndex + 2);
    }
    return goodName;
  };

  // Translate all options to the new style.
  for (var name in newOptions) {
    if (newOptions.hasOwnProperty(name) && name.indexOf('_') !== -1) {
      var goodName = translateName(name);
      newOptions[goodName] = newOptions[name];
      delete newOptions[name];
    }
  }

  if (!module) {
    // Options that have changed.
    if (newOptions.hasOwnProperty('addclass')) {
      newOptions.addClass = newOptions.addclass;
      delete newOptions.addclass;
    }
    if (newOptions.hasOwnProperty('cornerclass')) {
      newOptions.cornerClass = newOptions.cornerclass;
      delete newOptions.cornerClass;
    }
    if (newOptions.hasOwnProperty('textEscape')) {
      newOptions.textTrusted = !newOptions.textEscape;
      delete newOptions.textEscape;
    }
    if (newOptions.hasOwnProperty('titleEscape')) {
      newOptions.titleTrusted = !newOptions.titleEscape;
      delete newOptions.titleEscape;
    }

    // Styling and icons.
    if (newOptions.hasOwnProperty('styling')) {
      if (newOptions.styling === 'bootstrap3') {
        newOptions.icons = 'bootstrap3';
      } else if (newOptions.styling === 'fontawesome') {
        newOptions.styling = 'bootstrap3';
        newOptions.icons = 'fontawesome4';
      }
    }

    // Stacks.
    if (newOptions.hasOwnProperty('stack')) {
      if (newOptions.stack.overlay_close) {
        newOptions.stack.overlayClose = newOptions.stack.overlay_close;
      }
    }

    // Translate module options.
    newOptions.modules = {};
    if (newOptions.hasOwnProperty('animate')) {
      newOptions.modules.Animate = translateOptions(newOptions.animate, true, 'animate');
      delete newOptions.animate;
    }
    if (newOptions.hasOwnProperty('buttons')) {
      newOptions.modules.Buttons = translateOptions(newOptions.buttons, true, 'buttons');
      delete newOptions.buttons;
      if (newOptions.modules.Buttons.classes) {
        newOptions.modules.Buttons.classes = translateOptions(newOptions.modules.Buttons.classes, true);
      }
    }
    if (newOptions.hasOwnProperty('confirm')) {
      newOptions.modules.Confirm = translateOptions(newOptions.confirm, true, 'confirm');
      if (newOptions.modules.Confirm.promptDefault) {
        newOptions.modules.Confirm.promptValue = newOptions.modules.Confirm.promptDefault;
        delete newOptions.modules.Confirm.promptDefault;
      }
      delete newOptions.confirm;
    }
    if (newOptions.hasOwnProperty('desktop')) {
      newOptions.modules.Desktop = translateOptions(newOptions.desktop, true, 'desktop');
      delete newOptions.desktop;
    }
    if (newOptions.hasOwnProperty('history')) {
      newOptions.modules.History = translateOptions(newOptions.history, true, 'history');
      delete newOptions.history;
    }
    if (newOptions.hasOwnProperty('mobile')) {
      newOptions.modules.Mobile = translateOptions(newOptions.mobile, true, 'mobile');
      delete newOptions.mobile;
    }
    if (newOptions.hasOwnProperty('nonblock')) {
      newOptions.modules.NonBlock = translateOptions(newOptions.nonblock, true, 'nonblock');
      delete newOptions.nonblock;
    }
    if (newOptions.hasOwnProperty('reference')) {
      newOptions.modules.Reference = translateOptions(newOptions.reference, true, 'reference');
      delete newOptions.reference;
    }
    if (newOptions.hasOwnProperty('beforeInit')) {
      if (!newOptions.modules.Callbacks) {
        newOptions.modules.Callbacks = {};
      }
      newOptions.modules.Callbacks.beforeInit = newOptions.beforeInit;
      delete newOptions.beforeInit;
    }
    if (newOptions.hasOwnProperty('afterInit')) {
      if (!newOptions.modules.Callbacks) {
        newOptions.modules.Callbacks = {};
      }
      newOptions.modules.Callbacks.afterInit = newOptions.afterInit;
      delete newOptions.afterInit;
    }
    if (newOptions.hasOwnProperty('beforeOpen')) {
      if (!newOptions.modules.Callbacks) {
        newOptions.modules.Callbacks = {};
      }
      newOptions.modules.Callbacks.beforeOpen = newOptions.beforeOpen;
      delete newOptions.beforeOpen;
    }
    if (newOptions.hasOwnProperty('afterOpen')) {
      if (!newOptions.modules.Callbacks) {
        newOptions.modules.Callbacks = {};
      }
      newOptions.modules.Callbacks.afterOpen = newOptions.afterOpen;
      delete newOptions.afterOpen;
    }
    if (newOptions.hasOwnProperty('beforeClose')) {
      if (!newOptions.modules.Callbacks) {
        newOptions.modules.Callbacks = {};
      }
      newOptions.modules.Callbacks.beforeClose = newOptions.beforeClose;
      delete newOptions.beforeClose;
    }
    if (newOptions.hasOwnProperty('afterClose')) {
      if (!newOptions.modules.Callbacks) {
        newOptions.modules.Callbacks = {};
      }
      newOptions.modules.Callbacks.afterClose = newOptions.afterClose;
      delete newOptions.afterClose;
    }
  }

  return newOptions;
};

// The compatibility class.

var PNotifyCompat = function (_PNotify) {
  _inherits(PNotifyCompat, _PNotify);

  function PNotifyCompat(options) {
    _classCallCheck(this, PNotifyCompat);

    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
      options = { 'text': options };
    }

    // These need to be called directly, since we're not using PNotify.alert().
    if (PNotify.modules.Callbacks && options.before_init) {
      options.before_init(options);
    }

    options = translateOptions(options);

    // Override the get function to return the element like it did in v3.
    var _this = _possibleConstructorReturn(this, (PNotifyCompat.__proto__ || Object.getPrototypeOf(PNotifyCompat)).call(this, { target: document.body, data: options }));

    var _get = _this.get;
    _this.get = function (option) {
      if (option === undefined) {
        return _extends(window.jQuery ? window.jQuery(this.refs.elem) : this.refs.elem, _get.call(this));
      }
      return _get.call(this, option);
    };

    // Confirm module events.
    _this.on('pnotify.confirm', function (e) {
      if (window.jQuery) {
        window.jQuery(_this.refs.elem).trigger('pnotify.confirm', [_this, e.value]);
      }
    });
    _this.on('pnotify.cancel', function (e) {
      if (window.jQuery) {
        window.jQuery(_this.refs.elem).trigger('pnotify.cancel', _this);
      }
    });

    if (PNotify.modules.Callbacks) {
      PNotify.modules.Callbacks.getCallbacks(_this, null, 'afterInit')(_this);
    }
    return _this;
  }

  _createClass(PNotifyCompat, [{
    key: 'update',
    value: function update(options) {
      options = translateOptions(options);
      return _get2(PNotifyCompat.prototype.__proto__ || Object.getPrototypeOf(PNotifyCompat.prototype), 'update', this).call(this, options);
    }
  }]);

  return PNotifyCompat;
}(PNotify);

// Lets you change defaults the old way.


PNotifyCompat.prototype.options = {
  text_escape: false,
  title_escape: false
};

// Forward static functions.
PNotifyCompat.reload = function () {
  return PNotifyCompat;
};
PNotifyCompat.removeAll = function () {
  return PNotify.removeAll();
};
PNotifyCompat.removeStack = function (stack) {
  return PNotify.removeStack(stack);
};
PNotifyCompat.positionAll = function (animate) {
  return PNotify.positionAll(animate);
};

// Desktop module permission method.
PNotifyCompat.desktop = {
  permission: function permission() {
    PNotify.modules.Desktop.permission();
  }
};

// Old style showLast() in History module.
if (window.jQuery) {
  window.jQuery(function () {
    window.jQuery(document.body).on('pnotify.history-last', function () {
      PNotify.modules.History.showLast();
    });
  });
}

window.PNotifyCompat = PNotifyCompat;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBOb3RpZnlDb21wYXQuanMiXSwibmFtZXMiOlsiUE5vdGlmeSIsIndpbmRvdyIsInRyYW5zbGF0ZU9wdGlvbnMiLCJvcHRpb25zIiwibW9kdWxlIiwibW9kdWxlTmFtZSIsIm5ld09wdGlvbnMiLCJQTm90aWZ5Q29tcGF0IiwicHJvdG90eXBlIiwidHJhbnNsYXRlTmFtZSIsImJhZE5hbWUiLCJnb29kTmFtZSIsInVuZGVyc2NvcmVJbmRleCIsImluZGV4T2YiLCJzbGljZSIsInRvVXBwZXJDYXNlIiwibmFtZSIsImhhc093blByb3BlcnR5IiwiYWRkQ2xhc3MiLCJhZGRjbGFzcyIsImNvcm5lckNsYXNzIiwiY29ybmVyY2xhc3MiLCJ0ZXh0VHJ1c3RlZCIsInRleHRFc2NhcGUiLCJ0aXRsZVRydXN0ZWQiLCJ0aXRsZUVzY2FwZSIsInN0eWxpbmciLCJpY29ucyIsInN0YWNrIiwib3ZlcmxheV9jbG9zZSIsIm92ZXJsYXlDbG9zZSIsIm1vZHVsZXMiLCJBbmltYXRlIiwiYW5pbWF0ZSIsIkJ1dHRvbnMiLCJidXR0b25zIiwiY2xhc3NlcyIsIkNvbmZpcm0iLCJjb25maXJtIiwicHJvbXB0RGVmYXVsdCIsInByb21wdFZhbHVlIiwiRGVza3RvcCIsImRlc2t0b3AiLCJIaXN0b3J5IiwiaGlzdG9yeSIsIk1vYmlsZSIsIm1vYmlsZSIsIk5vbkJsb2NrIiwibm9uYmxvY2siLCJSZWZlcmVuY2UiLCJyZWZlcmVuY2UiLCJDYWxsYmFja3MiLCJiZWZvcmVJbml0IiwiYWZ0ZXJJbml0IiwiYmVmb3JlT3BlbiIsImFmdGVyT3BlbiIsImJlZm9yZUNsb3NlIiwiYWZ0ZXJDbG9zZSIsImJlZm9yZV9pbml0IiwidGFyZ2V0IiwiZG9jdW1lbnQiLCJib2R5IiwiZGF0YSIsIl9nZXQiLCJnZXQiLCJvcHRpb24iLCJ1bmRlZmluZWQiLCJqUXVlcnkiLCJyZWZzIiwiZWxlbSIsImNhbGwiLCJvbiIsImUiLCJ0cmlnZ2VyIiwidmFsdWUiLCJnZXRDYWxsYmFja3MiLCJ0ZXh0X2VzY2FwZSIsInRpdGxlX2VzY2FwZSIsInJlbG9hZCIsInJlbW92ZUFsbCIsInJlbW92ZVN0YWNrIiwicG9zaXRpb25BbGwiLCJwZXJtaXNzaW9uIiwic2hvd0xhc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsVUFBVUMsT0FBT0QsT0FBckI7O0FBRUE7QUFDQSxJQUFNRSxtQkFBbUIsU0FBbkJBLGdCQUFtQixDQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBa0JDLFVBQWxCLEVBQWlDO0FBQ3hEO0FBQ0EsTUFBTUMsYUFBYUYsU0FBUyxTQUFjLEVBQWQsRUFBa0JDLGFBQWFFLGNBQWNDLFNBQWQsQ0FBd0JMLE9BQXhCLENBQWdDRSxVQUFoQyxDQUFiLEdBQTJELEVBQTdFLEVBQWlGRixPQUFqRixDQUFULEdBQXFHLFNBQWMsRUFBZCxFQUFrQkksY0FBY0MsU0FBZCxDQUF3QkwsT0FBMUMsRUFBbURBLE9BQW5ELENBQXhIO0FBQ0EsTUFBTU0sZ0JBQWdCLFNBQWhCQSxhQUFnQixDQUFDQyxPQUFELEVBQWE7QUFDakMsUUFBSUMsV0FBV0QsT0FBZjtBQUNBLFFBQUlFLHdCQUFKO0FBQ0EsV0FBTyxDQUFDQSxrQkFBa0JELFNBQVNFLE9BQVQsQ0FBaUIsR0FBakIsQ0FBbkIsTUFBOEMsQ0FBQyxDQUF0RCxFQUF5RDtBQUN2REYsaUJBQVdBLFNBQVNHLEtBQVQsQ0FBZSxDQUFmLEVBQWtCRixlQUFsQixJQUFxQ0QsU0FBU0csS0FBVCxDQUFlRixrQkFBa0IsQ0FBakMsRUFBb0NBLGtCQUFrQixDQUF0RCxFQUF5REcsV0FBekQsRUFBckMsR0FBOEdKLFNBQVNHLEtBQVQsQ0FBZUYsa0JBQWtCLENBQWpDLENBQXpIO0FBQ0Q7QUFDRCxXQUFPRCxRQUFQO0FBQ0QsR0FQRDs7QUFTQTtBQUNBLE9BQUssSUFBSUssSUFBVCxJQUFpQlYsVUFBakIsRUFBNkI7QUFDM0IsUUFBSUEsV0FBV1csY0FBWCxDQUEwQkQsSUFBMUIsS0FBbUNBLEtBQUtILE9BQUwsQ0FBYSxHQUFiLE1BQXNCLENB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S0Q7O0FBRURsRixPQUFPTSxhQUFQLEdBQXVCQSxhQUF2QiIsImZpbGUiOiJzcmMvUE5vdGlmeUNvbXBhdC5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUE5vdGlmeSA9IHdpbmRvdy5QTm90aWZ5O1xuXG4vLyBUcmFuc2xhdGUgdjMgb3B0aW9ucyB0byB2NCBvcHRpb25zLlxuY29uc3QgdHJhbnNsYXRlT3B0aW9ucyA9IChvcHRpb25zLCBtb2R1bGUsIG1vZHVsZU5hbWUpID0+IHtcbiAgLy8gTWVyZ2UgdGhlIGNsYXNzaWMgZGVmYXVsdCBvcHRpb25zLlxuICBjb25zdCBuZXdPcHRpb25zID0gbW9kdWxlID8gT2JqZWN0LmFzc2lnbih7fSwgbW9kdWxlTmFtZSA/IFBOb3RpZnlDb21wYXQucHJvdG90eXBlLm9wdGlvbnNbbW9kdWxlTmFtZV0gOiB7fSwgb3B0aW9ucykgOiBPYmplY3QuYXNzaWduKHt9LCBQTm90aWZ5Q29tcGF0LnByb3RvdHlwZS5vcHRpb25zLCBvcHRpb25zKTtcbiAgY29uc3QgdHJhbnNsYXRlTmFtZSA9IChiYWROYW1lKSA9PiB7XG4gICAgbGV0IGdvb2ROYW1lID0gYmFkTmFtZTtcbiAgICBsZXQgdW5kZXJzY29yZUluZGV4O1xuICAgIHdoaWxlICgodW5kZXJzY29yZUluZGV4ID0gZ29vZE5hbWUuaW5kZXhPZignXycpKSAhPT0gLTEpIHtcbiAgICAgIGdvb2ROYW1lID0gZ29vZE5hbWUuc2xpY2UoMCwgdW5kZXJzY29yZUluZGV4KSArIGdvb2ROYW1lLnNsaWNlKHVuZGVyc2NvcmVJbmRleCArIDEsIHVuZGVyc2NvcmVJbmRleCArIDIpLnRvVXBwZXJDYXNlKCkgKyBnb29kTmFtZS5zbGljZSh1bmRlcnNjb3JlSW5kZXggKyAyKTtcbiAgICB9XG4gICAgcmV0dXJuIGdvb2ROYW1lO1xuICB9O1xuXG4gIC8vIFRyYW5zbGF0ZSBhbGwgb3B0aW9ucyB0byB0aGUgbmV3IHN0eWxlLlxuICBmb3IgKGxldCBuYW1lIGluIG5ld09wdGlvbnMpIHtcbiAgICBpZiAobmV3T3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShuYW1lKSAmJiBuYW1lLmluZGV4T2YoJ18nKSAhPT0gLTEpIHtcbiAgICAgIGNvbnN0IGdvb2ROYW1lID0gdHJhbnNsYXRlTmFtZShuYW1lKTtcbiAgICAgIG5ld09wdGlvbnNbZ29vZE5hbWVdID0gbmV3T3B0aW9uc1tuYW1lXTtcbiAgICAgIGRlbGV0ZSBuZXdPcHRpb25zW25hbWVdO1xuICAgIH1cbiAgfVxuXG4gIGlmICghbW9kdWxlKSB7XG4gICAgLy8gT3B0aW9ucyB0aGF0IGhhdmUgY2hhbmdlZC5cbiAgICBpZiAobmV3T3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnYWRkY2xhc3MnKSkge1xuICAgICAgbmV3T3B0aW9ucy5hZGRDbGFzcyA9IG5ld09wdGlvbnMuYWRkY2xhc3M7XG4gICAgICBkZWxldGUgbmV3T3B0aW9ucy5hZGRjbGFzcztcbiAgICB9XG4gICAgaWYgKG5ld09wdGlvbnMuaGFzT3duUHJvcGVydHkoJ2Nvcm5lcmNsYXNzJykpIHtcbiAgICAgIG5ld09wdGlvbnMuY29ybmVyQ2xhc3MgPSBuZXdPcHRpb25zLmNvcm5lcmNsYXNzO1xuICAgICAgZGVsZXRlIG5ld09wdGlvbnMuY29ybmVyQ2xhc3M7XG4gICAgfVxuICAgIGlmIChuZXdPcHRpb25zLmhhc093blByb3BlcnR5KCd0ZXh0RXNjYXBlJykpIHtcbiAgICAgIG5ld09wdGlvbnMudGV4dFRydXN0ZWQgPSAhbmV3T3B0aW9ucy50ZXh0RXNjYXBlO1xuICAgICAgZGVsZXRlIG5ld09wdGlvbnMudGV4dEVzY2FwZTtcbiAgICB9XG4gICAgaWYgKG5ld09wdGlvbnMuaGFzT3duUHJvcGVydHkoJ3RpdGxlRXNjYXBlJykpIHtcbiAgICAgIG5ld09wdGlvbnMudGl0bGVUcnVzdGVkID0gIW5ld09wdGlvbnMudGl0bGVFc2NhcGU7XG4gICAgICBkZWxldGUgbmV3T3B0aW9ucy50aXRsZUVzY2FwZTtcbiAgICB9XG5cbiAgICAvLyBTdHlsaW5nIGFuZCBpY29ucy5cbiAgICBpZiAobmV3T3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnc3R5bGluZycpKSB7XG4gICAgICBpZiAobmV3T3B0aW9ucy5zdHlsaW5nID09PSAnYm9vdHN0cmFwMycpIHtcbiAgICAgICAgbmV3T3B0aW9ucy5pY29ucyA9ICdib290c3RyYXAzJztcbiAgICAgIH0gZWxzZSBpZiAobmV3T3B0aW9ucy5zdHlsaW5nID09PSAnZm9udGF3ZXNvbWUnKSB7XG4gICAgICAgIG5ld09wdGlvbnMuc3R5bGluZyA9ICdib290c3RyYXAzJztcbiAgICAgICAgbmV3T3B0aW9ucy5pY29ucyA9ICdmb250YXdlc29tZTQnO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFN0YWNrcy5cbiAgICBpZiAobmV3T3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnc3RhY2snKSkge1xuICAgICAgaWYgKG5ld09wdGlvbnMuc3RhY2sub3ZlcmxheV9jbG9zZSkge1xuICAgICAgICBuZXdPcHRpb25zLnN0YWNrLm92ZXJsYXlDbG9zZSA9IG5ld09wdGlvbnMuc3RhY2sub3ZlcmxheV9jbG9zZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUcmFuc2xhdGUgbW9kdWxlIG9wdGlvbnMuXG4gICAgbmV3T3B0aW9ucy5tb2R1bGVzID0ge307XG4gICAgaWYgKG5ld09wdGlvbnMuaGFzT3duUHJvcGVydHkoJ2FuaW1hdGUnKSkge1xuICAgICAgbmV3T3B0aW9ucy5tb2R1bGVzLkFuaW1hdGUgPSB0cmFuc2xhdGVPcHRpb25zKG5ld09wdGlvbnMuYW5pbWF0ZSwgdHJ1ZSwgJ2FuaW1hdGUnKTtcbiAgICAgIGRlbGV0ZSBuZXdPcHRpb25zLmFuaW1hdGU7XG4gICAgfVxuICAgIGlmIChuZXdPcHRpb25zLmhhc093blByb3BlcnR5KCdidXR0b25zJykpIHtcbiAgICAgIG5ld09wdGlvbnMubW9kdWxlcy5CdXR0b25zID0gdHJhbnNsYXRlT3B0aW9ucyhuZXdPcHRpb25zLmJ1dHRvbnMsIHRydWUsICdidXR0b25zJyk7XG4gICAgICBkZWxldGUgbmV3T3B0aW9ucy5idXR0b25zO1xuICAgICAgaWYgKG5ld09wdGlvbnMubW9kdWxlcy5CdXR0b25zLmNsYXNzZXMpIHtcbiAgICAgICAgbmV3T3B0aW9ucy5tb2R1bGVzLkJ1dHRvbnMuY2xhc3NlcyA9IHRyYW5zbGF0ZU9wdGlvbnMobmV3T3B0aW9ucy5tb2R1bGVzLkJ1dHRvbnMuY2xhc3NlcywgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChuZXdPcHRpb25zLmhhc093blByb3BlcnR5KCdjb25maXJtJykpIHtcbiAgICAgIG5ld09wdGlvbnMubW9kdWxlcy5Db25maXJtID0gdHJhbnNsYXRlT3B0aW9ucyhuZXdPcHRpb25zLmNvbmZpcm0sIHRydWUsICdjb25maXJtJyk7XG4gICAgICBpZiAobmV3T3B0aW9ucy5tb2R1bGVzLkNvbmZpcm0ucHJvbXB0RGVmYXVsdCkge1xuICAgICAgICBuZXdPcHRpb25zLm1vZHVsZXMuQ29uZmlybS5wcm9tcHRWYWx1ZSA9IG5ld09wdGlvbnMubW9kdWxlcy5Db25maXJtLnByb21wdERlZmF1bHQ7XG4gICAgICAgIGRlbGV0ZSBuZXdPcHRpb25zLm1vZHVsZXMuQ29uZmlybS5wcm9tcHREZWZhdWx0O1xuICAgICAgfVxuICAgICAgZGVsZXRlIG5ld09wdGlvbnMuY29uZmlybTtcbiAgICB9XG4gICAgaWYgKG5ld09wdGlvbnMuaGFzT3duUHJvcGVydHkoJ2Rlc2t0b3AnKSkge1xuICAgICAgbmV3T3B0aW9ucy5tb2R1bGVzLkRlc2t0b3AgPSB0cmFuc2xhdGVPcHRpb25zKG5ld09wdGlvbnMuZGVza3RvcCwgdHJ1ZSwgJ2Rlc2t0b3AnKTtcbiAgICAgIGRlbGV0ZSBuZXdPcHRpb25zLmRlc2t0b3A7XG4gICAgfVxuICAgIGlmIChuZXdPcHRpb25zLmhhc093blByb3BlcnR5KCdoaXN0b3J5JykpIHtcbiAgICAgIG5ld09wdGlvbnMubW9kdWxlcy5IaXN0b3J5ID0gdHJhbnNsYXRlT3B0aW9ucyhuZXdPcHRpb25zLmhpc3RvcnksIHRydWUsICdoaXN0b3J5Jyk7XG4gICAgICBkZWxldGUgbmV3T3B0aW9ucy5oaXN0b3J5O1xuICAgIH1cbiAgICBpZiAobmV3T3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnbW9iaWxlJykpIHtcbiAgICAgIG5ld09wdGlvbnMubW9kdWxlcy5Nb2JpbGUgPSB0cmFuc2xhdGVPcHRpb25zKG5ld09wdGlvbnMubW9iaWxlLCB0cnVlLCAnbW9iaWxlJyk7XG4gICAgICBkZWxldGUgbmV3T3B0aW9ucy5tb2JpbGU7XG4gICAgfVxuICAgIGlmIChuZXdPcHRpb25zLmhhc093blByb3BlcnR5KCdub25ibG9jaycpKSB7XG4gICAgICBuZXdPcHRpb25zLm1vZHVsZXMuTm9uQmxvY2sgPSB0cmFuc2xhdGVPcHRpb25zKG5ld09wdGlvbnMubm9uYmxvY2ssIHRydWUsICdub25ibG9jaycpO1xuICAgICAgZGVsZXRlIG5ld09wdGlvbnMubm9uYmxvY2s7XG4gICAgfVxuICAgIGlmIChuZXdPcHRpb25zLmhhc093blByb3BlcnR5KCdyZWZlcmVuY2UnKSkge1xuICAgICAgbmV3T3B0aW9ucy5tb2R1bGVzLlJlZmVyZW5jZSA9IHRyYW5zbGF0ZU9wdGlvbnMobmV3T3B0aW9ucy5yZWZlcmVuY2UsIHRydWUsICdyZWZlcmVuY2UnKTtcbiAgICAgIGRlbGV0ZSBuZXdPcHRpb25zLnJlZmVyZW5jZTtcbiAgICB9XG4gICAgaWYgKG5ld09wdGlvbnMuaGFzT3duUHJvcGVydHkoJ2JlZm9yZUluaXQnKSkge1xuICAgICAgaWYgKCFuZXdPcHRpb25zLm1vZHVsZXMuQ2FsbGJhY2tzKSB7XG4gICAgICAgIG5ld09wdGlvbnMubW9kdWxlcy5DYWxsYmFja3MgPSB7fTtcbiAgICAgIH1cbiAgICAgIG5ld09wdGlvbnMubW9kdWxlcy5DYWxsYmFja3MuYmVmb3JlSW5pdCA9IG5ld09wdGlvbnMuYmVmb3JlSW5pdDtcbiAgICAgIGRlbGV0ZSBuZXdPcHRpb25zLmJlZm9yZUluaXQ7XG4gICAgfVxuICAgIGlmIChuZXdPcHRpb25zLmhhc093blByb3BlcnR5KCdhZnRlckluaXQnKSkge1xuICAgICAgaWYgKCFuZXdPcHRpb25zLm1vZHVsZXMuQ2FsbGJhY2tzKSB7XG4gICAgICAgIG5ld09wdGlvbnMubW9kdWxlcy5DYWxsYmFja3MgPSB7fTtcbiAgICAgIH1cbiAgICAgIG5ld09wdGlvbnMubW9kdWxlcy5DYWxsYmFja3MuYWZ0ZXJJbml0ID0gbmV3T3B0aW9ucy5hZnRlckluaXQ7XG4gICAgICBkZWxldGUgbmV3T3B0aW9ucy5hZnRlckluaXQ7XG4gICAgfVxuICAgIGlmIChuZXdPcHRpb25zLmhhc093blByb3BlcnR5KCdiZWZvcmVPcGVuJykpIHtcbiAgICAgIGlmICghbmV3T3B0aW9ucy5tb2R1bGVzLkNhbGxiYWNrcykge1xuICAgICAgICBuZXdPcHRpb25zLm1vZHVsZXMuQ2FsbGJhY2tzID0ge307XG4gICAgICB9XG4gICAgICBuZXdPcHRpb25zLm1vZHVsZXMuQ2FsbGJhY2tzLmJlZm9yZU9wZW4gPSBuZXdPcHRpb25zLmJlZm9yZU9wZW47XG4gICAgICBkZWxldGUgbmV3T3B0aW9ucy5iZWZvcmVPcGVuO1xuICAgIH1cbiAgICBpZiAobmV3T3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnYWZ0ZXJPcGVuJykpIHtcbiAgICAgIGlmICghbmV3T3B0aW9ucy5tb2R1bGVzLkNhbGxiYWNrcykge1xuICAgICAgICBuZXdPcHRpb25zLm1vZHVsZXMuQ2FsbGJhY2tzID0ge307XG4gICAgICB9XG4gICAgICBuZXdPcHRpb25zLm1vZHVsZXMuQ2FsbGJhY2tzLmFmdGVyT3BlbiA9IG5ld09wdGlvbnMuYWZ0ZXJPcGVuO1xuICAgICAgZGVsZXRlIG5ld09wdGlvbnMuYWZ0ZXJPcGVuO1xuICAgIH1cbiAgICBpZiAobmV3T3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnYmVmb3JlQ2xvc2UnKSkge1xuICAgICAgaWYgKCFuZXdPcHRpb25zLm1vZHVsZXMuQ2FsbGJhY2tzKSB7XG4gICAgICAgIG5ld09wdGlvbnMubW9kdWxlcy5DYWxsYmFja3MgPSB7fTtcbiAgICAgIH1cbiAgICAgIG5ld09wdGlvbnMubW9kdWxlcy5DYWxsYmFja3MuYmVmb3JlQ2xvc2UgPSBuZXdPcHRpb25zLmJlZm9yZUNsb3NlO1xuICAgICAgZGVsZXRlIG5ld09wdGlvbnMuYmVmb3JlQ2xvc2U7XG4gICAgfVxuICAgIGlmIChuZXdPcHRpb25zLmhhc093blByb3BlcnR5KCdhZnRlckNsb3NlJykpIHtcbiAgICAgIGlmICghbmV3T3B0aW9ucy5tb2R1bGVzLkNhbGxiYWNrcykge1xuICAgICAgICBuZXdPcHRpb25zLm1vZHVsZXMuQ2FsbGJhY2tzID0ge307XG4gICAgICB9XG4gICAgICBuZXdPcHRpb25zLm1vZHVsZXMuQ2FsbGJhY2tzLmFmdGVyQ2xvc2UgPSBuZXdPcHRpb25zLmFmdGVyQ2xvc2U7XG4gICAgICBkZWxldGUgbmV3T3B0aW9ucy5hZnRlckNsb3NlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXdPcHRpb25zO1xufTtcblxuLy8gVGhlIGNvbXBhdGliaWxpdHkgY2xhc3MuXG5jbGFzcyBQTm90aWZ5Q29tcGF0IGV4dGVuZHMgUE5vdGlmeSB7XG4gIGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnb2JqZWN0Jykge1xuICAgICAgb3B0aW9ucyA9IHsndGV4dCc6IG9wdGlvbnN9O1xuICAgIH1cblxuICAgIC8vIFRoZXNlIG5lZWQgdG8gYmUgY2FsbGVkIGRpcmVjdGx5LCBzaW5jZSB3ZSdyZSBub3QgdXNpbmcgUE5vdGlmeS5hbGVydCgpLlxuICAgIGlmIChQTm90aWZ5Lm1vZHVsZXMuQ2FsbGJhY2tzICYmIG9wdGlvbnMuYmVmb3JlX2luaXQpIHtcbiAgICAgIG9wdGlvbnMuYmVmb3JlX2luaXQob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgb3B0aW9ucyA9IHRyYW5zbGF0ZU9wdGlvbnMob3B0aW9ucyk7XG5cbiAgICBzdXBlcih7dGFyZ2V0OiBkb2N1bWVudC5ib2R5LCBkYXRhOiBvcHRpb25zfSk7XG5cbiAgICAvLyBPdmVycmlkZSB0aGUgZ2V0IGZ1bmN0aW9uIHRvIHJldHVybiB0aGUgZWxlbWVudCBsaWtlIGl0IGRpZCBpbiB2My5cbiAgICBjb25zdCBfZ2V0ID0gdGhpcy5nZXQ7XG4gICAgdGhpcy5nZXQgPSBmdW5jdGlvbiAob3B0aW9uKSB7XG4gICAgICBpZiAob3B0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24od2luZG93LmpRdWVyeSA/IHdpbmRvdy5qUXVlcnkodGhpcy5yZWZzLmVsZW0pIDogdGhpcy5yZWZzLmVsZW0sIF9nZXQuY2FsbCh0aGlzKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gX2dldC5jYWxsKHRoaXMsIG9wdGlvbik7XG4gICAgfTtcblxuICAgIC8vIENvbmZpcm0gbW9kdWxlIGV2ZW50cy5cbiAgICB0aGlzLm9uKCdwbm90aWZ5LmNvbmZpcm0nLCAoZSkgPT4ge1xuICAgICAgaWYgKHdpbmRvdy5qUXVlcnkpIHtcbiAgICAgICAgd2luZG93LmpRdWVyeSh0aGlzLnJlZnMuZWxlbSkudHJpZ2dlcigncG5vdGlmeS5jb25maXJtJywgW3RoaXMsIGUudmFsdWVdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLm9uKCdwbm90aWZ5LmNhbmNlbCcsIChlKSA9PiB7XG4gICAgICBpZiAod2luZG93LmpRdWVyeSkge1xuICAgICAgICB3aW5kb3cualF1ZXJ5KHRoaXMucmVmcy5lbGVtKS50cmlnZ2VyKCdwbm90aWZ5LmNhbmNlbCcsIHRoaXMpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKFBOb3RpZnkubW9kdWxlcy5DYWxsYmFja3MpIHtcbiAgICAgIFBOb3RpZnkubW9kdWxlcy5DYWxsYmFja3MuZ2V0Q2FsbGJhY2tzKHRoaXMsIG51bGwsICdhZnRlckluaXQnKSh0aGlzKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGUgKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gdHJhbnNsYXRlT3B0aW9ucyhvcHRpb25zKTtcbiAgICByZXR1cm4gc3VwZXIudXBkYXRlKG9wdGlvbnMpO1xuICB9XG59XG5cbi8vIExldHMgeW91IGNoYW5nZSBkZWZhdWx0cyB0aGUgb2xkIHdheS5cblBOb3RpZnlDb21wYXQucHJvdG90eXBlLm9wdGlvbnMgPSB7XG4gIHRleHRfZXNjYXBlOiBmYWxzZSxcbiAgdGl0bGVfZXNjYXBlOiBmYWxzZVxufTtcblxuLy8gRm9yd2FyZCBzdGF0aWMgZnVuY3Rpb25zLlxuUE5vdGlmeUNvbXBhdC5yZWxvYWQgPSAoKSA9PiBQTm90aWZ5Q29tcGF0O1xuUE5vdGlmeUNvbXBhdC5yZW1vdmVBbGwgPSAoKSA9PiBQTm90aWZ5LnJlbW92ZUFsbCgpO1xuUE5vdGlmeUNvbXBhdC5yZW1vdmVTdGFjayA9IChzdGFjaykgPT4gUE5vdGlmeS5yZW1vdmVTdGFjayhzdGFjayk7XG5QTm90aWZ5Q29tcGF0LnBvc2l0aW9uQWxsID0gKGFuaW1hdGUpID0+IFBOb3RpZnkucG9zaXRpb25BbGwoYW5pbWF0ZSk7XG5cbi8vIERlc2t0b3AgbW9kdWxlIHBlcm1pc3Npb24gbWV0aG9kLlxuUE5vdGlmeUNvbXBhdC5kZXNrdG9wID0ge1xuICBwZXJtaXNzaW9uOiAoKSA9PiB7XG4gICAgUE5vdGlmeS5tb2R1bGVzLkRlc2t0b3AucGVybWlzc2lvbigpO1xuICB9XG59O1xuXG4vLyBPbGQgc3R5bGUgc2hvd0xhc3QoKSBpbiBIaXN0b3J5IG1vZHVsZS5cbmlmICh3aW5kb3cualF1ZXJ5KSB7XG4gIHdpbmRvdy5qUXVlcnkoKCkgPT4ge1xuICAgIHdpbmRvdy5qUXVlcnkoZG9jdW1lbnQuYm9keSkub24oJ3Bub3RpZnkuaGlzdG9yeS1sYXN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgUE5vdGlmeS5tb2R1bGVzLkhpc3Rvcnkuc2hvd0xhc3QoKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbndpbmRvdy5QTm90aWZ5Q29tcGF0ID0gUE5vdGlmeUNvbXBhdDtcbiJdfQ==