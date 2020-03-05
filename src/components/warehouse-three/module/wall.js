import * as THREE from 'three';
export default function(width, height, depth, position, rotation, color) {
    let texture = new THREE.TextureLoader().load('/threejs/img/wall.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 1, 1 );
    let floorGeometry = new THREE.BoxGeometry(width, height, depth);
    // 如果传了color则使用color，否则使用默认材质
    let floorMaterial = color ? new THREE.MeshBasicMaterial({ color: 0x7e7a71 }) : new THREE.MeshBasicMaterial({ map: texture });
    // let floorMaterial = new THREE.MeshNormalMaterial({ color: color ? `0x${color}` : '0xf3e9c0' });
    let wall = new THREE.Mesh(floorGeometry, floorMaterial);
    if(position.x) wall.position.x = position.x;
    if(position.y) wall.position.y = position.y;
    if(position.z) wall.position.z = position.z;
    if(rotation) {
        if(rotation.x) wall.rotation.x = rotation.x;
        if(rotation.y) wall.rotation.y = rotation.y;
        if(rotation.z) wall.rotation.z = rotation.z;
    };
    wall.name = '墙面';
    return wall;
};
