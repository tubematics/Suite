webpackJsonp([1],{

/***/ "+Ig7":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3__ = __webpack_require__("vwbq");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_bus__ = __webpack_require__("qKYu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_txt__ = __webpack_require__("pKHy");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* eslint-disable */





/* harmony default export */ __webpack_exports__["a"] = ({
  name: "vue-line-chart",
  props: ["activePart"],
  components: { txt: __WEBPACK_IMPORTED_MODULE_3__components_txt__["a" /* default */] },
  data: function data() {
    return {
      defaultOpenedDetails: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      data: [],
      total: 0,
      fromID: 0,
      toID: 0,
      numberIDsDisplayed: 250,
      width: 500,
      height: 100,
      margin: { left: 40, right: 20, top: 10, bottom: 30 },
      yLines: [{ val: 1.2, color: "red" }, { val: 1.0, color: "yellow" }, { val: 0.7, color: "lightgray" }, { val: 0.4, color: "yellow" }, { val: 0.2, color: "red" }],
      mnr: 0,
      svg: [],
      axis: [],
      extraLines: [],
      valueline: {},
      params: {}
    };
  },

  methods: {
    reDrawChart: function reDrawChart(mnr, data) {
      var self = this;
      setTimeout(function () {
        self.drawChart(mnr, data);
      }, 200);
    },
    drawChart: function drawChart(mnr, data) {
      // set the dimensions and margins of the graph
      // var margin = {top: 10, right: 30, bottom: 30, left: 50}
      var width = this.width - this.margin.left - this.margin.right;
      var height = 150 - this.margin.top - this.margin.bottom;

      // append the svg object to the body of the page
      this.svg[mnr] = __WEBPACK_IMPORTED_MODULE_0_d3__["g" /* select */]("#graph" + mnr).append("svg").attr("width", width + this.margin.left + this.margin.right).attr("height", height + this.margin.top + this.margin.bottom).append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

      // Initialise a X axis:
      var x = __WEBPACK_IMPORTED_MODULE_0_d3__["f" /* scaleLinear */]().range([0, width]);
      var xAxis = __WEBPACK_IMPORTED_MODULE_0_d3__["a" /* axisBottom */]().scale(x);
      this.svg[mnr].append("g").attr("transform", "translate(0," + height + ")").attr("class", "myXaxis");

      // Initialize an Y axis
      var y = __WEBPACK_IMPORTED_MODULE_0_d3__["f" /* scaleLinear */]().range([height, 0]);
      var yAxis = __WEBPACK_IMPORTED_MODULE_0_d3__["b" /* axisLeft */]().scale(y);
      this.svg[mnr].append("g").attr("class", "myYaxis");

      this.axis.push({ x: x, y: y, xAxis: xAxis, yAxis: yAxis });

      // Make a group for tolerances and warning limits
      this.extraLines[mnr] = this.svg[mnr].append("g").attr("class", "extra-lines");

      var yLines = this.yLines;
      var wdth = this.width - this.margin.left - this.margin.right;
      // Draw extra coloured lines from yLines array
      this.extraLines[mnr].selectAll(".extra-line").data(yLines).enter().append("line").attr("class", "extra-line").attr("x1", 0).attr("x2", wdth).attr("stroke", function (d) {
        return d.color;
      }).attr("y1", 0) // dummy value will be overwritten in updateChart
      .attr("y2", 0).attr("stroke-width", 1).attr("opacity", 0.5);

      // At the beginning, I run the update function on the first dataset:
      this.updateChart(mnr, data);
    },
    updateChart: function updateChart(mnr, data) {
      // Create a function that takes a dataset as input and update the plot:
      // Create the X axis:
      var from = this.fromID;
      var to = this.toID;
      this.axis[mnr].x.domain([from, to]); // d3.max(data, function (d, i) { return i })])

      this.svg[mnr].selectAll(".myXaxis")
      // .transition()
      .call(this.axis[mnr].xAxis);

      var ut = this.activePart.coi[mnr].ut;
      var lt = this.activePart.coi[mnr].lt;
      // create the Y axis
      var ma = Math.max(__WEBPACK_IMPORTED_MODULE_0_d3__["d" /* max */](data, function (d) {
        return d.values[mnr].v;
      }), ut);
      var mi = Math.min(__WEBPACK_IMPORTED_MODULE_0_d3__["e" /* min */](data, function (d) {
        return d.values[mnr].v;
      }), lt);
      this.axis[mnr].y.domain([mi, ma]);
      this.svg[mnr].selectAll(".myYaxis")
      // .transition()
      .call(this.axis[mnr].yAxis);

      // Create a update selection: bind to the new data
      var u = this.svg[mnr].selectAll(".lineTest").data([data], function (d) {
        return d;
      });

      var x = this.axis[mnr].x;
      var y = this.axis[mnr].y;
      // Updata the line
      u.enter().append("path").attr("class", "lineTest").merge(u)
      // .transition()
      .attr("d", __WEBPACK_IMPORTED_MODULE_0_d3__["c" /* line */]().x(function (d, i) {
        return x(i + from);
      }).y(function (d) {
        return y(d.values[mnr].v);
      })).attr("fill", "none").attr("stroke", "white").attr("stroke-width", 1);

      // adjust the ylines according to the new y axis
      var yLines = this.yLines;
      yLines[0].val = this.activePart.coi[mnr].ut;
      yLines[1].val = this.activePart.coi[mnr].uw;
      yLines[2].val = this.activePart.coi[mnr].nm;
      yLines[3].val = this.activePart.coi[mnr].lw;
      yLines[4].val = this.activePart.coi[mnr].lt;
      this.extraLines[mnr].selectAll(".extra-line").data(yLines).attr("y1", function (d) {
        return y(d.val);
      }).attr("y2", function (d) {
        return y(d.val);
      });
    },
    mqttUpdateChart: function mqttUpdateChart(status) {
      if (this.data.length >= this.numberIDsDisplayed) {
        this.data.shift();
        this.fromID += 1;
      }
      this.data.push(status.record);
      this.toID += 1;
      for (var i = 0; i < status.record.values.length; i++) {
        this.updateChart(i, this.data);
      }
    }
  },
  mounted: function mounted() {
    var _this = this;

    // console.log(this.activePart)
    // console.log(this.params)
    // this.width = document.getElementById('imgWrapper').clientWidth - 80
    this.width = document.getElementById("routerViewWrapper").clientWidth - 80;
    __WEBPACK_IMPORTED_MODULE_1_axios___default.a.get("/api/v1/Project/getOrder?extid=0000").then(function (response) {
      var order = response.data;
      var params = "part=" + order.part + "&order=" + order.order;
      __WEBPACK_IMPORTED_MODULE_1_axios___default.a.get("/api/v1/Project/getLatestMeasuredValuesFile?" + params + "&count=-" + _this.numberIDsDisplayed).then(function (response) {
        _this.data = response.data.data;
        _this.total = parseInt(response.data.total);
        _this.fromID = _this.total - _this.numberIDsDisplayed;
        if (_this.fromID < 1) {
          _this.fromID = 1;
        }
        _this.toID = _this.total;
        // console.log(this.data)
        // console.log(this.activePart)
        for (var coi = 0; coi < _this.activePart.coi.length; coi++) {
          if (_this.data.length > 0) {
            if (coi < _this.data[0].values.length) {
              console.log(coi);
              // var self = this
              // setTimeout(function () {
              //   self.drawChart(coi, this.data)
              // }, 200)
              _this.drawChart(coi, _this.data);
            }
          }
        }
      }).catch(function (error) {
        console.log(error);
      });
    });
    // Used to update the chart
    __WEBPACK_IMPORTED_MODULE_2__components_bus__["a" /* default */].$on("statusUpdate", this.mqttUpdateChart);
  },

  beforeDestroy: function beforeDestroy() {
    __WEBPACK_IMPORTED_MODULE_2__components_bus__["a" /* default */].$off("statusUpdate", this.mqttUpdateChart);
  }
});

/***/ }),

/***/ "+a96":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__("mvHQ");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_toConsumableArray__ = __webpack_require__("Gu7T");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_toConsumableArray___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_toConsumableArray__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_bus__ = __webpack_require__("qKYu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_aiCore_toolMixin__ = __webpack_require__("lQcu");


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'toolLines',
  mixins: [__WEBPACK_IMPORTED_MODULE_3__components_aiCore_toolMixin__["a" /* default */]],
  props: ['activePlugin', 'pluginConfig', 'targets', 'activePart'],
  components: {},
  data: function data() {
    return {
      isShowModal: false,
      scale: 1,
      activeTool: 'P2P',
      moiId: 0,
      moiIdSelected: 0,
      path: '',
      idStr: '',
      points: [],
      lines: [],
      moi: [],
      message: '',
      arrowDown: true,
      tools: [{ name: 'Mittig', pts: 2, disabled: false, tooltip: 'Mitte', selected: false, cursor: '' }, { name: 'Links', pts: 3, disabled: false, tooltip: 'Links', selected: false, cursor: '' }, { name: 'Rechts', pts: 4, disabled: false, tooltip: 'Rechts', selected: false, cursor: '' }]
    };
  },

  methods: {
    toggleLineAccordion: function toggleLineAccordion(id) {
      console.log(id);
      var e = document.getElementById(id);
      e.classList.toggle('active');
      var panel = document.getElementById(id + 'panel');
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    },
    insertMoi: function insertMoi(path) {
      this.moi.push({ id: this.moiId, type: this.activeTool, nickname: 'MOI.' + this.moiId, path: path });
      this.moiId++;
      this.points = [];
      this.idStr = '';
      this.path = '';
    },
    updateMoi: function updateMoi(moi) {
      var container = document.querySelector('#frameInOut');
      var matches = container.querySelectorAll('circle,line');
      matches.forEach(function (item) {
        if (moi.path.indexOf(item.id) < 0) {
          item.setAttribute('stroke', 'magenta');
        }
      });
      matches.forEach(function (item) {
        if (moi.path.indexOf(item.id) >= 0) {
          item.setAttribute('stroke', 'purple');
        }
      });
    },
    deleteMoi: function deleteMoi(id) {
      for (var i = 0; i < this.moi.length; i++) {
        if (this.moi[i].id === id) {
          this.moi.splice(i, 1);
          this.reset('M.' + id);
          this.reset('MP.' + id);
          break;
        }
      }
    },
    selectMoi: function selectMoi(m) {
      for (var i = 0; i < this.moi.length; i++) {
        document.getElementById('moiList_' + this.moi[i].id).classList.remove('is-selected');
        if (this.moi[i].id === m.id) {
          document.getElementById('moiList_' + this.moi[i].id).classList.add('is-selected');
          this.highlightMoi(this.moi[i]);
        }
      }
    },
    highlightMoi: function highlightMoi(m) {
      console.log('highlightMoi');
      console.log(m);
      // for (var i = 0; i < this.moi.length; i++) {
      // this.updateMoi('M.' + this.moi[i].id, 'magenta')
      // this.updateMoi('MP.' + this.moi[i].id, 'magenta')
      // }
      this.updateMoi(m);
      // this.updateMoi('MP.' + m.id, 'lime')
    },
    selectMTool: function selectMTool(tool) {
      for (var i = 0; i < this.tools.length; i++) {
        if (tool.name === this.tools[i].name) {
          this.tools[i].selected = true;
          this.activeTool = this.tools[i].name;
        } else {
          this.tools[i].selected = false;
        }
      }
    },
    selectedMTool: function selectedMTool(tool) {
      if (tool.name === this.activeTool) {
        return 'is-link';
      } else {
        return '';
      }
    },
    buildName: function buildName(clkInfo) {
      var sep = '~';
      this.idStr = 'M.' + this.moiId + '.' + this.points.length + sep + this.activeTool;
      this.path += sep + clkInfo.id;
      return this.idStr + this.path;
    },
    mouseEvent: function mouseEvent(clkInfo) {
      var s = clkInfo.xDiv / clkInfo.trueX;
      if (clkInfo.state === 'mouseup' && clkInfo.id !== '$BG') {
        var _points;

        (_points = this.points).push.apply(_points, __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_toConsumableArray___default()(this.getPointsFromSVG(clkInfo.id)));
        console.log(this.points);
        var path = this.buildName(clkInfo);
        var ptsReq = this.getNoOfPtsRequired(this.activeTool);
        this.message = 'point ' + this.points.length + '/' + ptsReq + ' saved';
        if (ptsReq >= this.points.length && this.points.length >= 2) {
          this.calcAndDrawSvgPoints(s, path, this.moiId, this.points, ptsReq);
          if (ptsReq === this.points.length) {
            this.insertMoi(path);
            this.message = 'finished - select tool';
            var self = this;
            setTimeout(function () {
              self.message = '';
            }, 2000);
          }
        }
      }
    },
    calcAndDrawSvgPoints: function calcAndDrawSvgPoints(s, path, moiId, points, ptsReq) {
      var col = 'magenta';
      var calc = path.split('~')[1];
      var m, a, b, c, d, x, y, x1, y1, x2, y2;
      if (points.length === 1) {
        // this.arc('MP.' + moiId + '.1', points[0].x * s, points[0].y * s, 6, col)
      }
      if (points.length === 2) {
        this.line(path, points[0].x * s, points[0].y * s, points[1].x * s, points[1].y * s, col);
        // this.arc('MP.' + moiId + '.2', points[1].x * s, points[1].y * s, 6, col)
      }
      if (points.length === 3 && ptsReq === 3) {
        m = (points[0].y - points[1].y) / (points[0].x - points[1].x);
        c = points[1].y - m * points[1].x;
        // this.d3 = Math.abs(c + m * this.points[2].x - this.points[2].y) / (Math.sqrt(1 + m * m))
        // calculate P4 as intersection line P1-P2 and point P3
        x = (points[2].x + m * points[2].y - m * c) / (Math.pow(m, 2) + 1);
        y = c + m * (points[2].x + m * points[2].y - m * c) / (Math.pow(m, 2) + 1);
        this.arc('MP.' + moiId + '.4', x * s, y * s, 6, col);
        this.line(path, x * s, y * s, points[2].x * s, points[2].y * s, col);
      }
      if (points.length === 4 && calc === 'L2L') {
        this.line(path, points[0].x * s, points[0].y * s, points[1].x * s, points[1].y * s, col);
        this.line(path, points[2].x * s, points[2].y * s, points[3].x * s, points[3].y * s, col);
        x1 = (points[0].x + points[1].x) / 2;
        y1 = (points[0].y + points[1].y) / 2;
        x2 = (points[2].x + points[3].x) / 2;
        y2 = (points[2].y + points[3].y) / 2;
        this.arc('MP.' + moiId + '.5', x1 * s, y1 * s, 6, col);
        this.arc('MP.' + moiId + '.6', x2 * s, y2 * s, 6, col);
        this.line(path, x1 * s, y1 * s, x2 * s, y2 * s, col);
      }
      if (points.length === 4 && calc === 'LLP') {
        a = (points[0].y - points[1].y) / (points[0].x - points[1].x);
        b = (points[2].y - points[3].y) / (points[2].x - points[3].x);
        c = points[1].y - a * points[1].x;
        d = points[3].y - b * points[3].x;
        // calculate P4 as intersection line P1-P2 and line P3-P4
        x = (d - c) / (a - b);
        y = a * x + c;
        console.log(a, b, c, d, x, y);
        this.arc('MP.' + moiId + '.5', x * s, y * s, 6, col);
        this.line(path, x * s, y * s, points[0].x * s, points[0].y * s, col);
        this.line(path, x * s, y * s, points[3].x * s, points[3].y * s, col);
      }
    },
    getNoOfPtsRequired: function getNoOfPtsRequired(tool) {
      for (var i = 0; i < this.tools.length; i++) {
        if (tool === this.tools[i].name) {
          return this.tools[i].pts;
        }
      }
      return 0;
    },
    getPointsFromSVG: function getPointsFromSVG(id) {
      var s = this.scale;
      var p = [];
      var t = document.getElementById(id);
      if (t !== null) {
        p.push({ x: parseFloat(t.getAttribute('cx')) / s, y: parseFloat(t.getAttribute('cy')) / s });
      }
      return p;
    },
    insertSvg: function insertSvg(path) {
      var s = this.scale;
      var pts = [];
      var p = path.split('~');
      var ptsReq = this.getNoOfPtsRequired(p[1]);
      for (var i = 2; i < p.length; i++) {
        // var pt = p[i].split('.')
        var id = p[i]; // 'LP.' + pt[1] + '.' + pt[2]
        if (id.indexOf('LP') === 0 || id.indexOf('MP') === 0 || id.indexOf('CP') === 0) {
          pts.push(this.getPointsFromSVG(id)[0]);
          // console.log(ptsReq, pts.length)
          if (ptsReq >= pts.length && pts.length >= 2) {
            var idx = p[0].split('.')[1];
            this.calcAndDrawSvgPoints(s, path, idx, pts, ptsReq);
          }
        }
      }
    },
    reset: function reset(id) {
      this.path = '';
      this.points = [];
      this.d3 = 0;
      var container = document.querySelector('#frameInOut');
      var matches = container.querySelectorAll('circle,line');
      // console.log(matches)
      matches.forEach(function (item) {
        if (item.id.indexOf(id) === 0) {
          container.removeChild(item);
        }
      });
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.scale = document.getElementById('imageDiv').clientWidth / 2048;
    var s = this.scale;
    for (var i = 0; i < this.targets.length; i++) {
      var t = this.targets[i];
      var did = document.getElementById('L' + t.id);
      if (did !== null) {
        did.remove();
      }
      if (t.type === 'Line') {
        this.lines.push(i);
        t.x1 = parseFloat(t.cx) - parseFloat(t.w) / 2 * Math.cos(parseFloat(t.angle));
        t.y1 = parseFloat(t.cy) - parseFloat(t.w) / 2 * Math.sin(parseFloat(t.angle));
        t.x2 = parseFloat(t.cx) + parseFloat(t.w) / 2 * Math.cos(parseFloat(t.angle));
        t.y2 = parseFloat(t.cy) + parseFloat(t.w) / 2 * Math.sin(parseFloat(t.angle));
        console.log(t);
        this.line('L.' + t.id, t.x1 * s, t.y1 * s, t.x2 * s, t.y2 * s, 'lime');
        this.arc('LP.' + t.id + '.1', t.x1 * s, t.y1 * s, 6, 'lime');
        this.arc('LP.' + t.id + '.2', t.x2 * s, t.y2 * s, 6, 'lime');
        this.arc('LP.' + t.id + '.3', t.cx * s, t.cy * s, 6, 'lime');
      }
      if (t.type === 'Circle') {
        this.arc('CP.' + t.id, t.cx * s, t.cy * s, 6, 'aqua');
      }
    }
    this.moi = JSON.parse(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(this.activePart.moi));
    this.moiId = 0;
    for (i = 0; i < this.moi.length; i++) {
      // console.log(this.moi[i].path)
      var id = parseInt(this.moi[i].path.split('~')[0].split('.')[1]);
      this.insertSvg(this.moi[i].path);
      if (id >= this.moiId) {
        this.moiId = id + 1;
        this.moiIdSelected = this.moiId;
      }
      // this.updateMoi(this.moi[i])  // SG No selection on start lines stay yellow
    }
    __WEBPACK_IMPORTED_MODULE_2__components_bus__["a" /* default */].$on('mouseEvent', function (clkInfo) {
      _this.mouseEvent(clkInfo);
    });
  },
  beforeDestroy: function beforeDestroy() {
    __WEBPACK_IMPORTED_MODULE_2__components_bus__["a" /* default */].$off('mouseEvent');
    this.activePart.moi = JSON.parse(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(this.moi));
    __WEBPACK_IMPORTED_MODULE_2__components_bus__["a" /* default */].$emit('updatePart', this.activePart);
  }
});

/***/ }),

/***/ "+htq":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "/2h+":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
//
//
//
//
//
//
//
//
//


// NOT IN USE AT THE MOMENT
/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'toolTestButtons',
  components: {},
  props: ['activePlugin', 'pluginConfig', 'activeProject'],
  data: function data() {
    return {};
  },

  methods: {
    sendCmd: function sendCmd(cmd) {
      __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('/api/v1/Project/sendCmd?' + cmd).then(function (response) {
        console.log(response.data);
      }).catch(function (error) {
        console.log(error);
      });
    }
  },
  mounted: function mounted() {},
  beforeDestroy: function beforeDestroy() {}
});

/***/ }),

/***/ "/8fB":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_bus__ = __webpack_require__("qKYu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue_context__ = __webpack_require__("L84e");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_txt__ = __webpack_require__("pKHy");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'toolColorPicker',
  components: {
    VueContext: __WEBPACK_IMPORTED_MODULE_2_vue_context__["a" /* VueContext */],
    txt: __WEBPACK_IMPORTED_MODULE_3__components_txt__["a" /* default */]
  },
  props: ['activePlugin', 'pluginConfig'],
  data: function data() {
    return {
      col: {}
    };
  },

  methods: {
    setHSVCfgVal: function setHSVCfgVal(opt) {
      if (opt === 'max') {
        this.pluginConfig.upperH.value = parseInt(this.col.h) + 10;
        if (this.pluginConfig.upperH.value > 360) {
          this.pluginConfig.upperH.value = 360;
        }
        this.pluginConfig.upperS.value = parseInt(this.col.s * 100) + 10;
        if (this.pluginConfig.upperS.value > 100) {
          this.pluginConfig.upperS.value = 100;
        }
        this.pluginConfig.upperV.value = parseInt(this.col.v * 100) + 10;
        if (this.pluginConfig.upperV.value > 100) {
          this.pluginConfig.upperV.value = 100;
        }
      }
      if (opt === 'min') {
        this.pluginConfig.lowerH.value = parseInt(0);
        if (this.pluginConfig.lowerH.value < 0) {
          this.pluginConfig.lowerH.value = 0;
        }
        this.pluginConfig.lowerS.value = parseInt(this.col.s * 100) - 10;
        if (this.pluginConfig.lowerS.value < 0) {
          this.pluginConfig.lowerS.value = 0;
        }
        this.pluginConfig.lowerV.value = parseInt(this.col.v * 100) - 10;
        if (this.pluginConfig.lowerV.value < 0) {
          this.pluginConfig.lowerV.value = 0;
        }
      }
    },
    pad: function pad(num, size) {
      var s = '000000000' + num;
      return s.substr(s.length - size);
    },
    pixelInfo: function pixelInfo(clkInfo) {
      var _this = this;

      var data = { 'plugin': this.activePlugin, 'frameIn': clkInfo.showFrameIn, 'channel': 0, 'x': clkInfo.x, 'y': clkInfo.y };
      __WEBPACK_IMPORTED_MODULE_0_axios___default.a.post('/api/v1/' + this.activePlugin + '/getPixelInfo', data).then(function (response) {
        console.log(response.data);
        _this.col = response.data;
        var rgb = document.getElementById('resultRGB');
        var farbe = document.getElementById('resultCOL');
        var hsv = document.getElementById('resultHSV');
        var rgbStr = _this.pad(parseInt(_this.col.r).toString(16).toUpperCase(), 2) + _this.pad(parseInt(_this.col.g).toString(16).toUpperCase(), 2) + _this.pad(parseInt(_this.col.b).toString(16).toUpperCase(), 2);
        rgb.innerHTML = '#' + rgbStr + '<br>(' + _this.col.r + ',' + _this.col.g + ',' + _this.col.b + ')';
        farbe.style.backgroundColor = '#' + rgbStr;
        hsv.innerHTML = 'HSV:<br>' + parseFloat(_this.col.h).toFixed(0) + '° ' + parseFloat(_this.col.s * 100).toFixed(0) + '% ' + parseFloat(_this.col.v * 100).toFixed(0) + '%';
      }).catch(function (error) {
        console.log(error);
      });
    }
  },
  mounted: function mounted() {
    var self = this;
    __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$on('mouseEvent', function (clkInfo) {
      console.log(clkInfo);
      // if (self.activePlugin === 'Color') {
      self.pixelInfo(clkInfo);
      // }
    });
  },
  beforeDestroy: function beforeDestroy() {
    __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$off('mouseEvent');
  }
});

/***/ }),

