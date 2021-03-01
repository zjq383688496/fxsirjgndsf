(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.drawRender = factory());
}(this, (function () { 'use strict';

  var version = "1.0.0";

  const {
    pow,
    sqrt
  } = Math; // 获取真实数据类型

  const getClass = element => {
    return Object.prototype.toString.call(element).slice(8, -1);
  }; // 深拷贝

  const deepCopy = obj => {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (e) {
      console.error(e);
      return obj;
    }
  }; // 对象是否相等

  const getOffset = element => {
    var t;
    const top = (((t = document.documentElement) || (t = document.body.parentNode)) && typeof t.scrollTop === 'number' ? t : document.body).scrollTop;
    const left = (((t = document.documentElement) || (t = document.body.parentNode)) && typeof t.scrollLeft === 'number' ? t : document.body).scrollLeft;
    return {
      top,
      left
    };
  }; // 获取两点间的距离

  const getDistance = (x1, y1, x2, y2) => {
    let dx = x1 - x2,
        dy = y1 - y2;
    return sqrt(pow(dx, 2) + pow(dy, 2));
  };

  const getDefaultValue = {
    x: {
      type: Number,
      default: (val = 0) => val
    },
    // (圆心) x轴坐标
    y: {
      type: Number,
      default: (val = 0) => val
    },
    // (圆心) y轴坐标
    r: {
      type: Number,
      default: (val = 0) => val < 0 ? 0 : val
    },
    // 半径
    rx: {
      type: Number,
      default: (val = 0) => val < 0 ? 0 : val
    },
    // x轴半径
    ry: {
      type: Number,
      default: (val = 0) => val < 0 ? 0 : val
    },
    // y轴半径
    width: {
      type: Number,
      default: (val = 0) => val < 0 ? 0 : val
    },
    // 宽
    height: {
      type: Number,
      default: (val = 0) => val < 0 ? 0 : val
    },
    // 高
    rotate: {
      type: Number,
      default: (val = 0) => val < 0 ? 0 : val > 360 ? 360 : val
    },
    // 旋转角度
    sAngle: {
      type: Number,
      default: (val = 0) => val < 0 ? 0 : val > 360 ? 360 : val
    },
    // 起始角
    eAngle: {
      type: Number,
      default: (val = 360) => val < 0 ? 0 : val > 360 ? 360 : val
    },
    // 结束角
    // 路径
    points: {
      type: Array,
      default: (val = []) => {
        let error = 0;
        val.forEach(vs => {
          if (error) return;
          let t = getClass(vs);
          if (t != 'Array') return error = 1;
          if (vs.length != 2) return error = 1;
          vs.forEach(num => {
            if (error) return;
            let nt = getClass(num);
            if (nt != 'Number') return error = 1;
          });
        });
        if (error || val.length < 2) return [];
        val[-1] = val[val.length - 1];
        return val;
      }
    },
    opacity: {
      type: Number,
      default: (val = 1) => val < 0 ? 0 : val > 1 ? 1 : val
    },
    // 透明度
    fill: {
      type: String,
      default: val => val || 'black'
    },
    // 填充色
    stroke: {
      type: String,
      default: val => val || 'rgba(0, 0, 0, 0)'
    },
    // 描边色
    strokeWidth: {
      type: Number,
      default: (val = 0) => val < 0 ? 0 : val
    } // 描边宽

  }; // 属性字段索引

  const keysMap = {
    rect: ['x', 'y', 'width', 'height', 'opacity', 'fill', 'stroke', 'strokeWidth'],
    circle: ['x', 'y', 'r',
    /*'sAngle', 'eAngle',*/
    'opacity', 'fill', 'stroke', 'strokeWidth'],
    ellipse: ['x', 'y', 'rx', 'ry',
    /*'rotate', 'sAngle', 'eAngle',*/
    'opacity', 'fill', 'stroke', 'strokeWidth'],
    polygon: ['points', 'opacity', 'fill', 'stroke', 'strokeWidth']
  };
  const filter = (name, cfg) => {
    let attrs = cfg.attrs;
    if (!attrs) attrs = cfg.attrs = {};
    let kMap = keysMap[name];
    if (!kMap) return; // 过滤多余属性

    Object.keys(attrs).forEach(key => {
      let idx = kMap.indexOf(key);
      if (idx < 0) delete attrs[key];
    }); // 检测 & 赋值默认值

    kMap.forEach(key => {
      let val = attrs[key],
          def = getDefaultValue[key],
          tName = def.type.name,
          cName;
      if (val === undefined) return attrs[key] = def.default(); // 空值赋值

      cName = getClass(val);
      if (cName != tName) return attrs[key] = def.default(); // 类型不正确赋值

      attrs[key] = def.default(val);
    });
  };

  class rect {
    constructor(cfg = {}, parent) {
      this.cfg = cfg;
      this.parent = parent;
      this.group = [];
      this.init(cfg);
      this.draw(cfg, this.group);
      if (cfg.name) this.name = cfg.name;
    }

    init(cfg) {
      filter('rect', cfg);
    }

    draw(cfg, group) {
      let {
        ctx
      } = this.parent;
      let {
        x,
        y,
        width,
        height,
        opacity,
        fill,
        stroke,
        strokeWidth
      } = cfg.attrs; // 设置画板透明度

      if (opacity < 1) ctx.globalAlpha = opacity;
      ctx.beginPath(); // 绘制矩形

      ctx.rect(x, y, width, height); // 填充颜色

      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      } // 描边


      if (stroke && strokeWidth > 0) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
      }

      ctx.closePath();
      ctx.globalAlpha = 1;
    } // 根据坐标判断点是否在矩形内


    pointIn(offsetX, offsetY) {
      let {
        x,
        y,
        width,
        height
      } = this.cfg.attrs;
      let ex = x + width,
          ey = y + height;
      return offsetX >= x && offsetX <= ex && offsetY >= y && offsetY <= ey;
    }

  }

  const {
    PI
  } = Math;
  class circle {
    constructor(cfg = {}, parent) {
      this.cfg = cfg;
      this.parent = parent;
      this.group = [];
      this.init(cfg);
      this.draw(cfg, this.group);
      if (cfg.name) this.name = cfg.name;
    }

    init(cfg) {
      filter('circle', cfg);
    }

    draw(cfg, group) {
      let {
        ctx
      } = this.parent;
      let {
        x,
        y,
        r,
        sAngle,
        eAngle,
        opacity,
        fill,
        stroke,
        strokeWidth
      } = cfg.attrs; // 设置画板透明度

      if (opacity < 1) ctx.globalAlpha = opacity;
      ctx.beginPath(); // 绘制矩形

      ctx.arc(x, y, r, sAngle / 180 * PI, eAngle / 180 * PI); // 填充颜色

      ctx.fillStyle = fill;
      ctx.fill(); // 描边

      if (strokeWidth) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
      }

      ctx.closePath();
      ctx.globalAlpha = 1;
    } // 根据坐标判断点是否在矩形内


    pointIn(offsetX, offsetY) {
      let {
        x,
        y,
        r
      } = this.cfg.attrs;
      let dis = getDistance(offsetX, offsetY, x, y);
      return dis <= r;
    }

  }

  class rect$1 {
    constructor(cfg = {}, parent) {
      this.cfg = cfg;
      this.parent = parent;
      this.group = [];
      this.init(cfg);
      this.draw(cfg, this.group);
      if (cfg.name) this.name = cfg.name;
    }

    init(cfg) {
      filter('polygon', cfg);
    }

    draw(cfg, group) {
      let {
        ctx
      } = this.parent;
      let {
        points,
        opacity,
        fill,
        stroke,
        strokeWidth
      } = cfg.attrs; // 设置画板透明度

      if (opacity < 1) ctx.globalAlpha = opacity;
      ctx.beginPath(); // 绘制矩形

      let [x, y] = points[0];
      ctx.moveTo(x, y);
      points.forEach((point, i) => {
        if (!i) return;
        let [x, y] = point;
        ctx.lineTo(x, y);
      });
      ctx.lineTo(x, y); // 线闭合
      // 填充颜色

      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      } // 描边


      if (stroke && strokeWidth > 0) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
      }

      ctx.closePath();
      ctx.globalAlpha = 1;
    } // 根据坐标判断点是否在矩形内


    pointIn(offsetX, offsetY) {
      let {
        points
      } = this.cfg.attrs;
      let isIn = false;
      points.forEach(([x1, y1], i) => {
        let [x2, y2] = points[i - 1],
            dx = x2 - x1,
            dy = y2 - y1; // 判断当前点的y轴是否在两点之间 不在则不相交

        if (y1 > offsetY === y2 > offsetY) return;
        let scale = (offsetY - y1) / dy; // y轴比率

        let ox = x1 + dx * scale; // 交点x轴坐标
        // 判断交点在当前点哪边 左边则不相交

        if (ox > offsetX) return;
        isIn = !isIn;
      });
      return isIn;
    }

  }

  const {
    PI: PI$1
  } = Math;
  class ellipse {
    constructor(cfg = {}, parent) {
      this.cfg = cfg;
      this.parent = parent;
      this.group = [];
      this.init(cfg);
      this.draw(cfg, this.group);
      if (cfg.name) this.name = cfg.name;
    }

    init(cfg) {
      filter('ellipse', cfg);
    }

    draw(cfg, group) {
      let {
        ctx
      } = this.parent;
      let {
        x,
        y,
        rx,
        ry,
        rotate,
        sAngle,
        eAngle,
        opacity,
        fill,
        stroke,
        strokeWidth
      } = cfg.attrs; // 设置画板透明度

      if (opacity < 1) ctx.globalAlpha = opacity;
      ctx.beginPath(); // 绘制椭圆

      ctx.ellipse(x, y, rx, ry, 0, 0, 2 * PI$1); // 填充颜色

      ctx.fillStyle = fill;
      ctx.fill(); // 描边

      if (strokeWidth) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
      }

      ctx.closePath();
      ctx.globalAlpha = 1;
    } // 根据坐标判断点是否在矩形内


    pointIn(offsetX, offsetY) {
      let {
        x,
        y,
        r
      } = this.cfg.attrs;
      let dis = getDistance(offsetX, offsetY, x, y);
      return dis <= r;
    }

  }

  var shapeRender = /*#__PURE__*/Object.freeze({
    __proto__: null,
    rect: rect,
    circle: circle,
    polygon: rect$1,
    ellipse: ellipse
  });

  (function () {
    // 创建椭圆
    if (CanvasRenderingContext2D.prototype.ellipse === undefined) {
      CanvasRenderingContext2D.prototype.ellipse = function (x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
        this.save();
        this.translate(x, y);
        this.rotate(rotation);
        this.scale(radiusX, radiusY);
        this.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
        this.restore();
      };
    }
  })();

  const allowTypeMap = {
    String: container => document.querySelector(`#${container}`),
    HTMLDivElement: container => container
  };
  const defaultOptions = {};

  class DRender {
    constructor(container, options = {}) {
      let type = getClass(container),
          allow = allowTypeMap[type],
          $container;
      if (!allow) return console.error('请指定图画布容器的 id 或 div元素');
      $container = allow(container);
      if (!$container) return console.error('请指定图画布容器的 id 或 div元素');
      this.container = $container;
      this.options = { ...deepCopy(defaultOptions),
        ...options
      };
      this.optionsInit($container, this.options);
      this.init($container, this.options);
      this.version = version;
      console.log('version ' + version);
    } // 配置初始化


    optionsInit(container, options) {
      let {
        scrollWidth,
        scrollHeight
      } = container;
      let {
        width,
        height
      } = options;
      if (width === undefined) options.width = scrollWidth;
      if (height === undefined) options.height = scrollHeight;
    } // 初始化


    init(container, options) {
      this.nodes = [];
      this.createCanvas();
      this.eventListener();
    } // 创建画布


    createCanvas() {
      const {
        container,
        options
      } = this;
      const {
        width,
        height
      } = options;
      const canvas = this.graph = document.createElement('canvas');
      this.ctx = canvas.getContext('2d');
      Object.assign(canvas, {
        width,
        height
      });
      container.appendChild(canvas);
    } // 事件监听


    eventListener() {
      const {
        container,
        ctx,
        nodes
      } = this;
      container.addEventListener('click', function (e) {
        let {
          offsetX,
          offsetY
        } = e;
        getOffset(); // console.log(offset, offsetX, offsetY, inPath)
        // console.log(offsetX, offsetY)

        let curNode;
        nodes.forEach(node => {
          let isIn = node.pointIn(offsetX, offsetY);
          if (!isIn) return;
          curNode = node;
        });
        if (!curNode) return;
        console.log(curNode);
      }, false);
    } // 添加图形


    addNode(shapeName, config = {}) {
      const Shape = shapeRender[shapeName];
      if (!Shape) return console.error(`${shapeName} 图形不存在!`);
      const shape = new Shape(config, this);
      this.nodes.push(shape);
    }

  }

  return DRender;

})));
//# sourceMappingURL=drawRender.js.map
