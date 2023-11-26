import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyAUlqVFqNfKTY34UCA0_jt9kHlTqMgDzi0",
    authDomain: "ar-classroom-1bb48.firebaseapp.com",
    projectId: "ar-classroom-1bb48",
    storageBucket: "ar-classroom-1bb48.appspot.com",
    messagingSenderId: "801778279327",
    appId: "1:801778279327:web:e63f67b115057a5e2c53aa",
    measurementId: "G-DEC44C4SPG"
};
firebase.initializeApp(firebaseConfig);

var urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('GID');
const questionId = urlParams.get('QID');
//console.log("GID", gameId)
var nextButton = document.getElementById('nextButton');
var refreshButton = document.getElementById('refreshButton');
const greenLayer = document.getElementById('greenLayer');

var video = document.createElement('video');
let stream;

navigator.mediaDevices.getUserMedia({ video: true })
.then(function (stream) {
	video.srcObject = stream;
	video.play();
	//document.body.appendChild(video);
})

var texture = new THREE.VideoTexture(video);
var geometry = new THREE.PlaneGeometry(6080, 3420); // 使用適當的平面幾何體
var materialCam = new THREE.MeshBasicMaterial({ map: texture });
var plane = new THREE.Mesh(geometry, materialCam);

texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(1, 1);

if(nextButton){
    nextButton.addEventListener('click', function(){
        goToNext();
    });
}

if(refreshButton){
    refreshButton.addEventListener('click', function(){
        refreshPage();
    });
}

function goToNext(){
	const url = "http://localhost:3000/host/" + gameId + "/results/" + questionId; 
	window.location.href = url;
}

function refreshPage(){
	location.reload();
}

const db = firebase.firestore();


async function getCorrectAnswer (gameId, questionId) {
    try {
        const gameDoc = await db.collection('games').doc(gameId).get();
        if (gameDoc.exists) {
          const questionDoc = await gameDoc.ref
            .collection('questions')
            .doc(questionId)
            .get();
    
            if (questionDoc.exists) {
                return questionDoc.data().correctAnswer;
            } else {
                return 'Question not found';
            }
        } else {
          return 'Game not found';
        }
    } catch (error) {
    console.error('Error getting correct answer:', error);
    return null;
    }
}

const correctAnswer = await getCorrectAnswer(gameId, questionId);

switch (correctAnswer) {
	case 'A':
		greenLayer.style.top = '35px';
		greenLayer.style.left = '0';
		break;
	case 'B':
		greenLayer.style.top = '35px';
		greenLayer.style.left = '50%';
		break;
	case 'C':
		greenLayer.style.top = `calc(50% + 35px)`;
		greenLayer.style.left = '0';
		break;
	case 'D':
		greenLayer.style.top = `calc(50% + 35px)`;
		greenLayer.style.left = '50%';
		break;
}

async function loadAnswers(playerId) {
    const currentQuestionPath = db.doc(`games/${gameId}/questions/${questionId}`);
    const playerPath = db.doc(`games/${gameId}/players/${playerId}`);
    //console.log("Q path:", currentQuestionPath);
    //console.log("P path:", playerPath);
    const answersSnapshot = await db
        .collection('games')
        .doc(gameId)
        .collection('answers')
        .where('player', '==', playerPath)
        .where('question', '==', currentQuestionPath)
        .orderBy('timestamp', 'desc')
        .get();

    var answersData = [];
    
    answersSnapshot.forEach((answerDoc) => {
        const choice = answerDoc.data().choice;
        answersData.push(choice);
        
        //console.log('Answer Document ID:', answerDoc.id);
        //console.log('Answer Document Data:', answerDoc.data());
    });
    //console.log('Answers Data:', answersData);
    if(answersData.length > 0) {
        return answersData[0];
    } else {
        return "noAnswer";
    }
}


async function load() {
    const playersData = [];

    try {
        const playersSnapshot = await db
            .collection('games')
            .doc(gameId)
            .collection('players')
            .get();

        
        for (const playerDoc of playersSnapshot.docs) {
            const playerId = playerDoc.id;
            const playerName = playerDoc.data().name;

            //console.log('Loading data for player:', playerId);

            const answersData = await loadAnswers(playerId);
			//console.log(playerName, 'answers:', answersData);
            var svgRef = ref(storage, `svgs/${playerId}.svg `);
            loadSVG(svgRef, playerName, answersData);

            playersData.push({ playerId, playerName, answers: answersData });
        }
        //console.log('Final Players Data:', playersData);
        //return playersData;
    } catch (error) {
        console.error('Error getting players collection:', error);
        throw error;
    }
}
/*load()
.then(playersData => {
  playersData.forEach(player => {
	
	const playerId = player.playerId;
	const playerName = player.playerName;
	const answer = player.answersData;
	//console.log('Player ID:', playerId);
	//console.log('Player Name:', playerName);
	console.log('Player Ans:', answer);
	
  });
})
.catch(error => {

  console.error('Error:', error);
});*/

