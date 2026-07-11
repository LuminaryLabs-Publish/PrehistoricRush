import { createPrehistoricRushKitGraph } from "./domains/prehistoric-rush/prehistoric-rush-domain-kit.js";

const CDN = {
  nexus: "https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusEngine@main/src/index.js",
  three: "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js",
  rapier: "https://cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@0.15.0/rapier.es.js",
  rapierKit: "https://cdn.jsdelivr.net/gh/LuminaryLabs-Agents/NexusRealtime-ProtoKits@main/protokits/rapier-physics-domain-kit/index.js"
};
const cfg = { seed: 238991, chunk: 56, radius: 3, segments: 30, trees: 7, grass: 70, goal: 3600 };
const treeTypes = [
  [34,58,2.5,10.5,18,0x214f28],[38,68,1.8,7.5,26,0x173c26],[14,24,1.25,7.2,5,0x2d6638],[28,48,2.1,9.2,15,0x315a2d],[30,52,2.35,3.5,9,0x5d4933]
];
const load = async url => { try { return await import(url); } catch (error) { console.warn(url, error); return null; } };
const hash = (x,z,s=1) => { let h=Math.imul(x|0,374761393)^Math.imul(z|0,668265263)^Math.imul(s|0,1442695041); h=Math.imul(h^(h>>>13),1274126177); return ((h^(h>>>16))>>>0)/4294967295; };
const noise = (x,z) => Math.sin((x+cfg.seed)*.019)*1.6+Math.cos((z-cfg.seed)*.022)*1.3+Math.sin((x+z)*.008)*2.6+Math.cos((x-z)*.006)*1.7;

function shell(){
  const root=document.querySelector("#app")??document.body; root.innerHTML="";
  Object.assign(document.body.style,{margin:0,overflow:"hidden",background:"#09130d",color:"#fff8dc",fontFamily:"system-ui,sans-serif"});
  const host=document.createElement("section"), panel=document.createElement("aside"), status=document.createElement("div"), button=document.createElement("button");
  Object.assign(host.style,{position:"fixed",inset:0});
  Object.assign(panel.style,{position:"fixed",top:"14px",left:"16px",minWidth:"292px",padding:"12px 14px",borderRadius:"16px",background:"rgba(7,14,9,.72)",zIndex:4});
  Object.assign(button.style,{marginTop:"10px",padding:"9px 14px",borderRadius:"999px",background:"#ffd37a",fontWeight:800});
  panel.append(status,button); root.append(host,panel); return {host,status,button};
}

async function rapierAdapter(){
  const [R,K]=await Promise.all([load(CDN.rapier),load(CDN.rapierKit)]); const store=new Map();
  const world={getResource:r=>store.get(r?.name??r),setResource:(r,v)=>store.set(r?.name??r,v),emit(){}}; const engine={n:{}};
  const kit=K?.createRapierPhysicsKit?.({},{}); kit?.initWorld?.({world,engine}); kit?.install?.({world,engine}); if(R?.init) await R.init();
  const api=engine.n.rapierPhysics; api?.configure?.({rapier:R,gravity:{x:0,y:-34,z:0}}); api?.registerKinematicActor?.({id:"dino",shape:"capsule",halfHeight:.42,radius:.32}); return api??null;
}

function grassGeometry(T,planes){
  const p=[],u=[],i=[]; let offset=0;
  for(let n=0;n<planes;n++){ const g=new T.PlaneGeometry(1,1,1,3); g.translate(0,.5,0); g.rotateY(Math.PI*n/planes);
    for(let v=0;v<g.attributes.position.count;v++){p.push(g.attributes.position.getX(v),g.attributes.position.getY(v),g.attributes.position.getZ(v));u.push(g.attributes.uv.getX(v),g.attributes.uv.getY(v));}
    for(let v=0;v<g.index.count;v++)i.push(g.index.getX(v)+offset); offset+=g.attributes.position.count;
  }
  const out=new T.BufferGeometry(); out.setIndex(i); out.setAttribute("position",new T.Float32BufferAttribute(p,3)); out.setAttribute("uv",new T.Float32BufferAttribute(u,2)); return out;
}
function grassMaterial(T,color){ return new T.ShaderMaterial({side:T.DoubleSide,alphaTest:.34,uniforms:{time:{value:0},wind:{value:.2},color:{value:new T.Color(color)}},vertexShader:`uniform float time;uniform float wind;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;float t=clamp(p.y,0.,1.);vec4 w=instanceMatrix*vec4(p,1.);p.x+=sin(time*1.45+w.x*.15+w.z*.11)*wind*t*t;p.z+=cos(time*1.1+w.z*.13)*wind*.35*t;gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(p,1.);}`,fragmentShader:`uniform vec3 color;varying vec2 vUv;void main(){float a=(1.-smoothstep(.38,.5,abs(vUv.x-.5)))*smoothstep(0.,.18,vUv.y)*(1.-smoothstep(.86,1.,vUv.y));if(a<.34)discard;gl_FragColor=vec4(color,1.);}`}); }

