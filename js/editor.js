
var scene;
var stage;
var canvas;
var editMode="drag";
var FileName="";
var socket =io.connect("192.168.1.108:3000");
$(document).ready(function(){   
   /* showMask(true);*/
    $('#choicedFileName').val("");
    $('#findText').val("");
    clearDevInfo();
    canvas = document.getElementById('canvas'); 
    stage = new JTopo.Stage(canvas); // 创建一个舞台对象
    scene = new JTopo.Scene(stage); // 创建一个场景对象   
    scene.background="img/wbg.png";
    stage.wheelZoom=0.9;
    var beginNode = null;

    var tempNodeA = new JTopo.Node('tempA');
    tempNodeA.label="tempA"
    tempNodeA.setSize(1, 1);
    
    var tempNodeZ = new JTopo.Node('tempZ');
    tempNodeZ.label="tempZ";
    tempNodeZ.setSize(1, 1);
    
    var link = new JTopo.Link(tempNodeA, tempNodeZ);
    
    scene.mouseup(function(e){
        if(e.button == 2 || editMode!="normal"){
            scene.remove(link);
            return;
        }
        if(e.target != null && e.target instanceof JTopo.Node){
            if(beginNode == null){
                beginNode = e.target;
                scene.add(link);
                tempNodeA.setLocation(e.x, e.y);
                tempNodeZ.setLocation(e.x, e.y);
            }else if(beginNode !== e.target){
                var endNode = e.target;
                if(CanLink(beginNode,endNode)){
                    var l = new JTopo.Link(beginNode, endNode);
                    scene.add(l);
                    beginNode = null;
                    tempNodeA.setLocation(0, 0);
                    tempNodeZ.setLocation(0, 0);
                    scene.remove(link);
                }
            }else{
                beginNode = null;
                tempNodeA.setLocation(0, 0);
                tempNodeZ.setLocation(0, 0);
            }
        }else{
            beginNode=null;  
            tempNodeA.setLocation(0, 0);
            tempNodeZ.setLocation(0, 0);
            scene.remove(link);
          
        }
    });
    
    scene.mousedown(function(e){
        if(e.target == null || e.target === beginNode || e.target === link){
            scene.remove(link);
        }
    });

    scene.mousemove(function(e){
        tempNodeZ.setLocation(e.x, e.y);
    });
        
    scene.click(function(event){
        if(event.target == null ) return;
        var e = event.target;
        if(e.elementType=="node")
            showDevInfo(e);
    });
     scene.dbclick(function(event){
        if(event.target == null ) return;
        var e = event.target;
        if(e.elementType=="node" && e.label!="Switch")
            socket.emit("status",FileName, e._id);
    });
    function keyUp(e) {
        var currKey=0,e=e||event;
        currKey=e.keyCode||e.which||e.charCode;
        if(currKey==46){
           deleteElement();
        }
    }
    document.onkeyup = keyUp;
        // 查询
    $('#findButton').click(function(){
        var text = $('#findText').val().trim();
        var nodes = stage.find('node[text="'+text+'"]');
        if(nodes.length > 0){
            function nodeFlash(node, n){
                if(n == 0) {
                    node.selected = false;
                    return;
                };
                node.selected = !node.selected;
                setTimeout(function(){
                    nodeFlash(node, n-1);
                }, 300);
            }
                var node = nodes[0];
                node.selected = true;
                var location = node.getCenterLocation();
                // 查询到的节点居中显示
                stage.setCenter(location.x, location.y); 
                // 闪烁几下
                nodeFlash(node, 6);
        }
    });

    $('#exportButton').click(function(){
        stage.saveImageInfo();
    });
    //刷新文件列表
    function reFresh() {
        socket.emit('refresh');
    }
    reFresh();
    socket.on('save', function (data) {
        if (data=='OK') {
            alert('保存成功！');
            socket.emit('refresh', '');
        } else {
            alert('保存失败！');
        }
    });
    socket.on('open', function(data){
        scene.clear();
        JTopo.LoadJsonOneScense(data.data,stage,scene);
        console.log(data.runlog);
        if(data.runlog !="none"){
            for(var i=0; i<data.runlog.length; i++){
                var arr = data.runlog[i].split("\t");
                if(arr[0]=="" || arr[0]== undefined)
                    continue;
                var node= scene.getElementById(arr[0]);
                if(arr[1]>node.alarmLimit){
                    node.alarm=arr[1];
                    console.log(node);
                }   
            }
        }
        stage.childs.length!=0 ? scene= stage.childs[0] : scene = new JTopo.Scene(stage);
    });
    socket.on('refresh', function(files){
        var plist = document.getElementById('FileList');
        var s = '';
         s+="<li><a href=\"#\" onclick='newFile();'>新建</a></li>";
         s+="<li class=\"divider\"></li>";
        for(var i=0; i<files.length; ++i){
           /* s +='<option value="'+files[i]+'">'+files[i]+'</option>';*/
           s+="<li><a href=\"javascript:loadJson('"+files[i]+"');void(0);\">"+files[i]+"</a></li>";
        }
        plist.innerHTML = s;
    });
    socket.on('delete', function(data){
        if (data=='OK') {
            socket.emit('refresh');
            alert('删除成功！');
        } else {
            alert('删除失败！');
        }
    });
    socket.on('run', function(data){
        if (data.status=='OK') {
            for(var i=0; i<data.data.length; i++){
                var arr = data.data[i].split("\t");
                if(arr[0]=="" || arr[0]== undefined)
                    continue;
                var node= scene.getElementById(arr[0]);
                if(arr[1]>node.alarmLimit){
                    node.alarm="超过限定值！";
                    node.alarmColor = '0,255,0';
                }   
            }
            alert('运行成功！');
        } else {
            alert('运行失败！');
        }
        showMask(false);
    });
    socket.on('status', function (data) {
        showModal(data);
    });
});
// 节点
 function newNode(x, y, img, name){
    var node = new JTopo.Node();
    node.setImage(img, true);      
    node.setLocation(x, y);
    /*node.setCenterLocation();*/
    node.text=name;
    node.textPosition = "Bottom_Center"
    node.fontColor="#3B3B3B";
    node.font="24px monospaced";
    node.img=img;
    node.rate=1000;
    node.lushu=5;
    node.vlan="vlan0";
    node.alarmLimit=10;
    scene.add(node);
    return node;
}        
function createLink(nodeA,nodeZ,text){
    switch(linktype){
        case "link":
            newLink(nodeA,nodeZ,"edge","dashedPattern");
            break;
        case "FoldLink":
            newFoldLink(nodeA,nodeZ,"edge","vertical","dashedPattern");
            break;
        case "FlexionalLink":
            newFlexionalLink(nodeA,nodeZ,"edge","vertical","dashedPattern");
            break;
        case "CurveLink":
            newCurveLink(nodeA, nodeZ, "edge");
            break;
        default:
            newLink(nodeA,nodeZ,"edge","dashedPattern");
            break;
    }
}   
// 简单连线
function newLink(nodeA, nodeZ, text, dashedPattern){
    var link = new JTopo.Link(nodeA, nodeZ, text);        
    link.lineWidth = 3; // 线宽
    /*link.dashedPattern = dashedPattern; // 虚线*/
    link.bundleOffset = 60; // 折线拐角处的长度
    link.bundleGap = 20; // 线条之间的间隔
    link.textOffsetY = 3; // 文本偏移量（向下3个像素）
    link.strokeColor = '0,200,255';
    scene.add(link);
    return link;
}
// 折线
function newFoldLink(nodeA, nodeZ, text, direction, dashedPattern){
    var link = new JTopo.FoldLink(nodeA, nodeZ, text);
    link.direction = direction || 'horizontal';
    link.arrowsRadius = 15; //箭头大小
    link.lineWidth = 3; // 线宽
    link.bundleOffset = 60; // 折线拐角处的长度
    link.bundleGap = 20; // 线条之间的间隔
    link.textOffsetY = 3; // 文本偏移量（向下3个像素）
    link.strokeColor = JTopo.util.randomColor(); // 线条颜色随机
    /*link.dashedPattern = dashedPattern;*/
    scene.add(link);
    return link;
}
// 二次折线
function newFlexionalLink(nodeA, nodeZ, text, direction, dashedPattern){
    var link = new JTopo.FlexionalLink(nodeA, nodeZ, text);
    link.direction = direction || 'horizontal';
    link.arrowsRadius = 10;
    link.lineWidth = 3; // 线宽
    link.offsetGap = 35;
    link.bundleGap = 15; // 线条之间的间隔
    link.textOffsetY = 10; // 文本偏移量（向下15个像素）
    link.strokeColor = '0,250,0';
   /* link.dashedPattern = dashedPattern; */
    scene.add(link);
    return link;
}
// 曲线
function newCurveLink(nodeA, nodeZ, text){
    var link = new JTopo.CurveLink(nodeA, nodeZ, text);
    link.lineWidth = 3; // 线宽
    scene.add(link);
    return link;
}
function deleteElement(){
     var selectElement= scene.selectedElements;
        if(selectElement.length!=0)
            for(var i=0;i<selectElement.length;i++)
                scene.remove(selectElement[i]);
}
//拖放
function allowDrop(ev){
    ev.preventDefault();
}
function drag(ev){
    /*ev.preventDefault();*/
    ev.dataTransfer.setData("info",ev.target.attributes.draginfo.value);
}
function dragover(ev){
    ev.preventDefault();
}
function drop(ev){
    ev.preventDefault(); 
    if(FileName=="" || FileName==undefined){
        alert("请先新建，或选择已有文件再进行操作！");
    }else{
        var clientX=parseInt(ev.clientX);
        var clientY=parseInt(ev.clientY);
    /*    iX = e.clientX - this.offsetLeft;
                iY = e.clientY - this.offsetTop;*/
        var draginfo= ev.dataTransfer.getData("info");
        var info= eval("("+draginfo+")");
        var node = newNode(clientX-300,clientY-100,info.image,info.label);
        node.label=info.label;
    }
    ev.stopPropagation();
}       
function getElementById(scene,id){
    if(scene.childs.length==0)
        return null;
    for(var i=0;i<scene.childs.length;i++){
        var node =scene.childs[i];
        if(node._id==id)
            return node;
    }
}
function getSize(scene){
    var size=[];
    if(scene.childs.length ==0 ){
        size["height"]=30;
        size["width"]=30 
    }else{
        size=scene.childs[0].getSize();
        
    }
    return size;
}
function zoomIn(){
    stage.zoomIn(0.9);
    console.log(stage);
    console.log(scene);
}
function zoomOut(){
    stage.zoomOut(0.9);
}
function setModle(mode){
    if(mode=="drag"){
        stage.mode="normal"; 
        editMode="drag"
    }else
        stage.mode=mode;
        editMode=mode;    
}
function fullScreenButton(){
    runPrefixMethod(stage.canvas, "RequestFullScreen");
}
function runPrefixMethod (element, method) {
    var usablePrefixMethod;
    ["webkit", "moz", "ms", "o", ""].forEach(function(prefix) {
        if (usablePrefixMethod) return;
        if (prefix === "") {
            // 无前缀，方法首字母小写
            method = method.slice(0,1).toLowerCase() + method.slice(1);
        }
        var typePrefixMethod = typeof element[prefix + method];
        if (typePrefixMethod + "" !== "undefined") {
            if (typePrefixMethod === "function") {
                usablePrefixMethod = element[prefix + method]();
            } else {
                usablePrefixMethod = element[prefix + method];
            }
        }
    }
);
    return usablePrefixMethod;
};

