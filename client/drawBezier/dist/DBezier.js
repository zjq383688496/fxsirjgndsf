(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.DBezier = factory());
}(this, (function () { 'use strict';

  var version = "1.0.0";

  // Math - 内联函数
  const {
    abs: abs$1,
    cos: cos$1,
    sin: sin$1,
    acos: acos$1,
    atan2,
    sqrt: sqrt$1,
    pow,
    PI: PI$1
  } = Math; // 生成根的立方根函数

  function crt(v) {
    return v < 0 ? -pow(-v, 1 / 3) : pow(v, 1 / 3);
  } // 常量


  const TAU = 2 * PI$1; // 零坐标

  const ZERO = {
    x: 0,
    y: 0
  }; // 勒让德-高斯 横坐标，n=24 (x_i 值，在 i=n 处定义为 n 阶勒让德多项式 Pn(x) 的根)

  const Tvalues = [-0.0640568928626056260850430826247450385909, 0.0640568928626056260850430826247450385909, -0.1911188674736163091586398207570696318404, 0.1911188674736163091586398207570696318404, -0.3150426796961633743867932913198102407864, 0.3150426796961633743867932913198102407864, -0.4337935076260451384870842319133497124524, 0.4337935076260451384870842319133497124524, -0.5454214713888395356583756172183723700107, 0.5454214713888395356583756172183723700107, -0.6480936519369755692524957869107476266696, 0.6480936519369755692524957869107476266696, -0.7401241915785543642438281030999784255232, 0.7401241915785543642438281030999784255232, -0.8200019859739029219539498726697452080761, 0.8200019859739029219539498726697452080761, -0.8864155270044010342131543419821967550873, 0.8864155270044010342131543419821967550873, -0.9382745520027327585236490017087214496548, 0.9382745520027327585236490017087214496548, -0.9747285559713094981983919930081690617411, 0.9747285559713094981983919930081690617411, -0.9951872199970213601799974097007368118745, 0.9951872199970213601799974097007368118745]; // 勒让德-高斯 权重 n=24（w_i 值，由链接到 Bezier 入门文章中的函数定义）

  const Cvalues = [0.1279381953467521569740561652246953718517, 0.1279381953467521569740561652246953718517, 0.1258374563468282961213753825111836887264, 0.1258374563468282961213753825111836887264, 0.121670472927803391204463153476262425607, 0.121670472927803391204463153476262425607, 0.1155056680537256013533444839067835598622, 0.1155056680537256013533444839067835598622, 0.1074442701159656347825773424466062227946, 0.1074442701159656347825773424466062227946, 0.0976186521041138882698806644642471544279, 0.0976186521041138882698806644642471544279, 0.086190161531953275917185202983742667185, 0.086190161531953275917185202983742667185, 0.0733464814110803057340336152531165181193, 0.0733464814110803057340336152531165181193, 0.0592985849154367807463677585001085845412, 0.0592985849154367807463677585001085845412, 0.0442774388174198061686027482113382288593, 0.0442774388174198061686027482113382288593, 0.0285313886289336631813078159518782864491, 0.0285313886289336631813078159518782864491, 0.0123412297999871995468056670700372915759, 0.0123412297999871995468056670700372915759]; // 有效的浮点精度小数

  const epsilon = 0.000001; // 最大&最小安全整数

  const nMax = Number.MAX_SAFE_INTEGER || 9007199254740991;
  const nMin = Number.MIN_SAFE_INTEGER || -9007199254740991; // 获取真实数据类型

  const getClass = element => {
    return Object.prototype.toString.call(element).slice(8, -1);
  }; // 深拷贝

  const derive = points => {
    const dpoints = [];

    for (let p = points, len = p.length, last = len - 1; len > 1; len--, last--) {
      const list = [];

      for (let j = 0; j < last; j++) {
        let dpt = {
          x: last * (p[j + 1].x - p[j].x),
          y: last * (p[j + 1].y - p[j].y)
        };
        list.push(dpt);
      }

      dpoints.push(list);
      p = list;
    }

    return dpoints;
  }; // 计算点坐标 (根据范围t)

  const compute = (t = 0, points) => {
    // 捷径
    if (t === 0) {
      points[0].t = 0;
      return points[0];
    }

    const order = points.length - 1;

    if (t === 1) {
      points[order].t = 1;
      return points[order];
    }

    const mt = 1 - t;
    let p = points,
        [p0, p1, p2, p3] = p;
    let mt2 = mt ** 2,
        t2 = t ** 2,
        a,
        b,
        c,
        d = 0; // 二次/三次曲线

    if (order === 2) {
      p = [p0, p1, p2, ZERO];
      a = mt2;
      b = mt * t * 2;
      c = t2;
      p3 = p[3];
    } else if (order === 3) {
      a = mt2 * mt;
      b = mt2 * t * 3;
      c = mt * t2 * 3;
      d = t * t2;
    }

    const ret = {
      x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
      y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
      t
    };
    return ret;
  }; // 获取线段长度

  const length = derivativeFn => {
    const z = .5,
          len = Tvalues.length;
    let sum = 0;

    for (let i = 0, t; i < len; i++) {
      t = z * Tvalues[i] + z;
      sum += Cvalues[i] * getArc(t, derivativeFn);
    }

    return z * sum;
  }; // 获取角度

  const getArc = (t, derivativeFn) => {
    const d = derivativeFn(t);
    let l = d.x ** 2 + d.y ** 2;
    return sqrt$1(l);
  }; // 获取最小最大值

  const getMinMax = (curve, d, list) => {
    if (!list) return {
      min: 0,
      max: 0
    };
    let min = nMax,
        max = nMin,
        t,
        c;

    if (list.indexOf(0) === -1) {
      list = [0].concat(list);
    }

    if (list.indexOf(1) === -1) {
      list.push(1);
    }

    for (let i = 0, len = list.length; i < len; i++) {
      t = list[i];
      c = curve.get(t);

      if (c[d] < min) {
        min = c[d];
      }

      if (c[d] > max) {
        max = c[d];
      }
    }

    return {
      min,
      max,
      mid: (min + max) / 2,
      size: max - min
    };
  }; // 求根

  const roots = (points, line) => {
    line = line || {
      p1: {
        x: 0,
        y: 0
      },
      p2: {
        x: 1,
        y: 0
      }
    };
    const aligned = align(points, line);

    const reduce = t => 0 <= t && t <= 1;

    let pa = aligned[0].y,
        pb = aligned[1].y,
        pc = aligned[2].y,
        pd = aligned[3].y;
    let d = -pa + 3 * pb - 3 * pc + pd,
        a = 3 * pa - 6 * pb + 3 * pc,
        b = -3 * pa + 3 * pb,
        c = pa; // 判断三次曲线

    /*if (approximately(d, 0)) {
    	// 判断二次曲线
    	if (approximately(a, 0)) {
    		// 判断线性
    		if (approximately(b, 0)) {
    			// 无解
    			return []
    		}
    		return [-c / b].filter(reduce)
    	}
    	// 二次解法
    	let q  = sqrt(b * b - 4 * a * c),
    		a2 = 2 * a
    	return [(q - b) / a2, (-b - q) / a2].filter(reduce)
    }*/
    // 三次解法

    a /= d;
    b /= d;
    c /= d;
    let p = (3 * b - a ** 2) / 3,
        p3 = p / 3,
        q = (2 * a ** 3 - 9 * a * b + 27 * c) / 27,
        q2 = q / 2,
        discriminant = q2 ** 2 + p3 ** 3;
    let u1, v1, x1, x2, x3;

    if (discriminant < 0) {
      let mp3 = -p / 3,
          mp33 = mp3 * mp3 * mp3,
          r = sqrt$1(mp33),
          t = -q / (2 * r),
          cosphi = t < -1 ? -1 : t > 1 ? 1 : t,
          phi = acos$1(cosphi),
          crtr = crt(r),
          t1 = 2 * crtr;
      x1 = t1 * cos$1(phi / 3) - a / 3;
      x2 = t1 * cos$1((phi + TAU) / 3) - a / 3;
      x3 = t1 * cos$1((phi + 2 * TAU) / 3) - a / 3;
      return [x1, x2, x3].filter(reduce);
    } else if (discriminant === 0) {
      u1 = q2 < 0 ? crt(-q2) : -crt(q2);
      x1 = 2 * u1 - a / 3;
      x2 = -u1 - a / 3;
      return [x1, x2].filter(reduce);
    } else {
      const sd = sqrt$1(discriminant);
      u1 = crt(-q2 + sd);
      v1 = crt(q2 + sd);
      return [u1 - v1 - a / 3].filter(reduce);
    }
  }; // 求根

  const droots = p => {
    let [a, b, c] = p; // 二次根

    if (p.length === 3) {
      let d = a - 2 * b + c;

      if (d !== 0) {
        let m1 = -sqrt$1(b * b - a * c),
            m2 = -a + b,
            v1 = -(m1 + m2) / d,
            v2 = -(-m1 + m2) / d;
        return [v1, v2];
      } else if (b !== c && d === 0) {
        return [(2 * b - c) / (2 * (b - c))];
      }

      return [];
    } // 线性根


    if (p.length === 2) {
      if (a !== b) {
        return [a / (a - b)];
      }

      return [];
    }

    return [];
  }; // 数字排序

  const numberSort = list => {
    return list.sort((a, b) => a - b);
  }; // 之间

  const between = (v, m, M) => {
    return m <= v && v <= M || approximately(v, m) || approximately(v, M);
  }; // 约等于

  const approximately = (a, b, precision) => {
    return abs$1(a - b) <= (precision || epsilon);
  }; // 遍历

  const map = (v, ds, de, ts, te) => {
    let d1 = de - ds,
        d2 = te - ts,
        v2 = v - ds,
        r = v2 / d1;
    return ts + d2 * r;
  }; // 对齐

  const align = (points, line) => {
    let {
      p1,
      p2
    } = line,
        tx = p1.x,
        ty = p1.y,
        a = -atan2(p2.y - ty, p2.x - tx);
    return points.map(v => {
      return {
        x: (v.x - tx) * cos$1(a) - (v.y - ty) * sin$1(a),
        y: (v.x - tx) * sin$1(a) + (v.y - ty) * cos$1(a)
      };
    });
  }; // 

  const pairiteration = (c1, c2) => {
    let c1b = c1.bbox(),
        c2b = c2.bbox(),
        r = 100000,
        threshold = 0.5;

    if (c1b.x.size + c1b.y.size < threshold && c2b.x.size + c2b.y.size < threshold) {
      return [(r * (c1._t1 + c1._t2) / 2 | 0) / r + '/' + (r * (c2._t1 + c2._t2) / 2 | 0) / r];
    }

    let cc1 = c1.split(0.5),
        cc2 = c2.split(0.5),
        pairs = [{
      left: cc1.left,
      right: cc2.left
    }, {
      left: cc1.left,
      right: cc2.right
    }, {
      left: cc1.right,
      right: cc2.right
    }, {
      left: cc1.right,
      right: cc2.left
    }];
    pairs = pairs.filter(pair => {
      return bboxoverlap(pair.left.bbox(), pair.right.bbox());
    });
    let results = [];
    if (!pairs.length) return results;
    pairs.forEach(function (pair) {
      results = results.concat(pairiteration(pair.left, pair.right));
    });
    results = results.filter(function (v, i) {
      return results.indexOf(v) === i;
    });
    return results;
  };
  const bboxoverlap = (b1, b2) => {
    let dims = ['x', 'y'],
        len = dims.length,
        dim,
        l,
        t,
        d;

    for (let i = 0; i < len; i++) {
      dim = dims[i];
      l = b1[dim].mid;
      t = b2[dim].mid;
      d = (b1[dim].size + b2[dim].size) / 2;
      if (abs$1(l - t) >= d) return false;
    }

    return true;
  };
  const lerp = (r, v1, v2) => {
    let ret = {
      x: v1.x + r * (v2.x - v1.x),
      y: v1.y + r * (v2.y - v1.y)
    };

    if (v1.z !== undefined && v2.z !== undefined) {
      ret.z = v1.z + r * (v2.z - v1.z);
    }

    return ret;
  };
  const angle = function (o, v1, v2) {
    let dx1 = v1.x - o.x,
        dy1 = v1.y - o.y,
        dx2 = v2.x - o.x,
        dy2 = v2.y - o.y,
        cross = dx1 * dy2 - dy1 * dx2,
        dot = dx1 * dx2 + dy1 * dy2;
    return atan2(cross, dot);
  };

  const {
    abs,
    min,
    max,
    cos,
    sin,
    acos,
    sqrt
  } = Math;
  const PI = Math.PI; // 常量
  // 三次Bezier曲线构造函数

  class DBezier {
    constructor(coords) {
      console.log('version: ' + version);
      let args = coords && coords.forEach ? coords : Array.from(arguments).slice(),
          coordlen,
          len; // 支持对象形势 { x: number, y: number }

      if (getClass(args[0]) === 'Object') {
        const newArgs = [];
        coordlen = args.length;
        args.forEach(point => {
          ['x', 'y'].forEach(d => {
            if (getClass(point[d]) === 'Number') newArgs.push(point[d]);
          });
        });
        args = newArgs;
      }

      len = args.length;

      if (coordlen) {
        if (coordlen !== 4) {
          throw new Error('请输入 4 组 point[] 数据.');
        }
      } else {
        if (len !== 8) {
          throw new Error('请输入 8 个坐标数据.');
        }
      }

      const points = this.points = [];

      for (let i = 0; i < len; i += 2) {
        var point = {
          x: args[i],
          y: args[i + 1]
        };
        points.push(point);
      }

      this.order = points.length - 1;
      this.dims = ['x', 'y'];
      this._lut = []; // 初始化检查票

      this._t1 = 0;
      this._t2 = 1;
      this.version = version;
      this.update();
    } // 曲线坐标 (根据t)


    get(t) {
      return this.compute(t);
    } // 获取点 (根据索引)


    point(idx) {
      return this.points[idx];
    } // 计算


    compute(t) {
      return compute(t, this.points);
    }

    update() {
      this._lut = [];
      this.dpoints = derive(this.points); // this.computedirection()
    }

    length() {
      return length(this.derivative.bind(this));
    } // 求导数


    derivative(t) {
      return compute(t, this.dpoints[0]);
    }

    dderivative(t) {
      return compute(t, this.dpoints[1]);
    } // 获取盒模型


    bbox() {
      const extrema = this.extrema(),
            result = {};
      this.dims.forEach(d => {
        result[d] = getMinMax(this, d, extrema[d]);
      });
      return result;
    }

    overlaps(curve) {
      let lbbox = this.bbox(),
          tbbox = curve.bbox();
      return bboxoverlap(lbbox, tbbox);
    } // 获取极限值


    extrema() {
      let result = {},
          roots = [];
      this.dims.forEach(dim => {
        let mfn = v => v[dim],
            p = this.dpoints[0].map(mfn);

        result[dim] = droots(p);

        if (this.order === 3) {
          p = this.dpoints[1].map(mfn);
          result[dim] = result[dim].concat(droots(p));
        }

        result[dim] = result[dim].filter(t => t >= 0 && t <= 1);
        roots = roots.concat(numberSort(result[dim]));
      });
      result.values = numberSort(roots).filter(function (v, i) {
        return roots.indexOf(v) === i;
      });
      return result;
    } // 相交


    intersects(curve) {
      if (!curve) throw new Error('请输入 曲线 或 直线 数据.'); // 直线相交

      if (curve.p1 && curve.p2) {
        return this.lineIntersects(curve);
      } // 曲线相交


      if (curve instanceof DBezier) {
        curve = curve.reduce();
      }

      return this.curveintersects(this.reduce(), curve);
    } // 自身相交


    selfintersects() {
      // 简单曲线不能与其直接相邻的曲线相交, 因此对于每个线段 X，我们检查它是否与 [0:x-2][x+2:last] 相交。
      let reduced = this.reduce(),
          len = reduced.length - 2,
          results = [];

      for (let i = 0, result, left, right; i < len; i++) {
        left = reduced.slice(i, i + 1);
        right = reduced.slice(i + 2);
        result = this.curveintersects(left, right);
        results.push(...result);
      }

      return results;
    } // 直线相交


    lineIntersects(line) {
      let {
        p1,
        p2
      } = line,
          {
        x: x1,
        y: y1
      } = p1,
          {
        x: x2,
        y: y2
      } = p2;
      let mx = min(x1, x2),
          my = min(y1, y2),
          MX = max(x1, x2),
          MY = max(y1, y2);
      let rootList = roots(this.points, line).filter(t => {
        var p = this.get(t);
        return between(p.x, mx, MX) && between(p.y, my, MY);
      });
      return rootList.map(t => this.get(t)); // return rootList
    } // 曲线相交


    curveintersects(c1, c2) {
      const pairs = []; // step 1: 配对任何重叠的片段

      c1.forEach(function (left) {
        c2.forEach(function (right) {
          if (left.overlaps(right)) {
            pairs.push({
              left,
              right
            });
          }
        });
      }); // step 2: 对于每个配对运行收敛算法

      let intersections = [];
      pairs.forEach(function (pair) {
        const result = pairiteration(pair.left, pair.right);

        if (result.length) {
          intersections = intersections.concat(result);
        }
      });
      return intersections;
    }

    simple() {
      if (this.order === 3) {
        const a1 = angle(this.points[0], this.points[3], this.points[1]);
        const a2 = angle(this.points[0], this.points[3], this.points[2]);
        if (a1 > 0 && a2 < 0 || a1 < 0 && a2 > 0) return false;
      }

      const n1 = this.normal(0);
      const n2 = this.normal(1);
      let s = n1.x * n2.x + n1.y * n2.y;

      if (this._3d) {
        s += n1.z * n2.z;
      }

      return abs(acos(s)) < PI / 3;
    }

    reduce() {
      // 详细检查变量类型
      let i,
          t1 = 0,
          t2 = 0,
          step = 0.01,
          pass1 = [],
          pass2 = [],
          segment; // 第一步: 极值分割

      let extrema = this.extrema().values;
      if (extrema.indexOf(0) === -1) extrema = [0].concat(extrema);
      if (extrema.indexOf(1) === -1) extrema.push(1);

      for (t1 = extrema[0], i = 1; i < extrema.length; i++) {
        t2 = extrema[i];
        segment = this.split(t1, t2);
        segment._t1 = t1;
        segment._t2 = t2;
        pass1.push(segment);
        t1 = t2;
      } // 第二步: 进一步将这些段减少为简单段


      pass1.forEach(p1 => {
        t1 = 0;
        t2 = 0;

        while (t2 <= 1) {
          for (t2 = t1 + step; t2 <= 1 + step; t2 += step) {
            segment = p1.split(t1, t2);

            if (!segment.simple()) {
              t2 -= step;

              if (abs(t1 - t2) < step) {
                return []; // 无法再减少
              }

              segment = p1.split(t1, t2);
              segment._t1 = map(t1, 0, 1, p1._t1, p1._t2);
              segment._t2 = map(t2, 0, 1, p1._t1, p1._t2);
              pass2.push(segment);
              t1 = t2;
              break;
            }
          }
        }

        if (t1 < 1) {
          segment = p1.split(t1, 1);
          segment._t1 = map(t1, 0, 1, p1._t1, p1._t2);
          segment._t2 = p1._t2;
          pass2.push(segment);
        }
      });
      return pass2;
    }

    split(t1, t2) {
      // 捷径
      if (t1 === 0 && !!t2) {
        return this.split(t2).left;
      }

      if (t2 === 1) {
        return this.split(t1).right;
      } // 没有捷径：使用 "de Casteljau" 算法


      const q = this.hull(t1);
      const result = {
        left: this.order === 2 ? new DBezier([q[0], q[3], q[5]]) : new DBezier([q[0], q[4], q[7], q[9]]),
        right: this.order === 2 ? new DBezier([q[5], q[4], q[2]]) : new DBezier([q[9], q[8], q[6], q[3]]),
        span: q
      }; // 确保我们绑定了 _t1/_t2 信息

      result.left._t1 = map(0, 0, 1, this._t1, this._t2);
      result.left._t2 = map(t1, 0, 1, this._t1, this._t2);
      result.right._t1 = map(t1, 0, 1, this._t1, this._t2);
      result.right._t2 = map(1, 0, 1, this._t1, this._t2); // t2不存在

      if (!t2) return result; // t2存在 再拆分

      t2 = map(t2, t1, 1, 0, 1);
      return result.right.split(t2).left;
    }

    hull(t) {
      let p = this.points,
          _p = [],
          q = [],
          idx = 0;
      q[idx++] = p[0];
      q[idx++] = p[1];
      q[idx++] = p[2];

      if (this.order === 3) {
        q[idx++] = p[3];
      } // 我们在每次迭代的所有点之间进行 lerp，直到剩下 1 个点.


      while (p.length > 1) {
        _p = [];

        for (let i = 0, pt, l = p.length - 1; i < l; i++) {
          pt = lerp(t, p[i], p[i + 1]);
          q[idx++] = pt;

          _p.push(pt);
        }

        p = _p;
      }

      return q;
    } // 法线


    normal(t) {
      const d = this.derivative(t);
      const q = sqrt(d.x * d.x + d.y * d.y);
      return {
        x: -d.y / q,
        y: d.x / q
      };
    }

  }

  return DBezier;

})));
//# sourceMappingURL=DBezier.js.map