/***/ "/KV2":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "/OBA":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "/dDi":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "04CT":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"columns is-12 is-gapless",attrs:{"id":"app"}},[_c('div',{staticClass:"column is-4"},[_c('sidebarWrapper',{attrs:{"activePlugin":_vm.activePlugin,"activeProject":_vm.activeProject,"activePart":_vm.activePart,"targets":_vm.targets,"startedFlag":_vm.startedFlag,"cycleTimes":_vm.cycleTimes,"totalCycleTime":_vm.totalCycleTime,"runningMode":_vm.runningMode,"pluginConfig":_vm.pluginConfig,"configData":_vm.configData,"cfList":_vm.cfList,"stereoCameras":_vm.stereoCameras}})],1),_vm._v(" "),_c('div',{staticClass:"column is-8"},[_c('navbarTop',{attrs:{"activeProject":_vm.activeProject,"showParts":_vm.showParts,"showCharts":_vm.showCharts,"showOrders":_vm.showOrders,"showTargets":_vm.showTargets,"runningMode":_vm.runningMode}}),_vm._v(" "),_c('div',{attrs:{"id":"routerViewWrapper"}},[_c('div',{attrs:{"id":"routerViewSubWrapper"}},[(_vm.runningMode === 0 && _vm.showCharts == false)?_c('pluginViewer',{attrs:{"id":"routerView","configData":_vm.configData,"cfList":_vm.cfList,"stereoCameras":_vm.stereoCameras,"activePlugin":_vm.activePlugin,"activeProject":_vm.activeProject,"activePart":_vm.activePart,"pluginConfig":_vm.pluginConfig,"targets":_vm.targets}}):_vm._e(),_vm._v(" "),(_vm.showCharts)?_c('chartContainer',{attrs:{"activePart":_vm.activePart}}):_vm._e(),_vm._v(" "),_c('router-view',{attrs:{"id":"routerViewInfo","configData":_vm.configData,"cfList":_vm.cfList,"stereoCameras":_vm.stereoCameras,"activePlugin":_vm.activePlugin,"activeProject":_vm.activeProject,"activePart":_vm.activePart,"pluginConfig":_vm.pluginConfig,"targets":_vm.targets}})],1)]),_vm._v(" "),_c('div',{staticClass:"column has-text-centered"},[_c('trackerContainer',{attrs:{"id":"","activeProject":_vm.activeProject,"activePart":_vm.activePart}})],1)],1),_vm._v(" "),_c('notificationDisplay'),_vm._v(" "),(_vm.activeProject.projectName)?_c('mqtt',{attrs:{"subscriptionFilter":_vm.activeProject.projectName}}):_vm._e()],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "0u6B":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.startedFlag)?_c('div',{staticClass:"columns is-gapless"},[_c('div',{staticClass:"column is-12",attrs:{"id":"progressBar"}},[_c('div',{attrs:{"id":"sideBarTop"}},[_c('router-link',{attrs:{"to":"/plugins"}},[_c('div',{staticClass:"logo"},[_c('span',{staticClass:"applyAILogo"},[_vm._v("applyAI Vision")])])])],1),_vm._v(" "),_c('div',{staticClass:"tile is-child",staticStyle:{"margin-top":"10px"}}),_vm._v(" "),_c('button',{staticClass:"cssaccordion",attrs:{"id":"accordionToggleButton"},on:{"click":function($event){_vm.arrowDown = !_vm.arrowDown; _vm.toggleAccordion();}}},[_c('table',{},[_c('tr',[_c('td',[_vm._v(_vm._s(_vm.activeProject.projectName)+" / "+_vm._s(_vm.activePart.number))]),_vm._v(" "),_c('td',[_vm._v(_vm._s(_vm.totalCycleTime.toFixed(0))+" ms")]),_vm._v(" "),_vm._m(0),_vm._v(" "),(_vm.runningMode==1)?_c('td',[_c('button',{staticClass:"button is-warning is-small",on:{"click":[function($event){$event.stopPropagation();},function($event){_vm.sendTestCmd()}]}},[_c('i',{staticClass:"fas fa-bolt"})])]):_vm._e()])])]),_vm._v(" "),_c('div',{staticClass:"panel",attrs:{"id":"accordionPanel"}},[_c('router-link',{attrs:{"to":"/plugins"}},[_c('table',{staticClass:"table is-narrow progressbarTable"},[_c('draggable',{attrs:{"tag":"tbody"},on:{"start":function($event){_vm.drag=true},"end":function($event){_vm.drag=false}},model:{value:(_vm.activeProject.plugins),callback:function ($$v) {_vm.$set(_vm.activeProject, "plugins", $$v)},expression:"activeProject.plugins"}},_vm._l((_vm.activeProject.plugins),function(plugins,index){return _c('tr',{key:index,staticClass:"listItem",class:{ isActive: _vm.activePlugin == plugins.name },attrs:{"id":'listElement_' + plugins.name},on:{"click":function($event){_vm.activatePlugin(plugins.name)}}},[(_vm.runningMode == 1)?_c('td',[_c('button',{staticClass:"button is-small",on:{"click":function($event){_vm.setPluginConfiguration()}}},[_c('i',{staticClass:"fas fa-wrench"})])]):_vm._e(),_vm._v(" "),_c('td',[_c('span',{staticClass:"pluginSpans",attrs:{"id":plugins.name + 'button'}},[_c('txt',{attrs:{"tid":plugins.name}})],1)]),_vm._v(" "),_c('td',[_vm._v(_vm._s(_vm.cycleTimes[index])+" ms")])])}),0),_vm._v(" "),_c('tr',[_c('td',[_vm._v("Total")]),_c('td',[_vm._v(_vm._s(_vm.totalCycleTime.toFixed(0))+" ms")])])],1)])],1),_vm._v(" "),(_vm.runningMode === 0)?_c('sidebarConfig',{attrs:{"activePlugin":_vm.activePlugin,"activeProject":_vm.activeProject,"activePart":_vm.activePart,"targets":_vm.targets}}):_vm._e(),_vm._v(" "),(_vm.runningMode === 1)?_c('pluginViewer',{attrs:{"id":"routerView","configData":_vm.configData,"cfList":_vm.cfList,"stereoCameras":_vm.stereoCameras,"activePlugin":_vm.activePlugin,"activeProject":_vm.activeProject,"activePart":_vm.activePart,"pluginConfig":_vm.pluginConfig,"targets":_vm.targets}}):_vm._e(),_vm._v(" "),(_vm.runningMode === 1)?_c('sidebarMeasuredValues',{attrs:{"targets":_vm.targets}}):_vm._e()],1)]):_vm._e()}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('td',[_c('i',{staticClass:"fas fa-chevron-down"})])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "1Q23":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__("mvHQ");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_bus__ = __webpack_require__("qKYu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_aiCore_toolMixin__ = __webpack_require__("lQcu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_txt__ = __webpack_require__("pKHy");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_axios__);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'toolRoiPicker',
  mixins: [__WEBPACK_IMPORTED_MODULE_2__components_aiCore_toolMixin__["a" /* default */]],
  components: { txt: __WEBPACK_IMPORTED_MODULE_3__components_txt__["a" /* default */] },
  props: ['activePlugin', 'pluginConfig', 'targets', 'activePart'],
  data: function data() {
    return {
      roiId: 0,
      roiIdSelected: 0,
      filter: [],
      roi: [],
      lines: [],
      typeSelect: [{ val: 0, typ: 'Group' }, { val: 1, typ: 'Line' }, { val: 2, typ: 'Circle' }, { val: 3, typ: 'Match' }, { val: 4, typ: 'MatchRef' }],
      hierarchy: 'Parent~Child',
      mode: 0,
      highlightedRoi: 0
    };
  },

  methods: {
    onChange: function onChange(index, type) {
      console.log(index, type);
      this.$set(this.roi[index], 'type', type);
    },
    mouseEvent: function mouseEvent(clkInfo) {
      this.scale = clkInfo.xDiv / clkInfo.trueX;
      // console.log(clkInfo.state)
      if (clkInfo.state === 'mouseup') {
        var roi = {
          'id': this.roiIdSelected,
          'nickname': 'ROI_' + this.roiIdSelected,
          'type': 1,
          'points': [],
          'max': 0,
          'min': 0,
          'minSize': 0,
          'maxSize': 0,
          'minDistance': 0,
          'referenceID': ''
        };
        console.log(this.roiIdSelected);
        for (var i = 0; i < this.activePart.roi.length; i++) {
          if (this.activePart.roi[i].id === this.roiIdSelected) {
            roi.type = this.activePart.roi[i].type;
            roi.ma = this.activePart.roi[i].max;
            roi.mi = this.activePart.roi[i].min;
            roi.minSize = this.activePart.roi[i].minSize;
            roi.maxSize = this.activePart.roi[i].maxSize;
            roi.minDistance = this.activePart.roi[i].minDistance;
            console.log(roi);
            break;
          }
        }
        this.updateROIList(roi);
        this.activePart.roi = JSON.parse(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(this.roi));
        this.mode = 0;
      }
      if (clkInfo.state === 'mousemove' && clkInfo.id !== '$BG') {
        document.getElementById(clkInfo.id).style.cursor = 'grab';
        console.log(clkInfo.id);
      }
      if (clkInfo.state === 'mousedown') {
        if (clkInfo.id === '$BG') {
          this.roiId += 1;
          this.roiIdSelected = this.roiId;
          this.insertRoi(this.roiId, { 'x': clkInfo.x, 'y': clkInfo.y }, 'magenta');
          this.mode = 1;
          document.getElementById(clkInfo.id).style.cursor = 'grab';
        } else {
          if (clkInfo.id.indexOf('_') > 0) {
            var tmp = clkInfo.id.split('_')[1].substr(1).split('.')[1];
            this.roiIdSelected = parseInt(tmp);
            var symbol = clkInfo.id.split('_')[0];
            var LorC = clkInfo.id.split('_')[1].charAt(0);
            var idx = parseInt(clkInfo.id.split('_')[1].split('.')[2]);
            console.log(this.roiIdSelected, symbol, LorC, idx);
            this.mode = 0;
            if (symbol === 'ROI' && idx === 3) {
              this.mode = 1;
            }
            if (symbol === 'ROI' && idx === 4) {
              this.mode = 2;
            }
            if (symbol === 'ROI' && (idx === 1 || idx === 2)) {
              this.mode = 3;
            }
            if (this.mode !== 0) {
              document.getElementById(clkInfo.id).style.cursor = 'move';
            }
            console.log(this.roiId, clkInfo.id, symbol, LorC, this.roiIdSelected, idx, this.mode);
          }
        }
      }
      // console.log(clkInfo.state, this.mode)
      if (clkInfo.state === 'mousemove') {
        if (this.mode === 0) {
          if (this.roi.length) {
            var mid = parseInt(clkInfo.id.split('.')[1]);
            if (this.highlightedRoi !== mid) {
              this.selectROI({ id: mid });
              this.highlightedRoi = mid;
            }
          }
        } else {
          var pt = this.getPointsFromSVG(this.roiIdSelected);
          var aa = this.getAngle2(pt[0], { 'x': clkInfo.x, 'y': clkInfo.y });
          var bb = this.getAngle2(pt[0], pt[1]);
          var pp = this.getPerpendicularPointAndDistance(pt[0], pt[1], { 'x': clkInfo.x, 'y': clkInfo.y });
          // console.log(pp.d.toFixed(0), (aa * 180 / Math.PI).toFixed(0), (bb * 180 / Math.PI).toFixed(0))
          var rr = 1;
          if (bb - aa > 0) {
            rr = -1;
          }
          if (this.mode === 1) {
            // this.adjustRoi(this.roiId, {'x': clkInfo.x, 'y': clkInfo.y})
            // pp = this.getPerpendicularPointAndDistance(pt[0], pt[1], pt[2])
            pp.d = 0;
            pt[1].x = clkInfo.x;
            pt[1].y = clkInfo.y;
            pt[2].x = pt[0].x + rr * pp.d * Math.sin(aa);
            pt[2].y = pt[0].y + rr * pp.d * Math.cos(aa);
            pt[3].x = pt[1].x + rr * pp.d * Math.sin(aa);
            pt[3].y = pt[1].y + rr * pp.d * Math.cos(aa);
            this.updateRoi(this.roiIdSelected, pt, 'yellow');
          } else if (this.mode === 2) {
            bb = -bb; // Math.PI / 4 - bb
            pt[2].x = pt[0].x + rr * pp.d * Math.sin(bb);
            pt[2].y = pt[0].y + rr * pp.d * Math.cos(bb);
            pt[3].x = pt[1].x + rr * pp.d * Math.sin(bb);
            pt[3].y = pt[1].y + rr * pp.d * Math.cos(bb);
            this.updateRoi(this.roiIdSelected, pt, 'yellow');
          } else if (this.mode === 3) {
            var dx = clkInfo.x - pt[0].x;
            var dy = clkInfo.y - pt[0].y;
            pt[0].x += dx;
            pt[0].y += dy;
            pt[1].x += dx;
            pt[1].y += dy;
            pt[2].x += dx;
            pt[2].y += dy;
            pt[3].x += dx;
            pt[3].y += dy;
            this.updateRoi(this.roiIdSelected, pt, 'yellow');
          }
        }
      }
    },
    getPointsFromSVG: function getPointsFromSVG(id) {
      var s = this.scale;
      var p = [];
      var t = document.getElementById('ROI_L.' + id + '.1');
      p.push({ x: parseFloat(t.getAttribute('x1')) / s, y: parseFloat(t.getAttribute('y1')) / s });
      p.push({ x: parseFloat(t.getAttribute('x2')) / s, y: parseFloat(t.getAttribute('y2')) / s });
      t = document.getElementById('ROI_L.' + id + '.3');
      p.push({ x: parseFloat(t.getAttribute('x1')) / s, y: parseFloat(t.getAttribute('y1')) / s });
      p.push({ x: parseFloat(t.getAttribute('x2')) / s, y: parseFloat(t.getAttribute('y2')) / s });
      return p;
    },
    insertRoi: function insertRoi(id, p, col) {
      var s = this.scale;
      this.line('ROI_L.' + id + '.1', p.x * s, p.y * s, p.x * s, p.y * s, col);
      this.line('ROI_L.' + id + '.2', p.x * s, p.y * s, p.x * s, p.y * s, col);
      this.line('ROI_L.' + id + '.3', p.x * s, p.y * s, p.x * s, p.y * s, col);
      this.line('ROI_L.' + id + '.4', p.x * s, p.y * s, p.x * s, p.y * s, col);
      this.arc('ROI_C.' + id + '.1', p.x * s, p.y * s, 2, col);
      this.arc('ROI_C.' + id + '.2', p.x * s, p.y * s, 4, col);
      this.arc('ROI_C.' + id + '.3', p.x * s, p.y * s, 4, col);
      this.arc('ROI_C.' + id + '.4', p.x * s, p.y * s, 4, col);
    },
    updateRoi: function updateRoi(id, p, col) {
      var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

      var s = this.scale;
      var target = document.getElementById('ROI_L.' + id + '.1');
      target.setAttribute('x1', p[0].x * s);
      target.setAttribute('y1', p[0].y * s);
      target.setAttribute('x2', p[1].x * s);
      target.setAttribute('y2', p[1].y * s);
      target.setAttribute('stroke', col);
      target.setAttribute('stroke-width', width);
      target = document.getElementById('ROI_L.' + id + '.2');
      target.setAttribute('x1', p[0].x * s);
      target.setAttribute('y1', p[0].y * s);
      target.setAttribute('x2', p[2].x * s);
      target.setAttribute('y2', p[2].y * s);
      target.setAttribute('stroke', col);
      target.setAttribute('stroke-width', width);
      target = document.getElementById('ROI_L.' + id + '.4');
      target.setAttribute('x1', p[1].x * s);
      target.setAttribute('y1', p[1].y * s);
      target.setAttribute('x2', p[3].x * s);
      target.setAttribute('y2', p[3].y * s);
      target.setAttribute('stroke', col);
      target.setAttribute('stroke-width', width);
      target = document.getElementById('ROI_L.' + id + '.3');
      target.setAttribute('x1', p[2].x * s);
      target.setAttribute('y1', p[2].y * s);
      target.setAttribute('x2', p[3].x * s);
      target.setAttribute('y2', p[3].y * s);
      target.setAttribute('stroke', col);
      target.setAttribute('stroke-width', width);
      target = document.getElementById('ROI_C.' + id + '.1');
      target.setAttribute('cx', p[0].x * s);
      target.setAttribute('cy', p[0].y * s);
      target.setAttribute('stroke', col);
      target.setAttribute('stroke-width', width);
      target = document.getElementById('ROI_C.' + id + '.2');
      target.setAttribute('cx', p[0].x * s);
      target.setAttribute('cy', p[0].y * s);
      target.setAttribute('stroke', col);
      target.setAttribute('stroke-width', width);
      target = document.getElementById('ROI_C.' + id + '.3');
      target.setAttribute('cx', p[1].x * s);
      target.setAttribute('cy', p[1].y * s);
      target.setAttribute('stroke', col);
      target.setAttribute('stroke-width', width);
      target = document.getElementById('ROI_C.' + id + '.4');
      target.setAttribute('cx', (p[2].x + p[3].x) / 2 * s);
      target.setAttribute('cy', (p[2].y + p[3].y) / 2 * s);
      target.setAttribute('stroke', col);
      target.setAttribute('stroke-width', width);
    },
    updateRoiColor: function updateRoiColor(id, col) {
      document.getElementById('ROI_C.' + id + '.1').setAttribute('stroke', col);
      document.getElementById('ROI_C.' + id + '.2').setAttribute('stroke', col);
      document.getElementById('ROI_C.' + id + '.3').setAttribute('stroke', col);
      document.getElementById('ROI_C.' + id + '.4').setAttribute('stroke', col);
      document.getElementById('ROI_L.' + id + '.1').setAttribute('stroke', col);
      document.getElementById('ROI_L.' + id + '.2').setAttribute('stroke', col);
      document.getElementById('ROI_L.' + id + '.4').setAttribute('stroke', col);
      document.getElementById('ROI_L.' + id + '.3').setAttribute('stroke', col);
    },
    highlightRoi: function highlightRoi(r) {
      // console.log('highlightRect ' + r.id)
      for (var i = 0; i < this.roi.length; i++) {
        this.updateRoi(this.roi[i].id, this.roi[i].points, 'magenta');
      }
      this.updateRoi(r.id, r.points, 'magenta', 1.5);
    },
    updateROIList: function updateROIList(roi) {
      var p = this.getPointsFromSVG(roi.id);
      var cx = 0;
      var cy = 0;
      for (var i = 0; i < p.length; i++) {
        roi.points.push(p[i]);
        cx += p[i].x;
        cy += p[i].y;
      }
      roi.x = cx / p.length;
      roi.y = cy / p.length;
      roi.angle = this.getAngle(p[0], p[1]) * 180 / Math.PI;
      roi.h = this.getDistance(p[0], p[2]);
      roi.w = this.getDistance(p[0], p[1]);
      for (var j = 0, found = false; j < this.roi.length; j++) {
        if (this.roi[j].id === roi.id) {
          this.roi[j] = roi;
          found = true;
        }
      }
      if (!found) {
        this.roi.push(roi);
      }
      // console.log(roi)
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$emit('updateTargets', this.roi);
    },
    selectROI: function selectROI(r) {
      for (var i = 0; i < this.roi.length; i++) {
        document.getElementById('roiList' + this.roi[i].id).classList.remove('is-selected');
        if (this.roi[i].id === r.id) {
          document.getElementById('roiList' + this.roi[i].id).classList.add('is-selected');
          this.highlightRoi(this.roi[i]);
        }
      }
    },
    deleteROI: function deleteROI(id) {
      document.getElementById('ROI_C.' + id + '.1').remove();
      document.getElementById('ROI_C.' + id + '.2').remove();
      document.getElementById('ROI_C.' + id + '.3').remove();
      document.getElementById('ROI_C.' + id + '.4').remove();
      document.getElementById('ROI_L.' + id + '.1').remove();
      document.getElementById('ROI_L.' + id + '.2').remove();
      document.getElementById('ROI_L.' + id + '.3').remove();
      document.getElementById('ROI_L.' + id + '.4').remove();
      for (var i = 0; i < this.roi.length; i++) {
        if (this.roi[i].id === id) {
          this.roi.splice(i, 1);
          break;
        }
      }
    },
    saveROI: function saveROI(id) {
      this.activePart.roi = JSON.parse(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(this.roi));
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$emit('updatePart', this.activePart);
      for (var i = 0; i < this.roi.length; i++) {
        if (this.roi[i].id === id && this.roi[i].type === 4) {
          console.log(this.roi[i]);
          var data = {};
          data.plugin = 'TemplateMatch';
          data.part = this.activePart.number;
          data.roiNickname = this.roi[i].nickname;
          data.x = this.roi[i].x;
          data.y = this.roi[i].y;
          data.w = this.roi[i].w;
          data.h = this.roi[i].h;
          data.angle = this.roi[i].angle;
          __WEBPACK_IMPORTED_MODULE_4_axios___default.a.post('/api/v1/Project/saveReferenceImage', data).then(function (response) {
            self.activePart = data;
            console.log(response);
          }).catch(function (error) {
            console.log(error);
          });
        }
      }
    },
    toggleRoiAccordion: function toggleRoiAccordion(id) {
      var e = document.getElementById(id);
      e.classList.toggle('active');
      var panel = document.getElementById(id + 'panel');
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + 15 + 'px';
      }
    },
    reToggleRoiAccordion: function reToggleRoiAccordion(id) {
      var e = document.getElementById(id);
      e.classList.toggle('active');
      var panel = document.getElementById(id + 'panel');
      setTimeout(function () {
        panel.style.maxHeight = panel.scrollHeight + 15 + 'px';
      }, 100);
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.scale = document.getElementById('imageDiv').clientWidth / 2048;
    this.roi = JSON.parse(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(this.activePart.roi));
    this.roiId = 0;
    console.log(this.roi);
    for (var i = 0; i < this.roi.length; i++) {
      console.log(this.roi[i]);
      this.insertRoi(this.roi[i].id, { 'x': 0, 'y': 0 }, 'magenta');
      if (this.roi[i].id > this.roiId) {
        this.roiId = this.roi[i].id;
        this.roiIdSelected = this.roiId;
      }
      this.updateRoi(this.roi[i].id, this.roi[i].points, 'magenta');
    }
    var s = this.scale;
    console.log(this.targets);
    // ------------------------------------------------------------------
    var blockit = false;
    if (blockit) {
      for (i = 0; i < this.targets.length; i++) {
        var t = this.targets[i];
        var did = document.getElementById('L' + t.id);
        if (did !== null) {
          did.remove();
        }
        if (t.type === 1 /* 'Line' */) {
            this.lines.push(i);
            t.x1 = parseFloat(t.cx) - parseFloat(t.w) / 2 * Math.cos(parseFloat(t.angle));
            t.y1 = parseFloat(t.cy) - parseFloat(t.w) / 2 * Math.sin(parseFloat(t.angle));
            t.x2 = parseFloat(t.cx) + parseFloat(t.w) / 2 * Math.cos(parseFloat(t.angle));
            t.y2 = parseFloat(t.cy) + parseFloat(t.w) / 2 * Math.sin(parseFloat(t.angle));
            console.log(t);
            this.line('L.' + t.id, t.x1 * s, t.y1 * s, t.x2 * s, t.y2 * s, 'yellow');
            this.arc('LP.' + t.id + '.1', t.x1 * s, t.y1 * s, 2, 'yellow');
            this.arc('LP.' + t.id + '.2', t.x2 * s, t.y2 * s, 2, 'yellow');
            this.arc('LP.' + t.id + '.3', t.cx * s, t.cy * s, 4, 'yellow');
          }
        if (t.type === 2 /* 'Circle' */) {
            var r = (parseFloat(t.h) + parseFloat(t.w)) / 4;
            // this.arc('CP.' + t.id, t.cx * s, t.cy * s, s * r, 'lime')
            this.circlePath('CP.' + t.id, t.cx * s, t.cy * s, s * r, 'yellow');
            this.arc('CP.' + t.id, t.cx * s, t.cy * s, 6, 'yellow');
          }
      }
    }
    // ------------------------------------------------------------------
    __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$on('mouseEvent', function (clkInfo) {
      _this.mouseEvent(clkInfo);
    });
  },
  beforeDestroy: function beforeDestroy() {
    __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$off('mouseEvent');
    this.activePart.roi = JSON.parse(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(this.roi));
    __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$emit('updatePart', this.activePart);
    while (this.roi.length > 0) {
      var id = this.roi[this.roi.length - 1].id;
      this.deleteROI(id);
    }
  }
});

/***/ }),

/***/ "1bl3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{},[_c('header',{staticClass:"modal-card-head"},[_c('p',{staticClass:"modal-card-title"},[_vm._v("Prüfaufträge")]),_vm._v(" "),_c('button',{staticClass:"delete is-pulled-right",attrs:{"aria-label":"close"},on:{"click":function($event){_vm.$router.push('/plugins');_vm.closeOrdersModal()}}})]),_vm._v(" "),_c('section',{staticClass:"modal-card-body"},[_c('b-table',{attrs:{"data":_vm.data,"bordered":_vm.isBordered,"striped":_vm.isStriped,"narrowed":_vm.isNarrowed,"hoverable":_vm.isHoverable,"loading":_vm.isLoading,"focusable":_vm.isFocusable,"mobile-cards":_vm.hasMobileCards,"paginated":_vm.isPaginated,"per-page":_vm.perPage,"current-page":_vm.currentPage,"pagination-simple":_vm.isPaginationSimple,"pagination-position":_vm.paginationPosition,"default-sort-direction":_vm.defaultSortDirection,"sort-icon":_vm.sortIcon,"sort-icon-size":_vm.sortIconSize,"default-sort":"user.first_name","aria-next-label":"Next page","aria-previous-label":"Previous page","aria-page-label":"Page","aria-current-label":"Current page"},on:{"update:currentPage":function($event){_vm.currentPage=$event}},scopedSlots:_vm._u([{key:"default",fn:function(props){return [_c('b-table-column',{attrs:{"field":"activate","label":""}},[_c('button',{staticClass:"button is-small",class:{'is-success': props.row.status},on:{"click":function($event){_vm.activate(props.row.id)}}},[_c('i',{staticClass:"fas fa-check"})])]),_vm._v(" "),_c('b-table-column',{attrs:{"field":"edit","label":" "}},[_c('button',{staticClass:"button is-small modal-button",on:{"click":function($event){_vm.edit(props.row.id)}}},[_c('i',{staticClass:"fas fa-edit"})])]),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","field":"updated","label":"#"}},[_vm._v(_vm._s(props.row.id))]),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","field":"extid","label":"ExtId"}},[_vm._v(_vm._s(props.row.extid))]),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","field":"part","label":"Werkstück"}},[_vm._v(_vm._s(props.row.part))]),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","field":"order","label":"Kommision"}},[_vm._v(_vm._s(props.row.order))]),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","field":"machine","label":"Maschine"}},[_vm._v(_vm._s(props.row.machine))]),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","field":"status","label":"Status"}},[_c('txt',{attrs:{"tid":"order-status-select","idx":props.row.status}})],1),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","field":"remove","label":"","centered":""}},[_c('button',{staticClass:"button is-danger is-small",on:{"click":function($event){_vm.remove(props.row)}}},[_c('i',{staticClass:"fas fa-trash"})])])]}}])},[_c('template',{slot:"empty"},[_c('section',{staticClass:"section"},[_c('div',{staticClass:"content has-text-grey has-text-centered"},[_c('p',[_c('b-icon',{attrs:{"icon":"emoticon-sad","size":"is-large"}})],1),_vm._v(" "),_c('p',[_vm._v("Nothing here.")])])])])],2)],1)]),_vm._v(" "),_c('div',{staticClass:"modal",class:{ 'is-active': _vm.isShowModal },attrs:{"id":"modal-orders"}},[_c('div',{staticClass:"modal-background"}),_vm._v(" "),_c('div',{staticClass:"modal-card"},[_c('header',{staticClass:"modal-card-head"},[_c('p',{staticClass:"modal-card-title"},[_c('txt',{attrs:{"tid":"order"}})],1),_vm._v(" "),_c('button',{staticClass:"delete",attrs:{"aria-label":"close"},on:{"click":function($event){_vm.isShowModal = false}}})]),_vm._v(" "),_c('section',{staticClass:"modal-card-body"},_vm._l((_vm.editData),function(edt,name){return _c('div',{key:edt.id,staticClass:"field is-horizontal",attrs:{"id":'edit_' + name}},[_c('div',{staticClass:"field-label is-normal"},[_c('label',{staticClass:"label"},[_c('txt',{attrs:{"tid":name}})],1)]),_vm._v(" "),_c('div',{staticClass:"field-body"},[_c('div',{staticClass:"field"},[(name != 'status')?_c('div',{staticClass:"control"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.editData[name]),expression:"editData[name]"}],staticClass:"input",domProps:{"value":(_vm.editData[name])},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(_vm.editData, name, $event.target.value)}}})]):_vm._e(),_vm._v(" "),(name == 'status')?_c('div',{staticClass:"control"},[_c('div',{staticClass:"select"},[_c('txtSelect',{attrs:{"tid":"order-status-select"},model:{value:(_vm.editData[name]),callback:function ($$v) {_vm.$set(_vm.editData, name, $$v)},expression:"editData[name]"}})],1)]):_vm._e()])])])}),0),_vm._v(" "),_c('footer',{staticClass:"modal-card-foot"},[_c('button',{staticClass:"button is-success",on:{"click":function($event){_vm.save();_vm.isShowModal = false}}},[_c('i',{staticClass:"fas fa-save"})]),_vm._v(" "),_c('button',{staticClass:"button",on:{"click":function($event){_vm.isShowModal = false}}},[_c('i',{staticClass:"fas fa-window-close"})])])])])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "1jdU":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_listOrders_vue__ = __webpack_require__("9d7v");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_22defad6_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_listOrders_vue__ = __webpack_require__("1bl3");
function injectStyle (ssrContext) {
  __webpack_require__("QY3x")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-22defad6"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_listOrders_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_22defad6_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_listOrders_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "2Yk4":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pluginViewer_vue__ = __webpack_require__("KR32");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7d021366_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_pluginViewer_vue__ = __webpack_require__("SqFC");
function injectStyle (ssrContext) {
  __webpack_require__("gUCl")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-7d021366"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_pluginViewer_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7d021366_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_pluginViewer_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "2ho/":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'configuration',
  props: ['pluginConfig', 'activeProject'],
  components: {},
  data: function data() {
    return {
      cdata: {},
      projects: [],
      selectedProject: '',
      plugins: []
    };
  },

  watch: {},
  methods: {
    checkIfChecked: function checkIfChecked(plugin, program) {
      // console.log(plugin, program)
      for (var i = 0; i < this.cdata.programs.length; i++) {
        if (this.cdata.programs[i].name === program.name) {
          for (var j = 0; j < this.cdata.programs[i].sequence.length; j++) {
            if (this.cdata.programs[i].sequence[j] === plugin.id) {
              // console.log(this.cdata.programs[i].sequence[j])
              return true;
            }
          }
        }
      }
      return false;
    },
    removePlugin: function removePlugin(what) {
      this.removeIDFromArray('plugins', what, this.cdata.plugins);
      for (var i = 0; i < this.cdata.programs.length; i++) {
        this.removeIDFromArray('programs', what, this.cdata.programs[i].sequence);
      }
    },
    removeIDFromArray: function removeIDFromArray(name, what, arr) {
      var i;
      var deleted = false;
      for (i = 0; i < arr.length; i++) {
        if (name === 'plugins') {
          if (arr[i].id === what) {
            arr.splice(i, 1);
            deleted = true;
          }
        }
        if (name === 'programs') {
          if (arr[i] === what) {
            arr.splice(i, 1);
            deleted = true;
          }
        }
      }
      for (i = 0; i < arr.length; i++) {
        if (i >= what) {
          if (name === 'plugins' && deleted) {
            arr[i].id = i;
          }
          if (name === 'programs' && deleted) {
            arr[i] = i;
          }
        }
      }
    },
    onChange: function onChange(event) {
      console.log(event.target.id);
      console.log(event.target.value);
      var id;
      if (event.target.id === 'selectProject') {
        this.selectedProject = event.target.value;
        this.updatePluginList();
      }
      if (event.target.id.indexOf('selectPlugin_') === 0) {
        id = event.target.id.split('_')[1];
        this.cdata.plugins[id].name = event.target.value;
      }
      if (event.target.id.indexOf('cBox_auto_') === 0) {
        id = event.target.id.split('_')[2];
        this.cdata.autostartplugins = [];
        this.cdata.autostartplugins = this.cdata.autostartplugins.push(this.cdata.plugins[id].name);
      }
    },
    updatePluginList: function updatePluginList() {
      var _this = this;

      __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('/api/v1/Project/listPlugins').then(function (response) {
        _this.plugins = response.data;
        __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('/api/v1/Project/listPlugins?project=' + _this.selectedProject).then(function (response) {
          console.log(response.data);
          for (var p = 0; p < response.data.length; p++) {
            _this.plugins.push(response.data[p]);
          }
          __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('/api/v1/Project/getProject?project=' + _this.selectedProject).then(function (response) {
            console.log(response.data);
            _this.cdata = response.data;
          }).catch(function (error) {
            console.log(error);
          });
        }).catch(function (error) {
          console.log(error);
        });
      }).catch(function (error) {
        console.log(error);
      });
    },
    save: function save() {
      console.log(this.cdata);
      __WEBPACK_IMPORTED_MODULE_0_axios___default.a.post('/api/v1/Project/saveProject?project=' + this.selectedProject, this.cdata).then(function (response) {
        console.log(response.data);
      }).catch(function (error) {
        console.log(error);
      });
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('/api/v1/Project/listProjects').then(function (response) {
      _this2.projects = response.data;
    }).catch(function (error) {
      console.log(error);
    });
  }
});

/***/ }),

