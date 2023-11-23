var manifest = {
	"/*404": {
	type: "route",
	script: {
		type: "script",
		href: "/assets/_...404_-b1c7cabd.js"
	},
	assets: [
		{
			type: "island",
			href: "node_modules/solid-start/islands/A.tsx?island"
		},
		{
			type: "island",
			href: "node_modules/solid-start/islands/A.tsx?island"
		},
		{
			type: "style",
			href: "/assets/entry-client-3ccd35e0.css"
		}
	]
},
	"/about": {
	type: "route",
	script: {
		type: "script",
		href: "/assets/about-d4717a8c.js"
	},
	assets: [
		{
			type: "island",
			href: "node_modules/solid-start/islands/A.tsx?island"
		},
		{
			type: "island",
			href: "node_modules/solid-start/islands/A.tsx?island"
		},
		{
			type: "style",
			href: "/assets/entry-client-3ccd35e0.css"
		},
		{
			type: "island",
			href: "src/components/Counter.tsx?island"
		},
		{
			type: "island",
			href: "src/components/Counter.tsx?island"
		}
	]
},
	"/": {
	type: "route",
	script: {
		type: "script",
		href: "/assets/index-f83f05ae.js"
	},
	assets: [
		{
			type: "island",
			href: "node_modules/solid-start/islands/A.tsx?island"
		},
		{
			type: "island",
			href: "node_modules/solid-start/islands/A.tsx?island"
		},
		{
			type: "style",
			href: "/assets/entry-client-3ccd35e0.css"
		},
		{
			type: "island",
			href: "src/components/Counter.tsx?island"
		},
		{
			type: "island",
			href: "src/components/Counter.tsx?island"
		}
	]
},
	"node_modules/solid-start/islands/A.tsx?island": {
	type: "island",
	script: {
		type: "script",
		href: "/assets/A-84001d76.js"
	},
	assets: [
		{
			type: "script",
			href: "/assets/A-84001d76.js"
		},
		{
			type: "script",
			href: "/assets/web-21959e62.js"
		}
	]
},
	"src/components/Counter.tsx?island": {
	type: "island",
	script: {
		type: "script",
		href: "/assets/Counter-2ca46299.js"
	},
	assets: [
		{
			type: "script",
			href: "/assets/Counter-2ca46299.js"
		},
		{
			type: "script",
			href: "/assets/web-21959e62.js"
		}
	]
},
	"entry-client": {
	type: "entry",
	script: {
		type: "script",
		href: "/assets/entry-client-3d3dcdc8.js"
	},
	assets: [
		{
			type: "script",
			href: "/assets/entry-client-3d3dcdc8.js"
		},
		{
			type: "script",
			href: "/assets/web-21959e62.js"
		},
		{
			type: "style",
			href: "/assets/entry-client-3ccd35e0.css"
		}
	]
}
};