function createAdapter(T,game,physics,ui){
  const route=game.route, scene=new T.Scene(); scene.background=new T.Color(0x15251b); scene.fog=new T.FogExp2(0x203326,.0125);
  const camera=new T.PerspectiveCamera(62,innerWidth/innerHeight,.1,900), renderer=new T.WebGLRenderer({antialias:true,powerPreference:"high-performance"});
  renderer.setSize(innerWidth,innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio||1,2)); renderer.shadowMap.enabled=true; renderer.outputColorSpace=T.SRGBColorSpace; renderer.toneMapping=T.ACESFilmicToneMapping; ui.host.append(renderer.domElement);
  scene.add(new T.HemisphereLight(0xb9d0b2,0x182015,1.4)); const sun=new T.DirectionalLight(0xffe6b2,2.2); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048); scene.add(sun,sun.target);
  const terrainGroup=new T.Group(), chunks=[], terrainMat=new T.MeshStandardMaterial({vertexColors:true,roughness:.94}); scene.add(terrainGroup);
  function baseGeometry(){const p=[],c=[],ix=[];for(let z=0;z<=cfg.segments;z++)for(let x=0;x<=cfg.segments;x++){p.push((x/cfg.segments-.5)*cfg.chunk,0,(z/cfg.segments-.5)*cfg.chunk);c.push(.2,.4,.18);}for(let z=0;z<cfg.segments;z++)for(let x=0;x<cfg.segments;x++){const a=z*(cfg.segments+1)+x,b=a+1,d=a+cfg.segments+1,e=d+1;ix.push(a,d,b,b,d,e);}const g=new T.BufferGeometry();g.setIndex(ix);g.setAttribute("position",new T.Float32BufferAttribute(p,3));g.setAttribute("color",new T.Float32BufferAttribute(c,3));return g;}
  for(let z=-cfg.radius;z<=cfg.radius;z++)for(let x=-cfg.radius;x<=cfg.radius;x++){const mesh=new T.Mesh(baseGeometry(),terrainMat);mesh.receiveShadow=true;terrainGroup.add(mesh);chunks.push({mesh,x,z});}
  const sample=(x,z)=>{const n=route.nearest(x,z,0,route.samples.length);return noise(x,z)-Math.max(0,1-n.distance/(n.width+2.4))*.34;}; game.setHeightSampler(sample);
  let terrainKey=""; function updateTerrain(x,z){const cx=Math.floor(x/cfg.chunk),cz=Math.floor(z/cfg.chunk),key=`${cx}:${cz}`;if(key===terrainKey)return false;terrainKey=key;for(const ch of chunks){const px=cx+ch.x,pz=cz+ch.z,a=ch.mesh.geometry.attributes.position,col=ch.mesh.geometry.attributes.color;for(let n=0;n<a.count;n++){const wx=px*cfg.chunk+a.getX(n),wz=pz*cfg.chunk+a.getZ(n),near=route.nearest(wx,wz,0,route.samples.length),r=route.classify(near.distance,near.width),b=r==="path"?[.36,.25,.13]:r==="edge"?[.34,.36,.16]:r==="verge"?[.18,.39,.18]:[.11,.29,.13];a.setY(n,sample(wx,wz));col.setXYZ(n,...b);}a.needsUpdate=col.needsUpdate=true;ch.mesh.geometry.computeVertexNormals();ch.mesh.position.set(px*cfg.chunk,0,pz*cfg.chunk);}return true;}
  const dummy=new T.Object3D(), trunkMat=new T.MeshStandardMaterial({color:0x5b4028,roughness:.98});
  const trees=treeTypes.map(t=>({type:t,trunk:new T.InstancedMesh(new T.CylinderGeometry(.7,1.15,1,10),trunkMat,160),crown:new T.InstancedMesh(new T.IcosahedronGeometry(1,2),new T.MeshStandardMaterial({color:t[5],roughness:.92}),160),count:0})); trees.forEach(o=>scene.add(o.trunk,o.crown));
  const grass=[{h:.26,w:.46,m:new T.InstancedMesh(grassGeometry(T,2),grassMaterial(T,0x254f24),3600)},{h:.78,w:.72,m:new T.InstancedMesh(grassGeometry(T,3),grassMaterial(T,0x356d2e),2600)},{h:1.28,w:.9,m:new T.InstancedMesh(grassGeometry(T,3),grassMaterial(T,0x4c8238),1300)}];grass.forEach(g=>scene.add(g.m));
  const shards=new T.InstancedMesh(new T.OctahedronGeometry(.34),new T.MeshStandardMaterial({color:0x8fe8ff,emissive:0x43d4ff,emissiveIntensity:1}),240);scene.add(shards);
  const player=game.dinoBody.createSkinnedBody(T);scene.add(player); const view={key:"",colliders:[],pickups:[],time:0};
  function populate(state){const cx=Math.floor(state.x/cfg.chunk),cz=Math.floor(state.z/cfg.chunk),key=`${cx}:${cz}`;if(key===view.key)return;view.key=key;view.colliders=[];view.pickups=[];trees.forEach(t=>t.count=0);const gc=[0,0,0];let sc=0;
    for(let zc=cz-cfg.radius;zc<=cz+cfg.radius;zc++)for(let xc=cx-cfg.radius;xc<=cx+cfg.radius;xc++){
      for(let n=0;n<cfg.trees;n++){const x=xc*cfg.chunk+(hash(xc*31+n,zc*17,11)-.5)*cfg.chunk,z=zc*cfg.chunk+(hash(xc*19,zc*23+n,13)-.5)*cfg.chunk,near=route.nearest(x,z,state.routeIndex,180);if(near.distance<near.width+5.5)continue;const type=Math.floor(hash(xc+n,zc-n,41)*trees.length)%trees.length,pool=trees[type],t=pool.type;if(pool.count>=pool.trunk.count)continue;const h=t[0]+hash(xc,zc,n+47)*(t[1]-t[0]),r=t[2]*(.82+hash(n,xc,61)*.42),idx=pool.count++;dummy.position.set(x,sample(x,z)+h*.5,z);dummy.scale.set(r,h,r);dummy.updateMatrix();pool.trunk.setMatrixAt(idx,dummy.matrix);dummy.position.set(x,sample(x,z)+h*.78,z);dummy.scale.set(t[3],t[4],t[3]);dummy.updateMatrix();pool.crown.setMatrixAt(idx,dummy.matrix);view.colliders.push({id:`tree-${xc}-${zc}-${n}`,x,z,radius:r*1.3});}
      for(let n=0;n<cfg.grass;n++){const x=xc*cfg.chunk+(hash(xc*71+n,zc*37,79)-.5)*cfg.chunk,z=zc*cfg.chunk+(hash(xc*43,zc*59+n,83)-.5)*cfg.chunk,near=route.nearest(x,z,state.routeIndex,190),region=route.classify(near.distance,near.width);if(region==="path")continue;const li=region==="edge"?0:region==="verge"?(hash(n,xc,89)>.48?1:2):(hash(n,zc,97)>.28?1:0),g=grass[li],idx=gc[li]++;if(idx>=g.m.count)continue;const scale=region==="edge"?.22:region==="verge"?.72:1;dummy.position.set(x,sample(x,z),z);dummy.rotation.y=hash(n,zc,109)*Math.PI;dummy.scale.set(g.w,g.h*scale,g.w);dummy.updateMatrix();g.m.setMatrixAt(idx,dummy.matrix);}
      for(let n=0;n<2&&sc<shards.count;n++){const id=`${xc}:${zc}:${n}`;if(state.collectedShardIds.includes(id))continue;const point=route.samples[Math.max(0,Math.min(route.samples.length-1,state.routeIndex+Math.floor(hash(xc,zc,n+149)*100)-20))],x=point.x+(hash(n,xc,151)*2-1)*Math.min(point.width*.65,2.1),z=point.z;dummy.position.set(x,sample(x,z)+1.15,z);dummy.scale.setScalar(1);dummy.updateMatrix();shards.setMatrixAt(sc++,dummy.matrix);view.pickups.push({id,x,z,radius:1.1});}
    }
    trees.forEach(t=>{t.trunk.count=t.crown.count=t.count;t.trunk.instanceMatrix.needsUpdate=t.crown.instanceMatrix.needsUpdate=true;});grass.forEach((g,i)=>{g.m.count=gc[i];g.m.instanceMatrix.needsUpdate=true;});shards.count=sc;shards.instanceMatrix.needsUpdate=true;physics?.setFixedColliders?.(view.colliders.map(c=>({...c,shape:"ball",y:sample(c.x,c.z),tags:["hazard","tree"]})));}
  return {scene,camera,renderer,sun,player,grass,shards,view,sample,updateTerrain,populate,render(state,dt){view.time+=dt;player.position.set(state.x,state.y+state.jumpHeight+.05,state.z);player.rotation.y=state.yaw;game.dinoBody.applyPose(player,{speed:state.speed,time:state.elapsed,turn:game.getInput().steer,jump:Math.min(1,state.jumpHeight/2),resistance:1-state.surfaceMultiplier});const ahead=route.samples[Math.min(route.samples.length-1,state.routeIndex+12)]??route.samples[state.routeIndex],back=new T.Vector3(-Math.sin(state.yaw),0,-Math.cos(state.yaw));camera.position.lerp(new T.Vector3(state.x,state.y+2.35,state.z).addScaledVector(back,6.6),1-Math.exp(-8.5*dt));camera.lookAt(ahead.x,sample(ahead.x,ahead.z)+1.15,ahead.z);sun.position.set(state.x-25,state.y+45,state.z-20);sun.target.position.set(state.x,state.y,state.z);grass.forEach(g=>{g.m.material.uniforms.time.value=view.time;g.m.material.uniforms.wind.value=.22;});shards.rotation.y+=dt*.8;renderer.render(scene,camera);}};
}