/***/ "3D7z":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "56fm":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "62+T":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{},[_c('div',{attrs:{"id":"example-3"}},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.filter),expression:"filter"}],attrs:{"type":"checkbox","value":"1"},domProps:{"checked":Array.isArray(_vm.filter)?_vm._i(_vm.filter,"1")>-1:(_vm.filter)},on:{"change":function($event){var $$a=_vm.filter,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v="1",$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.filter=$$a.concat([$$v]))}else{$$i>-1&&(_vm.filter=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{_vm.filter=$$c}}}}),_vm._v(" "),_c('label',{attrs:{"for":"Line"}},[_vm._v("Linien")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.filter),expression:"filter"}],attrs:{"type":"checkbox","value":"2"},domProps:{"checked":Array.isArray(_vm.filter)?_vm._i(_vm.filter,"2")>-1:(_vm.filter)},on:{"change":function($event){var $$a=_vm.filter,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v="2",$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.filter=$$a.concat([$$v]))}else{$$i>-1&&(_vm.filter=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{_vm.filter=$$c}}}}),_vm._v(" "),_c('label',{attrs:{"for":"Circle"}},[_vm._v("Kreise")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.filter),expression:"filter"}],attrs:{"type":"checkbox","value":"3"},domProps:{"checked":Array.isArray(_vm.filter)?_vm._i(_vm.filter,"3")>-1:(_vm.filter)},on:{"change":function($event){var $$a=_vm.filter,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v="3",$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.filter=$$a.concat([$$v]))}else{$$i>-1&&(_vm.filter=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{_vm.filter=$$c}}}}),_vm._v(" "),_c('label',{attrs:{"for":"Match"}},[_vm._v("Muster")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.filter),expression:"filter"}],attrs:{"type":"checkbox","value":"4"},domProps:{"checked":Array.isArray(_vm.filter)?_vm._i(_vm.filter,"4")>-1:(_vm.filter)},on:{"change":function($event){var $$a=_vm.filter,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v="4",$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.filter=$$a.concat([$$v]))}else{$$i>-1&&(_vm.filter=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{_vm.filter=$$c}}}}),_vm._v(" "),_c('label',{attrs:{"for":"MatchRef"}},[_vm._v("Referenz")])]),_vm._v(" "),_c('div',_vm._l((_vm.roi),function(r,index){return _c('div',{key:index},[(_vm.filter.includes(r.type.toString()) || _vm.filter.length == 0)?_c('div',{staticClass:"columns is-marginless listItem roiAccordion",attrs:{"id":'roiList' + r.id},on:{"click":function($event){_vm.selectROI(r); _vm.toggleRoiAccordion('roiList' + r.id)},"mouseover":function($event){_vm.selectROI(r)}}},[_c('div',{staticClass:"column is-5 has-text-left"},[_vm._v("\n          ID "+_vm._s(r.nickname.split('_')[1])+"\n        ")]),_vm._v(" "),_c('div',{staticClass:"column is-4 has-text-left"},[_c('txt',{attrs:{"tid":_vm.typeSelect[r.type].typ}})],1),_vm._v(" "),_vm._m(0,true),_vm._v(" "),_c('div',{staticClass:"column is-1"},[_c('button',{staticClass:"button is-small",on:{"click":function($event){_vm.saveROI(r.id)}}},[_c('i',{staticClass:"fa fa-save"})])]),_vm._v(" "),_c('div',{staticClass:"column is-1"},[_c('button',{staticClass:"button is-small",on:{"click":function($event){_vm.deleteROI(r.id); _vm.saveROI(r.id);}}},[_c('i',{staticClass:"fas fa-trash-alt"})])])]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"columns is-marginless panel roiAccordionPanel",attrs:{"id":'roiList' + r.id + 'panel'}},[_c('table',{staticClass:"table is-narrow"},[_c('tr',{},[_c('td',[_vm._v("Objekttyp")]),_vm._v(" "),_c('td',{staticClass:"tabData has-text-left"},[_c('div',{staticClass:"select"},[_c('select',{directives:[{name:"model",rawName:"v-model",value:(r.type),expression:"r.type"}],staticClass:"input",attrs:{"type":"text"},on:{"change":[function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.$set(r, "type", $event.target.multiple ? $$selectedVal : $$selectedVal[0])},function($event){_vm.onChange(index,r.type);_vm.reToggleRoiAccordion('roiList' + r.id)}]}},_vm._l((_vm.typeSelect),function(option,idx){return _c('option',{key:idx,domProps:{"value":option.val}},[_c('txt',{attrs:{"typ":"txt","tid":option.typ}})],1)}),0)])])]),_vm._v(" "),(r.type==3)?_c('tr',[_c('td',[_vm._v("Referenz ID")]),_vm._v(" "),_c('td',{staticClass:"tabData has-text-left"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(r.referenceID),expression:"r.referenceID"}],staticClass:"input",attrs:{"value":"","type":"text"},domProps:{"value":(r.referenceID)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(r, "referenceID", $event.target.value)}}})])]):_vm._e(),_vm._v(" "),(r.type==2)?_c('tr',[_c('td',[_vm._v("Min. Radius")]),_vm._v(" "),_c('td',{staticClass:"tabData has-text-left"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(r.minSize),expression:"r.minSize"}],staticClass:"input",attrs:{"value":"50","type":"number"},domProps:{"value":(r.minSize)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(r, "minSize", $event.target.value)}}})])]):_vm._e(),_vm._v(" "),(r.type==2)?_c('tr',[_c('td',[_vm._v("Max. Radius")]),_vm._v(" "),_c('td',{staticClass:"tabData has-text-left"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(r.maxSize),expression:"r.maxSize"}],staticClass:"input",attrs:{"value":"50","type":"number"},domProps:{"value":(r.maxSize)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(r, "maxSize", $event.target.value)}}})])]):_vm._e(),_vm._v(" "),(r.type==2)?_c('tr',[_c('td',[_vm._v("Min. Abstand")]),_vm._v(" "),_c('td',{staticClass:"tabData has-text-left"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(r.minDistance),expression:"r.minDistance"}],staticClass:"input",attrs:{"value":"50","type":"number"},domProps:{"value":(r.minDistance)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(r, "minDistance", $event.target.value)}}})])]):_vm._e(),_vm._v(" "),(r.type==1)?_c('tr',[_c('td',[_vm._v("Min. Länge")]),_vm._v(" "),_c('td',{staticClass:"tabData has-text-left"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(r.minSize),expression:"r.minSize"}],staticClass:"input",attrs:{"value":"50","type":"number"},domProps:{"value":(r.minSize)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(r, "minSize", $event.target.value)}}})])]):_vm._e(),_vm._v(" "),(r.type==1)?_c('tr',[_c('td',[_vm._v("Max. Länge")]),_vm._v(" "),_c('td',{staticClass:"tabData has-text-left"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(r.maxSize),expression:"r.maxSize"}],staticClass:"input",attrs:{"value":"50","type":"number"},domProps:{"value":(r.maxSize)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(r, "maxSize", $event.target.value)}}})])]):_vm._e(),_vm._v(" "),(r.type==1)?_c('tr',[_c('td',[_vm._v("Min. Abstand")]),_vm._v(" "),_c('td',{staticClass:"tabData has-text-left"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(r.minDistance),expression:"r.minDistance"}],staticClass:"input",attrs:{"value":"50","type":"number"},domProps:{"value":(r.minDistance)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(r, "minDistance", $event.target.value)}}})])]):_vm._e()])])])}),0)])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"column is-1"},[_c('i',{staticClass:"fas fa-chevron-down"})])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "6chM":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.selected),expression:"selected"}],on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.selected=$event.target.multiple ? $$selectedVal : $$selectedVal[0]}}},_vm._l((_vm.getText(_vm.tid)),function(o,idx){return _c('option',{key:idx,domProps:{"value":idx}},[_vm._v(_vm._s(o))])}),0)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "6ryT":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_toolLines_vue__ = __webpack_require__("+a96");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1f96587e_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_toolLines_vue__ = __webpack_require__("LgMU");
function injectStyle (ssrContext) {
  __webpack_require__("sH7o")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-1f96587e"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_toolLines_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1f96587e_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_toolLines_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "77YD":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "783K":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_logViewer_vue__ = __webpack_require__("Jxzy");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_b356cdfa_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_logViewer_vue__ = __webpack_require__("mJOr");
function injectStyle (ssrContext) {
  __webpack_require__("w358")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-b356cdfa"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_logViewer_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_b356cdfa_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_logViewer_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "7rPA":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_imageContainer_vue__ = __webpack_require__("GsKP");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6e8c744f_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_imageContainer_vue__ = __webpack_require__("B3JO");
function injectStyle (ssrContext) {
  __webpack_require__("lYA7")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-6e8c744f"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_imageContainer_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6e8c744f_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_imageContainer_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "960g":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3__ = __webpack_require__("vwbq");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_bus__ = __webpack_require__("qKYu");
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'partTracker',
  props: ['activePart', 'activeProject'],
  data: function data() {
    return {
      data: [],
      total: 0,
      fromID: 0,
      toID: 0,
      trackerIDsDisplayed: 75,
      trackerDirection: 'Right2Left',
      width: 0,
      toolTips: []
    };
  },

  computed: {},
  methods: {
    fillTooltips: function fillTooltips() {
      // var icons = ['<i class="fas fa-check"></i>', '<i class="fas fa-minus-circle"></i>']
      // this.toolTips = d.date.replace('T', ' ') + '|' + d.part + '|' + d.order + '|' + d.machine + '|'
      // for (var i = 0; i < d.values.length; i++) {
      //   ti.innerHTML += parseFloat(d.values[i].v).toFixed(3) + icons[d.values[i].s] + ' '
      // }
    },
    updateChart: function updateChart(data) {
      var u = __WEBPACK_IMPORTED_MODULE_0_d3__["g" /* select */]('#tracker').selectAll('div').data(data);

      var w = parseInt(this.width / this.trackerIDsDisplayed);

      // var w = parseInt((this.width - 0) / this.trackerIDsDisplayed)
      // document.getElementById('aligner').style.height = 10 + 'px'
      // var w2 = parseInt((this.width - 10 - w * this.trackerIDsDisplayed) / 2)
      // console.log(this.width, w2, w)
      // document.getElementById('aligner').style.width = w2 + 'px'
      //
      //
      // var td = this.trackerDirection
      // var tno = this.trackerIDsDisplayed
      // var icons = ['<i class="fas fa-check"></i>', '<i class="fas fa-minus-circle"></i>']
      // for (var i = 0; i < data.values.length; i++) {
      //   this.toolTips[i] = data[i].date.replace('T', ' ') + '|' + data[i].part + '|' + data[i].order + '|' + data[i].machine + '|' + parseFloat(data[i].values[i].v).toFixed(3) + icons[data[i].values[i].s] + ' '
      // }
      u.enter().append('span').attr('data-label', function (d) {
        return d.date;
      }).attr('class', 'is-info is-top is-medium b-tooltip is-animated').append('div').merge(u).attr('id', function (d) {
        return d.date;
      }).style('float', 'left').style('width', w - 2 + 'px').style('height', '13px').style('cursor', 'pointer').style('margin', '2px 1px 1px 1px').style('background-color', function (d) {
        if (d.status) {
          return 'red';
        }
        return 'darkslategrey';
      }).on('click', function (d) {
        __WEBPACK_IMPORTED_MODULE_2__components_bus__["a" /* default */].$emit('loadImageFromTracker', d);
        __WEBPACK_IMPORTED_MODULE_2__components_bus__["a" /* default */].$emit('infoMessage', 'Loaded picture: ' + d.date);
        console.log(d.date);
      });
    },
    mqttUpdateChart: function mqttUpdateChart(status) {
      if (this.data.length >= this.trackerIDsDisplayed) {
        if (this.trackerDirection === 'Left2Right') {
          this.data.pop(); // remove from the end
        } else {
          this.data.shift(); // remove from the beginning
        }
        this.fromID += 1;
      }
      if (this.trackerDirection === 'Left2Right') {
        this.data.unshift(status.record); // add to the beginning
      } else {
        this.data.push(status.record); // Add to the end
      }
      this.toID += 1;
      this.updateChart(this.data);
    },
    compare: function compare(a, b) {
      var comparison = 0;
      if (a.date > b.date) {
        comparison = -1;
      } else if (a.date < b.date) {
        comparison = 1;
      }
      return comparison;
    }
  },
  mounted: function mounted() {
    var _this = this;

    // console.log(this.activePart)
    // console.log(this.activeProject)
    // console.log(this.params)
    if (this.activeProject.trackerDirection) {
      this.trackerDirection = this.activeProject.trackerDirection;
    }
    if (this.activeProject.trackerIDsDisplayed) {
      this.trackerIDsDisplayed = parseInt(this.activeProject.trackerIDsDisplayed);
    }
    this.width = parseInt(document.getElementById('imgWrapper').clientWidth - 200);
    __WEBPACK_IMPORTED_MODULE_1_axios___default.a.get('/api/v1/Project/getOrder?extid=0000').then(function (response) {
      var order = response.data;
      var params = 'part=' + order.part + '&order=' + order.order;
      __WEBPACK_IMPORTED_MODULE_1_axios___default.a.get('/api/v1/Project/getLatestMeasuredValuesFile?' + params + '&count=-' + _this.trackerIDsDisplayed).then(function (response) {
        _this.data = response.data.data;
        if (_this.trackerDirection === 'Left2Right') {
          _this.data.sort(_this.compare);
        }
        _this.total = parseInt(response.data.total);
        _this.fromID = _this.total - _this.trackerIDsDisplayed;
        if (_this.fromID < 1) {
          _this.fromID = 1;
        }
        _this.toID = _this.total;
        _this.updateChart(_this.data);
      }).catch(function (error) {
        console.log(error);
      });
    });
    // Used to update the chart
    __WEBPACK_IMPORTED_MODULE_2__components_bus__["a" /* default */].$on('statusUpdate', this.mqttUpdateChart);
  },

  beforeDestroy: function beforeDestroy() {
    __WEBPACK_IMPORTED_MODULE_2__components_bus__["a" /* default */].$off('statusUpdate', this.mqttUpdateChart);
  }
});

/***/ }),

/***/ "9d7v":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__("mvHQ");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_bus__ = __webpack_require__("qKYu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_txt__ = __webpack_require__("pKHy");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_txtSelect__ = __webpack_require__("E+FC");

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'listOrders',
  props: [],
  components: {
    txt: __WEBPACK_IMPORTED_MODULE_3__components_txt__["a" /* default */],
    txtSelect: __WEBPACK_IMPORTED_MODULE_4__components_txtSelect__["a" /* default */]
  },
  data: function data() {
    return {
      data: [],
      editData: {},
      dataLength: 0,
      total: 0,
      index: 0,
      countPerPage: 10,
      isShowModal: false,
      selected: {},
      isEmpty: false,
      isBordered: false,
      isStriped: true,
      isNarrowed: true,
      isHoverable: true,
      isFocusable: false,
      isLoading: false,
      hasMobileCards: false,
      isPaginated: true,
      isPaginationSimple: true,
      paginationPosition: 'bottom',
      defaultSortDirection: 'asc',
      sortIcon: 'arrow-up',
      sortIconSize: 'is-small',
      currentPage: 1,
      perPage: 10,
      targetArray: [[{ 'type': 'TEST' }]]
    };
  },

  methods: {
    edit: function edit(id) {
      console.log('in edit ' + id);
      for (var i = 0; i < this.data.length; i++) {
        if (id === this.data[i].id) {
          this.dataLength = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(this.data[i]).length;
          console.log(this.dataLength);
          this.editData = this.data[i];
          this.editData.fill = '';
          console.log(this.editData);
          this.isShowModal = true;
          break;
        }
      }
    },
    activate: function activate(id) {
      var _this = this;

      console.log('in activate ' + id);
      for (var i = 0; i < this.data.length; i++) {
        if (id === this.data[i].id) {
          __WEBPACK_IMPORTED_MODULE_2_axios___default.a.get('/api/v1/Project/activateListElement?data=orders&id=' + id).then(function (response) {
            console.log(response.data);
            _this.getOrdersList();
          }).catch(function (error) {
            console.log(error);
          });
        }
      }
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$emit('infoMessage', 'Prüfauftrag aktiviert');
    },
    remove: function remove(id) {
      var _this2 = this;

      console.log('in remove ' + id);
      for (var i = 0; i < this.data.length; i++) {
        if (id === this.data[i].id) {
          __WEBPACK_IMPORTED_MODULE_2_axios___default.a.get('/api/v1/Project/deleteListElement?data=orders&id=' + id).then(function (response) {
            console.log(response.data);
            _this2.getOrdersList();
          }).catch(function (error) {
            console.log(error);
          });
        }
      }
    },
    newOrder: function newOrder(task) {
      if (this.selected.part) {
        for (var i = 0; i < this.data.length; i++) {
          if (this.selected.id === this.data[i].id) {
            this.dataLength = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(this.data[i]).length;
            console.log(this.dataLength);
            this.editData = this.data[i];
            this.editData.id = 9999999;
            this.editData.fill = '';
            console.log(this.editData);
            this.isShowModal = true;
            break;
          }
        }
      } else {
        this.editData.id = 9999999;
        this.editData.extid = '0000';
        this.editData.part = '---';
        this.editData.order = '---';
        this.editData.machine = '---';
        this.editData.status = 0;
        this.editData.fill = '';
        this.isShowModal = true;
      }
    },
    save: function save() {
      var _this3 = this;

      this.isShowModal = false;
      console.log(this.editData);
      __WEBPACK_IMPORTED_MODULE_2_axios___default.a.post('/api/v1/Project/saveListElement?data=orders&id=' + this.editData.id, this.editData).then(function (response) {
        console.log(response.data);
        _this3.getOrdersList();
      }).catch(function (error) {
        console.log(error);
      });
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$emit('infoMessage', 'Prüfauftrag gespeichert');
    },
    close: function close() {
      console.log('in close');
      this.isShowModal = false;
    },
    page: function page(_page) {
      this.currentPage = _page;
      if (this.currentPage < 1) {
        this.currentPage = 1;
      }
      if ((this.currentPage - 1) * this.countPerPage > this.total) {
        this.currentPage = parseInt(this.total / this.countPerPage) + 1;
      }
      this.index = (this.currentPage - 1) * this.countPerPage;
      this.getOrdersList();
    },
    getOrdersList: function getOrdersList() {
      var _this4 = this;

      __WEBPACK_IMPORTED_MODULE_2_axios___default.a.get('/api/v1/Project/getList?data=orders&index=' + this.index + '&count=' + this.countPerPage).then(function (response) {
        _this4.total = response.data.total;
        _this4.data = response.data.data;
        // console.log(this.data)
      }).catch(function (error) {
        console.log(error);
      });
    },
    selectOrder: function selectOrder(p) {
      for (var i = 0; i < this.data.length; i++) {
        document.getElementById('ordersList_' + this.data[i].id).classList.remove('is-selected');
        if (this.data[i].id === p.id) {
          document.getElementById('ordersList_' + this.data[i].id).classList.add('is-selected');
          this.selected = p;
        }
      }
    },
    closeOrdersModal: function closeOrdersModal() {
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$emit('toggleOrdersModal');
    }
  },
  mounted: function mounted() {
    this.getOrdersList();
  }
});

/***/ }),

/***/ "A+gs":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "A0pp":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_bus__ = __webpack_require__("qKYu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_txt__ = __webpack_require__("pKHy");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_axios__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* eslint-disable */




/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'navbarTop',
  props: ['activeProject', 'runningMode', 'showParts', 'showTargets', 'showOrders', 'showCharts'],
  components: {
    txt: __WEBPACK_IMPORTED_MODULE_1__components_txt__["a" /* default */]
  },
  data: function data() {
    return {
      loginModal: false
    };
  },

  methods: {
    changeMainView: function changeMainView(target) {
      var _this = this;

      var self = this;
      if (target == 1) {
        this.toggleCharts(1);
      }
      if (target == 0) {
        this.toggleCharts(0);
        setTimeout(function () {
          _this.toggleFrameIn();
        }, 100);
      }
    },
    setRunningMode: function setRunningMode(mode) {
      __WEBPACK_IMPORTED_MODULE_2_axios___default.a.get('api/v1/Project/setRunningMode?runningMode=' + mode).then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$emit('setRunningMode', mode);
        // this.runningMode = mode
      });
      __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$emit('reloadImage');
    },
    toggleFrameIn: function toggleFrameIn() {
      __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$emit('showFrameIn');
    },
    toggleParts: function toggleParts() {
      __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$emit('togglePartsModal');
    },
    toggleOrders: function toggleOrders() {
      __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$emit('toggleOrdersModal');
    },
    toggleCharts: function toggleCharts(n) {
      __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$emit('showCharts', n);
    },
    toggleTargets: function toggleTargets() {
      __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$emit('toggleTargets');
    },
    resetImage: function resetImage() {
      __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$emit('resetImage');
    }
  },
  mounted: function mounted() {}
});

/***/ }),

/***/ "B3JO":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"imageDiv"},on:{"contextmenu":function($event){$event.preventDefault();return _vm.$refs.moiSelectMenu.open($event)}}},[_c('svg',{attrs:{"id":"frameInOut","width":_vm.width,"height":_vm.height}},[_c('defs',[_c('pattern',{attrs:{"id":"backImage","patternUnits":"userSpaceOnUse","width":_vm.width,"height":_vm.height}},[_c('image',{attrs:{"id":"image","xlink:href":_vm.frameSrc,"x":"0","y":"0","width":_vm.width,"height":_vm.height}})])]),_vm._v(" "),_c('rect',{attrs:{"id":"$BG","x":"0","y":"0","width":_vm.width,"height":_vm.height,"stroke":"red","stroke-width":"1","fill":"url(#backImage)"}})]),_vm._v(" "),_c('span',{attrs:{"id":"mousePosDisplay"}},[_vm._v(_vm._s(_vm.pos.svg)+"|"+_vm._s(_vm.pos.x)+"|"+_vm._s(_vm.pos.y))])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "C2SN":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_toolRectPicker_vue__ = __webpack_require__("t6xF");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_a840b6ae_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_toolRectPicker_vue__ = __webpack_require__("otSL");
function injectStyle (ssrContext) {
  __webpack_require__("SF4R")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-a840b6ae"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_toolRectPicker_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_a840b6ae_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_toolRectPicker_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "CD6P":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_bus__ = __webpack_require__("qKYu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_aiCore_sidebarToolbox__ = __webpack_require__("LPjq");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_txt__ = __webpack_require__("pKHy");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'sidebarconfig',
  components: {
    sidebarToolbox: __WEBPACK_IMPORTED_MODULE_2__components_aiCore_sidebarToolbox__["a" /* default */],
    txt: __WEBPACK_IMPORTED_MODULE_3__components_txt__["a" /* default */]
  },
  props: ['activePlugin', 'targets', 'activeProject', 'activePart', 'targets'],
  data: function data() {
    return {
      pluginConfig: {},
      pluginReadme: {},
      pluginsList: [],
      sidebarTab: 'toolbox'
    };
  },

  watch: {
    activePlugin: function activePlugin() {
      this.readpluginConfig();
      this.readpluginReadMe();
    }
  },
  methods: {
    isActive: function isActive(plugin) {
      for (var i = 0; i < this.activeProject.plugins.length; i++) {
        if (plugin === this.activeProject.plugins[i].name) {
          return true;
        }
      }
      return false;
    },
    readPluginList: function readPluginList() {
      var _this = this;

      if (this.activePlugin !== '') {
        __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('/api/v1/Project/listPlugins').then(function (response) {
          // console.log(response.data)
          _this.pluginsList = response.data;
        }).catch(function (error) {
          console.log(error);
        });
      }
    },
    readpluginConfig: function readpluginConfig() {
      var _this2 = this;

      if (this.activePlugin !== '') {
        __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('/api/v1/' + this.activePlugin + '/getConfig').then(function (response) {
          // console.log(response.data)
          _this2.pluginConfig = response.data;
          _this2.updatePluginList();
        }).catch(function (error) {
          console.log(error);
        });
      }
    },
    updatePluginList: function updatePluginList() {
      // console.log(this.activeProject)
      // console.log(this.pluginConfig)
      this.pluginConfig.frameIn.select = 'default';
      for (var i = 0; i < this.activeProject.plugins.length - 1; i++) {
        if (this.activeProject.plugins[i].name !== this.activePlugin) {
          this.pluginConfig.frameIn.select += '~' + this.activeProject.plugins[i].name;
        }
      }
    },
    readpluginReadMe: function readpluginReadMe() {
      var _this3 = this;

      if (this.activePlugin !== '') {
        __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('/api/v1/' + this.activePlugin + '/getReadme').then(function (response) {
          // console.log(response.data)
          _this3.pluginReadme = response.data;
        }).catch(function (error) {
          console.log(error);
        });
      }
    },
    updateConfig: function updateConfig() {
      var btn = document.getElementById('updateConfigButton');
      btn.classList.toggle('is-loading');
      setTimeout(function () {
        btn.classList.toggle('is-loading');
      }, 1000);
      // console.log(this.pluginConfig)
      for (var o in this.pluginConfig) {
        if (o.type === 1 && o.valueType === 'number') {
          if (o.value.indexOf('.') >= 0 || o.value.indexOf(',') >= 0) {
            o.value = parseFloat(o.value);
          } else {
            o.value = parseInt(o.value);
          }
        }
      }
      __WEBPACK_IMPORTED_MODULE_0_axios___default.a.post('/api/v1/' + this.activePlugin + '/saveConfig', this.pluginConfig).then(function (response) {
        console.log(response);
      }).catch(function (error) {
        console.log(error);
      });
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$emit('infoMessage', 'Pluginkonfiguration gespeichert');
    },
    testConfig: function testConfig() {
      var data = {};
      __WEBPACK_IMPORTED_MODULE_0_axios___default.a.post('/api/v1/' + this.activePlugin + '/start', data).then(function (response) {
        console.log(response);
      }).catch(function (error) {
        console.log(error);
      });
    },
    capitalize: function capitalize(s) {
      if (typeof s !== 'string') return '';
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
  },
  mounted: function mounted() {
    var _this4 = this;

    this.readpluginConfig();
    this.readpluginReadMe();
    var self = this;
    setTimeout(function () {
      self.readPluginList();
    }, 200);
    __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$on('pluginStatusUpdate', function (pin, status) {
      if (self.activePlugin === pin && status === '$Finished') {
        // TODO read targets as well
        self.readpluginConfig();
        self.readpluginReadMe();
      }
    });
    __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$on('setSidebarTabConfig', function (sidebarTab) {
      _this4.sidebarTab = 'config';
    });
  },
  beforeDestroy: function beforeDestroy() {
    __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$off('pluginStatusUpdate');
  }
});

/***/ }),

/***/ "COCN":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "CUfs":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_bus__ = __webpack_require__("qKYu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_roboCTLPositionTable__ = __webpack_require__("cFne");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_roboCTLStatusTable__ = __webpack_require__("D9XY");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'roboCTL',
  props: ['status'],
  components: {
    roboCTLPositionTable: __WEBPACK_IMPORTED_MODULE_1__components_roboCTLPositionTable__["a" /* default */],
    roboCTLStatusTable: __WEBPACK_IMPORTED_MODULE_2__components_roboCTLStatusTable__["a" /* default */]
  },
  data: function data() {
    return {};
  },

  methods: {
    sendCmd: function sendCmd(command) {
      __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$emit('hw_from_hmi_web', command);
    }
  },
  mounted: function mounted() {}
});

/***/ }),

/***/ "D9XY":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_roboCTLStatusTable_vue__ = __webpack_require__("dBFg");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_fdcdce4e_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_roboCTLStatusTable_vue__ = __webpack_require__("U/LJ");
function injectStyle (ssrContext) {
  __webpack_require__("XeD6")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-fdcdce4e"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_roboCTLStatusTable_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_fdcdce4e_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_roboCTLStatusTable_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "DefD":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "Dq30":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__("/5sW");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_bus__ = __webpack_require__("qKYu");
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'mqtt',
  props: ['subscriptionFilter'],
  data: function data() {
    return {
      message: '',
      messages: [],
      plugins: []
    };
  },

  mqtt: {
    'logger/#': function logger(msg) {
      this.message = msg.toString();
      this.notifyActivePlugin(this.message);
      this.messages.unshift(this.message);
      __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].set(this.messages, 0, this.message);
      if (this.messages.length > 3) {
        this.messages.pop();
      }
      // this.messages.reverse()
      // console.log(this.message)
    },
    'status/#': function status(msg) {
      var status = msg.toString().replace(/'/g, '"');
      var obj = JSON.parse(status);
      // console.log(obj)
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$emit('statusUpdate', obj);
    }
  },
  methods: {
    notifyActivePlugin: function notifyActivePlugin(message) {
      var ma = message.split('@');
      if (ma.length > 2) {
        if (ma[2] === '$Start' || ma[2] === '$Finished') {
          // this.plugins[ma[1]] = ''
          // if (ma.length > 2) {
          // this.plugins[ma[1]] = ma[3]
          // }
          __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$emit('pluginStatusUpdate', ma[1], ma[2], ma[3]);
        } else if (ma[2].includes('$Error')) {
          __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$emit('errorMessage', ma[1] + ' ' + ma[2]);
          // console.log(';' + ma[2])
          // console.log('i emitted an error')
        } else if (ma[2].includes('$Info')) {
          // this.plugins[ma[1]] = Date.now()
          __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$emit('infoMessage', ma[2]);
          // console.log(';' + ma[2])
          // console.log('i emitted an error')
        }
      }
    }
  },
  mounted: function mounted() {
    // TODO ONYL SUBSCRIBE TO MESSAGES FOR THIS PROJECT
    // Subscribe to mqtt messages
    this.$mqtt.subscribe('logger/' + this.subscriptionFilter + '/#');
    this.$mqtt.subscribe('status/' + this.subscriptionFilter + '/#');
  }
});

/***/ }),

/***/ "E+FC":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_txtSelect_vue__ = __webpack_require__("suIF");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3c81a8cc_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_txtSelect_vue__ = __webpack_require__("6chM");
function injectStyle (ssrContext) {
  __webpack_require__("wJKU")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-3c81a8cc"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_txtSelect_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3c81a8cc_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_txtSelect_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "E2++":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarWrapper_vue__ = __webpack_require__("P7od");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1965c760_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sidebarWrapper_vue__ = __webpack_require__("0u6B");
function injectStyle (ssrContext) {
  __webpack_require__("y0u4")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-1965c760"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarWrapper_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1965c760_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sidebarWrapper_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "EWct":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_bus__ = __webpack_require__("qKYu");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'notificationDisplay',
  props: [],
  components: {},
  data: function data() {
    return {
      notification: '',
      information: ''
    };
  },

  methods: {},
  mounted: function mounted() {
    var _this = this;

    console.log('in notificationDisplay mounted');
    __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$on('showInformation', function (info) {
      _this.information = info;
    });
    __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$on('showNotification', function (info) {
      _this.notification = info;
    });
    __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$on('errorMessage', function (error) {
      _this.notification = error;
    });
    __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$on('infoMessage', function (info) {
      _this.information = info.replace('$Info - ', '');
      console.log(_this.information);
      setTimeout(function () {
        _this.information = '';
      }, 2000);
    });
  },
  beforeDestroy: function beforeDestroy() {
    console.log('in notificationDisplay beforeDestroy');
    __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$off('showInformation', null);
    __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$off('showNotification', null);
    __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$off('infoMessage', null);
  }
});

/***/ }),

/***/ "EmVM":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'roboCTLPositionTable',
  components: {},
  props: ['status'],
  data: function data() {
    return {};
  },

  methods: {},
  mounted: function mounted() {}
});

/***/ }),

/***/ "GCDk":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_bus__ = __webpack_require__("qKYu");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'listTargets',
  props: ['activePart', 'targets'],
  components: {},
  data: function data() {
    return {
      isEmpty: false,
      isBordered: false,
      isStriped: true,
      isNarrowed: true,
      isHoverable: true,
      isFocusable: false,
      isLoading: false,
      hasMobileCards: false,
      isPaginated: true,
      isPaginationSimple: true,
      paginationPosition: 'bottom',
      defaultSortDirection: 'asc',
      sortIcon: 'arrow-up',
      sortIconSize: 'is-small',
      currentPage: 1,
      perPage: 10,
      targetArray: [[{ 'type': 'TEST' }]]
    };
  },

  methods: {
    closeTargetsModal: function closeTargetsModal() {
      __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$emit('toggleTargets');
    }
  },
  mounted: function mounted() {
    var _this = this;

    setTimeout(function () {
      _this.targetArray = _this.targets;
    }, 200);
  }
});

/***/ }),

