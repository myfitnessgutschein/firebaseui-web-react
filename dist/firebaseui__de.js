"use strict";

(function () {
  var componentHandler = { upgradeDom: function upgradeDom(optJsClass, optCssClass) {}, upgradeElement: function upgradeElement(element, optJsClass) {}, upgradeElements: function upgradeElements(elements) {}, upgradeAllRegistered: function upgradeAllRegistered() {}, registerUpgradedCallback: function registerUpgradedCallback(jsClass, callback) {}, register: function register(config) {}, downgradeElements: function downgradeElements(nodes) {} };
  componentHandler = function () {
    var registeredComponents_ = [];var createdComponents_ = [];var componentConfigProperty_ = "mdlComponentConfigInternal_";function findRegisteredClass_(name, optReplace) {
      for (var i = 0; i < registeredComponents_.length; i++) {
        if (registeredComponents_[i].className === name) {
          if (typeof optReplace !== "undefined") registeredComponents_[i] = optReplace;return registeredComponents_[i];
        }
      }return false;
    }function getUpgradedListOfElement_(element) {
      var dataUpgraded = element.getAttribute("data-upgraded");return dataUpgraded === null ? [""] : dataUpgraded.split(",");
    }function isElementUpgraded_(element, jsClass) {
      var upgradedList = getUpgradedListOfElement_(element);return upgradedList.indexOf(jsClass) !== -1;
    }function createEvent_(eventType, bubbles, cancelable) {
      if ("CustomEvent" in window && typeof window.CustomEvent === "function") return new CustomEvent(eventType, { bubbles: bubbles, cancelable: cancelable });else {
        var ev = document.createEvent("Events");ev.initEvent(eventType, bubbles, cancelable);return ev;
      }
    }function upgradeDomInternal(optJsClass, optCssClass) {
      if (typeof optJsClass === "undefined" && typeof optCssClass === "undefined") for (var i = 0; i < registeredComponents_.length; i++) {
        upgradeDomInternal(registeredComponents_[i].className, registeredComponents_[i].cssClass);
      } else {
        var jsClass = optJsClass;if (typeof optCssClass === "undefined") {
          var registeredClass = findRegisteredClass_(jsClass);if (registeredClass) optCssClass = registeredClass.cssClass;
        }var elements = document.querySelectorAll("." + optCssClass);for (var n = 0; n < elements.length; n++) {
          upgradeElementInternal(elements[n], jsClass);
        }
      }
    }function upgradeElementInternal(element, optJsClass) {
      if (!(typeof element === "object" && element instanceof Element)) throw new Error("Invalid argument provided to upgrade MDL element.");var upgradingEv = createEvent_("mdl-componentupgrading", true, true);element.dispatchEvent(upgradingEv);if (upgradingEv.defaultPrevented) return;var upgradedList = getUpgradedListOfElement_(element);var classesToUpgrade = [];if (!optJsClass) {
        var classList = element.classList;registeredComponents_.forEach(function (component) {
          if (classList.contains(component.cssClass) && classesToUpgrade.indexOf(component) === -1 && !isElementUpgraded_(element, component.className)) classesToUpgrade.push(component);
        });
      } else if (!isElementUpgraded_(element, optJsClass)) classesToUpgrade.push(findRegisteredClass_(optJsClass));for (var i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
        registeredClass = classesToUpgrade[i];if (registeredClass) {
          upgradedList.push(registeredClass.className);element.setAttribute("data-upgraded", upgradedList.join(","));var instance = new registeredClass.classConstructor(element);
          instance[componentConfigProperty_] = registeredClass;createdComponents_.push(instance);for (var j = 0, m = registeredClass.callbacks.length; j < m; j++) {
            registeredClass.callbacks[j](element);
          }if (registeredClass.widget) element[registeredClass.className] = instance;
        } else throw new Error("Unable to find a registered component for the given class.");var upgradedEv = createEvent_("mdl-componentupgraded", true, false);element.dispatchEvent(upgradedEv);
      }
    }function upgradeElementsInternal(elements) {
      if (!Array.isArray(elements)) if (elements instanceof Element) elements = [elements];else elements = Array.prototype.slice.call(elements);for (var i = 0, n = elements.length, element; i < n; i++) {
        element = elements[i];if (element instanceof HTMLElement) {
          upgradeElementInternal(element);if (element.children.length > 0) upgradeElementsInternal(element.children);
        }
      }
    }function registerInternal(config) {
      var widgetMissing = typeof config.widget === "undefined" && typeof config["widget"] === "undefined";var widget = true;if (!widgetMissing) widget = config.widget || config["widget"];var newConfig = { classConstructor: config.constructor || config["constructor"], className: config.classAsString || config["classAsString"], cssClass: config.cssClass || config["cssClass"], widget: widget, callbacks: [] };registeredComponents_.forEach(function (item) {
        if (item.cssClass === newConfig.cssClass) throw new Error("The provided cssClass has already been registered: " + item.cssClass);if (item.className === newConfig.className) throw new Error("The provided className has already been registered");
      });if (config.constructor.prototype.hasOwnProperty(componentConfigProperty_)) throw new Error("MDL component classes must not have " + componentConfigProperty_ + " defined as a property.");var found = findRegisteredClass_(config.classAsString, newConfig);if (!found) registeredComponents_.push(newConfig);
    }function registerUpgradedCallbackInternal(jsClass, callback) {
      var regClass = findRegisteredClass_(jsClass);if (regClass) regClass.callbacks.push(callback);
    }function upgradeAllRegisteredInternal() {
      for (var n = 0; n < registeredComponents_.length; n++) {
        upgradeDomInternal(registeredComponents_[n].className);
      }
    }function deconstructComponentInternal(component) {
      if (component) {
        var componentIndex = createdComponents_.indexOf(component);createdComponents_.splice(componentIndex, 1);var upgrades = component.element_.getAttribute("data-upgraded").split(",");var componentPlace = upgrades.indexOf(component[componentConfigProperty_].classAsString);upgrades.splice(componentPlace, 1);component.element_.setAttribute("data-upgraded", upgrades.join(","));var ev = createEvent_("mdl-componentdowngraded", true, false);component.element_.dispatchEvent(ev);
      }
    }function downgradeNodesInternal(nodes) {
      var downgradeNode = function downgradeNode(node) {
        createdComponents_.filter(function (item) {
          return item.element_ === node;
        }).forEach(deconstructComponentInternal);
      };if (nodes instanceof Array || nodes instanceof NodeList) for (var n = 0; n < nodes.length; n++) {
        downgradeNode(nodes[n]);
      } else if (nodes instanceof Node) downgradeNode(nodes);else throw new Error("Invalid argument provided to downgrade MDL nodes.");
    }return { upgradeDom: upgradeDomInternal, upgradeElement: upgradeElementInternal, upgradeElements: upgradeElementsInternal, upgradeAllRegistered: upgradeAllRegisteredInternal, registerUpgradedCallback: registerUpgradedCallbackInternal,
      register: registerInternal, downgradeElements: downgradeNodesInternal };
  }();componentHandler.ComponentConfigPublic;componentHandler.ComponentConfig;componentHandler.Component;componentHandler["upgradeDom"] = componentHandler.upgradeDom;componentHandler["upgradeElement"] = componentHandler.upgradeElement;componentHandler["upgradeElements"] = componentHandler.upgradeElements;componentHandler["upgradeAllRegistered"] = componentHandler.upgradeAllRegistered;componentHandler["registerUpgradedCallback"] = componentHandler.registerUpgradedCallback;
  componentHandler["register"] = componentHandler.register;componentHandler["downgradeElements"] = componentHandler.downgradeElements;window.componentHandler = componentHandler;window["componentHandler"] = componentHandler;
  window.addEventListener("load", function () {
    if ("classList" in document.createElement("div") && "querySelector" in document && "addEventListener" in window && Array.prototype.forEach) {
      document.documentElement.classList.add("mdl-js");componentHandler.upgradeAllRegistered();
    } else {
      componentHandler.upgradeElement = function () {};componentHandler.register = function () {};
    }
  });(function () {
    var MaterialButton = function MaterialButton(element) {
      this.element_ = element;this.init();
    };window["MaterialButton"] = MaterialButton;MaterialButton.prototype.Constant_ = {};MaterialButton.prototype.CssClasses_ = { RIPPLE_EFFECT: "mdl-js-ripple-effect", RIPPLE_CONTAINER: "mdl-button__ripple-container", RIPPLE: "mdl-ripple" };MaterialButton.prototype.blurHandler_ = function (event) {
      if (event) this.element_.blur();
    };MaterialButton.prototype.disable = function () {
      this.element_.disabled = true;
    };MaterialButton.prototype["disable"] = MaterialButton.prototype.disable;MaterialButton.prototype.enable = function () {
      this.element_.disabled = false;
    };MaterialButton.prototype["enable"] = MaterialButton.prototype.enable;MaterialButton.prototype.init = function () {
      if (this.element_) {
        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
          var rippleContainer = document.createElement("span");rippleContainer.classList.add(this.CssClasses_.RIPPLE_CONTAINER);this.rippleElement_ = document.createElement("span");this.rippleElement_.classList.add(this.CssClasses_.RIPPLE);
          rippleContainer.appendChild(this.rippleElement_);this.boundRippleBlurHandler = this.blurHandler_.bind(this);this.rippleElement_.addEventListener("mouseup", this.boundRippleBlurHandler);this.element_.appendChild(rippleContainer);
        }this.boundButtonBlurHandler = this.blurHandler_.bind(this);this.element_.addEventListener("mouseup", this.boundButtonBlurHandler);this.element_.addEventListener("mouseleave", this.boundButtonBlurHandler);
      }
    };componentHandler.register({ constructor: MaterialButton, classAsString: "MaterialButton",
      cssClass: "mdl-js-button", widget: true });
  })();(function () {
    var MaterialProgress = function MaterialProgress(element) {
      this.element_ = element;this.init();
    };window["MaterialProgress"] = MaterialProgress;MaterialProgress.prototype.Constant_ = {};MaterialProgress.prototype.CssClasses_ = { INDETERMINATE_CLASS: "mdl-progress__indeterminate" };MaterialProgress.prototype.setProgress = function (p) {
      if (this.element_.classList.contains(this.CssClasses_.INDETERMINATE_CLASS)) return;this.progressbar_.style.width = p + "%";
    };MaterialProgress.prototype["setProgress"] = MaterialProgress.prototype.setProgress;
    MaterialProgress.prototype.setBuffer = function (p) {
      this.bufferbar_.style.width = p + "%";this.auxbar_.style.width = 100 - p + "%";
    };MaterialProgress.prototype["setBuffer"] = MaterialProgress.prototype.setBuffer;MaterialProgress.prototype.init = function () {
      if (this.element_) {
        var el = document.createElement("div");el.className = "progressbar bar bar1";this.element_.appendChild(el);this.progressbar_ = el;el = document.createElement("div");el.className = "bufferbar bar bar2";this.element_.appendChild(el);this.bufferbar_ = el;el = document.createElement("div");
        el.className = "auxbar bar bar3";this.element_.appendChild(el);this.auxbar_ = el;this.progressbar_.style.width = "0%";this.bufferbar_.style.width = "100%";this.auxbar_.style.width = "0%";this.element_.classList.add("is-upgraded");
      }
    };componentHandler.register({ constructor: MaterialProgress, classAsString: "MaterialProgress", cssClass: "mdl-js-progress", widget: true });
  })();(function () {
    var MaterialSpinner = function MaterialSpinner(element) {
      this.element_ = element;this.init();
    };window["MaterialSpinner"] = MaterialSpinner;MaterialSpinner.prototype.Constant_ = { MDL_SPINNER_LAYER_COUNT: 4 };MaterialSpinner.prototype.CssClasses_ = { MDL_SPINNER_LAYER: "mdl-spinner__layer", MDL_SPINNER_CIRCLE_CLIPPER: "mdl-spinner__circle-clipper", MDL_SPINNER_CIRCLE: "mdl-spinner__circle", MDL_SPINNER_GAP_PATCH: "mdl-spinner__gap-patch", MDL_SPINNER_LEFT: "mdl-spinner__left", MDL_SPINNER_RIGHT: "mdl-spinner__right" };
    MaterialSpinner.prototype.createLayer = function (index) {
      var layer = document.createElement("div");layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER);layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER + "-" + index);var leftClipper = document.createElement("div");leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER);leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_LEFT);var gapPatch = document.createElement("div");gapPatch.classList.add(this.CssClasses_.MDL_SPINNER_GAP_PATCH);var rightClipper = document.createElement("div");rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER);rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_RIGHT);var circleOwners = [leftClipper, gapPatch, rightClipper];for (var i = 0; i < circleOwners.length; i++) {
        var circle = document.createElement("div");circle.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE);circleOwners[i].appendChild(circle);
      }layer.appendChild(leftClipper);layer.appendChild(gapPatch);layer.appendChild(rightClipper);this.element_.appendChild(layer);
    };
    MaterialSpinner.prototype["createLayer"] = MaterialSpinner.prototype.createLayer;MaterialSpinner.prototype.stop = function () {
      this.element_.classList.remove("is-active");
    };MaterialSpinner.prototype["stop"] = MaterialSpinner.prototype.stop;MaterialSpinner.prototype.start = function () {
      this.element_.classList.add("is-active");
    };MaterialSpinner.prototype["start"] = MaterialSpinner.prototype.start;MaterialSpinner.prototype.init = function () {
      if (this.element_) {
        for (var i = 1; i <= this.Constant_.MDL_SPINNER_LAYER_COUNT; i++) {
          this.createLayer(i);
        }this.element_.classList.add("is-upgraded");
      }
    };componentHandler.register({ constructor: MaterialSpinner, classAsString: "MaterialSpinner", cssClass: "mdl-js-spinner", widget: true });
  })();(function () {
    var MaterialTextfield = function MaterialTextfield(element) {
      this.element_ = element;this.maxRows = this.Constant_.NO_MAX_ROWS;this.init();
    };window["MaterialTextfield"] = MaterialTextfield;MaterialTextfield.prototype.Constant_ = { NO_MAX_ROWS: -1, MAX_ROWS_ATTRIBUTE: "maxrows" };MaterialTextfield.prototype.CssClasses_ = { LABEL: "mdl-textfield__label", INPUT: "mdl-textfield__input", IS_DIRTY: "is-dirty", IS_FOCUSED: "is-focused", IS_DISABLED: "is-disabled", IS_INVALID: "is-invalid", IS_UPGRADED: "is-upgraded", HAS_PLACEHOLDER: "has-placeholder" };
    MaterialTextfield.prototype.onKeyDown_ = function (event) {
      var currentRowCount = event.target.value.split("\n").length;if (event.keyCode === 13) if (currentRowCount >= this.maxRows) event.preventDefault();
    };MaterialTextfield.prototype.onFocus_ = function (event) {
      this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
    };MaterialTextfield.prototype.onBlur_ = function (event) {
      this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
    };MaterialTextfield.prototype.onReset_ = function (event) {
      this.updateClasses_();
    };MaterialTextfield.prototype.updateClasses_ = function () {
      this.checkDisabled();this.checkValidity();this.checkDirty();this.checkFocus();
    };MaterialTextfield.prototype.checkDisabled = function () {
      if (this.input_.disabled) this.element_.classList.add(this.CssClasses_.IS_DISABLED);else this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    };MaterialTextfield.prototype["checkDisabled"] = MaterialTextfield.prototype.checkDisabled;MaterialTextfield.prototype.checkFocus = function () {
      if (Boolean(this.element_.querySelector(":focus"))) this.element_.classList.add(this.CssClasses_.IS_FOCUSED);else this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
    };MaterialTextfield.prototype["checkFocus"] = MaterialTextfield.prototype.checkFocus;MaterialTextfield.prototype.checkValidity = function () {
      if (this.input_.validity) if (this.input_.validity.valid) this.element_.classList.remove(this.CssClasses_.IS_INVALID);else this.element_.classList.add(this.CssClasses_.IS_INVALID);
    };MaterialTextfield.prototype["checkValidity"] = MaterialTextfield.prototype.checkValidity;MaterialTextfield.prototype.checkDirty = function () {
      if (this.input_.value && this.input_.value.length > 0) this.element_.classList.add(this.CssClasses_.IS_DIRTY);else this.element_.classList.remove(this.CssClasses_.IS_DIRTY);
    };MaterialTextfield.prototype["checkDirty"] = MaterialTextfield.prototype.checkDirty;MaterialTextfield.prototype.disable = function () {
      this.input_.disabled = true;this.updateClasses_();
    };MaterialTextfield.prototype["disable"] = MaterialTextfield.prototype.disable;MaterialTextfield.prototype.enable = function () {
      this.input_.disabled = false;
      this.updateClasses_();
    };MaterialTextfield.prototype["enable"] = MaterialTextfield.prototype.enable;MaterialTextfield.prototype.change = function (value) {
      this.input_.value = value || "";this.updateClasses_();
    };MaterialTextfield.prototype["change"] = MaterialTextfield.prototype.change;MaterialTextfield.prototype.init = function () {
      if (this.element_) {
        this.label_ = this.element_.querySelector("." + this.CssClasses_.LABEL);this.input_ = this.element_.querySelector("." + this.CssClasses_.INPUT);if (this.input_) {
          if (this.input_.hasAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE)) {
            this.maxRows = parseInt(this.input_.getAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE), 10);if (isNaN(this.maxRows)) this.maxRows = this.Constant_.NO_MAX_ROWS;
          }if (this.input_.hasAttribute("placeholder")) this.element_.classList.add(this.CssClasses_.HAS_PLACEHOLDER);this.boundUpdateClassesHandler = this.updateClasses_.bind(this);this.boundFocusHandler = this.onFocus_.bind(this);this.boundBlurHandler = this.onBlur_.bind(this);this.boundResetHandler = this.onReset_.bind(this);this.input_.addEventListener("input", this.boundUpdateClassesHandler);
          this.input_.addEventListener("focus", this.boundFocusHandler);this.input_.addEventListener("blur", this.boundBlurHandler);this.input_.addEventListener("reset", this.boundResetHandler);if (this.maxRows !== this.Constant_.NO_MAX_ROWS) {
            this.boundKeyDownHandler = this.onKeyDown_.bind(this);this.input_.addEventListener("keydown", this.boundKeyDownHandler);
          }var invalid = this.element_.classList.contains(this.CssClasses_.IS_INVALID);this.updateClasses_();this.element_.classList.add(this.CssClasses_.IS_UPGRADED);if (invalid) this.element_.classList.add(this.CssClasses_.IS_INVALID);
          if (this.input_.hasAttribute("autofocus")) {
            this.element_.focus();this.checkFocus();
          }
        }
      }
    };componentHandler.register({ constructor: MaterialTextfield, classAsString: "MaterialTextfield", cssClass: "mdl-js-textfield", widget: true });
  })();(function () {
    var supportCustomEvent = window.CustomEvent;if (!supportCustomEvent || typeof supportCustomEvent === "object") {
      supportCustomEvent = function CustomEvent(event, x) {
        x = x || {};var ev = document.createEvent("CustomEvent");ev.initCustomEvent(event, !!x.bubbles, !!x.cancelable, x.detail || null);return ev;
      };supportCustomEvent.prototype = window.Event.prototype;
    }function createsStackingContext(el) {
      while (el && el !== document.body) {
        var s = window.getComputedStyle(el);var invalid = function invalid(k, ok) {
          return !(s[k] === undefined || s[k] === ok);
        };if (s.opacity < 1 || invalid("zIndex", "auto") || invalid("transform", "none") || invalid("mixBlendMode", "normal") || invalid("filter", "none") || invalid("perspective", "none") || s["isolation"] === "isolate" || s.position === "fixed" || s.webkitOverflowScrolling === "touch") return true;el = el.parentElement;
      }return false;
    }function findNearestDialog(el) {
      while (el) {
        if (el.localName === "dialog") return el;el = el.parentElement;
      }return null;
    }function safeBlur(el) {
      if (el && el.blur && el !== document.body) el.blur();
    }function inNodeList(nodeList, node) {
      for (var i = 0; i < nodeList.length; ++i) {
        if (nodeList[i] === node) return true;
      }return false;
    }function isFormMethodDialog(el) {
      if (!el || !el.hasAttribute("method")) return false;return el.getAttribute("method").toLowerCase() === "dialog";
    }function dialogPolyfillInfo(dialog) {
      this.dialog_ = dialog;this.replacedStyleTop_ = false;this.openAsModal_ = false;if (!dialog.hasAttribute("role")) dialog.setAttribute("role", "dialog");dialog.show = this.show.bind(this);dialog.showModal = this.showModal.bind(this);dialog.close = this.close.bind(this);
      if (!("returnValue" in dialog)) dialog.returnValue = "";if ("MutationObserver" in window) {
        var mo = new MutationObserver(this.maybeHideModal.bind(this));mo.observe(dialog, { attributes: true, attributeFilter: ["open"] });
      } else {
        var removed = false;var cb = function () {
          removed ? this.downgradeModal() : this.maybeHideModal();removed = false;
        }.bind(this);var timeout;var delayModel = function delayModel(ev) {
          if (ev.target !== dialog) return;var cand = "DOMNodeRemoved";removed |= ev.type.substr(0, cand.length) === cand;window.clearTimeout(timeout);timeout = window.setTimeout(cb, 0);
        };["DOMAttrModified", "DOMNodeRemoved", "DOMNodeRemovedFromDocument"].forEach(function (name) {
          dialog.addEventListener(name, delayModel);
        });
      }Object.defineProperty(dialog, "open", { set: this.setOpen.bind(this), get: dialog.hasAttribute.bind(dialog, "open") });this.backdrop_ = document.createElement("div");this.backdrop_.className = "backdrop";this.backdrop_.addEventListener("click", this.backdropClick_.bind(this));
    }dialogPolyfillInfo.prototype = { get dialog() {
        return this.dialog_;
      }, maybeHideModal: function maybeHideModal() {
        if (this.dialog_.hasAttribute("open") && document.body.contains(this.dialog_)) return;this.downgradeModal();
      }, downgradeModal: function downgradeModal() {
        if (!this.openAsModal_) return;this.openAsModal_ = false;this.dialog_.style.zIndex = "";if (this.replacedStyleTop_) {
          this.dialog_.style.top = "";this.replacedStyleTop_ = false;
        }this.backdrop_.parentNode && this.backdrop_.parentNode.removeChild(this.backdrop_);dialogPolyfill.dm.removeDialog(this);
      }, setOpen: function setOpen(value) {
        if (value) this.dialog_.hasAttribute("open") || this.dialog_.setAttribute("open", "");else {
          this.dialog_.removeAttribute("open");
          this.maybeHideModal();
        }
      }, backdropClick_: function backdropClick_(e) {
        if (!this.dialog_.hasAttribute("tabindex")) {
          var fake = document.createElement("div");this.dialog_.insertBefore(fake, this.dialog_.firstChild);fake.tabIndex = -1;fake.focus();this.dialog_.removeChild(fake);
        } else this.dialog_.focus();var redirectedEvent = document.createEvent("MouseEvents");redirectedEvent.initMouseEvent(e.type, e.bubbles, e.cancelable, window, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
        this.dialog_.dispatchEvent(redirectedEvent);e.stopPropagation();
      }, focus_: function focus_() {
        var target = this.dialog_.querySelector("[autofocus]:not([disabled])");if (!target && this.dialog_.tabIndex >= 0) target = this.dialog_;if (!target) {
          var opts = ["button", "input", "keygen", "select", "textarea"];var query = opts.map(function (el) {
            return el + ":not([disabled])";
          });query.push('[tabindex]:not([disabled]):not([tabindex=""])');target = this.dialog_.querySelector(query.join(", "));
        }safeBlur(document.activeElement);target && target.focus();
      },
      updateZIndex: function updateZIndex(dialogZ, backdropZ) {
        if (dialogZ < backdropZ) throw new Error("dialogZ should never be < backdropZ");this.dialog_.style.zIndex = dialogZ;this.backdrop_.style.zIndex = backdropZ;
      }, show: function show() {
        if (!this.dialog_.open) {
          this.setOpen(true);this.focus_();
        }
      }, showModal: function showModal() {
        if (this.dialog_.hasAttribute("open")) throw new Error("Failed to execute 'showModal' on dialog: The element is already open, and therefore cannot be opened modally.");if (!document.body.contains(this.dialog_)) throw new Error("Failed to execute 'showModal' on dialog: The element is not in a Document.");
        if (!dialogPolyfill.dm.pushDialog(this)) throw new Error("Failed to execute 'showModal' on dialog: There are too many open modal dialogs.");if (createsStackingContext(this.dialog_.parentElement)) console.warn("A dialog is being shown inside a stacking context. " + "This may cause it to be unusable. For more information, see this link: " + "https://github.com/GoogleChrome/dialog-polyfill/#stacking-context");this.setOpen(true);this.openAsModal_ = true;if (dialogPolyfill.needsCentering(this.dialog_)) {
          dialogPolyfill.reposition(this.dialog_);
          this.replacedStyleTop_ = true;
        } else this.replacedStyleTop_ = false;this.dialog_.parentNode.insertBefore(this.backdrop_, this.dialog_.nextSibling);this.focus_();
      }, close: function close(opt_returnValue) {
        if (!this.dialog_.hasAttribute("open")) throw new Error("Failed to execute 'close' on dialog: The element does not have an 'open' attribute, and therefore cannot be closed.");this.setOpen(false);if (opt_returnValue !== undefined) this.dialog_.returnValue = opt_returnValue;var closeEvent = new supportCustomEvent("close", { bubbles: false,
          cancelable: false });this.dialog_.dispatchEvent(closeEvent);
      } };var dialogPolyfill = {};dialogPolyfill.reposition = function (element) {
      var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;var topValue = scrollTop + (window.innerHeight - element.offsetHeight) / 2;element.style.top = Math.max(scrollTop, topValue) + "px";
    };dialogPolyfill.isInlinePositionSetByStylesheet = function (element) {
      for (var i = 0; i < document.styleSheets.length; ++i) {
        var styleSheet = document.styleSheets[i];var cssRules = null;try {
          cssRules = styleSheet.cssRules;
        } catch (e) {}if (!cssRules) continue;for (var j = 0; j < cssRules.length; ++j) {
          var rule = cssRules[j];var selectedNodes = null;try {
            selectedNodes = document.querySelectorAll(rule.selectorText);
          } catch (e$0) {}if (!selectedNodes || !inNodeList(selectedNodes, element)) continue;var cssTop = rule.style.getPropertyValue("top");var cssBottom = rule.style.getPropertyValue("bottom");if (cssTop && cssTop !== "auto" || cssBottom && cssBottom !== "auto") return true;
        }
      }return false;
    };dialogPolyfill.needsCentering = function (dialog) {
      var computedStyle = window.getComputedStyle(dialog);if (computedStyle.position !== "absolute") return false;if (dialog.style.top !== "auto" && dialog.style.top !== "" || dialog.style.bottom !== "auto" && dialog.style.bottom !== "") return false;return !dialogPolyfill.isInlinePositionSetByStylesheet(dialog);
    };dialogPolyfill.forceRegisterDialog = function (element) {
      if (window.HTMLDialogElement || element.showModal) console.warn("This browser already supports <dialog>, the polyfill " + "may not work correctly", element);if (element.localName !== "dialog") throw new Error("Failed to register dialog: The element is not a dialog.");
      new dialogPolyfillInfo(element);
    };dialogPolyfill.registerDialog = function (element) {
      if (!element.showModal) dialogPolyfill.forceRegisterDialog(element);
    };dialogPolyfill.DialogManager = function () {
      this.pendingDialogStack = [];var checkDOM = this.checkDOM_.bind(this);this.overlay = document.createElement("div");this.overlay.className = "_dialog_overlay";this.overlay.addEventListener("click", function (e) {
        this.forwardTab_ = undefined;e.stopPropagation();checkDOM([]);
      }.bind(this));this.handleKey_ = this.handleKey_.bind(this);
      this.handleFocus_ = this.handleFocus_.bind(this);this.zIndexLow_ = 1E5;this.zIndexHigh_ = 1E5 + 150;this.forwardTab_ = undefined;if ("MutationObserver" in window) this.mo_ = new MutationObserver(function (records) {
        var removed = [];records.forEach(function (rec) {
          for (var i = 0, c; c = rec.removedNodes[i]; ++i) {
            if (!(c instanceof Element)) continue;else if (c.localName === "dialog") removed.push(c);removed = removed.concat(c.querySelectorAll("dialog"));
          }
        });removed.length && checkDOM(removed);
      });
    };dialogPolyfill.DialogManager.prototype.blockDocument = function () {
      document.documentElement.addEventListener("focus", this.handleFocus_, true);document.addEventListener("keydown", this.handleKey_);this.mo_ && this.mo_.observe(document, { childList: true, subtree: true });
    };dialogPolyfill.DialogManager.prototype.unblockDocument = function () {
      document.documentElement.removeEventListener("focus", this.handleFocus_, true);document.removeEventListener("keydown", this.handleKey_);this.mo_ && this.mo_.disconnect();
    };dialogPolyfill.DialogManager.prototype.updateStacking = function () {
      var zIndex = this.zIndexHigh_;for (var i = 0, dpi; dpi = this.pendingDialogStack[i]; ++i) {
        dpi.updateZIndex(--zIndex, --zIndex);if (i === 0) this.overlay.style.zIndex = --zIndex;
      }var last = this.pendingDialogStack[0];if (last) {
        var p = last.dialog.parentNode || document.body;p.appendChild(this.overlay);
      } else if (this.overlay.parentNode) this.overlay.parentNode.removeChild(this.overlay);
    };dialogPolyfill.DialogManager.prototype.containedByTopDialog_ = function (candidate) {
      while (candidate = findNearestDialog(candidate)) {
        for (var i = 0, dpi; dpi = this.pendingDialogStack[i]; ++i) {
          if (dpi.dialog === candidate) return i === 0;
        }candidate = candidate.parentElement;
      }return false;
    };dialogPolyfill.DialogManager.prototype.handleFocus_ = function (event) {
      if (this.containedByTopDialog_(event.target)) return;event.preventDefault();event.stopPropagation();safeBlur(event.target);if (this.forwardTab_ === undefined) return;var dpi = this.pendingDialogStack[0];var dialog = dpi.dialog;var position = dialog.compareDocumentPosition(event.target);if (position & Node.DOCUMENT_POSITION_PRECEDING) {
        if (this.forwardTab_) dpi.focus_();else document.documentElement.focus();
      } else ;return false;
    };dialogPolyfill.DialogManager.prototype.handleKey_ = function (event) {
      this.forwardTab_ = undefined;if (event.keyCode === 27) {
        event.preventDefault();event.stopPropagation();var cancelEvent = new supportCustomEvent("cancel", { bubbles: false, cancelable: true });var dpi = this.pendingDialogStack[0];if (dpi && dpi.dialog.dispatchEvent(cancelEvent)) dpi.dialog.close();
      } else if (event.keyCode === 9) this.forwardTab_ = !event.shiftKey;
    };dialogPolyfill.DialogManager.prototype.checkDOM_ = function (removed) {
      var clone = this.pendingDialogStack.slice();
      clone.forEach(function (dpi) {
        if (removed.indexOf(dpi.dialog) !== -1) dpi.downgradeModal();else dpi.maybeHideModal();
      });
    };dialogPolyfill.DialogManager.prototype.pushDialog = function (dpi) {
      var allowed = (this.zIndexHigh_ - this.zIndexLow_) / 2 - 1;if (this.pendingDialogStack.length >= allowed) return false;if (this.pendingDialogStack.unshift(dpi) === 1) this.blockDocument();this.updateStacking();return true;
    };dialogPolyfill.DialogManager.prototype.removeDialog = function (dpi) {
      var index = this.pendingDialogStack.indexOf(dpi);if (index === -1) return;this.pendingDialogStack.splice(index, 1);if (this.pendingDialogStack.length === 0) this.unblockDocument();this.updateStacking();
    };dialogPolyfill.dm = new dialogPolyfill.DialogManager();dialogPolyfill.formSubmitter = null;dialogPolyfill.useValue = null;if (window.HTMLDialogElement === undefined) {
      var testForm = document.createElement("form");testForm.setAttribute("method", "dialog");if (testForm.method !== "dialog") {
        var methodDescriptor = Object.getOwnPropertyDescriptor(HTMLFormElement.prototype, "method");if (methodDescriptor) {
          var realGet = methodDescriptor.get;methodDescriptor.get = function () {
            if (isFormMethodDialog(this)) return "dialog";return realGet.call(this);
          };var realSet = methodDescriptor.set;methodDescriptor.set = function (v) {
            if (typeof v === "string" && v.toLowerCase() === "dialog") return this.setAttribute("method", v);return realSet.call(this, v);
          };Object.defineProperty(HTMLFormElement.prototype, "method", methodDescriptor);
        }
      }document.addEventListener("click", function (ev) {
        dialogPolyfill.formSubmitter = null;dialogPolyfill.useValue = null;if (ev.defaultPrevented) return;
        var target = ev.target;if (!target || !isFormMethodDialog(target.form)) return;var valid = target.type === "submit" && ["button", "input"].indexOf(target.localName) > -1;if (!valid) {
          if (!(target.localName === "input" && target.type === "image")) return;dialogPolyfill.useValue = ev.offsetX + "," + ev.offsetY;
        }var dialog = findNearestDialog(target);if (!dialog) return;dialogPolyfill.formSubmitter = target;
      }, false);var nativeFormSubmit = HTMLFormElement.prototype.submit;var replacementFormSubmit = function replacementFormSubmit() {
        if (!isFormMethodDialog(this)) return nativeFormSubmit.call(this);
        var dialog = findNearestDialog(this);dialog && dialog.close();
      };HTMLFormElement.prototype.submit = replacementFormSubmit;document.addEventListener("submit", function (ev) {
        var form = ev.target;if (!isFormMethodDialog(form)) return;ev.preventDefault();var dialog = findNearestDialog(form);if (!dialog) return;var s = dialogPolyfill.formSubmitter;if (s && s.form === form) dialog.close(dialogPolyfill.useValue || s.value);else dialog.close();dialogPolyfill.formSubmitter = null;
      }, true);
    }dialogPolyfill["forceRegisterDialog"] = dialogPolyfill.forceRegisterDialog;
    dialogPolyfill["registerDialog"] = dialogPolyfill.registerDialog;if (typeof define === "function" && "amd" in define) define(function () {
      return dialogPolyfill;
    });else if (typeof module === "object" && typeof module["exports"] === "object") module["exports"] = dialogPolyfill;else window["dialogPolyfill"] = dialogPolyfill;
  })();(function () {
    var k,
        aa = "function" == typeof Object.defineProperties ? Object.defineProperty : function (a, b, c) {
      a != Array.prototype && a != Object.prototype && (a[b] = c.value);
    },
        ba = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this;function ca(a) {
      if (a) {
        for (var b = ba, c = ["Promise"], d = 0; d < c.length - 1; d++) {
          var e = c[d];e in b || (b[e] = {});b = b[e];
        }c = c[c.length - 1];d = b[c];a = a(d);a != d && null != a && aa(b, c, { configurable: !0, writable: !0, value: a });
      }
    }function da(a) {
      var b = 0;return function () {
        return b < a.length ? { done: !1, value: a[b++] } : { done: !0 };
      };
    }function ea(a) {
      var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];return b ? b.call(a) : { next: da(a) };
    }ca(function (a) {
      function b(a) {
        this.f = 0;this.h = void 0;this.a = [];var b = this.j();try {
          a(b.resolve, b.reject);
        } catch (r) {
          b.reject(r);
        }
      }function c() {
        this.a = null;
      }function d(a) {
        return a instanceof b ? a : new b(function (b) {
          b(a);
        });
      }if (a) return a;c.prototype.f = function (a) {
        null == this.a && (this.a = [], this.j());this.a.push(a);
      };c.prototype.j = function () {
        var a = this;this.h(function () {
          a.v();
        });
      };
      var e = ba.setTimeout;c.prototype.h = function (a) {
        e(a, 0);
      };c.prototype.v = function () {
        for (; this.a && this.a.length;) {
          var a = this.a;this.a = [];for (var b = 0; b < a.length; ++b) {
            var c = a[b];a[b] = null;try {
              c();
            } catch (n) {
              this.i(n);
            }
          }
        }this.a = null;
      };c.prototype.i = function (a) {
        this.h(function () {
          throw a;
        });
      };b.prototype.j = function () {
        function a(a) {
          return function (d) {
            c || (c = !0, a.call(b, d));
          };
        }var b = this,
            c = !1;return { resolve: a(this.I), reject: a(this.i) };
      };b.prototype.I = function (a) {
        if (a === this) this.i(new TypeError("A Promise cannot resolve to itself"));else if (a instanceof b) this.K(a);else {
          a: switch (typeof a) {case "object":
              var c = null != a;break a;case "function":
              c = !0;break a;default:
              c = !1;}c ? this.F(a) : this.v(a);
        }
      };b.prototype.F = function (a) {
        var b = void 0;try {
          b = a.then;
        } catch (r) {
          this.i(r);return;
        }"function" == typeof b ? this.O(b, a) : this.v(a);
      };b.prototype.i = function (a) {
        this.w(2, a);
      };b.prototype.v = function (a) {
        this.w(1, a);
      };b.prototype.w = function (a, b) {
        if (0 != this.f) throw Error("Cannot settle(" + a + ", " + b + "): Promise already settled in state" + this.f);this.f = a;this.h = b;
        this.C();
      };b.prototype.C = function () {
        if (null != this.a) {
          for (var a = 0; a < this.a.length; ++a) {
            f.f(this.a[a]);
          }this.a = null;
        }
      };var f = new c();b.prototype.K = function (a) {
        var b = this.j();a.Da(b.resolve, b.reject);
      };b.prototype.O = function (a, b) {
        var c = this.j();try {
          a.call(b, c.resolve, c.reject);
        } catch (n) {
          c.reject(n);
        }
      };b.prototype.then = function (a, c) {
        function d(a, b) {
          return "function" == typeof a ? function (b) {
            try {
              e(a(b));
            } catch (bl) {
              f(bl);
            }
          } : b;
        }var e,
            f,
            g = new b(function (a, b) {
          e = a;f = b;
        });this.Da(d(a, e), d(c, f));return g;
      };b.prototype.catch = function (a) {
        return this.then(void 0, a);
      };b.prototype.Da = function (a, b) {
        function c() {
          switch (d.f) {case 1:
              a(d.h);break;case 2:
              b(d.h);break;default:
              throw Error("Unexpected state: " + d.f);}
        }var d = this;null == this.a ? f.f(c) : this.a.push(c);
      };b.resolve = d;b.reject = function (a) {
        return new b(function (b, c) {
          c(a);
        });
      };b.race = function (a) {
        return new b(function (b, c) {
          for (var e = ea(a), f = e.next(); !f.done; f = e.next()) {
            d(f.value).Da(b, c);
          }
        });
      };b.all = function (a) {
        var c = ea(a),
            e = c.next();return e.done ? d([]) : new b(function (a, b) {
          function f(b) {
            return function (c) {
              g[b] = c;h--;0 == h && a(g);
            };
          }var g = [],
              h = 0;do {
            g.push(void 0), h++, d(e.value).Da(f(g.length - 1), b), e = c.next();
          } while (!e.done);
        });
      };return b;
    });var l = this;function fa(a) {
      return void 0 !== a;
    }function m(a) {
      return "string" == typeof a;
    }var ha = /^[\w+/_-]+[=]{0,2}$/,
        ia = null;function ja() {}function ka(a) {
      a.V = void 0;a.Sa = function () {
        return a.V ? a.V : a.V = new a();
      };
    }function ma(a) {
      var b = typeof a;if ("object" == b) {
        if (a) {
          if (a instanceof Array) return "array";if (a instanceof Object) return b;var c = Object.prototype.toString.call(a);if ("[object Window]" == c) return "object";
          if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array";if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function";
        } else return "null";
      } else if ("function" == b && "undefined" == typeof a.call) return "object";return b;
    }function na(a) {
      return null != a;
    }function oa(a) {
      return "array" == ma(a);
    }function pa(a) {
      var b = ma(a);
      return "array" == b || "object" == b && "number" == typeof a.length;
    }function qa(a) {
      return "function" == ma(a);
    }function ra(a) {
      var b = typeof a;return "object" == b && null != a || "function" == b;
    }var sa = "closure_uid_" + (1E9 * Math.random() >>> 0),
        ta = 0;function ua(a, b, c) {
      return a.call.apply(a.bind, arguments);
    }function va(a, b, c) {
      if (!a) throw Error();if (2 < arguments.length) {
        var d = Array.prototype.slice.call(arguments, 2);return function () {
          var c = Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c, d);return a.apply(b, c);
        };
      }return function () {
        return a.apply(b, arguments);
      };
    }function p(a, b, c) {
      Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? p = ua : p = va;return p.apply(null, arguments);
    }function wa(a, b) {
      var c = Array.prototype.slice.call(arguments, 1);return function () {
        var b = c.slice();b.push.apply(b, arguments);return a.apply(this, b);
      };
    }function q(a, b) {
      for (var c in b) {
        a[c] = b[c];
      }
    }var xa = Date.now || function () {
      return +new Date();
    };function ya(a, b) {
      a = a.split(".");var c = l;a[0] in c || "undefined" == typeof c.execScript || c.execScript("var " + a[0]);
      for (var d; a.length && (d = a.shift());) {
        !a.length && fa(b) ? c[d] = b : c[d] && c[d] !== Object.prototype[d] ? c = c[d] : c = c[d] = {};
      }
    }function t(a, b) {
      function c() {}c.prototype = b.prototype;a.o = b.prototype;a.prototype = new c();a.prototype.constructor = a;a.fc = function (a, c, f) {
        for (var d = Array(arguments.length - 2), e = 2; e < arguments.length; e++) {
          d[e - 2] = arguments[e];
        }return b.prototype[c].apply(a, d);
      };
    }function za(a) {
      if (Error.captureStackTrace) Error.captureStackTrace(this, za);else {
        var b = Error().stack;b && (this.stack = b);
      }a && (this.message = String(a));
    }
    t(za, Error);za.prototype.name = "CustomError";var Aa;function Ba(a, b) {
      a = a.split("%s");for (var c = "", d = a.length - 1, e = 0; e < d; e++) {
        c += a[e] + (e < b.length ? b[e] : "%s");
      }za.call(this, c + a[d]);
    }t(Ba, za);Ba.prototype.name = "AssertionError";function Ca(a, b) {
      throw new Ba("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
    }var Da = Array.prototype.indexOf ? function (a, b) {
      return Array.prototype.indexOf.call(a, b, void 0);
    } : function (a, b) {
      if (m(a)) return m(b) && 1 == b.length ? a.indexOf(b, 0) : -1;for (var c = 0; c < a.length; c++) {
        if (c in a && a[c] === b) return c;
      }return -1;
    },
        Ea = Array.prototype.forEach ? function (a, b, c) {
      Array.prototype.forEach.call(a, b, c);
    } : function (a, b, c) {
      for (var d = a.length, e = m(a) ? a.split("") : a, f = 0; f < d; f++) {
        f in e && b.call(c, e[f], f, a);
      }
    };function Fa(a, b) {
      var c = a.length,
          d = m(a) ? a.split("") : a;for (--c; 0 <= c; --c) {
        c in d && b.call(void 0, d[c], c, a);
      }
    }var Ga = Array.prototype.filter ? function (a, b) {
      return Array.prototype.filter.call(a, b, void 0);
    } : function (a, b) {
      for (var c = a.length, d = [], e = 0, f = m(a) ? a.split("") : a, g = 0; g < c; g++) {
        if (g in f) {
          var h = f[g];b.call(void 0, h, g, a) && (d[e++] = h);
        }
      }return d;
    },
        Ha = Array.prototype.map ? function (a, b) {
      return Array.prototype.map.call(a, b, void 0);
    } : function (a, b) {
      for (var c = a.length, d = Array(c), e = m(a) ? a.split("") : a, f = 0; f < c; f++) {
        f in e && (d[f] = b.call(void 0, e[f], f, a));
      }return d;
    },
        Ia = Array.prototype.some ? function (a, b) {
      return Array.prototype.some.call(a, b, void 0);
    } : function (a, b) {
      for (var c = a.length, d = m(a) ? a.split("") : a, e = 0; e < c; e++) {
        if (e in d && b.call(void 0, d[e], e, a)) return !0;
      }return !1;
    };function Ja(a, b, c) {
      for (var d = a.length, e = m(a) ? a.split("") : a, f = 0; f < d; f++) {
        if (f in e && b.call(c, e[f], f, a)) return f;
      }return -1;
    }function Ka(a, b) {
      return 0 <= Da(a, b);
    }function La(a, b) {
      b = Da(a, b);var c;(c = 0 <= b) && Ma(a, b);return c;
    }function Ma(a, b) {
      return 1 == Array.prototype.splice.call(a, b, 1).length;
    }function Na(a, b) {
      b = Ja(a, b, void 0);0 <= b && Ma(a, b);
    }function Oa(a, b) {
      var c = 0;Fa(a, function (d, e) {
        b.call(void 0, d, e, a) && Ma(a, e) && c++;
      });
    }function Pa(a) {
      return Array.prototype.concat.apply([], arguments);
    }function Qa(a) {
      var b = a.length;if (0 < b) {
        for (var c = Array(b), d = 0; d < b; d++) {
          c[d] = a[d];
        }return c;
      }return [];
    }
    function Ra(a, b, c, d) {
      return Array.prototype.splice.apply(a, Sa(arguments, 1));
    }function Sa(a, b, c) {
      return 2 >= arguments.length ? Array.prototype.slice.call(a, b) : Array.prototype.slice.call(a, b, c);
    }var Ta = String.prototype.trim ? function (a) {
      return a.trim();
    } : function (a) {
      return (/^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]
      );
    };function Ua(a) {
      if (!Va.test(a)) return a;-1 != a.indexOf("&") && (a = a.replace(Wa, "&amp;"));-1 != a.indexOf("<") && (a = a.replace(Xa, "&lt;"));-1 != a.indexOf(">") && (a = a.replace(Ya, "&gt;"));-1 != a.indexOf('"') && (a = a.replace(Za, "&quot;"));-1 != a.indexOf("'") && (a = a.replace($a, "&#39;"));-1 != a.indexOf("\x00") && (a = a.replace(ab, "&#0;"));return a;
    }var Wa = /&/g,
        Xa = /</g,
        Ya = />/g,
        Za = /"/g,
        $a = /'/g,
        ab = /\x00/g,
        Va = /[\x00&<>"']/;function bb(a, b) {
      return a < b ? -1 : a > b ? 1 : 0;
    }var cb;a: {
      var db = l.navigator;if (db) {
        var eb = db.userAgent;if (eb) {
          cb = eb;break a;
        }
      }cb = "";
    }function u(a) {
      return -1 != cb.indexOf(a);
    }function fb(a, b, c) {
      for (var d in a) {
        b.call(c, a[d], d, a);
      }
    }function gb(a) {
      var b = {},
          c;for (c in a) {
        b[c] = a[c];
      }return b;
    }var hb = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
    function ib(a, b) {
      for (var c, d, e = 1; e < arguments.length; e++) {
        d = arguments[e];for (c in d) {
          a[c] = d[c];
        }for (var f = 0; f < hb.length; f++) {
          c = hb[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
        }
      }
    }function jb() {
      return (u("Chrome") || u("CriOS")) && !u("Edge");
    }function kb(a) {
      kb[" "](a);return a;
    }kb[" "] = ja;function lb(a, b) {
      var c = mb;return Object.prototype.hasOwnProperty.call(c, a) ? c[a] : c[a] = b(a);
    }var nb = u("Opera"),
        v = u("Trident") || u("MSIE"),
        ob = u("Edge"),
        pb = ob || v,
        qb = u("Gecko") && !(-1 != cb.toLowerCase().indexOf("webkit") && !u("Edge")) && !(u("Trident") || u("MSIE")) && !u("Edge"),
        rb = -1 != cb.toLowerCase().indexOf("webkit") && !u("Edge"),
        sb = rb && u("Mobile"),
        tb = u("Macintosh");function ub() {
      var a = l.document;return a ? a.documentMode : void 0;
    }var vb;a: {
      var wb = "",
          xb = function () {
        var a = cb;if (qb) return (/rv:([^\);]+)(\)|;)/.exec(a)
        );if (ob) return (/Edge\/([\d\.]+)/.exec(a)
        );if (v) return (/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a)
        );if (rb) return (/WebKit\/(\S+)/.exec(a)
        );if (nb) return (/(?:Version)[ \/]?(\S+)/.exec(a)
        );
      }();xb && (wb = xb ? xb[1] : "");if (v) {
        var yb = ub();
        if (null != yb && yb > parseFloat(wb)) {
          vb = String(yb);break a;
        }
      }vb = wb;
    }var mb = {};function zb(a) {
      return lb(a, function () {
        for (var b = 0, c = Ta(String(vb)).split("."), d = Ta(String(a)).split("."), e = Math.max(c.length, d.length), f = 0; 0 == b && f < e; f++) {
          var g = c[f] || "",
              h = d[f] || "";do {
            g = /(\d*)(\D*)(.*)/.exec(g) || ["", "", "", ""];h = /(\d*)(\D*)(.*)/.exec(h) || ["", "", "", ""];if (0 == g[0].length && 0 == h[0].length) break;b = bb(0 == g[1].length ? 0 : parseInt(g[1], 10), 0 == h[1].length ? 0 : parseInt(h[1], 10)) || bb(0 == g[2].length, 0 == h[2].length) || bb(g[2], h[2]);
            g = g[3];h = h[3];
          } while (0 == b);
        }return 0 <= b;
      });
    }var Ab;var Bb = l.document;Ab = Bb && v ? ub() || ("CSS1Compat" == Bb.compatMode ? parseInt(vb, 10) : 5) : void 0;function Cb(a, b) {
      this.a = a === Db && b || "";this.f = Eb;
    }Cb.prototype.ka = !0;Cb.prototype.ia = function () {
      return this.a;
    };Cb.prototype.toString = function () {
      return "Const{" + this.a + "}";
    };function Fb(a) {
      if (a instanceof Cb && a.constructor === Cb && a.f === Eb) return a.a;Ca("expected object of type Const, got '" + a + "'");return "type_error:Const";
    }var Eb = {},
        Db = {};function Gb() {
      this.a = "";this.h = Hb;
    }
    Gb.prototype.ka = !0;Gb.prototype.ia = function () {
      return this.a;
    };Gb.prototype.f = function () {
      return 1;
    };Gb.prototype.toString = function () {
      return "TrustedResourceUrl{" + this.a + "}";
    };function Ib(a) {
      if (a instanceof Gb && a.constructor === Gb && a.h === Hb) return a.a;Ca("expected object of type TrustedResourceUrl, got '" + a + "' of type " + ma(a));return "type_error:TrustedResourceUrl";
    }var Hb = {};function Jb(a) {
      var b = new Gb();b.a = a;return b;
    }function Kb() {
      this.a = "";this.h = Lb;
    }Kb.prototype.ka = !0;Kb.prototype.ia = function () {
      return this.a;
    };
    Kb.prototype.f = function () {
      return 1;
    };Kb.prototype.toString = function () {
      return "SafeUrl{" + this.a + "}";
    };function Mb(a) {
      if (a instanceof Kb && a.constructor === Kb && a.h === Lb) return a.a;Ca("expected object of type SafeUrl, got '" + a + "' of type " + ma(a));return "type_error:SafeUrl";
    }var Nb = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;function Ob(a) {
      if (a instanceof Kb) return a;a = "object" == typeof a && a.ka ? a.ia() : String(a);Nb.test(a) || (a = "about:invalid#zClosurez");return Pb(a);
    }var Lb = {};function Pb(a) {
      var b = new Kb();
      b.a = a;return b;
    }Pb("about:blank");function Qb() {
      this.a = "";this.f = Rb;
    }Qb.prototype.ka = !0;var Rb = {};Qb.prototype.ia = function () {
      return this.a;
    };Qb.prototype.toString = function () {
      return "SafeStyle{" + this.a + "}";
    };function Sb() {
      this.a = "";this.j = Tb;this.h = null;
    }Sb.prototype.f = function () {
      return this.h;
    };Sb.prototype.ka = !0;Sb.prototype.ia = function () {
      return this.a;
    };Sb.prototype.toString = function () {
      return "SafeHtml{" + this.a + "}";
    };function Ub(a) {
      if (a instanceof Sb && a.constructor === Sb && a.j === Tb) return a.a;Ca("expected object of type SafeHtml, got '" + a + "' of type " + ma(a));return "type_error:SafeHtml";
    }var Tb = {};function Vb(a, b) {
      var c = new Sb();c.a = a;c.h = b;return c;
    }Vb("<!DOCTYPE html>", 0);Vb("", 0);Vb("<br>", 0);var Wb = function (a) {
      var b = !1,
          c;return function () {
        b || (c = a(), b = !0);return c;
      };
    }(function () {
      if ("undefined" === typeof document) return !1;var a = document.createElement("div");a.innerHTML = "<div><div></div></div>";if (!a.firstChild) return !1;var b = a.firstChild.firstChild;a.innerHTML = "";return !b.parentElement;
    });function Xb(a, b) {
      a.src = Ib(b);if (null === ia) {
        a: {
          b = l.document;if ((b = b.querySelector && b.querySelector("script[nonce]")) && (b = b.nonce || b.getAttribute("nonce")) && ha.test(b)) break a;b = null;
        }ia = b || "";
      }(b = ia) && a.setAttribute("nonce", b);
    }function Yb(a, b) {
      this.a = fa(a) ? a : 0;this.f = fa(b) ? b : 0;
    }Yb.prototype.toString = function () {
      return "(" + this.a + ", " + this.f + ")";
    };Yb.prototype.ceil = function () {
      this.a = Math.ceil(this.a);this.f = Math.ceil(this.f);return this;
    };Yb.prototype.floor = function () {
      this.a = Math.floor(this.a);this.f = Math.floor(this.f);return this;
    };Yb.prototype.round = function () {
      this.a = Math.round(this.a);this.f = Math.round(this.f);return this;
    };function Zb(a, b) {
      this.width = a;this.height = b;
    }k = Zb.prototype;k.toString = function () {
      return "(" + this.width + " x " + this.height + ")";
    };k.aspectRatio = function () {
      return this.width / this.height;
    };k.ceil = function () {
      this.width = Math.ceil(this.width);this.height = Math.ceil(this.height);return this;
    };k.floor = function () {
      this.width = Math.floor(this.width);this.height = Math.floor(this.height);return this;
    };k.round = function () {
      this.width = Math.round(this.width);this.height = Math.round(this.height);return this;
    };function $b(a) {
      return a ? new ac(bc(a)) : Aa || (Aa = new ac());
    }function cc(a, b) {
      var c = b || document;return c.querySelectorAll && c.querySelector ? c.querySelectorAll("." + a) : dc(document, a, b);
    }function ec(a, b) {
      var c = b || document;if (c.getElementsByClassName) a = c.getElementsByClassName(a)[0];else {
        c = document;var d = b || c;a = d.querySelectorAll && d.querySelector && a ? d.querySelector(a ? "." + a : "") : dc(c, a, b)[0] || null;
      }return a || null;
    }function dc(a, b, c) {
      var d;a = c || a;if (a.querySelectorAll && a.querySelector && b) return a.querySelectorAll(b ? "." + b : "");if (b && a.getElementsByClassName) {
        var e = a.getElementsByClassName(b);return e;
      }e = a.getElementsByTagName("*");if (b) {
        var f = {};for (c = d = 0; a = e[c]; c++) {
          var g = a.className;"function" == typeof g.split && Ka(g.split(/\s+/), b) && (f[d++] = a);
        }f.length = d;return f;
      }return e;
    }function fc(a, b) {
      fb(b, function (b, d) {
        b && "object" == typeof b && b.ka && (b = b.ia());"style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : gc.hasOwnProperty(d) ? a.setAttribute(gc[d], b) : 0 == d.lastIndexOf("aria-", 0) || 0 == d.lastIndexOf("data-", 0) ? a.setAttribute(d, b) : a[d] = b;
      });
    }var gc = { cellpadding: "cellPadding", cellspacing: "cellSpacing", colspan: "colSpan", frameborder: "frameBorder", height: "height", maxlength: "maxLength", nonce: "nonce", role: "role", rowspan: "rowSpan", type: "type", usemap: "useMap", valign: "vAlign", width: "width" };function hc(a) {
      return a.scrollingElement ? a.scrollingElement : rb || "CSS1Compat" != a.compatMode ? a.body || a.documentElement : a.documentElement;
    }function ic(a) {
      a && a.parentNode && a.parentNode.removeChild(a);
    }
    function bc(a) {
      return 9 == a.nodeType ? a : a.ownerDocument || a.document;
    }function jc(a, b) {
      if ("textContent" in a) a.textContent = b;else if (3 == a.nodeType) a.data = String(b);else if (a.firstChild && 3 == a.firstChild.nodeType) {
        for (; a.lastChild != a.firstChild;) {
          a.removeChild(a.lastChild);
        }a.firstChild.data = String(b);
      } else {
        for (var c; c = a.firstChild;) {
          a.removeChild(c);
        }a.appendChild(bc(a).createTextNode(String(b)));
      }
    }function kc(a, b) {
      return b ? lc(a, function (a) {
        return !b || m(a.className) && Ka(a.className.split(/\s+/), b);
      }) : null;
    }function lc(a, b) {
      for (var c = 0; a;) {
        if (b(a)) return a;a = a.parentNode;c++;
      }return null;
    }function ac(a) {
      this.a = a || l.document || document;
    }ac.prototype.N = function () {
      return m(void 0) ? this.a.getElementById(void 0) : void 0;
    };var mc = "StopIteration" in l ? l.StopIteration : { message: "StopIteration", stack: "" };function nc() {}nc.prototype.next = function () {
      throw mc;
    };nc.prototype.fa = function () {
      return this;
    };function oc(a) {
      if (a instanceof nc) return a;if ("function" == typeof a.fa) return a.fa(!1);if (pa(a)) {
        var b = 0,
            c = new nc();c.next = function () {
          for (;;) {
            if (b >= a.length) throw mc;if (b in a) return a[b++];b++;
          }
        };return c;
      }throw Error("Not implemented");
    }function pc(a, b) {
      if (pa(a)) try {
        Ea(a, b, void 0);
      } catch (c) {
        if (c !== mc) throw c;
      } else {
        a = oc(a);try {
          for (;;) {
            b.call(void 0, a.next(), void 0, a);
          }
        } catch (c$1) {
          if (c$1 !== mc) throw c$1;
        }
      }
    }function qc(a) {
      if (pa(a)) return Qa(a);a = oc(a);var b = [];pc(a, function (a) {
        b.push(a);
      });return b;
    }function rc(a, b) {
      this.f = {};this.a = [];this.j = this.h = 0;var c = arguments.length;if (1 < c) {
        if (c % 2) throw Error("Uneven number of arguments");for (var d = 0; d < c; d += 2) {
          this.set(arguments[d], arguments[d + 1]);
        }
      } else if (a) if (a instanceof rc) for (c = a.ha(), d = 0; d < c.length; d++) {
        this.set(c[d], a.get(c[d]));
      } else for (d in a) {
        this.set(d, a[d]);
      }
    }k = rc.prototype;k.ja = function () {
      sc(this);for (var a = [], b = 0; b < this.a.length; b++) {
        a.push(this.f[this.a[b]]);
      }return a;
    };k.ha = function () {
      sc(this);return this.a.concat();
    };k.clear = function () {
      this.f = {};this.j = this.h = this.a.length = 0;
    };function sc(a) {
      if (a.h != a.a.length) {
        for (var b = 0, c = 0; b < a.a.length;) {
          var d = a.a[b];tc(a.f, d) && (a.a[c++] = d);b++;
        }a.a.length = c;
      }if (a.h != a.a.length) {
        var e = {};for (c = b = 0; b < a.a.length;) {
          d = a.a[b], tc(e, d) || (a.a[c++] = d, e[d] = 1), b++;
        }a.a.length = c;
      }
    }k.get = function (a, b) {
      return tc(this.f, a) ? this.f[a] : b;
    };k.set = function (a, b) {
      tc(this.f, a) || (this.h++, this.a.push(a), this.j++);this.f[a] = b;
    };k.forEach = function (a, b) {
      for (var c = this.ha(), d = 0; d < c.length; d++) {
        var e = c[d],
            f = this.get(e);a.call(b, f, e, this);
      }
    };k.fa = function (a) {
      sc(this);var b = 0,
          c = this.j,
          d = this,
          e = new nc();e.next = function () {
        if (c != d.j) throw Error("The map has changed since the iterator was created");if (b >= d.a.length) throw mc;
        var e = d.a[b++];return a ? e : d.f[e];
      };return e;
    };function tc(a, b) {
      return Object.prototype.hasOwnProperty.call(a, b);
    }var uc = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;function vc(a, b) {
      if (a) {
        a = a.split("&");for (var c = 0; c < a.length; c++) {
          var d = a[c].indexOf("="),
              e = null;if (0 <= d) {
            var f = a[c].substring(0, d);e = a[c].substring(d + 1);
          } else f = a[c];b(f, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "");
        }
      }
    }function wc(a, b, c, d) {
      for (var e = c.length; 0 <= (b = a.indexOf(c, b)) && b < d;) {
        var f = a.charCodeAt(b - 1);if (38 == f || 63 == f) if (f = a.charCodeAt(b + e), !f || 61 == f || 38 == f || 35 == f) return b;b += e + 1;
      }return -1;
    }var xc = /#|$/;function yc(a, b) {
      var c = a.search(xc),
          d = wc(a, 0, b, c);if (0 > d) return null;var e = a.indexOf("&", d);if (0 > e || e > c) e = c;d += b.length + 1;return decodeURIComponent(a.substr(d, e - d).replace(/\+/g, " "));
    }var zc = /[?&]($|#)/;function Ac(a, b) {
      this.h = this.w = this.j = "";this.C = null;this.i = this.f = "";this.v = !1;var c;a instanceof Ac ? (this.v = fa(b) ? b : a.v, Bc(this, a.j), this.w = a.w, this.h = a.h, Dc(this, a.C), this.f = a.f, Ec(this, Fc(a.a)), this.i = a.i) : a && (c = String(a).match(uc)) ? (this.v = !!b, Bc(this, c[1] || "", !0), this.w = Gc(c[2] || ""), this.h = Gc(c[3] || "", !0), Dc(this, c[4]), this.f = Gc(c[5] || "", !0), Ec(this, c[6] || "", !0), this.i = Gc(c[7] || "")) : (this.v = !!b, this.a = new Hc(null, this.v));
    }Ac.prototype.toString = function () {
      var a = [],
          b = this.j;b && a.push(Ic(b, Jc, !0), ":");var c = this.h;if (c || "file" == b) a.push("//"), (b = this.w) && a.push(Ic(b, Jc, !0), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.C, null != c && a.push(":", String(c));if (c = this.f) this.h && "/" != c.charAt(0) && a.push("/"), a.push(Ic(c, "/" == c.charAt(0) ? Kc : Lc, !0));(c = this.a.toString()) && a.push("?", c);(c = this.i) && a.push("#", Ic(c, Mc));return a.join("");
    };Ac.prototype.resolve = function (a) {
      var b = new Ac(this),
          c = !!a.j;c ? Bc(b, a.j) : c = !!a.w;c ? b.w = a.w : c = !!a.h;c ? b.h = a.h : c = null != a.C;var d = a.f;if (c) Dc(b, a.C);else if (c = !!a.f) {
        if ("/" != d.charAt(0)) if (this.h && !this.f) d = "/" + d;else {
          var e = b.f.lastIndexOf("/");-1 != e && (d = b.f.substr(0, e + 1) + d);
        }e = d;if (".." == e || "." == e) d = "";else if (-1 != e.indexOf("./") || -1 != e.indexOf("/.")) {
          d = 0 == e.lastIndexOf("/", 0);e = e.split("/");for (var f = [], g = 0; g < e.length;) {
            var h = e[g++];"." == h ? d && g == e.length && f.push("") : ".." == h ? ((1 < f.length || 1 == f.length && "" != f[0]) && f.pop(), d && g == e.length && f.push("")) : (f.push(h), d = !0);
          }d = f.join("/");
        } else d = e;
      }c ? b.f = d : c = "" !== a.a.toString();c ? Ec(b, Fc(a.a)) : c = !!a.i;c && (b.i = a.i);return b;
    };function Bc(a, b, c) {
      a.j = c ? Gc(b, !0) : b;a.j && (a.j = a.j.replace(/:$/, ""));
    }function Dc(a, b) {
      if (b) {
        b = Number(b);if (isNaN(b) || 0 > b) throw Error("Bad port number " + b);a.C = b;
      } else a.C = null;
    }function Ec(a, b, c) {
      b instanceof Hc ? (a.a = b, Nc(a.a, a.v)) : (c || (b = Ic(b, Oc)), a.a = new Hc(b, a.v));
    }function Pc(a) {
      return a instanceof Ac ? new Ac(a) : new Ac(a, void 0);
    }function Qc(a, b) {
      a instanceof Ac || (a = Pc(a));b instanceof Ac || (b = Pc(b));return a.resolve(b);
    }function Gc(a, b) {
      return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : "";
    }function Ic(a, b, c) {
      return m(a) ? (a = encodeURI(a).replace(b, Rc), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null;
    }function Rc(a) {
      a = a.charCodeAt(0);return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16);
    }var Jc = /[#\/\?@]/g,
        Lc = /[#\?:]/g,
        Kc = /[#\?]/g,
        Oc = /[#\?@]/g,
        Mc = /#/g;function Hc(a, b) {
      this.f = this.a = null;this.h = a || null;this.j = !!b;
    }function Sc(a) {
      a.a || (a.a = new rc(), a.f = 0, a.h && vc(a.h, function (b, c) {
        a.add(decodeURIComponent(b.replace(/\+/g, " ")), c);
      }));
    }k = Hc.prototype;k.add = function (a, b) {
      Sc(this);this.h = null;a = Tc(this, a);var c = this.a.get(a);c || this.a.set(a, c = []);c.push(b);this.f += 1;return this;
    };function Uc(a, b) {
      Sc(a);
      b = Tc(a, b);tc(a.a.f, b) && (a.h = null, a.f -= a.a.get(b).length, a = a.a, tc(a.f, b) && (delete a.f[b], a.h--, a.j++, a.a.length > 2 * a.h && sc(a)));
    }k.clear = function () {
      this.a = this.h = null;this.f = 0;
    };function Vc(a, b) {
      Sc(a);b = Tc(a, b);return tc(a.a.f, b);
    }k.forEach = function (a, b) {
      Sc(this);this.a.forEach(function (c, d) {
        Ea(c, function (c) {
          a.call(b, c, d, this);
        }, this);
      }, this);
    };k.ha = function () {
      Sc(this);for (var a = this.a.ja(), b = this.a.ha(), c = [], d = 0; d < b.length; d++) {
        for (var e = a[d], f = 0; f < e.length; f++) {
          c.push(b[d]);
        }
      }return c;
    };k.ja = function (a) {
      Sc(this);
      var b = [];if (m(a)) Vc(this, a) && (b = Pa(b, this.a.get(Tc(this, a))));else {
        a = this.a.ja();for (var c = 0; c < a.length; c++) {
          b = Pa(b, a[c]);
        }
      }return b;
    };k.set = function (a, b) {
      Sc(this);this.h = null;a = Tc(this, a);Vc(this, a) && (this.f -= this.a.get(a).length);this.a.set(a, [b]);this.f += 1;return this;
    };k.get = function (a, b) {
      if (!a) return b;a = this.ja(a);return 0 < a.length ? String(a[0]) : b;
    };k.toString = function () {
      if (this.h) return this.h;if (!this.a) return "";for (var a = [], b = this.a.ha(), c = 0; c < b.length; c++) {
        var d = b[c],
            e = encodeURIComponent(String(d));
        d = this.ja(d);for (var f = 0; f < d.length; f++) {
          var g = e;"" !== d[f] && (g += "=" + encodeURIComponent(String(d[f])));a.push(g);
        }
      }return this.h = a.join("&");
    };function Fc(a) {
      var b = new Hc();b.h = a.h;a.a && (b.a = new rc(a.a), b.f = a.f);return b;
    }function Tc(a, b) {
      b = String(b);a.j && (b = b.toLowerCase());return b;
    }function Nc(a, b) {
      b && !a.j && (Sc(a), a.h = null, a.a.forEach(function (a, b) {
        var c = b.toLowerCase();b != c && (Uc(this, b), Uc(this, c), 0 < a.length && (this.h = null, this.a.set(Tc(this, c), Qa(a)), this.f += a.length));
      }, a));a.j = b;
    }var Wc = { qc: !0 },
        Xc = { sc: !0 },
        Yc = { pc: !0 },
        Zc = { rc: !0 };function $c() {
      throw Error("Do not instantiate directly");
    }$c.prototype.ta = null;$c.prototype.toString = function () {
      return this.content;
    };function ad(a, b, c, d) {
      a = a(b || bd, void 0, c);d = (d || $b()).a.createElement("DIV");a = cd(a);a.match(dd);if (Wb()) for (; d.lastChild;) {
        d.removeChild(d.lastChild);
      }d.innerHTML = a;1 == d.childNodes.length && (a = d.firstChild, 1 == a.nodeType && (d = a));return d;
    }function cd(a) {
      if (!ra(a)) return String(a);if (a instanceof $c) {
        if (a.ca === Wc) return a.content;if (a.ca === Zc) return Ua(a.content);
      }Ca("Soy template output is unsafe for use as HTML: " + a);return "zSoyz";
    }var dd = /^<(body|caption|col|colgroup|head|html|tr|td|th|tbody|thead|tfoot)>/i,
        bd = {};function ed(a) {
      if (null != a) switch (a.ta) {case 1:
          return 1;case -1:
          return -1;case 0:
          return 0;}return null;
    }function fd() {
      $c.call(this);
    }t(fd, $c);fd.prototype.ca = Wc;function w(a) {
      return null != a && a.ca === Wc ? a : a instanceof Sb ? x(Ub(a), a.f()) : x(Ua(String(String(a))), ed(a));
    }function gd() {
      $c.call(this);
    }t(gd, $c);gd.prototype.ca = Xc;gd.prototype.ta = 1;function hd(a, b) {
      this.content = String(a);this.ta = null != b ? b : null;
    }t(hd, $c);hd.prototype.ca = Zc;function y(a) {
      return new hd(a, void 0);
    }var x = function (a) {
      function b(a) {
        this.content = a;
      }b.prototype = a.prototype;return function (a, d) {
        a = new b(String(a));void 0 !== d && (a.ta = d);return a;
      };
    }(fd),
        id = function (a) {
      function b(a) {
        this.content = a;
      }b.prototype = a.prototype;return function (a) {
        return new b(String(a));
      };
    }(gd);function jd(a) {
      function b() {}var c = { label: z("Neues Passwort") };b.prototype = a;a = new b();for (var d in c) {
        a[d] = c[d];
      }return a;
    }function z(a) {
      return (a = String(a)) ? new hd(a, void 0) : "";
    }var kd = function (a) {
      function b(a) {
        this.content = a;
      }b.prototype = a.prototype;return function (a, d) {
        a = String(a);if (!a) return "";a = new b(a);void 0 !== d && (a.ta = d);return a;
      };
    }(fd);function ld(a) {
      return null != a && a.ca === Wc ? String(String(a.content).replace(md, "").replace(nd, "&lt;")).replace(od, pd) : Ua(String(a));
    }function qd(a) {
      null != a && a.ca === Xc ? a = String(a).replace(rd, sd) : a instanceof Kb ? a = String(Mb(a)).replace(rd, sd) : (a = String(a), td.test(a) ? a = a.replace(rd, sd) : (Ca("Bad value `%s` for |filterNormalizeUri", [a]), a = "#zSoyz"));
      return a;
    }var ud = { "\x00": "&#0;", "\t": "&#9;", "\n": "&#10;", "\x0B": "&#11;", "\f": "&#12;", "\r": "&#13;", " ": "&#32;", '"': "&quot;", "&": "&amp;", "'": "&#39;", "-": "&#45;", "/": "&#47;", "<": "&lt;", "=": "&#61;", ">": "&gt;", "`": "&#96;", "\u0085": "&#133;", "\u00a0": "&#160;", "\u2028": "&#8232;", "\u2029": "&#8233;" };function pd(a) {
      return ud[a];
    }var vd = { "\x00": "%00", "\u0001": "%01", "\u0002": "%02", "\u0003": "%03", "\u0004": "%04", "\u0005": "%05", "\u0006": "%06", "\u0007": "%07", "\b": "%08", "\t": "%09", "\n": "%0A", "\x0B": "%0B", "\f": "%0C",
      "\r": "%0D", "\u000e": "%0E", "\u000f": "%0F", "\u0010": "%10", "\u0011": "%11", "\u0012": "%12", "\u0013": "%13", "\u0014": "%14", "\u0015": "%15", "\u0016": "%16", "\u0017": "%17", "\u0018": "%18", "\u0019": "%19", "\u001a": "%1A", "\u001b": "%1B", "\u001c": "%1C", "\u001d": "%1D", "\u001e": "%1E", "\u001f": "%1F", " ": "%20", '"': "%22", "'": "%27", "(": "%28", ")": "%29", "<": "%3C", ">": "%3E", "\\": "%5C", "{": "%7B", "}": "%7D", "\u007f": "%7F", "\u0085": "%C2%85", "\u00a0": "%C2%A0", "\u2028": "%E2%80%A8", "\u2029": "%E2%80%A9", "\uff01": "%EF%BC%81", "\uff03": "%EF%BC%83",
      "\uff04": "%EF%BC%84", "\uff06": "%EF%BC%86", "\uff07": "%EF%BC%87", "\uff08": "%EF%BC%88", "\uff09": "%EF%BC%89", "\uff0a": "%EF%BC%8A", "\uff0b": "%EF%BC%8B", "\uff0c": "%EF%BC%8C", "\uff0f": "%EF%BC%8F", "\uff1a": "%EF%BC%9A", "\uff1b": "%EF%BC%9B", "\uff1d": "%EF%BC%9D", "\uff1f": "%EF%BC%9F", "\uff20": "%EF%BC%A0", "\uff3b": "%EF%BC%BB", "\uff3d": "%EF%BC%BD" };function sd(a) {
      return vd[a];
    }var od = /[\x00\x22\x27\x3c\x3e]/g,
        rd = /[\x00- \x22\x27-\x29\x3c\x3e\\\x7b\x7d\x7f\x85\xa0\u2028\u2029\uff01\uff03\uff04\uff06-\uff0c\uff0f\uff1a\uff1b\uff1d\uff1f\uff20\uff3b\uff3d]/g,
        wd = /^(?!-*(?:expression|(?:moz-)?binding))(?:[.#]?-?(?:[_a-z0-9-]+)(?:-[_a-z0-9-]+)*-?|-?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[a-z]{1,2}|%)?|!important|)$/i,
        td = /^(?![^#?]*\/(?:\.|%2E){2}(?:[\/?#]|$))(?:(?:https?|mailto):|[^&:\/?#]*(?:[\/?#]|$))/i,
        md = /<(?:!|\/?([a-zA-Z][a-zA-Z0-9:\-]*))(?:[^>'"]|"[^"]*"|'[^']*')*>/g,
        nd = /</g;function xd() {
      return y("Geben Sie eine g\u00fcltige Telefonnummer ein");
    }function yd() {
      return y("Falscher Code. Versuchen Sie es noch einmal.");
    }function zd() {
      return y("Geben Sie Ihr Passwort ein");
    }
    function Ad() {
      return y("Ein Problem ist aufgetreten. Bitte versuchen Sie es noch einmal");
    }function Bd() {
      return y("Diese E-Mail-Adresse ist bereits vorhanden und es ist keine Anmeldemethode festgelegt. Bitte setzen Sie das Passwort zur\u00fcck, um Zugriff zu erhalten.");
    }function Cd() {
      return y("Melden Sie sich erneut an, um diesen Vorgang durchzuf\u00fchren");
    }function Dd(a, b, c) {
      this.code = Ed + a;if (!(a = b)) {
        a = "";switch (this.code) {case "firebaseui/merge-conflict":
            a += "Der aktuelle anonyme Nutzer konnte sein Konto nicht upgraden, weil die entsprechenden Anmeldedaten bereits mit einem anderen nicht-anonymen Nutzerkonto verkn\u00fcpft sind.";
            break;default:
            a += Ad();}a = y(a).toString();
      }this.message = a || "";this.credential = c || null;
    }t(Dd, Error);Dd.prototype.na = function () {
      return { code: this.code, message: this.message };
    };Dd.prototype.toJSON = function () {
      return this.na();
    };var Ed = "firebaseui/";function Fd() {
      this.V = {};
    }function Gd(a, b, c) {
      if (b.toLowerCase() in a.V) throw Error("Configuration " + b + " has already been defined.");a.V[b.toLowerCase()] = c;
    }function Hd(a, b, c) {
      if (!(b.toLowerCase() in a.V)) throw Error("Configuration " + b + " is not defined.");a.V[b.toLowerCase()] = c;
    }Fd.prototype.get = function (a) {
      if (!(a.toLowerCase() in this.V)) throw Error("Configuration " + a + " is not defined.");return this.V[a.toLowerCase()];
    };function Id(a, b) {
      a = a.get(b);if (!a) throw Error("Configuration " + b + " is required.");return a;
    }function Jd() {
      this.f = void 0;this.a = {};
    }k = Jd.prototype;k.set = function (a, b) {
      Kd(this, a, b, !1);
    };k.add = function (a, b) {
      Kd(this, a, b, !0);
    };function Kd(a, b, c, d) {
      for (var e = 0; e < b.length; e++) {
        var f = b.charAt(e);a.a[f] || (a.a[f] = new Jd());a = a.a[f];
      }if (d && void 0 !== a.f) throw Error('The collection already contains the key "' + b + '"');a.f = c;
    }k.get = function (a) {
      a: {
        for (var b = this, c = 0; c < a.length; c++) {
          if (b = b.a[a.charAt(c)], !b) {
            a = void 0;break a;
          }
        }a = b;
      }return a ? a.f : void 0;
    };k.ja = function () {
      var a = [];Ld(this, a);return a;
    };function Ld(a, b) {
      void 0 !== a.f && b.push(a.f);for (var c in a.a) {
        Ld(a.a[c], b);
      }
    }k.ha = function () {
      var a = [];Md(this, "", a);return a;
    };function Md(a, b, c) {
      void 0 !== a.f && c.push(b);for (var d in a.a) {
        Md(a.a[d], b + d, c);
      }
    }k.clear = function () {
      this.a = {};this.f = void 0;
    };function Nd(a) {
      this.a = a;this.f = new Jd();for (a = 0; a < this.a.length; a++) {
        var b = this.f.get("+" + this.a[a].b);b ? b.push(this.a[a]) : this.f.add("+" + this.a[a].b, [this.a[a]]);
      }
    }function Od(a, b) {
      a = a.f;var c = {},
          d = 0;void 0 !== a.f && (c[d] = a.f);for (; d < b.length; d++) {
        var e = b.charAt(d);if (!(e in a.a)) break;a = a.a[e];void 0 !== a.f && (c[d] = a.f);
      }for (var f in c) {
        if (c.hasOwnProperty(f)) return c[f];
      }return [];
    }function Pd(a) {
      for (var b = 0; b < Qd.length; b++) {
        if (Qd[b].c === a) return Qd[b];
      }return null;
    }function Rd(a) {
      a = a.toUpperCase();for (var b = [], c = 0; c < Qd.length; c++) {
        Qd[c].g === a && b.push(Qd[c]);
      }return b;
    }function Sd(a) {
      if (0 < a.length && "+" == a.charAt(0)) {
        a = a.substring(1);for (var b = [], c = 0; c < Qd.length; c++) {
          Qd[c].b == a && b.push(Qd[c]);
        }a = b;
      } else a = Rd(a);return a;
    }function Td(a) {
      a.sort(function (a, c) {
        return a.name.localeCompare(c.name, "de");
      });
    }var Qd = [{ name: "Afghanistan", c: "93-AF-0", b: "93", g: "AF" }, { name: "\u00c5land", c: "358-AX-0", b: "358", g: "AX" }, { name: "Albanien", c: "355-AL-0", b: "355", g: "AL" }, { name: "Algerien", c: "213-DZ-0", b: "213", g: "DZ" }, { name: "Amerikanisch-Samoa", c: "1-AS-0", b: "1", g: "AS" }, { name: "Andorra", c: "376-AD-0", b: "376", g: "AD" }, { name: "Angola",
      c: "244-AO-0", b: "244", g: "AO" }, { name: "Anguilla", c: "1-AI-0", b: "1", g: "AI" }, { name: "Antigua und Barbuda", c: "1-AG-0", b: "1", g: "AG" }, { name: "Argentinien", c: "54-AR-0", b: "54", g: "AR" }, { name: "Armenien", c: "374-AM-0", b: "374", g: "AM" }, { name: "Aruba", c: "297-AW-0", b: "297", g: "AW" }, { name: "Ascension", c: "247-AC-0", b: "247", g: "AC" }, { name: "Australien", c: "61-AU-0", b: "61", g: "AU" }, { name: "\u00d6sterreich", c: "43-AT-0", b: "43", g: "AT" }, { name: "Aserbaidschan", c: "994-AZ-0", b: "994", g: "AZ" }, { name: "Bahamas", c: "1-BS-0", b: "1", g: "BS" }, { name: "Bahrain",
      c: "973-BH-0", b: "973", g: "BH" }, { name: "Bangladesch", c: "880-BD-0", b: "880", g: "BD" }, { name: "Barbados", c: "1-BB-0", b: "1", g: "BB" }, { name: "Wei\u00dfrussland", c: "375-BY-0", b: "375", g: "BY" }, { name: "Belgien", c: "32-BE-0", b: "32", g: "BE" }, { name: "Belize", c: "501-BZ-0", b: "501", g: "BZ" }, { name: "Benin", c: "229-BJ-0", b: "229", g: "BJ" }, { name: "Bermuda", c: "1-BM-0", b: "1", g: "BM" }, { name: "Bhutan", c: "975-BT-0", b: "975", g: "BT" }, { name: "Bolivien", c: "591-BO-0", b: "591", g: "BO" }, { name: "Bosnien und Herzegowina", c: "387-BA-0", b: "387", g: "BA" }, { name: "Botsuana",
      c: "267-BW-0", b: "267", g: "BW" }, { name: "Brasilien", c: "55-BR-0", b: "55", g: "BR" }, { name: "Britisches Territorium im Indischen Ozean", c: "246-IO-0", b: "246", g: "IO" }, { name: "Britische Jungferninseln", c: "1-VG-0", b: "1", g: "VG" }, { name: "Brunei Darussalam", c: "673-BN-0", b: "673", g: "BN" }, { name: "Bulgarien", c: "359-BG-0", b: "359", g: "BG" }, { name: "Burkina Faso", c: "226-BF-0", b: "226", g: "BF" }, { name: "Burundi", c: "257-BI-0", b: "257", g: "BI" }, { name: "Kambodscha", c: "855-KH-0", b: "855", g: "KH" }, { name: "Kamerun", c: "237-CM-0", b: "237", g: "CM" }, { name: "Kanada", c: "1-CA-0", b: "1", g: "CA" }, { name: "Cabo Verde", c: "238-CV-0", b: "238", g: "CV" }, { name: "Karibische Niederlande", c: "599-BQ-0", b: "599", g: "BQ" }, { name: "Kaimaninseln", c: "1-KY-0", b: "1", g: "KY" }, { name: "Zentralafrikanische Republik", c: "236-CF-0", b: "236", g: "CF" }, { name: "Tschad", c: "235-TD-0", b: "235", g: "TD" }, { name: "Chile", c: "56-CL-0", b: "56", g: "CL" }, { name: "China", c: "86-CN-0", b: "86", g: "CN" }, { name: "Weihnachtsinsel", c: "61-CX-0", b: "61", g: "CX" }, { name: "Kokosinseln", c: "61-CC-0", b: "61", g: "CC" }, { name: "Kolumbien",
      c: "57-CO-0", b: "57", g: "CO" }, { name: "Komoren", c: "269-KM-0", b: "269", g: "KM" }, { name: "Demokratische Republik Kongo", c: "243-CD-0", b: "243", g: "CD" }, { name: "Kongo", c: "242-CG-0", b: "242", g: "CG" }, { name: "Cookinseln", c: "682-CK-0", b: "682", g: "CK" }, { name: "Costa Rica", c: "506-CR-0", b: "506", g: "CR" }, { name: "C\u00f4te d'Ivoire", c: "225-CI-0", b: "225", g: "CI" }, { name: "Kroatien", c: "385-HR-0", b: "385", g: "HR" }, { name: "Kuba", c: "53-CU-0", b: "53", g: "CU" }, { name: "Cura\u00e7ao", c: "599-CW-0", b: "599", g: "CW" }, { name: "Zypern", c: "357-CY-0", b: "357",
      g: "CY" }, { name: "Tschechien", c: "420-CZ-0", b: "420", g: "CZ" }, { name: "D\u00e4nemark", c: "45-DK-0", b: "45", g: "DK" }, { name: "Dschibuti", c: "253-DJ-0", b: "253", g: "DJ" }, { name: "Dominica", c: "1-DM-0", b: "1", g: "DM" }, { name: "Dominikanische Republik", c: "1-DO-0", b: "1", g: "DO" }, { name: "Timor-Leste", c: "670-TL-0", b: "670", g: "TL" }, { name: "Ecuador", c: "593-EC-0", b: "593", g: "EC" }, { name: "\u00c4gypten", c: "20-EG-0", b: "20", g: "EG" }, { name: "El Salvador", c: "503-SV-0", b: "503", g: "SV" }, { name: "\u00c4quatorialguinea", c: "240-GQ-0", b: "240", g: "GQ" }, { name: "Eritrea", c: "291-ER-0", b: "291", g: "ER" }, { name: "Estland", c: "372-EE-0", b: "372", g: "EE" }, { name: "\u00c4thiopien", c: "251-ET-0", b: "251", g: "ET" }, { name: "Falklandinseln", c: "500-FK-0", b: "500", g: "FK" }, { name: "F\u00e4r\u00f6er", c: "298-FO-0", b: "298", g: "FO" }, { name: "Fidschi", c: "679-FJ-0", b: "679", g: "FJ" }, { name: "Irland", c: "358-FI-0", b: "358", g: "FI" }, { name: "Frankreich", c: "33-FR-0", b: "33", g: "FR" }, { name: "Franz\u00f6sisch-Guayana", c: "594-GF-0", b: "594", g: "GF" }, { name: "Franz\u00f6sisch-Polynesien", c: "689-PF-0", b: "689",
      g: "PF" }, { name: "Gabun", c: "241-GA-0", b: "241", g: "GA" }, { name: "Gambia", c: "220-GM-0", b: "220", g: "GM" }, { name: "Georgien", c: "995-GE-0", b: "995", g: "GE" }, { name: "Deutschland", c: "49-DE-0", b: "49", g: "DE" }, { name: "Ghana", c: "233-GH-0", b: "233", g: "GH" }, { name: "Gibraltar", c: "350-GI-0", b: "350", g: "GI" }, { name: "Griechenland", c: "30-GR-0", b: "30", g: "GR" }, { name: "Gr\u00f6nland", c: "299-GL-0", b: "299", g: "GL" }, { name: "Grenada", c: "1-GD-0", b: "1", g: "GD" }, { name: "Guadeloupe", c: "590-GP-0", b: "590", g: "GP" }, { name: "Guam", c: "1-GU-0", b: "1", g: "GU" }, { name: "Guatemala", c: "502-GT-0", b: "502", g: "GT" }, { name: "Guernsey", c: "44-GG-0", b: "44", g: "GG" }, { name: "Guinea", c: "224-GN-0", b: "224", g: "GN" }, { name: "Guinea-Bissau", c: "245-GW-0", b: "245", g: "GW" }, { name: "Guyana", c: "592-GY-0", b: "592", g: "GY" }, { name: "Haiti", c: "509-HT-0", b: "509", g: "HT" }, { name: "Heard und die McDonaldinseln", c: "672-HM-0", b: "672", g: "HM" }, { name: "Honduras", c: "504-HN-0", b: "504", g: "HN" }, { name: "Hongkong", c: "852-HK-0", b: "852", g: "HK" }, { name: "Ungarn", c: "36-HU-0", b: "36", g: "HU" }, { name: "Island", c: "354-IS-0",
      b: "354", g: "IS" }, { name: "Indien", c: "91-IN-0", b: "91", g: "IN" }, { name: "Indonesien", c: "62-ID-0", b: "62", g: "ID" }, { name: "Iran", c: "98-IR-0", b: "98", g: "IR" }, { name: "Irak", c: "964-IQ-0", b: "964", g: "IQ" }, { name: "Irland", c: "353-IE-0", b: "353", g: "IE" }, { name: "Insel Man", c: "44-IM-0", b: "44", g: "IM" }, { name: "Israel", c: "972-IL-0", b: "972", g: "IL" }, { name: "Italien", c: "39-IT-0", b: "39", g: "IT" }, { name: "Jamaika", c: "1-JM-0", b: "1", g: "JM" }, { name: "Japan", c: "81-JP-0", b: "81", g: "JP" }, { name: "Jersey", c: "44-JE-0", b: "44", g: "JE" }, { name: "Jordanien",
      c: "962-JO-0", b: "962", g: "JO" }, { name: "Kasachstan", c: "7-KZ-0", b: "7", g: "KZ" }, { name: "Kenia", c: "254-KE-0", b: "254", g: "KE" }, { name: "Kiribati", c: "686-KI-0", b: "686", g: "KI" }, { name: "Kosovo", c: "377-XK-0", b: "377", g: "XK" }, { name: "Kosovo", c: "381-XK-0", b: "381", g: "XK" }, { name: "Kosovo", c: "386-XK-0", b: "386", g: "XK" }, { name: "Kuwait", c: "965-KW-0", b: "965", g: "KW" }, { name: "Kirgisistan", c: "996-KG-0", b: "996", g: "KG" }, { name: "Laos", c: "856-LA-0", b: "856", g: "LA" }, { name: "Lettland", c: "371-LV-0", b: "371", g: "LV" }, { name: "Libanon", c: "961-LB-0",
      b: "961", g: "LB" }, { name: "Lesotho", c: "266-LS-0", b: "266", g: "LS" }, { name: "Liberia", c: "231-LR-0", b: "231", g: "LR" }, { name: "Libyen", c: "218-LY-0", b: "218", g: "LY" }, { name: "Liechtenstein", c: "423-LI-0", b: "423", g: "LI" }, { name: "Litauen", c: "370-LT-0", b: "370", g: "LT" }, { name: "Luxemburg", c: "352-LU-0", b: "352", g: "LU" }, { name: "Macau", c: "853-MO-0", b: "853", g: "MO" }, { name: "Mazedonien", c: "389-MK-0", b: "389", g: "MK" }, { name: "Madagaskar", c: "261-MG-0", b: "261", g: "MG" }, { name: "Malawi", c: "265-MW-0", b: "265", g: "MW" }, { name: "Malaysia", c: "60-MY-0",
      b: "60", g: "MY" }, { name: "Malediven", c: "960-MV-0", b: "960", g: "MV" }, { name: "Mali", c: "223-ML-0", b: "223", g: "ML" }, { name: "Malta", c: "356-MT-0", b: "356", g: "MT" }, { name: "Marshallinseln", c: "692-MH-0", b: "692", g: "MH" }, { name: "Martinique", c: "596-MQ-0", b: "596", g: "MQ" }, { name: "Mauretanien", c: "222-MR-0", b: "222", g: "MR" }, { name: "Mauritius", c: "230-MU-0", b: "230", g: "MU" }, { name: "Mayotte", c: "262-YT-0", b: "262", g: "YT" }, { name: "Mexiko", c: "52-MX-0", b: "52", g: "MX" }, { name: "Mikronesien", c: "691-FM-0", b: "691", g: "FM" }, { name: "Moldawien", c: "373-MD-0",
      b: "373", g: "MD" }, { name: "Monaco", c: "377-MC-0", b: "377", g: "MC" }, { name: "Mongolei", c: "976-MN-0", b: "976", g: "MN" }, { name: "Montenegro", c: "382-ME-0", b: "382", g: "ME" }, { name: "Montserrat", c: "1-MS-0", b: "1", g: "MS" }, { name: "Marokko", c: "212-MA-0", b: "212", g: "MA" }, { name: "Mosambik", c: "258-MZ-0", b: "258", g: "MZ" }, { name: "Myanmar", c: "95-MM-0", b: "95", g: "MM" }, { name: "Namibia", c: "264-NA-0", b: "264", g: "NA" }, { name: "Nauru", c: "674-NR-0", b: "674", g: "NR" }, { name: "Nepal", c: "977-NP-0", b: "977", g: "NP" }, { name: "Niederlande", c: "31-NL-0", b: "31",
      g: "NL" }, { name: "Neukaledonien", c: "687-NC-0", b: "687", g: "NC" }, { name: "Neuseeland", c: "64-NZ-0", b: "64", g: "NZ" }, { name: "Nicaragua", c: "505-NI-0", b: "505", g: "NI" }, { name: "Niger", c: "227-NE-0", b: "227", g: "NE" }, { name: "Nigeria", c: "234-NG-0", b: "234", g: "NG" }, { name: "Niue", c: "683-NU-0", b: "683", g: "NU" }, { name: "Norfolkinsel", c: "672-NF-0", b: "672", g: "NF" }, { name: "Nordkorea", c: "850-KP-0", b: "850", g: "KP" }, { name: "N\u00f6rdliche Marianen", c: "1-MP-0", b: "1", g: "MP" }, { name: "Norwegen", c: "47-NO-0", b: "47", g: "NO" }, { name: "Oman", c: "968-OM-0",
      b: "968", g: "OM" }, { name: "Pakistan", c: "92-PK-0", b: "92", g: "PK" }, { name: "Palau", c: "680-PW-0", b: "680", g: "PW" }, { name: "Pal\u00e4stinensische Gebiete", c: "970-PS-0", b: "970", g: "PS" }, { name: "Panama", c: "507-PA-0", b: "507", g: "PA" }, { name: "Papua-Neuguinea", c: "675-PG-0", b: "675", g: "PG" }, { name: "Paraguay", c: "595-PY-0", b: "595", g: "PY" }, { name: "Peru", c: "51-PE-0", b: "51", g: "PE" }, { name: "Philippinen", c: "63-PH-0", b: "63", g: "PH" }, { name: "Polen", c: "48-PL-0", b: "48", g: "PL" }, { name: "Portugal", c: "351-PT-0", b: "351", g: "PT" }, { name: "Puerto Rico",
      c: "1-PR-0", b: "1", g: "PR" }, { name: "Katar", c: "974-QA-0", b: "974", g: "QA" }, { name: "R\u00e9union", c: "262-RE-0", b: "262", g: "RE" }, { name: "Rum\u00e4nien", c: "40-RO-0", b: "40", g: "RO" }, { name: "Russland", c: "7-RU-0", b: "7", g: "RU" }, { name: "Ruanda", c: "250-RW-0", b: "250", g: "RW" }, { name: "St. Barth\u00e9lemy", c: "590-BL-0", b: "590", g: "BL" }, { name: "St. Helena", c: "290-SH-0", b: "290", g: "SH" }, { name: "St. Kitts", c: "1-KN-0", b: "1", g: "KN" }, { name: "St. Lucia", c: "1-LC-0", b: "1", g: "LC" }, { name: "St. Martin", c: "590-MF-0", b: "590", g: "MF" }, { name: "St. Pierre und Miquelon",
      c: "508-PM-0", b: "508", g: "PM" }, { name: "St. Vincent", c: "1-VC-0", b: "1", g: "VC" }, { name: "Samoa", c: "685-WS-0", b: "685", g: "WS" }, { name: "San Marino", c: "378-SM-0", b: "378", g: "SM" }, { name: "S\u00e3o Tom\u00e9 und Pr\u00edncipe", c: "239-ST-0", b: "239", g: "ST" }, { name: "Saudi-Arabien", c: "966-SA-0", b: "966", g: "SA" }, { name: "Senegal", c: "221-SN-0", b: "221", g: "SN" }, { name: "Serbien", c: "381-RS-0", b: "381", g: "RS" }, { name: "Seychellen", c: "248-SC-0", b: "248", g: "SC" }, { name: "Sierra Leone", c: "232-SL-0", b: "232", g: "SL" }, { name: "Singapur", c: "65-SG-0",
      b: "65", g: "SG" }, { name: "Sint Maarten", c: "1-SX-0", b: "1", g: "SX" }, { name: "Slowakei", c: "421-SK-0", b: "421", g: "SK" }, { name: "Slowenien", c: "386-SI-0", b: "386", g: "SI" }, { name: "Salomonen", c: "677-SB-0", b: "677", g: "SB" }, { name: "Somalia", c: "252-SO-0", b: "252", g: "SO" }, { name: "S\u00fcdafrika", c: "27-ZA-0", b: "27", g: "ZA" }, { name: "S\u00fcdgeorgien und die S\u00fcdlichen Sandwichinseln", c: "500-GS-0", b: "500", g: "GS" }, { name: "S\u00fcdkorea", c: "82-KR-0", b: "82", g: "KR" }, { name: "S\u00fcdsudan", c: "211-SS-0", b: "211", g: "SS" }, { name: "Spanien",
      c: "34-ES-0", b: "34", g: "ES" }, { name: "Sri Lanka", c: "94-LK-0", b: "94", g: "LK" }, { name: "Sudan", c: "249-SD-0", b: "249", g: "SD" }, { name: "Suriname", c: "597-SR-0", b: "597", g: "SR" }, { name: "Svalbard und Jan Mayen", c: "47-SJ-0", b: "47", g: "SJ" }, { name: "Swasiland", c: "268-SZ-0", b: "268", g: "SZ" }, { name: "Schweden", c: "46-SE-0", b: "46", g: "SE" }, { name: "Schweiz", c: "41-CH-0", b: "41", g: "CH" }, { name: "Syrien", c: "963-SY-0", b: "963", g: "SY" }, { name: "Taiwan", c: "886-TW-0", b: "886", g: "TW" }, { name: "Tadschikistan", c: "992-TJ-0", b: "992", g: "TJ" }, { name: "Tansania",
      c: "255-TZ-0", b: "255", g: "TZ" }, { name: "Thailand", c: "66-TH-0", b: "66", g: "TH" }, { name: "Togo", c: "228-TG-0", b: "228", g: "TG" }, { name: "Tokelau", c: "690-TK-0", b: "690", g: "TK" }, { name: "Tonga", c: "676-TO-0", b: "676", g: "TO" }, { name: "Trinidad und Tobago", c: "1-TT-0", b: "1", g: "TT" }, { name: "Tunesien", c: "216-TN-0", b: "216", g: "TN" }, { name: "T\u00fcrkei", c: "90-TR-0", b: "90", g: "TR" }, { name: "Turkmenistan", c: "993-TM-0", b: "993", g: "TM" }, { name: "Turks- und Caicosinseln", c: "1-TC-0", b: "1", g: "TC" }, { name: "Tuvalu", c: "688-TV-0", b: "688", g: "TV" }, { name: "Amerikanische Jungferninseln",
      c: "1-VI-0", b: "1", g: "VI" }, { name: "Uganda", c: "256-UG-0", b: "256", g: "UG" }, { name: "Ukraine", c: "380-UA-0", b: "380", g: "UA" }, { name: "Vereinigte Arabische Emirate", c: "971-AE-0", b: "971", g: "AE" }, { name: "Vereinigtes K\u00f6nigreich", c: "44-GB-0", b: "44", g: "GB" }, { name: "USA", c: "1-US-0", b: "1", g: "US" }, { name: "Uruguay", c: "598-UY-0", b: "598", g: "UY" }, { name: "Usbekistan", c: "998-UZ-0", b: "998", g: "UZ" }, { name: "Vanuatu", c: "678-VU-0", b: "678", g: "VU" }, { name: "Vatikanstadt", c: "379-VA-0", b: "379", g: "VA" }, { name: "Venezuela", c: "58-VE-0", b: "58",
      g: "VE" }, { name: "Vietnam", c: "84-VN-0", b: "84", g: "VN" }, { name: "Wallis und Futuna", c: "681-WF-0", b: "681", g: "WF" }, { name: "Westsahara", c: "212-EH-0", b: "212", g: "EH" }, { name: "Jemen", c: "967-YE-0", b: "967", g: "YE" }, { name: "Sambia", c: "260-ZM-0", b: "260", g: "ZM" }, { name: "Simbabwe", c: "263-ZW-0", b: "263", g: "ZW" }];Td(Qd);var Ud = new Nd(Qd);function Vd(a, b) {
      this.a = a;this.va = b;
    }function Wd(a) {
      a = Ta(a);var b = Od(Ud, a);return 0 < b.length ? new Vd("1" == b[0].b ? "1-US-0" : b[0].c, Ta(a.substr(b[0].b.length + 1))) : null;
    }function Xd(a) {
      var b = Pd(a.a);
      if (!b) throw Error("Country ID " + a.a + " not found.");return "+" + b.b + a.va;
    }function Yd(a, b) {
      for (var c = 0; c < a.length; c++) {
        if (!Ka(Zd, a[c]) && (null !== $d && a[c] in $d || Ka(b, a[c]))) return a[c];
      }return null;
    }var Zd = ["emailLink", "password", "phone"],
        $d = { "facebook.com": "FacebookAuthProvider", "github.com": "GithubAuthProvider", "google.com": "GoogleAuthProvider", password: "EmailAuthProvider", "twitter.com": "TwitterAuthProvider", phone: "PhoneAuthProvider" };var ae = Object.freeze || function (a) {
      return a;
    };function be(a, b, c) {
      this.reset(a, b, c, void 0, void 0);
    }be.prototype.a = null;var ce = 0;be.prototype.reset = function (a, b, c, d, e) {
      "number" == typeof e || ce++;this.h = d || xa();this.j = a;this.i = b;this.f = c;delete this.a;
    };function de(a) {
      this.i = a;this.a = this.h = this.j = this.f = null;
    }function ee(a, b) {
      this.name = a;this.value = b;
    }ee.prototype.toString = function () {
      return this.name;
    };var fe = new ee("SHOUT", 1200),
        ge = new ee("SEVERE", 1E3),
        he = new ee("WARNING", 900),
        ie = new ee("CONFIG", 700);function je(a) {
      if (a.j) return a.j;if (a.f) return je(a.f);Ca("Root logger has no level set.");
      return null;
    }de.prototype.log = function (a, b, c) {
      if (a.value >= je(this).value) for (qa(b) && (b = b()), a = new be(a, String(b), this.i), c && (a.a = c), c = this; c;) {
        var d = c,
            e = a;if (d.a) for (var f = 0; b = d.a[f]; f++) {
          b(e);
        }c = c.f;
      }
    };var ke = {},
        le = null;function me() {
      le || (le = new de(""), ke[""] = le, le.j = ie);
    }function ne(a) {
      me();var b;if (!(b = ke[a])) {
        b = new de(a);var c = a.lastIndexOf("."),
            d = a.substr(c + 1);c = ne(a.substr(0, c));c.h || (c.h = {});c.h[d] = b;b.f = c;ke[a] = b;
      }return b;
    }function oe() {
      this.a = xa();
    }var pe = null;oe.prototype.set = function (a) {
      this.a = a;
    };oe.prototype.reset = function () {
      this.set(xa());
    };oe.prototype.get = function () {
      return this.a;
    };function qe(a) {
      this.j = a || "";pe || (pe = new oe());this.i = pe;
    }qe.prototype.a = !0;qe.prototype.f = !0;qe.prototype.h = !1;function re(a) {
      return 10 > a ? "0" + a : String(a);
    }function se(a, b) {
      a = (a.h - b) / 1E3;b = a.toFixed(3);var c = 0;if (1 > a) c = 2;else for (; 100 > a;) {
        c++, a *= 10;
      }for (; 0 < c--;) {
        b = " " + b;
      }return b;
    }function te(a) {
      qe.call(this, a);
    }t(te, qe);function ue() {
      this.i = p(this.h, this);this.a = new te();this.a.f = !1;this.a.h = !1;this.f = this.a.a = !1;this.j = {};
    }ue.prototype.h = function (a) {
      if (!this.j[a.f]) {
        var b = this.a;var c = [];c.push(b.j, " ");if (b.f) {
          var d = new Date(a.h);c.push("[", re(d.getFullYear() - 2E3) + re(d.getMonth() + 1) + re(d.getDate()) + " " + re(d.getHours()) + ":" + re(d.getMinutes()) + ":" + re(d.getSeconds()) + "." + re(Math.floor(d.getMilliseconds() / 10)), "] ");
        }c.push("[", se(a, b.i.get()), "s] ");c.push("[", a.f, "] ");c.push(a.i);b.h && (d = a.a) && c.push("\n", d instanceof Error ? d.message : d.toString());b.a && c.push("\n");b = c.join("");if (c = ve) switch (a.j) {case fe:
            we(c, "info", b);break;case ge:
            we(c, "error", b);break;case he:
            we(c, "warn", b);break;default:
            we(c, "log", b);}
      }
    };var ve = l.console;function we(a, b, c) {
      if (a[b]) a[b](c);else a.log(c);
    }function xe(a, b) {
      var c = ye;c && c.log(ge, a, b);
    }var ye;ye = ne("firebaseui");var ze = new ue();if (1 != ze.f) {
      var Ae;me();Ae = le;var Be = ze.i;Ae.a || (Ae.a = []);Ae.a.push(Be);ze.f = !0;
    }function Ce(a) {
      var b = ye;b && b.log(he, a, void 0);
    }function De(a) {
      a.prototype.then = a.prototype.then;a.prototype.$goog_Thenable = !0;
    }function Fe(a) {
      if (!a) return !1;try {
        return !!a.$goog_Thenable;
      } catch (b) {
        return !1;
      }
    }
    function Ge(a, b) {
      this.h = a;this.j = b;this.f = 0;this.a = null;
    }Ge.prototype.get = function () {
      if (0 < this.f) {
        this.f--;var a = this.a;this.a = a.next;a.next = null;
      } else a = this.h();return a;
    };function He(a, b) {
      a.j(b);100 > a.f && (a.f++, b.next = a.a, a.a = b);
    }function Ie() {
      this.f = this.a = null;
    }var Ke = new Ge(function () {
      return new Je();
    }, function (a) {
      a.reset();
    });Ie.prototype.add = function (a, b) {
      var c = Ke.get();c.set(a, b);this.f ? this.f.next = c : this.a = c;this.f = c;
    };function Le() {
      var a = Me,
          b = null;a.a && (b = a.a, a.a = a.a.next, a.a || (a.f = null), b.next = null);return b;
    }function Je() {
      this.next = this.f = this.a = null;
    }Je.prototype.set = function (a, b) {
      this.a = a;this.f = b;this.next = null;
    };Je.prototype.reset = function () {
      this.next = this.f = this.a = null;
    };function Ne(a) {
      l.setTimeout(function () {
        throw a;
      }, 0);
    }var Oe;function Pe() {
      var a = l.MessageChannel;"undefined" === typeof a && "undefined" !== typeof window && window.postMessage && window.addEventListener && !u("Presto") && (a = function a() {
        var a = document.createElement("IFRAME");a.style.display = "none";a.src = "";document.documentElement.appendChild(a);
        var b = a.contentWindow;a = b.document;a.open();a.write("");a.close();var c = "callImmediate" + Math.random(),
            d = "file:" == b.location.protocol ? "*" : b.location.protocol + "//" + b.location.host;a = p(function (a) {
          if (("*" == d || a.origin == d) && a.data == c) this.port1.onmessage();
        }, this);b.addEventListener("message", a, !1);this.port1 = {};this.port2 = { postMessage: function postMessage() {
            b.postMessage(c, d);
          } };
      });if ("undefined" !== typeof a && !u("Trident") && !u("MSIE")) {
        var b = new a(),
            c = {},
            d = c;b.port1.onmessage = function () {
          if (fa(c.next)) {
            c = c.next;var a = c.ab;c.ab = null;a();
          }
        };return function (a) {
          d.next = { ab: a };d = d.next;b.port2.postMessage(0);
        };
      }return "undefined" !== typeof document && "onreadystatechange" in document.createElement("SCRIPT") ? function (a) {
        var b = document.createElement("SCRIPT");b.onreadystatechange = function () {
          b.onreadystatechange = null;b.parentNode.removeChild(b);b = null;a();a = null;
        };document.documentElement.appendChild(b);
      } : function (a) {
        l.setTimeout(a, 0);
      };
    }function Qe(a, b) {
      Re || Se();Te || (Re(), Te = !0);Me.add(a, b);
    }var Re;function Se() {
      if (l.Promise && l.Promise.resolve) {
        var a = l.Promise.resolve(void 0);Re = function Re() {
          a.then(Ue);
        };
      } else Re = function Re() {
        var a = Ue;!qa(l.setImmediate) || l.Window && l.Window.prototype && !u("Edge") && l.Window.prototype.setImmediate == l.setImmediate ? (Oe || (Oe = Pe()), Oe(a)) : l.setImmediate(a);
      };
    }var Te = !1,
        Me = new Ie();function Ue() {
      for (var a; a = Le();) {
        try {
          a.a.call(a.f);
        } catch (b) {
          Ne(b);
        }He(Ke, a);
      }Te = !1;
    }function Ve(a, b) {
      this.a = We;this.w = void 0;this.j = this.f = this.h = null;this.i = this.v = !1;if (a != ja) try {
        var c = this;a.call(b, function (a) {
          Xe(c, Ye, a);
        }, function (a) {
          if (!(a instanceof Ze)) try {
            if (a instanceof Error) throw a;throw Error("Promise rejected.");
          } catch (e) {}Xe(c, $e, a);
        });
      } catch (d) {
        Xe(this, $e, d);
      }
    }var We = 0,
        Ye = 2,
        $e = 3;function af() {
      this.next = this.context = this.f = this.h = this.a = null;this.j = !1;
    }af.prototype.reset = function () {
      this.context = this.f = this.h = this.a = null;this.j = !1;
    };var bf = new Ge(function () {
      return new af();
    }, function (a) {
      a.reset();
    });function cf(a, b, c) {
      var d = bf.get();d.h = a;d.f = b;d.context = c;return d;
    }function A(a) {
      if (a instanceof Ve) return a;var b = new Ve(ja);Xe(b, Ye, a);return b;
    }
    function df(a) {
      return new Ve(function (b, c) {
        c(a);
      });
    }Ve.prototype.then = function (a, b, c) {
      return ef(this, qa(a) ? a : null, qa(b) ? b : null, c);
    };De(Ve);function ff(a, b) {
      return ef(a, null, b, void 0);
    }Ve.prototype.cancel = function (a) {
      this.a == We && Qe(function () {
        var b = new Ze(a);gf(this, b);
      }, this);
    };function gf(a, b) {
      if (a.a == We) if (a.h) {
        var c = a.h;if (c.f) {
          for (var d = 0, e = null, f = null, g = c.f; g && (g.j || (d++, g.a == a && (e = g), !(e && 1 < d))); g = g.next) {
            e || (f = g);
          }e && (c.a == We && 1 == d ? gf(c, b) : (f ? (d = f, d.next == c.j && (c.j = d), d.next = d.next.next) : hf(c), jf(c, e, $e, b)));
        }a.h = null;
      } else Xe(a, $e, b);
    }function kf(a, b) {
      a.f || a.a != Ye && a.a != $e || lf(a);a.j ? a.j.next = b : a.f = b;a.j = b;
    }function ef(a, b, c, d) {
      var e = cf(null, null, null);e.a = new Ve(function (a, g) {
        e.h = b ? function (c) {
          try {
            var e = b.call(d, c);a(e);
          } catch (n) {
            g(n);
          }
        } : a;e.f = c ? function (b) {
          try {
            var e = c.call(d, b);!fa(e) && b instanceof Ze ? g(b) : a(e);
          } catch (n) {
            g(n);
          }
        } : g;
      });e.a.h = a;kf(a, e);return e.a;
    }Ve.prototype.F = function (a) {
      this.a = We;Xe(this, Ye, a);
    };Ve.prototype.I = function (a) {
      this.a = We;Xe(this, $e, a);
    };function Xe(a, b, c) {
      if (a.a == We) {
        a === c && (b = $e, c = new TypeError("Promise cannot resolve to itself"));a.a = 1;a: {
          var d = c,
              e = a.F,
              f = a.I;if (d instanceof Ve) {
            kf(d, cf(e || ja, f || null, a));var g = !0;
          } else if (Fe(d)) d.then(e, f, a), g = !0;else {
            if (ra(d)) try {
              var h = d.then;if (qa(h)) {
                mf(d, h, e, f, a);g = !0;break a;
              }
            } catch (r) {
              f.call(a, r);g = !0;break a;
            }g = !1;
          }
        }g || (a.w = c, a.a = b, a.h = null, lf(a), b != $e || c instanceof Ze || nf(a, c));
      }
    }function mf(a, b, c, d, e) {
      function f(a) {
        h || (h = !0, d.call(e, a));
      }function g(a) {
        h || (h = !0, c.call(e, a));
      }var h = !1;try {
        b.call(a, g, f);
      } catch (r) {
        f(r);
      }
    }function lf(a) {
      a.v || (a.v = !0, Qe(a.C, a));
    }function hf(a) {
      var b = null;a.f && (b = a.f, a.f = b.next, b.next = null);a.f || (a.j = null);return b;
    }Ve.prototype.C = function () {
      for (var a; a = hf(this);) {
        jf(this, a, this.a, this.w);
      }this.v = !1;
    };function jf(a, b, c, d) {
      if (c == $e && b.f && !b.j) for (; a && a.i; a = a.h) {
        a.i = !1;
      }if (b.a) b.a.h = null, of(b, c, d);else try {
        b.j ? b.h.call(b.context) : of(b, c, d);
      } catch (e) {
        pf.call(null, e);
      }He(bf, b);
    }function of(a, b, c) {
      b == Ye ? a.h.call(a.context, c) : a.f && a.f.call(a.context, c);
    }function nf(a, b) {
      a.i = !0;Qe(function () {
        a.i && pf.call(null, b);
      });
    }var pf = Ne;function Ze(a) {
      za.call(this, a);
    }t(Ze, za);Ze.prototype.name = "cancel";var qf = !v || 9 <= Number(Ab),
        rf = v && !zb("9"),
        sf = function () {
      if (!l.addEventListener || !Object.defineProperty) return !1;var a = !1,
          b = Object.defineProperty({}, "passive", { get: function get() {
          a = !0;
        } });try {
        l.addEventListener("test", ja, b), l.removeEventListener("test", ja, b);
      } catch (c) {}return a;
    }();function tf() {
      0 != uf && (vf[this[sa] || (this[sa] = ++ta)] = this);this.O = this.O;this.C = this.C;
    }var uf = 0,
        vf = {};tf.prototype.O = !1;tf.prototype.m = function () {
      if (!this.O && (this.O = !0, this.l(), 0 != uf)) {
        var a = this[sa] || (this[sa] = ++ta);if (0 != uf && this.C && 0 < this.C.length) throw Error(this + " did not empty its onDisposeCallbacks queue. This probably means it overrode dispose() or disposeInternal() without calling the superclass' method.");delete vf[a];
      }
    };function wf(a, b) {
      a.O ? fa(void 0) ? b.call(void 0) : b() : (a.C || (a.C = []), a.C.push(fa(void 0) ? p(b, void 0) : b));
    }tf.prototype.l = function () {
      if (this.C) for (; this.C.length;) {
        this.C.shift()();
      }
    };function xf(a) {
      a && "function" == typeof a.m && a.m();
    }function yf(a, b) {
      this.type = a;this.f = this.target = b;this.h = !1;this.ib = !0;
    }yf.prototype.stopPropagation = function () {
      this.h = !0;
    };yf.prototype.preventDefault = function () {
      this.ib = !1;
    };function zf(a, b) {
      yf.call(this, a ? a.type : "");this.relatedTarget = this.f = this.target = null;this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;this.key = "";this.j = this.keyCode = 0;this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;this.pointerId = 0;this.pointerType = "";this.a = null;if (a) {
        var c = this.type = a.type,
            d = a.changedTouches ? a.changedTouches[0] : null;this.target = a.target || a.srcElement;this.f = b;if (b = a.relatedTarget) {
          if (qb) {
            a: {
              try {
                kb(b.nodeName);var e = !0;break a;
              } catch (f) {}e = !1;
            }e || (b = null);
          }
        } else "mouseover" == c ? b = a.fromElement : "mouseout" == c && (b = a.toElement);this.relatedTarget = b;null === d ? (this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX, this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0) : (this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX, this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0);this.button = a.button;this.keyCode = a.keyCode || 0;this.key = a.key || "";this.j = a.charCode || ("keypress" == c ? a.keyCode : 0);this.ctrlKey = a.ctrlKey;this.altKey = a.altKey;this.shiftKey = a.shiftKey;this.metaKey = a.metaKey;this.pointerId = a.pointerId || 0;this.pointerType = m(a.pointerType) ? a.pointerType : Af[a.pointerType] || "";this.a = a;a.defaultPrevented && this.preventDefault();
      }
    }t(zf, yf);var Af = ae({ 2: "touch", 3: "pen", 4: "mouse" });zf.prototype.stopPropagation = function () {
      zf.o.stopPropagation.call(this);
      this.a.stopPropagation ? this.a.stopPropagation() : this.a.cancelBubble = !0;
    };zf.prototype.preventDefault = function () {
      zf.o.preventDefault.call(this);var a = this.a;if (a.preventDefault) a.preventDefault();else if (a.returnValue = !1, rf) try {
        if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) a.keyCode = -1;
      } catch (b) {}
    };var Bf = "closure_listenable_" + (1E6 * Math.random() | 0),
        Cf = 0;function Df(a, b, c, d, e) {
      this.listener = a;this.proxy = null;this.src = b;this.type = c;this.capture = !!d;this.Fa = e;this.key = ++Cf;this.qa = this.Ca = !1;
    }function Ef(a) {
      a.qa = !0;a.listener = null;a.proxy = null;a.src = null;a.Fa = null;
    }function Ff(a) {
      this.src = a;this.a = {};this.f = 0;
    }Ff.prototype.add = function (a, b, c, d, e) {
      var f = a.toString();a = this.a[f];a || (a = this.a[f] = [], this.f++);var g = Gf(a, b, d, e);-1 < g ? (b = a[g], c || (b.Ca = !1)) : (b = new Df(b, this.src, f, !!d, e), b.Ca = c, a.push(b));return b;
    };function Hf(a, b) {
      var c = b.type;c in a.a && La(a.a[c], b) && (Ef(b), 0 == a.a[c].length && (delete a.a[c], a.f--));
    }function Gf(a, b, c, d) {
      for (var e = 0; e < a.length; ++e) {
        var f = a[e];if (!f.qa && f.listener == b && f.capture == !!c && f.Fa == d) return e;
      }return -1;
    }var If = "closure_lm_" + (1E6 * Math.random() | 0),
        Jf = {},
        Kf = 0;function Lf(a, b, c, d, e) {
      if (d && d.once) return Mf(a, b, c, d, e);if (oa(b)) {
        for (var f = 0; f < b.length; f++) {
          Lf(a, b[f], c, d, e);
        }return null;
      }c = Nf(c);return a && a[Bf] ? a.F.add(String(b), c, !1, ra(d) ? !!d.capture : !!d, e) : Of(a, b, c, !1, d, e);
    }function Of(a, b, c, d, e, f) {
      if (!b) throw Error("Invalid event type");var g = ra(e) ? !!e.capture : !!e,
          h = Pf(a);h || (a[If] = h = new Ff(a));c = h.add(b, c, d, g, f);if (c.proxy) return c;d = Qf();c.proxy = d;d.src = a;d.listener = c;if (a.addEventListener) sf || (e = g), void 0 === e && (e = !1), a.addEventListener(b.toString(), d, e);else if (a.attachEvent) a.attachEvent(Rf(b.toString()), d);else if (a.addListener && a.removeListener) a.addListener(d);else throw Error("addEventListener and attachEvent are unavailable.");Kf++;return c;
    }function Qf() {
      var a = Sf,
          b = qf ? function (c) {
        return a.call(b.src, b.listener, c);
      } : function (c) {
        c = a.call(b.src, b.listener, c);if (!c) return c;
      };return b;
    }function Mf(a, b, c, d, e) {
      if (oa(b)) {
        for (var f = 0; f < b.length; f++) {
          Mf(a, b[f], c, d, e);
        }return null;
      }c = Nf(c);return a && a[Bf] ? a.F.add(String(b), c, !0, ra(d) ? !!d.capture : !!d, e) : Of(a, b, c, !0, d, e);
    }function Tf(a, b, c, d, e) {
      if (oa(b)) for (var f = 0; f < b.length; f++) {
        Tf(a, b[f], c, d, e);
      } else (d = ra(d) ? !!d.capture : !!d, c = Nf(c), a && a[Bf]) ? (a = a.F, b = String(b).toString(), b in a.a && (f = a.a[b], c = Gf(f, c, d, e), -1 < c && (Ef(f[c]), Ma(f, c), 0 == f.length && (delete a.a[b], a.f--)))) : a && (a = Pf(a)) && (b = a.a[b.toString()], a = -1, b && (a = Gf(b, c, d, e)), (c = -1 < a ? b[a] : null) && Uf(c));
    }function Uf(a) {
      if ("number" != typeof a && a && !a.qa) {
        var b = a.src;if (b && b[Bf]) Hf(b.F, a);else {
          var c = a.type,
              d = a.proxy;b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent ? b.detachEvent(Rf(c), d) : b.addListener && b.removeListener && b.removeListener(d);Kf--;(c = Pf(b)) ? (Hf(c, a), 0 == c.f && (c.src = null, b[If] = null)) : Ef(a);
        }
      }
    }function Rf(a) {
      return a in Jf ? Jf[a] : Jf[a] = "on" + a;
    }function Vf(a, b, c, d) {
      var e = !0;if (a = Pf(a)) if (b = a.a[b.toString()]) for (b = b.concat(), a = 0; a < b.length; a++) {
        var f = b[a];f && f.capture == c && !f.qa && (f = Wf(f, d), e = e && !1 !== f);
      }return e;
    }function Wf(a, b) {
      var c = a.listener,
          d = a.Fa || a.src;a.Ca && Uf(a);
      return c.call(d, b);
    }function Sf(a, b) {
      if (a.qa) return !0;if (!qf) {
        if (!b) a: {
          b = ["window", "event"];for (var c = l, d = 0; d < b.length; d++) {
            if (c = c[b[d]], null == c) {
              b = null;break a;
            }
          }b = c;
        }d = b;b = new zf(d, this);c = !0;if (!(0 > d.keyCode || void 0 != d.returnValue)) {
          a: {
            var e = !1;if (0 == d.keyCode) try {
              d.keyCode = -1;break a;
            } catch (g) {
              e = !0;
            }if (e || void 0 == d.returnValue) d.returnValue = !0;
          }d = [];for (e = b.f; e; e = e.parentNode) {
            d.push(e);
          }a = a.type;for (e = d.length - 1; !b.h && 0 <= e; e--) {
            b.f = d[e];var f = Vf(d[e], a, !0, b);c = c && f;
          }for (e = 0; !b.h && e < d.length; e++) {
            b.f = d[e], f = Vf(d[e], a, !1, b), c = c && f;
          }
        }return c;
      }return Wf(a, new zf(b, this));
    }function Pf(a) {
      a = a[If];return a instanceof Ff ? a : null;
    }var Xf = "__closure_events_fn_" + (1E9 * Math.random() >>> 0);function Nf(a) {
      if (qa(a)) return a;a[Xf] || (a[Xf] = function (b) {
        return a.handleEvent(b);
      });return a[Xf];
    }function Yf(a, b, c) {
      b || (b = {});c = c || window;var d = a instanceof Kb ? a : Ob("undefined" != typeof a.href ? a.href : String(a));a = b.target || a.target;var e = [];for (f in b) {
        switch (f) {case "width":case "height":case "top":case "left":
            e.push(f + "=" + b[f]);break;
          case "target":case "noopener":case "noreferrer":
            break;default:
            e.push(f + "=" + (b[f] ? 1 : 0));}
      }var f = e.join(",");(u("iPhone") && !u("iPod") && !u("iPad") || u("iPad") || u("iPod")) && c.navigator && c.navigator.standalone && a && "_self" != a ? (f = c.document.createElement("A"), d instanceof Kb || d instanceof Kb || (d = "object" == typeof d && d.ka ? d.ia() : String(d), Nb.test(d) || (d = "about:invalid#zClosurez"), d = Pb(d)), f.href = Mb(d), f.setAttribute("target", a), b.noreferrer && f.setAttribute("rel", "noreferrer"), b = document.createEvent("MouseEvent"), b.initMouseEvent("click", !0, !0, c, 1), f.dispatchEvent(b), c = {}) : b.noreferrer ? (c = c.open("", a, f), b = Mb(d), c && (pb && -1 != b.indexOf(";") && (b = "'" + b.replace(/'/g, "%27") + "'"), c.opener = null, b = '<meta name="referrer" content="no-referrer"><meta http-equiv="refresh" content="0; url=' + Ua(b) + '">', b = Vb(b, null), c.document.write(Ub(b)), c.document.close())) : (c = c.open(Mb(d), a, f)) && b.noopener && (c.opener = null);return c;
    }function Zf(a) {
      window.location.assign(Mb(Ob(a)));
    }function $f() {
      try {
        return !!(window.opener && window.opener.location && window.opener.location.assign && window.opener.location.hostname === window.location.hostname && window.opener.location.protocol === window.location.protocol);
      } catch (a) {}return !1;
    }function ag(a) {
      Yf(a, { target: window.cordova && window.cordova.InAppBrowser ? "_system" : "_blank" }, void 0);
    }function bg(a) {
      a = ra(a) && 1 == a.nodeType ? a : document.querySelector(String(a));if (null == a) throw Error("Could not find the FirebaseUI widget element on the page.");return a;
    }function cg() {
      return window.location.href;
    }function dg() {
      var a = null;
      return ff(new Ve(function (b) {
        "complete" == l.document.readyState ? b() : (a = function a() {
          b();
        }, Mf(window, "load", a));
      }), function (b) {
        Tf(window, "load", a);throw b;
      });
    }function eg() {
      for (var a = 32, b = []; 0 < a;) {
        b.push("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(62 * Math.random()))), a--;
      }return b.join("");
    }function fg() {
      this.a = new Fd();Gd(this.a, "acUiConfig");Gd(this.a, "autoUpgradeAnonymousUsers");Gd(this.a, "callbacks");Gd(this.a, "credentialHelper", gg);Gd(this.a, "immediateFederatedRedirect", !1);Gd(this.a, "popupMode", !1);Gd(this.a, "privacyPolicyUrl");Gd(this.a, "queryParameterForSignInSuccessUrl", "signInSuccessUrl");Gd(this.a, "queryParameterForWidgetMode", "mode");Gd(this.a, "signInFlow");Gd(this.a, "signInOptions");Gd(this.a, "signInSuccessUrl");Gd(this.a, "siteName");Gd(this.a, "tosUrl");Gd(this.a, "widgetUrl");
    }var gg = "accountchooser.com",
        hg = { Vb: gg, Yb: "googleyolo", NONE: "none" },
        ig = { Zb: "popup", ac: "redirect" };function jg(a) {
      return a.a.get("acUiConfig") || null;
    }var kg = { Xb: "callback", $b: "recoverEmail",
      bc: "resetPassword", cc: "select", dc: "signIn", ec: "verifyEmail" },
        lg = ["anonymous"],
        mg = ["sitekey", "tabindex", "callback", "expired-callback"];function ng(a) {
      var b = a.a.get("widgetUrl") || cg();return og(a, b);
    }function og(a, b) {
      a = pg(a);for (var c = b.search(xc), d = 0, e, f = []; 0 <= (e = wc(b, d, a, c));) {
        f.push(b.substring(d, e)), d = Math.min(b.indexOf("&", e) + 1 || c, c);
      }f.push(b.substr(d));b = f.join("").replace(zc, "$1");c = "=" + encodeURIComponent("select");(a += c) ? (c = b.indexOf("#"), 0 > c && (c = b.length), d = b.indexOf("?"), 0 > d || d > c ? (d = c, e = "") : e = b.substring(d + 1, c), b = [b.substr(0, d), e, b.substr(c)], c = b[1], b[1] = a ? c ? c + "&" + a : a : c, a = b[0] + (b[1] ? "?" + b[1] : "") + b[2]) : a = b;return a;
    }function qg(a) {
      var b = !!a.a.get("autoUpgradeAnonymousUsers");b && !tg(a) && xe('Missing "signInFailure" callback: "signInFailure" callback needs to be provided when "autoUpgradeAnonymousUsers" is set to true.', void 0);return b;
    }function ug(a) {
      a = a.a.get("signInOptions") || [];for (var b = [], c = 0; c < a.length; c++) {
        var d = a[c];d = ra(d) ? d : { provider: d };d.provider && b.push(d);
      }return b;
    }function vg(a, b) {
      a = ug(a);for (var c = 0; c < a.length; c++) {
        if (a[c].provider === b) return a[c];
      }return null;
    }function wg(a) {
      return Ha(ug(a), function (a) {
        return a.provider;
      });
    }function xg(a, b) {
      a = yg(a);for (var c = 0; c < a.length; c++) {
        if (a[c].providerId === b) return a[c];
      }return null;
    }function yg(a) {
      return Ha(ug(a), function (a) {
        return $d[a.provider] || Ka(lg, a.provider) ? { providerId: a.provider } : { providerId: a.provider, hb: a.providerName || a.provider, ob: a.buttonColor || null, fb: a.iconUrl ? Mb(Ob(a.iconUrl)) : null, Db: a.loginHintKey || null };
      });
    }function zg(a) {
      var b = [],
          c = [];Ea(ug(a), function (a) {
        a.authMethod && (b.push(a.authMethod), a.clientId && c.push({ uri: a.authMethod, clientId: a.clientId }));
      });var d = null;"googleyolo" === Ag(a) && b.length && (d = { supportedIdTokenProviders: c, supportedAuthMethods: b });return d;
    }function Bg(a, b) {
      var c = null;Ea(ug(a), function (a) {
        a.authMethod === b && (c = a.provider);
      });return c;
    }function Cg(a) {
      var b = null;Ea(ug(a), function (a) {
        a.provider == firebase.auth.PhoneAuthProvider.PROVIDER_ID && ra(a.recaptchaParameters) && !oa(a.recaptchaParameters) && (b = gb(a.recaptchaParameters));
      });
      if (b) {
        var c = [];Ea(mg, function (a) {
          "undefined" !== typeof b[a] && (c.push(a), delete b[a]);
        });c.length && Ce('The following provided "recaptchaParameters" keys are not allowed: ' + c.join(", "));
      }return b;
    }function Dg(a, b) {
      a = (a = vg(a, b)) && a.scopes;return oa(a) ? a : [];
    }function Eg(a, b) {
      a = (a = vg(a, b)) && a.customParameters;return ra(a) ? (a = gb(a), b === firebase.auth.GoogleAuthProvider.PROVIDER_ID && delete a.login_hint, a) : null;
    }function Fg(a) {
      a = vg(a, firebase.auth.PhoneAuthProvider.PROVIDER_ID);var b = null;a && m(a.loginHint) && (b = Wd(a.loginHint));return a && a.defaultNationalNumber || b && b.va || null;
    }function Gg(a) {
      var b = (a = vg(a, firebase.auth.PhoneAuthProvider.PROVIDER_ID)) && a.defaultCountry || null;b = b && Rd(b);var c = null;a && m(a.loginHint) && (c = Wd(a.loginHint));return b && b[0] || c && Pd(c.a) || null;
    }function Hg(a) {
      a = vg(a, firebase.auth.PhoneAuthProvider.PROVIDER_ID);if (!a) return null;var b = a.whitelistedCountries,
          c = a.blacklistedCountries;if ("undefined" !== typeof b && (!oa(b) || 0 == b.length)) throw Error("WhitelistedCountries must be a non-empty array.");
      if ("undefined" !== typeof c && !oa(c)) throw Error("BlacklistedCountries must be an array.");if (b && c) throw Error("Both whitelistedCountries and blacklistedCountries are provided.");if (!b && !c) return Qd;a = [];if (b) {
        c = {};for (var d = 0; d < b.length; d++) {
          var e = Sd(b[d]);for (var f = 0; f < e.length; f++) {
            c[e[f].c] = e[f];
          }
        }for (var g in c) {
          c.hasOwnProperty(g) && a.push(c[g]);
        }
      } else {
        g = {};for (d = 0; d < c.length; d++) {
          for (e = Sd(c[d]), f = 0; f < e.length; f++) {
            g[e[f].c] = e[f];
          }
        }for (b = 0; b < Qd.length; b++) {
          null !== g && Qd[b].c in g || a.push(Qd[b]);
        }
      }return a;
    }function pg(a) {
      return Id(a.a, "queryParameterForWidgetMode");
    }function B(a) {
      var b = a.a.get("tosUrl") || null;a = a.a.get("privacyPolicyUrl") || null;b && !a && Ce("Privacy Policy URL is missing, the link will not be displayed.");if (b && a) {
        if (qa(b)) return b;if (m(b)) return function () {
          ag(b);
        };
      }return null;
    }function C(a) {
      var b = a.a.get("tosUrl") || null,
          c = a.a.get("privacyPolicyUrl") || null;c && !b && Ce("Term of Service URL is missing, the link will not be displayed.");if (b && c) {
        if (qa(c)) return c;if (m(c)) return function () {
          ag(c);
        };
      }return null;
    }function Ig(a) {
      return (a = vg(a, firebase.auth.EmailAuthProvider.PROVIDER_ID)) && "undefined" !== typeof a.requireDisplayName ? !!a.requireDisplayName : !0;
    }function Jg(a) {
      a = vg(a, firebase.auth.EmailAuthProvider.PROVIDER_ID);return !(!a || a.signInMethod !== firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD);
    }function Kg(a) {
      a = vg(a, firebase.auth.EmailAuthProvider.PROVIDER_ID);return !(!a || !a.forceSameDevice);
    }function Lg(a) {
      if (Jg(a)) {
        var b = { url: cg(), handleCodeInApp: !0 };(a = vg(a, firebase.auth.EmailAuthProvider.PROVIDER_ID)) && "function" === typeof a.emailLinkSignIn && ib(b, a.emailLinkSignIn());b.url = Qc(cg(), b.url).toString();return b;
      }return null;
    }function Mg(a) {
      var b = !!a.a.get("immediateFederatedRedirect"),
          c = wg(a);a = Ng(a);return b && 1 == c.length && !Ka(Zd, c[0]) && "redirect" == a;
    }function Ng(a) {
      a = a.a.get("signInFlow");for (var b in ig) {
        if (ig[b] == a) return ig[b];
      }return "redirect";
    }function Og(a) {
      return Pg(a).uiShown || null;
    }function Qg(a) {
      return Pg(a).signInSuccess || null;
    }function Rg(a) {
      return Pg(a).signInSuccessWithAuthResult || null;
    }function tg(a) {
      return Pg(a).signInFailure || null;
    }function Pg(a) {
      return a.a.get("callbacks") || {};
    }function Ag(a) {
      if ("http:" !== (window.location && window.location.protocol) && "https:" !== (window.location && window.location.protocol)) return "none";a = a.a.get("credentialHelper");for (var b in hg) {
        if (hg[b] == a) return hg[b];
      }return gg;
    }function Sg(a) {
      this.a = Pc(a);
    }var D = { Ja: "ui_auid", Wb: "apiKey", Ka: "ui_sd", lb: "mode", Va: "oobCode", PROVIDER_ID: "ui_pid", Na: "ui_sid" };function Tg(a, b) {
      b ? a.a.a.set(D.Na, b) : Uc(a.a.a, D.Na);
    }function Ug(a, b) {
      null !== b ? a.a.a.set(D.Ka, b ? "1" : "0") : Uc(a.a.a, D.Ka);
    }function Vg(a) {
      return a.a.a.get(D.Ja) || null;
    }function Wg(a, b) {
      b ? a.a.a.set(D.PROVIDER_ID, b) : Uc(a.a.a, D.PROVIDER_ID);
    }Sg.prototype.toString = function () {
      return this.a.toString();
    };function E() {
      tf.call(this);this.F = new Ff(this);this.mb = this;this.Ba = null;
    }t(E, tf);E.prototype[Bf] = !0;E.prototype.Ua = function (a) {
      this.Ba = a;
    };E.prototype.removeEventListener = function (a, b, c, d) {
      Tf(this, a, b, c, d);
    };function Xg(a, b) {
      var c,
          d = a.Ba;if (d) for (c = []; d; d = d.Ba) {
        c.push(d);
      }a = a.mb;d = b.type || b;if (m(b)) b = new yf(b, a);else if (b instanceof yf) b.target = b.target || a;else {
        var e = b;b = new yf(d, a);ib(b, e);
      }e = !0;if (c) for (var f = c.length - 1; !b.h && 0 <= f; f--) {
        var g = b.f = c[f];e = Yg(g, d, !0, b) && e;
      }b.h || (g = b.f = a, e = Yg(g, d, !0, b) && e, b.h || (e = Yg(g, d, !1, b) && e));if (c) for (f = 0; !b.h && f < c.length; f++) {
        g = b.f = c[f], e = Yg(g, d, !1, b) && e;
      }return e;
    }E.prototype.l = function () {
      E.o.l.call(this);if (this.F) {
        var a = this.F,
            b = 0,
            c;for (c in a.a) {
          for (var d = a.a[c], e = 0; e < d.length; e++) {
            ++b, Ef(d[e]);
          }delete a.a[c];a.f--;
        }
      }this.Ba = null;
    };function Yg(a, b, c, d) {
      b = a.F.a[String(b)];if (!b) return !0;
      b = b.concat();for (var e = !0, f = 0; f < b.length; ++f) {
        var g = b[f];if (g && !g.qa && g.capture == c) {
          var h = g.listener,
              r = g.Fa || g.src;g.Ca && Hf(a.F, g);e = !1 !== h.call(r, d) && e;
        }
      }return e && 0 != d.ib;
    }var Zg = {},
        $g = 0;function ah(a, b) {
      if (!a) throw Error("Event target element must be provided!");a = bh(a);if (Zg[a] && Zg[a].length) for (var c = 0; c < Zg[a].length; c++) {
        Xg(Zg[a][c], b);
      }
    }function ch(a) {
      var b = bh(a.N());Zg[b] && Zg[b].length && (Na(Zg[b], function (b) {
        return b == a;
      }), Zg[b].length || delete Zg[b]);
    }function bh(a) {
      "undefined" === typeof a.a && (a.a = $g, $g++);return a.a;
    }function dh(a) {
      if (!a) throw Error("Event target element must be provided!");this.a = a;E.call(this);
    }t(dh, E);dh.prototype.N = function () {
      return this.a;
    };dh.prototype.register = function () {
      var a = bh(this.N());Zg[a] ? Ka(Zg[a], this) || Zg[a].push(this) : Zg[a] = [this];
    };function eh(a, b) {
      this.i = [];this.O = a;this.K = b || null;this.j = this.a = !1;this.h = void 0;this.F = this.s = this.w = !1;this.v = 0;this.f = null;this.C = 0;
    }eh.prototype.cancel = function (a) {
      if (this.a) this.h instanceof eh && this.h.cancel();else {
        if (this.f) {
          var b = this.f;delete this.f;a ? b.cancel(a) : (b.C--, 0 >= b.C && b.cancel());
        }this.O ? this.O.call(this.K, this) : this.F = !0;this.a || (a = new fh(this), gh(this), hh(this, !1, a));
      }
    };eh.prototype.I = function (a, b) {
      this.w = !1;hh(this, a, b);
    };function hh(a, b, c) {
      a.a = !0;a.h = c;a.j = !b;ih(a);
    }function gh(a) {
      if (a.a) {
        if (!a.F) throw new jh(a);a.F = !1;
      }
    }function kh(a, b, c) {
      a.i.push([b, c, void 0]);a.a && ih(a);
    }eh.prototype.then = function (a, b, c) {
      var d,
          e,
          f = new Ve(function (a, b) {
        d = a;e = b;
      });kh(this, d, function (a) {
        a instanceof fh ? f.cancel() : e(a);
      });return f.then(a, b, c);
    };De(eh);function lh(a) {
      return Ia(a.i, function (a) {
        return qa(a[1]);
      });
    }function ih(a) {
      if (a.v && a.a && lh(a)) {
        var b = a.v,
            c = mh[b];c && (l.clearTimeout(c.a), delete mh[b]);a.v = 0;
      }a.f && (a.f.C--, delete a.f);b = a.h;for (var d = c = !1; a.i.length && !a.w;) {
        var e = a.i.shift(),
            f = e[0],
            g = e[1];e = e[2];if (f = a.j ? g : f) try {
          var h = f.call(e || a.K, b);fa(h) && (a.j = a.j && (h == b || h instanceof Error), a.h = b = h);if (Fe(b) || "function" === typeof l.Promise && b instanceof l.Promise) d = !0, a.w = !0;
        } catch (r) {
          b = r, a.j = !0, lh(a) || (c = !0);
        }
      }a.h = b;d && (h = p(a.I, a, !0), d = p(a.I, a, !1), b instanceof eh ? (kh(b, h, d), b.s = !0) : b.then(h, d));c && (b = new nh(b), mh[b.a] = b, a.v = b.a);
    }function jh() {
      za.call(this);
    }t(jh, za);jh.prototype.message = "Deferred has already fired";jh.prototype.name = "AlreadyCalledError";function fh() {
      za.call(this);
    }t(fh, za);fh.prototype.message = "Deferred was canceled";fh.prototype.name = "CanceledError";function nh(a) {
      this.a = l.setTimeout(p(this.h, this), 0);this.f = a;
    }nh.prototype.h = function () {
      delete mh[this.a];throw this.f;
    };var mh = {};function oh(a) {
      var b = {},
          c = b.document || document,
          d = Ib(a),
          e = document.createElement("SCRIPT"),
          f = { jb: e, kb: void 0 },
          g = new eh(ph, f),
          h = null,
          r = null != b.timeout ? b.timeout : 5E3;0 < r && (h = window.setTimeout(function () {
        qh(e, !0);var a = new rh(sh, "Timeout reached for loading script " + d);gh(g);hh(g, !1, a);
      }, r), f.kb = h);e.onload = e.onreadystatechange = function () {
        e.readyState && "loaded" != e.readyState && "complete" != e.readyState || (qh(e, b.hc || !1, h), gh(g), hh(g, !0, null));
      };e.onerror = function () {
        qh(e, !0, h);var a = new rh(th, "Error while loading script " + d);gh(g);hh(g, !1, a);
      };
      f = b.attributes || {};ib(f, { type: "text/javascript", charset: "UTF-8" });fc(e, f);Xb(e, a);uh(c).appendChild(e);return g;
    }function uh(a) {
      var b = (a || document).getElementsByTagName("HEAD");return b && 0 != b.length ? b[0] : a.documentElement;
    }function ph() {
      if (this && this.jb) {
        var a = this.jb;a && "SCRIPT" == a.tagName && qh(a, !0, this.kb);
      }
    }function qh(a, b, c) {
      null != c && l.clearTimeout(c);a.onload = ja;a.onerror = ja;a.onreadystatechange = ja;b && window.setTimeout(function () {
        ic(a);
      }, 0);
    }var th = 0,
        sh = 1;function rh(a, b) {
      var c = "Jsloader error (code #" + a + ")";b && (c += ": " + b);za.call(this, c);this.code = a;
    }t(rh, za);function vh(a) {
      this.a = a || l.googleyolo;this.f = null;this.h = !1;
    }ka(vh);var wh = new Cb(Db, "https://smartlock.google.com/client");vh.prototype.cancel = function () {
      this.a && this.h && (this.f = this.a.cancelLastOperation().catch(function () {}));
    };function xh(a, b, c) {
      if (a.a && b) {
        var d = function d() {
          a.h = !0;var d = Promise.resolve(null);c || (d = a.a.retrieve(b).catch(function (a) {
            if ("userCanceled" === a.type || "illegalConcurrentRequest" === a.type) throw a;return null;
          }));return d.then(function (c) {
            return c ? c : a.a.hint(b);
          }).catch(function (d) {
            if ("userCanceled" === d.type) a.f = Promise.resolve();else if ("illegalConcurrentRequest" === d.type) return a.cancel(), xh(a, b, c);return null;
          });
        };return a.f ? a.f.then(d) : d();
      }if (b) return d = ff(yh.Sa().load().then(function () {
        a.a = l.googleyolo;return xh(a, b, c);
      }), function () {
        return null;
      }), Promise.resolve(d);if ("undefined" !== typeof Promise) return Promise.resolve(null);throw Error("One-Tap sign in not supported in the current browser!");
    }function yh() {
      this.a = null;
    }ka(yh);yh.prototype.load = function () {
      var a = this;if (this.a) return this.a;var b = Jb(Fb(wh));return l.googleyolo ? A() : this.a = dg().then(function () {
        if (!l.googleyolo) return new Ve(function (c, d) {
          var e = setTimeout(function () {
            a.a = null;d(Error("Network error!"));
          }, 1E4);l.onGoogleYoloLoad = function () {
            clearTimeout(e);c();
          };ff(A(oh(b)), function (b) {
            clearTimeout(e);a.a = null;d(b);
          });
        });
      });
    };function zh(a, b) {
      this.a = a;this.f = b || function (a) {
        throw a;
      };
    }zh.prototype.confirm = function (a) {
      return ff(A(this.a.confirm(a)), this.f);
    };function Ah(a, b, c, d) {
      this.a = a;this.h = b || null;this.j = c || null;this.f = d || null;
    }Ah.prototype.na = function () {
      return { email: this.a, displayName: this.h, photoUrl: this.j, providerId: this.f };
    };function Bh(a) {
      return a.email ? new Ah(a.email, a.displayName, a.photoUrl, a.providerId) : null;
    }function Ch() {
      this.a = ("undefined" == typeof document ? null : document) || { cookie: "" };
    }k = Ch.prototype;k.set = function (a, b, c, d, e, f) {
      if (/[;=\s]/.test(a)) throw Error('Invalid cookie name "' + a + '"');if (/[;\r\n]/.test(b)) throw Error('Invalid cookie value "' + b + '"');fa(c) || (c = -1);
      e = e ? ";domain=" + e : "";d = d ? ";path=" + d : "";f = f ? ";secure" : "";c = 0 > c ? "" : 0 == c ? ";expires=" + new Date(1970, 1, 1).toUTCString() : ";expires=" + new Date(xa() + 1E3 * c).toUTCString();this.a.cookie = a + "=" + b + e + d + c + f;
    };k.get = function (a, b) {
      for (var c = a + "=", d = (this.a.cookie || "").split(";"), e = 0, f; e < d.length; e++) {
        f = Ta(d[e]);if (0 == f.lastIndexOf(c, 0)) return f.substr(c.length);if (f == a) return "";
      }return b;
    };k.ha = function () {
      return Dh(this).keys;
    };k.ja = function () {
      return Dh(this).values;
    };k.clear = function () {
      for (var a = Dh(this).keys, b = a.length - 1; 0 <= b; b--) {
        var c = a[b];this.get(c);this.set(c, "", 0, void 0, void 0);
      }
    };function Dh(a) {
      a = (a.a.cookie || "").split(";");for (var b = [], c = [], d, e, f = 0; f < a.length; f++) {
        e = Ta(a[f]), d = e.indexOf("="), -1 == d ? (b.push(""), c.push(e)) : (b.push(e.substring(0, d)), c.push(e.substring(d + 1)));
      }return { keys: b, values: c };
    }var Eh = new Ch();Eh.f = 3950;function Fh() {}function Gh(a, b, c, d) {
      this.h = "undefined" !== typeof a && null !== a ? a : -1;this.f = b || null;this.a = c || null;this.j = !!d;
    }t(Gh, Fh);Gh.prototype.set = function (a, b) {
      Eh.set(a, b, this.h, this.f, this.a, this.j);
    };Gh.prototype.get = function (a) {
      return Eh.get(a) || null;
    };Gh.prototype.pa = function (a) {
      var b = this.f,
          c = this.a;Eh.get(a);Eh.set(a, "", 0, b, c);
    };function Hh(a, b) {
      this.f = a;this.a = b || null;
    }Hh.prototype.na = function () {
      return { email: this.f, credential: this.a && this.a.toJSON() };
    };function Ih(a) {
      if (a && a.email) {
        var b = a.credential && firebase.auth.AuthCredential.fromJSON(a.credential);return new Hh(a.email, b);
      }return null;
    }function Jh(a) {
      for (var b = [], c = 0, d = 0; d < a.length; d++) {
        var e = a.charCodeAt(d);255 < e && (b[c++] = e & 255, e >>= 8);b[c++] = e;
      }return b;
    }function Kh(a) {
      return Ha(a, function (a) {
        a = a.toString(16);return 1 < a.length ? a : "0" + a;
      }).join("");
    }function Lh(a) {
      this.v = a;this.f = this.v.length / 4;this.j = this.f + 6;this.h = [[], [], [], []];this.i = [[], [], [], []];this.a = Array(Mh * (this.j + 1));for (a = 0; a < this.f; a++) {
        this.a[a] = [this.v[4 * a], this.v[4 * a + 1], this.v[4 * a + 2], this.v[4 * a + 3]];
      }var b = Array(4);for (a = this.f; a < Mh * (this.j + 1); a++) {
        b[0] = this.a[a - 1][0];b[1] = this.a[a - 1][1];b[2] = this.a[a - 1][2];b[3] = this.a[a - 1][3];if (0 == a % this.f) {
          var c = b,
              d = c[0];c[0] = c[1];c[1] = c[2];c[2] = c[3];c[3] = d;Nh(b);b[0] ^= Oh[a / this.f][0];b[1] ^= Oh[a / this.f][1];b[2] ^= Oh[a / this.f][2];b[3] ^= Oh[a / this.f][3];
        } else 6 < this.f && 4 == a % this.f && Nh(b);this.a[a] = Array(4);this.a[a][0] = this.a[a - this.f][0] ^ b[0];this.a[a][1] = this.a[a - this.f][1] ^ b[1];this.a[a][2] = this.a[a - this.f][2] ^ b[2];this.a[a][3] = this.a[a - this.f][3] ^ b[3];
      }
    }Lh.prototype.w = 16;var Mh = Lh.prototype.w / 4;function Ph(a, b) {
      for (var c, d = 0; d < Mh; d++) {
        for (var e = 0; 4 > e; e++) {
          c = 4 * e + d, c = b[c], a.h[d][e] = c;
        }
      }
    }function Qh(a) {
      for (var b = [], c = 0; c < Mh; c++) {
        for (var d = 0; 4 > d; d++) {
          b[4 * d + c] = a.h[c][d];
        }
      }return b;
    }function Rh(a, b) {
      for (var c = 0; 4 > c; c++) {
        for (var d = 0; 4 > d; d++) {
          a.h[c][d] ^= a.a[4 * b + d][c];
        }
      }
    }function Sh(a, b) {
      for (var c = 0; 4 > c; c++) {
        for (var d = 0; 4 > d; d++) {
          a.h[c][d] = b[a.h[c][d]];
        }
      }
    }function Th(a) {
      for (var b = 1; 4 > b; b++) {
        for (var c = 0; 4 > c; c++) {
          a.i[b][c] = a.h[b][c];
        }
      }for (b = 1; 4 > b; b++) {
        for (c = 0; 4 > c; c++) {
          a.h[b][c] = a.i[b][(c + b) % Mh];
        }
      }
    }function Uh(a) {
      for (var b = 1; 4 > b; b++) {
        for (var c = 0; 4 > c; c++) {
          a.i[b][(c + b) % Mh] = a.h[b][c];
        }
      }for (b = 1; 4 > b; b++) {
        for (c = 0; 4 > c; c++) {
          a.h[b][c] = a.i[b][c];
        }
      }
    }function Nh(a) {
      a[0] = Vh[a[0]];a[1] = Vh[a[1]];a[2] = Vh[a[2]];a[3] = Vh[a[3]];
    }var Vh = [99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22],
        Wh = [82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215, 251, 124, 227, 57, 130, 155, 47, 255, 135, 52, 142, 67, 68, 196, 222, 233, 203, 84, 123, 148, 50, 166, 194, 35, 61, 238, 76, 149, 11, 66, 250, 195, 78, 8, 46, 161, 102, 40, 217, 36, 178, 118, 91, 162, 73, 109, 139, 209, 37, 114, 248, 246, 100, 134, 104, 152, 22, 212, 164, 92, 204, 93, 101, 182, 146, 108, 112, 72, 80, 253, 237, 185, 218, 94, 21, 70, 87, 167, 141, 157, 132, 144, 216, 171, 0, 140, 188, 211, 10, 247, 228, 88, 5, 184, 179, 69, 6, 208, 44, 30, 143, 202, 63, 15, 2, 193, 175, 189, 3, 1, 19, 138, 107, 58, 145, 17, 65, 79, 103, 220, 234, 151, 242, 207, 206, 240, 180, 230, 115, 150, 172, 116, 34, 231, 173, 53, 133, 226, 249, 55, 232, 28, 117, 223, 110, 71, 241, 26, 113, 29, 41, 197, 137, 111, 183, 98, 14, 170, 24, 190, 27, 252, 86, 62, 75, 198, 210, 121, 32, 154, 219, 192, 254, 120, 205, 90, 244, 31, 221, 168, 51, 136, 7, 199, 49, 177, 18, 16, 89, 39, 128, 236, 95, 96, 81, 127, 169, 25, 181, 74, 13, 45, 229, 122, 159, 147, 201, 156, 239, 160, 224, 59, 77, 174, 42, 245, 176, 200, 235, 187, 60, 131, 83, 153, 97, 23, 43, 4, 126, 186, 119, 214, 38, 225, 105, 20, 99, 85, 33, 12, 125],
        Oh = [[0, 0, 0, 0], [1, 0, 0, 0], [2, 0, 0, 0], [4, 0, 0, 0], [8, 0, 0, 0], [16, 0, 0, 0], [32, 0, 0, 0], [64, 0, 0, 0], [128, 0, 0, 0], [27, 0, 0, 0], [54, 0, 0, 0]],
        Xh = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124, 126, 128, 130, 132, 134, 136, 138, 140, 142, 144, 146, 148, 150, 152, 154, 156, 158, 160, 162, 164, 166, 168, 170, 172, 174, 176, 178, 180, 182, 184, 186, 188, 190, 192, 194, 196, 198, 200, 202, 204, 206, 208, 210, 212, 214, 216, 218, 220, 222, 224, 226, 228, 230, 232, 234, 236, 238, 240, 242, 244, 246, 248, 250, 252, 254, 27, 25, 31, 29, 19, 17, 23, 21, 11, 9, 15, 13, 3, 1, 7, 5, 59, 57, 63, 61, 51, 49, 55, 53, 43, 41, 47, 45, 35, 33, 39, 37, 91, 89, 95, 93, 83, 81, 87, 85, 75, 73, 79, 77, 67, 65, 71, 69, 123, 121, 127, 125, 115, 113, 119, 117, 107, 105, 111, 109, 99, 97, 103, 101, 155, 153, 159, 157, 147, 145, 151, 149, 139, 137, 143, 141, 131, 129, 135, 133, 187, 185, 191, 189, 179, 177, 183, 181, 171, 169, 175, 173, 163, 161, 167, 165, 219, 217, 223, 221, 211, 209, 215, 213, 203, 201, 207, 205, 195, 193, 199, 197, 251, 249, 255, 253, 243, 241, 247, 245, 235, 233, 239, 237, 227, 225, 231, 229],
        Yh = [0, 3, 6, 5, 12, 15, 10, 9, 24, 27, 30, 29, 20, 23, 18, 17, 48, 51, 54, 53, 60, 63, 58, 57, 40, 43, 46, 45, 36, 39, 34, 33, 96, 99, 102, 101, 108, 111, 106, 105, 120, 123, 126, 125, 116, 119, 114, 113, 80, 83, 86, 85, 92, 95, 90, 89, 72, 75, 78, 77, 68, 71, 66, 65, 192, 195, 198, 197, 204, 207, 202, 201, 216, 219, 222, 221, 212, 215, 210, 209, 240, 243, 246, 245, 252, 255, 250, 249, 232, 235, 238, 237, 228, 231, 226, 225, 160, 163, 166, 165, 172, 175, 170, 169, 184, 187, 190, 189, 180, 183, 178, 177, 144, 147, 150, 149, 156, 159, 154, 153, 136, 139, 142, 141, 132, 135, 130, 129, 155, 152, 157, 158, 151, 148, 145, 146, 131, 128, 133, 134, 143, 140, 137, 138, 171, 168, 173, 174, 167, 164, 161, 162, 179, 176, 181, 182, 191, 188, 185, 186, 251, 248, 253, 254, 247, 244, 241, 242, 227, 224, 229, 230, 239, 236, 233, 234, 203, 200, 205, 206, 199, 196, 193, 194, 211, 208, 213, 214, 223, 220, 217, 218, 91, 88, 93, 94, 87, 84, 81, 82, 67, 64, 69, 70, 79, 76, 73, 74, 107, 104, 109, 110, 103, 100, 97, 98, 115, 112, 117, 118, 127, 124, 121, 122, 59, 56, 61, 62, 55, 52, 49, 50, 35, 32, 37, 38, 47, 44, 41, 42, 11, 8, 13, 14, 7, 4, 1, 2, 19, 16, 21, 22, 31, 28, 25, 26],
        Zh = [0, 9, 18, 27, 36, 45, 54, 63, 72, 65, 90, 83, 108, 101, 126, 119, 144, 153, 130, 139, 180, 189, 166, 175, 216, 209, 202, 195, 252, 245, 238, 231, 59, 50, 41, 32, 31, 22, 13, 4, 115, 122, 97, 104, 87, 94, 69, 76, 171, 162, 185, 176, 143, 134, 157, 148, 227, 234, 241, 248, 199, 206, 213, 220, 118, 127, 100, 109, 82, 91, 64, 73, 62, 55, 44, 37, 26, 19, 8, 1, 230, 239, 244, 253, 194, 203, 208, 217, 174, 167, 188, 181, 138, 131, 152, 145, 77, 68, 95, 86, 105, 96, 123, 114, 5, 12, 23, 30, 33, 40, 51, 58, 221, 212, 207, 198, 249, 240, 235, 226, 149, 156, 135, 142, 177, 184, 163, 170, 236, 229, 254, 247, 200, 193, 218, 211, 164, 173, 182, 191, 128, 137, 146, 155, 124, 117, 110, 103, 88, 81, 74, 67, 52, 61, 38, 47, 16, 25, 2, 11, 215, 222, 197, 204, 243, 250, 225, 232, 159, 150, 141, 132, 187, 178, 169, 160, 71, 78, 85, 92, 99, 106, 113, 120, 15, 6, 29, 20, 43, 34, 57, 48, 154, 147, 136, 129, 190, 183, 172, 165, 210, 219, 192, 201, 246, 255, 228, 237, 10, 3, 24, 17, 46, 39, 60, 53, 66, 75, 80, 89, 102, 111, 116, 125, 161, 168, 179, 186, 133, 140, 151, 158, 233, 224, 251, 242, 205, 196, 223, 214, 49, 56, 35, 42, 21, 28, 7, 14, 121, 112, 107, 98, 93, 84, 79, 70],
        $h = [0, 11, 22, 29, 44, 39, 58, 49, 88, 83, 78, 69, 116, 127, 98, 105, 176, 187, 166, 173, 156, 151, 138, 129, 232, 227, 254, 245, 196, 207, 210, 217, 123, 112, 109, 102, 87, 92, 65, 74, 35, 40, 53, 62, 15, 4, 25, 18, 203, 192, 221, 214, 231, 236, 241, 250, 147, 152, 133, 142, 191, 180, 169, 162, 246, 253, 224, 235, 218, 209, 204, 199, 174, 165, 184, 179, 130, 137, 148, 159, 70, 77, 80, 91, 106, 97, 124, 119, 30, 21, 8, 3, 50, 57, 36, 47, 141, 134, 155, 144, 161, 170, 183, 188, 213, 222, 195, 200, 249, 242, 239, 228, 61, 54, 43, 32, 17, 26, 7, 12, 101, 110, 115, 120, 73, 66, 95, 84, 247, 252, 225, 234, 219, 208, 205, 198, 175, 164, 185, 178, 131, 136, 149, 158, 71, 76, 81, 90, 107, 96, 125, 118, 31, 20, 9, 2, 51, 56, 37, 46, 140, 135, 154, 145, 160, 171, 182, 189, 212, 223, 194, 201, 248, 243, 238, 229, 60, 55, 42, 33, 16, 27, 6, 13, 100, 111, 114, 121, 72, 67, 94, 85, 1, 10, 23, 28, 45, 38, 59, 48, 89, 82, 79, 68, 117, 126, 99, 104, 177, 186, 167, 172, 157, 150, 139, 128, 233, 226, 255, 244, 197, 206, 211, 216, 122, 113, 108, 103, 86, 93, 64, 75, 34, 41, 52, 63, 14, 5, 24, 19, 202, 193, 220, 215, 230, 237, 240, 251, 146, 153, 132, 143, 190, 181, 168, 163],
        ai = [0, 13, 26, 23, 52, 57, 46, 35, 104, 101, 114, 127, 92, 81, 70, 75, 208, 221, 202, 199, 228, 233, 254, 243, 184, 181, 162, 175, 140, 129, 150, 155, 187, 182, 161, 172, 143, 130, 149, 152, 211, 222, 201, 196, 231, 234, 253, 240, 107, 102, 113, 124, 95, 82, 69, 72, 3, 14, 25, 20, 55, 58, 45, 32, 109, 96, 119, 122, 89, 84, 67, 78, 5, 8, 31, 18, 49, 60, 43, 38, 189, 176, 167, 170, 137, 132, 147, 158, 213, 216, 207, 194, 225, 236, 251, 246, 214, 219, 204, 193, 226, 239, 248, 245, 190, 179, 164, 169, 138, 135, 144, 157, 6, 11, 28, 17, 50, 63, 40, 37, 110, 99, 116, 121, 90, 87, 64, 77, 218, 215, 192, 205, 238, 227, 244, 249, 178, 191, 168, 165, 134, 139, 156, 145, 10, 7, 16, 29, 62, 51, 36, 41, 98, 111, 120, 117, 86, 91, 76, 65, 97, 108, 123, 118, 85, 88, 79, 66, 9, 4, 19, 30, 61, 48, 39, 42, 177, 188, 171, 166, 133, 136, 159, 146, 217, 212, 195, 206, 237, 224, 247, 250, 183, 186, 173, 160, 131, 142, 153, 148, 223, 210, 197, 200, 235, 230, 241, 252, 103, 106, 125, 112, 83, 94, 73, 68, 15, 2, 21, 24, 59, 54, 33, 44, 12, 1, 22, 27, 56, 53, 34, 47, 100, 105, 126, 115, 80, 93, 74, 71, 220, 209, 198, 203, 232, 229, 242, 255, 180, 185, 174, 163, 128, 141, 154, 151],
        bi = [0, 14, 28, 18, 56, 54, 36, 42, 112, 126, 108, 98, 72, 70, 84, 90, 224, 238, 252, 242, 216, 214, 196, 202, 144, 158, 140, 130, 168, 166, 180, 186, 219, 213, 199, 201, 227, 237, 255, 241, 171, 165, 183, 185, 147, 157, 143, 129, 59, 53, 39, 41, 3, 13, 31, 17, 75, 69, 87, 89, 115, 125, 111, 97, 173, 163, 177, 191, 149, 155, 137, 135, 221, 211, 193, 207, 229, 235, 249, 247, 77, 67, 81, 95, 117, 123, 105, 103, 61, 51, 33, 47, 5, 11, 25, 23, 118, 120, 106, 100, 78, 64, 82, 92, 6, 8, 26, 20, 62, 48, 34, 44, 150, 152, 138, 132, 174, 160, 178, 188, 230, 232, 250, 244, 222, 208, 194, 204, 65, 79, 93, 83, 121, 119, 101, 107, 49, 63, 45, 35, 9, 7, 21, 27, 161, 175, 189, 179, 153, 151, 133, 139, 209, 223, 205, 195, 233, 231, 245, 251, 154, 148, 134, 136, 162, 172, 190, 176, 234, 228, 246, 248, 210, 220, 206, 192, 122, 116, 102, 104, 66, 76, 94, 80, 10, 4, 22, 24, 50, 60, 46, 32, 236, 226, 240, 254, 212, 218, 200, 198, 156, 146, 128, 142, 164, 170, 184, 182, 12, 2, 16, 30, 52, 58, 40, 38, 124, 114, 96, 110, 68, 74, 88, 86, 55, 57, 43, 37, 15, 1, 19, 29, 71, 73, 91, 85, 127, 113, 99, 109, 215, 217, 203, 197, 239, 225, 243, 253, 167, 169, 187, 181, 159, 145, 131, 141];function ci(a, b) {
      a = new Lh(di(a));b = Jh(b);for (var c = Ra(b, 0, 16), d = "", e; c.length;) {
        e = 16 - c.length;for (var f = 0; f < e; f++) {
          c.push(0);
        }e = a;Ph(e, c);Rh(e, 0);for (c = 1; c < e.j; ++c) {
          Sh(e, Vh);Th(e);f = e.h;for (var g = e.i[0], h = 0; 4 > h; h++) {
            g[0] = f[0][h], g[1] = f[1][h], g[2] = f[2][h], g[3] = f[3][h], f[0][h] = Xh[g[0]] ^ Yh[g[1]] ^ g[2] ^ g[3], f[1][h] = g[0] ^ Xh[g[1]] ^ Yh[g[2]] ^ g[3], f[2][h] = g[0] ^ g[1] ^ Xh[g[2]] ^ Yh[g[3]], f[3][h] = Yh[g[0]] ^ g[1] ^ g[2] ^ Xh[g[3]];
          }Rh(e, c);
        }Sh(e, Vh);Th(e);Rh(e, e.j);d += Kh(Qh(e));c = Ra(b, 0, 16);
      }return d;
    }function ei(a, b) {
      a = new Lh(di(a));for (var c = [], d = 0; d < b.length; d += 2) {
        c.push(parseInt(b.substring(d, d + 2), 16));
      }var e = Ra(c, 0, 16);for (b = ""; e.length;) {
        d = a;Ph(d, e);Rh(d, d.j);for (e = 1; e < d.j; ++e) {
          Uh(d);Sh(d, Wh);Rh(d, d.j - e);for (var f = d.h, g = d.i[0], h = 0; 4 > h; h++) {
            g[0] = f[0][h], g[1] = f[1][h], g[2] = f[2][h], g[3] = f[3][h], f[0][h] = bi[g[0]] ^ $h[g[1]] ^ ai[g[2]] ^ Zh[g[3]], f[1][h] = Zh[g[0]] ^ bi[g[1]] ^ $h[g[2]] ^ ai[g[3]], f[2][h] = ai[g[0]] ^ Zh[g[1]] ^ bi[g[2]] ^ $h[g[3]], f[3][h] = $h[g[0]] ^ ai[g[1]] ^ Zh[g[2]] ^ bi[g[3]];
          }
        }Uh(d);Sh(d, Wh);Rh(d, 0);d = Qh(d);if (8192 >= d.length) d = String.fromCharCode.apply(null, d);else {
          e = "";for (f = 0; f < d.length; f += 8192) {
            e += String.fromCharCode.apply(null, Sa(d, f, f + 8192));
          }d = e;
        }b += d;e = Ra(c, 0, 16);
      }return b.replace(/(\x00)+$/, "");
    }function di(a) {
      a = Jh(a.substring(0, 32));for (var b = 32 - a.length, c = 0; c < b; c++) {
        a.push(0);
      }return a;
    }function fi(a) {
      var b = [];gi(new hi(), a, b);return b.join("");
    }function hi() {}function gi(a, b, c) {
      if (null == b) c.push("null");else {
        if ("object" == typeof b) {
          if (oa(b)) {
            var d = b;b = d.length;c.push("[");for (var e = "", f = 0; f < b; f++) {
              c.push(e), gi(a, d[f], c), e = ",";
            }c.push("]");return;
          }if (b instanceof String || b instanceof Number || b instanceof Boolean) b = b.valueOf();else {
            c.push("{");e = "";for (d in b) {
              Object.prototype.hasOwnProperty.call(b, d) && (f = b[d], "function" != typeof f && (c.push(e), ii(d, c), c.push(":"), gi(a, f, c), e = ","));
            }c.push("}");return;
          }
        }switch (typeof b) {case "string":
            ii(b, c);break;case "number":
            c.push(isFinite(b) && !isNaN(b) ? String(b) : "null");break;case "boolean":
            c.push(String(b));break;case "function":
            c.push("null");break;default:
            throw Error("Unknown type: " + typeof b);}
      }
    }var ji = { '"': '\\"', "\\": "\\\\",
      "/": "\\/", "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "\t": "\\t", "\x0B": "\\u000b" },
        ki = /\uffff/.test("\uffff") ? /[\\"\x00-\x1f\x7f-\uffff]/g : /[\\"\x00-\x1f\x7f-\xff]/g;function ii(a, b) {
      b.push('"', a.replace(ki, function (a) {
        var b = ji[a];b || (b = "\\u" + (a.charCodeAt(0) | 65536).toString(16).substr(1), ji[a] = b);return b;
      }), '"');
    }function li(a) {
      this.a = a;
    }li.prototype.set = function (a, b) {
      fa(b) ? this.a.set(a, fi(b)) : this.a.pa(a);
    };li.prototype.get = function (a) {
      try {
        var b = this.a.get(a);
      } catch (c) {
        return;
      }if (null !== b) try {
        return JSON.parse(b);
      } catch (c$2) {
        throw "Storage: Invalid value was encountered";
      }
    };function mi() {}t(mi, Fh);mi.prototype.clear = function () {
      var a = qc(this.fa(!0)),
          b = this;Ea(a, function (a) {
        b.pa(a);
      });
    };function ni(a) {
      this.a = a;
    }t(ni, mi);function oi(a) {
      if (!a.a) return !1;try {
        return a.a.setItem("__sak", "1"), a.a.removeItem("__sak"), !0;
      } catch (b) {
        return !1;
      }
    }k = ni.prototype;k.set = function (a, b) {
      try {
        this.a.setItem(a, b);
      } catch (c) {
        if (0 == this.a.length) throw "Storage mechanism: Storage disabled";throw "Storage mechanism: Quota exceeded";
      }
    };k.get = function (a) {
      a = this.a.getItem(a);if (!m(a) && null !== a) throw "Storage mechanism: Invalid value was encountered";
      return a;
    };k.pa = function (a) {
      this.a.removeItem(a);
    };k.fa = function (a) {
      var b = 0,
          c = this.a,
          d = new nc();d.next = function () {
        if (b >= c.length) throw mc;var d = c.key(b++);if (a) return d;d = c.getItem(d);if (!m(d)) throw "Storage mechanism: Invalid value was encountered";return d;
      };return d;
    };k.clear = function () {
      this.a.clear();
    };k.key = function (a) {
      return this.a.key(a);
    };function pi() {
      var a = null;try {
        a = window.localStorage || null;
      } catch (b) {}this.a = a;
    }t(pi, ni);function qi() {
      var a = null;try {
        a = window.sessionStorage || null;
      } catch (b) {}this.a = a;
    }t(qi, ni);function ri(a, b) {
      this.f = a;this.a = b + "::";
    }t(ri, mi);ri.prototype.set = function (a, b) {
      this.f.set(this.a + a, b);
    };ri.prototype.get = function (a) {
      return this.f.get(this.a + a);
    };ri.prototype.pa = function (a) {
      this.f.pa(this.a + a);
    };ri.prototype.fa = function (a) {
      var b = this.f.fa(!0),
          c = this,
          d = new nc();d.next = function () {
        for (var d = b.next(); d.substr(0, c.a.length) != c.a;) {
          d = b.next();
        }return a ? d.substr(c.a.length) : c.f.get(d);
      };return d;
    };var si,
        ti = new pi();si = oi(ti) ? new ri(ti, "firebaseui") : null;var ui = new li(si),
        vi,
        wi = new qi();
    vi = oi(wi) ? new ri(wi, "firebaseui") : null;var xi = new li(vi),
        yi = { name: "pendingEmailCredential", storage: xi },
        zi = { name: "pendingRedirect", storage: xi },
        Ai = { name: "redirectUrl", storage: xi },
        Bi = { name: "rememberAccount", storage: xi },
        Ci = { name: "rememberedAccounts", storage: ui },
        Di = { name: "emailForSignIn", storage: new li(new Gh(3600, "/")) },
        Ei = { name: "pendingEncryptedCredential", storage: new li(new Gh(3600, "/")) };function Fi(a, b) {
      return a.storage.get(b ? a.name + ":" + b : a.name);
    }function F(a, b) {
      a.storage.a.pa(b ? a.name + ":" + b : a.name);
    }
    function Gi(a, b, c) {
      a.storage.set(c ? a.name + ":" + c : a.name, b);
    }function Hi(a) {
      return Fi(Ai, a) || null;
    }function Ii(a, b) {
      Gi(Ai, a, b);
    }function Ji(a, b) {
      Gi(Bi, a, b);
    }function Ki(a) {
      a = Fi(Ci, a) || [];a = Ha(a, function (a) {
        return Bh(a);
      });return Ga(a, na);
    }function Li(a, b) {
      var c = Ki(b),
          d = Ja(c, function (b) {
        return b.a == a.a && (b.f || null) == (a.f || null);
      });-1 < d && Ma(c, d);c.unshift(a);Gi(Ci, Ha(c, function (a) {
        return a.na();
      }), b);
    }function Mi(a) {
      a = Fi(yi, a) || null;return Ih(a);
    }function Ni(a) {
      F(yi, a);
    }function Oi(a, b) {
      Gi(yi, a.na(), b);
    }function Pi(a) {
      Gi(zi, "pending", a);
    }function Qi(a, b) {
      b = Fi(Di, b);var c = null;if (b) try {
        var d = ei(a, b),
            e = JSON.parse(d);c = e && e.email || null;
      } catch (f) {}return c;
    }function Ri(a, b) {
      b = Fi(Ei, b);var c = null;if (b) try {
        var d = ei(a, b);c = JSON.parse(d);
      } catch (e) {}return Ih(c || null);
    }function Si(a, b, c) {
      Gi(Ei, ci(a, JSON.stringify(b.na())), c);
    }var Ti = null;function Ui(a) {
      return !(!a || -32E3 != a.code || "Service unavailable" != a.message);
    }function Vi(a, b, c, d) {
      Ti || (a = { callbacks: { empty: a, select: function select(a, d) {
            a && a.account && b ? b(Bh(a.account)) : c && c(!Ui(d));
          }, store: a,
          update: a }, language: "de", providers: void 0, ui: d }, "undefined" != typeof accountchooser && accountchooser.Api && accountchooser.Api.init ? Ti = accountchooser.Api.init(a) : (Ti = new Wi(a), Xi()));
    }function Yi(a, b, c) {
      function d() {
        var a = Qc(window.location.href, c).toString();Ti.select(Ha(b || [], function (a) {
          return a.na();
        }), { clientCallbackUrl: a });
      }b && b.length ? d() : Ti.checkEmpty(function (b, c) {
        b || c ? a(!Ui(c)) : d();
      });
    }function Wi(a) {
      this.a = a;this.a.callbacks = this.a.callbacks || {};
    }function Xi() {
      var a = Ti;qa(a.a.callbacks.empty) && a.a.callbacks.empty();
    }
    var Zi = { code: -32E3, message: "Service unavailable", data: "Service is unavailable." };k = Wi.prototype;k.store = function () {
      qa(this.a.callbacks.store) && this.a.callbacks.store(void 0, Zi);
    };k.select = function () {
      qa(this.a.callbacks.select) && this.a.callbacks.select(void 0, Zi);
    };k.update = function () {
      qa(this.a.callbacks.update) && this.a.callbacks.update(void 0, Zi);
    };k.checkDisabled = function (a) {
      a(!0);
    };k.checkEmpty = function (a) {
      a(void 0, Zi);
    };k.checkAccountExist = function (a, b) {
      b(void 0, Zi);
    };k.checkShouldUpdate = function (a, b) {
      b(void 0, Zi);
    };var $i,
        aj,
        bj,
        cj,
        G = {};function H(a, b, c, d) {
      G[a].apply(null, Array.prototype.slice.call(arguments, 1));
    }var dj = /MSIE ([\d.]+).*Windows NT ([\d.]+)/,
        ej = /Firefox\/([\d.]+)/,
        fj = /Opera[ \/]([\d.]+)(.*Version\/([\d.]+))?/,
        gj = /Chrome\/([\d.]+)/,
        hj = /((Windows NT ([\d.]+))|(Mac OS X ([\d_]+))).*Version\/([\d.]+).*Safari/,
        ij = /Mac OS X;.*(?!(Version)).*Safari/,
        jj = /Android ([\d.]+).*Safari/,
        kj = /OS ([\d_]+) like Mac OS X.*Mobile.*Safari/,
        lj = /Konqueror\/([\d.]+)/,
        mj = /MSIE ([\d.]+).*Windows Phone OS ([\d.]+)/;
    function nj(a, b) {
      a = a.split(b || ".");this.a = [];for (b = 0; b < a.length; b++) {
        this.a.push(parseInt(a[b], 10));
      }
    }function oj(a, b) {
      b instanceof nj || (b = new nj(String(b)));for (var c = Math.max(a.a.length, b.a.length), d = 0; d < c; d++) {
        var e = a.a[d],
            f = b.a[d];if (void 0 !== e && void 0 !== f && e !== f) return e - f;if (void 0 === e) return -1;if (void 0 === f) return 1;
      }return 0;
    }function pj(a, b) {
      return 0 <= oj(a, b);
    }function qj() {
      var a = window.navigator && window.navigator.userAgent;if (a) {
        var b;if (b = a.match(fj)) {
          var c = new nj(b[3] || b[1]);return 0 <= a.indexOf("Opera Mini") ? !1 : 0 <= a.indexOf("Opera Mobi") ? 0 <= a.indexOf("Android") && pj(c, "10.1") : pj(c, "8.0");
        }if (b = a.match(ej)) return pj(new nj(b[1]), "2.0");if (b = a.match(gj)) return pj(new nj(b[1]), "6.0");if (b = a.match(hj)) return c = new nj(b[6]), a = b[3] && new nj(b[3]), b = b[5] && new nj(b[5], "_"), (!(!a || !pj(a, "6.0")) || !(!b || !pj(b, "10.5.6"))) && pj(c, "3.0");if (b = a.match(jj)) return pj(new nj(b[1]), "3.0");if (b = a.match(kj)) return pj(new nj(b[1], "_"), "4.0");if (b = a.match(lj)) return pj(new nj(b[1]), "4.7");if (b = a.match(mj)) return c = new nj(b[1]), a = new nj(b[2]), pj(c, "7.0") && pj(a, "7.0");if (b = a.match(dj)) return c = new nj(b[1]), a = new nj(b[2]), pj(c, "7.0") && pj(a, "6.0");if (a.match(ij)) return !1;
      }return !0;
    }function rj(a) {
      if (a.classList) return a.classList;a = a.className;return m(a) && a.match(/\S+/g) || [];
    }function sj(a, b) {
      return a.classList ? a.classList.contains(b) : Ka(rj(a), b);
    }function tj(a, b) {
      a.classList ? a.classList.add(b) : sj(a, b) || (a.className += 0 < a.className.length ? " " + b : b);
    }function uj(a, b) {
      a.classList ? a.classList.remove(b) : sj(a, b) && (a.className = Ga(rj(a), function (a) {
        return a != b;
      }).join(" "));
    }function I(a) {
      var b = a.type;switch (m(b) && b.toLowerCase()) {case "checkbox":case "radio":
          return a.checked ? a.value : null;case "select-one":
          return b = a.selectedIndex, 0 <= b ? a.options[b].value : null;case "select-multiple":
          b = [];for (var c, d = 0; c = a.options[d]; d++) {
            c.selected && b.push(c.value);
          }return b.length ? b : null;default:
          return null != a.value ? a.value : null;}
    }function vj(a, b) {
      var c = a.type;switch (m(c) && c.toLowerCase()) {case "checkbox":case "radio":
          a.checked = b;break;case "select-one":
          a.selectedIndex = -1;if (m(b)) for (var d = 0; c = a.options[d]; d++) {
            if (c.value == b) {
              c.selected = !0;break;
            }
          }break;case "select-multiple":
          m(b) && (b = [b]);for (d = 0; c = a.options[d]; d++) {
            if (c.selected = !1, b) for (var e, f = 0; e = b[f]; f++) {
              c.value == e && (c.selected = !0);
            }
          }break;default:
          a.value = null != b ? b : "";}
    }function wj(a) {
      if (a.altKey && !a.ctrlKey || a.metaKey || 112 <= a.keyCode && 123 >= a.keyCode) return !1;switch (a.keyCode) {case 18:case 20:case 93:case 17:case 40:case 35:case 27:case 36:case 45:case 37:case 224:case 91:case 144:case 12:case 34:case 33:case 19:case 255:case 44:case 39:case 145:case 16:case 38:case 252:case 224:case 92:
          return !1;
        case 0:
          return !qb;default:
          return 166 > a.keyCode || 183 < a.keyCode;}
    }function xj(a, b, c, d, e, f) {
      if (rb && !zb("525")) return !0;if (tb && e) return yj(a);if (e && !d) return !1;if (!qb) {
        "number" == typeof b && (b = zj(b));var g = 17 == b || 18 == b || tb && 91 == b;if ((!c || tb) && g || tb && 16 == b && (d || f)) return !1;
      }if ((rb || ob) && d && c) switch (a) {case 220:case 219:case 221:case 192:case 186:case 189:case 187:case 188:case 190:case 191:case 192:case 222:
          return !1;}if (v && d && b == a) return !1;switch (a) {case 13:
          return qb ? f || e ? !1 : !(c && d) : !0;case 27:
          return !(rb || ob || qb);}return qb && (d || e || f) ? !1 : yj(a);
    }function yj(a) {
      if (48 <= a && 57 >= a || 96 <= a && 106 >= a || 65 <= a && 90 >= a || (rb || ob) && 0 == a) return !0;switch (a) {case 32:case 43:case 63:case 64:case 107:case 109:case 110:case 111:case 186:case 59:case 189:case 187:case 61:case 188:case 190:case 191:case 192:case 222:case 219:case 220:case 221:
          return !0;default:
          return !1;}
    }function zj(a) {
      if (qb) a = Aj(a);else if (tb && rb) switch (a) {case 93:
          a = 91;}return a;
    }function Aj(a) {
      switch (a) {case 61:
          return 187;case 59:
          return 186;case 173:
          return 189;case 224:
          return 91;
        case 0:
          return 224;default:
          return a;}
    }function Bj(a) {
      E.call(this);this.a = a;Lf(a, "keydown", this.f, !1, this);Lf(a, "click", this.h, !1, this);
    }t(Bj, E);Bj.prototype.f = function (a) {
      (13 == a.keyCode || rb && 3 == a.keyCode) && Cj(this, a);
    };Bj.prototype.h = function (a) {
      Cj(this, a);
    };function Cj(a, b) {
      var c = new Dj(b);if (Xg(a, c)) {
        c = new Ej(b);try {
          Xg(a, c);
        } finally {
          b.stopPropagation();
        }
      }
    }Bj.prototype.l = function () {
      Bj.o.l.call(this);Tf(this.a, "keydown", this.f, !1, this);Tf(this.a, "click", this.h, !1, this);delete this.a;
    };function Ej(a) {
      zf.call(this, a.a);this.type = "action";
    }t(Ej, zf);function Dj(a) {
      zf.call(this, a.a);this.type = "beforeaction";
    }t(Dj, zf);function Fj(a) {
      E.call(this);this.a = a;a = v ? "focusout" : "blur";this.f = Lf(this.a, v ? "focusin" : "focus", this, !v);this.h = Lf(this.a, a, this, !v);
    }t(Fj, E);Fj.prototype.handleEvent = function (a) {
      var b = new zf(a.a);b.type = "focusin" == a.type || "focus" == a.type ? "focusin" : "focusout";Xg(this, b);
    };Fj.prototype.l = function () {
      Fj.o.l.call(this);Uf(this.f);Uf(this.h);delete this.a;
    };function Gj(a, b) {
      E.call(this);this.f = a || 1;this.a = b || l;this.h = p(this.Rb, this);this.j = xa();
    }t(Gj, E);k = Gj.prototype;k.Ea = !1;k.X = null;k.Rb = function () {
      if (this.Ea) {
        var a = xa() - this.j;0 < a && a < .8 * this.f ? this.X = this.a.setTimeout(this.h, this.f - a) : (this.X && (this.a.clearTimeout(this.X), this.X = null), Xg(this, "tick"), this.Ea && (Hj(this), this.start()));
      }
    };k.start = function () {
      this.Ea = !0;this.X || (this.X = this.a.setTimeout(this.h, this.f), this.j = xa());
    };function Hj(a) {
      a.Ea = !1;a.X && (a.a.clearTimeout(a.X), a.X = null);
    }k.l = function () {
      Gj.o.l.call(this);Hj(this);delete this.a;
    };function Ij(a, b) {
      if (qa(a)) b && (a = p(a, b));else if (a && "function" == typeof a.handleEvent) a = p(a.handleEvent, a);else throw Error("Invalid listener argument");return 2147483647 < Number(0) ? -1 : l.setTimeout(a, 0);
    }function Jj(a) {
      tf.call(this);this.f = a;this.a = {};
    }t(Jj, tf);var Kj = [];function Lj(a, b, c, d) {
      oa(c) || (c && (Kj[0] = c.toString()), c = Kj);for (var e = 0; e < c.length; e++) {
        var f = Lf(b, c[e], d || a.handleEvent, !1, a.f || a);if (!f) break;a.a[f.key] = f;
      }
    }function Mj(a) {
      fb(a.a, function (a, c) {
        this.a.hasOwnProperty(c) && Uf(a);
      }, a);a.a = {};
    }Jj.prototype.l = function () {
      Jj.o.l.call(this);Mj(this);
    };Jj.prototype.handleEvent = function () {
      throw Error("EventHandler.handleEvent not implemented");
    };function Nj(a) {
      E.call(this);this.a = null;this.f = a;a = v || ob || rb && !zb("531") && "TEXTAREA" == a.tagName;this.h = new Jj(this);Lj(this.h, this.f, a ? ["keydown", "paste", "cut", "drop", "input"] : "input", this);
    }t(Nj, E);Nj.prototype.handleEvent = function (a) {
      if ("input" == a.type) v && zb(10) && 0 == a.keyCode && 0 == a.j || (Oj(this), Xg(this, Pj(a)));else if ("keydown" != a.type || wj(a)) {
        var b = "keydown" == a.type ? this.f.value : null;v && 229 == a.keyCode && (b = null);var c = Pj(a);Oj(this);this.a = Ij(function () {
          this.a = null;this.f.value != b && Xg(this, c);
        }, this);
      }
    };function Oj(a) {
      null != a.a && (l.clearTimeout(a.a), a.a = null);
    }function Pj(a) {
      a = new zf(a.a);a.type = "input";return a;
    }Nj.prototype.l = function () {
      Nj.o.l.call(this);this.h.m();Oj(this);delete this.f;
    };function Qj(a, b) {
      E.call(this);a && (this.Ia && Rj(this), this.oa = a, this.Ha = Lf(this.oa, "keypress", this, b), this.Ta = Lf(this.oa, "keydown", this.xb, b, this), this.Ia = Lf(this.oa, "keyup", this.Ab, b, this));
    }t(Qj, E);k = Qj.prototype;k.oa = null;k.Ha = null;k.Ta = null;k.Ia = null;k.S = -1;k.da = -1;k.Pa = !1;var Sj = { 3: 13, 12: 144, 63232: 38, 63233: 40, 63234: 37, 63235: 39, 63236: 112, 63237: 113, 63238: 114, 63239: 115, 63240: 116, 63241: 117, 63242: 118, 63243: 119, 63244: 120, 63245: 121, 63246: 122, 63247: 123, 63248: 44, 63272: 46, 63273: 36, 63275: 35, 63276: 33, 63277: 34, 63289: 144, 63302: 45 },
        Tj = { Up: 38, Down: 40, Left: 37, Right: 39, Enter: 13, F1: 112, F2: 113, F3: 114, F4: 115, F5: 116, F6: 117, F7: 118, F8: 119, F9: 120, F10: 121, F11: 122, F12: 123, "U+007F": 46, Home: 36, End: 35,
      PageUp: 33, PageDown: 34, Insert: 45 },
        Uj = !rb || zb("525"),
        Vj = tb && qb;k = Qj.prototype;k.xb = function (a) {
      if (rb || ob) if (17 == this.S && !a.ctrlKey || 18 == this.S && !a.altKey || tb && 91 == this.S && !a.metaKey) this.da = this.S = -1;-1 == this.S && (a.ctrlKey && 17 != a.keyCode ? this.S = 17 : a.altKey && 18 != a.keyCode ? this.S = 18 : a.metaKey && 91 != a.keyCode && (this.S = 91));Uj && !xj(a.keyCode, this.S, a.shiftKey, a.ctrlKey, a.altKey, a.metaKey) ? this.handleEvent(a) : (this.da = zj(a.keyCode), Vj && (this.Pa = a.altKey));
    };k.Ab = function (a) {
      this.da = this.S = -1;this.Pa = a.altKey;
    };
    k.handleEvent = function (a) {
      var b = a.a,
          c = b.altKey;if (v && "keypress" == a.type) {
        var d = this.da;var e = 13 != d && 27 != d ? b.keyCode : 0;
      } else (rb || ob) && "keypress" == a.type ? (d = this.da, e = 0 <= b.charCode && 63232 > b.charCode && yj(d) ? b.charCode : 0) : nb && !rb ? (d = this.da, e = yj(d) ? b.keyCode : 0) : (d = b.keyCode || this.da, e = b.charCode || 0, Vj && "keypress" == a.type && (c = this.Pa), tb && 63 == e && 224 == d && (d = 191));var f = d = zj(d);d ? 63232 <= d && d in Sj ? f = Sj[d] : 25 == d && a.shiftKey && (f = 9) : b.keyIdentifier && b.keyIdentifier in Tj && (f = Tj[b.keyIdentifier]);qb && Uj && "keypress" == a.type && !xj(f, this.S, a.shiftKey, a.ctrlKey, c, a.metaKey) || (a = f == this.S, this.S = f, b = new Wj(f, e, a, b), b.altKey = c, Xg(this, b));
    };k.N = function () {
      return this.oa;
    };function Rj(a) {
      a.Ha && (Uf(a.Ha), Uf(a.Ta), Uf(a.Ia), a.Ha = null, a.Ta = null, a.Ia = null);a.oa = null;a.S = -1;a.da = -1;
    }k.l = function () {
      Qj.o.l.call(this);Rj(this);
    };function Wj(a, b, c, d) {
      zf.call(this, d);this.type = "key";this.keyCode = a;this.j = b;this.repeat = c;
    }t(Wj, zf);function Xj(a, b, c, d) {
      this.top = a;this.right = b;this.bottom = c;this.left = d;
    }Xj.prototype.toString = function () {
      return "(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)";
    };Xj.prototype.ceil = function () {
      this.top = Math.ceil(this.top);this.right = Math.ceil(this.right);this.bottom = Math.ceil(this.bottom);this.left = Math.ceil(this.left);return this;
    };Xj.prototype.floor = function () {
      this.top = Math.floor(this.top);this.right = Math.floor(this.right);this.bottom = Math.floor(this.bottom);this.left = Math.floor(this.left);return this;
    };Xj.prototype.round = function () {
      this.top = Math.round(this.top);this.right = Math.round(this.right);
      this.bottom = Math.round(this.bottom);this.left = Math.round(this.left);return this;
    };function Yj(a, b) {
      var c = bc(a);return c.defaultView && c.defaultView.getComputedStyle && (a = c.defaultView.getComputedStyle(a, null)) ? a[b] || a.getPropertyValue(b) || "" : "";
    }function Zj(a) {
      try {
        var b = a.getBoundingClientRect();
      } catch (c) {
        return { left: 0, top: 0, right: 0, bottom: 0 };
      }v && a.ownerDocument.body && (a = a.ownerDocument, b.left -= a.documentElement.clientLeft + a.body.clientLeft, b.top -= a.documentElement.clientTop + a.body.clientTop);return b;
    }
    function ak(a, b) {
      b = b || hc(document);var c = b || hc(document);var d = bk(a),
          e = bk(c);if (!v || 9 <= Number(Ab)) {
        g = Yj(c, "borderLeftWidth");var f = Yj(c, "borderRightWidth");h = Yj(c, "borderTopWidth");r = Yj(c, "borderBottomWidth");f = new Xj(parseFloat(h), parseFloat(f), parseFloat(r), parseFloat(g));
      } else {
        var g = ck(c, "borderLeft");f = ck(c, "borderRight");var h = ck(c, "borderTop"),
            r = ck(c, "borderBottom");f = new Xj(h, f, r, g);
      }c == hc(document) ? (g = d.a - c.scrollLeft, d = d.f - c.scrollTop, !v || 10 <= Number(Ab) || (g += f.left, d += f.top)) : (g = d.a - e.a - f.left, d = d.f - e.f - f.top);e = a.offsetWidth;f = a.offsetHeight;h = rb && !e && !f;fa(e) && !h || !a.getBoundingClientRect ? a = new Zb(e, f) : (a = Zj(a), a = new Zb(a.right - a.left, a.bottom - a.top));e = c.clientHeight - a.height;f = c.scrollLeft;h = c.scrollTop;f += Math.min(g, Math.max(g - (c.clientWidth - a.width), 0));h += Math.min(d, Math.max(d - e, 0));c = new Yb(f, h);b.scrollLeft = c.a;b.scrollTop = c.f;
    }function bk(a) {
      var b = bc(a),
          c = new Yb(0, 0);var d = b ? bc(b) : document;d = !v || 9 <= Number(Ab) || "CSS1Compat" == $b(d).a.compatMode ? d.documentElement : d.body;if (a == d) return c;
      a = Zj(a);d = $b(b).a;b = hc(d);d = d.parentWindow || d.defaultView;b = v && zb("10") && d.pageYOffset != b.scrollTop ? new Yb(b.scrollLeft, b.scrollTop) : new Yb(d.pageXOffset || b.scrollLeft, d.pageYOffset || b.scrollTop);c.a = a.left + b.a;c.f = a.top + b.f;return c;
    }var dk = { thin: 2, medium: 4, thick: 6 };function ck(a, b) {
      if ("none" == (a.currentStyle ? a.currentStyle[b + "Style"] : null)) return 0;var c = a.currentStyle ? a.currentStyle[b + "Width"] : null;if (c in dk) a = dk[c];else if (/^\d+px?$/.test(c)) a = parseInt(c, 10);else {
        b = a.style.left;var d = a.runtimeStyle.left;
        a.runtimeStyle.left = a.currentStyle.left;a.style.left = c;c = a.style.pixelLeft;a.style.left = b;a.runtimeStyle.left = d;a = +c;
      }return a;
    }function ek() {}ka(ek);ek.prototype.a = 0;function fk(a) {
      E.call(this);this.w = a || $b();this.Ya = null;this.la = !1;this.j = null;this.I = void 0;this.xa = this.za = this.Y = null;
    }t(fk, E);k = fk.prototype;k.Cb = ek.Sa();k.N = function () {
      return this.j;
    };function J(a, b) {
      return a.j ? ec(b, a.j || a.w.a) : null;
    }function gk(a) {
      a.I || (a.I = new Jj(a));return a.I;
    }k.Ua = function (a) {
      if (this.Y && this.Y != a) throw Error("Method not supported");
      fk.o.Ua.call(this, a);
    };k.eb = function () {
      this.j = this.w.a.createElement("DIV");
    };k.render = function (a) {
      if (this.la) throw Error("Component already rendered");this.j || this.eb();a ? a.insertBefore(this.j, null) : this.w.a.body.appendChild(this.j);this.Y && !this.Y.la || this.u();
    };k.u = function () {
      this.la = !0;hk(this, function (a) {
        !a.la && a.N() && a.u();
      });
    };k.ua = function () {
      hk(this, function (a) {
        a.la && a.ua();
      });this.I && Mj(this.I);this.la = !1;
    };k.l = function () {
      this.la && this.ua();this.I && (this.I.m(), delete this.I);hk(this, function (a) {
        a.m();
      });
      this.j && ic(this.j);this.Y = this.j = this.xa = this.za = null;fk.o.l.call(this);
    };function hk(a, b) {
      a.za && Ea(a.za, b, void 0);
    }k.removeChild = function (a, b) {
      if (a) {
        var c = m(a) ? a : a.Ya || (a.Ya = ":" + (a.Cb.a++).toString(36));this.xa && c ? (a = this.xa, a = (null !== a && c in a ? a[c] : void 0) || null) : a = null;if (c && a) {
          var d = this.xa;c in d && delete d[c];La(this.za, a);b && (a.ua(), a.j && ic(a.j));b = a;if (null == b) throw Error("Unable to set parent component");b.Y = null;fk.o.Ua.call(b, null);
        }
      }if (!a) throw Error("Child is not in parent component");return a;
    };
    function K(a, b) {
      var c = kc(a, "firebaseui-textfield");b ? (uj(a, "firebaseui-input-invalid"), tj(a, "firebaseui-input"), c && uj(c, "firebaseui-textfield-invalid")) : (uj(a, "firebaseui-input"), tj(a, "firebaseui-input-invalid"), c && tj(c, "firebaseui-textfield-invalid"));
    }function ik(a, b, c) {
      b = new Nj(b);wf(a, wa(xf, b));Lj(gk(a), b, "input", c);
    }function jk(a, b, c) {
      b = new Qj(b);wf(a, wa(xf, b));Lj(gk(a), b, "key", function (a) {
        13 == a.keyCode && (a.stopPropagation(), a.preventDefault(), c(a));
      });
    }function kk(a, b, c) {
      b = new Fj(b);wf(a, wa(xf, b));Lj(gk(a), b, "focusin", c);
    }function lk(a, b, c) {
      b = new Fj(b);wf(a, wa(xf, b));Lj(gk(a), b, "focusout", c);
    }function L(a, b, c) {
      b = new Bj(b);wf(a, wa(xf, b));Lj(gk(a), b, "action", function (a) {
        a.stopPropagation();a.preventDefault();c(a);
      });
    }function mk(a) {
      tj(a, "firebaseui-hidden");
    }function M(a, b) {
      b && jc(a, b);uj(a, "firebaseui-hidden");
    }function nk(a) {
      return !sj(a, "firebaseui-hidden") && "none" != a.style.display;
    }function ok(a) {
      a = a || {};var b = a.email,
          c = a.disabled,
          d = '<div class="firebaseui-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label firebaseui-label" for="email">';
      d = a.gc ? d + "Neue E-Mail-Adresse eingeben" : d + "E-Mail-Adresse";d += '</label><input type="email" name="email" autocomplete="username" class="mdl-textfield__input firebaseui-input firebaseui-id-email" value="' + ld(null != b ? b : "") + '"' + (c ? "disabled" : "") + '></div><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-id-email-error"></p></div>';return x(d);
    }function pk(a) {
      a = a || {};a = a.label;var b = '<button type="submit" class="firebaseui-id-submit firebaseui-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored">';
      b = a ? b + w(a) : b + "Weiter";return x(b + "</button>");
    }function qk() {
      var a = "" + pk({ label: z("Anmelden") });return x(a);
    }function rk() {
      var a = "" + pk({ label: z("Speichern") });return x(a);
    }function sk() {
      var a = "" + pk({ label: z("Weiter") });return x(a);
    }function tk(a) {
      a = a || {};a = a.label;var b = '<div class="firebaseui-new-password-component"><div class="firebaseui-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label firebaseui-label" for="newPassword">';b = a ? b + w(a) : b + "Passwort ausw\u00e4hlen";
      return x(b + '</label><input type="password" name="newPassword" autocomplete="new-password" class="mdl-textfield__input firebaseui-input firebaseui-id-new-password"></div><a href="javascript:void(0)" class="firebaseui-input-floating-button firebaseui-id-password-toggle firebaseui-input-toggle-on firebaseui-input-toggle-blur"></a><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-id-new-password-error"></p></div></div>');
    }function uk() {
      var a = {};var b = '<div class="firebaseui-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label firebaseui-label" for="password">';b = a.current ? b + "Aktuelles Passwort" : b + "Passwort";return x(b + '</label><input type="password" name="password" autocomplete="current-password" class="mdl-textfield__input firebaseui-input firebaseui-id-password"></div><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-id-password-error"></p></div>');
    }
    function vk() {
      return x('<a class="firebaseui-link firebaseui-id-secondary-link" href="javascript:void(0)">Probleme bei der Anmeldung?</a>');
    }function wk(a) {
      a = a || {};a = a.label;var b = '<button class="firebaseui-id-secondary-link firebaseui-button mdl-button mdl-js-button mdl-button--primary">';b = a ? b + w(a) : b + "Abbrechen";return x(b + "</button>");
    }function xk(a) {
      var b = "";a.H && a.G && (b += '<ul class="firebaseui-tos-list firebaseui-tos"><li class="firebaseui-inline-list-item"><a href="javascript:void(0)" class="firebaseui-link firebaseui-tos-link" target="_blank">Nutzungsbedingungen</a></li><li class="firebaseui-inline-list-item"><a href="javascript:void(0)" class="firebaseui-link firebaseui-pp-link" target="_blank">Datenschutzerkl\u00e4rung</a></li></ul>');
      return x(b);
    }function yk(a) {
      var b = "";a.H && a.G && (b += '<p class="firebaseui-tos firebaseui-tospp-full-message">Indem Sie fortfahren, stimmen Sie <a href="javascript:void(0)" class="firebaseui-link firebaseui-tos-link" target="_blank">unseren Nutzungsbedingungen</a> und <a href="javascript:void(0)" class="firebaseui-link firebaseui-pp-link" target="_blank">unserer Datenschutzerkl\u00e4rung</a> zu.</p>');return x(b);
    }function zk(a) {
      a = '<div class="firebaseui-info-bar firebaseui-id-info-bar"><p class="firebaseui-info-bar-message">' + w(a.message) + '&nbsp;&nbsp;<a href="javascript:void(0)" class="firebaseui-link firebaseui-id-dismiss-info-bar">Schlie\u00dfen</a></p></div>';return x(a);
    }zk.B = "firebaseui.auth.soy2.element.infoBar";function Ak(a) {
      var b = a.content;a = a.qb;return x('<dialog class="mdl-dialog firebaseui-dialog firebaseui-id-dialog' + (a ? " " + ld(a) : "") + '">' + w(b) + "</dialog>");
    }function Bk(a) {
      var b = a.message;return x(Ak({ content: kd('<div class="firebaseui-dialog-icon-wrapper"><div class="' + ld(a.Ga) + ' firebaseui-dialog-icon"></div></div><div class="firebaseui-progress-dialog-message">' + w(b) + "</div>") }));
    }Bk.B = "firebaseui.auth.soy2.element.progressDialog";function Ck(a) {
      var b = '<div class="firebaseui-list-box-actions">';a = a.items;for (var c = a.length, d = 0; d < c; d++) {
        var e = a[d];b += '<button type="button" data-listboxid="' + ld(e.id) + '" class="mdl-button firebaseui-id-list-box-dialog-button firebaseui-list-box-dialog-button">' + (e.Ga ? '<div class="firebaseui-list-box-icon-wrapper"><div class="firebaseui-list-box-icon ' + ld(e.Ga) + '"></div></div>' : "") + '<div class="firebaseui-list-box-label-wrapper">' + w(e.label) + "</div></button>";
      }b = "" + Ak({ qb: z("firebaseui-list-box-dialog"), content: kd(b + "</div>") });return x(b);
    }Ck.B = "firebaseui.auth.soy2.element.listBoxDialog";function Dk(a) {
      a = a || {};return x(a.Tb ? '<div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active firebaseui-busy-indicator firebaseui-id-busy-indicator"></div>' : '<div class="mdl-progress mdl-js-progress mdl-progress__indeterminate firebaseui-busy-indicator firebaseui-id-busy-indicator"></div>');
    }Dk.B = "firebaseui.auth.soy2.element.busyIndicator";
    function Ek(a) {
      a = a || {};a = a.ma;var b = "";if (a.hb) b += a.hb;else switch (a.providerId) {case "google.com":
          b += "Google";break;case "github.com":
          b += "GitHub";break;case "facebook.com":
          b += "Facebook";break;case "twitter.com":
          b += "Twitter";break;case "anonymous":
          b += "Gast";break;default:
          b += "Passwort";}return y(b);
    }function Fk(a) {
      Gk(a, "upgradeElement");
    }function Hk(a) {
      Gk(a, "downgradeElements");
    }var Ik = ["mdl-js-textfield", "mdl-js-progress", "mdl-js-spinner", "mdl-js-button"];function Gk(a, b) {
      a && window.componentHandler && window.componentHandler[b] && Ea(Ik, function (c) {
        if (sj(a, c)) window.componentHandler[b](a);Ea(cc(c, a), function (a) {
          window.componentHandler[b](a);
        });
      });
    }function Jk(a, b, c) {
      Kk.call(this);document.body.appendChild(a);a.showModal || window.dialogPolyfill.registerDialog(a);a.showModal();Fk(a);b && L(this, a, function (b) {
        var c = a.getBoundingClientRect();(b.clientX < c.left || c.left + c.width < b.clientX || b.clientY < c.top || c.top + c.height < b.clientY) && Kk.call(this);
      });if (!c) {
        var d = this.N().parentElement || this.N().parentNode;if (d) {
          var e = this;this.aa = function () {
            if (a.open) {
              var b = a.getBoundingClientRect().height,
                  c = d.getBoundingClientRect().height,
                  h = d.getBoundingClientRect().top - document.body.getBoundingClientRect().top,
                  r = d.getBoundingClientRect().left - document.body.getBoundingClientRect().left,
                  n = a.getBoundingClientRect().width,
                  la = d.getBoundingClientRect().width;a.style.top = (h + (c - b) / 2).toString() + "px";b = r + (la - n) / 2;a.style.left = b.toString() + "px";a.style.right = (document.body.getBoundingClientRect().width - b - n).toString() + "px";
            } else window.removeEventListener("resize", e.aa);
          };this.aa();window.addEventListener("resize", this.aa, !1);
        }
      }
    }function Kk() {
      var a = Lk.call(this);a && (Hk(a), a.open && a.close(), ic(a), this.aa && window.removeEventListener("resize", this.aa));
    }function Lk() {
      return ec("firebaseui-id-dialog");
    }function Mk() {
      ic(Nk.call(this));
    }function Nk() {
      return J(this, "firebaseui-id-info-bar");
    }function Ok() {
      return J(this, "firebaseui-id-dismiss-info-bar");
    }var Pk = { yb: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg", wb: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/github.svg",
      tb: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg", Sb: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/twitter.svg", Eb: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/mail.svg", Gb: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/phone.svg", nb: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/anonymous.png" };function Qk(a, b, c) {
      yf.call(this, a, b);for (var d in c) {
        this[d] = c[d];
      }
    }t(Qk, yf);function N(a, b, c, d, e) {
      fk.call(this, c);this.$a = a;this.Za = b;this.Aa = !1;this.Ma = d || null;this.v = this.ea = null;this.Z = gb(Pk);ib(this.Z, e || {});
    }t(N, fk);k = N.prototype;k.eb = function () {
      var a = ad(this.$a, this.Za, this.Z, this.w);Fk(a);this.j = a;
    };k.u = function () {
      N.o.u.call(this);ah(O(this), new Qk("pageEnter", O(this), { pageId: this.Ma }));if (this.Xa() && this.Z.H) {
        var a = this.Z.H;L(this, this.Xa(), function () {
          a();
        });
      }if (this.Wa() && this.Z.G) {
        var b = this.Z.G;L(this, this.Wa(), function () {
          b();
        });
      }
    };k.ua = function () {
      ah(O(this), new Qk("pageExit", O(this), { pageId: this.Ma }));N.o.ua.call(this);
    };k.l = function () {
      window.clearTimeout(this.ea);
      this.Za = this.$a = this.ea = null;this.Aa = !1;this.v = null;Hk(this.N());N.o.l.call(this);
    };function Rk(a) {
      a.Aa = !0;var b = sj(a.N(), "firebaseui-use-spinner");a.ea = window.setTimeout(function () {
        a.N() && null === a.v && (a.v = ad(Dk, { Tb: b }, null, a.w), a.N().appendChild(a.v), Fk(a.v));
      }, 500);
    }k.M = function (a, b, c, d) {
      function e() {
        if (f.O) return null;f.Aa = !1;window.clearTimeout(f.ea);f.ea = null;f.v && (Hk(f.v), ic(f.v), f.v = null);
      }var f = this;if (f.Aa) return null;Rk(f);return a.apply(null, b).then(c, d).then(e, e);
    };function O(a) {
      return a.N().parentElement || a.N().parentNode;
    }function Sk(a, b, c) {
      jk(a, b, function () {
        c.focus();
      });
    }function Tk(a, b, c) {
      jk(a, b, function () {
        c();
      });
    }q(N.prototype, { f: function f(a) {
        Mk.call(this);var b = ad(zk, { message: a }, null, this.w);this.N().appendChild(b);L(this, Ok.call(this), function () {
          ic(b);
        });
      }, ic: Mk, lc: Nk, kc: Ok, W: function W(a, b) {
        a = ad(Bk, { Ga: a, message: b }, null, this.w);Jk.call(this, a);
      }, h: Kk, pb: Lk, nc: function nc() {
        return J(this, "firebaseui-tos");
      }, Xa: function Xa() {
        return J(this, "firebaseui-tos-link");
      }, Wa: function Wa() {
        return J(this, "firebaseui-pp-link");
      },
      oc: function oc() {
        return J(this, "firebaseui-tos-list");
      } });function Uk(a, b, c) {
      a = a || {};b = a.Qa;var d = a.ga;a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-sign-in"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Mit E-Mail-Adresse anmelden</h1></div><div class="firebaseui-card-content"><div class="firebaseui-relative-wrapper">' + ok(a) + '</div></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + (b ? wk(null) : "") + pk(null) + '</div></div><div class="firebaseui-card-footer">' + (d ? yk(c) : xk(c)) + "</div></form></div>";return x(a);
    }Uk.B = "firebaseui.auth.soy2.page.signIn";function Vk(a, b, c) {
      a = a || {};b = a.ga;a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-sign-in"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Anmelden</h1></div><div class="firebaseui-card-content">' + ok(a) + uk() + '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-links">' + vk() + '</div><div class="firebaseui-form-actions">' + qk() + '</div></div><div class="firebaseui-card-footer">' + (b ? yk(c) : xk(c)) + "</div></form></div>";return x(a);
    }Vk.B = "firebaseui.auth.soy2.page.passwordSignIn";function Wk(a, b, c) {
      a = a || {};var d = a.Ib;b = a.Oa;var e = a.ga,
          f = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-sign-up"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Konto erstellen</h1></div><div class="firebaseui-card-content">' + ok(a);d ? (a = a || {}, a = a.name, a = '<div class="firebaseui-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label firebaseui-label" for="name">Vor- und Nachname</label><input type="text" name="name" autocomplete="name" class="mdl-textfield__input firebaseui-input firebaseui-id-name" value="' + ld(null != a ? a : "") + '"></div><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-id-name-error"></p></div>', a = x(a)) : a = "";c = f + a + tk(null) + '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + (b ? wk(null) : "") + rk() + '</div></div><div class="firebaseui-card-footer">' + (e ? yk(c) : xk(c)) + "</div></form></div>";return x(c);
    }Wk.B = "firebaseui.auth.soy2.page.passwordSignUp";function Xk(a, b, c) {
      a = a || {};b = a.Oa;a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-recovery"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Passwort zur\u00fccksetzen</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">In der an diese E-Mail-Adresse gesendeten Anleitung wird beschrieben, wie Sie Ihr Passwort zur\u00fccksetzen k\u00f6nnen</p>' + ok(a) + '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + (b ? wk(null) : "") + pk({ label: z("Senden") }) + '</div></div><div class="firebaseui-card-footer">' + xk(c) + "</div></form></div>";return x(a);
    }Xk.B = "firebaseui.auth.soy2.page.passwordRecovery";function Yk(a, b, c) {
      b = a.T;var d = "";a = "Folgen Sie der an <strong>" + (w(a.email) + "</strong> gesendeten Anleitung, um Ihr Passwort zur\u00fcckzusetzen");d += '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-recovery-email-sent"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Im Posteingang nachsehen</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">' + a + '</p></div><div class="firebaseui-card-actions">';b && (d += '<div class="firebaseui-form-actions">' + pk({ label: z("Fertig") }) + "</div>");d += '</div><div class="firebaseui-card-footer">' + xk(c) + "</div></div>";return x(d);
    }Yk.B = "firebaseui.auth.soy2.page.passwordRecoveryEmailSent";function Zk(a, b, c) {
      return x('<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-callback"><div class="firebaseui-callback-indicator-container">' + Dk(null, null, c) + "</div></div>");
    }Zk.B = "firebaseui.auth.soy2.page.callback";
    function $k() {
      return x('<div class="firebaseui-container firebaseui-id-page-blank firebaseui-use-spinner"></div>');
    }$k.B = "firebaseui.auth.soy2.page.blank";function al(a, b, c) {
      b = "";a = "Wir haben eine Anmelde-E-Mail an <strong>" + (w(a.email) + "</strong> gesendet. \u00d6ffnen Sie die E-Mail, um die Anmeldung abzuschlie\u00dfen.");var d = x('<a class="firebaseui-link firebaseui-id-trouble-getting-email-link" href="javascript:void(0)">Probleme beim Empfangen von E-Mails?</a>');b += '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-link-sign-in-sent"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Anmelde-E-Mail gesendet</h1></div><div class="firebaseui-card-content"><div class="firebaseui-email-sent"></div><p class="firebaseui-text">' + a + '</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-links">' + d + '</div><div class="firebaseui-form-actions">' + wk({ label: z("Zur\u00fcck") }) + '</div></div><div class="firebaseui-card-footer">' + xk(c) + "</div></form></div>";return x(b);
    }al.B = "firebaseui.auth.soy2.page.emailLinkSignInSent";function cl(a, b, c) {
      a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-not-received"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Probleme beim Empfangen von E-Mails?</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Versuchen Sie Folgendes, um das Problem zu beheben:<ul><li>\u00dcberpr\u00fcfen Sie, ob die E-Mail als Spam markiert oder herausgefiltert wurde.</li><li>\u00dcberpr\u00fcfen Sie Ihre Internetverbindung.</li><li>\u00dcberpr\u00fcfen Sie die Schreibweise Ihrer E-Mail-Adresse.</li><li>\u00dcberpr\u00fcfen Sie den Speicherplatz und weitere Einstellungen Ihres Posteingangs, die Probleme bereiten k\u00f6nnten.</li></ul></p><p class="firebaseui-text">Sollte das Problem auch nach Ausf\u00fchrung der obigen Schritte weiterhin bestehen, k\u00f6nnen Sie sich die Anmelde-E-Mail noch einmal zusenden lassen. Hinweis: Der Link in der vorhergehenden E-Mail ist dann nicht mehr g\u00fcltig.</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-links">' + x('<a class="firebaseui-link firebaseui-id-resend-email-link" href="javascript:void(0)">Erneut senden</a>') + '</div><div class="firebaseui-form-actions">' + wk({ label: z("Zur\u00fcck") }) + '</div></div><div class="firebaseui-card-footer">' + xk(c) + "</div></form></div>";return x(a);
    }cl.B = "firebaseui.auth.soy2.page.emailNotReceived";function dl(a, b, c) {
      a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-link-sign-in-confirmation"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">E-Mail-Adresse best\u00e4tigen</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Best\u00e4tigen Sie Ihre E-Mail-Adresse, um die Anmeldung abzuschlie\u00dfen</p><div class="firebaseui-relative-wrapper">' + ok(a) + '</div></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + wk(null) + pk(null) + '</div></div><div class="firebaseui-card-footer">' + xk(c) + "</div></form></div>";return x(a);
    }dl.B = "firebaseui.auth.soy2.page.emailLinkSignInConfirmation";function el() {
      var a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-different-device-error"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Neues Ger\u00e4t oder neuer Browser erkannt</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">\u00d6ffnen Sie den Link mit demselben Ger\u00e4t oder Browser, mit dem Sie die Anmeldung begonnen haben.</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + wk({ label: z("Schlie\u00dfen") }) + "</div></div></div>";return x(a);
    }el.B = "firebaseui.auth.soy2.page.differentDeviceError";function fl() {
      var a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-anonymous-user-mismatch"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Sitzung beendet</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Die mit dieser Anmeldeanfrage verkn\u00fcpfte Sitzung ist entweder abgelaufen oder wurde gel\u00f6scht.</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + wk({ label: z("Schlie\u00dfen") }) + "</div></div></div>";return x(a);
    }fl.B = "firebaseui.auth.soy2.page.anonymousUserMismatch";function gl(a, b, c) {
      b = "";a = "Sie haben <strong>" + (w(a.email) + "</strong> bereits zur Anmeldung verwendet. Geben Sie Ihr Passwort f\u00fcr dieses Konto ein.");b += '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-linking"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Anmelden</h1></div><div class="firebaseui-card-content"><h2 class="firebaseui-subtitle">Sie haben bereits ein Konto</h2><p class="firebaseui-text">' + a + "</p>" + uk() + '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-links">' + vk() + '</div><div class="firebaseui-form-actions">' + qk() + '</div></div><div class="firebaseui-card-footer">' + xk(c) + "</div></form></div>";return x(b);
    }gl.B = "firebaseui.auth.soy2.page.passwordLinking";function hl(a, b, c) {
      var d = a.email;b = "";a = "" + Ek(a);a = z(a);d = "Sie haben <strong>" + (w(d) + ("</strong> bereits als E-Mail-Adresse verwendet. Melden Sie sich mit dem E-Mail-Link unten an, um Ihr <strong>" + (w(a) + ("</strong>-Konto mit <strong>" + (w(d) + "</strong> zu verbinden.")))));a = "\u00d6ffnen Sie den Link mit demselben Ger\u00e4t oder Browser, um Ihr " + (w(a) + "-Konto mit dieser E-Mail-Adresse zu verbinden.");b += '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-link-sign-in-linking"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Anmelden</h1></div><div class="firebaseui-card-content"><h2 class="firebaseui-subtitle">Sie haben bereits ein Konto</h2><p class="firebaseui-text firebaseui-text-justify">' + d + '<p class="firebaseui-text firebaseui-text-justify">' + a + '</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + qk() + '</div></div><div class="firebaseui-card-footer">' + xk(c) + "</div></form></div>";return x(b);
    }hl.B = "firebaseui.auth.soy2.page.emailLinkSignInLinking";function il(a, b, c) {
      b = "";var d = "" + Ek(a);d = z(d);a = "Sie haben versucht, <strong>" + (w(d) + "</strong> auf einem Ger\u00e4t, auf dem Sie nicht angemeldet sind, mit Ihrem E-Mail-Konto zu verbinden.");d = "Wenn Sie Ihr <strong>" + (w(d) + '</strong>-Konto weiterhin verbinden m\u00f6chten, \u00f6ffnen Sie den Link bitte auf dem Ger\u00e4t, auf dem Sie den Anmeldevorgang gestartet haben. Andernfalls tippen Sie auf "Weiter", um sich auf diesem Ger\u00e4t anzumelden.');b += '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-link-sign-in-linking-different-device"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Anmelden</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text firebaseui-text-justify">' + a + '</p><p class="firebaseui-text firebaseui-text-justify">' + d + '</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + sk() + '</div></div><div class="firebaseui-card-footer">' + xk(c) + "</div></form></div>";return x(b);
    }il.B = "firebaseui.auth.soy2.page.emailLinkSignInLinkingDifferentDevice";function jl(a, b, c) {
      var d = a.email;b = "";a = "" + Ek(a);a = z(a);d = "Sie haben <strong>" + (w(d) + ("</strong> bereits verwendet. Melden Sie sich mit " + (w(a) + " an, um fortzufahren.")));b += '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-federated-linking"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Anmelden</h1></div><div class="firebaseui-card-content"><h2 class="firebaseui-subtitle">Sie haben bereits ein Konto</h2><p class="firebaseui-text">' + d + '</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + pk({ label: z("Mit " + ("" + a + " anmelden")) }) + '</div></div><div class="firebaseui-card-footer">' + xk(c) + "</div></form></div>";return x(b);
    }jl.B = "firebaseui.auth.soy2.page.federatedLinking";function kl(a, b, c) {
      b = "";a = "To continue sign in with <strong>" + (w(a.email) + "</strong> on this device, you have to recover the password.");b += '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-unsupported-provider"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Anmelden</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">' + a + '</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + wk(null) + pk({ label: z("Passwort zur\u00fccksetzen") }) + '</div></div><div class="firebaseui-card-footer">' + xk(c) + "</div></form></div>";return x(b);
    }kl.B = "firebaseui.auth.soy2.page.unsupportedProvider";function ll(a) {
      var b = "",
          c = '<p class="firebaseui-text">f\u00fcr <strong>' + (w(a.email) + "</strong></p>");b += '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-reset"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Passwort zur\u00fccksetzen</h1></div><div class="firebaseui-card-content">' + c + tk(jd(a)) + '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + rk() + "</div></div></form></div>";return x(b);
    }ll.B = "firebaseui.auth.soy2.page.passwordReset";function ml(a) {
      a = a || {};a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-reset-success"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Passwort ge\u00e4ndert</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Sie k\u00f6nnen sich jetzt mit Ihrem neuen Passwort anmelden</p></div><div class="firebaseui-card-actions">' + (a.T ? '<div class="firebaseui-form-actions">' + sk() + "</div>" : "") + "</div></div>";return x(a);
    }ml.B = "firebaseui.auth.soy2.page.passwordResetSuccess";function nl(a) {
      a = a || {};a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-password-reset-failure"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Versuchen Sie erneut, das Passwort zur\u00fcckzusetzen</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Ihre Anfrage zum Zur\u00fccksetzen des Passworts ist abgelaufen oder der Link wurde bereits verwendet</p></div><div class="firebaseui-card-actions">' + (a.T ? '<div class="firebaseui-form-actions">' + pk(null) + "</div>" : "") + "</div></div>";return x(a);
    }nl.B = "firebaseui.auth.soy2.page.passwordResetFailure";function ol(a) {
      var b = a.T,
          c = "";a = "Ihre Anmelde-E-Mail-Adresse wurde wieder in <strong>" + (w(a.email) + "</strong> ge\u00e4ndert.");c += '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-change-revoke-success"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Aktualisierte E-Mail-Adresse</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">' + a + '</p><p class="firebaseui-text">Wenn Sie nicht um \u00c4nderung der Anmelde-E-Mail-Adresse gebeten haben, versucht m\u00f6glicherweise jemand anderes, auf Ihr Konto zuzugreifen. In diesem Fall sollten Sie <a class="firebaseui-link firebaseui-id-reset-password-link" href="javascript:void(0)">Ihr Passwort sofort \u00e4ndern</a>.</p></div><div class="firebaseui-card-actions">' + (b ? '<div class="firebaseui-form-actions">' + pk(null) + "</div>" : "") + "</div></form></div>";return x(c);
    }ol.B = "firebaseui.auth.soy2.page.emailChangeRevokeSuccess";
    function pl(a) {
      a = a || {};a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-change-revoke-failure"><div class="firebaseui-card-header"><h1 class="firebaseui-title">E-Mail-Adresse kann nicht aktualisiert werden</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Beim \u00c4ndern der E-Mail-Adresse f\u00fcr die Anmeldung ist ein Problem aufgetreten.</p><p class="firebaseui-text">Wenn Sie die E-Mail-Adresse bei einem erneuten Versuch immer noch nicht zur\u00fccksetzen k\u00f6nnen, wenden Sie sich bitte an Ihren Administrator.</p></div><div class="firebaseui-card-actions">' + (a.T ? '<div class="firebaseui-form-actions">' + pk(null) + "</div>" : "") + "</div></div>";return x(a);
    }pl.B = "firebaseui.auth.soy2.page.emailChangeRevokeFailure";function ql(a) {
      a = a || {};a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-verification-success"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Ihre E-Mail-Adresse wurde best\u00e4tigt</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Sie k\u00f6nnen sich jetzt mit Ihrem neuen Konto anmelden</p></div><div class="firebaseui-card-actions">' + (a.T ? '<div class="firebaseui-form-actions">' + sk() + "</div>" : "") + "</div></div>";return x(a);
    }ql.B = "firebaseui.auth.soy2.page.emailVerificationSuccess";function rl(a) {
      a = a || {};a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-verification-failure"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Versuchen Sie noch einmal, Ihre E-Mail-Adresse zu best\u00e4tigen</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">Ihre Anfrage zur Best\u00e4tigung der E-Mail-Adresse ist abgelaufen oder der Link wurde bereits verwendet</p></div><div class="firebaseui-card-actions">' + (a.T ? '<div class="firebaseui-form-actions">' + pk(null) + "</div>" : "") + "</div></div>";return x(a);
    }rl.B = "firebaseui.auth.soy2.page.emailVerificationFailure";function sl(a) {
      a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-unrecoverable-error"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Ein Fehler ist aufgetreten</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">' + w(a.errorMessage) + "</p></div></div>";return x(a);
    }sl.B = "firebaseui.auth.soy2.page.unrecoverableError";
    function tl(a, b, c) {
      var d = a.Fb;b = "";a = "Mit " + (w(a.Ub) + " fortfahren?");d = "Sie wollten sich urspr\u00fcnglich mit " + (w(d) + " anmelden");b += '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-email-mismatch"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Anmelden</h1></div><div class="firebaseui-card-content"><h2 class="firebaseui-subtitle">' + a + '</h2><p class="firebaseui-text">' + d + '</p></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + wk(null) + pk({ label: z("Weiter") }) + '</div></div><div class="firebaseui-card-footer">' + xk(c) + "</div></form></div>";return x(b);
    }tl.B = "firebaseui.auth.soy2.page.emailMismatch";function ul(a, b, c) {
      var d = '<div class="firebaseui-container firebaseui-page-provider-sign-in firebaseui-id-page-provider-sign-in firebaseui-use-spinner"><div class="firebaseui-card-content"><form onsubmit="return false;"><ul class="firebaseui-idp-list">';a = a.Hb;b = a.length;for (var e = 0; e < b; e++) {
        var f = { ma: a[e] };var g = c;f = f || {};var h = f.ma,
            r = f;r = r || {};var n = "";switch (r.ma.providerId) {case "google.com":
            n += "firebaseui-idp-google";break;case "github.com":
            n += "firebaseui-idp-github";break;case "facebook.com":
            n += "firebaseui-idp-facebook";break;case "twitter.com":
            n += "firebaseui-idp-twitter";break;case "phone":
            n += "firebaseui-idp-phone";break;case "anonymous":
            n += "firebaseui-idp-anonymous";break;case "password":
            n += "firebaseui-idp-password";break;default:
            n += "firebaseui-idp-generic";}r = '<button class="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised ' + ld(y(n)) + ' firebaseui-id-idp-button" data-provider-id="' + ld(h.providerId) + '" style="background-color:';n = h.ob;null != n && n.ca === Yc ? n = n.content : null == n ? n = "" : n instanceof Qb ? n instanceof Qb && n.constructor === Qb && n.f === Rb ? n = n.a : (Ca("expected object of type SafeStyle, got '" + n + "' of type " + ma(n)), n = "type_error:SafeStyle") : (n = String(n), wd.test(n) || (Ca("Bad value `%s` for |filterCssValue", [n]), n = "zSoyz"));r = r + ld(n) + '"><span class="firebaseui-idp-icon-wrapper"><img class="firebaseui-idp-icon" alt="" src="';
        n = (n = f) || {};n = n.ma;var la = "";if (n.fb) la += qd(n.fb);else switch (n.providerId) {case "google.com":
            la += qd(g.yb);break;case "github.com":
            la += qd(g.wb);break;case "facebook.com":
            la += qd(g.tb);break;case "twitter.com":
            la += qd(g.Sb);break;case "phone":
            la += qd(g.Gb);break;case "anonymous":
            la += qd(g.nb);break;default:
            la += qd(g.Eb);}g = id(la);g = r + ld(qd(g)) + '"></span>';"password" == h.providerId ? g += '<span class="firebaseui-idp-text firebaseui-idp-text-long">Mit E-Mail-Adresse anmelden</span><span class="firebaseui-idp-text firebaseui-idp-text-short">E-Mail-Adresse</span>' : "phone" == h.providerId ? g += '<span class="firebaseui-idp-text firebaseui-idp-text-long">Mit einer Telefonnummer anmelden</span><span class="firebaseui-idp-text firebaseui-idp-text-short">Telefonnummer</span>' : "anonymous" == h.providerId ? g += '<span class="firebaseui-idp-text firebaseui-idp-text-long">Als Gast fortfahren</span><span class="firebaseui-idp-text firebaseui-idp-text-short">Gast</span>' : (h = "Mit " + (w(Ek(f)) + " anmelden"), g += '<span class="firebaseui-idp-text firebaseui-idp-text-long">' + h + '</span><span class="firebaseui-idp-text firebaseui-idp-text-short">' + w(Ek(f)) + "</span>");f = x(g + "</button>");d += '<li class="firebaseui-list-item">' + f + "</li>";
      }d += '</ul></form></div><div class="firebaseui-card-footer firebaseui-provider-sign-in-footer">' + yk(c) + "</div></div>";return x(d);
    }ul.B = "firebaseui.auth.soy2.page.providerSignIn";function vl(a, b, c) {
      a = a || {};var d = a.sb,
          e = a.Qa;b = a.ga;a = a || {};a = a.va;a = '<div class="firebaseui-phone-number"><button class="firebaseui-id-country-selector firebaseui-country-selector mdl-button mdl-js-button"><span class="firebaseui-flag firebaseui-country-selector-flag firebaseui-id-country-selector-flag"></span><span class="firebaseui-id-country-selector-code"></span></button><div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label firebaseui-textfield firebaseui-phone-input-wrapper"><label class="mdl-textfield__label firebaseui-label" for="phoneNumber">Telefonnummer</label><input type="tel" name="phoneNumber" class="mdl-textfield__input firebaseui-input firebaseui-id-phone-number" value="' + ld(null != a ? a : "") + '"></div></div><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-phone-number-error firebaseui-id-phone-number-error"></p></div>';a = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-phone-sign-in-start"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Telefonnummer eingeben</h1></div><div class="firebaseui-card-content"><div class="firebaseui-relative-wrapper">' + x(a);var f;d ? f = x('<div class="firebaseui-recaptcha-wrapper"><div class="firebaseui-recaptcha-container"></div><div class="firebaseui-error-wrapper firebaseui-recaptcha-error-wrapper"><p class="firebaseui-error firebaseui-hidden firebaseui-id-recaptcha-error"></p></div></div>') : f = "";f = a + f + '</div></div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + (e ? wk(null) : "") + pk({ label: z("Best\u00e4tigen") }) + '</div></div><div class="firebaseui-card-footer">';b ? (b = '<p class="firebaseui-tos firebaseui-phone-tos">', b = c.H && c.G ? b + 'Indem Sie auf "Verifizieren" tippen, stimmen Sie <a href="javascript:void(0)" class="firebaseui-link firebaseui-tos-link" target="_blank">unseren Nutzungsbedingungen</a> und <a href="javascript:void(0)" class="firebaseui-link firebaseui-pp-link" target="_blank">unserer Datenschutzerkl\u00e4rung</a> zu. Sie erhalten m\u00f6glicherweise eine SMS und es k\u00f6nnen Geb\u00fchren f\u00fcr die Nachricht und die Daten\u00fcbertragung anfallen.' : b + 'Wenn Sie auf "Best\u00e4tigen" tippen, erhalten Sie m\u00f6glicherweise eine Best\u00e4tigungs-SMS. Es k\u00f6nnen Geb\u00fchren f\u00fcr SMS und Daten\u00fcbertragung anfallen.', c = x(b + "</p>")) : c = x('<p class="firebaseui-tos firebaseui-phone-sms-notice">Wenn Sie auf "Best\u00e4tigen" tippen, erhalten Sie m\u00f6glicherweise eine Best\u00e4tigungs-SMS. Es k\u00f6nnen Geb\u00fchren f\u00fcr SMS und Daten\u00fcbertragung anfallen.</p>') + xk(c);return x(f + c + "</div></form></div>");
    }vl.B = "firebaseui.auth.soy2.page.phoneSignInStart";function wl(a, b, c) {
      a = a || {};b = a.phoneNumber;var d = "";a = 'Geben Sie den 6-stelligen Code ein, den wir an <a class="firebaseui-link firebaseui-change-phone-number-link firebaseui-id-change-phone-number-link" href="javascript:void(0)">&lrm;' + (w(b) + "</a> geschickt haben");w(b);b = d;d = x('<div class="firebaseui-textfield mdl-textfield mdl-js-textfield mdl-textfield--floating-label"><label class="mdl-textfield__label firebaseui-label" for="phoneConfirmationCode">Sechsstelliger Code</label><input type="number" name="phoneConfirmationCode" class="mdl-textfield__input firebaseui-input firebaseui-id-phone-confirmation-code"></div><div class="firebaseui-error-wrapper"><p class="firebaseui-error firebaseui-text-input-error firebaseui-hidden firebaseui-id-phone-confirmation-code-error"></p></div>');
      c = '<div class="mdl-card mdl-shadow--2dp firebaseui-container firebaseui-id-page-phone-sign-in-finish"><form onsubmit="return false;"><div class="firebaseui-card-header"><h1 class="firebaseui-title">Telefonnummer best\u00e4tigen</h1></div><div class="firebaseui-card-content"><p class="firebaseui-text">' + a + "</p>" + d + '</div><div class="firebaseui-card-actions"><div class="firebaseui-form-actions">' + wk(null) + pk({ label: z("Weiter") }) + '</div></div><div class="firebaseui-card-footer">' + xk(c) + "</div></form>";
      a = x('<div class="firebaseui-resend-container"><span class="firebaseui-id-resend-countdown"></span><a href="javascript:void(0)" class="firebaseui-id-resend-link firebaseui-hidden firebaseui-link">Erneut senden</a></div>');return x(b + (c + a + "</div>"));
    }wl.B = "firebaseui.auth.soy2.page.phoneSignInFinish";function P() {
      return J(this, "firebaseui-id-submit");
    }function Q() {
      return J(this, "firebaseui-id-secondary-link");
    }function xl(a, b) {
      L(this, P.call(this), function (b) {
        a(b);
      });var c = Q.call(this);c && b && L(this, c, function (a) {
        b(a);
      });
    }
    function yl() {
      return J(this, "firebaseui-id-password");
    }function zl() {
      return J(this, "firebaseui-id-password-error");
    }function Al() {
      var a = yl.call(this),
          b = zl.call(this);ik(this, a, function () {
        nk(b) && (K(a, !0), mk(b));
      });
    }function Bl() {
      var a = yl.call(this);var b = zl.call(this);I(a) ? (K(a, !0), mk(b), b = !0) : (K(a, !1), M(b, zd().toString()), b = !1);return b ? I(a) : null;
    }function Cl(a, b, c, d, e, f) {
      N.call(this, gl, { email: a }, f, "passwordLinking", { H: d, G: e });this.a = b;this.L = c;
    }t(Cl, N);Cl.prototype.u = function () {
      this.R();this.P(this.a, this.L);Tk(this, this.i(), this.a);this.i().focus();Cl.o.u.call(this);
    };Cl.prototype.l = function () {
      this.a = null;Cl.o.l.call(this);
    };Cl.prototype.J = function () {
      return I(J(this, "firebaseui-id-email"));
    };q(Cl.prototype, { i: yl, D: zl, R: Al, A: Bl, $: P, ba: Q, P: xl });var Dl = /^[+a-zA-Z0-9_.!#$%&'*\/=?^`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,63}$/;function El() {
      return J(this, "firebaseui-id-email");
    }function Fl() {
      return J(this, "firebaseui-id-email-error");
    }function Gl(a) {
      var b = El.call(this),
          c = Fl.call(this);ik(this, b, function () {
        nk(c) && (K(b, !0), mk(c));
      });a && jk(this, b, function () {
        a();
      });
    }function Hl() {
      return Ta(I(El.call(this)) || "");
    }function Il() {
      var a = El.call(this);var b = Fl.call(this);var c = I(a) || "";c ? Dl.test(c) ? (K(a, !0), mk(b), b = !0) : (K(a, !1), M(b, y("Diese E-Mail-Adresse ist ung\u00fcltig").toString()), b = !1) : (K(a, !1), M(b, y("Geben Sie Ihre E-Mail-Adresse ein, um fortzufahren").toString()), b = !1);return b ? Ta(I(a)) : null;
    }function Jl(a, b, c, d, e, f, g) {
      N.call(this, Vk, { email: c, ga: !!f }, g, "passwordSignIn", { H: d, G: e });this.a = a;this.L = b;
    }t(Jl, N);Jl.prototype.u = function () {
      this.R();this.$();this.ba(this.a, this.L);Sk(this, this.s(), this.i());Tk(this, this.i(), this.a);I(this.s()) ? this.i().focus() : this.s().focus();Jl.o.u.call(this);
    };Jl.prototype.l = function () {
      this.L = this.a = null;Jl.o.l.call(this);
    };q(Jl.prototype, { s: El, U: Fl, R: Gl, P: Hl, J: Il, i: yl, D: zl, $: Al, A: Bl, sa: P, ra: Q, ba: xl });function R(a, b, c, d, e, f) {
      N.call(this, a, b, d, e || "notice", f);this.a = c || null;
    }t(R, N);R.prototype.u = function () {
      this.a && (this.s(this.a), this.i().focus());R.o.u.call(this);
    };R.prototype.l = function () {
      this.a = null;R.o.l.call(this);
    };q(R.prototype, { i: P, A: Q, s: xl });function Kl(a, b, c, d, e) {
      R.call(this, Yk, { email: a, T: !!b }, b, e, "passwordRecoveryEmailSent", { H: c, G: d });
    }t(Kl, R);function Ll(a, b) {
      R.call(this, ql, { T: !!a }, a, b, "emailVerificationSuccess");
    }t(Ll, R);function Ml(a, b) {
      R.call(this, rl, { T: !!a }, a, b, "emailVerificationFailure");
    }t(Ml, R);function Nl(a, b) {
      R.call(this, ml, { T: !!a }, a, b, "passwordResetSuccess");
    }t(Nl, R);function Ol(a, b) {
      R.call(this, nl, { T: !!a }, a, b, "passwordResetFailure");
    }t(Ol, R);function Pl(a, b) {
      R.call(this, pl, { T: !!a }, a, b, "emailChangeRevokeFailure");
    }t(Pl, R);function Ql(a, b) {
      R.call(this, sl, { errorMessage: a }, void 0, b, "unrecoverableError");
    }t(Ql, R);var Rl = !1,
        Sl = null;function Tl(a, b) {
      Rl = !!b;Sl || ("undefined" == typeof accountchooser && qj() ? (b = Jb(Fb(new Cb(Db, "//www.gstatic.com/accountchooser/client.js"))), Sl = ff(A(oh(b)), function () {})) : Sl = A());Sl.then(a, a);
    }function Ul(a, b) {
      a = S(a);(a = Pg(a).accountChooserInvoked || null) ? a(b) : b();
    }function Vl(a, b, c) {
      a = S(a);(a = Pg(a).accountChooserResult || null) ? a(b, c) : c();
    }function Wl(a, b, c, d, e) {
      d ? (H("callback", a, b), Rl && c()) : Ul(a, function () {
        Pi(T(a));Yi(function (d) {
          F(zi, T(a));Vl(a, d ? "empty" : "unavailable", function () {
            H("signIn", a, b);(d || Rl) && c();
          });
        }, Ki(T(a)), e);
      });
    }function Xl(a, b, c, d) {
      function e(a) {
        a = U(a);V(b, c, void 0, a);d();
      }Vl(b, "accountSelected", function () {
        Ji(!1, T(b));var f = Yl(b);W(b, X(b).fetchSignInMethodsForEmail(a.a).then(function (e) {
          Zl(b, c, e, a.a, a.h || void 0, void 0, f);d();
        }, e));
      });
    }function $l(a, b, c, d) {
      Vl(b, a ? "addAccount" : "unavailable", function () {
        H("signIn", b, c);(a || Rl) && d();
      });
    }function am(a, b, c, d) {
      function e() {
        var b = a();b && (b = Og(S(b))) && b();
      }Vi(function () {
        var f = a();f && Wl(f, b, e, c, d);
      }, function (c) {
        var d = a();d && Xl(c, d, b, e);
      }, function (c) {
        var d = a();d && $l(c, d, b, e);
      }, a() && jg(S(a())));
    }function bm(a, b, c, d) {
      function e(c) {
        if (!c.name || "cancel" != c.name) {
          a: {
            var d = c.message;try {
              var e = ((JSON.parse(d).error || {}).message || "").toLowerCase().match(/invalid.+(access|id)_token/);if (e && e.length) {
                var f = !0;break a;
              }
            } catch (la) {}f = !1;
          }if (f) c = O(b), b.m(), V(a, c, void 0, y("Ihre Anmeldesitzung ist abgelaufen. Bitte versuchen Sie es sp\u00e4ter noch einmal.").toString());else {
            f = c && c.message || "";if (c.code) {
              if ("auth/email-already-in-use" == c.code || "auth/credential-already-in-use" == c.code) return;f = U(c);
            }b.f(f);
          }
        }
      }cm(a);if (d) return dm(a, c), A();if (!c.credential) throw Error("No credential found!");d = X(a).currentUser || c.user;if (!d) throw Error("User not logged in.");d = new Ah(d.email, d.displayName, d.photoURL, "password" == c.credential.providerId ? null : c.credential.providerId);null != Fi(Bi, T(a)) && !Fi(Bi, T(a)) || Li(d, T(a));F(Bi, T(a));try {
        var f = em(a, c);
      } catch (g) {
        return xe(g.code || g.message, g), b.f(g.code || g.message), A();
      }c = f.then(function (b) {
        dm(a, b);
      }, e).then(void 0, e);W(a, f);return A(c);
    }function dm(a, b) {
      if (!b.user) throw Error("No user found");var c = Rg(S(a));Qg(S(a)) && c && Ce("Both signInSuccess and signInSuccessWithAuthResult callbacks are provided. Only signInSuccessWithAuthResult callback will be invoked.");if (c) {
        c = Rg(S(a));var d = Hi(T(a)) || void 0;F(Ai, T(a));var e = !1;if ($f()) {
          if (!c || c(b, d)) e = !0, window.opener.location.assign(Mb(Ob(fm(a, d))));c || window.close();
        } else if (!c || c(b, d)) e = !0, Zf(fm(a, d));e || a.reset();
      } else {
        c = b.user;b = b.credential;d = Qg(S(a));e = Hi(T(a)) || void 0;F(Ai, T(a));var f = !1;if ($f()) {
          if (!d || d(c, b, e)) f = !0, window.opener.location.assign(Mb(Ob(fm(a, e))));d || window.close();
        } else if (!d || d(c, b, e)) f = !0, Zf(fm(a, e));f || a.reset();
      }
    }function fm(a, b) {
      a = b || S(a).a.get("signInSuccessUrl");if (!a) throw Error("No redirect URL has been found. You must either specify a signInSuccessUrl in the configuration, pass in a redirect URL to the widget URL, or return false from the callback.");return a;
    }function U(a) {
      var b = "";switch (a.code) {case "auth/email-already-in-use":
          b += "Die E-Mail-Adresse wird bereits f\u00fcr ein anderes Konto verwendet";break;case "auth/requires-recent-login":
          b += Cd();break;case "auth/too-many-requests":
          b += "Sie haben zu oft ein falsches Passwort eingegeben. Bitte versuchen Sie es in einigen Minuten noch einmal.";break;case "auth/user-cancelled":
          b += "Erteilen Sie die erforderlichen Berechtigungen zur Anmeldung in der Anwendung";break;case "auth/user-not-found":
          b += "Diese E-Mail-Adresse passt zu keinem Konto";
          break;case "auth/user-token-expired":
          b += Cd();break;case "auth/weak-password":
          b += "Starke Passw\u00f6rter umfassen mindestens sechs Zeichen und eine Mischung aus Buchstaben und Ziffern";break;case "auth/wrong-password":
          b += "Die E-Mail-Adresse und das Passwort passen nicht zusammen";break;case "auth/network-request-failed":
          b += "Ein Netzwerkfehler ist aufgetreten";break;case "auth/invalid-phone-number":
          b += xd();break;case "auth/invalid-verification-code":
          b += yd();break;case "auth/code-expired":
          b += "Dieser Code ist nicht mehr g\u00fcltig";
          break;case "auth/expired-action-code":
          b += "Dieser Code ist abgelaufen.";break;case "auth/invalid-action-code":
          b += "Der Aktionscode ist ung\u00fcltig. M\u00f6glicherweise ist der Code fehlerhaft oder abgelaufen oder er wurde bereits verwendet.";}if (b = y(b).toString()) return b;try {
        return JSON.parse(a.message), xe("Internal error: " + a.message, void 0), Ad().toString();
      } catch (c) {
        return a.message;
      }
    }function gm(a, b, c) {
      var d = $d[b] && firebase.auth[$d[b]] ? new firebase.auth[$d[b]]() : 0 == b.indexOf("saml.") ? new firebase.auth.SAMLAuthProvider(b) : new firebase.auth.OAuthProvider(b);if (!d) throw Error("Invalid Firebase Auth provider!");var e = Dg(S(a), b);if (d.addScope) for (var f = 0; f < e.length; f++) {
        d.addScope(e[f]);
      }e = Eg(S(a), b) || {};c && (b == firebase.auth.GoogleAuthProvider.PROVIDER_ID ? a = "login_hint" : a = (a = xg(S(a), b)) && a.Db, a && (e[a] = c));d.setCustomParameters && d.setCustomParameters(e);return d;
    }function hm(a, b, c, d) {
      function e() {
        Pi(T(a));W(a, b.M(p(a.Qb, a), [r], function () {
          if ("file:" === (window.location && window.location.protocol)) return W(a, im(a).then(function (c) {
            b.m();
            F(zi, T(a));H("callback", a, h, A(c));
          }, f));
        }, g));
      }function f(c) {
        F(zi, T(a));if (!c.name || "cancel" != c.name) switch (c.code) {case "auth/popup-blocked":
            e();break;case "auth/popup-closed-by-user":case "auth/cancelled-popup-request":
            break;case "auth/credential-already-in-use":
            break;case "auth/network-request-failed":case "auth/too-many-requests":case "auth/user-cancelled":
            b.f(U(c));break;default:
            b.m(), H("callback", a, h, df(c));}
      }function g(c) {
        F(zi, T(a));c.name && "cancel" == c.name || (xe("signInWithRedirect: " + c.code, void 0), c = U(c), "blank" == b.Ma && Mg(S(a)) ? (b.m(), H("providerSignIn", a, h, c)) : b.f(c));
      }var h = O(b),
          r = gm(a, c, d);"redirect" == Ng(S(a)) ? e() : W(a, jm(a, r).then(function (c) {
        b.m();H("callback", a, h, A(c));
      }, f));
    }function km(a, b) {
      W(a, b.M(p(a.Mb, a), [], function (c) {
        b.m();return bm(a, b, c, !0);
      }, function (a) {
        a.name && "cancel" == a.name || (xe("ContinueAsGuest: " + a.code, void 0), a = U(a), b.f(a));
      }));
    }function lm(a, b, c) {
      function d(c) {
        var d = !1;c = b.M(p(a.Nb, a), [c], function (c) {
          var e = O(b);b.m();H("callback", a, e, A(c));d = !0;
        }, function (c) {
          if (!c.name || "cancel" != c.name) if (!c || "auth/credential-already-in-use" != c.code) if (c && "auth/email-already-in-use" == c.code && c.email && c.credential) {
            var d = O(b);b.m();H("callback", a, d, df(c));
          } else c = U(c), b.f(c);
        });W(a, c);return c.then(function () {
          return d;
        }, function () {
          return !1;
        });
      }var e = Bg(S(a), c && c.authMethod || null);if (c && c.idToken && e === firebase.auth.GoogleAuthProvider.PROVIDER_ID) return Dg(S(a), firebase.auth.GoogleAuthProvider.PROVIDER_ID).length ? (hm(a, b, e, c.id), c = A(!0)) : c = d(firebase.auth.GoogleAuthProvider.credential(c.idToken)), c;c && b.f(y("Die f\u00fcr den Authentifizierungsanbieter gew\u00e4hlten Anmeldedaten werden nicht unterst\u00fctzt.").toString());return A(!1);
    }function mm(a, b) {
      var c = b.J(),
          d = b.A();if (c) {
        if (d) {
          var e = firebase.auth.EmailAuthProvider.credential(c, d);W(a, b.M(p(a.Ob, a), [c, d], function (c) {
            return bm(a, b, { user: c.user, credential: e, operationType: c.operationType, additionalUserInfo: c.additionalUserInfo });
          }, function (a) {
            if (!a.name || "cancel" != a.name) switch (a.code) {case "auth/email-already-in-use":
                break;case "auth/email-exists":
                K(b.s(), !1);M(b.U(), U(a));break;case "auth/too-many-requests":case "auth/wrong-password":
                K(b.i(), !1);M(b.D(), U(a));break;default:
                xe("verifyPassword: " + a.message, void 0), b.f(U(a));}
          }));
        } else b.i().focus();
      } else b.s().focus();
    }function Yl(a) {
      a = wg(S(a));return 1 == a.length && a[0] == firebase.auth.EmailAuthProvider.PROVIDER_ID;
    }function nm(a) {
      a = wg(S(a));return 1 == a.length && a[0] == firebase.auth.PhoneAuthProvider.PROVIDER_ID;
    }function V(a, b, c, d) {
      Yl(a) ? d ? H("signIn", a, b, c, d) : om(a, b, c) : a && nm(a) && !d ? H("phoneSignInStart", a, b) : a && Mg(S(a)) && !d ? H("federatedRedirect", a, b) : H("providerSignIn", a, b, d);
    }function pm(a, b, c, d) {
      var e = O(b);W(a, b.M(p(X(a).fetchSignInMethodsForEmail, X(a)), [c], function (f) {
        Ji(Ag(S(a)) == gg, T(a));b.m();Zl(a, e, f, c, void 0, d);
      }, function (a) {
        a = U(a);b.f(a);
      }));
    }function Zl(a, b, c, d, e, f, g) {
      c.length || Jg(S(a)) ? !c.length && Jg(S(a)) ? H("sendEmailLinkForSignIn", a, b, d, function () {
        H("signIn", a, b);
      }) : Ka(c, firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD) ? H("passwordSignIn", a, b, d, g) : 1 == c.length && c[0] === firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD ? H("sendEmailLinkForSignIn", a, b, d, function () {
        H("signIn", a, b);
      }) : (c = Yd(c, wg(S(a)))) ? (Oi(new Hh(d), T(a)), H("federatedSignIn", a, b, d, c, f)) : H("unsupportedProvider", a, b, d) : H("passwordSignUp", a, b, d, e, void 0, g);
    }function qm(a, b, c, d, e, f) {
      var g = O(b);W(a, b.M(p(a.vb, a), [c, f], function () {
        b.m();H("emailLinkSignInSent", a, g, c, d, f);
      }, e));
    }function om(a, b, c) {
      Ag(S(a)) == gg ? Tl(function () {
        Ti ? Ul(a, function () {
          Pi(T(a));Yi(function (d) {
            F(zi, T(a));Vl(a, d ? "empty" : "unavailable", function () {
              H("signIn", a, b, c);
            });
          }, Ki(T(a)), ng(S(a)));
        }) : (Y(a), am(rm, b, !1, ng(S(a))));
      }, !1) : (Rl = !1, Ul(a, function () {
        Vl(a, "unavailable", function () {
          H("signIn", a, b, c);
        });
      }));
    }function sm(a) {
      var b = cg();a = pg(S(a));b = yc(b, a) || "";for (var c in kg) {
        if (kg[c].toLowerCase() == b.toLowerCase()) return kg[c];
      }return "callback";
    }function tm(a) {
      var b = cg();a = Id(S(a).a, "queryParameterForSignInSuccessUrl");return (b = yc(b, a)) ? Mb(Ob(b)) : null;
    }function um() {
      return yc(cg(), "oobCode");
    }function vm() {
      var a = yc(cg(), "continueUrl");return a ? function () {
        Zf(a);
      } : null;
    }function wm(a, b) {
      var c = bg(b);switch (sm(a)) {case "callback":
          (b = tm(a)) && Ii(b, T(a));a.gb() ? H("callback", a, c) : V(a, c);break;case "resetPassword":
          H("passwordReset", a, c, um(), vm());break;case "recoverEmail":
          H("emailChangeRevocation", a, c, um());break;case "verifyEmail":
          H("emailVerification", a, c, um(), vm());break;case "signIn":
          H("emailLinkSignInCallback", a, c, cg());xm();break;case "select":
          if ((b = tm(a)) && Ii(b, T(a)), Ti) {
            V(a, c);break;
          } else {
            Tl(function () {
              Y(a);am(rm, c, !0);
            }, !0);return;
          }default:
          throw Error("Unhandled widget operation.");}(b = Og(S(a))) && b();
    }function ym(a, b) {
      N.call(this, fl, void 0, b, "anonymousUserMismatch");this.a = a;
    }t(ym, N);ym.prototype.u = function () {
      var a = this;L(this, this.i(), function () {
        a.a();
      });this.i().focus();ym.o.u.call(this);
    };ym.prototype.l = function () {
      this.a = null;ym.o.l.call(this);
    };q(ym.prototype, { i: Q });G.anonymousUserMismatch = function (a, b) {
      var c = new ym(function () {
        c.m();V(a, b);
      });c.render(b);Z(a, c);
    };function zm(a) {
      N.call(this, Zk, void 0, a, "callback");
    }t(zm, N);zm.prototype.M = function (a, b, c, d) {
      return a.apply(null, b).then(c, d);
    };function Am(a, b, c) {
      if (c.user) {
        var d = { user: c.user,
          credential: c.credential, operationType: c.operationType, additionalUserInfo: c.additionalUserInfo },
            e = Mi(T(a)),
            f = e && e.f;if (f && !Bm(c.user, f)) Cm(a, b, d);else {
          var g = e && e.a;g ? W(a, c.user.linkWithCredential(g).then(function (c) {
            d = { user: c.user, credential: g, operationType: c.operationType, additionalUserInfo: c.additionalUserInfo };Dm(a, b, d);
          }, function (c) {
            Em(a, b, c);
          })) : Dm(a, b, d);
        }
      } else c = O(b), b.m(), Ni(T(a)), V(a, c);
    }function Dm(a, b, c) {
      Ni(T(a));bm(a, b, c);
    }function Em(a, b, c) {
      var d = O(b);Ni(T(a));c = U(c);b.m();V(a, d, void 0, c);
    }
    function Fm(a, b, c, d) {
      var e = O(b);W(a, X(a).fetchSignInMethodsForEmail(c).then(function (f) {
        b.m();f.length ? Ka(f, firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD) ? H("passwordLinking", a, e, c) : 1 == f.length && f[0] === firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD ? H("emailLinkSignInLinking", a, e, c) : (f = Yd(f, wg(S(a)))) ? H("federatedLinking", a, e, c, f, d) : (Ni(T(a)), H("unsupportedProvider", a, e, c)) : (Ni(T(a)), H("passwordRecovery", a, e, c, !1, Bd().toString()));
      }, function (c) {
        Em(a, b, c);
      }));
    }function Cm(a, b, c) {
      var d = O(b);W(a, Gm(a).then(function () {
        b.m();H("emailMismatch", a, d, c);
      }, function (a) {
        a.name && "cancel" == a.name || (a = U(a.code), b.f(a));
      }));
    }function Bm(a, b) {
      if (b == a.email) return !0;if (a.providerData) for (var c = 0; c < a.providerData.length; c++) {
        if (b == a.providerData[c].email) return !0;
      }return !1;
    }G.callback = function (a, b, c) {
      var d = new zm();d.render(b);Z(a, d);b = c || im(a);W(a, b.then(function (b) {
        Am(a, d, b);
      }, function (b) {
        if (b && ("auth/account-exists-with-different-credential" == b.code || "auth/email-already-in-use" == b.code) && b.email && b.credential) Oi(new Hh(b.email, b.credential), T(a)), Fm(a, d, b.email);else if (b && "auth/user-cancelled" == b.code) {
          var c = Mi(T(a)),
              e = U(b);c && c.a ? Fm(a, d, c.f, e) : c ? pm(a, d, c.f, e) : Em(a, d, b);
        } else b && "auth/credential-already-in-use" == b.code || (b && "auth/operation-not-supported-in-this-environment" == b.code && Yl(a) ? Am(a, d, { user: null, credential: null }) : Em(a, d, b));
      }));
    };function Hm(a, b) {
      N.call(this, el, void 0, b, "differentDeviceError");this.a = a;
    }t(Hm, N);Hm.prototype.u = function () {
      var a = this;L(this, this.i(), function () {
        a.a();
      });
      this.i().focus();Hm.o.u.call(this);
    };Hm.prototype.l = function () {
      this.a = null;Hm.o.l.call(this);
    };q(Hm.prototype, { i: Q });G.differentDeviceError = function (a, b) {
      var c = new Hm(function () {
        c.m();V(a, b);
      });c.render(b);Z(a, c);
    };function Im(a, b, c, d) {
      N.call(this, ol, { email: a, T: !!c }, d, "emailChangeRevoke");this.i = b;this.a = c || null;
    }t(Im, N);Im.prototype.u = function () {
      var a = this;L(this, J(this, "firebaseui-id-reset-password-link"), function () {
        a.i();
      });this.a && (this.A(this.a), this.s().focus());Im.o.u.call(this);
    };Im.prototype.l = function () {
      this.i = this.a = null;Im.o.l.call(this);
    };q(Im.prototype, { s: P, D: Q, A: xl });function Jm() {
      return J(this, "firebaseui-id-new-password");
    }function Km() {
      return J(this, "firebaseui-id-password-toggle");
    }function Lm() {
      this.La = !this.La;var a = Km.call(this),
          b = Jm.call(this);this.La ? (b.type = "text", tj(a, "firebaseui-input-toggle-off"), uj(a, "firebaseui-input-toggle-on")) : (b.type = "password", tj(a, "firebaseui-input-toggle-on"), uj(a, "firebaseui-input-toggle-off"));b.focus();
    }function Mm() {
      return J(this, "firebaseui-id-new-password-error");
    }
    function Nm() {
      this.La = !1;var a = Jm.call(this);a.type = "password";var b = Mm.call(this);ik(this, a, function () {
        nk(b) && (K(a, !0), mk(b));
      });var c = Km.call(this);tj(c, "firebaseui-input-toggle-on");uj(c, "firebaseui-input-toggle-off");kk(this, a, function () {
        tj(c, "firebaseui-input-toggle-focus");uj(c, "firebaseui-input-toggle-blur");
      });lk(this, a, function () {
        tj(c, "firebaseui-input-toggle-blur");uj(c, "firebaseui-input-toggle-focus");
      });L(this, c, p(Lm, this));
    }function Om() {
      var a = Jm.call(this);var b = Mm.call(this);I(a) ? (K(a, !0), mk(b), b = !0) : (K(a, !1), M(b, zd().toString()), b = !1);return b ? I(a) : null;
    }function Pm(a, b, c) {
      N.call(this, ll, { email: a }, c, "passwordReset");this.a = b;
    }t(Pm, N);Pm.prototype.u = function () {
      this.J();this.D(this.a);Tk(this, this.i(), this.a);this.i().focus();Pm.o.u.call(this);
    };Pm.prototype.l = function () {
      this.a = null;Pm.o.l.call(this);
    };q(Pm.prototype, { i: Jm, A: Mm, L: Km, J: Nm, s: Om, R: P, P: Q, D: xl });function Qm(a, b, c, d, e) {
      var f = c.s();f && W(a, c.M(p(X(a).confirmPasswordReset, X(a)), [d, f], function () {
        c.m();var d = new Nl(e);d.render(b);
        Z(a, d);
      }, function (d) {
        Rm(a, b, c, d);
      }));
    }function Rm(a, b, c, d) {
      "auth/weak-password" == (d && d.code) ? (a = U(d), K(c.i(), !1), M(c.A(), a), c.i().focus()) : (c && c.m(), c = new Ol(), c.render(b), Z(a, c));
    }function Sm(a, b, c) {
      var d = new Im(c, function () {
        W(a, d.M(p(X(a).sendPasswordResetEmail, X(a)), [c], function () {
          d.m();d = new Kl(c, void 0, B(S(a)), C(S(a)));d.render(b);Z(a, d);
        }, function () {
          d.f(y("Code f\u00fcr Passwortzur\u00fccksetzung kann nicht an die angegebene E-Mail-Adresse gesendet werden").toString());
        }));
      });d.render(b);Z(a, d);
    }G.passwordReset = function (a, b, c, d) {
      W(a, X(a).verifyPasswordResetCode(c).then(function (e) {
        var f = new Pm(e, function () {
          Qm(a, b, f, c, d);
        });f.render(b);Z(a, f);
      }, function () {
        Rm(a, b);
      }));
    };G.emailChangeRevocation = function (a, b, c) {
      var d = null;W(a, X(a).checkActionCode(c).then(function (b) {
        d = b.data.email;return X(a).applyActionCode(c);
      }).then(function () {
        Sm(a, b, d);
      }, function () {
        var c = new Pl();c.render(b);Z(a, c);
      }));
    };G.emailVerification = function (a, b, c, d) {
      W(a, X(a).applyActionCode(c).then(function () {
        var c = new Ll(d);c.render(b);Z(a, c);
      }, function () {
        var c = new Ml();c.render(b);Z(a, c);
      }));
    };function Tm(a, b) {
      try {
        var c = "number" == typeof a.selectionStart;
      } catch (d) {
        c = !1;
      }c ? (a.selectionStart = b, a.selectionEnd = b) : v && !zb("9") && ("textarea" == a.type && (b = a.value.substring(0, b).replace(/(\r\n|\r|\n)/g, "\n").length), a = a.createTextRange(), a.collapse(!0), a.move("character", b), a.select());
    }function Um(a, b, c, d, e, f) {
      N.call(this, dl, { email: c }, f, "emailLinkSignInConfirmation", { H: d, G: e });this.i = a;this.s = b;
    }t(Um, N);Um.prototype.u = function () {
      this.D(this.i);this.J(this.i, this.s);this.a().focus();
      Tm(this.a(), (this.a().value || "").length);Um.o.u.call(this);
    };Um.prototype.l = function () {
      this.s = this.i = null;Um.o.l.call(this);
    };q(Um.prototype, { a: El, P: Fl, D: Gl, L: Hl, A: Il, U: P, R: Q, J: xl });G.emailLinkConfirmation = function (a, b, c, d, e, f) {
      var g = new Um(function () {
        var e = g.A();e ? (g.m(), d(a, b, e, c)) : g.a().focus();
      }, function () {
        g.m();V(a, b, e || void 0);
      }, e || void 0, B(S(a)), C(S(a)));g.render(b);Z(a, g);f && g.f(f);
    };function Vm(a, b, c, d, e) {
      N.call(this, il, { ma: a }, e, "emailLinkSignInLinkingDifferentDevice", { H: c, G: d });this.a = b;
    }t(Vm, N);Vm.prototype.u = function () {
      this.s(this.a);this.i().focus();Vm.o.u.call(this);
    };Vm.prototype.l = function () {
      this.a = null;Vm.o.l.call(this);
    };q(Vm.prototype, { i: P, s: xl });G.emailLinkNewDeviceLinking = function (a, b, c, d) {
      var e = new Sg(c);c = e.a.a.get(D.PROVIDER_ID) || null;Wg(e, null);if (c) {
        var f = new Vm(xg(S(a), c), function () {
          f.m();d(a, b, e.toString());
        }, B(S(a)), C(S(a)));f.render(b);Z(a, f);
      } else V(a, b);
    };function Wm(a) {
      N.call(this, $k, void 0, a, "blank");
    }t(Wm, N);function Xm(a, b, c, d, e) {
      var f = new Wm(),
          g = new Sg(c),
          h = g.a.a.get(D.Va) || "",
          r = g.a.a.get(D.Na) || "",
          n = "1" === g.a.a.get(D.Ka),
          la = Vg(g),
          Ee = g.a.a.get(D.PROVIDER_ID) || null,
          rg = !Fi(Di, T(a)),
          sg = d || Qi(r, T(a)),
          Cc = (d = Ri(r, T(a))) && d.a;Ee && Cc && Cc.providerId !== Ee && (Cc = null);f.render(b);Z(a, f);W(a, f.M(function () {
        var b = A(null);b = la && rg || rg && n ? df(Error("anonymous-user-not-found")) : Ym(a, c).then(function (a) {
          if (Ee && !Cc) throw Error("pending-credential-not-found");return a;
        });var d = null;return b.then(function (b) {
          d = b;return e ? null : X(a).checkActionCode(h);
        }).then(function () {
          return d;
        });
      }, [], function (d) {
        sg ? Zm(a, f, sg, c, Cc, d) : n ? (f.m(), H("differentDeviceError", a, b)) : (f.m(), H("emailLinkConfirmation", a, b, c, $m));
      }, function (d) {
        var e = void 0;if (!d || !d.name || "cancel" != d.name) switch (f.m(), d && d.message) {case "anonymous-user-not-found":
            H("differentDeviceError", a, b);break;case "anonymous-user-mismatch":
            H("anonymousUserMismatch", a, b);break;case "pending-credential-not-found":
            H("emailLinkNewDeviceLinking", a, b, c, an);break;default:
            d && (e = U(d)), V(a, b, void 0, e);}
      }));
    }function $m(a, b, c, d) {
      Xm(a, b, d, c, !0);
    }function an(a, b, c) {
      Xm(a, b, c);
    }function Zm(a, b, c, d, e, f) {
      var g = O(b);b.W("mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active firebaseui-progress-dialog-loading-icon", y("Anmeldung\u2026").toString());var h = null;e = (f ? bn(a, f, c, d, e) : cn(a, c, d, e)).then(function (c) {
        F(Ei, T(a));F(Di, T(a));b.h();b.W("firebaseui-icon-done", y("Angemeldet.").toString());h = setTimeout(function () {
          b.h();bm(a, b, c, !0);
        }, 1E3);W(a, function () {
          b && (b.h(), b.m());clearTimeout(h);
        });
      }, function (e) {
        b.h();b.m();if (!e.name || "cancel" != e.name) {
          var f = U(e);"auth/email-already-in-use" == e.code || "auth/credential-already-in-use" == e.code ? (F(Ei, T(a)), F(Di, T(a))) : "auth/invalid-email" == e.code ? (f = y("Die angegebene E-Mail-Adresse stimmt nicht mit der aktuellen Anmeldesitzung \u00fcberein.").toString(), H("emailLinkConfirmation", a, g, d, $m, null, f)) : V(a, g, c, f);
        }
      });W(a, e);
    }G.emailLinkSignInCallback = Xm;function dn(a, b, c, d, e, f) {
      N.call(this, hl, { email: a, ma: b }, f, "emailLinkSignInLinking", { H: d, G: e });this.a = c;
    }t(dn, N);dn.prototype.u = function () {
      this.s(this.a);this.i().focus();dn.o.u.call(this);
    };dn.prototype.l = function () {
      this.a = null;dn.o.l.call(this);
    };q(dn.prototype, { i: P, s: xl });function en(a, b, c, d) {
      var e = O(b);qm(a, b, c, function () {
        V(a, e, c);
      }, function (d) {
        if (!d.name || "cancel" != d.name) {
          var f = U(d);d && "auth/network-request-failed" == d.code ? b.f(f) : (b.m(), V(a, e, c, f));
        }
      }, d);
    }G.emailLinkSignInLinking = function (a, b, c) {
      var d = Mi(T(a));Ni(T(a));if (d) {
        var e = d.a.providerId,
            f = new dn(c, xg(S(a), e), function () {
          en(a, f, c, d);
        }, B(S(a)), C(S(a)));f.render(b);Z(a, f);
      } else V(a, b);
    };function fn(a, b, c, d, e, f) {
      N.call(this, al, { email: a }, f, "emailLinkSignInSent", { H: d, G: e });this.s = b;this.a = c;
    }t(fn, N);fn.prototype.u = function () {
      var a = this;L(this, this.i(), function () {
        a.a();
      });L(this, J(this, "firebaseui-id-trouble-getting-email-link"), function () {
        a.s();
      });this.i().focus();fn.o.u.call(this);
    };fn.prototype.l = function () {
      this.a = this.s = null;fn.o.l.call(this);
    };q(fn.prototype, { i: Q });G.emailLinkSignInSent = function (a, b, c, d, e) {
      var f = new fn(c, function () {
        f.m();H("emailNotReceived", a, b, c, d, e);
      }, function () {
        f.m();d();
      }, B(S(a)), C(S(a)));f.render(b);Z(a, f);
    };function gn(a, b, c, d, e, f, g) {
      N.call(this, tl, { Ub: a, Fb: b }, g, "emailMismatch", { H: e, G: f });this.s = c;this.i = d;
    }t(gn, N);gn.prototype.u = function () {
      this.D(this.s, this.i);this.A().focus();gn.o.u.call(this);
    };gn.prototype.l = function () {
      this.i = this.a = null;gn.o.l.call(this);
    };q(gn.prototype, { A: P, J: Q, D: xl });G.emailMismatch = function (a, b, c) {
      var d = Mi(T(a));if (d) {
        var e = new gn(c.user.email, d.f, function () {
          var b = e;Ni(T(a));bm(a, b, c);
        }, function () {
          var b = c.credential.providerId,
              g = O(e);e.m();d.a ? H("federatedLinking", a, g, d.f, b) : H("federatedSignIn", a, g, d.f, b);
        }, B(S(a)), C(S(a)));e.render(b);Z(a, e);
      } else V(a, b);
    };function hn(a, b, c, d, e) {
      N.call(this, cl, void 0, e, "emailNotReceived", { H: c, G: d });this.i = a;this.a = b;
    }t(hn, N);hn.prototype.u = function () {
      var a = this;L(this, this.s(), function () {
        a.a();
      });L(this, this.ya(), function () {
        a.i();
      });this.s().focus();hn.o.u.call(this);
    };hn.prototype.ya = function () {
      return J(this, "firebaseui-id-resend-email-link");
    };hn.prototype.l = function () {
      this.a = this.i = null;hn.o.l.call(this);
    };q(hn.prototype, { s: Q });G.emailNotReceived = function (a, b, c, d, e) {
      var f = new hn(function () {
        qm(a, f, c, d, function (a) {
          a = U(a);f.f(a);
        }, e);
      }, function () {
        f.m();V(a, b, c);
      }, B(S(a)), C(S(a)));f.render(b);Z(a, f);
    };function jn(a, b, c, d, e, f) {
      N.call(this, jl, { email: a, ma: b }, f, "federatedLinking", { H: d, G: e });this.a = c;
    }t(jn, N);jn.prototype.u = function () {
      this.s(this.a);this.i().focus();jn.o.u.call(this);
    };jn.prototype.l = function () {
      this.a = null;jn.o.l.call(this);
    };q(jn.prototype, { i: P, s: xl });G.federatedLinking = function (a, b, c, d, e) {
      var f = Mi(T(a));if (f && f.a) {
        var g = new jn(c, xg(S(a), d), function () {
          hm(a, g, d, c);
        }, B(S(a)), C(S(a)));g.render(b);
        Z(a, g);e && g.f(e);
      } else V(a, b);
    };G.federatedRedirect = function (a, b) {
      var c = new Wm();c.render(b);Z(a, c);b = wg(S(a))[0];hm(a, c, b);
    };G.federatedSignIn = function (a, b, c, d, e) {
      var f = new jn(c, xg(S(a), d), function () {
        hm(a, f, d, c);
      }, B(S(a)), C(S(a)));f.render(b);Z(a, f);e && f.f(e);
    };function kn(a, b, c, d) {
      var e = b.A();e ? W(a, b.M(p(a.Kb, a), [c, e], function (c) {
        c = c.user.linkWithCredential(d).then(function (c) {
          return bm(a, b, { user: c.user, credential: d, operationType: c.operationType, additionalUserInfo: c.additionalUserInfo });
        });W(a, c);return c;
      }, function (a) {
        if (!a.name || "cancel" != a.name) switch (a.code) {case "auth/wrong-password":
            K(b.i(), !1);M(b.D(), U(a));break;case "auth/too-many-requests":
            b.f(U(a));break;default:
            xe("signInWithEmailAndPassword: " + a.message, void 0), b.f(U(a));}
      })) : b.i().focus();
    }G.passwordLinking = function (a, b, c) {
      var d = Mi(T(a));Ni(T(a));var e = d && d.a;if (e) {
        var f = new Cl(c, function () {
          kn(a, f, c, e);
        }, function () {
          f.m();H("passwordRecovery", a, b, c);
        }, B(S(a)), C(S(a)));f.render(b);Z(a, f);
      } else V(a, b);
    };function ln(a, b, c, d, e, f) {
      N.call(this, Xk, { email: c,
        Oa: !!b }, f, "passwordRecovery", { H: d, G: e });this.a = a;this.s = b;
    }t(ln, N);ln.prototype.u = function () {
      this.J();this.L(this.a, this.s);I(this.i()) || this.i().focus();Tk(this, this.i(), this.a);ln.o.u.call(this);
    };ln.prototype.l = function () {
      this.s = this.a = null;ln.o.l.call(this);
    };q(ln.prototype, { i: El, D: Fl, J: Gl, P: Hl, A: Il, U: P, R: Q, L: xl });function mn(a, b) {
      var c = b.A();if (c) {
        var d = O(b);W(a, b.M(p(X(a).sendPasswordResetEmail, X(a)), [c], function () {
          b.m();var e = new Kl(c, function () {
            e.m();V(a, d);
          }, B(S(a)), C(S(a)));e.render(d);Z(a, e);
        }, function (a) {
          K(b.i(), !1);M(b.D(), U(a));
        }));
      } else b.i().focus();
    }G.passwordRecovery = function (a, b, c, d, e) {
      var f = new ln(function () {
        mn(a, f);
      }, d ? void 0 : function () {
        f.m();V(a, b);
      }, c, B(S(a)), C(S(a)));f.render(b);Z(a, f);e && f.f(e);
    };G.passwordSignIn = function (a, b, c, d) {
      var e = new Jl(function () {
        mm(a, e);
      }, function () {
        var c = e.P();e.m();H("passwordRecovery", a, b, c);
      }, c, B(S(a)), C(S(a)), d);e.render(b);Z(a, e);
    };function nn() {
      return J(this, "firebaseui-id-name");
    }function on() {
      return J(this, "firebaseui-id-name-error");
    }function pn(a, b, c, d, e, f, g, h, r) {
      N.call(this, Wk, { email: d, Ib: a, name: e, Oa: !!c, ga: !!h }, r, "passwordSignUp", { H: f, G: g });this.a = b;this.J = c;this.D = a;
    }t(pn, N);pn.prototype.u = function () {
      this.$();this.D && this.Ra();this.sa();this.ra(this.a, this.J);this.D ? (Sk(this, this.i(), this.A()), Sk(this, this.A(), this.s())) : Sk(this, this.i(), this.s());this.a && Tk(this, this.s(), this.a);I(this.i()) ? this.D && !I(this.A()) ? this.A().focus() : this.s().focus() : this.i().focus();pn.o.u.call(this);
    };pn.prototype.l = function () {
      this.J = this.a = null;pn.o.l.call(this);
    };
    q(pn.prototype, { i: El, U: Fl, $: Gl, bb: Hl, P: Il, A: nn, mc: on, Ra: function Ra() {
        var a = nn.call(this),
            b = on.call(this);ik(this, a, function () {
          nk(b) && (K(a, !0), mk(b));
        });
      }, L: function L() {
        var a = nn.call(this);var b = on.call(this);var c = I(a);c = !/^[\s\xa0]*$/.test(null == c ? "" : String(c));K(a, c);c ? (mk(b), b = !0) : (M(b, y("Geben Sie Ihren Kontonamen ein").toString()), b = !1);return b ? Ta(I(a)) : null;
      }, s: Jm, ba: Mm, zb: Km, sa: Nm, R: Om, jc: P, Bb: Q, ra: xl });function qn(a, b) {
      var c = Ig(S(a)),
          d = b.P(),
          e = null;c && (e = b.L());var f = b.R();if (d) {
        if (c) if (e) e = Ua(e);else {
          b.A().focus();return;
        }if (f) {
          var g = firebase.auth.EmailAuthProvider.credential(d, f);W(a, b.M(p(a.Lb, a), [d, f], function (d) {
            var f = { user: d.user, credential: g, operationType: d.operationType, additionalUserInfo: d.additionalUserInfo };return c ? (d = d.user.updateProfile({ displayName: e }).then(function () {
              return bm(a, b, f);
            }), W(a, d), d) : bm(a, b, f);
          }, function (c) {
            if (!c.name || "cancel" != c.name) {
              var e = U(c);switch (c.code) {case "auth/email-already-in-use":
                  return rn(a, b, d, c);case "auth/too-many-requests":
                  e = y("\u00dcber Ihre IP-Adresse werden zu viele Kontoanfragen gesendet. Bitte versuchen Sie es in einigen Minuten noch einmal.").toString();
                case "auth/operation-not-allowed":case "auth/weak-password":
                  K(b.s(), !1);M(b.ba(), e);break;default:
                  c = "setAccountInfo: " + fi(c), xe(c, void 0), b.f(e);}
            }
          }));
        } else b.s().focus();
      } else b.i().focus();
    }function rn(a, b, c, d) {
      function e() {
        var a = U(d);K(b.i(), !1);M(b.U(), a);b.i().focus();
      }var f = X(a).fetchSignInMethodsForEmail(c).then(function (d) {
        d.length ? e() : (d = O(b), b.m(), H("passwordRecovery", a, d, c, !1, Bd().toString()));
      }, function () {
        e();
      });W(a, f);return f;
    }G.passwordSignUp = function (a, b, c, d, e, f) {
      function g() {
        h.m();V(a, b);
      }
      var h = new pn(Ig(S(a)), function () {
        qn(a, h);
      }, e ? void 0 : g, c, d, B(S(a)), C(S(a)), f);h.render(b);Z(a, h);
    };function sn() {
      return J(this, "firebaseui-id-phone-confirmation-code");
    }function tn() {
      return J(this, "firebaseui-id-phone-confirmation-code-error");
    }function un() {
      return J(this, "firebaseui-id-resend-countdown");
    }function vn(a, b, c, d, e, f, g, h, r) {
      N.call(this, wl, { phoneNumber: e }, r, "phoneSignInFinish", { H: g, G: h });this.Ra = f;this.i = new Gj(1E3);this.D = f;this.P = a;this.a = b;this.J = c;this.L = d;
    }t(vn, N);vn.prototype.u = function () {
      var a = this;this.R(this.Ra);Lf(this.i, "tick", this.A, !1, this);this.i.start();L(this, J(this, "firebaseui-id-change-phone-number-link"), function () {
        a.P();
      });L(this, this.ya(), function () {
        a.L();
      });this.sa(this.a);this.ba(this.a, this.J);this.s().focus();vn.o.u.call(this);
    };vn.prototype.l = function () {
      this.L = this.J = this.a = this.P = null;Hj(this.i);Tf(this.i, "tick", this.A);this.i = null;vn.o.l.call(this);
    };vn.prototype.A = function () {
      --this.D;0 < this.D ? this.R(this.D) : (Hj(this.i), Tf(this.i, "tick", this.A), this.ra(), this.bb());
    };q(vn.prototype, { s: sn, $: tn, sa: function sa(a) {
        var b = sn.call(this),
            c = tn.call(this);ik(this, b, function () {
          nk(c) && (K(b, !0), mk(c));
        });a && jk(this, b, function () {
          a();
        });
      }, U: function U() {
        var a = Ta(I(sn.call(this)) || "");return (/^\d{6}$/.test(a) ? a : null
        );
      }, rb: un, R: function R(a) {
        jc(un.call(this), y("Code in " + ((9 < a ? "0:" : "0:0") + a + " erneut senden")).toString());
      }, ra: function ra() {
        var a = this.rb();mk(a);
      }, ya: function ya() {
        return J(this, "firebaseui-id-resend-link");
      }, bb: function bb() {
        M(this.ya());
      }, Bb: P, zb: Q, ba: xl });function wn(a, b, c, d) {
      function e(a) {
        b.s().focus();
        K(b.s(), !1);M(b.$(), a);
      }var f = b.U();f ? (b.W("mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active firebaseui-progress-dialog-loading-icon", y("Wird best\u00e4tigt...").toString()), W(a, b.M(p(d.confirm, d), [f], function (c) {
        b.h();b.W("firebaseui-icon-done", y("Best\u00e4tigt").toString());var d = setTimeout(function () {
          b.h();b.m();var d = { user: xn(a).currentUser, credential: null, operationType: c.operationType, additionalUserInfo: c.additionalUserInfo };bm(a, b, d, !0);
        }, 1E3);W(a, function () {
          b && b.h();clearTimeout(d);
        });
      }, function (d) {
        if (d.name && "cancel" == d.name) b.h();else {
          var f = U(d);switch (d.code) {case "auth/credential-already-in-use":
              b.h();break;case "auth/code-expired":
              d = O(b);b.h();b.m();H("phoneSignInStart", a, d, c, f);break;case "auth/missing-verification-code":case "auth/invalid-verification-code":
              b.h();e(f);break;default:
              b.h(), b.f(f);}
        }
      }))) : e(yd().toString());
    }G.phoneSignInFinish = function (a, b, c, d, e, f) {
      var g = new vn(function () {
        g.m();H("phoneSignInStart", a, b, c);
      }, function () {
        wn(a, g, c, e);
      }, function () {
        g.m();V(a, b);
      }, function () {
        g.m();
        H("phoneSignInStart", a, b, c);
      }, Xd(c), d, B(S(a)), C(S(a)));g.render(b);Z(a, g);f && g.f(f);
    };var yn = !v && !(u("Safari") && !(jb() || u("Coast") || u("Opera") || u("Edge") || u("Silk") || u("Android")));function zn(a, b) {
      if (/-[a-z]/.test(b)) return null;if (yn && a.dataset) {
        if (!(!u("Android") || jb() || u("Firefox") || u("Opera") || u("Silk") || b in a.dataset)) return null;a = a.dataset[b];return void 0 === a ? null : a;
      }return a.getAttribute("data-" + String(b).replace(/([A-Z])/g, "-$1").toLowerCase());
    }function An(a, b, c) {
      a = ad(Ck, { items: a }, null, this.w);
      Jk.call(this, a, !0, !0);c && (c = Bn(a, c)) && (c.focus(), ak(c, a));L(this, a, function (a) {
        if (a = (a = kc(a.target, "firebaseui-id-list-box-dialog-button")) && zn(a, "listboxid")) Kk(), b(a);
      });
    }function Bn(a, b) {
      a = (a || document).getElementsByTagName("BUTTON");for (var c = 0; c < a.length; c++) {
        if (zn(a[c], "listboxid") === b) return a[c];
      }return null;
    }function Cn() {
      return J(this, "firebaseui-id-phone-number");
    }function Dn() {
      return J(this, "firebaseui-id-country-selector");
    }function En() {
      return J(this, "firebaseui-id-phone-number-error");
    }function Fn(a, b) {
      var c = a.a,
          d = Gn("1-US-0", c),
          e = null;b && Gn(b, c) ? e = b : d ? e = "1-US-0" : e = 0 < c.length ? c[0].c : null;if (!e) throw Error("No available default country");Hn.call(this, e, a);
    }function Gn(a, b) {
      a = Pd(a);return !(!a || !Ka(b, a));
    }function In(a) {
      return Ha(a, function (a) {
        return { id: a.c, Ga: "firebaseui-flag " + Jn(a), label: a.name + " " + ("\u200e+" + a.b) };
      });
    }function Jn(a) {
      return "firebaseui-flag-" + a.g;
    }function Kn(a) {
      var b = this;An.call(this, In(a.a), function (c) {
        Hn.call(b, c, a, !0);b.K().focus();
      }, this.wa);
    }function Hn(a, b, c) {
      var d = Pd(a);d && (c && (c = Ta(I(Cn.call(this)) || ""), b = Od(b, c), b.length && b[0].b != d.b && (c = "+" + d.b + c.substr(b[0].b.length + 1), vj(Cn.call(this), c))), b = Pd(this.wa), this.wa = a, a = J(this, "firebaseui-id-country-selector-flag"), b && uj(a, Jn(b)), tj(a, Jn(d)), jc(J(this, "firebaseui-id-country-selector-code"), "\u200e+" + d.b));
    }function Ln(a, b, c, d, e, f, g, h, r, n) {
      N.call(this, vl, { sb: b, va: r || null, Qa: !!c, ga: !!f }, n, "phoneSignInStart", { H: d, G: e });this.J = h || null;this.L = b;this.a = a;this.A = c || null;this.$ = g || null;
    }t(Ln, N);Ln.prototype.u = function () {
      this.ba(this.$, this.J);this.P(this.a, this.A || void 0);this.L || Sk(this, this.K(), this.i());Tk(this, this.i(), this.a);this.K().focus();Tm(this.K(), (this.K().value || "").length);Ln.o.u.call(this);
    };Ln.prototype.l = function () {
      this.A = this.a = null;Ln.o.l.call(this);
    };q(Ln.prototype, { pb: Lk, K: Cn, D: En, ba: function ba(a, b, c) {
        var d = this,
            e = Cn.call(this),
            f = Dn.call(this),
            g = En.call(this),
            h = a || Ud,
            r = h.a;if (0 == r.length) throw Error("No available countries provided.");Fn.call(d, h, b);L(this, f, function () {
          Kn.call(d, h);
        });ik(this, e, function () {
          nk(g) && (K(e, !0), mk(g));var a = Ta(I(e) || ""),
              b = Pd(this.wa),
              c = Od(h, a);a = Gn("1-US-0", r);c.length && c[0].b != b.b && (b = c[0], Hn.call(d, "1" == b.b && a ? "1-US-0" : b.c, h));
        });c && jk(this, e, function () {
          c();
        });
      }, R: function R(a) {
        var b = Ta(I(Cn.call(this)) || "");a = a || Ud;var c = a.a,
            d = Od(Ud, b);if (d.length && !Ka(c, d[0])) throw vj(Cn.call(this)), Cn.call(this).focus(), M(En.call(this), y("Der angegebene L\u00e4ndercode wird nicht unterst\u00fctzt.").toString()), Error("The country code provided is not supported.");c = Pd(this.wa);d.length && d[0].b != c.b && Hn.call(this, d[0].c, a);d.length && (b = b.substr(d[0].b.length + 1));return b ? new Vd(this.wa, b) : null;
      }, sa: Dn, U: function U() {
        return J(this, "firebaseui-recaptcha-container");
      }, s: function s() {
        return J(this, "firebaseui-id-recaptcha-error");
      }, i: P, ra: Q, P: xl });function Mn(a, b, c, d) {
      try {
        var e = b.R(bj);
      } catch (f) {
        return;
      }e ? $i ? (b.W("mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active firebaseui-progress-dialog-loading-icon", y("Wird best\u00e4tigt...").toString()), W(a, b.M(p(a.Pb, a), [Xd(e), c], function (c) {
        var d = O(b);b.W("firebaseui-icon-done", y("Code gesendet").toString());var f = setTimeout(function () {
          b.h();b.m();H("phoneSignInFinish", a, d, e, 15, c);
        }, 1E3);W(a, function () {
          b && b.h();clearTimeout(f);
        });
      }, function (a) {
        b.h();if (!a.name || "cancel" != a.name) {
          grecaptcha.reset(cj);$i = null;var c = a && a.message || "";if (a.code) switch (a.code) {case "auth/too-many-requests":
              c = y("Diese Telefonnummer wurde schon zu oft verwendet").toString();break;case "auth/invalid-phone-number":case "auth/missing-phone-number":
              b.K().focus();M(b.D(), xd().toString());return;default:
              c = U(a);}b.f(c);
        }
      }))) : aj ? M(b.s(), y("Klicken Sie das reCAPTCHA-K\u00e4stchen an").toString()) : !aj && d && b.i().click() : (b.K().focus(), M(b.D(), xd().toString()));
    }G.phoneSignInStart = function (a, b, c, d) {
      var e = Cg(S(a)) || {};$i = null;aj = !(e && "invisible" === e.size);var f = nm(a),
          g = Gg(S(a)),
          h = f ? Fg(S(a)) : null;g = c && c.a || g && g.c || null;c = c && c.va || h;(h = Hg(S(a))) && Td(h);bj = h ? new Nd(Hg(S(a))) : Ud;var r = new Ln(function (b) {
        Mn(a, r, n, !(!b || !b.keyCode));
      }, aj, f ? null : function () {
        n.clear();r.m();V(a, b);
      }, B(S(a)), C(S(a)), f, bj, g, c);r.render(b);Z(a, r);d && r.f(d);e.callback = function (b) {
        r.s() && mk(r.s());$i = b;aj || Mn(a, r, n);
      };e["expired-callback"] = function () {
        $i = null;
      };var n = new firebase.auth.RecaptchaVerifier(aj ? r.U() : r.i(), e, xn(a).app);W(a, r.M(p(n.render, n), [], function (a) {
        cj = a;
      }, function (c) {
        c.name && "cancel" == c.name || (c = U(c), r.m(), V(a, b, void 0, c));
      }));
    };function Nn(a, b, c, d, e) {
      N.call(this, ul, { Hb: b }, e, "providerSignIn", { H: c, G: d });this.a = a;
    }t(Nn, N);Nn.prototype.u = function () {
      this.i(this.a);Nn.o.u.call(this);
    };Nn.prototype.l = function () {
      this.a = null;Nn.o.l.call(this);
    };q(Nn.prototype, { i: function i(a) {
        function b(b) {
          a(b);
        }for (var c = this.j ? cc("firebaseui-id-idp-button", this.j || this.w.a) : [], d = 0; d < c.length; d++) {
          var e = c[d],
              f = zn(e, "providerId");L(this, e, wa(b, f));
        }
      } });G.providerSignIn = function (a, b, c) {
      var d = new Nn(function (c) {
        c == firebase.auth.EmailAuthProvider.PROVIDER_ID ? (d.m(), om(a, b)) : c == firebase.auth.PhoneAuthProvider.PROVIDER_ID ? (d.m(), H("phoneSignInStart", a, b)) : "anonymous" == c ? km(a, d) : hm(a, d, c);Y(a);a.O.cancel();
      }, yg(S(a)), B(S(a)), C(S(a)));d.render(b);Z(a, d);c && d.f(c);On(a);
    };G.sendEmailLinkForSignIn = function (a, b, c, d) {
      var e = new zm();e.render(b);Z(a, e);qm(a, e, c, d, function (d) {
        e.m();d = U(d);H("signIn", a, b, c, d);
      });
    };function Pn(a, b, c, d, e, f, g) {
      N.call(this, Uk, { email: c, Qa: !!b, ga: !!f }, g, "signIn", { H: d, G: e });this.a = a;this.s = b;
    }t(Pn, N);Pn.prototype.u = function () {
      this.D(this.a);this.J(this.a, this.s || void 0);this.i().focus();Tm(this.i(), (this.i().value || "").length);Pn.o.u.call(this);
    };Pn.prototype.l = function () {
      this.s = this.a = null;Pn.o.l.call(this);
    };
    q(Pn.prototype, { i: El, P: Fl, D: Gl, L: Hl, A: Il, U: P, R: Q, J: xl });G.signIn = function (a, b, c, d) {
      var e = Yl(a),
          f = e && Ag(S(a)) != gg,
          g = new Pn(function () {
        var b = g,
            c = b.A() || "";c && pm(a, b, c);
      }, f ? null : function () {
        g.m();V(a, b, c);
      }, c, B(S(a)), C(S(a)), e);g.render(b);Z(a, g);d && g.f(d);
    };function Qn(a, b, c, d, e, f) {
      N.call(this, kl, { email: a }, f, "unsupportedProvider", { H: d, G: e });this.a = b;this.i = c;
    }t(Qn, N);Qn.prototype.u = function () {
      this.A(this.a, this.i);this.s().focus();Qn.o.u.call(this);
    };Qn.prototype.l = function () {
      this.i = this.a = null;Qn.o.l.call(this);
    };
    q(Qn.prototype, { s: P, D: Q, A: xl });G.unsupportedProvider = function (a, b, c) {
      var d = new Qn(c, function () {
        d.m();H("passwordRecovery", a, b, c);
      }, function () {
        d.m();V(a, b, c);
      }, B(S(a)), C(S(a)));d.render(b);Z(a, d);
    };function Rn(a, b) {
      this.Z = !1;var c = Sn(b);if (Tn[c]) throw Error('An AuthUI instance already exists for the key "' + c + '"');Tn[c] = this;this.f = a;this.A = null;this.s = !1;Un(this.f);this.v = firebase.initializeApp({ apiKey: a.app.options.apiKey, authDomain: a.app.options.authDomain }, a.app.name + "-firebaseui-temp").auth();Un(this.v);
      this.v.setPersistence && this.v.setPersistence(firebase.auth.Auth.Persistence.SESSION);this.ea = b;this.W = new fg();this.a = this.K = this.i = this.F = null;this.j = [];this.Y = !1;this.O = vh.Sa();this.h = this.C = null;this.aa = this.w = !1;
    }function Un(a) {
      a && a.INTERNAL && a.INTERNAL.logFramework && a.INTERNAL.logFramework("FirebaseUI-web");
    }var Tn = {};function Sn(a) {
      return a || "[DEFAULT]";
    }function im(a) {
      Y(a);a.i || (a.i = Vn(a, function (b) {
        return b && !Mi(T(a)) ? A(xn(a).getRedirectResult().then(function (a) {
          return a;
        }, function (b) {
          if (b && "auth/email-already-in-use" == b.code && b.email && b.credential) throw b;return Wn(a, b);
        })) : A(X(a).getRedirectResult().then(function (b) {
          return qg(S(a)) && !b.user && a.h && !a.h.isAnonymous ? xn(a).getRedirectResult() : b;
        }));
      }));return a.i;
    }function Z(a, b) {
      Y(a);a.a = b;
    }var Xn = null;function rm() {
      return Xn;
    }function X(a) {
      Y(a);return a.v;
    }function xn(a) {
      Y(a);return a.f;
    }function T(a) {
      Y(a);return a.ea;
    }k = Rn.prototype;k.gb = function () {
      Y(this);return "pending" === Fi(zi, T(this)) || Yn(cg());
    };function Yn(a) {
      a = new Sg(a);return "signIn" === (a.a.a.get(D.lb) || null) && !!a.a.a.get(D.Va);
    }
    k.start = function (a, b) {
      Y(this);var c = this;"undefined" !== typeof this.f.languageCode && (this.A = this.f.languageCode);var d = "de".replace(/_/g, "-");this.f.languageCode = d;this.v.languageCode = d;this.s = !0;this.cb(b);var e = l.document;this.C ? this.C.then(function () {
        "complete" == e.readyState ? Zn(c, a) : Mf(window, "load", function () {
          Zn(c, a);
        });
      }) : "complete" == e.readyState ? Zn(c, a) : Mf(window, "load", function () {
        Zn(c, a);
      });
    };function Zn(a, b) {
      var c = bg(b);c.setAttribute("lang", "de".replace(/_/g, "-"));if (Xn) {
        var d = Xn;Y(d);Mi(T(d)) && Ce("UI Widget is already rendered on the page and is pending some user interaction. Only one widget instance can be rendered per page. The previous instance has been automatically reset.");Xn.reset();
      }Xn = a;a.K = c;$n(a, c);oi(new pi()) && oi(new qi()) ? wm(a, b) : (b = bg(b), c = new Ql(y("Ihr Browser unterst\u00fctzt Web Storage nicht. Bitte versuchen Sie es mit einem anderen Browser.").toString()), c.render(b), Z(a, c));F(zi, T(a));
    }function Vn(a, b) {
      if (a.w) return b(ao(a));W(a, function () {
        a.w = !1;
      });if (qg(S(a))) {
        var c = new Ve(function (c) {
          W(a, a.f.onAuthStateChanged(function (d) {
            a.h = d;a.w || (a.w = !0, c(b(ao(a))));
          }));
        });W(a, c);return c;
      }a.w = !0;return b(null);
    }function ao(a) {
      Y(a);return qg(S(a)) && a.h && a.h.isAnonymous ? a.h : null;
    }function W(a, b) {
      Y(a);if (b) {
        a.j.push(b);var c = function c() {
          Oa(a.j, function (a) {
            return a == b;
          });
        };"function" != typeof b && b.then(c, c);
      }
    }k.disableAutoSignIn = function () {
      Y(this);this.Y = !0;
    };function bo(a) {
      Y(a);var b;(b = a.Y) || (a = S(a), a = Eg(a, firebase.auth.GoogleAuthProvider.PROVIDER_ID), b = !(!a || "select_account" !== a.prompt));return b;
    }function cm(a) {
      "undefined" !== typeof a.f.languageCode && a.s && (a.s = !1, a.f.languageCode = a.A);
    }k.reset = function () {
      Y(this);var a = this;this.K && this.K.removeAttribute("lang");this.F && ch(this.F);cm(this);xm();F(zi, T(this));Y(this);this.O.cancel();this.i = A({ user: null, credential: null });Xn == this && (Xn = null);this.K = null;for (var b = 0; b < this.j.length; b++) {
        if ("function" == typeof this.j[b]) this.j[b]();else this.j[b].cancel && this.j[b].cancel();
      }this.j = [];Ni(T(this));this.a && (this.a.m(), this.a = null);this.I = null;this.v && (this.C = Gm(this).then(function () {
        a.C = null;
      }, function () {
        a.C = null;
      }));
    };function $n(a, b) {
      a.I = null;a.F = new dh(b);a.F.register();Lf(a.F, "pageEnter", function (b) {
        b = b && b.pageId;if (a.I != b) {
          var c = S(a);(c = Pg(c).uiChanged || null) && c(a.I, b);a.I = b;
        }
      });
    }k.cb = function (a) {
      Y(this);var b = this.W,
          c;for (c in a) {
        try {
          Hd(b.a, c, a[c]);
        } catch (d) {
          xe('Invalid config: "' + c + '"', void 0);
        }
      }sb && Hd(b.a, "popupMode", !1);Hg(b);!this.aa && Qg(S(this)) && (Ce("signInSuccess callback is deprecated. Please use signInSuccessWithAuthResult callback instead."), this.aa = !0);
    };function S(a) {
      Y(a);
      return a.W;
    }k.Jb = function () {
      Y(this);var a = S(this),
          b = Id(a.a, "widgetUrl");var c = og(a, b);S(this).a.get("popupMode") ? (a = (window.screen.availHeight - 600) / 2, b = (window.screen.availWidth - 500) / 2, c = c || "about:blank", a = { width: 500, height: 600, top: 0 < a ? a : 0, left: 0 < b ? b : 0, location: !0, resizable: !0, statusbar: !0, toolbar: !1 }, a.target = a.target || c.target || "google_popup", a.width = a.width || 690, a.height = a.height || 500, (a = Yf(c, a)) && a.focus()) : Zf(c);
    };function Y(a) {
      if (a.Z) throw Error("AuthUI instance is deleted!");
    }k.ub = function () {
      var a = this;Y(this);return this.v.app.delete().then(function () {
        var b = Sn(T(a));delete Tn[b];a.reset();a.Z = !0;
      });
    };function On(a) {
      Y(a);try {
        xh(a.O, zg(S(a)), bo(a)).then(function (b) {
          return a.a ? lm(a, a.a, b) : !1;
        });
      } catch (b) {}
    }k.vb = function (a, b) {
      Y(this);var c = this,
          d = eg();if (!Jg(S(this))) throw Error("Email link sign-in should be enabled to trigger email sending.");var e = Lg(S(this)),
          f = new Sg(e.url);Tg(f, d);b && b.a && (Si(d, b, T(this)), Wg(f, b.a.providerId));Ug(f, Kg(S(this)));return Vn(this, function (b) {
        b && ((b = b.uid) ? f.a.a.set(D.Ja, b) : Uc(f.a.a, D.Ja));e.url = f.toString();return X(c).sendSignInLinkToEmail(a, e);
      }).then(function () {
        var b = T(c),
            e = {};e.email = a;Gi(Di, ci(d, JSON.stringify(e)), b);
      }, function (a) {
        F(Ei, T(c));F(Di, T(c));throw a;
      });
    };function Ym(a, b) {
      var c = Vg(new Sg(b));if (!c) return A(null);b = new Ve(function (b, e) {
        var d = xn(a).onAuthStateChanged(function (a) {
          d();a && a.isAnonymous && a.uid === c ? b(a) : a && a.isAnonymous && a.uid !== c ? e(Error("anonymous-user-mismatch")) : e(Error("anonymous-user-not-found"));
        });W(a, d);
      });W(a, b);return b;
    }function bn(a, b, c, d, e) {
      Y(a);var f = e || null,
          g = firebase.auth.EmailAuthProvider.credentialWithLink(c, d);c = f ? X(a).signInWithEmailLink(c, d).then(function (a) {
        return a.user.linkWithCredential(f);
      }).then(function () {
        return Gm(a);
      }).then(function () {
        return Wn(a, { code: "auth/email-already-in-use" }, f);
      }) : X(a).fetchSignInMethodsForEmail(c).then(function (c) {
        return c.length ? Wn(a, { code: "auth/email-already-in-use" }, g) : b.linkWithCredential(g);
      });W(a, c);return c;
    }function cn(a, b, c, d) {
      Y(a);var e = d || null,
          f;b = X(a).signInWithEmailLink(b, c).then(function (a) {
        f = { user: a.user, credential: null, operationType: a.operationType, additionalUserInfo: a.additionalUserInfo };if (e) return a.user.linkWithCredential(e).then(function (a) {
          f = { user: a.user, credential: e, operationType: f.operationType, additionalUserInfo: a.additionalUserInfo };
        });
      }).then(function () {
        Gm(a);
      }).then(function () {
        return xn(a).updateCurrentUser(f.user);
      }).then(function () {
        f.user = xn(a).currentUser;return f;
      });W(a, b);return b;
    }function xm() {
      var a = cg();if (Yn(a)) {
        a = new Sg(a);for (var b in D) {
          D.hasOwnProperty(b) && Uc(a.a.a, D[b]);
        }b = { state: "signIn", mode: "emailLink", operation: "clear" };var c = l.document.title;l.history && l.history.replaceState && l.history.replaceState(b, c, a.toString());
      }
    }k.Ob = function (a, b) {
      Y(this);var c = this;return X(this).signInWithEmailAndPassword(a, b).then(function (d) {
        return Vn(c, function (e) {
          return e ? Gm(c).then(function () {
            return Wn(c, { code: "auth/email-already-in-use" }, firebase.auth.EmailAuthProvider.credential(a, b));
          }) : d;
        });
      });
    };k.Lb = function (a, b) {
      Y(this);var c = this;return Vn(this, function (d) {
        if (d) {
          var e = firebase.auth.EmailAuthProvider.credential(a, b);return d.linkWithCredential(e);
        }return X(c).createUserWithEmailAndPassword(a, b);
      });
    };k.Nb = function (a) {
      Y(this);var b = this;return Vn(this, function (c) {
        return c ? c.linkWithCredential(a).then(function (a) {
          return a;
        }, function (c) {
          if (c && "auth/email-already-in-use" == c.code && c.email && c.credential) throw c;return Wn(b, c, a);
        }) : X(b).signInWithCredential(a);
      });
    };function jm(a, b) {
      Y(a);return Vn(a, function (c) {
        return c && !Mi(T(a)) ? c.linkWithPopup(b).then(function (a) {
          return a;
        }, function (b) {
          if (b && "auth/email-already-in-use" == b.code && b.email && b.credential) throw b;return Wn(a, b);
        }) : X(a).signInWithPopup(b);
      });
    }k.Qb = function (a) {
      Y(this);var b = this,
          c = this.i;this.i = null;return Vn(this, function (c) {
        return c && !Mi(T(b)) ? c.linkWithRedirect(a) : X(b).signInWithRedirect(a);
      }).then(function () {}, function (a) {
        b.i = c;throw a;
      });
    };k.Pb = function (a, b) {
      Y(this);var c = this;return Vn(this, function (d) {
        return d ? d.linkWithPhoneNumber(a, b).then(function (a) {
          return new zh(a, function (a) {
            if ("auth/credential-already-in-use" == a.code) return Wn(c, a);throw a;
          });
        }) : xn(c).signInWithPhoneNumber(a, b).then(function (a) {
          return new zh(a);
        });
      });
    };k.Mb = function () {
      Y(this);return xn(this).signInAnonymously();
    };function em(a, b) {
      Y(a);return Vn(a, function (c) {
        if (a.h && !a.h.isAnonymous && qg(S(a)) && !X(a).currentUser) return Gm(a).then(function () {
          "password" == b.credential.providerId && (b.credential = null);return b;
        });if (c) return Gm(a).then(function () {
          return c.linkWithCredential(b.credential);
        }).then(function (a) {
          b.user = a.user;b.credential = a.credential;b.operationType = a.operationType;b.additionalUserInfo = a.additionalUserInfo;return b;
        }, function (c) {
          if (c && "auth/email-already-in-use" == c.code && c.email && c.credential) throw c;return Wn(a, c, b.credential);
        });if (!b.user) throw Error('Internal error: An incompatible or outdated version of "firebase.js" may be used.');return Gm(a).then(function () {
          return xn(a).updateCurrentUser(b.user);
        }).then(function () {
          b.user = xn(a).currentUser;b.operationType = "signIn";b.credential && b.credential.providerId && "password" == b.credential.providerId && (b.credential = null);return b;
        });
      });
    }k.Kb = function (a, b) {
      Y(this);return X(this).signInWithEmailAndPassword(a, b);
    };function Gm(a) {
      Y(a);return X(a).signOut();
    }function Wn(a, b, c) {
      Y(a);if (b && b.code && ("auth/email-already-in-use" == b.code || "auth/credential-already-in-use" == b.code)) {
        var d = tg(S(a));return A().then(function () {
          return d(new Dd("anonymous-upgrade-merge-conflict", null, c || b.credential));
        }).then(function () {
          a.a && (a.a.m(), a.a = null);throw b;
        });
      }return df(b);
    }ya("firebaseui.auth.AuthUI", Rn);ya("firebaseui.auth.AuthUI.getInstance", function (a) {
      a = Sn(a);
      return Tn[a] ? Tn[a] : null;
    });ya("firebaseui.auth.AuthUI.prototype.disableAutoSignIn", Rn.prototype.disableAutoSignIn);ya("firebaseui.auth.AuthUI.prototype.start", Rn.prototype.start);ya("firebaseui.auth.AuthUI.prototype.setConfig", Rn.prototype.cb);ya("firebaseui.auth.AuthUI.prototype.signIn", Rn.prototype.Jb);ya("firebaseui.auth.AuthUI.prototype.reset", Rn.prototype.reset);ya("firebaseui.auth.AuthUI.prototype.delete", Rn.prototype.ub);ya("firebaseui.auth.AuthUI.prototype.isPendingRedirect", Rn.prototype.gb);
    ya("firebaseui.auth.AuthUIError", Dd);ya("firebaseui.auth.AuthUIError.prototype.toJSON", Dd.prototype.toJSON);ya("firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM", gg);ya("firebaseui.auth.CredentialHelper.GOOGLE_YOLO", "googleyolo");ya("firebaseui.auth.CredentialHelper.NONE", "none");ya("firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID", "anonymous");
  })();
})();
//# sourceMappingURL=firebaseui__de.js.map