const storage = getStorage();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.02, 2000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 100 });
var points = [];



scene.add(plane);

points.push( new THREE.Vector3( - 10000, 0, 0 ) );
points.push( new THREE.Vector3( 10000, 0, 0 ) );
points.push( new THREE.Vector3( 0, 10000 , 0 ) );
points.push( new THREE.Vector3( 0, -10000, 0 ) );

var geometry = new THREE.BufferGeometry().setFromPoints( points );
var line = new THREE.Line( geometry, material );
scene.add( line );

const textloader = new FontLoader();
		textloader.load('../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function (font) {
			// 創建文字的幾何形狀
			const texts = ['A', 'B', 'C', 'D'];
			const i=0;
            
            console.log("correctAnswerForFont", correctAnswer)

			for (let i = 0; i < texts.length; i++){
				const ltr = texts[i];  
				const textGeometry = new TextGeometry(ltr, {
					font: font,
					size: 160, 
					height: 0.1, 
					curveSegments: 12, // 曲線細分數
					bevelEnabled: false // 是否啟用斜角
				});
				
                var material;
                //if(texts[i] === correctAnswer){
                material = new THREE.MeshBasicMaterial({ color: 0x000000 });
                //} else {
                   // material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                //}
				

				const textMesh = new THREE.Mesh(textGeometry, material);

				if(i==0){
					textMesh.position.x = -170;
					textMesh.position.y = 20;
				}
				else if(i==1){
					textMesh.position.x = 30;
					textMesh.position.y = 20;
				}
				else if(i==2){
					textMesh.position.x = -170; 
					textMesh.position.y = -180;
				}
				else if(i==3){
					textMesh.position.x = 30;
					textMesh.position.y = -180; 
				}
				scene.add(textMesh);
			}
});

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomColor() {
	// 生成 RGB 颜色值
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

async function loadSVG(svgRef, playerName, playerAns) {
    //console.log("correctAnswer", correctAnswer);
    console.log(playerAns);
    renderer.setClearAlpha(0.2);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

	//console.log("inName", playerName)
	//console.log("in", svgRef)
    camera.position.z = 2000;
    let group;
	
    const svgloader = new SVGLoader();
	//const SID = window.location.search.substring(1).split("=")[1];
	//console.log("GID", gameId);

    //greenLayer.style.width = '50%';
    //greenLayer.style.height = '50%';

    try {
		const url = await getDownloadURL(svgRef);
        const displayUrl = url;
        const data = await new Promise((resolve, reject) => {
            svgloader.load(displayUrl, resolve, null, reject);
			
        });
		//console.log(displayUrl);
        const paths = data.paths;
		var randomColor = getRandomColor();

        group = new THREE.Group();
		
        for (let i = 0; i < paths.length; i++) {
			
            const path = paths[i];
            const matrix = new THREE.Matrix4();
            matrix.makeScale(1, -1, 1);


            const material = new THREE.MeshBasicMaterial({
                color: randomColor,
                side: THREE.DoubleSide,
                depthWrite: false,
            });

			const outlineMaterial = new THREE.LineBasicMaterial({
				color: 0x000000,  // 描边的颜色
				linewidth: 5,
				//side: THREE.BackSide,
			});


            if (path.toShapes) {
                const shapes = SVGLoader.createShapes(path);

                for (let j = 0; j < shapes.length; j++) {
                    const shape = shapes[j];
                    const geometry = new THREE.ShapeGeometry(shape);
                    const mesh = new THREE.Mesh(geometry, material);

                    mesh.position.applyMatrix4(matrix);
                    mesh.scale.applyMatrix4(matrix);

                    group.add(mesh);

					const outlineGeometry = new THREE.BufferGeometry().setFromPoints(shape.getPoints());
					const outlineMesh = new THREE.LineLoop(outlineGeometry, outlineMaterial);

					outlineMesh.position.applyMatrix4(matrix);
					outlineMesh.scale.applyMatrix4(matrix);

					group.add(outlineMesh);
                }
            }
        }

        scene.add(group);

		textloader.load('../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function (font) {
			// 創建文字的幾何形狀
			//const name = 'kenbecky';
			
			const textGeometry = new TextGeometry(playerName, {
				font: font,
				size: 70, // 文字大小
				height: 0.1, // 文字厚度
				curveSegments: 12, // 曲線細分數
				bevelEnabled: false, // 是否啟用斜角
			});

			// 創建文字的材質
			const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

			// 創建文字物體
			const textMesh = new THREE.Mesh(textGeometry, material);
			const textSize = new THREE.Vector3();
			textMesh.position.set(240, 50, 0);
			

			group.add(textMesh);
			//console.log('Text Mesh Size:', textSize);
			scene.add(group);
			
		});

        camera.lookAt( 0, 0, 0 );
		
		var randomInt1;
		var randomInt2;
		do{
		 	randomInt1 = Math.floor(Math.random() * 21) - 10;
			randomInt2 = Math.floor(Math.random() * 21) - 10;
			
		}while(randomInt1 === randomInt2 === 0);
				  
		let speedx = randomInt1;
		let speedy = randomInt2;

		/*let edge_top = 800;
		let edge_bottom = -800;
		let edge_left = -1000;
		let edge_right = 1000;*/
		if(playerAns === 'A'){
			group.position.x = getRandomInt(-600, -1800);
			group.position.y = getRandomInt(1200,500);
		}else if(playerAns === 'B' || playerAns === 'noAnswer'){
			group.position.x = getRandomInt(0, 1800);
			group.position.y = getRandomInt(1200,500);
		}else if(playerAns === 'C'){
			group.position.x = getRandomInt(-600, -1800);
			group.position.y = getRandomInt(-1300,-500);
		}else if(playerAns === 'D'){
			group.position.x = getRandomInt(0, 1800);
			group.position.y = getRandomInt(-1300,-500);
		}
		
		var svgGroups = [];
		var rotationAngle = 0;
    	var rotationSpeed = Math.PI / 90;
		var geometry = (group.children[0].geometry);
		geometry.computeBoundingBox();

		var boundingBox = geometry.boundingBox;
		var center = new THREE.Vector3();
		boundingBox.getCenter(center);
		//group.position.set(350, 180, center.z);
		//console.log(playerName,center.x, center.y, center.z)
	
		svgGroups.push(group);
		scene.add(group);

		console.log(correctAnswer);

		function animate() {
			//requestAnimationFrame(animate);
			renderer.render( scene, camera );
            //greenLayer.style.opacity = 0.5;
			
            
			if (group) { 

				if(playerAns === correctAnswer){
					rotationAngle += rotationSpeed;
					
					if (rotationAngle > Math.PI / 4 || rotationAngle < -Math.PI / 4) {
						rotationSpeed = -rotationSpeed;
					}
					group.rotation.z += rotationSpeed;
				}
				
				/*if(playerAns === correctAnswer){
					group.rotation.z += rotationSpeed;
				} else {

				}*/
				
				
				//console.log(group.rotation.z)
				/*switch (true) {
					case playerAns === 'A':
						edge_top = 800;
						edge_bottom = 250;
						edge_left = -1500;
						edge_right = -400;
						break;
					case playerAns === 'B' || playerAns === 'noAnswer':
						edge_top = 800;
						edge_bottom = 250;
						edge_left = 0;
						edge_right = 1300;
						break;
					case playerAns === 'C':
						edge_top = 0;
						edge_bottom = -600;
						edge_left = -1500;
						edge_right = -400;
						break;
					case playerAns === 'D':
						edge_top = 0;
						edge_bottom = -600;
						edge_left = 0;
						edge_right = 1300;
						break;
				}
				//group.position.x += speedx;
				//group.position.y += speedy;
				
				//console.log(speedx, speedy)
				if(group.position.x >= edge_right)
					speedx = 0-speedx;
				else if(group.position.x < edge_left)
					speedx = 0-speedx;
				if(group.position.y > edge_top)
					speedy = 0-speedy;
				else if(group.position.y < edge_bottom)
					speedy = 0-speedy;*/

				//console.log(`X: ${group.position.x}, Y: ${group.position.y}`);
				//console.log(`X: ${window.innerWidth}, Y: ${window.innerHeight}`);
			}
			requestAnimationFrame(animate);
		}
		animate();
		} catch (error) {
			console.error("An error occurred:", error);
		}
}

load();