/***/ "GK12":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "GjPS":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "GsKP":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_bus__ = __webpack_require__("qKYu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_context__ = __webpack_require__("L84e");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'imageContainer',
  props: ['activePlugin', 'activeProject', 'showFrameIn'],
  components: {
    VueContext: __WEBPACK_IMPORTED_MODULE_1_vue_context__["a" /* VueContext */]
  },
  data: function data() {
    return {
      frameSrc: '',
      scale: 1,
      svgElementID: 1,
      trueHeight: 1536,
      trueWidth: 2048,
      pos: { 'x': 0, 'y': 0 },
      dragPos: { 'x': 0, 'y': 0 },
      dragStart: { 'x': 0, 'y': 0 },
      elDragStart: { 'x': 0, 'y': 0 },
      dragStatus: false,
      moving: false,
      width: 600,
      height: 400
    };
  },

  watch: {
    activePlugin: function activePlugin() {
      this.loadImage();
    },
    showFrameIn: function showFrameIn() {
      this.loadImage();
    }
  },
  methods: {
    resetImage: function resetImage() {
      this.dragPos.x = 0;
      this.dragPos.y = 0;
      this.scale = 1;
      document.getElementById('frameInOut').style.transform = 'scale(' + this.scale + ') translate(' + this.dragPos.x + 'px,' + this.dragPos.y + 'px)';
    },
    contextMenu: function contextMenu() {
      console.log('in the context menu');
    },
    makeBaseImg: function makeBaseImg(url) {
      document.getElementById('frameInOut').style.transform = 'scale(' + this.scale + ') translate(' + this.dragPos.x + 'px,' + this.dragPos.y + 'px)';
      var msg = {
        'scale': this.scale,
        'x': this.trueWidth,
        'y': this.trueHeight,
        'dx': this.dragPos.x,
        'dy': this.dragPos.y,
        'xDiv': this.width,
        'yDiv': this.height
      };
      __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$emit('imageTransformed', msg);
      // }
    },
    loadImage: function loadImage() {
      if (this.activePlugin !== '') {
        if (this.activePlugin === 'Camera' || this.activePlugin === 'Flir') {
          this.frameSrc = '/api/v1/' + this.activePlugin + '/stream?camera=0';
          this.makeBaseImg(this.frameSrc);
        } else {
          if (this.showFrameIn === true) {
            this.frameSrc = '/api/v1/' + this.activePlugin + '/getFrame?frame=out&camera=0&rand=' + Math.random(1);
          } else {
            this.frameSrc = '/api/v1/' + this.activePlugin + '/getFrame?frame=in&camera=0&rand=' + Math.random(1);
          }
          this.makeBaseImg(this.frameSrc);
        }
      }
    },
    getMousePosition: function getMousePosition(event) {
      // console.log(this.trueWidth, this.trueHeight, event.offsetX, event.offsetY, event.path[1].clientWidth, event.path[1].clientHeight)
      var x = parseInt(this.trueWidth * event.offsetX / event.path[1].clientWidth);
      var y = parseInt(this.trueHeight * event.offsetY / event.path[1].clientHeight);
      // console.log(x, y)
      return { 'svg': event.path[0].id, 'x': x, 'y': y };
    },
    mouseManagement: function mouseManagement(event) {
      // only when the click landed on the image
      // console.log(event.path)
      if (event.path[1].id === 'frameInOut') {
        // .nodeName === 'CANVAS') {
        if (event.type === 'mousemove') {
          // console.log(event.path[0])
          this.pos = this.getMousePosition(event);
        }
        if (event.which === 0) {
          // && event.path[0].id !== '$BG') {
          // console.log(event.type, event.path[0].id)
          this.emitMouseEvent(event.type, event.path[0].id);
        }
        if (event.which === 1) {
          // console.log(event.type, event.path[0].id)
          if (event.type === 'mouseup') {
            this.emitMouseEvent(event.type, event.path[0].id);
          }
          // console.log(event.type)
          if (event.type === 'mousedown') {
            this.emitMouseEvent(event.type, event.path[0].id);
          }
          if (event.type === 'mousemove') {
            this.emitMouseEvent(event.type, event.path[0].id);
          }
        }
        if (event.which === 2) {
          // calculations relative to dragged and scaled image position
          var pos = { 'x': event.clientX / this.scale, 'y': event.clientY / this.scale };
          if (event.type === 'mouseup') {
            this.dragStatus = false;
          }
          if (event.type === 'mousemove') {
            if (event.buttons === 4) {
              if (!this.dragStatus) {
                this.dragStart = pos;
              }
              this.dragStatus = true;
              this.dragPos.x += pos.x - this.dragStart.x;
              this.dragPos.y += pos.y - this.dragStart.y;
              document.getElementById('frameInOut').style.transform = 'scale(' + this.scale + ') translate(' + this.dragPos.x + 'px,' + this.dragPos.y + 'px)';
              this.dragStart = pos;
            } else {
              this.dragStatus = false;
            }
            // console.log(event.type, event.button, event.buttons)
          }
        }
      }
    },
    emitMouseEvent: function emitMouseEvent(typ, overElement) {
      __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$emit('mouseEvent', {
        'state': typ,
        'id': overElement,
        'x': this.pos.x,
        'y': this.pos.y,
        'dx': this.dragPos.x,
        'dy': this.dragPos.y,
        'trueX': this.trueWidth,
        'trueY': this.trueHeight,
        'scale': this.scale,
        'frameIn': this.showFrameIn,
        'xDiv': this.width,
        'yDiv': this.width * this.trueHeight / this.trueWidth
      });
    },
    runOnWheel: function runOnWheel(e) {
      // SG: my mouse returned +- 95 not +-53
      if (e.deltaY > 0) {
        this.scale *= 0.95; // -= 0.1
      }
      if (e.deltaY < 0) {
        this.scale *= 1.05; // += 0.1
      }
      if (this.scale < 1) {
        this.scale = 1;
      }
      // document.getElementById('frameInOut').style.transform = 'scale(' + this.scale + ')'
      document.getElementById('frameInOut').style.transform = 'scale(' + this.scale + ') translate(' + this.dragPos.x + 'px,' + this.dragPos.y + 'px)';
    },
    getImageSize: function getImageSize(event) {
      this.width = document.getElementById('imageDiv').clientWidth;
      this.height = parseInt(this.width * 1536 / 2048); // document.getElementById('imageDiv').clientHeight
    }
  },
  mounted: function mounted() {
    /* TODO Support these events - include shift / alt / control
    add the events to the element NOT the window object
    click
    dblclick
    mousedown
    mouseup */
    var el = document.getElementById('frameInOut');
    el.addEventListener('wheel', this.runOnWheel);
    el.addEventListener('mousemove', this.mouseManagement);
    el.addEventListener('mouseup', this.mouseManagement);
    el.addEventListener('mousedown', this.mouseManagement);
    el.addEventListener('resize', this.getImageSize);

    var self = this;
    __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$on('pluginStatusUpdate', function (pin, status) {
      if (self.activePlugin === pin && status === '$Finished') {
        self.loadImage();
      }
    });
    __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$on('resetImage', function () {
      self.resetImage();
    });
    __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$on('reLoadImage', function () {
      self.loadImage();
    });
    __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$on('loadImageFromTracker', function (id) {
      // Only loads Inovan_1.jpg so far
      // console.log(id)
      var date = id.date.split('T')[0];
      var time = id.date.split('T')[1];
      // console.log(date)
      self.frameSrc = '/api/v1/Project/getImage?path=../projects/' + self.activeProject.projectName + '/images/' + id.part + '/' + date + '/' + 'Document_' + time + '.jpg';
      // self.frameSrc = '/api/v1/Project/getImage?path=../projects/Inovan/images/testImages/Inovan_1.jpg'
      self.makeBaseImg(self.frameSrc);
    });
    this.getImageSize();
    // console.log('height: ' + this.height)
  },
  beforeDestroy: function beforeDestroy() {
    console.log('destroyed');
    window.removeEventListener('wheel', this.runOnWheel);
    window.removeEventListener('wheemousemovel', this.mouseManagement);
    window.removeEventListener('mouseup', this.mouseManagement);
    window.removeEventListener('mousedown', this.mouseManagement);
    window.removeEventListener('resize', this.getImageSize);
  }
});

/***/ }),

/***/ "Gz8X":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "HaSR":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "Hgxd":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"listTargets"}},[_c('b-table',{staticClass:"measuredValuesTable",attrs:{"data":_vm.targetArray,"bordered":_vm.isBordered,"striped":_vm.isStriped,"narrowed":_vm.isNarrowed,"hoverable":_vm.isHoverable,"loading":_vm.isLoading,"focusable":_vm.isFocusable,"mobile-cards":_vm.hasMobileCards,"paginated":_vm.isPaginated,"per-page":_vm.perPage,"current-page":_vm.currentPage,"pagination-simple":_vm.isPaginationSimple,"pagination-position":_vm.paginationPosition,"default-sort-direction":_vm.defaultSortDirection,"sort-icon":_vm.sortIcon,"sort-icon-size":_vm.sortIconSize,"row-class":function (row, index) { return _vm.allocateColor(row); },"aria-next-label":"Next page","aria-previous-label":"Previous page","aria-page-label":"Page","aria-current-label":"Current page"},on:{"update:currentPage":function($event){_vm.currentPage=$event}},scopedSlots:_vm._u([{key:"default",fn:function(props){return [_c('b-table-column',{attrs:{"sortable":"","field":"name","label":"Name"}},[_vm._v(_vm._s(props.row.name))]),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","numeric":"","field":"value","label":"Messwert"}},[_vm._v(_vm._s(parseFloat(props.row.value).toFixed(3)))]),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","numeric":"","field":"ut","label":"OT"}},[_vm._v(_vm._s(parseFloat(props.row.ut).toFixed(3)))]),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","numeric":"","field":"nm","label":"NM"}},[_vm._v(_vm._s(parseFloat(props.row.nm).toFixed(3)))]),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","numeric":"","field":"lt","label":"UT"}},[_vm._v(_vm._s(parseFloat(props.row.lt).toFixed(3)))])]}}])},[_c('template',{slot:"empty"},[_c('section',{staticClass:"section"},[_c('div',{staticClass:"content has-text-grey has-text-centered"},[_c('p',[_c('b-icon',{attrs:{"icon":"emoticon-sad","size":"is-large"}})],1),_vm._v(" "),_c('p',[_vm._v("Nothing here.")])])])])],2)],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "J5vx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_navbarTop_vue__ = __webpack_require__("A0pp");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6b3e2ffc_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_navbarTop_vue__ = __webpack_require__("XQVC");
function injectStyle (ssrContext) {
  __webpack_require__("S18v")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-6b3e2ffc"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_navbarTop_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6b3e2ffc_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_navbarTop_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "Jxzy":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'logs',
  data: function data() {
    return {
      intervalID: -1,
      page: 1
    };
  },

  methods: {
    readLog: function readLog(direction) {
      if (direction === 0) {
        this.page = 1;
      }
      if (direction < 0) {
        this.page -= 1;
        if (this.page < 1) {
          this.page = 1;
        }
      }
      if (direction > 0) {
        this.page += 1;
      }
      __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('/api/v1/logfiles?page=' + this.page).then(function (response) {
        console.log(response.data);
        document.getElementById('logtarget').innerHTML = response.data;
      }).catch(function (error) {
        console.log(error);
      });
    },
    reloadLog: function reloadLog() {
      var self = this;
      // this.intervalID = setInterval(function () {
      self.readLog(0);
      // }, 1000)
    }
  },
  mounted: function mounted() {
    this.reloadLog();
  }
});

/***/ }),

/***/ "KR32":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__("mvHQ");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_bus__ = __webpack_require__("qKYu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_aiCore_imageContainer__ = __webpack_require__("7rPA");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_aiCore_chartContainer__ = __webpack_require__("nBZ5");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_aiCore_trackerContainer__ = __webpack_require__("MozD");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_txt__ = __webpack_require__("pKHy");

//
//
//
//
//
//
//
//
//
//
//








/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'pluginViewer',
  props: ['activePlugin', 'pluginConfig', 'activeProject', 'targets', 'activePart', 'showCharts'],
  components: {
    imageContainer: __WEBPACK_IMPORTED_MODULE_3__components_aiCore_imageContainer__["a" /* default */],
    chartContainer: __WEBPACK_IMPORTED_MODULE_4__components_aiCore_chartContainer__["a" /* default */],
    trackerContainer: __WEBPACK_IMPORTED_MODULE_5__components_aiCore_trackerContainer__["a" /* default */],
    txt: __WEBPACK_IMPORTED_MODULE_6__components_txt__["a" /* default */]
  },
  data: function data() {
    return {
      counter: 0,
      trueHeight: 0,
      trueWidth: 0,
      clientX: Number,
      clientY: Number,
      offsetX: Number,
      offsetY: Number,
      overElement: '',
      showFrameIn: true,
      msg: {}
    };
  },

  watch: {},
  methods: {
    triggerCamera: function triggerCamera() {
      __WEBPACK_IMPORTED_MODULE_1_axios___default.a.get('/api/v1/Camera/trigger?camera=0');
    },
    displayCoords: function displayCoords() {
      var e = document.getElementById('coordsDisplayer');
      e.style.display = 'block';
    },
    hideCoords: function hideCoords() {
      var e = document.getElementById('coordsDisplayer');
      e.style.display = 'none';
    },
    showCoords: function showCoords(event) {
      // console.log(event)
      this.clientX = event.clientX;
      this.clientY = event.clientY;
      this.offsetX = parseInt(this.trueWidth * event.offsetX / event.path[1].clientWidth); // * 100 / event.currentTarget.offsetWidth)
      this.offsetY = parseInt(this.trueHeight * event.offsetY / event.path[1].clientHeight); // * 100 / event.currentTarget.offsetHeight)
      this.overElement = this.findTargetInfo();
      var mouseFollower = document.getElementById('coordsDisplayer');
      if (this.overElement !== '') {
        // mouseFollower.style.top = this.clientY + -20 + 'px'
        // mouseFollower.style.left = this.clientX + 10 + 'px'
        mouseFollower.style.display = 'block';
      } else {
        mouseFollower.style.display = 'none';
      }
    },
    findTargetInfo: function findTargetInfo() {
      // console.log(this.targets.length)
      for (var i = 0; i < this.targets.length; i++) {
        var r = Math.min(this.targets[i].w, this.targets[i].h) / 2;
        if (Math.abs(this.targets[i].x - this.offsetX) < r && Math.abs(this.targets[i].y - this.offsetY) < r) {
          var info = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(this.targets[i]).replace(/"/g, '').replace(/{/g, '').replace(/}/g, ''); // .replace(/,/g, '<br>')
          return info;
        }
      }
      // return ('x: ' + this.offsetX + '<br>y: ' + this.offsetY)
      return '';
    }
  },
  beforeUpdate: function beforeUpdate() {
    this.counter++;
    // console.log(this.counter)
  },
  mounted: function mounted() {
    var self = this;
    __WEBPACK_IMPORTED_MODULE_2__components_bus__["a" /* default */].$on('showFrameIn', function () {
      self.showFrameIn = !self.showFrameIn;
    });
    __WEBPACK_IMPORTED_MODULE_2__components_bus__["a" /* default */].$on('imageTransformed', function (msg) {
      self.trueWidth = msg.x;
      self.trueHeight = msg.y;
      self.msg = msg;
      // document.getElementById('imgWrapper').style.height = (msg.yDiv + 10) + 'px'
    });
  }
});

/***/ }),

/***/ "LPjq":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarToolbox_vue__ = __webpack_require__("lRdT");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2a26a0ff_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sidebarToolbox_vue__ = __webpack_require__("XZo9");
function injectStyle (ssrContext) {
  __webpack_require__("PEDs")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-2a26a0ff"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarToolbox_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2a26a0ff_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sidebarToolbox_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "LgMU":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{},[_vm._v("\n  Lines Tool\n  "),_c('br'),_vm._v(" "),_c('button',{staticClass:"button is-info is-small modal-button",on:{"click":function($event){_vm.isShowModal = true}}},[_vm._v("New Line")]),_vm._v(" "),_c('br'),_vm._v("\n  Active Setting: "+_vm._s(_vm.activeTool)+"\n  "),_vm._v("\n  "+_vm._s(_vm.message)),_c('br'),_vm._v(" "),_c('br'),_vm._v(" "),_c('div',{},_vm._l((_vm.lines),function(target,index){return _c('div',{key:index},[_c('div',{staticClass:"columns listItem",attrs:{"id":'lineList' + target},on:{"click":function($event){_vm.toggleLineAccordion('lineList' + target);}}},[_c('div',{staticClass:"column is-10 has-text-left"},[_vm._v(_vm._s(_vm.targets[target].type)+"."+_vm._s(_vm.targets[target].id))]),_vm._v(" "),_vm._m(0,true),_vm._v(" "),_vm._m(1,true)]),_vm._v(" "),_c('div',{staticClass:"columns panel",attrs:{"id":'lineList' + target + 'panel'}},[_vm._m(2,true)])])}),0)])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"column is-1"},[_c('button',{staticClass:"button is-small"},[_c('i',{staticClass:"fas fa-trash-alt"})])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"column is-1"},[_c('i',{staticClass:"fas fa-chevron-down"})])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('table',{staticClass:"table is-narrow"},[_c('tr',{},[_c('td',[_vm._v("Kantensrichtung")]),_vm._v(" "),_c('td',{staticClass:"tabData has-text-left"},[_c('div',{staticClass:"select"},[_c('select',[_c('option',{attrs:{"value":"0"}},[_vm._v("Alle")]),_vm._v(" "),_c('option',{attrs:{"value":"1"}},[_vm._v("hell -> dunkel")]),_vm._v(" "),_c('option',{attrs:{"value":"2"}},[_vm._v("dunkel -> hell")])])])])]),_vm._v(" "),_c('tr',[_c('td',[_vm._v("Projektionstyp")]),_vm._v(" "),_c('td',{staticClass:"tabData has-text-left"},[_c('div',{staticClass:"select"},[_c('select',[_c('option',{attrs:{"value":"0"}},[_vm._v("Mittelwert")]),_vm._v(" "),_c('option',{attrs:{"value":"1"}},[_vm._v("Minimum")]),_vm._v(" "),_c('option',{attrs:{"value":"2"}},[_vm._v("Maximum")]),_vm._v(" "),_c('option',{attrs:{"value":"3"}},[_vm._v("Median")])])])])]),_vm._v(" "),_c('tr',[_c('td',[_vm._v("Filter N")]),_vm._v(" "),_c('td',{staticClass:"tabData has-text-left"},[_c('input',{attrs:{"value":"5"}})])]),_vm._v(" "),_c('tr',[_c('td',[_vm._v("Max. Gradient")]),_vm._v(" "),_c('td',{staticClass:"tabData has-text-left"},[_c('input',{attrs:{"value":"7"}})])]),_vm._v(" "),_c('tr',[_c('td',[_vm._v("Min. Gradient Differenz")]),_vm._v(" "),_c('td',{staticClass:"tabData has-text-left"},[_c('input',{attrs:{"value":"1"}})])])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "M93x":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__ = __webpack_require__("xJD8");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_40557724_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__ = __webpack_require__("04CT");
function injectStyle (ssrContext) {
  __webpack_require__("Mk+Y")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_40557724_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "Mk+Y":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "MozD":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_trackerContainer_vue__ = __webpack_require__("960g");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4fb127f5_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_trackerContainer_vue__ = __webpack_require__("rI6Q");
function injectStyle (ssrContext) {
  __webpack_require__("lppd")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-4fb127f5"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_trackerContainer_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4fb127f5_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_trackerContainer_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "MraH":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"listTargets"}},[_c('div',{staticClass:"modal-card"},[_c('header',{staticClass:"modal-card-head"},[_c('p',{staticClass:"modal-card-title"},[_vm._v("Prüfpläne")]),_vm._v(" "),_c('button',{staticClass:"delete is-pulled-right",attrs:{"aria-label":"close"},on:{"click":function($event){_vm.$router.push('/plugins');_vm.closePartsModal()}}})]),_vm._v(" "),_c('section',{staticClass:"modal-card-body"},[_c('b-table',{attrs:{"data":_vm.data,"bordered":_vm.isBordered,"striped":_vm.isStriped,"narrowed":_vm.isNarrowed,"hoverable":_vm.isHoverable,"loading":_vm.isLoading,"focusable":_vm.isFocusable,"mobile-cards":_vm.hasMobileCards,"paginated":_vm.isPaginated,"per-page":_vm.perPage,"current-page":_vm.currentPage,"pagination-simple":_vm.isPaginationSimple,"pagination-position":_vm.paginationPosition,"default-sort-direction":_vm.defaultSortDirection,"sort-icon":_vm.sortIcon,"sort-icon-size":_vm.sortIconSize,"default-sort":"user.first_name","aria-next-label":"Next page","aria-previous-label":"Previous page","aria-page-label":"Page","aria-current-label":"Current page"},on:{"update:currentPage":function($event){_vm.currentPage=$event}},scopedSlots:_vm._u([{key:"default",fn:function(props){return [_c('b-table-column',{attrs:{"sortable":"","field":"edit","label":""}},[_c('button',{staticClass:"button is-small modal-button",on:{"click":function($event){_vm.edit(props.row.number, props.row.version)}}},[_c('i',{staticClass:"fas fa-edit"})])]),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","field":"updated","label":"updated"}},[_vm._v(_vm._s(props.row.ts.split('+')[0]))]),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","field":"part","label":"part"}},[_vm._v(_vm._s(props.row.number))]),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","field":"version","label":"version","centered":""}},[_vm._v(_vm._s(props.row.version))]),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","field":"remove","label":"","centered":""}},[_c('button',{staticClass:"button is-danger is-small",on:{"click":function($event){_vm.remove(props.row)}}},[_c('i',{staticClass:"fas fa-trash"})])])]}}])},[_c('template',{slot:"empty"},[_c('section',{staticClass:"section"},[_c('div',{staticClass:"content has-text-grey has-text-centered"},[_c('p',[_c('b-icon',{attrs:{"icon":"emoticon-sad","size":"is-large"}})],1),_vm._v(" "),_c('p',[_vm._v("Nothing here.")])])])])],2)],1)]),_vm._v(" "),_c('div',{staticClass:"modal",class:{ 'is-active': _vm.isShowModal },attrs:{"id":"modal-parts"}},[_c('div',{staticClass:"modal-background"}),_vm._v(" "),(_vm.editData.coi)?_c('div',{staticClass:"modal-card"},[_c('header',{staticClass:"modal-card-head"},[_c('p',{staticClass:"modal-card-title"},[_c('txt',{attrs:{"tid":"part"}})],1),_vm._v(" "),_c('button',{staticClass:"delete",attrs:{"aria-label":"close"},on:{"click":function($event){_vm.isShowModal = false}}})]),_vm._v(" "),_c('section',{staticClass:"modal-card-body"},[_c('div',_vm._l((_vm.editData),function(edt,name){return _c('div',{key:edt.id,staticClass:"field is-horizontal",attrs:{"id":'edit_' + name}},[(typeof edt != 'object' && !_vm.fields[name].hidden)?_c('div',{staticClass:"field-label"},[_c('label',{staticClass:"label"},[_c('txt',{attrs:{"tid":name}})],1)]):_vm._e(),_vm._v(" "),(typeof edt != 'object' &&  !_vm.fields[name].hidden)?_c('div',{staticClass:"field-body"},[_c('div',{staticClass:"field"},[(name != 'status')?_c('div',{staticClass:"control"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.editData[name]),expression:"editData[name]"}],staticClass:"input",domProps:{"value":(_vm.editData[name])},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(_vm.editData, name, $event.target.value)}}})]):_vm._e(),_vm._v(" "),(name == 'status')?_c('div',{staticClass:"control"},[_c('div',{staticClass:"select"},[_c('txtSelect',{attrs:{"tid":"order-status-select"},model:{value:(_vm.editData[name]),callback:function ($$v) {_vm.$set(_vm.editData, name, $$v)},expression:"editData[name]"}})],1)]):_vm._e()])]):_vm._e()])}),0),_vm._v(" "),_c('div',{staticClass:"tabs"},[_c('ul',_vm._l((_vm.editData.coi),function(cidx,index){return _c('li',{key:index,class:{ 'is-active': _vm.selectedCoi == index },attrs:{"id":'tab_' + index},on:{"click":function($event){_vm.selectedCoi=index}}},[_c('a',[_vm._v("M"+_vm._s(index+1))])])}),0)]),_vm._v(" "),(_vm.editData.coi)?_c('div',{staticClass:"tabContent"},_vm._l((_vm.editData.coi[_vm.selectedCoi]),function(coiEdt,attr){return _c('div',{key:attr,staticClass:"field is-horizontal",attrs:{"id":'edit_' + attr}},[(!_vm.fields[attr].hidden)?_c('div',{staticClass:"field-label is-normal"},[_c('label',{staticClass:"label"},[_c('txt',{attrs:{"tid":attr}})],1)]):_vm._e(),_vm._v(" "),(!_vm.fields[attr].hidden)?_c('div',{staticClass:"field-body"},[_c('div',{staticClass:"field"},[_c('div',{staticClass:"control"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.editData.coi[_vm.selectedCoi][attr]),expression:"editData.coi[selectedCoi][attr]"}],staticClass:"input",domProps:{"value":(_vm.editData.coi[_vm.selectedCoi][attr])},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(_vm.editData.coi[_vm.selectedCoi], attr, $event.target.value)}}})])])]):_vm._e()])}),0):_vm._e()]),_vm._v(" "),_c('footer',{staticClass:"modal-card-foot"},[_c('button',{staticClass:"button is-success",on:{"click":function($event){_vm.save(_vm.editData);_vm.isShowModal = false}}},[_c('i',{staticClass:"fas fa-save"})]),_vm._v(" "),_c('button',{staticClass:"button",on:{"click":function($event){_vm.isShowModal = false}}},[_c('i',{staticClass:"fas fa-window-close"})]),_vm._v(" "),_c('div',{staticStyle:{"position":"absolute","right":"25px"}},[_c('button',{staticClass:"button is-info",on:{"click":function($event){_vm.copyCoi()}}},[_c('i',{staticClass:"fas fa-plus"})]),_vm._v(" "),_c('button',{staticClass:"button",attrs:{"disabled":_vm.editData.coi.length < 2},on:{"click":function($event){_vm.delCoi()}}},[_c('i',{staticClass:"fas fa-trash"})])])])]):_vm._e()])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "N+kt":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarConfig_vue__ = __webpack_require__("CD6P");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_119bece1_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sidebarConfig_vue__ = __webpack_require__("N5W3");
function injectStyle (ssrContext) {
  __webpack_require__("xztI")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-119bece1"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarConfig_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_119bece1_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sidebarConfig_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "N5W3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"sidebarConfigMainWrapper"}},[_c('div',{staticClass:"tabs is-centered"},[_c('ul',[_c('li',{class:{ 'is-active': _vm.sidebarTab == 'toolbox' }},[_c('a',{on:{"click":function($event){_vm.sidebarTab='toolbox'}}},[_c('txt',{attrs:{"typ":"menu","tid":"ToolBox"}})],1)]),_vm._v(" "),_c('li',{class:{ 'is-active': _vm.sidebarTab == 'config' }},[_c('a',{on:{"click":function($event){_vm.sidebarTab='config'}}},[_c('txt',{attrs:{"typ":"menu","tid":"Config"}})],1)]),_vm._v(" "),_c('li',{class:{ 'is-active': _vm.sidebarTab == 'info' }},[_c('a',{on:{"click":function($event){_vm.sidebarTab='info'}}},[_c('txt',{attrs:{"typ":"menu","tid":"Info"}})],1)]),_vm._v(" "),_c('li',{class:{ 'is-active': _vm.sidebarTab == 'pluginLibrary' }},[_c('a',{on:{"click":function($event){_vm.sidebarTab='pluginLibrary'}}},[_c('txt',{attrs:{"typ":"menu","tid":"Library"}})],1)])])]),_vm._v(" "),_c('div',{attrs:{"id":"sidebarTabDisplay"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.sidebarTab == 'pluginLibrary'),expression:"sidebarTab == 'pluginLibrary'"}],attrs:{"id":"sidebarLibrary"}},[_c('div',[_c('ul',{staticClass:"list",attrs:{"id":"pluginLibraryList"}},_vm._l((_vm.pluginsList),function(plugin,index){return _c('li',{key:index,staticClass:"list-item"},[_vm._v("\n            "+_vm._s(plugin)+" "),(_vm.isActive(plugin))?_c('span',[_c('i',{staticClass:"fas fa-check"})]):_vm._e()])}),0)])]),_vm._v(" "),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.sidebarTab == 'toolbox'),expression:"sidebarTab == 'toolbox'"}],attrs:{"id":"sidebarToolBox"}},[_c('div',{attrs:{"id":"sidebarToolBoxContent"}},[_c('sidebarToolbox',{attrs:{"activePlugin":_vm.activePlugin,"activeProject":_vm.activeProject,"pluginConfig":_vm.pluginConfig,"activePart":_vm.activePart,"targets":_vm.targets}})],1)]),_vm._v(" "),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.sidebarTab == 'config'),expression:"sidebarTab == 'config'"}],attrs:{"id":"sidebarConfig"}},[_c('div',{},[_c('div',{},[(_vm.pluginConfig)?_c('table',{staticClass:"table is-striped is-hoverable is-fullwidth is-narrow",attrs:{"id":"configTable"}},_vm._l((_vm.pluginConfig),function(setting,index){return _c('tr',{key:index},[(setting.type == 1)?_c('td',[_c('txt',{attrs:{"typ":"var","tid":index}})],1):_vm._e(),_vm._v(" "),(setting.type == 1)?_c('td',[_c('div',{staticClass:"control has-icons-right"},[(setting.select)?_c('div',{staticClass:"select"},[_c('select',{directives:[{name:"model",rawName:"v-model",value:(setting.value),expression:"setting.value"}],staticClass:"input",attrs:{"type":setting.valueType},on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.$set(setting, "value", $event.target.multiple ? $$selectedVal : $$selectedVal[0])}}},_vm._l((setting.select.split('~')),function(option,index){return _c('option',{key:index},[_vm._v(_vm._s(option))])}),0)]):((setting.valueType)==='checkbox')?_c('input',{directives:[{name:"model",rawName:"v-model",value:(setting.value),expression:"setting.value"}],staticClass:"input",attrs:{"type":"checkbox"},domProps:{"checked":Array.isArray(setting.value)?_vm._i(setting.value,null)>-1:(setting.value)},on:{"change":function($event){var $$a=setting.value,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.$set(setting, "value", $$a.concat([$$v])))}else{$$i>-1&&(_vm.$set(setting, "value", $$a.slice(0,$$i).concat($$a.slice($$i+1))))}}else{_vm.$set(setting, "value", $$c)}}}}):((setting.valueType)==='radio')?_c('input',{directives:[{name:"model",rawName:"v-model",value:(setting.value),expression:"setting.value"}],staticClass:"input",attrs:{"type":"radio"},domProps:{"checked":_vm._q(setting.value,null)},on:{"change":function($event){_vm.$set(setting, "value", null)}}}):_c('input',{directives:[{name:"model",rawName:"v-model",value:(setting.value),expression:"setting.value"}],staticClass:"input",attrs:{"type":setting.valueType},domProps:{"value":(setting.value)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(setting, "value", $event.target.value)}}}),_c('span',{staticClass:"icon is-right"},[_vm._v(_vm._s(setting.units))])])]):_vm._e()])}),0):_vm._e(),_vm._v(" "),_c('button',{staticClass:"button is-success",attrs:{"id":"updateConfigButton"},on:{"click":function($event){_vm.updateConfig()}}},[_vm._m(0)]),_vm._v(" "),_c('button',{staticClass:"button is-info",on:{"click":function($event){_vm.testConfig()}}},[_vm._m(1)]),_vm._v(" "),_c('button',{staticClass:"button is-danger",attrs:{"disabled":""},on:{"click":function($event){_vm.resetConfig()}}},[_vm._m(2)])])])]),_vm._v(" "),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.sidebarTab == 'info'),expression:"sidebarTab == 'info'"}],attrs:{"id":"sidebarDocu"}},[(_vm.pluginReadme.description)?_c('div',{attrs:{"id":"sidebarDocuContent"}},[_c('span',{domProps:{"innerHTML":_vm._s(_vm.pluginReadme.description)}}),_c('hr'),_vm._v(" "),_c('span',{domProps:{"innerHTML":_vm._s(_vm.pluginReadme.variables)}}),_c('hr'),_vm._v(" "),_c('span',{domProps:{"innerHTML":_vm._s(_vm.pluginReadme.returns)}})]):_vm._e()])])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{staticClass:"icon"},[_c('i',{staticClass:"fas fa-save"})])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{staticClass:"icon"},[_c('i',{staticClass:"fas fa-sync-alt"})])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{staticClass:"icon"},[_c('i',{staticClass:"fas fa-trash-alt"})])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "NHnr":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__("/5sW");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__App__ = __webpack_require__("M93x");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__router__ = __webpack_require__("YaEn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue_mqtt__ = __webpack_require__("G0B7");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue_mqtt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_vue_mqtt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_buefy__ = __webpack_require__("k5jX");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_buefy_dist_buefy_css__ = __webpack_require__("/KV2");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_buefy_dist_buefy_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_buefy_dist_buefy_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__node_modules_bulma_css_bulma_css__ = __webpack_require__("GK12");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__node_modules_bulma_css_bulma_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__node_modules_bulma_css_bulma_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__node_modules_bulma_extensions_dist_css_bulma_extensions_min_css__ = __webpack_require__("DefD");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__node_modules_bulma_extensions_dist_css_bulma_extensions_min_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__node_modules_bulma_extensions_dist_css_bulma_extensions_min_css__);




// import fs from 'fs'




// import './../node_modules/bulma-extensions/bulma-switch/dist/css/bulma-switch.min.css'

// import bulmaAccordion from '/node_modules/bulma-extensions/bulma-calendar/dist/bulma-accordion.min.js'

var options = {
  port: 1884,
  protocolId: 'MQTT',
  rejectUnauthorized: true
  // key: fs.readFileSync('/home/lukas/certs/CA.key'),
  // cert: fs.readFileSync('/home/lukas/certs/CA.crt')
};

__WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].use(__WEBPACK_IMPORTED_MODULE_4_buefy__["a" /* default */], {
  defaultIconPack: 'fas'
});
__WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].use(__WEBPACK_IMPORTED_MODULE_3_vue_mqtt___default.a, 'ws://' + document.location.hostname, options);
// console.log(document.location.host)

__WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].config.productionTip = false;
__WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].prototype.$texts = {};
__WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].prototype.$languageIdx = 0;