const $PROXY = Symbol("solid-proxy");
const ERROR = Symbol("error");
function castError(err) {
  if (err instanceof Error) return err;
  return new Error(typeof err === "string" ? err : "Unknown error", {
    cause: err
  });
}
function handleError(err, owner = Owner) {
  const fns = owner && owner.context && owner.context[ERROR];
  const error = castError(err);
  if (!fns) throw error;
  try {
    for (const f of fns) f(error);
  } catch (e) {
    handleError(e, (owner && owner.owner) || null);
  }
}
const UNOWNED = {
  context: null,
  owner: null,
  owned: null,
  cleanups: null
};
let Owner = null;
function createOwner() {
  const o = {
    owner: Owner,
    context: Owner ? Owner.context : null,
    owned: null,
    cleanups: null
  };
  if (Owner) {
    if (!Owner.owned) Owner.owned = [o];
    else Owner.owned.push(o);
  }
  return o;
}
function createRoot(fn, detachedOwner) {
  const owner = Owner,
    current = detachedOwner === undefined ? owner : detachedOwner,
    root =
      fn.length === 0
        ? UNOWNED
        : {
            context: current ? current.context : null,
            owner: current,
            owned: null,
            cleanups: null
          };
  Owner = root;
  let result;
  try {
    result = fn(fn.length === 0 ? () => {} : () => cleanNode(root));
  } catch (err) {
    handleError(err);
  } finally {
    Owner = owner;
  }
  return result;
}
function createSignal(value, options) {
  return [
    () => value,
    v => {
      return (value = typeof v === "function" ? v(value) : v);
    }
  ];
}
function createComputed(fn, value) {
  Owner = createOwner();
  try {
    fn(value);
  } catch (err) {
    handleError(err);
  } finally {
    Owner = Owner.owner;
  }
}
const createRenderEffect = createComputed;
function createMemo(fn, value) {
  Owner = createOwner();
  let v;
  try {
    v = fn(value);
  } catch (err) {
    handleError(err);
  } finally {
    Owner = Owner.owner;
  }
  return () => v;
}
function batch(fn) {
  return fn();
}
const untrack = batch;
function on(deps, fn, options = {}) {
  const isArray = Array.isArray(deps);
  const defer = options.defer;
  return () => {
    if (defer) return undefined;
    let value;
    if (isArray) {
      value = [];
      for (let i = 0; i < deps.length; i++) value.push(deps[i]());
    } else value = deps();
    return fn(value);
  };
}
function onCleanup(fn) {
  if (Owner) {
    if (!Owner.cleanups) Owner.cleanups = [fn];
    else Owner.cleanups.push(fn);
  }
  return fn;
}
function cleanNode(node) {
  if (node.owned) {
    for (let i = 0; i < node.owned.length; i++) cleanNode(node.owned[i]);
    node.owned = null;
  }
  if (node.cleanups) {
    for (let i = 0; i < node.cleanups.length; i++) node.cleanups[i]();
    node.cleanups = null;
  }
}
function catchError(fn, handler) {
  const owner = createOwner();
  owner.context = {
    ...owner.context,
    [ERROR]: [handler]
  };
  Owner = owner;
  try {
    return fn();
  } catch (err) {
    handleError(err);
  } finally {
    Owner = Owner.owner;
  }
}
function createContext(defaultValue) {
  const id = Symbol("context");
  return {
    id,
    Provider: createProvider(id),
    defaultValue
  };
}
function useContext(context) {
  return Owner && Owner.context && Owner.context[context.id] !== undefined
    ? Owner.context[context.id]
    : context.defaultValue;
}
function getOwner() {
  return Owner;
}
function children(fn) {
  const memo = createMemo(() => resolveChildren(fn()));
  memo.toArray = () => {
    const c = memo();
    return Array.isArray(c) ? c : c != null ? [c] : [];
  };
  return memo;
}
function runWithOwner(o, fn) {
  const prev = Owner;
  Owner = o;
  try {
    return fn();
  } catch (err) {
    handleError(err);
  } finally {
    Owner = prev;
  }
}
function resolveChildren(children) {
  if (typeof children === "function" && !children.length) return resolveChildren(children());
  if (Array.isArray(children)) {
    const results = [];
    for (let i = 0; i < children.length; i++) {
      const result = resolveChildren(children[i]);
      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results;
  }
  return children;
}
function createProvider(id) {
  return function provider(props) {
    return createMemo(() => {
      Owner.context = {
        ...Owner.context,
        [id]: props.value
      };
      return children(() => props.children);
    });
  };
}

function resolveSSRNode$1(node) {
  const t = typeof node;
  if (t === "string") return node;
  if (node == null || t === "boolean") return "";
  if (Array.isArray(node)) {
    let mapped = "";
    for (let i = 0, len = node.length; i < len; i++) mapped += resolveSSRNode$1(node[i]);
    return mapped;
  }
  if (t === "object") return node.t;
  if (t === "function") return resolveSSRNode$1(node());
  return String(node);
}
const sharedConfig = {};
function setHydrateContext(context) {
  sharedConfig.context = context;
}
function nextHydrateContext() {
  return sharedConfig.context
    ? {
        ...sharedConfig.context,
        id: `${sharedConfig.context.id}${sharedConfig.context.count++}-`,
        count: 0
      }
    : undefined;
}
function createUniqueId() {
  const ctx = sharedConfig.context;
  if (!ctx) throw new Error(`createUniqueId cannot be used under non-hydrating context`);
  return `${ctx.id}${ctx.count++}`;
}
function createComponent(Comp, props) {
  if (sharedConfig.context && !sharedConfig.context.noHydrate) {
    const c = sharedConfig.context;
    setHydrateContext(nextHydrateContext());
    const r = Comp(props || {});
    setHydrateContext(c);
    return r;
  }
  return Comp(props || {});
}
function mergeProps(...sources) {
  const target = {};
  for (let i = 0; i < sources.length; i++) {
    let source = sources[i];
    if (typeof source === "function") source = source();
    if (source) {
      const descriptors = Object.getOwnPropertyDescriptors(source);
      for (const key in descriptors) {
        if (key in target) continue;
        Object.defineProperty(target, key, {
          enumerable: true,
          get() {
            for (let i = sources.length - 1; i >= 0; i--) {
              let v,
                s = sources[i];
              if (typeof s === "function") s = s();
              v = (s || {})[key];
              if (v !== undefined) return v;
            }
          }
        });
      }
    }
  }
  return target;
}
function splitProps$1(props, ...keys) {
  const descriptors = Object.getOwnPropertyDescriptors(props),
    split = k => {
      const clone = {};
      for (let i = 0; i < k.length; i++) {
        const key = k[i];
        if (descriptors[key]) {
          Object.defineProperty(clone, key, descriptors[key]);
          delete descriptors[key];
        }
      }
      return clone;
    };
  return keys.map(split).concat(split(Object.keys(descriptors)));
}
function Show(props) {
  let c;
  return props.when
    ? typeof (c = props.children) === "function"
      ? c(props.keyed ? props.when : () => props.when)
      : c
    : props.fallback || "";
}
function ErrorBoundary$1(props) {
  let error,
    res,
    clean,
    sync = true;
  const ctx = sharedConfig.context;
  const id = ctx.id + ctx.count;
  function displayFallback() {
    cleanNode(clean);
    ctx.serialize(id, error);
    setHydrateContext({
      ...ctx,
      count: 0
    });
    const f = props.fallback;
    return typeof f === "function" && f.length ? f(error, () => {}) : f;
  }
  createMemo(() => {
    clean = Owner;
    return catchError(
      () => (res = props.children),
      err => {
        error = err;
        !sync && ctx.replace("e" + id, displayFallback);
        sync = true;
      }
    );
  });
  if (error) return displayFallback();
  sync = false;
  return {
    t: `<!--!$e${id}-->${resolveSSRNode$1(res)}<!--!$/e${id}-->`
  };
}
const SuspenseContext = createContext();
function suspenseComplete(c) {
  for (const r of c.resources.values()) {
    if (r.loading) return false;
  }
  return true;
}
function startTransition(fn) {
  fn();
}
function Suspense(props) {
  let done;
  const ctx = sharedConfig.context;
  const id = ctx.id + ctx.count;
  const o = createOwner();
  const value =
    ctx.suspense[id] ||
    (ctx.suspense[id] = {
      resources: new Map(),
      completed: () => {
        const res = runSuspense();
        if (suspenseComplete(value)) {
          done(resolveSSRNode$1(res));
        }
      }
    });
  function suspenseError(err) {
    if (!done || !done(undefined, err)) {
      runWithOwner(o.owner, () => {
        throw err;
      });
    }
  }
  function runSuspense() {
    setHydrateContext({
      ...ctx,
      count: 0
    });
    cleanNode(o);
    return runWithOwner(o, () =>
      createComponent(SuspenseContext.Provider, {
        value,
        get children() {
          return catchError(() => props.children, suspenseError);
        }
      })
    );
  }
  const res = runSuspense();
  if (suspenseComplete(value)) {
    delete ctx.suspense[id];
    return res;
  }
  done = ctx.async ? ctx.registerFragment(id) : undefined;
  return catchError(() => {
    if (ctx.async) {
      setHydrateContext({
        ...ctx,
        count: 0,
        id: ctx.id + "0-f",
        noHydrate: true
      });
      const res = {
        t: `<template id="pl-${id}"></template>${resolveSSRNode$1(props.fallback)}<!--pl-${id}-->`
      };
      setHydrateContext(ctx);
      return res;
    }
    setHydrateContext({
      ...ctx,
      count: 0,
      id: ctx.id + "0-f"
    });
    ctx.serialize(id, "$$f");
    return props.fallback;
  }, suspenseError);
}

var{toString:mr}=Object.prototype,m=class extends Error{constructor(r){super('Unsupported type "'+mr.call(r)+'"');this.value=r;}};function f(n,e){if(!n)throw e}var Ve={0:"Symbol.asyncIterator",1:"Symbol.hasInstance",2:"Symbol.isConcatSpreadable",3:"Symbol.iterator",4:"Symbol.match",5:"Symbol.matchAll",6:"Symbol.replace",7:"Symbol.search",8:"Symbol.species",9:"Symbol.split",10:"Symbol.toPrimitive",11:"Symbol.toStringTag",12:"Symbol.unscopables"},T={[Symbol.asyncIterator]:0,[Symbol.hasInstance]:1,[Symbol.isConcatSpreadable]:2,[Symbol.iterator]:3,[Symbol.match]:4,[Symbol.matchAll]:5,[Symbol.replace]:6,[Symbol.search]:7,[Symbol.species]:8,[Symbol.split]:9,[Symbol.toPrimitive]:10,[Symbol.toStringTag]:11,[Symbol.unscopables]:12},Ue={2:"!0",3:"!1",1:"void 0",0:"null",4:"-0",5:"1/0",6:"-1/0",7:"0/0"};var ne={0:"Error",1:"EvalError",2:"RangeError",3:"ReferenceError",4:"SyntaxError",5:"TypeError",6:"URIError"};function g(n){return {t:2,i:void 0,s:n,l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:void 0,f:void 0,b:void 0,o:void 0}}var y=g(2),v=g(3),se=g(1),x=g(0),_e=g(4),qe=g(5),We=g(6),Ke=g(7);function Sr(n){switch(n){case'"':return '\\"';case"\\":return "\\\\";case`
`:return "\\n";case"\r":return "\\r";case"\b":return "\\b";case"	":return "\\t";case"\f":return "\\f";case"<":return "\\x3C";case"\u2028":return "\\u2028";case"\u2029":return "\\u2029";default:return}}function d(n){let e="",r=0,t;for(let s=0,a=n.length;s<a;s++)t=Sr(n[s]),t&&(e+=n.slice(r,s)+t,r=s+1);return r===0?e=n:e+=n.slice(r),e}var I="__SEROVAL_REFS__",B="$R",ae=`self.${B}`;function hr(n){return n==null?`${ae}=${ae}||[];`:`(${ae}=${ae}||{})["${d(n)}"]=[];`}var Ce=new Map,A$1=new Map;function w(n){return Ce.has(n)}function He(n){return f(w(n),new Error("Missing reference id")),Ce.get(n)}typeof globalThis!==void 0?Object.defineProperty(globalThis,I,{value:A$1,configurable:!0,writable:!1,enumerable:!1}):typeof window!==void 0?Object.defineProperty(window,I,{value:A$1,configurable:!0,writable:!1,enumerable:!1}):typeof self!==void 0?Object.defineProperty(self,I,{value:A$1,configurable:!0,writable:!1,enumerable:!1}):typeof global!==void 0&&Object.defineProperty(global,I,{value:A$1,configurable:!0,writable:!1,enumerable:!1});var b=(u=>(u[u.AggregateError=1]="AggregateError",u[u.ArrowFunction=4]="ArrowFunction",u[u.BigInt=8]="BigInt",u[u.ErrorPrototypeStack=16]="ErrorPrototypeStack",u[u.Map=32]="Map",u[u.ObjectAssign=128]="ObjectAssign",u[u.Promise=256]="Promise",u[u.Set=512]="Set",u[u.Symbol=1024]="Symbol",u[u.TypedArray=2048]="TypedArray",u[u.BigIntTypedArray=4096]="BigIntTypedArray",u[u.WebAPI=8192]="WebAPI",u))(b||{});function ie(n){return n instanceof EvalError?1:n instanceof RangeError?2:n instanceof ReferenceError?3:n instanceof SyntaxError?4:n instanceof TypeError?5:n instanceof URIError?6:0}function V(n,e){let r,t=ne[ie(n)];n.name!==t?r={name:n.name}:n.constructor.name!==t&&(r={name:n.constructor.name});let s=Object.getOwnPropertyNames(n);for(let a=0,i=s.length,o;a<i;a++)o=s[a],o!=="name"&&o!=="message"&&(o==="stack"?e&16&&(r=r||{},r[o]=n[o]):(r=r||{},r[o]=n[o]));return r}function oe(n){return Object.isFrozen(n)?3:Object.isSealed(n)?2:Object.isExtensible(n)?0:1}function de(n){switch(n){case 1/0:return qe;case-1/0:return We;default:return n!==n?Ke:Object.is(n,-0)?_e:{t:0,i:void 0,s:n,l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:void 0,f:void 0,b:void 0,o:void 0}}}function N(n){return {t:1,i:void 0,s:d(n),l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:void 0,f:void 0,b:void 0,o:void 0}}function le(n){return {t:3,i:void 0,s:""+n,l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:void 0,f:void 0,b:void 0,o:void 0}}function P(n){return {t:4,i:n,s:void 0,l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:void 0,f:void 0,b:void 0,o:void 0}}function j(n,e){return {t:5,i:n,s:e.toISOString(),l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,f:void 0,a:void 0,b:void 0,o:void 0}}function U(n,e){return {t:6,i:n,s:void 0,l:void 0,c:e.source,m:e.flags,p:void 0,e:void 0,a:void 0,f:void 0,b:void 0,o:void 0}}function M(n,e){let r=new Uint8Array(e),t=r.length,s=new Array(t);for(let a=0;a<t;a++)s[a]=r[a];return {t:21,i:n,s,l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:void 0,f:void 0,b:void 0,o:void 0}}function ue(n,e){return f(e in T,new Error("Only well-known symbols are supported.")),{t:17,i:n,s:T[e],l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:void 0,f:void 0,b:void 0,o:void 0}}function ce(n,e){return {t:20,i:n,s:d(He(e)),l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:void 0,f:void 0,b:void 0,o:void 0}}function L(n,e,r){return {t:40,i:n,s:r,l:void 0,c:d(e),m:void 0,p:void 0,e:void 0,a:void 0,f:void 0,b:void 0,o:void 0}}function fe(n,e,r){return {t:9,i:n,s:void 0,l:e.length,c:void 0,m:void 0,p:void 0,e:void 0,a:r,f:void 0,b:void 0,o:oe(e)}}function pe(n,e){return {t:27,i:n,s:void 0,l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:void 0,f:e,b:void 0,o:void 0}}function me(n,e,r){return {t:15,i:n,s:void 0,l:e.length,c:e.constructor.name,m:void 0,p:void 0,e:void 0,a:void 0,f:r,b:e.byteOffset,o:void 0}}function Se(n,e,r){return {t:16,i:n,s:void 0,l:e.length,c:e.constructor.name,m:void 0,p:void 0,e:void 0,a:void 0,f:r,b:e.byteOffset,o:void 0}}function he(n,e,r){return {t:22,i:n,s:void 0,l:e.byteLength,c:void 0,m:void 0,p:void 0,e:void 0,a:void 0,f:r,b:e.byteOffset,o:void 0}}function ge(n,e,r){return {t:13,i:n,s:ie(e),l:void 0,c:void 0,m:d(e.message),p:r,e:void 0,a:void 0,f:void 0,b:void 0,o:void 0}}function ye(n,e,r){return {t:14,i:n,s:ie(e),l:void 0,c:void 0,m:d(e.message),p:r,e:void 0,a:void 0,f:void 0,b:void 0,o:void 0}}function ve(n,e,r){return {t:7,i:n,s:void 0,l:e,c:void 0,m:void 0,p:void 0,e:void 0,a:r,f:void 0,b:void 0,o:void 0}}function _(n,e){return {t:43,i:void 0,s:void 0,l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:[n,e],f:void 0,b:void 0,o:void 0}}function be(n,e){return {t:45,i:void 0,s:void 0,l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:[n,e],f:void 0,b:void 0,o:void 0}}function Ne(n,e){return {body:e,cache:n.cache,credentials:n.credentials,headers:n.headers,integrity:n.integrity,keepalive:n.keepalive,method:n.method,mode:n.mode,redirect:n.redirect,referrer:n.referrer,referrerPolicy:n.referrerPolicy}}function Re(n){return {headers:n.headers,status:n.status,statusText:n.statusText}}function Ee(n){return {bubbles:n.bubbles,cancelable:n.cancelable,composed:n.composed}}function xe(n){return {detail:n.detail,bubbles:n.bubbles,cancelable:n.cancelable,composed:n.composed}}function q(n){let e=[],r=-1,t=-1,s=n[Symbol.iterator]();for(;;)try{let a=s.next();if(e.push(a.value),a.done){t=e.length-1;break}}catch(a){r=e.length,e.push(a);}return {v:e,t:r,d:t}}function Xe(n,e){return new ReadableStream({async start(r){let t=n[Symbol.asyncIterator]();for(;e.isAlive();)try{let s=await t.next();if(r.enqueue([s.done?2:0,s.value]),s.done){r.close();return}}catch(s){r.enqueue([1,s]);}r.close();}})}var l={},ze={},Oe={};var tr={0:{},1:{},2:{},3:{},4:{},5:{},6:{},7:{},8:{}};var W=class{constructor(e){this.marked=new Set;this.plugins=e.plugins,this.features=16383^(e.disabledFeatures||0),this.refs=e.refs||new Map;}markRef(e){this.marked.add(e);}isMarked(e){return this.marked.has(e)}getReference(e){let r=this.refs.get(e);if(r!=null)return this.markRef(r),P(r);let t=this.refs.size;return this.refs.set(e,t),w(e)?ce(t,e):t}getStrictReference(e){let r=this.refs.get(e);if(r!=null)return this.markRef(r),P(r);let t=this.refs.size;return this.refs.set(e,t),ce(t,e)}parseFunction(e){return f(w(e),new Error("Cannot serialize function without reference ID.")),this.getStrictReference(e)}parseWKSymbol(e){f(this.features&1024,new m(e));let r=this.refs.get(e);if(r!=null)return this.markRef(r),P(r);let t=e in T;f(e in T||w(e),new Error("Cannot serialize symbol without reference ID."));let s=this.refs.size;return this.refs.set(e,s),t?ue(s,e):ce(s,e)}parseSpecialReference(e){let r=tr[e],t=this.refs.get(r);if(t!=null)return this.markRef(t),P(t);let s=this.refs.size;return this.refs.set(r,s),{t:41,i:s,s:e,l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:void 0,f:void 0,b:void 0,o:void 0}}parseIteratorFactory(){let e=this.refs.get(ze);if(e!=null)return this.markRef(e),P(e);let r=this.refs.size;return this.refs.set(ze,r),{t:42,i:r,s:void 0,l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:void 0,f:this.parseWKSymbol(Symbol.iterator),b:void 0,o:void 0}}parseAsyncIteratorFactory(e){let r=this.refs.get(Oe);if(r!=null)return this.markRef(r),P(r);let t=this.refs.size;return this.refs.set(Oe,t),{t:44,i:t,s:e,l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:void 0,f:this.parseWKSymbol(Symbol.asyncIterator),b:void 0,o:void 0}}createObjectNode(e,r,t,s){return {t:t?11:10,i:e,s:void 0,l:void 0,c:void 0,m:void 0,p:s,e:void 0,a:void 0,f:void 0,b:void 0,o:oe(r)}}createMapNode(e,r,t,s){return {t:8,i:e,s:void 0,l:void 0,c:void 0,m:void 0,p:void 0,e:{k:r,v:t,s},a:void 0,f:this.parseSpecialReference(0),b:void 0,o:void 0}}};function K(n,e){return {t:18,i:n,s:d(e.href),l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,f:void 0,a:void 0,b:void 0,o:void 0}}function H(n,e){return {t:19,i:n,s:d(e.toString()),l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,f:void 0,a:void 0,b:void 0,o:void 0}}function G(n,e){return {t:39,i:n,s:d(e.message),l:void 0,c:d(e.name),m:void 0,p:void 0,e:void 0,a:void 0,f:void 0,b:void 0,o:void 0}}function Ie(n,e,r){return {t:37,i:n,s:d(e),l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:void 0,f:r,b:void 0,o:void 0}}function Ae(n,e,r){return {t:38,i:n,s:d(e),l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:void 0,f:r,b:void 0,o:void 0}}var br=/^[$A-Z_][0-9A-Z_$]*$/i;function Te(n){let e=n[0];return (e==="$"||e==="_"||e>="A"&&e<="Z"||e>="a"&&e<="z")&&br.test(n)}function ee(n){switch(n.t){case"index":return n.s+"="+n.v;case"set":return n.s+".set("+n.k+","+n.v+")";case"add":return n.s+".add("+n.v+")";case"delete":return n.s+".delete("+n.k+")";default:return ""}}function Nr(n){let e=[],r=n[0];for(let t=1,s=n.length,a,i=r;t<s;t++)a=n[t],a.t==="index"&&a.v===i.v?r={t:"index",s:a.s,k:void 0,v:ee(r)}:a.t==="set"&&a.s===i.s?r={t:"set",s:ee(r),k:a.k,v:a.v}:a.t==="add"&&a.s===i.s?r={t:"add",s:ee(r),k:void 0,v:a.v}:a.t==="delete"&&a.s===i.s?r={t:"delete",s:ee(r),k:a.k,v:void 0}:(e.push(r),r=a),i=a;return e.push(r),e}function or(n){if(n.length){let e="",r=Nr(n);for(let t=0,s=r.length;t<s;t++)e+=ee(r[t])+",";return e}}var Rr="Object.create(null)",Er="new Set",xr="new Map",Ir="Promise.resolve",Ar="Promise.reject",wr={3:"Object.freeze",2:"Object.seal",1:"Object.preventExtensions",0:void 0},O=class{constructor(e){this.stack=[];this.flags=[];this.assignments=[];this.plugins=e.plugins,this.features=e.features,this.marked=new Set(e.markedRefs);}createFunction(e,r){return this.features&4?(e.length===1?e[0]:"("+e.join(",")+")")+"=>"+r:"function("+e.join(",")+"){return "+r+"}"}createEffectfulFunction(e,r){return this.features&4?(e.length===1?e[0]:"("+e.join(",")+")")+"=>{"+r+"}":"function("+e.join(",")+"){"+r+"}"}markRef(e){this.marked.add(e);}isMarked(e){return this.marked.has(e)}pushObjectFlag(e,r){e!==0&&(this.markRef(r),this.flags.push({type:e,value:this.getRefParam(r)}));}resolveFlags(){let e="";for(let r=0,t=this.flags,s=t.length;r<s;r++){let a=t[r];e+=wr[a.type]+"("+a.value+"),";}return e}resolvePatches(){let e=or(this.assignments),r=this.resolveFlags();return e?r?e+r:e:r}createAssignment(e,r){this.assignments.push({t:"index",s:e,k:void 0,v:r});}createAddAssignment(e,r){this.assignments.push({t:"add",s:this.getRefParam(e),k:void 0,v:r});}createSetAssignment(e,r,t){this.assignments.push({t:"set",s:this.getRefParam(e),k:r,v:t});}createDeleteAssignment(e,r){this.assignments.push({t:"delete",s:this.getRefParam(e),k:r,v:void 0});}createArrayAssign(e,r,t){this.createAssignment(this.getRefParam(e)+"["+r+"]",t);}createObjectAssign(e,r,t){this.createAssignment(this.getRefParam(e)+"."+r,t);}isIndexedValueInStack(e){return e.t===4&&this.stack.includes(e.i)}serializeReference(e){return this.assignIndexedValue(e.i,I+'.get("'+e.s+'")')}serializeArrayItem(e,r,t){return r?this.isIndexedValueInStack(r)?(this.markRef(e),this.createArrayAssign(e,t,this.getRefParam(r.i)),""):this.serialize(r):""}serializeArray(e){let r=e.i;if(e.l){this.stack.push(r);let t=e.a,s=this.serializeArrayItem(r,t[0],0),a=s==="";for(let i=1,o=e.l,c;i<o;i++)c=this.serializeArrayItem(r,t[i],i),s+=","+c,a=c==="";return this.stack.pop(),this.pushObjectFlag(e.o,e.i),this.assignIndexedValue(r,"["+s+(a?",]":"]"))}return this.assignIndexedValue(r,"[]")}serializeProperty(e,r,t){if(typeof r=="string"){let s=Number(r),a=s>=0||Te(r);if(this.isIndexedValueInStack(t)){let i=this.getRefParam(t.i);return this.markRef(e.i),a&&s!==s?this.createObjectAssign(e.i,r,i):this.createArrayAssign(e.i,a?r:'"'+r+'"',i),""}return (a?r:'"'+r+'"')+":"+this.serialize(t)}return "["+this.serialize(r)+"]:"+this.serialize(t)}serializeProperties(e,r){let t=r.s;if(t){this.stack.push(e.i);let s=r.k,a=r.v,i=this.serializeProperty(e,s[0],a[0]);for(let o=1,c=i;o<t;o++)c=this.serializeProperty(e,s[o],a[o]),i+=(c&&i&&",")+c;return this.stack.pop(),"{"+i+"}"}return "{}"}serializeObject(e){return this.pushObjectFlag(e.o,e.i),this.assignIndexedValue(e.i,this.serializeProperties(e,e.p))}serializeWithObjectAssign(e,r,t){let s=this.serializeProperties(e,r);return s!=="{}"?"Object.assign("+t+","+s+")":t}serializeAssignment(e,r,t,s){if(typeof t=="string"){let a=this.serialize(s),i=Number(t),o=i>=0||Te(t);if(this.isIndexedValueInStack(s))o&&i!==i?this.createObjectAssign(e.i,t,a):this.createArrayAssign(e.i,o?t:'"'+t+'"',a);else {let c=this.assignments;this.assignments=r,o?this.createObjectAssign(e.i,t,a):this.createArrayAssign(e.i,o?t:'"'+t+'"',a),this.assignments=c;}}else {let a=this.stack;this.stack=[];let i=this.serialize(s);this.stack=a;let o=this.assignments;this.assignments=r,this.createArrayAssign(e.i,this.serialize(t),i),this.assignments=o;}}serializeAssignments(e,r){let t=r.s;if(t){this.stack.push(e.i);let s=[],a=r.k,i=r.v;for(let o=0;o<t;o++)this.serializeAssignment(e,s,a[o],i[o]);return this.stack.pop(),or(s)}}serializeDictionary(e,r){if(e.p)if(this.features&128)r=this.serializeWithObjectAssign(e,e.p,r);else {this.markRef(e.i);let t=this.serializeAssignments(e,e.p);if(t)return "("+this.assignIndexedValue(e.i,r)+","+t+this.getRefParam(e.i)+")"}return this.assignIndexedValue(e.i,r)}serializeNullConstructor(e){return this.pushObjectFlag(e.o,e.i),this.serializeDictionary(e,Rr)}serializeDate(e){return this.assignIndexedValue(e.i,'new Date("'+e.s+'")')}serializeRegExp(e){return this.assignIndexedValue(e.i,"/"+e.c+"/"+e.m)}serializeSetItem(e,r){return this.isIndexedValueInStack(r)?(this.markRef(e),this.createAddAssignment(e,this.getRefParam(r.i)),""):this.serialize(r)}serializeSet(e){let r=Er,t=e.l,s=e.i;if(t){let a=e.a;this.stack.push(s);let i=this.serializeSetItem(s,a[0]);for(let o=1,c=i;o<t;o++)c=this.serializeSetItem(s,a[o]),i+=(c&&i&&",")+c;this.stack.pop(),i&&(r+="(["+i+"])");}return this.assignIndexedValue(s,r)}serializeMapEntry(e,r,t,s){if(this.isIndexedValueInStack(r)){let a=this.getRefParam(r.i);if(this.markRef(e),this.isIndexedValueInStack(t)){let o=this.getRefParam(t.i);return this.createSetAssignment(e,a,o),""}if(t.t!==4&&t.i!=null&&this.isMarked(t.i)){let o="("+this.serialize(t)+",["+s+","+s+"])";return this.createSetAssignment(e,a,this.getRefParam(t.i)),this.createDeleteAssignment(e,s),o}let i=this.stack;return this.stack=[],this.createSetAssignment(e,a,this.serialize(t)),this.stack=i,""}if(this.isIndexedValueInStack(t)){let a=this.getRefParam(t.i);if(this.markRef(e),r.t!==4&&r.i!=null&&this.isMarked(r.i)){let o="("+this.serialize(r)+",["+s+","+s+"])";return this.createSetAssignment(e,this.getRefParam(r.i),a),this.createDeleteAssignment(e,s),o}let i=this.stack;return this.stack=[],this.createSetAssignment(e,this.serialize(r),a),this.stack=i,""}return "["+this.serialize(r)+","+this.serialize(t)+"]"}serializeMap(e){let r=xr,t=e.e.s,s=e.i,a=e.f,i=this.getRefParam(a.i);if(t){let o=e.e.k,c=e.e.v;this.stack.push(s);let E=this.serializeMapEntry(s,o[0],c[0],i);for(let F=1,Pe=E;F<t;F++)Pe=this.serializeMapEntry(s,o[F],c[F],i),E+=(Pe&&E&&",")+Pe;this.stack.pop(),E&&(r+="(["+E+"])");}return a.t===41&&(this.markRef(a.i),r="("+this.serialize(a)+","+r+")"),this.assignIndexedValue(s,r)}serializeArrayBuffer(e){let r="new Uint8Array(",t=e.s,s=t.length;if(s){r+="["+t[0];for(let a=1;a<s;a++)r+=","+t[a];r+="]";}return this.assignIndexedValue(e.i,r+").buffer")}serializeTypedArray(e){return this.assignIndexedValue(e.i,"new "+e.c+"("+this.serialize(e.f)+","+e.b+","+e.l+")")}serializeDataView(e){return this.assignIndexedValue(e.i,"new DataView("+this.serialize(e.f)+","+e.b+","+e.l+")")}serializeAggregateError(e){let r=e.i;this.stack.push(r);let t='new AggregateError([],"'+e.m+'")';return this.stack.pop(),this.serializeDictionary(e,t)}serializeError(e){return this.serializeDictionary(e,"new "+ne[e.s]+'("'+e.m+'")')}serializePromise(e){let r,t=e.f,s=e.i,a=e.s?Ir:Ar;if(this.isIndexedValueInStack(t)){let i=this.getRefParam(t.i);r=a+(e.s?"().then("+this.createFunction([],i)+")":"().catch("+this.createEffectfulFunction([],"throw "+i)+")");}else {this.stack.push(s);let i=this.serialize(t);this.stack.pop(),r=a+"("+i+")";}return this.assignIndexedValue(s,r)}serializeWKSymbol(e){return this.assignIndexedValue(e.i,Ve[e.s])}serializeURL(e){return this.assignIndexedValue(e.i,'new URL("'+e.s+'")')}serializeURLSearchParams(e){return this.assignIndexedValue(e.i,e.s?'new URLSearchParams("'+e.s+'")':"new URLSearchParams")}serializeBlob(e){return this.assignIndexedValue(e.i,"new Blob(["+this.serialize(e.f)+'],{type:"'+e.c+'"})')}serializeFile(e){return this.assignIndexedValue(e.i,"new File(["+this.serialize(e.f)+'],"'+e.m+'",{type:"'+e.c+'",lastModified:'+e.b+"})")}serializeHeaders(e){return this.assignIndexedValue(e.i,"new Headers("+this.serializeProperties(e,e.e)+")")}serializeFormDataEntry(e,r,t){return this.getRefParam(e)+'.append("'+r+'",'+this.serialize(t)+")"}serializeFormDataEntries(e,r){let t=e.e.k,s=e.e.v,a=e.i,i=this.serializeFormDataEntry(a,t[0],s[0]);for(let o=1;o<r;o++)i+=","+this.serializeFormDataEntry(a,t[o],s[o]);return i}serializeFormData(e){let r=e.e.s,t=e.i;r&&this.markRef(t);let s=this.assignIndexedValue(t,"new FormData()");if(r){let a=this.serializeFormDataEntries(e,r);return "("+s+","+(a?a+",":"")+this.getRefParam(t)+")"}return s}serializeBoxed(e){return this.assignIndexedValue(e.i,"Object("+this.serialize(e.f)+")")}serializeRequest(e){return this.assignIndexedValue(e.i,'new Request("'+e.s+'",'+this.serialize(e.f)+")")}serializeResponse(e){return this.assignIndexedValue(e.i,"new Response("+this.serialize(e.a[0])+","+this.serialize(e.a[1])+")")}serializeEvent(e){return this.assignIndexedValue(e.i,'new Event("'+e.s+'",'+this.serialize(e.f)+")")}serializeCustomEvent(e){return this.assignIndexedValue(e.i,'new CustomEvent("'+e.s+'",'+this.serialize(e.f)+")")}serializeDOMException(e){return this.assignIndexedValue(e.i,'new DOMException("'+e.s+'","'+e.c+'")')}serializePlugin(e){let r=this.plugins;if(r)for(let t=0,s=r.length;t<s;t++){let a=r[t];if(a.tag===e.c)return this.assignIndexedValue(e.i,a.serialize(e.s,this,{id:e.i}))}throw new Error('Missing plugin for tag "'+e.c+'".')}getConstructor(e){let r=this.serialize(e);return r===this.getRefParam(e.i)?r:"("+r+")"}serializePromiseConstructor(e){return this.assignIndexedValue(e.i,this.getConstructor(e.f)+"()")}serializePromiseResolve(e){return this.getConstructor(e.a[0])+"("+this.getRefParam(e.i)+","+this.serialize(e.a[1])+")"}serializePromiseReject(e){return this.getConstructor(e.a[0])+"("+this.getRefParam(e.i)+","+this.serialize(e.a[1])+")"}serializeReadableStreamConstructor(e){return this.assignIndexedValue(e.i,this.getConstructor(e.f)+"()")}serializeReadableStreamEnqueue(e){return this.getConstructor(e.a[0])+"("+this.getRefParam(e.i)+","+this.serialize(e.a[1])+")"}serializeReadableStreamError(e){return this.getConstructor(e.a[0])+"("+this.getRefParam(e.i)+","+this.serialize(e.a[1])+")"}serializeReadableStreamClose(e){return this.getConstructor(e.f)+"("+this.getRefParam(e.i)+")"}serializeSpecialReferenceValue(e){switch(e){case 0:return "[]";case 1:return this.createFunction(["s"],"new ReadableStream({start:"+this.createFunction(["c"],"Promise.resolve().then("+this.createEffectfulFunction(["i","v"],"for(i=0;i<s.d;i++)c.enqueue(s.v[i]);(s.t===-1)?c.close():c.error(s.v[i])")+")")+"})");case 2:return this.createFunction(["s","f","p"],"((p=new Promise("+this.createEffectfulFunction(["a","b"],"s=a,f=b")+")).s=s,p.f=f,p)");case 3:return this.createEffectfulFunction(["p","d"],'p.s(d),p.status="success",p.value=d;delete p.s;delete p.f');case 4:return this.createEffectfulFunction(["p","d"],'p.f(d),p.status="failure",p.value=d;delete p.s;delete p.f');case 5:return this.createFunction(["s","c"],"((s=new ReadableStream({start:"+this.createEffectfulFunction(["x"],"c=x")+"})).c=c,s)");case 6:return this.createEffectfulFunction(["s","d"],"s.c.enqueue(d)");case 7:return this.createEffectfulFunction(["s","d"],"s.c.error(d);delete s.c");case 8:return this.createEffectfulFunction(["s"],"s.c.close();delete s.c");default:return ""}}serializeSpecialReference(e){return this.assignIndexedValue(e.i,this.serializeSpecialReferenceValue(e.s))}serializeIteratorFactory(e){return this.assignIndexedValue(e.i,this.createFunction(["s"],this.createFunction(["i","c","d","t"],"(i=0,t={["+this.serialize(e.f)+"]:"+this.createFunction([],"t")+",next:"+this.createEffectfulFunction([],"if(i>s.d)return{done:!0,value:void 0};c=i++,d=s.v[c];if(c===s.t)throw d;return{done:c===s.d,value:d}")+"})")))}serializeIteratorFactoryInstance(e){return this.getConstructor(e.a[0])+"("+this.serialize(e.a[1])+")"}getStreamingAsyncIteratorFactory(e){return this.createFunction(["s"],this.createFunction(["b","t"],"(b=s.tee(),s=b[0],b=b[1].getReader(),t={["+this.serialize(e.f)+"]:"+this.createFunction([],"t")+",next:"+this.createFunction([],"b.read().then("+this.createEffectfulFunction(["d"],"if(d.done)return{done:!0,value:void 0};d=d.value;if(d[0]===1)throw d[1];return{done:d[0]===2,value:d[1]}")+")")+"})"))}getBlockingAsyncIteratorFactory(e){return this.createFunction(["s"],this.createFunction(["i","t"],"(i=0,t={["+this.serialize(e.f)+"]:"+this.createFunction([],"t")+",next:"+this.createFunction([],"Promise.resolve().then("+this.createEffectfulFunction(["c","d"],"if(i>s.d)return{done:!0,value:void 0};c=i++,d=s.v[c];if(c===s.t)throw d;return{done:c===s.d,value:d}")+")")+"})"))}serializeAsyncIteratorFactory(e){return this.assignIndexedValue(e.i,e.s?this.getStreamingAsyncIteratorFactory(e):this.getBlockingAsyncIteratorFactory(e))}serializeAsyncIteratorFactoryInstance(e){return this.getConstructor(e.a[0])+"("+this.serialize(e.a[1])+")"}serializeReadableStream(e){this.stack.push(e.i);let r=this.getConstructor(e.a[0])+"("+this.serialize(e.a[1])+")";return this.stack.pop(),this.assignIndexedValue(e.i,r)}serialize(e){switch(e.t){case 2:return Ue[e.s];case 0:return ""+e.s;case 1:return '"'+e.s+'"';case 3:return e.s+"n";case 4:return this.getRefParam(e.i);case 20:return this.serializeReference(e);case 9:return this.serializeArray(e);case 10:return this.serializeObject(e);case 11:return this.serializeNullConstructor(e);case 5:return this.serializeDate(e);case 6:return this.serializeRegExp(e);case 7:return this.serializeSet(e);case 8:return this.serializeMap(e);case 21:return this.serializeArrayBuffer(e);case 16:case 15:return this.serializeTypedArray(e);case 22:return this.serializeDataView(e);case 14:return this.serializeAggregateError(e);case 13:return this.serializeError(e);case 12:return this.serializePromise(e);case 17:return this.serializeWKSymbol(e);case 18:return this.serializeURL(e);case 19:return this.serializeURLSearchParams(e);case 23:return this.serializeBlob(e);case 24:return this.serializeFile(e);case 25:return this.serializeHeaders(e);case 26:return this.serializeFormData(e);case 27:return this.serializeBoxed(e);case 28:return this.serializePromiseConstructor(e);case 29:return this.serializePromiseResolve(e);case 30:return this.serializePromiseReject(e);case 31:return this.serializeReadableStreamConstructor(e);case 32:return this.serializeReadableStreamEnqueue(e);case 34:return this.serializeReadableStreamError(e);case 33:return this.serializeReadableStreamClose(e);case 35:return this.serializeRequest(e);case 36:return this.serializeResponse(e);case 37:return this.serializeEvent(e);case 38:return this.serializeCustomEvent(e);case 39:return this.serializeDOMException(e);case 40:return this.serializePlugin(e);case 41:return this.serializeSpecialReference(e);case 42:return this.serializeIteratorFactory(e);case 43:return this.serializeIteratorFactoryInstance(e);case 44:return this.serializeAsyncIteratorFactory(e);case 45:return this.serializeAsyncIteratorFactoryInstance(e);case 46:return this.serializeReadableStream(e);default:throw new Error("invariant")}}};var h=class extends W{parseItems(e){let r=[];for(let t=0,s=e.length;t<s;t++)t in e&&(r[t]=this.parse(e[t]));return r}parseArray(e,r){return fe(e,r,this.parseItems(r))}parseProperties(e){let r=Object.entries(e),t=[],s=[];for(let a=0,i=r.length;a<i;a++)t.push(d(r[a][0])),s.push(this.parse(r[a][1]));if(this.features&1024){let a=Symbol.iterator;a in e&&(t.push(this.parseWKSymbol(a)),s.push(_(this.parseIteratorFactory(),this.parse(q(e))))),a=Symbol.toStringTag,a in e&&(t.push(this.parseWKSymbol(a)),s.push(N(e[a]))),a=Symbol.isConcatSpreadable,a in e&&(t.push(this.parseWKSymbol(a)),s.push(e[a]?y:v));}return {k:t,v:s,s:t.length}}parsePlainObject(e,r,t){return this.createObjectNode(e,r,t,this.parseProperties(r))}parseBoxed(e,r){return pe(e,this.parse(r.valueOf()))}parseTypedArray(e,r){return me(e,r,this.parse(r.buffer))}parseBigIntTypedArray(e,r){return Se(e,r,this.parse(r.buffer))}parseDataView(e,r){return he(e,r,this.parse(r.buffer))}parseError(e,r){let t=V(r,this.features);return ge(e,r,t?this.parseProperties(t):void 0)}parseAggregateError(e,r){let t=V(r,this.features);return ye(e,r,t?this.parseProperties(t):void 0)}parseMap(e,r){let t=[],s=[];for(let[a,i]of r.entries())t.push(this.parse(a)),s.push(this.parse(i));return this.createMapNode(e,t,s,r.size)}parseSet(e,r){let t=[];for(let s of r.keys())t.push(this.parse(s));return ve(e,r.size,t)}parsePlainProperties(e){let r=e.length,t=[],s=[];for(let a=0;a<r;a++)t.push(d(e[a][0])),s.push(this.parse(e[a][1]));return {k:t,v:s,s:r}}parseHeaders(e,r){let t=[];return r.forEach((s,a)=>{t.push([a,s]);}),{t:25,i:e,s:void 0,l:void 0,c:void 0,m:void 0,p:void 0,e:this.parsePlainProperties(t),a:void 0,f:void 0,b:void 0,o:void 0}}parseFormData(e,r){let t=[];return r.forEach((s,a)=>{t.push([a,s]);}),{t:26,i:e,s:void 0,l:void 0,c:void 0,m:void 0,p:void 0,e:this.parsePlainProperties(t),a:void 0,f:void 0,b:void 0,o:void 0}}parseEvent(e,r){return Ie(e,r.type,this.parse(Ee(r)))}parseCustomEvent(e,r){return Ae(e,r.type,this.parse(xe(r)))}parsePlugin(e,r){let t=this.plugins;if(t)for(let s=0,a=t.length;s<a;s++){let i=t[s];if(i.parse.sync&&i.test(r))return L(e,i.tag,i.parse.sync(r,this,{id:e}))}}parseObject(e,r){if(Array.isArray(r))return this.parseArray(e,r);let t=r.constructor;switch(t){case Object:return this.parsePlainObject(e,r,!1);case void 0:return this.parsePlainObject(e,r,!0);case Date:return j(e,r);case RegExp:return U(e,r);case Error:case EvalError:case RangeError:case ReferenceError:case SyntaxError:case TypeError:case URIError:return this.parseError(e,r);case Number:case Boolean:case String:case BigInt:return this.parseBoxed(e,r);}let s=this.features;if(s&2048)switch(t){case ArrayBuffer:return M(e,r);case Int8Array:case Int16Array:case Int32Array:case Uint8Array:case Uint16Array:case Uint32Array:case Uint8ClampedArray:case Float32Array:case Float64Array:return this.parseTypedArray(e,r);case DataView:return this.parseDataView(e,r);}if((s&4104)===4104)switch(t){case BigInt64Array:case BigUint64Array:return this.parseBigIntTypedArray(e,r);}if(s&32&&t===Map)return this.parseMap(e,r);if(s&512&&t===Set)return this.parseSet(e,r);if(s&8192)switch(t){case(typeof URL!="undefined"?URL:l):return K(e,r);case(typeof URLSearchParams!="undefined"?URLSearchParams:l):return H(e,r);case(typeof Headers!="undefined"?Headers:l):return this.parseHeaders(e,r);case(typeof FormData!="undefined"?FormData:l):return this.parseFormData(e,r);case(typeof Event!="undefined"?Event:l):return this.parseEvent(e,r);case(typeof CustomEvent!="undefined"?CustomEvent:l):return this.parseCustomEvent(e,r);case(typeof DOMException!="undefined"?DOMException:l):return G(e,r);}let a=this.parsePlugin(e,r);if(a)return a;if(s&1&&typeof AggregateError!="undefined"&&(t===AggregateError||r instanceof AggregateError))return this.parseAggregateError(e,r);if(r instanceof Error)return this.parseError(e,r);if(s&1024&&Symbol.iterator in r)return this.parsePlainObject(e,r,!!t);throw new m(r)}parse(e){switch(e){case!0:return y;case!1:return v;case void 0:return se;case null:return x;}switch(typeof e){case"string":return N(e);case"number":return de(e);case"bigint":return f(this.features&8,new m(e)),le(e);case"object":{let r=this.getReference(e);return typeof r=="number"?this.parseObject(r,e):r}case"symbol":{f(this.features&1024,new m(e));let r=this.getReference(e);return typeof r=="number"?ue(r,e):r}case"function":return f(w(e),new Error("Cannot serialize function without reference ID.")),this.getStrictReference(e);default:throw new m(e)}}};var D=class extends O{constructor(r){super(r);this.mode="cross";this.scopeId=r.scopeId;}getRefParam(r){return typeof r=="string"?B+"."+r:B+"["+r+"]"}assignIndexedValue(r,t){return this.getRefParam(r)+"="+t}serializeTop(r){let t=this.serialize(r),s=r.i;if(s==null)return t;let a=this.resolvePatches(),i=this.getRefParam(s),o=this.scopeId==null?"":B,c=a?t+","+a:t;if(o==="")return a?"("+c+i+")":c;let E=this.scopeId==null?"()":"("+B+'["'+d(this.scopeId)+'"])',F=c+(a?i:"");return "("+this.createFunction([o],F)+")"+E}};var te=class extends h{constructor(r){super(r);this.alive=!0;this.pending=0;this.onParseCallback=r.onParse,this.onErrorCallback=r.onError,this.onDoneCallback=r.onDone;}onParse(r,t){try{this.onParseCallback(r,t);}catch(s){this.onError(s);}}onError(r){if(this.onErrorCallback)this.onErrorCallback(r);else throw r}onDone(){this.onDoneCallback&&this.onDoneCallback();}push(r){this.onParse(this.parse(r),!1);}pushPendingState(){this.pending++;}popPendingState(){--this.pending<=0&&this.onDone();}parseProperties(r){let t=Object.entries(r),s=[],a=[];for(let i=0,o=t.length;i<o;i++)s.push(d(t[i][0])),a.push(this.parse(t[i][1]));if(this.features&1024){let i=Symbol.iterator;i in r&&(s.push(this.parseWKSymbol(i)),a.push(_(this.parseIteratorFactory(),this.parse(q(r))))),i=Symbol.asyncIterator,i in r&&(s.push(this.parseWKSymbol(i)),a.push(be(this.parseAsyncIteratorFactory(1),this.parse(Xe(r,this))))),i=Symbol.toStringTag,i in r&&(s.push(this.parseWKSymbol(i)),a.push(N(r[i]))),i=Symbol.isConcatSpreadable,i in r&&(s.push(this.parseWKSymbol(i)),a.push(r[i]?y:v));}return {k:s,v:a,s:s.length}}pushReadableStreamReader(r,t){t.read().then(s=>{if(this.alive)if(s.done)this.onParse({t:33,i:r,s:void 0,l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:void 0,f:this.parseSpecialReference(8),b:void 0,o:void 0},!1),this.popPendingState();else {let a=this.parseWithError(s.value);a&&(this.onParse({t:32,i:r,s:void 0,l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:[this.parseSpecialReference(6),a],f:void 0,b:void 0,o:void 0},!1),this.pushReadableStreamReader(r,t));}},s=>{if(this.alive){let a=this.parseWithError(s);a&&this.onParse({t:34,i:r,s:void 0,l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:[this.parseSpecialReference(7),a],f:void 0,b:void 0,o:void 0},!1),this.popPendingState();}});}parseReadableStream(r,t){let s=t.getReader();return this.pushPendingState(),this.pushReadableStreamReader(r,s),{t:31,i:r,s:void 0,l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:void 0,f:this.parseSpecialReference(5),b:void 0,o:void 0}}parseRequest(r,t){return {t:35,i:r,s:d(t.url),l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,f:this.parse(Ne(t,t.clone().body)),a:void 0,b:void 0,o:void 0}}parseResponse(r,t){return {t:36,i:r,s:void 0,l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,f:void 0,a:[t.body?this.parse(t.clone().body):x,this.parse(Re(t))],b:void 0,o:void 0}}parsePromise(r,t){return t.then(s=>{let a=this.parseWithError(s);a&&this.onParse({t:29,i:r,s:void 0,l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:[this.parseSpecialReference(3),a],f:void 0,b:void 0,o:void 0},!1),this.popPendingState();},s=>{if(this.alive){let a=this.parseWithError(s);a&&this.onParse({t:30,i:r,s:void 0,l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:[this.parseSpecialReference(4),a],f:void 0,b:void 0,o:void 0},!1);}this.popPendingState();}),this.pushPendingState(),{t:28,i:r,s:void 0,l:void 0,c:void 0,m:void 0,p:void 0,e:void 0,a:void 0,f:this.parseSpecialReference(2),b:void 0,o:void 0}}parsePlugin(r,t){let s=this.plugins;if(s)for(let a=0,i=s.length;a<i;a++){let o=s[a];if(o.parse.stream&&o.test(t))return L(r,o.tag,o.parse.stream(t,this,{id:r}))}}parseObject(r,t){if(Array.isArray(t))return this.parseArray(r,t);let s=t.constructor;switch(s){case Object:return this.parsePlainObject(r,t,!1);case void 0:return this.parsePlainObject(r,t,!0);case Date:return j(r,t);case RegExp:return U(r,t);case Error:case EvalError:case RangeError:case ReferenceError:case SyntaxError:case TypeError:case URIError:return this.parseError(r,t);case Number:case Boolean:case String:case BigInt:return this.parseBoxed(r,t);}let a=this.features;if(a&256&&(s===Promise||t instanceof Promise))return this.parsePromise(r,t);if(a&2048)switch(s){case ArrayBuffer:return M(r,t);case Int8Array:case Int16Array:case Int32Array:case Uint8Array:case Uint16Array:case Uint32Array:case Uint8ClampedArray:case Float32Array:case Float64Array:return this.parseTypedArray(r,t);case DataView:return this.parseDataView(r,t);}if((a&4104)===4104)switch(s){case BigInt64Array:case BigUint64Array:return this.parseBigIntTypedArray(r,t);}if(a&32&&s===Map)return this.parseMap(r,t);if(a&512&&s===Set)return this.parseSet(r,t);if(a&8192)switch(s){case(typeof URL!="undefined"?URL:l):return K(r,t);case(typeof URLSearchParams!="undefined"?URLSearchParams:l):return H(r,t);case(typeof Headers!="undefined"?Headers:l):return this.parseHeaders(r,t);case(typeof FormData!="undefined"?FormData:l):return this.parseFormData(r,t);case(typeof ReadableStream!="undefined"?ReadableStream:l):return this.parseReadableStream(r,t);case(typeof Request!="undefined"?Request:l):return this.parseRequest(r,t);case(typeof Response!="undefined"?Response:l):return this.parseResponse(r,t);case(typeof Event!="undefined"?Event:l):return this.parseEvent(r,t);case(typeof CustomEvent!="undefined"?CustomEvent:l):return this.parseCustomEvent(r,t);case(typeof DOMException!="undefined"?DOMException:l):return G(r,t);}let i=this.parsePlugin(r,t);if(i)return i;if(a&1&&typeof AggregateError!="undefined"&&(s===AggregateError||t instanceof AggregateError))return this.parseAggregateError(r,t);if(t instanceof Error)return this.parseError(r,t);if(a&1024&&(Symbol.iterator in t||Symbol.asyncIterator in t))return this.parsePlainObject(r,t,!!s);throw new m(t)}parseWithError(r){try{return this.parse(r)}catch(t){this.onError(t);return}}start(r){let t=this.parseWithError(r);t&&(this.onParse(t,!0),this.pending<=0&&this.destroy());}destroy(){this.alive&&(this.onDone(),this.alive=!1);}isAlive(){return this.alive}};var Z=class extends te{constructor(){super(...arguments);this.mode="cross";}};function pr(n,e){let r=new Z({plugins:e.plugins,refs:e.refs,disabledFeatures:e.disabledFeatures,onParse(t,s){let a=new D({plugins:e.plugins,features:r.features,scopeId:e.scopeId,markedRefs:r.marked}),i;try{i=a.serializeTop(t);}catch(o){e.onError&&e.onError(o);return}e.onSerialize(i,s);},onError:e.onError,onDone:e.onDone});return r.start(n),()=>{r.destroy();}}var we=class{constructor(e){this.options=e;this.alive=!0;this.flushed=!1;this.done=!1;this.pending=0;this.cleanups=[];this.refs=new Map;this.keys=new Set;this.ids=0;}write(e,r){this.alive&&!this.flushed&&(this.pending++,this.keys.add(e),this.cleanups.push(pr(r,{plugins:this.options.plugins,scopeId:this.options.scopeId,refs:this.refs,disabledFeatures:this.options.disabledFeatures,onError:this.options.onError,onSerialize:(t,s)=>{this.alive&&this.options.onData(s?this.options.globalIdentifier+'["'+d(e)+'"]='+t:t);},onDone:()=>{this.alive&&(this.pending--,this.pending<=0&&this.flushed&&!this.done&&this.options.onDone&&(this.options.onDone(),this.done=!0));}})));}getNextID(){for(;this.keys.has(""+this.ids);)this.ids++;return ""+this.ids}push(e){let r=this.getNextID();return this.write(r,e),r}flush(){this.alive&&(this.flushed=!0,this.pending<=0&&!this.done&&this.options.onDone&&(this.options.onDone(),this.done=!0));}close(){if(this.alive){for(let e=0,r=this.cleanups.length;e<r;e++)this.cleanups[e]();!this.done&&this.options.onDone&&(this.options.onDone(),this.done=!0),this.alive=!1;}}};

const booleans = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "hidden",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected"
];
const BooleanAttributes = /*#__PURE__*/ new Set(booleans);
const ChildProperties = /*#__PURE__*/ new Set([
  "innerHTML",
  "textContent",
  "innerText",
  "children"
]);
const Aliases = /*#__PURE__*/ Object.assign(Object.create(null), {
  className: "class",
  htmlFor: "for"
});

