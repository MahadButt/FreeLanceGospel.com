(this.webpackJsonpadmin_cogic=this.webpackJsonpadmin_cogic||[]).push([[13],{306:function(e,t,a){"use strict";a.d(t,"c",(function(){return n})),a.d(t,"d",(function(){return c})),a.d(t,"e",(function(){return l})),a.d(t,"b",(function(){return r})),a.d(t,"a",(function(){return u}));var n={UNREAD:0,READ:1},c={NORMAL:1,MAINTENANCE:2,LOCKDOWN:3},l={PENDING:0,ACTIVE:1,DISABLED:2},r="https://library-cdn.s3-us-west-1.amazonaws.com",u="https://thegospelpage.com/"},308:function(e,t,a){"use strict";var n=a(320),c=a.n(n),l=a(306),r=c.a.create({baseURL:"".concat(l.a,"api")});t.a=r},540:function(e,t,a){},559:function(e,t,a){"use strict";a.r(t);var n=a(315),c=a.n(n),l=a(316),r=a(43),u=a(0),s=a.n(u),o=a(558),i=a(299),m=a(303),E=a(545),d=a(35),p=a(308),f=a(29),b=a(343),h=a(555),v=a(301),g=a(556),C=a(63),O=a(561),j=a(363),k=a.n(j),A=a(306),N=function(e){var t=e.token,a=Object(u.useState)(null),n=Object(r.a)(a,2),m=n[0],E=n[1],d=Object(u.useState)(A.c.UNREAD),f=Object(r.a)(d,2),j=f[0],N=f[1],S=Object(u.useState)(null),R=Object(r.a)(S,2),w=R[0],x=R[1],D=Object(u.useState)(!1),y=Object(r.a)(D,2),z=y[0],U=y[1],H=Object(u.useState)(!1),I=Object(r.a)(H,2),B=(I[0],I[1]),M=Object(u.useState)(0),P=Object(r.a)(M,2),L=P[0],F=P[1],_=Object(u.useState)(null),G=Object(r.a)(_,2),J=G[0],T=G[1];Object(u.useEffect)((function(){function e(){return(e=Object(l.a)(c.a.mark((function e(){var a,n,l;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a=0,0!==L&&1!==L&&(a=10*L),e.next=5,p.a.get("/admin/contact/?status=".concat(j,"&limit=").concat(10,"&offset=").concat(a),{headers:{Authorization:"Bearer ".concat(t)}});case 5:n=e.sent,l=n.data,E(l.msgs),T(Math.floor(l.count/10)),B(!0),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(0),console.log(e.t0);case 15:case"end":return e.stop()}}),e,null,[[0,12]])})))).apply(this,arguments)}!function(){e.apply(this,arguments)}()}),[j]);var K=function(){var e=Object(l.a)(c.a.mark((function e(a){var n;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,x(m[a]),U(!0),e.next=5,p.a.patch("/admin/contact-status/".concat(m[a].id),{status:A.c.READ},{headers:{Authorization:"Bearer ".concat(t)}});case 5:e.sent&&((n=Object(b.a)(m))[a].status=A.c.READ,E(n)),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(0),console.log(e.t0);case 12:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(t){return e.apply(this,arguments)}}();return s.a.createElement(u.Fragment,null,m?s.a.createElement("div",{className:"ContactMsg"},w&&s.a.createElement(h.a,{open:z,onClose:function(){x(null),U(!1)}},s.a.createElement(h.a.Header,null,w.name," (",w.email,")"),s.a.createElement(h.a.Content,null,s.a.createElement(h.a.Description,null,s.a.createElement("p",{style:{fontSize:"18px",lineHeight:"1.7"}},w.message))),s.a.createElement(h.a.Actions,null,s.a.createElement("span",{className:"util-bold"},"Received: ",k()(w.created_at).fromNow()))),s.a.createElement(o.a,{size:"huge",dividing:!0},"Messages"),s.a.createElement("div",null,s.a.createElement(v.a.Group,{style:{marginBottom:"20px"},floated:"right"},s.a.createElement(v.a,{onClick:function(){return N(A.c.UNREAD)}},"Unread"),s.a.createElement(v.a.Or,null),s.a.createElement(v.a,{onClick:function(){return N(A.c.READ)}},"Read")),s.a.createElement(g.a,{celled:!0},s.a.createElement(g.a.Header,null,s.a.createElement(g.a.Row,null,s.a.createElement(g.a.HeaderCell,null,"Name"),s.a.createElement(g.a.HeaderCell,null,"Email"),s.a.createElement(g.a.HeaderCell,null,"Status"),s.a.createElement(g.a.HeaderCell,null,"Action"))),s.a.createElement(g.a.Body,null,m.length>0?m.map((function(e,t){return s.a.createElement(g.a.Row,{key:e.id},s.a.createElement(g.a.Cell,null,e.name),s.a.createElement(g.a.Cell,null,e.email),s.a.createElement(g.a.Cell,null,e.status===A.c.UNREAD?s.a.createElement(C.a,{color:"red"},"Unread"):s.a.createElement(C.a,{color:"green"},"Read")),s.a.createElement(g.a.Cell,null,s.a.createElement(v.a,{primary:!0,compact:!0,onClick:function(){return K(t)}},"Open")))})):s.a.createElement(g.a.Row,null,s.a.createElement(g.a.Cell,null,"No Unread Messages!"))),J>1&&s.a.createElement(g.a.Footer,null,s.a.createElement(g.a.Row,null,s.a.createElement(g.a.HeaderCell,{colSpan:"3"},s.a.createElement(O.a,{firstItem:null,lastItem:null,prevItem:null,nextItem:null,activePage:L,totalPages:J,onPageChange:function(e,t){var a=t.activePage;return F(a)}}))))))):s.a.createElement(i.a,{active:!0,inline:!0,size:"large"}))};a(540),t.default=function(e){var t=Object(u.useContext)(f.a),a=Object(u.useState)([]),n=Object(r.a)(a,2),b=n[0],h=n[1],v=Object(u.useState)([]),g=Object(r.a)(v,2),C=g[0],O=g[1];return Object(u.useEffect)((function(){function e(){return(e=Object(l.a)(c.a.mark((function e(){var a,n;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,p.a.get("/admin/stats",{headers:{Authorization:"Bearer ".concat(t.admin.token)}});case 3:a=e.sent,n=a.data,h(n),O(!0),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(0),console.log(e.t0);case 12:case"end":return e.stop()}}),e,null,[[0,9]])})))).apply(this,arguments)}!function(){e.apply(this,arguments)}()}),[]),s.a.createElement("div",{className:"Stats padded-content"},s.a.createElement(o.a,{size:"huge",dividing:!0},"Site Stats"),C?s.a.createElement(m.a,{stackable:!0,columns:"3"},s.a.createElement(m.a.Column,null,s.a.createElement(E.a,null,s.a.createElement(o.a,{as:"h2",size:"medium"},s.a.createElement(d.a,{name:"users"}),s.a.createElement(o.a.Content,null,b.userCount," Users")))),s.a.createElement(m.a.Column,null,s.a.createElement(E.a,null,s.a.createElement(o.a,{as:"h2",size:"medium"},s.a.createElement(d.a,{name:"book"}),s.a.createElement(o.a.Content,null,b.storyCount," Stories")))),s.a.createElement(m.a.Column,null,s.a.createElement(E.a,null,s.a.createElement(o.a,{as:"h2",size:"medium"},s.a.createElement(d.a,{name:"discussions icon"}),s.a.createElement(o.a.Content,null,b.forumCount," Forum Posts"))))):s.a.createElement(i.a,{size:"medium",active:!0}),s.a.createElement("div",{className:"Stats--msg"},s.a.createElement(N,{token:t.admin.token})))}}}]);
//# sourceMappingURL=13.58c9c91a.chunk.js.map