/* eslint-disable no-new */
new __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */]({
  el: '#app',
  router: __WEBPACK_IMPORTED_MODULE_2__router__["a" /* default */],
  render: function render(h) {
    return h(__WEBPACK_IMPORTED_MODULE_1__App__["a" /* default */]);
  }
});

/***/ }),

/***/ "P7od":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_bus__ = __webpack_require__("qKYu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_aiCore_sidebarConfig__ = __webpack_require__("N+kt");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_txt__ = __webpack_require__("pKHy");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vuedraggable__ = __webpack_require__("u4Bf");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vuedraggable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_vuedraggable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_aiCore_pluginViewer__ = __webpack_require__("2Yk4");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_aiCore_sidebarMeasuredValues__ = __webpack_require__("XgqT");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* eslint-disable */








/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'sidebarWrapper',
  props: ['activeProject', 'activePlugin', 'pluginConfig', 'targets', 'startedFlag', 'activePart', 'totalCycleTime', 'runningMode', 'cycleTimes', 'cfList', 'configData', 'stereoCameras'],
  components: {
    draggable: __WEBPACK_IMPORTED_MODULE_4_vuedraggable___default.a,
    sidebarConfig: __WEBPACK_IMPORTED_MODULE_1__components_aiCore_sidebarConfig__["a" /* default */],
    txt: __WEBPACK_IMPORTED_MODULE_2__components_txt__["a" /* default */],
    pluginViewer: __WEBPACK_IMPORTED_MODULE_5__components_aiCore_pluginViewer__["a" /* default */],
    sidebarMeasuredValues: __WEBPACK_IMPORTED_MODULE_6__components_aiCore_sidebarMeasuredValues__["a" /* default */]
  },
  data: function data() {
    return {
      arrowDown: true
    };
  },

  methods: {
    activatePlugin: function activatePlugin(name) {
      __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$emit('changeActivePlugin', name);
    },
    toggleAccordion: function toggleAccordion() {
      var e = document.getElementById('accordionToggleButton');
      e.classList.toggle('active');
      var panel = document.getElementById('accordionPanel');
      var child = document.getElementById('sidebarTabDisplay');
      if (this.runningMode == 1 && panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else if (this.runningMode == 1) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      } else if (this.runningMode == 0 && panel.style.maxHeight) {
        panel.style.maxHeight = null;
        child.style.height = 75 + 'vh';
      } else if (this.runningMode == 0) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        child.style.height = 45 + 'vh';
      }
    },
    sendTestCmd: function sendTestCmd() {
      __WEBPACK_IMPORTED_MODULE_3_axios___default.a.get('/api/v1/Project/sendCmd?CMD=detect').then(function (response) {
        __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$emit('measuredValues', response);
      }).catch(function (error) {
        console.log(error);
      });
    }
  },
  mounted: function mounted() {}
});

/***/ }),

/***/ "PEDs":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "QErB":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "QXeF":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "QY3x":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "QfNX":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_toolImgPicker_vue__ = __webpack_require__("rLob");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ccb5c222_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_toolImgPicker_vue__ = __webpack_require__("W2qi");
function injectStyle (ssrContext) {
  __webpack_require__("GjPS")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-ccb5c222"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_toolImgPicker_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ccb5c222_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_toolImgPicker_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "S18v":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "SF4R":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "SFaL":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_systemConfiguration_vue__ = __webpack_require__("2ho/");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_a199275a_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_systemConfiguration_vue__ = __webpack_require__("WN5x");
function injectStyle (ssrContext) {
  __webpack_require__("QErB")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-a199275a"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_systemConfiguration_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_a199275a_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_systemConfiguration_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "SqFC":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"imageAndTargetsWrapper"}},[(_vm.activePlugin!=='Part')?_c('div',{attrs:{"id":"imgWrapper"},on:{"mousemove":function($event){_vm.showCoords($event)}}},[_c('imageContainer',{attrs:{"activePlugin":_vm.activePlugin,"activeProject":_vm.activeProject,"showFrameIn":_vm.showFrameIn}}),_vm._v(" "),_c('div',{staticStyle:{"position":"absolute","bottom":"0","z-index":"9999","background-color":"white","opacity":".95","font-size":"0.75em"},attrs:{"id":"coordsDisplayer"},domProps:{"innerHTML":_vm._s(_vm.overElement)}})],1):_vm._e()])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "T0T0":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{},[_vm._v("\n  Messungen\n  "),_c('br'),_vm._v(" "),_c('button',{staticClass:"button is-info modal-button",class:{activeButton: _vm.measureDisplay == 1},on:{"click":function($event){_vm.setMeasureDisplay(1);_vm.measureProgress=0;_vm.measurementSaved=false}}},[_vm._v("Neue Messung")]),_vm._v(" "),_c('button',{staticClass:"button is-info modal-button",class:{activeButton: _vm.measureDisplay == 0},on:{"click":function($event){_vm.setMeasureDisplay(0)}}},[_vm._v("Liste Messungen")]),_vm._v(" "),_c('br'),_vm._v(" "),(_vm.measureDisplay == 1)?_c('div',{attrs:{"id":"measureTypeListContainer"}},[_c('table',{staticClass:"table is-hoverable"},_vm._l((_vm.tools),function(tool,idx){return _c('tr',{key:idx,attrs:{"id":"measureToolTableRow"},on:{"click":function($event){_vm.selectMTool(tool);_vm.setMeasureDisplay(2)}}},[_c('td',[_c('button',{class:'button ' + _vm.selectedMTool(tool),attrs:{"disabled":tool.disabled,"data-tooltip":tool.tooltip}},[_c('img',{attrs:{"width":"20","height":"20","src":'/static/svg/' + tool.name + '.svg'}})])]),_vm._v(" "),_c('td',[_vm._v("\n          "+_vm._s(tool.tooltip)+"\n        ")])])}),0)]):_vm._e(),_vm._v(" "),(_vm.measureDisplay == 2)?_c('div',{attrs:{"id":"measureTypeListContainer"}},[_c('table',{staticClass:"table is-hoverable"},[_c('div',{staticClass:"tile is-horizontal"},[_c('table',[_vm._l((_vm.requiredPoints),function(n){return _c('tr',{key:n},[_c('td',[_c('a',{staticClass:"button is-link is-small is-rounded"},[_vm._v(_vm._s(n))])]),_vm._v(" "),_c('td',{attrs:{"colspan":"2"}},[_vm._v(_vm._s(n)+". Punkt setzen ")]),_vm._v(" "),_c('td',[(_vm.points.length >= n || _vm.measureProgress == 1)?_c('button',{staticClass:"button is-success"},[_c('i',{staticClass:"fas fa-check"})]):_vm._e()])])}),_vm._v(" "),_c('tr'),_c('tr',[_vm._m(0),_vm._v(" "),_c('td',{attrs:{"colspan":"2"}},[_c('txt',{attrs:{"tid":"saveRoi"}})],1),_vm._v(" "),_c('td',[(!_vm.measurementSaved)?_c('button',{staticClass:"button is-success",attrs:{"id":"saveMeasurementButton","disabled":_vm.measureProgress !== 1},on:{"click":function($event){_vm.saveMeasurement()}}},[_c('i',{staticClass:"fas fa-save"})]):_vm._e(),(_vm.measurementSaved)?_c('button',{staticClass:"button is-success"},[_c('i',{staticClass:"fas fa-check"})]):_vm._e()])]),_vm._v(" "),_c('tr',[_vm._m(1),_vm._v(" "),_c('td',{attrs:{"colspan":"2"}},[_c('txt',{attrs:{"tid":"testNewRoi"}})],1),_vm._v(" "),_c('td',[_c('button',{staticClass:"button is-link",on:{"click":function($event){_vm.testMeasurement()}}},[_c('i',{staticClass:"fas fa-bolt"})])])])],2)])]),_vm._v(" "),_c('hr'),_vm._v(" "),_c('button',{staticClass:"button is-danger",attrs:{"disabled":_vm.measurementSaved == true},on:{"click":function($event){_vm.cancelMeasurement()}}},[_vm._v("Abbrechen")])]):_vm._e(),_vm._v("\n  \n  "+_vm._s(_vm.message)),_c('br'),_vm._v(" "),_c('br'),_vm._v(" "),(_vm.measureDisplay == 0)?_c('div',{staticClass:"measurementTool is-horizontal"},[(_vm.moi.length === 0)?_c('div',{staticClass:"columns"},[_c('div',{staticClass:"column is-12 has-text-centered"},[_vm._v("Keine Messungen gespeichert")])]):_vm._e(),_vm._v(" "),_c('table',_vm._l((_vm.moi),function(m){return _c('tr',{key:m.id,staticClass:"listItem",attrs:{"id":'moiList_' + m.id},on:{"click":function($event){_vm.selectMoi(m)}}},[_c('td',{attrs:{"id":"measurementListSvgTd"}},[_c('img',{attrs:{"width":"20","height":"20","src":'/static/svg/' + m.path.split('~')[1] + '.svg'}})]),_vm._v(" "),(_vm.editMeasurementNames)?_c('td',[_c('input',{directives:[{name:"model",rawName:"v-model",value:(m.nickname),expression:"m.nickname"}],staticClass:"input is-small measurementNicknameInput",attrs:{"type":"text"},domProps:{"value":(m.nickname)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(m, "nickname", $event.target.value)}}})]):_vm._e(),_vm._v(" "),(!_vm.editMeasurementNames)?_c('td',[_vm._v(_vm._s(m.nickname))]):_vm._e(),_vm._v(" "),_c('td',[_vm._v(_vm._s(m.path.split('~')[0]))]),_vm._v(" "),_c('td',[_vm._v(_vm._s(m.path.split('~')[2]))]),_vm._v(" "),_c('td',[_vm._v(_vm._s(m.path.split('~')[3]))]),_vm._v(" "),_c('td',[_vm._v(_vm._s(m.path.split('~')[4]))]),_vm._v(" "),_c('td',[_vm._v(_vm._s(m.path.split('~')[5]))]),_vm._v(" "),_c('td',[_c('button',{staticClass:"button is-small",on:{"click":function($event){_vm.deleteMoi(m.id)}}},[_c('i',{staticClass:"fas fa-trash-alt"})])])])}),0),_vm._v(" "),_c('br'),_vm._v(" "),_c('button',{staticClass:"button is-info",on:{"click":function($event){_vm.editMeasurementNames = !_vm.editMeasurementNames}}},[_c('i',{staticClass:"fas fa-cog"})]),_vm._v(" "),_c('button',{staticClass:"button is-success",attrs:{"disabled":!_vm.editMeasurementNames},on:{"click":function($event){_vm.saveMeasurement();_vm.editMeasurementNames = false}}},[_c('i',{staticClass:"fas fa-save"})])]):_vm._e()])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('td',[_c('a',{staticClass:"button is-link is-small is-rounded"},[_vm._v("3")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('td',[_c('a',{staticClass:"button is-link is-small is-rounded"},[_vm._v("4")])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "U/LJ":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{attrs:{"id":"tables"}},[_c('div',{attrs:{"id":"statusBits"}},[(_vm.status)?_c('table',{staticClass:"table is-fullwidth is-narrow"},[_vm._m(0),_vm._v(" "),_c('tr',[_c('td',[_vm._v("Moving")]),_vm._v(" "),_c('td',[_vm._v(_vm._s(_vm.status.bMoving))])]),_vm._v(" "),_c('tr',[_c('td',[_vm._v("Positon reached")]),_vm._v(" "),_c('td',[_vm._v(_vm._s(_vm.status.bPosValid))])]),_vm._v(" "),_c('tr',[_c('td',[_vm._v("Command active")]),_vm._v(" "),_c('td',[_vm._v(_vm._s(_vm.status.bCMD_Running))])]),_vm._v(" "),_c('tr',[_c('td',[_vm._v("Base Position")]),_vm._v(" "),_c('td',[_vm._v(_vm._s(_vm.status.bGS_Valid))])])]):_vm._e()])])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('tr',[_c('th',[_vm._v("Status")]),_vm._v(" "),_c('th')])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "ULMo":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{},[(_vm.activeProject)?_c('div',_vm._l((_vm.activeProject.commands),function(btn,idx){return _c('div',{key:idx,staticClass:"testButtons"},[_c('button',{staticClass:"button is-medium navBarBottomButton",on:{"click":function($event){_vm.sendCmd('CMD=' + btn.program)}}},[_vm._v(_vm._s(btn.name))])])}),0):_vm._e()])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "V/v+":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "VB6y":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_notificationDisplay_vue__ = __webpack_require__("EWct");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4b77316c_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_notificationDisplay_vue__ = __webpack_require__("hxIZ");
function injectStyle (ssrContext) {
  __webpack_require__("A+gs")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-4b77316c"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_notificationDisplay_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4b77316c_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_notificationDisplay_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "VPY/":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"toolColorPicker"}},[_c('article',{staticClass:"tile is-parent notification",on:{"contextmenu":function($event){$event.preventDefault();return _vm.$refs.hsvSelectMenu.open($event)}}},[_vm._m(0),_vm._v(" "),_c('p',{staticClass:"column is-4 is-centered",attrs:{"id":"resultCOL"}}),_vm._v(" "),_vm._m(1)]),_vm._v(" "),_c('vue-context',{ref:"hsvSelectMenu"},[_c('txt',{attrs:{"tid":"selectColorAs"}}),_vm._v(" "),_c('ul',[_c('li',{on:{"click":function($event){_vm.setHSVCfgVal('max')}}},[_vm._v("maximum HSV")]),_vm._v(" "),_c('li',{on:{"click":function($event){_vm.setHSVCfgVal('min')}}},[_vm._v("minimum HSV")])])],1)],1)}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('p',{staticClass:"column is-4 is-centered",attrs:{"id":"resultHSV"}},[_vm._v("HSV"),_c('br'),_vm._v("0° 0% 0%")])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('p',{staticClass:"column is-4 is-centered",attrs:{"id":"resultRGB"}},[_vm._v("#000000"),_c('br'),_vm._v("(0,0,0)")])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "W2qi":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{},[(_vm.activeProject)?_c('div',[_c('div',{staticClass:"columns is-multiline"},_vm._l((_vm.testImages.list),function(images,index){return _c('div',{key:index,staticClass:"column"},[_c('img',{attrs:{"id":'testImageTarget' + index,"src":'/images/testImages/' + _vm.testImages.list[index]},on:{"click":function($event){_vm.changeImage(_vm.testImages.list[index]);_vm.sendCmd()}}})])}),0)]):_vm._e()])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "WGDN":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"tool"},[_c('div',{staticClass:"tile is-horizontal"},[_c('table',[_c('tr',[_vm._m(0),_vm._v(" "),_c('td',{attrs:{"colspan":"2"}},[_c('txt',{attrs:{"tid":"resetMask"}})],1),_vm._v(" "),_c('td',[_c('button',{staticClass:"button is-warning",on:{"click":function($event){_vm.resetMask(); _vm.points=[]}}},[_c('i',{staticClass:"fas fa-undo"})])])]),_vm._v(" "),_c('tr',[_vm._m(1),_vm._v(" "),_c('td',[_c('txt',{attrs:{"tid":"cropImage"}})],1),_vm._v(" "),_c('td',{staticClass:"progtd"},[_c('progress',{staticClass:"progress is-success",attrs:{"max":"2"},domProps:{"value":_vm.points.length}})]),_vm._v(" "),_c('td',[_c('button',{staticClass:"button ",class:_vm.points.length > 1 ? 'is-success' : 'is-outlined'},[_c('i',{staticClass:"fas fa-check"})])])]),_vm._v(" "),_c('tr',[_vm._m(2),_vm._v(" "),_c('td',{attrs:{"colspan":"2"}},[_c('txt',{attrs:{"tid":"saveRoi"}})],1),_vm._v(" "),_c('td',[_c('button',{staticClass:"button is-link",attrs:{"disabled":_vm.points.length!=2},on:{"click":function($event){_vm.saveRect()}}},[_c('i',{staticClass:"fas fa-save"})])])])])])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('td',[_c('a',{staticClass:"button is-link is-small is-rounded"},[_vm._v("1")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('td',[_c('a',{staticClass:"button is-link is-small is-rounded"},[_vm._v("2")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('td',[_c('a',{staticClass:"button is-link is-small is-rounded"},[_vm._v("3")])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "WN5x":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{staticClass:"columns",attrs:{"id":"projectForm"}},[_c('div',{staticClass:"column is-3"},[_c('div',{staticClass:"field"},[_c('label',{staticClass:"label"},[_vm._v("Project")]),_vm._v(" "),_c('div',{staticClass:"control"},[_c('div',{staticClass:"select"},[_c('select',{attrs:{"id":"selectProject"},on:{"change":function($event){_vm.onChange($event)}}},[_c('option',[_vm._v("select Project")]),_vm._v(" "),_c('option',{attrs:{"value":"newProject"}},[_vm._v("create new Project")]),_vm._v(" "),_vm._l((_vm.projects),function(project){return _c('option',{key:project,attrs:{"selectedProject":project},domProps:{"value":project}},[_vm._v("\n                "+_vm._s(project)+"\n              ")])})],2)])])]),_vm._v(" "),(_vm.selectedProject != '')?_c('div',{staticClass:"field"},[_c('label',{staticClass:"label"},[_vm._v("Select Plugin")]),_vm._v(" "),_c('div',{staticClass:"control"},[_c('div',{staticClass:"select"},[_c('select',_vm._l((_vm.plugins),function(plugin){return _c('option',{key:plugin,domProps:{"value":plugin}},[_vm._v("\n                "+_vm._s(plugin)+"\n              ")])}),0)])])]):_vm._e()]),_vm._v(" "),(_vm.cdata && _vm.selectedProject != '')?_c('div',{staticClass:"column is-9"},[(_vm.cdata && _vm.selectedProject != '')?_c('div',{staticClass:"field is-horizontal"},[_vm._m(0),_vm._v(" "),_c('div',{staticClass:"field-body"},[_c('div',{staticClass:"field"},[_c('p',{staticClass:"control"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.cdata.projectName),expression:"cdata.projectName"}],staticClass:"input",attrs:{"type":"text","readonly":""},domProps:{"value":(_vm.cdata.projectName)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(_vm.cdata, "projectName", $event.target.value)}}})])])])]):_vm._e(),_vm._v(" "),(_vm.cdata && _vm.selectedProject != '')?_c('div',{staticClass:"field is-horizontal"},[_vm._m(1),_vm._v(" "),_c('div',{staticClass:"field-body"},[_c('div',{staticClass:"field"},[_c('p',{staticClass:"control"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.cdata.vistaServer),expression:"cdata.vistaServer"}],staticClass:"input",attrs:{"type":"text","readonly":""},domProps:{"value":(_vm.cdata.vistaServer)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(_vm.cdata, "vistaServer", $event.target.value)}}})])])])]):_vm._e(),_vm._v(" "),(_vm.cdata && _vm.selectedProject != '')?_c('div',{staticClass:"field is-horizontal"},[_vm._m(2),_vm._v(" "),_c('div',{staticClass:"field-body"},[_c('div',{staticClass:"field"},[_c('p',{staticClass:"control"},[_c('input',{staticClass:"checkbox",attrs:{"type":"checkbox","readonly":""},domProps:{"checked":_vm.cdata.nodeRed}})])])])]):_vm._e(),_vm._v(" "),(_vm.cdata && _vm.selectedProject != '')?_c('div',{staticClass:"field is-horizontal"},[_vm._m(3),_vm._v(" "),_c('div',{staticClass:"field-body"},[_c('div',{staticClass:"field"},[_c('p',{staticClass:"control"},[_c('table',[_vm._m(4),_vm._v(" "),_vm._l((_vm.cdata.plugins),function(item,idx){return _c('tr',{key:idx},[_c('td',{staticClass:"pluginId"},[_c('input',{staticClass:"input",attrs:{"type":"number","readonly":""},domProps:{"value":idx}})]),_vm._v(" "),_c('td',{staticClass:"pluginSelect"},[_c('div',{staticClass:"control"},[_c('div',{staticClass:"select"},[_c('select',{attrs:{"id":'selectPlugin_' + idx},on:{"change":function($event){_vm.onChange($event)}}},_vm._l((_vm.plugins),function(plugin){return _c('option',{key:plugin,domProps:{"value":plugin,"selected":'plugin' + item.name == plugin}},[_vm._v("\n                            "+_vm._s(plugin)+"\n                          ")])}),0)])])])])})],2)])])])]):_vm._e()]):_vm._e()]),_vm._v(" "),_c('hr'),_vm._v("\n  "+_vm._s(_vm.activeProject)+"\n")])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"field-label is-normal"},[_c('label',{staticClass:"label"},[_vm._v("Project name")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"field-label is-normal"},[_c('label',{staticClass:"label"},[_vm._v("vistaServer")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"field-label is-normal"},[_c('label',{staticClass:"label"},[_vm._v("Node Red")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"field-label is-normal"},[_c('label',{staticClass:"label"},[_vm._v("Plugins")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('tr',[_c('th',[_vm._v("Id")]),_c('th',[_vm._v("Plugin")])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "XQVC":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{class:{ pluginBackground: _vm.$route.path == '/plugins'},attrs:{"id":"navBarAbovePluginViewer"}},[_c('nav',{staticClass:"navbar",attrs:{"role":"navigation"}},[_c('div',{staticClass:"navbar-menu",attrs:{"id":"navbarVision"}},[(_vm.activeProject != {})?_c('div',{staticClass:"navbar-start"},[_c('div',{staticClass:"navbar-item"},[_c('div',{staticClass:"dropdown is-hoverable"},[_vm._m(0),_vm._v(" "),_c('div',{staticClass:"dropdown-menu",attrs:{"id":"ansicht","role":"menu"}},[_c('div',{staticClass:"dropdown-content"},[(_vm.runningMode == 1)?_c('div',{staticClass:"dropdown-item",on:{"click":function($event){_vm.setRunningMode(0)}}},[_vm._v("\n                Config Modus\n                ")]):_vm._e(),_vm._v(" "),(_vm.runningMode == 0)?_c('div',{staticClass:"dropdown-item",on:{"click":function($event){_vm.setRunningMode(1)}}},[_vm._v("\n                Auto Modus\n                ")]):_vm._e()])])])]),_vm._v(" "),_c('div',{staticClass:"navbar-item"},[_c('div',{staticClass:"dropdown is-hoverable"},[_vm._m(1),_vm._v(" "),_c('div',{staticClass:"dropdown-menu",attrs:{"id":"ansicht","role":"menu"}},[_c('div',{staticClass:"dropdown-content"},[(!_vm.showParts)?_c('div',{staticClass:"dropdown-item",on:{"click":function($event){_vm.$router.push('/parts');_vm.toggleParts()}}},[_vm._v("\n                    Teile "),(_vm.showParts)?_c('span',{staticClass:"icon is-pulled-right"},[_c('i',{staticClass:"fas fa-check"})]):_vm._e()]):_vm._e(),_vm._v(" "),(_vm.showParts)?_c('div',{staticClass:"dropdown-item",on:{"click":function($event){_vm.$router.push('/plugins');_vm.toggleParts()}}},[_vm._v("\n                    Teile "),(_vm.showParts)?_c('span',{staticClass:"icon is-pulled-right"},[_c('i',{staticClass:"fas fa-check"})]):_vm._e()]):_vm._e(),_vm._v(" "),(!_vm.showOrders)?_c('div',{staticClass:"dropdown-item",on:{"click":function($event){_vm.$router.push('/orders');_vm.toggleOrders()}}},[_vm._v("\n                    Prüfaufträge "),(_vm.showOrders)?_c('span',{staticClass:"icon is-pulled-right"},[_c('i',{staticClass:"fas fa-check"})]):_vm._e()]):_vm._e(),_vm._v(" "),(_vm.showOrders)?_c('div',{staticClass:"dropdown-item",on:{"click":function($event){_vm.$router.push('/plugins');_vm.toggleOrders()}}},[_vm._v("\n                    Prüfaufträge "),(_vm.showOrders)?_c('span',{staticClass:"icon is-pulled-right"},[_c('i',{staticClass:"fas fa-check"})]):_vm._e()]):_vm._e(),_vm._v(" "),(!_vm.showTargets)?_c('div',{staticClass:"dropdown-item",on:{"click":function($event){_vm.$router.push('/targets');_vm.toggleTargets()}}},[_vm._v("\n                    Objektliste"),(_vm.showTargets)?_c('span',{staticClass:"icon is-pulled-right"},[_c('i',{staticClass:"fas fa-check"})]):_vm._e()]):_vm._e(),_vm._v(" "),(_vm.showTargets)?_c('div',{staticClass:"dropdown-item",on:{"click":function($event){_vm.$router.push('/plugins');_vm.toggleTargets()}}},[_vm._v("\n                    Objektliste"),(_vm.showTargets)?_c('span',{staticClass:"icon is-pulled-right"},[_c('i',{staticClass:"fas fa-check"})]):_vm._e()]):_vm._e(),_vm._v(" "),_c('hr',{staticClass:"dropdown-divider"}),_vm._v(" "),_c('div',{staticClass:"dropdown-item",on:{"click":function($event){_vm.changeMainView(1)}}},[_vm._v("\n                    Statistiken "),(_vm.showCharts)?_c('span',{staticClass:"icon is-pulled-right"},[_c('i',{staticClass:"fas fa-check"})]):_vm._e()]),_vm._v(" "),_c('div',{staticClass:"dropdown-item",on:{"click":function($event){_vm.changeMainView(0)}}},[_vm._v("\n                    Kanal 1 "),(!_vm.showCharts)?_c('span',{staticClass:"icon is-pulled-right"},[_c('i',{staticClass:"fas fa-check"})]):_vm._e()]),_vm._v(" "),_c('div',{staticClass:"dropdown-item disabledItem",attrs:{"disabled":""}},[_vm._v("\n                    Kanal 2\n                ")])])])])]),_vm._v(" "),_c('div',{staticClass:"navbar-item"},[_c('button',{staticClass:"button sideBarTopDropdown",on:{"click":function($event){_vm.resetImage()}}},[_vm._v("Bild zurücksetzen")])])]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"navbar-end"},[_c('div',{staticClass:"navbar-item"},[(_vm.runningMode == 1)?_c('span',[_vm._v("Auto Modus")]):_vm._e()]),_vm._v(" "),_c('div',{staticClass:"navbar-item"},[(_vm.runningMode == 0)?_c('span',[_vm._v("Config Modus")]):_vm._e()]),_vm._v(" "),_c('div',{staticClass:"navbar-item"},[_c('button',{staticClass:"button sideBarTopDropdown",on:{"click":function($event){_vm.loginModal = true}}},[_vm._v("Login")])])])])]),_vm._v(" "),_c('div',{staticClass:"modal",class:{ 'is-active': _vm.loginModal },attrs:{"id":"modal-parts"}},[_c('div',{staticClass:"modal-background",on:{"click":function($event){_vm.loginModal = false}}}),_vm._v(" "),_c('div',{staticClass:"modal-card"},[_c('section',{staticClass:"modal-card-head"},[_vm._v("\n      Login\n      ")]),_vm._v(" "),_vm._m(2),_vm._v(" "),_c('footer',{staticClass:"modal-card-foot"},[_c('button',{staticClass:"button is-success",on:{"click":function($event){_vm.setRunningMode(0);_vm.loginModal = false}}},[_c('i',{staticClass:"fas fa-save"})]),_vm._v(" "),_c('button',{staticClass:"button",on:{"click":function($event){_vm.loginModal = false}}},[_c('i',{staticClass:"fas fa-window-close"})])])])])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"dropdown-trigger"},[_c('button',{staticClass:"button sideBarTopDropdown",attrs:{"aria-haspopup":"true","aria-controls":"ansicht"}},[_c('span',[_vm._v("Projekt")]),_vm._v(" "),_c('span',{staticClass:"icon is-small"},[_c('i',{staticClass:"fas fa-angle-down",attrs:{"aria-hidden":"true"}})])])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"dropdown-trigger"},[_c('button',{staticClass:"button sideBarTopDropdown",attrs:{"aria-haspopup":"true","aria-controls":"ansicht"}},[_c('span',[_vm._v("Ansicht")]),_vm._v(" "),_c('span',{staticClass:"icon is-small"},[_c('i',{staticClass:"fas fa-angle-down",attrs:{"aria-hidden":"true"}})])])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{staticClass:"modal-card-body"},[_c('div',{staticClass:"field"},[_c('p',{staticClass:"control has-icons-left has-icons-right"},[_c('input',{staticClass:"input",attrs:{"type":"text","placeholder":"Benutzer"}}),_vm._v(" "),_c('span',{staticClass:"icon is-small is-left"},[_c('i',{staticClass:"fas fa-user"})]),_vm._v(" "),_c('span',{staticClass:"icon is-small is-right"},[_c('i',{staticClass:"fas fa-check"})])])]),_vm._v(" "),_c('div',{staticClass:"field"},[_c('p',{staticClass:"control has-icons-left"},[_c('input',{staticClass:"input",attrs:{"type":"password","placeholder":"Password"}}),_vm._v(" "),_c('span',{staticClass:"icon is-small is-left"},[_c('i',{staticClass:"fas fa-lock"})])])])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "XZo9":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"toolbox"}},[_c('div',[_c('div',{staticClass:"columns is-centered is-marginless",attrs:{"id":"toolListContainer"}},_vm._l((_vm.tools),function(tool,idx){return _c('span',{key:idx,staticClass:"toollist"},[_c('div',{staticClass:"dropdown is-hoverable"},[_c('div',{staticClass:"dropdown-trigger"},[_c('button',{class:'button menuListBtn ' + _vm.selectedTool(tool),attrs:{"disabled":tool.disabled,"data-tooltip":tool.tooltip,"aria-haspopup":"true","aria-controls":"dropdown-menu4"},on:{"click":function($event){_vm.selectTool(tool)}}},[_c('i',{class:tool.icon})])]),_vm._v(" "),_c('div',{staticClass:"dropdown-menu",attrs:{"id":"dropdown-menu4","role":"menu"}},[_c('div',{staticClass:"dropdown-content"},[_c('div',{staticClass:"dropdown-item"},[_vm._v("\n                "+_vm._s(tool.name)+"\n              ")])])])])])}),0)]),_vm._v(" "),_c('div',{staticStyle:{"margin-top":"50px"}},[(_vm.activeTool == 'menu')?_c('div',{},[_c('table',{staticClass:"table is-striped is-hoverable is-fullwidth is-narrow"},_vm._l((_vm.tools),function(tool,idx){return _c('tr',{key:idx,on:{"click":function($event){_vm.selectTool(tool)}}},[_c('td',{staticClass:"menutd"},[_c('button',{class:'menuListBtn button is-small ' + _vm.selectedTool(tool),attrs:{"disabled":tool.disabled,"data-tooltip":tool.tooltip}},[_c('i',{class:tool.icon})])]),_vm._v(" "),_c('td',{staticClass:"menutd"},[_c('txt',{attrs:{"tid":tool.tooltip}})],1)])}),0)]):_vm._e(),_vm._v(" "),(_vm.activeTool == 'test' && _vm.activeProject.statusImg)?_c('div',{},[_c('sidebarMeasuredValues',{attrs:{"targets":_vm.targets}}),_vm._v(" "),_c('br'),_vm._v(" "),(_vm.params.record)?_c('table',{staticClass:"table is-striped is-hoverable is-fullwidth is-narrow"},[_c('tr',[_c('td',[_c('txt',{attrs:{"tid":"Time"}})],1),_c('td',[_vm._v(_vm._s(_vm.params.record.date.split('T')[1]))])]),_vm._v(" "),_c('tr',[_c('td',[_c('txt',{attrs:{"tid":"Part"}})],1),_c('td',[_vm._v(_vm._s(_vm.params.record.part))])]),_vm._v(" "),_c('tr',[_c('td',[_c('txt',{attrs:{"tid":"Order"}})],1),_c('td',[_vm._v(_vm._s(_vm.params.record.order))])]),_vm._v(" "),_c('tr',[_c('td',[_c('txt',{attrs:{"tid":"Machine"}})],1),_c('td',[_vm._v(_vm._s(_vm.params.record.machine))])])]):_vm._e(),_vm._v(" "),(_vm.activeProject.statusType == 'gif')?_c('span',[_c('img',{attrs:{"width":"200","height":"200","src":'/static/gif/' +  _vm.activeProject.statusImg[_vm.gifStatus]}})]):_vm._e(),_vm._v(" "),(_vm.activeProject.statusType == 'svg')?_c('span',[_c('svg',{attrs:{"height":"70","width":"70"}},[_c('circle',{attrs:{"cx":"35","cy":"35","r":"30","stroke":"steelblue","stroke-width":"3","fill":[_vm.gifStatus ? 'red' : 'darkslategrey']}})])]):_vm._e()],1):_vm._e(),_vm._v(" "),(_vm.activeTool == 'color')?_c('colorPicker',{attrs:{"activePlugin":_vm.activePlugin,"pluginConfig":_vm.pluginConfig}}):_vm._e(),_vm._v(" "),(_vm.activeTool == 'crop2reference')?_c('crop2Reference',{attrs:{"activePlugin":_vm.activePlugin,"pluginConfig":_vm.pluginConfig}}):_vm._e(),_vm._v(" "),(_vm.activeTool == 'crop')?_c('rectPicker',{attrs:{"activePlugin":_vm.activePlugin,"pluginConfig":_vm.pluginConfig}}):_vm._e(),_vm._v(" "),(_vm.activeTool == 'roi')?_c('roiPicker',{attrs:{"activePlugin":_vm.activePlugin,"pluginConfig":_vm.pluginConfig,"activePart":_vm.activePart,"targets":_vm.targets}}):_vm._e(),_vm._v(" "),(_vm.activeTool == 'image')?_c('imgPicker',{attrs:{"activePlugin":_vm.activePlugin,"activeProject":_vm.activeProject,"pluginConfig":_vm.pluginConfig}}):_vm._e(),_vm._v(" "),(_vm.activeTool == 'measure')?_c('measure',{attrs:{"activePlugin":_vm.activePlugin,"activeProject":_vm.activeProject,"pluginConfig":_vm.pluginConfig,"targets":_vm.targets,"activePart":_vm.activePart}}):_vm._e()],1)])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "XeD6":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "XgqT":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarMeasuredValues_vue__ = __webpack_require__("s6EE");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_354ba908_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sidebarMeasuredValues_vue__ = __webpack_require__("Hgxd");
function injectStyle (ssrContext) {
  __webpack_require__("3D7z")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarMeasuredValues_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_354ba908_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sidebarMeasuredValues_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "Xzzh":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_bus__ = __webpack_require__("qKYu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_axios__);
//
//
//
//
//
//
//
//
//
//
//
//

/* eslint-disable */



/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'progressBar',
  props: ['activeProject', 'activePlugin', 'pluginConfig'],
  data: function data() {
    return {
      maxPlugins: 20,
      startTimes: [],
      cycleTimes: [],
      totalCycleTime: 0
    };
  },

  methods: {
    activatePlugin: function activatePlugin(name) {
      activePlugin = name;
      __WEBPACK_IMPORTED_MODULE_1_axios___default.a.get('/api/v1/' + activePlugin + '/getConfig').then(function (response) {
        // console.log(response.data)
        pluginConfig = response.data;
      }).catch(function (error) {
        console.log(error);
      });
    }
  },
  mounted: function mounted() {
    for (var i = 0; i < this.maxPlugins; i++) {
      this.startTimes[i] = 0;
      this.cycleTimes[i] = 0;
    }
    var self = this;
    __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$on('pluginStatusUpdate', function (pin, status) {
      console.log(pin, status);
      var e = document.getElementById('listElement_' + pin);
      if (status == '$Start') {
        for (var i = 0; i < self.activeProject.plugins.length; i++) {
          console.log(self.activeProject.plugins[i].name, pin);
          if (self.activeProject.plugins[i].name == pin) {
            self.startTimes[i] = Date.now();
            break;
          }
        }
        e.classList.add('active');
      }
      if (status == '$Finished') {
        self.totalCycleTime = 0;
        for (var i = 0; i < self.activeProject.plugins.length; i++) {
          if (self.activeProject.plugins[i].name == pin) {
            self.$set(self.cycleTimes, i, Date.now() - self.startTimes[i]);
          }
          self.totalCycleTime += self.cycleTimes[i];
        }
        setTimeout(function () {
          e.classList.remove('active');
        }, 250);
      }
    });
  }
});

/***/ }),

/***/ "YaEn":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__("/5sW");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router__ = __webpack_require__("/ocq");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_logViewer__ = __webpack_require__("783K");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_roboCTL__ = __webpack_require__("c6mB");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_aiCore_listParts__ = __webpack_require__("b0rI");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_aiCore_listOrders__ = __webpack_require__("1jdU");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_aiCore_listTargets__ = __webpack_require__("lqTo");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_aiCore_systemConfiguration__ = __webpack_require__("SFaL");






// import pluginViewer from '@/components/aiCore/pluginViewer'

// import listParts2 from '@/components/aiCore/listParts2'

// import listOrders2 from '@/components/aiCore/listOrders2'



// import modeEdit from '@/components/modeEdit'
// import modeRuntime from '@/components/modeRuntime'

__WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].use(__WEBPACK_IMPORTED_MODULE_1_vue_router__["a" /* default */]);
/* harmony default export */ __webpack_exports__["a"] = (new __WEBPACK_IMPORTED_MODULE_1_vue_router__["a" /* default */]({
  routes: [
  // { props: true, path: '/', component: pluginViewer },
  { props: true, path: '/parts', component: __WEBPACK_IMPORTED_MODULE_4__components_aiCore_listParts__["a" /* default */] },
  // { props: true, path: '/parts2', component: listParts2 },
  { props: true, path: '/orders', component: __WEBPACK_IMPORTED_MODULE_5__components_aiCore_listOrders__["a" /* default */] },
  // { props: true, path: '/orders2', component: listOrders2 },
  { props: true, path: '/targets', component: __WEBPACK_IMPORTED_MODULE_6__components_aiCore_listTargets__["a" /* default */] }, { props: true, path: '/configuration', component: __WEBPACK_IMPORTED_MODULE_7__components_aiCore_systemConfiguration__["a" /* default */] }, { props: true, path: '/logs', component: __WEBPACK_IMPORTED_MODULE_2__components_logViewer__["a" /* default */] }, { props: true, path: '/roboCTL', component: __WEBPACK_IMPORTED_MODULE_3__components_roboCTL__["a" /* default */]
    // { props: true, path: '/plugins', component: pluginViewer }
    // { props: true, path: '/modeedit', component: modeEdit },
    // { props: true, path: '/moderuntime', component: modeRuntime }
  }]
  // mode: 'history'
}));

