import { useState, useEffect } from "react";
import { INITIAL_REQUESTS, INITIAL_CANDIDATES } from "./data";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ServiceForm from "./pages/ServiceForm";
import MyRequests from "./pages/MyRequests";
import RequestDetail from "./pages/RequestDetail";
import HRQueue from "./pages/HRQueue";
import Analytics from "./pages/Analytics";
import CandidateForm from "./pages/CandidateForm";
import CandidateList from "./pages/CandidateList";
import CandidateDetail from "./pages/CandidateDetail";
import ApprovalsQueue from "./pages/ApprovalsQueue";

function load(key, fallback) {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
}

const DEFAULT_PAGES = {
  employee:      "home",
  manager:       "home",
  hr_specialist: "queue",
  hr_analyst:    "analytics",
  hr_director:   "queue",
  hr_subsidiary: "home",
  deputy_msb:    "approvals",
  deputy_rb:     "approvals",
  chairman:      "approvals",
  deputy_corp:   "approvals",
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [requests,   setRequests]   = useState(() => load("hr_requests",    INITIAL_REQUESTS));
  const [candidates, setCandidates] = useState(() => load("hr_candidates",  INITIAL_CANDIDATES));
  const [page,       setPage]       = useState("home");
  const [selectedSvc, setSelectedSvc] = useState(null);
  const [detailId,   setDetailId]   = useState(null);
  const [candDetailId, setCandDetailId] = useState(null);
  const [showCandForm, setShowCandForm] = useState(false);

  useEffect(() => { try { localStorage.setItem("hr_requests",   JSON.stringify(requests));   } catch {} }, [requests]);
  useEffect(() => { try { localStorage.setItem("hr_candidates", JSON.stringify(candidates)); } catch {} }, [candidates]);

  function login(user) {
    setCurrentUser(user);
    setPage(DEFAULT_PAGES[user.role] || "home");
  }

  function logout() {
    setCurrentUser(null);
    setPage("home");
    setDetailId(null);
    setCandDetailId(null);
    setSelectedSvc(null);
    setShowCandForm(false);
    try { localStorage.removeItem("hr_requests"); localStorage.removeItem("hr_candidates"); } catch {}
    setRequests(INITIAL_REQUESTS);
    setCandidates(INITIAL_CANDIDATES);
  }

  function nav(p) {
    setPage(p);
    setDetailId(null);
    setCandDetailId(null);
    setSelectedSvc(null);
    setShowCandForm(false);
  }

  if (!currentUser) return <Login onLogin={login} />;

  const role = currentUser.role;
  const isHR = role === "hr_specialist";
  const isAnalytics = ["hr_analyst", "hr_director"].includes(role);
  const isEmployee = ["employee", "manager"].includes(role);
  const isSubsidiary = role === "hr_subsidiary";
  const isDeputy = ["deputy_msb","deputy_rb","chairman"].includes(role);

  const myRequests = requests.filter(r => r.submitterId === currentUser.id);
  const detailReq  = detailId    ? requests.find(r => r.id === detailId)       : null;
  const detailCand = candDetailId ? candidates.find(c => c.id === candDetailId) : null;

  const wrap = (children) => (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter','Segoe UI',sans-serif", background: "#F4F6F5" }}>
      <Sidebar currentUser={currentUser} page={page} onNav={nav} onLogout={logout} />
      <div style={{ marginLeft: 236, flex: 1, padding: "32px 40px", boxSizing: "border-box", minHeight: "100vh" }}>
        {children}
      </div>
    </div>
  );

  // Deputy / Chairman — only see approvals
  if (isDeputy) {
    if (candDetailId && detailCand) return wrap(
      <CandidateDetail cand={detailCand} currentUser={currentUser}
        onBack={() => setCandDetailId(null)}
        onUpdate={ch => setCandidates(prev => prev.map(c => c.id === detailCand.id ? { ...c, ...ch } : c))} />
    );
    return wrap(
      <ApprovalsQueue currentUser={currentUser} candidates={candidates}
        onOpenDetail={id => setCandDetailId(id)} />
    );
  }

  // HR views
  if (isHR || isAnalytics) {
    if (page === "approvals") {
      if (candDetailId && detailCand) return wrap(
        <CandidateDetail cand={detailCand} currentUser={currentUser}
          onBack={() => setCandDetailId(null)}
          onUpdate={ch => setCandidates(prev => prev.map(c => c.id === detailCand.id ? { ...c, ...ch } : c))} />
      );
      return wrap(
        <ApprovalsQueue currentUser={currentUser} candidates={candidates}
          onOpenDetail={id => setCandDetailId(id)} />
      );
    }
    if (page === "analytics") return wrap(<Analytics currentUser={currentUser} requests={requests} />);
    if (page === "catalog" && !selectedSvc) return wrap(<Catalog currentUser={currentUser} onSelectService={s => { setSelectedSvc(s); setPage("form"); }} />);
    if (page === "form" && selectedSvc) return wrap(
      <ServiceForm service={selectedSvc} currentUser={currentUser} requests={requests}
        onSubmit={r => { setRequests(p => [r, ...p]); nav("queue"); }}
        onBack={() => { setSelectedSvc(null); setPage("catalog"); }} />
    );
    if (detailReq) return wrap(
      <RequestDetail request={detailReq} currentUser={currentUser}
        onBack={() => { setDetailId(null); setPage("queue"); }}
        onUpdate={ch => setRequests(prev => prev.map(r => r.id === detailReq.id ? { ...r, ...ch } : r))} />
    );
    return wrap(
      <HRQueue currentUser={currentUser} requests={requests}
        onOpenDetail={id => { setDetailId(id); }} />
    );
  }

  // Subsidiary HR
  if (isSubsidiary) {
    if (page === "candidates") {
      if (showCandForm) return wrap(
        <CandidateForm currentUser={currentUser} candidates={candidates}
          onSubmit={c => { setCandidates(p => [c, ...p]); setShowCandForm(false); }}
          onBack={() => setShowCandForm(false)} />
      );
      if (candDetailId && detailCand) return wrap(
        <CandidateDetail cand={detailCand} currentUser={currentUser}
          onBack={() => setCandDetailId(null)}
          onUpdate={ch => setCandidates(prev => prev.map(c => c.id === detailCand.id ? { ...c, ...ch } : c))} />
      );
      return wrap(
        <CandidateList currentUser={currentUser} candidates={candidates}
          onNew={() => setShowCandForm(true)}
          onOpenDetail={id => setCandDetailId(id)} />
      );
    }
    if (page === "catalog" && !selectedSvc) return wrap(<Catalog currentUser={currentUser} onSelectService={s => { setSelectedSvc(s); setPage("form"); }} />);
    if (page === "form" && selectedSvc?.id === "s18") return wrap(
      <CandidateForm currentUser={currentUser} candidates={candidates}
        onSubmit={c => { setCandidates(p => [c, ...p]); nav("candidates"); }}
        onBack={() => { setSelectedSvc(null); setPage("catalog"); }} />
    );
    if (page === "form" && selectedSvc) return wrap(
      <ServiceForm service={selectedSvc} currentUser={currentUser} requests={requests}
        onSubmit={r => { setRequests(p => [r, ...p]); nav("my"); }}
        onBack={() => { setSelectedSvc(null); setPage("catalog"); }} />
    );
    if (page === "my" && !detailReq) return wrap(
      <MyRequests currentUser={currentUser} requests={myRequests}
        onOpenDetail={id => setDetailId(id)} onNavigate={nav} />
    );
    if (detailReq) return wrap(
      <RequestDetail request={detailReq} currentUser={currentUser}
        onBack={() => setDetailId(null)}
        onUpdate={ch => setRequests(prev => prev.map(r => r.id === detailReq.id ? { ...r, ...ch } : r))} />
    );
    return wrap(
      <Home currentUser={currentUser} requests={myRequests} onNavigate={nav}
        onSelectService={s => { setSelectedSvc(s); setPage("form"); }}
        onOpenDetail={id => setDetailId(id)} />
    );
  }

  // Employee / Manager
  if (page === "catalog" && !selectedSvc) return wrap(<Catalog currentUser={currentUser} onSelectService={s => { setSelectedSvc(s); setPage("form"); }} />);
  if (page === "form" && selectedSvc) return wrap(
    <ServiceForm service={selectedSvc} currentUser={currentUser} requests={requests}
      onSubmit={r => { setRequests(p => [r, ...p]); nav("my"); }}
      onBack={() => { setSelectedSvc(null); setPage("catalog"); }} />
  );
  if (page === "my" && !detailReq) return wrap(
    <MyRequests currentUser={currentUser} requests={myRequests}
      onOpenDetail={id => setDetailId(id)} onNavigate={nav} />
  );
  if (detailReq) return wrap(
    <RequestDetail request={detailReq} currentUser={currentUser}
      onBack={() => setDetailId(null)}
      onUpdate={ch => setRequests(prev => prev.map(r => r.id === detailReq.id ? { ...r, ...ch } : r))} />
  );
  return wrap(
    <Home currentUser={currentUser} requests={myRequests} onNavigate={nav}
      onSelectService={s => { setSelectedSvc(s); setPage("form"); }}
      onOpenDetail={id => setDetailId(id)} />
  );
}
