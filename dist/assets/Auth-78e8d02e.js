import{_ as E,u as F,b as T,d as H,r as n,e as M,w as Y,f as j,o as p,g as m,h as s,i as z,V as y,j as t,k as N,l as x,m as D,n as f,p as Q,q as c,s as b,t as W,v as G,x as J,a as I,y as K,z as O,A as X}from"./index-1c68082f.js";import{a as S}from"./axios-b2dce398.js";const Z=v=>(O("data-v-d4c112e2"),v=v(),X(),v),q=Z(()=>I("p",{class:"text-center my-4"},"Save Your User Name And Password",-1)),ee="Sign Up",ae={__name:"Auth",setup(v){const{query:o}=F(),L=T(),w=H(),C=n(ee),_=n("admin@gmail.com"),d=n("password"),V=n(""),k=n(""),g=n(),r=n(!1),P=n(!0),A=n(!1),R=[l=>!!l||"Email is required",l=>/.+@.+\..+/.test(l)||"Email must be valid"],h=[l=>l.length>=8||"Password must be at least 8 characters"],i=M(()=>C.value),$=async()=>{await S.post("/admin/auth/login",{email:_.value,password:d.value}).then(async l=>{await w.setUser(l.data),L.push("/dashboard")})},B=async()=>{const l={name:V.value,password:d.value,confirmPassword:k.value};await S.patch(`admin/users/${o==null?void 0:o.user}/set-password`,l).then(e=>{var u;(e==null?void 0:e.status)===200&&((u=e==null?void 0:e.data)!=null&&u.isVerified)&&w.showSnackbar("Password Saved")})},U=async l=>{const{valid:e}=await g.value.validate();if(e){if(i.value==="Login"){await $();return}else if(i.value==="password_save"){await B();return}}};return Y(()=>o.mode,l=>{C.value=l||"Login",o.mode==="password_save"&&o!=null&&o.otp&&o.str&&o!=null&&o.user&&S.get(`admin/users/verify-password-link?str=${o.str}&otp=${o==null?void 0:o.otp}&user=${o==null?void 0:o.user}`).then(e=>{var u,a;(e==null?void 0:e.status)===200&&((a=(u=e==null?void 0:e.data)==null?void 0:u.user)!=null&&a._id)?(w.showSnackbar("Link Verified"),A.value=!0):P.value=!1})},{immediate:!0}),(l,e)=>{const u=j("router-link");return p(),m(y,{onSubmit:z(U,["prevent"])},{default:s(()=>[t(K,null,{default:s(()=>[t(N,null,{default:s(()=>[t(x,{cols:"12",md:"6","offset-md":"3"},{default:s(()=>[t(D,{class:"text-center"},{default:s(()=>[f(" Welcome to Halal Explore ")]),_:1}),t(Q,null,{default:s(()=>[i.value==="Login"?(p(),m(y,{key:0,ref_key:"form",ref:g},{default:s(()=>[t(c,{modelValue:_.value,"onUpdate:modelValue":e[0]||(e[0]=a=>_.value=a),label:"Email",rules:R,required:"","prepend-inner-icon":"mdi-gmail"},null,8,["modelValue"]),t(c,{modelValue:d.value,"onUpdate:modelValue":e[1]||(e[1]=a=>d.value=a),label:"Password",type:"password",rules:h,"prepend-inner-icon":"mdi-lock",required:""},null,8,["modelValue"])]),_:1},512)):i.value==="password_save"&&A.value?(p(),m(y,{key:1,ref_key:"form",ref:g},{default:s(()=>[q,t(c,{modelValue:V.value,"onUpdate:modelValue":e[2]||(e[2]=a=>V.value=a),label:"Your Name",rules:[a=>!!a||"Name is required"],required:"","prepend-inner-icon":"mdi-account"},null,8,["modelValue","rules"]),t(c,{modelValue:d.value,"onUpdate:modelValue":e[3]||(e[3]=a=>d.value=a),label:"Password",type:r.value?"text":"password",rules:h,"prepend-inner-icon":"mdi-lock","append-inner-icon":"mdi-eye","onClick:appendInner":e[4]||(e[4]=a=>r.value=!r.value),required:""},null,8,["modelValue","type"]),t(c,{modelValue:k.value,"onUpdate:modelValue":e[5]||(e[5]=a=>k.value=a),type:r.value?"text":"password",label:"Confirm Password","prepend-inner-icon":"mdi-lock",rules:[...h,a=>a===d.value||"Passwords do not match"],"append-inner-icon":"mdi-eye","onClick:appendInner":e[6]||(e[6]=a=>r.value=!r.value),required:""},null,8,["modelValue","type","rules"])]),_:1},512)):b("",!0)]),_:1}),t(W,null,{default:s(()=>[t(N,null,{default:s(()=>[P.value?(p(),m(x,{key:0,cols:"12"},{default:s(()=>[t(G,{block:"",onClick:U,color:"primary",variant:"elevated","prepend-icon":"mdi-account"},{default:s(()=>{var a;return[f(J((a=i.value)==null?void 0:a.replaceAll("_"," ")),1)]}),_:1})]),_:1})):b("",!0),i.value==="Login"?(p(),m(x,{key:1,cols:"12"},{default:s(()=>[I("p",null,[f(" Forgot password? "),t(u,{to:"/authentication?mode=password_reset"},{default:s(()=>[f(" Reset here ")]),_:1})])]),_:1})):b("",!0)]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}}},te=E(ae,[["__scopeId","data-v-d4c112e2"]]);export{te as default};