/***/ }),

/***/ "Ytr3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c("div")}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "Zq7H":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('br'),_vm._v(" "),_c('h3',[_vm._v("Robot Control")]),_vm._v(" "),_c('hr'),_vm._v(" "),_c('div',{attrs:{"id":"tables"}},[_c('div',{staticClass:"columns"},[_c('div',{staticClass:"column is-4 is-offset-2"},[_c('roboCTLPositionTable',{attrs:{"status":_vm.status}})],1),_vm._v(" "),_c('div',{staticClass:"column is-4"},[_c('roboCTLStatusTable',{attrs:{"status":_vm.status}})],1)])]),_vm._v(" "),_c('hr')])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "a0nk":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_bus__ = __webpack_require__("qKYu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_aiCore_toolMixin__ = __webpack_require__("lQcu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_txt__ = __webpack_require__("pKHy");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'toolCrop2Reference',
  mixins: [__WEBPACK_IMPORTED_MODULE_2__components_aiCore_toolMixin__["a" /* default */]],
  props: ['activePlugin', 'pluginConfig'],
  components: {
    txt: __WEBPACK_IMPORTED_MODULE_3__components_txt__["a" /* default */]
  },
  data: function data() {
    return {
      swgId: 1,
      dragFlag: false,
      dragStart: { x: 0, y: 0 },
      dragPos: { x: 0, y: 0 },
      mode: 0,
      refName: ''
    };
  },

  methods: {
    mouseEvent: function mouseEvent(clkInfo) {
      this.scale = clkInfo.xDiv / clkInfo.trueX;
      if (clkInfo.state === 'mouseup' && this.mode === 0) {
        this.points.push({ 'x': clkInfo.x, 'y': clkInfo.y });
        // this.saveRect()
      }
      // console.log(clkInfo.id)
      if (clkInfo.state === 'mousedown') {
        if (clkInfo.id === '$BG') {
          this.mode = 0;
          this.points = [];
          this.points.push({ 'x': clkInfo.x, 'y': clkInfo.y });
          this.removeRect();
          this.insertRect(clkInfo.x, clkInfo.y, 0, 0);
        } else {
          this.mode = 1;
          this.dragElement(clkInfo);
        }
      }
      if (clkInfo.state === 'mousemove') {
        if (this.mode === 0) {
          this.adjustRect({ 'x': clkInfo.x, 'y': clkInfo.y });
        } else {
          this.dragElement(clkInfo);
        }
      }
    },
    dragElement: function dragElement(clkInfo) {
      var target = document.getElementById('ROI_' + this.svgId);
      if (target !== null) {
        var xo = target.getAttribute('x');
        var yo = target.getAttribute('y');
        // console.log(xo, yo)
        if (!this.dragFlag) {
          this.dragStart.x = clkInfo.x;
          this.dragStart.y = clkInfo.y;
          this.dragFlag = true;
        }
        this.dragPos.x = clkInfo.x;
        this.dragPos.y = clkInfo.y;
        var x = (this.dragPos.x - this.dragStart.x) * this.scale;
        var y = (this.dragPos.y - this.dragStart.y) * this.scale;
        // console.log(x, y)
        target.setAttribute('x', parseFloat(xo) + parseFloat(x));
        target.setAttribute('y', parseFloat(yo) + parseFloat(y));
        target.setAttribute('stroke', 'red');
        this.dragStart.x = clkInfo.x;
        this.dragStart.y = clkInfo.y;
      }
    },
    removeRect: function removeRect() {
      var target = document.getElementById('ROI_' + this.svgId);
      if (target !== null) {
        target.remove();
      }
    },
    insertRect: function insertRect(x, y, w, h) {
      this.rect(this.svgId, x * this.scale, y * this.scale, w * this.scale, h * this.scale, 'yellow');
    },
    adjustRect: function adjustRect(pos) {
      var s = this.scale;
      var target = document.getElementById('ROI_' + this.svgId);
      console.log(s);
      if (pos.x > this.points[0].x) {
        target.setAttribute('width', (pos.x - this.points[0].x) * s);
      } else {
        target.setAttribute('x', pos.x * s);
        target.setAttribute('width', (this.points[0].x - pos.x) * s);
      }
      if (pos.y > this.points[0].y) {
        target.setAttribute('height', (pos.y - this.points[0].y) * s);
      } else {
        target.setAttribute('y', pos.y * s);
        target.setAttribute('height', (this.points[0].y - pos.y) * s);
      }
    },
    resetMask: function resetMask() {
      this.removeRect();
    },
    saveRect: function saveRect() {
      var target = document.getElementById('ROI_' + this.svgId);
      var x = parseFloat(target.getAttribute('x')) / this.scale;
      var y = parseFloat(target.getAttribute('y')) / this.scale;
      var w = parseFloat(target.getAttribute('width')) / this.scale;
      var h = parseFloat(target.getAttribute('height')) / this.scale;
      var data = { x: x, y: y, w: w, h: h };

      __WEBPACK_IMPORTED_MODULE_0_axios___default.a.post('/api/v1/' + this.activePlugin + '/saveReferenceImage?filename=' + this.refName, data).then(function (response) {
        console.log(response);
      }).catch(function (error) {
        console.log(error);
      });
    },
    test: function test() {
      /* axios.post('/api/v1/' + this.activePlugin + '/start', {})
        .then(response => {
          console.log(response)
          this.clearCanvas()
        })
        .catch(error => { console.log(error) }) */
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.svgId = 1;
    __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$on('mouseEvent', function (clkInfo) {
      _this.mouseEvent(clkInfo);
    });
  },
  beforeDestroy: function beforeDestroy() {
    __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$off('mouseEvent');
  }
});

/***/ }),

/***/ "aUuj":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "b0rI":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_listParts_vue__ = __webpack_require__("uYVK");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_292e68fe_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_listParts_vue__ = __webpack_require__("MraH");
function injectStyle (ssrContext) {
  __webpack_require__("tXZ1")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_listParts_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_292e68fe_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_listParts_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "c6mB":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_roboCTL_vue__ = __webpack_require__("CUfs");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_108491be_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_roboCTL_vue__ = __webpack_require__("Zq7H");
function injectStyle (ssrContext) {
  __webpack_require__("/dDi")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-108491be"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_roboCTL_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_108491be_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_roboCTL_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "cFne":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_roboCTLPositionTable_vue__ = __webpack_require__("EmVM");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_522af794_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_roboCTLPositionTable_vue__ = __webpack_require__("ny/v");
function injectStyle (ssrContext) {
  __webpack_require__("xvPl")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-522af794"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_roboCTLPositionTable_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_522af794_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_roboCTLPositionTable_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "d0i4":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_bus__ = __webpack_require__("qKYu");
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'toolMixin',
  data: function data() {
    return {
      points: [],
      scale: 1,
      swidth: 1,
      arcs: []
    };
  },

  methods: {
    getPerpendicularPointAndDistance: function getPerpendicularPointAndDistance(p0, p1, p2) {
      var m = 10000;
      if (Math.abs(p0.x - p1.x) > 0.00001) {
        m = (p0.y - p1.y) / (p0.x - p1.x);
      }
      var c = p1.y - m * p1.x;
      var d = Math.abs(c + m * p2.x - p2.y) / Math.sqrt(1 + m * m);
      // calculate P4 as intersection line P1-P2 and point P3
      var x = (p2.x + m * p2.y - m * c) / (Math.pow(m, 2) + 1);
      var y = c + m * (p2.x + m * p2.y - m * c) / (Math.pow(m, 2) + 1);
      return { x: x, y: y, d: d };
    },
    getAngle: function getAngle(p1, p2) {
      var dx = p2.x - p1.x;
      var dy = p2.y - p1.y;
      var inRads = Math.atan2(dy, dx);

      // We need to map to coord system when 0 degree is at 3 O'clock, 270 at 12 O'clock
      if (inRads < 0) {
        inRads = Math.abs(inRads);
      } else {
        inRads = 2 * Math.PI - inRads;
      }
      return inRads;
    },
    getAngle2: function getAngle2(p1, p2) {
      var dx = p2.x - p1.x;
      var dy = p2.y - p1.y;
      return Math.atan2(dy, dx);
    },
    getDistance: function getDistance(p1, p2) {
      var dx = p2.x - p1.x;
      var dy = p2.y - p1.y;
      return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    },
    line: function line(idStr, p1x, p1y, p2x, p2y, col) {
      var width = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1;

      var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      newLine.setAttribute('id', idStr);
      newLine.setAttribute('x1', p1x);
      newLine.setAttribute('y1', p1y);
      newLine.setAttribute('x2', p2x);
      newLine.setAttribute('y2', p2y);
      newLine.setAttribute('stroke', col);
      newLine.setAttribute('stroke-width', width);
      newLine.setAttribute('stroke-linecap', 'round');
      document.getElementById('frameInOut').append(newLine);
    },
    rect: function rect(id, px, py, w, h, col) {
      var angle = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;

      var newRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      var idStr = 'ROI_' + id;
      newRect.setAttribute('id', idStr);
      newRect.setAttribute('x', px);
      newRect.setAttribute('y', py);
      newRect.setAttribute('height', h);
      newRect.setAttribute('width', w);
      newRect.setAttribute('stroke', col);
      newRect.setAttribute('fill-opacity', '0.0');
      newRect.setAttribute('transform-box', 'fill-box');
      newRect.setAttribute('transform-origin', 'center');
      newRect.setAttribute('transform', 'rotate(' + angle * 180 / Math.PI + ' 0 0)');
      document.getElementById('frameInOut').append(newRect);
    },
    squareEnd: function squareEnd(idStr, px, py, w, h, col) {
      var angle = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;

      var newRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      newRect.setAttribute('id', idStr);
      newRect.setAttribute('x', px);
      newRect.setAttribute('y', py);
      newRect.setAttribute('height', h);
      newRect.setAttribute('width', w);
      newRect.setAttribute('stroke', col);
      newRect.setAttribute('fill-opacity', '0.0');
      newRect.setAttribute('transform-box', 'fill-box');
      newRect.setAttribute('transform-origin', 'center');
      newRect.setAttribute('transform', 'rotate(' + angle * 180 / Math.PI + ' 0 0)');
      document.getElementById('frameInOut').append(newRect);
    },
    arc: function arc(idStr, px, py, radius, col) {
      var width = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;

      var newCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      newCircle.setAttribute('id', idStr);
      newCircle.setAttribute('class', 'roiDragpoint');
      newCircle.setAttribute('cx', px);
      newCircle.setAttribute('cy', py);
      newCircle.setAttribute('r', radius);
      newCircle.setAttribute('stroke', col);
      newCircle.setAttribute('fill-opacity', '0.0');
      newCircle.setAttribute('stroke-width', width);
      document.getElementById('frameInOut').append(newCircle);
    },
    circlePath: function circlePath(idStr, px, py, radius, col) {
      var width = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
      var start = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
      var finish = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 360;
      var step = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 5;
      var segment = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : false;

      var newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      newPath.setAttribute('id', idStr);
      newPath.setAttribute('class', 'Circle');
      newPath.setAttribute('cx', px);
      newPath.setAttribute('cy', py);
      var x = px + radius * Math.cos(start * Math.PI / 180.0);
      var y = py + radius * Math.sin(start * Math.PI / 180.0);
      var i = start + step;
      if (segment === true) {
        x = px;
        y = py;
        i = start;
      }
      var pathStr = 'M' + x + ' ' + y + ' '; // 150,0 L150,100 200,300 Z'
      for (; i <= finish; i += step) {
        x = px + radius * Math.cos(i * Math.PI / 180.0);
        y = py + radius * Math.sin(i * Math.PI / 180.0);
        pathStr += 'L ' + x + ' ' + y + ' ';
      }
      if (segment === true) {
        pathStr += 'z';
      }
      newPath.setAttribute('d', pathStr);
      newPath.setAttribute('stroke', col);
      newPath.setAttribute('fill', 'none');
      newPath.setAttribute('stroke-width', width);
      document.getElementById('frameInOut').append(newPath);
    },
    clearCanvas: function clearCanvas() {
      __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$emit('reLoadImage');
    }
  }
});

/***/ }),

/***/ "dBFg":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'roboCTLStatusTable',
  props: ['status'],
  components: {},
  data: function data() {
    return {};
  },

  methods: {},
  mounted: function mounted() {}
});

/***/ }),

/***/ "fvdz":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_toolCrop2Reference_vue__ = __webpack_require__("a0nk");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_df0d83d4_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_toolCrop2Reference_vue__ = __webpack_require__("WGDN");
function injectStyle (ssrContext) {
  __webpack_require__("aUuj")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-df0d83d4"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_toolCrop2Reference_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_df0d83d4_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_toolCrop2Reference_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "gUCl":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "hLUG":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "hxIZ":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(_vm.notification != '')?_c('div',{attrs:{"id":"notificationDivWrapper"}},[_c('div',{staticClass:"notification is-danger"},[_c('button',{staticClass:"delete",on:{"click":function($event){_vm.notification = ''}}}),_vm._v(" "),_c('span',{attrs:{"id":"notificationDiv"}},[_vm._v(_vm._s(_vm.notification))])])]):_vm._e(),_vm._v(" "),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.information != ''),expression:"information != ''"}],attrs:{"id":"informationDivWrapper"}},[_c('div',{staticClass:"notification is-warning"},[_c('button',{staticClass:"delete",on:{"click":function($event){_vm.information = ''}}}),_vm._v(" "),_c('span',{attrs:{"id":"informationDiv"}},[_vm._v(_vm._s(_vm.information))])])])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "lQcu":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_toolMixin_vue__ = __webpack_require__("d0i4");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0c04a3c4_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_toolMixin_vue__ = __webpack_require__("Ytr3");
function injectStyle (ssrContext) {
  __webpack_require__("hLUG")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-0c04a3c4"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_toolMixin_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0c04a3c4_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_toolMixin_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "lRdT":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_bus__ = __webpack_require__("qKYu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_aiCore_toolColorPicker__ = __webpack_require__("wVE5");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_aiCore_toolCrop2Reference__ = __webpack_require__("fvdz");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_aiCore_toolRectPicker__ = __webpack_require__("C2SN");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_aiCore_toolRoiPicker__ = __webpack_require__("n0DR");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_aiCore_toolTestButtons__ = __webpack_require__("np19");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_aiCore_toolImgPicker__ = __webpack_require__("QfNX");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_aiCore_toolMeasure__ = __webpack_require__("mPuy");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_aiCore_sidebarMeasuredValues__ = __webpack_require__("XgqT");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_aiCore_toolLines__ = __webpack_require__("6ryT");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_txt__ = __webpack_require__("pKHy");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//














/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'toolbox',
  components: {
    colorPicker: __WEBPACK_IMPORTED_MODULE_2__components_aiCore_toolColorPicker__["a" /* default */],
    rectPicker: __WEBPACK_IMPORTED_MODULE_4__components_aiCore_toolRectPicker__["a" /* default */],
    crop2Reference: __WEBPACK_IMPORTED_MODULE_3__components_aiCore_toolCrop2Reference__["a" /* default */],
    roiPicker: __WEBPACK_IMPORTED_MODULE_5__components_aiCore_toolRoiPicker__["a" /* default */],
    testButtons: __WEBPACK_IMPORTED_MODULE_6__components_aiCore_toolTestButtons__["a" /* default */],
    imgPicker: __WEBPACK_IMPORTED_MODULE_7__components_aiCore_toolImgPicker__["a" /* default */],
    measure: __WEBPACK_IMPORTED_MODULE_8__components_aiCore_toolMeasure__["a" /* default */],
    lines: __WEBPACK_IMPORTED_MODULE_10__components_aiCore_toolLines__["a" /* default */],
    sidebarMeasuredValues: __WEBPACK_IMPORTED_MODULE_9__components_aiCore_sidebarMeasuredValues__["a" /* default */],
    txt: __WEBPACK_IMPORTED_MODULE_11__components_txt__["a" /* default */]
  },
  props: ['activePlugin', 'pluginConfig', 'activeProject', 'activePart', 'targets'],
  data: function data() {
    return {
      activeTool: 'test',
      statusList: ['', 'is-danger'],
      tools: [
      // {name: 'menu', disabled: false, tooltip: 'ToolMenu', icon: 'fas fa-question', selected: false},
      { name: 'image', disabled: false, tooltip: 'Selectimage', icon: 'fas fa-image', selected: false }, { name: 'refresh', disabled: false, tooltip: 'Reloadimage', icon: 'fas fa-redo', selected: false }, { name: 'crop', disabled: false, tooltip: 'Cropimage', icon: 'fas fa-crop-alt', selected: false }, { name: 'crop2reference', disabled: false, tooltip: 'ReferenceImage', icon: 'fas fa-layer-group', selected: false }, { name: 'color', disabled: false, tooltip: 'Colorpicker', icon: 'fas fa-eye-dropper', selected: false }, { name: 'roi', disabled: false, tooltip: 'Editregionofinterest(ROI)', icon: 'fas fa-list', selected: false },
      // {name: 'circles', disabled: false, tooltip: 'Find circles', icon: 'far fa-circle', selected: false},
      // {name: 'lines', disabled: false, tooltip: 'Find lines', icon: 'fas fa-minus', selected: false},
      { name: 'measure', disabled: false, tooltip: 'Editmeasurements', icon: 'fas fa-ruler', selected: false },
      // {name: 'parts', disabled: false, tooltip: 'Listinspectionplans', icon: 'fas fa-list-ol', selected: false},
      // {name: 'orders', disabled: false, tooltip: 'Listinspectionorders', icon: 'fas fa-list', selected: false},
      { name: 'test', disabled: false, tooltip: 'Startdetectionsequence', icon: 'fas fa-bolt', selected: false }],
      toolRequired: {
        'Default': ['color', 'measure', 'test', 'plan', 'orders'],
        'Mask': ['crop'],
        'Noise': ['roi'],
        'TemplateMatch': ['roi']
      },
      gifStatus: 0,
      params: {}
    };
  },

  watch: {
    activePlugin: function activePlugin(p) {
      if (this.toolRequired[this.activePlugin] !== undefined) {
        for (var i = 0; i < this.tools.length; i++) {
          this.tools[i].disabled = false;
          /* this.tools[i].disabled = true
          if (this.toolRequired[this.activePlugin].indexOf(this.tools[i].name) >= 0) {
            this.tools[i].disabled = false
          } else {
            if (this.toolRequired['Default'].indexOf(this.tools[i].name) >= 0) {
              this.tools[i].disabled = false
            }
          } */
        }
      }
    }
  },
  methods: {
    selectTool: function selectTool(tool) {
      for (var i = 0; i < this.tools.length; i++) {
        if (tool.name === this.tools[i].name) {
          this.tools[i].selected = true;
          this.activeTool = this.tools[i].name;
        } else {
          this.tools[i].selected = false;
        }
      }
      if (this.activeTool === 'test') {
        this.sendCmd('CMD=detect');
      }
      if (this.activeTool === 'refresh') {
        document.location.reload();
      }
      if (this.activeTool === 'parts') {
        this.$router.push('/parts');
      }
      if (this.activeTool === 'orders') {
        this.$router.push('/orders');
      }
    },
    selectedTool: function selectedTool(tool) {
      if (tool.name === this.activeTool) {
        return 'is-warning';
      } else {
        return 'is-link';
      }
    },
    sendCmd: function sendCmd(cmd) {
      __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('/api/v1/Project/sendCmd?' + cmd).then(function (response) {
        __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$emit('measuredValues', response);
      }).catch(function (error) {
        console.log(error);
      });
    },
    updateToolboxParams: function updateToolboxParams(myparams) {
      // console.log(status)
      this.params = myparams;
      this.$set(this, 'gifStatus', myparams.status);
      this.$set(this.params, 'record', myparams.record);
    }
  },
  mounted: function mounted() {
    this.tools[0].selected = true;
    __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$on('statusUpdate', this.updateToolboxParams);
  },
  beforeDestroy: function beforeDestroy() {
    __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$off('statusUpdate', this.updateToolboxParams);
  }
});

/***/ }),

/***/ "lYA7":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "lppd":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "lqTo":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_listTargets_vue__ = __webpack_require__("GCDk");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5db0611d_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_listTargets_vue__ = __webpack_require__("x8dW");
function injectStyle (ssrContext) {
  __webpack_require__("+htq")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_listTargets_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5db0611d_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_listTargets_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "m1jH":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"containerProgressBar"},[(_vm.activeProject)?_c('table',{staticClass:"table is-narrow progressbar"},[_vm._l((_vm.activeProject.plugins),function(plugins,index){return _c('tr',{key:index,staticClass:"listItem",attrs:{"id":'listElement_' + plugins.name}},[_c('td',[_c('router-link',{attrs:{"to":"/plugins"}},[_c('button',{class:{ isActive: _vm.activePlugin == plugins.name },attrs:{"id":plugins.name + 'button'},on:{"click":function($event){_vm.activatePlugin(plugins.name)}}},[_vm._v(_vm._s(plugins.name))])])],1),_vm._v(" "),_c('td',{staticClass:"milliseconds"},[_vm._v(_vm._s(_vm.cycleTimes[index])+" ms")])])}),_vm._v(" "),_c('tr',[_c('td',[_vm._v("Total")]),_c('td',{staticClass:"milliseconds"},[_vm._v(_vm._s(_vm.totalCycleTime)+" ms")])]),_vm._v(" "),_c('tr',[_c('td',[_vm._v(_vm._s(_vm.activePlugin))])])],2):_vm._e()])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "mJOr":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_vm._m(0),_vm._v(" "),_c('br'),_vm._v(" "),_c('button',{staticClass:"button is-light",on:{"click":function($event){_vm.readLog(-1)}}}),_vm._v(" "),_c('button',{staticClass:"button is-light",on:{"click":function($event){_vm.readLog(1)}}},[_vm._v(">")])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('table',{staticClass:"table",attrs:{"id":"logtarget"}})])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "mPuy":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_toolMeasure_vue__ = __webpack_require__("qM37");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_e5ea6850_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_toolMeasure_vue__ = __webpack_require__("T0T0");
