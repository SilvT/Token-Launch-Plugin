var oe=Object.defineProperty,Ze=Object.defineProperties,Qe=Object.getOwnPropertyDescriptor,et=Object.getOwnPropertyDescriptors,tt=Object.getOwnPropertyNames,$e=Object.getOwnPropertySymbols;var Re=Object.prototype.hasOwnProperty,ot=Object.prototype.propertyIsEnumerable;var ve=(p,e,t)=>e in p?oe(p,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):p[e]=t,y=(p,e)=>{for(var t in e||(e={}))Re.call(e,t)&&ve(p,t,e[t]);if($e)for(var t of $e(e))ot.call(e,t)&&ve(p,t,e[t]);return p},k=(p,e)=>Ze(p,et(e));var w=(p,e)=>()=>(p&&(e=p(p=0)),e);var we=(p,e)=>{for(var t in e)oe(p,t,{get:e[t],enumerable:!0})},rt=(p,e,t,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of tt(e))!Re.call(p,r)&&r!==t&&oe(p,r,{get:()=>e[r],enumerable:!(o=Qe(e,r))||o.enumerable});return p};var it=p=>rt(oe({},"__esModule",{value:!0}),p);var h=(p,e,t)=>ve(p,typeof e!="symbol"?e+"":e,t);var re,Fe=w(()=>{"use strict";re=class{constructor(e={}){h(this,"config");h(this,"errors",[]);h(this,"warnings",[]);h(this,"processedNodes",0);h(this,"totalNodes",0);h(this,"processedVariables",new Set);h(this,"variableRegistry",new Map);this.config=y({includeLocalStyles:!0,includeComponentTokens:!0,includeVariables:!0,traverseInstances:!1,maxDepth:10,includeHiddenLayers:!1,includeMetadata:!0},e)}async extractAllTokens(){try{this.resetState(),this.log("Starting comprehensive token extraction...");let e={tokens:[],variables:[],collections:[],metadata:{extractedAt:new Date,documentId:figma.fileKey||"",documentName:figma.root.name,totalNodes:0,processedNodes:0,errors:[],warnings:[]}};this.totalNodes=0,e.metadata.totalNodes=this.totalNodes,this.config.includeVariables&&await this.populateVariableRegistry();let t=[];if(this.config.includeVariables){let o=this.extractVariables().then(({variables:r,collections:i})=>{e.variables=r,e.collections=i});t.push(o)}return this.config.includeVariables&&(await Promise.all(t),t.length=0),this.config.includeLocalStyles&&t.push(this.extractStyleTokens().then(o=>{e.tokens.push(...o)})),this.config.includeComponentTokens&&t.push(this.extractComponentTokens().then(o=>{e.tokens.push(...o)})),await Promise.all(t),e.metadata.processedNodes=this.processedNodes,e.metadata.errors=this.errors,e.metadata.warnings=this.warnings,this.log(`Extraction complete. Found ${e.tokens.length} tokens, ${e.variables.length} variables, ${e.collections.length} collections`),e}catch(e){let t=e instanceof Error?e.message:String(e);throw this.addError("Critical extraction failure","critical",{error:t}),e}}async extractColorTokens(){let e=[];try{let t=figma.getLocalPaintStyles();for(let r of t)try{let i=this.convertPaintStyleToColorToken(r);i&&e.push(i)}catch(i){let n=i instanceof Error?i.message:String(i);this.addError(`Failed to process paint style: ${r.name}`,"error",{styleId:r.id,error:n})}let o=await this.extractColorVariables();return e.push(...o),this.log(`Extracted ${e.length} color tokens`),e}catch(t){let o=t instanceof Error?t.message:String(t);return this.addError("Failed to extract color tokens","error",{error:o}),[]}}async extractTypographyTokens(){let e=[];try{let t=figma.getLocalTextStyles();for(let r of t)try{let i=this.convertTextStyleToTypographyToken(r);i&&e.push(i)}catch(i){let n=i instanceof Error?i.message:String(i);this.addError(`Failed to process text style: ${r.name}`,"error",{styleId:r.id,error:n})}let o=await this.extractTypographyVariables();return e.push(...o),this.log(`Extracted ${e.length} typography tokens`),e}catch(t){let o=t instanceof Error?t.message:String(t);return this.addError("Failed to extract typography tokens","error",{error:o}),[]}}async extractSpacingTokens(){let e=[];try{let t=figma.root.findAll(r=>r.type==="COMPONENT"||r.type==="COMPONENT_SET");for(let r of t)try{let i=this.extractSpacingFromNode(r);i&&e.push(i)}catch(i){let n=i instanceof Error?i.message:String(i);this.addError(`Failed to extract spacing from component: ${r.name}`,"error",{nodeId:r.id,error:n})}let o=await this.extractSpacingVariables();return e.push(...o),this.log(`Extracted ${e.length} spacing tokens`),e}catch(t){let o=t instanceof Error?t.message:String(t);return this.addError("Failed to extract spacing tokens","error",{error:o}),[]}}async extractEffectTokens(){let e=[];try{let t=figma.getLocalEffectStyles();for(let r of t)try{let i=this.convertEffectStyleToEffectToken(r);i&&e.push(i)}catch(i){let n=i instanceof Error?i.message:String(i);this.addError(`Failed to process effect style: ${r.name}`,"error",{styleId:r.id,error:n})}let o=await this.extractEffectVariables();return e.push(...o),this.log(`Extracted ${e.length} effect tokens`),e}catch(t){let o=t instanceof Error?t.message:String(t);return this.addError("Failed to extract effect tokens","error",{error:o}),[]}}async extractVariables(){try{this.log("Extracting Figma variables...");let e=[],t=[],o=figma.variables.getLocalVariableCollections();for(let r of o)try{let i=await this.processVariableCollection(r);e.push(i),t.push(...i.variables)}catch(i){this.addError(`Failed to process variable collection: ${r.name}`,"error",{collectionId:r.id,error:i instanceof Error?i.message:String(i)})}return this.log(`Extracted ${t.length} variables from ${e.length} collections`),{variables:t,collections:e}}catch(e){let t=e instanceof Error?e.message:String(e);return this.addError("Failed to extract variables","error",{error:t}),{variables:[],collections:[]}}}convertPaintStyleToColorToken(e){try{if(!e.paints||e.paints.length===0)return this.addWarning(`Paint style ${e.name} has no paints`),null;let t=e.paints[0];if(t.type==="SOLID"){let{r:o,g:r,b:i}=t.color,n=t.opacity!==void 0?t.opacity:1;return{id:e.id,name:e.name,description:e.description,type:"color",value:{hex:this.rgbToHex(o,r,i),rgb:{r:Math.round(o*255),g:Math.round(r*255),b:Math.round(i*255)},hsl:this.rgbToHsl(o,r,i),hsb:this.rgbToHsb(o,r,i),alpha:n},metadata:this.createTokenMetadata(e),figmaNodeId:e.id}}else{if(t.type==="GRADIENT_LINEAR"||t.type==="GRADIENT_RADIAL"||t.type==="GRADIENT_ANGULAR"||t.type==="GRADIENT_DIAMOND")return this.convertGradientToColorToken(e,t);if(t.type==="IMAGE")return this.convertImageToColorToken(e,t)}return this.addWarning(`Unsupported paint type for style ${e.name}: ${t.type}`),null}catch(t){let o=t instanceof Error?t.message:String(t);return this.addError(`Failed to convert paint style ${e.name}`,"error",{error:o}),null}}convertGradientToColorToken(e,t){let o=t.type.replace("GRADIENT_","").toLowerCase(),r=t.gradientStops.map(s=>{let l=this.getVariableIdFromReference(s.color);if(l){let d=this.getVariableInfo(l);return this.log(`Gradient stop references variable: ${(d==null?void 0:d.name)||l}`),{position:s.position,variableReference:{id:l,name:(d==null?void 0:d.name)||"Unknown Variable",type:"VARIABLE_REFERENCE"}}}else return{position:s.position,color:{r:s.color.r,g:s.color.g,b:s.color.b,a:s.color.a}}}),i=r[0],n={r:0,g:0,b:0};return"color"in i&&i.color?n=i.color:"variableReference"in i&&this.log(`Primary color is variable reference: ${i.variableReference.name}`),{id:e.id,name:e.name,description:e.description,type:"color",value:{hex:this.rgbToHex(n.r,n.g,n.b),rgb:{r:Math.round(n.r*255),g:Math.round(n.g*255),b:Math.round(n.b*255)},hsl:this.rgbToHsl(n.r,n.g,n.b),hsb:this.rgbToHsb(n.r,n.g,n.b),alpha:1,gradient:{type:o,stops:r,transform:t.gradientTransform}},metadata:this.createTokenMetadata(e),figmaNodeId:e.id}}convertImageToColorToken(e,t){return{id:e.id,name:e.name,description:e.description,type:"color",value:{hex:"",rgb:{r:0,g:0,b:0},hsl:{h:0,s:0,l:0},hsb:{h:0,s:0,b:0},alpha:t.opacity!==void 0?t.opacity:1,pattern:{}},metadata:this.createTokenMetadata(e),figmaNodeId:e.id}}convertTextStyleToTypographyToken(e){var t,o,r;try{this.log(`Processing text style: ${e.name}`);let i=((t=e.fontName)==null?void 0:t.family)||"Arial",n=((o=e.fontName)==null?void 0:o.style)||"Regular";this.log(`Font family: ${i}, Font weight: ${n}`);let s=this.extractFontStyle((r=e.fontName)==null?void 0:r.style),l=this.extractTextAlign(e);return{id:e.id,name:e.name,description:e.description||"",type:"typography",value:{fontFamily:i,fontWeight:n,fontSize:e.fontSize||16,lineHeight:this.convertLineHeightSafe(e.lineHeight),letterSpacing:this.convertLetterSpacingSafe(e.letterSpacing),paragraphSpacing:e.paragraphSpacing||0,textCase:this.convertTextCaseSafe(e.textCase),textDecoration:this.convertTextDecorationSafe(e.textDecoration),fontStyle:s,textAlign:l},metadata:this.createTokenMetadata(e),figmaNodeId:e.id}}catch(i){let n=i instanceof Error?i.message:String(i);return this.addError(`Failed to convert text style ${e.name}`,"error",{error:n,styleId:e.id,fontName:e.fontName,fontSize:e.fontSize}),null}}convertEffectStyleToEffectToken(e){try{if(!e.effects||e.effects.length===0)return this.addWarning(`Effect style ${e.name} has no effects`),null;let t=e.effects[0];return{id:e.id,name:e.name,description:e.description,type:this.mapEffectType(t.type),value:{type:t.type.toLowerCase().replace("_","-"),x:"offset"in t?t.offset.x:void 0,y:"offset"in t?t.offset.y:void 0,blur:t.radius,spread:"spread"in t?t.spread:void 0,color:"color"in t?{r:t.color.r,g:t.color.g,b:t.color.b,a:t.color.a}:void 0,visible:t.visible},metadata:this.createTokenMetadata(e),figmaNodeId:e.id}}catch(t){let o=t instanceof Error?t.message:String(t);return this.addError(`Failed to convert effect style ${e.name}`,"error",{error:o}),null}}async processVariableCollection(e){let t=[],o=e.variableIds||[];for(let r of o)try{let i=figma.variables.getVariableById(r);if(i){let n=await this.convertFigmaVariableToToken(i,e);n&&t.push(n)}}catch(i){this.addError(`Failed to process variable ${r}`,"error",{variableId:r,collectionId:e.id,error:i instanceof Error?i.message:String(i)})}return{id:e.id,name:e.name,description:e.description,modes:e.modes.map(r=>({modeId:r.modeId,name:r.name})),variables:t,remote:e.remote,hiddenFromPublishing:e.hiddenFromPublishing}}async convertFigmaVariableToToken(e,t){try{if(this.isVariableProcessed(e.id))return this.log(`Skipping already processed variable: ${e.name} (${e.id})`),null;this.log(`Processing variable: ${e.name} (type: ${e.resolvedType})`),this.markVariableAsProcessed(e.id);let o=this.mapVariableTypeToTokenType(e.resolvedType),r=this.getVariableBaseValue(e),i=this.processVariableValue(e.resolvedType,r,e);return this.log(`Variable ${e.name}: tokenType=${o}, baseValue=${JSON.stringify(r)}, processedValue=${JSON.stringify(i)}`),{id:e.id,name:e.name,description:e.description||"",type:o,value:i,metadata:this.createVariableMetadata(e),variableId:e.id,variable:{id:e.id,name:e.name,description:e.description||"",resolvedType:e.resolvedType,scopes:e.scopes,collectionId:t.id,collectionName:t.name,modes:Object.fromEntries(t.modes.map(n=>[n.modeId,n.name])),valuesByMode:e.valuesByMode,codeSyntax:e.codeSyntax,hiddenFromPublishing:e.hiddenFromPublishing}}}catch(o){return this.addError(`Failed to convert variable ${e.name}`,"error",{variableId:e.id,variableType:e.resolvedType,valuesByMode:e.valuesByMode,error:o instanceof Error?o.message:String(o)}),null}}async extractColorVariables(){let e=[];try{let t=figma.variables.getLocalVariableCollections();for(let o of t)for(let r of o.variableIds){let i=figma.variables.getVariableById(r);if(i&&i.resolvedType==="COLOR"){let n=await this.convertColorVariableToToken(i,o);n&&e.push(n)}}}catch(t){let o=t instanceof Error?t.message:String(t);this.addError("Failed to extract color variables","error",{error:o})}return e}async convertColorVariableToToken(e,t){try{let o=t.modes[0],r=e.valuesByMode[o.modeId];if(typeof r=="object"&&"r"in r&&"g"in r&&"b"in r){let i=r,{r:n,g:s,b:l,a:d=1}=i;return{id:e.id,name:e.name,description:e.description,type:"color",value:{hex:this.rgbToHex(n,s,l),rgb:{r:Math.round(n*255),g:Math.round(s*255),b:Math.round(l*255)},hsl:this.rgbToHsl(n,s,l),hsb:this.rgbToHsb(n,s,l),alpha:d},metadata:this.createVariableMetadata(e),variableId:e.id}}return null}catch(o){let r=o instanceof Error?o.message:String(o);return this.addError(`Failed to convert color variable ${e.name}`,"error",{error:r}),null}}async extractTypographyVariables(){return[]}async extractSpacingVariables(){let e=[];try{let t=figma.variables.getLocalVariableCollections();for(let o of t)for(let r of o.variableIds){let i=figma.variables.getVariableById(r);if(i&&i.resolvedType==="FLOAT"&&this.isSpacingVariable(i)){let n=await this.convertSpacingVariableToToken(i,o);n&&e.push(n)}}}catch(t){let o=t instanceof Error?t.message:String(t);this.addError("Failed to extract spacing variables","error",{error:o})}return e}async extractEffectVariables(){return[]}async extractStyleTokens(){let e=[],t=await this.extractColorTokens();e.push(...t);let o=await this.extractTypographyTokens();e.push(...o);let r=await this.extractEffectTokens();return e.push(...r),e}async extractComponentTokens(){let e=[];try{let t=figma.root.findAll(o=>o.type==="COMPONENT"||o.type==="COMPONENT_SET");for(let o of t){let r=await this.extractTokensFromNode(o);e.push(...r)}}catch(t){let o=t instanceof Error?t.message:String(t);this.addError("Failed to extract component tokens","error",{error:o})}return e}async extractTokensFromNode(e){let t=[];this.processedNodes++;try{if("layoutMode"in e&&e.layoutMode!=="NONE"){let o=this.extractSpacingFromNode(e);o&&t.push(o)}if("cornerRadius"in e&&typeof e.cornerRadius=="number"&&e.cornerRadius>0){let o=this.extractBorderRadiusFromNode(e);o&&t.push(o)}if("strokes"in e&&e.strokes.length>0){let o=this.extractStrokeTokensFromNode(e);t.push(...o)}if(this.config.traverseInstances&&"children"in e)for(let o of e.children){let r=await this.extractTokensFromNode(o);t.push(...r)}}catch(o){this.addError(`Failed to extract tokens from node ${e.name}`,"error",{nodeId:e.id,error:o instanceof Error?o.message:String(o)})}return t}extractSpacingFromNode(e){try{if(!("layoutMode"in e)||e.layoutMode==="NONE")return null;let t={};return"itemSpacing"in e&&(t.gap=e.itemSpacing),"paddingTop"in e&&(t.top=e.paddingTop,t.right=e.paddingRight,t.bottom=e.paddingBottom,t.left=e.paddingLeft),Object.keys(t).length===0?null:{id:`${e.id}-spacing`,name:`${e.name}/spacing`,type:"spacing",value:t,metadata:this.createNodeMetadata(e),figmaNodeId:e.id}}catch(t){let o=t instanceof Error?t.message:String(t);return this.addError(`Failed to extract spacing from node ${e.name}`,"error",{error:o}),null}}extractBorderRadiusFromNode(e){try{if(!("cornerRadius"in e))return null;let t;return typeof e.cornerRadius=="number"?t={radius:e.cornerRadius}:t={radius:{topLeft:e.topLeftRadius||0,topRight:e.topRightRadius||0,bottomLeft:e.bottomLeftRadius||0,bottomRight:e.bottomRightRadius||0}},{id:`${e.id}-border-radius`,name:`${e.name}/border-radius`,type:"border-radius",value:y({type:"border-radius",blur:0},t),metadata:this.createNodeMetadata(e),figmaNodeId:e.id}}catch(t){let o=t instanceof Error?t.message:String(t);return this.addError(`Failed to extract border radius from node ${e.name}`,"error",{error:o}),null}}extractStrokeTokensFromNode(e){let t=[];try{if(!("strokes"in e)||!e.strokes)return t;e.strokes.forEach((o,r)=>{if(o.type==="SOLID"){let i={id:`${e.id}-stroke-${r}`,name:`${e.name}/stroke-${r}`,type:"stroke",value:{color:{r:o.color.r,g:o.color.g,b:o.color.b,a:o.opacity!==void 0?o.opacity:1},weight:"strokeWeight"in e?this.safeConvertToNumber(e.strokeWeight,1):1,align:"strokeAlign"in e?this.safeConvertToString(e.strokeAlign,"inside").toLowerCase():"inside",cap:"strokeCap"in e?this.safeConvertToString(e.strokeCap,"none").toLowerCase():"none",join:"strokeJoin"in e?this.safeConvertToString(e.strokeJoin,"miter").toLowerCase():"miter",dashPattern:"dashPattern"in e?this.safeConvertToArray(e.dashPattern,[]):[],visible:o.visible},metadata:this.createNodeMetadata(e),figmaNodeId:e.id};t.push(i)}})}catch(o){let r=o instanceof Error?o.message:String(o);this.addError(`Failed to extract strokes from node ${e.name}`,"error",{error:r})}return t}createTokenMetadata(e){return{createdAt:new Date,modifiedAt:new Date,version:"1.0.0",usage:[]}}createVariableMetadata(e){return{createdAt:new Date,modifiedAt:new Date,version:"1.0.0",usage:[]}}createNodeMetadata(e){var t,o;return{createdAt:new Date,modifiedAt:new Date,version:"1.0.0",usage:[{nodeId:e.id,nodeName:e.name,nodeType:e.type,pageId:((t=e.parent)==null?void 0:t.type)==="PAGE"?e.parent.id:"",pageName:((o=e.parent)==null?void 0:o.type)==="PAGE"?e.parent.name:""}]}}mapEffectType(e){switch(e){case"DROP_SHADOW":case"INNER_SHADOW":return"shadow";case"LAYER_BLUR":case"BACKGROUND_BLUR":return"blur";default:return"shadow"}}processVariableValue(e,t,o){if(t==null)return this.addWarning(`Variable ${o.name} has no value`),null;try{switch(e){case"COLOR":return this.processColorVariableValue(t);case"FLOAT":return this.processNumberVariableValue(t);case"STRING":return this.processStringVariableValue(t);case"BOOLEAN":return this.processBooleanVariableValue(t);default:return this.addWarning(`Unknown variable type ${e} for variable ${o.name}`),t}}catch(r){return this.addError(`Failed to process value for variable ${o.name}`,"error",{variableType:e,baseValue:t,error:r instanceof Error?r.message:String(r)}),t}}processColorVariableValue(e){if(typeof e=="object"&&"r"in e&&"g"in e&&"b"in e){let{r:t,g:o,b:r,a:i=1}=e;return{hex:this.rgbToHex(t,o,r),rgb:{r:Math.round(t*255),g:Math.round(o*255),b:Math.round(r*255)},hsl:this.rgbToHsl(t,o,r),hsb:this.rgbToHsb(t,o,r),alpha:i}}return e}processNumberVariableValue(e){return typeof e=="number"?{value:e,unit:"px"}:e}processStringVariableValue(e){return typeof e=="string"?{value:e,type:"string"}:e}processBooleanVariableValue(e){return typeof e=="boolean"?{value:e,type:"boolean"}:e}mapVariableTypeToTokenType(e){switch(e){case"COLOR":return"color";case"FLOAT":return"dimension";case"STRING":return"string";case"BOOLEAN":return"boolean";default:return"dimension"}}getVariableBaseValue(e){let t=Object.keys(e.valuesByMode);return t.length>0?e.valuesByMode[t[0]]:null}isSpacingVariable(e){return["spacing","padding","margin","gap","space"].some(o=>e.name.toLowerCase().includes(o))}async convertSpacingVariableToToken(e,t){try{let o=t.modes[0],r=e.valuesByMode[o.modeId];return typeof r=="number"?{id:e.id,name:e.name,description:e.description,type:"spacing",value:{all:r},metadata:this.createVariableMetadata(e),variableId:e.id}:null}catch(o){let r=o instanceof Error?o.message:String(o);return this.addError(`Failed to convert spacing variable ${e.name}`,"error",{error:r}),null}}rgbToHex(e,t,o){let r=i=>{let n=Math.round(i*255).toString(16);return n.length===1?"0"+n:n};return`#${r(e)}${r(t)}${r(o)}`}rgbToHsl(e,t,o){let r=Math.max(e,t,o),i=Math.min(e,t,o),n=r-i,s=r+i,l=s/2;if(n===0)return{h:0,s:0,l:Math.round(l*100)};let d=l>.5?n/(2-s):n/s,g;switch(r){case e:g=(t-o)/n+(t<o?6:0);break;case t:g=(o-e)/n+2;break;case o:g=(e-t)/n+4;break;default:g=0}return g/=6,{h:Math.round(g*360),s:Math.round(d*100),l:Math.round(l*100)}}rgbToHsb(e,t,o){let r=Math.max(e,t,o),i=Math.min(e,t,o),n=r-i,s=r,l=r===0?0:n/r,d;if(n===0)d=0;else{switch(r){case e:d=(t-o)/n+(t<o?6:0);break;case t:d=(o-e)/n+2;break;case o:d=(e-t)/n+4;break;default:d=0}d/=6}return{h:Math.round(d*360),s:Math.round(l*100),b:Math.round(s*100)}}extractFontStyle(e){if(!e)return"normal";try{return e.toLowerCase().includes("italic")?"italic":"normal"}catch(t){return this.addWarning(`Failed to process font style: ${e}`),"normal"}}extractTextAlign(e){try{let t=e.textAlignHorizontal;return t&&typeof t=="string"?this.convertTextAlign(t):"left"}catch(t){return this.addWarning(`Failed to extract text align for style: ${e.name}`),"left"}}convertLineHeightSafe(e){if(!e)return"auto";try{return this.convertLineHeight(e)}catch(t){return this.addWarning(`Failed to convert line height: ${JSON.stringify(e)}`),"auto"}}convertLineHeight(e){return e.unit==="PIXELS"?e.value:e.unit==="PERCENT"?`${e.value}%`:"auto"}convertLetterSpacingSafe(e){if(!e)return"normal";try{return this.convertLetterSpacing(e)}catch(t){return this.addWarning(`Failed to convert letter spacing: ${JSON.stringify(e)}`),"normal"}}convertLetterSpacing(e){return e.unit==="PIXELS"?e.value:e.unit==="PERCENT"?`${e.value}%`:"normal"}convertTextCaseSafe(e){if(!e)return"original";try{return this.convertTextCase(e)}catch(t){return this.addWarning(`Failed to convert text case: ${e}`),"original"}}convertTextCase(e){switch(e){case"ORIGINAL":return"original";case"UPPER":return"upper";case"LOWER":return"lower";case"TITLE":return"title";default:return"original"}}convertTextDecorationSafe(e){if(!e)return"none";try{return this.convertTextDecoration(e)}catch(t){return this.addWarning(`Failed to convert text decoration: ${e}`),"none"}}convertTextDecoration(e){switch(e){case"UNDERLINE":return"underline";case"STRIKETHROUGH":return"strikethrough";default:return"none"}}convertTextAlign(e){if(!e||typeof e!="string")return"left";try{let t=e.toLowerCase();return["left","center","right","justified"].includes(t)?t:"left"}catch(t){return this.addWarning(`Failed to convert text align: ${e}`),"left"}}resetState(){this.errors=[],this.warnings=[],this.processedNodes=0,this.totalNodes=0,this.processedVariables.clear(),this.variableRegistry.clear()}isVariableReference(e){return e&&typeof e=="object"&&e.type==="VARIABLE_ALIAS"&&typeof e.id=="string"}getVariableIdFromReference(e){return this.isVariableReference(e)?e.id:null}registerVariable(e){this.variableRegistry.set(e.id,{id:e.id,name:e.name,resolvedType:e.resolvedType})}getVariableInfo(e){return this.variableRegistry.get(e)}isVariableProcessed(e){return this.processedVariables.has(e)}markVariableAsProcessed(e){this.processedVariables.add(e)}async populateVariableRegistry(){try{this.log("Pre-populating variable registry...");let e=figma.variables.getLocalVariableCollections();for(let t of e)for(let o of t.variableIds){let r=figma.variables.getVariableById(o);r&&this.registerVariable(r)}this.log(`Registered ${this.variableRegistry.size} variables for reference handling`)}catch(e){this.addError("Failed to populate variable registry","error",{error:e instanceof Error?e.message:String(e)})}}countNodes(e){let t=1;if("children"in e)for(let o of e.children)t+=this.countNodes(o);return t}addError(e,t,o){this.errors.push({error:e,severity:t,context:o}),t==="critical"?console.error(`[TokenExtractor] CRITICAL: ${e}`,o):t==="error"&&console.error(`[TokenExtractor] ERROR: ${e}`,o)}addWarning(e){this.warnings.push(e),console.warn(`[TokenExtractor] WARNING: ${e}`)}log(e){}safeConvertToNumber(e,t){if(e==null)return t;if(typeof e=="symbol")return this.addWarning(`Cannot convert Symbol value to number, using default: ${t}`),t;let o=Number(e);return isNaN(o)?(this.addWarning(`Invalid number value: ${e}, using default: ${t}`),t):o}safeConvertToString(e,t){if(e==null)return t;if(typeof e=="symbol")return this.addWarning(`Cannot convert Symbol value to string, using default: ${t}`),t;try{return String(e)}catch(o){return this.addWarning(`Failed to convert value to string: ${e}, using default: ${t}`),t}}safeConvertToArray(e,t){if(e==null)return t;if(typeof e=="symbol")return this.addWarning(`Cannot convert Symbol value to array, using default: ${JSON.stringify(t)}`),t;if(Array.isArray(e))try{return[...e]}catch(o){return this.addWarning(`Failed to spread array value, using default: ${JSON.stringify(t)}`),t}try{if(e&&typeof e=="object"&&"length"in e)return Array.from(e)}catch(o){this.addWarning(`Failed to convert value to array: ${e}, using default: ${JSON.stringify(t)}`)}return t}}});var O,ie=w(()=>{"use strict";O=class{constructor(){h(this,"variableMap");h(this,"collections");this.variableMap=new Map,this.collections=new Map}transform(e){var i,n,s,l,d,g;this.buildVariableIndex(e.variables||[]);let t=this.extractCleanTokens(e.variables||[]),o=this.consolidateTypography(t),r=this.organizeHierarchically(o);return{version:"2.0.0",generatedAt:new Date().toISOString(),source:{document:((n=(i=e.metadata)==null?void 0:i.sourceDocument)==null?void 0:n.name)||"Unknown",originalTokenCount:((l=(s=e.metadata)==null?void 0:s.tokenCounts)==null?void 0:l.totalTokens)||0,originalVariableCount:((g=(d=e.metadata)==null?void 0:d.tokenCounts)==null?void 0:g.totalVariables)||0},collections:r}}buildVariableIndex(e){e.forEach(t=>{let o=t.id||t.variableId;o&&this.variableMap.set(o,t)})}resolveAlias(e,t=10){if(!e||typeof e!="object")return e;if(e.type==="VARIABLE_ALIAS"&&e.id){if(t<=0)return console.warn(`Max depth reached resolving alias ${e.id}`),e;let o=this.variableMap.get(e.id);return o?{value:this.resolveAlias(o.value,t-1),$ref:o.name,$refId:e.id}:(console.warn(`Cannot resolve alias: ${e.id}`),e)}return e}cleanColorValue(e){return!e||typeof e!="object"?e:e.hex!==void 0?e.alpha!==void 0&&e.alpha!==1?y({hex:e.hex,alpha:e.alpha},e.rgb&&{rgba:`rgba(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b}, ${e.alpha})`}):{hex:e.hex}:e.stops&&Array.isArray(e.stops)?k(y({},e),{stops:e.stops.map(t=>k(y({},t),{color:this.cleanColorValue(t.color)}))}):e}extractCleanTokens(e){return e.map(t=>{var d,g,m,f;let o=((d=t.variable)==null?void 0:d.collectionName)||"Uncategorized",r=((g=t.variable)==null?void 0:g.modes)||{},i=Object.values(r),n=t.value,s=null;if(n&&typeof n=="object"&&n.type==="VARIABLE_ALIAS"){let v=this.resolveAlias(n);v.$ref&&(n=v.value,s={name:v.$ref})}t.type==="color"&&(n=this.cleanColorValue(n));let l={name:t.name,type:t.type,value:n,collectionName:o};return t.description&&t.description.trim()!==""&&t.description.toLowerCase()!=="empty"&&(l.description=t.description),s&&(l.$alias=s),i.length>0&&(l.mode=i[0]),l.$extensions={figma:y(y({id:t.id||t.variableId},((m=t.variable)==null?void 0:m.collectionId)&&{collectionId:t.variable.collectionId}),((f=t.variable)==null?void 0:f.scopes)&&t.variable.scopes.length>0&&{scopes:t.variable.scopes})},l})}consolidateTypography(e){let t={},o=[];return e.forEach(r=>{let i=r.name.match(/^([^/]+\/\d+)\/(size|weight|LH|LS)$/);if(i){let[,n,s]=i;t[n]||(t[n]={name:n,type:"typography",value:null,collectionName:r.collectionName,mode:r.mode,properties:{}});let d={size:"fontSize",weight:"fontWeight",LH:"lineHeight",LS:"letterSpacing"}[s]||s;t[n].properties[d]=y({value:r.value},r.$alias&&{$alias:r.$alias}),r.description&&!t[n].description&&(t[n].description=r.description)}else o.push(r)}),[...o,...Object.values(t)]}organizeHierarchically(e){let t={};return e.forEach(o=>{let r=o.collectionName||"uncategorized";t[r]||(t[r]={tokens:{}});let i=t[r],n=o.type||"unknown";i.tokens[n]||(i.tokens[n]=[]);let s=y({},o);delete s.collectionName,i.tokens[n].push(s)}),t}}});function ne(p){return p<=nt}var nt,st,c,Y=w(()=>{"use strict";nt=1;st=!1,c={critical:p=>{ne(1)&&console.log(p)},normal:p=>{ne(2)&&console.log(p)},verbose:p=>{ne(3)&&console.log(p)},debug:p=>{ne(4)&&console.log(p)},githubDebug:p=>{st&&console.log(p)}}});var z,a,$,B,Rt,Ft,Dt,b,Nt,Gt,V,At,se=w(()=>{"use strict";z={DEFAULT_WIDTH:480,DEFAULT_HEIGHT:750,MIN_WIDTH:70,MIN_HEIGHT:100,MAX_HEIGHT:800},a={neutral:{900:"#0F1112",500:"#B1B2B6",100:"#F3F5F9",50:"#FFFFFF"},black:"#0F1112",white:"#FFFFFF",grey:{900:"#0F1112",800:"#1A1C1E",700:"#404347",600:"#6B6E73",500:"#B1B2B6",400:"#C8CACC",300:"#D4D6D8",200:"#E5E7E9",100:"#F3F5F9",50:"#FAFAFC"},lavender:{950:"#7C2D92;",900:"#2E32F4",800:"#3F46F9",700:"#5A5FF3",600:"#7C82F7",500:"#A3A6F0",400:"#D7D9F6",300:"#DEE3FC",200:"#E8E9FD",100:"#ECEDF6"},mint:{100:"#F6FBFA",200:"#ECF6F4",300:"#DDEFEB",400:"#CCE9E3",500:"#9DD4C8",600:"#6FBFAD",700:"#4FA896",800:"#3A8A7C",900:"#2A6B60"},blush:{400:"#E5C7C8",300:"#F6EEEA",200:"#F7E3E3",100:"#FCE3E0",50:"#FDF1EF"},primary:{50:"#FAF5FF",100:"#F3E8FF",200:"#E9D5FF",300:"#D8B4FE",400:"#C084FC",500:"#A855F7",600:"#9333EA",700:"#7E22CE",800:"#6B21A8",900:"#581C87"},state:{success:{bg:"#DCFCE7",text:"#166534",border:"#86EFAC"},error:{bg:"#FEE2E2",text:"#991B1B",border:"#FCA5A5"},warning:{bg:"#FEF3C7",text:"#92400E",border:"#FCD34D"},info:{bg:"#DBEAFE",text:"#1E40AF",border:"#93C5FD"}}},$=(p,e,t=135)=>`linear-gradient(${t}deg, ${p} 0%, ${e} 100%)`,B={lavenderStrong:$(a.lavender[400],a.lavender[100]),lavenderMedium:$(a.lavender[300],a.lavender[100]),lavenderLight:$(a.lavender[200],a.white),lavenderSubtle:$(a.lavender[100],a.white),mintStrong:$(a.mint[400],a.mint[100]),mintMedium:$(a.mint[300],a.mint[100]),mintLight:$(a.mint[200],a.white),mintSubtle:$(a.mint[100],a.white),blushStrong:$(a.blush[400],a.blush[100]),blushMedium:$(a.blush[300],a.blush[100]),blushLight:$(a.blush[200],a.white),blushSubtle:$(a.blush[100],a.white),lavenderToBlush:$(a.lavender[300],a.blush[300])},Rt={gradientBackgrounds:[B.lavenderMedium,B.mintLight,B.blushLight],cardBackgrounds:[a.lavender[100],a.mint[100],a.blush[100],a.grey[100]],hoverBackgrounds:[a.lavender[200],a.mint[200],a.blush[200],a.grey[100]],focusRing:a.primary[400],focusBackground:a.primary[50],shadows:{sm:"0 1px 2px 0 rgba(15, 17, 18, 0.05)",base:"0 2px 8px 0 rgba(15, 17, 18, 0.04)",md:"0 4px 12px 0 rgba(15, 17, 18, 0.08)",lg:"0 8px 24px 0 rgba(15, 17, 18, 0.12)"}},Ft={onPrimary400:a.white,onPrimary300:a.primary[700],onPrimary200:a.primary[800]},Dt={display:{fontSize:"48px",lineHeight:"56px",fontWeight:700,letterSpacing:"-0.02em"},h1:{fontSize:"32px",lineHeight:"40px",fontWeight:700,letterSpacing:"-0.01em"},h2:{fontSize:"24px",lineHeight:"32px",fontWeight:700,letterSpacing:"-0.01em"},h3:{fontSize:"20px",lineHeight:"28px",fontWeight:600,letterSpacing:"0"},h4:{fontSize:"16px",lineHeight:"24px",fontWeight:600,letterSpacing:"0"},body:{fontSize:"14px",lineHeight:"20px",fontWeight:400,letterSpacing:"0"},bodyLarge:{fontSize:"16px",lineHeight:"24px",fontWeight:400,letterSpacing:"0"},bodySmall:{fontSize:"12px",lineHeight:"16px",fontWeight:400,letterSpacing:"0"},label:{fontSize:"14px",lineHeight:"20px",fontWeight:500,letterSpacing:"0.01em"},caption:{fontSize:"12px",lineHeight:"16px",fontWeight:400,letterSpacing:"0",color:a.grey[500]},metric:{fontSize:"36px",lineHeight:"40px",fontWeight:700,letterSpacing:"-0.02em"},metricLabel:{fontSize:"12px",lineHeight:"16px",fontWeight:400,letterSpacing:"0.01em",textTransform:"uppercase",color:a.grey[600]}},b={0:"0",1:"4px",2:"8px",3:"12px",4:"16px",5:"20px",6:"24px",7:"28px",8:"32px"},Nt={cardPadding:b[6],cardGap:b[6],sectionGap:b[8],elementGap:b[4],inlineGap:b[2],iconGap:b[2]},Gt={hover:{transform:"translateY(-1px)",transition:"all 150ms ease"},active:{transform:"scale(0.98)",transition:"all 100ms ease"},focus:{outline:`2px solid ${a.primary[400]}`,outlineOffset:"2px"},disabled:{opacity:.5,cursor:"not-allowed",pointerEvents:"none"}},V={fast:"100ms ease",base:"150ms ease",slow:"300ms ease",slower:"500ms ease"},At={size:20,strokeWidth:2,color:a.grey[700]}});var D,ae=w(()=>{"use strict";Y();D=class{constructor(e){h(this,"baseUrl","https://api.github.com");h(this,"credentials");h(this,"clientId");h(this,"getUser",async()=>this.makeRequest("/user"));h(this,"testConnection",async e=>{var t,o;try{let i={success:!0,user:await this.getUser(),permissions:{canRead:!0,canWrite:!1,canAdmin:!1}};if(e)try{let n=await this.getRepository(e.owner,e.name);i.repository=n,i.permissions={canRead:!0,canWrite:((t=n.permissions)==null?void 0:t.push)||!1,canAdmin:((o=n.permissions)==null?void 0:o.admin)||!1}}catch(n){i.success=!1,i.error=n instanceof Error?n.message:"Repository access failed"}return i}catch(r){return{success:!1,error:r instanceof Error?r.message:"Connection test failed",permissions:{canRead:!1,canWrite:!1,canAdmin:!1}}}});h(this,"getRepository",async(e,t)=>this.makeRequest(`/repos/${e}/${t}`));h(this,"getFile",async(e,t,o,r)=>{let i=r?`?ref=${encodeURIComponent(r)}`:"";return this.makeRequest(`/repos/${e}/${t}/contents/${o}${i}`)});h(this,"createFile",async(e,t,o,r)=>{var i;c.githubDebug(`\u{1F527} [${this.clientId}] createFile called - owner: ${e}, repo: ${t}, path: ${o}`),c.githubDebug(`\u{1F527} [${this.clientId}] createFile - 'this' context: ${!!this}, clientId: ${this.clientId}`),c.githubDebug(`\u{1F527} [${this.clientId}] createFile - request keys: ${Object.keys(r).join(", ")}`);try{let n=await this.makeRequest(`/repos/${e}/${t}/contents/${o}`,{method:"PUT",body:JSON.stringify(r)});return c.githubDebug(`\u2705 [${this.clientId}] createFile - success, commit SHA: ${(i=n.commit)==null?void 0:i.sha}`),n}catch(n){throw console.error(`\u274C [${this.clientId}] createFile - failed:`,n),n}});h(this,"updateFile",async(e,t,o,r)=>this.makeRequest(`/repos/${e}/${t}/contents/${o}`,{method:"PUT",body:JSON.stringify(r)}));h(this,"fileExists",async(e,t,o)=>{c.githubDebug(`\u{1F527} [${this.clientId}] fileExists called - owner: ${e}, repo: ${t}, path: ${o}`),c.githubDebug(`\u{1F527} [${this.clientId}] fileExists - 'this' context: ${!!this}, clientId: ${this.clientId}`);try{return await this.getFile(e,t,o),c.githubDebug(`\u2705 [${this.clientId}] fileExists - file found, returning true`),!0}catch(r){if(r.status===404)return c.githubDebug(`\u{1F4C1} [${this.clientId}] fileExists - file not found (404), returning false`),!1;throw console.error(`\u274C [${this.clientId}] fileExists - unexpected error:`,r),r}});this.clientId=`client_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,c.githubDebug("\u{1F527} GitHubClient constructor - Creating new client with ID: "+this.clientId),c.githubDebug("\u{1F527} GitHubClient constructor - Called with: "+JSON.stringify({token:e.token.substring(0,10)+"...",username:e.username})),this.credentials=e,this.validateArrowFunctionMethods(),c.githubDebug("\u{1F527} GitHubClient constructor - Completed initialization for client: "+this.clientId)}customBase64Encode(e){let t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",o="",r=0;for(;r<e.length;){let n=e.charCodeAt(r++),s=r<e.length?e.charCodeAt(r++):0,l=r<e.length?e.charCodeAt(r++):0,d=n<<16|s<<8|l;o+=t.charAt(d>>18&63),o+=t.charAt(d>>12&63),o+=t.charAt(d>>6&63),o+=t.charAt(d&63)}let i=e.length%3;return i===1?o=o.slice(0,-2)+"==":i===2&&(o=o.slice(0,-1)+"="),o}validateArrowFunctionMethods(){c.githubDebug("\u{1F50D} GitHubClient - Validating arrow function methods...");let e=["fileExists","createFile","updateFile","getFile","getRepository","testConnection","getUser"];for(let t of e){let o=this[t],r=typeof o;if(c.githubDebug(`  \u{1F4CB} ${t}: ${r}`),r!=="function"){console.error(`  \u274C CRITICAL: ${t} is not a function! Type: ${r}`);continue}try{let i=o.toString(),n=i.includes("=>"),s=i.includes("this.");c.githubDebug(`    - Is arrow function: ${n}`),c.githubDebug(`    - Has 'this' reference: ${s}`),c.githubDebug(`    - Method length: ${o.length} parameters`);let l=typeof o.call=="function";c.githubDebug(`    - Can be called: ${l}`),n&&s?c.githubDebug(`    \u2705 ${t} appears correctly configured as arrow function`):console.warn(`    \u26A0\uFE0F ${t} may have binding issues`)}catch(i){console.error(`    \u274C Error inspecting ${t}:`,i)}}c.githubDebug("\u2705 Arrow function method validation completed")}getClientId(){return this.clientId}async makeRequest(e,t={}){let o=`${this.baseUrl}${e}`,r={Authorization:`Bearer ${this.credentials.token}`,Accept:"application/vnd.github.v3+json","User-Agent":"Figma-Design-System-Distributor/1.0.0","Content-Type":"application/json"},i=k(y({},t),{headers:y(y({},r),t.headers)});c.githubDebug(`\u{1F310} GitHub API Request: ${t.method||"GET"} ${o}`),c.githubDebug(`\u{1F511} Token: ${this.credentials.token.substring(0,10)}...`);try{let n=await fetch(o,i);if(c.githubDebug(`\u{1F4E1} GitHub API Response: ${n.status} ${n.statusText}`),n.ok||await this.handleApiError(n),n.status===204)return c.githubDebug("\u2705 GitHub API: No content response (success)"),{};let s=await n.json();return c.githubDebug(`\u2705 GitHub API: Response received (${JSON.stringify(s).length} chars)`),s}catch(n){throw console.error("\u274C GitHub API Request failed:",n),n instanceof Error?n:new Error(`GitHub API request failed: ${String(n)}`)}}async handleApiError(e){let t;try{t=await e.json()}catch(i){t={message:`HTTP ${e.status}: ${e.statusText}`}}let o=t.message||"Unknown GitHub API error";switch(e.status){case 401:o="Invalid GitHub token. Please check your Personal Access Token.";break;case 403:o.includes("rate limit")?o="GitHub API rate limit exceeded. Please try again later.":o="Insufficient permissions. Please check your token permissions and repository access.";break;case 404:o="Repository not found or you don't have access to it.";break;case 422:if(o=`Validation failed: ${t.message}`,t.errors){let i=t.errors.map(n=>`${n.field}: ${n.code}`).join(", ");o+=` (${i})`}break}let r=new Error(o);throw r.status=e.status,r.githubError=t,r}async listRepositories(e={}){let t=[];e.type&&t.push(`type=${encodeURIComponent(e.type)}`),e.sort&&t.push(`sort=${encodeURIComponent(e.sort)}`),e.per_page&&t.push(`per_page=${encodeURIComponent(e.per_page.toString())}`);let o=t.join("&"),r=`/user/repos${o?`?${o}`:""}`;return this.makeRequest(r)}async pushTokens(e){let{tokens:t,config:o,options:r={}}=e,{repository:i,paths:n}=o;try{let s={success:!1,filesCreated:[],filesUpdated:[]},l=JSON.stringify(t,null,2),d=this.customBase64Encode(l),m={message:r.commitMessage||`Update design tokens from Figma - ${new Date().toISOString().split("T")[0]}`,content:d,branch:r.branchName||i.branch||"main"};if(await this.fileExists(i.owner,i.name,n.rawTokens)){let v=await this.getFile(i.owner,i.name,n.rawTokens);m.sha=v.sha;let T=await this.updateFile(i.owner,i.name,n.rawTokens,m);s.commitSha=T.commit.sha,s.filesUpdated.push(n.rawTokens)}else{let v=await this.createFile(i.owner,i.name,n.rawTokens,m);s.commitSha=v.commit.sha,s.filesCreated.push(n.rawTokens)}return s.success=!0,s}catch(s){return{success:!1,error:s instanceof Error?s.message:"Failed to push tokens",filesCreated:[],filesUpdated:[]}}}async triggerWorkflow(e,t,o,r,i){c.githubDebug(`\u{1F527} [${this.clientId}] triggerWorkflow called - owner: ${e}, repo: ${t}, workflow: ${o}, ref: ${r}`);try{return await this.makeRequest(`/repos/${e}/${t}/actions/workflows/${o}/dispatches`,{method:"POST",body:JSON.stringify({ref:r,inputs:i||{}})}),c.githubDebug(`\u2705 [${this.clientId}] triggerWorkflow - workflow triggered successfully`),{success:!0}}catch(n){return console.error(`\u274C [${this.clientId}] triggerWorkflow - failed:`,n),n.status===404?{success:!1,error:"Workflow file not found. Please add the workflow to your repository."}:n.status===403?{success:!1,error:'Insufficient permissions. Token needs "actions:write" scope.'}:{success:!1,error:n.message||"Failed to trigger workflow"}}}async validateTokenPermissions(){try{let e=await this.getUser();return await this.listRepositories({per_page:1}),{valid:!0,permissions:["user","repo"],user:e}}catch(e){return{valid:!1,permissions:[],error:e instanceof Error?e.message:"Token validation failed"}}}async getRateLimit(){return(await this.makeRequest("/rate_limit")).rate}}});var R,K,C,le=w(()=>{"use strict";R={GITHUB_CONFIG:"github_config_v1",GITHUB_CREDENTIALS:"github_credentials_v1",LAST_CONNECTION_TEST:"github_last_test_v1",WORKFLOW_SETTINGS:"workflow_settings_v1"},K=class{static encrypt(e){try{return e.split("").map((o,r)=>o.charCodeAt(0)^this.key.charCodeAt(r%this.key.length)).map(o=>o.toString(16).padStart(2,"0")).join("")}catch(t){throw console.error("Encryption failed:",t),new Error("Failed to encrypt data")}}static decrypt(e){try{return(e.match(/.{1,2}/g)||[]).map(r=>parseInt(r,16)).map((r,i)=>String.fromCharCode(r^this.key.charCodeAt(i%this.key.length))).join("")}catch(t){throw console.error("Decryption failed:",t),new Error("Failed to decrypt data")}}};h(K,"key","figma-github-plugin-2024");C=class{static async storeCredentials(e){try{let t=K.encrypt(JSON.stringify(e));await figma.clientStorage.setAsync(R.GITHUB_CREDENTIALS,t)}catch(t){throw console.error("Failed to store credentials:",t),new Error("Failed to store GitHub credentials securely")}}static async getCredentials(){try{let e=await figma.clientStorage.getAsync(R.GITHUB_CREDENTIALS);if(!e)return null;let t=K.decrypt(e);return JSON.parse(t)}catch(e){if(console.error("Failed to retrieve credentials:",e),e instanceof SyntaxError&&e.message.includes("unexpected")){console.warn("\u26A0\uFE0F Detected corrupted credentials storage, clearing...");try{await figma.clientStorage.deleteAsync(R.GITHUB_CREDENTIALS),console.log("\u2705 Corrupted credentials storage cleared")}catch(t){console.error("\u274C Failed to clear corrupted storage:",t)}}return null}}static async storeConfig(e){var t,o;try{let r=k(y({},e),{credentials:void 0,repository:e.repository?{owner:((t=e.repository.owner)==null?void 0:t.trim())||"",name:((o=e.repository.name)==null?void 0:o.trim())||""}:void 0});await figma.clientStorage.setAsync(R.GITHUB_CONFIG,JSON.stringify(r))}catch(r){throw console.error("Failed to store config:",r),new Error("Failed to store GitHub configuration")}}static async getConfig(){try{let e=await figma.clientStorage.getAsync(R.GITHUB_CONFIG);return e?JSON.parse(e):null}catch(e){if(console.error("Failed to retrieve config:",e),e instanceof SyntaxError&&e.message.includes("unexpected")){console.warn("\u26A0\uFE0F Detected corrupted config storage, clearing...");try{await figma.clientStorage.deleteAsync(R.GITHUB_CONFIG),console.log("\u2705 Corrupted config storage cleared")}catch(t){console.error("\u274C Failed to clear corrupted storage:",t)}}return null}}static async getCompleteConfig(){try{let[e,t]=await Promise.all([this.getConfig(),this.getCredentials()]);return!e||!t?null:k(y({},e),{credentials:t})}catch(e){return console.error("Failed to retrieve complete config:",e),null}}static async storeLastConnectionTest(e){try{await figma.clientStorage.setAsync(R.LAST_CONNECTION_TEST,JSON.stringify(k(y({},e),{timestamp:Date.now()})))}catch(t){console.error("Failed to store connection test result:",t)}}static async getLastConnectionTest(){try{let e=await figma.clientStorage.getAsync(R.LAST_CONNECTION_TEST);if(!e)return null;let t=JSON.parse(e);return Date.now()-t.timestamp>60*60*1e3?null:t}catch(e){return console.error("Failed to retrieve connection test result:",e),null}}static async clearAll(){try{await Promise.all(Object.values(R).map(e=>figma.clientStorage.deleteAsync(e)))}catch(e){throw console.error("Failed to clear storage:",e),new Error("Failed to clear GitHub configuration")}}static async isConfigured(){var e,t,o;try{let r=await this.getCompleteConfig();return!!((e=r==null?void 0:r.credentials)!=null&&e.token&&((t=r==null?void 0:r.repository)!=null&&t.owner)&&((o=r==null?void 0:r.repository)!=null&&o.name))}catch(r){return!1}}static async validateStoredCredentials(){try{let e=await this.getCredentials();return!!(e!=null&&e.token&&typeof e.token=="string"&&e.token.trim().length>0)}catch(e){return!1}}static async storeWorkflowSettings(e){try{await figma.clientStorage.setAsync(R.WORKFLOW_SETTINGS,JSON.stringify(e))}catch(t){throw console.error("Failed to store workflow settings:",t),new Error("Failed to store workflow settings")}}static async getWorkflowSettings(){try{let e=await figma.clientStorage.getAsync(R.WORKFLOW_SETTINGS);return e?JSON.parse(e):{workflowTriggerEnabled:!1,workflowFileName:"transform-tokens.yml"}}catch(e){return console.error("Failed to retrieve workflow settings:",e),{workflowTriggerEnabled:!1,workflowFileName:"transform-tokens.yml"}}}}});function P(p){return y(y({},at),p&&{title:p})}var De,at,X=w(()=>{"use strict";se();De={width:z.DEFAULT_WIDTH,height:z.DEFAULT_HEIGHT},at={width:De.width,height:De.height,themeColors:!0}});var Ne,Ge=w(()=>{"use strict";Ne=`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes loading {
    0% { transform: translateX(-100%); }
    50% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
`});var Ae=w(()=>{"use strict"});var lt,W,ce=w(()=>{"use strict";se();Ge();Ae();lt=()=>`
    :root {
      /* Primary Colors */
      --color-primary-50: ${a.primary[50]};
      --color-primary-100: ${a.primary[100]};
      --color-primary-200: ${a.primary[200]};
      --color-primary-300: ${a.primary[300]};
      --color-primary-400: ${a.primary[400]};
      --color-primary: ${a.primary[400]};
      --color-primary-500: ${a.primary[500]};
      --color-primary-600: ${a.primary[600]};
      --color-primary-700: ${a.primary[700]};
      --color-primary-800: ${a.primary[800]};
      --color-primary-900: ${a.primary[900]};
      --color-primary-light: ${a.primary[400]};
      --color-primary-dark: ${a.primary[500]};
      --color-primary-extraDark: ${a.primary[700]};
      --color-primary-background: ${a.primary[50]};

      /* Neutral/Grey Colors */
      --color-neutral-50: ${a.neutral[50]};
      --color-neutral-100: ${a.neutral[100]};
      --color-neutral-500: ${a.neutral[500]};
      --color-neutral-900: ${a.neutral[900]};
      --color-black: ${a.black};
      --color-white: ${a.white};
      --color-grey-50: ${a.grey[50]};
      --color-grey-100: ${a.grey[100]};
      --color-grey-200: ${a.grey[200]};
      --color-grey-300: ${a.grey[300]};
      --color-grey-400: ${a.grey[400]};
      --color-grey-500: ${a.grey[500]};
      --color-grey-600: ${a.grey[600]};
      --color-grey-700: ${a.grey[700]};
      --color-grey-800: ${a.grey[800]};
      --color-grey-900: ${a.grey[900]};

      /* Lavender Colors */
      --color-lavender-100: ${a.lavender[100]};
      --color-lavender-200: ${a.lavender[200]};
      --color-lavender-300: ${a.lavender[300]};
      --color-lavender-400: ${a.lavender[400]};

      /* Mint Colors */
      --color-mint-100: ${a.mint[100]};
      --color-mint-200: ${a.mint[200]};
      --color-mint-300: ${a.mint[300]};
      --color-mint-400: ${a.mint[400]};
      --color-mint-500: ${a.mint[500]};
      --color-mint-600: ${a.mint[600]};
      --color-mint-700: ${a.mint[700]};
      --color-mint-800: ${a.mint[800]};
      --color-mint-900: ${a.mint[900]};

      /* Blush Colors */
      --color-blush-50: ${a.blush[50]};
      --color-blush-100: ${a.blush[100]};
      --color-blush-200: ${a.blush[200]};
      --color-blush-300: ${a.blush[300]};
      --color-blush-400: ${a.blush[400]};

      /* Text Colors */
      --color-text-primary: ${a.neutral[900]};
      --color-text-secondary: ${a.neutral[500]};
      --color-text-tertiary: ${a.grey[600]};
      --color-text-disabled: ${a.grey[400]};
      --color-text-light: ${a.white};

      /* Background Colors */
      --color-background-primary: ${a.white};
      --color-background-secondary: ${a.neutral[100]};
      --color-background-tertiary: ${a.grey[50]};
      --color-background-overlay: rgba(15, 17, 18, 0.3);
      --color-background-gradient: linear-gradient(135deg, ${a.lavender[300]} 0%, ${a.blush[200]} 100%);

      /* State Colors */
      --color-success: ${a.state.success.text};
      --color-success-light: ${a.state.success.bg};
      --color-success-dark: ${a.state.success.text};
      --color-success-border: ${a.state.success.border};

      --color-error: ${a.state.error.text};
      --color-error-light: ${a.state.error.bg};
      --color-error-dark: ${a.state.error.text};
      --color-error-border: ${a.state.error.border};

      --color-warning: ${a.state.warning.text};
      --color-warning-light: ${a.state.warning.bg};
      --color-warning-dark: ${a.state.warning.text};
      --color-warning-border: ${a.state.warning.border};

      --color-info: ${a.state.info.text};
      --color-info-light: ${a.state.info.bg};
      --color-info-dark: ${a.state.info.text};
      --color-info-border: ${a.state.info.border};

      /* Border Colors */
      --color-border: ${a.grey[200]};
      --color-border-active: ${a.primary[400]};
      --color-border-input: ${a.grey[200]};
      --color-border-hover: ${a.primary[500]};

      /* Hover States */
      --color-hover-bg: rgba(15, 17, 18, 0.02);

      /* Spacing */
      --spacing-0: ${b[0]};
      --spacing-1: ${b[1]};
      --spacing-2: ${b[2]};
      --spacing-3: ${b[3]};
      --spacing-4: ${b[4]};
      --spacing-5: ${b[5]};
      --spacing-6: ${b[6]};
      --spacing-7: ${b[7]};
      --spacing-8: ${b[8]};

      /* Transitions */
      --transition-fast: ${V.fast};
      --transition-base: ${V.base};
      --transition-slow: ${V.slow};
      --transition-slower: ${V.slower};
      --transition-default: ${V.base};

      /* Shadows */
      --shadow-sm: 0 1px 2px 0 rgba(15, 17, 18, 0.05);
      --shadow-md: 0 2px 8px 0 rgba(15, 17, 18, 0.04);
      --shadow-lg: 0 4px 12px 0 rgba(15, 17, 18, 0.08);
      --shadow-xl: 0 8px 24px 0 rgba(15, 17, 18, 0.12);

      /* Typography */
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Roboto", "Helvetica Neue", Arial, sans-serif;
    }
  `,W=()=>`
    ${lt()}
    ${Ne}

    /* Design System Base Styles */
    * {
      box-sizing: border-box;
    }

    .ds-btn {
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      cursor: pointer;
      transition: all 150ms ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .ds-btn-primary {
      background-color: ${a.primary[300]};
      color: ${a.neutral[900]};
      font-weight: 600;
    }

    .ds-btn-primary:hover:not(:disabled) {
      background-color: #7C2D92;
      color: ${a.white};
    }

    .ds-btn-primary:active:not(:disabled) {
      transform: scale(0.98);
    }

    .ds-btn-secondary {
      background-color: ${a.white};
      color: ${a.black};
      border: 2px solid ${a.black};
    }

    .ds-btn-secondary:hover:not(:disabled) {
      background-color: ${a.grey[50]};
    }

    .ds-btn-tertiary {
      background-color: ${a.lavender[400]};
      color: ${a.neutral[900]};
      padding: 8px 16px;
      border: none;
    }

    .ds-btn-tertiary:hover:not(:disabled) {
      background-color: ${a.lavender[300]};
    }

    .ds-btn-tertiary:active:not(:disabled) {
      background-color: ${a.lavender[200]};
    }

    .ds-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .ds-card {
      background-color: ${a.white};
      border-radius: 16px;
      padding: ${b[6]};
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      transition: box-shadow 150ms ease, transform 150ms ease;
    }

    .ds-card:hover {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      transform: translateY(-1px);
    }

    .ds-card-gradient {
      border-radius: 16px;
      padding: ${b[6]};
    }

    .ds-card-gradient-lavender {
      background: ${B.lavenderMedium};
    }

    .ds-card-gradient-blush {
      background: ${B.blushLight};
    }

    .ds-card-gradient-periwinkle {
      background: ${B.lavenderLight};
    }

    .ds-card-gradient-peach {
      background: ${B.mintLight};
    }

    .ds-input {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Roboto", "Helvetica Neue", Arial, sans-serif;
      font-size: 14px;
      line-height: 20px;
      padding: 12px 16px;
      border-radius: 8px;
      border: 2px solid ${a.grey[200]};
      background-color: ${a.white};
      color: ${a.grey[900]};
      width: 100%;
      transition: border-color 150ms ease;
      outline: none;
    }

    .ds-input:focus {
      border-color: ${a.primary[400]};
    }

    .ds-input.error {
      border-color: ${a.state.error.border};
    }

    .ds-input:disabled {
      background-color: ${a.grey[50]};
    }

    .ds-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 24px;
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
    }

    .ds-badge-success {
      background-color: ${a.state.success.bg};
      color: ${a.state.success.text};
      border: 1px solid ${a.state.success.border};
    }

    .ds-badge-error {
      background-color: ${a.state.error.bg};
      color: ${a.state.error.text};
      border: 1px solid ${a.state.error.border};
    }

    .ds-badge-warning {
      background-color: ${a.state.warning.bg};
      color: ${a.state.warning.text};
      border: 1px solid ${a.state.warning.border};
    }

    .ds-badge-info {
      background-color: ${a.state.info.bg};
      color: ${a.state.info.text};
      border: 1px solid ${a.state.info.border};
    }

    .ds-metric-card {
      background: ${a.white};
      border-radius: 16px;
      padding: ${b[6]};
      display: flex;
      flex-direction: column;
      gap: ${b[1]};
      min-width: 120px;
    }

    .ds-metric-value {
      font-size: 36px;
      line-height: 40px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .ds-metric-label {
      font-size: 12px;
      line-height: 16px;
      font-weight: 400;
      letter-spacing: 0.01em;
      text-transform: uppercase;
      color: ${a.grey[600]};
    }

    .ds-spinner {
      width: 24px;
      height: 24px;
      border: 3px solid ${a.grey[200]};
      border-top: 3px solid ${a.primary[400]};
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .ds-progress {
      width: 100%;
      height: 4px;
      background-color: ${a.grey[200]};
      border-radius: 2px;
      overflow: hidden;
    }

    .ds-progress-bar {
      height: 100%;
      background-color: ${a.primary[400]};
      border-radius: 2px;
      transition: width 300ms ease;
    }

    .ds-progress-bar-indeterminate {
      width: 30%;
      animation: loading 1.5s ease-in-out infinite;
    }

    .ds-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .ds-icon-with-text {
      display: flex;
      align-items: center;
      gap: ${b[2]};
    }

    /* Typography Classes */
    .ds-h1 { font-size: 32px; line-height: 40px; font-weight: 700; letter-spacing: -0.01em; }
    .ds-h2 { font-size: 24px; line-height: 32px; font-weight: 700; letter-spacing: -0.01em; }
    .ds-h3 { font-size: 20px; line-height: 28px; font-weight: 600; letter-spacing: 0; }
    .ds-h4 { font-size: 16px; line-height: 24px; font-weight: 600; letter-spacing: 0; }
    .ds-body { font-size: 14px; line-height: 20px; font-weight: 400; letter-spacing: 0; }
    .ds-body-large { font-size: 16px; line-height: 24px; font-weight: 400; letter-spacing: 0; }
    .ds-body-small { font-size: 12px; line-height: 16px; font-weight: 400; letter-spacing: 0; }
    .ds-label { font-size: 14px; line-height: 20px; font-weight: 500; letter-spacing: 0.01em; }
    .ds-caption { font-size: 12px; line-height: 16px; font-weight: 400; letter-spacing: 0; color: ${a.grey[500]}; }

    /* Animation Classes */
    .ds-fade-in { animation: fadeIn 300ms ease-out; }
    .ds-scale-in { animation: scaleIn 200ms cubic-bezier(0.34, 1.56, 0.64, 1); }

    /* Spacing Utilities */
    .ds-p-0 { padding: ${b[0]}; }
    .ds-p-1 { padding: ${b[1]}; }
    .ds-p-2 { padding: ${b[2]}; }
    .ds-p-3 { padding: ${b[3]}; }
    .ds-p-4 { padding: ${b[4]}; }
    .ds-p-5 { padding: ${b[5]}; }
    .ds-p-6 { padding: ${b[6]}; }
    .ds-p-7 { padding: ${b[7]}; }
    .ds-p-8 { padding: ${b[8]}; }

    .ds-m-0 { margin: ${b[0]}; }
    .ds-m-1 { margin: ${b[1]}; }
    .ds-m-2 { margin: ${b[2]}; }
    .ds-m-3 { margin: ${b[3]}; }
    .ds-m-4 { margin: ${b[4]}; }
    .ds-m-5 { margin: ${b[5]}; }
    .ds-m-6 { margin: ${b[6]}; }
    .ds-m-7 { margin: ${b[7]}; }
    .ds-m-8 { margin: ${b[8]}; }

    .ds-gap-0 { gap: ${b[0]}; }
    .ds-gap-1 { gap: ${b[1]}; }
    .ds-gap-2 { gap: ${b[2]}; }
    .ds-gap-3 { gap: ${b[3]}; }
    .ds-gap-4 { gap: ${b[4]}; }
    .ds-gap-5 { gap: ${b[5]}; }
    .ds-gap-6 { gap: ${b[6]}; }
    .ds-gap-7 { gap: ${b[7]}; }
    .ds-gap-8 { gap: ${b[8]}; }

    /* Layout Utilities */
    .ds-flex { display: flex; }
    .ds-flex-col { flex-direction: column; }
    .ds-items-center { align-items: center; }
    .ds-justify-center { justify-content: center; }
    .ds-justify-between { justify-content: space-between; }
    .ds-text-center { text-align: center; }

    /* Form Help Text */
    .ds-form-help {
      font-size: 12px;
      color: ${a.grey[600]};
      line-height: 1.4;
      margin-top: 4px;
    }

    /* Checkbox Styles */
    .ds-checkbox {
      appearance: none;
      width: 16px;
      height: 16px;
      border: 2px solid ${a.grey[300]};
      border-radius: 3px;
      background-color: ${a.white};
      cursor: pointer;
      position: relative;
      margin-right: 8px;
      transition: all 150ms ease;
    }

    .ds-checkbox:hover {
      border-color: ${a.primary[400]};
    }

    .ds-checkbox:checked {
      background-color: ${a.primary[400]};
      border-color: ${a.primary[400]};
    }

    .ds-checkbox:checked::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 8px;
      border: solid ${a.white};
      border-width: 0 2px 2px 0;
      transform: translate(-50%, -60%) rotate(45deg);
    }

    .ds-checkbox:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .ds-checkbox:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background-color: ${a.grey[50]};
      border-color: ${a.grey[200]};
    }

    .ds-checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 14px;
      line-height: 20px;
      color: ${a.grey[900]};
      cursor: pointer;
      user-select: none;
    }

    .ds-checkbox-label .ds-checkbox-text {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .ds-checkbox-label:hover .ds-checkbox {
      border-color: ${a.primary[400]};
    }

    /* Info Icon Tooltip Styles */
    .ds-info-icon {
      position: relative;
      cursor: pointer;
      color: ${a.grey[600]};
      padding: 4px;
      border-radius: 4px;
      transition: all 150ms ease;
      margin-left: 8px;
    }

    .ds-info-icon:hover {
      background-color: ${a.primary[300]};
      color: ${a.white};
    }

    .ds-info-icon[data-tooltip]:hover::before {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background-color: ${a.black};
      color: ${a.white};
      padding: 6px 8px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 1000;
      margin-bottom: 4px;
    }

    .ds-info-icon[data-tooltip]:hover::after {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 4px solid transparent;
      border-top-color: ${a.black};
      z-index: 1000;
    }
  `});var de,Pe=w(()=>{"use strict";ae();le();X();ce();de=class{constructor(e){h(this,"options");h(this,"resolveChoice",null);h(this,"gitConfig",{});h(this,"validationStates",{token:!1,repository:!1});var t,o,r;this.options=e,e.existingGitConfig&&(this.gitConfig=y({},e.existingGitConfig),this.validationStates.token=!!((t=this.gitConfig.credentials)!=null&&t.token),this.validationStates.repository=!!((o=this.gitConfig.repository)!=null&&o.owner&&((r=this.gitConfig.repository)!=null&&r.name)))}async showChoice(){return new Promise(e=>{this.resolveChoice=e,this.createUI(),this.setupMessageHandling()})}createUI(){var l,d,g;let{extractionResult:e}=this.options,t=((l=e.tokens)==null?void 0:l.length)||0,o=((d=e.variables)==null?void 0:d.length)||0,r=((g=e.collections)==null?void 0:g.length)||0,i=this.isGitConfigured(),n=this.getGitStatus(),s=`
      <!DOCTYPE html>
      <html>
      <head>
        <link href="https://unpkg.com/phosphor-icons@1.4.2/src/css/icons.css" rel="stylesheet">
        <style>
          ${W()}
        </style>
        <style>
          /* Body background with design system gradient */
          body {
            background: var(--color-background-gradient) !important;
            margin: 0;
            padding: 24px;
            min-height: 100vh;
            font-family: var(--font-family);
          }

          /* Additional styles specific to UnifiedExportUI using design system */
          .header {
            text-align: center;
            padding: 24px;
          }

          .header h1 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 0.5px;
          }

          .header p {
            color: #581C87;
            font-size: 14.4px;
            margin-top: 0;
          }

          .stats {
            display: flex;
            justify-content: space-around;
            padding: 16px;
            background: rgba(255,255,255,0.1);
            margin-top: 16px;
            border-radius: 8px;
          }

          .stat {
            text-align: center;
          }

          .stat-value {
            font-size: 20px;
            font-weight: 600;
            display: block;
            color: #6B21A8;
          }

          .stat-label {
            font-size: 12px;
            color: #581C87;
            opacity: 0.8;
          }

          .tabs {
            display: flex;
            border-bottom: 1px solid #e9ecef;
          }

          .tab {
            flex: 1;
            padding: 16px;
            text-align: center;
            background: rgba(255, 255, 255, 0.7);
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: #666;
            transition: all 0.3s ease;
          }

          .tab.active {
            color: #6B21A8;
            border-bottom: 2px solid #6B21A8;
            background: white;
          }

          .tab:hover:not(.active) {
            background: rgba(255, 255, 255, 0.85);
          }

          .tab-content {
            padding: 24px;
            min-height: 200px;
            background: white;
            border-radius: 0 0 12px 12px;
          }

          .tab-panel {
            display: none;
            background: white;
          }

          .tab-panel.active {
            display: block;
          }

          .export-options {
            display: grid;
            gap: 16px;
          }

          .export-option {
            border: 2px solid var(--color-lavender-200);
            border-radius: 12px;
            padding: 20px;
            cursor: pointer;
            transition: var(--transition-default);
            background: white;
          }

          .export-option:hover {
            border-color: var(--color-text-primary);
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
          }

          /* GitHub card specific hover - lavender-blush background with solid gradient-color border */
          #github-export-option:hover:not(.disabled) {
            background: var(--color-background-gradient);
            border-color: var(--color-lavender-300);
          }

          /* Download card specific hover - lavender-blush background with solid gradient-color border */
          .export-option:nth-child(2):hover {
            background: var(--color-background-gradient);
            border-color: var(--color-lavender-300);
          }

          /* Enhanced blush status on download card hover */
          .export-option:nth-child(2):hover .status-available {
            background: var(--color-blush-400);
            color: var(--color-text-primary);
          }

          .export-option.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: #f8f9fa;
          }

          .export-option.disabled:hover {
            transform: none;
            box-shadow: none;
            border-color: #e9ecef;
          }

          .option-header {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
          }

          .option-icon {
            width: 24px;
            height: 24px;
            margin-right: 8px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
          }

          .option-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
          }

          .option-status {
            margin-left: auto;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
          }

          .status-ready {
            background: #d4edda;
            color: #155724;
          }

          .status-setup-required {
            background: #fff3cd;
            color: #856404;
          }

          .status-available {
            background: #E8E9FD;
            color: #553C9A;
            font-weight: 500;
          }

          .option-description {
            color: #666;
            margin-bottom: 12px;
            font-size: 12px;
          }

          .option-details {
            font-size: 12px;
            color: #888;
          }

          .github-setup {
            display: grid;
            gap: 8px;
          }

          .setup-step {
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 10px;
            background: #ECEDF6;
            transition: all 0.2s ease;
          }

          .setup-step:hover {
            background: linear-gradient(135deg, #ECEDF6 0%, #E8E9FD 50%, #DEE3FC 100%);
            border-color: #8B5CF6;
            transform: translateY(-1px);
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          }

          .setup-step.completed {
            background: #F6FBFA;
            border-color: #ECF6F4;
          }

          .setup-step.completed:hover {
            background: linear-gradient(135deg, #dcfce7 0%, #e0f2fe 50%, #f0fdfa 100%);
            border-color: #16a34a;
            transform: translateY(-1px);
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          }

          .step-header {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            cursor: pointer;
            padding: 4px;
            margin: -4px -4px 4px -4px;
            border-radius: 6px;
            transition: background 0.2s;
          }

          .step-header:hover {
            background: var(--color-hover-bg);
          }

          .step-header-arrow {
            margin-left: auto;
            font-size: 18px;
            transition: transform 0.3s, color 0.3s;
            color: #581C87; /* primary 900 - default state */
          }

          .step-header-arrow.collapsed {
            transform: rotate(-90deg);
          }

          .step-header-arrow.validated {
            color: #4FA896; /* mint 700 - validated state */
          }

          .step-number {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #D8B4FE;
            color: #581C87;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            margin-right: 12px;
          }

          .step-number.completed {
            background: #6FBFAD;
            color: white;
          }

          .step-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }

          .step-content {
            margin-left: 36px;
            max-height: 2000px;
            overflow: hidden;
            transition: max-height 0.3s ease, opacity 0.3s ease;
            opacity: 1;
          }

          .step-content.collapsed {
            max-height: 0;
            opacity: 0;
            margin-bottom: 0;
          }

          .form-group {
            margin-bottom: 10px;
          }

          .form-label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #333;
          }

          .form-input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s ease;
          }

          .form-input:focus {
            outline: none;
            border-color: var(--color-primary-light);
          }

          .form-input.validating {
            border-color: #ffc107;
            background: #fffbf0;
          }

          .form-input.valid {
            border-color: #28a745;
            background: #f0fff4;
          }

          .form-input.invalid {
            border-color: #dc3545;
            background: #fff5f5;
          }

          .form-help {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
          }

          .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            display: inline-block;
            text-align: center;
          }

          .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
            box-shadow: none !important;
          }

          .btn-primary {
            background: #DEE3FC;
            color: var(--color-text-primary);
            font-weight: 600;
          }

          .btn-primary:hover:not(:disabled) {
            background: #7C2D92;
            color: white;
          }

          .btn-primary:focus {
            outline: 2px solid var(--color-primary-light);
            outline-offset: 2px;
          }

          .btn-secondary {
            background: #1A1C1E;
            color: white;
          }

          .btn-secondary:hover:not(:disabled) {
            background: #404347;
            color: white;
          }

          .btn-secondary:focus {
            outline: 2px solid #1A1C1E;
            outline-offset: 2px;
          }

          .btn-success {
            background: #a855f7;
            color: white;
          }

          .btn-success:hover:not(:disabled) {
            background: var(--color-success-dark);
          }

          .btn-success:focus {
            outline: 2px solid #a855f7;
            outline-offset: 2px;
          }


          /* Sticky footer layout */
          .main-content {
            padding-bottom: 120px; /* Space for sticky footer */
          }

          .sticky-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            border-top: 1px solid var(--color-border);
            padding: 16px 20px;
            z-index: 1000;
            box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
          }

          /* Action buttons layout */
          .action-buttons {
            display: flex;
            justify-content: center;
            gap: 10px;
            align-items: flex-end;
            margin-top: 8px;
          }

          .action-buttons .btn {
            min-width: 120px;
          }

          .validation-status {
            margin-top: 12px;
            padding: 12px;
            border-radius: 6px;
            font-size: 14px;
          }

          .validation-success {
            background: #d4edda;
            color: #155724;
            border: 0px solid #c3e6cb;
          }

          .validation-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
          }

          .validation-loading {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
          }

          .actions {
            padding: 24px;
            background: #fff ;
            border-top: 0px solid #e9ecef;
            text-align: center;
          }

          .hidden {
            display: none !important;
          }

          /* Security Guidance Styles */
          .security-guidance {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            margin-top: 32px;
            margin-bottom: 16px;
            overflow: hidden;
          }

          .guidance-toggle {
            width: 100%;
            padding: 16px;
            background: none;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            font-weight: 600;
            color: #333;
            transition: background 0.2s;
          }

          .guidance-toggle:hover {
            background: var(--color-hover-bg);
          }

          .guidance-toggle-icon {
            font-size: 18px;
            transition: transform 0.3s;
          }

          .guidance-toggle-icon.expanded {
            transform: rotate(180deg);
          }

          .guidance-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
          }

          .guidance-content.expanded {
            max-height: 2000px;
          }

          .guidance-inner {
            padding: 0 16px 16px 16px;
          }

          .info-box {
            background: linear-gradient(135deg, #e3f2fd 0%, #f0f9ff 100%);
            border: 1px solid #90caf9;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
          }

          .info-box-title {
            font-weight: 600;
            font-size: 14px;
            color: #1565c0;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
          }

          .info-box-title-icon {
            margin-right: 8px;
            font-size: 16px;
          }

          .info-box-content {
            font-size: 13px;
            line-height: 1.6;
            color: #37474f;
          }

          .info-box-content ul {
            margin: 8px 0;
            padding-left: 20px;
          }

          .info-box-content li {
            margin: 4px 0;
          }

          .security-box {
            background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%);
            border: 1px solid #81c784;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
          }

          .security-box-title {
            font-weight: 600;
            font-size: 14px;
            color: #2e7d32;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
          }

          .security-list {
            list-style: none;
            padding: 0;
            margin: 8px 0;
          }

          .security-list li {
            padding: 4px 0;
            font-size: 13px;
            color: #37474f;
          }

          .security-list li::before {
            content: '\u2713 ';
            color: #2e7d32;
            font-weight: bold;
            margin-right: 6px;
          }

          .warning-box {
            background: #fff8e1;
            border: 1px solid #ffb74d;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
          }

          .warning-box-title {
            font-weight: 600;
            font-size: 14px;
            color: #f57c00;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
          }

          .scope-list {
            list-style: none;
            padding: 0;
            margin: 8px 0;
          }

          .scope-list li {
            padding: 4px 0;
            font-size: 13px;
            color: #37474f;
          }

          .scope-required::before {
            content: '\u2713 ';
            color: #2e7d32;
            font-weight: bold;
            margin-right: 6px;
          }

          .scope-not-needed::before {
            content: '\u2717 ';
            color: #c62828;
            font-weight: bold;
            margin-right: 6px;
          }

          .external-link {
            color: #a000ff;
            text-decoration: none;
            font-weight: 500;
          }

          .external-link:hover {
            text-decoration: underline;
          }

          .btn-link {
            background: #000000;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            text-decoration: none;
            display: inline-block;
            font-size: 13px;
            margin-top: 8px;
            transition: background 0.2s;
          }

          .btn-link:hover {
            background: var(--color-primary-dark);
          }

          .validation-auto-note {
            font-size: 11px;
            color: #666;
            font-style: italic;
            margin-top: 8px;
          }

          /* Learn More Tooltip Styles */
          .learn-more {
            color: #000000;
            text-decoration: underline;
            cursor: pointer;
            font-size: 12px;
            margin-left: 4px;
          }

          .learn-more:hover {
            color: var(--color-primary-dark);
          }


          /* Info Section Styles - Collapsible Accordion */
          .info-section {
            margin-top: 24px;
            background: linear-gradient(135deg, #DBEAFE 0%, #E0F2FE 100%);
            border-radius: 12px;
            border: 1px solid #93C5FD;
            overflow: hidden;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
          }

          .info-section-header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            cursor: pointer;
            transition: background-color 0.2s ease;
            user-select: none;
          }

          .info-section-header:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          .info-section-title {
            font-size: 14px;
            font-weight: 600;
            color: #1E40AF;
            margin: 0;
            flex: 1;
          }

          .info-section-arrow {
            font-size: 16px;
            color: #1E40AF;
            transition: transform 0.3s ease;
          }

          .info-section-arrow.expanded {
            transform: rotate(180deg);
          }

          .info-section-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            width: 100%;
            box-sizing: border-box;
          }

          .info-section-content.expanded {
            max-height: 200px;
          }

          .info-section-inner {
            padding: 0 16px 16px 16px;
            width: 100%;
            box-sizing: border-box;
            max-width: 100%;
            overflow-wrap: break-word;
          }

          .info-section-text {
            font-size: 13px;
            color: #1E40AF;
            margin-bottom: 12px;
            line-height: 1.5;
          }

          .github-link {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 8px 16px;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            background: white;
            border: 1px solid #3B82F6;
            border-radius: 6px;
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
            color: #1D4ED8;
            transition: all 0.2s;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .github-link:hover {
            background: #3B82F6;
            color: white;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
          }

          .github-link:focus {
            outline: 2px solid #3B82F6;
            outline-offset: 2px;
          }

          /* Tooltip styles for GitHub token guidance */
          .ds-tooltip-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: all 200ms ease;
          }

          .ds-tooltip-overlay.visible {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
          }

          .ds-tooltip-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            max-width: 400px;
            width: 90%;
            max-height: 90vh;
            height: auto;
            overflow: visible;
            z-index: 10000;
            opacity: 0;
            pointer-events: none;
            transition: all 200ms ease;
          }

          .ds-tooltip-popup.visible {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            pointer-events: auto;
          }

          .ds-tooltip-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 20px 0 20px;
            border-bottom: 1px solid #e9ecef;
            margin-bottom: 20px;
          }

          .ds-tooltip-title {
            font-size: 16px;
            font-weight: 600;
            margin: 0;
            color: #333;
          }

          .ds-tooltip-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
            padding: 4px;
            border-radius: 4px;
            transition: all 150ms ease;
          }

          .ds-tooltip-close:hover {
            background: #f8f9fa;
            color: #333;
          }

          .ds-tooltip-content {
            padding: 0 20px 20px 20px;
            color: #555;
            line-height: 1.5;
            overflow: visible;
            max-height: none;
          }

          .learn-more {
            color: #6B21A8;
            cursor: pointer;
            text-decoration: underline;
            font-weight: 500;
          }

          .learn-more:hover {
            color: #581C87;
          }

          .ds-learn-more {
            color: #6B21A8;
            cursor: pointer;
            text-decoration: underline;
            font-weight: 500;
            font-size: 13px;
          }

          .ds-learn-more:hover {
            color: #581C87;
          }
        </style>
      </head>
      <body>
        <div class="container main-content">
          <div class="header">
            <h1><i class="ph-rocket-launch" data-weight="duotone"></i> Design Tokens Extracted!</h1>
            <p>Choose how to export your tokens</p>

            <div class="stats">
              <div class="stat">
                <span class="stat-value">${t+o}</span>
                <span class="stat-label">Total Tokens</span>
              </div>
              <div class="stat">
                <span class="stat-value">${r}</span>
                <span class="stat-label">Collections</span>
              </div>
            </div>
          </div>

          <div class="tabs">
            <button class="tab active" onclick="switchTab('export')">
              Export Options
            </button>
            <button class="tab" onclick="switchTab('github-setup')">
              Setup
            </button>
          </div>

          <div class="tab-content">
            <!-- Export Options Tab -->
            <div id="export-tab" class="tab-panel active">
              <div class="export-options">
                <div id="github-export-option" class="export-option ${i?"":"disabled"}" onclick="${i?"selectExport('git-push')":"switchTab('github-setup')"}">
                  <div class="option-header">
                    <div class="option-icon" style="background: #000000; color: white;"><i class="ph-rocket-launch" data-weight="bold"></i></div>
                    <div class="option-title">Push to GitHub</div>
                    <div class="option-status ${i?"status-ready":"status-setup-required"}">
                      ${i?"Ready":"Setup Required"}
                    </div>
                  </div>
                  <div class="option-description">
                    Push tokens directly to your GitHub repository with automated commits
                  </div>
                </div>

                <div class="export-option" onclick="selectExport('download')">
                  <div class="option-header">
                    <div class="option-icon" style="background: #000000; color: white;"><i class="ph-download-simple" data-weight="bold"></i></div>
                    <div class="option-title">Download JSON File</div>
                    <div class="option-status status-available">Always Available</div>
                  </div>
                  <div class="option-description">
                    Download tokens as JSON file for manual processing or integration
                  </div>
                </div>

                <!-- NEW: Repository Info Section - Collapsible Accordion -->
                <div class="info-section">
                  <div class="info-section-header" onclick="toggleInfoSection()">
                    <i class="ph-question" data-weight="fill" style="font-size: 20px; color: #1E40AF;"></i>
                    <h3 class="info-section-title">Need help?</h3>
                    <i class="ph-caret-down info-section-arrow" id="info-section-arrow" data-weight="bold"></i>
                  </div>
                  <div class="info-section-content" id="info-section-content">
                    <div class="info-section-inner">
                      <p class="info-section-text">
                        Learn about this plugin, how it works, FAQs etc.
                      </p>
                      <a
                        href="https://github.com/SilvT/Figma-Design-System-Distributor"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="github-link"
                      >
                        <i class="ph-git-branch" data-weight="bold" style="font-size: 16px;"></i>
                        Read documentation on GitHub
                        <span>\u2192</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- GitHub Setup Tab -->
            <div id="github-setup-tab" class="tab-panel">
              ${this.isGitConfigured()?this.renderConfiguredStatus():""}
              <div class="github-setup">
                ${this.renderGitHubSetupSteps()}
              </div>
            </div>
          </div>   
        </div>

        <!-- Token Guidance Tooltip -->
        <div class="ds-tooltip-overlay" id="token-tooltip-overlay" onclick="hideTokenTooltip()"></div>
        <div class="ds-tooltip-popup" id="token-tooltip">
          <div class="ds-tooltip-header">
            <h3 class="ds-tooltip-title">\u{1F511} Creating Your GitHub Token</h3>
            <button class="ds-tooltip-close" onclick="hideTokenTooltip()" aria-label="Close">\xD7</button>
          </div>
          <div class="ds-tooltip-content">
            <p><strong>Step-by-step:</strong></p>
            <p>Go to GitHub \u2192 Settings \u2192 Developer settings \u2192 Personal access tokens \u2192 Generate new token</p>

            <p><strong>Required permissions for this plugin:</strong></p>
            <ul>
              <li>\u2713 <code>repo</code> (for private repositories)<br><span style="margin-left: 20px; font-size: 12px; color: #666;">OR</span></li>
              <li>\u2713 <code>public_repo</code> (if only using public repositories)</li>
            </ul>

            <p><strong>NOT needed (leave unchecked):</strong></p>
            <ul>
              <li>\u2717 <code>admin:org</code></li>
              <li>\u2717 <code>delete_repo</code></li>
              <li>\u2717 <code>workflow</code></li>
              <li>\u2717 <code>admin:public_key</code></li>
              <li>\u2717 Any admin or delete permissions</li>
            </ul>

            <p><strong>Why minimal permissions?</strong></p>
            <p>This plugin only needs to READ your repository structure and WRITE token files. No admin access required.</p>

            <a href="https://github.com/settings/tokens/new" target="_blank" class="ds-tooltip-link">
              Create Token on GitHub \u2192
            </a>
          </div>
        </div>

        <!-- Security Info Tooltip -->
        <div class="ds-tooltip-overlay" id="security-tooltip-overlay" onclick="hideSecurityTooltip()"></div>
        <div class="ds-tooltip-popup" id="security-tooltip">
          <div class="ds-tooltip-header">
            <h3 class="ds-tooltip-title">\u{1F512} How Your Credentials Are Stored</h3>
            <button class="ds-tooltip-close" onclick="hideSecurityTooltip()" aria-label="Close">\xD7</button>
          </div>
          <div class="ds-tooltip-content">
            <p><strong>Your credentials are stored securely on your device:</strong></p>
            <ul>
              <li>\u2713 Encrypted automatically by Figma</li>
              <li>\u2713 Never sent to third-party servers</li>
              <li>\u2713 Only transmitted directly to GitHub's API</li>
              <li>\u2713 Not visible to other Figma users or plugin developers</li>
            </ul>

            <p style="margin-top: 16px;"><strong>What happens when you save credentials:</strong></p>
            <p>When the checkbox is <strong>checked</strong>, your GitHub token and repository details are encrypted and stored in Figma's secure local storage. This allows the plugin to remember your setup between sessions.</p>

            <p style="margin-top: 12px;">When <strong>unchecked</strong>, you'll need to re-enter your credentials each time you use the plugin.</p>

            <p style="margin-top: 16px; padding: 12px; background: var(--color-primary-background); border-radius: 6px; border-left: 3px solid var(--color-primary-light);">
              <strong><i class="ph-lightbulb" data-weight="fill"></i> Recommendation:</strong> Keep this checked for convenience. Your data is encrypted and only accessible to you within Figma.
            </p>
          </div>
        </div>

        <script>
          let currentConfig = ${JSON.stringify(this.gitConfig)};
          let validationStates = ${JSON.stringify(this.validationStates)};

          // Apply initial validation visual states for pre-filled fields
          document.addEventListener('DOMContentLoaded', function() {

            // Auto-validate repository and fetch branches if pre-saved
            if (validationStates.repository && validationStates.token) {
              const ownerInput = document.getElementById('repo-owner');
              const nameInput = document.getElementById('repo-name');

              if (ownerInput && nameInput && ownerInput.value && nameInput.value) {
                console.log('\u{1F33F} Auto-validating pre-saved repository:', ownerInput.value + '/' + nameInput.value);

                // Automatically trigger validation to fetch branches
                setTimeout(() => {
                  validateRepository();
                }, 500); // Small delay to ensure DOM is ready
              }
            }

            // Collapse validated accordions by default
            if (validationStates.token) {
              const tokenInput = document.getElementById('github-token');
              if (tokenInput && tokenInput.value) {
                tokenInput.className = 'form-input valid';
              }

              // Collapse token accordion if validated
              const tokenContent = document.getElementById('token-step-content');
              const tokenArrow = document.getElementById('token-step-arrow');
              if (tokenContent && tokenArrow) {
                tokenContent.classList.add('collapsed');
                tokenArrow.classList.add('collapsed');
              }
            }

            if (validationStates.repository) {
              const ownerInput = document.getElementById('repo-owner');
              const nameInput = document.getElementById('repo-name');
              if (ownerInput && ownerInput.value && nameInput && nameInput.value) {
                ownerInput.className = 'form-input valid';
                nameInput.className = 'form-input valid';
                // Branch input is hidden, so don't style it
              }

              // Collapse repository accordion if validated
              const repoContent = document.getElementById('repository-step-content');
              const repoArrow = document.getElementById('repository-step-arrow');
              if (repoContent && repoArrow) {
                repoContent.classList.add('collapsed');
                repoArrow.classList.add('collapsed');
              }
            }

          });

          // Token tooltip functions
          function showTokenTooltip() {
            const overlay = document.getElementById('token-tooltip-overlay');
            const tooltip = document.getElementById('token-tooltip');

            if (overlay && tooltip) {
              overlay.classList.add('visible');
              tooltip.classList.add('visible');
            }
          }

          function hideTokenTooltip() {
            const overlay = document.getElementById('token-tooltip-overlay');
            const tooltip = document.getElementById('token-tooltip');

            if (overlay && tooltip) {
              overlay.classList.remove('visible');
              tooltip.classList.remove('visible');
            }
          }

          // Make functions globally accessible
          window.showTokenTooltip = showTokenTooltip;
          window.hideTokenTooltip = hideTokenTooltip;

          // Security tooltip functions
          function showSecurityTooltip() {
            const overlay = document.getElementById('security-tooltip-overlay');
            const tooltip = document.getElementById('security-tooltip');

            if (overlay && tooltip) {
              overlay.classList.add('visible');
              tooltip.classList.add('visible');
            }
          }

          function hideSecurityTooltip() {
            const overlay = document.getElementById('security-tooltip-overlay');
            const tooltip = document.getElementById('security-tooltip');

            if (overlay && tooltip) {
              overlay.classList.remove('visible');
              tooltip.classList.remove('visible');
            }
          }

          // Make functions globally accessible
          window.showSecurityTooltip = showSecurityTooltip;
          window.hideSecurityTooltip = hideSecurityTooltip;

          // Toggle accordion step
          function toggleStep(stepId) {
            console.log('\u{1F527} toggleStep() called for:', stepId);
            const content = document.getElementById(stepId + '-content');
            const arrow = document.getElementById(stepId + '-arrow');

            if (content && arrow) {
              const isCollapsed = content.classList.contains('collapsed');
              console.log('\u{1F527} Current state:', isCollapsed ? 'collapsed' : 'expanded');

              if (isCollapsed) {
                console.log('\u{1F527} Expanding step...');
                content.classList.remove('collapsed');
                arrow.classList.remove('collapsed');
              } else {
                console.log('\u{1F527} Collapsing step...');
                content.classList.add('collapsed');
                arrow.classList.add('collapsed');
              }
            } else {
              console.error('\u{1F527} ERROR: Could not find step elements for', stepId);
            }
          }

          // Make function globally accessible
          window.toggleStep = toggleStep;

          // Toggle info section accordion
          function toggleInfoSection() {
            const content = document.getElementById('info-section-content');
            const arrow = document.getElementById('info-section-arrow');

            if (content && arrow) {
              const isExpanded = content.classList.contains('expanded');

              if (isExpanded) {
                content.classList.remove('expanded');
                arrow.classList.remove('expanded');
              } else {
                content.classList.add('expanded');
                arrow.classList.add('expanded');
              }
            }
          }

          // Make function globally accessible
          window.toggleInfoSection = toggleInfoSection;

          function switchTab(tabName) {
            // Update tab buttons
            document.querySelectorAll('.tab').forEach(tab => {
              tab.classList.remove('active');
            });
            document.querySelector(\`button[onclick="switchTab('\${tabName}')"]\`).classList.add('active');

            // Update tab content
            document.querySelectorAll('.tab-panel').forEach(panel => {
              panel.classList.remove('active');
            });
            document.getElementById(tabName + '-tab').classList.add('active');
          }

          function selectExport(type) {
            parent.postMessage({
              pluginMessage: {
                type: 'export-choice',
                choice: type,
                config: type === 'git-push' ? currentConfig : undefined
              }
            }, '*');
          }

          function updateConfig(field, value) {
            const keys = field.split('.');
            let obj = currentConfig;
            for (let i = 0; i < keys.length - 1; i++) {
              if (!obj[keys[i]]) obj[keys[i]] = {};
              obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = value;

            parent.postMessage({
              pluginMessage: { type: 'config-update', config: currentConfig, field, value }
            }, '*');
          }

          function validateToken() {
            const tokenInput = document.getElementById('github-token');
            const token = tokenInput.value;
            if (!token) return;

            // Show validating state
            tokenInput.className = 'form-input validating';

            const statusDiv = document.getElementById('token-validation');
            statusDiv.style.display = 'block';
            statusDiv.className = 'validation-status validation-loading';
            statusDiv.textContent = '\u{1F504} Validating token...';

            parent.postMessage({
              pluginMessage: { type: 'validate-token', token }
            }, '*');
          }

          function validateRepository() {
            const ownerInput = document.getElementById('repo-owner');
            const nameInput = document.getElementById('repo-name');
            const branchInput = document.getElementById('repo-branch');
            const owner = ownerInput.value.trim();
            const name = nameInput.value.trim();
            const branch = 'main'; // Always use 'main' as default

            if (!owner || !name) return;

            // Show validating state (skip branch input since it's hidden)
            ownerInput.className = 'form-input validating';
            nameInput.className = 'form-input validating';

            const statusDiv = document.getElementById('repo-validation');
            statusDiv.style.display = 'block';
            statusDiv.className = 'validation-status validation-loading';
            statusDiv.textContent = '\u{1F504} Validating repository and branch access...';

            parent.postMessage({
              pluginMessage: { type: 'validate-repository', owner, name, branch }
            }, '*');
          }

          function completeSetup() {
            if (!validationStates.token || !validationStates.repository) {
              alert('Please complete token and repository validation first');
              return;
            }

            // Check if user wants to save credentials
            const saveCheckbox = document.getElementById('save-credentials-checkbox');
            const shouldSave = saveCheckbox ? saveCheckbox.checked : true;

            // Collect all form values before saving
            const tokenEl = document.getElementById('github-token');
            const ownerEl = document.getElementById('repo-owner');
            const nameEl = document.getElementById('repo-name');
            const branchEl = document.getElementById('repo-branch');

            if (tokenEl) updateConfig('credentials.token', tokenEl.value);
            if (ownerEl) updateConfig('repository.owner', ownerEl.value);
            if (nameEl) updateConfig('repository.name', nameEl.value);
            if (branchEl) updateConfig('repository.branch', branchEl.value || 'main');

            // Set default paths since we removed the paths section
            updateConfig('paths.rawTokens', '/tokens');
            updateConfig('commitMessage', 'feat: update design tokens from Figma - {{timestamp}}');

            parent.postMessage({
              pluginMessage: {
                type: 'complete-setup',
                config: currentConfig,
                saveCredentials: shouldSave
              }
            }, '*');
          }

          function updateExportOption() {
            const isConfigured = validationStates.token && validationStates.repository;
            // Use reliable ID selector
            const gitOption = document.getElementById('github-export-option');

            if (gitOption) {
              if (isConfigured) {
                gitOption.classList.remove('disabled');
                gitOption.setAttribute('onclick', 'selectExport("git-push")');
                const statusEl = gitOption.querySelector('.option-status');
                if (statusEl) {
                  statusEl.textContent = 'Ready';
                  statusEl.className = 'option-status status-ready';
                }
              } else {
                gitOption.classList.add('disabled');
                gitOption.setAttribute('onclick', 'switchTab("github-setup")');
                const statusEl = gitOption.querySelector('.option-status');
                if (statusEl) {
                  statusEl.textContent = 'Setup Required';
                  statusEl.className = 'option-status status-setup-required';
                }
              }
            } else {
              console.warn('Could not find GitHub export option element');
            }
          }

          // Branch dropdown population function (disabled for setup - only used in push screen)
          function populateBranchDropdown(branches) {
            console.log('\u{1F33F} Branch dropdown disabled in setup screen - branches will be selected in push screen');
            // Just set the default branch value to 'main'
            const branchInput = document.getElementById('repo-branch');
            if (branchInput) {
              branchInput.value = 'main';
            }
          }

          // Handle validation results
          window.addEventListener('message', function(event) {
            if (event.data.pluginMessage) {
              const msg = event.data.pluginMessage;

              if (msg.type === 'token-validation-result') {
                const tokenInput = document.getElementById('github-token');
                const statusDiv = document.getElementById('token-validation');

                // Update input visual state
                if (tokenInput) {
                  tokenInput.className = 'form-input ' + (msg.success ? 'valid' : 'invalid');
                }

                if (statusDiv) {
                  statusDiv.style.display = 'block';
                  statusDiv.className = 'validation-status ' + (msg.success ? 'validation-success' : 'validation-error');
                  statusDiv.textContent = msg.message;

                  validationStates.token = msg.success;
                  updateStepCompletion('token-step', msg.success);
                  updateStepArrow('token-step-arrow', msg.success);
                  updateExportOption();

                  // Update the Complete Setup button state
                  const completeButton = document.querySelector('button[onclick="completeSetup()"]');
                  if (completeButton) {
                    const helpEl = completeButton.parentElement?.querySelector('.form-help');
                    if (validationStates.token && validationStates.repository) {
                      completeButton.disabled = false;
                      if (helpEl) helpEl.textContent = 'Configuration is ready to be saved';
                    } else {
                      completeButton.disabled = true;
                      if (helpEl) helpEl.textContent = 'Complete token and repository validation first';
                    }
                  }
                }
              }

              if (msg.type === 'repository-validation-result') {
                const ownerInput = document.getElementById('repo-owner');
                const nameInput = document.getElementById('repo-name');
                const branchInput = document.getElementById('repo-branch');
                const statusDiv = document.getElementById('repo-validation');

                // Update input visual states (skip branch since it's hidden)
                if (ownerInput && nameInput) {
                  const stateClass = msg.success ? 'valid' : 'invalid';
                  ownerInput.className = 'form-input ' + stateClass;
                  nameInput.className = 'form-input ' + stateClass;
                }

                if (statusDiv) {
                  statusDiv.style.display = 'block';
                  statusDiv.className = 'validation-status ' + (msg.success ? 'validation-success' : 'validation-error');

                  // Handle branch not found case with helpful link
                  if (msg.branchNotFound && msg.owner && msg.name && msg.branch) {
                    const branchesUrl = \`https://github.com/\${msg.owner}/\${msg.name}/branches\`;
                    statusDiv.innerHTML = \`\${msg.message}<br><a href="\${branchesUrl}" target="_blank" class="external-link" style="font-size: 12px; margin-top: 8px; display: inline-block;">Go to repository branches to create '\${msg.branch}' \u2192</a>\`;
                  } else {
                    statusDiv.innerHTML = msg.message;
                  }

                  // If validation successful and branches received, populate branch dropdown
                  if (msg.success && msg.branches) {
                    console.log('\u{1F33F} Received branches:', msg.branches);
                    populateBranchDropdown(msg.branches);
                  } else if (msg.success) {
                    console.log('\u2705 Validation successful but no branches received');
                  }

                  validationStates.repository = msg.success;
                  updateStepCompletion('repository-step', msg.success);
                  updateStepArrow('repository-step-arrow', msg.success);
                  updateExportOption();

                  // Update the Complete Setup button state
                  const completeButton = document.querySelector('button[onclick="completeSetup()"]');
                  if (completeButton) {
                    const helpEl = completeButton.parentElement?.querySelector('.form-help');
                    if (validationStates.token && validationStates.repository) {
                      completeButton.disabled = false;
                      if (helpEl) helpEl.textContent = 'Configuration is ready to be saved';
                    } else {
                      completeButton.disabled = true;
                      if (helpEl) helpEl.textContent = 'Complete token and repository validation first';
                    }
                  }

                  // Update configured status card if validation successful
                  if (msg.success && msg.owner && msg.name && msg.branch) {
                    updateConfiguredStatusCard(msg.owner, msg.name, msg.branch);
                  }
                }
              }

              if (msg.type === 'setup-complete') {
                if (msg.success) {
                  // Update the current configuration with the completed setup
                  if (msg.config) {
                    currentConfig = msg.config;
                    console.log('\u2705 Updated currentConfig with completed setup:', currentConfig);
                  }
                  // Update validation states and UI
                  updateExportOption();
                }
              }

              if (msg.type === 'switch-to-export-tab') {
                switchTab('export');
              }
            }
          });

          function updateStepCompletion(stepId, isCompleted) {
            const step = document.getElementById(stepId);
            const stepNumber = step.querySelector('.step-number');

            if (isCompleted) {
              step.classList.add('completed');
              stepNumber.classList.add('completed');
              stepNumber.textContent = '\u2713';
            } else {
              step.classList.remove('completed');
              stepNumber.classList.remove('completed');
              stepNumber.textContent = stepNumber.getAttribute('data-number');
            }
          }

          function updateStepArrow(arrowId, isValidated) {
            const arrow = document.getElementById(arrowId);
            if (arrow) {
              if (isValidated) {
                arrow.classList.add('validated');
              } else {
                arrow.classList.remove('validated');
              }
            }
          }

          function updateConfiguredStatusCard(owner, name, branch) {
            // Update the repository and branch info in the configured status card
            const repoInfoDiv = document.querySelector('[style*="Repository"]')?.parentElement;
            if (repoInfoDiv) {
              const repoPath = \`\${owner}/\${name}\`;
              repoInfoDiv.innerHTML = \`
                <div style="font-size: 13px; color: var(--color-success-dark); margin-bottom: 6px;">
                  <strong>\u{1F4C1} Repository:</strong> \${repoPath}
                </div>
                <div style="font-size: 13px; color: var(--color-success-dark);">
                  <strong>\u{1F33F} Branch:</strong> \${branch}
                </div>
              \`;
            }
          }

          function resetSetup() {
            if (!confirm('Are you sure you want to reset? This will clear all inputs and saved credentials.')) {
              return;
            }

            // Clear all input fields
            const tokenEl = document.getElementById('github-token');
            const ownerEl = document.getElementById('repo-owner');
            const nameEl = document.getElementById('repo-name');
            const branchEl = document.getElementById('repo-branch');

            if (tokenEl) tokenEl.value = '';
            if (ownerEl) ownerEl.value = '';
            if (nameEl) nameEl.value = '';
            // Branch always defaults to 'main' (field is hidden)
            if (branchEl) branchEl.value = 'main';

            // Clear validation states
            validationStates.token = false;
            validationStates.repository = false;

            // Reset input visual states
            const inputs = document.querySelectorAll('.form-input');
            inputs.forEach(input => input.className = 'form-input');

            // Hide validation status divs
            const statusDivs = document.querySelectorAll('.validation-status');
            statusDivs.forEach(div => div.style.display = 'none');

            // Reset step completion states and arrow colors
            updateStepCompletion('token-step', false);
            updateStepCompletion('repository-step', false);
            updateStepArrow('token-step-arrow', false);
            updateStepArrow('repository-step-arrow', false);

            // Reset Complete Setup button
            const completeButton = document.querySelector('button[onclick="completeSetup()"]');
            if (completeButton) {
              completeButton.disabled = true;
            }

            // Hide "GitHub Already Configured" status card
            const configuredCard = document.getElementById('github-configured-card');
            if (configuredCard) {
              configuredCard.style.display = 'none';
            }

            // Clear storage
            parent.postMessage({
              pluginMessage: { type: 'clear-storage' }
            }, '*');

            updateExportOption();
          }

          window.resetSetup = resetSetup;

          // Auto-save form changes and trigger validation
          let tokenValidationTimer = null;
          let repoValidationTimer = null;

          document.addEventListener('input', function(e) {
            if (e.target.classList.contains('form-input')) {
              updateConfig(e.target.dataset.field, e.target.value);

              // Auto-validate token after user stops typing (debounced)
              if (e.target.id === 'github-token') {
                const tokenInput = e.target;
                const statusDiv = document.getElementById('token-validation');

                // Reset validation state when user modifies input
                tokenInput.className = 'form-input';
                if (statusDiv) {
                  statusDiv.style.display = 'none';
                }
                validationStates.token = false;
                updateStepCompletion('token-step', false);
                updateStepArrow('token-step-arrow', false);
                updateExportOption();

                clearTimeout(tokenValidationTimer);
                tokenValidationTimer = setTimeout(() => {
                  const token = e.target.value.trim();
                  if (token.length > 0) {
                    validateToken();
                  }
                }, 1000); // Wait 1 second after user stops typing
              }

              // Auto-validate repository after owner, name, or branch are filled
              if (e.target.id === 'repo-owner' || e.target.id === 'repo-name' || e.target.id === 'repo-branch') {
                const ownerInput = document.getElementById('repo-owner');
                const nameInput = document.getElementById('repo-name');
                const branchInput = document.getElementById('repo-branch');
                const statusDiv = document.getElementById('repo-validation');

                // Reset validation state when user modifies input
                ownerInput.className = 'form-input';
                nameInput.className = 'form-input';
                branchInput.className = 'form-input';
                if (statusDiv) {
                  statusDiv.style.display = 'none';
                }
                validationStates.repository = false;
                updateStepCompletion('repository-step', false);
                updateStepArrow('repository-step-arrow', false);
                updateExportOption();

                clearTimeout(repoValidationTimer);
                repoValidationTimer = setTimeout(() => {
                  const owner = ownerInput.value.trim();
                  const name = nameInput.value.trim();
                  if (owner.length > 0 && name.length > 0) {
                    validateRepository();
                  }
                }, 1000); // Wait 1 second after user stops typing
              }
            }
          });
        </script>
      </body>
      </html>
    `;figma.showUI(s,P("Export Design Tokens"))}renderSecurityGuidance(){return`
      <div class="security-guidance">
        <button class="guidance-toggle" onclick="toggleGuidance()">
          <span>\u2139\uFE0F Need help creating a GitHub token?</span>
          <span class="guidance-toggle-icon" id="guidance-icon">\u25BC</span>
        </button>

        <div class="guidance-content" id="guidance-content">
          <div class="guidance-inner">

            <!-- Token Scope Guidance -->
            <div class="info-box">
              <div class="info-box-title">
                <span class="info-box-title-icon">\u{1F511}</span>
                Creating Your GitHub Token
              </div>
              <div class="info-box-content">
                <p><strong>Step-by-step:</strong></p>
                <p style="margin: 8px 0;">Go to GitHub \u2192 Settings \u2192 Developer settings \u2192 Personal access tokens \u2192 Generate new token</p>

                <p style="margin-top: 16px;"><strong>Required permissions for this plugin:</strong></p>
                <ul class="scope-list" style="margin: 8px 0;">
                  <li class="scope-required"><code>repo</code> (for private repositories)</li>
                  <li style="margin-left: 20px; font-size: 12px; color: #666; list-style: none;">OR</li>
                  <li class="scope-required"><code>public_repo</code> (if only using public repositories)</li>
                </ul>

                <p style="margin-top: 16px;"><strong>NOT needed (leave unchecked):</strong></p>
                <ul class="scope-list" style="margin: 8px 0;">
                  <li class="scope-not-needed"><code>admin:org</code></li>
                  <li class="scope-not-needed"><code>delete_repo</code></li>
                  <li class="scope-not-needed"><code>workflow</code></li>
                  <li class="scope-not-needed"><code>admin:public_key</code></li>
                  <li class="scope-not-needed">Any admin or delete permissions</li>
                </ul>

                <p style="margin-top: 16px; padding: 12px; background: rgba(249, 168, 212, 0.08); border-radius: 6px; font-size: 13px; line-height: 1.5;">
                  This plugin only needs to READ your repository structure and WRITE token files. No admin access required.
                </p>

                <a href="https://github.com/settings/tokens/new" target="_blank" class="btn-link">
                  Create Token on GitHub \u2192
                </a>
              </div>
            </div>

            <!-- Security & Storage Information -->
            <div class="security-box">
              <div class="security-box-title">
                <span class="info-box-title-icon">\u{1F512}</span>
                Your credentials are stored securely on your device
              </div>
              <ul class="security-list">
                <li>Encrypted automatically by Figma</li>
                <li>Never sent to third-party servers</li>
                <li>Only transmitted directly to GitHub's API</li>
                <li>Not visible to other Figma users or plugin developers</li>
              </ul>
            </div>

            <!-- Token Expiration Recommendations -->
            <div class="warning-box">
              <div class="warning-box-title">
                <span class="info-box-title-icon">\u23F0</span>
                Token Security Best Practices
              </div>
              <div class="info-box-content">
                <p><strong>Set expiration: 90 days (recommended) or 1 year maximum</strong></p>
                <p style="margin-top: 8px;">Why? Regular rotation limits risk if a token is compromised.</p>
                <p style="margin-top: 8px;">You can always regenerate - we'll prompt you to update if your token stops working.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    `}renderConfiguredStatus(){let e=this.gitConfig.repository,t=e?`${e.owner}/${e.name}`:"Unknown",o=(e==null?void 0:e.branch)||"main";return`
      <div class="gitConfigured" style="background: #F6FBFA; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div style="display: flex; align-items: center;">
            <div style="font-size: 20px; margin-right: 12px;"><i class="ph-check-circle" data-weight="fill" style="color: #16a34a;"></i></div>
            <h3 style="margin: 0; color: var(--color-success-dark); font-size: 16px;">GitHub Setup</h3>
          </div>
          <span style="background: #000000; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">Completed</span>
        </div>
        <div style="display:none; background: rgba(255, 255, 255, 0.7); padding: 12px; border-radius: 8px; margin-top: 12px;">
          <div style="font-size: 13px; color: var(--color-success-dark); margin-bottom: 6px;">
            <strong>\u{1F4C1} Repository:</strong> ${t}
          </div>
          <div style="font-size: 13px; color: var(--color-success-dark);">
            <strong>\u{1F33F} Branch:</strong> ${o}
          </div>
        </div>
        <p style="margin: 12px 0 0 0; font-size: 12px; color: var(--color-success-dark); opacity: 0.8;">
          You can update your configuration below if needed
        </p>
      </div>
    `}renderGitHubSetupSteps(){var r;let e=((r=this.gitConfig.credentials)==null?void 0:r.token)||"",t=this.gitConfig.repository||{owner:"",name:"",branch:"main"},o=this.gitConfig.paths||{rawTokens:"tokens/raw/",processedTokens:"tokens/processed/"};return`
      <div id="token-step" class="setup-step ${this.validationStates.token?"completed":""}">
        <div class="step-header" onclick="toggleStep('token-step')">
          <div class="step-number ${this.validationStates.token?"completed":""}" data-number="1">
            ${this.validationStates.token?"\u2713":"1"}
          </div>
          <div class="step-title">GitHub Personal Access Token</div>
          <i class="ph-caret-down step-header-arrow ${this.validationStates.token?"validated":""}" id="token-step-arrow" data-weight="bold"></i>
        </div>
        <div class="step-content" id="token-step-content">
          <div class="form-group">
            <label class="form-label" for="github-token">Personal Access Token</label>
            <input
              type="password"
              id="github-token"
              class="form-input"
              data-field="credentials.token"
              value="${e}"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            >
            <div class="form-help">
              Create a token at
              <a href="https://github.com/settings/personal-access-tokens/new" target="_blank">GitHub Settings</a>
              with 'repo' scope.
              <span class="learn-more" onclick="showTokenTooltip()">Learn more</span>
              <br><br>
              \u23F1\uFE0F Takes ~2 minutes | \u{1F512} Your token never leaves Figma
            </div>
          </div>
          <div class="validation-auto-note">
            \u2728 Validates automatically 1 second after you finish typing
            <button class="ds-btn ds-btn-secondary ds-gap-2" onclick="validateToken()">
              Validate Now
            </button>
          </div>
          <div id="token-validation" class="validation-status" style="display: none;"></div>
        </div>
      </div>

      <div id="repository-step" class="setup-step ${this.validationStates.repository?"completed":""}">
        <div class="step-header" onclick="toggleStep('repository-step')">
          <div class="step-number ${this.validationStates.repository?"completed":""}" data-number="2">
            ${this.validationStates.repository?"\u2713":"2"}
          </div>
          <div class="step-title">Repository Configuration</div>
          <i class="ph-caret-down step-header-arrow ${this.validationStates.repository?"validated":""}" id="repository-step-arrow" data-weight="bold"></i>
        </div>
        <div class="step-content" id="repository-step-content">
          <div class="form-group">
            <label class="form-label" for="repo-owner">Repository Owner</label>
            <input
              type="text"
              id="repo-owner"
              class="form-input"
              data-field="repository.owner"
              value="${t.owner||""}"
              placeholder="your-org-or-username"
            >
          </div>

          <div class="form-group">
            <label class="form-label" for="repo-name">Repository Name</label>
            <input
              type="text"
              id="repo-name"
              class="form-input"
              data-field="repository.name"
              value="${t.name||""}"
              placeholder="design-tokens"
            >
          </div>

          <div class="form-group" style="display: none;">
            <label class="form-label" for="repo-branch">Branch</label>
            <input
              type="text"
              id="repo-branch"
              class="form-input"
              data-field="repository.branch"
              value="${t.branch||"main"}"
              placeholder="main"
            >
            <div class="form-help">
              The branch where tokens will be pushed
              <br><br>
              \u26A0\uFE0F Tip: Most teams use 'main' or 'master'. Don't know? Check your repository on GitHub.
            </div>
          </div>

          <div class="validation-auto-note">
            \u2728 Validates automatically 1 second after you finish typing
            <button class="ds-btn ds-btn-secondary ds-gap-2" onclick="validateRepository()">
              Validate Now
            </button>
          </div>
          <div id="repo-validation" class="validation-status" style="display: none;"></div>
        </div>
      </div>


      <!-- Save Credentials Checkbox -->
      <div class="ds-card" style="margin-top: 8px; background: #f9fafb;">
        <label class="ds-checkbox-label">
          <input
            type="checkbox"
            class="ds-checkbox"
            id="save-credentials-checkbox"
            checked
          >
          <div class="ds-checkbox-text">
            <span>Save credentials between sessions</span>
            <span class="ds-learn-more" onclick="showSecurityTooltip()">Learn more</span>
          </div>
        </label>
        <div class="ds-form-help" style="margin-left: 24px;">
          When checked, your credentials are encrypted and stored locally by Figma
        </div>
      </div>
    </div>

    <!-- Sticky Footer for Setup Actions -->
    <div class="sticky-footer">
      <div class="form-help" style="text-align: center; margin-bottom: 8px;">
        ${this.validationStates.token&&this.validationStates.repository?"Configuration is ready to be saved":"Complete token and repository validation first"}
      </div>
      <div class="action-buttons">
        <button class="ds-btn ds-btn-secondary" onclick="resetSetup()">
          Reset
        </button>
        <button class="ds-btn ds-btn-primary" onclick="completeSetup()" ${this.validationStates.token&&this.validationStates.repository?"":"disabled"}>
          Complete Setup
        </button>
      </div>
    </div>
    `}isGitConfigured(){return this.validationStates.token&&this.validationStates.repository}getGitStatus(){var t;if(!this.isGitConfigured())return{};let e=this.gitConfig.repository;return{repository:e?`${e.owner}/${e.name}`:void 0,path:((t=this.gitConfig.paths)==null?void 0:t.rawTokens)||"tokens/raw/"}}setupMessageHandling(){figma.ui.onmessage=async e=>{switch(e.type){case"export-choice":await this.handleExportChoice(e.choice,e.config);break;case"config-update":this.handleConfigUpdate(e.config);break;case"validate-token":await this.handleTokenValidation(e.token);break;case"validate-repository":await this.handleRepositoryValidation(e.owner,e.name,e.branch);break;case"complete-setup":await this.handleCompleteSetup(e.config,e.saveCredentials);break;case"clear-storage":await this.handleClearStorage();break}}}async handleExportChoice(e,t){if(this.resolveChoice){let o={type:e,gitConfig:t};this.resolveChoice(o)}}handleConfigUpdate(e){this.gitConfig=y(y({},this.gitConfig),e)}async handleTokenValidation(e){try{if(console.log("\u{1F50D} Validating GitHub token:",e.substring(0,10)+"..."),!e.startsWith("ghp_")||e.length!==40){figma.ui.postMessage({type:"token-validation-result",success:!1,message:'Invalid token format. GitHub Personal Access Tokens should start with "ghp_" and be 40 characters long.'});return}let o=await new D({token:e}).validateTokenPermissions();o.valid?(console.log("\u2705 Token validation successful"),this.gitConfig.credentials||(this.gitConfig.credentials={token:"",username:""}),this.gitConfig.credentials.token=e,this.validationStates.token=!0,figma.ui.postMessage({type:"token-validation-result",success:!0,message:"\u2705 Token is valid and has required permissions",user:o.user})):(console.log("\u274C Token validation failed:",o.error),this.validationStates.token=!1,figma.ui.postMessage({type:"token-validation-result",success:!1,message:o.error||"Token validation failed"}))}catch(t){console.error("\u274C Token validation error:",t);let o=t instanceof Error?t.message:"Token validation failed";this.validationStates.token=!1,figma.ui.postMessage({type:"token-validation-result",success:!1,message:`Token validation failed: ${o}`})}}async handleRepositoryValidation(e,t,o){var r;try{let i=o||"main";if(console.log("\u{1F50D} Validating repository access:",`${e}/${t}`,`branch: ${i}`),!e||!t){figma.ui.postMessage({type:"repository-validation-result",success:!1,message:"Please provide both repository owner and name"});return}if(!((r=this.gitConfig.credentials)!=null&&r.token)){figma.ui.postMessage({type:"repository-validation-result",success:!1,message:"Please validate your GitHub token first before testing repository access"});return}let s=await new D(this.gitConfig.credentials).testConnection({owner:e,name:t});if(!s.success){console.log("\u274C Repository validation failed:",s.error),this.validationStates.repository=!1;let l="";s.error&&s.error.toLowerCase().includes("not found")?l=`
            \u274C Repository not found or you don't have access to it.
            <br><br>
            <strong>Common fixes:</strong><br>
            \u2022 Check the repository owner and name are correct<br>
            \u2022 Verify your GitHub token has 'repo' scope<br>
            \u2022 Ensure the repository isn't private (or use 'repo' scope instead of 'public_repo')
            <br><br>
            <button class="ds-btn ds-btn-secondary" onclick="validateRepository()" style="margin-top: 8px;">
              Validate Again
            </button>
          `:l=s.error||"Repository validation failed",figma.ui.postMessage({type:"repository-validation-result",success:!1,message:l,owner:e,name:t});return}console.log("\u2705 Repository access confirmed, fetching branches..."),this.gitConfig.repository||(this.gitConfig.repository={owner:"",name:"",branch:"main"}),this.gitConfig.repository.owner=e,this.gitConfig.repository.name=t,this.validationStates.repository=!0;try{console.log("\u{1F33F} Starting branch fetching...");let l=this.gitConfig.credentials.token,d=`https://api.github.com/repos/${e}/${t}/branches`;console.log("\u{1F33F} Fetching branches from:",d);let g=await fetch(d,{headers:{Authorization:`token ${l}`,Accept:"application/vnd.github.v3+json","User-Agent":"Figma-Design-System-Plugin/1.0"}});if(!g.ok)throw new Error(`Failed to fetch branches: ${g.statusText}`);let f=(await g.json()).map(v=>v.name);console.log("\u{1F33F} Retrieved branches:",f),figma.ui.postMessage({type:"repository-validation-result",success:!0,message:"\u2705 Repository access confirmed",permissions:s.permissions,branches:f,owner:e,name:t})}catch(l){console.warn("\u26A0\uFE0F Could not fetch branches:",l),console.error("\u{1F33F} Branch fetch error details:",l),figma.ui.postMessage({type:"repository-validation-result",success:!0,message:"\u2705 Repository access confirmed",permissions:s.permissions,owner:e,name:t})}}catch(i){console.error("\u274C Repository validation error:",i);let n=i instanceof Error?i.message:"Repository validation failed";this.validationStates.repository=!1,figma.ui.postMessage({type:"repository-validation-result",success:!1,message:`Validation failed: ${n}`})}}async handleClearStorage(){try{console.log("\u{1F5D1}\uFE0F Clearing all stored data..."),await C.clearAll(),this.gitConfig={credentials:{token:"",username:""},repository:{owner:"",name:"",branch:"main"},paths:{rawTokens:"tokens/raw/",processedTokens:"tokens/processed/"},commitMessage:"feat: update design tokens from Figma - {{timestamp}}"},this.validationStates={token:!1,repository:!1},console.log("\u2705 Storage cleared successfully"),figma.notify("\u2705 Setup reset successfully")}catch(e){console.error("\u274C Error clearing storage:",e),figma.notify("\u26A0\uFE0F Error resetting setup",{error:!0})}}async handleCompleteSetup(e,t=!0){var o,r,i;try{console.log("\u{1F3AF} Completing GitHub setup with config:",e),console.log("\u{1F510} Save credentials:",t),this.gitConfig=y({},e),t?(console.log("\u{1F4BE} Saving to SecureStorage..."),e.credentials&&(await C.storeCredentials(e.credentials),console.log("\u2705 Credentials saved to storage")),await C.storeConfig(e),console.log("\u2705 Config saved to storage")):(console.log("\u{1F5D1}\uFE0F Clearing stored credentials (user chose not to save)..."),await C.clearAll(),console.log("\u2705 Credentials cleared from storage"));let n=await C.getCompleteConfig();console.log("\u{1F50D} Verification - Stored config:",{hasCredentials:!!((o=n==null?void 0:n.credentials)!=null&&o.token),hasRepository:!!(n!=null&&n.repository),tokenPreview:((i=(r=n==null?void 0:n.credentials)==null?void 0:r.token)==null?void 0:i.substring(0,10))+"..."}),figma.notify("\u2705 GitHub configuration saved successfully!",{timeout:3e3}),figma.ui.postMessage({type:"setup-complete",success:!0,message:"GitHub configuration saved successfully!",config:this.gitConfig}),setTimeout(()=>{figma.ui.postMessage({type:"switch-to-export-tab"})},1500)}catch(n){console.error("\u274C Setup completion failed:",n);let s=n instanceof Error?n.message:"Setup completion failed";figma.notify(`Setup failed: ${s}`,{error:!0,timeout:5e3}),figma.ui.postMessage({type:"setup-complete",success:!1,message:`Setup failed: ${s}`})}}}});var ue,He=w(()=>{"use strict";ae();ce();X();ue=class{constructor(e){h(this,"options",null);h(this,"currentConfig",{});h(this,"currentStep",0);h(this,"resolveSetup",null);this.options=e||null,e!=null&&e.existingConfig&&(this.currentConfig=y({},e.existingConfig))}async runSetup(){try{let e=await this.showSetup();return e?{success:!0,config:e}:{success:!1,error:"Setup was cancelled by user"}}catch(e){return{success:!1,error:e instanceof Error?e.message:"Setup failed"}}}async showSetup(){return new Promise(e=>{this.resolveSetup=e,this.createSetupUI(),this.setupMessageHandling()})}createSetupUI(){let e=this.getSetupSteps(),t=e[this.currentStep],o=`
      <!DOCTYPE html>
      <html>
       <head>
        <link href="https://unpkg.com/phosphor-icons@1.4.2/src/css/icons.css" rel="stylesheet">
        <style>
          ${W()}
        </style>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: var(--font-family);
            background: var(--color-background-gradient) !important;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .setup-container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            width: 100%;
            overflow: hidden;
          }

          .setup-header {
            background: linear-gradient(135deg, #F7E3E3 0%, #DEE3FC 100%);
            color: #000000;
            padding: 24px;
            text-align: center;
          }

          .setup-header h1 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
          }

          .setup-header p {
            font-size: 14px;
            opacity: 0.9;
          }

          .step-progress {
            display: flex;
            justify-content: center;
            padding: 24px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
          }

          .step-indicator {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .step-circle {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
          }

          .step-circle.completed {
            background: #28a745;
            color: white;
          }

          .step-circle.active {
            background: #000000;
            color: white;
          }

          .step-circle.pending {
            background: #e9ecef;
            color: #6c757d;
          }

          .step-connector {
            width: 40px;
            height: 2px;
            background: #e9ecef;
          }

          .step-connector.completed {
            background: #28a745;
          }

          .setup-content {
            padding: 32px;
          }

          .step-title {
            font-size: 20px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 8px;
          }

          .step-description {
            color: #666;
            margin-bottom: 24px;
            line-height: 1.6;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-label {
            display: block;
            font-weight: 500;
            color: #333;
            margin-bottom: 8px;
          }

          .form-input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s ease;
          }

          .form-input:focus {
            outline: 2px solid var(--color-primary-light);
            outline-offset: 2px;
            border-color: var(--color-text-primary);
          }

          .form-help {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
          }

          .repository-preview {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
          }

          .preview-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }

          .preview-label {
            font-weight: 500;
            color: #333;
          }

          .preview-value {
            color: #000000;
            font-family: 'Monaco', monospace;
            font-size: 12px;
          }

          .setup-actions {
            display: flex;
            justify-content: space-between;
            padding: 24px 32px;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
          }

          .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .btn-secondary {
            background: #6c757d;
            color: white;
          }

          .btn-secondary:hover {
            background: var(--color-text-secondary);
          }

          .btn-primary {
            background: var(--color-primary-light);
            color: var(--color-text-primary);
            font-weight: 600;
          }

          .btn-primary:hover {
            background: var(--color-primary-dark);
            color: white;
          }

          .btn-primary:focus {
            outline: 2px solid var(--color-primary-light);
            outline-offset: 2px;
          }

          .btn:disabled {
            background: #e9ecef;
            color: #6c757d;
            cursor: not-allowed;
          }

          .validation-status {
            margin-top: 12px;
            padding: 12px;
            border-radius: 6px;
            font-size: 12px;
          }

          .validation-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
          }

          .validation-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
          }

          .validation-loading {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
          }
        </style>
      </head>
      <body>
        <div class="setup-container">
          <div class="setup-header">
            <h1><i class="ph-rocket-launch" data-weight="duotone"></i> GitHub Integration Setup</h1>
            <p>Configure your repository for design token distribution</p>
          </div>

          <div class="step-progress">
            <div class="step-indicator">
              ${e.map((r,i)=>this.renderStepIndicator(r,i)).join("")}
            </div>
          </div>

          <div class="setup-content">
            <h2 class="step-title">${t.title}</h2>
            <p class="step-description">${t.description}</p>

            <div id="step-content">
              ${this.renderStepContent(this.currentStep)}
            </div>
          </div>

          <div class="setup-actions">
            <button class="btn btn-secondary" onclick="handleCancel()">
              ${this.currentStep===0?"Cancel":"Back"}
            </button>
            <button class="btn btn-primary" id="next-btn" onclick="handleNext()">
              ${this.currentStep===e.length-1?"Complete Setup":"Next"}
            </button>
          </div>
        </div>

        <script>
          let currentConfig = ${JSON.stringify(this.currentConfig)};
          let currentStep = ${this.currentStep};

          function handleNext() {
            parent.postMessage({
              pluginMessage: { type: 'setup-next', config: currentConfig, step: currentStep }
            }, '*');
          }

          function handleCancel() {
            if (currentStep === 0) {
              parent.postMessage({
                pluginMessage: { type: 'setup-cancel' }
              }, '*');
            } else {
              parent.postMessage({
                pluginMessage: { type: 'setup-back', step: currentStep }
              }, '*');
            }
          }

          function updateConfig(field, value) {
            const keys = field.split('.');
            let obj = currentConfig;
            for (let i = 0; i < keys.length - 1; i++) {
              if (!obj[keys[i]]) obj[keys[i]] = {};
              obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = value;

            parent.postMessage({
              pluginMessage: { type: 'setup-update', config: currentConfig, field, value }
            }, '*');
          }

          function validateToken() {
            const token = document.getElementById('github-token').value;
            parent.postMessage({
              pluginMessage: { type: 'validate-token', token }
            }, '*');
          }

          function validateRepository() {
            const owner = document.getElementById('repo-owner').value;
            const name = document.getElementById('repo-name').value;
            parent.postMessage({
              pluginMessage: { type: 'validate-repository', owner, name }
            }, '*');
          }

          function populateBranchDropdown(branches) {
            console.log('\u{1F33F} populateBranchDropdown called with:', branches);
            const branchInput = document.getElementById('repo-branch');
            console.log('\u{1F33F} Found branchInput element:', branchInput, 'tagName:', branchInput?.tagName);

            if (branchInput && branchInput.tagName === 'INPUT') {
              console.log('\u{1F33F} Converting input to dropdown...');
              // Replace input with select dropdown
              const currentValue = branchInput.value || 'main';
              const parentDiv = branchInput.parentElement;

              const select = document.createElement('select');
              select.id = 'repo-branch';
              select.className = 'form-input';
              select.setAttribute('data-field', 'repository.branch');

              branches.forEach(branch => {
                const option = document.createElement('option');
                option.value = branch;
                option.textContent = branch;
                if (branch === currentValue || (currentValue === 'main' && branch === 'main') || (currentValue === 'main' && !branches.includes('main') && branch === 'master')) {
                  option.selected = true;
                }
                select.appendChild(option);
              });

              parentDiv.replaceChild(select, branchInput);
              updateConfig('repository.branch', select.value);

              select.addEventListener('change', function() {
                updateConfig('repository.branch', this.value);
              });
              console.log('\u2705 Branch dropdown created successfully');
            } else {
              console.log('\u274C Branch input not found or not an INPUT element');
            }
          }

          // Handle validation results
          window.addEventListener('message', function(event) {
            if (event.data.pluginMessage) {
              const msg = event.data.pluginMessage;

              if (msg.type === 'token-validation-result') {
                const statusDiv = document.getElementById('token-validation');
                if (statusDiv) {
                  statusDiv.style.display = 'block';
                  statusDiv.className = 'validation-status ' + (msg.success ? 'validation-success' : 'validation-error');
                  statusDiv.textContent = msg.message;
                }
              }

              if (msg.type === 'repository-validation-result') {
                const statusDiv = document.getElementById('repo-validation');
                if (statusDiv) {
                  statusDiv.style.display = 'block';
                  statusDiv.className = 'validation-status ' + (msg.success ? 'validation-success' : 'validation-error');
                  statusDiv.innerHTML = msg.message;
                }

                // If validation successful, populate branch dropdown
                if (msg.success && msg.branches) {
                  console.log('\u{1F33F} Received branches:', msg.branches);
                  populateBranchDropdown(msg.branches);
                } else if (msg.success) {
                  console.log('\u2705 Validation successful but no branches received');
                }
              }
            }
          });

          // Auto-save form changes
          document.addEventListener('input', function(e) {
            if (e.target.classList.contains('form-input')) {
              updateConfig(e.target.dataset.field, e.target.value);
            }
          });
        </script>
      </body>
      </html>
    `;figma.showUI(o,P("GitHub Integration Setup"))}renderStepIndicator(e,t){let o=t===this.getSetupSteps().length-1,r=e.isComplete?"completed":e.isActive?"active":"pending",i=e.isComplete?"completed":"";return`
      <div class="step-circle ${r}">
        ${e.isComplete?"\u2713":t+1}
      </div>
      ${o?"":`<div class="step-connector ${i}"></div>`}
    `}renderStepContent(e){switch(e){case 0:return this.renderTokenStep();case 1:return this.renderRepositoryStep();case 2:return this.renderConfirmationStep();default:return""}}renderTokenStep(){var t,o;return`
      <div class="form-group">
        <label class="form-label" for="github-token">GitHub Personal Access Token</label>
        <input
          type="password"
          id="github-token"
          class="form-input"
          data-field="credentials.token"
          value="${((t=this.currentConfig.credentials)==null?void 0:t.token)||""}"
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        >
        <div class="form-help">
          Create a new token at
          <a href="https://github.com/settings/personal-access-tokens/new" target="_blank">
            GitHub Settings
          </a>
          with 'repo' scope
        </div>
        <button class="btn btn-secondary" onclick="validateToken()" style="margin-top: 12px;">
          Validate Token
        </button>
        <div id="token-validation" class="validation-status" style="display: none;"></div>
      </div>

      <div class="form-group">
        <label class="form-label" for="github-username">GitHub Username (Optional)</label>
        <input
          type="text"
          id="github-username"
          class="form-input"
          data-field="credentials.username"
          value="${((o=this.currentConfig.credentials)==null?void 0:o.username)||""}"
          placeholder="your-username"
        >
        <div class="form-help">Will be auto-detected from your token if not provided</div>
      </div>
    `}renderRepositoryStep(){let e=this.currentConfig.repository||{owner:"",name:"",branch:"main"};return`
      <div class="form-group">
        <label class="form-label" for="repo-owner">Repository Owner</label>
        <input
          type="text"
          id="repo-owner"
          class="form-input"
          data-field="repository.owner"
          value="${e.owner||""}"
          placeholder="your-org-or-username"
        >
      </div>

      <div class="form-group">
        <label class="form-label" for="repo-name">Repository Name</label>
        <input
          type="text"
          id="repo-name"
          class="form-input"
          data-field="repository.name"
          value="${e.name||""}"
          placeholder="design-tokens"
        >
        <button class="btn btn-secondary" onclick="validateRepository()" style="margin-top: 12px;">
          Validate Repository Access
        </button>
        <div id="repo-validation" class="validation-status" style="display: none;"></div>
      </div>

      <div class="form-group">
        <label class="form-label" for="repo-branch">Branch</label>
        <input
          type="text"
          id="repo-branch"
          class="form-input"
          data-field="repository.branch"
          value="${e.branch||"main"}"
          placeholder="main"
        >
        <div class="form-help">
          The branch where tokens will be pushed
          <br><br>
          \u26A0\uFE0F Tip: Most teams use 'main' or 'master'. Don't know? Check your repository on GitHub.
        </div>
      </div>
    `}renderConfirmationStep(){var t,o,r,i,n;let e=this.currentConfig;return`
      <div class="repository-preview">
        <h3 style="margin-bottom: 16px; color: var(--color-text-primary);">Configuration Summary</h3>

        <div class="preview-item">
          <span class="preview-label">Repository:</span>
          <span class="preview-value">${(t=e.repository)==null?void 0:t.owner}/${(o=e.repository)==null?void 0:o.name}</span>
        </div>

        <div class="preview-item">
          <span class="preview-label">Branch:</span>
          <span class="preview-value">${(r=e.repository)==null?void 0:r.branch}</span>
        </div>


        <div class="preview-item">
          <span class="preview-label">Token:</span>
          <span class="preview-value">${(n=(i=e.credentials)==null?void 0:i.token)==null?void 0:n.substring(0,10)}...</span>
        </div>
      </div>

      <p style="color: var(--color-text-secondary); font-size: 14px; margin-top: 16px;">
        Click "Complete Setup" to save this configuration and start using GitHub integration.
        You can change these settings later in the plugin preferences.
      </p>
    `}getSetupSteps(){return[{id:"token",title:"GitHub Authentication",description:"Provide your GitHub Personal Access Token to authenticate with GitHub API.",isComplete:this.currentStep>0,isActive:this.currentStep===0},{id:"repository",title:"Repository Configuration",description:"Specify the GitHub repository where design tokens will be stored.",isComplete:this.currentStep>1,isActive:this.currentStep===1},{id:"confirmation",title:"Confirm & Save",description:"Review your configuration and complete the setup.",isComplete:!1,isActive:this.currentStep===2}]}setupMessageHandling(){figma.ui.onmessage=async e=>{switch(e.type){case"setup-next":await this.handleNext(e.config);break;case"setup-back":this.handleBack();break;case"setup-cancel":this.handleCancel();break;case"setup-update":this.handleUpdate(e.config,e.field,e.value);break;case"validate-token":await this.handleTokenValidation(e.token);break;case"validate-repository":await this.handleRepositoryValidation(e.owner,e.name);break}}}async handleNext(e){this.currentConfig=e,this.currentConfig.repository?this.currentConfig.repository.branch||(this.currentConfig.repository.branch="main"):this.currentConfig.repository={owner:"",name:"",branch:"main"},this.currentStep<3?(this.currentStep++,this.createSetupUI()):(console.log("\u{1F527} Setup completion - Validating configuration:",this.currentConfig),this.isConfigurationValid()?(console.log("\u2705 Configuration is valid, completing setup..."),this.options&&this.options.onComplete(this.currentConfig),this.resolveSetup&&this.resolveSetup(this.currentConfig)):(console.log("\u274C Configuration validation failed:",this.currentConfig),figma.notify("Please fill in all required fields",{error:!0})))}handleBack(){this.currentStep>0&&(this.currentStep--,this.createSetupUI())}handleCancel(){this.options&&this.options.onCancel(),this.resolveSetup&&this.resolveSetup(null)}handleUpdate(e,t,o){this.currentConfig=e,console.log(`Updated ${t}: ${o}`)}async handleTokenValidation(e){try{if(console.log("\u{1F50D} Validating GitHub token:",e.substring(0,10)+"..."),!e.startsWith("ghp_")||e.length!==40){figma.ui.postMessage({type:"token-validation-result",success:!1,message:'Invalid token format. GitHub Personal Access Tokens should start with "ghp_" and be 40 characters long.'});return}let o=await new D({token:e}).validateTokenPermissions();o.valid?(console.log("\u2705 Token validation successful"),this.currentConfig.credentials={token:e},figma.ui.postMessage({type:"token-validation-result",success:!0,message:"\u2705 Token is valid and has required permissions",user:o.user})):(console.log("\u274C Token validation failed:",o.error),figma.ui.postMessage({type:"token-validation-result",success:!1,message:o.error||"Token validation failed"}))}catch(t){console.error("\u274C Token validation error:",t);let o=t instanceof Error?t.message:"Token validation failed";figma.ui.postMessage({type:"token-validation-result",success:!1,message:`Token validation failed: ${o}`})}}async handleRepositoryValidation(e,t){var o;try{let r=(e==null?void 0:e.trim())||"",i=(t==null?void 0:t.trim())||"";if(console.log("\u{1F50D} Validating repository access:",`${r}/${i}`),!r||!i){figma.ui.postMessage({type:"repository-validation-result",success:!1,message:"Please provide both repository owner and name"});return}if(!((o=this.currentConfig.credentials)!=null&&o.token)){figma.ui.postMessage({type:"repository-validation-result",success:!1,message:"Please configure your GitHub token first before validating repository access"});return}let s=await new D(this.currentConfig.credentials).testConnection({owner:r,name:i});if(s.success){console.log("\u2705 Repository validation successful"),this.currentConfig.repository||(this.currentConfig.repository={owner:"",name:""}),this.currentConfig.repository.owner=r,this.currentConfig.repository.name=i;try{console.log("\u{1F33F} Starting branch fetching...");let l=this.currentConfig.credentials.token,d=`https://api.github.com/repos/${r}/${i}/branches`;console.log("\u{1F33F} Fetching branches from:",d);let g=await fetch(d,{headers:{Authorization:`token ${l}`,Accept:"application/vnd.github.v3+json","User-Agent":"Figma-Design-System-Plugin/1.0"}});if(!g.ok)throw new Error(`Failed to fetch branches: ${g.statusText}`);let f=(await g.json()).map(v=>v.name);console.log("\u{1F33F} Retrieved branches:",f),figma.ui.postMessage({type:"repository-validation-result",success:!0,message:"\u2705 Repository access confirmed",permissions:s.permissions,branches:f})}catch(l){console.warn("\u26A0\uFE0F Could not fetch branches:",l),console.error("\u{1F33F} Branch fetch error details:",l),figma.ui.postMessage({type:"repository-validation-result",success:!0,message:"\u2705 Repository access confirmed",permissions:s.permissions})}}else{console.log("\u274C Repository validation failed:",s.error);let l="";s.error&&s.error.toLowerCase().includes("not found")?l=`
            \u274C Repository not found or you don't have access to it.
            <br><br>
            <strong>Common fixes:</strong><br>
            \u2022 Check the repository owner and name are correct<br>
            \u2022 Verify your GitHub token has 'repo' scope<br>
            \u2022 Ensure the repository isn't private (or use 'repo' scope instead of 'public_repo')
            <br><br>
            <button class="btn btn-secondary" onclick="validateRepository()" style="margin-top: 8px;">
              Validate Again
            </button>
          `:l=s.error||"Repository validation failed",figma.ui.postMessage({type:"repository-validation-result",success:!1,message:l})}}catch(r){console.error("\u274C Repository validation error:",r);let i=r instanceof Error?r.message:"Repository validation failed",n="";i.toLowerCase().includes("not found")||i.toLowerCase().includes("404")?n=`
          \u274C Repository not found or you don't have access to it.
          <br><br>
          <strong>Common fixes:</strong><br>
          \u2022 Check the repository owner and name are correct<br>
          \u2022 Verify your GitHub token has 'repo' scope<br>
          \u2022 Ensure the repository isn't private (or use 'repo' scope instead of 'public_repo')
          <br><br>
          <button class="btn btn-secondary" onclick="validateRepository()" style="margin-top: 8px;">
            Validate Again
          </button>
        `:n=`Validation failed: ${i}`,figma.ui.postMessage({type:"repository-validation-result",success:!1,message:n})}}isConfigurationValid(){var t,o,r,i;let e=this.currentConfig;return!!((t=e.credentials)!=null&&t.token&&((o=e.repository)!=null&&o.owner)&&((r=e.repository)!=null&&r.name)&&((i=e.repository)!=null&&i.branch))}}});var x,S,Oe=w(()=>{"use strict";x=class x{static customBase64Encode(e){let t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",o="",r=0;for(;r<e.length;){let n=e.charCodeAt(r++),s=r<e.length?e.charCodeAt(r++):0,l=r<e.length?e.charCodeAt(r++):0,d=n<<16|s<<8|l;o+=t.charAt(d>>18&63),o+=t.charAt(d>>12&63),o+=t.charAt(d>>6&63),o+=t.charAt(d&63)}let i=e.length%3;return i===1?o=o.slice(0,-2)+"==":i===2&&(o=o.slice(0,-1)+"="),o}static async makeRequest(e,t,o={}){let r=`${x.baseUrl}${t}`,i={Authorization:`Bearer ${e.token}`,Accept:"application/vnd.github.v3+json","User-Agent":"Figma-Design-System-Distributor/1.0.0","Content-Type":"application/json"},n=k(y({},o),{headers:y(y({},i),o.headers)});console.log(`\u{1F310} GitHubStatic API Request: ${o.method||"GET"} ${r}`),console.log(`\u{1F511} Token: ${e.token.substring(0,10)}...`);try{let s=await fetch(r,n);if(console.log(`\u{1F4E1} GitHubStatic API Response: ${s.status} ${s.statusText}`),s.ok||await x.handleApiError(s),s.status===204)return console.log("\u2705 GitHubStatic API: No content response (success)"),{};let l=await s.json();return console.log(`\u2705 GitHubStatic API: Response received (${JSON.stringify(l).length} chars)`),l}catch(s){throw console.error("\u274C GitHubStatic API Request failed:",s),s instanceof Error?s:new Error(`GitHub API request failed: ${String(s)}`)}}static async handleApiError(e){let t;try{t=await e.json()}catch(i){t={message:`HTTP ${e.status}: ${e.statusText}`}}let o=t.message||"Unknown GitHub API error";switch(e.status){case 401:o="Invalid GitHub token. Please check your Personal Access Token.";break;case 403:o.includes("rate limit")?o="GitHub API rate limit exceeded. Please try again later.":o="Insufficient permissions. Please check your token permissions and repository access.";break;case 404:o="Repository not found or you don't have access to it.";break;case 422:if(o=`Validation failed: ${t.message}`,t.errors){let i=t.errors.map(n=>`${n.field}: ${n.code}`).join(", ");o+=` (${i})`}break}let r=new Error(o);throw r.status=e.status,r.githubError=t,r}static async getUser(e){return x.makeRequest(e,"/user")}static async testConnection(e,t){var o,r;try{let n={success:!0,user:await x.getUser(e),permissions:{canRead:!0,canWrite:!1,canAdmin:!1}};if(t)try{let s=await x.getRepository(e,t.owner,t.name);n.repository=s,n.permissions={canRead:!0,canWrite:((o=s.permissions)==null?void 0:o.push)||!1,canAdmin:((r=s.permissions)==null?void 0:r.admin)||!1}}catch(s){n.success=!1,n.error=s instanceof Error?s.message:"Repository access failed"}return n}catch(i){return{success:!1,error:i instanceof Error?i.message:"Connection test failed",permissions:{canRead:!1,canWrite:!1,canAdmin:!1}}}}static async getRepository(e,t,o){return x.makeRequest(e,`/repos/${t}/${o}`)}static async listRepositories(e,t={}){let o=[];t.type&&o.push(`type=${encodeURIComponent(t.type)}`),t.sort&&o.push(`sort=${encodeURIComponent(t.sort)}`),t.per_page&&o.push(`per_page=${encodeURIComponent(t.per_page.toString())}`);let r=o.join("&"),i=`/user/repos${r?`?${r}`:""}`;return x.makeRequest(e,i)}static async getFile(e,t,o,r,i){let n=i?`?ref=${encodeURIComponent(i)}`:"";return x.makeRequest(e,`/repos/${t}/${o}/contents/${r}${n}`)}static async createFile(e,t,o,r,i){var n;console.log(`\u{1F527} GitHubStatic.createFile - owner: ${t}, repo: ${o}, path: ${r}`),console.log("\u{1F527} GitHubStatic.createFile - request keys:",Object.keys(i));try{let s=await x.makeRequest(e,`/repos/${t}/${o}/contents/${r}`,{method:"PUT",body:JSON.stringify(i)});return console.log("\u2705 GitHubStatic.createFile - success, commit SHA:",(n=s.commit)==null?void 0:n.sha),s}catch(s){throw console.error("\u274C GitHubStatic.createFile - failed:",s),s}}static async updateFile(e,t,o,r,i){return x.makeRequest(e,`/repos/${t}/${o}/contents/${r}`,{method:"PUT",body:JSON.stringify(i)})}static async fileExists(e,t,o,r){console.log(`\u{1F527} GitHubStatic.fileExists - owner: ${t}, repo: ${o}, path: ${r}`);try{return await x.getFile(e,t,o,r),console.log("\u2705 GitHubStatic.fileExists - file found, returning true"),!0}catch(i){if(i.status===404)return console.log("\u{1F4C1} GitHubStatic.fileExists - file not found (404), returning false"),!1;throw console.error("\u274C GitHubStatic.fileExists - unexpected error:",i),i}}static async pushTokens(e,t){let{tokens:o,config:r,options:i={}}=t,{repository:n,paths:s}=r;try{let l={success:!1,filesCreated:[],filesUpdated:[]},d=JSON.stringify(o,null,2),g=x.customBase64Encode(d),f={message:i.commitMessage||`Update design tokens from Figma - ${new Date().toISOString().split("T")[0]}`,content:g,branch:i.branchName||n.branch||"main"};if(await x.fileExists(e,n.owner,n.name,s.rawTokens)){let T=await x.getFile(e,n.owner,n.name,s.rawTokens);f.sha=T.sha;let I=await x.updateFile(e,n.owner,n.name,s.rawTokens,f);l.commitSha=I.commit.sha,l.filesUpdated.push(s.rawTokens)}else{let T=await x.createFile(e,n.owner,n.name,s.rawTokens,f);l.commitSha=T.commit.sha,l.filesCreated.push(s.rawTokens)}return l.success=!0,l}catch(l){return{success:!1,error:l instanceof Error?l.message:"Failed to push tokens",filesCreated:[],filesUpdated:[]}}}static async triggerWorkflow(e,t,o,r,i,n){try{return await x.makeRequest(e,`/repos/${t}/${o}/actions/workflows/${r}/dispatches`,{method:"POST",body:JSON.stringify({ref:i,inputs:n||{}})}),{success:!0}}catch(s){return s.status===404?{success:!1,error:"Workflow file not found. Please add the workflow to your repository."}:s.status===403?{success:!1,error:'Insufficient permissions. Token needs "actions:write" scope.'}:{success:!1,error:s.message||"Failed to trigger workflow"}}}static async validateTokenPermissions(e){try{let t=await x.getUser(e);return await x.listRepositories(e,{per_page:1}),{valid:!0,permissions:["user","repo"],user:t}}catch(t){return{valid:!1,permissions:[],error:t instanceof Error?t.message:"Token validation failed"}}}static async getRateLimit(e){return(await x.makeRequest(e,"/rate_limit")).rate}};h(x,"baseUrl","https://api.github.com");S=x});var L,Be=w(()=>{"use strict";ae();Oe();L=class{constructor(e){h(this,"credentials");h(this,"regularClient",null);h(this,"useStaticFallback",!1);h(this,"clientId");this.credentials=e,this.clientId=`hybrid_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,console.log("\u{1F527} GitHubClientHybrid constructor - Creating hybrid client with ID:",this.clientId),this.initializeClient()}initializeClient(){try{console.log("\u{1F527} GitHubClientHybrid - Attempting to create regular GitHubClient..."),this.regularClient=new D(this.credentials),console.log("\u{1F527} GitHubClientHybrid - Testing regular client methods..."),this.testClientMethods(),console.log("\u2705 GitHubClientHybrid - Regular client methods appear valid, will test async methods on first call"),this.useStaticFallback=!1}catch(e){console.warn("\u26A0\uFE0F GitHubClientHybrid - Regular client failed, falling back to static implementation"),console.warn("\u26A0\uFE0F Error details:",e),this.useStaticFallback=!0}}testClientMethods(){if(!this.regularClient)throw new Error("Regular client not available");let e=["fileExists","getUser","testConnection","getRepository"];for(let t of e){let o=this.regularClient[t];if(typeof o!="function")throw new Error(`Method ${t} is not a function (type: ${typeof o})`)}try{let t=typeof this.regularClient.getClientId;if(t!=="function")throw new Error(`getClientId method binding failed (type: ${t})`);if(typeof this.regularClient.getClientId()!="string")throw new Error("getClientId returned non-string value")}catch(t){throw new Error(`Method binding test failed: ${t}`)}}getClientId(){return this.clientId}async getUser(){if(this.useStaticFallback)return console.log("\u{1F504} GitHubClientHybrid.getUser - Using static fallback"),S.getUser(this.credentials);if(this.regularClient)try{return console.log("\u{1F504} GitHubClientHybrid.getUser - Using regular client"),await this.regularClient.getUser()}catch(e){return console.warn("\u26A0\uFE0F GitHubClientHybrid.getUser - Regular client failed, switching to static fallback"),console.warn("\u26A0\uFE0F Error:",e),this.useStaticFallback=!0,S.getUser(this.credentials)}else throw new Error("No client available")}async testConnection(e){if(this.useStaticFallback)return console.log("\u{1F504} GitHubClientHybrid.testConnection - Using static fallback"),S.testConnection(this.credentials,e);if(this.regularClient)return console.log("\u{1F504} GitHubClientHybrid.testConnection - Using regular client"),this.regularClient.testConnection(e);throw new Error("No client available")}async getRepository(e,t){if(this.useStaticFallback)return console.log("\u{1F504} GitHubClientHybrid.getRepository - Using static fallback"),S.getRepository(this.credentials,e,t);if(this.regularClient)return console.log("\u{1F504} GitHubClientHybrid.getRepository - Using regular client"),this.regularClient.getRepository(e,t);throw new Error("No client available")}async listRepositories(e={}){if(this.useStaticFallback)return console.log("\u{1F504} GitHubClientHybrid.listRepositories - Using static fallback"),S.listRepositories(this.credentials,e);if(this.regularClient)return console.log("\u{1F504} GitHubClientHybrid.listRepositories - Using regular client"),this.regularClient.listRepositories(e);throw new Error("No client available")}async getFile(e,t,o,r){if(this.useStaticFallback)return console.log("\u{1F504} GitHubClientHybrid.getFile - Using static fallback"),S.getFile(this.credentials,e,t,o,r);if(this.regularClient)return console.log("\u{1F504} GitHubClientHybrid.getFile - Using regular client"),this.regularClient.getFile(e,t,o,r);throw new Error("No client available")}async createFile(e,t,o,r){if(this.useStaticFallback)return console.log("\u{1F504} GitHubClientHybrid.createFile - Using static fallback"),S.createFile(this.credentials,e,t,o,r);if(this.regularClient)return console.log("\u{1F504} GitHubClientHybrid.createFile - Using regular client"),this.regularClient.createFile(e,t,o,r);throw new Error("No client available")}async updateFile(e,t,o,r){if(this.useStaticFallback)return console.log("\u{1F504} GitHubClientHybrid.updateFile - Using static fallback"),S.updateFile(this.credentials,e,t,o,r);if(this.regularClient)return console.log("\u{1F504} GitHubClientHybrid.updateFile - Using regular client"),this.regularClient.updateFile(e,t,o,r);throw new Error("No client available")}async fileExists(e,t,o){if(this.useStaticFallback)return console.log("\u{1F504} GitHubClientHybrid.fileExists - Using static fallback"),S.fileExists(this.credentials,e,t,o);if(this.regularClient)try{return console.log("\u{1F504} GitHubClientHybrid.fileExists - Using regular client"),await this.regularClient.fileExists(e,t,o)}catch(r){return console.warn("\u26A0\uFE0F GitHubClientHybrid.fileExists - Regular client failed, switching to static fallback"),console.warn("\u26A0\uFE0F Error:",r),this.useStaticFallback=!0,S.fileExists(this.credentials,e,t,o)}else throw new Error("No client available")}async pushTokens(e){if(this.useStaticFallback)return console.log("\u{1F504} GitHubClientHybrid.pushTokens - Using static fallback"),S.pushTokens(this.credentials,e);if(this.regularClient)return console.log("\u{1F504} GitHubClientHybrid.pushTokens - Using regular client"),this.regularClient.pushTokens(e);throw new Error("No client available")}async triggerWorkflow(e,t,o,r,i){if(this.useStaticFallback)return console.log("\u{1F504} GitHubClientHybrid.triggerWorkflow - Using static fallback"),S.triggerWorkflow(this.credentials,e,t,o,r,i);if(this.regularClient)return console.log("\u{1F504} GitHubClientHybrid.triggerWorkflow - Using regular client"),this.regularClient.triggerWorkflow(e,t,o,r,i);throw new Error("No client available")}async validateTokenPermissions(){if(this.useStaticFallback)return console.log("\u{1F504} GitHubClientHybrid.validateTokenPermissions - Using static fallback"),S.validateTokenPermissions(this.credentials);if(this.regularClient)return console.log("\u{1F504} GitHubClientHybrid.validateTokenPermissions - Using regular client"),this.regularClient.validateTokenPermissions();throw new Error("No client available")}async getRateLimit(){if(this.useStaticFallback)return console.log("\u{1F504} GitHubClientHybrid.getRateLimit - Using static fallback"),S.getRateLimit(this.credentials);if(this.regularClient)return console.log("\u{1F504} GitHubClientHybrid.getRateLimit - Using regular client"),this.regularClient.getRateLimit();throw new Error("No client available")}getImplementationInfo(){return{type:this.useStaticFallback?"static":"regular",clientId:this.clientId,isReady:this.useStaticFallback||!!this.regularClient}}}});function ge(){return Z}function Q(){return ct}function dt(){return"figma-tokens.json"}function Me(){return`tokens/raw/${dt()}`}function Ue(){let p=pe.token;return p.startsWith("ghp_")?p.length!==40?(console.error("\u274C Invalid token length - should be 40 characters"),!1):(console.log("\u2705 Hard-coded token format is valid"),!0):(console.error("\u274C Invalid token format - should start with ghp_"),!1)}function Le(){console.log("\u{1F527} Hard-coded GitHub Configuration:"),console.log(`\u{1F4C1} Repository: ${Z.repository.owner}/${Z.repository.name}`),console.log(`\u{1F33F} Branch: ${Z.repository.branch}`),console.log(`\u{1F4C2} Raw tokens path: ${Z.paths.rawTokens}`),console.log(`\u{1F511} Token: ${pe.token.substring(0,10)}...`),console.log(`\u{1F464} Username: ${pe.username}`)}var pe,Z,ct,xe=w(()=>{"use strict";pe={token:"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",username:"SilvT"},Z={credentials:pe,repository:{owner:"SilvT",name:"ds-distributor",branch:"main"},paths:{rawTokens:"tokens/raw/figma-tokens.json",processedTokens:"tokens/processed/"},commitMessage:"feat: update design tokens from Figma - {{timestamp}}"},ct=!1});var u,ee=w(()=>{"use strict";u=class{static log(e,t){let r=`[${new Date().toISOString().split("T")[1].slice(0,-1)}] \u{1F50D} ${e}`;this.logs.push(r+(t?` ${JSON.stringify(t)}`:""))}static inspectObject(e,t){}static traceMethodCall(e,t,o){if(this.log(`ATTEMPTING: ${e}.${t}`),!o)return this.log(`\u274C OBJECT IS NULL/UNDEFINED: ${e}`),!1;let r=o[t];return this.log(`METHOD CHECK: ${e}.${t}`,{exists:t in o,type:typeof r,isFunction:typeof r=="function",boundCorrectly:r&&(r.toString().includes("bound")||r.name===t),hasOwnProperty:o.hasOwnProperty(t),inPrototype:t in Object.getPrototypeOf(o)}),typeof r!="function"?(this.log(`\u274C NOT A FUNCTION: ${e}.${t} is ${typeof r}`),this.inspectObject(e,o),!1):(this.log(`\u2705 METHOD VALID: ${e}.${t} is ready to call`),!0)}static traceAsyncMethodCall(e,t,o,r){return new Promise(i=>{if(this.log(`ASYNC TRACE: ${e}.${t}`,r),!this.traceMethodCall(e,t,o)){i(!1);return}try{this.log(`TESTING CALL: ${e}.${t}`),o[t].constructor.name==="AsyncFunction"&&this.log(`\u2705 ASYNC METHOD CONFIRMED: ${e}.${t}`),i(!0)}catch(s){this.log(`\u274C METHOD CALL TEST FAILED: ${e}.${t}`,s),i(!1)}})}static getDiagnosticReport(){return[...this.logs]}static clearLogs(){this.logs=[]}static exportDiagnostics(){return["=".repeat(80),"GITHUB CLIENT DIAGNOSTIC REPORT",`Generated: ${new Date().toISOString()}`,"=".repeat(80),"",...this.logs,"","=".repeat(80),"END OF REPORT"].join(`
`)}};h(u,"logs",[])});var _,N,te=w(()=>{"use strict";Be();le();xe();ee();Y();_=class _{constructor(){h(this,"client",null);h(this,"state",{isConfigured:!1,isConnected:!1,errors:[]});c.githubDebug("\u{1F527} GitHubAuth constructor - Creating singleton instance"),u.log("GitHubAuth constructor called")}static getInstance(){return _.instance?(c.githubDebug("\u{1F527} GitHubAuth.getInstance - Returning existing singleton instance"),u.log("Reusing EXISTING GitHubAuth singleton instance")):(c.githubDebug("\u{1F527} GitHubAuth.getInstance - Creating new singleton instance"),u.log("Creating NEW GitHubAuth singleton instance"),_.instance=new _),_.instance}async initialize(){var e,t,o,r;try{if(c.githubDebug("\u{1F41B} DEBUG: GitHubAuth.initialize() - START"),c.githubDebug("\u{1F41B} DEBUG: Hard-coded mode? "+Q()),Q()){if(c.githubDebug("\u{1F527} Using hard-coded GitHub configuration for testing..."),!Ue())throw new Error("Invalid hard-coded token format");Le();let n=ge();c.githubDebug("\u{1F527} GitHubAuth - Creating GitHubClient with credentials..."),c.githubDebug("\u{1F527} GitHubAuth - Credentials: "+JSON.stringify({token:n.credentials.token.substring(0,10)+"...",username:n.credentials.username})),this.client=new L(n.credentials),c.githubDebug("\u{1F527} GitHubAuth - GitHubClient created: "+typeof this.client),c.githubDebug("\u{1F527} GitHubAuth - Client methods: "+Object.getOwnPropertyNames(Object.getPrototypeOf(this.client)).join(", ")),this.state={isConfigured:!0,isConnected:!0,config:n,errors:[],lastTestResult:{success:!0,user:{login:n.credentials.username||"TestUser"},permissions:{canRead:!0,canWrite:!0,canAdmin:!1}}},c.githubDebug("\u{1F41B} DEBUG: Hard-coded state set: "+this.state.isConfigured+", "+this.state.isConnected),c.githubDebug("\u2705 Hard-coded configuration initialized successfully");return}c.githubDebug("\u{1F41B} DEBUG: Loading stored configuration...");let i=await C.getCompleteConfig();if(c.githubDebug("\u{1F41B} DEBUG: Stored config loaded: "+!!i+", "+!!((e=i==null?void 0:i.credentials)!=null&&e.token)),(t=i==null?void 0:i.credentials)!=null&&t.token){c.githubDebug("\u{1F41B} DEBUG: Creating client from stored config..."),c.githubDebug("\u{1F41B} DEBUG: Token preview: "+i.credentials.token.substring(0,10)+"..."),c.githubDebug("\u{1F41B} DEBUG: Repository: "+((o=i.repository)==null?void 0:o.owner)+"/"+((r=i.repository)==null?void 0:r.name)),this.client=new L(i.credentials),this.state={isConfigured:!0,isConnected:!1,config:i,errors:[]},c.githubDebug("\u{1F41B} DEBUG: Dynamic state set: "+this.state.isConfigured+", "+this.state.isConnected),c.githubDebug("\u{1F41B} DEBUG: Config stored in state: "+!!this.state.config);let n=await C.getLastConnectionTest();n&&(this.state.lastTestResult=n,this.state.isConnected=n.success,c.githubDebug("\u{1F41B} DEBUG: Last test result restored: "+n.success))}else c.githubDebug("\u{1F41B} DEBUG: No stored configuration found"),this.state={isConfigured:!1,isConnected:!1,errors:[]};c.githubDebug("\u{1F41B} DEBUG: GitHubAuth.initialize() - END, final state: "+JSON.stringify({isConfigured:this.state.isConfigured,isConnected:this.state.isConnected,hasClient:!!this.client,hasConfig:!!this.state.config}))}catch(i){console.error("\u{1F41B} DEBUG: GitHubAuth.initialize() - ERROR:",i),this.state={isConfigured:!1,isConnected:!1,errors:[i instanceof Error?i.message:"Initialization failed"]}}}getState(){return y({},this.state)}getConnectionStatus(){var e;if(!this.state.isConfigured||!this.state.lastTestResult)return"not-configured";if(!this.state.lastTestResult.success){let t=((e=this.state.lastTestResult.error)==null?void 0:e.toLowerCase())||"";return t.includes("token")||t.includes("401")?"invalid-token":t.includes("not found")||t.includes("404")?"repository-not-found":t.includes("permission")||t.includes("403")?"insufficient-permissions":"error"}return"connected"}async configure(e){var t,o,r,i,n,s;try{if(c.githubDebug("\u{1F41B} DEBUG: GitHubAuth.configure() - START"),c.githubDebug("\u{1F41B} DEBUG: Input config: "+JSON.stringify({hasToken:!!((t=e.credentials)!=null&&t.token),tokenPreview:((r=(o=e.credentials)==null?void 0:o.token)==null?void 0:r.substring(0,10))+"...",repository:((i=e.repository)==null?void 0:i.owner)+"/"+((n=e.repository)==null?void 0:n.name),branch:(s=e.repository)==null?void 0:s.branch})),!e.credentials.token||e.credentials.token.trim().length===0)throw new Error("GitHub token is required");if(!e.repository.owner||!e.repository.name)throw new Error("Repository owner and name are required");return c.githubDebug("\u{1F41B} DEBUG: Storing configuration to SecureStorage..."),await C.storeCredentials(e.credentials),await C.storeConfig(e),c.githubDebug("\u{1F41B} DEBUG: Configuration stored successfully"),c.githubDebug("\u{1F41B} DEBUG: Creating new GitHubClientHybrid..."),this.client=new L(e.credentials),c.githubDebug("\u{1F41B} DEBUG: Client created with ID: "+this.client.getClientId()),this.state={isConfigured:!0,isConnected:!1,config:e,errors:[]},c.githubDebug("\u{1F41B} DEBUG: GitHubAuth.configure() - SUCCESS, state updated: "+JSON.stringify({isConfigured:this.state.isConfigured,isConnected:this.state.isConnected,hasClient:!!this.client,hasConfig:!!this.state.config})),{success:!0}}catch(l){console.error("\u{1F41B} DEBUG: GitHubAuth.configure() - ERROR:",l);let d=l instanceof Error?l.message:"Configuration failed";return this.state.errors=[d],{success:!1,error:d}}}async updateToken(e){try{if(!e||e.trim().length===0)throw new Error("Token cannot be empty");let t=await C.getConfig();if(!t)throw new Error("No existing configuration found");let o={token:e.trim()},r=k(y({},t),{credentials:o});return await C.storeCredentials(o),this.client=new L(o),this.state.config=r,this.state.isConnected=!1,this.state.lastTestResult=void 0,this.state.errors=[],{success:!0}}catch(t){let o=t instanceof Error?t.message:"Token update failed";return this.state.errors=[o],{success:!1,error:o}}}async testConnection(){var e;try{if(!this.client)throw new Error("GitHub client not configured");if(!((e=this.state.config)!=null&&e.repository))throw new Error("Repository configuration not found");let t=await this.client.testConnection({owner:this.state.config.repository.owner,name:this.state.config.repository.name});return await C.storeLastConnectionTest(t),this.state.lastTestResult=t,this.state.isConnected=t.success,t.success?this.state.errors=[]:this.state.errors=[t.error||"Connection test failed"],t}catch(t){let o=t instanceof Error?t.message:"Connection test failed",r={success:!1,error:o,permissions:{canRead:!1,canWrite:!1,canAdmin:!1}};return this.state.lastTestResult=r,this.state.isConnected=!1,this.state.errors=[o],r}}async validateCredentials(){try{if(!this.client)return{valid:!1,error:"No GitHub client configured"};let e=await this.client.validateTokenPermissions();return{valid:e.valid,error:e.error}}catch(e){return{valid:!1,error:e instanceof Error?e.message:"Credential validation failed"}}}getClient(){var e;if(c.githubDebug("\u{1F41B} DEBUG: GitHubAuth.getClient() - Called"),c.githubDebug("\u{1F41B} DEBUG: Current state: "+JSON.stringify({isConfigured:this.state.isConfigured,isConnected:this.state.isConnected,hasClient:!!this.client,hasConfig:!!this.state.config,clientId:(e=this.client)==null?void 0:e.getClientId()})),!this.client)throw console.error("\u{1F41B} DEBUG: GitHubAuth.getClient() - NO CLIENT AVAILABLE!"),console.error("\u{1F41B} DEBUG: State dump:",JSON.stringify(this.state,null,2)),new Error("GitHub client not configured. Please configure your GitHub credentials first.");return c.githubDebug("\u{1F41B} DEBUG: GitHubAuth.getClient() - Returning client ID: "+this.client.getClientId()),this.client}createBoundClient(){if(!this.client)throw u.log("\u274C Cannot create bound client - original client not configured"),new Error("GitHub client not configured. Please configure your GitHub credentials first.");c.githubDebug("\u{1F527} GitHubAuth.createBoundClient - Creating bound client with closures"),u.log(`Creating bound client for client ID: ${this.client.getClientId()}`);let e=this.client,t=e.getClientId(),o=[];u.inspectObject("originalClient",e),u.traceMethodCall("originalClient","fileExists",e),u.traceMethodCall("originalClient","createFile",e),u.traceMethodCall("originalClient","updateFile",e),u.traceMethodCall("originalClient","getFile",e);let r={fileExists:async(i,n,s)=>{u.log(`[${t}] EXECUTING fileExists`,{owner:i,repo:n,path:s}),c.githubDebug("\u{1F527} BoundClient.fileExists - Called with proper context");try{if(!e)throw new Error("Original client is null");if(typeof e.fileExists!="function")throw new Error("fileExists method is not a function");let l=await e.fileExists(i,n,s);return u.log(`[${t}] fileExists SUCCESS`,{result:l}),l}catch(l){throw u.log(`[${t}] fileExists FAILED`,l),l}},createFile:async(i,n,s,l)=>{u.log(`[${t}] EXECUTING createFile`,{owner:i,repo:n,path:s}),c.githubDebug("\u{1F527} BoundClient.createFile - Called with proper context");try{if(!e)throw new Error("Original client is null");if(typeof e.createFile!="function")throw new Error("createFile method is not a function");let d=await e.createFile(i,n,s,l);return u.log(`[${t}] createFile SUCCESS`),d}catch(d){throw u.log(`[${t}] createFile FAILED`,d),d}},updateFile:async(i,n,s,l)=>{u.log(`[${t}] EXECUTING updateFile`,{owner:i,repo:n,path:s}),c.githubDebug("\u{1F527} BoundClient.updateFile - Called with proper context");try{if(!e)throw new Error("Original client is null");if(typeof e.updateFile!="function")throw new Error("updateFile method is not a function");let d=await e.updateFile(i,n,s,l);return u.log(`[${t}] updateFile SUCCESS`),d}catch(d){throw u.log(`[${t}] updateFile FAILED`,d),d}},getFile:async(i,n,s)=>{u.log(`[${t}] EXECUTING getFile`,{owner:i,repo:n,path:s}),c.githubDebug("\u{1F527} BoundClient.getFile - Called with proper context");try{if(!e)throw new Error("Original client is null");if(typeof e.getFile!="function")throw new Error("getFile method is not a function");let l=await e.getFile(i,n,s);return u.log(`[${t}] getFile SUCCESS`),l}catch(l){throw u.log(`[${t}] getFile FAILED`,l),l}},getRepository:async(i,n)=>{u.log(`[${t}] EXECUTING getRepository`,{owner:i,repo:n}),c.githubDebug("\u{1F527} BoundClient.getRepository - Called with proper context");try{if(!e)throw new Error("Original client is null");if(typeof e.getRepository!="function")throw new Error("getRepository method is not a function");let s=await e.getRepository(i,n);return u.log(`[${t}] getRepository SUCCESS`),s}catch(s){throw u.log(`[${t}] getRepository FAILED`,s),s}},testConnection:async i=>{u.log(`[${t}] EXECUTING testConnection`,i),c.githubDebug("\u{1F527} BoundClient.testConnection - Called with proper context");try{if(!e)throw new Error("Original client is null");if(typeof e.testConnection!="function")throw new Error("testConnection method is not a function");let n=await e.testConnection(i);return u.log(`[${t}] testConnection SUCCESS`),n}catch(n){throw u.log(`[${t}] testConnection FAILED`,n),n}},getUser:async()=>{u.log(`[${t}] EXECUTING getUser`),c.githubDebug("\u{1F527} BoundClient.getUser - Called with proper context");try{if(!e)throw new Error("Original client is null");if(typeof e.getUser!="function")throw new Error("getUser method is not a function");let i=await e.getUser();return u.log(`[${t}] getUser SUCCESS`),i}catch(i){throw u.log(`[${t}] getUser FAILED`,i),i}}};return o.push("fileExists","createFile","updateFile","getFile","getRepository","testConnection","getUser"),o.forEach(i=>{let n=r[i];u.log(`Method verification: ${i} is ${typeof n}`,{isFunction:typeof n=="function",isAsync:n.constructor.name==="AsyncFunction"})}),u.log(`Bound client created with methods: ${o.join(", ")}`),u.inspectObject("boundClient",r),r}hasClient(){return this.client!==null}async clearConfiguration(){try{await C.clearAll(),this.client=null,this.state={isConfigured:!1,isConnected:!1,errors:[]}}catch(e){throw this.state.errors=[e instanceof Error?e.message:"Failed to clear configuration"],e}}async getRepositoryInfo(){var e;if(!this.client||!((e=this.state.config)!=null&&e.repository))throw new Error("GitHub not configured");return this.client.getRepository(this.state.config.repository.owner,this.state.config.repository.name)}async listRepositories(){if(!this.client)throw new Error("GitHub not configured");return this.client.listRepositories({type:"owner",sort:"updated",per_page:100})}canPushToRepository(){var e,t;return((t=(e=this.state.lastTestResult)==null?void 0:e.permissions)==null?void 0:t.canWrite)||!1}getPublicConfig(){return this.state.config?{repository:this.state.config.repository,paths:this.state.config.paths,commitMessage:this.state.config.commitMessage}:null}};h(_,"instance");N=_});var _e={};we(_e,{MethodValidator:()=>H,analyzeMethodBinding:()=>gt,createSafeWrapper:()=>pt,validateMethods:()=>ut});var H,ut,pt,gt,ze=w(()=>{"use strict";H=class{static validateMethods(e,t,o="object"){var g;let r=[],i=[],n={};if(console.log(`\u{1F50D} Validating methods on ${o}:`,e),!e)return{isValid:!1,missingMethods:t,invalidMethods:[],debugInfo:{objectType:"null/undefined",availableProperties:[],methodTypes:{}}};let s=this.getAllProperties(e);console.log(`\u{1F4CB} Available properties on ${o}:`,s);for(let m of t){let f=e[m],v=typeof f;if(n[m]=v,console.log(`  - ${m}: ${v}`),f==null)r.push(m),console.warn(`    \u274C Missing: ${m}`);else if(typeof f!="function")i.push(m),console.warn(`    \u274C Invalid type: ${m} is ${v}`);else{console.log(`    \u2705 Valid: ${m}`);try{let T=f.toString().includes("=>"),I=f.name==="bound "+m;console.log(`    \u{1F4DD} ${m} - Arrow: ${T}, Bound: ${I}`)}catch(T){console.warn(`    \u26A0\uFE0F Method inspection failed for ${m}:`,T)}}}let l=r.length===0&&i.length===0,d={isValid:l,missingMethods:r,invalidMethods:i,debugInfo:{objectType:((g=e.constructor)==null?void 0:g.name)||typeof e,availableProperties:s,methodTypes:n}};return l?console.log(`\u2705 Method validation passed for ${o}`):console.error(`\u274C Method validation failed for ${o}:`,d),d}static getAllProperties(e){let t=new Set,o=e;for(;o&&o!==Object.prototype;)try{Object.getOwnPropertyNames(o).forEach(r=>{r!=="constructor"&&t.add(r)}),Object.getOwnPropertySymbols(o).forEach(r=>{t.add(r.toString())}),o=Object.getPrototypeOf(o)}catch(r){console.warn("Property enumeration failed:",r);break}return Array.from(t).sort()}static createSafeWrapper(e,t,o="object"){let r=t,i=this.validateMethods(e,r,o);if(!i.isValid)throw new Error(`Safe wrapper creation failed for ${o}: Missing: [${i.missingMethods.join(", ")}], Invalid: [${i.invalidMethods.join(", ")}]`);return new Proxy(e,{get(n,s){let l=n[s];if(typeof s=="string"&&r.includes(s)){if(typeof l!="function")throw new Error(`Method ${s} on ${o} is not a function (type: ${typeof l})`);return function(...d){console.log(`\u{1F527} Calling ${o}.${s} with`,d.length,"arguments");try{let g=l.apply(n,d);return console.log(`\u2705 ${o}.${s} completed successfully`),g}catch(g){throw console.error(`\u274C ${o}.${s} failed:`,g),g}}}return l}})}static analyzeMethodBinding(e,t){if(console.log(`\u{1F52C} Analyzing method binding for ${t}:`),!e){console.log("  \u274C Object is null/undefined");return}let o=e[t];if(!o){console.log(`  \u274C Method ${t} does not exist`);return}if(typeof o!="function"){console.log(`  \u274C ${t} is not a function (type: ${typeof o})`);return}console.log("  \u{1F4CB} Method analysis:"),console.log(`    - Type: ${typeof o}`),console.log(`    - Name: "${o.name}"`),console.log(`    - Length: ${o.length}`);try{let r=o.toString();console.log(`    - Source length: ${r.length} chars`),console.log(`    - Is arrow function: ${r.includes("=>")}`),console.log(`    - Contains 'this': ${r.includes("this")}`),console.log(`    - Is bound: ${o.name.includes("bound")}`);let i=r.includes("[native code]");console.log(`    - Is native: ${i}`)}catch(r){console.log(`    - Source inspection failed: ${r}`)}try{console.log("  \u{1F9EA} Testing method binding:");let r=e[t],i=o.bind(e);console.log(`    - Unbound type: ${typeof r}`),console.log(`    - Bound type: ${typeof i}`),console.log(`    - Same reference: ${r===o}`)}catch(r){console.log(`    - Binding test failed: ${r}`)}}},ut=H.validateMethods.bind(H),pt=H.createSafeWrapper.bind(H),gt=H.analyzeMethodBinding.bind(H)});var M,ke=w(()=>{"use strict";te();ee();Y();M=class{constructor(){h(this,"auth");h(this,"client",null);h(this,"boundClient",null);this.auth=N.getInstance()}async initialize(){if(u.log("GitOperations.initialize - Starting"),c.githubDebug("\u{1F527} GitOperations.initialize - Starting..."),await this.auth.initialize(),u.log("GitOperations.initialize - Auth initialized"),c.githubDebug("\u{1F527} GitOperations.initialize - Auth initialized"),this.auth.hasClient()){u.log("GitOperations.initialize - Auth has client, getting it"),c.githubDebug("\u{1F527} GitOperations.initialize - Auth has client, getting it..."),this.client=this.auth.getClient(),this.boundClient=this.auth.createBoundClient();let e=this.client.getClientId();u.log(`GitOperations.initialize - Client retrieved with ID: ${e}`),u.log("GitOperations.initialize - Bound client created",{clientType:typeof this.client,boundClientType:typeof this.boundClient,clientId:e}),c.githubDebug("\u{1F527} GitOperations.initialize - Client retrieved: "+typeof this.client),c.githubDebug("\u{1F527} GitOperations.initialize - Bound client created: "+typeof this.boundClient),c.githubDebug("\u{1F527} GitOperations.initialize - Client ID: "+e),c.githubDebug("\u{1F527} GitOperations.initialize - Client prototype: "+Object.getOwnPropertyNames(Object.getPrototypeOf(this.client||{})).join(", ")),this.client&&(u.inspectObject("GitOperations.client",this.client),u.inspectObject("GitOperations.boundClient",this.boundClient),c.githubDebug("\u{1F527} Available methods on client:"),c.githubDebug("  - fileExists: "+typeof this.client.fileExists),c.githubDebug("  - createFile: "+typeof this.client.createFile),c.githubDebug("  - updateFile: "+typeof this.client.updateFile),c.githubDebug("  - getFile: "+typeof this.client.getFile),c.githubDebug("  - getUser: "+typeof this.client.getUser),c.githubDebug("\u{1F527} Instance properties: "+Object.getOwnPropertyNames(this.client).join(", ")),c.githubDebug("\u{1F527} Instance methods in prototype: "+Object.getOwnPropertyNames(Object.getPrototypeOf(this.client)).join(", ")))}else u.log("GitOperations.initialize - Auth does not have client"),c.githubDebug("\u{1F527} GitOperations.initialize - Auth does not have client");u.log("GitOperations.initialize - Completed successfully"),c.githubDebug("\u{1F527} GitOperations.initialize - Completed")}async validateRepository(e){var t,o;try{if(u.log("GitOperations.validateRepository - Starting",e),!this.boundClient)throw u.log("\u274C GitOperations.validateRepository - Bound client not initialized"),new Error("GitHub bound client not initialized");u.log(`GitOperations.validateRepository - Validating ${e.owner}/${e.name}`),u.inspectObject("validateRepository.boundClient",this.boundClient),u.traceMethodCall("boundClient","getRepository",this.boundClient),u.traceMethodCall("boundClient","testConnection",this.boundClient),c.githubDebug(`\u{1F50D} Validating repository: ${e.owner}/${e.name}`),c.githubDebug("\u{1F527} validateRepository - Using bound client: "+typeof this.boundClient),c.githubDebug("\u{1F527} validateRepository - Bound client methods:"),c.githubDebug("  - getRepository: "+typeof this.boundClient.getRepository),c.githubDebug("  - testConnection: "+typeof this.boundClient.testConnection);let r=this.boundClient;u.log("GitOperations.validateRepository - About to call getRepository"),c.githubDebug("\u{1F527} About to call boundClient.getRepository...");let i;try{i=await r.getRepository(e.owner,e.name),u.log("GitOperations.validateRepository - getRepository SUCCESS",{name:i.name}),c.githubDebug("\u2705 getRepository successful: "+i.name)}catch(l){throw u.log("GitOperations.validateRepository - getRepository FAILED",l),console.error("\u274C getRepository failed:",l),console.error("\u274C getRepository error type:",typeof l),l}u.log("GitOperations.validateRepository - About to call testConnection"),c.githubDebug("\u{1F527} About to call boundClient.testConnection...");let n;try{n=await r.testConnection({owner:e.owner,name:e.name}),u.log("GitOperations.validateRepository - testConnection SUCCESS",{success:n.success,canWrite:(t=n.permissions)==null?void 0:t.canWrite}),c.githubDebug("\u2705 testConnection successful: "+n.success)}catch(l){throw u.log("GitOperations.validateRepository - testConnection FAILED",l),console.error("\u274C testConnection failed:",l),console.error("\u274C testConnection error type:",typeof l),l}let s={isValid:n.success,exists:!0,hasAccess:n.success,canWrite:((o=n.permissions)==null?void 0:o.canWrite)||!1,defaultBranch:i.default_branch||"main",repository:i};return s.canWrite||(s.error="Insufficient permissions to write to repository",s.isValid=!1),u.log("GitOperations.validateRepository - Completed",{isValid:s.isValid,canWrite:s.canWrite}),c.githubDebug(`\u2705 Repository validation: ${s.isValid?"PASSED":"FAILED"}`),s}catch(r){return u.log("\u274C GitOperations.validateRepository - FAILED with error",r),console.error("\u274C Repository validation failed:",r),{isValid:!1,exists:r.status!==404,hasAccess:!1,canWrite:!1,defaultBranch:"main",error:this.parseGitError(r)}}}async testRepositoryConnection(e){try{if(!this.boundClient)throw new Error("GitHub bound client not initialized");return await this.boundClient.testConnection({owner:e.owner,name:e.name})}catch(t){return{success:!1,error:t instanceof Error?t.message:"Connection test failed",permissions:{canRead:!1,canWrite:!1,canAdmin:!1}}}}async pushTokenFile(e,t,o){var r;try{if(c.githubDebug("\u{1F680} Starting pushTokenFile..."),c.githubDebug("\u{1F4C1} Repository: "+JSON.stringify(e)),c.githubDebug("\u{1F4C4} File config: "+JSON.stringify({path:t.path,messageLength:(r=t.message)==null?void 0:r.length})),!this.isReady())throw new Error("GitOperations not ready - please call initialize() first");if(!this.boundClient)throw new Error("GitHub bound client not initialized");let{MethodValidator:i}=await Promise.resolve().then(()=>(ze(),_e)),n=["fileExists","createFile","updateFile","getFile"],s=i.validateMethods(this.boundClient,n,"boundClient");if(!s.isValid)throw new Error(`BoundClient validation failed: Missing: [${s.missingMethods.join(", ")}], Invalid: [${s.invalidMethods.join(", ")}]. Available properties: [${s.debugInfo.availableProperties.slice(0,10).join(", ")}...]`);c.githubDebug("\u{1F527} pushTokenFile - Using bound client: "+typeof this.boundClient),c.githubDebug("\u{1F527} pushTokenFile - Bound client methods available:"),c.githubDebug("  - fileExists: "+typeof this.boundClient.fileExists),c.githubDebug("  - createFile: "+typeof this.boundClient.createFile),c.githubDebug("  - updateFile: "+typeof this.boundClient.updateFile),c.githubDebug("  - getFile: "+typeof this.boundClient.getFile),c.githubDebug("\u2705 GitHub client is initialized");let{owner:l,name:d,branch:g="main"}=e,{path:m,content:f,message:v}=t;o==null||o("validation","Validating repository access...",10),c.githubDebug("\u{1F50D} Validating repository...");let T=await this.validateRepository(e);if(!T.isValid)throw new Error(T.error||"Repository validation failed");c.githubDebug("\u2705 Repository validation passed"),o==null||o("preparation","Preparing file content...",30),c.githubDebug("\u{1F4DD} Preparing file content...");let I=JSON.stringify(f,null,2);c.githubDebug("\u{1F527} Encoding content to base64...");let F;try{F=Buffer.from(I,"utf8").toString("base64"),c.githubDebug("\u2705 Used Buffer for base64 encoding")}catch(E){c.githubDebug("\u26A0\uFE0F Buffer not available, trying btoa...");try{F=btoa(I),c.githubDebug("\u2705 Used btoa for base64 encoding")}catch(Ie){c.githubDebug("\u26A0\uFE0F btoa not available, using custom base64 encoder..."),F=this.customBase64Encode(I),c.githubDebug("\u2705 Used custom base64 encoding")}}c.githubDebug("\u{1F527} Calculating file size...");let U;try{U=new TextEncoder().encode(I).length,c.githubDebug("\u2705 Used TextEncoder for file size calculation")}catch(E){c.githubDebug("\u26A0\uFE0F TextEncoder not available, using UTF-8 byte counting..."),U=this.getUTF8ByteLength(I),c.githubDebug("\u2705 Used custom UTF-8 byte counting")}c.githubDebug(`\u{1F4CA} File size: ${U} bytes, encoded length: ${F.length}`);let J=v||this.generateCommitMessage(f);c.githubDebug("\u{1F4AC} Commit message generated: "+J.substring(0,100)+"..."),o==null||o("checking","Checking if file exists...",50),u.log("GitOperations.pushTokenFile - About to check file existence"),c.githubDebug("\u{1F50D} Checking if file exists..."),c.githubDebug("\u{1F527} About to call boundClient.fileExists");let G;try{if(u.traceMethodCall("boundClient","fileExists",this.boundClient),u.log("GitOperations.pushTokenFile - Executing fileExists",{owner:l,name:d,path:m}),c.githubDebug("\u{1F527} About to execute boundClient.fileExists with parameters: "+JSON.stringify({owner:l,name:d,path:m})),typeof this.boundClient.fileExists!="function")throw new Error(`fileExists is not a function at call time (type: ${typeof this.boundClient.fileExists})`);G=await this.boundClient.fileExists(l,d,m),u.log("GitOperations.pushTokenFile - fileExists SUCCESS",{result:G}),c.githubDebug(`\u{1F4C1} File exists: ${G}`)}catch(E){throw u.log("\u274C GitOperations.pushTokenFile - fileExists FAILED",E),console.error("\u274C Error checking file existence:",E),console.error("\u274C Error type:",typeof E),console.error("\u274C Error message:",E instanceof Error?E.message:String(E)),new Error(`Failed to check file existence: ${E}`)}o==null||o("pushing",G?"Updating file...":"Creating file...",70);let A;if(G){c.githubDebug("\u{1F504} Updating existing file..."),c.githubDebug("\u{1F527} About to call updateExistingFile");try{A=await this.updateExistingFile(l,d,m,{message:J,content:F,branch:g}),A.operation="updated",c.githubDebug("\u2705 File update completed")}catch(E){throw console.error("\u274C Error updating file:",E),new Error(`Failed to update file: ${E}`)}}else{c.githubDebug("\u{1F4C4} Creating new file..."),c.githubDebug("\u{1F527} About to call createNewFile");try{A=await this.createNewFile(l,d,m,{message:J,content:F,branch:g}),A.operation="created",c.githubDebug("\u2705 File creation completed")}catch(E){throw console.error("\u274C Error creating file:",E),new Error(`Failed to create file: ${E}`)}}return A.filePath=m,A.fileSize=U,o==null||o("complete","File pushed successfully!",100),c.githubDebug(`\u2705 File ${A.operation}: ${m} (${U} bytes)`),A}catch(i){console.error("\u274C Push failed in pushTokenFile:",i),console.error("\u274C Error type:",typeof i),console.error("\u274C Error stack:",i instanceof Error?i.stack:"No stack trace");let n=this.parseGitError(i);return o==null||o("error",`Push failed: ${n}`,0),{success:!1,operation:"failed",filePath:t.path,error:n}}}async createNewFile(e,t,o,r){try{if(u.log("GitOperations.createNewFile - Starting",{owner:e,repo:t,path:o}),c.githubDebug("\u{1F527} createNewFile - Starting..."),c.githubDebug("\u{1F527} createNewFile - Parameters: "+JSON.stringify({owner:e,repo:t,path:o})),c.githubDebug("\u{1F527} createNewFile - Request keys: "+Object.keys(r).join(", ")),!this.boundClient)throw u.log("\u274C GitOperations.createNewFile - Bound client is null"),new Error("GitHub bound client is null in createNewFile");if(u.inspectObject("createNewFile.boundClient",this.boundClient),u.traceMethodCall("boundClient","createFile",this.boundClient),c.githubDebug("\u{1F527} createNewFile - Using bound client: "+typeof this.boundClient),c.githubDebug("\u{1F527} createNewFile - boundClient.createFile: "+typeof this.boundClient.createFile),u.log("GitOperations.createNewFile - About to call boundClient.createFile"),c.githubDebug("\u{1F680} Calling boundClient.createFile..."),typeof this.boundClient.createFile!="function")throw new Error(`createFile is not a function at call time (type: ${typeof this.boundClient.createFile})`);let i;try{i=await this.boundClient.createFile(e,t,o,r),u.log("GitOperations.createNewFile - createFile SUCCESS",{responseType:typeof i}),c.githubDebug("\u2705 createFile response received: "+typeof i)}catch(s){throw u.log("\u274C GitOperations.createNewFile - createFile FAILED",s),console.error("\u274C Error during createFile call:",s),console.error("\u274C Error type:",typeof s),console.error("\u274C Error message:",s instanceof Error?s.message:String(s)),console.error("\u274C Error stack:",s instanceof Error?s.stack:"No stack trace"),s}let n={success:!0,operation:"created",filePath:o,commitSha:i.commit.sha,commitUrl:`https://github.com/${e}/${t}/commit/${i.commit.sha}`};return u.log("GitOperations.createNewFile - Completed successfully",{filePath:o,commitSha:i.commit.sha}),n}catch(i){throw u.log("\u274C GitOperations.createNewFile - FAILED with error",i),console.error("\u274C createNewFile failed:",i),console.error("\u274C Error in createNewFile - type:",typeof i),console.error("\u274C Error in createNewFile - stack:",i instanceof Error?i.stack:"No stack"),new Error(`Failed to create file: ${this.parseGitError(i)}`)}}async updateExistingFile(e,t,o,r){try{if(u.log("GitOperations.updateExistingFile - Starting",{owner:e,repo:t,path:o}),c.githubDebug("\u{1F527} updateExistingFile - Starting..."),c.githubDebug("\u{1F527} updateExistingFile - Parameters: "+JSON.stringify({owner:e,repo:t,path:o})),!this.boundClient)throw u.log("\u274C GitOperations.updateExistingFile - Bound client is null"),new Error("GitHub bound client is null in updateExistingFile");if(u.inspectObject("updateExistingFile.boundClient",this.boundClient),u.traceMethodCall("boundClient","getFile",this.boundClient),u.traceMethodCall("boundClient","updateFile",this.boundClient),c.githubDebug("\u{1F527} updateExistingFile - Using bound client: "+typeof this.boundClient),c.githubDebug("\u{1F527} updateExistingFile - boundClient.getFile: "+typeof this.boundClient.getFile),c.githubDebug("\u{1F527} updateExistingFile - boundClient.updateFile: "+typeof this.boundClient.updateFile),u.log("GitOperations.updateExistingFile - About to call getFile for SHA"),c.githubDebug("\u{1F50D} Getting existing file for SHA..."),typeof this.boundClient.getFile!="function")throw new Error(`getFile is not a function at call time (type: ${typeof this.boundClient.getFile})`);let i=await this.boundClient.getFile(e,t,o);u.log("GitOperations.updateExistingFile - getFile SUCCESS",{sha:i.sha}),c.githubDebug("\u2705 Existing file retrieved, SHA: "+i.sha);let n=k(y({},r),{sha:i.sha});if(u.log("GitOperations.updateExistingFile - About to call updateFile"),c.githubDebug("\u{1F680} Calling boundClient.updateFile..."),typeof this.boundClient.updateFile!="function")throw new Error(`updateFile is not a function at call time (type: ${typeof this.boundClient.updateFile})`);let s;try{s=await this.boundClient.updateFile(e,t,o,n),u.log("GitOperations.updateExistingFile - updateFile SUCCESS",{responseType:typeof s}),c.githubDebug("\u2705 updateFile response received: "+typeof s)}catch(d){throw u.log("\u274C GitOperations.updateExistingFile - updateFile FAILED",d),console.error("\u274C Error during updateFile call:",d),console.error("\u274C Error type:",typeof d),console.error("\u274C Error message:",d instanceof Error?d.message:String(d)),console.error("\u274C Error stack:",d instanceof Error?d.stack:"No stack trace"),d}let l={success:!0,operation:"updated",filePath:o,commitSha:s.commit.sha,commitUrl:`https://github.com/${e}/${t}/commit/${s.commit.sha}`};return u.log("GitOperations.updateExistingFile - Completed successfully",{filePath:o,commitSha:s.commit.sha}),l}catch(i){throw u.log("\u274C GitOperations.updateExistingFile - FAILED with error",i),console.error("\u274C updateExistingFile failed:",i),console.error("\u274C Error in updateExistingFile - type:",typeof i),console.error("\u274C Error in updateExistingFile - stack:",i instanceof Error?i.stack:"No stack"),new Error(`Failed to update file: ${this.parseGitError(i)}`)}}async createBranch(e,t){try{if(u.log("GitOperations.createBranch - Starting",{repository:e,branchName:t}),!this.boundClient)throw new Error("GitHub bound client not initialized");let{owner:o,name:r,branch:i="main"}=e;c.githubDebug(`\u{1F33F} Getting SHA for base branch: ${i}`);let s=(await this.getRef(o,r,`heads/${i}`)).object.sha;return c.githubDebug(`\u2705 Base branch SHA: ${s}`),c.githubDebug(`\u{1F33F} Creating new branch: ${t}`),await this.createRef(o,r,`refs/heads/${t}`,s),c.githubDebug(`\u2705 Branch ${t} created successfully`),u.log("GitOperations.createBranch - Success"),{success:!0}}catch(o){u.log("\u274C GitOperations.createBranch - Failed",o);let r=this.parseGitError(o);return r.includes("Reference already exists")?(c.githubDebug(`\u2139\uFE0F Branch ${t} already exists, which is fine for our use case`),{success:!0}):(console.error("\u274C Failed to create branch:",o),{success:!1,error:r})}}async pushToBranch(e,t,o,r){try{c.githubDebug(`\u{1F680} Pushing to branch: ${t}`);let i=k(y({},e),{branch:t});return await this.pushTokenFile(i,o,r)}catch(i){return console.error("\u274C Failed to push to branch:",i),{success:!1,operation:"failed",filePath:o.path,error:this.parseGitError(i)}}}async getRef(e,t,o){var s,l;if(!this.boundClient)throw new Error("GitHub bound client not initialized");let r=(l=(s=this.auth.getState().config)==null?void 0:s.credentials)==null?void 0:l.token;if(!r)throw new Error("GitHub token not available");let i=`https://api.github.com/repos/${e}/${t}/git/refs/${o}`,n=await fetch(i,{headers:{Authorization:`Bearer ${r}`,Accept:"application/vnd.github.v3+json"}});if(!n.ok){let d=new Error(`Failed to get ref ${o}: ${n.statusText}`);throw d.status=n.status,d.statusText=n.statusText,d}return await n.json()}async createRef(e,t,o,r){var l,d;if(!this.boundClient)throw new Error("GitHub bound client not initialized");let i=(d=(l=this.auth.getState().config)==null?void 0:l.credentials)==null?void 0:d.token;if(!i)throw new Error("GitHub token not available");let n=`https://api.github.com/repos/${e}/${t}/git/refs`,s=await fetch(n,{method:"POST",headers:{Authorization:`Bearer ${i}`,Accept:"application/vnd.github.v3+json","Content-Type":"application/json"},body:JSON.stringify({ref:o,sha:r})});if(!s.ok){let g=await s.text(),m=new Error(`Failed to create ref ${o}: ${s.statusText} - ${g}`);throw m.status=s.status,m.statusText=s.statusText,m.responseBody=g,m}return await s.json()}async listBranches(e){var n,s;if(!this.boundClient)throw new Error("GitHub bound client not initialized");let t=(s=(n=this.auth.getState().config)==null?void 0:n.credentials)==null?void 0:s.token;if(!t)throw new Error("GitHub token not available");let o=`https://api.github.com/repos/${e.owner}/${e.name}/branches`,r=await fetch(o,{headers:{Authorization:`Bearer ${t}`,Accept:"application/vnd.github.v3+json"}});if(!r.ok){let l=new Error(`Failed to list branches: ${r.statusText}`);throw l.status=r.status,l.statusText=r.statusText,l}return(await r.json()).map(l=>l.name)}generateCommitMessage(e){var t;try{let o=new Date().toISOString().split("T")[0],r=e.metadata||{},i=((t=r.sourceDocument)==null?void 0:t.name)||r.documentName||"Figma",n=0,s=0;e.designTokens&&(n=Array.isArray(e.designTokens)?e.designTokens.length:0),e.variables&&(s=Array.isArray(e.variables)?e.variables.length:0);let l=`feat: update design tokens from ${i}`;if(n>0||s>0){let d=[];n>0&&d.push(`${n} tokens`),s>0&&d.push(`${s} variables`),l+=`

- ${d.join(", ")}`}return l+=`
- Exported: ${o}`,r.extraction&&(l+=`
- Processed: ${r.extraction.processedNodes||0} nodes`),l}catch(o){return`feat: update design tokens - ${new Date().toISOString().split("T")[0]}`}}parseGitError(e){if(typeof e=="string")return e;if(e instanceof Error){let t=e.message.toLowerCase();return t.includes("network")||t.includes("fetch")?"Network connection failed. Please check your internet connection.":t.includes("401")||t.includes("unauthorized")?"Authentication failed. Please check your GitHub token.":t.includes("403")||t.includes("forbidden")?"Access denied. Please check repository permissions.":t.includes("404")||t.includes("not found")?"Repository not found or you don't have access to it.":t.includes("409")||t.includes("conflict")?"File conflict detected. The file may have been modified by someone else.":t.includes("rate limit")?"GitHub API rate limit exceeded. Please try again later.":t.includes("large")||t.includes("size")?"File is too large for GitHub. Consider reducing token data size.":e.message}return"An unknown error occurred during Git operation."}static generateFileName(e="figma-tokens",t="json"){return`${e}.${t}`}static formatFileSize(e){if(e===0)return"0 B";let t=1024,o=["B","KB","MB"],r=Math.floor(Math.log(e)/Math.log(t));return parseFloat((e/Math.pow(t,r)).toFixed(1))+" "+o[r]}customBase64Encode(e){c.githubDebug("\u{1F527} Using custom base64 encoder for Figma plugin environment");let t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",o="",r=0;for(;r<e.length;){let n=e.charCodeAt(r++),s=r<e.length?e.charCodeAt(r++):0,l=r<e.length?e.charCodeAt(r++):0,d=n<<16|s<<8|l;o+=t.charAt(d>>18&63)+t.charAt(d>>12&63)+t.charAt(d>>6&63)+t.charAt(d&63)}let i=e.length%3;return i===1?o=o.slice(0,-2)+"==":i===2&&(o=o.slice(0,-1)+"="),o}getUTF8ByteLength(e){c.githubDebug("\u{1F527} Calculating UTF-8 byte length using custom implementation");let t=0;for(let o=0;o<e.length;o++){let r=e.charCodeAt(o);r<128?t+=1:r<2048?t+=2:(r&64512)===55296?(t+=4,o++):t+=3}return t}isReady(){c.githubDebug("\u{1F41B} DEBUG: GitOperations.isReady() - Checking readiness...");let e=this.auth.hasClient();if(c.githubDebug("\u{1F41B} DEBUG: Auth hasClient: "+e),e&&!this.boundClient){c.githubDebug("\u{1F41B} DEBUG: Auth has client but bound client is null, refreshing...");try{this.client=this.auth.getClient(),this.boundClient=this.auth.createBoundClient(),c.githubDebug("\u{1F41B} DEBUG: Successfully refreshed client and bound client")}catch(o){return console.error("\u{1F41B} DEBUG: Failed to refresh client:",o),!1}}let t=this.boundClient!==null&&e;return c.githubDebug("\u{1F41B} DEBUG: GitOperations.isReady() result: "+t),t}getCurrentRepository(){c.githubDebug("\u{1F41B} DEBUG: GitOperations.getCurrentRepository() - Called");let e=this.auth.getPublicConfig();if(c.githubDebug("\u{1F41B} DEBUG: getPublicConfig() returned: "+JSON.stringify({hasConfig:!!e,hasRepository:!!(e!=null&&e.repository),repository:e!=null&&e.repository?`${e.repository.owner}/${e.repository.name}`:"null"})),!(e!=null&&e.repository))return c.githubDebug("\u{1F41B} DEBUG: getCurrentRepository() - No repository config found, returning null"),null;let t={owner:e.repository.owner,name:e.repository.name,branch:e.repository.branch||"main"};return c.githubDebug("\u{1F41B} DEBUG: getCurrentRepository() - Returning: "+JSON.stringify(t)),t}}});var he,Ve=w(()=>{"use strict";ke();te();ee();xe();ie();he=class{constructor(){h(this,"gitOps");h(this,"auth");this.gitOps=new M,this.auth=N.getInstance()}async initialize(){await this.gitOps.initialize()}async pushTokensToGitHub(e,t,o){var i;u.log("TokenPushService.pushTokensToGitHub - Starting",{configRepo:`${t.repository.owner}/${t.repository.name}`,targetPath:t.targetPath,hasTokenData:!!e}),console.log("\u{1F527} TokenPushService.pushTokensToGitHub - Starting..."),console.log("\u{1F527} Config received:",JSON.stringify(t,null,2)),console.log("\u{1F527} GitOps instance:",typeof this.gitOps),console.log("\u{1F527} GitOps.isReady():",this.gitOps.isReady());let r=Date.now();try{if(o==null||o.showProgress("init","Initializing Git operations...",5),u.log("TokenPushService.pushTokensToGitHub - Checking GitOps readiness"),!this.gitOps.isReady())throw u.log("\u274C TokenPushService.pushTokensToGitHub - GitOps not ready"),new Error("GitHub client not configured. Please setup GitHub integration first.");u.log("\u2705 TokenPushService.pushTokensToGitHub - GitOps is ready"),o==null||o.showProgress("validate","Validating repository access...",15),u.log("TokenPushService.pushTokensToGitHub - About to validate repository",t.repository),console.log("\u{1F527} About to validate repository:",t.repository),console.log("\u{1F527} GitOps.validateRepository type:",typeof this.gitOps.validateRepository);let n;try{if(n=await this.gitOps.validateRepository(t.repository),u.log("TokenPushService.pushTokensToGitHub - Repository validation SUCCESS",{isValid:n.isValid,canWrite:n.canWrite}),console.log("\u{1F527} Repository validation result:",n),!n.isValid)throw new Error(n.error||"Repository validation failed")}catch(f){throw u.log("\u274C TokenPushService.pushTokensToGitHub - Repository validation FAILED",f),console.error("\u274C Repository validation error:",f),console.error("\u274C Validation error type:",typeof f),f}o==null||o.showProgress("prepare","Preparing token data...",30),u.log("TokenPushService.pushTokensToGitHub - Preparing file configuration"),console.log("\u{1F527} Preparing file configuration...");let s=this.prepareFileConfig(e,t);u.log("TokenPushService.pushTokensToGitHub - File config prepared",{path:s.path,contentSize:JSON.stringify(s.content).length}),console.log("\u{1F527} File config prepared:",{path:s.path,hasContent:!!s.content,contentSize:JSON.stringify(s.content).length,message:((i=s.message)==null?void 0:i.substring(0,100))+"..."}),o==null||o.showProgress("push","Pushing tokens to GitHub...",50);let l=(f,v,T)=>{let I=50+(T||0)*.4;o==null||o.showProgress(f,v,I)};u.log("TokenPushService.pushTokensToGitHub - About to call gitOps.pushTokenFile",{repository:`${t.repository.owner}/${t.repository.name}`,filePath:s.path,gitOpsType:typeof this.gitOps,pushTokenFileType:typeof this.gitOps.pushTokenFile}),console.log("\u{1F527} About to call gitOps.pushTokenFile..."),console.log("\u{1F527} Repository:",t.repository),console.log("\u{1F527} File config path:",s.path),console.log("\u{1F527} GitOps.pushTokenFile type:",typeof this.gitOps.pushTokenFile);let d;try{if(d=await this.gitOps.pushTokenFile(t.repository,s,l),u.log("TokenPushService.pushTokensToGitHub - pushTokenFile SUCCESS",{success:d.success,operation:d.operation,filePath:d.filePath}),console.log("\u{1F527} pushTokenFile result:",d),!d.success)throw new Error(d.error||"Failed to push tokens")}catch(f){throw u.log("\u274C TokenPushService.pushTokensToGitHub - pushTokenFile FAILED",f),console.error("\u274C pushTokenFile error:",f),console.error("\u274C Push error type:",typeof f),console.error("\u274C Push error stack:",f instanceof Error?f.stack:"No stack trace"),f}u.log("TokenPushService.pushTokensToGitHub - Completed successfully",{duration:Date.now()-r,operation:d.operation}),o==null||o.showProgress("complete","Tokens pushed successfully!",100);let g=Date.now()-r,m={success:!0,pushResult:d,validation:n,duration:g,fileInfo:{path:d.filePath,size:M.formatFileSize(d.fileSize||0),url:d.commitUrl}};return this.showSuccessFeedback(m,o),m}catch(n){let s=Date.now()-r,l=n instanceof Error?n.message:"Unknown error occurred";return u.log("\u274C TokenPushService.pushTokensToGitHub - FAILED with error",{error:l,duration:s,errorType:typeof n,stack:n instanceof Error?n.stack:"No stack trace"}),o==null||o.showError("Push failed",l),{success:!1,error:l,duration:s}}}async quickPush(e,t){console.log("\u{1F527} TokenPushService.quickPush - Starting..."),console.log("\u{1F527} TokenData summary:",{tokens:e.tokens.length,variables:e.variables.length,collections:e.collections.length,documentName:e.metadata.documentName});try{let o;if(Q()){console.log("\u{1F680} Using hard-coded configuration for quick push...");let i=ge();o={repository:{owner:i.repository.owner,name:i.repository.name,branch:i.repository.branch||"main"},targetPath:"tokens/raw/",filename:Me().split("/").pop(),commitMessage:`feat: update design tokens from Figma

- ${e.tokens.length} design tokens
- ${e.variables.length} variables
- ${e.collections.length} collections
- Exported: ${new Date().toISOString().split("T")[0]}
- Source: ${e.metadata.documentName}

\u{1F916} Generated with Token Launch`},console.log(`\u{1F4C1} Target: ${o.repository.owner}/${o.repository.name}`),console.log(`\u{1F4C2} Path: ${o.targetPath}${o.filename}`),console.log("\u{1F527} Hard-coded config created:",JSON.stringify(o,null,2))}else{console.log("\u{1F41B} DEBUG: TokenPushService.quickPush - Getting repository from GitOps...");let i=this.gitOps.getCurrentRepository();if(console.log("\u{1F41B} DEBUG: GitOps.getCurrentRepository() returned:",i),!i){console.error("\u{1F41B} DEBUG: TokenPushService.quickPush - No repository configured!");let n=this.auth.getState();throw console.error("\u{1F41B} DEBUG: Auth state when repository is null:",{isConfigured:n.isConfigured,isConnected:n.isConnected,hasConfig:!!n.config,hasClient:this.auth.hasClient()}),new Error("No repository configured. Please setup GitHub integration first.")}console.log("\u{1F41B} DEBUG: Creating config with repository:",i),o={repository:i}}console.log("\u{1F527} About to call pushTokensToGitHub with config:",o),console.log("\u{1F527} TokenPushService - this.pushTokensToGitHub type:",typeof this.pushTokensToGitHub);let r=await this.pushTokensToGitHub(e,o,t);return console.log("\u{1F527} pushTokensToGitHub result:",r.success?"SUCCESS":"FAILED"),r}catch(o){console.error("\u274C Error in TokenPushService.quickPush:",o),console.error("\u274C Error type:",typeof o),console.error("\u274C Error stack:",o instanceof Error?o.stack:"No stack trace");let r=o instanceof Error?o.message:"Quick push failed";return t==null||t.showError("Quick push failed",r),{success:!1,error:r,duration:0}}}prepareFileConfig(e,t){console.log("\u{1F527} prepareFileConfig - Input config:",t),console.log("\u{1F527} prepareFileConfig - TokenData metadata:",e.metadata);let o=t.filename||M.generateFileName("figma-tokens","json"),r=t.targetPath||"tokens/raw/",i=r.endsWith("/")?`${r}${o}`:`${r}/${o}`;console.log("\u{1F527} Creating structured token data...");let n=this.createStructuredTokenData(e);console.log("\u{1F527} Structured data created, size:",JSON.stringify(n).length,"bytes");let s={path:i,content:n,message:t.commitMessage};return console.log("\u{1F527} prepareFileConfig - Result:",{path:s.path,hasContent:!!s.content,hasMessage:!!s.message}),s}createStructuredTokenData(e){let t=new O,o={metadata:{sourceDocument:{name:e.metadata.documentName},tokenCounts:{totalTokens:e.tokens.length,totalVariables:e.variables.length}},variables:e.variables,collections:e.collections,designTokens:e.tokens};return t.transform(o)}showSuccessFeedback(e,t){var s;if(!t||!e.pushResult)return;let{pushResult:o,fileInfo:r,duration:i}=e,n=o.operation==="created"?"Created":"Updated";t.showSuccess(`\u{1F389} Tokens ${o.operation} successfully!`,{file:r==null?void 0:r.path,size:r==null?void 0:r.size,duration:i?`${i}ms`:void 0,commit:(s=o.commitSha)==null?void 0:s.substring(0,8)}),t.showNotification(`${n} ${r==null?void 0:r.path} (${r==null?void 0:r.size})`,{timeout:4e3})}async testConnection(e){try{let t=e||this.gitOps.getCurrentRepository();if(!t)throw new Error("No repository configured");let o=await this.gitOps.validateRepository(t);return{success:o.isValid,message:o.isValid?`\u2705 Connected to ${t.owner}/${t.name}`:`\u274C ${o.error}`,canPush:o.canWrite,error:o.error}}catch(t){return{success:!1,message:"\u274C Connection failed",canPush:!1,error:t instanceof Error?t.message:"Unknown error"}}}getStatus(){let e=this.gitOps.isReady(),t=this.gitOps.getCurrentRepository();return{isReady:e,hasRepository:!!t,repositoryInfo:t?`${t.owner}/${t.name}`:void 0}}static createFigmaFeedback(){return{showProgress:(e,t,o)=>{console.log(`[${e.toUpperCase()}] ${t} ${o?`(${o}%)`:""}`),["validate","push","complete","error"].includes(e)&&figma.notify(t,{timeout:e==="complete"?3e3:1500,error:e==="error"})},showSuccess:(e,t)=>{console.log("\u2705 SUCCESS:",e,t),figma.notify(e,{timeout:4e3})},showError:(e,t)=>{console.error("\u274C ERROR:",e,t),figma.notify(`${e}${t?`: ${t}`:""}`,{error:!0,timeout:6e3})},showNotification:(e,t)=>{figma.notify(e,{timeout:(t==null?void 0:t.timeout)||3e3,error:(t==null?void 0:t.error)||!1})}}}}});var q,We=w(()=>{"use strict";X();le();ce();Ee();q=class{constructor(e){h(this,"options");h(this,"prDetails",{});this.options=e,this.initializePRDetails()}async show(){await this.showUnifiedModal(),this.setupMessageHandling()}showSuccess(e){this.showSuccessModal(e)}initializePRDetails(){let e=new Date().toISOString().replace(/:/g,"-").replace(/\..+/,"").replace("T","-"),t=Ce(this.options.tokenData,this.options.documentInfo);this.prDetails={action:"create-pr",branchName:`tokens/update-${e}`,commitMessage:t,prTitle:`Update design tokens - ${new Date().toLocaleDateString()}`,prBody:this.generatePRBody(),isNewBranch:!0}}generatePRBody(){let{tokenData:e}=this.options,t=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});return`## Design Token Update

**Exported from Figma**: ${e.metadata.documentName||"Figma Document"}
**Date**: ${t}

### File Changes
- \`tokens/raw/figma-tokens.json\`

### Review Checklist
- [ ] Token values are correct
- [ ] No breaking changes to token names
- [ ] Ready to merge

---
\u{1F916} Generated by Token Launch`}async showUnifiedModal(){let{tokenData:e}=this.options,t=e.collections||[],o=this.options.defaultBranch||"main",r=await C.getWorkflowSettings()||{workflowTriggerEnabled:!1,workflowFileName:"transform-tokens.yml"},i=`
<!DOCTYPE html>
<html>
<head>
  <link href="https://unpkg.com/phosphor-icons@1.4.2/src/css/icons.css" rel="stylesheet">
  ${this.getSharedStyles()}
  <style>
    body {
      margin: 0;
      padding: 0 24px;
      overflow-y: auto;
      overflow-x: hidden;
      font-family: var(--font-family);
      background: var(--color-background-gradient) !important;
      min-height: 100vh;
    }

    .container {
      min-height: 100vh;
      height: auto;
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 16px;
      box-shadow: var(--shadow-xl);
    }

    .header {
      background: var(--color-background-gradient, linear-gradient(135deg, #DEE3FC 0%, #F7E3E3 100%));
      color: #000000;
      padding: 16px 20px;
      flex-shrink: 0;
      text-align: center;
    }

    .header h1 {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }

    .content {
      flex: 1;
      overflow: visible;
      padding: 20px 20px 10px 20px;
    }

    /* Compact Stats */
    .stats {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
    }

    .stat {
      flex: 1;
      background: #f8f9fa;
      padding: 10px;
      border-radius: 6px;
      text-align: center;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 600;
      color: #000000;
      margin-bottom: 2px;
    }

    .stat-label {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Collections - Collapsed by Default */
    .collections {
      margin-bottom: 20px;
    }

    .collections-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px;
      cursor: pointer;
      user-select: none;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .collections-toggle:hover {
      background: var(--color-background-secondary);
    }

    .toggle-icon {
      font-size: 10px;
      transition: transform 0.3s;
    }

    .toggle-icon.open {
      transform: rotate(90deg);
    }

    .toggle-text {
      font-size: 11px;
      color: #666;
    }

    .collections-list {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .collections-list.open {
      max-height: 150px;
      overflow-y: auto;
      margin-top: 8px;
    }

    .collection-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 10px;
      background: #f8f9fa;
      border-radius: 4px;
      margin-bottom: 4px;
      font-size: 11px;
    }

    .collection-count {
      background: #000000;
      color: white;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
    }

    /* Action Tabs */
    .section {
      margin-bottom: 18px;
    }

    .section-title {
      font-size: 13px;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
    }



    .branch-tag {
      display: inline-block;
      background: #28a745;
      color: white;
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 3px;
      margin-left: 8px;
      position: relative;
      top: -2px;
    }

    .form-textarea {
      resize: vertical;
      min-height: 70px;
      max-height: 200px; /* Prevent textarea from becoming too large */
      width: 100%;
      box-sizing: border-box;
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 14px;
      line-height: 20px;
      font-family: inherit;
      transition: border-color 150ms ease;
    }

    .form-textarea:focus {
      outline: none;
      border-color: var(--color-primary-light);
    }

    .form-row {
      display: flex;
      gap: 10px;
    }

    .form-row .form-group {
      flex: 1;
      position: relative;
    }

    /* PR Fields - Hidden by default for push-to-branch */
    .pr-only {
      display: none;
    }

    .pr-only.visible {
      display: block;
    }

    /* Sticky footer layout */
    .main-content {
      padding-bottom: 160px; /* Increased space for sticky footer + expanded textarea */
    }

    .sticky-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      border-top: 1px solid var(--color-border);
      padding: 16px 20px;
      z-index: 1000;
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
    }

    /* Actions */
    .actions {
      display: flex;
      justify-content: center;
      gap: 10px;
      padding: 0; /* Remove padding since it's now in sticky footer */
      background: transparent;
      border-top: 1px solid #e9ecef;
      flex-shrink: 0;
    }

    .btn {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel {
      background: #1A1C1E;
      color: white;
    }

    .btn-cancel:hover {
      background: #404347;
      color: white;
    }

    .btn-cancel:focus {
      outline: 2px solid #1A1C1E;
      outline-offset: 2px;
    }

    .btn-submit {
      background: #DEE3FC;
      color: var(--color-text-primary);
      font-weight: 600;
    }

    .btn-submit:hover {
      background: #7C2D92;
      color: white;
    }

    .btn-submit:focus {
      outline: 2px solid var(--color-primary-light);
      outline-offset: 2px;
    }

    /* CI/CD Tooltip Styles */

    /* Information icon styling */
    .learn-more {
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
      transition: transform 0.2s ease, opacity 0.2s ease;
    }

    .learn-more:hover {
      transform: scale(1.1);
    }

    .learn-more i {
      transition: all 0.2s ease;
      padding: 4px;
      border-radius: 50%;
    }

    .learn-more:hover i {
      color: white !important;
      background-color: #C084FC !important;
    }

    /* Missing styles for ds-action-tabs section */
    .ds-action-tabs {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
    }

    .ds-action-tab {
      flex: 1;
      padding: 16px;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
      background: white;
    }

    .ds-action-tab:hover {
      border-color: #DEE3FC;
      background: #f8f9fa;
    }

    .ds-action-tab.active {
      border-color: var(--color-primary);
      background: linear-gradient(135deg, rgba(222, 227, 252, 0.5) 0%, rgba(247, 227, 227, 0.5) 100%);
    }

    .ds-action-tab-title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }

    .ds-action-tab-description {
      font-size: 12px;
      color: #666;
    }

    /* Form Styling */
    .ds-form-group {
      margin-bottom: 16px;
    }

    .ds-form-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 6px;
    }

    .ds-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 14px;
      line-height: 20px;
      background: #fff;
      transition: border-color 150ms ease;
      font-family: inherit;
    }

    .ds-input:focus {
      outline: none;
      border-color: #6366f1;
    }

    .ds-input:disabled {
      background: #f9fafb;
      color: #6b7280;
      cursor: not-allowed;
    }

    select.ds-input {
      cursor: pointer;
      padding-right: 40px;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M6 9l6 6 6-6'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
    }

    /* Branch Configuration */
    .branch-config-push,
    .branch-config-pr {
      margin-top: 12px;
    }

    /* Actions Container */
    .actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      padding: 16px 20px;
      border-top: 1px solid #e5e7eb;
      margin-top: 8px;
      background: #fafbfc;
    }

    /* Vertical Branch Layout - All elements stack vertically */
    .branch-config-push .ds-form-group {
      margin-bottom: 16px;
    }

    .branch-config-push .ds-form-group:last-child {
      margin-bottom: 0;
    }

    /* Disabled Tab Styles */
    .ds-action-tab.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: auto;
      position: relative;
    }

    .ds-action-tab.disabled:hover {
      background: #f5f5f5;
      border-color: #ddd;
      transform: none;
    }

    .ds-action-tab.disabled .ds-action-tab-title,
    .ds-action-tab.disabled .ds-action-tab-description {
      color: #999;
    }

    /* Simple Tooltip for Disabled Elements */
    .ds-action-tab.disabled[data-tooltip]:hover::before {
      content: attr(data-tooltip);
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #333;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 1000;
      pointer-events: none;
    }

    .ds-action-tab.disabled[data-tooltip]:hover::after {
      content: '';
      position: absolute;
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
      border: 4px solid transparent;
      border-top-color: #333;
      z-index: 1000;
      pointer-events: none;
    }

    /* Modal Overlay Styles */
    .ds-tooltip-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: all 200ms ease;
    }

    .ds-tooltip-overlay.visible {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }

    .ds-tooltip-popup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      max-width: 400px;
      width: 90%;
      max-height: 90vh;
      height: auto;
      overflow: visible;
      z-index: 10000;
      opacity: 0;
      pointer-events: none;
      transition: all 200ms ease;
    }

    .ds-tooltip-popup.visible {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
      pointer-events: auto;
    }

    .ds-tooltip-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 20px 16px 20px;
      border-bottom: 1px solid #eee;
    }

    .ds-tooltip-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .ds-tooltip-close {
      background: none;
      border: none;
      font-size: 24px;
      color: #999;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 150ms ease;
    }

    .ds-tooltip-close:hover {
      background: #f8f9fa;
      color: #333;
    }

    .ds-tooltip-content {
      padding: 0 20px 20px 20px;
      color: #555;
      line-height: 1.5;
      overflow: visible;
      max-height: none;
    }

  </style>
</head>
<body>
  <div class="container main-content">
    <!-- Header -->
    <div class="header">
      <h1><i class="ph-rocket-launch" data-weight="duotone"></i> Push Tokens to GitHub</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Compact Stats -->
      <div class="stats">
        <div class="stat">
          <div class="stat-value">${e.tokens.length}</div>
          <div class="stat-label">Tokens</div>
        </div>
        <div class="stat">
          <div class="stat-value">${e.variables.length}</div>
          <div class="stat-label">Variables</div>
        </div>
        <div class="stat">
          <div class="stat-value">${t.length}</div>
          <div class="stat-label">Collections</div>
        </div>
      </div>

      <!-- Collections - Collapsed by Default -->
      ${t.length>0?`
        <div class="collections">
          <div class="collections-toggle" onclick="toggleCollections()">
            <span class="toggle-icon" id="toggle-icon">\u25B6</span>
            <span class="toggle-text">Collections (${t.length})</span>
          </div>
          <div class="collections-list" id="collections-list">
            ${t.map(n=>{var l;let s=((l=n.variables)==null?void 0:l.length)||0;return`<div class="collection-item">
                <span>${n.name}</span>
                <span class="collection-count">${s}</span>
              </div>`}).join("")}
          </div>
        </div>
      `:""}

      <!-- Action Selection -->
      <div class="section">
        <div class="section-title">Choose Action</div>
        <div class="ds-action-tabs">
          <div class="ds-action-tab active" id="tab-branch" onclick="selectAction('push-to-branch')">
            <div class="ds-action-tab-title">Push to Branch</div>
            <div class="ds-action-tab-description">Commit to branch</div>
          </div>
          <div class="ds-action-tab disabled" id="tab-pr" data-tooltip="Future Feature">
            <div class="ds-action-tab-title">Create Pull Request</div>
            <div class="ds-action-tab-description">Create PR with review</div>
          </div>
        </div>
      </div>

      <!-- Branch Configuration -->
      <div class="section">
        <div class="section-title">Branch</div>

        <!-- Push to Branch: Vertical Layout -->
        <div class="branch-config-push" id="branch-config-push">
          <!-- Branch Selection Dropdown -->
          <div class="ds-form-group">
            <label class="ds-form-label">Select Branch</label>
            <select class="ds-input" id="branch-select">
              ${this.options.availableBranches&&this.options.availableBranches.length>0?this.options.availableBranches.map(n=>`<option value="${n}" ${n===o?"selected":""}>${n}</option>`).join(""):`<option value="${o}">${o}</option>`}
            </select>
          </div>

          <!-- Create New Branch Section -->
          <div class="create-branch-section" style="background: #F8F9FA; padding: 8px; border-radius: 8px; margin-top: 4px;">
            <!-- Create New Branch Checkbox -->
            <div class="ds-form-group" style="margin-bottom: 0;">
              <label class="ds-checkbox-label">
                <input
                  type="checkbox"
                  class="ds-checkbox"
                  id="create-new-branch-checkbox"
                  onchange="
                    const newInput = document.getElementById('new-branch-input');
                    const branchDropdown = document.getElementById('branch-select');
                    if (this.checked) {
                      newInput.style.display = 'block';
                      branchDropdown.disabled = true;
                      branchDropdown.style.opacity = '0.5';
                      branchDropdown.style.cursor = 'not-allowed';
                      branchDropdown.style.padding = '3px 4px';
                    } else {
                      newInput.style.display = 'none';
                      branchDropdown.disabled = false;
                      branchDropdown.style.opacity = '1';
                      branchDropdown.style.cursor = 'pointer';
                      branchDropdown.style.padding = '';
                    }"
                >
                <span>Create new branch instead</span>
              </label>
            </div>

            <!-- New Branch Name Input (Hidden by Default) -->
            <div class="ds-form-group" id="new-branch-input" style="display: none;">
              <label class="ds-form-label" style="font-size: 12px;">New Branch Name</label>
              <input
                type="text"
                class="ds-input"
                id="new-branch-name"
                placeholder="feature/update-tokens"
                style="font-size: 11px; height: 32px; padding: 3px 6px;"
              >
              <div class="ds-form-help" style="font-size: 11px;">Enter a name for your new branch</div>
            </div>
          </div>
        </div>

        <!-- Create PR: Two Field Layout (Future Feature - Hidden) -->
        <div class="branch-config-pr" id="branch-config-pr" style="display: none;">
          <div class="ds-form-group">
            <label class="ds-form-label">From Branch (Your Feature Branch)</label>
            <input
              type="text"
              class="ds-input"
              id="from-branch"
              value="${this.prDetails.branchName}"
              placeholder="feature/update-tokens"
            >
            <div class="ds-form-help">The branch where your changes are</div>
          </div>
          <div class="ds-form-group" style="margin-top: 16px;">
            <label class="ds-form-label">To Branch (Base Branch)</label>
            <select class="ds-input" id="to-branch">
              ${this.options.availableBranches&&this.options.availableBranches.length>0?this.options.availableBranches.map(n=>`<option value="${n}" ${n===o?"selected":""}>${n}</option>`).join(""):`<option value="${o}">${o}</option>`}
            </select>
          </div>
        </div>
      </div>

      <!-- File Paths & Commit Settings (Optional) -->
      <div class="section">
        <details class="accordion">
          <summary class="accordion-summary">
            <span class="accordion-title">File Paths & Commit Settings (Optional)</span>
            <svg class="accordion-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </summary>
          <div class="accordion-content">
            <div class="ds-form-group">
              <label class="ds-form-label" for="token-file-location">Token File Location</label>
              <input
                type="text"
                class="ds-input"
                id="token-file-location"
                value="/tokens"
                placeholder="/tokens"
              >
              <div class="ds-form-help">Where your token files will be saved in the repository</div>
            </div>
          </div>
        </details>
      </div>

      <!-- Commit Message -->
      <div class="section">
        <div class="section-title">Commit Message</div>
        <textarea
          class="form-textarea"
          id="commit-message"
          placeholder="Update design tokens from Figma - 2024-12-30 14:23..."
        >${this.prDetails.commitMessage}</textarea>
        <div class="ds-form-help">Autogenerated commit message with latest changes, write your own if you prefer</div>
      </div>

      <!-- PR-Only Fields -->
      <div class="pr-only" id="pr-fields">
        <div class="section">
          <div class="section-title">Pull Request</div>
          <div class="ds-form-group">
            <label class="ds-form-label">PR Title</label>
            <input
              type="text"
              class="ds-form-input"
              id="pr-title"
              value="${this.prDetails.prTitle}"
              placeholder="Update design tokens"
            >
          </div>
        </div>
      </div>

      <!-- Workflow Trigger Section -->
      <div class="section" style="margin-top: 16px; display: none;">
        <div class="form-group" style="display: flex; align-items: center; gap: 8px;">
          <label class="ds-checkbox-label" style="margin: 0;">
            <input
              type="checkbox"
              class="ds-checkbox"
              id="enable-workflow-trigger"
              ${r.workflowTriggerEnabled?"checked":""}
            >
            <span>Trigger CI/CD workflow after push</span>
          </label>
          <span class="ds-info-icon" data-tooltip="Click for more info" onclick="showCICDTooltip();"><i class="ph-info" data-weight="fill"></i></span>
        </div>

        <div id="workflow-config" style="display: ${r.workflowTriggerEnabled?"block":"none"}; margin-left: 24px; margin-top: 12px;">
          <div class="ds-form-group">
            <label class="ds-form-label">Workflow file name</label>
            <input
              type="text"
              class="ds-form-input"
              id="workflow-filename"
              value="${r.workflowFileName}"
              placeholder="transform-tokens.yml"
            >
            <div class="ds-form-help">
              File must exist in <code>.github/workflows/</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Sticky Footer for Actions -->
  <div class="sticky-footer">
    <div class="actions">
      <button class="ds-btn ds-btn-secondary" onclick="handleCancel()">\u2190 Go Back</button>
      <button class="ds-btn ds-btn-primary" id="submit-btn" onclick="handleSubmit()">Push to Branch</button>
    </div>
  </div>

  <script>
    let currentAction = 'push-to-branch';
    let isNewBranch = true;  // Default, but will be updated based on initial selection

    function toggleCollections() {
      const list = document.getElementById('collections-list');
      const icon = document.getElementById('toggle-icon');
      const isOpen = list.classList.contains('open');

      if (isOpen) {
        list.classList.remove('open');
        icon.classList.remove('open');
      } else {
        list.classList.add('open');
        icon.classList.add('open');
      }
    }

    // Handle base branch selection
    document.addEventListener('DOMContentLoaded', function() {
      const baseBranchSelect = document.getElementById('base-branch');
      const branchNameInput = document.getElementById('branch-name');
      const newTag = document.getElementById('new-tag');

      baseBranchSelect.addEventListener('change', function() {
        if (this.value === '__create_new__') {
          // User wants to create a new branch
          isNewBranch = true;
          newTag.style.display = 'inline-block';
          branchNameInput.disabled = false;
          branchNameInput.value = branchNameInput.getAttribute('data-original-value') || '';
          branchNameInput.focus();
        } else {
          // User selected an existing branch - auto-fill and disable
          isNewBranch = false;
          newTag.style.display = 'none';
          branchNameInput.value = this.value;
          branchNameInput.disabled = true;
        }
      });

      // Initialize the branch name input state based on initial selection
      if (baseBranchSelect.value !== '__create_new__') {
        branchNameInput.value = baseBranchSelect.value;
        branchNameInput.disabled = true;
      }

      // Store original value for when user switches back to create new
      branchNameInput.setAttribute('data-original-value', branchNameInput.value);

      // Check if page has loaded completely

      // Handle create new branch checkbox
      const createNewBranchCheckbox = document.getElementById('create-new-branch-checkbox');
      const newBranchInput = document.getElementById('new-branch-input');


      if (createNewBranchCheckbox && newBranchInput) {
        createNewBranchCheckbox.addEventListener('change', function() {

          const branchDropdown = document.getElementById('branch-select');

          if (this.checked) {
            newBranchInput.style.display = 'block';

            // Disable and style dropdown
            if (branchDropdown) {
              branchDropdown.disabled = true;
              branchDropdown.style.opacity = '0.5';
              branchDropdown.style.cursor = 'not-allowed';
              branchDropdown.style.padding = '3px 4px';
            }

            const nameInput = document.getElementById('new-branch-name');
            if (nameInput) {
              setTimeout(() => nameInput.focus(), 100);
            }
          } else {
            newBranchInput.style.display = 'none';

            // Re-enable and style dropdown
            if (branchDropdown) {
              branchDropdown.disabled = false;
              branchDropdown.style.opacity = '1';
              branchDropdown.style.cursor = 'pointer';
              branchDropdown.style.padding = '';
            }

            const nameInput = document.getElementById('new-branch-name');
            if (nameInput) {
              nameInput.value = '';
            }
          }
        });
      } else {
        console.error('\u274C Could not find checkbox elements:', {
          createNewBranchCheckbox: !!createNewBranchCheckbox,
          newBranchInput: !!newBranchInput
        });
      }

      // Handle workflow trigger checkbox
      const workflowCheckbox = document.getElementById('enable-workflow-trigger');
      const workflowConfig = document.getElementById('workflow-config');

      workflowCheckbox.addEventListener('change', function() {
        if (this.checked) {
          workflowConfig.style.display = 'block';
        } else {
          workflowConfig.style.display = 'none';
        }
      });
    });

    function selectAction(action) {
      // Prevent selection of disabled PR option
      if (action === 'create-pr') {
        return;
      }

      currentAction = action;

      // Update tabs
      const branchTab = document.getElementById('tab-branch');
      const prTab = document.getElementById('tab-pr');
      const prFields = document.getElementById('pr-fields');
      const submitBtn = document.getElementById('submit-btn');

      branchTab.classList.remove('active');
      prTab.classList.remove('active');

      if (action === 'push-to-branch') {
        branchTab.classList.add('active');
        prFields.classList.remove('visible');
        submitBtn.textContent = 'Push to Branch';
      }
    }

    function handleCancel() {
      parent.postMessage({ pluginMessage: { type: 'pr-workflow-cancel' } }, '*');
    }

    function handleSubmit() {
      // Get branch information from new structure
      const branchSelect = document.getElementById('branch-select');
      const createNewBranchCheckbox = document.getElementById('create-new-branch-checkbox');
      let branchName, baseBranch, isNewBranch;

      if (createNewBranchCheckbox.checked) {
        // Creating new branch
        branchName = document.getElementById('new-branch-name').value.trim();
        baseBranch = 'main'; // Default base for new branches
        isNewBranch = true;
      } else {
        // Using existing branch
        branchName = branchSelect.value;
        baseBranch = branchSelect.value; // Same as branch name for direct push
        isNewBranch = false;
      }

      // Get workflow trigger config
      const workflowEnabled = document.getElementById('enable-workflow-trigger').checked;
      const workflowFileName = document.getElementById('workflow-filename').value.trim();

      const details = {
        action: currentAction,
        branchName: branchName,
        baseBranch: baseBranch,
        commitMessage: document.getElementById('commit-message').value.trim(),
        prTitle: '', // Not used for push-to-branch
        isNewBranch: isNewBranch,
        workflowTrigger: workflowEnabled ? {
          enabled: true,
          workflowFileName: workflowFileName || 'transform-tokens.yml'
        } : undefined
      };

      // Validation
      if (!details.branchName) {
        alert('Please enter a branch name');
        return;
      }

      if (!details.commitMessage) {
        alert('Please enter a commit message');
        return;
      }

      if (currentAction === 'create-pr' && !details.prTitle) {
        alert('Please enter a PR title');
        return;
      }

      if (workflowEnabled && !workflowFileName) {
        alert('Please enter a workflow file name');
        return;
      }

      parent.postMessage({
        pluginMessage: {
          type: 'pr-workflow-submit',
          details
        }
      }, '*');
    }

    // CI/CD Tooltip functions
    function showCICDTooltip() {
      const overlay = document.getElementById('cicd-tooltip-overlay');
      const tooltip = document.getElementById('cicd-tooltip');
      if (overlay && tooltip) {
        overlay.classList.add('visible');
        tooltip.classList.add('visible');
      } else {
      }
    }

    function hideCICDTooltip() {
      const overlay = document.getElementById('cicd-tooltip-overlay');
      const tooltip = document.getElementById('cicd-tooltip');
      if (overlay && tooltip) {
        overlay.classList.remove('visible');
        tooltip.classList.remove('visible');
      }
    }

    window.showCICDTooltip = showCICDTooltip;
    window.hideCICDTooltip = hideCICDTooltip;

    // Initialize isNewBranch based on the currently selected branch
    function initializeBranchState() {
      const baseBranchSelect = document.getElementById('base-branch');
      const branchNameInput = document.getElementById('branch-name');
      const newTag = document.getElementById('new-tag');

      if (baseBranchSelect && branchNameInput) {
        const selectedValue = baseBranchSelect.value;
        if (selectedValue === '__create_new__') {
          isNewBranch = true;
          newTag.style.display = 'inline-block';
          branchNameInput.disabled = false;
        } else {
          // User has selected an existing branch
          isNewBranch = false;
          newTag.style.display = 'none';
          branchNameInput.value = selectedValue;
          branchNameInput.disabled = true;
        }
      }
    }

    // Initialize when the page loads
    document.addEventListener('DOMContentLoaded', initializeBranchState);

    // Also initialize immediately in case DOM is already ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeBranchState);
    } else {
      initializeBranchState();
    }
  </script>

  <!-- CI/CD Workflow Tooltip -->
  <div class="ds-tooltip-overlay" id="cicd-tooltip-overlay" onclick="hideCICDTooltip()"></div>
  <div class="ds-tooltip-popup" id="cicd-tooltip">
    <div class="ds-tooltip-header">
      <h3 class="ds-tooltip-title">\u2699\uFE0F What does this do?</h3>
      <button class="ds-tooltip-close" onclick="hideCICDTooltip()" aria-label="Close">\xD7</button>
    </div>
    <div class="ds-tooltip-content">
      <p><strong>In simple terms:</strong></p>
      <p>After you push your design tokens to GitHub, this feature automatically tells GitHub to "run the build process."</p>

      <p style="margin-top: 12px;"><strong>What happens when enabled?</strong></p>
      <ul>
        <li>Your tokens get automatically converted into developer-friendly code</li>
        <li>Developers get notified that new tokens are ready to use</li>
        <li>Quality checks run automatically to catch any issues</li>
      </ul>

      <p style="margin-top: 12px;"><strong>When should I enable this?</strong></p>
      <p>Enable if your development team has set up automation in GitHub. Ask your developer team if you're unsure!</p>

      <p style="margin-top: 12px; padding: 12px; background: #f0f9ff; border-radius: 6px; border-left: 3px solid #0ea5e9; font-size: 12px;">
        <strong>\u{1F4A1} Not sure?</strong> You can leave this unchecked. Developers can manually process tokens later if needed.
      </p>
    </div>
  </div>
</body>
</html>`;figma.showUI(i,P("Push Tokens to GitHub"))}showSuccessModal(e){var r,i,n;let t=e.action==="create-pr",o=`
<!DOCTYPE html>
<html>
<head>
  <link href="https://unpkg.com/phosphor-icons@1.4.2/src/css/icons.css" rel="stylesheet">
  ${this.getSharedStyles()}
  <style>
    /* Body background with design system gradient */
    body {
      background: var(--color-background-gradient) !important;
      margin: 0;
      padding: 24px;
      min-height: 100vh;
      font-family: var(--font-family);
    }

    .container {
      padding: 40px 30px;
      text-align: center;
    }

    .icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .title {
      font-size: 24px;
      font-weight: 600;
      color: var(--color-text-primary);
      margin-bottom: 8px;
    }

    .subtitle {
      color: var(--color-text-secondary);
      margin-bottom: 30px;
    }

    .details {
      background: var(--color-background-secondary);
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 16px;
      text-align: left;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid var(--color-border);
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-label {
      font-weight: 500;
      color: var(--color-text-tertiary);
      font-size: 13px;
    }

    .detail-value {
      font-weight: 600;
      color: var(--color-text-primary);
      font-size: 13px;
    }

    .link-btn {
      display: block;
      background: var(--color-primary-300);
      color: var(--color-text-primary);
      text-decoration: none;
      padding: 12px 16px;
      border-radius: 8px;
      font-weight: 600;
      margin-bottom: 16px;
      transition: all 0.2s;
      text-align: center;
    }

    .link-btn:hover {
      background: var(--color-primary);
      color: white;
      transform: translateY(-1px);
    }

    .link-btn:focus {
      outline: 2px solid var(--color-primary-light);
      outline-offset: 2px;
    }

    .ds-btn-secondary {
      background: var(--color-text-primary);
      color: white;
      border: none;
    }

    .ds-btn-secondary:hover {
      background: var(--color-grey-700);
      color: white;
    }

    /* Removed custom .btn-done styles to let design system .ds-btn styles take precedence */
  </style>
</head>
<body>
  <div class="container">
    <div class="icon"><i class="ph-rocket-launch" data-weight="fill" style="color: var(--color-mint-700);"></i></div>
    <h1 class="title">${t?"Pull Request Created!":"Pushed to Branch!"}</h1>
    <p class="subtitle">${t?"Your tokens are ready for review":"Your Tokens are now ready to be consumed!"}</p>

    <div class="details">
      ${t&&e.prNumber?`
        <div class="detail-row">
          <span class="detail-label">PR Number</span>
          <span class="detail-value">#${e.prNumber}</span>
        </div>
      `:""}
      <div class="detail-row">
        <span class="detail-label">Branch</span>
        <span class="detail-value">${e.branchName}</span>
      </div>
      ${(r=e.workflowTrigger)!=null&&r.triggered?`
        <div class="detail-row">
          <span class="detail-label">Workflow</span>
          <span class="detail-value" style="color: ${e.workflowTrigger.success?"var(--color-success)":"var(--color-error)"}">
            ${e.workflowTrigger.success?'<i class="ph-check" data-weight="bold" style="color: #16a34a;"></i> Triggered':'<i class="ph-warning" data-weight="fill" style="color: #d97706;"></i> Failed'}
          </span>
        </div>
      `:""}
    </div>

    ${(i=e.workflowTrigger)!=null&&i.triggered&&!e.workflowTrigger.success?`
      <div style="background: var(--color-warning-light); border-left: 4px solid var(--color-warning); padding: 12px; margin-bottom: 16px; text-align: left; border-radius: 4px;">
        <div style="font-weight: 600; color: var(--color-warning-dark); margin-bottom: 4px;">Workflow Trigger Warning</div>
        <div style="font-size: 12px; color: var(--color-warning-dark);">${e.workflowTrigger.error||"Failed to trigger workflow"}</div>
      </div>
    `:""}

    ${e.prUrl?`
      <a href="${e.prUrl}" class="link-btn" target="_blank">
        <i class="ph-link" data-weight="bold"></i> View ${t?"Pull Request":"Branch"} on GitHub
      </a>
    `:""}

    ${(n=e.workflowTrigger)!=null&&n.success&&e.workflowTrigger.workflowUrl?`
      <a href="${e.workflowTrigger.workflowUrl}" class="link-btn" target="_blank" style="background: var(--color-info-light);">
        <i class="ph-rocket-launch" data-weight="bold"></i> View Workflow Actions
      </a>
    `:""}

    <button class="ds-btn ds-btn-secondary" onclick="handleDone()">Done</button>
  </div>

  <script>
    function handleDone() {
      parent.postMessage({ pluginMessage: { type: 'pr-workflow-done' } }, '*');
    }
  </script>
</body>
</html>`;figma.showUI(o,P("Success"))}setupMessageHandling(){figma.ui.onmessage=async e=>{switch(e.type){case"pr-workflow-cancel":this.options.onCancel();break;case"pr-workflow-submit":let t={action:e.details.action,branchName:e.details.branchName,commitMessage:e.details.commitMessage,prTitle:e.details.prTitle,prBody:this.generatePRBody(),isNewBranch:e.details.isNewBranch,workflowTrigger:e.details.workflowTrigger};e.details.workflowTrigger&&await C.storeWorkflowSettings({workflowTriggerEnabled:e.details.workflowTrigger.enabled,workflowFileName:e.details.workflowTrigger.workflowFileName}),this.options.onComplete(t);break;case"pr-workflow-done":figma.closePlugin();break}}}getSharedStyles(){return`<style>${W()}</style>`}}});var fe,qe=w(()=>{"use strict";te();ee();fe=class{constructor(){h(this,"auth");h(this,"client",null);this.auth=N.getInstance()}async initialize(){await this.auth.initialize(),this.auth.hasClient()&&(this.client=this.auth.getClient())}async createPullRequest(e,t,o="main"){try{if(u.log("PullRequestService.createPullRequest - Starting",{repository:`${e.owner}/${e.name}`,head:t.branchName,base:o}),!this.client)throw new Error("GitHub client not initialized");let r={title:t.prTitle||"Update design tokens",head:t.branchName,base:o,body:t.prBody||""};u.log("PullRequestService.createPullRequest - Creating PR",r);let i=await this.makeGitHubAPICall(e,"POST","/pulls",r);return u.log("PullRequestService.createPullRequest - PR created successfully",{number:i.number,url:i.html_url}),{success:!0,prNumber:i.number,prUrl:i.html_url}}catch(r){return u.log("\u274C PullRequestService.createPullRequest - Failed",r),console.error("\u274C Failed to create pull request:",r),{success:!1,error:this.parseError(r)}}}async branchExists(e,t){try{return await this.makeGitHubAPICall(e,"GET",`/git/refs/heads/${t}`),!0}catch(o){return!1}}async generateUniqueBranchName(e,t){let o=t,r=2;for(;await this.branchExists(e,o);)o=`${t}-${r}`,r++;return o}async makeGitHubAPICall(e,t,o,r){var m,f;if(!this.client)throw new Error("GitHub client not initialized");let i=(f=(m=this.auth.getState().config)==null?void 0:m.credentials)==null?void 0:f.token;if(!i)throw new Error("GitHub token not available");let n=`https://api.github.com/repos/${e.owner}/${e.name}${o}`;u.log(`PullRequestService.makeGitHubAPICall - ${t} ${o}`,{url:n,hasBody:!!r});let s={Authorization:`Bearer ${i}`,Accept:"application/vnd.github.v3+json","Content-Type":"application/json"},l={method:t,headers:s};r&&(l.body=JSON.stringify(r));let d=await fetch(n,l);if(!d.ok){let v=await d.text();throw u.log(`\u274C PullRequestService.makeGitHubAPICall - HTTP ${d.status}`,{status:d.status,statusText:d.statusText,error:v}),new Error(`GitHub API error: ${d.status} ${d.statusText} - ${v}`)}let g=await d.json();return u.log("\u2705 PullRequestService.makeGitHubAPICall - Success",{status:d.status}),g}parseError(e){if(typeof e=="string")return e;if(e instanceof Error){let t=e.message.toLowerCase();return t.includes("network")||t.includes("fetch")?"Network connection failed. Please check your internet connection.":t.includes("401")||t.includes("unauthorized")?"Authentication failed. Please check your GitHub token.":t.includes("403")||t.includes("forbidden")?"Access denied. Please check repository permissions.":t.includes("404")||t.includes("not found")?"Repository or branch not found.":t.includes("422")||t.includes("validation")?"Validation failed. The branch may already have an open pull request.":e.message}return"An unknown error occurred while creating the pull request."}isReady(){return this.client!==null&&this.auth.hasClient()}getCurrentRepository(){let e=this.auth.getPublicConfig();return e!=null&&e.repository?{owner:e.repository.owner,name:e.repository.name,branch:e.repository.branch||"main"}:null}}});function j(p,e){let t=p instanceof Error?p:new Error(String(p)),o=t.message.toLowerCase(),r=t.status,i="UNKNOWN_ERROR";r===401||o.includes("bad credentials")?i="AUTH_BAD_CREDENTIALS":o.includes("token")&&(o.includes("invalid")||o.includes("expired"))?i="AUTH_TOKEN_INVALID":o.includes("token")&&o.includes("missing")?i="AUTH_TOKEN_MISSING":r===403?o.includes("permission")||o.includes("scope")?i="AUTHZ_INSUFFICIENT_PERMISSIONS":o.includes("protected")?i="AUTHZ_BRANCH_PROTECTED":i="AUTHZ_REPO_ACCESS_DENIED":r===404?o.includes("repository")||o.includes("repo")?i="REPO_NOT_FOUND":o.includes("branch")||o.includes("ref")?i="REPO_BRANCH_NOT_FOUND":o.includes("file")&&(i="REPO_FILE_NOT_FOUND"):r===429||o.includes("rate limit")?i="RATE_LIMIT_EXCEEDED":o.includes("network")||o.includes("connection")||o.includes("fetch")?o.includes("offline")?i="NET_OFFLINE":o.includes("timeout")?i="NET_TIMEOUT":i="NET_CONNECTION_FAILED":o.includes("failed to get ref")?i="GIT_REF_NOT_FOUND":o.includes("create branch")||o.includes("branch creation")?i="GIT_CREATE_BRANCH_FAILED":o.includes("push")&&o.includes("failed")?i="GIT_PUSH_FAILED":o.includes("pull request")||o.includes("pr")?i="GIT_CREATE_PR_FAILED":o.includes("commit")?i="GIT_COMMIT_FAILED":(o.includes("configuration")||o.includes("config"))&&(o.includes("missing")?i="CONFIG_MISSING":i="CONFIG_INVALID");let n=ht[i];return k(y({},n),{code:i,technicalMessage:`${n.technicalMessage}${e?` (Context: ${e})`:""}
Original: ${t.message}`})}var ht,Te=w(()=>{"use strict";ht={AUTH_TOKEN_INVALID:{category:"authentication",severity:"critical",title:"Invalid GitHub Token",userMessage:"Your GitHub Personal Access Token is invalid or has been revoked.",technicalMessage:'GitHub API returned 401 Unauthorized with "Bad credentials" message.',solutions:[{step:1,action:"Generate a new Personal Access Token",details:"Go to GitHub \u2192 Settings \u2192 Developer settings \u2192 Personal access tokens \u2192 Tokens (classic)"},{step:2,action:"Ensure the token has required permissions",details:"Enable: repo (Full control of private repositories)"},{step:3,action:"Copy the new token and update your configuration",details:"Re-run the GitHub setup in the plugin and paste your new token"}],learnMoreUrl:"https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens",retryable:!0,fallbackAvailable:!0},AUTH_TOKEN_EXPIRED:{category:"authentication",severity:"critical",title:"GitHub Token Expired",userMessage:"Your GitHub Personal Access Token has expired.",technicalMessage:"Token expiration date has passed.",solutions:[{step:1,action:"Generate a new Personal Access Token",details:"Go to GitHub \u2192 Settings \u2192 Developer settings \u2192 Personal access tokens"},{step:2,action:'Set an expiration date or choose "No expiration"',details:"For production use, consider using fine-grained tokens with longer expiration"},{step:3,action:"Update your token in the plugin configuration"}],learnMoreUrl:"https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens",retryable:!0,fallbackAvailable:!0},AUTH_TOKEN_MISSING:{category:"authentication",severity:"critical",title:"GitHub Token Missing",userMessage:"No GitHub token configured. Please set up GitHub integration first.",technicalMessage:"GitHub client attempted to make API call without authentication token.",solutions:[{step:1,action:"Run GitHub setup from the plugin",details:'Click "Configure GitHub" in the export options'},{step:2,action:"Create a Personal Access Token on GitHub",details:"Go to GitHub \u2192 Settings \u2192 Developer settings \u2192 Personal access tokens"},{step:3,action:"Paste the token into the plugin configuration"}],retryable:!0,fallbackAvailable:!0},AUTH_BAD_CREDENTIALS:{category:"authentication",severity:"critical",title:"Authentication Failed",userMessage:"GitHub rejected your credentials. The token may be invalid or revoked.",technicalMessage:"HTTP 401: Bad credentials",solutions:[{step:1,action:"Verify your token is correct",details:"Check that you copied the entire token without extra spaces"},{step:2,action:"Check if the token was revoked",details:"Go to GitHub \u2192 Settings \u2192 Developer settings \u2192 Personal access tokens \u2192 Check token status"},{step:3,action:"Generate a new token if needed",details:'Create a new token with "repo" permissions and update your configuration'}],learnMoreUrl:"https://docs.github.com/en/rest/overview/troubleshooting",retryable:!0,fallbackAvailable:!0},AUTHZ_INSUFFICIENT_PERMISSIONS:{category:"authorization",severity:"high",title:"Insufficient Permissions",userMessage:"Your GitHub token doesn't have the required permissions for this operation.",technicalMessage:"HTTP 403: Forbidden - Insufficient token scopes",solutions:[{step:1,action:"Check your token permissions",details:"Go to GitHub \u2192 Settings \u2192 Developer settings \u2192 Personal access tokens"},{step:2,action:"Regenerate token with correct scopes",details:"Required scopes: repo (or public_repo for public repositories only)"},{step:3,action:"Update the token in plugin configuration"}],learnMoreUrl:"https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps",retryable:!0,fallbackAvailable:!0},AUTHZ_REPO_ACCESS_DENIED:{category:"authorization",severity:"high",title:"Repository Access Denied",userMessage:"You don't have access to this repository.",technicalMessage:"HTTP 403: Forbidden - Repository access denied",solutions:[{step:1,action:"Verify you have write access to the repository",details:"Check repository settings \u2192 Collaborators & teams"},{step:2,action:"Contact repository owner for access",details:'Request "Write" or "Admin" permissions'},{step:3,action:"Verify repository name is correct",details:"Format should be: owner/repository-name"}],retryable:!1,fallbackAvailable:!0},AUTHZ_BRANCH_PROTECTED:{category:"authorization",severity:"high",title:"Branch is Protected",userMessage:"Cannot push directly to this protected branch.",technicalMessage:"Branch protection rules prevent direct pushes",solutions:[{step:1,action:"Create a pull request instead",details:'Use "Create Pull Request" option instead of direct push'},{step:2,action:"Or modify branch protection rules",details:"Repository Settings \u2192 Branches \u2192 Branch protection rules"}],learnMoreUrl:"https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches",retryable:!1,fallbackAvailable:!0},NET_CONNECTION_FAILED:{category:"network",severity:"high",title:"Connection Failed",userMessage:"Could not connect to GitHub. Please check your internet connection.",technicalMessage:"Network request failed - unable to reach GitHub API",solutions:[{step:1,action:"Check your internet connection",details:"Ensure you have active internet connectivity"},{step:2,action:"Check if GitHub is accessible",details:"Visit https://www.githubstatus.com/ to check GitHub status"},{step:3,action:"Try again in a few moments"}],learnMoreUrl:"https://www.githubstatus.com/",retryable:!0,fallbackAvailable:!0},NET_TIMEOUT:{category:"network",severity:"medium",title:"Request Timeout",userMessage:"The request to GitHub took too long and timed out.",technicalMessage:"Network request exceeded timeout threshold",solutions:[{step:1,action:"Check your internet connection speed",details:"Slow connections may cause timeouts"},{step:2,action:"Try again",details:"The issue may be temporary"}],retryable:!0,fallbackAvailable:!0},NET_OFFLINE:{category:"network",severity:"critical",title:"No Internet Connection",userMessage:"You appear to be offline. GitHub operations require an internet connection.",technicalMessage:"Network unavailable",solutions:[{step:1,action:"Check your internet connection",details:"Ensure Wi-Fi or Ethernet is connected"},{step:2,action:"Download tokens locally instead",details:'Use the "Download JSON" option to save tokens offline'}],retryable:!0,fallbackAvailable:!0},REPO_NOT_FOUND:{category:"repository",severity:"high",title:"Repository Not Found",userMessage:"The specified GitHub repository could not be found.",technicalMessage:"HTTP 404: Repository does not exist or is not accessible",solutions:[{step:1,action:"Verify the repository name is correct",details:'Format: owner/repository-name (e.g., "myusername/my-design-tokens")'},{step:2,action:"Check if the repository exists on GitHub",details:"Visit the repository URL to confirm it exists"},{step:3,action:"Ensure you have access to the repository",details:"Private repositories require proper permissions"}],retryable:!1,fallbackAvailable:!0},REPO_INVALID_NAME:{category:"validation",severity:"medium",title:"Invalid Repository Name",userMessage:"The repository name format is invalid.",technicalMessage:"Repository name does not match required format: owner/repo",solutions:[{step:1,action:"Use the correct format",details:"Repository name should be: owner/repository-name"},{step:2,action:"Examples of valid names",details:"github-username/design-system, company/ui-tokens"}],retryable:!1,fallbackAvailable:!1},REPO_BRANCH_NOT_FOUND:{category:"repository",severity:"medium",title:"Branch Not Found",userMessage:"The specified branch does not exist in the repository.",technicalMessage:"Git ref not found for specified branch",solutions:[{step:1,action:"Verify the branch name is correct",details:"Check for typos in the branch name"},{step:2,action:"Use an existing branch",details:"Common branch names: main, master, develop"},{step:3,action:"Create a new branch from the base branch"}],retryable:!1,fallbackAvailable:!0},REPO_FILE_NOT_FOUND:{category:"repository",severity:"low",title:"File Not Found",userMessage:"The file does not exist at the specified path.",technicalMessage:"HTTP 404: File path not found in repository",solutions:[{step:1,action:"File will be created automatically",details:"The plugin will create the file at the specified path"}],retryable:!0,fallbackAvailable:!1},GIT_CREATE_BRANCH_FAILED:{category:"git_operation",severity:"high",title:"Failed to Create Branch",userMessage:"Could not create the new branch in the repository.",technicalMessage:"Git branch creation failed",solutions:[{step:1,action:"Check if a branch with this name already exists",details:"Try using a different branch name"},{step:2,action:"Verify you have write access to the repository"},{step:3,action:"Ensure the base branch exists and is accessible"}],retryable:!0,fallbackAvailable:!0},GIT_PUSH_FAILED:{category:"git_operation",severity:"high",title:"Push Failed",userMessage:"Could not push changes to the repository.",technicalMessage:"Git push operation failed",solutions:[{step:1,action:"Check if the branch is protected",details:"Protected branches may require pull requests"},{step:2,action:"Verify you have write permissions"},{step:3,action:"Try creating a pull request instead"}],retryable:!0,fallbackAvailable:!0},GIT_CREATE_PR_FAILED:{category:"git_operation",severity:"high",title:"Failed to Create Pull Request",userMessage:"Could not create the pull request.",technicalMessage:"GitHub PR creation API call failed",solutions:[{step:1,action:"Check if a PR already exists for this branch",details:"You cannot create duplicate PRs for the same branch"},{step:2,action:"Verify the source and target branches exist"},{step:3,action:"Ensure you have write access to the repository"}],retryable:!0,fallbackAvailable:!0},GIT_COMMIT_FAILED:{category:"git_operation",severity:"high",title:"Commit Failed",userMessage:"Could not commit changes to the repository.",technicalMessage:"Git commit operation failed",solutions:[{step:1,action:"Check if the file path is valid",details:"File paths should not start with / or contain invalid characters"},{step:2,action:"Verify repository write access"},{step:3,action:"Ensure the branch exists"}],retryable:!0,fallbackAvailable:!0},GIT_REF_NOT_FOUND:{category:"git_operation",severity:"high",title:"Git Reference Not Found",userMessage:"Could not find the specified branch or ref in the repository.",technicalMessage:"Failed to get ref heads/[branch-name]",solutions:[{step:1,action:"Verify the branch name is correct",details:"Check for typos and ensure the branch exists"},{step:2,action:"Check your GitHub token permissions",details:"Your token must have access to read repository refs"},{step:3,action:'Try using "main" or "master" as the base branch'}],retryable:!0,fallbackAvailable:!0},CONFIG_INVALID:{category:"configuration",severity:"high",title:"Invalid Configuration",userMessage:"The GitHub configuration is invalid or incomplete.",technicalMessage:"Configuration validation failed",solutions:[{step:1,action:"Re-run the GitHub setup",details:'Click "Configure GitHub" and enter your details again'},{step:2,action:"Ensure all required fields are filled",details:"Token, repository, and branch are all required"}],retryable:!1,fallbackAvailable:!0},CONFIG_MISSING:{category:"configuration",severity:"high",title:"Configuration Missing",userMessage:"No GitHub configuration found. Please set up GitHub integration.",technicalMessage:"GitHub configuration not found in storage",solutions:[{step:1,action:"Run GitHub setup",details:'Click "Configure GitHub" to set up integration'}],retryable:!1,fallbackAvailable:!0},RATE_LIMIT_EXCEEDED:{category:"rate_limit",severity:"medium",title:"Rate Limit Exceeded",userMessage:"You've exceeded GitHub's API rate limit. Please wait before trying again.",technicalMessage:"HTTP 429: API rate limit exceeded",solutions:[{step:1,action:"Wait for rate limit to reset",details:"GitHub rate limits reset every hour"},{step:2,action:"Check your rate limit status",details:"Visit https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting"},{step:3,action:"Consider using a GitHub App for higher limits",details:"GitHub Apps have higher rate limits than personal tokens"}],learnMoreUrl:"https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting",retryable:!0,fallbackAvailable:!0},UNKNOWN_ERROR:{category:"unknown",severity:"medium",title:"Unknown Error",userMessage:"An unexpected error occurred.",technicalMessage:"Unclassified error",solutions:[{step:1,action:"Try the operation again"},{step:2,action:"Check the browser console for details",details:"Open Developer Tools (F12) and check the Console tab"},{step:3,action:"Download tokens locally as a fallback",details:'Use "Download JSON" option'}],retryable:!0,fallbackAvailable:!0}}});var be,je=w(()=>{"use strict";Te();X();be=class{constructor(e){h(this,"options");this.options=e}async show(){return new Promise(e=>{let t=this.buildHTML();figma.showUI(t,P(`Error: ${this.options.error.title}`)),figma.ui.onmessage=async o=>{switch(o.type){case"error-retry":this.options.onRetry&&this.options.onRetry(),e({action:"retry"});break;case"error-fallback":this.options.onFallback&&this.options.onFallback(),e({action:"fallback"});break;case"error-learn-more":e({action:"learn-more"});break;case"error-close":this.options.onClose&&this.options.onClose(),e({action:"close"});break}}})}buildHTML(){let{error:e,showTechnicalDetails:t}=this.options;return`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          ${this.getStyles()}
        </style>
      </head>
      <body>
        <div class="error-dialog">
          ${this.renderHeader()}
          ${this.renderContent()}
          ${this.renderSolutions()}
          ${t?this.renderTechnicalDetails():""}
          ${this.renderActions()}
        </div>

        <script>
          ${this.getScript()}
        </script>
      </body>
      </html>
    `}renderHeader(){let{error:e}=this.options,t=this.getSeverityIconClass(e.severity);return`
      <div class="error-header" style="border-left-color: ${this.getSeverityColor(e.severity)};">
        <div class="error-icon ${t}">${this.getSeverityIcon(e.severity)}</div>
        <div class="error-title-section">
          <h2 class="error-title">${e.title}</h2>
          <div class="error-meta">
            <span class="error-code">${e.code}</span>
            <span class="error-category">${this.formatCategory(e.category)}</span>
            <span class="error-severity severity-${e.severity}">${this.formatSeverity(e.severity)}</span>
          </div>
        </div>
      </div>
    `}renderContent(){let{error:e}=this.options;return`
      <div class="error-content">
        <div class="error-section">
          <h3>What happened?</h3>
          <p class="error-message">${e.userMessage}</p>
        </div>
      </div>
    `}renderSolutions(){let{error:e}=this.options;return!e.solutions||e.solutions.length===0?"":`
      <div class="error-section solutions-section">
        <h3>How to fix this</h3>
        <ol class="solutions-list">
          ${e.solutions.map(o=>`
        <li class="solution-item">
          <div class="solution-step">${o.step}</div>
          <div class="solution-content">
            <div class="solution-action">${o.action}</div>
            ${o.details?`<div class="solution-details">${o.details}</div>`:""}
          </div>
        </li>
      `).join("")}
        </ol>
      </div>
    `}renderTechnicalDetails(){let{error:e}=this.options;return`
      <div class="error-section technical-section">
        <details>
          <summary>Technical Details</summary>
          <div class="technical-content">
            <pre>${e.technicalMessage}</pre>
          </div>
        </details>
      </div>
    `}renderActions(){let{error:e}=this.options,t=!!e.learnMoreUrl;return`
      <div class="error-actions">
        <div class="primary-actions">
          ${e.retryable?'<button class="btn btn-primary" onclick="handleRetry()">Try Again</button>':""}
          ${e.fallbackAvailable?'<button class="btn btn-secondary" onclick="handleFallback()">Download Locally</button>':""}
          ${t?'<button class="btn btn-link" onclick="handleLearnMore()">Learn More</button>':""}
        </div>
        <button class="btn btn-text" onclick="handleClose()">Close</button>
      </div>
    `}getStyles(){return`
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 13px;
        line-height: 1.6;
        color: #333;
        background: #fff;
        padding: 0;
        overflow-y: auto;
      }

      .error-dialog {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 100vh;
      }

      /* Header */
      .error-header {
        background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
        padding: 24px;
        border-left: 4px solid #dc3545;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        align-items: flex-start;
        gap: 16px;
      }

      .error-icon {
        font-size: 32px;
        line-height: 1;
        flex-shrink: 0;
      }

      .error-icon.critical { color: #dc3545; }
      .error-icon.high { color: #fd7e14; }
      .error-icon.medium { color: #ffc107; }
      .error-icon.low { color: #6c757d; }

      .error-title-section {
        flex: 1;
      }

      .error-title {
        font-size: 18px;
        font-weight: 600;
        color: #212529;
        margin-bottom: 8px;
      }

      .error-meta {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .error-code {
        display: inline-block;
        padding: 2px 8px;
        background: #e9ecef;
        border-radius: 4px;
        font-size: 11px;
        font-family: 'SF Mono', Monaco, monospace;
        color: #495057;
      }

      .error-category {
        display: inline-block;
        padding: 2px 8px;
        background: #f8f9fa;
        border-radius: 4px;
        font-size: 11px;
        color: #6c757d;
        text-transform: capitalize;
      }

      .error-severity {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 500;
        text-transform: uppercase;
      }

      .severity-critical {
        background: #f8d7da;
        color: #721c24;
      }

      .severity-high {
        background: #ffe5d0;
        color: #7a4419;
      }

      .severity-medium {
        background: #fff3cd;
        color: #856404;
      }

      .severity-low {
        background: #e2e3e5;
        color: #383d41;
      }

      /* Content */
      .error-content {
        flex: 1;
        padding: 24px;
        overflow-y: auto;
      }

      .error-section {
        margin-bottom: 24px;
      }

      .error-section:last-child {
        margin-bottom: 0;
      }

      .error-section h3 {
        font-size: 14px;
        font-weight: 600;
        color: #495057;
        margin-bottom: 12px;
      }

      .error-message {
        font-size: 14px;
        color: #212529;
        line-height: 1.6;
      }

      /* Solutions */
      .solutions-section {
        background: #f8f9fa;
        padding: 16px;
        border-radius: 8px;
        border: 1px solid #dee2e6;
      }

      .solutions-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .solution-item {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #dee2e6;
      }

      .solution-item:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      .solution-step {
        flex-shrink: 0;
        width: 28px;
        height: 28px;
        background: #000000;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 13px;
      }

      .solution-content {
        flex: 1;
      }

      .solution-action {
        font-size: 13px;
        font-weight: 500;
        color: #212529;
        margin-bottom: 4px;
      }

      .solution-details {
        font-size: 12px;
        color: #6c757d;
        line-height: 1.5;
      }

      /* Technical Details */
      .technical-section {
        background: #212529;
        color: #f8f9fa;
        padding: 16px;
        border-radius: 8px;
      }

      .technical-section summary {
        cursor: pointer;
        font-weight: 500;
        font-size: 12px;
        color: #adb5bd;
        padding: 4px 0;
      }

      .technical-section summary:hover {
        color: #f8f9fa;
      }

      .technical-content {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #495057;
      }

      .technical-content pre {
        font-family: 'SF Mono', Monaco, monospace;
        font-size: 11px;
        line-height: 1.6;
        color: #f8f9fa;
        white-space: pre-wrap;
        word-break: break-word;
      }

      /* Actions */
      .error-actions {
        padding: 20px 24px;
        border-top: 1px solid #e9ecef;
        background: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }

      .primary-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .btn {
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        outline: none;
      }

      .btn:hover {
        transform: translateY(-1px);
      }

      .btn:active {
        transform: translateY(0);
      }

      .btn-primary {
        background: #000000;
        color: white;
      }

      .btn-primary:hover {
        background: #0d8ce8;
      }

      .btn-secondary {
        background: #6c757d;
        color: white;
      }

      .btn-secondary:hover {
        background: #5a6268;
      }

      .btn-link {
        background: transparent;
        color: #000000;
        text-decoration: underline;
      }

      .btn-link:hover {
        color: #0d8ce8;
      }

      .btn-text {
        background: transparent;
        color: #6c757d;
      }

      .btn-text:hover {
        color: #495057;
        transform: none;
      }
    `}getScript(){return`
      function handleRetry() {
        parent.postMessage({ pluginMessage: { type: 'error-retry' } }, '*');
      }

      function handleFallback() {
        parent.postMessage({ pluginMessage: { type: 'error-fallback' } }, '*');
      }

      function handleLearnMore() {
        parent.postMessage({ pluginMessage: { type: 'error-learn-more' } }, '*');
        ${this.options.error.learnMoreUrl?`window.open('${this.options.error.learnMoreUrl}', '_blank');`:""}
      }

      function handleClose() {
        parent.postMessage({ pluginMessage: { type: 'error-close' } }, '*');
      }
    `}getSeverityIcon(e){switch(e){case"critical":return"\u{1F6A8}";case"high":return"\u26A0\uFE0F";case"medium":return"\u26A1";case"low":return"\u2139\uFE0F";default:return"\u2753"}}getSeverityIconClass(e){return e}getSeverityColor(e){switch(e){case"critical":return"#dc3545";case"high":return"#fd7e14";case"medium":return"#ffc107";case"low":return"#6c757d";default:return"#6c757d"}}formatCategory(e){return e.replace(/_/g," ")}formatSeverity(e){return e.toUpperCase()}}});var me,Je=w(()=>{"use strict";Te();je();me=class{static async handle(e){let{error:t,context:o,showDialog:r=!0,showTechnicalDetails:i=!1,onRetry:n,onFallback:s,logToConsole:l=!0}=e,d=j(t,o);l&&this.logError(d,t);let g;return r&&(g=await this.showErrorDialog(d,{showTechnicalDetails:i,onRetry:n,onFallback:s})),{metadata:d,dialogResult:g}}static async handleWithRetry(e,t={}){let{maxRetries:o=3,context:r,showDialog:i=!0,onFallback:n}=t,s,l=0;for(;l<o;)try{return{success:!0,result:await e()}}catch(g){if(s=g,l++,!j(g,r).retryable||l>=o)return{success:!1,error:(await this.handle({error:g,context:`${r} (Attempt ${l}/${o})`,showDialog:i,onFallback:n})).metadata};let f=Math.min(1e3*Math.pow(2,l-1),5e3);await new Promise(v=>setTimeout(v,f))}return{success:!1,error:j(s,r)}}static notify(e,t){let o=j(e,t);figma.notify(`${o.title}: ${o.userMessage}`,{error:!0,timeout:6e3}),this.logError(o,e)}static async showErrorDialog(e,t){return await new be({error:e,showTechnicalDetails:t.showTechnicalDetails,onRetry:t.onRetry,onFallback:t.onFallback}).show()}static logError(e,t){let o=this.getSeverityEmoji(e.severity);console.error(`
${o} ${e.title} [${e.code}]`),console.error("Category:",e.category),console.error("Severity:",e.severity),console.error("User Message:",e.userMessage),console.error("Technical Message:",e.technicalMessage),e.solutions.length>0&&(console.error(`
Solutions:`),e.solutions.forEach(r=>{console.error(`  ${r.step}. ${r.action}`),r.details&&console.error(`     ${r.details}`)})),console.error(`
Original Error:`,t),console.error(`---
`)}static getSeverityEmoji(e){switch(e){case"critical":return"\u{1F6A8}";case"high":return"\u26A0\uFE0F";case"medium":return"\u26A1";case"low":return"\u2139\uFE0F";default:return"\u2753"}}static createErrorLog(e,t){let o=j(e,t),i={timestamp:new Date().toISOString(),errorCode:o.code,category:o.category,severity:o.severity,title:o.title,userMessage:o.userMessage,technicalMessage:o.technicalMessage,context:t,originalError:e instanceof Error?{message:e.message,stack:e.stack,name:e.name}:String(e),solutions:o.solutions,retryable:o.retryable,fallbackAvailable:o.fallbackAvailable};return JSON.stringify(i,null,2)}}});var Ye={};we(Ye,{ExportWorkflow:()=>Se});var Se,Ke=w(()=>{"use strict";Pe();He();Ve();te();ie();We();qe();ke();Je();Se=class{constructor(e){h(this,"tokenExtractor");h(this,"documentInfo");h(this,"githubAuth");h(this,"pushService");h(this,"prService");h(this,"gitOps");h(this,"cancelCount",0);this.tokenExtractor=e.tokenExtractor,this.documentInfo=e.documentInfo,this.githubAuth=N.getInstance(),this.pushService=new he,this.prService=new fe,this.gitOps=new M}async runWorkflow(){let e=Date.now();try{console.log("\u{1F680} Starting export workflow..."),await this.initializeGitHubServices(),figma.notify("Extracting design tokens...",{timeout:2e3});let t=await this.extractTokens(),o=await this.showUnifiedUI(t),r=await this.handleUserChoice(o,t),i=Date.now()-e;return k(y({},r),{extractionResult:t,duration:i})}catch(t){let o=Date.now()-e;return console.error("\u274C Workflow failed:",t),{success:!1,choice:"cancel",error:t instanceof Error?t.message:"Unknown error",duration:o}}}async initializeGitHubServices(){try{console.log("\u{1F41B} DEBUG: ExportWorkflow.initializeGitHubServices() - START"),console.log("\u{1F41B} DEBUG: Initializing GitHubAuth..."),await this.githubAuth.initialize(),console.log("\u{1F41B} DEBUG: GitHubAuth initialized");let e=this.githubAuth.getState();if(console.log("\u{1F41B} DEBUG: GitHubAuth state after init:",{isConfigured:e.isConfigured,isConnected:e.isConnected,hasConfig:!!e.config,hasClient:this.githubAuth.hasClient(),errors:e.errors}),console.log("\u{1F41B} DEBUG: Initializing TokenPushService..."),await this.pushService.initialize(),console.log("\u{1F41B} DEBUG: TokenPushService initialized"),console.log("\u{1F41B} DEBUG: Initializing PullRequestService..."),await this.prService.initialize(),console.log("\u{1F41B} DEBUG: PullRequestService initialized"),console.log("\u{1F41B} DEBUG: Initializing GitOperations..."),await this.gitOps.initialize(),console.log("\u{1F41B} DEBUG: GitOperations initialized"),this.githubAuth.hasClient()){console.log("\u{1F41B} DEBUG: Verifying client availability...");let t=this.githubAuth.getClient();console.log("\u{1F41B} DEBUG: Client verification:",{available:!!t,clientId:t.getClientId(),methodTypes:{fileExists:typeof t.fileExists,createFile:typeof t.createFile,getRepository:typeof t.getRepository}})}else console.log("\u{1F41B} DEBUG: No client available after initialization");console.log("\u{1F41B} DEBUG: ExportWorkflow.initializeGitHubServices() - END, SUCCESS")}catch(e){console.error("\u{1F41B} DEBUG: ExportWorkflow.initializeGitHubServices() - ERROR:",e),console.error("\u{1F41B} DEBUG: Error type:",typeof e),console.error("\u{1F41B} DEBUG: Error stack:",e instanceof Error?e.stack:"No stack"),console.warn("\u26A0\uFE0F GitHub service initialization partial, continuing anyway")}}async extractTokens(){console.log("\u{1F4CA} Extracting design tokens...");let e=await this.tokenExtractor.extractAllTokens(),t=e.tokens.length+e.variables.length;return console.log(`\u2705 Extracted ${t} tokens (${e.tokens.length} design tokens, ${e.variables.length} variables)`),e.metadata.errors.length>0&&console.warn(`\u26A0\uFE0F Extraction completed with ${e.metadata.errors.length} errors`),e}async showUnifiedUI(e){let o=this.githubAuth.getState().config,r={extractionResult:e,documentInfo:this.documentInfo,existingGitConfig:o};return await new de(r).showChoice()}async handleUserChoice(e,t){switch(e.type){case"git-push":return await this.handleGitPush(t,e);case"download":return await this.handleDownload(t);case"cancel":return console.log("\u{1F44B} User cancelled export"),figma.notify("Export cancelled"),{success:!1,choice:"cancel"};default:throw new Error(`Unknown choice type: ${e.type}`)}}async handleGitPush(e,t){var o,r;try{if(console.log("\u{1F41B} DEBUG: ExportWorkflow.handleGitPush() - Using PR Workflow"),t.gitConfig){let g=await this.githubAuth.configure(t.gitConfig);if(!g.success)throw new Error(g.error||"Failed to configure GitHub services")}let i=this.gitOps.getCurrentRepository();if(!i)throw new Error("No repository configured");let n=this.githubAuth.getPublicConfig(),s=((o=n==null?void 0:n.repository)==null?void 0:o.branch)||"main";console.log("\u{1F4DD} Starting PR workflow..."),console.log("   Repository:",`${i.owner}/${i.name}`),console.log("   Base branch:",s);let l=[];try{l=await this.gitOps.listBranches(i),console.log("   Available branches:",l)}catch(g){console.warn("\u26A0\uFE0F Could not fetch branches:",g),l=[s]}let d=await new Promise(g=>{new q({tokenData:e,documentInfo:this.documentInfo,defaultBranch:s,availableBranches:l,onComplete:f=>g(f),onCancel:()=>g(null)}).show()});if(!d){if(this.cancelCount++,console.log(`\u21A9\uFE0F User cancelled PR workflow (attempt ${this.cancelCount}), returning to landing page...`),this.cancelCount>=3)return console.log("\u26A0\uFE0F Maximum cancellations reached, ending workflow"),figma.notify("Workflow cancelled after multiple attempts"),{success:!1,choice:"cancel"};figma.notify("Returning to export options...");let g=await this.showUnifiedUI(e);return g.type!=="git-push"&&(this.cancelCount=0),await this.handleUserChoice(g,e)}return console.log("\u2705 User confirmed details:",{action:d.action,branchName:d.branchName}),this.cancelCount=0,d.action==="push-to-branch"?await this.executePushToBranch(e,i,d):await this.executeCreatePR(e,i,d,s)}catch(i){console.error("\u274C PR workflow failed:",i);let n=await me.handle({error:i,context:"GitHub PR Workflow",showDialog:!0,showTechnicalDetails:!0,onRetry:void 0,onFallback:async()=>{await this.handleDownload(e)}});return((r=n.dialogResult)==null?void 0:r.action)==="fallback"?await this.handleDownload(e):{success:!1,choice:"git-push",error:n.metadata.userMessage}}}async executePushToBranch(e,t,o){try{let r=o.branchName;if(figma.notify(`Pushing to branch: ${r}...`,{timeout:2e3}),console.log(`\u{1F4E4} Pushing tokens to branch: ${r}`),o.isNewBranch){console.log(`\u{1F33F} Creating new branch: ${r}`);let l=await this.gitOps.createBranch(t,r);if(!l.success)throw new Error(l.error||"Failed to create branch")}let i={path:"tokens/raw/figma-tokens.json",content:this.prepareTokenData(e),message:o.commitMessage},n=await this.gitOps.pushToBranch(t,r,i);if(!n.success)throw new Error(n.error||"Failed to push tokens");return console.log(`\u2705 Tokens pushed to branch: ${r}`),figma.notify(`\u2705 Pushed to ${r}`,{timeout:3e3}),new q({tokenData:e,documentInfo:this.documentInfo,onComplete:()=>{},onCancel:()=>{}}).showSuccess({action:"push-to-branch",branchName:r,prUrl:`https://github.com/${t.owner}/${t.name}/tree/${r}`}),{success:!0,choice:"git-push",gitResult:{branchName:r,pushResult:n}}}catch(r){throw console.error("\u274C Push to branch failed:",r),r}}async executeCreatePR(e,t,o,r){var i;try{figma.notify("Creating branch...",{timeout:2e3}),console.log("\u{1F33F} Ensuring unique branch name...");let n=await this.prService.generateUniqueBranchName(t,o.branchName);n!==o.branchName&&(console.log(`   Branch ${o.branchName} exists, using ${n}`),o.branchName=n),console.log(`\u{1F33F} Creating branch: ${o.branchName}`);let s=await this.gitOps.createBranch(t,o.branchName);if(!s.success)throw new Error(s.error||"Failed to create branch");console.log("\u2705 Branch created successfully"),figma.notify("Pushing tokens to branch...",{timeout:2e3}),console.log(`\u{1F4E4} Pushing tokens to branch: ${o.branchName}`);let l={path:"tokens/raw/figma-tokens.json",content:this.prepareTokenData(e),message:o.commitMessage},d=await this.gitOps.pushToBranch(t,o.branchName,l);if(!d.success)throw new Error(d.error||"Failed to push tokens");console.log("\u2705 Tokens pushed successfully"),figma.notify("Creating pull request...",{timeout:2e3}),console.log("\u{1F4DD} Creating pull request...");let g=await this.prService.createPullRequest(t,o,r);if(!g.success)throw new Error(g.error||"Failed to create pull request");console.log(`\u2705 Pull request #${g.prNumber} created!`);let m={triggered:!1};if((i=o.workflowTrigger)!=null&&i.enabled){console.log("\u{1F504} Triggering GitHub Actions workflow...");let T=performance.now();m=await this.triggerWorkflowSafely(t,o.workflowTrigger,o.branchName);let I=performance.now()-T;console.log(`\u2705 Workflow trigger completed in ${I.toFixed(0)}ms`)}let f={action:"create-pr",prNumber:g.prNumber,prUrl:g.prUrl,branchName:o.branchName,workflowTrigger:m};return new q({tokenData:e,documentInfo:this.documentInfo,defaultBranch:r,onComplete:()=>{},onCancel:()=>{}}).showSuccess(f),{success:!0,choice:"git-push",gitResult:{prNumber:g.prNumber,prUrl:g.prUrl,branchName:o.branchName,pushResult:d}}}catch(n){throw console.error("\u274C PR workflow execution failed:",n),n}}async triggerWorkflowSafely(e,t,o){try{let r=this.githubAuth.getClient();if(!r)return{triggered:!0,success:!1,error:"GitHub client not available"};let i=await r.triggerWorkflow(e.owner,e.name,t.workflowFileName,o,t.inputs);return i.success?{triggered:!0,success:!0,workflowUrl:`https://github.com/${e.owner}/${e.name}/actions`}:(console.warn("\u26A0\uFE0F Workflow trigger failed:",i.error),{triggered:!0,success:!1,error:i.error})}catch(r){return console.error("\u274C Unexpected error triggering workflow:",r),{triggered:!0,success:!1,error:r.message||"Unexpected error"}}}prepareTokenData(e){let t=new O,o={metadata:{sourceDocument:{name:e.metadata.documentName},tokenCounts:{totalTokens:e.tokens.length,totalVariables:e.variables.length}},variables:e.variables,collections:e.collections,designTokens:e.tokens};return t.transform(o)}async handleDownload(e){try{console.log("\u{1F4BE} Starting download workflow...");let t=Date.now()-new Date(e.metadata.extractedAt).getTime();return await this.triggerDownload(e,t),{success:!0,choice:"download",downloadResult:{initiated:!0}}}catch(t){console.error("\u274C Download failed:",t);let o=t instanceof Error?t.message:"Download failed";return figma.notify(`Download failed: ${o}`,{error:!0}),{success:!1,choice:"download",error:o}}}async triggerDownload(e,t){let o=this.createJSONDataset(e,t),r=JSON.stringify(o,null,2),n=`figma-tokens-${new Date().toISOString().replace(/:/g,"-").replace(/\..+/,"").replace("T","-")}.json`,s=`
      <!DOCTYPE html>
      <html>
      <head>
        <link href="https://unpkg.com/phosphor-icons@1.4.2/src/css/icons.css" rel="stylesheet">
        <style>
          body { font-family: Inter, sans-serif; padding: 20px; text-align: center; }
          .download-btn {
            background: #000000; color: white; border: none;
            padding: 12px 24px; border-radius: 8px; cursor: pointer;
            font-size: 14px; font-weight: 600; margin: 10px;
            transition: all 150ms ease;
          }
          .download-btn:hover {
            background: #404040;
          }
          .file-info {
            background: #F5F5F5; padding: 16px; border-radius: 8px;
            margin: 16px 0; text-align: left;
          }
        </style>
      </head>
      <body>
        <h2><i class="ph-file-text" data-weight="duotone"></i> Download Design Tokens</h2>
        <div class="file-info">
          <strong>File:</strong> ${n}<br>
          <strong>Size:</strong> ${(r.length/1024).toFixed(1)} KB<br>
          <strong>Tokens:</strong> ${e.tokens.length+e.variables.length}
        </div>
        <button class="download-btn" onclick="downloadFile()">Download JSON File</button>
        <button class="download-btn" onclick="closePlugin()" style="background: var(--color-text-secondary);">Close</button>

        <script>
          const jsonData = ${JSON.stringify(r)};
          const filename = "${n}";

          function downloadFile() {
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);

            setTimeout(() => {
              parent.postMessage({ pluginMessage: { type: 'close-plugin' } }, '*');
            }, 1000);
          }

          function closePlugin() {
            parent.postMessage({ pluginMessage: { type: 'close-plugin' } }, '*');
          }
        </script>
      </body>
      </html>
    `;figma.showUI(s,{width:450,height:300,title:"Download Design Tokens"}),figma.ui.onmessage=l=>{l.type==="close-plugin"&&figma.closePlugin("JSON file download completed!")}}getPluginVersion(){return"1.3.1"}generateJSONFilename(){let e=this.documentInfo.name.replace(/[^a-zA-Z0-9-_]/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"").toLowerCase(),t=new Date().toISOString().split("T")[0];return`${e}-design-tokens-${t}.json`}createJSONDataset(e,t){let o=new O,r=new Date().toISOString(),i=this.generateJSONFilename(),n={metadata:{sourceDocument:{name:this.documentInfo.name},tokenCounts:{totalTokens:e.tokens.length,totalVariables:e.variables.length}},variables:e.variables,collections:e.collections,designTokens:e.tokens},s=o.transform(n);return s._metadata={file:i,exportedAt:r,exportedBy:`Figma Design System Distributor v${this.getPluginVersion()}`,sourceDocument:this.documentInfo.name,totalTokens:e.tokens.length,totalVariables:e.variables.length,collections:e.collections.map(l=>{var d;return`${l.name} (${((d=l.variables)==null?void 0:d.length)||0} tokens)`})},s}async offerDownloadFallback(){return new Promise(e=>{figma.showUI(`
        <!DOCTYPE html>
        <html>
        <head>
          <link href="https://unpkg.com/phosphor-icons@1.4.2/src/css/icons.css" rel="stylesheet">
          <style>
            body { font-family: Inter, sans-serif; padding: 20px; text-align: center; }
            .btn {
              padding: 12px 24px; margin: 8px; border: none; border-radius: 8px;
              cursor: pointer; font-size: 14px; font-weight: 600;
              transition: all 150ms ease;
            }
            .primary { background: #000000; color: white; }
            .primary:hover { background: #404040; }
            .secondary { background: #F5F5F5; color: #000000; border: 2px solid #000000; }
            .secondary:hover { background: #E5E5E5; }
          </style>
        </head>
        <body>
          <h3><i class="ph-prohibit" data-weight="fill"></i> Git Push Failed</h3>
          <p>Would you like to download the tokens locally instead?</p>
          <button class="btn primary" onclick="fallback(true)">Yes, Download</button>
          <button class="btn secondary" onclick="fallback(false)">No, Cancel</button>

          <script>
            function fallback(shouldDownload) {
              parent.postMessage({
                pluginMessage: { type: 'fallback-choice', download: shouldDownload }
              }, '*');
            }
          </script>
        </body>
        </html>
      `,{width:350,height:200,title:"Git Push Failed"}),figma.ui.onmessage=o=>{o.type==="fallback-choice"&&e(o.download)}})}async runGitHubSetup(){try{console.log("\u{1F527} Starting GitHub setup wizard..."),figma.notify("Setting up GitHub integration...",{timeout:3e3});let t=await new ue().runSetup();if(t.success&&t.config){console.log("\u2705 GitHub setup completed successfully");let o=await this.githubAuth.configure(t.config);if(!o.success)throw new Error(o.error||"Failed to apply GitHub configuration");console.log("\u2705 GitHub configuration applied and stored"),figma.notify("GitHub integration configured successfully!",{timeout:2e3})}else throw new Error(t.error||"GitHub setup was cancelled or failed")}catch(e){console.error("\u274C GitHub setup failed:",e);let t=e instanceof Error?e.message:"Setup failed";throw figma.notify(`GitHub setup failed: ${t}`,{error:!0,timeout:5e3}),e}}getRepositoryString(){let e=this.githubAuth.getPublicConfig();return e!=null&&e.repository?`${e.repository.owner}/${e.repository.name}`:void 0}}});var Xe={};we(Xe,{default:()=>wt,generateSmartCommitMessage:()=>Ce});function ft(){try{return!!(figma&&figma.root&&figma.root.type==="DOCUMENT")}catch(p){return console.error("Figma environment validation failed:",p),!1}}async function bt(){if(ye)return ye;let p=await figma.getLocalPaintStylesAsync(),e=await figma.getLocalTextStylesAsync(),t=await figma.getLocalEffectStylesAsync(),o=await figma.variables.getLocalVariableCollectionsAsync(),r=0;try{o.forEach(i=>{r+=i.variableIds.length})}catch(i){console.warn("Error counting variables:",i)}return ye={paintStyles:p,textStyles:e,effectStyles:t,variableCollections:o,totalVariables:r,totalNodes:0},ye}async function mt(){let p=await bt();return{name:figma.root.name,id:figma.fileKey||"unknown",pageCount:0,totalNodes:p.totalNodes,paintStyles:p.paintStyles.length,textStyles:p.textStyles.length,effectStyles:p.effectStyles.length,variableCollections:p.variableCollections.length,localVariables:p.totalVariables}}function Ce(p,e){let o=new Date().toISOString().replace("T"," ").substring(0,16),r=p.tokens.length,i=p.variables.length,n=p.collections.length,s=`Update design tokens from Figma - ${o}

Changes:
- ${r} tokens
- ${i} variables
- ${n} collections`;return p.collections.length>0&&(s+=`

Updated collections:`,p.collections.forEach(l=>{var g;let d=((g=l.variables)==null?void 0:g.length)||0;s+=`
- ${l.name} (${d} tokens)`})),s}function yt(){figma.showUI(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://unpkg.com/phosphor-icons@1.4.2/src/css/icons.css" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Inter","Roboto","Helvetica Neue",Arial,sans-serif;background:linear-gradient(135deg,#DEE3FC 0%,#F7E3E3 100%);display:flex;align-items:center;justify-content:center;min-height:100vh;overflow:visible;padding:24px}
.container{text-align:center;color:#0F1112;padding:32px;background:white;border-radius:16px;box-shadow:0 2px 8px rgba(15,17,18,0.04);max-width:400px}
.logo{font-size:64px;margin-bottom:24px;animation:scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)}
.title{font-size:24px;font-weight:700;margin-bottom:8px;animation:fadeIn 0.5s ease-out;color:#0F1112}
.subtitle{font-size:14px;color:#B1B2B6;margin-bottom:24px;animation:fadeIn 0.7s ease-out}
.spinner{width:24px;height:24px;border:3px solid #E5E7E9;border-top-color:#C084FC;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
</style>
</head>
<body>
<div class="container">
<div class="logo"><i class="ph-palette ph-duotone"></i></div>
<div class="title">Token Launch</div>
<div class="subtitle">Loading your design tokens...</div>
<div class="spinner"></div>
</div>
</body>
</html>`,{width:z.DEFAULT_WIDTH,height:z.DEFAULT_HEIGHT,themeColors:!0})}async function vt(){let p=Date.now(),e={},t={launch:p,loadingScreenShown:0,mainUIShown:0};c.critical(`
\u{1F680} Plugin launched`);try{let o=Date.now();yt(),t.loadingScreenShown=Date.now();let r=t.loadingScreenShown-p;c.critical(`\u{1F3A8} Loading screen visible (+${r}ms)`),e["1_show_loading_screen"]=Date.now()-o,c.debug(`\u23F1\uFE0F  [${e["1_show_loading_screen"]}ms] Loading screen displayed`);let i=Date.now();if(!ft())throw new Error("Invalid Figma environment. Please open a Figma document and try again.");e["2_validate_environment"]=Date.now()-i;let n=Date.now(),s=await mt();e["3_get_document_info"]=Date.now()-n;let l=Date.now(),{ExportWorkflow:d}=await Promise.resolve().then(()=>(Ke(),Ye));e["4_import_workflow"]=Date.now()-l;let g=Date.now(),m={includeLocalStyles:!0,includeComponentTokens:!0,includeVariables:!0,traverseInstances:!1,maxDepth:10,includeHiddenLayers:!1,includeMetadata:!0},f=new re(m);e["5_create_extractor"]=Date.now()-g;let v=Date.now(),T=new d({tokenExtractor:f,documentInfo:s});e["6_create_workflow"]=Date.now()-v;let I=Date.now(),F=await T.runWorkflow();e["7_run_workflow"]=Date.now()-I,t.mainUIShown=Date.now();let U=t.mainUIShown-p,J=t.mainUIShown-t.loadingScreenShown;console.log(`
`+"\u2728".repeat(40)),console.log(`\u2728 MAIN UI VISIBLE after ${U}ms`),console.log(`   (Loading screen was visible for ${J}ms)`),console.log("\u2728".repeat(40)+`
`);let G=Date.now()-p;e.TOTAL=G,console.log(`\u23F1\uFE0F Plugin loaded in ${G}ms`);let A=Object.entries(e).filter(([E])=>E!=="TOTAL").sort(([,E],[,Ie])=>Ie-E);G>1e3&&console.log("\u26A0\uFE0F Load time exceeds 1 second"),!F.success&&F.error&&figma.notify(`Export failed: ${F.error}`,{error:!0})}catch(o){let r=o instanceof Error?o.message:String(o);console.error("\u274C Plugin failed:",r),figma.notify(`\u274C Plugin failed: ${r}`,{error:!0,timeout:5e3}),figma.closePlugin(`Plugin failed: ${r}`)}}var ye,wt,Ee=w(()=>{"use strict";Fe();ie();Y();se();ye=null;wt=vt});var xt={"src/main.ts--default":(Ee(),it(Xe)).default},kt="src/main.ts--default";xt[kt]();
