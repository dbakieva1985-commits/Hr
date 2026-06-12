import { useState, useEffect } from "react";
import { INITIAL_REQUESTS } from "./data";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ServiceForm from "./pages/ServiceForm";
import MyRequests from "./pages/MyRequests";
import RequestDetail from "./pages/RequestDetail";
import HRQueue from "./pages/HRQueue";
import Analytics from "./pages/Analytics";

function loadRequests() {
  try {
    const saved = localStorage.getItem('hr_portal_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  } catch {
    return INITIAL_REQUESTS;
  }
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [requests, setRequests] = useState(loadRequests);
  const [page, setPage] = useState("home");
  const [selectedService, setSelectedService] = useState(null);
  const [detailId, setDetailId] = useState(null);

  useEffect(() => {
    try { localStorage.setItem('hr_portal_requests', JSON.stringify(requests)); } catch {}
  }, [requests]);

  if (!currentUser) {
    return <Login onLogin={(user) => {
      setCurrentUser(user);
      const role = user.role;
      if (role === 'hr_specialist') setPage('queue');
      else if (role === 'hr_analyst' || role === 'hr_director') setPage('analytics');
      else setPage('home');
    }} />;
  }

  const role = currentUser.role;
  const isHR = role === 'hr_specialist';
  const isAnalytics = role === 'hr_analyst' || role === 'hr_director';
  const isEmployee = !isHR && !isAnalytics;

  function updateRequest(id, changes) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, ...changes } : r));
  }

  function addRequest(req) {
    setRequests(prev => [req, ...prev]);
  }

  function nav(p) {
    setPage(p);
    setDetailId(null);
    setSelectedService(null);
  }

  function logout() {
    setCurrentUser(null);
    setPage("home");
    setDetailId(null);
    setSelectedService(null);
    // Reset to fresh data
    const fresh = INITIAL_REQUESTS;
    setRequests(fresh);
    try { localStorage.removeItem('hr_portal_requests'); } catch {}
  }

  const detailReq = detailId ? requests.find(r => r.id === detailId) : null;
  const myRequests = requests.filter(r => r.submitterId === currentUser.id);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#F7F8FA" }}>
      <Sidebar
        currentUser={currentUser}
        page={page}
        onNav={nav}
        onLogout={logout}
      />

      <div style={{ marginLeft: 220, flex: 1, padding: "32px 40px", maxWidth: "calc(100vw - 220px)", boxSizing: "border-box" }}>

        {/* ── EMPLOYEE / MANAGER VIEWS ── */}
        {isEmployee && page === "home" && !detailReq && (
          <Home
            currentUser={currentUser}
            requests={myRequests}
            onNavigate={nav}
            onSelectService={s => { setSelectedService(s); setPage("form"); }}
            onOpenDetail={id => { setDetailId(id); setPage("detail"); }}
          />
        )}

        {page === "catalog" && !selectedService && (
          <Catalog
            currentUser={currentUser}
            onSelectService={s => { setSelectedService(s); setPage("form"); }}
          />
        )}

        {page === "form" && selectedService && (
          <ServiceForm
            service={selectedService}
            currentUser={currentUser}
            requests={requests}
            onSubmit={req => { addRequest(req); nav("my"); }}
            onBack={() => { setSelectedService(null); setPage("catalog"); }}
          />
        )}

        {isEmployee && page === "my" && !detailReq && (
          <MyRequests
            currentUser={currentUser}
            requests={myRequests}
            onOpenDetail={id => { setDetailId(id); setPage("detail"); }}
            onNavigate={nav}
          />
        )}

        {page === "detail" && detailReq && (
          <RequestDetail
            request={detailReq}
            currentUser={currentUser}
            onBack={() => { setDetailId(null); setPage(isHR ? "queue" : "my"); }}
            onUpdate={changes => updateRequest(detailReq.id, changes)}
          />
        )}

        {/* ── HR SPECIALIST VIEWS ── */}
        {isHR && page === "queue" && !detailReq && (
          <HRQueue
            currentUser={currentUser}
            requests={requests}
            onOpenDetail={id => { setDetailId(id); setPage("detail"); }}
          />
        )}

        {/* ── ANALYTICS VIEWS ── */}
        {(isAnalytics || isHR) && page === "analytics" && (
          <Analytics
            currentUser={currentUser}
            requests={requests}
          />
        )}

        {/* Default fallbacks */}
        {isHR && page === "home" && !detailReq && (
          <HRQueue
            currentUser={currentUser}
            requests={requests}
            onOpenDetail={id => { setDetailId(id); setPage("detail"); }}
          />
        )}
        {isAnalytics && page === "home" && (
          <Analytics currentUser={currentUser} requests={requests} />
        )}
      </div>
    </div>
  );
}