const ES2017FLAG = b.AggregateError | b.BigInt | b.BigIntTypedArray;
const GLOBAL_IDENTIFIER = "_$HY.r";
function createSerializer({ onData, onDone, scopeId, onError }) {
  return new we({
    scopeId,
    globalIdentifier: GLOBAL_IDENTIFIER,
    disabledFeatures: ES2017FLAG,
    onData,
    onDone,
    onError
  });
}
function getLocalHeaderScript(id) {
  return hr(id);
}

const VOID_ELEMENTS =
  /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
const REPLACE_SCRIPT = `function $df(e,n,o,t){if(n=document.getElementById(e),o=document.getElementById("pl-"+e)){for(;o&&8!==o.nodeType&&o.nodeValue!=="pl-"+e;)t=o.nextSibling,o.remove(),o=t;_$HY.done?o.remove():o.replaceWith(n.content)}n.remove(),_$HY.fe(e)}`;
function renderToStringAsync(code, options = {}) {
  const { timeoutMs = 30000 } = options;
  let timeoutHandle;
  const timeout = new Promise((_, reject) => {
    timeoutHandle = setTimeout(() => reject("renderToString timed out"), timeoutMs);
  });
  return Promise.race([renderToStream(code, options), timeout]).then(html => {
    clearTimeout(timeoutHandle);
    return html;
  });
}
function renderToStream(code, options = {}) {
  let { nonce, onCompleteShell, onCompleteAll, renderId, noScripts } = options;
  let dispose;
  const blockingPromises = [];
  const pushTask = task => {
    if (noScripts) return;
    if (!tasks && !firstFlushed) {
      tasks = getLocalHeaderScript(renderId);
    }
    tasks += task + ";";
    if (!timer && firstFlushed) {
      timer = setTimeout(writeTasks);
    }
  };
  const checkEnd = () => {
    if (!registry.size && !completed) {
      writeTasks();
      onCompleteAll &&
        onCompleteAll({
          write(v) {
            !completed && buffer.write(v);
          }
        });
      writable && writable.end();
      completed = true;
      setTimeout(dispose);
    }
  };
  const serializer = createSerializer({
    scopeId: options.renderId,
    onData: pushTask,
    onDone: checkEnd,
    onError: options.onError
  });
  const flushEnd = () => {
    if (!registry.size) {
      serializer.flush();
    }
  };
  const registry = new Map();
  const writeTasks = () => {
    if (tasks.length && !completed && firstFlushed) {
      buffer.write(`<script${nonce ? ` nonce="${nonce}"` : ""}>${tasks}</script>`);
      tasks = "";
    }
    timer && clearTimeout(timer);
    timer = null;
  };
  let context;
  let writable;
  let tmp = "";
  let tasks = "";
  let firstFlushed = false;
  let completed = false;
  let scriptFlushed = false;
  let timer = null;
  let buffer = {
    write(payload) {
      tmp += payload;
    }
  };
  sharedConfig.context = context = {
    id: renderId || "",
    count: 0,
    async: true,
    resources: {},
    lazy: {},
    suspense: {},
    assets: [],
    nonce,
    block(p) {
      if (!firstFlushed) blockingPromises.push(p);
    },
    replace(id, payloadFn) {
      if (firstFlushed) return;
      const placeholder = `<!--!$${id}-->`;
      const first = html.indexOf(placeholder);
      if (first === -1) return;
      const last = html.indexOf(`<!--!$/${id}-->`, first + placeholder.length);
      html = html.replace(
        html.slice(first, last + placeholder.length + 1),
        resolveSSRNode(payloadFn())
      );
    },
    serialize(id, p, wait) {
      const serverOnly = sharedConfig.context.noHydrate;
      if (!firstFlushed && wait && typeof p === "object" && "then" in p) {
        blockingPromises.push(p);
        !serverOnly &&
          p
            .then(d => {
              serializer.write(id, d);
            })
            .catch(e => {
              serializer.write(id, e);
            });
      } else if (!serverOnly) serializer.write(id, p);
    },
    pushed: 0,
    push(p) {
      const id = this.renderId + "i-" + this.pushed++;
      this.serialize(id, p);
      return id;
    },
    registerFragment(key) {
      if (!registry.has(key)) {
        let resolve, reject;
        const p = new Promise((r, rej) => ((resolve = r), (reject = rej)));
        registry.set(key, {
          resolve: v => queue(() => queue(() => resolve(v))),
          reject: e => queue(() => queue(() => reject(e)))
        });
        serializer.write(key, p);
      }
      return (value, error) => {
        if (registry.has(key)) {
          const { resolve, reject } = registry.get(key);
          registry.delete(key);
          if (waitForFragments(registry, key)) {
            resolve(true);
            return;
          }
          if ((value !== undefined || error) && !completed) {
            if (!firstFlushed) {
              queue(() => (html = replacePlaceholder(html, key, value !== undefined ? value : "")));
              error ? reject(error) : resolve(true);
            } else {
              buffer.write(`<template id="${key}">${value !== undefined ? value : " "}</template>`);
              pushTask(`$df("${key}")${!scriptFlushed ? ";" + REPLACE_SCRIPT : ""}`);
              error ? reject(error) : resolve(true);
              scriptFlushed = true;
            }
          }
        }
        if (!registry.size) queue(flushEnd);
        return firstFlushed;
      };
    }
  };
  let html = createRoot(d => {
    dispose = d;
    return resolveSSRNode(escape(code()));
  });
  function doShell() {
    sharedConfig.context = context;
    context.noHydrate = true;
    html = injectAssets(context.assets, html);
    if (tasks.length) html = injectScripts(html, tasks, nonce);
    buffer.write(html);
    tasks = "";
    onCompleteShell &&
      onCompleteShell({
        write(v) {
          !completed && buffer.write(v);
        }
      });
  }
  return {
    then(fn) {
      function complete() {
        doShell();
        fn(tmp);
      }
      if (onCompleteAll) {
        let ogComplete = onCompleteAll;
        onCompleteAll = options => {
          ogComplete(options);
          complete();
        };
      } else onCompleteAll = complete;
      if (!registry.size) queue(flushEnd);
    },
    pipe(w) {
      Promise.allSettled(blockingPromises).then(() => {
        doShell();
        buffer = writable = w;
        buffer.write(tmp);
        firstFlushed = true;
        if (completed) writable.end();
        else setTimeout(flushEnd);
      });
    },
    pipeTo(w) {
      return Promise.allSettled(blockingPromises).then(() => {
        doShell();
        const encoder = new TextEncoder();
        const writer = w.getWriter();
        let resolve;
        const p = new Promise(r => (resolve = r));
        writable = {
          end() {
            writer.releaseLock();
            w.close();
            resolve();
          }
        };
        buffer = {
          write(payload) {
            writer.write(encoder.encode(payload));
          }
        };
        buffer.write(tmp);
        firstFlushed = true;
        if (completed) writable.end();
        else setTimeout(flushEnd);
        return p;
      });
    }
  };
}
function HydrationScript(props) {
  const { nonce } = sharedConfig.context;
  return ssr(
    generateHydrationScript({
      nonce,
      ...props
    })
  );
}
function ssr(t, ...nodes) {
  if (nodes.length) {
    let result = "";
    for (let i = 0; i < nodes.length; i++) {
      result += t[i];
      const node = nodes[i];
      if (node !== undefined) result += resolveSSRNode(node);
    }
    t = result + t[nodes.length];
  }
  return {
    t
  };
}
function ssrClassList(value) {
  if (!value) return "";
  let classKeys = Object.keys(value),
    result = "";
  for (let i = 0, len = classKeys.length; i < len; i++) {
    const key = classKeys[i],
      classValue = !!value[key];
    if (!key || key === "undefined" || !classValue) continue;
    i && (result += " ");
    result += escape(key);
  }
  return result;
}
function ssrStyle(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  let result = "";
  const k = Object.keys(value);
  for (let i = 0; i < k.length; i++) {
    const s = k[i];
    const v = value[s];
    if (v != undefined) {
      if (i) result += ";";
      result += `${s}:${escape(v, true)}`;
    }
  }
  return result;
}
function ssrElement(tag, props, children, needsId) {
  if (props == null) props = {};
  else if (typeof props === "function") props = props();
  const skipChildren = VOID_ELEMENTS.test(tag);
  const keys = Object.keys(props);
  let result = `<${tag}${needsId ? ssrHydrationKey() : ""} `;
  let classResolved;
  for (let i = 0; i < keys.length; i++) {
    const prop = keys[i];
    if (ChildProperties.has(prop)) {
      if (children === undefined && !skipChildren)
        children = prop === "innerHTML" ? props[prop] : escape(props[prop]);
      continue;
    }
    const value = props[prop];
    if (prop === "style") {
      result += `style="${ssrStyle(value)}"`;
    } else if (prop === "class" || prop === "className" || prop === "classList") {
      if (classResolved) continue;
      let n;
      result += `class="${
        escape(((n = props.class) ? n + " " : "") + ((n = props.className) ? n + " " : ""), true) +
        ssrClassList(props.classList)
      }"`;
      classResolved = true;
    } else if (BooleanAttributes.has(prop)) {
      if (value) result += prop;
      else continue;
    } else if (value == undefined || prop === "ref" || prop.slice(0, 2) === "on") {
      continue;
    } else {
      result += `${Aliases[prop] || prop}="${escape(value, true)}"`;
    }
    if (i !== keys.length - 1) result += " ";
  }
  if (skipChildren)
    return {
      t: result + "/>"
    };
  if (typeof children === "function") children = children();
  return {
    t: result + `>${resolveSSRNode(children, true)}</${tag}>`
  };
}
function ssrAttribute(key, value, isBoolean) {
  return isBoolean ? (value ? " " + key : "") : value != null ? ` ${key}="${value}"` : "";
}
function ssrHydrationKey() {
  const hk = getHydrationKey();
  return hk ? ` data-hk="${hk}"` : "";
}
function escape(s, attr) {
  const t = typeof s;
  if (t !== "string") {
    if (!attr && t === "function") return escape(s());
    if (!attr && Array.isArray(s)) {
      for (let i = 0; i < s.length; i++) s[i] = escape(s[i]);
      return s;
    }
    if (attr && t === "boolean") return String(s);
    return s;
  }
  const delim = attr ? '"' : "<";
  const escDelim = attr ? "&quot;" : "&lt;";
  let iDelim = s.indexOf(delim);
  let iAmp = s.indexOf("&");
  if (iDelim < 0 && iAmp < 0) return s;
  let left = 0,
    out = "";
  while (iDelim >= 0 && iAmp >= 0) {
    if (iDelim < iAmp) {
      if (left < iDelim) out += s.substring(left, iDelim);
      out += escDelim;
      left = iDelim + 1;
      iDelim = s.indexOf(delim, left);
    } else {
      if (left < iAmp) out += s.substring(left, iAmp);
      out += "&amp;";
      left = iAmp + 1;
      iAmp = s.indexOf("&", left);
    }
  }
  if (iDelim >= 0) {
    do {
      if (left < iDelim) out += s.substring(left, iDelim);
      out += escDelim;
      left = iDelim + 1;
      iDelim = s.indexOf(delim, left);
    } while (iDelim >= 0);
  } else
    while (iAmp >= 0) {
      if (left < iAmp) out += s.substring(left, iAmp);
      out += "&amp;";
      left = iAmp + 1;
      iAmp = s.indexOf("&", left);
    }
  return left < s.length ? out + s.substring(left) : out;
}
function resolveSSRNode(node, top) {
  const t = typeof node;
  if (t === "string") return node;
  if (node == null || t === "boolean") return "";
  if (Array.isArray(node)) {
    let prev = {};
    let mapped = "";
    for (let i = 0, len = node.length; i < len; i++) {
      if (!top && typeof prev !== "object" && typeof node[i] !== "object") mapped += `<!--!$-->`;
      mapped += resolveSSRNode((prev = node[i]));
    }
    return mapped;
  }
  if (t === "object") return node.t;
  if (t === "function") return resolveSSRNode(node());
  return String(node);
}
function getHydrationKey() {
  const hydrate = sharedConfig.context;
  return hydrate && !hydrate.noHydrate && `${hydrate.id}${hydrate.count++}`;
}
function useAssets(fn) {
  sharedConfig.context.assets.push(() => resolveSSRNode(fn()));
}
function generateHydrationScript({ eventNames = ["click", "input"], nonce } = {}) {
  return `<script${
    nonce ? ` nonce="${nonce}"` : ""
  }>window._$HY||(e=>{let t=e=>e&&e.hasAttribute&&(e.hasAttribute("data-hk")?e:t(e.host&&e.host.nodeType?e.host:e.parentNode));["${eventNames.join(
    '", "'
  )}"].forEach((o=>document.addEventListener(o,(o=>{let a=o.composedPath&&o.composedPath()[0]||o.target,s=t(a);s&&!e.completed.has(s)&&e.events.push([s,o])}))))})(_$HY={events:[],completed:new WeakSet,r:{},fe(){}});</script><!--xs-->`;
}
function Hydration(props) {
  if (!sharedConfig.context.noHydrate) return props.children;
  const context = sharedConfig.context;
  sharedConfig.context = {
    ...context,
    count: 0,
    id: `${context.id}${context.count++}-`,
    noHydrate: false
  };
  const res = props.children;
  sharedConfig.context = context;
  return res;
}
function NoHydration(props) {
  sharedConfig.context.noHydrate = true;
  return props.children;
}
function queue(fn) {
  return Promise.resolve().then(fn);
}
function injectAssets(assets, html) {
  if (!assets || !assets.length) return html;
  let out = "";
  for (let i = 0, len = assets.length; i < len; i++) out += assets[i]();
  return html.replace(`</head>`, out + `</head>`);
}
function injectScripts(html, scripts, nonce) {
  const tag = `<script${nonce ? ` nonce="${nonce}"` : ""}>${scripts}</script>`;
  const index = html.indexOf("<!--xs-->");
  if (index > -1) {
    return html.slice(0, index) + tag + html.slice(index);
  }
  return html + tag;
}
function waitForFragments(registry, key) {
  for (const k of [...registry.keys()].reverse()) {
    if (key.startsWith(k)) return true;
  }
  return false;
}
function replacePlaceholder(html, key, value) {
  const marker = `<template id="pl-${key}">`;
  const close = `<!--pl-${key}-->`;
  const first = html.indexOf(marker);
  if (first === -1) return html;
  const last = html.indexOf(close, first + marker.length);
  return html.slice(0, first) + value + html.slice(last + close.length);
}
const RequestContext = Symbol();
function getRequestEvent() {
  return globalThis[RequestContext] ? globalThis[RequestContext].getStore() : undefined;
}