function injectStyle (ssrContext) {
  __webpack_require__("V/v+")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-e5ea6850"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_toolMeasure_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_e5ea6850_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_toolMeasure_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "n0DR":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_toolRoiPicker_vue__ = __webpack_require__("1Q23");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_334f2355_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_toolRoiPicker_vue__ = __webpack_require__("62+T");
function injectStyle (ssrContext) {
  __webpack_require__("77YD")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-334f2355"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_toolRoiPicker_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_334f2355_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_toolRoiPicker_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "nBZ5":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_chartContainer_vue__ = __webpack_require__("+Ig7");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7fdd28ad_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_chartContainer_vue__ = __webpack_require__("scu1");
function injectStyle (ssrContext) {
  __webpack_require__("COCN")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_chartContainer_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7fdd28ad_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_chartContainer_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "np19":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_toolTestButtons_vue__ = __webpack_require__("/2h+");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5549c138_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_toolTestButtons_vue__ = __webpack_require__("ULMo");
function injectStyle (ssrContext) {
  __webpack_require__("Gz8X")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-5549c138"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_toolTestButtons_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5549c138_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_toolTestButtons_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "ny/v":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{attrs:{"id":"tables"}},[_c('div',{attrs:{"id":"axisValues"}},[(_vm.status)?_c('table',{staticClass:"table is-fullwidth is-narrow"},[_vm._m(0),_vm._v(" "),_c('tr',[_c('td',[_vm._v("X")]),_vm._v(" "),_c('td',[_vm._v(_vm._s(_vm.status.x.toFixed(3)))])]),_vm._v(" "),_c('tr',[_c('td',[_vm._v("Y")]),_vm._v(" "),_c('td',[_vm._v(_vm._s(_vm.status.y.toFixed(3)))])]),_vm._v(" "),_c('tr',[_c('td',[_vm._v("Z")]),_vm._v(" "),_c('td',[_vm._v(_vm._s(_vm.status.z.toFixed(3)))])]),_vm._v(" "),_c('tr',[_c('td',[_vm._v("A")]),_vm._v(" "),_c('td',[_vm._v(_vm._s(_vm.status.a.toFixed(3)))])]),_vm._v(" "),_c('tr',[_c('td',[_vm._v("B")]),_vm._v(" "),_c('td',[_vm._v(_vm._s(_vm.status.b.toFixed(3)))])]),_vm._v(" "),_c('tr',[_c('td',[_vm._v("C")]),_vm._v(" "),_c('td',[_vm._v(_vm._s(_vm.status.c.toFixed(3)))])])]):_vm._e()])])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('tr',[_c('th',[_vm._v("Axis")]),_vm._v(" "),_c('th',[_vm._v("Position")])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "otSL":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{},[_c('div',{staticClass:"tile is-horizontal"},[_c('table',[_c('tr',[_vm._m(0),_vm._v(" "),_c('td',{attrs:{"colspan":"2"}},[_c('txt',{attrs:{"tid":"resetMask"}})],1),_vm._v(" "),_c('td',[_c('button',{staticClass:"button is-warning",on:{"click":function($event){_vm.resetMask(); _vm.points=[]}}},[_c('i',{staticClass:"fas fa-undo"})])])]),_vm._v(" "),_c('tr',[_vm._m(1),_vm._v(" "),_c('td',[_c('txt',{attrs:{"tid":"cropImage"}})],1),_vm._v(" "),_c('td',{staticClass:"progtd"},[_c('progress',{staticClass:"progress is-success",attrs:{"max":"2"},domProps:{"value":_vm.points.length}})]),_vm._v(" "),_c('td',[_c('button',{staticClass:"button ",class:_vm.points.length > 1 ? 'is-success' : 'is-outlined'},[_c('i',{staticClass:"fas fa-check"})])])]),_vm._v(" "),_c('tr',[_vm._m(2),_vm._v(" "),_c('td',{attrs:{"colspan":"2"}},[_c('txt',{attrs:{"tid":"saveRoi"}})],1),_vm._v(" "),_c('td',[_c('button',{staticClass:"button is-link",attrs:{"disabled":_vm.points.length!=2},on:{"click":function($event){_vm.saveRect()}}},[_c('i',{staticClass:"fas fa-save"})])])]),_vm._v(" "),_c('tr',[_vm._m(3),_vm._v(" "),_c('td',{attrs:{"colspan":"2"}},[_c('txt',{attrs:{"tid":"testNewRoi"}})],1),_vm._v(" "),_c('td',[_c('button',{staticClass:"button is-link",on:{"click":function($event){_vm.test()}}},[_c('i',{staticClass:"fas fa-bolt"})])])])])])])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('td',[_c('a',{staticClass:"button is-link is-small is-rounded"},[_vm._v("1")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('td',[_c('a',{staticClass:"button is-link is-small is-rounded"},[_vm._v("2")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('td',[_c('a',{staticClass:"button is-link is-small is-rounded"},[_vm._v("3")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('td',[_c('a',{staticClass:"button is-link is-small is-rounded"},[_vm._v("4")])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "pKHy":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_txt_vue__ = __webpack_require__("xkyD");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_52f2da18_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_txt_vue__ = __webpack_require__("vXXT");
function injectStyle (ssrContext) {
  __webpack_require__("56fm")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-52f2da18"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_txt_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_52f2da18_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_txt_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "qKYu":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__("/5sW");


// global event bus
// fix `Uncaught TypeError: this.$dispatch is not a function`
// http://rc.vuejs.org/guide/migration.html#dispatch-and-broadcast-deprecated
/* harmony default export */ __webpack_exports__["a"] = (new __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */]());

/***/ }),

/***/ "qM37":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__("mvHQ");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_toConsumableArray__ = __webpack_require__("Gu7T");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_toConsumableArray___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_toConsumableArray__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_bus__ = __webpack_require__("qKYu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_aiCore_toolMixin__ = __webpack_require__("lQcu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_txt__ = __webpack_require__("pKHy");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_aiCore_sidebarMeasuredValues__ = __webpack_require__("XgqT");


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'toolMeasure',
  mixins: [__WEBPACK_IMPORTED_MODULE_3__components_aiCore_toolMixin__["a" /* default */]],
  props: ['activePlugin', 'pluginConfig', 'targets', 'activePart'],
  components: {
    txt: __WEBPACK_IMPORTED_MODULE_4__components_txt__["a" /* default */],
    sidebarMeasuredValues: __WEBPACK_IMPORTED_MODULE_6__components_aiCore_sidebarMeasuredValues__["a" /* default */]
  },
  data: function data() {
    return {
      editMeasurementNames: false,
      measurementSaved: false,
      measureProgress: 0,
      n: 0,
      requiredPoints: 0,
      measureDisplay: 0,
      isShowModal: false,
      scale: 1,
      activeTool: 'P2P',
      moiId: 0,
      moiIdSelected: 0,
      path: '',
      idStr: '',
      points: [],
      moi: [],
      message: '',
      tools: [{ name: 'P2P', pts: 2, disabled: false, tooltip: 'Punkt zu Punkt', selected: false, cursor: '' }, { name: 'L2P', pts: 3, disabled: false, tooltip: 'Linie zu Punkt', selected: false, cursor: '' }, { name: 'L2L', pts: 4, disabled: false, tooltip: 'Linie zu Linie', selected: false, cursor: '' }, { name: 'LLP', pts: 4, disabled: false, tooltip: 'Schnittpunkt Linie/Punkt', selected: false, cursor: '' },
      // {name: 'RAD', pts: 1, disabled: false, tooltip: 'Radius', selected: false, cursor: ''},
      { name: 'C2P', pts: 2, disabled: false, tooltip: 'Kreismittelpunkt zu Punkt', selected: false, cursor: '' }, { name: 'C2L', pts: 3, disabled: false, tooltip: 'Kreismittelpunkt zu Linie', selected: false, cursor: '' }, { name: 'C2C', pts: 2, disabled: false, tooltip: 'Kreismittelpunkt zu Kreismittelpunkt', selected: false, cursor: '' }, { name: 'L2LM', pts: 4, disabled: false, tooltip: 'Mittellinie', selected: false, cursor: '' }, { name: 'RAD', pts: 2, disabled: false, tooltip: 'Radius', selected: false, cursor: '' }, { name: 'ANG', pts: 4, disabled: false, tooltip: 'Winkel', selected: false, cursor: '' }]
    };
  },

  methods: {
    setMeasureDisplay: function setMeasureDisplay(id) {
      this.measureDisplay = id;
    },
    insertMoi: function insertMoi(path) {
      this.moi.push({ id: this.moiId, type: this.activeTool, nickname: 'MOI.' + this.moiId, path: path });
      this.moiId++;
      this.points = [];
      this.idStr = '';
      this.path = '';
    },
    updateMoi: function updateMoi(moi) {
      var container = document.querySelector('#frameInOut');
      var matches = container.querySelectorAll('circle,line');
      matches.forEach(function (item) {
        if (moi.path.indexOf(item.id) < 0) {
          item.setAttribute('stroke', 'yellow');
          item.setAttribute('stroke-width', 1);
        }
      });
      matches.forEach(function (item) {
        if (moi.path.indexOf(item.id) >= 0) {
          item.setAttribute('stroke', 'aqua');
          item.setAttribute('stroke-width', 5);
        }
      });
    },
    deleteMoi: function deleteMoi(id) {
      for (var i = 0; i < this.moi.length; i++) {
        if (this.moi[i].id === id) {
          this.moi.splice(i, 1);
          this.reset('M.' + id);
          this.reset('MP.' + id);
          break;
        }
      }
      __WEBPACK_IMPORTED_MODULE_2__components_bus__["a" /* default */].$emit('infoMessage', 'Messung: M' + id + ' gelöscht');
    },
    selectMoi: function selectMoi(m) {
      for (var i = 0; i < this.moi.length; i++) {
        document.getElementById('moiList_' + this.moi[i].id).classList.remove('is-selected');
        if (this.moi[i].id === m.id) {
          document.getElementById('moiList_' + this.moi[i].id).classList.add('is-selected');
          this.highlightMoi(this.moi[i]);
        }
      }
    },
    highlightMoi: function highlightMoi(m) {
      console.log('highlightMoi');
      console.log(m);
      // for (var i = 0; i < this.moi.length; i++) {
      // this.updateMoi('M.' + this.moi[i].id, 'magenta')
      // this.updateMoi('MP.' + this.moi[i].id, 'magenta')
      // }
      this.updateMoi(m);
      // this.updateMoi('MP.' + m.id, 'lime')
    },
    selectMTool: function selectMTool(tool) {
      for (var i = 0; i < this.tools.length; i++) {
        if (tool.name === this.tools[i].name) {
          this.tools[i].selected = true;
          this.activeTool = this.tools[i].name;
        } else {
          this.tools[i].selected = false;
        }
      }
      this.measureDisplay = 1;
      this.requiredPoints = this.getNoOfPtsRequired(this.activeTool);
    },
    selectedMTool: function selectedMTool(tool) {
      if (tool.name === this.activeTool) {
        return 'is-link';
      } else {
        return '';
      }
    },
    buildName: function buildName(clkInfo) {
      var sep = '~';
      this.idStr = 'M.' + this.moiId + '.' + this.points.length + sep + this.activeTool;
      this.path += sep + clkInfo.id;
      return this.idStr + this.path;
    },
    mouseEvent: function mouseEvent(clkInfo) {
      var s = clkInfo.xDiv / clkInfo.trueX;
      if (clkInfo.state === 'mouseup' && clkInfo.id !== '$BG') {
        var _points;

        (_points = this.points).push.apply(_points, __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_toConsumableArray___default()(this.getPointsFromSVG(clkInfo.id)));
        console.log(this.points);
        var path = this.buildName(clkInfo);
        var ptsReq = this.getNoOfPtsRequired(this.activeTool);
        this.message = 'point ' + this.points.length + '/' + ptsReq + ' saved';
        if (ptsReq >= this.points.length && this.points.length >= 2) {
          this.calcAndDrawSvgPoints(s, path, this.moiId, this.points, ptsReq);
          if (ptsReq === this.points.length) {
            this.insertMoi(path);
            this.message = 'finished - select tool';
            this.measureProgress = 1;
            var self = this;
            setTimeout(function () {
              self.message = '';
            }, 2000);
          }
        }
      }
    },
    calcAndDrawSvgPoints: function calcAndDrawSvgPoints(s, path, moiId, points, ptsReq) {
      var col = 'yellow';
      var calc = path.split('~')[1];
      console.log(path);
      var m, a, b, c, d, x, y, x1, y1, x2, y2;
      if (points.length === 1) {
        // this.arc('MP.' + moiId + '.1', points[0].x * s, points[0].y * s, 6, col)
      }
      if (points.length === 2) {
        if (calc !== 'L2LM') {
          this.line(path, points[0].x * s, points[0].y * s, points[1].x * s, points[1].y * s, col);
          // this.arc('MP.' + moiId + '.2', points[1].x * s, points[1].y * s, 6, col)
        }
      }
      if (points.length === 3 && ptsReq === 3) {
        m = (points[0].y - points[1].y) / (points[0].x - points[1].x);
        c = points[1].y - m * points[1].x;
        // this.d3 = Math.abs(c + m * this.points[2].x - this.points[2].y) / (Math.sqrt(1 + m * m))
        // calculate P4 as intersection line P1-P2 and point P3
        x = (points[2].x + m * points[2].y - m * c) / (Math.pow(m, 2) + 1);
        y = c + m * (points[2].x + m * points[2].y - m * c) / (Math.pow(m, 2) + 1);
        this.arc('MP.' + moiId + '.4', x * s, y * s, 6, col);
        this.line(path, x * s, y * s, points[2].x * s, points[2].y * s, col);
      }
      if (points.length === 4 && calc === 'L2L') {
        this.line(path, points[0].x * s, points[0].y * s, points[1].x * s, points[1].y * s, col);
        this.line(path, points[2].x * s, points[2].y * s, points[3].x * s, points[3].y * s, col);
        x1 = (points[0].x + points[1].x) / 2;
        y1 = (points[0].y + points[1].y) / 2;
        x2 = (points[2].x + points[3].x) / 2;
        y2 = (points[2].y + points[3].y) / 2;
        this.arc('MP.' + moiId + '.5', x1 * s, y1 * s, 6, col);
        this.arc('MP.' + moiId + '.6', x2 * s, y2 * s, 6, col);
        this.line(path, x1 * s, y1 * s, x2 * s, y2 * s, col);
      }
      if (points.length === 4 && calc === 'L2LM') {
        // this.line(path, points[0].x * s, points[0].y * s, points[1].x * s, points[1].y * s, col)
        // this.line(path, points[2].x * s, points[2].y * s, points[3].x * s, points[3].y * s, col)
        x1 = (points[0].x + points[2].x) / 2;
        y1 = (points[0].y + points[2].y) / 2;
        x2 = (points[1].x + points[3].x) / 2;
        y2 = (points[1].y + points[3].y) / 2;
        this.arc('LP.' + (100 + parseInt(moiId)) + '.1', x1 * s, y1 * s, 2, col);
        this.arc('LP.' + (100 + parseInt(moiId)) + '.3', (x1 + x2) / 2 * s, (y1 + y2) / 2 * s, 4, col);
        this.arc('LP.' + (100 + parseInt(moiId)) + '.2', x2 * s, y2 * s, 2, col);
        this.line(path, x1 * s, y1 * s, x2 * s, y2 * s, col);
      }
      if (points.length === 4 && calc === 'LLP') {
        a = (points[0].y - points[1].y) / (points[0].x - points[1].x);
        b = (points[2].y - points[3].y) / (points[2].x - points[3].x);
        c = points[1].y - a * points[1].x;
        d = points[3].y - b * points[3].x;
        // calculate P4 as intersection line P1-P2 and line P3-P4
        x = (d - c) / (a - b);
        y = a * x + c;
        console.log(a, b, c, d, x, y);
        this.arc('MP.' + moiId + '.5', x * s, y * s, 6, col);
        this.line(path, x * s, y * s, points[0].x * s, points[0].y * s, col);
        this.line(path, x * s, y * s, points[3].x * s, points[3].y * s, col);
      }
      if (points.length === 4 && calc === 'ANG') {
        a = (points[0].y - points[1].y) / (points[0].x - points[1].x);
        b = (points[2].y - points[3].y) / (points[2].x - points[3].x);
        c = points[1].y - a * points[1].x;
        d = points[3].y - b * points[3].x;
        // calculate P4 as intersection line P1-P2 and line P3-P4
        x = (d - c) / (a - b);
        y = a * x + c;
        var ang1 = Math.atan(a) * 180.0 / Math.PI + 0.0;
        var ang2 = Math.atan(b) * 180.0 / Math.PI + 0.0;
        var step = 5;if (ang1 > ang2) {
          var tmp = ang1;ang1 = ang2;ang2 = tmp;
        }
        // if (ang1 < 0 || ang2 < 0) { ang1 += 360.0; ang2 += 360.0 }
        console.log('Calculate Angle ' + moiId + ' ' + ang1 + ' ' + ang2);
        console.log(a, b, c, d, x, y);
        this.circlePath('MP.' + moiId + '.5', x * s, y * s, 30, col, 1, ang1, ang2, step, true);
        this.line(path, x * s, y * s, points[0].x * s, points[0].y * s, col);
        this.line(path, x * s, y * s, points[3].x * s, points[3].y * s, col);
      }
    },
    getNoOfPtsRequired: function getNoOfPtsRequired(tool) {
      for (var i = 0; i < this.tools.length; i++) {
        if (tool === this.tools[i].name) {
          return this.tools[i].pts;
        }
      }
      return 0;
    },
    getPointsFromSVG: function getPointsFromSVG(id) {
      var s = this.scale;
      var p = [];
      var t = document.getElementById(id);
      if (t !== null) {
        p.push({ x: parseFloat(t.getAttribute('cx')) / s, y: parseFloat(t.getAttribute('cy')) / s });
      }
      return p;
    },
    insertSvg: function insertSvg(path) {
      var s = this.scale;
      var pts = [];
      var p = path.split('~');
      var ptsReq = this.getNoOfPtsRequired(p[1]);
      for (var i = 2; i < p.length; i++) {
        // var pt = p[i].split('.')
        var id = p[i]; // 'LP.' + pt[1] + '.' + pt[2]
        if (id.indexOf('LP') === 0 || id.indexOf('MP') === 0 || id.indexOf('CP') === 0) {
          pts.push(this.getPointsFromSVG(id)[0]);
          // console.log(ptsReq, pts.length)
          if (ptsReq >= pts.length && pts.length >= 2) {
            var idx = p[0].split('.')[1];
            this.calcAndDrawSvgPoints(s, path, idx, pts, ptsReq);
          }
        }
      }
    },
    saveMeasurement: function saveMeasurement() {
      if (this.measureDisplay === 2) {
        var self = this;
        var btn = document.getElementById('saveMeasurementButton');
        btn.classList.toggle('is-loading');
        setTimeout(function () {
          btn.classList.toggle('is-loading');
          self.measurementSaved = true;
          this.measureDisplay = 0;
        }, 1000);
      }
      this.activePart.moi = JSON.parse(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(this.moi));
      __WEBPACK_IMPORTED_MODULE_2__components_bus__["a" /* default */].$emit('updatePart', this.activePart);
      __WEBPACK_IMPORTED_MODULE_2__components_bus__["a" /* default */].$emit('infoMessage', 'Messung gespeichert');
    },
    reset: function reset(id) {
      this.path = '';
      this.points = [];
      this.d3 = 0;
      var container = document.querySelector('#frameInOut');
      var matches = container.querySelectorAll('circle,line');
      // console.log(matches)
      matches.forEach(function (item) {
        // console.log(item.id + '/' + id)
        if (item.id.indexOf(id) === 0) {
          container.removeChild(item);
        }
      });
    },
    testMeasurement: function testMeasurement() {
      __WEBPACK_IMPORTED_MODULE_5_axios___default.a.get('/api/v1/Project/sendCmd?CMD=detect').then(function (response) {}).catch(function (error) {
        console.log(error);
      });
    },
    cancelMeasurement: function cancelMeasurement() {
      console.log(this.points);
      if (this.points.length > 0) {
        this.points = [];
      } else if (this.measureProgress === 1 && this.moi.length > 0) {
        console.log('IN ELSE');
        console.log(this.moi[this.moi.length - 1].id);
        this.deleteMoi(this.moi[this.moi.length - 1].id);
      }
      this.measureProgress = 0;
      this.measureDisplay = 1;
      this.measurementSaved = false;
      __WEBPACK_IMPORTED_MODULE_2__components_bus__["a" /* default */].$emit('infoMessage', 'Konfiguration abgebrochen');
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.scale = document.getElementById('imageDiv').clientWidth / 2048;
    var s = this.scale;
    for (var i = 0; i < this.targets.length; i++) {
      var t = this.targets[i];
      var did = document.getElementById('L' + t.id);
      if (did !== null) {
        did.remove();
      }
      if (t.type === 'Line') {
        t.x1 = parseFloat(t.cx) - parseFloat(t.w) / 2 * Math.cos(parseFloat(t.angle));
        t.y1 = parseFloat(t.cy) - parseFloat(t.w) / 2 * Math.sin(parseFloat(t.angle));
        t.x2 = parseFloat(t.cx) + parseFloat(t.w) / 2 * Math.cos(parseFloat(t.angle));
        t.y2 = parseFloat(t.cy) + parseFloat(t.w) / 2 * Math.sin(parseFloat(t.angle));
        console.log(t);
        this.line('L.' + t.id, t.x1 * s, t.y1 * s, t.x2 * s, t.y2 * s, 'yellow');
        this.arc('LP.' + t.id + '.1', t.x1 * s, t.y1 * s, 2, 'yellow');
        this.arc('LP.' + t.id + '.2', t.x2 * s, t.y2 * s, 2, 'yellow');
        this.arc('LP.' + t.id + '.3', t.cx * s, t.cy * s, 4, 'yellow');
      }
      if (t.type === 'Circle') {
        var r = (parseFloat(t.h) + parseFloat(t.w)) / 4;
        // this.arc('CP.' + t.id, t.cx * s, t.cy * s, s * r, 'lime')
        this.arc('CP.' + t.id, t.cx * s, t.cy * s, 6, 'yellow');
        this.circlePath('CP.' + t.id + '.1', t.cx * s, t.cy * s, s * r, 'yellow');
      }
    }
    this.moi = JSON.parse(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(this.activePart.moi));
    this.moiId = 0;
    for (i = 0; i < this.moi.length; i++) {
      // console.log(this.moi[i].path)
      var id = parseInt(this.moi[i].path.split('~')[0].split('.')[1]);
      this.insertSvg(this.moi[i].path);
      if (id >= this.moiId) {
        this.moiId = id + 1;
        this.moiIdSelected = this.moiId;
      }
      this.updateMoi(this.moi[i]);
    }
    __WEBPACK_IMPORTED_MODULE_2__components_bus__["a" /* default */].$on('mouseEvent', function (clkInfo) {
      _this.mouseEvent(clkInfo);
    });
  },
  beforeDestroy: function beforeDestroy() {
    __WEBPACK_IMPORTED_MODULE_2__components_bus__["a" /* default */].$off('mouseEvent');
    this.activePart.moi = JSON.parse(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(this.moi));
    __WEBPACK_IMPORTED_MODULE_2__components_bus__["a" /* default */].$emit('updatePart', this.activePart);
    var container = document.querySelector('#frameInOut');
    // console.log(container)
    var matches = container.querySelectorAll('circle,line,path');
    matches.forEach(function (item) {
      container.removeChild(item);
    });
    // console.log(matches)
  }
});

/***/ }),

/***/ "rI6Q":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _vm._m(0)}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"trackerContainer"}},[_c('div',{attrs:{"id":"tracker"}}),_vm._v(" "),_c('div',{attrs:{"id":"trackerHoverInfo"}})])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "rLob":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_bus__ = __webpack_require__("qKYu");
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'imgPicker',
  components: {},
  props: ['activePlugin', 'pluginConfig', 'activeProject'],
  data: function data() {
    return {
      testImages: []
    };
  },

  methods: {
    getTestImages: function getTestImages() {
      var _this = this;

      __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('/api/v1/Project/listFiles?path=images/testImages').then(function (response) {
        console.log(response.data);
        _this.testImages = response.data;
      }).catch(function (error) {
        console.log(error);
      });
    },
    changeImage: function changeImage(id) {
      __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('/api/v1/Project/setActiveImage?imgName=' + id).then(function (response) {
        console.log(response.data);
      }).catch(function (error) {
        console.log(error);
      });
    },
    sendCmd: function sendCmd() {
      __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('/api/v1/Project/sendCmd?CMD=detect').then(function (response) {
        __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$emit('measuredValues', response);
      }).catch(function (error) {
        console.log(error);
      });
    }
  },
  mounted: function mounted() {
    this.getTestImages();
  },
  beforeDestroy: function beforeDestroy() {}
});

/***/ }),

/***/ "s6EE":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_bus__ = __webpack_require__("qKYu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_axios__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'sidebarMeasuredValues',
  props: ['targets'],
  components: {},
  data: function data() {
    return {
      isEmpty: false,
      isBordered: false,
      isStriped: false,
      isNarrowed: true,
      isHoverable: false,
      isFocusable: false,
      isLoading: false,
      hasMobileCards: false,
      isPaginated: false,
      isPaginationSimple: false,
      paginationPosition: 'bottom',
      defaultSortDirection: 'asc',
      sortIcon: 'arrow-up',
      sortIconSize: 'is-small',
      currentPage: 1,
      perPage: 10,
      measuredValues: {},
      extraValues: {},
      targetArray: [{ 'id': 'blablal', 'name': 'name', 'value': 3.3, 'status': 1 }, { 'id': 'blablal1', 'name': 'name', 'value': 3.3, 'status': 1 }, { 'id': 'blablal2', 'name': 'name', 'value': 3.3, 'status': 0 }, { 'id': 'blablal3', 'name': 'name', 'value': 3.3, 'status': 1 }, { 'id': 'blablal4', 'name': 'name', 'value': 3.3, 'status': 1 }]
    };
  },

  methods: {
    allocateColor: function allocateColor(row) {
      if (row.status === 0) {
        return 'greenRow';
      } else {
        return 'redRow';
      }
    },
    getRowClass: function getRowClass(row, index) {
      console.log(row);
      console.log(index);
    },
    closeTargetsModal: function closeTargetsModal() {
      __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$emit('toggleTargets');
    },
    fillTargetArray: function fillTargetArray(values) {
      this.measuredValues = values.data.record.values;

      this.targetArray = [];
      var targetObject = {};
      var dimensions = values.data.plan.coi;

      for (var i = 0; i < dimensions.length; i++) {
        targetObject = { 'id': i, 'name': dimensions[i].name, 'value': 'No value', 'status': 0, 'ut': 0, 'uw': 0, 'nm': 0, 'lw': 0, 'lt': 0 };
        this.targetArray.push(targetObject);
      }
      console.log(dimensions);
      for (i = 0; i < this.measuredValues.length; i++) {
        if (i < this.targetArray.length) {
          this.targetArray[i].value = this.measuredValues[i].v;
          this.targetArray[i].status = this.measuredValues[i].s;
          this.targetArray[i].ut = dimensions[i].ut;
          this.targetArray[i].uw = dimensions[i].uw;
          this.targetArray[i].nm = dimensions[i].nm;
          this.targetArray[i].lw = dimensions[i].lw;
          this.targetArray[i].lt = dimensions[i].lt;
        }
      }
      // this.targetArray[0].id = this.measuredValues.data.plan
      // this.targetArray[1] = this.measuredValues.data.record.values
      // console.log(this.targetArray)
    }
  },
  mounted: function mounted() {
    var _this = this;

    __WEBPACK_IMPORTED_MODULE_1_axios___default.a.get('/api/v1/Project/getLastParams').then(function (response) {
      _this.fillTargetArray(response);
    }).catch(function (error) {
      console.log(error);
    });
    __WEBPACK_IMPORTED_MODULE_0__components_bus__["a" /* default */].$on('measuredValues', function (values) {
      console.log(values);
      _this.fillTargetArray(values);
    });
  }
});

/***/ }),

/***/ "sH7o":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "scu1":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {
var this$1 = this;
var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"chartContainer"}},[_c('b-table',{ref:"table is-narrow",staticClass:"svgTable",attrs:{"data":_vm.activePart.coi,"opened-detailed":_vm.defaultOpenedDetails,"detailed":"","detail-key":"id","hoverable":"","narrowed":"","sticky-header":""},on:{"details-open":function (row, index) { return _vm.reDrawChart(row.id, this$1.data); }},scopedSlots:_vm._u([{key:"default",fn:function(props){return [_c('b-table-column',{attrs:{"field":"id","label":"ID","sortable":""}},[_vm._v("\n        "+_vm._s(props.row.id)+"\n      ")]),_vm._v(" "),_c('b-table-column',{attrs:{"field":"name","label":"Name","sortable":""}},[_vm._v("\n        "+_vm._s(props.row.name)+"\n      ")]),_vm._v(" "),_c('b-table-column',{attrs:{"field":"ut","label":"OT","sortable":""}},[[_vm._v(_vm._s(props.row.ut))]],2),_vm._v(" "),_c('b-table-column',{attrs:{"field":"uw","label":"OWG","sortable":""}},[[_vm._v(_vm._s(props.row.uw))]],2),_vm._v(" "),_c('b-table-column',{attrs:{"field":"nm","label":"Nennmass","sortable":""}},[[_vm._v(_vm._s(props.row.nm))]],2),_vm._v(" "),_c('b-table-column',{attrs:{"field":"lw","label":"UWG","sortable":""}},[[_vm._v(_vm._s(props.row.lw))]],2),_vm._v(" "),_c('b-table-column',{attrs:{"field":"lt","label":"UT","sortable":""}},[[_vm._v(_vm._s(props.row.lt))]],2),_vm._v(" "),_c('b-table-column',{attrs:{"field":"units","label":"Einheit","sortable":""}},[[_vm._v(_vm._s(props.row.units))]],2),_vm._v(" "),_c('b-table-column',{attrs:{"field":"formula","label":"Formel","sortable":""}},[[_vm._v(_vm._s(props.row.formula))]],2)]}},{key:"detail",fn:function(props){return [_c('div',{staticClass:"graph",attrs:{"id":'graph' + props.row.id,"width":_vm.width+_vm.margin.left+_vm.margin.right,"height":_vm.height+_vm.margin.top+_vm.margin.bottom}})]}}])})],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "suIF":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'txtOption',
  props: ['tid', 'value'],
  data: function data() {
    return {};
  },

  computed: {
    selected: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit('input', v);
      }
    }
  },
  methods: {
    getText: function getText() {
      var text = this.tid;
      var typ = this.typ;
      var idx = this.idx;
      if (typ === undefined || typ === '') {
        typ = 'txt';
      }
      if (idx === undefined || idx === '') {
        idx = -1;
      } else {
        idx = parseInt(idx);
      }
      var tmp = '';
      if (typ in this.$texts) {
        if (text in this.$texts[typ]) {
          if (this.$texts[typ][text].length > this.$languageIdx) {
            tmp = this.$texts[typ][text][this.$languageIdx];
            console.log(this.$languageIdx, text, typ, idx, tmp);
            if (tmp.indexOf('~') > 0) {
              return tmp.split('~');
            }
            return ['nix'];
          }
        }
      }
      return '$' + text;
    }
  }
});

/***/ }),

