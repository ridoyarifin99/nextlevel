"use strict";
const fs=require("fs"),path=require("path"),vm=require("vm");
function slugify(v){return String(v||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}
function usableSource(u){
  const value=String(u||"").trim();
  if(!value)return false;
  if(/^https?:\/\//i.test(value))return true;
  const clean=value.replace(/^\.\//,"").replace(/^\//,"");
  return fs.existsSync(path.join(__dirname,"..",clean));
}
function uniqueSources(list,primary){
  const seen=new Set(),out=[];
  for(const raw of Array.isArray(list)?list:[]){
    const u=String(raw||"").trim();
    if(!usableSource(u)||u===primary||seen.has(u))continue;
    seen.add(u);out.push(u);
  }
  return out;
}
function uniqueServiceSources(list){
  const seen=new Set(),out=[];
  for(const x of Array.isArray(list)?list:[]){
    if(!x?.url||!usableSource(x.url))continue;
    const key=String(x.url).trim();
    if(seen.has(key))continue;
    seen.add(key);out.push({...x,url:key});
  }
  return out;
}
function loadLegacy(){
  const file=path.join(__dirname,"..","js","details.js"),source=fs.readFileSync(file,"utf8"),marker=source.indexOf("const products"),start=source.indexOf("[",marker);
  if(marker<0||start<0)return[];
  let depth=0,quote=null,escaped=false,end=-1;
  for(let i=start;i<source.length;i++){
    const c=source[i];
    if(quote){if(escaped){escaped=false;continue}if(c==="\\"){escaped=true;continue}if(c===quote)quote=null;continue}
    if(c==="'"||c==='"'||c==='`'){quote=c;continue}
    if(c==="[")depth++;else if(c==="]"&&--depth===0){end=i+1;break}
  }
  if(end<0)return[];
  const products=vm.runInNewContext("("+source.slice(start,end)+")",{});
  return(Array.isArray(products)?products:[]).map(p=>{
    const image=String(p.image||"").trim();
    return{
      slug:slugify(p.slug||p.name),name:p.name||"",
      image:usableSource(image)?image:"",
      logo:usableSource(p.logo)?String(p.logo).trim():"",
      images:uniqueSources(p.images,image),
      serviceImages:uniqueServiceSources(p.serviceImages)
    };
  });
}
module.exports=async function(req,res){
  try{
    if(req.method!=="GET"){res.statusCode=405;res.setHeader("Allow","GET");return res.end("Method Not Allowed")}
    const data=loadLegacy();res.statusCode=200;res.setHeader("Content-Type","application/json; charset=utf-8");res.setHeader("Cache-Control","no-store");res.end(JSON.stringify({products:data}))
  }catch(e){console.error(e);res.statusCode=500;res.setHeader("Content-Type","application/json");res.end(JSON.stringify({error:"Unable to read legacy product media"}))}
};