async function main(){
  const ui=shell(),[N,T,physics]=await Promise.all([load(CDN.nexus),load(CDN.three),rapierAdapter()]); if(!N||!T)throw new Error("Required runtime failed to load.");
  const engine=N.createRealtimeGame({kits:createPrehistoricRushKitGraph(N,{seed:cfg.seed,goalDistance:cfg.goal})}),game=engine.n.prehistoricRush; if(!game)throw new Error("PrehistoricRush domain did not install.");
  const adapter=createAdapter(T,game,physics,ui),input={left:false,right:false,boost:false}; adapter.updateTerrain(0,0); game.start(); adapter.populate(game.getState());
  const start=()=>{game.start();adapter.view.key="";adapter.populate(game.getState());}; ui.button.onclick=()=>game.getState().status==="game"?game.setInput({jump:true}):start();
  addEventListener("keydown",e=>{if(["ArrowLeft","ArrowRight","ArrowUp","Space"].includes(e.code))e.preventDefault();if(e.code==="Enter")start();if(["KeyA","ArrowLeft"].includes(e.code))input.left=true;if(["KeyD","ArrowRight"].includes(e.code))input.right=true;if(["KeyW","ArrowUp"].includes(e.code))input.boost=true;if(e.code==="Space")game.getState().status==="game"?game.setInput({jump:true}):start();});
  addEventListener("keyup",e=>{if(["KeyA","ArrowLeft"].includes(e.code))input.left=false;if(["KeyD","ArrowRight"].includes(e.code))input.right=false;if(["KeyW","ArrowUp"].includes(e.code))input.boost=false;});
  addEventListener("blur",()=>{input.left=input.right=input.boost=false;game.setInput({steer:0,boost:false,jump:false});});
  addEventListener("resize",()=>{adapter.camera.aspect=innerWidth/innerHeight;adapter.camera.updateProjectionMatrix();adapter.renderer.setSize(innerWidth,innerHeight);});
  let last=performance.now(); function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;game.setInput({steer:(input.left?1:0)-(input.right?1:0),boost:input.boost});engine.tick(dt);let state=game.getState();if(adapter.updateTerrain(state.x,state.z)){adapter.view.key="";adapter.populate(state);}if(state.status==="game"){physics?.setActorTransform?.("dino",{x:state.x,y:state.y+state.jumpHeight+.62,z:state.z});const contacts=physics?.step?.(dt)?.contacts??[],hit=contacts.some(c=>c.actorId==="dino")||adapter.view.colliders.some(c=>Math.hypot(c.x-state.x,c.z-state.z)<c.radius+.32&&state.jumpHeight<1.05);if(hit)game.fail({kind:"tree-impact",x:state.x,z:state.z});for(const p of adapter.view.pickups)if(Math.hypot(p.x-state.x,p.z-state.z)<p.radius+.4&&game.collectShard(p.id)){adapter.view.key="";adapter.populate(game.getState());break;}state=game.getState();}adapter.render(state,dt);const progress=Math.min(1,state.distance/cfg.goal);ui.status.innerHTML=`<b style="color:#ffd37a">Prehistoric Rush</b><br>${state.status}<div style="height:7px;background:#ffffff22;margin:8px 0"><div style="height:100%;width:${(progress*100).toFixed(1)}%;background:#84d778"></div></div>${Math.floor(state.distance)}m / ${cfg.goal}m · ${state.shards} shards<br>${state.speed.toFixed(1)} m/s · ${state.region} × ${state.surfaceMultiplier.toFixed(2)}<br><small>one game domain · NexusEngine core kits</small>`;ui.button.textContent=state.status==="game"?"Jump":state.status==="run-over"?"Retry":state.status==="win"?"Run Again":"Start Rush";requestAnimationFrame(loop);}globalThis.PrehistoricRushHost={engine,physics,adapter,getState:()=>({game:game.snapshot(),composition:engine.gameComposer,scene:engine.coreScene?.getSceneHostDescriptor?.(),renderer:"three-thin-adapter-v3"})};requestAnimationFrame(loop);
}
main().catch(error=>{console.error(error);document.body.textContent=`Could not start PrehistoricRush: ${error.message}`;});