/***/ "t6xF":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_bus__ = __webpack_require__("qKYu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_aiCore_toolMixin__ = __webpack_require__("lQcu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_txt__ = __webpack_require__("pKHy");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'toolRectPicker',
  mixins: [__WEBPACK_IMPORTED_MODULE_2__components_aiCore_toolMixin__["a" /* default */]],
  props: ['activePlugin', 'pluginConfig'],
  components: {
    txt: __WEBPACK_IMPORTED_MODULE_3__components_txt__["a" /* default */]
  },
  data: function data() {
    return {
      swgId: 1,
      dragFlag: false,
      dragStart: { x: 0, y: 0 },
      dragPos: { x: 0, y: 0 },
      mode: -1
    };
  },

  methods: {
    mouseEvent: function mouseEvent(clkInfo) {
      this.scale = clkInfo.xDiv / clkInfo.trueX;
      console.log(clkInfo.state, clkInfo.id, this.mode);
      if (clkInfo.state === 'mouseup' && this.mode === 0) {
        this.points.push({ 'x': clkInfo.x, 'y': clkInfo.y });
        this.mode = -1;
        // this.saveRect()
      }
      // console.log(clkInfo.id)
      if (clkInfo.state === 'mousedown') {
        if (clkInfo.id === '$BG') {
          this.mode = 0;
          this.points = [];
          this.points.push({ 'x': clkInfo.x, 'y': clkInfo.y });
          this.removeRect();
          this.insertRect(clkInfo.x, clkInfo.y, 0, 0);
          // } else {
          //  this.mode = 1
          //  this.dragElement(clkInfo)
        }
      }
      if (clkInfo.state === 'mousemove') {
        if (this.mode === 0) {
          this.adjustRect({ 'x': clkInfo.x, 'y': clkInfo.y });
          // } else {
          //  this.dragElement(clkInfo)
        }
      }
    },
    dragElement: function dragElement(clkInfo) {
      var target = document.getElementById('ROI_' + this.svgId);
      if (target !== null) {
        var xo = target.getAttribute('x');
        var yo = target.getAttribute('y');
        // console.log(xo, yo)
        if (!this.dragFlag) {
          this.dragStart.x = clkInfo.x;
          this.dragStart.y = clkInfo.y;
          this.dragFlag = true;
        }
        this.dragPos.x = clkInfo.x;
        this.dragPos.y = clkInfo.y;
        var x = (this.dragPos.x - this.dragStart.x) * this.scale;
        var y = (this.dragPos.y - this.dragStart.y) * this.scale;
        // console.log(x, y)
        target.setAttribute('x', parseFloat(xo) + parseFloat(x));
        target.setAttribute('y', parseFloat(yo) + parseFloat(y));
        target.setAttribute('stroke', 'red');
        this.dragStart.x = clkInfo.x;
        this.dragStart.y = clkInfo.y;
      }
    },
    removeRect: function removeRect() {
      var target = document.getElementById('ROI_' + this.svgId);
      // console.log(target)
      if (target !== null) {
        target.remove();
      }
    },
    insertRect: function insertRect(x, y, w, h) {
      this.rect(this.svgId, x * this.scale, y * this.scale, w * this.scale, h * this.scale, 'yellow');
    },
    adjustRect: function adjustRect(pos) {
      var s = this.scale;
      var target = document.getElementById('ROI_' + this.svgId);
      // console.log(pos)
      if (pos.x > this.points[0].x) {
        target.setAttribute('width', (pos.x - this.points[0].x) * s);
      } else {
        target.setAttribute('x', pos.x * s);
        target.setAttribute('width', (this.points[0].x - pos.x) * s);
      }
      if (pos.y > this.points[0].y) {
        target.setAttribute('height', (pos.y - this.points[0].y) * s);
      } else {
        target.setAttribute('y', pos.y * s);
        target.setAttribute('height', (this.points[0].y - pos.y) * s);
      }
    },
    resetMask: function resetMask() {
      var _this = this;

      this.pluginConfig.topLeftX.value = 0;
      this.pluginConfig.topLeftY.value = 0;
      this.pluginConfig.btmRightX.value = 0;
      this.pluginConfig.btmRightY.value = 0;
      __WEBPACK_IMPORTED_MODULE_0_axios___default.a.post('/api/v1/' + this.activePlugin + '/saveConfig', this.pluginConfig).then(function (response) {
        console.log(response);
        __WEBPACK_IMPORTED_MODULE_0_axios___default.a.post('/api/v1/' + _this.activePlugin + '/start', {}).then(function (response) {
          console.log(response);
          _this.clearCanvas();
        });
      }).catch(function (error) {
        console.log(error);
      });
    },
    saveRect: function saveRect() {
      var target = document.getElementById('ROI_' + this.svgId);
      var x = parseFloat(target.getAttribute('x')) / this.scale;
      var y = parseFloat(target.getAttribute('y')) / this.scale;
      var w = parseFloat(target.getAttribute('width')) / this.scale;
      var h = parseFloat(target.getAttribute('height')) / this.scale;
      // console.log(x, y, w, h)
      this.pluginConfig.topLeftX.value = parseInt(x);
      this.pluginConfig.topLeftY.value = parseInt(y);
      this.pluginConfig.btmRightX.value = parseInt(x + w);
      this.pluginConfig.btmRightY.value = parseInt(y + h);

      console.log(this.pluginConfig);
      __WEBPACK_IMPORTED_MODULE_0_axios___default.a.post('/api/v1/' + this.activePlugin + '/saveConfig', this.pluginConfig).then(function (response) {
        console.log(response);
      }).catch(function (error) {
        console.log(error);
      });
    },
    test: function test() {
      var _this2 = this;

      __WEBPACK_IMPORTED_MODULE_0_axios___default.a.post('/api/v1/' + this.activePlugin + '/start', {}).then(function (response) {
        console.log(response);
        _this2.clearCanvas();
      }).catch(function (error) {
        console.log(error);
      });
    }
  },
  mounted: function mounted() {
    var _this3 = this;

    this.svgId = 1;
    __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$on('mouseEvent', function (clkInfo) {
      _this3.mouseEvent(clkInfo);
    });
  },
  beforeDestroy: function beforeDestroy() {
    __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$off('mouseEvent');
  }
});

/***/ }),

/***/ "tXZ1":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "uYVK":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__("mvHQ");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_bus__ = __webpack_require__("qKYu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_txt__ = __webpack_require__("pKHy");

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'listParts',
  props: ['activePart', 'targets'],
  components: {
    txt: __WEBPACK_IMPORTED_MODULE_3__components_txt__["a" /* default */]
  },
  data: function data() {
    return {
      data: [],
      index: 0,
      editData: {},
      fields: [],
      selectedPart: {},
      selectedCoi: 0,
      isShowModal: false,
      countPerPage: 10,
      isEmpty: false,
      isBordered: false,
      isStriped: true,
      isNarrowed: true,
      isHoverable: true,
      isFocusable: false,
      isLoading: false,
      hasMobileCards: false,
      isPaginated: true,
      isPaginationSimple: true,
      paginationPosition: 'bottom',
      defaultSortDirection: 'asc',
      sortIcon: 'arrow-up',
      sortIconSize: 'is-small',
      currentPage: 1,
      perPage: 10,
      targetArray: [[{ 'type': 'TEST' }]]
    };
  },

  methods: {
    edit: function edit(part, version) {
      console.log('in edit ' + part);
      for (var i = 0; i < this.data.length; i++) {
        if (part === this.data[i].number && version === this.data[i].version) {
          this.getPart(this.data[i].number, parseInt(this.data[i].version));
        }
      }
    },
    remove: function remove(p) {
      var _this = this;

      console.log('in remove ' + p.number);
      for (var i = 0; i < this.data.length; i++) {
        if (p.number === this.data[i].number && p.version === this.data[i].version) {
          __WEBPACK_IMPORTED_MODULE_2_axios___default.a.get('/api/v1/Project/delPart?number=' + p.number + '&version=' + p.version).then(function (response) {
            console.log(response.data);
            _this.getPartsList();
          }).catch(function (error) {
            console.log(error);
          });
          break;
        }
      }
    },
    newPart: function newPart(task) {
      var _this2 = this;

      console.log('in newPart');
      var number = 'new';
      var version = 1;
      if (this.selectedPart !== {}) {
        number = this.selectedPart.number;
        version = this.selectedPart.version;
        this.selectedPart = {};
      }
      __WEBPACK_IMPORTED_MODULE_2_axios___default.a.get('/api/v1/Project/getPart?number=' + number + '&version=' + version).then(function (response) {
        console.log(response.data);
        var copied = response.data;
        if (task === 'copy') {
          copied.number = '_' + copied.number;
        } else {
          copied.number = task;
        }
        copied.version = 1;
        var self = _this2;
        _this2.save(copied, function () {
          self.getPartsList();
        });
      }).catch(function (error) {
        console.log(error);
      });
    },
    getPart: function getPart(name, version, cb) {
      var _this3 = this;

      __WEBPACK_IMPORTED_MODULE_2_axios___default.a.get('/api/v1/Project/getPart?number=' + name + '&version=' + version).then(function (response) {
        _this3.editData = response.data;
        console.log(_this3.editData);
        _this3.isShowModal = true;
      }).catch(function (error) {
        console.log(error);
      });
    },
    save: function save(data) {
      var _this4 = this;

      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      this.isShowModal = false;
      var name = data.number;
      var version = parseInt(data.version);
      __WEBPACK_IMPORTED_MODULE_2_axios___default.a.post('/api/v1/Project/savePart?name=' + name + '&version=' + version, data).then(function (response) {
        console.log(response.data);
        if (cb !== null) {
          cb();
        } else {
          _this4.getPartsList();
          // If the part is active then update App and have
          // the changes distributed via props
          if (data.number === _this4.activePart.number) {
            __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$emit('updatePart', data);
          }
        }
      }).catch(function (error) {
        console.log(error);
      });
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$emit('infoMessage', 'Prüfplan gespeichert');
    },
    close: function close() {
      console.log('in close');
      this.isShowModal = false;
    },
    page: function page(_page) {
      this.currentPage = _page;
      if (this.currentPage < 1) {
        this.currentPage = 1;
      }
      if ((this.currentPage - 1) * this.countPerPage > this.total) {
        this.currentPage = parseInt(this.total / this.countPerPage) + 1;
      }
      this.index = (this.currentPage - 1) * this.countPerPage;
      console.log(this.index);
      this.getPartsList();
    },
    getPartsList: function getPartsList() {
      var _this5 = this;

      __WEBPACK_IMPORTED_MODULE_2_axios___default.a.get('/api/v1/Project/listParts?index=' + this.index + '&count=' + this.countPerPage).then(function (response) {
        _this5.total = response.data.total;
        _this5.data = response.data.list;
        console.log(_this5.data);
      }).catch(function (error) {
        console.log(error);
      });
    },
    selectPart: function selectPart(p) {
      for (var i = 0; i < this.data.length; i++) {
        document.getElementById('partsList_' + this.data[i].number + '_' + this.data[i].version).classList.remove('is-selected');
        if (this.data[i].number === p.number && this.data[i].version === p.version) {
          document.getElementById('partsList_' + this.data[i].number + '_' + this.data[i].version).classList.add('is-selected');
          this.selectedPart = p;
        }
      }
    },
    copyCoi: function copyCoi() {
      this.editData.coi.push(JSON.parse(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(this.editData.coi[this.selectedCoi])));
      this.selectedCoi = this.editData.coi.length - 1;
      for (var i = 0; i < this.editData.coi.length; i++) {
        this.editData.coi[i].id = i;
      }
      console.log('copied Coi');
    },
    delCoi: function delCoi() {
      if (this.editData.coi.length > 1) {
        this.editData.coi.splice(this.selectedCoi, 1);
        this.selectedCoi -= 1;
        if (this.selectedCoi < 0) {
          this.selectedCoi = 0;
        }
        for (var i = 0; i < this.editData.coi.length; i++) {
          this.editData.coi[i].id = i;
        }
        console.log('deleted Coi');
      }
    },
    closePartsModal: function closePartsModal() {
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$emit('togglePartsModal');
    }
  },
  mounted: function mounted() {
    this.fields['number'] = { hidden: false };
    this.fields['name'] = { hidden: false };
    this.fields['version'] = { hidden: false };
    this.fields['stl'] = { hidden: false };
    this.fields['id'] = { hidden: true };
    this.fields['type'] = { hidden: true };
    this.fields['ut'] = { hidden: false };
    this.fields['uw'] = { hidden: false };
    this.fields['nm'] = { hidden: false };
    this.fields['lw'] = { hidden: false };
    this.fields['lt'] = { hidden: false };
    this.fields['units'] = { hidden: false };
    this.fields['formula'] = { hidden: false };
    this.getPartsList();
  }
  //  mounted: function () {
  //    setTimeout(() => {
  //      this.targetArray = this.targets
  //    }, 200)
  //  }
});

/***/ }),

/***/ "vXXT":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',[(!_vm.editMode)?_c('span',[_vm._v("\n    "+_vm._s(_vm.getText())+"\n    ")]):_vm._e(),_vm._v(" "),(_vm.editMode)?_c('span',[_c('table',[_c('tr',[_c('td',[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.tmpText[0]),expression:"tmpText[0]"}],attrs:{"size":_vm.tmpText[0].length},domProps:{"value":(_vm.tmpText[0])},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(_vm.tmpText, 0, $event.target.value)}}})]),_vm._v(" "),_c('td')]),_vm._v(" "),_c('tr',[_c('td',[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.tmpText[1]),expression:"tmpText[1]"}],attrs:{"size":_vm.tmpText[0].length},domProps:{"value":(_vm.tmpText[1])},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(_vm.tmpText, 1, $event.target.value)}}})]),_vm._v(" "),_c('td',[_c('button',{staticClass:"button is-small is-warning",on:{"click":function($event){_vm.saveTexts()}}},[_vm._v("!")])])])])]):_vm._e()])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "w358":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "wJKU":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "wVE5":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_toolColorPicker_vue__ = __webpack_require__("/8fB");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5e5f469c_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_toolColorPicker_vue__ = __webpack_require__("VPY/");
function injectStyle (ssrContext) {
  __webpack_require__("HaSR")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-5e5f469c"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_toolColorPicker_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5e5f469c_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_toolColorPicker_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "wlDx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarProgressBar_vue__ = __webpack_require__("Xzzh");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_fad280d0_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sidebarProgressBar_vue__ = __webpack_require__("m1jH");
function injectStyle (ssrContext) {
  __webpack_require__("/OBA")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-fad280d0"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_sidebarProgressBar_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_fad280d0_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_sidebarProgressBar_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "x8dW":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"listTargets"}},[_c('div',{staticClass:"modal-card"},[_c('header',{staticClass:"modal-card-head"},[_c('p',{staticClass:"modal-card-title"},[_vm._v("Objektliste")]),_vm._v(" "),_c('button',{staticClass:"delete is-pulled-right",attrs:{"aria-label":"close"},on:{"click":function($event){_vm.$router.push('/plugins');_vm.closeTargetsModal()}}})]),_vm._v(" "),_c('section',{staticClass:"modal-card-body"},[_c('b-table',{attrs:{"id":"targetsTable","data":_vm.targetArray,"bordered":_vm.isBordered,"striped":_vm.isStriped,"narrowed":_vm.isNarrowed,"hoverable":_vm.isHoverable,"loading":_vm.isLoading,"focusable":_vm.isFocusable,"mobile-cards":_vm.hasMobileCards,"paginated":_vm.isPaginated,"per-page":_vm.perPage,"current-page":_vm.currentPage,"pagination-simple":_vm.isPaginationSimple,"pagination-position":_vm.paginationPosition,"default-sort-direction":_vm.defaultSortDirection,"sort-icon":_vm.sortIcon,"sort-icon-size":_vm.sortIconSize,"default-sort":"user.first_name","aria-next-label":"Next page","aria-previous-label":"Previous page","aria-page-label":"Page","aria-current-label":"Current page"},on:{"update:currentPage":function($event){_vm.currentPage=$event}},scopedSlots:_vm._u([{key:"default",fn:function(props){return [_c('b-table-column',{attrs:{"sortable":"","field":"type","label":"Type"}},[_vm._v(_vm._s(props.row.type))]),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","field":"cx","label":"cx","numeric":""}},[_vm._v(_vm._s(parseFloat(props.row.cx).toFixed(3)))]),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","field":"cy","label":"cy","numeric":""}},[_vm._v(_vm._s(parseFloat(props.row.cy).toFixed(3)))]),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","field":"w","label":"Breite","numeric":""}},[_vm._v(_vm._s(parseFloat(props.row.w).toFixed(3)))]),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","field":"h","label":"Höhe","numeric":""}},[_vm._v(_vm._s(parseFloat(props.row.h).toFixed(3)))]),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","field":"angle","label":"Winkel","numeric":""}},[_vm._v(_vm._s(parseFloat(props.row.angle).toFixed(3)))]),_vm._v(" "),_c('b-table-column',{attrs:{"sortable":"","field":"dim","label":"Dimension","numeric":""}},[_vm._v(_vm._s(parseFloat(props.row.dim).toFixed(3)))])]}}])},[_c('template',{slot:"empty"},[_c('section',{staticClass:"section"},[_c('div',{staticClass:"content has-text-grey has-text-centered"},[_c('p',[_c('b-icon',{attrs:{"icon":"emoticon-sad","size":"is-large"}})],1),_vm._v(" "),_c('p',[_vm._v("Nothing here.")])])])])],2)],1)])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "x9aU":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div')}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "xJD8":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__("/5sW");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_bus__ = __webpack_require__("qKYu");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_mqtt__ = __webpack_require__("zRZH");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_aiCore_sidebarWrapper__ = __webpack_require__("E2++");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_aiCore_sidebarConfig__ = __webpack_require__("N+kt");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_aiCore_sidebarProgressBar__ = __webpack_require__("wlDx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_txt__ = __webpack_require__("pKHy");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_aiCore_pluginViewer__ = __webpack_require__("2Yk4");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_aiCore_navbarTop__ = __webpack_require__("J5vx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_aiCore_notificationDisplay__ = __webpack_require__("VB6y");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_aiCore_listTargets__ = __webpack_require__("lqTo");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_aiCore_trackerContainer__ = __webpack_require__("MozD");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_aiCore_chartContainer__ = __webpack_require__("nBZ5");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




// import Vue from 'vue'








// import notifications from '@/components/aiCore/notifications'





/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'app',
  components: {
    mqtt: __WEBPACK_IMPORTED_MODULE_2__components_mqtt__["a" /* default */],
    sidebarConfig: __WEBPACK_IMPORTED_MODULE_5__components_aiCore_sidebarConfig__["a" /* default */],
    progressBar: __WEBPACK_IMPORTED_MODULE_6__components_aiCore_sidebarProgressBar__["a" /* default */],
    txt: __WEBPACK_IMPORTED_MODULE_7__components_txt__["a" /* default */],
    pluginViewer: __WEBPACK_IMPORTED_MODULE_8__components_aiCore_pluginViewer__["a" /* default */],
    sidebarWrapper: __WEBPACK_IMPORTED_MODULE_4__components_aiCore_sidebarWrapper__["a" /* default */],
    navbarTop: __WEBPACK_IMPORTED_MODULE_9__components_aiCore_navbarTop__["a" /* default */],
    // notifications,
    notificationDisplay: __WEBPACK_IMPORTED_MODULE_10__components_aiCore_notificationDisplay__["a" /* default */],
    listTargets: __WEBPACK_IMPORTED_MODULE_11__components_aiCore_listTargets__["a" /* default */],
    trackerContainer: __WEBPACK_IMPORTED_MODULE_12__components_aiCore_trackerContainer__["a" /* default */],
    chartContainer: __WEBPACK_IMPORTED_MODULE_13__components_aiCore_chartContainer__["a" /* default */]
  },
  data: function data() {
    return {
      startedFlag: false,
      showTargets: false,
      targetsHTML: '',
      targets: {},
      showOrders: false,
      showParts: false,
      showCharts: false,
      showFrameIn: false,
      // showNotification: '',
      // showInformation: '',
      maxPlugins: 20,
      startTimes: [],
      cycleTimes: [],
      totalCycleTime: 0,
      activeProject: {},
      activePlugin: '',
      activeView: 'frame',
      activePart: {},
      pluginConfig: {},
      systemCfg: {},
      language: 'EN',
      runningMode: 0,
      toggleSidebar: true,
      toggleSidebarConfig: true,
      systemConfigFileName: 'systemConfig.json', // name of the systemconfig file in fixed path ../config
      configData: {},
      cfList: [],
      stereoCameras: true,
      randomNumber: 0,
      event: false,
      window: {
        width: 0,
        height: 0
      }
    };
  },

  watch: {
    activePlugin: function activePlugin() {
      this.loadTargets();
      document.title = 'applyAI ' + this.activeProject.projectName;
    },
    runningMode: function runningMode() {
      if (this.runningMode === 1) {
        this.showCharts = true;
      } else if (this.runningMode === 0) {
        this.showCharts = false;
      }
    }
  },
  methods: {
    setPluginConfiguration: function setPluginConfiguration() {
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$emit('setSidebarTabConfig');
    },
    getRunningMode: function getRunningMode() {
      var _this = this;

      __WEBPACK_IMPORTED_MODULE_3_axios___default.a.get('/api/v1/Project/getRunningMode').then(function (response) {
        _this.runningMode = response.data.runningMode;
      });
    },
    handleProjectClick: function handleProjectClick() {
      var self = this;
      setTimeout(function () {
        // self.$router.push('/plugins')
        self.activatePlugin(self.activePlugin);
        // setTimeout(function () {
        //  bus.$emit('reLoadImage')
        // }, 20)
      }, 20);
    },
    loadTargets: function loadTargets() {
      var _this2 = this;

      __WEBPACK_IMPORTED_MODULE_3_axios___default.a.get('/api/v1/' + this.activePlugin + '/getTargets').then(function (response) {
        _this2.targets = response.data;
        /* for (var i = 0; i < this.targets.length; i++) {
          for (var key in this.targets[i]) {
            console.log(this.targets[i][key])
            if (!isNaN(this.targets[i][key])) {
              if (key === 'angle') {
                this.targets[i][key] = (180 / Math.PI * this.targets[i][key]).toFixed(2)
              } else if (key !== 'id') {
                this.targets[i][key] = this.targets[i][key].toFixed(2)
              }
            }
          }
        } */
        // console.log(this.targets)
      }).catch(function (error) {
        console.log(error);
      });
    },
    activatePlugin: function activatePlugin(name) {
      var _this3 = this;

      this.activePlugin = name;
      // console.log(name)
      __WEBPACK_IMPORTED_MODULE_3_axios___default.a.get('/api/v1/' + this.activePlugin + '/getConfig').then(function (response) {
        // console.log(response.data)
        _this3.pluginConfig = response.data;
      }).catch(function (error) {
        console.log(error);
      });
    },
    readProject: function readProject() {
      var _this4 = this;

      __WEBPACK_IMPORTED_MODULE_3_axios___default.a.get('/api/v1/Project/getConfig').then(function (response) {
        _this4.activeProject = response.data;
        console.log(_this4.activeProject);
        // if no active plugin set then use the last one
        _this4.activePlugin = _this4.activeProject.plugins[_this4.activeProject.plugins.length - 1].name;
      }).catch(function (error) {
        console.log(error);
      });
    },
    readOrder: function readOrder() {
      var _this5 = this;

      __WEBPACK_IMPORTED_MODULE_3_axios___default.a.get('/api/v1/Project/getOrder?extid=0000').then(function (response) {
        console.log(response.data);
        var part = response.data.part;
        __WEBPACK_IMPORTED_MODULE_3_axios___default.a.get('/api/v1/Project/getPart?number=' + part + '&version=1').then(function (response) {
          console.log(response.data);
          _this5.activePart = response.data;
          __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].set(_this5.activePart, 'number', response.data.number);
        }).catch(function (error) {
          console.log(error);
        });
      }).catch(function (error) {
        console.log(error);
      });
    },
    readSystemCfg: function readSystemCfg() {
      var _this6 = this;

      __WEBPACK_IMPORTED_MODULE_3_axios___default.a.get('/api/v1/System/getConfig').then(function (response) {
        _this6.systemCfg = response.data;
        _this6.language = _this6.systemCfg.language;
        __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].prototype.$languageIdx = 0;
        if (_this6.language === 'DE') {
          __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].prototype.$languageIdx = 1;
        }
        console.log(_this6.systemCfg);
        _this6.startedFlag = true;
      }).catch(function (error) {
        console.log(error);
      });
    },
    readTexts: function readTexts(cb) {
      __WEBPACK_IMPORTED_MODULE_3_axios___default.a.get('/api/v1/System/getTextFile').then(function (response) {
        console.log(response.data.text);
        __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].prototype.$texts = response.data.text;
        cb();
      }).catch(function (error) {
        console.log(error);
      });
    },
    cameraSetupSwitch: function cameraSetupSwitch() {
      if (this.configData.application[1].value === '0') {
        this.stereoCameras = false;
      } else if (this.configData.application[1].value === '1') {
        this.stereoCameras = true;
      }
    },
    openTab: function openTab(evt, tabName) {
      setTimeout(function () {
        __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$emit('activateTab', tabName);
        console.log('inApp: ' + tabName);
      }, 100);
    },
    openModal: function openModal(mdl) {
      var modal = document.getElementById(mdl);
      modal.classList.toggle('isActive');
    },
    sendCmd: function sendCmd(cmd) {
      __WEBPACK_IMPORTED_MODULE_3_axios___default.a.get('/api/v1/Project/sendCmd?' + cmd).then(function (response) {
        console.log(response.data);
      }).catch(function (error) {
        console.log(error);
      });
    },
    sendCameraCmd: function sendCameraCmd(command) {
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$emit('cam_from_hmi_web', command);
    },
    mountedProgressbar: function mountedProgressbar() {
      for (var i = 0; i < this.maxPlugins; i++) {
        this.startTimes[i] = 0;
        this.cycleTimes[i] = 0;
      }
      var self = this;
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$on('pluginStatusUpdate', function (pin, status, zeit) {
        var e = document.getElementById('listElement_' + pin);
        // console.log(pin, status, e)
        if (status === '$Start') {
          //  for (var i = 0; i < self.activeProject.plugins.length; i++) {
          // console.log(self.activeProject.plugins[i].name, pin)
          //    if (self.activeProject.plugins[i].name === pin) {
          //      self.startTimes[i] = Date.now()
          //      break
          //    }
          // }
          e.classList.add('active');
        }
        if (status === '$Finished') {
          if (self.activePlugin === pin) {
            self.loadTargets();
          }
          self.totalCycleTime = 0;
          for (i = 0; i < self.activeProject.plugins.length; i++) {
            if (self.activeProject.plugins[i].name === pin) {
              self.$set(self.cycleTimes, i, zeit);
            }
            self.totalCycleTime += parseFloat(self.cycleTimes[i]);
          }
          setTimeout(function () {
            e.classList.remove('active');
          }, 250);
        }
      });
    },
    displayErrorNotification: function displayErrorNotification() {
      // var self = this
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$on('errorMessage', function (ma) {
        console.log('this is the errormessage:' + ma);
      });
    },
    handleResize: function handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },
    loadImageToMainDiv: function loadImageToMainDiv() {}
  },
  created: function created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  destroyed: function destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  mounted: function mounted() {
    var self = this;
    this.readTexts(function () {
      self.readSystemCfg();
      self.readProject();
      self.readOrder();
      self.mountedProgressbar();
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$on('hw_from_robi_status', function (data) {
        self.status = data;
        // console.log(self.status)
      });
      /* bus.$on('errorMessage', error => {
        self.showNotification = error
      }) */
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$on('setRunningMode', function (mode) {
        self.runningMode = mode;
        // if (mode === 1) {
        //   self.showCharts = true
        // } else if (mode === 0) {
        //   self.showCharts = false
        // }
        // JUST FOR TESTING THE CHANGE IN RUNNINGMODE
        // axios.get('/api/v1/Project/sendCmd?CMD=detect')
        //   .then(response => {
        //   })
        //   .catch(function (error) {
        //     console.log(error)
        //   })
        location.reload();
      });
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$on('changeActivePlugin', function (name) {
        self.activatePlugin(name);
      });
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$on('nokMeasurement', function (d) {
        // bus.$emit('loadImageFromTracker', d)  // TODO Lukas - This cannot be correct
        self.loadImageToMainDiv();
      });
      /* bus.$on('showInformation', msg => {
        self.showInformation = msg
      }) */
      /* bus.$on('showNotification', msg => {
        self.showNotification = msg
      }) */
      /* bus.$on('infoMessage', info => {
        self.showInformation = info.replace('$Info - ', '')
        setTimeout(() => { self.showInformation = '' }, 2000)
      }) */
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$on('updateTargets', function (targets) {
        self.targets = targets;
      });
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$on('toggleTargets', function (toggleTargets) {
        self.showTargets = !self.showTargets;
      });
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$on('showCharts', function (n) {
        if (n === 0) {
          self.showCharts = false;
        }
        if (n === 1) {
          self.showCharts = true;
        }
      });
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$on('togglePartsModal', function (showParts) {
        self.showParts = !self.showParts;
      });
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$on('toggleOrdersModal', function (showOrders) {
        self.showOrders = !self.showOrders;
      });
      __WEBPACK_IMPORTED_MODULE_1__components_bus__["a" /* default */].$on('updatePart', function (data) {
        var part = data.number; // + '~' + parseInt(data.version)
        __WEBPACK_IMPORTED_MODULE_3_axios___default.a.post('/api/v1/Project/savePart?name=' + part + '&version=' + data.version, data).then(function (response) {
          self.activePart = data;
          console.log(response);
        }).catch(function (error) {
          console.log(error);
        });
      });
    });
    this.getRunningMode();
    console.log('runningMode is: ' + this.runningMode);
    console.log('in init');
    // Get all "navbar-burger" elements
    var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    console.log($navbarBurgers);
    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
      // Add a click event on each of them
      $navbarBurgers.forEach(function (el) {
        el.addEventListener('click', function () {
          // Get the target from the "data-target" attribute
          var target = el.dataset.target;
          var $target = document.getElementById(target);
          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle('is-active');
          $target.classList.toggle('is-active');
        });
      });
    }
  }
});

/***/ }),

/***/ "xkyD":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__("mvHQ");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue__ = __webpack_require__("/5sW");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_axios__);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



// import bus from '@/components/bus'

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'txt',
  props: ['tid', 'typ', 'idx'],
  data: function data() {
    return {
      editMode: false,
      tmpText: ['', '']
    };
  },

  methods: {
    getText: function getText() {
      var text = this.tid;
      var typ = this.typ;
      var idx = this.idx;
      if (typ === undefined || typ === '') {
        typ = 'txt';
      }
      if (idx === undefined || idx === '') {
        idx = -1;
      } else {
        idx = parseInt(idx);
      }
      var tmp = '';
      // console.log(this.$texts)
      if (typ in this.$texts) {
        // console.log(this.$languageIdx, text, typ, idx)
        if (text in this.$texts[typ]) {
          if (this.$texts[typ][text].length > this.$languageIdx) {
            tmp = this.$texts[typ][text][this.$languageIdx];
            if (tmp.indexOf('~') > 0) {
              tmp = tmp.split('~');
              if (idx >= 0 && idx < tmp.length) {
                return tmp[idx];
              }
            }
            return this.$texts[typ][text][this.$languageIdx];
          }
        }
      }
      return '$' + text;
    },
    toggleEditMode: function toggleEditMode() {},
    saveTexts: function saveTexts() {
      var data = JSON.parse(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(this.$texts));
      console.log(data);
      console.log(this.typ);
      var klasse = this.typ;
      if (this.typ === undefined) {
        klasse = 'txt';
      }
      if (klasse in data) {
        console.log(data[klasse]);
        if (this.tid in data[klasse]) {
          console.log(data[klasse][this.tid]);
          data[klasse][this.tid] = this.tmpText;
        } else {
          data[klasse][this.tid] = [];
          data[klasse][this.tid].push(this.tmpText[0]);
          data[klasse][this.tid].push(this.tmpText[1]);
        }
        console.log(data);
        __WEBPACK_IMPORTED_MODULE_2_axios___default.a.post('/api/v1/System/updateTextFile', { text: data }).then(function (response) {
          console.log(response.data);
          // Vue.prototype.$texts = response.data
        }).catch(function (error) {
          console.log(error);
        });
      }
    }
  },
  mounted: function mounted() {
    var tmp = this.$languageIdx;
    this.$languageIdx = 0;
    __WEBPACK_IMPORTED_MODULE_1_vue__["a" /* default */].set(this.tmpText, 0, this.getText());
    this.$languageIdx = 1;
    __WEBPACK_IMPORTED_MODULE_1_vue__["a" /* default */].set(this.tmpText, 1, this.getText());
    this.$languageIdx = tmp;
  }
});

/***/ }),

/***/ "xvPl":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "xztI":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "y0u4":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "zRZH":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mqtt_vue__ = __webpack_require__("Dq30");
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_14b2a28d_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mqtt_vue__ = __webpack_require__("x9aU");
function injectStyle (ssrContext) {
  __webpack_require__("QXeF")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-14b2a28d"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mqtt_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_14b2a28d_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mqtt_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ })

},["NHnr"]);
//# sourceMappingURL=app.7ca60ed907b8d1cdb5c9.js.map