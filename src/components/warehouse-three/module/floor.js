import * as THREE from 'three';
// 参数：物体长，宽，高，位置(x,y,z), 旋转(x,y,z)
export default function(width, height, depth, position, rotation) {
    let texture = new THREE.TextureLoader().load('/threejs/img/floor.jpg');
    console.log('texture', texture);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    let floorGeometry = new THREE.BoxGeometry(width, height, depth);
    let floorMaterial = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide });
    // let floorMaterial = new THREE.MeshBasicMaterial({ color: '0xff00ff' });
    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    // 位置
    if(position.x) floor.position.x = position.x;
    if(position.y) floor.position.y = position.y;
    if(position.z) floor.position.z = position.z;
    // 旋转
    if(rotation) { 
        if(rotation.x) floor.rotation.x = rotation.x;
        if(rotation.y) floor.rotation.y = rotation.y;
        if(rotation.z) floor.rotation.z = rotation.z;
    };
    floor.name = '地面';
    return floor;
};