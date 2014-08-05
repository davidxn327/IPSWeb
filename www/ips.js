
project = {};
devices = [];
switches = [];
cnt_dev = 0;
ips_zoom = 1;

;(function() {
	
	var _initialised = false,		
	listDiv = document.getElementById("list"),

	showConnectionInfo = function(s) {
		list.innerHTML = s;
		list.style.display = "block";
	},	
	hideConnectionInfo = function() {
		list.style.display = "none";
	},
	connections = [],
	updateConnections = function(conn, remove) {
		return;
		if (!remove) connections.push(conn);
		else {
			var idx = -1;
			for (var i = 0; i < connections.length; i++) {
				if (connections[i] == conn) {
					idx = i; break;
				}
			}
			if (idx != -1) connections.splice(idx, 1);
		}
		if (connections.length > 0) {
			var s = "<span><strong>Connections</strong></span><br/><br/><table><tr><th>Scope</th><th>Source</th><th>Target</th></tr>";
			for (var j = 0; j < connections.length; j++) {
				s = s + "<tr><td>" + connections[j].scope + "</td>" + "<td>" + connections[j].sourceId + "</td><td>" + connections[j].targetId + "</td></tr>";
			}
			showConnectionInfo(s);
		} else 
			hideConnectionInfo();
	};
	
	jsPlumb.ready(function() {

		var instance = jsPlumb.getInstance({
			DragOptions : { cursor: 'pointer', zIndex:2000 },
			PaintStyle : { strokeStyle:'#666' },
			EndpointStyle : { width:5, height:5, strokeStyle:'#666' },
			Endpoint : "Rectangle",
			Anchors : ["TopCenter", "TopCenter"],
			Container:"drag-drop-demo"
		});		

		// suspend drawing and initialise.
		instance.doWhileSuspended(function() {										

			// bind to connection/connectionDetached events, and update the list of connections on screen.
			instance.bind("connection", function(info, originalEvent) {
				updateConnections(info.connection);
			});
			instance.bind("connectionDetached", function(info, originalEvent) {
				updateConnections(info.connection, true);
			});
			
			instance.bind("connectionMoved", function(info, originalEvent) {
				//  only remove here, because a 'connection' event is also fired.
				// in a future release of jsplumb this extra connection event will not
				// be fired.
				updateConnections(info.connection, true);
			});

			// configure some drop options for use by all endpoints.
			var exampleDropOptions = {
				tolerance:"touch",
				hoverClass:"dropHover",
				activeClass:"dragActive"
			};

			//
			// first example endpoint.  it's a 25x21 rectangle (the size is provided in the 'style' arg to the Endpoint),
			// and it's both a source and target.  the 'scope' of this Endpoint is 'exampleConnection', meaning any connection
			// starting from this Endpoint is of type 'exampleConnection' and can only be dropped on an Endpoint target
			// that declares 'exampleEndpoint' as its drop scope, and also that
			// only 'exampleConnection' types can be dropped here.
			//
			// the connection style for this endpoint is a Bezier curve (we didn't provide one, so we use the default), with a lineWidth of
			// 5 pixels, and a gradient.
			//
			// there is a 'beforeDrop' interceptor on this endpoint which is used to allow the user to decide whether
			// or not to allow a particular connection to be established.
			//
			var exampleColor = "#00f";
			var exampleEndpoint = {
				endpoint:["Dot", { radius:5 }],
				anchor: "Continuous",
				paintStyle:{ width:15, height:15, fillStyle:exampleColor },
				isSource:true,
				reattach:true,
				scope:"blue",
				connectorStyle : { lineWidth:3, strokeStyle:exampleColor },
				connector: ["Bezier", { curviness:63 } ],
				// connector: "Straight",
				maxConnections:100,
				isTarget:true,			
				dropOptions : exampleDropOptions
			};			


			// setup some DynamicAnchors for use with the blue endpoints			
			// and a function to set as the maxConnections callback.
			// var anchors = [[1, 0.2, 1, 0], [0.8, 1, 0, 1], [0, 0.8, -1, 0], [0.2, 0, 0, -1] ];
			var anchors = [ [0.5, 0, 0,-1], //"TopCenter")
							[0.5, 1, 0, 1], //"BottomCenter")
							[0, 0.5, -1, 0], //"LeftMiddle")
							[1, 0.5, 1, 0], //"RightMiddle")
							[0.5, 0, 0,-1], //"Top")
							[0.5, 1, 0, 1], //"Bottom")
							[0, 0.5, -1, 0], //"Left")
							[1, 0.5, 1, 0], //"Right")
							// [0.5, 0.5, 0, 0], //"Center")
							[1, 0, 0,-1], //"TopRight")
							[1, 1, 0, 1], //"BottomRight")
							[0, 0, 0, -1], //"TopLeft")
							[0, 1, 0, 1] //"BottomLeft")
						  ];
			maxConnectionsCallback = function(info) {
				alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
			};		

			// make .window divs draggable
			instance.draggable(jsPlumb.getSelector(".drag-drop-demo .window"));

			// add endpoint of type 3 using a selector. 
			// instance.addEndpoint(jsPlumb.getSelector(".drag-drop-demo .window"), { anchor:anchors }, exampleEndpoint);
			instance.addEndpoint(jsPlumb.getSelector(".drag-drop-demo .window"), exampleEndpoint);

			var detachLinks = jsPlumb.getSelector(".drag-drop-demo .detach");
			instance.on(detachLinks, "click", function(e) {
				instance.detachAllConnections(this.getAttribute("rel"));
				jsPlumbUtil.consume(e);
			});

			instance.on(document.getElementById("clear"), "click", function(e) { 
				instance.detachEveryConnection();
				showConnectionInfo("");
				jsPlumbUtil.consume(e);
			});

			// var socket = io();

			var	getProjectObject = function () {
				var sws = {};
				var links = [];
				var conns = instance.getAllConnections();
				for (var i = 0; i < conns.length; i++) {
					
					var src = document.getElementById(conns[i].source.id);
					var tgt = document.getElementById(conns[i].target.id);
					var srcType = src.getAttribute("type");
					var tgtType = tgt.getAttribute("type");

					var sw = {}, dev = {};
					if (srcType == 'Switch' && tgtType == 'Switch') {
						links.push([src.id, tgt.id]);
						continue;
					} else if (srcType == 'Switch') {
						sw.id = src.id;
						dev.id = tgt.id;
						dev.type = tgtType;
					} else if (tgtType == 'Switch') {
						sw.id = tgt.id;
						dev.id = src.id;
						dev.type = srcType;
					} else{
						continue;
					};

					//Switch id
					//Device type id tongdao rate vlan start end
					//Link id id
					if (!sws[sw.id]) {
						// sw['x'] = 0;
						// sw['y'] = 0;
						sw['Devices'] = [];
						sws[sw.id] = sw;
					};

					var dsw = sws[sw.id];
					// // dev['type'] = '';
					// // dev['id'] = '';
					// dev['tongdao'] = '';
					// dev['rate'] = '';
					// dev['vlan'] = '';
					// dev['start'] = '';
					// dev['end'] = '';
					// dev['x'] = 0;
					// dev['y'] = 0;
					dsw['Devices'].push(dev);
				}

				var prj = {};
				prj.id = 123;
				prj.name = "pname";
				prj.switches = sws;
				prj.links = links;

				return prj;
			}
			// $('form').submit(function(){
			// 	socket.emit('chat message', $('#m').val());
			// 	$('#m').val('');
			// 	return false;
			// });
			// socket.on('chat message', function(msg){
			// 	$('#messages').append($('<li>').text(msg));
			// });

			if(0){//项目操作按钮
				document.getElementById("btn_open").onclick=function() {
					var pn = document.getElementById("plist").value;
					socket.emit('open', pn);
				};

				document.getElementById("btn_refresh").onclick=function() {
					socket.emit('refresh', '');
				};

				document.getElementById("btn_new").onclick=function() {
					// no socket, just delete all panel
				};

				document.getElementById("btn_save").onclick=function() {
					socket.emit('save', '');
				};

				document.getElementById("btn_saveas").onclick=function() {
					socket.emit('save', '');
				};
				document.getElementById("btn_delete").onclick=function() {
					socket.emit('delete', '');
				};
			}

			function UpdatePanel (dev) {
				if (document.getElementById("dname").value != dev.getAttribute('id')) {
					document.getElementById("dname").value = dev.getAttribute('id');
					document.getElementById("dtype").value = dev.getAttribute('type');
					document.getElementById("drate").value = dev.getAttribute('rate');
					document.getElementById("dvlan").value = dev.getAttribute('vlan');
					document.getElementById("dnum").value = dev.getAttribute('tongdao');
					document.getElementById("dstart").value = dev.getAttribute('start');
					document.getElementById("dend").value = dev.getAttribute('end');
				};
				
			}

			function add_dev (type) {
				var id = type.toString() + cnt_dev;
				var s = '<div class="window" id="'+id+'">'+id+'</div>';
				var div=document.createElement("div");
				div.setAttribute("class", "window");
				div.setAttribute("id", id); 
				div.setAttribute("type", type); 
				div.setAttribute('rate', 100);
				div.setAttribute('vlan', 'vlan0');
				div.setAttribute('tongdao', 12);
				div.setAttribute('start', 1);
				div.setAttribute('end', 10);
				div.innerHTML = '<img src="http://v4.vcimg.com/base/images/index/duola.png?v=bedbf22e" alt="switch">';
				// div.innerHTML = id+'<div class="div_anchor"></div>';
				document.getElementById("drag-drop-demo").appendChild(div);
				instance.addEndpoint(id, { anchor:anchors }, exampleEndpoint);
				instance.draggable(id);

				div.onclick = function () {
					UpdatePanel(this);
				}

				cnt_dev++;
			}

			if(1){//面板操作按钮
				document.getElementById("btn_add_switch").onclick=function() {
					// this.innerHTML = 'hello'+cnt_dev;
					add_dev('Switch');
					return false;
				};
				
				document.getElementById("btn_add_mu").onclick=function() {
					add_dev('MU');
					return false;
				};

				document.getElementById("btn_add_it").onclick=function() {
					add_dev('IT');
					return false;
				};
				
				document.getElementById("btn_add_pc").onclick=function() {
					add_dev('PC');
					return false;
				};
				
				document.getElementById("btn_add_fc").onclick=function() {
					add_dev('FC');
					return false;
				};
				
				document.getElementById("btn_add_mn").onclick=function() {
					add_dev('MN');
					return false;
				};
				
				document.getElementById("btn_remove").onclick=function() {};
				document.getElementById("btn_run").onclick=function() {};
			}
			
			if(1){//属性操作按钮
				document.getElementById("btn_apply").onclick=function() {};
				document.getElementById("btn_status").onclick=function() {
					project = getProjectObject();
				};
			}
			

			

		});

		jsPlumb.fire("jsPlumbDemoLoaded", instance);
	});	
	
})();