!function (window) {
    function Element() {
        this.initialize = function () {
            this.elementType = 'element',
            this.serializedProperties = [
                'elementType'
            ],
            this.propertiesStack = [
            ],
            this._id = '' + (new Date).getTime()
        },
        this.distroy = function () {
        },
        this.removeHandler = function () {
        },
        this.attr = function (a, b) {
            if (null != a && null != b) this[a] = b;
             else if (null != a) return this[a];
            return this
        },
        this.save = function () {
            var a = this,
            b = {
            };
            this.serializedProperties.forEach(function (c) {
                b[c] = a[c]
            }),
            this.propertiesStack.push(b)
        },
        this.restore = function () {
            if (null != this.propertiesStack && 0 != this.propertiesStack.length) {
                var a = this,
                b = this.propertiesStack.pop();
                this.serializedProperties.forEach(function (c) {
                    a[c] = b[c]
                })
            }
        },
        this.toJson = function () {
            var a = this,
            b = '{',
            c = this.serializedProperties.length;
            return this.serializedProperties.forEach(function (d, e) {
                var f = a[d]===undefined? "" : a[d] ;
                if(d=="dest_id" ){
                    f=a.nodeZ["_id"];
                }
                 if(d=="src_id" ){
                    f=a.nodeA["_id"];
                }
                'string' == typeof f && (f = '"' + f + '"'),
                b += '"' + d + '":' + f,
                c > e + 1 && (b += ',')
            }),
            b += '}'
        }
    }
    CanvasRenderingContext2D.prototype.JTopoRoundRect = function (a, b, c, d, e) {
        'undefined' == typeof e && (e = 5),
        this.beginPath(),
        this.moveTo(a + e, b),
        this.lineTo(a + c - e, b),
        this.quadraticCurveTo(a + c, b, a + c, b + e),
        this.lineTo(a + c, b + d - e),
        this.quadraticCurveTo(a + c, b + d, a + c - e, b + d),
        this.lineTo(a + e, b + d),
        this.quadraticCurveTo(a, b + d, a, b + d - e),
        this.lineTo(a, b + e),
        this.quadraticCurveTo(a, b, a + e, b),
        this.closePath()
    },
    CanvasRenderingContext2D.prototype.JTopoDashedLineTo = function (a, b, c, d, e) {
        var f,
        g,
        h,
        i,
        j,
        k,
        l;
        for ('undefined' == typeof e && (e = 5), f = c - a, g = d - b, h = Math.floor(Math.sqrt(f * f + g * g)), i = 0 >= e ? h : h / e, j = g / h * e, k = f / h * e, this.beginPath(), l = 0; i > l; l++) l % 2 ? this.lineTo(a + l * k, b + l * j)  : this.moveTo(a + l * k, b + l * j);
        this.stroke()
    },
    JTopo = {
        version: '0.4.6',
        zIndex_Container: 1,
        zIndex_Link: 2,
        zIndex_Node: 3,
        SceneMode: {
            normal: 'normal',
            drag: 'drag',
            edit: 'edit',
            select: 'select'
        },
        MouseCursor: {
            normal: 'default',
            pointer: 'pointer',
            top_left: 'nw-resize',
            top_center: 'n-resize',
            top_right: 'ne-resize',
            middle_left: 'e-resize',
            middle_right: 'e-resize',
            bottom_left: 'ne-resize',
            bottom_center: 'n-resize',
            bottom_right: 'nw-resize',
            move: 'move',
            open_hand: 'url(./img/cur/openhand.cur) 8 8, default',
            closed_hand: 'url(./img/cur/closedhand.cur) 8 8, default'
        },
        createStageFromJson: function (jsonStr, canvas) {
            /*eval('var jsonObj = ' + jsonStr);*/
            var jsonObj=jsonStr;
            var stage = new JTopo.Stage(canvas);
            for (var k in jsonObj) 'childs' != k && (stage[k] = jsonObj[k]);
            var scenes = jsonObj.childs;
            return scenes.forEach(function (a) {
                var b = new JTopo.Scene(stage);
                for (var c in a) 'childs' != c && (b[c] = a[c]),
                'background' == c && (b.background = a[c]);
                var d = a.childs;
                d.forEach(function (a) {
                    var c = null,
                    d = a.elementType;
                    'node' == d ? c = new JTopo.Node : 'CircleNode' == d && (c = new JTopo.CircleNode);
                    if(d=="link"){
                        var nodeA=b.getElementById(a.src_id);
                        var nodeZ=b.getElementById(a.dest_id);
                        c = new JTopo.Link(nodeA, nodeZ, "xxxxx");        
                    }
                    for (var e in a) c[e] = a[e];
                    b.add(c)
                })
            }),
            stage
        },
        LoadJsonOneScense: function (jsonStr, localstage,localscenes) {
            /*var jsonObj=jsonStr;*/
             eval('var jsonObj = ' + jsonStr);
            for (var k in jsonObj) 'childs' != k && (stage[k] = jsonObj[k]);
            var scenes = jsonObj.childs;
            return scenes.forEach(function (a) {
                /*var b = new JTopo.Scene(stage);*/
                var b=localscenes;
                for (var c in a) 'childs' != c && (b[c] = a[c]),
                'background' == c && (b.background = a[c]);
                var d = a.childs;
                d.forEach(function (a) {
                    var c = null,
                    d = a.elementType;
                    'node' == d ? c = new JTopo.Node : 'CircleNode' == d && (c = new JTopo.CircleNode);
                    if(d=="link"){
                        var nodeA=b.getElementById(a.src_id);
                        var nodeZ=b.getElementById(a.dest_id);
                        c = new JTopo.Link(nodeA, nodeZ, "xxxxx");        
                    }
                    for (var e in a) {
                        c[e] = a[e];
                        if(e=="img")
                            c.setImage(a[e]);
                    }
                    b.add(c)
                })
            }),
            stage
        }
    }
    JTopo.Element = Element,
    window.JTopo = JTopo
}(window),
function (JTopo) {
    function MessageBus(a) {
        var b = this;
        this.name = a,
        this.messageMap = {
        },
        this.messageCount = 0,
        this.subscribe = function (a, c) {
            var d = b.messageMap[a];
            null == d && (b.messageMap[a] = [
            ]),
            b.messageMap[a].push(c),
            b.messageCount++
        },
        this.unsubscribe = function (a) {
            var c = b.messageMap[a];
            null != c && (b.messageMap[a] = null, delete b.messageMap[a], b.messageCount--)
        },
        this.publish = function (a, c, d) {
            var e,
            f = b.messageMap[a];
            if (null != f) for (e = 0; e < f.length; e++) d ? !function (a, b) {
                setTimeout(function () {
                    a(b)
                }, 10)
            }(f[e], c)  : f[e](c)
        }
    }
    function getDistance(a, b, c, d) {
        var e,
        f;
        return null == c && null == d ? (e = b.x - a.x, f = b.y - a.y)  : (e = c - a, f = d - b),
        Math.sqrt(e * e + f * f)
    }
    function getElementsBound(a) {
        var b,
        c,
        d;
        for (b = {
            left: Number.MAX_VALUE,
            right: Number.MIN_VALUE,
            top: Number.MAX_VALUE,
            bottom: Number.MIN_VALUE
        }, c = 0; c < a.length; c++) d = a[c],
        d instanceof JTopo.Link || (b.left > d.x && (b.left = d.x, b.leftNode = d), b.right < d.x + d.width && (b.right = d.x + d.width, b.rightNode = d), b.top > d.y && (b.top = d.y, b.topNode = d), b.bottom < d.y + d.height && (b.bottom = d.y + d.height, b.bottomNode = d));
        return b.width = b.right - b.left,
        b.height = b.bottom - b.top,
        b
    }
    function mouseCoords(a) {
        return a = cloneEvent(a),
        a.pageX || (a.pageX = a.clientX + document.body.scrollLeft - document.body.clientLeft, a.pageY = a.clientY + document.body.scrollTop - document.body.clientTop),
        a
    }
    function getEventPosition(a) {
        return a = mouseCoords(a)
    }
    function rotatePoint(a, b, c, d, e) {
        var f = c - a,
        g = d - b,
        h = Math.sqrt(f * f + g * g),
        i = Math.atan2(g, f) + e;
        return {
            x: a + Math.cos(i) * h,
            y: b + Math.sin(i) * h
        }
    }
    function rotatePoints(a, b, c) {
        var d,
        e,
        f;
        for (d = [
        ], e = 0; e < b.length; e++) f = rotatePoint(a.x, a.y, b[e].x, b[e].y, c),
        d.push(f);
        return d
    }
    function $foreach(a, b, c) {
        function d(e) {
            e != a.length && (b(a[e]), setTimeout(function () {
                d(++e)
            }, c))
        }
        if (0 != a.length) {
            var e = 0;
            d(e)
        }
    }
    function $for(a, b, c, d) {
        function e(a) {
            a != b && (c(b), setTimeout(function () {
                e(++a)
            }, d))
        }
        if (!(a > b)) {
            var f = 0;
            e(f)
        }
    }
    function cloneEvent(a) {
        var b,
        c = {
        };
        for (b in a) 'returnValue' != b && 'keyLocation' != b && (c[b] = a[b]);
        return c
    }
    function clone(a) {
        var b,
        c = {
        };
        for (b in a) c[b] = a[b];
        return c
    }
    function isPointInRect(a, b) {
        var c = b.x,
        d = b.y,
        e = b.width,
        f = b.height;
        return a.x > c && a.x < c + e && a.y > d && a.y < d + f
    }
    function isPointInLine(a, b, c) {
        var d = JTopo.util.getDistance(b, c),
        e = JTopo.util.getDistance(b, a),
        f = JTopo.util.getDistance(c, a),
        g = Math.abs(e + f - d) <= 0.5;
        return g
    }
    function removeFromArray(a, b) {
        var c,
        d;
        for (c = 0; c < a.length; c++) if (d = a[c], d === b) {
            a = a.del(c);
            break
        }
        return a
    }
    function randomColor() {
        return Math.floor(255 * Math.random()) + ',' + Math.floor(255 * Math.random()) + ',' + Math.floor(255 * Math.random())
    }
    function isIntsect() {
    }
    function getProperties(a, b) {
        var c,
        d,
        e;
        for (c = '', d = 0; d < b.length; d++) d > 0 && (c += ','),
        e = a[b[d]],
        'string' == typeof e ? e = '"' + e + '"' : void 0 == e && (e = null),
        c += b[d] + ':' + e;
        return c
    }
    function loadStageFromJson(json, canvas) {
        var k,
        scenes,
        i,
        sceneObj,
        scene,
        p,
        nodeMap,
        elements,
        m,
        elementObj,
        type,
        element,
        mk,
        obj = eval(json),
        stage = new JTopo.Stage(canvas);
        for (k in stageObj) if ('scenes' != k) stage[k] = obj[k];
         else for (scenes = obj.scenes, i = 0; i < scenes.length; i++) {
            sceneObj = scenes[i],
            scene = new JTopo.Scene(stage);
            for (p in sceneObj) if ('elements' != p) scene[p] = sceneObj[p];
             else for (nodeMap = {
            }, elements = sceneObj.elements, m = 0; m < elements.length; m++) {
                elementObj = elements[m],
                type = elementObj.elementType,
                'Node' == type && (element = new JTopo.Node);
                for (mk in elementObj) element[mk] = elementObj[mk];
                nodeMap[element.text] = element,
                scene.add(element)
            }
        }
        return console.log(stage),
        stage
    }
    function toJson(a) {
        var b,
        c,
        d,
        e,
        f = 'backgroundColor,visible,mode,rotate,alpha,scaleX,scaleY,shadow,translateX,translateY,areaSelect,paintAll'.split(','),
        g = 'text,elementType,x,y,width,height,visible,alpha,rotate,scaleX,scaleY,fillColor,shadow,transformAble,zIndex,dragable,selected,showSelected,font,fontColor,textPosition,textOffsetX,textOffsetY'.split(','),
        h = '{';
        for (h += 'frames:' + a.frames, h += ', scenes:[', b = 0; b < a.childs.length; b++) {
            for (c = a.childs[b], h += '{', h += getProperties(c, f), h += ', elements:[', d = 0; d < c.childs.length; d++) e = c.childs[d],
            d > 0 && (h += ','),
            h += '{',
            h += getProperties(e, g),
            h += '}';
            h += ']}'
        }
        return h += ']',
        h += '}'
    }
    function changeColor(a, b, c, d, e) {
        var f,
        g,
        h,
        i,
        j,
        k,
        l = canvas.width = b.width,
        m = canvas.height = b.height;
        for (a.clearRect(0, 0, canvas.width, canvas.height), a.drawImage(b, 0, 0), f = a.getImageData(0, 0, b.width, b.height), g = f.data, h = 0; l > h; h++) for (i = 0; m > i; i++) j = 4 * (h + i * l),
        0 != g[j + 3] && (null != c && (g[j + 0] += c), null != d && (g[j + 1] += d), null != e && (g[j + 2] += e));
        return a.putImageData(f, 0, 0, 0, 0, b.width, b.height),
        k = canvas.toDataURL(),
        alarmImageCache[b.src] = k,
        k
    }
    function genImageAlarm(a, b) {
        null == b && (b = 255);
        try {
            if (alarmImageCache[a.src]) return alarmImageCache[a.src];
            var c = new Image;
            return c.src = changeColor(graphics, a, b),
            alarmImageCache[a.src] = c,
            c
        } catch (d) {
        }
        return null
    }
    function getOffsetPosition(a) {
        var b,
        c,
        d,
        e,
        f,
        g,
        h,
        i;
        if (!a) return {
            left: 0,
            top: 0
        };
        if (b = 0, c = 0, 'getBoundingClientRect' in document.documentElement) d = a.getBoundingClientRect(),
        e = a.ownerDocument,
        f = e.body,
        g = e.documentElement,
        h = g.clientTop || f.clientTop || 0,
        i = g.clientLeft || f.clientLeft || 0,
        b = d.top + (self.pageYOffset || g && g.scrollTop || f.scrollTop) - h,
        c = d.left + (self.pageXOffset || g && g.scrollLeft || f.scrollLeft) - i;
         else do b += a.offsetTop || 0,
        c += a.offsetLeft || 0,
        a = a.offsetParent;
        while (a);
        return {
            left: c,
            top: b
        }
    }
    function lineF(a, b, c, d) {
        function e(a) {
            return a * f + g
        }
        var f = (d - b) / (c - a),
        g = b - a * f;
        return e.k = f,
        e.b = g,
        e.x1 = a,
        e.x2 = c,
        e.y1 = b,
        e.y2 = d,
        e
    }
    function inRange(a, b, c) {
        var d = Math.abs(b - c),
        e = Math.abs(b - a),
        f = Math.abs(c - a),
        g = Math.abs(d - (e + f));
        return 0.000001 > g ? !0 : !1
    }
    function isPointInLineSeg(a, b, c) {
        return inRange(a, c.x1, c.x2) && inRange(b, c.y1, c.y2)
    }
    function intersection(a, b) {
        var c,
        d;
        return a.k == b.k ? null : (1 / 0 == a.k ? (c = a.x1, d = b(a.x1))  : 1 / 0 == b.k ? (c = b.x1, d = a(b.x1))  : (c = (b.b - a.b) / (a.k - b.k), d = a(c)), 0 == isPointInLineSeg(c, d, a) ? null : 0 == isPointInLineSeg(c, d, b) ? null : {
            x: c,
            y: d
        })
    }
    function intersectionLineBound(a, b) {
        var c = JTopo.util.lineF(b.left, b.top, b.left, b.bottom),
        d = JTopo.util.intersection(a, c);
        return null == d && (c = JTopo.util.lineF(b.left, b.top, b.right, b.top), d = JTopo.util.intersection(a, c), null == d && (c = JTopo.util.lineF(b.right, b.top, b.right, b.bottom), d = JTopo.util.intersection(a, c), null == d && (c = JTopo.util.lineF(b.left, b.bottom, b.right, b.bottom), d = JTopo.util.intersection(a, c)))),
        d
    }
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (a) {
        setTimeout(a, 1000 / 24)
    },
    Array.prototype.del = function (a) {
        if ('number' != typeof a) {
            for (var b = 0; b < this.length; b++) if (this[b] === a) return this.slice(0, b).concat(this.slice(b + 1, this.length));
            return this
        }
        return 0 > a ? this : this.slice(0, a).concat(this.slice(a + 1, this.length))
    },
    [
    ].indexOf || (Array.prototype.indexOf = function (a) {
        for (var b = 0; b < this.length; b++) if (this[b] === a) return b;
        return - 1
    }),
    window.console || (window.console = {
        log: function () {
        },
        info: function () {
        },
        debug: function () {
        },
        warn: function () {
        },
        error: function () {
        }
    });
    var canvas = document.createElement('canvas'),
    graphics = canvas.getContext('2d'),
    alarmImageCache = {
    };
    JTopo.util = {
        rotatePoint: rotatePoint,
        rotatePoints: rotatePoints,
        getDistance: getDistance,
        getEventPosition: getEventPosition,
        mouseCoords: mouseCoords,
        MessageBus: MessageBus,
        isFirefox: navigator.userAgent.indexOf('Firefox') > 0,
        isIE: !(!window.attachEvent || - 1 !== navigator.userAgent.indexOf('Opera')),
        isChrome: null != navigator.userAgent.toLowerCase().match(/chrome/),
        clone: clone,
        isPointInRect: isPointInRect,
        isPointInLine: isPointInLine,
        removeFromArray: removeFromArray,
        cloneEvent: cloneEvent,
        randomColor: randomColor,
        isIntsect: isIntsect,
        toJson: toJson,
        loadStageFromJson: loadStageFromJson,
        getElementsBound: getElementsBound,
        genImageAlarm: genImageAlarm,
        getOffsetPosition: getOffsetPosition,
        lineF: lineF,
        intersection: intersection,
        intersectionLineBound: intersectionLineBound
    },
    window.$for = $for,
    window.$foreach = $foreach
}(JTopo),
function (a) {
    function b(a) {
        return {
            hgap: 16,
            visible: !1,
            exportCanvas: document.createElement('canvas'),
            getImage: function (b, c) {
                var d,
                e = a.getBound(),
                f = 1,
                g = 1;
                return this.exportCanvas.width = a.canvas.width,
                this.exportCanvas.height = a.canvas.height,
                null != b && null != c ? (this.exportCanvas.width = b, this.exportCanvas.height = c, f = b / e.width, g = c / e.height)  : (e.width > a.canvas.width && (this.exportCanvas.width = e.width), e.height > a.canvas.height && (this.exportCanvas.height = e.height)),
                d = this.exportCanvas.getContext('2d'),
                a.childs.length > 0 && (d.save(), d.clearRect(0, 0, this.exportCanvas.width, this.exportCanvas.height), a.childs.forEach(function (a) {
                    1 == a.visible && (a.save(), a.translateX = 0, a.translateY = 0, a.scaleX = 1, a.scaleY = 1, d.scale(f, g), e.left < 0 && (a.translateX = Math.abs(e.left)), e.top < 0 && (a.translateY = Math.abs(e.top)), a.paintAll = !0, a.repaint(d), a.paintAll = !1, a.restore())
                }), d.restore()),
                this.exportCanvas.toDataURL('image/png')
            },
            canvas: document.createElement('canvas'),
            update: function () {
                this.eagleImageDatas = this.getData(a)
            },
            setSize: function (a, b) {
                this.width = this.canvas.width = a,
                this.height = this.canvas.height = b
            },
            getData: function (b, c) {
                function d(a) {
                    var b = a.stage.canvas.width,
                    c = a.stage.canvas.height,
                    d = b / a.scaleX / 2,
                    e = c / a.scaleY / 2;
                    return {
                        translateX: a.translateX + d - d * a.scaleX,
                        translateY: a.translateY + e - e * a.scaleY
                    }
                }
                var e,
                f,
                g,
                h,
                i,
                j,
                k,
                l;
                if (null != j && null != k ? this.setSize(b, c)  : this.setSize(200, 160), e = this.canvas.getContext('2d'), a.childs.length > 0) {
                    e.save(),
                    e.clearRect(0, 0, this.canvas.width, this.canvas.height),
                    a.childs.forEach(function (a) {
                        1 == a.visible && (a.save(), a.centerAndZoom(null, null, e), a.repaint(e), a.restore())
                    }),
                    f = d(a.childs[0]),
                    g = f.translateX * (this.canvas.width / a.canvas.width) * a.childs[0].scaleX,
                    h = f.translateY * (this.canvas.height / a.canvas.height) * a.childs[0].scaleY,
                    i = a.getBound(),
                    j = a.canvas.width / a.childs[0].scaleX / i.width,
                    k = a.canvas.height / a.childs[0].scaleY / i.height,
                    j > 1 && (j = 1),
                    k > 1 && (j = 1),
                    g *= j,
                    h *= k,
                    i.left < 0 && (g -= Math.abs(i.left) * (this.width / i.width)),
                    i.top < 0 && (h -= Math.abs(i.top) * (this.height / i.height)),
                    e.save(),
                    e.lineWidth = 1,
                    e.strokeStyle = 'rgba(255,0,0,1)',
                    e.strokeRect( - g, - h, e.canvas.width * j, e.canvas.height * k),
                    e.restore(),
                    l = null;
                    try {
                        l = e.getImageData(0, 0, e.canvas.width, e.canvas.height)
                    } catch (m) {
                    }
                    return l
                }
                return null
            },
            paint: function () {
                if (null != this.eagleImageDatas) {
                    var b = a.graphics;
                    b.save(),
                    b.fillStyle = 'rgba(211,211,211,0.3)',
                    b.fillRect(a.canvas.width - this.canvas.width - 2 * this.hgap, a.canvas.height - this.canvas.height - 1, a.canvas.width - this.canvas.width, this.canvas.height + 1),
                    b.fill(),
                    b.save(),
                    b.lineWidth = 1,
                    b.strokeStyle = 'rgba(0,0,0,1)',
                    b.rect(a.canvas.width - this.canvas.width - 2 * this.hgap, a.canvas.height - this.canvas.height - 1, a.canvas.width - this.canvas.width, this.canvas.height + 1),
                    b.stroke(),
                    b.restore(),
                    b.putImageData(this.eagleImageDatas, a.canvas.width - this.canvas.width - this.hgap, a.canvas.height - this.canvas.height),
                    b.restore()
                } else this.eagleImageDatas = this.getData(a)
            },
            eventHandler: function (a, b, c) {
                var d,
                e,
                f,
                g,
                h,
                i = b.x,
                j = b.y;
                i > c.canvas.width - this.canvas.width && j > c.canvas.height - this.canvas.height && (i = b.x - this.canvas.width, j = b.y - this.canvas.height, 'mousedown' == a && (this.lastTranslateX = c.childs[0].translateX, this.lastTranslateY = c.childs[0].translateY), 'mousedrag' == a && c.childs.length > 0 && (d = b.dx, e = b.dy, f = c.getBound(), g = this.canvas.width / c.childs[0].scaleX / f.width, h = this.canvas.height / c.childs[0].scaleY / f.height, c.childs[0].translateX = this.lastTranslateX - d / g, c.childs[0].translateY = this.lastTranslateY - e / h))
            }
        }
    }
    function c(c) {
        function d(b) {
            var c = a.util.getEventPosition(b),
            d = a.util.getOffsetPosition(n.canvas);
            return c.offsetLeft = c.pageX - d.left,
            c.offsetTop = c.pageY - d.top,
            c.x = c.offsetLeft,
            c.y = c.offsetTop,
            c.target = null,
            c
        }
        function e(a) {
            o = !1,
            document.onselectstart = function () {
                return !1
            },
            this.mouseOver = !0;
            var b = d(a);
            n.dispatchEventToScenes('mouseover', b),
            n.dispatchEvent('mouseover', b)
        }
        function f(a) {
            o = !0,
            document.onselectstart = function () {
                return !0
            };
            var b = d(a);
            n.dispatchEventToScenes('mouseout', b),
            n.dispatchEvent('mouseout', b),
            n.needRepaint = 0 == n.animate ? !1 : !0
        }
        function g(a) {
            var b = d(a);
            n.mouseDown = !0,
            n.mouseDownX = b.x,
            n.mouseDownY = b.y,
            n.dispatchEventToScenes('mousedown', b),
            n.dispatchEvent('mousedown', b)
        }
        function h(a) {
            var b = d(a);
            n.dispatchEventToScenes('mouseup', b),
            n.dispatchEvent('mouseup', b),
            n.mouseDown = !1,
            n.needRepaint = 0 == n.animate ? !1 : !0
        }
        function i(a) {
            var b = d(a);
            n.mouseDown ? 0 == a.button && (b.dx = b.x - n.mouseDownX, b.dy = b.y - n.mouseDownY, n.dispatchEventToScenes('mousedrag', b), n.dispatchEvent('mousedrag', b), 1 == n.eagleEye.visible && n.eagleEye.update())  : (n.dispatchEventToScenes('mousemove', b), n.dispatchEvent('mousemove', b))
        }
        function j(a) {
            var b = d(a);
            n.dispatchEventToScenes('click', b),
            n.dispatchEvent('click', b)
        }
        function k(a) {
            var b = d(a);
            n.dispatchEventToScenes('dbclick', b),
            n.dispatchEvent('dbclick', b)
        }
        function l(a) {
            var b = d(a);
            n.dispatchEventToScenes('mousewheel', b),
            n.dispatchEvent('mousewheel', b),
            null != n.wheelZoom && (a.preventDefault ? a.preventDefault()  : (a = a || window.event, a.returnValue = !1), 1 == n.eagleEye.visible && n.eagleEye.update())
        }
        function m(b) {
            a.util.isIE || !window.addEventListener ? (b.onmouseout = f, b.onmouseover = e, b.onmousedown = g, b.onmouseup = h, b.onmousemove = i, b.onclick = j, b.ondblclick = k, b.onmousewheel = l, b.touchstart = g, b.touchmove = i, b.touchend = h)  : (b.addEventListener('mouseout', f), b.addEventListener('mouseover', e), b.addEventListener('mousedown', g), b.addEventListener('mouseup', h), b.addEventListener('mousemove', i), b.addEventListener('click', j), b.addEventListener('dblclick', k), a.util.isFirefox ? b.addEventListener('DOMMouseScroll', l)  : b.addEventListener('mousewheel', l)),
            window.addEventListener && (window.addEventListener('keydown', function (b) {
                n.dispatchEventToScenes('keydown', a.util.cloneEvent(b));
                var c = b.keyCode;
                (37 == c || 38 == c || 39 == c || 40 == c) && (b.preventDefault ? b.preventDefault()  : (b = b || window.event, b.returnValue = !1))
            }, !0), window.addEventListener('keyup', function (b) {
                n.dispatchEventToScenes('keyup', a.util.cloneEvent(b));
                var c = b.keyCode;
                (37 == c || 38 == c || 39 == c || 40 == c) && (b.preventDefault ? b.preventDefault()  : (b = b || window.event, b.returnValue = !1))
            }, !0))
        }
        var n,
        o,
        p,
        q;
        a.stage = this,
        n = this,
        this.initialize = function (c) {
            m(c),
            this.canvas = c,
            this.graphics = c.getContext('2d'),
            this.childs = [
            ],
            this.frames = 24,
            this.messageBus = new a.util.MessageBus,
            this.eagleEye = b(this),
            this.wheelZoom = null,
            this.mouseDownX = 0,
            this.mouseDownY = 0,
            this.mouseDown = !1,
            this.mouseOver = !1,
            this.needRepaint = !0,
            this.serializedProperties = [
                'frames',
                'wheelZoom'
            ]
        },
        null != c && this.initialize(c),
        o = !0,
        document.oncontextmenu = function () {
            return o
        },
        this.dispatchEventToScenes = function (a, b) {
            if (0 != this.frames && (this.needRepaint = !0), 1 == this.eagleEye.visible && - 1 != a.indexOf('mouse')) {
                var c = b.x,
                d = b.y;
                if (c > this.width - this.eagleEye.width && d > this.height - this.eagleEye.height) return void this.eagleEye.eventHandler(a, b, this)
            }
            this.childs.forEach(function (c) {
                if (1 == c.visible) {
                    var d = c[a + 'Handler'];
                    if (null == d) throw new Error('Function not found:' + a + 'Handler');
                    d.call(c, b)
                }
            })
        },
        this.add = function (a) {
            for (var b = 0; b < this.childs.length; b++) if (this.childs[b] === a) return;
            a.addTo(this),
            this.childs.push(a)
        },
        this.remove = function (a) {
            if (null == a) throw new Error('Stage.remove出错: 参数为null!');
            for (var b = 0; b < this.childs.length; b++) if (this.childs[b] === a) return a.stage = null,
            this.childs = this.childs.del(b),
            this;
            return this
        },
        this.clear = function () {
            this.childs = [
            ]
        },
        this.addEventListener = function (a, b) {
            var c = this,
            d = function (a) {
                b.call(c, a)
            };
            return this.messageBus.subscribe(a, d),
            this
        },
        this.removeEventListener = function (a) {
            this.messageBus.unsubscribe(a)
        },
        this.removeAllEventListener = function () {
            this.messageBus = new a.util.MessageBus
        },
        this.dispatchEvent = function (a, b) {
            return this.messageBus.publish(a, b),
            this
        },
        p = 'click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup'.split(','),
        q = this,
        p.forEach(function (a) {
            q[a] = function (b) {
                null != b ? this.addEventListener(a, b)  : this.dispatchEvent(a)
            }
        }),
        this.saveImageInfo = function (a, b) {
            var c = this.eagleEye.getImage(a, b),
            d = window.open('about:blank');
            return d.document.write('<img src=\'' + c + '\' alt=\'from canvas\'/>'),
            this
        },
        this.saveAsLocalImage = function (a, b) {
            var c = this.eagleEye.getImage(a, b);
            return c.replace('image/png', 'image/octet-stream'),
            window.location.href = c,
            this
        },
        this.paint = function () {
            null != this.canvas && (this.graphics.save(), this.graphics.clearRect(0, 0, this.width, this.height), this.childs.forEach(function (a) {
                1 == a.visible && a.repaint(n.graphics)
            }), 1 == this.eagleEye.visible && this.eagleEye.paint(this), this.graphics.restore())
        },
        this.repaint = function () {
            0 != this.frames && (this.frames < 0 && 0 == this.needRepaint || (this.paint(), this.frames < 0 && (this.needRepaint = !1)))
        },
        this.zoom = function (a) {
            this.childs.forEach(function (b) {
                0 != b.visible && b.zoom(a)
            })
        },
        this.zoomOut = function (a) {
            this.childs.forEach(function (b) {
                0 != b.visible && b.zoomOut(a)
            })
        },
        this.zoomIn = function (a) {
            this.childs.forEach(function (b) {
                0 != b.visible && b.zoomIn(a)
            })
        },
        this.centerAndZoom = function () {
            this.childs.forEach(function (a) {
                0 != a.visible && a.centerAndZoom()
            })
        },
        this.setCenter = function (a, b) {
            var c = this;
            this.childs.forEach(function (d) {
                var e = a - c.canvas.width / 2,
                f = b - c.canvas.height / 2;
                d.translateX = - e,
                d.translateY = - f
            })
        },
        this.getBound = function () {
            var a = {
                left: Number.MAX_VALUE,
                right: Number.MIN_VALUE,
                top: Number.MAX_VALUE,
                bottom: Number.MIN_VALUE
            };
            return this.childs.forEach(function (b) {
                var c = b.getElementsBound();
                c.left < a.left && (a.left = c.left, a.leftNode = c.leftNode),
                c.top < a.top && (a.top = c.top, a.topNode = c.topNode),
                c.right > a.right && (a.right = c.right, a.rightNode = c.rightNode),
                c.bottom > a.bottom && (a.bottom = c.bottom, a.bottomNode = c.bottomNode)
            }),
            a.width = a.right - a.left,
            a.height = a.bottom - a.top,
            a
        },
        this.toJson = function () {
            var b = this,
            c = '{"version":"' + a.version + '",';
            return this.serializedProperties.length,
            this.serializedProperties.forEach(function (a) {
                /*var d = b[a];*/
                var d = b[a]===undefined? "" : b[a] ;
                'string' == typeof d && (d = '"' + d + '"'),
                c += '"' + a + '":' + d + ','
            }),
            c += '"childs":[',
            this.childs.forEach(function (a) {
                c += a.toJson()
            }),
            c += ']',
            c += '}'
        },
        function () {
            0 == n.frames ? setTimeout(arguments.callee, 100)  : n.frames < 0 ? (n.repaint(), setTimeout(arguments.callee, 1000 / - n.frames))  : (n.repaint(), setTimeout(arguments.callee, 1000 / n.frames))
        }(),
        setTimeout(function () {
            n.mousewheel(function (a) {
                var b = null == a.wheelDelta ? a.detail : a.wheelDelta;
                null != this.wheelZoom && (b > 0 ? this.zoomIn(this.wheelZoom)  : this.zoomOut(this.wheelZoom))
            }),
            n.paint()
        }, 300),
        setTimeout(function () {
            n.paint()
        }, 1000),
        setTimeout(function () {
            n.paint()
        }, 3000)
    }
    c.prototype = {
        get width() {
            return this.canvas.width
        },
        get height() {
            return this.canvas.height
        },
        set cursor(a) {
            this.canvas.style.cursor = a
        },
        get cursor() {
            return this.canvas.style.cursor
        },
        set mode(a) {
            this.childs.forEach(function (b) {
                b.mode = a
            })
        }
    },
    a.Stage = c
}(JTopo),
function (a) {
    function b(c) {
        function d(a, b, c, d) {
            return function (e) {
                e.beginPath(),
                e.strokeStyle = 'rgba(0,0,236,0.5)',
                e.fillStyle = 'rgba(0,0,236,0.1)',
                e.rect(a, b, c, d),
                e.fill(),
                e.stroke(),
                e.closePath()
            }
        }
        var e,
        f,
        g = this;
        return this.initialize = function () {
            b.prototype.initialize.apply(this, arguments),
            this.messageBus = new a.util.MessageBus,
            this.elementType = 'scene',
            this.childs = [
            ],
            this.zIndexMap = {
            },
            this.zIndexArray = [
            ],
            this.backgroundColor = '255,255,255',
            this.visible = !0,
            this.alpha = 0,
            this.scaleX = 1,
            this.scaleY = 1,
            this.mode = a.SceneMode.normal,
            this.translate = !0,
            this.translateX = 0,
            this.translateY = 0,
            this.lastTranslateX = 0,
            this.lastTranslateY = 0,
            this.mouseDown = !1,
            this.mouseDownX = null,
            this.mouseDownY = null,
            this.mouseDownEvent = null,
            this.areaSelect = !0,
            this.operations = [
            ],
            this.selectedElements = [
            ],
            this.paintAll = !1;
            var c = 'background,backgroundColor,mode,paintAll,areaSelect,translate,translateX,translateY,lastTranslatedX,lastTranslatedY,alpha,visible,scaleX,scaleY'.split(',');
            this.serializedProperties = this.serializedProperties.concat(c)
        },
        this.initialize(),
        this.setBackground = function (a) {
            this.background = a
        },
        this.addTo = function (a) {
            this.stage !== a && null != a && (this.stage = a)
        },
        null != c && (c.add(this), this.addTo(c)),
        this.show = function () {
            this.visible = !0
        },
        this.hide = function () {
            this.visible = !1
        },
        this.paint = function (a) {
            if (0 != this.visible && null != this.stage) {
                if (a.save(), this.paintBackgroud(a), a.restore(), a.save(), a.scale(this.scaleX, this.scaleY), 1 == this.translate) {
                    var b = this.getOffsetTranslate(a);
                    a.translate(b.translateX, b.translateY)
                }
                this.paintChilds(a),
                a.restore(),
                a.save(),
                this.paintOperations(a, this.operations),
                a.restore()
            }
        },
        this.repaint = function (a) {
            0 != this.visible && this.paint(a)
        },
        this.paintBackgroud = function (a) {
            null != this.background ? a.drawImage(this.background, 0, 0, a.canvas.width, a.canvas.height)  : (a.beginPath(), a.fillStyle = 'rgba(' + this.backgroundColor + ',' + this.alpha + ')', a.fillRect(0, 0, a.canvas.width, a.canvas.height), a.closePath())
        },
        this.getDisplayedElements = function () {
            var a,
            b,
            c,
            d,
            e,
            f;
            for (a = [
            ], b = 0; b < this.zIndexArray.length; b++) for (c = this.zIndexArray[b], d = this.zIndexMap[c], e = 0; e < d.length; e++) f = d[e],
            this.isVisiable(f) && a.push(f);
            return a
        },
        this.getDisplayedNodes = function () {
            var b,
            c,
            d;
            for (b = [
            ], c = 0; c < this.childs.length; c++) d = this.childs[c],
            d instanceof a.Node && this.isVisiable(d) && b.push(d);
            return b
        },
        this.paintChilds = function (b) {
            var c,
            d,
            e,
            f,
            g,
            h;
            for (c = 0; c < this.zIndexArray.length; c++) for (d = this.zIndexArray[c], e = this.zIndexMap[d], f = 0; f < e.length; f++) g = e[f],
            (1 == this.paintAll || this.isVisiable(g)) && (b.save(), 1 == g.transformAble && (h = g.getCenterLocation(), b.translate(h.x, h.y), g.rotate && b.rotate(g.rotate), g.scaleX && g.scaleY ? b.scale(g.scaleX, g.scaleY)  : g.scaleX ? b.scale(g.scaleX, 1)  : g.scaleY && b.scale(1, g.scaleY)), 1 == g.shadow && (b.shadowBlur = g.shadowBlur, b.shadowColor = g.shadowColor, b.shadowOffsetX = g.shadowOffsetX, b.shadowOffsetY = g.shadowOffsetY), g instanceof a.InteractiveElement && (g.selected && 1 == g.showSelected && g.paintSelected(b), 1 == g.isMouseOver && g.paintMouseover(b)), g.paint(b), b.restore())
        },
        this.getOffsetTranslate = function (a) {
            var b,
            c,
            d,
            e = this.stage.canvas.width,
            f = this.stage.canvas.height;
            return null != a && 'move' != a && (e = a.canvas.width, f = a.canvas.height),
            b = e / this.scaleX / 2,
            c = f / this.scaleY / 2,
            d = {
                translateX: this.translateX + (b - b * this.scaleX),
                translateY: this.translateY + (c - c * this.scaleY)
            }
        },
        this.isVisiable = function (b) {
            var c,
            d,
            e,
            f,
            g;
            return 1 != b.visible ? !1 : b instanceof a.Link ? !0 : (c = this.getOffsetTranslate(), d = b.x + c.translateX, e = b.y + c.translateY, d *= this.scaleX, e *= this.scaleY, f = d + b.width * this.scaleX, g = e + b.height * this.scaleY, d > this.stage.canvas.width || e > this.stage.canvas.height || 0 > f || 0 > g ? !1 : !0)
        },
        this.paintOperations = function (a, b) {
            for (var c = 0; c < b.length; c++) b[c](a)
        },
        this.findElements = function (a) {
            for (var b = [
            ], c = 0; c < this.childs.length; c++) 1 == a(this.childs[c]) && b.push(this.childs[c]);
            return b
        },
        this.getElementsByClass = function (a) {
            return this.findElements(function (b) {
                return b instanceof a
            })
        },
        this.getElementById = function(a){
            for(var b,c=0;c<this.childs.length;c++){
                if(a==this.childs[c]._id){
                    b=this.childs[c];
                }
            } 
                return b;
        },
        this.addOperation = function (a) {
            return this.operations.push(a),
            this
        },
        this.clearOperations = function () {
            return this.operations = [
            ],
            this
        },
        this.getElementByXY = function (b, c) {
            var d,
            e,
            f,
            g,
            h,
            i;
            for (d = null, e = this.zIndexArray.length - 1; e >= 0; e--) for (f = this.zIndexArray[e], g = this.zIndexMap[f], h = g.length - 1; h >= 0; h--) if (i = g[h], i instanceof a.InteractiveElement && this.isVisiable(i) && i.isInBound(b, c)) return d = i;
            return d
        },
        this.add = function (a) {
            this.childs.push(a),
            null == this.zIndexMap[a.zIndex] && (this.zIndexMap[a.zIndex] = [
            ], this.zIndexArray.push(a.zIndex), this.zIndexArray.sort(function (a, b) {
                return a - b
            })),
            this.zIndexMap['' + a.zIndex].push(a)
        },
        this.remove = function (b) {
            this.childs = a.util.removeFromArray(this.childs, b);
            var c = this.zIndexMap[b.zIndex];
            c && (this.zIndexMap[b.zIndex] = a.util.removeFromArray(c, b)),
            b.removeHandler(this)
        },
        this.clear = function () {
            var a = this;
            this.childs.forEach(function (b) {
                b.removeHandler(a)
            }),
            this.childs = [
            ],
            this.operations = [
            ],
            this.zIndexArray = [
            ],
            this.zIndexMap = {
            }
        },
        this.addToSelected = function (a) {
            this.selectedElements.push(a)
        },
        this.cancleAllSelected = function (a) {
            for (var b = 0; b < this.selectedElements.length; b++) this.selectedElements[b].unselectedHandler(a);
            this.selectedElements = [
            ]
        },
        this.notInSelectedNodes = function (a) {
            for (var b = 0; b < this.selectedElements.length; b++) if (a === this.selectedElements[b]) return !1;
            return !0
        },
        this.removeFromSelected = function (a) {
            var b,
            c;
            for (b = 0; b < this.selectedElements.length; b++) c = this.selectedElements[b],
            a === c && (this.selectedElements = this.selectedElements.del(b))
        },
        this.toSceneEvent = function (b) {
            var c,
            d = a.util.clone(b);
            return d.x /= this.scaleX,
            d.y /= this.scaleY,
            1 == this.translate && (c = this.getOffsetTranslate(), d.x -= c.translateX, d.y -= c.translateY),
            null != d.dx && (d.dx /= this.scaleX, d.dy /= this.scaleY),
            null != this.currentElement && (d.target = this.currentElement),
            d.scene = this,
            d
        },
        this.selectElement = function (a) {
            var b,
            c,
            d = g.getElementByXY(a.x, a.y);
            if (null != d) if (a.target = d, d.mousedownHander(a), d.selectedHandler(a), g.notInSelectedNodes(d)) a.ctrlKey || g.cancleAllSelected(),
            g.addToSelected(d);
             else for (1 == a.ctrlKey && (d.unselectedHandler(), this.removeFromSelected(d)), b = 0; b < this.selectedElements.length; b++) c = this.selectedElements[b],
            c.selectedHandler(a);
             else a.ctrlKey || g.cancleAllSelected();
            this.currentElement = d
        },
        this.mousedownHandler = function (b) {
            var c = this.toSceneEvent(b);
            if (this.mouseDown = !0, this.mouseDownX = c.x, this.mouseDownY = c.y, this.mouseDownEvent = c, this.mode == a.SceneMode.normal) this.selectElement(c),
            (null == this.currentElement || this.currentElement instanceof a.Link) && 1 == this.translate && (this.lastTranslateX = this.translateX, this.lastTranslateY = this.translateY);
             else {
                if (this.mode == a.SceneMode.drag && 1 == this.translate) return this.lastTranslateX = this.translateX,
                void (this.lastTranslateY = this.translateY);
                this.mode == a.SceneMode.select ? this.selectElement(c)  : this.mode == a.SceneMode.edit && (this.selectElement(c), (null == this.currentElement || this.currentElement instanceof a.Link) && 1 == this.translate && (this.lastTranslateX = this.translateX, this.lastTranslateY = this.translateY))
            }
            g.dispatchEvent('mousedown', c)
        },
        this.mouseupHandler = function (b) {
            this.stage.cursor != a.MouseCursor.normal && (this.stage.cursor = a.MouseCursor.normal),
            g.clearOperations();
            var c = this.toSceneEvent(b);
            null != this.currentElement && (c.target = g.currentElement, this.currentElement.mouseupHandler(c)),
            this.dispatchEvent('mouseup', c),
            this.mouseDown = !1
        },
        this.dragElements = function (b) {
            var c,
            d,
            e;
            if (null != this.currentElement && 1 == this.currentElement.dragable) for (c = 0; c < this.selectedElements.length; c++) d = this.selectedElements[c],
            0 != d.dragable && (e = a.util.clone(b), e.target = d, d.mousedragHandler(e))
        },
        this.mousedragHandler = function (b) {
            var c = this.toSceneEvent(b);
            this.mode == a.SceneMode.normal ? null == this.currentElement || this.currentElement instanceof a.Link ? 1 == this.translate && (this.stage.cursor = a.MouseCursor.closed_hand, this.translateX = this.lastTranslateX + c.dx, this.translateY = this.lastTranslateY + c.dy)  : this.dragElements(c)  : this.mode == a.SceneMode.drag ? 1 == this.translate && (this.stage.cursor = a.MouseCursor.closed_hand, this.translateX = this.lastTranslateX + c.dx, this.translateY = this.lastTranslateY + c.dy)  : this.mode == a.SceneMode.select ? null != this.currentElement ? 1 == this.currentElement.dragable && this.dragElements(c)  : 1 == this.areaSelect && this.areaSelectHandle(c)  : this.mode == a.SceneMode.edit && (null == this.currentElement || this.currentElement instanceof a.Link ? 1 == this.translate && (this.stage.cursor = a.MouseCursor.closed_hand, this.translateX = this.lastTranslateX + c.dx, this.translateY = this.lastTranslateY + c.dy)  : this.dragElements(c)),
            this.dispatchEvent('mousedrag', c)
        },
        this.areaSelectHandle = function (a) {
            var b,
            c,
            e,
            f,
            h = a.offsetLeft,
            i = a.offsetTop,
            j = this.mouseDownEvent.offsetLeft,
            k = this.mouseDownEvent.offsetTop,
            l = h >= j ? j : h,
            m = i >= k ? k : i,
            n = Math.abs(a.dx) * this.scaleX,
            o = Math.abs(a.dy) * this.scaleY,
            p = new d(l, m, n, o);
            for (g.clearOperations().addOperation(p), h = a.x, i = a.y, j = this.mouseDownEvent.x, k = this.mouseDownEvent.y, l = h >= j ? j : h, m = i >= k ? k : i, n = Math.abs(a.dx), o = Math.abs(a.dy), b = l + n, c = m + o, e = 0; e < g.childs.length; e++) f = g.childs[e],
            f.x > l && f.x + f.width < b && f.y > m && f.y + f.height < c && g.notInSelectedNodes(f) && (f.selectedHandler(a), g.addToSelected(f))
        },
        this.mousemoveHandler = function (b) {
            var c,
            d;
            return this.mousecoord = {
                x: b.x,
                y: b.y
            },
            c = this.toSceneEvent(b),
            this.mode == a.SceneMode.drag ? void (this.stage.cursor = a.MouseCursor.open_hand)  : (this.mode == a.SceneMode.normal ? this.stage.cursor = a.MouseCursor.normal : this.mode == a.SceneMode.select && (this.stage.cursor = a.MouseCursor.normal), d = g.getElementByXY(c.x, c.y), null != d ? (g.mouseOverelement && g.mouseOverelement !== d && (c.target = d, g.mouseOverelement.mouseoutHandler(c)), g.mouseOverelement = d, 0 == d.isMouseOver ? (c.target = d, d.mouseoverHandler(c), g.dispatchEvent('mouseover', c))  : (c.target = d, d.mousemoveHandler(c), g.dispatchEvent('mousemove', c)))  : g.mouseOverelement ? (c.target = d, g.mouseOverelement.mouseoutHandler(c), g.mouseOverelement = null, g.dispatchEvent('mouseout', c))  : (c.target = null, g.dispatchEvent('mousemove', c)), void 0)
        },
        this.mouseoverHandler = function (a) {
            var b = this.toSceneEvent(a);
            this.dispatchEvent('mouseover', b)
        },
        this.mouseoutHandler = function (a) {
            var b = this.toSceneEvent(a);
            this.dispatchEvent('mouseout', b)
        },
        this.clickHandler = function (a) {
            var b = this.toSceneEvent(a);
            this.currentElement && (b.target = this.currentElement, this.currentElement.clickHandler(b)),
            this.dispatchEvent('click', b)
        },
        this.dbclickHandler = function (a) {
            var b = this.toSceneEvent(a);
            this.currentElement ? (b.target = this.currentElement, this.currentElement.dbclickHandler(b))  : g.cancleAllSelected(),
            this.dispatchEvent('dbclick', b)
        },
        this.mousewheelHandler = function (a) {
            var b = this.toSceneEvent(a);
            this.dispatchEvent('mousewheel', b)
        },
        this.touchstart = this.mousedownHander,
        this.touchmove = this.mousedragHandler,
        this.touchend = this.mousedownHander,
        this.keydownHandler = function (a) {
            this.dispatchEvent('keydown', a)
        },
        this.keyupHandler = function (a) {
            this.dispatchEvent('keyup', a)
        },
        this.addEventListener = function (a, b) {
            var c = this,
            d = function (a) {
                b.call(c, a)
            };
            return this.messageBus.subscribe(a, d),
            this
        },
        this.removeEventListener = function (a) {
            this.messageBus.unsubscribe(a)
        },
        this.removeAllEventListener = function () {
            this.messageBus = new a.util.MessageBus
        },
        this.dispatchEvent = function (a, b) {
            return this.messageBus.publish(a, b),
            this
        },
        e = 'click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup'.split(','),
        f = this,
        e.forEach(function (a) {
            f[a] = function (b) {
                null != b ? this.addEventListener(a, b)  : this.dispatchEvent(a)
            }
        }),
        this.zoom = function (a, b) {
            null != a && 0 != a && (this.scaleX = a),
            null != b && 0 != b && (this.scaleY = b)
        },
        this.zoomOut = function (a) {
            0 != a && (null == a && (a = 0.8), this.scaleX /= a, this.scaleY /= a)
        },
        this.zoomIn = function (a) {
            0 != a && (null == a && (a = 0.8), this.scaleX *= a, this.scaleY *= a)
        },
        this.getBound = function () {
            return {
                left: 0,
                top: 0,
                right: this.stage.canvas.width,
                bottom: this.stage.canvas.height,
                width: this.stage.canvas.width,
                height: this.stage.canvas.height
            }
        },
        this.getElementsBound = function () {
            return a.util.getElementsBound(this.childs)
        },
        this.translateToCenter = function (a) {
            var b = this.getElementsBound(),
            c = this.stage.canvas.width / 2 - (b.left + b.right) / 2,
            d = this.stage.canvas.height / 2 - (b.top + b.bottom) / 2;
            a && (c = a.canvas.width / 2 - (b.left + b.right) / 2, d = a.canvas.height / 2 - (b.top + b.bottom) / 2),
            this.translateX = c,
            this.translateY = d
        },
        this.setCenter = function (a, b) {
            var c = a - this.stage.canvas.width / 2,
            d = b - this.stage.canvas.height / 2;
            this.translateX = - c,
            this.translateY = - d
        },
        this.centerAndZoom = function (a, b, c) {
            var d,
            e,
            f,
            g,
            h,
            i;
            if (this.translateToCenter(c), null == a || null == b) {
                if (d = this.getElementsBound(), e = d.right - d.left, f = d.bottom - d.top, g = this.stage.canvas.width / e, h = this.stage.canvas.height / f, c && (g = c.canvas.width / e, h = c.canvas.height / f), i = Math.min(g, h), i > 1) return;
                this.zoom(i, i)
            }
            this.zoom(a, b)
        },
        this.getCenterLocation = function () {
            return {
                x: g.stage.canvas.width / 2,
                y: g.stage.canvas.height / 2
            }
        },
        this.doLayout = function (a) {
            a && a(this, this.childs)
        },
        this.toJson = function () {
            var a,
            b = this,
            c = '{';
            return this.serializedProperties.length,
            this.serializedProperties.forEach(function (a) {
                /*var d = b[a];*/
                var d = b[a]===undefined? "" : b[a] ;
                'background' == a && (d = "img/wbg.png"),
                'string' == typeof d && (d = '"' + d + '"'),
                c += '"' + a + '":' + d + ','
            }),
            c += '"childs":[',
            a = this.childs.length,
            this.childs.forEach(function (b, d) {
                c += b.toJson(),
                a > d + 1 && (c += ',')
            }),
            c += ']',
            c += '}'
        },
        g
    }
    b.prototype = new a.Element;
    var c = {
    };
    Object.defineProperties(b.prototype, {
        background: {
            get: function () {
                return this._background
            },
            set: function (a) {
                if ('string' == typeof a) {
                    var b = c[a];
                    null == b && (b = new Image, b.src = a, b.onload = function () {
                        c[a] = b
                    }),
                    this._background = b
                } else this._background = a
            }
        }
    }),
    a.Scene = b
}(JTopo),
function (a) {
    function b() {
        this.initialize = function () {
            b.prototype.initialize.apply(this, arguments),
            this.elementType = 'displayElement',
            this.x = 0,
            this.y = 0,
            this.width = 32,
            this.height = 32,
            this.visible = !0,
            this.alpha = 1,
            this.rotate = 0,
            this.scaleX = 1,
            this.scaleY = 1,
            this.strokeColor = '22,124,255',
            this.borderColor = '22,124,255',
            this.fillColor = '22,124,255',
            this.shadow = !1,
            this.shadowBlur = 5,
            this.shadowColor = 'rgba(0,0,0,0.5)',
            this.shadowOffsetX = 3,
            this.shadowOffsetY = 6,
            this.transformAble = !1,
            this.zIndex = 0;
            var a = 'x,y,width,height,visible,alpha,rotate,scaleX,scaleY,strokeColor,fillColor,shadow,shadowColor,shadowOffsetX,shadowOffsetY,transformAble,zIndex'.split(',');
            this.serializedProperties = this.serializedProperties.concat(a)
        },
        this.initialize(),
        this.paint = function (a) {
            a.beginPath(),
            a.fillStyle = 'rgba(' + this.fillColor + ',' + this.alpha + ')',
            a.rect( - this.width / 2, - this.height / 2, this.width, this.height),
            a.fill(),
            a.stroke(),
            a.closePath()
        },
        this.getLocation = function () {
            return {
                x: this.x,
                y: this.y
            }
        },
        this.setLocation = function (a, b) {
            return this.x = a,
            this.y = b,
            this
        },
        this.getCenterLocation = function () {
            return {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            }
        },
        this.setCenterLocation = function (a, b) {
            return this.x = a - this.width / 2,
            this.y = b - this.height / 2,
            this
        },
        this.getSize = function () {
            return {
                width: this.width,
                height: this.heith
            }
        },
        this.setSize = function (a, b) {
            return this.width = a,
            this.height = b,
            this
        },
        this.getBound = function () {
            return {
                left: this.x,
                top: this.y,
                right: this.x + this.width,
                bottom: this.y + this.height,
                width: this.width,
                height: this.height
            }
        },
        this.setBound = function (a, b, c, d) {
            return this.setLocation(a, b),
            this.setSize(c, d),
            this
        },
        this.getDisplayBound = function () {
            return {
                left: this.x,
                top: this.y,
                right: this.x + this.width * this.scaleX,
                bottom: this.y + this.height * this.scaleY
            }
        },
        this.getDisplaySize = function () {
            return {
                width: this.width * this.scaleX,
                height: this.height * this.scaleY
            }
        },
        this.getPosition = function (a) {
            var b,
            c = this.getBound();
            return 'Top_Left' == a ? b = {
                x: c.left,
                y: c.top
            }
             : 'Top_Center' == a ? b = {
                x: this.cx,
                y: c.top
            }
             : 'Top_Right' == a ? b = {
                x: c.right,
                y: c.top
            }
             : 'Middle_Left' == a ? b = {
                x: c.left,
                y: this.cy
            }
             : 'Middle_Center' == a ? b = {
                x: this.cx,
                y: this.cy
            }
             : 'Middle_Right' == a ? b = {
                x: c.right,
                y: this.cy
            }
             : 'Bottom_Left' == a ? b = {
                x: c.left,
                y: c.bottom
            }
             : 'Bottom_Center' == a ? b = {
                x: this.cx,
                y: c.bottom
            }
             : 'Bottom_Right' == a && (b = {
                x: c.right,
                y: c.bottom
            }),
            b
        }
    }
    function c() {
        this.initialize = function () {
            c.prototype.initialize.apply(this, arguments),
            this.elementType = 'interactiveElement',
            this.dragable = !1,
            this.selected = !1,
            this.showSelected = !0,
            this.selectedLocation = null,
            this.isMouseOver = !1;
            var a = 'dragable,selected,showSelected,isMouseOver'.split(',');
            this.serializedProperties = this.serializedProperties.concat(a)
        },
        this.initialize(),
        this.paintSelected = function (a) {
            0 != this.showSelected && (a.save(), a.beginPath(), a.strokeStyle = 'rgba(168,202,255, 0.9)', a.fillStyle = 'rgba(168,202,236,0.7)', a.rect( - this.width / 2 - 3, - this.height / 2 - 3, this.width + 6, this.height + 6), a.fill(), a.stroke(), a.closePath(), a.restore())
        },
        this.paintMouseover = function (a) {
            return this.paintSelected(a)
        },
        this.isInBound = function (a, b) {
            return a > this.x && a < this.x + this.width * Math.abs(this.scaleX) && b > this.y && b < this.y + this.height * Math.abs(this.scaleY)
        },
        this.selectedHandler = function () {
            this.selected = !0,
            this.selectedLocation = {
                x: this.x,
                y: this.y
            }
        },
        this.unselectedHandler = function () {
            this.selected = !1,
            this.selectedLocation = null
        },
        this.dbclickHandler = function (a) {
            this.dispatchEvent('dbclick', a)
        },
        this.clickHandler = function (a) {
            this.dispatchEvent('click', a)
        },
        this.mousedownHander = function (a) {
            this.dispatchEvent('mousedown', a)
        },
        this.mouseupHandler = function (a) {
            this.dispatchEvent('mouseup', a)
        },
        this.mouseoverHandler = function (a) {
            this.isMouseOver = !0,
            this.dispatchEvent('mouseover', a)
        },
        this.mousemoveHandler = function (a) {
            this.dispatchEvent('mousemove', a)
        },
        this.mouseoutHandler = function (a) {
            this.isMouseOver = !1,
            this.dispatchEvent('mouseout', a)
        },
        this.mousedragHandler = function (a) {
            var b = this.selectedLocation.x + a.dx,
            c = this.selectedLocation.y + a.dy;
            this.setLocation(b, c),
            this.dispatchEvent('mousedrag', a)
        },
        this.addEventListener = function (b, c) {
            var d = this,
            e = function (a) {
                c.call(d, a)
            };
            return this.messageBus || (this.messageBus = new a.util.MessageBus),
            this.messageBus.subscribe(b, e),
            this
        },
        this.dispatchEvent = function (a, b) {
            return this.messageBus ? (this.messageBus.publish(a, b), this)  : null
        },
        this.removeEventListener = function (a) {
            this.messageBus.unsubscribe(a)
        },
        this.removeAllEventListener = function () {
            this.messageBus = new a.util.MessageBus
        };
        var b = 'click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,touchstart,touchmove,touchend'.split(','),
        d = this;
        b.forEach(function (a) {
            d[a] = function (b) {
                null != b ? this.addEventListener(a, b)  : this.dispatchEvent(a)
            }
        })
    }
    function d() {
        this.initialize = function () {
            d.prototype.initialize.apply(this, arguments),
            this.editAble = !1,
            this.selectedPoint = null
        },
        this.getCtrlPosition = function (a) {
            var b = 5,
            c = 5,
            d = this.getPosition(a);
            return {
                left: d.x - b,
                top: d.y - c,
                right: d.x + b,
                bottom: d.y + c
            }
        },
        this.selectedHandler = function (b) {
            d.prototype.selectedHandler.apply(this, arguments),
            this.selectedSize = {
                width: this.width,
                height: this.height
            },
            b.scene.mode == a.SceneMode.edit && (this.editAble = !0)
        },
        this.unselectedHandler = function () {
            d.prototype.unselectedHandler.apply(this, arguments),
            this.selectedSize = null,
            this.editAble = !1
        };
        var b = [
            'Top_Left',
            'Top_Center',
            'Top_Right',
            'Middle_Left',
            'Middle_Right',
            'Bottom_Left',
            'Bottom_Center',
            'Bottom_Right'
        ];
        this.paintCtrl = function (a) {
            var c,
            d,
            e,
            f;
            if (0 != this.editAble) {
                for (a.save(), c = 0; c < b.length; c++) d = this.getCtrlPosition(b[c]),
                d.left -= this.cx,
                d.right -= this.cx,
                d.top -= this.cy,
                d.bottom -= this.cy,
                e = d.right - d.left,
                f = d.bottom - d.top,
                a.beginPath(),
                a.strokeStyle = 'rgba(0,0,0,0.8)',
                a.rect(d.left, d.top, e, f),
                a.stroke(),
                a.closePath(),
                a.beginPath(),
                a.strokeStyle = 'rgba(255,255,255,0.3)',
                a.rect(d.left + 1, d.top + 1, e - 2, f - 2),
                a.stroke(),
                a.closePath();
                a.restore()
            }
        },
        this.isInBound = function (a, c) {
            var e,
            f;
            if (this.selectedPoint = null, 1 == this.editAble) for (e = 0; e < b.length; e++) if (f = this.getCtrlPosition(b[e]), a > f.left && a < f.right && c > f.top && c < f.bottom) return this.selectedPoint = b[e],
            !0;
            return d.prototype.isInBound.apply(this, arguments)
        },
        this.mousedragHandler = function (a) {
            var b,
            c,
            d,
            e;
            null == this.selectedPoint ? (b = this.selectedLocation.x + a.dx, c = this.selectedLocation.y + a.dy, this.setLocation(b, c), this.dispatchEvent('mousedrag', a))  : ('Top_Left' == this.selectedPoint ? (d = this.selectedSize.width - a.dx, e = this.selectedSize.height - a.dy, b = this.selectedLocation.x + a.dx, c = this.selectedLocation.y + a.dy, b < this.x + this.width && (this.x = b, this.width = d), c < this.y + this.height && (this.y = c, this.height = e))  : 'Top_Center' == this.selectedPoint ? (e = this.selectedSize.height - a.dy, c = this.selectedLocation.y + a.dy, c < this.y + this.height && (this.y = c, this.height = e))  : 'Top_Right' == this.selectedPoint ? (d = this.selectedSize.width + a.dx, c = this.selectedLocation.y + a.dy, c < this.y + this.height && (this.y = c, this.height = this.selectedSize.height - a.dy), d > 1 && (this.width = d))  : 'Middle_Left' == this.selectedPoint ? (d = this.selectedSize.width - a.dx, b = this.selectedLocation.x + a.dx, b < this.x + this.width && (this.x = b), d > 1 && (this.width = d))  : 'Middle_Right' == this.selectedPoint ? (d = this.selectedSize.width + a.dx, d > 1 && (this.width = d))  : 'Bottom_Left' == this.selectedPoint ? (d = this.selectedSize.width - a.dx, b = this.selectedLocation.x + a.dx, d > 1 && (this.x = b, this.width = d), e = this.selectedSize.height + a.dy, e > 1 && (this.height = e))  : 'Bottom_Center' == this.selectedPoint ? (e = this.selectedSize.height + a.dy, e > 1 && (this.height = e))  : 'Bottom_Right' == this.selectedPoint && (d = this.selectedSize.width + a.dx, d > 1 && (this.width = d), e = this.selectedSize.height + a.dy, e > 1 && (this.height = e)), this.dispatchEvent('resize', a))
        }
    }
    b.prototype = new a.Element,
    Object.defineProperties(b.prototype, {
        cx: {
            get: function () {
                return this.x + this.width / 2
            },
            set: function (a) {
                this.x = a - this.width / 2
            }
        },
        cy: {
            get: function () {
                return this.y + this.height / 2
            },
            set: function (a) {
                this.y = a - this.height / 2
            }
        }
    }),
    c.prototype = new b,
    d.prototype = new c,
    a.DisplayElement = b,
    a.InteractiveElement = c,
    a.EditableElement = d
}(JTopo),
function (a) {
    function b(c) {
        this.initialize = function (c) {
            b.prototype.initialize.apply(this, arguments),
            this.elementType = 'node',
            this.zIndex = a.zIndex_Node,
            this.text = c,
            this.font = '12px Consolas',
            this.fontColor = '255,255,255',
            this.borderWidth = 0,
            this.borderColor = '255,255,255',
            this.borderRadius = null,
            this.dragable = !0,
            this.textPosition = 'Bottom_Center',
            this.textOffsetX = 0,
            this.textOffsetY = 0,
            this.transformAble = !0,
            this.inLinks = null,
            this.outLinks = null;
            var d = 'text,font,fontColor,textPosition,textOffsetX,textOffsetY,borderRadius,alarmLimit,vlan,rate,label,lushu,_id,img'.split(',');
            this.serializedProperties = this.serializedProperties.concat(d)
        },
        this.initialize(c),
        this.paint = function (a) {
            this.image ? null != this.image.alarm && null != this.alarm ? a.drawImage(this.image.alarm, - this.width / 2, - this.height / 2, this.width, this.height)  : a.drawImage(this.image, - this.width / 2, - this.height / 2, this.width, this.height)  : (a.beginPath(), a.fillStyle = 'rgba(' + this.fillColor + ',' + this.alpha + ')', null == this.borderRadius || 0 == this.borderRadius ? a.rect( - this.width / 2, - this.height / 2, this.width, this.height)  : a.JTopoRoundRect( - this.width / 2, - this.height / 2, this.width, this.height, this.borderRadius), a.fill(), a.closePath()),
            this.paintText(a),
            this.paintBorder(a),
            this.paintCtrl(a),
            this.paintAlarmText(a)
        },
/*        this.paintAlarmText = function (a) {
            if (null != this.alarm && '' != this.alarm) {
                a.beginPath(),
                a.font = this.alarmFont || '12px 微软雅黑';
                a.fontColor='rgba(0,,0,)';
                var b = a.measureText(this.alarm).width + 6,
                c = a.measureText('田').width + 6,
                d = this.width / 2 - b / 2,
                e = - this.height / 2 - c - 8;
                a.strokeStyle = 'rgba(0,0,0, 0.5)',
                a.fillStyle = 'rgba(255,0,0, 0.5)',       
                a.lineCap = 'round',
                a.lineWidth = 1,
                a.moveTo(d, e),
                a.lineTo(d + b, e),
                a.lineTo(d + b, e + c),
                a.lineTo(d + b / 2 + 6, e + c),
                a.lineTo(d + b / 2, e + c + 8),
                a.lineTo(d + b / 2 - 6, e + c),
                a.lineTo(d, e + c),
                a.lineTo(d, e),
                a.fill(),
                a.stroke(),
                a.closePath(),
                a.beginPath(),
                a.strokeStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')',
                a.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')',
                a.fillText(this.alarm, d + 2, e + c - 4),
                a.closePath()
            }
        },*/
        this.paintAlarmText = function (a) {
            if (null != this.alarm && '' != this.alarm) {
                var b = this.alarmColor || '255,0,0',
                c = this.alarmAlpha || 0.5;
                a.beginPath(),
                a.font = this.alarmFont || '10px 微软雅黑';
                var d = a.measureText(this.alarm).width + 6,
                e = a.measureText('田').width + 6,
                f = this.width / 2 - d / 2,
                g = - this.height / 2 - e - 8;
                a.strokeStyle = 'rgba(' + b + ', ' + c + ')',
                a.fillStyle = 'rgba(' + b + ', ' + c + ')',
                a.lineCap = 'round',
                a.lineWidth = 1,
                a.moveTo(f, g),
                a.lineTo(f + d, g),
                a.lineTo(f + d, g + e),
                a.lineTo(f + d / 2 + 6, g + e),
                a.lineTo(f + d / 2, g + e + 8),
                a.lineTo(f + d / 2 - 6, g + e),
                a.lineTo(f, g + e),
                a.lineTo(f, g),
                a.fill(),
                a.stroke(),
                a.closePath(),
                a.beginPath(),
                /*a.strokeStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')',
                a.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')',*/
                a.strokeStyle= 'rgba(255,255,0, 1)',
                a.fillStyle= 'rgba(255,255,255, 1)',
                a.fillText(this.alarm, f + 2, g + e - 4),
                a.closePath()
            }
        },
        this.paintText = function (a) {
            var b,
            c,
            d,
            e = this.text;
            null != e && '' != e && (a.beginPath(), a.font = this.font, b = a.measureText(e).width, c = a.measureText('田').width, a.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')', d = this.getTextPostion(this.textPosition, b, c), a.fillText(e, d.x, d.y), a.closePath())
        },
        this.paintBorder = function (a) {
            if (0 != this.borderWidth) {
                a.beginPath(),
                a.lineWidth = this.borderWidth,
                a.strokeStyle = 'rgba(' + this.borderColor + ',' + this.alpha + ')';
                var b = this.borderWidth / 2;
                null == this.borderRadius || 0 == this.borderRadius ? a.rect( - this.width / 2 - b, - this.height / 2 - b, this.width + this.borderWidth, this.height + this.borderWidth)  : a.JTopoRoundRect( - this.width / 2 - b, - this.height / 2 - b, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius),
                a.stroke(),
                a.closePath()
            }
        },
        this.getTextPostion = function (a, b, c) {
            var d = null;
            return null == a || 'Bottom_Center' == a ? d = {
                x: - this.width / 2 + (this.width - b) / 2,
                y: this.height / 2 + c
            }
             : 'Top_Center' == a ? d = {
                x: - this.width / 2 + (this.width - b) / 2,
                y: - this.height / 2 - c / 2
            }
             : 'Top_Right' == a ? d = {
                x: this.width / 2,
                y: - this.height / 2 - c / 2
            }
             : 'Top_Left' == a ? d = {
                x: - this.width / 2 - b,
                y: - this.height / 2 - c / 2
            }
             : 'Bottom_Right' == a ? d = {
                x: this.width / 2,
                y: this.height / 2 + c
            }
             : 'Bottom_Left' == a ? d = {
                x: - this.width / 2 - b,
                y: this.height / 2 + c
            }
             : 'Middle_Center' == a ? d = {
                x: - this.width / 2 + (this.width - b) / 2,
                y: c / 2
            }
             : 'Middle_Right' == a ? d = {
                x: this.width / 2,
                y: c / 2
            }
             : 'Middle_Left' == a && (d = {
                x: - this.width / 2 - b,
                y: c / 2
            }),
            null != this.textOffsetX && (d.x += this.textOffsetX),
            null != this.textOffsetY && (d.y += this.textOffsetY),
            d
        },
        this.setImage = function (b, c) {
            var d,
            e;
            if (null == b) throw new Error('Node.setImage(): 参数Image对象为空!');
            d = this,
            'string' == typeof b ? (e = j[b], null == e ? (e = new Image, e.src = b, e.onload = function () {
                j[b] = e,
                1 == c && d.setSize(e.width, e.height);
                var f = a.util.genImageAlarm(e);
                f && (e.alarm = f),
                d.image = e
            })  : (c && this.setSize(e.width, e.height), this.image = e))  : (this.image = b, 1 == c && this.setSize(b.width, b.height))
        },
        this.removeHandler = function (a) {
            var b = this;
            this.outLinks && (this.outLinks.forEach(function (c) {
                c.nodeA === b && a.remove(c)
            }), this.outLinks = null),
            this.inLinks && (this.inLinks.forEach(function (c) {
                c.nodeZ === b && a.remove(c)
            }), this.inLinks = null)
        }
    }
    function c() {
        c.prototype.initialize.apply(this, arguments)
    }
    function d(a) {
        this.initialize(),
        this.text = a,
        this.elementType = 'TextNode',
        this.paint = function (a) {
            a.beginPath(),
            a.font = this.font,
            this.width = a.measureText(this.text).width,
            this.height = a.measureText('田').width,
            a.strokeStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')',
            a.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')',
            a.fillText(this.text, - this.width / 2, this.height / 2),
            a.closePath(),
            this.paintBorder(a),
            this.paintCtrl(a),
            this.paintAlarmText(a)
        }
    }
    function e(a, b, c) {
        this.initialize(),
        this.text = a,
        this.href = b,
        this.target = c,
        this.elementType = 'LinkNode',
        this.isVisited = !1,
        this.visitedColor = null,
        this.paint = function (a) {
            a.beginPath(),
            a.font = this.font,
            this.width = a.measureText(this.text).width,
            this.height = a.measureText('田').width,
            this.isVisited && null != this.visitedColor ? (a.strokeStyle = 'rgba(' + this.visitedColor + ', ' + this.alpha + ')', a.fillStyle = 'rgba(' + this.visitedColor + ', ' + this.alpha + ')')  : (a.strokeStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')', a.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')'),
            a.fillText(this.text, - this.width / 2, this.height / 2),
            this.isMouseOver && (a.moveTo( - this.width / 2, this.height), a.lineTo(this.width / 2, this.height), a.stroke()),
            a.closePath(),
            this.paintBorder(a),
            this.paintCtrl(a),
            this.paintAlarmText(a)
        },
        this.mousemove(function () {
            var a,
            b = document.getElementsByTagName('canvas');
            if (b && b.length > 0) for (a = 0; a < b.length; a++) b[a].style.cursor = 'pointer'
        }),
        this.mouseout(function () {
            var a,
            b = document.getElementsByTagName('canvas');
            if (b && b.length > 0) for (a = 0; a < b.length; a++) b[a].style.cursor = 'default'
        }),
        this.click(function () {
            '_blank' == this.target ? window.open(this.href)  : location = this.href,
            this.isVisited = !0
        })
    }
    function f(a) {
        this.initialize(arguments),
        this._radius = 20,
        this.beginDegree = 0,
        this.endDegree = 2 * Math.PI,
        this.text = a,
        this.paint = function (a) {
            a.save(),
            a.beginPath(),
            a.fillStyle = 'rgba(' + this.fillColor + ',' + this.alpha + ')',
            a.arc(0, 0, this.radius, this.beginDegree, this.endDegree, !0),
            a.fill(),
            a.closePath(),
            a.restore(),
            this.paintText(a),
            this.paintBorder(a),
            this.paintCtrl(a),
            this.paintAlarmText(a)
        },
        this.paintSelected = function (a) {
            a.save(),
            a.beginPath(),
            a.strokeStyle = 'rgba(168,202,255, 0.9)',
            a.fillStyle = 'rgba(168,202,236,0.7)',
            a.arc(0, 0, this.radius + 3, this.beginDegree, this.endDegree, !0),
            a.fill(),
            a.stroke(),
            a.closePath(),
            a.restore()
        }
    }
    function g(a, b, c) {
        var d,
        e;
        this.initialize(),
        this.frameImages = a || [],
        this.frameIndex = 0,
        this.isStop = !0,
        d = b || 1000,
        this.repeatPlay = !1,
        e = this,
        this.nextFrame = function () {
            if (!this.isStop && null != this.frameImages.length) {
                if (this.frameIndex++, this.frameIndex >= this.frameImages.length) {
                    if (!this.repeatPlay) return;
                    this.frameIndex = 0
                }
                this.setImage(this.frameImages[this.frameIndex], c),
                setTimeout(function () {
                    e.nextFrame()
                }, d / a.length)
            }
        }
    }
    function h(a, b, c, d, e) {
        var f,
        g;
        this.initialize(),
        f = this,
        this.setImage(a),
        this.frameIndex = 0,
        this.isPause = !0,
        this.repeatPlay = !1,
        g = d || 1000,
        e = e || 0,
        this.paint = function (a) {
            var b,
            d,
            f,
            g;
            this.image && (b = this.width, d = this.height, a.save(), a.beginPath(), a.fillStyle = 'rgba(' + this.fillColor + ',' + this.alpha + ')', f = (Math.floor(this.frameIndex / c) + e) * d, g = Math.floor(this.frameIndex % c) * b, a.drawImage(this.image, g, f, b, d, - b / 2, - d / 2, b, d), a.fill(), a.closePath(), a.restore(), this.paintText(a), this.paintBorder(a), this.paintCtrl(a), this.paintAlarmText(a))
        },
        this.nextFrame = function () {
            if (!this.isStop) {
                if (this.frameIndex++, this.frameIndex >= b * c) {
                    if (!this.repeatPlay) return;
                    this.frameIndex = 0
                }
                setTimeout(function () {
                    f.isStop || f.nextFrame()
                }, g / (b * c))
            }
        }
    }
    function i() {
        var a = null;
        return a = arguments.length <= 3 ? new g(arguments[0], arguments[1], arguments[2])  : new h(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]),
        a.stop = function () {
            a.isStop = !0
        },
        a.play = function () {
            a.isStop = !1,
            a.frameIndex = 0,
            a.nextFrame()
        },
        a
    }
    var j = {
    };
    b.prototype = new a.EditableElement,
    c.prototype = new b,
    d.prototype = new c,
    e.prototype = new d,
    f.prototype = new c,
    Object.defineProperties(f.prototype, {
        radius: {
            get: function () {
                return this._radius
            },
            set: function (a) {
                this._radius = a;
                var b = 2 * this.radius,
                c = 2 * this.radius;
                this.width = b,
                this.height = c
            }
        },
        width: {
            get: function () {
                return this._width
            },
            set: function (a) {
                this._radius = a / 2,
                this._width = a
            }
        },
        height: {
            get: function () {
                return this._height
            },
            set: function (a) {
                this._radius = a / 2,
                this._height = a
            }
        }
    }),
    g.prototype = new c,
    h.prototype = new c,
    i.prototype = new c,
    a.Node = c,
    a.TextNode = d,
    a.LinkNode = e,
    a.CircleNode = f,
    a.AnimateNode = i
}(JTopo),
function (a) {
    function b(a, b) {
        var c,
        d,
        e,
        f,
        g = [
        ];
        if (null == a || null == b) return g;
        if (a && b && a.outLinks && b.inLinks) for (c = 0; c < a.outLinks.length; c++) for (d = a.outLinks[c], e = 0; e < b.inLinks.length; e++) f = b.inLinks[e],
        d === f && g.push(f);
        return g
    }
    function c(a, c) {
        var d = b(a, c),
        e = b(c, a),
        f = d.concat(e);
        return f
    }
    function d(a) {
        var b = c(a.nodeA, a.nodeZ);
        return b = b.filter(function (b) {
            return a !== b
        })
    }
    function e(a, b) {
        return c(a, b).length
    }
    function f(b, c, g) {
        function h(b, c) {
            var d = a.util.lineF(b.cx, b.cy, c.cx, c.cy),
            e = b.getBound(),
            f = a.util.intersectionLineBound(d, e);
            return f
        }
        this.initialize = function (b, c, d) {
            if (f.prototype.initialize.apply(this, arguments), this.elementType = 'link', this.zIndex = a.zIndex_Link, 0 != arguments.length) {
                this.text = d,
                this.nodeA = b,
                this.nodeZ = c,
                this.nodeA && null == this.nodeA.outLinks && (this.nodeA.outLinks = [
                ]),
                this.nodeA && null == this.nodeA.inLinks && (this.nodeA.inLinks = [
                ]),
                this.nodeZ && null == this.nodeZ.inLinks && (this.nodeZ.inLinks = [
                ]),
                this.nodeZ && null == this.nodeZ.outLinks && (this.nodeZ.outLinks = [
                ]),
                null != this.nodeA && this.nodeA.outLinks.push(this),
                null != this.nodeZ && this.nodeZ.inLinks.push(this),
                this.caculateIndex(),
                this.font = '12px Consolas',
                this.fontColor = '255,255,255',
                this.lineWidth = 2,
                this.lineJoin = 'miter',
                this.transformAble = !1,
                this.bundleOffset = 20,
                this.bundleGap = 12,
                this.textOffsetX = 0,
                this.textOffsetY = 0,
                this.arrowsRadius = null,
                this.arrowsOffset = 0,
                this.dashedPattern = null,
                this.path = [
                ];
                var e = 'text,font,fontColor,lineWidth,lineJoin,_id,src_id,dest_id'.split(',');
                this.serializedProperties = this.serializedProperties.concat(e)
            }
        },
        this.caculateIndex = function () {
            var a = e(this.nodeA, this.nodeZ);
            a > 0 && (this.nodeIndex = a - 1)
        },
        this.initialize(b, c, g),
        this.removeHandler = function () {
            var a,
            b = this;
            this.nodeA && this.nodeA.outLinks && (this.nodeA.outLinks = this.nodeA.outLinks.filter(function (a) {
                return a !== b
            })),
            this.nodeZ && this.nodeZ.inLinks && (this.nodeZ.inLinks = this.nodeZ.inLinks.filter(function (a) {
                return a !== b
            })),
            a = d(this),
            a.forEach(function (a, b) {
                a.nodeIndex = b
            })
        },
        this.getStartPosition = function () {
            var a = {
                x: this.nodeA.cx,
                y: this.nodeA.cy
            };
            return a
        },
        this.getEndPosition = function () {
            var a;
            return null != this.arrowsRadius && (a = h(this.nodeZ, this.nodeA)),
            null == a && (a = {
                x: this.nodeZ.cx,
                y: this.nodeZ.cy
            }),
            a
        },
        this.getPath = function () {
            var a,
            b,
            c,
            d,
            f,
            g,
            h,
            i,
            j,
            k,
            l = [
            ],
            m = this.getStartPosition(),
            n = this.getEndPosition();
            return this.nodeA === this.nodeZ ? [
                m,
                n
            ] : (a = e(this.nodeA, this.nodeZ), 1 == a ? [
                m,
                n
            ] : (b = Math.atan2(n.y - m.y, n.x - m.x), c = {
                x: m.x + this.bundleOffset * Math.cos(b),
                y: m.y + this.bundleOffset * Math.sin(b)
            }, d = {
                x: n.x + this.bundleOffset * Math.cos(b - Math.PI),
                y: n.y + this.bundleOffset * Math.sin(b - Math.PI)
            }, f = b - Math.PI / 2, g = b - Math.PI / 2, h = a * this.bundleGap / 2 - this.bundleGap / 2, i = this.bundleGap * this.nodeIndex, j = {
                x: c.x + i * Math.cos(f),
                y: c.y + i * Math.sin(f)
            }, k = {
                x: d.x + i * Math.cos(g),
                y: d.y + i * Math.sin(g)
            }, j = {
                x: j.x + h * Math.cos(f - Math.PI),
                y: j.y + h * Math.sin(f - Math.PI)
            }, k = {
                x: k.x + h * Math.cos(g - Math.PI),
                y: k.y + h * Math.sin(g - Math.PI)
            }, l.push({
                x: m.x,
                y: m.y
            }), l.push({
                x: j.x,
                y: j.y
            }), l.push({
                x: k.x,
                y: k.y
            }), l.push({
                x: n.x,
                y: n.y
            }), l))
        },
        this.paintPath = function (a, b) {
            var c,
            d,
            e;
            if (this.nodeA === this.nodeZ) return void this.paintLoop(a);
            for (a.beginPath(), a.moveTo(b[0].x, b[0].y), c = 1; c < b.length; c++) null == this.dashedPattern ? a.lineTo(b[c].x, b[c].y)  : a.JTopoDashedLineTo(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, this.dashedPattern);
            a.stroke(),
            a.closePath(),
            null != this.arrowsRadius && (d = b[b.length - 2], e = b[b.length - 1], this.paintArrow(a, d, e))
        },
        this.paintLoop = function (a) {
            a.beginPath();
            var b = this.bundleGap * (this.nodeIndex + 1) / 2;
            Math.PI + Math.PI / 2,
            a.arc(this.nodeA.x, this.nodeA.y, b, Math.PI / 2, 2 * Math.PI),
            a.stroke(),
            a.closePath()
        },
        this.paintArrow = function (b, c, d) {
            var e,
            f,
            g = this.arrowsOffset,
            h = this.arrowsRadius / 2,
            i = c,
            j = d,
            k = Math.atan2(j.y - i.y, j.x - i.x),
            l = a.util.getDistance(i, j) - this.arrowsRadius,
            m = i.x + (l + g) * Math.cos(k),
            n = i.y + (l + g) * Math.sin(k),
            o = j.x + g * Math.cos(k),
            p = j.y + g * Math.sin(k);
            k -= Math.PI / 2,
            e = {
                x: m + h * Math.cos(k),
                y: n + h * Math.sin(k)
            },
            f = {
                x: m + h * Math.cos(k - Math.PI),
                y: n + h * Math.sin(k - Math.PI)
            },
            b.beginPath(),
            b.fillStyle = 'rgba(' + this.strokeColor + ',' + this.alpha + ')',
            b.moveTo(e.x, e.y),
            b.lineTo(o, p),
            b.lineTo(f.x, f.y),
            b.stroke(),
            b.closePath()
        },
        this.paint = function (a) {
            if (null != this.nodeA && null != !this.nodeZ) {
                var b = this.getPath(this.nodeIndex);
                this.path = b,
                a.strokeStyle = 'rgba(' + this.strokeColor + ',' + this.alpha + ')',
                a.lineWidth = this.lineWidth,
                this.paintPath(a, b),
                b && b.length > 0 && this.paintText(a, b)
            }
        };
        var i = - (Math.PI / 2 + Math.PI / 4);
        this.paintText = function (a, b) {
            var c,
            d,
            e,
            f,
            g,
            h = b[0],
            j = b[b.length - 1];
            4 == b.length && (h = b[1], j = b[2]),
            this.text && this.text.length > 0 && (c = (j.x + h.x) / 2 + this.textOffsetX, d = (j.y + h.y) / 2 + this.textOffsetY, a.save(), a.beginPath(), a.font = this.font, e = a.measureText(this.text).width, f = a.measureText('田').width, a.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')', this.nodeA === this.nodeZ ? (g = this.bundleGap * (this.nodeIndex + 1) / 2, c = this.nodeA.x + g * Math.cos(i), d = this.nodeA.y + g * Math.sin(i), a.fillText(this.text, c, d))  : a.fillText(this.text, c - e / 2, d - f / 2), a.stroke(), a.closePath(), a.restore())
        },
        this.paintSelected = function (a) {
            a.shadowBlur = 10,
            a.shadowColor = 'rgba(0,0,0,1)',
            a.shadowOffsetX = 0,
            a.shadowOffsetY = 0
        },
        this.isInBound = function (b, c) {
            var d,
            e,
            f,
            g,
            h,
            i;
            if (this.nodeA === this.nodeZ) return d = this.bundleGap * (this.nodeIndex + 1) / 2,
            e = a.util.getDistance(this.nodeA, {
                x: b,
                y: c
            }) - d,
            Math.abs(e) <= 3;
            for (f = !1, g = 1; g < this.path.length; g++) if (h = this.path[g - 1], i = this.path[g], 1 == a.util.isPointInLine({
                x: b,
                y: c
            }, h, i)) {
                f = !0;
                break
            }
            return f
        }
    }
    function g(a, b, c) {
        this.initialize = function () {
            g.prototype.initialize.apply(this, arguments),
            this.direction = 'horizontal'
        },
        this.initialize(a, b, c),
        this.getStartPosition = function () {
            var a = {
                x: this.nodeA.cx,
                y: this.nodeA.cy
            };
            return 'horizontal' == this.direction ? this.nodeZ.cx > a.x ? a.x += this.nodeA.width / 2 : a.x -= this.nodeA.width / 2 : this.nodeZ.cy > a.y ? a.y += this.nodeA.height / 2 : a.y -= this.nodeA.height / 2,
            a
        },
        this.getEndPosition = function () {
            var a = {
                x: this.nodeZ.cx,
                y: this.nodeZ.cy
            };
            return 'horizontal' == this.direction ? this.nodeA.cy < a.y ? a.y -= this.nodeZ.height / 2 : a.y += this.nodeZ.height / 2 : a.x = this.nodeA.cx < a.x ? this.nodeZ.x : this.nodeZ.x + this.nodeZ.width,
            a
        },
        this.getPath = function (a) {
            var b,
            c,
            d,
            f,
            g,
            h = [
            ],
            i = this.getStartPosition(),
            j = this.getEndPosition();
            return this.nodeA === this.nodeZ ? [
                i,
                j
            ] : (d = e(this.nodeA, this.nodeZ), f = (d - 1) * this.bundleGap, g = this.bundleGap * a - f / 2, 'horizontal' == this.direction ? (b = j.x + g, c = i.y - g, h.push({
                x: i.x,
                y: c
            }), h.push({
                x: b,
                y: c
            }), h.push({
                x: b,
                y: j.y
            }))  : (b = i.x + g, c = j.y - g, h.push({
                x: b,
                y: i.y
            }), h.push({
                x: b,
                y: c
            }), h.push({
                x: j.x,
                y: c
            })), h)
        },
        this.paintText = function (a, b) {
            var c,
            d,
            e,
            f,
            g;
            this.text && this.text.length > 0 && (c = b[1], d = c.x + this.textOffsetX, e = c.y + this.textOffsetY, a.save(), a.beginPath(), a.font = this.font, f = a.measureText(this.text).width, g = a.measureText('田').width, a.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')', a.fillText(this.text, d - f / 2, e - g / 2), a.stroke(), a.closePath(), a.restore())
        }
    }
    function h(a, b, c) {
        this.initialize = function () {
            h.prototype.initialize.apply(this, arguments),
            this.direction = 'vertical',
            this.offsetGap = 44
        },
        this.initialize(a, b, c),
        this.getStartPosition = function () {
            var a = {
                x: this.nodeA.cx,
                y: this.nodeA.cy
            };
            return 'horizontal' == this.direction ? a.x = this.nodeZ.cx < a.x ? this.nodeA.x : this.nodeA.x + this.nodeA.width : a.y = this.nodeZ.cy < a.y ? this.nodeA.y : this.nodeA.y + this.nodeA.height,
            a
        },
        this.getEndPosition = function () {
            var a = {
                x: this.nodeZ.cx,
                y: this.nodeZ.cy
            };
            return 'horizontal' == this.direction ? a.x = this.nodeA.cx < a.x ? this.nodeZ.x : this.nodeZ.x + this.nodeZ.width : a.y = this.nodeA.cy < a.y ? this.nodeZ.y : this.nodeZ.y + this.nodeZ.height,
            a
        },
        this.getPath = function (a) {
            var b,
            c,
            d,
            f,
            g,
            h = this.getStartPosition(),
            i = this.getEndPosition();
            return this.nodeA === this.nodeZ ? [
                h,
                i
            ] : (b = [
            ], c = e(this.nodeA, this.nodeZ), d = (c - 1) * this.bundleGap, f = this.bundleGap * a - d / 2, g = this.offsetGap, 'horizontal' == this.direction ? (this.nodeA.cx > this.nodeZ.cx && (g = - g), b.push({
                x: h.x,
                y: h.y + f
            }), b.push({
                x: h.x + g,
                y: h.y + f
            }), b.push({
                x: i.x - g,
                y: i.y + f
            }), b.push({
                x: i.x,
                y: i.y + f
            }))  : (this.nodeA.cy > this.nodeZ.cy && (g = - g), b.push({
                x: h.x + f,
                y: h.y
            }), b.push({
                x: h.x + f,
                y: h.y + g
            }), b.push({
                x: i.x + f,
                y: i.y - g
            }), b.push({
                x: i.x + f,
                y: i.y
            })), b)
        }
    }
    function i(a, b, c) {
        this.initialize = function () {
            i.prototype.initialize.apply(this, arguments)
        },
        this.initialize(a, b, c),
        this.paintPath = function (a, b) {
            var c,
            d,
            e,
            f,
            g,
            h,
            i;
            if (this.nodeA === this.nodeZ) return void this.paintLoop(a);
            for (a.beginPath(), a.moveTo(b[0].x, b[0].y), c = 1; c < b.length; c++) d = b[c - 1],
            e = b[c],
            f = (d.x + e.x) / 2,
            g = (d.y + e.y) / 2,
            g += (e.y - d.y) / 2,
            a.strokeStyle = 'rgba(' + this.strokeColor + ',' + this.alpha + ')',
            a.lineWidth = this.lineWidth,
            a.moveTo(d.x, d.cy),
            a.quadraticCurveTo(f, g, e.x, e.y),
            a.stroke();
            a.stroke(),
            a.closePath(),
            null != this.arrowsRadius && (h = b[b.length - 2], i = b[b.length - 1], this.paintArrow(a, h, i))
        }
    }
    f.prototype = new a.InteractiveElement,
    g.prototype = new f,
    h.prototype = new f,
    i.prototype = new f,
    a.Link = f,
    a.FoldLink = g,
    a.FlexionalLink = h,
    a.CurveLink = i
}(JTopo),
function (a) {
    function b(c) {
        this.initialize = function (c) {
            b.prototype.initialize.apply(this, null),
            this.elementType = 'container',
            this.zIndex = a.zIndex_Container,
            this.width = 100,
            this.height = 100,
            this.childs = [
            ],
            this.alpha = 0.5,
            this.dragable = !0,
            this.childDragble = !0,
            this.visible = !0,
            this.fillColor = '10,100,80',
            this.borderWidth = 0,
            this.borderColor = '255,255,255',
            this.borderRadius = null,
            this.font = '12px Consolas',
            this.fontColor = '255,255,255',
            this.text = c,
            this.textPosition = 'Bottom_Center',
            this.textOffsetX = 0,
            this.textOffsetY = 0,
            this.layout = new a.layout.AutoBoundLayout
        },
        this.initialize(c),
        this.add = function (a) {
            this.childs.push(a),
            a.dragable = this.childDragble
        },
        this.remove = function (a) {
            for (var b = 0; b < this.childs.length; b++) if (this.childs[b] === a) {
                a.parentContainer = null,
                this.childs = this.childs.del(b),
                a.lastParentContainer = this;
                break
            }
        },
        this.removeAll = function () {
            this.childs = [
            ]
        },
        this.setLocation = function (a, b) {
            var c,
            d,
            e = a - this.x,
            f = b - this.y;
            for (this.x = a, this.y = b, c = 0; c < this.childs.length; c++) d = this.childs[c],
            d.setLocation(d.x + e, d.y + f)
        },
        this.doLayout = function (a) {
            a && a(this, this.childs)
        },
        this.paint = function (a) {
            this.visible && (this.layout && this.layout(this, this.childs), a.beginPath(), a.fillStyle = 'rgba(' + this.fillColor + ',' + this.alpha + ')', null == this.borderRadius || 0 == this.borderRadius ? a.rect(this.x, this.y, this.width, this.height)  : a.JTopoRoundRect(this.x, this.y, this.width, this.height, this.borderRadius), a.fill(), a.closePath(), this.paintText(a), this.paintBorder(a))
        },
        this.paintBorder = function (a) {
            if (0 != this.borderWidth) {
                a.beginPath(),
                a.lineWidth = this.borderWidth,
                a.strokeStyle = 'rgba(' + this.borderColor + ',' + this.alpha + ')';
                var b = this.borderWidth / 2;
                null == this.borderRadius || 0 == this.borderRadius ? a.rect(this.x - b, this.y - b, this.width + this.borderWidth, this.height + this.borderWidth)  : a.JTopoRoundRect(this.x - b, this.y - b, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius),
                a.stroke(),
                a.closePath()
            }
        },
        this.paintText = function (a) {
            var b,
            c,
            d,
            e = this.text;
            null != e && '' != e && (a.beginPath(), a.font = this.font, b = a.measureText(e).width, c = a.measureText('田').width, a.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')', d = this.getTextPostion(this.textPosition, b, c), a.fillText(e, d.x, d.y), a.closePath())
        },
        this.getTextPostion = function (a, b, c) {
            var d = null;
            return null == a || 'Bottom_Center' == a ? d = {
                x: this.x + this.width / 2 - b / 2,
                y: this.y + this.height + c
            }
             : 'Top_Center' == a ? d = {
                x: this.x + this.width / 2 - b / 2,
                y: this.y - c / 2
            }
             : 'Top_Right' == a ? d = {
                x: this.x + this.width - b,
                y: this.y - c / 2
            }
             : 'Top_Left' == a ? d = {
                x: this.x,
                y: this.y - c / 2
            }
             : 'Bottom_Right' == a ? d = {
                x: this.x + this.width - b,
                y: this.y + this.height + c
            }
             : 'Bottom_Left' == a ? d = {
                x: this.x,
                y: this.y + this.height + c
            }
             : 'Middle_Center' == a ? d = {
                x: this.x + this.width / 2 - b / 2,
                y: this.y + this.height / 2 + c / 2
            }
             : 'Middle_Right' == a ? d = {
                x: this.x + this.width - b,
                y: this.y + this.height / 2 + c / 2
            }
             : 'Middle_Left' == a && (d = {
                x: this.x,
                y: this.y + this.height / 2 + c / 2
            }),
            null != this.textOffsetX && (d.x += this.textOffsetX),
            null != this.textOffsetY && (d.y += this.textOffsetY),
            d
        },
        this.paintMouseover = function () {
        },
        this.paintSelected = function (a) {
            a.shadowBlur = 10,
            a.shadowColor = 'rgba(0,0,0,1)',
            a.shadowOffsetX = 0,
            a.shadowOffsetY = 0
        }
    }
    b.prototype = new a.InteractiveElement,
    a.Container = b
}(JTopo),
function (a) {
    function b(a) {
        var b,
        c = 0,
        d = 0;
        return a.forEach(function (a) {
            c += a.cx,
            d += a.cy
        }),
        b = {
            x: c / a.length,
            y: d / a.length
        }
    }
    function c(c, d) {
        var e,
        f,
        g,
        h,
        i,
        j,
        k,
        l,
        m,
        n,
        o,
        p,
        q,
        r,
        s,
        t,
        u,
        v;
        return null == d && (d = {
        }),
        e = d.cx,
        f = d.cy,
        g = d.minRadius,
        h = d.nodeDiameter,
        i = d.hScale || 1,
        j = d.vScale || 1,
        d.beginAngle || 0,
        d.endAngle || 2 * Math.PI,
        (null == e || null == f) && (k = b(c), e = k.x, f = k.y),
        l = 0,
        m = [
        ],
        n = [
        ],
        c.forEach(function (a) {
            null == d.nodeDiameter ? (a.diameter && (h = a.diameter), h = a.radius ? 2 * a.radius : Math.sqrt(2 * a.width * a.height), n.push(h))  : n.push(h),
            l += h
        }),
        c.forEach(function (a, b) {
            var c = n[b] / l;
            m.push(Math.PI * c)
        }),
        c.length,
        o = m[0] + m[1],
        p = n[0] / 2 + n[1] / 2,
        q = p / 2 / Math.sin(o / 2),
        null != g && g > q && (q = g),
        r = q * i,
        s = q * j,
        t = d.animate,
        t ? (u = t.time || 1000, v = 0, c.forEach(function (b, c) {
            v += 0 == c ? m[c] : m[c - 1] + m[c];
            var d = e + Math.cos(v) * r,
            g = f + Math.sin(v) * s;
            a.Animate.stepByStep(b, {
                x: d - b.width / 2,
                y: g - b.height / 2
            }, u).start()
        }))  : (v = 0, c.forEach(function (a, b) {
            v += 0 == b ? m[b] : m[b - 1] + m[b];
            var c = e + Math.cos(v) * r,
            d = f + Math.sin(v) * s;
            a.cx = c,
            a.cy = d
        })),
        {
            cx: e,
            cy: f,
            radius: r,
            radiusA: r,
            radiusB: s
        }
    }
    function d(a, b) {
        return function (c) {
            var d,
            e,
            f,
            g,
            h,
            i,
            j,
            k,
            l,
            m,
            n = c.childs;
            if (!(n.length <= 0)) for (d = c.getBound(), e = n[0], f = (d.width - e.width) / b, g = (d.height - e.height) / a, n.length, h = 0, i = 0; a > i; i++) for (j = 0; b > j; j++) if (k = n[h++], l = d.left + f / 2 + j * f, m = d.top + g / 2 + i * g, k.setLocation(l, m), h >= n.length) return
        }
    }
    function e(a, b) {
        return null == a && (a = 0),
        null == b && (b = 0),
        function (c) {
            var d,
            e,
            f,
            g,
            h,
            i = c.childs;
            if (!(i.length <= 0)) for (d = c.getBound(), e = d.left, f = d.top, g = 0; g < i.length; g++) h = i[g],
            e + h.width >= d.right && (e = d.left, f += b + h.height),
            h.setLocation(e, f),
            e += a + h.width
        }
    }
    function f() {
        return function (a, b) {
            var c,
            d,
            e,
            f,
            g,
            h,
            i,
            j;
            if (b.length > 0) {
                for (c = 10000000, d = - 10000000, e = 10000000, f = - 10000000, g = d - c, h = f - e, i = 0; i < b.length; i++) j = b[i],
                j.x <= c && (c = j.x),
                j.x >= d && (d = j.x),
                j.y <= e && (e = j.y),
                j.y >= f && (f = j.y),
                g = d - c + j.width,
                h = f - e + j.height;
                a.x = c,
                a.y = e,
                a.width = g,
                a.height = h
            }
        }
    }
    function g(b) {
        var c = [
        ],
        d = b.filter(function (b) {
            return b instanceof a.Link ? !0 : (c.push(b), !1)
        });
        return b = c.filter(function (a) {
            for (var b = 0; b < d.length; b++) if (d[b].nodeZ === a) return !1;
            return !0
        }),
        b = b.filter(function (a) {
            for (var b = 0; b < d.length; b++) if (d[b].nodeA === a) return !0;
            return !1
        })
    }
    function h(a) {
        var b = 0,
        c = 0;
        return a.forEach(function (a) {
            b += a.width,
            c += a.height
        }),
        {
            width: b / a.length,
            height: c / a.length
        }
    }
    function i(a, b, c, d) {
        b.x += c,
        b.y += d;
        for (var e = q(a, b), f = 0; f < e.length; f++) i(a, e[f], c, d)
    }
    function j(a, b) {
        function c(b, e) {
            var f,
            g = q(a, b);
            for (null == d[e] && (d[e] = {
            }, d[e].nodes = [
            ], d[e].childs = [
            ]), d[e].nodes.push(b), d[e].childs.push(g), f = 0; f < g.length; f++) c(g[f], e + 1),
            g[f].parent = b
        }
        var d = [
        ];
        return c(b, 0),
        d
    }
    function k(b, c, d) {
        return function (e) {
            function f(f, g) {
                var h,
                k,
                l,
                m,
                n,
                o,
                p,
                q,
                r,
                s,
                t,
                u,
                v,
                w,
                x,
                y,
                z;
                for (h = a.layout.getTreeDeep(f, g), k = j(f, g), l = k['' + h].nodes, m = 0; m < l.length; m++) n = l[m],
                o = (m + 1) * (c + 10),
                p = h * d,
                'down' == b || ('up' == b ? p = - p : 'left' == b ? (o = - h * d, p = (m + 1) * (c + 10))  : 'right' == b && (o = h * d, p = (m + 1) * (c + 10))),
                n.setLocation(o, p);
                for (q = h - 1; q >= 0; q--) for (r = k['' + q].nodes, s = k['' + q].childs, m = 0; m < r.length; m++) if (t = r[m], u = s[m], 'down' == b ? t.y = q * d : 'up' == b ? t.y = - q * d : 'left' == b ? t.x = - q * d : 'right' == b && (t.x = q * d), u.length > 0 ? 'down' == b || 'up' == b ? t.x = (u[0].x + u[u.length - 1].x) / 2 : ('left' == b || 'right' == b) && (t.y = (u[0].y + u[u.length - 1].y) / 2)  : m > 0 && ('down' == b || 'up' == b ? t.x = r[m - 1].x + r[m - 1].width + c : ('left' == b || 'right' == b) && (t.y = r[m - 1].y + r[m - 1].height + c)), m > 0) if ('down' == b || 'up' == b) {
                    if (t.x < r[m - 1].x + r[m - 1].width) for (v = r[m - 1].x + r[m - 1].width + c, w = Math.abs(v - t.x), x = m; x < r.length; x++) i(e.childs, r[x], w, 0)
                } else if (('left' == b || 'right' == b) && t.y < r[m - 1].y + r[m - 1].height) for (y = r[m - 1].y + r[m - 1].height + c, z = Math.abs(y - t.y), x = m; x < r.length; x++) i(e.childs, r[x], 0, z)
            }
            var g,
            k,
            l,
            m,
            n,
            o = null;
            null == c && (o = h(e.childs), c = o.width, ('left' == b || 'right' == b) && (c = o.width + 10)),
            null == d && (null == o && (o = h(e.childs)), d = 2 * o.height),
            null == b && (b = 'down'),
            g = a.layout.getRootNodes(e.childs),
            g.length > 0 && (f(e.childs, g[0]), k = a.util.getElementsBound(e.childs), l = e.getCenterLocation(), m = l.x - (k.left + k.right) / 2, n = l.y - (k.top + k.bottom) / 2, e.childs.forEach(function (b) {
                b instanceof a.Node && (b.x += m, b.y += n)
            }))
        }
    }
    function l(b) {
        return function (c) {
            function d(a, c, e) {
                var f,
                g = q(a, c);
                0 != g.length && (null == e && (e = b), f = 2 * Math.PI / g.length, g.forEach(function (b, g) {
                    var h,
                    i = c.x + e * Math.cos(f * g),
                    j = c.y + e * Math.sin(f * g);
                    b.setLocation(i, j),
                    h = e / 2,
                    d(a, b, h)
                }))
            }
            var e,
            f,
            g,
            h,
            i = a.layout.getRootNodes(c.childs);
            i.length > 0 && (d(c.childs, i[0]), e = a.util.getElementsBound(c.childs), f = c.getCenterLocation(), g = f.x - (e.left + e.right) / 2, h = f.y - (e.top + e.bottom) / 2, c.childs.forEach(function (b) {
                b instanceof a.Node && (b.x += g, b.y += h)
            }))
        }
    }
    function m(a, b, c, d, e, f) {
        var g,
        h,
        i;
        for (g = [
        ], h = 0; c > h; h++) for (i = 0; d > i; i++) g.push({
            x: a + i * e,
            y: b + h * f
        });
        return g
    }
    function n(a, b, c, d, e, f) {
        var g,
        h,
        i,
        j = e ? e : 0,
        k = f ? f : 2 * Math.PI,
        l = k - j,
        m = l / c,
        n = [
        ];
        for (j += m / 2, g = j; k >= g; g += m) h = a + Math.cos(g) * d,
        i = b + Math.sin(g) * d,
        n.push({
            x: h,
            y: i
        });
        return n
    }
    function o(a, b, c, d, e, f) {
        var g,
        h,
        i = f || 'bottom',
        j = [
        ];
        if ('bottom' == i) for (g = a - c / 2 * d + d / 2, h = 0; c >= h; h++) j.push({
            x: g + h * d,
            y: b + e
        });
         else if ('top' == i) for (g = a - c / 2 * d + d / 2, h = 0; c >= h; h++) j.push({
            x: g + h * d,
            y: b - e
        });
         else if ('right' == i) for (g = b - c / 2 * d + d / 2, h = 0; c >= h; h++) j.push({
            x: a + e,
            y: g + h * d
        });
         else if ('left' == i) for (g = b - c / 2 * d + d / 2, h = 0; c >= h; h++) j.push({
            x: a - e,
            y: g + h * d
        });
        return j
    }
    function m(a, b, c, d, e, f) {
        var g,
        h,
        i;
        for (g = [
        ], h = 0; c > h; h++) for (i = 0; d > i; i++) g.push({
            x: a + i * e,
            y: b + h * f
        });
        return g
    }
    function p(a, b) {
        var c,
        d,
        e,
        f,
        g,
        h,
        i,
        j;
        if (a.layout) {
            if (c = a.layout, d = c.type, e = null, 'circle' == d) f = c.radius || Math.max(a.width, a.height),
            e = n(a.cx, a.cy, b.length, f, a.layout.beginAngle, a.layout.endAngle);
             else if ('tree' == d) g = c.width || 50,
            h = c.height || 50,
            i = c.direction,
            e = o(a.cx, a.cy, b.length, g, h, i);
             else {
                if ('grid' != d) return;
                e = m(a.x, a.y, c.rows, c.cols, c.horizontal || 0, c.vertical || 0)
            }
            for (j = 0; j < b.length; j++) b[j].setCenterLocation(e[j].x, e[j].y)
        }
    }
    function q(b, c) {
        for (var d = [
        ], e = 0; e < b.length; e++) b[e] instanceof a.Link && b[e].nodeA === c && d.push(b[e].nodeZ);
        return d
    }
    function r(a, b, c) {
        var d,
        e = q(a.childs, b);
        if (0 == e.length) return null;
        if (p(b, e), 1 == c) for (d = 0; d < e.length; d++) r(a, e[d], c);
        return null
    }
    function s(b, c) {
        function d(a, b) {
            var c = a.x - b.x,
            d = a.y - b.y;
            i += c * f,
            j += d * f,
            i *= g,
            j *= g,
            j += h,
            b.x += i,
            b.y += j
        }
        function e() {
            if (!(++k > 150)) {
                for (var a = 0; a < l.length; a++) l[a] != b && d(b, l[a], l);
                setTimeout(e, 1000 / 24)
            }
        }
        var f = 0.01,
        g = 0.95,
        h = - 5,
        i = 0,
        j = 0,
        k = 0,
        l = c.getElementsByClass(a.Node);
        e()
    }
    function t(a, b) {
        function c(a, b, e) {
            var f,
            g = q(a, b);
            for (e > d && (d = e), f = 0; f < g.length; f++) c(a, g[f], e + 1)
        }
        var d = 0;
        return c(a, b, 0),
        d
    }
    a.layout = a.Layout = {
        layoutNode: r,
        getNodeChilds: q,
        adjustPosition: p,
        springLayout: s,
        getTreeDeep: t,
        getRootNodes: g,
        GridLayout: d,
        FlowLayout: e,
        AutoBoundLayout: f,
        CircleLayout: l,
        TreeLayout: k,
        getNodesCenter: b,
        circleLayoutNodes: c
    }
}(JTopo),
function (a) {
    function b() {
        var b = new a.CircleNode;
        return b.radius = 150,
        b.colors = [
            '#3666B0',
            '#2CA8E0',
            '#77D1F6'
        ],
        b.datas = [
            0.3,
            0.3,
            0.4
        ],
        b.titles = [
            'A',
            'B',
            'C'
        ],
        b.paint = function (a) {
            var c,
            d,
            e,
            f,
            g,
            h,
            i,
            j,
            k = 2 * b.radius,
            l = 2 * b.radius;
            for (b.width = k, b.height = l, c = 0, d = 0; d < this.datas.length; d++) e = 2 * this.datas[d] * Math.PI,
            a.save(),
            a.beginPath(),
            a.fillStyle = b.colors[d],
            a.moveTo(0, 0),
            a.arc(0, 0, this.radius, c, c + e, !1),
            a.fill(),
            a.closePath(),
            a.restore(),
            a.beginPath(),
            a.font = this.font,
            f = this.titles[d] + ': ' + (100 * this.datas[d]).toFixed(2) + '%',
            g = a.measureText(f).width,
            a.measureText('田').width,
            h = (c + c + e) / 2,
            i = this.radius * Math.cos(h),
            j = this.radius * Math.sin(h),
            h > Math.PI / 2 && h <= Math.PI ? i -= g : h > Math.PI && h < 6 * Math.PI / 4 ? i -= g : h > 1.5 * Math.PI,
            a.fillStyle = '#FFFFFF',
            a.fillText(f, i, j),
            a.moveTo(this.radius * Math.cos(h), this.radius * Math.sin(h)),
            h > Math.PI / 2 && h < 6 * Math.PI / 4 && (i -= g),
            h > Math.PI,
            a.fill(),
            a.stroke(),
            a.closePath(),
            c += e
        },
        b
    }
    function c() {
        var b = new a.Node;
        return b.showSelected = !1,
        b.width = 250,
        b.height = 180,
        b.colors = [
            '#3666B0',
            '#2CA8E0',
            '#77D1F6'
        ],
        b.datas = [
            0.3,
            0.3,
            0.4
        ],
        b.titles = [
            'A',
            'B',
            'C'
        ],
        b.paint = function (a) {
            var c,
            d,
            e,
            f,
            g,
            h,
            i,
            j = 3,
            k = (this.width - j) / this.datas.length;
            for (a.save(), a.beginPath(), a.fillStyle = '#FFFFFF', a.strokeStyle = '#FFFFFF', a.moveTo( - this.width / 2 - 1, - this.height / 2), a.lineTo( - this.width / 2 - 1, this.height / 2 + 3), a.lineTo(this.width / 2 + j + 1, this.height / 2 + 3), a.stroke(), a.closePath(), a.restore(), c = 0; c < this.datas.length; c++) a.save(),
            a.beginPath(),
            a.fillStyle = b.colors[c],
            d = this.datas[c],
            e = c * (k + j) - this.width / 2,
            f = this.height - d - this.height / 2,
            a.fillRect(e, f, k, d),
            g = '' + parseInt(this.datas[c]),
            h = a.measureText(g).width,
            i = a.measureText('田').width,
            a.fillStyle = '#FFFFFF',
            a.fillText(g, e + (k - h) / 2, f - i),
            a.fillText(this.titles[c], e + (k - h) / 2, this.height / 2 + i),
            a.fill(),
            a.closePath(),
            a.restore()
        },
        b
    }
    a.BarChartNode = c,
    a.PieChartNode = b
}(JTopo),
function (a) {
    function b(b, c) {
        var d,
        e = null;
        return {
            stop: function () {
                return d ? (window.clearInterval(d), e && e.publish('stop'), this)  : this
            },
            start: function () {
                var a = this;
                return d = setInterval(function () {
                    b.call(a)
                }, c),
                this
            },
            onStop: function (b) {
                return null == e && (e = new a.util.MessageBus),
                e.subscribe('stop', b),
                this
            }
        }
    }
    function c(a, c) {
        c = c || {
        };
        var d = c.gravity || 0.1,
        e = c.dx || 0,
        f = c.dy || 5,
        g = c.stop,
        h = c.interval || 30,
        i = new b(function () {
            g && g() ? (f = 0.5, this.stop())  : (f += d, a.setLocation(a.x + e, a.y + f))
        }, h);
        return i
    }
    function d(a, c, d, e, f) {
        var g,
        h,
        i,
        j,
        k = 1000 / 24,
        l = {
        };
        for (g in c) h = c[g],
        i = h - a[g],
        l[g] = {
            oldValue: a[g],
            targetValue: h,
            step: i / d * k,
            isDone: function (b) {
                var c = this.step > 0 && a[b] >= this.targetValue || this.step < 0 && a[b] <= this.targetValue;
                return c
            }
        };
        return j = new b(function () {
            var b,
            d,
            g = !0;
            for (b in c) l[b].isDone(b) || (a[b] += l[b].step, g = !1);
            if (g) {
                if (!e) return this.stop();
                for (b in c) f ? (d = l[b].targetValue, l[b].targetValue = l[b].oldValue, l[b].oldValue = d, l[b].step = - l[b].step)  : a[b] = l[b].oldValue
            }
            return this
        }, k)
    }
    function e(a) {
        null == a && (a = {
        });
        var b = a.spring || 0.1,
        c = a.friction || 0.8,
        d = a.grivity || 0,
        e = (a.wind || 0, a.minLength || 0);
        return {
            items: [
            ],
            timer: null,
            isPause: !1,
            addNode: function (a, b) {
                var c = {
                    node: a,
                    target: b,
                    vx: 0,
                    vy: 0
                };
                return this.items.push(c),
                this
            },
            play: function (a) {
                this.stop(),
                a = null == a ? 1000 / 24 : a;
                var b = this;
                this.timer = setInterval(function () {
                    b.nextFrame()
                }, a)
            },
            stop: function () {
                null != this.timer && window.clearInterval(this.timer)
            },
            nextFrame: function () {
                var a,
                f,
                g,
                h,
                i,
                j,
                k,
                l,
                m,
                n,
                o;
                for (a = 0; a < this.items.length; a++) f = this.items[a],
                g = f.node,
                h = f.target,
                i = f.vx,
                j = f.vy,
                k = h.x - g.x,
                l = h.y - g.y,
                m = Math.atan2(l, k),
                0 != e ? (n = h.x - Math.cos(m) * e, o = h.y - Math.sin(m) * e, i += (n - g.x) * b, j += (o - g.y) * b)  : (i += k * b, j += l * b),
                i *= c,
                j *= c,
                j += d,
                g.x += i,
                g.y += j,
                f.vx = i,
                f.vy = j
            }
        }
    }
    function f(a, b) {
        function c() {
            return e = setInterval(function () {
                return o ? void f.stop()  : (a.rotate += g || 0.2, void (a.rotate > 2 * Math.PI && (a.rotate = 0)))
            }, 100),
            f
        }
        function d() {
            return window.clearInterval(e),
            f.onStop && f.onStop(a),
            f
        }
        var e = (b.context, null),
        f = {
        },
        g = b.v;
        return f.run = c,
        f.stop = d,
        f.onStop = function (a) {
            return f.onStop = a,
            f
        },
        f
    }
    function g(a, b) {
        function c() {
            return window.clearInterval(g),
            h.onStop && h.onStop(a),
            h
        }
        function d() {
            var d = b.dx || 0,
            i = b.dy || 2;
            return g = setInterval(function () {
                return o ? void h.stop()  : (i += f, void (a.y + a.height < e.stage.canvas.height ? a.setLocation(a.x + d, a.y + i)  : (i = 0, c())))
            }, 20),
            h
        }
        var e = b.context,
        f = b.gravity || 0.1,
        g = null,
        h = {
        };
        return h.run = d,
        h.stop = c,
        h.onStop = function (a) {
            return h.onStop = a,
            h
        },
        h
    }
    function h(b, c) {
        function d(c, d, e, f, g) {
            var h = new a.Node;
            return h.setImage(b.image),
            h.setSize(b.width, b.height),
            h.setLocation(c, d),
            h.showSelected = !1,
            h.dragable = !1,
            h.paint = function (a) {
                a.save(),
                a.arc(0, 0, e, f, g),
                a.clip(),
                a.beginPath(),
                null != this.image ? a.drawImage(this.image, - this.width / 2, - this.height / 2)  : (a.fillStyle = 'rgba(' + this.style.fillStyle + ',' + this.alpha + ')', a.rect( - this.width / 2, - this.height / 2, this.width / 2, this.height / 2), a.fill()),
                a.closePath(),
                a.restore()
            },
            h
        }
        function e(c, e) {
            var f = c,
            g = c + Math.PI,
            h = d(b.x, b.y, b.width, f, g),
            j = d(b.x - 2 + 4 * Math.random(), b.y, b.width, f + Math.PI, f);
            b.visible = !1,
            e.add(h),
            e.add(j),
            a.Animate.gravity(h, {
                context: e,
                dx: 0.3
            }).run().onStop(function () {
                e.remove(h),
                e.remove(j),
                i.stop()
            }),
            a.Animate.gravity(j, {
                context: e,
                dx: - 0.2
            }).run()
        }
        function f() {
            return e(c.angle, h),
            i
        }
        function g() {
            return i.onStop && i.onStop(b),
            i
        }
        var h = c.context,
        i = (b.style, {
        });
        return i.onStop = function (a) {
            return i.onStop = a,
            i
        },
        i.run = f,
        i.stop = g,
        i
    }
    function i(a, b) {
        function c(a) {
            a.visible = !0,
            a.rotate = Math.random();
            var b = g.stage.canvas.width / 2;
            a.x = b + Math.random() * (b - 100) - Math.random() * (b - 100),
            a.y = g.stage.canvas.height,
            a.vx = 5 * Math.random() - 5 * Math.random(),
            a.vy = - 25
        }
        function d() {
            return c(a),
            h = setInterval(function () {
                return o ? void i.stop()  : (a.vy += f, a.x += a.vx, a.y += a.vy, void ((a.x < 0 || a.x > g.stage.canvas.width || a.y > g.stage.canvas.height) && (i.onStop && i.onStop(a), c(a))))
            }, 50),
            i
        }
        function e() {
            window.clearInterval(h)
        }
        var f = 0.8,
        g = b.context,
        h = null,
        i = {
        };
        return i.onStop = function (a) {
            return i.onStop = a,
            i
        },
        i.run = d,
        i.stop = e,
        i
    }
    function j() {
        o = !0
    }
    function k() {
        o = !1
    }
    function l(b, c) {
        function d() {
            return n = setInterval(function () {
                if (o) return void m.stop();
                var a = f.y + h + Math.sin(k) * j;
                b.setLocation(b.x, a),
                k += l
            }, 100),
            m
        }
        function e() {
            window.clearInterval(n)
        }
        var f = c.p1,
        g = c.p2,
        h = (c.context, f.x + (g.x - f.x) / 2),
        i = f.y + (g.y - f.y) / 2,
        j = a.util.getDistance(f, g) / 2,
        k = Math.atan2(i, h),
        l = c.speed || 0.2,
        m = {
        },
        n = null;
        return m.run = d,
        m.stop = e,
        m
    }
    function m(a, b) {
        function c() {
            return h = setInterval(function () {
                if (o) return void g.stop();
                var b = e.x - a.x,
                c = e.y - a.y,
                h = b * f,
                i = c * f;
                a.x += h,
                a.y += i,
                0.01 > h && 0.1 > i && d()
            }, 100),
            g
        }
        function d() {
            window.clearInterval(h)
        }
        var e = b.position,
        f = (b.context, b.easing || 0.2),
        g = {
        },
        h = null;
        return g.onStop = function (a) {
            return g.onStop = a,
            g
        },
        g.run = c,
        g.stop = d,
        g
    }
    function n(a, b) {
        function c() {
            return j = setInterval(function () {
                a.scaleX += f,
                a.scaleY += f,
                a.scaleX >= e && d()
            }, 100),
            i
        }
        function d() {
            i.onStop && i.onStop(a),
            a.scaleX = g,
            a.scaleY = h,
            window.clearInterval(j)
        }
        var e = (b.position, b.context, b.scale || 1),
        f = 0.06,
        g = a.scaleX,
        h = a.scaleY,
        i = {
        },
        j = null;
        return i.onStop = function (a) {
            return i.onStop = a,
            i
        },
        i.run = c,
        i.stop = d,
        i
    }
    a.Animate = {
    },
    a.Effect = {
    };
    var o = !1;
    a.Effect.spring = e,
    a.Effect.gravity = c,
    a.Animate.stepByStep = d,
    a.Animate.rotate = f,
    a.Animate.scale = n,
    a.Animate.move = m,
    a.Animate.cycle = l,
    a.Animate.repeatThrow = i,
    a.Animate.dividedTwoPiece = h,
    a.Animate.gravity = g,
    a.Animate.startAll = k,
    a.Animate.stopAll = j
}(JTopo),
function (a) {
    function b(a, b) {
        var c,
        d,
        e,
        f,
        g,
        h,
        i,
        j = [
        ];
        return 0 == a.length ? j : (c = b.match(/^\s*(\w+)\s*$/), null != c ? (d = a.filter(function (a) {
            return a.elementType == c[1]
        }), null != d && d.length > 0 && (j = j.concat(d)))  : (e = !1, c = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*['"](\S+)['"]\s*\]\s*/), (null == c || c.length < 5) && (c = b.match(/\s*(\w+)\s*\[\s*(\w+)\s*([>=<])\s*(\d+(\.\d+)?)\s*\]\s*/), e = !0), null != c && c.length >= 5 && (f = c[1], g = c[2], h = c[3], i = c[4], d = a.filter(function (a) {
            if (a.elementType != f) return !1;
            var b = a[g];
            return 1 == e && (b = parseInt(b)),
            '=' == h ? b == i : '>' == h ? b > i : '<' == h ? i > b : '<=' == h ? i >= b : '>=' == h ? b >= i : '!=' == h ? b != i : !1
        }), null != d && d.length > 0 && (j = j.concat(d)))), j)
    }
    function c(a) {
        var b,
        c,
        f;
        if (a.find = function (a) {
            return d.call(this, a)
        }, e.forEach(function (b) {
            a[b] = function (a) {
                for (var c = 0; c < this.length; c++) this[c][b](a);
                return this
            }
        }), a.length > 0) {
            b = a[0];
            for (c in b) f = b[c],
            'function' == typeof f && !function (b) {
                a[c] = function () {
                    for (var c = [
                    ], d = 0; d < a.length; d++) c.push(b.apply(a[d], arguments));
                    return c
                }
            }(f)
        }
        return a.attr = function (a, b) {
            var c,
            d,
            e;
            if (null != a && null != b) for (c = 0; c < this.length; c++) this[c][a] = b;
             else {
                if (null != a && 'string' == typeof a) {
                    for (d = [
                    ], c = 0; c < this.length; c++) d.push(this[c][a]);
                    return d
                }
                if (null != a) for (c = 0; c < this.length; c++) for (e in a) this[c][e] = a[e]
            }
            return this
        },
        a
    }
    function d(d) {
        var e,
        f = [
        ],
        g = [
        ];
        return this instanceof a.Stage ? (f = this.childs, g = g.concat(f))  : this instanceof a.Scene ? f = [
            this
        ] : g = this,
        f.forEach(function (a) {
            g = g.concat(a.childs)
        }),
        e = null,
        e = 'function' == typeof d ? g.filter(d)  : b(g, d),
        e = c(e)
    }
    var e = 'click,mousedown,mouseup,mouseover,mouseout,mousedrag,keydown,keyup'.split(',');
    a.Stage.prototype.find = d,
    a.Scene.prototype.find = d
}(JTopo),
function (a) {
    function b(a, b) {
        this.x = a,
        this.y = b
    }
    function c(a) {
        this.p = new b(0, 0),
        this.w = new b(1, 0),
        this.paint = a
    }
    function d(a, b, c) {
        return function (d) {
            for (var e = 0; b > e; e++) a(),
            c && d.turn(c),
            d.move(3)
        }
    }
    function e(a, b) {
        var c = 2 * Math.PI;
        return function (d) {
            for (var e = 0; b > e; e++) a(),
            d.turn(c / b)
        }
    }
    function f(a, b, c) {
        return function (d) {
            for (var e = 0; b > e; e++) a(),
            d.resize(c)
        }
    }
    function g(a) {
        var b = 2 * Math.PI;
        return function (c) {
            for (var d = 0; a > d; d++) c.forward(1),
            c.turn(b / a)
        }
    }
    function h(a) {
        var b = 4 * Math.PI;
        return function (c) {
            for (var d = 0; a > d; d++) c.forward(1),
            c.turn(b / a)
        }
    }
    function i(a, b, c, d) {
        return function (e) {
            for (var f = 0; b > f; f++) a(),
            e.forward(1),
            e.turn(c),
            e.resize(d)
        }
    }
    var j = {
    };
    c.prototype.forward = function (a) {
        var b = this.p,
        c = this.w;
        return b.x = b.x + a * c.x,
        b.y = b.y + a * c.y,
        this.paint && this.paint(b.x, b.y),
        this
    },
    c.prototype.move = function (a) {
        var b = this.p,
        c = this.w;
        return b.x = b.x + a * c.x,
        b.y = b.y + a * c.y,
        this
    },
    c.prototype.moveTo = function (a, b) {
        return this.p.x = a,
        this.p.y = b,
        this
    },
    c.prototype.turn = function (a) {
        var b = (this.p, this.w),
        c = Math.cos(a) * b.x - Math.sin(a) * b.y,
        d = Math.sin(a) * b.x + Math.cos(a) * b.y;
        return b.x = c,
        b.y = d,
        this
    },
    c.prototype.resize = function (a) {
        var b = this.w;
        return b.x = b.x * a,
        b.y = b.y * a,
        this
    },
    c.prototype.save = function () {
        return null == this._stack && (this._stack = [
        ]),
        this._stack.push([this.p,
        this.w]),
        this
    },
    c.prototype.restore = function () {
        if (null != this._stack && this._stack.length > 0) {
            var a = this._stack.pop();
            this.p = a[0],
            this.w = a[1]
        }
        return this
    },
    j.Tortoise = c,
    j.shift = d,
    j.spin = e,
    j.polygon = g,
    j.spiral = i,
    j.star = h,
    j.scale = f,
    a.Logo = j
}(window);
