var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var exec = require('child_process').exec;

app.get('/', function(req, res){
	//res.send('<h1>Hello world</h1>');
	res.sendfile('www/index.html');
});

app.use(express.static(__dirname + '/www'));

io.on('connection', function(socket){
	console.log('user connected');

	//socket.broadcast.emit('hi');
	socket.on('open', function(name){
		console.log('open '+name);
		fs.readFile('data/'+name+'/topology.txt', 'utf-8', function(err, data){
			if (err) {
				console.log('open error:'+err);
			} else {
				// socket.emit('open', data);
				// console.log(data);
				var json = JSON.parse(data);

				try {
				var file = 'data/' +name + '/IPS_REPORT.txt';
				var data = fs.readFileSync(file);
				var arr = data.toString().split('\n');
				arr.pop();
				json.runlog = arr;
				} catch (err) {
					console.log('get report error: '+err);
					json.runlog = "none";
				}


				//console.log(json);
				socket.emit('open', json);
			}
			
		});
	});

	socket.on('refresh', function(){
		fs.readdir('data/', function(err, files){
			if (err) {
				console.log('read dir error:'+err);
			} else {
				console.log(files);
				socket.emit('refresh', files);
			}
			
		});
		
	});
	socket.on('save', function(proj){
		// console.log(proj);
		var str = JSON.stringify(proj);
		var dir = 'data/'+proj.name+'/';

		try{
			fs.mkdirSync(dir);
		} catch(err) {
			console.log('no need to mkdir: '+err);
		};
		
		fs.writeFile( dir +'topology.txt', str, 'utf-8', function(err){
			if (err) {
				console.log('write error:'+err);
				socket.emit('save', 'ERROR');
			} else {
				socket.emit('save', 'OK');
			}
			
		});
	});
	socket.on('delete', function(name){
		console.log('delete '+name);
		var dir = 'data/'+name+'/';
		fs.readdir(dir, function(err, files){
			if (err) {
				console.log('read dir error:'+err);
				socket.emit('delete', 'ERROR');
			} else {
				for (var i = 0; i < files.length; i++) {
					fs.unlinkSync(dir+files[i]);
				};
				fs.rmdirSync( dir);
				socket.emit('delete', 'OK');
			}
		});
		
	});
	socket.on('run', function(proj){
		console.log('+++++++++++++++run:'+proj.name);
		// proj:obj{
		// 	switches:obj{
		// 		Devices:array(obj)
		// 	}
		// 	links:array(string)
		// }

		//Switch id
		//Device type id tongdao rate vlan start end
		//Link id id
		var str = '';//JSON.stringify(proj);
		// for (var i = 0; i < proj.switches.length; i++) {
		var elements = JSON.parse(proj.data).childs[0].childs;
		// var elements = proj.data.childs[0].childs;
		// console.log("elements:"+JSON.stringify(elements));

		var nodes = {};
		var conns = [];
		var nl = 0;
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			if (element.elementType == 'link') {
				element.type = "link";
				conns.push(element);
			} else {
				var node = {};
				node.id = element._id;
				node.type = element["label"];
				//console.log(node.type);
				if (node.type == "Switch") {
					node['Devices'] = [];
				} else {
					node['Devices'] = [];
					node['tongdao'] = element["lushu"];
					node['rate'] = element["rate"];
					node['vlan'] = element["vlan"];
					// node['start'] = element["start"];
					// node['end'] = element["end"];
					node['start'] = 0;
					node['end'] = 15;
				}

				nodes[node.id] = node;
				nl++;
			}
		}
		//console.log("nodes:"+JSON.stringify(nodes));
		//console.log("conns:"+JSON.stringify(conns));
		console.log("nodes:"+nl);
		console.log("conns:"+conns.length);

		var sws = {};
		var links = [];
		for (var i = 0; i < conns.length; i++) {
			var conn = conns[i];
			var first = nodes[conn.src_id];
			var second = nodes[conn.dest_id];

			if (first.type=="Switch"&&second.type=="Switch") {
				links.push([first.id, second.id]);
				if (!sws[first.id]) {
					sws[first.id] = first;
				}
				if (!sws[second.id]) {
					sws[second.id] = second;
				}

			} else if (first.type!="Switch"&&second.type!="Switch") {
				continue;
			} else {
				var swc = first;
				var dev = second;
				if (second.type=="Switch") {
					swc = second;
					dev = first;
				};

				if (!sws[swc.id]) {
					sws[swc.id] = swc;
				} else {
					swc = sws[swc.id];
				}
				swc.Devices.push(dev);
			}
		}
		//console.log("sws:"+JSON.stringify(sws));
		//console.log("links:"+JSON.stringify(links));

		for (var swid in sws) {
			var sw = sws[swid];
			str += 'Switch\t'+sw.id+'\n';
			for (var j = 0; j < sw.Devices.length; j++) {
				var dev = sw.Devices[j];
				str += 'Device\t'+dev.type+'\t'+dev.id+'\t'+dev.tongdao+'\t'
					+dev.rate+'\t'+dev.vlan+'\t'+dev.start+'\t'+dev.end+'\n';
			};
		};
		for (var i = 0; i < links.length; i++) {
			var link = links[i];
			str += 'Link\t'+link[0]+'\t'+link[1]+'\n';
		};
		//console.log('ns3 topology: '+str);

		var dir = 'data/'+proj.name+'/';
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		};
		
		fs.writeFile(dir+'ns3config.txt', str, 'utf-8', function(err){
			if (err) {
				console.log('run error:'+err);
				socket.emit('run', 'ERROR');
			} else {
				var ns3dir = '/home/davidxn/ns/ns-allinone-3.20/ns-3.20/';
				var appdir = '/home/davidxn/IPSWeb/';
				var datadir= appdir + dir;
				var config = datadir + 'ns3config.txt';

				var cmd = 'cd '+ns3dir+' && ';
				cmd += './waf --cwd='+datadir+' --run "scratch/ips/ips '+config+'" && ';
				cmd += 'cd '+appdir;
				console.log(cmd);
				exec(cmd, function(err, stdout, stderr) {
					if (err) {
						console.log('run error:'+err);
						socket.emit('run', 'ERROR');
					}else {
						//console.log(stdout);
						//socket.emit('run', 'OK');
						var file = dir + 'IPS_REPORT.txt';
						fs.readFile(file, function(err, data){
							if(err){
								console.log('get report error: '+err);
								socket.emit('run', 'get report error:'+err);
							} else {
								var arr = data.toString().split('\n');
								arr.pop();
								console.log(arr);
								socket.emit('run', {status:'OK',data: arr});
							}
						});
					}
				});
			}
			
		});
	});

	socket.on('status', function(pname, dev){
		var file = 'data/'+pname+'/IPS_'+dev+'.txt';
		fs.readFile(file, function(err, data){
			if(err){
				console.log('get status error: '+err);
			} else {
				//console.log(data.toString());
				socket.emit('status', data.toString().split('\n'));
			}
		});
	});
	socket.on('disconnect', function() {
		console.log('user left');
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