function clearElement(){
    scene.clear();
    /*loadJson("./data/data.json",canvas);*/
}
function setLayOutMode(modetype){
     showModal();
}
function changeDevInfo(){
    var id=$("#info_id").val();
    var alarmLimit=$("#info_alarmLimit").val();
    var rate=$("#info_rate").val();
    var lushu=$("#info_num").val();
    if(id!=""&&isNumeric(alarmLimit)&& isNumeric(rate)&& isNumeric(lushu)){
        var node=scene.getElementById(id);
        node.text=$("#info_name").val();
        node.alarmLimit=$("#info_alarmLimit").val();
        node.rate= $("#info_rate").val();
        node.vlan=$("#info_vlan").val();
        node.lushu=$("#info_num").val();
        stage.paint();
        alert("更改成功！");
    }else
        alert("请检查输入！   ");
}
function clearDevInfo(){
    $("#info_id").val("");
    $("#info_name").val("");
    $("#info_alarmLimit").val("");
    $("#info_rate").val("");
    $("#info_vlan").val("");
    $("#info_num").val("");
}
function showDevInfo(node){
    $("#info_id").val(node._id);
    $("#info_name").val(node.text);
    $("#info_alarmLimit").val(node.alarmLimit);
    $("#info_rate").val(node.rate);
    $("#info_vlan").val(node.vlan);
    $("#info_num").val(node.lushu);
}
function loadJson(path){
    socket.emit("open",path);
    FileName=path;
    $('#choicedFileName').val(FileName);
}
function showModal(data){
    getChart(data);
    $('#ChartModal').modal('toggle');
}
function SaveModal(path){
    var prj = {};
    prj.name = path;
    prj.data = stage.toJson();
    socket.emit('save', prj);
    socket.emit('refresh');
}
function CanLink(src_node,des_node){
  /*  if(node.)*/
    if(des_node.label !="Switch"&& src_node.label !="Switch")
        return false;
    var srclength=src_node.inLinks==null?0:src_node.inLinks.length;
    if(srclength!=0)
        for(var i=0;i<srclength;i++)
            if(src_node.inLinks[i].nodeA._id==des_node._id || src_node.inLinks[i].nodeZ._id==des_node._id)
                return false;
    var deslength=des_node.inLinks==null?0:des_node.inLinks.length;
    if(deslength!=0)
        for(var i=0;i<deslength;i++)
            if(des_node.inLinks[i].nodeA._id==src_node._id || des_node.inLinks[i].nodeZ._id==src_node._id)
                return false;
    return true;
}
function newFile(){
    $('#SubmitModal').modal('toggle');
    $('#inPutFileName').val("");
}
function SubmitNewFile(){
    var name= $('#inPutFileName').val();
    FileName=name;
    $('#choicedFileName').val(FileName);
    scene.clear();
    SaveModal(name);
    /*reFresh();*/
}
function SubmitExistedFile(){
    SaveModal(FileName);
}
function deleteFile(){
    if(FileName!=""){
        socket.emit('delete', FileName);
        FileName="";
        $('#choicedFileName').val(FileName);
        scene.clear();
    }else
        alert("无可用文件！");
}
function runTopo(){
    var prj = {};
    if(FileName!=""){
        prj.name = FileName;
        prj.data = stage.toJson();
        socket.emit('run', prj);
        showMask(true);
    }else
        alert("无可用文件！");
}
function getChart(data) {
     var chart = new Highcharts.Chart({ 
        chart: {
            zoomType: 'x',
            spacingRight: 20,
            renderTo: 'chartShowPanel',
            reflow:true
        },
        credits: {  
                enabled: false     //去掉highcharts网站url  
        } ,  
        title: {
            text: '设备运行状态图'
        },
/*        subtitle: {
            text: document.ontouchstart === undefined ?
                'Click and drag in the plot area to zoom in' :
                'Pinch the chart to zoom in'
        },*/
        lang:{  
            downloadJPEG: "下载JPEG 图片",  
            downloadPDF: "下载PDF文档",  
            downloadPNG: "下载PNG 图片",  
            downloadSVG: "下载SVG 矢量图",  
            exportButtonTitle: "导出图片" ,
            printChart:"打印" 
        },
        xAxis: {
            type: 'linlinear',
            title: {
                text: null
            },
            tickInterval: 30
        },
        yAxis: {
            title: {
                text: '时延/us'
            }
        },
        tooltip: {
            shared: true
        },
        legend: {
            enabled: true
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                lineWidth: 1,
                marker: {
                    enabled: false
                },
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            type: 'area',
            name: '运行时延',
            data: []
        }]
    });
/*    chart.series[0].setData([129.2, 144.0, 176.0])*/
    var showdata = [];
    $(data).each(function(i,val){
        showdata.push(parseFloat(0+val));
    });
    chart.series[0].setData(showdata);
}
function showMask(isShow){
    if(isShow==true){
        $('body').css("overflow","hidden"),
        $("#cover").show();
    }else{
        $('body').css("overflow","hidden"),
        $("#cover").hide();
    }
}
 function isNumeric( obj ) {
    return !isNaN( parseFloat(obj) ) && isFinite( obj );
}