import * as THREE from 'three';
export default function(zoneObj) {
    let zoneGroup = new THREE.Group();
    zoneGroup.name = zoneObj.name;
    const colors = [ 0x50d0fa, 0xfaf450, 0xfa5050, 0x50faa4, 0xa850fa, 0x50fae4, 0xfa50a4, 0xfaac50 ];
    var colorIndex = 0;
    // 生成父级存储区
    creatMesh(zoneObj);
    // 递归调用生成各级存储区
    function creatMesh(zone) {
        // 多级颜色用以区分多级存储区
        let geometry = new THREE.BoxGeometry(zone.width, 0.01, zone.depth);
        // console.log('colors', colorIndex, colors[colorIndex]);
        let material = new THREE.MeshBasicMaterial({ color: colors[colorIndex] });
        if(colorIndex < colors.length) {
            colorIndex++;
        } else {
            colorIndex = 0;
        };
        
        // console.log('colors', colorIndex, colors[colorIndex]);
        let zoneMesh = new THREE.Mesh(geometry, material);
        let zonePos = zone.position;
        if(zonePos.x) zoneMesh.position.x = zonePos.x;
        if(zonePos.y) zoneMesh.position.y = zonePos.y;
        if(zonePos.z) zoneMesh.position.z = zonePos.z;
        // zoneMesh.rotation.x = Math.PI / 2;
        zoneGroup.add(zoneMesh);
        // 遍历子级，分别创建子级存储区
        if(zone.children && zone.children[0]) {
            zone.children.forEach(child => {
                creatMesh(child);
            });
        };
    };
    return zoneGroup;
};