const MetaContext = createContext();
const cascadingTags = ["title", "meta"];
// https://html.spec.whatwg.org/multipage/semantics.html#the-title-element
const titleTagProperties = [];
const metaTagProperties =
// https://html.spec.whatwg.org/multipage/semantics.html#the-meta-element
["name", "http-equiv", "content", "charset", "media"]
// additional properties
.concat(["property"]);
const getTagKey = (tag, properties) => {
  // pick allowed properties and sort them
  const tagProps = Object.fromEntries(Object.entries(tag.props).filter(([k]) => properties.includes(k)).sort());
  // treat `property` as `name` for meta tags
  if (Object.hasOwn(tagProps, "name") || Object.hasOwn(tagProps, "property")) {
    tagProps.name = tagProps.name || tagProps.property;
    delete tagProps.property;
  }
  // concat tag name and properties as unique key for this tag
  return tag.tag + JSON.stringify(tagProps);
};
function initServerProvider() {
  const tags = [];
  useAssets(() => ssr(renderTags(tags)));
  return {
    addTag(tagDesc) {
      // tweak only cascading tags
      if (cascadingTags.indexOf(tagDesc.tag) !== -1) {
        const properties = tagDesc.tag === "title" ? titleTagProperties : metaTagProperties;
        const tagDescKey = getTagKey(tagDesc, properties);
        const index = tags.findIndex(prev => prev.tag === tagDesc.tag && getTagKey(prev, properties) === tagDescKey);
        if (index !== -1) {
          tags.splice(index, 1);
        }
      }
      tags.push(tagDesc);
      return tags.length;
    },
    removeTag(tag, index) {}
  };
}
const MetaProvider = props => {
  let e;
  const actions = (e = getRequestEvent()) ? e.solidMeta || (e.solidMeta = initServerProvider()) : initServerProvider();
  return createComponent(MetaContext.Provider, {
    value: actions,
    get children() {
      return props.children;
    }
  });
};
const MetaTag = (tag, props, setting) => {
  useHead({
    tag,
    props,
    setting,
    id: createUniqueId(),
    get name() {
      return props.name || props.property;
    }
  });
  return null;
};
function useHead(tagDesc) {
  let c;
  {
    const event = getRequestEvent();
    c = event && event.solidMeta;
    // TODO: Consider if we want to support tags above MetaProvider
    // if (event) {
    //   c = event.solidMeta || (event.solidMeta = initServerProvider());
    // }
  }

  c = c || useContext(MetaContext);
  if (!c) throw new Error("<MetaProvider /> should be in the tree");
  createRenderEffect(() => {
    const index = c.addTag(tagDesc);
    onCleanup(() => c.removeTag(tagDesc, index));
  });
}
function renderTags(tags) {
  return tags.map(tag => {
    const keys = Object.keys(tag.props);
    const props = keys.map(k => k === "children" ? "" : ` ${k}="${
    // @ts-expect-error
    escape(tag.props[k], true)}"`).join("");
    const children = tag.props.children;
    if (tag.setting?.close) {
      return `<${tag.tag} data-sm="${tag.id}"${props}>${
      // @ts-expect-error
      tag.setting?.escape ? escape(children) : children || ""}</${tag.tag}>`;
    }
    return `<${tag.tag} data-sm="${tag.id}"${props}/>`;
  }).join("");
}
const Title = props => MetaTag("title", props, {
  escape: true,
  close: true
});
const Meta = props => MetaTag("meta", props);
function normalizeIntegration(integration) {
    if (!integration) {
        return {
            signal: createSignal({ value: "" })
        };
    }
    else if (Array.isArray(integration)) {
        return {
            signal: integration
        };
    }
    return integration;
}
function staticIntegration(obj) {
    return {
        signal: [() => obj, next => Object.assign(obj, next)]
    };
}

