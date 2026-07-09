import {
  __commonJS,
  __toESM
} from "./chunk-4VNS5WPM.js";

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/internal/constants.js
var require_constants = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/internal/constants.js"(exports, module) {
    "use strict";
    var SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER2 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
    9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
    var RELEASE_TYPES = [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ];
    module.exports = {
      MAX_LENGTH,
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_SAFE_INTEGER: MAX_SAFE_INTEGER2,
      RELEASE_TYPES,
      SEMVER_SPEC_VERSION,
      FLAG_INCLUDE_PRERELEASE: 1,
      FLAG_LOOSE: 2
    };
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/internal/debug.js
var require_debug = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/internal/debug.js"(exports, module) {
    "use strict";
    var debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
    };
    module.exports = debug;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/internal/re.js
var require_re = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/internal/re.js"(exports, module) {
    "use strict";
    var {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = require_constants();
    var debug = require_debug();
    exports = module.exports = {};
    var re = exports.re = [];
    var safeRe = exports.safeRe = [];
    var src = exports.src = [];
    var safeSrc = exports.safeSrc = [];
    var t = exports.t = {};
    var R = 0;
    var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    var safeRegexReplacements = [
      ["\\s", 1],
      ["\\d", MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
    ];
    var makeSafeRegex = (value) => {
      for (const [token, max] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
      }
      return value;
    };
    var createToken = (name, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index = R++;
      debug(name, index, value);
      t[name] = index;
      src[index] = value;
      safeSrc[index] = safe;
      re[index] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("COERCERTLFULL", src[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/internal/parse-options.js"(exports, module) {
    "use strict";
    var looseOption = Object.freeze({ loose: true });
    var emptyOpts = Object.freeze({});
    var parseOptions = (options) => {
      if (!options) {
        return emptyOpts;
      }
      if (typeof options !== "object") {
        return looseOption;
      }
      return options;
    };
    module.exports = parseOptions;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/internal/identifiers.js"(exports, module) {
    "use strict";
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = (a, b) => {
      if (typeof a === "number" && typeof b === "number") {
        return a === b ? 0 : a < b ? -1 : 1;
      }
      const anum = numeric.test(a);
      const bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    };
    var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
    module.exports = {
      compareIdentifiers,
      rcompareIdentifiers
    };
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/classes/semver.js
var require_semver = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/classes/semver.js"(exports, module) {
    "use strict";
    var debug = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER: MAX_SAFE_INTEGER2 } = require_constants();
    var { safeRe: re, t } = require_re();
    var parseOptions = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var isPrereleaseIdentifier = (prerelease, identifier) => {
      const identifiers = identifier.split(".");
      if (identifiers.length > prerelease.length) {
        return false;
      }
      for (let i = 0; i < identifiers.length; i++) {
        if (compareIdentifiers(prerelease[i], identifiers[i]) !== 0) {
          return false;
        }
      }
      return true;
    };
    var SemVer = class _SemVer {
      constructor(version, options) {
        options = parseOptions(options);
        if (version instanceof _SemVer) {
          if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
            return version;
          } else {
            version = version.version;
          }
        } else if (typeof version !== "string") {
          throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
        }
        if (version.length > MAX_LENGTH) {
          throw new TypeError(
            `version is longer than ${MAX_LENGTH} characters`
          );
        }
        debug("SemVer", version, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
          throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER2 || this.major < 0) {
          throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER2 || this.minor < 0) {
          throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER2 || this.patch < 0) {
          throw new TypeError("Invalid patch version");
        }
        if (!m[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m[4].split(".").map((id) => {
            if (/^[0-9]+$/.test(id)) {
              const num = +id;
              if (num >= 0 && num < MAX_SAFE_INTEGER2) {
                return num;
              }
            }
            return id;
          });
        }
        this.build = m[5] ? m[5].split(".") : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof _SemVer)) {
          if (typeof other === "string" && other === this.version) {
            return 0;
          }
          other = new _SemVer(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.major < other.major) {
          return -1;
        }
        if (this.major > other.major) {
          return 1;
        }
        if (this.minor < other.minor) {
          return -1;
        }
        if (this.minor > other.minor) {
          return 1;
        }
        if (this.patch < other.patch) {
          return -1;
        }
        if (this.patch > other.patch) {
          return 1;
        }
        return 0;
      }
      comparePre(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i = 0;
        do {
          const a = this.prerelease[i];
          const b = other.prerelease[i];
          debug("prerelease compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      compareBuild(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        let i = 0;
        do {
          const a = this.build[i];
          const b = other.build[i];
          debug("build compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      // preminor will bump the version up to the next minor release, and immediately
      // down to pre-release. premajor and prepatch work the same way.
      inc(release, identifier, identifierBase) {
        if (release.startsWith("pre")) {
          if (!identifier && identifierBase === false) {
            throw new Error("invalid increment argument: identifier is empty");
          }
          if (identifier) {
            const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
            if (!match || match[1] !== identifier) {
              throw new Error(`invalid identifier: ${identifier}`);
            }
          }
        }
        switch (release) {
          case "premajor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "preminor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "prepatch":
            this.prerelease.length = 0;
            this.inc("patch", identifier, identifierBase);
            this.inc("pre", identifier, identifierBase);
            break;
          // If the input is a non-prerelease version, this acts the same as
          // prepatch.
          case "prerelease":
            if (this.prerelease.length === 0) {
              this.inc("patch", identifier, identifierBase);
            }
            this.inc("pre", identifier, identifierBase);
            break;
          case "release":
            if (this.prerelease.length === 0) {
              throw new Error(`version ${this.raw} is not a prerelease`);
            }
            this.prerelease.length = 0;
            break;
          case "major":
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case "minor":
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case "patch":
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          // This probably shouldn't be used publicly.
          // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
          case "pre": {
            const base = Number(identifierBase) ? 1 : 0;
            if (this.prerelease.length === 0) {
              this.prerelease = [base];
            } else {
              let i = this.prerelease.length;
              while (--i >= 0) {
                if (typeof this.prerelease[i] === "number") {
                  this.prerelease[i]++;
                  i = -2;
                }
              }
              if (i === -1) {
                if (identifier === this.prerelease.join(".") && identifierBase === false) {
                  throw new Error("invalid increment argument: identifier already exists");
                }
                this.prerelease.push(base);
              }
            }
            if (identifier) {
              let prerelease = [identifier, base];
              if (identifierBase === false) {
                prerelease = [identifier];
              }
              if (isPrereleaseIdentifier(this.prerelease, identifier)) {
                const prereleaseBase = this.prerelease[identifier.split(".").length];
                if (isNaN(prereleaseBase)) {
                  this.prerelease = prerelease;
                }
              } else {
                this.prerelease = prerelease;
              }
            }
            break;
          }
          default:
            throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
          this.raw += `+${this.build.join(".")}`;
        }
        return this;
      }
    };
    module.exports = SemVer;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/parse.js
var require_parse = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/parse.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var parse2 = (version, options, throwErrors = false) => {
      if (version instanceof SemVer) {
        return version;
      }
      try {
        return new SemVer(version, options);
      } catch (er) {
        if (!throwErrors) {
          return null;
        }
        throw er;
      }
    };
    module.exports = parse2;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/valid.js
var require_valid = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/valid.js"(exports, module) {
    "use strict";
    var parse2 = require_parse();
    var valid2 = (version, options) => {
      const v = parse2(version, options);
      return v ? v.version : null;
    };
    module.exports = valid2;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/clean.js
var require_clean = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/clean.js"(exports, module) {
    "use strict";
    var parse2 = require_parse();
    var clean2 = (version, options) => {
      const s = parse2(version.trim().replace(/^[=v]+/, ""), options);
      return s ? s.version : null;
    };
    module.exports = clean2;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/inc.js
var require_inc = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/inc.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var inc = (version, release, options, identifier, identifierBase) => {
      if (typeof options === "string") {
        identifierBase = identifier;
        identifier = options;
        options = void 0;
      }
      try {
        return new SemVer(
          version instanceof SemVer ? version.version : version,
          options
        ).inc(release, identifier, identifierBase).version;
      } catch (er) {
        return null;
      }
    };
    module.exports = inc;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/diff.js
var require_diff = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/diff.js"(exports, module) {
    "use strict";
    var parse2 = require_parse();
    var diff = (version1, version2) => {
      const v1 = parse2(version1, null, true);
      const v2 = parse2(version2, null, true);
      const comparison = v1.compare(v2);
      if (comparison === 0) {
        return null;
      }
      const v1Higher = comparison > 0;
      const highVersion = v1Higher ? v1 : v2;
      const lowVersion = v1Higher ? v2 : v1;
      const highHasPre = !!highVersion.prerelease.length;
      const lowHasPre = !!lowVersion.prerelease.length;
      if (lowHasPre && !highHasPre) {
        if (!lowVersion.patch && !lowVersion.minor) {
          return "major";
        }
        if (lowVersion.compareMain(highVersion) === 0) {
          if (lowVersion.minor && !lowVersion.patch) {
            return "minor";
          }
          return "patch";
        }
      }
      const prefix = highHasPre ? "pre" : "";
      if (v1.major !== v2.major) {
        return prefix + "major";
      }
      if (v1.minor !== v2.minor) {
        return prefix + "minor";
      }
      if (v1.patch !== v2.patch) {
        return prefix + "patch";
      }
      return "prerelease";
    };
    module.exports = diff;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/major.js
var require_major = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/major.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var major = (a, loose) => new SemVer(a, loose).major;
    module.exports = major;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/minor.js
var require_minor = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/minor.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var minor = (a, loose) => new SemVer(a, loose).minor;
    module.exports = minor;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/patch.js
var require_patch = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/patch.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var patch = (a, loose) => new SemVer(a, loose).patch;
    module.exports = patch;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/prerelease.js
var require_prerelease = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/prerelease.js"(exports, module) {
    "use strict";
    var parse2 = require_parse();
    var prerelease = (version, options) => {
      const parsed = parse2(version, options);
      return parsed && parsed.prerelease.length ? parsed.prerelease : null;
    };
    module.exports = prerelease;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/compare.js
var require_compare = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/compare.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var compare3 = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
    module.exports = compare3;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/rcompare.js
var require_rcompare = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/rcompare.js"(exports, module) {
    "use strict";
    var compare3 = require_compare();
    var rcompare = (a, b, loose) => compare3(b, a, loose);
    module.exports = rcompare;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/compare-loose.js
var require_compare_loose = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/compare-loose.js"(exports, module) {
    "use strict";
    var compare3 = require_compare();
    var compareLoose = (a, b) => compare3(a, b, true);
    module.exports = compareLoose;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/compare-build.js
var require_compare_build = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/compare-build.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var compareBuild = (a, b, loose) => {
      const versionA = new SemVer(a, loose);
      const versionB = new SemVer(b, loose);
      return versionA.compare(versionB) || versionA.compareBuild(versionB);
    };
    module.exports = compareBuild;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/sort.js
var require_sort = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/sort.js"(exports, module) {
    "use strict";
    var compareBuild = require_compare_build();
    var sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
    module.exports = sort;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/rsort.js
var require_rsort = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/rsort.js"(exports, module) {
    "use strict";
    var compareBuild = require_compare_build();
    var rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
    module.exports = rsort;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/gt.js
var require_gt = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/gt.js"(exports, module) {
    "use strict";
    var compare3 = require_compare();
    var gt = (a, b, loose) => compare3(a, b, loose) > 0;
    module.exports = gt;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/lt.js
var require_lt = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/lt.js"(exports, module) {
    "use strict";
    var compare3 = require_compare();
    var lt = (a, b, loose) => compare3(a, b, loose) < 0;
    module.exports = lt;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/eq.js
var require_eq = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/eq.js"(exports, module) {
    "use strict";
    var compare3 = require_compare();
    var eq = (a, b, loose) => compare3(a, b, loose) === 0;
    module.exports = eq;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/neq.js
var require_neq = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/neq.js"(exports, module) {
    "use strict";
    var compare3 = require_compare();
    var neq = (a, b, loose) => compare3(a, b, loose) !== 0;
    module.exports = neq;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/gte.js
var require_gte = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/gte.js"(exports, module) {
    "use strict";
    var compare3 = require_compare();
    var gte = (a, b, loose) => compare3(a, b, loose) >= 0;
    module.exports = gte;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/lte.js
var require_lte = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/lte.js"(exports, module) {
    "use strict";
    var compare3 = require_compare();
    var lte = (a, b, loose) => compare3(a, b, loose) <= 0;
    module.exports = lte;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/cmp.js
var require_cmp = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/cmp.js"(exports, module) {
    "use strict";
    var eq = require_eq();
    var neq = require_neq();
    var gt = require_gt();
    var gte = require_gte();
    var lt = require_lt();
    var lte = require_lte();
    var cmp = (a, op, b, loose) => {
      switch (op) {
        case "===":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a === b;
        case "!==":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a !== b;
        case "":
        case "=":
        case "==":
          return eq(a, b, loose);
        case "!=":
          return neq(a, b, loose);
        case ">":
          return gt(a, b, loose);
        case ">=":
          return gte(a, b, loose);
        case "<":
          return lt(a, b, loose);
        case "<=":
          return lte(a, b, loose);
        default:
          throw new TypeError(`Invalid operator: ${op}`);
      }
    };
    module.exports = cmp;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/coerce.js
var require_coerce = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/coerce.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var parse2 = require_parse();
    var { safeRe: re, t } = require_re();
    var coerce = (version, options) => {
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version === "number") {
        version = String(version);
      }
      if (typeof version !== "string") {
        return null;
      }
      options = options || {};
      let match = null;
      if (!options.rtl) {
        match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
      } else {
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
          if (!match || next.index + next[0].length !== match.index + match[0].length) {
            match = next;
          }
          coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        coerceRtlRegex.lastIndex = -1;
      }
      if (match === null) {
        return null;
      }
      const major = match[2];
      const minor = match[3] || "0";
      const patch = match[4] || "0";
      const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
      const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
      return parse2(`${major}.${minor}.${patch}${prerelease}${build}`, options);
    };
    module.exports = coerce;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/truncate.js
var require_truncate = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/truncate.js"(exports, module) {
    "use strict";
    var parse2 = require_parse();
    var constants = require_constants();
    var SemVer = require_semver();
    var truncate = (version, truncation, options) => {
      if (!constants.RELEASE_TYPES.includes(truncation)) {
        return null;
      }
      const clonedVersion = cloneInputVersion(version, options);
      return clonedVersion && doTruncation(clonedVersion, truncation);
    };
    var cloneInputVersion = (version, options) => {
      const versionStringToParse = version instanceof SemVer ? version.version : version;
      return parse2(versionStringToParse, options);
    };
    var doTruncation = (version, truncation) => {
      if (isPrerelease(truncation)) {
        return version.version;
      }
      version.prerelease = [];
      switch (truncation) {
        case "major":
          version.minor = 0;
          version.patch = 0;
          break;
        case "minor":
          version.patch = 0;
          break;
      }
      return version.format();
    };
    var isPrerelease = (type) => {
      return type.startsWith("pre");
    };
    module.exports = truncate;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/internal/lrucache.js
var require_lrucache = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/internal/lrucache.js"(exports, module) {
    "use strict";
    var LRUCache = class {
      constructor() {
        this.max = 1e3;
        this.map = /* @__PURE__ */ new Map();
      }
      get(key) {
        const value = this.map.get(key);
        if (value === void 0) {
          return void 0;
        } else {
          this.map.delete(key);
          this.map.set(key, value);
          return value;
        }
      }
      delete(key) {
        return this.map.delete(key);
      }
      set(key, value) {
        const deleted = this.delete(key);
        if (!deleted && value !== void 0) {
          if (this.map.size >= this.max) {
            const firstKey = this.map.keys().next().value;
            this.delete(firstKey);
          }
          this.map.set(key, value);
        }
        return this;
      }
    };
    module.exports = LRUCache;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/classes/range.js
var require_range = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/classes/range.js"(exports, module) {
    "use strict";
    var SPACE_CHARACTERS = /\s+/g;
    var Range = class _Range {
      constructor(range, options) {
        options = parseOptions(options);
        if (range instanceof _Range) {
          if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
            return range;
          } else {
            return new _Range(range.raw, options);
          }
        }
        if (range instanceof Comparator) {
          this.raw = range.value;
          this.set = [[range]];
          this.formatted = void 0;
          return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
        this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
        if (!this.set.length) {
          throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        if (this.set.length > 1) {
          const first = this.set[0];
          this.set = this.set.filter((c) => !isNullSet(c[0]));
          if (this.set.length === 0) {
            this.set = [first];
          } else if (this.set.length > 1) {
            for (const c of this.set) {
              if (c.length === 1 && isAny(c[0])) {
                this.set = [c];
                break;
              }
            }
          }
        }
        this.formatted = void 0;
      }
      get range() {
        if (this.formatted === void 0) {
          this.formatted = "";
          for (let i = 0; i < this.set.length; i++) {
            if (i > 0) {
              this.formatted += "||";
            }
            const comps = this.set[i];
            for (let k = 0; k < comps.length; k++) {
              if (k > 0) {
                this.formatted += " ";
              }
              this.formatted += comps[k].toString().trim();
            }
          }
        }
        return this.formatted;
      }
      format() {
        return this.range;
      }
      toString() {
        return this.range;
      }
      parseRange(range) {
        range = range.replace(BUILDSTRIPRE, "");
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ":" + range;
        const cached = cache.get(memoKey);
        if (cached) {
          return cached;
        }
        const loose = this.options.loose;
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug("hyphen replace", range);
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug("comparator trim", range);
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug("tilde trim", range);
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug("caret trim", range);
        let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
        if (loose) {
          rangeList = rangeList.filter((comp) => {
            debug("loose invalid filter", comp, this.options);
            return !!comp.match(re[t.COMPARATORLOOSE]);
          });
        }
        debug("range list", rangeList);
        const rangeMap = /* @__PURE__ */ new Map();
        const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
        for (const comp of comparators) {
          if (isNullSet(comp)) {
            return [comp];
          }
          rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has("")) {
          rangeMap.delete("");
        }
        const result = [...rangeMap.values()];
        cache.set(memoKey, result);
        return result;
      }
      intersects(range, options) {
        if (!(range instanceof _Range)) {
          throw new TypeError("a Range is required");
        }
        return this.set.some((thisComparators) => {
          return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
            return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options);
              });
            });
          });
        });
      }
      // if ANY of the sets match ALL of its comparators, then pass
      test(version) {
        if (!version) {
          return false;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        for (let i = 0; i < this.set.length; i++) {
          if (testSet(this.set[i], version, this.options)) {
            return true;
          }
        }
        return false;
      }
    };
    module.exports = Range;
    var LRU = require_lrucache();
    var cache = new LRU();
    var parseOptions = require_parse_options();
    var Comparator = require_comparator();
    var debug = require_debug();
    var SemVer = require_semver();
    var {
      safeRe: re,
      src,
      t,
      comparatorTrimReplace,
      tildeTrimReplace,
      caretTrimReplace
    } = require_re();
    var { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
    var BUILDSTRIPRE = new RegExp(src[t.BUILD], "g");
    var isNullSet = (c) => c.value === "<0.0.0-0";
    var isAny = (c) => c.value === "";
    var isSatisfiable = (comparators, options) => {
      let result = true;
      const remainingComparators = comparators.slice();
      let testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every((otherComparator) => {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    };
    var parseComparator = (comp, options) => {
      comp = comp.replace(re[t.BUILD], "");
      debug("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug("caret", comp);
      comp = replaceTildes(comp, options);
      debug("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug("xrange", comp);
      comp = replaceStars(comp, options);
      debug("stars", comp);
      return comp;
    };
    var isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
    var invalidXRangeOrder = (M, m, p) => isX(M) && !isX(m) || isX(m) && p && !isX(p);
    var replaceTildes = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
    };
    var replaceTilde = (comp, options) => {
      const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      const z = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("tilde", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
        } else if (pr) {
          debug("replaceTilde pr", pr);
          ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug("tilde return", ret);
        return ret;
      });
    };
    var replaceCarets = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
    };
    var replaceCaret = (comp, options) => {
      debug("caret", comp, options);
      const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      const z = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("caret", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          if (M === "0") {
            ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
          }
        } else if (pr) {
          debug("replaceCaret pr", pr);
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
          }
        } else {
          debug("no pr");
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
          }
        }
        debug("caret return", ret);
        return ret;
      });
    };
    var replaceXRanges = (comp, options) => {
      debug("replaceXRanges", comp, options);
      return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
    };
    var replaceXRange = (comp, options) => {
      comp = comp.trim();
      const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
        debug("xRange", comp, ret, gtlt, M, m, p, pr);
        if (invalidXRangeOrder(M, m, p)) {
          return comp;
        }
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0-0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          if (gtlt === "<") {
            pr = "-0";
          }
          ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
          ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
          ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug("xRange return", ret);
        return ret;
      });
    };
    var replaceStars = (comp, options) => {
      debug("replaceStars", comp, options);
      return comp.trim().replace(re[t.STAR], "");
    };
    var replaceGTE0 = (comp, options) => {
      debug("replaceGTE0", comp, options);
      return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
    };
    var hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
      if (isX(fM)) {
        from = "";
      } else if (isX(fm)) {
        from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
      } else if (isX(fp)) {
        from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
      } else if (fpr) {
        from = `>=${from}`;
      } else {
        from = `>=${from}${incPr ? "-0" : ""}`;
      }
      if (isX(tM)) {
        to = "";
      } else if (isX(tm)) {
        to = `<${+tM + 1}.0.0-0`;
      } else if (isX(tp)) {
        to = `<${tM}.${+tm + 1}.0-0`;
      } else if (tpr) {
        to = `<=${tM}.${tm}.${tp}-${tpr}`;
      } else if (incPr) {
        to = `<${tM}.${tm}.${+tp + 1}-0`;
      } else {
        to = `<=${to}`;
      }
      return `${from} ${to}`.trim();
    };
    var testSet = (set, version, options) => {
      for (let i = 0; i < set.length; i++) {
        if (!set[i].test(version)) {
          return false;
        }
      }
      if (version.prerelease.length && !options.includePrerelease) {
        for (let i = 0; i < set.length; i++) {
          debug(set[i].semver);
          if (set[i].semver === Comparator.ANY) {
            continue;
          }
          if (set[i].semver.prerelease.length > 0) {
            const allowed = set[i].semver;
            if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    };
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/classes/comparator.js
var require_comparator = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/classes/comparator.js"(exports, module) {
    "use strict";
    var ANY = /* @__PURE__ */ Symbol("SemVer ANY");
    var Comparator = class _Comparator {
      static get ANY() {
        return ANY;
      }
      constructor(comp, options) {
        options = parseOptions(options);
        if (comp instanceof _Comparator) {
          if (comp.loose === !!options.loose) {
            return comp;
          } else {
            comp = comp.value;
          }
        }
        comp = comp.trim().split(/\s+/).join(" ");
        debug("comparator", comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
          this.value = "";
        } else {
          this.value = this.operator + this.semver.version;
        }
        debug("comp", this);
      }
      parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
          throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== void 0 ? m[1] : "";
        if (this.operator === "=") {
          this.operator = "";
        }
        if (!m[2]) {
          this.semver = ANY;
        } else {
          this.semver = new SemVer(m[2], this.options.loose);
        }
      }
      toString() {
        return this.value;
      }
      test(version) {
        debug("Comparator.test", version, this.options.loose);
        if (this.semver === ANY || version === ANY) {
          return true;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        return cmp(version, this.operator, this.semver, this.options);
      }
      intersects(comp, options) {
        if (!(comp instanceof _Comparator)) {
          throw new TypeError("a Comparator is required");
        }
        if (this.operator === "") {
          if (this.value === "") {
            return true;
          }
          return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === "") {
          if (comp.value === "") {
            return true;
          }
          return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
          return false;
        }
        if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
          return false;
        }
        if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
          return true;
        }
        if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
          return true;
        }
        if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
          return true;
        }
        if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
          return true;
        }
        if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
          return true;
        }
        return false;
      }
    };
    module.exports = Comparator;
    var parseOptions = require_parse_options();
    var { safeRe: re, t } = require_re();
    var cmp = require_cmp();
    var debug = require_debug();
    var SemVer = require_semver();
    var Range = require_range();
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/satisfies.js
var require_satisfies = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/functions/satisfies.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var satisfies = (version, range, options) => {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version);
    };
    module.exports = satisfies;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/to-comparators.js
var require_to_comparators = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/to-comparators.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
    module.exports = toComparators;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/max-satisfying.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var maxSatisfying = (versions, range, options) => {
      let max = null;
      let maxSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!max || maxSV.compare(v) === -1) {
            max = v;
            maxSV = new SemVer(max, options);
          }
        }
      });
      return max;
    };
    module.exports = maxSatisfying;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/min-satisfying.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var minSatisfying = (versions, range, options) => {
      let min = null;
      let minSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!min || minSV.compare(v) === 1) {
            min = v;
            minSV = new SemVer(min, options);
          }
        }
      });
      return min;
    };
    module.exports = minSatisfying;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/min-version.js
var require_min_version = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/min-version.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var gt = require_gt();
    var minVersion = (range, loose) => {
      range = new Range(range, loose);
      let minver = new SemVer("0.0.0");
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer("0.0.0-0");
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach((comparator) => {
          const compver = new SemVer(comparator.semver.version);
          switch (comparator.operator) {
            case ">":
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            /* fallthrough */
            case "":
            case ">=":
              if (!setMin || gt(compver, setMin)) {
                setMin = compver;
              }
              break;
            case "<":
            case "<=":
              break;
            /* istanbul ignore next */
            default:
              throw new Error(`Unexpected operation: ${comparator.operator}`);
          }
        });
        if (setMin && (!minver || gt(minver, setMin))) {
          minver = setMin;
        }
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    };
    module.exports = minVersion;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/valid.js
var require_valid2 = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/valid.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var validRange = (range, options) => {
      try {
        return new Range(range, options).range || "*";
      } catch (er) {
        return null;
      }
    };
    module.exports = validRange;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/outside.js
var require_outside = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/outside.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var Range = require_range();
    var satisfies = require_satisfies();
    var gt = require_gt();
    var lt = require_lt();
    var lte = require_lte();
    var gte = require_gte();
    var outside = (version, range, hilo, options) => {
      version = new SemVer(version, options);
      range = new Range(range, options);
      let gtfn, ltefn, ltfn, comp, ecomp;
      switch (hilo) {
        case ">":
          gtfn = gt;
          ltefn = lte;
          ltfn = lt;
          comp = ">";
          ecomp = ">=";
          break;
        case "<":
          gtfn = lt;
          ltefn = gte;
          ltfn = gt;
          comp = "<";
          ecomp = "<=";
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies(version, range, options)) {
        return false;
      }
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let high = null;
        let low = null;
        comparators.forEach((comparator) => {
          if (comparator.semver === ANY) {
            comparator = new Comparator(">=0.0.0");
          }
          high = high || comparator;
          low = low || comparator;
          if (gtfn(comparator.semver, high.semver, options)) {
            high = comparator;
          } else if (ltfn(comparator.semver, low.semver, options)) {
            low = comparator;
          }
        });
        if (high.operator === comp || high.operator === ecomp) {
          return false;
        }
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
          return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
          return false;
        }
      }
      return true;
    };
    module.exports = outside;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/gtr.js
var require_gtr = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/gtr.js"(exports, module) {
    "use strict";
    var outside = require_outside();
    var gtr = (version, range, options) => outside(version, range, ">", options);
    module.exports = gtr;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/ltr.js
var require_ltr = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/ltr.js"(exports, module) {
    "use strict";
    var outside = require_outside();
    var ltr = (version, range, options) => outside(version, range, "<", options);
    module.exports = ltr;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/intersects.js
var require_intersects = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/intersects.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var intersects = (r1, r2, options) => {
      r1 = new Range(r1, options);
      r2 = new Range(r2, options);
      return r1.intersects(r2, options);
    };
    module.exports = intersects;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/simplify.js
var require_simplify = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/simplify.js"(exports, module) {
    "use strict";
    var satisfies = require_satisfies();
    var compare3 = require_compare();
    module.exports = (versions, range, options) => {
      const set = [];
      let first = null;
      let prev = null;
      const v = versions.sort((a, b) => compare3(a, b, options));
      for (const version of v) {
        const included = satisfies(version, range, options);
        if (included) {
          prev = version;
          if (!first) {
            first = version;
          }
        } else {
          if (prev) {
            set.push([first, prev]);
          }
          prev = null;
          first = null;
        }
      }
      if (first) {
        set.push([first, null]);
      }
      const ranges = [];
      for (const [min, max] of set) {
        if (min === max) {
          ranges.push(min);
        } else if (!max && min === v[0]) {
          ranges.push("*");
        } else if (!max) {
          ranges.push(`>=${min}`);
        } else if (min === v[0]) {
          ranges.push(`<=${max}`);
        } else {
          ranges.push(`${min} - ${max}`);
        }
      }
      const simplified = ranges.join(" || ");
      const original = typeof range.raw === "string" ? range.raw : String(range);
      return simplified.length < original.length ? simplified : range;
    };
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/subset.js
var require_subset = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/ranges/subset.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var satisfies = require_satisfies();
    var compare3 = require_compare();
    var subset = (sub, dom, options = {}) => {
      if (sub === dom) {
        return true;
      }
      sub = new Range(sub, options);
      dom = new Range(dom, options);
      let sawNonNull = false;
      OUTER: for (const simpleSub of sub.set) {
        for (const simpleDom of dom.set) {
          const isSub = simpleSubset(simpleSub, simpleDom, options);
          sawNonNull = sawNonNull || isSub !== null;
          if (isSub) {
            continue OUTER;
          }
        }
        if (sawNonNull) {
          return false;
        }
      }
      return true;
    };
    var minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
    var minimumVersion = [new Comparator(">=0.0.0")];
    var simpleSubset = (sub, dom, options) => {
      if (sub === dom) {
        return true;
      }
      if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) {
          return true;
        } else if (options.includePrerelease) {
          sub = minimumVersionWithPreRelease;
        } else {
          sub = minimumVersion;
        }
      }
      if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) {
          return true;
        } else {
          dom = minimumVersion;
        }
      }
      const eqSet = /* @__PURE__ */ new Set();
      let gt, lt;
      for (const c of sub) {
        if (c.operator === ">" || c.operator === ">=") {
          gt = higherGT(gt, c, options);
        } else if (c.operator === "<" || c.operator === "<=") {
          lt = lowerLT(lt, c, options);
        } else {
          eqSet.add(c.semver);
        }
      }
      if (eqSet.size > 1) {
        return null;
      }
      let gtltComp;
      if (gt && lt) {
        gtltComp = compare3(gt.semver, lt.semver, options);
        if (gtltComp > 0) {
          return null;
        } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
          return null;
        }
      }
      for (const eq of eqSet) {
        if (gt && !satisfies(eq, String(gt), options)) {
          return null;
        }
        if (lt && !satisfies(eq, String(lt), options)) {
          return null;
        }
        for (const c of dom) {
          if (!satisfies(eq, String(c), options)) {
            return false;
          }
        }
        return true;
      }
      let higher, lower;
      let hasDomLT, hasDomGT;
      let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
      let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
      if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
        needDomLTPre = false;
      }
      for (const c of dom) {
        hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
        hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
        if (gt) {
          if (needDomGTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
              needDomGTPre = false;
            }
          }
          if (c.operator === ">" || c.operator === ">=") {
            higher = higherGT(gt, c, options);
            if (higher === c && higher !== gt) {
              return false;
            }
          } else if (gt.operator === ">=" && !c.test(gt.semver)) {
            return false;
          }
        }
        if (lt) {
          if (needDomLTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
              needDomLTPre = false;
            }
          }
          if (c.operator === "<" || c.operator === "<=") {
            lower = lowerLT(lt, c, options);
            if (lower === c && lower !== lt) {
              return false;
            }
          } else if (lt.operator === "<=" && !c.test(lt.semver)) {
            return false;
          }
        }
        if (!c.operator && (lt || gt) && gtltComp !== 0) {
          return false;
        }
      }
      if (gt && hasDomLT && !lt && gtltComp !== 0) {
        return false;
      }
      if (lt && hasDomGT && !gt && gtltComp !== 0) {
        return false;
      }
      if (needDomGTPre || needDomLTPre) {
        return false;
      }
      return true;
    };
    var higherGT = (a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare3(a.semver, b.semver, options);
      return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
    };
    var lowerLT = (a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare3(a.semver, b.semver, options);
      return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
    };
    module.exports = subset;
  }
});

// ../../../node_modules/.bun/semver@7.8.5/node_modules/semver/index.js
var require_semver2 = __commonJS({
  "../../../node_modules/.bun/semver@7.8.5/node_modules/semver/index.js"(exports, module) {
    "use strict";
    var internalRe = require_re();
    var constants = require_constants();
    var SemVer = require_semver();
    var identifiers = require_identifiers();
    var parse2 = require_parse();
    var valid2 = require_valid();
    var clean2 = require_clean();
    var inc = require_inc();
    var diff = require_diff();
    var major = require_major();
    var minor = require_minor();
    var patch = require_patch();
    var prerelease = require_prerelease();
    var compare3 = require_compare();
    var rcompare = require_rcompare();
    var compareLoose = require_compare_loose();
    var compareBuild = require_compare_build();
    var sort = require_sort();
    var rsort = require_rsort();
    var gt = require_gt();
    var lt = require_lt();
    var eq = require_eq();
    var neq = require_neq();
    var gte = require_gte();
    var lte = require_lte();
    var cmp = require_cmp();
    var coerce = require_coerce();
    var truncate = require_truncate();
    var Comparator = require_comparator();
    var Range = require_range();
    var satisfies = require_satisfies();
    var toComparators = require_to_comparators();
    var maxSatisfying = require_max_satisfying();
    var minSatisfying = require_min_satisfying();
    var minVersion = require_min_version();
    var validRange = require_valid2();
    var outside = require_outside();
    var gtr = require_gtr();
    var ltr = require_ltr();
    var intersects = require_intersects();
    var simplifyRange = require_simplify();
    var subset = require_subset();
    module.exports = {
      parse: parse2,
      valid: valid2,
      clean: clean2,
      inc,
      diff,
      major,
      minor,
      patch,
      prerelease,
      compare: compare3,
      rcompare,
      compareLoose,
      compareBuild,
      sort,
      rsort,
      gt,
      lt,
      eq,
      neq,
      gte,
      lte,
      cmp,
      coerce,
      truncate,
      Comparator,
      Range,
      satisfies,
      toComparators,
      maxSatisfying,
      minSatisfying,
      minVersion,
      validRange,
      outside,
      gtr,
      ltr,
      intersects,
      simplifyRange,
      subset,
      SemVer,
      re: internalRe.re,
      src: internalRe.src,
      tokens: internalRe.t,
      SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
      RELEASE_TYPES: constants.RELEASE_TYPES,
      compareIdentifiers: identifiers.compareIdentifiers,
      rcompareIdentifiers: identifiers.rcompareIdentifiers
    };
  }
});

// ../sdk/src/ids.ts
import { Schema } from "effect";
var IntegrationSlug = Schema.String.pipe(Schema.brand("IntegrationSlug"));
var AuthTemplateSlug = Schema.String.pipe(Schema.brand("AuthTemplateSlug"));
var NO_AUTH_TEMPLATE = AuthTemplateSlug.make("none");
var ConnectionName = Schema.String.pipe(Schema.brand("ConnectionName"));
var OAuthClientSlug = Schema.String.pipe(Schema.brand("OAuthClientSlug"));
var OAuthState = Schema.String.pipe(Schema.brand("OAuthState"));
var ProviderKey = Schema.String.pipe(Schema.brand("ProviderKey"));
var ProviderItemId = Schema.String.pipe(Schema.brand("ProviderItemId"));
var ConnectionAddress = Schema.String.pipe(Schema.brand("ConnectionAddress"));
var ToolAddress = Schema.String.pipe(Schema.brand("ToolAddress"));
var ToolName = Schema.String.pipe(Schema.brand("ToolName"));
var ElicitationId = Schema.String.pipe(Schema.brand("ElicitationId"));
var PolicyId = Schema.String.pipe(Schema.brand("PolicyId"));
var Tenant = Schema.String.pipe(Schema.brand("Tenant"));
var Subject = Schema.String.pipe(Schema.brand("Subject"));
var Owner = Schema.Literals(["org", "user"]);

// ../sdk/src/executor.ts
import { Effect as Effect11, Inspectable, Option as Option5, Predicate as Predicate4, Schema as Schema14 } from "effect";
import { FetchHttpClient as FetchHttpClient3 } from "effect/unstable/http";

// ../fumadb/src/index.ts
var import_semver = __toESM(require_semver2(), 1);

// ../fumadb/src/schema/name-variants-builder.ts
function createNameVariantsBuilder(namespace, schemas, out) {
  const names = ((...args) => {
    let updated;
    if (args.length === 2) {
      const [versions, variants] = args;
      updated = schemas.flatMap((schema2) => {
        if (!versions.includes(schema2.version)) return [];
        return applyNameVariants(schema2, variants);
      });
    } else {
      const [variants] = args;
      updated = schemas.map((schema2) => applyNameVariants(schema2, variants));
    }
    return out(updated);
  });
  names.prefix = (prefix) => {
    if (prefix === true) prefix = namespace;
    return out(
      schemas.map(
        (schema2) => applyNameVariantsPrefix(schema2, prefix)
      )
    );
  };
  return names;
}
function applyNameVariantsPrefix(schema2, prefix) {
  const generated = {};
  for (const [tableName, table2] of Object.entries(schema2.tables)) {
    const names = {};
    for (const [k, v] of Object.entries(table2.names)) {
      names[k] = prefix + v;
    }
    generated[tableName] = names;
  }
  return applyNameVariants(schema2, generated);
}
function applyNameVariants(schema2, names) {
  const cloned = schema2.clone();
  for (const [k, v] of Object.entries(names)) {
    if (v === void 0) continue;
    const [tableName, colName] = k.split(".", 2);
    const table2 = cloned.tables[tableName];
    if (!table2) continue;
    if (!colName) {
      table2.names = {
        ...table2.names,
        ...v
      };
      continue;
    }
    const col = table2.columns[colName];
    if (!col) continue;
    col.names = { ...col.names, ...v };
  }
  return cloned;
}

// ../fumadb/src/shared/providers.ts
var sqlProviders = [
  "sqlite",
  "cockroachdb",
  "mysql",
  "postgresql",
  "mssql"
];
var noSqlProviders = ["mongodb"];
var providers = [...sqlProviders, ...noSqlProviders];

// ../fumadb/src/index.ts
function fumadb(config) {
  const schemas = config.schemas.sort((a, b) => (0, import_semver.compare)(a.version, b.version));
  return {
    names: createNameVariantsBuilder(config.namespace, schemas, (schemas2) => {
      return fumadb({
        ...config,
        schemas: schemas2
      });
    }),
    version(targetVersion) {
      return targetVersion;
    },
    client(adapter) {
      const orms = /* @__PURE__ */ new Map();
      const adapterContext = {
        ...config
      };
      return {
        adapter,
        schemas,
        orm(version) {
          let orm = orms.get(version);
          if (orm) return orm;
          const schema2 = schemas.find((schema3) => schema3.version === version);
          if (!schema2) throw new Error(`unknown schema version ${version}`);
          orm = adapter.createORM.call(adapterContext, schema2);
          orms.set(version, orm);
          return orm;
        },
        async version() {
          const version = await adapter.getSchemaVersion.call(adapterContext);
          if (!version)
            throw new Error(`FumaDB ${config.namespace} is not initialized.`);
          return version;
        },
        generateSchema(version, name = config.namespace) {
          if (!adapter.generateSchema)
            throw new Error("The adapter doesn't support schema API.");
          let schema2;
          if (version === "latest") {
            schema2 = schemas.at(-1);
          } else {
            schema2 = schemas.find((schema3) => schema3.version === version);
            if (!schema2) throw new Error(`Invalid version: ${version}`);
          }
          return adapter.generateSchema.call(adapterContext, schema2, name);
        },
        createMigrator() {
          if (!adapter.createMigrationEngine)
            throw new Error("The adapter doesn't support migration engine.");
          return adapter.createMigrationEngine.call(adapterContext);
        },
        get abstract() {
          return this.orm(schemas.at(-1).version);
        }
      };
    }
  };
}

// ../fumadb/src/query/condition-builder.ts
var stringOperators = [
  "contains",
  "starts with",
  "ends with",
  "not contains",
  "not starts with",
  "not ends with"
  // excluded `regexp` since MSSQL doesn't support it, may re-consider
];
var arrayOperators = ["in", "not in"];
var valueOperators = [
  "=",
  "!=",
  ">",
  ">=",
  "<",
  "<=",
  "is",
  "is not"
];
var operators = [
  ...valueOperators,
  ...arrayOperators,
  ...stringOperators
];
function createBuilder(columns) {
  function col(name) {
    const out = columns[name];
    if (!out) throw new Error(`[FumaDB] Invalid column name ${String(name)}`);
    return out;
  }
  const builder = (...args) => {
    if (args.length === 3) {
      const [a, operator, b] = args;
      if (!operators.includes(operator))
        throw new Error(`Unsupported operator: ${operator}`);
      return {
        type: 2 /* Compare */,
        a: col(a),
        b,
        operator
      };
    }
    return {
      type: 2 /* Compare */,
      a: col(args[0]),
      operator: "=",
      b: true
    };
  };
  builder.isNull = (a) => builder(a, "is", null);
  builder.isNotNull = (a) => builder(a, "is not", null);
  builder.not = (condition) => {
    if (typeof condition === "boolean") return !condition;
    return {
      type: 3 /* Not */,
      item: condition
    };
  };
  builder.or = (...conditions) => {
    const out = {
      type: 1 /* Or */,
      items: []
    };
    for (const item of conditions) {
      if (item === true) return true;
      if (item === false) continue;
      out.items.push(item);
    }
    if (out.items.length === 0) return false;
    return out;
  };
  builder.and = (...conditions) => {
    const out = {
      type: 0 /* And */,
      items: []
    };
    for (const item of conditions) {
      if (item === true) continue;
      if (item === false) return false;
      out.items.push(item);
    }
    if (out.items.length === 0) return true;
    return out;
  };
  return builder;
}
function buildCondition(columns, input) {
  return input(createBuilder(columns));
}

// ../fumadb/src/query/orm/index.ts
function isOrderByArray(v) {
  return Array.isArray(v) && Array.isArray(v[0]);
}
function simplifyOrderBy(columns, orderBy) {
  if (!orderBy || orderBy.length === 0) return;
  if (!isOrderByArray(orderBy)) orderBy = [orderBy];
  return orderBy.map(([name, value]) => {
    const col = columns[name];
    if (!col) throw new Error(`[FumaDB] unknown column name ${name}.`);
    return [col, value];
  });
}
function buildFindOptions(table2, { select = true, where, orderBy, join, ...options }) {
  let conditions = where ? buildCondition(table2.columns, where) : void 0;
  if (conditions === true) conditions = void 0;
  if (conditions === false) return false;
  return {
    select,
    where: conditions,
    orderBy: simplifyOrderBy(table2.columns, orderBy),
    join: join ? buildJoin(table2, join) : void 0,
    ...options
  };
}
function buildJoin(table2, fn) {
  const compiled = [];
  const builder = {};
  for (const name in table2.relations) {
    const relation = table2.relations[name];
    builder[name] = (options = {}) => {
      compiled.push({
        relation,
        options: buildFindOptions(relation.table, options)
      });
      delete builder[name];
      return builder;
    };
  }
  fn(builder);
  return compiled;
}
var mergePolicyCondition = (table2, where, condition) => {
  if (condition === void 0 || condition === true) return where;
  if (condition === false) return false;
  const next = createBuilder(table2.columns).and(where ?? true, condition);
  if (next === true) return void 0;
  if (next === false) return false;
  return next;
};
var applyReadPolicies = async (table2, where, context) => {
  let nextWhere = where;
  for (const policy of table2.policies) {
    const condition = await policy.onRead?.({
      where: nextWhere,
      context,
      builder: createBuilder(table2.columns)
    });
    const merged = mergePolicyCondition(table2, nextWhere, condition);
    if (merged === false) return false;
    nextWhere = merged;
  }
  return nextWhere;
};
var applyReadPoliciesToOptions = async (table2, options, context) => {
  const where = await applyReadPolicies(table2, options.where, context);
  if (where === false) return false;
  let changed = where !== options.where;
  const join = options.join ? [] : void 0;
  for (const entry of options.join ?? []) {
    if (entry.options === false) {
      join.push(entry);
      continue;
    }
    const nextOptions = await applyReadPoliciesToOptions(
      entry.relation.table,
      entry.options,
      context
    );
    if (nextOptions === false) {
      join.push({ ...entry, options: false });
      changed = true;
      continue;
    }
    if (nextOptions !== entry.options) changed = true;
    join.push(nextOptions === entry.options ? entry : { ...entry, options: nextOptions });
  }
  return changed ? { ...options, where, join } : options;
};
var isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var applyDeniedJoinDefaults = (records, options) => {
  if (!options.join) return;
  for (const entry of options.join) {
    if (entry.options === false) {
      for (const record of records) {
        record[entry.relation.name] = entry.relation.type === "many" ? [] : null;
      }
      continue;
    }
    for (const record of records) {
      const value = record[entry.relation.name];
      if (entry.relation.type === "many") {
        if (Array.isArray(value)) applyDeniedJoinDefaults(value.filter(isRecord), entry.options);
        continue;
      }
      if (isRecord(value)) applyDeniedJoinDefaults([value], entry.options);
    }
  }
};
var runCreatePolicies = async (table2, values, context) => {
  for (const policy of table2.policies) {
    await policy.onCreate?.({ values, context });
  }
};
var applyUpdatePolicies = async (table2, where, set, context, operation, create) => {
  let nextWhere = where;
  for (const policy of table2.policies) {
    const condition = await policy.onUpdate?.({
      where: nextWhere,
      set,
      create,
      context,
      builder: createBuilder(table2.columns),
      operation
    });
    const merged = mergePolicyCondition(table2, nextWhere, condition);
    if (merged === false) return false;
    nextWhere = merged;
  }
  return nextWhere;
};
var applyDeletePolicies = async (table2, where, context) => {
  let nextWhere = where;
  for (const policy of table2.policies) {
    const condition = await policy.onDelete?.({
      where: nextWhere,
      context,
      builder: createBuilder(table2.columns)
    });
    const merged = mergePolicyCondition(table2, nextWhere, condition);
    if (merged === false) return false;
    nextWhere = merged;
  }
  return nextWhere;
};
function toORM(adapter, options = {}) {
  const context = options.context ?? adapter.context;
  const internal = context === adapter.context ? adapter : { ...adapter, context };
  function toTable(name) {
    const table2 = internal.tables[name];
    if (!table2) throw new Error(`[FumaDB] Invalid table name ${String(name)}.`);
    return table2;
  }
  const query = {
    internal,
    async count(name, { where } = {}) {
      const table2 = toTable(name);
      let conditions = where ? buildCondition(table2.columns, where) : void 0;
      if (conditions === true) conditions = void 0;
      if (conditions === false) return 0;
      const constrainedWhere = await applyReadPolicies(table2, conditions, context);
      if (constrainedWhere === false) return 0;
      return await internal.count(table2, { where: constrainedWhere });
    },
    async upsert(name, { where, ...options2 }) {
      const table2 = toTable(name);
      const conditions = where ? buildCondition(table2.columns, where) : void 0;
      if (conditions === false) return;
      let compiledWhere = conditions === true ? void 0 : conditions;
      compiledWhere = await applyUpdatePolicies(
        table2,
        compiledWhere,
        options2.update,
        context,
        "upsert",
        options2.create
      );
      if (compiledWhere === false) return;
      await runCreatePolicies(table2, options2.create, context);
      await internal.upsert(table2, {
        where: compiledWhere,
        ...options2
      });
    },
    async create(name, values) {
      const table2 = toTable(name);
      await runCreatePolicies(table2, values, context);
      return await internal.create(table2, values);
    },
    async createMany(name, values) {
      const table2 = toTable(name);
      for (const value of values) {
        await runCreatePolicies(table2, value, context);
      }
      return await internal.createMany(table2, values);
    },
    async deleteMany(name, { where }) {
      const table2 = toTable(name);
      let conditions = where ? buildCondition(table2.columns, where) : void 0;
      if (conditions === true) conditions = void 0;
      if (conditions === false) return;
      const constrainedWhere = await applyDeletePolicies(table2, conditions, context);
      if (constrainedWhere === false) return;
      await internal.deleteMany(table2, { where: constrainedWhere });
    },
    async findMany(name, options2 = {}) {
      const table2 = toTable(name);
      let compiledOptions = buildFindOptions(table2, options2);
      if (compiledOptions === false) return [];
      compiledOptions = await applyReadPoliciesToOptions(table2, compiledOptions, context);
      if (compiledOptions === false) return [];
      const records = await internal.findMany(table2, compiledOptions);
      applyDeniedJoinDefaults(records, compiledOptions);
      return records;
    },
    async findFirst(name, options2) {
      const table2 = toTable(name);
      let compiledOptions = buildFindOptions(table2, options2);
      if (compiledOptions === false) return null;
      compiledOptions = await applyReadPoliciesToOptions(table2, compiledOptions, context);
      if (compiledOptions === false) return null;
      const record = await internal.findFirst(table2, compiledOptions);
      if (record) applyDeniedJoinDefaults([record], compiledOptions);
      return record;
    },
    async updateMany(name, { set, where }) {
      const table2 = toTable(name);
      let conditions = where ? buildCondition(table2.columns, where) : void 0;
      if (conditions === true) conditions = void 0;
      if (conditions === false) return;
      const constrainedWhere = await applyUpdatePolicies(
        table2,
        conditions,
        set,
        context,
        "update"
      );
      if (constrainedWhere === false) return;
      return internal.updateMany(table2, { set, where: constrainedWhere });
    },
    async transaction(run) {
      return internal.transaction(
        (transactionInstance) => run(withQueryContext(transactionInstance, context))
      );
    }
  };
  Object.defineProperty(query, "withContext", {
    enumerable: false,
    value(nextContext) {
      return toORM(internal, { context: nextContext });
    }
  });
  return query;
}
function withQueryContext(db, context) {
  if (typeof db.withContext === "function") return db.withContext(context);
  throw new Error(
    "[FumaDB] Cannot apply query context to this query object. If you wrap an AbstractQuery, forward withContext so table policies keep using the wrapper."
  );
}

// ../../../node_modules/.bun/@noble+hashes@2.2.0/node_modules/@noble/hashes/_u64.js
var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;

// ../../../node_modules/.bun/@noble+hashes@2.2.0/node_modules/@noble/hashes/utils.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
function anumber(n, title = "") {
  if (typeof n !== "number") {
    const prefix = title && `"${title}" `;
    throw new TypeError(`${prefix}expected number, got ${typeof n}`);
  }
  if (!Number.isSafeInteger(n) || n < 0) {
    const prefix = title && `"${title}" `;
    throw new RangeError(`${prefix}expected integer >= 0, got ${n}`);
  }
}
function abytes(value, length, title = "") {
  const bytes = isBytes(value);
  const len = value?.length;
  const needsLen = length !== void 0;
  if (!bytes || needsLen && len !== length) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length}` : "";
    const got = bytes ? `length=${len}` : `type=${typeof value}`;
    const message = prefix + "expected Uint8Array" + ofLen + ", got " + got;
    if (!bytes)
      throw new TypeError(message);
    throw new RangeError(message);
  }
  return value;
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance) {
  abytes(out, void 0, "digestInto() output");
  const min = instance.outputLen;
  if (out.length < min) {
    throw new RangeError('"digestInto() output" expected to be of length >=' + min);
  }
}
function u32(arr) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
var isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
function byteSwap(word) {
  return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
function byteSwap32(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = byteSwap(arr[i]);
  }
  return arr;
}
var swap32IfBE = isLE ? (u) => u : byteSwap32;
function createHasher(hashCons, info = {}) {
  const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
  const tmp = hashCons(void 0);
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.canXOF = tmp.canXOF;
  hashC.create = (opts) => hashCons(opts);
  Object.assign(hashC, info);
  return Object.freeze(hashC);
}
var oidNist = (suffix) => ({
  // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
  // Larger suffix values would need base-128 OID encoding and a different length byte.
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
});

// ../../../node_modules/.bun/@noble+hashes@2.2.0/node_modules/@noble/hashes/sha3.js
var _0n = BigInt(0);
var _1n = BigInt(1);
var _2n = BigInt(2);
var _7n = BigInt(7);
var _256n = BigInt(256);
var _0x71n = BigInt(113);
var SHA3_PI = [];
var SHA3_ROTL = [];
var _SHA3_IOTA = [];
for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
  [x, y] = [y, (2 * x + 3 * y) % 5];
  SHA3_PI.push(2 * (5 * y + x));
  SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
  let t = _0n;
  for (let j = 0; j < 7; j++) {
    R = (R << _1n ^ (R >> _7n) * _0x71n) % _256n;
    if (R & _2n)
      t ^= _1n << (_1n << BigInt(j)) - _1n;
  }
  _SHA3_IOTA.push(t);
}
var IOTAS = split(_SHA3_IOTA, true);
var SHA3_IOTA_H = IOTAS[0];
var SHA3_IOTA_L = IOTAS[1];
var rotlH = (h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s);
var rotlL = (h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s);
function keccakP(s, rounds = 24) {
  anumber(rounds, "rounds");
  if (rounds < 1 || rounds > 24)
    throw new Error('"rounds" expected integer 1..24');
  const B = new Uint32Array(5 * 2);
  for (let round = 24 - rounds; round < 24; round++) {
    for (let x = 0; x < 10; x++)
      B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
    for (let x = 0; x < 10; x += 2) {
      const idx1 = (x + 8) % 10;
      const idx0 = (x + 2) % 10;
      const B0 = B[idx0];
      const B1 = B[idx0 + 1];
      const Th = rotlH(B0, B1, 1) ^ B[idx1];
      const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
      for (let y = 0; y < 50; y += 10) {
        s[x + y] ^= Th;
        s[x + y + 1] ^= Tl;
      }
    }
    let curH = s[2];
    let curL = s[3];
    for (let t = 0; t < 24; t++) {
      const shift = SHA3_ROTL[t];
      const Th = rotlH(curH, curL, shift);
      const Tl = rotlL(curH, curL, shift);
      const PI = SHA3_PI[t];
      curH = s[PI];
      curL = s[PI + 1];
      s[PI] = Th;
      s[PI + 1] = Tl;
    }
    for (let y = 0; y < 50; y += 10) {
      const b0 = s[y], b1 = s[y + 1], b2 = s[y + 2], b3 = s[y + 3];
      s[y] ^= ~s[y + 2] & s[y + 4];
      s[y + 1] ^= ~s[y + 3] & s[y + 5];
      s[y + 2] ^= ~s[y + 4] & s[y + 6];
      s[y + 3] ^= ~s[y + 5] & s[y + 7];
      s[y + 4] ^= ~s[y + 6] & s[y + 8];
      s[y + 5] ^= ~s[y + 7] & s[y + 9];
      s[y + 6] ^= ~s[y + 8] & b0;
      s[y + 7] ^= ~s[y + 9] & b1;
      s[y + 8] ^= ~b0 & b2;
      s[y + 9] ^= ~b1 & b3;
    }
    s[0] ^= SHA3_IOTA_H[round];
    s[1] ^= SHA3_IOTA_L[round];
  }
  clean(B);
}
var Keccak = class _Keccak {
  state;
  pos = 0;
  posOut = 0;
  finished = false;
  state32;
  destroyed = false;
  blockLen;
  suffix;
  outputLen;
  canXOF;
  enableXOF = false;
  rounds;
  // NOTE: we accept arguments in bytes instead of bits here.
  constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
    this.blockLen = blockLen;
    this.suffix = suffix;
    this.outputLen = outputLen;
    this.enableXOF = enableXOF;
    this.canXOF = enableXOF;
    this.rounds = rounds;
    anumber(outputLen, "outputLen");
    if (!(0 < blockLen && blockLen < 200))
      throw new Error("only keccak-f1600 function is supported");
    this.state = new Uint8Array(200);
    this.state32 = u32(this.state);
  }
  clone() {
    return this._cloneInto();
  }
  keccak() {
    swap32IfBE(this.state32);
    keccakP(this.state32, this.rounds);
    swap32IfBE(this.state32);
    this.posOut = 0;
    this.pos = 0;
  }
  update(data) {
    aexists(this);
    abytes(data);
    const { blockLen, state } = this;
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      for (let i = 0; i < take; i++)
        state[this.pos++] ^= data[pos++];
      if (this.pos === blockLen)
        this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished)
      return;
    this.finished = true;
    const { state, suffix, pos, blockLen } = this;
    state[pos] ^= suffix;
    if ((suffix & 128) !== 0 && pos === blockLen - 1)
      this.keccak();
    state[blockLen - 1] ^= 128;
    this.keccak();
  }
  writeInto(out) {
    aexists(this, false);
    abytes(out);
    this.finish();
    const bufferOut = this.state;
    const { blockLen } = this;
    for (let pos = 0, len = out.length; pos < len; ) {
      if (this.posOut >= blockLen)
        this.keccak();
      const take = Math.min(blockLen - this.posOut, len - pos);
      out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
      this.posOut += take;
      pos += take;
    }
    return out;
  }
  xofInto(out) {
    if (!this.enableXOF)
      throw new Error("XOF is not possible for this instance");
    return this.writeInto(out);
  }
  xof(bytes) {
    anumber(bytes);
    return this.xofInto(new Uint8Array(bytes));
  }
  digestInto(out) {
    aoutput(out, this);
    if (this.finished)
      throw new Error("digest() was already called");
    this.writeInto(out.subarray(0, this.outputLen));
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.outputLen);
    this.digestInto(out);
    return out;
  }
  destroy() {
    this.destroyed = true;
    clean(this.state);
  }
  _cloneInto(to) {
    const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
    to ||= new _Keccak(blockLen, suffix, outputLen, enableXOF, rounds);
    to.blockLen = blockLen;
    to.state32.set(this.state32);
    to.pos = this.pos;
    to.posOut = this.posOut;
    to.finished = this.finished;
    to.rounds = rounds;
    to.suffix = suffix;
    to.outputLen = outputLen;
    to.enableXOF = enableXOF;
    to.canXOF = this.canXOF;
    to.destroyed = this.destroyed;
    return to;
  }
};
var genKeccak = (suffix, blockLen, outputLen, info = {}) => createHasher(() => new Keccak(blockLen, suffix, outputLen), info);
var sha3_512 = /* @__PURE__ */ genKeccak(
  6,
  72,
  64,
  /* @__PURE__ */ oidNist(10)
);

// ../../../node_modules/.bun/bignumber.js@9.3.1/node_modules/bignumber.js/bignumber.mjs
var isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
var mathceil = Math.ceil;
var mathfloor = Math.floor;
var bignumberError = "[BigNumber Error] ";
var tooManyDigits = bignumberError + "Number primitive has more than 15 significant digits: ";
var BASE = 1e14;
var LOG_BASE = 14;
var MAX_SAFE_INTEGER = 9007199254740991;
var POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13];
var SQRT_BASE = 1e7;
var MAX = 1e9;
function clone(configObject) {
  var div, convertBase, parseNumeric, P = BigNumber2.prototype = { constructor: BigNumber2, toString: null, valueOf: null }, ONE = new BigNumber2(1), DECIMAL_PLACES = 20, ROUNDING_MODE = 4, TO_EXP_NEG = -7, TO_EXP_POS = 21, MIN_EXP = -1e7, MAX_EXP = 1e7, CRYPTO = false, MODULO_MODE = 1, POW_PRECISION = 0, FORMAT = {
    prefix: "",
    groupSize: 3,
    secondaryGroupSize: 0,
    groupSeparator: ",",
    decimalSeparator: ".",
    fractionGroupSize: 0,
    fractionGroupSeparator: "\xA0",
    // non-breaking space
    suffix: ""
  }, ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz", alphabetHasNormalDecimalDigits = true;
  function BigNumber2(v, b) {
    var alphabet2, c, caseChanged, e, i, isNum, len, str, x = this;
    if (!(x instanceof BigNumber2)) return new BigNumber2(v, b);
    if (b == null) {
      if (v && v._isBigNumber === true) {
        x.s = v.s;
        if (!v.c || v.e > MAX_EXP) {
          x.c = x.e = null;
        } else if (v.e < MIN_EXP) {
          x.c = [x.e = 0];
        } else {
          x.e = v.e;
          x.c = v.c.slice();
        }
        return;
      }
      if ((isNum = typeof v == "number") && v * 0 == 0) {
        x.s = 1 / v < 0 ? (v = -v, -1) : 1;
        if (v === ~~v) {
          for (e = 0, i = v; i >= 10; i /= 10, e++) ;
          if (e > MAX_EXP) {
            x.c = x.e = null;
          } else {
            x.e = e;
            x.c = [v];
          }
          return;
        }
        str = String(v);
      } else {
        if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);
        x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
      }
      if ((e = str.indexOf(".")) > -1) str = str.replace(".", "");
      if ((i = str.search(/e/i)) > 0) {
        if (e < 0) e = i;
        e += +str.slice(i + 1);
        str = str.substring(0, i);
      } else if (e < 0) {
        e = str.length;
      }
    } else {
      intCheck(b, 2, ALPHABET.length, "Base");
      if (b == 10 && alphabetHasNormalDecimalDigits) {
        x = new BigNumber2(v);
        return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
      }
      str = String(v);
      if (isNum = typeof v == "number") {
        if (v * 0 != 0) return parseNumeric(x, str, isNum, b);
        x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;
        if (BigNumber2.DEBUG && str.replace(/^0\.0*|\./, "").length > 15) {
          throw Error(tooManyDigits + v);
        }
      } else {
        x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
      }
      alphabet2 = ALPHABET.slice(0, b);
      e = i = 0;
      for (len = str.length; i < len; i++) {
        if (alphabet2.indexOf(c = str.charAt(i)) < 0) {
          if (c == ".") {
            if (i > e) {
              e = len;
              continue;
            }
          } else if (!caseChanged) {
            if (str == str.toUpperCase() && (str = str.toLowerCase()) || str == str.toLowerCase() && (str = str.toUpperCase())) {
              caseChanged = true;
              i = -1;
              e = 0;
              continue;
            }
          }
          return parseNumeric(x, String(v), isNum, b);
        }
      }
      isNum = false;
      str = convertBase(str, b, 10, x.s);
      if ((e = str.indexOf(".")) > -1) str = str.replace(".", "");
      else e = str.length;
    }
    for (i = 0; str.charCodeAt(i) === 48; i++) ;
    for (len = str.length; str.charCodeAt(--len) === 48; ) ;
    if (str = str.slice(i, ++len)) {
      len -= i;
      if (isNum && BigNumber2.DEBUG && len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
        throw Error(tooManyDigits + x.s * v);
      }
      if ((e = e - i - 1) > MAX_EXP) {
        x.c = x.e = null;
      } else if (e < MIN_EXP) {
        x.c = [x.e = 0];
      } else {
        x.e = e;
        x.c = [];
        i = (e + 1) % LOG_BASE;
        if (e < 0) i += LOG_BASE;
        if (i < len) {
          if (i) x.c.push(+str.slice(0, i));
          for (len -= LOG_BASE; i < len; ) {
            x.c.push(+str.slice(i, i += LOG_BASE));
          }
          i = LOG_BASE - (str = str.slice(i)).length;
        } else {
          i -= len;
        }
        for (; i--; str += "0") ;
        x.c.push(+str);
      }
    } else {
      x.c = [x.e = 0];
    }
  }
  BigNumber2.clone = clone;
  BigNumber2.ROUND_UP = 0;
  BigNumber2.ROUND_DOWN = 1;
  BigNumber2.ROUND_CEIL = 2;
  BigNumber2.ROUND_FLOOR = 3;
  BigNumber2.ROUND_HALF_UP = 4;
  BigNumber2.ROUND_HALF_DOWN = 5;
  BigNumber2.ROUND_HALF_EVEN = 6;
  BigNumber2.ROUND_HALF_CEIL = 7;
  BigNumber2.ROUND_HALF_FLOOR = 8;
  BigNumber2.EUCLID = 9;
  BigNumber2.config = BigNumber2.set = function(obj) {
    var p, v;
    if (obj != null) {
      if (typeof obj == "object") {
        if (obj.hasOwnProperty(p = "DECIMAL_PLACES")) {
          v = obj[p];
          intCheck(v, 0, MAX, p);
          DECIMAL_PLACES = v;
        }
        if (obj.hasOwnProperty(p = "ROUNDING_MODE")) {
          v = obj[p];
          intCheck(v, 0, 8, p);
          ROUNDING_MODE = v;
        }
        if (obj.hasOwnProperty(p = "EXPONENTIAL_AT")) {
          v = obj[p];
          if (v && v.pop) {
            intCheck(v[0], -MAX, 0, p);
            intCheck(v[1], 0, MAX, p);
            TO_EXP_NEG = v[0];
            TO_EXP_POS = v[1];
          } else {
            intCheck(v, -MAX, MAX, p);
            TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
          }
        }
        if (obj.hasOwnProperty(p = "RANGE")) {
          v = obj[p];
          if (v && v.pop) {
            intCheck(v[0], -MAX, -1, p);
            intCheck(v[1], 1, MAX, p);
            MIN_EXP = v[0];
            MAX_EXP = v[1];
          } else {
            intCheck(v, -MAX, MAX, p);
            if (v) {
              MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
            } else {
              throw Error(bignumberError + p + " cannot be zero: " + v);
            }
          }
        }
        if (obj.hasOwnProperty(p = "CRYPTO")) {
          v = obj[p];
          if (v === !!v) {
            if (v) {
              if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
                CRYPTO = v;
              } else {
                CRYPTO = !v;
                throw Error(bignumberError + "crypto unavailable");
              }
            } else {
              CRYPTO = v;
            }
          } else {
            throw Error(bignumberError + p + " not true or false: " + v);
          }
        }
        if (obj.hasOwnProperty(p = "MODULO_MODE")) {
          v = obj[p];
          intCheck(v, 0, 9, p);
          MODULO_MODE = v;
        }
        if (obj.hasOwnProperty(p = "POW_PRECISION")) {
          v = obj[p];
          intCheck(v, 0, MAX, p);
          POW_PRECISION = v;
        }
        if (obj.hasOwnProperty(p = "FORMAT")) {
          v = obj[p];
          if (typeof v == "object") FORMAT = v;
          else throw Error(bignumberError + p + " not an object: " + v);
        }
        if (obj.hasOwnProperty(p = "ALPHABET")) {
          v = obj[p];
          if (typeof v == "string" && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
            alphabetHasNormalDecimalDigits = v.slice(0, 10) == "0123456789";
            ALPHABET = v;
          } else {
            throw Error(bignumberError + p + " invalid: " + v);
          }
        }
      } else {
        throw Error(bignumberError + "Object expected: " + obj);
      }
    }
    return {
      DECIMAL_PLACES,
      ROUNDING_MODE,
      EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
      RANGE: [MIN_EXP, MAX_EXP],
      CRYPTO,
      MODULO_MODE,
      POW_PRECISION,
      FORMAT,
      ALPHABET
    };
  };
  BigNumber2.isBigNumber = function(v) {
    if (!v || v._isBigNumber !== true) return false;
    if (!BigNumber2.DEBUG) return true;
    var i, n, c = v.c, e = v.e, s = v.s;
    out: if ({}.toString.call(c) == "[object Array]") {
      if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {
        if (c[0] === 0) {
          if (e === 0 && c.length === 1) return true;
          break out;
        }
        i = (e + 1) % LOG_BASE;
        if (i < 1) i += LOG_BASE;
        if (String(c[0]).length == i) {
          for (i = 0; i < c.length; i++) {
            n = c[i];
            if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
          }
          if (n !== 0) return true;
        }
      }
    } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
      return true;
    }
    throw Error(bignumberError + "Invalid BigNumber: " + v);
  };
  BigNumber2.maximum = BigNumber2.max = function() {
    return maxOrMin(arguments, -1);
  };
  BigNumber2.minimum = BigNumber2.min = function() {
    return maxOrMin(arguments, 1);
  };
  BigNumber2.random = (function() {
    var pow2_53 = 9007199254740992;
    var random53bitInt = Math.random() * pow2_53 & 2097151 ? function() {
      return mathfloor(Math.random() * pow2_53);
    } : function() {
      return (Math.random() * 1073741824 | 0) * 8388608 + (Math.random() * 8388608 | 0);
    };
    return function(dp) {
      var a, b, e, k, v, i = 0, c = [], rand = new BigNumber2(ONE);
      if (dp == null) dp = DECIMAL_PLACES;
      else intCheck(dp, 0, MAX);
      k = mathceil(dp / LOG_BASE);
      if (CRYPTO) {
        if (crypto.getRandomValues) {
          a = crypto.getRandomValues(new Uint32Array(k *= 2));
          for (; i < k; ) {
            v = a[i] * 131072 + (a[i + 1] >>> 11);
            if (v >= 9e15) {
              b = crypto.getRandomValues(new Uint32Array(2));
              a[i] = b[0];
              a[i + 1] = b[1];
            } else {
              c.push(v % 1e14);
              i += 2;
            }
          }
          i = k / 2;
        } else if (crypto.randomBytes) {
          a = crypto.randomBytes(k *= 7);
          for (; i < k; ) {
            v = (a[i] & 31) * 281474976710656 + a[i + 1] * 1099511627776 + a[i + 2] * 4294967296 + a[i + 3] * 16777216 + (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];
            if (v >= 9e15) {
              crypto.randomBytes(7).copy(a, i);
            } else {
              c.push(v % 1e14);
              i += 7;
            }
          }
          i = k / 7;
        } else {
          CRYPTO = false;
          throw Error(bignumberError + "crypto unavailable");
        }
      }
      if (!CRYPTO) {
        for (; i < k; ) {
          v = random53bitInt();
          if (v < 9e15) c[i++] = v % 1e14;
        }
      }
      k = c[--i];
      dp %= LOG_BASE;
      if (k && dp) {
        v = POWS_TEN[LOG_BASE - dp];
        c[i] = mathfloor(k / v) * v;
      }
      for (; c[i] === 0; c.pop(), i--) ;
      if (i < 0) {
        c = [e = 0];
      } else {
        for (e = -1; c[0] === 0; c.splice(0, 1), e -= LOG_BASE) ;
        for (i = 1, v = c[0]; v >= 10; v /= 10, i++) ;
        if (i < LOG_BASE) e -= LOG_BASE - i;
      }
      rand.e = e;
      rand.c = c;
      return rand;
    };
  })();
  BigNumber2.sum = function() {
    var i = 1, args = arguments, sum = new BigNumber2(args[0]);
    for (; i < args.length; ) sum = sum.plus(args[i++]);
    return sum;
  };
  convertBase = /* @__PURE__ */ (function() {
    var decimal = "0123456789";
    function toBaseOut(str, baseIn, baseOut, alphabet2) {
      var j, arr = [0], arrL, i = 0, len = str.length;
      for (; i < len; ) {
        for (arrL = arr.length; arrL--; arr[arrL] *= baseIn) ;
        arr[0] += alphabet2.indexOf(str.charAt(i++));
        for (j = 0; j < arr.length; j++) {
          if (arr[j] > baseOut - 1) {
            if (arr[j + 1] == null) arr[j + 1] = 0;
            arr[j + 1] += arr[j] / baseOut | 0;
            arr[j] %= baseOut;
          }
        }
      }
      return arr.reverse();
    }
    return function(str, baseIn, baseOut, sign, callerIsToString) {
      var alphabet2, d, e, k, r, x, xc, y, i = str.indexOf("."), dp = DECIMAL_PLACES, rm = ROUNDING_MODE;
      if (i >= 0) {
        k = POW_PRECISION;
        POW_PRECISION = 0;
        str = str.replace(".", "");
        y = new BigNumber2(baseIn);
        x = y.pow(str.length - i);
        POW_PRECISION = k;
        y.c = toBaseOut(
          toFixedPoint(coeffToString(x.c), x.e, "0"),
          10,
          baseOut,
          decimal
        );
        y.e = y.c.length;
      }
      xc = toBaseOut(str, baseIn, baseOut, callerIsToString ? (alphabet2 = ALPHABET, decimal) : (alphabet2 = decimal, ALPHABET));
      e = k = xc.length;
      for (; xc[--k] == 0; xc.pop()) ;
      if (!xc[0]) return alphabet2.charAt(0);
      if (i < 0) {
        --e;
      } else {
        x.c = xc;
        x.e = e;
        x.s = sign;
        x = div(x, y, dp, rm, baseOut);
        xc = x.c;
        r = x.r;
        e = x.e;
      }
      d = e + dp + 1;
      i = xc[d];
      k = baseOut / 2;
      r = r || d < 0 || xc[d + 1] != null;
      r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : i > k || i == k && (rm == 4 || r || rm == 6 && xc[d - 1] & 1 || rm == (x.s < 0 ? 8 : 7));
      if (d < 1 || !xc[0]) {
        str = r ? toFixedPoint(alphabet2.charAt(1), -dp, alphabet2.charAt(0)) : alphabet2.charAt(0);
      } else {
        xc.length = d;
        if (r) {
          for (--baseOut; ++xc[--d] > baseOut; ) {
            xc[d] = 0;
            if (!d) {
              ++e;
              xc = [1].concat(xc);
            }
          }
        }
        for (k = xc.length; !xc[--k]; ) ;
        for (i = 0, str = ""; i <= k; str += alphabet2.charAt(xc[i++])) ;
        str = toFixedPoint(str, e, alphabet2.charAt(0));
      }
      return str;
    };
  })();
  div = /* @__PURE__ */ (function() {
    function multiply(x, k, base) {
      var m, temp, xlo, xhi, carry = 0, i = x.length, klo = k % SQRT_BASE, khi = k / SQRT_BASE | 0;
      for (x = x.slice(); i--; ) {
        xlo = x[i] % SQRT_BASE;
        xhi = x[i] / SQRT_BASE | 0;
        m = khi * xlo + xhi * klo;
        temp = klo * xlo + m % SQRT_BASE * SQRT_BASE + carry;
        carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
        x[i] = temp % base;
      }
      if (carry) x = [carry].concat(x);
      return x;
    }
    function compare3(a, b, aL, bL) {
      var i, cmp;
      if (aL != bL) {
        cmp = aL > bL ? 1 : -1;
      } else {
        for (i = cmp = 0; i < aL; i++) {
          if (a[i] != b[i]) {
            cmp = a[i] > b[i] ? 1 : -1;
            break;
          }
        }
      }
      return cmp;
    }
    function subtract(a, b, aL, base) {
      var i = 0;
      for (; aL--; ) {
        a[aL] -= i;
        i = a[aL] < b[aL] ? 1 : 0;
        a[aL] = i * base + a[aL] - b[aL];
      }
      for (; !a[0] && a.length > 1; a.splice(0, 1)) ;
    }
    return function(x, y, dp, rm, base) {
      var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0, yL, yz, s = x.s == y.s ? 1 : -1, xc = x.c, yc = y.c;
      if (!xc || !xc[0] || !yc || !yc[0]) {
        return new BigNumber2(
          // Return NaN if either NaN, or both Infinity or 0.
          !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN : (
            // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
            xc && xc[0] == 0 || !yc ? s * 0 : s / 0
          )
        );
      }
      q = new BigNumber2(s);
      qc = q.c = [];
      e = x.e - y.e;
      s = dp + e + 1;
      if (!base) {
        base = BASE;
        e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
        s = s / LOG_BASE | 0;
      }
      for (i = 0; yc[i] == (xc[i] || 0); i++) ;
      if (yc[i] > (xc[i] || 0)) e--;
      if (s < 0) {
        qc.push(1);
        more = true;
      } else {
        xL = xc.length;
        yL = yc.length;
        i = 0;
        s += 2;
        n = mathfloor(base / (yc[0] + 1));
        if (n > 1) {
          yc = multiply(yc, n, base);
          xc = multiply(xc, n, base);
          yL = yc.length;
          xL = xc.length;
        }
        xi = yL;
        rem = xc.slice(0, yL);
        remL = rem.length;
        for (; remL < yL; rem[remL++] = 0) ;
        yz = yc.slice();
        yz = [0].concat(yz);
        yc0 = yc[0];
        if (yc[1] >= base / 2) yc0++;
        do {
          n = 0;
          cmp = compare3(yc, rem, yL, remL);
          if (cmp < 0) {
            rem0 = rem[0];
            if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);
            n = mathfloor(rem0 / yc0);
            if (n > 1) {
              if (n >= base) n = base - 1;
              prod = multiply(yc, n, base);
              prodL = prod.length;
              remL = rem.length;
              while (compare3(prod, rem, prodL, remL) == 1) {
                n--;
                subtract(prod, yL < prodL ? yz : yc, prodL, base);
                prodL = prod.length;
                cmp = 1;
              }
            } else {
              if (n == 0) {
                cmp = n = 1;
              }
              prod = yc.slice();
              prodL = prod.length;
            }
            if (prodL < remL) prod = [0].concat(prod);
            subtract(rem, prod, remL, base);
            remL = rem.length;
            if (cmp == -1) {
              while (compare3(yc, rem, yL, remL) < 1) {
                n++;
                subtract(rem, yL < remL ? yz : yc, remL, base);
                remL = rem.length;
              }
            }
          } else if (cmp === 0) {
            n++;
            rem = [0];
          }
          qc[i++] = n;
          if (rem[0]) {
            rem[remL++] = xc[xi] || 0;
          } else {
            rem = [xc[xi]];
            remL = 1;
          }
        } while ((xi++ < xL || rem[0] != null) && s--);
        more = rem[0] != null;
        if (!qc[0]) qc.splice(0, 1);
      }
      if (base == BASE) {
        for (i = 1, s = qc[0]; s >= 10; s /= 10, i++) ;
        round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);
      } else {
        q.e = e;
        q.r = +more;
      }
      return q;
    };
  })();
  function format2(n, i, rm, id) {
    var c0, e, ne, len, str;
    if (rm == null) rm = ROUNDING_MODE;
    else intCheck(rm, 0, 8);
    if (!n.c) return n.toString();
    c0 = n.c[0];
    ne = n.e;
    if (i == null) {
      str = coeffToString(n.c);
      str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS) ? toExponential(str, ne) : toFixedPoint(str, ne, "0");
    } else {
      n = round(new BigNumber2(n), i, rm);
      e = n.e;
      str = coeffToString(n.c);
      len = str.length;
      if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {
        for (; len < i; str += "0", len++) ;
        str = toExponential(str, e);
      } else {
        i -= ne + (id === 2 && e > ne);
        str = toFixedPoint(str, e, "0");
        if (e + 1 > len) {
          if (--i > 0) for (str += "."; i--; str += "0") ;
        } else {
          i += e - len;
          if (i > 0) {
            if (e + 1 == len) str += ".";
            for (; i--; str += "0") ;
          }
        }
      }
    }
    return n.s < 0 && c0 ? "-" + str : str;
  }
  function maxOrMin(args, n) {
    var k, y, i = 1, x = new BigNumber2(args[0]);
    for (; i < args.length; i++) {
      y = new BigNumber2(args[i]);
      if (!y.s || (k = compare2(x, y)) === n || k === 0 && x.s === n) {
        x = y;
      }
    }
    return x;
  }
  function normalise(n, c, e) {
    var i = 1, j = c.length;
    for (; !c[--j]; c.pop()) ;
    for (j = c[0]; j >= 10; j /= 10, i++) ;
    if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {
      n.c = n.e = null;
    } else if (e < MIN_EXP) {
      n.c = [n.e = 0];
    } else {
      n.e = e;
      n.c = c;
    }
    return n;
  }
  parseNumeric = /* @__PURE__ */ (function() {
    var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i, dotAfter = /^([^.]+)\.$/, dotBefore = /^\.([^.]+)$/, isInfinityOrNaN = /^-?(Infinity|NaN)$/, whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
    return function(x, str, isNum, b) {
      var base, s = isNum ? str : str.replace(whitespaceOrPlus, "");
      if (isInfinityOrNaN.test(s)) {
        x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
      } else {
        if (!isNum) {
          s = s.replace(basePrefix, function(m, p1, p2) {
            base = (p2 = p2.toLowerCase()) == "x" ? 16 : p2 == "b" ? 2 : 8;
            return !b || b == base ? p1 : m;
          });
          if (b) {
            base = b;
            s = s.replace(dotAfter, "$1").replace(dotBefore, "0.$1");
          }
          if (str != s) return new BigNumber2(s, base);
        }
        if (BigNumber2.DEBUG) {
          throw Error(bignumberError + "Not a" + (b ? " base " + b : "") + " number: " + str);
        }
        x.s = null;
      }
      x.c = x.e = null;
    };
  })();
  function round(x, sd, rm, r) {
    var d, i, j, k, n, ni, rd, xc = x.c, pows10 = POWS_TEN;
    if (xc) {
      out: {
        for (d = 1, k = xc[0]; k >= 10; k /= 10, d++) ;
        i = sd - d;
        if (i < 0) {
          i += LOG_BASE;
          j = sd;
          n = xc[ni = 0];
          rd = mathfloor(n / pows10[d - j - 1] % 10);
        } else {
          ni = mathceil((i + 1) / LOG_BASE);
          if (ni >= xc.length) {
            if (r) {
              for (; xc.length <= ni; xc.push(0)) ;
              n = rd = 0;
              d = 1;
              i %= LOG_BASE;
              j = i - LOG_BASE + 1;
            } else {
              break out;
            }
          } else {
            n = k = xc[ni];
            for (d = 1; k >= 10; k /= 10, d++) ;
            i %= LOG_BASE;
            j = i - LOG_BASE + d;
            rd = j < 0 ? 0 : mathfloor(n / pows10[d - j - 1] % 10);
          }
        }
        r = r || sd < 0 || // Are there any non-zero digits after the rounding digit?
        // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
        // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
        xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);
        r = rm < 4 ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 && // Check whether the digit to the left of the rounding digit is odd.
        (i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
        if (sd < 1 || !xc[0]) {
          xc.length = 0;
          if (r) {
            sd -= x.e + 1;
            xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
            x.e = -sd || 0;
          } else {
            xc[0] = x.e = 0;
          }
          return x;
        }
        if (i == 0) {
          xc.length = ni;
          k = 1;
          ni--;
        } else {
          xc.length = ni + 1;
          k = pows10[LOG_BASE - i];
          xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
        }
        if (r) {
          for (; ; ) {
            if (ni == 0) {
              for (i = 1, j = xc[0]; j >= 10; j /= 10, i++) ;
              j = xc[0] += k;
              for (k = 1; j >= 10; j /= 10, k++) ;
              if (i != k) {
                x.e++;
                if (xc[0] == BASE) xc[0] = 1;
              }
              break;
            } else {
              xc[ni] += k;
              if (xc[ni] != BASE) break;
              xc[ni--] = 0;
              k = 1;
            }
          }
        }
        for (i = xc.length; xc[--i] === 0; xc.pop()) ;
      }
      if (x.e > MAX_EXP) {
        x.c = x.e = null;
      } else if (x.e < MIN_EXP) {
        x.c = [x.e = 0];
      }
    }
    return x;
  }
  function valueOf(n) {
    var str, e = n.e;
    if (e === null) return n.toString();
    str = coeffToString(n.c);
    str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(str, e) : toFixedPoint(str, e, "0");
    return n.s < 0 ? "-" + str : str;
  }
  P.absoluteValue = P.abs = function() {
    var x = new BigNumber2(this);
    if (x.s < 0) x.s = 1;
    return x;
  };
  P.comparedTo = function(y, b) {
    return compare2(this, new BigNumber2(y, b));
  };
  P.decimalPlaces = P.dp = function(dp, rm) {
    var c, n, v, x = this;
    if (dp != null) {
      intCheck(dp, 0, MAX);
      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);
      return round(new BigNumber2(x), dp + x.e + 1, rm);
    }
    if (!(c = x.c)) return null;
    n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;
    if (v = c[v]) for (; v % 10 == 0; v /= 10, n--) ;
    if (n < 0) n = 0;
    return n;
  };
  P.dividedBy = P.div = function(y, b) {
    return div(this, new BigNumber2(y, b), DECIMAL_PLACES, ROUNDING_MODE);
  };
  P.dividedToIntegerBy = P.idiv = function(y, b) {
    return div(this, new BigNumber2(y, b), 0, 1);
  };
  P.exponentiatedBy = P.pow = function(n, m) {
    var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y, x = this;
    n = new BigNumber2(n);
    if (n.c && !n.isInteger()) {
      throw Error(bignumberError + "Exponent not an integer: " + valueOf(n));
    }
    if (m != null) m = new BigNumber2(m);
    nIsBig = n.e > 14;
    if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {
      y = new BigNumber2(Math.pow(+valueOf(x), nIsBig ? n.s * (2 - isOdd(n)) : +valueOf(n)));
      return m ? y.mod(m) : y;
    }
    nIsNeg = n.s < 0;
    if (m) {
      if (m.c ? !m.c[0] : !m.s) return new BigNumber2(NaN);
      isModExp = !nIsNeg && x.isInteger() && m.isInteger();
      if (isModExp) x = x.mod(m);
    } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0 ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7 : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {
      k = x.s < 0 && isOdd(n) ? -0 : 0;
      if (x.e > -1) k = 1 / k;
      return new BigNumber2(nIsNeg ? 1 / k : k);
    } else if (POW_PRECISION) {
      k = mathceil(POW_PRECISION / LOG_BASE + 2);
    }
    if (nIsBig) {
      half = new BigNumber2(0.5);
      if (nIsNeg) n.s = 1;
      nIsOdd = isOdd(n);
    } else {
      i = Math.abs(+valueOf(n));
      nIsOdd = i % 2;
    }
    y = new BigNumber2(ONE);
    for (; ; ) {
      if (nIsOdd) {
        y = y.times(x);
        if (!y.c) break;
        if (k) {
          if (y.c.length > k) y.c.length = k;
        } else if (isModExp) {
          y = y.mod(m);
        }
      }
      if (i) {
        i = mathfloor(i / 2);
        if (i === 0) break;
        nIsOdd = i % 2;
      } else {
        n = n.times(half);
        round(n, n.e + 1, 1);
        if (n.e > 14) {
          nIsOdd = isOdd(n);
        } else {
          i = +valueOf(n);
          if (i === 0) break;
          nIsOdd = i % 2;
        }
      }
      x = x.times(x);
      if (k) {
        if (x.c && x.c.length > k) x.c.length = k;
      } else if (isModExp) {
        x = x.mod(m);
      }
    }
    if (isModExp) return y;
    if (nIsNeg) y = ONE.div(y);
    return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
  };
  P.integerValue = function(rm) {
    var n = new BigNumber2(this);
    if (rm == null) rm = ROUNDING_MODE;
    else intCheck(rm, 0, 8);
    return round(n, n.e + 1, rm);
  };
  P.isEqualTo = P.eq = function(y, b) {
    return compare2(this, new BigNumber2(y, b)) === 0;
  };
  P.isFinite = function() {
    return !!this.c;
  };
  P.isGreaterThan = P.gt = function(y, b) {
    return compare2(this, new BigNumber2(y, b)) > 0;
  };
  P.isGreaterThanOrEqualTo = P.gte = function(y, b) {
    return (b = compare2(this, new BigNumber2(y, b))) === 1 || b === 0;
  };
  P.isInteger = function() {
    return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
  };
  P.isLessThan = P.lt = function(y, b) {
    return compare2(this, new BigNumber2(y, b)) < 0;
  };
  P.isLessThanOrEqualTo = P.lte = function(y, b) {
    return (b = compare2(this, new BigNumber2(y, b))) === -1 || b === 0;
  };
  P.isNaN = function() {
    return !this.s;
  };
  P.isNegative = function() {
    return this.s < 0;
  };
  P.isPositive = function() {
    return this.s > 0;
  };
  P.isZero = function() {
    return !!this.c && this.c[0] == 0;
  };
  P.minus = function(y, b) {
    var i, j, t, xLTy, x = this, a = x.s;
    y = new BigNumber2(y, b);
    b = y.s;
    if (!a || !b) return new BigNumber2(NaN);
    if (a != b) {
      y.s = -b;
      return x.plus(y);
    }
    var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
    if (!xe || !ye) {
      if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber2(yc ? x : NaN);
      if (!xc[0] || !yc[0]) {
        return yc[0] ? (y.s = -b, y) : new BigNumber2(xc[0] ? x : (
          // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
          ROUNDING_MODE == 3 ? -0 : 0
        ));
      }
    }
    xe = bitFloor(xe);
    ye = bitFloor(ye);
    xc = xc.slice();
    if (a = xe - ye) {
      if (xLTy = a < 0) {
        a = -a;
        t = xc;
      } else {
        ye = xe;
        t = yc;
      }
      t.reverse();
      for (b = a; b--; t.push(0)) ;
      t.reverse();
    } else {
      j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;
      for (a = b = 0; b < j; b++) {
        if (xc[b] != yc[b]) {
          xLTy = xc[b] < yc[b];
          break;
        }
      }
    }
    if (xLTy) {
      t = xc;
      xc = yc;
      yc = t;
      y.s = -y.s;
    }
    b = (j = yc.length) - (i = xc.length);
    if (b > 0) for (; b--; xc[i++] = 0) ;
    b = BASE - 1;
    for (; j > a; ) {
      if (xc[--j] < yc[j]) {
        for (i = j; i && !xc[--i]; xc[i] = b) ;
        --xc[i];
        xc[j] += BASE;
      }
      xc[j] -= yc[j];
    }
    for (; xc[0] == 0; xc.splice(0, 1), --ye) ;
    if (!xc[0]) {
      y.s = ROUNDING_MODE == 3 ? -1 : 1;
      y.c = [y.e = 0];
      return y;
    }
    return normalise(y, xc, ye);
  };
  P.modulo = P.mod = function(y, b) {
    var q, s, x = this;
    y = new BigNumber2(y, b);
    if (!x.c || !y.s || y.c && !y.c[0]) {
      return new BigNumber2(NaN);
    } else if (!y.c || x.c && !x.c[0]) {
      return new BigNumber2(x);
    }
    if (MODULO_MODE == 9) {
      s = y.s;
      y.s = 1;
      q = div(x, y, 0, 3);
      y.s = s;
      q.s *= s;
    } else {
      q = div(x, y, 0, MODULO_MODE);
    }
    y = x.minus(q.times(y));
    if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;
    return y;
  };
  P.multipliedBy = P.times = function(y, b) {
    var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc, base, sqrtBase, x = this, xc = x.c, yc = (y = new BigNumber2(y, b)).c;
    if (!xc || !yc || !xc[0] || !yc[0]) {
      if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
        y.c = y.e = y.s = null;
      } else {
        y.s *= x.s;
        if (!xc || !yc) {
          y.c = y.e = null;
        } else {
          y.c = [0];
          y.e = 0;
        }
      }
      return y;
    }
    e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
    y.s *= x.s;
    xcL = xc.length;
    ycL = yc.length;
    if (xcL < ycL) {
      zc = xc;
      xc = yc;
      yc = zc;
      i = xcL;
      xcL = ycL;
      ycL = i;
    }
    for (i = xcL + ycL, zc = []; i--; zc.push(0)) ;
    base = BASE;
    sqrtBase = SQRT_BASE;
    for (i = ycL; --i >= 0; ) {
      c = 0;
      ylo = yc[i] % sqrtBase;
      yhi = yc[i] / sqrtBase | 0;
      for (k = xcL, j = i + k; j > i; ) {
        xlo = xc[--k] % sqrtBase;
        xhi = xc[k] / sqrtBase | 0;
        m = yhi * xlo + xhi * ylo;
        xlo = ylo * xlo + m % sqrtBase * sqrtBase + zc[j] + c;
        c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
        zc[j--] = xlo % base;
      }
      zc[j] = c;
    }
    if (c) {
      ++e;
    } else {
      zc.splice(0, 1);
    }
    return normalise(y, zc, e);
  };
  P.negated = function() {
    var x = new BigNumber2(this);
    x.s = -x.s || null;
    return x;
  };
  P.plus = function(y, b) {
    var t, x = this, a = x.s;
    y = new BigNumber2(y, b);
    b = y.s;
    if (!a || !b) return new BigNumber2(NaN);
    if (a != b) {
      y.s = -b;
      return x.minus(y);
    }
    var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
    if (!xe || !ye) {
      if (!xc || !yc) return new BigNumber2(a / 0);
      if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber2(xc[0] ? x : a * 0);
    }
    xe = bitFloor(xe);
    ye = bitFloor(ye);
    xc = xc.slice();
    if (a = xe - ye) {
      if (a > 0) {
        ye = xe;
        t = yc;
      } else {
        a = -a;
        t = xc;
      }
      t.reverse();
      for (; a--; t.push(0)) ;
      t.reverse();
    }
    a = xc.length;
    b = yc.length;
    if (a - b < 0) {
      t = yc;
      yc = xc;
      xc = t;
      b = a;
    }
    for (a = 0; b; ) {
      a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
      xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
    }
    if (a) {
      xc = [a].concat(xc);
      ++ye;
    }
    return normalise(y, xc, ye);
  };
  P.precision = P.sd = function(sd, rm) {
    var c, n, v, x = this;
    if (sd != null && sd !== !!sd) {
      intCheck(sd, 1, MAX);
      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);
      return round(new BigNumber2(x), sd, rm);
    }
    if (!(c = x.c)) return null;
    v = c.length - 1;
    n = v * LOG_BASE + 1;
    if (v = c[v]) {
      for (; v % 10 == 0; v /= 10, n--) ;
      for (v = c[0]; v >= 10; v /= 10, n++) ;
    }
    if (sd && x.e + 1 > n) n = x.e + 1;
    return n;
  };
  P.shiftedBy = function(k) {
    intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
    return this.times("1e" + k);
  };
  P.squareRoot = P.sqrt = function() {
    var m, n, r, rep, t, x = this, c = x.c, s = x.s, e = x.e, dp = DECIMAL_PLACES + 4, half = new BigNumber2("0.5");
    if (s !== 1 || !c || !c[0]) {
      return new BigNumber2(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
    }
    s = Math.sqrt(+valueOf(x));
    if (s == 0 || s == 1 / 0) {
      n = coeffToString(c);
      if ((n.length + e) % 2 == 0) n += "0";
      s = Math.sqrt(+n);
      e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);
      if (s == 1 / 0) {
        n = "5e" + e;
      } else {
        n = s.toExponential();
        n = n.slice(0, n.indexOf("e") + 1) + e;
      }
      r = new BigNumber2(n);
    } else {
      r = new BigNumber2(s + "");
    }
    if (r.c[0]) {
      e = r.e;
      s = e + dp;
      if (s < 3) s = 0;
      for (; ; ) {
        t = r;
        r = half.times(t.plus(div(x, t, dp, 1)));
        if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {
          if (r.e < e) --s;
          n = n.slice(s - 3, s + 1);
          if (n == "9999" || !rep && n == "4999") {
            if (!rep) {
              round(t, t.e + DECIMAL_PLACES + 2, 0);
              if (t.times(t).eq(x)) {
                r = t;
                break;
              }
            }
            dp += 4;
            s += 4;
            rep = 1;
          } else {
            if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
              round(r, r.e + DECIMAL_PLACES + 2, 1);
              m = !r.times(r).eq(x);
            }
            break;
          }
        }
      }
    }
    return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
  };
  P.toExponential = function(dp, rm) {
    if (dp != null) {
      intCheck(dp, 0, MAX);
      dp++;
    }
    return format2(this, dp, rm, 1);
  };
  P.toFixed = function(dp, rm) {
    if (dp != null) {
      intCheck(dp, 0, MAX);
      dp = dp + this.e + 1;
    }
    return format2(this, dp, rm);
  };
  P.toFormat = function(dp, rm, format3) {
    var str, x = this;
    if (format3 == null) {
      if (dp != null && rm && typeof rm == "object") {
        format3 = rm;
        rm = null;
      } else if (dp && typeof dp == "object") {
        format3 = dp;
        dp = rm = null;
      } else {
        format3 = FORMAT;
      }
    } else if (typeof format3 != "object") {
      throw Error(bignumberError + "Argument not an object: " + format3);
    }
    str = x.toFixed(dp, rm);
    if (x.c) {
      var i, arr = str.split("."), g1 = +format3.groupSize, g2 = +format3.secondaryGroupSize, groupSeparator = format3.groupSeparator || "", intPart = arr[0], fractionPart = arr[1], isNeg = x.s < 0, intDigits = isNeg ? intPart.slice(1) : intPart, len = intDigits.length;
      if (g2) {
        i = g1;
        g1 = g2;
        g2 = i;
        len -= i;
      }
      if (g1 > 0 && len > 0) {
        i = len % g1 || g1;
        intPart = intDigits.substr(0, i);
        for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);
        if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
        if (isNeg) intPart = "-" + intPart;
      }
      str = fractionPart ? intPart + (format3.decimalSeparator || "") + ((g2 = +format3.fractionGroupSize) ? fractionPart.replace(
        new RegExp("\\d{" + g2 + "}\\B", "g"),
        "$&" + (format3.fractionGroupSeparator || "")
      ) : fractionPart) : intPart;
    }
    return (format3.prefix || "") + str + (format3.suffix || "");
  };
  P.toFraction = function(md) {
    var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s, x = this, xc = x.c;
    if (md != null) {
      n = new BigNumber2(md);
      if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
        throw Error(bignumberError + "Argument " + (n.isInteger() ? "out of range: " : "not an integer: ") + valueOf(n));
      }
    }
    if (!xc) return new BigNumber2(x);
    d = new BigNumber2(ONE);
    n1 = d0 = new BigNumber2(ONE);
    d1 = n0 = new BigNumber2(ONE);
    s = coeffToString(xc);
    e = d.e = s.length - x.e - 1;
    d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
    md = !md || n.comparedTo(d) > 0 ? e > 0 ? d : n1 : n;
    exp = MAX_EXP;
    MAX_EXP = 1 / 0;
    n = new BigNumber2(s);
    n0.c[0] = 0;
    for (; ; ) {
      q = div(n, d, 0, 1);
      d2 = d0.plus(q.times(d1));
      if (d2.comparedTo(md) == 1) break;
      d0 = d1;
      d1 = d2;
      n1 = n0.plus(q.times(d2 = n1));
      n0 = d2;
      d = n.minus(q.times(d2 = d));
      n = d2;
    }
    d2 = div(md.minus(d0), d1, 0, 1);
    n0 = n0.plus(d2.times(n1));
    d0 = d0.plus(d2.times(d1));
    n0.s = n1.s = x.s;
    e = e * 2;
    r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
      div(n0, d0, e, ROUNDING_MODE).minus(x).abs()
    ) < 1 ? [n1, d1] : [n0, d0];
    MAX_EXP = exp;
    return r;
  };
  P.toNumber = function() {
    return +valueOf(this);
  };
  P.toPrecision = function(sd, rm) {
    if (sd != null) intCheck(sd, 1, MAX);
    return format2(this, sd, rm, 2);
  };
  P.toString = function(b) {
    var str, n = this, s = n.s, e = n.e;
    if (e === null) {
      if (s) {
        str = "Infinity";
        if (s < 0) str = "-" + str;
      } else {
        str = "NaN";
      }
    } else {
      if (b == null) {
        str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(coeffToString(n.c), e) : toFixedPoint(coeffToString(n.c), e, "0");
      } else if (b === 10 && alphabetHasNormalDecimalDigits) {
        n = round(new BigNumber2(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
        str = toFixedPoint(coeffToString(n.c), n.e, "0");
      } else {
        intCheck(b, 2, ALPHABET.length, "Base");
        str = convertBase(toFixedPoint(coeffToString(n.c), e, "0"), 10, b, s, true);
      }
      if (s < 0 && n.c[0]) str = "-" + str;
    }
    return str;
  };
  P.valueOf = P.toJSON = function() {
    return valueOf(this);
  };
  P._isBigNumber = true;
  P[Symbol.toStringTag] = "BigNumber";
  P[/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")] = P.valueOf;
  if (configObject != null) BigNumber2.set(configObject);
  return BigNumber2;
}
function bitFloor(n) {
  var i = n | 0;
  return n > 0 || n === i ? i : i - 1;
}
function coeffToString(a) {
  var s, z, i = 1, j = a.length, r = a[0] + "";
  for (; i < j; ) {
    s = a[i++] + "";
    z = LOG_BASE - s.length;
    for (; z--; s = "0" + s) ;
    r += s;
  }
  for (j = r.length; r.charCodeAt(--j) === 48; ) ;
  return r.slice(0, j + 1 || 1);
}
function compare2(x, y) {
  var a, b, xc = x.c, yc = y.c, i = x.s, j = y.s, k = x.e, l = y.e;
  if (!i || !j) return null;
  a = xc && !xc[0];
  b = yc && !yc[0];
  if (a || b) return a ? b ? 0 : -j : i;
  if (i != j) return i;
  a = i < 0;
  b = k == l;
  if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;
  if (!b) return k > l ^ a ? 1 : -1;
  j = (k = xc.length) < (l = yc.length) ? k : l;
  for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;
  return k == l ? 0 : k > l ^ a ? 1 : -1;
}
function intCheck(n, min, max, name) {
  if (n < min || n > max || n !== mathfloor(n)) {
    throw Error(bignumberError + (name || "Argument") + (typeof n == "number" ? n < min || n > max ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(n));
  }
}
function isOdd(n) {
  var k = n.c.length - 1;
  return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
}
function toExponential(str, e) {
  return (str.length > 1 ? str.charAt(0) + "." + str.slice(1) : str) + (e < 0 ? "e" : "e+") + e;
}
function toFixedPoint(str, e, z) {
  var len, zs;
  if (e < 0) {
    for (zs = z + "."; ++e; zs += z) ;
    str = zs + str;
  } else {
    len = str.length;
    if (++e > len) {
      for (zs = z, e -= len; --e; zs += z) ;
      str += zs;
    } else if (e < len) {
      str = str.slice(0, e) + "." + str.slice(e);
    }
  }
  return str;
}
var BigNumber = clone();
var bignumber_default = BigNumber;

// ../../../node_modules/.bun/@paralleldrive+cuid2@3.3.0/node_modules/@paralleldrive/cuid2/src/index.js
var defaultLength = 24;
var bigLength = 32;
var createRandom = () => {
  if (typeof globalThis !== "undefined" && globalThis.crypto && typeof globalThis.crypto.getRandomValues === "function") {
    return () => {
      const buffer = new Uint32Array(1);
      globalThis.crypto.getRandomValues(buffer);
      return buffer[0] / 4294967296;
    };
  }
  return Math.random;
};
var random = createRandom();
var createEntropy = (length = 4, rand = random) => {
  let entropy = "";
  while (entropy.length < length) {
    entropy = entropy + Math.floor(rand() * 36).toString(36);
  }
  return entropy;
};
function bufToBigInt(buf2) {
  let value = new bignumber_default(0);
  for (const i of buf2.values()) {
    value = value.multipliedBy(256).plus(i);
  }
  return value;
}
var hash = (input = "") => {
  const encoder2 = new TextEncoder();
  return bufToBigInt(sha3_512(encoder2.encode(input))).toString(36).slice(1);
};
var alphabet = Array.from(
  { length: 26 },
  (x, i) => String.fromCharCode(i + 97)
);
var randomLetter = (rand) => alphabet[Math.floor(rand() * alphabet.length)];
var createFingerprint = ({
  globalObj = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : {},
  random: rand = random
} = {}) => {
  const globals = Object.keys(globalObj).toString();
  const sourceString = globals.length ? globals + createEntropy(bigLength, rand) : createEntropy(bigLength, rand);
  return hash(sourceString).substring(0, bigLength);
};
var createCounter = (count) => () => {
  return count++;
};
var initialCountMax = 476782367;
var init = ({
  // Fallback if the user does not pass in a CSPRNG. This should be OK
  // because we don't rely solely on the random number generator for entropy.
  // We also use the host fingerprint, current time, and a session counter.
  random: rand = random,
  counter = createCounter(Math.floor(rand() * initialCountMax)),
  length = defaultLength,
  fingerprint = createFingerprint({ random: rand })
} = {}) => {
  if (length > bigLength) {
    throw new Error(
      `Length must be between 2 and ${bigLength}. Received: ${length}`
    );
  }
  return function cuid2() {
    const firstLetter = randomLetter(rand);
    const time = Date.now().toString(36);
    const count = counter().toString(36);
    const salt = createEntropy(length, rand);
    const hashInput = `${time + salt + count + fingerprint}`;
    return `${firstLetter + hash(hashInput).substring(1, length)}`;
  };
};
var createId = lazy(init);
function lazy(fn) {
  let initialized;
  return () => {
    if (!initialized) {
      initialized = fn();
    }
    return initialized();
  };
}

// ../fumadb/src/schema/validate.ts
var import_semver2 = __toESM(require_semver2(), 1);

// ../fumadb/src/utils/deep-equal.ts
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const key of aKeys) {
      if (!(key in b)) return false;
      if (!Object.hasOwn(b, key) || !deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return false;
}

// ../fumadb/src/schema/validate.ts
function validateSchema(schema2) {
  if (!(0, import_semver2.valid)(schema2.version)) {
    throw new Error(`the version ${schema2.version} is invalid.`);
  }
  const tables = Object.values(schema2.tables);
  function validateForeignKey(key) {
    if (key.table === key.referencedTable && (key.onUpdate !== "RESTRICT" || key.onDelete !== "RESTRICT")) {
      throw new Error(
        `[${key.name}] Due to the limitations of MSSQL & Prisma MongoDB, you cannot specify other foreign key actions than "RESTRICT" for self-referencing foreign keys.`
      );
    }
    for (const col of key.columns) {
      if (!col.isNullable && (key.onUpdate === "SET NULL" || key.onDelete === "SET NULL")) {
        throw new Error(
          `[${key.name}] You are using "SET NULL" as foreign key action, but some columns are non-nullable.`
        );
      }
    }
  }
  function isCompositeColumnsUnique(table2, columns) {
    if (columns.length === 1 && columns[0] instanceof IdColumn) return true;
    const columnNames = columns.map((col) => col.ormName);
    for (const con of table2.getUniqueConstraints()) {
      if (deepEqual(
        con.columns.map((col) => col.ormName),
        columnNames
      ))
        return true;
    }
    return false;
  }
  function validateRelation(relation) {
    if (!relation.implied && !relation.foreignKey) {
      throw new Error(
        `[${relation.name}] You must define foreign key for explicit relations due the limitations of Prisma.`
      );
    }
    if (relation.implied) return;
    if (relation.implying?.type === "one" && !isCompositeColumnsUnique(
      relation.referencer,
      relation.on.map(([left]) => relation.referencer.columns[left])
    )) {
      throw new Error(
        `[${relation.name}] one-to-one relations require both sides to be unique or primary key.`
      );
    }
    if (!isCompositeColumnsUnique(
      relation.table,
      relation.on.map(([, right]) => relation.table.columns[right])
    ))
      throw new Error(
        `[${relation.name}] For any explicit relations, the referenced columns must be unique or primary key.`
      );
  }
  for (const table2 of tables) {
    for (const foreignKey of table2.foreignKeys) {
      validateForeignKey(foreignKey);
    }
    for (const relation of Object.values(table2.relations)) {
      validateRelation(relation);
    }
  }
}

// ../fumadb/src/schema/create.ts
var RelationInit = class {
  type;
  referencedTable;
  referencer;
  constructor(type, referencedTable, referencer) {
    this.type = type;
    this.referencedTable = referencedTable;
    this.referencer = referencer;
  }
};
var ImplicitRelationInit = class extends RelationInit {
  init(ormName, impliedBy) {
    const output = {
      id: impliedBy.id,
      on: impliedBy.on.map(([left, right]) => [right, left]),
      type: this.type,
      table: this.referencedTable,
      implied: true,
      impliedBy,
      name: ormName,
      referencer: this.referencer
    };
    impliedBy.implying = output;
    return output;
  }
};
var ExplicitRelationInit = class extends RelationInit {
  foreignKeyConfig;
  implyingRelationName;
  on = [];
  imply(implyingRelationName) {
    this.implyingRelationName = implyingRelationName;
    return this;
  }
  initForeignKey(ormName) {
    const config = this.foreignKeyConfig;
    if (!config) return;
    const columns = [];
    const referencedColumns = [];
    for (const [left, right] of this.on) {
      columns.push(this.referencer.columns[left]);
      referencedColumns.push(this.referencedTable.columns[right]);
    }
    return {
      columns,
      referencedColumns,
      referencedTable: this.referencedTable,
      table: this.referencer,
      name: config.name ?? `${this.referencer.ormName}_${this.referencedTable.ormName}_${ormName}_fk`,
      onDelete: config.onDelete ?? "RESTRICT",
      onUpdate: config.onUpdate ?? "RESTRICT"
    };
  }
  init(ormName) {
    let id = `${this.referencer.ormName}_${this.referencedTable.ormName}`;
    if (this.implyingRelationName) id += `_${this.implyingRelationName}`;
    return {
      id,
      implied: false,
      foreignKey: this.initForeignKey(ormName),
      implying: void 0,
      on: this.on,
      name: ormName,
      referencer: this.referencer,
      table: this.referencedTable,
      type: this.type
    };
  }
  /**
   * Define foreign key for explicit relation, please note that:
   *
   * - this constraint is ignored for MongoDB (without Prisma).
   * - you **must** define foreign key for explicit relations, due to the limitations of Prisma.
   */
  foreignKey(config = {}) {
    this.foreignKeyConfig = config;
    return this;
  }
};
var Column = class _Column {
  type;
  ormName = "";
  isNullable = false;
  isUnique = false;
  default;
  table = void 0;
  initNames;
  get names() {
    return this.initNames(this.ormName);
  }
  set names(v) {
    this.initNames = () => v;
  }
  constructor(type, onInitNames) {
    this.type = type;
    this.initNames = onInitNames;
  }
  nullable(nullable) {
    this.isNullable = nullable ?? true;
    return this;
  }
  /**
   * Add unique constraint to the field, for consistency, duplicated null values are allowed.
   */
  unique(unique = true) {
    this.isUnique = unique;
    return this;
  }
  /**
   * Generate default value on runtime
   */
  defaultTo$(fn) {
    this.default = { runtime: fn };
    return this;
  }
  /**
   * Set a database-level default value
   *
   * For schemaless database, it's still generated on runtime
   */
  defaultTo(value) {
    this.default = { value };
    return this;
  }
  clone() {
    const clone2 = new _Column(this.type, () => this.names);
    clone2.ormName = this.ormName;
    clone2.isNullable = this.isNullable;
    clone2.isUnique = this.isUnique;
    clone2.default = this.default;
    clone2.table = this.table;
    return clone2;
  }
  getUniqueConstraintName() {
    return `unique_c_${this.table.ormName}_${this.ormName}`;
  }
  /**
   * Generate default value for the column on runtime.
   */
  generateDefaultValue() {
    if (!this.default) return;
    if ("value" in this.default) return this.default.value;
    if (this.default.runtime === "auto") return createId();
    if (this.default.runtime === "now")
      return new Date(Date.now());
    return this.default.runtime();
  }
  get $in() {
    throw new Error("Type inference only");
  }
  get $out() {
    throw new Error("Type inference only");
  }
};
var IdColumn = class _IdColumn extends Column {
  id = true;
  constructor(type, onInitNames) {
    super(type, (ormName) => ({
      ...onInitNames(ormName),
      mongodb: "_id"
    }));
  }
  clone() {
    const clone2 = new _IdColumn(this.type, () => this.names);
    clone2.ormName = this.ormName;
    clone2.isNullable = this.isNullable;
    clone2.isUnique = this.isUnique;
    clone2.default = this.default;
    clone2.table = this.table;
    return clone2;
  }
  defaultTo$(fn) {
    return super.defaultTo$(fn);
  }
  defaultTo(value) {
    return super.defaultTo(value);
  }
};
function column(name, type) {
  return new Column(
    type,
    (ormName) => typeof name === "string" ? nameVariants(name, ormName) : nameVariants(ormName, ormName, name)
  );
}
function idColumn(name, type) {
  return new IdColumn(
    type,
    (ormName) => typeof name === "string" ? nameVariants(name, ormName) : nameVariants(ormName, ormName, name)
  );
}
function relationBuilder(tables, k) {
  const referencer = tables[k];
  return {
    one(another, ...on) {
      if (on.length > 0) {
        const init2 = new ExplicitRelationInit(
          "one",
          tables[another],
          referencer
        );
        init2.on = on;
        return init2;
      }
      return new ImplicitRelationInit(
        "one",
        tables[another],
        referencer
      );
    },
    many(another) {
      return new ImplicitRelationInit("many", tables[another], referencer);
    }
  };
}
function table(name, columns) {
  let idCol;
  let names;
  const uniqueConstraints = [];
  const policies = [];
  const out = {
    ormName: "",
    get names() {
      if (names) return names;
      return typeof name === "string" ? nameVariants(name, out.ormName) : nameVariants(out.ormName, out.ormName, name);
    },
    set names(v) {
      names = v;
    },
    columns,
    relations: {},
    foreignKeys: [],
    policies,
    getUniqueConstraints(level = "all") {
      const result = [];
      if (level === "all" || level === "table")
        result.push(...uniqueConstraints);
      if (level === "all" || level === "column") {
        for (const col of Object.values(this.columns)) {
          if (!col.isUnique) continue;
          result.push({
            name: col.getUniqueConstraintName(),
            columns: [col]
          });
        }
      }
      return result;
    },
    getColumnByName(name2, type = "sql") {
      return Object.values(this.columns).find((c) => c.names[type] === name2);
    },
    getIdColumn() {
      return idCol;
    },
    unique(name2, columns2) {
      uniqueConstraints.push({
        name: name2,
        columns: columns2.map((name3) => {
          const column2 = this.columns[name3];
          if (!column2)
            throw new Error(`Unknown column name ${name3.toString()}`);
          return column2;
        })
      });
      return this;
    },
    policy(policy) {
      policies.push(policy);
      return this;
    },
    clone() {
      const cloneColumns = {};
      for (const [k, v] of Object.entries(columns)) {
        cloneColumns[k] = v.clone();
      }
      const clone2 = table(name, cloneColumns);
      for (const con of uniqueConstraints) {
        clone2.unique(
          con.name,
          con.columns.map((col) => col.ormName)
        );
      }
      clone2.policies.push(...policies);
      return clone2;
    }
  };
  for (const k in columns) {
    const column2 = columns[k];
    if (!column2) {
      delete columns[k];
      continue;
    }
    column2.table = out;
    column2.ormName = k;
    if (column2 instanceof IdColumn) idCol = column2;
  }
  if (idCol === void 0) {
    throw new Error(`there's no id column in your table ${name}`);
  }
  return out;
}
function schema(config) {
  const { tables, relations } = config;
  for (const k in tables) {
    if (!tables[k]) {
      delete tables[k];
      continue;
    }
    tables[k].ormName = k;
  }
  if (relations) setRelations(tables, relations);
  const out = {
    ...config,
    tables: config.tables,
    clone() {
      const cloneTables = {};
      for (const [k, v] of Object.entries(tables)) {
        cloneTables[k] = v.clone();
      }
      return schema({
        ...config,
        tables: cloneTables
      });
    }
  };
  validateSchema(out);
  return out;
}
function setRelations(tables, relationsMap) {
  const impliedRelations = [];
  const explicitRelations = [];
  for (const k in relationsMap) {
    const relationFn = relationsMap[k];
    if (!relationFn) continue;
    const table2 = tables[k];
    const relations = relationFn(relationBuilder(tables, k));
    for (const name in relations) {
      const relation = relations[name];
      if (!relation) continue;
      if (relation instanceof ImplicitRelationInit) {
        impliedRelations.push({
          relationName: name,
          relation
        });
        continue;
      }
      if (relation instanceof ExplicitRelationInit) {
        const output = relation.init(name);
        explicitRelations.push({
          relation: output,
          implicitRelationName: relation.implyingRelationName
        });
        table2.relations[name] = output;
        if (output.foreignKey) table2.foreignKeys.push(output.foreignKey);
      }
    }
  }
  for (const { relation, relationName } of impliedRelations) {
    const referencer = relation.referencer;
    const explicits = explicitRelations.filter((item) => {
      if (item.implicitRelationName) {
        return item.implicitRelationName === relationName;
      }
      return item.relation.table === referencer && item.relation.referencer === relation.referencedTable;
    });
    if (explicits.length !== 1)
      throw new Error(
        `Cannot resolve implied relation ${relationName} in table "${relation.referencer.ormName}", you may want to specify \`imply()\` on the explicit relation.`
      );
    referencer.relations[relationName] = relation.init(
      relationName,
      explicits[0].relation
    );
  }
}
function nameVariants(rawName, ormName, names) {
  return {
    convex: ormName,
    drizzle: ormName,
    prisma: ormName,
    mongodb: rawName,
    sql: rawName,
    ...names
  };
}

// ../fumadb/src/adapters/memory/index.ts
var cloneValue = (value) => {
  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof Uint8Array) return new Uint8Array(value);
  if (Array.isArray(value)) return value.map((item) => cloneValue(item));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, cloneValue(item)])
    );
  }
  return value;
};
var comparable = (value) => {
  if (value instanceof Date) return value.getTime();
  return value;
};
var columnValue = (row, column2) => row[column2.ormName];
var matchesCondition = (row, condition) => {
  if (!condition) return true;
  switch (condition.type) {
    case 0 /* And */:
      return condition.items.every((item) => matchesCondition(row, item));
    case 1 /* Or */:
      return condition.items.some((item) => matchesCondition(row, item));
    case 3 /* Not */:
      return !matchesCondition(row, condition.item);
    case 2 /* Compare */:
      break;
    default:
      return false;
  }
  const left = comparable(columnValue(row, condition.a));
  const right = condition.b instanceof Column ? comparable(columnValue(row, condition.b)) : comparable(condition.b);
  switch (condition.operator) {
    case "=":
      return left === right;
    case "!=":
      return left !== right;
    case ">":
      return left != null && right != null && left > right;
    case ">=":
      return left != null && right != null && left >= right;
    case "<":
      return left != null && right != null && left < right;
    case "<=":
      return left != null && right != null && left <= right;
    case "is":
      return right === null ? left == null : left === right;
    case "is not":
      return right === null ? left != null : left !== right;
    case "in":
      return Array.isArray(right) && right.includes(left);
    case "not in":
      return Array.isArray(right) && !right.includes(left);
    case "contains":
      return typeof left === "string" && typeof right === "string" && left.includes(right);
    case "not contains":
      return !(typeof left === "string" && typeof right === "string" && left.includes(right));
    case "starts with":
      return typeof left === "string" && typeof right === "string" && left.startsWith(right);
    case "not starts with":
      return !(typeof left === "string" && typeof right === "string" && left.startsWith(right));
    case "ends with":
      return typeof left === "string" && typeof right === "string" && left.endsWith(right);
    case "not ends with":
      return !(typeof left === "string" && typeof right === "string" && left.endsWith(right));
  }
};
var tableRows = (db, table2) => {
  db[table2.ormName] ??= [];
  return db[table2.ormName];
};
var applyDefaults = (table2, values) => {
  const row = {};
  for (const column2 of Object.values(table2.columns)) {
    if (Object.hasOwn(values, column2.ormName) && values[column2.ormName] !== void 0) {
      row[column2.ormName] = cloneValue(values[column2.ormName]);
      continue;
    }
    const defaultValue = column2.generateDefaultValue();
    if (defaultValue !== void 0) row[column2.ormName] = cloneValue(defaultValue);
    else if (column2.isNullable) row[column2.ormName] = null;
  }
  return row;
};
var selectRow = (table2, row, select) => {
  if (select === true) return cloneValue(row);
  return Object.fromEntries(select.map((key) => [key, cloneValue(row[key])]));
};
function memoryAdapter(options = {}) {
  const db = options.db ?? {};
  return {
    name: "memory",
    createORM(schema2) {
      let orm;
      orm = toORM({
        tables: schema2.tables,
        async count(table2, v) {
          return tableRows(db, table2).filter((row) => matchesCondition(row, v.where)).length;
        },
        async findFirst(table2, v) {
          return (await this.findMany(table2, { ...v, limit: 1 }))[0] ?? null;
        },
        async findMany(table2, v) {
          if (v.join?.length) throw new Error("[FumaDB Memory] Joins are not supported.");
          let rows = tableRows(db, table2).filter((row) => matchesCondition(row, v.where));
          for (const [column2, direction] of [...v.orderBy ?? []].reverse()) {
            rows = [...rows].sort((a, b) => {
              const left = comparable(columnValue(a, column2));
              const right = comparable(columnValue(b, column2));
              if (left == null && right == null) return 0;
              if (left == null) return direction === "asc" ? -1 : 1;
              if (right == null) return direction === "asc" ? 1 : -1;
              if (left < right) return direction === "asc" ? -1 : 1;
              if (left > right) return direction === "asc" ? 1 : -1;
              return 0;
            });
          }
          const offset = v.offset ?? 0;
          const limited = rows.slice(offset, v.limit === void 0 ? void 0 : offset + v.limit);
          return limited.map((row) => selectRow(table2, row, v.select));
        },
        async updateMany(table2, v) {
          for (const row of tableRows(db, table2)) {
            if (!matchesCondition(row, v.where)) continue;
            Object.assign(row, cloneValue(v.set));
          }
        },
        async upsert(table2, v) {
          const existing = tableRows(db, table2).find((row) => matchesCondition(row, v.where));
          if (existing) {
            Object.assign(existing, cloneValue(v.update));
            return;
          }
          await this.create(table2, v.create);
        },
        async create(table2, values) {
          const row = applyDefaults(table2, values);
          tableRows(db, table2).push(row);
          return cloneValue(row);
        },
        async createMany(table2, values) {
          const idColumn2 = table2.getIdColumn();
          return Promise.all(values.map((value) => this.create(table2, value))).then(
            (rows) => rows.map((row) => ({ _id: row[idColumn2.ormName] }))
          );
        },
        async deleteMany(table2, v) {
          const rows = tableRows(db, table2);
          db[table2.ormName] = rows.filter((row) => !matchesCondition(row, v.where));
        },
        async transaction(run) {
          const snapshot = cloneValue(db);
          try {
            return await run(orm);
          } catch (error) {
            for (const key of Object.keys(db)) delete db[key];
            Object.assign(db, snapshot);
            throw error;
          }
        }
      });
      return orm;
    },
    async getSchemaVersion() {
      return void 0;
    }
  };
}

// ../../../node_modules/.bun/fractional-indexing@3.2.0/node_modules/fractional-indexing/src/index.js
var BASE_62_DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
function midpoint(a, b, digits) {
  const zero = digits[0];
  if (b != null && a >= b) {
    throw new Error(a + " >= " + b);
  }
  if (a.slice(-1) === zero || b && b.slice(-1) === zero) {
    throw new Error("trailing zero");
  }
  if (b) {
    let n = 0;
    while ((a[n] || zero) === b[n]) {
      n++;
    }
    if (n > 0) {
      return b.slice(0, n) + midpoint(a.slice(n), b.slice(n), digits);
    }
  }
  const digitA = a ? digits.indexOf(a[0]) : 0;
  const digitB = b != null ? digits.indexOf(b[0]) : digits.length;
  if (digitB - digitA > 1) {
    const midDigit = Math.round(0.5 * (digitA + digitB));
    return digits[midDigit];
  } else {
    if (b && b.length > 1) {
      return b.slice(0, 1);
    } else {
      return digits[digitA] + midpoint(a.slice(1), null, digits);
    }
  }
}
function validateInteger(int) {
  if (int.length !== getIntegerLength(int[0])) {
    throw new Error("invalid integer part of order key: " + int);
  }
}
function getIntegerLength(head) {
  if (head >= "a" && head <= "z") {
    return head.charCodeAt(0) - "a".charCodeAt(0) + 2;
  } else if (head >= "A" && head <= "Z") {
    return "Z".charCodeAt(0) - head.charCodeAt(0) + 2;
  } else {
    throw new Error("invalid order key head: " + head);
  }
}
function getIntegerPart(key) {
  const integerPartLength = getIntegerLength(key[0]);
  if (integerPartLength > key.length) {
    throw new Error("invalid order key: " + key);
  }
  return key.slice(0, integerPartLength);
}
function validateOrderKey(key, digits) {
  if (key === "A" + digits[0].repeat(26)) {
    throw new Error("invalid order key: " + key);
  }
  const i = getIntegerPart(key);
  const f = key.slice(i.length);
  if (f.slice(-1) === digits[0]) {
    throw new Error("invalid order key: " + key);
  }
}
function incrementInteger(x, digits) {
  validateInteger(x);
  const [head, ...digs] = x.split("");
  let carry = true;
  for (let i = digs.length - 1; carry && i >= 0; i--) {
    const d = digits.indexOf(digs[i]) + 1;
    if (d === digits.length) {
      digs[i] = digits[0];
    } else {
      digs[i] = digits[d];
      carry = false;
    }
  }
  if (carry) {
    if (head === "Z") {
      return "a" + digits[0];
    }
    if (head === "z") {
      return null;
    }
    const h = String.fromCharCode(head.charCodeAt(0) + 1);
    if (h > "a") {
      digs.push(digits[0]);
    } else {
      digs.pop();
    }
    return h + digs.join("");
  } else {
    return head + digs.join("");
  }
}
function decrementInteger(x, digits) {
  validateInteger(x);
  const [head, ...digs] = x.split("");
  let borrow = true;
  for (let i = digs.length - 1; borrow && i >= 0; i--) {
    const d = digits.indexOf(digs[i]) - 1;
    if (d === -1) {
      digs[i] = digits.slice(-1);
    } else {
      digs[i] = digits[d];
      borrow = false;
    }
  }
  if (borrow) {
    if (head === "a") {
      return "Z" + digits.slice(-1);
    }
    if (head === "A") {
      return null;
    }
    const h = String.fromCharCode(head.charCodeAt(0) - 1);
    if (h < "Z") {
      digs.push(digits.slice(-1));
    } else {
      digs.pop();
    }
    return h + digs.join("");
  } else {
    return head + digs.join("");
  }
}
function generateKeyBetween(a, b, digits = BASE_62_DIGITS) {
  if (a != null) {
    validateOrderKey(a, digits);
  }
  if (b != null) {
    validateOrderKey(b, digits);
  }
  if (a != null && b != null && a >= b) {
    throw new Error(a + " >= " + b);
  }
  if (a == null) {
    if (b == null) {
      return "a" + digits[0];
    }
    const ib2 = getIntegerPart(b);
    const fb2 = b.slice(ib2.length);
    if (ib2 === "A" + digits[0].repeat(26)) {
      return ib2 + midpoint("", fb2, digits);
    }
    if (ib2 < b) {
      return ib2;
    }
    const res = decrementInteger(ib2, digits);
    if (res == null) {
      throw new Error("cannot decrement any more");
    }
    return res;
  }
  if (b == null) {
    const ia2 = getIntegerPart(a);
    const fa2 = a.slice(ia2.length);
    const i2 = incrementInteger(ia2, digits);
    return i2 == null ? ia2 + midpoint(fa2, null, digits) : i2;
  }
  const ia = getIntegerPart(a);
  const fa = a.slice(ia.length);
  const ib = getIntegerPart(b);
  const fb = b.slice(ib.length);
  if (ia === ib) {
    return ia + midpoint(fa, fb, digits);
  }
  const i = incrementInteger(ia, digits);
  if (i == null) {
    throw new Error("cannot increment any more");
  }
  if (i < b) {
    return i;
  }
  return ia + midpoint(fa, null, digits);
}

// ../sdk/src/fuma-runtime.ts
import { Cause, Context, Data, Effect, Exit, Layer, Predicate } from "effect";
var StorageError = class extends Data.TaggedError("StorageError") {
};
var UniqueViolationError = class extends Data.TaggedError("UniqueViolationError") {
};
var isUniqueViolation = (cause) => {
  let current = cause;
  for (let i = 0; i < 5; i += 1) {
    const err = current && typeof current === "object" ? current : null;
    if (!err) return false;
    const code = err["code"];
    const message = err["message"];
    const innerCause = err["cause"];
    if (code === "23505") return true;
    if (typeof message === "string" && /unique constraint|duplicate key|violates unique constraint/i.test(message)) {
      return true;
    }
    if (!innerCause || innerCause === current) return false;
    current = innerCause;
  }
  return false;
};
var causeMessage = (cause) => {
  const message = cause && typeof cause === "object" ? (
    // oxlint-disable-next-line executor/no-unknown-error-message -- boundary: preserve database driver error text inside typed StorageError
    cause["message"]
  ) : void 0;
  return typeof message === "string" && message.length > 0 ? message : void 0;
};
var isStorageFailure = (error) => Predicate.isTagged(error, "StorageError") || Predicate.isTagged(error, "UniqueViolationError");
var fumaFailureFromCause = (label, cause) => {
  if (isStorageFailure(cause)) return cause;
  if (isUniqueViolation(cause)) return new UniqueViolationError({ model: label });
  return new StorageError({
    message: causeMessage(cause) ?? `FumaDB operation failed: ${label}`,
    cause
  });
};
var fumaEffect = (label, run) => Effect.tryPromise({
  try: run,
  catch: (cause) => fumaFailureFromCause(label, cause)
});
var activeFumaDbRef = Context.Reference("executor/ActiveFumaDb", {
  defaultValue: () => null
});
var TransactionEffectFailure = class {
  constructor(error) {
    this.error = error;
  }
  error;
};
var TransactionEffectDefect = class {
  constructor(cause) {
    this.cause = cause;
  }
  cause;
};
var isAllowedTable = (tables, table2) => tables === void 0 || typeof table2 === "string" && tables.has(table2);
var assertAllowedTable = (tables, table2) => {
  if (isAllowedTable(tables, table2)) return;
  throw new StorageError({
    message: `FumaDB table "${String(table2)}" is not available through this storage boundary.`,
    cause: void 0
  });
};
var makeSafeFumaQuery = (db, options) => {
  const table2 = (name) => {
    assertAllowedTable(options.tables, name);
    return name;
  };
  const query = {
    count: (name, value) => db.count(table2(name), value),
    create: (name, value) => db.create(table2(name), value),
    createMany: (name, values) => db.createMany(table2(name), values),
    deleteMany: (name, value) => db.deleteMany(table2(name), value),
    findFirst: (name, value) => db.findFirst(table2(name), value),
    findMany: (name, value) => db.findMany(table2(name), value),
    transaction: (run) => db.transaction((transactionDb) => run(makeSafeFumaQuery(transactionDb, options))),
    updateMany: (name, value) => db.updateMany(table2(name), value),
    upsert: (name, value) => db.upsert(table2(name), value)
  };
  return Object.freeze(query);
};
var makeFumaClient = (db, options = {}) => {
  const use = (label, fn) => Effect.flatMap(
    Effect.service(activeFumaDbRef),
    (active) => fumaEffect(label, () => fn(makeSafeFumaQuery(active ?? db, options)))
  ).pipe(Effect.withSpan(`fumadb.${label}`));
  const transaction = (effect) => Effect.flatMap(Effect.service(activeFumaDbRef), (active) => {
    if (active) return effect;
    return Effect.tryPromise({
      try: () => db.transaction(async (transactionDb) => {
        const exit = await Effect.runPromiseExit(
          effect.pipe(Effect.provideService(activeFumaDbRef, transactionDb))
        );
        if (Exit.isSuccess(exit)) return exit.value;
        const failure = exit.cause.reasons.find(Cause.isFailReason);
        if (failure) throw new TransactionEffectFailure(failure.error);
        throw new TransactionEffectDefect(exit.cause);
      }),
      catch: (cause) => {
        if (cause instanceof TransactionEffectFailure) return cause.error;
        if (cause instanceof TransactionEffectDefect) {
          return fumaFailureFromCause("transaction", cause.cause);
        }
        return fumaFailureFromCause("transaction", cause);
      }
    });
  }).pipe(Effect.withSpan("fumadb.transaction"));
  return { use, transaction };
};
var FumaClient = class extends Context.Service()("executor/FumaClient") {
  static layer = (db) => Layer.succeed(this)(makeFumaClient(db));
};

// ../sdk/src/blob.ts
import { Effect as Effect2 } from "effect";
var nsFor = (partition, pluginId) => `${partition}/${pluginId}`;
var pluginBlobStore = (store, partitions, pluginId) => {
  const readNamespaces = () => (partitions.user == null ? [partitions.org] : [partitions.user, partitions.org]).map(
    (p) => nsFor(p, pluginId)
  );
  const partitionFor = (owner) => {
    if (owner === "org") return Effect2.succeed(partitions.org);
    if (partitions.user == null) {
      return Effect2.fail(
        new StorageError({
          message: 'Blob write targets owner "user" but the executor has no subject.',
          cause: void 0
        })
      );
    }
    return Effect2.succeed(partitions.user);
  };
  return {
    get: (key) => Effect2.gen(function* () {
      const namespaces = readNamespaces();
      const hits = yield* store.getMany(namespaces, key);
      if (hits.size === 0) return null;
      for (const ns of namespaces) {
        const v = hits.get(ns);
        if (v !== void 0) return v;
      }
      return null;
    }),
    put: (key, value, options) => Effect2.flatMap(
      partitionFor(options.owner),
      (partition) => store.put(nsFor(partition, pluginId), key, value)
    ),
    delete: (key, options) => Effect2.flatMap(
      partitionFor(options.owner),
      (partition) => store.delete(nsFor(partition, pluginId), key)
    ),
    has: (key) => store.getMany(readNamespaces(), key).pipe(Effect2.map((hits) => hits.size > 0))
  };
};
var blobId = (namespace, key) => JSON.stringify([namespace, key]);
var toBlobRows = (rows) => rows;
var makeFumaBlobStore = (fuma) => ({
  get: (namespace, key) => fuma.use(
    "blob.get",
    (db) => db.findFirst("blob", {
      where: (b) => b.and(b("namespace", "=", namespace), b("key", "=", key))
    })
  ).pipe(Effect2.map((row) => row)).pipe(
    Effect2.map((row) => row?.value ?? null),
    Effect2.mapError(
      (cause) => new StorageError({ message: "FumaDB blob operation failed", cause })
    )
  ),
  getMany: (namespaces, key) => namespaces.length === 0 ? Effect2.succeed(/* @__PURE__ */ new Map()) : fuma.use(
    "blob.getMany",
    (db) => db.findMany("blob", {
      where: (b) => b.and(b("namespace", "in", [...namespaces]), b("key", "=", key))
    })
  ).pipe(Effect2.map(toBlobRows)).pipe(
    Effect2.map((rows) => {
      const out = /* @__PURE__ */ new Map();
      for (const row of rows) out.set(row.namespace, row.value);
      return out;
    }),
    Effect2.mapError(
      (cause) => new StorageError({ message: "FumaDB blob operation failed", cause })
    )
  ),
  put: (namespace, key, value) => Effect2.gen(function* () {
    const id = blobId(namespace, key);
    const existing = yield* fuma.use(
      "blob.findForPut",
      (db) => db.findFirst("blob", { where: (b) => b("id", "=", id) })
    );
    if (existing) {
      yield* fuma.use(
        "blob.update",
        (db) => db.updateMany("blob", { where: (b) => b("id", "=", id), set: { value } })
      );
      return;
    }
    yield* fuma.use("blob.create", (db) => db.create("blob", { id, namespace, key, value }));
  }).pipe(
    Effect2.mapError(
      (cause) => new StorageError({ message: "FumaDB blob operation failed", cause })
    )
  ),
  delete: (namespace, key) => fuma.use(
    "blob.delete",
    (db) => db.deleteMany("blob", { where: (b) => b("id", "=", blobId(namespace, key)) })
  ).pipe(
    Effect2.asVoid,
    Effect2.mapError(
      (cause) => new StorageError({ message: "FumaDB blob operation failed", cause })
    )
  ),
  has: (namespace, key) => fuma.use(
    "blob.has",
    (db) => db.count("blob", { where: (b) => b("id", "=", blobId(namespace, key)) })
  ).pipe(
    Effect2.map((count) => count > 0),
    Effect2.mapError(
      (cause) => new StorageError({ message: "FumaDB blob operation failed", cause })
    )
  )
});

// ../sdk/src/core-tools.ts
import { Effect as Effect4, Schema as Schema3 } from "effect";

// ../sdk/src/plugin.ts
import { Effect as Effect3 } from "effect";
var decodeStaticToolArgs = (schema2, args) => {
  if (schema2 == null) return Effect3.succeed(args);
  return Effect3.promise(() => Promise.resolve(schema2["~standard"].validate(args))).pipe(
    Effect3.flatMap(
      (result) => "value" in result ? Effect3.succeed(result.value) : Effect3.fail(result)
    )
  );
};
var tool = (input) => ({
  name: input.name,
  description: input.description,
  inputSchema: input.inputSchema,
  outputSchema: input.outputSchema,
  annotations: input.annotations,
  handler: ({ args, ctx, elicit }) => decodeStaticToolArgs(input.inputSchema, args).pipe(
    Effect3.flatMap(
      (decoded) => input.execute(
        decoded,
        { ctx, elicit }
      )
    )
  )
});
function definePlugin(authorFactory) {
  return (options) => {
    const {
      storage: storageOverride,
      ...rest
    } = options ?? {};
    const hasAuthorOptions = Object.keys(rest).length > 0;
    const spec = authorFactory(hasAuthorOptions ? rest : void 0);
    return {
      ...spec,
      storage: storageOverride ?? spec.storage
    };
  };
}

// ../sdk/src/policies.ts
import { Match, Schema as Schema2 } from "effect";
var matchPattern = (pattern, toolId) => {
  if (pattern === "*") return true;
  const patternSegments = pattern.split(".");
  const toolSegments = toolId.split(".");
  for (let i = 0; i < patternSegments.length; i++) {
    const seg = patternSegments[i];
    if (seg === "*") {
      if (i === patternSegments.length - 1) return toolSegments.length >= i;
      if (i >= toolSegments.length) return false;
      continue;
    }
    if (i >= toolSegments.length || toolSegments[i] !== seg) return false;
  }
  return patternSegments.length === toolSegments.length;
};
var isValidPattern = (pattern) => {
  if (pattern.length === 0) return false;
  if (pattern === "*") return true;
  if (pattern.startsWith(".") || pattern.endsWith(".")) return false;
  if (pattern.includes("..")) return false;
  if (pattern.startsWith("*")) return false;
  const segments = pattern.split(".");
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (seg.length === 0) return false;
    if (seg.includes("*") && seg !== "*") return false;
  }
  return true;
};
var comparePolicyRow = (a, b) => {
  const pa = a.position;
  const pb = b.position;
  if (pa < pb) return -1;
  if (pa > pb) return 1;
  const ia = a.id;
  const ib = b.id;
  return ia < ib ? -1 : ia > ib ? 1 : 0;
};
var actionRestrictionRank = (action) => Match.value(action).pipe(
  Match.when("block", () => 3),
  Match.when("require_approval", () => 2),
  Match.when("approve", () => 1),
  Match.exhaustive
);
var moreRestrictive = (current, candidate) => {
  if (!current) return candidate;
  const currentRank = actionRestrictionRank(current.action);
  const candidateRank = actionRestrictionRank(candidate.action);
  return candidateRank > currentRank ? candidate : current;
};
var resolveToolPolicy = (toolId, policies, ownerRank) => {
  if (policies.length === 0) return void 0;
  const sorted = [...policies].sort((a, b) => {
    const sa = ownerRank(a);
    const sb = ownerRank(b);
    if (sa !== sb) return sa - sb;
    return comparePolicyRow(a, b);
  });
  const firstMatchByOwner = /* @__PURE__ */ new Map();
  for (const row of sorted) {
    if (firstMatchByOwner.has(row.owner)) continue;
    if (matchPattern(row.pattern, toolId)) {
      firstMatchByOwner.set(row.owner, {
        action: row.action,
        pattern: row.pattern,
        policyId: row.id
      });
    }
  }
  let selected;
  for (const match of firstMatchByOwner.values()) {
    selected = moreRestrictive(selected, match);
  }
  return selected;
};
var liftPlugin = (defaultRequiresApproval) => defaultRequiresApproval ? { action: "require_approval", source: "plugin-default" } : { action: "approve", source: "plugin-default" };
var liftUser = (match) => ({
  action: match.action,
  source: "user",
  pattern: match.pattern,
  policyId: match.policyId
});
var resolveEffectivePolicy = (toolId, policies, ownerRank, defaultRequiresApproval) => {
  const match = resolveToolPolicy(toolId, policies, ownerRank);
  return match ? liftUser(match) : liftPlugin(defaultRequiresApproval);
};
var rowToToolPolicy = (row) => ({
  id: PolicyId.make(row.id),
  owner: row.owner,
  pattern: row.pattern,
  action: row.action,
  position: row.position,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});
var ToolPolicyActionSchema = Schema2.Literals(["approve", "require_approval", "block"]);

// ../sdk/src/core-tools.ts
var schemaToStandard = (schema2) => Schema3.toStandardSchemaV1(Schema3.toStandardJSONSchemaV1(schema2));
var OwnerSchema = Schema3.Literals(["org", "user"]);
var OAuthGrantSchema = Schema3.Literals(["authorization_code", "client_credentials"]);
var IntegrationOutput = Schema3.Struct({
  slug: Schema3.String,
  description: Schema3.String,
  kind: Schema3.String,
  canRemove: Schema3.Boolean,
  canRefresh: Schema3.Boolean
});
var IntegrationsListOutput = Schema3.Struct({
  integrations: Schema3.Array(IntegrationOutput)
});
var DetectInput = Schema3.Struct({ url: Schema3.String });
var DetectOutput = Schema3.Struct({
  results: Schema3.Array(
    Schema3.Struct({
      kind: Schema3.String,
      confidence: Schema3.Literals(["high", "medium", "low"]),
      endpoint: Schema3.String,
      name: Schema3.String,
      slug: Schema3.String
    })
  )
});
var ConnectionOutput = Schema3.Struct({
  owner: OwnerSchema,
  name: Schema3.String,
  integration: Schema3.String,
  template: Schema3.String,
  provider: Schema3.String,
  address: Schema3.String,
  identityLabel: Schema3.optional(Schema3.NullOr(Schema3.String)),
  description: Schema3.optional(Schema3.NullOr(Schema3.String)),
  expiresAt: Schema3.NullOr(Schema3.Number),
  oauthClient: Schema3.NullOr(Schema3.String),
  oauthClientOwner: Schema3.NullOr(OwnerSchema),
  oauthScope: Schema3.NullOr(Schema3.String)
});
var ConnectionsListInput = Schema3.Struct({
  integration: Schema3.optional(Schema3.String),
  owner: Schema3.optional(OwnerSchema),
  verbose: Schema3.optional(Schema3.Boolean)
});
var ConnectionListItem = Schema3.Struct({
  owner: OwnerSchema,
  name: Schema3.String,
  integration: Schema3.String,
  template: Schema3.String,
  provider: Schema3.String,
  address: Schema3.String,
  identityLabel: Schema3.optional(Schema3.NullOr(Schema3.String)),
  description: Schema3.optional(Schema3.NullOr(Schema3.String)),
  expiresAt: Schema3.NullOr(Schema3.Number),
  oauthClient: Schema3.NullOr(Schema3.String),
  oauthClientOwner: Schema3.NullOr(OwnerSchema),
  oauthScopeCount: Schema3.NullOr(Schema3.Number),
  oauthScope: Schema3.optional(Schema3.NullOr(Schema3.String))
});
var ConnectionsListOutput = Schema3.Struct({
  connections: Schema3.Array(ConnectionListItem)
});
var ConnectionCreateHandoffInput = Schema3.Struct({
  integration: Schema3.String,
  owner: Schema3.optional(OwnerSchema),
  template: Schema3.optional(Schema3.String),
  label: Schema3.optional(Schema3.String)
});
var ConnectionCreateHandoffOutput = Schema3.Struct({
  url: Schema3.String,
  instructions: Schema3.String
});
var ConnectionFromInput = Schema3.Struct({
  provider: Schema3.String,
  id: Schema3.String
});
var ConnectionInputOriginInput = Schema3.Struct({ from: ConnectionFromInput });
var ConnectionCreateInput = Schema3.Struct({
  owner: OwnerSchema,
  name: Schema3.String,
  integration: Schema3.String,
  template: Schema3.String,
  identityLabel: Schema3.optional(Schema3.NullOr(Schema3.String)),
  from: Schema3.optional(ConnectionFromInput),
  inputs: Schema3.optional(Schema3.Record(Schema3.String, ConnectionInputOriginInput))
}).check(
  Schema3.makeFilter((payload) => {
    const originCount = (payload.from === void 0 ? 0 : 1) + (payload.inputs === void 0 ? 0 : 1);
    const isNoAuth = String(payload.template) === String(NO_AUTH_TEMPLATE);
    if (isNoAuth) {
      if (originCount > 0) {
        return 'A no-auth connection (template "none") takes no provider credential origin';
      }
    } else if (originCount !== 1) {
      return "Expected exactly one provider credential origin";
    }
    if (payload.inputs !== void 0 && Object.keys(payload.inputs).length === 0) {
      return "Expected at least one provider credential input";
    }
    return void 0;
  })
);
var ConnectionRefInput = Schema3.Struct({
  owner: OwnerSchema,
  name: Schema3.String,
  integration: Schema3.String
});
var ToolOutput = Schema3.Struct({
  address: Schema3.String,
  owner: OwnerSchema,
  integration: Schema3.String,
  connection: Schema3.String,
  name: Schema3.String,
  pluginId: Schema3.String,
  description: Schema3.String
});
var ConnectionsRefreshOutput = Schema3.Struct({
  tools: Schema3.Array(ToolOutput)
});
var RemovedOutput = Schema3.Struct({ removed: Schema3.Boolean });
var CancelledOutput = Schema3.Struct({ cancelled: Schema3.Boolean });
var ProvidersOutput = Schema3.Struct({
  providers: Schema3.Array(Schema3.String)
});
var ProviderItemsInput = Schema3.Struct({ provider: Schema3.String });
var ProviderItemsOutput = Schema3.Struct({
  items: Schema3.Array(Schema3.Struct({ id: Schema3.String, name: Schema3.String }))
});
var PolicyOutput = Schema3.Struct({
  id: Schema3.String,
  owner: OwnerSchema,
  pattern: Schema3.String,
  action: Schema3.String,
  position: Schema3.String
});
var PoliciesListOutput = Schema3.Struct({
  policies: Schema3.Array(PolicyOutput)
});
var PolicyCreateInput = Schema3.Struct({
  owner: OwnerSchema,
  pattern: Schema3.String,
  action: ToolPolicyActionSchema
});
var PolicyUpdateInput = Schema3.Struct({
  id: Schema3.String,
  owner: OwnerSchema,
  pattern: Schema3.optional(Schema3.String),
  action: Schema3.optional(ToolPolicyActionSchema)
});
var PolicyRemoveInput = Schema3.Struct({
  id: Schema3.String,
  owner: OwnerSchema
});
var OAuthClientOutput = Schema3.Struct({
  owner: OwnerSchema,
  slug: Schema3.String,
  grant: OAuthGrantSchema,
  authorizationUrl: Schema3.String,
  tokenUrl: Schema3.String,
  resource: Schema3.optional(Schema3.NullOr(Schema3.String)),
  clientId: Schema3.String,
  origin: Schema3.Union([
    Schema3.Struct({ kind: Schema3.Literal("manual") }),
    Schema3.Struct({
      kind: Schema3.Literal("dynamic_client_registration"),
      integration: Schema3.optional(Schema3.NullOr(Schema3.String))
    })
  ])
});
var OAuthClientsListOutput = Schema3.Struct({
  clients: Schema3.Array(OAuthClientOutput)
});
var OAuthCreateClientInput = Schema3.Struct({
  owner: OwnerSchema,
  slug: Schema3.String,
  authorizationUrl: Schema3.String,
  tokenUrl: Schema3.String,
  grant: OAuthGrantSchema,
  clientId: Schema3.String,
  resource: Schema3.optional(Schema3.NullOr(Schema3.String)),
  /** Integration whose connect dialog registered this manual app. Recorded so
   *  the picker can match it by intent (exact) instead of by root domain. */
  originIntegration: Schema3.optional(Schema3.NullOr(Schema3.String))
});
var OAuthCreateClientHandoffInput = Schema3.Struct({
  integration: Schema3.String,
  owner: Schema3.optional(OwnerSchema),
  slug: Schema3.optional(Schema3.String),
  grant: Schema3.optional(OAuthGrantSchema),
  clientId: Schema3.optional(Schema3.String),
  authorizationUrl: Schema3.optional(Schema3.String),
  tokenUrl: Schema3.optional(Schema3.String),
  resource: Schema3.optional(Schema3.NullOr(Schema3.String)),
  label: Schema3.optional(Schema3.String)
});
var OAuthCreateClientHandoffOutput = Schema3.Struct({
  url: Schema3.String,
  instructions: Schema3.String
});
var OAuthClientOutputRef = Schema3.Struct({
  client: Schema3.String
});
var OAuthRegisterDynamicInput = Schema3.Struct({
  owner: OwnerSchema,
  slug: Schema3.String,
  issuer: Schema3.optional(Schema3.NullOr(Schema3.String)),
  registrationEndpoint: Schema3.String,
  authorizationUrl: Schema3.String,
  tokenUrl: Schema3.String,
  resource: Schema3.optional(Schema3.NullOr(Schema3.String)),
  scopes: Schema3.Array(Schema3.String),
  tokenEndpointAuthMethodsSupported: Schema3.optional(Schema3.Array(Schema3.String)),
  clientName: Schema3.optional(Schema3.String),
  redirectUri: Schema3.optional(Schema3.NullOr(Schema3.String)),
  originIntegration: Schema3.optional(Schema3.NullOr(Schema3.String))
});
var OAuthRemoveClientInput = Schema3.Struct({
  owner: OwnerSchema,
  slug: Schema3.String
});
var OAuthProbeInput = Schema3.Struct({
  url: Schema3.String
});
var OAuthProbeOutput = Schema3.Struct({
  issuer: Schema3.optional(Schema3.NullOr(Schema3.String)),
  authorizationUrl: Schema3.String,
  tokenUrl: Schema3.String,
  resource: Schema3.optional(Schema3.NullOr(Schema3.String)),
  scopesSupported: Schema3.optional(Schema3.Array(Schema3.String)),
  registrationEndpoint: Schema3.optional(Schema3.NullOr(Schema3.String)),
  tokenEndpointAuthMethodsSupported: Schema3.optional(Schema3.Array(Schema3.String)),
  clientIdMetadataDocumentSupported: Schema3.optional(Schema3.Boolean)
});
var OAuthStartInput = Schema3.Struct({
  client: Schema3.String,
  clientOwner: OwnerSchema,
  owner: OwnerSchema,
  name: Schema3.String,
  integration: Schema3.String,
  template: Schema3.String,
  identityLabel: Schema3.optional(Schema3.NullOr(Schema3.String)),
  redirectUri: Schema3.optional(Schema3.NullOr(Schema3.String))
});
var OAuthStartOutput = Schema3.Union([
  Schema3.Struct({
    status: Schema3.Literal("connected"),
    connection: ConnectionOutput
  }),
  Schema3.Struct({
    status: Schema3.Literal("redirect"),
    authorizationUrl: Schema3.String,
    state: Schema3.String
  })
]);
var OAuthCancelInput = Schema3.Struct({
  state: Schema3.String
});
var IntegrationsListOutputStd = schemaToStandard(IntegrationsListOutput);
var DetectInputStd = schemaToStandard(DetectInput);
var DetectOutputStd = schemaToStandard(DetectOutput);
var ConnectionsListInputStd = schemaToStandard(ConnectionsListInput);
var ConnectionsListOutputStd = schemaToStandard(ConnectionsListOutput);
var ConnectionCreateHandoffInputStd = schemaToStandard(ConnectionCreateHandoffInput);
var ConnectionCreateHandoffOutputStd = schemaToStandard(ConnectionCreateHandoffOutput);
var ConnectionCreateInputStd = schemaToStandard(ConnectionCreateInput);
var ConnectionOutputStd = schemaToStandard(ConnectionOutput);
var ConnectionRefInputStd = schemaToStandard(ConnectionRefInput);
var ConnectionsRefreshOutputStd = schemaToStandard(ConnectionsRefreshOutput);
var RemovedOutputStd = schemaToStandard(RemovedOutput);
var CancelledOutputStd = schemaToStandard(CancelledOutput);
var ProvidersOutputStd = schemaToStandard(ProvidersOutput);
var ProviderItemsInputStd = schemaToStandard(ProviderItemsInput);
var ProviderItemsOutputStd = schemaToStandard(ProviderItemsOutput);
var PoliciesListOutputStd = schemaToStandard(PoliciesListOutput);
var PolicyOutputStd = schemaToStandard(PolicyOutput);
var PolicyCreateInputStd = schemaToStandard(PolicyCreateInput);
var PolicyUpdateInputStd = schemaToStandard(PolicyUpdateInput);
var PolicyRemoveInputStd = schemaToStandard(PolicyRemoveInput);
var OAuthClientsListOutputStd = schemaToStandard(OAuthClientsListOutput);
var OAuthCreateClientInputStd = schemaToStandard(OAuthCreateClientInput);
var OAuthCreateClientHandoffInputStd = schemaToStandard(OAuthCreateClientHandoffInput);
var OAuthCreateClientHandoffOutputStd = schemaToStandard(OAuthCreateClientHandoffOutput);
var OAuthClientOutputRefStd = schemaToStandard(OAuthClientOutputRef);
var OAuthRegisterDynamicInputStd = schemaToStandard(OAuthRegisterDynamicInput);
var OAuthRemoveClientInputStd = schemaToStandard(OAuthRemoveClientInput);
var OAuthProbeInputStd = schemaToStandard(OAuthProbeInput);
var OAuthProbeOutputStd = schemaToStandard(OAuthProbeOutput);
var OAuthStartInputStd = schemaToStandard(OAuthStartInput);
var OAuthStartOutputStd = schemaToStandard(OAuthStartOutput);
var OAuthCancelInputStd = schemaToStandard(OAuthCancelInput);
var connectionToOutput = (connection) => ({
  owner: connection.owner,
  name: String(connection.name),
  integration: String(connection.integration),
  template: String(connection.template),
  provider: String(connection.provider),
  address: String(connection.address),
  identityLabel: connection.identityLabel ?? null,
  description: connection.description ?? null,
  expiresAt: connection.expiresAt ?? null,
  oauthClient: connection.oauthClient == null ? null : String(connection.oauthClient),
  oauthClientOwner: connection.oauthClientOwner ?? null,
  oauthScope: connection.oauthScope ?? null
});
var oauthScopeCount = (scope) => scope == null ? null : scope.split(/\s+/).filter(Boolean).length;
var connectionToListItem = (connection, verbose) => ({
  owner: connection.owner,
  name: String(connection.name),
  integration: String(connection.integration),
  template: String(connection.template),
  provider: String(connection.provider),
  address: String(connection.address),
  identityLabel: connection.identityLabel ?? null,
  description: connection.description ?? null,
  expiresAt: connection.expiresAt ?? null,
  oauthClient: connection.oauthClient == null ? null : String(connection.oauthClient),
  oauthClientOwner: connection.oauthClientOwner ?? null,
  oauthScopeCount: oauthScopeCount(connection.oauthScope),
  ...verbose ? { oauthScope: connection.oauthScope ?? null } : {}
});
var toolToOutput = (toolRow) => ({
  address: String(toolRow.address),
  owner: toolRow.owner,
  integration: String(toolRow.integration),
  connection: String(toolRow.connection),
  name: String(toolRow.name),
  pluginId: toolRow.pluginId,
  description: toolRow.description
});
var connectionRefFromInput = (input) => ({
  owner: input.owner,
  integration: IntegrationSlug.make(input.integration),
  name: ConnectionName.make(input.name)
});
var originFromInput = (origin) => ({
  from: {
    provider: ProviderKey.make(origin.from.provider),
    id: ProviderItemId.make(origin.from.id)
  }
});
var createConnectionInputFromTool = (input) => {
  const base = {
    owner: input.owner,
    name: ConnectionName.make(input.name),
    integration: IntegrationSlug.make(input.integration),
    template: AuthTemplateSlug.make(input.template),
    identityLabel: input.identityLabel ?? null
  };
  if (input.from !== void 0) {
    return {
      ...base,
      from: {
        provider: ProviderKey.make(input.from.provider),
        id: ProviderItemId.make(input.from.id)
      }
    };
  }
  return {
    ...base,
    inputs: Object.fromEntries(
      Object.entries(input.inputs ?? {}).map(([variable, origin]) => [
        variable,
        originFromInput(origin)
      ])
    )
  };
};
var connectionCreateHandoffUrl = (webBaseUrl, orgSlug, input) => {
  const search = new URLSearchParams({ addAccount: "1" });
  if (input.owner !== void 0) search.set("owner", input.owner);
  if (input.template !== void 0) search.set("template", input.template);
  if (input.label !== void 0) search.set("label", input.label);
  const orgPrefix = orgSlug !== void 0 && orgSlug.length > 0 ? `/${orgSlug}` : "";
  const path = `${orgPrefix}/integrations/${encodeURIComponent(input.integration)}?${search.toString()}`;
  if (webBaseUrl === void 0 || webBaseUrl.length === 0) return path;
  return new URL(path, webBaseUrl.endsWith("/") ? webBaseUrl : `${webBaseUrl}/`).toString();
};
var oauthClientCreateHandoffUrl = (webBaseUrl, orgSlug, input) => {
  const search = new URLSearchParams({ addAccount: "1", oauthClient: "1" });
  if (input.owner !== void 0) search.set("owner", input.owner);
  if (input.slug !== void 0) search.set("clientSlug", input.slug);
  if (input.grant !== void 0) search.set("grant", input.grant);
  if (input.clientId !== void 0) search.set("clientId", input.clientId);
  if (input.authorizationUrl !== void 0) search.set("authorizationUrl", input.authorizationUrl);
  if (input.tokenUrl !== void 0) search.set("tokenUrl", input.tokenUrl);
  if (input.resource != null && input.resource.length > 0) search.set("resource", input.resource);
  if (input.label !== void 0) search.set("label", input.label);
  const orgPrefix = orgSlug !== void 0 && orgSlug.length > 0 ? `/${orgSlug}` : "";
  const path = `${orgPrefix}/integrations/${encodeURIComponent(input.integration)}?${search.toString()}`;
  if (webBaseUrl === void 0 || webBaseUrl.length === 0) return path;
  return new URL(path, webBaseUrl.endsWith("/") ? webBaseUrl : `${webBaseUrl}/`).toString();
};
var coreToolsPlugin = definePlugin((options = {}) => ({
  id: "core-tools",
  packageName: "@executor-js/sdk/core-tools",
  storage: () => ({}),
  extension: () => ({}),
  staticIntegrations: () => [
    {
      id: "coreTools",
      kind: "executor",
      name: "Executor",
      tools: [
        tool({
          name: "integrations.list",
          description: "List integrations in the workspace catalog (slug, description, owning plugin kind). Connections authenticate against these.",
          outputSchema: IntegrationsListOutputStd,
          execute: (_args, { ctx }) => Effect4.map(ctx.core.integrations.list(), (integrations) => ({
            integrations: integrations.map((i) => ({
              slug: String(i.slug),
              description: i.description,
              kind: i.kind,
              canRemove: i.canRemove,
              canRefresh: i.canRefresh
            }))
          }))
        }),
        tool({
          name: "integrations.detect",
          description: "Given a URL, ask every plugin whether it recognizes it, returning best-confidence matches so the UI can pre-fill onboarding for the right plugin.",
          inputSchema: DetectInputStd,
          outputSchema: DetectOutputStd,
          execute: (input, { ctx }) => Effect4.map(ctx.core.integrations.detect(input.url), (results) => ({
            results: results.map((r) => ({
              kind: r.kind,
              confidence: r.confidence,
              endpoint: r.endpoint,
              name: r.name,
              slug: r.slug
            }))
          }))
        }),
        tool({
          name: "connections.list",
          description: "List saved connections (the credential for one integration). Never returns the credential value. Optionally filter by integration or owner. OAuth scopes are summarized as `oauthScopeCount` by default; pass `verbose: true` to include the full `oauthScope` grant string per connection.",
          inputSchema: ConnectionsListInputStd,
          outputSchema: ConnectionsListOutputStd,
          execute: (input, { ctx }) => Effect4.map(
            ctx.connections.list({
              integration: input.integration === void 0 ? void 0 : IntegrationSlug.make(input.integration),
              owner: input.owner === void 0 ? void 0 : input.owner
            }),
            (connections) => ({
              connections: connections.map(
                (connection) => connectionToListItem(connection, input.verbose === true)
              )
            })
          )
        }),
        tool({
          name: "connections.create",
          description: 'Low-level create or replace for a saved connection from provider item references. For a no-auth integration (public MCP server, public REST API), pass `template: "none"` with no `from`/`inputs` to wire it up directly. For normal API keys/tokens, use `connections.createHandoff` so the user enters the credential in the web UI. OAuth credentials should use `oauth.start`.',
          inputSchema: ConnectionCreateInputStd,
          outputSchema: ConnectionOutputStd,
          // Creating a connection binds a credential reference and roots a new
          // tool catalog: every tool that connection produces then becomes
          // callable. Even the no-auth (`template: "none"`) path pulls tools
          // from an arbitrary endpoint. Prompt-injected code could silently
          // wire an attacker-chosen integration or credential, so this is
          // approval-gated (the v1 `sources.configure` carried the same guard).
          annotations: { requiresApproval: true },
          execute: (input, { ctx }) => Effect4.map(
            ctx.connections.create(createConnectionInputFromTool(input)),
            connectionToOutput
          )
        }),
        tool({
          name: "connections.createHandoff",
          description: "Return a browser URL that opens the Add account flow for one integration. Use this for API keys/tokens so the user enters secrets directly in the web UI instead of sending them through the agent. Optionally preselect owner, auth template, and a non-secret label.",
          inputSchema: ConnectionCreateHandoffInputStd,
          outputSchema: ConnectionCreateHandoffOutputStd,
          execute: (input) => {
            const url = connectionCreateHandoffUrl(options.webBaseUrl, options.orgSlug, input);
            return Effect4.succeed({
              url,
              instructions: "Ask the user to open this URL and add the account in the Executor web UI. Do not ask them to paste the credential value into chat. After they finish, call connections.list for the integration to discover the created connection."
            });
          }
        }),
        tool({
          name: "connections.remove",
          description: "Remove a saved connection and its produced tools by owner, integration, and connection name.",
          inputSchema: ConnectionRefInputStd,
          outputSchema: RemovedOutputStd,
          // Deleting a connection drops it and every tool it produced, which
          // prompt-injected code could use to disrupt an integration or force a
          // re-add flow. Approval-gated, matching v1 `sources.remove`.
          annotations: { requiresApproval: true },
          execute: (input, { ctx }) => Effect4.map(ctx.connections.remove(connectionRefFromInput(input)), () => ({
            removed: true
          }))
        }),
        tool({
          name: "connections.refresh",
          description: "Re-run an integration's tool production for a saved connection, replacing that connection's persisted tools.",
          inputSchema: ConnectionRefInputStd,
          outputSchema: ConnectionsRefreshOutputStd,
          // Refresh replaces a connection's persisted tool set; for a mutable
          // upstream (an MCP server whose catalog can change) this can swap in
          // different tools without confirmation. Approval-gated, matching v1
          // `sources.refresh`.
          annotations: { requiresApproval: true },
          execute: (input, { ctx }) => Effect4.map(ctx.connections.refresh(connectionRefFromInput(input)), (tools) => ({
            tools: tools.map(toolToOutput)
          }))
        }),
        // removed: tools.list — the cross-connection tool catalog is an
        // executor-surface read, not exposed on PluginCtx.
        ...options.includeProviders === false ? [] : [
          tool({
            name: "providers.list",
            description: "List registered credential provider keys (the storage backends, not API vendors). Use `providers.items` to browse a backend's entries.",
            outputSchema: ProvidersOutputStd,
            execute: (_args, { ctx }) => Effect4.map(ctx.providers.list(), (providers2) => ({
              providers: providers2.map((p) => String(p))
            }))
          }),
          tool({
            name: "providers.items",
            description: "Browse a credential provider's items for discovery (pick a 1Password / keychain entry). Returns opaque ids and labels, never values.",
            inputSchema: ProviderItemsInputStd,
            outputSchema: ProviderItemsOutputStd,
            execute: (input, { ctx }) => Effect4.map(ctx.providers.items(ProviderKey.make(input.provider)), (items) => ({
              items: items.map((i) => ({ id: String(i.id), name: i.name }))
            }))
          })
        ],
        tool({
          name: "oauth.clients.list",
          description: "List registered OAuth clients visible to this executor. Returns metadata only; client secrets are never returned.",
          outputSchema: OAuthClientsListOutputStd,
          execute: (_args, { ctx }) => Effect4.map(ctx.oauth.listClients(), (clients) => ({
            clients: clients.map((client) => ({
              owner: client.owner,
              slug: String(client.slug),
              grant: client.grant,
              authorizationUrl: client.authorizationUrl,
              tokenUrl: client.tokenUrl,
              resource: client.resource ?? null,
              clientId: client.clientId
            }))
          }))
        }),
        tool({
          name: "oauth.clients.create",
          description: "Register or replace an owner-scoped OAuth client WITHOUT a client secret: a PUBLIC client (PKCE / authorization_code) or a discovery-prefill placeholder. To register a CONFIDENTIAL client that has a secret, call `oauth.clients.createHandoff` instead so the human enters the secret in the web UI; never pass a client secret through this tool.",
          inputSchema: OAuthCreateClientInputStd,
          outputSchema: OAuthClientOutputRefStd,
          // This persists an OAuth client and REPLACES on slug collision. It
          // takes NO client secret: a secret would have to travel through the
          // agent's context window, so a confidential app is registered by the
          // human via `oauth.clients.createHandoff`. An empty secret registers a
          // PUBLIC client. The remaining risk is the write itself: prompt-injected
          // code could register a client with an attacker-controlled
          // authorizationUrl/tokenUrl, then drive `oauth.start` to mint a
          // connection and route the user's tokens to the attacker. The
          // highest-value gate here; matches v1 `sources.bindings.set`, which
          // guarded credential writes.
          annotations: { requiresApproval: true },
          execute: (input, { ctx }) => Effect4.map(
            ctx.oauth.createClient({
              owner: input.owner,
              slug: OAuthClientSlug.make(input.slug),
              authorizationUrl: input.authorizationUrl,
              tokenUrl: input.tokenUrl,
              grant: input.grant,
              clientId: input.clientId,
              // No secret crosses the agent boundary; an empty secret registers
              // a public client. Confidential clients go through
              // `oauth.clients.createHandoff`.
              clientSecret: "",
              resource: input.resource ?? null,
              origin: {
                kind: "manual",
                integration: input.originIntegration == null ? null : IntegrationSlug.make(input.originIntegration)
              }
            }),
            (client) => ({ client: String(client) })
          )
        }),
        tool({
          name: "oauth.clients.createHandoff",
          description: "Return a browser URL that opens the Register-OAuth-app form for one integration, pre-filled with the non-secret fields (client id, endpoints, grant). Use this for any CONFIDENTIAL OAuth app: the user types the client secret directly in the web UI instead of sending it through the agent. After they register the app, call `oauth.clients.list` to discover its owner and slug, then `oauth.start`.",
          inputSchema: OAuthCreateClientHandoffInputStd,
          outputSchema: OAuthCreateClientHandoffOutputStd,
          // Pure URL builder: no DB write, no token, no secret. This is the SAFE
          // path (it routes the secret to the human in the browser), so it is
          // deliberately NOT approval-gated, mirroring `connections.createHandoff`.
          execute: (input) => {
            const url = oauthClientCreateHandoffUrl(options.webBaseUrl, options.orgSlug, input);
            return Effect4.succeed({
              url,
              instructions: "Ask the user to open this URL and register the OAuth app in the Executor web UI, entering the client secret there. Do not ask them to paste the client secret into chat. After they finish, call oauth.clients.list to find the registered client (owner + slug), then oauth.start."
            });
          }
        }),
        tool({
          name: "oauth.clients.registerDynamic",
          description: "Register an OAuth client through RFC 7591 Dynamic Client Registration and save the minted client for later `oauth.start` calls.",
          inputSchema: OAuthRegisterDynamicInputStd,
          outputSchema: OAuthClientOutputRefStd,
          // Same risk class as `oauth.clients.create`: registers a client at a
          // caller-supplied endpoint and persists the minted credentials for
          // later `oauth.start` abuse. Approval-gated. See `oauth.clients.create`.
          annotations: { requiresApproval: true },
          execute: (input, { ctx }) => Effect4.map(
            ctx.oauth.registerDynamicClient({
              owner: input.owner,
              slug: OAuthClientSlug.make(input.slug),
              issuer: input.issuer ?? null,
              registrationEndpoint: input.registrationEndpoint,
              authorizationUrl: input.authorizationUrl,
              tokenUrl: input.tokenUrl,
              resource: input.resource ?? null,
              scopes: input.scopes,
              tokenEndpointAuthMethodsSupported: input.tokenEndpointAuthMethodsSupported,
              clientName: input.clientName,
              redirectUri: input.redirectUri,
              originIntegration: input.originIntegration == null ? null : IntegrationSlug.make(input.originIntegration)
            }),
            (client) => ({ client: String(client) })
          )
        }),
        tool({
          name: "oauth.clients.remove",
          description: "Remove an owner-scoped OAuth client by owner and slug. Existing connections are not cascaded.",
          inputSchema: OAuthRemoveClientInputStd,
          outputSchema: RemovedOutputStd,
          // Removing a client breaks token refresh for every connection that
          // depends on it (a silent DoS) and can force re-auth through an
          // attacker-supplied replacement. Approval-gated, matching v1
          // `sources.bindings.remove`.
          annotations: { requiresApproval: true },
          execute: (input, { ctx }) => Effect4.map(
            ctx.oauth.removeClient(input.owner, OAuthClientSlug.make(input.slug)),
            () => ({ removed: true })
          )
        }),
        tool({
          name: "oauth.probe",
          description: "Discover OAuth authorization-server metadata from an issuer or protected-resource URL so client registration can be pre-filled.",
          inputSchema: OAuthProbeInputStd,
          outputSchema: OAuthProbeOutputStd,
          execute: (input, { ctx }) => Effect4.map(ctx.oauth.probe({ url: input.url }), (result) => ({
            issuer: result.issuer ?? null,
            authorizationUrl: result.authorizationUrl,
            tokenUrl: result.tokenUrl,
            resource: result.resource ?? null,
            scopesSupported: result.scopesSupported,
            registrationEndpoint: result.registrationEndpoint ?? null,
            tokenEndpointAuthMethodsSupported: result.tokenEndpointAuthMethodsSupported,
            clientIdMetadataDocumentSupported: result.clientIdMetadataDocumentSupported
          }))
        }),
        tool({
          name: "oauth.start",
          description: "Start OAuth through a registered client to mint a connection for an integration. `client_credentials` clients return `connected`; authorization-code clients return an authorization URL and state.",
          inputSchema: OAuthStartInputStd,
          outputSchema: OAuthStartOutputStd,
          // This is the materialization step that turns a registered client
          // into a live connection. For `client_credentials` it completes
          // synchronously (status `connected`) with no browser step, so a
          // prompt-injected call against an attacker-registered client mints a
          // credentialed connection with no human in the loop. The
          // authorization-code path already returns a URL the user must visit,
          // but one gate on the whole tool covers the silent path cleanly.
          annotations: { requiresApproval: true },
          execute: (input, { ctx }) => Effect4.map(
            ctx.oauth.start({
              client: OAuthClientSlug.make(input.client),
              clientOwner: input.clientOwner,
              owner: input.owner,
              name: ConnectionName.make(input.name),
              integration: IntegrationSlug.make(input.integration),
              template: AuthTemplateSlug.make(input.template),
              identityLabel: input.identityLabel,
              redirectUri: input.redirectUri
            }),
            (result) => result.status === "connected" ? {
              status: "connected",
              connection: connectionToOutput(result.connection)
            } : {
              status: "redirect",
              authorizationUrl: result.authorizationUrl,
              state: String(result.state)
            }
          )
        }),
        tool({
          name: "oauth.cancel",
          description: "Cancel an in-flight OAuth authorization-code session by state after the user abandons the flow.",
          inputSchema: OAuthCancelInputStd,
          outputSchema: CancelledOutputStd,
          execute: (input, { ctx }) => Effect4.map(ctx.oauth.cancel(OAuthState.make(input.state)), () => ({ cancelled: true }))
        }),
        tool({
          name: "policies.list",
          description: "List tool policies (approve / require_approval / block) for org and user owners, in evaluation order.",
          outputSchema: PoliciesListOutputStd,
          execute: (_args, { ctx }) => Effect4.map(ctx.core.policies.list(), (policies) => ({
            policies: policies.map((p) => ({
              id: String(p.id),
              owner: p.owner,
              pattern: p.pattern,
              action: p.action,
              position: p.position
            }))
          }))
        }),
        tool({
          name: "policies.create",
          description: "Create a tool policy. `pattern` matches a tool address tail (`integration.connection.tool`, `integration.*`, `*`); `action` is approve/require_approval/block. `owner` is org (workspace guardrail) or user (personal).",
          inputSchema: PolicyCreateInputStd,
          outputSchema: PolicyOutputStd,
          // A policy decides which tools run without confirmation, so creating
          // one can silence every other approval gate (e.g. `approve *`). It
          // must itself require approval, otherwise prompt-injected code could
          // disable approvals by writing its own bypass policy.
          annotations: { requiresApproval: true },
          execute: (input, { ctx }) => Effect4.map(
            ctx.core.policies.create({
              owner: input.owner,
              pattern: input.pattern,
              action: input.action
            }),
            (p) => ({
              id: String(p.id),
              owner: p.owner,
              pattern: p.pattern,
              action: p.action,
              position: p.position
            })
          )
        }),
        tool({
          name: "policies.update",
          description: "Update a tool policy's pattern and/or action by id + owner.",
          inputSchema: PolicyUpdateInputStd,
          outputSchema: PolicyOutputStd,
          // Editing a policy can broaden a pattern or flip an action to
          // `approve`, weakening an approval gate just as creation can, so it
          // requires approval too. See `policies.create`.
          annotations: { requiresApproval: true },
          execute: (input, { ctx }) => Effect4.map(
            ctx.core.policies.update({
              id: input.id,
              owner: input.owner,
              pattern: input.pattern,
              action: input.action
            }),
            (p) => ({
              id: String(p.id),
              owner: p.owner,
              pattern: p.pattern,
              action: p.action,
              position: p.position
            })
          )
        }),
        tool({
          name: "policies.remove",
          description: "Remove a tool policy by id + owner.",
          inputSchema: PolicyRemoveInputStd,
          outputSchema: RemovedOutputStd,
          // Removing a policy can drop a `block` or `require_approval`
          // guardrail, so deletion is also approval-gated. See
          // `policies.create`.
          annotations: { requiresApproval: true },
          execute: (input, { ctx }) => Effect4.map(
            ctx.core.policies.remove({
              id: input.id,
              owner: input.owner
            }),
            () => ({ removed: true })
          )
        })
      ]
    }
  ]
}));

// ../sdk/src/health-check.ts
import { Schema as Schema4 } from "effect";
var HealthStatus = Schema4.Literals(["healthy", "expired", "degraded", "unknown"]);
var HealthCheckSpec = Schema4.Struct({
  /** The tool / operation name to invoke (the plugin maps this to its binding). */
  operation: Schema4.String,
  /** Pinned arguments merged into the probe call. Required for identity
   *  endpoints that take a fixed parameter (e.g. People API `resourceName`). */
  args: Schema4.optional(Schema4.Record(Schema4.String, Schema4.Unknown)),
  /** Dot-path into the successful response body whose value is shown as the
   *  connection's identity (e.g. `emailAddresses.0.value`, `user.login`). */
  identityField: Schema4.optional(Schema4.String)
});
var HealthCheckResponseSample = Schema4.Struct({
  path: Schema4.String,
  value: Schema4.String
});
var HealthCheckResult = Schema4.Struct({
  status: HealthStatus,
  /** The HTTP status the probe observed, when the check ran against HTTP. */
  httpStatus: Schema4.optional(Schema4.Number),
  /** Display identity extracted from `identityField`, when present. */
  identity: Schema4.optional(Schema4.String),
  /** Epoch ms the check ran. */
  checkedAt: Schema4.Number,
  /** Human-readable diagnostic (error message, "no health check configured"). */
  detail: Schema4.optional(Schema4.String),
  /** Bounded sample of scalar fields from the response body, for the live
   *  preview ("show me what this operation returns"). */
  responseSample: Schema4.optional(Schema4.Array(HealthCheckResponseSample))
});
var HealthCheckCandidateParameter = Schema4.Struct({
  name: Schema4.String,
  /** Where the parameter is carried (e.g. "query", "path", "header"). */
  location: Schema4.String,
  required: Schema4.Boolean,
  description: Schema4.optional(Schema4.String)
});
var HealthCheckResponseField = Schema4.Struct({
  path: Schema4.String,
  type: Schema4.String
});
var HealthCheckCandidate = Schema4.Struct({
  /** The operation / tool name to store as `HealthCheckSpec.operation`. */
  operation: Schema4.String,
  /** HTTP method, lower-cased ("get", "post", …), for display + ranking. */
  method: Schema4.String,
  /** How many parameters are required to call it (ranking key: fewer is better). */
  requiredArgCount: Schema4.Number,
  /** True for mutating methods (post/put/patch/delete), ranked last and shown
   *  with a warning, since a health check should be safe to run repeatedly. */
  destructive: Schema4.Boolean,
  /** Operation summary / description for display, when known. */
  summary: Schema4.optional(Schema4.String),
  /** The operation's parameters, so the editor can offer pinned-arg inputs. */
  parameters: Schema4.optional(Schema4.Array(HealthCheckCandidateParameter)),
  /** Scalar leaves from the operation's response schema, for the typed identity
   *  picker. Projected via `projectResponseFields`. */
  responseFields: Schema4.optional(Schema4.Array(HealthCheckResponseField))
});
var classifyHttpStatus = (status) => {
  if (status >= 200 && status < 300) return "healthy";
  if (status === 401 || status === 403) return "expired";
  return "degraded";
};

// ../sdk/src/owner-policy.ts
var executorOwnerPolicyName = "executor.owner";
var executorTenantPolicyName = "executor.tenant";
var executorUnscopedPolicyName = "executor.unscoped";
var ORG_SUBJECT = "";
var unscopedExecutorTables = /* @__PURE__ */ new Set(["blob"]);
var policyViolation = (message) => {
  throw new StorageError({ message, cause: void 0 });
};
var requireContext = (tableName, access, context) => {
  if (context) return context;
  return policyViolation(
    `Storage ${access} on table "${tableName}" is missing executor owner context.`
  );
};
var ownerVisibilityCondition = (builder, context) => {
  const orgClause = builder.and(
    builder("tenant", "=", context.tenant),
    builder("owner", "=", "org")
  );
  if (context.subject == null) return orgClause;
  const userClause = builder.and(
    builder("tenant", "=", context.tenant),
    builder("owner", "=", "user"),
    builder("subject", "=", context.subject)
  );
  return builder.or(orgClause, userClause);
};
var assertOwnerWritable = (tableName, values, context) => {
  const ctx = requireContext(tableName, "write", context);
  if (values.tenant !== ctx.tenant) {
    policyViolation(`Storage write on table "${tableName}" is outside the executor tenant.`);
  }
  if (values.owner === "org") {
    if (values.subject !== ORG_SUBJECT) {
      policyViolation(`Storage write on table "${tableName}" set a subject on an org row.`);
    }
    return;
  }
  if (values.owner === "user") {
    if (ctx.subject == null || values.subject !== ctx.subject) {
      policyViolation(
        `Storage write on table "${tableName}" targets a user row outside the bound subject.`
      );
    }
    return;
  }
  policyViolation(
    `Storage write on table "${tableName}" has an invalid owner "${String(values.owner)}".`
  );
};
var assertOwnerPatch = (tableName, patch, context) => {
  const ctx = requireContext(tableName, "write", context);
  if (!patch) return;
  if (patch.tenant !== void 0 && patch.tenant !== ctx.tenant) {
    policyViolation(`Storage write on table "${tableName}" cannot move a row across tenants.`);
  }
  if (patch.owner === "user" && (ctx.subject == null || patch.subject !== ctx.subject)) {
    policyViolation(
      `Storage write on table "${tableName}" cannot move a row outside the bound subject.`
    );
  }
};
function assertExecutorOwnerPolicyTable(table2, tableKey) {
  const tableName = table2.ormName || tableKey || table2.names.sql;
  const owned = table2.policies.find((policy) => policy.name === executorOwnerPolicyName);
  if (owned?.onRead && owned.onCreate && owned.onUpdate && owned.onDelete) return;
  const tenant = table2.policies.find((policy) => policy.name === executorTenantPolicyName);
  if (tenant?.onRead && tenant.onCreate && tenant.onUpdate && tenant.onDelete) return;
  const unscoped = table2.policies.find((policy) => policy.name === executorUnscopedPolicyName);
  if (unscoped && unscopedExecutorTables.has(tableName)) return;
  policyViolation(`Storage table "${tableName}" is missing an executor owner policy.`);
}

// ../sdk/src/core-schema.ts
var textColumn = (name) => column(name, "string");
var nullableTextColumn = (name) => column(name, "string").nullable();
var keyColumn = (name) => column(name, "varchar(255)");
var boolColumn = (name, defaultValue) => column(name, "bool").defaultTo(defaultValue);
var bigintColumn = (name) => column(name, "bigint");
var nullableBigintColumn = (name) => column(name, "bigint").nullable();
var jsonColumn = (name) => column(name, "json");
var nullableJsonColumn = (name) => column(name, "json").nullable();
var dateColumn = (name) => column(name, "timestamp");
var ownerVisibility = (builder, context) => ownerVisibilityCondition(builder, context);
var unscopedExecutorTable = (name, columns) => {
  const out = table(name, {
    ...columns,
    row_id: idColumn("row_id", "varchar(255)").defaultTo$("auto"),
    id: keyColumn("id")
  });
  out.unique(`${name}_id_uidx`, ["id"]);
  return out.policy({ name: executorUnscopedPolicyName });
};
var tenantExecutorTable = (name, columns, uniqueKey) => {
  const out = table(name, {
    ...columns,
    row_id: idColumn("row_id", "varchar(255)").defaultTo$("auto"),
    tenant: keyColumn("tenant")
  });
  out.unique(`${name}_uidx`, [...uniqueKey]);
  return out.policy({
    name: executorTenantPolicyName,
    onRead: ({ builder, context }) => builder("tenant", "=", context.tenant),
    onCreate: ({ values, context }) => {
      if (values.tenant !== context.tenant) {
        throw new StorageError({
          message: `Storage write on table "${name}" is outside the executor tenant.`,
          cause: void 0
        });
      }
    },
    onUpdate: ({ builder, context }) => builder("tenant", "=", context.tenant),
    onDelete: ({ builder, context }) => builder("tenant", "=", context.tenant)
  });
};
var ownedExecutorTable = (name, columns, uniqueKey) => {
  const out = table(name, {
    ...columns,
    row_id: idColumn("row_id", "varchar(255)").defaultTo$("auto"),
    tenant: keyColumn("tenant"),
    owner: keyColumn("owner"),
    subject: keyColumn("subject")
  });
  out.unique(`${name}_uidx`, [...uniqueKey]);
  return out.policy({
    name: executorOwnerPolicyName,
    onRead: ({ builder, context }) => ownerVisibility(builder, context),
    onCreate: ({ values, context }) => assertOwnerWritable(name, values, context),
    onUpdate: ({ builder, set, create, context }) => {
      assertOwnerPatch(name, set, context);
      assertOwnerPatch(name, create, context);
      return ownerVisibility(builder, context);
    },
    onDelete: ({ builder, context }) => ownerVisibility(builder, context)
  });
};
var defineTables = (tables) => tables;
var coreTables = defineTables({
  // The catalog — tenant-shared integration definitions. `config` is the owning
  // plugin's opaque blob (openapi auth templates + spec; mcp url). Core never
  // parses it.
  integration: tenantExecutorTable(
    "integration",
    {
      slug: keyColumn("slug"),
      plugin_id: textColumn("plugin_id"),
      // Display name. The pre-split field: `description` used to hold the
      // name, so cloud backfills `name` from it (migration 0006) and other
      // hosts fall back at read time (see rowToIntegration). Nullable because
      // SQLite boot-ensure hosts cannot add a NOT NULL column to existing
      // tables, so the column stays nullable even though it is always present
      // in practice.
      name: nullableTextColumn("name"),
      // Actual prose description, now distinct from the name. Nullable: absent
      // until a user/spec supplies one (cloud clears the old duplicated title
      // to NULL in 0006).
      description: nullableTextColumn("description"),
      config: nullableJsonColumn("config"),
      // The declared health check (HealthCheckSpec JSON): which authenticated
      // operation a connection runs to prove its credential is alive and whose
      // account it is. CORE-owned, deliberately NOT inside `config`, so no
      // plugin's config decode/re-encode cycle can silently strip it and no
      // plugin schema has to declare it. Null = no check declared.
      health_check: nullableJsonColumn("health_check"),
      // Epoch ms of the last tool-affecting config change (spec update, auth
      // template edit). Compared against each connection's `tools_synced_at`
      // so OTHER subjects' connections — whose tool rows the updater cannot
      // write under the owner policy — lazily rebuild on their next read.
      config_revised_at: nullableBigintColumn("config_revised_at"),
      can_remove: boolColumn("can_remove", true),
      can_refresh: boolColumn("can_refresh", false),
      created_at: dateColumn("created_at"),
      updated_at: dateColumn("updated_at")
    },
    ["tenant", "slug"]
  ),
  // THE saved credential, one per (owner, integration, name). Resolves each named
  // input via `provider` + the `item_ids` map (variable → provider item id). A
  // single-secret connection is `{ "token": <id> }`; an apiKey method with two
  // distinct inputs (e.g. Datadog) carries one entry per variable. All of a
  // connection's inputs share the one `provider`. OAuth fields null for static.
  connection: ownedExecutorTable(
    "connection",
    {
      integration: keyColumn("integration"),
      name: keyColumn("name"),
      template: textColumn("template"),
      provider: textColumn("provider"),
      item_ids: jsonColumn("item_ids"),
      identity_label: nullableTextColumn("identity_label"),
      // User-curated, agent-visible "what is this connection for". Settable at
      // create, editable after; never reset by OAuth re-mints.
      description: nullableTextColumn("description"),
      // Last health-check outcome (HealthCheckResult JSON: status, httpStatus,
      // checkedAt, identity, detail). Written by every checkHealth run so the
      // accounts list shows alive/expired AT A GLANCE (the customer ask)
      // instead of only after a per-row manual probe. Null = never checked.
      last_health: nullableJsonColumn("last_health"),
      // Epoch ms of the last tool (re)production for this connection. Stale
      // vs the integration's `config_revised_at` → re-produced on next read.
      tools_synced_at: nullableBigintColumn("tools_synced_at"),
      oauth_client: nullableTextColumn("oauth_client"),
      // The OWNER of `oauth_client` (a Personal connection may be minted through
      // a shared Workspace app), set together with `oauth_client`; null for
      // static creds. Stored so every deref (refresh/complete/reconnect) reads it
      // verbatim instead of re-deriving it via a sharing rule.
      oauth_client_owner: nullableTextColumn("oauth_client_owner"),
      refresh_item_id: nullableTextColumn("refresh_item_id"),
      expires_at: nullableBigintColumn("expires_at"),
      oauth_scope: nullableTextColumn("oauth_scope"),
      // Per-connection token endpoint override. Set only when the code was
      // redeemed at a region other than the oauth_client's configured token host
      // (multi-site providers like Datadog signal the org's region on the
      // callback). Null means refresh uses the oauth_client's `token_url`.
      oauth_token_url: nullableTextColumn("oauth_token_url"),
      provider_state: nullableJsonColumn("provider_state"),
      created_at: dateColumn("created_at"),
      updated_at: dateColumn("updated_at")
    },
    ["tenant", "owner", "subject", "integration", "name"]
  ),
  // A registered OAuth app — owner-scoped (shared org app or a member's BYO app).
  // A registered OAuth app — pure app identity (id/secret + endpoints). It carries
  // NO scopes: what to request is the integration's concern, so the same app can
  // back any integration. The granted scope is recorded per-connection
  // (`connection.oauth_scope`).
  oauth_client: ownedExecutorTable(
    "oauth_client",
    {
      slug: keyColumn("slug"),
      authorization_url: textColumn("authorization_url"),
      token_url: textColumn("token_url"),
      grant: textColumn("grant"),
      client_id: textColumn("client_id"),
      // The client secret is NOT stored inline — it's a provider `item_id` that
      // resolves to the value via the default writable credential provider
      // (WorkOS Vault on cloud, the local store on desktop). Null for public /
      // PKCE clients (no secret). Keeps secrets out of plaintext columns.
      client_secret_item_id: nullableTextColumn("client_secret_item_id"),
      // RFC 8707 Resource Indicator (MCP). Sent on the refresh request so the
      // re-minted access token stays bound to the same resource. Null when the
      // provider doesn't use resource indicators.
      resource: nullableTextColumn("resource"),
      // Where this oauth_client came from. Null in old databases is treated as
      // "manual" by the service layer.
      origin_kind: nullableTextColumn("origin_kind"),
      origin_integration: nullableTextColumn("origin_integration"),
      // Authorization-server issuer that owns a DCR client, keying per-AS reuse.
      // For a NEW DCR registration this is the DISCOVERED OIDC issuer (real
      // information from the AS metadata, which can legitimately differ from what
      // token_url would suggest). For a BACKFILLED legacy row it is instead a
      // derived registrable-origin of token_url (a cache of the pure
      // `registrableOriginOfUrl`, since no discovered issuer was ever recorded).
      // Null for manual clients and legacy rows not yet backfilled.
      origin_issuer: nullableTextColumn("origin_issuer"),
      created_at: dateColumn("created_at")
    },
    ["tenant", "owner", "subject", "slug"]
  ),
  // In-flight OAuth authorization-code flow, keyed by the minted `state`.
  oauth_session: ownedExecutorTable(
    "oauth_session",
    {
      state: keyColumn("state"),
      client_slug: textColumn("client_slug"),
      integration: textColumn("integration"),
      name: textColumn("name"),
      template: textColumn("template"),
      redirect_url: textColumn("redirect_url"),
      pkce_verifier: nullableTextColumn("pkce_verifier"),
      identity_label: nullableTextColumn("identity_label"),
      payload: jsonColumn("payload"),
      expires_at: bigintColumn("expires_at"),
      created_at: dateColumn("created_at")
    },
    ["tenant", "state"]
  ),
  // Persisted, per-connection tools (option C). Address is derived from
  // (integration, owner, connection, name).
  tool: ownedExecutorTable(
    "tool",
    {
      integration: keyColumn("integration"),
      connection: keyColumn("connection"),
      plugin_id: textColumn("plugin_id"),
      name: keyColumn("name"),
      description: textColumn("description"),
      input_schema: nullableJsonColumn("input_schema"),
      output_schema: nullableJsonColumn("output_schema"),
      annotations: nullableJsonColumn("annotations"),
      created_at: dateColumn("created_at"),
      updated_at: dateColumn("updated_at")
    },
    ["tenant", "owner", "subject", "integration", "connection", "name"]
  ),
  // Shared JSON-schema $defs, per-connection (mirrors `tool`).
  definition: ownedExecutorTable(
    "definition",
    {
      integration: keyColumn("integration"),
      connection: keyColumn("connection"),
      plugin_id: textColumn("plugin_id"),
      name: keyColumn("name"),
      schema: jsonColumn("schema"),
      created_at: dateColumn("created_at")
    },
    ["tenant", "owner", "subject", "integration", "connection", "name"]
  ),
  // User-authored tool policies (approve / require_approval / block).
  tool_policy: ownedExecutorTable(
    "tool_policy",
    {
      id: keyColumn("id"),
      pattern: textColumn("pattern"),
      action: textColumn("action"),
      position: textColumn("position"),
      created_at: dateColumn("created_at"),
      updated_at: dateColumn("updated_at")
    },
    ["tenant", "owner", "subject", "id"]
  ),
  // Host-owned plugin storage (shared `plugin_storage` table, owner-scoped).
  plugin_storage: ownedExecutorTable(
    "plugin_storage",
    {
      plugin_id: keyColumn("plugin_id"),
      collection: keyColumn("collection"),
      key: keyColumn("key"),
      data: jsonColumn("data"),
      created_at: dateColumn("created_at"),
      updated_at: dateColumn("updated_at")
    },
    ["tenant", "owner", "subject", "plugin_id", "collection", "key"]
  ),
  // Opaque blob store, global. Isolation is carried in `namespace` (which
  // encodes the owner partition + plugin id), so this table is unscoped.
  blob: unscopedExecutorTable("blob", {
    namespace: keyColumn("namespace"),
    key: keyColumn("key"),
    value: textColumn("value")
  })
});
var coreSchema = coreTables;
var TOOL_INVOCATION_COLUMNS = [
  "tenant",
  "owner",
  "subject",
  "integration",
  "connection",
  "plugin_id",
  "name",
  "description",
  "annotations",
  "created_at",
  "updated_at"
];
var TOOL_POLICY_ACTIONS = [
  "approve",
  "require_approval",
  "block"
];
var isToolPolicyAction = (value) => typeof value === "string" && TOOL_POLICY_ACTIONS.includes(value);

// ../sdk/src/elicitation.ts
import { Schema as Schema5 } from "effect";
var FormElicitation = Schema5.TaggedStruct("FormElicitation", {
  message: Schema5.String,
  /** JSON Schema describing the fields to collect. */
  requestedSchema: Schema5.Record(Schema5.String, Schema5.Unknown)
});
var UrlElicitation = Schema5.TaggedStruct("UrlElicitation", {
  message: Schema5.String,
  url: Schema5.String,
  /** Unique id so the host can correlate the callback. */
  elicitationId: ElicitationId
});
var ElicitationAction = Schema5.Literals(["accept", "decline", "cancel"]);
var ElicitationResponse = Schema5.Struct({
  action: ElicitationAction,
  /** Present when `action` is "accept" — the data the user provided. */
  content: Schema5.optional(Schema5.Record(Schema5.String, Schema5.Unknown))
});
var ElicitationDeclinedError = class extends Schema5.TaggedErrorClass()(
  "ElicitationDeclinedError",
  {
    address: ToolAddress,
    action: Schema5.Literals(["decline", "cancel"])
  }
) {
  // Derived message so telemetry (span status, logs) labels the failure
  // instead of rendering an Error with an empty message.
  get message() {
    return `Tool approval ${this.action === "cancel" ? "cancelled" : "declined"}: ${this.address}`;
  }
};

// ../sdk/src/errors.ts
import { Schema as Schema6 } from "effect";
var isUserActionableError = (value) => typeof value === "object" && value !== null && "__executorUserActionable" in value && value.__executorUserActionable === true && "userMessage" in value && typeof value.userMessage === "string" && value.userMessage.length > 0 && "code" in value && typeof value.code === "string" && value.code.length > 0;
var ToolNotFoundError = class extends Schema6.TaggedErrorClass()(
  "ToolNotFoundError",
  {
    address: ToolAddress,
    suggestions: Schema6.optional(Schema6.Array(ToolAddress))
  }
) {
  get message() {
    return `Tool not found: ${this.address}`;
  }
};
var ToolInvocationError = class extends Schema6.TaggedErrorClass()(
  "ToolInvocationError",
  {
    address: ToolAddress,
    message: Schema6.String,
    cause: Schema6.optional(Schema6.Unknown)
  }
) {
};
var ToolBlockedError = class extends Schema6.TaggedErrorClass()(
  "ToolBlockedError",
  {
    address: ToolAddress,
    pattern: Schema6.String
  }
) {
  get message() {
    return `Tool blocked by policy "${this.pattern}": ${this.address}`;
  }
};
var PluginNotLoadedError = class extends Schema6.TaggedErrorClass()(
  "PluginNotLoadedError",
  {
    address: ToolAddress,
    pluginId: Schema6.String
  }
) {
  get message() {
    return `Plugin "${this.pluginId}" is not loaded for tool: ${this.address}`;
  }
};
var NoHandlerError = class extends Schema6.TaggedErrorClass()("NoHandlerError", {
  address: ToolAddress,
  pluginId: Schema6.String
}) {
  get message() {
    return `Plugin "${this.pluginId}" has no invokeTool handler for tool: ${this.address}`;
  }
};
var IntegrationNotFoundError = class extends Schema6.TaggedErrorClass()(
  "IntegrationNotFoundError",
  { slug: IntegrationSlug }
) {
  get message() {
    return `Integration not found: ${this.slug}`;
  }
};
var IntegrationAlreadyExistsError = class extends Schema6.TaggedErrorClass()(
  "IntegrationAlreadyExistsError",
  { slug: IntegrationSlug },
  { httpApiStatus: 409 }
) {
  get message() {
    return `Integration already exists: ${this.slug}`;
  }
};
var IntegrationRemovalNotAllowedError = class extends Schema6.TaggedErrorClass()(
  "IntegrationRemovalNotAllowedError",
  { slug: IntegrationSlug }
) {
  get message() {
    return `Integration cannot be removed (declared statically by a plugin): ${this.slug}`;
  }
};
var ConnectionNotFoundError = class extends Schema6.TaggedErrorClass()(
  "ConnectionNotFoundError",
  {
    owner: Owner,
    integration: IntegrationSlug,
    name: ConnectionName
  }
) {
  get message() {
    return `Connection not found: ${this.integration}.${this.owner}.${this.name}`;
  }
};
var InvalidConnectionInputError = class extends Schema6.TaggedErrorClass()(
  "InvalidConnectionInputError",
  { message: Schema6.String }
) {
};
var CredentialProviderNotRegisteredError = class extends Schema6.TaggedErrorClass()(
  "CredentialProviderNotRegisteredError",
  { provider: ProviderKey }
) {
  get message() {
    return `Credential provider not registered: ${this.provider}`;
  }
};
var CredentialResolutionError = class extends Schema6.TaggedErrorClass()(
  "CredentialResolutionError",
  {
    owner: Owner,
    integration: IntegrationSlug,
    name: ConnectionName,
    message: Schema6.String,
    /** True when the stored grant is permanently invalid and the user must
     *  sign in again (RFC 6749 §5.2 invalid_grant and friends). */
    reauthRequired: Schema6.optional(Schema6.Boolean)
  }
) {
};

// ../sdk/src/oauth-service.ts
import { Duration as Duration2, Effect as Effect8, Option as Option4, Schema as Schema11 } from "effect";
import { FetchHttpClient as FetchHttpClient2 } from "effect/unstable/http";

// ../sdk/src/oauth-client.ts
import { Schema as Schema7 } from "effect";
var OAuthStartError = class extends Schema7.TaggedErrorClass()("OAuthStartError", {
  message: Schema7.String
}) {
  __executorUserActionable = true;
  code = "oauth_start_error";
  get userMessage() {
    return this.message;
  }
};
var OAuthCompleteError = class extends Schema7.TaggedErrorClass()("OAuthCompleteError", {
  message: Schema7.String,
  /** True when the auth-code exchange failed in a way the user must restart. */
  restartRequired: Schema7.optional(Schema7.Boolean)
}) {
  __executorUserActionable = true;
  code = "oauth_complete_error";
  get userMessage() {
    return this.message;
  }
};
var OAuthProbeError = class extends Schema7.TaggedErrorClass()("OAuthProbeError", {
  message: Schema7.String
}) {
  __executorUserActionable = true;
  code = "oauth_probe_error";
  get userMessage() {
    return this.message;
  }
};
var OAuthRegisterDynamicError = class extends Schema7.TaggedErrorClass()("OAuthRegisterDynamicError", {
  message: Schema7.String
}) {
  __executorUserActionable = true;
  code = "oauth_register_dynamic_error";
  get userMessage() {
    return this.message;
  }
};
var OAuthSessionNotFoundError = class extends Schema7.TaggedErrorClass()(
  "OAuthSessionNotFoundError",
  { state: OAuthState }
) {
};

// ../sdk/src/oauth-discovery.ts
import { Data as Data3, Duration, Effect as Effect7, Option as Option2, Predicate as Predicate3, Result, Schema as Schema9 } from "effect";
import { FetchHttpClient, HttpClient, HttpClientRequest } from "effect/unstable/http";

// ../sdk/src/oauth-helpers.ts
import { Data as Data2, Effect as Effect6, Option, Predicate as Predicate2, Schema as Schema8 } from "effect";

// ../../../node_modules/.bun/oauth4webapi@3.8.5/node_modules/oauth4webapi/build/index.js
var USER_AGENT;
if (typeof navigator === "undefined" || !navigator.userAgent?.startsWith?.("Mozilla/5.0 ")) {
  const NAME = "oauth4webapi";
  const VERSION = "v3.8.5";
  USER_AGENT = `${NAME}/${VERSION}`;
}
function looseInstanceOf(input, expected) {
  if (input == null) {
    return false;
  }
  try {
    return input instanceof expected || Object.getPrototypeOf(input)[Symbol.toStringTag] === expected.prototype[Symbol.toStringTag];
  } catch {
    return false;
  }
}
var ERR_INVALID_ARG_VALUE = "ERR_INVALID_ARG_VALUE";
var ERR_INVALID_ARG_TYPE = "ERR_INVALID_ARG_TYPE";
function CodedTypeError(message, code, cause) {
  const err = new TypeError(message, { cause });
  Object.assign(err, { code });
  return err;
}
var allowInsecureRequests = /* @__PURE__ */ Symbol();
var clockSkew = /* @__PURE__ */ Symbol();
var clockTolerance = /* @__PURE__ */ Symbol();
var customFetch = /* @__PURE__ */ Symbol();
var jweDecrypt = /* @__PURE__ */ Symbol();
var encoder = new TextEncoder();
var decoder = new TextDecoder();
function buf(input) {
  if (typeof input === "string") {
    return encoder.encode(input);
  }
  return decoder.decode(input);
}
var encodeBase64Url;
if (Uint8Array.prototype.toBase64) {
  encodeBase64Url = (input) => {
    if (input instanceof ArrayBuffer) {
      input = new Uint8Array(input);
    }
    return input.toBase64({ alphabet: "base64url", omitPadding: true });
  };
} else {
  const CHUNK_SIZE = 32768;
  encodeBase64Url = (input) => {
    if (input instanceof ArrayBuffer) {
      input = new Uint8Array(input);
    }
    const arr = [];
    for (let i = 0; i < input.byteLength; i += CHUNK_SIZE) {
      arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)));
    }
    return btoa(arr.join("")).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  };
}
var decodeBase64Url;
if (Uint8Array.fromBase64) {
  decodeBase64Url = (input) => {
    try {
      return Uint8Array.fromBase64(input, { alphabet: "base64url" });
    } catch (cause) {
      throw CodedTypeError("The input to be decoded is not correctly encoded.", ERR_INVALID_ARG_VALUE, cause);
    }
  };
} else {
  decodeBase64Url = (input) => {
    try {
      const binary = atob(input.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, ""));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    } catch (cause) {
      throw CodedTypeError("The input to be decoded is not correctly encoded.", ERR_INVALID_ARG_VALUE, cause);
    }
  };
}
function b64u(input) {
  if (typeof input === "string") {
    return decodeBase64Url(input);
  }
  return encodeBase64Url(input);
}
var UnsupportedOperationError = class extends Error {
  code;
  constructor(message, options) {
    super(message, options);
    this.name = this.constructor.name;
    this.code = UNSUPPORTED_OPERATION;
    Error.captureStackTrace?.(this, this.constructor);
  }
};
var OperationProcessingError = class extends Error {
  code;
  constructor(message, options) {
    super(message, options);
    this.name = this.constructor.name;
    if (options?.code) {
      this.code = options?.code;
    }
    Error.captureStackTrace?.(this, this.constructor);
  }
};
function OPE(message, code, cause) {
  return new OperationProcessingError(message, { code, cause });
}
function isJsonObject(input) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return false;
  }
  return true;
}
function prepareHeaders(input) {
  if (looseInstanceOf(input, Headers)) {
    input = Object.fromEntries(input.entries());
  }
  const headers = new Headers(input ?? {});
  if (USER_AGENT && !headers.has("user-agent")) {
    headers.set("user-agent", USER_AGENT);
  }
  if (headers.has("authorization")) {
    throw CodedTypeError('"options.headers" must not include the "authorization" header name', ERR_INVALID_ARG_VALUE);
  }
  return headers;
}
function signal(url, value) {
  if (value !== void 0) {
    if (typeof value === "function") {
      value = value(url.href);
    }
    if (!(value instanceof AbortSignal)) {
      throw CodedTypeError('"options.signal" must return or be an instance of AbortSignal', ERR_INVALID_ARG_TYPE);
    }
    return value;
  }
  return void 0;
}
function assertNumber(input, allow0, it, code, cause) {
  try {
    if (typeof input !== "number" || !Number.isFinite(input)) {
      throw CodedTypeError(`${it} must be a number`, ERR_INVALID_ARG_TYPE, cause);
    }
    if (input > 0)
      return;
    if (allow0) {
      if (input !== 0) {
        throw CodedTypeError(`${it} must be a non-negative number`, ERR_INVALID_ARG_VALUE, cause);
      }
      return;
    }
    throw CodedTypeError(`${it} must be a positive number`, ERR_INVALID_ARG_VALUE, cause);
  } catch (err) {
    if (code) {
      throw OPE(err.message, code, cause);
    }
    throw err;
  }
}
function assertString(input, it, code, cause) {
  try {
    if (typeof input !== "string") {
      throw CodedTypeError(`${it} must be a string`, ERR_INVALID_ARG_TYPE, cause);
    }
    if (input.length === 0) {
      throw CodedTypeError(`${it} must not be empty`, ERR_INVALID_ARG_VALUE, cause);
    }
  } catch (err) {
    if (code) {
      throw OPE(err.message, code, cause);
    }
    throw err;
  }
}
function assertApplicationJson(response) {
  assertContentType(response, "application/json");
}
function notJson(response, ...types) {
  let msg = '"response" content-type must be ';
  if (types.length > 2) {
    const last = types.pop();
    msg += `${types.join(", ")}, or ${last}`;
  } else if (types.length === 2) {
    msg += `${types[0]} or ${types[1]}`;
  } else {
    msg += types[0];
  }
  return OPE(msg, RESPONSE_IS_NOT_JSON, response);
}
function assertContentType(response, contentType) {
  if (getContentType(response) !== contentType) {
    throw notJson(response, contentType);
  }
}
function randomBytes() {
  return b64u(crypto.getRandomValues(new Uint8Array(32)));
}
function generateRandomCodeVerifier() {
  return randomBytes();
}
function generateRandomState() {
  return randomBytes();
}
async function calculatePKCECodeChallenge(codeVerifier) {
  assertString(codeVerifier, "codeVerifier");
  return b64u(await crypto.subtle.digest("SHA-256", buf(codeVerifier)));
}
function getClockSkew(client) {
  const skew = client?.[clockSkew];
  return typeof skew === "number" && Number.isFinite(skew) ? skew : 0;
}
function getClockTolerance(client) {
  const tolerance = client?.[clockTolerance];
  return typeof tolerance === "number" && Number.isFinite(tolerance) && Math.sign(tolerance) !== -1 ? tolerance : 30;
}
function epochTime() {
  return Math.floor(Date.now() / 1e3);
}
function assertAs(as) {
  if (typeof as !== "object" || as === null) {
    throw CodedTypeError('"as" must be an object', ERR_INVALID_ARG_TYPE);
  }
  assertString(as.issuer, '"as.issuer"');
}
function assertClient(client) {
  if (typeof client !== "object" || client === null) {
    throw CodedTypeError('"client" must be an object', ERR_INVALID_ARG_TYPE);
  }
  assertString(client.client_id, '"client.client_id"');
}
function formUrlEncode(token) {
  return encodeURIComponent(token).replace(/(?:[-_.!~*'()]|%20)/g, (substring) => {
    switch (substring) {
      case "-":
      case "_":
      case ".":
      case "!":
      case "~":
      case "*":
      case "'":
      case "(":
      case ")":
        return `%${substring.charCodeAt(0).toString(16).toUpperCase()}`;
      case "%20":
        return "+";
      default:
        throw new Error();
    }
  });
}
function ClientSecretPost(clientSecret) {
  assertString(clientSecret, '"clientSecret"');
  return (_as, client, body, _headers) => {
    body.set("client_id", client.client_id);
    body.set("client_secret", clientSecret);
  };
}
function ClientSecretBasic(clientSecret) {
  assertString(clientSecret, '"clientSecret"');
  return (_as, client, _body, headers) => {
    const username = formUrlEncode(client.client_id);
    const password = formUrlEncode(clientSecret);
    const credentials = btoa(`${username}:${password}`);
    headers.set("authorization", `Basic ${credentials}`);
  };
}
function None() {
  return (_as, client, body, _headers) => {
    body.set("client_id", client.client_id);
  };
}
var URLParse = URL.parse ? (url, base) => URL.parse(url, base) : (url, base) => {
  try {
    return new URL(url, base);
  } catch {
    return null;
  }
};
function checkProtocol(url, enforceHttps) {
  if (enforceHttps && url.protocol !== "https:") {
    throw OPE("only requests to HTTPS are allowed", HTTP_REQUEST_FORBIDDEN, url);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw OPE("only HTTP and HTTPS requests are allowed", REQUEST_PROTOCOL_FORBIDDEN, url);
  }
}
function validateEndpoint(value, endpoint, useMtlsAlias, enforceHttps) {
  let url;
  if (typeof value !== "string" || !(url = URLParse(value))) {
    throw OPE(`authorization server metadata does not contain a valid ${useMtlsAlias ? `"as.mtls_endpoint_aliases.${endpoint}"` : `"as.${endpoint}"`}`, value === void 0 ? MISSING_SERVER_METADATA : INVALID_SERVER_METADATA, { attribute: useMtlsAlias ? `mtls_endpoint_aliases.${endpoint}` : endpoint });
  }
  checkProtocol(url, enforceHttps);
  return url;
}
function resolveEndpoint(as, endpoint, useMtlsAlias, enforceHttps) {
  if (useMtlsAlias && as.mtls_endpoint_aliases && endpoint in as.mtls_endpoint_aliases) {
    return validateEndpoint(as.mtls_endpoint_aliases[endpoint], endpoint, useMtlsAlias, enforceHttps);
  }
  return validateEndpoint(as[endpoint], endpoint, useMtlsAlias, enforceHttps);
}
var ResponseBodyError = class extends Error {
  cause;
  code;
  error;
  status;
  error_description;
  response;
  constructor(message, options) {
    super(message, options);
    this.name = this.constructor.name;
    this.code = RESPONSE_BODY_ERROR;
    this.cause = options.cause;
    this.error = options.cause.error;
    this.status = options.response.status;
    this.error_description = options.cause.error_description;
    Object.defineProperty(this, "response", { enumerable: false, value: options.response });
    Error.captureStackTrace?.(this, this.constructor);
  }
};
var WWWAuthenticateChallengeError = class extends Error {
  cause;
  code;
  response;
  status;
  constructor(message, options) {
    super(message, options);
    this.name = this.constructor.name;
    this.code = WWW_AUTHENTICATE_CHALLENGE;
    this.cause = options.cause;
    this.status = options.response.status;
    this.response = options.response;
    Object.defineProperty(this, "response", { enumerable: false });
    Error.captureStackTrace?.(this, this.constructor);
  }
};
var tokenMatch = "[a-zA-Z0-9!#$%&\\'\\*\\+\\-\\.\\^_`\\|~]+";
var token68Match = "[a-zA-Z0-9\\-\\._\\~\\+\\/]+={0,2}";
var quotedMatch = '"((?:[^"\\\\]|\\\\[\\s\\S])*)"';
var quotedParamMatcher = "(" + tokenMatch + ")\\s*=\\s*" + quotedMatch;
var paramMatcher = "(" + tokenMatch + ")\\s*=\\s*(" + tokenMatch + ")";
var schemeRE = new RegExp("^[,\\s]*(" + tokenMatch + ")");
var quotedParamRE = new RegExp("^[,\\s]*" + quotedParamMatcher + "[,\\s]*(.*)");
var unquotedParamRE = new RegExp("^[,\\s]*" + paramMatcher + "[,\\s]*(.*)");
var token68ParamRE = new RegExp("^(" + token68Match + ")(?:$|[,\\s])(.*)");
function parseWwwAuthenticateChallenges(response) {
  if (!looseInstanceOf(response, Response)) {
    throw CodedTypeError('"response" must be an instance of Response', ERR_INVALID_ARG_TYPE);
  }
  const header = response.headers.get("www-authenticate");
  if (header === null) {
    return void 0;
  }
  const challenges = [];
  let rest = header;
  while (rest) {
    let match = rest.match(schemeRE);
    const scheme = match?.["1"].toLowerCase();
    if (!scheme) {
      return void 0;
    }
    const afterScheme = rest.substring(match[0].length);
    if (afterScheme && !afterScheme.match(/^[\s,]/)) {
      return void 0;
    }
    const spaceMatch = afterScheme.match(/^\s+(.*)$/);
    const hasParameters = !!spaceMatch;
    rest = spaceMatch ? spaceMatch[1] : void 0;
    const parameters = {};
    let token68;
    if (hasParameters) {
      while (rest) {
        let key;
        let value;
        if (match = rest.match(quotedParamRE)) {
          ;
          [, key, value, rest] = match;
          if (value.includes("\\")) {
            try {
              value = JSON.parse(`"${value}"`);
            } catch {
            }
          }
          parameters[key.toLowerCase()] = value;
          continue;
        }
        if (match = rest.match(unquotedParamRE)) {
          ;
          [, key, value, rest] = match;
          parameters[key.toLowerCase()] = value;
          continue;
        }
        if (match = rest.match(token68ParamRE)) {
          if (Object.keys(parameters).length) {
            break;
          }
          ;
          [, token68, rest] = match;
          break;
        }
        return void 0;
      }
    } else {
      rest = afterScheme || void 0;
    }
    const challenge = { scheme, parameters };
    if (token68) {
      challenge.token68 = token68;
    }
    challenges.push(challenge);
  }
  if (!challenges.length) {
    return void 0;
  }
  return challenges;
}
async function parseOAuthResponseErrorBody(response) {
  if (response.status > 399 && response.status < 500) {
    assertReadableResponse(response);
    assertApplicationJson(response);
    try {
      const json = await response.clone().json();
      if (isJsonObject(json) && typeof json.error === "string" && json.error.length) {
        return json;
      }
    } catch {
    }
  }
  return void 0;
}
async function checkOAuthBodyError(response, expected, label) {
  if (response.status !== expected) {
    checkAuthenticationChallenges(response);
    let err;
    if (err = await parseOAuthResponseErrorBody(response)) {
      await response.body?.cancel();
      throw new ResponseBodyError("server responded with an error in the response body", {
        cause: err,
        response
      });
    }
    throw OPE(`"response" is not a conform ${label} response (unexpected HTTP status code)`, RESPONSE_IS_NOT_CONFORM, response);
  }
}
function assertDPoP(option) {
  if (!branded.has(option)) {
    throw CodedTypeError('"options.DPoP" is not a valid DPoPHandle', ERR_INVALID_ARG_VALUE);
  }
}
function getContentType(input) {
  return input.headers.get("content-type")?.split(";")[0];
}
async function authenticatedRequest(as, client, clientAuthentication, url, body, headers, options) {
  await clientAuthentication(as, client, body, headers);
  headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
  return (options?.[customFetch] || fetch)(url.href, {
    body,
    headers: Object.fromEntries(headers.entries()),
    method: "POST",
    redirect: "manual",
    signal: signal(url, options?.signal)
  });
}
async function tokenEndpointRequest(as, client, clientAuthentication, grantType, parameters, options) {
  const url = resolveEndpoint(as, "token_endpoint", client.use_mtls_endpoint_aliases, options?.[allowInsecureRequests] !== true);
  parameters.set("grant_type", grantType);
  const headers = prepareHeaders(options?.headers);
  headers.set("accept", "application/json");
  if (options?.DPoP !== void 0) {
    assertDPoP(options.DPoP);
    await options.DPoP.addProof(url, headers, "POST");
  }
  const response = await authenticatedRequest(as, client, clientAuthentication, url, parameters, headers, options);
  options?.DPoP?.cacheNonce(response, url);
  return response;
}
async function refreshTokenGrantRequest(as, client, clientAuthentication, refreshToken, options) {
  assertAs(as);
  assertClient(client);
  assertString(refreshToken, '"refreshToken"');
  const parameters = new URLSearchParams(options?.additionalParameters);
  parameters.set("refresh_token", refreshToken);
  return tokenEndpointRequest(as, client, clientAuthentication, "refresh_token", parameters, options);
}
var idTokenClaims = /* @__PURE__ */ new WeakMap();
var jwtRefs = /* @__PURE__ */ new WeakMap();
async function processGenericAccessTokenResponse(as, client, response, additionalRequiredIdTokenClaims, decryptFn, recognizedTokenTypes) {
  assertAs(as);
  assertClient(client);
  if (!looseInstanceOf(response, Response)) {
    throw CodedTypeError('"response" must be an instance of Response', ERR_INVALID_ARG_TYPE);
  }
  await checkOAuthBodyError(response, 200, "Token Endpoint");
  assertReadableResponse(response);
  const json = await getResponseJsonBody(response);
  assertString(json.access_token, '"response" body "access_token" property', INVALID_RESPONSE, {
    body: json
  });
  assertString(json.token_type, '"response" body "token_type" property', INVALID_RESPONSE, {
    body: json
  });
  json.token_type = json.token_type.toLowerCase();
  if (json.expires_in !== void 0) {
    let expiresIn = typeof json.expires_in !== "number" ? parseFloat(json.expires_in) : json.expires_in;
    assertNumber(expiresIn, true, '"response" body "expires_in" property', INVALID_RESPONSE, {
      body: json
    });
    json.expires_in = expiresIn;
  }
  if (json.refresh_token !== void 0) {
    assertString(json.refresh_token, '"response" body "refresh_token" property', INVALID_RESPONSE, {
      body: json
    });
  }
  if (json.scope !== void 0 && typeof json.scope !== "string") {
    throw OPE('"response" body "scope" property must be a string', INVALID_RESPONSE, { body: json });
  }
  if (json.id_token !== void 0) {
    assertString(json.id_token, '"response" body "id_token" property', INVALID_RESPONSE, {
      body: json
    });
    const requiredClaims = ["aud", "exp", "iat", "iss", "sub"];
    if (client.require_auth_time === true) {
      requiredClaims.push("auth_time");
    }
    if (client.default_max_age !== void 0) {
      assertNumber(client.default_max_age, true, '"client.default_max_age"');
      requiredClaims.push("auth_time");
    }
    if (additionalRequiredIdTokenClaims?.length) {
      requiredClaims.push(...additionalRequiredIdTokenClaims);
    }
    const { claims, jwt } = await validateJwt(json.id_token, checkSigningAlgorithm.bind(void 0, client.id_token_signed_response_alg, as.id_token_signing_alg_values_supported, "RS256"), getClockSkew(client), getClockTolerance(client), decryptFn).then(validatePresence.bind(void 0, requiredClaims)).then(validateIssuer.bind(void 0, as)).then(validateAudience.bind(void 0, client.client_id));
    if (Array.isArray(claims.aud) && claims.aud.length !== 1) {
      if (claims.azp === void 0) {
        throw OPE('ID Token "aud" (audience) claim includes additional untrusted audiences', JWT_CLAIM_COMPARISON, { claims, claim: "aud" });
      }
      if (claims.azp !== client.client_id) {
        throw OPE('unexpected ID Token "azp" (authorized party) claim value', JWT_CLAIM_COMPARISON, { expected: client.client_id, claims, claim: "azp" });
      }
    }
    if (claims.auth_time !== void 0) {
      assertNumber(claims.auth_time, true, 'ID Token "auth_time" (authentication time)', INVALID_RESPONSE, { claims });
    }
    jwtRefs.set(response, jwt);
    idTokenClaims.set(json, claims);
  }
  if (recognizedTokenTypes?.[json.token_type] !== void 0) {
    recognizedTokenTypes[json.token_type](response, json);
  } else if (json.token_type !== "dpop" && json.token_type !== "bearer") {
    throw new UnsupportedOperationError("unsupported `token_type` value", { cause: { body: json } });
  }
  return json;
}
function checkAuthenticationChallenges(response) {
  let challenges;
  if (challenges = parseWwwAuthenticateChallenges(response)) {
    throw new WWWAuthenticateChallengeError("server responded with a challenge in the WWW-Authenticate HTTP Header", { cause: challenges, response });
  }
}
async function processRefreshTokenResponse(as, client, response, options) {
  return processGenericAccessTokenResponse(as, client, response, void 0, options?.[jweDecrypt], options?.recognizedTokenTypes);
}
function validateAudience(expected, result) {
  if (Array.isArray(result.claims.aud)) {
    if (!result.claims.aud.includes(expected)) {
      throw OPE('unexpected JWT "aud" (audience) claim value', JWT_CLAIM_COMPARISON, {
        expected,
        claims: result.claims,
        claim: "aud"
      });
    }
  } else if (result.claims.aud !== expected) {
    throw OPE('unexpected JWT "aud" (audience) claim value', JWT_CLAIM_COMPARISON, {
      expected,
      claims: result.claims,
      claim: "aud"
    });
  }
  return result;
}
function validateIssuer(as, result) {
  const expected = as[_expectedIssuer]?.(result) ?? as.issuer;
  if (result.claims.iss !== expected) {
    throw OPE('unexpected JWT "iss" (issuer) claim value', JWT_CLAIM_COMPARISON, {
      expected,
      claims: result.claims,
      claim: "iss"
    });
  }
  return result;
}
var branded = /* @__PURE__ */ new WeakSet();
var jwtClaimNames = {
  aud: "audience",
  c_hash: "code hash",
  client_id: "client id",
  exp: "expiration time",
  iat: "issued at",
  iss: "issuer",
  jti: "jwt id",
  nonce: "nonce",
  s_hash: "state hash",
  sub: "subject",
  ath: "access token hash",
  htm: "http method",
  htu: "http uri",
  cnf: "confirmation",
  auth_time: "authentication time"
};
function validatePresence(required, result) {
  for (const claim of required) {
    if (result.claims[claim] === void 0) {
      throw OPE(`JWT "${claim}" (${jwtClaimNames[claim]}) claim missing`, INVALID_RESPONSE, {
        claims: result.claims
      });
    }
  }
  return result;
}
var WWW_AUTHENTICATE_CHALLENGE = "OAUTH_WWW_AUTHENTICATE_CHALLENGE";
var RESPONSE_BODY_ERROR = "OAUTH_RESPONSE_BODY_ERROR";
var UNSUPPORTED_OPERATION = "OAUTH_UNSUPPORTED_OPERATION";
var PARSE_ERROR = "OAUTH_PARSE_ERROR";
var INVALID_RESPONSE = "OAUTH_INVALID_RESPONSE";
var RESPONSE_IS_NOT_JSON = "OAUTH_RESPONSE_IS_NOT_JSON";
var RESPONSE_IS_NOT_CONFORM = "OAUTH_RESPONSE_IS_NOT_CONFORM";
var HTTP_REQUEST_FORBIDDEN = "OAUTH_HTTP_REQUEST_FORBIDDEN";
var REQUEST_PROTOCOL_FORBIDDEN = "OAUTH_REQUEST_PROTOCOL_FORBIDDEN";
var JWT_TIMESTAMP_CHECK = "OAUTH_JWT_TIMESTAMP_CHECK_FAILED";
var JWT_CLAIM_COMPARISON = "OAUTH_JWT_CLAIM_COMPARISON_FAILED";
var MISSING_SERVER_METADATA = "OAUTH_MISSING_SERVER_METADATA";
var INVALID_SERVER_METADATA = "OAUTH_INVALID_SERVER_METADATA";
async function clientCredentialsGrantRequest(as, client, clientAuthentication, parameters, options) {
  assertAs(as);
  assertClient(client);
  return tokenEndpointRequest(as, client, clientAuthentication, "client_credentials", new URLSearchParams(parameters), options);
}
async function genericTokenEndpointRequest(as, client, clientAuthentication, grantType, parameters, options) {
  assertAs(as);
  assertClient(client);
  assertString(grantType, '"grantType"');
  return tokenEndpointRequest(as, client, clientAuthentication, grantType, new URLSearchParams(parameters), options);
}
async function processGenericTokenEndpointResponse(as, client, response, options) {
  return processGenericAccessTokenResponse(as, client, response, void 0, options?.[jweDecrypt], options?.recognizedTokenTypes);
}
async function processClientCredentialsResponse(as, client, response, options) {
  return processGenericAccessTokenResponse(as, client, response, void 0, options?.[jweDecrypt], options?.recognizedTokenTypes);
}
function assertReadableResponse(response) {
  if (response.bodyUsed) {
    throw CodedTypeError('"response" body has been used already', ERR_INVALID_ARG_VALUE);
  }
}
async function validateJwt(jws, checkAlg, clockSkew2, clockTolerance2, decryptJwt) {
  let { 0: protectedHeader, 1: payload, length } = jws.split(".");
  if (length === 5) {
    if (decryptJwt !== void 0) {
      jws = await decryptJwt(jws);
      ({ 0: protectedHeader, 1: payload, length } = jws.split("."));
    } else {
      throw new UnsupportedOperationError("JWE decryption is not configured", { cause: jws });
    }
  }
  if (length !== 3) {
    throw OPE("Invalid JWT", INVALID_RESPONSE, jws);
  }
  let header;
  try {
    header = JSON.parse(buf(b64u(protectedHeader)));
  } catch (cause) {
    throw OPE("failed to parse JWT Header body as base64url encoded JSON", PARSE_ERROR, cause);
  }
  if (!isJsonObject(header)) {
    throw OPE("JWT Header must be a top level object", INVALID_RESPONSE, jws);
  }
  checkAlg(header);
  if (header.crit !== void 0) {
    throw new UnsupportedOperationError('no JWT "crit" header parameter extensions are supported', {
      cause: { header }
    });
  }
  let claims;
  try {
    claims = JSON.parse(buf(b64u(payload)));
  } catch (cause) {
    throw OPE("failed to parse JWT Payload body as base64url encoded JSON", PARSE_ERROR, cause);
  }
  if (!isJsonObject(claims)) {
    throw OPE("JWT Payload must be a top level object", INVALID_RESPONSE, jws);
  }
  const now = epochTime() + clockSkew2;
  if (claims.exp !== void 0) {
    if (typeof claims.exp !== "number") {
      throw OPE('unexpected JWT "exp" (expiration time) claim type', INVALID_RESPONSE, { claims });
    }
    if (claims.exp <= now - clockTolerance2) {
      throw OPE('unexpected JWT "exp" (expiration time) claim value, expiration is past current timestamp', JWT_TIMESTAMP_CHECK, { claims, now, tolerance: clockTolerance2, claim: "exp" });
    }
  }
  if (claims.iat !== void 0) {
    if (typeof claims.iat !== "number") {
      throw OPE('unexpected JWT "iat" (issued at) claim type', INVALID_RESPONSE, { claims });
    }
  }
  if (claims.iss !== void 0) {
    if (typeof claims.iss !== "string") {
      throw OPE('unexpected JWT "iss" (issuer) claim type', INVALID_RESPONSE, { claims });
    }
  }
  if (claims.nbf !== void 0) {
    if (typeof claims.nbf !== "number") {
      throw OPE('unexpected JWT "nbf" (not before) claim type', INVALID_RESPONSE, { claims });
    }
    if (claims.nbf > now + clockTolerance2) {
      throw OPE('unexpected JWT "nbf" (not before) claim value', JWT_TIMESTAMP_CHECK, {
        claims,
        now,
        tolerance: clockTolerance2,
        claim: "nbf"
      });
    }
  }
  if (claims.aud !== void 0) {
    if (typeof claims.aud !== "string" && !Array.isArray(claims.aud)) {
      throw OPE('unexpected JWT "aud" (audience) claim type', INVALID_RESPONSE, { claims });
    }
  }
  return { header, claims, jwt: jws };
}
function checkSigningAlgorithm(client, issuer, fallback, header) {
  if (client !== void 0) {
    if (typeof client === "string" ? header.alg !== client : !client.includes(header.alg)) {
      throw OPE('unexpected JWT "alg" header parameter', INVALID_RESPONSE, {
        header,
        expected: client,
        reason: "client configuration"
      });
    }
    return;
  }
  if (Array.isArray(issuer)) {
    if (!issuer.includes(header.alg)) {
      throw OPE('unexpected JWT "alg" header parameter', INVALID_RESPONSE, {
        header,
        expected: issuer,
        reason: "authorization server metadata"
      });
    }
    return;
  }
  if (fallback !== void 0) {
    if (typeof fallback === "string" ? header.alg !== fallback : typeof fallback === "function" ? !fallback(header.alg) : !fallback.includes(header.alg)) {
      throw OPE('unexpected JWT "alg" header parameter', INVALID_RESPONSE, {
        header,
        expected: fallback,
        reason: "default value"
      });
    }
    return;
  }
  throw OPE('missing client or server configuration to verify used JWT "alg" header parameter', void 0, { client, issuer, fallback });
}
async function getResponseJsonBody(response, check = assertApplicationJson) {
  let json;
  try {
    json = await response.json();
  } catch (cause) {
    check(response);
    throw OPE('failed to parse "response" body as JSON', PARSE_ERROR, cause);
  }
  if (!isJsonObject(json)) {
    throw OPE('"response" body must be a top level object', INVALID_RESPONSE, { body: json });
  }
  return json;
}
var _expectedIssuer = /* @__PURE__ */ Symbol();

// ../sdk/src/oauth-helpers.ts
var OAuth2Error = class extends Data2.TaggedError("OAuth2Error") {
};
var OAUTH2_REFRESH_SKEW_MS = 6e4;
var OAUTH2_DEFAULT_TIMEOUT_MS = 2e4;
var isLoopbackHttpUrl = (value) => {
  if (!URL.canParse(value)) return false;
  const url = new URL(value);
  if (url.protocol !== "http:") return false;
  const hostname = url.hostname.toLowerCase();
  return hostname === "localhost" || hostname === "0.0.0.0" || hostname === "::1" || hostname === "[::1]" || hostname.startsWith("127.");
};
var isSupportedOAuthEndpointUrl = (value, policy = {}) => {
  if (!URL.canParse(value)) return false;
  const url = new URL(value);
  return url.protocol === "https:" || isLoopbackHttpUrl(value) || url.protocol === "http:" && policy.allowHttp === true;
};
var assertSupportedOAuthEndpointUrl = (value, label = "OAuth endpoint URL", policy = {}) => {
  if (isSupportedOAuthEndpointUrl(value, policy)) return value;
  throw new TypeError(`${label} must use https: or loopback http:`);
};
var createPkceCodeVerifier = () => generateRandomCodeVerifier();
var createPkceCodeChallenge = (verifier) => calculatePKCECodeChallenge(verifier);
var createOAuthState = () => generateRandomState();
var buildAuthorizationUrl = (input) => {
  const url = new URL(
    assertSupportedOAuthEndpointUrl(
      input.authorizationUrl,
      "Authorization URL",
      input.endpointUrlPolicy
    )
  );
  const separator = input.scopeSeparator ?? " ";
  url.searchParams.set("client_id", input.clientId);
  url.searchParams.set("redirect_uri", input.redirectUrl);
  url.searchParams.set("response_type", "code");
  if (input.scopes.length > 0) {
    url.searchParams.set("scope", input.scopes.join(separator));
  }
  url.searchParams.set("state", input.state);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("code_challenge", input.codeChallenge);
  if (input.resource) {
    url.searchParams.set("resource", input.resource);
  }
  if (input.extraParams) {
    for (const [k, v] of Object.entries(input.extraParams)) {
      url.searchParams.set(k, v);
    }
  }
  return url.toString();
};
var providerAuthorizeExtras = (authorizationUrl) => {
  try {
    const host = new URL(authorizationUrl).host.toLowerCase();
    if (host === "accounts.google.com") {
      return { access_type: "offline", prompt: "consent" };
    }
  } catch {
  }
  return {};
};
var hostnameFromCallbackDomain = (callbackDomain) => {
  const trimmed = callbackDomain.trim();
  if (trimmed.length === 0) return void 0;
  const candidate = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
  if (!URL.canParse(candidate)) return void 0;
  const url = new URL(candidate);
  if (url.port !== "" || url.username !== "" || url.password !== "") return void 0;
  if (url.pathname !== "/" && url.pathname !== "") return void 0;
  return url.hostname.toLowerCase();
};
var siblingParentDomainOf = (hostname) => {
  const labels = hostname.split(".");
  if (labels.length < 3) return void 0;
  const parent = labels.slice(1).join(".");
  return parent.includes(".") ? parent : void 0;
};
var rebindTokenEndpointHostToCallbackDomain = (configuredTokenUrl, callbackDomain) => {
  if (!callbackDomain) return configuredTokenUrl;
  if (!URL.canParse(configuredTokenUrl)) return configuredTokenUrl;
  const configured = new URL(configuredTokenUrl);
  if (configured.protocol !== "https:") return configuredTokenUrl;
  const targetHost = hostnameFromCallbackDomain(callbackDomain);
  if (!targetHost) return configuredTokenUrl;
  const configuredHost = configured.hostname.toLowerCase();
  if (targetHost === configuredHost) return configuredTokenUrl;
  const configuredParent = siblingParentDomainOf(configuredHost);
  const targetParent = siblingParentDomainOf(targetHost);
  if (!configuredParent || !targetParent || configuredParent !== targetParent) {
    return configuredTokenUrl;
  }
  const rebound = new URL(configuredTokenUrl);
  rebound.hostname = targetHost;
  return rebound.toString();
};
var isOAuth2Error = Predicate2.isTagged("OAuth2Error");
var responseFromOAuthErrorCause = (cause) => {
  if (cause instanceof Response) return cause;
  if (typeof cause !== "object" || cause === null) return void 0;
  const envelope = cause;
  if (envelope.response instanceof Response) return envelope.response;
  if (envelope.cause instanceof Response) return envelope.cause;
  return void 0;
};
var redactTokenEndpointBody = (body) => body.replaceAll(
  /("(?:access_token|refresh_token|id_token|client_secret)"\s*:\s*")[^"]*(")/gi,
  "$1[redacted]$2"
).replaceAll(
  /((?:access_token|refresh_token|id_token|client_secret|code)=)[^&\s]*/gi,
  "$1[redacted]"
);
var tokenEndpointHttpSummary = async (response) => {
  const status = `HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ""}`;
  const contentType = response.headers.get("content-type");
  const url = response.url ? ` from ${response.url}` : "";
  const parts = [`${status}${url}`];
  if (contentType) parts.push(`content-type ${contentType}`);
  const preview = await bodyPreviewFromResponse(response);
  if (preview) parts.push(`body: ${preview}`);
  return parts.join("; ");
};
var bodyPreviewFromResponse = async (response) => {
  const text = await Promise.resolve().then(() => response.clone().text()).then(
    (value) => value.trim(),
    () => ""
  );
  if (!text) return void 0;
  const redacted = redactTokenEndpointBody(text.replaceAll(/\s+/g, " "));
  return redacted.length > 500 ? `${redacted.slice(0, 500)}...` : redacted;
};
var toOAuth2Error = (cause) => {
  if (isOAuth2Error(cause)) return cause;
  if (typeof cause === "object" && cause !== null) {
    const c = cause;
    const code = typeof c.error === "string" ? c.error : void 0;
    const description = typeof c.error_description === "string" ? c.error_description : typeof c.message === "string" ? c.message : void 0;
    return new OAuth2Error({
      message: `OAuth token exchange failed: ${description ?? code ?? "unknown error"}`,
      error: code,
      cause
    });
  }
  return new OAuth2Error({
    message: "OAuth token exchange failed",
    cause
  });
};
var toOAuth2ErrorWithHttpSummary = (cause) => {
  if (isOAuth2Error(cause)) return Effect6.succeed(cause);
  const base = toOAuth2Error(cause);
  const response = responseFromOAuthErrorCause(cause);
  if (!response) return Effect6.succeed(base);
  return Effect6.promise(() => tokenEndpointHttpSummary(response)).pipe(
    Effect6.map(
      (summary) => new OAuth2Error({
        message: `${base.message} (${summary})`,
        error: base.error,
        cause
      })
    )
  );
};
var failOAuth2WithHttpSummary = (cause) => toOAuth2ErrorWithHttpSummary(cause).pipe(Effect6.flatMap((error) => Effect6.fail(error)));
var DEFAULT_CLIENT_AUTH_METHOD = "body";
var asFromTokenUrl = (tokenUrl, endpointUrlPolicy = {}) => {
  assertSupportedOAuthEndpointUrl(tokenUrl, "Token URL", endpointUrlPolicy);
  const url = new URL(tokenUrl);
  return {
    issuer: `${url.protocol}//${url.host}`,
    token_endpoint: tokenUrl
  };
};
var asFromTokenUrlAndIssuer = (tokenUrl, issuerUrl, options = {}) => {
  const as = asFromTokenUrl(tokenUrl, options.endpointUrlPolicy);
  const withIssuer = issuerUrl ? { ...as, issuer: issuerUrl } : as;
  return options.idTokenSigningAlgValuesSupported ? {
    ...withIssuer,
    id_token_signing_alg_values_supported: [...options.idTokenSigningAlgValuesSupported]
  } : withIssuer;
};
var oauth4webapiRequestOptions = (targetUrl, timeoutMs, endpointUrlPolicy = {}, customFetch2) => {
  const options = {
    signal: AbortSignal.timeout(timeoutMs ?? OAUTH2_DEFAULT_TIMEOUT_MS)
  };
  if (customFetch2) {
    options[customFetch] = customFetch2;
  }
  if (isLoopbackHttpUrl(targetUrl) || URL.canParse(targetUrl) && new URL(targetUrl).protocol === "http:" && endpointUrlPolicy.allowHttp === true) {
    options[allowInsecureRequests] = true;
  }
  return options;
};
var pickClientAuth = (clientSecret, method) => {
  if (!clientSecret) return None();
  return method === "basic" ? ClientSecretBasic(clientSecret) : ClientSecretPost(clientSecret);
};
var tokenResponseFrom = (r) => ({
  access_token: r.access_token,
  token_type: r.token_type,
  refresh_token: r.refresh_token,
  expires_in: typeof r.expires_in === "number" ? r.expires_in : void 0,
  scope: r.scope
});
var JwtClaims = Schema8.Record(Schema8.String, Schema8.Unknown);
var decodeJwtClaims = Schema8.decodeUnknownOption(Schema8.fromJsonString(JwtClaims));
var stringClaim = (claims, key) => {
  const value = claims[key];
  if (typeof value !== "string") return void 0;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : void 0;
};
var decodeJwtPayload = (token) => {
  const payload = token.split(".")[1];
  if (!payload) return null;
  if (!/^[A-Za-z0-9_-]+$/.test(payload) || payload.length % 4 === 1) return null;
  const base64 = payload.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, "=");
  const utf8 = new TextDecoder().decode(
    Uint8Array.from(globalThis.atob(padded), (char) => char.charCodeAt(0))
  );
  const decoded = decodeJwtClaims(utf8);
  return Option.isSome(decoded) ? decoded.value : null;
};
var idTokenIdentityLabel = (idToken) => {
  if (!idToken) return void 0;
  const claims = decodeJwtPayload(idToken);
  if (!claims) return void 0;
  return stringClaim(claims, "email") ?? stringClaim(claims, "preferred_username") ?? stringClaim(claims, "sub");
};
var stripIdToken = async (response) => {
  const body = await response.clone().json().then(
    (value) => value,
    () => null
  );
  if (!body || typeof body !== "object" || !("id_token" in body)) {
    return { response };
  }
  const { id_token: idToken, ...rest } = body;
  const label = typeof idToken === "string" ? idTokenIdentityLabel(idToken) : void 0;
  return {
    response: new Response(JSON.stringify(rest), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    }),
    ...label ? { idTokenIdentityLabel: label } : {}
  };
};
var processTokenEndpointResponse = async (as, client, response) => {
  const stripped = await stripIdToken(response);
  const token = tokenResponseFrom(
    await processGenericTokenEndpointResponse(as, client, stripped.response)
  );
  return stripped.idTokenIdentityLabel ? { ...token, idTokenIdentityLabel: stripped.idTokenIdentityLabel } : token;
};
var exchangeAuthorizationCode = (input) => Effect6.tryPromise({
  try: async () => {
    const as = asFromTokenUrlAndIssuer(input.tokenUrl, input.issuerUrl, {
      idTokenSigningAlgValuesSupported: input.idTokenSigningAlgValuesSupported,
      endpointUrlPolicy: input.endpointUrlPolicy
    });
    const client = { client_id: input.clientId };
    const clientAuth = pickClientAuth(
      input.clientSecret,
      input.clientAuth ?? DEFAULT_CLIENT_AUTH_METHOD
    );
    const params = new URLSearchParams({
      code: input.code,
      redirect_uri: input.redirectUrl,
      code_verifier: input.codeVerifier
    });
    if (input.resource) {
      params.set("resource", input.resource);
    }
    const response = await genericTokenEndpointRequest(
      as,
      client,
      clientAuth,
      "authorization_code",
      params,
      oauth4webapiRequestOptions(
        input.tokenUrl,
        input.timeoutMs,
        input.endpointUrlPolicy,
        input.fetch
      )
    );
    return await processTokenEndpointResponse(as, client, response);
  },
  catch: (cause) => cause
}).pipe(Effect6.catch(failOAuth2WithHttpSummary));
var exchangeClientCredentials = (input) => Effect6.tryPromise({
  try: async () => {
    const as = asFromTokenUrl(input.tokenUrl, input.endpointUrlPolicy);
    const client = { client_id: input.clientId };
    const clientAuth = pickClientAuth(
      input.clientSecret,
      input.clientAuth ?? DEFAULT_CLIENT_AUTH_METHOD
    );
    const params = new URLSearchParams();
    if (input.scopes && input.scopes.length > 0) {
      params.set("scope", input.scopes.join(input.scopeSeparator ?? " "));
    }
    if (input.resource) {
      params.set("resource", input.resource);
    }
    const response = await clientCredentialsGrantRequest(
      as,
      client,
      clientAuth,
      params,
      oauth4webapiRequestOptions(
        input.tokenUrl,
        input.timeoutMs,
        input.endpointUrlPolicy,
        input.fetch
      )
    );
    const result = await processClientCredentialsResponse(as, client, response);
    return tokenResponseFrom(result);
  },
  catch: (cause) => cause
}).pipe(Effect6.catch(failOAuth2WithHttpSummary));
var refreshAccessToken = (input) => Effect6.tryPromise({
  try: async () => {
    const as = asFromTokenUrlAndIssuer(input.tokenUrl, input.issuerUrl, {
      idTokenSigningAlgValuesSupported: input.idTokenSigningAlgValuesSupported,
      endpointUrlPolicy: input.endpointUrlPolicy
    });
    const client = { client_id: input.clientId };
    const clientAuth = pickClientAuth(
      input.clientSecret,
      input.clientAuth ?? DEFAULT_CLIENT_AUTH_METHOD
    );
    const extraParams = new URLSearchParams();
    if (input.scopes && input.scopes.length > 0) {
      extraParams.set("scope", input.scopes.join(input.scopeSeparator ?? " "));
    }
    if (input.resource) {
      extraParams.set("resource", input.resource);
    }
    const additionalParameters = Array.from(extraParams.keys()).length > 0 ? extraParams : void 0;
    const response = await refreshTokenGrantRequest(
      as,
      client,
      clientAuth,
      input.refreshToken,
      {
        ...oauth4webapiRequestOptions(
          input.tokenUrl,
          input.timeoutMs,
          input.endpointUrlPolicy,
          input.fetch
        ),
        additionalParameters
      }
    );
    const result = await processRefreshTokenResponse(
      as,
      client,
      (await stripIdToken(response)).response
    );
    return tokenResponseFrom(result);
  },
  catch: (cause) => cause
}).pipe(Effect6.catch(failOAuth2WithHttpSummary));
var shouldRefreshToken = (input) => {
  if (input.expiresAt === null) return false;
  const now = input.now ?? Date.now();
  const skew = input.skewMs ?? OAUTH2_REFRESH_SKEW_MS;
  return input.expiresAt <= now + skew;
};

// ../sdk/src/oauth-discovery.ts
var OAuthDiscoveryError = class extends Data3.TaggedError("OAuthDiscoveryError") {
};
var StringArray = Schema9.Array(Schema9.String);
var OAuthProtectedResourceMetadataSchema = Schema9.Struct({
  resource: Schema9.optional(Schema9.String),
  authorization_servers: Schema9.optional(StringArray),
  scopes_supported: Schema9.optional(StringArray),
  bearer_methods_supported: Schema9.optional(StringArray),
  resource_documentation: Schema9.optional(Schema9.String)
}).annotate({ identifier: "OAuthProtectedResourceMetadata" });
var OAuthAuthorizationServerMetadataSchema = Schema9.Struct({
  issuer: Schema9.String,
  authorization_endpoint: Schema9.String,
  token_endpoint: Schema9.String,
  registration_endpoint: Schema9.optional(Schema9.String),
  client_id_metadata_document_supported: Schema9.optional(Schema9.Boolean),
  scopes_supported: Schema9.optional(StringArray),
  response_types_supported: Schema9.optional(StringArray),
  grant_types_supported: Schema9.optional(StringArray),
  code_challenge_methods_supported: Schema9.optional(StringArray),
  token_endpoint_auth_methods_supported: Schema9.optional(StringArray),
  revocation_endpoint: Schema9.optional(Schema9.String),
  introspection_endpoint: Schema9.optional(Schema9.String),
  userinfo_endpoint: Schema9.optional(Schema9.String),
  id_token_signing_alg_values_supported: Schema9.optional(StringArray)
}).annotate({ identifier: "OAuthAuthorizationServerMetadata" });
var OAuthClientInformationSchema = Schema9.Struct({
  client_id: Schema9.String,
  client_secret: Schema9.optional(Schema9.String),
  client_id_issued_at: Schema9.optional(Schema9.Number),
  client_secret_expires_at: Schema9.optional(Schema9.Number),
  registration_access_token: Schema9.optional(Schema9.String),
  registration_client_uri: Schema9.optional(Schema9.String),
  token_endpoint_auth_method: Schema9.optional(Schema9.String),
  grant_types: Schema9.optional(StringArray),
  response_types: Schema9.optional(StringArray),
  redirect_uris: Schema9.optional(StringArray),
  client_name: Schema9.optional(Schema9.String),
  scope: Schema9.optional(Schema9.String)
}).annotate({ identifier: "OAuthClientInformation" });
var decodeResourceMetadataJson = Schema9.decodeUnknownEffect(
  Schema9.fromJsonString(OAuthProtectedResourceMetadataSchema)
);
var decodeAuthServerMetadata = Schema9.decodeUnknownEffect(OAuthAuthorizationServerMetadataSchema);
var decodeClientInformationJson = Schema9.decodeUnknownEffect(
  Schema9.fromJsonString(OAuthClientInformationSchema)
);
var MCP_PROTOCOL_VERSION_HEADER = "mcp-protocol-version";
var validateEndpointUrl = (value, label, policy = {}) => Effect7.try({
  try: () => assertSupportedOAuthEndpointUrl(value, label, policy),
  catch: (cause) => new OAuthDiscoveryError({
    message: `${label} must use https: or loopback http:`,
    cause
  })
});
var validateAuthorizationServerMetadata = (metadata, policy = {}) => Effect7.gen(function* () {
  yield* validateEndpointUrl(metadata.issuer, "issuer", policy);
  yield* validateEndpointUrl(metadata.authorization_endpoint, "authorization_endpoint", policy);
  yield* validateEndpointUrl(metadata.token_endpoint, "token_endpoint", policy);
  if (metadata.registration_endpoint) {
    yield* validateEndpointUrl(metadata.registration_endpoint, "registration_endpoint", policy);
  }
});
var provideHttpClient = (effect, options) => effect.pipe(Effect7.provide(options.httpClientLayer ?? FetchHttpClient.layer));
var executeText = (request, options, errorMessage) => provideHttpClient(
  Effect7.gen(function* () {
    const client = yield* HttpClient.HttpClient;
    const response = yield* client.execute(request).pipe(
      Effect7.timeoutOrElse({
        duration: Duration.millis(options.timeoutMs ?? OAUTH2_DEFAULT_TIMEOUT_MS),
        orElse: () => Effect7.fail(
          new OAuthDiscoveryError({
            message: errorMessage,
            cause: "timeout"
          })
        )
      }),
      Effect7.mapError(
        (cause) => Predicate3.isTagged(cause, "OAuthDiscoveryError") ? cause : new OAuthDiscoveryError({
          message: errorMessage,
          cause
        })
      )
    );
    const body = yield* response.text.pipe(
      Effect7.catch(() => Effect7.succeed("")),
      Effect7.mapError(
        (cause) => new OAuthDiscoveryError({
          message: `${errorMessage}: response body could not be read`,
          status: response.status,
          cause
        })
      )
    );
    return { status: response.status, body };
  }),
  options
);
var buildResourceMetadataUrls = (resourceUrl) => {
  const url = new URL(resourceUrl);
  const origin = `${url.protocol}//${url.host}`;
  const path = url.pathname.replace(/\/+$/, "");
  const urls = [];
  if (path && path !== "/") {
    urls.push(`${origin}/.well-known/oauth-protected-resource${path}`);
  }
  urls.push(`${origin}/.well-known/oauth-protected-resource`);
  return urls;
};
var withResourceQueryParams = (url, queryParams) => {
  if (!queryParams || Object.keys(queryParams).length === 0) return url;
  const parsed = new URL(url);
  for (const [key, value] of Object.entries(queryParams)) {
    parsed.searchParams.set(key, value);
  }
  return parsed.toString();
};
var discoverProtectedResourceMetadata = (resourceUrl, options = {}) => Effect7.gen(function* () {
  for (const url of buildResourceMetadataUrls(resourceUrl)) {
    const requestUrl = withResourceQueryParams(url, options.resourceQueryParams);
    let request = HttpClientRequest.get(requestUrl).pipe(
      HttpClientRequest.setHeader("accept", "application/json")
    );
    for (const [name, value] of Object.entries(options.resourceHeaders ?? {})) {
      request = HttpClientRequest.setHeader(request, name, value);
    }
    if (options.mcpProtocolVersion) {
      request = HttpClientRequest.setHeader(
        request,
        MCP_PROTOCOL_VERSION_HEADER,
        options.mcpProtocolVersion
      );
    }
    const result = yield* executeText(
      request,
      options,
      `Failed to fetch protected resource metadata from ${url}`
    );
    if (result.status === 404 || result.status === 405 || result.body.length === 0) continue;
    if (result.status < 200 || result.status >= 300) {
      return yield* new OAuthDiscoveryError({
        message: `Protected resource metadata returned status ${result.status}`,
        status: result.status
      });
    }
    const metadata = yield* decodeResourceMetadataJson(result.body).pipe(
      Effect7.mapError(
        (err) => new OAuthDiscoveryError({
          message: "Protected resource metadata is malformed",
          cause: err
        })
      )
    );
    return { metadataUrl: url, metadata };
  }
  return null;
});
var wellKnownUrlFor = (issuerOrigin2, algorithm, issuerPath) => {
  const suffix = algorithm === "oauth2" ? "oauth-authorization-server" : "openid-configuration";
  return issuerPath && issuerPath !== "/" ? `${issuerOrigin2}/.well-known/${suffix}${issuerPath}` : `${issuerOrigin2}/.well-known/${suffix}`;
};
var discoverAuthorizationServerMetadata = (issuer, options = {}) => Effect7.gen(function* () {
  yield* validateEndpointUrl(issuer, "issuer", options.endpointUrlPolicy);
  const issuerUrl = new URL(issuer);
  const issuerOrigin2 = `${issuerUrl.protocol}//${issuerUrl.host}`;
  const issuerPath = issuerUrl.pathname.replace(/\/+$/, "");
  for (const algorithm of ["oauth2", "oidc"]) {
    const metadataUrl = wellKnownUrlFor(issuerOrigin2, algorithm, issuerPath);
    let request = HttpClientRequest.get(metadataUrl).pipe(
      HttpClientRequest.setHeader("accept", "application/json")
    );
    if (options.mcpProtocolVersion) {
      request = HttpClientRequest.setHeader(
        request,
        MCP_PROTOCOL_VERSION_HEADER,
        options.mcpProtocolVersion
      );
    }
    const result = yield* executeText(
      request,
      options,
      `Discovery (${algorithm}) failed for ${issuer}`
    ).pipe(
      Effect7.map((response2) => {
        if (response2.status === 404 || response2.status === 405) return null;
        return response2;
      }),
      // If one algorithm fails mid-roundtrip (network, parse, issuer
      // mismatch) we still want to try the other before giving up.
      Effect7.result
    );
    if (Result.isFailure(result)) continue;
    const response = result.success;
    if (response === null) continue;
    if (response.status < 200 || response.status >= 300) continue;
    const raw = yield* Schema9.decodeUnknownEffect(Schema9.fromJsonString(Schema9.Unknown))(
      response.body
    ).pipe(
      Effect7.mapError(
        (err) => new OAuthDiscoveryError({
          message: "Authorization server metadata is malformed",
          cause: err
        })
      )
    );
    const metadata = yield* decodeAuthServerMetadata(raw).pipe(
      Effect7.mapError(
        (err) => new OAuthDiscoveryError({
          message: "Authorization server metadata is malformed",
          cause: err
        })
      )
    );
    yield* validateAuthorizationServerMetadata(metadata, options.endpointUrlPolicy);
    return { metadataUrl, metadata };
  }
  return null;
});
var DcrErrorBody = class extends Data3.TaggedError("DcrErrorBody") {
};
var DcrTransport = class extends Data3.TaggedError("DcrTransport") {
};
var DcrErrorBodyJson = Schema9.Struct({
  error: Schema9.String,
  error_description: Schema9.optional(Schema9.String)
});
var decodeDcrErrorBodyJson = Schema9.decodeUnknownOption(Schema9.fromJsonString(DcrErrorBodyJson));
var buildDcrBody = (m) => {
  const body = { redirect_uris: [...m.redirect_uris] };
  if (m.client_name !== void 0) body.client_name = m.client_name;
  if (m.grant_types !== void 0) body.grant_types = [...m.grant_types];
  if (m.response_types !== void 0) body.response_types = [...m.response_types];
  if (m.token_endpoint_auth_method !== void 0) {
    body.token_endpoint_auth_method = m.token_endpoint_auth_method;
  }
  if (m.scope !== void 0) body.scope = m.scope;
  if (m.application_type !== void 0) body.application_type = m.application_type;
  if (m.client_uri !== void 0) body.client_uri = m.client_uri;
  if (m.logo_uri !== void 0) body.logo_uri = m.logo_uri;
  if (m.contacts !== void 0) body.contacts = [...m.contacts];
  if (m.software_id !== void 0) body.software_id = m.software_id;
  if (m.software_version !== void 0) body.software_version = m.software_version;
  if (m.extra) for (const [k, v] of Object.entries(m.extra)) body[k] = v;
  return body;
};
var interpretDcrFailure = (status, text) => {
  if (status >= 400 && status < 500) {
    const body = text ? decodeDcrErrorBodyJson(text) : null;
    return Option2.match(body ?? Option2.none(), {
      onNone: () => new DcrTransport({
        detail: `Dynamic Client Registration endpoint returned status ${status}${text ? ` \u2014 ${text.slice(0, 200)}` : ""}`,
        status
      }),
      onSome: (parsed) => parsed.error.length > 0 ? new DcrErrorBody({
        status,
        error: parsed.error,
        error_description: parsed.error_description
      }) : new DcrTransport({
        detail: `Dynamic Client Registration endpoint returned status ${status}${text ? ` \u2014 ${text.slice(0, 200)}` : ""}`,
        status
      })
    });
  }
  return new DcrTransport({
    detail: `Dynamic Client Registration endpoint returned status ${status}${text ? ` \u2014 ${text.slice(0, 200)}` : ""}`,
    status
  });
};
var registerDynamicClient = (input, options = {}) => Effect7.gen(function* () {
  yield* validateEndpointUrl(
    input.registrationEndpoint,
    "registration_endpoint",
    options.endpointUrlPolicy
  ).pipe(
    Effect7.mapError(
      (cause) => new DcrTransport({
        detail: "registration_endpoint must use https: or loopback http:",
        cause
      })
    )
  );
  const headers = {
    "content-type": "application/json",
    accept: "application/json"
  };
  if (input.initialAccessToken) {
    headers.authorization = `Bearer ${input.initialAccessToken}`;
  }
  let request = HttpClientRequest.post(input.registrationEndpoint).pipe(
    HttpClientRequest.bodyJsonUnsafe(buildDcrBody(input.metadata))
  );
  for (const [name, value] of Object.entries(headers)) {
    request = HttpClientRequest.setHeader(request, name, value);
  }
  const response = yield* executeText(
    request,
    options,
    "Dynamic Client Registration request failed"
  ).pipe(
    Effect7.mapError(
      (cause) => new DcrTransport({
        detail: "Dynamic Client Registration request failed",
        cause
      })
    )
  );
  if (response.status !== 200 && response.status !== 201) {
    return yield* interpretDcrFailure(response.status, response.body);
  }
  return yield* decodeClientInformationJson(response.body).pipe(
    Effect7.mapError(
      (err) => new OAuthDiscoveryError({
        message: "Dynamic Client Registration response is malformed",
        cause: err
      })
    )
  );
}).pipe(
  Effect7.catchTags({
    DcrErrorBody: (err) => Effect7.fail(
      new OAuthDiscoveryError({
        message: `Dynamic Client Registration failed: ${err.error}${err.error_description ? ` \u2014 ${err.error_description}` : ""}`,
        status: err.status,
        error: err.error,
        errorDescription: err.error_description,
        cause: err
      })
    ),
    DcrTransport: (err) => Effect7.fail(
      new OAuthDiscoveryError({
        message: `Dynamic Client Registration failed: ${err.detail}`,
        status: err.status,
        cause: err.cause ?? err
      })
    )
  })
);

// ../sdk/src/oauth.ts
import { Encoding, Option as Option3, Result as Result2, Schema as Schema10 } from "effect";
var OAUTH2_SESSION_TTL_MS = 15 * 60 * 1e3;
var OAuthCallbackStateSchema = Schema10.Struct({
  state: Schema10.String,
  orgSlug: Schema10.String
});
var OAuthCallbackStateFromJson = Schema10.fromJsonString(OAuthCallbackStateSchema);
var decodeOAuthCallbackStateJson = Schema10.decodeUnknownOption(OAuthCallbackStateFromJson);
var encodeOAuthCallbackStateJson = Schema10.encodeSync(OAuthCallbackStateFromJson);
var encodeOAuthCallbackState = (input) => {
  const orgSlug = input.orgSlug?.trim();
  if (!orgSlug) return input.state;
  return Encoding.encodeBase64Url(encodeOAuthCallbackStateJson({ state: input.state, orgSlug }));
};

// ../../../node_modules/.bun/tldts-core@7.0.28/node_modules/tldts-core/dist/es6/src/options.js
function setDefaultsImpl({ allowIcannDomains = true, allowPrivateDomains = false, detectIp = true, extractHostname: extractHostname2 = true, mixedInputs = true, validHosts = null, validateHostname = true }) {
  return {
    allowIcannDomains,
    allowPrivateDomains,
    detectIp,
    extractHostname: extractHostname2,
    mixedInputs,
    validHosts,
    validateHostname
  };
}
var DEFAULT_OPTIONS = (
  /*@__INLINE__*/
  setDefaultsImpl({})
);

// ../../../node_modules/.bun/tldts-core@7.0.28/node_modules/tldts-core/dist/es6/src/factory.js
function getEmptyResult() {
  return {
    domain: null,
    domainWithoutSuffix: null,
    hostname: null,
    isIcann: null,
    isIp: null,
    isPrivate: null,
    publicSuffix: null,
    subdomain: null
  };
}

// ../../../node_modules/.bun/tldts@7.0.28/node_modules/tldts/dist/es6/index.js
var RESULT = getEmptyResult();

// ../sdk/src/oauth-gc.ts
var parseUrl = (value) => {
  if (!URL.canParse(value)) return null;
  return new URL(value);
};
var canonicalIssuerUrl = (value) => {
  if (value == null) return null;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  const url = parseUrl(trimmed);
  if (url === null) return null;
  const path = url.pathname.replace(/\/+$/g, "");
  return path.length > 0 ? `${url.origin}${path}` : url.origin;
};
var hostOfUrl = (value) => parseUrl(value)?.host.toLowerCase() ?? null;
var isDcrClassifiedRow = (row) => {
  if (row.origin_kind === "dynamic_client_registration") return true;
  if (row.origin_kind != null) return false;
  if (row.grant !== "authorization_code") return false;
  const resource = row.resource == null ? "" : String(row.resource);
  return resource.length > 0;
};

// ../sdk/src/oauth-service.ts
var looseDb = (db) => db;
var accessItemId = (owner, integration, name) => `oauth:${owner}:${integration}:${name}`;
var refreshItemIdFor = (accessId) => `${accessId}:refresh`;
var dedupeScopes = (scopes) => [...new Set(scopes)];
var intersectScopes = (requested, supported) => {
  if (!supported || supported.length === 0) return requested;
  const supportedSet = new Set(supported);
  return requested.filter((scope) => supportedSet.has(scope));
};
var recordedOAuthScope = (token, requestedScopes) => {
  if (token.scope == null) return requestedScopes.join(" ") || null;
  const granted = token.scope.split(/\s+/).filter(Boolean);
  const coveredByRefreshToken = token.refresh_token && requestedScopes.includes("offline_access") ? ["offline_access"] : [];
  const recorded = dedupeScopes([...granted, ...coveredByRefreshToken]);
  return recorded.join(" ") || null;
};
var OAUTH_SCOPE_ALIASES = {
  "https://www.googleapis.com/auth/userinfo.email": "email",
  "https://www.googleapis.com/auth/userinfo.profile": "profile"
};
var informationalOAuthScopes = /* @__PURE__ */ new Set(["openid", "email", "profile", "offline_access"]);
var canonicalOAuthScope = (scope) => {
  const aliased = OAUTH_SCOPE_ALIASES[scope];
  if (aliased) return aliased;
  if (/^https?:\/\/graph\.microsoft\.(com|us|de)\//i.test(scope)) {
    return scope.slice(scope.lastIndexOf("/") + 1);
  }
  return scope;
};
var isMetaOAuthScope = (scope) => scope.toLowerCase().endsWith("/.default");
var normalizedOAuthScopeSet = (scopes) => new Set(scopes.map((scope) => canonicalOAuthScope(scope.trim())).filter(Boolean));
var missingGrantedOAuthScopes = (requestedScopes, recordedScope) => {
  const granted = normalizedOAuthScopeSet(recordedScope?.split(/\s+/).filter(Boolean) ?? []);
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const raw of requestedScopes) {
    const trimmed = raw.trim();
    if (isMetaOAuthScope(trimmed)) continue;
    const scope = canonicalOAuthScope(trimmed);
    if (scope.length === 0 || informationalOAuthScopes.has(scope) || seen.has(scope)) continue;
    seen.add(scope);
    if (!granted.has(scope)) out.push(scope);
  }
  return out;
};
var decodeJsonPayload = Schema11.decodeUnknownOption(Schema11.UnknownFromJsonString);
var requestedScopesFromPayload = (payload) => {
  const decoded = typeof payload === "string" ? decodeJsonPayload(payload).pipe(Option4.getOrElse(() => payload)) : payload;
  if (decoded === null || typeof decoded !== "object") return null;
  const value = decoded.requestedScopes;
  return Array.isArray(value) ? value.filter((s) => typeof s === "string") : null;
};
var clientOwnerFromPayload = (payload) => {
  const decoded = typeof payload === "string" ? decodeJsonPayload(payload).pipe(Option4.getOrElse(() => payload)) : payload;
  if (decoded === null || typeof decoded !== "object") return null;
  const value = decoded.clientOwner;
  return value === "user" || value === "org" ? value : null;
};
var parseGrant = (grant) => grant === "client_credentials" || grant === "authorization_code" ? grant : null;
var canonicalDcrIssuer = (issuer, registrationEndpoint) => {
  const discovered = canonicalIssuerUrl(issuer);
  if (discovered !== null) return discovered;
  const endpoint = parseUrl(registrationEndpoint);
  return endpoint === null ? null : endpoint.origin;
};
var issuerOrigin = (issuer) => parseUrl(issuer)?.origin ?? null;
var issuerIsOriginOnly = (issuer) => issuerOrigin(issuer) === issuer;
var dcrIssuerMatches = (rowIssuer, inputIssuer) => inputIssuer !== null && (rowIssuer === inputIssuer || issuerIsOriginOnly(inputIssuer) && issuerOrigin(rowIssuer) === inputIssuer);
var slugifyOAuthKey = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
var shortStableHash = (value) => {
  let hash2 = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash2 ^= value.charCodeAt(i);
    hash2 = Math.imul(hash2, 16777619);
  }
  return (hash2 >>> 0).toString(36);
};
var dcrClientSlug = (issuer, resource, fallback) => {
  if (issuer === null) return fallback;
  const issuerHost = hostOfUrl(issuer);
  if (issuerHost === null) return fallback;
  const base = `dcr-${slugifyOAuthKey(issuerHost) || "authorization-server"}`;
  if (resource === null) return OAuthClientSlug.make(base);
  const resourceUrl = parseUrl(resource);
  const resourceSource = resourceUrl === null ? resource : `${resourceUrl.host}${resourceUrl.pathname}`;
  const resourcePart = slugifyOAuthKey(resourceSource).slice(0, 60) || "resource";
  return OAuthClientSlug.make(`${base}-${resourcePart}-${shortStableHash(resource)}`.slice(0, 240));
};
var uniqueDcrSlug = (slug, taken) => {
  const base = String(slug);
  if (!taken.has(base)) return slug;
  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  return OAuthClientSlug.make(`${base}-${suffix}`);
};
var parseOAuthClientOrigin = (row) => {
  if (!isDcrClassifiedRow(row)) {
    return {
      kind: "manual",
      integration: row.origin_integration == null ? null : IntegrationSlug.make(String(row.origin_integration))
    };
  }
  return {
    kind: "dynamic_client_registration",
    integration: row.origin_kind === "dynamic_client_registration" && row.origin_integration != null ? IntegrationSlug.make(String(row.origin_integration)) : null
  };
};
var clientSecretItemId = (owner, slug) => `oauth-client:${owner}:${slug}:secret`;
var expiresAtFrom = (token) => typeof token.expires_in === "number" ? Date.now() + token.expires_in * 1e3 : null;
var REDIRECT_URI_REQUIRED_MESSAGE = "OAuth redirect flow requires a configured redirectUri, but none was provided to the executor. Pass `redirectUri` to createExecutor (hosts derive it from the web base URL / request origin as `${webBaseUrl}${mountPrefix}/oauth/callback`).";
var canonicalUrlString = (value) => {
  const url = new URL(value.trim());
  url.hash = "";
  return url.toString();
};
var isWellKnownOAuthMetadataUrl = (value) => {
  const path = new URL(value.trim()).pathname.toLowerCase();
  return path.includes("/.well-known/oauth-authorization-server") || path.includes("/.well-known/openid-configuration") || path.includes("/.well-known/oauth-protected-resource");
};
var validateSupportedEndpoint = (value, label, endpointUrlPolicy) => Effect8.try({
  try: () => assertSupportedOAuthEndpointUrl(value, label, endpointUrlPolicy),
  catch: (cause) => new StorageError({
    message: `Invalid OAuth client endpoint configuration: ${label} must use https: or loopback http:.`,
    cause
  })
}).pipe(Effect8.asVoid);
var validateClientEndpoints = (input, endpointUrlPolicy) => Effect8.gen(function* () {
  yield* validateSupportedEndpoint(input.tokenUrl, "token_url", endpointUrlPolicy);
  if (input.resource != null && input.resource.trim().length > 0) {
    yield* validateSupportedEndpoint(input.resource, "resource", endpointUrlPolicy);
  }
  if (input.grant !== "authorization_code") return;
  yield* validateSupportedEndpoint(
    input.authorizationUrl,
    "authorization_url",
    endpointUrlPolicy
  );
  if (isWellKnownOAuthMetadataUrl(input.authorizationUrl)) {
    return yield* new StorageError({
      message: "Invalid OAuth client endpoint configuration: authorization_url must be the OAuth authorization endpoint, not a .well-known metadata URL.",
      cause: void 0
    });
  }
  if (canonicalUrlString(input.authorizationUrl) === canonicalUrlString(input.tokenUrl)) {
    return yield* new StorageError({
      message: "Invalid OAuth client endpoint configuration: authorization_url must not equal token_url.",
      cause: void 0
    });
  }
});
var makeOAuthService = (deps) => {
  const httpClientLayer = deps.httpClientLayer ?? FetchHttpClient2.layer;
  const fetch2 = deps.fetch;
  const redirectUri = deps.redirectUri;
  const discoveryOptions = { endpointUrlPolicy: deps.endpointUrlPolicy };
  const filterAuthorizationCodeScopes = (client, requestedScopes) => Effect8.gen(function* () {
    if (requestedScopes.length === 0) return requestedScopes;
    const resource = client.resource ? yield* discoverProtectedResourceMetadata(client.resource, discoveryOptions).pipe(
      Effect8.catch(() => Effect8.succeed(null)),
      Effect8.provide(httpClientLayer)
    ) : null;
    const issuer = resource?.metadata.authorization_servers?.[0] ?? new URL(client.authorizationUrl).origin;
    const as = yield* discoverAuthorizationServerMetadata(issuer, discoveryOptions).pipe(
      Effect8.catch(() => Effect8.succeed(null)),
      Effect8.provide(httpClientLayer)
    );
    return intersectScopes(requestedScopes, as?.metadata.scopes_supported);
  }).pipe(Effect8.catch(() => Effect8.succeed(requestedScopes)));
  const MAX_DISCOVERY_AUTH_SERVERS = 3;
  const MAX_DISCOVERED_SCOPES = 100;
  const capScopes = (scopes) => dedupeScopes(scopes).slice(0, MAX_DISCOVERED_SCOPES);
  const discoverScopesForResource = (resource) => Effect8.gen(function* () {
    if (resource == null) {
      return yield* new OAuthDiscoveryError({
        message: "Cannot discover OAuth scopes: the client has no resource configured"
      });
    }
    const discoveryOptions2 = { endpointUrlPolicy: deps.endpointUrlPolicy, httpClientLayer };
    const protectedResource = yield* discoverProtectedResourceMetadata(
      resource,
      discoveryOptions2
    );
    const resourceScopes = protectedResource?.metadata.scopes_supported;
    if (resourceScopes !== void 0) return capScopes(resourceScopes);
    for (const issuer of (protectedResource?.metadata.authorization_servers ?? []).slice(
      0,
      MAX_DISCOVERY_AUTH_SERVERS
    )) {
      const authServer = yield* discoverAuthorizationServerMetadata(
        issuer,
        discoveryOptions2
      ).pipe(Effect8.catchTag("OAuthDiscoveryError", () => Effect8.succeed(null)));
      const scopes = authServer?.metadata.scopes_supported;
      if (scopes !== void 0) return capScopes(scopes);
    }
    return [];
  }).pipe(
    // Bound the whole sequence (PRM + up to MAX_DISCOVERY_AUTH_SERVERS AS
    // fetches, each with its own request timeout). 30s is larger than a single
    // request timeout so it bounds the sequence, not a slow-but-valid request.
    Effect8.timeoutOrElse({
      duration: Duration2.seconds(30),
      orElse: () => Effect8.fail(
        new OAuthDiscoveryError({
          message: "OAuth scope discovery timed out",
          cause: "timeout"
        })
      )
    })
  );
  const createClient = (input) => Effect8.gen(function* () {
    yield* validateClientEndpoints(input, deps.endpointUrlPolicy);
    const keys = yield* Effect8.try({
      try: () => deps.ownedKeys(input.owner),
      catch: (cause) => new StorageError({
        message: "Cannot write oauth_client for owner without a subject",
        cause
      })
    });
    const now = /* @__PURE__ */ new Date();
    let clientSecretItemIdValue = null;
    if (input.clientSecret.length > 0) {
      const provider = deps.defaultWritableProvider();
      if (!provider || !provider.set) {
        return yield* new StorageError({
          message: "No default writable credential provider is registered to store the OAuth client secret.",
          cause: void 0
        });
      }
      clientSecretItemIdValue = clientSecretItemId(input.owner, input.slug);
      yield* provider.set(ProviderItemId.make(clientSecretItemIdValue), input.clientSecret);
    }
    yield* deps.fuma.use(
      "oauth_client.deleteExisting",
      (db) => looseDb(db).deleteMany("oauth_client", {
        where: (b) => b.and(b("owner", "=", input.owner), b("slug", "=", String(input.slug)))
      })
    ).pipe(Effect8.catch(() => Effect8.void));
    yield* deps.fuma.use(
      "oauth_client.create",
      (db) => looseDb(db).create("oauth_client", {
        tenant: keys.tenant,
        owner: keys.owner,
        subject: keys.subject,
        slug: String(input.slug),
        authorization_url: input.authorizationUrl,
        token_url: input.tokenUrl,
        grant: input.grant,
        client_id: input.clientId,
        client_secret_item_id: clientSecretItemIdValue,
        resource: input.resource ?? null,
        origin_kind: input.origin?.kind ?? "manual",
        // Recorded intent, kept for BOTH origins: a manual app registered from
        // an integration's dialog stamps its integration so the picker can
        // match it exactly, the same way a DCR client records the integration
        // that requested it.
        origin_integration: input.origin?.integration == null ? null : String(input.origin.integration),
        origin_issuer: input.origin?.kind === "dynamic_client_registration" ? canonicalIssuerUrl(input.originIssuer) ?? null : null,
        created_at: now
      })
    );
    return input.slug;
  });
  const removeClient = (owner, slug) => Effect8.gen(function* () {
    yield* deps.fuma.use(
      "oauth_client.delete",
      (db) => looseDb(db).deleteMany("oauth_client", {
        where: (b) => b.and(b("owner", "=", owner), b("slug", "=", String(slug)))
      })
    ).pipe(Effect8.asVoid);
    const provider = deps.defaultWritableProvider();
    if (provider?.delete) {
      yield* provider.delete(ProviderItemId.make(clientSecretItemId(owner, slug))).pipe(Effect8.catch(() => Effect8.void));
    }
  });
  const pickDcrAuthMethod = (advertised) => !advertised || advertised.length === 0 || advertised.includes("none") ? "none" : "client_secret_post";
  const candidateCreatedAt = (value) => {
    if (value instanceof Date) {
      const ms = value.getTime();
      return Number.isFinite(ms) ? ms : 0;
    }
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (typeof value === "string") {
      const ms = Date.parse(value);
      return Number.isFinite(ms) ? ms : 0;
    }
    return 0;
  };
  const dcrCandidatesForIssuer = (owner, issuer) => deps.fuma.use(
    "oauth_client.findMany",
    (db) => looseDb(db).findMany("oauth_client", {
      where: (b) => b("owner", "=", owner)
    })
  ).pipe(
    Effect8.map((rows) => {
      const matches = rows.flatMap(
        (row) => {
          if (parseOAuthClientOrigin(row).kind !== "dynamic_client_registration") return [];
          const rowIssuer = row.origin_issuer == null ? null : canonicalIssuerUrl(String(row.origin_issuer));
          const issuerMatches = rowIssuer !== null && dcrIssuerMatches(rowIssuer, issuer);
          if (!issuerMatches) return [];
          return [
            {
              slug: OAuthClientSlug.make(String(row.slug)),
              resource: row.resource == null ? null : String(row.resource),
              createdAt: candidateCreatedAt(row.created_at)
            }
          ];
        }
      );
      return [...matches].sort(
        (a, b) => a.createdAt - b.createdAt || (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0)
      ).map(({ slug, resource }) => ({ slug, resource }));
    })
  );
  const decideDcrClientReuse = (input, issuer) => Effect8.gen(function* () {
    const candidates = yield* dcrCandidatesForIssuer(input.owner, issuer);
    const resource = input.resource ?? null;
    if (resource !== null) {
      const matchingResource = candidates.find((client) => client.resource === resource);
      if (matchingResource) {
        return { existingSlug: matchingResource.slug, registrationSlug: matchingResource.slug };
      }
      const slug2 = dcrClientSlug(issuer, candidates.length > 0 ? resource : null, input.slug);
      return {
        existingSlug: null,
        registrationSlug: slug2
      };
    }
    const reusable = candidates.find((client) => client.resource === null);
    if (reusable) return { existingSlug: reusable.slug, registrationSlug: reusable.slug };
    const takenSlugs = new Set(candidates.map((client) => String(client.slug)));
    const slug = uniqueDcrSlug(dcrClientSlug(issuer, null, input.slug), takenSlugs);
    return { existingSlug: null, registrationSlug: slug };
  });
  const registerDynamicClient2 = (input) => Effect8.gen(function* () {
    const issuer = canonicalDcrIssuer(input.issuer, input.registrationEndpoint);
    const reuse = yield* decideDcrClientReuse(input, issuer);
    if (reuse.existingSlug !== null) return reuse.existingSlug;
    const slug = reuse.registrationSlug;
    const flowRedirectUri = input.redirectUri ?? redirectUri;
    if (flowRedirectUri == null) {
      return yield* new OAuthRegisterDynamicError({
        message: REDIRECT_URI_REQUIRED_MESSAGE
      });
    }
    const authMethod = pickDcrAuthMethod(input.tokenEndpointAuthMethodsSupported);
    const information = yield* registerDynamicClient(
      {
        registrationEndpoint: input.registrationEndpoint,
        metadata: {
          client_name: input.clientName,
          redirect_uris: [flowRedirectUri],
          grant_types: ["authorization_code", "refresh_token"],
          response_types: ["code"],
          token_endpoint_auth_method: authMethod,
          scope: input.scopes.length > 0 ? input.scopes.join(" ") : void 0
        }
      },
      { httpClientLayer, endpointUrlPolicy: deps.endpointUrlPolicy }
    ).pipe(
      Effect8.mapError((cause) => {
        const rawMessage = cause.message;
        const message = cause.error === "invalid_redirect_uri" && !isLoopbackHttpUrl(flowRedirectUri) ? `Automatic OAuth setup failed: this server only approves loopback redirect URLs (http://localhost or http://127.0.0.1) for automatic registration, but Executor is using ${flowRedirectUri}. Register an OAuth app manually with that redirect URL approved by the server, or run Executor on http://localhost.` : `Dynamic Client Registration failed: ${rawMessage}`;
        return new OAuthRegisterDynamicError({ message });
      })
    );
    yield* createClient({
      owner: input.owner,
      slug,
      authorizationUrl: input.authorizationUrl,
      tokenUrl: input.tokenUrl,
      resource: input.resource ?? null,
      grant: "authorization_code",
      clientId: information.client_id,
      clientSecret: information.client_secret ?? "",
      origin: {
        kind: "dynamic_client_registration",
        integration: input.originIntegration ?? null
      },
      originIssuer: issuer
    });
    return slug;
  });
  const listClients = () => deps.fuma.use("oauth_client.findMany", (db) => looseDb(db).findMany("oauth_client", {})).pipe(
    Effect8.flatMap(
      (rows) => Effect8.forEach(rows, (row) => {
        const grant = parseGrant(row.grant);
        if (grant === null) {
          return Effect8.fail(
            new StorageError({
              message: `oauth_client ${String(row.slug)} has an unknown grant: ${String(row.grant)}`,
              cause: void 0
            })
          );
        }
        return Effect8.succeed({
          owner: String(row.owner),
          slug: OAuthClientSlug.make(String(row.slug)),
          grant,
          authorizationUrl: String(row.authorization_url),
          tokenUrl: String(row.token_url),
          resource: row.resource == null ? null : String(row.resource),
          clientId: String(row.client_id),
          origin: parseOAuthClientOrigin(row)
        });
      })
    )
  );
  const loadClient = (owner, slug) => deps.fuma.use(
    "oauth_client.findFirst",
    (db) => looseDb(db).findFirst("oauth_client", {
      where: (b) => b.and(b("owner", "=", owner), b("slug", "=", String(slug)))
    })
  ).pipe(
    Effect8.flatMap((row) => {
      if (!row) return Effect8.succeed(null);
      const grant = parseGrant(row.grant);
      if (grant === null) {
        return Effect8.fail(
          new StorageError({
            message: `oauth_client ${String(slug)} has an unknown grant: ${String(row.grant)}`,
            cause: void 0
          })
        );
      }
      return Effect8.gen(function* () {
        let clientSecret = "";
        if (row.client_secret_item_id != null) {
          const provider = deps.defaultWritableProvider();
          if (provider) {
            clientSecret = (yield* provider.get(ProviderItemId.make(String(row.client_secret_item_id)))) ?? "";
          }
        }
        return {
          slug: String(row.slug),
          authorizationUrl: String(row.authorization_url),
          tokenUrl: String(row.token_url),
          grant,
          clientId: String(row.client_id),
          clientSecret,
          resource: row.resource == null ? null : String(row.resource)
        };
      });
    })
  );
  const start = (input) => Effect8.gen(function* () {
    const keys = yield* Effect8.try({
      try: () => deps.ownedKeys(input.owner),
      catch: (cause) => new StorageError({
        message: "Cannot start OAuth flow for owner without a subject",
        cause
      })
    });
    if (input.owner === "org" && input.clientOwner === "user") {
      return yield* new OAuthStartError({
        message: "A Workspace connection must use a Workspace app."
      });
    }
    const client = yield* loadClient(input.clientOwner, input.client);
    if (!client) {
      return yield* new OAuthStartError({
        message: `OAuth client not found: ${input.client}`
      });
    }
    const scopePolicy = yield* deps.resolveOAuthScopePolicy(input.integration, input.template).pipe(
      Effect8.mapError(
        (cause) => new OAuthStartError({
          // oxlint-disable-next-line executor/no-unknown-error-message -- boundary: StorageFailure carries a typed `message` field
          message: `Failed to resolve OAuth scope policy: ${cause.message}`
        })
      )
    );
    const requestedScopes = scopePolicy.kind === "discover" ? yield* discoverScopesForResource(client.resource).pipe(
      Effect8.mapError(
        (cause) => new OAuthStartError({
          // oxlint-disable-next-line executor/no-unknown-error-message -- boundary: OAuthDiscoveryError carries a typed `message` field
          message: `Failed to discover OAuth scopes: ${cause.message}`
        })
      )
    ) : dedupeScopes(scopePolicy.scopes);
    if (client.grant === "client_credentials") {
      const token = yield* exchangeClientCredentials({
        tokenUrl: client.tokenUrl,
        clientId: client.clientId,
        clientSecret: client.clientSecret,
        scopes: requestedScopes,
        resource: client.resource ?? void 0,
        endpointUrlPolicy: deps.endpointUrlPolicy,
        fetch: fetch2
      }).pipe(
        Effect8.mapError(
          (cause) => new OAuthStartError({
            // oxlint-disable-next-line executor/no-unknown-error-message -- boundary: OAuth2Error carries a typed `message` field
            message: `OAuth client-credentials exchange failed: ${cause.message}`
          })
        )
      );
      const connection = yield* mintFromToken(
        input,
        client,
        token,
        requestedScopes,
        input.clientOwner,
        // client_credentials has no callback, so no regional rebind applies.
        null
      ).pipe(
        Effect8.mapError(
          (cause) => new OAuthStartError({
            // oxlint-disable-next-line executor/no-unknown-error-message -- boundary: StorageFailure carries a typed `message` field
            message: `Failed to mint OAuth connection: ${cause.message}`
          })
        )
      );
      return { status: "connected", connection };
    }
    const flowRedirectUri = input.redirectUri ?? redirectUri;
    if (flowRedirectUri == null) {
      return yield* new OAuthStartError({
        message: REDIRECT_URI_REQUIRED_MESSAGE
      });
    }
    const authorizationRequestedScopes = scopePolicy.kind === "discover" ? requestedScopes : yield* filterAuthorizationCodeScopes(client, requestedScopes);
    const verifier = createPkceCodeVerifier();
    const challenge = yield* Effect8.promise(() => createPkceCodeChallenge(verifier));
    const state = OAuthState.make(createOAuthState());
    const providerState = encodeOAuthCallbackState({
      state: String(state),
      orgSlug: deps.callbackStateOrgSlug
    });
    const now = /* @__PURE__ */ new Date();
    const expiresAt = Date.now() + OAUTH2_SESSION_TTL_MS;
    yield* deps.fuma.use(
      "oauth_session.create",
      (db) => looseDb(db).create("oauth_session", {
        tenant: keys.tenant,
        owner: keys.owner,
        subject: keys.subject,
        state: String(state),
        client_slug: String(input.client),
        integration: String(input.integration),
        name: String(input.name),
        template: String(input.template),
        redirect_url: flowRedirectUri,
        pkce_verifier: verifier,
        identity_label: input.identityLabel ?? null,
        // Persist the requested scope set (declared ∪ client, filtered to the
        // authorization-code flow) so `complete`'s recorded-scope fallback
        // reflects exactly what was requested when the AS omits `scope`,
        // without re-resolving the integration's declared scopes at completion.
        payload: {
          owner: input.owner,
          clientOwner: input.clientOwner,
          requestedScopes: authorizationRequestedScopes
        },
        expires_at: expiresAt,
        created_at: now
      })
    );
    const authorizationUrl = yield* Effect8.try({
      try: () => buildAuthorizationUrl({
        authorizationUrl: client.authorizationUrl,
        clientId: client.clientId,
        redirectUrl: flowRedirectUri,
        scopes: authorizationRequestedScopes,
        state: providerState,
        codeChallenge: challenge,
        resource: client.resource ?? void 0,
        // Provider quirks (Google: access_type=offline + prompt=consent) —
        // without these Google returns no refresh token and won't re-consent
        // to widen scopes on reconnect.
        extraParams: providerAuthorizeExtras(client.authorizationUrl),
        endpointUrlPolicy: deps.endpointUrlPolicy
      }),
      catch: (cause) => new OAuthStartError({
        // oxlint-disable-next-line executor/no-unknown-error-message -- boundary: surface the URL-construction failure
        message: `Failed to build authorization URL: ${String(cause)}`
      })
    });
    return { status: "redirect", authorizationUrl, state };
  });
  const complete = (input) => Effect8.gen(function* () {
    const sessionRow = yield* deps.fuma.use(
      "oauth_session.findFirst",
      (db) => looseDb(db).findFirst("oauth_session", {
        where: (b) => b("state", "=", String(input.state))
      })
    );
    if (!sessionRow) {
      return yield* new OAuthSessionNotFoundError({ state: input.state });
    }
    const session = {
      owner: String(sessionRow.owner),
      clientSlug: OAuthClientSlug.make(String(sessionRow.client_slug)),
      integration: IntegrationSlug.make(String(sessionRow.integration)),
      name: ConnectionName.make(String(sessionRow.name)),
      template: AuthTemplateSlug.make(String(sessionRow.template)),
      redirectUrl: String(sessionRow.redirect_url),
      pkceVerifier: sessionRow.pkce_verifier == null ? null : String(sessionRow.pkce_verifier),
      identityLabel: sessionRow.identity_label == null ? null : String(sessionRow.identity_label),
      expiresAt: Number(sessionRow.expires_at),
      // The scope set `start` requested (the integration's declared or
      // discovered scopes), persisted on the session payload. Drives the
      // recorded-scope fallback when the AS omits `scope`. Missing/legacy
      // payloads fall back to the client's scopes below.
      requestedScopes: requestedScopesFromPayload(sessionRow.payload),
      // The app's owner, recorded by `start` — reload the SAME app at
      // completion by explicit owner (no derivation). Defaults to the session
      // owner for same-owner connects.
      clientOwner: clientOwnerFromPayload(sessionRow.payload) ?? String(sessionRow.owner)
    };
    if (Number.isFinite(session.expiresAt) && session.expiresAt <= Date.now()) {
      yield* deleteSession(input.state);
      return yield* new OAuthSessionNotFoundError({ state: input.state });
    }
    const client = yield* loadClient(session.clientOwner, session.clientSlug);
    if (!client) {
      return yield* new OAuthCompleteError({
        message: `OAuth client not found: ${session.clientSlug}`,
        restartRequired: true
      });
    }
    if (session.pkceVerifier == null) {
      return yield* new OAuthCompleteError({
        message: `OAuth session ${input.state} is missing its PKCE code verifier; restart the flow.`,
        restartRequired: true
      });
    }
    const tokenUrl = rebindTokenEndpointHostToCallbackDomain(
      client.tokenUrl,
      input.callbackDomain
    );
    const token = yield* exchangeAuthorizationCode({
      tokenUrl,
      clientId: client.clientId,
      clientSecret: client.clientSecret,
      redirectUrl: session.redirectUrl,
      codeVerifier: session.pkceVerifier,
      code: input.code,
      resource: client.resource ?? void 0,
      endpointUrlPolicy: deps.endpointUrlPolicy,
      fetch: fetch2
    }).pipe(
      Effect8.mapError(
        (cause) => new OAuthCompleteError({
          // oxlint-disable-next-line executor/no-unknown-error-message -- boundary: OAuth2Error carries a typed `message` field
          message: `OAuth code exchange failed: ${cause.message}`,
          restartRequired: cause.error === "invalid_grant"
        })
      )
    );
    const connection = yield* mintFromToken(
      {
        owner: session.owner,
        name: session.name,
        integration: session.integration,
        template: session.template,
        identityLabel: session.identityLabel ?? token.idTokenIdentityLabel ?? null
      },
      client,
      token,
      // The scopes `start` requested (the integration's declared set), persisted
      // on the session. Empty only for a corrupt/legacy session with no payload.
      session.requestedScopes ?? [],
      session.clientOwner,
      // Persist the regional token endpoint ONLY when it differs from the
      // client's configured one, so refresh redeems against the same region.
      tokenUrl === client.tokenUrl ? null : tokenUrl
    ).pipe(
      Effect8.mapError(
        (cause) => new OAuthCompleteError({
          // oxlint-disable-next-line executor/no-unknown-error-message -- boundary: StorageFailure carries a typed `message` field
          message: `Failed to mint OAuth connection: ${cause.message}`,
          restartRequired: false
        })
      )
    );
    yield* deleteSession(input.state);
    return connection;
  });
  const mintFromToken = (target, client, token, requestedScopes, clientOwner, oauthTokenUrl) => Effect8.gen(function* () {
    const provider = deps.defaultWritableProvider();
    if (!provider || !provider.set) {
      return yield* new StorageError({
        message: "No default writable credential provider is registered to store the OAuth access token.",
        cause: void 0
      });
    }
    const itemId = accessItemId(target.owner, target.integration, target.name);
    yield* provider.set(ProviderItemId.make(itemId), token.access_token);
    let refreshItemId = null;
    if (token.refresh_token) {
      refreshItemId = refreshItemIdFor(itemId);
      yield* provider.set(ProviderItemId.make(refreshItemId), token.refresh_token);
    }
    const oauthScope = recordedOAuthScope(token, requestedScopes);
    return yield* deps.mintOAuthConnection({
      owner: target.owner,
      name: target.name,
      integration: target.integration,
      template: target.template,
      identityLabel: target.identityLabel ?? null,
      provider: String(provider.key),
      itemId,
      oauthClient: OAuthClientSlug.make(client.slug),
      oauthClientOwner: clientOwner,
      refreshItemId,
      expiresAt: expiresAtFrom(token),
      // Record the granted scope the AS echoed back. Some providers, including
      // Microsoft, issue a refresh token for `offline_access` but omit that
      // non-resource scope from the token `scope` string, so preserve it when
      // the refresh token proves it was granted.
      oauthScope,
      missingOAuthScopes: client.grant === "authorization_code" ? missingGrantedOAuthScopes(requestedScopes, oauthScope) : [],
      oauthTokenUrl
    });
  });
  const deleteSession = (state) => deps.fuma.use(
    "oauth_session.delete",
    (db) => looseDb(db).deleteMany("oauth_session", {
      where: (b) => b("state", "=", String(state))
    })
  ).pipe(Effect8.asVoid);
  const cancel = (state) => deleteSession(state);
  const probe = (input) => Effect8.gen(function* () {
    const options = { endpointUrlPolicy: deps.endpointUrlPolicy };
    const resource = yield* discoverProtectedResourceMetadata(input.url, options).pipe(
      Effect8.catch(() => Effect8.succeed(null))
    );
    const issuerCandidate = resource?.metadata.authorization_servers?.[0] ?? input.url;
    const as = yield* discoverAuthorizationServerMetadata(issuerCandidate, options).pipe(
      Effect8.mapError(
        (cause) => new OAuthProbeError({
          // oxlint-disable-next-line executor/no-unknown-error-message -- boundary: OAuthDiscoveryError carries a typed `message` field
          message: `OAuth discovery failed: ${cause.message}`
        })
      )
    );
    if (!as) {
      return yield* new OAuthProbeError({
        message: `No OAuth authorization-server metadata found at ${input.url}`
      });
    }
    return {
      issuer: as.metadata.issuer,
      authorizationUrl: as.metadata.authorization_endpoint,
      tokenUrl: as.metadata.token_endpoint,
      resource: resource?.metadata.resource ?? null,
      // Prefer the resource's own RFC 9728 scopes (authoritative, even when
      // empty); fall back to the authorization server's list only when PRM is
      // silent. For a spec-compliant MCP server (one that publishes PRM) this
      // matches what `oauth.start` discovers. The AS fallback is a best-effort
      // hint for the registration form on servers that omit PRM — where
      // `oauth.start` requests none — so the two can differ for those.
      scopesSupported: resource?.metadata.scopes_supported ?? as.metadata.scopes_supported,
      registrationEndpoint: as.metadata.registration_endpoint ?? null,
      tokenEndpointAuthMethodsSupported: as.metadata.token_endpoint_auth_methods_supported,
      clientIdMetadataDocumentSupported: as.metadata.client_id_metadata_document_supported === true
    };
  }).pipe(Effect8.provide(httpClientLayer));
  return {
    createClient,
    removeClient,
    registerDynamicClient: registerDynamicClient2,
    listClients,
    start,
    complete,
    cancel,
    probe
  };
};

// ../sdk/src/plugin-storage.ts
import "effect";
var pluginStorageId = (input) => JSON.stringify([input.pluginId, input.collection, input.key]);

// ../sdk/src/types.ts
import { Schema as Schema12 } from "effect";
var ToolSchemaView = Schema12.Struct({
  address: ToolAddress,
  name: Schema12.optional(Schema12.String),
  description: Schema12.optional(Schema12.String),
  inputSchema: Schema12.optional(Schema12.Unknown),
  outputSchema: Schema12.optional(Schema12.Unknown),
  schemaDefinitions: Schema12.optional(Schema12.Record(Schema12.String, Schema12.Unknown)),
  inputTypeScript: Schema12.optional(Schema12.String),
  outputTypeScript: Schema12.optional(Schema12.String),
  typeScriptDefinitions: Schema12.optional(Schema12.Record(Schema12.String, Schema12.String))
});
var IntegrationDetectionResult = Schema12.Struct({
  /** Plugin id that recognized the URL (e.g. "openapi", "graphql"). */
  kind: Schema12.String,
  /** Confidence tier — UI uses this to pick a winner when multiple plugins
   *  claim a URL. */
  confidence: Schema12.Literals(["high", "medium", "low"]),
  /** The (possibly normalized) endpoint the plugin will use. */
  endpoint: Schema12.String,
  /** Human-readable name suggestion, typically derived from spec title or URL. */
  name: Schema12.String,
  /** Slug suggestion — the plugin's recommendation for the integration slug. */
  slug: Schema12.String
});

// ../sdk/src/schema-refs.ts
var REF_PATTERN = /^#\/(?:\$defs|definitions)\/(.+)$/;
var parseRefName = (ref) => ref.match(REF_PATTERN)?.[1];
var normalizeRefs = (node) => {
  if (node == null || typeof node !== "object") return node;
  if (Array.isArray(node)) {
    let changed2 = false;
    const out = node.map((item) => {
      const n = normalizeRefs(item);
      if (n !== item) changed2 = true;
      return n;
    });
    return changed2 ? out : node;
  }
  const obj = node;
  if (typeof obj.$ref === "string") {
    const name = parseRefName(obj.$ref);
    if (name) {
      const canonical = `#/$defs/${name}`;
      return canonical !== obj.$ref ? { ...obj, $ref: canonical } : obj;
    }
    return obj;
  }
  let changed = false;
  const result = {};
  for (const [k, v] of Object.entries(obj)) {
    const n = normalizeRefs(v);
    if (n !== v) changed = true;
    result[k] = n;
  }
  return changed ? result : obj;
};
var hoistDefinitions = (schema2) => {
  if (schema2 == null || typeof schema2 !== "object") {
    return { stripped: schema2, defs: {} };
  }
  const obj = schema2;
  const defs = {};
  if (obj.$defs && typeof obj.$defs === "object") {
    for (const [k, v] of Object.entries(obj.$defs)) {
      defs[k] = v;
    }
  }
  if (obj.definitions && typeof obj.definitions === "object") {
    for (const [k, v] of Object.entries(obj.definitions)) {
      defs[k] = v;
    }
  }
  const { $defs: _a, definitions: _b, ...rest } = obj;
  return { stripped: rest, defs };
};
var collectRefs = (node, defs, found = /* @__PURE__ */ new Set()) => {
  if (node == null || typeof node !== "object") return found;
  const obj = node;
  if (typeof obj.$ref === "string") {
    const name = parseRefName(obj.$ref);
    if (name && !found.has(name)) {
      found.add(name);
      const def = defs.get(name);
      if (def) collectRefs(def, defs, found);
    }
    return found;
  }
  for (const v of Object.values(obj)) {
    if (v && typeof v === "object") {
      if (Array.isArray(v)) {
        for (const item of v) collectRefs(item, defs, found);
      } else {
        collectRefs(v, defs, found);
      }
    }
  }
  return found;
};
var collectReferencedDefinitions = (roots, defs) => {
  const refs = /* @__PURE__ */ new Set();
  for (const root of roots) {
    collectRefs(root, defs, refs);
  }
  const referenced = {};
  for (const name of refs) {
    const def = defs.get(name);
    if (def) referenced[name] = def;
  }
  return referenced;
};

// ../sdk/src/vendor/json-schema-to-typescript/compat.ts
import { Struct } from "effect";
var isPlainObject = (value) => {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};
var cloneDeep = (value) => structuredClone(value);
var merge = (target, ...sources) => {
  const output = target;
  for (const source of sources) {
    if (!source) continue;
    for (const [key, value] of Object.entries(source)) {
      const current = output[key];
      output[key] = isPlainObject(current) && isPlainObject(value) ? merge({ ...current }, value) : cloneDeep(value);
    }
  }
  return target;
};
var findKey = (object, predicate) => {
  if (!object) return void 0;
  for (const [key, value] of Object.entries(object)) {
    if (predicate(value, key)) return key;
  }
  return void 0;
};
var memoize = (fn) => {
  const cache = /* @__PURE__ */ new Map();
  return ((arg, ...rest) => {
    if (cache.has(arg)) return cache.get(arg);
    const value = fn(arg, ...rest);
    cache.set(arg, value);
    return value;
  });
};
var omit = (object, ...keys) => Struct.omit(object, keys);
var uniqBy = (items, iteratee) => {
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const item of items) {
    const key = iteratee(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
};
var deburr = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
var upperFirst = (value) => value.length === 0 ? value : value[0].toUpperCase() + value.slice(1);

// ../sdk/src/vendor/json-schema-to-typescript/formatter.ts
function format(code, options) {
  void options;
  return code;
}

// ../sdk/src/vendor/json-schema-to-typescript/types/AST.ts
function hasComment(ast) {
  return "comment" in ast && ast.comment != null && ast.comment !== "" || // Compare to true because ast.deprecated might be undefined
  "deprecated" in ast && ast.deprecated === true;
}
function hasStandaloneName(ast) {
  return "standaloneName" in ast && ast.standaloneName != null && ast.standaloneName !== "";
}
var T_ANY = {
  type: "ANY"
};
var T_ANY_ADDITIONAL_PROPERTIES = {
  keyName: "[k: string]",
  type: "ANY"
};
var T_UNKNOWN = {
  type: "UNKNOWN"
};
var T_UNKNOWN_ADDITIONAL_PROPERTIES = {
  keyName: "[k: string]",
  type: "UNKNOWN"
};

// ../sdk/src/vendor/json-schema-to-typescript/types/JSONSchema.ts
var Parent = /* @__PURE__ */ Symbol("Parent");
var Types = /* @__PURE__ */ Symbol("Types");
var Intersection = /* @__PURE__ */ Symbol("Intersection");
var getRootSchema = memoize((schema2) => {
  const parent = schema2[Parent];
  if (!parent) {
    return schema2;
  }
  return getRootSchema(parent);
});
function isBoolean(schema2) {
  return schema2 === true || schema2 === false;
}
function isPrimitive(schema2) {
  return !isPlainObject(schema2);
}
function isCompound(schema2) {
  return Array.isArray(schema2.type) || "anyOf" in schema2 || "oneOf" in schema2;
}

// ../sdk/src/vendor/json-schema-to-typescript/utils.ts
var BLACKLISTED_KEYS = /* @__PURE__ */ new Set([
  "id",
  "$defs",
  "$id",
  "$schema",
  "title",
  "description",
  "default",
  "multipleOf",
  "maximum",
  "exclusiveMaximum",
  "minimum",
  "exclusiveMinimum",
  "maxLength",
  "minLength",
  "pattern",
  "additionalItems",
  "items",
  "maxItems",
  "minItems",
  "uniqueItems",
  "maxProperties",
  "minProperties",
  "required",
  "additionalProperties",
  "definitions",
  "properties",
  "patternProperties",
  "dependencies",
  "enum",
  "type",
  "allOf",
  "anyOf",
  "oneOf",
  "not"
]);
function traverseObjectKeys(obj, callback, processed) {
  Object.keys(obj).forEach((k) => {
    if (obj[k] && typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      traverse(obj[k], callback, processed, k);
    }
  });
}
function traverseArray(arr, callback, processed) {
  arr.forEach((s, k) => traverse(s, callback, processed, k.toString()));
}
function traverseIntersection(schema2, callback, processed) {
  if (typeof schema2 !== "object" || !schema2) {
    return;
  }
  const r = schema2;
  const intersection = r[Intersection];
  if (!intersection) {
    return;
  }
  if (Array.isArray(intersection.allOf)) {
    traverseArray(intersection.allOf, callback, processed);
  }
}
function traverse(schema2, callback, processed = /* @__PURE__ */ new Set(), key) {
  if (processed.has(schema2)) {
    return;
  }
  processed.add(schema2);
  callback(schema2, key ?? null);
  if (schema2.anyOf) {
    traverseArray(schema2.anyOf, callback, processed);
  }
  if (schema2.allOf) {
    traverseArray(schema2.allOf, callback, processed);
  }
  if (schema2.oneOf) {
    traverseArray(schema2.oneOf, callback, processed);
  }
  if (schema2.properties) {
    traverseObjectKeys(schema2.properties, callback, processed);
  }
  if (schema2.patternProperties) {
    traverseObjectKeys(schema2.patternProperties, callback, processed);
  }
  if (schema2.additionalProperties && typeof schema2.additionalProperties === "object") {
    traverse(schema2.additionalProperties, callback, processed);
  }
  if (schema2.items) {
    const { items } = schema2;
    if (Array.isArray(items)) {
      traverseArray(items, callback, processed);
    } else {
      traverse(items, callback, processed);
    }
  }
  if (schema2.additionalItems && typeof schema2.additionalItems === "object") {
    traverse(schema2.additionalItems, callback, processed);
  }
  if (schema2.dependencies) {
    if (Array.isArray(schema2.dependencies)) {
      traverseArray(schema2.dependencies, callback, processed);
    } else {
      traverseObjectKeys(schema2.dependencies, callback, processed);
    }
  }
  if (schema2.definitions) {
    traverseObjectKeys(schema2.definitions, callback, processed);
  }
  if (schema2.$defs) {
    traverseObjectKeys(schema2.$defs, callback, processed);
  }
  if (schema2.not) {
    traverse(schema2.not, callback, processed);
  }
  traverseIntersection(schema2, callback, processed);
  Object.keys(schema2).filter((key2) => !BLACKLISTED_KEYS.has(key2)).forEach((key2) => {
    const child = schema2[key2];
    if (child && typeof child === "object") {
      traverseObjectKeys(child, callback, processed);
    }
  });
}
function justName(filename = "") {
  return stripExtension(filename.split(/[\\/]/).pop() ?? "");
}
function stripExtension(filename) {
  return filename.replace(/\.[^./\\]*$/, "");
}
function toSafeString(string) {
  return upperFirst(
    // remove accents, umlauts, ... by their basic latin letters
    deburr(string).replace(/(^\s*[^a-zA-Z_$])|([^a-zA-Z_$\d])/g, " ").replace(/^_[a-z]/g, (match) => match.toUpperCase()).replace(/_[a-z]/g, (match) => match.substr(1, match.length).toUpperCase()).replace(/([\d$]+[a-zA-Z])/g, (match) => match.toUpperCase()).replace(/\s+([a-zA-Z])/g, (match) => match.toUpperCase().trim()).replace(/\s/g, "")
  );
}
function generateName(from, usedNames) {
  let name = toSafeString(from);
  if (!name) {
    name = "NoName";
  }
  if (usedNames.has(name)) {
    let counter = 1;
    let nameWithCounter = `${name}${counter}`;
    while (usedNames.has(nameWithCounter)) {
      nameWithCounter = `${name}${counter}`;
      counter++;
    }
    name = nameWithCounter;
  }
  usedNames.add(name);
  return name;
}
function escapeBlockComment(schema2) {
  const replacer = "* /";
  if (schema2 === null || typeof schema2 !== "object") {
    return;
  }
  for (const key of Object.keys(schema2)) {
    if (key === "description" && typeof schema2[key] === "string") {
      schema2[key] = schema2[key].replace(/\*\//g, replacer);
    }
  }
}
function maybeStripDefault(schema2) {
  if (!("default" in schema2)) {
    return schema2;
  }
  switch (schema2.type) {
    case "array":
      if (Array.isArray(schema2.default)) {
        return schema2;
      }
      break;
    case "boolean":
      if (typeof schema2.default === "boolean") {
        return schema2;
      }
      break;
    case "integer":
    case "number":
      if (typeof schema2.default === "number") {
        return schema2;
      }
      break;
    case "string":
      if (typeof schema2.default === "string") {
        return schema2;
      }
      break;
    case "null":
      if (schema2.default === null) {
        return schema2;
      }
      break;
    case "object":
      if (isPlainObject(schema2.default)) {
        return schema2;
      }
      break;
  }
  delete schema2.default;
  return schema2;
}
function appendToDescription(existingDescription, ...values) {
  if (existingDescription) {
    return `${existingDescription}

${values.join("\n")}`;
  }
  return values.join("\n");
}
function isSchemaLike(schema2) {
  if (!isPlainObject(schema2)) {
    return false;
  }
  const parent = schema2[Parent];
  if (parent === null) {
    return true;
  }
  const JSON_SCHEMA_KEYWORDS = [
    "$defs",
    "allOf",
    "anyOf",
    "definitions",
    "dependencies",
    "enum",
    "not",
    "oneOf",
    "patternProperties",
    "properties",
    "required"
  ];
  if (JSON_SCHEMA_KEYWORDS.some((_) => parent[_] === schema2)) {
    return false;
  }
  return true;
}

// ../sdk/src/vendor/json-schema-to-typescript/generator.ts
function generate(ast, options = DEFAULT_OPTIONS2) {
  return [
    options.bannerComment,
    declareNamedTypes(ast, options, ast.standaloneName),
    declareNamedInterfaces(ast, options, ast.standaloneName),
    declareEnums(ast, options)
  ].filter(Boolean).join("\n\n") + "\n";
}
function declareEnums(ast, options, processed = /* @__PURE__ */ new Set()) {
  if (processed.has(ast)) {
    return "";
  }
  processed.add(ast);
  let type = "";
  switch (ast.type) {
    case "ENUM":
      return generateStandaloneEnum(ast, options) + "\n";
    case "ARRAY":
      return declareEnums(ast.params, options, processed);
    case "UNION":
    case "INTERSECTION":
      return ast.params.reduce((prev, ast2) => prev + declareEnums(ast2, options, processed), "");
    case "TUPLE":
      type = ast.params.reduce((prev, ast2) => prev + declareEnums(ast2, options, processed), "");
      if (ast.spreadParam) {
        type += declareEnums(ast.spreadParam, options, processed);
      }
      return type;
    case "INTERFACE":
      return getSuperTypesAndParams(ast).reduce(
        (prev, ast2) => prev + declareEnums(ast2, options, processed),
        ""
      );
    default:
      return "";
  }
}
function declareNamedInterfaces(ast, options, rootASTName, processed = /* @__PURE__ */ new Set()) {
  if (processed.has(ast)) {
    return "";
  }
  processed.add(ast);
  let type = "";
  switch (ast.type) {
    case "ARRAY":
      type = declareNamedInterfaces(ast.params, options, rootASTName, processed);
      break;
    case "INTERFACE":
      type = [
        hasStandaloneName(ast) && (ast.standaloneName === rootASTName || options.declareExternallyReferenced) && generateStandaloneInterface(ast, options),
        getSuperTypesAndParams(ast).map((ast2) => declareNamedInterfaces(ast2, options, rootASTName, processed)).filter(Boolean).join("\n")
      ].filter(Boolean).join("\n");
      break;
    case "INTERSECTION":
    case "TUPLE":
    case "UNION":
      type = ast.params.map((_) => declareNamedInterfaces(_, options, rootASTName, processed)).filter(Boolean).join("\n");
      if (ast.type === "TUPLE" && ast.spreadParam) {
        type += declareNamedInterfaces(ast.spreadParam, options, rootASTName, processed);
      }
      break;
    default:
      type = "";
  }
  return type;
}
function declareNamedTypes(ast, options, rootASTName, processed = /* @__PURE__ */ new Set()) {
  if (processed.has(ast)) {
    return "";
  }
  processed.add(ast);
  switch (ast.type) {
    case "ARRAY":
      return [
        declareNamedTypes(ast.params, options, rootASTName, processed),
        hasStandaloneName(ast) ? generateStandaloneType(ast, options) : void 0
      ].filter(Boolean).join("\n");
    case "ENUM":
      return "";
    case "INTERFACE":
      return getSuperTypesAndParams(ast).map(
        (ast2) => (ast2.standaloneName === rootASTName || options.declareExternallyReferenced) && declareNamedTypes(ast2, options, rootASTName, processed)
      ).filter(Boolean).join("\n");
    case "INTERSECTION":
    case "TUPLE":
    case "UNION":
      return [
        hasStandaloneName(ast) ? generateStandaloneType(ast, options) : void 0,
        ast.params.map((ast2) => declareNamedTypes(ast2, options, rootASTName, processed)).filter(Boolean).join("\n"),
        "spreadParam" in ast && ast.spreadParam ? declareNamedTypes(ast.spreadParam, options, rootASTName, processed) : void 0
      ].filter(Boolean).join("\n");
    default:
      if (hasStandaloneName(ast)) {
        return generateStandaloneType(ast, options);
      }
      return "";
  }
}
function generateTypeUnmemoized(ast, options) {
  const type = generateRawType(ast, options);
  if (options.strictIndexSignatures && ast.keyName === "[k: string]") {
    return `${type} | undefined`;
  }
  return type;
}
var generateType = memoize(generateTypeUnmemoized);
function generateRawType(ast, options) {
  if (hasStandaloneName(ast)) {
    return toSafeString(ast.standaloneName);
  }
  switch (ast.type) {
    case "ANY":
      return "any";
    case "ARRAY":
      return (() => {
        const type = generateType(ast.params, options);
        return type.endsWith('"') ? "(" + type + ")[]" : type + "[]";
      })();
    case "BOOLEAN":
      return "boolean";
    case "INTERFACE":
      return generateInterface(ast, options);
    case "INTERSECTION":
      return generateSetOperation(ast, options);
    case "LITERAL":
      return JSON.stringify(ast.params);
    case "NEVER":
      return "never";
    case "NUMBER":
      return "number";
    case "NULL":
      return "null";
    case "OBJECT":
      return "object";
    case "REFERENCE":
      return ast.params;
    case "STRING":
      return "string";
    case "TUPLE":
      return (() => {
        const minItems = ast.minItems;
        const maxItems = ast.maxItems || -1;
        let spreadParam = ast.spreadParam;
        const astParams = [...ast.params];
        if (minItems > 0 && minItems > astParams.length && ast.spreadParam === void 0) {
          if (maxItems < 0) {
            spreadParam = options.unknownAny ? T_UNKNOWN : T_ANY;
          }
        }
        if (maxItems > astParams.length && ast.spreadParam === void 0) {
          for (let i = astParams.length; i < maxItems; i += 1) {
            astParams.push(options.unknownAny ? T_UNKNOWN : T_ANY);
          }
        }
        function addSpreadParam(params) {
          if (spreadParam) {
            const spread = "...(" + generateType(spreadParam, options) + ")[]";
            params.push(spread);
          }
          return params;
        }
        function paramsToString(params) {
          return "[" + params.join(", ") + "]";
        }
        const paramsList = astParams.map((param) => generateType(param, options));
        if (paramsList.length > minItems) {
          const cumulativeParamsList = paramsList.slice(0, minItems);
          const typesToUnion = [];
          if (cumulativeParamsList.length > 0) {
            typesToUnion.push(paramsToString(cumulativeParamsList));
          } else {
            typesToUnion.push(paramsToString([]));
          }
          for (let i = minItems; i < paramsList.length; i += 1) {
            cumulativeParamsList.push(paramsList[i]);
            if (i === paramsList.length - 1) {
              addSpreadParam(cumulativeParamsList);
            }
            typesToUnion.push(paramsToString(cumulativeParamsList));
          }
          return typesToUnion.join("|");
        }
        return paramsToString(addSpreadParam(paramsList));
      })();
    case "UNION":
      return generateSetOperation(ast, options);
    case "UNKNOWN":
      return "unknown";
    case "CUSTOM_TYPE":
      return ast.params;
  }
}
function generateSetOperation(ast, options) {
  const members = ast.params.map((_) => generateType(_, options));
  const separator = ast.type === "UNION" ? "|" : "&";
  return members.length === 1 ? members[0] : "(" + members.join(" " + separator + " ") + ")";
}
function generateInterface(ast, options) {
  return `{
` + ast.params.filter((_) => !_.isPatternProperty && !_.isUnreachableDefinition).map(
    ({ isRequired, keyName, ast: ast2 }) => [isRequired, keyName, ast2, generateType(ast2, options)]
  ).map(
    ([isRequired, keyName, ast2, type]) => (hasComment(ast2) && !ast2.standaloneName ? generateComment(ast2.comment, ast2.deprecated) + "\n" : "") + escapeKeyName(keyName) + (isRequired ? "" : "?") + ": " + type
  ).join("\n") + "\n}";
}
function generateComment(comment, deprecated) {
  const commentLines = ["/**"];
  if (deprecated) {
    commentLines.push(" * @deprecated");
  }
  if (typeof comment !== "undefined") {
    commentLines.push(...comment.split("\n").map((_) => " * " + _));
  }
  commentLines.push(" */");
  return commentLines.join("\n");
}
function generateStandaloneEnum(ast, options) {
  const containsSpecialCharacters = (key) => /[^a-zA-Z0-9_]/.test(key);
  return (hasComment(ast) ? generateComment(ast.comment, ast.deprecated) + "\n" : "") + "export " + (options.enableConstEnums ? "const " : "") + `enum ${toSafeString(ast.standaloneName)} {
` + ast.params.map(
    ({ ast: ast2, keyName }) => (containsSpecialCharacters(keyName) ? `"${keyName}"` : keyName) + " = " + generateType(ast2, options)
  ).join(",\n") + "\n}";
}
function generateStandaloneInterface(ast, options) {
  return (hasComment(ast) ? generateComment(ast.comment, ast.deprecated) + "\n" : "") + `export interface ${toSafeString(ast.standaloneName)} ` + (ast.superTypes.length > 0 ? `extends ${ast.superTypes.map((superType) => toSafeString(superType.standaloneName)).join(", ")} ` : "") + generateInterface(ast, options);
}
function generateStandaloneType(ast, options) {
  return (hasComment(ast) ? generateComment(ast.comment) + "\n" : "") + `export type ${toSafeString(ast.standaloneName)} = ${generateType(
    omit(ast, "standaloneName"),
    options
  )}`;
}
function escapeKeyName(keyName) {
  if (keyName.length && /[A-Za-z_$]/.test(keyName.charAt(0)) && /^[\w$]+$/.test(keyName)) {
    return keyName;
  }
  if (keyName === "[k: string]") {
    return keyName;
  }
  return JSON.stringify(keyName);
}
function getSuperTypesAndParams(ast) {
  return ast.params.map((param) => param.ast).concat(ast.superTypes);
}

// ../sdk/src/vendor/json-schema-to-typescript/typesOfSchema.ts
function typesOfSchema(schema2) {
  if (schema2.tsType) {
    return /* @__PURE__ */ new Set(["CUSTOM_TYPE"]);
  }
  const matchedTypes = /* @__PURE__ */ new Set();
  for (const [schemaType, f] of Object.entries(matchers)) {
    if (f(schema2)) {
      matchedTypes.add(schemaType);
    }
  }
  if (!matchedTypes.size) {
    matchedTypes.add("UNNAMED_SCHEMA");
  }
  return matchedTypes;
}
var matchers = {
  ALL_OF(schema2) {
    return "allOf" in schema2;
  },
  ANY(schema2) {
    if (Object.keys(schema2).length === 0) {
      return true;
    }
    return schema2.type === "any";
  },
  ANY_OF(schema2) {
    return "anyOf" in schema2;
  },
  BOOLEAN(schema2) {
    if ("enum" in schema2) {
      return false;
    }
    if (schema2.type === "boolean") {
      return true;
    }
    if (!isCompound(schema2) && typeof schema2.default === "boolean") {
      return true;
    }
    return false;
  },
  CUSTOM_TYPE() {
    return false;
  },
  NAMED_ENUM(schema2) {
    return "enum" in schema2 && "tsEnumNames" in schema2;
  },
  NAMED_SCHEMA(schema2) {
    return "$id" in schema2 && ("patternProperties" in schema2 || "properties" in schema2);
  },
  NEVER(schema2) {
    return schema2 === false;
  },
  NULL(schema2) {
    return schema2.type === "null";
  },
  NUMBER(schema2) {
    if ("enum" in schema2) {
      return false;
    }
    if (schema2.type === "integer" || schema2.type === "number") {
      return true;
    }
    if (!isCompound(schema2) && typeof schema2.default === "number") {
      return true;
    }
    return false;
  },
  OBJECT(schema2) {
    return schema2.type === "object" && !isPlainObject(schema2.additionalProperties) && !schema2.allOf && !schema2.anyOf && !schema2.oneOf && !schema2.patternProperties && !schema2.properties && !schema2.required;
  },
  ONE_OF(schema2) {
    return "oneOf" in schema2;
  },
  REFERENCE(schema2) {
    return "$ref" in schema2;
  },
  STRING(schema2) {
    if ("enum" in schema2) {
      return false;
    }
    if (schema2.type === "string") {
      return true;
    }
    if (!isCompound(schema2) && typeof schema2.default === "string") {
      return true;
    }
    return false;
  },
  TYPED_ARRAY(schema2) {
    if (schema2.type && schema2.type !== "array") {
      return false;
    }
    return "items" in schema2;
  },
  UNION(schema2) {
    return Array.isArray(schema2.type);
  },
  UNNAMED_ENUM(schema2) {
    if ("tsEnumNames" in schema2) {
      return false;
    }
    if (schema2.type && schema2.type !== "boolean" && schema2.type !== "integer" && schema2.type !== "number" && schema2.type !== "string") {
      return false;
    }
    return "enum" in schema2;
  },
  UNNAMED_SCHEMA() {
    return false;
  },
  UNTYPED_ARRAY(schema2) {
    return schema2.type === "array" && !("items" in schema2);
  }
};

// ../sdk/src/vendor/json-schema-to-typescript/applySchemaTyping.ts
function applySchemaTyping(schema2) {
  const types = typesOfSchema(schema2);
  Object.defineProperty(schema2, Types, {
    enumerable: false,
    value: types,
    writable: false
  });
  if (types.size === 1) {
    return;
  }
  const intersection = {
    [Parent]: schema2,
    [Types]: /* @__PURE__ */ new Set(["ALL_OF"]),
    $id: schema2.$id,
    description: schema2.description,
    name: schema2.name,
    title: schema2.title,
    allOf: schema2.allOf ?? [],
    required: [],
    additionalProperties: false
  };
  types.delete("ALL_OF");
  delete schema2.allOf;
  delete schema2.$id;
  delete schema2.description;
  delete schema2.name;
  delete schema2.title;
  Object.defineProperty(schema2, Intersection, {
    enumerable: false,
    value: intersection,
    writable: false
  });
}

// ../sdk/src/vendor/json-schema-to-typescript/normalizer.ts
var isJsonEqual = (left, right) => {
  if (left === right) return true;
  if (typeof left !== typeof right) return false;
  if (left === null || right === null) return false;
  if (typeof left !== "object" || typeof right !== "object") return false;
  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
      return false;
    }
    return left.every((value, index) => isJsonEqual(value, right[index]));
  }
  const leftRecord = left;
  const rightRecord = right;
  const leftKeys = Object.keys(leftRecord);
  const rightKeys = Object.keys(rightRecord);
  if (leftKeys.length !== rightKeys.length) return false;
  return leftKeys.every(
    (key) => Object.hasOwn(rightRecord, key) && isJsonEqual(leftRecord[key], rightRecord[key])
  );
};
var rules2 = /* @__PURE__ */ new Map();
function hasType(schema2, type) {
  return schema2.type === type || Array.isArray(schema2.type) && schema2.type.includes(type);
}
function isObjectType(schema2) {
  return schema2.properties !== void 0 || hasType(schema2, "object") || hasType(schema2, "any");
}
function isArrayType(schema2) {
  return schema2.items !== void 0 || hasType(schema2, "array") || hasType(schema2, "any");
}
function isEnumTypeWithoutTsEnumNames(schema2) {
  return schema2.type === "string" && schema2.enum !== void 0 && schema2.tsEnumNames === void 0;
}
rules2.set('Remove `type=["null"]` if `enum=[null]`', (schema2) => {
  if (Array.isArray(schema2.enum) && schema2.enum.some((e) => e === null) && Array.isArray(schema2.type) && schema2.type.includes("null")) {
    schema2.type = schema2.type.filter((type) => type !== "null");
  }
});
rules2.set("Destructure unary types", (schema2) => {
  if (schema2.type && Array.isArray(schema2.type) && schema2.type.length === 1) {
    schema2.type = schema2.type[0];
  }
});
rules2.set("Add empty `required` property if none is defined", (schema2) => {
  if (isObjectType(schema2) && !("required" in schema2)) {
    schema2.required = [];
  }
});
rules2.set("Transform `required`=false to `required`=[]", (schema2) => {
  if (schema2.required === false) {
    schema2.required = [];
  }
});
rules2.set("Default additionalProperties", (schema2, _, options) => {
  if (isObjectType(schema2) && !("additionalProperties" in schema2) && schema2.patternProperties === void 0) {
    schema2.additionalProperties = options.additionalProperties;
  }
});
rules2.set("Transform id to $id", (schema2, fileName) => {
  if (!isSchemaLike(schema2)) {
    return;
  }
  if (schema2.id && schema2.$id && schema2.id !== schema2.$id) {
    throw ReferenceError(
      `Schema must define either id or $id, not both. Given id=${schema2.id}, $id=${schema2.$id} in ${fileName}`
    );
  }
  if (schema2.id) {
    schema2.$id = schema2.id;
    delete schema2.id;
  }
});
rules2.set(
  "Add an $id to anything that needs it",
  (schema2, fileName, _options, _key, dereferencedPaths) => {
    if (!isSchemaLike(schema2)) {
      return;
    }
    if (!schema2.$id && !schema2[Parent]) {
      schema2.$id = toSafeString(justName(fileName));
      return;
    }
    if (!isArrayType(schema2) && !isObjectType(schema2)) {
      return;
    }
    const dereferencedName = dereferencedPaths.get(schema2);
    if (!schema2.$id && !schema2.title && dereferencedName) {
      schema2.$id = toSafeString(justName(dereferencedName));
    }
    if (dereferencedName) {
      dereferencedPaths.delete(schema2);
    }
  }
);
rules2.set("Escape closing JSDoc comment", (schema2) => {
  escapeBlockComment(schema2);
});
rules2.set("Add JSDoc comments for minItems and maxItems", (schema2) => {
  if (!isArrayType(schema2)) {
    return;
  }
  const commentsToAppend = [
    "minItems" in schema2 ? `@minItems ${schema2.minItems}` : "",
    "maxItems" in schema2 ? `@maxItems ${schema2.maxItems}` : ""
  ].filter(Boolean);
  if (commentsToAppend.length) {
    schema2.description = appendToDescription(schema2.description, ...commentsToAppend);
  }
});
rules2.set("Optionally remove maxItems and minItems", (schema2, _fileName, options) => {
  if (!isArrayType(schema2)) {
    return;
  }
  if ("minItems" in schema2 && options.ignoreMinAndMaxItems) {
    delete schema2.minItems;
  }
  if ("maxItems" in schema2 && (options.ignoreMinAndMaxItems || options.maxItems === -1)) {
    delete schema2.maxItems;
  }
});
rules2.set("Normalize schema.minItems", (schema2, _fileName, options) => {
  if (options.ignoreMinAndMaxItems) {
    return;
  }
  if (!isArrayType(schema2)) {
    return;
  }
  const { minItems } = schema2;
  schema2.minItems = typeof minItems === "number" ? minItems : 0;
});
rules2.set(
  "Remove maxItems if it is big enough to likely cause OOMs",
  (schema2, _fileName, options) => {
    if (options.ignoreMinAndMaxItems || options.maxItems === -1) {
      return;
    }
    if (!isArrayType(schema2)) {
      return;
    }
    const { maxItems, minItems } = schema2;
    if (maxItems !== void 0 && maxItems - minItems > options.maxItems) {
      delete schema2.maxItems;
    }
  }
);
rules2.set("Normalize schema.items", (schema2, _fileName, options) => {
  if (options.ignoreMinAndMaxItems) {
    return;
  }
  const { maxItems, minItems } = schema2;
  const hasMaxItems = typeof maxItems === "number" && maxItems >= 0;
  const hasMinItems = typeof minItems === "number" && minItems > 0;
  if (schema2.items && !Array.isArray(schema2.items) && (hasMaxItems || hasMinItems)) {
    const items = schema2.items;
    const newItems = Array(maxItems || minItems || 0).fill(items);
    if (!hasMaxItems) {
      schema2.additionalItems = items;
    }
    schema2.items = newItems;
  }
  if (Array.isArray(schema2.items) && hasMaxItems && maxItems < schema2.items.length) {
    schema2.items = schema2.items.slice(0, maxItems);
  }
  return schema2;
});
rules2.set("Remove extends, if it is empty", (schema2) => {
  if (!schema2.hasOwnProperty("extends")) {
    return;
  }
  if (schema2.extends == null || Array.isArray(schema2.extends) && schema2.extends.length === 0) {
    delete schema2.extends;
  }
});
rules2.set("Make extends always an array, if it is defined", (schema2) => {
  if (schema2.extends == null) {
    return;
  }
  if (!Array.isArray(schema2.extends)) {
    schema2.extends = [schema2.extends];
  }
});
rules2.set("Transform definitions to $defs", (schema2, fileName) => {
  if (schema2.definitions && schema2.$defs && !isJsonEqual(schema2.definitions, schema2.$defs)) {
    throw ReferenceError(
      `Schema must define either definitions or $defs, not both. Given id=${schema2.id} in ${fileName}`
    );
  }
  if (schema2.definitions) {
    schema2.$defs = schema2.definitions;
    delete schema2.definitions;
  }
});
rules2.set("Transform const to singleton enum", (schema2) => {
  if (schema2.const !== void 0) {
    schema2.enum = [schema2.const];
    delete schema2.const;
  }
});
rules2.set("Add tsEnumNames to enum types", (schema2, _, options) => {
  if (isEnumTypeWithoutTsEnumNames(schema2) && options.inferStringEnumKeysFromValues) {
    schema2.tsEnumNames = schema2.enum?.map(String);
  }
});
rules2.set("Pre-calculate schema types and intersections", (schema2) => {
  if (schema2 !== null && typeof schema2 === "object") {
    applySchemaTyping(schema2);
  }
});
function normalize(rootSchema, dereferencedPaths, filename, options) {
  rules2.forEach(
    (rule) => traverse(rootSchema, (schema2, key) => rule(schema2, filename, options, key, dereferencedPaths))
  );
  return rootSchema;
}

// ../sdk/src/vendor/json-schema-to-typescript/optimizer.ts
function optimize(ast, options, processed = /* @__PURE__ */ new Set()) {
  if (processed.has(ast)) {
    return ast;
  }
  processed.add(ast);
  switch (ast.type) {
    case "ARRAY":
      return Object.assign(ast, {
        params: optimize(ast.params, options, processed)
      });
    case "INTERFACE":
      return Object.assign(ast, {
        params: ast.params.map(
          (_) => Object.assign(_, { ast: optimize(_.ast, options, processed) })
        )
      });
    case "INTERSECTION":
    case "UNION":
      const optimizedAST = Object.assign(ast, {
        params: ast.params.map((_) => optimize(_, options, processed))
      });
      if (optimizedAST.params.some((_) => _.type === "ANY")) {
        return T_ANY;
      }
      if (optimizedAST.params.some((_) => _.type === "UNKNOWN")) {
        return T_UNKNOWN;
      }
      if (optimizedAST.params.every((_) => {
        const a = generateType(omitStandaloneName(_), options);
        const b = generateType(omitStandaloneName(optimizedAST.params[0]), options);
        return a === b;
      }) && optimizedAST.params.some((_) => _.standaloneName !== void 0)) {
        optimizedAST.params = optimizedAST.params.filter((_) => _.standaloneName !== void 0);
      }
      const params = uniqBy(optimizedAST.params, (_) => generateType(_, options));
      if (params.length !== optimizedAST.params.length) {
        optimizedAST.params = params;
      }
      return Object.assign(optimizedAST, {
        params: optimizedAST.params.map((_) => optimize(_, options, processed))
      });
    default:
      return ast;
  }
}
function omitStandaloneName(ast) {
  switch (ast.type) {
    case "ENUM":
      return ast;
    default:
      return { ...ast, standaloneName: void 0 };
  }
}

// ../sdk/src/vendor/json-schema-to-typescript/parser.ts
function parse(schema2, options, keyName, processed = /* @__PURE__ */ new Map(), usedNames = /* @__PURE__ */ new Set()) {
  if (isPrimitive(schema2)) {
    if (isBoolean(schema2)) {
      return parseBooleanSchema(schema2, keyName, options);
    }
    return parseLiteral(schema2, keyName);
  }
  const normalizedSchema = schema2;
  const intersection = normalizedSchema[Intersection];
  const types = normalizedSchema[Types];
  if (intersection) {
    const ast = parseAsTypeWithCache(
      intersection,
      "ALL_OF",
      options,
      keyName,
      processed,
      usedNames
    );
    types.forEach((type) => {
      ast.params.push(
        parseAsTypeWithCache(normalizedSchema, type, options, keyName, processed, usedNames)
      );
    });
    return ast;
  }
  if (types.size === 1) {
    const type = [...types][0];
    const ast = parseAsTypeWithCache(
      normalizedSchema,
      type,
      options,
      keyName,
      processed,
      usedNames
    );
    return ast;
  }
  throw new ReferenceError("Expected intersection schema. Please file an issue on GitHub.");
}
function parseAsTypeWithCache(schema2, type, options, keyName, processed = /* @__PURE__ */ new Map(), usedNames = /* @__PURE__ */ new Set()) {
  let cachedTypeMap = processed.get(schema2);
  if (!cachedTypeMap) {
    cachedTypeMap = /* @__PURE__ */ new Map();
    processed.set(schema2, cachedTypeMap);
  }
  const cachedAST = cachedTypeMap.get(type);
  if (cachedAST) {
    return cachedAST;
  }
  const ast = {};
  cachedTypeMap.set(type, ast);
  return Object.assign(ast, parseNonLiteral(schema2, type, options, keyName, processed, usedNames));
}
function parseBooleanSchema(schema2, keyName, options) {
  if (schema2) {
    return {
      keyName,
      type: options.unknownAny ? "UNKNOWN" : "ANY"
    };
  }
  return {
    keyName,
    type: "NEVER"
  };
}
function parseLiteral(schema2, keyName) {
  return {
    keyName,
    params: schema2,
    type: "LITERAL"
  };
}
function parseNonLiteral(schema2, type, options, keyName, processed, usedNames) {
  const definitions = getDefinitionsMemoized(getRootSchema(schema2));
  const keyNameFromDefinition = findKey(definitions, (_) => _ === schema2);
  switch (type) {
    case "ALL_OF":
      return {
        comment: schema2.description,
        deprecated: schema2.deprecated,
        keyName,
        standaloneName: standaloneName(schema2, keyNameFromDefinition, usedNames, options),
        params: schema2.allOf.map((_) => parse(_, options, void 0, processed, usedNames)),
        type: "INTERSECTION"
      };
    case "ANY":
      return {
        ...options.unknownAny ? T_UNKNOWN : T_ANY,
        comment: schema2.description,
        deprecated: schema2.deprecated,
        keyName,
        standaloneName: standaloneName(schema2, keyNameFromDefinition, usedNames, options)
      };
    case "ANY_OF":
      return {
        comment: schema2.description,
        deprecated: schema2.deprecated,
        keyName,
        standaloneName: standaloneName(schema2, keyNameFromDefinition, usedNames, options),
        params: schema2.anyOf.map((_) => parse(_, options, void 0, processed, usedNames)),
        type: "UNION"
      };
    case "BOOLEAN":
      return {
        comment: schema2.description,
        deprecated: schema2.deprecated,
        keyName,
        standaloneName: standaloneName(schema2, keyNameFromDefinition, usedNames, options),
        type: "BOOLEAN"
      };
    case "CUSTOM_TYPE":
      return {
        comment: schema2.description,
        deprecated: schema2.deprecated,
        keyName,
        params: schema2.tsType,
        standaloneName: standaloneName(schema2, keyNameFromDefinition, usedNames, options),
        type: "CUSTOM_TYPE"
      };
    case "NAMED_ENUM":
      return {
        comment: schema2.description,
        deprecated: schema2.deprecated,
        keyName,
        standaloneName: standaloneName(
          schema2,
          keyNameFromDefinition ?? keyName,
          usedNames,
          options
        ),
        params: schema2.enum.map((_, n) => ({
          ast: parseLiteral(_, void 0),
          keyName: schema2.tsEnumNames[n]
        })),
        type: "ENUM"
      };
    case "NAMED_SCHEMA":
      return newInterface(schema2, options, processed, usedNames, keyName);
    case "NEVER":
      return {
        comment: schema2.description,
        deprecated: schema2.deprecated,
        keyName,
        standaloneName: standaloneName(schema2, keyNameFromDefinition, usedNames, options),
        type: "NEVER"
      };
    case "NULL":
      return {
        comment: schema2.description,
        deprecated: schema2.deprecated,
        keyName,
        standaloneName: standaloneName(schema2, keyNameFromDefinition, usedNames, options),
        type: "NULL"
      };
    case "NUMBER":
      return {
        comment: schema2.description,
        deprecated: schema2.deprecated,
        keyName,
        standaloneName: standaloneName(schema2, keyNameFromDefinition, usedNames, options),
        type: "NUMBER"
      };
    case "OBJECT":
      return {
        comment: schema2.description,
        keyName,
        standaloneName: standaloneName(schema2, keyNameFromDefinition, usedNames, options),
        type: "OBJECT",
        deprecated: schema2.deprecated
      };
    case "ONE_OF":
      return {
        comment: schema2.description,
        deprecated: schema2.deprecated,
        keyName,
        standaloneName: standaloneName(schema2, keyNameFromDefinition, usedNames, options),
        params: schema2.oneOf.map((_) => parse(_, options, void 0, processed, usedNames)),
        type: "UNION"
      };
    case "REFERENCE":
      throw Error("Refs should have been resolved by the resolver.");
    case "STRING":
      return {
        comment: schema2.description,
        deprecated: schema2.deprecated,
        keyName,
        standaloneName: standaloneName(schema2, keyNameFromDefinition, usedNames, options),
        type: "STRING"
      };
    case "TYPED_ARRAY":
      if (Array.isArray(schema2.items)) {
        const minItems2 = schema2.minItems;
        const maxItems2 = schema2.maxItems;
        const arrayType = {
          comment: schema2.description,
          deprecated: schema2.deprecated,
          keyName,
          maxItems: maxItems2,
          minItems: minItems2,
          standaloneName: standaloneName(schema2, keyNameFromDefinition, usedNames, options),
          params: schema2.items.map((_) => parse(_, options, void 0, processed, usedNames)),
          type: "TUPLE"
        };
        if (schema2.additionalItems === true) {
          arrayType.spreadParam = options.unknownAny ? T_UNKNOWN : T_ANY;
        } else if (schema2.additionalItems) {
          arrayType.spreadParam = parse(
            schema2.additionalItems,
            options,
            void 0,
            processed,
            usedNames
          );
        }
        return arrayType;
      } else {
        return {
          comment: schema2.description,
          deprecated: schema2.deprecated,
          keyName,
          standaloneName: standaloneName(schema2, keyNameFromDefinition, usedNames, options),
          params: parse(
            schema2.items,
            options,
            `{keyNameFromDefinition}Items`,
            processed,
            usedNames
          ),
          type: "ARRAY"
        };
      }
    case "UNION":
      return {
        comment: schema2.description,
        deprecated: schema2.deprecated,
        keyName,
        standaloneName: standaloneName(schema2, keyNameFromDefinition, usedNames, options),
        params: schema2.type.map((type2) => {
          const member = { ...omit(schema2, "$id", "description", "title"), type: type2 };
          maybeStripDefault(member);
          applySchemaTyping(member);
          return parse(member, options, void 0, processed, usedNames);
        }),
        type: "UNION"
      };
    case "UNNAMED_ENUM":
      return {
        comment: schema2.description,
        deprecated: schema2.deprecated,
        keyName,
        standaloneName: standaloneName(schema2, keyNameFromDefinition, usedNames, options),
        params: schema2.enum.map((_) => parseLiteral(_, void 0)),
        type: "UNION"
      };
    case "UNNAMED_SCHEMA":
      return newInterface(
        schema2,
        options,
        processed,
        usedNames,
        keyName,
        keyNameFromDefinition
      );
    case "UNTYPED_ARRAY":
      const minItems = schema2.minItems;
      const maxItems = typeof schema2.maxItems === "number" ? schema2.maxItems : -1;
      const params = options.unknownAny ? T_UNKNOWN : T_ANY;
      if (minItems > 0 || maxItems >= 0) {
        return {
          comment: schema2.description,
          deprecated: schema2.deprecated,
          keyName,
          maxItems: schema2.maxItems,
          minItems,
          // create a tuple of length N
          params: Array(Math.max(maxItems, minItems) || 0).fill(params),
          // if there is no maximum, then add a spread item to collect the rest
          spreadParam: maxItems >= 0 ? void 0 : params,
          standaloneName: standaloneName(schema2, keyNameFromDefinition, usedNames, options),
          type: "TUPLE"
        };
      }
      return {
        comment: schema2.description,
        deprecated: schema2.deprecated,
        keyName,
        params,
        standaloneName: standaloneName(schema2, keyNameFromDefinition, usedNames, options),
        type: "ARRAY"
      };
  }
}
function standaloneName(schema2, keyNameFromDefinition, usedNames, options) {
  const name = options.customName?.(schema2, keyNameFromDefinition) || schema2.title || schema2.$id || keyNameFromDefinition;
  if (name) {
    return generateName(name, usedNames);
  }
}
function newInterface(schema2, options, processed, usedNames, keyName, keyNameFromDefinition) {
  const name = standaloneName(schema2, keyNameFromDefinition, usedNames, options);
  return {
    comment: schema2.description,
    deprecated: schema2.deprecated,
    keyName,
    params: parseSchema(schema2, options, processed, usedNames, name),
    standaloneName: name,
    superTypes: parseSuperTypes(schema2, options, processed, usedNames),
    type: "INTERFACE"
  };
}
function parseSuperTypes(schema2, options, processed, usedNames) {
  const superTypes = schema2.extends;
  if (!superTypes) {
    return [];
  }
  return superTypes.map(
    (_) => parse(_, options, void 0, processed, usedNames)
  );
}
function parseSchema(schema2, options, processed, usedNames, parentSchemaName) {
  const required = new Set(schema2.required ?? []);
  let asts = Object.entries(schema2.properties ?? {}).map(([key, value]) => ({
    ast: parse(value, options, key, processed, usedNames),
    isPatternProperty: false,
    isRequired: required.has(key),
    isUnreachableDefinition: false,
    keyName: key
  }));
  let singlePatternProperty = false;
  if (schema2.patternProperties) {
    singlePatternProperty = !schema2.additionalProperties && Object.keys(schema2.patternProperties).length === 1;
    asts = asts.concat(
      Object.entries(schema2.patternProperties).map(([key, value]) => {
        const ast = parse(value, options, key, processed, usedNames);
        const comment = `This interface was referenced by \`${parentSchemaName}\`'s JSON-Schema definition
via the \`patternProperty\` "${key.replace("*/", "*\\/")}".`;
        ast.comment = ast.comment ? `${ast.comment}

${comment}` : comment;
        return {
          ast,
          isPatternProperty: !singlePatternProperty,
          isRequired: singlePatternProperty || required.has(key),
          isUnreachableDefinition: false,
          keyName: singlePatternProperty ? "[k: string]" : key
        };
      })
    );
  }
  if (options.unreachableDefinitions) {
    asts = asts.concat(
      Object.entries(schema2.$defs ?? {}).map(([key, value]) => {
        const ast = parse(value, options, key, processed, usedNames);
        const comment = `This interface was referenced by \`${parentSchemaName}\`'s JSON-Schema
via the \`definition\` "${key}".`;
        ast.comment = ast.comment ? `${ast.comment}

${comment}` : comment;
        return {
          ast,
          isPatternProperty: false,
          isRequired: required.has(key),
          isUnreachableDefinition: true,
          keyName: key
        };
      })
    );
  }
  switch (schema2.additionalProperties) {
    case void 0:
    case true:
      if (singlePatternProperty) {
        return asts;
      }
      return asts.concat({
        ast: options.unknownAny ? T_UNKNOWN_ADDITIONAL_PROPERTIES : T_ANY_ADDITIONAL_PROPERTIES,
        isPatternProperty: false,
        isRequired: true,
        isUnreachableDefinition: false,
        keyName: "[k: string]"
      });
    case false:
      return asts;
    // pass "true" as the last param because in TS, properties
    // defined via index signatures are already optional
    default:
      return asts.concat({
        ast: parse(schema2.additionalProperties, options, "[k: string]", processed, usedNames),
        isPatternProperty: false,
        isRequired: true,
        isUnreachableDefinition: false,
        keyName: "[k: string]"
      });
  }
}
function getDefinitions(schema2, isSchema = true, processed = /* @__PURE__ */ new Set()) {
  if (processed.has(schema2)) {
    return {};
  }
  processed.add(schema2);
  if (Array.isArray(schema2)) {
    return schema2.reduce(
      (prev, cur) => ({
        ...prev,
        ...getDefinitions(cur, false, processed)
      }),
      {}
    );
  }
  if (isPlainObject(schema2)) {
    return {
      ...isSchema && hasDefinitions(schema2) ? schema2.$defs : {},
      ...Object.keys(schema2).reduce(
        (prev, cur) => ({
          ...prev,
          ...getDefinitions(schema2[cur], false, processed)
        }),
        {}
      )
    };
  }
  return {};
}
var getDefinitionsMemoized = memoize(getDefinitions);
function hasDefinitions(schema2) {
  return "$defs" in schema2;
}

// ../sdk/src/vendor/json-schema-to-typescript/resolver.ts
var isObject = (value) => value !== null && typeof value === "object";
var decodePointerSegment = (segment) => {
  try {
    return decodeURIComponent(segment).replace(/~1/g, "/").replace(/~0/g, "~");
  } catch {
    throw new ReferenceError(`Invalid JSON Pointer segment "${segment}" in $ref`);
  }
};
var encodePointerSegment = (segment) => segment.replace(/~/g, "~0").replace(/\//g, "~1");
var childPointer = (parent, key) => parent === "#" ? `#/${encodePointerSegment(key)}` : `${parent}/${encodePointerSegment(key)}`;
var normalizeLocalRef = (ref) => {
  if (ref === "#") return ref;
  if (!ref.startsWith("#/")) {
    throw new ReferenceError(
      `Unsupported $ref "${ref}". Only same-document JSON Pointer refs are supported.`
    );
  }
  return `#/${ref.slice(2).split("/").map(decodePointerSegment).map(encodePointerSegment).join("/")}`;
};
var resolvePointer = (root, ref) => {
  const pointer = normalizeLocalRef(ref);
  if (pointer === "#") return root;
  let current = root;
  for (const rawSegment of pointer.slice(2).split("/")) {
    const segment = decodePointerSegment(rawSegment);
    if (!isObject(current) || !(segment in current)) {
      throw new ReferenceError(`Unable to resolve $ref "${ref}"`);
    }
    current = current[segment];
  }
  return current;
};
var dereferenceNode = (root, node, pointer, dereferencedPaths, refCache, seenCache) => {
  if (!isObject(node)) return node;
  if (typeof node.$ref === "string") {
    const ref = normalizeLocalRef(node.$ref);
    const cached = refCache.get(ref);
    if (cached) {
      if (isObject(cached)) {
        dereferencedPaths.set(cached, ref);
      }
      return cached;
    }
    const target = resolvePointer(root, ref);
    if (!isObject(target)) return target;
    const targetClone = Array.isArray(target) ? [] : {};
    refCache.set(ref, targetClone);
    seenCache.set(target, targetClone);
    dereferencedPaths.set(targetClone, ref);
    const targetPointer = ref;
    for (const [key, value] of Object.entries(target)) {
      targetClone[key] = dereferenceNode(
        root,
        value,
        childPointer(targetPointer, key),
        dereferencedPaths,
        refCache,
        seenCache
      );
    }
    return targetClone;
  }
  const seen = seenCache.get(node);
  if (seen) return seen;
  const clone2 = Array.isArray(node) ? [] : {};
  seenCache.set(node, clone2);
  refCache.set(pointer, clone2);
  if (Array.isArray(node)) {
    node.forEach((value, index) => {
      clone2[index] = dereferenceNode(
        root,
        value,
        childPointer(pointer, String(index)),
        dereferencedPaths,
        refCache,
        seenCache
      );
    });
    return clone2;
  }
  for (const [key, value] of Object.entries(node)) {
    clone2[key] = dereferenceNode(
      root,
      value,
      childPointer(pointer, key),
      dereferencedPaths,
      refCache,
      seenCache
    );
  }
  return clone2;
};
function dereference(schema2) {
  const dereferencedPaths = /* @__PURE__ */ new WeakMap();
  const dereferencedSchema = dereferenceNode(
    schema2,
    schema2,
    "#",
    dereferencedPaths,
    /* @__PURE__ */ new Map(),
    /* @__PURE__ */ new WeakMap()
  );
  return { dereferencedPaths, dereferencedSchema };
}

// ../sdk/src/vendor/json-schema-to-typescript/validator.ts
var rules3 = /* @__PURE__ */ new Map();
rules3.set("Enum members and tsEnumNames must be of the same length", (schema2) => {
  if (schema2.enum && schema2.tsEnumNames && schema2.enum.length !== schema2.tsEnumNames.length) {
    return false;
  }
});
rules3.set("tsEnumNames must be an array of strings", (schema2) => {
  if (schema2.tsEnumNames && schema2.tsEnumNames.some((_) => typeof _ !== "string")) {
    return false;
  }
});
rules3.set("When both maxItems and minItems are present, maxItems >= minItems", (schema2) => {
  const { maxItems, minItems } = schema2;
  if (typeof maxItems === "number" && typeof minItems === "number") {
    return maxItems >= minItems;
  }
});
rules3.set("When maxItems exists, maxItems >= 0", (schema2) => {
  const { maxItems } = schema2;
  if (typeof maxItems === "number") {
    return maxItems >= 0;
  }
});
rules3.set("When minItems exists, minItems >= 0", (schema2) => {
  const { minItems } = schema2;
  if (typeof minItems === "number") {
    return minItems >= 0;
  }
});
rules3.set("deprecated must be a boolean", (schema2) => {
  const typeOfDeprecated = typeof schema2.deprecated;
  return typeOfDeprecated === "boolean" || typeOfDeprecated === "undefined";
});
function validate(schema2, filename) {
  const errors = [];
  rules3.forEach((rule, ruleName) => {
    traverse(schema2, (schema3, key) => {
      if (rule(schema3) === false) {
        errors.push(`Error at key "${key}" in file "${filename}": ${ruleName}`);
      }
      return schema3;
    });
  });
  return errors;
}

// ../sdk/src/vendor/json-schema-to-typescript/linker.ts
function link(schema2, parent = null) {
  if (!Array.isArray(schema2) && !isPlainObject(schema2)) {
    return schema2;
  }
  if (schema2.hasOwnProperty(Parent)) {
    return schema2;
  }
  Object.defineProperty(schema2, Parent, {
    enumerable: false,
    value: parent,
    writable: false
  });
  if (Array.isArray(schema2)) {
    schema2.forEach((child) => link(child, schema2));
  }
  for (const key in schema2) {
    link(schema2[key], schema2);
  }
  return schema2;
}

// ../sdk/src/vendor/json-schema-to-typescript/optionValidator.ts
function validateOptions({ maxItems }) {
  if (maxItems !== void 0 && maxItems < -1) {
    throw RangeError(`Expected options.maxItems to be >= -1, but was given ${maxItems}.`);
  }
}

// ../sdk/src/vendor/json-schema-to-typescript/index.ts
var DEFAULT_OPTIONS2 = {
  $refOptions: {},
  additionalProperties: true,
  // TODO: default to empty schema (as per spec) instead
  bannerComment: `/* eslint-disable */
/**
* This file was automatically generated by json-schema-to-typescript.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run json-schema-to-typescript to regenerate this file.
*/`,
  cwd: "",
  declareExternallyReferenced: true,
  enableConstEnums: true,
  inferStringEnumKeysFromValues: false,
  format: false,
  ignoreMinAndMaxItems: false,
  maxItems: 20,
  strictIndexSignatures: false,
  style: {
    bracketSpacing: false,
    printWidth: 120,
    semi: true,
    singleQuote: false,
    tabWidth: 2,
    trailingComma: "none",
    useTabs: false
  },
  unreachableDefinitions: false,
  unknownAny: true
};
function compile(schema2, name, options = {}) {
  validateOptions(options);
  const _options = merge({}, DEFAULT_OPTIONS2, options);
  const _schema = cloneDeep(schema2);
  const { dereferencedPaths, dereferencedSchema } = dereference(_schema);
  const linked = link(dereferencedSchema);
  const errors = validate(linked, name);
  if (errors.length) {
    throw new ValidationError(errors.join("\n"));
  }
  const normalized = normalize(linked, dereferencedPaths, name, _options);
  const parsed = parse(normalized, _options);
  const optimized = optimize(parsed, _options);
  const generated = generate(optimized, _options);
  const formatted = format(generated, _options);
  return formatted;
}
var ValidationError = class extends Error {
};

// ../sdk/src/schema-types.ts
var ROOT_WRAPPER_NAME = "SchemaPreview";
var TOOL_INPUT_PROPERTY_NAME = "__input";
var TOOL_OUTPUT_PROPERTY_NAME = "__output";
var DEFAULT_COMPILER_OPTIONS = {
  additionalProperties: false,
  bannerComment: "",
  enableConstEnums: false,
  format: false,
  unknownAny: true,
  unreachableDefinitions: false,
  style: {
    printWidth: 120,
    semi: true,
    singleQuote: false,
    trailingComma: "none"
  }
};
var DEFINITION_REF_PATTERN = /^#\/definitions\/(.+)$/;
var IDENTIFIER_PATTERN = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
var asRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value) ? value : {};
var asCompilerSchema = (value) => {
  if (typeof value === "boolean") {
    return value;
  }
  if (value !== null && typeof value === "object") {
    return value;
  }
  return {};
};
var isNullSchema = (value) => {
  if (value === false) {
    return false;
  }
  const schema2 = asRecord(value);
  return schema2.type === "null" || schema2.const === null;
};
var appendNullSchema = (schemas) => schemas.some(isNullSchema) ? [...schemas] : [...schemas, { type: "null" }];
var schemaAlreadyAllowsNull = (schema2) => {
  if (schema2.type === "null" || schema2.const === null) {
    return true;
  }
  if (Array.isArray(schema2.type) && schema2.type.includes("null")) {
    return true;
  }
  if (Array.isArray(schema2.enum) && schema2.enum.includes(null)) {
    return true;
  }
  const compositeSchemas = [
    ...Array.isArray(schema2.anyOf) ? schema2.anyOf : [],
    ...Array.isArray(schema2.oneOf) ? schema2.oneOf : []
  ];
  return compositeSchemas.some(isNullSchema);
};
var normalizeNullable = (schema2) => {
  if (schema2.nullable !== true) {
    return schema2;
  }
  const { nullable: _nullable, ...base } = schema2;
  if (schemaAlreadyAllowsNull(base)) {
    return base;
  }
  if ("const" in base) {
    const { const: constValue, type: _type, ...rest } = base;
    return { ...rest, enum: [constValue, null] };
  }
  if (Array.isArray(base.enum)) {
    return { ...base, enum: [...base.enum, null] };
  }
  if (typeof base.type === "string") {
    return { ...base, type: [base.type, "null"] };
  }
  if (Array.isArray(base.type)) {
    const types = base.type.filter((value) => typeof value === "string");
    return types.length > 0 ? { ...base, type: [...types, "null"] } : { anyOf: [base, { type: "null" }] };
  }
  if (Array.isArray(base.oneOf)) {
    return { ...base, oneOf: appendNullSchema(base.oneOf) };
  }
  if (Array.isArray(base.anyOf)) {
    return { ...base, anyOf: appendNullSchema(base.anyOf) };
  }
  return { anyOf: [base, { type: "null" }] };
};
var normalizeSchema = (node) => {
  if (node === null || typeof node !== "object") {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map((item) => normalizeSchema(item));
  }
  const schema2 = node;
  const normalized = {};
  for (const [key, value] of Object.entries(schema2)) {
    if (key === "$ref" && typeof value === "string") {
      const definitionName = value.match(DEFINITION_REF_PATTERN)?.[1];
      normalized[key] = definitionName ? `#/$defs/${definitionName}` : value;
      continue;
    }
    normalized[key] = normalizeSchema(value);
  }
  const nullable = normalizeNullable(normalized);
  if (nullable.type === "object" && nullable.properties === void 0 && nullable.additionalProperties === void 0) {
    return { ...nullable, additionalProperties: {} };
  }
  return nullable;
};
var mergeDefinitions = (externalDefs, localDefs) => {
  const merged = {};
  for (const [name, schema2] of externalDefs) {
    merged[name] = normalizeSchema(normalizeRefs(asCompilerSchema(schema2)));
  }
  for (const [name, schema2] of Object.entries(localDefs)) {
    merged[name] = normalizeSchema(normalizeRefs(asCompilerSchema(schema2)));
  }
  return merged;
};
var buildWrappedObjectSchema = (properties, defs) => {
  const normalizedProperties = {};
  const localDefs = {};
  for (const [name, schema2] of properties) {
    const normalizedSchema = normalizeSchema(normalizeRefs(asCompilerSchema(schema2)));
    const { stripped, defs: schemaDefs } = hoistDefinitions(normalizedSchema);
    normalizedProperties[name] = asCompilerSchema(stripped);
    Object.assign(localDefs, schemaDefs);
  }
  const mergedDefs = mergeDefinitions(defs, localDefs);
  const wrappedSchema = {
    type: "object",
    properties: normalizedProperties,
    required: properties.map(([name]) => name),
    additionalProperties: false
  };
  if (Object.keys(mergedDefs).length > 0) {
    wrappedSchema.$defs = mergedDefs;
  }
  return wrappedSchema;
};
var compilerOptionsFrom = (options) => ({
  ...DEFAULT_COMPILER_OPTIONS,
  ...options.compilerOptions,
  bannerComment: "",
  format: false,
  style: {
    ...DEFAULT_COMPILER_OPTIONS.style,
    ...options.compilerOptions?.style
  }
});
var emptyScanState = () => ({
  quote: null,
  escaping: false,
  lineComment: false,
  blockComment: false
});
var stepScanState = (state, current, next) => {
  if (state.lineComment) {
    if (current === "\n" || current === "\r") {
      state.lineComment = false;
    }
    return { skipNext: false };
  }
  if (state.blockComment) {
    if (current === "*" && next === "/") {
      state.blockComment = false;
      return { skipNext: true };
    }
    return { skipNext: false };
  }
  if (state.quote) {
    if (state.escaping) {
      state.escaping = false;
      return { skipNext: false };
    }
    if (current === "\\") {
      state.escaping = true;
      return { skipNext: false };
    }
    if (current === state.quote) {
      state.quote = null;
    }
    return { skipNext: false };
  }
  if (current === "/" && next === "/") {
    state.lineComment = true;
    return { skipNext: true };
  }
  if (current === "/" && next === "*") {
    state.blockComment = true;
    return { skipNext: true };
  }
  if (current === '"' || current === "'" || current === "`") {
    state.quote = current;
  }
  return { skipNext: false };
};
var findMatchingBrace = (source, start) => {
  const state = emptyScanState();
  let depth = 0;
  for (let index = start; index < source.length; index += 1) {
    const current = source[index] ?? "";
    const next = source[index + 1] ?? "";
    const wasCode = !state.quote && !state.lineComment && !state.blockComment;
    const { skipNext } = stepScanState(state, current, next);
    if (wasCode && !state.quote && !state.lineComment && !state.blockComment) {
      if (current === "{") {
        depth += 1;
      } else if (current === "}") {
        depth -= 1;
        if (depth === 0) {
          return index;
        }
      }
    }
    if (skipNext) {
      index += 1;
    }
  }
  return -1;
};
var findMatchingParen = (source, start) => {
  const state = emptyScanState();
  let depth = 0;
  for (let index = start; index < source.length; index += 1) {
    const current = source[index] ?? "";
    const next = source[index + 1] ?? "";
    const wasCode = !state.quote && !state.lineComment && !state.blockComment;
    const { skipNext } = stepScanState(state, current, next);
    if (wasCode && !state.quote && !state.lineComment && !state.blockComment) {
      if (current === "(") {
        depth += 1;
      } else if (current === ")") {
        depth -= 1;
        if (depth === 0) {
          return index;
        }
      }
    }
    if (skipNext) {
      index += 1;
    }
  }
  return -1;
};
var findTypeAliasEnd = (source, start) => {
  const state = emptyScanState();
  let braceDepth = 0;
  let bracketDepth = 0;
  let parenDepth = 0;
  let seenToken = false;
  for (let index = start; index < source.length; index += 1) {
    const current = source[index] ?? "";
    const next = source[index + 1] ?? "";
    const wasCode = !state.quote && !state.lineComment && !state.blockComment;
    const { skipNext } = stepScanState(state, current, next);
    if (wasCode && !state.quote && !state.lineComment && !state.blockComment) {
      if (current === "{") {
        braceDepth += 1;
      } else if (current === "}") {
        braceDepth = Math.max(0, braceDepth - 1);
      } else if (current === "[") {
        bracketDepth += 1;
      } else if (current === "]") {
        bracketDepth = Math.max(0, bracketDepth - 1);
      } else if (current === "(") {
        parenDepth += 1;
      } else if (current === ")") {
        parenDepth = Math.max(0, parenDepth - 1);
      }
      if (!/\s/.test(current)) {
        seenToken = true;
      }
      if (seenToken && (current === ";" || current === "\n" || current === "\r") && braceDepth === 0 && bracketDepth === 0 && parenDepth === 0) {
        return index;
      }
    }
    if (skipNext) {
      index += 1;
    }
  }
  return -1;
};
var parseGeneratedDeclarations = (source) => {
  const declarations = [];
  const pattern = /export\s+(interface|type)\s+([A-Za-z_$][A-Za-z0-9_$]*)/g;
  for (let match = pattern.exec(source); match; match = pattern.exec(source)) {
    const kind = match[1];
    const name = match[2] ?? "";
    if (!IDENTIFIER_PATTERN.test(name)) {
      continue;
    }
    if (kind === "interface") {
      const braceStart = source.indexOf("{", pattern.lastIndex);
      if (braceStart < 0) {
        continue;
      }
      const braceEnd = findMatchingBrace(source, braceStart);
      if (braceEnd < 0) {
        continue;
      }
      declarations.push({
        kind,
        name,
        body: source.slice(braceStart, braceEnd + 1)
      });
      pattern.lastIndex = braceEnd + 1;
      continue;
    }
    const equalsIndex = source.indexOf("=", pattern.lastIndex);
    if (equalsIndex < 0) {
      continue;
    }
    const end = findTypeAliasEnd(source, equalsIndex + 1);
    if (end < 0) {
      continue;
    }
    declarations.push({
      kind,
      name,
      body: source.slice(equalsIndex + 1, end).trim()
    });
    pattern.lastIndex = end + 1;
  }
  return declarations;
};
var extractPropertyType = (interfaceBody, propertyName) => {
  const propertyIndex = interfaceBody.indexOf(propertyName);
  if (propertyIndex < 0) {
    return null;
  }
  const colonIndex = interfaceBody.indexOf(":", propertyIndex + propertyName.length);
  if (colonIndex < 0) {
    return null;
  }
  const end = findTypeAliasEnd(interfaceBody, colonIndex + 1);
  if (end < 0) {
    return null;
  }
  return interfaceBody.slice(colonIndex + 1, end).trim();
};
var containsTopLevelUnion = (source) => {
  const state = emptyScanState();
  let braceDepth = 0;
  let bracketDepth = 0;
  let parenDepth = 0;
  for (let index = 0; index < source.length; index += 1) {
    const current = source[index] ?? "";
    const next = source[index + 1] ?? "";
    const wasCode = !state.quote && !state.lineComment && !state.blockComment;
    const { skipNext } = stepScanState(state, current, next);
    if (wasCode && !state.quote && !state.lineComment && !state.blockComment) {
      if (current === "{") {
        braceDepth += 1;
      } else if (current === "}") {
        braceDepth = Math.max(0, braceDepth - 1);
      } else if (current === "[") {
        bracketDepth += 1;
      } else if (current === "]") {
        bracketDepth = Math.max(0, bracketDepth - 1);
      } else if (current === "(") {
        parenDepth += 1;
      } else if (current === ")") {
        parenDepth = Math.max(0, parenDepth - 1);
      } else if (current === "|" && braceDepth === 0 && bracketDepth === 0 && parenDepth === 0) {
        return true;
      }
    }
    if (skipNext) {
      index += 1;
    }
  }
  return false;
};
var significantBefore = (source, start) => {
  for (let index = start; index >= 0; index -= 1) {
    const char = source[index] ?? "";
    if (!/\s/.test(char)) {
      return char;
    }
  }
  return "";
};
var significantAfter = (source, start) => {
  for (let index = start; index < source.length; index += 1) {
    const char = source[index] ?? "";
    if (!/\s/.test(char)) {
      return char;
    }
  }
  return "";
};
var stripRedundantUnionParens = (source) => {
  let output = "";
  for (let index = 0; index < source.length; index += 1) {
    const current = source[index] ?? "";
    if (current !== "(") {
      output += current;
      continue;
    }
    const end = findMatchingParen(source, index);
    if (end < 0) {
      output += current;
      continue;
    }
    const previous = significantBefore(source, index - 1);
    const next = significantAfter(source, end + 1);
    const inner = source.slice(index + 1, end);
    const keepParens = !containsTopLevelUnion(inner) || /[A-Za-z0-9_$]/.test(previous) || next === "[" || next === "." || next === "<";
    if (keepParens) {
      output += source.slice(index, end + 1);
    } else {
      output += stripRedundantUnionParens(inner);
    }
    index = end;
  }
  return output;
};
var compactTypeScript = (value) => {
  const state = emptyScanState();
  let output = "";
  let pendingWhitespace = false;
  let braceDepth = 0;
  const emitWhitespace = () => {
    if (output.length > 0) {
      pendingWhitespace = true;
    }
  };
  const previousSignificant = () => output.trimEnd().at(-1) ?? "";
  const nextSignificant = (start) => {
    for (let index = start; index < value.length; index += 1) {
      const char = value[index] ?? "";
      if (!/\s/.test(char)) {
        return char;
      }
    }
    return "";
  };
  const terminateMemberAtNewline = (index) => {
    if (braceDepth <= 0) {
      return;
    }
    const previous = previousSignificant();
    if (!previous || previous === "{" || previous === ";" || previous === "|" || previous === "&") {
      return;
    }
    const next = nextSignificant(index + 1);
    if (!next || next === "|" || next === "&" || next === ")" || next === "]" || next === ",") {
      return;
    }
    output = output.trimEnd() + ";";
    pendingWhitespace = true;
  };
  for (let index = 0; index < value.length; index += 1) {
    const current = value[index] ?? "";
    const next = value[index + 1] ?? "";
    if (!state.quote && !state.lineComment && !state.blockComment) {
      if (current === "/" && next === "/") {
        emitWhitespace();
        index += 1;
        state.lineComment = true;
        continue;
      }
      if (current === "/" && next === "*") {
        emitWhitespace();
        index += 1;
        state.blockComment = true;
        continue;
      }
      if (/\s/.test(current)) {
        if (current === "\n" || current === "\r") {
          terminateMemberAtNewline(index);
        }
        emitWhitespace();
        continue;
      }
    }
    if (state.lineComment) {
      if (current === "\n" || current === "\r") {
        state.lineComment = false;
      }
      continue;
    }
    if (state.blockComment) {
      if (current === "*" && next === "/") {
        state.blockComment = false;
        index += 1;
      }
      continue;
    }
    if (pendingWhitespace && output.length > 0) {
      output += " ";
    }
    pendingWhitespace = false;
    output += current;
    if (state.quote) {
      if (state.escaping) {
        state.escaping = false;
      } else if (current === "\\") {
        state.escaping = true;
      } else if (current === state.quote) {
        state.quote = null;
      }
      continue;
    }
    if (current === '"' || current === "'" || current === "`") {
      state.quote = current;
      continue;
    }
    if (current === "{") {
      braceDepth += 1;
    } else if (current === "}") {
      braceDepth = Math.max(0, braceDepth - 1);
    }
  }
  return stripRedundantUnionParens(output.trim());
};
var getDefinitionsFromDeclarations = (declarations) => Object.fromEntries(
  declarations.filter((declaration) => declaration.name !== ROOT_WRAPPER_NAME).map((declaration) => [declaration.name, compactTypeScript(declaration.body)]).sort(([left], [right]) => left.localeCompare(right))
);
var previewToolFromCompiledTypeScript = (source) => {
  const declarations = parseGeneratedDeclarations(source);
  const rootDeclaration = declarations.find(
    (declaration) => declaration.name === ROOT_WRAPPER_NAME
  );
  const inputType = rootDeclaration?.kind === "interface" ? extractPropertyType(rootDeclaration.body, TOOL_INPUT_PROPERTY_NAME) : null;
  const outputType = rootDeclaration?.kind === "interface" ? extractPropertyType(rootDeclaration.body, TOOL_OUTPUT_PROPERTY_NAME) : null;
  const definitions = getDefinitionsFromDeclarations(declarations);
  return {
    ...inputType ? { inputTypeScript: compactTypeScript(inputType) } : {},
    ...outputType ? { outputTypeScript: compactTypeScript(outputType) } : {},
    ...Object.keys(definitions).length > 0 ? { typeScriptDefinitions: definitions } : {}
  };
};
var buildToolTypeScriptPreview = async (input) => {
  const properties = [];
  if (input.inputSchema !== void 0) {
    properties.push([TOOL_INPUT_PROPERTY_NAME, input.inputSchema]);
  }
  if (input.outputSchema !== void 0) {
    properties.push([TOOL_OUTPUT_PROPERTY_NAME, input.outputSchema]);
  }
  if (properties.length === 0) {
    return {};
  }
  const wrappedSchema = buildWrappedObjectSchema(properties, input.defs);
  return Promise.resolve().then(() => compile(wrappedSchema, ROOT_WRAPPER_NAME, compilerOptionsFrom(input.options ?? {}))).then(
    (source) => previewToolFromCompiledTypeScript(source),
    () => ({
      ...input.inputSchema !== void 0 ? { inputTypeScript: "unknown" } : {},
      ...input.outputSchema !== void 0 ? { outputTypeScript: "unknown" } : {}
    })
  );
};

// ../sdk/src/connection-name-identifier.ts
var connectionIdentifier = (input, fallback = "connection") => {
  const words = input.toLowerCase().match(/[a-z0-9]+/g);
  const base = words?.map(
    (word, index) => index === 0 ? word : `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`
  ).join("") || fallback;
  return ConnectionName.make(
    /^[A-Za-z_$]/.test(base) ? base : `${fallback}${base[0]?.toUpperCase() ?? ""}${base.slice(1)}`
  );
};

// ../sdk/src/tool-result.ts
import { Effect as Effect10, Schema as Schema13 } from "effect";
var ToolErrorSchema = Schema13.Struct({
  code: Schema13.String,
  message: Schema13.String,
  status: Schema13.optional(Schema13.Number),
  details: Schema13.optional(Schema13.Unknown),
  retryable: Schema13.optional(Schema13.Boolean)
});
var ToolHttpMetaSchema = Schema13.Struct({
  status: Schema13.Number,
  headers: Schema13.Record(Schema13.String, Schema13.String)
});
var ToolFileSchema = Schema13.TaggedStruct("ToolFile", {
  name: Schema13.optional(Schema13.String),
  mimeType: Schema13.String,
  encoding: Schema13.Literal("base64"),
  data: Schema13.String.annotate({
    description: "Base64-encoded file bytes.",
    contentEncoding: "base64"
  }),
  byteLength: Schema13.Int.annotate({
    description: "Raw file size in bytes before base64 encoding."
  })
});
var ToolFileJsonSchema = Schema13.toJsonSchemaDocument(ToolFileSchema).schema;
var matchesToolFileSchema = Schema13.is(ToolFileSchema);
var isToolFile = (value) => matchesToolFileSchema(value);
var ToolResult = {
  ok: (data, meta) => ({
    ok: true,
    data,
    ...meta?.http ? { http: meta.http } : {}
  }),
  fail: (error) => ({ ok: false, error })
};
var ToolResultSchema = Schema13.Union([
  Schema13.Struct({
    ok: Schema13.Literal(true),
    data: Schema13.Unknown,
    http: Schema13.optional(ToolHttpMetaSchema)
  }),
  Schema13.Struct({ ok: Schema13.Literal(false), error: ToolErrorSchema })
]);
var isUnknownToolResult = Schema13.is(ToolResultSchema);
var isToolResult = (value) => isUnknownToolResult(value);
var annotateToolResultOutcome = (value) => {
  if (isToolResult(value) && !value.ok) {
    return Effect10.annotateCurrentSpan({
      "executor.tool.outcome": "fail",
      "executor.tool.error_code": value.error.code,
      ...value.error.status != null ? { "executor.tool.error_status": value.error.status } : {}
    });
  }
  return Effect10.annotateCurrentSpan({ "executor.tool.outcome": "ok" });
};

// ../sdk/src/executor.ts
var PLUGIN_STORAGE_DELETE_KEY_BATCH_SIZE = 90;
var PLUGIN_STORAGE_CREATE_ROW_BATCH_SIZE = 90;
var MAX_APPROVAL_ARGUMENT_PREVIEW_CHARS = 4e3;
var acceptAllHandler = () => Effect11.succeed(ElicitationResponse.make({ action: "accept" }));
var resolveElicitationHandler = (onElicitation) => onElicitation === "accept-all" ? acceptAllHandler : onElicitation;
var ADDRESS_PREFIX = "tools";
var isOwner = (value) => value === "org" || value === "user";
var parseToolAddress = (address) => {
  let cut = -1;
  for (let i = 0; i < 4; i++) {
    cut = address.indexOf(".", cut + 1);
    if (cut === -1) return null;
  }
  const [prefix, integration, owner, connection] = address.slice(0, cut).split(".");
  const tool2 = address.slice(cut + 1);
  if (prefix !== ADDRESS_PREFIX) return null;
  if (!isOwner(owner)) return null;
  if (integration.length === 0 || connection.length === 0 || tool2.length === 0) {
    return null;
  }
  return {
    integration: IntegrationSlug.make(integration),
    owner,
    connection: ConnectionName.make(connection),
    tool: ToolName.make(tool2)
  };
};
var connectionAddress = (owner, integration, connection) => ConnectionAddress.make(`${ADDRESS_PREFIX}.${integration}.${owner}.${connection}`);
var toolAddress = (owner, integration, connection, tool2) => ToolAddress.make(`${ADDRESS_PREFIX}.${integration}.${owner}.${connection}.${tool2}`);
var DEFAULT_TOOLS_SYNC_TTL_MS = 15 * 60 * 1e3;
var collectTables = () => {
  validateExecutorOwnerPolicyTables(coreSchema);
  return { ...coreSchema };
};
var validateExecutorOwnerPolicyTables = (tables) => {
  for (const [tableKey, tableDef] of Object.entries(tables)) {
    assertExecutorOwnerPolicyTable(tableDef, tableKey);
  }
};
var validateExecutorDbTables = (required, actual) => {
  const missing = Object.keys(required).filter((tableName) => !actual[tableName]).sort();
  if (missing.length === 0) return;
  throw new StorageError({
    message: `Executor database is missing required table definitions: ${missing.join(", ")}`,
    cause: {
      missing,
      available: Object.keys(actual).sort()
    }
  });
};
var storageFailureFromUnknown = (message, cause) => isStorageFailure(cause) ? cause : new StorageError({ message, cause });
var pluginStorageFailure = (pluginId, hook, cause) => storageFailureFromUnknown(`${hook} failed for plugin ${pluginId}`, cause);
var createDefaultMemoryDb = (tables) => {
  const version = "1.0.0";
  const latestSchema = schema({
    version,
    tables
  });
  const factory = fumadb({
    namespace: "executor_memory",
    schemas: [latestSchema]
  });
  const db = factory.client(memoryAdapter()).orm(version);
  return { db };
};
var decodeJsonFromString = Schema14.decodeUnknownOption(Schema14.UnknownFromJsonString);
var decodeJsonColumn = (value) => {
  if (value === null || value === void 0) return void 0;
  if (typeof value !== "string") return value;
  return decodeJsonFromString(value).pipe(Option5.getOrElse(() => value));
};
var rowToIntegration = (row, authMethods = [], display) => ({
  slug: IntegrationSlug.make(row.slug),
  // Pre-split rows have no `name`; their description WAS the display name.
  name: row.name ?? row.description ?? row.slug,
  // `description` is now nullable (cleared where it only held a duplicated
  // title); present it as "" so the public Integration type stays a string.
  description: row.description ?? "",
  kind: row.plugin_id,
  canRemove: Boolean(row.can_remove),
  canRefresh: Boolean(row.can_refresh),
  authMethods,
  ...display?.url ? { displayUrl: display.url } : {},
  ...display?.family ? { family: display.family } : {}
});
var rowToIntegrationRecord = (row, authMethods = []) => ({
  ...rowToIntegration(row, authMethods),
  config: decodeJsonColumn(row.config)
});
var decodeLastHealth = Schema14.decodeUnknownOption(HealthCheckResult);
var decodeHealthCheckSpec = Schema14.decodeUnknownOption(HealthCheckSpec);
var missingOAuthScopesFromProviderState = (value) => {
  const decoded = decodeJsonColumn(value);
  if (decoded == null || typeof decoded !== "object" || Array.isArray(decoded)) return [];
  const scopes = decoded.missingOAuthScopes;
  return Array.isArray(scopes) ? scopes.filter((scope) => typeof scope === "string") : [];
};
var rowToConnection = (row) => {
  const owner = row.owner;
  const integration = IntegrationSlug.make(row.integration);
  const name = ConnectionName.make(row.name);
  return {
    owner,
    name,
    integration,
    template: AuthTemplateSlug.make(row.template),
    provider: ProviderKey.make(row.provider),
    address: connectionAddress(owner, integration, name),
    identityLabel: row.identity_label ?? null,
    description: row.description ?? null,
    expiresAt: row.expires_at == null ? null : Number(row.expires_at),
    oauthClient: row.oauth_client == null ? null : OAuthClientSlug.make(String(row.oauth_client)),
    oauthClientOwner: row.oauth_client_owner == null ? null : String(row.oauth_client_owner),
    oauthScope: row.oauth_scope == null ? null : String(row.oauth_scope),
    missingOAuthScopes: missingOAuthScopesFromProviderState(row.provider_state),
    lastHealth: Option5.getOrNull(decodeLastHealth(row.last_health))
  };
};
var PRIMARY_INPUT_VARIABLE = "token";
var normalizeConnectionInputs = (input) => {
  if ("inputs" in input) {
    return Object.entries(input.inputs).map(([variable, origin]) => ({ variable, origin }));
  }
  if ("values" in input) {
    return Object.entries(input.values).map(([variable, value]) => ({
      variable,
      origin: { value }
    }));
  }
  if ("from" in input) {
    return [{ variable: PRIMARY_INPUT_VARIABLE, origin: { from: input.from } }];
  }
  return [{ variable: PRIMARY_INPUT_VARIABLE, origin: { value: input.value } }];
};
var connectionItemIds = (row) => {
  const decoded = decodeJsonColumn(row.item_ids);
  if (decoded == null || typeof decoded !== "object") return {};
  return decoded;
};
var rowToTool = (row, annotations) => {
  const owner = row.owner;
  const integration = IntegrationSlug.make(row.integration);
  const connection = ConnectionName.make(row.connection);
  const name = ToolName.make(row.name);
  return {
    address: toolAddress(owner, integration, connection, name),
    owner,
    integration,
    connection,
    name,
    pluginId: row.plugin_id,
    description: row.description,
    inputSchema: decodeJsonColumn(row.input_schema),
    outputSchema: decodeJsonColumn(row.output_schema),
    annotations: annotations ?? decodeJsonColumn(row.annotations)
  };
};
var asLooseStorageDb = (db) => db;
var makeCoreDb = (fuma) => ({
  count: (tableName, options) => fuma.use(`${tableName}.count`, (db) => asLooseStorageDb(db).count(tableName, options)),
  create: (tableName, row) => fuma.use(
    `${tableName}.create`,
    (db) => asLooseStorageDb(db).create(tableName, row)
  ),
  createMany: (tableName, rows) => rows.length === 0 ? Effect11.void : fuma.use(`${tableName}.createMany`, (db) => asLooseStorageDb(db).createMany(tableName, rows)).pipe(Effect11.asVoid),
  deleteMany: (tableName, options = {}) => fuma.use(
    `${tableName}.deleteMany`,
    (db) => asLooseStorageDb(db).deleteMany(tableName, options)
  ),
  findFirst: (tableName, options) => fuma.use(
    `${tableName}.findFirst`,
    (db) => asLooseStorageDb(db).findFirst(tableName, options)
  ),
  findMany: (tableName, options = {}) => fuma.use(
    `${tableName}.findMany`,
    (db) => asLooseStorageDb(db).findMany(tableName, options)
  ),
  updateMany: (tableName, options) => fuma.use(
    `${tableName}.updateMany`,
    (db) => asLooseStorageDb(db).updateMany(tableName, options)
  )
});
var pluginStorageEntryFromRow = (row) => ({
  id: pluginStorageId({
    pluginId: row.plugin_id,
    collection: row.collection,
    key: row.key
  }),
  owner: row.owner,
  pluginId: row.plugin_id,
  collection: row.collection,
  key: row.key,
  data: row.data,
  createdAt: row.created_at instanceof Date ? row.created_at : new Date(row.created_at),
  updatedAt: row.updated_at instanceof Date ? row.updated_at : new Date(row.updated_at)
});
var pluginStorageIndexSpecFields = (spec) => typeof spec === "string" ? [spec] : spec;
var pluginStorageCollectionIndexedFields = (definition) => new Set(definition.indexes.flatMap((spec) => pluginStorageIndexSpecFields(spec)));
var pluginStorageQueryValidationError = (definition, query) => {
  if (!query) return null;
  const indexedFields = pluginStorageCollectionIndexedFields(definition);
  const fields = /* @__PURE__ */ new Set([
    ...Object.keys(query.where ?? {}),
    ...(query.orderBy ?? []).map((order) => order.field)
  ]);
  for (const field of fields) {
    if (!indexedFields.has(field)) {
      return new StorageError({
        message: `Plugin storage collection "${definition.name}" cannot query field "${field}" because it is not declared as an index`,
        cause: void 0
      });
    }
  }
  if (query.limit !== void 0 && (!Number.isInteger(query.limit) || query.limit < 0)) {
    return new StorageError({
      message: `Plugin storage collection "${definition.name}" received an invalid query limit`,
      cause: void 0
    });
  }
  if (query.offset !== void 0 && (!Number.isInteger(query.offset) || query.offset < 0)) {
    return new StorageError({
      message: `Plugin storage collection "${definition.name}" received an invalid query offset`,
      cause: void 0
    });
  }
  return null;
};
var isPluginStorageRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
var pluginStorageWhereOperators = ["eq", "in", "gt", "gte", "lt", "lte"];
var isPluginStorageWhereFilter = (value) => isPluginStorageRecord(value) && pluginStorageWhereOperators.some((operator) => operator in value);
var pluginStorageComparableValue = (value) => {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number" || typeof value === "string" || typeof value === "boolean") {
    return value;
  }
  if (value == null) return null;
  return JSON.stringify(value);
};
var comparePluginStorageValues = (left, right) => {
  const leftValue = pluginStorageComparableValue(left);
  const rightValue = pluginStorageComparableValue(right);
  if (leftValue === rightValue) return 0;
  if (leftValue === null) return -1;
  if (rightValue === null) return 1;
  return leftValue < rightValue ? -1 : 1;
};
var pluginStorageDataField = (data, field) => isPluginStorageRecord(data) ? data[field] : void 0;
var matchesWhereOperator = (operator, value, operand) => {
  if (operator === "eq") return comparePluginStorageValues(value, operand) === 0;
  if (operator === "in") {
    return Array.isArray(operand) && operand.some((item) => comparePluginStorageValues(value, item) === 0);
  }
  if (operator === "gt") return comparePluginStorageValues(value, operand) > 0;
  if (operator === "gte") return comparePluginStorageValues(value, operand) >= 0;
  if (operator === "lt") return comparePluginStorageValues(value, operand) < 0;
  if (operator === "lte") return comparePluginStorageValues(value, operand) <= 0;
  return false;
};
var matchesWhereOperators = (value, filter) => {
  for (const [operator, operand] of Object.entries(filter)) {
    if (!matchesWhereOperator(operator, value, operand)) return false;
  }
  return true;
};
var rowMatchesPluginStorageWhere = (row, where) => {
  if (!where) return true;
  for (const [field, condition] of Object.entries(where)) {
    const value = pluginStorageDataField(row.data, field);
    if (isPluginStorageWhereFilter(condition)) {
      if (!matchesWhereOperators(value, condition)) return false;
    } else if (comparePluginStorageValues(value, condition) !== 0) {
      return false;
    }
  }
  return true;
};
var makePluginStorageFacade = (input) => {
  const readOwners = input.owner.subject == null ? ["org"] : ["user", "org"];
  const ownerSubject = (owner) => {
    if (owner === "org") return { owner: "org", subject: ORG_SUBJECT };
    if (input.owner.subject == null) return null;
    return { owner: "user", subject: String(input.owner.subject) };
  };
  const tenant = String(input.owner.tenant);
  const whereFor = (collection, key) => (b) => b.and(
    b("plugin_id", "=", input.pluginId),
    b("collection", "=", collection),
    key === void 0 ? true : b("key", "=", key)
  );
  const whereOwner = (owner, collection, key) => {
    const os = ownerSubject(owner);
    return (b) => b.and(
      b("plugin_id", "=", input.pluginId),
      b("collection", "=", collection),
      b("key", "=", key),
      b("owner", "=", owner),
      b("subject", "=", os ? os.subject : ORG_SUBJECT)
    );
  };
  const ownerRank = (owner) => readOwners.indexOf(owner);
  const sortByOwnerPrecedence = (rows) => [...rows].sort((left, right) => {
    const l = ownerRank(left.owner);
    const r = ownerRank(right.owner);
    return l - r || left.key.localeCompare(right.key);
  });
  const getVisible = (collection, key) => input.core.findMany("plugin_storage", { where: whereFor(collection, key) }).pipe(
    Effect11.map((rows) => sortByOwnerPrecedence(rows)[0] ?? null),
    Effect11.map((row) => row ? pluginStorageEntryFromRow(row) : null)
  );
  const getForOwnerImpl = (owner, collection, key) => input.core.findFirst("plugin_storage", {
    where: whereOwner(owner, collection, key)
  }).pipe(Effect11.map((row) => row ? pluginStorageEntryFromRow(row) : null));
  const putImpl = (owner, collection, key, data) => Effect11.gen(function* () {
    const os = ownerSubject(owner);
    if (!os) {
      return yield* new StorageError({
        message: `Cannot write plugin storage for owner "user": executor has no subject.`,
        cause: void 0
      });
    }
    const existing = yield* input.core.findFirst("plugin_storage", {
      where: whereOwner(owner, collection, key)
    });
    const now = /* @__PURE__ */ new Date();
    if (existing) {
      yield* input.core.updateMany("plugin_storage", {
        where: whereOwner(owner, collection, key),
        set: { data, updated_at: now }
      });
      return pluginStorageEntryFromRow({
        ...existing,
        data,
        updated_at: now
      });
    }
    const created = yield* input.core.create("plugin_storage", {
      tenant,
      owner: os.owner,
      subject: os.subject,
      plugin_id: input.pluginId,
      collection,
      key,
      data,
      created_at: now,
      updated_at: now
    });
    return pluginStorageEntryFromRow(created);
  });
  const removeImpl = (owner, collection, key) => Effect11.gen(function* () {
    const os = ownerSubject(owner);
    if (!os) {
      return yield* new StorageError({
        message: `Cannot delete plugin storage for owner "user": executor has no subject.`,
        cause: void 0
      });
    }
    yield* input.core.deleteMany("plugin_storage", {
      where: whereOwner(owner, collection, key)
    });
  });
  const keysByCollection = (entries) => {
    const grouped = /* @__PURE__ */ new Map();
    for (const entry of entries) {
      const keys = grouped.get(entry.collection);
      if (keys) {
        keys.add(entry.key);
      } else {
        grouped.set(entry.collection, /* @__PURE__ */ new Set([entry.key]));
      }
    }
    return grouped;
  };
  const deleteManyImpl = (owner, subject, entries) => Effect11.gen(function* () {
    for (const [collection, keys] of keysByCollection(entries)) {
      const uniqueKeys = [...keys];
      for (let offset = 0; offset < uniqueKeys.length; offset += PLUGIN_STORAGE_DELETE_KEY_BATCH_SIZE) {
        const batchKeys = uniqueKeys.slice(offset, offset + PLUGIN_STORAGE_DELETE_KEY_BATCH_SIZE);
        yield* input.core.deleteMany("plugin_storage", {
          where: (b) => b.and(
            b("plugin_id", "=", input.pluginId),
            b("collection", "=", collection),
            b("key", "in", batchKeys),
            b("owner", "=", owner),
            b("subject", "=", subject)
          )
        });
      }
    }
  });
  const putManyImpl = (owner, entries) => Effect11.gen(function* () {
    const os = ownerSubject(owner);
    if (!os) {
      return yield* new StorageError({
        message: `Cannot write plugin storage for owner "user": executor has no subject.`,
        cause: void 0
      });
    }
    const entriesById = new Map(
      entries.map((entry) => [
        pluginStorageId({
          pluginId: input.pluginId,
          collection: entry.collection,
          key: entry.key
        }),
        entry
      ])
    );
    const uniqueEntries = [...entriesById.values()];
    if (uniqueEntries.length === 0) return;
    yield* deleteManyImpl(owner, os.subject, uniqueEntries);
    const now = /* @__PURE__ */ new Date();
    for (let offset = 0; offset < uniqueEntries.length; offset += PLUGIN_STORAGE_CREATE_ROW_BATCH_SIZE) {
      const batchEntries = uniqueEntries.slice(
        offset,
        offset + PLUGIN_STORAGE_CREATE_ROW_BATCH_SIZE
      );
      yield* input.core.createMany(
        "plugin_storage",
        batchEntries.map((entry) => ({
          tenant,
          owner: os.owner,
          subject: os.subject,
          plugin_id: input.pluginId,
          collection: entry.collection,
          key: entry.key,
          data: entry.data,
          created_at: now,
          updated_at: now
        }))
      );
    }
  });
  const removeManyImpl = (owner, entries) => Effect11.gen(function* () {
    const os = ownerSubject(owner);
    if (!os) {
      return yield* new StorageError({
        message: `Cannot delete plugin storage for owner "user": executor has no subject.`,
        cause: void 0
      });
    }
    yield* deleteManyImpl(owner, os.subject, entries);
  });
  const queryCollection = (definition, queryInput) => Effect11.gen(function* () {
    const validationError = pluginStorageQueryValidationError(
      definition,
      queryInput
    );
    if (validationError) return yield* validationError;
    const rows = yield* input.core.findMany("plugin_storage", {
      where: whereFor(definition.name)
    });
    const filtered = sortByOwnerPrecedence(rows).filter(
      (row) => queryInput?.keyPrefix === void 0 ? true : row.key.startsWith(queryInput.keyPrefix)
    ).filter(
      (row) => rowMatchesPluginStorageWhere(
        row,
        queryInput?.where
      )
    );
    const sorted = queryInput?.orderBy && queryInput.orderBy.length > 0 ? [...filtered].sort((left, right) => {
      for (const order of queryInput.orderBy ?? []) {
        const direction = order.direction === "desc" ? -1 : 1;
        const compared = comparePluginStorageValues(
          pluginStorageDataField(left.data, order.field),
          pluginStorageDataField(right.data, order.field)
        ) * direction;
        if (compared !== 0) return compared;
      }
      return ownerRank(left.owner) - ownerRank(right.owner) || left.key.localeCompare(right.key);
    }) : filtered;
    const offset = queryInput?.offset ?? 0;
    const limited = queryInput?.limit === void 0 ? sorted.slice(offset) : sorted.slice(offset, offset + queryInput.limit);
    return limited.map(
      (row) => pluginStorageEntryFromRow(row)
    );
  });
  return {
    collection: (definition) => ({
      get: (storageInput) => getVisible(definition.name, storageInput.key),
      getForOwner: (storageInput) => getForOwnerImpl(storageInput.owner, definition.name, storageInput.key),
      list: (storageInput) => queryCollection(definition, { keyPrefix: storageInput?.keyPrefix }),
      put: (storageInput) => putImpl(
        storageInput.owner,
        definition.name,
        storageInput.key,
        storageInput.data
      ),
      query: (storageInput) => queryCollection(definition, storageInput),
      count: (storageInput) => queryCollection(definition, storageInput).pipe(Effect11.map((rows) => rows.length)),
      remove: (storageInput) => removeImpl(storageInput.owner, definition.name, storageInput.key)
    }),
    get: (storageInput) => getVisible(storageInput.collection, storageInput.key),
    getForOwner: (storageInput) => getForOwnerImpl(storageInput.owner, storageInput.collection, storageInput.key),
    list: (storageInput) => Effect11.gen(function* () {
      const rows = yield* input.core.findMany("plugin_storage", {
        where: whereFor(storageInput.collection)
      });
      return sortByOwnerPrecedence(rows).filter(
        (row) => storageInput.keyPrefix === void 0 ? true : row.key.startsWith(storageInput.keyPrefix)
      ).map((row) => pluginStorageEntryFromRow(row));
    }),
    put: (storageInput) => putImpl(storageInput.owner, storageInput.collection, storageInput.key, storageInput.data),
    putMany: (storageInput) => putManyImpl(storageInput.owner, storageInput.entries),
    remove: (storageInput) => removeImpl(storageInput.owner, storageInput.collection, storageInput.key),
    removeMany: (storageInput) => removeManyImpl(storageInput.owner, storageInput.entries)
  };
};
var approvalArgumentPreview = (args) => {
  const text = JSON.stringify(args ?? {}, null, 2) ?? "null";
  return text.length > MAX_APPROVAL_ARGUMENT_PREVIEW_CHARS ? `${text.slice(0, MAX_APPROVAL_ARGUMENT_PREVIEW_CHARS)}...` : text;
};
var EXECUTOR_INTEGRATION_ID = "executor";
var EXECUTOR_INTEGRATION = {
  id: EXECUTOR_INTEGRATION_ID,
  kind: "built-in",
  name: "Executor",
  canRemove: false,
  canRefresh: false,
  canEdit: false,
  tools: []
};
var isReadonlyRecord = (value) => typeof value === "object" && value !== null;
var staticToolSchemaRoot = (schema2, side) => {
  if (!schema2) return void 0;
  const standard = isReadonlyRecord(schema2) ? schema2["~standard"] : void 0;
  if (!isReadonlyRecord(standard)) return schema2;
  const jsonSchema = standard["jsonSchema"];
  if (!isReadonlyRecord(jsonSchema)) return schema2;
  const materialize = jsonSchema[side];
  return typeof materialize === "function" ? materialize({ target: "draft-07" }) : jsonSchema;
};
var createExecutor = (config) => Effect11.gen(function* () {
  const defaultPlugins = () => {
    const empty = [];
    return empty;
  };
  const { plugins: userPlugins = defaultPlugins() } = config;
  const tenant = String(config.tenant);
  const subject = config.subject != null ? String(config.subject) : null;
  const ownerBinding = {
    tenant: config.tenant,
    subject: config.subject ?? null
  };
  const ownedKeys = (owner) => {
    if (owner === "org") return { tenant, owner, subject: ORG_SUBJECT };
    if (subject == null) {
      throw new StorageError({
        message: `Cannot target owner "user": executor has no subject.`,
        cause: void 0
      });
    }
    return { tenant, owner, subject };
  };
  const requireUserSubject = (owner) => owner === "user" && subject == null ? Effect11.fail(
    new StorageError({
      message: `Cannot target owner "user": executor has no subject.`,
      cause: void 0
    })
  ) : Effect11.void;
  const plugins = config.coreTools ? [
    coreToolsPlugin({
      webBaseUrl: config.coreTools.webBaseUrl,
      orgSlug: config.coreTools.orgSlug,
      includeProviders: config.coreTools.includeProviders
    }),
    ...userPlugins
  ] : userPlugins;
  const tables = yield* Effect11.try({
    try: () => collectTables(),
    catch: (cause) => storageFailureFromUnknown("Failed to collect executor tables", cause)
  });
  const dbInput = yield* Effect11.suspend(() => {
    if (!config.db) return Effect11.succeed(createDefaultMemoryDb(tables));
    if (typeof config.db !== "function") return Effect11.succeed(config.db);
    const out = config.db({ tables });
    return Effect11.isEffect(out) ? out : Effect11.succeed(out);
  });
  const rootDbUntyped = "db" in dbInput ? dbInput.db : dbInput;
  const closeDb = "db" in dbInput ? dbInput.close : void 0;
  yield* Effect11.try({
    try: () => {
      validateExecutorDbTables(tables, rootDbUntyped.internal.tables);
      validateExecutorOwnerPolicyTables(rootDbUntyped.internal.tables);
    },
    catch: (cause) => storageFailureFromUnknown("Failed to validate executor tables", cause)
  });
  const ownerContext = { tenant, subject };
  const rootDb = withQueryContext(rootDbUntyped, ownerContext);
  const fuma = makeFumaClient(rootDb);
  const core = makeCoreDb(fuma);
  const blobs = config.blobs ?? makeFumaBlobStore(fuma);
  const transaction = (effect) => fuma.transaction(effect);
  const staticTools = /* @__PURE__ */ new Map();
  const runtimes = /* @__PURE__ */ new Map();
  let activeToolPolicyProvider = null;
  const credentialProviders = /* @__PURE__ */ new Map();
  const credentialProviderOrder = [];
  const staticToolOwner = () => subject == null ? "org" : "user";
  const staticToolConnection = (integration) => ConnectionName.make(integration.id === EXECUTOR_INTEGRATION_ID ? "coreTools" : "static");
  const staticIntegrations = () => {
    const byId = /* @__PURE__ */ new Map();
    for (const entry of staticTools.values()) {
      if (!byId.has(entry.integration.id)) byId.set(entry.integration.id, entry.integration);
    }
    return [...byId.values()];
  };
  const staticDeclToIntegration = (integration) => ({
    slug: IntegrationSlug.make(integration.id),
    name: integration.name,
    description: integration.name,
    kind: integration.kind,
    canRemove: integration.canRemove ?? false,
    canRefresh: integration.canRefresh ?? false,
    authMethods: []
  });
  const staticToolToTool = (entry) => ({
    address: ToolAddress.make(`${entry.integration.id}.${entry.tool.name}`),
    owner: staticToolOwner(),
    integration: IntegrationSlug.make(entry.integration.id),
    connection: staticToolConnection(entry.integration),
    name: ToolName.make(entry.tool.name),
    pluginId: entry.pluginId,
    description: entry.tool.description,
    inputSchema: staticToolSchemaRoot(entry.tool.inputSchema, "input"),
    outputSchema: staticToolSchemaRoot(entry.tool.outputSchema, "output"),
    annotations: entry.tool.annotations,
    static: true
  });
  const registerCredentialProvider = (provider, sourceLabel) => {
    const key = String(provider.key);
    if (credentialProviders.has(key)) {
      return Effect11.fail(
        new StorageError({
          message: `Duplicate credential provider key: ${key} (from ${sourceLabel})`,
          cause: void 0
        })
      );
    }
    credentialProviders.set(key, provider);
    credentialProviderOrder.push(key);
    return Effect11.void;
  };
  for (const provider of config.providers ?? []) {
    yield* registerCredentialProvider(provider, "config");
  }
  const defaultWritableProvider = () => {
    for (const key of credentialProviderOrder) {
      const provider = credentialProviders.get(key);
      if (provider?.writable) return provider;
    }
    return null;
  };
  const extensions = {};
  const byOwner = (owner) => (b) => {
    const keys = owner === "org" ? ORG_SUBJECT : subject ?? "__none__";
    return b.and(b("owner", "=", owner), b("subject", "=", keys));
  };
  const findConnectionRow = (ref) => core.findFirst("connection", {
    where: (b) => b.and(
      byOwner(ref.owner)(b),
      b("integration", "=", String(ref.integration)),
      b("name", "=", String(ref.name))
    )
  });
  const refreshInFlight = /* @__PURE__ */ new Map();
  const connectionKey = (row) => `${row.owner}:${row.subject}:${row.integration}:${row.name}`;
  const loadOAuthClientRow = (owner, slug) => core.findFirst("oauth_client", {
    where: (b) => b.and(byOwner(owner)(b), b("slug", "=", slug))
  });
  const performTokenRefresh = (row, provider) => Effect11.gen(function* () {
    const owner = row.owner;
    const reauth = (message) => new CredentialResolutionError({
      owner,
      integration: IntegrationSlug.make(row.integration),
      name: ConnectionName.make(row.name),
      message,
      reauthRequired: true
    });
    const clientOwner = row.oauth_client_owner ?? row.owner;
    const clientRow = yield* loadOAuthClientRow(clientOwner, String(row.oauth_client));
    if (!clientRow) {
      return yield* reauth(`OAuth client "${row.oauth_client}" is no longer registered.`);
    }
    const clientSecret = clientRow.client_secret_item_id ? (yield* provider.get(ProviderItemId.make(String(clientRow.client_secret_item_id)))) ?? "" : "";
    const grantedScopes = row.oauth_scope ? String(row.oauth_scope).split(/\s+/).filter(Boolean) : [];
    const tokenUrl = row.oauth_token_url ? String(row.oauth_token_url) : String(clientRow.token_url);
    const token = String(clientRow.grant) === "client_credentials" ? yield* exchangeClientCredentials({
      tokenUrl,
      clientId: String(clientRow.client_id),
      clientSecret,
      scopes: grantedScopes,
      resource: clientRow.resource ? String(clientRow.resource) : void 0,
      endpointUrlPolicy: config.oauthEndpointUrlPolicy,
      fetch: config.fetch
    }).pipe(
      // A client_credentials failure is never a rotated-refresh-token
      // problem, so do NOT map invalid_grant → reauth. Surface as a
      // StorageError; the in-flight gate clears on settle, so the next
      // invoke retries (handles transient AS/network blips).
      Effect11.mapError(
        (cause) => new StorageError({
          // oxlint-disable-next-line executor/no-unknown-error-message -- boundary: OAuth2Error carries a typed `message`
          message: `Client-credentials token request failed: ${cause.message}`,
          cause
        })
      )
    ) : yield* Effect11.gen(function* () {
      if (!row.refresh_item_id) {
        return yield* reauth("No refresh token is stored for this connection.");
      }
      const refreshToken = yield* provider.get(ProviderItemId.make(row.refresh_item_id));
      if (!refreshToken) {
        return yield* reauth("Stored refresh token could not be resolved.");
      }
      return yield* refreshAccessToken({
        tokenUrl,
        clientId: String(clientRow.client_id),
        clientSecret,
        refreshToken,
        scopes: grantedScopes,
        // RFC 8707: keep the re-minted token bound to the same resource
        // (MCP servers require this on refresh).
        resource: clientRow.resource ? String(clientRow.resource) : void 0,
        endpointUrlPolicy: config.oauthEndpointUrlPolicy,
        fetch: config.fetch
      }).pipe(
        Effect11.mapError(
          (cause) => cause.error === "invalid_grant" ? reauth(
            // oxlint-disable-next-line executor/no-unknown-error-message -- boundary: OAuth2Error carries a typed `message`
            `OAuth token refresh was rejected (invalid_grant): ${cause.message}`
          ) : new StorageError({
            // oxlint-disable-next-line executor/no-unknown-error-message -- boundary: OAuth2Error carries a typed `message`
            message: `OAuth token refresh failed: ${cause.message}`,
            cause
          })
        )
      );
    });
    if (provider.set) {
      const tokenItemId = connectionItemIds(row)[PRIMARY_INPUT_VARIABLE] ?? `connection:${row.owner}:${row.integration}:${row.name}:${PRIMARY_INPUT_VARIABLE}`;
      yield* provider.set(ProviderItemId.make(tokenItemId), token.access_token);
      if (token.refresh_token && row.refresh_item_id) {
        yield* provider.set(ProviderItemId.make(row.refresh_item_id), token.refresh_token);
      }
    }
    const nextExpiresAt = typeof token.expires_in === "number" ? Date.now() + token.expires_in * 1e3 : null;
    const set = {
      expires_at: nextExpiresAt,
      updated_at: /* @__PURE__ */ new Date()
    };
    if (token.scope !== void 0) set.oauth_scope = token.scope;
    yield* core.updateMany("connection", {
      where: (b) => b.and(
        byOwner(owner)(b),
        b("integration", "=", String(row.integration)),
        b("name", "=", String(row.name))
      ),
      set
    });
    return token.access_token;
  });
  const refreshConnectionToken = (row, provider) => (
    // Share a single refresh per connection so concurrent resolves of the same
    // connection all await one refresh-token grant (the AS rotates the refresh
    // token; parallel grants would race on a consumed token — v1's refresh
    // deferred-map). The gate is cleared once the refresh settles so a later
    // expiry can refresh again.
    Effect11.gen(function* () {
      const key = connectionKey(row);
      const existing = refreshInFlight.get(key);
      if (existing) return yield* existing;
      const memoized = yield* Effect11.cached(performTokenRefresh(row, provider));
      const gated = memoized.pipe(
        Effect11.ensuring(Effect11.sync(() => refreshInFlight.delete(key)))
      );
      const winner = refreshInFlight.get(key) ?? gated;
      if (winner === gated) refreshInFlight.set(key, gated);
      return yield* winner;
    })
  );
  const resolveConnectionValues = (row) => Effect11.gen(function* () {
    const provider = credentialProviders.get(row.provider);
    if (!provider) {
      return yield* new CredentialProviderNotRegisteredError({
        provider: ProviderKey.make(row.provider)
      });
    }
    const expiresAt = row.expires_at == null ? null : Number(row.expires_at);
    if (row.oauth_client != null && shouldRefreshToken({ expiresAt })) {
      const access = yield* refreshConnectionToken(row, provider);
      return { [PRIMARY_INPUT_VARIABLE]: access };
    }
    const out = {};
    for (const [variable, itemId] of Object.entries(connectionItemIds(row))) {
      out[variable] = yield* provider.get(ProviderItemId.make(itemId));
    }
    return out;
  }).pipe(
    // CredentialProviderNotRegisteredError is part of CredentialResolution
    // for ctx.connections.resolveValue's StorageFailure channel — fold it.
    Effect11.catchTag(
      "CredentialProviderNotRegisteredError",
      (err) => Effect11.fail(
        new StorageError({
          message: `Credential provider "${err.provider}" is not registered.`,
          cause: err
        })
      )
    )
  );
  const resolveConnectionValue = (row) => resolveConnectionValues(row).pipe(
    Effect11.map((values) => values[PRIMARY_INPUT_VARIABLE] ?? null)
  );
  const foldResolutionFailure = (effect) => effect.pipe(
    Effect11.catchTag(
      "CredentialResolutionError",
      (err) => Effect11.fail(
        new StorageError({
          // oxlint-disable-next-line executor/no-unknown-error-message -- boundary: CredentialResolutionError carries a typed `message` field
          message: err.message,
          cause: err
        })
      )
    )
  );
  const resolveConnectionValueByRef = (ref) => foldResolutionFailure(
    Effect11.gen(function* () {
      const row = yield* findConnectionRow(ref);
      if (!row) return null;
      return yield* resolveConnectionValue(row);
    })
  );
  const resolveConnectionValuesByRef = (ref) => foldResolutionFailure(
    Effect11.gen(function* () {
      const row = yield* findConnectionRow(ref);
      if (!row) return {};
      return yield* resolveConnectionValues(row);
    })
  );
  const findIntegrationRow = (slug) => core.findFirst("integration", {
    where: (b) => b("slug", "=", String(slug))
  });
  const describeAuthMethodsForRow = (row) => {
    const runtime = runtimes.get(row.plugin_id);
    const describe = runtime?.plugin.describeAuthMethods;
    if (!describe) return [];
    const record = rowToIntegrationRecord(row);
    try {
      return describe(record);
    } catch {
      return [];
    }
  };
  const describeDisplayForRow = (row) => {
    const runtime = runtimes.get(row.plugin_id);
    const describe = runtime?.plugin.describeIntegrationDisplay;
    if (!describe) return {};
    const record = rowToIntegrationRecord(row);
    try {
      const display = describe(record);
      return {
        ...display.url && display.url.length > 0 ? { url: display.url } : {},
        ...display.family && display.family.length > 0 ? { family: display.family } : {}
      };
    } catch {
      return {};
    }
  };
  const describeHealthCheckForRow = (row) => Option5.getOrNull(decodeHealthCheckSpec(row.health_check));
  const foldPluginFailure = (effect, message) => effect.pipe(
    Effect11.catch(
      (cause) => isStorageFailure(cause) ? Effect11.fail(cause) : Effect11.fail(new StorageError({ message, cause }))
    )
  );
  const integrationsList = () => Effect11.gen(function* () {
    const rows = yield* core.findMany("integration", {});
    const staticIntegrationList = staticIntegrations().map(staticDeclToIntegration);
    const dbIntegrations = rows.map(
      (row) => rowToIntegration(row, describeAuthMethodsForRow(row), describeDisplayForRow(row))
    );
    if (!activeToolPolicyProvider) return [...staticIntegrationList, ...dbIntegrations];
    const visibleTools = yield* toolsList({ includeAnnotations: false });
    const visibleIntegrationSlugs = new Set(
      visibleTools.filter((tool2) => !tool2.static).map((tool2) => String(tool2.integration))
    );
    return [
      ...staticIntegrationList,
      ...dbIntegrations.filter(
        (integration) => visibleIntegrationSlugs.has(String(integration.slug))
      )
    ];
  });
  const integrationsGet = (slug) => Effect11.gen(function* () {
    const staticIntegration = staticIntegrations().find(
      (integration) => integration.id === String(slug)
    );
    if (staticIntegration) return staticDeclToIntegration(staticIntegration);
    const row = yield* findIntegrationRow(slug);
    return row ? rowToIntegration(row, describeAuthMethodsForRow(row), describeDisplayForRow(row)) : null;
  });
  const integrationsGetRecord = (slug) => findIntegrationRow(slug).pipe(
    Effect11.map(
      (row) => row ? rowToIntegrationRecord(row, describeAuthMethodsForRow(row)) : null
    )
  );
  const integrationsRegister = (pluginId, input) => transaction(
    Effect11.gen(function* () {
      const now = /* @__PURE__ */ new Date();
      const existing = yield* findIntegrationRow(input.slug);
      const config2 = input.config === void 0 ? null : input.config;
      if (existing) {
        yield* core.updateMany("integration", {
          where: (b) => b("slug", "=", String(input.slug)),
          set: {
            plugin_id: pluginId,
            name: input.name ?? existing.name ?? null,
            description: input.description,
            config: config2,
            can_remove: input.canRemove ?? Boolean(existing.can_remove),
            can_refresh: input.canRefresh ?? Boolean(existing.can_refresh),
            updated_at: now
          }
        });
        return;
      }
      yield* core.create("integration", {
        tenant,
        slug: String(input.slug),
        plugin_id: pluginId,
        name: input.name ?? null,
        description: input.description,
        config: config2,
        can_remove: input.canRemove ?? true,
        can_refresh: input.canRefresh ?? false,
        created_at: now,
        updated_at: now
      });
    })
  );
  const integrationsUpdate = (slug, patch) => Effect11.gen(function* () {
    const now = /* @__PURE__ */ new Date();
    const set = { updated_at: now };
    if (patch.name !== void 0) set.name = patch.name;
    if (patch.description !== void 0) set.description = patch.description;
    if (patch.config !== void 0) {
      set.config = patch.config;
      set.config_revised_at = now.getTime();
    }
    yield* core.updateMany("integration", {
      where: (b) => b("slug", "=", String(slug)),
      set
    });
  });
  const integrationsUpdatePublic = (slug, patch) => Effect11.gen(function* () {
    const existing = yield* findIntegrationRow(slug);
    if (!existing) return yield* new IntegrationNotFoundError({ slug });
    yield* integrationsUpdate(slug, patch);
  });
  const integrationsRemove = (slug) => transaction(
    Effect11.gen(function* () {
      const existing = yield* findIntegrationRow(slug);
      if (!existing) return;
      if (!existing.can_remove) {
        return yield* new IntegrationRemovalNotAllowedError({ slug });
      }
      const runtime = runtimes.get(existing.plugin_id);
      if (runtime?.plugin.removeIntegration) {
        yield* runtime.plugin.removeIntegration({
          ctx: runtime.ctx,
          integration: rowToIntegrationRecord(existing, describeAuthMethodsForRow(existing))
        }).pipe(
          Effect11.mapError(
            (cause) => pluginStorageFailure(existing.plugin_id, "removeIntegration", cause)
          )
        );
      }
      const where = (b) => b("integration", "=", String(slug));
      yield* core.deleteMany("tool", { where });
      yield* core.deleteMany("definition", { where });
      yield* core.deleteMany("connection", { where });
      yield* core.deleteMany("integration", {
        where: (b) => b("slug", "=", String(slug))
      });
    })
  );
  const integrationsDetect = (url) => Effect11.gen(function* () {
    const results = [];
    for (const runtime of runtimes.values()) {
      if (!runtime.plugin.detect) continue;
      const result = yield* runtime.plugin.detect({ ctx: runtime.ctx, url }).pipe(
        Effect11.mapError((cause) => pluginStorageFailure(runtime.plugin.id, "detect", cause))
      );
      if (result) results.push(result);
    }
    return results;
  });
  const integrationHealthCheckGet = (slug) => findIntegrationRow(slug).pipe(
    Effect11.map((row) => row ? describeHealthCheckForRow(row) : null)
  );
  const integrationHealthCheckCandidates = (slug) => Effect11.gen(function* () {
    const row = yield* findIntegrationRow(slug);
    if (!row) return yield* new IntegrationNotFoundError({ slug });
    const runtime = runtimes.get(row.plugin_id);
    const list = runtime?.plugin.listHealthCheckCandidates;
    if (!runtime || !list) return [];
    const record = rowToIntegrationRecord(row, describeAuthMethodsForRow(row));
    return yield* foldPluginFailure(
      list({ ctx: runtime.ctx, integration: record }),
      `Listing health-check candidates for "${slug}" failed.`
    );
  });
  const integrationSetHealthCheck = (slug, spec) => Effect11.gen(function* () {
    const row = yield* findIntegrationRow(slug);
    if (!row) return yield* new IntegrationNotFoundError({ slug });
    yield* core.updateMany("integration", {
      where: (b) => b("slug", "=", String(slug)),
      set: { health_check: spec, updated_at: /* @__PURE__ */ new Date() }
    });
  });
  const toolSyncHealthDetailPrefix = "Tool sync failing";
  const toolSyncHealth = (reason) => ({
    status: "degraded",
    checkedAt: Date.now(),
    detail: `${toolSyncHealthDetailPrefix}: ${reason}`
  });
  const syncHealthReason = (result) => result.incompleteReason ?? "plugin returned an incomplete tool catalog";
  const produceConnectionTools = (integrationRow, ref, mode = "explicit") => Effect11.gen(function* () {
    const runtime = runtimes.get(integrationRow.plugin_id);
    const keys = yield* Effect11.try({
      try: () => ownedKeys(ref.owner),
      catch: (cause) => storageFailureFromUnknown("invalid owner", cause)
    });
    const owner = ref.owner;
    const where = (b) => b.and(
      byOwner(owner)(b),
      b("integration", "=", String(ref.integration)),
      b("connection", "=", String(ref.name))
    );
    const connectionWhere = (b) => b.and(
      byOwner(owner)(b),
      b("integration", "=", String(ref.integration)),
      b("name", "=", String(ref.name))
    );
    const isToolSyncHealth = (health) => health?.detail?.startsWith(toolSyncHealthDetailPrefix) === true;
    const syncedSet = (row) => {
      const health = row ? Option5.getOrNull(decodeLastHealth(row.last_health)) : null;
      return isToolSyncHealth(health) ? { tools_synced_at: Date.now(), last_health: null, updated_at: /* @__PURE__ */ new Date() } : { tools_synced_at: Date.now() };
    };
    const stampSynced = (row) => core.updateMany("connection", {
      where: connectionWhere,
      set: syncedSet(row)
    });
    const stampSyncedWithHealth = (reason) => core.updateMany("connection", {
      where: connectionWhere,
      set: {
        tools_synced_at: Date.now(),
        last_health: toolSyncHealth(reason),
        updated_at: /* @__PURE__ */ new Date()
      }
    });
    const existingRow = yield* findConnectionRow(ref);
    if (existingRow && existingRow.oauth_client == null && existingRow.template !== String(NO_AUTH_TEMPLATE) && Object.keys(connectionItemIds(existingRow)).length === 0) {
      yield* transaction(
        Effect11.gen(function* () {
          yield* core.deleteMany("tool", { where });
          yield* core.deleteMany("definition", { where });
          yield* stampSynced(existingRow);
        })
      );
      return [];
    }
    if (!runtime?.plugin.resolveTools) {
      yield* transaction(
        Effect11.gen(function* () {
          yield* core.deleteMany("tool", { where });
          yield* core.deleteMany("definition", { where });
          yield* stampSynced(existingRow);
        })
      );
      return [];
    }
    const result = yield* runtime.plugin.resolveTools({
      ctx: runtime.ctx,
      integration: rowToIntegration(integrationRow),
      config: decodeJsonColumn(integrationRow.config),
      httpClientLayer: runtime.ctx.httpClientLayer,
      connection: ref,
      template: existingRow ? AuthTemplateSlug.make(existingRow.template) : null,
      storage: runtime.storage,
      getValue: () => resolveConnectionValueByRef(ref),
      getValues: () => resolveConnectionValuesByRef(ref)
    }).pipe(
      Effect11.mapError(
        (cause) => pluginStorageFailure(integrationRow.plugin_id, "resolveTools", cause)
      )
    );
    if (result.incomplete === true) {
      const reason = syncHealthReason(result);
      yield* stampSyncedWithHealth(reason);
      yield* Effect11.logWarning("executor tool sync preserved catalog", {
        reason,
        integration: String(ref.integration),
        connection: String(ref.name)
      });
      const keptRows = yield* core.findMany("tool", { where });
      return keptRows.map((row) => rowToTool(row));
    }
    if (mode === "background" && runtime.plugin.remoteToolCatalog === true && result.tools.length === 0) {
      const keptRows = yield* core.findMany("tool", { where });
      if (keptRows.length > 0) {
        const reason = "background tool sync produced an authoritative empty catalog for a connection with existing tools";
        yield* stampSyncedWithHealth(reason);
        yield* Effect11.logWarning("executor tool sync preserved nonzero catalog", {
          reason,
          integration: String(ref.integration),
          connection: String(ref.name),
          existingToolCount: keptRows.length
        });
        return keptRows.map((row) => rowToTool(row));
      }
    }
    const now = /* @__PURE__ */ new Date();
    const toolRows = result.tools.map((tool2) => ({
      tenant: keys.tenant,
      owner: keys.owner,
      subject: keys.subject,
      integration: String(ref.integration),
      connection: String(ref.name),
      plugin_id: integrationRow.plugin_id,
      name: String(tool2.name),
      description: tool2.description ?? "",
      input_schema: tool2.inputSchema ?? null,
      output_schema: tool2.outputSchema ?? null,
      annotations: tool2.annotations ?? null,
      created_at: now,
      updated_at: now
    }));
    const definitionRows = Object.entries(result.definitions ?? {}).map(([name, schema2]) => ({
      tenant: keys.tenant,
      owner: keys.owner,
      subject: keys.subject,
      integration: String(ref.integration),
      connection: String(ref.name),
      plugin_id: integrationRow.plugin_id,
      name,
      schema: schema2,
      created_at: now
    }));
    yield* transaction(
      Effect11.gen(function* () {
        yield* core.deleteMany("tool", { where });
        yield* core.deleteMany("definition", { where });
        yield* core.createMany("tool", toolRows);
        yield* core.createMany("definition", definitionRows);
        yield* stampSynced(existingRow);
      })
    );
    return result.tools.map(
      (tool2) => rowToTool(
        {
          tenant: keys.tenant,
          owner: keys.owner,
          subject: keys.subject,
          integration: String(ref.integration),
          connection: String(ref.name),
          plugin_id: integrationRow.plugin_id,
          name: String(tool2.name),
          description: tool2.description ?? "",
          input_schema: tool2.inputSchema ?? null,
          output_schema: tool2.outputSchema ?? null,
          annotations: tool2.annotations ?? null,
          created_at: now,
          updated_at: now
        },
        tool2.annotations
      )
    );
  });
  const connectionsCreate = (input) => Effect11.gen(function* () {
    const name = connectionIdentifier(String(input.name));
    if (input.owner === "user" && subject == null) {
      return yield* new InvalidConnectionInputError({
        message: 'Cannot create a personal connection: this context has no user subject. Create it with owner "org", or connect as a signed-in user.'
      });
    }
    const integrationRow = yield* findIntegrationRow(input.integration);
    if (!integrationRow) {
      return yield* new IntegrationNotFoundError({
        slug: input.integration
      });
    }
    const inputs = normalizeConnectionInputs(input);
    const pasted = inputs.filter((i) => "value" in i.origin);
    const external = inputs.filter((i) => "from" in i.origin);
    const isNoAuth = String(input.template) === String(NO_AUTH_TEMPLATE);
    if (inputs.length === 0 && !isNoAuth) {
      return yield* new InvalidConnectionInputError({
        message: "A connection must supply at least one credential input."
      });
    }
    let providerKey;
    const itemIds = {};
    if (external.length > 0 && pasted.length > 0) {
      return yield* new InvalidConnectionInputError({
        message: "A connection cannot mix pasted and external-provider inputs."
      });
    }
    if (external.length > 0) {
      const providers2 = new Set(
        external.map((i) => "from" in i.origin ? String(i.origin.from.provider) : "")
      );
      if (providers2.size > 1) {
        return yield* new InvalidConnectionInputError({
          message: "A connection's inputs must all use the same external provider."
        });
      }
      const [only] = [...providers2];
      const provider = credentialProviders.get(only ?? "");
      if (!provider) {
        return yield* new CredentialProviderNotRegisteredError({
          provider: ProviderKey.make(only ?? "")
        });
      }
      providerKey = only ?? "";
      for (const i of external) {
        if ("from" in i.origin) itemIds[i.variable] = String(i.origin.from.id);
      }
    } else {
      const provider = defaultWritableProvider();
      if (!provider) {
        return yield* new CredentialProviderNotRegisteredError({
          provider: ProviderKey.make("default")
        });
      }
      providerKey = String(provider.key);
      for (const i of pasted) {
        const itemId = `connection:${input.owner}:${input.integration}:${name}:${i.variable}`;
        if ("value" in i.origin && provider.set) {
          yield* provider.set(ProviderItemId.make(itemId), i.origin.value);
        }
        itemIds[i.variable] = itemId;
      }
    }
    const keys = yield* Effect11.try({
      try: () => ownedKeys(input.owner),
      catch: (cause) => storageFailureFromUnknown("invalid owner", cause)
    });
    const now = /* @__PURE__ */ new Date();
    yield* transaction(
      Effect11.gen(function* () {
        const existing = yield* findConnectionRow({
          owner: input.owner,
          integration: input.integration,
          name
        });
        const set = {
          template: String(input.template),
          provider: providerKey,
          item_ids: itemIds,
          identity_label: input.identityLabel ?? null,
          // Re-saving a credential keeps an existing curated description
          // unless the caller explicitly provides one.
          ...input.description !== void 0 ? { description: input.description } : {},
          updated_at: now
        };
        if (existing) {
          yield* core.updateMany("connection", {
            where: (b) => b.and(
              byOwner(input.owner)(b),
              b("integration", "=", String(input.integration)),
              b("name", "=", String(name))
            ),
            set
          });
        } else {
          yield* core.create("connection", {
            tenant: keys.tenant,
            owner: keys.owner,
            subject: keys.subject,
            integration: String(input.integration),
            name: String(name),
            template: String(input.template),
            provider: providerKey,
            item_ids: itemIds,
            identity_label: input.identityLabel ?? null,
            description: input.description ?? null,
            oauth_client: null,
            refresh_item_id: null,
            expires_at: null,
            oauth_scope: null,
            provider_state: null,
            created_at: now,
            updated_at: now
          });
        }
      })
    );
    const ref = {
      owner: input.owner,
      integration: input.integration,
      name
    };
    yield* produceConnectionTools(integrationRow, ref).pipe(
      Effect11.catchTag("IntegrationNotFoundError", () => Effect11.succeed([]))
    );
    const row = yield* findConnectionRow(ref);
    return row ? rowToConnection(row) : rowToConnection({
      tenant: keys.tenant,
      owner: keys.owner,
      subject: keys.subject,
      integration: String(input.integration),
      name: String(name),
      template: String(input.template),
      provider: providerKey,
      item_ids: itemIds,
      identity_label: input.identityLabel ?? null,
      description: input.description ?? null,
      oauth_client: null,
      refresh_item_id: null,
      expires_at: null,
      oauth_scope: null,
      provider_state: null,
      created_at: now,
      updated_at: now
    });
  });
  const mintOAuthConnection = (input) => Effect11.gen(function* () {
    const name = connectionIdentifier(String(input.name));
    yield* requireUserSubject(input.owner);
    const integrationRow = yield* findIntegrationRow(input.integration);
    if (!integrationRow) {
      return yield* new StorageError({
        message: `Integration not found: ${input.integration}`,
        cause: void 0
      });
    }
    const keys = yield* Effect11.try({
      try: () => ownedKeys(input.owner),
      catch: (cause) => storageFailureFromUnknown("invalid owner", cause)
    });
    const now = /* @__PURE__ */ new Date();
    const ref = {
      owner: input.owner,
      integration: input.integration,
      name
    };
    yield* transaction(
      Effect11.gen(function* () {
        const existing = yield* findConnectionRow(ref);
        const set = {
          template: String(input.template),
          provider: input.provider,
          item_ids: { [PRIMARY_INPUT_VARIABLE]: input.itemId },
          identity_label: input.identityLabel ?? null,
          oauth_client: String(input.oauthClient),
          oauth_client_owner: input.oauthClientOwner,
          refresh_item_id: input.refreshItemId,
          expires_at: input.expiresAt,
          oauth_scope: input.oauthScope,
          oauth_token_url: input.oauthTokenUrl ?? null,
          provider_state: input.missingOAuthScopes && input.missingOAuthScopes.length > 0 ? { missingOAuthScopes: input.missingOAuthScopes } : null,
          updated_at: now
        };
        if (existing) {
          yield* core.updateMany("connection", {
            where: (b) => b.and(
              byOwner(input.owner)(b),
              b("integration", "=", String(input.integration)),
              b("name", "=", String(name))
            ),
            set
          });
        } else {
          yield* core.create("connection", {
            tenant: keys.tenant,
            owner: keys.owner,
            subject: keys.subject,
            integration: String(input.integration),
            name: String(name),
            template: String(input.template),
            provider: input.provider,
            item_ids: { [PRIMARY_INPUT_VARIABLE]: input.itemId },
            identity_label: input.identityLabel ?? null,
            // Curated description: never stamped by a mint — a reconnect
            // or token refresh must not erase what the user wrote.
            description: null,
            oauth_client: String(input.oauthClient),
            oauth_client_owner: input.oauthClientOwner,
            refresh_item_id: input.refreshItemId,
            expires_at: input.expiresAt,
            oauth_scope: input.oauthScope,
            oauth_token_url: input.oauthTokenUrl ?? null,
            provider_state: input.missingOAuthScopes && input.missingOAuthScopes.length > 0 ? { missingOAuthScopes: input.missingOAuthScopes } : null,
            created_at: now,
            updated_at: now
          });
        }
      })
    );
    yield* produceConnectionTools(integrationRow, ref).pipe(
      Effect11.catchTag("IntegrationNotFoundError", () => Effect11.succeed([]))
    );
    const row = yield* findConnectionRow(ref);
    return row ? rowToConnection(row) : rowToConnection({
      tenant: keys.tenant,
      owner: keys.owner,
      subject: keys.subject,
      integration: String(input.integration),
      name: String(name),
      template: String(input.template),
      provider: input.provider,
      item_ids: { [PRIMARY_INPUT_VARIABLE]: input.itemId },
      identity_label: input.identityLabel ?? null,
      description: null,
      oauth_client: String(input.oauthClient),
      oauth_client_owner: input.oauthClientOwner,
      refresh_item_id: input.refreshItemId,
      expires_at: input.expiresAt,
      oauth_scope: input.oauthScope,
      oauth_token_url: input.oauthTokenUrl ?? null,
      provider_state: input.missingOAuthScopes && input.missingOAuthScopes.length > 0 ? { missingOAuthScopes: input.missingOAuthScopes } : null,
      created_at: now,
      updated_at: now
    });
  });
  const connectionsList = (filter) => Effect11.gen(function* () {
    const rows = yield* core.findMany("connection", {
      where: (b) => b.and(
        filter?.integration === void 0 ? true : b("integration", "=", String(filter.integration)),
        filter?.owner === void 0 ? true : b("owner", "=", filter.owner)
      )
    });
    const connections = rows.map(rowToConnection);
    if (!activeToolPolicyProvider) return connections;
    const visibleTools = yield* toolsList({ includeAnnotations: false });
    const visibleConnectionKeys = new Set(
      visibleTools.filter((tool2) => !tool2.static).map((tool2) => `${tool2.owner}:${tool2.integration}:${tool2.connection}`)
    );
    return connections.filter(
      (connection) => visibleConnectionKeys.has(
        `${connection.owner}:${connection.integration}:${connection.name}`
      )
    );
  });
  const connectionsGet = (ref) => findConnectionRow(ref).pipe(Effect11.map((row) => row ? rowToConnection(row) : null));
  const connectionsUpdate = (ref, input) => Effect11.gen(function* () {
    const row = yield* findConnectionRow(ref);
    if (!row) {
      return yield* new ConnectionNotFoundError({
        owner: ref.owner,
        integration: ref.integration,
        name: ref.name
      });
    }
    const set = { updated_at: /* @__PURE__ */ new Date() };
    if (input.description !== void 0) set.description = input.description;
    if (input.identityLabel !== void 0) set.identity_label = input.identityLabel;
    yield* core.updateMany("connection", {
      where: (b) => b.and(
        byOwner(ref.owner)(b),
        b("integration", "=", String(ref.integration)),
        b("name", "=", String(ref.name))
      ),
      set
    });
    const updated = yield* findConnectionRow(ref);
    return rowToConnection(updated ?? row);
  });
  const connectionsRemove = (ref) => transaction(
    Effect11.gen(function* () {
      const row = yield* findConnectionRow(ref);
      if (!row) {
        return yield* new ConnectionNotFoundError({
          owner: ref.owner,
          integration: ref.integration,
          name: ref.name
        });
      }
      const integrationRow = yield* findIntegrationRow(ref.integration);
      const runtime = integrationRow ? runtimes.get(integrationRow.plugin_id) : void 0;
      if (integrationRow && runtime?.plugin.removeConnection) {
        yield* runtime.plugin.removeConnection({
          ctx: runtime.ctx,
          integration: ref.integration,
          connection: ref
        }).pipe(
          Effect11.mapError(
            (cause) => pluginStorageFailure(integrationRow.plugin_id, "removeConnection", cause)
          )
        );
      }
      const where = (b) => b.and(
        byOwner(ref.owner)(b),
        b("integration", "=", String(ref.integration)),
        b("connection", "=", String(ref.name))
      );
      yield* core.deleteMany("tool", { where });
      yield* core.deleteMany("definition", { where });
      yield* core.deleteMany("connection", {
        where: (b) => b.and(
          byOwner(ref.owner)(b),
          b("integration", "=", String(ref.integration)),
          b("name", "=", String(ref.name))
        )
      });
    })
  );
  const connectionsRefresh = (ref) => Effect11.gen(function* () {
    const row = yield* findConnectionRow(ref);
    if (!row) {
      return yield* new ConnectionNotFoundError({
        owner: ref.owner,
        integration: ref.integration,
        name: ref.name
      });
    }
    const integrationRow = yield* findIntegrationRow(ref.integration);
    if (!integrationRow) {
      return yield* new IntegrationNotFoundError({ slug: ref.integration });
    }
    return yield* produceConnectionTools(integrationRow, ref);
  });
  const unknownHealth = () => ({ status: "unknown", checkedAt: Date.now() });
  const persistHealthResult = (ref, result) => core.updateMany("connection", {
    where: (b) => b.and(
      b("owner", "=", String(ref.owner)),
      b("integration", "=", String(ref.integration)),
      b("name", "=", String(ref.name))
    ),
    set: { last_health: result, updated_at: /* @__PURE__ */ new Date() }
  }).pipe(Effect11.ignore);
  const healthFromCredentialResolutionError = (err) => err.reauthRequired === true ? Effect11.succeed({
    status: "expired",
    checkedAt: Date.now(),
    // oxlint-disable-next-line executor/no-unknown-error-message -- boundary: CredentialResolutionError carries a typed `message` field
    detail: err.message
  }) : Effect11.fail(
    new StorageError({
      // oxlint-disable-next-line executor/no-unknown-error-message -- boundary: CredentialResolutionError carries a typed `message` field
      message: err.message,
      cause: err
    })
  );
  const healthFromCredentialResolutionFailure = (failure) => failure.reauthRequired === true ? {
    status: "expired",
    checkedAt: Date.now(),
    // oxlint-disable-next-line executor/no-unknown-error-message -- boundary: CredentialResolutionError carries a typed `message` field
    detail: failure.message
  } : {
    status: "degraded",
    checkedAt: Date.now(),
    // oxlint-disable-next-line executor/no-unknown-error-message -- boundary: CredentialResolutionError carries a typed `message` field
    detail: failure.message
  };
  const oauthCredentialHealthWithoutProbe = (row) => resolveConnectionValues(row).pipe(
    Effect11.as({
      status: "healthy",
      checkedAt: Date.now(),
      detail: "Credential resolved (no probe configured)."
    }),
    Effect11.catchTag(
      "CredentialResolutionError",
      (failure) => Effect11.succeed(healthFromCredentialResolutionFailure(failure))
    )
  );
  const resolveInFlightValues = (input) => Effect11.gen(function* () {
    const out = {};
    for (const { variable, origin } of normalizeConnectionInputs(input)) {
      if ("value" in origin) {
        out[variable] = origin.value;
        continue;
      }
      const provider = credentialProviders.get(String(origin.from.provider));
      if (!provider) {
        return yield* new StorageError({
          message: `Credential provider "${origin.from.provider}" is not registered.`,
          cause: void 0
        });
      }
      out[variable] = yield* provider.get(origin.from.id);
    }
    return out;
  });
  const connectionCheckHealth = (ref, options) => Effect11.gen(function* () {
    const connectionRow = yield* findConnectionRow(ref);
    if (!connectionRow) {
      return yield* new ConnectionNotFoundError({
        owner: ref.owner,
        integration: ref.integration,
        name: ref.name
      });
    }
    if (options?.ifStaleMs !== void 0) {
      const cached = Option5.getOrNull(decodeLastHealth(connectionRow.last_health));
      if (cached && Date.now() - cached.checkedAt < options.ifStaleMs) return cached;
    }
    const integrationRow = yield* findIntegrationRow(ref.integration);
    if (!integrationRow) {
      return yield* new IntegrationNotFoundError({ slug: ref.integration });
    }
    const runtime = runtimes.get(integrationRow.plugin_id);
    const check = runtime?.plugin.checkHealth;
    if (!runtime || !check) return unknownHealth();
    const spec = describeHealthCheckForRow(integrationRow) ?? void 0;
    if (spec === void 0 && connectionRow.oauth_client != null) {
      const result2 = yield* oauthCredentialHealthWithoutProbe(connectionRow);
      yield* persistHealthResult(ref, result2);
      return result2;
    }
    const result = yield* Effect11.gen(function* () {
      const values = yield* resolveConnectionValues(connectionRow);
      const record = rowToIntegrationRecord(
        integrationRow,
        describeAuthMethodsForRow(integrationRow)
      );
      const credential = {
        owner: connectionRow.owner,
        integration: ref.integration,
        connection: ConnectionName.make(connectionRow.name),
        template: AuthTemplateSlug.make(connectionRow.template),
        value: values[PRIMARY_INPUT_VARIABLE] ?? null,
        values,
        config: record.config
      };
      return yield* foldPluginFailure(
        check({ ctx: runtime.ctx, integration: record, credential, spec }),
        `Health check for connection "${ref.name}" failed.`
      );
    }).pipe(Effect11.catchTag("CredentialResolutionError", healthFromCredentialResolutionError));
    yield* persistHealthResult(ref, result);
    return result;
  });
  const connectionValidate = (input) => Effect11.gen(function* () {
    const integrationRow = yield* findIntegrationRow(input.integration);
    if (!integrationRow) {
      return yield* new IntegrationNotFoundError({ slug: input.integration });
    }
    const runtime = runtimes.get(integrationRow.plugin_id);
    const check = runtime?.plugin.checkHealth;
    if (!runtime || !check) return unknownHealth();
    const values = yield* resolveInFlightValues(input);
    const record = rowToIntegrationRecord(
      integrationRow,
      describeAuthMethodsForRow(integrationRow)
    );
    const credential = {
      owner: input.owner,
      integration: input.integration,
      // No connection exists yet (key-first); a synthetic name keeps the
      // credential shape whole. The probe authenticates on values+template,
      // not on this name (it only appears in upstream-error messages).
      connection: ConnectionName.make("(unsaved)"),
      template: input.template,
      value: values[PRIMARY_INPUT_VARIABLE] ?? null,
      values,
      config: record.config
    };
    const spec = input.spec ?? describeHealthCheckForRow(integrationRow) ?? void 0;
    return yield* foldPluginFailure(
      check({ ctx: runtime.ctx, integration: record, credential, spec }),
      `Validating credential for "${input.integration}" failed.`
    );
  });
  const connectionsMarkToolsStale = (ref) => core.updateMany("connection", {
    where: (b) => b.and(
      byOwner(ref.owner)(b),
      b("integration", "=", String(ref.integration)),
      b("name", "=", String(ref.name))
    ),
    set: { tools_synced_at: null }
  });
  const compareProviderPolicyRule = (a, b) => {
    if (a.position < b.position) return -1;
    if (a.position > b.position) return 1;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  };
  const resolveProviderPolicyFromRules = (toolId, rules4) => {
    for (const rule of [...rules4].sort(compareProviderPolicyRule)) {
      if (!matchPattern(rule.pattern, toolId)) continue;
      return {
        action: rule.action,
        source: "user",
        pattern: rule.pattern,
        policyId: rule.id
      };
    }
    return {
      action: "block",
      source: "user",
      pattern: "*"
    };
  };
  const listActivePolicyRuleSet = () => activeToolPolicyProvider ? (
    // Batched per-operation resolver: fetch all policy + connection state
    // once, then resolve every tool in this operation against that
    // snapshot. Avoids the per-tool resolve N+1 on the list surface.
    activeToolPolicyProvider.prepare ? activeToolPolicyProvider.prepare().pipe(Effect11.map((resolve) => ({ kind: "prepared", resolve }))) : activeToolPolicyProvider.resolve ? Effect11.succeed({
      kind: "provider",
      provider: activeToolPolicyProvider,
      rules: null
    }) : activeToolPolicyProvider.list().pipe(
      Effect11.map((rules4) => ({
        kind: "provider",
        provider: activeToolPolicyProvider,
        rules: rules4
      }))
    )
  ) : core.findMany("tool_policy", {}).pipe(Effect11.map((rows) => ({ kind: "global", rows })));
  const resolvePolicyFromRuleSet = (toolId, ruleSet, defaultRequiresApproval) => ruleSet.kind === "prepared" ? Effect11.succeed(ruleSet.resolve({ toolId, defaultRequiresApproval })) : ruleSet.kind === "provider" ? ruleSet.provider.resolve ? ruleSet.provider.resolve({ toolId, defaultRequiresApproval }) : Effect11.succeed(resolveProviderPolicyFromRules(toolId, ruleSet.rules ?? [])) : Effect11.succeed(
    resolveEffectivePolicy(
      toolId,
      ruleSet.rows,
      ownerRankForRow,
      defaultRequiresApproval
    )
  );
  const matchesToolFilter = (tool2, filter) => {
    if (!filter) return true;
    if (filter.integration !== void 0 && tool2.integration !== filter.integration) return false;
    if (filter.owner !== void 0 && tool2.owner !== filter.owner) return false;
    if (filter.connection !== void 0 && tool2.connection !== filter.connection) return false;
    if (filter.query !== void 0) {
      const q = filter.query.toLowerCase();
      const hay = `${tool2.name} ${tool2.description}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  };
  const toolsSyncTtlMs = config.toolsSyncTtlMs === void 0 ? DEFAULT_TOOLS_SYNC_TTL_MS : config.toolsSyncTtlMs;
  const syncStaleConnectionTools = Effect11.gen(function* () {
    const integrations = yield* core.findMany("integration", {});
    if (integrations.length === 0) return;
    const integrationBySlug = new Map(integrations.map((row) => [row.slug, row]));
    const anyRemoteCatalog = Array.from(runtimes.values()).some(
      (runtime) => runtime.plugin.remoteToolCatalog === true
    );
    const cutoff = toolsSyncTtlMs == null || !anyRemoteCatalog ? null : Date.now() - toolsSyncTtlMs;
    const latestRevision = integrations.reduce(
      (max, row) => row.config_revised_at == null ? max : Math.max(max ?? Number(row.config_revised_at), Number(row.config_revised_at)),
      null
    );
    const staleBefore = cutoff === null && latestRevision === null ? null : Math.max(cutoff ?? Number.MIN_SAFE_INTEGER, latestRevision ?? Number.MIN_SAFE_INTEGER);
    const connections = yield* core.findMany("connection", {
      where: (b) => staleBefore === null ? b.isNull("tools_synced_at") : b.or(b.isNull("tools_synced_at"), b("tools_synced_at", "<", staleBefore))
    });
    for (const connection of connections) {
      const integrationRow = integrationBySlug.get(connection.integration);
      if (!integrationRow) continue;
      const runtime = runtimes.get(integrationRow.plugin_id);
      if (!runtime) continue;
      const syncedAt = connection.tools_synced_at == null ? null : Number(connection.tools_synced_at);
      const revisedTime = integrationRow.config_revised_at == null ? null : Number(integrationRow.config_revised_at);
      const staleMarked = syncedAt === null;
      const configRevised = revisedTime !== null && (syncedAt ?? 0) < revisedTime;
      const expired = cutoff !== null && runtime.plugin.remoteToolCatalog === true && syncedAt !== null && syncedAt < cutoff;
      if (!staleMarked && !configRevised && !expired) continue;
      yield* produceConnectionTools(
        integrationRow,
        {
          owner: connection.owner,
          integration: IntegrationSlug.make(connection.integration),
          name: ConnectionName.make(connection.name)
        },
        "background"
      ).pipe(
        Effect11.catch(() => Effect11.succeed([])),
        Effect11.withSpan("executor.tools.sync_stale", {
          attributes: {
            "executor.integration": connection.integration,
            "executor.connection": connection.name
          }
        })
      );
    }
  });
  const toolsList = (filter) => Effect11.gen(function* () {
    yield* syncStaleConnectionTools;
    const rows = yield* core.findMany("tool", {
      where: (b) => b.and(
        filter?.integration === void 0 ? true : b("integration", "=", String(filter.integration)),
        filter?.owner === void 0 ? true : b("owner", "=", filter.owner),
        filter?.connection === void 0 ? true : b("connection", "=", String(filter.connection))
      ),
      select: TOOL_INVOCATION_COLUMNS
    });
    const includeBlocked = filter?.includeBlocked ?? false;
    const policyRules = yield* listActivePolicyRuleSet();
    const tools = [];
    for (const row of rows) {
      const tool2 = rowToTool(row);
      if (!matchesToolFilter(tool2, filter)) continue;
      if (!includeBlocked) {
        const effective = yield* resolvePolicyFromRuleSet(
          normalizedPolicyId(tool2),
          policyRules,
          tool2.annotations?.requiresApproval
        );
        if (effective.action === "block") continue;
      }
      tools.push(tool2);
    }
    for (const entry of staticTools.values()) {
      const tool2 = staticToolToTool(entry);
      if (!matchesToolFilter(tool2, filter)) continue;
      if (!includeBlocked) {
        const effective = yield* resolvePolicyFromRuleSet(
          normalizedPolicyId(tool2),
          policyRules,
          tool2.annotations?.requiresApproval
        );
        if (effective.action === "block") continue;
      }
      tools.push(tool2);
    }
    return tools;
  });
  const toolSchema = (address) => Effect11.gen(function* () {
    const policyRules = yield* listActivePolicyRuleSet();
    const staticEntry = staticTools.get(String(address));
    if (staticEntry) {
      const tool3 = staticToolToTool(staticEntry);
      const effective2 = yield* resolvePolicyFromRuleSet(
        normalizedPolicyId(tool3),
        policyRules,
        tool3.annotations?.requiresApproval
      );
      if (effective2.action === "block") return null;
      const preview2 = yield* Effect11.tryPromise({
        try: () => buildToolTypeScriptPreview({
          inputSchema: tool3.inputSchema,
          outputSchema: tool3.outputSchema,
          defs: /* @__PURE__ */ new Map()
        }),
        catch: (cause) => storageFailureFromUnknown("Failed to build static tool TypeScript preview", cause)
      }).pipe(Effect11.option);
      return ToolSchemaView.make({
        address,
        name: tool3.name,
        description: tool3.description,
        inputSchema: tool3.inputSchema,
        outputSchema: tool3.outputSchema,
        inputTypeScript: Option5.getOrUndefined(preview2)?.inputTypeScript,
        outputTypeScript: Option5.getOrUndefined(preview2)?.outputTypeScript,
        typeScriptDefinitions: Option5.getOrUndefined(preview2)?.typeScriptDefinitions
      });
    }
    const parsed = parseToolAddress(String(address));
    if (!parsed) return null;
    const row = yield* core.findFirst("tool", {
      where: (b) => b.and(
        byOwner(parsed.owner)(b),
        b("integration", "=", String(parsed.integration)),
        b("connection", "=", String(parsed.connection)),
        b("name", "=", String(parsed.tool))
      )
    });
    if (!row) return null;
    const tool2 = rowToTool(row);
    const effective = yield* resolvePolicyFromRuleSet(
      normalizedPolicyId(tool2),
      policyRules,
      tool2.annotations?.requiresApproval
    );
    if (effective.action === "block") return null;
    const runtime = runtimes.get(row.plugin_id);
    const projected = runtime?.plugin.projectToolSchema ? yield* runtime.plugin.projectToolSchema({
      ctx: runtime.ctx,
      toolRow: row,
      inputSchema: tool2.inputSchema,
      outputSchema: tool2.outputSchema
    }).pipe(
      Effect11.mapError(
        (cause) => pluginStorageFailure(row.plugin_id, "projectToolSchema", cause)
      )
    ) : null;
    const inputSchema = projected && Object.prototype.hasOwnProperty.call(projected, "inputSchema") ? projected.inputSchema : tool2.inputSchema;
    const outputSchema = projected && Object.prototype.hasOwnProperty.call(projected, "outputSchema") ? projected.outputSchema : tool2.outputSchema;
    const definitionRows = yield* core.findMany("definition", {
      where: (b) => b.and(
        byOwner(parsed.owner)(b),
        b("integration", "=", String(parsed.integration)),
        b("connection", "=", String(parsed.connection))
      )
    });
    const defs = /* @__PURE__ */ new Map();
    for (const def of definitionRows) defs.set(def.name, decodeJsonColumn(def.schema));
    const referenced = collectReferencedDefinitions([inputSchema, outputSchema], defs);
    const preview = yield* Effect11.tryPromise({
      try: () => buildToolTypeScriptPreview({
        inputSchema,
        outputSchema,
        defs
      }),
      catch: (cause) => storageFailureFromUnknown("Failed to build tool TypeScript preview", cause)
    }).pipe(Effect11.option);
    const view = preview;
    return ToolSchemaView.make({
      address,
      name: tool2.name,
      description: tool2.description,
      inputSchema,
      outputSchema,
      schemaDefinitions: Object.keys(referenced).length > 0 ? referenced : void 0,
      inputTypeScript: Option5.getOrUndefined(view)?.inputTypeScript,
      outputTypeScript: Option5.getOrUndefined(view)?.outputTypeScript,
      typeScriptDefinitions: Option5.getOrUndefined(view)?.typeScriptDefinitions
    });
  });
  const providersList = () => Effect11.sync(() => credentialProviderOrder.map((key) => ProviderKey.make(key)));
  const providersItems = (key) => Effect11.gen(function* () {
    const provider = credentialProviders.get(String(key));
    if (!provider || !provider.list) return [];
    return yield* provider.list();
  });
  const providersGet = (key, id) => Effect11.gen(function* () {
    const provider = credentialProviders.get(String(key));
    if (!provider) return null;
    return yield* provider.get(id);
  });
  const providersHas = (key, id) => Effect11.gen(function* () {
    const provider = credentialProviders.get(String(key));
    if (!provider) return false;
    if (provider.has) return yield* provider.has(id);
    const value = yield* provider.get(id);
    return value !== null;
  });
  const providersSetDefault = (id, value) => Effect11.gen(function* () {
    const provider = defaultWritableProvider();
    if (!provider || !provider.set) {
      return yield* new CredentialProviderNotRegisteredError({
        provider: ProviderKey.make("default")
      });
    }
    yield* provider.set(id, value);
    return provider.key;
  });
  const providersRemove = (key, id) => Effect11.gen(function* () {
    const provider = credentialProviders.get(String(key));
    if (!provider || !provider.delete) return;
    yield* provider.delete(id);
  });
  const ownerRankForRow = (row) => row.owner === "user" ? 0 : 1;
  const normalizedPolicyId = (tool2) => tool2.static ? String(tool2.address) : `${tool2.integration}.${tool2.owner}.${tool2.connection}.${tool2.name}`;
  const policiesList = () => core.findMany("tool_policy", {}).pipe(
    Effect11.map(
      (rows) => [...rows].sort((a, b) => ownerRankForRow(a) - ownerRankForRow(b) || comparePolicyRow(a, b)).map(rowToToolPolicy)
    )
  );
  const policiesCreate = (input) => Effect11.gen(function* () {
    if (!isValidPattern(input.pattern)) {
      return yield* new StorageError({
        message: `Invalid tool policy pattern: ${input.pattern}`,
        cause: void 0
      });
    }
    if (!isToolPolicyAction(input.action)) {
      return yield* new StorageError({
        message: `Invalid tool policy action: ${String(input.action)}`,
        cause: void 0
      });
    }
    yield* requireUserSubject(input.owner);
    const keys = yield* Effect11.try({
      try: () => ownedKeys(input.owner),
      catch: (cause) => storageFailureFromUnknown("invalid owner", cause)
    });
    const existing = yield* core.findMany("tool_policy", {
      where: byOwner(input.owner)
    });
    const minPosition = existing.map((row) => row.position).sort().at(0);
    const position = input.position ?? generateKeyBetween(null, minPosition ?? null);
    const id = PolicyId.make(
      `pol_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
    );
    const now = /* @__PURE__ */ new Date();
    const created = yield* core.create("tool_policy", {
      tenant: keys.tenant,
      owner: keys.owner,
      subject: keys.subject,
      id: String(id),
      pattern: input.pattern,
      action: input.action,
      position,
      created_at: now,
      updated_at: now
    });
    return rowToToolPolicy(created);
  });
  const policiesUpdate = (input) => Effect11.gen(function* () {
    if (input.pattern !== void 0 && !isValidPattern(input.pattern)) {
      return yield* new StorageError({
        message: `Invalid tool policy pattern: ${input.pattern}`,
        cause: void 0
      });
    }
    const where = (b) => b.and(byOwner(input.owner)(b), b("id", "=", input.id));
    const existing = yield* core.findFirst("tool_policy", { where });
    if (!existing) {
      return yield* new StorageError({
        message: `Tool policy not found: ${input.id}`,
        cause: void 0
      });
    }
    const set = { updated_at: /* @__PURE__ */ new Date() };
    if (input.pattern !== void 0) set.pattern = input.pattern;
    if (input.action !== void 0) set.action = input.action;
    if (input.position !== void 0) set.position = input.position;
    yield* core.updateMany("tool_policy", { where, set });
    const updated = yield* core.findFirst("tool_policy", { where });
    return rowToToolPolicy(updated ?? { ...existing, ...set });
  });
  const policiesRemove = (input) => core.deleteMany("tool_policy", {
    where: (b) => b.and(byOwner(input.owner)(b), b("id", "=", input.id))
  });
  const policiesResolve = (address) => Effect11.gen(function* () {
    const parsed = parseToolAddress(String(address));
    const policyRows = yield* core.findMany("tool_policy", {});
    const toolId = parsed ? `${parsed.integration}.${parsed.owner}.${parsed.connection}.${parsed.tool}` : String(address);
    let requiresApproval;
    if (parsed) {
      const row = yield* core.findFirst("tool", {
        where: (b) => b.and(
          byOwner(parsed.owner)(b),
          b("integration", "=", String(parsed.integration)),
          b("connection", "=", String(parsed.connection)),
          b("name", "=", String(parsed.tool))
        )
      });
      if (row) {
        const annotations = decodeJsonColumn(row.annotations);
        requiresApproval = annotations?.requiresApproval;
      }
    }
    return resolveEffectivePolicy(toolId, policyRows, ownerRankForRow, requiresApproval);
  });
  const defaultElicitationHandler = resolveElicitationHandler(config.onElicitation);
  const pickHandler = (options) => options?.onElicitation ? resolveElicitationHandler(options.onElicitation) : defaultElicitationHandler;
  const buildElicit = (address, args, handler) => {
    return (request) => Effect11.gen(function* () {
      const response = yield* handler({
        address,
        args,
        request
      });
      if (response.action !== "accept") {
        return yield* new ElicitationDeclinedError({
          address,
          action: response.action
        });
      }
      return response;
    });
  };
  const approvalRequired = (annotations, policy) => {
    if (policy.action === "approve") return false;
    return policy.action === "require_approval" || annotations?.requiresApproval === true;
  };
  const enforceApproval = (annotations, address, args, policy, handler) => Effect11.gen(function* () {
    if (!approvalRequired(annotations, policy)) return;
    const policyForcesApproval = policy.action === "require_approval";
    const message = annotations?.approvalDescription ? annotations.approvalDescription : policyForcesApproval && policy.pattern ? `Approve ${address}? (matched policy: ${policy.pattern})` : `Approve ${address}?`;
    const request = FormElicitation.make({
      message: `${message}

Arguments:
${approvalArgumentPreview(args)}`,
      requestedSchema: { type: "object", properties: {} }
    });
    const response = yield* handler({ address, args, request });
    if (response.action !== "accept") {
      return yield* new ElicitationDeclinedError({
        address,
        action: response.action
      });
    }
  });
  const TOOL_SUGGESTION_LIMIT = 5;
  const toolSuggestions = (rows) => rows.map((row) => rowToTool(row).address);
  const toolRowsForConnectionWhere = (parsed) => (b) => b.and(
    byOwner(parsed.owner)(b),
    b("integration", "=", String(parsed.integration)),
    b("connection", "=", String(parsed.connection))
  );
  const searchToolRowsForConnection = (parsed) => core.findMany("tool", {
    where: (b) => b.and(
      toolRowsForConnectionWhere(parsed)(b),
      b.or(
        b("name", "contains", String(parsed.tool)),
        b("description", "contains", String(parsed.tool))
      )
    ),
    orderBy: ["name", "asc"],
    limit: TOOL_SUGGESTION_LIMIT,
    select: TOOL_INVOCATION_COLUMNS
  });
  const findToolRowsForConnection = (parsed) => core.findMany("tool", {
    where: toolRowsForConnectionWhere(parsed),
    orderBy: ["name", "asc"],
    limit: TOOL_SUGGESTION_LIMIT,
    select: TOOL_INVOCATION_COLUMNS
  });
  const execute = (address, args, options) => {
    const handler = pickHandler(options);
    return Effect11.gen(function* () {
      const formatInvocationCauseMessage = (cause) => {
        if (cause instanceof Error && cause.message.length > 0) return cause.message;
        if (typeof cause === "object" && cause !== null) {
          const tag = cause._tag;
          if (typeof tag === "string") return tag;
          return Inspectable.toStringUnknown(cause, 0);
        }
        return String(cause);
      };
      const wrapInvocationError = (effect) => effect.pipe(
        Effect11.mapError(
          (cause) => new ToolInvocationError({
            address,
            message: formatInvocationCauseMessage(cause),
            cause
          })
        )
      );
      const staticEntry = staticTools.get(String(address));
      if (staticEntry) {
        const policyRules2 = yield* listActivePolicyRuleSet();
        const policy2 = yield* resolvePolicyFromRuleSet(
          String(address),
          policyRules2,
          staticEntry.tool.annotations?.requiresApproval
        );
        if (policy2.action === "block") {
          return yield* new ToolBlockedError({
            address,
            pattern: policy2.pattern ?? "*"
          });
        }
        yield* enforceApproval(staticEntry.tool.annotations, address, args, policy2, handler);
        return yield* wrapInvocationError(
          staticEntry.tool.handler({
            ctx: staticEntry.ctx,
            args,
            elicit: buildElicit(address, args, handler)
          })
        );
      }
      const parsed = parseToolAddress(String(address));
      if (!parsed) {
        return yield* new ToolNotFoundError({ address });
      }
      const row = yield* core.findFirst("tool", {
        where: (b) => b.and(
          byOwner(parsed.owner)(b),
          b("integration", "=", String(parsed.integration)),
          b("connection", "=", String(parsed.connection)),
          b("name", "=", String(parsed.tool))
        ),
        select: TOOL_INVOCATION_COLUMNS
      });
      if (!row) {
        const searchMatches = yield* searchToolRowsForConnection(parsed);
        const connectionTools = searchMatches.length > 0 ? searchMatches : yield* findToolRowsForConnection(parsed);
        return yield* new ToolNotFoundError({
          address,
          suggestions: toolSuggestions(connectionTools)
        });
      }
      const toolForPolicy = rowToTool(row);
      const policyRules = yield* listActivePolicyRuleSet();
      const annotations = decodeJsonColumn(row.annotations);
      const policy = yield* resolvePolicyFromRuleSet(
        normalizedPolicyId(toolForPolicy),
        policyRules,
        annotations?.requiresApproval
      );
      if (policy.action === "block") {
        return yield* new ToolBlockedError({
          address,
          pattern: policy.pattern ?? "*"
        });
      }
      const runtime = runtimes.get(row.plugin_id);
      if (!runtime) {
        return yield* new PluginNotLoadedError({
          address,
          pluginId: row.plugin_id
        });
      }
      if (!runtime.plugin.invokeTool) {
        return yield* new NoHandlerError({
          address,
          pluginId: row.plugin_id
        });
      }
      const connectionRow = yield* findConnectionRow({
        owner: parsed.owner,
        integration: parsed.integration,
        name: parsed.connection
      });
      if (!connectionRow) {
        return yield* new ConnectionNotFoundError({
          owner: parsed.owner,
          integration: parsed.integration,
          name: parsed.connection
        });
      }
      let resolvedAnnotations = annotations;
      if (policy.action !== "approve" && runtime.plugin.resolveAnnotations) {
        const map = yield* runtime.plugin.resolveAnnotations({
          ctx: runtime.ctx,
          integration: parsed.integration,
          connection: parsed.connection,
          toolRows: [row]
        }).pipe(wrapInvocationError);
        resolvedAnnotations = map[String(parsed.tool)] ?? annotations;
      }
      if (approvalRequired(resolvedAnnotations, policy) && runtime.plugin.validateToolArgs) {
        yield* runtime.plugin.validateToolArgs({ ctx: runtime.ctx, toolRow: row, args }).pipe(wrapInvocationError);
      }
      yield* enforceApproval(resolvedAnnotations, address, args, policy, handler);
      const values = yield* resolveConnectionValues(connectionRow);
      const integrationRow = yield* findIntegrationRow(parsed.integration);
      const credential = {
        owner: parsed.owner,
        integration: parsed.integration,
        connection: parsed.connection,
        template: AuthTemplateSlug.make(connectionRow.template),
        value: values[PRIMARY_INPUT_VARIABLE] ?? null,
        values,
        config: integrationRow ? decodeJsonColumn(integrationRow.config) : void 0
      };
      return yield* wrapInvocationError(
        runtime.plugin.invokeTool({
          ctx: runtime.ctx,
          toolRow: row,
          credential,
          args,
          elicit: buildElicit(address, args, handler),
          invokeOptions: options
        })
      );
    }).pipe(
      // Expected tool failures (`ToolResult.fail`) resolve through the
      // success channel, so the tracer alone would record them as healthy
      // spans. Stamp the outcome + error code so telemetry can distinguish
      // "tool ran fine" from "user hit an upstream error / auth wall"
      // without parsing response bodies.
      Effect11.tap(annotateToolResultOutcome),
      Effect11.withSpan("executor.tool.execute", {
        attributes: {
          "mcp.tool.name": String(address),
          "executor.tenant": tenant,
          ...subject != null ? { "executor.subject": subject } : {}
        }
      })
    );
  };
  const oauth = makeOAuthService({
    fuma,
    owner: ownerBinding,
    tenant,
    subject,
    ownedKeys: (owner) => ownedKeys(owner),
    defaultWritableProvider,
    mintOAuthConnection: (input) => mintOAuthConnection(input),
    // One integration-row read + one projector run. Resolve the method this
    // template selects exactly as the runtime's `selectAuthMethod` does —
    // exact slug match, else the sole declared method (single-method
    // integrations accept any slug); an ambiguous miss selects nothing rather
    // than guessing across methods. The discover-vs-scopes choice then reads
    // off that method (MCP exposes `discoveryUrl`), so core needs no plugin-id
    // knowledge.
    resolveOAuthScopePolicy: (integration, template) => findIntegrationRow(integration).pipe(
      Effect11.map((row) => {
        const methods = row ? describeAuthMethodsForRow(row) : [];
        const selected = methods.find((m) => m.template === String(template)) ?? (methods.length === 1 ? methods[0] : void 0);
        const oauth2 = selected?.kind === "oauth" ? selected.oauth : void 0;
        if (oauth2?.scopes === void 0 && oauth2?.discoveryUrl !== void 0) {
          return { kind: "discover" };
        }
        return { kind: "scopes", scopes: oauth2?.scopes ?? [] };
      })
    ),
    httpClientLayer: config.httpClientLayer,
    fetch: config.fetch,
    endpointUrlPolicy: config.oauthEndpointUrlPolicy,
    // EXPLICIT — no localhost default. When a caller omits `redirectUri` the
    // OAuth service receives `null` and redirect-requiring flows fail loudly
    // instead of silently using `http://127.0.0.1/callback`. Hosts that serve
    // OAuth (cloud, self-host) derive a real `${webBaseUrl}/oauth/callback`.
    redirectUri: config.redirectUri ?? null,
    callbackStateOrgSlug: config.oauthCallbackStateOrgSlug ?? null
  });
  const blobPartitions = {
    org: `o:${tenant}`,
    user: subject != null ? `u:${tenant}:${subject}` : null
  };
  for (const plugin of plugins) {
    if (runtimes.has(plugin.id)) {
      return yield* new StorageError({
        message: `Duplicate plugin id: ${plugin.id}`,
        cause: void 0
      });
    }
    const pluginStorage = makePluginStorageFacade({
      core,
      pluginId: plugin.id,
      owner: ownerBinding
    });
    const storageDeps = {
      owner: ownerBinding,
      blobs: pluginBlobStore(blobs, blobPartitions, plugin.id),
      pluginStorage
    };
    const storage = plugin.storage(storageDeps);
    const ctx = {
      owner: ownerBinding,
      storage,
      pluginStorage,
      httpClientLayer: config.httpClientLayer ?? FetchHttpClient3.layer,
      core: {
        integrations: {
          register: (input) => integrationsRegister(plugin.id, input),
          update: (slug, patch) => integrationsUpdate(slug, patch),
          list: () => integrationsList(),
          get: (slug) => integrationsGetRecord(slug),
          remove: (slug) => integrationsRemove(slug),
          setHealthCheck: (slug, spec) => integrationSetHealthCheck(slug, spec).pipe(
            // Fold not-found: a plugin declaring a default on a row it
            // never registered is a no-op, not a storage failure.
            Effect11.catchTag("IntegrationNotFoundError", () => Effect11.void)
          ),
          detect: (url) => integrationsDetect(url),
          configureSchemas: () => Array.from(runtimes.values()).map(
            ({ plugin: plugin2 }) => plugin2.integrationConfigure ? {
              pluginId: plugin2.id,
              type: plugin2.integrationConfigure.type,
              schema: void 0
            } : void 0
          ).filter(Predicate4.isNotUndefined),
          presets: () => Array.from(runtimes.values()).flatMap(
            ({ plugin: plugin2 }) => (plugin2.integrationPresets ?? []).map((preset) => ({
              ...preset,
              pluginId: plugin2.id
            }))
          )
        },
        policies: {
          list: () => policiesList(),
          create: (input) => policiesCreate(input),
          update: (input) => policiesUpdate(input),
          remove: (input) => policiesRemove(input)
        }
      },
      connections: {
        create: (input) => connectionsCreate(input),
        list: (filter) => connectionsList(filter),
        get: (ref) => connectionsGet(ref),
        update: (ref, input) => connectionsUpdate(ref, input),
        remove: (ref) => connectionsRemove(ref),
        refresh: (ref) => connectionsRefresh(ref),
        markToolsStale: (ref) => connectionsMarkToolsStale(ref),
        resolveValue: (ref) => resolveConnectionValueByRef(ref)
      },
      providers: {
        list: () => providersList(),
        items: (key) => providersItems(key),
        get: (key, id) => providersGet(key, id),
        has: (key, id) => providersHas(key, id),
        setDefault: (id, value) => providersSetDefault(id, value),
        remove: (key, id) => providersRemove(key, id)
      },
      oauth,
      execute: (address, args, options) => execute(address, args, options),
      transaction: (effect) => transaction(effect)
    };
    if (plugin.toolPolicyProvider) {
      const rawProvider = plugin.toolPolicyProvider(ctx);
      const provider = Effect11.isEffect(rawProvider) ? yield* rawProvider : rawProvider;
      if (provider) {
        if (activeToolPolicyProvider) {
          return yield* new StorageError({
            message: "Only one plugin can provide the active tool policy source.",
            cause: void 0
          });
        }
        activeToolPolicyProvider = provider;
      }
    }
    const extension = plugin.extension ? plugin.extension(ctx) : {};
    if (plugin.extension) {
      extensions[plugin.id] = extension;
    }
    const decls = plugin.staticIntegrations ? plugin.staticIntegrations(extension) : [];
    for (const integration of decls) {
      const mountUnderExecutor = integration.kind === "executor";
      const mountedIntegration = mountUnderExecutor ? EXECUTOR_INTEGRATION : integration;
      for (const tool2 of integration.tools) {
        const mountedTool = mountUnderExecutor ? { ...tool2, name: `${integration.id}.${tool2.name}` } : tool2;
        const fqid = `${mountedIntegration.id}.${mountedTool.name}`;
        if (staticTools.has(fqid)) {
          return yield* new StorageError({
            message: `Duplicate static tool id: ${fqid} (plugin ${plugin.id})`,
            cause: void 0
          });
        }
        staticTools.set(fqid, {
          integration: mountedIntegration,
          tool: mountedTool,
          pluginId: plugin.id,
          ctx
        });
      }
    }
    runtimes.set(plugin.id, { plugin, storage, ctx });
    if (plugin.credentialProviders) {
      const raw = typeof plugin.credentialProviders === "function" ? plugin.credentialProviders(ctx) : plugin.credentialProviders;
      const providers2 = Effect11.isEffect(raw) ? yield* raw.pipe(
        Effect11.mapError(
          (cause) => pluginStorageFailure(plugin.id, "credentialProviders", cause)
        )
      ) : raw;
      for (const provider of providers2) {
        yield* registerCredentialProvider(provider, `plugin ${plugin.id}`);
      }
    }
  }
  const close = () => Effect11.gen(function* () {
    for (const runtime of runtimes.values()) {
      if (runtime.plugin.close) {
        yield* runtime.plugin.close().pipe(
          Effect11.mapError((cause) => pluginStorageFailure(runtime.plugin.id, "close", cause))
        );
      }
    }
    if (closeDb) {
      const out = closeDb();
      if (Effect11.isEffect(out)) {
        yield* out;
      } else if (out instanceof Promise) {
        yield* Effect11.tryPromise({
          try: () => out,
          catch: (cause) => new StorageError({
            message: "Executor database close failed",
            cause
          })
        });
      }
    }
  });
  const base = {
    integrations: {
      list: integrationsList,
      get: integrationsGet,
      update: integrationsUpdatePublic,
      remove: integrationsRemove,
      detect: integrationsDetect,
      healthCheck: {
        get: integrationHealthCheckGet,
        candidates: integrationHealthCheckCandidates,
        set: integrationSetHealthCheck
      }
    },
    connections: {
      create: connectionsCreate,
      list: connectionsList,
      get: connectionsGet,
      update: connectionsUpdate,
      remove: connectionsRemove,
      refresh: connectionsRefresh,
      checkHealth: connectionCheckHealth,
      validate: connectionValidate
    },
    oauth,
    tools: {
      list: toolsList,
      schema: toolSchema
    },
    providers: {
      list: providersList,
      items: providersItems
    },
    policies: {
      list: policiesList,
      create: policiesCreate,
      update: policiesUpdate,
      remove: policiesRemove,
      resolve: policiesResolve
    },
    execute,
    close
  };
  const toExecutor = (value) => value;
  return toExecutor(Object.assign(base, extensions));
});

// ../sdk/src/config.ts
var defineExecutorConfig = (config) => config;

// ../sdk/src/index.ts
import { Context as Context2, Effect as Effect15, Layer as Layer5, Schema as Schema18, Data as Data5, Option as Option8 } from "effect";
import {
  HttpApi,
  HttpApiBuilder,
  HttpApiClient,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiMiddleware,
  HttpApiSchema
} from "effect/unstable/httpapi";

// ../sdk/src/integration.ts
var shortId = () => Math.random().toString(36).slice(2, 8);
var freshCustomAuthSlug = (taken) => {
  let candidate = `custom_${shortId()}`;
  while (taken.has(candidate)) candidate = `custom_${shortId()}`;
  return candidate;
};
var mergeAuthTemplates = (existing, incoming) => {
  const result = existing.map((entry) => entry);
  const taken = new Set(result.map((entry) => String(entry.slug)));
  for (const entry of incoming) {
    const rawSlug = entry.slug;
    const requested = typeof rawSlug === "string" ? rawSlug.trim() : "";
    const existingIndex = result.findIndex((current) => String(current.slug) === requested);
    if (requested.length > 0 && existingIndex >= 0) {
      result[existingIndex] = entry;
      continue;
    }
    const slug = requested.length > 0 && !taken.has(requested) ? requested : freshCustomAuthSlug(taken);
    taken.add(slug);
    result.push({ ...entry, slug });
  }
  return result;
};

// ../sdk/src/server-connection.ts
import { Option as Option6, Schema as Schema15 } from "effect";
var ExecutorServerAuthJson = Schema15.Union([
  Schema15.Struct({
    kind: Schema15.Literal("basic"),
    username: Schema15.optional(Schema15.String),
    password: Schema15.String
  }),
  Schema15.Struct({
    kind: Schema15.Literal("bearer"),
    token: Schema15.String
  }),
  Schema15.Struct({
    kind: Schema15.Literal("oauth"),
    accessToken: Schema15.String,
    refreshToken: Schema15.optional(Schema15.String),
    expiresAt: Schema15.optional(Schema15.Number),
    tokenEndpoint: Schema15.optional(Schema15.String),
    clientId: Schema15.optional(Schema15.String)
  })
]);
var ExecutorServerConnectionJson = Schema15.Struct({
  kind: Schema15.optional(Schema15.Literals(["http", "desktop-sidecar"])),
  key: Schema15.optional(Schema15.String),
  origin: Schema15.String,
  apiBaseUrl: Schema15.optional(Schema15.String),
  displayName: Schema15.optional(Schema15.String),
  auth: Schema15.optional(ExecutorServerAuthJson)
});
var ExecutorLocalServerManifestJson = Schema15.Struct({
  version: Schema15.Literal(1),
  kind: Schema15.Literals(["cli-daemon", "desktop-sidecar", "foreground"]),
  pid: Schema15.Number,
  startedAt: Schema15.String,
  dataDir: Schema15.String,
  scopeDir: Schema15.NullOr(Schema15.String),
  connection: ExecutorServerConnectionJson,
  owner: Schema15.Struct({
    client: Schema15.Literals(["cli", "desktop"]),
    version: Schema15.NullOr(Schema15.String),
    executablePath: Schema15.NullOr(Schema15.String)
  })
});
var decodeUnknownJsonOption = Schema15.decodeUnknownOption(Schema15.UnknownFromJsonString);
var decodeExecutorLocalServerManifestJson = Schema15.decodeUnknownOption(
  ExecutorLocalServerManifestJson
);

// ../sdk/src/api-errors.ts
import { Schema as Schema16 } from "effect";
var InternalError = class extends Schema16.TaggedErrorClass()(
  "InternalError",
  {
    /** Opaque correlation id for backend lookup (Sentry event id, log line, etc.). */
    traceId: Schema16.String
  },
  { httpApiStatus: 500 }
) {
};

// ../sdk/src/sqlite-data-migrations.ts
import { Data as Data4, Effect as Effect12 } from "effect";
var DataMigrationError = class extends Data4.TaggedError("DataMigrationError") {
};
var DuplicateDataMigrationError = class extends Data4.TaggedError("DuplicateDataMigrationError") {
};

// ../sdk/src/sqlite-config-blob-migration.ts
import { Effect as Effect13, Option as Option7, Schema as Schema17 } from "effect";
var decodeJsonOption = Schema17.decodeUnknownOption(Schema17.UnknownFromJsonString);

// ../sdk/src/sqlite-oauth-client-gc-migration.ts
import { Effect as Effect14 } from "effect";

// ../sdk/src/auth-tool-failure.ts
var authRecovery = (input) => ({
  createConnectionTool: "executor.coreTools.connections.createHandoff",
  startOAuthTool: "executor.coreTools.oauth.start",
  listConnectionsTool: "executor.coreTools.connections.list",
  ...input?.configureIntegrationTool ? { configureIntegrationTool: input.configureIntegrationTool } : {},
  connectionInstructions: "For API keys and tokens, call createConnectionTool for the integration to get a browser URL; the user enters the credential there, which creates the bound connection. Do not ask the user to paste secrets into chat. Then call listConnectionsTool to confirm the connection exists before retrying this tool.",
  oauthInstructions: "For OAuth credentials, call startOAuthTool and give the returned authorizationUrl to the user. The completed connection binds automatically, then retry the tool."
});
var authToolFailure = (input) => {
  const error = {
    code: input.code,
    message: input.message,
    retryable: false,
    ...input.status !== void 0 ? { status: input.status } : {},
    details: {
      category: "authentication",
      ...input.integration ? { integration: input.integration } : {},
      ...input.credential ? { credential: input.credential } : {},
      ...input.upstream ? { upstream: input.upstream } : {},
      recovery: authRecovery(input.recovery)
    }
  };
  return ToolResult.fail(error);
};

export {
  StorageError,
  IntegrationSlug,
  AuthTemplateSlug,
  ConnectionName,
  OAuthClientSlug,
  OAuthState,
  ProviderKey,
  ProviderItemId,
  ConnectionAddress,
  ToolAddress,
  ToolName,
  ElicitationId,
  PolicyId,
  Tenant,
  Subject,
  Owner,
  FormElicitation,
  UrlElicitation,
  isUserActionableError,
  ToolNotFoundError,
  IntegrationNotFoundError,
  IntegrationAlreadyExistsError,
  IntegrationRemovalNotAllowedError,
  ConnectionNotFoundError,
  InvalidConnectionInputError,
  CredentialProviderNotRegisteredError,
  mergeAuthTemplates,
  ToolSchemaView,
  IntegrationDetectionResult,
  HealthCheckSpec,
  HealthCheckResult,
  HealthCheckCandidate,
  classifyHttpStatus,
  ToolPolicyActionSchema,
  OAuthStartError,
  OAuthCompleteError,
  OAuthProbeError,
  OAuthRegisterDynamicError,
  OAuthSessionNotFoundError,
  tool,
  definePlugin,
  isToolFile,
  ToolResult,
  isToolResult,
  annotateToolResultOutcome,
  parseToolAddress,
  collectTables,
  createExecutor,
  defineExecutorConfig,
  InternalError,
  authToolFailure
};
