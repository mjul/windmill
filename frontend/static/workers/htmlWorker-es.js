var rs = Object.defineProperty;
var as = (e, t, n) => t in e ? rs(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var wt = (e, t, n) => (as(e, typeof t != "symbol" ? t + "" : t, n), n);
class ss {
  constructor() {
    this.listeners = [], this.unexpectedErrorHandler = function(t) {
      setTimeout(() => {
        throw t.stack ? pt.isErrorNoTelemetry(t) ? new pt(t.message + `

` + t.stack) : new Error(t.message + `

` + t.stack) : t;
      }, 0);
    };
  }
  emit(t) {
    this.listeners.forEach((n) => {
      n(t);
    });
  }
  onUnexpectedError(t) {
    this.unexpectedErrorHandler(t), this.emit(t);
  }
  // For external errors, we don't want the listeners to be called
  onUnexpectedExternalError(t) {
    this.unexpectedErrorHandler(t);
  }
}
const os = new ss();
function Ma(e) {
  ls(e) || os.onUnexpectedError(e);
}
function bi(e) {
  if (e instanceof Error) {
    const { name: t, message: n } = e, i = e.stacktrace || e.stack;
    return {
      $isError: !0,
      name: t,
      message: n,
      stack: i,
      noTelemetry: pt.isErrorNoTelemetry(e)
    };
  }
  return e;
}
const En = "Canceled";
function ls(e) {
  return e instanceof us ? !0 : e instanceof Error && e.name === En && e.message === En;
}
class us extends Error {
  constructor() {
    super(En), this.name = this.message;
  }
}
class pt extends Error {
  constructor(t) {
    super(t), this.name = "CodeExpectedError";
  }
  static fromError(t) {
    if (t instanceof pt)
      return t;
    const n = new pt();
    return n.message = t.message, n.stack = t.stack, n;
  }
  static isErrorNoTelemetry(t) {
    return t.name === "CodeExpectedError";
  }
}
class $e extends Error {
  constructor(t) {
    super(t || "An unexpected bug occurred."), Object.setPrototypeOf(this, $e.prototype);
  }
}
function cs(e) {
  const t = this;
  let n = !1, i;
  return function() {
    return n || (n = !0, i = e.apply(t, arguments)), i;
  };
}
var Zt;
(function(e) {
  function t(v) {
    return v && typeof v == "object" && typeof v[Symbol.iterator] == "function";
  }
  e.is = t;
  const n = Object.freeze([]);
  function i() {
    return n;
  }
  e.empty = i;
  function* r(v) {
    yield v;
  }
  e.single = r;
  function a(v) {
    return t(v) ? v : r(v);
  }
  e.wrap = a;
  function s(v) {
    return v || n;
  }
  e.from = s;
  function* l(v) {
    for (let x = v.length - 1; x >= 0; x--)
      yield v[x];
  }
  e.reverse = l;
  function o(v) {
    return !v || v[Symbol.iterator]().next().done === !0;
  }
  e.isEmpty = o;
  function u(v) {
    return v[Symbol.iterator]().next().value;
  }
  e.first = u;
  function c(v, x) {
    for (const E of v)
      if (x(E))
        return !0;
    return !1;
  }
  e.some = c;
  function h(v, x) {
    for (const E of v)
      if (x(E))
        return E;
  }
  e.find = h;
  function* m(v, x) {
    for (const E of v)
      x(E) && (yield E);
  }
  e.filter = m;
  function* f(v, x) {
    let E = 0;
    for (const I of v)
      yield x(I, E++);
  }
  e.map = f;
  function* g(...v) {
    for (const x of v)
      for (const E of x)
        yield E;
  }
  e.concat = g;
  function p(v, x, E) {
    let I = E;
    for (const B of v)
      I = x(I, B);
    return I;
  }
  e.reduce = p;
  function* w(v, x, E = v.length) {
    for (x < 0 && (x += v.length), E < 0 ? E += v.length : E > v.length && (E = v.length); x < E; x++)
      yield v[x];
  }
  e.slice = w;
  function y(v, x = Number.POSITIVE_INFINITY) {
    const E = [];
    if (x === 0)
      return [E, v];
    const I = v[Symbol.iterator]();
    for (let B = 0; B < x; B++) {
      const _ = I.next();
      if (_.done)
        return [E, e.empty()];
      E.push(_.value);
    }
    return [E, { [Symbol.iterator]() {
      return I;
    } }];
  }
  e.consume = y;
})(Zt || (Zt = {}));
function Ra(e) {
  if (Zt.is(e)) {
    const t = [];
    for (const n of e)
      if (n)
        try {
          n.dispose();
        } catch (i) {
          t.push(i);
        }
    if (t.length === 1)
      throw t[0];
    if (t.length > 1)
      throw new AggregateError(t, "Encountered errors while disposing of store");
    return Array.isArray(e) ? [] : e;
  } else if (e)
    return e.dispose(), e;
}
function hs(...e) {
  return Ct(() => Ra(e));
}
function Ct(e) {
  return {
    dispose: cs(() => {
      e();
    })
  };
}
class _t {
  constructor() {
    this._toDispose = /* @__PURE__ */ new Set(), this._isDisposed = !1;
  }
  /**
   * Dispose of all registered disposables and mark this object as disposed.
   *
   * Any future disposables added to this object will be disposed of on `add`.
   */
  dispose() {
    this._isDisposed || (this._isDisposed = !0, this.clear());
  }
  /**
   * @return `true` if this object has been disposed of.
   */
  get isDisposed() {
    return this._isDisposed;
  }
  /**
   * Dispose of all registered disposables but do not mark this object as disposed.
   */
  clear() {
    if (this._toDispose.size !== 0)
      try {
        Ra(this._toDispose);
      } finally {
        this._toDispose.clear();
      }
  }
  /**
   * Add a new {@link IDisposable disposable} to the collection.
   */
  add(t) {
    if (!t)
      return t;
    if (t === this)
      throw new Error("Cannot register a disposable on itself!");
    return this._isDisposed ? _t.DISABLE_DISPOSED_WARNING || console.warn(new Error("Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!").stack) : this._toDispose.add(t), t;
  }
  /**
   * Deletes the value from the store, but does not dispose it.
   */
  deleteAndLeak(t) {
    t && this._toDispose.has(t) && this._toDispose.delete(t);
  }
}
_t.DISABLE_DISPOSED_WARNING = !1;
class Et {
  constructor() {
    this._store = new _t(), this._store;
  }
  dispose() {
    this._store.dispose();
  }
  /**
   * Adds `o` to the collection of disposables managed by this object.
   */
  _register(t) {
    if (t === this)
      throw new Error("Cannot register a disposable on itself!");
    return this._store.add(t);
  }
}
Et.None = Object.freeze({ dispose() {
} });
let te = class Mn {
  constructor(t) {
    this.element = t, this.next = Mn.Undefined, this.prev = Mn.Undefined;
  }
};
te.Undefined = new te(void 0);
class ds {
  constructor() {
    this._first = te.Undefined, this._last = te.Undefined, this._size = 0;
  }
  get size() {
    return this._size;
  }
  isEmpty() {
    return this._first === te.Undefined;
  }
  clear() {
    let t = this._first;
    for (; t !== te.Undefined; ) {
      const n = t.next;
      t.prev = te.Undefined, t.next = te.Undefined, t = n;
    }
    this._first = te.Undefined, this._last = te.Undefined, this._size = 0;
  }
  unshift(t) {
    return this._insert(t, !1);
  }
  push(t) {
    return this._insert(t, !0);
  }
  _insert(t, n) {
    const i = new te(t);
    if (this._first === te.Undefined)
      this._first = i, this._last = i;
    else if (n) {
      const a = this._last;
      this._last = i, i.prev = a, a.next = i;
    } else {
      const a = this._first;
      this._first = i, i.next = a, a.prev = i;
    }
    this._size += 1;
    let r = !1;
    return () => {
      r || (r = !0, this._remove(i));
    };
  }
  shift() {
    if (this._first !== te.Undefined) {
      const t = this._first.element;
      return this._remove(this._first), t;
    }
  }
  pop() {
    if (this._last !== te.Undefined) {
      const t = this._last.element;
      return this._remove(this._last), t;
    }
  }
  _remove(t) {
    if (t.prev !== te.Undefined && t.next !== te.Undefined) {
      const n = t.prev;
      n.next = t.next, t.next.prev = n;
    } else
      t.prev === te.Undefined && t.next === te.Undefined ? (this._first = te.Undefined, this._last = te.Undefined) : t.next === te.Undefined ? (this._last = this._last.prev, this._last.next = te.Undefined) : t.prev === te.Undefined && (this._first = this._first.next, this._first.prev = te.Undefined);
    this._size -= 1;
  }
  *[Symbol.iterator]() {
    let t = this._first;
    for (; t !== te.Undefined; )
      yield t.element, t = t.next;
  }
}
const ms = globalThis.performance && typeof globalThis.performance.now == "function";
class _n {
  static create(t) {
    return new _n(t);
  }
  constructor(t) {
    this._now = ms && t === !1 ? Date.now : globalThis.performance.now.bind(globalThis.performance), this._startTime = this._now(), this._stopTime = -1;
  }
  stop() {
    this._stopTime = this._now();
  }
  elapsed() {
    return this._stopTime !== -1 ? this._stopTime - this._startTime : this._now() - this._startTime;
  }
}
var Rn;
(function(e) {
  e.None = () => Et.None;
  function t(S, L) {
    return h(S, () => {
    }, 0, void 0, !0, void 0, L);
  }
  e.defer = t;
  function n(S) {
    return (L, M = null, D) => {
      let H = !1, A;
      return A = S((k) => {
        if (!H)
          return A ? A.dispose() : H = !0, L.call(M, k);
      }, null, D), H && A.dispose(), A;
    };
  }
  e.once = n;
  function i(S, L, M) {
    return u((D, H = null, A) => S((k) => D.call(H, L(k)), null, A), M);
  }
  e.map = i;
  function r(S, L, M) {
    return u((D, H = null, A) => S((k) => {
      L(k), D.call(H, k);
    }, null, A), M);
  }
  e.forEach = r;
  function a(S, L, M) {
    return u((D, H = null, A) => S((k) => L(k) && D.call(H, k), null, A), M);
  }
  e.filter = a;
  function s(S) {
    return S;
  }
  e.signal = s;
  function l(...S) {
    return (L, M = null, D) => {
      const H = hs(...S.map((A) => A((k) => L.call(M, k))));
      return c(H, D);
    };
  }
  e.any = l;
  function o(S, L, M, D) {
    let H = M;
    return i(S, (A) => (H = L(H, A), H), D);
  }
  e.reduce = o;
  function u(S, L) {
    let M;
    const D = {
      onWillAddFirstListener() {
        M = S(H.fire, H);
      },
      onDidRemoveLastListener() {
        M == null || M.dispose();
      }
    }, H = new Le(D);
    return L == null || L.add(H), H.event;
  }
  function c(S, L) {
    return L instanceof Array ? L.push(S) : L && L.add(S), S;
  }
  function h(S, L, M = 100, D = !1, H = !1, A, k) {
    let R, U, N, z = 0, P;
    const J = {
      leakWarningThreshold: A,
      onWillAddFirstListener() {
        R = S((X) => {
          z++, U = L(U, X), D && !N && ($.fire(U), U = void 0), P = () => {
            const Z = U;
            U = void 0, N = void 0, (!D || z > 1) && $.fire(Z), z = 0;
          }, typeof M == "number" ? (clearTimeout(N), N = setTimeout(P, M)) : N === void 0 && (N = 0, queueMicrotask(P));
        });
      },
      onWillRemoveListener() {
        H && z > 0 && (P == null || P());
      },
      onDidRemoveLastListener() {
        P = void 0, R.dispose();
      }
    }, $ = new Le(J);
    return k == null || k.add($), $.event;
  }
  e.debounce = h;
  function m(S, L = 0, M) {
    return e.debounce(S, (D, H) => D ? (D.push(H), D) : [H], L, void 0, !0, void 0, M);
  }
  e.accumulate = m;
  function f(S, L = (D, H) => D === H, M) {
    let D = !0, H;
    return a(S, (A) => {
      const k = D || !L(A, H);
      return D = !1, H = A, k;
    }, M);
  }
  e.latch = f;
  function g(S, L, M) {
    return [
      e.filter(S, L, M),
      e.filter(S, (D) => !L(D), M)
    ];
  }
  e.split = g;
  function p(S, L = !1, M = [], D) {
    let H = M.slice(), A = S((U) => {
      H ? H.push(U) : R.fire(U);
    });
    D && D.add(A);
    const k = () => {
      H == null || H.forEach((U) => R.fire(U)), H = null;
    }, R = new Le({
      onWillAddFirstListener() {
        A || (A = S((U) => R.fire(U)), D && D.add(A));
      },
      onDidAddFirstListener() {
        H && (L ? setTimeout(k) : k());
      },
      onDidRemoveLastListener() {
        A && A.dispose(), A = null;
      }
    });
    return D && D.add(R), R.event;
  }
  e.buffer = p;
  function w(S, L) {
    return (D, H, A) => {
      const k = L(new v());
      return S(function(R) {
        const U = k.evaluate(R);
        U !== y && D.call(H, U);
      }, void 0, A);
    };
  }
  e.chain = w;
  const y = Symbol("HaltChainable");
  class v {
    constructor() {
      this.steps = [];
    }
    map(L) {
      return this.steps.push(L), this;
    }
    forEach(L) {
      return this.steps.push((M) => (L(M), M)), this;
    }
    filter(L) {
      return this.steps.push((M) => L(M) ? M : y), this;
    }
    reduce(L, M) {
      let D = M;
      return this.steps.push((H) => (D = L(D, H), D)), this;
    }
    latch(L = (M, D) => M === D) {
      let M = !0, D;
      return this.steps.push((H) => {
        const A = M || !L(H, D);
        return M = !1, D = H, A ? H : y;
      }), this;
    }
    evaluate(L) {
      for (const M of this.steps)
        if (L = M(L), L === y)
          break;
      return L;
    }
  }
  function x(S, L, M = (D) => D) {
    const D = (...R) => k.fire(M(...R)), H = () => S.on(L, D), A = () => S.removeListener(L, D), k = new Le({ onWillAddFirstListener: H, onDidRemoveLastListener: A });
    return k.event;
  }
  e.fromNodeEventEmitter = x;
  function E(S, L, M = (D) => D) {
    const D = (...R) => k.fire(M(...R)), H = () => S.addEventListener(L, D), A = () => S.removeEventListener(L, D), k = new Le({ onWillAddFirstListener: H, onDidRemoveLastListener: A });
    return k.event;
  }
  e.fromDOMEventEmitter = E;
  function I(S) {
    return new Promise((L) => n(S)(L));
  }
  e.toPromise = I;
  function B(S) {
    const L = new Le();
    return S.then((M) => {
      L.fire(M);
    }, () => {
      L.fire(void 0);
    }).finally(() => {
      L.dispose();
    }), L.event;
  }
  e.fromPromise = B;
  function _(S, L) {
    return L(void 0), S((M) => L(M));
  }
  e.runAndSubscribe = _;
  function b(S, L) {
    let M = null;
    function D(A) {
      M == null || M.dispose(), M = new _t(), L(A, M);
    }
    D(void 0);
    const H = S((A) => D(A));
    return Ct(() => {
      H.dispose(), M == null || M.dispose();
    });
  }
  e.runAndSubscribeWithStore = b;
  class T {
    constructor(L, M) {
      this._observable = L, this._counter = 0, this._hasChanged = !1;
      const D = {
        onWillAddFirstListener: () => {
          L.addObserver(this);
        },
        onDidRemoveLastListener: () => {
          L.removeObserver(this);
        }
      };
      this.emitter = new Le(D), M && M.add(this.emitter);
    }
    beginUpdate(L) {
      this._counter++;
    }
    handlePossibleChange(L) {
    }
    handleChange(L, M) {
      this._hasChanged = !0;
    }
    endUpdate(L) {
      this._counter--, this._counter === 0 && (this._observable.reportChanges(), this._hasChanged && (this._hasChanged = !1, this.emitter.fire(this._observable.get())));
    }
  }
  function q(S, L) {
    return new T(S, L).emitter.event;
  }
  e.fromObservable = q;
  function F(S) {
    return (L) => {
      let M = 0, D = !1;
      const H = {
        beginUpdate() {
          M++;
        },
        endUpdate() {
          M--, M === 0 && (S.reportChanges(), D && (D = !1, L()));
        },
        handlePossibleChange() {
        },
        handleChange() {
          D = !0;
        }
      };
      return S.addObserver(H), S.reportChanges(), {
        dispose() {
          S.removeObserver(H);
        }
      };
    };
  }
  e.fromObservableLight = F;
})(Rn || (Rn = {}));
class gt {
  constructor(t) {
    this.listenerCount = 0, this.invocationCount = 0, this.elapsedOverall = 0, this.durations = [], this.name = `${t}_${gt._idPool++}`, gt.all.add(this);
  }
  start(t) {
    this._stopWatch = new _n(), this.listenerCount = t;
  }
  stop() {
    if (this._stopWatch) {
      const t = this._stopWatch.elapsed();
      this.durations.push(t), this.elapsedOverall += t, this.invocationCount += 1, this._stopWatch = void 0;
    }
  }
}
gt.all = /* @__PURE__ */ new Set();
gt._idPool = 0;
let fs = -1;
class ps {
  constructor(t, n = Math.random().toString(18).slice(2, 5)) {
    this.threshold = t, this.name = n, this._warnCountdown = 0;
  }
  dispose() {
    var t;
    (t = this._stacks) === null || t === void 0 || t.clear();
  }
  check(t, n) {
    const i = this.threshold;
    if (i <= 0 || n < i)
      return;
    this._stacks || (this._stacks = /* @__PURE__ */ new Map());
    const r = this._stacks.get(t.value) || 0;
    if (this._stacks.set(t.value, r + 1), this._warnCountdown -= 1, this._warnCountdown <= 0) {
      this._warnCountdown = i * 0.5;
      let a, s = 0;
      for (const [l, o] of this._stacks)
        (!a || s < o) && (a = l, s = o);
      console.warn(`[${this.name}] potential listener LEAK detected, having ${n} listeners already. MOST frequent listener (${s}):`), console.warn(a);
    }
    return () => {
      const a = this._stacks.get(t.value) || 0;
      this._stacks.set(t.value, a - 1);
    };
  }
}
class oi {
  static create() {
    var t;
    return new oi((t = new Error().stack) !== null && t !== void 0 ? t : "");
  }
  constructor(t) {
    this.value = t;
  }
  print() {
    console.warn(this.value.split(`
`).slice(2).join(`
`));
  }
}
class wn {
  constructor(t) {
    this.value = t;
  }
}
const gs = 2;
class Le {
  constructor(t) {
    var n, i, r, a, s;
    this._size = 0, this._options = t, this._leakageMon = !((n = this._options) === null || n === void 0) && n.leakWarningThreshold ? new ps((r = (i = this._options) === null || i === void 0 ? void 0 : i.leakWarningThreshold) !== null && r !== void 0 ? r : fs) : void 0, this._perfMon = !((a = this._options) === null || a === void 0) && a._profName ? new gt(this._options._profName) : void 0, this._deliveryQueue = (s = this._options) === null || s === void 0 ? void 0 : s.deliveryQueue;
  }
  dispose() {
    var t, n, i, r;
    this._disposed || (this._disposed = !0, ((t = this._deliveryQueue) === null || t === void 0 ? void 0 : t.current) === this && this._deliveryQueue.reset(), this._listeners && (this._listeners = void 0, this._size = 0), (i = (n = this._options) === null || n === void 0 ? void 0 : n.onDidRemoveLastListener) === null || i === void 0 || i.call(n), (r = this._leakageMon) === null || r === void 0 || r.dispose());
  }
  /**
   * For the public to allow to subscribe
   * to events from this Emitter
   */
  get event() {
    var t;
    return (t = this._event) !== null && t !== void 0 || (this._event = (n, i, r) => {
      var a, s, l, o, u;
      if (this._leakageMon && this._size > this._leakageMon.threshold * 3)
        return console.warn(`[${this._leakageMon.name}] REFUSES to accept new listeners because it exceeded its threshold by far`), Et.None;
      if (this._disposed)
        return Et.None;
      i && (n = n.bind(i));
      const c = new wn(n);
      let h;
      this._leakageMon && this._size >= Math.ceil(this._leakageMon.threshold * 0.2) && (c.stack = oi.create(), h = this._leakageMon.check(c.stack, this._size + 1)), this._listeners ? this._listeners instanceof wn ? ((u = this._deliveryQueue) !== null && u !== void 0 || (this._deliveryQueue = new bs()), this._listeners = [this._listeners, c]) : this._listeners.push(c) : ((s = (a = this._options) === null || a === void 0 ? void 0 : a.onWillAddFirstListener) === null || s === void 0 || s.call(a, this), this._listeners = c, (o = (l = this._options) === null || l === void 0 ? void 0 : l.onDidAddFirstListener) === null || o === void 0 || o.call(l, this)), this._size++;
      const m = Ct(() => {
        h == null || h(), this._removeListener(c);
      });
      return r instanceof _t ? r.add(m) : Array.isArray(r) && r.push(m), m;
    }), this._event;
  }
  _removeListener(t) {
    var n, i, r, a;
    if ((i = (n = this._options) === null || n === void 0 ? void 0 : n.onWillRemoveListener) === null || i === void 0 || i.call(n, this), !this._listeners)
      return;
    if (this._size === 1) {
      this._listeners = void 0, (a = (r = this._options) === null || r === void 0 ? void 0 : r.onDidRemoveLastListener) === null || a === void 0 || a.call(r, this), this._size = 0;
      return;
    }
    const s = this._listeners, l = s.indexOf(t);
    if (l === -1)
      throw console.log("disposed?", this._disposed), console.log("size?", this._size), console.log("arr?", JSON.stringify(this._listeners)), new Error("Attempted to dispose unknown listener");
    this._size--, s[l] = void 0;
    const o = this._deliveryQueue.current === this;
    if (this._size * gs <= s.length) {
      let u = 0;
      for (let c = 0; c < s.length; c++)
        s[c] ? s[u++] = s[c] : o && (this._deliveryQueue.end--, u < this._deliveryQueue.i && this._deliveryQueue.i--);
      s.length = u;
    }
  }
  _deliver(t, n) {
    var i;
    if (!t)
      return;
    const r = ((i = this._options) === null || i === void 0 ? void 0 : i.onListenerError) || Ma;
    if (!r) {
      t.value(n);
      return;
    }
    try {
      t.value(n);
    } catch (a) {
      r(a);
    }
  }
  /** Delivers items in the queue. Assumes the queue is ready to go. */
  _deliverQueue(t) {
    const n = t.current._listeners;
    for (; t.i < t.end; )
      this._deliver(n[t.i++], t.value);
    t.reset();
  }
  /**
   * To be kept private to fire an event to
   * subscribers
   */
  fire(t) {
    var n, i, r, a;
    if (!((n = this._deliveryQueue) === null || n === void 0) && n.current && (this._deliverQueue(this._deliveryQueue), (i = this._perfMon) === null || i === void 0 || i.stop()), (r = this._perfMon) === null || r === void 0 || r.start(this._size), this._listeners)
      if (this._listeners instanceof wn)
        this._deliver(this._listeners, t);
      else {
        const s = this._deliveryQueue;
        s.enqueue(this, t, this._listeners.length), this._deliverQueue(s);
      }
    (a = this._perfMon) === null || a === void 0 || a.stop();
  }
  hasListeners() {
    return this._size > 0;
  }
}
class bs {
  constructor() {
    this.i = -1, this.end = 0;
  }
  enqueue(t, n, i) {
    this.i = 0, this.end = i, this.current = t, this.value = n;
  }
  reset() {
    this.i = this.end, this.current = void 0, this.value = void 0;
  }
}
function vs(e) {
  return typeof e == "string";
}
function _s(e) {
  let t = [];
  for (; Object.prototype !== e; )
    t = t.concat(Object.getOwnPropertyNames(e)), e = Object.getPrototypeOf(e);
  return t;
}
function Dn(e) {
  const t = [];
  for (const n of _s(e))
    typeof e[n] == "function" && t.push(n);
  return t;
}
function ws(e, t) {
  const n = (r) => function() {
    const a = Array.prototype.slice.call(arguments, 0);
    return t(r, a);
  }, i = {};
  for (const r of e)
    i[r] = n(r);
  return i;
}
globalThis && globalThis.__awaiter;
let ys = typeof document < "u" && document.location && document.location.hash.indexOf("pseudo=true") >= 0;
function Ts(e, t) {
  let n;
  return t.length === 0 ? n = e : n = e.replace(/\{(\d+)\}/g, (i, r) => {
    const a = r[0], s = t[a];
    let l = i;
    return typeof s == "string" ? l = s : (typeof s == "number" || typeof s == "boolean" || s === void 0 || s === null) && (l = String(s)), l;
  }), ys && (n = "［" + n.replace(/[aouei]/g, "$&$&") + "］"), n;
}
function ee(e, t, ...n) {
  return Ts(t, n);
}
var yn;
const ct = "en";
let Nn = !1, In = !1, Tn = !1, Da = !1, qt, xn = ct, vi = ct, xs, Ae;
const Me = typeof self == "object" ? self : typeof global == "object" ? global : {};
let he;
typeof Me.vscode < "u" && typeof Me.vscode.process < "u" ? he = Me.vscode.process : typeof process < "u" && (he = process);
const ks = typeof ((yn = he == null ? void 0 : he.versions) === null || yn === void 0 ? void 0 : yn.electron) == "string", As = ks && (he == null ? void 0 : he.type) === "renderer";
if (typeof navigator == "object" && !As)
  Ae = navigator.userAgent, Nn = Ae.indexOf("Windows") >= 0, In = Ae.indexOf("Macintosh") >= 0, (Ae.indexOf("Macintosh") >= 0 || Ae.indexOf("iPad") >= 0 || Ae.indexOf("iPhone") >= 0) && navigator.maxTouchPoints && navigator.maxTouchPoints > 0, Tn = Ae.indexOf("Linux") >= 0, (Ae == null ? void 0 : Ae.indexOf("Mobi")) >= 0, Da = !0, // This call _must_ be done in the file that calls `nls.getConfiguredDefaultLocale`
  // to ensure that the NLS AMD Loader plugin has been loaded and configured.
  // This is because the loader plugin decides what the default locale is based on
  // how it's able to resolve the strings.
  ee({ key: "ensureLoaderPluginIsLoaded", comment: ["{Locked}"] }, "_"), qt = ct, xn = qt, vi = navigator.language;
else if (typeof he == "object") {
  Nn = he.platform === "win32", In = he.platform === "darwin", Tn = he.platform === "linux", Tn && he.env.SNAP && he.env.SNAP_REVISION, he.env.CI || he.env.BUILD_ARTIFACTSTAGINGDIRECTORY, qt = ct, xn = ct;
  const e = he.env.VSCODE_NLS_CONFIG;
  if (e)
    try {
      const t = JSON.parse(e), n = t.availableLanguages["*"];
      qt = t.locale, vi = t.osLocale, xn = n || ct, xs = t._translationsConfigFile;
    } catch {
    }
} else
  console.error("Unable to resolve platform.");
const Mt = Nn, Ss = In;
Da && Me.importScripts;
const ze = Ae, Ls = typeof Me.postMessage == "function" && !Me.importScripts;
(() => {
  if (Ls) {
    const e = [];
    Me.addEventListener("message", (n) => {
      if (n.data && n.data.vscodeScheduleAsyncWork)
        for (let i = 0, r = e.length; i < r; i++) {
          const a = e[i];
          if (a.id === n.data.vscodeScheduleAsyncWork) {
            e.splice(i, 1), a.callback();
            return;
          }
        }
    });
    let t = 0;
    return (n) => {
      const i = ++t;
      e.push({
        id: i,
        callback: n
      }), Me.postMessage({ vscodeScheduleAsyncWork: i }, "*");
    };
  }
  return (e) => setTimeout(e);
})();
const Cs = !!(ze && ze.indexOf("Chrome") >= 0);
ze && ze.indexOf("Firefox") >= 0;
!Cs && ze && ze.indexOf("Safari") >= 0;
ze && ze.indexOf("Edg/") >= 0;
ze && ze.indexOf("Android") >= 0;
class Es {
  constructor(t) {
    this.fn = t, this.lastCache = void 0, this.lastArgKey = void 0;
  }
  get(t) {
    const n = JSON.stringify(t);
    return this.lastArgKey !== n && (this.lastArgKey = n, this.lastCache = this.fn(t)), this.lastCache;
  }
}
class Na {
  constructor(t) {
    this.executor = t, this._didRun = !1;
  }
  /**
   * Get the wrapped value.
   *
   * This will force evaluation of the lazy value if it has not been resolved yet. Lazy values are only
   * resolved once. `getValue` will re-throw exceptions that are hit while resolving the value
   */
  get value() {
    if (!this._didRun)
      try {
        this._value = this.executor();
      } catch (t) {
        this._error = t;
      } finally {
        this._didRun = !0;
      }
    if (this._error)
      throw this._error;
    return this._value;
  }
  /**
   * Get the wrapped value without forcing evaluation.
   */
  get rawValue() {
    return this._value;
  }
}
var bt;
function Ms(e) {
  return e.replace(/[\\\{\}\*\+\?\|\^\$\.\[\]\(\)]/g, "\\$&");
}
function Rs(e) {
  return e.split(/\r\n|\r|\n/);
}
function Ds(e) {
  for (let t = 0, n = e.length; t < n; t++) {
    const i = e.charCodeAt(t);
    if (i !== 32 && i !== 9)
      return t;
  }
  return -1;
}
function Ns(e, t = e.length - 1) {
  for (let n = t; n >= 0; n--) {
    const i = e.charCodeAt(n);
    if (i !== 32 && i !== 9)
      return n;
  }
  return -1;
}
function Ia(e) {
  return e >= 65 && e <= 90;
}
function zn(e) {
  return 55296 <= e && e <= 56319;
}
function Is(e) {
  return 56320 <= e && e <= 57343;
}
function zs(e, t) {
  return (e - 55296 << 10) + (t - 56320) + 65536;
}
function Us(e, t, n) {
  const i = e.charCodeAt(n);
  if (zn(i) && n + 1 < t) {
    const r = e.charCodeAt(n + 1);
    if (Is(r))
      return zs(i, r);
  }
  return i;
}
const Hs = /^[\t\n\r\x20-\x7E]*$/;
function Ws(e) {
  return Hs.test(e);
}
class rt {
  static getInstance(t) {
    return bt.cache.get(Array.from(t));
  }
  static getLocales() {
    return bt._locales.value;
  }
  constructor(t) {
    this.confusableDictionary = t;
  }
  isAmbiguous(t) {
    return this.confusableDictionary.has(t);
  }
  /**
   * Returns the non basic ASCII code point that the given code point can be confused,
   * or undefined if such code point does note exist.
   */
  getPrimaryConfusable(t) {
    return this.confusableDictionary.get(t);
  }
  getConfusableCodePoints() {
    return new Set(this.confusableDictionary.keys());
  }
}
bt = rt;
rt.ambiguousCharacterData = new Na(() => JSON.parse('{"_common":[8232,32,8233,32,5760,32,8192,32,8193,32,8194,32,8195,32,8196,32,8197,32,8198,32,8200,32,8201,32,8202,32,8287,32,8199,32,8239,32,2042,95,65101,95,65102,95,65103,95,8208,45,8209,45,8210,45,65112,45,1748,45,8259,45,727,45,8722,45,10134,45,11450,45,1549,44,1643,44,8218,44,184,44,42233,44,894,59,2307,58,2691,58,1417,58,1795,58,1796,58,5868,58,65072,58,6147,58,6153,58,8282,58,1475,58,760,58,42889,58,8758,58,720,58,42237,58,451,33,11601,33,660,63,577,63,2429,63,5038,63,42731,63,119149,46,8228,46,1793,46,1794,46,42510,46,68176,46,1632,46,1776,46,42232,46,1373,96,65287,96,8219,96,8242,96,1370,96,1523,96,8175,96,65344,96,900,96,8189,96,8125,96,8127,96,8190,96,697,96,884,96,712,96,714,96,715,96,756,96,699,96,701,96,700,96,702,96,42892,96,1497,96,2036,96,2037,96,5194,96,5836,96,94033,96,94034,96,65339,91,10088,40,10098,40,12308,40,64830,40,65341,93,10089,41,10099,41,12309,41,64831,41,10100,123,119060,123,10101,125,65342,94,8270,42,1645,42,8727,42,66335,42,5941,47,8257,47,8725,47,8260,47,9585,47,10187,47,10744,47,119354,47,12755,47,12339,47,11462,47,20031,47,12035,47,65340,92,65128,92,8726,92,10189,92,10741,92,10745,92,119311,92,119355,92,12756,92,20022,92,12034,92,42872,38,708,94,710,94,5869,43,10133,43,66203,43,8249,60,10094,60,706,60,119350,60,5176,60,5810,60,5120,61,11840,61,12448,61,42239,61,8250,62,10095,62,707,62,119351,62,5171,62,94015,62,8275,126,732,126,8128,126,8764,126,65372,124,65293,45,120784,50,120794,50,120804,50,120814,50,120824,50,130034,50,42842,50,423,50,1000,50,42564,50,5311,50,42735,50,119302,51,120785,51,120795,51,120805,51,120815,51,120825,51,130035,51,42923,51,540,51,439,51,42858,51,11468,51,1248,51,94011,51,71882,51,120786,52,120796,52,120806,52,120816,52,120826,52,130036,52,5070,52,71855,52,120787,53,120797,53,120807,53,120817,53,120827,53,130037,53,444,53,71867,53,120788,54,120798,54,120808,54,120818,54,120828,54,130038,54,11474,54,5102,54,71893,54,119314,55,120789,55,120799,55,120809,55,120819,55,120829,55,130039,55,66770,55,71878,55,2819,56,2538,56,2666,56,125131,56,120790,56,120800,56,120810,56,120820,56,120830,56,130040,56,547,56,546,56,66330,56,2663,57,2920,57,2541,57,3437,57,120791,57,120801,57,120811,57,120821,57,120831,57,130041,57,42862,57,11466,57,71884,57,71852,57,71894,57,9082,97,65345,97,119834,97,119886,97,119938,97,119990,97,120042,97,120094,97,120146,97,120198,97,120250,97,120302,97,120354,97,120406,97,120458,97,593,97,945,97,120514,97,120572,97,120630,97,120688,97,120746,97,65313,65,119808,65,119860,65,119912,65,119964,65,120016,65,120068,65,120120,65,120172,65,120224,65,120276,65,120328,65,120380,65,120432,65,913,65,120488,65,120546,65,120604,65,120662,65,120720,65,5034,65,5573,65,42222,65,94016,65,66208,65,119835,98,119887,98,119939,98,119991,98,120043,98,120095,98,120147,98,120199,98,120251,98,120303,98,120355,98,120407,98,120459,98,388,98,5071,98,5234,98,5551,98,65314,66,8492,66,119809,66,119861,66,119913,66,120017,66,120069,66,120121,66,120173,66,120225,66,120277,66,120329,66,120381,66,120433,66,42932,66,914,66,120489,66,120547,66,120605,66,120663,66,120721,66,5108,66,5623,66,42192,66,66178,66,66209,66,66305,66,65347,99,8573,99,119836,99,119888,99,119940,99,119992,99,120044,99,120096,99,120148,99,120200,99,120252,99,120304,99,120356,99,120408,99,120460,99,7428,99,1010,99,11429,99,43951,99,66621,99,128844,67,71922,67,71913,67,65315,67,8557,67,8450,67,8493,67,119810,67,119862,67,119914,67,119966,67,120018,67,120174,67,120226,67,120278,67,120330,67,120382,67,120434,67,1017,67,11428,67,5087,67,42202,67,66210,67,66306,67,66581,67,66844,67,8574,100,8518,100,119837,100,119889,100,119941,100,119993,100,120045,100,120097,100,120149,100,120201,100,120253,100,120305,100,120357,100,120409,100,120461,100,1281,100,5095,100,5231,100,42194,100,8558,68,8517,68,119811,68,119863,68,119915,68,119967,68,120019,68,120071,68,120123,68,120175,68,120227,68,120279,68,120331,68,120383,68,120435,68,5024,68,5598,68,5610,68,42195,68,8494,101,65349,101,8495,101,8519,101,119838,101,119890,101,119942,101,120046,101,120098,101,120150,101,120202,101,120254,101,120306,101,120358,101,120410,101,120462,101,43826,101,1213,101,8959,69,65317,69,8496,69,119812,69,119864,69,119916,69,120020,69,120072,69,120124,69,120176,69,120228,69,120280,69,120332,69,120384,69,120436,69,917,69,120492,69,120550,69,120608,69,120666,69,120724,69,11577,69,5036,69,42224,69,71846,69,71854,69,66182,69,119839,102,119891,102,119943,102,119995,102,120047,102,120099,102,120151,102,120203,102,120255,102,120307,102,120359,102,120411,102,120463,102,43829,102,42905,102,383,102,7837,102,1412,102,119315,70,8497,70,119813,70,119865,70,119917,70,120021,70,120073,70,120125,70,120177,70,120229,70,120281,70,120333,70,120385,70,120437,70,42904,70,988,70,120778,70,5556,70,42205,70,71874,70,71842,70,66183,70,66213,70,66853,70,65351,103,8458,103,119840,103,119892,103,119944,103,120048,103,120100,103,120152,103,120204,103,120256,103,120308,103,120360,103,120412,103,120464,103,609,103,7555,103,397,103,1409,103,119814,71,119866,71,119918,71,119970,71,120022,71,120074,71,120126,71,120178,71,120230,71,120282,71,120334,71,120386,71,120438,71,1292,71,5056,71,5107,71,42198,71,65352,104,8462,104,119841,104,119945,104,119997,104,120049,104,120101,104,120153,104,120205,104,120257,104,120309,104,120361,104,120413,104,120465,104,1211,104,1392,104,5058,104,65320,72,8459,72,8460,72,8461,72,119815,72,119867,72,119919,72,120023,72,120179,72,120231,72,120283,72,120335,72,120387,72,120439,72,919,72,120494,72,120552,72,120610,72,120668,72,120726,72,11406,72,5051,72,5500,72,42215,72,66255,72,731,105,9075,105,65353,105,8560,105,8505,105,8520,105,119842,105,119894,105,119946,105,119998,105,120050,105,120102,105,120154,105,120206,105,120258,105,120310,105,120362,105,120414,105,120466,105,120484,105,618,105,617,105,953,105,8126,105,890,105,120522,105,120580,105,120638,105,120696,105,120754,105,1110,105,42567,105,1231,105,43893,105,5029,105,71875,105,65354,106,8521,106,119843,106,119895,106,119947,106,119999,106,120051,106,120103,106,120155,106,120207,106,120259,106,120311,106,120363,106,120415,106,120467,106,1011,106,1112,106,65322,74,119817,74,119869,74,119921,74,119973,74,120025,74,120077,74,120129,74,120181,74,120233,74,120285,74,120337,74,120389,74,120441,74,42930,74,895,74,1032,74,5035,74,5261,74,42201,74,119844,107,119896,107,119948,107,120000,107,120052,107,120104,107,120156,107,120208,107,120260,107,120312,107,120364,107,120416,107,120468,107,8490,75,65323,75,119818,75,119870,75,119922,75,119974,75,120026,75,120078,75,120130,75,120182,75,120234,75,120286,75,120338,75,120390,75,120442,75,922,75,120497,75,120555,75,120613,75,120671,75,120729,75,11412,75,5094,75,5845,75,42199,75,66840,75,1472,108,8739,73,9213,73,65512,73,1633,108,1777,73,66336,108,125127,108,120783,73,120793,73,120803,73,120813,73,120823,73,130033,73,65321,73,8544,73,8464,73,8465,73,119816,73,119868,73,119920,73,120024,73,120128,73,120180,73,120232,73,120284,73,120336,73,120388,73,120440,73,65356,108,8572,73,8467,108,119845,108,119897,108,119949,108,120001,108,120053,108,120105,73,120157,73,120209,73,120261,73,120313,73,120365,73,120417,73,120469,73,448,73,120496,73,120554,73,120612,73,120670,73,120728,73,11410,73,1030,73,1216,73,1493,108,1503,108,1575,108,126464,108,126592,108,65166,108,65165,108,1994,108,11599,73,5825,73,42226,73,93992,73,66186,124,66313,124,119338,76,8556,76,8466,76,119819,76,119871,76,119923,76,120027,76,120079,76,120131,76,120183,76,120235,76,120287,76,120339,76,120391,76,120443,76,11472,76,5086,76,5290,76,42209,76,93974,76,71843,76,71858,76,66587,76,66854,76,65325,77,8559,77,8499,77,119820,77,119872,77,119924,77,120028,77,120080,77,120132,77,120184,77,120236,77,120288,77,120340,77,120392,77,120444,77,924,77,120499,77,120557,77,120615,77,120673,77,120731,77,1018,77,11416,77,5047,77,5616,77,5846,77,42207,77,66224,77,66321,77,119847,110,119899,110,119951,110,120003,110,120055,110,120107,110,120159,110,120211,110,120263,110,120315,110,120367,110,120419,110,120471,110,1400,110,1404,110,65326,78,8469,78,119821,78,119873,78,119925,78,119977,78,120029,78,120081,78,120185,78,120237,78,120289,78,120341,78,120393,78,120445,78,925,78,120500,78,120558,78,120616,78,120674,78,120732,78,11418,78,42208,78,66835,78,3074,111,3202,111,3330,111,3458,111,2406,111,2662,111,2790,111,3046,111,3174,111,3302,111,3430,111,3664,111,3792,111,4160,111,1637,111,1781,111,65359,111,8500,111,119848,111,119900,111,119952,111,120056,111,120108,111,120160,111,120212,111,120264,111,120316,111,120368,111,120420,111,120472,111,7439,111,7441,111,43837,111,959,111,120528,111,120586,111,120644,111,120702,111,120760,111,963,111,120532,111,120590,111,120648,111,120706,111,120764,111,11423,111,4351,111,1413,111,1505,111,1607,111,126500,111,126564,111,126596,111,65259,111,65260,111,65258,111,65257,111,1726,111,64428,111,64429,111,64427,111,64426,111,1729,111,64424,111,64425,111,64423,111,64422,111,1749,111,3360,111,4125,111,66794,111,71880,111,71895,111,66604,111,1984,79,2534,79,2918,79,12295,79,70864,79,71904,79,120782,79,120792,79,120802,79,120812,79,120822,79,130032,79,65327,79,119822,79,119874,79,119926,79,119978,79,120030,79,120082,79,120134,79,120186,79,120238,79,120290,79,120342,79,120394,79,120446,79,927,79,120502,79,120560,79,120618,79,120676,79,120734,79,11422,79,1365,79,11604,79,4816,79,2848,79,66754,79,42227,79,71861,79,66194,79,66219,79,66564,79,66838,79,9076,112,65360,112,119849,112,119901,112,119953,112,120005,112,120057,112,120109,112,120161,112,120213,112,120265,112,120317,112,120369,112,120421,112,120473,112,961,112,120530,112,120544,112,120588,112,120602,112,120646,112,120660,112,120704,112,120718,112,120762,112,120776,112,11427,112,65328,80,8473,80,119823,80,119875,80,119927,80,119979,80,120031,80,120083,80,120187,80,120239,80,120291,80,120343,80,120395,80,120447,80,929,80,120504,80,120562,80,120620,80,120678,80,120736,80,11426,80,5090,80,5229,80,42193,80,66197,80,119850,113,119902,113,119954,113,120006,113,120058,113,120110,113,120162,113,120214,113,120266,113,120318,113,120370,113,120422,113,120474,113,1307,113,1379,113,1382,113,8474,81,119824,81,119876,81,119928,81,119980,81,120032,81,120084,81,120188,81,120240,81,120292,81,120344,81,120396,81,120448,81,11605,81,119851,114,119903,114,119955,114,120007,114,120059,114,120111,114,120163,114,120215,114,120267,114,120319,114,120371,114,120423,114,120475,114,43847,114,43848,114,7462,114,11397,114,43905,114,119318,82,8475,82,8476,82,8477,82,119825,82,119877,82,119929,82,120033,82,120189,82,120241,82,120293,82,120345,82,120397,82,120449,82,422,82,5025,82,5074,82,66740,82,5511,82,42211,82,94005,82,65363,115,119852,115,119904,115,119956,115,120008,115,120060,115,120112,115,120164,115,120216,115,120268,115,120320,115,120372,115,120424,115,120476,115,42801,115,445,115,1109,115,43946,115,71873,115,66632,115,65331,83,119826,83,119878,83,119930,83,119982,83,120034,83,120086,83,120138,83,120190,83,120242,83,120294,83,120346,83,120398,83,120450,83,1029,83,1359,83,5077,83,5082,83,42210,83,94010,83,66198,83,66592,83,119853,116,119905,116,119957,116,120009,116,120061,116,120113,116,120165,116,120217,116,120269,116,120321,116,120373,116,120425,116,120477,116,8868,84,10201,84,128872,84,65332,84,119827,84,119879,84,119931,84,119983,84,120035,84,120087,84,120139,84,120191,84,120243,84,120295,84,120347,84,120399,84,120451,84,932,84,120507,84,120565,84,120623,84,120681,84,120739,84,11430,84,5026,84,42196,84,93962,84,71868,84,66199,84,66225,84,66325,84,119854,117,119906,117,119958,117,120010,117,120062,117,120114,117,120166,117,120218,117,120270,117,120322,117,120374,117,120426,117,120478,117,42911,117,7452,117,43854,117,43858,117,651,117,965,117,120534,117,120592,117,120650,117,120708,117,120766,117,1405,117,66806,117,71896,117,8746,85,8899,85,119828,85,119880,85,119932,85,119984,85,120036,85,120088,85,120140,85,120192,85,120244,85,120296,85,120348,85,120400,85,120452,85,1357,85,4608,85,66766,85,5196,85,42228,85,94018,85,71864,85,8744,118,8897,118,65366,118,8564,118,119855,118,119907,118,119959,118,120011,118,120063,118,120115,118,120167,118,120219,118,120271,118,120323,118,120375,118,120427,118,120479,118,7456,118,957,118,120526,118,120584,118,120642,118,120700,118,120758,118,1141,118,1496,118,71430,118,43945,118,71872,118,119309,86,1639,86,1783,86,8548,86,119829,86,119881,86,119933,86,119985,86,120037,86,120089,86,120141,86,120193,86,120245,86,120297,86,120349,86,120401,86,120453,86,1140,86,11576,86,5081,86,5167,86,42719,86,42214,86,93960,86,71840,86,66845,86,623,119,119856,119,119908,119,119960,119,120012,119,120064,119,120116,119,120168,119,120220,119,120272,119,120324,119,120376,119,120428,119,120480,119,7457,119,1121,119,1309,119,1377,119,71434,119,71438,119,71439,119,43907,119,71919,87,71910,87,119830,87,119882,87,119934,87,119986,87,120038,87,120090,87,120142,87,120194,87,120246,87,120298,87,120350,87,120402,87,120454,87,1308,87,5043,87,5076,87,42218,87,5742,120,10539,120,10540,120,10799,120,65368,120,8569,120,119857,120,119909,120,119961,120,120013,120,120065,120,120117,120,120169,120,120221,120,120273,120,120325,120,120377,120,120429,120,120481,120,5441,120,5501,120,5741,88,9587,88,66338,88,71916,88,65336,88,8553,88,119831,88,119883,88,119935,88,119987,88,120039,88,120091,88,120143,88,120195,88,120247,88,120299,88,120351,88,120403,88,120455,88,42931,88,935,88,120510,88,120568,88,120626,88,120684,88,120742,88,11436,88,11613,88,5815,88,42219,88,66192,88,66228,88,66327,88,66855,88,611,121,7564,121,65369,121,119858,121,119910,121,119962,121,120014,121,120066,121,120118,121,120170,121,120222,121,120274,121,120326,121,120378,121,120430,121,120482,121,655,121,7935,121,43866,121,947,121,8509,121,120516,121,120574,121,120632,121,120690,121,120748,121,1199,121,4327,121,71900,121,65337,89,119832,89,119884,89,119936,89,119988,89,120040,89,120092,89,120144,89,120196,89,120248,89,120300,89,120352,89,120404,89,120456,89,933,89,978,89,120508,89,120566,89,120624,89,120682,89,120740,89,11432,89,1198,89,5033,89,5053,89,42220,89,94019,89,71844,89,66226,89,119859,122,119911,122,119963,122,120015,122,120067,122,120119,122,120171,122,120223,122,120275,122,120327,122,120379,122,120431,122,120483,122,7458,122,43923,122,71876,122,66293,90,71909,90,65338,90,8484,90,8488,90,119833,90,119885,90,119937,90,119989,90,120041,90,120197,90,120249,90,120301,90,120353,90,120405,90,120457,90,918,90,120493,90,120551,90,120609,90,120667,90,120725,90,5059,90,42204,90,71849,90,65282,34,65284,36,65285,37,65286,38,65290,42,65291,43,65294,46,65295,47,65296,48,65297,49,65298,50,65299,51,65300,52,65301,53,65302,54,65303,55,65304,56,65305,57,65308,60,65309,61,65310,62,65312,64,65316,68,65318,70,65319,71,65324,76,65329,81,65330,82,65333,85,65334,86,65335,87,65343,95,65346,98,65348,100,65350,102,65355,107,65357,109,65358,110,65361,113,65362,114,65364,116,65365,117,65367,119,65370,122,65371,123,65373,125,119846,109],"_default":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"cs":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"de":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"es":[8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"fr":[65374,126,65306,58,65281,33,8216,96,8245,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"it":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"ja":[8211,45,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65292,44,65307,59],"ko":[8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"pl":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"pt-BR":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"qps-ploc":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"ru":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,305,105,921,73,1009,112,215,120,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"tr":[160,32,8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"zh-hans":[65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41],"zh-hant":[8211,45,65374,126,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65307,59]}'));
rt.cache = new Es((e) => {
  function t(u) {
    const c = /* @__PURE__ */ new Map();
    for (let h = 0; h < u.length; h += 2)
      c.set(u[h], u[h + 1]);
    return c;
  }
  function n(u, c) {
    const h = new Map(u);
    for (const [m, f] of c)
      h.set(m, f);
    return h;
  }
  function i(u, c) {
    if (!u)
      return c;
    const h = /* @__PURE__ */ new Map();
    for (const [m, f] of u)
      c.has(m) && h.set(m, f);
    return h;
  }
  const r = bt.ambiguousCharacterData.value;
  let a = e.filter((u) => !u.startsWith("_") && u in r);
  a.length === 0 && (a = ["_default"]);
  let s;
  for (const u of a) {
    const c = t(r[u]);
    s = i(s, c);
  }
  const l = t(r._common), o = n(l, s);
  return new bt(o);
});
rt._locales = new Na(() => Object.keys(bt.ambiguousCharacterData.value).filter((e) => !e.startsWith("_")));
class Xe {
  static getRawData() {
    return JSON.parse("[9,10,11,12,13,32,127,160,173,847,1564,4447,4448,6068,6069,6155,6156,6157,6158,7355,7356,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8203,8204,8205,8206,8207,8234,8235,8236,8237,8238,8239,8287,8288,8289,8290,8291,8292,8293,8294,8295,8296,8297,8298,8299,8300,8301,8302,8303,10240,12288,12644,65024,65025,65026,65027,65028,65029,65030,65031,65032,65033,65034,65035,65036,65037,65038,65039,65279,65440,65520,65521,65522,65523,65524,65525,65526,65527,65528,65532,78844,119155,119156,119157,119158,119159,119160,119161,119162,917504,917505,917506,917507,917508,917509,917510,917511,917512,917513,917514,917515,917516,917517,917518,917519,917520,917521,917522,917523,917524,917525,917526,917527,917528,917529,917530,917531,917532,917533,917534,917535,917536,917537,917538,917539,917540,917541,917542,917543,917544,917545,917546,917547,917548,917549,917550,917551,917552,917553,917554,917555,917556,917557,917558,917559,917560,917561,917562,917563,917564,917565,917566,917567,917568,917569,917570,917571,917572,917573,917574,917575,917576,917577,917578,917579,917580,917581,917582,917583,917584,917585,917586,917587,917588,917589,917590,917591,917592,917593,917594,917595,917596,917597,917598,917599,917600,917601,917602,917603,917604,917605,917606,917607,917608,917609,917610,917611,917612,917613,917614,917615,917616,917617,917618,917619,917620,917621,917622,917623,917624,917625,917626,917627,917628,917629,917630,917631,917760,917761,917762,917763,917764,917765,917766,917767,917768,917769,917770,917771,917772,917773,917774,917775,917776,917777,917778,917779,917780,917781,917782,917783,917784,917785,917786,917787,917788,917789,917790,917791,917792,917793,917794,917795,917796,917797,917798,917799,917800,917801,917802,917803,917804,917805,917806,917807,917808,917809,917810,917811,917812,917813,917814,917815,917816,917817,917818,917819,917820,917821,917822,917823,917824,917825,917826,917827,917828,917829,917830,917831,917832,917833,917834,917835,917836,917837,917838,917839,917840,917841,917842,917843,917844,917845,917846,917847,917848,917849,917850,917851,917852,917853,917854,917855,917856,917857,917858,917859,917860,917861,917862,917863,917864,917865,917866,917867,917868,917869,917870,917871,917872,917873,917874,917875,917876,917877,917878,917879,917880,917881,917882,917883,917884,917885,917886,917887,917888,917889,917890,917891,917892,917893,917894,917895,917896,917897,917898,917899,917900,917901,917902,917903,917904,917905,917906,917907,917908,917909,917910,917911,917912,917913,917914,917915,917916,917917,917918,917919,917920,917921,917922,917923,917924,917925,917926,917927,917928,917929,917930,917931,917932,917933,917934,917935,917936,917937,917938,917939,917940,917941,917942,917943,917944,917945,917946,917947,917948,917949,917950,917951,917952,917953,917954,917955,917956,917957,917958,917959,917960,917961,917962,917963,917964,917965,917966,917967,917968,917969,917970,917971,917972,917973,917974,917975,917976,917977,917978,917979,917980,917981,917982,917983,917984,917985,917986,917987,917988,917989,917990,917991,917992,917993,917994,917995,917996,917997,917998,917999]");
  }
  static getData() {
    return this._data || (this._data = new Set(Xe.getRawData())), this._data;
  }
  static isInvisibleCharacter(t) {
    return Xe.getData().has(t);
  }
  static get codePoints() {
    return Xe.getData();
  }
}
Xe._data = void 0;
const Fs = "$initialize";
class Bs {
  constructor(t, n, i, r) {
    this.vsWorker = t, this.req = n, this.method = i, this.args = r, this.type = 0;
  }
}
class _i {
  constructor(t, n, i, r) {
    this.vsWorker = t, this.seq = n, this.res = i, this.err = r, this.type = 1;
  }
}
class Ps {
  constructor(t, n, i, r) {
    this.vsWorker = t, this.req = n, this.eventName = i, this.arg = r, this.type = 2;
  }
}
class qs {
  constructor(t, n, i) {
    this.vsWorker = t, this.req = n, this.event = i, this.type = 3;
  }
}
class Os {
  constructor(t, n) {
    this.vsWorker = t, this.req = n, this.type = 4;
  }
}
class Vs {
  constructor(t) {
    this._workerId = -1, this._handler = t, this._lastSentReq = 0, this._pendingReplies = /* @__PURE__ */ Object.create(null), this._pendingEmitters = /* @__PURE__ */ new Map(), this._pendingEvents = /* @__PURE__ */ new Map();
  }
  setWorkerId(t) {
    this._workerId = t;
  }
  sendMessage(t, n) {
    const i = String(++this._lastSentReq);
    return new Promise((r, a) => {
      this._pendingReplies[i] = {
        resolve: r,
        reject: a
      }, this._send(new Bs(this._workerId, i, t, n));
    });
  }
  listen(t, n) {
    let i = null;
    const r = new Le({
      onWillAddFirstListener: () => {
        i = String(++this._lastSentReq), this._pendingEmitters.set(i, r), this._send(new Ps(this._workerId, i, t, n));
      },
      onDidRemoveLastListener: () => {
        this._pendingEmitters.delete(i), this._send(new Os(this._workerId, i)), i = null;
      }
    });
    return r.event;
  }
  handleMessage(t) {
    !t || !t.vsWorker || this._workerId !== -1 && t.vsWorker !== this._workerId || this._handleMessage(t);
  }
  _handleMessage(t) {
    switch (t.type) {
      case 1:
        return this._handleReplyMessage(t);
      case 0:
        return this._handleRequestMessage(t);
      case 2:
        return this._handleSubscribeEventMessage(t);
      case 3:
        return this._handleEventMessage(t);
      case 4:
        return this._handleUnsubscribeEventMessage(t);
    }
  }
  _handleReplyMessage(t) {
    if (!this._pendingReplies[t.seq]) {
      console.warn("Got reply to unknown seq");
      return;
    }
    const n = this._pendingReplies[t.seq];
    if (delete this._pendingReplies[t.seq], t.err) {
      let i = t.err;
      t.err.$isError && (i = new Error(), i.name = t.err.name, i.message = t.err.message, i.stack = t.err.stack), n.reject(i);
      return;
    }
    n.resolve(t.res);
  }
  _handleRequestMessage(t) {
    const n = t.req;
    this._handler.handleMessage(t.method, t.args).then((r) => {
      this._send(new _i(this._workerId, n, r, void 0));
    }, (r) => {
      r.detail instanceof Error && (r.detail = bi(r.detail)), this._send(new _i(this._workerId, n, void 0, bi(r)));
    });
  }
  _handleSubscribeEventMessage(t) {
    const n = t.req, i = this._handler.handleEvent(t.eventName, t.arg)((r) => {
      this._send(new qs(this._workerId, n, r));
    });
    this._pendingEvents.set(n, i);
  }
  _handleEventMessage(t) {
    if (!this._pendingEmitters.has(t.req)) {
      console.warn("Got event for unknown req");
      return;
    }
    this._pendingEmitters.get(t.req).fire(t.event);
  }
  _handleUnsubscribeEventMessage(t) {
    if (!this._pendingEvents.has(t.req)) {
      console.warn("Got unsubscribe for unknown req");
      return;
    }
    this._pendingEvents.get(t.req).dispose(), this._pendingEvents.delete(t.req);
  }
  _send(t) {
    const n = [];
    if (t.type === 0)
      for (let i = 0; i < t.args.length; i++)
        t.args[i] instanceof ArrayBuffer && n.push(t.args[i]);
    else
      t.type === 1 && t.res instanceof ArrayBuffer && n.push(t.res);
    this._handler.sendMessage(t, n);
  }
}
function za(e) {
  return e[0] === "o" && e[1] === "n" && Ia(e.charCodeAt(2));
}
function Ua(e) {
  return /^onDynamic/.test(e) && Ia(e.charCodeAt(9));
}
function js(e, t, n) {
  const i = (s) => function() {
    const l = Array.prototype.slice.call(arguments, 0);
    return t(s, l);
  }, r = (s) => function(l) {
    return n(s, l);
  }, a = {};
  for (const s of e) {
    if (Ua(s)) {
      a[s] = r(s);
      continue;
    }
    if (za(s)) {
      a[s] = n(s, void 0);
      continue;
    }
    a[s] = i(s);
  }
  return a;
}
class Gs {
  constructor(t, n) {
    this._requestHandlerFactory = n, this._requestHandler = null, this._protocol = new Vs({
      sendMessage: (i, r) => {
        t(i, r);
      },
      handleMessage: (i, r) => this._handleMessage(i, r),
      handleEvent: (i, r) => this._handleEvent(i, r)
    });
  }
  onmessage(t) {
    this._protocol.handleMessage(t);
  }
  _handleMessage(t, n) {
    if (t === Fs)
      return this.initialize(n[0], n[1], n[2], n[3]);
    if (!this._requestHandler || typeof this._requestHandler[t] != "function")
      return Promise.reject(new Error("Missing requestHandler or method: " + t));
    try {
      return Promise.resolve(this._requestHandler[t].apply(this._requestHandler, n));
    } catch (i) {
      return Promise.reject(i);
    }
  }
  _handleEvent(t, n) {
    if (!this._requestHandler)
      throw new Error("Missing requestHandler");
    if (Ua(t)) {
      const i = this._requestHandler[t].call(this._requestHandler, n);
      if (typeof i != "function")
        throw new Error(`Missing dynamic event ${t} on request handler.`);
      return i;
    }
    if (za(t)) {
      const i = this._requestHandler[t];
      if (typeof i != "function")
        throw new Error(`Missing event ${t} on request handler.`);
      return i;
    }
    throw new Error(`Malformed event name ${t}`);
  }
  initialize(t, n, i, r) {
    this._protocol.setWorkerId(t);
    const l = js(r, (o, u) => this._protocol.sendMessage(o, u), (o, u) => this._protocol.listen(o, u));
    return this._requestHandlerFactory ? (this._requestHandler = this._requestHandlerFactory(l), Promise.resolve(Dn(this._requestHandler))) : (n && (typeof n.baseUrl < "u" && delete n.baseUrl, typeof n.paths < "u" && typeof n.paths.vs < "u" && delete n.paths.vs, typeof n.trustedTypesPolicy !== void 0 && delete n.trustedTypesPolicy, n.catchError = !0, globalThis.require.config(n)), new Promise((o, u) => {
      const c = globalThis.require;
      c([i], (h) => {
        if (this._requestHandler = h.create(l), !this._requestHandler) {
          u(new Error("No RequestHandler!"));
          return;
        }
        o(Dn(this._requestHandler));
      }, u);
    }));
  }
}
class Ve {
  /**
   * Constructs a new DiffChange with the given sequence information
   * and content.
   */
  constructor(t, n, i, r) {
    this.originalStart = t, this.originalLength = n, this.modifiedStart = i, this.modifiedLength = r;
  }
  /**
   * The end point (exclusive) of the change in the original sequence.
   */
  getOriginalEnd() {
    return this.originalStart + this.originalLength;
  }
  /**
   * The end point (exclusive) of the change in the modified sequence.
   */
  getModifiedEnd() {
    return this.modifiedStart + this.modifiedLength;
  }
}
function wi(e, t) {
  return (t << 5) - t + e | 0;
}
function $s(e, t) {
  t = wi(149417, t);
  for (let n = 0, i = e.length; n < i; n++)
    t = wi(e.charCodeAt(n), t);
  return t;
}
class yi {
  constructor(t) {
    this.source = t;
  }
  getElements() {
    const t = this.source, n = new Int32Array(t.length);
    for (let i = 0, r = t.length; i < r; i++)
      n[i] = t.charCodeAt(i);
    return n;
  }
}
function Xs(e, t, n) {
  return new Ge(new yi(e), new yi(t)).ComputeDiff(n).changes;
}
class at {
  static Assert(t, n) {
    if (!t)
      throw new Error(n);
  }
}
class st {
  /**
   * Copies a range of elements from an Array starting at the specified source index and pastes
   * them to another Array starting at the specified destination index. The length and the indexes
   * are specified as 64-bit integers.
   * sourceArray:
   *		The Array that contains the data to copy.
   * sourceIndex:
   *		A 64-bit integer that represents the index in the sourceArray at which copying begins.
   * destinationArray:
   *		The Array that receives the data.
   * destinationIndex:
   *		A 64-bit integer that represents the index in the destinationArray at which storing begins.
   * length:
   *		A 64-bit integer that represents the number of elements to copy.
   */
  static Copy(t, n, i, r, a) {
    for (let s = 0; s < a; s++)
      i[r + s] = t[n + s];
  }
  static Copy2(t, n, i, r, a) {
    for (let s = 0; s < a; s++)
      i[r + s] = t[n + s];
  }
}
class Ti {
  /**
   * Constructs a new DiffChangeHelper for the given DiffSequences.
   */
  constructor() {
    this.m_changes = [], this.m_originalStart = 1073741824, this.m_modifiedStart = 1073741824, this.m_originalCount = 0, this.m_modifiedCount = 0;
  }
  /**
   * Marks the beginning of the next change in the set of differences.
   */
  MarkNextChange() {
    (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.m_changes.push(new Ve(this.m_originalStart, this.m_originalCount, this.m_modifiedStart, this.m_modifiedCount)), this.m_originalCount = 0, this.m_modifiedCount = 0, this.m_originalStart = 1073741824, this.m_modifiedStart = 1073741824;
  }
  /**
   * Adds the original element at the given position to the elements
   * affected by the current change. The modified index gives context
   * to the change position with respect to the original sequence.
   * @param originalIndex The index of the original element to add.
   * @param modifiedIndex The index of the modified element that provides corresponding position in the modified sequence.
   */
  AddOriginalElement(t, n) {
    this.m_originalStart = Math.min(this.m_originalStart, t), this.m_modifiedStart = Math.min(this.m_modifiedStart, n), this.m_originalCount++;
  }
  /**
   * Adds the modified element at the given position to the elements
   * affected by the current change. The original index gives context
   * to the change position with respect to the modified sequence.
   * @param originalIndex The index of the original element that provides corresponding position in the original sequence.
   * @param modifiedIndex The index of the modified element to add.
   */
  AddModifiedElement(t, n) {
    this.m_originalStart = Math.min(this.m_originalStart, t), this.m_modifiedStart = Math.min(this.m_modifiedStart, n), this.m_modifiedCount++;
  }
  /**
   * Retrieves all of the changes marked by the class.
   */
  getChanges() {
    return (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.MarkNextChange(), this.m_changes;
  }
  /**
   * Retrieves all of the changes marked by the class in the reverse order
   */
  getReverseChanges() {
    return (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.MarkNextChange(), this.m_changes.reverse(), this.m_changes;
  }
}
class Ge {
  /**
   * Constructs the DiffFinder
   */
  constructor(t, n, i = null) {
    this.ContinueProcessingPredicate = i, this._originalSequence = t, this._modifiedSequence = n;
    const [r, a, s] = Ge._getElements(t), [l, o, u] = Ge._getElements(n);
    this._hasStrings = s && u, this._originalStringElements = r, this._originalElementsOrHash = a, this._modifiedStringElements = l, this._modifiedElementsOrHash = o, this.m_forwardHistory = [], this.m_reverseHistory = [];
  }
  static _isStringArray(t) {
    return t.length > 0 && typeof t[0] == "string";
  }
  static _getElements(t) {
    const n = t.getElements();
    if (Ge._isStringArray(n)) {
      const i = new Int32Array(n.length);
      for (let r = 0, a = n.length; r < a; r++)
        i[r] = $s(n[r], 0);
      return [n, i, !0];
    }
    return n instanceof Int32Array ? [[], n, !1] : [[], new Int32Array(n), !1];
  }
  ElementsAreEqual(t, n) {
    return this._originalElementsOrHash[t] !== this._modifiedElementsOrHash[n] ? !1 : this._hasStrings ? this._originalStringElements[t] === this._modifiedStringElements[n] : !0;
  }
  ElementsAreStrictEqual(t, n) {
    if (!this.ElementsAreEqual(t, n))
      return !1;
    const i = Ge._getStrictElement(this._originalSequence, t), r = Ge._getStrictElement(this._modifiedSequence, n);
    return i === r;
  }
  static _getStrictElement(t, n) {
    return typeof t.getStrictElement == "function" ? t.getStrictElement(n) : null;
  }
  OriginalElementsAreEqual(t, n) {
    return this._originalElementsOrHash[t] !== this._originalElementsOrHash[n] ? !1 : this._hasStrings ? this._originalStringElements[t] === this._originalStringElements[n] : !0;
  }
  ModifiedElementsAreEqual(t, n) {
    return this._modifiedElementsOrHash[t] !== this._modifiedElementsOrHash[n] ? !1 : this._hasStrings ? this._modifiedStringElements[t] === this._modifiedStringElements[n] : !0;
  }
  ComputeDiff(t) {
    return this._ComputeDiff(0, this._originalElementsOrHash.length - 1, 0, this._modifiedElementsOrHash.length - 1, t);
  }
  /**
   * Computes the differences between the original and modified input
   * sequences on the bounded range.
   * @returns An array of the differences between the two input sequences.
   */
  _ComputeDiff(t, n, i, r, a) {
    const s = [!1];
    let l = this.ComputeDiffRecursive(t, n, i, r, s);
    return a && (l = this.PrettifyChanges(l)), {
      quitEarly: s[0],
      changes: l
    };
  }
  /**
   * Private helper method which computes the differences on the bounded range
   * recursively.
   * @returns An array of the differences between the two input sequences.
   */
  ComputeDiffRecursive(t, n, i, r, a) {
    for (a[0] = !1; t <= n && i <= r && this.ElementsAreEqual(t, i); )
      t++, i++;
    for (; n >= t && r >= i && this.ElementsAreEqual(n, r); )
      n--, r--;
    if (t > n || i > r) {
      let h;
      return i <= r ? (at.Assert(t === n + 1, "originalStart should only be one more than originalEnd"), h = [
        new Ve(t, 0, i, r - i + 1)
      ]) : t <= n ? (at.Assert(i === r + 1, "modifiedStart should only be one more than modifiedEnd"), h = [
        new Ve(t, n - t + 1, i, 0)
      ]) : (at.Assert(t === n + 1, "originalStart should only be one more than originalEnd"), at.Assert(i === r + 1, "modifiedStart should only be one more than modifiedEnd"), h = []), h;
    }
    const s = [0], l = [0], o = this.ComputeRecursionPoint(t, n, i, r, s, l, a), u = s[0], c = l[0];
    if (o !== null)
      return o;
    if (!a[0]) {
      const h = this.ComputeDiffRecursive(t, u, i, c, a);
      let m = [];
      return a[0] ? m = [
        new Ve(u + 1, n - (u + 1) + 1, c + 1, r - (c + 1) + 1)
      ] : m = this.ComputeDiffRecursive(u + 1, n, c + 1, r, a), this.ConcatenateChanges(h, m);
    }
    return [
      new Ve(t, n - t + 1, i, r - i + 1)
    ];
  }
  WALKTRACE(t, n, i, r, a, s, l, o, u, c, h, m, f, g, p, w, y, v) {
    let x = null, E = null, I = new Ti(), B = n, _ = i, b = f[0] - w[0] - r, T = -1073741824, q = this.m_forwardHistory.length - 1;
    do {
      const F = b + t;
      F === B || F < _ && u[F - 1] < u[F + 1] ? (h = u[F + 1], g = h - b - r, h < T && I.MarkNextChange(), T = h, I.AddModifiedElement(h + 1, g), b = F + 1 - t) : (h = u[F - 1] + 1, g = h - b - r, h < T && I.MarkNextChange(), T = h - 1, I.AddOriginalElement(h, g + 1), b = F - 1 - t), q >= 0 && (u = this.m_forwardHistory[q], t = u[0], B = 1, _ = u.length - 1);
    } while (--q >= -1);
    if (x = I.getReverseChanges(), v[0]) {
      let F = f[0] + 1, S = w[0] + 1;
      if (x !== null && x.length > 0) {
        const L = x[x.length - 1];
        F = Math.max(F, L.getOriginalEnd()), S = Math.max(S, L.getModifiedEnd());
      }
      E = [
        new Ve(F, m - F + 1, S, p - S + 1)
      ];
    } else {
      I = new Ti(), B = s, _ = l, b = f[0] - w[0] - o, T = 1073741824, q = y ? this.m_reverseHistory.length - 1 : this.m_reverseHistory.length - 2;
      do {
        const F = b + a;
        F === B || F < _ && c[F - 1] >= c[F + 1] ? (h = c[F + 1] - 1, g = h - b - o, h > T && I.MarkNextChange(), T = h + 1, I.AddOriginalElement(h + 1, g + 1), b = F + 1 - a) : (h = c[F - 1], g = h - b - o, h > T && I.MarkNextChange(), T = h, I.AddModifiedElement(h + 1, g + 1), b = F - 1 - a), q >= 0 && (c = this.m_reverseHistory[q], a = c[0], B = 1, _ = c.length - 1);
      } while (--q >= -1);
      E = I.getChanges();
    }
    return this.ConcatenateChanges(x, E);
  }
  /**
   * Given the range to compute the diff on, this method finds the point:
   * (midOriginal, midModified)
   * that exists in the middle of the LCS of the two sequences and
   * is the point at which the LCS problem may be broken down recursively.
   * This method will try to keep the LCS trace in memory. If the LCS recursion
   * point is calculated and the full trace is available in memory, then this method
   * will return the change list.
   * @param originalStart The start bound of the original sequence range
   * @param originalEnd The end bound of the original sequence range
   * @param modifiedStart The start bound of the modified sequence range
   * @param modifiedEnd The end bound of the modified sequence range
   * @param midOriginal The middle point of the original sequence range
   * @param midModified The middle point of the modified sequence range
   * @returns The diff changes, if available, otherwise null
   */
  ComputeRecursionPoint(t, n, i, r, a, s, l) {
    let o = 0, u = 0, c = 0, h = 0, m = 0, f = 0;
    t--, i--, a[0] = 0, s[0] = 0, this.m_forwardHistory = [], this.m_reverseHistory = [];
    const g = n - t + (r - i), p = g + 1, w = new Int32Array(p), y = new Int32Array(p), v = r - i, x = n - t, E = t - i, I = n - r, _ = (x - v) % 2 === 0;
    w[v] = t, y[x] = n, l[0] = !1;
    for (let b = 1; b <= g / 2 + 1; b++) {
      let T = 0, q = 0;
      c = this.ClipDiagonalBound(v - b, b, v, p), h = this.ClipDiagonalBound(v + b, b, v, p);
      for (let S = c; S <= h; S += 2) {
        S === c || S < h && w[S - 1] < w[S + 1] ? o = w[S + 1] : o = w[S - 1] + 1, u = o - (S - v) - E;
        const L = o;
        for (; o < n && u < r && this.ElementsAreEqual(o + 1, u + 1); )
          o++, u++;
        if (w[S] = o, o + u > T + q && (T = o, q = u), !_ && Math.abs(S - x) <= b - 1 && o >= y[S])
          return a[0] = o, s[0] = u, L <= y[S] && 1447 > 0 && b <= 1447 + 1 ? this.WALKTRACE(v, c, h, E, x, m, f, I, w, y, o, n, a, u, r, s, _, l) : null;
      }
      const F = (T - t + (q - i) - b) / 2;
      if (this.ContinueProcessingPredicate !== null && !this.ContinueProcessingPredicate(T, F))
        return l[0] = !0, a[0] = T, s[0] = q, F > 0 && 1447 > 0 && b <= 1447 + 1 ? this.WALKTRACE(v, c, h, E, x, m, f, I, w, y, o, n, a, u, r, s, _, l) : (t++, i++, [
          new Ve(t, n - t + 1, i, r - i + 1)
        ]);
      m = this.ClipDiagonalBound(x - b, b, x, p), f = this.ClipDiagonalBound(x + b, b, x, p);
      for (let S = m; S <= f; S += 2) {
        S === m || S < f && y[S - 1] >= y[S + 1] ? o = y[S + 1] - 1 : o = y[S - 1], u = o - (S - x) - I;
        const L = o;
        for (; o > t && u > i && this.ElementsAreEqual(o, u); )
          o--, u--;
        if (y[S] = o, _ && Math.abs(S - v) <= b && o <= w[S])
          return a[0] = o, s[0] = u, L >= w[S] && 1447 > 0 && b <= 1447 + 1 ? this.WALKTRACE(v, c, h, E, x, m, f, I, w, y, o, n, a, u, r, s, _, l) : null;
      }
      if (b <= 1447) {
        let S = new Int32Array(h - c + 2);
        S[0] = v - c + 1, st.Copy2(w, c, S, 1, h - c + 1), this.m_forwardHistory.push(S), S = new Int32Array(f - m + 2), S[0] = x - m + 1, st.Copy2(y, m, S, 1, f - m + 1), this.m_reverseHistory.push(S);
      }
    }
    return this.WALKTRACE(v, c, h, E, x, m, f, I, w, y, o, n, a, u, r, s, _, l);
  }
  /**
   * Shifts the given changes to provide a more intuitive diff.
   * While the first element in a diff matches the first element after the diff,
   * we shift the diff down.
   *
   * @param changes The list of changes to shift
   * @returns The shifted changes
   */
  PrettifyChanges(t) {
    for (let n = 0; n < t.length; n++) {
      const i = t[n], r = n < t.length - 1 ? t[n + 1].originalStart : this._originalElementsOrHash.length, a = n < t.length - 1 ? t[n + 1].modifiedStart : this._modifiedElementsOrHash.length, s = i.originalLength > 0, l = i.modifiedLength > 0;
      for (; i.originalStart + i.originalLength < r && i.modifiedStart + i.modifiedLength < a && (!s || this.OriginalElementsAreEqual(i.originalStart, i.originalStart + i.originalLength)) && (!l || this.ModifiedElementsAreEqual(i.modifiedStart, i.modifiedStart + i.modifiedLength)); ) {
        const u = this.ElementsAreStrictEqual(i.originalStart, i.modifiedStart);
        if (this.ElementsAreStrictEqual(i.originalStart + i.originalLength, i.modifiedStart + i.modifiedLength) && !u)
          break;
        i.originalStart++, i.modifiedStart++;
      }
      const o = [null];
      if (n < t.length - 1 && this.ChangesOverlap(t[n], t[n + 1], o)) {
        t[n] = o[0], t.splice(n + 1, 1), n--;
        continue;
      }
    }
    for (let n = t.length - 1; n >= 0; n--) {
      const i = t[n];
      let r = 0, a = 0;
      if (n > 0) {
        const h = t[n - 1];
        r = h.originalStart + h.originalLength, a = h.modifiedStart + h.modifiedLength;
      }
      const s = i.originalLength > 0, l = i.modifiedLength > 0;
      let o = 0, u = this._boundaryScore(i.originalStart, i.originalLength, i.modifiedStart, i.modifiedLength);
      for (let h = 1; ; h++) {
        const m = i.originalStart - h, f = i.modifiedStart - h;
        if (m < r || f < a || s && !this.OriginalElementsAreEqual(m, m + i.originalLength) || l && !this.ModifiedElementsAreEqual(f, f + i.modifiedLength))
          break;
        const p = (m === r && f === a ? 5 : 0) + this._boundaryScore(m, i.originalLength, f, i.modifiedLength);
        p > u && (u = p, o = h);
      }
      i.originalStart -= o, i.modifiedStart -= o;
      const c = [null];
      if (n > 0 && this.ChangesOverlap(t[n - 1], t[n], c)) {
        t[n - 1] = c[0], t.splice(n, 1), n++;
        continue;
      }
    }
    if (this._hasStrings)
      for (let n = 1, i = t.length; n < i; n++) {
        const r = t[n - 1], a = t[n], s = a.originalStart - r.originalStart - r.originalLength, l = r.originalStart, o = a.originalStart + a.originalLength, u = o - l, c = r.modifiedStart, h = a.modifiedStart + a.modifiedLength, m = h - c;
        if (s < 5 && u < 20 && m < 20) {
          const f = this._findBetterContiguousSequence(l, u, c, m, s);
          if (f) {
            const [g, p] = f;
            (g !== r.originalStart + r.originalLength || p !== r.modifiedStart + r.modifiedLength) && (r.originalLength = g - r.originalStart, r.modifiedLength = p - r.modifiedStart, a.originalStart = g + s, a.modifiedStart = p + s, a.originalLength = o - a.originalStart, a.modifiedLength = h - a.modifiedStart);
          }
        }
      }
    return t;
  }
  _findBetterContiguousSequence(t, n, i, r, a) {
    if (n < a || r < a)
      return null;
    const s = t + n - a + 1, l = i + r - a + 1;
    let o = 0, u = 0, c = 0;
    for (let h = t; h < s; h++)
      for (let m = i; m < l; m++) {
        const f = this._contiguousSequenceScore(h, m, a);
        f > 0 && f > o && (o = f, u = h, c = m);
      }
    return o > 0 ? [u, c] : null;
  }
  _contiguousSequenceScore(t, n, i) {
    let r = 0;
    for (let a = 0; a < i; a++) {
      if (!this.ElementsAreEqual(t + a, n + a))
        return 0;
      r += this._originalStringElements[t + a].length;
    }
    return r;
  }
  _OriginalIsBoundary(t) {
    return t <= 0 || t >= this._originalElementsOrHash.length - 1 ? !0 : this._hasStrings && /^\s*$/.test(this._originalStringElements[t]);
  }
  _OriginalRegionIsBoundary(t, n) {
    if (this._OriginalIsBoundary(t) || this._OriginalIsBoundary(t - 1))
      return !0;
    if (n > 0) {
      const i = t + n;
      if (this._OriginalIsBoundary(i - 1) || this._OriginalIsBoundary(i))
        return !0;
    }
    return !1;
  }
  _ModifiedIsBoundary(t) {
    return t <= 0 || t >= this._modifiedElementsOrHash.length - 1 ? !0 : this._hasStrings && /^\s*$/.test(this._modifiedStringElements[t]);
  }
  _ModifiedRegionIsBoundary(t, n) {
    if (this._ModifiedIsBoundary(t) || this._ModifiedIsBoundary(t - 1))
      return !0;
    if (n > 0) {
      const i = t + n;
      if (this._ModifiedIsBoundary(i - 1) || this._ModifiedIsBoundary(i))
        return !0;
    }
    return !1;
  }
  _boundaryScore(t, n, i, r) {
    const a = this._OriginalRegionIsBoundary(t, n) ? 1 : 0, s = this._ModifiedRegionIsBoundary(i, r) ? 1 : 0;
    return a + s;
  }
  /**
   * Concatenates the two input DiffChange lists and returns the resulting
   * list.
   * @param The left changes
   * @param The right changes
   * @returns The concatenated list
   */
  ConcatenateChanges(t, n) {
    const i = [];
    if (t.length === 0 || n.length === 0)
      return n.length > 0 ? n : t;
    if (this.ChangesOverlap(t[t.length - 1], n[0], i)) {
      const r = new Array(t.length + n.length - 1);
      return st.Copy(t, 0, r, 0, t.length - 1), r[t.length - 1] = i[0], st.Copy(n, 1, r, t.length, n.length - 1), r;
    } else {
      const r = new Array(t.length + n.length);
      return st.Copy(t, 0, r, 0, t.length), st.Copy(n, 0, r, t.length, n.length), r;
    }
  }
  /**
   * Returns true if the two changes overlap and can be merged into a single
   * change
   * @param left The left change
   * @param right The right change
   * @param mergedChange The merged change if the two overlap, null otherwise
   * @returns True if the two changes overlap
   */
  ChangesOverlap(t, n, i) {
    if (at.Assert(t.originalStart <= n.originalStart, "Left change is not less than or equal to right change"), at.Assert(t.modifiedStart <= n.modifiedStart, "Left change is not less than or equal to right change"), t.originalStart + t.originalLength >= n.originalStart || t.modifiedStart + t.modifiedLength >= n.modifiedStart) {
      const r = t.originalStart;
      let a = t.originalLength;
      const s = t.modifiedStart;
      let l = t.modifiedLength;
      return t.originalStart + t.originalLength >= n.originalStart && (a = n.originalStart + n.originalLength - t.originalStart), t.modifiedStart + t.modifiedLength >= n.modifiedStart && (l = n.modifiedStart + n.modifiedLength - t.modifiedStart), i[0] = new Ve(r, a, s, l), !0;
    } else
      return i[0] = null, !1;
  }
  /**
   * Helper method used to clip a diagonal index to the range of valid
   * diagonals. This also decides whether or not the diagonal index,
   * if it exceeds the boundary, should be clipped to the boundary or clipped
   * one inside the boundary depending on the Even/Odd status of the boundary
   * and numDifferences.
   * @param diagonal The index of the diagonal to clip.
   * @param numDifferences The current number of differences being iterated upon.
   * @param diagonalBaseIndex The base reference diagonal.
   * @param numDiagonals The total number of diagonals.
   * @returns The clipped diagonal index.
   */
  ClipDiagonalBound(t, n, i, r) {
    if (t >= 0 && t < r)
      return t;
    const a = i, s = r - i - 1, l = n % 2 === 0;
    if (t < 0) {
      const o = a % 2 === 0;
      return l === o ? 0 : 1;
    } else {
      const o = s % 2 === 0;
      return l === o ? r - 1 : r - 2;
    }
  }
}
let dt;
if (typeof Me.vscode < "u" && typeof Me.vscode.process < "u") {
  const e = Me.vscode.process;
  dt = {
    get platform() {
      return e.platform;
    },
    get arch() {
      return e.arch;
    },
    get env() {
      return e.env;
    },
    cwd() {
      return e.cwd();
    }
  };
} else
  typeof process < "u" ? dt = {
    get platform() {
      return process.platform;
    },
    get arch() {
      return process.arch;
    },
    get env() {
      return process.env;
    },
    cwd() {
      return process.env.VSCODE_CWD || process.cwd();
    }
  } : dt = {
    // Supported
    get platform() {
      return Mt ? "win32" : Ss ? "darwin" : "linux";
    },
    get arch() {
    },
    // Unsupported
    get env() {
      return {};
    },
    cwd() {
      return "/";
    }
  };
const Kt = dt.cwd, Js = dt.env, Qs = dt.platform, Ys = 65, Zs = 97, Ks = 90, eo = 122, Je = 46, ue = 47, pe = 92, Be = 58, to = 63;
class Ha extends Error {
  constructor(t, n, i) {
    let r;
    typeof n == "string" && n.indexOf("not ") === 0 ? (r = "must not be", n = n.replace(/^not /, "")) : r = "must be";
    const a = t.indexOf(".") !== -1 ? "property" : "argument";
    let s = `The "${t}" ${a} ${r} of type ${n}`;
    s += `. Received type ${typeof i}`, super(s), this.code = "ERR_INVALID_ARG_TYPE";
  }
}
function no(e, t) {
  if (e === null || typeof e != "object")
    throw new Ha(t, "Object", e);
}
function ne(e, t) {
  if (typeof e != "string")
    throw new Ha(t, "string", e);
}
const Ke = Qs === "win32";
function j(e) {
  return e === ue || e === pe;
}
function Un(e) {
  return e === ue;
}
function Pe(e) {
  return e >= Ys && e <= Ks || e >= Zs && e <= eo;
}
function en(e, t, n, i) {
  let r = "", a = 0, s = -1, l = 0, o = 0;
  for (let u = 0; u <= e.length; ++u) {
    if (u < e.length)
      o = e.charCodeAt(u);
    else {
      if (i(o))
        break;
      o = ue;
    }
    if (i(o)) {
      if (!(s === u - 1 || l === 1))
        if (l === 2) {
          if (r.length < 2 || a !== 2 || r.charCodeAt(r.length - 1) !== Je || r.charCodeAt(r.length - 2) !== Je) {
            if (r.length > 2) {
              const c = r.lastIndexOf(n);
              c === -1 ? (r = "", a = 0) : (r = r.slice(0, c), a = r.length - 1 - r.lastIndexOf(n)), s = u, l = 0;
              continue;
            } else if (r.length !== 0) {
              r = "", a = 0, s = u, l = 0;
              continue;
            }
          }
          t && (r += r.length > 0 ? `${n}..` : "..", a = 2);
        } else
          r.length > 0 ? r += `${n}${e.slice(s + 1, u)}` : r = e.slice(s + 1, u), a = u - s - 1;
      s = u, l = 0;
    } else
      o === Je && l !== -1 ? ++l : l = -1;
  }
  return r;
}
function Wa(e, t) {
  no(t, "pathObject");
  const n = t.dir || t.root, i = t.base || `${t.name || ""}${t.ext || ""}`;
  return n ? n === t.root ? `${n}${i}` : `${n}${e}${i}` : i;
}
const fe = {
  // path.resolve([from ...], to)
  resolve(...e) {
    let t = "", n = "", i = !1;
    for (let r = e.length - 1; r >= -1; r--) {
      let a;
      if (r >= 0) {
        if (a = e[r], ne(a, "path"), a.length === 0)
          continue;
      } else
        t.length === 0 ? a = Kt() : (a = Js[`=${t}`] || Kt(), (a === void 0 || a.slice(0, 2).toLowerCase() !== t.toLowerCase() && a.charCodeAt(2) === pe) && (a = `${t}\\`));
      const s = a.length;
      let l = 0, o = "", u = !1;
      const c = a.charCodeAt(0);
      if (s === 1)
        j(c) && (l = 1, u = !0);
      else if (j(c))
        if (u = !0, j(a.charCodeAt(1))) {
          let h = 2, m = h;
          for (; h < s && !j(a.charCodeAt(h)); )
            h++;
          if (h < s && h !== m) {
            const f = a.slice(m, h);
            for (m = h; h < s && j(a.charCodeAt(h)); )
              h++;
            if (h < s && h !== m) {
              for (m = h; h < s && !j(a.charCodeAt(h)); )
                h++;
              (h === s || h !== m) && (o = `\\\\${f}\\${a.slice(m, h)}`, l = h);
            }
          }
        } else
          l = 1;
      else
        Pe(c) && a.charCodeAt(1) === Be && (o = a.slice(0, 2), l = 2, s > 2 && j(a.charCodeAt(2)) && (u = !0, l = 3));
      if (o.length > 0)
        if (t.length > 0) {
          if (o.toLowerCase() !== t.toLowerCase())
            continue;
        } else
          t = o;
      if (i) {
        if (t.length > 0)
          break;
      } else if (n = `${a.slice(l)}\\${n}`, i = u, u && t.length > 0)
        break;
    }
    return n = en(n, !i, "\\", j), i ? `${t}\\${n}` : `${t}${n}` || ".";
  },
  normalize(e) {
    ne(e, "path");
    const t = e.length;
    if (t === 0)
      return ".";
    let n = 0, i, r = !1;
    const a = e.charCodeAt(0);
    if (t === 1)
      return Un(a) ? "\\" : e;
    if (j(a))
      if (r = !0, j(e.charCodeAt(1))) {
        let l = 2, o = l;
        for (; l < t && !j(e.charCodeAt(l)); )
          l++;
        if (l < t && l !== o) {
          const u = e.slice(o, l);
          for (o = l; l < t && j(e.charCodeAt(l)); )
            l++;
          if (l < t && l !== o) {
            for (o = l; l < t && !j(e.charCodeAt(l)); )
              l++;
            if (l === t)
              return `\\\\${u}\\${e.slice(o)}\\`;
            l !== o && (i = `\\\\${u}\\${e.slice(o, l)}`, n = l);
          }
        }
      } else
        n = 1;
    else
      Pe(a) && e.charCodeAt(1) === Be && (i = e.slice(0, 2), n = 2, t > 2 && j(e.charCodeAt(2)) && (r = !0, n = 3));
    let s = n < t ? en(e.slice(n), !r, "\\", j) : "";
    return s.length === 0 && !r && (s = "."), s.length > 0 && j(e.charCodeAt(t - 1)) && (s += "\\"), i === void 0 ? r ? `\\${s}` : s : r ? `${i}\\${s}` : `${i}${s}`;
  },
  isAbsolute(e) {
    ne(e, "path");
    const t = e.length;
    if (t === 0)
      return !1;
    const n = e.charCodeAt(0);
    return j(n) || // Possible device root
    t > 2 && Pe(n) && e.charCodeAt(1) === Be && j(e.charCodeAt(2));
  },
  join(...e) {
    if (e.length === 0)
      return ".";
    let t, n;
    for (let a = 0; a < e.length; ++a) {
      const s = e[a];
      ne(s, "path"), s.length > 0 && (t === void 0 ? t = n = s : t += `\\${s}`);
    }
    if (t === void 0)
      return ".";
    let i = !0, r = 0;
    if (typeof n == "string" && j(n.charCodeAt(0))) {
      ++r;
      const a = n.length;
      a > 1 && j(n.charCodeAt(1)) && (++r, a > 2 && (j(n.charCodeAt(2)) ? ++r : i = !1));
    }
    if (i) {
      for (; r < t.length && j(t.charCodeAt(r)); )
        r++;
      r >= 2 && (t = `\\${t.slice(r)}`);
    }
    return fe.normalize(t);
  },
  // It will solve the relative path from `from` to `to`, for instance:
  //  from = 'C:\\orandea\\test\\aaa'
  //  to = 'C:\\orandea\\impl\\bbb'
  // The output of the function should be: '..\\..\\impl\\bbb'
  relative(e, t) {
    if (ne(e, "from"), ne(t, "to"), e === t)
      return "";
    const n = fe.resolve(e), i = fe.resolve(t);
    if (n === i || (e = n.toLowerCase(), t = i.toLowerCase(), e === t))
      return "";
    let r = 0;
    for (; r < e.length && e.charCodeAt(r) === pe; )
      r++;
    let a = e.length;
    for (; a - 1 > r && e.charCodeAt(a - 1) === pe; )
      a--;
    const s = a - r;
    let l = 0;
    for (; l < t.length && t.charCodeAt(l) === pe; )
      l++;
    let o = t.length;
    for (; o - 1 > l && t.charCodeAt(o - 1) === pe; )
      o--;
    const u = o - l, c = s < u ? s : u;
    let h = -1, m = 0;
    for (; m < c; m++) {
      const g = e.charCodeAt(r + m);
      if (g !== t.charCodeAt(l + m))
        break;
      g === pe && (h = m);
    }
    if (m !== c) {
      if (h === -1)
        return i;
    } else {
      if (u > c) {
        if (t.charCodeAt(l + m) === pe)
          return i.slice(l + m + 1);
        if (m === 2)
          return i.slice(l + m);
      }
      s > c && (e.charCodeAt(r + m) === pe ? h = m : m === 2 && (h = 3)), h === -1 && (h = 0);
    }
    let f = "";
    for (m = r + h + 1; m <= a; ++m)
      (m === a || e.charCodeAt(m) === pe) && (f += f.length === 0 ? ".." : "\\..");
    return l += h, f.length > 0 ? `${f}${i.slice(l, o)}` : (i.charCodeAt(l) === pe && ++l, i.slice(l, o));
  },
  toNamespacedPath(e) {
    if (typeof e != "string" || e.length === 0)
      return e;
    const t = fe.resolve(e);
    if (t.length <= 2)
      return e;
    if (t.charCodeAt(0) === pe) {
      if (t.charCodeAt(1) === pe) {
        const n = t.charCodeAt(2);
        if (n !== to && n !== Je)
          return `\\\\?\\UNC\\${t.slice(2)}`;
      }
    } else if (Pe(t.charCodeAt(0)) && t.charCodeAt(1) === Be && t.charCodeAt(2) === pe)
      return `\\\\?\\${t}`;
    return e;
  },
  dirname(e) {
    ne(e, "path");
    const t = e.length;
    if (t === 0)
      return ".";
    let n = -1, i = 0;
    const r = e.charCodeAt(0);
    if (t === 1)
      return j(r) ? e : ".";
    if (j(r)) {
      if (n = i = 1, j(e.charCodeAt(1))) {
        let l = 2, o = l;
        for (; l < t && !j(e.charCodeAt(l)); )
          l++;
        if (l < t && l !== o) {
          for (o = l; l < t && j(e.charCodeAt(l)); )
            l++;
          if (l < t && l !== o) {
            for (o = l; l < t && !j(e.charCodeAt(l)); )
              l++;
            if (l === t)
              return e;
            l !== o && (n = i = l + 1);
          }
        }
      }
    } else
      Pe(r) && e.charCodeAt(1) === Be && (n = t > 2 && j(e.charCodeAt(2)) ? 3 : 2, i = n);
    let a = -1, s = !0;
    for (let l = t - 1; l >= i; --l)
      if (j(e.charCodeAt(l))) {
        if (!s) {
          a = l;
          break;
        }
      } else
        s = !1;
    if (a === -1) {
      if (n === -1)
        return ".";
      a = n;
    }
    return e.slice(0, a);
  },
  basename(e, t) {
    t !== void 0 && ne(t, "ext"), ne(e, "path");
    let n = 0, i = -1, r = !0, a;
    if (e.length >= 2 && Pe(e.charCodeAt(0)) && e.charCodeAt(1) === Be && (n = 2), t !== void 0 && t.length > 0 && t.length <= e.length) {
      if (t === e)
        return "";
      let s = t.length - 1, l = -1;
      for (a = e.length - 1; a >= n; --a) {
        const o = e.charCodeAt(a);
        if (j(o)) {
          if (!r) {
            n = a + 1;
            break;
          }
        } else
          l === -1 && (r = !1, l = a + 1), s >= 0 && (o === t.charCodeAt(s) ? --s === -1 && (i = a) : (s = -1, i = l));
      }
      return n === i ? i = l : i === -1 && (i = e.length), e.slice(n, i);
    }
    for (a = e.length - 1; a >= n; --a)
      if (j(e.charCodeAt(a))) {
        if (!r) {
          n = a + 1;
          break;
        }
      } else
        i === -1 && (r = !1, i = a + 1);
    return i === -1 ? "" : e.slice(n, i);
  },
  extname(e) {
    ne(e, "path");
    let t = 0, n = -1, i = 0, r = -1, a = !0, s = 0;
    e.length >= 2 && e.charCodeAt(1) === Be && Pe(e.charCodeAt(0)) && (t = i = 2);
    for (let l = e.length - 1; l >= t; --l) {
      const o = e.charCodeAt(l);
      if (j(o)) {
        if (!a) {
          i = l + 1;
          break;
        }
        continue;
      }
      r === -1 && (a = !1, r = l + 1), o === Je ? n === -1 ? n = l : s !== 1 && (s = 1) : n !== -1 && (s = -1);
    }
    return n === -1 || r === -1 || // We saw a non-dot character immediately before the dot
    s === 0 || // The (right-most) trimmed path component is exactly '..'
    s === 1 && n === r - 1 && n === i + 1 ? "" : e.slice(n, r);
  },
  format: Wa.bind(null, "\\"),
  parse(e) {
    ne(e, "path");
    const t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (e.length === 0)
      return t;
    const n = e.length;
    let i = 0, r = e.charCodeAt(0);
    if (n === 1)
      return j(r) ? (t.root = t.dir = e, t) : (t.base = t.name = e, t);
    if (j(r)) {
      if (i = 1, j(e.charCodeAt(1))) {
        let h = 2, m = h;
        for (; h < n && !j(e.charCodeAt(h)); )
          h++;
        if (h < n && h !== m) {
          for (m = h; h < n && j(e.charCodeAt(h)); )
            h++;
          if (h < n && h !== m) {
            for (m = h; h < n && !j(e.charCodeAt(h)); )
              h++;
            h === n ? i = h : h !== m && (i = h + 1);
          }
        }
      }
    } else if (Pe(r) && e.charCodeAt(1) === Be) {
      if (n <= 2)
        return t.root = t.dir = e, t;
      if (i = 2, j(e.charCodeAt(2))) {
        if (n === 3)
          return t.root = t.dir = e, t;
        i = 3;
      }
    }
    i > 0 && (t.root = e.slice(0, i));
    let a = -1, s = i, l = -1, o = !0, u = e.length - 1, c = 0;
    for (; u >= i; --u) {
      if (r = e.charCodeAt(u), j(r)) {
        if (!o) {
          s = u + 1;
          break;
        }
        continue;
      }
      l === -1 && (o = !1, l = u + 1), r === Je ? a === -1 ? a = u : c !== 1 && (c = 1) : a !== -1 && (c = -1);
    }
    return l !== -1 && (a === -1 || // We saw a non-dot character immediately before the dot
    c === 0 || // The (right-most) trimmed path component is exactly '..'
    c === 1 && a === l - 1 && a === s + 1 ? t.base = t.name = e.slice(s, l) : (t.name = e.slice(s, a), t.base = e.slice(s, l), t.ext = e.slice(a, l))), s > 0 && s !== i ? t.dir = e.slice(0, s - 1) : t.dir = t.root, t;
  },
  sep: "\\",
  delimiter: ";",
  win32: null,
  posix: null
}, io = (() => {
  if (Ke) {
    const e = /\\/g;
    return () => {
      const t = Kt().replace(e, "/");
      return t.slice(t.indexOf("/"));
    };
  }
  return () => Kt();
})(), be = {
  // path.resolve([from ...], to)
  resolve(...e) {
    let t = "", n = !1;
    for (let i = e.length - 1; i >= -1 && !n; i--) {
      const r = i >= 0 ? e[i] : io();
      ne(r, "path"), r.length !== 0 && (t = `${r}/${t}`, n = r.charCodeAt(0) === ue);
    }
    return t = en(t, !n, "/", Un), n ? `/${t}` : t.length > 0 ? t : ".";
  },
  normalize(e) {
    if (ne(e, "path"), e.length === 0)
      return ".";
    const t = e.charCodeAt(0) === ue, n = e.charCodeAt(e.length - 1) === ue;
    return e = en(e, !t, "/", Un), e.length === 0 ? t ? "/" : n ? "./" : "." : (n && (e += "/"), t ? `/${e}` : e);
  },
  isAbsolute(e) {
    return ne(e, "path"), e.length > 0 && e.charCodeAt(0) === ue;
  },
  join(...e) {
    if (e.length === 0)
      return ".";
    let t;
    for (let n = 0; n < e.length; ++n) {
      const i = e[n];
      ne(i, "path"), i.length > 0 && (t === void 0 ? t = i : t += `/${i}`);
    }
    return t === void 0 ? "." : be.normalize(t);
  },
  relative(e, t) {
    if (ne(e, "from"), ne(t, "to"), e === t || (e = be.resolve(e), t = be.resolve(t), e === t))
      return "";
    const n = 1, i = e.length, r = i - n, a = 1, s = t.length - a, l = r < s ? r : s;
    let o = -1, u = 0;
    for (; u < l; u++) {
      const h = e.charCodeAt(n + u);
      if (h !== t.charCodeAt(a + u))
        break;
      h === ue && (o = u);
    }
    if (u === l)
      if (s > l) {
        if (t.charCodeAt(a + u) === ue)
          return t.slice(a + u + 1);
        if (u === 0)
          return t.slice(a + u);
      } else
        r > l && (e.charCodeAt(n + u) === ue ? o = u : u === 0 && (o = 0));
    let c = "";
    for (u = n + o + 1; u <= i; ++u)
      (u === i || e.charCodeAt(u) === ue) && (c += c.length === 0 ? ".." : "/..");
    return `${c}${t.slice(a + o)}`;
  },
  toNamespacedPath(e) {
    return e;
  },
  dirname(e) {
    if (ne(e, "path"), e.length === 0)
      return ".";
    const t = e.charCodeAt(0) === ue;
    let n = -1, i = !0;
    for (let r = e.length - 1; r >= 1; --r)
      if (e.charCodeAt(r) === ue) {
        if (!i) {
          n = r;
          break;
        }
      } else
        i = !1;
    return n === -1 ? t ? "/" : "." : t && n === 1 ? "//" : e.slice(0, n);
  },
  basename(e, t) {
    t !== void 0 && ne(t, "ext"), ne(e, "path");
    let n = 0, i = -1, r = !0, a;
    if (t !== void 0 && t.length > 0 && t.length <= e.length) {
      if (t === e)
        return "";
      let s = t.length - 1, l = -1;
      for (a = e.length - 1; a >= 0; --a) {
        const o = e.charCodeAt(a);
        if (o === ue) {
          if (!r) {
            n = a + 1;
            break;
          }
        } else
          l === -1 && (r = !1, l = a + 1), s >= 0 && (o === t.charCodeAt(s) ? --s === -1 && (i = a) : (s = -1, i = l));
      }
      return n === i ? i = l : i === -1 && (i = e.length), e.slice(n, i);
    }
    for (a = e.length - 1; a >= 0; --a)
      if (e.charCodeAt(a) === ue) {
        if (!r) {
          n = a + 1;
          break;
        }
      } else
        i === -1 && (r = !1, i = a + 1);
    return i === -1 ? "" : e.slice(n, i);
  },
  extname(e) {
    ne(e, "path");
    let t = -1, n = 0, i = -1, r = !0, a = 0;
    for (let s = e.length - 1; s >= 0; --s) {
      const l = e.charCodeAt(s);
      if (l === ue) {
        if (!r) {
          n = s + 1;
          break;
        }
        continue;
      }
      i === -1 && (r = !1, i = s + 1), l === Je ? t === -1 ? t = s : a !== 1 && (a = 1) : t !== -1 && (a = -1);
    }
    return t === -1 || i === -1 || // We saw a non-dot character immediately before the dot
    a === 0 || // The (right-most) trimmed path component is exactly '..'
    a === 1 && t === i - 1 && t === n + 1 ? "" : e.slice(t, i);
  },
  format: Wa.bind(null, "/"),
  parse(e) {
    ne(e, "path");
    const t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (e.length === 0)
      return t;
    const n = e.charCodeAt(0) === ue;
    let i;
    n ? (t.root = "/", i = 1) : i = 0;
    let r = -1, a = 0, s = -1, l = !0, o = e.length - 1, u = 0;
    for (; o >= i; --o) {
      const c = e.charCodeAt(o);
      if (c === ue) {
        if (!l) {
          a = o + 1;
          break;
        }
        continue;
      }
      s === -1 && (l = !1, s = o + 1), c === Je ? r === -1 ? r = o : u !== 1 && (u = 1) : r !== -1 && (u = -1);
    }
    if (s !== -1) {
      const c = a === 0 && n ? 1 : a;
      r === -1 || // We saw a non-dot character immediately before the dot
      u === 0 || // The (right-most) trimmed path component is exactly '..'
      u === 1 && r === s - 1 && r === a + 1 ? t.base = t.name = e.slice(c, s) : (t.name = e.slice(c, r), t.base = e.slice(c, s), t.ext = e.slice(r, s));
    }
    return a > 0 ? t.dir = e.slice(0, a - 1) : n && (t.dir = "/"), t;
  },
  sep: "/",
  delimiter: ":",
  win32: null,
  posix: null
};
be.win32 = fe.win32 = fe;
be.posix = fe.posix = be;
Ke ? fe.normalize : be.normalize;
Ke ? fe.resolve : be.resolve;
Ke ? fe.relative : be.relative;
Ke ? fe.dirname : be.dirname;
Ke ? fe.basename : be.basename;
Ke ? fe.extname : be.extname;
Ke ? fe.sep : be.sep;
const ro = /^\w[\w\d+.-]*$/, ao = /^\//, so = /^\/\//;
function oo(e, t) {
  if (!e.scheme && t)
    throw new Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${e.authority}", path: "${e.path}", query: "${e.query}", fragment: "${e.fragment}"}`);
  if (e.scheme && !ro.test(e.scheme))
    throw new Error("[UriError]: Scheme contains illegal characters.");
  if (e.path) {
    if (e.authority) {
      if (!ao.test(e.path))
        throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
    } else if (so.test(e.path))
      throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
  }
}
function lo(e, t) {
  return !e && !t ? "file" : e;
}
function uo(e, t) {
  switch (e) {
    case "https":
    case "http":
    case "file":
      t ? t[0] !== Ce && (t = Ce + t) : t = Ce;
      break;
  }
  return t;
}
const K = "", Ce = "/", co = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
let li = class Gt {
  static isUri(t) {
    return t instanceof Gt ? !0 : t ? typeof t.authority == "string" && typeof t.fragment == "string" && typeof t.path == "string" && typeof t.query == "string" && typeof t.scheme == "string" && typeof t.fsPath == "string" && typeof t.with == "function" && typeof t.toString == "function" : !1;
  }
  /**
   * @internal
   */
  constructor(t, n, i, r, a, s = !1) {
    typeof t == "object" ? (this.scheme = t.scheme || K, this.authority = t.authority || K, this.path = t.path || K, this.query = t.query || K, this.fragment = t.fragment || K) : (this.scheme = lo(t, s), this.authority = n || K, this.path = uo(this.scheme, i || K), this.query = r || K, this.fragment = a || K, oo(this, s));
  }
  // ---- filesystem path -----------------------
  /**
   * Returns a string representing the corresponding file system path of this URI.
   * Will handle UNC paths, normalizes windows drive letters to lower-case, and uses the
   * platform specific path separator.
   *
   * * Will *not* validate the path for invalid characters and semantics.
   * * Will *not* look at the scheme of this URI.
   * * The result shall *not* be used for display purposes but for accessing a file on disk.
   *
   *
   * The *difference* to `URI#path` is the use of the platform specific separator and the handling
   * of UNC paths. See the below sample of a file-uri with an authority (UNC path).
   *
   * ```ts
      const u = URI.parse('file://server/c$/folder/file.txt')
      u.authority === 'server'
      u.path === '/shares/c$/file.txt'
      u.fsPath === '\\server\c$\folder\file.txt'
  ```
   *
   * Using `URI#path` to read a file (using fs-apis) would not be enough because parts of the path,
   * namely the server name, would be missing. Therefore `URI#fsPath` exists - it's sugar to ease working
   * with URIs that represent files on disk (`file` scheme).
   */
  get fsPath() {
    return Hn(this, !1);
  }
  // ---- modify to new -------------------------
  with(t) {
    if (!t)
      return this;
    let { scheme: n, authority: i, path: r, query: a, fragment: s } = t;
    return n === void 0 ? n = this.scheme : n === null && (n = K), i === void 0 ? i = this.authority : i === null && (i = K), r === void 0 ? r = this.path : r === null && (r = K), a === void 0 ? a = this.query : a === null && (a = K), s === void 0 ? s = this.fragment : s === null && (s = K), n === this.scheme && i === this.authority && r === this.path && a === this.query && s === this.fragment ? this : new ot(n, i, r, a, s);
  }
  // ---- parse & validate ------------------------
  /**
   * Creates a new URI from a string, e.g. `http://www.example.com/some/path`,
   * `file:///usr/home`, or `scheme:with/path`.
   *
   * @param value A string which represents an URI (see `URI#toString`).
   */
  static parse(t, n = !1) {
    const i = co.exec(t);
    return i ? new ot(i[2] || K, Ot(i[4] || K), Ot(i[5] || K), Ot(i[7] || K), Ot(i[9] || K), n) : new ot(K, K, K, K, K);
  }
  /**
   * Creates a new URI from a file system path, e.g. `c:\my\files`,
   * `/usr/home`, or `\\server\share\some\path`.
   *
   * The *difference* between `URI#parse` and `URI#file` is that the latter treats the argument
   * as path, not as stringified-uri. E.g. `URI.file(path)` is **not the same as**
   * `URI.parse('file://' + path)` because the path might contain characters that are
   * interpreted (# and ?). See the following sample:
   * ```ts
  const good = URI.file('/coding/c#/project1');
  good.scheme === 'file';
  good.path === '/coding/c#/project1';
  good.fragment === '';
  const bad = URI.parse('file://' + '/coding/c#/project1');
  bad.scheme === 'file';
  bad.path === '/coding/c'; // path is now broken
  bad.fragment === '/project1';
  ```
   *
   * @param path A file system path (see `URI#fsPath`)
   */
  static file(t) {
    let n = K;
    if (Mt && (t = t.replace(/\\/g, Ce)), t[0] === Ce && t[1] === Ce) {
      const i = t.indexOf(Ce, 2);
      i === -1 ? (n = t.substring(2), t = Ce) : (n = t.substring(2, i), t = t.substring(i) || Ce);
    }
    return new ot("file", n, t, K, K);
  }
  /**
   * Creates new URI from uri components.
   *
   * Unless `strict` is `true` the scheme is defaults to be `file`. This function performs
   * validation and should be used for untrusted uri components retrieved from storage,
   * user input, command arguments etc
   */
  static from(t, n) {
    return new ot(t.scheme, t.authority, t.path, t.query, t.fragment, n);
  }
  /**
   * Join a URI path with path fragments and normalizes the resulting path.
   *
   * @param uri The input URI.
   * @param pathFragment The path fragment to add to the URI path.
   * @returns The resulting URI.
   */
  static joinPath(t, ...n) {
    if (!t.path)
      throw new Error("[UriError]: cannot call joinPath on URI without path");
    let i;
    return Mt && t.scheme === "file" ? i = Gt.file(fe.join(Hn(t, !0), ...n)).path : i = be.join(t.path, ...n), t.with({ path: i });
  }
  // ---- printing/externalize ---------------------------
  /**
   * Creates a string representation for this URI. It's guaranteed that calling
   * `URI.parse` with the result of this function creates an URI which is equal
   * to this URI.
   *
   * * The result shall *not* be used for display purposes but for externalization or transport.
   * * The result will be encoded using the percentage encoding and encoding happens mostly
   * ignore the scheme-specific encoding rules.
   *
   * @param skipEncoding Do not encode the result, default is `false`
   */
  toString(t = !1) {
    return Wn(this, t);
  }
  toJSON() {
    return this;
  }
  static revive(t) {
    var n, i;
    if (t) {
      if (t instanceof Gt)
        return t;
      {
        const r = new ot(t);
        return r._formatted = (n = t.external) !== null && n !== void 0 ? n : null, r._fsPath = t._sep === Fa && (i = t.fsPath) !== null && i !== void 0 ? i : null, r;
      }
    } else
      return t;
  }
};
const Fa = Mt ? 1 : void 0;
class ot extends li {
  constructor() {
    super(...arguments), this._formatted = null, this._fsPath = null;
  }
  get fsPath() {
    return this._fsPath || (this._fsPath = Hn(this, !1)), this._fsPath;
  }
  toString(t = !1) {
    return t ? Wn(this, !0) : (this._formatted || (this._formatted = Wn(this, !1)), this._formatted);
  }
  toJSON() {
    const t = {
      $mid: 1
      /* MarshalledId.Uri */
    };
    return this._fsPath && (t.fsPath = this._fsPath, t._sep = Fa), this._formatted && (t.external = this._formatted), this.path && (t.path = this.path), this.scheme && (t.scheme = this.scheme), this.authority && (t.authority = this.authority), this.query && (t.query = this.query), this.fragment && (t.fragment = this.fragment), t;
  }
}
const Ba = {
  58: "%3A",
  // gen-delims
  47: "%2F",
  63: "%3F",
  35: "%23",
  91: "%5B",
  93: "%5D",
  64: "%40",
  33: "%21",
  // sub-delims
  36: "%24",
  38: "%26",
  39: "%27",
  40: "%28",
  41: "%29",
  42: "%2A",
  43: "%2B",
  44: "%2C",
  59: "%3B",
  61: "%3D",
  32: "%20"
};
function xi(e, t, n) {
  let i, r = -1;
  for (let a = 0; a < e.length; a++) {
    const s = e.charCodeAt(a);
    if (s >= 97 && s <= 122 || s >= 65 && s <= 90 || s >= 48 && s <= 57 || s === 45 || s === 46 || s === 95 || s === 126 || t && s === 47 || n && s === 91 || n && s === 93 || n && s === 58)
      r !== -1 && (i += encodeURIComponent(e.substring(r, a)), r = -1), i !== void 0 && (i += e.charAt(a));
    else {
      i === void 0 && (i = e.substr(0, a));
      const l = Ba[s];
      l !== void 0 ? (r !== -1 && (i += encodeURIComponent(e.substring(r, a)), r = -1), i += l) : r === -1 && (r = a);
    }
  }
  return r !== -1 && (i += encodeURIComponent(e.substring(r))), i !== void 0 ? i : e;
}
function ho(e) {
  let t;
  for (let n = 0; n < e.length; n++) {
    const i = e.charCodeAt(n);
    i === 35 || i === 63 ? (t === void 0 && (t = e.substr(0, n)), t += Ba[i]) : t !== void 0 && (t += e[n]);
  }
  return t !== void 0 ? t : e;
}
function Hn(e, t) {
  let n;
  return e.authority && e.path.length > 1 && e.scheme === "file" ? n = `//${e.authority}${e.path}` : e.path.charCodeAt(0) === 47 && (e.path.charCodeAt(1) >= 65 && e.path.charCodeAt(1) <= 90 || e.path.charCodeAt(1) >= 97 && e.path.charCodeAt(1) <= 122) && e.path.charCodeAt(2) === 58 ? t ? n = e.path.substr(1) : n = e.path[1].toLowerCase() + e.path.substr(2) : n = e.path, Mt && (n = n.replace(/\//g, "\\")), n;
}
function Wn(e, t) {
  const n = t ? ho : xi;
  let i = "", { scheme: r, authority: a, path: s, query: l, fragment: o } = e;
  if (r && (i += r, i += ":"), (a || r === "file") && (i += Ce, i += Ce), a) {
    let u = a.indexOf("@");
    if (u !== -1) {
      const c = a.substr(0, u);
      a = a.substr(u + 1), u = c.lastIndexOf(":"), u === -1 ? i += n(c, !1, !1) : (i += n(c.substr(0, u), !1, !1), i += ":", i += n(c.substr(u + 1), !1, !0)), i += "@";
    }
    a = a.toLowerCase(), u = a.lastIndexOf(":"), u === -1 ? i += n(a, !1, !0) : (i += n(a.substr(0, u), !1, !0), i += a.substr(u));
  }
  if (s) {
    if (s.length >= 3 && s.charCodeAt(0) === 47 && s.charCodeAt(2) === 58) {
      const u = s.charCodeAt(1);
      u >= 65 && u <= 90 && (s = `/${String.fromCharCode(u + 32)}:${s.substr(3)}`);
    } else if (s.length >= 2 && s.charCodeAt(1) === 58) {
      const u = s.charCodeAt(0);
      u >= 65 && u <= 90 && (s = `${String.fromCharCode(u + 32)}:${s.substr(2)}`);
    }
    i += n(s, !0, !1);
  }
  return l && (i += "?", i += n(l, !1, !1)), o && (i += "#", i += t ? o : xi(o, !1, !1)), i;
}
function Pa(e) {
  try {
    return decodeURIComponent(e);
  } catch {
    return e.length > 3 ? e.substr(0, 3) + Pa(e.substr(3)) : e;
  }
}
const ki = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
function Ot(e) {
  return e.match(ki) ? e.replace(ki, (t) => Pa(t)) : e;
}
let Ue = class tt {
  constructor(t, n) {
    this.lineNumber = t, this.column = n;
  }
  /**
   * Create a new position from this position.
   *
   * @param newLineNumber new line number
   * @param newColumn new column
   */
  with(t = this.lineNumber, n = this.column) {
    return t === this.lineNumber && n === this.column ? this : new tt(t, n);
  }
  /**
   * Derive a new position from this position.
   *
   * @param deltaLineNumber line number delta
   * @param deltaColumn column delta
   */
  delta(t = 0, n = 0) {
    return this.with(this.lineNumber + t, this.column + n);
  }
  /**
   * Test if this position equals other position
   */
  equals(t) {
    return tt.equals(this, t);
  }
  /**
   * Test if position `a` equals position `b`
   */
  static equals(t, n) {
    return !t && !n ? !0 : !!t && !!n && t.lineNumber === n.lineNumber && t.column === n.column;
  }
  /**
   * Test if this position is before other position.
   * If the two positions are equal, the result will be false.
   */
  isBefore(t) {
    return tt.isBefore(this, t);
  }
  /**
   * Test if position `a` is before position `b`.
   * If the two positions are equal, the result will be false.
   */
  static isBefore(t, n) {
    return t.lineNumber < n.lineNumber ? !0 : n.lineNumber < t.lineNumber ? !1 : t.column < n.column;
  }
  /**
   * Test if this position is before other position.
   * If the two positions are equal, the result will be true.
   */
  isBeforeOrEqual(t) {
    return tt.isBeforeOrEqual(this, t);
  }
  /**
   * Test if position `a` is before position `b`.
   * If the two positions are equal, the result will be true.
   */
  static isBeforeOrEqual(t, n) {
    return t.lineNumber < n.lineNumber ? !0 : n.lineNumber < t.lineNumber ? !1 : t.column <= n.column;
  }
  /**
   * A function that compares positions, useful for sorting
   */
  static compare(t, n) {
    const i = t.lineNumber | 0, r = n.lineNumber | 0;
    if (i === r) {
      const a = t.column | 0, s = n.column | 0;
      return a - s;
    }
    return i - r;
  }
  /**
   * Clone this position.
   */
  clone() {
    return new tt(this.lineNumber, this.column);
  }
  /**
   * Convert to a human-readable representation.
   */
  toString() {
    return "(" + this.lineNumber + "," + this.column + ")";
  }
  // ---
  /**
   * Create a `Position` from an `IPosition`.
   */
  static lift(t) {
    return new tt(t.lineNumber, t.column);
  }
  /**
   * Test if `obj` is an `IPosition`.
   */
  static isIPosition(t) {
    return t && typeof t.lineNumber == "number" && typeof t.column == "number";
  }
}, oe = class ie {
  constructor(t, n, i, r) {
    t > i || t === i && n > r ? (this.startLineNumber = i, this.startColumn = r, this.endLineNumber = t, this.endColumn = n) : (this.startLineNumber = t, this.startColumn = n, this.endLineNumber = i, this.endColumn = r);
  }
  /**
   * Test if this range is empty.
   */
  isEmpty() {
    return ie.isEmpty(this);
  }
  /**
   * Test if `range` is empty.
   */
  static isEmpty(t) {
    return t.startLineNumber === t.endLineNumber && t.startColumn === t.endColumn;
  }
  /**
   * Test if position is in this range. If the position is at the edges, will return true.
   */
  containsPosition(t) {
    return ie.containsPosition(this, t);
  }
  /**
   * Test if `position` is in `range`. If the position is at the edges, will return true.
   */
  static containsPosition(t, n) {
    return !(n.lineNumber < t.startLineNumber || n.lineNumber > t.endLineNumber || n.lineNumber === t.startLineNumber && n.column < t.startColumn || n.lineNumber === t.endLineNumber && n.column > t.endColumn);
  }
  /**
   * Test if `position` is in `range`. If the position is at the edges, will return false.
   * @internal
   */
  static strictContainsPosition(t, n) {
    return !(n.lineNumber < t.startLineNumber || n.lineNumber > t.endLineNumber || n.lineNumber === t.startLineNumber && n.column <= t.startColumn || n.lineNumber === t.endLineNumber && n.column >= t.endColumn);
  }
  /**
   * Test if range is in this range. If the range is equal to this range, will return true.
   */
  containsRange(t) {
    return ie.containsRange(this, t);
  }
  /**
   * Test if `otherRange` is in `range`. If the ranges are equal, will return true.
   */
  static containsRange(t, n) {
    return !(n.startLineNumber < t.startLineNumber || n.endLineNumber < t.startLineNumber || n.startLineNumber > t.endLineNumber || n.endLineNumber > t.endLineNumber || n.startLineNumber === t.startLineNumber && n.startColumn < t.startColumn || n.endLineNumber === t.endLineNumber && n.endColumn > t.endColumn);
  }
  /**
   * Test if `range` is strictly in this range. `range` must start after and end before this range for the result to be true.
   */
  strictContainsRange(t) {
    return ie.strictContainsRange(this, t);
  }
  /**
   * Test if `otherRange` is strictly in `range` (must start after, and end before). If the ranges are equal, will return false.
   */
  static strictContainsRange(t, n) {
    return !(n.startLineNumber < t.startLineNumber || n.endLineNumber < t.startLineNumber || n.startLineNumber > t.endLineNumber || n.endLineNumber > t.endLineNumber || n.startLineNumber === t.startLineNumber && n.startColumn <= t.startColumn || n.endLineNumber === t.endLineNumber && n.endColumn >= t.endColumn);
  }
  /**
   * A reunion of the two ranges.
   * The smallest position will be used as the start point, and the largest one as the end point.
   */
  plusRange(t) {
    return ie.plusRange(this, t);
  }
  /**
   * A reunion of the two ranges.
   * The smallest position will be used as the start point, and the largest one as the end point.
   */
  static plusRange(t, n) {
    let i, r, a, s;
    return n.startLineNumber < t.startLineNumber ? (i = n.startLineNumber, r = n.startColumn) : n.startLineNumber === t.startLineNumber ? (i = n.startLineNumber, r = Math.min(n.startColumn, t.startColumn)) : (i = t.startLineNumber, r = t.startColumn), n.endLineNumber > t.endLineNumber ? (a = n.endLineNumber, s = n.endColumn) : n.endLineNumber === t.endLineNumber ? (a = n.endLineNumber, s = Math.max(n.endColumn, t.endColumn)) : (a = t.endLineNumber, s = t.endColumn), new ie(i, r, a, s);
  }
  /**
   * A intersection of the two ranges.
   */
  intersectRanges(t) {
    return ie.intersectRanges(this, t);
  }
  /**
   * A intersection of the two ranges.
   */
  static intersectRanges(t, n) {
    let i = t.startLineNumber, r = t.startColumn, a = t.endLineNumber, s = t.endColumn;
    const l = n.startLineNumber, o = n.startColumn, u = n.endLineNumber, c = n.endColumn;
    return i < l ? (i = l, r = o) : i === l && (r = Math.max(r, o)), a > u ? (a = u, s = c) : a === u && (s = Math.min(s, c)), i > a || i === a && r > s ? null : new ie(i, r, a, s);
  }
  /**
   * Test if this range equals other.
   */
  equalsRange(t) {
    return ie.equalsRange(this, t);
  }
  /**
   * Test if range `a` equals `b`.
   */
  static equalsRange(t, n) {
    return !t && !n ? !0 : !!t && !!n && t.startLineNumber === n.startLineNumber && t.startColumn === n.startColumn && t.endLineNumber === n.endLineNumber && t.endColumn === n.endColumn;
  }
  /**
   * Return the end position (which will be after or equal to the start position)
   */
  getEndPosition() {
    return ie.getEndPosition(this);
  }
  /**
   * Return the end position (which will be after or equal to the start position)
   */
  static getEndPosition(t) {
    return new Ue(t.endLineNumber, t.endColumn);
  }
  /**
   * Return the start position (which will be before or equal to the end position)
   */
  getStartPosition() {
    return ie.getStartPosition(this);
  }
  /**
   * Return the start position (which will be before or equal to the end position)
   */
  static getStartPosition(t) {
    return new Ue(t.startLineNumber, t.startColumn);
  }
  /**
   * Transform to a user presentable string representation.
   */
  toString() {
    return "[" + this.startLineNumber + "," + this.startColumn + " -> " + this.endLineNumber + "," + this.endColumn + "]";
  }
  /**
   * Create a new range using this range's start position, and using endLineNumber and endColumn as the end position.
   */
  setEndPosition(t, n) {
    return new ie(this.startLineNumber, this.startColumn, t, n);
  }
  /**
   * Create a new range using this range's end position, and using startLineNumber and startColumn as the start position.
   */
  setStartPosition(t, n) {
    return new ie(t, n, this.endLineNumber, this.endColumn);
  }
  /**
   * Create a new empty range using this range's start position.
   */
  collapseToStart() {
    return ie.collapseToStart(this);
  }
  /**
   * Create a new empty range using this range's start position.
   */
  static collapseToStart(t) {
    return new ie(t.startLineNumber, t.startColumn, t.startLineNumber, t.startColumn);
  }
  /**
   * Create a new empty range using this range's end position.
   */
  collapseToEnd() {
    return ie.collapseToEnd(this);
  }
  /**
   * Create a new empty range using this range's end position.
   */
  static collapseToEnd(t) {
    return new ie(t.endLineNumber, t.endColumn, t.endLineNumber, t.endColumn);
  }
  /**
   * Moves the range by the given amount of lines.
   */
  delta(t) {
    return new ie(this.startLineNumber + t, this.startColumn, this.endLineNumber + t, this.endColumn);
  }
  // ---
  static fromPositions(t, n = t) {
    return new ie(t.lineNumber, t.column, n.lineNumber, n.column);
  }
  static lift(t) {
    return t ? new ie(t.startLineNumber, t.startColumn, t.endLineNumber, t.endColumn) : null;
  }
  /**
   * Test if `obj` is an `IRange`.
   */
  static isIRange(t) {
    return t && typeof t.startLineNumber == "number" && typeof t.startColumn == "number" && typeof t.endLineNumber == "number" && typeof t.endColumn == "number";
  }
  /**
   * Test if the two ranges are touching in any way.
   */
  static areIntersectingOrTouching(t, n) {
    return !(t.endLineNumber < n.startLineNumber || t.endLineNumber === n.startLineNumber && t.endColumn < n.startColumn || n.endLineNumber < t.startLineNumber || n.endLineNumber === t.startLineNumber && n.endColumn < t.startColumn);
  }
  /**
   * Test if the two ranges are intersecting. If the ranges are touching it returns true.
   */
  static areIntersecting(t, n) {
    return !(t.endLineNumber < n.startLineNumber || t.endLineNumber === n.startLineNumber && t.endColumn <= n.startColumn || n.endLineNumber < t.startLineNumber || n.endLineNumber === t.startLineNumber && n.endColumn <= t.startColumn);
  }
  /**
   * A function that compares ranges, useful for sorting ranges
   * It will first compare ranges on the startPosition and then on the endPosition
   */
  static compareRangesUsingStarts(t, n) {
    if (t && n) {
      const a = t.startLineNumber | 0, s = n.startLineNumber | 0;
      if (a === s) {
        const l = t.startColumn | 0, o = n.startColumn | 0;
        if (l === o) {
          const u = t.endLineNumber | 0, c = n.endLineNumber | 0;
          if (u === c) {
            const h = t.endColumn | 0, m = n.endColumn | 0;
            return h - m;
          }
          return u - c;
        }
        return l - o;
      }
      return a - s;
    }
    return (t ? 1 : 0) - (n ? 1 : 0);
  }
  /**
   * A function that compares ranges, useful for sorting ranges
   * It will first compare ranges on the endPosition and then on the startPosition
   */
  static compareRangesUsingEnds(t, n) {
    return t.endLineNumber === n.endLineNumber ? t.endColumn === n.endColumn ? t.startLineNumber === n.startLineNumber ? t.startColumn - n.startColumn : t.startLineNumber - n.startLineNumber : t.endColumn - n.endColumn : t.endLineNumber - n.endLineNumber;
  }
  /**
   * Test if the range spans multiple lines.
   */
  static spansMultipleLines(t) {
    return t.endLineNumber > t.startLineNumber;
  }
  toJSON() {
    return this;
  }
};
function mo(e, t, n = (i, r) => i === r) {
  if (e === t)
    return !0;
  if (!e || !t || e.length !== t.length)
    return !1;
  for (let i = 0, r = e.length; i < r; i++)
    if (!n(e[i], t[i]))
      return !1;
  return !0;
}
function* fo(e, t) {
  let n, i;
  for (const r of e)
    i !== void 0 && t(i, r) ? n.push(r) : (n && (yield n), n = [r]), i = r;
  n && (yield n);
}
function po(e, t) {
  for (let n = 0; n <= e.length; n++)
    t(n === 0 ? void 0 : e[n - 1], n === e.length ? void 0 : e[n]);
}
function go(e, t) {
  for (let n = 0; n < e.length; n++)
    t(n === 0 ? void 0 : e[n - 1], e[n], n + 1 === e.length ? void 0 : e[n + 1]);
}
function bo(e, t) {
  for (const n of t)
    e.push(n);
}
var Ai;
(function(e) {
  function t(a) {
    return a < 0;
  }
  e.isLessThan = t;
  function n(a) {
    return a <= 0;
  }
  e.isLessThanOrEqual = n;
  function i(a) {
    return a > 0;
  }
  e.isGreaterThan = i;
  function r(a) {
    return a === 0;
  }
  e.isNeitherLessOrGreaterThan = r, e.greaterThan = 1, e.lessThan = -1, e.neitherLessOrGreaterThan = 0;
})(Ai || (Ai = {}));
function $t(e, t) {
  return (n, i) => t(e(n), e(i));
}
const Xt = (e, t) => e - t;
function vo(e) {
  return (t, n) => -e(t, n);
}
function Si(e) {
  return e < 0 ? 0 : e > 255 ? 255 : e | 0;
}
function lt(e) {
  return e < 0 ? 0 : e > 4294967295 ? 4294967295 : e | 0;
}
class _o {
  constructor(t) {
    this.values = t, this.prefixSum = new Uint32Array(t.length), this.prefixSumValidIndex = new Int32Array(1), this.prefixSumValidIndex[0] = -1;
  }
  insertValues(t, n) {
    t = lt(t);
    const i = this.values, r = this.prefixSum, a = n.length;
    return a === 0 ? !1 : (this.values = new Uint32Array(i.length + a), this.values.set(i.subarray(0, t), 0), this.values.set(i.subarray(t), t + a), this.values.set(n, t), t - 1 < this.prefixSumValidIndex[0] && (this.prefixSumValidIndex[0] = t - 1), this.prefixSum = new Uint32Array(this.values.length), this.prefixSumValidIndex[0] >= 0 && this.prefixSum.set(r.subarray(0, this.prefixSumValidIndex[0] + 1)), !0);
  }
  setValue(t, n) {
    return t = lt(t), n = lt(n), this.values[t] === n ? !1 : (this.values[t] = n, t - 1 < this.prefixSumValidIndex[0] && (this.prefixSumValidIndex[0] = t - 1), !0);
  }
  removeValues(t, n) {
    t = lt(t), n = lt(n);
    const i = this.values, r = this.prefixSum;
    if (t >= i.length)
      return !1;
    const a = i.length - t;
    return n >= a && (n = a), n === 0 ? !1 : (this.values = new Uint32Array(i.length - n), this.values.set(i.subarray(0, t), 0), this.values.set(i.subarray(t + n), t), this.prefixSum = new Uint32Array(this.values.length), t - 1 < this.prefixSumValidIndex[0] && (this.prefixSumValidIndex[0] = t - 1), this.prefixSumValidIndex[0] >= 0 && this.prefixSum.set(r.subarray(0, this.prefixSumValidIndex[0] + 1)), !0);
  }
  getTotalSum() {
    return this.values.length === 0 ? 0 : this._getPrefixSum(this.values.length - 1);
  }
  /**
   * Returns the sum of the first `index + 1` many items.
   * @returns `SUM(0 <= j <= index, values[j])`.
   */
  getPrefixSum(t) {
    return t < 0 ? 0 : (t = lt(t), this._getPrefixSum(t));
  }
  _getPrefixSum(t) {
    if (t <= this.prefixSumValidIndex[0])
      return this.prefixSum[t];
    let n = this.prefixSumValidIndex[0] + 1;
    n === 0 && (this.prefixSum[0] = this.values[0], n++), t >= this.values.length && (t = this.values.length - 1);
    for (let i = n; i <= t; i++)
      this.prefixSum[i] = this.prefixSum[i - 1] + this.values[i];
    return this.prefixSumValidIndex[0] = Math.max(this.prefixSumValidIndex[0], t), this.prefixSum[t];
  }
  getIndexOf(t) {
    t = Math.floor(t), this.getTotalSum();
    let n = 0, i = this.values.length - 1, r = 0, a = 0, s = 0;
    for (; n <= i; )
      if (r = n + (i - n) / 2 | 0, a = this.prefixSum[r], s = a - this.values[r], t < s)
        i = r - 1;
      else if (t >= a)
        n = r + 1;
      else
        break;
    return new wo(r, t - s);
  }
}
class wo {
  constructor(t, n) {
    this.index = t, this.remainder = n, this._prefixSumIndexOfResultBrand = void 0, this.index = t, this.remainder = n;
  }
}
class yo {
  constructor(t, n, i, r) {
    this._uri = t, this._lines = n, this._eol = i, this._versionId = r, this._lineStarts = null, this._cachedTextValue = null;
  }
  dispose() {
    this._lines.length = 0;
  }
  get version() {
    return this._versionId;
  }
  getText() {
    return this._cachedTextValue === null && (this._cachedTextValue = this._lines.join(this._eol)), this._cachedTextValue;
  }
  onEvents(t) {
    t.eol && t.eol !== this._eol && (this._eol = t.eol, this._lineStarts = null);
    const n = t.changes;
    for (const i of n)
      this._acceptDeleteRange(i.range), this._acceptInsertText(new Ue(i.range.startLineNumber, i.range.startColumn), i.text);
    this._versionId = t.versionId, this._cachedTextValue = null;
  }
  _ensureLineStarts() {
    if (!this._lineStarts) {
      const t = this._eol.length, n = this._lines.length, i = new Uint32Array(n);
      for (let r = 0; r < n; r++)
        i[r] = this._lines[r].length + t;
      this._lineStarts = new _o(i);
    }
  }
  /**
   * All changes to a line's text go through this method
   */
  _setLineText(t, n) {
    this._lines[t] = n, this._lineStarts && this._lineStarts.setValue(t, this._lines[t].length + this._eol.length);
  }
  _acceptDeleteRange(t) {
    if (t.startLineNumber === t.endLineNumber) {
      if (t.startColumn === t.endColumn)
        return;
      this._setLineText(t.startLineNumber - 1, this._lines[t.startLineNumber - 1].substring(0, t.startColumn - 1) + this._lines[t.startLineNumber - 1].substring(t.endColumn - 1));
      return;
    }
    this._setLineText(t.startLineNumber - 1, this._lines[t.startLineNumber - 1].substring(0, t.startColumn - 1) + this._lines[t.endLineNumber - 1].substring(t.endColumn - 1)), this._lines.splice(t.startLineNumber, t.endLineNumber - t.startLineNumber), this._lineStarts && this._lineStarts.removeValues(t.startLineNumber, t.endLineNumber - t.startLineNumber);
  }
  _acceptInsertText(t, n) {
    if (n.length === 0)
      return;
    const i = Rs(n);
    if (i.length === 1) {
      this._setLineText(t.lineNumber - 1, this._lines[t.lineNumber - 1].substring(0, t.column - 1) + i[0] + this._lines[t.lineNumber - 1].substring(t.column - 1));
      return;
    }
    i[i.length - 1] += this._lines[t.lineNumber - 1].substring(t.column - 1), this._setLineText(t.lineNumber - 1, this._lines[t.lineNumber - 1].substring(0, t.column - 1) + i[0]);
    const r = new Uint32Array(i.length - 1);
    for (let a = 1; a < i.length; a++)
      this._lines.splice(t.lineNumber + a - 1, 0, i[a]), r[a - 1] = i[a].length + this._eol.length;
    this._lineStarts && this._lineStarts.insertValues(t.lineNumber, r);
  }
}
const To = "`~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?";
function xo(e = "") {
  let t = "(-?\\d*\\.\\d\\w*)|([^";
  for (const n of To)
    e.indexOf(n) >= 0 || (t += "\\" + n);
  return t += "\\s]+)", new RegExp(t, "g");
}
const qa = xo();
function ko(e) {
  let t = qa;
  if (e && e instanceof RegExp)
    if (e.global)
      t = e;
    else {
      let n = "g";
      e.ignoreCase && (n += "i"), e.multiline && (n += "m"), e.unicode && (n += "u"), t = new RegExp(e.source, n);
    }
  return t.lastIndex = 0, t;
}
const Oa = new ds();
Oa.unshift({
  maxLen: 1e3,
  windowSize: 15,
  timeBudget: 150
});
function ui(e, t, n, i, r) {
  if (r || (r = Zt.first(Oa)), n.length > r.maxLen) {
    let u = e - r.maxLen / 2;
    return u < 0 ? u = 0 : i += u, n = n.substring(u, e + r.maxLen / 2), ui(e, t, n, i, r);
  }
  const a = Date.now(), s = e - 1 - i;
  let l = -1, o = null;
  for (let u = 1; !(Date.now() - a >= r.timeBudget); u++) {
    const c = s - r.windowSize * u;
    t.lastIndex = Math.max(0, c);
    const h = Ao(t, n, s, l);
    if (!h && o || (o = h, c <= 0))
      break;
    l = c;
  }
  if (o) {
    const u = {
      word: o[0],
      startColumn: i + 1 + o.index,
      endColumn: i + 1 + o.index + o[0].length
    };
    return t.lastIndex = 0, u;
  }
  return null;
}
function Ao(e, t, n, i) {
  let r;
  for (; r = e.exec(t); ) {
    const a = r.index || 0;
    if (a <= n && e.lastIndex >= n)
      return r;
    if (i > 0 && a > i)
      return null;
  }
  return null;
}
class ci {
  constructor(t) {
    const n = Si(t);
    this._defaultValue = n, this._asciiMap = ci._createAsciiMap(n), this._map = /* @__PURE__ */ new Map();
  }
  static _createAsciiMap(t) {
    const n = new Uint8Array(256);
    return n.fill(t), n;
  }
  set(t, n) {
    const i = Si(n);
    t >= 0 && t < 256 ? this._asciiMap[t] = i : this._map.set(t, i);
  }
  get(t) {
    return t >= 0 && t < 256 ? this._asciiMap[t] : this._map.get(t) || this._defaultValue;
  }
  clear() {
    this._asciiMap.fill(this._defaultValue), this._map.clear();
  }
}
class So {
  constructor(t, n, i) {
    const r = new Uint8Array(t * n);
    for (let a = 0, s = t * n; a < s; a++)
      r[a] = i;
    this._data = r, this.rows = t, this.cols = n;
  }
  get(t, n) {
    return this._data[t * this.cols + n];
  }
  set(t, n, i) {
    this._data[t * this.cols + n] = i;
  }
}
class Lo {
  constructor(t) {
    let n = 0, i = 0;
    for (let a = 0, s = t.length; a < s; a++) {
      const [l, o, u] = t[a];
      o > n && (n = o), l > i && (i = l), u > i && (i = u);
    }
    n++, i++;
    const r = new So(
      i,
      n,
      0
      /* State.Invalid */
    );
    for (let a = 0, s = t.length; a < s; a++) {
      const [l, o, u] = t[a];
      r.set(l, o, u);
    }
    this._states = r, this._maxCharCode = n;
  }
  nextState(t, n) {
    return n < 0 || n >= this._maxCharCode ? 0 : this._states.get(t, n);
  }
}
let kn = null;
function Co() {
  return kn === null && (kn = new Lo([
    [
      1,
      104,
      2
      /* State.H */
    ],
    [
      1,
      72,
      2
      /* State.H */
    ],
    [
      1,
      102,
      6
      /* State.F */
    ],
    [
      1,
      70,
      6
      /* State.F */
    ],
    [
      2,
      116,
      3
      /* State.HT */
    ],
    [
      2,
      84,
      3
      /* State.HT */
    ],
    [
      3,
      116,
      4
      /* State.HTT */
    ],
    [
      3,
      84,
      4
      /* State.HTT */
    ],
    [
      4,
      112,
      5
      /* State.HTTP */
    ],
    [
      4,
      80,
      5
      /* State.HTTP */
    ],
    [
      5,
      115,
      9
      /* State.BeforeColon */
    ],
    [
      5,
      83,
      9
      /* State.BeforeColon */
    ],
    [
      5,
      58,
      10
      /* State.AfterColon */
    ],
    [
      6,
      105,
      7
      /* State.FI */
    ],
    [
      6,
      73,
      7
      /* State.FI */
    ],
    [
      7,
      108,
      8
      /* State.FIL */
    ],
    [
      7,
      76,
      8
      /* State.FIL */
    ],
    [
      8,
      101,
      9
      /* State.BeforeColon */
    ],
    [
      8,
      69,
      9
      /* State.BeforeColon */
    ],
    [
      9,
      58,
      10
      /* State.AfterColon */
    ],
    [
      10,
      47,
      11
      /* State.AlmostThere */
    ],
    [
      11,
      47,
      12
      /* State.End */
    ]
  ])), kn;
}
let yt = null;
function Eo() {
  if (yt === null) {
    yt = new ci(
      0
      /* CharacterClass.None */
    );
    const e = ` 	<>'"、。｡､，．：；‘〈「『〔（［｛｢｣｝］）〕』」〉’｀～…`;
    for (let n = 0; n < e.length; n++)
      yt.set(
        e.charCodeAt(n),
        1
        /* CharacterClass.ForceTermination */
      );
    const t = ".,;:";
    for (let n = 0; n < t.length; n++)
      yt.set(
        t.charCodeAt(n),
        2
        /* CharacterClass.CannotEndIn */
      );
  }
  return yt;
}
class tn {
  static _createLink(t, n, i, r, a) {
    let s = a - 1;
    do {
      const l = n.charCodeAt(s);
      if (t.get(l) !== 2)
        break;
      s--;
    } while (s > r);
    if (r > 0) {
      const l = n.charCodeAt(r - 1), o = n.charCodeAt(s);
      (l === 40 && o === 41 || l === 91 && o === 93 || l === 123 && o === 125) && s--;
    }
    return {
      range: {
        startLineNumber: i,
        startColumn: r + 1,
        endLineNumber: i,
        endColumn: s + 2
      },
      url: n.substring(r, s + 1)
    };
  }
  static computeLinks(t, n = Co()) {
    const i = Eo(), r = [];
    for (let a = 1, s = t.getLineCount(); a <= s; a++) {
      const l = t.getLineContent(a), o = l.length;
      let u = 0, c = 0, h = 0, m = 1, f = !1, g = !1, p = !1, w = !1;
      for (; u < o; ) {
        let y = !1;
        const v = l.charCodeAt(u);
        if (m === 13) {
          let x;
          switch (v) {
            case 40:
              f = !0, x = 0;
              break;
            case 41:
              x = f ? 0 : 1;
              break;
            case 91:
              p = !0, g = !0, x = 0;
              break;
            case 93:
              p = !1, x = g ? 0 : 1;
              break;
            case 123:
              w = !0, x = 0;
              break;
            case 125:
              x = w ? 0 : 1;
              break;
            case 39:
            case 34:
            case 96:
              h === v ? x = 1 : h === 39 || h === 34 || h === 96 ? x = 0 : x = 1;
              break;
            case 42:
              x = h === 42 ? 1 : 0;
              break;
            case 124:
              x = h === 124 ? 1 : 0;
              break;
            case 32:
              x = p ? 0 : 1;
              break;
            default:
              x = i.get(v);
          }
          x === 1 && (r.push(tn._createLink(i, l, a, c, u)), y = !0);
        } else if (m === 12) {
          let x;
          v === 91 ? (g = !0, x = 0) : x = i.get(v), x === 1 ? y = !0 : m = 13;
        } else
          m = n.nextState(m, v), m === 0 && (y = !0);
        y && (m = 1, f = !1, g = !1, w = !1, c = u + 1, h = v), u++;
      }
      m === 13 && r.push(tn._createLink(i, l, a, c, o));
    }
    return r;
  }
}
function Mo(e) {
  return !e || typeof e.getLineCount != "function" || typeof e.getLineContent != "function" ? [] : tn.computeLinks(e);
}
class Fn {
  constructor() {
    this._defaultValueSet = [
      ["true", "false"],
      ["True", "False"],
      ["Private", "Public", "Friend", "ReadOnly", "Partial", "Protected", "WriteOnly"],
      ["public", "protected", "private"]
    ];
  }
  navigateValueSet(t, n, i, r, a) {
    if (t && n) {
      const s = this.doNavigateValueSet(n, a);
      if (s)
        return {
          range: t,
          value: s
        };
    }
    if (i && r) {
      const s = this.doNavigateValueSet(r, a);
      if (s)
        return {
          range: i,
          value: s
        };
    }
    return null;
  }
  doNavigateValueSet(t, n) {
    const i = this.numberReplace(t, n);
    return i !== null ? i : this.textReplace(t, n);
  }
  numberReplace(t, n) {
    const i = Math.pow(10, t.length - (t.lastIndexOf(".") + 1));
    let r = Number(t);
    const a = parseFloat(t);
    return !isNaN(r) && !isNaN(a) && r === a ? r === 0 && !n ? null : (r = Math.floor(r * i), r += n ? i : -i, String(r / i)) : null;
  }
  textReplace(t, n) {
    return this.valueSetsReplace(this._defaultValueSet, t, n);
  }
  valueSetsReplace(t, n, i) {
    let r = null;
    for (let a = 0, s = t.length; r === null && a < s; a++)
      r = this.valueSetReplace(t[a], n, i);
    return r;
  }
  valueSetReplace(t, n, i) {
    let r = t.indexOf(n);
    return r >= 0 ? (r += i ? 1 : -1, r < 0 ? r = t.length - 1 : r %= t.length, t[r]) : null;
  }
}
Fn.INSTANCE = new Fn();
const Va = Object.freeze(function(e, t) {
  const n = setTimeout(e.bind(t), 0);
  return { dispose() {
    clearTimeout(n);
  } };
});
var nn;
(function(e) {
  function t(n) {
    return n === e.None || n === e.Cancelled || n instanceof Jt ? !0 : !n || typeof n != "object" ? !1 : typeof n.isCancellationRequested == "boolean" && typeof n.onCancellationRequested == "function";
  }
  e.isCancellationToken = t, e.None = Object.freeze({
    isCancellationRequested: !1,
    onCancellationRequested: Rn.None
  }), e.Cancelled = Object.freeze({
    isCancellationRequested: !0,
    onCancellationRequested: Va
  });
})(nn || (nn = {}));
class Jt {
  constructor() {
    this._isCancelled = !1, this._emitter = null;
  }
  cancel() {
    this._isCancelled || (this._isCancelled = !0, this._emitter && (this._emitter.fire(void 0), this.dispose()));
  }
  get isCancellationRequested() {
    return this._isCancelled;
  }
  get onCancellationRequested() {
    return this._isCancelled ? Va : (this._emitter || (this._emitter = new Le()), this._emitter.event);
  }
  dispose() {
    this._emitter && (this._emitter.dispose(), this._emitter = null);
  }
}
class Ro {
  constructor(t) {
    this._token = void 0, this._parentListener = void 0, this._parentListener = t && t.onCancellationRequested(this.cancel, this);
  }
  get token() {
    return this._token || (this._token = new Jt()), this._token;
  }
  cancel() {
    this._token ? this._token instanceof Jt && this._token.cancel() : this._token = nn.Cancelled;
  }
  dispose(t = !1) {
    var n;
    t && this.cancel(), (n = this._parentListener) === null || n === void 0 || n.dispose(), this._token ? this._token instanceof Jt && this._token.dispose() : this._token = nn.None;
  }
}
class hi {
  constructor() {
    this._keyCodeToStr = [], this._strToKeyCode = /* @__PURE__ */ Object.create(null);
  }
  define(t, n) {
    this._keyCodeToStr[t] = n, this._strToKeyCode[n.toLowerCase()] = t;
  }
  keyCodeToStr(t) {
    return this._keyCodeToStr[t];
  }
  strToKeyCode(t) {
    return this._strToKeyCode[t.toLowerCase()] || 0;
  }
}
const Qt = new hi(), Bn = new hi(), Pn = new hi(), Do = new Array(230), No = /* @__PURE__ */ Object.create(null), Io = /* @__PURE__ */ Object.create(null);
(function() {
  const e = "", t = [
    // immutable, scanCode, scanCodeStr, keyCode, keyCodeStr, eventKeyCode, vkey, usUserSettingsLabel, generalUserSettingsLabel
    [1, 0, "None", 0, "unknown", 0, "VK_UNKNOWN", e, e],
    [1, 1, "Hyper", 0, e, 0, e, e, e],
    [1, 2, "Super", 0, e, 0, e, e, e],
    [1, 3, "Fn", 0, e, 0, e, e, e],
    [1, 4, "FnLock", 0, e, 0, e, e, e],
    [1, 5, "Suspend", 0, e, 0, e, e, e],
    [1, 6, "Resume", 0, e, 0, e, e, e],
    [1, 7, "Turbo", 0, e, 0, e, e, e],
    [1, 8, "Sleep", 0, e, 0, "VK_SLEEP", e, e],
    [1, 9, "WakeUp", 0, e, 0, e, e, e],
    [0, 10, "KeyA", 31, "A", 65, "VK_A", e, e],
    [0, 11, "KeyB", 32, "B", 66, "VK_B", e, e],
    [0, 12, "KeyC", 33, "C", 67, "VK_C", e, e],
    [0, 13, "KeyD", 34, "D", 68, "VK_D", e, e],
    [0, 14, "KeyE", 35, "E", 69, "VK_E", e, e],
    [0, 15, "KeyF", 36, "F", 70, "VK_F", e, e],
    [0, 16, "KeyG", 37, "G", 71, "VK_G", e, e],
    [0, 17, "KeyH", 38, "H", 72, "VK_H", e, e],
    [0, 18, "KeyI", 39, "I", 73, "VK_I", e, e],
    [0, 19, "KeyJ", 40, "J", 74, "VK_J", e, e],
    [0, 20, "KeyK", 41, "K", 75, "VK_K", e, e],
    [0, 21, "KeyL", 42, "L", 76, "VK_L", e, e],
    [0, 22, "KeyM", 43, "M", 77, "VK_M", e, e],
    [0, 23, "KeyN", 44, "N", 78, "VK_N", e, e],
    [0, 24, "KeyO", 45, "O", 79, "VK_O", e, e],
    [0, 25, "KeyP", 46, "P", 80, "VK_P", e, e],
    [0, 26, "KeyQ", 47, "Q", 81, "VK_Q", e, e],
    [0, 27, "KeyR", 48, "R", 82, "VK_R", e, e],
    [0, 28, "KeyS", 49, "S", 83, "VK_S", e, e],
    [0, 29, "KeyT", 50, "T", 84, "VK_T", e, e],
    [0, 30, "KeyU", 51, "U", 85, "VK_U", e, e],
    [0, 31, "KeyV", 52, "V", 86, "VK_V", e, e],
    [0, 32, "KeyW", 53, "W", 87, "VK_W", e, e],
    [0, 33, "KeyX", 54, "X", 88, "VK_X", e, e],
    [0, 34, "KeyY", 55, "Y", 89, "VK_Y", e, e],
    [0, 35, "KeyZ", 56, "Z", 90, "VK_Z", e, e],
    [0, 36, "Digit1", 22, "1", 49, "VK_1", e, e],
    [0, 37, "Digit2", 23, "2", 50, "VK_2", e, e],
    [0, 38, "Digit3", 24, "3", 51, "VK_3", e, e],
    [0, 39, "Digit4", 25, "4", 52, "VK_4", e, e],
    [0, 40, "Digit5", 26, "5", 53, "VK_5", e, e],
    [0, 41, "Digit6", 27, "6", 54, "VK_6", e, e],
    [0, 42, "Digit7", 28, "7", 55, "VK_7", e, e],
    [0, 43, "Digit8", 29, "8", 56, "VK_8", e, e],
    [0, 44, "Digit9", 30, "9", 57, "VK_9", e, e],
    [0, 45, "Digit0", 21, "0", 48, "VK_0", e, e],
    [1, 46, "Enter", 3, "Enter", 13, "VK_RETURN", e, e],
    [1, 47, "Escape", 9, "Escape", 27, "VK_ESCAPE", e, e],
    [1, 48, "Backspace", 1, "Backspace", 8, "VK_BACK", e, e],
    [1, 49, "Tab", 2, "Tab", 9, "VK_TAB", e, e],
    [1, 50, "Space", 10, "Space", 32, "VK_SPACE", e, e],
    [0, 51, "Minus", 88, "-", 189, "VK_OEM_MINUS", "-", "OEM_MINUS"],
    [0, 52, "Equal", 86, "=", 187, "VK_OEM_PLUS", "=", "OEM_PLUS"],
    [0, 53, "BracketLeft", 92, "[", 219, "VK_OEM_4", "[", "OEM_4"],
    [0, 54, "BracketRight", 94, "]", 221, "VK_OEM_6", "]", "OEM_6"],
    [0, 55, "Backslash", 93, "\\", 220, "VK_OEM_5", "\\", "OEM_5"],
    [0, 56, "IntlHash", 0, e, 0, e, e, e],
    // has been dropped from the w3c spec
    [0, 57, "Semicolon", 85, ";", 186, "VK_OEM_1", ";", "OEM_1"],
    [0, 58, "Quote", 95, "'", 222, "VK_OEM_7", "'", "OEM_7"],
    [0, 59, "Backquote", 91, "`", 192, "VK_OEM_3", "`", "OEM_3"],
    [0, 60, "Comma", 87, ",", 188, "VK_OEM_COMMA", ",", "OEM_COMMA"],
    [0, 61, "Period", 89, ".", 190, "VK_OEM_PERIOD", ".", "OEM_PERIOD"],
    [0, 62, "Slash", 90, "/", 191, "VK_OEM_2", "/", "OEM_2"],
    [1, 63, "CapsLock", 8, "CapsLock", 20, "VK_CAPITAL", e, e],
    [1, 64, "F1", 59, "F1", 112, "VK_F1", e, e],
    [1, 65, "F2", 60, "F2", 113, "VK_F2", e, e],
    [1, 66, "F3", 61, "F3", 114, "VK_F3", e, e],
    [1, 67, "F4", 62, "F4", 115, "VK_F4", e, e],
    [1, 68, "F5", 63, "F5", 116, "VK_F5", e, e],
    [1, 69, "F6", 64, "F6", 117, "VK_F6", e, e],
    [1, 70, "F7", 65, "F7", 118, "VK_F7", e, e],
    [1, 71, "F8", 66, "F8", 119, "VK_F8", e, e],
    [1, 72, "F9", 67, "F9", 120, "VK_F9", e, e],
    [1, 73, "F10", 68, "F10", 121, "VK_F10", e, e],
    [1, 74, "F11", 69, "F11", 122, "VK_F11", e, e],
    [1, 75, "F12", 70, "F12", 123, "VK_F12", e, e],
    [1, 76, "PrintScreen", 0, e, 0, e, e, e],
    [1, 77, "ScrollLock", 84, "ScrollLock", 145, "VK_SCROLL", e, e],
    [1, 78, "Pause", 7, "PauseBreak", 19, "VK_PAUSE", e, e],
    [1, 79, "Insert", 19, "Insert", 45, "VK_INSERT", e, e],
    [1, 80, "Home", 14, "Home", 36, "VK_HOME", e, e],
    [1, 81, "PageUp", 11, "PageUp", 33, "VK_PRIOR", e, e],
    [1, 82, "Delete", 20, "Delete", 46, "VK_DELETE", e, e],
    [1, 83, "End", 13, "End", 35, "VK_END", e, e],
    [1, 84, "PageDown", 12, "PageDown", 34, "VK_NEXT", e, e],
    [1, 85, "ArrowRight", 17, "RightArrow", 39, "VK_RIGHT", "Right", e],
    [1, 86, "ArrowLeft", 15, "LeftArrow", 37, "VK_LEFT", "Left", e],
    [1, 87, "ArrowDown", 18, "DownArrow", 40, "VK_DOWN", "Down", e],
    [1, 88, "ArrowUp", 16, "UpArrow", 38, "VK_UP", "Up", e],
    [1, 89, "NumLock", 83, "NumLock", 144, "VK_NUMLOCK", e, e],
    [1, 90, "NumpadDivide", 113, "NumPad_Divide", 111, "VK_DIVIDE", e, e],
    [1, 91, "NumpadMultiply", 108, "NumPad_Multiply", 106, "VK_MULTIPLY", e, e],
    [1, 92, "NumpadSubtract", 111, "NumPad_Subtract", 109, "VK_SUBTRACT", e, e],
    [1, 93, "NumpadAdd", 109, "NumPad_Add", 107, "VK_ADD", e, e],
    [1, 94, "NumpadEnter", 3, e, 0, e, e, e],
    [1, 95, "Numpad1", 99, "NumPad1", 97, "VK_NUMPAD1", e, e],
    [1, 96, "Numpad2", 100, "NumPad2", 98, "VK_NUMPAD2", e, e],
    [1, 97, "Numpad3", 101, "NumPad3", 99, "VK_NUMPAD3", e, e],
    [1, 98, "Numpad4", 102, "NumPad4", 100, "VK_NUMPAD4", e, e],
    [1, 99, "Numpad5", 103, "NumPad5", 101, "VK_NUMPAD5", e, e],
    [1, 100, "Numpad6", 104, "NumPad6", 102, "VK_NUMPAD6", e, e],
    [1, 101, "Numpad7", 105, "NumPad7", 103, "VK_NUMPAD7", e, e],
    [1, 102, "Numpad8", 106, "NumPad8", 104, "VK_NUMPAD8", e, e],
    [1, 103, "Numpad9", 107, "NumPad9", 105, "VK_NUMPAD9", e, e],
    [1, 104, "Numpad0", 98, "NumPad0", 96, "VK_NUMPAD0", e, e],
    [1, 105, "NumpadDecimal", 112, "NumPad_Decimal", 110, "VK_DECIMAL", e, e],
    [0, 106, "IntlBackslash", 97, "OEM_102", 226, "VK_OEM_102", e, e],
    [1, 107, "ContextMenu", 58, "ContextMenu", 93, e, e, e],
    [1, 108, "Power", 0, e, 0, e, e, e],
    [1, 109, "NumpadEqual", 0, e, 0, e, e, e],
    [1, 110, "F13", 71, "F13", 124, "VK_F13", e, e],
    [1, 111, "F14", 72, "F14", 125, "VK_F14", e, e],
    [1, 112, "F15", 73, "F15", 126, "VK_F15", e, e],
    [1, 113, "F16", 74, "F16", 127, "VK_F16", e, e],
    [1, 114, "F17", 75, "F17", 128, "VK_F17", e, e],
    [1, 115, "F18", 76, "F18", 129, "VK_F18", e, e],
    [1, 116, "F19", 77, "F19", 130, "VK_F19", e, e],
    [1, 117, "F20", 78, "F20", 131, "VK_F20", e, e],
    [1, 118, "F21", 79, "F21", 132, "VK_F21", e, e],
    [1, 119, "F22", 80, "F22", 133, "VK_F22", e, e],
    [1, 120, "F23", 81, "F23", 134, "VK_F23", e, e],
    [1, 121, "F24", 82, "F24", 135, "VK_F24", e, e],
    [1, 122, "Open", 0, e, 0, e, e, e],
    [1, 123, "Help", 0, e, 0, e, e, e],
    [1, 124, "Select", 0, e, 0, e, e, e],
    [1, 125, "Again", 0, e, 0, e, e, e],
    [1, 126, "Undo", 0, e, 0, e, e, e],
    [1, 127, "Cut", 0, e, 0, e, e, e],
    [1, 128, "Copy", 0, e, 0, e, e, e],
    [1, 129, "Paste", 0, e, 0, e, e, e],
    [1, 130, "Find", 0, e, 0, e, e, e],
    [1, 131, "AudioVolumeMute", 117, "AudioVolumeMute", 173, "VK_VOLUME_MUTE", e, e],
    [1, 132, "AudioVolumeUp", 118, "AudioVolumeUp", 175, "VK_VOLUME_UP", e, e],
    [1, 133, "AudioVolumeDown", 119, "AudioVolumeDown", 174, "VK_VOLUME_DOWN", e, e],
    [1, 134, "NumpadComma", 110, "NumPad_Separator", 108, "VK_SEPARATOR", e, e],
    [0, 135, "IntlRo", 115, "ABNT_C1", 193, "VK_ABNT_C1", e, e],
    [1, 136, "KanaMode", 0, e, 0, e, e, e],
    [0, 137, "IntlYen", 0, e, 0, e, e, e],
    [1, 138, "Convert", 0, e, 0, e, e, e],
    [1, 139, "NonConvert", 0, e, 0, e, e, e],
    [1, 140, "Lang1", 0, e, 0, e, e, e],
    [1, 141, "Lang2", 0, e, 0, e, e, e],
    [1, 142, "Lang3", 0, e, 0, e, e, e],
    [1, 143, "Lang4", 0, e, 0, e, e, e],
    [1, 144, "Lang5", 0, e, 0, e, e, e],
    [1, 145, "Abort", 0, e, 0, e, e, e],
    [1, 146, "Props", 0, e, 0, e, e, e],
    [1, 147, "NumpadParenLeft", 0, e, 0, e, e, e],
    [1, 148, "NumpadParenRight", 0, e, 0, e, e, e],
    [1, 149, "NumpadBackspace", 0, e, 0, e, e, e],
    [1, 150, "NumpadMemoryStore", 0, e, 0, e, e, e],
    [1, 151, "NumpadMemoryRecall", 0, e, 0, e, e, e],
    [1, 152, "NumpadMemoryClear", 0, e, 0, e, e, e],
    [1, 153, "NumpadMemoryAdd", 0, e, 0, e, e, e],
    [1, 154, "NumpadMemorySubtract", 0, e, 0, e, e, e],
    [1, 155, "NumpadClear", 131, "Clear", 12, "VK_CLEAR", e, e],
    [1, 156, "NumpadClearEntry", 0, e, 0, e, e, e],
    [1, 0, e, 5, "Ctrl", 17, "VK_CONTROL", e, e],
    [1, 0, e, 4, "Shift", 16, "VK_SHIFT", e, e],
    [1, 0, e, 6, "Alt", 18, "VK_MENU", e, e],
    [1, 0, e, 57, "Meta", 91, "VK_COMMAND", e, e],
    [1, 157, "ControlLeft", 5, e, 0, "VK_LCONTROL", e, e],
    [1, 158, "ShiftLeft", 4, e, 0, "VK_LSHIFT", e, e],
    [1, 159, "AltLeft", 6, e, 0, "VK_LMENU", e, e],
    [1, 160, "MetaLeft", 57, e, 0, "VK_LWIN", e, e],
    [1, 161, "ControlRight", 5, e, 0, "VK_RCONTROL", e, e],
    [1, 162, "ShiftRight", 4, e, 0, "VK_RSHIFT", e, e],
    [1, 163, "AltRight", 6, e, 0, "VK_RMENU", e, e],
    [1, 164, "MetaRight", 57, e, 0, "VK_RWIN", e, e],
    [1, 165, "BrightnessUp", 0, e, 0, e, e, e],
    [1, 166, "BrightnessDown", 0, e, 0, e, e, e],
    [1, 167, "MediaPlay", 0, e, 0, e, e, e],
    [1, 168, "MediaRecord", 0, e, 0, e, e, e],
    [1, 169, "MediaFastForward", 0, e, 0, e, e, e],
    [1, 170, "MediaRewind", 0, e, 0, e, e, e],
    [1, 171, "MediaTrackNext", 124, "MediaTrackNext", 176, "VK_MEDIA_NEXT_TRACK", e, e],
    [1, 172, "MediaTrackPrevious", 125, "MediaTrackPrevious", 177, "VK_MEDIA_PREV_TRACK", e, e],
    [1, 173, "MediaStop", 126, "MediaStop", 178, "VK_MEDIA_STOP", e, e],
    [1, 174, "Eject", 0, e, 0, e, e, e],
    [1, 175, "MediaPlayPause", 127, "MediaPlayPause", 179, "VK_MEDIA_PLAY_PAUSE", e, e],
    [1, 176, "MediaSelect", 128, "LaunchMediaPlayer", 181, "VK_MEDIA_LAUNCH_MEDIA_SELECT", e, e],
    [1, 177, "LaunchMail", 129, "LaunchMail", 180, "VK_MEDIA_LAUNCH_MAIL", e, e],
    [1, 178, "LaunchApp2", 130, "LaunchApp2", 183, "VK_MEDIA_LAUNCH_APP2", e, e],
    [1, 179, "LaunchApp1", 0, e, 0, "VK_MEDIA_LAUNCH_APP1", e, e],
    [1, 180, "SelectTask", 0, e, 0, e, e, e],
    [1, 181, "LaunchScreenSaver", 0, e, 0, e, e, e],
    [1, 182, "BrowserSearch", 120, "BrowserSearch", 170, "VK_BROWSER_SEARCH", e, e],
    [1, 183, "BrowserHome", 121, "BrowserHome", 172, "VK_BROWSER_HOME", e, e],
    [1, 184, "BrowserBack", 122, "BrowserBack", 166, "VK_BROWSER_BACK", e, e],
    [1, 185, "BrowserForward", 123, "BrowserForward", 167, "VK_BROWSER_FORWARD", e, e],
    [1, 186, "BrowserStop", 0, e, 0, "VK_BROWSER_STOP", e, e],
    [1, 187, "BrowserRefresh", 0, e, 0, "VK_BROWSER_REFRESH", e, e],
    [1, 188, "BrowserFavorites", 0, e, 0, "VK_BROWSER_FAVORITES", e, e],
    [1, 189, "ZoomToggle", 0, e, 0, e, e, e],
    [1, 190, "MailReply", 0, e, 0, e, e, e],
    [1, 191, "MailForward", 0, e, 0, e, e, e],
    [1, 192, "MailSend", 0, e, 0, e, e, e],
    // See https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
    // If an Input Method Editor is processing key input and the event is keydown, return 229.
    [1, 0, e, 114, "KeyInComposition", 229, e, e, e],
    [1, 0, e, 116, "ABNT_C2", 194, "VK_ABNT_C2", e, e],
    [1, 0, e, 96, "OEM_8", 223, "VK_OEM_8", e, e],
    [1, 0, e, 0, e, 0, "VK_KANA", e, e],
    [1, 0, e, 0, e, 0, "VK_HANGUL", e, e],
    [1, 0, e, 0, e, 0, "VK_JUNJA", e, e],
    [1, 0, e, 0, e, 0, "VK_FINAL", e, e],
    [1, 0, e, 0, e, 0, "VK_HANJA", e, e],
    [1, 0, e, 0, e, 0, "VK_KANJI", e, e],
    [1, 0, e, 0, e, 0, "VK_CONVERT", e, e],
    [1, 0, e, 0, e, 0, "VK_NONCONVERT", e, e],
    [1, 0, e, 0, e, 0, "VK_ACCEPT", e, e],
    [1, 0, e, 0, e, 0, "VK_MODECHANGE", e, e],
    [1, 0, e, 0, e, 0, "VK_SELECT", e, e],
    [1, 0, e, 0, e, 0, "VK_PRINT", e, e],
    [1, 0, e, 0, e, 0, "VK_EXECUTE", e, e],
    [1, 0, e, 0, e, 0, "VK_SNAPSHOT", e, e],
    [1, 0, e, 0, e, 0, "VK_HELP", e, e],
    [1, 0, e, 0, e, 0, "VK_APPS", e, e],
    [1, 0, e, 0, e, 0, "VK_PROCESSKEY", e, e],
    [1, 0, e, 0, e, 0, "VK_PACKET", e, e],
    [1, 0, e, 0, e, 0, "VK_DBE_SBCSCHAR", e, e],
    [1, 0, e, 0, e, 0, "VK_DBE_DBCSCHAR", e, e],
    [1, 0, e, 0, e, 0, "VK_ATTN", e, e],
    [1, 0, e, 0, e, 0, "VK_CRSEL", e, e],
    [1, 0, e, 0, e, 0, "VK_EXSEL", e, e],
    [1, 0, e, 0, e, 0, "VK_EREOF", e, e],
    [1, 0, e, 0, e, 0, "VK_PLAY", e, e],
    [1, 0, e, 0, e, 0, "VK_ZOOM", e, e],
    [1, 0, e, 0, e, 0, "VK_NONAME", e, e],
    [1, 0, e, 0, e, 0, "VK_PA1", e, e],
    [1, 0, e, 0, e, 0, "VK_OEM_CLEAR", e, e]
  ], n = [], i = [];
  for (const r of t) {
    const [a, s, l, o, u, c, h, m, f] = r;
    if (i[s] || (i[s] = !0, No[l] = s, Io[l.toLowerCase()] = s), !n[o]) {
      if (n[o] = !0, !u)
        throw new Error(`String representation missing for key code ${o} around scan code ${l}`);
      Qt.define(o, u), Bn.define(o, m || u), Pn.define(o, f || m || u);
    }
    c && (Do[c] = o);
  }
})();
var Li;
(function(e) {
  function t(l) {
    return Qt.keyCodeToStr(l);
  }
  e.toString = t;
  function n(l) {
    return Qt.strToKeyCode(l);
  }
  e.fromString = n;
  function i(l) {
    return Bn.keyCodeToStr(l);
  }
  e.toUserSettingsUS = i;
  function r(l) {
    return Pn.keyCodeToStr(l);
  }
  e.toUserSettingsGeneral = r;
  function a(l) {
    return Bn.strToKeyCode(l) || Pn.strToKeyCode(l);
  }
  e.fromUserSettings = a;
  function s(l) {
    if (l >= 98 && l <= 113)
      return null;
    switch (l) {
      case 16:
        return "Up";
      case 18:
        return "Down";
      case 15:
        return "Left";
      case 17:
        return "Right";
    }
    return Qt.keyCodeToStr(l);
  }
  e.toElectronAccelerator = s;
})(Li || (Li = {}));
function zo(e, t) {
  const n = (t & 65535) << 16 >>> 0;
  return (e | n) >>> 0;
}
class _e extends oe {
  constructor(t, n, i, r) {
    super(t, n, i, r), this.selectionStartLineNumber = t, this.selectionStartColumn = n, this.positionLineNumber = i, this.positionColumn = r;
  }
  /**
   * Transform to a human-readable representation.
   */
  toString() {
    return "[" + this.selectionStartLineNumber + "," + this.selectionStartColumn + " -> " + this.positionLineNumber + "," + this.positionColumn + "]";
  }
  /**
   * Test if equals other selection.
   */
  equalsSelection(t) {
    return _e.selectionsEqual(this, t);
  }
  /**
   * Test if the two selections are equal.
   */
  static selectionsEqual(t, n) {
    return t.selectionStartLineNumber === n.selectionStartLineNumber && t.selectionStartColumn === n.selectionStartColumn && t.positionLineNumber === n.positionLineNumber && t.positionColumn === n.positionColumn;
  }
  /**
   * Get directions (LTR or RTL).
   */
  getDirection() {
    return this.selectionStartLineNumber === this.startLineNumber && this.selectionStartColumn === this.startColumn ? 0 : 1;
  }
  /**
   * Create a new selection with a different `positionLineNumber` and `positionColumn`.
   */
  setEndPosition(t, n) {
    return this.getDirection() === 0 ? new _e(this.startLineNumber, this.startColumn, t, n) : new _e(t, n, this.startLineNumber, this.startColumn);
  }
  /**
   * Get the position at `positionLineNumber` and `positionColumn`.
   */
  getPosition() {
    return new Ue(this.positionLineNumber, this.positionColumn);
  }
  /**
   * Get the position at the start of the selection.
  */
  getSelectionStart() {
    return new Ue(this.selectionStartLineNumber, this.selectionStartColumn);
  }
  /**
   * Create a new selection with a different `selectionStartLineNumber` and `selectionStartColumn`.
   */
  setStartPosition(t, n) {
    return this.getDirection() === 0 ? new _e(t, n, this.endLineNumber, this.endColumn) : new _e(this.endLineNumber, this.endColumn, t, n);
  }
  // ----
  /**
   * Create a `Selection` from one or two positions
   */
  static fromPositions(t, n = t) {
    return new _e(t.lineNumber, t.column, n.lineNumber, n.column);
  }
  /**
   * Creates a `Selection` from a range, given a direction.
   */
  static fromRange(t, n) {
    return n === 0 ? new _e(t.startLineNumber, t.startColumn, t.endLineNumber, t.endColumn) : new _e(t.endLineNumber, t.endColumn, t.startLineNumber, t.startColumn);
  }
  /**
   * Create a `Selection` from an `ISelection`.
   */
  static liftSelection(t) {
    return new _e(t.selectionStartLineNumber, t.selectionStartColumn, t.positionLineNumber, t.positionColumn);
  }
  /**
   * `a` equals `b`.
   */
  static selectionsArrEqual(t, n) {
    if (t && !n || !t && n)
      return !1;
    if (!t && !n)
      return !0;
    if (t.length !== n.length)
      return !1;
    for (let i = 0, r = t.length; i < r; i++)
      if (!this.selectionsEqual(t[i], n[i]))
        return !1;
    return !0;
  }
  /**
   * Test if `obj` is an `ISelection`.
   */
  static isISelection(t) {
    return t && typeof t.selectionStartLineNumber == "number" && typeof t.selectionStartColumn == "number" && typeof t.positionLineNumber == "number" && typeof t.positionColumn == "number";
  }
  /**
   * Create with a direction.
   */
  static createWithDirection(t, n, i, r, a) {
    return a === 0 ? new _e(t, n, i, r) : new _e(i, r, t, n);
  }
}
const Ci = /* @__PURE__ */ Object.create(null);
function d(e, t) {
  if (vs(t)) {
    const n = Ci[t];
    if (n === void 0)
      throw new Error(`${e} references an unknown codicon: ${t}`);
    t = n;
  }
  return Ci[e] = t, { id: e };
}
const O = {
  // built-in icons, with image name
  add: d("add", 6e4),
  plus: d("plus", 6e4),
  gistNew: d("gist-new", 6e4),
  repoCreate: d("repo-create", 6e4),
  lightbulb: d("lightbulb", 60001),
  lightBulb: d("light-bulb", 60001),
  repo: d("repo", 60002),
  repoDelete: d("repo-delete", 60002),
  gistFork: d("gist-fork", 60003),
  repoForked: d("repo-forked", 60003),
  gitPullRequest: d("git-pull-request", 60004),
  gitPullRequestAbandoned: d("git-pull-request-abandoned", 60004),
  recordKeys: d("record-keys", 60005),
  keyboard: d("keyboard", 60005),
  tag: d("tag", 60006),
  tagAdd: d("tag-add", 60006),
  tagRemove: d("tag-remove", 60006),
  gitPullRequestLabel: d("git-pull-request-label", 60006),
  person: d("person", 60007),
  personFollow: d("person-follow", 60007),
  personOutline: d("person-outline", 60007),
  personFilled: d("person-filled", 60007),
  gitBranch: d("git-branch", 60008),
  gitBranchCreate: d("git-branch-create", 60008),
  gitBranchDelete: d("git-branch-delete", 60008),
  sourceControl: d("source-control", 60008),
  mirror: d("mirror", 60009),
  mirrorPublic: d("mirror-public", 60009),
  star: d("star", 60010),
  starAdd: d("star-add", 60010),
  starDelete: d("star-delete", 60010),
  starEmpty: d("star-empty", 60010),
  comment: d("comment", 60011),
  commentAdd: d("comment-add", 60011),
  alert: d("alert", 60012),
  warning: d("warning", 60012),
  search: d("search", 60013),
  searchSave: d("search-save", 60013),
  logOut: d("log-out", 60014),
  signOut: d("sign-out", 60014),
  logIn: d("log-in", 60015),
  signIn: d("sign-in", 60015),
  eye: d("eye", 60016),
  eyeUnwatch: d("eye-unwatch", 60016),
  eyeWatch: d("eye-watch", 60016),
  circleFilled: d("circle-filled", 60017),
  primitiveDot: d("primitive-dot", 60017),
  closeDirty: d("close-dirty", 60017),
  debugBreakpoint: d("debug-breakpoint", 60017),
  debugBreakpointDisabled: d("debug-breakpoint-disabled", 60017),
  debugHint: d("debug-hint", 60017),
  primitiveSquare: d("primitive-square", 60018),
  edit: d("edit", 60019),
  pencil: d("pencil", 60019),
  info: d("info", 60020),
  issueOpened: d("issue-opened", 60020),
  gistPrivate: d("gist-private", 60021),
  gitForkPrivate: d("git-fork-private", 60021),
  lock: d("lock", 60021),
  mirrorPrivate: d("mirror-private", 60021),
  close: d("close", 60022),
  removeClose: d("remove-close", 60022),
  x: d("x", 60022),
  repoSync: d("repo-sync", 60023),
  sync: d("sync", 60023),
  clone: d("clone", 60024),
  desktopDownload: d("desktop-download", 60024),
  beaker: d("beaker", 60025),
  microscope: d("microscope", 60025),
  vm: d("vm", 60026),
  deviceDesktop: d("device-desktop", 60026),
  file: d("file", 60027),
  fileText: d("file-text", 60027),
  more: d("more", 60028),
  ellipsis: d("ellipsis", 60028),
  kebabHorizontal: d("kebab-horizontal", 60028),
  mailReply: d("mail-reply", 60029),
  reply: d("reply", 60029),
  organization: d("organization", 60030),
  organizationFilled: d("organization-filled", 60030),
  organizationOutline: d("organization-outline", 60030),
  newFile: d("new-file", 60031),
  fileAdd: d("file-add", 60031),
  newFolder: d("new-folder", 60032),
  fileDirectoryCreate: d("file-directory-create", 60032),
  trash: d("trash", 60033),
  trashcan: d("trashcan", 60033),
  history: d("history", 60034),
  clock: d("clock", 60034),
  folder: d("folder", 60035),
  fileDirectory: d("file-directory", 60035),
  symbolFolder: d("symbol-folder", 60035),
  logoGithub: d("logo-github", 60036),
  markGithub: d("mark-github", 60036),
  github: d("github", 60036),
  terminal: d("terminal", 60037),
  console: d("console", 60037),
  repl: d("repl", 60037),
  zap: d("zap", 60038),
  symbolEvent: d("symbol-event", 60038),
  error: d("error", 60039),
  stop: d("stop", 60039),
  variable: d("variable", 60040),
  symbolVariable: d("symbol-variable", 60040),
  array: d("array", 60042),
  symbolArray: d("symbol-array", 60042),
  symbolModule: d("symbol-module", 60043),
  symbolPackage: d("symbol-package", 60043),
  symbolNamespace: d("symbol-namespace", 60043),
  symbolObject: d("symbol-object", 60043),
  symbolMethod: d("symbol-method", 60044),
  symbolFunction: d("symbol-function", 60044),
  symbolConstructor: d("symbol-constructor", 60044),
  symbolBoolean: d("symbol-boolean", 60047),
  symbolNull: d("symbol-null", 60047),
  symbolNumeric: d("symbol-numeric", 60048),
  symbolNumber: d("symbol-number", 60048),
  symbolStructure: d("symbol-structure", 60049),
  symbolStruct: d("symbol-struct", 60049),
  symbolParameter: d("symbol-parameter", 60050),
  symbolTypeParameter: d("symbol-type-parameter", 60050),
  symbolKey: d("symbol-key", 60051),
  symbolText: d("symbol-text", 60051),
  symbolReference: d("symbol-reference", 60052),
  goToFile: d("go-to-file", 60052),
  symbolEnum: d("symbol-enum", 60053),
  symbolValue: d("symbol-value", 60053),
  symbolRuler: d("symbol-ruler", 60054),
  symbolUnit: d("symbol-unit", 60054),
  activateBreakpoints: d("activate-breakpoints", 60055),
  archive: d("archive", 60056),
  arrowBoth: d("arrow-both", 60057),
  arrowDown: d("arrow-down", 60058),
  arrowLeft: d("arrow-left", 60059),
  arrowRight: d("arrow-right", 60060),
  arrowSmallDown: d("arrow-small-down", 60061),
  arrowSmallLeft: d("arrow-small-left", 60062),
  arrowSmallRight: d("arrow-small-right", 60063),
  arrowSmallUp: d("arrow-small-up", 60064),
  arrowUp: d("arrow-up", 60065),
  bell: d("bell", 60066),
  bold: d("bold", 60067),
  book: d("book", 60068),
  bookmark: d("bookmark", 60069),
  debugBreakpointConditionalUnverified: d("debug-breakpoint-conditional-unverified", 60070),
  debugBreakpointConditional: d("debug-breakpoint-conditional", 60071),
  debugBreakpointConditionalDisabled: d("debug-breakpoint-conditional-disabled", 60071),
  debugBreakpointDataUnverified: d("debug-breakpoint-data-unverified", 60072),
  debugBreakpointData: d("debug-breakpoint-data", 60073),
  debugBreakpointDataDisabled: d("debug-breakpoint-data-disabled", 60073),
  debugBreakpointLogUnverified: d("debug-breakpoint-log-unverified", 60074),
  debugBreakpointLog: d("debug-breakpoint-log", 60075),
  debugBreakpointLogDisabled: d("debug-breakpoint-log-disabled", 60075),
  briefcase: d("briefcase", 60076),
  broadcast: d("broadcast", 60077),
  browser: d("browser", 60078),
  bug: d("bug", 60079),
  calendar: d("calendar", 60080),
  caseSensitive: d("case-sensitive", 60081),
  check: d("check", 60082),
  checklist: d("checklist", 60083),
  chevronDown: d("chevron-down", 60084),
  dropDownButton: d("drop-down-button", 60084),
  chevronLeft: d("chevron-left", 60085),
  chevronRight: d("chevron-right", 60086),
  chevronUp: d("chevron-up", 60087),
  chromeClose: d("chrome-close", 60088),
  chromeMaximize: d("chrome-maximize", 60089),
  chromeMinimize: d("chrome-minimize", 60090),
  chromeRestore: d("chrome-restore", 60091),
  circle: d("circle", 60092),
  circleOutline: d("circle-outline", 60092),
  debugBreakpointUnverified: d("debug-breakpoint-unverified", 60092),
  circleSlash: d("circle-slash", 60093),
  circuitBoard: d("circuit-board", 60094),
  clearAll: d("clear-all", 60095),
  clippy: d("clippy", 60096),
  closeAll: d("close-all", 60097),
  cloudDownload: d("cloud-download", 60098),
  cloudUpload: d("cloud-upload", 60099),
  code: d("code", 60100),
  collapseAll: d("collapse-all", 60101),
  colorMode: d("color-mode", 60102),
  commentDiscussion: d("comment-discussion", 60103),
  compareChanges: d("compare-changes", 60157),
  creditCard: d("credit-card", 60105),
  dash: d("dash", 60108),
  dashboard: d("dashboard", 60109),
  database: d("database", 60110),
  debugContinue: d("debug-continue", 60111),
  debugDisconnect: d("debug-disconnect", 60112),
  debugPause: d("debug-pause", 60113),
  debugRestart: d("debug-restart", 60114),
  debugStart: d("debug-start", 60115),
  debugStepInto: d("debug-step-into", 60116),
  debugStepOut: d("debug-step-out", 60117),
  debugStepOver: d("debug-step-over", 60118),
  debugStop: d("debug-stop", 60119),
  debug: d("debug", 60120),
  deviceCameraVideo: d("device-camera-video", 60121),
  deviceCamera: d("device-camera", 60122),
  deviceMobile: d("device-mobile", 60123),
  diffAdded: d("diff-added", 60124),
  diffIgnored: d("diff-ignored", 60125),
  diffModified: d("diff-modified", 60126),
  diffRemoved: d("diff-removed", 60127),
  diffRenamed: d("diff-renamed", 60128),
  diff: d("diff", 60129),
  discard: d("discard", 60130),
  editorLayout: d("editor-layout", 60131),
  emptyWindow: d("empty-window", 60132),
  exclude: d("exclude", 60133),
  extensions: d("extensions", 60134),
  eyeClosed: d("eye-closed", 60135),
  fileBinary: d("file-binary", 60136),
  fileCode: d("file-code", 60137),
  fileMedia: d("file-media", 60138),
  filePdf: d("file-pdf", 60139),
  fileSubmodule: d("file-submodule", 60140),
  fileSymlinkDirectory: d("file-symlink-directory", 60141),
  fileSymlinkFile: d("file-symlink-file", 60142),
  fileZip: d("file-zip", 60143),
  files: d("files", 60144),
  filter: d("filter", 60145),
  flame: d("flame", 60146),
  foldDown: d("fold-down", 60147),
  foldUp: d("fold-up", 60148),
  fold: d("fold", 60149),
  folderActive: d("folder-active", 60150),
  folderOpened: d("folder-opened", 60151),
  gear: d("gear", 60152),
  gift: d("gift", 60153),
  gistSecret: d("gist-secret", 60154),
  gist: d("gist", 60155),
  gitCommit: d("git-commit", 60156),
  gitCompare: d("git-compare", 60157),
  gitMerge: d("git-merge", 60158),
  githubAction: d("github-action", 60159),
  githubAlt: d("github-alt", 60160),
  globe: d("globe", 60161),
  grabber: d("grabber", 60162),
  graph: d("graph", 60163),
  gripper: d("gripper", 60164),
  heart: d("heart", 60165),
  home: d("home", 60166),
  horizontalRule: d("horizontal-rule", 60167),
  hubot: d("hubot", 60168),
  inbox: d("inbox", 60169),
  issueClosed: d("issue-closed", 60324),
  issueReopened: d("issue-reopened", 60171),
  issues: d("issues", 60172),
  italic: d("italic", 60173),
  jersey: d("jersey", 60174),
  json: d("json", 60175),
  bracket: d("bracket", 60175),
  kebabVertical: d("kebab-vertical", 60176),
  key: d("key", 60177),
  law: d("law", 60178),
  lightbulbAutofix: d("lightbulb-autofix", 60179),
  linkExternal: d("link-external", 60180),
  link: d("link", 60181),
  listOrdered: d("list-ordered", 60182),
  listUnordered: d("list-unordered", 60183),
  liveShare: d("live-share", 60184),
  loading: d("loading", 60185),
  location: d("location", 60186),
  mailRead: d("mail-read", 60187),
  mail: d("mail", 60188),
  markdown: d("markdown", 60189),
  megaphone: d("megaphone", 60190),
  mention: d("mention", 60191),
  milestone: d("milestone", 60192),
  gitPullRequestMilestone: d("git-pull-request-milestone", 60192),
  mortarBoard: d("mortar-board", 60193),
  move: d("move", 60194),
  multipleWindows: d("multiple-windows", 60195),
  mute: d("mute", 60196),
  noNewline: d("no-newline", 60197),
  note: d("note", 60198),
  octoface: d("octoface", 60199),
  openPreview: d("open-preview", 60200),
  package: d("package", 60201),
  paintcan: d("paintcan", 60202),
  pin: d("pin", 60203),
  play: d("play", 60204),
  run: d("run", 60204),
  plug: d("plug", 60205),
  preserveCase: d("preserve-case", 60206),
  preview: d("preview", 60207),
  project: d("project", 60208),
  pulse: d("pulse", 60209),
  question: d("question", 60210),
  quote: d("quote", 60211),
  radioTower: d("radio-tower", 60212),
  reactions: d("reactions", 60213),
  references: d("references", 60214),
  refresh: d("refresh", 60215),
  regex: d("regex", 60216),
  remoteExplorer: d("remote-explorer", 60217),
  remote: d("remote", 60218),
  remove: d("remove", 60219),
  replaceAll: d("replace-all", 60220),
  replace: d("replace", 60221),
  repoClone: d("repo-clone", 60222),
  repoForcePush: d("repo-force-push", 60223),
  repoPull: d("repo-pull", 60224),
  repoPush: d("repo-push", 60225),
  report: d("report", 60226),
  requestChanges: d("request-changes", 60227),
  rocket: d("rocket", 60228),
  rootFolderOpened: d("root-folder-opened", 60229),
  rootFolder: d("root-folder", 60230),
  rss: d("rss", 60231),
  ruby: d("ruby", 60232),
  saveAll: d("save-all", 60233),
  saveAs: d("save-as", 60234),
  save: d("save", 60235),
  screenFull: d("screen-full", 60236),
  screenNormal: d("screen-normal", 60237),
  searchStop: d("search-stop", 60238),
  server: d("server", 60240),
  settingsGear: d("settings-gear", 60241),
  settings: d("settings", 60242),
  shield: d("shield", 60243),
  smiley: d("smiley", 60244),
  sortPrecedence: d("sort-precedence", 60245),
  splitHorizontal: d("split-horizontal", 60246),
  splitVertical: d("split-vertical", 60247),
  squirrel: d("squirrel", 60248),
  starFull: d("star-full", 60249),
  starHalf: d("star-half", 60250),
  symbolClass: d("symbol-class", 60251),
  symbolColor: d("symbol-color", 60252),
  symbolCustomColor: d("symbol-customcolor", 60252),
  symbolConstant: d("symbol-constant", 60253),
  symbolEnumMember: d("symbol-enum-member", 60254),
  symbolField: d("symbol-field", 60255),
  symbolFile: d("symbol-file", 60256),
  symbolInterface: d("symbol-interface", 60257),
  symbolKeyword: d("symbol-keyword", 60258),
  symbolMisc: d("symbol-misc", 60259),
  symbolOperator: d("symbol-operator", 60260),
  symbolProperty: d("symbol-property", 60261),
  wrench: d("wrench", 60261),
  wrenchSubaction: d("wrench-subaction", 60261),
  symbolSnippet: d("symbol-snippet", 60262),
  tasklist: d("tasklist", 60263),
  telescope: d("telescope", 60264),
  textSize: d("text-size", 60265),
  threeBars: d("three-bars", 60266),
  thumbsdown: d("thumbsdown", 60267),
  thumbsup: d("thumbsup", 60268),
  tools: d("tools", 60269),
  triangleDown: d("triangle-down", 60270),
  triangleLeft: d("triangle-left", 60271),
  triangleRight: d("triangle-right", 60272),
  triangleUp: d("triangle-up", 60273),
  twitter: d("twitter", 60274),
  unfold: d("unfold", 60275),
  unlock: d("unlock", 60276),
  unmute: d("unmute", 60277),
  unverified: d("unverified", 60278),
  verified: d("verified", 60279),
  versions: d("versions", 60280),
  vmActive: d("vm-active", 60281),
  vmOutline: d("vm-outline", 60282),
  vmRunning: d("vm-running", 60283),
  watch: d("watch", 60284),
  whitespace: d("whitespace", 60285),
  wholeWord: d("whole-word", 60286),
  window: d("window", 60287),
  wordWrap: d("word-wrap", 60288),
  zoomIn: d("zoom-in", 60289),
  zoomOut: d("zoom-out", 60290),
  listFilter: d("list-filter", 60291),
  listFlat: d("list-flat", 60292),
  listSelection: d("list-selection", 60293),
  selection: d("selection", 60293),
  listTree: d("list-tree", 60294),
  debugBreakpointFunctionUnverified: d("debug-breakpoint-function-unverified", 60295),
  debugBreakpointFunction: d("debug-breakpoint-function", 60296),
  debugBreakpointFunctionDisabled: d("debug-breakpoint-function-disabled", 60296),
  debugStackframeActive: d("debug-stackframe-active", 60297),
  circleSmallFilled: d("circle-small-filled", 60298),
  debugStackframeDot: d("debug-stackframe-dot", 60298),
  debugStackframe: d("debug-stackframe", 60299),
  debugStackframeFocused: d("debug-stackframe-focused", 60299),
  debugBreakpointUnsupported: d("debug-breakpoint-unsupported", 60300),
  symbolString: d("symbol-string", 60301),
  debugReverseContinue: d("debug-reverse-continue", 60302),
  debugStepBack: d("debug-step-back", 60303),
  debugRestartFrame: d("debug-restart-frame", 60304),
  callIncoming: d("call-incoming", 60306),
  callOutgoing: d("call-outgoing", 60307),
  menu: d("menu", 60308),
  expandAll: d("expand-all", 60309),
  feedback: d("feedback", 60310),
  gitPullRequestReviewer: d("git-pull-request-reviewer", 60310),
  groupByRefType: d("group-by-ref-type", 60311),
  ungroupByRefType: d("ungroup-by-ref-type", 60312),
  account: d("account", 60313),
  gitPullRequestAssignee: d("git-pull-request-assignee", 60313),
  bellDot: d("bell-dot", 60314),
  debugConsole: d("debug-console", 60315),
  library: d("library", 60316),
  output: d("output", 60317),
  runAll: d("run-all", 60318),
  syncIgnored: d("sync-ignored", 60319),
  pinned: d("pinned", 60320),
  githubInverted: d("github-inverted", 60321),
  debugAlt: d("debug-alt", 60305),
  serverProcess: d("server-process", 60322),
  serverEnvironment: d("server-environment", 60323),
  pass: d("pass", 60324),
  stopCircle: d("stop-circle", 60325),
  playCircle: d("play-circle", 60326),
  record: d("record", 60327),
  debugAltSmall: d("debug-alt-small", 60328),
  vmConnect: d("vm-connect", 60329),
  cloud: d("cloud", 60330),
  merge: d("merge", 60331),
  exportIcon: d("export", 60332),
  graphLeft: d("graph-left", 60333),
  magnet: d("magnet", 60334),
  notebook: d("notebook", 60335),
  redo: d("redo", 60336),
  checkAll: d("check-all", 60337),
  pinnedDirty: d("pinned-dirty", 60338),
  passFilled: d("pass-filled", 60339),
  circleLargeFilled: d("circle-large-filled", 60340),
  circleLarge: d("circle-large", 60341),
  circleLargeOutline: d("circle-large-outline", 60341),
  combine: d("combine", 60342),
  gather: d("gather", 60342),
  table: d("table", 60343),
  variableGroup: d("variable-group", 60344),
  typeHierarchy: d("type-hierarchy", 60345),
  typeHierarchySub: d("type-hierarchy-sub", 60346),
  typeHierarchySuper: d("type-hierarchy-super", 60347),
  gitPullRequestCreate: d("git-pull-request-create", 60348),
  runAbove: d("run-above", 60349),
  runBelow: d("run-below", 60350),
  notebookTemplate: d("notebook-template", 60351),
  debugRerun: d("debug-rerun", 60352),
  workspaceTrusted: d("workspace-trusted", 60353),
  workspaceUntrusted: d("workspace-untrusted", 60354),
  workspaceUnspecified: d("workspace-unspecified", 60355),
  terminalCmd: d("terminal-cmd", 60356),
  terminalDebian: d("terminal-debian", 60357),
  terminalLinux: d("terminal-linux", 60358),
  terminalPowershell: d("terminal-powershell", 60359),
  terminalTmux: d("terminal-tmux", 60360),
  terminalUbuntu: d("terminal-ubuntu", 60361),
  terminalBash: d("terminal-bash", 60362),
  arrowSwap: d("arrow-swap", 60363),
  copy: d("copy", 60364),
  personAdd: d("person-add", 60365),
  filterFilled: d("filter-filled", 60366),
  wand: d("wand", 60367),
  debugLineByLine: d("debug-line-by-line", 60368),
  inspect: d("inspect", 60369),
  layers: d("layers", 60370),
  layersDot: d("layers-dot", 60371),
  layersActive: d("layers-active", 60372),
  compass: d("compass", 60373),
  compassDot: d("compass-dot", 60374),
  compassActive: d("compass-active", 60375),
  azure: d("azure", 60376),
  issueDraft: d("issue-draft", 60377),
  gitPullRequestClosed: d("git-pull-request-closed", 60378),
  gitPullRequestDraft: d("git-pull-request-draft", 60379),
  debugAll: d("debug-all", 60380),
  debugCoverage: d("debug-coverage", 60381),
  runErrors: d("run-errors", 60382),
  folderLibrary: d("folder-library", 60383),
  debugContinueSmall: d("debug-continue-small", 60384),
  beakerStop: d("beaker-stop", 60385),
  graphLine: d("graph-line", 60386),
  graphScatter: d("graph-scatter", 60387),
  pieChart: d("pie-chart", 60388),
  bracketDot: d("bracket-dot", 60389),
  bracketError: d("bracket-error", 60390),
  lockSmall: d("lock-small", 60391),
  azureDevops: d("azure-devops", 60392),
  verifiedFilled: d("verified-filled", 60393),
  newLine: d("newline", 60394),
  layout: d("layout", 60395),
  layoutActivitybarLeft: d("layout-activitybar-left", 60396),
  layoutActivitybarRight: d("layout-activitybar-right", 60397),
  layoutPanelLeft: d("layout-panel-left", 60398),
  layoutPanelCenter: d("layout-panel-center", 60399),
  layoutPanelJustify: d("layout-panel-justify", 60400),
  layoutPanelRight: d("layout-panel-right", 60401),
  layoutPanel: d("layout-panel", 60402),
  layoutSidebarLeft: d("layout-sidebar-left", 60403),
  layoutSidebarRight: d("layout-sidebar-right", 60404),
  layoutStatusbar: d("layout-statusbar", 60405),
  layoutMenubar: d("layout-menubar", 60406),
  layoutCentered: d("layout-centered", 60407),
  layoutSidebarRightOff: d("layout-sidebar-right-off", 60416),
  layoutPanelOff: d("layout-panel-off", 60417),
  layoutSidebarLeftOff: d("layout-sidebar-left-off", 60418),
  target: d("target", 60408),
  indent: d("indent", 60409),
  recordSmall: d("record-small", 60410),
  errorSmall: d("error-small", 60411),
  arrowCircleDown: d("arrow-circle-down", 60412),
  arrowCircleLeft: d("arrow-circle-left", 60413),
  arrowCircleRight: d("arrow-circle-right", 60414),
  arrowCircleUp: d("arrow-circle-up", 60415),
  heartFilled: d("heart-filled", 60420),
  map: d("map", 60421),
  mapFilled: d("map-filled", 60422),
  circleSmall: d("circle-small", 60423),
  bellSlash: d("bell-slash", 60424),
  bellSlashDot: d("bell-slash-dot", 60425),
  commentUnresolved: d("comment-unresolved", 60426),
  gitPullRequestGoToChanges: d("git-pull-request-go-to-changes", 60427),
  gitPullRequestNewChanges: d("git-pull-request-new-changes", 60428),
  searchFuzzy: d("search-fuzzy", 60429),
  commentDraft: d("comment-draft", 60430),
  send: d("send", 60431),
  sparkle: d("sparkle", 60432),
  insert: d("insert", 60433),
  mic: d("mic", 60434),
  // derived icons, that could become separate icons
  dialogError: d("dialog-error", "error"),
  dialogWarning: d("dialog-warning", "warning"),
  dialogInfo: d("dialog-info", "info"),
  dialogClose: d("dialog-close", "close"),
  treeItemExpanded: d("tree-item-expanded", "chevron-down"),
  // collapsed is done with rotation
  treeFilterOnTypeOn: d("tree-filter-on-type-on", "list-filter"),
  treeFilterOnTypeOff: d("tree-filter-on-type-off", "list-selection"),
  treeFilterClear: d("tree-filter-clear", "close"),
  treeItemLoading: d("tree-item-loading", "loading"),
  menuSelection: d("menu-selection", "check"),
  menuSubmenu: d("menu-submenu", "chevron-right"),
  menuBarMore: d("menubar-more", "more"),
  scrollbarButtonLeft: d("scrollbar-button-left", "triangle-left"),
  scrollbarButtonRight: d("scrollbar-button-right", "triangle-right"),
  scrollbarButtonUp: d("scrollbar-button-up", "triangle-up"),
  scrollbarButtonDown: d("scrollbar-button-down", "triangle-down"),
  toolBarMore: d("toolbar-more", "more"),
  quickInputBack: d("quick-input-back", "arrow-left")
};
var qn = globalThis && globalThis.__awaiter || function(e, t, n, i) {
  function r(a) {
    return a instanceof n ? a : new n(function(s) {
      s(a);
    });
  }
  return new (n || (n = Promise))(function(a, s) {
    function l(c) {
      try {
        u(i.next(c));
      } catch (h) {
        s(h);
      }
    }
    function o(c) {
      try {
        u(i.throw(c));
      } catch (h) {
        s(h);
      }
    }
    function u(c) {
      c.done ? a(c.value) : r(c.value).then(l, o);
    }
    u((i = i.apply(e, t || [])).next());
  });
};
class Uo {
  constructor() {
    this._tokenizationSupports = /* @__PURE__ */ new Map(), this._factories = /* @__PURE__ */ new Map(), this._onDidChange = new Le(), this.onDidChange = this._onDidChange.event, this._colorMap = null;
  }
  handleChange(t) {
    this._onDidChange.fire({
      changedLanguages: t,
      changedColorMap: !1
    });
  }
  register(t, n) {
    return this._tokenizationSupports.set(t, n), this.handleChange([t]), Ct(() => {
      this._tokenizationSupports.get(t) === n && (this._tokenizationSupports.delete(t), this.handleChange([t]));
    });
  }
  get(t) {
    return this._tokenizationSupports.get(t) || null;
  }
  registerFactory(t, n) {
    var i;
    (i = this._factories.get(t)) === null || i === void 0 || i.dispose();
    const r = new Ho(this, t, n);
    return this._factories.set(t, r), Ct(() => {
      const a = this._factories.get(t);
      !a || a !== r || (this._factories.delete(t), a.dispose());
    });
  }
  getOrCreate(t) {
    return qn(this, void 0, void 0, function* () {
      const n = this.get(t);
      if (n)
        return n;
      const i = this._factories.get(t);
      return !i || i.isResolved ? null : (yield i.resolve(), this.get(t));
    });
  }
  isResolved(t) {
    if (this.get(t))
      return !0;
    const i = this._factories.get(t);
    return !!(!i || i.isResolved);
  }
  setColorMap(t) {
    this._colorMap = t, this._onDidChange.fire({
      changedLanguages: Array.from(this._tokenizationSupports.keys()),
      changedColorMap: !0
    });
  }
  getColorMap() {
    return this._colorMap;
  }
  getDefaultBackground() {
    return this._colorMap && this._colorMap.length > 2 ? this._colorMap[
      2
      /* ColorId.DefaultBackground */
    ] : null;
  }
}
class Ho extends Et {
  get isResolved() {
    return this._isResolved;
  }
  constructor(t, n, i) {
    super(), this._registry = t, this._languageId = n, this._factory = i, this._isDisposed = !1, this._resolvePromise = null, this._isResolved = !1;
  }
  dispose() {
    this._isDisposed = !0, super.dispose();
  }
  resolve() {
    return qn(this, void 0, void 0, function* () {
      return this._resolvePromise || (this._resolvePromise = this._create()), this._resolvePromise;
    });
  }
  _create() {
    return qn(this, void 0, void 0, function* () {
      const t = yield this._factory.tokenizationSupport;
      this._isResolved = !0, t && !this._isDisposed && this._register(this._registry.register(this._languageId, t));
    });
  }
}
class Wo {
  constructor(t, n, i) {
    this.offset = t, this.type = n, this.language = i, this._tokenBrand = void 0;
  }
  toString() {
    return "(" + this.offset + ", " + this.type + ")";
  }
}
var Ei;
(function(e) {
  const t = /* @__PURE__ */ new Map();
  t.set(0, O.symbolMethod), t.set(1, O.symbolFunction), t.set(2, O.symbolConstructor), t.set(3, O.symbolField), t.set(4, O.symbolVariable), t.set(5, O.symbolClass), t.set(6, O.symbolStruct), t.set(7, O.symbolInterface), t.set(8, O.symbolModule), t.set(9, O.symbolProperty), t.set(10, O.symbolEvent), t.set(11, O.symbolOperator), t.set(12, O.symbolUnit), t.set(13, O.symbolValue), t.set(15, O.symbolEnum), t.set(14, O.symbolConstant), t.set(15, O.symbolEnum), t.set(16, O.symbolEnumMember), t.set(17, O.symbolKeyword), t.set(27, O.symbolSnippet), t.set(18, O.symbolText), t.set(19, O.symbolColor), t.set(20, O.symbolFile), t.set(21, O.symbolReference), t.set(22, O.symbolCustomColor), t.set(23, O.symbolFolder), t.set(24, O.symbolTypeParameter), t.set(25, O.account), t.set(26, O.issues);
  function n(a) {
    let s = t.get(a);
    return s || (console.info("No codicon found for CompletionItemKind " + a), s = O.symbolProperty), s;
  }
  e.toIcon = n;
  const i = /* @__PURE__ */ new Map();
  i.set(
    "method",
    0
    /* CompletionItemKind.Method */
  ), i.set(
    "function",
    1
    /* CompletionItemKind.Function */
  ), i.set(
    "constructor",
    2
    /* CompletionItemKind.Constructor */
  ), i.set(
    "field",
    3
    /* CompletionItemKind.Field */
  ), i.set(
    "variable",
    4
    /* CompletionItemKind.Variable */
  ), i.set(
    "class",
    5
    /* CompletionItemKind.Class */
  ), i.set(
    "struct",
    6
    /* CompletionItemKind.Struct */
  ), i.set(
    "interface",
    7
    /* CompletionItemKind.Interface */
  ), i.set(
    "module",
    8
    /* CompletionItemKind.Module */
  ), i.set(
    "property",
    9
    /* CompletionItemKind.Property */
  ), i.set(
    "event",
    10
    /* CompletionItemKind.Event */
  ), i.set(
    "operator",
    11
    /* CompletionItemKind.Operator */
  ), i.set(
    "unit",
    12
    /* CompletionItemKind.Unit */
  ), i.set(
    "value",
    13
    /* CompletionItemKind.Value */
  ), i.set(
    "constant",
    14
    /* CompletionItemKind.Constant */
  ), i.set(
    "enum",
    15
    /* CompletionItemKind.Enum */
  ), i.set(
    "enum-member",
    16
    /* CompletionItemKind.EnumMember */
  ), i.set(
    "enumMember",
    16
    /* CompletionItemKind.EnumMember */
  ), i.set(
    "keyword",
    17
    /* CompletionItemKind.Keyword */
  ), i.set(
    "snippet",
    27
    /* CompletionItemKind.Snippet */
  ), i.set(
    "text",
    18
    /* CompletionItemKind.Text */
  ), i.set(
    "color",
    19
    /* CompletionItemKind.Color */
  ), i.set(
    "file",
    20
    /* CompletionItemKind.File */
  ), i.set(
    "reference",
    21
    /* CompletionItemKind.Reference */
  ), i.set(
    "customcolor",
    22
    /* CompletionItemKind.Customcolor */
  ), i.set(
    "folder",
    23
    /* CompletionItemKind.Folder */
  ), i.set(
    "type-parameter",
    24
    /* CompletionItemKind.TypeParameter */
  ), i.set(
    "typeParameter",
    24
    /* CompletionItemKind.TypeParameter */
  ), i.set(
    "account",
    25
    /* CompletionItemKind.User */
  ), i.set(
    "issue",
    26
    /* CompletionItemKind.Issue */
  );
  function r(a, s) {
    let l = i.get(a);
    return typeof l > "u" && !s && (l = 9), l;
  }
  e.fromString = r;
})(Ei || (Ei = {}));
var Mi;
(function(e) {
  e[e.Automatic = 0] = "Automatic", e[e.Explicit = 1] = "Explicit";
})(Mi || (Mi = {}));
var Ri;
(function(e) {
  e[e.Invoke = 1] = "Invoke", e[e.TriggerCharacter = 2] = "TriggerCharacter", e[e.ContentChange = 3] = "ContentChange";
})(Ri || (Ri = {}));
var Di;
(function(e) {
  e[e.Text = 0] = "Text", e[e.Read = 1] = "Read", e[e.Write = 2] = "Write";
})(Di || (Di = {}));
ee("Array", "array"), ee("Boolean", "boolean"), ee("Class", "class"), ee("Constant", "constant"), ee("Constructor", "constructor"), ee("Enum", "enumeration"), ee("EnumMember", "enumeration member"), ee("Event", "event"), ee("Field", "field"), ee("File", "file"), ee("Function", "function"), ee("Interface", "interface"), ee("Key", "key"), ee("Method", "method"), ee("Module", "module"), ee("Namespace", "namespace"), ee("Null", "null"), ee("Number", "number"), ee("Object", "object"), ee("Operator", "operator"), ee("Package", "package"), ee("Property", "property"), ee("String", "string"), ee("Struct", "struct"), ee("TypeParameter", "type parameter"), ee("Variable", "variable");
var Ni;
(function(e) {
  const t = /* @__PURE__ */ new Map();
  t.set(0, O.symbolFile), t.set(1, O.symbolModule), t.set(2, O.symbolNamespace), t.set(3, O.symbolPackage), t.set(4, O.symbolClass), t.set(5, O.symbolMethod), t.set(6, O.symbolProperty), t.set(7, O.symbolField), t.set(8, O.symbolConstructor), t.set(9, O.symbolEnum), t.set(10, O.symbolInterface), t.set(11, O.symbolFunction), t.set(12, O.symbolVariable), t.set(13, O.symbolConstant), t.set(14, O.symbolString), t.set(15, O.symbolNumber), t.set(16, O.symbolBoolean), t.set(17, O.symbolArray), t.set(18, O.symbolObject), t.set(19, O.symbolKey), t.set(20, O.symbolNull), t.set(21, O.symbolEnumMember), t.set(22, O.symbolStruct), t.set(23, O.symbolEvent), t.set(24, O.symbolOperator), t.set(25, O.symbolTypeParameter);
  function n(i) {
    let r = t.get(i);
    return r || (console.info("No codicon found for SymbolKind " + i), r = O.symbolProperty), r;
  }
  e.toIcon = n;
})(Ni || (Ni = {}));
var Ii;
(function(e) {
  function t(n) {
    return !n || typeof n != "object" ? !1 : typeof n.id == "string" && typeof n.title == "string";
  }
  e.is = t;
})(Ii || (Ii = {}));
var zi;
(function(e) {
  e[e.Type = 1] = "Type", e[e.Parameter = 2] = "Parameter";
})(zi || (zi = {}));
new Uo();
var Ui;
(function(e) {
  e[e.Unknown = 0] = "Unknown", e[e.Disabled = 1] = "Disabled", e[e.Enabled = 2] = "Enabled";
})(Ui || (Ui = {}));
var Hi;
(function(e) {
  e[e.Invoke = 1] = "Invoke", e[e.Auto = 2] = "Auto";
})(Hi || (Hi = {}));
var Wi;
(function(e) {
  e[e.None = 0] = "None", e[e.KeepWhitespace = 1] = "KeepWhitespace", e[e.InsertAsSnippet = 4] = "InsertAsSnippet";
})(Wi || (Wi = {}));
var Fi;
(function(e) {
  e[e.Method = 0] = "Method", e[e.Function = 1] = "Function", e[e.Constructor = 2] = "Constructor", e[e.Field = 3] = "Field", e[e.Variable = 4] = "Variable", e[e.Class = 5] = "Class", e[e.Struct = 6] = "Struct", e[e.Interface = 7] = "Interface", e[e.Module = 8] = "Module", e[e.Property = 9] = "Property", e[e.Event = 10] = "Event", e[e.Operator = 11] = "Operator", e[e.Unit = 12] = "Unit", e[e.Value = 13] = "Value", e[e.Constant = 14] = "Constant", e[e.Enum = 15] = "Enum", e[e.EnumMember = 16] = "EnumMember", e[e.Keyword = 17] = "Keyword", e[e.Text = 18] = "Text", e[e.Color = 19] = "Color", e[e.File = 20] = "File", e[e.Reference = 21] = "Reference", e[e.Customcolor = 22] = "Customcolor", e[e.Folder = 23] = "Folder", e[e.TypeParameter = 24] = "TypeParameter", e[e.User = 25] = "User", e[e.Issue = 26] = "Issue", e[e.Snippet = 27] = "Snippet";
})(Fi || (Fi = {}));
var Bi;
(function(e) {
  e[e.Deprecated = 1] = "Deprecated";
})(Bi || (Bi = {}));
var Pi;
(function(e) {
  e[e.Invoke = 0] = "Invoke", e[e.TriggerCharacter = 1] = "TriggerCharacter", e[e.TriggerForIncompleteCompletions = 2] = "TriggerForIncompleteCompletions";
})(Pi || (Pi = {}));
var qi;
(function(e) {
  e[e.EXACT = 0] = "EXACT", e[e.ABOVE = 1] = "ABOVE", e[e.BELOW = 2] = "BELOW";
})(qi || (qi = {}));
var Oi;
(function(e) {
  e[e.NotSet = 0] = "NotSet", e[e.ContentFlush = 1] = "ContentFlush", e[e.RecoverFromMarkers = 2] = "RecoverFromMarkers", e[e.Explicit = 3] = "Explicit", e[e.Paste = 4] = "Paste", e[e.Undo = 5] = "Undo", e[e.Redo = 6] = "Redo";
})(Oi || (Oi = {}));
var Vi;
(function(e) {
  e[e.LF = 1] = "LF", e[e.CRLF = 2] = "CRLF";
})(Vi || (Vi = {}));
var ji;
(function(e) {
  e[e.Text = 0] = "Text", e[e.Read = 1] = "Read", e[e.Write = 2] = "Write";
})(ji || (ji = {}));
var Gi;
(function(e) {
  e[e.None = 0] = "None", e[e.Keep = 1] = "Keep", e[e.Brackets = 2] = "Brackets", e[e.Advanced = 3] = "Advanced", e[e.Full = 4] = "Full";
})(Gi || (Gi = {}));
var $i;
(function(e) {
  e[e.acceptSuggestionOnCommitCharacter = 0] = "acceptSuggestionOnCommitCharacter", e[e.acceptSuggestionOnEnter = 1] = "acceptSuggestionOnEnter", e[e.accessibilitySupport = 2] = "accessibilitySupport", e[e.accessibilityPageSize = 3] = "accessibilityPageSize", e[e.ariaLabel = 4] = "ariaLabel", e[e.ariaRequired = 5] = "ariaRequired", e[e.autoClosingBrackets = 6] = "autoClosingBrackets", e[e.autoClosingComments = 7] = "autoClosingComments", e[e.screenReaderAnnounceInlineSuggestion = 8] = "screenReaderAnnounceInlineSuggestion", e[e.autoClosingDelete = 9] = "autoClosingDelete", e[e.autoClosingOvertype = 10] = "autoClosingOvertype", e[e.autoClosingQuotes = 11] = "autoClosingQuotes", e[e.autoIndent = 12] = "autoIndent", e[e.automaticLayout = 13] = "automaticLayout", e[e.autoSurround = 14] = "autoSurround", e[e.bracketPairColorization = 15] = "bracketPairColorization", e[e.guides = 16] = "guides", e[e.codeLens = 17] = "codeLens", e[e.codeLensFontFamily = 18] = "codeLensFontFamily", e[e.codeLensFontSize = 19] = "codeLensFontSize", e[e.colorDecorators = 20] = "colorDecorators", e[e.colorDecoratorsLimit = 21] = "colorDecoratorsLimit", e[e.columnSelection = 22] = "columnSelection", e[e.comments = 23] = "comments", e[e.contextmenu = 24] = "contextmenu", e[e.copyWithSyntaxHighlighting = 25] = "copyWithSyntaxHighlighting", e[e.cursorBlinking = 26] = "cursorBlinking", e[e.cursorSmoothCaretAnimation = 27] = "cursorSmoothCaretAnimation", e[e.cursorStyle = 28] = "cursorStyle", e[e.cursorSurroundingLines = 29] = "cursorSurroundingLines", e[e.cursorSurroundingLinesStyle = 30] = "cursorSurroundingLinesStyle", e[e.cursorWidth = 31] = "cursorWidth", e[e.disableLayerHinting = 32] = "disableLayerHinting", e[e.disableMonospaceOptimizations = 33] = "disableMonospaceOptimizations", e[e.domReadOnly = 34] = "domReadOnly", e[e.dragAndDrop = 35] = "dragAndDrop", e[e.dropIntoEditor = 36] = "dropIntoEditor", e[e.emptySelectionClipboard = 37] = "emptySelectionClipboard", e[e.experimentalWhitespaceRendering = 38] = "experimentalWhitespaceRendering", e[e.extraEditorClassName = 39] = "extraEditorClassName", e[e.fastScrollSensitivity = 40] = "fastScrollSensitivity", e[e.find = 41] = "find", e[e.fixedOverflowWidgets = 42] = "fixedOverflowWidgets", e[e.folding = 43] = "folding", e[e.foldingStrategy = 44] = "foldingStrategy", e[e.foldingHighlight = 45] = "foldingHighlight", e[e.foldingImportsByDefault = 46] = "foldingImportsByDefault", e[e.foldingMaximumRegions = 47] = "foldingMaximumRegions", e[e.unfoldOnClickAfterEndOfLine = 48] = "unfoldOnClickAfterEndOfLine", e[e.fontFamily = 49] = "fontFamily", e[e.fontInfo = 50] = "fontInfo", e[e.fontLigatures = 51] = "fontLigatures", e[e.fontSize = 52] = "fontSize", e[e.fontWeight = 53] = "fontWeight", e[e.fontVariations = 54] = "fontVariations", e[e.formatOnPaste = 55] = "formatOnPaste", e[e.formatOnType = 56] = "formatOnType", e[e.glyphMargin = 57] = "glyphMargin", e[e.gotoLocation = 58] = "gotoLocation", e[e.hideCursorInOverviewRuler = 59] = "hideCursorInOverviewRuler", e[e.hover = 60] = "hover", e[e.inDiffEditor = 61] = "inDiffEditor", e[e.inlineSuggest = 62] = "inlineSuggest", e[e.letterSpacing = 63] = "letterSpacing", e[e.lightbulb = 64] = "lightbulb", e[e.lineDecorationsWidth = 65] = "lineDecorationsWidth", e[e.lineHeight = 66] = "lineHeight", e[e.lineNumbers = 67] = "lineNumbers", e[e.lineNumbersMinChars = 68] = "lineNumbersMinChars", e[e.linkedEditing = 69] = "linkedEditing", e[e.links = 70] = "links", e[e.matchBrackets = 71] = "matchBrackets", e[e.minimap = 72] = "minimap", e[e.mouseStyle = 73] = "mouseStyle", e[e.mouseWheelScrollSensitivity = 74] = "mouseWheelScrollSensitivity", e[e.mouseWheelZoom = 75] = "mouseWheelZoom", e[e.multiCursorMergeOverlapping = 76] = "multiCursorMergeOverlapping", e[e.multiCursorModifier = 77] = "multiCursorModifier", e[e.multiCursorPaste = 78] = "multiCursorPaste", e[e.multiCursorLimit = 79] = "multiCursorLimit", e[e.occurrencesHighlight = 80] = "occurrencesHighlight", e[e.overviewRulerBorder = 81] = "overviewRulerBorder", e[e.overviewRulerLanes = 82] = "overviewRulerLanes", e[e.padding = 83] = "padding", e[e.pasteAs = 84] = "pasteAs", e[e.parameterHints = 85] = "parameterHints", e[e.peekWidgetDefaultFocus = 86] = "peekWidgetDefaultFocus", e[e.definitionLinkOpensInPeek = 87] = "definitionLinkOpensInPeek", e[e.quickSuggestions = 88] = "quickSuggestions", e[e.quickSuggestionsDelay = 89] = "quickSuggestionsDelay", e[e.readOnly = 90] = "readOnly", e[e.readOnlyMessage = 91] = "readOnlyMessage", e[e.renameOnType = 92] = "renameOnType", e[e.renderControlCharacters = 93] = "renderControlCharacters", e[e.renderFinalNewline = 94] = "renderFinalNewline", e[e.renderLineHighlight = 95] = "renderLineHighlight", e[e.renderLineHighlightOnlyWhenFocus = 96] = "renderLineHighlightOnlyWhenFocus", e[e.renderValidationDecorations = 97] = "renderValidationDecorations", e[e.renderWhitespace = 98] = "renderWhitespace", e[e.revealHorizontalRightPadding = 99] = "revealHorizontalRightPadding", e[e.roundedSelection = 100] = "roundedSelection", e[e.rulers = 101] = "rulers", e[e.scrollbar = 102] = "scrollbar", e[e.scrollBeyondLastColumn = 103] = "scrollBeyondLastColumn", e[e.scrollBeyondLastLine = 104] = "scrollBeyondLastLine", e[e.scrollPredominantAxis = 105] = "scrollPredominantAxis", e[e.selectionClipboard = 106] = "selectionClipboard", e[e.selectionHighlight = 107] = "selectionHighlight", e[e.selectOnLineNumbers = 108] = "selectOnLineNumbers", e[e.showFoldingControls = 109] = "showFoldingControls", e[e.showUnused = 110] = "showUnused", e[e.snippetSuggestions = 111] = "snippetSuggestions", e[e.smartSelect = 112] = "smartSelect", e[e.smoothScrolling = 113] = "smoothScrolling", e[e.stickyScroll = 114] = "stickyScroll", e[e.stickyTabStops = 115] = "stickyTabStops", e[e.stopRenderingLineAfter = 116] = "stopRenderingLineAfter", e[e.suggest = 117] = "suggest", e[e.suggestFontSize = 118] = "suggestFontSize", e[e.suggestLineHeight = 119] = "suggestLineHeight", e[e.suggestOnTriggerCharacters = 120] = "suggestOnTriggerCharacters", e[e.suggestSelection = 121] = "suggestSelection", e[e.tabCompletion = 122] = "tabCompletion", e[e.tabIndex = 123] = "tabIndex", e[e.unicodeHighlighting = 124] = "unicodeHighlighting", e[e.unusualLineTerminators = 125] = "unusualLineTerminators", e[e.useShadowDOM = 126] = "useShadowDOM", e[e.useTabStops = 127] = "useTabStops", e[e.wordBreak = 128] = "wordBreak", e[e.wordSeparators = 129] = "wordSeparators", e[e.wordWrap = 130] = "wordWrap", e[e.wordWrapBreakAfterCharacters = 131] = "wordWrapBreakAfterCharacters", e[e.wordWrapBreakBeforeCharacters = 132] = "wordWrapBreakBeforeCharacters", e[e.wordWrapColumn = 133] = "wordWrapColumn", e[e.wordWrapOverride1 = 134] = "wordWrapOverride1", e[e.wordWrapOverride2 = 135] = "wordWrapOverride2", e[e.wrappingIndent = 136] = "wrappingIndent", e[e.wrappingStrategy = 137] = "wrappingStrategy", e[e.showDeprecated = 138] = "showDeprecated", e[e.inlayHints = 139] = "inlayHints", e[e.editorClassName = 140] = "editorClassName", e[e.pixelRatio = 141] = "pixelRatio", e[e.tabFocusMode = 142] = "tabFocusMode", e[e.layoutInfo = 143] = "layoutInfo", e[e.wrappingInfo = 144] = "wrappingInfo", e[e.defaultColorDecorators = 145] = "defaultColorDecorators", e[e.colorDecoratorsActivatedOn = 146] = "colorDecoratorsActivatedOn", e[e.inlineCompletionsAccessibilityVerbose = 147] = "inlineCompletionsAccessibilityVerbose";
})($i || ($i = {}));
var Xi;
(function(e) {
  e[e.TextDefined = 0] = "TextDefined", e[e.LF = 1] = "LF", e[e.CRLF = 2] = "CRLF";
})(Xi || (Xi = {}));
var Ji;
(function(e) {
  e[e.LF = 0] = "LF", e[e.CRLF = 1] = "CRLF";
})(Ji || (Ji = {}));
var Qi;
(function(e) {
  e[e.Left = 1] = "Left", e[e.Right = 2] = "Right";
})(Qi || (Qi = {}));
var Yi;
(function(e) {
  e[e.None = 0] = "None", e[e.Indent = 1] = "Indent", e[e.IndentOutdent = 2] = "IndentOutdent", e[e.Outdent = 3] = "Outdent";
})(Yi || (Yi = {}));
var Zi;
(function(e) {
  e[e.Both = 0] = "Both", e[e.Right = 1] = "Right", e[e.Left = 2] = "Left", e[e.None = 3] = "None";
})(Zi || (Zi = {}));
var Ki;
(function(e) {
  e[e.Type = 1] = "Type", e[e.Parameter = 2] = "Parameter";
})(Ki || (Ki = {}));
var er;
(function(e) {
  e[e.Automatic = 0] = "Automatic", e[e.Explicit = 1] = "Explicit";
})(er || (er = {}));
var On;
(function(e) {
  e[e.DependsOnKbLayout = -1] = "DependsOnKbLayout", e[e.Unknown = 0] = "Unknown", e[e.Backspace = 1] = "Backspace", e[e.Tab = 2] = "Tab", e[e.Enter = 3] = "Enter", e[e.Shift = 4] = "Shift", e[e.Ctrl = 5] = "Ctrl", e[e.Alt = 6] = "Alt", e[e.PauseBreak = 7] = "PauseBreak", e[e.CapsLock = 8] = "CapsLock", e[e.Escape = 9] = "Escape", e[e.Space = 10] = "Space", e[e.PageUp = 11] = "PageUp", e[e.PageDown = 12] = "PageDown", e[e.End = 13] = "End", e[e.Home = 14] = "Home", e[e.LeftArrow = 15] = "LeftArrow", e[e.UpArrow = 16] = "UpArrow", e[e.RightArrow = 17] = "RightArrow", e[e.DownArrow = 18] = "DownArrow", e[e.Insert = 19] = "Insert", e[e.Delete = 20] = "Delete", e[e.Digit0 = 21] = "Digit0", e[e.Digit1 = 22] = "Digit1", e[e.Digit2 = 23] = "Digit2", e[e.Digit3 = 24] = "Digit3", e[e.Digit4 = 25] = "Digit4", e[e.Digit5 = 26] = "Digit5", e[e.Digit6 = 27] = "Digit6", e[e.Digit7 = 28] = "Digit7", e[e.Digit8 = 29] = "Digit8", e[e.Digit9 = 30] = "Digit9", e[e.KeyA = 31] = "KeyA", e[e.KeyB = 32] = "KeyB", e[e.KeyC = 33] = "KeyC", e[e.KeyD = 34] = "KeyD", e[e.KeyE = 35] = "KeyE", e[e.KeyF = 36] = "KeyF", e[e.KeyG = 37] = "KeyG", e[e.KeyH = 38] = "KeyH", e[e.KeyI = 39] = "KeyI", e[e.KeyJ = 40] = "KeyJ", e[e.KeyK = 41] = "KeyK", e[e.KeyL = 42] = "KeyL", e[e.KeyM = 43] = "KeyM", e[e.KeyN = 44] = "KeyN", e[e.KeyO = 45] = "KeyO", e[e.KeyP = 46] = "KeyP", e[e.KeyQ = 47] = "KeyQ", e[e.KeyR = 48] = "KeyR", e[e.KeyS = 49] = "KeyS", e[e.KeyT = 50] = "KeyT", e[e.KeyU = 51] = "KeyU", e[e.KeyV = 52] = "KeyV", e[e.KeyW = 53] = "KeyW", e[e.KeyX = 54] = "KeyX", e[e.KeyY = 55] = "KeyY", e[e.KeyZ = 56] = "KeyZ", e[e.Meta = 57] = "Meta", e[e.ContextMenu = 58] = "ContextMenu", e[e.F1 = 59] = "F1", e[e.F2 = 60] = "F2", e[e.F3 = 61] = "F3", e[e.F4 = 62] = "F4", e[e.F5 = 63] = "F5", e[e.F6 = 64] = "F6", e[e.F7 = 65] = "F7", e[e.F8 = 66] = "F8", e[e.F9 = 67] = "F9", e[e.F10 = 68] = "F10", e[e.F11 = 69] = "F11", e[e.F12 = 70] = "F12", e[e.F13 = 71] = "F13", e[e.F14 = 72] = "F14", e[e.F15 = 73] = "F15", e[e.F16 = 74] = "F16", e[e.F17 = 75] = "F17", e[e.F18 = 76] = "F18", e[e.F19 = 77] = "F19", e[e.F20 = 78] = "F20", e[e.F21 = 79] = "F21", e[e.F22 = 80] = "F22", e[e.F23 = 81] = "F23", e[e.F24 = 82] = "F24", e[e.NumLock = 83] = "NumLock", e[e.ScrollLock = 84] = "ScrollLock", e[e.Semicolon = 85] = "Semicolon", e[e.Equal = 86] = "Equal", e[e.Comma = 87] = "Comma", e[e.Minus = 88] = "Minus", e[e.Period = 89] = "Period", e[e.Slash = 90] = "Slash", e[e.Backquote = 91] = "Backquote", e[e.BracketLeft = 92] = "BracketLeft", e[e.Backslash = 93] = "Backslash", e[e.BracketRight = 94] = "BracketRight", e[e.Quote = 95] = "Quote", e[e.OEM_8 = 96] = "OEM_8", e[e.IntlBackslash = 97] = "IntlBackslash", e[e.Numpad0 = 98] = "Numpad0", e[e.Numpad1 = 99] = "Numpad1", e[e.Numpad2 = 100] = "Numpad2", e[e.Numpad3 = 101] = "Numpad3", e[e.Numpad4 = 102] = "Numpad4", e[e.Numpad5 = 103] = "Numpad5", e[e.Numpad6 = 104] = "Numpad6", e[e.Numpad7 = 105] = "Numpad7", e[e.Numpad8 = 106] = "Numpad8", e[e.Numpad9 = 107] = "Numpad9", e[e.NumpadMultiply = 108] = "NumpadMultiply", e[e.NumpadAdd = 109] = "NumpadAdd", e[e.NUMPAD_SEPARATOR = 110] = "NUMPAD_SEPARATOR", e[e.NumpadSubtract = 111] = "NumpadSubtract", e[e.NumpadDecimal = 112] = "NumpadDecimal", e[e.NumpadDivide = 113] = "NumpadDivide", e[e.KEY_IN_COMPOSITION = 114] = "KEY_IN_COMPOSITION", e[e.ABNT_C1 = 115] = "ABNT_C1", e[e.ABNT_C2 = 116] = "ABNT_C2", e[e.AudioVolumeMute = 117] = "AudioVolumeMute", e[e.AudioVolumeUp = 118] = "AudioVolumeUp", e[e.AudioVolumeDown = 119] = "AudioVolumeDown", e[e.BrowserSearch = 120] = "BrowserSearch", e[e.BrowserHome = 121] = "BrowserHome", e[e.BrowserBack = 122] = "BrowserBack", e[e.BrowserForward = 123] = "BrowserForward", e[e.MediaTrackNext = 124] = "MediaTrackNext", e[e.MediaTrackPrevious = 125] = "MediaTrackPrevious", e[e.MediaStop = 126] = "MediaStop", e[e.MediaPlayPause = 127] = "MediaPlayPause", e[e.LaunchMediaPlayer = 128] = "LaunchMediaPlayer", e[e.LaunchMail = 129] = "LaunchMail", e[e.LaunchApp2 = 130] = "LaunchApp2", e[e.Clear = 131] = "Clear", e[e.MAX_VALUE = 132] = "MAX_VALUE";
})(On || (On = {}));
var Vn;
(function(e) {
  e[e.Hint = 1] = "Hint", e[e.Info = 2] = "Info", e[e.Warning = 4] = "Warning", e[e.Error = 8] = "Error";
})(Vn || (Vn = {}));
var jn;
(function(e) {
  e[e.Unnecessary = 1] = "Unnecessary", e[e.Deprecated = 2] = "Deprecated";
})(jn || (jn = {}));
var tr;
(function(e) {
  e[e.Inline = 1] = "Inline", e[e.Gutter = 2] = "Gutter";
})(tr || (tr = {}));
var nr;
(function(e) {
  e[e.UNKNOWN = 0] = "UNKNOWN", e[e.TEXTAREA = 1] = "TEXTAREA", e[e.GUTTER_GLYPH_MARGIN = 2] = "GUTTER_GLYPH_MARGIN", e[e.GUTTER_LINE_NUMBERS = 3] = "GUTTER_LINE_NUMBERS", e[e.GUTTER_LINE_DECORATIONS = 4] = "GUTTER_LINE_DECORATIONS", e[e.GUTTER_VIEW_ZONE = 5] = "GUTTER_VIEW_ZONE", e[e.CONTENT_TEXT = 6] = "CONTENT_TEXT", e[e.CONTENT_EMPTY = 7] = "CONTENT_EMPTY", e[e.CONTENT_VIEW_ZONE = 8] = "CONTENT_VIEW_ZONE", e[e.CONTENT_WIDGET = 9] = "CONTENT_WIDGET", e[e.OVERVIEW_RULER = 10] = "OVERVIEW_RULER", e[e.SCROLLBAR = 11] = "SCROLLBAR", e[e.OVERLAY_WIDGET = 12] = "OVERLAY_WIDGET", e[e.OUTSIDE_EDITOR = 13] = "OUTSIDE_EDITOR";
})(nr || (nr = {}));
var ir;
(function(e) {
  e[e.TOP_RIGHT_CORNER = 0] = "TOP_RIGHT_CORNER", e[e.BOTTOM_RIGHT_CORNER = 1] = "BOTTOM_RIGHT_CORNER", e[e.TOP_CENTER = 2] = "TOP_CENTER";
})(ir || (ir = {}));
var rr;
(function(e) {
  e[e.Left = 1] = "Left", e[e.Center = 2] = "Center", e[e.Right = 4] = "Right", e[e.Full = 7] = "Full";
})(rr || (rr = {}));
var ar;
(function(e) {
  e[e.Left = 0] = "Left", e[e.Right = 1] = "Right", e[e.None = 2] = "None", e[e.LeftOfInjectedText = 3] = "LeftOfInjectedText", e[e.RightOfInjectedText = 4] = "RightOfInjectedText";
})(ar || (ar = {}));
var sr;
(function(e) {
  e[e.Off = 0] = "Off", e[e.On = 1] = "On", e[e.Relative = 2] = "Relative", e[e.Interval = 3] = "Interval", e[e.Custom = 4] = "Custom";
})(sr || (sr = {}));
var or;
(function(e) {
  e[e.None = 0] = "None", e[e.Text = 1] = "Text", e[e.Blocks = 2] = "Blocks";
})(or || (or = {}));
var lr;
(function(e) {
  e[e.Smooth = 0] = "Smooth", e[e.Immediate = 1] = "Immediate";
})(lr || (lr = {}));
var ur;
(function(e) {
  e[e.Auto = 1] = "Auto", e[e.Hidden = 2] = "Hidden", e[e.Visible = 3] = "Visible";
})(ur || (ur = {}));
var Gn;
(function(e) {
  e[e.LTR = 0] = "LTR", e[e.RTL = 1] = "RTL";
})(Gn || (Gn = {}));
var cr;
(function(e) {
  e[e.Invoke = 1] = "Invoke", e[e.TriggerCharacter = 2] = "TriggerCharacter", e[e.ContentChange = 3] = "ContentChange";
})(cr || (cr = {}));
var hr;
(function(e) {
  e[e.File = 0] = "File", e[e.Module = 1] = "Module", e[e.Namespace = 2] = "Namespace", e[e.Package = 3] = "Package", e[e.Class = 4] = "Class", e[e.Method = 5] = "Method", e[e.Property = 6] = "Property", e[e.Field = 7] = "Field", e[e.Constructor = 8] = "Constructor", e[e.Enum = 9] = "Enum", e[e.Interface = 10] = "Interface", e[e.Function = 11] = "Function", e[e.Variable = 12] = "Variable", e[e.Constant = 13] = "Constant", e[e.String = 14] = "String", e[e.Number = 15] = "Number", e[e.Boolean = 16] = "Boolean", e[e.Array = 17] = "Array", e[e.Object = 18] = "Object", e[e.Key = 19] = "Key", e[e.Null = 20] = "Null", e[e.EnumMember = 21] = "EnumMember", e[e.Struct = 22] = "Struct", e[e.Event = 23] = "Event", e[e.Operator = 24] = "Operator", e[e.TypeParameter = 25] = "TypeParameter";
})(hr || (hr = {}));
var dr;
(function(e) {
  e[e.Deprecated = 1] = "Deprecated";
})(dr || (dr = {}));
var mr;
(function(e) {
  e[e.Hidden = 0] = "Hidden", e[e.Blink = 1] = "Blink", e[e.Smooth = 2] = "Smooth", e[e.Phase = 3] = "Phase", e[e.Expand = 4] = "Expand", e[e.Solid = 5] = "Solid";
})(mr || (mr = {}));
var fr;
(function(e) {
  e[e.Line = 1] = "Line", e[e.Block = 2] = "Block", e[e.Underline = 3] = "Underline", e[e.LineThin = 4] = "LineThin", e[e.BlockOutline = 5] = "BlockOutline", e[e.UnderlineThin = 6] = "UnderlineThin";
})(fr || (fr = {}));
var pr;
(function(e) {
  e[e.AlwaysGrowsWhenTypingAtEdges = 0] = "AlwaysGrowsWhenTypingAtEdges", e[e.NeverGrowsWhenTypingAtEdges = 1] = "NeverGrowsWhenTypingAtEdges", e[e.GrowsOnlyWhenTypingBefore = 2] = "GrowsOnlyWhenTypingBefore", e[e.GrowsOnlyWhenTypingAfter = 3] = "GrowsOnlyWhenTypingAfter";
})(pr || (pr = {}));
var gr;
(function(e) {
  e[e.None = 0] = "None", e[e.Same = 1] = "Same", e[e.Indent = 2] = "Indent", e[e.DeepIndent = 3] = "DeepIndent";
})(gr || (gr = {}));
class Ft {
  static chord(t, n) {
    return zo(t, n);
  }
}
Ft.CtrlCmd = 2048;
Ft.Shift = 1024;
Ft.Alt = 512;
Ft.WinCtrl = 256;
function Fo() {
  return {
    editor: void 0,
    // undefined override expected here
    languages: void 0,
    // undefined override expected here
    CancellationTokenSource: Ro,
    Emitter: Le,
    KeyCode: On,
    KeyMod: Ft,
    Position: Ue,
    Range: oe,
    Selection: _e,
    SelectionDirection: Gn,
    MarkerSeverity: Vn,
    MarkerTag: jn,
    Uri: li,
    Token: Wo
  };
}
var br;
(function(e) {
  e[e.Left = 1] = "Left", e[e.Center = 2] = "Center", e[e.Right = 4] = "Right", e[e.Full = 7] = "Full";
})(br || (br = {}));
var vr;
(function(e) {
  e[e.Left = 1] = "Left", e[e.Right = 2] = "Right";
})(vr || (vr = {}));
var _r;
(function(e) {
  e[e.Inline = 1] = "Inline", e[e.Gutter = 2] = "Gutter";
})(_r || (_r = {}));
var wr;
(function(e) {
  e[e.Both = 0] = "Both", e[e.Right = 1] = "Right", e[e.Left = 2] = "Left", e[e.None = 3] = "None";
})(wr || (wr = {}));
function Bo(e, t, n, i, r) {
  if (i === 0)
    return !0;
  const a = t.charCodeAt(i - 1);
  if (e.get(a) !== 0 || a === 13 || a === 10)
    return !0;
  if (r > 0) {
    const s = t.charCodeAt(i);
    if (e.get(s) !== 0)
      return !0;
  }
  return !1;
}
function Po(e, t, n, i, r) {
  if (i + r === n)
    return !0;
  const a = t.charCodeAt(i + r);
  if (e.get(a) !== 0 || a === 13 || a === 10)
    return !0;
  if (r > 0) {
    const s = t.charCodeAt(i + r - 1);
    if (e.get(s) !== 0)
      return !0;
  }
  return !1;
}
function qo(e, t, n, i, r) {
  return Bo(e, t, n, i, r) && Po(e, t, n, i, r);
}
class Oo {
  constructor(t, n) {
    this._wordSeparators = t, this._searchRegex = n, this._prevMatchStartIndex = -1, this._prevMatchLength = 0;
  }
  reset(t) {
    this._searchRegex.lastIndex = t, this._prevMatchStartIndex = -1, this._prevMatchLength = 0;
  }
  next(t) {
    const n = t.length;
    let i;
    do {
      if (this._prevMatchStartIndex + this._prevMatchLength === n || (i = this._searchRegex.exec(t), !i))
        return null;
      const r = i.index, a = i[0].length;
      if (r === this._prevMatchStartIndex && a === this._prevMatchLength) {
        if (a === 0) {
          Us(t, n, this._searchRegex.lastIndex) > 65535 ? this._searchRegex.lastIndex += 2 : this._searchRegex.lastIndex += 1;
          continue;
        }
        return null;
      }
      if (this._prevMatchStartIndex = r, this._prevMatchLength = a, !this._wordSeparators || qo(this._wordSeparators, t, n, r, a))
        return i;
    } while (i);
    return null;
  }
}
function Vo(e, t = "Unreachable") {
  throw new Error(t);
}
function rn(e) {
  if (!e()) {
    debugger;
    e(), Ma(new $e("Assertion Failed"));
  }
}
function ja(e, t) {
  let n = 0;
  for (; n < e.length - 1; ) {
    const i = e[n], r = e[n + 1];
    if (!t(i, r))
      return !1;
    n++;
  }
  return !0;
}
class jo {
  static computeUnicodeHighlights(t, n, i) {
    const r = i ? i.startLineNumber : 1, a = i ? i.endLineNumber : t.getLineCount(), s = new yr(n), l = s.getCandidateCodePoints();
    let o;
    l === "allNonBasicAscii" ? o = new RegExp("[^\\t\\n\\r\\x20-\\x7E]", "g") : o = new RegExp(`${Go(Array.from(l))}`, "g");
    const u = new Oo(null, o), c = [];
    let h = !1, m, f = 0, g = 0, p = 0;
    e:
      for (let w = r, y = a; w <= y; w++) {
        const v = t.getLineContent(w), x = v.length;
        u.reset(0);
        do
          if (m = u.next(v), m) {
            let E = m.index, I = m.index + m[0].length;
            if (E > 0) {
              const T = v.charCodeAt(E - 1);
              zn(T) && E--;
            }
            if (I + 1 < x) {
              const T = v.charCodeAt(I - 1);
              zn(T) && I++;
            }
            const B = v.substring(E, I);
            let _ = ui(E + 1, qa, v, 0);
            _ && _.endColumn <= E + 1 && (_ = null);
            const b = s.shouldHighlightNonBasicASCII(B, _ ? _.word : null);
            if (b !== 0) {
              b === 3 ? f++ : b === 2 ? g++ : b === 1 ? p++ : Vo();
              const T = 1e3;
              if (c.length >= T) {
                h = !0;
                break e;
              }
              c.push(new oe(w, E + 1, w, I + 1));
            }
          }
        while (m);
      }
    return {
      ranges: c,
      hasMore: h,
      ambiguousCharacterCount: f,
      invisibleCharacterCount: g,
      nonBasicAsciiCharacterCount: p
    };
  }
  static computeUnicodeHighlightReason(t, n) {
    const i = new yr(n);
    switch (i.shouldHighlightNonBasicASCII(t, null)) {
      case 0:
        return null;
      case 2:
        return {
          kind: 1
          /* UnicodeHighlighterReasonKind.Invisible */
        };
      case 3: {
        const a = t.codePointAt(0), s = i.ambiguousCharacters.getPrimaryConfusable(a), l = rt.getLocales().filter((o) => !rt.getInstance(/* @__PURE__ */ new Set([...n.allowedLocales, o])).isAmbiguous(a));
        return { kind: 0, confusableWith: String.fromCodePoint(s), notAmbiguousInLocales: l };
      }
      case 1:
        return {
          kind: 2
          /* UnicodeHighlighterReasonKind.NonBasicAscii */
        };
    }
  }
}
function Go(e, t) {
  return `[${Ms(e.map((i) => String.fromCodePoint(i)).join(""))}]`;
}
class yr {
  constructor(t) {
    this.options = t, this.allowedCodePoints = new Set(t.allowedCodePoints), this.ambiguousCharacters = rt.getInstance(new Set(t.allowedLocales));
  }
  getCandidateCodePoints() {
    if (this.options.nonBasicASCII)
      return "allNonBasicAscii";
    const t = /* @__PURE__ */ new Set();
    if (this.options.invisibleCharacters)
      for (const n of Xe.codePoints)
        Tr(String.fromCodePoint(n)) || t.add(n);
    if (this.options.ambiguousCharacters)
      for (const n of this.ambiguousCharacters.getConfusableCodePoints())
        t.add(n);
    for (const n of this.allowedCodePoints)
      t.delete(n);
    return t;
  }
  shouldHighlightNonBasicASCII(t, n) {
    const i = t.codePointAt(0);
    if (this.allowedCodePoints.has(i))
      return 0;
    if (this.options.nonBasicASCII)
      return 1;
    let r = !1, a = !1;
    if (n)
      for (const s of n) {
        const l = s.codePointAt(0), o = Ws(s);
        r = r || o, !o && !this.ambiguousCharacters.isAmbiguous(l) && !Xe.isInvisibleCharacter(l) && (a = !0);
      }
    return (
      /* Don't allow mixing weird looking characters with ASCII */
      !r && /* Is there an obviously weird looking character? */
      a ? 0 : this.options.invisibleCharacters && !Tr(t) && Xe.isInvisibleCharacter(i) ? 2 : this.options.ambiguousCharacters && this.ambiguousCharacters.isAmbiguous(i) ? 3 : 0
    );
  }
}
function Tr(e) {
  return e === " " || e === `
` || e === "	";
}
class Yt {
  constructor(t, n, i) {
    this.changes = t, this.moves = n, this.hitTimeout = i;
  }
}
class $o {
  constructor(t, n) {
    this.lineRangeMapping = t, this.changes = n;
  }
}
class G {
  static addRange(t, n) {
    let i = 0;
    for (; i < n.length && n[i].endExclusive < t.start; )
      i++;
    let r = i;
    for (; r < n.length && n[r].start <= t.endExclusive; )
      r++;
    if (i === r)
      n.splice(i, 0, t);
    else {
      const a = Math.min(t.start, n[i].start), s = Math.max(t.endExclusive, n[r - 1].endExclusive);
      n.splice(i, r - i, new G(a, s));
    }
  }
  static tryCreate(t, n) {
    if (!(t > n))
      return new G(t, n);
  }
  static ofLength(t) {
    return new G(0, t);
  }
  constructor(t, n) {
    if (this.start = t, this.endExclusive = n, t > n)
      throw new $e(`Invalid range: ${this.toString()}`);
  }
  get isEmpty() {
    return this.start === this.endExclusive;
  }
  delta(t) {
    return new G(this.start + t, this.endExclusive + t);
  }
  deltaStart(t) {
    return new G(this.start + t, this.endExclusive);
  }
  deltaEnd(t) {
    return new G(this.start, this.endExclusive + t);
  }
  get length() {
    return this.endExclusive - this.start;
  }
  toString() {
    return `[${this.start}, ${this.endExclusive})`;
  }
  equals(t) {
    return this.start === t.start && this.endExclusive === t.endExclusive;
  }
  containsRange(t) {
    return this.start <= t.start && t.endExclusive <= this.endExclusive;
  }
  contains(t) {
    return this.start <= t && t < this.endExclusive;
  }
  /**
   * for all numbers n: range1.contains(n) or range2.contains(n) => range1.join(range2).contains(n)
   * The joined range is the smallest range that contains both ranges.
   */
  join(t) {
    return new G(Math.min(this.start, t.start), Math.max(this.endExclusive, t.endExclusive));
  }
  /**
   * for all numbers n: range1.contains(n) and range2.contains(n) <=> range1.intersect(range2).contains(n)
   *
   * The resulting range is empty if the ranges do not intersect, but touch.
   * If the ranges don't even touch, the result is undefined.
   */
  intersect(t) {
    const n = Math.max(this.start, t.start), i = Math.min(this.endExclusive, t.endExclusive);
    if (n <= i)
      return new G(n, i);
  }
  slice(t) {
    return t.slice(this.start, this.endExclusive);
  }
  /**
   * Returns the given value if it is contained in this instance, otherwise the closest value that is contained.
   * The range must not be empty.
   */
  clip(t) {
    if (this.isEmpty)
      throw new $e(`Invalid clipping range: ${this.toString()}`);
    return Math.max(this.start, Math.min(this.endExclusive - 1, t));
  }
  /**
   * Returns `r := value + k * length` such that `r` is contained in this range.
   * The range must not be empty.
   *
   * E.g. `[5, 10).clipCyclic(10) === 5`, `[5, 10).clipCyclic(11) === 6` and `[5, 10).clipCyclic(4) === 9`.
   */
  clipCyclic(t) {
    if (this.isEmpty)
      throw new $e(`Invalid clipping range: ${this.toString()}`);
    return t < this.start ? this.endExclusive - (this.start - t) % this.length : t >= this.endExclusive ? this.start + (t - this.start) % this.length : t;
  }
  forEach(t) {
    for (let n = this.start; n < this.endExclusive; n++)
      t(n);
  }
}
function Rt(e, t) {
  const n = Dt(e, t);
  return n === -1 ? void 0 : e[n];
}
function Dt(e, t, n = 0, i = e.length) {
  let r = n, a = i;
  for (; r < a; ) {
    const s = Math.floor((r + a) / 2);
    t(e[s]) ? r = s + 1 : a = s;
  }
  return r - 1;
}
function Xo(e, t) {
  const n = $n(e, t);
  return n === e.length ? void 0 : e[n];
}
function $n(e, t, n = 0, i = e.length) {
  let r = n, a = i;
  for (; r < a; ) {
    const s = Math.floor((r + a) / 2);
    t(e[s]) ? a = s : r = s + 1;
  }
  return r;
}
class Bt {
  constructor(t) {
    this._array = t, this._findLastMonotonousLastIdx = 0;
  }
  /**
   * The predicate must be monotonous, i.e. `arr.map(predicate)` must be like `[true, ..., true, false, ..., false]`!
   * For subsequent calls, current predicate must be weaker than (or equal to) the previous predicate, i.e. more entries must be `true`.
   */
  findLastMonotonous(t) {
    if (Bt.assertInvariants) {
      if (this._prevFindLastPredicate) {
        for (const i of this._array)
          if (this._prevFindLastPredicate(i) && !t(i))
            throw new Error("MonotonousArray: current predicate must be weaker than (or equal to) the previous predicate.");
      }
      this._prevFindLastPredicate = t;
    }
    const n = Dt(this._array, t, this._findLastMonotonousLastIdx);
    return this._findLastMonotonousLastIdx = n + 1, n === -1 ? void 0 : this._array[n];
  }
}
Bt.assertInvariants = !1;
class Q {
  static fromRange(t) {
    return new Q(t.startLineNumber, t.endLineNumber);
  }
  /**
   * @param lineRanges An array of sorted line ranges.
   */
  static joinMany(t) {
    if (t.length === 0)
      return [];
    let n = new Ne(t[0].slice());
    for (let i = 1; i < t.length; i++)
      n = n.getUnion(new Ne(t[i].slice()));
    return n.ranges;
  }
  static ofLength(t, n) {
    return new Q(t, t + n);
  }
  /**
   * @internal
   */
  static deserialize(t) {
    return new Q(t[0], t[1]);
  }
  constructor(t, n) {
    if (t > n)
      throw new $e(`startLineNumber ${t} cannot be after endLineNumberExclusive ${n}`);
    this.startLineNumber = t, this.endLineNumberExclusive = n;
  }
  /**
   * Indicates if this line range contains the given line number.
   */
  contains(t) {
    return this.startLineNumber <= t && t < this.endLineNumberExclusive;
  }
  /**
   * Indicates if this line range is empty.
   */
  get isEmpty() {
    return this.startLineNumber === this.endLineNumberExclusive;
  }
  /**
   * Moves this line range by the given offset of line numbers.
   */
  delta(t) {
    return new Q(this.startLineNumber + t, this.endLineNumberExclusive + t);
  }
  deltaLength(t) {
    return new Q(this.startLineNumber, this.endLineNumberExclusive + t);
  }
  /**
   * The number of lines this line range spans.
   */
  get length() {
    return this.endLineNumberExclusive - this.startLineNumber;
  }
  /**
   * Creates a line range that combines this and the given line range.
   */
  join(t) {
    return new Q(Math.min(this.startLineNumber, t.startLineNumber), Math.max(this.endLineNumberExclusive, t.endLineNumberExclusive));
  }
  toString() {
    return `[${this.startLineNumber},${this.endLineNumberExclusive})`;
  }
  /**
   * The resulting range is empty if the ranges do not intersect, but touch.
   * If the ranges don't even touch, the result is undefined.
   */
  intersect(t) {
    const n = Math.max(this.startLineNumber, t.startLineNumber), i = Math.min(this.endLineNumberExclusive, t.endLineNumberExclusive);
    if (n <= i)
      return new Q(n, i);
  }
  intersectsStrict(t) {
    return this.startLineNumber < t.endLineNumberExclusive && t.startLineNumber < this.endLineNumberExclusive;
  }
  overlapOrTouch(t) {
    return this.startLineNumber <= t.endLineNumberExclusive && t.startLineNumber <= this.endLineNumberExclusive;
  }
  equals(t) {
    return this.startLineNumber === t.startLineNumber && this.endLineNumberExclusive === t.endLineNumberExclusive;
  }
  toInclusiveRange() {
    return this.isEmpty ? null : new oe(this.startLineNumber, 1, this.endLineNumberExclusive - 1, Number.MAX_SAFE_INTEGER);
  }
  toExclusiveRange() {
    return new oe(this.startLineNumber, 1, this.endLineNumberExclusive, 1);
  }
  mapToLineArray(t) {
    const n = [];
    for (let i = this.startLineNumber; i < this.endLineNumberExclusive; i++)
      n.push(t(i));
    return n;
  }
  forEach(t) {
    for (let n = this.startLineNumber; n < this.endLineNumberExclusive; n++)
      t(n);
  }
  /**
   * @internal
   */
  serialize() {
    return [this.startLineNumber, this.endLineNumberExclusive];
  }
  includes(t) {
    return this.startLineNumber <= t && t < this.endLineNumberExclusive;
  }
  /**
   * Converts this 1-based line range to a 0-based offset range (subtracts 1!).
   * @internal
   */
  toOffsetRange() {
    return new G(this.startLineNumber - 1, this.endLineNumberExclusive - 1);
  }
}
class Ne {
  constructor(t = []) {
    this._normalizedRanges = t;
  }
  get ranges() {
    return this._normalizedRanges;
  }
  addRange(t) {
    if (t.length === 0)
      return;
    const n = $n(this._normalizedRanges, (r) => r.endLineNumberExclusive >= t.startLineNumber), i = Dt(this._normalizedRanges, (r) => r.startLineNumber <= t.endLineNumberExclusive) + 1;
    if (n === i)
      this._normalizedRanges.splice(n, 0, t);
    else if (n === i - 1) {
      const r = this._normalizedRanges[n];
      this._normalizedRanges[n] = r.join(t);
    } else {
      const r = this._normalizedRanges[n].join(this._normalizedRanges[i - 1]).join(t);
      this._normalizedRanges.splice(n, i - n, r);
    }
  }
  contains(t) {
    const n = Rt(this._normalizedRanges, (i) => i.startLineNumber <= t);
    return !!n && n.endLineNumberExclusive > t;
  }
  getUnion(t) {
    if (this._normalizedRanges.length === 0)
      return t;
    if (t._normalizedRanges.length === 0)
      return this;
    const n = [];
    let i = 0, r = 0, a = null;
    for (; i < this._normalizedRanges.length || r < t._normalizedRanges.length; ) {
      let s = null;
      if (i < this._normalizedRanges.length && r < t._normalizedRanges.length) {
        const l = this._normalizedRanges[i], o = t._normalizedRanges[r];
        l.startLineNumber < o.startLineNumber ? (s = l, i++) : (s = o, r++);
      } else
        i < this._normalizedRanges.length ? (s = this._normalizedRanges[i], i++) : (s = t._normalizedRanges[r], r++);
      a === null ? a = s : a.endLineNumberExclusive >= s.startLineNumber ? a = new Q(a.startLineNumber, Math.max(a.endLineNumberExclusive, s.endLineNumberExclusive)) : (n.push(a), a = s);
    }
    return a !== null && n.push(a), new Ne(n);
  }
  /**
   * Subtracts all ranges in this set from `range` and returns the result.
   */
  subtractFrom(t) {
    const n = $n(this._normalizedRanges, (s) => s.endLineNumberExclusive >= t.startLineNumber), i = Dt(this._normalizedRanges, (s) => s.startLineNumber <= t.endLineNumberExclusive) + 1;
    if (n === i)
      return new Ne([t]);
    const r = [];
    let a = t.startLineNumber;
    for (let s = n; s < i; s++) {
      const l = this._normalizedRanges[s];
      l.startLineNumber > a && r.push(new Q(a, l.startLineNumber)), a = l.endLineNumberExclusive;
    }
    return a < t.endLineNumberExclusive && r.push(new Q(a, t.endLineNumberExclusive)), new Ne(r);
  }
  toString() {
    return this._normalizedRanges.map((t) => t.toString()).join(", ");
  }
  getIntersection(t) {
    const n = [];
    let i = 0, r = 0;
    for (; i < this._normalizedRanges.length && r < t._normalizedRanges.length; ) {
      const a = this._normalizedRanges[i], s = t._normalizedRanges[r], l = a.intersect(s);
      l && !l.isEmpty && n.push(l), a.endLineNumberExclusive < s.endLineNumberExclusive ? i++ : r++;
    }
    return new Ne(n);
  }
  getWithDelta(t) {
    return new Ne(this._normalizedRanges.map((n) => n.delta(t)));
  }
}
class Ze {
  static inverse(t, n, i) {
    const r = [];
    let a = 1, s = 1;
    for (const o of t) {
      const u = new We(new Q(a, o.original.startLineNumber), new Q(s, o.modified.startLineNumber), void 0);
      u.modified.isEmpty || r.push(u), a = o.original.endLineNumberExclusive, s = o.modified.endLineNumberExclusive;
    }
    const l = new We(new Q(a, n + 1), new Q(s, i + 1), void 0);
    return l.modified.isEmpty || r.push(l), r;
  }
  constructor(t, n) {
    this.original = t, this.modified = n;
  }
  toString() {
    return `{${this.original.toString()}->${this.modified.toString()}}`;
  }
  flip() {
    return new Ze(this.modified, this.original);
  }
  join(t) {
    return new Ze(this.original.join(t.original), this.modified.join(t.modified));
  }
}
class We extends Ze {
  constructor(t, n, i) {
    super(t, n), this.innerChanges = i;
  }
  flip() {
    var t;
    return new We(this.modified, this.original, (t = this.innerChanges) === null || t === void 0 ? void 0 : t.map((n) => n.flip()));
  }
}
class Nt {
  constructor(t, n) {
    this.originalRange = t, this.modifiedRange = n;
  }
  toString() {
    return `{${this.originalRange.toString()}->${this.modifiedRange.toString()}}`;
  }
  flip() {
    return new Nt(this.modifiedRange, this.originalRange);
  }
}
const Jo = 3;
class Qo {
  computeDiff(t, n, i) {
    var r;
    const s = new Ko(t, n, {
      maxComputationTime: i.maxComputationTimeMs,
      shouldIgnoreTrimWhitespace: i.ignoreTrimWhitespace,
      shouldComputeCharChanges: !0,
      shouldMakePrettyDiff: !0,
      shouldPostProcessCharChanges: !0
    }).computeDiff(), l = [];
    let o = null;
    for (const u of s.changes) {
      let c;
      u.originalEndLineNumber === 0 ? c = new Q(u.originalStartLineNumber + 1, u.originalStartLineNumber + 1) : c = new Q(u.originalStartLineNumber, u.originalEndLineNumber + 1);
      let h;
      u.modifiedEndLineNumber === 0 ? h = new Q(u.modifiedStartLineNumber + 1, u.modifiedStartLineNumber + 1) : h = new Q(u.modifiedStartLineNumber, u.modifiedEndLineNumber + 1);
      let m = new We(c, h, (r = u.charChanges) === null || r === void 0 ? void 0 : r.map((f) => new Nt(new oe(f.originalStartLineNumber, f.originalStartColumn, f.originalEndLineNumber, f.originalEndColumn), new oe(f.modifiedStartLineNumber, f.modifiedStartColumn, f.modifiedEndLineNumber, f.modifiedEndColumn))));
      o && (o.modified.endLineNumberExclusive === m.modified.startLineNumber || o.original.endLineNumberExclusive === m.original.startLineNumber) && (m = new We(o.original.join(m.original), o.modified.join(m.modified), o.innerChanges && m.innerChanges ? o.innerChanges.concat(m.innerChanges) : void 0), l.pop()), l.push(m), o = m;
    }
    return rn(() => ja(l, (u, c) => c.original.startLineNumber - u.original.endLineNumberExclusive === c.modified.startLineNumber - u.modified.endLineNumberExclusive && // There has to be an unchanged line in between (otherwise both diffs should have been joined)
    u.original.endLineNumberExclusive < c.original.startLineNumber && u.modified.endLineNumberExclusive < c.modified.startLineNumber)), new Yt(l, [], s.quitEarly);
  }
}
function Ga(e, t, n, i) {
  return new Ge(e, t, n).ComputeDiff(i);
}
let xr = class {
  constructor(t) {
    const n = [], i = [];
    for (let r = 0, a = t.length; r < a; r++)
      n[r] = Xn(t[r], 1), i[r] = Jn(t[r], 1);
    this.lines = t, this._startColumns = n, this._endColumns = i;
  }
  getElements() {
    const t = [];
    for (let n = 0, i = this.lines.length; n < i; n++)
      t[n] = this.lines[n].substring(this._startColumns[n] - 1, this._endColumns[n] - 1);
    return t;
  }
  getStrictElement(t) {
    return this.lines[t];
  }
  getStartLineNumber(t) {
    return t + 1;
  }
  getEndLineNumber(t) {
    return t + 1;
  }
  createCharSequence(t, n, i) {
    const r = [], a = [], s = [];
    let l = 0;
    for (let o = n; o <= i; o++) {
      const u = this.lines[o], c = t ? this._startColumns[o] : 1, h = t ? this._endColumns[o] : u.length + 1;
      for (let m = c; m < h; m++)
        r[l] = u.charCodeAt(m - 1), a[l] = o + 1, s[l] = m, l++;
      !t && o < i && (r[l] = 10, a[l] = o + 1, s[l] = u.length + 1, l++);
    }
    return new Yo(r, a, s);
  }
};
class Yo {
  constructor(t, n, i) {
    this._charCodes = t, this._lineNumbers = n, this._columns = i;
  }
  toString() {
    return "[" + this._charCodes.map((t, n) => (t === 10 ? "\\n" : String.fromCharCode(t)) + `-(${this._lineNumbers[n]},${this._columns[n]})`).join(", ") + "]";
  }
  _assertIndex(t, n) {
    if (t < 0 || t >= n.length)
      throw new Error("Illegal index");
  }
  getElements() {
    return this._charCodes;
  }
  getStartLineNumber(t) {
    return t > 0 && t === this._lineNumbers.length ? this.getEndLineNumber(t - 1) : (this._assertIndex(t, this._lineNumbers), this._lineNumbers[t]);
  }
  getEndLineNumber(t) {
    return t === -1 ? this.getStartLineNumber(t + 1) : (this._assertIndex(t, this._lineNumbers), this._charCodes[t] === 10 ? this._lineNumbers[t] + 1 : this._lineNumbers[t]);
  }
  getStartColumn(t) {
    return t > 0 && t === this._columns.length ? this.getEndColumn(t - 1) : (this._assertIndex(t, this._columns), this._columns[t]);
  }
  getEndColumn(t) {
    return t === -1 ? this.getStartColumn(t + 1) : (this._assertIndex(t, this._columns), this._charCodes[t] === 10 ? 1 : this._columns[t] + 1);
  }
}
class mt {
  constructor(t, n, i, r, a, s, l, o) {
    this.originalStartLineNumber = t, this.originalStartColumn = n, this.originalEndLineNumber = i, this.originalEndColumn = r, this.modifiedStartLineNumber = a, this.modifiedStartColumn = s, this.modifiedEndLineNumber = l, this.modifiedEndColumn = o;
  }
  static createFromDiffChange(t, n, i) {
    const r = n.getStartLineNumber(t.originalStart), a = n.getStartColumn(t.originalStart), s = n.getEndLineNumber(t.originalStart + t.originalLength - 1), l = n.getEndColumn(t.originalStart + t.originalLength - 1), o = i.getStartLineNumber(t.modifiedStart), u = i.getStartColumn(t.modifiedStart), c = i.getEndLineNumber(t.modifiedStart + t.modifiedLength - 1), h = i.getEndColumn(t.modifiedStart + t.modifiedLength - 1);
    return new mt(r, a, s, l, o, u, c, h);
  }
}
function Zo(e) {
  if (e.length <= 1)
    return e;
  const t = [e[0]];
  let n = t[0];
  for (let i = 1, r = e.length; i < r; i++) {
    const a = e[i], s = a.originalStart - (n.originalStart + n.originalLength), l = a.modifiedStart - (n.modifiedStart + n.modifiedLength);
    Math.min(s, l) < Jo ? (n.originalLength = a.originalStart + a.originalLength - n.originalStart, n.modifiedLength = a.modifiedStart + a.modifiedLength - n.modifiedStart) : (t.push(a), n = a);
  }
  return t;
}
class At {
  constructor(t, n, i, r, a) {
    this.originalStartLineNumber = t, this.originalEndLineNumber = n, this.modifiedStartLineNumber = i, this.modifiedEndLineNumber = r, this.charChanges = a;
  }
  static createFromDiffResult(t, n, i, r, a, s, l) {
    let o, u, c, h, m;
    if (n.originalLength === 0 ? (o = i.getStartLineNumber(n.originalStart) - 1, u = 0) : (o = i.getStartLineNumber(n.originalStart), u = i.getEndLineNumber(n.originalStart + n.originalLength - 1)), n.modifiedLength === 0 ? (c = r.getStartLineNumber(n.modifiedStart) - 1, h = 0) : (c = r.getStartLineNumber(n.modifiedStart), h = r.getEndLineNumber(n.modifiedStart + n.modifiedLength - 1)), s && n.originalLength > 0 && n.originalLength < 20 && n.modifiedLength > 0 && n.modifiedLength < 20 && a()) {
      const f = i.createCharSequence(t, n.originalStart, n.originalStart + n.originalLength - 1), g = r.createCharSequence(t, n.modifiedStart, n.modifiedStart + n.modifiedLength - 1);
      if (f.getElements().length > 0 && g.getElements().length > 0) {
        let p = Ga(f, g, a, !0).changes;
        l && (p = Zo(p)), m = [];
        for (let w = 0, y = p.length; w < y; w++)
          m.push(mt.createFromDiffChange(p[w], f, g));
      }
    }
    return new At(o, u, c, h, m);
  }
}
class Ko {
  constructor(t, n, i) {
    this.shouldComputeCharChanges = i.shouldComputeCharChanges, this.shouldPostProcessCharChanges = i.shouldPostProcessCharChanges, this.shouldIgnoreTrimWhitespace = i.shouldIgnoreTrimWhitespace, this.shouldMakePrettyDiff = i.shouldMakePrettyDiff, this.originalLines = t, this.modifiedLines = n, this.original = new xr(t), this.modified = new xr(n), this.continueLineDiff = kr(i.maxComputationTime), this.continueCharDiff = kr(i.maxComputationTime === 0 ? 0 : Math.min(i.maxComputationTime, 5e3));
  }
  computeDiff() {
    if (this.original.lines.length === 1 && this.original.lines[0].length === 0)
      return this.modified.lines.length === 1 && this.modified.lines[0].length === 0 ? {
        quitEarly: !1,
        changes: []
      } : {
        quitEarly: !1,
        changes: [{
          originalStartLineNumber: 1,
          originalEndLineNumber: 1,
          modifiedStartLineNumber: 1,
          modifiedEndLineNumber: this.modified.lines.length,
          charChanges: void 0
        }]
      };
    if (this.modified.lines.length === 1 && this.modified.lines[0].length === 0)
      return {
        quitEarly: !1,
        changes: [{
          originalStartLineNumber: 1,
          originalEndLineNumber: this.original.lines.length,
          modifiedStartLineNumber: 1,
          modifiedEndLineNumber: 1,
          charChanges: void 0
        }]
      };
    const t = Ga(this.original, this.modified, this.continueLineDiff, this.shouldMakePrettyDiff), n = t.changes, i = t.quitEarly;
    if (this.shouldIgnoreTrimWhitespace) {
      const l = [];
      for (let o = 0, u = n.length; o < u; o++)
        l.push(At.createFromDiffResult(this.shouldIgnoreTrimWhitespace, n[o], this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges));
      return {
        quitEarly: i,
        changes: l
      };
    }
    const r = [];
    let a = 0, s = 0;
    for (let l = -1, o = n.length; l < o; l++) {
      const u = l + 1 < o ? n[l + 1] : null, c = u ? u.originalStart : this.originalLines.length, h = u ? u.modifiedStart : this.modifiedLines.length;
      for (; a < c && s < h; ) {
        const m = this.originalLines[a], f = this.modifiedLines[s];
        if (m !== f) {
          {
            let g = Xn(m, 1), p = Xn(f, 1);
            for (; g > 1 && p > 1; ) {
              const w = m.charCodeAt(g - 2), y = f.charCodeAt(p - 2);
              if (w !== y)
                break;
              g--, p--;
            }
            (g > 1 || p > 1) && this._pushTrimWhitespaceCharChange(r, a + 1, 1, g, s + 1, 1, p);
          }
          {
            let g = Jn(m, 1), p = Jn(f, 1);
            const w = m.length + 1, y = f.length + 1;
            for (; g < w && p < y; ) {
              const v = m.charCodeAt(g - 1), x = m.charCodeAt(p - 1);
              if (v !== x)
                break;
              g++, p++;
            }
            (g < w || p < y) && this._pushTrimWhitespaceCharChange(r, a + 1, g, w, s + 1, p, y);
          }
        }
        a++, s++;
      }
      u && (r.push(At.createFromDiffResult(this.shouldIgnoreTrimWhitespace, u, this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges)), a += u.originalLength, s += u.modifiedLength);
    }
    return {
      quitEarly: i,
      changes: r
    };
  }
  _pushTrimWhitespaceCharChange(t, n, i, r, a, s, l) {
    if (this._mergeTrimWhitespaceCharChange(t, n, i, r, a, s, l))
      return;
    let o;
    this.shouldComputeCharChanges && (o = [new mt(n, i, n, r, a, s, a, l)]), t.push(new At(n, n, a, a, o));
  }
  _mergeTrimWhitespaceCharChange(t, n, i, r, a, s, l) {
    const o = t.length;
    if (o === 0)
      return !1;
    const u = t[o - 1];
    return u.originalEndLineNumber === 0 || u.modifiedEndLineNumber === 0 ? !1 : u.originalEndLineNumber === n && u.modifiedEndLineNumber === a ? (this.shouldComputeCharChanges && u.charChanges && u.charChanges.push(new mt(n, i, n, r, a, s, a, l)), !0) : u.originalEndLineNumber + 1 === n && u.modifiedEndLineNumber + 1 === a ? (u.originalEndLineNumber = n, u.modifiedEndLineNumber = a, this.shouldComputeCharChanges && u.charChanges && u.charChanges.push(new mt(n, i, n, r, a, s, a, l)), !0) : !1;
  }
}
function Xn(e, t) {
  const n = Ds(e);
  return n === -1 ? t : n + 1;
}
function Jn(e, t) {
  const n = Ns(e);
  return n === -1 ? t : n + 2;
}
function kr(e) {
  if (e === 0)
    return () => !0;
  const t = Date.now();
  return () => Date.now() - t < e;
}
class He {
  static trivial(t, n) {
    return new He([new re(G.ofLength(t.length), G.ofLength(n.length))], !1);
  }
  static trivialTimedOut(t, n) {
    return new He([new re(G.ofLength(t.length), G.ofLength(n.length))], !0);
  }
  constructor(t, n) {
    this.diffs = t, this.hitTimeout = n;
  }
}
class re {
  static invert(t, n) {
    const i = [];
    return po(t, (r, a) => {
      i.push(re.fromOffsetPairs(r ? r.getEndExclusives() : Ie.zero, a ? a.getStarts() : new Ie(n, (r ? r.seq2Range.endExclusive - r.seq1Range.endExclusive : 0) + n)));
    }), i;
  }
  static fromOffsetPairs(t, n) {
    return new re(new G(t.offset1, n.offset1), new G(t.offset2, n.offset2));
  }
  constructor(t, n) {
    this.seq1Range = t, this.seq2Range = n;
  }
  swap() {
    return new re(this.seq2Range, this.seq1Range);
  }
  toString() {
    return `${this.seq1Range} <-> ${this.seq2Range}`;
  }
  join(t) {
    return new re(this.seq1Range.join(t.seq1Range), this.seq2Range.join(t.seq2Range));
  }
  delta(t) {
    return t === 0 ? this : new re(this.seq1Range.delta(t), this.seq2Range.delta(t));
  }
  deltaStart(t) {
    return t === 0 ? this : new re(this.seq1Range.deltaStart(t), this.seq2Range.deltaStart(t));
  }
  deltaEnd(t) {
    return t === 0 ? this : new re(this.seq1Range.deltaEnd(t), this.seq2Range.deltaEnd(t));
  }
  intersect(t) {
    const n = this.seq1Range.intersect(t.seq1Range), i = this.seq2Range.intersect(t.seq2Range);
    if (!(!n || !i))
      return new re(n, i);
  }
  getStarts() {
    return new Ie(this.seq1Range.start, this.seq2Range.start);
  }
  getEndExclusives() {
    return new Ie(this.seq1Range.endExclusive, this.seq2Range.endExclusive);
  }
}
class Ie {
  constructor(t, n) {
    this.offset1 = t, this.offset2 = n;
  }
  toString() {
    return `${this.offset1} <-> ${this.offset2}`;
  }
}
Ie.zero = new Ie(0, 0);
Ie.max = new Ie(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
class It {
  isValid() {
    return !0;
  }
}
It.instance = new It();
class el {
  constructor(t) {
    if (this.timeout = t, this.startTime = Date.now(), this.valid = !0, t <= 0)
      throw new $e("timeout must be positive");
  }
  // Recommendation: Set a log-point `{this.disable()}` in the body
  isValid() {
    if (!(Date.now() - this.startTime < this.timeout) && this.valid) {
      this.valid = !1;
      debugger;
    }
    return this.valid;
  }
}
class An {
  constructor(t, n) {
    this.width = t, this.height = n, this.array = [], this.array = new Array(t * n);
  }
  get(t, n) {
    return this.array[t + n * this.width];
  }
  set(t, n, i) {
    this.array[t + n * this.width] = i;
  }
}
function Qn(e) {
  return e === 32 || e === 9;
}
class vt {
  static getKey(t) {
    let n = this.chrKeys.get(t);
    return n === void 0 && (n = this.chrKeys.size, this.chrKeys.set(t, n)), n;
  }
  constructor(t, n, i) {
    this.range = t, this.lines = n, this.source = i, this.histogram = [];
    let r = 0;
    for (let a = t.startLineNumber - 1; a < t.endLineNumberExclusive - 1; a++) {
      const s = n[a];
      for (let o = 0; o < s.length; o++) {
        r++;
        const u = s[o], c = vt.getKey(u);
        this.histogram[c] = (this.histogram[c] || 0) + 1;
      }
      r++;
      const l = vt.getKey(`
`);
      this.histogram[l] = (this.histogram[l] || 0) + 1;
    }
    this.totalCount = r;
  }
  computeSimilarity(t) {
    var n, i;
    let r = 0;
    const a = Math.max(this.histogram.length, t.histogram.length);
    for (let s = 0; s < a; s++)
      r += Math.abs(((n = this.histogram[s]) !== null && n !== void 0 ? n : 0) - ((i = t.histogram[s]) !== null && i !== void 0 ? i : 0));
    return 1 - r / (this.totalCount + t.totalCount);
  }
}
vt.chrKeys = /* @__PURE__ */ new Map();
class tl {
  compute(t, n, i = It.instance, r) {
    if (t.length === 0 || n.length === 0)
      return He.trivial(t, n);
    const a = new An(t.length, n.length), s = new An(t.length, n.length), l = new An(t.length, n.length);
    for (let g = 0; g < t.length; g++)
      for (let p = 0; p < n.length; p++) {
        if (!i.isValid())
          return He.trivialTimedOut(t, n);
        const w = g === 0 ? 0 : a.get(g - 1, p), y = p === 0 ? 0 : a.get(g, p - 1);
        let v;
        t.getElement(g) === n.getElement(p) ? (g === 0 || p === 0 ? v = 0 : v = a.get(g - 1, p - 1), g > 0 && p > 0 && s.get(g - 1, p - 1) === 3 && (v += l.get(g - 1, p - 1)), v += r ? r(g, p) : 1) : v = -1;
        const x = Math.max(w, y, v);
        if (x === v) {
          const E = g > 0 && p > 0 ? l.get(g - 1, p - 1) : 0;
          l.set(g, p, E + 1), s.set(g, p, 3);
        } else
          x === w ? (l.set(g, p, 0), s.set(g, p, 1)) : x === y && (l.set(g, p, 0), s.set(g, p, 2));
        a.set(g, p, x);
      }
    const o = [];
    let u = t.length, c = n.length;
    function h(g, p) {
      (g + 1 !== u || p + 1 !== c) && o.push(new re(new G(g + 1, u), new G(p + 1, c))), u = g, c = p;
    }
    let m = t.length - 1, f = n.length - 1;
    for (; m >= 0 && f >= 0; )
      s.get(m, f) === 3 ? (h(m, f), m--, f--) : s.get(m, f) === 1 ? m-- : f--;
    return h(-1, -1), o.reverse(), new He(o, !1);
  }
}
class $a {
  compute(t, n, i = It.instance) {
    if (t.length === 0 || n.length === 0)
      return He.trivial(t, n);
    const r = t, a = n;
    function s(p, w) {
      for (; p < r.length && w < a.length && r.getElement(p) === a.getElement(w); )
        p++, w++;
      return p;
    }
    let l = 0;
    const o = new nl();
    o.set(0, s(0, 0));
    const u = new il();
    u.set(0, o.get(0) === 0 ? null : new Ar(null, 0, 0, o.get(0)));
    let c = 0;
    e:
      for (; ; ) {
        if (l++, !i.isValid())
          return He.trivialTimedOut(r, a);
        const p = -Math.min(l, a.length + l % 2), w = Math.min(l, r.length + l % 2);
        for (c = p; c <= w; c += 2) {
          const y = c === w ? -1 : o.get(c + 1), v = c === p ? -1 : o.get(c - 1) + 1, x = Math.min(Math.max(y, v), r.length), E = x - c;
          if (x > r.length || E > a.length)
            continue;
          const I = s(x, E);
          o.set(c, I);
          const B = x === y ? u.get(c + 1) : u.get(c - 1);
          if (u.set(c, I !== x ? new Ar(B, x, E, I - x) : B), o.get(c) === r.length && o.get(c) - c === a.length)
            break e;
        }
      }
    let h = u.get(c);
    const m = [];
    let f = r.length, g = a.length;
    for (; ; ) {
      const p = h ? h.x + h.length : 0, w = h ? h.y + h.length : 0;
      if ((p !== f || w !== g) && m.push(new re(new G(p, f), new G(w, g))), !h)
        break;
      f = h.x, g = h.y, h = h.prev;
    }
    return m.reverse(), new He(m, !1);
  }
}
class Ar {
  constructor(t, n, i, r) {
    this.prev = t, this.x = n, this.y = i, this.length = r;
  }
}
class nl {
  constructor() {
    this.positiveArr = new Int32Array(10), this.negativeArr = new Int32Array(10);
  }
  get(t) {
    return t < 0 ? (t = -t - 1, this.negativeArr[t]) : this.positiveArr[t];
  }
  set(t, n) {
    if (t < 0) {
      if (t = -t - 1, t >= this.negativeArr.length) {
        const i = this.negativeArr;
        this.negativeArr = new Int32Array(i.length * 2), this.negativeArr.set(i);
      }
      this.negativeArr[t] = n;
    } else {
      if (t >= this.positiveArr.length) {
        const i = this.positiveArr;
        this.positiveArr = new Int32Array(i.length * 2), this.positiveArr.set(i);
      }
      this.positiveArr[t] = n;
    }
  }
}
class il {
  constructor() {
    this.positiveArr = [], this.negativeArr = [];
  }
  get(t) {
    return t < 0 ? (t = -t - 1, this.negativeArr[t]) : this.positiveArr[t];
  }
  set(t, n) {
    t < 0 ? (t = -t - 1, this.negativeArr[t] = n) : this.positiveArr[t] = n;
  }
}
class rl {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  add(t, n) {
    let i = this.map.get(t);
    i || (i = /* @__PURE__ */ new Set(), this.map.set(t, i)), i.add(n);
  }
  delete(t, n) {
    const i = this.map.get(t);
    i && (i.delete(n), i.size === 0 && this.map.delete(t));
  }
  forEach(t, n) {
    const i = this.map.get(t);
    i && i.forEach(n);
  }
  get(t) {
    const n = this.map.get(t);
    return n || /* @__PURE__ */ new Set();
  }
}
class an {
  constructor(t, n, i) {
    this.lines = t, this.considerWhitespaceChanges = i, this.elements = [], this.firstCharOffsetByLine = [], this.additionalOffsetByLine = [];
    let r = !1;
    n.start > 0 && n.endExclusive >= t.length && (n = new G(n.start - 1, n.endExclusive), r = !0), this.lineRange = n, this.firstCharOffsetByLine[0] = 0;
    for (let a = this.lineRange.start; a < this.lineRange.endExclusive; a++) {
      let s = t[a], l = 0;
      if (r)
        l = s.length, s = "", r = !1;
      else if (!i) {
        const o = s.trimStart();
        l = s.length - o.length, s = o.trimEnd();
      }
      this.additionalOffsetByLine.push(l);
      for (let o = 0; o < s.length; o++)
        this.elements.push(s.charCodeAt(o));
      a < t.length - 1 && (this.elements.push(`
`.charCodeAt(0)), this.firstCharOffsetByLine[a - this.lineRange.start + 1] = this.elements.length);
    }
    this.additionalOffsetByLine.push(0);
  }
  toString() {
    return `Slice: "${this.text}"`;
  }
  get text() {
    return this.getText(new G(0, this.length));
  }
  getText(t) {
    return this.elements.slice(t.start, t.endExclusive).map((n) => String.fromCharCode(n)).join("");
  }
  getElement(t) {
    return this.elements[t];
  }
  get length() {
    return this.elements.length;
  }
  getBoundaryScore(t) {
    const n = Lr(t > 0 ? this.elements[t - 1] : -1), i = Lr(t < this.elements.length ? this.elements[t] : -1);
    if (n === 6 && i === 7)
      return 0;
    let r = 0;
    return n !== i && (r += 10, n === 0 && i === 1 && (r += 1)), r += Sr(n), r += Sr(i), r;
  }
  translateOffset(t) {
    if (this.lineRange.isEmpty)
      return new Ue(this.lineRange.start + 1, 1);
    const n = Dt(this.firstCharOffsetByLine, (i) => i <= t);
    return new Ue(this.lineRange.start + n + 1, t - this.firstCharOffsetByLine[n] + this.additionalOffsetByLine[n] + 1);
  }
  translateRange(t) {
    return oe.fromPositions(this.translateOffset(t.start), this.translateOffset(t.endExclusive));
  }
  /**
   * Finds the word that contains the character at the given offset
   */
  findWordContaining(t) {
    if (t < 0 || t >= this.elements.length || !Sn(this.elements[t]))
      return;
    let n = t;
    for (; n > 0 && Sn(this.elements[n - 1]); )
      n--;
    let i = t;
    for (; i < this.elements.length && Sn(this.elements[i]); )
      i++;
    return new G(n, i);
  }
  countLinesIn(t) {
    return this.translateOffset(t.endExclusive).lineNumber - this.translateOffset(t.start).lineNumber;
  }
  isStronglyEqual(t, n) {
    return this.elements[t] === this.elements[n];
  }
  extendToFullLines(t) {
    var n, i;
    const r = (n = Rt(this.firstCharOffsetByLine, (s) => s <= t.start)) !== null && n !== void 0 ? n : 0, a = (i = Xo(this.firstCharOffsetByLine, (s) => t.endExclusive <= s)) !== null && i !== void 0 ? i : this.elements.length;
    return new G(r, a);
  }
}
function Sn(e) {
  return e >= 97 && e <= 122 || e >= 65 && e <= 90 || e >= 48 && e <= 57;
}
const al = {
  0: 0,
  1: 0,
  2: 0,
  3: 10,
  4: 2,
  5: 3,
  6: 10,
  7: 10
};
function Sr(e) {
  return al[e];
}
function Lr(e) {
  return e === 10 ? 7 : e === 13 ? 6 : Qn(e) ? 5 : e >= 97 && e <= 122 ? 0 : e >= 65 && e <= 90 ? 1 : e >= 48 && e <= 57 ? 2 : e === -1 ? 3 : 4;
}
function sl(e, t, n, i, r, a) {
  let { moves: s, excludedChanges: l } = ol(e, t, n, a);
  if (!a.isValid())
    return [];
  const o = e.filter((c) => !l.has(c)), u = ll(o, i, r, t, n, a);
  return bo(s, u), s = ul(s), s = s.filter((c) => c.original.toOffsetRange().slice(t).map((m) => m.trim()).join(`
`).length >= 10), s = cl(e, s), s;
}
function ol(e, t, n, i) {
  const r = [], a = e.filter((o) => o.modified.isEmpty && o.original.length >= 3).map((o) => new vt(o.original, t, o)), s = new Set(e.filter((o) => o.original.isEmpty && o.modified.length >= 3).map((o) => new vt(o.modified, n, o))), l = /* @__PURE__ */ new Set();
  for (const o of a) {
    let u = -1, c;
    for (const h of s) {
      const m = o.computeSimilarity(h);
      m > u && (u = m, c = h);
    }
    if (u > 0.9 && c && (s.delete(c), r.push(new Ze(o.range, c.range)), l.add(o.source), l.add(c.source)), !i.isValid())
      return { moves: r, excludedChanges: l };
  }
  return { moves: r, excludedChanges: l };
}
function ll(e, t, n, i, r, a) {
  const s = [], l = new rl();
  for (const m of e)
    for (let f = m.original.startLineNumber; f < m.original.endLineNumberExclusive - 2; f++) {
      const g = `${t[f - 1]}:${t[f + 1 - 1]}:${t[f + 2 - 1]}`;
      l.add(g, { range: new Q(f, f + 3) });
    }
  const o = [];
  e.sort($t((m) => m.modified.startLineNumber, Xt));
  for (const m of e) {
    let f = [];
    for (let g = m.modified.startLineNumber; g < m.modified.endLineNumberExclusive - 2; g++) {
      const p = `${n[g - 1]}:${n[g + 1 - 1]}:${n[g + 2 - 1]}`, w = new Q(g, g + 3), y = [];
      l.forEach(p, ({ range: v }) => {
        for (const E of f)
          if (E.originalLineRange.endLineNumberExclusive + 1 === v.endLineNumberExclusive && E.modifiedLineRange.endLineNumberExclusive + 1 === w.endLineNumberExclusive) {
            E.originalLineRange = new Q(E.originalLineRange.startLineNumber, v.endLineNumberExclusive), E.modifiedLineRange = new Q(E.modifiedLineRange.startLineNumber, w.endLineNumberExclusive), y.push(E);
            return;
          }
        const x = {
          modifiedLineRange: w,
          originalLineRange: v
        };
        o.push(x), y.push(x);
      }), f = y;
    }
    if (!a.isValid())
      return [];
  }
  o.sort(vo($t((m) => m.modifiedLineRange.length, Xt)));
  const u = new Ne(), c = new Ne();
  for (const m of o) {
    const f = m.modifiedLineRange.startLineNumber - m.originalLineRange.startLineNumber, g = u.subtractFrom(m.modifiedLineRange), p = c.subtractFrom(m.originalLineRange).getWithDelta(f), w = g.getIntersection(p);
    for (const y of w.ranges) {
      if (y.length < 3)
        continue;
      const v = y, x = y.delta(-f);
      s.push(new Ze(x, v)), u.addRange(v), c.addRange(x);
    }
  }
  s.sort($t((m) => m.original.startLineNumber, Xt));
  const h = new Bt(e);
  for (let m = 0; m < s.length; m++) {
    const f = s[m], g = h.findLastMonotonous((B) => B.original.startLineNumber <= f.original.startLineNumber), p = Rt(e, (B) => B.modified.startLineNumber <= f.modified.startLineNumber), w = Math.max(f.original.startLineNumber - g.original.startLineNumber, f.modified.startLineNumber - p.modified.startLineNumber), y = h.findLastMonotonous((B) => B.original.startLineNumber < f.original.endLineNumberExclusive), v = Rt(e, (B) => B.modified.startLineNumber < f.modified.endLineNumberExclusive), x = Math.max(y.original.endLineNumberExclusive - f.original.endLineNumberExclusive, v.modified.endLineNumberExclusive - f.modified.endLineNumberExclusive);
    let E;
    for (E = 0; E < w; E++) {
      const B = f.original.startLineNumber - E - 1, _ = f.modified.startLineNumber - E - 1;
      if (B > i.length || _ > r.length || u.contains(_) || c.contains(B) || !Cr(i[B - 1], r[_ - 1], a))
        break;
    }
    E > 0 && (c.addRange(new Q(f.original.startLineNumber - E, f.original.startLineNumber)), u.addRange(new Q(f.modified.startLineNumber - E, f.modified.startLineNumber)));
    let I;
    for (I = 0; I < x; I++) {
      const B = f.original.endLineNumberExclusive + I, _ = f.modified.endLineNumberExclusive + I;
      if (B > i.length || _ > r.length || u.contains(_) || c.contains(B) || !Cr(i[B - 1], r[_ - 1], a))
        break;
    }
    I > 0 && (c.addRange(new Q(f.original.endLineNumberExclusive, f.original.endLineNumberExclusive + I)), u.addRange(new Q(f.modified.endLineNumberExclusive, f.modified.endLineNumberExclusive + I))), (E > 0 || I > 0) && (s[m] = new Ze(new Q(f.original.startLineNumber - E, f.original.endLineNumberExclusive + I), new Q(f.modified.startLineNumber - E, f.modified.endLineNumberExclusive + I)));
  }
  return s;
}
function Cr(e, t, n) {
  if (e.trim() === t.trim())
    return !0;
  if (e.length > 300 && t.length > 300)
    return !1;
  const r = new $a().compute(new an([e], new G(0, 1), !1), new an([t], new G(0, 1), !1), n);
  let a = 0;
  const s = re.invert(r.diffs, e.length);
  for (const c of s)
    c.seq1Range.forEach((h) => {
      Qn(e.charCodeAt(h)) || a++;
    });
  function l(c) {
    let h = 0;
    for (let m = 0; m < e.length; m++)
      Qn(c.charCodeAt(m)) || h++;
    return h;
  }
  const o = l(e.length > t.length ? e : t);
  return a / o > 0.6 && o > 10;
}
function ul(e) {
  if (e.length === 0)
    return e;
  e.sort($t((n) => n.original.startLineNumber, Xt));
  const t = [e[0]];
  for (let n = 1; n < e.length; n++) {
    const i = t[t.length - 1], r = e[n], a = r.original.startLineNumber - i.original.endLineNumberExclusive, s = r.modified.startLineNumber - i.modified.endLineNumberExclusive;
    if (a >= 0 && s >= 0 && a + s <= 2) {
      t[t.length - 1] = i.join(r);
      continue;
    }
    t.push(r);
  }
  return t;
}
function cl(e, t) {
  const n = new Bt(e);
  return t = t.filter((i) => {
    const r = n.findLastMonotonous((l) => l.original.endLineNumberExclusive < i.original.endLineNumberExclusive) || new Ze(new Q(1, 1), new Q(1, 1)), a = Rt(e, (l) => l.modified.endLineNumberExclusive < i.modified.endLineNumberExclusive);
    return r !== a;
  }), t;
}
function Er(e, t, n) {
  let i = n;
  return i = hl(e, t, i), i = dl(e, t, i), i;
}
function hl(e, t, n) {
  if (n.length === 0)
    return n;
  const i = [];
  i.push(n[0]);
  for (let a = 1; a < n.length; a++) {
    const s = i[i.length - 1];
    let l = n[a];
    if (l.seq1Range.isEmpty || l.seq2Range.isEmpty) {
      const o = l.seq1Range.start - s.seq1Range.endExclusive;
      let u;
      for (u = 1; u <= o && !(e.getElement(l.seq1Range.start - u) !== e.getElement(l.seq1Range.endExclusive - u) || t.getElement(l.seq2Range.start - u) !== t.getElement(l.seq2Range.endExclusive - u)); u++)
        ;
      if (u--, u === o) {
        i[i.length - 1] = new re(new G(s.seq1Range.start, l.seq1Range.endExclusive - o), new G(s.seq2Range.start, l.seq2Range.endExclusive - o));
        continue;
      }
      l = l.delta(-u);
    }
    i.push(l);
  }
  const r = [];
  for (let a = 0; a < i.length - 1; a++) {
    const s = i[a + 1];
    let l = i[a];
    if (l.seq1Range.isEmpty || l.seq2Range.isEmpty) {
      const o = s.seq1Range.start - l.seq1Range.endExclusive;
      let u;
      for (u = 0; u < o && !(!e.isStronglyEqual(l.seq1Range.start + u, l.seq1Range.endExclusive + u) || !t.isStronglyEqual(l.seq2Range.start + u, l.seq2Range.endExclusive + u)); u++)
        ;
      if (u === o) {
        i[a + 1] = new re(new G(l.seq1Range.start + o, s.seq1Range.endExclusive), new G(l.seq2Range.start + o, s.seq2Range.endExclusive));
        continue;
      }
      u > 0 && (l = l.delta(u));
    }
    r.push(l);
  }
  return i.length > 0 && r.push(i[i.length - 1]), r;
}
function dl(e, t, n) {
  if (!e.getBoundaryScore || !t.getBoundaryScore)
    return n;
  for (let i = 0; i < n.length; i++) {
    const r = i > 0 ? n[i - 1] : void 0, a = n[i], s = i + 1 < n.length ? n[i + 1] : void 0, l = new G(r ? r.seq1Range.start + 1 : 0, s ? s.seq1Range.endExclusive - 1 : e.length), o = new G(r ? r.seq2Range.start + 1 : 0, s ? s.seq2Range.endExclusive - 1 : t.length);
    a.seq1Range.isEmpty ? n[i] = Mr(a, e, t, l, o) : a.seq2Range.isEmpty && (n[i] = Mr(a.swap(), t, e, o, l).swap());
  }
  return n;
}
function Mr(e, t, n, i, r) {
  let s = 1;
  for (; e.seq1Range.start - s >= i.start && e.seq2Range.start - s >= r.start && n.isStronglyEqual(e.seq2Range.start - s, e.seq2Range.endExclusive - s) && s < 100; )
    s++;
  s--;
  let l = 0;
  for (; e.seq1Range.start + l < i.endExclusive && e.seq2Range.endExclusive + l < r.endExclusive && n.isStronglyEqual(e.seq2Range.start + l, e.seq2Range.endExclusive + l) && l < 100; )
    l++;
  if (s === 0 && l === 0)
    return e;
  let o = 0, u = -1;
  for (let c = -s; c <= l; c++) {
    const h = e.seq2Range.start + c, m = e.seq2Range.endExclusive + c, f = e.seq1Range.start + c, g = t.getBoundaryScore(f) + n.getBoundaryScore(h) + n.getBoundaryScore(m);
    g > u && (u = g, o = c);
  }
  return e.delta(o);
}
function ml(e, t, n) {
  const i = [];
  for (const r of n) {
    const a = i[i.length - 1];
    if (!a) {
      i.push(r);
      continue;
    }
    r.seq1Range.start - a.seq1Range.endExclusive <= 2 || r.seq2Range.start - a.seq2Range.endExclusive <= 2 ? i[i.length - 1] = new re(a.seq1Range.join(r.seq1Range), a.seq2Range.join(r.seq2Range)) : i.push(r);
  }
  return i;
}
function fl(e, t, n) {
  const i = [];
  let r;
  function a() {
    if (!r)
      return;
    const o = r.s1Range.length - r.deleted;
    r.s2Range.length - r.added, Math.max(r.deleted, r.added) + (r.count - 1) > o && i.push(new re(r.s1Range, r.s2Range)), r = void 0;
  }
  for (const o of n) {
    let u = function(g, p) {
      var w, y, v, x;
      if (!r || !r.s1Range.containsRange(g) || !r.s2Range.containsRange(p))
        if (r && !(r.s1Range.endExclusive < g.start && r.s2Range.endExclusive < p.start)) {
          const B = G.tryCreate(r.s1Range.endExclusive, g.start), _ = G.tryCreate(r.s2Range.endExclusive, p.start);
          r.deleted += (w = B == null ? void 0 : B.length) !== null && w !== void 0 ? w : 0, r.added += (y = _ == null ? void 0 : _.length) !== null && y !== void 0 ? y : 0, r.s1Range = r.s1Range.join(g), r.s2Range = r.s2Range.join(p);
        } else
          a(), r = { added: 0, deleted: 0, count: 0, s1Range: g, s2Range: p };
      const E = g.intersect(o.seq1Range), I = p.intersect(o.seq2Range);
      r.count++, r.deleted += (v = E == null ? void 0 : E.length) !== null && v !== void 0 ? v : 0, r.added += (x = I == null ? void 0 : I.length) !== null && x !== void 0 ? x : 0;
    };
    var l = u;
    const c = e.findWordContaining(o.seq1Range.start - 1), h = t.findWordContaining(o.seq2Range.start - 1), m = e.findWordContaining(o.seq1Range.endExclusive), f = t.findWordContaining(o.seq2Range.endExclusive);
    c && m && h && f && c.equals(m) && h.equals(f) ? u(c, h) : (c && h && u(c, h), m && f && u(m, f));
  }
  return a(), pl(n, i);
}
function pl(e, t) {
  const n = [];
  for (; e.length > 0 || t.length > 0; ) {
    const i = e[0], r = t[0];
    let a;
    i && (!r || i.seq1Range.start < r.seq1Range.start) ? a = e.shift() : a = t.shift(), n.length > 0 && n[n.length - 1].seq1Range.endExclusive >= a.seq1Range.start ? n[n.length - 1] = n[n.length - 1].join(a) : n.push(a);
  }
  return n;
}
function gl(e, t, n) {
  let i = n;
  if (i.length === 0)
    return i;
  let r = 0, a;
  do {
    a = !1;
    const l = [
      i[0]
    ];
    for (let o = 1; o < i.length; o++) {
      let h = function(f, g) {
        const p = new G(c.seq1Range.endExclusive, u.seq1Range.start);
        return e.getText(p).replace(/\s/g, "").length <= 4 && (f.seq1Range.length + f.seq2Range.length > 5 || g.seq1Range.length + g.seq2Range.length > 5);
      };
      var s = h;
      const u = i[o], c = l[l.length - 1];
      h(c, u) ? (a = !0, l[l.length - 1] = l[l.length - 1].join(u)) : l.push(u);
    }
    i = l;
  } while (r++ < 10 && a);
  return i;
}
function bl(e, t, n) {
  let i = n;
  if (i.length === 0)
    return i;
  let r = 0, a;
  do {
    a = !1;
    const o = [
      i[0]
    ];
    for (let u = 1; u < i.length; u++) {
      let m = function(g, p) {
        const w = new G(h.seq1Range.endExclusive, c.seq1Range.start);
        if (e.countLinesIn(w) > 5 || w.length > 500)
          return !1;
        const v = e.getText(w).trim();
        if (v.length > 20 || v.split(/\r\n|\r|\n/).length > 1)
          return !1;
        const x = e.countLinesIn(g.seq1Range), E = g.seq1Range.length, I = t.countLinesIn(g.seq2Range), B = g.seq2Range.length, _ = e.countLinesIn(p.seq1Range), b = p.seq1Range.length, T = t.countLinesIn(p.seq2Range), q = p.seq2Range.length, F = 2 * 40 + 50;
        function S(L) {
          return Math.min(L, F);
        }
        return Math.pow(Math.pow(S(x * 40 + E), 1.5) + Math.pow(S(I * 40 + B), 1.5), 1.5) + Math.pow(Math.pow(S(_ * 40 + b), 1.5) + Math.pow(S(T * 40 + q), 1.5), 1.5) > Math.pow(Math.pow(F, 1.5), 1.5) * 1.3;
      };
      var l = m;
      const c = i[u], h = o[o.length - 1];
      m(h, c) ? (a = !0, o[o.length - 1] = o[o.length - 1].join(c)) : o.push(c);
    }
    i = o;
  } while (r++ < 10 && a);
  const s = [];
  return go(i, (o, u, c) => {
    let h = u;
    function m(v) {
      return v.length > 0 && v.trim().length <= 3 && u.seq1Range.length + u.seq2Range.length > 100;
    }
    const f = e.extendToFullLines(u.seq1Range), g = e.getText(new G(f.start, u.seq1Range.start));
    m(g) && (h = h.deltaStart(-g.length));
    const p = e.getText(new G(u.seq1Range.endExclusive, f.endExclusive));
    m(p) && (h = h.deltaEnd(p.length));
    const w = re.fromOffsetPairs(o ? o.getEndExclusives() : Ie.zero, c ? c.getStarts() : Ie.max), y = h.intersect(w);
    s.push(y);
  }), s;
}
class Rr {
  constructor(t, n) {
    this.trimmedHash = t, this.lines = n;
  }
  getElement(t) {
    return this.trimmedHash[t];
  }
  get length() {
    return this.trimmedHash.length;
  }
  getBoundaryScore(t) {
    const n = t === 0 ? 0 : Dr(this.lines[t - 1]), i = t === this.lines.length ? 0 : Dr(this.lines[t]);
    return 1e3 - (n + i);
  }
  getText(t) {
    return this.lines.slice(t.start, t.endExclusive).join(`
`);
  }
  isStronglyEqual(t, n) {
    return this.lines[t] === this.lines[n];
  }
}
function Dr(e) {
  let t = 0;
  for (; t < e.length && (e.charCodeAt(t) === 32 || e.charCodeAt(t) === 9); )
    t++;
  return t;
}
class vl {
  constructor() {
    this.dynamicProgrammingDiffing = new tl(), this.myersDiffingAlgorithm = new $a();
  }
  computeDiff(t, n, i) {
    if (t.length <= 1 && mo(t, n, (I, B) => I === B))
      return new Yt([], [], !1);
    if (t.length === 1 && t[0].length === 0 || n.length === 1 && n[0].length === 0)
      return new Yt([
        new We(new Q(1, t.length + 1), new Q(1, n.length + 1), [
          new Nt(new oe(1, 1, t.length, t[0].length + 1), new oe(1, 1, n.length, n[0].length + 1))
        ])
      ], [], !1);
    const r = i.maxComputationTimeMs === 0 ? It.instance : new el(i.maxComputationTimeMs), a = !i.ignoreTrimWhitespace, s = /* @__PURE__ */ new Map();
    function l(I) {
      let B = s.get(I);
      return B === void 0 && (B = s.size, s.set(I, B)), B;
    }
    const o = t.map((I) => l(I.trim())), u = n.map((I) => l(I.trim())), c = new Rr(o, t), h = new Rr(u, n), m = (() => c.length + h.length < 1700 ? this.dynamicProgrammingDiffing.compute(c, h, r, (I, B) => t[I] === n[B] ? n[B].length === 0 ? 0.1 : 1 + Math.log(1 + n[B].length) : 0.99) : this.myersDiffingAlgorithm.compute(c, h))();
    let f = m.diffs, g = m.hitTimeout;
    f = Er(c, h, f), f = gl(c, h, f);
    const p = [], w = (I) => {
      if (a)
        for (let B = 0; B < I; B++) {
          const _ = y + B, b = v + B;
          if (t[_] !== n[b]) {
            const T = this.refineDiff(t, n, new re(new G(_, _ + 1), new G(b, b + 1)), r, a);
            for (const q of T.mappings)
              p.push(q);
            T.hitTimeout && (g = !0);
          }
        }
    };
    let y = 0, v = 0;
    for (const I of f) {
      rn(() => I.seq1Range.start - y === I.seq2Range.start - v);
      const B = I.seq1Range.start - y;
      w(B), y = I.seq1Range.endExclusive, v = I.seq2Range.endExclusive;
      const _ = this.refineDiff(t, n, I, r, a);
      _.hitTimeout && (g = !0);
      for (const b of _.mappings)
        p.push(b);
    }
    w(t.length - y);
    const x = Nr(p, t, n);
    let E = [];
    return i.computeMoves && (E = this.computeMoves(x, t, n, o, u, r, a)), rn(() => {
      function I(_, b) {
        if (_.lineNumber < 1 || _.lineNumber > b.length)
          return !1;
        const T = b[_.lineNumber - 1];
        return !(_.column < 1 || _.column > T.length + 1);
      }
      function B(_, b) {
        return !(_.startLineNumber < 1 || _.startLineNumber > b.length + 1 || _.endLineNumberExclusive < 1 || _.endLineNumberExclusive > b.length + 1);
      }
      for (const _ of x) {
        if (!_.innerChanges)
          return !1;
        for (const b of _.innerChanges)
          if (!(I(b.modifiedRange.getStartPosition(), n) && I(b.modifiedRange.getEndPosition(), n) && I(b.originalRange.getStartPosition(), t) && I(b.originalRange.getEndPosition(), t)))
            return !1;
        if (!B(_.modified, n) || !B(_.original, t))
          return !1;
      }
      return !0;
    }), new Yt(x, E, g);
  }
  computeMoves(t, n, i, r, a, s, l) {
    return sl(t, n, i, r, a, s).map((c) => {
      const h = this.refineDiff(n, i, new re(c.original.toOffsetRange(), c.modified.toOffsetRange()), s, l), m = Nr(h.mappings, n, i, !0);
      return new $o(c, m);
    });
  }
  refineDiff(t, n, i, r, a) {
    const s = new an(t, i.seq1Range, a), l = new an(n, i.seq2Range, a), o = s.length + l.length < 500 ? this.dynamicProgrammingDiffing.compute(s, l, r) : this.myersDiffingAlgorithm.compute(s, l, r);
    let u = o.diffs;
    return u = Er(s, l, u), u = fl(s, l, u), u = ml(s, l, u), u = bl(s, l, u), {
      mappings: u.map((h) => new Nt(s.translateRange(h.seq1Range), l.translateRange(h.seq2Range))),
      hitTimeout: o.hitTimeout
    };
  }
}
function Nr(e, t, n, i = !1) {
  const r = [];
  for (const a of fo(e.map((s) => _l(s, t, n)), (s, l) => s.original.overlapOrTouch(l.original) || s.modified.overlapOrTouch(l.modified))) {
    const s = a[0], l = a[a.length - 1];
    r.push(new We(s.original.join(l.original), s.modified.join(l.modified), a.map((o) => o.innerChanges[0])));
  }
  return rn(() => !i && r.length > 0 && r[0].original.startLineNumber !== r[0].modified.startLineNumber ? !1 : ja(r, (a, s) => s.original.startLineNumber - a.original.endLineNumberExclusive === s.modified.startLineNumber - a.modified.endLineNumberExclusive && // There has to be an unchanged line in between (otherwise both diffs should have been joined)
  a.original.endLineNumberExclusive < s.original.startLineNumber && a.modified.endLineNumberExclusive < s.modified.startLineNumber)), r;
}
function _l(e, t, n) {
  let i = 0, r = 0;
  e.modifiedRange.endColumn === 1 && e.originalRange.endColumn === 1 && e.originalRange.startLineNumber + i <= e.originalRange.endLineNumber && e.modifiedRange.startLineNumber + i <= e.modifiedRange.endLineNumber && (r = -1), e.modifiedRange.startColumn - 1 >= n[e.modifiedRange.startLineNumber - 1].length && e.originalRange.startColumn - 1 >= t[e.originalRange.startLineNumber - 1].length && e.originalRange.startLineNumber <= e.originalRange.endLineNumber + r && e.modifiedRange.startLineNumber <= e.modifiedRange.endLineNumber + r && (i = 1);
  const a = new Q(e.originalRange.startLineNumber + i, e.originalRange.endLineNumber + 1 + r), s = new Q(e.modifiedRange.startLineNumber + i, e.modifiedRange.endLineNumber + 1 + r);
  return new We(a, s, [e]);
}
const Ir = {
  getLegacy: () => new Qo(),
  getDefault: () => new vl()
};
function Qe(e, t) {
  const n = Math.pow(10, t);
  return Math.round(e * n) / n;
}
class le {
  constructor(t, n, i, r = 1) {
    this._rgbaBrand = void 0, this.r = Math.min(255, Math.max(0, t)) | 0, this.g = Math.min(255, Math.max(0, n)) | 0, this.b = Math.min(255, Math.max(0, i)) | 0, this.a = Qe(Math.max(Math.min(1, r), 0), 3);
  }
  static equals(t, n) {
    return t.r === n.r && t.g === n.g && t.b === n.b && t.a === n.a;
  }
}
class xe {
  constructor(t, n, i, r) {
    this._hslaBrand = void 0, this.h = Math.max(Math.min(360, t), 0) | 0, this.s = Qe(Math.max(Math.min(1, n), 0), 3), this.l = Qe(Math.max(Math.min(1, i), 0), 3), this.a = Qe(Math.max(Math.min(1, r), 0), 3);
  }
  static equals(t, n) {
    return t.h === n.h && t.s === n.s && t.l === n.l && t.a === n.a;
  }
  /**
   * Converts an RGB color value to HSL. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes r, g, and b are contained in the set [0, 255] and
   * returns h in the set [0, 360], s, and l in the set [0, 1].
   */
  static fromRGBA(t) {
    const n = t.r / 255, i = t.g / 255, r = t.b / 255, a = t.a, s = Math.max(n, i, r), l = Math.min(n, i, r);
    let o = 0, u = 0;
    const c = (l + s) / 2, h = s - l;
    if (h > 0) {
      switch (u = Math.min(c <= 0.5 ? h / (2 * c) : h / (2 - 2 * c), 1), s) {
        case n:
          o = (i - r) / h + (i < r ? 6 : 0);
          break;
        case i:
          o = (r - n) / h + 2;
          break;
        case r:
          o = (n - i) / h + 4;
          break;
      }
      o *= 60, o = Math.round(o);
    }
    return new xe(o, u, c, a);
  }
  static _hue2rgb(t, n, i) {
    return i < 0 && (i += 1), i > 1 && (i -= 1), i < 1 / 6 ? t + (n - t) * 6 * i : i < 1 / 2 ? n : i < 2 / 3 ? t + (n - t) * (2 / 3 - i) * 6 : t;
  }
  /**
   * Converts an HSL color value to RGB. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes h in the set [0, 360] s, and l are contained in the set [0, 1] and
   * returns r, g, and b in the set [0, 255].
   */
  static toRGBA(t) {
    const n = t.h / 360, { s: i, l: r, a } = t;
    let s, l, o;
    if (i === 0)
      s = l = o = r;
    else {
      const u = r < 0.5 ? r * (1 + i) : r + i - r * i, c = 2 * r - u;
      s = xe._hue2rgb(c, u, n + 1 / 3), l = xe._hue2rgb(c, u, n), o = xe._hue2rgb(c, u, n - 1 / 3);
    }
    return new le(Math.round(s * 255), Math.round(l * 255), Math.round(o * 255), a);
  }
}
class ht {
  constructor(t, n, i, r) {
    this._hsvaBrand = void 0, this.h = Math.max(Math.min(360, t), 0) | 0, this.s = Qe(Math.max(Math.min(1, n), 0), 3), this.v = Qe(Math.max(Math.min(1, i), 0), 3), this.a = Qe(Math.max(Math.min(1, r), 0), 3);
  }
  static equals(t, n) {
    return t.h === n.h && t.s === n.s && t.v === n.v && t.a === n.a;
  }
  // from http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
  static fromRGBA(t) {
    const n = t.r / 255, i = t.g / 255, r = t.b / 255, a = Math.max(n, i, r), s = Math.min(n, i, r), l = a - s, o = a === 0 ? 0 : l / a;
    let u;
    return l === 0 ? u = 0 : a === n ? u = ((i - r) / l % 6 + 6) % 6 : a === i ? u = (r - n) / l + 2 : u = (n - i) / l + 4, new ht(Math.round(u * 60), o, a, t.a);
  }
  // from http://www.rapidtables.com/convert/color/hsv-to-rgb.htm
  static toRGBA(t) {
    const { h: n, s: i, v: r, a } = t, s = r * i, l = s * (1 - Math.abs(n / 60 % 2 - 1)), o = r - s;
    let [u, c, h] = [0, 0, 0];
    return n < 60 ? (u = s, c = l) : n < 120 ? (u = l, c = s) : n < 180 ? (c = s, h = l) : n < 240 ? (c = l, h = s) : n < 300 ? (u = l, h = s) : n <= 360 && (u = s, h = l), u = Math.round((u + o) * 255), c = Math.round((c + o) * 255), h = Math.round((h + o) * 255), new le(u, c, h, a);
  }
}
let se = class Te {
  static fromHex(t) {
    return Te.Format.CSS.parseHex(t) || Te.red;
  }
  static equals(t, n) {
    return !t && !n ? !0 : !t || !n ? !1 : t.equals(n);
  }
  get hsla() {
    return this._hsla ? this._hsla : xe.fromRGBA(this.rgba);
  }
  get hsva() {
    return this._hsva ? this._hsva : ht.fromRGBA(this.rgba);
  }
  constructor(t) {
    if (t)
      if (t instanceof le)
        this.rgba = t;
      else if (t instanceof xe)
        this._hsla = t, this.rgba = xe.toRGBA(t);
      else if (t instanceof ht)
        this._hsva = t, this.rgba = ht.toRGBA(t);
      else
        throw new Error("Invalid color ctor argument");
    else
      throw new Error("Color needs a value");
  }
  equals(t) {
    return !!t && le.equals(this.rgba, t.rgba) && xe.equals(this.hsla, t.hsla) && ht.equals(this.hsva, t.hsva);
  }
  /**
   * http://www.w3.org/TR/WCAG20/#relativeluminancedef
   * Returns the number in the set [0, 1]. O => Darkest Black. 1 => Lightest white.
   */
  getRelativeLuminance() {
    const t = Te._relativeLuminanceForComponent(this.rgba.r), n = Te._relativeLuminanceForComponent(this.rgba.g), i = Te._relativeLuminanceForComponent(this.rgba.b), r = 0.2126 * t + 0.7152 * n + 0.0722 * i;
    return Qe(r, 4);
  }
  static _relativeLuminanceForComponent(t) {
    const n = t / 255;
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
  }
  /**
   *	http://24ways.org/2010/calculating-color-contrast
   *  Return 'true' if lighter color otherwise 'false'
   */
  isLighter() {
    return (this.rgba.r * 299 + this.rgba.g * 587 + this.rgba.b * 114) / 1e3 >= 128;
  }
  isLighterThan(t) {
    const n = this.getRelativeLuminance(), i = t.getRelativeLuminance();
    return n > i;
  }
  isDarkerThan(t) {
    const n = this.getRelativeLuminance(), i = t.getRelativeLuminance();
    return n < i;
  }
  lighten(t) {
    return new Te(new xe(this.hsla.h, this.hsla.s, this.hsla.l + this.hsla.l * t, this.hsla.a));
  }
  darken(t) {
    return new Te(new xe(this.hsla.h, this.hsla.s, this.hsla.l - this.hsla.l * t, this.hsla.a));
  }
  transparent(t) {
    const { r: n, g: i, b: r, a } = this.rgba;
    return new Te(new le(n, i, r, a * t));
  }
  isTransparent() {
    return this.rgba.a === 0;
  }
  isOpaque() {
    return this.rgba.a === 1;
  }
  opposite() {
    return new Te(new le(255 - this.rgba.r, 255 - this.rgba.g, 255 - this.rgba.b, this.rgba.a));
  }
  makeOpaque(t) {
    if (this.isOpaque() || t.rgba.a !== 1)
      return this;
    const { r: n, g: i, b: r, a } = this.rgba;
    return new Te(new le(t.rgba.r - a * (t.rgba.r - n), t.rgba.g - a * (t.rgba.g - i), t.rgba.b - a * (t.rgba.b - r), 1));
  }
  toString() {
    return this._toString || (this._toString = Te.Format.CSS.format(this)), this._toString;
  }
  static getLighterColor(t, n, i) {
    if (t.isLighterThan(n))
      return t;
    i = i || 0.5;
    const r = t.getRelativeLuminance(), a = n.getRelativeLuminance();
    return i = i * (a - r) / a, t.lighten(i);
  }
  static getDarkerColor(t, n, i) {
    if (t.isDarkerThan(n))
      return t;
    i = i || 0.5;
    const r = t.getRelativeLuminance(), a = n.getRelativeLuminance();
    return i = i * (r - a) / r, t.darken(i);
  }
};
se.white = new se(new le(255, 255, 255, 1));
se.black = new se(new le(0, 0, 0, 1));
se.red = new se(new le(255, 0, 0, 1));
se.blue = new se(new le(0, 0, 255, 1));
se.green = new se(new le(0, 255, 0, 1));
se.cyan = new se(new le(0, 255, 255, 1));
se.lightgrey = new se(new le(211, 211, 211, 1));
se.transparent = new se(new le(0, 0, 0, 0));
(function(e) {
  (function(t) {
    (function(n) {
      function i(f) {
        return f.rgba.a === 1 ? `rgb(${f.rgba.r}, ${f.rgba.g}, ${f.rgba.b})` : e.Format.CSS.formatRGBA(f);
      }
      n.formatRGB = i;
      function r(f) {
        return `rgba(${f.rgba.r}, ${f.rgba.g}, ${f.rgba.b}, ${+f.rgba.a.toFixed(2)})`;
      }
      n.formatRGBA = r;
      function a(f) {
        return f.hsla.a === 1 ? `hsl(${f.hsla.h}, ${(f.hsla.s * 100).toFixed(2)}%, ${(f.hsla.l * 100).toFixed(2)}%)` : e.Format.CSS.formatHSLA(f);
      }
      n.formatHSL = a;
      function s(f) {
        return `hsla(${f.hsla.h}, ${(f.hsla.s * 100).toFixed(2)}%, ${(f.hsla.l * 100).toFixed(2)}%, ${f.hsla.a.toFixed(2)})`;
      }
      n.formatHSLA = s;
      function l(f) {
        const g = f.toString(16);
        return g.length !== 2 ? "0" + g : g;
      }
      function o(f) {
        return `#${l(f.rgba.r)}${l(f.rgba.g)}${l(f.rgba.b)}`;
      }
      n.formatHex = o;
      function u(f, g = !1) {
        return g && f.rgba.a === 1 ? e.Format.CSS.formatHex(f) : `#${l(f.rgba.r)}${l(f.rgba.g)}${l(f.rgba.b)}${l(Math.round(f.rgba.a * 255))}`;
      }
      n.formatHexA = u;
      function c(f) {
        return f.isOpaque() ? e.Format.CSS.formatHex(f) : e.Format.CSS.formatRGBA(f);
      }
      n.format = c;
      function h(f) {
        const g = f.length;
        if (g === 0 || f.charCodeAt(0) !== 35)
          return null;
        if (g === 7) {
          const p = 16 * m(f.charCodeAt(1)) + m(f.charCodeAt(2)), w = 16 * m(f.charCodeAt(3)) + m(f.charCodeAt(4)), y = 16 * m(f.charCodeAt(5)) + m(f.charCodeAt(6));
          return new e(new le(p, w, y, 1));
        }
        if (g === 9) {
          const p = 16 * m(f.charCodeAt(1)) + m(f.charCodeAt(2)), w = 16 * m(f.charCodeAt(3)) + m(f.charCodeAt(4)), y = 16 * m(f.charCodeAt(5)) + m(f.charCodeAt(6)), v = 16 * m(f.charCodeAt(7)) + m(f.charCodeAt(8));
          return new e(new le(p, w, y, v / 255));
        }
        if (g === 4) {
          const p = m(f.charCodeAt(1)), w = m(f.charCodeAt(2)), y = m(f.charCodeAt(3));
          return new e(new le(16 * p + p, 16 * w + w, 16 * y + y));
        }
        if (g === 5) {
          const p = m(f.charCodeAt(1)), w = m(f.charCodeAt(2)), y = m(f.charCodeAt(3)), v = m(f.charCodeAt(4));
          return new e(new le(16 * p + p, 16 * w + w, 16 * y + y, (16 * v + v) / 255));
        }
        return null;
      }
      n.parseHex = h;
      function m(f) {
        switch (f) {
          case 48:
            return 0;
          case 49:
            return 1;
          case 50:
            return 2;
          case 51:
            return 3;
          case 52:
            return 4;
          case 53:
            return 5;
          case 54:
            return 6;
          case 55:
            return 7;
          case 56:
            return 8;
          case 57:
            return 9;
          case 97:
            return 10;
          case 65:
            return 10;
          case 98:
            return 11;
          case 66:
            return 11;
          case 99:
            return 12;
          case 67:
            return 12;
          case 100:
            return 13;
          case 68:
            return 13;
          case 101:
            return 14;
          case 69:
            return 14;
          case 102:
            return 15;
          case 70:
            return 15;
        }
        return 0;
      }
    })(t.CSS || (t.CSS = {}));
  })(e.Format || (e.Format = {}));
})(se || (se = {}));
function Xa(e) {
  const t = [];
  for (const n of e) {
    const i = Number(n);
    (i || i === 0 && n.replace(/\s/g, "") !== "") && t.push(i);
  }
  return t;
}
function di(e, t, n, i) {
  return {
    red: e / 255,
    blue: n / 255,
    green: t / 255,
    alpha: i
  };
}
function Tt(e, t) {
  const n = t.index, i = t[0].length;
  if (!n)
    return;
  const r = e.positionAt(n);
  return {
    startLineNumber: r.lineNumber,
    startColumn: r.column,
    endLineNumber: r.lineNumber,
    endColumn: r.column + i
  };
}
function wl(e, t) {
  if (!e)
    return;
  const n = se.Format.CSS.parseHex(t);
  if (n)
    return {
      range: e,
      color: di(n.rgba.r, n.rgba.g, n.rgba.b, n.rgba.a)
    };
}
function zr(e, t, n) {
  if (!e || t.length !== 1)
    return;
  const r = t[0].values(), a = Xa(r);
  return {
    range: e,
    color: di(a[0], a[1], a[2], n ? a[3] : 1)
  };
}
function Ur(e, t, n) {
  if (!e || t.length !== 1)
    return;
  const r = t[0].values(), a = Xa(r), s = new se(new xe(a[0], a[1] / 100, a[2] / 100, n ? a[3] : 1));
  return {
    range: e,
    color: di(s.rgba.r, s.rgba.g, s.rgba.b, s.rgba.a)
  };
}
function xt(e, t) {
  return typeof e == "string" ? [...e.matchAll(t)] : e.findMatches(t);
}
function yl(e) {
  const t = [], i = xt(e, /\b(rgb|rgba|hsl|hsla)(\([0-9\s,.\%]*\))|(#)([A-Fa-f0-9]{3})\b|(#)([A-Fa-f0-9]{4})\b|(#)([A-Fa-f0-9]{6})\b|(#)([A-Fa-f0-9]{8})\b/gm);
  if (i.length > 0)
    for (const r of i) {
      const a = r.filter((u) => u !== void 0), s = a[1], l = a[2];
      if (!l)
        continue;
      let o;
      if (s === "rgb") {
        const u = /^\(\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*\)$/gm;
        o = zr(Tt(e, r), xt(l, u), !1);
      } else if (s === "rgba") {
        const u = /^\(\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\s*,\s*(0[.][0-9]+|[.][0-9]+|[01][.]|[01])\s*\)$/gm;
        o = zr(Tt(e, r), xt(l, u), !0);
      } else if (s === "hsl") {
        const u = /^\(\s*(36[0]|3[0-5][0-9]|[12][0-9][0-9]|[1-9]?[0-9])\s*,\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*,\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*\)$/gm;
        o = Ur(Tt(e, r), xt(l, u), !1);
      } else if (s === "hsla") {
        const u = /^\(\s*(36[0]|3[0-5][0-9]|[12][0-9][0-9]|[1-9]?[0-9])\s*,\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*,\s*(100|\d{1,2}[.]\d*|\d{1,2})%\s*,\s*(0[.][0-9]+|[.][0-9]+|[01][.]|[01])\s*\)$/gm;
        o = Ur(Tt(e, r), xt(l, u), !0);
      } else
        s === "#" && (o = wl(Tt(e, r), s + l));
      o && t.push(o);
    }
  return t;
}
function Tl(e) {
  return !e || typeof e.getValue != "function" || typeof e.positionAt != "function" ? [] : yl(e);
}
var qe = globalThis && globalThis.__awaiter || function(e, t, n, i) {
  function r(a) {
    return a instanceof n ? a : new n(function(s) {
      s(a);
    });
  }
  return new (n || (n = Promise))(function(a, s) {
    function l(c) {
      try {
        u(i.next(c));
      } catch (h) {
        s(h);
      }
    }
    function o(c) {
      try {
        u(i.throw(c));
      } catch (h) {
        s(h);
      }
    }
    function u(c) {
      c.done ? a(c.value) : r(c.value).then(l, o);
    }
    u((i = i.apply(e, t || [])).next());
  });
};
class xl extends yo {
  get uri() {
    return this._uri;
  }
  get eol() {
    return this._eol;
  }
  getValue() {
    return this.getText();
  }
  findMatches(t) {
    const n = [];
    for (let i = 0; i < this._lines.length; i++) {
      const r = this._lines[i], a = this.offsetAt(new Ue(i + 1, 1)), s = r.matchAll(t);
      for (const l of s)
        (l.index || l.index === 0) && (l.index = l.index + a), n.push(l);
    }
    return n;
  }
  getLinesContent() {
    return this._lines.slice(0);
  }
  getLineCount() {
    return this._lines.length;
  }
  getLineContent(t) {
    return this._lines[t - 1];
  }
  getWordAtPosition(t, n) {
    const i = ui(t.column, ko(n), this._lines[t.lineNumber - 1], 0);
    return i ? new oe(t.lineNumber, i.startColumn, t.lineNumber, i.endColumn) : null;
  }
  words(t) {
    const n = this._lines, i = this._wordenize.bind(this);
    let r = 0, a = "", s = 0, l = [];
    return {
      *[Symbol.iterator]() {
        for (; ; )
          if (s < l.length) {
            const o = a.substring(l[s].start, l[s].end);
            s += 1, yield o;
          } else if (r < n.length)
            a = n[r], l = i(a, t), s = 0, r += 1;
          else
            break;
      }
    };
  }
  getLineWords(t, n) {
    const i = this._lines[t - 1], r = this._wordenize(i, n), a = [];
    for (const s of r)
      a.push({
        word: i.substring(s.start, s.end),
        startColumn: s.start + 1,
        endColumn: s.end + 1
      });
    return a;
  }
  _wordenize(t, n) {
    const i = [];
    let r;
    for (n.lastIndex = 0; (r = n.exec(t)) && r[0].length !== 0; )
      i.push({ start: r.index, end: r.index + r[0].length });
    return i;
  }
  getValueInRange(t) {
    if (t = this._validateRange(t), t.startLineNumber === t.endLineNumber)
      return this._lines[t.startLineNumber - 1].substring(t.startColumn - 1, t.endColumn - 1);
    const n = this._eol, i = t.startLineNumber - 1, r = t.endLineNumber - 1, a = [];
    a.push(this._lines[i].substring(t.startColumn - 1));
    for (let s = i + 1; s < r; s++)
      a.push(this._lines[s]);
    return a.push(this._lines[r].substring(0, t.endColumn - 1)), a.join(n);
  }
  offsetAt(t) {
    return t = this._validatePosition(t), this._ensureLineStarts(), this._lineStarts.getPrefixSum(t.lineNumber - 2) + (t.column - 1);
  }
  positionAt(t) {
    t = Math.floor(t), t = Math.max(0, t), this._ensureLineStarts();
    const n = this._lineStarts.getIndexOf(t), i = this._lines[n.index].length;
    return {
      lineNumber: 1 + n.index,
      column: 1 + Math.min(n.remainder, i)
    };
  }
  _validateRange(t) {
    const n = this._validatePosition({ lineNumber: t.startLineNumber, column: t.startColumn }), i = this._validatePosition({ lineNumber: t.endLineNumber, column: t.endColumn });
    return n.lineNumber !== t.startLineNumber || n.column !== t.startColumn || i.lineNumber !== t.endLineNumber || i.column !== t.endColumn ? {
      startLineNumber: n.lineNumber,
      startColumn: n.column,
      endLineNumber: i.lineNumber,
      endColumn: i.column
    } : t;
  }
  _validatePosition(t) {
    if (!Ue.isIPosition(t))
      throw new Error("bad position");
    let { lineNumber: n, column: i } = t, r = !1;
    if (n < 1)
      n = 1, i = 1, r = !0;
    else if (n > this._lines.length)
      n = this._lines.length, i = this._lines[n - 1].length + 1, r = !0;
    else {
      const a = this._lines[n - 1].length + 1;
      i < 1 ? (i = 1, r = !0) : i > a && (i = a, r = !0);
    }
    return r ? { lineNumber: n, column: i } : t;
  }
}
class it {
  constructor(t, n) {
    this._host = t, this._models = /* @__PURE__ */ Object.create(null), this._foreignModuleFactory = n, this._foreignModule = null;
  }
  dispose() {
    this._models = /* @__PURE__ */ Object.create(null);
  }
  _getModel(t) {
    return this._models[t];
  }
  _getModels() {
    const t = [];
    return Object.keys(this._models).forEach((n) => t.push(this._models[n])), t;
  }
  acceptNewModel(t) {
    this._models[t.url] = new xl(li.parse(t.url), t.lines, t.EOL, t.versionId);
  }
  acceptModelChanged(t, n) {
    if (!this._models[t])
      return;
    this._models[t].onEvents(n);
  }
  acceptRemovedModel(t) {
    this._models[t] && delete this._models[t];
  }
  computeUnicodeHighlights(t, n, i) {
    return qe(this, void 0, void 0, function* () {
      const r = this._getModel(t);
      return r ? jo.computeUnicodeHighlights(r, n, i) : { ranges: [], hasMore: !1, ambiguousCharacterCount: 0, invisibleCharacterCount: 0, nonBasicAsciiCharacterCount: 0 };
    });
  }
  // ---- BEGIN diff --------------------------------------------------------------------------
  computeDiff(t, n, i, r) {
    return qe(this, void 0, void 0, function* () {
      const a = this._getModel(t), s = this._getModel(n);
      return !a || !s ? null : it.computeDiff(a, s, i, r);
    });
  }
  static computeDiff(t, n, i, r) {
    const a = r === "advanced" ? Ir.getDefault() : Ir.getLegacy(), s = t.getLinesContent(), l = n.getLinesContent(), o = a.computeDiff(s, l, i), u = o.changes.length > 0 ? !1 : this._modelsAreIdentical(t, n);
    function c(h) {
      return h.map((m) => {
        var f;
        return [m.original.startLineNumber, m.original.endLineNumberExclusive, m.modified.startLineNumber, m.modified.endLineNumberExclusive, (f = m.innerChanges) === null || f === void 0 ? void 0 : f.map((g) => [
          g.originalRange.startLineNumber,
          g.originalRange.startColumn,
          g.originalRange.endLineNumber,
          g.originalRange.endColumn,
          g.modifiedRange.startLineNumber,
          g.modifiedRange.startColumn,
          g.modifiedRange.endLineNumber,
          g.modifiedRange.endColumn
        ])];
      });
    }
    return {
      identical: u,
      quitEarly: o.hitTimeout,
      changes: c(o.changes),
      moves: o.moves.map((h) => [
        h.lineRangeMapping.original.startLineNumber,
        h.lineRangeMapping.original.endLineNumberExclusive,
        h.lineRangeMapping.modified.startLineNumber,
        h.lineRangeMapping.modified.endLineNumberExclusive,
        c(h.changes)
      ])
    };
  }
  static _modelsAreIdentical(t, n) {
    const i = t.getLineCount(), r = n.getLineCount();
    if (i !== r)
      return !1;
    for (let a = 1; a <= i; a++) {
      const s = t.getLineContent(a), l = n.getLineContent(a);
      if (s !== l)
        return !1;
    }
    return !0;
  }
  computeMoreMinimalEdits(t, n, i) {
    return qe(this, void 0, void 0, function* () {
      const r = this._getModel(t);
      if (!r)
        return n;
      const a = [];
      let s;
      n = n.slice(0).sort((o, u) => {
        if (o.range && u.range)
          return oe.compareRangesUsingStarts(o.range, u.range);
        const c = o.range ? 0 : 1, h = u.range ? 0 : 1;
        return c - h;
      });
      let l = 0;
      for (let o = 1; o < n.length; o++)
        oe.getEndPosition(n[l].range).equals(oe.getStartPosition(n[o].range)) ? (n[l].range = oe.fromPositions(oe.getStartPosition(n[l].range), oe.getEndPosition(n[o].range)), n[l].text += n[o].text) : (l++, n[l] = n[o]);
      n.length = l + 1;
      for (let { range: o, text: u, eol: c } of n) {
        if (typeof c == "number" && (s = c), oe.isEmpty(o) && !u)
          continue;
        const h = r.getValueInRange(o);
        if (u = u.replace(/\r\n|\n|\r/g, r.eol), h === u)
          continue;
        if (Math.max(u.length, h.length) > it._diffLimit) {
          a.push({ range: o, text: u });
          continue;
        }
        const m = Xs(h, u, i), f = r.offsetAt(oe.lift(o).getStartPosition());
        for (const g of m) {
          const p = r.positionAt(f + g.originalStart), w = r.positionAt(f + g.originalStart + g.originalLength), y = {
            text: u.substr(g.modifiedStart, g.modifiedLength),
            range: { startLineNumber: p.lineNumber, startColumn: p.column, endLineNumber: w.lineNumber, endColumn: w.column }
          };
          r.getValueInRange(y.range) !== y.text && a.push(y);
        }
      }
      return typeof s == "number" && a.push({ eol: s, text: "", range: { startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0 } }), a;
    });
  }
  // ---- END minimal edits ---------------------------------------------------------------
  computeLinks(t) {
    return qe(this, void 0, void 0, function* () {
      const n = this._getModel(t);
      return n ? Mo(n) : null;
    });
  }
  // --- BEGIN default document colors -----------------------------------------------------------
  computeDefaultDocumentColors(t) {
    return qe(this, void 0, void 0, function* () {
      const n = this._getModel(t);
      return n ? Tl(n) : null;
    });
  }
  textualSuggest(t, n, i, r) {
    return qe(this, void 0, void 0, function* () {
      const a = new _n(), s = new RegExp(i, r), l = /* @__PURE__ */ new Set();
      e:
        for (const o of t) {
          const u = this._getModel(o);
          if (u) {
            for (const c of u.words(s))
              if (!(c === n || !isNaN(Number(c))) && (l.add(c), l.size > it._suggestionsLimit))
                break e;
          }
        }
      return { words: Array.from(l), duration: a.elapsed() };
    });
  }
  // ---- END suggest --------------------------------------------------------------------------
  //#region -- word ranges --
  computeWordRanges(t, n, i, r) {
    return qe(this, void 0, void 0, function* () {
      const a = this._getModel(t);
      if (!a)
        return /* @__PURE__ */ Object.create(null);
      const s = new RegExp(i, r), l = /* @__PURE__ */ Object.create(null);
      for (let o = n.startLineNumber; o < n.endLineNumber; o++) {
        const u = a.getLineWords(o, s);
        for (const c of u) {
          if (!isNaN(Number(c.word)))
            continue;
          let h = l[c.word];
          h || (h = [], l[c.word] = h), h.push({
            startLineNumber: o,
            startColumn: c.startColumn,
            endLineNumber: o,
            endColumn: c.endColumn
          });
        }
      }
      return l;
    });
  }
  //#endregion
  navigateValueSet(t, n, i, r, a) {
    return qe(this, void 0, void 0, function* () {
      const s = this._getModel(t);
      if (!s)
        return null;
      const l = new RegExp(r, a);
      n.startColumn === n.endColumn && (n = {
        startLineNumber: n.startLineNumber,
        startColumn: n.startColumn,
        endLineNumber: n.endLineNumber,
        endColumn: n.endColumn + 1
      });
      const o = s.getValueInRange(n), u = s.getWordAtPosition({ lineNumber: n.startLineNumber, column: n.startColumn }, l);
      if (!u)
        return null;
      const c = s.getValueInRange(u);
      return Fn.INSTANCE.navigateValueSet(n, o, u, c, i);
    });
  }
  // ---- BEGIN foreign module support --------------------------------------------------------------------------
  loadForeignModule(t, n, i) {
    const s = {
      host: ws(i, (l, o) => this._host.fhr(l, o)),
      getMirrorModels: () => this._getModels()
    };
    return this._foreignModuleFactory ? (this._foreignModule = this._foreignModuleFactory(s, n), Promise.resolve(Dn(this._foreignModule))) : Promise.reject(new Error("Unexpected usage"));
  }
  // foreign method request
  fmr(t, n) {
    if (!this._foreignModule || typeof this._foreignModule[t] != "function")
      return Promise.reject(new Error("Missing requestHandler or method: " + t));
    try {
      return Promise.resolve(this._foreignModule[t].apply(this._foreignModule, n));
    } catch (i) {
      return Promise.reject(i);
    }
  }
}
it._diffLimit = 1e5;
it._suggestionsLimit = 1e4;
typeof importScripts == "function" && (globalThis.monaco = Fo());
let Yn = !1;
function Ja(e) {
  if (Yn)
    return;
  Yn = !0;
  const t = new Gs((n) => {
    globalThis.postMessage(n);
  }, (n) => new it(n, e));
  globalThis.onmessage = (n) => {
    t.onmessage(n.data);
  };
}
globalThis.onmessage = (e) => {
  Yn || Ja(null);
};
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.44.0(3e047efd345ff102c8c61b5398fb30845aaac166)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
function kl(e, t) {
  let n;
  return t.length === 0 ? n = e : n = e.replace(/\{(\d+)\}/g, (i, r) => {
    let a = r[0];
    return typeof t[a] < "u" ? t[a] : i;
  }), n;
}
function Al(e, t, ...n) {
  return kl(t, n);
}
function mi(e) {
  return Al;
}
var Hr;
(function(e) {
  e.MIN_VALUE = -2147483648, e.MAX_VALUE = 2147483647;
})(Hr || (Hr = {}));
var sn;
(function(e) {
  e.MIN_VALUE = 0, e.MAX_VALUE = 2147483647;
})(sn || (sn = {}));
var ce;
(function(e) {
  function t(i, r) {
    return i === Number.MAX_VALUE && (i = sn.MAX_VALUE), r === Number.MAX_VALUE && (r = sn.MAX_VALUE), { line: i, character: r };
  }
  e.create = t;
  function n(i) {
    var r = i;
    return C.objectLiteral(r) && C.uinteger(r.line) && C.uinteger(r.character);
  }
  e.is = n;
})(ce || (ce = {}));
var Y;
(function(e) {
  function t(i, r, a, s) {
    if (C.uinteger(i) && C.uinteger(r) && C.uinteger(a) && C.uinteger(s))
      return { start: ce.create(i, r), end: ce.create(a, s) };
    if (ce.is(i) && ce.is(r))
      return { start: i, end: r };
    throw new Error("Range#create called with invalid arguments[" + i + ", " + r + ", " + a + ", " + s + "]");
  }
  e.create = t;
  function n(i) {
    var r = i;
    return C.objectLiteral(r) && ce.is(r.start) && ce.is(r.end);
  }
  e.is = n;
})(Y || (Y = {}));
var on;
(function(e) {
  function t(i, r) {
    return { uri: i, range: r };
  }
  e.create = t;
  function n(i) {
    var r = i;
    return C.defined(r) && Y.is(r.range) && (C.string(r.uri) || C.undefined(r.uri));
  }
  e.is = n;
})(on || (on = {}));
var Wr;
(function(e) {
  function t(i, r, a, s) {
    return { targetUri: i, targetRange: r, targetSelectionRange: a, originSelectionRange: s };
  }
  e.create = t;
  function n(i) {
    var r = i;
    return C.defined(r) && Y.is(r.targetRange) && C.string(r.targetUri) && (Y.is(r.targetSelectionRange) || C.undefined(r.targetSelectionRange)) && (Y.is(r.originSelectionRange) || C.undefined(r.originSelectionRange));
  }
  e.is = n;
})(Wr || (Wr = {}));
var Zn;
(function(e) {
  function t(i, r, a, s) {
    return {
      red: i,
      green: r,
      blue: a,
      alpha: s
    };
  }
  e.create = t;
  function n(i) {
    var r = i;
    return C.numberRange(r.red, 0, 1) && C.numberRange(r.green, 0, 1) && C.numberRange(r.blue, 0, 1) && C.numberRange(r.alpha, 0, 1);
  }
  e.is = n;
})(Zn || (Zn = {}));
var Fr;
(function(e) {
  function t(i, r) {
    return {
      range: i,
      color: r
    };
  }
  e.create = t;
  function n(i) {
    var r = i;
    return Y.is(r.range) && Zn.is(r.color);
  }
  e.is = n;
})(Fr || (Fr = {}));
var Br;
(function(e) {
  function t(i, r, a) {
    return {
      label: i,
      textEdit: r,
      additionalTextEdits: a
    };
  }
  e.create = t;
  function n(i) {
    var r = i;
    return C.string(r.label) && (C.undefined(r.textEdit) || ae.is(r)) && (C.undefined(r.additionalTextEdits) || C.typedArray(r.additionalTextEdits, ae.is));
  }
  e.is = n;
})(Br || (Br = {}));
var ln;
(function(e) {
  e.Comment = "comment", e.Imports = "imports", e.Region = "region";
})(ln || (ln = {}));
var Pr;
(function(e) {
  function t(i, r, a, s, l) {
    var o = {
      startLine: i,
      endLine: r
    };
    return C.defined(a) && (o.startCharacter = a), C.defined(s) && (o.endCharacter = s), C.defined(l) && (o.kind = l), o;
  }
  e.create = t;
  function n(i) {
    var r = i;
    return C.uinteger(r.startLine) && C.uinteger(r.startLine) && (C.undefined(r.startCharacter) || C.uinteger(r.startCharacter)) && (C.undefined(r.endCharacter) || C.uinteger(r.endCharacter)) && (C.undefined(r.kind) || C.string(r.kind));
  }
  e.is = n;
})(Pr || (Pr = {}));
var Kn;
(function(e) {
  function t(i, r) {
    return {
      location: i,
      message: r
    };
  }
  e.create = t;
  function n(i) {
    var r = i;
    return C.defined(r) && on.is(r.location) && C.string(r.message);
  }
  e.is = n;
})(Kn || (Kn = {}));
var qr;
(function(e) {
  e.Error = 1, e.Warning = 2, e.Information = 3, e.Hint = 4;
})(qr || (qr = {}));
var Or;
(function(e) {
  e.Unnecessary = 1, e.Deprecated = 2;
})(Or || (Or = {}));
var Vr;
(function(e) {
  function t(n) {
    var i = n;
    return i != null && C.string(i.href);
  }
  e.is = t;
})(Vr || (Vr = {}));
var un;
(function(e) {
  function t(i, r, a, s, l, o) {
    var u = { range: i, message: r };
    return C.defined(a) && (u.severity = a), C.defined(s) && (u.code = s), C.defined(l) && (u.source = l), C.defined(o) && (u.relatedInformation = o), u;
  }
  e.create = t;
  function n(i) {
    var r, a = i;
    return C.defined(a) && Y.is(a.range) && C.string(a.message) && (C.number(a.severity) || C.undefined(a.severity)) && (C.integer(a.code) || C.string(a.code) || C.undefined(a.code)) && (C.undefined(a.codeDescription) || C.string((r = a.codeDescription) === null || r === void 0 ? void 0 : r.href)) && (C.string(a.source) || C.undefined(a.source)) && (C.undefined(a.relatedInformation) || C.typedArray(a.relatedInformation, Kn.is));
  }
  e.is = n;
})(un || (un = {}));
var zt;
(function(e) {
  function t(i, r) {
    for (var a = [], s = 2; s < arguments.length; s++)
      a[s - 2] = arguments[s];
    var l = { title: i, command: r };
    return C.defined(a) && a.length > 0 && (l.arguments = a), l;
  }
  e.create = t;
  function n(i) {
    var r = i;
    return C.defined(r) && C.string(r.title) && C.string(r.command);
  }
  e.is = n;
})(zt || (zt = {}));
var ae;
(function(e) {
  function t(a, s) {
    return { range: a, newText: s };
  }
  e.replace = t;
  function n(a, s) {
    return { range: { start: a, end: a }, newText: s };
  }
  e.insert = n;
  function i(a) {
    return { range: a, newText: "" };
  }
  e.del = i;
  function r(a) {
    var s = a;
    return C.objectLiteral(s) && C.string(s.newText) && Y.is(s.range);
  }
  e.is = r;
})(ae || (ae = {}));
var ft;
(function(e) {
  function t(i, r, a) {
    var s = { label: i };
    return r !== void 0 && (s.needsConfirmation = r), a !== void 0 && (s.description = a), s;
  }
  e.create = t;
  function n(i) {
    var r = i;
    return r !== void 0 && C.objectLiteral(r) && C.string(r.label) && (C.boolean(r.needsConfirmation) || r.needsConfirmation === void 0) && (C.string(r.description) || r.description === void 0);
  }
  e.is = n;
})(ft || (ft = {}));
var de;
(function(e) {
  function t(n) {
    var i = n;
    return typeof i == "string";
  }
  e.is = t;
})(de || (de = {}));
var je;
(function(e) {
  function t(a, s, l) {
    return { range: a, newText: s, annotationId: l };
  }
  e.replace = t;
  function n(a, s, l) {
    return { range: { start: a, end: a }, newText: s, annotationId: l };
  }
  e.insert = n;
  function i(a, s) {
    return { range: a, newText: "", annotationId: s };
  }
  e.del = i;
  function r(a) {
    var s = a;
    return ae.is(s) && (ft.is(s.annotationId) || de.is(s.annotationId));
  }
  e.is = r;
})(je || (je = {}));
var cn;
(function(e) {
  function t(i, r) {
    return { textDocument: i, edits: r };
  }
  e.create = t;
  function n(i) {
    var r = i;
    return C.defined(r) && hn.is(r.textDocument) && Array.isArray(r.edits);
  }
  e.is = n;
})(cn || (cn = {}));
var Ut;
(function(e) {
  function t(i, r, a) {
    var s = {
      kind: "create",
      uri: i
    };
    return r !== void 0 && (r.overwrite !== void 0 || r.ignoreIfExists !== void 0) && (s.options = r), a !== void 0 && (s.annotationId = a), s;
  }
  e.create = t;
  function n(i) {
    var r = i;
    return r && r.kind === "create" && C.string(r.uri) && (r.options === void 0 || (r.options.overwrite === void 0 || C.boolean(r.options.overwrite)) && (r.options.ignoreIfExists === void 0 || C.boolean(r.options.ignoreIfExists))) && (r.annotationId === void 0 || de.is(r.annotationId));
  }
  e.is = n;
})(Ut || (Ut = {}));
var Ht;
(function(e) {
  function t(i, r, a, s) {
    var l = {
      kind: "rename",
      oldUri: i,
      newUri: r
    };
    return a !== void 0 && (a.overwrite !== void 0 || a.ignoreIfExists !== void 0) && (l.options = a), s !== void 0 && (l.annotationId = s), l;
  }
  e.create = t;
  function n(i) {
    var r = i;
    return r && r.kind === "rename" && C.string(r.oldUri) && C.string(r.newUri) && (r.options === void 0 || (r.options.overwrite === void 0 || C.boolean(r.options.overwrite)) && (r.options.ignoreIfExists === void 0 || C.boolean(r.options.ignoreIfExists))) && (r.annotationId === void 0 || de.is(r.annotationId));
  }
  e.is = n;
})(Ht || (Ht = {}));
var Wt;
(function(e) {
  function t(i, r, a) {
    var s = {
      kind: "delete",
      uri: i
    };
    return r !== void 0 && (r.recursive !== void 0 || r.ignoreIfNotExists !== void 0) && (s.options = r), a !== void 0 && (s.annotationId = a), s;
  }
  e.create = t;
  function n(i) {
    var r = i;
    return r && r.kind === "delete" && C.string(r.uri) && (r.options === void 0 || (r.options.recursive === void 0 || C.boolean(r.options.recursive)) && (r.options.ignoreIfNotExists === void 0 || C.boolean(r.options.ignoreIfNotExists))) && (r.annotationId === void 0 || de.is(r.annotationId));
  }
  e.is = n;
})(Wt || (Wt = {}));
var ei;
(function(e) {
  function t(n) {
    var i = n;
    return i && (i.changes !== void 0 || i.documentChanges !== void 0) && (i.documentChanges === void 0 || i.documentChanges.every(function(r) {
      return C.string(r.kind) ? Ut.is(r) || Ht.is(r) || Wt.is(r) : cn.is(r);
    }));
  }
  e.is = t;
})(ei || (ei = {}));
var Vt = function() {
  function e(t, n) {
    this.edits = t, this.changeAnnotations = n;
  }
  return e.prototype.insert = function(t, n, i) {
    var r, a;
    if (i === void 0 ? r = ae.insert(t, n) : de.is(i) ? (a = i, r = je.insert(t, n, i)) : (this.assertChangeAnnotations(this.changeAnnotations), a = this.changeAnnotations.manage(i), r = je.insert(t, n, a)), this.edits.push(r), a !== void 0)
      return a;
  }, e.prototype.replace = function(t, n, i) {
    var r, a;
    if (i === void 0 ? r = ae.replace(t, n) : de.is(i) ? (a = i, r = je.replace(t, n, i)) : (this.assertChangeAnnotations(this.changeAnnotations), a = this.changeAnnotations.manage(i), r = je.replace(t, n, a)), this.edits.push(r), a !== void 0)
      return a;
  }, e.prototype.delete = function(t, n) {
    var i, r;
    if (n === void 0 ? i = ae.del(t) : de.is(n) ? (r = n, i = je.del(t, n)) : (this.assertChangeAnnotations(this.changeAnnotations), r = this.changeAnnotations.manage(n), i = je.del(t, r)), this.edits.push(i), r !== void 0)
      return r;
  }, e.prototype.add = function(t) {
    this.edits.push(t);
  }, e.prototype.all = function() {
    return this.edits;
  }, e.prototype.clear = function() {
    this.edits.splice(0, this.edits.length);
  }, e.prototype.assertChangeAnnotations = function(t) {
    if (t === void 0)
      throw new Error("Text edit change is not configured to manage change annotations.");
  }, e;
}(), jr = function() {
  function e(t) {
    this._annotations = t === void 0 ? /* @__PURE__ */ Object.create(null) : t, this._counter = 0, this._size = 0;
  }
  return e.prototype.all = function() {
    return this._annotations;
  }, Object.defineProperty(e.prototype, "size", {
    get: function() {
      return this._size;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.manage = function(t, n) {
    var i;
    if (de.is(t) ? i = t : (i = this.nextId(), n = t), this._annotations[i] !== void 0)
      throw new Error("Id " + i + " is already in use.");
    if (n === void 0)
      throw new Error("No annotation provided for id " + i);
    return this._annotations[i] = n, this._size++, i;
  }, e.prototype.nextId = function() {
    return this._counter++, this._counter.toString();
  }, e;
}();
(function() {
  function e(t) {
    var n = this;
    this._textEditChanges = /* @__PURE__ */ Object.create(null), t !== void 0 ? (this._workspaceEdit = t, t.documentChanges ? (this._changeAnnotations = new jr(t.changeAnnotations), t.changeAnnotations = this._changeAnnotations.all(), t.documentChanges.forEach(function(i) {
      if (cn.is(i)) {
        var r = new Vt(i.edits, n._changeAnnotations);
        n._textEditChanges[i.textDocument.uri] = r;
      }
    })) : t.changes && Object.keys(t.changes).forEach(function(i) {
      var r = new Vt(t.changes[i]);
      n._textEditChanges[i] = r;
    })) : this._workspaceEdit = {};
  }
  return Object.defineProperty(e.prototype, "edit", {
    get: function() {
      return this.initDocumentChanges(), this._changeAnnotations !== void 0 && (this._changeAnnotations.size === 0 ? this._workspaceEdit.changeAnnotations = void 0 : this._workspaceEdit.changeAnnotations = this._changeAnnotations.all()), this._workspaceEdit;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.getTextEditChange = function(t) {
    if (hn.is(t)) {
      if (this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0)
        throw new Error("Workspace edit is not configured for document changes.");
      var n = { uri: t.uri, version: t.version }, i = this._textEditChanges[n.uri];
      if (!i) {
        var r = [], a = {
          textDocument: n,
          edits: r
        };
        this._workspaceEdit.documentChanges.push(a), i = new Vt(r, this._changeAnnotations), this._textEditChanges[n.uri] = i;
      }
      return i;
    } else {
      if (this.initChanges(), this._workspaceEdit.changes === void 0)
        throw new Error("Workspace edit is not configured for normal text edit changes.");
      var i = this._textEditChanges[t];
      if (!i) {
        var r = [];
        this._workspaceEdit.changes[t] = r, i = new Vt(r), this._textEditChanges[t] = i;
      }
      return i;
    }
  }, e.prototype.initDocumentChanges = function() {
    this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0 && (this._changeAnnotations = new jr(), this._workspaceEdit.documentChanges = [], this._workspaceEdit.changeAnnotations = this._changeAnnotations.all());
  }, e.prototype.initChanges = function() {
    this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0 && (this._workspaceEdit.changes = /* @__PURE__ */ Object.create(null));
  }, e.prototype.createFile = function(t, n, i) {
    if (this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0)
      throw new Error("Workspace edit is not configured for document changes.");
    var r;
    ft.is(n) || de.is(n) ? r = n : i = n;
    var a, s;
    if (r === void 0 ? a = Ut.create(t, i) : (s = de.is(r) ? r : this._changeAnnotations.manage(r), a = Ut.create(t, i, s)), this._workspaceEdit.documentChanges.push(a), s !== void 0)
      return s;
  }, e.prototype.renameFile = function(t, n, i, r) {
    if (this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0)
      throw new Error("Workspace edit is not configured for document changes.");
    var a;
    ft.is(i) || de.is(i) ? a = i : r = i;
    var s, l;
    if (a === void 0 ? s = Ht.create(t, n, r) : (l = de.is(a) ? a : this._changeAnnotations.manage(a), s = Ht.create(t, n, r, l)), this._workspaceEdit.documentChanges.push(s), l !== void 0)
      return l;
  }, e.prototype.deleteFile = function(t, n, i) {
    if (this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0)
      throw new Error("Workspace edit is not configured for document changes.");
    var r;
    ft.is(n) || de.is(n) ? r = n : i = n;
    var a, s;
    if (r === void 0 ? a = Wt.create(t, i) : (s = de.is(r) ? r : this._changeAnnotations.manage(r), a = Wt.create(t, i, s)), this._workspaceEdit.documentChanges.push(a), s !== void 0)
      return s;
  }, e;
})();
var Gr;
(function(e) {
  function t(i) {
    return { uri: i };
  }
  e.create = t;
  function n(i) {
    var r = i;
    return C.defined(r) && C.string(r.uri);
  }
  e.is = n;
})(Gr || (Gr = {}));
var $r;
(function(e) {
  function t(i, r) {
    return { uri: i, version: r };
  }
  e.create = t;
  function n(i) {
    var r = i;
    return C.defined(r) && C.string(r.uri) && C.integer(r.version);
  }
  e.is = n;
})($r || ($r = {}));
var hn;
(function(e) {
  function t(i, r) {
    return { uri: i, version: r };
  }
  e.create = t;
  function n(i) {
    var r = i;
    return C.defined(r) && C.string(r.uri) && (r.version === null || C.integer(r.version));
  }
  e.is = n;
})(hn || (hn = {}));
var Xr;
(function(e) {
  function t(i, r, a, s) {
    return { uri: i, languageId: r, version: a, text: s };
  }
  e.create = t;
  function n(i) {
    var r = i;
    return C.defined(r) && C.string(r.uri) && C.string(r.languageId) && C.integer(r.version) && C.string(r.text);
  }
  e.is = n;
})(Xr || (Xr = {}));
var Ee;
(function(e) {
  e.PlainText = "plaintext", e.Markdown = "markdown";
})(Ee || (Ee = {}));
(function(e) {
  function t(n) {
    var i = n;
    return i === e.PlainText || i === e.Markdown;
  }
  e.is = t;
})(Ee || (Ee = {}));
var ti;
(function(e) {
  function t(n) {
    var i = n;
    return C.objectLiteral(n) && Ee.is(i.kind) && C.string(i.value);
  }
  e.is = t;
})(ti || (ti = {}));
var ge;
(function(e) {
  e.Text = 1, e.Method = 2, e.Function = 3, e.Constructor = 4, e.Field = 5, e.Variable = 6, e.Class = 7, e.Interface = 8, e.Module = 9, e.Property = 10, e.Unit = 11, e.Value = 12, e.Enum = 13, e.Keyword = 14, e.Snippet = 15, e.Color = 16, e.File = 17, e.Reference = 18, e.Folder = 19, e.EnumMember = 20, e.Constant = 21, e.Struct = 22, e.Event = 23, e.Operator = 24, e.TypeParameter = 25;
})(ge || (ge = {}));
var Se;
(function(e) {
  e.PlainText = 1, e.Snippet = 2;
})(Se || (Se = {}));
var Jr;
(function(e) {
  e.Deprecated = 1;
})(Jr || (Jr = {}));
var Qr;
(function(e) {
  function t(i, r, a) {
    return { newText: i, insert: r, replace: a };
  }
  e.create = t;
  function n(i) {
    var r = i;
    return r && C.string(r.newText) && Y.is(r.insert) && Y.is(r.replace);
  }
  e.is = n;
})(Qr || (Qr = {}));
var Yr;
(function(e) {
  e.asIs = 1, e.adjustIndentation = 2;
})(Yr || (Yr = {}));
var Zr;
(function(e) {
  function t(n) {
    return { label: n };
  }
  e.create = t;
})(Zr || (Zr = {}));
var Kr;
(function(e) {
  function t(n, i) {
    return { items: n || [], isIncomplete: !!i };
  }
  e.create = t;
})(Kr || (Kr = {}));
var dn;
(function(e) {
  function t(i) {
    return i.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
  }
  e.fromPlainText = t;
  function n(i) {
    var r = i;
    return C.string(r) || C.objectLiteral(r) && C.string(r.language) && C.string(r.value);
  }
  e.is = n;
})(dn || (dn = {}));
var ea;
(function(e) {
  function t(n) {
    var i = n;
    return !!i && C.objectLiteral(i) && (ti.is(i.contents) || dn.is(i.contents) || C.typedArray(i.contents, dn.is)) && (n.range === void 0 || Y.is(n.range));
  }
  e.is = t;
})(ea || (ea = {}));
var ta;
(function(e) {
  function t(n, i) {
    return i ? { label: n, documentation: i } : { label: n };
  }
  e.create = t;
})(ta || (ta = {}));
var na;
(function(e) {
  function t(n, i) {
    for (var r = [], a = 2; a < arguments.length; a++)
      r[a - 2] = arguments[a];
    var s = { label: n };
    return C.defined(i) && (s.documentation = i), C.defined(r) ? s.parameters = r : s.parameters = [], s;
  }
  e.create = t;
})(na || (na = {}));
var mn;
(function(e) {
  e.Text = 1, e.Read = 2, e.Write = 3;
})(mn || (mn = {}));
var ia;
(function(e) {
  function t(n, i) {
    var r = { range: n };
    return C.number(i) && (r.kind = i), r;
  }
  e.create = t;
})(ia || (ia = {}));
var ni;
(function(e) {
  e.File = 1, e.Module = 2, e.Namespace = 3, e.Package = 4, e.Class = 5, e.Method = 6, e.Property = 7, e.Field = 8, e.Constructor = 9, e.Enum = 10, e.Interface = 11, e.Function = 12, e.Variable = 13, e.Constant = 14, e.String = 15, e.Number = 16, e.Boolean = 17, e.Array = 18, e.Object = 19, e.Key = 20, e.Null = 21, e.EnumMember = 22, e.Struct = 23, e.Event = 24, e.Operator = 25, e.TypeParameter = 26;
})(ni || (ni = {}));
var ra;
(function(e) {
  e.Deprecated = 1;
})(ra || (ra = {}));
var aa;
(function(e) {
  function t(n, i, r, a, s) {
    var l = {
      name: n,
      kind: i,
      location: { uri: a, range: r }
    };
    return s && (l.containerName = s), l;
  }
  e.create = t;
})(aa || (aa = {}));
var sa;
(function(e) {
  function t(i, r, a, s, l, o) {
    var u = {
      name: i,
      detail: r,
      kind: a,
      range: s,
      selectionRange: l
    };
    return o !== void 0 && (u.children = o), u;
  }
  e.create = t;
  function n(i) {
    var r = i;
    return r && C.string(r.name) && C.number(r.kind) && Y.is(r.range) && Y.is(r.selectionRange) && (r.detail === void 0 || C.string(r.detail)) && (r.deprecated === void 0 || C.boolean(r.deprecated)) && (r.children === void 0 || Array.isArray(r.children)) && (r.tags === void 0 || Array.isArray(r.tags));
  }
  e.is = n;
})(sa || (sa = {}));
var oa;
(function(e) {
  e.Empty = "", e.QuickFix = "quickfix", e.Refactor = "refactor", e.RefactorExtract = "refactor.extract", e.RefactorInline = "refactor.inline", e.RefactorRewrite = "refactor.rewrite", e.Source = "source", e.SourceOrganizeImports = "source.organizeImports", e.SourceFixAll = "source.fixAll";
})(oa || (oa = {}));
var la;
(function(e) {
  function t(i, r) {
    var a = { diagnostics: i };
    return r != null && (a.only = r), a;
  }
  e.create = t;
  function n(i) {
    var r = i;
    return C.defined(r) && C.typedArray(r.diagnostics, un.is) && (r.only === void 0 || C.typedArray(r.only, C.string));
  }
  e.is = n;
})(la || (la = {}));
var ua;
(function(e) {
  function t(i, r, a) {
    var s = { title: i }, l = !0;
    return typeof r == "string" ? (l = !1, s.kind = r) : zt.is(r) ? s.command = r : s.edit = r, l && a !== void 0 && (s.kind = a), s;
  }
  e.create = t;
  function n(i) {
    var r = i;
    return r && C.string(r.title) && (r.diagnostics === void 0 || C.typedArray(r.diagnostics, un.is)) && (r.kind === void 0 || C.string(r.kind)) && (r.edit !== void 0 || r.command !== void 0) && (r.command === void 0 || zt.is(r.command)) && (r.isPreferred === void 0 || C.boolean(r.isPreferred)) && (r.edit === void 0 || ei.is(r.edit));
  }
  e.is = n;
})(ua || (ua = {}));
var ca;
(function(e) {
  function t(i, r) {
    var a = { range: i };
    return C.defined(r) && (a.data = r), a;
  }
  e.create = t;
  function n(i) {
    var r = i;
    return C.defined(r) && Y.is(r.range) && (C.undefined(r.command) || zt.is(r.command));
  }
  e.is = n;
})(ca || (ca = {}));
var ha;
(function(e) {
  function t(i, r) {
    return { tabSize: i, insertSpaces: r };
  }
  e.create = t;
  function n(i) {
    var r = i;
    return C.defined(r) && C.uinteger(r.tabSize) && C.boolean(r.insertSpaces);
  }
  e.is = n;
})(ha || (ha = {}));
var da;
(function(e) {
  function t(i, r, a) {
    return { range: i, target: r, data: a };
  }
  e.create = t;
  function n(i) {
    var r = i;
    return C.defined(r) && Y.is(r.range) && (C.undefined(r.target) || C.string(r.target));
  }
  e.is = n;
})(da || (da = {}));
var fn;
(function(e) {
  function t(i, r) {
    return { range: i, parent: r };
  }
  e.create = t;
  function n(i) {
    var r = i;
    return r !== void 0 && Y.is(r.range) && (r.parent === void 0 || e.is(r.parent));
  }
  e.is = n;
})(fn || (fn = {}));
var ma;
(function(e) {
  function t(a, s, l, o) {
    return new Sl(a, s, l, o);
  }
  e.create = t;
  function n(a) {
    var s = a;
    return !!(C.defined(s) && C.string(s.uri) && (C.undefined(s.languageId) || C.string(s.languageId)) && C.uinteger(s.lineCount) && C.func(s.getText) && C.func(s.positionAt) && C.func(s.offsetAt));
  }
  e.is = n;
  function i(a, s) {
    for (var l = a.getText(), o = r(s, function(g, p) {
      var w = g.range.start.line - p.range.start.line;
      return w === 0 ? g.range.start.character - p.range.start.character : w;
    }), u = l.length, c = o.length - 1; c >= 0; c--) {
      var h = o[c], m = a.offsetAt(h.range.start), f = a.offsetAt(h.range.end);
      if (f <= u)
        l = l.substring(0, m) + h.newText + l.substring(f, l.length);
      else
        throw new Error("Overlapping edit");
      u = m;
    }
    return l;
  }
  e.applyEdits = i;
  function r(a, s) {
    if (a.length <= 1)
      return a;
    var l = a.length / 2 | 0, o = a.slice(0, l), u = a.slice(l);
    r(o, s), r(u, s);
    for (var c = 0, h = 0, m = 0; c < o.length && h < u.length; ) {
      var f = s(o[c], u[h]);
      f <= 0 ? a[m++] = o[c++] : a[m++] = u[h++];
    }
    for (; c < o.length; )
      a[m++] = o[c++];
    for (; h < u.length; )
      a[m++] = u[h++];
    return a;
  }
})(ma || (ma = {}));
var Sl = function() {
  function e(t, n, i, r) {
    this._uri = t, this._languageId = n, this._version = i, this._content = r, this._lineOffsets = void 0;
  }
  return Object.defineProperty(e.prototype, "uri", {
    get: function() {
      return this._uri;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "languageId", {
    get: function() {
      return this._languageId;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "version", {
    get: function() {
      return this._version;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.getText = function(t) {
    if (t) {
      var n = this.offsetAt(t.start), i = this.offsetAt(t.end);
      return this._content.substring(n, i);
    }
    return this._content;
  }, e.prototype.update = function(t, n) {
    this._content = t.text, this._version = n, this._lineOffsets = void 0;
  }, e.prototype.getLineOffsets = function() {
    if (this._lineOffsets === void 0) {
      for (var t = [], n = this._content, i = !0, r = 0; r < n.length; r++) {
        i && (t.push(r), i = !1);
        var a = n.charAt(r);
        i = a === "\r" || a === `
`, a === "\r" && r + 1 < n.length && n.charAt(r + 1) === `
` && r++;
      }
      i && n.length > 0 && t.push(n.length), this._lineOffsets = t;
    }
    return this._lineOffsets;
  }, e.prototype.positionAt = function(t) {
    t = Math.max(Math.min(t, this._content.length), 0);
    var n = this.getLineOffsets(), i = 0, r = n.length;
    if (r === 0)
      return ce.create(0, t);
    for (; i < r; ) {
      var a = Math.floor((i + r) / 2);
      n[a] > t ? r = a : i = a + 1;
    }
    var s = i - 1;
    return ce.create(s, t - n[s]);
  }, e.prototype.offsetAt = function(t) {
    var n = this.getLineOffsets();
    if (t.line >= n.length)
      return this._content.length;
    if (t.line < 0)
      return 0;
    var i = n[t.line], r = t.line + 1 < n.length ? n[t.line + 1] : this._content.length;
    return Math.max(Math.min(i + t.character, r), i);
  }, Object.defineProperty(e.prototype, "lineCount", {
    get: function() {
      return this.getLineOffsets().length;
    },
    enumerable: !1,
    configurable: !0
  }), e;
}(), C;
(function(e) {
  var t = Object.prototype.toString;
  function n(f) {
    return typeof f < "u";
  }
  e.defined = n;
  function i(f) {
    return typeof f > "u";
  }
  e.undefined = i;
  function r(f) {
    return f === !0 || f === !1;
  }
  e.boolean = r;
  function a(f) {
    return t.call(f) === "[object String]";
  }
  e.string = a;
  function s(f) {
    return t.call(f) === "[object Number]";
  }
  e.number = s;
  function l(f, g, p) {
    return t.call(f) === "[object Number]" && g <= f && f <= p;
  }
  e.numberRange = l;
  function o(f) {
    return t.call(f) === "[object Number]" && -2147483648 <= f && f <= 2147483647;
  }
  e.integer = o;
  function u(f) {
    return t.call(f) === "[object Number]" && 0 <= f && f <= 2147483647;
  }
  e.uinteger = u;
  function c(f) {
    return t.call(f) === "[object Function]";
  }
  e.func = c;
  function h(f) {
    return f !== null && typeof f == "object";
  }
  e.objectLiteral = h;
  function m(f, g) {
    return Array.isArray(f) && f.every(g);
  }
  e.typedArray = m;
})(C || (C = {}));
var pn = class {
  constructor(e, t, n, i) {
    this._uri = e, this._languageId = t, this._version = n, this._content = i, this._lineOffsets = void 0;
  }
  get uri() {
    return this._uri;
  }
  get languageId() {
    return this._languageId;
  }
  get version() {
    return this._version;
  }
  getText(e) {
    if (e) {
      const t = this.offsetAt(e.start), n = this.offsetAt(e.end);
      return this._content.substring(t, n);
    }
    return this._content;
  }
  update(e, t) {
    for (let n of e)
      if (pn.isIncremental(n)) {
        const i = Qa(n.range), r = this.offsetAt(i.start), a = this.offsetAt(i.end);
        this._content = this._content.substring(0, r) + n.text + this._content.substring(a, this._content.length);
        const s = Math.max(i.start.line, 0), l = Math.max(i.end.line, 0);
        let o = this._lineOffsets;
        const u = fa(n.text, !1, r);
        if (l - s === u.length)
          for (let h = 0, m = u.length; h < m; h++)
            o[h + s + 1] = u[h];
        else
          u.length < 1e4 ? o.splice(s + 1, l - s, ...u) : this._lineOffsets = o = o.slice(0, s + 1).concat(u, o.slice(l + 1));
        const c = n.text.length - (a - r);
        if (c !== 0)
          for (let h = s + 1 + u.length, m = o.length; h < m; h++)
            o[h] = o[h] + c;
      } else if (pn.isFull(n))
        this._content = n.text, this._lineOffsets = void 0;
      else
        throw new Error("Unknown change event received");
    this._version = t;
  }
  getLineOffsets() {
    return this._lineOffsets === void 0 && (this._lineOffsets = fa(this._content, !0)), this._lineOffsets;
  }
  positionAt(e) {
    e = Math.max(Math.min(e, this._content.length), 0);
    let t = this.getLineOffsets(), n = 0, i = t.length;
    if (i === 0)
      return { line: 0, character: e };
    for (; n < i; ) {
      let a = Math.floor((n + i) / 2);
      t[a] > e ? i = a : n = a + 1;
    }
    let r = n - 1;
    return { line: r, character: e - t[r] };
  }
  offsetAt(e) {
    let t = this.getLineOffsets();
    if (e.line >= t.length)
      return this._content.length;
    if (e.line < 0)
      return 0;
    let n = t[e.line], i = e.line + 1 < t.length ? t[e.line + 1] : this._content.length;
    return Math.max(Math.min(n + e.character, i), n);
  }
  get lineCount() {
    return this.getLineOffsets().length;
  }
  static isIncremental(e) {
    let t = e;
    return t != null && typeof t.text == "string" && t.range !== void 0 && (t.rangeLength === void 0 || typeof t.rangeLength == "number");
  }
  static isFull(e) {
    let t = e;
    return t != null && typeof t.text == "string" && t.range === void 0 && t.rangeLength === void 0;
  }
}, ii;
(function(e) {
  function t(r, a, s, l) {
    return new pn(r, a, s, l);
  }
  e.create = t;
  function n(r, a, s) {
    if (r instanceof pn)
      return r.update(a, s), r;
    throw new Error("TextDocument.update: document must be created by TextDocument.create");
  }
  e.update = n;
  function i(r, a) {
    let s = r.getText(), l = ri(a.map(Ll), (c, h) => {
      let m = c.range.start.line - h.range.start.line;
      return m === 0 ? c.range.start.character - h.range.start.character : m;
    }), o = 0;
    const u = [];
    for (const c of l) {
      let h = r.offsetAt(c.range.start);
      if (h < o)
        throw new Error("Overlapping edit");
      h > o && u.push(s.substring(o, h)), c.newText.length && u.push(c.newText), o = r.offsetAt(c.range.end);
    }
    return u.push(s.substr(o)), u.join("");
  }
  e.applyEdits = i;
})(ii || (ii = {}));
function ri(e, t) {
  if (e.length <= 1)
    return e;
  const n = e.length / 2 | 0, i = e.slice(0, n), r = e.slice(n);
  ri(i, t), ri(r, t);
  let a = 0, s = 0, l = 0;
  for (; a < i.length && s < r.length; )
    t(i[a], r[s]) <= 0 ? e[l++] = i[a++] : e[l++] = r[s++];
  for (; a < i.length; )
    e[l++] = i[a++];
  for (; s < r.length; )
    e[l++] = r[s++];
  return e;
}
function fa(e, t, n = 0) {
  const i = t ? [n] : [];
  for (let r = 0; r < e.length; r++) {
    let a = e.charCodeAt(r);
    (a === 13 || a === 10) && (a === 13 && r + 1 < e.length && e.charCodeAt(r + 1) === 10 && r++, i.push(n + r + 1));
  }
  return i;
}
function Qa(e) {
  const t = e.start, n = e.end;
  return t.line > n.line || t.line === n.line && t.character > n.character ? { start: n, end: t } : e;
}
function Ll(e) {
  const t = Qa(e.range);
  return t !== e.range ? { newText: e.newText, range: t } : e;
}
var W;
(function(e) {
  e[e.StartCommentTag = 0] = "StartCommentTag", e[e.Comment = 1] = "Comment", e[e.EndCommentTag = 2] = "EndCommentTag", e[e.StartTagOpen = 3] = "StartTagOpen", e[e.StartTagClose = 4] = "StartTagClose", e[e.StartTagSelfClose = 5] = "StartTagSelfClose", e[e.StartTag = 6] = "StartTag", e[e.EndTagOpen = 7] = "EndTagOpen", e[e.EndTagClose = 8] = "EndTagClose", e[e.EndTag = 9] = "EndTag", e[e.DelimiterAssign = 10] = "DelimiterAssign", e[e.AttributeName = 11] = "AttributeName", e[e.AttributeValue = 12] = "AttributeValue", e[e.StartDoctypeTag = 13] = "StartDoctypeTag", e[e.Doctype = 14] = "Doctype", e[e.EndDoctypeTag = 15] = "EndDoctypeTag", e[e.Content = 16] = "Content", e[e.Whitespace = 17] = "Whitespace", e[e.Unknown = 18] = "Unknown", e[e.Script = 19] = "Script", e[e.Styles = 20] = "Styles", e[e.EOS = 21] = "EOS";
})(W || (W = {}));
var V;
(function(e) {
  e[e.WithinContent = 0] = "WithinContent", e[e.AfterOpeningStartTag = 1] = "AfterOpeningStartTag", e[e.AfterOpeningEndTag = 2] = "AfterOpeningEndTag", e[e.WithinDoctype = 3] = "WithinDoctype", e[e.WithinTag = 4] = "WithinTag", e[e.WithinEndTag = 5] = "WithinEndTag", e[e.WithinComment = 6] = "WithinComment", e[e.WithinScriptContent = 7] = "WithinScriptContent", e[e.WithinStyleContent = 8] = "WithinStyleContent", e[e.AfterAttributeName = 9] = "AfterAttributeName", e[e.BeforeAttributeValue = 10] = "BeforeAttributeValue";
})(V || (V = {}));
var pa;
(function(e) {
  e.LATEST = {
    textDocument: {
      completion: {
        completionItem: {
          documentationFormat: [Ee.Markdown, Ee.PlainText]
        }
      },
      hover: {
        contentFormat: [Ee.Markdown, Ee.PlainText]
      }
    }
  };
})(pa || (pa = {}));
var ai;
(function(e) {
  e[e.Unknown = 0] = "Unknown", e[e.File = 1] = "File", e[e.Directory = 2] = "Directory", e[e.SymbolicLink = 64] = "SymbolicLink";
})(ai || (ai = {}));
var Oe = mi(), Cl = function() {
  function e(t, n) {
    this.source = t, this.len = t.length, this.position = n;
  }
  return e.prototype.eos = function() {
    return this.len <= this.position;
  }, e.prototype.getSource = function() {
    return this.source;
  }, e.prototype.pos = function() {
    return this.position;
  }, e.prototype.goBackTo = function(t) {
    this.position = t;
  }, e.prototype.goBack = function(t) {
    this.position -= t;
  }, e.prototype.advance = function(t) {
    this.position += t;
  }, e.prototype.goToEnd = function() {
    this.position = this.source.length;
  }, e.prototype.nextChar = function() {
    return this.source.charCodeAt(this.position++) || 0;
  }, e.prototype.peekChar = function(t) {
    return t === void 0 && (t = 0), this.source.charCodeAt(this.position + t) || 0;
  }, e.prototype.advanceIfChar = function(t) {
    return t === this.source.charCodeAt(this.position) ? (this.position++, !0) : !1;
  }, e.prototype.advanceIfChars = function(t) {
    var n;
    if (this.position + t.length > this.source.length)
      return !1;
    for (n = 0; n < t.length; n++)
      if (this.source.charCodeAt(this.position + n) !== t[n])
        return !1;
    return this.advance(n), !0;
  }, e.prototype.advanceIfRegExp = function(t) {
    var n = this.source.substr(this.position), i = n.match(t);
    return i ? (this.position = this.position + i.index + i[0].length, i[0]) : "";
  }, e.prototype.advanceUntilRegExp = function(t) {
    var n = this.source.substr(this.position), i = n.match(t);
    return i ? (this.position = this.position + i.index, i[0]) : (this.goToEnd(), "");
  }, e.prototype.advanceUntilChar = function(t) {
    for (; this.position < this.source.length; ) {
      if (this.source.charCodeAt(this.position) === t)
        return !0;
      this.advance(1);
    }
    return !1;
  }, e.prototype.advanceUntilChars = function(t) {
    for (; this.position + t.length <= this.source.length; ) {
      for (var n = 0; n < t.length && this.source.charCodeAt(this.position + n) === t[n]; n++)
        ;
      if (n === t.length)
        return !0;
      this.advance(1);
    }
    return this.goToEnd(), !1;
  }, e.prototype.skipWhitespace = function() {
    var t = this.advanceWhileChar(function(n) {
      return n === zl || n === Ul || n === Dl || n === Il || n === Nl;
    });
    return t > 0;
  }, e.prototype.advanceWhileChar = function(t) {
    for (var n = this.position; this.position < this.len && t(this.source.charCodeAt(this.position)); )
      this.position++;
    return this.position - n;
  }, e;
}(), ga = "!".charCodeAt(0), ut = "-".charCodeAt(0), jt = "<".charCodeAt(0), De = ">".charCodeAt(0), Ln = "/".charCodeAt(0), El = "=".charCodeAt(0), Ml = '"'.charCodeAt(0), Rl = "'".charCodeAt(0), Dl = `
`.charCodeAt(0), Nl = "\r".charCodeAt(0), Il = "\f".charCodeAt(0), zl = " ".charCodeAt(0), Ul = "	".charCodeAt(0), Hl = {
  "text/x-handlebars-template": !0,
  "text/html": !0
};
function ye(e, t, n, i) {
  t === void 0 && (t = 0), n === void 0 && (n = V.WithinContent), i === void 0 && (i = !1);
  var r = new Cl(e, t), a = n, s = 0, l = W.Unknown, o, u, c, h, m;
  function f() {
    return r.advanceIfRegExp(/^[_:\w][_:\w-.\d]*/).toLowerCase();
  }
  function g() {
    return r.advanceIfRegExp(/^[^\s"'></=\x00-\x0F\x7F\x80-\x9F]*/).toLowerCase();
  }
  function p(v, x, E) {
    return l = x, s = v, o = E, x;
  }
  function w() {
    var v = r.pos(), x = a, E = y();
    return E !== W.EOS && v === r.pos() && !(i && (E === W.StartTagClose || E === W.EndTagClose)) ? (console.log("Scanner.scan has not advanced at offset " + v + ", state before: " + x + " after: " + a), r.advance(1), p(v, W.Unknown)) : E;
  }
  function y() {
    var v = r.pos();
    if (r.eos())
      return p(v, W.EOS);
    var x;
    switch (a) {
      case V.WithinComment:
        return r.advanceIfChars([ut, ut, De]) ? (a = V.WithinContent, p(v, W.EndCommentTag)) : (r.advanceUntilChars([ut, ut, De]), p(v, W.Comment));
      case V.WithinDoctype:
        return r.advanceIfChar(De) ? (a = V.WithinContent, p(v, W.EndDoctypeTag)) : (r.advanceUntilChar(De), p(v, W.Doctype));
      case V.WithinContent:
        if (r.advanceIfChar(jt)) {
          if (!r.eos() && r.peekChar() === ga) {
            if (r.advanceIfChars([ga, ut, ut]))
              return a = V.WithinComment, p(v, W.StartCommentTag);
            if (r.advanceIfRegExp(/^!doctype/i))
              return a = V.WithinDoctype, p(v, W.StartDoctypeTag);
          }
          return r.advanceIfChar(Ln) ? (a = V.AfterOpeningEndTag, p(v, W.EndTagOpen)) : (a = V.AfterOpeningStartTag, p(v, W.StartTagOpen));
        }
        return r.advanceUntilChar(jt), p(v, W.Content);
      case V.AfterOpeningEndTag:
        var E = f();
        return E.length > 0 ? (a = V.WithinEndTag, p(v, W.EndTag)) : r.skipWhitespace() ? p(v, W.Whitespace, Oe("error.unexpectedWhitespace", "Tag name must directly follow the open bracket.")) : (a = V.WithinEndTag, r.advanceUntilChar(De), v < r.pos() ? p(v, W.Unknown, Oe("error.endTagNameExpected", "End tag name expected.")) : y());
      case V.WithinEndTag:
        if (r.skipWhitespace())
          return p(v, W.Whitespace);
        if (r.advanceIfChar(De))
          return a = V.WithinContent, p(v, W.EndTagClose);
        if (i && r.peekChar() === jt)
          return a = V.WithinContent, p(v, W.EndTagClose, Oe("error.closingBracketMissing", "Closing bracket missing."));
        x = Oe("error.closingBracketExpected", "Closing bracket expected.");
        break;
      case V.AfterOpeningStartTag:
        return c = f(), m = void 0, h = void 0, c.length > 0 ? (u = !1, a = V.WithinTag, p(v, W.StartTag)) : r.skipWhitespace() ? p(v, W.Whitespace, Oe("error.unexpectedWhitespace", "Tag name must directly follow the open bracket.")) : (a = V.WithinTag, r.advanceUntilChar(De), v < r.pos() ? p(v, W.Unknown, Oe("error.startTagNameExpected", "Start tag name expected.")) : y());
      case V.WithinTag:
        return r.skipWhitespace() ? (u = !0, p(v, W.Whitespace)) : u && (h = g(), h.length > 0) ? (a = V.AfterAttributeName, u = !1, p(v, W.AttributeName)) : r.advanceIfChars([Ln, De]) ? (a = V.WithinContent, p(v, W.StartTagSelfClose)) : r.advanceIfChar(De) ? (c === "script" ? m && Hl[m] ? a = V.WithinContent : a = V.WithinScriptContent : c === "style" ? a = V.WithinStyleContent : a = V.WithinContent, p(v, W.StartTagClose)) : i && r.peekChar() === jt ? (a = V.WithinContent, p(v, W.StartTagClose, Oe("error.closingBracketMissing", "Closing bracket missing."))) : (r.advance(1), p(v, W.Unknown, Oe("error.unexpectedCharacterInTag", "Unexpected character in tag.")));
      case V.AfterAttributeName:
        return r.skipWhitespace() ? (u = !0, p(v, W.Whitespace)) : r.advanceIfChar(El) ? (a = V.BeforeAttributeValue, p(v, W.DelimiterAssign)) : (a = V.WithinTag, y());
      case V.BeforeAttributeValue:
        if (r.skipWhitespace())
          return p(v, W.Whitespace);
        var I = r.advanceIfRegExp(/^[^\s"'`=<>]+/);
        if (I.length > 0)
          return r.peekChar() === De && r.peekChar(-1) === Ln && (r.goBack(1), I = I.substr(0, I.length - 1)), h === "type" && (m = I), a = V.WithinTag, u = !1, p(v, W.AttributeValue);
        var B = r.peekChar();
        return B === Rl || B === Ml ? (r.advance(1), r.advanceUntilChar(B) && r.advance(1), h === "type" && (m = r.getSource().substring(v + 1, r.pos() - 1)), a = V.WithinTag, u = !1, p(v, W.AttributeValue)) : (a = V.WithinTag, u = !1, y());
      case V.WithinScriptContent:
        for (var _ = 1; !r.eos(); ) {
          var b = r.advanceIfRegExp(/<!--|-->|<\/?script\s*\/?>?/i);
          if (b.length === 0)
            return r.goToEnd(), p(v, W.Script);
          if (b === "<!--")
            _ === 1 && (_ = 2);
          else if (b === "-->")
            _ = 1;
          else if (b[1] !== "/")
            _ === 2 && (_ = 3);
          else if (_ === 3)
            _ = 2;
          else {
            r.goBack(b.length);
            break;
          }
        }
        return a = V.WithinContent, v < r.pos() ? p(v, W.Script) : y();
      case V.WithinStyleContent:
        return r.advanceUntilRegExp(/<\/style/i), a = V.WithinContent, v < r.pos() ? p(v, W.Styles) : y();
    }
    return r.advance(1), a = V.WithinContent, p(v, W.Unknown, x);
  }
  return {
    scan: w,
    getTokenType: function() {
      return l;
    },
    getTokenOffset: function() {
      return s;
    },
    getTokenLength: function() {
      return r.pos() - s;
    },
    getTokenEnd: function() {
      return r.pos();
    },
    getTokenText: function() {
      return r.getSource().substring(s, r.pos());
    },
    getScannerState: function() {
      return a;
    },
    getTokenError: function() {
      return o;
    }
  };
}
function ba(e, t) {
  var n = 0, i = e.length;
  if (i === 0)
    return 0;
  for (; n < i; ) {
    var r = Math.floor((n + i) / 2);
    t(e[r]) ? i = r : n = r + 1;
  }
  return n;
}
function Wl(e, t, n) {
  for (var i = 0, r = e.length - 1; i <= r; ) {
    var a = (i + r) / 2 | 0, s = n(e[a], t);
    if (s < 0)
      i = a + 1;
    else if (s > 0)
      r = a - 1;
    else
      return a;
  }
  return -(i + 1);
}
var Fl = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "menuitem", "meta", "param", "source", "track", "wbr"];
function gn(e) {
  return !!e && Wl(Fl, e.toLowerCase(), function(t, n) {
    return t.localeCompare(n);
  }) >= 0;
}
var va = function() {
  function e(t, n, i, r) {
    this.start = t, this.end = n, this.children = i, this.parent = r, this.closed = !1;
  }
  return Object.defineProperty(e.prototype, "attributeNames", {
    get: function() {
      return this.attributes ? Object.keys(this.attributes) : [];
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.isSameTag = function(t) {
    return this.tag === void 0 ? t === void 0 : t !== void 0 && this.tag.length === t.length && this.tag.toLowerCase() === t;
  }, Object.defineProperty(e.prototype, "firstChild", {
    get: function() {
      return this.children[0];
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "lastChild", {
    get: function() {
      return this.children.length ? this.children[this.children.length - 1] : void 0;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.findNodeBefore = function(t) {
    var n = ba(this.children, function(a) {
      return t <= a.start;
    }) - 1;
    if (n >= 0) {
      var i = this.children[n];
      if (t > i.start) {
        if (t < i.end)
          return i.findNodeBefore(t);
        var r = i.lastChild;
        return r && r.end === i.end ? i.findNodeBefore(t) : i;
      }
    }
    return this;
  }, e.prototype.findNodeAt = function(t) {
    var n = ba(this.children, function(r) {
      return t <= r.start;
    }) - 1;
    if (n >= 0) {
      var i = this.children[n];
      if (t > i.start && t <= i.end)
        return i.findNodeAt(t);
    }
    return this;
  }, e;
}();
function Ya(e) {
  for (var t = ye(e, void 0, void 0, !0), n = new va(0, e.length, [], void 0), i = n, r = -1, a = void 0, s = null, l = t.scan(); l !== W.EOS; ) {
    switch (l) {
      case W.StartTagOpen:
        var o = new va(t.getTokenOffset(), e.length, [], i);
        i.children.push(o), i = o;
        break;
      case W.StartTag:
        i.tag = t.getTokenText();
        break;
      case W.StartTagClose:
        i.parent && (i.end = t.getTokenEnd(), t.getTokenLength() ? (i.startTagEnd = t.getTokenEnd(), i.tag && gn(i.tag) && (i.closed = !0, i = i.parent)) : i = i.parent);
        break;
      case W.StartTagSelfClose:
        i.parent && (i.closed = !0, i.end = t.getTokenEnd(), i.startTagEnd = t.getTokenEnd(), i = i.parent);
        break;
      case W.EndTagOpen:
        r = t.getTokenOffset(), a = void 0;
        break;
      case W.EndTag:
        a = t.getTokenText().toLowerCase();
        break;
      case W.EndTagClose:
        for (var u = i; !u.isSameTag(a) && u.parent; )
          u = u.parent;
        if (u.parent) {
          for (; i !== u; )
            i.end = r, i.closed = !1, i = i.parent;
          i.closed = !0, i.endTagStart = r, i.end = t.getTokenEnd(), i = i.parent;
        }
        break;
      case W.AttributeName: {
        s = t.getTokenText();
        var c = i.attributes;
        c || (i.attributes = c = {}), c[s] = null;
        break;
      }
      case W.AttributeValue: {
        var h = t.getTokenText(), c = i.attributes;
        c && s && (c[s] = h, s = null);
        break;
      }
    }
    l = t.scan();
  }
  for (; i.parent; )
    i.end = e.length, i.closed = !1, i = i.parent;
  return {
    roots: n.children,
    findNodeBefore: n.findNodeBefore.bind(n),
    findNodeAt: n.findNodeAt.bind(n)
  };
}
var St = {
  "Aacute;": "Á",
  Aacute: "Á",
  "aacute;": "á",
  aacute: "á",
  "Abreve;": "Ă",
  "abreve;": "ă",
  "ac;": "∾",
  "acd;": "∿",
  "acE;": "∾̳",
  "Acirc;": "Â",
  Acirc: "Â",
  "acirc;": "â",
  acirc: "â",
  "acute;": "´",
  acute: "´",
  "Acy;": "А",
  "acy;": "а",
  "AElig;": "Æ",
  AElig: "Æ",
  "aelig;": "æ",
  aelig: "æ",
  "af;": "⁡",
  "Afr;": "𝔄",
  "afr;": "𝔞",
  "Agrave;": "À",
  Agrave: "À",
  "agrave;": "à",
  agrave: "à",
  "alefsym;": "ℵ",
  "aleph;": "ℵ",
  "Alpha;": "Α",
  "alpha;": "α",
  "Amacr;": "Ā",
  "amacr;": "ā",
  "amalg;": "⨿",
  "AMP;": "&",
  AMP: "&",
  "amp;": "&",
  amp: "&",
  "And;": "⩓",
  "and;": "∧",
  "andand;": "⩕",
  "andd;": "⩜",
  "andslope;": "⩘",
  "andv;": "⩚",
  "ang;": "∠",
  "ange;": "⦤",
  "angle;": "∠",
  "angmsd;": "∡",
  "angmsdaa;": "⦨",
  "angmsdab;": "⦩",
  "angmsdac;": "⦪",
  "angmsdad;": "⦫",
  "angmsdae;": "⦬",
  "angmsdaf;": "⦭",
  "angmsdag;": "⦮",
  "angmsdah;": "⦯",
  "angrt;": "∟",
  "angrtvb;": "⊾",
  "angrtvbd;": "⦝",
  "angsph;": "∢",
  "angst;": "Å",
  "angzarr;": "⍼",
  "Aogon;": "Ą",
  "aogon;": "ą",
  "Aopf;": "𝔸",
  "aopf;": "𝕒",
  "ap;": "≈",
  "apacir;": "⩯",
  "apE;": "⩰",
  "ape;": "≊",
  "apid;": "≋",
  "apos;": "'",
  "ApplyFunction;": "⁡",
  "approx;": "≈",
  "approxeq;": "≊",
  "Aring;": "Å",
  Aring: "Å",
  "aring;": "å",
  aring: "å",
  "Ascr;": "𝒜",
  "ascr;": "𝒶",
  "Assign;": "≔",
  "ast;": "*",
  "asymp;": "≈",
  "asympeq;": "≍",
  "Atilde;": "Ã",
  Atilde: "Ã",
  "atilde;": "ã",
  atilde: "ã",
  "Auml;": "Ä",
  Auml: "Ä",
  "auml;": "ä",
  auml: "ä",
  "awconint;": "∳",
  "awint;": "⨑",
  "backcong;": "≌",
  "backepsilon;": "϶",
  "backprime;": "‵",
  "backsim;": "∽",
  "backsimeq;": "⋍",
  "Backslash;": "∖",
  "Barv;": "⫧",
  "barvee;": "⊽",
  "Barwed;": "⌆",
  "barwed;": "⌅",
  "barwedge;": "⌅",
  "bbrk;": "⎵",
  "bbrktbrk;": "⎶",
  "bcong;": "≌",
  "Bcy;": "Б",
  "bcy;": "б",
  "bdquo;": "„",
  "becaus;": "∵",
  "Because;": "∵",
  "because;": "∵",
  "bemptyv;": "⦰",
  "bepsi;": "϶",
  "bernou;": "ℬ",
  "Bernoullis;": "ℬ",
  "Beta;": "Β",
  "beta;": "β",
  "beth;": "ℶ",
  "between;": "≬",
  "Bfr;": "𝔅",
  "bfr;": "𝔟",
  "bigcap;": "⋂",
  "bigcirc;": "◯",
  "bigcup;": "⋃",
  "bigodot;": "⨀",
  "bigoplus;": "⨁",
  "bigotimes;": "⨂",
  "bigsqcup;": "⨆",
  "bigstar;": "★",
  "bigtriangledown;": "▽",
  "bigtriangleup;": "△",
  "biguplus;": "⨄",
  "bigvee;": "⋁",
  "bigwedge;": "⋀",
  "bkarow;": "⤍",
  "blacklozenge;": "⧫",
  "blacksquare;": "▪",
  "blacktriangle;": "▴",
  "blacktriangledown;": "▾",
  "blacktriangleleft;": "◂",
  "blacktriangleright;": "▸",
  "blank;": "␣",
  "blk12;": "▒",
  "blk14;": "░",
  "blk34;": "▓",
  "block;": "█",
  "bne;": "=⃥",
  "bnequiv;": "≡⃥",
  "bNot;": "⫭",
  "bnot;": "⌐",
  "Bopf;": "𝔹",
  "bopf;": "𝕓",
  "bot;": "⊥",
  "bottom;": "⊥",
  "bowtie;": "⋈",
  "boxbox;": "⧉",
  "boxDL;": "╗",
  "boxDl;": "╖",
  "boxdL;": "╕",
  "boxdl;": "┐",
  "boxDR;": "╔",
  "boxDr;": "╓",
  "boxdR;": "╒",
  "boxdr;": "┌",
  "boxH;": "═",
  "boxh;": "─",
  "boxHD;": "╦",
  "boxHd;": "╤",
  "boxhD;": "╥",
  "boxhd;": "┬",
  "boxHU;": "╩",
  "boxHu;": "╧",
  "boxhU;": "╨",
  "boxhu;": "┴",
  "boxminus;": "⊟",
  "boxplus;": "⊞",
  "boxtimes;": "⊠",
  "boxUL;": "╝",
  "boxUl;": "╜",
  "boxuL;": "╛",
  "boxul;": "┘",
  "boxUR;": "╚",
  "boxUr;": "╙",
  "boxuR;": "╘",
  "boxur;": "└",
  "boxV;": "║",
  "boxv;": "│",
  "boxVH;": "╬",
  "boxVh;": "╫",
  "boxvH;": "╪",
  "boxvh;": "┼",
  "boxVL;": "╣",
  "boxVl;": "╢",
  "boxvL;": "╡",
  "boxvl;": "┤",
  "boxVR;": "╠",
  "boxVr;": "╟",
  "boxvR;": "╞",
  "boxvr;": "├",
  "bprime;": "‵",
  "Breve;": "˘",
  "breve;": "˘",
  "brvbar;": "¦",
  brvbar: "¦",
  "Bscr;": "ℬ",
  "bscr;": "𝒷",
  "bsemi;": "⁏",
  "bsim;": "∽",
  "bsime;": "⋍",
  "bsol;": "\\",
  "bsolb;": "⧅",
  "bsolhsub;": "⟈",
  "bull;": "•",
  "bullet;": "•",
  "bump;": "≎",
  "bumpE;": "⪮",
  "bumpe;": "≏",
  "Bumpeq;": "≎",
  "bumpeq;": "≏",
  "Cacute;": "Ć",
  "cacute;": "ć",
  "Cap;": "⋒",
  "cap;": "∩",
  "capand;": "⩄",
  "capbrcup;": "⩉",
  "capcap;": "⩋",
  "capcup;": "⩇",
  "capdot;": "⩀",
  "CapitalDifferentialD;": "ⅅ",
  "caps;": "∩︀",
  "caret;": "⁁",
  "caron;": "ˇ",
  "Cayleys;": "ℭ",
  "ccaps;": "⩍",
  "Ccaron;": "Č",
  "ccaron;": "č",
  "Ccedil;": "Ç",
  Ccedil: "Ç",
  "ccedil;": "ç",
  ccedil: "ç",
  "Ccirc;": "Ĉ",
  "ccirc;": "ĉ",
  "Cconint;": "∰",
  "ccups;": "⩌",
  "ccupssm;": "⩐",
  "Cdot;": "Ċ",
  "cdot;": "ċ",
  "cedil;": "¸",
  cedil: "¸",
  "Cedilla;": "¸",
  "cemptyv;": "⦲",
  "cent;": "¢",
  cent: "¢",
  "CenterDot;": "·",
  "centerdot;": "·",
  "Cfr;": "ℭ",
  "cfr;": "𝔠",
  "CHcy;": "Ч",
  "chcy;": "ч",
  "check;": "✓",
  "checkmark;": "✓",
  "Chi;": "Χ",
  "chi;": "χ",
  "cir;": "○",
  "circ;": "ˆ",
  "circeq;": "≗",
  "circlearrowleft;": "↺",
  "circlearrowright;": "↻",
  "circledast;": "⊛",
  "circledcirc;": "⊚",
  "circleddash;": "⊝",
  "CircleDot;": "⊙",
  "circledR;": "®",
  "circledS;": "Ⓢ",
  "CircleMinus;": "⊖",
  "CirclePlus;": "⊕",
  "CircleTimes;": "⊗",
  "cirE;": "⧃",
  "cire;": "≗",
  "cirfnint;": "⨐",
  "cirmid;": "⫯",
  "cirscir;": "⧂",
  "ClockwiseContourIntegral;": "∲",
  "CloseCurlyDoubleQuote;": "”",
  "CloseCurlyQuote;": "’",
  "clubs;": "♣",
  "clubsuit;": "♣",
  "Colon;": "∷",
  "colon;": ":",
  "Colone;": "⩴",
  "colone;": "≔",
  "coloneq;": "≔",
  "comma;": ",",
  "commat;": "@",
  "comp;": "∁",
  "compfn;": "∘",
  "complement;": "∁",
  "complexes;": "ℂ",
  "cong;": "≅",
  "congdot;": "⩭",
  "Congruent;": "≡",
  "Conint;": "∯",
  "conint;": "∮",
  "ContourIntegral;": "∮",
  "Copf;": "ℂ",
  "copf;": "𝕔",
  "coprod;": "∐",
  "Coproduct;": "∐",
  "COPY;": "©",
  COPY: "©",
  "copy;": "©",
  copy: "©",
  "copysr;": "℗",
  "CounterClockwiseContourIntegral;": "∳",
  "crarr;": "↵",
  "Cross;": "⨯",
  "cross;": "✗",
  "Cscr;": "𝒞",
  "cscr;": "𝒸",
  "csub;": "⫏",
  "csube;": "⫑",
  "csup;": "⫐",
  "csupe;": "⫒",
  "ctdot;": "⋯",
  "cudarrl;": "⤸",
  "cudarrr;": "⤵",
  "cuepr;": "⋞",
  "cuesc;": "⋟",
  "cularr;": "↶",
  "cularrp;": "⤽",
  "Cup;": "⋓",
  "cup;": "∪",
  "cupbrcap;": "⩈",
  "CupCap;": "≍",
  "cupcap;": "⩆",
  "cupcup;": "⩊",
  "cupdot;": "⊍",
  "cupor;": "⩅",
  "cups;": "∪︀",
  "curarr;": "↷",
  "curarrm;": "⤼",
  "curlyeqprec;": "⋞",
  "curlyeqsucc;": "⋟",
  "curlyvee;": "⋎",
  "curlywedge;": "⋏",
  "curren;": "¤",
  curren: "¤",
  "curvearrowleft;": "↶",
  "curvearrowright;": "↷",
  "cuvee;": "⋎",
  "cuwed;": "⋏",
  "cwconint;": "∲",
  "cwint;": "∱",
  "cylcty;": "⌭",
  "Dagger;": "‡",
  "dagger;": "†",
  "daleth;": "ℸ",
  "Darr;": "↡",
  "dArr;": "⇓",
  "darr;": "↓",
  "dash;": "‐",
  "Dashv;": "⫤",
  "dashv;": "⊣",
  "dbkarow;": "⤏",
  "dblac;": "˝",
  "Dcaron;": "Ď",
  "dcaron;": "ď",
  "Dcy;": "Д",
  "dcy;": "д",
  "DD;": "ⅅ",
  "dd;": "ⅆ",
  "ddagger;": "‡",
  "ddarr;": "⇊",
  "DDotrahd;": "⤑",
  "ddotseq;": "⩷",
  "deg;": "°",
  deg: "°",
  "Del;": "∇",
  "Delta;": "Δ",
  "delta;": "δ",
  "demptyv;": "⦱",
  "dfisht;": "⥿",
  "Dfr;": "𝔇",
  "dfr;": "𝔡",
  "dHar;": "⥥",
  "dharl;": "⇃",
  "dharr;": "⇂",
  "DiacriticalAcute;": "´",
  "DiacriticalDot;": "˙",
  "DiacriticalDoubleAcute;": "˝",
  "DiacriticalGrave;": "`",
  "DiacriticalTilde;": "˜",
  "diam;": "⋄",
  "Diamond;": "⋄",
  "diamond;": "⋄",
  "diamondsuit;": "♦",
  "diams;": "♦",
  "die;": "¨",
  "DifferentialD;": "ⅆ",
  "digamma;": "ϝ",
  "disin;": "⋲",
  "div;": "÷",
  "divide;": "÷",
  divide: "÷",
  "divideontimes;": "⋇",
  "divonx;": "⋇",
  "DJcy;": "Ђ",
  "djcy;": "ђ",
  "dlcorn;": "⌞",
  "dlcrop;": "⌍",
  "dollar;": "$",
  "Dopf;": "𝔻",
  "dopf;": "𝕕",
  "Dot;": "¨",
  "dot;": "˙",
  "DotDot;": "⃜",
  "doteq;": "≐",
  "doteqdot;": "≑",
  "DotEqual;": "≐",
  "dotminus;": "∸",
  "dotplus;": "∔",
  "dotsquare;": "⊡",
  "doublebarwedge;": "⌆",
  "DoubleContourIntegral;": "∯",
  "DoubleDot;": "¨",
  "DoubleDownArrow;": "⇓",
  "DoubleLeftArrow;": "⇐",
  "DoubleLeftRightArrow;": "⇔",
  "DoubleLeftTee;": "⫤",
  "DoubleLongLeftArrow;": "⟸",
  "DoubleLongLeftRightArrow;": "⟺",
  "DoubleLongRightArrow;": "⟹",
  "DoubleRightArrow;": "⇒",
  "DoubleRightTee;": "⊨",
  "DoubleUpArrow;": "⇑",
  "DoubleUpDownArrow;": "⇕",
  "DoubleVerticalBar;": "∥",
  "DownArrow;": "↓",
  "Downarrow;": "⇓",
  "downarrow;": "↓",
  "DownArrowBar;": "⤓",
  "DownArrowUpArrow;": "⇵",
  "DownBreve;": "̑",
  "downdownarrows;": "⇊",
  "downharpoonleft;": "⇃",
  "downharpoonright;": "⇂",
  "DownLeftRightVector;": "⥐",
  "DownLeftTeeVector;": "⥞",
  "DownLeftVector;": "↽",
  "DownLeftVectorBar;": "⥖",
  "DownRightTeeVector;": "⥟",
  "DownRightVector;": "⇁",
  "DownRightVectorBar;": "⥗",
  "DownTee;": "⊤",
  "DownTeeArrow;": "↧",
  "drbkarow;": "⤐",
  "drcorn;": "⌟",
  "drcrop;": "⌌",
  "Dscr;": "𝒟",
  "dscr;": "𝒹",
  "DScy;": "Ѕ",
  "dscy;": "ѕ",
  "dsol;": "⧶",
  "Dstrok;": "Đ",
  "dstrok;": "đ",
  "dtdot;": "⋱",
  "dtri;": "▿",
  "dtrif;": "▾",
  "duarr;": "⇵",
  "duhar;": "⥯",
  "dwangle;": "⦦",
  "DZcy;": "Џ",
  "dzcy;": "џ",
  "dzigrarr;": "⟿",
  "Eacute;": "É",
  Eacute: "É",
  "eacute;": "é",
  eacute: "é",
  "easter;": "⩮",
  "Ecaron;": "Ě",
  "ecaron;": "ě",
  "ecir;": "≖",
  "Ecirc;": "Ê",
  Ecirc: "Ê",
  "ecirc;": "ê",
  ecirc: "ê",
  "ecolon;": "≕",
  "Ecy;": "Э",
  "ecy;": "э",
  "eDDot;": "⩷",
  "Edot;": "Ė",
  "eDot;": "≑",
  "edot;": "ė",
  "ee;": "ⅇ",
  "efDot;": "≒",
  "Efr;": "𝔈",
  "efr;": "𝔢",
  "eg;": "⪚",
  "Egrave;": "È",
  Egrave: "È",
  "egrave;": "è",
  egrave: "è",
  "egs;": "⪖",
  "egsdot;": "⪘",
  "el;": "⪙",
  "Element;": "∈",
  "elinters;": "⏧",
  "ell;": "ℓ",
  "els;": "⪕",
  "elsdot;": "⪗",
  "Emacr;": "Ē",
  "emacr;": "ē",
  "empty;": "∅",
  "emptyset;": "∅",
  "EmptySmallSquare;": "◻",
  "emptyv;": "∅",
  "EmptyVerySmallSquare;": "▫",
  "emsp;": " ",
  "emsp13;": " ",
  "emsp14;": " ",
  "ENG;": "Ŋ",
  "eng;": "ŋ",
  "ensp;": " ",
  "Eogon;": "Ę",
  "eogon;": "ę",
  "Eopf;": "𝔼",
  "eopf;": "𝕖",
  "epar;": "⋕",
  "eparsl;": "⧣",
  "eplus;": "⩱",
  "epsi;": "ε",
  "Epsilon;": "Ε",
  "epsilon;": "ε",
  "epsiv;": "ϵ",
  "eqcirc;": "≖",
  "eqcolon;": "≕",
  "eqsim;": "≂",
  "eqslantgtr;": "⪖",
  "eqslantless;": "⪕",
  "Equal;": "⩵",
  "equals;": "=",
  "EqualTilde;": "≂",
  "equest;": "≟",
  "Equilibrium;": "⇌",
  "equiv;": "≡",
  "equivDD;": "⩸",
  "eqvparsl;": "⧥",
  "erarr;": "⥱",
  "erDot;": "≓",
  "Escr;": "ℰ",
  "escr;": "ℯ",
  "esdot;": "≐",
  "Esim;": "⩳",
  "esim;": "≂",
  "Eta;": "Η",
  "eta;": "η",
  "ETH;": "Ð",
  ETH: "Ð",
  "eth;": "ð",
  eth: "ð",
  "Euml;": "Ë",
  Euml: "Ë",
  "euml;": "ë",
  euml: "ë",
  "euro;": "€",
  "excl;": "!",
  "exist;": "∃",
  "Exists;": "∃",
  "expectation;": "ℰ",
  "ExponentialE;": "ⅇ",
  "exponentiale;": "ⅇ",
  "fallingdotseq;": "≒",
  "Fcy;": "Ф",
  "fcy;": "ф",
  "female;": "♀",
  "ffilig;": "ﬃ",
  "fflig;": "ﬀ",
  "ffllig;": "ﬄ",
  "Ffr;": "𝔉",
  "ffr;": "𝔣",
  "filig;": "ﬁ",
  "FilledSmallSquare;": "◼",
  "FilledVerySmallSquare;": "▪",
  "fjlig;": "fj",
  "flat;": "♭",
  "fllig;": "ﬂ",
  "fltns;": "▱",
  "fnof;": "ƒ",
  "Fopf;": "𝔽",
  "fopf;": "𝕗",
  "ForAll;": "∀",
  "forall;": "∀",
  "fork;": "⋔",
  "forkv;": "⫙",
  "Fouriertrf;": "ℱ",
  "fpartint;": "⨍",
  "frac12;": "½",
  frac12: "½",
  "frac13;": "⅓",
  "frac14;": "¼",
  frac14: "¼",
  "frac15;": "⅕",
  "frac16;": "⅙",
  "frac18;": "⅛",
  "frac23;": "⅔",
  "frac25;": "⅖",
  "frac34;": "¾",
  frac34: "¾",
  "frac35;": "⅗",
  "frac38;": "⅜",
  "frac45;": "⅘",
  "frac56;": "⅚",
  "frac58;": "⅝",
  "frac78;": "⅞",
  "frasl;": "⁄",
  "frown;": "⌢",
  "Fscr;": "ℱ",
  "fscr;": "𝒻",
  "gacute;": "ǵ",
  "Gamma;": "Γ",
  "gamma;": "γ",
  "Gammad;": "Ϝ",
  "gammad;": "ϝ",
  "gap;": "⪆",
  "Gbreve;": "Ğ",
  "gbreve;": "ğ",
  "Gcedil;": "Ģ",
  "Gcirc;": "Ĝ",
  "gcirc;": "ĝ",
  "Gcy;": "Г",
  "gcy;": "г",
  "Gdot;": "Ġ",
  "gdot;": "ġ",
  "gE;": "≧",
  "ge;": "≥",
  "gEl;": "⪌",
  "gel;": "⋛",
  "geq;": "≥",
  "geqq;": "≧",
  "geqslant;": "⩾",
  "ges;": "⩾",
  "gescc;": "⪩",
  "gesdot;": "⪀",
  "gesdoto;": "⪂",
  "gesdotol;": "⪄",
  "gesl;": "⋛︀",
  "gesles;": "⪔",
  "Gfr;": "𝔊",
  "gfr;": "𝔤",
  "Gg;": "⋙",
  "gg;": "≫",
  "ggg;": "⋙",
  "gimel;": "ℷ",
  "GJcy;": "Ѓ",
  "gjcy;": "ѓ",
  "gl;": "≷",
  "gla;": "⪥",
  "glE;": "⪒",
  "glj;": "⪤",
  "gnap;": "⪊",
  "gnapprox;": "⪊",
  "gnE;": "≩",
  "gne;": "⪈",
  "gneq;": "⪈",
  "gneqq;": "≩",
  "gnsim;": "⋧",
  "Gopf;": "𝔾",
  "gopf;": "𝕘",
  "grave;": "`",
  "GreaterEqual;": "≥",
  "GreaterEqualLess;": "⋛",
  "GreaterFullEqual;": "≧",
  "GreaterGreater;": "⪢",
  "GreaterLess;": "≷",
  "GreaterSlantEqual;": "⩾",
  "GreaterTilde;": "≳",
  "Gscr;": "𝒢",
  "gscr;": "ℊ",
  "gsim;": "≳",
  "gsime;": "⪎",
  "gsiml;": "⪐",
  "GT;": ">",
  GT: ">",
  "Gt;": "≫",
  "gt;": ">",
  gt: ">",
  "gtcc;": "⪧",
  "gtcir;": "⩺",
  "gtdot;": "⋗",
  "gtlPar;": "⦕",
  "gtquest;": "⩼",
  "gtrapprox;": "⪆",
  "gtrarr;": "⥸",
  "gtrdot;": "⋗",
  "gtreqless;": "⋛",
  "gtreqqless;": "⪌",
  "gtrless;": "≷",
  "gtrsim;": "≳",
  "gvertneqq;": "≩︀",
  "gvnE;": "≩︀",
  "Hacek;": "ˇ",
  "hairsp;": " ",
  "half;": "½",
  "hamilt;": "ℋ",
  "HARDcy;": "Ъ",
  "hardcy;": "ъ",
  "hArr;": "⇔",
  "harr;": "↔",
  "harrcir;": "⥈",
  "harrw;": "↭",
  "Hat;": "^",
  "hbar;": "ℏ",
  "Hcirc;": "Ĥ",
  "hcirc;": "ĥ",
  "hearts;": "♥",
  "heartsuit;": "♥",
  "hellip;": "…",
  "hercon;": "⊹",
  "Hfr;": "ℌ",
  "hfr;": "𝔥",
  "HilbertSpace;": "ℋ",
  "hksearow;": "⤥",
  "hkswarow;": "⤦",
  "hoarr;": "⇿",
  "homtht;": "∻",
  "hookleftarrow;": "↩",
  "hookrightarrow;": "↪",
  "Hopf;": "ℍ",
  "hopf;": "𝕙",
  "horbar;": "―",
  "HorizontalLine;": "─",
  "Hscr;": "ℋ",
  "hscr;": "𝒽",
  "hslash;": "ℏ",
  "Hstrok;": "Ħ",
  "hstrok;": "ħ",
  "HumpDownHump;": "≎",
  "HumpEqual;": "≏",
  "hybull;": "⁃",
  "hyphen;": "‐",
  "Iacute;": "Í",
  Iacute: "Í",
  "iacute;": "í",
  iacute: "í",
  "ic;": "⁣",
  "Icirc;": "Î",
  Icirc: "Î",
  "icirc;": "î",
  icirc: "î",
  "Icy;": "И",
  "icy;": "и",
  "Idot;": "İ",
  "IEcy;": "Е",
  "iecy;": "е",
  "iexcl;": "¡",
  iexcl: "¡",
  "iff;": "⇔",
  "Ifr;": "ℑ",
  "ifr;": "𝔦",
  "Igrave;": "Ì",
  Igrave: "Ì",
  "igrave;": "ì",
  igrave: "ì",
  "ii;": "ⅈ",
  "iiiint;": "⨌",
  "iiint;": "∭",
  "iinfin;": "⧜",
  "iiota;": "℩",
  "IJlig;": "Ĳ",
  "ijlig;": "ĳ",
  "Im;": "ℑ",
  "Imacr;": "Ī",
  "imacr;": "ī",
  "image;": "ℑ",
  "ImaginaryI;": "ⅈ",
  "imagline;": "ℐ",
  "imagpart;": "ℑ",
  "imath;": "ı",
  "imof;": "⊷",
  "imped;": "Ƶ",
  "Implies;": "⇒",
  "in;": "∈",
  "incare;": "℅",
  "infin;": "∞",
  "infintie;": "⧝",
  "inodot;": "ı",
  "Int;": "∬",
  "int;": "∫",
  "intcal;": "⊺",
  "integers;": "ℤ",
  "Integral;": "∫",
  "intercal;": "⊺",
  "Intersection;": "⋂",
  "intlarhk;": "⨗",
  "intprod;": "⨼",
  "InvisibleComma;": "⁣",
  "InvisibleTimes;": "⁢",
  "IOcy;": "Ё",
  "iocy;": "ё",
  "Iogon;": "Į",
  "iogon;": "į",
  "Iopf;": "𝕀",
  "iopf;": "𝕚",
  "Iota;": "Ι",
  "iota;": "ι",
  "iprod;": "⨼",
  "iquest;": "¿",
  iquest: "¿",
  "Iscr;": "ℐ",
  "iscr;": "𝒾",
  "isin;": "∈",
  "isindot;": "⋵",
  "isinE;": "⋹",
  "isins;": "⋴",
  "isinsv;": "⋳",
  "isinv;": "∈",
  "it;": "⁢",
  "Itilde;": "Ĩ",
  "itilde;": "ĩ",
  "Iukcy;": "І",
  "iukcy;": "і",
  "Iuml;": "Ï",
  Iuml: "Ï",
  "iuml;": "ï",
  iuml: "ï",
  "Jcirc;": "Ĵ",
  "jcirc;": "ĵ",
  "Jcy;": "Й",
  "jcy;": "й",
  "Jfr;": "𝔍",
  "jfr;": "𝔧",
  "jmath;": "ȷ",
  "Jopf;": "𝕁",
  "jopf;": "𝕛",
  "Jscr;": "𝒥",
  "jscr;": "𝒿",
  "Jsercy;": "Ј",
  "jsercy;": "ј",
  "Jukcy;": "Є",
  "jukcy;": "є",
  "Kappa;": "Κ",
  "kappa;": "κ",
  "kappav;": "ϰ",
  "Kcedil;": "Ķ",
  "kcedil;": "ķ",
  "Kcy;": "К",
  "kcy;": "к",
  "Kfr;": "𝔎",
  "kfr;": "𝔨",
  "kgreen;": "ĸ",
  "KHcy;": "Х",
  "khcy;": "х",
  "KJcy;": "Ќ",
  "kjcy;": "ќ",
  "Kopf;": "𝕂",
  "kopf;": "𝕜",
  "Kscr;": "𝒦",
  "kscr;": "𝓀",
  "lAarr;": "⇚",
  "Lacute;": "Ĺ",
  "lacute;": "ĺ",
  "laemptyv;": "⦴",
  "lagran;": "ℒ",
  "Lambda;": "Λ",
  "lambda;": "λ",
  "Lang;": "⟪",
  "lang;": "⟨",
  "langd;": "⦑",
  "langle;": "⟨",
  "lap;": "⪅",
  "Laplacetrf;": "ℒ",
  "laquo;": "«",
  laquo: "«",
  "Larr;": "↞",
  "lArr;": "⇐",
  "larr;": "←",
  "larrb;": "⇤",
  "larrbfs;": "⤟",
  "larrfs;": "⤝",
  "larrhk;": "↩",
  "larrlp;": "↫",
  "larrpl;": "⤹",
  "larrsim;": "⥳",
  "larrtl;": "↢",
  "lat;": "⪫",
  "lAtail;": "⤛",
  "latail;": "⤙",
  "late;": "⪭",
  "lates;": "⪭︀",
  "lBarr;": "⤎",
  "lbarr;": "⤌",
  "lbbrk;": "❲",
  "lbrace;": "{",
  "lbrack;": "[",
  "lbrke;": "⦋",
  "lbrksld;": "⦏",
  "lbrkslu;": "⦍",
  "Lcaron;": "Ľ",
  "lcaron;": "ľ",
  "Lcedil;": "Ļ",
  "lcedil;": "ļ",
  "lceil;": "⌈",
  "lcub;": "{",
  "Lcy;": "Л",
  "lcy;": "л",
  "ldca;": "⤶",
  "ldquo;": "“",
  "ldquor;": "„",
  "ldrdhar;": "⥧",
  "ldrushar;": "⥋",
  "ldsh;": "↲",
  "lE;": "≦",
  "le;": "≤",
  "LeftAngleBracket;": "⟨",
  "LeftArrow;": "←",
  "Leftarrow;": "⇐",
  "leftarrow;": "←",
  "LeftArrowBar;": "⇤",
  "LeftArrowRightArrow;": "⇆",
  "leftarrowtail;": "↢",
  "LeftCeiling;": "⌈",
  "LeftDoubleBracket;": "⟦",
  "LeftDownTeeVector;": "⥡",
  "LeftDownVector;": "⇃",
  "LeftDownVectorBar;": "⥙",
  "LeftFloor;": "⌊",
  "leftharpoondown;": "↽",
  "leftharpoonup;": "↼",
  "leftleftarrows;": "⇇",
  "LeftRightArrow;": "↔",
  "Leftrightarrow;": "⇔",
  "leftrightarrow;": "↔",
  "leftrightarrows;": "⇆",
  "leftrightharpoons;": "⇋",
  "leftrightsquigarrow;": "↭",
  "LeftRightVector;": "⥎",
  "LeftTee;": "⊣",
  "LeftTeeArrow;": "↤",
  "LeftTeeVector;": "⥚",
  "leftthreetimes;": "⋋",
  "LeftTriangle;": "⊲",
  "LeftTriangleBar;": "⧏",
  "LeftTriangleEqual;": "⊴",
  "LeftUpDownVector;": "⥑",
  "LeftUpTeeVector;": "⥠",
  "LeftUpVector;": "↿",
  "LeftUpVectorBar;": "⥘",
  "LeftVector;": "↼",
  "LeftVectorBar;": "⥒",
  "lEg;": "⪋",
  "leg;": "⋚",
  "leq;": "≤",
  "leqq;": "≦",
  "leqslant;": "⩽",
  "les;": "⩽",
  "lescc;": "⪨",
  "lesdot;": "⩿",
  "lesdoto;": "⪁",
  "lesdotor;": "⪃",
  "lesg;": "⋚︀",
  "lesges;": "⪓",
  "lessapprox;": "⪅",
  "lessdot;": "⋖",
  "lesseqgtr;": "⋚",
  "lesseqqgtr;": "⪋",
  "LessEqualGreater;": "⋚",
  "LessFullEqual;": "≦",
  "LessGreater;": "≶",
  "lessgtr;": "≶",
  "LessLess;": "⪡",
  "lesssim;": "≲",
  "LessSlantEqual;": "⩽",
  "LessTilde;": "≲",
  "lfisht;": "⥼",
  "lfloor;": "⌊",
  "Lfr;": "𝔏",
  "lfr;": "𝔩",
  "lg;": "≶",
  "lgE;": "⪑",
  "lHar;": "⥢",
  "lhard;": "↽",
  "lharu;": "↼",
  "lharul;": "⥪",
  "lhblk;": "▄",
  "LJcy;": "Љ",
  "ljcy;": "љ",
  "Ll;": "⋘",
  "ll;": "≪",
  "llarr;": "⇇",
  "llcorner;": "⌞",
  "Lleftarrow;": "⇚",
  "llhard;": "⥫",
  "lltri;": "◺",
  "Lmidot;": "Ŀ",
  "lmidot;": "ŀ",
  "lmoust;": "⎰",
  "lmoustache;": "⎰",
  "lnap;": "⪉",
  "lnapprox;": "⪉",
  "lnE;": "≨",
  "lne;": "⪇",
  "lneq;": "⪇",
  "lneqq;": "≨",
  "lnsim;": "⋦",
  "loang;": "⟬",
  "loarr;": "⇽",
  "lobrk;": "⟦",
  "LongLeftArrow;": "⟵",
  "Longleftarrow;": "⟸",
  "longleftarrow;": "⟵",
  "LongLeftRightArrow;": "⟷",
  "Longleftrightarrow;": "⟺",
  "longleftrightarrow;": "⟷",
  "longmapsto;": "⟼",
  "LongRightArrow;": "⟶",
  "Longrightarrow;": "⟹",
  "longrightarrow;": "⟶",
  "looparrowleft;": "↫",
  "looparrowright;": "↬",
  "lopar;": "⦅",
  "Lopf;": "𝕃",
  "lopf;": "𝕝",
  "loplus;": "⨭",
  "lotimes;": "⨴",
  "lowast;": "∗",
  "lowbar;": "_",
  "LowerLeftArrow;": "↙",
  "LowerRightArrow;": "↘",
  "loz;": "◊",
  "lozenge;": "◊",
  "lozf;": "⧫",
  "lpar;": "(",
  "lparlt;": "⦓",
  "lrarr;": "⇆",
  "lrcorner;": "⌟",
  "lrhar;": "⇋",
  "lrhard;": "⥭",
  "lrm;": "‎",
  "lrtri;": "⊿",
  "lsaquo;": "‹",
  "Lscr;": "ℒ",
  "lscr;": "𝓁",
  "Lsh;": "↰",
  "lsh;": "↰",
  "lsim;": "≲",
  "lsime;": "⪍",
  "lsimg;": "⪏",
  "lsqb;": "[",
  "lsquo;": "‘",
  "lsquor;": "‚",
  "Lstrok;": "Ł",
  "lstrok;": "ł",
  "LT;": "<",
  LT: "<",
  "Lt;": "≪",
  "lt;": "<",
  lt: "<",
  "ltcc;": "⪦",
  "ltcir;": "⩹",
  "ltdot;": "⋖",
  "lthree;": "⋋",
  "ltimes;": "⋉",
  "ltlarr;": "⥶",
  "ltquest;": "⩻",
  "ltri;": "◃",
  "ltrie;": "⊴",
  "ltrif;": "◂",
  "ltrPar;": "⦖",
  "lurdshar;": "⥊",
  "luruhar;": "⥦",
  "lvertneqq;": "≨︀",
  "lvnE;": "≨︀",
  "macr;": "¯",
  macr: "¯",
  "male;": "♂",
  "malt;": "✠",
  "maltese;": "✠",
  "Map;": "⤅",
  "map;": "↦",
  "mapsto;": "↦",
  "mapstodown;": "↧",
  "mapstoleft;": "↤",
  "mapstoup;": "↥",
  "marker;": "▮",
  "mcomma;": "⨩",
  "Mcy;": "М",
  "mcy;": "м",
  "mdash;": "—",
  "mDDot;": "∺",
  "measuredangle;": "∡",
  "MediumSpace;": " ",
  "Mellintrf;": "ℳ",
  "Mfr;": "𝔐",
  "mfr;": "𝔪",
  "mho;": "℧",
  "micro;": "µ",
  micro: "µ",
  "mid;": "∣",
  "midast;": "*",
  "midcir;": "⫰",
  "middot;": "·",
  middot: "·",
  "minus;": "−",
  "minusb;": "⊟",
  "minusd;": "∸",
  "minusdu;": "⨪",
  "MinusPlus;": "∓",
  "mlcp;": "⫛",
  "mldr;": "…",
  "mnplus;": "∓",
  "models;": "⊧",
  "Mopf;": "𝕄",
  "mopf;": "𝕞",
  "mp;": "∓",
  "Mscr;": "ℳ",
  "mscr;": "𝓂",
  "mstpos;": "∾",
  "Mu;": "Μ",
  "mu;": "μ",
  "multimap;": "⊸",
  "mumap;": "⊸",
  "nabla;": "∇",
  "Nacute;": "Ń",
  "nacute;": "ń",
  "nang;": "∠⃒",
  "nap;": "≉",
  "napE;": "⩰̸",
  "napid;": "≋̸",
  "napos;": "ŉ",
  "napprox;": "≉",
  "natur;": "♮",
  "natural;": "♮",
  "naturals;": "ℕ",
  "nbsp;": " ",
  nbsp: " ",
  "nbump;": "≎̸",
  "nbumpe;": "≏̸",
  "ncap;": "⩃",
  "Ncaron;": "Ň",
  "ncaron;": "ň",
  "Ncedil;": "Ņ",
  "ncedil;": "ņ",
  "ncong;": "≇",
  "ncongdot;": "⩭̸",
  "ncup;": "⩂",
  "Ncy;": "Н",
  "ncy;": "н",
  "ndash;": "–",
  "ne;": "≠",
  "nearhk;": "⤤",
  "neArr;": "⇗",
  "nearr;": "↗",
  "nearrow;": "↗",
  "nedot;": "≐̸",
  "NegativeMediumSpace;": "​",
  "NegativeThickSpace;": "​",
  "NegativeThinSpace;": "​",
  "NegativeVeryThinSpace;": "​",
  "nequiv;": "≢",
  "nesear;": "⤨",
  "nesim;": "≂̸",
  "NestedGreaterGreater;": "≫",
  "NestedLessLess;": "≪",
  "NewLine;": `
`,
  "nexist;": "∄",
  "nexists;": "∄",
  "Nfr;": "𝔑",
  "nfr;": "𝔫",
  "ngE;": "≧̸",
  "nge;": "≱",
  "ngeq;": "≱",
  "ngeqq;": "≧̸",
  "ngeqslant;": "⩾̸",
  "nges;": "⩾̸",
  "nGg;": "⋙̸",
  "ngsim;": "≵",
  "nGt;": "≫⃒",
  "ngt;": "≯",
  "ngtr;": "≯",
  "nGtv;": "≫̸",
  "nhArr;": "⇎",
  "nharr;": "↮",
  "nhpar;": "⫲",
  "ni;": "∋",
  "nis;": "⋼",
  "nisd;": "⋺",
  "niv;": "∋",
  "NJcy;": "Њ",
  "njcy;": "њ",
  "nlArr;": "⇍",
  "nlarr;": "↚",
  "nldr;": "‥",
  "nlE;": "≦̸",
  "nle;": "≰",
  "nLeftarrow;": "⇍",
  "nleftarrow;": "↚",
  "nLeftrightarrow;": "⇎",
  "nleftrightarrow;": "↮",
  "nleq;": "≰",
  "nleqq;": "≦̸",
  "nleqslant;": "⩽̸",
  "nles;": "⩽̸",
  "nless;": "≮",
  "nLl;": "⋘̸",
  "nlsim;": "≴",
  "nLt;": "≪⃒",
  "nlt;": "≮",
  "nltri;": "⋪",
  "nltrie;": "⋬",
  "nLtv;": "≪̸",
  "nmid;": "∤",
  "NoBreak;": "⁠",
  "NonBreakingSpace;": " ",
  "Nopf;": "ℕ",
  "nopf;": "𝕟",
  "Not;": "⫬",
  "not;": "¬",
  not: "¬",
  "NotCongruent;": "≢",
  "NotCupCap;": "≭",
  "NotDoubleVerticalBar;": "∦",
  "NotElement;": "∉",
  "NotEqual;": "≠",
  "NotEqualTilde;": "≂̸",
  "NotExists;": "∄",
  "NotGreater;": "≯",
  "NotGreaterEqual;": "≱",
  "NotGreaterFullEqual;": "≧̸",
  "NotGreaterGreater;": "≫̸",
  "NotGreaterLess;": "≹",
  "NotGreaterSlantEqual;": "⩾̸",
  "NotGreaterTilde;": "≵",
  "NotHumpDownHump;": "≎̸",
  "NotHumpEqual;": "≏̸",
  "notin;": "∉",
  "notindot;": "⋵̸",
  "notinE;": "⋹̸",
  "notinva;": "∉",
  "notinvb;": "⋷",
  "notinvc;": "⋶",
  "NotLeftTriangle;": "⋪",
  "NotLeftTriangleBar;": "⧏̸",
  "NotLeftTriangleEqual;": "⋬",
  "NotLess;": "≮",
  "NotLessEqual;": "≰",
  "NotLessGreater;": "≸",
  "NotLessLess;": "≪̸",
  "NotLessSlantEqual;": "⩽̸",
  "NotLessTilde;": "≴",
  "NotNestedGreaterGreater;": "⪢̸",
  "NotNestedLessLess;": "⪡̸",
  "notni;": "∌",
  "notniva;": "∌",
  "notnivb;": "⋾",
  "notnivc;": "⋽",
  "NotPrecedes;": "⊀",
  "NotPrecedesEqual;": "⪯̸",
  "NotPrecedesSlantEqual;": "⋠",
  "NotReverseElement;": "∌",
  "NotRightTriangle;": "⋫",
  "NotRightTriangleBar;": "⧐̸",
  "NotRightTriangleEqual;": "⋭",
  "NotSquareSubset;": "⊏̸",
  "NotSquareSubsetEqual;": "⋢",
  "NotSquareSuperset;": "⊐̸",
  "NotSquareSupersetEqual;": "⋣",
  "NotSubset;": "⊂⃒",
  "NotSubsetEqual;": "⊈",
  "NotSucceeds;": "⊁",
  "NotSucceedsEqual;": "⪰̸",
  "NotSucceedsSlantEqual;": "⋡",
  "NotSucceedsTilde;": "≿̸",
  "NotSuperset;": "⊃⃒",
  "NotSupersetEqual;": "⊉",
  "NotTilde;": "≁",
  "NotTildeEqual;": "≄",
  "NotTildeFullEqual;": "≇",
  "NotTildeTilde;": "≉",
  "NotVerticalBar;": "∤",
  "npar;": "∦",
  "nparallel;": "∦",
  "nparsl;": "⫽⃥",
  "npart;": "∂̸",
  "npolint;": "⨔",
  "npr;": "⊀",
  "nprcue;": "⋠",
  "npre;": "⪯̸",
  "nprec;": "⊀",
  "npreceq;": "⪯̸",
  "nrArr;": "⇏",
  "nrarr;": "↛",
  "nrarrc;": "⤳̸",
  "nrarrw;": "↝̸",
  "nRightarrow;": "⇏",
  "nrightarrow;": "↛",
  "nrtri;": "⋫",
  "nrtrie;": "⋭",
  "nsc;": "⊁",
  "nsccue;": "⋡",
  "nsce;": "⪰̸",
  "Nscr;": "𝒩",
  "nscr;": "𝓃",
  "nshortmid;": "∤",
  "nshortparallel;": "∦",
  "nsim;": "≁",
  "nsime;": "≄",
  "nsimeq;": "≄",
  "nsmid;": "∤",
  "nspar;": "∦",
  "nsqsube;": "⋢",
  "nsqsupe;": "⋣",
  "nsub;": "⊄",
  "nsubE;": "⫅̸",
  "nsube;": "⊈",
  "nsubset;": "⊂⃒",
  "nsubseteq;": "⊈",
  "nsubseteqq;": "⫅̸",
  "nsucc;": "⊁",
  "nsucceq;": "⪰̸",
  "nsup;": "⊅",
  "nsupE;": "⫆̸",
  "nsupe;": "⊉",
  "nsupset;": "⊃⃒",
  "nsupseteq;": "⊉",
  "nsupseteqq;": "⫆̸",
  "ntgl;": "≹",
  "Ntilde;": "Ñ",
  Ntilde: "Ñ",
  "ntilde;": "ñ",
  ntilde: "ñ",
  "ntlg;": "≸",
  "ntriangleleft;": "⋪",
  "ntrianglelefteq;": "⋬",
  "ntriangleright;": "⋫",
  "ntrianglerighteq;": "⋭",
  "Nu;": "Ν",
  "nu;": "ν",
  "num;": "#",
  "numero;": "№",
  "numsp;": " ",
  "nvap;": "≍⃒",
  "nVDash;": "⊯",
  "nVdash;": "⊮",
  "nvDash;": "⊭",
  "nvdash;": "⊬",
  "nvge;": "≥⃒",
  "nvgt;": ">⃒",
  "nvHarr;": "⤄",
  "nvinfin;": "⧞",
  "nvlArr;": "⤂",
  "nvle;": "≤⃒",
  "nvlt;": "<⃒",
  "nvltrie;": "⊴⃒",
  "nvrArr;": "⤃",
  "nvrtrie;": "⊵⃒",
  "nvsim;": "∼⃒",
  "nwarhk;": "⤣",
  "nwArr;": "⇖",
  "nwarr;": "↖",
  "nwarrow;": "↖",
  "nwnear;": "⤧",
  "Oacute;": "Ó",
  Oacute: "Ó",
  "oacute;": "ó",
  oacute: "ó",
  "oast;": "⊛",
  "ocir;": "⊚",
  "Ocirc;": "Ô",
  Ocirc: "Ô",
  "ocirc;": "ô",
  ocirc: "ô",
  "Ocy;": "О",
  "ocy;": "о",
  "odash;": "⊝",
  "Odblac;": "Ő",
  "odblac;": "ő",
  "odiv;": "⨸",
  "odot;": "⊙",
  "odsold;": "⦼",
  "OElig;": "Œ",
  "oelig;": "œ",
  "ofcir;": "⦿",
  "Ofr;": "𝔒",
  "ofr;": "𝔬",
  "ogon;": "˛",
  "Ograve;": "Ò",
  Ograve: "Ò",
  "ograve;": "ò",
  ograve: "ò",
  "ogt;": "⧁",
  "ohbar;": "⦵",
  "ohm;": "Ω",
  "oint;": "∮",
  "olarr;": "↺",
  "olcir;": "⦾",
  "olcross;": "⦻",
  "oline;": "‾",
  "olt;": "⧀",
  "Omacr;": "Ō",
  "omacr;": "ō",
  "Omega;": "Ω",
  "omega;": "ω",
  "Omicron;": "Ο",
  "omicron;": "ο",
  "omid;": "⦶",
  "ominus;": "⊖",
  "Oopf;": "𝕆",
  "oopf;": "𝕠",
  "opar;": "⦷",
  "OpenCurlyDoubleQuote;": "“",
  "OpenCurlyQuote;": "‘",
  "operp;": "⦹",
  "oplus;": "⊕",
  "Or;": "⩔",
  "or;": "∨",
  "orarr;": "↻",
  "ord;": "⩝",
  "order;": "ℴ",
  "orderof;": "ℴ",
  "ordf;": "ª",
  ordf: "ª",
  "ordm;": "º",
  ordm: "º",
  "origof;": "⊶",
  "oror;": "⩖",
  "orslope;": "⩗",
  "orv;": "⩛",
  "oS;": "Ⓢ",
  "Oscr;": "𝒪",
  "oscr;": "ℴ",
  "Oslash;": "Ø",
  Oslash: "Ø",
  "oslash;": "ø",
  oslash: "ø",
  "osol;": "⊘",
  "Otilde;": "Õ",
  Otilde: "Õ",
  "otilde;": "õ",
  otilde: "õ",
  "Otimes;": "⨷",
  "otimes;": "⊗",
  "otimesas;": "⨶",
  "Ouml;": "Ö",
  Ouml: "Ö",
  "ouml;": "ö",
  ouml: "ö",
  "ovbar;": "⌽",
  "OverBar;": "‾",
  "OverBrace;": "⏞",
  "OverBracket;": "⎴",
  "OverParenthesis;": "⏜",
  "par;": "∥",
  "para;": "¶",
  para: "¶",
  "parallel;": "∥",
  "parsim;": "⫳",
  "parsl;": "⫽",
  "part;": "∂",
  "PartialD;": "∂",
  "Pcy;": "П",
  "pcy;": "п",
  "percnt;": "%",
  "period;": ".",
  "permil;": "‰",
  "perp;": "⊥",
  "pertenk;": "‱",
  "Pfr;": "𝔓",
  "pfr;": "𝔭",
  "Phi;": "Φ",
  "phi;": "φ",
  "phiv;": "ϕ",
  "phmmat;": "ℳ",
  "phone;": "☎",
  "Pi;": "Π",
  "pi;": "π",
  "pitchfork;": "⋔",
  "piv;": "ϖ",
  "planck;": "ℏ",
  "planckh;": "ℎ",
  "plankv;": "ℏ",
  "plus;": "+",
  "plusacir;": "⨣",
  "plusb;": "⊞",
  "pluscir;": "⨢",
  "plusdo;": "∔",
  "plusdu;": "⨥",
  "pluse;": "⩲",
  "PlusMinus;": "±",
  "plusmn;": "±",
  plusmn: "±",
  "plussim;": "⨦",
  "plustwo;": "⨧",
  "pm;": "±",
  "Poincareplane;": "ℌ",
  "pointint;": "⨕",
  "Popf;": "ℙ",
  "popf;": "𝕡",
  "pound;": "£",
  pound: "£",
  "Pr;": "⪻",
  "pr;": "≺",
  "prap;": "⪷",
  "prcue;": "≼",
  "prE;": "⪳",
  "pre;": "⪯",
  "prec;": "≺",
  "precapprox;": "⪷",
  "preccurlyeq;": "≼",
  "Precedes;": "≺",
  "PrecedesEqual;": "⪯",
  "PrecedesSlantEqual;": "≼",
  "PrecedesTilde;": "≾",
  "preceq;": "⪯",
  "precnapprox;": "⪹",
  "precneqq;": "⪵",
  "precnsim;": "⋨",
  "precsim;": "≾",
  "Prime;": "″",
  "prime;": "′",
  "primes;": "ℙ",
  "prnap;": "⪹",
  "prnE;": "⪵",
  "prnsim;": "⋨",
  "prod;": "∏",
  "Product;": "∏",
  "profalar;": "⌮",
  "profline;": "⌒",
  "profsurf;": "⌓",
  "prop;": "∝",
  "Proportion;": "∷",
  "Proportional;": "∝",
  "propto;": "∝",
  "prsim;": "≾",
  "prurel;": "⊰",
  "Pscr;": "𝒫",
  "pscr;": "𝓅",
  "Psi;": "Ψ",
  "psi;": "ψ",
  "puncsp;": " ",
  "Qfr;": "𝔔",
  "qfr;": "𝔮",
  "qint;": "⨌",
  "Qopf;": "ℚ",
  "qopf;": "𝕢",
  "qprime;": "⁗",
  "Qscr;": "𝒬",
  "qscr;": "𝓆",
  "quaternions;": "ℍ",
  "quatint;": "⨖",
  "quest;": "?",
  "questeq;": "≟",
  "QUOT;": '"',
  QUOT: '"',
  "quot;": '"',
  quot: '"',
  "rAarr;": "⇛",
  "race;": "∽̱",
  "Racute;": "Ŕ",
  "racute;": "ŕ",
  "radic;": "√",
  "raemptyv;": "⦳",
  "Rang;": "⟫",
  "rang;": "⟩",
  "rangd;": "⦒",
  "range;": "⦥",
  "rangle;": "⟩",
  "raquo;": "»",
  raquo: "»",
  "Rarr;": "↠",
  "rArr;": "⇒",
  "rarr;": "→",
  "rarrap;": "⥵",
  "rarrb;": "⇥",
  "rarrbfs;": "⤠",
  "rarrc;": "⤳",
  "rarrfs;": "⤞",
  "rarrhk;": "↪",
  "rarrlp;": "↬",
  "rarrpl;": "⥅",
  "rarrsim;": "⥴",
  "Rarrtl;": "⤖",
  "rarrtl;": "↣",
  "rarrw;": "↝",
  "rAtail;": "⤜",
  "ratail;": "⤚",
  "ratio;": "∶",
  "rationals;": "ℚ",
  "RBarr;": "⤐",
  "rBarr;": "⤏",
  "rbarr;": "⤍",
  "rbbrk;": "❳",
  "rbrace;": "}",
  "rbrack;": "]",
  "rbrke;": "⦌",
  "rbrksld;": "⦎",
  "rbrkslu;": "⦐",
  "Rcaron;": "Ř",
  "rcaron;": "ř",
  "Rcedil;": "Ŗ",
  "rcedil;": "ŗ",
  "rceil;": "⌉",
  "rcub;": "}",
  "Rcy;": "Р",
  "rcy;": "р",
  "rdca;": "⤷",
  "rdldhar;": "⥩",
  "rdquo;": "”",
  "rdquor;": "”",
  "rdsh;": "↳",
  "Re;": "ℜ",
  "real;": "ℜ",
  "realine;": "ℛ",
  "realpart;": "ℜ",
  "reals;": "ℝ",
  "rect;": "▭",
  "REG;": "®",
  REG: "®",
  "reg;": "®",
  reg: "®",
  "ReverseElement;": "∋",
  "ReverseEquilibrium;": "⇋",
  "ReverseUpEquilibrium;": "⥯",
  "rfisht;": "⥽",
  "rfloor;": "⌋",
  "Rfr;": "ℜ",
  "rfr;": "𝔯",
  "rHar;": "⥤",
  "rhard;": "⇁",
  "rharu;": "⇀",
  "rharul;": "⥬",
  "Rho;": "Ρ",
  "rho;": "ρ",
  "rhov;": "ϱ",
  "RightAngleBracket;": "⟩",
  "RightArrow;": "→",
  "Rightarrow;": "⇒",
  "rightarrow;": "→",
  "RightArrowBar;": "⇥",
  "RightArrowLeftArrow;": "⇄",
  "rightarrowtail;": "↣",
  "RightCeiling;": "⌉",
  "RightDoubleBracket;": "⟧",
  "RightDownTeeVector;": "⥝",
  "RightDownVector;": "⇂",
  "RightDownVectorBar;": "⥕",
  "RightFloor;": "⌋",
  "rightharpoondown;": "⇁",
  "rightharpoonup;": "⇀",
  "rightleftarrows;": "⇄",
  "rightleftharpoons;": "⇌",
  "rightrightarrows;": "⇉",
  "rightsquigarrow;": "↝",
  "RightTee;": "⊢",
  "RightTeeArrow;": "↦",
  "RightTeeVector;": "⥛",
  "rightthreetimes;": "⋌",
  "RightTriangle;": "⊳",
  "RightTriangleBar;": "⧐",
  "RightTriangleEqual;": "⊵",
  "RightUpDownVector;": "⥏",
  "RightUpTeeVector;": "⥜",
  "RightUpVector;": "↾",
  "RightUpVectorBar;": "⥔",
  "RightVector;": "⇀",
  "RightVectorBar;": "⥓",
  "ring;": "˚",
  "risingdotseq;": "≓",
  "rlarr;": "⇄",
  "rlhar;": "⇌",
  "rlm;": "‏",
  "rmoust;": "⎱",
  "rmoustache;": "⎱",
  "rnmid;": "⫮",
  "roang;": "⟭",
  "roarr;": "⇾",
  "robrk;": "⟧",
  "ropar;": "⦆",
  "Ropf;": "ℝ",
  "ropf;": "𝕣",
  "roplus;": "⨮",
  "rotimes;": "⨵",
  "RoundImplies;": "⥰",
  "rpar;": ")",
  "rpargt;": "⦔",
  "rppolint;": "⨒",
  "rrarr;": "⇉",
  "Rrightarrow;": "⇛",
  "rsaquo;": "›",
  "Rscr;": "ℛ",
  "rscr;": "𝓇",
  "Rsh;": "↱",
  "rsh;": "↱",
  "rsqb;": "]",
  "rsquo;": "’",
  "rsquor;": "’",
  "rthree;": "⋌",
  "rtimes;": "⋊",
  "rtri;": "▹",
  "rtrie;": "⊵",
  "rtrif;": "▸",
  "rtriltri;": "⧎",
  "RuleDelayed;": "⧴",
  "ruluhar;": "⥨",
  "rx;": "℞",
  "Sacute;": "Ś",
  "sacute;": "ś",
  "sbquo;": "‚",
  "Sc;": "⪼",
  "sc;": "≻",
  "scap;": "⪸",
  "Scaron;": "Š",
  "scaron;": "š",
  "sccue;": "≽",
  "scE;": "⪴",
  "sce;": "⪰",
  "Scedil;": "Ş",
  "scedil;": "ş",
  "Scirc;": "Ŝ",
  "scirc;": "ŝ",
  "scnap;": "⪺",
  "scnE;": "⪶",
  "scnsim;": "⋩",
  "scpolint;": "⨓",
  "scsim;": "≿",
  "Scy;": "С",
  "scy;": "с",
  "sdot;": "⋅",
  "sdotb;": "⊡",
  "sdote;": "⩦",
  "searhk;": "⤥",
  "seArr;": "⇘",
  "searr;": "↘",
  "searrow;": "↘",
  "sect;": "§",
  sect: "§",
  "semi;": ";",
  "seswar;": "⤩",
  "setminus;": "∖",
  "setmn;": "∖",
  "sext;": "✶",
  "Sfr;": "𝔖",
  "sfr;": "𝔰",
  "sfrown;": "⌢",
  "sharp;": "♯",
  "SHCHcy;": "Щ",
  "shchcy;": "щ",
  "SHcy;": "Ш",
  "shcy;": "ш",
  "ShortDownArrow;": "↓",
  "ShortLeftArrow;": "←",
  "shortmid;": "∣",
  "shortparallel;": "∥",
  "ShortRightArrow;": "→",
  "ShortUpArrow;": "↑",
  "shy;": "­",
  shy: "­",
  "Sigma;": "Σ",
  "sigma;": "σ",
  "sigmaf;": "ς",
  "sigmav;": "ς",
  "sim;": "∼",
  "simdot;": "⩪",
  "sime;": "≃",
  "simeq;": "≃",
  "simg;": "⪞",
  "simgE;": "⪠",
  "siml;": "⪝",
  "simlE;": "⪟",
  "simne;": "≆",
  "simplus;": "⨤",
  "simrarr;": "⥲",
  "slarr;": "←",
  "SmallCircle;": "∘",
  "smallsetminus;": "∖",
  "smashp;": "⨳",
  "smeparsl;": "⧤",
  "smid;": "∣",
  "smile;": "⌣",
  "smt;": "⪪",
  "smte;": "⪬",
  "smtes;": "⪬︀",
  "SOFTcy;": "Ь",
  "softcy;": "ь",
  "sol;": "/",
  "solb;": "⧄",
  "solbar;": "⌿",
  "Sopf;": "𝕊",
  "sopf;": "𝕤",
  "spades;": "♠",
  "spadesuit;": "♠",
  "spar;": "∥",
  "sqcap;": "⊓",
  "sqcaps;": "⊓︀",
  "sqcup;": "⊔",
  "sqcups;": "⊔︀",
  "Sqrt;": "√",
  "sqsub;": "⊏",
  "sqsube;": "⊑",
  "sqsubset;": "⊏",
  "sqsubseteq;": "⊑",
  "sqsup;": "⊐",
  "sqsupe;": "⊒",
  "sqsupset;": "⊐",
  "sqsupseteq;": "⊒",
  "squ;": "□",
  "Square;": "□",
  "square;": "□",
  "SquareIntersection;": "⊓",
  "SquareSubset;": "⊏",
  "SquareSubsetEqual;": "⊑",
  "SquareSuperset;": "⊐",
  "SquareSupersetEqual;": "⊒",
  "SquareUnion;": "⊔",
  "squarf;": "▪",
  "squf;": "▪",
  "srarr;": "→",
  "Sscr;": "𝒮",
  "sscr;": "𝓈",
  "ssetmn;": "∖",
  "ssmile;": "⌣",
  "sstarf;": "⋆",
  "Star;": "⋆",
  "star;": "☆",
  "starf;": "★",
  "straightepsilon;": "ϵ",
  "straightphi;": "ϕ",
  "strns;": "¯",
  "Sub;": "⋐",
  "sub;": "⊂",
  "subdot;": "⪽",
  "subE;": "⫅",
  "sube;": "⊆",
  "subedot;": "⫃",
  "submult;": "⫁",
  "subnE;": "⫋",
  "subne;": "⊊",
  "subplus;": "⪿",
  "subrarr;": "⥹",
  "Subset;": "⋐",
  "subset;": "⊂",
  "subseteq;": "⊆",
  "subseteqq;": "⫅",
  "SubsetEqual;": "⊆",
  "subsetneq;": "⊊",
  "subsetneqq;": "⫋",
  "subsim;": "⫇",
  "subsub;": "⫕",
  "subsup;": "⫓",
  "succ;": "≻",
  "succapprox;": "⪸",
  "succcurlyeq;": "≽",
  "Succeeds;": "≻",
  "SucceedsEqual;": "⪰",
  "SucceedsSlantEqual;": "≽",
  "SucceedsTilde;": "≿",
  "succeq;": "⪰",
  "succnapprox;": "⪺",
  "succneqq;": "⪶",
  "succnsim;": "⋩",
  "succsim;": "≿",
  "SuchThat;": "∋",
  "Sum;": "∑",
  "sum;": "∑",
  "sung;": "♪",
  "Sup;": "⋑",
  "sup;": "⊃",
  "sup1;": "¹",
  sup1: "¹",
  "sup2;": "²",
  sup2: "²",
  "sup3;": "³",
  sup3: "³",
  "supdot;": "⪾",
  "supdsub;": "⫘",
  "supE;": "⫆",
  "supe;": "⊇",
  "supedot;": "⫄",
  "Superset;": "⊃",
  "SupersetEqual;": "⊇",
  "suphsol;": "⟉",
  "suphsub;": "⫗",
  "suplarr;": "⥻",
  "supmult;": "⫂",
  "supnE;": "⫌",
  "supne;": "⊋",
  "supplus;": "⫀",
  "Supset;": "⋑",
  "supset;": "⊃",
  "supseteq;": "⊇",
  "supseteqq;": "⫆",
  "supsetneq;": "⊋",
  "supsetneqq;": "⫌",
  "supsim;": "⫈",
  "supsub;": "⫔",
  "supsup;": "⫖",
  "swarhk;": "⤦",
  "swArr;": "⇙",
  "swarr;": "↙",
  "swarrow;": "↙",
  "swnwar;": "⤪",
  "szlig;": "ß",
  szlig: "ß",
  "Tab;": "	",
  "target;": "⌖",
  "Tau;": "Τ",
  "tau;": "τ",
  "tbrk;": "⎴",
  "Tcaron;": "Ť",
  "tcaron;": "ť",
  "Tcedil;": "Ţ",
  "tcedil;": "ţ",
  "Tcy;": "Т",
  "tcy;": "т",
  "tdot;": "⃛",
  "telrec;": "⌕",
  "Tfr;": "𝔗",
  "tfr;": "𝔱",
  "there4;": "∴",
  "Therefore;": "∴",
  "therefore;": "∴",
  "Theta;": "Θ",
  "theta;": "θ",
  "thetasym;": "ϑ",
  "thetav;": "ϑ",
  "thickapprox;": "≈",
  "thicksim;": "∼",
  "ThickSpace;": "  ",
  "thinsp;": " ",
  "ThinSpace;": " ",
  "thkap;": "≈",
  "thksim;": "∼",
  "THORN;": "Þ",
  THORN: "Þ",
  "thorn;": "þ",
  thorn: "þ",
  "Tilde;": "∼",
  "tilde;": "˜",
  "TildeEqual;": "≃",
  "TildeFullEqual;": "≅",
  "TildeTilde;": "≈",
  "times;": "×",
  times: "×",
  "timesb;": "⊠",
  "timesbar;": "⨱",
  "timesd;": "⨰",
  "tint;": "∭",
  "toea;": "⤨",
  "top;": "⊤",
  "topbot;": "⌶",
  "topcir;": "⫱",
  "Topf;": "𝕋",
  "topf;": "𝕥",
  "topfork;": "⫚",
  "tosa;": "⤩",
  "tprime;": "‴",
  "TRADE;": "™",
  "trade;": "™",
  "triangle;": "▵",
  "triangledown;": "▿",
  "triangleleft;": "◃",
  "trianglelefteq;": "⊴",
  "triangleq;": "≜",
  "triangleright;": "▹",
  "trianglerighteq;": "⊵",
  "tridot;": "◬",
  "trie;": "≜",
  "triminus;": "⨺",
  "TripleDot;": "⃛",
  "triplus;": "⨹",
  "trisb;": "⧍",
  "tritime;": "⨻",
  "trpezium;": "⏢",
  "Tscr;": "𝒯",
  "tscr;": "𝓉",
  "TScy;": "Ц",
  "tscy;": "ц",
  "TSHcy;": "Ћ",
  "tshcy;": "ћ",
  "Tstrok;": "Ŧ",
  "tstrok;": "ŧ",
  "twixt;": "≬",
  "twoheadleftarrow;": "↞",
  "twoheadrightarrow;": "↠",
  "Uacute;": "Ú",
  Uacute: "Ú",
  "uacute;": "ú",
  uacute: "ú",
  "Uarr;": "↟",
  "uArr;": "⇑",
  "uarr;": "↑",
  "Uarrocir;": "⥉",
  "Ubrcy;": "Ў",
  "ubrcy;": "ў",
  "Ubreve;": "Ŭ",
  "ubreve;": "ŭ",
  "Ucirc;": "Û",
  Ucirc: "Û",
  "ucirc;": "û",
  ucirc: "û",
  "Ucy;": "У",
  "ucy;": "у",
  "udarr;": "⇅",
  "Udblac;": "Ű",
  "udblac;": "ű",
  "udhar;": "⥮",
  "ufisht;": "⥾",
  "Ufr;": "𝔘",
  "ufr;": "𝔲",
  "Ugrave;": "Ù",
  Ugrave: "Ù",
  "ugrave;": "ù",
  ugrave: "ù",
  "uHar;": "⥣",
  "uharl;": "↿",
  "uharr;": "↾",
  "uhblk;": "▀",
  "ulcorn;": "⌜",
  "ulcorner;": "⌜",
  "ulcrop;": "⌏",
  "ultri;": "◸",
  "Umacr;": "Ū",
  "umacr;": "ū",
  "uml;": "¨",
  uml: "¨",
  "UnderBar;": "_",
  "UnderBrace;": "⏟",
  "UnderBracket;": "⎵",
  "UnderParenthesis;": "⏝",
  "Union;": "⋃",
  "UnionPlus;": "⊎",
  "Uogon;": "Ų",
  "uogon;": "ų",
  "Uopf;": "𝕌",
  "uopf;": "𝕦",
  "UpArrow;": "↑",
  "Uparrow;": "⇑",
  "uparrow;": "↑",
  "UpArrowBar;": "⤒",
  "UpArrowDownArrow;": "⇅",
  "UpDownArrow;": "↕",
  "Updownarrow;": "⇕",
  "updownarrow;": "↕",
  "UpEquilibrium;": "⥮",
  "upharpoonleft;": "↿",
  "upharpoonright;": "↾",
  "uplus;": "⊎",
  "UpperLeftArrow;": "↖",
  "UpperRightArrow;": "↗",
  "Upsi;": "ϒ",
  "upsi;": "υ",
  "upsih;": "ϒ",
  "Upsilon;": "Υ",
  "upsilon;": "υ",
  "UpTee;": "⊥",
  "UpTeeArrow;": "↥",
  "upuparrows;": "⇈",
  "urcorn;": "⌝",
  "urcorner;": "⌝",
  "urcrop;": "⌎",
  "Uring;": "Ů",
  "uring;": "ů",
  "urtri;": "◹",
  "Uscr;": "𝒰",
  "uscr;": "𝓊",
  "utdot;": "⋰",
  "Utilde;": "Ũ",
  "utilde;": "ũ",
  "utri;": "▵",
  "utrif;": "▴",
  "uuarr;": "⇈",
  "Uuml;": "Ü",
  Uuml: "Ü",
  "uuml;": "ü",
  uuml: "ü",
  "uwangle;": "⦧",
  "vangrt;": "⦜",
  "varepsilon;": "ϵ",
  "varkappa;": "ϰ",
  "varnothing;": "∅",
  "varphi;": "ϕ",
  "varpi;": "ϖ",
  "varpropto;": "∝",
  "vArr;": "⇕",
  "varr;": "↕",
  "varrho;": "ϱ",
  "varsigma;": "ς",
  "varsubsetneq;": "⊊︀",
  "varsubsetneqq;": "⫋︀",
  "varsupsetneq;": "⊋︀",
  "varsupsetneqq;": "⫌︀",
  "vartheta;": "ϑ",
  "vartriangleleft;": "⊲",
  "vartriangleright;": "⊳",
  "Vbar;": "⫫",
  "vBar;": "⫨",
  "vBarv;": "⫩",
  "Vcy;": "В",
  "vcy;": "в",
  "VDash;": "⊫",
  "Vdash;": "⊩",
  "vDash;": "⊨",
  "vdash;": "⊢",
  "Vdashl;": "⫦",
  "Vee;": "⋁",
  "vee;": "∨",
  "veebar;": "⊻",
  "veeeq;": "≚",
  "vellip;": "⋮",
  "Verbar;": "‖",
  "verbar;": "|",
  "Vert;": "‖",
  "vert;": "|",
  "VerticalBar;": "∣",
  "VerticalLine;": "|",
  "VerticalSeparator;": "❘",
  "VerticalTilde;": "≀",
  "VeryThinSpace;": " ",
  "Vfr;": "𝔙",
  "vfr;": "𝔳",
  "vltri;": "⊲",
  "vnsub;": "⊂⃒",
  "vnsup;": "⊃⃒",
  "Vopf;": "𝕍",
  "vopf;": "𝕧",
  "vprop;": "∝",
  "vrtri;": "⊳",
  "Vscr;": "𝒱",
  "vscr;": "𝓋",
  "vsubnE;": "⫋︀",
  "vsubne;": "⊊︀",
  "vsupnE;": "⫌︀",
  "vsupne;": "⊋︀",
  "Vvdash;": "⊪",
  "vzigzag;": "⦚",
  "Wcirc;": "Ŵ",
  "wcirc;": "ŵ",
  "wedbar;": "⩟",
  "Wedge;": "⋀",
  "wedge;": "∧",
  "wedgeq;": "≙",
  "weierp;": "℘",
  "Wfr;": "𝔚",
  "wfr;": "𝔴",
  "Wopf;": "𝕎",
  "wopf;": "𝕨",
  "wp;": "℘",
  "wr;": "≀",
  "wreath;": "≀",
  "Wscr;": "𝒲",
  "wscr;": "𝓌",
  "xcap;": "⋂",
  "xcirc;": "◯",
  "xcup;": "⋃",
  "xdtri;": "▽",
  "Xfr;": "𝔛",
  "xfr;": "𝔵",
  "xhArr;": "⟺",
  "xharr;": "⟷",
  "Xi;": "Ξ",
  "xi;": "ξ",
  "xlArr;": "⟸",
  "xlarr;": "⟵",
  "xmap;": "⟼",
  "xnis;": "⋻",
  "xodot;": "⨀",
  "Xopf;": "𝕏",
  "xopf;": "𝕩",
  "xoplus;": "⨁",
  "xotime;": "⨂",
  "xrArr;": "⟹",
  "xrarr;": "⟶",
  "Xscr;": "𝒳",
  "xscr;": "𝓍",
  "xsqcup;": "⨆",
  "xuplus;": "⨄",
  "xutri;": "△",
  "xvee;": "⋁",
  "xwedge;": "⋀",
  "Yacute;": "Ý",
  Yacute: "Ý",
  "yacute;": "ý",
  yacute: "ý",
  "YAcy;": "Я",
  "yacy;": "я",
  "Ycirc;": "Ŷ",
  "ycirc;": "ŷ",
  "Ycy;": "Ы",
  "ycy;": "ы",
  "yen;": "¥",
  yen: "¥",
  "Yfr;": "𝔜",
  "yfr;": "𝔶",
  "YIcy;": "Ї",
  "yicy;": "ї",
  "Yopf;": "𝕐",
  "yopf;": "𝕪",
  "Yscr;": "𝒴",
  "yscr;": "𝓎",
  "YUcy;": "Ю",
  "yucy;": "ю",
  "Yuml;": "Ÿ",
  "yuml;": "ÿ",
  yuml: "ÿ",
  "Zacute;": "Ź",
  "zacute;": "ź",
  "Zcaron;": "Ž",
  "zcaron;": "ž",
  "Zcy;": "З",
  "zcy;": "з",
  "Zdot;": "Ż",
  "zdot;": "ż",
  "zeetrf;": "ℨ",
  "ZeroWidthSpace;": "​",
  "Zeta;": "Ζ",
  "zeta;": "ζ",
  "Zfr;": "ℨ",
  "zfr;": "𝔷",
  "ZHcy;": "Ж",
  "zhcy;": "ж",
  "zigrarr;": "⇝",
  "Zopf;": "ℤ",
  "zopf;": "𝕫",
  "Zscr;": "𝒵",
  "zscr;": "𝓏",
  "zwj;": "‍",
  "zwnj;": "‌"
};
function Ye(e, t) {
  if (e.length < t.length)
    return !1;
  for (var n = 0; n < t.length; n++)
    if (e[n] !== t[n])
      return !1;
  return !0;
}
function Bl(e, t) {
  var n = e.length - t.length;
  return n > 0 ? e.lastIndexOf(t) === n : n === 0 ? e === t : !1;
}
function _a(e, t) {
  for (var n = ""; t > 0; )
    (t & 1) === 1 && (n += e), e += e, t = t >>> 1;
  return n;
}
var Pl = "a".charCodeAt(0), ql = "z".charCodeAt(0), Ol = "A".charCodeAt(0), Vl = "Z".charCodeAt(0), jl = "0".charCodeAt(0), Gl = "9".charCodeAt(0);
function kt(e, t) {
  var n = e.charCodeAt(t);
  return Pl <= n && n <= ql || Ol <= n && n <= Vl || jl <= n && n <= Gl;
}
function bn(e) {
  return typeof e < "u";
}
function $l(e) {
  if (e)
    return typeof e == "string" ? {
      kind: "markdown",
      value: e
    } : {
      kind: "markdown",
      value: e.value
    };
}
var Za = function() {
  function e(t, n) {
    var i = this;
    this.id = t, this._tags = [], this._tagMap = {}, this._valueSetMap = {}, this._tags = n.tags || [], this._globalAttributes = n.globalAttributes || [], this._tags.forEach(function(r) {
      i._tagMap[r.name.toLowerCase()] = r;
    }), n.valueSets && n.valueSets.forEach(function(r) {
      i._valueSetMap[r.name] = r.values;
    });
  }
  return e.prototype.isApplicable = function() {
    return !0;
  }, e.prototype.getId = function() {
    return this.id;
  }, e.prototype.provideTags = function() {
    return this._tags;
  }, e.prototype.provideAttributes = function(t) {
    var n = [], i = function(a) {
      n.push(a);
    }, r = this._tagMap[t.toLowerCase()];
    return r && r.attributes.forEach(i), this._globalAttributes.forEach(i), n;
  }, e.prototype.provideValues = function(t, n) {
    var i = this, r = [];
    n = n.toLowerCase();
    var a = function(l) {
      l.forEach(function(o) {
        o.name.toLowerCase() === n && (o.values && o.values.forEach(function(u) {
          r.push(u);
        }), o.valueSet && i._valueSetMap[o.valueSet] && i._valueSetMap[o.valueSet].forEach(function(u) {
          r.push(u);
        }));
      });
    }, s = this._tagMap[t.toLowerCase()];
    return s && a(s.attributes), a(this._globalAttributes), r;
  }, e;
}();
function nt(e, t, n) {
  t === void 0 && (t = {});
  var i = {
    kind: n ? "markdown" : "plaintext",
    value: ""
  };
  if (e.description && t.documentation !== !1) {
    var r = $l(e.description);
    r && (i.value += r.value);
  }
  if (e.references && e.references.length > 0 && t.references !== !1 && (i.value.length && (i.value += `

`), n ? i.value += e.references.map(function(a) {
    return "[".concat(a.name, "](").concat(a.url, ")");
  }).join(" | ") : i.value += e.references.map(function(a) {
    return "".concat(a.name, ": ").concat(a.url);
  }).join(`
`)), i.value !== "")
    return i;
}
var wa = function(e, t, n, i) {
  function r(a) {
    return a instanceof n ? a : new n(function(s) {
      s(a);
    });
  }
  return new (n || (n = Promise))(function(a, s) {
    function l(c) {
      try {
        u(i.next(c));
      } catch (h) {
        s(h);
      }
    }
    function o(c) {
      try {
        u(i.throw(c));
      } catch (h) {
        s(h);
      }
    }
    function u(c) {
      c.done ? a(c.value) : r(c.value).then(l, o);
    }
    u((i = i.apply(e, t || [])).next());
  });
}, ya = function(e, t) {
  var n = { label: 0, sent: function() {
    if (a[0] & 1)
      throw a[1];
    return a[1];
  }, trys: [], ops: [] }, i, r, a, s;
  return s = { next: l(0), throw: l(1), return: l(2) }, typeof Symbol == "function" && (s[Symbol.iterator] = function() {
    return this;
  }), s;
  function l(u) {
    return function(c) {
      return o([u, c]);
    };
  }
  function o(u) {
    if (i)
      throw new TypeError("Generator is already executing.");
    for (; n; )
      try {
        if (i = 1, r && (a = u[0] & 2 ? r.return : u[0] ? r.throw || ((a = r.return) && a.call(r), 0) : r.next) && !(a = a.call(r, u[1])).done)
          return a;
        switch (r = 0, a && (u = [u[0] & 2, a.value]), u[0]) {
          case 0:
          case 1:
            a = u;
            break;
          case 4:
            return n.label++, { value: u[1], done: !1 };
          case 5:
            n.label++, r = u[1], u = [0];
            continue;
          case 7:
            u = n.ops.pop(), n.trys.pop();
            continue;
          default:
            if (a = n.trys, !(a = a.length > 0 && a[a.length - 1]) && (u[0] === 6 || u[0] === 2)) {
              n = 0;
              continue;
            }
            if (u[0] === 3 && (!a || u[1] > a[0] && u[1] < a[3])) {
              n.label = u[1];
              break;
            }
            if (u[0] === 6 && n.label < a[1]) {
              n.label = a[1], a = u;
              break;
            }
            if (a && n.label < a[2]) {
              n.label = a[2], n.ops.push(u);
              break;
            }
            a[2] && n.ops.pop(), n.trys.pop();
            continue;
        }
        u = t.call(e, n);
      } catch (c) {
        u = [6, c], r = 0;
      } finally {
        i = a = 0;
      }
    if (u[0] & 5)
      throw u[1];
    return { value: u[0] ? u[1] : void 0, done: !0 };
  }
}, Xl = function() {
  function e(t) {
    this.readDirectory = t, this.atributeCompletions = [];
  }
  return e.prototype.onHtmlAttributeValue = function(t) {
    Zl(t.tag, t.attribute) && this.atributeCompletions.push(t);
  }, e.prototype.computeCompletions = function(t, n) {
    return wa(this, void 0, void 0, function() {
      var i, r, a, s, l, o, u, c, h, m;
      return ya(this, function(f) {
        switch (f.label) {
          case 0:
            i = { items: [], isIncomplete: !1 }, r = 0, a = this.atributeCompletions, f.label = 1;
          case 1:
            return r < a.length ? (s = a[r], l = Ql(t.getText(s.range)), Yl(l) ? l === "." || l === ".." ? (i.isIncomplete = !0, [3, 4]) : [3, 2] : [3, 4]) : [3, 5];
          case 2:
            return o = Kl(s.value, l, s.range), [4, this.providePathSuggestions(s.value, o, t, n)];
          case 3:
            for (u = f.sent(), c = 0, h = u; c < h.length; c++)
              m = h[c], i.items.push(m);
            f.label = 4;
          case 4:
            return r++, [3, 1];
          case 5:
            return [2, i];
        }
      });
    });
  }, e.prototype.providePathSuggestions = function(t, n, i, r) {
    return wa(this, void 0, void 0, function() {
      var a, s, l, o, u, c, h, m, f;
      return ya(this, function(g) {
        switch (g.label) {
          case 0:
            if (a = t.substring(0, t.lastIndexOf("/") + 1), s = r.resolveReference(a || ".", i.uri), !s)
              return [3, 4];
            g.label = 1;
          case 1:
            return g.trys.push([1, 3, , 4]), l = [], [4, this.readDirectory(s)];
          case 2:
            for (o = g.sent(), u = 0, c = o; u < c.length; u++)
              h = c[u], m = h[0], f = h[1], m.charCodeAt(0) !== Jl && l.push(eu(m, f === ai.Directory, n));
            return [2, l];
          case 3:
            return g.sent(), [3, 4];
          case 4:
            return [2, []];
        }
      });
    });
  }, e;
}(), Jl = ".".charCodeAt(0);
function Ql(e) {
  return Ye(e, "'") || Ye(e, '"') ? e.slice(1, -1) : e;
}
function Yl(e) {
  return !(Ye(e, "http") || Ye(e, "https") || Ye(e, "//"));
}
function Zl(e, t) {
  if (t === "src" || t === "href")
    return !0;
  var n = nu[e];
  return n ? typeof n == "string" ? n === t : n.indexOf(t) !== -1 : !1;
}
function Kl(e, t, n) {
  var i, r = e.lastIndexOf("/");
  if (r === -1)
    i = tu(n, 1, -1);
  else {
    var a = t.slice(r + 1), s = Lt(n.end, -1 - a.length), l = a.indexOf(" "), o = void 0;
    l !== -1 ? o = Lt(s, l) : o = Lt(n.end, -1), i = Y.create(s, o);
  }
  return i;
}
function eu(e, t, n) {
  return t ? (e = e + "/", {
    label: e,
    kind: ge.Folder,
    textEdit: ae.replace(n, e),
    command: {
      title: "Suggest",
      command: "editor.action.triggerSuggest"
    }
  }) : {
    label: e,
    kind: ge.File,
    textEdit: ae.replace(n, e)
  };
}
function Lt(e, t) {
  return ce.create(e.line, e.character + t);
}
function tu(e, t, n) {
  var i = Lt(e.start, t), r = Lt(e.end, n);
  return Y.create(i, r);
}
var nu = {
  a: "href",
  area: "href",
  body: "background",
  del: "cite",
  form: "action",
  frame: ["src", "longdesc"],
  img: ["src", "longdesc"],
  ins: "cite",
  link: "href",
  object: "data",
  q: "cite",
  script: "src",
  audio: "src",
  button: "formaction",
  command: "icon",
  embed: "src",
  html: "manifest",
  input: ["src", "formaction"],
  source: "src",
  track: "src",
  video: ["src", "poster"]
}, iu = function(e, t, n, i) {
  function r(a) {
    return a instanceof n ? a : new n(function(s) {
      s(a);
    });
  }
  return new (n || (n = Promise))(function(a, s) {
    function l(c) {
      try {
        u(i.next(c));
      } catch (h) {
        s(h);
      }
    }
    function o(c) {
      try {
        u(i.throw(c));
      } catch (h) {
        s(h);
      }
    }
    function u(c) {
      c.done ? a(c.value) : r(c.value).then(l, o);
    }
    u((i = i.apply(e, t || [])).next());
  });
}, ru = function(e, t) {
  var n = { label: 0, sent: function() {
    if (a[0] & 1)
      throw a[1];
    return a[1];
  }, trys: [], ops: [] }, i, r, a, s;
  return s = { next: l(0), throw: l(1), return: l(2) }, typeof Symbol == "function" && (s[Symbol.iterator] = function() {
    return this;
  }), s;
  function l(u) {
    return function(c) {
      return o([u, c]);
    };
  }
  function o(u) {
    if (i)
      throw new TypeError("Generator is already executing.");
    for (; n; )
      try {
        if (i = 1, r && (a = u[0] & 2 ? r.return : u[0] ? r.throw || ((a = r.return) && a.call(r), 0) : r.next) && !(a = a.call(r, u[1])).done)
          return a;
        switch (r = 0, a && (u = [u[0] & 2, a.value]), u[0]) {
          case 0:
          case 1:
            a = u;
            break;
          case 4:
            return n.label++, { value: u[1], done: !1 };
          case 5:
            n.label++, r = u[1], u = [0];
            continue;
          case 7:
            u = n.ops.pop(), n.trys.pop();
            continue;
          default:
            if (a = n.trys, !(a = a.length > 0 && a[a.length - 1]) && (u[0] === 6 || u[0] === 2)) {
              n = 0;
              continue;
            }
            if (u[0] === 3 && (!a || u[1] > a[0] && u[1] < a[3])) {
              n.label = u[1];
              break;
            }
            if (u[0] === 6 && n.label < a[1]) {
              n.label = a[1], a = u;
              break;
            }
            if (a && n.label < a[2]) {
              n.label = a[2], n.ops.push(u);
              break;
            }
            a[2] && n.ops.pop(), n.trys.pop();
            continue;
        }
        u = t.call(e, n);
      } catch (c) {
        u = [6, c], r = 0;
      } finally {
        i = a = 0;
      }
    if (u[0] & 5)
      throw u[1];
    return { value: u[0] ? u[1] : void 0, done: !0 };
  }
}, au = mi(), su = function() {
  function e(t, n) {
    this.lsOptions = t, this.dataManager = n, this.completionParticipants = [];
  }
  return e.prototype.setCompletionParticipants = function(t) {
    this.completionParticipants = t || [];
  }, e.prototype.doComplete2 = function(t, n, i, r, a) {
    return iu(this, void 0, void 0, function() {
      var s, l, o, u;
      return ru(this, function(c) {
        switch (c.label) {
          case 0:
            if (!this.lsOptions.fileSystemProvider || !this.lsOptions.fileSystemProvider.readDirectory)
              return [2, this.doComplete(t, n, i, a)];
            s = new Xl(this.lsOptions.fileSystemProvider.readDirectory), l = this.completionParticipants, this.completionParticipants = [s].concat(l), o = this.doComplete(t, n, i, a), c.label = 1;
          case 1:
            return c.trys.push([1, , 3, 4]), [4, s.computeCompletions(t, r)];
          case 2:
            return u = c.sent(), [2, {
              isIncomplete: o.isIncomplete || u.isIncomplete,
              items: u.items.concat(o.items)
            }];
          case 3:
            return this.completionParticipants = l, [7];
          case 4:
            return [2];
        }
      });
    });
  }, e.prototype.doComplete = function(t, n, i, r) {
    var a = this._doComplete(t, n, i, r);
    return this.convertCompletionList(a);
  }, e.prototype._doComplete = function(t, n, i, r) {
    var a = {
      isIncomplete: !1,
      items: []
    }, s = this.completionParticipants, l = this.dataManager.getDataProviders().filter(function(N) {
      return N.isApplicable(t.languageId) && (!r || r[N.getId()] !== !1);
    }), o = this.doesSupportMarkdown(), u = t.getText(), c = t.offsetAt(n), h = i.findNodeBefore(c);
    if (!h)
      return a;
    var m = ye(u, h.start), f = "", g;
    function p(N, z) {
      return z === void 0 && (z = c), N > c && (N = c), { start: t.positionAt(N), end: t.positionAt(z) };
    }
    function w(N, z) {
      var P = p(N, z);
      return l.forEach(function(J) {
        J.provideTags().forEach(function($) {
          a.items.push({
            label: $.name,
            kind: ge.Property,
            documentation: nt($, void 0, o),
            textEdit: ae.replace(P, $.name),
            insertTextFormat: Se.PlainText
          });
        });
      }), a;
    }
    function y(N) {
      for (var z = N; z > 0; ) {
        var P = u.charAt(z - 1);
        if (`
\r`.indexOf(P) >= 0)
          return u.substring(z, N);
        if (!vn(P))
          return null;
        z--;
      }
      return u.substring(0, N);
    }
    function v(N, z, P) {
      P === void 0 && (P = c);
      var J = p(N, P), $ = Ta(u, P, V.WithinEndTag, W.EndTagClose) ? "" : ">", X = h;
      for (z && (X = X.parent); X; ) {
        var Z = X.tag;
        if (Z && (!X.closed || X.endTagStart && X.endTagStart > c)) {
          var me = {
            label: "/" + Z,
            kind: ge.Property,
            filterText: "/" + Z,
            textEdit: ae.replace(J, "/" + Z + $),
            insertTextFormat: Se.PlainText
          }, Re = y(X.start), Fe = y(N - 1);
          if (Re !== null && Fe !== null && Re !== Fe) {
            var ve = Re + "</" + Z + $;
            me.textEdit = ae.replace(p(N - 1 - Fe.length), ve), me.filterText = Fe + "</" + Z;
          }
          return a.items.push(me), a;
        }
        X = X.parent;
      }
      return z || l.forEach(function(et) {
        et.provideTags().forEach(function(ke) {
          a.items.push({
            label: "/" + ke.name,
            kind: ge.Property,
            documentation: nt(ke, void 0, o),
            filterText: "/" + ke.name + $,
            textEdit: ae.replace(J, "/" + ke.name + $),
            insertTextFormat: Se.PlainText
          });
        });
      }), a;
    }
    function x(N, z) {
      if (r && r.hideAutoCompleteProposals)
        return a;
      if (!gn(z)) {
        var P = t.positionAt(N);
        a.items.push({
          label: "</" + z + ">",
          kind: ge.Property,
          filterText: "</" + z + ">",
          textEdit: ae.insert(P, "$0</" + z + ">"),
          insertTextFormat: Se.Snippet
        });
      }
      return a;
    }
    function E(N, z) {
      return w(N, z), v(N, !0, z), a;
    }
    function I() {
      var N = /* @__PURE__ */ Object.create(null);
      return h.attributeNames.forEach(function(z) {
        N[z] = !0;
      }), N;
    }
    function B(N, z) {
      var P;
      z === void 0 && (z = c);
      for (var J = c; J < z && u[J] !== "<"; )
        J++;
      var $ = u.substring(N, z), X = p(N, J), Z = "";
      if (!Ta(u, z, V.AfterAttributeName, W.DelimiterAssign)) {
        var me = (P = r == null ? void 0 : r.attributeDefaultValue) !== null && P !== void 0 ? P : "doublequotes";
        me === "empty" ? Z = "=$1" : me === "singlequotes" ? Z = "='$1'" : Z = '="$1"';
      }
      var Re = I();
      return Re[$] = !1, l.forEach(function(Fe) {
        Fe.provideAttributes(f).forEach(function(ve) {
          if (!Re[ve.name]) {
            Re[ve.name] = !0;
            var et = ve.name, ke;
            ve.valueSet !== "v" && Z.length && (et = et + Z, (ve.valueSet || ve.name === "style") && (ke = {
              title: "Suggest",
              command: "editor.action.triggerSuggest"
            })), a.items.push({
              label: ve.name,
              kind: ve.valueSet === "handler" ? ge.Function : ge.Value,
              documentation: nt(ve, void 0, o),
              textEdit: ae.replace(X, et),
              insertTextFormat: Se.Snippet,
              command: ke
            });
          }
        });
      }), _(X, Re), a;
    }
    function _(N, z) {
      var P = "data-", J = {};
      J[P] = "".concat(P, '$1="$2"');
      function $(X) {
        X.attributeNames.forEach(function(Z) {
          Ye(Z, P) && !J[Z] && !z[Z] && (J[Z] = Z + '="$1"');
        }), X.children.forEach(function(Z) {
          return $(Z);
        });
      }
      i && i.roots.forEach(function(X) {
        return $(X);
      }), Object.keys(J).forEach(function(X) {
        return a.items.push({
          label: X,
          kind: ge.Value,
          textEdit: ae.replace(N, J[X]),
          insertTextFormat: Se.Snippet
        });
      });
    }
    function b(N, z) {
      z === void 0 && (z = c);
      var P, J, $;
      if (c > N && c <= z && ou(u[N])) {
        var X = N + 1, Z = z;
        z > N && u[z - 1] === u[N] && Z--;
        var me = lu(u, c, X), Re = uu(u, c, Z);
        P = p(me, Re), $ = c >= X && c <= Z ? u.substring(X, c) : "", J = !1;
      } else
        P = p(N, z), $ = u.substring(N, c), J = !0;
      if (s.length > 0)
        for (var Fe = f.toLowerCase(), ve = g.toLowerCase(), et = p(N, z), ke = 0, fi = s; ke < fi.length; ke++) {
          var pi = fi[ke];
          pi.onHtmlAttributeValue && pi.onHtmlAttributeValue({ document: t, position: n, tag: Fe, attribute: ve, value: $, range: et });
        }
      return l.forEach(function(is) {
        is.provideValues(f, g).forEach(function(Pt) {
          var gi = J ? '"' + Pt.name + '"' : Pt.name;
          a.items.push({
            label: Pt.name,
            filterText: gi,
            kind: ge.Unit,
            documentation: nt(Pt, void 0, o),
            textEdit: ae.replace(P, gi),
            insertTextFormat: Se.PlainText
          });
        });
      }), F(), a;
    }
    function T(N) {
      return c === m.getTokenEnd() && (L = m.scan(), L === N && m.getTokenOffset() === c) ? m.getTokenEnd() : c;
    }
    function q() {
      for (var N = 0, z = s; N < z.length; N++) {
        var P = z[N];
        P.onHtmlContent && P.onHtmlContent({ document: t, position: n });
      }
      return F();
    }
    function F() {
      for (var N = c - 1, z = n.character; N >= 0 && kt(u, N); )
        N--, z--;
      if (N >= 0 && u[N] === "&") {
        var P = Y.create(ce.create(n.line, z - 1), n);
        for (var J in St)
          if (Bl(J, ";")) {
            var $ = "&" + J;
            a.items.push({
              label: $,
              kind: ge.Keyword,
              documentation: au("entity.propose", "Character entity representing '".concat(St[J], "'")),
              textEdit: ae.replace(P, $),
              insertTextFormat: Se.PlainText
            });
          }
      }
      return a;
    }
    function S(N, z) {
      var P = p(N, z);
      a.items.push({
        label: "!DOCTYPE",
        kind: ge.Property,
        documentation: "A preamble for an HTML document.",
        textEdit: ae.replace(P, "!DOCTYPE html>"),
        insertTextFormat: Se.PlainText
      });
    }
    for (var L = m.scan(); L !== W.EOS && m.getTokenOffset() <= c; ) {
      switch (L) {
        case W.StartTagOpen:
          if (m.getTokenEnd() === c) {
            var M = T(W.StartTag);
            return n.line === 0 && S(c, M), E(c, M);
          }
          break;
        case W.StartTag:
          if (m.getTokenOffset() <= c && c <= m.getTokenEnd())
            return w(m.getTokenOffset(), m.getTokenEnd());
          f = m.getTokenText();
          break;
        case W.AttributeName:
          if (m.getTokenOffset() <= c && c <= m.getTokenEnd())
            return B(m.getTokenOffset(), m.getTokenEnd());
          g = m.getTokenText();
          break;
        case W.DelimiterAssign:
          if (m.getTokenEnd() === c) {
            var M = T(W.AttributeValue);
            return b(c, M);
          }
          break;
        case W.AttributeValue:
          if (m.getTokenOffset() <= c && c <= m.getTokenEnd())
            return b(m.getTokenOffset(), m.getTokenEnd());
          break;
        case W.Whitespace:
          if (c <= m.getTokenEnd())
            switch (m.getScannerState()) {
              case V.AfterOpeningStartTag:
                var D = m.getTokenOffset(), H = T(W.StartTag);
                return E(D, H);
              case V.WithinTag:
              case V.AfterAttributeName:
                return B(m.getTokenEnd());
              case V.BeforeAttributeValue:
                return b(m.getTokenEnd());
              case V.AfterOpeningEndTag:
                return v(m.getTokenOffset() - 1, !1);
              case V.WithinContent:
                return q();
            }
          break;
        case W.EndTagOpen:
          if (c <= m.getTokenEnd()) {
            var A = m.getTokenOffset() + 1, k = T(W.EndTag);
            return v(A, !1, k);
          }
          break;
        case W.EndTag:
          if (c <= m.getTokenEnd())
            for (var R = m.getTokenOffset() - 1; R >= 0; ) {
              var U = u.charAt(R);
              if (U === "/")
                return v(R, !1, m.getTokenEnd());
              if (!vn(U))
                break;
              R--;
            }
          break;
        case W.StartTagClose:
          if (c <= m.getTokenEnd() && f)
            return x(m.getTokenEnd(), f);
          break;
        case W.Content:
          if (c <= m.getTokenEnd())
            return q();
          break;
        default:
          if (c <= m.getTokenEnd())
            return a;
          break;
      }
      L = m.scan();
    }
    return a;
  }, e.prototype.doQuoteComplete = function(t, n, i, r) {
    var a, s = t.offsetAt(n);
    if (s <= 0)
      return null;
    var l = (a = r == null ? void 0 : r.attributeDefaultValue) !== null && a !== void 0 ? a : "doublequotes";
    if (l === "empty")
      return null;
    var o = t.getText().charAt(s - 1);
    if (o !== "=")
      return null;
    var u = l === "doublequotes" ? '"$1"' : "'$1'", c = i.findNodeBefore(s);
    if (c && c.attributes && c.start < s && (!c.endTagStart || c.endTagStart > s))
      for (var h = ye(t.getText(), c.start), m = h.scan(); m !== W.EOS && h.getTokenEnd() <= s; ) {
        if (m === W.AttributeName && h.getTokenEnd() === s - 1)
          return m = h.scan(), m !== W.DelimiterAssign || (m = h.scan(), m === W.Unknown || m === W.AttributeValue) ? null : u;
        m = h.scan();
      }
    return null;
  }, e.prototype.doTagComplete = function(t, n, i) {
    var r = t.offsetAt(n);
    if (r <= 0)
      return null;
    var a = t.getText().charAt(r - 1);
    if (a === ">") {
      var s = i.findNodeBefore(r);
      if (s && s.tag && !gn(s.tag) && s.start < r && (!s.endTagStart || s.endTagStart > r))
        for (var l = ye(t.getText(), s.start), o = l.scan(); o !== W.EOS && l.getTokenEnd() <= r; ) {
          if (o === W.StartTagClose && l.getTokenEnd() === r)
            return "$0</".concat(s.tag, ">");
          o = l.scan();
        }
    } else if (a === "/") {
      for (var s = i.findNodeBefore(r); s && s.closed && !(s.endTagStart && s.endTagStart > r); )
        s = s.parent;
      if (s && s.tag)
        for (var l = ye(t.getText(), s.start), o = l.scan(); o !== W.EOS && l.getTokenEnd() <= r; ) {
          if (o === W.EndTagOpen && l.getTokenEnd() === r)
            return "".concat(s.tag, ">");
          o = l.scan();
        }
    }
    return null;
  }, e.prototype.convertCompletionList = function(t) {
    return this.doesSupportMarkdown() || t.items.forEach(function(n) {
      n.documentation && typeof n.documentation != "string" && (n.documentation = {
        kind: "plaintext",
        value: n.documentation.value
      });
    }), t;
  }, e.prototype.doesSupportMarkdown = function() {
    var t, n, i;
    if (!bn(this.supportsMarkdown)) {
      if (!bn(this.lsOptions.clientCapabilities))
        return this.supportsMarkdown = !0, this.supportsMarkdown;
      var r = (i = (n = (t = this.lsOptions.clientCapabilities.textDocument) === null || t === void 0 ? void 0 : t.completion) === null || n === void 0 ? void 0 : n.completionItem) === null || i === void 0 ? void 0 : i.documentationFormat;
      this.supportsMarkdown = Array.isArray(r) && r.indexOf(Ee.Markdown) !== -1;
    }
    return this.supportsMarkdown;
  }, e;
}();
function ou(e) {
  return /^["']*$/.test(e);
}
function vn(e) {
  return /^\s*$/.test(e);
}
function Ta(e, t, n, i) {
  for (var r = ye(e, t, n), a = r.scan(); a === W.Whitespace; )
    a = r.scan();
  return a === i;
}
function lu(e, t, n) {
  for (; t > n && !vn(e[t - 1]); )
    t--;
  return t;
}
function uu(e, t, n) {
  for (; t < n && !vn(e[t]); )
    t++;
  return t;
}
var cu = mi(), hu = function() {
  function e(t, n) {
    this.lsOptions = t, this.dataManager = n;
  }
  return e.prototype.doHover = function(t, n, i, r) {
    var a = this.convertContents.bind(this), s = this.doesSupportMarkdown(), l = t.offsetAt(n), o = i.findNodeAt(l), u = t.getText();
    if (!o || !o.tag)
      return null;
    var c = this.dataManager.getDataProviders().filter(function(S) {
      return S.isApplicable(t.languageId);
    });
    function h(S, L, M) {
      for (var D = function(U) {
        var N = null;
        if (U.provideTags().forEach(function(z) {
          if (z.name.toLowerCase() === S.toLowerCase()) {
            var P = nt(z, r, s);
            P || (P = {
              kind: s ? "markdown" : "plaintext",
              value: ""
            }), N = { contents: P, range: L };
          }
        }), N)
          return N.contents = a(N.contents), { value: N };
      }, H = 0, A = c; H < A.length; H++) {
        var k = A[H], R = D(k);
        if (typeof R == "object")
          return R.value;
      }
      return null;
    }
    function m(S, L, M) {
      for (var D = function(U) {
        var N = null;
        if (U.provideAttributes(S).forEach(function(z) {
          if (L === z.name && z.description) {
            var P = nt(z, r, s);
            P ? N = { contents: P, range: M } : N = null;
          }
        }), N)
          return N.contents = a(N.contents), { value: N };
      }, H = 0, A = c; H < A.length; H++) {
        var k = A[H], R = D(k);
        if (typeof R == "object")
          return R.value;
      }
      return null;
    }
    function f(S, L, M, D) {
      for (var H = function(N) {
        var z = null;
        if (N.provideValues(S, L).forEach(function(P) {
          if (M === P.name && P.description) {
            var J = nt(P, r, s);
            J ? z = { contents: J, range: D } : z = null;
          }
        }), z)
          return z.contents = a(z.contents), { value: z };
      }, A = 0, k = c; A < k.length; A++) {
        var R = k[A], U = H(R);
        if (typeof U == "object")
          return U.value;
      }
      return null;
    }
    function g(S, L) {
      var M = y(S);
      for (var D in St) {
        var H = null, A = "&" + D;
        if (M === A) {
          var k = St[D].charCodeAt(0).toString(16).toUpperCase(), R = "U+";
          if (k.length < 4)
            for (var U = 4 - k.length, N = 0; N < U; )
              R += "0", N += 1;
          R += k;
          var z = cu("entity.propose", "Character entity representing '".concat(St[D], "', unicode equivalent '").concat(R, "'"));
          z ? H = { contents: z, range: L } : H = null;
        }
        if (H)
          return H.contents = a(H.contents), H;
      }
      return null;
    }
    function p(S, L) {
      for (var M = ye(t.getText(), L), D = M.scan(); D !== W.EOS && (M.getTokenEnd() < l || M.getTokenEnd() === l && D !== S); )
        D = M.scan();
      return D === S && l <= M.getTokenEnd() ? { start: t.positionAt(M.getTokenOffset()), end: t.positionAt(M.getTokenEnd()) } : null;
    }
    function w() {
      for (var S = l - 1, L = n.character; S >= 0 && kt(u, S); )
        S--, L--;
      for (var M = S + 1, D = L; kt(u, M); )
        M++, D++;
      if (S >= 0 && u[S] === "&") {
        var H = null;
        return u[M] === ";" ? H = Y.create(ce.create(n.line, L), ce.create(n.line, D + 1)) : H = Y.create(ce.create(n.line, L), ce.create(n.line, D)), H;
      }
      return null;
    }
    function y(S) {
      for (var L = l - 1, M = "&"; L >= 0 && kt(S, L); )
        L--;
      for (L = L + 1; kt(S, L); )
        M += S[L], L += 1;
      return M += ";", M;
    }
    if (o.endTagStart && l >= o.endTagStart) {
      var v = p(W.EndTag, o.endTagStart);
      return v ? h(o.tag, v) : null;
    }
    var x = p(W.StartTag, o.start);
    if (x)
      return h(o.tag, x);
    var E = p(W.AttributeName, o.start);
    if (E) {
      var I = o.tag, B = t.getText(E);
      return m(I, B, E);
    }
    var _ = w();
    if (_)
      return g(u, _);
    function b(S, L) {
      for (var M = ye(t.getText(), S), D = M.scan(), H = void 0; D !== W.EOS && M.getTokenEnd() <= L; )
        D = M.scan(), D === W.AttributeName && (H = M.getTokenText());
      return H;
    }
    var T = p(W.AttributeValue, o.start);
    if (T) {
      var I = o.tag, q = du(t.getText(T)), F = b(o.start, t.offsetAt(T.start));
      if (F)
        return f(I, F, q, T);
    }
    return null;
  }, e.prototype.convertContents = function(t) {
    if (!this.doesSupportMarkdown()) {
      if (typeof t == "string")
        return t;
      if ("kind" in t)
        return {
          kind: "plaintext",
          value: t.value
        };
      if (Array.isArray(t))
        t.map(function(n) {
          return typeof n == "string" ? n : n.value;
        });
      else
        return t.value;
    }
    return t;
  }, e.prototype.doesSupportMarkdown = function() {
    var t, n, i;
    if (!bn(this.supportsMarkdown)) {
      if (!bn(this.lsOptions.clientCapabilities))
        return this.supportsMarkdown = !0, this.supportsMarkdown;
      var r = (i = (n = (t = this.lsOptions.clientCapabilities) === null || t === void 0 ? void 0 : t.textDocument) === null || n === void 0 ? void 0 : n.hover) === null || i === void 0 ? void 0 : i.contentFormat;
      this.supportsMarkdown = Array.isArray(r) && r.indexOf(Ee.Markdown) !== -1;
    }
    return this.supportsMarkdown;
  }, e;
}();
function du(e) {
  return e.length <= 1 ? e.replace(/['"]/, "") : ((e[0] === "'" || e[0] === '"') && (e = e.slice(1)), (e[e.length - 1] === "'" || e[e.length - 1] === '"') && (e = e.slice(0, -1)), e);
}
function mu(e, t) {
  return e;
}
var Ka;
(function() {
  var e = [
    ,
    ,
    function(r) {
      function a(o) {
        this.__parent = o, this.__character_count = 0, this.__indent_count = -1, this.__alignment_count = 0, this.__wrap_point_index = 0, this.__wrap_point_character_count = 0, this.__wrap_point_indent_count = -1, this.__wrap_point_alignment_count = 0, this.__items = [];
      }
      a.prototype.clone_empty = function() {
        var o = new a(this.__parent);
        return o.set_indent(this.__indent_count, this.__alignment_count), o;
      }, a.prototype.item = function(o) {
        return o < 0 ? this.__items[this.__items.length + o] : this.__items[o];
      }, a.prototype.has_match = function(o) {
        for (var u = this.__items.length - 1; u >= 0; u--)
          if (this.__items[u].match(o))
            return !0;
        return !1;
      }, a.prototype.set_indent = function(o, u) {
        this.is_empty() && (this.__indent_count = o || 0, this.__alignment_count = u || 0, this.__character_count = this.__parent.get_indent_size(this.__indent_count, this.__alignment_count));
      }, a.prototype._set_wrap_point = function() {
        this.__parent.wrap_line_length && (this.__wrap_point_index = this.__items.length, this.__wrap_point_character_count = this.__character_count, this.__wrap_point_indent_count = this.__parent.next_line.__indent_count, this.__wrap_point_alignment_count = this.__parent.next_line.__alignment_count);
      }, a.prototype._should_wrap = function() {
        return this.__wrap_point_index && this.__character_count > this.__parent.wrap_line_length && this.__wrap_point_character_count > this.__parent.next_line.__character_count;
      }, a.prototype._allow_wrap = function() {
        if (this._should_wrap()) {
          this.__parent.add_new_line();
          var o = this.__parent.current_line;
          return o.set_indent(this.__wrap_point_indent_count, this.__wrap_point_alignment_count), o.__items = this.__items.slice(this.__wrap_point_index), this.__items = this.__items.slice(0, this.__wrap_point_index), o.__character_count += this.__character_count - this.__wrap_point_character_count, this.__character_count = this.__wrap_point_character_count, o.__items[0] === " " && (o.__items.splice(0, 1), o.__character_count -= 1), !0;
        }
        return !1;
      }, a.prototype.is_empty = function() {
        return this.__items.length === 0;
      }, a.prototype.last = function() {
        return this.is_empty() ? null : this.__items[this.__items.length - 1];
      }, a.prototype.push = function(o) {
        this.__items.push(o);
        var u = o.lastIndexOf(`
`);
        u !== -1 ? this.__character_count = o.length - u : this.__character_count += o.length;
      }, a.prototype.pop = function() {
        var o = null;
        return this.is_empty() || (o = this.__items.pop(), this.__character_count -= o.length), o;
      }, a.prototype._remove_indent = function() {
        this.__indent_count > 0 && (this.__indent_count -= 1, this.__character_count -= this.__parent.indent_size);
      }, a.prototype._remove_wrap_indent = function() {
        this.__wrap_point_indent_count > 0 && (this.__wrap_point_indent_count -= 1);
      }, a.prototype.trim = function() {
        for (; this.last() === " "; )
          this.__items.pop(), this.__character_count -= 1;
      }, a.prototype.toString = function() {
        var o = "";
        return this.is_empty() ? this.__parent.indent_empty_lines && (o = this.__parent.get_indent_string(this.__indent_count)) : (o = this.__parent.get_indent_string(this.__indent_count, this.__alignment_count), o += this.__items.join("")), o;
      };
      function s(o, u) {
        this.__cache = [""], this.__indent_size = o.indent_size, this.__indent_string = o.indent_char, o.indent_with_tabs || (this.__indent_string = new Array(o.indent_size + 1).join(o.indent_char)), u = u || "", o.indent_level > 0 && (u = new Array(o.indent_level + 1).join(this.__indent_string)), this.__base_string = u, this.__base_string_length = u.length;
      }
      s.prototype.get_indent_size = function(o, u) {
        var c = this.__base_string_length;
        return u = u || 0, o < 0 && (c = 0), c += o * this.__indent_size, c += u, c;
      }, s.prototype.get_indent_string = function(o, u) {
        var c = this.__base_string;
        return u = u || 0, o < 0 && (o = 0, c = ""), u += o * this.__indent_size, this.__ensure_cache(u), c += this.__cache[u], c;
      }, s.prototype.__ensure_cache = function(o) {
        for (; o >= this.__cache.length; )
          this.__add_column();
      }, s.prototype.__add_column = function() {
        var o = this.__cache.length, u = 0, c = "";
        this.__indent_size && o >= this.__indent_size && (u = Math.floor(o / this.__indent_size), o -= u * this.__indent_size, c = new Array(u + 1).join(this.__indent_string)), o && (c += new Array(o + 1).join(" ")), this.__cache.push(c);
      };
      function l(o, u) {
        this.__indent_cache = new s(o, u), this.raw = !1, this._end_with_newline = o.end_with_newline, this.indent_size = o.indent_size, this.wrap_line_length = o.wrap_line_length, this.indent_empty_lines = o.indent_empty_lines, this.__lines = [], this.previous_line = null, this.current_line = null, this.next_line = new a(this), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = !1, this.__add_outputline();
      }
      l.prototype.__add_outputline = function() {
        this.previous_line = this.current_line, this.current_line = this.next_line.clone_empty(), this.__lines.push(this.current_line);
      }, l.prototype.get_line_number = function() {
        return this.__lines.length;
      }, l.prototype.get_indent_string = function(o, u) {
        return this.__indent_cache.get_indent_string(o, u);
      }, l.prototype.get_indent_size = function(o, u) {
        return this.__indent_cache.get_indent_size(o, u);
      }, l.prototype.is_empty = function() {
        return !this.previous_line && this.current_line.is_empty();
      }, l.prototype.add_new_line = function(o) {
        return this.is_empty() || !o && this.just_added_newline() ? !1 : (this.raw || this.__add_outputline(), !0);
      }, l.prototype.get_code = function(o) {
        this.trim(!0);
        var u = this.current_line.pop();
        u && (u[u.length - 1] === `
` && (u = u.replace(/\n+$/g, "")), this.current_line.push(u)), this._end_with_newline && this.__add_outputline();
        var c = this.__lines.join(`
`);
        return o !== `
` && (c = c.replace(/[\n]/g, o)), c;
      }, l.prototype.set_wrap_point = function() {
        this.current_line._set_wrap_point();
      }, l.prototype.set_indent = function(o, u) {
        return o = o || 0, u = u || 0, this.next_line.set_indent(o, u), this.__lines.length > 1 ? (this.current_line.set_indent(o, u), !0) : (this.current_line.set_indent(), !1);
      }, l.prototype.add_raw_token = function(o) {
        for (var u = 0; u < o.newlines; u++)
          this.__add_outputline();
        this.current_line.set_indent(-1), this.current_line.push(o.whitespace_before), this.current_line.push(o.text), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = !1;
      }, l.prototype.add_token = function(o) {
        this.__add_space_before_token(), this.current_line.push(o), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = this.current_line._allow_wrap();
      }, l.prototype.__add_space_before_token = function() {
        this.space_before_token && !this.just_added_newline() && (this.non_breaking_space || this.set_wrap_point(), this.current_line.push(" "));
      }, l.prototype.remove_indent = function(o) {
        for (var u = this.__lines.length; o < u; )
          this.__lines[o]._remove_indent(), o++;
        this.current_line._remove_wrap_indent();
      }, l.prototype.trim = function(o) {
        for (o = o === void 0 ? !1 : o, this.current_line.trim(); o && this.__lines.length > 1 && this.current_line.is_empty(); )
          this.__lines.pop(), this.current_line = this.__lines[this.__lines.length - 1], this.current_line.trim();
        this.previous_line = this.__lines.length > 1 ? this.__lines[this.__lines.length - 2] : null;
      }, l.prototype.just_added_newline = function() {
        return this.current_line.is_empty();
      }, l.prototype.just_added_blankline = function() {
        return this.is_empty() || this.current_line.is_empty() && this.previous_line.is_empty();
      }, l.prototype.ensure_empty_line_above = function(o, u) {
        for (var c = this.__lines.length - 2; c >= 0; ) {
          var h = this.__lines[c];
          if (h.is_empty())
            break;
          if (h.item(0).indexOf(o) !== 0 && h.item(-1) !== u) {
            this.__lines.splice(c + 1, 0, new a(this)), this.previous_line = this.__lines[this.__lines.length - 2];
            break;
          }
          c--;
        }
      }, r.exports.Output = l;
    },
    ,
    ,
    ,
    function(r) {
      function a(o, u) {
        this.raw_options = s(o, u), this.disabled = this._get_boolean("disabled"), this.eol = this._get_characters("eol", "auto"), this.end_with_newline = this._get_boolean("end_with_newline"), this.indent_size = this._get_number("indent_size", 4), this.indent_char = this._get_characters("indent_char", " "), this.indent_level = this._get_number("indent_level"), this.preserve_newlines = this._get_boolean("preserve_newlines", !0), this.max_preserve_newlines = this._get_number("max_preserve_newlines", 32786), this.preserve_newlines || (this.max_preserve_newlines = 0), this.indent_with_tabs = this._get_boolean("indent_with_tabs", this.indent_char === "	"), this.indent_with_tabs && (this.indent_char = "	", this.indent_size === 1 && (this.indent_size = 4)), this.wrap_line_length = this._get_number("wrap_line_length", this._get_number("max_char")), this.indent_empty_lines = this._get_boolean("indent_empty_lines"), this.templating = this._get_selection_list("templating", ["auto", "none", "django", "erb", "handlebars", "php", "smarty"], ["auto"]);
      }
      a.prototype._get_array = function(o, u) {
        var c = this.raw_options[o], h = u || [];
        return typeof c == "object" ? c !== null && typeof c.concat == "function" && (h = c.concat()) : typeof c == "string" && (h = c.split(/[^a-zA-Z0-9_\/\-]+/)), h;
      }, a.prototype._get_boolean = function(o, u) {
        var c = this.raw_options[o], h = c === void 0 ? !!u : !!c;
        return h;
      }, a.prototype._get_characters = function(o, u) {
        var c = this.raw_options[o], h = u || "";
        return typeof c == "string" && (h = c.replace(/\\r/, "\r").replace(/\\n/, `
`).replace(/\\t/, "	")), h;
      }, a.prototype._get_number = function(o, u) {
        var c = this.raw_options[o];
        u = parseInt(u, 10), isNaN(u) && (u = 0);
        var h = parseInt(c, 10);
        return isNaN(h) && (h = u), h;
      }, a.prototype._get_selection = function(o, u, c) {
        var h = this._get_selection_list(o, u, c);
        if (h.length !== 1)
          throw new Error("Invalid Option Value: The option '" + o + `' can only be one of the following values:
` + u + `
You passed in: '` + this.raw_options[o] + "'");
        return h[0];
      }, a.prototype._get_selection_list = function(o, u, c) {
        if (!u || u.length === 0)
          throw new Error("Selection list cannot be empty.");
        if (c = c || [u[0]], !this._is_valid_selection(c, u))
          throw new Error("Invalid Default Value!");
        var h = this._get_array(o, c);
        if (!this._is_valid_selection(h, u))
          throw new Error("Invalid Option Value: The option '" + o + `' can contain only the following values:
` + u + `
You passed in: '` + this.raw_options[o] + "'");
        return h;
      }, a.prototype._is_valid_selection = function(o, u) {
        return o.length && u.length && !o.some(function(c) {
          return u.indexOf(c) === -1;
        });
      };
      function s(o, u) {
        var c = {};
        o = l(o);
        var h;
        for (h in o)
          h !== u && (c[h] = o[h]);
        if (u && o[u])
          for (h in o[u])
            c[h] = o[u][h];
        return c;
      }
      function l(o) {
        var u = {}, c;
        for (c in o) {
          var h = c.replace(/-/g, "_");
          u[h] = o[c];
        }
        return u;
      }
      r.exports.Options = a, r.exports.normalizeOpts = l, r.exports.mergeOpts = s;
    },
    ,
    function(r) {
      var a = RegExp.prototype.hasOwnProperty("sticky");
      function s(l) {
        this.__input = l || "", this.__input_length = this.__input.length, this.__position = 0;
      }
      s.prototype.restart = function() {
        this.__position = 0;
      }, s.prototype.back = function() {
        this.__position > 0 && (this.__position -= 1);
      }, s.prototype.hasNext = function() {
        return this.__position < this.__input_length;
      }, s.prototype.next = function() {
        var l = null;
        return this.hasNext() && (l = this.__input.charAt(this.__position), this.__position += 1), l;
      }, s.prototype.peek = function(l) {
        var o = null;
        return l = l || 0, l += this.__position, l >= 0 && l < this.__input_length && (o = this.__input.charAt(l)), o;
      }, s.prototype.__match = function(l, o) {
        l.lastIndex = o;
        var u = l.exec(this.__input);
        return u && !(a && l.sticky) && u.index !== o && (u = null), u;
      }, s.prototype.test = function(l, o) {
        return o = o || 0, o += this.__position, o >= 0 && o < this.__input_length ? !!this.__match(l, o) : !1;
      }, s.prototype.testChar = function(l, o) {
        var u = this.peek(o);
        return l.lastIndex = 0, u !== null && l.test(u);
      }, s.prototype.match = function(l) {
        var o = this.__match(l, this.__position);
        return o ? this.__position += o[0].length : o = null, o;
      }, s.prototype.read = function(l, o, u) {
        var c = "", h;
        return l && (h = this.match(l), h && (c += h[0])), o && (h || !l) && (c += this.readUntil(o, u)), c;
      }, s.prototype.readUntil = function(l, o) {
        var u = "", c = this.__position;
        l.lastIndex = this.__position;
        var h = l.exec(this.__input);
        return h ? (c = h.index, o && (c += h[0].length)) : c = this.__input_length, u = this.__input.substring(this.__position, c), this.__position = c, u;
      }, s.prototype.readUntilAfter = function(l) {
        return this.readUntil(l, !0);
      }, s.prototype.get_regexp = function(l, o) {
        var u = null, c = "g";
        return o && a && (c = "y"), typeof l == "string" && l !== "" ? u = new RegExp(l, c) : l && (u = new RegExp(l.source, c)), u;
      }, s.prototype.get_literal_regexp = function(l) {
        return RegExp(l.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
      }, s.prototype.peekUntilAfter = function(l) {
        var o = this.__position, u = this.readUntilAfter(l);
        return this.__position = o, u;
      }, s.prototype.lookBack = function(l) {
        var o = this.__position - 1;
        return o >= l.length && this.__input.substring(o - l.length, o).toLowerCase() === l;
      }, r.exports.InputScanner = s;
    },
    ,
    ,
    ,
    ,
    function(r) {
      function a(s, l) {
        s = typeof s == "string" ? s : s.source, l = typeof l == "string" ? l : l.source, this.__directives_block_pattern = new RegExp(s + / beautify( \w+[:]\w+)+ /.source + l, "g"), this.__directive_pattern = / (\w+)[:](\w+)/g, this.__directives_end_ignore_pattern = new RegExp(s + /\sbeautify\signore:end\s/.source + l, "g");
      }
      a.prototype.get_directives = function(s) {
        if (!s.match(this.__directives_block_pattern))
          return null;
        var l = {};
        this.__directive_pattern.lastIndex = 0;
        for (var o = this.__directive_pattern.exec(s); o; )
          l[o[1]] = o[2], o = this.__directive_pattern.exec(s);
        return l;
      }, a.prototype.readIgnored = function(s) {
        return s.readUntilAfter(this.__directives_end_ignore_pattern);
      }, r.exports.Directives = a;
    },
    ,
    function(r, a, s) {
      var l = s(16).Beautifier, o = s(17).Options;
      function u(c, h) {
        var m = new l(c, h);
        return m.beautify();
      }
      r.exports = u, r.exports.defaultOptions = function() {
        return new o();
      };
    },
    function(r, a, s) {
      var l = s(17).Options, o = s(2).Output, u = s(8).InputScanner, c = s(13).Directives, h = new c(/\/\*/, /\*\//), m = /\r\n|[\r\n]/, f = /\r\n|[\r\n]/g, g = /\s/, p = /(?:\s|\n)+/g, w = /\/\*(?:[\s\S]*?)((?:\*\/)|$)/g, y = /\/\/(?:[^\n\r\u2028\u2029]*)/g;
      function v(x, E) {
        this._source_text = x || "", this._options = new l(E), this._ch = null, this._input = null, this.NESTED_AT_RULE = {
          "@page": !0,
          "@font-face": !0,
          "@keyframes": !0,
          "@media": !0,
          "@supports": !0,
          "@document": !0
        }, this.CONDITIONAL_GROUP_RULE = {
          "@media": !0,
          "@supports": !0,
          "@document": !0
        };
      }
      v.prototype.eatString = function(x) {
        var E = "";
        for (this._ch = this._input.next(); this._ch; ) {
          if (E += this._ch, this._ch === "\\")
            E += this._input.next();
          else if (x.indexOf(this._ch) !== -1 || this._ch === `
`)
            break;
          this._ch = this._input.next();
        }
        return E;
      }, v.prototype.eatWhitespace = function(x) {
        for (var E = g.test(this._input.peek()), I = 0; g.test(this._input.peek()); )
          this._ch = this._input.next(), x && this._ch === `
` && (I === 0 || I < this._options.max_preserve_newlines) && (I++, this._output.add_new_line(!0));
        return E;
      }, v.prototype.foundNestedPseudoClass = function() {
        for (var x = 0, E = 1, I = this._input.peek(E); I; ) {
          if (I === "{")
            return !0;
          if (I === "(")
            x += 1;
          else if (I === ")") {
            if (x === 0)
              return !1;
            x -= 1;
          } else if (I === ";" || I === "}")
            return !1;
          E++, I = this._input.peek(E);
        }
        return !1;
      }, v.prototype.print_string = function(x) {
        this._output.set_indent(this._indentLevel), this._output.non_breaking_space = !0, this._output.add_token(x);
      }, v.prototype.preserveSingleSpace = function(x) {
        x && (this._output.space_before_token = !0);
      }, v.prototype.indent = function() {
        this._indentLevel++;
      }, v.prototype.outdent = function() {
        this._indentLevel > 0 && this._indentLevel--;
      }, v.prototype.beautify = function() {
        if (this._options.disabled)
          return this._source_text;
        var x = this._source_text, E = this._options.eol;
        E === "auto" && (E = `
`, x && m.test(x || "") && (E = x.match(m)[0])), x = x.replace(f, `
`);
        var I = x.match(/^[\t ]*/)[0];
        this._output = new o(this._options, I), this._input = new u(x), this._indentLevel = 0, this._nestedLevel = 0, this._ch = null;
        for (var B = 0, _ = !1, b = !1, T = !1, q = !1, F = !1, S = this._ch, L, M, D; L = this._input.read(p), M = L !== "", D = S, this._ch = this._input.next(), this._ch === "\\" && this._input.hasNext() && (this._ch += this._input.next()), S = this._ch, this._ch; )
          if (this._ch === "/" && this._input.peek() === "*") {
            this._output.add_new_line(), this._input.back();
            var H = this._input.read(w), A = h.get_directives(H);
            A && A.ignore === "start" && (H += h.readIgnored(this._input)), this.print_string(H), this.eatWhitespace(!0), this._output.add_new_line();
          } else if (this._ch === "/" && this._input.peek() === "/")
            this._output.space_before_token = !0, this._input.back(), this.print_string(this._input.read(y)), this.eatWhitespace(!0);
          else if (this._ch === "@")
            if (this.preserveSingleSpace(M), this._input.peek() === "{")
              this.print_string(this._ch + this.eatString("}"));
            else {
              this.print_string(this._ch);
              var k = this._input.peekUntilAfter(/[: ,;{}()[\]\/='"]/g);
              k.match(/[ :]$/) && (k = this.eatString(": ").replace(/\s$/, ""), this.print_string(k), this._output.space_before_token = !0), k = k.replace(/\s$/, ""), k === "extend" ? q = !0 : k === "import" && (F = !0), k in this.NESTED_AT_RULE ? (this._nestedLevel += 1, k in this.CONDITIONAL_GROUP_RULE && (T = !0)) : !_ && B === 0 && k.indexOf(":") !== -1 && (b = !0, this.indent());
            }
          else
            this._ch === "#" && this._input.peek() === "{" ? (this.preserveSingleSpace(M), this.print_string(this._ch + this.eatString("}"))) : this._ch === "{" ? (b && (b = !1, this.outdent()), T ? (T = !1, _ = this._indentLevel >= this._nestedLevel) : _ = this._indentLevel >= this._nestedLevel - 1, this._options.newline_between_rules && _ && this._output.previous_line && this._output.previous_line.item(-1) !== "{" && this._output.ensure_empty_line_above("/", ","), this._output.space_before_token = !0, this._options.brace_style === "expand" ? (this._output.add_new_line(), this.print_string(this._ch), this.indent(), this._output.set_indent(this._indentLevel)) : (this.indent(), this.print_string(this._ch)), this.eatWhitespace(!0), this._output.add_new_line()) : this._ch === "}" ? (this.outdent(), this._output.add_new_line(), D === "{" && this._output.trim(!0), F = !1, q = !1, b && (this.outdent(), b = !1), this.print_string(this._ch), _ = !1, this._nestedLevel && this._nestedLevel--, this.eatWhitespace(!0), this._output.add_new_line(), this._options.newline_between_rules && !this._output.just_added_blankline() && this._input.peek() !== "}" && this._output.add_new_line(!0)) : this._ch === ":" ? (_ || T) && !(this._input.lookBack("&") || this.foundNestedPseudoClass()) && !this._input.lookBack("(") && !q && B === 0 ? (this.print_string(":"), b || (b = !0, this._output.space_before_token = !0, this.eatWhitespace(!0), this.indent())) : (this._input.lookBack(" ") && (this._output.space_before_token = !0), this._input.peek() === ":" ? (this._ch = this._input.next(), this.print_string("::")) : this.print_string(":")) : this._ch === '"' || this._ch === "'" ? (this.preserveSingleSpace(M), this.print_string(this._ch + this.eatString(this._ch)), this.eatWhitespace(!0)) : this._ch === ";" ? B === 0 ? (b && (this.outdent(), b = !1), q = !1, F = !1, this.print_string(this._ch), this.eatWhitespace(!0), this._input.peek() !== "/" && this._output.add_new_line()) : (this.print_string(this._ch), this.eatWhitespace(!0), this._output.space_before_token = !0) : this._ch === "(" ? this._input.lookBack("url") ? (this.print_string(this._ch), this.eatWhitespace(), B++, this.indent(), this._ch = this._input.next(), this._ch === ")" || this._ch === '"' || this._ch === "'" ? this._input.back() : this._ch && (this.print_string(this._ch + this.eatString(")")), B && (B--, this.outdent()))) : (this.preserveSingleSpace(M), this.print_string(this._ch), this.eatWhitespace(), B++, this.indent()) : this._ch === ")" ? (B && (B--, this.outdent()), this.print_string(this._ch)) : this._ch === "," ? (this.print_string(this._ch), this.eatWhitespace(!0), this._options.selector_separator_newline && !b && B === 0 && !F && !q ? this._output.add_new_line() : this._output.space_before_token = !0) : (this._ch === ">" || this._ch === "+" || this._ch === "~") && !b && B === 0 ? this._options.space_around_combinator ? (this._output.space_before_token = !0, this.print_string(this._ch), this._output.space_before_token = !0) : (this.print_string(this._ch), this.eatWhitespace(), this._ch && g.test(this._ch) && (this._ch = "")) : this._ch === "]" ? this.print_string(this._ch) : this._ch === "[" ? (this.preserveSingleSpace(M), this.print_string(this._ch)) : this._ch === "=" ? (this.eatWhitespace(), this.print_string("="), g.test(this._ch) && (this._ch = "")) : this._ch === "!" && !this._input.lookBack("\\") ? (this.print_string(" "), this.print_string(this._ch)) : (this.preserveSingleSpace(M), this.print_string(this._ch));
        var R = this._output.get_code(E);
        return R;
      }, r.exports.Beautifier = v;
    },
    function(r, a, s) {
      var l = s(6).Options;
      function o(u) {
        l.call(this, u, "css"), this.selector_separator_newline = this._get_boolean("selector_separator_newline", !0), this.newline_between_rules = this._get_boolean("newline_between_rules", !0);
        var c = this._get_boolean("space_around_selector_separator");
        this.space_around_combinator = this._get_boolean("space_around_combinator") || c;
        var h = this._get_selection_list("brace_style", ["collapse", "expand", "end-expand", "none", "preserve-inline"]);
        this.brace_style = "collapse";
        for (var m = 0; m < h.length; m++)
          h[m] !== "expand" ? this.brace_style = "collapse" : this.brace_style = h[m];
      }
      o.prototype = new l(), r.exports.Options = o;
    }
  ], t = {};
  function n(r) {
    var a = t[r];
    if (a !== void 0)
      return a.exports;
    var s = t[r] = {
      exports: {}
    };
    return e[r](s, s.exports, n), s.exports;
  }
  var i = n(15);
  Ka = i;
})();
var fu = Ka, es;
(function() {
  var e = [
    ,
    ,
    function(r) {
      function a(o) {
        this.__parent = o, this.__character_count = 0, this.__indent_count = -1, this.__alignment_count = 0, this.__wrap_point_index = 0, this.__wrap_point_character_count = 0, this.__wrap_point_indent_count = -1, this.__wrap_point_alignment_count = 0, this.__items = [];
      }
      a.prototype.clone_empty = function() {
        var o = new a(this.__parent);
        return o.set_indent(this.__indent_count, this.__alignment_count), o;
      }, a.prototype.item = function(o) {
        return o < 0 ? this.__items[this.__items.length + o] : this.__items[o];
      }, a.prototype.has_match = function(o) {
        for (var u = this.__items.length - 1; u >= 0; u--)
          if (this.__items[u].match(o))
            return !0;
        return !1;
      }, a.prototype.set_indent = function(o, u) {
        this.is_empty() && (this.__indent_count = o || 0, this.__alignment_count = u || 0, this.__character_count = this.__parent.get_indent_size(this.__indent_count, this.__alignment_count));
      }, a.prototype._set_wrap_point = function() {
        this.__parent.wrap_line_length && (this.__wrap_point_index = this.__items.length, this.__wrap_point_character_count = this.__character_count, this.__wrap_point_indent_count = this.__parent.next_line.__indent_count, this.__wrap_point_alignment_count = this.__parent.next_line.__alignment_count);
      }, a.prototype._should_wrap = function() {
        return this.__wrap_point_index && this.__character_count > this.__parent.wrap_line_length && this.__wrap_point_character_count > this.__parent.next_line.__character_count;
      }, a.prototype._allow_wrap = function() {
        if (this._should_wrap()) {
          this.__parent.add_new_line();
          var o = this.__parent.current_line;
          return o.set_indent(this.__wrap_point_indent_count, this.__wrap_point_alignment_count), o.__items = this.__items.slice(this.__wrap_point_index), this.__items = this.__items.slice(0, this.__wrap_point_index), o.__character_count += this.__character_count - this.__wrap_point_character_count, this.__character_count = this.__wrap_point_character_count, o.__items[0] === " " && (o.__items.splice(0, 1), o.__character_count -= 1), !0;
        }
        return !1;
      }, a.prototype.is_empty = function() {
        return this.__items.length === 0;
      }, a.prototype.last = function() {
        return this.is_empty() ? null : this.__items[this.__items.length - 1];
      }, a.prototype.push = function(o) {
        this.__items.push(o);
        var u = o.lastIndexOf(`
`);
        u !== -1 ? this.__character_count = o.length - u : this.__character_count += o.length;
      }, a.prototype.pop = function() {
        var o = null;
        return this.is_empty() || (o = this.__items.pop(), this.__character_count -= o.length), o;
      }, a.prototype._remove_indent = function() {
        this.__indent_count > 0 && (this.__indent_count -= 1, this.__character_count -= this.__parent.indent_size);
      }, a.prototype._remove_wrap_indent = function() {
        this.__wrap_point_indent_count > 0 && (this.__wrap_point_indent_count -= 1);
      }, a.prototype.trim = function() {
        for (; this.last() === " "; )
          this.__items.pop(), this.__character_count -= 1;
      }, a.prototype.toString = function() {
        var o = "";
        return this.is_empty() ? this.__parent.indent_empty_lines && (o = this.__parent.get_indent_string(this.__indent_count)) : (o = this.__parent.get_indent_string(this.__indent_count, this.__alignment_count), o += this.__items.join("")), o;
      };
      function s(o, u) {
        this.__cache = [""], this.__indent_size = o.indent_size, this.__indent_string = o.indent_char, o.indent_with_tabs || (this.__indent_string = new Array(o.indent_size + 1).join(o.indent_char)), u = u || "", o.indent_level > 0 && (u = new Array(o.indent_level + 1).join(this.__indent_string)), this.__base_string = u, this.__base_string_length = u.length;
      }
      s.prototype.get_indent_size = function(o, u) {
        var c = this.__base_string_length;
        return u = u || 0, o < 0 && (c = 0), c += o * this.__indent_size, c += u, c;
      }, s.prototype.get_indent_string = function(o, u) {
        var c = this.__base_string;
        return u = u || 0, o < 0 && (o = 0, c = ""), u += o * this.__indent_size, this.__ensure_cache(u), c += this.__cache[u], c;
      }, s.prototype.__ensure_cache = function(o) {
        for (; o >= this.__cache.length; )
          this.__add_column();
      }, s.prototype.__add_column = function() {
        var o = this.__cache.length, u = 0, c = "";
        this.__indent_size && o >= this.__indent_size && (u = Math.floor(o / this.__indent_size), o -= u * this.__indent_size, c = new Array(u + 1).join(this.__indent_string)), o && (c += new Array(o + 1).join(" ")), this.__cache.push(c);
      };
      function l(o, u) {
        this.__indent_cache = new s(o, u), this.raw = !1, this._end_with_newline = o.end_with_newline, this.indent_size = o.indent_size, this.wrap_line_length = o.wrap_line_length, this.indent_empty_lines = o.indent_empty_lines, this.__lines = [], this.previous_line = null, this.current_line = null, this.next_line = new a(this), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = !1, this.__add_outputline();
      }
      l.prototype.__add_outputline = function() {
        this.previous_line = this.current_line, this.current_line = this.next_line.clone_empty(), this.__lines.push(this.current_line);
      }, l.prototype.get_line_number = function() {
        return this.__lines.length;
      }, l.prototype.get_indent_string = function(o, u) {
        return this.__indent_cache.get_indent_string(o, u);
      }, l.prototype.get_indent_size = function(o, u) {
        return this.__indent_cache.get_indent_size(o, u);
      }, l.prototype.is_empty = function() {
        return !this.previous_line && this.current_line.is_empty();
      }, l.prototype.add_new_line = function(o) {
        return this.is_empty() || !o && this.just_added_newline() ? !1 : (this.raw || this.__add_outputline(), !0);
      }, l.prototype.get_code = function(o) {
        this.trim(!0);
        var u = this.current_line.pop();
        u && (u[u.length - 1] === `
` && (u = u.replace(/\n+$/g, "")), this.current_line.push(u)), this._end_with_newline && this.__add_outputline();
        var c = this.__lines.join(`
`);
        return o !== `
` && (c = c.replace(/[\n]/g, o)), c;
      }, l.prototype.set_wrap_point = function() {
        this.current_line._set_wrap_point();
      }, l.prototype.set_indent = function(o, u) {
        return o = o || 0, u = u || 0, this.next_line.set_indent(o, u), this.__lines.length > 1 ? (this.current_line.set_indent(o, u), !0) : (this.current_line.set_indent(), !1);
      }, l.prototype.add_raw_token = function(o) {
        for (var u = 0; u < o.newlines; u++)
          this.__add_outputline();
        this.current_line.set_indent(-1), this.current_line.push(o.whitespace_before), this.current_line.push(o.text), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = !1;
      }, l.prototype.add_token = function(o) {
        this.__add_space_before_token(), this.current_line.push(o), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = this.current_line._allow_wrap();
      }, l.prototype.__add_space_before_token = function() {
        this.space_before_token && !this.just_added_newline() && (this.non_breaking_space || this.set_wrap_point(), this.current_line.push(" "));
      }, l.prototype.remove_indent = function(o) {
        for (var u = this.__lines.length; o < u; )
          this.__lines[o]._remove_indent(), o++;
        this.current_line._remove_wrap_indent();
      }, l.prototype.trim = function(o) {
        for (o = o === void 0 ? !1 : o, this.current_line.trim(); o && this.__lines.length > 1 && this.current_line.is_empty(); )
          this.__lines.pop(), this.current_line = this.__lines[this.__lines.length - 1], this.current_line.trim();
        this.previous_line = this.__lines.length > 1 ? this.__lines[this.__lines.length - 2] : null;
      }, l.prototype.just_added_newline = function() {
        return this.current_line.is_empty();
      }, l.prototype.just_added_blankline = function() {
        return this.is_empty() || this.current_line.is_empty() && this.previous_line.is_empty();
      }, l.prototype.ensure_empty_line_above = function(o, u) {
        for (var c = this.__lines.length - 2; c >= 0; ) {
          var h = this.__lines[c];
          if (h.is_empty())
            break;
          if (h.item(0).indexOf(o) !== 0 && h.item(-1) !== u) {
            this.__lines.splice(c + 1, 0, new a(this)), this.previous_line = this.__lines[this.__lines.length - 2];
            break;
          }
          c--;
        }
      }, r.exports.Output = l;
    },
    function(r) {
      function a(s, l, o, u) {
        this.type = s, this.text = l, this.comments_before = null, this.newlines = o || 0, this.whitespace_before = u || "", this.parent = null, this.next = null, this.previous = null, this.opened = null, this.closed = null, this.directives = null;
      }
      r.exports.Token = a;
    },
    ,
    ,
    function(r) {
      function a(o, u) {
        this.raw_options = s(o, u), this.disabled = this._get_boolean("disabled"), this.eol = this._get_characters("eol", "auto"), this.end_with_newline = this._get_boolean("end_with_newline"), this.indent_size = this._get_number("indent_size", 4), this.indent_char = this._get_characters("indent_char", " "), this.indent_level = this._get_number("indent_level"), this.preserve_newlines = this._get_boolean("preserve_newlines", !0), this.max_preserve_newlines = this._get_number("max_preserve_newlines", 32786), this.preserve_newlines || (this.max_preserve_newlines = 0), this.indent_with_tabs = this._get_boolean("indent_with_tabs", this.indent_char === "	"), this.indent_with_tabs && (this.indent_char = "	", this.indent_size === 1 && (this.indent_size = 4)), this.wrap_line_length = this._get_number("wrap_line_length", this._get_number("max_char")), this.indent_empty_lines = this._get_boolean("indent_empty_lines"), this.templating = this._get_selection_list("templating", ["auto", "none", "django", "erb", "handlebars", "php", "smarty"], ["auto"]);
      }
      a.prototype._get_array = function(o, u) {
        var c = this.raw_options[o], h = u || [];
        return typeof c == "object" ? c !== null && typeof c.concat == "function" && (h = c.concat()) : typeof c == "string" && (h = c.split(/[^a-zA-Z0-9_\/\-]+/)), h;
      }, a.prototype._get_boolean = function(o, u) {
        var c = this.raw_options[o], h = c === void 0 ? !!u : !!c;
        return h;
      }, a.prototype._get_characters = function(o, u) {
        var c = this.raw_options[o], h = u || "";
        return typeof c == "string" && (h = c.replace(/\\r/, "\r").replace(/\\n/, `
`).replace(/\\t/, "	")), h;
      }, a.prototype._get_number = function(o, u) {
        var c = this.raw_options[o];
        u = parseInt(u, 10), isNaN(u) && (u = 0);
        var h = parseInt(c, 10);
        return isNaN(h) && (h = u), h;
      }, a.prototype._get_selection = function(o, u, c) {
        var h = this._get_selection_list(o, u, c);
        if (h.length !== 1)
          throw new Error("Invalid Option Value: The option '" + o + `' can only be one of the following values:
` + u + `
You passed in: '` + this.raw_options[o] + "'");
        return h[0];
      }, a.prototype._get_selection_list = function(o, u, c) {
        if (!u || u.length === 0)
          throw new Error("Selection list cannot be empty.");
        if (c = c || [u[0]], !this._is_valid_selection(c, u))
          throw new Error("Invalid Default Value!");
        var h = this._get_array(o, c);
        if (!this._is_valid_selection(h, u))
          throw new Error("Invalid Option Value: The option '" + o + `' can contain only the following values:
` + u + `
You passed in: '` + this.raw_options[o] + "'");
        return h;
      }, a.prototype._is_valid_selection = function(o, u) {
        return o.length && u.length && !o.some(function(c) {
          return u.indexOf(c) === -1;
        });
      };
      function s(o, u) {
        var c = {};
        o = l(o);
        var h;
        for (h in o)
          h !== u && (c[h] = o[h]);
        if (u && o[u])
          for (h in o[u])
            c[h] = o[u][h];
        return c;
      }
      function l(o) {
        var u = {}, c;
        for (c in o) {
          var h = c.replace(/-/g, "_");
          u[h] = o[c];
        }
        return u;
      }
      r.exports.Options = a, r.exports.normalizeOpts = l, r.exports.mergeOpts = s;
    },
    ,
    function(r) {
      var a = RegExp.prototype.hasOwnProperty("sticky");
      function s(l) {
        this.__input = l || "", this.__input_length = this.__input.length, this.__position = 0;
      }
      s.prototype.restart = function() {
        this.__position = 0;
      }, s.prototype.back = function() {
        this.__position > 0 && (this.__position -= 1);
      }, s.prototype.hasNext = function() {
        return this.__position < this.__input_length;
      }, s.prototype.next = function() {
        var l = null;
        return this.hasNext() && (l = this.__input.charAt(this.__position), this.__position += 1), l;
      }, s.prototype.peek = function(l) {
        var o = null;
        return l = l || 0, l += this.__position, l >= 0 && l < this.__input_length && (o = this.__input.charAt(l)), o;
      }, s.prototype.__match = function(l, o) {
        l.lastIndex = o;
        var u = l.exec(this.__input);
        return u && !(a && l.sticky) && u.index !== o && (u = null), u;
      }, s.prototype.test = function(l, o) {
        return o = o || 0, o += this.__position, o >= 0 && o < this.__input_length ? !!this.__match(l, o) : !1;
      }, s.prototype.testChar = function(l, o) {
        var u = this.peek(o);
        return l.lastIndex = 0, u !== null && l.test(u);
      }, s.prototype.match = function(l) {
        var o = this.__match(l, this.__position);
        return o ? this.__position += o[0].length : o = null, o;
      }, s.prototype.read = function(l, o, u) {
        var c = "", h;
        return l && (h = this.match(l), h && (c += h[0])), o && (h || !l) && (c += this.readUntil(o, u)), c;
      }, s.prototype.readUntil = function(l, o) {
        var u = "", c = this.__position;
        l.lastIndex = this.__position;
        var h = l.exec(this.__input);
        return h ? (c = h.index, o && (c += h[0].length)) : c = this.__input_length, u = this.__input.substring(this.__position, c), this.__position = c, u;
      }, s.prototype.readUntilAfter = function(l) {
        return this.readUntil(l, !0);
      }, s.prototype.get_regexp = function(l, o) {
        var u = null, c = "g";
        return o && a && (c = "y"), typeof l == "string" && l !== "" ? u = new RegExp(l, c) : l && (u = new RegExp(l.source, c)), u;
      }, s.prototype.get_literal_regexp = function(l) {
        return RegExp(l.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
      }, s.prototype.peekUntilAfter = function(l) {
        var o = this.__position, u = this.readUntilAfter(l);
        return this.__position = o, u;
      }, s.prototype.lookBack = function(l) {
        var o = this.__position - 1;
        return o >= l.length && this.__input.substring(o - l.length, o).toLowerCase() === l;
      }, r.exports.InputScanner = s;
    },
    function(r, a, s) {
      var l = s(8).InputScanner, o = s(3).Token, u = s(10).TokenStream, c = s(11).WhitespacePattern, h = {
        START: "TK_START",
        RAW: "TK_RAW",
        EOF: "TK_EOF"
      }, m = function(f, g) {
        this._input = new l(f), this._options = g || {}, this.__tokens = null, this._patterns = {}, this._patterns.whitespace = new c(this._input);
      };
      m.prototype.tokenize = function() {
        this._input.restart(), this.__tokens = new u(), this._reset();
        for (var f, g = new o(h.START, ""), p = null, w = [], y = new u(); g.type !== h.EOF; ) {
          for (f = this._get_next_token(g, p); this._is_comment(f); )
            y.add(f), f = this._get_next_token(g, p);
          y.isEmpty() || (f.comments_before = y, y = new u()), f.parent = p, this._is_opening(f) ? (w.push(p), p = f) : p && this._is_closing(f, p) && (f.opened = p, p.closed = f, p = w.pop(), f.parent = p), f.previous = g, g.next = f, this.__tokens.add(f), g = f;
        }
        return this.__tokens;
      }, m.prototype._is_first_token = function() {
        return this.__tokens.isEmpty();
      }, m.prototype._reset = function() {
      }, m.prototype._get_next_token = function(f, g) {
        this._readWhitespace();
        var p = this._input.read(/.+/g);
        return p ? this._create_token(h.RAW, p) : this._create_token(h.EOF, "");
      }, m.prototype._is_comment = function(f) {
        return !1;
      }, m.prototype._is_opening = function(f) {
        return !1;
      }, m.prototype._is_closing = function(f, g) {
        return !1;
      }, m.prototype._create_token = function(f, g) {
        var p = new o(f, g, this._patterns.whitespace.newline_count, this._patterns.whitespace.whitespace_before_token);
        return p;
      }, m.prototype._readWhitespace = function() {
        return this._patterns.whitespace.read();
      }, r.exports.Tokenizer = m, r.exports.TOKEN = h;
    },
    function(r) {
      function a(s) {
        this.__tokens = [], this.__tokens_length = this.__tokens.length, this.__position = 0, this.__parent_token = s;
      }
      a.prototype.restart = function() {
        this.__position = 0;
      }, a.prototype.isEmpty = function() {
        return this.__tokens_length === 0;
      }, a.prototype.hasNext = function() {
        return this.__position < this.__tokens_length;
      }, a.prototype.next = function() {
        var s = null;
        return this.hasNext() && (s = this.__tokens[this.__position], this.__position += 1), s;
      }, a.prototype.peek = function(s) {
        var l = null;
        return s = s || 0, s += this.__position, s >= 0 && s < this.__tokens_length && (l = this.__tokens[s]), l;
      }, a.prototype.add = function(s) {
        this.__parent_token && (s.parent = this.__parent_token), this.__tokens.push(s), this.__tokens_length += 1;
      }, r.exports.TokenStream = a;
    },
    function(r, a, s) {
      var l = s(12).Pattern;
      function o(u, c) {
        l.call(this, u, c), c ? this._line_regexp = this._input.get_regexp(c._line_regexp) : this.__set_whitespace_patterns("", ""), this.newline_count = 0, this.whitespace_before_token = "";
      }
      o.prototype = new l(), o.prototype.__set_whitespace_patterns = function(u, c) {
        u += "\\t ", c += "\\n\\r", this._match_pattern = this._input.get_regexp("[" + u + c + "]+", !0), this._newline_regexp = this._input.get_regexp("\\r\\n|[" + c + "]");
      }, o.prototype.read = function() {
        this.newline_count = 0, this.whitespace_before_token = "";
        var u = this._input.read(this._match_pattern);
        if (u === " ")
          this.whitespace_before_token = " ";
        else if (u) {
          var c = this.__split(this._newline_regexp, u);
          this.newline_count = c.length - 1, this.whitespace_before_token = c[this.newline_count];
        }
        return u;
      }, o.prototype.matching = function(u, c) {
        var h = this._create();
        return h.__set_whitespace_patterns(u, c), h._update(), h;
      }, o.prototype._create = function() {
        return new o(this._input, this);
      }, o.prototype.__split = function(u, c) {
        u.lastIndex = 0;
        for (var h = 0, m = [], f = u.exec(c); f; )
          m.push(c.substring(h, f.index)), h = f.index + f[0].length, f = u.exec(c);
        return h < c.length ? m.push(c.substring(h, c.length)) : m.push(""), m;
      }, r.exports.WhitespacePattern = o;
    },
    function(r) {
      function a(s, l) {
        this._input = s, this._starting_pattern = null, this._match_pattern = null, this._until_pattern = null, this._until_after = !1, l && (this._starting_pattern = this._input.get_regexp(l._starting_pattern, !0), this._match_pattern = this._input.get_regexp(l._match_pattern, !0), this._until_pattern = this._input.get_regexp(l._until_pattern), this._until_after = l._until_after);
      }
      a.prototype.read = function() {
        var s = this._input.read(this._starting_pattern);
        return (!this._starting_pattern || s) && (s += this._input.read(this._match_pattern, this._until_pattern, this._until_after)), s;
      }, a.prototype.read_match = function() {
        return this._input.match(this._match_pattern);
      }, a.prototype.until_after = function(s) {
        var l = this._create();
        return l._until_after = !0, l._until_pattern = this._input.get_regexp(s), l._update(), l;
      }, a.prototype.until = function(s) {
        var l = this._create();
        return l._until_after = !1, l._until_pattern = this._input.get_regexp(s), l._update(), l;
      }, a.prototype.starting_with = function(s) {
        var l = this._create();
        return l._starting_pattern = this._input.get_regexp(s, !0), l._update(), l;
      }, a.prototype.matching = function(s) {
        var l = this._create();
        return l._match_pattern = this._input.get_regexp(s, !0), l._update(), l;
      }, a.prototype._create = function() {
        return new a(this._input, this);
      }, a.prototype._update = function() {
      }, r.exports.Pattern = a;
    },
    function(r) {
      function a(s, l) {
        s = typeof s == "string" ? s : s.source, l = typeof l == "string" ? l : l.source, this.__directives_block_pattern = new RegExp(s + / beautify( \w+[:]\w+)+ /.source + l, "g"), this.__directive_pattern = / (\w+)[:](\w+)/g, this.__directives_end_ignore_pattern = new RegExp(s + /\sbeautify\signore:end\s/.source + l, "g");
      }
      a.prototype.get_directives = function(s) {
        if (!s.match(this.__directives_block_pattern))
          return null;
        var l = {};
        this.__directive_pattern.lastIndex = 0;
        for (var o = this.__directive_pattern.exec(s); o; )
          l[o[1]] = o[2], o = this.__directive_pattern.exec(s);
        return l;
      }, a.prototype.readIgnored = function(s) {
        return s.readUntilAfter(this.__directives_end_ignore_pattern);
      }, r.exports.Directives = a;
    },
    function(r, a, s) {
      var l = s(12).Pattern, o = {
        django: !1,
        erb: !1,
        handlebars: !1,
        php: !1,
        smarty: !1
      };
      function u(c, h) {
        l.call(this, c, h), this.__template_pattern = null, this._disabled = Object.assign({}, o), this._excluded = Object.assign({}, o), h && (this.__template_pattern = this._input.get_regexp(h.__template_pattern), this._excluded = Object.assign(this._excluded, h._excluded), this._disabled = Object.assign(this._disabled, h._disabled));
        var m = new l(c);
        this.__patterns = {
          handlebars_comment: m.starting_with(/{{!--/).until_after(/--}}/),
          handlebars_unescaped: m.starting_with(/{{{/).until_after(/}}}/),
          handlebars: m.starting_with(/{{/).until_after(/}}/),
          php: m.starting_with(/<\?(?:[= ]|php)/).until_after(/\?>/),
          erb: m.starting_with(/<%[^%]/).until_after(/[^%]%>/),
          django: m.starting_with(/{%/).until_after(/%}/),
          django_value: m.starting_with(/{{/).until_after(/}}/),
          django_comment: m.starting_with(/{#/).until_after(/#}/),
          smarty: m.starting_with(/{(?=[^}{\s\n])/).until_after(/[^\s\n]}/),
          smarty_comment: m.starting_with(/{\*/).until_after(/\*}/),
          smarty_literal: m.starting_with(/{literal}/).until_after(/{\/literal}/)
        };
      }
      u.prototype = new l(), u.prototype._create = function() {
        return new u(this._input, this);
      }, u.prototype._update = function() {
        this.__set_templated_pattern();
      }, u.prototype.disable = function(c) {
        var h = this._create();
        return h._disabled[c] = !0, h._update(), h;
      }, u.prototype.read_options = function(c) {
        var h = this._create();
        for (var m in o)
          h._disabled[m] = c.templating.indexOf(m) === -1;
        return h._update(), h;
      }, u.prototype.exclude = function(c) {
        var h = this._create();
        return h._excluded[c] = !0, h._update(), h;
      }, u.prototype.read = function() {
        var c = "";
        this._match_pattern ? c = this._input.read(this._starting_pattern) : c = this._input.read(this._starting_pattern, this.__template_pattern);
        for (var h = this._read_template(); h; )
          this._match_pattern ? h += this._input.read(this._match_pattern) : h += this._input.readUntil(this.__template_pattern), c += h, h = this._read_template();
        return this._until_after && (c += this._input.readUntilAfter(this._until_pattern)), c;
      }, u.prototype.__set_templated_pattern = function() {
        var c = [];
        this._disabled.php || c.push(this.__patterns.php._starting_pattern.source), this._disabled.handlebars || c.push(this.__patterns.handlebars._starting_pattern.source), this._disabled.erb || c.push(this.__patterns.erb._starting_pattern.source), this._disabled.django || (c.push(this.__patterns.django._starting_pattern.source), c.push(this.__patterns.django_value._starting_pattern.source), c.push(this.__patterns.django_comment._starting_pattern.source)), this._disabled.smarty || c.push(this.__patterns.smarty._starting_pattern.source), this._until_pattern && c.push(this._until_pattern.source), this.__template_pattern = this._input.get_regexp("(?:" + c.join("|") + ")");
      }, u.prototype._read_template = function() {
        var c = "", h = this._input.peek();
        if (h === "<") {
          var m = this._input.peek(1);
          !this._disabled.php && !this._excluded.php && m === "?" && (c = c || this.__patterns.php.read()), !this._disabled.erb && !this._excluded.erb && m === "%" && (c = c || this.__patterns.erb.read());
        } else
          h === "{" && (!this._disabled.handlebars && !this._excluded.handlebars && (c = c || this.__patterns.handlebars_comment.read(), c = c || this.__patterns.handlebars_unescaped.read(), c = c || this.__patterns.handlebars.read()), this._disabled.django || (!this._excluded.django && !this._excluded.handlebars && (c = c || this.__patterns.django_value.read()), this._excluded.django || (c = c || this.__patterns.django_comment.read(), c = c || this.__patterns.django.read())), this._disabled.smarty || this._disabled.django && this._disabled.handlebars && (c = c || this.__patterns.smarty_comment.read(), c = c || this.__patterns.smarty_literal.read(), c = c || this.__patterns.smarty.read()));
        return c;
      }, r.exports.TemplatablePattern = u;
    },
    ,
    ,
    ,
    function(r, a, s) {
      var l = s(19).Beautifier, o = s(20).Options;
      function u(c, h, m, f) {
        var g = new l(c, h, m, f);
        return g.beautify();
      }
      r.exports = u, r.exports.defaultOptions = function() {
        return new o();
      };
    },
    function(r, a, s) {
      var l = s(20).Options, o = s(2).Output, u = s(21).Tokenizer, c = s(21).TOKEN, h = /\r\n|[\r\n]/, m = /\r\n|[\r\n]/g, f = function(_, b) {
        this.indent_level = 0, this.alignment_size = 0, this.max_preserve_newlines = _.max_preserve_newlines, this.preserve_newlines = _.preserve_newlines, this._output = new o(_, b);
      };
      f.prototype.current_line_has_match = function(_) {
        return this._output.current_line.has_match(_);
      }, f.prototype.set_space_before_token = function(_, b) {
        this._output.space_before_token = _, this._output.non_breaking_space = b;
      }, f.prototype.set_wrap_point = function() {
        this._output.set_indent(this.indent_level, this.alignment_size), this._output.set_wrap_point();
      }, f.prototype.add_raw_token = function(_) {
        this._output.add_raw_token(_);
      }, f.prototype.print_preserved_newlines = function(_) {
        var b = 0;
        _.type !== c.TEXT && _.previous.type !== c.TEXT && (b = _.newlines ? 1 : 0), this.preserve_newlines && (b = _.newlines < this.max_preserve_newlines + 1 ? _.newlines : this.max_preserve_newlines + 1);
        for (var T = 0; T < b; T++)
          this.print_newline(T > 0);
        return b !== 0;
      }, f.prototype.traverse_whitespace = function(_) {
        return _.whitespace_before || _.newlines ? (this.print_preserved_newlines(_) || (this._output.space_before_token = !0), !0) : !1;
      }, f.prototype.previous_token_wrapped = function() {
        return this._output.previous_token_wrapped;
      }, f.prototype.print_newline = function(_) {
        this._output.add_new_line(_);
      }, f.prototype.print_token = function(_) {
        _.text && (this._output.set_indent(this.indent_level, this.alignment_size), this._output.add_token(_.text));
      }, f.prototype.indent = function() {
        this.indent_level++;
      }, f.prototype.get_full_indent = function(_) {
        return _ = this.indent_level + (_ || 0), _ < 1 ? "" : this._output.get_indent_string(_);
      };
      var g = function(_) {
        for (var b = null, T = _.next; T.type !== c.EOF && _.closed !== T; ) {
          if (T.type === c.ATTRIBUTE && T.text === "type") {
            T.next && T.next.type === c.EQUALS && T.next.next && T.next.next.type === c.VALUE && (b = T.next.next.text);
            break;
          }
          T = T.next;
        }
        return b;
      }, p = function(_, b) {
        var T = null, q = null;
        return b.closed ? (_ === "script" ? T = "text/javascript" : _ === "style" && (T = "text/css"), T = g(b) || T, T.search("text/css") > -1 ? q = "css" : T.search(/module|((text|application|dojo)\/(x-)?(javascript|ecmascript|jscript|livescript|(ld\+)?json|method|aspect))/) > -1 ? q = "javascript" : T.search(/(text|application|dojo)\/(x-)?(html)/) > -1 ? q = "html" : T.search(/test\/null/) > -1 && (q = "null"), q) : null;
      };
      function w(_, b) {
        return b.indexOf(_) !== -1;
      }
      function y(_, b, T) {
        this.parent = _ || null, this.tag = b ? b.tag_name : "", this.indent_level = T || 0, this.parser_token = b || null;
      }
      function v(_) {
        this._printer = _, this._current_frame = null;
      }
      v.prototype.get_parser_token = function() {
        return this._current_frame ? this._current_frame.parser_token : null;
      }, v.prototype.record_tag = function(_) {
        var b = new y(this._current_frame, _, this._printer.indent_level);
        this._current_frame = b;
      }, v.prototype._try_pop_frame = function(_) {
        var b = null;
        return _ && (b = _.parser_token, this._printer.indent_level = _.indent_level, this._current_frame = _.parent), b;
      }, v.prototype._get_frame = function(_, b) {
        for (var T = this._current_frame; T && _.indexOf(T.tag) === -1; ) {
          if (b && b.indexOf(T.tag) !== -1) {
            T = null;
            break;
          }
          T = T.parent;
        }
        return T;
      }, v.prototype.try_pop = function(_, b) {
        var T = this._get_frame([_], b);
        return this._try_pop_frame(T);
      }, v.prototype.indent_to_tag = function(_) {
        var b = this._get_frame(_);
        b && (this._printer.indent_level = b.indent_level);
      };
      function x(_, b, T, q) {
        this._source_text = _ || "", b = b || {}, this._js_beautify = T, this._css_beautify = q, this._tag_stack = null;
        var F = new l(b, "html");
        this._options = F, this._is_wrap_attributes_force = this._options.wrap_attributes.substr(0, 5) === "force", this._is_wrap_attributes_force_expand_multiline = this._options.wrap_attributes === "force-expand-multiline", this._is_wrap_attributes_force_aligned = this._options.wrap_attributes === "force-aligned", this._is_wrap_attributes_aligned_multiple = this._options.wrap_attributes === "aligned-multiple", this._is_wrap_attributes_preserve = this._options.wrap_attributes.substr(0, 8) === "preserve", this._is_wrap_attributes_preserve_aligned = this._options.wrap_attributes === "preserve-aligned";
      }
      x.prototype.beautify = function() {
        if (this._options.disabled)
          return this._source_text;
        var _ = this._source_text, b = this._options.eol;
        this._options.eol === "auto" && (b = `
`, _ && h.test(_) && (b = _.match(h)[0])), _ = _.replace(m, `
`);
        var T = _.match(/^[\t ]*/)[0], q = {
          text: "",
          type: ""
        }, F = new E(), S = new f(this._options, T), L = new u(_, this._options).tokenize();
        this._tag_stack = new v(S);
        for (var M = null, D = L.next(); D.type !== c.EOF; )
          D.type === c.TAG_OPEN || D.type === c.COMMENT ? (M = this._handle_tag_open(S, D, F, q), F = M) : D.type === c.ATTRIBUTE || D.type === c.EQUALS || D.type === c.VALUE || D.type === c.TEXT && !F.tag_complete ? M = this._handle_inside_tag(S, D, F, L) : D.type === c.TAG_CLOSE ? M = this._handle_tag_close(S, D, F) : D.type === c.TEXT ? M = this._handle_text(S, D, F) : S.add_raw_token(D), q = M, D = L.next();
        var H = S._output.get_code(b);
        return H;
      }, x.prototype._handle_tag_close = function(_, b, T) {
        var q = {
          text: b.text,
          type: b.type
        };
        return _.alignment_size = 0, T.tag_complete = !0, _.set_space_before_token(b.newlines || b.whitespace_before !== "", !0), T.is_unformatted ? _.add_raw_token(b) : (T.tag_start_char === "<" && (_.set_space_before_token(b.text[0] === "/", !0), this._is_wrap_attributes_force_expand_multiline && T.has_wrapped_attrs && _.print_newline(!1)), _.print_token(b)), T.indent_content && !(T.is_unformatted || T.is_content_unformatted) && (_.indent(), T.indent_content = !1), !T.is_inline_element && !(T.is_unformatted || T.is_content_unformatted) && _.set_wrap_point(), q;
      }, x.prototype._handle_inside_tag = function(_, b, T, q) {
        var F = T.has_wrapped_attrs, S = {
          text: b.text,
          type: b.type
        };
        if (_.set_space_before_token(b.newlines || b.whitespace_before !== "", !0), T.is_unformatted)
          _.add_raw_token(b);
        else if (T.tag_start_char === "{" && b.type === c.TEXT)
          _.print_preserved_newlines(b) ? (b.newlines = 0, _.add_raw_token(b)) : _.print_token(b);
        else {
          if (b.type === c.ATTRIBUTE ? (_.set_space_before_token(!0), T.attr_count += 1) : (b.type === c.EQUALS || b.type === c.VALUE && b.previous.type === c.EQUALS) && _.set_space_before_token(!1), b.type === c.ATTRIBUTE && T.tag_start_char === "<" && ((this._is_wrap_attributes_preserve || this._is_wrap_attributes_preserve_aligned) && (_.traverse_whitespace(b), F = F || b.newlines !== 0), this._is_wrap_attributes_force)) {
            var L = T.attr_count > 1;
            if (this._is_wrap_attributes_force_expand_multiline && T.attr_count === 1) {
              var M = !0, D = 0, H;
              do {
                if (H = q.peek(D), H.type === c.ATTRIBUTE) {
                  M = !1;
                  break;
                }
                D += 1;
              } while (D < 4 && H.type !== c.EOF && H.type !== c.TAG_CLOSE);
              L = !M;
            }
            L && (_.print_newline(!1), F = !0);
          }
          _.print_token(b), F = F || _.previous_token_wrapped(), T.has_wrapped_attrs = F;
        }
        return S;
      }, x.prototype._handle_text = function(_, b, T) {
        var q = {
          text: b.text,
          type: "TK_CONTENT"
        };
        return T.custom_beautifier_name ? this._print_custom_beatifier_text(_, b, T) : T.is_unformatted || T.is_content_unformatted ? _.add_raw_token(b) : (_.traverse_whitespace(b), _.print_token(b)), q;
      }, x.prototype._print_custom_beatifier_text = function(_, b, T) {
        var q = this;
        if (b.text !== "") {
          var F = b.text, S, L = 1, M = "", D = "";
          T.custom_beautifier_name === "javascript" && typeof this._js_beautify == "function" ? S = this._js_beautify : T.custom_beautifier_name === "css" && typeof this._css_beautify == "function" ? S = this._css_beautify : T.custom_beautifier_name === "html" && (S = function(N, z) {
            var P = new x(N, z, q._js_beautify, q._css_beautify);
            return P.beautify();
          }), this._options.indent_scripts === "keep" ? L = 0 : this._options.indent_scripts === "separate" && (L = -_.indent_level);
          var H = _.get_full_indent(L);
          if (F = F.replace(/\n[ \t]*$/, ""), T.custom_beautifier_name !== "html" && F[0] === "<" && F.match(/^(<!--|<!\[CDATA\[)/)) {
            var A = /^(<!--[^\n]*|<!\[CDATA\[)(\n?)([ \t\n]*)([\s\S]*)(-->|]]>)$/.exec(F);
            if (!A) {
              _.add_raw_token(b);
              return;
            }
            M = H + A[1] + `
`, F = A[4], A[5] && (D = H + A[5]), F = F.replace(/\n[ \t]*$/, ""), (A[2] || A[3].indexOf(`
`) !== -1) && (A = A[3].match(/[ \t]+$/), A && (b.whitespace_before = A[0]));
          }
          if (F)
            if (S) {
              var k = function() {
                this.eol = `
`;
              };
              k.prototype = this._options.raw_options;
              var R = new k();
              F = S(H + F, R);
            } else {
              var U = b.whitespace_before;
              U && (F = F.replace(new RegExp(`
(` + U + ")?", "g"), `
`)), F = H + F.replace(/\n/g, `
` + H);
            }
          M && (F ? F = M + F + `
` + D : F = M + D), _.print_newline(!1), F && (b.text = F, b.whitespace_before = "", b.newlines = 0, _.add_raw_token(b), _.print_newline(!0));
        }
      }, x.prototype._handle_tag_open = function(_, b, T, q) {
        var F = this._get_tag_open_token(b);
        return (T.is_unformatted || T.is_content_unformatted) && !T.is_empty_element && b.type === c.TAG_OPEN && b.text.indexOf("</") === 0 ? (_.add_raw_token(b), F.start_tag_token = this._tag_stack.try_pop(F.tag_name)) : (_.traverse_whitespace(b), this._set_tag_position(_, b, F, T, q), F.is_inline_element || _.set_wrap_point(), _.print_token(b)), (this._is_wrap_attributes_force_aligned || this._is_wrap_attributes_aligned_multiple || this._is_wrap_attributes_preserve_aligned) && (F.alignment_size = b.text.length + 1), !F.tag_complete && !F.is_unformatted && (_.alignment_size = F.alignment_size), F;
      };
      var E = function(_, b) {
        if (this.parent = _ || null, this.text = "", this.type = "TK_TAG_OPEN", this.tag_name = "", this.is_inline_element = !1, this.is_unformatted = !1, this.is_content_unformatted = !1, this.is_empty_element = !1, this.is_start_tag = !1, this.is_end_tag = !1, this.indent_content = !1, this.multiline_content = !1, this.custom_beautifier_name = null, this.start_tag_token = null, this.attr_count = 0, this.has_wrapped_attrs = !1, this.alignment_size = 0, this.tag_complete = !1, this.tag_start_char = "", this.tag_check = "", !b)
          this.tag_complete = !0;
        else {
          var T;
          this.tag_start_char = b.text[0], this.text = b.text, this.tag_start_char === "<" ? (T = b.text.match(/^<([^\s>]*)/), this.tag_check = T ? T[1] : "") : (T = b.text.match(/^{{(?:[\^]|#\*?)?([^\s}]+)/), this.tag_check = T ? T[1] : "", b.text === "{{#>" && this.tag_check === ">" && b.next !== null && (this.tag_check = b.next.text)), this.tag_check = this.tag_check.toLowerCase(), b.type === c.COMMENT && (this.tag_complete = !0), this.is_start_tag = this.tag_check.charAt(0) !== "/", this.tag_name = this.is_start_tag ? this.tag_check : this.tag_check.substr(1), this.is_end_tag = !this.is_start_tag || b.closed && b.closed.text === "/>", this.is_end_tag = this.is_end_tag || this.tag_start_char === "{" && (this.text.length < 3 || /[^#\^]/.test(this.text.charAt(2)));
        }
      };
      x.prototype._get_tag_open_token = function(_) {
        var b = new E(this._tag_stack.get_parser_token(), _);
        return b.alignment_size = this._options.wrap_attributes_indent_size, b.is_end_tag = b.is_end_tag || w(b.tag_check, this._options.void_elements), b.is_empty_element = b.tag_complete || b.is_start_tag && b.is_end_tag, b.is_unformatted = !b.tag_complete && w(b.tag_check, this._options.unformatted), b.is_content_unformatted = !b.is_empty_element && w(b.tag_check, this._options.content_unformatted), b.is_inline_element = w(b.tag_name, this._options.inline) || b.tag_start_char === "{", b;
      }, x.prototype._set_tag_position = function(_, b, T, q, F) {
        if (T.is_empty_element || (T.is_end_tag ? T.start_tag_token = this._tag_stack.try_pop(T.tag_name) : (this._do_optional_end_element(T) && (T.is_inline_element || _.print_newline(!1)), this._tag_stack.record_tag(T), (T.tag_name === "script" || T.tag_name === "style") && !(T.is_unformatted || T.is_content_unformatted) && (T.custom_beautifier_name = p(T.tag_check, b)))), w(T.tag_check, this._options.extra_liners) && (_.print_newline(!1), _._output.just_added_blankline() || _.print_newline(!0)), T.is_empty_element) {
          if (T.tag_start_char === "{" && T.tag_check === "else") {
            this._tag_stack.indent_to_tag(["if", "unless", "each"]), T.indent_content = !0;
            var S = _.current_line_has_match(/{{#if/);
            S || _.print_newline(!1);
          }
          T.tag_name === "!--" && F.type === c.TAG_CLOSE && q.is_end_tag && T.text.indexOf(`
`) === -1 || (T.is_inline_element || T.is_unformatted || _.print_newline(!1), this._calcluate_parent_multiline(_, T));
        } else if (T.is_end_tag) {
          var L = !1;
          L = T.start_tag_token && T.start_tag_token.multiline_content, L = L || !T.is_inline_element && !(q.is_inline_element || q.is_unformatted) && !(F.type === c.TAG_CLOSE && T.start_tag_token === q) && F.type !== "TK_CONTENT", (T.is_content_unformatted || T.is_unformatted) && (L = !1), L && _.print_newline(!1);
        } else
          T.indent_content = !T.custom_beautifier_name, T.tag_start_char === "<" && (T.tag_name === "html" ? T.indent_content = this._options.indent_inner_html : T.tag_name === "head" ? T.indent_content = this._options.indent_head_inner_html : T.tag_name === "body" && (T.indent_content = this._options.indent_body_inner_html)), !(T.is_inline_element || T.is_unformatted) && (F.type !== "TK_CONTENT" || T.is_content_unformatted) && _.print_newline(!1), this._calcluate_parent_multiline(_, T);
      }, x.prototype._calcluate_parent_multiline = function(_, b) {
        b.parent && _._output.just_added_newline() && !((b.is_inline_element || b.is_unformatted) && b.parent.is_inline_element) && (b.parent.multiline_content = !0);
      };
      var I = ["address", "article", "aside", "blockquote", "details", "div", "dl", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "main", "nav", "ol", "p", "pre", "section", "table", "ul"], B = ["a", "audio", "del", "ins", "map", "noscript", "video"];
      x.prototype._do_optional_end_element = function(_) {
        var b = null;
        if (!(_.is_empty_element || !_.is_start_tag || !_.parent)) {
          if (_.tag_name === "body")
            b = b || this._tag_stack.try_pop("head");
          else if (_.tag_name === "li")
            b = b || this._tag_stack.try_pop("li", ["ol", "ul"]);
          else if (_.tag_name === "dd" || _.tag_name === "dt")
            b = b || this._tag_stack.try_pop("dt", ["dl"]), b = b || this._tag_stack.try_pop("dd", ["dl"]);
          else if (_.parent.tag_name === "p" && I.indexOf(_.tag_name) !== -1) {
            var T = _.parent.parent;
            (!T || B.indexOf(T.tag_name) === -1) && (b = b || this._tag_stack.try_pop("p"));
          } else
            _.tag_name === "rp" || _.tag_name === "rt" ? (b = b || this._tag_stack.try_pop("rt", ["ruby", "rtc"]), b = b || this._tag_stack.try_pop("rp", ["ruby", "rtc"])) : _.tag_name === "optgroup" ? b = b || this._tag_stack.try_pop("optgroup", ["select"]) : _.tag_name === "option" ? b = b || this._tag_stack.try_pop("option", ["select", "datalist", "optgroup"]) : _.tag_name === "colgroup" ? b = b || this._tag_stack.try_pop("caption", ["table"]) : _.tag_name === "thead" ? (b = b || this._tag_stack.try_pop("caption", ["table"]), b = b || this._tag_stack.try_pop("colgroup", ["table"])) : _.tag_name === "tbody" || _.tag_name === "tfoot" ? (b = b || this._tag_stack.try_pop("caption", ["table"]), b = b || this._tag_stack.try_pop("colgroup", ["table"]), b = b || this._tag_stack.try_pop("thead", ["table"]), b = b || this._tag_stack.try_pop("tbody", ["table"])) : _.tag_name === "tr" ? (b = b || this._tag_stack.try_pop("caption", ["table"]), b = b || this._tag_stack.try_pop("colgroup", ["table"]), b = b || this._tag_stack.try_pop("tr", ["table", "thead", "tbody", "tfoot"])) : (_.tag_name === "th" || _.tag_name === "td") && (b = b || this._tag_stack.try_pop("td", ["table", "thead", "tbody", "tfoot", "tr"]), b = b || this._tag_stack.try_pop("th", ["table", "thead", "tbody", "tfoot", "tr"]));
          return _.parent = this._tag_stack.get_parser_token(), b;
        }
      }, r.exports.Beautifier = x;
    },
    function(r, a, s) {
      var l = s(6).Options;
      function o(u) {
        l.call(this, u, "html"), this.templating.length === 1 && this.templating[0] === "auto" && (this.templating = ["django", "erb", "handlebars", "php"]), this.indent_inner_html = this._get_boolean("indent_inner_html"), this.indent_body_inner_html = this._get_boolean("indent_body_inner_html", !0), this.indent_head_inner_html = this._get_boolean("indent_head_inner_html", !0), this.indent_handlebars = this._get_boolean("indent_handlebars", !0), this.wrap_attributes = this._get_selection("wrap_attributes", ["auto", "force", "force-aligned", "force-expand-multiline", "aligned-multiple", "preserve", "preserve-aligned"]), this.wrap_attributes_indent_size = this._get_number("wrap_attributes_indent_size", this.indent_size), this.extra_liners = this._get_array("extra_liners", ["head", "body", "/html"]), this.inline = this._get_array("inline", [
          "a",
          "abbr",
          "area",
          "audio",
          "b",
          "bdi",
          "bdo",
          "br",
          "button",
          "canvas",
          "cite",
          "code",
          "data",
          "datalist",
          "del",
          "dfn",
          "em",
          "embed",
          "i",
          "iframe",
          "img",
          "input",
          "ins",
          "kbd",
          "keygen",
          "label",
          "map",
          "mark",
          "math",
          "meter",
          "noscript",
          "object",
          "output",
          "progress",
          "q",
          "ruby",
          "s",
          "samp",
          "select",
          "small",
          "span",
          "strong",
          "sub",
          "sup",
          "svg",
          "template",
          "textarea",
          "time",
          "u",
          "var",
          "video",
          "wbr",
          "text",
          "acronym",
          "big",
          "strike",
          "tt"
        ]), this.void_elements = this._get_array("void_elements", [
          "area",
          "base",
          "br",
          "col",
          "embed",
          "hr",
          "img",
          "input",
          "keygen",
          "link",
          "menuitem",
          "meta",
          "param",
          "source",
          "track",
          "wbr",
          "!doctype",
          "?xml",
          "basefont",
          "isindex"
        ]), this.unformatted = this._get_array("unformatted", []), this.content_unformatted = this._get_array("content_unformatted", [
          "pre",
          "textarea"
        ]), this.unformatted_content_delimiter = this._get_characters("unformatted_content_delimiter"), this.indent_scripts = this._get_selection("indent_scripts", ["normal", "keep", "separate"]);
      }
      o.prototype = new l(), r.exports.Options = o;
    },
    function(r, a, s) {
      var l = s(9).Tokenizer, o = s(9).TOKEN, u = s(13).Directives, c = s(14).TemplatablePattern, h = s(12).Pattern, m = {
        TAG_OPEN: "TK_TAG_OPEN",
        TAG_CLOSE: "TK_TAG_CLOSE",
        ATTRIBUTE: "TK_ATTRIBUTE",
        EQUALS: "TK_EQUALS",
        VALUE: "TK_VALUE",
        COMMENT: "TK_COMMENT",
        TEXT: "TK_TEXT",
        UNKNOWN: "TK_UNKNOWN",
        START: o.START,
        RAW: o.RAW,
        EOF: o.EOF
      }, f = new u(/<\!--/, /-->/), g = function(p, w) {
        l.call(this, p, w), this._current_tag_name = "";
        var y = new c(this._input).read_options(this._options), v = new h(this._input);
        if (this.__patterns = {
          word: y.until(/[\n\r\t <]/),
          single_quote: y.until_after(/'/),
          double_quote: y.until_after(/"/),
          attribute: y.until(/[\n\r\t =>]|\/>/),
          element_name: y.until(/[\n\r\t >\/]/),
          handlebars_comment: v.starting_with(/{{!--/).until_after(/--}}/),
          handlebars: v.starting_with(/{{/).until_after(/}}/),
          handlebars_open: v.until(/[\n\r\t }]/),
          handlebars_raw_close: v.until(/}}/),
          comment: v.starting_with(/<!--/).until_after(/-->/),
          cdata: v.starting_with(/<!\[CDATA\[/).until_after(/]]>/),
          conditional_comment: v.starting_with(/<!\[/).until_after(/]>/),
          processing: v.starting_with(/<\?/).until_after(/\?>/)
        }, this._options.indent_handlebars && (this.__patterns.word = this.__patterns.word.exclude("handlebars")), this._unformatted_content_delimiter = null, this._options.unformatted_content_delimiter) {
          var x = this._input.get_literal_regexp(this._options.unformatted_content_delimiter);
          this.__patterns.unformatted_content_delimiter = v.matching(x).until_after(x);
        }
      };
      g.prototype = new l(), g.prototype._is_comment = function(p) {
        return !1;
      }, g.prototype._is_opening = function(p) {
        return p.type === m.TAG_OPEN;
      }, g.prototype._is_closing = function(p, w) {
        return p.type === m.TAG_CLOSE && w && ((p.text === ">" || p.text === "/>") && w.text[0] === "<" || p.text === "}}" && w.text[0] === "{" && w.text[1] === "{");
      }, g.prototype._reset = function() {
        this._current_tag_name = "";
      }, g.prototype._get_next_token = function(p, w) {
        var y = null;
        this._readWhitespace();
        var v = this._input.peek();
        return v === null ? this._create_token(m.EOF, "") : (y = y || this._read_open_handlebars(v, w), y = y || this._read_attribute(v, p, w), y = y || this._read_close(v, w), y = y || this._read_raw_content(v, p, w), y = y || this._read_content_word(v), y = y || this._read_comment_or_cdata(v), y = y || this._read_processing(v), y = y || this._read_open(v, w), y = y || this._create_token(m.UNKNOWN, this._input.next()), y);
      }, g.prototype._read_comment_or_cdata = function(p) {
        var w = null, y = null, v = null;
        if (p === "<") {
          var x = this._input.peek(1);
          x === "!" && (y = this.__patterns.comment.read(), y ? (v = f.get_directives(y), v && v.ignore === "start" && (y += f.readIgnored(this._input))) : y = this.__patterns.cdata.read()), y && (w = this._create_token(m.COMMENT, y), w.directives = v);
        }
        return w;
      }, g.prototype._read_processing = function(p) {
        var w = null, y = null, v = null;
        if (p === "<") {
          var x = this._input.peek(1);
          (x === "!" || x === "?") && (y = this.__patterns.conditional_comment.read(), y = y || this.__patterns.processing.read()), y && (w = this._create_token(m.COMMENT, y), w.directives = v);
        }
        return w;
      }, g.prototype._read_open = function(p, w) {
        var y = null, v = null;
        return w || p === "<" && (y = this._input.next(), this._input.peek() === "/" && (y += this._input.next()), y += this.__patterns.element_name.read(), v = this._create_token(m.TAG_OPEN, y)), v;
      }, g.prototype._read_open_handlebars = function(p, w) {
        var y = null, v = null;
        return w || this._options.indent_handlebars && p === "{" && this._input.peek(1) === "{" && (this._input.peek(2) === "!" ? (y = this.__patterns.handlebars_comment.read(), y = y || this.__patterns.handlebars.read(), v = this._create_token(m.COMMENT, y)) : (y = this.__patterns.handlebars_open.read(), v = this._create_token(m.TAG_OPEN, y))), v;
      }, g.prototype._read_close = function(p, w) {
        var y = null, v = null;
        return w && (w.text[0] === "<" && (p === ">" || p === "/" && this._input.peek(1) === ">") ? (y = this._input.next(), p === "/" && (y += this._input.next()), v = this._create_token(m.TAG_CLOSE, y)) : w.text[0] === "{" && p === "}" && this._input.peek(1) === "}" && (this._input.next(), this._input.next(), v = this._create_token(m.TAG_CLOSE, "}}"))), v;
      }, g.prototype._read_attribute = function(p, w, y) {
        var v = null, x = "";
        if (y && y.text[0] === "<")
          if (p === "=")
            v = this._create_token(m.EQUALS, this._input.next());
          else if (p === '"' || p === "'") {
            var E = this._input.next();
            p === '"' ? E += this.__patterns.double_quote.read() : E += this.__patterns.single_quote.read(), v = this._create_token(m.VALUE, E);
          } else
            x = this.__patterns.attribute.read(), x && (w.type === m.EQUALS ? v = this._create_token(m.VALUE, x) : v = this._create_token(m.ATTRIBUTE, x));
        return v;
      }, g.prototype._is_content_unformatted = function(p) {
        return this._options.void_elements.indexOf(p) === -1 && (this._options.content_unformatted.indexOf(p) !== -1 || this._options.unformatted.indexOf(p) !== -1);
      }, g.prototype._read_raw_content = function(p, w, y) {
        var v = "";
        if (y && y.text[0] === "{")
          v = this.__patterns.handlebars_raw_close.read();
        else if (w.type === m.TAG_CLOSE && w.opened.text[0] === "<" && w.text[0] !== "/") {
          var x = w.opened.text.substr(1).toLowerCase();
          if (x === "script" || x === "style") {
            var E = this._read_comment_or_cdata(p);
            if (E)
              return E.type = m.TEXT, E;
            v = this._input.readUntil(new RegExp("</" + x + "[\\n\\r\\t ]*?>", "ig"));
          } else
            this._is_content_unformatted(x) && (v = this._input.readUntil(new RegExp("</" + x + "[\\n\\r\\t ]*?>", "ig")));
        }
        return v ? this._create_token(m.TEXT, v) : null;
      }, g.prototype._read_content_word = function(p) {
        var w = "";
        if (this._options.unformatted_content_delimiter && p === this._options.unformatted_content_delimiter[0] && (w = this.__patterns.unformatted_content_delimiter.read()), w || (w = this.__patterns.word.read()), w)
          return this._create_token(m.TEXT, w);
      }, r.exports.Tokenizer = g, r.exports.TOKEN = m;
    }
  ], t = {};
  function n(r) {
    var a = t[r];
    if (a !== void 0)
      return a.exports;
    var s = t[r] = {
      exports: {}
    };
    return e[r](s, s.exports, n), s.exports;
  }
  var i = n(18);
  es = i;
})();
function pu(e, t) {
  return es(e, t, mu, fu);
}
function gu(e, t, n) {
  var i = e.getText(), r = !0, a = 0, s = n.tabSize || 4;
  if (t) {
    for (var l = e.offsetAt(t.start), o = l; o > 0 && ka(i, o - 1); )
      o--;
    o === 0 || xa(i, o - 1) ? l = o : o < l && (l = o + 1);
    for (var u = e.offsetAt(t.end), c = u; c < i.length && ka(i, c); )
      c++;
    (c === i.length || xa(i, c)) && (u = c), t = Y.create(e.positionAt(l), e.positionAt(u));
    var h = i.substring(0, l);
    if (new RegExp(/.*[<][^>]*$/).test(h))
      return i = i.substring(l, u), [{
        range: t,
        newText: i
      }];
    if (r = u === i.length, i = i.substring(l, u), l !== 0) {
      var m = e.offsetAt(ce.create(t.start.line, 0));
      a = _u(e.getText(), m, n);
    }
  } else
    t = Y.create(ce.create(0, 0), e.positionAt(i.length));
  var f = {
    indent_size: s,
    indent_char: n.insertSpaces ? " " : "	",
    indent_empty_lines: we(n, "indentEmptyLines", !1),
    wrap_line_length: we(n, "wrapLineLength", 120),
    unformatted: Cn(n, "unformatted", void 0),
    content_unformatted: Cn(n, "contentUnformatted", void 0),
    indent_inner_html: we(n, "indentInnerHtml", !1),
    preserve_newlines: we(n, "preserveNewLines", !0),
    max_preserve_newlines: we(n, "maxPreserveNewLines", 32786),
    indent_handlebars: we(n, "indentHandlebars", !1),
    end_with_newline: r && we(n, "endWithNewline", !1),
    extra_liners: Cn(n, "extraLiners", void 0),
    wrap_attributes: we(n, "wrapAttributes", "auto"),
    wrap_attributes_indent_size: we(n, "wrapAttributesIndentSize", void 0),
    eol: `
`,
    indent_scripts: we(n, "indentScripts", "normal"),
    templating: vu(n, "all"),
    unformatted_content_delimiter: we(n, "unformattedContentDelimiter", "")
  }, g = pu(bu(i), f);
  if (a > 0) {
    var p = n.insertSpaces ? _a(" ", s * a) : _a("	", a);
    g = g.split(`
`).join(`
` + p), t.start.character === 0 && (g = p + g);
  }
  return [{
    range: t,
    newText: g
  }];
}
function bu(e) {
  return e.replace(/^\s+/, "");
}
function we(e, t, n) {
  if (e && e.hasOwnProperty(t)) {
    var i = e[t];
    if (i !== null)
      return i;
  }
  return n;
}
function Cn(e, t, n) {
  var i = we(e, t, null);
  return typeof i == "string" ? i.length > 0 ? i.split(",").map(function(r) {
    return r.trim().toLowerCase();
  }) : [] : n;
}
function vu(e, t) {
  var n = we(e, "templating", t);
  return n === !0 ? ["auto"] : ["none"];
}
function _u(e, t, n) {
  for (var i = t, r = 0, a = n.tabSize || 4; i < e.length; ) {
    var s = e.charAt(i);
    if (s === " ")
      r++;
    else if (s === "	")
      r += a;
    else
      break;
    i++;
  }
  return Math.floor(r / a);
}
function xa(e, t) {
  return `\r
`.indexOf(e.charAt(t)) !== -1;
}
function ka(e, t) {
  return " 	".indexOf(e.charAt(t)) !== -1;
}
var ts;
ts = (() => {
  var e = { 470: (i) => {
    function r(l) {
      if (typeof l != "string")
        throw new TypeError("Path must be a string. Received " + JSON.stringify(l));
    }
    function a(l, o) {
      for (var u, c = "", h = 0, m = -1, f = 0, g = 0; g <= l.length; ++g) {
        if (g < l.length)
          u = l.charCodeAt(g);
        else {
          if (u === 47)
            break;
          u = 47;
        }
        if (u === 47) {
          if (!(m === g - 1 || f === 1))
            if (m !== g - 1 && f === 2) {
              if (c.length < 2 || h !== 2 || c.charCodeAt(c.length - 1) !== 46 || c.charCodeAt(c.length - 2) !== 46) {
                if (c.length > 2) {
                  var p = c.lastIndexOf("/");
                  if (p !== c.length - 1) {
                    p === -1 ? (c = "", h = 0) : h = (c = c.slice(0, p)).length - 1 - c.lastIndexOf("/"), m = g, f = 0;
                    continue;
                  }
                } else if (c.length === 2 || c.length === 1) {
                  c = "", h = 0, m = g, f = 0;
                  continue;
                }
              }
              o && (c.length > 0 ? c += "/.." : c = "..", h = 2);
            } else
              c.length > 0 ? c += "/" + l.slice(m + 1, g) : c = l.slice(m + 1, g), h = g - m - 1;
          m = g, f = 0;
        } else
          u === 46 && f !== -1 ? ++f : f = -1;
      }
      return c;
    }
    var s = { resolve: function() {
      for (var l, o = "", u = !1, c = arguments.length - 1; c >= -1 && !u; c--) {
        var h;
        c >= 0 ? h = arguments[c] : (l === void 0 && (l = process.cwd()), h = l), r(h), h.length !== 0 && (o = h + "/" + o, u = h.charCodeAt(0) === 47);
      }
      return o = a(o, !u), u ? o.length > 0 ? "/" + o : "/" : o.length > 0 ? o : ".";
    }, normalize: function(l) {
      if (r(l), l.length === 0)
        return ".";
      var o = l.charCodeAt(0) === 47, u = l.charCodeAt(l.length - 1) === 47;
      return (l = a(l, !o)).length !== 0 || o || (l = "."), l.length > 0 && u && (l += "/"), o ? "/" + l : l;
    }, isAbsolute: function(l) {
      return r(l), l.length > 0 && l.charCodeAt(0) === 47;
    }, join: function() {
      if (arguments.length === 0)
        return ".";
      for (var l, o = 0; o < arguments.length; ++o) {
        var u = arguments[o];
        r(u), u.length > 0 && (l === void 0 ? l = u : l += "/" + u);
      }
      return l === void 0 ? "." : s.normalize(l);
    }, relative: function(l, o) {
      if (r(l), r(o), l === o || (l = s.resolve(l)) === (o = s.resolve(o)))
        return "";
      for (var u = 1; u < l.length && l.charCodeAt(u) === 47; ++u)
        ;
      for (var c = l.length, h = c - u, m = 1; m < o.length && o.charCodeAt(m) === 47; ++m)
        ;
      for (var f = o.length - m, g = h < f ? h : f, p = -1, w = 0; w <= g; ++w) {
        if (w === g) {
          if (f > g) {
            if (o.charCodeAt(m + w) === 47)
              return o.slice(m + w + 1);
            if (w === 0)
              return o.slice(m + w);
          } else
            h > g && (l.charCodeAt(u + w) === 47 ? p = w : w === 0 && (p = 0));
          break;
        }
        var y = l.charCodeAt(u + w);
        if (y !== o.charCodeAt(m + w))
          break;
        y === 47 && (p = w);
      }
      var v = "";
      for (w = u + p + 1; w <= c; ++w)
        w !== c && l.charCodeAt(w) !== 47 || (v.length === 0 ? v += ".." : v += "/..");
      return v.length > 0 ? v + o.slice(m + p) : (m += p, o.charCodeAt(m) === 47 && ++m, o.slice(m));
    }, _makeLong: function(l) {
      return l;
    }, dirname: function(l) {
      if (r(l), l.length === 0)
        return ".";
      for (var o = l.charCodeAt(0), u = o === 47, c = -1, h = !0, m = l.length - 1; m >= 1; --m)
        if ((o = l.charCodeAt(m)) === 47) {
          if (!h) {
            c = m;
            break;
          }
        } else
          h = !1;
      return c === -1 ? u ? "/" : "." : u && c === 1 ? "//" : l.slice(0, c);
    }, basename: function(l, o) {
      if (o !== void 0 && typeof o != "string")
        throw new TypeError('"ext" argument must be a string');
      r(l);
      var u, c = 0, h = -1, m = !0;
      if (o !== void 0 && o.length > 0 && o.length <= l.length) {
        if (o.length === l.length && o === l)
          return "";
        var f = o.length - 1, g = -1;
        for (u = l.length - 1; u >= 0; --u) {
          var p = l.charCodeAt(u);
          if (p === 47) {
            if (!m) {
              c = u + 1;
              break;
            }
          } else
            g === -1 && (m = !1, g = u + 1), f >= 0 && (p === o.charCodeAt(f) ? --f == -1 && (h = u) : (f = -1, h = g));
        }
        return c === h ? h = g : h === -1 && (h = l.length), l.slice(c, h);
      }
      for (u = l.length - 1; u >= 0; --u)
        if (l.charCodeAt(u) === 47) {
          if (!m) {
            c = u + 1;
            break;
          }
        } else
          h === -1 && (m = !1, h = u + 1);
      return h === -1 ? "" : l.slice(c, h);
    }, extname: function(l) {
      r(l);
      for (var o = -1, u = 0, c = -1, h = !0, m = 0, f = l.length - 1; f >= 0; --f) {
        var g = l.charCodeAt(f);
        if (g !== 47)
          c === -1 && (h = !1, c = f + 1), g === 46 ? o === -1 ? o = f : m !== 1 && (m = 1) : o !== -1 && (m = -1);
        else if (!h) {
          u = f + 1;
          break;
        }
      }
      return o === -1 || c === -1 || m === 0 || m === 1 && o === c - 1 && o === u + 1 ? "" : l.slice(o, c);
    }, format: function(l) {
      if (l === null || typeof l != "object")
        throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof l);
      return function(o, u) {
        var c = u.dir || u.root, h = u.base || (u.name || "") + (u.ext || "");
        return c ? c === u.root ? c + h : c + "/" + h : h;
      }(0, l);
    }, parse: function(l) {
      r(l);
      var o = { root: "", dir: "", base: "", ext: "", name: "" };
      if (l.length === 0)
        return o;
      var u, c = l.charCodeAt(0), h = c === 47;
      h ? (o.root = "/", u = 1) : u = 0;
      for (var m = -1, f = 0, g = -1, p = !0, w = l.length - 1, y = 0; w >= u; --w)
        if ((c = l.charCodeAt(w)) !== 47)
          g === -1 && (p = !1, g = w + 1), c === 46 ? m === -1 ? m = w : y !== 1 && (y = 1) : m !== -1 && (y = -1);
        else if (!p) {
          f = w + 1;
          break;
        }
      return m === -1 || g === -1 || y === 0 || y === 1 && m === g - 1 && m === f + 1 ? g !== -1 && (o.base = o.name = f === 0 && h ? l.slice(1, g) : l.slice(f, g)) : (f === 0 && h ? (o.name = l.slice(1, m), o.base = l.slice(1, g)) : (o.name = l.slice(f, m), o.base = l.slice(f, g)), o.ext = l.slice(m, g)), f > 0 ? o.dir = l.slice(0, f - 1) : h && (o.dir = "/"), o;
    }, sep: "/", delimiter: ":", win32: null, posix: null };
    s.posix = s, i.exports = s;
  }, 447: (i, r, a) => {
    var s;
    if (a.r(r), a.d(r, { URI: () => v, Utils: () => L }), typeof process == "object")
      s = process.platform === "win32";
    else if (typeof navigator == "object") {
      var l = navigator.userAgent;
      s = l.indexOf("Windows") >= 0;
    }
    var o, u, c = (o = function(A, k) {
      return (o = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(R, U) {
        R.__proto__ = U;
      } || function(R, U) {
        for (var N in U)
          Object.prototype.hasOwnProperty.call(U, N) && (R[N] = U[N]);
      })(A, k);
    }, function(A, k) {
      if (typeof k != "function" && k !== null)
        throw new TypeError("Class extends value " + String(k) + " is not a constructor or null");
      function R() {
        this.constructor = A;
      }
      o(A, k), A.prototype = k === null ? Object.create(k) : (R.prototype = k.prototype, new R());
    }), h = /^\w[\w\d+.-]*$/, m = /^\//, f = /^\/\//;
    function g(A, k) {
      if (!A.scheme && k)
        throw new Error('[UriError]: Scheme is missing: {scheme: "", authority: "'.concat(A.authority, '", path: "').concat(A.path, '", query: "').concat(A.query, '", fragment: "').concat(A.fragment, '"}'));
      if (A.scheme && !h.test(A.scheme))
        throw new Error("[UriError]: Scheme contains illegal characters.");
      if (A.path) {
        if (A.authority) {
          if (!m.test(A.path))
            throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
        } else if (f.test(A.path))
          throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
      }
    }
    var p = "", w = "/", y = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/, v = function() {
      function A(k, R, U, N, z, P) {
        P === void 0 && (P = !1), typeof k == "object" ? (this.scheme = k.scheme || p, this.authority = k.authority || p, this.path = k.path || p, this.query = k.query || p, this.fragment = k.fragment || p) : (this.scheme = function(J, $) {
          return J || $ ? J : "file";
        }(k, P), this.authority = R || p, this.path = function(J, $) {
          switch (J) {
            case "https":
            case "http":
            case "file":
              $ ? $[0] !== w && ($ = w + $) : $ = w;
          }
          return $;
        }(this.scheme, U || p), this.query = N || p, this.fragment = z || p, g(this, P));
      }
      return A.isUri = function(k) {
        return k instanceof A || !!k && typeof k.authority == "string" && typeof k.fragment == "string" && typeof k.path == "string" && typeof k.query == "string" && typeof k.scheme == "string" && typeof k.fsPath == "string" && typeof k.with == "function" && typeof k.toString == "function";
      }, Object.defineProperty(A.prototype, "fsPath", { get: function() {
        return b(this, !1);
      }, enumerable: !1, configurable: !0 }), A.prototype.with = function(k) {
        if (!k)
          return this;
        var R = k.scheme, U = k.authority, N = k.path, z = k.query, P = k.fragment;
        return R === void 0 ? R = this.scheme : R === null && (R = p), U === void 0 ? U = this.authority : U === null && (U = p), N === void 0 ? N = this.path : N === null && (N = p), z === void 0 ? z = this.query : z === null && (z = p), P === void 0 ? P = this.fragment : P === null && (P = p), R === this.scheme && U === this.authority && N === this.path && z === this.query && P === this.fragment ? this : new E(R, U, N, z, P);
      }, A.parse = function(k, R) {
        R === void 0 && (R = !1);
        var U = y.exec(k);
        return U ? new E(U[2] || p, S(U[4] || p), S(U[5] || p), S(U[7] || p), S(U[9] || p), R) : new E(p, p, p, p, p);
      }, A.file = function(k) {
        var R = p;
        if (s && (k = k.replace(/\\/g, w)), k[0] === w && k[1] === w) {
          var U = k.indexOf(w, 2);
          U === -1 ? (R = k.substring(2), k = w) : (R = k.substring(2, U), k = k.substring(U) || w);
        }
        return new E("file", R, k, p, p);
      }, A.from = function(k) {
        var R = new E(k.scheme, k.authority, k.path, k.query, k.fragment);
        return g(R, !0), R;
      }, A.prototype.toString = function(k) {
        return k === void 0 && (k = !1), T(this, k);
      }, A.prototype.toJSON = function() {
        return this;
      }, A.revive = function(k) {
        if (k) {
          if (k instanceof A)
            return k;
          var R = new E(k);
          return R._formatted = k.external, R._fsPath = k._sep === x ? k.fsPath : null, R;
        }
        return k;
      }, A;
    }(), x = s ? 1 : void 0, E = function(A) {
      function k() {
        var R = A !== null && A.apply(this, arguments) || this;
        return R._formatted = null, R._fsPath = null, R;
      }
      return c(k, A), Object.defineProperty(k.prototype, "fsPath", { get: function() {
        return this._fsPath || (this._fsPath = b(this, !1)), this._fsPath;
      }, enumerable: !1, configurable: !0 }), k.prototype.toString = function(R) {
        return R === void 0 && (R = !1), R ? T(this, !0) : (this._formatted || (this._formatted = T(this, !1)), this._formatted);
      }, k.prototype.toJSON = function() {
        var R = { $mid: 1 };
        return this._fsPath && (R.fsPath = this._fsPath, R._sep = x), this._formatted && (R.external = this._formatted), this.path && (R.path = this.path), this.scheme && (R.scheme = this.scheme), this.authority && (R.authority = this.authority), this.query && (R.query = this.query), this.fragment && (R.fragment = this.fragment), R;
      }, k;
    }(v), I = ((u = {})[58] = "%3A", u[47] = "%2F", u[63] = "%3F", u[35] = "%23", u[91] = "%5B", u[93] = "%5D", u[64] = "%40", u[33] = "%21", u[36] = "%24", u[38] = "%26", u[39] = "%27", u[40] = "%28", u[41] = "%29", u[42] = "%2A", u[43] = "%2B", u[44] = "%2C", u[59] = "%3B", u[61] = "%3D", u[32] = "%20", u);
    function B(A, k) {
      for (var R = void 0, U = -1, N = 0; N < A.length; N++) {
        var z = A.charCodeAt(N);
        if (z >= 97 && z <= 122 || z >= 65 && z <= 90 || z >= 48 && z <= 57 || z === 45 || z === 46 || z === 95 || z === 126 || k && z === 47)
          U !== -1 && (R += encodeURIComponent(A.substring(U, N)), U = -1), R !== void 0 && (R += A.charAt(N));
        else {
          R === void 0 && (R = A.substr(0, N));
          var P = I[z];
          P !== void 0 ? (U !== -1 && (R += encodeURIComponent(A.substring(U, N)), U = -1), R += P) : U === -1 && (U = N);
        }
      }
      return U !== -1 && (R += encodeURIComponent(A.substring(U))), R !== void 0 ? R : A;
    }
    function _(A) {
      for (var k = void 0, R = 0; R < A.length; R++) {
        var U = A.charCodeAt(R);
        U === 35 || U === 63 ? (k === void 0 && (k = A.substr(0, R)), k += I[U]) : k !== void 0 && (k += A[R]);
      }
      return k !== void 0 ? k : A;
    }
    function b(A, k) {
      var R;
      return R = A.authority && A.path.length > 1 && A.scheme === "file" ? "//".concat(A.authority).concat(A.path) : A.path.charCodeAt(0) === 47 && (A.path.charCodeAt(1) >= 65 && A.path.charCodeAt(1) <= 90 || A.path.charCodeAt(1) >= 97 && A.path.charCodeAt(1) <= 122) && A.path.charCodeAt(2) === 58 ? k ? A.path.substr(1) : A.path[1].toLowerCase() + A.path.substr(2) : A.path, s && (R = R.replace(/\//g, "\\")), R;
    }
    function T(A, k) {
      var R = k ? _ : B, U = "", N = A.scheme, z = A.authority, P = A.path, J = A.query, $ = A.fragment;
      if (N && (U += N, U += ":"), (z || N === "file") && (U += w, U += w), z) {
        var X = z.indexOf("@");
        if (X !== -1) {
          var Z = z.substr(0, X);
          z = z.substr(X + 1), (X = Z.indexOf(":")) === -1 ? U += R(Z, !1) : (U += R(Z.substr(0, X), !1), U += ":", U += R(Z.substr(X + 1), !1)), U += "@";
        }
        (X = (z = z.toLowerCase()).indexOf(":")) === -1 ? U += R(z, !1) : (U += R(z.substr(0, X), !1), U += z.substr(X));
      }
      if (P) {
        if (P.length >= 3 && P.charCodeAt(0) === 47 && P.charCodeAt(2) === 58)
          (me = P.charCodeAt(1)) >= 65 && me <= 90 && (P = "/".concat(String.fromCharCode(me + 32), ":").concat(P.substr(3)));
        else if (P.length >= 2 && P.charCodeAt(1) === 58) {
          var me;
          (me = P.charCodeAt(0)) >= 65 && me <= 90 && (P = "".concat(String.fromCharCode(me + 32), ":").concat(P.substr(2)));
        }
        U += R(P, !0);
      }
      return J && (U += "?", U += R(J, !1)), $ && (U += "#", U += k ? $ : B($, !1)), U;
    }
    function q(A) {
      try {
        return decodeURIComponent(A);
      } catch {
        return A.length > 3 ? A.substr(0, 3) + q(A.substr(3)) : A;
      }
    }
    var F = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
    function S(A) {
      return A.match(F) ? A.replace(F, function(k) {
        return q(k);
      }) : A;
    }
    var L, M = a(470), D = function(A, k, R) {
      if (R || arguments.length === 2)
        for (var U, N = 0, z = k.length; N < z; N++)
          !U && N in k || (U || (U = Array.prototype.slice.call(k, 0, N)), U[N] = k[N]);
      return A.concat(U || Array.prototype.slice.call(k));
    }, H = M.posix || M;
    (function(A) {
      A.joinPath = function(k) {
        for (var R = [], U = 1; U < arguments.length; U++)
          R[U - 1] = arguments[U];
        return k.with({ path: H.join.apply(H, D([k.path], R, !1)) });
      }, A.resolvePath = function(k) {
        for (var R = [], U = 1; U < arguments.length; U++)
          R[U - 1] = arguments[U];
        var N = k.path || "/";
        return k.with({ path: H.resolve.apply(H, D([N], R, !1)) });
      }, A.dirname = function(k) {
        var R = H.dirname(k.path);
        return R.length === 1 && R.charCodeAt(0) === 46 ? k : k.with({ path: R });
      }, A.basename = function(k) {
        return H.basename(k.path);
      }, A.extname = function(k) {
        return H.extname(k.path);
      };
    })(L || (L = {}));
  } }, t = {};
  function n(i) {
    if (t[i])
      return t[i].exports;
    var r = t[i] = { exports: {} };
    return e[i](r, r.exports, n), r.exports;
  }
  return n.d = (i, r) => {
    for (var a in r)
      n.o(r, a) && !n.o(i, a) && Object.defineProperty(i, a, { enumerable: !0, get: r[a] });
  }, n.o = (i, r) => Object.prototype.hasOwnProperty.call(i, r), n.r = (i) => {
    typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(i, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(i, "__esModule", { value: !0 });
  }, n(447);
})();
var { URI: wu, Utils: ju } = ts;
function si(e) {
  var t = e[0], n = e[e.length - 1];
  return t === n && (t === "'" || t === '"') && (e = e.substr(1, e.length - 2)), e;
}
function yu(e, t) {
  return !e.length || t === "handlebars" && /{{|}}/.test(e) ? !1 : /\b(w[\w\d+.-]*:\/\/)?[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/?))/.test(e);
}
function Tu(e, t, n, i) {
  if (!(/^\s*javascript\:/i.test(t) || /[\n\r]/.test(t))) {
    if (t = t.replace(/^\s*/g, ""), /^https?:\/\//i.test(t) || /^file:\/\//i.test(t))
      return t;
    if (/^\#/i.test(t))
      return e + t;
    if (/^\/\//i.test(t)) {
      var r = Ye(e, "https://") ? "https" : "http";
      return r + ":" + t.replace(/^\s*/g, "");
    }
    return n ? n.resolveReference(t, i || e) : t;
  }
}
function xu(e, t, n, i, r, a) {
  var s = si(n);
  if (yu(s, e.languageId)) {
    s.length < n.length && (i++, r--);
    var l = Tu(e.uri, s, t, a);
    if (!(!l || !ku(l)))
      return {
        range: Y.create(e.positionAt(i), e.positionAt(r)),
        target: l
      };
  }
}
function ku(e) {
  try {
    return wu.parse(e), !0;
  } catch {
    return !1;
  }
}
function Au(e, t) {
  for (var n = [], i = ye(e.getText(), 0), r = i.scan(), a = void 0, s = !1, l = void 0, o = {}; r !== W.EOS; ) {
    switch (r) {
      case W.StartTag:
        if (!l) {
          var u = i.getTokenText().toLowerCase();
          s = u === "base";
        }
        break;
      case W.AttributeName:
        a = i.getTokenText().toLowerCase();
        break;
      case W.AttributeValue:
        if (a === "src" || a === "href") {
          var c = i.getTokenText();
          if (!s) {
            var h = xu(e, t, c, i.getTokenOffset(), i.getTokenEnd(), l);
            h && n.push(h);
          }
          s && typeof l > "u" && (l = si(c), l && t && (l = t.resolveReference(l, e.uri))), s = !1, a = void 0;
        } else if (a === "id") {
          var m = si(i.getTokenText());
          o[m] = i.getTokenOffset();
        }
        break;
    }
    r = i.scan();
  }
  for (var f = 0, g = n; f < g.length; f++) {
    var h = g[f], p = e.uri + "#";
    if (h.target && Ye(h.target, p)) {
      var w = h.target.substr(p.length), y = o[w];
      if (y !== void 0) {
        var v = e.positionAt(y);
        h.target = "".concat(p).concat(v.line + 1, ",").concat(v.character + 1);
      }
    }
  }
  return n;
}
function Su(e, t, n) {
  var i = e.offsetAt(t), r = n.findNodeAt(i);
  if (!r.tag)
    return [];
  var a = [], s = La(W.StartTag, e, r.start), l = typeof r.endTagStart == "number" && La(W.EndTag, e, r.endTagStart);
  return (s && Sa(s, t) || l && Sa(l, t)) && (s && a.push({ kind: mn.Read, range: s }), l && a.push({ kind: mn.Read, range: l })), a;
}
function Aa(e, t) {
  return e.line < t.line || e.line === t.line && e.character <= t.character;
}
function Sa(e, t) {
  return Aa(e.start, t) && Aa(t, e.end);
}
function La(e, t, n) {
  for (var i = ye(t.getText(), n), r = i.scan(); r !== W.EOS && r !== e; )
    r = i.scan();
  return r !== W.EOS ? { start: t.positionAt(i.getTokenOffset()), end: t.positionAt(i.getTokenEnd()) } : null;
}
function Lu(e, t) {
  var n = [];
  return t.roots.forEach(function(i) {
    ns(e, i, "", n);
  }), n;
}
function ns(e, t, n, i) {
  var r = Cu(t), a = on.create(e.uri, Y.create(e.positionAt(t.start), e.positionAt(t.end))), s = {
    name: r,
    location: a,
    containerName: n,
    kind: ni.Field
  };
  i.push(s), t.children.forEach(function(l) {
    ns(e, l, r, i);
  });
}
function Cu(e) {
  var t = e.tag;
  if (e.attributes) {
    var n = e.attributes.id, i = e.attributes.class;
    n && (t += "#".concat(n.replace(/[\"\']/g, ""))), i && (t += i.replace(/[\"\']/g, "").split(/\s+/).map(function(r) {
      return ".".concat(r);
    }).join(""));
  }
  return t || "?";
}
function Eu(e, t, n, i) {
  var r, a = e.offsetAt(t), s = i.findNodeAt(a);
  if (!s.tag || !Mu(s, a, s.tag))
    return null;
  var l = [], o = {
    start: e.positionAt(s.start + 1),
    end: e.positionAt(s.start + 1 + s.tag.length)
  };
  if (l.push({
    range: o,
    newText: n
  }), s.endTagStart) {
    var u = {
      start: e.positionAt(s.endTagStart + 2),
      end: e.positionAt(s.endTagStart + 2 + s.tag.length)
    };
    l.push({
      range: u,
      newText: n
    });
  }
  var c = (r = {}, r[e.uri.toString()] = l, r);
  return {
    changes: c
  };
}
function Mu(e, t, n) {
  return e.endTagStart && e.endTagStart + 2 <= t && t <= e.endTagStart + 2 + n.length ? !0 : e.start + 1 <= t && t <= e.start + 1 + n.length;
}
function Ru(e, t, n) {
  var i = e.offsetAt(t), r = n.findNodeAt(i);
  if (!r.tag || !r.endTagStart)
    return null;
  if (r.start + 1 <= i && i <= r.start + 1 + r.tag.length) {
    var a = i - 1 - r.start + r.endTagStart + 2;
    return e.positionAt(a);
  }
  if (r.endTagStart + 2 <= i && i <= r.endTagStart + 2 + r.tag.length) {
    var a = i - 2 - r.endTagStart + r.start + 1;
    return e.positionAt(a);
  }
  return null;
}
function Ca(e, t, n) {
  var i = e.offsetAt(t), r = n.findNodeAt(i), a = r.tag ? r.tag.length : 0;
  return r.endTagStart && (r.start + 1 <= i && i <= r.start + 1 + a || r.endTagStart + 2 <= i && i <= r.endTagStart + 2 + a) ? [
    Y.create(e.positionAt(r.start + 1), e.positionAt(r.start + 1 + a)),
    Y.create(e.positionAt(r.endTagStart + 2), e.positionAt(r.endTagStart + 2 + a))
  ] : null;
}
function Du(e, t) {
  e = e.sort(function(g, p) {
    var w = g.startLine - p.startLine;
    return w === 0 && (w = g.endLine - p.endLine), w;
  });
  for (var n = void 0, i = [], r = [], a = [], s = function(g, p) {
    r[g] = p, p < 30 && (a[p] = (a[p] || 0) + 1);
  }, l = 0; l < e.length; l++) {
    var o = e[l];
    if (!n)
      n = o, s(l, 0);
    else if (o.startLine > n.startLine) {
      if (o.endLine <= n.endLine)
        i.push(n), n = o, s(l, i.length);
      else if (o.startLine > n.endLine) {
        do
          n = i.pop();
        while (n && o.startLine > n.endLine);
        n && i.push(n), n = o, s(l, i.length);
      }
    }
  }
  for (var u = 0, c = 0, l = 0; l < a.length; l++) {
    var h = a[l];
    if (h) {
      if (h + u > t) {
        c = l;
        break;
      }
      u += h;
    }
  }
  for (var m = [], l = 0; l < e.length; l++) {
    var f = r[l];
    typeof f == "number" && (f < c || f === c && u++ < t) && m.push(e[l]);
  }
  return m;
}
function Nu(e, t) {
  var n = ye(e.getText()), i = n.scan(), r = [], a = [], s = null, l = -1;
  function o(v) {
    r.push(v), l = v.startLine;
  }
  for (; i !== W.EOS; ) {
    switch (i) {
      case W.StartTag: {
        var u = n.getTokenText(), c = e.positionAt(n.getTokenOffset()).line;
        a.push({ startLine: c, tagName: u }), s = u;
        break;
      }
      case W.EndTag: {
        s = n.getTokenText();
        break;
      }
      case W.StartTagClose:
        if (!s || !gn(s))
          break;
      case W.EndTagClose:
      case W.StartTagSelfClose: {
        for (var h = a.length - 1; h >= 0 && a[h].tagName !== s; )
          h--;
        if (h >= 0) {
          var m = a[h];
          a.length = h;
          var f = e.positionAt(n.getTokenOffset()).line, c = m.startLine, g = f - 1;
          g > c && l !== c && o({ startLine: c, endLine: g });
        }
        break;
      }
      case W.Comment: {
        var c = e.positionAt(n.getTokenOffset()).line, p = n.getTokenText(), w = p.match(/^\s*#(region\b)|(endregion\b)/);
        if (w)
          if (w[1])
            a.push({ startLine: c, tagName: "" });
          else {
            for (var h = a.length - 1; h >= 0 && a[h].tagName.length; )
              h--;
            if (h >= 0) {
              var m = a[h];
              a.length = h;
              var g = c;
              c = m.startLine, g > c && l !== c && o({ startLine: c, endLine: g, kind: ln.Region });
            }
          }
        else {
          var g = e.positionAt(n.getTokenOffset() + n.getTokenLength()).line;
          c < g && o({ startLine: c, endLine: g, kind: ln.Comment });
        }
        break;
      }
    }
    i = n.scan();
  }
  var y = t && t.rangeLimit || Number.MAX_VALUE;
  return r.length > y ? Du(r, y) : r;
}
function Iu(e, t) {
  function n(i) {
    for (var r = zu(e, i), a = void 0, s = void 0, l = r.length - 1; l >= 0; l--) {
      var o = r[l];
      (!a || o[0] !== a[0] || o[1] !== a[1]) && (s = fn.create(Y.create(e.positionAt(r[l][0]), e.positionAt(r[l][1])), s)), a = o;
    }
    return s || (s = fn.create(Y.create(i, i))), s;
  }
  return t.map(n);
}
function zu(e, t) {
  var n = Ya(e.getText()), i = e.offsetAt(t), r = n.findNodeAt(i), a = Uu(r);
  if (r.startTagEnd && !r.endTagStart) {
    if (r.startTagEnd !== r.end)
      return [[r.start, r.end]];
    var s = Y.create(e.positionAt(r.startTagEnd - 2), e.positionAt(r.startTagEnd)), l = e.getText(s);
    l === "/>" ? a.unshift([r.start + 1, r.startTagEnd - 2]) : a.unshift([r.start + 1, r.startTagEnd - 1]);
    var o = Ea(e, r, i);
    return a = o.concat(a), a;
  }
  if (!r.startTagEnd || !r.endTagStart)
    return a;
  if (a.unshift([r.start, r.end]), r.start < i && i < r.startTagEnd) {
    a.unshift([r.start + 1, r.startTagEnd - 1]);
    var o = Ea(e, r, i);
    return a = o.concat(a), a;
  } else
    return r.startTagEnd <= i && i <= r.endTagStart ? (a.unshift([r.startTagEnd, r.endTagStart]), a) : (i >= r.endTagStart + 2 && a.unshift([r.endTagStart + 2, r.end - 1]), a);
}
function Uu(e) {
  for (var t = e, n = function(r) {
    return r.startTagEnd && r.endTagStart && r.startTagEnd < r.endTagStart ? [
      [r.startTagEnd, r.endTagStart],
      [r.start, r.end]
    ] : [
      [r.start, r.end]
    ];
  }, i = []; t.parent; )
    t = t.parent, n(t).forEach(function(r) {
      return i.push(r);
    });
  return i;
}
function Ea(e, t, n) {
  for (var i = Y.create(e.positionAt(t.start), e.positionAt(t.end)), r = e.getText(i), a = n - t.start, s = ye(r), l = s.scan(), o = t.start, u = [], c = !1, h = -1; l !== W.EOS; ) {
    switch (l) {
      case W.AttributeName: {
        if (a < s.getTokenOffset()) {
          c = !1;
          break;
        }
        a <= s.getTokenEnd() && u.unshift([s.getTokenOffset(), s.getTokenEnd()]), c = !0, h = s.getTokenOffset();
        break;
      }
      case W.AttributeValue: {
        if (!c)
          break;
        var m = s.getTokenText();
        if (a < s.getTokenOffset()) {
          u.push([h, s.getTokenEnd()]);
          break;
        }
        a >= s.getTokenOffset() && a <= s.getTokenEnd() && (u.unshift([s.getTokenOffset(), s.getTokenEnd()]), (m[0] === '"' && m[m.length - 1] === '"' || m[0] === "'" && m[m.length - 1] === "'") && a >= s.getTokenOffset() + 1 && a <= s.getTokenEnd() - 1 && u.unshift([s.getTokenOffset() + 1, s.getTokenEnd() - 1]), u.push([h, s.getTokenEnd()]));
        break;
      }
    }
    l = s.scan();
  }
  return u.map(function(f) {
    return [f[0] + o, f[1] + o];
  });
}
var Hu = {
  version: 1.1,
  tags: [
    {
      name: "html",
      description: {
        kind: "markdown",
        value: "The html element represents the root of an HTML document."
      },
      attributes: [
        {
          name: "manifest",
          description: {
            kind: "markdown",
            value: "Specifies the URI of a resource manifest indicating resources that should be cached locally. See [Using the application cache](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache) for details."
          }
        },
        {
          name: "version",
          description: 'Specifies the version of the HTML [Document Type Definition](https://developer.mozilla.org/en-US/docs/Glossary/DTD "Document Type Definition: In HTML, the doctype is the required "<!DOCTYPE html>" preamble found at the top of all documents. Its sole purpose is to prevent a browser from switching into so-called “quirks mode” when rendering a document; that is, the "<!DOCTYPE html>" doctype ensures that the browser makes a best-effort attempt at following the relevant specifications, rather than using a different rendering mode that is incompatible with some specifications.") that governs the current document. This attribute is not needed, because it is redundant with the version information in the document type declaration.'
        },
        {
          name: "xmlns",
          description: 'Specifies the XML Namespace of the document. Default value is `"http://www.w3.org/1999/xhtml"`. This is required in documents parsed with XML parsers, and optional in text/html documents.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/html"
        }
      ]
    },
    {
      name: "head",
      description: {
        kind: "markdown",
        value: "The head element represents a collection of metadata for the Document."
      },
      attributes: [
        {
          name: "profile",
          description: "The URIs of one or more metadata profiles, separated by white space."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/head"
        }
      ]
    },
    {
      name: "title",
      description: {
        kind: "markdown",
        value: "The title element represents the document's title or name. Authors should use titles that identify their documents even when they are used out of context, for example in a user's history or bookmarks, or in search results. The document's title is often different from its first heading, since the first heading does not have to stand alone when taken out of context."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/title"
        }
      ]
    },
    {
      name: "base",
      description: {
        kind: "markdown",
        value: "The base element allows authors to specify the document base URL for the purposes of resolving relative URLs, and the name of the default browsing context for the purposes of following hyperlinks. The element does not represent any content beyond this information."
      },
      attributes: [
        {
          name: "href",
          description: {
            kind: "markdown",
            value: "The base URL to be used throughout the document for relative URL addresses. If this attribute is specified, this element must come before any other elements with attributes whose values are URLs. Absolute and relative URLs are allowed."
          }
        },
        {
          name: "target",
          description: {
            kind: "markdown",
            value: "A name or keyword indicating the default location to display the result when hyperlinks or forms cause navigation, for elements that do not have an explicit target reference. It is a name of, or keyword for, a _browsing context_ (for example: tab, window, or inline frame). The following keywords have special meanings:\n\n*   `_self`: Load the result into the same browsing context as the current one. This value is the default if the attribute is not specified.\n*   `_blank`: Load the result into a new unnamed browsing context.\n*   `_parent`: Load the result into the parent browsing context of the current one. If there is no parent, this option behaves the same way as `_self`.\n*   `_top`: Load the result into the top-level browsing context (that is, the browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this option behaves the same way as `_self`.\n\nIf this attribute is specified, this element must come before any other elements with attributes whose values are URLs."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/base"
        }
      ]
    },
    {
      name: "link",
      description: {
        kind: "markdown",
        value: "The link element allows authors to link their document to other resources."
      },
      attributes: [
        {
          name: "href",
          description: {
            kind: "markdown",
            value: 'This attribute specifies the [URL](https://developer.mozilla.org/en-US/docs/Glossary/URL "URL: Uniform Resource Locator (URL) is a text string specifying where a resource can be found on the Internet.") of the linked resource. A URL can be absolute or relative.'
          }
        },
        {
          name: "crossorigin",
          valueSet: "xo",
          description: {
            kind: "markdown",
            value: 'This enumerated attribute indicates whether [CORS](https://developer.mozilla.org/en-US/docs/Glossary/CORS "CORS: CORS (Cross-Origin Resource Sharing) is a system, consisting of transmitting HTTP headers, that determines whether browsers block frontend JavaScript code from accessing responses for cross-origin requests.") must be used when fetching the resource. [CORS-enabled images](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_Enabled_Image) can be reused in the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas "Use the HTML <canvas> element with either the canvas scripting API or the WebGL API to draw graphics and animations.") element without being _tainted_. The allowed values are:\n\n`anonymous`\n\nA cross-origin request (i.e. with an [`Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin "The Origin request header indicates where a fetch originates from. It doesn\'t include any path information, but only the server name. It is sent with CORS requests, as well as with POST requests. It is similar to the Referer header, but, unlike this header, it doesn\'t disclose the whole path.") HTTP header) is performed, but no credential is sent (i.e. no cookie, X.509 certificate, or HTTP Basic authentication). If the server does not give credentials to the origin site (by not setting the [`Access-Control-Allow-Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin "The Access-Control-Allow-Origin response header indicates whether the response can be shared with requesting code from the given origin.") HTTP header) the image will be tainted and its usage restricted.\n\n`use-credentials`\n\nA cross-origin request (i.e. with an `Origin` HTTP header) is performed along with a credential sent (i.e. a cookie, certificate, and/or HTTP Basic authentication is performed). If the server does not give credentials to the origin site (through [`Access-Control-Allow-Credentials`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials "The Access-Control-Allow-Credentials response header tells browsers whether to expose the response to frontend JavaScript code when the request\'s credentials mode (Request.credentials) is "include".") HTTP header), the resource will be _tainted_ and its usage restricted.\n\nIf the attribute is not present, the resource is fetched without a [CORS](https://developer.mozilla.org/en-US/docs/Glossary/CORS "CORS: CORS (Cross-Origin Resource Sharing) is a system, consisting of transmitting HTTP headers, that determines whether browsers block frontend JavaScript code from accessing responses for cross-origin requests.") request (i.e. without sending the `Origin` HTTP header), preventing its non-tainted usage. If invalid, it is handled as if the enumerated keyword **anonymous** was used. See [CORS settings attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for additional information.'
          }
        },
        {
          name: "rel",
          description: {
            kind: "markdown",
            value: "This attribute names a relationship of the linked document to the current document. The attribute must be a space-separated list of the [link types values](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types)."
          }
        },
        {
          name: "media",
          description: {
            kind: "markdown",
            value: "This attribute specifies the media that the linked resource applies to. Its value must be a media type / [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_queries). This attribute is mainly useful when linking to external stylesheets — it allows the user agent to pick the best adapted one for the device it runs on.\n\n**Notes:**\n\n*   In HTML 4, this can only be a simple white-space-separated list of media description literals, i.e., [media types and groups](https://developer.mozilla.org/en-US/docs/Web/CSS/@media), where defined and allowed as values for this attribute, such as `print`, `screen`, `aural`, `braille`. HTML5 extended this to any kind of [media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_queries), which are a superset of the allowed values of HTML 4.\n*   Browsers not supporting [CSS3 Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_queries) won't necessarily recognize the adequate link; do not forget to set fallback links, the restricted set of media queries defined in HTML 4."
          }
        },
        {
          name: "hreflang",
          description: {
            kind: "markdown",
            value: "This attribute indicates the language of the linked resource. It is purely advisory. Allowed values are determined by [BCP47](https://www.ietf.org/rfc/bcp/bcp47.txt). Use this attribute only if the [`href`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-href) attribute is present."
          }
        },
        {
          name: "type",
          description: {
            kind: "markdown",
            value: 'This attribute is used to define the type of the content linked to. The value of the attribute should be a MIME type such as **text/html**, **text/css**, and so on. The common use of this attribute is to define the type of stylesheet being referenced (such as **text/css**), but given that CSS is the only stylesheet language used on the web, not only is it possible to omit the `type` attribute, but is actually now recommended practice. It is also used on `rel="preload"` link types, to make sure the browser only downloads file types that it supports.'
          }
        },
        {
          name: "sizes",
          description: {
            kind: "markdown",
            value: "This attribute defines the sizes of the icons for visual media contained in the resource. It must be present only if the [`rel`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-rel) contains a value of `icon` or a non-standard type such as Apple's `apple-touch-icon`. It may have the following values:\n\n*   `any`, meaning that the icon can be scaled to any size as it is in a vector format, like `image/svg+xml`.\n*   a white-space separated list of sizes, each in the format `_<width in pixels>_x_<height in pixels>_` or `_<width in pixels>_X_<height in pixels>_`. Each of these sizes must be contained in the resource.\n\n**Note:** Most icon formats are only able to store one single icon; therefore most of the time the [`sizes`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#attr-sizes) contains only one entry. MS's ICO format does, as well as Apple's ICNS. ICO is more ubiquitous; you should definitely use it."
          }
        },
        {
          name: "as",
          description: 'This attribute is only used when `rel="preload"` or `rel="prefetch"` has been set on the `<link>` element. It specifies the type of content being loaded by the `<link>`, which is necessary for content prioritization, request matching, application of correct [content security policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), and setting of correct [`Accept`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept "The Accept request HTTP header advertises which content types, expressed as MIME types, the client is able to understand. Using content negotiation, the server then selects one of the proposals, uses it and informs the client of its choice with the Content-Type response header. Browsers set adequate values for this header depending on the context where the request is done: when fetching a CSS stylesheet a different value is set for the request than when fetching an image, video or a script.") request header.'
        },
        {
          name: "importance",
          description: "Indicates the relative importance of the resource. Priority hints are delegated using the values:"
        },
        {
          name: "importance",
          description: '**`auto`**: Indicates **no preference**. The browser may use its own heuristics to decide the priority of the resource.\n\n**`high`**: Indicates to the browser that the resource is of **high** priority.\n\n**`low`**: Indicates to the browser that the resource is of **low** priority.\n\n**Note:** The `importance` attribute may only be used for the `<link>` element if `rel="preload"` or `rel="prefetch"` is present.'
        },
        {
          name: "integrity",
          description: "Contains inline metadata — a base64-encoded cryptographic hash of the resource (file) you’re telling the browser to fetch. The browser can use this to verify that the fetched resource has been delivered free of unexpected manipulation. See [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)."
        },
        {
          name: "referrerpolicy",
          description: 'A string indicating which referrer to use when fetching the resource:\n\n*   `no-referrer` means that the [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer "The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.") header will not be sent.\n*   `no-referrer-when-downgrade` means that no [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer "The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.") header will be sent when navigating to an origin without TLS (HTTPS). This is a user agent’s default behavior, if no policy is otherwise specified.\n*   `origin` means that the referrer will be the origin of the page, which is roughly the scheme, the host, and the port.\n*   `origin-when-cross-origin` means that navigating to other origins will be limited to the scheme, the host, and the port, while navigating on the same origin will include the referrer\'s path.\n*   `unsafe-url` means that the referrer will include the origin and the path (but not the fragment, password, or username). This case is unsafe because it can leak origins and paths from TLS-protected resources to insecure origins.'
        },
        {
          name: "title",
          description: 'The `title` attribute has special semantics on the `<link>` element. When used on a `<link rel="stylesheet">` it defines a [preferred or an alternate stylesheet](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets). Incorrectly using it may [cause the stylesheet to be ignored](https://developer.mozilla.org/en-US/docs/Correctly_Using_Titles_With_External_Stylesheets).'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/link"
        }
      ]
    },
    {
      name: "meta",
      description: {
        kind: "markdown",
        value: "The meta element represents various kinds of metadata that cannot be expressed using the title, base, link, style, and script elements."
      },
      attributes: [
        {
          name: "name",
          description: {
            kind: "markdown",
            value: `This attribute defines the name of a piece of document-level metadata. It should not be set if one of the attributes [\`itemprop\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#attr-itemprop), [\`http-equiv\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-http-equiv) or [\`charset\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-charset) is also set.

This metadata name is associated with the value contained by the [\`content\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-content) attribute. The possible values for the name attribute are:

*   \`application-name\` which defines the name of the application running in the web page.
    
    **Note:**
    
    *   Browsers may use this to identify the application. It is different from the [\`<title>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title "The HTML Title element (<title>) defines the document's title that is shown in a browser's title bar or a page's tab.") element, which usually contain the application name, but may also contain information like the document name or a status.
    *   Simple web pages shouldn't define an application-name.
    
*   \`author\` which defines the name of the document's author.
*   \`description\` which contains a short and accurate summary of the content of the page. Several browsers, like Firefox and Opera, use this as the default description of bookmarked pages.
*   \`generator\` which contains the identifier of the software that generated the page.
*   \`keywords\` which contains words relevant to the page's content separated by commas.
*   \`referrer\` which controls the [\`Referer\` HTTP header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) attached to requests sent from the document:
    
    Values for the \`content\` attribute of \`<meta name="referrer">\`
    
    \`no-referrer\`
    
    Do not send a HTTP \`Referrer\` header.
    
    \`origin\`
    
    Send the [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) of the document.
    
    \`no-referrer-when-downgrade\`
    
    Send the [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) as a referrer to URLs as secure as the current page, (https→https), but does not send a referrer to less secure URLs (https→http). This is the default behaviour.
    
    \`origin-when-cross-origin\`
    
    Send the full URL (stripped of parameters) for same-origin requests, but only send the [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) for other cases.
    
    \`same-origin\`
    
    A referrer will be sent for [same-site origins](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy), but cross-origin requests will contain no referrer information.
    
    \`strict-origin\`
    
    Only send the origin of the document as the referrer to a-priori as-much-secure destination (HTTPS->HTTPS), but don't send it to a less secure destination (HTTPS->HTTP).
    
    \`strict-origin-when-cross-origin\`
    
    Send a full URL when performing a same-origin request, only send the origin of the document to a-priori as-much-secure destination (HTTPS->HTTPS), and send no header to a less secure destination (HTTPS->HTTP).
    
    \`unsafe-URL\`
    
    Send the full URL (stripped of parameters) for same-origin or cross-origin requests.
    
    **Notes:**
    
    *   Some browsers support the deprecated values of \`always\`, \`default\`, and \`never\` for referrer.
    *   Dynamically inserting \`<meta name="referrer">\` (with [\`document.write\`](https://developer.mozilla.org/en-US/docs/Web/API/Document/write) or [\`appendChild\`](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild)) makes the referrer behaviour unpredictable.
    *   When several conflicting policies are defined, the no-referrer policy is applied.
    

This attribute may also have a value taken from the extended list defined on [WHATWG Wiki MetaExtensions page](https://wiki.whatwg.org/wiki/MetaExtensions). Although none have been formally accepted yet, a few commonly used names are:

*   \`creator\` which defines the name of the creator of the document, such as an organization or institution. If there are more than one, several [\`<meta>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta "The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.") elements should be used.
*   \`googlebot\`, a synonym of \`robots\`, is only followed by Googlebot (the indexing crawler for Google).
*   \`publisher\` which defines the name of the document's publisher.
*   \`robots\` which defines the behaviour that cooperative crawlers, or "robots", should use with the page. It is a comma-separated list of the values below:
    
    Values for the content of \`<meta name="robots">\`
    
    Value
    
    Description
    
    Used by
    
    \`index\`
    
    Allows the robot to index the page (default).
    
    All
    
    \`noindex\`
    
    Requests the robot to not index the page.
    
    All
    
    \`follow\`
    
    Allows the robot to follow the links on the page (default).
    
    All
    
    \`nofollow\`
    
    Requests the robot to not follow the links on the page.
    
    All
    
    \`none\`
    
    Equivalent to \`noindex, nofollow\`
    
    [Google](https://support.google.com/webmasters/answer/79812)
    
    \`noodp\`
    
    Prevents using the [Open Directory Project](https://www.dmoz.org/) description, if any, as the page description in search engine results.
    
    [Google](https://support.google.com/webmasters/answer/35624#nodmoz), [Yahoo](https://help.yahoo.com/kb/search-for-desktop/meta-tags-robotstxt-yahoo-search-sln2213.html#cont5), [Bing](https://www.bing.com/webmaster/help/which-robots-metatags-does-bing-support-5198d240)
    
    \`noarchive\`
    
    Requests the search engine not to cache the page content.
    
    [Google](https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag#valid-indexing--serving-directives), [Yahoo](https://help.yahoo.com/kb/search-for-desktop/SLN2213.html), [Bing](https://www.bing.com/webmaster/help/which-robots-metatags-does-bing-support-5198d240)
    
    \`nosnippet\`
    
    Prevents displaying any description of the page in search engine results.
    
    [Google](https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag#valid-indexing--serving-directives), [Bing](https://www.bing.com/webmaster/help/which-robots-metatags-does-bing-support-5198d240)
    
    \`noimageindex\`
    
    Requests this page not to appear as the referring page of an indexed image.
    
    [Google](https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag#valid-indexing--serving-directives)
    
    \`nocache\`
    
    Synonym of \`noarchive\`.
    
    [Bing](https://www.bing.com/webmaster/help/which-robots-metatags-does-bing-support-5198d240)
    
    **Notes:**
    
    *   Only cooperative robots follow these rules. Do not expect to prevent e-mail harvesters with them.
    *   The robot still needs to access the page in order to read these rules. To prevent bandwidth consumption, use a _[robots.txt](https://developer.mozilla.org/en-US/docs/Glossary/robots.txt "robots.txt: Robots.txt is a file which is usually placed in the root of any website. It decides whether crawlers are permitted or forbidden access to the web site.")_ file.
    *   If you want to remove a page, \`noindex\` will work, but only after the robot visits the page again. Ensure that the \`robots.txt\` file is not preventing revisits.
    *   Some values are mutually exclusive, like \`index\` and \`noindex\`, or \`follow\` and \`nofollow\`. In these cases the robot's behaviour is undefined and may vary between them.
    *   Some crawler robots, like Google, Yahoo and Bing, support the same values for the HTTP header \`X-Robots-Tag\`; this allows non-HTML documents like images to use these rules.
    
*   \`slurp\`, is a synonym of \`robots\`, but only for Slurp - the crawler for Yahoo Search.
*   \`viewport\`, which gives hints about the size of the initial size of the [viewport](https://developer.mozilla.org/en-US/docs/Glossary/viewport "viewport: A viewport represents a polygonal (normally rectangular) area in computer graphics that is currently being viewed. In web browser terms, it refers to the part of the document you're viewing which is currently visible in its window (or the screen, if the document is being viewed in full screen mode). Content outside the viewport is not visible onscreen until scrolled into view."). Used by mobile devices only.
    
    Values for the content of \`<meta name="viewport">\`
    
    Value
    
    Possible subvalues
    
    Description
    
    \`width\`
    
    A positive integer number, or the text \`device-width\`
    
    Defines the pixel width of the viewport that you want the web site to be rendered at.
    
    \`height\`
    
    A positive integer, or the text \`device-height\`
    
    Defines the height of the viewport. Not used by any browser.
    
    \`initial-scale\`
    
    A positive number between \`0.0\` and \`10.0\`
    
    Defines the ratio between the device width (\`device-width\` in portrait mode or \`device-height\` in landscape mode) and the viewport size.
    
    \`maximum-scale\`
    
    A positive number between \`0.0\` and \`10.0\`
    
    Defines the maximum amount to zoom in. It must be greater or equal to the \`minimum-scale\` or the behaviour is undefined. Browser settings can ignore this rule and iOS10+ ignores it by default.
    
    \`minimum-scale\`
    
    A positive number between \`0.0\` and \`10.0\`
    
    Defines the minimum zoom level. It must be smaller or equal to the \`maximum-scale\` or the behaviour is undefined. Browser settings can ignore this rule and iOS10+ ignores it by default.
    
    \`user-scalable\`
    
    \`yes\` or \`no\`
    
    If set to \`no\`, the user is not able to zoom in the webpage. The default is \`yes\`. Browser settings can ignore this rule, and iOS10+ ignores it by default.
    
    Specification
    
    Status
    
    Comment
    
    [CSS Device Adaptation  
    The definition of '<meta name="viewport">' in that specification.](https://drafts.csswg.org/css-device-adapt/#viewport-meta)
    
    Working Draft
    
    Non-normatively describes the Viewport META element
    
    See also: [\`@viewport\`](https://developer.mozilla.org/en-US/docs/Web/CSS/@viewport "The @viewport CSS at-rule lets you configure the viewport through which the document is viewed. It's primarily used for mobile devices, but is also used by desktop browsers that support features like "snap to edge" (such as Microsoft Edge).")
    
    **Notes:**
    
    *   Though unstandardized, this declaration is respected by most mobile browsers due to de-facto dominance.
    *   The default values may vary between devices and browsers.
    *   To learn about this declaration in Firefox for Mobile, see [this article](https://developer.mozilla.org/en-US/docs/Mobile/Viewport_meta_tag "Mobile/Viewport meta tag").`
          }
        },
        {
          name: "http-equiv",
          description: {
            kind: "markdown",
            value: 'Defines a pragma directive. The attribute is named `**http-equiv**(alent)` because all the allowed values are names of particular HTTP headers:\n\n*   `"content-language"`  \n    Defines the default language of the page. It can be overridden by the [lang](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang) attribute on any element.\n    \n    **Warning:** Do not use this value, as it is obsolete. Prefer the `lang` attribute on the [`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html "The HTML <html> element represents the root (top-level element) of an HTML document, so it is also referred to as the root element. All other elements must be descendants of this element.") element.\n    \n*   `"content-security-policy"`  \n    Allows page authors to define a [content policy](https://developer.mozilla.org/en-US/docs/Web/Security/CSP/CSP_policy_directives) for the current page. Content policies mostly specify allowed server origins and script endpoints which help guard against cross-site scripting attacks.\n*   `"content-type"`  \n    Defines the [MIME type](https://developer.mozilla.org/en-US/docs/Glossary/MIME_type) of the document, followed by its character encoding. It follows the same syntax as the HTTP `content-type` entity-header field, but as it is inside a HTML page, most values other than `text/html` are impossible. Therefore the valid syntax for its `content` is the string \'`text/html`\' followed by a character set with the following syntax: \'`; charset=_IANAcharset_`\', where `IANAcharset` is the _preferred MIME name_ for a character set as [defined by the IANA.](https://www.iana.org/assignments/character-sets)\n    \n    **Warning:** Do not use this value, as it is obsolete. Use the [`charset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-charset) attribute on the [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta "The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.") element.\n    \n    **Note:** As [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta "The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.") can\'t change documents\' types in XHTML or HTML5\'s XHTML serialization, never set the MIME type to an XHTML MIME type with `<meta>`.\n    \n*   `"refresh"`  \n    This instruction specifies:\n    *   The number of seconds until the page should be reloaded - only if the [`content`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-content) attribute contains a positive integer.\n    *   The number of seconds until the page should redirect to another - only if the [`content`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-content) attribute contains a positive integer followed by the string \'`;url=`\', and a valid URL.\n*   `"set-cookie"`  \n    Defines a [cookie](https://developer.mozilla.org/en-US/docs/cookie) for the page. Its content must follow the syntax defined in the [IETF HTTP Cookie Specification](https://tools.ietf.org/html/draft-ietf-httpstate-cookie-14).\n    \n    **Warning:** Do not use this instruction, as it is obsolete. Use the HTTP header [`Set-Cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) instead.'
          }
        },
        {
          name: "content",
          description: {
            kind: "markdown",
            value: "This attribute contains the value for the [`http-equiv`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-http-equiv) or [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-name) attribute, depending on which is used."
          }
        },
        {
          name: "charset",
          description: {
            kind: "markdown",
            value: 'This attribute declares the page\'s character encoding. It must contain a [standard IANA MIME name for character encodings](https://www.iana.org/assignments/character-sets). Although the standard doesn\'t request a specific encoding, it suggests:\n\n*   Authors are encouraged to use [`UTF-8`](https://developer.mozilla.org/en-US/docs/Glossary/UTF-8).\n*   Authors should not use ASCII-incompatible encodings to avoid security risk: browsers not supporting them may interpret harmful content as HTML. This happens with the `JIS_C6226-1983`, `JIS_X0212-1990`, `HZ-GB-2312`, `JOHAB`, the ISO-2022 family and the EBCDIC family.\n\n**Note:** ASCII-incompatible encodings are those that don\'t map the 8-bit code points `0x20` to `0x7E` to the `0x0020` to `0x007E` Unicode code points)\n\n*   Authors **must not** use `CESU-8`, `UTF-7`, `BOCU-1` and/or `SCSU` as [cross-site scripting](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) attacks with these encodings have been demonstrated.\n*   Authors should not use `UTF-32` because not all HTML5 encoding algorithms can distinguish it from `UTF-16`.\n\n**Notes:**\n\n*   The declared character encoding must match the one the page was saved with to avoid garbled characters and security holes.\n*   The [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta "The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.") element declaring the encoding must be inside the [`<head>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head "The HTML <head> element provides general information (metadata) about the document, including its title and links to its scripts and style sheets.") element and **within the first 1024 bytes** of the HTML as some browsers only look at those bytes before choosing an encoding.\n*   This [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta "The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.") element is only one part of the [algorithm to determine a page\'s character set](https://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html#encoding-sniffing-algorithm "Algorithm charset page"). The [`Content-Type` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) and any [Byte-Order Marks](https://developer.mozilla.org/en-US/docs/Glossary/Byte-Order_Mark "The definition of that term (Byte-Order Marks) has not been written yet; please consider contributing it!") override this element.\n*   It is strongly recommended to define the character encoding. If a page\'s encoding is undefined, cross-scripting techniques are possible, such as the [`UTF-7` fallback cross-scripting technique](https://code.google.com/p/doctype-mirror/wiki/ArticleUtf7).\n*   The [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta "The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.") element with a `charset` attribute is a synonym for the pre-HTML5 `<meta http-equiv="Content-Type" content="text/html; charset=_IANAcharset_">`, where _`IANAcharset`_ contains the value of the equivalent [`charset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-charset) attribute. This syntax is still allowed, although no longer recommended.'
          }
        },
        {
          name: "scheme",
          description: "This attribute defines the scheme in which metadata is described. A scheme is a context leading to the correct interpretations of the [`content`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-content) value, like a format.\n\n**Warning:** Do not use this value, as it is obsolete. There is no replacement as there was no real usage for it."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/meta"
        }
      ]
    },
    {
      name: "style",
      description: {
        kind: "markdown",
        value: "The style element allows authors to embed style information in their documents. The style element is one of several inputs to the styling processing model. The element does not represent content for the user."
      },
      attributes: [
        {
          name: "media",
          description: {
            kind: "markdown",
            value: "This attribute defines which media the style should be applied to. Its value is a [media query](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Media_queries), which defaults to `all` if the attribute is missing."
          }
        },
        {
          name: "nonce",
          description: {
            kind: "markdown",
            value: "A cryptographic nonce (number used once) used to whitelist inline styles in a [style-src Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src). The server must generate a unique nonce value each time it transmits a policy. It is critical to provide a nonce that cannot be guessed as bypassing a resource’s policy is otherwise trivial."
          }
        },
        {
          name: "type",
          description: {
            kind: "markdown",
            value: "This attribute defines the styling language as a MIME type (charset should not be specified). This attribute is optional and defaults to `text/css` if it is not specified — there is very little reason to include this in modern web documents."
          }
        },
        {
          name: "scoped",
          valueSet: "v"
        },
        {
          name: "title",
          description: "This attribute specifies [alternative style sheet](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets) sets."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/style"
        }
      ]
    },
    {
      name: "body",
      description: {
        kind: "markdown",
        value: "The body element represents the content of the document."
      },
      attributes: [
        {
          name: "onafterprint",
          description: {
            kind: "markdown",
            value: "Function to call after the user has printed the document."
          }
        },
        {
          name: "onbeforeprint",
          description: {
            kind: "markdown",
            value: "Function to call when the user requests printing of the document."
          }
        },
        {
          name: "onbeforeunload",
          description: {
            kind: "markdown",
            value: "Function to call when the document is about to be unloaded."
          }
        },
        {
          name: "onhashchange",
          description: {
            kind: "markdown",
            value: "Function to call when the fragment identifier part (starting with the hash (`'#'`) character) of the document's current address has changed."
          }
        },
        {
          name: "onlanguagechange",
          description: {
            kind: "markdown",
            value: "Function to call when the preferred languages changed."
          }
        },
        {
          name: "onmessage",
          description: {
            kind: "markdown",
            value: "Function to call when the document has received a message."
          }
        },
        {
          name: "onoffline",
          description: {
            kind: "markdown",
            value: "Function to call when network communication has failed."
          }
        },
        {
          name: "ononline",
          description: {
            kind: "markdown",
            value: "Function to call when network communication has been restored."
          }
        },
        {
          name: "onpagehide"
        },
        {
          name: "onpageshow"
        },
        {
          name: "onpopstate",
          description: {
            kind: "markdown",
            value: "Function to call when the user has navigated session history."
          }
        },
        {
          name: "onstorage",
          description: {
            kind: "markdown",
            value: "Function to call when the storage area has changed."
          }
        },
        {
          name: "onunload",
          description: {
            kind: "markdown",
            value: "Function to call when the document is going away."
          }
        },
        {
          name: "alink",
          description: 'Color of text for hyperlinks when selected. _This method is non-conforming, use CSS [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color "The color CSS property sets the foreground color value of an element\'s text and text decorations, and sets the currentcolor value.") property in conjunction with the [`:active`](https://developer.mozilla.org/en-US/docs/Web/CSS/:active "The :active CSS pseudo-class represents an element (such as a button) that is being activated by the user.") pseudo-class instead._'
        },
        {
          name: "background",
          description: 'URI of a image to use as a background. _This method is non-conforming, use CSS [`background`](https://developer.mozilla.org/en-US/docs/Web/CSS/background "The background shorthand CSS property sets all background style properties at once, such as color, image, origin and size, or repeat method.") property on the element instead._'
        },
        {
          name: "bgcolor",
          description: 'Background color for the document. _This method is non-conforming, use CSS [`background-color`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color "The background-color CSS property sets the background color of an element.") property on the element instead._'
        },
        {
          name: "bottommargin",
          description: 'The margin of the bottom of the body. _This method is non-conforming, use CSS [`margin-bottom`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom "The margin-bottom CSS property sets the margin area on the bottom of an element. A positive value places it farther from its neighbors, while a negative value places it closer.") property on the element instead._'
        },
        {
          name: "leftmargin",
          description: 'The margin of the left of the body. _This method is non-conforming, use CSS [`margin-left`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left "The margin-left CSS property sets the margin area on the left side of an element. A positive value places it farther from its neighbors, while a negative value places it closer.") property on the element instead._'
        },
        {
          name: "link",
          description: 'Color of text for unvisited hypertext links. _This method is non-conforming, use CSS [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color "The color CSS property sets the foreground color value of an element\'s text and text decorations, and sets the currentcolor value.") property in conjunction with the [`:link`](https://developer.mozilla.org/en-US/docs/Web/CSS/:link "The :link CSS pseudo-class represents an element that has not yet been visited. It matches every unvisited <a>, <area>, or <link> element that has an href attribute.") pseudo-class instead._'
        },
        {
          name: "onblur",
          description: "Function to call when the document loses focus."
        },
        {
          name: "onerror",
          description: "Function to call when the document fails to load properly."
        },
        {
          name: "onfocus",
          description: "Function to call when the document receives focus."
        },
        {
          name: "onload",
          description: "Function to call when the document has finished loading."
        },
        {
          name: "onredo",
          description: "Function to call when the user has moved forward in undo transaction history."
        },
        {
          name: "onresize",
          description: "Function to call when the document has been resized."
        },
        {
          name: "onundo",
          description: "Function to call when the user has moved backward in undo transaction history."
        },
        {
          name: "rightmargin",
          description: 'The margin of the right of the body. _This method is non-conforming, use CSS [`margin-right`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right "The margin-right CSS property sets the margin area on the right side of an element. A positive value places it farther from its neighbors, while a negative value places it closer.") property on the element instead._'
        },
        {
          name: "text",
          description: 'Foreground color of text. _This method is non-conforming, use CSS [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color "The color CSS property sets the foreground color value of an element\'s text and text decorations, and sets the currentcolor value.") property on the element instead._'
        },
        {
          name: "topmargin",
          description: 'The margin of the top of the body. _This method is non-conforming, use CSS [`margin-top`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top "The margin-top CSS property sets the margin area on the top of an element. A positive value places it farther from its neighbors, while a negative value places it closer.") property on the element instead._'
        },
        {
          name: "vlink",
          description: 'Color of text for visited hypertext links. _This method is non-conforming, use CSS [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color "The color CSS property sets the foreground color value of an element\'s text and text decorations, and sets the currentcolor value.") property in conjunction with the [`:visited`](https://developer.mozilla.org/en-US/docs/Web/CSS/:visited "The :visited CSS pseudo-class represents links that the user has already visited. For privacy reasons, the styles that can be modified using this selector are very limited.") pseudo-class instead._'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/body"
        }
      ]
    },
    {
      name: "article",
      description: {
        kind: "markdown",
        value: "The article element represents a complete, or self-contained, composition in a document, page, application, or site and that is, in principle, independently distributable or reusable, e.g. in syndication. This could be a forum post, a magazine or newspaper article, a blog entry, a user-submitted comment, an interactive widget or gadget, or any other independent item of content. Each article should be identified, typically by including a heading (h1–h6 element) as a child of the article element."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/article"
        }
      ]
    },
    {
      name: "section",
      description: {
        kind: "markdown",
        value: "The section element represents a generic section of a document or application. A section, in this context, is a thematic grouping of content. Each section should be identified, typically by including a heading ( h1- h6 element) as a child of the section element."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/section"
        }
      ]
    },
    {
      name: "nav",
      description: {
        kind: "markdown",
        value: "The nav element represents a section of a page that links to other pages or to parts within the page: a section with navigation links."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/nav"
        }
      ]
    },
    {
      name: "aside",
      description: {
        kind: "markdown",
        value: "The aside element represents a section of a page that consists of content that is tangentially related to the content around the aside element, and which could be considered separate from that content. Such sections are often represented as sidebars in printed typography."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/aside"
        }
      ]
    },
    {
      name: "h1",
      description: {
        kind: "markdown",
        value: "The h1 element represents a section heading."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements"
        }
      ]
    },
    {
      name: "h2",
      description: {
        kind: "markdown",
        value: "The h2 element represents a section heading."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements"
        }
      ]
    },
    {
      name: "h3",
      description: {
        kind: "markdown",
        value: "The h3 element represents a section heading."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements"
        }
      ]
    },
    {
      name: "h4",
      description: {
        kind: "markdown",
        value: "The h4 element represents a section heading."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements"
        }
      ]
    },
    {
      name: "h5",
      description: {
        kind: "markdown",
        value: "The h5 element represents a section heading."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements"
        }
      ]
    },
    {
      name: "h6",
      description: {
        kind: "markdown",
        value: "The h6 element represents a section heading."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements"
        }
      ]
    },
    {
      name: "header",
      description: {
        kind: "markdown",
        value: "The header element represents introductory content for its nearest ancestor sectioning content or sectioning root element. A header typically contains a group of introductory or navigational aids. When the nearest ancestor sectioning content or sectioning root element is the body element, then it applies to the whole page."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/header"
        }
      ]
    },
    {
      name: "footer",
      description: {
        kind: "markdown",
        value: "The footer element represents a footer for its nearest ancestor sectioning content or sectioning root element. A footer typically contains information about its section such as who wrote it, links to related documents, copyright data, and the like."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/footer"
        }
      ]
    },
    {
      name: "address",
      description: {
        kind: "markdown",
        value: "The address element represents the contact information for its nearest article or body element ancestor. If that is the body element, then the contact information applies to the document as a whole."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/address"
        }
      ]
    },
    {
      name: "p",
      description: {
        kind: "markdown",
        value: "The p element represents a paragraph."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/p"
        }
      ]
    },
    {
      name: "hr",
      description: {
        kind: "markdown",
        value: "The hr element represents a paragraph-level thematic break, e.g. a scene change in a story, or a transition to another topic within a section of a reference book."
      },
      attributes: [
        {
          name: "align",
          description: "Sets the alignment of the rule on the page. If no value is specified, the default value is `left`."
        },
        {
          name: "color",
          description: "Sets the color of the rule through color name or hexadecimal value."
        },
        {
          name: "noshade",
          description: "Sets the rule to have no shading."
        },
        {
          name: "size",
          description: "Sets the height, in pixels, of the rule."
        },
        {
          name: "width",
          description: "Sets the length of the rule on the page through a pixel or percentage value."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/hr"
        }
      ]
    },
    {
      name: "pre",
      description: {
        kind: "markdown",
        value: "The pre element represents a block of preformatted text, in which structure is represented by typographic conventions rather than by elements."
      },
      attributes: [
        {
          name: "cols",
          description: 'Contains the _preferred_ count of characters that a line should have. It was a non-standard synonym of [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre#attr-width). To achieve such an effect, use CSS [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width "The width CSS property sets an element\'s width. By default it sets the width of the content area, but if box-sizing is set to border-box, it sets the width of the border area.") instead.'
        },
        {
          name: "width",
          description: 'Contains the _preferred_ count of characters that a line should have. Though technically still implemented, this attribute has no visual effect; to achieve such an effect, use CSS [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width "The width CSS property sets an element\'s width. By default it sets the width of the content area, but if box-sizing is set to border-box, it sets the width of the border area.") instead.'
        },
        {
          name: "wrap",
          description: 'Is a _hint_ indicating how the overflow must happen. In modern browser this hint is ignored and no visual effect results in its present; to achieve such an effect, use CSS [`white-space`](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space "The white-space CSS property sets how white space inside an element is handled.") instead.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/pre"
        }
      ]
    },
    {
      name: "blockquote",
      description: {
        kind: "markdown",
        value: "The blockquote element represents content that is quoted from another source, optionally with a citation which must be within a footer or cite element, and optionally with in-line changes such as annotations and abbreviations."
      },
      attributes: [
        {
          name: "cite",
          description: {
            kind: "markdown",
            value: "A URL that designates a source document or message for the information quoted. This attribute is intended to point to information explaining the context or the reference for the quote."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/blockquote"
        }
      ]
    },
    {
      name: "ol",
      description: {
        kind: "markdown",
        value: "The ol element represents a list of items, where the items have been intentionally ordered, such that changing the order would change the meaning of the document."
      },
      attributes: [
        {
          name: "reversed",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This Boolean attribute specifies that the items of the list are specified in reversed order."
          }
        },
        {
          name: "start",
          description: {
            kind: "markdown",
            value: 'This integer attribute specifies the start value for numbering the individual list items. Although the ordering type of list elements might be Roman numerals, such as XXXI, or letters, the value of start is always represented as a number. To start numbering elements from the letter "C", use `<ol start="3">`.\n\n**Note**: This attribute was deprecated in HTML4, but reintroduced in HTML5.'
          }
        },
        {
          name: "type",
          valueSet: "lt",
          description: {
            kind: "markdown",
            value: "Indicates the numbering type:\n\n*   `'a'` indicates lowercase letters,\n*   `'A'` indicates uppercase letters,\n*   `'i'` indicates lowercase Roman numerals,\n*   `'I'` indicates uppercase Roman numerals,\n*   and `'1'` indicates numbers (default).\n\nThe type set is used for the entire list unless a different [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li#attr-type) attribute is used within an enclosed [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li \"The HTML <li> element is used to represent an item in a list. It must be contained in a parent element: an ordered list (<ol>), an unordered list (<ul>), or a menu (<menu>). In menus and unordered lists, list items are usually displayed using bullet points. In ordered lists, they are usually displayed with an ascending counter on the left, such as a number or letter.\") element.\n\n**Note:** This attribute was deprecated in HTML4, but reintroduced in HTML5.\n\nUnless the value of the list number matters (e.g. in legal or technical documents where items are to be referenced by their number/letter), the CSS [`list-style-type`](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type \"The list-style-type CSS property sets the marker (such as a disc, character, or custom counter style) of a list item element.\") property should be used instead."
          }
        },
        {
          name: "compact",
          description: 'This Boolean attribute hints that the list should be rendered in a compact style. The interpretation of this attribute depends on the user agent and it doesn\'t work in all browsers.\n\n**Warning:** Do not use this attribute, as it has been deprecated: the [`<ol>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol "The HTML <ol> element represents an ordered list of items, typically rendered as a numbered list.") element should be styled using [CSS](https://developer.mozilla.org/en-US/docs/CSS). To give an effect similar to the `compact` attribute, the [CSS](https://developer.mozilla.org/en-US/docs/CSS) property [`line-height`](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height "The line-height CSS property sets the amount of space used for lines, such as in text. On block-level elements, it specifies the minimum height of line boxes within the element. On non-replaced inline elements, it specifies the height that is used to calculate line box height.") can be used with a value of `80%`.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/ol"
        }
      ]
    },
    {
      name: "ul",
      description: {
        kind: "markdown",
        value: "The ul element represents a list of items, where the order of the items is not important — that is, where changing the order would not materially change the meaning of the document."
      },
      attributes: [
        {
          name: "compact",
          description: 'This Boolean attribute hints that the list should be rendered in a compact style. The interpretation of this attribute depends on the user agent and it doesn\'t work in all browsers.\n\n**Usage note: **Do not use this attribute, as it has been deprecated: the [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul "The HTML <ul> element represents an unordered list of items, typically rendered as a bulleted list.") element should be styled using [CSS](https://developer.mozilla.org/en-US/docs/CSS). To give a similar effect as the `compact` attribute, the [CSS](https://developer.mozilla.org/en-US/docs/CSS) property [line-height](https://developer.mozilla.org/en-US/docs/CSS/line-height) can be used with a value of `80%`.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/ul"
        }
      ]
    },
    {
      name: "li",
      description: {
        kind: "markdown",
        value: "The li element represents a list item. If its parent element is an ol, ul, or menu element, then the element is an item of the parent element's list, as defined for those elements. Otherwise, the list item has no defined list-related relationship to any other li element."
      },
      attributes: [
        {
          name: "value",
          description: {
            kind: "markdown",
            value: 'This integer attribute indicates the current ordinal value of the list item as defined by the [`<ol>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol "The HTML <ol> element represents an ordered list of items, typically rendered as a numbered list.") element. The only allowed value for this attribute is a number, even if the list is displayed with Roman numerals or letters. List items that follow this one continue numbering from the value set. The **value** attribute has no meaning for unordered lists ([`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul "The HTML <ul> element represents an unordered list of items, typically rendered as a bulleted list.")) or for menus ([`<menu>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu "The HTML <menu> element represents a group of commands that a user can perform or activate. This includes both list menus, which might appear across the top of a screen, as well as context menus, such as those that might appear underneath a button after it has been clicked.")).\n\n**Note**: This attribute was deprecated in HTML4, but reintroduced in HTML5.\n\n**Note:** Prior to Gecko 9.0, negative values were incorrectly converted to 0. Starting in Gecko 9.0 all integer values are correctly parsed.'
          }
        },
        {
          name: "type",
          description: 'This character attribute indicates the numbering type:\n\n*   `a`: lowercase letters\n*   `A`: uppercase letters\n*   `i`: lowercase Roman numerals\n*   `I`: uppercase Roman numerals\n*   `1`: numbers\n\nThis type overrides the one used by its parent [`<ol>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol "The HTML <ol> element represents an ordered list of items, typically rendered as a numbered list.") element, if any.\n\n**Usage note:** This attribute has been deprecated: use the CSS [`list-style-type`](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type "The list-style-type CSS property sets the marker (such as a disc, character, or custom counter style) of a list item element.") property instead.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/li"
        }
      ]
    },
    {
      name: "dl",
      description: {
        kind: "markdown",
        value: "The dl element represents an association list consisting of zero or more name-value groups (a description list). A name-value group consists of one or more names (dt elements) followed by one or more values (dd elements), ignoring any nodes other than dt and dd elements. Within a single dl element, there should not be more than one dt element for each name."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/dl"
        }
      ]
    },
    {
      name: "dt",
      description: {
        kind: "markdown",
        value: "The dt element represents the term, or name, part of a term-description group in a description list (dl element)."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/dt"
        }
      ]
    },
    {
      name: "dd",
      description: {
        kind: "markdown",
        value: "The dd element represents the description, definition, or value, part of a term-description group in a description list (dl element)."
      },
      attributes: [
        {
          name: "nowrap",
          description: "If the value of this attribute is set to `yes`, the definition text will not wrap. The default value is `no`."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/dd"
        }
      ]
    },
    {
      name: "figure",
      description: {
        kind: "markdown",
        value: "The figure element represents some flow content, optionally with a caption, that is self-contained (like a complete sentence) and is typically referenced as a single unit from the main flow of the document."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/figure"
        }
      ]
    },
    {
      name: "figcaption",
      description: {
        kind: "markdown",
        value: "The figcaption element represents a caption or legend for the rest of the contents of the figcaption element's parent figure element, if any."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/figcaption"
        }
      ]
    },
    {
      name: "main",
      description: {
        kind: "markdown",
        value: "The main element represents the main content of the body of a document or application. The main content area consists of content that is directly related to or expands upon the central topic of a document or central functionality of an application."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/main"
        }
      ]
    },
    {
      name: "div",
      description: {
        kind: "markdown",
        value: "The div element has no special meaning at all. It represents its children. It can be used with the class, lang, and title attributes to mark up semantics common to a group of consecutive elements."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/div"
        }
      ]
    },
    {
      name: "a",
      description: {
        kind: "markdown",
        value: "If the a element has an href attribute, then it represents a hyperlink (a hypertext anchor) labeled by its contents."
      },
      attributes: [
        {
          name: "href",
          description: {
            kind: "markdown",
            value: "Contains a URL or a URL fragment that the hyperlink points to."
          }
        },
        {
          name: "target",
          description: {
            kind: "markdown",
            value: 'Specifies where to display the linked URL. It is a name of, or keyword for, a _browsing context_: a tab, window, or `<iframe>`. The following keywords have special meanings:\n\n*   `_self`: Load the URL into the same browsing context as the current one. This is the default behavior.\n*   `_blank`: Load the URL into a new browsing context. This is usually a tab, but users can configure browsers to use new windows instead.\n*   `_parent`: Load the URL into the parent browsing context of the current one. If there is no parent, this behaves the same way as `_self`.\n*   `_top`: Load the URL into the top-level browsing context (that is, the "highest" browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this behaves the same way as `_self`.\n\n**Note:** When using `target`, consider adding `rel="noreferrer"` to avoid exploitation of the `window.opener` API.\n\n**Note:** Linking to another page using `target="_blank"` will run the new page on the same process as your page. If the new page is executing expensive JS, your page\'s performance may suffer. To avoid this use `rel="noopener"`.'
          }
        },
        {
          name: "download",
          description: {
            kind: "markdown",
            value: "This attribute instructs browsers to download a URL instead of navigating to it, so the user will be prompted to save it as a local file. If the attribute has a value, it is used as the pre-filled file name in the Save prompt (the user can still change the file name if they want). There are no restrictions on allowed values, though `/` and `\\` are converted to underscores. Most file systems limit some punctuation in file names, and browsers will adjust the suggested name accordingly.\n\n**Notes:**\n\n*   This attribute only works for [same-origin URLs](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy).\n*   Although HTTP(s) URLs need to be in the same-origin, [`blob:` URLs](https://developer.mozilla.org/en-US/docs/Web/API/URL.createObjectURL) and [`data:` URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) are allowed so that content generated by JavaScript, such as pictures created in an image-editor Web app, can be downloaded.\n*   If the HTTP header [`Content-Disposition:`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition) gives a different filename than this attribute, the HTTP header takes priority over this attribute.\n*   If `Content-Disposition:` is set to `inline`, Firefox prioritizes `Content-Disposition`, like the filename case, while Chrome prioritizes the `download` attribute."
          }
        },
        {
          name: "ping",
          description: {
            kind: "markdown",
            value: 'Contains a space-separated list of URLs to which, when the hyperlink is followed, [`POST`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST "The HTTP POST method sends data to the server. The type of the body of the request is indicated by the Content-Type header.") requests with the body `PING` will be sent by the browser (in the background). Typically used for tracking.'
          }
        },
        {
          name: "rel",
          description: {
            kind: "markdown",
            value: "Specifies the relationship of the target object to the link object. The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types)."
          }
        },
        {
          name: "hreflang",
          description: {
            kind: "markdown",
            value: 'This attribute indicates the human language of the linked resource. It is purely advisory, with no built-in functionality. Allowed values are determined by [BCP47](https://www.ietf.org/rfc/bcp/bcp47.txt "Tags for Identifying Languages").'
          }
        },
        {
          name: "type",
          description: {
            kind: "markdown",
            value: 'Specifies the media type in the form of a [MIME type](https://developer.mozilla.org/en-US/docs/Glossary/MIME_type "MIME type: A MIME type (now properly called "media type", but also sometimes "content type") is a string sent along with a file indicating the type of the file (describing the content format, for example, a sound file might be labeled audio/ogg, or an image file image/png).") for the linked URL. It is purely advisory, with no built-in functionality.'
          }
        },
        {
          name: "referrerpolicy",
          description: "Indicates which [referrer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) to send when fetching the URL:\n\n*   `'no-referrer'` means the `Referer:` header will not be sent.\n*   `'no-referrer-when-downgrade'` means no `Referer:` header will be sent when navigating to an origin without HTTPS. This is the default behavior.\n*   `'origin'` means the referrer will be the [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) of the page, not including information after the domain.\n*   `'origin-when-cross-origin'` meaning that navigations to other origins will be limited to the scheme, the host and the port, while navigations on the same origin will include the referrer's path.\n*   `'strict-origin-when-cross-origin'`\n*   `'unsafe-url'` means the referrer will include the origin and path, but not the fragment, password, or username. This is unsafe because it can leak data from secure URLs to insecure ones."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/a"
        }
      ]
    },
    {
      name: "em",
      description: {
        kind: "markdown",
        value: "The em element represents stress emphasis of its contents."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/em"
        }
      ]
    },
    {
      name: "strong",
      description: {
        kind: "markdown",
        value: "The strong element represents strong importance, seriousness, or urgency for its contents."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/strong"
        }
      ]
    },
    {
      name: "small",
      description: {
        kind: "markdown",
        value: "The small element represents side comments such as small print."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/small"
        }
      ]
    },
    {
      name: "s",
      description: {
        kind: "markdown",
        value: "The s element represents contents that are no longer accurate or no longer relevant."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/s"
        }
      ]
    },
    {
      name: "cite",
      description: {
        kind: "markdown",
        value: "The cite element represents a reference to a creative work. It must include the title of the work or the name of the author(person, people or organization) or an URL reference, or a reference in abbreviated form as per the conventions used for the addition of citation metadata."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/cite"
        }
      ]
    },
    {
      name: "q",
      description: {
        kind: "markdown",
        value: "The q element represents some phrasing content quoted from another source."
      },
      attributes: [
        {
          name: "cite",
          description: {
            kind: "markdown",
            value: "The value of this attribute is a URL that designates a source document or message for the information quoted. This attribute is intended to point to information explaining the context or the reference for the quote."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/q"
        }
      ]
    },
    {
      name: "dfn",
      description: {
        kind: "markdown",
        value: "The dfn element represents the defining instance of a term. The paragraph, description list group, or section that is the nearest ancestor of the dfn element must also contain the definition(s) for the term given by the dfn element."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/dfn"
        }
      ]
    },
    {
      name: "abbr",
      description: {
        kind: "markdown",
        value: "The abbr element represents an abbreviation or acronym, optionally with its expansion. The title attribute may be used to provide an expansion of the abbreviation. The attribute, if specified, must contain an expansion of the abbreviation, and nothing else."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/abbr"
        }
      ]
    },
    {
      name: "ruby",
      description: {
        kind: "markdown",
        value: "The ruby element allows one or more spans of phrasing content to be marked with ruby annotations. Ruby annotations are short runs of text presented alongside base text, primarily used in East Asian typography as a guide for pronunciation or to include other annotations. In Japanese, this form of typography is also known as furigana. Ruby text can appear on either side, and sometimes both sides, of the base text, and it is possible to control its position using CSS. A more complete introduction to ruby can be found in the Use Cases & Exploratory Approaches for Ruby Markup document as well as in CSS Ruby Module Level 1. [RUBY-UC] [CSSRUBY]"
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/ruby"
        }
      ]
    },
    {
      name: "rb",
      description: {
        kind: "markdown",
        value: "The rb element marks the base text component of a ruby annotation. When it is the child of a ruby element, it doesn't represent anything itself, but its parent ruby element uses it as part of determining what it represents."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/rb"
        }
      ]
    },
    {
      name: "rt",
      description: {
        kind: "markdown",
        value: "The rt element marks the ruby text component of a ruby annotation. When it is the child of a ruby element or of an rtc element that is itself the child of a ruby element, it doesn't represent anything itself, but its ancestor ruby element uses it as part of determining what it represents."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/rt"
        }
      ]
    },
    {
      name: "rp",
      description: {
        kind: "markdown",
        value: "The rp element is used to provide fallback text to be shown by user agents that don't support ruby annotations. One widespread convention is to provide parentheses around the ruby text component of a ruby annotation."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/rp"
        }
      ]
    },
    {
      name: "time",
      description: {
        kind: "markdown",
        value: "The time element represents its contents, along with a machine-readable form of those contents in the datetime attribute. The kind of content is limited to various kinds of dates, times, time-zone offsets, and durations, as described below."
      },
      attributes: [
        {
          name: "datetime",
          description: {
            kind: "markdown",
            value: "This attribute indicates the time and/or date of the element and must be in one of the formats described below."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/time"
        }
      ]
    },
    {
      name: "code",
      description: {
        kind: "markdown",
        value: "The code element represents a fragment of computer code. This could be an XML element name, a file name, a computer program, or any other string that a computer would recognize."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/code"
        }
      ]
    },
    {
      name: "var",
      description: {
        kind: "markdown",
        value: "The var element represents a variable. This could be an actual variable in a mathematical expression or programming context, an identifier representing a constant, a symbol identifying a physical quantity, a function parameter, or just be a term used as a placeholder in prose."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/var"
        }
      ]
    },
    {
      name: "samp",
      description: {
        kind: "markdown",
        value: "The samp element represents sample or quoted output from another program or computing system."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/samp"
        }
      ]
    },
    {
      name: "kbd",
      description: {
        kind: "markdown",
        value: "The kbd element represents user input (typically keyboard input, although it may also be used to represent other input, such as voice commands)."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/kbd"
        }
      ]
    },
    {
      name: "sub",
      description: {
        kind: "markdown",
        value: "The sub element represents a subscript."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/sub"
        }
      ]
    },
    {
      name: "sup",
      description: {
        kind: "markdown",
        value: "The sup element represents a superscript."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/sup"
        }
      ]
    },
    {
      name: "i",
      description: {
        kind: "markdown",
        value: "The i element represents a span of text in an alternate voice or mood, or otherwise offset from the normal prose in a manner indicating a different quality of text, such as a taxonomic designation, a technical term, an idiomatic phrase from another language, transliteration, a thought, or a ship name in Western texts."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/i"
        }
      ]
    },
    {
      name: "b",
      description: {
        kind: "markdown",
        value: "The b element represents a span of text to which attention is being drawn for utilitarian purposes without conveying any extra importance and with no implication of an alternate voice or mood, such as key words in a document abstract, product names in a review, actionable words in interactive text-driven software, or an article lede."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/b"
        }
      ]
    },
    {
      name: "u",
      description: {
        kind: "markdown",
        value: "The u element represents a span of text with an unarticulated, though explicitly rendered, non-textual annotation, such as labeling the text as being a proper name in Chinese text (a Chinese proper name mark), or labeling the text as being misspelt."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/u"
        }
      ]
    },
    {
      name: "mark",
      description: {
        kind: "markdown",
        value: "The mark element represents a run of text in one document marked or highlighted for reference purposes, due to its relevance in another context. When used in a quotation or other block of text referred to from the prose, it indicates a highlight that was not originally present but which has been added to bring the reader's attention to a part of the text that might not have been considered important by the original author when the block was originally written, but which is now under previously unexpected scrutiny. When used in the main prose of a document, it indicates a part of the document that has been highlighted due to its likely relevance to the user's current activity."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/mark"
        }
      ]
    },
    {
      name: "bdi",
      description: {
        kind: "markdown",
        value: "The bdi element represents a span of text that is to be isolated from its surroundings for the purposes of bidirectional text formatting. [BIDI]"
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/bdi"
        }
      ]
    },
    {
      name: "bdo",
      description: {
        kind: "markdown",
        value: "The bdo element represents explicit text directionality formatting control for its children. It allows authors to override the Unicode bidirectional algorithm by explicitly specifying a direction override. [BIDI]"
      },
      attributes: [
        {
          name: "dir",
          description: "The direction in which text should be rendered in this element's contents. Possible values are:\n\n*   `ltr`: Indicates that the text should go in a left-to-right direction.\n*   `rtl`: Indicates that the text should go in a right-to-left direction."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/bdo"
        }
      ]
    },
    {
      name: "span",
      description: {
        kind: "markdown",
        value: "The span element doesn't mean anything on its own, but can be useful when used together with the global attributes, e.g. class, lang, or dir. It represents its children."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/span"
        }
      ]
    },
    {
      name: "br",
      description: {
        kind: "markdown",
        value: "The br element represents a line break."
      },
      attributes: [
        {
          name: "clear",
          description: "Indicates where to begin the next line after the break."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/br"
        }
      ]
    },
    {
      name: "wbr",
      description: {
        kind: "markdown",
        value: "The wbr element represents a line break opportunity."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/wbr"
        }
      ]
    },
    {
      name: "ins",
      description: {
        kind: "markdown",
        value: "The ins element represents an addition to the document."
      },
      attributes: [
        {
          name: "cite",
          description: "This attribute defines the URI of a resource that explains the change, such as a link to meeting minutes or a ticket in a troubleshooting system."
        },
        {
          name: "datetime",
          description: 'This attribute indicates the time and date of the change and must be a valid date with an optional time string. If the value cannot be parsed as a date with an optional time string, the element does not have an associated time stamp. For the format of the string without a time, see [Format of a valid date string](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#Format_of_a_valid_date_string "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.") in [Date and time formats used in HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article."). The format of the string if it includes both date and time is covered in [Format of a valid local date and time string](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#Format_of_a_valid_local_date_and_time_string "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.") in [Date and time formats used in HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.").'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/ins"
        }
      ]
    },
    {
      name: "del",
      description: {
        kind: "markdown",
        value: "The del element represents a removal from the document."
      },
      attributes: [
        {
          name: "cite",
          description: {
            kind: "markdown",
            value: "A URI for a resource that explains the change (for example, meeting minutes)."
          }
        },
        {
          name: "datetime",
          description: {
            kind: "markdown",
            value: 'This attribute indicates the time and date of the change and must be a valid date string with an optional time. If the value cannot be parsed as a date with an optional time string, the element does not have an associated time stamp. For the format of the string without a time, see [Format of a valid date string](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#Format_of_a_valid_date_string "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.") in [Date and time formats used in HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article."). The format of the string if it includes both date and time is covered in [Format of a valid local date and time string](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#Format_of_a_valid_local_date_and_time_string "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.") in [Date and time formats used in HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.").'
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/del"
        }
      ]
    },
    {
      name: "picture",
      description: {
        kind: "markdown",
        value: "The picture element is a container which provides multiple sources to its contained img element to allow authors to declaratively control or give hints to the user agent about which image resource to use, based on the screen pixel density, viewport size, image format, and other factors. It represents its children."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/picture"
        }
      ]
    },
    {
      name: "img",
      description: {
        kind: "markdown",
        value: "An img element represents an image."
      },
      attributes: [
        {
          name: "alt",
          description: {
            kind: "markdown",
            value: 'This attribute defines an alternative text description of the image.\n\n**Note:** Browsers do not always display the image referenced by the element. This is the case for non-graphical browsers (including those used by people with visual impairments), if the user chooses not to display images, or if the browser cannot display the image because it is invalid or an [unsupported type](#Supported_image_formats). In these cases, the browser may replace the image with the text defined in this element\'s `alt` attribute. You should, for these reasons and others, provide a useful value for `alt` whenever possible.\n\n**Note:** Omitting this attribute altogether indicates that the image is a key part of the content, and no textual equivalent is available. Setting this attribute to an empty string (`alt=""`) indicates that this image is _not_ a key part of the content (decorative), and that non-visual browsers may omit it from rendering.'
          }
        },
        {
          name: "src",
          description: {
            kind: "markdown",
            value: "The image URL. This attribute is mandatory for the `<img>` element. On browsers supporting `srcset`, `src` is treated like a candidate image with a pixel density descriptor `1x` unless an image with this pixel density descriptor is already defined in `srcset,` or unless `srcset` contains '`w`' descriptors."
          }
        },
        {
          name: "srcset",
          description: {
            kind: "markdown",
            value: "A list of one or more strings separated by commas indicating a set of possible image sources for the user agent to use. Each string is composed of:\n\n1.  a URL to an image,\n2.  optionally, whitespace followed by one of:\n    *   A width descriptor, or a positive integer directly followed by '`w`'. The width descriptor is divided by the source size given in the `sizes` attribute to calculate the effective pixel density.\n    *   A pixel density descriptor, which is a positive floating point number directly followed by '`x`'.\n\nIf no descriptor is specified, the source is assigned the default descriptor: `1x`.\n\nIt is incorrect to mix width descriptors and pixel density descriptors in the same `srcset` attribute. Duplicate descriptors (for instance, two sources in the same `srcset` which are both described with '`2x`') are also invalid.\n\nThe user agent selects any one of the available sources at its discretion. This provides them with significant leeway to tailor their selection based on things like user preferences or bandwidth conditions. See our [Responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) tutorial for an example."
          }
        },
        {
          name: "crossorigin",
          valueSet: "xo",
          description: {
            kind: "markdown",
            value: 'This enumerated attribute indicates if the fetching of the related image must be done using CORS or not. [CORS-enabled images](https://developer.mozilla.org/en-US/docs/CORS_Enabled_Image) can be reused in the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas "Use the HTML <canvas> element with either the canvas scripting API or the WebGL API to draw graphics and animations.") element without being "[tainted](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image#What_is_a_tainted_canvas)." The allowed values are:'
          }
        },
        {
          name: "usemap",
          description: {
            kind: "markdown",
            value: 'The partial URL (starting with \'#\') of an [image map](https://developer.mozilla.org/en-US/docs/HTML/Element/map) associated with the element.\n\n**Note:** You cannot use this attribute if the `<img>` element is a descendant of an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a "The HTML <a> element (or anchor element) creates a hyperlink to other web pages, files, locations within the same page, email addresses, or any other URL.") or [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") element.'
          }
        },
        {
          name: "ismap",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: 'This Boolean attribute indicates that the image is part of a server-side map. If so, the precise coordinates of a click are sent to the server.\n\n**Note:** This attribute is allowed only if the `<img>` element is a descendant of an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a "The HTML <a> element (or anchor element) creates a hyperlink to other web pages, files, locations within the same page, email addresses, or any other URL.") element with a valid [`href`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-href) attribute.'
          }
        },
        {
          name: "width",
          description: {
            kind: "markdown",
            value: "The intrinsic width of the image in pixels."
          }
        },
        {
          name: "height",
          description: {
            kind: "markdown",
            value: "The intrinsic height of the image in pixels."
          }
        },
        {
          name: "decoding",
          description: "Provides an image decoding hint to the browser. The allowed values are:"
        },
        {
          name: "decoding",
          description: `\`sync\`

Decode the image synchronously for atomic presentation with other content.

\`async\`

Decode the image asynchronously to reduce delay in presenting other content.

\`auto\`

Default mode, which indicates no preference for the decoding mode. The browser decides what is best for the user.`
        },
        {
          name: "importance",
          description: "Indicates the relative importance of the resource. Priority hints are delegated using the values:"
        },
        {
          name: "importance",
          description: "`auto`: Indicates **no preference**. The browser may use its own heuristics to decide the priority of the image.\n\n`high`: Indicates to the browser that the image is of **high** priority.\n\n`low`: Indicates to the browser that the image is of **low** priority."
        },
        {
          name: "intrinsicsize",
          description: "This attribute tells the browser to ignore the actual intrinsic size of the image and pretend it’s the size specified in the attribute. Specifically, the image would raster at these dimensions and `naturalWidth`/`naturalHeight` on images would return the values specified in this attribute. [Explainer](https://github.com/ojanvafai/intrinsicsize-attribute), [examples](https://googlechrome.github.io/samples/intrinsic-size/index.html)"
        },
        {
          name: "referrerpolicy",
          description: "A string indicating which referrer to use when fetching the resource:\n\n*   `no-referrer:` The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer \"The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.\") header will not be sent.\n*   `no-referrer-when-downgrade:` No `Referer` header will be sent when navigating to an origin without TLS (HTTPS). This is a user agent’s default behavior if no policy is otherwise specified.\n*   `origin:` The `Referer` header will include the page of origin's scheme, the host, and the port.\n*   `origin-when-cross-origin:` Navigating to other origins will limit the included referral data to the scheme, the host and the port, while navigating from the same origin will include the referrer's full path.\n*   `unsafe-url:` The `Referer` header will include the origin and the path, but not the fragment, password, or username. This case is unsafe because it can leak origins and paths from TLS-protected resources to insecure origins."
        },
        {
          name: "sizes",
          description: "A list of one or more strings separated by commas indicating a set of source sizes. Each source size consists of:\n\n1.  a media condition. This must be omitted for the last item.\n2.  a source size value.\n\nSource size values specify the intended display size of the image. User agents use the current source size to select one of the sources supplied by the `srcset` attribute, when those sources are described using width ('`w`') descriptors. The selected source size affects the intrinsic size of the image (the image’s display size if no CSS styling is applied). If the `srcset` attribute is absent, or contains no values with a width (`w`) descriptor, then the `sizes` attribute has no effect."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/img"
        }
      ]
    },
    {
      name: "iframe",
      description: {
        kind: "markdown",
        value: "The iframe element represents a nested browsing context."
      },
      attributes: [
        {
          name: "src",
          description: {
            kind: "markdown",
            value: 'The URL of the page to embed. Use a value of `about:blank` to embed an empty page that conforms to the [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#Inherited_origins). Also note that programatically removing an `<iframe>`\'s src attribute (e.g. via [`Element.removeAttribute()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute "The Element method removeAttribute() removes the attribute with the specified name from the element.")) causes `about:blank` to be loaded in the frame in Firefox (from version 65), Chromium-based browsers, and Safari/iOS.'
          }
        },
        {
          name: "srcdoc",
          description: {
            kind: "markdown",
            value: "Inline HTML to embed, overriding the `src` attribute. If a browser does not support the `srcdoc` attribute, it will fall back to the URL in the `src` attribute."
          }
        },
        {
          name: "name",
          description: {
            kind: "markdown",
            value: 'A targetable name for the embedded browsing context. This can be used in the `target` attribute of the [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a "The HTML <a> element (or anchor element) creates a hyperlink to other web pages, files, locations within the same page, email addresses, or any other URL."), [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server."), or [`<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base "The HTML <base> element specifies the base URL to use for all relative URLs contained within a document. There can be only one <base> element in a document.") elements; the `formtarget` attribute of the [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") or [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") elements; or the `windowName` parameter in the [`window.open()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/open "The Window interface\'s open() method loads the specified resource into the browsing context (window, <iframe> or tab) with the specified name. If the name doesn\'t exist, then a new window is opened and the specified resource is loaded into its browsing context.") method.'
          }
        },
        {
          name: "sandbox",
          valueSet: "sb",
          description: {
            kind: "markdown",
            value: 'Applies extra restrictions to the content in the frame. The value of the attribute can either be empty to apply all restrictions, or space-separated tokens to lift particular restrictions:\n\n*   `allow-forms`: Allows the resource to submit forms. If this keyword is not used, form submission is blocked.\n*   `allow-modals`: Lets the resource [open modal windows](https://html.spec.whatwg.org/multipage/origin.html#sandboxed-modals-flag).\n*   `allow-orientation-lock`: Lets the resource [lock the screen orientation](https://developer.mozilla.org/en-US/docs/Web/API/Screen/lockOrientation).\n*   `allow-pointer-lock`: Lets the resource use the [Pointer Lock API](https://developer.mozilla.org/en-US/docs/WebAPI/Pointer_Lock).\n*   `allow-popups`: Allows popups (such as `window.open()`, `target="_blank"`, or `showModalDialog()`). If this keyword is not used, the popup will silently fail to open.\n*   `allow-popups-to-escape-sandbox`: Lets the sandboxed document open new windows without those windows inheriting the sandboxing. For example, this can safely sandbox an advertisement without forcing the same restrictions upon the page the ad links to.\n*   `allow-presentation`: Lets the resource start a [presentation session](https://developer.mozilla.org/en-US/docs/Web/API/PresentationRequest).\n*   `allow-same-origin`: If this token is not used, the resource is treated as being from a special origin that always fails the [same-origin policy](https://developer.mozilla.org/en-US/docs/Glossary/same-origin_policy "same-origin policy: The same-origin policy is a critical security mechanism that restricts how a document or script loaded from one origin can interact with a resource from another origin.").\n*   `allow-scripts`: Lets the resource run scripts (but not create popup windows).\n*   `allow-storage-access-by-user-activation` : Lets the resource request access to the parent\'s storage capabilities with the [Storage Access API](https://developer.mozilla.org/en-US/docs/Web/API/Storage_Access_API).\n*   `allow-top-navigation`: Lets the resource navigate the top-level browsing context (the one named `_top`).\n*   `allow-top-navigation-by-user-activation`: Lets the resource navigate the top-level browsing context, but only if initiated by a user gesture.\n\n**Notes about sandboxing:**\n\n*   When the embedded document has the same origin as the embedding page, it is **strongly discouraged** to use both `allow-scripts` and `allow-same-origin`, as that lets the embedded document remove the `sandbox` attribute — making it no more secure than not using the `sandbox` attribute at all.\n*   Sandboxing is useless if the attacker can display content outside a sandboxed `iframe` — such as if the viewer opens the frame in a new tab. Such content should be also served from a _separate origin_ to limit potential damage.\n*   The `sandbox` attribute is unsupported in Internet Explorer 9 and earlier.'
          }
        },
        {
          name: "seamless",
          valueSet: "v"
        },
        {
          name: "allowfullscreen",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: 'Set to `true` if the `<iframe>` can activate fullscreen mode by calling the [`requestFullscreen()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen "The Element.requestFullscreen() method issues an asynchronous request to make the element be displayed in full-screen mode.") method.'
          }
        },
        {
          name: "width",
          description: {
            kind: "markdown",
            value: "The width of the frame in CSS pixels. Default is `300`."
          }
        },
        {
          name: "height",
          description: {
            kind: "markdown",
            value: "The height of the frame in CSS pixels. Default is `150`."
          }
        },
        {
          name: "allow",
          description: "Specifies a [feature policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Feature_Policy) for the `<iframe>`."
        },
        {
          name: "allowpaymentrequest",
          description: "Set to `true` if a cross-origin `<iframe>` should be allowed to invoke the [Payment Request API](https://developer.mozilla.org/en-US/docs/Web/API/Payment_Request_API)."
        },
        {
          name: "allowpaymentrequest",
          description: 'This attribute is considered a legacy attribute and redefined as `allow="payment"`.'
        },
        {
          name: "csp",
          description: 'A [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) enforced for the embedded resource. See [`HTMLIFrameElement.csp`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/csp "The csp property of the HTMLIFrameElement interface specifies the Content Security Policy that an embedded document must agree to enforce upon itself.") for details.'
        },
        {
          name: "importance",
          description: `The download priority of the resource in the \`<iframe>\`'s \`src\` attribute. Allowed values:

\`auto\` (default)

No preference. The browser uses its own heuristics to decide the priority of the resource.

\`high\`

The resource should be downloaded before other lower-priority page resources.

\`low\`

The resource should be downloaded after other higher-priority page resources.`
        },
        {
          name: "referrerpolicy",
          description: 'Indicates which [referrer](https://developer.mozilla.org/en-US/docs/Web/API/Document/referrer) to send when fetching the frame\'s resource:\n\n*   `no-referrer`: The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer "The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.") header will not be sent.\n*   `no-referrer-when-downgrade` (default): The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer "The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.") header will not be sent to [origin](https://developer.mozilla.org/en-US/docs/Glossary/origin "origin: Web content\'s origin is defined by the scheme (protocol), host (domain), and port of the URL used to access it. Two objects have the same origin only when the scheme, host, and port all match.")s without [TLS](https://developer.mozilla.org/en-US/docs/Glossary/TLS "TLS: Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL), is a protocol used by applications to communicate securely across a network, preventing tampering with and eavesdropping on email, web browsing, messaging, and other protocols.") ([HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS "HTTPS: HTTPS (HTTP Secure) is an encrypted version of the HTTP protocol. It usually uses SSL or TLS to encrypt all communication between a client and a server. This secure connection allows clients to safely exchange sensitive data with a server, for example for banking activities or online shopping.")).\n*   `origin`: The sent referrer will be limited to the origin of the referring page: its [scheme](https://developer.mozilla.org/en-US/docs/Archive/Mozilla/URIScheme), [host](https://developer.mozilla.org/en-US/docs/Glossary/host "host: A host is a device connected to the Internet (or a local network). Some hosts called servers offer additional services like serving webpages or storing files and emails."), and [port](https://developer.mozilla.org/en-US/docs/Glossary/port "port: For a computer connected to a network with an IP address, a port is a communication endpoint. Ports are designated by numbers, and below 1024 each port is associated by default with a specific protocol.").\n*   `origin-when-cross-origin`: The referrer sent to other origins will be limited to the scheme, the host, and the port. Navigations on the same origin will still include the path.\n*   `same-origin`: A referrer will be sent for [same origin](https://developer.mozilla.org/en-US/docs/Glossary/Same-origin_policy "same origin: The same-origin policy is a critical security mechanism that restricts how a document or script loaded from one origin can interact with a resource from another origin."), but cross-origin requests will contain no referrer information.\n*   `strict-origin`: Only send the origin of the document as the referrer when the protocol security level stays the same (HTTPS→HTTPS), but don\'t send it to a less secure destination (HTTPS→HTTP).\n*   `strict-origin-when-cross-origin`: Send a full URL when performing a same-origin request, only send the origin when the protocol security level stays the same (HTTPS→HTTPS), and send no header to a less secure destination (HTTPS→HTTP).\n*   `unsafe-url`: The referrer will include the origin _and_ the path (but not the [fragment](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/hash), [password](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/password), or [username](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/username)). **This value is unsafe**, because it leaks origins and paths from TLS-protected resources to insecure origins.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/iframe"
        }
      ]
    },
    {
      name: "embed",
      description: {
        kind: "markdown",
        value: "The embed element provides an integration point for an external (typically non-HTML) application or interactive content."
      },
      attributes: [
        {
          name: "src",
          description: {
            kind: "markdown",
            value: "The URL of the resource being embedded."
          }
        },
        {
          name: "type",
          description: {
            kind: "markdown",
            value: "The MIME type to use to select the plug-in to instantiate."
          }
        },
        {
          name: "width",
          description: {
            kind: "markdown",
            value: "The displayed width of the resource, in [CSS pixels](https://drafts.csswg.org/css-values/#px). This must be an absolute value; percentages are _not_ allowed."
          }
        },
        {
          name: "height",
          description: {
            kind: "markdown",
            value: "The displayed height of the resource, in [CSS pixels](https://drafts.csswg.org/css-values/#px). This must be an absolute value; percentages are _not_ allowed."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/embed"
        }
      ]
    },
    {
      name: "object",
      description: {
        kind: "markdown",
        value: "The object element can represent an external resource, which, depending on the type of the resource, will either be treated as an image, as a nested browsing context, or as an external resource to be processed by a plugin."
      },
      attributes: [
        {
          name: "data",
          description: {
            kind: "markdown",
            value: "The address of the resource as a valid URL. At least one of **data** and **type** must be defined."
          }
        },
        {
          name: "type",
          description: {
            kind: "markdown",
            value: "The [content type](https://developer.mozilla.org/en-US/docs/Glossary/Content_type) of the resource specified by **data**. At least one of **data** and **type** must be defined."
          }
        },
        {
          name: "typemustmatch",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This Boolean attribute indicates if the **type** attribute and the actual [content type](https://developer.mozilla.org/en-US/docs/Glossary/Content_type) of the resource must match to be used."
          }
        },
        {
          name: "name",
          description: {
            kind: "markdown",
            value: "The name of valid browsing context (HTML5), or the name of the control (HTML 4)."
          }
        },
        {
          name: "usemap",
          description: {
            kind: "markdown",
            value: "A hash-name reference to a [`<map>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map \"The HTML <map> element is used with <area> elements to define an image map (a clickable link area).\") element; that is a '#' followed by the value of a [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map#attr-name) of a map element."
          }
        },
        {
          name: "form",
          description: {
            kind: "markdown",
            value: 'The form element, if any, that the object element is associated with (its _form owner_). The value of the attribute must be an ID of a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element in the same document.'
          }
        },
        {
          name: "width",
          description: {
            kind: "markdown",
            value: "The width of the display resource, in [CSS pixels](https://drafts.csswg.org/css-values/#px). -- (Absolute values only. [NO percentages](https://html.spec.whatwg.org/multipage/embedded-content.html#dimension-attributes))"
          }
        },
        {
          name: "height",
          description: {
            kind: "markdown",
            value: "The height of the displayed resource, in [CSS pixels](https://drafts.csswg.org/css-values/#px). -- (Absolute values only. [NO percentages](https://html.spec.whatwg.org/multipage/embedded-content.html#dimension-attributes))"
          }
        },
        {
          name: "archive",
          description: "A space-separated list of URIs for archives of resources for the object."
        },
        {
          name: "border",
          description: "The width of a border around the control, in pixels."
        },
        {
          name: "classid",
          description: "The URI of the object's implementation. It can be used together with, or in place of, the **data** attribute."
        },
        {
          name: "codebase",
          description: "The base path used to resolve relative URIs specified by **classid**, **data**, or **archive**. If not specified, the default is the base URI of the current document."
        },
        {
          name: "codetype",
          description: "The content type of the data specified by **classid**."
        },
        {
          name: "declare",
          description: "The presence of this Boolean attribute makes this element a declaration only. The object must be instantiated by a subsequent `<object>` element. In HTML5, repeat the <object> element completely each that that the resource is reused."
        },
        {
          name: "standby",
          description: "A message that the browser can show while loading the object's implementation and data."
        },
        {
          name: "tabindex",
          description: "The position of the element in the tabbing navigation order for the current document."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/object"
        }
      ]
    },
    {
      name: "param",
      description: {
        kind: "markdown",
        value: "The param element defines parameters for plugins invoked by object elements. It does not represent anything on its own."
      },
      attributes: [
        {
          name: "name",
          description: {
            kind: "markdown",
            value: "Name of the parameter."
          }
        },
        {
          name: "value",
          description: {
            kind: "markdown",
            value: "Specifies the value of the parameter."
          }
        },
        {
          name: "type",
          description: 'Only used if the `valuetype` is set to "ref". Specifies the MIME type of values found at the URI specified by value.'
        },
        {
          name: "valuetype",
          description: `Specifies the type of the \`value\` attribute. Possible values are:

*   data: Default value. The value is passed to the object's implementation as a string.
*   ref: The value is a URI to a resource where run-time values are stored.
*   object: An ID of another [\`<object>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object "The HTML <object> element represents an external resource, which can be treated as an image, a nested browsing context, or a resource to be handled by a plugin.") in the same document.`
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/param"
        }
      ]
    },
    {
      name: "video",
      description: {
        kind: "markdown",
        value: "A video element is used for playing videos or movies, and audio files with captions."
      },
      attributes: [
        {
          name: "src"
        },
        {
          name: "crossorigin",
          valueSet: "xo"
        },
        {
          name: "poster"
        },
        {
          name: "preload",
          valueSet: "pl"
        },
        {
          name: "autoplay",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "A Boolean attribute; if specified, the video automatically begins to play back as soon as it can do so without stopping to finish loading the data."
          }
        },
        {
          name: "mediagroup"
        },
        {
          name: "loop",
          valueSet: "v"
        },
        {
          name: "muted",
          valueSet: "v"
        },
        {
          name: "controls",
          valueSet: "v"
        },
        {
          name: "width"
        },
        {
          name: "height"
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/video"
        }
      ]
    },
    {
      name: "audio",
      description: {
        kind: "markdown",
        value: "An audio element represents a sound or audio stream."
      },
      attributes: [
        {
          name: "src",
          description: {
            kind: "markdown",
            value: 'The URL of the audio to embed. This is subject to [HTTP access controls](https://developer.mozilla.org/en-US/docs/HTTP_access_control). This is optional; you may instead use the [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source "The HTML <source> element specifies multiple media resources for the <picture>, the <audio> element, or the <video> element.") element within the audio block to specify the audio to embed.'
          }
        },
        {
          name: "crossorigin",
          valueSet: "xo",
          description: {
            kind: "markdown",
            value: 'This enumerated attribute indicates whether to use CORS to fetch the related image. [CORS-enabled resources](https://developer.mozilla.org/en-US/docs/CORS_Enabled_Image) can be reused in the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas "Use the HTML <canvas> element with either the canvas scripting API or the WebGL API to draw graphics and animations.") element without being _tainted_. The allowed values are:\n\nanonymous\n\nSends a cross-origin request without a credential. In other words, it sends the `Origin:` HTTP header without a cookie, X.509 certificate, or performing HTTP Basic authentication. If the server does not give credentials to the origin site (by not setting the `Access-Control-Allow-Origin:` HTTP header), the image will be _tainted_, and its usage restricted.\n\nuse-credentials\n\nSends a cross-origin request with a credential. In other words, it sends the `Origin:` HTTP header with a cookie, a certificate, or performing HTTP Basic authentication. If the server does not give credentials to the origin site (through `Access-Control-Allow-Credentials:` HTTP header), the image will be _tainted_ and its usage restricted.\n\nWhen not present, the resource is fetched without a CORS request (i.e. without sending the `Origin:` HTTP header), preventing its non-tainted used in [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas "Use the HTML <canvas> element with either the canvas scripting API or the WebGL API to draw graphics and animations.") elements. If invalid, it is handled as if the enumerated keyword **anonymous** was used. See [CORS settings attributes](https://developer.mozilla.org/en-US/docs/HTML/CORS_settings_attributes) for additional information.'
          }
        },
        {
          name: "preload",
          valueSet: "pl",
          description: {
            kind: "markdown",
            value: "This enumerated attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience. It may have one of the following values:\n\n*   `none`: Indicates that the audio should not be preloaded.\n*   `metadata`: Indicates that only audio metadata (e.g. length) is fetched.\n*   `auto`: Indicates that the whole audio file can be downloaded, even if the user is not expected to use it.\n*   _empty string_: A synonym of the `auto` value.\n\nIf not set, `preload`'s default value is browser-defined (i.e. each browser may have its own default value). The spec advises it to be set to `metadata`.\n\n**Usage notes:**\n\n*   The `autoplay` attribute has precedence over `preload`. If `autoplay` is specified, the browser would obviously need to start downloading the audio for playback.\n*   The browser is not forced by the specification to follow the value of this attribute; it is a mere hint."
          }
        },
        {
          name: "autoplay",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: `A Boolean attribute: if specified, the audio will automatically begin playback as soon as it can do so, without waiting for the entire audio file to finish downloading.

**Note**: Sites that automatically play audio (or videos with an audio track) can be an unpleasant experience for users, so should be avoided when possible. If you must offer autoplay functionality, you should make it opt-in (requiring a user to specifically enable it). However, this can be useful when creating media elements whose source will be set at a later time, under user control.`
          }
        },
        {
          name: "mediagroup"
        },
        {
          name: "loop",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "A Boolean attribute: if specified, the audio player will automatically seek back to the start upon reaching the end of the audio."
          }
        },
        {
          name: "muted",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "A Boolean attribute that indicates whether the audio will be initially silenced. Its default value is `false`."
          }
        },
        {
          name: "controls",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "If this attribute is present, the browser will offer controls to allow the user to control audio playback, including volume, seeking, and pause/resume playback."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/audio"
        }
      ]
    },
    {
      name: "source",
      description: {
        kind: "markdown",
        value: "The source element allows authors to specify multiple alternative media resources for media elements. It does not represent anything on its own."
      },
      attributes: [
        {
          name: "src",
          description: {
            kind: "markdown",
            value: 'Required for [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio "The HTML <audio> element is used to embed sound content in documents. It may contain one or more audio sources, represented using the src attribute or the <source> element: the browser will choose the most suitable one. It can also be the destination for streamed media, using a MediaStream.") and [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video "The HTML Video element (<video>) embeds a media player which supports video playback into the document."), address of the media resource. The value of this attribute is ignored when the `<source>` element is placed inside a [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture "The HTML <picture> element contains zero or more <source> elements and one <img> element to provide versions of an image for different display/device scenarios.") element.'
          }
        },
        {
          name: "type",
          description: {
            kind: "markdown",
            value: "The MIME-type of the resource, optionally with a `codecs` parameter. See [RFC 4281](https://tools.ietf.org/html/rfc4281) for information about how to specify codecs."
          }
        },
        {
          name: "sizes",
          description: 'Is a list of source sizes that describes the final rendered width of the image represented by the source. Each source size consists of a comma-separated list of media condition-length pairs. This information is used by the browser to determine, before laying the page out, which image defined in [`srcset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source#attr-srcset) to use.  \nThe `sizes` attribute has an effect only when the [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source "The HTML <source> element specifies multiple media resources for the <picture>, the <audio> element, or the <video> element.") element is the direct child of a [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture "The HTML <picture> element contains zero or more <source> elements and one <img> element to provide versions of an image for different display/device scenarios.") element.'
        },
        {
          name: "srcset",
          description: "A list of one or more strings separated by commas indicating a set of possible images represented by the source for the browser to use. Each string is composed of:\n\n1.  one URL to an image,\n2.  a width descriptor, that is a positive integer directly followed by `'w'`. The default value, if missing, is the infinity.\n3.  a pixel density descriptor, that is a positive floating number directly followed by `'x'`. The default value, if missing, is `1x`.\n\nEach string in the list must have at least a width descriptor or a pixel density descriptor to be valid. Among the list, there must be only one string containing the same tuple of width descriptor and pixel density descriptor.  \nThe browser chooses the most adequate image to display at a given point of time.  \nThe `srcset` attribute has an effect only when the [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source \"The HTML <source> element specifies multiple media resources for the <picture>, the <audio> element, or the <video> element.\") element is the direct child of a [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture \"The HTML <picture> element contains zero or more <source> elements and one <img> element to provide versions of an image for different display/device scenarios.\") element."
        },
        {
          name: "media",
          description: '[Media query](https://developer.mozilla.org/en-US/docs/CSS/Media_queries) of the resource\'s intended media; this should be used only in a [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture "The HTML <picture> element contains zero or more <source> elements and one <img> element to provide versions of an image for different display/device scenarios.") element.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/source"
        }
      ]
    },
    {
      name: "track",
      description: {
        kind: "markdown",
        value: "The track element allows authors to specify explicit external timed text tracks for media elements. It does not represent anything on its own."
      },
      attributes: [
        {
          name: "default",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This attribute indicates that the track should be enabled unless the user's preferences indicate that another track is more appropriate. This may only be used on one `track` element per media element."
          }
        },
        {
          name: "kind",
          valueSet: "tk",
          description: {
            kind: "markdown",
            value: "How the text track is meant to be used. If omitted the default kind is `subtitles`. If the attribute is not present, it will use the `subtitles`. If the attribute contains an invalid value, it will use `metadata`. (Versions of Chrome earlier than 52 treated an invalid value as `subtitles`.) The following keywords are allowed:\n\n*   `subtitles`\n    *   Subtitles provide translation of content that cannot be understood by the viewer. For example dialogue or text that is not English in an English language film.\n    *   Subtitles may contain additional content, usually extra background information. For example the text at the beginning of the Star Wars films, or the date, time, and location of a scene.\n*   `captions`\n    *   Closed captions provide a transcription and possibly a translation of audio.\n    *   It may include important non-verbal information such as music cues or sound effects. It may indicate the cue's source (e.g. music, text, character).\n    *   Suitable for users who are deaf or when the sound is muted.\n*   `descriptions`\n    *   Textual description of the video content.\n    *   Suitable for users who are blind or where the video cannot be seen.\n*   `chapters`\n    *   Chapter titles are intended to be used when the user is navigating the media resource.\n*   `metadata`\n    *   Tracks used by scripts. Not visible to the user."
          }
        },
        {
          name: "label",
          description: {
            kind: "markdown",
            value: "A user-readable title of the text track which is used by the browser when listing available text tracks."
          }
        },
        {
          name: "src",
          description: {
            kind: "markdown",
            value: 'Address of the track (`.vtt` file). Must be a valid URL. This attribute must be specified and its URL value must have the same origin as the document — unless the [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio "The HTML <audio> element is used to embed sound content in documents. It may contain one or more audio sources, represented using the src attribute or the <source> element: the browser will choose the most suitable one. It can also be the destination for streamed media, using a MediaStream.") or [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video "The HTML Video element (<video>) embeds a media player which supports video playback into the document.") parent element of the `track` element has a [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) attribute.'
          }
        },
        {
          name: "srclang",
          description: {
            kind: "markdown",
            value: "Language of the track text data. It must be a valid [BCP 47](https://r12a.github.io/app-subtags/) language tag. If the `kind` attribute is set to `subtitles,` then `srclang` must be defined."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/track"
        }
      ]
    },
    {
      name: "map",
      description: {
        kind: "markdown",
        value: "The map element, in conjunction with an img element and any area element descendants, defines an image map. The element represents its children."
      },
      attributes: [
        {
          name: "name",
          description: {
            kind: "markdown",
            value: "The name attribute gives the map a name so that it can be referenced. The attribute must be present and must have a non-empty value with no space characters. The value of the name attribute must not be a compatibility-caseless match for the value of the name attribute of another map element in the same document. If the id attribute is also specified, both attributes must have the same value."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/map"
        }
      ]
    },
    {
      name: "area",
      description: {
        kind: "markdown",
        value: "The area element represents either a hyperlink with some text and a corresponding area on an image map, or a dead area on an image map."
      },
      attributes: [
        {
          name: "alt"
        },
        {
          name: "coords"
        },
        {
          name: "shape",
          valueSet: "sh"
        },
        {
          name: "href"
        },
        {
          name: "target"
        },
        {
          name: "download"
        },
        {
          name: "ping"
        },
        {
          name: "rel"
        },
        {
          name: "hreflang"
        },
        {
          name: "type"
        },
        {
          name: "accesskey",
          description: "Specifies a keyboard navigation accelerator for the element. Pressing ALT or a similar key in association with the specified character selects the form control correlated with that key sequence. Page designers are forewarned to avoid key sequences already bound to browsers. This attribute is global since HTML5."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/area"
        }
      ]
    },
    {
      name: "table",
      description: {
        kind: "markdown",
        value: "The table element represents data with more than one dimension, in the form of a table."
      },
      attributes: [
        {
          name: "border"
        },
        {
          name: "align",
          description: 'This enumerated attribute indicates how the table must be aligned inside the containing document. It may have the following values:\n\n*   left: the table is displayed on the left side of the document;\n*   center: the table is displayed in the center of the document;\n*   right: the table is displayed on the right side of the document.\n\n**Usage Note**\n\n*   **Do not use this attribute**, as it has been deprecated. The [`<table>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table "The HTML <table> element represents tabular data — that is, information presented in a two-dimensional table comprised of rows and columns of cells containing data.") element should be styled using [CSS](https://developer.mozilla.org/en-US/docs/CSS). Set [`margin-left`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left "The margin-left CSS property sets the margin area on the left side of an element. A positive value places it farther from its neighbors, while a negative value places it closer.") and [`margin-right`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right "The margin-right CSS property sets the margin area on the right side of an element. A positive value places it farther from its neighbors, while a negative value places it closer.") to `auto` or [`margin`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin "The margin CSS property sets the margin area on all four sides of an element. It is a shorthand for margin-top, margin-right, margin-bottom, and margin-left.") to `0 auto` to achieve an effect that is similar to the align attribute.\n*   Prior to Firefox 4, Firefox also supported the `middle`, `absmiddle`, and `abscenter` values as synonyms of `center`, in quirks mode only.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/table"
        }
      ]
    },
    {
      name: "caption",
      description: {
        kind: "markdown",
        value: "The caption element represents the title of the table that is its parent, if it has a parent and that is a table element."
      },
      attributes: [
        {
          name: "align",
          description: `This enumerated attribute indicates how the caption must be aligned with respect to the table. It may have one of the following values:

\`left\`

The caption is displayed to the left of the table.

\`top\`

The caption is displayed above the table.

\`right\`

The caption is displayed to the right of the table.

\`bottom\`

The caption is displayed below the table.

**Usage note:** Do not use this attribute, as it has been deprecated. The [\`<caption>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/caption "The HTML Table Caption element (<caption>) specifies the caption (or title) of a table, and if used is always the first child of a <table>.") element should be styled using the [CSS](https://developer.mozilla.org/en-US/docs/CSS) properties [\`caption-side\`](https://developer.mozilla.org/en-US/docs/Web/CSS/caption-side "The caption-side CSS property puts the content of a table's <caption> on the specified side. The values are relative to the writing-mode of the table.") and [\`text-align\`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.").`
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/caption"
        }
      ]
    },
    {
      name: "colgroup",
      description: {
        kind: "markdown",
        value: "The colgroup element represents a group of one or more columns in the table that is its parent, if it has a parent and that is a table element."
      },
      attributes: [
        {
          name: "span"
        },
        {
          name: "align",
          description: 'This enumerated attribute specifies how horizontal alignment of each column cell content will be handled. Possible values are:\n\n*   `left`, aligning the content to the left of the cell\n*   `center`, centering the content in the cell\n*   `right`, aligning the content to the right of the cell\n*   `justify`, inserting spaces into the textual content so that the content is justified in the cell\n*   `char`, aligning the textual content on a special character with a minimal offset, defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-charoff) attributes Unimplemented (see [bug 2212](https://bugzilla.mozilla.org/show_bug.cgi?id=2212 "character alignment not implemented (align=char, charoff=, text-align:<string>)")).\n\nIf this attribute is not set, the `left` value is assumed. The descendant [`<col>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col "The HTML <col> element defines a column within a table and is used for defining common semantics on all common cells. It is generally found within a <colgroup> element.") elements may override this value using their own [`align`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-align) attribute.\n\n**Note:** Do not use this attribute as it is obsolete (not supported) in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values:\n    *   Do not try to set the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property on a selector giving a [`<colgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup "The HTML <colgroup> element defines a group of columns within a table.") element. Because [`<td>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td "The HTML <td> element defines a cell of a table that contains data. It participates in the table model.") elements are not descendant of the [`<colgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup "The HTML <colgroup> element defines a group of columns within a table.") element, they won\'t inherit it.\n    *   If the table doesn\'t use a [`colspan`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-colspan) attribute, use one `td:nth-child(an+b)` CSS selector per column, where a is the total number of the columns in the table and b is the ordinal position of this column in the table. Only after this selector the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property can be used.\n    *   If the table does use a [`colspan`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-colspan) attribute, the effect can be achieved by combining adequate CSS attribute selectors like `[colspan=n]`, though this is not trivial.\n*   To achieve the same effect as the `char` value, in CSS3, you can use the value of the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup#attr-char) as the value of the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property Unimplemented.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/colgroup"
        }
      ]
    },
    {
      name: "col",
      description: {
        kind: "markdown",
        value: "If a col element has a parent and that is a colgroup element that itself has a parent that is a table element, then the col element represents one or more columns in the column group represented by that colgroup."
      },
      attributes: [
        {
          name: "span"
        },
        {
          name: "align",
          description: 'This enumerated attribute specifies how horizontal alignment of each column cell content will be handled. Possible values are:\n\n*   `left`, aligning the content to the left of the cell\n*   `center`, centering the content in the cell\n*   `right`, aligning the content to the right of the cell\n*   `justify`, inserting spaces into the textual content so that the content is justified in the cell\n*   `char`, aligning the textual content on a special character with a minimal offset, defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-charoff) attributes Unimplemented (see [bug 2212](https://bugzilla.mozilla.org/show_bug.cgi?id=2212 "character alignment not implemented (align=char, charoff=, text-align:<string>)")).\n\nIf this attribute is not set, its value is inherited from the [`align`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup#attr-align) of the [`<colgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup "The HTML <colgroup> element defines a group of columns within a table.") element this `<col>` element belongs too. If there are none, the `left` value is assumed.\n\n**Note:** Do not use this attribute as it is obsolete (not supported) in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values:\n    *   Do not try to set the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property on a selector giving a [`<col>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col "The HTML <col> element defines a column within a table and is used for defining common semantics on all common cells. It is generally found within a <colgroup> element.") element. Because [`<td>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td "The HTML <td> element defines a cell of a table that contains data. It participates in the table model.") elements are not descendant of the [`<col>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col "The HTML <col> element defines a column within a table and is used for defining common semantics on all common cells. It is generally found within a <colgroup> element.") element, they won\'t inherit it.\n    *   If the table doesn\'t use a [`colspan`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-colspan) attribute, use the `td:nth-child(an+b)` CSS selector. Set `a` to zero and `b` to the position of the column in the table, e.g. `td:nth-child(2) { text-align: right; }` to right-align the second column.\n    *   If the table does use a [`colspan`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-colspan) attribute, the effect can be achieved by combining adequate CSS attribute selectors like `[colspan=n]`, though this is not trivial.\n*   To achieve the same effect as the `char` value, in CSS3, you can use the value of the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-char) as the value of the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property Unimplemented.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/col"
        }
      ]
    },
    {
      name: "tbody",
      description: {
        kind: "markdown",
        value: "The tbody element represents a block of rows that consist of a body of data for the parent table element, if the tbody element has a parent and it is a table."
      },
      attributes: [
        {
          name: "align",
          description: 'This enumerated attribute specifies how horizontal alignment of each cell content will be handled. Possible values are:\n\n*   `left`, aligning the content to the left of the cell\n*   `center`, centering the content in the cell\n*   `right`, aligning the content to the right of the cell\n*   `justify`, inserting spaces into the textual content so that the content is justified in the cell\n*   `char`, aligning the textual content on a special character with a minimal offset, defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attr-charoff) attributes.\n\nIf this attribute is not set, the `left` value is assumed.\n\n**Note:** Do not use this attribute as it is obsolete (not supported) in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values, use the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property on it.\n*   To achieve the same effect as the `char` value, in CSS3, you can use the value of the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attr-char) as the value of the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property Unimplemented.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/tbody"
        }
      ]
    },
    {
      name: "thead",
      description: {
        kind: "markdown",
        value: "The thead element represents the block of rows that consist of the column labels (headers) for the parent table element, if the thead element has a parent and it is a table."
      },
      attributes: [
        {
          name: "align",
          description: 'This enumerated attribute specifies how horizontal alignment of each cell content will be handled. Possible values are:\n\n*   `left`, aligning the content to the left of the cell\n*   `center`, centering the content in the cell\n*   `right`, aligning the content to the right of the cell\n*   `justify`, inserting spaces into the textual content so that the content is justified in the cell\n*   `char`, aligning the textual content on a special character with a minimal offset, defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead#attr-charoff) attributes Unimplemented (see [bug 2212](https://bugzilla.mozilla.org/show_bug.cgi?id=2212 "character alignment not implemented (align=char, charoff=, text-align:<string>)")).\n\nIf this attribute is not set, the `left` value is assumed.\n\n**Note:** Do not use this attribute as it is obsolete (not supported) in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values, use the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property on it.\n*   To achieve the same effect as the `char` value, in CSS3, you can use the value of the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead#attr-char) as the value of the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property Unimplemented.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/thead"
        }
      ]
    },
    {
      name: "tfoot",
      description: {
        kind: "markdown",
        value: "The tfoot element represents the block of rows that consist of the column summaries (footers) for the parent table element, if the tfoot element has a parent and it is a table."
      },
      attributes: [
        {
          name: "align",
          description: 'This enumerated attribute specifies how horizontal alignment of each cell content will be handled. Possible values are:\n\n*   `left`, aligning the content to the left of the cell\n*   `center`, centering the content in the cell\n*   `right`, aligning the content to the right of the cell\n*   `justify`, inserting spaces into the textual content so that the content is justified in the cell\n*   `char`, aligning the textual content on a special character with a minimal offset, defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attr-charoff) attributes Unimplemented (see [bug 2212](https://bugzilla.mozilla.org/show_bug.cgi?id=2212 "character alignment not implemented (align=char, charoff=, text-align:<string>)")).\n\nIf this attribute is not set, the `left` value is assumed.\n\n**Note:** Do not use this attribute as it is obsolete (not supported) in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values, use the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property on it.\n*   To achieve the same effect as the `char` value, in CSS3, you can use the value of the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot#attr-char) as the value of the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property Unimplemented.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/tfoot"
        }
      ]
    },
    {
      name: "tr",
      description: {
        kind: "markdown",
        value: "The tr element represents a row of cells in a table."
      },
      attributes: [
        {
          name: "align",
          description: 'A [`DOMString`](https://developer.mozilla.org/en-US/docs/Web/API/DOMString "DOMString is a UTF-16 String. As JavaScript already uses such strings, DOMString is mapped directly to a String.") which specifies how the cell\'s context should be aligned horizontally within the cells in the row; this is shorthand for using `align` on every cell in the row individually. Possible values are:\n\n`left`\n\nAlign the content of each cell at its left edge.\n\n`center`\n\nCenter the contents of each cell between their left and right edges.\n\n`right`\n\nAlign the content of each cell at its right edge.\n\n`justify`\n\nWiden whitespaces within the text of each cell so that the text fills the full width of each cell (full justification).\n\n`char`\n\nAlign each cell in the row on a specific character (such that each row in the column that is configured this way will horizontally align its cells on that character). This uses the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr#attr-charoff) to establish the alignment character (typically "." or "," when aligning numerical data) and the number of characters that should follow the alignment character. This alignment type was never widely supported.\n\nIf no value is expressly set for `align`, the parent node\'s value is inherited.\n\nInstead of using the obsolete `align` attribute, you should instead use the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property to establish `left`, `center`, `right`, or `justify` alignment for the row\'s cells. To apply character-based alignment, set the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property to the alignment character (such as `"."` or `","`).'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/tr"
        }
      ]
    },
    {
      name: "td",
      description: {
        kind: "markdown",
        value: "The td element represents a data cell in a table."
      },
      attributes: [
        {
          name: "colspan"
        },
        {
          name: "rowspan"
        },
        {
          name: "headers"
        },
        {
          name: "abbr",
          description: `This attribute contains a short abbreviated description of the cell's content. Some user-agents, such as speech readers, may present this description before the content itself.

**Note:** Do not use this attribute as it is obsolete in the latest standard. Alternatively, you can put the abbreviated description inside the cell and place the long content in the **title** attribute.`
        },
        {
          name: "align",
          description: 'This enumerated attribute specifies how the cell content\'s horizontal alignment will be handled. Possible values are:\n\n*   `left`: The content is aligned to the left of the cell.\n*   `center`: The content is centered in the cell.\n*   `right`: The content is aligned to the right of the cell.\n*   `justify` (with text only): The content is stretched out inside the cell so that it covers its entire width.\n*   `char` (with text only): The content is aligned to a character inside the `<th>` element with minimal offset. This character is defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-charoff) attributes Unimplemented (see [bug 2212](https://bugzilla.mozilla.org/show_bug.cgi?id=2212 "character alignment not implemented (align=char, charoff=, text-align:<string>)")).\n\nThe default value when this attribute is not specified is `left`.\n\n**Note:** Do not use this attribute as it is obsolete in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values, apply the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property to the element.\n*   To achieve the same effect as the `char` value, give the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property the same value you would use for the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-char). Unimplemented in CSS3.'
        },
        {
          name: "axis",
          description: "This attribute contains a list of space-separated strings. Each string is the `id` of a group of cells that this header applies to.\n\n**Note:** Do not use this attribute as it is obsolete in the latest standard."
        },
        {
          name: "bgcolor",
          description: `This attribute defines the background color of each cell in a column. It consists of a 6-digit hexadecimal code as defined in [sRGB](https://www.w3.org/Graphics/Color/sRGB) and is prefixed by '#'. This attribute may be used with one of sixteen predefined color strings:

 

\`black\` = "#000000"

 

\`green\` = "#008000"

 

\`silver\` = "#C0C0C0"

 

\`lime\` = "#00FF00"

 

\`gray\` = "#808080"

 

\`olive\` = "#808000"

 

\`white\` = "#FFFFFF"

 

\`yellow\` = "#FFFF00"

 

\`maroon\` = "#800000"

 

\`navy\` = "#000080"

 

\`red\` = "#FF0000"

 

\`blue\` = "#0000FF"

 

\`purple\` = "#800080"

 

\`teal\` = "#008080"

 

\`fuchsia\` = "#FF00FF"

 

\`aqua\` = "#00FFFF"

**Note:** Do not use this attribute, as it is non-standard and only implemented in some versions of Microsoft Internet Explorer: The [\`<td>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td "The HTML <td> element defines a cell of a table that contains data. It participates in the table model.") element should be styled using [CSS](https://developer.mozilla.org/en-US/docs/CSS). To create a similar effect use the [\`background-color\`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color "The background-color CSS property sets the background color of an element.") property in [CSS](https://developer.mozilla.org/en-US/docs/CSS) instead.`
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/td"
        }
      ]
    },
    {
      name: "th",
      description: {
        kind: "markdown",
        value: "The th element represents a header cell in a table."
      },
      attributes: [
        {
          name: "colspan"
        },
        {
          name: "rowspan"
        },
        {
          name: "headers"
        },
        {
          name: "scope",
          valueSet: "s"
        },
        {
          name: "sorted"
        },
        {
          name: "abbr",
          description: {
            kind: "markdown",
            value: "This attribute contains a short abbreviated description of the cell's content. Some user-agents, such as speech readers, may present this description before the content itself."
          }
        },
        {
          name: "align",
          description: 'This enumerated attribute specifies how the cell content\'s horizontal alignment will be handled. Possible values are:\n\n*   `left`: The content is aligned to the left of the cell.\n*   `center`: The content is centered in the cell.\n*   `right`: The content is aligned to the right of the cell.\n*   `justify` (with text only): The content is stretched out inside the cell so that it covers its entire width.\n*   `char` (with text only): The content is aligned to a character inside the `<th>` element with minimal offset. This character is defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-charoff) attributes.\n\nThe default value when this attribute is not specified is `left`.\n\n**Note:** Do not use this attribute as it is obsolete in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values, apply the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property to the element.\n*   To achieve the same effect as the `char` value, give the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property the same value you would use for the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-char). Unimplemented in CSS3.'
        },
        {
          name: "axis",
          description: "This attribute contains a list of space-separated strings. Each string is the `id` of a group of cells that this header applies to.\n\n**Note:** Do not use this attribute as it is obsolete in the latest standard: use the [`scope`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-scope) attribute instead."
        },
        {
          name: "bgcolor",
          description: `This attribute defines the background color of each cell in a column. It consists of a 6-digit hexadecimal code as defined in [sRGB](https://www.w3.org/Graphics/Color/sRGB) and is prefixed by '#'. This attribute may be used with one of sixteen predefined color strings:

 

\`black\` = "#000000"

 

\`green\` = "#008000"

 

\`silver\` = "#C0C0C0"

 

\`lime\` = "#00FF00"

 

\`gray\` = "#808080"

 

\`olive\` = "#808000"

 

\`white\` = "#FFFFFF"

 

\`yellow\` = "#FFFF00"

 

\`maroon\` = "#800000"

 

\`navy\` = "#000080"

 

\`red\` = "#FF0000"

 

\`blue\` = "#0000FF"

 

\`purple\` = "#800080"

 

\`teal\` = "#008080"

 

\`fuchsia\` = "#FF00FF"

 

\`aqua\` = "#00FFFF"

**Note:** Do not use this attribute, as it is non-standard and only implemented in some versions of Microsoft Internet Explorer: The [\`<th>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th "The HTML <th> element defines a cell as header of a group of table cells. The exact nature of this group is defined by the scope and headers attributes.") element should be styled using [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS). To create a similar effect use the [\`background-color\`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color "The background-color CSS property sets the background color of an element.") property in [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) instead.`
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/th"
        }
      ]
    },
    {
      name: "form",
      description: {
        kind: "markdown",
        value: "The form element represents a collection of form-associated elements, some of which can represent editable values that can be submitted to a server for processing."
      },
      attributes: [
        {
          name: "accept-charset",
          description: {
            kind: "markdown",
            value: 'A space- or comma-delimited list of character encodings that the server accepts. The browser uses them in the order in which they are listed. The default value, the reserved string `"UNKNOWN"`, indicates the same encoding as that of the document containing the form element.  \nIn previous versions of HTML, the different character encodings could be delimited by spaces or commas. In HTML5, only spaces are allowed as delimiters.'
          }
        },
        {
          name: "action",
          description: {
            kind: "markdown",
            value: 'The URI of a program that processes the form information. This value can be overridden by a [`formaction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-formaction) attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") or [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element.'
          }
        },
        {
          name: "autocomplete",
          valueSet: "o",
          description: {
            kind: "markdown",
            value: "Indicates whether input elements can by default have their values automatically completed by the browser. This setting can be overridden by an `autocomplete` attribute on an element belonging to the form. Possible values are:\n\n*   `off`: The user must explicitly enter a value into each field for every use, or the document provides its own auto-completion method; the browser does not automatically complete entries.\n*   `on`: The browser can automatically complete values based on values that the user has previously entered in the form.\n\nFor most modern browsers (including Firefox 38+, Google Chrome 34+, IE 11+) setting the autocomplete attribute will not prevent a browser's password manager from asking the user if they want to store login fields (username and password), if the user permits the storage the browser will autofill the login the next time the user visits the page. See [The autocomplete attribute and login fields](https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion#The_autocomplete_attribute_and_login_fields)."
          }
        },
        {
          name: "enctype",
          valueSet: "et",
          description: {
            kind: "markdown",
            value: 'When the value of the `method` attribute is `post`, enctype is the [MIME type](https://en.wikipedia.org/wiki/Mime_type) of content that is used to submit the form to the server. Possible values are:\n\n*   `application/x-www-form-urlencoded`: The default value if the attribute is not specified.\n*   `multipart/form-data`: The value used for an [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element with the `type` attribute set to "file".\n*   `text/plain`: (HTML5)\n\nThis value can be overridden by a [`formenctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-formenctype) attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") or [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element.'
          }
        },
        {
          name: "method",
          valueSet: "m",
          description: {
            kind: "markdown",
            value: 'The [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) method that the browser uses to submit the form. Possible values are:\n\n*   `post`: Corresponds to the HTTP [POST method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.5) ; form data are included in the body of the form and sent to the server.\n*   `get`: Corresponds to the HTTP [GET method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.3); form data are appended to the `action` attribute URI with a \'?\' as separator, and the resulting URI is sent to the server. Use this method when the form has no side-effects and contains only ASCII characters.\n*   `dialog`: Use when the form is inside a [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog "The HTML <dialog> element represents a dialog box or other interactive component, such as an inspector or window.") element to close the dialog when submitted.\n\nThis value can be overridden by a [`formmethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-formmethod) attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") or [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element.'
          }
        },
        {
          name: "name",
          description: {
            kind: "markdown",
            value: "The name of the form. In HTML 4, its use is deprecated (`id` should be used instead). It must be unique among the forms in a document and not just an empty string in HTML 5."
          }
        },
        {
          name: "novalidate",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: 'This Boolean attribute indicates that the form is not to be validated when submitted. If this attribute is not specified (and therefore the form is validated), this default setting can be overridden by a [`formnovalidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-formnovalidate) attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") or [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element belonging to the form.'
          }
        },
        {
          name: "target",
          description: {
            kind: "markdown",
            value: 'A name or keyword indicating where to display the response that is received after submitting the form. In HTML 4, this is the name/keyword for a frame. In HTML5, it is a name/keyword for a _browsing context_ (for example, tab, window, or inline frame). The following keywords have special meanings:\n\n*   `_self`: Load the response into the same HTML 4 frame (or HTML5 browsing context) as the current one. This value is the default if the attribute is not specified.\n*   `_blank`: Load the response into a new unnamed HTML 4 window or HTML5 browsing context.\n*   `_parent`: Load the response into the HTML 4 frameset parent of the current frame, or HTML5 parent browsing context of the current one. If there is no parent, this option behaves the same way as `_self`.\n*   `_top`: HTML 4: Load the response into the full original window, and cancel all other frames. HTML5: Load the response into the top-level browsing context (i.e., the browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this option behaves the same way as `_self`.\n*   _iframename_: The response is displayed in a named [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe "The HTML Inline Frame element (<iframe>) represents a nested browsing context, embedding another HTML page into the current one.").\n\nHTML5: This value can be overridden by a [`formtarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-formtarget) attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") or [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element.'
          }
        },
        {
          name: "accept",
          description: 'A comma-separated list of content types that the server accepts.\n\n**Usage note:** This attribute has been removed in HTML5 and should no longer be used. Instead, use the [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept) attribute of the specific [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element.'
        },
        {
          name: "autocapitalize",
          description: "This is a nonstandard attribute used by iOS Safari Mobile which controls whether and how the text value for textual form control descendants should be automatically capitalized as it is entered/edited by the user. If the `autocapitalize` attribute is specified on an individual form control descendant, it trumps the form-wide `autocapitalize` setting. The non-deprecated values are available in iOS 5 and later. The default value is `sentences`. Possible values are:\n\n*   `none`: Completely disables automatic capitalization\n*   `sentences`: Automatically capitalize the first letter of sentences.\n*   `words`: Automatically capitalize the first letter of words.\n*   `characters`: Automatically capitalize all characters.\n*   `on`: Deprecated since iOS 5.\n*   `off`: Deprecated since iOS 5."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/form"
        }
      ]
    },
    {
      name: "label",
      description: {
        kind: "markdown",
        value: "The label element represents a caption in a user interface. The caption can be associated with a specific form control, known as the label element's labeled control, either using the for attribute, or by putting the form control inside the label element itself."
      },
      attributes: [
        {
          name: "form",
          description: {
            kind: "markdown",
            value: 'The [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element with which the label is associated (its _form owner_). If specified, the value of the attribute is the `id` of a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element in the same document. This lets you place label elements anywhere within a document, not just as descendants of their form elements.'
          }
        },
        {
          name: "for",
          description: {
            kind: "markdown",
            value: "The [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#attr-id) of a [labelable](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Form_labelable) form-related element in the same document as the `<label>` element. The first element in the document with an `id` matching the value of the `for` attribute is the _labeled control_ for this label element, if it is a labelable element. If it is not labelable then the `for` attribute has no effect. If there are other elements which also match the `id` value, later in the document, they are not considered.\n\n**Note**: A `<label>` element can have both a `for` attribute and a contained control element, as long as the `for` attribute points to the contained control element."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/label"
        }
      ]
    },
    {
      name: "input",
      description: {
        kind: "markdown",
        value: "The input element represents a typed data field, usually with a form control to allow the user to edit the data."
      },
      attributes: [
        {
          name: "accept"
        },
        {
          name: "alt"
        },
        {
          name: "autocomplete",
          valueSet: "inputautocomplete"
        },
        {
          name: "autofocus",
          valueSet: "v"
        },
        {
          name: "checked",
          valueSet: "v"
        },
        {
          name: "dirname"
        },
        {
          name: "disabled",
          valueSet: "v"
        },
        {
          name: "form"
        },
        {
          name: "formaction"
        },
        {
          name: "formenctype",
          valueSet: "et"
        },
        {
          name: "formmethod",
          valueSet: "fm"
        },
        {
          name: "formnovalidate",
          valueSet: "v"
        },
        {
          name: "formtarget"
        },
        {
          name: "height"
        },
        {
          name: "inputmode",
          valueSet: "im"
        },
        {
          name: "list"
        },
        {
          name: "max"
        },
        {
          name: "maxlength"
        },
        {
          name: "min"
        },
        {
          name: "minlength"
        },
        {
          name: "multiple",
          valueSet: "v"
        },
        {
          name: "name"
        },
        {
          name: "pattern"
        },
        {
          name: "placeholder"
        },
        {
          name: "readonly",
          valueSet: "v"
        },
        {
          name: "required",
          valueSet: "v"
        },
        {
          name: "size"
        },
        {
          name: "src"
        },
        {
          name: "step"
        },
        {
          name: "type",
          valueSet: "t"
        },
        {
          name: "value"
        },
        {
          name: "width"
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/input"
        }
      ]
    },
    {
      name: "button",
      description: {
        kind: "markdown",
        value: "The button element represents a button labeled by its contents."
      },
      attributes: [
        {
          name: "autofocus",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This Boolean attribute lets you specify that the button should have input focus when the page loads, unless the user overrides it, for example by typing in a different control. Only one form-associated element in a document can have this attribute specified."
          }
        },
        {
          name: "disabled",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: 'This Boolean attribute indicates that the user cannot interact with the button. If this attribute is not specified, the button inherits its setting from the containing element, for example [`<fieldset>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset "The HTML <fieldset> element is used to group several controls as well as labels (<label>) within a web form."); if there is no containing element with the **disabled** attribute set, then the button is enabled.\n\nFirefox will, unlike other browsers, by default, [persist the dynamic disabled state](https://stackoverflow.com/questions/5985839/bug-with-firefox-disabled-attribute-of-input-not-resetting-when-refreshing) of a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") across page loads. Use the [`autocomplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-autocomplete) attribute to control this feature.'
          }
        },
        {
          name: "form",
          description: {
            kind: "markdown",
            value: 'The form element that the button is associated with (its _form owner_). The value of the attribute must be the **id** attribute of a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element in the same document. If this attribute is not specified, the `<button>` element will be associated to an ancestor [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element, if one exists. This attribute enables you to associate `<button>` elements to [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") elements anywhere within a document, not just as descendants of [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") elements.'
          }
        },
        {
          name: "formaction",
          description: {
            kind: "markdown",
            value: "The URI of a program that processes the information submitted by the button. If specified, it overrides the [`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-action) attribute of the button's form owner."
          }
        },
        {
          name: "formenctype",
          valueSet: "et",
          description: {
            kind: "markdown",
            value: 'If the button is a submit button, this attribute specifies the type of content that is used to submit the form to the server. Possible values are:\n\n*   `application/x-www-form-urlencoded`: The default value if the attribute is not specified.\n*   `multipart/form-data`: Use this value if you are using an [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element with the [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-type) attribute set to `file`.\n*   `text/plain`\n\nIf this attribute is specified, it overrides the [`enctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-enctype) attribute of the button\'s form owner.'
          }
        },
        {
          name: "formmethod",
          valueSet: "fm",
          description: {
            kind: "markdown",
            value: "If the button is a submit button, this attribute specifies the HTTP method that the browser uses to submit the form. Possible values are:\n\n*   `post`: The data from the form are included in the body of the form and sent to the server.\n*   `get`: The data from the form are appended to the **form** attribute URI, with a '?' as a separator, and the resulting URI is sent to the server. Use this method when the form has no side-effects and contains only ASCII characters.\n\nIf specified, this attribute overrides the [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-method) attribute of the button's form owner."
          }
        },
        {
          name: "formnovalidate",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "If the button is a submit button, this Boolean attribute specifies that the form is not to be validated when it is submitted. If this attribute is specified, it overrides the [`novalidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-novalidate) attribute of the button's form owner."
          }
        },
        {
          name: "formtarget",
          description: {
            kind: "markdown",
            value: "If the button is a submit button, this attribute is a name or keyword indicating where to display the response that is received after submitting the form. This is a name of, or keyword for, a _browsing context_ (for example, tab, window, or inline frame). If this attribute is specified, it overrides the [`target`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-target) attribute of the button's form owner. The following keywords have special meanings:\n\n*   `_self`: Load the response into the same browsing context as the current one. This value is the default if the attribute is not specified.\n*   `_blank`: Load the response into a new unnamed browsing context.\n*   `_parent`: Load the response into the parent browsing context of the current one. If there is no parent, this option behaves the same way as `_self`.\n*   `_top`: Load the response into the top-level browsing context (that is, the browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this option behaves the same way as `_self`."
          }
        },
        {
          name: "name",
          description: {
            kind: "markdown",
            value: "The name of the button, which is submitted with the form data."
          }
        },
        {
          name: "type",
          valueSet: "bt",
          description: {
            kind: "markdown",
            value: "The type of the button. Possible values are:\n\n*   `submit`: The button submits the form data to the server. This is the default if the attribute is not specified, or if the attribute is dynamically changed to an empty or invalid value.\n*   `reset`: The button resets all the controls to their initial values.\n*   `button`: The button has no default behavior. It can have client-side scripts associated with the element's events, which are triggered when the events occur."
          }
        },
        {
          name: "value",
          description: {
            kind: "markdown",
            value: "The initial value of the button. It defines the value associated with the button which is submitted with the form data. This value is passed to the server in params when the form is submitted."
          }
        },
        {
          name: "autocomplete",
          description: 'The use of this attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") is nonstandard and Firefox-specific. By default, unlike other browsers, [Firefox persists the dynamic disabled state](https://stackoverflow.com/questions/5985839/bug-with-firefox-disabled-attribute-of-input-not-resetting-when-refreshing) of a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") across page loads. Setting the value of this attribute to `off` (i.e. `autocomplete="off"`) disables this feature. See [bug 654072](https://bugzilla.mozilla.org/show_bug.cgi?id=654072 "if disabled state is changed with javascript, the normal state doesn\'t return after refreshing the page").'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/button"
        }
      ]
    },
    {
      name: "select",
      description: {
        kind: "markdown",
        value: "The select element represents a control for selecting amongst a set of options."
      },
      attributes: [
        {
          name: "autocomplete",
          valueSet: "inputautocomplete",
          description: {
            kind: "markdown",
            value: 'A [`DOMString`](https://developer.mozilla.org/en-US/docs/Web/API/DOMString "DOMString is a UTF-16 String. As JavaScript already uses such strings, DOMString is mapped directly to a String.") providing a hint for a [user agent\'s](https://developer.mozilla.org/en-US/docs/Glossary/user_agent "user agent\'s: A user agent is a computer program representing a person, for example, a browser in a Web context.") autocomplete feature. See [The HTML autocomplete attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) for a complete list of values and details on how to use autocomplete.'
          }
        },
        {
          name: "autofocus",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This Boolean attribute lets you specify that a form control should have input focus when the page loads. Only one form element in a document can have the `autofocus` attribute."
          }
        },
        {
          name: "disabled",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This Boolean attribute indicates that the user cannot interact with the control. If this attribute is not specified, the control inherits its setting from the containing element, for example `fieldset`; if there is no containing element with the `disabled` attribute set, then the control is enabled."
          }
        },
        {
          name: "form",
          description: {
            kind: "markdown",
            value: 'This attribute lets you specify the form element to which the select element is associated (that is, its "form owner"). If this attribute is specified, its value must be the same as the `id` of a form element in the same document. This enables you to place select elements anywhere within a document, not just as descendants of their form elements.'
          }
        },
        {
          name: "multiple",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This Boolean attribute indicates that multiple options can be selected in the list. If it is not specified, then only one option can be selected at a time. When `multiple` is specified, most browsers will show a scrolling list box instead of a single line dropdown."
          }
        },
        {
          name: "name",
          description: {
            kind: "markdown",
            value: "This attribute is used to specify the name of the control."
          }
        },
        {
          name: "required",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "A Boolean attribute indicating that an option with a non-empty string value must be selected."
          }
        },
        {
          name: "size",
          description: {
            kind: "markdown",
            value: "If the control is presented as a scrolling list box (e.g. when `multiple` is specified), this attribute represents the number of rows in the list that should be visible at one time. Browsers are not required to present a select element as a scrolled list box. The default value is 0.\n\n**Note:** According to the HTML5 specification, the default value for size should be 1; however, in practice, this has been found to break some web sites, and no other browser currently does that, so Mozilla has opted to continue to return 0 for the time being with Firefox."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/select"
        }
      ]
    },
    {
      name: "datalist",
      description: {
        kind: "markdown",
        value: "The datalist element represents a set of option elements that represent predefined options for other controls. In the rendering, the datalist element represents nothing and it, along with its children, should be hidden."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/datalist"
        }
      ]
    },
    {
      name: "optgroup",
      description: {
        kind: "markdown",
        value: "The optgroup element represents a group of option elements with a common label."
      },
      attributes: [
        {
          name: "disabled",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "If this Boolean attribute is set, none of the items in this option group is selectable. Often browsers grey out such control and it won't receive any browsing events, like mouse clicks or focus-related ones."
          }
        },
        {
          name: "label",
          description: {
            kind: "markdown",
            value: "The name of the group of options, which the browser can use when labeling the options in the user interface. This attribute is mandatory if this element is used."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/optgroup"
        }
      ]
    },
    {
      name: "option",
      description: {
        kind: "markdown",
        value: "The option element represents an option in a select element or as part of a list of suggestions in a datalist element."
      },
      attributes: [
        {
          name: "disabled",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: 'If this Boolean attribute is set, this option is not checkable. Often browsers grey out such control and it won\'t receive any browsing event, like mouse clicks or focus-related ones. If this attribute is not set, the element can still be disabled if one of its ancestors is a disabled [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup "The HTML <optgroup> element creates a grouping of options within a <select> element.") element.'
          }
        },
        {
          name: "label",
          description: {
            kind: "markdown",
            value: "This attribute is text for the label indicating the meaning of the option. If the `label` attribute isn't defined, its value is that of the element text content."
          }
        },
        {
          name: "selected",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: 'If present, this Boolean attribute indicates that the option is initially selected. If the `<option>` element is the descendant of a [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select "The HTML <select> element represents a control that provides a menu of options") element whose [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-multiple) attribute is not set, only one single `<option>` of this [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select "The HTML <select> element represents a control that provides a menu of options") element may have the `selected` attribute.'
          }
        },
        {
          name: "value",
          description: {
            kind: "markdown",
            value: "The content of this attribute represents the value to be submitted with the form, should this option be selected. If this attribute is omitted, the value is taken from the text content of the option element."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/option"
        }
      ]
    },
    {
      name: "textarea",
      description: {
        kind: "markdown",
        value: "The textarea element represents a multiline plain text edit control for the element's raw value. The contents of the control represent the control's default value."
      },
      attributes: [
        {
          name: "autocomplete",
          valueSet: "inputautocomplete",
          description: {
            kind: "markdown",
            value: 'This attribute indicates whether the value of the control can be automatically completed by the browser. Possible values are:\n\n*   `off`: The user must explicitly enter a value into this field for every use, or the document provides its own auto-completion method; the browser does not automatically complete the entry.\n*   `on`: The browser can automatically complete the value based on values that the user has entered during previous uses.\n\nIf the `autocomplete` attribute is not specified on a `<textarea>` element, then the browser uses the `autocomplete` attribute value of the `<textarea>` element\'s form owner. The form owner is either the [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element that this `<textarea>` element is a descendant of or the form element whose `id` is specified by the `form` attribute of the input element. For more information, see the [`autocomplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-autocomplete) attribute in [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.").'
          }
        },
        {
          name: "autofocus",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This Boolean attribute lets you specify that a form control should have input focus when the page loads. Only one form-associated element in a document can have this attribute specified."
          }
        },
        {
          name: "cols",
          description: {
            kind: "markdown",
            value: "The visible width of the text control, in average character widths. If it is specified, it must be a positive integer. If it is not specified, the default value is `20`."
          }
        },
        {
          name: "dirname"
        },
        {
          name: "disabled",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: 'This Boolean attribute indicates that the user cannot interact with the control. If this attribute is not specified, the control inherits its setting from the containing element, for example [`<fieldset>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset "The HTML <fieldset> element is used to group several controls as well as labels (<label>) within a web form."); if there is no containing element when the `disabled` attribute is set, the control is enabled.'
          }
        },
        {
          name: "form",
          description: {
            kind: "markdown",
            value: 'The form element that the `<textarea>` element is associated with (its "form owner"). The value of the attribute must be the `id` of a form element in the same document. If this attribute is not specified, the `<textarea>` element must be a descendant of a form element. This attribute enables you to place `<textarea>` elements anywhere within a document, not just as descendants of form elements.'
          }
        },
        {
          name: "inputmode",
          valueSet: "im"
        },
        {
          name: "maxlength",
          description: {
            kind: "markdown",
            value: "The maximum number of characters (unicode code points) that the user can enter. If this value isn't specified, the user can enter an unlimited number of characters."
          }
        },
        {
          name: "minlength",
          description: {
            kind: "markdown",
            value: "The minimum number of characters (unicode code points) required that the user should enter."
          }
        },
        {
          name: "name",
          description: {
            kind: "markdown",
            value: "The name of the control."
          }
        },
        {
          name: "placeholder",
          description: {
            kind: "markdown",
            value: 'A hint to the user of what can be entered in the control. Carriage returns or line-feeds within the placeholder text must be treated as line breaks when rendering the hint.\n\n**Note:** Placeholders should only be used to show an example of the type of data that should be entered into a form; they are _not_ a substitute for a proper [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label "The HTML <label> element represents a caption for an item in a user interface.") element tied to the input. See [Labels and placeholders](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Labels_and_placeholders "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") in [<input>: The Input (Form Input) element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") for a full explanation.'
          }
        },
        {
          name: "readonly",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This Boolean attribute indicates that the user cannot modify the value of the control. Unlike the `disabled` attribute, the `readonly` attribute does not prevent the user from clicking or selecting in the control. The value of a read-only control is still submitted with the form."
          }
        },
        {
          name: "required",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This attribute specifies that the user must fill in a value before submitting a form."
          }
        },
        {
          name: "rows",
          description: {
            kind: "markdown",
            value: "The number of visible text lines for the control."
          }
        },
        {
          name: "wrap",
          valueSet: "w",
          description: {
            kind: "markdown",
            value: "Indicates how the control wraps text. Possible values are:\n\n*   `hard`: The browser automatically inserts line breaks (CR+LF) so that each line has no more than the width of the control; the `cols` attribute must also be specified for this to take effect.\n*   `soft`: The browser ensures that all line breaks in the value consist of a CR+LF pair, but does not insert any additional line breaks.\n*   `off` : Like `soft` but changes appearance to `white-space: pre` so line segments exceeding `cols` are not wrapped and the `<textarea>` becomes horizontally scrollable.\n\nIf this attribute is not specified, `soft` is its default value."
          }
        },
        {
          name: "autocapitalize",
          description: "This is a non-standard attribute supported by WebKit on iOS (therefore nearly all browsers running on iOS, including Safari, Firefox, and Chrome), which controls whether and how the text value should be automatically capitalized as it is entered/edited by the user. The non-deprecated values are available in iOS 5 and later. Possible values are:\n\n*   `none`: Completely disables automatic capitalization.\n*   `sentences`: Automatically capitalize the first letter of sentences.\n*   `words`: Automatically capitalize the first letter of words.\n*   `characters`: Automatically capitalize all characters.\n*   `on`: Deprecated since iOS 5.\n*   `off`: Deprecated since iOS 5."
        },
        {
          name: "spellcheck",
          description: "Specifies whether the `<textarea>` is subject to spell checking by the underlying browser/OS. the value can be:\n\n*   `true`: Indicates that the element needs to have its spelling and grammar checked.\n*   `default` : Indicates that the element is to act according to a default behavior, possibly based on the parent element's own `spellcheck` value.\n*   `false` : Indicates that the element should not be spell checked."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/textarea"
        }
      ]
    },
    {
      name: "output",
      description: {
        kind: "markdown",
        value: "The output element represents the result of a calculation performed by the application, or the result of a user action."
      },
      attributes: [
        {
          name: "for",
          description: {
            kind: "markdown",
            value: "A space-separated list of other elements’ [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id)s, indicating that those elements contributed input values to (or otherwise affected) the calculation."
          }
        },
        {
          name: "form",
          description: {
            kind: "markdown",
            value: 'The [form element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) that this element is associated with (its "form owner"). The value of the attribute must be an `id` of a form element in the same document. If this attribute is not specified, the output element must be a descendant of a form element. This attribute enables you to place output elements anywhere within a document, not just as descendants of their form elements.'
          }
        },
        {
          name: "name",
          description: {
            kind: "markdown",
            value: 'The name of the element, exposed in the [`HTMLFormElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement "The HTMLFormElement interface represents a <form> element in the DOM; it allows access to and in some cases modification of aspects of the form, as well as access to its component elements.") API.'
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/output"
        }
      ]
    },
    {
      name: "progress",
      description: {
        kind: "markdown",
        value: "The progress element represents the completion progress of a task. The progress is either indeterminate, indicating that progress is being made but that it is not clear how much more work remains to be done before the task is complete (e.g. because the task is waiting for a remote host to respond), or the progress is a number in the range zero to a maximum, giving the fraction of work that has so far been completed."
      },
      attributes: [
        {
          name: "value",
          description: {
            kind: "markdown",
            value: "This attribute specifies how much of the task that has been completed. It must be a valid floating point number between 0 and `max`, or between 0 and 1 if `max` is omitted. If there is no `value` attribute, the progress bar is indeterminate; this indicates that an activity is ongoing with no indication of how long it is expected to take."
          }
        },
        {
          name: "max",
          description: {
            kind: "markdown",
            value: "This attribute describes how much work the task indicated by the `progress` element requires. The `max` attribute, if present, must have a value greater than zero and be a valid floating point number. The default value is 1."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/progress"
        }
      ]
    },
    {
      name: "meter",
      description: {
        kind: "markdown",
        value: "The meter element represents a scalar measurement within a known range, or a fractional value; for example disk usage, the relevance of a query result, or the fraction of a voting population to have selected a particular candidate."
      },
      attributes: [
        {
          name: "value",
          description: {
            kind: "markdown",
            value: "The current numeric value. This must be between the minimum and maximum values (`min` attribute and `max` attribute) if they are specified. If unspecified or malformed, the value is 0. If specified, but not within the range given by the `min` attribute and `max` attribute, the value is equal to the nearest end of the range.\n\n**Usage note:** Unless the `value` attribute is between `0` and `1` (inclusive), the `min` and `max` attributes should define the range so that the `value` attribute's value is within it."
          }
        },
        {
          name: "min",
          description: {
            kind: "markdown",
            value: "The lower numeric bound of the measured range. This must be less than the maximum value (`max` attribute), if specified. If unspecified, the minimum value is 0."
          }
        },
        {
          name: "max",
          description: {
            kind: "markdown",
            value: "The upper numeric bound of the measured range. This must be greater than the minimum value (`min` attribute), if specified. If unspecified, the maximum value is 1."
          }
        },
        {
          name: "low",
          description: {
            kind: "markdown",
            value: "The upper numeric bound of the low end of the measured range. This must be greater than the minimum value (`min` attribute), and it also must be less than the high value and maximum value (`high` attribute and `max` attribute, respectively), if any are specified. If unspecified, or if less than the minimum value, the `low` value is equal to the minimum value."
          }
        },
        {
          name: "high",
          description: {
            kind: "markdown",
            value: "The lower numeric bound of the high end of the measured range. This must be less than the maximum value (`max` attribute), and it also must be greater than the low value and minimum value (`low` attribute and **min** attribute, respectively), if any are specified. If unspecified, or if greater than the maximum value, the `high` value is equal to the maximum value."
          }
        },
        {
          name: "optimum",
          description: {
            kind: "markdown",
            value: "This attribute indicates the optimal numeric value. It must be within the range (as defined by the `min` attribute and `max` attribute). When used with the `low` attribute and `high` attribute, it gives an indication where along the range is considered preferable. For example, if it is between the `min` attribute and the `low` attribute, then the lower range is considered preferred."
          }
        },
        {
          name: "form",
          description: "This attribute associates the element with a `form` element that has ownership of the `meter` element. For example, a `meter` might be displaying a range corresponding to an `input` element of `type` _number_. This attribute is only used if the `meter` element is being used as a form-associated element; even then, it may be omitted if the element appears as a descendant of a `form` element."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/meter"
        }
      ]
    },
    {
      name: "fieldset",
      description: {
        kind: "markdown",
        value: "The fieldset element represents a set of form controls optionally grouped under a common name."
      },
      attributes: [
        {
          name: "disabled",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "If this Boolean attribute is set, all form controls that are descendants of the `<fieldset>`, are disabled, meaning they are not editable and won't be submitted along with the `<form>`. They won't receive any browsing events, like mouse clicks or focus-related events. By default browsers display such controls grayed out. Note that form elements inside the [`<legend>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend \"The HTML <legend> element represents a caption for the content of its parent <fieldset>.\") element won't be disabled."
          }
        },
        {
          name: "form",
          description: {
            kind: "markdown",
            value: 'This attribute takes the value of the `id` attribute of a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element you want the `<fieldset>` to be part of, even if it is not inside the form.'
          }
        },
        {
          name: "name",
          description: {
            kind: "markdown",
            value: 'The name associated with the group.\n\n**Note**: The caption for the fieldset is given by the first [`<legend>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend "The HTML <legend> element represents a caption for the content of its parent <fieldset>.") element nested inside it.'
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/fieldset"
        }
      ]
    },
    {
      name: "legend",
      description: {
        kind: "markdown",
        value: "The legend element represents a caption for the rest of the contents of the legend element's parent fieldset element, if any."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/legend"
        }
      ]
    },
    {
      name: "details",
      description: {
        kind: "markdown",
        value: "The details element represents a disclosure widget from which the user can obtain additional information or controls."
      },
      attributes: [
        {
          name: "open",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This Boolean attribute indicates whether or not the details — that is, the contents of the `<details>` element — are currently visible. The default, `false`, means the details are not visible."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/details"
        }
      ]
    },
    {
      name: "summary",
      description: {
        kind: "markdown",
        value: "The summary element represents a summary, caption, or legend for the rest of the contents of the summary element's parent details element, if any."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/summary"
        }
      ]
    },
    {
      name: "dialog",
      description: {
        kind: "markdown",
        value: "The dialog element represents a part of an application that a user interacts with to perform a task, for example a dialog box, inspector, or window."
      },
      attributes: [
        {
          name: "open",
          description: "Indicates that the dialog is active and available for interaction. When the `open` attribute is not set, the dialog shouldn't be shown to the user."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/dialog"
        }
      ]
    },
    {
      name: "script",
      description: {
        kind: "markdown",
        value: "The script element allows authors to include dynamic script and data blocks in their documents. The element does not represent content for the user."
      },
      attributes: [
        {
          name: "src",
          description: {
            kind: "markdown",
            value: "This attribute specifies the URI of an external script; this can be used as an alternative to embedding a script directly within a document.\n\nIf a `script` element has a `src` attribute specified, it should not have a script embedded inside its tags."
          }
        },
        {
          name: "type",
          description: {
            kind: "markdown",
            value: 'This attribute indicates the type of script represented. The value of this attribute will be in one of the following categories:\n\n*   **Omitted or a JavaScript MIME type:** For HTML5-compliant browsers this indicates the script is JavaScript. HTML5 specification urges authors to omit the attribute rather than provide a redundant MIME type. In earlier browsers, this identified the scripting language of the embedded or imported (via the `src` attribute) code. JavaScript MIME types are [listed in the specification](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#JavaScript_types).\n*   **`module`:** For HTML5-compliant browsers the code is treated as a JavaScript module. The processing of the script contents is not affected by the `charset` and `defer` attributes. For information on using `module`, see [ES6 in Depth: Modules](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/). Code may behave differently when the `module` keyword is used.\n*   **Any other value:** The embedded content is treated as a data block which won\'t be processed by the browser. Developers must use a valid MIME type that is not a JavaScript MIME type to denote data blocks. The `src` attribute will be ignored.\n\n**Note:** in Firefox you could specify the version of JavaScript contained in a `<script>` element by including a non-standard `version` parameter inside the `type` attribute — for example `type="text/javascript;version=1.8"`. This has been removed in Firefox 59 (see [bug 1428745](https://bugzilla.mozilla.org/show_bug.cgi?id=1428745 "FIXED: Remove support for version parameter from script loader")).'
          }
        },
        {
          name: "charset"
        },
        {
          name: "async",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: `This is a Boolean attribute indicating that the browser should, if possible, load the script asynchronously.

This attribute must not be used if the \`src\` attribute is absent (i.e. for inline scripts). If it is included in this case it will have no effect.

Browsers usually assume the worst case scenario and load scripts synchronously, (i.e. \`async="false"\`) during HTML parsing.

Dynamically inserted scripts (using [\`document.createElement()\`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement "In an HTML document, the document.createElement() method creates the HTML element specified by tagName, or an HTMLUnknownElement if tagName isn't recognized.")) load asynchronously by default, so to turn on synchronous loading (i.e. scripts load in the order they were inserted) set \`async="false"\`.

See [Browser compatibility](#Browser_compatibility) for notes on browser support. See also [Async scripts for asm.js](https://developer.mozilla.org/en-US/docs/Games/Techniques/Async_scripts).`
          }
        },
        {
          name: "defer",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: 'This Boolean attribute is set to indicate to a browser that the script is meant to be executed after the document has been parsed, but before firing [`DOMContentLoaded`](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded "/en-US/docs/Web/Events/DOMContentLoaded").\n\nScripts with the `defer` attribute will prevent the `DOMContentLoaded` event from firing until the script has loaded and finished evaluating.\n\nThis attribute must not be used if the `src` attribute is absent (i.e. for inline scripts), in this case it would have no effect.\n\nTo achieve a similar effect for dynamically inserted scripts use `async="false"` instead. Scripts with the `defer` attribute will execute in the order in which they appear in the document.'
          }
        },
        {
          name: "crossorigin",
          valueSet: "xo",
          description: {
            kind: "markdown",
            value: 'Normal `script` elements pass minimal information to the [`window.onerror`](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror "The onerror property of the GlobalEventHandlers mixin is an EventHandler that processes error events.") for scripts which do not pass the standard [CORS](https://developer.mozilla.org/en-US/docs/Glossary/CORS "CORS: CORS (Cross-Origin Resource Sharing) is a system, consisting of transmitting HTTP headers, that determines whether browsers block frontend JavaScript code from accessing responses for cross-origin requests.") checks. To allow error logging for sites which use a separate domain for static media, use this attribute. See [CORS settings attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for a more descriptive explanation of its valid arguments.'
          }
        },
        {
          name: "nonce",
          description: {
            kind: "markdown",
            value: "A cryptographic nonce (number used once) to whitelist inline scripts in a [script-src Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src). The server must generate a unique nonce value each time it transmits a policy. It is critical to provide a nonce that cannot be guessed as bypassing a resource's policy is otherwise trivial."
          }
        },
        {
          name: "integrity",
          description: "This attribute contains inline metadata that a user agent can use to verify that a fetched resource has been delivered free of unexpected manipulation. See [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)."
        },
        {
          name: "nomodule",
          description: "This Boolean attribute is set to indicate that the script should not be executed in browsers that support [ES2015 modules](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/) — in effect, this can be used to serve fallback scripts to older browsers that do not support modular JavaScript code."
        },
        {
          name: "referrerpolicy",
          description: 'Indicates which [referrer](https://developer.mozilla.org/en-US/docs/Web/API/Document/referrer) to send when fetching the script, or resources fetched by the script:\n\n*   `no-referrer`: The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer "The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.") header will not be sent.\n*   `no-referrer-when-downgrade` (default): The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer "The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.") header will not be sent to [origin](https://developer.mozilla.org/en-US/docs/Glossary/origin "origin: Web content\'s origin is defined by the scheme (protocol), host (domain), and port of the URL used to access it. Two objects have the same origin only when the scheme, host, and port all match.")s without [TLS](https://developer.mozilla.org/en-US/docs/Glossary/TLS "TLS: Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL), is a protocol used by applications to communicate securely across a network, preventing tampering with and eavesdropping on email, web browsing, messaging, and other protocols.") ([HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS "HTTPS: HTTPS (HTTP Secure) is an encrypted version of the HTTP protocol. It usually uses SSL or TLS to encrypt all communication between a client and a server. This secure connection allows clients to safely exchange sensitive data with a server, for example for banking activities or online shopping.")).\n*   `origin`: The sent referrer will be limited to the origin of the referring page: its [scheme](https://developer.mozilla.org/en-US/docs/Archive/Mozilla/URIScheme), [host](https://developer.mozilla.org/en-US/docs/Glossary/host "host: A host is a device connected to the Internet (or a local network). Some hosts called servers offer additional services like serving webpages or storing files and emails."), and [port](https://developer.mozilla.org/en-US/docs/Glossary/port "port: For a computer connected to a network with an IP address, a port is a communication endpoint. Ports are designated by numbers, and below 1024 each port is associated by default with a specific protocol.").\n*   `origin-when-cross-origin`: The referrer sent to other origins will be limited to the scheme, the host, and the port. Navigations on the same origin will still include the path.\n*   `same-origin`: A referrer will be sent for [same origin](https://developer.mozilla.org/en-US/docs/Glossary/Same-origin_policy "same origin: The same-origin policy is a critical security mechanism that restricts how a document or script loaded from one origin can interact with a resource from another origin."), but cross-origin requests will contain no referrer information.\n*   `strict-origin`: Only send the origin of the document as the referrer when the protocol security level stays the same (e.g. HTTPS→HTTPS), but don\'t send it to a less secure destination (e.g. HTTPS→HTTP).\n*   `strict-origin-when-cross-origin`: Send a full URL when performing a same-origin request, but only send the origin when the protocol security level stays the same (e.g.HTTPS→HTTPS), and send no header to a less secure destination (e.g. HTTPS→HTTP).\n*   `unsafe-url`: The referrer will include the origin _and_ the path (but not the [fragment](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/hash), [password](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/password), or [username](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/username)). **This value is unsafe**, because it leaks origins and paths from TLS-protected resources to insecure origins.\n\n**Note**: An empty string value (`""`) is both the default value, and a fallback value if `referrerpolicy` is not supported. If `referrerpolicy` is not explicitly specified on the `<script>` element, it will adopt a higher-level referrer policy, i.e. one set on the whole document or domain. If a higher-level policy is not available, the empty string is treated as being equivalent to `no-referrer-when-downgrade`.'
        },
        {
          name: "text",
          description: "Like the `textContent` attribute, this attribute sets the text content of the element. Unlike the `textContent` attribute, however, this attribute is evaluated as executable code after the node is inserted into the DOM."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/script"
        }
      ]
    },
    {
      name: "noscript",
      description: {
        kind: "markdown",
        value: "The noscript element represents nothing if scripting is enabled, and represents its children if scripting is disabled. It is used to present different markup to user agents that support scripting and those that don't support scripting, by affecting how the document is parsed."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/noscript"
        }
      ]
    },
    {
      name: "template",
      description: {
        kind: "markdown",
        value: "The template element is used to declare fragments of HTML that can be cloned and inserted in the document by script."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/template"
        }
      ]
    },
    {
      name: "canvas",
      description: {
        kind: "markdown",
        value: "The canvas element provides scripts with a resolution-dependent bitmap canvas, which can be used for rendering graphs, game graphics, art, or other visual images on the fly."
      },
      attributes: [
        {
          name: "width",
          description: {
            kind: "markdown",
            value: "The width of the coordinate space in CSS pixels. Defaults to 300."
          }
        },
        {
          name: "height",
          description: {
            kind: "markdown",
            value: "The height of the coordinate space in CSS pixels. Defaults to 150."
          }
        },
        {
          name: "moz-opaque",
          description: "Lets the canvas know whether or not translucency will be a factor. If the canvas knows there's no translucency, painting performance can be optimized. This is only supported by Mozilla-based browsers; use the standardized [`canvas.getContext('2d', { alpha: false })`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext \"The HTMLCanvasElement.getContext() method returns a drawing context on the canvas, or null if the context identifier is not supported.\") instead."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/canvas"
        }
      ]
    }
  ],
  globalAttributes: [
    {
      name: "accesskey",
      description: {
        kind: "markdown",
        value: "Provides a hint for generating a keyboard shortcut for the current element. This attribute consists of a space-separated list of characters. The browser should use the first one that exists on the computer keyboard layout."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/accesskey"
        }
      ]
    },
    {
      name: "autocapitalize",
      description: {
        kind: "markdown",
        value: "Controls whether and how text input is automatically capitalized as it is entered/edited by the user. It can have the following values:\n\n*   `off` or `none`, no autocapitalization is applied (all letters default to lowercase)\n*   `on` or `sentences`, the first letter of each sentence defaults to a capital letter; all other letters default to lowercase\n*   `words`, the first letter of each word defaults to a capital letter; all other letters default to lowercase\n*   `characters`, all letters should default to uppercase"
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/autocapitalize"
        }
      ]
    },
    {
      name: "class",
      description: {
        kind: "markdown",
        value: 'A space-separated list of the classes of the element. Classes allows CSS and JavaScript to select and access specific elements via the [class selectors](/en-US/docs/Web/CSS/Class_selectors) or functions like the method [`Document.getElementsByClassName()`](/en-US/docs/Web/API/Document/getElementsByClassName "returns an array-like object of all child elements which have all of the given class names.").'
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/class"
        }
      ]
    },
    {
      name: "contenteditable",
      description: {
        kind: "markdown",
        value: "An enumerated attribute indicating if the element should be editable by the user. If so, the browser modifies its widget to allow editing. The attribute must take one of the following values:\n\n*   `true` or the _empty string_, which indicates that the element must be editable;\n*   `false`, which indicates that the element must not be editable."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/contenteditable"
        }
      ]
    },
    {
      name: "contextmenu",
      description: {
        kind: "markdown",
        value: 'The `[**id**](#attr-id)` of a [`<menu>`](/en-US/docs/Web/HTML/Element/menu "The HTML <menu> element represents a group of commands that a user can perform or activate. This includes both list menus, which might appear across the top of a screen, as well as context menus, such as those that might appear underneath a button after it has been clicked.") to use as the contextual menu for this element.'
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/contextmenu"
        }
      ]
    },
    {
      name: "dir",
      description: {
        kind: "markdown",
        value: "An enumerated attribute indicating the directionality of the element's text. It can have the following values:\n\n*   `ltr`, which means _left to right_ and is to be used for languages that are written from the left to the right (like English);\n*   `rtl`, which means _right to left_ and is to be used for languages that are written from the right to the left (like Arabic);\n*   `auto`, which lets the user agent decide. It uses a basic algorithm as it parses the characters inside the element until it finds a character with a strong directionality, then it applies that directionality to the whole element."
      },
      valueSet: "d",
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/dir"
        }
      ]
    },
    {
      name: "draggable",
      description: {
        kind: "markdown",
        value: "An enumerated attribute indicating whether the element can be dragged, using the [Drag and Drop API](/en-us/docs/DragDrop/Drag_and_Drop). It can have the following values:\n\n*   `true`, which indicates that the element may be dragged\n*   `false`, which indicates that the element may not be dragged."
      },
      valueSet: "b",
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/draggable"
        }
      ]
    },
    {
      name: "dropzone",
      description: {
        kind: "markdown",
        value: "An enumerated attribute indicating what types of content can be dropped on an element, using the [Drag and Drop API](/en-US/docs/DragDrop/Drag_and_Drop). It can have the following values:\n\n*   `copy`, which indicates that dropping will create a copy of the element that was dragged\n*   `move`, which indicates that the element that was dragged will be moved to this new location.\n*   `link`, will create a link to the dragged data."
      }
    },
    {
      name: "exportparts",
      description: {
        kind: "markdown",
        value: "Used to transitively export shadow parts from a nested shadow tree into a containing light tree."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/exportparts"
        }
      ]
    },
    {
      name: "hidden",
      description: {
        kind: "markdown",
        value: "A Boolean attribute indicates that the element is not yet, or is no longer, _relevant_. For example, it can be used to hide elements of the page that can't be used until the login process has been completed. The browser won't render such elements. This attribute must not be used to hide content that could legitimately be shown."
      },
      valueSet: "v",
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/hidden"
        }
      ]
    },
    {
      name: "id",
      description: {
        kind: "markdown",
        value: "Defines a unique identifier (ID) which must be unique in the whole document. Its purpose is to identify the element when linking (using a fragment identifier), scripting, or styling (with CSS)."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/id"
        }
      ]
    },
    {
      name: "inputmode",
      description: {
        kind: "markdown",
        value: 'Provides a hint to browsers as to the type of virtual keyboard configuration to use when editing this element or its contents. Used primarily on [`<input>`](/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") elements, but is usable on any element while in `[contenteditable](/en-US/docs/Web/HTML/Global_attributes#attr-contenteditable)` mode.'
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/inputmode"
        }
      ]
    },
    {
      name: "is",
      description: {
        kind: "markdown",
        value: "Allows you to specify that a standard HTML element should behave like a registered custom built-in element (see [Using custom elements](/en-US/docs/Web/Web_Components/Using_custom_elements) for more details)."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/is"
        }
      ]
    },
    {
      name: "itemid",
      description: {
        kind: "markdown",
        value: "The unique, global identifier of an item."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemid"
        }
      ]
    },
    {
      name: "itemprop",
      description: {
        kind: "markdown",
        value: "Used to add properties to an item. Every HTML element may have an `itemprop` attribute specified, where an `itemprop` consists of a name and value pair."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemprop"
        }
      ]
    },
    {
      name: "itemref",
      description: {
        kind: "markdown",
        value: "Properties that are not descendants of an element with the `itemscope` attribute can be associated with the item using an `itemref`. It provides a list of element ids (not `itemid`s) with additional properties elsewhere in the document."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemref"
        }
      ]
    },
    {
      name: "itemscope",
      description: {
        kind: "markdown",
        value: "`itemscope` (usually) works along with `[itemtype](/en-US/docs/Web/HTML/Global_attributes#attr-itemtype)` to specify that the HTML contained in a block is about a particular item. `itemscope` creates the Item and defines the scope of the `itemtype` associated with it. `itemtype` is a valid URL of a vocabulary (such as [schema.org](https://schema.org/)) that describes the item and its properties context."
      },
      valueSet: "v",
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemscope"
        }
      ]
    },
    {
      name: "itemtype",
      description: {
        kind: "markdown",
        value: "Specifies the URL of the vocabulary that will be used to define `itemprop`s (item properties) in the data structure. `[itemscope](/en-US/docs/Web/HTML/Global_attributes#attr-itemscope)` is used to set the scope of where in the data structure the vocabulary set by `itemtype` will be active."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemtype"
        }
      ]
    },
    {
      name: "lang",
      description: {
        kind: "markdown",
        value: "Helps define the language of an element: the language that non-editable elements are in, or the language that editable elements should be written in by the user. The attribute contains one “language tag” (made of hyphen-separated “language subtags”) in the format defined in [_Tags for Identifying Languages (BCP47)_](https://www.ietf.org/rfc/bcp/bcp47.txt). [**xml:lang**](#attr-xml:lang) has priority over it."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/lang"
        }
      ]
    },
    {
      name: "part",
      description: {
        kind: "markdown",
        value: 'A space-separated list of the part names of the element. Part names allows CSS to select and style specific elements in a shadow tree via the [`::part`](/en-US/docs/Web/CSS/::part "The ::part CSS pseudo-element represents any element within a shadow tree that has a matching part attribute.") pseudo-element.'
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/part"
        }
      ]
    },
    {
      name: "role",
      valueSet: "roles"
    },
    {
      name: "slot",
      description: {
        kind: "markdown",
        value: "Assigns a slot in a [shadow DOM](/en-US/docs/Web/Web_Components/Shadow_DOM) shadow tree to an element: An element with a `slot` attribute is assigned to the slot created by the [`<slot>`](/en-US/docs/Web/HTML/Element/slot \"The HTML <slot> element—part of the Web Components technology suite—is a placeholder inside a web component that you can fill with your own markup, which lets you create separate DOM trees and present them together.\") element whose `[name](/en-US/docs/Web/HTML/Element/slot#attr-name)` attribute's value matches that `slot` attribute's value."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/slot"
        }
      ]
    },
    {
      name: "spellcheck",
      description: {
        kind: "markdown",
        value: "An enumerated attribute defines whether the element may be checked for spelling errors. It may have the following values:\n\n*   `true`, which indicates that the element should be, if possible, checked for spelling errors;\n*   `false`, which indicates that the element should not be checked for spelling errors."
      },
      valueSet: "b",
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/spellcheck"
        }
      ]
    },
    {
      name: "style",
      description: {
        kind: "markdown",
        value: 'Contains [CSS](/en-US/docs/Web/CSS) styling declarations to be applied to the element. Note that it is recommended for styles to be defined in a separate file or files. This attribute and the [`<style>`](/en-US/docs/Web/HTML/Element/style "The HTML <style> element contains style information for a document, or part of a document.") element have mainly the purpose of allowing for quick styling, for example for testing purposes.'
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/style"
        }
      ]
    },
    {
      name: "tabindex",
      description: {
        kind: "markdown",
        value: `An integer attribute indicating if the element can take input focus (is _focusable_), if it should participate to sequential keyboard navigation, and if so, at what position. It can take several values:

*   a _negative value_ means that the element should be focusable, but should not be reachable via sequential keyboard navigation;
*   \`0\` means that the element should be focusable and reachable via sequential keyboard navigation, but its relative order is defined by the platform convention;
*   a _positive value_ means that the element should be focusable and reachable via sequential keyboard navigation; the order in which the elements are focused is the increasing value of the [**tabindex**](#attr-tabindex). If several elements share the same tabindex, their relative order follows their relative positions in the document.`
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/tabindex"
        }
      ]
    },
    {
      name: "title",
      description: {
        kind: "markdown",
        value: "Contains a text representing advisory information related to the element it belongs to. Such information can typically, but not necessarily, be presented to the user as a tooltip."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/title"
        }
      ]
    },
    {
      name: "translate",
      description: {
        kind: "markdown",
        value: "An enumerated attribute that is used to specify whether an element's attribute values and the values of its [`Text`](/en-US/docs/Web/API/Text \"The Text interface represents the textual content of Element or Attr. If an element has no markup within its content, it has a single child implementing Text that contains the element's text. However, if the element contains markup, it is parsed into information items and Text nodes that form its children.\") node children are to be translated when the page is localized, or whether to leave them unchanged. It can have the following values:\n\n*   empty string and `yes`, which indicates that the element will be translated.\n*   `no`, which indicates that the element will not be translated."
      },
      valueSet: "y",
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/translate"
        }
      ]
    },
    {
      name: "onabort",
      description: {
        kind: "markdown",
        value: "The loading of a resource has been aborted."
      }
    },
    {
      name: "onblur",
      description: {
        kind: "markdown",
        value: "An element has lost focus (does not bubble)."
      }
    },
    {
      name: "oncanplay",
      description: {
        kind: "markdown",
        value: "The user agent can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content."
      }
    },
    {
      name: "oncanplaythrough",
      description: {
        kind: "markdown",
        value: "The user agent can play the media up to its end without having to stop for further buffering of content."
      }
    },
    {
      name: "onchange",
      description: {
        kind: "markdown",
        value: "The change event is fired for <input>, <select>, and <textarea> elements when a change to the element's value is committed by the user."
      }
    },
    {
      name: "onclick",
      description: {
        kind: "markdown",
        value: "A pointing device button has been pressed and released on an element."
      }
    },
    {
      name: "oncontextmenu",
      description: {
        kind: "markdown",
        value: "The right button of the mouse is clicked (before the context menu is displayed)."
      }
    },
    {
      name: "ondblclick",
      description: {
        kind: "markdown",
        value: "A pointing device button is clicked twice on an element."
      }
    },
    {
      name: "ondrag",
      description: {
        kind: "markdown",
        value: "An element or text selection is being dragged (every 350ms)."
      }
    },
    {
      name: "ondragend",
      description: {
        kind: "markdown",
        value: "A drag operation is being ended (by releasing a mouse button or hitting the escape key)."
      }
    },
    {
      name: "ondragenter",
      description: {
        kind: "markdown",
        value: "A dragged element or text selection enters a valid drop target."
      }
    },
    {
      name: "ondragleave",
      description: {
        kind: "markdown",
        value: "A dragged element or text selection leaves a valid drop target."
      }
    },
    {
      name: "ondragover",
      description: {
        kind: "markdown",
        value: "An element or text selection is being dragged over a valid drop target (every 350ms)."
      }
    },
    {
      name: "ondragstart",
      description: {
        kind: "markdown",
        value: "The user starts dragging an element or text selection."
      }
    },
    {
      name: "ondrop",
      description: {
        kind: "markdown",
        value: "An element is dropped on a valid drop target."
      }
    },
    {
      name: "ondurationchange",
      description: {
        kind: "markdown",
        value: "The duration attribute has been updated."
      }
    },
    {
      name: "onemptied",
      description: {
        kind: "markdown",
        value: "The media has become empty; for example, this event is sent if the media has already been loaded (or partially loaded), and the load() method is called to reload it."
      }
    },
    {
      name: "onended",
      description: {
        kind: "markdown",
        value: "Playback has stopped because the end of the media was reached."
      }
    },
    {
      name: "onerror",
      description: {
        kind: "markdown",
        value: "A resource failed to load."
      }
    },
    {
      name: "onfocus",
      description: {
        kind: "markdown",
        value: "An element has received focus (does not bubble)."
      }
    },
    {
      name: "onformchange"
    },
    {
      name: "onforminput"
    },
    {
      name: "oninput",
      description: {
        kind: "markdown",
        value: "The value of an element changes or the content of an element with the attribute contenteditable is modified."
      }
    },
    {
      name: "oninvalid",
      description: {
        kind: "markdown",
        value: "A submittable element has been checked and doesn't satisfy its constraints."
      }
    },
    {
      name: "onkeydown",
      description: {
        kind: "markdown",
        value: "A key is pressed down."
      }
    },
    {
      name: "onkeypress",
      description: {
        kind: "markdown",
        value: "A key is pressed down and that key normally produces a character value (use input instead)."
      }
    },
    {
      name: "onkeyup",
      description: {
        kind: "markdown",
        value: "A key is released."
      }
    },
    {
      name: "onload",
      description: {
        kind: "markdown",
        value: "A resource and its dependent resources have finished loading."
      }
    },
    {
      name: "onloadeddata",
      description: {
        kind: "markdown",
        value: "The first frame of the media has finished loading."
      }
    },
    {
      name: "onloadedmetadata",
      description: {
        kind: "markdown",
        value: "The metadata has been loaded."
      }
    },
    {
      name: "onloadstart",
      description: {
        kind: "markdown",
        value: "Progress has begun."
      }
    },
    {
      name: "onmousedown",
      description: {
        kind: "markdown",
        value: "A pointing device button (usually a mouse) is pressed on an element."
      }
    },
    {
      name: "onmousemove",
      description: {
        kind: "markdown",
        value: "A pointing device is moved over an element."
      }
    },
    {
      name: "onmouseout",
      description: {
        kind: "markdown",
        value: "A pointing device is moved off the element that has the listener attached or off one of its children."
      }
    },
    {
      name: "onmouseover",
      description: {
        kind: "markdown",
        value: "A pointing device is moved onto the element that has the listener attached or onto one of its children."
      }
    },
    {
      name: "onmouseup",
      description: {
        kind: "markdown",
        value: "A pointing device button is released over an element."
      }
    },
    {
      name: "onmousewheel"
    },
    {
      name: "onmouseenter",
      description: {
        kind: "markdown",
        value: "A pointing device is moved onto the element that has the listener attached."
      }
    },
    {
      name: "onmouseleave",
      description: {
        kind: "markdown",
        value: "A pointing device is moved off the element that has the listener attached."
      }
    },
    {
      name: "onpause",
      description: {
        kind: "markdown",
        value: "Playback has been paused."
      }
    },
    {
      name: "onplay",
      description: {
        kind: "markdown",
        value: "Playback has begun."
      }
    },
    {
      name: "onplaying",
      description: {
        kind: "markdown",
        value: "Playback is ready to start after having been paused or delayed due to lack of data."
      }
    },
    {
      name: "onprogress",
      description: {
        kind: "markdown",
        value: "In progress."
      }
    },
    {
      name: "onratechange",
      description: {
        kind: "markdown",
        value: "The playback rate has changed."
      }
    },
    {
      name: "onreset",
      description: {
        kind: "markdown",
        value: "A form is reset."
      }
    },
    {
      name: "onresize",
      description: {
        kind: "markdown",
        value: "The document view has been resized."
      }
    },
    {
      name: "onreadystatechange",
      description: {
        kind: "markdown",
        value: "The readyState attribute of a document has changed."
      }
    },
    {
      name: "onscroll",
      description: {
        kind: "markdown",
        value: "The document view or an element has been scrolled."
      }
    },
    {
      name: "onseeked",
      description: {
        kind: "markdown",
        value: "A seek operation completed."
      }
    },
    {
      name: "onseeking",
      description: {
        kind: "markdown",
        value: "A seek operation began."
      }
    },
    {
      name: "onselect",
      description: {
        kind: "markdown",
        value: "Some text is being selected."
      }
    },
    {
      name: "onshow",
      description: {
        kind: "markdown",
        value: "A contextmenu event was fired on/bubbled to an element that has a contextmenu attribute"
      }
    },
    {
      name: "onstalled",
      description: {
        kind: "markdown",
        value: "The user agent is trying to fetch media data, but data is unexpectedly not forthcoming."
      }
    },
    {
      name: "onsubmit",
      description: {
        kind: "markdown",
        value: "A form is submitted."
      }
    },
    {
      name: "onsuspend",
      description: {
        kind: "markdown",
        value: "Media data loading has been suspended."
      }
    },
    {
      name: "ontimeupdate",
      description: {
        kind: "markdown",
        value: "The time indicated by the currentTime attribute has been updated."
      }
    },
    {
      name: "onvolumechange",
      description: {
        kind: "markdown",
        value: "The volume has changed."
      }
    },
    {
      name: "onwaiting",
      description: {
        kind: "markdown",
        value: "Playback has stopped because of a temporary lack of data."
      }
    },
    {
      name: "onpointercancel",
      description: {
        kind: "markdown",
        value: "The pointer is unlikely to produce any more events."
      }
    },
    {
      name: "onpointerdown",
      description: {
        kind: "markdown",
        value: "The pointer enters the active buttons state."
      }
    },
    {
      name: "onpointerenter",
      description: {
        kind: "markdown",
        value: "Pointing device is moved inside the hit-testing boundary."
      }
    },
    {
      name: "onpointerleave",
      description: {
        kind: "markdown",
        value: "Pointing device is moved out of the hit-testing boundary."
      }
    },
    {
      name: "onpointerlockchange",
      description: {
        kind: "markdown",
        value: "The pointer was locked or released."
      }
    },
    {
      name: "onpointerlockerror",
      description: {
        kind: "markdown",
        value: "It was impossible to lock the pointer for technical reasons or because the permission was denied."
      }
    },
    {
      name: "onpointermove",
      description: {
        kind: "markdown",
        value: "The pointer changed coordinates."
      }
    },
    {
      name: "onpointerout",
      description: {
        kind: "markdown",
        value: "The pointing device moved out of hit-testing boundary or leaves detectable hover range."
      }
    },
    {
      name: "onpointerover",
      description: {
        kind: "markdown",
        value: "The pointing device is moved into the hit-testing boundary."
      }
    },
    {
      name: "onpointerup",
      description: {
        kind: "markdown",
        value: "The pointer leaves the active buttons state."
      }
    },
    {
      name: "aria-activedescendant",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-activedescendant"
        }
      ],
      description: {
        kind: "markdown",
        value: "Identifies the currently active element when DOM focus is on a [`composite`](https://www.w3.org/TR/wai-aria-1.1/#composite) widget, [`textbox`](https://www.w3.org/TR/wai-aria-1.1/#textbox), [`group`](https://www.w3.org/TR/wai-aria-1.1/#group), or [`application`](https://www.w3.org/TR/wai-aria-1.1/#application)."
      }
    },
    {
      name: "aria-atomic",
      valueSet: "b",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-atomic"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates whether [assistive technologies](https://www.w3.org/TR/wai-aria-1.1/#dfn-assistive-technology) will present all, or only parts of, the changed region based on the change notifications defined by the [`aria-relevant`](https://www.w3.org/TR/wai-aria-1.1/#aria-relevant) attribute."
      }
    },
    {
      name: "aria-autocomplete",
      valueSet: "autocomplete",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-autocomplete"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made."
      }
    },
    {
      name: "aria-busy",
      valueSet: "b",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-busy"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates an element is being modified and that assistive technologies _MAY_ want to wait until the modifications are complete before exposing them to the user."
      }
    },
    {
      name: "aria-checked",
      valueSet: "tristate",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-checked"
        }
      ],
      description: {
        kind: "markdown",
        value: 'Indicates the current "checked" [state](https://www.w3.org/TR/wai-aria-1.1/#dfn-state) of checkboxes, radio buttons, and other [widgets](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget). See related [`aria-pressed`](https://www.w3.org/TR/wai-aria-1.1/#aria-pressed) and [`aria-selected`](https://www.w3.org/TR/wai-aria-1.1/#aria-selected).'
      }
    },
    {
      name: "aria-colcount",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-colcount"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines the total number of columns in a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-colindex`](https://www.w3.org/TR/wai-aria-1.1/#aria-colindex)."
      }
    },
    {
      name: "aria-colindex",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-colindex"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines an [element's](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) column index or position with respect to the total number of columns within a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-colcount`](https://www.w3.org/TR/wai-aria-1.1/#aria-colcount) and [`aria-colspan`](https://www.w3.org/TR/wai-aria-1.1/#aria-colspan)."
      }
    },
    {
      name: "aria-colspan",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-colspan"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines the number of columns spanned by a cell or gridcell within a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-colindex`](https://www.w3.org/TR/wai-aria-1.1/#aria-colindex) and [`aria-rowspan`](https://www.w3.org/TR/wai-aria-1.1/#aria-rowspan)."
      }
    },
    {
      name: "aria-controls",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-controls"
        }
      ],
      description: {
        kind: "markdown",
        value: "Identifies the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) (or elements) whose contents or presence are controlled by the current element. See related [`aria-owns`](https://www.w3.org/TR/wai-aria-1.1/#aria-owns)."
      }
    },
    {
      name: "aria-current",
      valueSet: "current",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-current"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) that represents the current item within a container or set of related elements."
      }
    },
    {
      name: "aria-describedby",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-describedby"
        }
      ],
      description: {
        kind: "markdown",
        value: "Identifies the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) (or elements) that describes the [object](https://www.w3.org/TR/wai-aria-1.1/#dfn-object). See related [`aria-labelledby`](https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby)."
      }
    },
    {
      name: "aria-disabled",
      valueSet: "b",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-disabled"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates that the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) is [perceivable](https://www.w3.org/TR/wai-aria-1.1/#dfn-perceivable) but disabled, so it is not editable or otherwise [operable](https://www.w3.org/TR/wai-aria-1.1/#dfn-operable). See related [`aria-hidden`](https://www.w3.org/TR/wai-aria-1.1/#aria-hidden) and [`aria-readonly`](https://www.w3.org/TR/wai-aria-1.1/#aria-readonly)."
      }
    },
    {
      name: "aria-dropeffect",
      valueSet: "dropeffect",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-dropeffect"
        }
      ],
      description: {
        kind: "markdown",
        value: "\\[Deprecated in ARIA 1.1\\] Indicates what functions can be performed when a dragged object is released on the drop target."
      }
    },
    {
      name: "aria-errormessage",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-errormessage"
        }
      ],
      description: {
        kind: "markdown",
        value: "Identifies the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) that provides an error message for the [object](https://www.w3.org/TR/wai-aria-1.1/#dfn-object). See related [`aria-invalid`](https://www.w3.org/TR/wai-aria-1.1/#aria-invalid) and [`aria-describedby`](https://www.w3.org/TR/wai-aria-1.1/#aria-describedby)."
      }
    },
    {
      name: "aria-expanded",
      valueSet: "u",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-expanded"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed."
      }
    },
    {
      name: "aria-flowto",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-flowto"
        }
      ],
      description: {
        kind: "markdown",
        value: "Identifies the next [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order."
      }
    },
    {
      name: "aria-grabbed",
      valueSet: "u",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-grabbed"
        }
      ],
      description: {
        kind: "markdown",
        value: `\\[Deprecated in ARIA 1.1\\] Indicates an element's "grabbed" [state](https://www.w3.org/TR/wai-aria-1.1/#dfn-state) in a drag-and-drop operation.`
      }
    },
    {
      name: "aria-haspopup",
      valueSet: "haspopup",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element)."
      }
    },
    {
      name: "aria-hidden",
      valueSet: "b",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-hidden"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates whether the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) is exposed to an accessibility API. See related [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.1/#aria-disabled)."
      }
    },
    {
      name: "aria-invalid",
      valueSet: "invalid",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-invalid"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates the entered value does not conform to the format expected by the application. See related [`aria-errormessage`](https://www.w3.org/TR/wai-aria-1.1/#aria-errormessage)."
      }
    },
    {
      name: "aria-label",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-label"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines a string value that labels the current element. See related [`aria-labelledby`](https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby)."
      }
    },
    {
      name: "aria-labelledby",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby"
        }
      ],
      description: {
        kind: "markdown",
        value: "Identifies the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) (or elements) that labels the current element. See related [`aria-describedby`](https://www.w3.org/TR/wai-aria-1.1/#aria-describedby)."
      }
    },
    {
      name: "aria-level",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-level"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines the hierarchical level of an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) within a structure."
      }
    },
    {
      name: "aria-live",
      valueSet: "live",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-live"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates that an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) will be updated, and describes the types of updates the [user agents](https://www.w3.org/TR/wai-aria-1.1/#dfn-user-agent), [assistive technologies](https://www.w3.org/TR/wai-aria-1.1/#dfn-assistive-technology), and user can expect from the [live region](https://www.w3.org/TR/wai-aria-1.1/#dfn-live-region)."
      }
    },
    {
      name: "aria-modal",
      valueSet: "b",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-modal"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates whether an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) is modal when displayed."
      }
    },
    {
      name: "aria-multiline",
      valueSet: "b",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-multiline"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates whether a text box accepts multiple lines of input or only a single line."
      }
    },
    {
      name: "aria-multiselectable",
      valueSet: "b",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-multiselectable"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates that the user may select more than one item from the current selectable descendants."
      }
    },
    {
      name: "aria-orientation",
      valueSet: "orientation",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-orientation"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous."
      }
    },
    {
      name: "aria-owns",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-owns"
        }
      ],
      description: {
        kind: "markdown",
        value: "Identifies an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) (or elements) in order to define a visual, functional, or contextual parent/child [relationship](https://www.w3.org/TR/wai-aria-1.1/#dfn-relationship) between DOM elements where the DOM hierarchy cannot be used to represent the relationship. See related [`aria-controls`](https://www.w3.org/TR/wai-aria-1.1/#aria-controls)."
      }
    },
    {
      name: "aria-placeholder",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-placeholder"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format."
      }
    },
    {
      name: "aria-posinset",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-posinset"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element)'s number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. See related [`aria-setsize`](https://www.w3.org/TR/wai-aria-1.1/#aria-setsize)."
      }
    },
    {
      name: "aria-pressed",
      valueSet: "tristate",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-pressed"
        }
      ],
      description: {
        kind: "markdown",
        value: 'Indicates the current "pressed" [state](https://www.w3.org/TR/wai-aria-1.1/#dfn-state) of toggle buttons. See related [`aria-checked`](https://www.w3.org/TR/wai-aria-1.1/#aria-checked) and [`aria-selected`](https://www.w3.org/TR/wai-aria-1.1/#aria-selected).'
      }
    },
    {
      name: "aria-readonly",
      valueSet: "b",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-readonly"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates that the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) is not editable, but is otherwise [operable](https://www.w3.org/TR/wai-aria-1.1/#dfn-operable). See related [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.1/#aria-disabled)."
      }
    },
    {
      name: "aria-relevant",
      valueSet: "relevant",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-relevant"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. See related [`aria-atomic`](https://www.w3.org/TR/wai-aria-1.1/#aria-atomic)."
      }
    },
    {
      name: "aria-required",
      valueSet: "b",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-required"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates that user input is required on the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) before a form may be submitted."
      }
    },
    {
      name: "aria-roledescription",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-roledescription"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines a human-readable, author-localized description for the [role](https://www.w3.org/TR/wai-aria-1.1/#dfn-role) of an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element)."
      }
    },
    {
      name: "aria-rowcount",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-rowcount"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines the total number of rows in a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-rowindex`](https://www.w3.org/TR/wai-aria-1.1/#aria-rowindex)."
      }
    },
    {
      name: "aria-rowindex",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-rowindex"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines an [element's](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) row index or position with respect to the total number of rows within a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-rowcount`](https://www.w3.org/TR/wai-aria-1.1/#aria-rowcount) and [`aria-rowspan`](https://www.w3.org/TR/wai-aria-1.1/#aria-rowspan)."
      }
    },
    {
      name: "aria-rowspan",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-rowspan"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines the number of rows spanned by a cell or gridcell within a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-rowindex`](https://www.w3.org/TR/wai-aria-1.1/#aria-rowindex) and [`aria-colspan`](https://www.w3.org/TR/wai-aria-1.1/#aria-colspan)."
      }
    },
    {
      name: "aria-selected",
      valueSet: "u",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-selected"
        }
      ],
      description: {
        kind: "markdown",
        value: 'Indicates the current "selected" [state](https://www.w3.org/TR/wai-aria-1.1/#dfn-state) of various [widgets](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget). See related [`aria-checked`](https://www.w3.org/TR/wai-aria-1.1/#aria-checked) and [`aria-pressed`](https://www.w3.org/TR/wai-aria-1.1/#aria-pressed).'
      }
    },
    {
      name: "aria-setsize",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-setsize"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. See related [`aria-posinset`](https://www.w3.org/TR/wai-aria-1.1/#aria-posinset)."
      }
    },
    {
      name: "aria-sort",
      valueSet: "sort",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-sort"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates if items in a table or grid are sorted in ascending or descending order."
      }
    },
    {
      name: "aria-valuemax",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-valuemax"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines the maximum allowed value for a range [widget](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget)."
      }
    },
    {
      name: "aria-valuemin",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-valuemin"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines the minimum allowed value for a range [widget](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget)."
      }
    },
    {
      name: "aria-valuenow",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-valuenow"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines the current value for a range [widget](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget). See related [`aria-valuetext`](https://www.w3.org/TR/wai-aria-1.1/#aria-valuetext)."
      }
    },
    {
      name: "aria-valuetext",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-valuetext"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines the human readable text alternative of [`aria-valuenow`](https://www.w3.org/TR/wai-aria-1.1/#aria-valuenow) for a range [widget](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget)."
      }
    },
    {
      name: "aria-details",
      description: {
        kind: "markdown",
        value: "Identifies the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) that provides a detailed, extended description for the [object](https://www.w3.org/TR/wai-aria-1.1/#dfn-object). See related [`aria-describedby`](https://www.w3.org/TR/wai-aria-1.1/#aria-describedby)."
      }
    },
    {
      name: "aria-keyshortcuts",
      description: {
        kind: "markdown",
        value: "Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element."
      }
    }
  ],
  valueSets: [
    {
      name: "b",
      values: [
        {
          name: "true"
        },
        {
          name: "false"
        }
      ]
    },
    {
      name: "u",
      values: [
        {
          name: "true"
        },
        {
          name: "false"
        },
        {
          name: "undefined"
        }
      ]
    },
    {
      name: "o",
      values: [
        {
          name: "on"
        },
        {
          name: "off"
        }
      ]
    },
    {
      name: "y",
      values: [
        {
          name: "yes"
        },
        {
          name: "no"
        }
      ]
    },
    {
      name: "w",
      values: [
        {
          name: "soft"
        },
        {
          name: "hard"
        }
      ]
    },
    {
      name: "d",
      values: [
        {
          name: "ltr"
        },
        {
          name: "rtl"
        },
        {
          name: "auto"
        }
      ]
    },
    {
      name: "m",
      values: [
        {
          name: "get",
          description: {
            kind: "markdown",
            value: "Corresponds to the HTTP [GET method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.3); form data are appended to the `action` attribute URI with a '?' as separator, and the resulting URI is sent to the server. Use this method when the form has no side-effects and contains only ASCII characters."
          }
        },
        {
          name: "post",
          description: {
            kind: "markdown",
            value: "Corresponds to the HTTP [POST method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.5); form data are included in the body of the form and sent to the server."
          }
        },
        {
          name: "dialog",
          description: {
            kind: "markdown",
            value: "Use when the form is inside a [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) element to close the dialog when submitted."
          }
        }
      ]
    },
    {
      name: "fm",
      values: [
        {
          name: "get"
        },
        {
          name: "post"
        }
      ]
    },
    {
      name: "s",
      values: [
        {
          name: "row"
        },
        {
          name: "col"
        },
        {
          name: "rowgroup"
        },
        {
          name: "colgroup"
        }
      ]
    },
    {
      name: "t",
      values: [
        {
          name: "hidden"
        },
        {
          name: "text"
        },
        {
          name: "search"
        },
        {
          name: "tel"
        },
        {
          name: "url"
        },
        {
          name: "email"
        },
        {
          name: "password"
        },
        {
          name: "datetime"
        },
        {
          name: "date"
        },
        {
          name: "month"
        },
        {
          name: "week"
        },
        {
          name: "time"
        },
        {
          name: "datetime-local"
        },
        {
          name: "number"
        },
        {
          name: "range"
        },
        {
          name: "color"
        },
        {
          name: "checkbox"
        },
        {
          name: "radio"
        },
        {
          name: "file"
        },
        {
          name: "submit"
        },
        {
          name: "image"
        },
        {
          name: "reset"
        },
        {
          name: "button"
        }
      ]
    },
    {
      name: "im",
      values: [
        {
          name: "verbatim"
        },
        {
          name: "latin"
        },
        {
          name: "latin-name"
        },
        {
          name: "latin-prose"
        },
        {
          name: "full-width-latin"
        },
        {
          name: "kana"
        },
        {
          name: "kana-name"
        },
        {
          name: "katakana"
        },
        {
          name: "numeric"
        },
        {
          name: "tel"
        },
        {
          name: "email"
        },
        {
          name: "url"
        }
      ]
    },
    {
      name: "bt",
      values: [
        {
          name: "button"
        },
        {
          name: "submit"
        },
        {
          name: "reset"
        },
        {
          name: "menu"
        }
      ]
    },
    {
      name: "lt",
      values: [
        {
          name: "1"
        },
        {
          name: "a"
        },
        {
          name: "A"
        },
        {
          name: "i"
        },
        {
          name: "I"
        }
      ]
    },
    {
      name: "mt",
      values: [
        {
          name: "context"
        },
        {
          name: "toolbar"
        }
      ]
    },
    {
      name: "mit",
      values: [
        {
          name: "command"
        },
        {
          name: "checkbox"
        },
        {
          name: "radio"
        }
      ]
    },
    {
      name: "et",
      values: [
        {
          name: "application/x-www-form-urlencoded"
        },
        {
          name: "multipart/form-data"
        },
        {
          name: "text/plain"
        }
      ]
    },
    {
      name: "tk",
      values: [
        {
          name: "subtitles"
        },
        {
          name: "captions"
        },
        {
          name: "descriptions"
        },
        {
          name: "chapters"
        },
        {
          name: "metadata"
        }
      ]
    },
    {
      name: "pl",
      values: [
        {
          name: "none"
        },
        {
          name: "metadata"
        },
        {
          name: "auto"
        }
      ]
    },
    {
      name: "sh",
      values: [
        {
          name: "circle"
        },
        {
          name: "default"
        },
        {
          name: "poly"
        },
        {
          name: "rect"
        }
      ]
    },
    {
      name: "xo",
      values: [
        {
          name: "anonymous"
        },
        {
          name: "use-credentials"
        }
      ]
    },
    {
      name: "sb",
      values: [
        {
          name: "allow-forms"
        },
        {
          name: "allow-modals"
        },
        {
          name: "allow-pointer-lock"
        },
        {
          name: "allow-popups"
        },
        {
          name: "allow-popups-to-escape-sandbox"
        },
        {
          name: "allow-same-origin"
        },
        {
          name: "allow-scripts"
        },
        {
          name: "allow-top-navigation"
        }
      ]
    },
    {
      name: "tristate",
      values: [
        {
          name: "true"
        },
        {
          name: "false"
        },
        {
          name: "mixed"
        },
        {
          name: "undefined"
        }
      ]
    },
    {
      name: "inputautocomplete",
      values: [
        {
          name: "additional-name"
        },
        {
          name: "address-level1"
        },
        {
          name: "address-level2"
        },
        {
          name: "address-level3"
        },
        {
          name: "address-level4"
        },
        {
          name: "address-line1"
        },
        {
          name: "address-line2"
        },
        {
          name: "address-line3"
        },
        {
          name: "bday"
        },
        {
          name: "bday-year"
        },
        {
          name: "bday-day"
        },
        {
          name: "bday-month"
        },
        {
          name: "billing"
        },
        {
          name: "cc-additional-name"
        },
        {
          name: "cc-csc"
        },
        {
          name: "cc-exp"
        },
        {
          name: "cc-exp-month"
        },
        {
          name: "cc-exp-year"
        },
        {
          name: "cc-family-name"
        },
        {
          name: "cc-given-name"
        },
        {
          name: "cc-name"
        },
        {
          name: "cc-number"
        },
        {
          name: "cc-type"
        },
        {
          name: "country"
        },
        {
          name: "country-name"
        },
        {
          name: "current-password"
        },
        {
          name: "email"
        },
        {
          name: "family-name"
        },
        {
          name: "fax"
        },
        {
          name: "given-name"
        },
        {
          name: "home"
        },
        {
          name: "honorific-prefix"
        },
        {
          name: "honorific-suffix"
        },
        {
          name: "impp"
        },
        {
          name: "language"
        },
        {
          name: "mobile"
        },
        {
          name: "name"
        },
        {
          name: "new-password"
        },
        {
          name: "nickname"
        },
        {
          name: "organization"
        },
        {
          name: "organization-title"
        },
        {
          name: "pager"
        },
        {
          name: "photo"
        },
        {
          name: "postal-code"
        },
        {
          name: "sex"
        },
        {
          name: "shipping"
        },
        {
          name: "street-address"
        },
        {
          name: "tel-area-code"
        },
        {
          name: "tel"
        },
        {
          name: "tel-country-code"
        },
        {
          name: "tel-extension"
        },
        {
          name: "tel-local"
        },
        {
          name: "tel-local-prefix"
        },
        {
          name: "tel-local-suffix"
        },
        {
          name: "tel-national"
        },
        {
          name: "transaction-amount"
        },
        {
          name: "transaction-currency"
        },
        {
          name: "url"
        },
        {
          name: "username"
        },
        {
          name: "work"
        }
      ]
    },
    {
      name: "autocomplete",
      values: [
        {
          name: "inline"
        },
        {
          name: "list"
        },
        {
          name: "both"
        },
        {
          name: "none"
        }
      ]
    },
    {
      name: "current",
      values: [
        {
          name: "page"
        },
        {
          name: "step"
        },
        {
          name: "location"
        },
        {
          name: "date"
        },
        {
          name: "time"
        },
        {
          name: "true"
        },
        {
          name: "false"
        }
      ]
    },
    {
      name: "dropeffect",
      values: [
        {
          name: "copy"
        },
        {
          name: "move"
        },
        {
          name: "link"
        },
        {
          name: "execute"
        },
        {
          name: "popup"
        },
        {
          name: "none"
        }
      ]
    },
    {
      name: "invalid",
      values: [
        {
          name: "grammar"
        },
        {
          name: "false"
        },
        {
          name: "spelling"
        },
        {
          name: "true"
        }
      ]
    },
    {
      name: "live",
      values: [
        {
          name: "off"
        },
        {
          name: "polite"
        },
        {
          name: "assertive"
        }
      ]
    },
    {
      name: "orientation",
      values: [
        {
          name: "vertical"
        },
        {
          name: "horizontal"
        },
        {
          name: "undefined"
        }
      ]
    },
    {
      name: "relevant",
      values: [
        {
          name: "additions"
        },
        {
          name: "removals"
        },
        {
          name: "text"
        },
        {
          name: "all"
        },
        {
          name: "additions text"
        }
      ]
    },
    {
      name: "sort",
      values: [
        {
          name: "ascending"
        },
        {
          name: "descending"
        },
        {
          name: "none"
        },
        {
          name: "other"
        }
      ]
    },
    {
      name: "roles",
      values: [
        {
          name: "alert"
        },
        {
          name: "alertdialog"
        },
        {
          name: "button"
        },
        {
          name: "checkbox"
        },
        {
          name: "dialog"
        },
        {
          name: "gridcell"
        },
        {
          name: "link"
        },
        {
          name: "log"
        },
        {
          name: "marquee"
        },
        {
          name: "menuitem"
        },
        {
          name: "menuitemcheckbox"
        },
        {
          name: "menuitemradio"
        },
        {
          name: "option"
        },
        {
          name: "progressbar"
        },
        {
          name: "radio"
        },
        {
          name: "scrollbar"
        },
        {
          name: "searchbox"
        },
        {
          name: "slider"
        },
        {
          name: "spinbutton"
        },
        {
          name: "status"
        },
        {
          name: "switch"
        },
        {
          name: "tab"
        },
        {
          name: "tabpanel"
        },
        {
          name: "textbox"
        },
        {
          name: "timer"
        },
        {
          name: "tooltip"
        },
        {
          name: "treeitem"
        },
        {
          name: "combobox"
        },
        {
          name: "grid"
        },
        {
          name: "listbox"
        },
        {
          name: "menu"
        },
        {
          name: "menubar"
        },
        {
          name: "radiogroup"
        },
        {
          name: "tablist"
        },
        {
          name: "tree"
        },
        {
          name: "treegrid"
        },
        {
          name: "application"
        },
        {
          name: "article"
        },
        {
          name: "cell"
        },
        {
          name: "columnheader"
        },
        {
          name: "definition"
        },
        {
          name: "directory"
        },
        {
          name: "document"
        },
        {
          name: "feed"
        },
        {
          name: "figure"
        },
        {
          name: "group"
        },
        {
          name: "heading"
        },
        {
          name: "img"
        },
        {
          name: "list"
        },
        {
          name: "listitem"
        },
        {
          name: "math"
        },
        {
          name: "none"
        },
        {
          name: "note"
        },
        {
          name: "presentation"
        },
        {
          name: "region"
        },
        {
          name: "row"
        },
        {
          name: "rowgroup"
        },
        {
          name: "rowheader"
        },
        {
          name: "separator"
        },
        {
          name: "table"
        },
        {
          name: "term"
        },
        {
          name: "text"
        },
        {
          name: "toolbar"
        },
        {
          name: "banner"
        },
        {
          name: "complementary"
        },
        {
          name: "contentinfo"
        },
        {
          name: "form"
        },
        {
          name: "main"
        },
        {
          name: "navigation"
        },
        {
          name: "region"
        },
        {
          name: "search"
        },
        {
          name: "doc-abstract"
        },
        {
          name: "doc-acknowledgments"
        },
        {
          name: "doc-afterword"
        },
        {
          name: "doc-appendix"
        },
        {
          name: "doc-backlink"
        },
        {
          name: "doc-biblioentry"
        },
        {
          name: "doc-bibliography"
        },
        {
          name: "doc-biblioref"
        },
        {
          name: "doc-chapter"
        },
        {
          name: "doc-colophon"
        },
        {
          name: "doc-conclusion"
        },
        {
          name: "doc-cover"
        },
        {
          name: "doc-credit"
        },
        {
          name: "doc-credits"
        },
        {
          name: "doc-dedication"
        },
        {
          name: "doc-endnote"
        },
        {
          name: "doc-endnotes"
        },
        {
          name: "doc-epigraph"
        },
        {
          name: "doc-epilogue"
        },
        {
          name: "doc-errata"
        },
        {
          name: "doc-example"
        },
        {
          name: "doc-footnote"
        },
        {
          name: "doc-foreword"
        },
        {
          name: "doc-glossary"
        },
        {
          name: "doc-glossref"
        },
        {
          name: "doc-index"
        },
        {
          name: "doc-introduction"
        },
        {
          name: "doc-noteref"
        },
        {
          name: "doc-notice"
        },
        {
          name: "doc-pagebreak"
        },
        {
          name: "doc-pagelist"
        },
        {
          name: "doc-part"
        },
        {
          name: "doc-preface"
        },
        {
          name: "doc-prologue"
        },
        {
          name: "doc-pullquote"
        },
        {
          name: "doc-qna"
        },
        {
          name: "doc-subtitle"
        },
        {
          name: "doc-tip"
        },
        {
          name: "doc-toc"
        }
      ]
    },
    {
      name: "metanames",
      values: [
        {
          name: "application-name"
        },
        {
          name: "author"
        },
        {
          name: "description"
        },
        {
          name: "format-detection"
        },
        {
          name: "generator"
        },
        {
          name: "keywords"
        },
        {
          name: "publisher"
        },
        {
          name: "referrer"
        },
        {
          name: "robots"
        },
        {
          name: "theme-color"
        },
        {
          name: "viewport"
        }
      ]
    },
    {
      name: "haspopup",
      values: [
        {
          name: "false",
          description: {
            kind: "markdown",
            value: "(default) Indicates the element does not have a popup."
          }
        },
        {
          name: "true",
          description: {
            kind: "markdown",
            value: "Indicates the popup is a menu."
          }
        },
        {
          name: "menu",
          description: {
            kind: "markdown",
            value: "Indicates the popup is a menu."
          }
        },
        {
          name: "listbox",
          description: {
            kind: "markdown",
            value: "Indicates the popup is a listbox."
          }
        },
        {
          name: "tree",
          description: {
            kind: "markdown",
            value: "Indicates the popup is a tree."
          }
        },
        {
          name: "grid",
          description: {
            kind: "markdown",
            value: "Indicates the popup is a grid."
          }
        },
        {
          name: "dialog",
          description: {
            kind: "markdown",
            value: "Indicates the popup is a dialog."
          }
        }
      ]
    }
  ]
}, Wu = function() {
  function e(t) {
    this.dataProviders = [], this.setDataProviders(t.useDefaultDataProvider !== !1, t.customDataProviders || []);
  }
  return e.prototype.setDataProviders = function(t, n) {
    var i;
    this.dataProviders = [], t && this.dataProviders.push(new Za("html5", Hu)), (i = this.dataProviders).push.apply(i, n);
  }, e.prototype.getDataProviders = function() {
    return this.dataProviders;
  }, e;
}(), Fu = {};
function Bu(e) {
  e === void 0 && (e = Fu);
  var t = new Wu(e), n = new hu(e, t), i = new su(e, t);
  return {
    setDataProviders: t.setDataProviders.bind(t),
    createScanner: ye,
    parseHTMLDocument: function(r) {
      return Ya(r.getText());
    },
    doComplete: i.doComplete.bind(i),
    doComplete2: i.doComplete2.bind(i),
    setCompletionParticipants: i.setCompletionParticipants.bind(i),
    doHover: n.doHover.bind(n),
    format: gu,
    findDocumentHighlights: Su,
    findDocumentLinks: Au,
    findDocumentSymbols: Lu,
    getFoldingRanges: Nu,
    getSelectionRanges: Iu,
    doQuoteComplete: i.doQuoteComplete.bind(i),
    doTagComplete: i.doTagComplete.bind(i),
    doRename: Eu,
    findMatchingTagPosition: Ru,
    findOnTypeRenameRanges: Ca,
    findLinkedEditingRanges: Ca
  };
}
function Pu(e, t) {
  return new Za(e, t);
}
var qu = class {
  constructor(e, t) {
    wt(this, "_ctx");
    wt(this, "_languageService");
    wt(this, "_languageSettings");
    wt(this, "_languageId");
    this._ctx = e, this._languageSettings = t.languageSettings, this._languageId = t.languageId;
    const n = this._languageSettings.data, i = n == null ? void 0 : n.useDefaultDataProvider, r = [];
    if (n != null && n.dataProviders)
      for (const a in n.dataProviders)
        r.push(Pu(a, n.dataProviders[a]));
    this._languageService = Bu({
      useDefaultDataProvider: i,
      customDataProviders: r
    });
  }
  async doComplete(e, t) {
    let n = this._getTextDocument(e);
    if (!n)
      return null;
    let i = this._languageService.parseHTMLDocument(n);
    return Promise.resolve(this._languageService.doComplete(n, t, i, this._languageSettings && this._languageSettings.suggest));
  }
  async format(e, t, n) {
    let i = this._getTextDocument(e);
    if (!i)
      return [];
    let r = { ...this._languageSettings.format, ...n }, a = this._languageService.format(i, t, r);
    return Promise.resolve(a);
  }
  async doHover(e, t) {
    let n = this._getTextDocument(e);
    if (!n)
      return null;
    let i = this._languageService.parseHTMLDocument(n), r = this._languageService.doHover(n, t, i);
    return Promise.resolve(r);
  }
  async findDocumentHighlights(e, t) {
    let n = this._getTextDocument(e);
    if (!n)
      return [];
    let i = this._languageService.parseHTMLDocument(n), r = this._languageService.findDocumentHighlights(n, t, i);
    return Promise.resolve(r);
  }
  async findDocumentLinks(e) {
    let t = this._getTextDocument(e);
    if (!t)
      return [];
    let n = this._languageService.findDocumentLinks(t, null);
    return Promise.resolve(n);
  }
  async findDocumentSymbols(e) {
    let t = this._getTextDocument(e);
    if (!t)
      return [];
    let n = this._languageService.parseHTMLDocument(t), i = this._languageService.findDocumentSymbols(t, n);
    return Promise.resolve(i);
  }
  async getFoldingRanges(e, t) {
    let n = this._getTextDocument(e);
    if (!n)
      return [];
    let i = this._languageService.getFoldingRanges(n, t);
    return Promise.resolve(i);
  }
  async getSelectionRanges(e, t) {
    let n = this._getTextDocument(e);
    if (!n)
      return [];
    let i = this._languageService.getSelectionRanges(n, t);
    return Promise.resolve(i);
  }
  async doRename(e, t, n) {
    let i = this._getTextDocument(e);
    if (!i)
      return null;
    let r = this._languageService.parseHTMLDocument(i), a = this._languageService.doRename(i, t, n, r);
    return Promise.resolve(a);
  }
  _getTextDocument(e) {
    let t = this._ctx.getMirrorModels();
    for (let n of t)
      if (n.uri.toString() === e)
        return ii.create(e, this._languageId, n.version, n.getValue());
    return null;
  }
};
self.onmessage = () => {
  Ja((e, t) => new qu(e, t));
};