function createBeforeLeave() {
    let listeners = new Set();
    function subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }
    let ignore = false;
    function confirm(to, options) {
        if (ignore)
            return !(ignore = false);
        const e = {
            to,
            options,
            defaultPrevented: false,
            preventDefault: () => (e.defaultPrevented = true)
        };
        for (const l of listeners)
            l.listener({
                ...e,
                from: l.location,
                retry: (force) => {
                    force && (ignore = true);
                    l.navigate(to, options);
                }
            });
        return !e.defaultPrevented;
    }
    return {
        subscribe,
        confirm
    };
}

const hasSchemeRegex = /^(?:[a-z0-9]+:)?\/\//i;
const trimPathRegex$1 = /^\/+|(\/)\/+$/g;
function normalizePath(path, omitSlash = false) {
    const s = path.replace(trimPathRegex$1, "$1");
    return s ? (omitSlash || /^[?#]/.test(s) ? s : "/" + s) : "";
}
function resolvePath(base, path, from) {
    if (hasSchemeRegex.test(path)) {
        return undefined;
    }
    const basePath = normalizePath(base);
    const fromPath = from && normalizePath(from);
    let result = "";
    if (!fromPath || path.startsWith("/")) {
        result = basePath;
    }
    else if (fromPath.toLowerCase().indexOf(basePath.toLowerCase()) !== 0) {
        result = basePath + fromPath;
    }
    else {
        result = fromPath;
    }
    return (result || "/") + normalizePath(path, !result);
}
function invariant(value, message) {
    if (value == null) {
        throw new Error(message);
    }
    return value;
}
function joinPaths$1(from, to) {
    return normalizePath(from).replace(/\/*(\*.*)?$/g, "") + normalizePath(to);
}
function extractSearchParams(url) {
    const params = {};
    url.searchParams.forEach((value, key) => {
        params[key] = value;
    });
    return params;
}
function createMatcher(path, partial, matchFilters) {
    const [pattern, splat] = path.split("/*", 2);
    const segments = pattern.split("/").filter(Boolean);
    const len = segments.length;
    return (location) => {
        const locSegments = location.split("/").filter(Boolean);
        const lenDiff = locSegments.length - len;
        if (lenDiff < 0 || (lenDiff > 0 && splat === undefined && !partial)) {
            return null;
        }
        const match = {
            path: len ? "" : "/",
            params: {}
        };
        const matchFilter = (s) => matchFilters === undefined ? undefined : matchFilters[s];
        for (let i = 0; i < len; i++) {
            const segment = segments[i];
            const locSegment = locSegments[i];
            const dynamic = segment[0] === ":";
            const key = dynamic ? segment.slice(1) : segment;
            if (dynamic && matchSegment(locSegment, matchFilter(key))) {
                match.params[key] = locSegment;
            }
            else if (dynamic || !matchSegment(locSegment, segment)) {
                return null;
            }
            match.path += `/${locSegment}`;
        }
        if (splat) {
            const remainder = lenDiff ? locSegments.slice(-lenDiff).join("/") : "";
            if (matchSegment(remainder, matchFilter(splat))) {
                match.params[splat] = remainder;
            }
            else {
                return null;
            }
        }
        return match;
    };
}
function matchSegment(input, filter) {
    const isEqual = (s) => s.localeCompare(input, undefined, { sensitivity: "base" }) === 0;
    if (filter === undefined) {
        return true;
    }
    else if (typeof filter === "string") {
        return isEqual(filter);
    }
    else if (typeof filter === "function") {
        return filter(input);
    }
    else if (Array.isArray(filter)) {
        return filter.some(isEqual);
    }
    else if (filter instanceof RegExp) {
        return filter.test(input);
    }
    return false;
}
function scoreRoute$1(route) {
    const [pattern, splat] = route.pattern.split("/*", 2);
    const segments = pattern.split("/").filter(Boolean);
    return segments.reduce((score, segment) => score + (segment.startsWith(":") ? 2 : 3), segments.length - (splat === undefined ? 0 : 1));
}
function createMemoObject(fn) {
    const map = new Map();
    const owner = getOwner();
    return new Proxy({}, {
        get(_, property) {
            if (!map.has(property)) {
                runWithOwner(owner, () => map.set(property, createMemo(() => fn()[property])));
            }
            return map.get(property)();
        },
        getOwnPropertyDescriptor() {
            return {
                enumerable: true,
                configurable: true
            };
        },
        ownKeys() {
            return Reflect.ownKeys(fn());
        }
    });
}
function expandOptionals$1(pattern) {
    let match = /(\/?\:[^\/]+)\?/.exec(pattern);
    if (!match)
        return [pattern];
    let prefix = pattern.slice(0, match.index);
    let suffix = pattern.slice(match.index + match[0].length);
    const prefixes = [prefix, (prefix += match[1])];
    // This section handles adjacent optional params. We don't actually want all permuations since
    // that will lead to equivalent routes which have the same number of params. For example
    // `/:a?/:b?/:c`? only has the unique expansion: `/`, `/:a`, `/:a/:b`, `/:a/:b/:c` and we can
    // discard `/:b`, `/:c`, `/:b/:c` by building them up in order and not recursing. This also helps
    // ensure predictability where earlier params have precidence.
    while ((match = /^(\/\:[^\/]+)\?/.exec(suffix))) {
        prefixes.push((prefix += match[1]));
        suffix = suffix.slice(match[0].length);
    }
    return expandOptionals$1(suffix).reduce((results, expansion) => [...results, ...prefixes.map(p => p + expansion)], []);
}

const MAX_REDIRECTS = 100;
const RouterContextObj = createContext();
const RouteContextObj = createContext();
const useRouter$1 = () => invariant(useContext(RouterContextObj), "Make sure your app is wrapped in a <Router />");
let TempRoute;
const useRoute = () => TempRoute || useContext(RouteContextObj) || useRouter$1().base;
const useLocation$1 = () => useRouter$1().location;
function createRoutes(routeDef, base = "", fallback) {
    const { component, data, children } = routeDef;
    const isLeaf = !children || (Array.isArray(children) && !children.length);
    const shared = {
        key: routeDef,
        element: component
            ? () => createComponent(component, {})
            : () => {
                const { element } = routeDef;
                return element === undefined && fallback
                    ? createComponent(fallback, {})
                    : element;
            },
        preload: routeDef.component
            ? component.preload
            : routeDef.preload,
        data
    };
    return asArray(routeDef.path).reduce((acc, path) => {
        for (const originalPath of expandOptionals$1(path)) {
            const path = joinPaths$1(base, originalPath);
            const pattern = isLeaf ? path : path.split("/*", 1)[0];
            acc.push({
                ...shared,
                originalPath,
                pattern,
                matcher: createMatcher(pattern, !isLeaf, routeDef.matchFilters)
            });
        }
        return acc;
    }, []);
}
function createBranch(routes, index = 0) {
    return {
        routes,
        score: scoreRoute$1(routes[routes.length - 1]) * 10000 - index,
        matcher(location) {
            const matches = [];
            for (let i = routes.length - 1; i >= 0; i--) {
                const route = routes[i];
                const match = route.matcher(location);
                if (!match) {
                    return null;
                }
                matches.unshift({
                    ...match,
                    route
                });
            }
            return matches;
        }
    };
}
function asArray(value) {
    return Array.isArray(value) ? value : [value];
}
function createBranches(routeDef, base = "", fallback, stack = [], branches = []) {
    const routeDefs = asArray(routeDef);
    for (let i = 0, len = routeDefs.length; i < len; i++) {
        const def = routeDefs[i];
        if (def && typeof def === "object" && def.hasOwnProperty("path")) {
            const routes = createRoutes(def, base, fallback);
            for (const route of routes) {
                stack.push(route);
                const isEmptyArray = Array.isArray(def.children) && def.children.length === 0;
                if (def.children && !isEmptyArray) {
                    createBranches(def.children, route.pattern, fallback, stack, branches);
                }
                else {
                    const branch = createBranch([...stack], branches.length);
                    branches.push(branch);
                }
                stack.pop();
            }
        }
    }
    // Stack will be empty on final return
    return stack.length ? branches : branches.sort((a, b) => b.score - a.score);
}
function getRouteMatches$1(branches, location) {
    for (let i = 0, len = branches.length; i < len; i++) {
        const match = branches[i].matcher(location);
        if (match) {
            return match;
        }
    }
    return [];
}
function createLocation(path, state) {
    const origin = new URL("http://sar");
    const url = createMemo(prev => {
        const path_ = path();
        try {
            return new URL(path_, origin);
        }
        catch (err) {
            console.error(`Invalid path ${path_}`);
            return prev;
        }
    }, origin);
    const pathname = createMemo(() => url().pathname);
    const search = createMemo(() => url().search, true);
    const hash = createMemo(() => url().hash);
    const key = createMemo(() => "");
    return {
        get pathname() {
            return pathname();
        },
        get search() {
            return search();
        },
        get hash() {
            return hash();
        },
        get state() {
            return state();
        },
        get key() {
            return key();
        },
        query: createMemoObject(on(search, () => extractSearchParams(url())))
    };
}
function createRouterContext(integration, base = "", data, out) {
    const { signal: [source, setSource], utils = {} } = normalizeIntegration(integration);
    const parsePath = utils.parsePath || (p => p);
    const renderPath = utils.renderPath || (p => p);
    const beforeLeave = utils.beforeLeave || createBeforeLeave();
    const basePath = resolvePath("", base);
    const output = out
        ? Object.assign(out, {
            matches: [],
            url: undefined
        })
        : undefined;
    if (basePath === undefined) {
        throw new Error(`${basePath} is not a valid base path`);
    }
    else if (basePath && !source().value) {
        setSource({ value: basePath, replace: true, scroll: false });
    }
    const [isRouting, setIsRouting] = createSignal(false);
    const start = async (callback) => {
        setIsRouting(true);
        try {
            await startTransition(callback);
        }
        finally {
            setIsRouting(false);
        }
    };
    const [reference, setReference] = createSignal(source().value);
    const [state, setState] = createSignal(source().state);
    const location = createLocation(reference, state);
    const referrers = [];
    const baseRoute = {
        pattern: basePath,
        params: {},
        path: () => basePath,
        outlet: () => null,
        resolvePath(to) {
            return resolvePath(basePath, to);
        }
    };
    if (data) {
        try {
            TempRoute = baseRoute;
            baseRoute.data = data({
                data: undefined,
                params: {},
                location,
                navigate: navigatorFactory(baseRoute)
            });
        }
        finally {
            TempRoute = undefined;
        }
    }
    function navigateFromRoute(route, to, options) {
        // Untrack in case someone navigates in an effect - don't want to track `reference` or route paths
        untrack(() => {
            if (typeof to === "number") {
                if (!to) ;
                else if (utils.go) {
                    beforeLeave.confirm(to, options) && utils.go(to);
                }
                else {
                    console.warn("Router integration does not support relative routing");
                }
                return;
            }
            const { replace, resolve, scroll, state: nextState } = {
                replace: false,
                resolve: true,
                scroll: true,
                ...options
            };
            const resolvedTo = resolve ? route.resolvePath(to) : resolvePath("", to);
            if (resolvedTo === undefined) {
                throw new Error(`Path '${to}' is not a routable path`);
            }
            else if (referrers.length >= MAX_REDIRECTS) {
                throw new Error("Too many redirects");
            }
            const current = reference();
            if (resolvedTo !== current || nextState !== state()) {
                {
                    if (output) {
                        output.url = resolvedTo;
                    }
                    setSource({ value: resolvedTo, replace, scroll, state: nextState });
                }
            }
        });
    }
    function navigatorFactory(route) {
        // Workaround for vite issue (https://github.com/vitejs/vite/issues/3803)
        route = route || useContext(RouteContextObj) || baseRoute;
        return (to, options) => navigateFromRoute(route, to, options);
    }
    createRenderEffect(() => {
        const { value, state } = source();
        // Untrack this whole block so `start` doesn't cause Solid's Listener to be preserved
        untrack(() => {
            if (value !== reference()) {
                start(() => {
                    setReference(value);
                    setState(state);
                });
            }
        });
    });
    return {
        base: baseRoute,
        out: output,
        location,
        isRouting,
        renderPath,
        parsePath,
        navigatorFactory,
        beforeLeave
    };
}
function createRouteContext(router, parent, child, match, params) {
    const { base, location, navigatorFactory } = router;
    const { pattern, element: outlet, preload, data } = match().route;
    const path = createMemo(() => match().path);
    preload && preload();
    const route = {
        parent,
        pattern,
        get child() {
            return child();
        },
        path,
        params,
        data: parent.data,
        outlet,
        resolvePath(to) {
            return resolvePath(base.path(), to, path());
        }
    };
    if (data) {
        try {
            TempRoute = route;
            route.data = data({ data: parent.data, params, location, navigate: navigatorFactory(route) });
        }
        finally {
            TempRoute = undefined;
        }
    }
    return route;
}

const Router$1 = props => {
  const {
    source,
    url,
    base,
    data,
    out
  } = props;
  const integration = source || (staticIntegration({
    value: url || ""
  }) );
  const routerState = createRouterContext(integration, base, data, out);
  return createComponent(RouterContextObj.Provider, {
    value: routerState,
    get children() {
      return props.children;
    }
  });
};
const Routes$1 = props => {
  const router = useRouter$1();
  const parentRoute = useRoute();
  const routeDefs = children(() => props.children);
  const branches = createMemo(() => createBranches(routeDefs(), joinPaths$1(parentRoute.pattern, props.base || ""), Outlet$1));
  const matches = createMemo(() => getRouteMatches$1(branches(), router.location.pathname));
  const params = createMemoObject(() => {
    const m = matches();
    const params = {};
    for (let i = 0; i < m.length; i++) {
      Object.assign(params, m[i].params);
    }
    return params;
  });
  if (router.out) {
    router.out.matches.push(matches().map(({
      route,
      path,
      params
    }) => ({
      originalPath: route.originalPath,
      pattern: route.pattern,
      path,
      params
    })));
  }
  const disposers = [];
  let root;
  const routeStates = createMemo(on(matches, (nextMatches, prevMatches, prev) => {
    let equal = prevMatches && nextMatches.length === prevMatches.length;
    const next = [];
    for (let i = 0, len = nextMatches.length; i < len; i++) {
      const prevMatch = prevMatches && prevMatches[i];
      const nextMatch = nextMatches[i];
      if (prev && prevMatch && nextMatch.route.key === prevMatch.route.key) {
        next[i] = prev[i];
      } else {
        equal = false;
        if (disposers[i]) {
          disposers[i]();
        }
        createRoot(dispose => {
          disposers[i] = dispose;
          next[i] = createRouteContext(router, next[i - 1] || parentRoute, () => routeStates()[i + 1], () => matches()[i], params);
        });
      }
    }
    disposers.splice(nextMatches.length).forEach(dispose => dispose());
    if (prev && equal) {
      return prev;
    }
    root = next[0];
    return next;
  }));
  return createComponent(Show, {
    get when() {
      return routeStates() && root;
    },
    keyed: true,
    children: route => createComponent(RouteContextObj.Provider, {
      value: route,
      get children() {
        return route.outlet();
      }
    })
  });
};
const Outlet$1 = () => {
  const route = useRoute();
  return createComponent(Show, {
    get when() {
      return route.child;
    },
    keyed: true,
    children: child => createComponent(RouteContextObj.Provider, {
      value: child,
      get children() {
        return child.outlet();
      }
    })
  });
};

const FETCH_EVENT = "$FETCH";

const ServerContext = /*#__PURE__*/createContext({
  $type: FETCH_EVENT
});
const useRequest = () => {
  return useContext(ServerContext);
};

// @ts-nocheck
function trueFn() {
  return true;
}
const propTraps = {
  get(_, property, receiver) {
    if (property === $PROXY) return receiver;
    return _.get(property);
  },
  has(_, property) {
    return _.has(property);
  },
  set: trueFn,
  deleteProperty: trueFn,
  getOwnPropertyDescriptor(_, property) {
    return {
      configurable: true,
      enumerable: true,
      get() {
        return _.get(property);
      },
      set: trueFn,
      deleteProperty: trueFn
    };
  },
  ownKeys(_) {
    return _.keys();
  }
};
function splitProps(props, ...keys) {
  const blocked = new Set(keys.flat());
  const descriptors = Object.getOwnPropertyDescriptors(props);
  const isProxy = ($PROXY in props);
  if (!isProxy) keys.push(Object.keys(descriptors).filter(k => !blocked.has(k)));
  const res = keys.map(k => {
    const clone = {};
    for (let i = 0; i < k.length; i++) {
      const key = k[i];
      let cache;
      Object.defineProperty(clone, key, {
        enumerable: descriptors[key]?.enumerable ?? false,
        configurable: true,
        get() {
          if (cache) {
            return cache;
          }
          let val = props[key];
          if (val?.t) {
            val.t = `<solid-children>${val.t}</solid-children>`;
          }
          cache = val;
          return val;
        },
        set() {
          return true;
        }
      });
    }
    return clone;
  });
  if (isProxy) {
    res.push(new Proxy({
      get(property) {
        return blocked.has(property) ? undefined : props[property];
      },
      has(property) {
        return blocked.has(property) ? false : property in props;
      },
      keys() {
        return Object.keys(props).filter(k => !blocked.has(k));
      }
    }, propTraps));
  }
  return res;
}

function island(Comp, path) {
  let Component = Comp;
  function IslandComponent(props) {
    return createComponent(Component, mergeProps(props, {
      get children() {
        return createComponent(NoHydration, {
          get children() {
            return props.children;
          }
        });
      }
    }));
  }
  return compProps => {
    {
      const context = useRequest();
      const [, props] = splitProps(compProps, ["children"]);
      const [, spreadProps] = splitProps(compProps, []);
      let fpath;
      let styles = [];
      {
        let x = context.env.manifest?.[path];
        context.$islands.add(path);
        if (x) {
          fpath = x.script.href;
          styles = x.assets.filter(v => v.type == "style").map(v => v.href);
        }
      }
      const serialize = props => {
        let offset = 0;
        let el = JSON.stringify(props, (key, value) => {
          if (value && value.t) {
            offset++;
            return undefined;
          }
          return value;
        });
        return {
          "data-props": el,
          "data-offset": offset
        };
      };

      // @ts-expect-error
      if (!sharedConfig.context?.noHydrate) {
        return createComponent(Component, compProps);
      }
      return createComponent(Hydration, {
        get children() {
          return ssrElement("solid-island", mergeProps({
            "data-component": fpath,
            "data-island": path,
            get ["data-when"]() {
              return props["client:idle"] ? "idle" : "load";
            },
            get ["data-css"]() {
              return JSON.stringify(styles);
            }
          }, () => serialize(props)), () => escape(createComponent(IslandComponent, spreadProps)), true);
        }
      });
    }
  };
}

const useLocation = useLocation$1;

function IslandsA$1(props) {
  const [, rest] = splitProps$1(props, ["state", "activeClass", "inactiveClass", "end"]);
  const location = useLocation();
  const isActive = () => {
    return props.href.startsWith("#") ? location.hash === props.href : location.pathname === props.href;
  };
  return ssrElement("a", mergeProps({
    link: true
  }, rest, {
    get state() {
      return JSON.stringify(props.state);
    },
    get classList() {
      return {
        [props.inactiveClass || "inactive"]: !isActive(),
        [props.activeClass || "active"]: isActive(),
        ...rest.classList
      };
    },
    get ["aria-current"]() {
      return isActive() ? "page" : undefined;
    }
  }), () => escape(rest.children), true);
}

const IslandsA = island(IslandsA$1, "node_modules/solid-start/islands/A.tsx?island");

// @ts-expect-error
const routeLayouts = {
  "/*404": {
    "id": "/*404",
    "layouts": []
  },
  "/about": {
    "id": "/about",
    "layouts": []
  },
  "/": {
    "id": "/",
    "layouts": []
  }
};
var layouts = routeLayouts;

function flattenIslands(match, manifest, islands) {
  let result = [...match];
  match.forEach(m => {
    if (m.type !== "island") return;
    const islandManifest = manifest[m.href];
    if (islandManifest) {
      //&& (!islands || islands.has(m.href))
      const res = flattenIslands(islandManifest.assets, manifest);
      result.push(...res);
    }
  });
  return result;
}
function getAssetsFromManifest(event, matches) {
  let match = matches.reduce((memo, m) => {
    if (m.length) {
      const fullPath = m.reduce((previous, match) => previous + match.originalPath, "");
      const route = layouts[fullPath];
      if (route) {
        memo.push(...(event.env.manifest?.[route.id]?.assets || []));
        const layoutsManifestEntries = route.layouts.flatMap(manifestKey => event.env.manifest?.[manifestKey]?.assets || []);
        memo.push(...layoutsManifestEntries);
      }
    }
    return memo;
  }, []);
  match.push(...(event.env.manifest?.["entry-client"]?.assets || []));
  match = flattenIslands(match, event.env.manifest, event.$islands);
  return match;
}

const trimPathRegex =  /^\/+|\/+$|\s+/g;
function normalize(path) {
  const s = path.replace(trimPathRegex, "");
  return s ? s.startsWith("?") ? s : "/" + s : "";
}
function joinPaths(from, to) {
  return normalize(from).replace(/\/*(\*.*)?$/g, "") + normalize(to);
}
function matchPath(path, location, partial) {
  const [pattern, splat] = path.split("/*", 2);
  const segments = pattern.split("/").filter(Boolean);
  const len = segments.length;
  const {
    pathname
  } = new URL(location, "http://localhost");
  const locSegments = pathname.split("/").filter(Boolean);
  const lenDiff = locSegments.length - len;
  if (lenDiff < 0 || lenDiff > 0 && splat === undefined && !partial) {
    return null;
  }
  const match = {
    path: len ? "" : "/",
    params: {}
  };
  for (let i = 0; i < len; i++) {
    const segment = segments[i];
    const locSegment = locSegments[i];
    if (segment[0] === ":") {
      match.params[segment.slice(1)] = locSegment;
    } else if (segment.localeCompare(locSegment, undefined, {
      sensitivity: "base"
    }) !== 0) {
      return null;
    }
    match.path += `/${locSegment}`;
  }
  if (splat) {
    match.params[splat] = lenDiff ? locSegments.slice(-lenDiff).join("/") : "";
  }
  return match;
}
function scoreRoute(route) {
  const [pattern, splat] = route.pattern.split("/*", 2);
  const segments = pattern.split("/").filter(Boolean);
  return segments.reduce((score, segment) => score + (segment.startsWith(":") ? 2 : 3), segments.length - (splat === undefined ? 0 : 1));
}
function createMatchedRoute(routeDef, base, id, location) {
  if (!routeDef || typeof routeDef !== "object" || !routeDef.hasOwnProperty("path")) {
    return null;
  }
  const {
    path: originalPath,
    component = Outlet,
    children,
    data
  } = routeDef;
  const isLeaf = !children || !Array.isArray(children) || !children.length;
  const path = joinPaths(base, originalPath);
  const pattern = isLeaf ? path : path.split("/*", 1)[0];
  const match = matchPath(pattern, location, !isLeaf);
  if (!match) {
    return null;
  }
  return {
    id,
    originalPath,
    pattern,
    component,
    children,
    data,
    match,
    shared: false
  };
}
function getMatchedBranch(routeDef, location, stack = [], branches = []) {
  const routeDefs = Array.isArray(routeDef) ? routeDef : [routeDef];
  for (let i = 0, len = routeDefs.length; i < len; i++) {
    const def = routeDefs[i];
    const parent = stack[stack.length - 1];
    const route = createMatchedRoute(def, parent ? parent.pattern : "/", parent ? `${parent.id}.${i}` : "" + i, location);
    if (route) {
      stack.push(route);
      if (def.children) {
        getMatchedBranch(def.children, location, stack, branches);
      } else {
        const score = scoreRoute(route);
        if (!branches.length || score > branches[0].score) {
          branches[0] = {
            routes: [...stack],
            score
          };
        }
      }
      stack.pop();
    }
  }
  return branches[0] || null;
}
const RouterContext = /*#__PURE__*/createContext();
const useRouter = () => useContext(RouterContext);
const OutletContext = /*#__PURE__*/createContext();
const useOutlet = () => useContext(OutletContext);
function Router(props) {
  const context = useRequest();
  const next = getMatchedBranch(props.routes, props.location);
  if (!next || !next.routes.length) {
    return [];
  }
  const nextRoutes = next.routes;
  const prev = !context.mutation && props.prevLocation ? getMatchedBranch(props.routes, props.prevLocation) : null;
  if (prev) {
    const prevRoutes = prev.routes;
    {
      let nextAssets = getAssetsFromManifest(context, [nextRoutes.map(r => ({
        ...r,
        ...r.match
      }))]);
      let prevAssets = getAssetsFromManifest(context, [prevRoutes.map(r => ({
        ...r,
        ...r.match
      }))]);
      const set = new Set();
      prevAssets.forEach(a => {
        set.add(a.href);
      });
      let assetsToAdd = [];
      let assetsToRemove = {};
      nextAssets.forEach(a => {
        if (!set.has(a.href) && (a.type === "script" || a.type === "style")) {
          assetsToRemove[a.href] = [a.type, a.href];
        } else {
          set.delete(a.href);
        }
      });
      [...set.entries()].forEach(a => {
        let prev = prevAssets.find(p => p.href === a[1]);
        if (prev) {
          assetsToAdd.push([prev.type, prev.href]);
        }
      });
      props.out.assets = [Object.values(assetsToRemove), assetsToAdd];
    }
    for (let i = 0, len = nextRoutes.length; i < len; i++) {
      const nextRoute = nextRoutes[i];
      const prevRoute = prevRoutes[i];
      if (prevRoute && nextRoute.id === prevRoute.id && nextRoute.match.path === prevRoute.match.path) {
        if (JSON.stringify(nextRoute.match.params) === JSON.stringify(prevRoute.match.params)) {
          props.out.replaceOutletId = `outlet-${prevRoute.id}`;
          props.out.newOutletId = `outlet-${nextRoute.id}`;
        } else {
          props.out.replaceOutletId = `outlet-${prevRoute.id}`;
          props.out.newOutletId = `outlet-${nextRoute.id}`;
          props.out.prevRoute = prevRoute;
          props.out.nextRoute = nextRoute;
        }
        // Routes are shared
      } else if (prevRoute && nextRoute) {
        props.out.replaceOutletId = `outlet-${prevRoute.id}`;
        props.out.prevRoute = prevRoute;
        props.out.newOutletId = `outlet-${nextRoute.id}`;
        props.out.nextRoute = nextRoute;
      }
    }
  }
  const state = {
    routes: nextRoutes,
    location: props.location,
    out: props.out
  };

  // if (props.out.prevRoute) {
  //   props.out.partial = true;
  //   return (
  //     <RouterContext.Provider value={state}>
  //       <OutletContext.Provider
  //         value={{ depth: nextRoutes.indexOf(props.out.nextRoute) + 1, route: props.out.nextRoute }}
  //       >
  //         <NoHydration>
  //           <Suspense>
  //             <Routes>
  //               <Route
  //                 path={props.out.nextRoute.pattern}
  //                 component={props.out.nextRoute.component}
  //                 data={props.out.nextRoute.data}
  //                 children={props.out.nextRoute.children}
  //               />
  //             </Routes>
  //           </Suspense>
  //         </NoHydration>
  //       </OutletContext.Provider>
  //     </RouterContext.Provider>
  //   );
  // }

  return createComponent(RouterContext.Provider, {
    value: state,
    get children() {
      return props.children;
    }
  });
}
function Outlet(props) {
  const router = useRouter();
  const parent = useOutlet();
  const depth = parent ? parent.depth : 0;
  const state = {
    depth: depth + 1,
    route: router.routes[depth]
  };
  return [ssr(`<!--outlet-${state.route.id}--><outlet-wrapper id="outlet-${state.route.id}">`), createComponent(OutletContext.Provider, {
    value: state,
    get children() {
      return props.children;
    }
  }), ssr(`</outlet-wrapper><!--outlet-${state.route.id}-->`)];
}

const A = IslandsA ;
const Routes = function IslandsRoutes(props) {
  return createComponent(Outlet, {
    get children() {
      return createComponent(Routes$1, {
        get children() {
          return props.children;
        }
      });
    }
  });
} ;

const XSolidStartLocationHeader = "x-solidstart-location";
const LocationHeader = "Location";
const ContentTypeHeader = "content-type";
const XSolidStartResponseTypeHeader = "x-solidstart-response-type";
const XSolidStartContentTypeHeader = "x-solidstart-content-type";
const XSolidStartOrigin = "x-solidstart-origin";
const JSONResponseType = "application/json";
function redirect(url, init = 302) {
  let responseInit = init;
  if (typeof responseInit === "number") {
    responseInit = { status: responseInit };
  } else if (typeof responseInit.status === "undefined") {
    responseInit.status = 302;
  }
  if (url === "") {
    url = "/";
  }
  let headers = new Headers(responseInit.headers);
  headers.set(LocationHeader, url);
  const response = new Response(null, {
    ...responseInit,
    headers
  });
  return response;
}
const redirectStatusCodes = /* @__PURE__ */ new Set([204, 301, 302, 303, 307, 308]);
function isRedirectResponse(response) {
  return response && response instanceof Response && redirectStatusCodes.has(response.status);
}

class ServerError extends Error {
  constructor(message, {
    status,
    stack
  } = {}) {
    super(message);
    this.name = "ServerError";
    this.status = status || 400;
    if (stack) {
      this.stack = stack;
    }
  }
}
class FormError extends ServerError {
  constructor(message, {
    fieldErrors = {},
    form,
    fields,
    stack
  } = {}) {
    super(message, {
      stack
    });
    this.formError = message;
    this.name = "FormError";
    this.fields = fields || Object.fromEntries(typeof form !== "undefined" ? form.entries() : []) || {};
    this.fieldErrors = fieldErrors;
  }
}

const _tmpl$$7 = ["<div", " style=\"", "\"><div style=\"", "\"><p style=\"", "\" id=\"error-message\">", "</p><button id=\"reset-errors\" style=\"", "\">Clear errors and retry</button><pre style=\"", "\">", "</pre></div></div>"];
function ErrorBoundary(props) {
  return createComponent(ErrorBoundary$1, {
    fallback: (e, reset) => {
      return createComponent(Show, {
        get when() {
          return !props.fallback;
        },
        get fallback() {
          return props.fallback && props.fallback(e, reset);
        },
        get children() {
          return createComponent(ErrorMessage, {
            error: e
          });
        }
      });
    },
    get children() {
      return props.children;
    }
  });
}
function ErrorMessage(props) {
  console.log(props.error);
  return ssr(_tmpl$$7, ssrHydrationKey(), "padding:" + "16px", "background-color:" + "rgba(252, 165, 165)" + (";color:" + "rgb(153, 27, 27)") + (";border-radius:" + "5px") + (";overflow:" + "scroll") + (";padding:" + "16px") + (";margin-bottom:" + "8px"), "font-weight:" + "bold", escape(props.error.message), "color:" + "rgba(252, 165, 165)" + (";background-color:" + "rgb(153, 27, 27)") + (";border-radius:" + "5px") + (";padding:" + "4px 8px"), "margin-top:" + "8px" + (";width:" + "100%"), escape(props.error.stack));
}

const _tmpl$$6 = ["<link", " rel=\"stylesheet\"", ">"],
  _tmpl$2 = ["<link", " rel=\"modulepreload\"", ">"];

/**
 * Links are used to load assets for the server rendered HTML
 * @returns {JSXElement}
 */
function Links() {
  const context = useRequest();
  useAssets(() => {
    let match = getAssetsFromManifest(context, context.routerContext.matches);
    const links = match.reduce((r, src) => {
      let el = src.type === "style" ? ssr(_tmpl$$6, ssrHydrationKey(), ssrAttribute("href", escape(src.href, true), false)) : src.type === "script" ? ssr(_tmpl$2, ssrHydrationKey(), ssrAttribute("href", escape(src.href, true), false)) : undefined;
      if (el) r[src.href] = el;
      return r;
    }, {});
    return Object.values(links);
  });
  return null;
}

const _tmpl$$5 = ["<script", ">_$HY.islandMap = {};_$HY.island = (u, c) => _$HY.islandMap[u] = c;</script>"],
  _tmpl$3 = ["<script", " type=\"module\" async", "></script>"];
const isDev = "production" === "development";
function IslandsScript() {
  return ssr(_tmpl$$5, ssrHydrationKey());
}
function DevScripts() {
  return isDev ;
}
function ProdScripts() {
  const context = useRequest();
  return [createComponent(HydrationScript, {}), createComponent(NoHydration, {
    get children() {
      return [createComponent(IslandsScript, {}), (ssr(_tmpl$3, ssrHydrationKey(), ssrAttribute("src", escape(context.env.manifest?.["entry-client"].script.href, true), false)) )];
    }
  })];
}
function Scripts() {
  return [createComponent(DevScripts, {}), createComponent(ProdScripts, {})];
}

function Html(props) {
  {
    return NoHydration({
      get children() {
        return ssrElement("html", props, undefined, false);
      }
    });
  }
}
function Head(props) {
  {
    return ssrElement("head", props, () => [escape(props.children), createComponent(Links, {})], false);
  }
}
function Body(props) {
  {
    return ssrElement("body", props, () => escape(props.children) , false);
  }
}

const _tmpl$$4 = ["<main", " class=\"text-center mx-auto text-gray-700 p-4\"><h1 class=\"max-6-xs text-6xl text-sky-700 font-thin uppercase my-16\">Not Found</h1><p class=\"mt-8\">Visit <a href=\"https://solidjs.com\" target=\"_blank\" class=\"text-sky-600 hover:underline\">solidjs.com</a> to learn how to build Solid apps.</p><p class=\"my-4\"><!--$-->", "<!--/--> - <!--$-->", "<!--/--></p></main>"];
function NotFound() {
  return ssr(_tmpl$$4, ssrHydrationKey(), escape(createComponent(A, {
    href: "/",
    "class": "text-sky-600 hover:underline",
    children: "Home"
  })), escape(createComponent(A, {
    href: "/about",
    "class": "text-sky-600 hover:underline",
    children: "About Page"
  })));
}

const _tmpl$$3 = ["<button", " class=\"w-[200px] rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-[2rem] py-[1rem]\">Clicks: <!--$-->", "<!--/--></button>"];
function Counter$1() {
  const [count, setCount] = createSignal(0);
  return ssr(_tmpl$$3, ssrHydrationKey(), escape(count()));
}

const Counter = island(Counter$1, "src/components/Counter.tsx?island");

const _tmpl$$2 = ["<main", " class=\"text-center mx-auto text-gray-700 p-4\"><h1 class=\"max-6-xs text-6xl text-sky-700 font-thin uppercase my-16\">About Page</h1><!--$-->", "<!--/--><p class=\"mt-8\">Visit <a href=\"https://solidjs.com\" target=\"_blank\" class=\"text-sky-600 hover:underline\">solidjs.com</a> to learn how to build Solid apps.</p><p class=\"my-4\"><!--$-->", "<!--/--> - <span>About Page</span></p></main>"];
function About() {
  return ssr(_tmpl$$2, ssrHydrationKey(), escape(createComponent(Counter, {})), escape(createComponent(A, {
    href: "/",
    "class": "text-sky-600 hover:underline",
    children: "Home"
  })));
}

const _tmpl$$1 = ["<main", " class=\"text-center mx-auto text-gray-700 p-4\"><h1 class=\"max-6-xs text-6xl text-sky-700 font-thin uppercase my-16\">Hello world!</h1><!--$-->", "<!--/--><p class=\"mt-8\">Visit <a href=\"https://solidjs.com\" target=\"_blank\" class=\"text-sky-600 hover:underline\">solidjs.com</a> to learn how to build Solid apps.</p><p class=\"my-4\"><span>Home</span> - <!--$-->", "<!--/--> </p></main>"];
function Home() {
  return ssr(_tmpl$$1, ssrHydrationKey(), escape(createComponent(Counter, {})), escape(createComponent(A, {
    href: "/about",
    "class": "text-sky-600 hover:underline",
    children: "About Page"
  })));
}

/// <reference path="../server/types.tsx" />

const fileRoutes = [{
  component: NotFound,
  path: "/*404"
}, {
  component: About,
  path: "/about"
}, {
  component: Home,
  path: "/"
}];

/**
 * Routes are the file system based routes, used by Solid App Router to show the current page according to the URL.
 */

const FileRoutes = () => {
  return fileRoutes;
};

const _tmpl$ = ["<nav", " class=\"bg-sky-800\"><ul class=\"container flex items-center p-3 text-gray-200\"><li class=\"", "\">", "</li><li class=\"", "\">", "</li></ul></nav>"];
function Root() {
  const location = useLocation();
  const active = path => path == location.pathname ? "border-sky-600" : "border-transparent hover:border-sky-600";
  return createComponent(Html, {
    lang: "en",
    get children() {
      return [createComponent(Head, {
        get children() {
          return [createComponent(Title, {
            children: "SolidStart - With TailwindCSS"
          }), createComponent(Meta, {
            charset: "utf-8"
          }), createComponent(Meta, {
            name: "viewport",
            content: "width=device-width, initial-scale=1"
          })];
        }
      }), createComponent(Body, {
        get children() {
          return [createComponent(Suspense, {
            get children() {
              return createComponent(ErrorBoundary, {
                get children() {
                  return [ssr(_tmpl$, ssrHydrationKey(), `border-b-2 ${escape(active("/"), true)} mx-1.5 sm:mx-6`, escape(createComponent(A, {
                    href: "/",
                    children: "Home"
                  })), `border-b-2 ${escape(active("/about"), true)} mx-1.5 sm:mx-6`, escape(createComponent(A, {
                    href: "/about",
                    children: "About"
                  }))), createComponent(Routes, {
                    get children() {
                      return createComponent(FileRoutes, {});
                    }
                  })];
                }
              });
            }
          }), createComponent(Scripts, {})];
        }
      })];
    }
  });
}

const rootData = Object.values(/* #__PURE__ */ Object.assign({

}))[0];
const dataFn = rootData ? rootData.default : undefined;

/** Function responsible for listening for streamed [operations]{@link Operation}. */

/** Input parameters for to an Exchange factory function. */

/** Function responsible for receiving an observable [operation]{@link Operation} and returning a [result]{@link OperationResult}. */

/** This composes an array of Exchanges into a single ExchangeIO function */
const composeMiddleware = exchanges => ({
  forward
}) => exchanges.reduceRight((forward, exchange) => exchange({
  forward
}), forward);
function createHandler(...exchanges) {
  const exchange = composeMiddleware(exchanges);
  return async event => {
    return await exchange({
      forward: async op => {
        return new Response(null, {
          status: 404
        });
      }
    })(event);
  };
}
function StartRouter(props) {
  {
    return createComponent(Router$1, mergeProps(props, {
      get children() {
        return createComponent(Router, mergeProps(props, {
          get children() {
            return props.children;
          }
        }));
      }
    }));
  }
}
const docType = ssr("<!DOCTYPE html>");
function StartServer({
  event
}) {
  const parsed = new URL(event.request.url);
  const path = parsed.pathname + parsed.search;

  // @ts-ignore
  sharedConfig.context.requestContext = event;
  return createComponent(ServerContext.Provider, {
    value: event,
    get children() {
      return createComponent(MetaProvider, {
        get children() {
          return createComponent(StartRouter, {
            url: path,
            get out() {
              return event.routerContext;
            },
            location: path,
            get prevLocation() {
              return event.prevUrl;
            },
            data: dataFn,
            routes: fileRoutes,
            get children() {
              return [docType, createComponent(Root, {})];
            }
          });
        }
      });
    }
  });
}

function getRouteMatches(routes, path, method) {
  const segments = path.split("/").filter(Boolean);
  routeLoop:
    for (const route of routes) {
      const matchSegments = route.matchSegments;
      if (segments.length < matchSegments.length || !route.wildcard && segments.length > matchSegments.length) {
        continue;
      }
      for (let index = 0; index < matchSegments.length; index++) {
        const match = matchSegments[index];
        if (!match) {
          continue;
        }
        if (segments[index] !== match) {
          continue routeLoop;
        }
      }
      const handler = route[method];
      if (handler === "skip" || handler === void 0) {
        return;
      }
      const params = {};
      for (const { type, name, index } of route.params) {
        if (type === ":") {
          params[name] = segments[index];
        } else {
          params[name] = segments.slice(index).join("/");
        }
      }
      return { handler, params };
    }
}

let apiRoutes$1;
const registerApiRoutes = (routes) => {
  apiRoutes$1 = routes;
};
async function internalFetch(route, init, env = {}, locals = {}) {
  if (route.startsWith("http")) {
    return await fetch(route, init);
  }
  let url = new URL(route, "http://internal");
  const request = new Request(url.href, init);
  const handler = getRouteMatches(apiRoutes$1, url.pathname, request.method.toUpperCase());
  if (!handler) {
    throw new Error(`No handler found for ${request.method} ${request.url}`);
  }
  let apiEvent = Object.freeze({
    request,
    params: handler.params,
    clientAddress: "127.0.0.1",
    env,
    locals,
    $type: FETCH_EVENT,
    fetch: internalFetch
  });
  const response = await handler.handler(apiEvent);
  return response;
}

const api = [
  {
    GET: "skip",
    path: "/*404"
  },
  {
    GET: "skip",
    path: "/about"
  },
  {
    GET: "skip",
    path: "/"
  }
];
function expandOptionals(pattern) {
  let match = /(\/?\:[^\/]+)\?/.exec(pattern);
  if (!match)
    return [pattern];
  let prefix = pattern.slice(0, match.index);
  let suffix = pattern.slice(match.index + match[0].length);
  const prefixes = [prefix, prefix += match[1]];
  while (match = /^(\/\:[^\/]+)\?/.exec(suffix)) {
    prefixes.push(prefix += match[1]);
    suffix = suffix.slice(match[0].length);
  }
  return expandOptionals(suffix).reduce(
    (results, expansion) => [...results, ...prefixes.map((p) => p + expansion)],
    []
  );
}
function routeToMatchRoute(route) {
  const segments = route.path.split("/").filter(Boolean);
  const params = [];
  const matchSegments = [];
  let score = 0;
  let wildcard = false;
  for (const [index, segment] of segments.entries()) {
    if (segment[0] === ":") {
      const name = segment.slice(1);
      score += 3;
      params.push({
        type: ":",
        name,
        index
      });
      matchSegments.push(null);
    } else if (segment[0] === "*") {
      score -= 1;
      params.push({
        type: "*",
        name: segment.slice(1),
        index
      });
      wildcard = true;
    } else {
      score += 4;
      matchSegments.push(segment);
    }
  }
  return {
    ...route,
    score,
    params,
    matchSegments,
    wildcard
  };
}
const allRoutes = api.flatMap((route) => {
  const paths = expandOptionals(route.path);
  return paths.map((path) => ({ ...route, path }));
}).map(routeToMatchRoute).sort((a, b) => b.score - a.score);
registerApiRoutes(allRoutes);
function getApiHandler(url, method) {
  return getRouteMatches(allRoutes, url.pathname, method.toUpperCase());
}

const apiRoutes = ({ forward }) => {
  return async (event) => {
    let apiHandler = getApiHandler(new URL(event.request.url), event.request.method);
    if (apiHandler) {
      let apiEvent = Object.freeze({
        request: event.request,
        httpServer: event.httpServer,
        clientAddress: event.clientAddress,
        locals: event.locals,
        params: apiHandler.params,
        env: event.env,
        $type: FETCH_EVENT,
        fetch: event.fetch
      });
      try {
        return await apiHandler.handler(apiEvent);
      } catch (error) {
        if (error instanceof Response) {
          return error;
        }
        return new Response(
          JSON.stringify({
            error: error.message
          }),
          {
            headers: {
              "Content-Type": "application/json"
            },
            status: 500
          }
        );
      }
    }
    return await forward(event);
  };
};

const server$ = (_fn) => {
  throw new Error("Should be compiled away");
};
async function parseRequest(event) {
  let request = event.request;
  let contentType = request.headers.get(ContentTypeHeader);
  let name = new URL(request.url).pathname, args = [];
  if (contentType) {
    if (contentType === JSONResponseType) {
      let text = await request.text();
      try {
        args = JSON.parse(
          text,
          (key, value) => {
            if (!value) {
              return value;
            }
            if (value.$type === "fetch_event") {
              return event;
            }
            return value;
          }
        );
      } catch (e) {
        throw new Error(`Error parsing request body: ${text}`);
      }
    } else if (contentType.includes("form")) {
      let formData = await request.clone().formData();
      args = [formData, event];
    }
  }
  return [name, args];
}
function respondWith(request, data, responseType) {
  if (data instanceof Response) {
    if (isRedirectResponse(data) && request.headers.get(XSolidStartOrigin) === "client") {
      let headers = new Headers(data.headers);
      headers.set(XSolidStartOrigin, "server");
      headers.set(XSolidStartLocationHeader, data.headers.get(LocationHeader) ?? "/");
      headers.set(XSolidStartResponseTypeHeader, responseType);
      headers.set(XSolidStartContentTypeHeader, "response");
      return new Response(null, {
        status: 204,
        statusText: "Redirected",
        headers
      });
    } else if (data.status === 101) {
      return data;
    } else {
      let headers = new Headers(data.headers);
      headers.set(XSolidStartOrigin, "server");
      headers.set(XSolidStartResponseTypeHeader, responseType);
      headers.set(XSolidStartContentTypeHeader, "response");
      return new Response(data.body, {
        status: data.status,
        statusText: data.statusText,
        headers
      });
    }
  } else if (data instanceof FormError) {
    return new Response(
      JSON.stringify({
        error: {
          message: data.message,
          stack: "",
          formError: data.formError,
          fields: data.fields,
          fieldErrors: data.fieldErrors
        }
      }),
      {
        status: 400,
        headers: {
          [XSolidStartResponseTypeHeader]: responseType,
          [XSolidStartContentTypeHeader]: "form-error"
        }
      }
    );
  } else if (data instanceof ServerError) {
    return new Response(
      JSON.stringify({
        error: {
          message: data.message,
          stack: ""
        }
      }),
      {
        status: data.status,
        headers: {
          [XSolidStartResponseTypeHeader]: responseType,
          [XSolidStartContentTypeHeader]: "server-error"
        }
      }
    );
  } else if (data instanceof Error) {
    console.error(data);
    return new Response(
      JSON.stringify({
        error: {
          message: "Internal Server Error",
          stack: "",
          status: data.status
        }
      }),
      {
        status: data.status || 500,
        headers: {
          [XSolidStartResponseTypeHeader]: responseType,
          [XSolidStartContentTypeHeader]: "error"
        }
      }
    );
  } else if (typeof data === "object" || typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        [ContentTypeHeader]: "application/json",
        [XSolidStartResponseTypeHeader]: responseType,
        [XSolidStartContentTypeHeader]: "json"
      }
    });
  }
  return new Response("null", {
    status: 200,
    headers: {
      [ContentTypeHeader]: "application/json",
      [XSolidStartContentTypeHeader]: "json",
      [XSolidStartResponseTypeHeader]: responseType
    }
  });
}
async function handleServerRequest(event) {
  const url = new URL(event.request.url);
  if (server$.hasHandler(url.pathname)) {
    try {
      let [name, args] = await parseRequest(event);
      let handler = server$.getHandler(name);
      if (!handler) {
        throw {
          status: 404,
          message: "Handler Not Found for " + name
        };
      }
      const data = await handler.call(event, ...Array.isArray(args) ? args : [args]);
      return respondWith(event.request, data, "return");
    } catch (error) {
      return respondWith(event.request, error, "throw");
    }
  }
  return null;
}
const handlers = /* @__PURE__ */ new Map();
server$.createHandler = (_fn, hash, serverResource) => {
  let fn = function(...args) {
    let ctx;
    if (typeof this === "object") {
      ctx = this;
    } else if (sharedConfig.context && sharedConfig.context.requestContext) {
      ctx = sharedConfig.context.requestContext;
    } else {
      ctx = {
        request: new URL(hash, `http://localhost:${process.env.PORT ?? 3e3}`).href,
        responseHeaders: new Headers()
      };
    }
    const execute = async () => {
      try {
        return serverResource ? _fn.call(ctx, args[0], ctx) : _fn.call(ctx, ...args);
      } catch (e) {
        if (e instanceof Error && /[A-Za-z]+ is not defined/.test(e.message)) {
          const error = new Error(
            e.message + "\n You probably are using a variable defined in a closure in your server function."
          );
          error.stack = e.stack;
          throw error;
        }
        throw e;
      }
    };
    return execute();
  };
  fn.url = hash;
  fn.action = function(...args) {
    return fn.call(this, ...args);
  };
  return fn;
};
server$.registerHandler = function(route, handler) {
  handlers.set(route, handler);
};
server$.getHandler = function(route) {
  return handlers.get(route);
};
server$.hasHandler = function(route) {
  return handlers.has(route);
};
server$.fetch = internalFetch;

const inlineServerFunctions = ({ forward }) => {
  return async (event) => {
    const url = new URL(event.request.url);
    if (server$.hasHandler(url.pathname)) {
      let contentType = event.request.headers.get(ContentTypeHeader);
      let origin = event.request.headers.get(XSolidStartOrigin);
      let formRequestBody;
      if (contentType != null && contentType.includes("form") && !(origin != null && origin.includes("client"))) {
        let [read1, read2] = event.request.body.tee();
        formRequestBody = new Request(event.request.url, {
          body: read2,
          headers: event.request.headers,
          method: event.request.method,
          duplex: "half"
        });
        event.request = new Request(event.request.url, {
          body: read1,
          headers: event.request.headers,
          method: event.request.method,
          duplex: "half"
        });
      }
      let serverFunctionEvent = Object.freeze({
        request: event.request,
        clientAddress: event.clientAddress,
        locals: event.locals,
        fetch: event.fetch,
        $type: FETCH_EVENT,
        env: event.env
      });
      const serverResponse = await handleServerRequest(serverFunctionEvent);
      if (serverResponse) {
        let responseContentType = serverResponse.headers.get(XSolidStartContentTypeHeader);
        if (formRequestBody && responseContentType !== null && responseContentType.includes("error")) {
          const formData = await formRequestBody.formData();
          let entries = [...formData.entries()];
          return new Response(null, {
            status: 302,
            headers: {
              Location: new URL(event.request.headers.get("referer")).pathname + "?form=" + encodeURIComponent(
                JSON.stringify({
                  url: url.pathname,
                  entries,
                  ...await serverResponse.json()
                })
              )
            }
          });
        }
        if (serverResponse.status === 204) {
          return await event.fetch(serverResponse.headers.get("Location") ?? "", {
            method: "GET",
            headers: {
              "x-solid-referrer": event.request.headers.get("x-solid-referrer"),
              "x-solid-mutation": event.request.headers.get("x-solid-mutation")
            }
          });
        }
        return serverResponse;
      }
    }
    const response = await forward(event);
    return response;
  };
};

function renderStream$1(fn, baseOptions = {}) {
  return () => async (event) => {
    let pageEvent = createPageEvent(event);
    if (event.request.headers.get("x-solid-referrer")) {
      let markup = await renderToStringAsync(() => fn(pageEvent), baseOptions);
      if (pageEvent.routerContext && pageEvent.routerContext.url) {
        return redirect(pageEvent.routerContext.url, {
          headers: pageEvent.responseHeaders
        });
      }
      markup = handleIslandsRouting(pageEvent, markup);
      return new Response(markup, {
        status: pageEvent.getStatusCode(),
        headers: pageEvent.responseHeaders
      });
    }
    const options = { ...baseOptions };
    if (options.onCompleteAll) {
      const og = options.onCompleteAll;
      options.onCompleteAll = (options2) => {
        handleStreamingRedirect(pageEvent)(options2);
        og(options2);
      };
    } else
      options.onCompleteAll = handleStreamingRedirect(pageEvent);
    const { readable, writable } = new TransformStream();
    const stream = renderToStream(() => fn(pageEvent), options);
    if (pageEvent.routerContext && pageEvent.routerContext.url) {
      return redirect(pageEvent.routerContext.url, {
        headers: pageEvent.responseHeaders
      });
    }
    handleStreamingIslandsRouting(pageEvent, writable);
    stream.pipeTo(writable);
    return new Response(readable, {
      status: pageEvent.getStatusCode(),
      headers: pageEvent.responseHeaders
    });
  };
}
function handleStreamingIslandsRouting(pageEvent, writable) {
  if (pageEvent.routerContext && pageEvent.routerContext.replaceOutletId) {
    const writer = writable.getWriter();
    const encoder = new TextEncoder();
    writer.write(
      encoder.encode(
        `${pageEvent.routerContext.replaceOutletId}:${pageEvent.routerContext.newOutletId}=`
      )
    );
    writer.releaseLock();
    pageEvent.responseHeaders.set("Content-Type", "text/plain");
  }
}
function handleStreamingRedirect(context) {
  return ({ write }) => {
    if (context.routerContext && context.routerContext.url)
      write(`<script>window.location="${context.routerContext.url}"<\/script>`);
  };
}
function createPageEvent(event) {
  let responseHeaders = new Headers({
    "Content-Type": "text/html"
  });
  const prevPath = event.request.headers.get("x-solid-referrer");
  const mutation = event.request.headers.get("x-solid-mutation") === "true";
  let statusCode = 200;
  function setStatusCode(code) {
    statusCode = code;
  }
  function getStatusCode() {
    return statusCode;
  }
  const pageEvent = {
    request: event.request,
    prevUrl: prevPath || "",
    routerContext: {},
    mutation,
    tags: [],
    env: event.env,
    clientAddress: event.clientAddress,
    locals: event.locals,
    $type: FETCH_EVENT,
    responseHeaders,
    setStatusCode,
    getStatusCode,
    $islands: /* @__PURE__ */ new Set(),
    fetch: event.fetch
  };
  return pageEvent;
}
function handleIslandsRouting(pageEvent, markup) {
  if (pageEvent.mutation) {
    pageEvent.routerContext.replaceOutletId = "outlet-0";
    pageEvent.routerContext.newOutletId = "outlet-0";
  }
  if (pageEvent.routerContext?.replaceOutletId) {
    markup = `${pageEvent.routerContext.assets ? `assets=${JSON.stringify(pageEvent.routerContext.assets)};` : ``}${pageEvent.routerContext.replaceOutletId}:${pageEvent.routerContext.newOutletId}=${pageEvent.routerContext.partial ? markup : markup.slice(
      markup.indexOf(`<!--${pageEvent.routerContext.newOutletId}-->`) + `<!--${pageEvent.routerContext.newOutletId}-->`.length + `<outlet-wrapper id="${pageEvent.routerContext.newOutletId}">`.length,
      markup.lastIndexOf(`<!--${pageEvent.routerContext.newOutletId}-->`) - `</outlet-wrapper>`.length
    )}`;
    let url = new URL(pageEvent.request.url);
    pageEvent.responseHeaders.set("Content-Type", "text/solid-diff");
    pageEvent.responseHeaders.set("x-solid-location", url.pathname + url.search + url.hash);
  }
  if (pageEvent.mutation) {
    let url = new URL(pageEvent.request.url);
    pageEvent.responseHeaders.set("Content-Type", "text/solid-diff");
    pageEvent.responseHeaders.set("x-solid-location", url.pathname + url.search + url.hash);
  }
  return markup;
}

const renderStream = (fn, options) => composeMiddleware([apiRoutes, inlineServerFunctions, renderStream$1(fn, options)]);

const entryServer = createHandler(renderStream(event => createComponent(StartServer, {
  event: event
})));

const onRequestGet = async ({ request, next, env }) => {
  // Handle static assets
  if (/\.\w+$/.test(new URL(request.url).pathname)) {
    let resp = await next(request);
    if (resp.status === 200 || resp.status === 304) {
      return resp;
    }
  }

  const clientAddress = request.headers.get('cf-connecting-ip');

  env.manifest = manifest;
  env.next = next;
  env.getStaticHTML = async path => {
    return next();
  };

  function internalFetch(route, init = {}) {
    if (route.startsWith("http")) {
      return fetch(route, init);
    }

    let url = new URL(route, "http://internal");
    const request = new Request(url.href, init);
    return entryServer({
      request,
      clientAddress,
      locals: {},
      env,
      fetch: internalFetch
    });
  }
  return entryServer({
    request,
    clientAddress,
    locals: {},
    env,
    fetch: internalFetch
  });
};

const onRequestHead = async ({ request, next, env }) => {
  // Handle static assets
  if (/\.\w+$/.test(new URL(request.url).pathname)) {
    let resp = await next(request);
    if (resp.status === 200 || resp.status === 304) {
      return resp;
    }
  }

  env.manifest = manifest;
  env.next = next;
  env.getStaticHTML = async path => {
    return next();
  };
  return entryServer({
    request: request,
    env
  });
};

async function onRequestPost({ request, env }) {
  // Allow for POST /_m/33fbce88a9 server function
  env.manifest = manifest;
  return entryServer({
    request: request,
    env
  });
}

async function onRequestDelete({ request, env }) {
  // Allow for POST /_m/33fbce88a9 server function
  env.manifest = manifest;
  return entryServer({
    request: request,
    env
  });
}

async function onRequestPatch({ request, env }) {
  // Allow for POST /_m/33fbce88a9 server function
  env.manifest = manifest;
  return entryServer({
    request: request,
    env
  });
}

export { onRequestDelete, onRequestGet, onRequestHead, onRequestPatch, onRequestPost };
